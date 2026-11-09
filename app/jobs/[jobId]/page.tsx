import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  CircleDollarSign,
  MapPin,
} from "lucide-react"

import { CompanyAvatar } from "@/components/jobs/company-avatar"
import { JobCard } from "@/components/jobs/job-card"
import { PublicShell } from "@/components/site/public-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getJob, getSimilarJobs } from "@/lib/data/jobs"
import { formatDate, formatSalary, timeAgo } from "@/lib/format"

type Props = { params: Promise<{ jobId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { jobId } = await params
  const job = await getJob(jobId)
  if (!job) return { title: "Job not found — HireLoop" }
  return {
    title: `${job.title} at ${job.company.name} — HireLoop`,
    description: job.summary,
  }
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white">
        {title}
      </h2>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-base leading-[1.7] text-white/80"
          >
            <span aria-hidden className="mt-2.5 size-1.5 shrink-0 bg-brand" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default async function JobDetailsPage({ params }: Props) {
  const { jobId } = await params
  const job = await getJob(jobId)
  if (!job) notFound()
  const similar = await getSimilarJobs(job)

  return (
    <PublicShell>
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8 xl:px-[3.75rem]">
        <div className="mx-auto max-w-[82.5rem]">
          <Link
            href="/jobs"
            className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm text-white/80 transition-colors outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeft aria-hidden className="size-4" />
            All jobs
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_22.5rem]">
            <article className="flex flex-col gap-10">
              <header className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default" className="px-3 py-1 text-sm">
                    {job.type}
                  </Badge>
                  <Badge variant="tag">{job.category}</Badge>
                </div>
                <h1 className="text-4xl leading-[1.15] font-bold tracking-[-0.036em] text-balance text-white sm:text-5xl">
                  {job.title}
                </h1>
                <ul className="flex flex-wrap gap-x-6 gap-y-3 text-white/80">
                  <li className="flex items-center gap-2">
                    <MapPin aria-hidden className="size-5" />
                    {job.location}
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleDollarSign aria-hidden className="size-5" />
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </li>
                  <li className="flex items-center gap-2">
                    <BriefcaseBusiness aria-hidden className="size-5" />
                    Posted {timeAgo(job.postedAt)}
                  </li>
                </ul>
              </header>

              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white">
                  About the role
                </h2>
                <p className="text-base leading-[1.7] text-white/80">
                  {job.description}
                </p>
              </section>

              <Section title="Responsibilities" items={job.responsibilities} />
              <Section title="Requirements" items={job.requirements} />
              <Section title="Benefits" items={job.benefits} />
            </article>

            <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
              <div className="flex flex-col gap-5 rounded-3xl border border-white/[0.07] bg-surface p-6">
                <div>
                  <p className="font-jakarta text-2xl font-semibold tracking-[-0.03em] text-white">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-white/70">
                    <CalendarClock aria-hidden className="size-4" />
                    Apply by {formatDate(job.deadline)}
                  </p>
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  render={<Link href="/login" />}
                  nativeButton={false}
                >
                  Apply now
                </Button>
                <p className="text-sm text-white/60">
                  You need to sign in to apply. The Free plan includes 3
                  applications per month.
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-3xl border border-white/[0.07] bg-surface p-6">
                <div className="flex items-center gap-4">
                  <CompanyAvatar name={job.company.name} />
                  <div>
                    <h2 className="font-tight text-lg font-medium text-white">
                      {job.company.name}
                    </h2>
                    <p className="flex items-center gap-1.5 text-sm text-white/70">
                      <MapPin aria-hidden className="size-4" />
                      {job.company.location}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-[1.7] text-white/70">
                  {job.company.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`/companies/${job.company.id}`} />}
                  nativeButton={false}
                >
                  View company
                </Button>
              </div>
            </aside>
          </div>

          {similar.length > 0 && (
            <section aria-labelledby="similar" className="mt-20">
              <h2
                id="similar"
                className="mb-6 text-3xl font-semibold tracking-[-0.03em] text-white"
              >
                Similar jobs
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {similar.map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </PublicShell>
  )
}
