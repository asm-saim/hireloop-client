import Link from "next/link"
import { BriefcaseBusiness, Search } from "lucide-react"

import { JobAdminActions } from "@/components/dashboard/admin-actions"
import { StatusPill } from "@/components/dashboard/company-status-badge"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { JOB_CATEGORIES } from "@/lib/data/types"
import { formatDate } from "@/lib/format"
import { requireRole } from "@/lib/session"
import { listJobsAdmin } from "@/server/repositories/admin"

const field =
  "h-11 rounded-xl border border-white/20 bg-[#101010] px-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/25"
const first = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v) ?? ""

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await requireRole("admin")
  const sp = await searchParams
  const q = first(sp.q)
  const status = first(sp.status)
  const category = first(sp.category)
  const jobs = await listJobsAdmin({ q, status, category })

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title="Manage Jobs"
        text="Moderate every job post on the platform."
      />

      <form
        method="get"
        role="search"
        className="flex flex-wrap items-center gap-3"
      >
        <label className="relative">
          <span className="sr-only">Search by job title or company</span>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/60"
          />
          <input
            name="q"
            defaultValue={q}
            placeholder="Job title or company"
            className={`${field} w-72 pl-9`}
          />
        </label>
        <label>
          <span className="sr-only">Status</span>
          <select name="status" defaultValue={status} className={field}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Category</span>
          <select name="category" defaultValue={category} className={field}>
            <option value="">All categories</option>
            {JOB_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" size="sm">
          Filter
        </Button>
        {(q || status || category) && (
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/dashboard/admin/jobs" />}
            nativeButton={false}
          >
            Clear
          </Button>
        )}
      </form>

      {jobs.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No jobs found"
          text="Try a different search or filter."
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/[0.07] bg-surface">
          <table className="w-full min-w-[60rem] text-left text-sm">
            <thead className="border-b border-white/10 text-white/60">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium">
                  Title
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Company
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Category
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Type
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Posted
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Status
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
                  <td className="px-5 py-4 text-white/80">{j.companyName}</td>
                  <td className="px-5 py-4 text-white/80">{j.category}</td>
                  <td className="px-5 py-4 text-white/80">{j.type}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-white/80">
                    {formatDate(j.postedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={j.status} />
                  </td>
                  <td className="px-5 py-4">
                    <JobAdminActions jobId={j.id} title={j.title} />
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
