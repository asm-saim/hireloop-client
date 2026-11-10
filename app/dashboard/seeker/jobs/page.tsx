import { SearchX } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { ApplyDialog } from "@/components/jobs/apply-dialog"
import { JobCard } from "@/components/jobs/job-card"
import { JobSearch, parseJobSearch } from "@/components/jobs/job-search"
import { SaveButton } from "@/components/jobs/save-button"
import { requireRole } from "@/lib/session"
import { appliedJobIds } from "@/server/repositories/applications"
import { getJobs } from "@/server/repositories/jobs"
import { savedJobIds } from "@/server/repositories/saved"

export default async function SeekerBrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await requireRole("seeker")
  const { values, activeCount } = parseJobSearch(await searchParams)
  const [jobs, saved, applied] = await Promise.all([
    getJobs(values),
    savedJobIds(user.id),
    appliedJobIds(user.id),
  ])

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title="Browse & Apply"
        text="Search jobs, save the ones you like and apply without leaving your dashboard."
      />
      <JobSearch
        action="/dashboard/seeker/jobs"
        values={values}
        activeCount={activeCount}
      >
        <p className="text-sm text-white/70" aria-live="polite">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
        </p>
        {jobs.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                actions={
                  <>
                    <SaveButton
                      jobId={job.id}
                      initialSaved={saved.has(job.id)}
                    />
                    <ApplyDialog
                      jobId={job.id}
                      jobTitle={job.title}
                      companyName={job.company.name}
                      viewer="seeker"
                      alreadyApplied={applied.has(job.id)}
                      size="sm"
                    />
                  </>
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No jobs match your search"
            text="Try removing a filter or searching for a broader keyword."
            action={{
              label: "Clear all filters",
              href: "/dashboard/seeker/jobs",
            }}
          />
        )}
      </JobSearch>
    </div>
  )
}
