import type { Metadata } from "next"
import Link from "next/link"
import { Search, SearchX } from "lucide-react"

import { FiltersDisclosure } from "@/components/jobs/filters-disclosure"
import { JobCard } from "@/components/jobs/job-card"
import { PageHeading, PublicShell } from "@/components/site/public-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getJobs } from "@/lib/data/jobs"
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  type JobCategory,
  type JobType,
} from "@/lib/data/types"

export const metadata: Metadata = {
  title: "Browse jobs — HireLoop",
  description: "Search and filter thousands of curated job openings.",
}

type Params = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v
const many = (v: string | string[] | undefined) =>
  v === undefined ? [] : Array.isArray(v) ? v : [v]
const num = (v: string | undefined) => {
  const n = Number(v)
  return v && Number.isFinite(n) && n > 0 ? n : undefined
}

const fieldClass =
  "h-11 w-full rounded-xl border border-white/20 bg-[#101010] px-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/25"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Params>
}) {
  const sp = await searchParams
  const q = first(sp.q) ?? ""
  const location = first(sp.location) ?? ""
  const types = many(sp.type).filter((t): t is JobType =>
    (JOB_TYPES as readonly string[]).includes(t)
  )
  const categoryParam = first(sp.category)
  const category = (JOB_CATEGORIES as readonly string[]).includes(
    categoryParam ?? ""
  )
    ? (categoryParam as JobCategory)
    : undefined
  const minSalary = num(first(sp.minSalary))
  const maxSalary = num(first(sp.maxSalary))

  const jobs = await getJobs({
    q,
    location,
    types,
    category,
    minSalary,
    maxSalary,
  })

  const activeCount =
    (location ? 1 : 0) +
    types.length +
    (category ? 1 : 0) +
    (minSalary ? 1 : 0) +
    (maxSalary ? 1 : 0)

  return (
    <PublicShell>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 xl:px-[60px]">
        <PageHeading
          eyebrow="Browse jobs"
          title="Find a role that fits"
          text="Search by keyword, then narrow down by type, location, salary and category."
        />

        <form
          action="/jobs"
          method="get"
          className="mx-auto mt-10 flex max-w-[1320px] flex-col gap-8 sm:mt-14"
        >
          {/* Keyword search */}
          <div
            role="search"
            className="mx-auto flex h-16 w-full max-w-[784px] items-center gap-3 rounded-2xl border border-white/20 bg-[#101010] p-2 pl-5"
          >
            <Search aria-hidden className="size-6 shrink-0 text-white" />
            <label className="h-full flex-1">
              <span className="sr-only">Keyword</span>
              <Input
                name="q"
                defaultValue={q}
                placeholder="Job title, skill or company"
                autoComplete="off"
              />
            </label>
            <Button type="submit" size="sm" className="h-12 rounded-xl px-5">
              Search
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Filters */}
            <aside
              aria-label="Filters"
              className="lg:sticky lg:top-6 lg:self-start"
            >
              <FiltersDisclosure activeCount={activeCount}>
                <div className="flex flex-col gap-6 rounded-3xl border border-white/[0.07] bg-surface p-5">
                  <fieldset className="flex flex-col gap-3">
                    <legend className="mb-1 text-sm font-medium text-white">
                      Job type
                    </legend>
                    {JOB_TYPES.map((t) => (
                      <label
                        key={t}
                        className="flex cursor-pointer items-center gap-3 text-sm text-white"
                      >
                        <input
                          type="checkbox"
                          name="type"
                          value={t}
                          defaultChecked={types.includes(t)}
                          className="size-5 cursor-pointer rounded-md border border-white/30 bg-[#101010] accent-[#5c53fe]"
                        />
                        {t}
                      </label>
                    ))}
                  </fieldset>

                  <label className="flex flex-col gap-2 text-sm font-medium text-white">
                    Location
                    <input
                      name="location"
                      defaultValue={location}
                      placeholder="City, country or Remote"
                      className={fieldClass}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-medium text-white">
                    Category
                    <select
                      name="category"
                      defaultValue={category ?? ""}
                      className={fieldClass}
                    >
                      <option value="">All categories</option>
                      {JOB_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  <fieldset className="flex flex-col gap-2">
                    <legend className="mb-1 text-sm font-medium text-white">
                      Salary (USD / year)
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                      <label>
                        <span className="sr-only">Minimum salary</span>
                        <input
                          name="minSalary"
                          type="number"
                          min={0}
                          step={5000}
                          inputMode="numeric"
                          defaultValue={minSalary ?? ""}
                          placeholder="Min"
                          className={fieldClass}
                        />
                      </label>
                      <label>
                        <span className="sr-only">Maximum salary</span>
                        <input
                          name="maxSalary"
                          type="number"
                          min={0}
                          step={5000}
                          inputMode="numeric"
                          defaultValue={maxSalary ?? ""}
                          placeholder="Max"
                          className={fieldClass}
                        />
                      </label>
                    </div>
                  </fieldset>

                  <div className="flex gap-3">
                    <Button type="submit" size="sm" className="flex-1">
                      Apply filters
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href="/jobs" />}
                      nativeButton={false}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </FiltersDisclosure>
            </aside>

            {/* Results */}
            <section aria-label="Results" className="flex flex-col gap-4">
              <p className="text-sm text-white/70" aria-live="polite">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
              </p>
              {jobs.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/20 px-6 py-16 text-center">
                  <SearchX aria-hidden className="size-8 text-white/60" />
                  <h2 className="text-xl font-medium text-white">
                    No jobs match your search
                  </h2>
                  <p className="max-w-sm text-white/70">
                    Try removing a filter or searching for a broader keyword.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href="/jobs" />}
                    nativeButton={false}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </section>
          </div>
        </form>
      </div>
    </PublicShell>
  )
}
