import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-28 w-full resize-y rounded-2xl border border-white/20 bg-[#101010] px-4 py-3 text-base text-white transition-colors outline-none placeholder:text-white/40 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/25 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
