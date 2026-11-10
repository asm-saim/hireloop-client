import Link from "next/link"
import { ArrowUpRight, Receipt } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { formatDate, timeAgo } from "@/lib/format"
import { requireRole } from "@/lib/session"
import { applicationsThisMonth } from "@/server/repositories/applications"
import { getSeekerPlan, listPayments } from "@/server/repositories/profiles"
import { countSaved } from "@/server/repositories/saved"
import { PLAN_LABEL, SEEKER_LIMITS } from "@/server/services/plan-limits"
import { seekerPlans } from "@/lib/pricing"

function Usage({
  label,
  used,
  limit,
}: {
  label: string
  used: number
  limit: number | null
}) {
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-sm text-white/70">
          {used} / {limit ?? "Unlimited"}
        </p>
      </div>
      {limit !== null && (
        <div
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-valuenow={Math.min(used, limit)}
          className="h-2 overflow-hidden rounded-full bg-white/10"
        >
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default async function SeekerBillingPage() {
  const user = await requireRole("seeker")
  const [plan, used, saved, payments] = await Promise.all([
    getSeekerPlan(user.id),
    applicationsThisMonth(user.id),
    countSaved(user.id),
    listPayments(user.id),
  ])
  const limits = SEEKER_LIMITS[plan]
  const price =
    seekerPlans.find((p) => p.name.toLowerCase() === plan)?.price ?? 0

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title="Subscription & Billing"
        text="Your plan, usage and payment history."
      />

      <section
        aria-labelledby="plan-heading"
        className="flex flex-col gap-6 rounded-3xl border border-white/[0.07] bg-surface p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/60">Current plan</p>
            <h2
              id="plan-heading"
              className="flex items-baseline gap-3 text-3xl font-semibold text-white"
            >
              {PLAN_LABEL[plan]}
              <span className="text-base font-normal text-white/70">
                {price === 0 ? "$0 / forever" : `$${price} / month`}
              </span>
            </h2>
          </div>
          <div className="flex gap-3">
            {plan !== "premium" && (
              <Button
                size="sm"
                render={<Link href="/pricing" />}
                nativeButton={false}
              >
                Upgrade
                <ArrowUpRight aria-hidden />
              </Button>
            )}
            {plan !== "free" && (
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/pricing" />}
                nativeButton={false}
              >
                Downgrade
              </Button>
            )}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Usage
            label="Applications this month"
            used={used}
            limit={limits.applicationsPerMonth}
          />
          <Usage label="Saved jobs" used={saved} limit={limits.savedJobs} />
        </div>
      </section>

      <section
        aria-labelledby="history-heading"
        className="flex flex-col gap-4"
      >
        <h2 id="history-heading" className="text-2xl font-semibold text-white">
          Payment history
        </h2>
        {payments.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No payments yet"
            text="When you upgrade, your payments and receipts will be listed here."
          />
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-white/[0.07] bg-surface">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-white/10 text-white/60">
                <tr>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Plan
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Amount
                  </th>
                  <th scope="col" className="px-5 py-4 font-medium">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07] text-white">
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td
                      className="px-5 py-4 whitespace-nowrap"
                      title={timeAgo(p.createdAt)}
                    >
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      {PLAN_LABEL[p.plan] ?? p.plan}
                    </td>
                    <td className="px-5 py-4">${p.amount}</td>
                    <td className="px-5 py-4 font-mono-label text-white/80">
                      {p.transactionId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
