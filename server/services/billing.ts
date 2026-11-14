import "server-only"

import type Stripe from "stripe"

import { getDb } from "@/lib/db"
import type { SessionUser } from "@/lib/session"
import type { PaymentDoc, SubscriptionDoc } from "@/server/models"
import { getUserById } from "@/server/repositories/admin"
import {
  PAID_PLANS,
  appUrl,
  getStripe,
  isPaidPlan,
  priceData,
  type PaidPlan,
} from "@/server/services/stripe"

export class BillingError extends Error {}

// ---------- persistence (all idempotent) ----------

export async function getSubscription(userId: string) {
  const db = await getDb()
  return db
    .collection<SubscriptionDoc>("subscriptions")
    .findOne({ _id: userId })
}

export async function activatePlan(input: {
  userId: string
  plan: PaidPlan
  customerId?: string
  subscriptionId?: string
  currentPeriodEnd?: Date
  cancelAtPeriodEnd?: boolean
}) {
  const db = await getDb()
  await db.collection<SubscriptionDoc>("subscriptions").updateOne(
    { _id: input.userId },
    {
      $set: {
        plan: input.plan,
        status: input.cancelAtPeriodEnd ? "canceling" : "active",
        updatedAt: new Date(),
        ...(input.customerId ? { stripeCustomerId: input.customerId } : {}),
        ...(input.subscriptionId
          ? { stripeSubscriptionId: input.subscriptionId }
          : {}),
        ...(input.currentPeriodEnd
          ? { currentPeriodEnd: input.currentPeriodEnd }
          : {}),
      },
    },
    { upsert: true }
  )
}

export async function downgradeToFree(userId: string) {
  const db = await getDb()
  await db.collection<SubscriptionDoc>("subscriptions").updateOne(
    { _id: userId },
    {
      $set: { plan: "free", status: "canceled", updatedAt: new Date() },
      $unset: { stripeSubscriptionId: "", currentPeriodEnd: "" },
    },
    { upsert: true }
  )
}

/** The Stripe invoice id is the primary key, so replays can never double-count. */
export async function recordPayment(input: {
  userId: string
  email: string
  plan: PaidPlan
  amount: number
  transactionId: string
  createdAt?: Date
}) {
  const db = await getDb()
  try {
    await db.collection<PaymentDoc>("payments").insertOne({
      _id: input.transactionId,
      userId: input.userId,
      email: input.email,
      plan: input.plan,
      amount: input.amount,
      transactionId: input.transactionId,
      status: "succeeded",
      createdAt: input.createdAt ?? new Date(),
    })
    return true
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return false
    throw e
  }
}

async function userIdForSubscription(subscriptionId: string) {
  const db = await getDb()
  const doc = await db
    .collection<SubscriptionDoc>("subscriptions")
    .findOne({ stripeSubscriptionId: subscriptionId })
  return doc?._id
}

// ---------- reading Stripe objects defensively (API shapes changed over time) ----------

type Meta = Record<string, string> | null | undefined

function invoiceInfo(inv: Stripe.Invoice) {
  const x = inv as unknown as {
    subscription?: string | { id: string }
    subscription_details?: { metadata?: Meta }
    parent?: {
      subscription_details?: {
        metadata?: Meta
        subscription?: string | { id: string }
      }
    }
  }
  const meta =
    x.parent?.subscription_details?.metadata ??
    x.subscription_details?.metadata ??
    {}
  const sub = x.parent?.subscription_details?.subscription ?? x.subscription
  return {
    meta: meta ?? {},
    subscriptionId: typeof sub === "string" ? sub : sub?.id,
  }
}

function periodEnd(sub: Stripe.Subscription) {
  const x = sub as unknown as {
    current_period_end?: number
    items?: { data?: { current_period_end?: number }[] }
  }
  const ts = x.items?.data?.[0]?.current_period_end ?? x.current_period_end
  return ts ? new Date(ts * 1000) : undefined
}

// ---------- Stripe event handling (called by the webhook) ----------

async function recordInvoice(inv: Stripe.Invoice) {
  if (!inv.id || !inv.amount_paid) return
  const { meta, subscriptionId } = invoiceInfo(inv)
  const userId =
    meta.userId ??
    (subscriptionId ? await userIdForSubscription(subscriptionId) : undefined)
  if (!userId || !isPaidPlan(meta.plan)) return
  await recordPayment({
    userId,
    // Prefer the platform account's email over whatever Stripe has on file.
    email: (await getUserById(userId))?.email ?? inv.customer_email ?? "",
    plan: meta.plan,
    amount: inv.amount_paid / 100,
    transactionId: inv.id,
    createdAt: inv.created ? new Date(inv.created * 1000) : undefined,
  })
}

async function syncSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.userId ?? (await userIdForSubscription(sub.id))
  if (!userId) return
  const plan = sub.metadata?.plan
  if (sub.status === "canceled") return downgradeToFree(userId)
  if (!isPaidPlan(plan)) return
  await activatePlan({
    userId,
    plan,
    customerId:
      typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
    subscriptionId: sub.id,
    currentPeriodEnd: periodEnd(sub),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
  })
}

