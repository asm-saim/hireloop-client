import { requireRole } from "@/lib/session"

/** Only job seekers may see /dashboard/seeker/*. */
export default async function SeekerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("seeker")
  return children
}
