import Link from "next/link"
import {
  Building2,
  BriefcaseBusiness,
  CircleDollarSign,
  Users,
  UserCog,
} from "lucide-react"

import {
  JobsByCategoryChart,
  SignupsChart,
} from "@/components/dashboard/admin-charts"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { formatDate, timeAgo } from "@/lib/format"
import { requireRole } from "@/lib/session"
import {
  adminStats,
  jobsByCategory,
  recentPayments,
  signupsLast30,
} from "@/server/repositories/admin"
import { PLAN_LABEL } from "@/server/services/plan-limits"

const money = (n: number) =>
  `$${n.toLocaleString("en", { maximumFractionDigits: 2 })}`

export default async function AdminOverview() {
  const user = await requireRole("admin")
  const [stats, categories, signups, payments] = await Promise.all([
    adminStats(),
    jobsByCategory(),
    signupsLast30(),
    recentPayments(),
  ])

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        text="Platform health at a glance."
      />

      <section
        aria-label="Summary"
        className="grid grid-cols-2 gap-4 lg:grid-cols-5"
      >
        <StatCard icon={Users} label="Total Users" value={stats.users} />
        <StatCard
          icon={UserCog}
          label="Total Recruiters"
          value={stats.recruiters}
        />
        <StatCard
          icon={Building2}
          label="Total Companies"
          value={stats.companies}
        />
        <StatCard
          icon={BriefcaseBusiness}
          label="Jobs Posted"
          value={stats.jobs}
        />
        <StatCard
          icon={CircleDollarSign}
          label="Platform Revenue"
          value={money(stats.revenue)}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section
          aria-labelledby="cat-heading"
          className="flex flex-col gap-4 rounded-3xl border border-white/[0.07] bg-surface p-6"
        >
          <h2 id="cat-heading" className="text-xl font-semibold text-white">
            Job posts by category
          </h2>
          {categories.length ? (
            <JobsByCategoryChart data={categories} />
          ) : (
            <p className="text-white/70">No jobs yet.</p>
          )}
        </section>
        <section
          aria-labelledby="signup-heading"
          className="flex flex-col gap-4 rounded-3xl border border-white/[0.07] bg-surface p-6"
        >
          <div>
            <h2
              id="signup-heading"
              className="text-xl font-semibold text-white"
            >
              New registrations
            </h2>
            <p className="text-sm text-white/60">Last 30 days</p>
          </div>
          <SignupsChart data={signups} />
        </section>
      </div>

      <section
        aria-labelledby="pay-heading"
        className="flex flex-col gap-4 rounded-3xl border border-white/[0.07] bg-surface p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="pay-heading" className="text-xl font-semibold text-white">
            Recent payments
          </h2>
          <Link
            href="/dashboard/admin/payments"
            className="text-sm text-brand hover:underline"
          >
            View all
          </Link>
        </div>
        {payments.length ? (
          <ul className="flex flex-col divide-y divide-white/[0.07]">
            {payments.map((p) => (
              <li
                key={p._id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-chip">
                    <CircleDollarSign
                      aria-hidden
                      className="size-4 text-white"
                    />
                  </span>
                  <div>
                    <p className="text-white/90">
                      <strong className="font-medium">
                        {p.email || "Unknown"}
                      </strong>{" "}
                      subscribed to {PLAN_LABEL[p.plan] ?? p.plan}
                    </p>
                    <p
                      className="text-sm text-white/50"
                      title={formatDate(p.createdAt)}
                    >
                      {timeAgo(p.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="font-jakarta text-lg font-semibold text-white">
                  {money(p.amount)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/70">No payments yet.</p>
        )}
      </section>
    </div>
  )
}
