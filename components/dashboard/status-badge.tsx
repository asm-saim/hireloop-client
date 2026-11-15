import { STATUS_LABEL, type ApplicationStatus } from "@/server/models"
import { cn } from "@/lib/utils"

/** Chart/dot colours — one source of truth for every status surface. */
export const STATUS_COLOR: Record<ApplicationStatus, string> = {
  applied: "#5b79d6",
  under_review: "#fbbf24",
  shortlisted: "#38bdf8",
  rejected: "#f04438",
  offered: "#2dd4bf",
}

/** Tinted pill treatments, keyed to the same ramp as STATUS_COLOR. */
const STATUS_TINT: Record<ApplicationStatus, string> = {
  applied: "border-brand/35 bg-brand/15",
  under_review: "border-gold/35 bg-gold/15",
  shortlisted: "border-aqua/35 bg-aqua/15",
  rejected: "border-destructive/35 bg-destructive/15",
  offered: "border-mint/35 bg-mint/15",
}

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium text-white",
        STATUS_TINT[status] ?? "border-white/10 bg-chip",
        className
      )}
    >
      <span
        aria-hidden
        className="size-2 rounded-full"
        style={{ backgroundColor: STATUS_COLOR[status] }}
      />
      {STATUS_LABEL[status]}
    </span>
  )
}
