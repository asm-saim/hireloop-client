"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LoaderCircle, LogOut, Menu, X } from "lucide-react"

import { publicNav, roleLabel, roleNav } from "@/components/dashboard/nav"
import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"
import { initials } from "@/lib/format"
import type { SessionUser } from "@/lib/session"
import { cn } from "@/lib/utils"

function Avatar({ user }: { user: SessionUser }) {
  return user.image ? (
    // eslint-disable-next-line @next/next/no-img-element -- user avatars can come from any host
    <img
      src={user.image}
      alt=""
      className="size-11 shrink-0 rounded-full border border-white/10 object-cover"
    />
  ) : (
    <span
      aria-hidden
      className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-brand/80 to-[#1f1b4d] font-jakarta text-sm font-semibold text-white"
    >
      {initials(user.name) || "?"}
    </span>
  )
}

function SidebarContent({
  user,
  onNavigate,
}: {
  user: SessionUser
  onNavigate: () => void
}) {
  const pathname = usePathname()
  const [pending, setPending] = useState(false)
  const links = roleNav[user.role]

  async function logout() {
    setPending(true)
    try {
      await signOut()
    } finally {
      // Full reload so every client cache is dropped, then land on the homepage.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/")
    }
  }

  const isActive = (href: string) =>
    href === `/dashboard/${user.role}`
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`)

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
      active
        ? "bg-brand text-white"
        : "text-white/80 hover:bg-white/5 hover:text-white"
    )

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-5">
      <Logo />

      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-surface p-3">
        <Avatar user={user} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {user.name}
          </p>
          <p className="truncate text-xs text-white/60">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-brand/20 px-2 py-0.5 text-xs font-medium text-brand">
            {roleLabel[user.role]}
          </span>
        </div>
      </div>

      <nav aria-label="Dashboard" className="flex flex-col gap-1">
        {links.map(({ label, href, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={linkClass(active)}
            >
              <Icon aria-hidden className="size-5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <nav
        aria-label="Site"
        className="flex flex-col gap-1 border-t border-white/10 pt-4"
      >
        <p className="px-3 pb-1 text-xs font-medium tracking-wide text-white/50 uppercase">
          Explore
        </p>
        {publicNav.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className="rounded-xl px-3 py-2 text-sm text-white/70 transition-colors outline-none hover:bg-white/5 hover:text-white focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {label}
          </Link>
        ))}
      </nav>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={logout}
        disabled={pending}
        className="mt-auto w-full"
      >
        {pending ? (
          <LoaderCircle aria-hidden className="animate-spin" />
        ) : (
          <LogOut aria-hidden />
        )}
        {pending ? "Signing out…" : "Log out"}
      </Button>
    </div>
  )
}

export function DashboardShell({
  user,
  children,
}: {
  user: SessionUser
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  // Close the mobile drawer with Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[288px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-svh border-r border-white/10 bg-ink lg:block">
        <SidebarContent user={user} onNavigate={() => {}} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-ink/90 px-4 backdrop-blur lg:hidden">
        <Logo />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-white"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="dashboard-drawer"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </Button>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open ? "visible" : "invisible"
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <aside
          id="dashboard-drawer"
          className={cn(
            "absolute inset-y-0 left-0 w-[288px] max-w-[85vw] border-r border-white/10 bg-ink transition-transform duration-200",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 text-white"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
          <SidebarContent user={user} onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      <main className="min-w-0 p-4 sm:p-8">{children}</main>
    </div>
  )
}
