"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Crown, Rocket, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FadeIn, Stagger, StaggerItem } from "@/components/site/motion"
import { SectionHeading } from "@/components/site/section-heading"
import { cn } from "@/lib/utils"

const YEARLY_DISCOUNT = 0.25

const plans = [
  {
    name: "Starter",
    icon: Rocket,
    monthly: 0,
    featured: false,
    intro: "Start building your insights hub:",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1‑click apply, unlimited",
    ],
  },
  {
    name: "Growth",
    icon: TrendingUp,
    monthly: 17,
    featured: true,
    intro: "Start building your insights hub:",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1‑click apply, unlimited",
    ],
  },
  {
    name: "Premium",
    icon: Crown,
    monthly: 99,
    featured: false,
    intro: "Start building your insights hub:",
    features: [
      "Everything in Growth",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(false)
  const price = (monthly: number) =>
    yearly ? Math.round(monthly * (1 - YEARLY_DISCOUNT)) : monthly

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 sm:py-24 lg:py-[120px] xl:px-[60px]"
    >
      <FadeIn>
        <SectionHeading
          eyebrow="Pricing"
          title="Pay for the leverage, not the listings"
        />
      </FadeIn>

      <div className="mx-auto mt-12 flex max-w-[1320px] flex-col items-center gap-6 sm:mt-16">
        {/* Billing toggle */}
        <div
          role="group"
          aria-label="Billing period"
          className="flex rounded-full border border-[#f6f6f6]/10 bg-white/15 p-2"
        >
          <button
            type="button"
            aria-pressed={!yearly}
            onClick={() => setYearly(false)}
            className={cn(
              "h-[43px] rounded-full px-4 font-tight text-lg font-medium tracking-[-0.02em] transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              !yearly ? "bg-white text-ink" : "text-white hover:bg-white/10"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={yearly}
            onClick={() => setYearly(true)}
            className={cn(
              "flex h-[43px] items-center gap-2 rounded-full px-4 font-tight text-lg font-medium tracking-[-0.02em] transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              yearly ? "bg-white text-ink" : "text-white hover:bg-white/10"
            )}
          >
            Yearly
            <Badge variant="pink" className="font-geist text-base">
              25%
            </Badge>
          </button>
        </div>

        <Stagger className="grid w-full gap-4 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <StaggerItem key={plan.name} hover className="h-full">
                <article
                  className={cn(
                    "flex h-full flex-col justify-between gap-12 rounded-3xl border p-6",
                    plan.featured
                      ? "border-white/20 bg-surface shadow-[inset_0_0_32px_rgb(120_120_120/0.25)]"
                      : "border-[#f6efe1]/20 bg-ink"
                  )}
                >
                  <div className="flex flex-col gap-8">
                    <header className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="grid size-10 place-items-center rounded-lg border border-[#595959]/40">
                          <Icon aria-hidden className="size-6 text-white" />
                        </span>
                        <h3 className="font-jakarta text-2xl leading-[1.4] tracking-[-0.02em] text-white">
                          {plan.name}
                        </h3>
                      </div>
                      <p className="flex items-end gap-1 text-white">
                        <span className="font-jakarta text-4xl leading-[1.2] font-semibold tracking-[-0.05em] sm:text-[40px]">
                          ${price(plan.monthly)}
                        </span>
                        <span className="pb-1.5 font-tight text-sm text-white/80">
                          /month
                        </span>
                      </p>
                    </header>

                    <div className="flex flex-col gap-3">
                      <p className="font-tight text-lg font-medium text-white">
                        {plan.intro}
                      </p>
                      <ul className="flex flex-col gap-4">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-3">
                            <span className="grid size-6 shrink-0 place-items-center rounded-md border border-[#f6efe1]/10 bg-[#595959]/30">
                              <Check
                                aria-hidden
                                className="size-4 text-white"
                              />
                            </span>
                            <span className="text-base leading-[1.7] text-white">
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    variant={plan.featured ? "light" : "secondary"}
                    render={<Link href="/register" />}
                    nativeButton={false}
                    className="h-[55px] w-full justify-between px-6 text-base tracking-[-0.02em]"
                  >
                    Choose This Plan
                    <ArrowRight aria-hidden className="size-6" />
                  </Button>
                </article>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
