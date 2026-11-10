import type { Metadata } from "next"
import Link from "next/link"
import { SearchX } from "lucide-react"

import { JobCard } from "@/components/jobs/job-card"
import { JobSearch, parseJobSearch } from "@/components/jobs/job-search"
import { PageHeading, PublicShell } from "@/components/site/public-shell"
import { Button } from "@/components/ui/button"
import { getJobs } from "@/server/repositories/jobs"

export const metadata: Metadata = {
  title: "Browse jobs — HireLoop",
  description: "Search and filter thousands of curated job openings.",
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { values, activeCount } = parseJobSearch(await searchParams)
  const jobs = await getJobs(values)

  return (
    <PublicShell>
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8 xl:px-[3.75rem]">
        <PageHeading
          eyebrow="Browse jobs"
          title="Find a role that fits"
          text="Search by keyword, then narrow down by type, location, salary and category."
        />
        <div className="mx-auto mt-10 max-w-[82.5rem] sm:mt-14">
          <JobSearch action="/jobs" values={values} activeCount={activeCount}>
            <p className="text-sm text-white/70" aria-live="polite">
              {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
            </p>
            {jobs.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/20 px-6 py-16 text-center">
                <SearchX aria-hidden className="size-8 text-white/60" />
                <h2 className="text-xl font-medium text-white">
                  No jobs match your search
                </h2>
                <p className="max-w-sm text-white/70">
                  Try removing a filter or searching for a broader keyword.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href="/jobs" />}
                  nativeButton={false}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </JobSearch>
        </div>
      </div>
    </PublicShell>
  )
}
