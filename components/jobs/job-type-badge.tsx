import { BriefcaseBusiness } from "lucide-react"

import type { JobType } from "@/lib/data/types"
import { cn } from "@/lib/utils"

/**
 * Job type pill. Each type carries a hue from the brand ramp so a list of jobs
 * reads as colour-coded instead of a row of identical grey chips.
 */
const tints: Record<JobType, string> = {
  "Full-time": "border-brand/35 bg-brand/15",
  "Part-time": "border-white/15 bg-white/10",
  Remote: "border-aqua/35 bg-aqua/15",
  Contract: "border-gold/35 bg-gold/15",
  Internship: "border-mint/35 bg-mint/15",
}

export function JobTypeBadge({
  type,
  className,
}: {
  type: JobType
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center justify-center gap-2 overflow-hidden rounded-full border py-1.5 pr-3 pl-2 font-tight text-sm whitespace-nowrap text-white",
        tints[type] ?? "border-white/10 bg-chip",
        className
      )}
    >
      <BriefcaseBusiness aria-hidden className="size-4 shrink-0" />
      {type}
    </span>
  )
}
