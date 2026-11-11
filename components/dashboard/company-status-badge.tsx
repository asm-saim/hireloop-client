import { cn } from "@/lib/utils"
import type { CompanyStatus, JobStatus } from "@/server/models"

const styles: Record<
  CompanyStatus | JobStatus,
  { label: string; dot: string }
> = {
  pending: { label: "Pending review", dot: "#f5b84a" },
  approved: { label: "Approved", dot: "#3ecf8e" },
  rejected: { label: "Rejected", dot: "#f05d6c" },
  active: { label: "Active", dot: "#3ecf8e" },
  closed: { label: "Closed", dot: "#9a9aa3" },
  draft: { label: "Draft", dot: "#8b93ff" },
}

export function StatusPill({
  status,
  className,
}: {
  status: CompanyStatus | JobStatus
  className?: string
}) {
  const s = styles[status]
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
        style={{ backgroundColor: s.dot }}
      />
      {s.label}
    </span>
  )
}
