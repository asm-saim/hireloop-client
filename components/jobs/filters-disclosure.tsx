"use client"

import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Collapsible filter panel on small screens, always open from lg up. */
export function FiltersDisclosure({
  children,
  activeCount,
}: {
  children: React.ReactNode
  activeCount: number
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit lg:hidden"
        aria-expanded={open}
        aria-controls="job-filters"
        onClick={() => setOpen((v) => !v)}
      >
        <SlidersHorizontal aria-hidden />
        Filters{activeCount ? ` (${activeCount})` : ""}
      </Button>
      <div id="job-filters" className={cn(!open && "hidden lg:block")}>
        {children}
      </div>
    </div>
  )
}
