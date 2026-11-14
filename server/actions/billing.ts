"use server"

import { revalidatePath } from "next/cache"

import { getSessionUser, type SessionUser } from "@/lib/session"
import {
  BillingError,
  cancelAtPeriodEnd,
  changePlan,
  confirmCheckoutSession,
  createCheckoutUrl,
  getSubscription,
} from "@/server/services/billing"
import {
  BillingNotConfiguredError,
  isPaidPlan,
  PAID_PLANS,
} from "@/server/services/stripe"

type Fail = { ok: false; error: string }

async function payer(): Promise<{ user: SessionUser } | Fail> {
  const user = await getSessionUser()
  if (!user) return { ok: false, error: "Please sign in to continue." }
  if (user.role === "admin")
    return { ok: false, error: "Admin accounts don't have subscriptions." }
  return { user }
}

function friendly(e: unknown): Fail {
  if (e instanceof BillingError || e instanceof BillingNotConfiguredError)
    return { ok: false, error: e.message }
  console.error("[billing]", e)
  return {
    ok: false,
    error: "We couldn't reach the payment provider. Please try again.",
  }
}

const refresh = () => {
  revalidatePath("/dashboard/seeker", "layout")
  revalidatePath("/dashboard/recruiter", "layout")
  revalidatePath("/pricing")
}

/** New subscription -> Stripe Checkout. Existing subscription -> prorated switch. */
export async function changePlanAction(
  plan: string
): Promise<
  | { ok: true; mode: "checkout"; url: string }
  | { ok: true; mode: "changed"; label: string }
  | Fail
> {
  const auth = await payer()
  if ("ok" in auth) return auth
  if (!isPaidPlan(plan)) return { ok: false, error: "Unknown plan." }
  try {
    const sub = await getSubscription(auth.user.id)
    if (sub?.stripeSubscriptionId && sub.status !== "canceled") {
      await changePlan(auth.user, plan)
      refresh()
      return { ok: true, mode: "changed", label: PAID_PLANS[plan].label }
    }
    return {
      ok: true,
      mode: "checkout",
      url: await createCheckoutUrl(auth.user, plan),
    }
  } catch (e) {
    return friendly(e)
  }
}

export async function cancelSubscriptionAction(): Promise<{ ok: true } | Fail> {
  const auth = await payer()
  if ("ok" in auth) return auth
  try {
    await cancelAtPeriodEnd(auth.user)
    refresh()
    return { ok: true }
  } catch (e) {
    return friendly(e)
  }
}

export async function confirmCheckoutAction(
  sessionId: string
): Promise<{ ok: true; label: string } | Fail> {
  const auth = await payer()
  if ("ok" in auth) return auth
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId))
    return { ok: false, error: "Invalid checkout session." }
  try {
    const plan = await confirmCheckoutSession(auth.user, sessionId)
    refresh()
    return { ok: true, label: PAID_PLANS[plan].label }
  } catch (e) {
    return friendly(e)
  }
}
