"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, LoaderCircle } from "lucide-react"
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
import {
  cancelSubscriptionAction,
  changePlanAction,
  confirmCheckoutAction,
} from "@/server/actions/billing"
import type { VariantProps } from "class-variance-authority"

type Variant = VariantProps<typeof buttonVariants>["variant"]

export function PlanButton({
  plan,
  label,
  variant = "default",
  className,
}: {
  plan: string
  label: string
  variant?: Variant
  className?: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function onClick() {
    startTransition(async () => {
      const res = await changePlanAction(plan)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      if (res.mode === "checkout") {
        // Leaves the app: Stripe hosts the payment page.
        window.location.assign(res.url)
        return
      }
      toast.success(`You're now on the ${res.label} plan`, {
        description: "Stripe will prorate the difference on your next invoice.",
      })
      router.refresh()
    })
  }

  return (
    <Button
      type="button"
      variant={variant}
      onClick={onClick}
      disabled={pending}
      className={className}
    >
      {pending && <LoaderCircle aria-hidden className="animate-spin" />}
      {label}
      {!pending && <ArrowRight aria-hidden className="size-6" />}
    </Button>
  )
}

export function CancelSubscriptionButton({
  label = "Cancel subscription",
  variant = "outline",
  className,
}: {
  label?: string
  variant?: Variant
  className?: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function confirm() {
    startTransition(async () => {
      const res = await cancelSubscriptionAction()
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Subscription will end at the close of this billing period")
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant={variant}
            size="sm"
            className={className}
          />
        }
      >
        {label}
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <DialogTitle>Cancel your subscription?</DialogTitle>
          <DialogDescription>
            You keep your paid features until the end of the current billing
            period, then your account returns to the Free plan. You can
            resubscribe any time.
          </DialogDescription>
        </div>
        <div className="flex justify-end gap-3">
          <DialogClose
            render={<Button type="button" variant="outline" size="sm" />}
          >
            Keep my plan
          </DialogClose>
          <Button
            type="button"
            size="sm"
            onClick={confirm}
            disabled={pending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {pending ? "Cancelling…" : "Cancel subscription"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/** Runs once after Stripe sends the user back: confirms the payment and shows a toast. */
export function CheckoutReturn({
  sessionId,
  path,
}: {
  sessionId: string
  path: string
}) {
  const router = useRouter()
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true
    confirmCheckoutAction(sessionId).then((res) => {
      if (res.ok) {
        toast.success("Payment successful", {
          description: `Your ${res.label} plan is now active.`,
        })
      } else {
        toast.error(res.error)
      }
      router.replace(path)
      router.refresh()
    })
  }, [sessionId, path, router])

  return null
}
