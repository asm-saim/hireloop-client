"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { toggleSaveJob } from "@/server/actions/seeker"

export function RemoveSavedButton({ jobId }: { jobId: string }) {
  const [pending, startTransition] = useTransition()
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await toggleSaveJob(jobId)
          if (!res.ok) toast.error(res.error)
          else toast.success("Removed from saved jobs")
        })
      }
    >
      <Trash2 aria-hidden />
      Remove
    </Button>
  )
}
