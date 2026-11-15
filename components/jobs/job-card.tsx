import Link from "next/link"
import { CircleDollarSign, MapPin } from "lucide-react"

import { JobTypeBadge } from "@/components/jobs/job-type-badge"
import { CompanyAvatar } from "@/components/jobs/company-avatar"
import { SpotlightCard } from "@/components/site/spotlight-card"
import { Badge } from "@/components/ui/badge"
import { formatSalary, timeAgo } from "@/lib/format"
import type { JobWithCompany } from "@/lib/data/types"

export function JobCard({
  job,
  href,
  actions,
}: {
  job: JobWithCompany
  href?: string
  /** Buttons shown at the bottom (Save / Apply…). Sit above the card link. */
  actions?: React.ReactNode
}) {
  return (
    <SpotlightCard
      as="article"
      className="flex flex-col gap-5 rounded-3xl surface p-6 transition-colors focus-within:border-brand/60 hover:surface-hover"
    >
      <div className="flex items-start gap-4">
        <CompanyAvatar name={job.company.name} logoUrl={job.company.logoUrl} />
        <div className="min-w-0">
          <h3 className="font-tight text-xl leading-snug font-semibold text-white">
            <Link
              href={href ?? `/jobs/${job.id}`}
              className="outline-none after:absolute after:inset-0 after:rounded-3xl"
            >
              {job.title}
            </Link>
          </h3>
          <p className="text-sm text-white/70">{job.company.name}</p>
        </div>
      </div>

      <p className="text-base leading-normal text-white/70">{job.summary}</p>

      <ul className="flex flex-wrap gap-2">
        <li>
          <Badge variant="chip">
            <MapPin aria-hidden />
            {job.location}
          </Badge>
        </li>
        <li>
          <JobTypeBadge type={job.type} />
        </li>
        <li>
          <Badge variant="chip">
            <CircleDollarSign aria-hidden />
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </Badge>
        </li>
      </ul>

      <p className="text-sm text-white/50">Posted {timeAgo(job.postedAt)}</p>

      {actions && (
        <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-1">
          {actions}
        </div>
      )}
    </SpotlightCard>
  )
}
