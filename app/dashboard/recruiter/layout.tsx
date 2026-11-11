import { requireRole } from "@/lib/session"

/** Only recruiters may see /dashboard/recruiter/*. */
export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("recruiter")
  return children
}
