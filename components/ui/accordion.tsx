"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "rounded-2xl border border-white/[0.07] bg-surface transition-colors data-[open]:border-white/20",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger flex flex-1 items-center justify-between gap-4 rounded-2xl p-5 text-left font-tight text-lg font-medium text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 text-white/70 transition-transform group-data-[panel-open]/trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-200 data-[ending-style]:h-0 data-[starting-style]:h-0"
      {...props}
    >
      <div
        className={cn(
          "px-5 pb-5 text-base leading-[1.7] text-white/80",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
