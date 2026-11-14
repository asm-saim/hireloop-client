import { Building2 } from "lucide-react"

import { CompanyActions } from "@/components/dashboard/admin-actions"
import { StatusPill } from "@/components/dashboard/company-status-badge"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { formatDate } from "@/lib/format"
import { requireRole } from "@/lib/session"
import { listCompaniesAdmin } from "@/server/repositories/admin"

export default async function ManageCompaniesPage() {
  await requireRole("admin")
  const companies = await listCompaniesAdmin()
  const pending = companies.filter((c) => c.status === "pending").length

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title="Manage Companies"
        text={
          pending
            ? `${pending} registration${pending === 1 ? " is" : "s are"} waiting for review.`
            : "Approve or reject company registrations."
        }
      />
      {companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies yet"
          text="Registrations from recruiters will appear here."
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/[0.07] bg-surface">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="border-b border-white/10 text-white/60">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium">
                  Company
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Recruiter email
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Industry
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Status
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Submitted
                </th>
                <th scope="col" className="px-5 py-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07] text-white">
              {companies.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-4 font-medium">{c.name}</td>
                  <td className="px-5 py-4 text-white/80">{c.ownerEmail}</td>
                  <td className="px-5 py-4 text-white/80">{c.industry}</td>
                  <td className="px-5 py-4">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-white/80">
                    {c.createdAt ? formatDate(c.createdAt) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <CompanyActions
                      companyId={c.id}
                      name={c.name}
                      status={c.status}
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
