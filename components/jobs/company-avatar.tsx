import { initials } from "@/lib/format"
import { cn } from "@/lib/utils"

/** Company logo when uploaded, otherwise initials on the brand gradient. */
export function CompanyAvatar({
  name,
  logoUrl,
  className,
}: {
  name: string
  logoUrl?: string
  className?: string
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- served by our own logo route with long-lived caching
      <img
        src={logoUrl}
        alt=""
        className={cn(
          "size-12 shrink-0 rounded-xl border border-white/10 bg-white object-contain p-1",
          className
        )}
      />
    )
  }
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
