import { cn } from "@/lib/utils"

/** Eyebrow (framed by two brand squares) + 48px centered title. */
export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string
  title: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-[32.5rem] flex-col items-center gap-4 text-center",
        className
      )}
    >
      <p className="flex items-center gap-3 font-mono-label text-sm tracking-[0.18em] text-aqua/90 uppercase sm:gap-4 sm:text-base">
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-gradient-to-r from-brand to-aqua"
        />
        {eyebrow}
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-gradient-to-r from-aqua to-mint"
        />
      </p>
      <h2 className="font-tight text-3xl leading-[1.15] font-semibold tracking-[-0.045em] text-balance text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
    </div>
  )
}
