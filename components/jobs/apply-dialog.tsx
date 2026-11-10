"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, LoaderCircle } from "lucide-react"
import { toast } from "sonner"

import { Button, type buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { applyToJob } from "@/server/actions/seeker"
import type { VariantProps } from "class-variance-authority"

type Props = {
  jobId: string
  jobTitle: string
  companyName: string
  /** guest = signed out, seeker = can apply, other = recruiter/admin */
  viewer: "guest" | "seeker" | "other"
  alreadyApplied?: boolean
  size?: VariantProps<typeof buttonVariants>["size"]
  className?: string
}

export function ApplyDialog({
  jobId,
  jobTitle,
  companyName,
  viewer,
  alreadyApplied = false,
  size = "default",
  className,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  if (viewer === "guest") {
    return (
      <Button
        size={size}
        className={className}
        render={<Link href="/login" />}
        nativeButton={false}
      >
        Sign in to apply
      </Button>
    )
  }
  if (viewer === "other") {
    return (
      <Button size={size} className={className} disabled>
        Only job seekers can apply
      </Button>
    )
  }
  if (alreadyApplied) {
    return (
      <Button size={size} variant="secondary" className={className} disabled>
        <Check aria-hidden />
        Applied
      </Button>
    )
  }

  function submit() {
    setError(null)
    startTransition(async () => {
      const res = await applyToJob({ jobId, coverLetter })
      if (!res.ok) {
        setError(res.error)
        return
      }
      toast.success("Application submitted", {
        description: `Good luck with ${companyName}!`,
      })
      setOpen(false)
      setCoverLetter("")
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size={size} className={className} />}>
        Apply now
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Your profile will be sent to {companyName}. Add a short cover letter
            if you like.
          </DialogDescription>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-white">
          Cover letter (optional)
          <Textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            maxLength={3000}
            placeholder="Tell them why you're a great fit…"
          />
        </label>
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <DialogClose
            render={<Button type="button" variant="outline" size="sm" />}
          >
            Cancel
          </DialogClose>
          <Button type="button" size="sm" onClick={submit} disabled={pending}>
            {pending && <LoaderCircle aria-hidden className="animate-spin" />}
            {pending ? "Submitting…" : "Submit application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
