import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export type DashboardRole = "seeker" | "recruiter" | "admin"

export type SessionUser = {
  id: string
  name: string
  email: string
  image: string | null
  role: DashboardRole
}

export const DASHBOARD_ROLES: DashboardRole[] = ["seeker", "recruiter", "admin"]

export function normalizeRole(role: unknown): DashboardRole {
  return role === "recruiter" || role === "admin" ? role : "seeker"
}

export function dashboardHome(role: DashboardRole) {
  return `/dashboard/${role}`
}

/** The signed-in user, or null. Safe to call from any server component. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  const u = session.user as {
    id: string
    name: string
    email: string
    image?: string | null
    role?: unknown
    status?: unknown
  }
  if (u.status === "suspended") return null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image ?? null,
    role: normalizeRole(u.role),
  }
}

/** Redirects to /login when there is no session. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect("/login")
  return user
}

/**
 * Page guard: signed-out users go to /login, users with another role are sent
 * to their own dashboard.
 */
export async function requireRole(role: DashboardRole): Promise<SessionUser> {
  const user = await requireUser()
  if (user.role !== role) redirect(dashboardHome(user.role))
  return user
}
