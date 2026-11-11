"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { LockOpen, Lock, Pencil, Trash2, Users } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteJobAction, setJobStatusAction } from "@/server/actions/recruiter"
import type { JobStatus } from "@/server/models"

export function JobRowActions({
  jobId,
  title,
  status,
}: {
  jobId: string
  title: string
  status: JobStatus
}) {
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  function toggle() {
    startTransition(async () => {
      const res = await setJobStatusAction(
        jobId,
        status === "active" ? "closed" : "active"
      )
      if (!res.ok) toast.error(res.error)
      else toast.success(status === "active" ? "Job closed" : "Job reopened")
    })
  }

  function remove() {
    startTransition(async () => {
      const res = await deleteJobAction(jobId)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Job deleted")
      setOpen(false)
    })
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        render={<Link href={`/dashboard/recruiter/jobs/${jobId}/edit`} />}
        nativeButton={false}
      >
        <Pencil aria-hidden />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        render={<Link href={`/dashboard/recruiter/jobs/${jobId}/applicants`} />}
        nativeButton={false}
      >
        <Users aria-hidden />
        Applicants
      </Button>
      {status !== "draft" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggle}
          disabled={pending}
        >
          {status === "active" ? (
            <Lock aria-hidden />
          ) : (
            <LockOpen aria-hidden />
          )}
          {status === "active" ? "Close" : "Reopen"}
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive"
            />
          }
        >
          <Trash2 aria-hidden />
          Delete
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col gap-2">
            <DialogTitle>Delete this job?</DialogTitle>
            <DialogDescription>
              &ldquo;{title}&rdquo; will be removed for good. Applicants will no
              longer be able to open it. This can&apos;t be undone.
            </DialogDescription>
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose
              render={<Button type="button" variant="outline" size="sm" />}
            >
              Cancel
            </DialogClose>
            <Button
              type="button"
              size="sm"
              onClick={remove}
              disabled={pending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {pending ? "Deleting…" : "Delete job"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
