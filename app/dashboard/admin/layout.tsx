import { requireRole } from "@/lib/session"

/** Only admins may see /dashboard/admin/*. */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("admin")
  return children
}
