"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/site/logo"
import { useSession } from "@/lib/auth-client"

const links = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8 lg:pt-6 xl:px-[3.75rem]">
      <div className="relative mx-auto max-w-[82.5rem]">
        <div className="flex h-[4.625rem] items-center justify-between rounded-2xl border border-white/[0.07] bg-nav pr-2 pl-5 sm:pl-6">
          <Logo />

          {/* Desktop */}
          <nav
            aria-label="Main"
            className="hidden items-center gap-6 pr-2 lg:flex"
          >
            <ul className="flex items-center gap-8 lg:gap-10">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-geist text-base tracking-[-0.012em] text-white transition-colors hover:text-white/70 focus-visible:text-white/70 focus-visible:outline-none"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <span aria-hidden className="h-px w-6 rotate-90 bg-[#a8a8a8]/40" />
            <div className="flex items-center gap-2">
              {session ? (
                <Button
                  render={<Link href="/dashboard" />}
                  nativeButton={false}
                  className="h-[3.25rem]"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    render={<Link href="/login" />}
                    nativeButton={false}
                    className="text-base"
                  >
                    Sign In
                  </Button>

                  <Button
                    render={<Link href="/register" />}
                    nativeButton={false}
                    className="h-[3.10rem] text-base"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-1 text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-[5.125rem] rounded-2xl border border-white/[0.07] bg-nav p-4 lg:hidden"
            >
              <ul className="flex flex-col">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 font-geist text-base text-white hover:bg-white/5"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                {session ? (
                  <Button
                    className="col-span-2"
                    render={<Link href="/dashboard" />}
                    nativeButton={false}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      render={<Link href="/login" />}
                      nativeButton={false}
                    >
                      Sign In
                    </Button>
                    <Button
                      render={<Link href="/register" />}
                      nativeButton={false}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
