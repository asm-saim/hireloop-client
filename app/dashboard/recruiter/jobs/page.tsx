import Link from "next/link"
import { BriefcaseBusiness, Plus } from "lucide-react"

import { StatusPill } from "@/components/dashboard/company-status-badge"
import { EmptyState } from "@/components/dashboard/empty-state"
import { JobRowActions } from "@/components/dashboard/job-row-actions"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { formatDate, timeAgo } from "@/lib/format"
import { requireRole } from "@/lib/session"
import {
  getCompanyByOwner,
  getRecruiterPlan,
  listCompanyJobs,
} from "@/server/repositories/recruiter"
import { PLAN_LABEL, RECRUITER_LIMITS } from "@/server/services/plan-limits"

export default async function ManageJobsPage() {
  const user = await requireRole("recruiter")
  const company = await getCompanyByOwner(user.id)

  if (!company) {
    return (
      <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
        <PageHeader title="Manage Jobs" />
        <EmptyState
          icon={BriefcaseBusiness}
          title="Register your company first"
          text="You need a registered company before you can post jobs."
          action={{
            label: "Register company",
            href: "/dashboard/recruiter/company/edit",
          }}
        />
      </div>
    )
  }

  const [jobs, plan] = await Promise.all([
    listCompanyJobs(company._id),
    getRecruiterPlan(user.id),
  ])
  const limit = RECRUITER_LIMITS[plan].activeJobs
  const active = jobs.filter((j) => j.status === "active").length
  const atLimit = active >= limit

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title="Manage Jobs"
        text="Edit, close or review applicants for every job post."
      >
        <div className="flex flex-col items-end gap-2">
          {atLimit ? (
            <Button size="sm" disabled>
              <Plus aria-hidden />
              Post New Job
            </Button>
          ) : (
            <Button
              size="sm"
              render={<Link href="/dashboard/recruiter/jobs/new" />}
              nativeButton={false}
            >
              <Plus aria-hidden />
              Post New Job
            </Button>
          )}
          {atLimit && (
            <p className="text-sm text-white/70">
              Limit reached.{" "}
              <Link href="/pricing" className="text-brand hover:underline">
                Upgrade your plan
              </Link>
            </p>
          )}
        </div>
      </PageHeader>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-surface px-5 py-4">
        <p className="text-white/80">
          {PLAN_LABEL[plan]} plan · active job posts
        </p>
        <p
          className="font-jakarta text-lg font-semibold text-white"
          aria-label={`${active} of ${limit} active job posts used`}
        >
          {active} / {limit}
        </p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No job posts yet"
          text="Create your first job post to start receiving applications."
          action={{
            label: "Post a job",
            href: "/dashboard/recruiter/jobs/new",
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/[0.07] bg-surface">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b border-white/10 text-white/60">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium">
                  Job title
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Status
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Applicants
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Posted
                </th>
                <th scope="col" className="px-5 py-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07] text-white">
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td className="px-5 py-4 font-medium">{j.title}</td>
                  <td className="px-5 py-4">
                    <StatusPill status={j.status} />
                  </td>
                  <td className="px-5 py-4">{j.applicants}</td>
                  <td
                    className="px-5 py-4 whitespace-nowrap text-white/80"
                    title={formatDate(j.postedAt)}
                  >
                    {j.status === "draft" ? "—" : timeAgo(j.postedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <JobRowActions
                      jobId={j.id}
                      title={j.title}
                      status={j.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
