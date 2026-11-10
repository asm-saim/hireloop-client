import { initials } from "@/lib/format"
import { cn } from "@/lib/utils"

export function UserAvatar({
  name,
  image,
  className,
}: {
  name: string
  image: string | null
  className?: string
}) {
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element -- user avatars can come from any host
    <img
      src={image}
      alt=""
      className={cn(
        "size-11 shrink-0 rounded-full border border-white/10 object-cover",
        className
      )}
    />
  ) : (
    <span
      aria-hidden
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-brand/80 to-[#1f1b4d] font-jakarta text-sm font-semibold text-white",
        className
      )}
    >
      {initials(name) || "?"}
    </span>
  )
}
