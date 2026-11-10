import Link from "next/link"
import { Search } from "lucide-react"

import { FiltersDisclosure } from "@/components/jobs/filters-disclosure"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  type JobCategory,
  type JobType,
} from "@/lib/data/types"
import type { JobFilters } from "@/server/repositories/jobs"

type Params = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v
const many = (v: string | string[] | undefined) =>
  v === undefined ? [] : Array.isArray(v) ? v : [v]
const num = (v: string | undefined) => {
  const n = Number(v)
  return v && Number.isFinite(n) && n > 0 ? n : undefined
}

export type JobSearchValues = Required<Pick<JobFilters, "q" | "location">> &
  Pick<JobFilters, "category" | "minSalary" | "maxSalary"> & {
    types: JobType[]
  }

/** Reads and validates the filter query parameters of a search page. */
export function parseJobSearch(sp: Params): {
  values: JobSearchValues
  activeCount: number
} {
  const types = many(sp.type).filter((t): t is JobType =>
    (JOB_TYPES as readonly string[]).includes(t)
  )
  const cat = first(sp.category)
  const category = (JOB_CATEGORIES as readonly string[]).includes(cat ?? "")
    ? (cat as JobCategory)
    : undefined
  const values: JobSearchValues = {
    q: first(sp.q) ?? "",
    location: first(sp.location) ?? "",
    types,
    category,
    minSalary: num(first(sp.minSalary)),
    maxSalary: num(first(sp.maxSalary)),
  }
  const activeCount =
    (values.location ? 1 : 0) +
    types.length +
    (category ? 1 : 0) +
    (values.minSalary ? 1 : 0) +
    (values.maxSalary ? 1 : 0)
  return { values, activeCount }
}

const fieldClass =
  "h-11 w-full rounded-xl border border-white/20 bg-[#101010] px-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/25"

/** Keyword bar + filter sidebar + results slot. A plain GET form (no JS needed). */
export function JobSearch({
  action,
  values,
  activeCount,
  children,
}: {
  action: string
  values: JobSearchValues
  activeCount: number
  children: React.ReactNode
}) {
  return (
    <form action={action} method="get" className="flex flex-col gap-8">
      <div
        role="search"
        className="flex h-16 w-full max-w-[49rem] items-center gap-3 rounded-2xl border border-white/20 bg-[#101010] p-2 pl-5"
      >
        <Search aria-hidden className="size-6 shrink-0 text-white" />
        <label className="h-full flex-1">
          <span className="sr-only">Keyword</span>
          <Input
            name="q"
            defaultValue={values.q}
            placeholder="Job title, skill or company"
            autoComplete="off"
          />
        </label>
        <Button type="submit" size="sm" className="h-12 rounded-xl px-5">
          Search
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[17.5rem_1fr]">
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
                      defaultChecked={values.types.includes(t)}
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
                  defaultValue={values.location}
                  placeholder="City, country or Remote"
                  className={fieldClass}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-white">
                Category
                <select
                  name="category"
                  defaultValue={values.category ?? ""}
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
                      defaultValue={values.minSalary ?? ""}
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
                      defaultValue={values.maxSalary ?? ""}
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
                  render={<Link href={action} />}
                  nativeButton={false}
                >
                  Clear
                </Button>
              </div>
            </div>
          </FiltersDisclosure>
        </aside>

        <section aria-label="Results" className="flex min-w-0 flex-col gap-4">
          {children}
        </section>
      </div>
    </form>
  )
}
