import type { LucideIcon } from "lucide-react"

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon
  label: string
  value: number | string
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl surface p-5">
      <Icon aria-hidden className="size-6 text-aqua" />
      <div className="flex flex-col gap-1">
        <p className="font-tight text-4xl leading-none font-bold tracking-[-0.04em] text-white">
          {value}
        </p>
        <p className="font-tight text-base text-white">{label}</p>
        {hint && <p className="text-xs text-white/60">{hint}</p>}
      </div>
    </div>
  )
}
