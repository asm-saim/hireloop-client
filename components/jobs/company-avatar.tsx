import { initials } from "@/lib/format"
import { cn } from "@/lib/utils"

/** Logo placeholder: initials on the brand gradient (no logo images yet). */
export function CompanyAvatar({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-brand/80 to-[#1f1b4d] font-jakarta text-base font-semibold text-white",
        className
      )}
    >
      {initials(name)}
    </span>
  )
}
