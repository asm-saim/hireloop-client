import { CancelSubscriptionButton } from "@/components/billing/plan-actions"
import { formatDate } from "@/lib/format"
import type { SubscriptionDoc } from "@/server/models"

/** Renewal / cancellation line with a Cancel button for active paid plans. */
export function SubscriptionNote({ sub }: { sub: SubscriptionDoc | null }) {
  if (!sub || sub.plan === "free" || sub.status === "canceled") return null
  const end = sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd) : null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-sm text-white/80">
        {sub.status === "canceling"
          ? `Your plan ends${end ? ` on ${end}` : " at the end of this billing period"}, then you move to Free.`
          : end
            ? `Renews on ${end}.`
            : "Your subscription is active."}
      </p>
      {sub.status !== "canceling" && <CancelSubscriptionButton />}
    </div>
  )
}
