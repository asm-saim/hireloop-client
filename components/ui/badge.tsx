import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border border-transparent font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        // Pill used for job details (location, schedule, salary).
        chip: "border-white/10 bg-white/[0.06] py-1.5 pr-3 pl-2 font-tight text-sm text-white",
        // Pill used for trending searches.
        tag: "border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white",
        // Accent pill (e.g. the yearly-discount flag).
        accent: "border-aqua/35 bg-aqua/15 px-2 py-0.5 text-sm text-aqua",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
