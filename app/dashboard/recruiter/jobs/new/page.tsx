import { Building2 } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { JobForm } from "@/components/dashboard/job-form"
import { PageHeader } from "@/components/dashboard/page-header"
import { requireRole } from "@/lib/session"
import {
  countActiveJobs,
  getCompanyByOwner,
  getRecruiterPlan,
} from "@/server/repositories/recruiter"
import { RECRUITER_LIMITS } from "@/server/services/plan-limits"

/** Default application deadline: 30 days from now, as YYYY-MM-DD. */
function defaultDeadline() {
  return new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10)
}

export default async function NewJobPage() {
  const user = await requireRole("recruiter")
  const company = await getCompanyByOwner(user.id)

  if (!company) {
    return (
      <div className="mx-auto flex max-w-[48rem] flex-col gap-8">
        <PageHeader title="Post a Job" />
        <EmptyState
          icon={Building2}
          title="Register your company first"
          text="Jobs are posted on behalf of your company."
          action={{
            label: "Register company",
            href: "/dashboard/recruiter/company/edit",
          }}
        />
      </div>
    )
  }

  const plan = await getRecruiterPlan(user.id)
  const limit = RECRUITER_LIMITS[plan].activeJobs
  const active = await countActiveJobs(company._id)
  const blocked =
    company.status === "pending"
      ? "Your company is waiting for admin approval. You can save drafts now and publish once it's approved."
      : company.status === "rejected"
        ? "Your company registration was rejected. Update it on the My Company page to resubmit. You can still save drafts."
        : active >= limit
          ? `You've reached your plan's limit of ${limit} active job posts. Close a job or upgrade to publish more. You can still save a draft.`
          : null

  const deadline = defaultDeadline()

  return (
    <div className="mx-auto flex max-w-[48rem] flex-col gap-8">
      <PageHeader
        title="Post a Job"
        text="Describe the role. You can save a draft and finish later."
      />
      <JobForm
        companyName={company.name}
        publishBlockedReason={blocked}
        isActive={false}
        initial={{
          title: "",
          category: "Engineering",
          type: "Full-time",
          currency: "USD",
          salaryMin: "",
          salaryMax: "",
          remote: false,
          location: "",
          deadline,
          overview: "",
          responsibilities: "",
          requirements: "",
          benefits: "",
        }}
      />
    </div>
  )
}
