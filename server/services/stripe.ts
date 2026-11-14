import "server-only"

import Stripe from "stripe"

import { recruiterPlans, seekerPlans } from "@/lib/pricing"

export type PaidPlan = "pro" | "premium" | "growth" | "enterprise"
export type BillingRole = "seeker" | "recruiter"

const entries = [
  ...seekerPlans.map((p) => [p, "seeker"] as const),
  ...recruiterPlans.map((p) => [p, "recruiter"] as const),
]
  .filter(([p]) => p.price > 0)
  .map(
    ([p, role]) =>
      [p.name.toLowerCase(), { role, label: p.name, price: p.price }] as const
  )

/** Paid plans, derived from lib/pricing.ts so prices are defined in one place. */
export const PAID_PLANS = Object.fromEntries(entries) as Record<
  PaidPlan,
  { role: BillingRole; label: string; price: number }
>

export function isPaidPlan(x: unknown): x is PaidPlan {
  return typeof x === "string" && x in PAID_PLANS
}

export class BillingNotConfiguredError extends Error {
  constructor() {
    super("Payments aren't set up yet. Add STRIPE_SECRET_KEY to .env.local.")
  }
}

let stripe: Stripe | undefined

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new BillingNotConfiguredError()
  // STRIPE_API_HOST/PORT/PROTOCOL only exist to point tests at stripe-mock.
  const host = process.env.STRIPE_API_HOST
  return (stripe ??= new Stripe(
    key,
    host
      ? {
          host,
          port: process.env.STRIPE_API_PORT ?? "12111",
          protocol:
            (process.env.STRIPE_API_PROTOCOL as "http" | "https") ?? "http",
        }
      : undefined
  ))
}

export function appUrl() {
  return (
    process.env.APP_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "")
}

/** Inline price so no Price objects need to be created in the Stripe dashboard. */
export function priceData(plan: PaidPlan) {
  const p = PAID_PLANS[plan]
  return {
    currency: "usd",
    unit_amount: p.price * 100,
    recurring: { interval: "month" as const },
    product_data: {
      name: `HireLoop ${p.label} (${p.role === "seeker" ? "Job Seeker" : "Recruiter"})`,
    },
  }
}
