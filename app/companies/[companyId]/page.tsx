import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Globe, MapPin, Users } from "lucide-react"

import { CompanyAvatar } from "@/components/jobs/company-avatar"
import { JobCard } from "@/components/jobs/job-card"
import { PublicShell } from "@/components/site/public-shell"
import { Badge } from "@/components/ui/badge"
import { getCompany } from "@/lib/data/jobs"

type Props = { params: Promise<{ companyId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { companyId } = await params
  const company = await getCompany(companyId)
  if (!company) return { title: "Company not found — HireLoop" }
  return {
    title: `${company.name} — HireLoop`,
    description: company.description,
  }
}

export default async function CompanyPage({ params }: Props) {
  const { companyId } = await params
  const company = await getCompany(companyId)
  if (!company) notFound()

  return (
    <PublicShell>
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8 xl:px-[3.75rem]">
        <div className="mx-auto max-w-[82.5rem]">
          <Link
            href="/companies"
            className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm text-white/80 transition-colors outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeft aria-hidden className="size-4" />
            All companies
          </Link>

          <header className="flex flex-col gap-6 rounded-3xl border border-white/[0.07] bg-surface p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <CompanyAvatar name={company.name} className="size-20 text-2xl" />
              <div className="flex flex-col gap-3">
                <h1 className="text-4xl leading-[1.15] font-bold tracking-[-0.036em] text-white">
                  {company.name}
                </h1>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
                  <li>
                    <Badge variant="tag">{company.industry}</Badge>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin aria-hidden className="size-4" />
                    {company.location}
                  </li>
                  <li className="flex items-center gap-2">
                    <Users aria-hidden className="size-4" />
                    {company.employees} employees
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe aria-hidden className="size-4" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                      {company.website.replace("https://", "")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <p className="max-w-3xl text-base leading-[1.7] text-white/80">
              {company.description}
            </p>
          </header>

          <section aria-labelledby="open-jobs" className="mt-14">
            <h2
              id="open-jobs"
              className="mb-6 text-3xl font-semibold tracking-[-0.03em] text-white"
            >
              Open jobs ({company.jobs.length})
            </h2>
            {company.jobs.length ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {company.jobs.map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
              </div>
            ) : (
              <p className="text-white/70">
                No open jobs right now. Check back soon.
              </p>
            )}
          </section>
        </div>
      </div>
    </PublicShell>
  )
}
