import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, FileText, Users } from "lucide-react"

import { ApplicantStatusSelect } from "@/components/dashboard/applicant-status-select"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { formatDate, timeAgo } from "@/lib/format"
import { requireRole } from "@/lib/session"
import {
  getCompanyByOwner,
  getCompanyJob,
  listApplicants,
} from "@/server/repositories/recruiter"

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  const user = await requireRole("recruiter")
  const company = await getCompanyByOwner(user.id)
  if (!company) notFound()
  const job = await getCompanyJob(company._id, jobId)
  if (!job) notFound() // also covers jobs that belong to another company
  const applicants = await listApplicants(job._id)

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <Link
        href="/dashboard/recruiter/jobs"
        className="inline-flex w-fit items-center gap-2 rounded-lg text-sm text-white/80 transition-colors outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Manage jobs
      </Link>
      <PageHeader
        title={`Applicants · ${job.title}`}
        text={`${applicants.length} ${applicants.length === 1 ? "person has" : "people have"} applied. Changing a status notifies the applicant.`}
      />

      {applicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants yet"
          text="When job seekers apply, they will show up here."
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/[0.07] bg-surface">
          <table className="w-full min-w-[54rem] text-left text-sm">
            <thead className="border-b border-white/10 text-white/60">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium">
                  Applicant
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Email
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Applied
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Resume
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07] align-top text-white">
              {applicants.map((a) => (
                <tr key={a.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium">{a.name}</p>
                    {a.headline && (
                      <p className="text-white/60">{a.headline}</p>
                    )}
                    {a.coverLetter && (
                      <details className="mt-2 max-w-xs">
                        <summary className="cursor-pointer text-brand hover:underline">
                          Cover letter
                        </summary>
                        <p className="mt-2 whitespace-pre-wrap text-white/80">
                          {a.coverLetter}
                        </p>
                      </details>
                    )}
                  </td>
                  <td className="px-5 py-4 text-white/80">
                    {a.email ? (
                      <a href={`mailto:${a.email}`} className="hover:underline">
                        {a.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td
                    className="px-5 py-4 whitespace-nowrap text-white/80"
                    title={formatDate(a.createdAt)}
                  >
                    {timeAgo(a.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    {a.resumeUrl ? (
                      <a
                        href={a.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-brand hover:underline"
                      >
                        <FileText aria-hidden className="size-4" />
                        View resume
                      </a>
                    ) : (
                      <span className="text-white/50">Not provided</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <ApplicantStatusSelect
                      applicationId={a.id}
                      applicantName={a.name}
                      initial={a.status}
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
