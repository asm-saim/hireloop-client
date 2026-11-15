"use client"

import { cn } from "@/lib/utils"

/**
 * A card surface with a spotlight that follows the cursor.
 *
 * The pointer position is written straight to CSS custom properties on the
 * node, so tracking never triggers a React render.
 *
 * The overlay sits at `-z-10` inside an `isolate`d parent: that paints it above
 * the card's own background but below its content, so text and links stay on top.
 */
export function SpotlightCard({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "article"
  className?: string
  children: React.ReactNode
}) {
  function track(event: React.PointerEvent<HTMLElement>) {
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`)
    el.style.setProperty("--my", `${event.clientY - rect.top}px`)
  }

  const content = (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(22rem circle at var(--mx, 50%) var(--my, 50%), rgb(56 189 248 / 0.14), transparent 70%)",
        }}
      />
      {children}
    </>
  )

  const classes = cn("group/spot relative isolate", className)

  if (as === "article") {
    return (
      <article className={classes} onPointerMove={track}>
        {content}
      </article>
    )
  }

  return (
    <div className={classes} onPointerMove={track}>
      {content}
    </div>
  )
}
