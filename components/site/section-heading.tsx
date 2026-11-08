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
        "mx-auto flex max-w-[520px] flex-col items-center gap-4 text-center",
        className
      )}
    >
      <p className="flex items-center gap-4 font-mono-label text-base text-white sm:text-xl">
        <span aria-hidden className="size-2 bg-brand" />
        {eyebrow}
        <span aria-hidden className="size-2 bg-brand" />
      </p>
      <h2 className="text-3xl leading-[1.15] font-semibold tracking-[-0.04em] text-balance text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
    </div>
  )
}
