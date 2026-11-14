"use client"

import { Button } from "@/components/ui/button"
import { ConfirmButton } from "@/components/dashboard/confirm-button"
import {
  removeJobAction,
  setCompanyStatusAction,
  setUserRoleAction,
  setUserStatusAction,
} from "@/server/actions/admin"
import Link from "next/link"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function UserActions({
  userId,
  name,
  role,
  status,
  isSelf,
}: {
  userId: string
  name: string
  role: string
  status: string
  isSelf: boolean
}) {
  if (isSelf || role === "admin")
    return <span className="text-white/50">{isSelf ? "You" : "Admin"}</span>
  const next = role === "seeker" ? "recruiter" : "seeker"
  const nextLabel = next === "recruiter" ? "Recruiter" : "Job Seeker"
  const suspended = status === "suspended"
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <ConfirmButton
        label={`Make ${next === "recruiter" ? "Recruiter" : "Seeker"}`}
        title={`Make ${name} a ${nextLabel}?`}
        description={
          next === "recruiter"
            ? "They will be able to register a company and post jobs."
            : "They will lose recruiter tools. Their company and jobs stay in the system."
        }
        confirmLabel={`Make ${nextLabel}`}
        successMessage={`${name} is now a ${nextLabel}`}
        action={() => setUserRoleAction(userId, next)}
      />
      <ConfirmButton
        label={suspended ? "Activate" : "Suspend"}
        title={suspended ? `Activate ${name}?` : `Suspend ${name}?`}
        description={
          suspended
            ? "They will be able to sign in again."
            : "They will be signed out immediately and won't be able to sign in until reactivated."
        }
        confirmLabel={suspended ? "Activate account" : "Suspend account"}
        successMessage={
          suspended ? `${name} was activated` : `${name} was suspended`
        }
        destructive={!suspended}
        action={() =>
          setUserStatusAction(userId, suspended ? "active" : "suspended")
        }
      />
    </div>
  )
}

export function CompanyActions({
  companyId,
  name,
  status,
}: {
  companyId: string
  name: string
  status: "pending" | "approved" | "rejected"
}) {
  const [pending, startTransition] = useTransition()
  const [, setTick] = useState(0)

  function approve() {
    startTransition(async () => {
      const res = await setCompanyStatusAction(companyId, "approved")
      if (!res.ok) toast.error(res.error)
      else toast.success(`${name} is now public`)
      setTick((t) => t + 1)
    })
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {status !== "approved" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={approve}
          disabled={pending}
        >
          Approve
        </Button>
      )}
      {status !== "rejected" && (
        <ConfirmButton
          label="Reject"
          title={`Reject ${name}?`}
          description="The company and all its jobs are removed from public listings until it is approved again."
          confirmLabel="Reject company"
          successMessage={`${name} was rejected`}
          destructive
          action={() => setCompanyStatusAction(companyId, "rejected")}
        />
      )}
    </div>
  )
}

export function JobAdminActions({
  jobId,
  title,
}: {
  jobId: string
  title: string
}) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        render={<Link href={`/jobs/${jobId}`} />}
        nativeButton={false}
      >
        View
      </Button>
      <ConfirmButton
        label="Remove"
        title="Remove this job?"
        description={`“${title}” will be deleted for good. This can't be undone.`}
        confirmLabel="Remove job"
        successMessage="Job removed"
        destructive
        action={() => removeJobAction(jobId)}
      />
    </div>
  )
}
