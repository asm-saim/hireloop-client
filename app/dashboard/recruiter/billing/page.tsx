import Link from "next/link"
import { ArrowUpRight, Receipt } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { CheckoutReturn } from "@/components/billing/plan-actions"
import { SubscriptionNote } from "@/components/billing/subscription-note"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { formatDate, timeAgo } from "@/lib/format"
import { recruiterPlans } from "@/lib/pricing"
import { requireRole } from "@/lib/session"
import { listPayments } from "@/server/repositories/profiles"
import {
  countActiveJobs,
  getCompanyByOwner,
  getRecruiterPlan,
} from "@/server/repositories/recruiter"
import { getSubscription } from "@/server/services/billing"
import { PLAN_LABEL, RECRUITER_LIMITS } from "@/server/services/plan-limits"

export default async function RecruiterBillingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await requireRole("recruiter")
  const sp = await searchParams
  const sessionId =
    typeof sp.session_id === "string" && sp.checkout === "success"
      ? sp.session_id
      : null
  const company = await getCompanyByOwner(user.id)
  const [plan, active, payments, sub] = await Promise.all([
    getRecruiterPlan(user.id),
    company ? countActiveJobs(company._id) : Promise.resolve(0),
    listPayments(user.id),
    getSubscription(user.id),
  ])
  const limit = RECRUITER_LIMITS[plan].activeJobs
  const pct = Math.min(100, Math.round((active / limit) * 100))
  const price =
    recruiterPlans.find((p) => p.name.toLowerCase() === plan)?.price ?? 0

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      {sessionId && (
        <CheckoutReturn
          sessionId={sessionId}
          path="/dashboard/recruiter/billing"
        />
      )}
      <PageHeader
        title="Subscription & Billing"
        text="Your plan, active job usage and payment history."
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
            {plan !== "enterprise" && (
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
        <SubscriptionNote sub={sub} />
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm font-medium text-white">Active job posts</p>
            <p className="text-sm text-white/70">
              {active} / {limit} used
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Active job posts used"
            aria-valuemin={0}
            aria-valuemax={limit}
            aria-valuenow={Math.min(active, limit)}
            className="h-2 overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${pct}%` }}
            />
          </div>
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
