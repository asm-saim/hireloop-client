/** `null` means unlimited. Numbers come straight from the product spec. */
export type SeekerPlan = "free" | "pro" | "premium"
export type RecruiterPlan = "free" | "growth" | "enterprise"

export const SEEKER_LIMITS: Record<
  SeekerPlan,
  { applicationsPerMonth: number | null; savedJobs: number | null }
> = {
  free: { applicationsPerMonth: 3, savedJobs: 10 },
  pro: { applicationsPerMonth: 30, savedJobs: null },
  premium: { applicationsPerMonth: null, savedJobs: null },
}

export const RECRUITER_LIMITS: Record<RecruiterPlan, { activeJobs: number }> = {
  free: { activeJobs: 3 },
  growth: { activeJobs: 10 },
  enterprise: { activeJobs: 50 },
}

export const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  premium: "Premium",
  growth: "Growth",
  enterprise: "Enterprise",
}

export function normalizeSeekerPlan(plan: unknown): SeekerPlan {
  return plan === "pro" || plan === "premium" ? plan : "free"
}
