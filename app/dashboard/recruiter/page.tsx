import Link from "next/link"
import {
  Building2,
  BriefcaseBusiness,
  CircleCheck,
  Lock,
  Pencil,
  Users,
} from "lucide-react"

import { ApplicantsChart } from "@/components/dashboard/applicants-chart"
import { StatusPill } from "@/components/dashboard/company-status-badge"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { CompanyAvatar } from "@/components/jobs/company-avatar"
import { Button } from "@/components/ui/button"
import { formatDate, timeAgo } from "@/lib/format"
import { requireRole } from "@/lib/session"
import { toCompany } from "@/server/repositories/jobs"
import {
  applicantsPerJobLast30,
  getCompanyByOwner,
  recentApplicants,
  recruiterStats,
} from "@/server/repositories/recruiter"

export default async function RecruiterOverview() {
  const user = await requireRole("recruiter")
  const companyDoc = await getCompanyByOwner(user.id)
  const company = companyDoc ? toCompany(companyDoc) : null
  const [stats, chart, recent] = companyDoc
    ? await Promise.all([
        recruiterStats(companyDoc._id),
        applicantsPerJobLast30(companyDoc._id),
        recentApplicants(companyDoc._id),
      ])
    : [{ totalJobs: 0, applicants: 0, active: 0, closed: 0 }, [], []]

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        text="A snapshot of your hiring across all job posts."
      />

      <section
        aria-label="Summary"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard
          icon={BriefcaseBusiness}
          label="Total Job Posts"
          value={stats.totalJobs}
        />
        <StatCard
          icon={Users}
          label="Total Applicants"
          value={stats.applicants}
        />
        <StatCard icon={CircleCheck} label="Active Jobs" value={stats.active} />
        <StatCard icon={Lock} label="Jobs Closed" value={stats.closed} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <section
          aria-labelledby="company-heading"
          className="flex flex-col gap-5 rounded-3xl border border-white/[0.07] bg-surface p-6"
        >
          <h2 id="company-heading" className="sr-only">
            Company
          </h2>
          {companyDoc && company ? (
            <>
              <div className="flex items-center gap-4">
                <CompanyAvatar
                  name={company.name}
                  logoUrl={company.logoUrl}
                  className="size-16 text-lg"
                />
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-white">
                    {company.name}
                  </p>
                  <p className="truncate text-sm text-white/70">
                    {company.industry}
                  </p>
                </div>
              </div>
              <StatusPill status={companyDoc.status} className="w-fit" />
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                render={<Link href="/dashboard/recruiter/company/edit" />}
                nativeButton={false}
              >
                <Pencil aria-hidden />
                Edit company
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <Building2 aria-hidden className="size-8 text-white/60" />
              <p className="text-lg font-semibold text-white">
                Register your company
              </p>
              <p className="text-white/70">
                Add your company so you can start posting jobs once it&apos;s
                approved.
              </p>
              <Button
                size="sm"
                render={<Link href="/dashboard/recruiter/company/edit" />}
                nativeButton={false}
              >
                Register company
              </Button>
            </div>
          )}
        </section>

        <section
          aria-labelledby="chart-heading"
          className="flex flex-col gap-5 rounded-3xl border border-white/[0.07] bg-surface p-6"
        >
          <div>
            <h2 id="chart-heading" className="text-xl font-semibold text-white">
              Applicants per job
            </h2>
            <p className="text-sm text-white/60">Last 30 days</p>
          </div>
          {chart.length ? (
            <ApplicantsChart data={chart} />
          ) : (
            <p className="py-6 text-white/70">
              Publish a job and applicant numbers will appear here.
            </p>
          )}
        </section>
      </div>

      <section
        aria-labelledby="recent-heading"
        className="flex flex-col gap-4 rounded-3xl border border-white/[0.07] bg-surface p-6"
      >
        <h2 id="recent-heading" className="text-xl font-semibold text-white">
          Recent applications
        </h2>
        {recent.length ? (
          <ul className="flex flex-col divide-y divide-white/[0.07]">
            {recent.map((r) => (
              <li
                key={r.id}
                className="flex items-start gap-4 py-3 first:pt-0 last:pb-0"
              >
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-chip">
                  <Users aria-hidden className="size-4 text-white" />
                </span>
                <div className="min-w-0 flex-1 text-white/90">
                  <p>
                    <strong className="font-medium">{r.name}</strong> applied
                    for{" "}
                    <Link
                      href={`/dashboard/recruiter/jobs/${r.jobId}/applicants`}
                      className="font-medium underline-offset-2 hover:underline"
                    >
                      {r.jobTitle}
                    </Link>
                  </p>
                  <p
                    className="text-sm text-white/50"
                    title={formatDate(r.createdAt)}
                  >
                    {timeAgo(r.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/70">No applications yet.</p>
        )}
      </section>
    </div>
  )
}
