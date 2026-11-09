import type { Metadata } from "next"
import Link from "next/link"
import { Building2, MapPin, Users } from "lucide-react"

import { CompanyAvatar } from "@/components/jobs/company-avatar"
import { PageHeading, PublicShell } from "@/components/site/public-shell"
import { getCompanies } from "@/lib/data/jobs"
import { INDUSTRIES, type Industry } from "@/lib/data/types"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Companies — HireLoop",
  description: "Explore verified companies that are hiring on HireLoop.",
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const raw = Array.isArray(sp.industry) ? sp.industry[0] : sp.industry
  const industry = (INDUSTRIES as readonly string[]).includes(raw ?? "")
    ? (raw as Industry)
    : undefined
  const companies = await getCompanies(industry)

  const tabs: { label: string; value?: Industry }[] = [
    { label: "All" },
    ...INDUSTRIES.map((i) => ({ label: i, value: i })),
  ]

  return (
    <PublicShell>
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8 xl:px-[3.75rem]">
        <PageHeading
          eyebrow="Companies"
          title="Teams worth working for"
          text="Every company here has been verified by HireLoop. Browse by industry and see who is hiring."
        />

        <nav
          aria-label="Filter by industry"
          className="mx-auto mt-10 flex max-w-[82.5rem] flex-wrap justify-center gap-2 sm:mt-14"
        >
          {tabs.map((t) => {
            const active = t.value === industry
            return (
              <Link
                key={t.label}
                href={
                  t.value
                    ? `/companies?industry=${encodeURIComponent(t.value)}`
                    : "/companies"
                }
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "border-white bg-white text-ink"
                    : "border-white/10 bg-chip-2 text-white hover:border-white/30"
                )}
              >
                {t.label}
              </Link>
            )
          })}
        </nav>

        <ul className="mx-auto mt-10 grid max-w-[82.5rem] gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {companies.map((c) => (
            <li key={c.id}>
              <article className="relative flex h-full flex-col gap-5 rounded-3xl border border-white/[0.07] bg-surface p-6 transition-colors focus-within:border-brand/60 hover:border-white/20">
                <div className="flex items-center gap-4">
                  <CompanyAvatar name={c.name} />
                  <div className="min-w-0">
                    <h2 className="font-tight text-xl font-medium text-white">
                      <Link
                        href={`/companies/${c.id}`}
                        className="outline-none after:absolute after:inset-0 after:rounded-3xl"
                      >
                        {c.name}
                      </Link>
                    </h2>
                    <p className="text-sm text-white/70">{c.industry}</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <MapPin aria-hidden className="size-4 shrink-0" />
                    {c.location}
                  </li>
                  <li className="flex items-center gap-2">
                    <Users aria-hidden className="size-4 shrink-0" />
                    {c.employees} employees
                  </li>
                </ul>
                <p className="mt-auto flex items-center gap-2 text-sm font-medium text-brand">
                  <Building2 aria-hidden className="size-4" />
                  {c.openJobs} open {c.openJobs === 1 ? "job" : "jobs"}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </PublicShell>
  )
}
