import Link from "next/link"
import { ClipboardList } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { formatDate, timeAgo } from "@/lib/format"
import { requireRole } from "@/lib/session"
import { listApplications } from "@/server/repositories/applications"

export default async function MyApplicationsPage() {
  const user = await requireRole("seeker")
  const rows = await listApplications(user.id)

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title="My Applications"
        text="Track every application and where it stands."
      />
      {rows.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          text="When you apply to a job it will appear here with its status."
          action={{ label: "Browse jobs", href: "/dashboard/seeker/jobs" }}
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/[0.07] bg-surface">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="border-b border-white/10 text-white/60">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium">
                  Job title
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Company
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Date applied
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Status
                </th>
                <th scope="col" className="px-5 py-4 text-right font-medium">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07] text-white">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-4 font-medium">
                    {r.job?.title ?? (
                      <span className="text-white/60">Job removed</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-white/80">
                    {r.job?.company.name ?? "—"}
                  </td>
                  <td
                    className="px-5 py-4 whitespace-nowrap text-white/80"
                    title={formatDate(r.createdAt)}
                  >
                    {timeAgo(r.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    {r.job ? (
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={`/jobs/${r.job.id}`} />}
                        nativeButton={false}
                      >
                        View details
                      </Button>
                    ) : (
                      <span className="text-white/50">Unavailable</span>
                    )}
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
