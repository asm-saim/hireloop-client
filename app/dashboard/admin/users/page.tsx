import Link from "next/link"
import { Search, UsersRound } from "lucide-react"

import { UserActions } from "@/components/dashboard/admin-actions"
import { StatusPill } from "@/components/dashboard/company-status-badge"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/format"
import { requireRole } from "@/lib/session"
import { listUsers } from "@/server/repositories/admin"

const field =
  "h-11 rounded-xl border border-white/20 bg-[#101010] px-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/25"

const first = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v) ?? ""

export default async function ManageUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const me = await requireRole("admin")
  const sp = await searchParams
  const q = first(sp.q)
  const role = first(sp.role)
  const users = await listUsers({ q, role })

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title="Manage Users"
        text="Search users, change roles, and suspend or reactivate accounts."
      />

      <form
        method="get"
        role="search"
        className="flex flex-wrap items-center gap-3"
      >
        <label className="relative">
          <span className="sr-only">Search by email</span>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/60"
          />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by email"
            className={`${field} w-72 pl-9`}
          />
        </label>
        <label>
          <span className="sr-only">Role</span>
          <select name="role" defaultValue={role} className={field}>
            <option value="">All roles</option>
            <option value="seeker">Seekers</option>
            <option value="recruiter">Recruiters</option>
          </select>
        </label>
        <Button type="submit" size="sm">
          Filter
        </Button>
        {(q || role) && (
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/dashboard/admin/users" />}
            nativeButton={false}
          >
            Clear
          </Button>
        )}
      </form>

      {users.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No users found"
          text="Try a different email or role filter."
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/[0.07] bg-surface">
          <table className="w-full min-w-[54rem] text-left text-sm">
            <thead className="border-b border-white/10 text-white/60">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium">
                  Name
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Email
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Role
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Joined
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
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-4 font-medium">{u.name}</td>
                  <td className="px-5 py-4 text-white/80">{u.email}</td>
                  <td className="px-5 py-4 capitalize">{u.role}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-white/80">
                    {u.createdAt ? formatDate(u.createdAt) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill
                      status={u.status === "suspended" ? "suspended" : "active"}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <UserActions
                      userId={u.id}
                      name={u.name}
                      role={u.role}
                      status={u.status}
                      isSelf={u.id === me.id}
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
