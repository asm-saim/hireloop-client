import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { roleLabel, roleNav } from "@/components/dashboard/nav"
import { requireUser } from "@/lib/session"

export default async function DashboardOverview() {
  const user = await requireUser()
  const links = roleNav[user.role].filter((l) => !l.href.endsWith(user.role))

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="font-mono-label text-sm text-brand">
          {roleLabel[user.role]}
        </p>
        <h1 className="text-3xl leading-[1.15] font-bold tracking-[-0.03em] text-white sm:text-4xl">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-white/70">
          Your stats and charts will appear here in the next build phase.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {links.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-surface p-5 text-white transition-colors outline-none hover:border-white/20 focus-visible:border-brand/60"
            >
              <span className="flex items-center gap-3 font-medium">
                <Icon aria-hidden className="size-5 text-brand" />
                {label}
              </span>
              <ArrowRight
                aria-hidden
                className="size-4 text-white/50 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
