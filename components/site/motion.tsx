"use client"

import { useSyncExternalStore } from "react"
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

/**
 * Shared Framer Motion presets — same values as Framer-Motion-guide.md.
 * Content is fully visible on the server and with reduced motion; the
 * fade-in is only switched on after the browser has hydrated.
 */
const ease = [0.22, 1, 0.36, 1] as const

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6, ease },
} as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

// false on the server and during hydration, true afterwards in the browser
function useAnimationsEnabled() {
  const reduce = useReducedMotion()
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  return hydrated && !reduce
}

export function FadeIn({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  const enabled = useAnimationsEnabled()
  if (!enabled) {
    return <div className={className}>{children as React.ReactNode}</div>
  }
  return (
    <motion.div className={className} {...fadeInUp} {...props}>
      {children}
    </motion.div>
  )
}

export function Stagger({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  const enabled = useAnimationsEnabled()
  if (!enabled) {
    return <div className={className}>{children as React.ReactNode}</div>
  }
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  className,
  children,
  hover = false,
  ...props
}: HTMLMotionProps<"div"> & { hover?: boolean }) {
  const enabled = useAnimationsEnabled()
  if (!enabled) {
    return <div className={className}>{children as React.ReactNode}</div>
  }
  return (
    <motion.div
      className={cn(className)}
      variants={item}
      whileHover={hover ? { y: -4 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}