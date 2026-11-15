import { cn } from "@/lib/utils"

const styles = {
  pending: {
    label: "Pending review",
    dot: "#fbbf24",
    tint: "border-gold/35 bg-gold/15",
  },
  approved: {
    label: "Approved",
    dot: "#2dd4bf",
    tint: "border-mint/35 bg-mint/15",
  },
  rejected: {
    label: "Rejected",
    dot: "#f04438",
    tint: "border-destructive/35 bg-destructive/15",
  },
  active: {
    label: "Active",
    dot: "#2dd4bf",
    tint: "border-mint/35 bg-mint/15",
  },
  closed: {
    label: "Closed",
    dot: "#9a9aa3",
    tint: "border-white/15 bg-white/10",
  },
  draft: {
    label: "Draft",
    dot: "#5b79d6",
    tint: "border-brand/35 bg-brand/15",
  },
  suspended: {
    label: "Suspended",
    dot: "#f04438",
    tint: "border-destructive/35 bg-destructive/15",
  },
}

type Status = keyof typeof styles

export function StatusPill({
  status,
  className,
}: {
  status: Status
  className?: string
}) {
  const s = styles[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium text-white",
        s.tint,
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
