"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { STATUS_COLOR } from "@/components/dashboard/status-badge"
import { fieldClass } from "@/components/dashboard/form-parts"
import { cn } from "@/lib/utils"
import { updateApplicationStatusAction } from "@/server/actions/recruiter"
import {
  APPLICATION_STATUSES,
  STATUS_LABEL,
  type ApplicationStatus,
} from "@/server/models"

export function ApplicantStatusSelect({
  applicationId,
  applicantName,
  initial,
}: {
  applicationId: string
  applicantName: string
  initial: ApplicationStatus
}) {
  const [status, setStatus] = useState(initial)
  const [pending, startTransition] = useTransition()

  function onChange(next: ApplicationStatus) {
    const previous = status
    setStatus(next)
    startTransition(async () => {
      const res = await updateApplicationStatusAction(applicationId, next)
      if (!res.ok) {
        setStatus(previous)
        toast.error(res.error)
        return
      }
      toast.success(`${applicantName} is now ${STATUS_LABEL[next]}`)
    })
  }

  return (
    <span className="relative inline-flex items-center">
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 size-2 rounded-full"
        style={{ backgroundColor: STATUS_COLOR[status] }}
      />
      <select
        aria-label={`Status for ${applicantName}`}
        value={status}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as ApplicationStatus)}
        className={cn(
          fieldClass,
          "h-10 w-44 rounded-xl pr-3 pl-8 text-sm disabled:opacity-60"
        )}
      >
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
    </span>
  )
}
