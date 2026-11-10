import { STATUS_LABEL, type ApplicationStatus } from "@/server/models"
import { cn } from "@/lib/utils"

export const STATUS_COLOR: Record<ApplicationStatus, string> = {
  applied: "#8b93ff",
  under_review: "#f5b84a",
  shortlisted: "#36c4e0",
  rejected: "#f05d6c",
  offered: "#3ecf8e",
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
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-chip px-3 py-1 text-sm font-medium text-white",
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
