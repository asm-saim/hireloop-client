import { notFound } from "next/navigation"

import { JobForm } from "@/components/dashboard/job-form"
import { PageHeader } from "@/components/dashboard/page-header"
import { requireRole } from "@/lib/session"
import {
  countActiveJobs,
  getCompanyByOwner,
  getCompanyJob,
  getRecruiterPlan,
} from "@/server/repositories/recruiter"
import { RECRUITER_LIMITS } from "@/server/services/plan-limits"

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  const user = await requireRole("recruiter")
  const company = await getCompanyByOwner(user.id)
  if (!company) notFound()
  const job = await getCompanyJob(company._id, jobId)
  if (!job) notFound()

  const isActive = job.status === "active"
  let blocked: string | null = null
  if (!isActive) {
    const limit = RECRUITER_LIMITS[await getRecruiterPlan(user.id)].activeJobs
    if (company.status !== "approved")
      blocked =
        "Your company must be approved before you can publish. You can still save drafts."
    else if ((await countActiveJobs(company._id)) >= limit)
      blocked = `You've reached your plan's limit of ${limit} active job posts. Close a job or upgrade to publish this one.`
  }

  return (
    <div className="mx-auto flex max-w-[48rem] flex-col gap-8">
      <PageHeader title="Edit job" text={job.title} />
      <JobForm
        jobId={job._id}
        companyName={company.name}
        publishBlockedReason={blocked}
        isActive={isActive}
        initial={{
          title: job.title,
          category: job.category,
          type: job.type,
          currency: job.currency ?? "USD",
          salaryMin: String(job.salaryMin),
          salaryMax: String(job.salaryMax),
          remote: job.location === "Remote",
          location: job.location === "Remote" ? "" : job.location,
          deadline: job.deadline.toISOString().slice(0, 10),
          overview: job.description,
          responsibilities: job.responsibilities.join("\n"),
          requirements: job.requirements.join("\n"),
          benefits: job.benefits.join("\n"),
        }}
      />
    </div>
  )
}
