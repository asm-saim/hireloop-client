import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Logo } from "@/components/site/logo"

const highlights = [
  { value: "50K", label: "Active jobs" },
  { value: "12K", label: "Companies" },
  { value: "97%", label: "Satisfaction" },
]

/** Split layout: brand panel (lg+) on the left, form on the right. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 100%, rgb(92 83 254 / 0.55), rgb(92 83 254 / 0.18) 45%, transparent 75%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[length:140%] bg-bottom bg-no-repeat opacity-25"
          style={{
            backgroundImage: "url(/world-map.svg)",
            maskImage: "linear-gradient(to top, black 30%, transparent)",
            WebkitMaskImage: "linear-gradient(to top, black 30%, transparent)",
          }}
        />

        <Logo className="relative" />

        <div className="relative flex max-w-[520px] flex-col gap-8">
          <p className="flex items-center gap-4 font-mono-label text-base text-white">
            <span aria-hidden className="size-2 bg-brand" />
            50,000+ new jobs this month
          </p>
          <h2 className="font-rethink text-5xl leading-[1.15] font-medium tracking-[-0.023em] text-balance text-white xl:text-[56px]">
            Your next role is already looking for you
          </h2>
          <p className="text-lg leading-[1.6] text-white/80">
            Build a profile in three minutes. The matches start arriving
            tomorrow morning.
          </p>
          <dl className="mt-4 grid grid-cols-3 gap-4">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#010102] to-[#313131]/80 p-4"
              >
                <dd className="font-jakarta text-3xl font-semibold tracking-[-0.036em] text-white">
                  {h.value}
                </dd>
                <dt className="font-tight text-sm text-white/80">{h.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </aside>

      {/* Form side */}
      <div className="relative flex min-h-svh flex-col overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] lg:hidden"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 0%, rgb(92 83 254 / 0.35), transparent 70%)",
          }}
        />
        <header className="relative flex items-center justify-between px-4 py-6 sm:px-8">
          <Logo className="lg:invisible" />
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-white/80 transition-colors outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to home
          </Link>
        </header>

        <main className="relative flex flex-1 items-center justify-center px-4 pt-2 pb-12 sm:px-8">
          <div className="w-full max-w-[440px]">{children}</div>
        </main>
      </div>
    </div>
  )
}

export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-sm text-white/60">
      <span aria-hidden className="h-px flex-1 bg-white/15" />
      {children}
      <span aria-hidden className="h-px flex-1 bg-white/15" />
    </div>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {message}
    </p>
  )
}
