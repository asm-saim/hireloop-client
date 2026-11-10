"use client"

import { useState, useTransition } from "react"
import { Bookmark } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { toggleSaveJob } from "@/server/actions/seeker"

export function SaveButton({
  jobId,
  initialSaved,
  className,
}: {
  jobId: string
  initialSaved: boolean
  className?: string
}) {
  const [saved, setSaved] = useState(initialSaved)
  const [pending, startTransition] = useTransition()

  function onClick() {
    const next = !saved
    setSaved(next) // optimistic
    startTransition(async () => {
      const res = await toggleSaveJob(jobId)
      if (!res.ok) {
        setSaved(!next)
        toast.error(res.error)
        return
      }
      setSaved(res.saved)
      toast.success(res.saved ? "Job saved" : "Removed from saved jobs")
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={pending}
      aria-pressed={saved}
      className={className}
    >
      <Bookmark aria-hidden className={saved ? "fill-current" : undefined} />
      {saved ? "Saved" : "Save"}
    </Button>
  )
}
