import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

const HOME = {
  seeker: "/dashboard/seeker",
  recruiter: "/dashboard/recruiter",
  admin: "/dashboard/admin",
} as const

export default async function DashboardRedirect() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const role = (session.user as { role?: string }).role
  redirect(role && role in HOME ? HOME[role as keyof typeof HOME] : HOME.seeker)
}