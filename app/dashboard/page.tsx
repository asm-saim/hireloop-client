import { redirect } from "next/navigation"

import { dashboardHome, requireUser } from "@/lib/session"

/** Entry point after sign-in: forward to the dashboard that matches the role. */
export default async function DashboardRedirect() {
  const user = await requireUser()
  redirect(dashboardHome(user.role))
}
