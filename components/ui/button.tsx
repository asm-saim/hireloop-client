"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_0.1875rem_0.625rem_rgb(255_255_255/0.2)] hover:bg-primary/90",
        // Solid white button used for primary actions on dark surfaces.
        light:
          "border-[#090a15]/10 bg-white text-[#0b0b14] shadow-[inset_0_0.1875rem_0.625rem_rgb(255_255_255/0.2)] hover:bg-white/90",
        outline:
          "border-[#d7d7d7]/30 bg-[#0e0b16] text-foreground hover:bg-white/10",
        secondary: "bg-[#595959]/50 text-foreground hover:bg-[#595959]/70",
        ghost: "text-primary hover:bg-white/5",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[3.25rem] px-6 text-lg",
        sm: "h-10 px-4 text-base",
        lg: "h-[3.625rem] px-6 text-lg",
        icon: "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