async function applyCheckoutSession(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const plan = session.metadata?.plan
  if (!userId || !isPaidPlan(plan)) return null
  if (session.status !== "complete") return null
  if (
    session.payment_status !== "paid" &&
    session.payment_status !== "no_payment_required"
  )
    return null

  const sub = session.subscription
  await activatePlan({
    userId,
    plan,
    customerId:
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id,
    subscriptionId: typeof sub === "string" ? sub : sub?.id,
  })
  return { userId, plan }
}

export async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      await applyCheckoutSession(event.data.object)
      break
    case "invoice.paid":
      await recordInvoice(event.data.object)
      break
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncSubscription(event.data.object)
      break
    default:
      break
  }
}

// ---------- user-facing operations ----------

/** One Stripe Product per plan, created on first use and remembered. */
async function ensureProductId(plan: PaidPlan) {
  const db = await getDb()
  const col = db.collection<{ _id: string; productId: string }>(
    "stripe_products"
  )
  const found = await col.findOne({ _id: plan })
  if (found) return found.productId
  const product = await getStripe().products.create({
    name: priceData(plan).product_data.name,
    metadata: { plan },
  })
  await col.updateOne(
    { _id: plan },
    { $setOnInsert: { productId: product.id } },
    { upsert: true }
  )
  return (await col.findOne({ _id: plan }))!.productId
}

function assertRole(user: SessionUser, plan: PaidPlan) {
  if (user.role !== PAID_PLANS[plan].role)
    throw new BillingError(
      `The ${PAID_PLANS[plan].label} plan is only for ${PAID_PLANS[plan].role === "seeker" ? "job seeker" : "recruiter"} accounts.`
    )
}

/** New subscription: returns the Stripe Checkout URL to send the user to. */
export async function createCheckoutUrl(user: SessionUser, plan: PaidPlan) {
  assertRole(user, plan)
  const stripe = getStripe()
  const existing = await getSubscription(user.id)
  const base = appUrl()
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ quantity: 1, price_data: priceData(plan) }],
    client_reference_id: user.id,
    ...(existing?.stripeCustomerId
      ? { customer: existing.stripeCustomerId }
      : { customer_email: user.email }),
    metadata: { userId: user.id, plan },
    subscription_data: { metadata: { userId: user.id, plan } },
    success_url: `${base}/dashboard/${user.role}/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/pricing?checkout=cancelled`,
  })
  if (!session.url)
    throw new BillingError(
      "Stripe didn't return a checkout link. Please try again."
    )
  return session.url
}

/** Switch an existing paid subscription to another plan, prorated by Stripe. */
export async function changePlan(user: SessionUser, plan: PaidPlan) {
  assertRole(user, plan)
  const existing = await getSubscription(user.id)
  if (!existing?.stripeSubscriptionId || existing.status === "canceled")
    throw new BillingError("You don't have an active subscription to change.")
  const stripe = getStripe()
  const sub = await stripe.subscriptions.retrieve(existing.stripeSubscriptionId)
  const item = sub.items.data[0]
  if (!item) throw new BillingError("Couldn't find your subscription item.")
  const { unit_amount, currency, recurring } = priceData(plan)
  const updated = await stripe.subscriptions.update(sub.id, {
    items: [
      {
        id: item.id,
        price_data: {
          currency,
          unit_amount,
          recurring,
          product: await ensureProductId(plan),
        },
      },
    ],
    proration_behavior: "create_prorations",
    cancel_at_period_end: false,
    metadata: { userId: user.id, plan },
  })
  await activatePlan({
    userId: user.id,
    plan,
    subscriptionId: updated.id,
    currentPeriodEnd: periodEnd(updated),
  })
}

/** Keep the paid plan until the period ends, then fall back to Free. */
export async function cancelAtPeriodEnd(user: SessionUser) {
  const existing = await getSubscription(user.id)
  if (!existing?.stripeSubscriptionId || existing.status === "canceled")
    throw new BillingError("You don't have an active subscription.")
  const stripe = getStripe()
  const updated = await stripe.subscriptions.update(
    existing.stripeSubscriptionId,
    {
      cancel_at_period_end: true,
    }
  )
  const db = await getDb()
  await db.collection<SubscriptionDoc>("subscriptions").updateOne(
    { _id: user.id },
    {
      $set: {
        status: "canceling",
        updatedAt: new Date(),
        ...(periodEnd(updated) ? { currentPeriodEnd: periodEnd(updated) } : {}),
      },
    }
  )
}

/**
 * Called when the user returns from Checkout. Verifies the session with Stripe
 * (so it works even before the webhook arrives) and activates the plan.
 */
export async function confirmCheckoutSession(
  user: SessionUser,
  sessionId: string
) {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.metadata?.userId !== user.id)
    throw new BillingError(
      "This checkout session doesn't belong to your account."
    )
  const applied = await applyCheckoutSession(session)
  if (!applied) throw new BillingError("The payment hasn't completed yet.")

  const invoiceId =
    typeof session.invoice === "string" ? session.invoice : session.invoice?.id
  if (invoiceId) await recordInvoice(await stripe.invoices.retrieve(invoiceId))
  return applied.plan
}
