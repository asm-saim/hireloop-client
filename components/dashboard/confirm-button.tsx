"use client"

import { useState, useTransition } from "react"
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
import { cn } from "@/lib/utils"

type Result = { ok: true } | { ok: false; error: string }

/** A small button that asks for confirmation before running a server action. */
export function ConfirmButton({
  label,
  title,
  description,
  confirmLabel,
  successMessage,
  action,
  destructive = false,
  disabled = false,
}: {
  label: string
  title: string
  description: string
  confirmLabel: string
  successMessage: string
  action: () => Promise<Result>
  destructive?: boolean
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function run() {
    startTransition(async () => {
      const res = await action()
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success(successMessage)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(destructive && "text-destructive")}
          />
        }
      >
        {label}
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
            onClick={run}
            disabled={pending}
            className={cn(
              destructive && "bg-destructive text-white hover:bg-destructive/90"
            )}
          >
            {pending ? "Working…" : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
