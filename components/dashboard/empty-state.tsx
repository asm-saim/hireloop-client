import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon
  title: string
  text: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/20 px-6 py-14 text-center">
      <Icon aria-hidden className="size-8 text-white/60" />
      <h2 className="text-xl font-medium text-white">{title}</h2>
      <p className="max-w-sm text-white/70">{text}</p>
      {action && (
        <Button
          size="sm"
          render={<Link href={action.href} />}
          nativeButton={false}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
