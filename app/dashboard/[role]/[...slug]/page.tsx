import { Hammer } from "lucide-react"

import { roleNav } from "@/components/dashboard/nav"
import type { DashboardRole } from "@/lib/session"

/** Placeholder for dashboard pages that are built in the next phases. */
export default async function ComingSoon({
  params,
}: {
  params: Promise<{ role: string; slug: string[] }>
}) {
  const { role, slug } = await params
  const href = `/dashboard/${role}/${slug.join("/")}`
  const title =
    roleNav[role as DashboardRole]?.find((l) => l.href === href)?.label ??
    "This page"

  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4 rounded-3xl border border-dashed border-white/20 px-6 py-20 text-center">
      <Hammer aria-hidden className="size-8 text-white/60" />
      <h1 className="text-2xl font-semibold text-white">
        {title} is coming soon
      </h1>
      <p className="text-white/70">
        This page is part of the next build phase of the dashboard.
      </p>
    </div>
  )
}
