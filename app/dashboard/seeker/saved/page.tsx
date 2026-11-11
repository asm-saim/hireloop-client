import Link from "next/link"
import { Bookmark } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { RemoveSavedButton } from "@/components/dashboard/remove-saved-button"
import { ApplyDialog } from "@/components/jobs/apply-dialog"
import { formatDate, formatSalary, timeAgo } from "@/lib/format"
import { requireRole } from "@/lib/session"
import { appliedJobIds } from "@/server/repositories/applications"
import { listSaved } from "@/server/repositories/saved"

export default async function SavedJobsPage() {
  const user = await requireRole("seeker")
  const [rows, applied] = await Promise.all([
    listSaved(user.id),
    appliedJobIds(user.id),
  ])

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title="Saved Jobs"
        text="Jobs you bookmarked to come back to."
      />
      {rows.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          text="Tap Save on any job and it will show up here."
          action={{ label: "Browse jobs", href: "/dashboard/seeker/jobs" }}
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/[0.07] bg-surface">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="border-b border-white/10 text-white/60">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium">
                  Job
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Location
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Salary
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Saved
                </th>
                <th scope="col" className="px-5 py-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07] text-white">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-4">
                    {r.job ? (
                      <>
                        <Link
                          href={`/jobs/${r.job.id}`}
                          className="font-medium hover:underline focus-visible:underline focus-visible:outline-none"
                        >
                          {r.job.title}
                        </Link>
                        <p className="text-white/60">{r.job.company.name}</p>
                      </>
                    ) : (
                      <span className="text-white/60">
                        This job is no longer available
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-white/80">
                    {r.job?.location ?? "—"}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-white/80">
                    {r.job
                      ? formatSalary(
                          r.job.salaryMin,
                          r.job.salaryMax,
                          r.job.currency
                        )
                      : "—"}
                  </td>
                  <td
                    className="px-5 py-4 whitespace-nowrap text-white/80"
                    title={formatDate(r.savedAt)}
                  >
                    {timeAgo(r.savedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <RemoveSavedButton jobId={r.jobId} />
                      {r.job && (
                        <ApplyDialog
                          jobId={r.job.id}
                          jobTitle={r.job.title}
                          companyName={r.job.company.name}
                          viewer="seeker"
                          alreadyApplied={applied.has(r.job.id)}
                          size="sm"
                        />
                      )}
                    </div>
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
