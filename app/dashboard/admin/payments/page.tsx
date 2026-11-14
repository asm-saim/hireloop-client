import { CircleDollarSign, Receipt, Repeat, Users } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { formatDate, timeAgo } from "@/lib/format"
import { requireRole } from "@/lib/session"
import { listAllPayments, paymentsSummary } from "@/server/repositories/admin"
import { PLAN_LABEL } from "@/server/services/plan-limits"

const money = (n: number) =>
  `$${n.toLocaleString("en", { maximumFractionDigits: 2 })}`

export default async function AdminPaymentsPage() {
  await requireRole("admin")
  const [summary, payments] = await Promise.all([
    paymentsSummary(),
    listAllPayments(),
  ])

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title="Payments & Subscriptions"
        text="Revenue, active subscriptions and every transaction."
      />

      <section
        aria-label="Summary"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard
          icon={CircleDollarSign}
          label="Total Revenue"
          value={money(summary.total)}
        />
        <StatCard
          icon={Receipt}
          label="Monthly Revenue"
          value={money(summary.monthly)}
          hint="This calendar month"
        />
        <StatCard
          icon={Users}
          label="Seeker Subscriptions"
          value={summary.seekerSubs}
          hint="Active paid plans"
        />
        <StatCard
          icon={Repeat}
          label="Recruiter Subscriptions"
          value={summary.recruiterSubs}
          hint="Active paid plans"
        />
      </section>

      {payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No payments yet"
          text="Subscription payments will be listed here."
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/[0.07] bg-surface">
          <table className="w-full min-w-[54rem] text-left text-sm">
            <thead className="border-b border-white/10 text-white/60">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium">
                  User email
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Plan
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Date
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Transaction ID
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07] text-white">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="px-5 py-4 text-white/90">{p.email || "—"}</td>
                  <td className="px-5 py-4">{PLAN_LABEL[p.plan] ?? p.plan}</td>
                  <td className="px-5 py-4">{money(p.amount)}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-white/80">
                    {formatDate(p.createdAt)} · {timeAgo(p.createdAt)}
                  </td>
                  <td className="px-5 py-4 font-mono-label text-white/80">
                    {p.transactionId}
                  </td>
                  <td className="px-5 py-4 capitalize">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
