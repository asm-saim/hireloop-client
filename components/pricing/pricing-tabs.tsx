"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import {
  CancelSubscriptionButton,
  PlanButton,
} from "@/components/billing/plan-actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { recruiterPlans, seekerPlans, type Plan } from "@/lib/pricing"

type Audience = "seekers" | "recruiters"

export type PricingViewer = {
  role: "guest" | "seeker" | "recruiter" | "admin"
  /** Current plan id: "free", "pro", "growth"… */
  plan: string
  /** "canceling" when a paid plan is set to end at the period end. */
  status?: string
}

const tabs: { id: Audience; label: string }[] = [
  { id: "seekers", label: "For Job Seekers" },
  { id: "recruiters", label: "For Recruiters" },
]

const disabledClass = "h-[55px] w-full justify-center px-6 text-base"

function PlanAction({
  plan,
  audience,
  plans,
  viewer,
}: {
  plan: Plan
  audience: Audience
  plans: Plan[]
  viewer: PricingViewer
}) {
  const id = plan.name.toLowerCase()
  const variant = plan.featured ? "light" : "secondary"
  const base =
    "h-[55px] w-full justify-between px-6 text-base tracking-[-0.02em]"

  if (viewer.role === "guest") {
    return (
      <Button
        variant={variant}
        render={<Link href="/register" />}
        nativeButton={false}
        className={base}
      >
        {plan.price === 0 ? "Get started free" : "Choose this plan"}
        <ArrowRight aria-hidden className="size-6" />
      </Button>
    )
  }
  if (viewer.role === "admin") {
    return (
      <Button variant="secondary" disabled className={disabledClass}>
        Admin accounts can&apos;t subscribe
      </Button>
    )
  }
  const mine = (audience === "seekers") === (viewer.role === "seeker")
  if (!mine) {
    return (
      <Button variant="secondary" disabled className={disabledClass}>
        {audience === "seekers"
          ? "For job seeker accounts"
          : "For recruiter accounts"}
      </Button>
    )
  }

  const rank = (name: string) =>
    plans.findIndex((p) => p.name.toLowerCase() === name)
  const current = viewer.plan
  if (id === current) {
    return (
      <Button variant="secondary" disabled className={disabledClass}>
        {viewer.status === "canceling"
          ? "Current plan (ends soon)"
          : "Current plan"}
      </Button>
    )
  }
  if (plan.price === 0) {
    // Back to Free = cancel at period end.
    return viewer.status === "canceling" ? (
      <Button variant="secondary" disabled className={disabledClass}>
        Moving to Free at period end
      </Button>
    ) : (
      <CancelSubscriptionButton
        label="Downgrade to Free"
        variant="secondary"
        className={disabledClass}
      />
    )
  }
  const label =
    current === "free"
      ? "Choose this plan"
      : rank(id) > rank(current)
        ? `Upgrade to ${plan.name}`
        : `Switch to ${plan.name}`
  return (
    <PlanButton plan={id} label={label} variant={variant} className={base} />
  )
}

function PlanCard({
  plan,
  audience,
  plans,
  viewer,
}: {
  plan: Plan
  audience: Audience
  plans: Plan[]
  viewer: PricingViewer
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col justify-between gap-10 rounded-3xl border p-6",
        plan.featured
          ? "border-white/20 bg-surface shadow-[inset_0_0_32px_rgb(120_120_120/0.25)]"
          : "border-[#f6efe1]/20 bg-ink"
      )}
    >
      <div className="flex flex-col gap-8">
        <header className="flex items-center justify-between gap-4">
          <h3 className="font-jakarta text-2xl tracking-[-0.02em] text-white">
            {plan.name}
          </h3>
          {plan.featured && (
            <span className="rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
              Most popular
            </span>
          )}
        </header>
        <p className="flex items-end gap-1 text-white">
          <span className="font-jakarta text-5xl leading-none font-semibold tracking-[-0.05em]">
            ${plan.price}
          </span>
          <span className="pb-1 font-tight text-sm text-white/80">
            /{plan.period}
          </span>
        </p>
        <ul className="flex flex-col gap-4">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border border-[#f6efe1]/10 bg-[#595959]/30">
                <Check aria-hidden className="size-4 text-white" />
              </span>
              <span className="text-base leading-[1.6] text-white">{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <PlanAction
        plan={plan}
        audience={audience}
        plans={plans}
        viewer={viewer}
      />
    </article>
  )
}

export function PricingTabs({ viewer }: { viewer: PricingViewer }) {
  const [audience, setAudience] = useState<Audience>(
    viewer.role === "recruiter" ? "recruiters" : "seekers"
  )
  const plans = audience === "seekers" ? seekerPlans : recruiterPlans

  return (
    <div className="flex flex-col items-center gap-10">
      <div
        role="group"
        aria-label="Pricing audience"
        className="flex rounded-full border border-[#f6f6f6]/10 bg-white/15 p-2"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={audience === t.id}
            onClick={() => setAudience(t.id)}
            className={cn(
              "h-[43px] rounded-full px-4 font-tight text-base font-medium tracking-[-0.02em] transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-6 sm:text-lg",
              audience === t.id
                ? "bg-white text-ink"
                : "text-white hover:bg-white/10"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid w-full gap-4 lg:grid-cols-3 lg:gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={`${audience}-${plan.name}`}
            plan={plan}
            audience={audience}
            plans={plans}
            viewer={viewer}
          />
        ))}
      </div>
    </div>
  )
}
