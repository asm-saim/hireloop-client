"use client"

import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: InputPrimitive.Props) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-full w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white/80 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
