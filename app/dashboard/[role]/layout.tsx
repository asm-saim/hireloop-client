import { notFound, redirect } from "next/navigation"

import {
  DASHBOARD_ROLES,
  dashboardHome,
  requireUser,
  type DashboardRole,
} from "@/lib/session"

/** Only the matching role may see /dashboard/<role>/*. */
export default async function RoleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ role: string }>
}) {
  const { role } = await params
  if (!DASHBOARD_ROLES.includes(role as DashboardRole)) notFound()

  const user = await requireUser()
  if (user.role !== role) redirect(dashboardHome(user.role))

  return children
}
