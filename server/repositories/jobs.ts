import "server-only"

import { getDb } from "@/lib/db"
import type {
  Company,
  Industry,
  Job,
  JobCategory,
  JobType,
  JobWithCompany,
} from "@/lib/data/types"
import type { CompanyDoc, JobDoc } from "@/server/models"

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export function toCompany(d: CompanyDoc): Company {
  return {
    id: d._id,
    name: d.name,
    industry: d.industry as Industry,
    location: d.location,
    employees: d.employees,
    website: d.website,
    description: d.description,
    logoUrl: d.logoVersion
      ? `/api/companies/${d._id}/logo?v=${d.logoVersion}`
      : undefined,
  }
}

export function toJob(d: JobDoc): Job {
  return {
    id: d._id,
    title: d.title,
    companyId: d.companyId,
    category: d.category as JobCategory,
    type: d.type as JobType,
    location: d.location,
    salaryMin: d.salaryMin,
    salaryMax: d.salaryMax,
    currency: d.currency ?? "USD",
    summary: d.summary,
    description: d.description,
    responsibilities: d.responsibilities,
    requirements: d.requirements,
    benefits: d.benefits,
    postedAt: d.postedAt,
    deadline: d.deadline,
    featured: d.featured,
  }
}

async function attachCompanies(
  jobs: JobDoc[],
  opts: { approvedOnly: boolean }
): Promise<JobWithCompany[]> {
  if (!jobs.length) return []
  const db = await getDb()
  const ids = [...new Set(jobs.map((j) => j.companyId))]
  const companies = await db
    .collection<CompanyDoc>("companies")
    .find({
      _id: { $in: ids },
      ...(opts.approvedOnly ? { status: "approved" } : {}),
    })
    .toArray()
  const byId = new Map(companies.map((c) => [c._id, c]))
  return jobs.flatMap((j) => {
    const c = byId.get(j.companyId)
    return c ? [{ ...toJob(j), company: toCompany(c) }] : []
  })
}

export type JobFilters = {
  q?: string
  location?: string
  types?: JobType[]
  category?: JobCategory
  minSalary?: number
  maxSalary?: number
}

/** Public search: active jobs of approved companies only. */
export async function getJobs(filters: JobFilters = {}) {
  const db = await getDb()
  const and: object[] = [{ status: "active" }]

  const q = filters.q?.trim()
  if (q) {
    const re = new RegExp(escapeRegex(q), "i")
    const matchingCompanies = await db
      .collection<CompanyDoc>("companies")
      .find({ name: re }, { projection: { _id: 1 } })
      .toArray()
    and.push({
      $or: [
        { title: re },
        { summary: re },
        { category: re },
        { companyId: { $in: matchingCompanies.map((c) => c._id) } },
      ],
    })
  }
  const loc = filters.location?.trim()
  if (loc) and.push({ location: new RegExp(escapeRegex(loc), "i") })
  if (filters.types?.length) and.push({ type: { $in: filters.types } })
  if (filters.category) and.push({ category: filters.category })
  if (filters.minSalary) and.push({ salaryMax: { $gte: filters.minSalary } })
  if (filters.maxSalary) and.push({ salaryMin: { $lte: filters.maxSalary } })

  const docs = await db
    .collection<JobDoc>("jobs")
    .find({ $and: and })
    .sort({ postedAt: -1 })
    .toArray()
  return attachCompanies(docs, { approvedOnly: true })
}

export async function getJob(
  id: string,
  opts: { includeInactive?: boolean } = {}
) {
  const db = await getDb()
  const doc = await db
    .collection<JobDoc>("jobs")
    .findOne(opts.includeInactive ? { _id: id } : { _id: id, status: "active" })
  if (!doc) return null
  const [job] = await attachCompanies([doc], {
    approvedOnly: !opts.includeInactive,
  })
  return job ?? null
}

/** Any status, any company state — for dashboard tables that reference jobs. */
export async function getJobsByIds(ids: string[]) {
  if (!ids.length) return new Map<string, JobWithCompany>()
  const db = await getDb()
  const docs = await db
    .collection<JobDoc>("jobs")
    .find({ _id: { $in: ids } })
    .toArray()
  const jobs = await attachCompanies(docs, { approvedOnly: false })
  return new Map(jobs.map((j) => [j.id, j]))
}

export async function getFeaturedJobs(limit = 6) {
  const db = await getDb()
  const docs = await db
    .collection<JobDoc>("jobs")
    .find({ status: "active", featured: true })
    .sort({ postedAt: -1 })
    .limit(limit)
    .toArray()
  return attachCompanies(docs, { approvedOnly: true })
}

export async function getLatestJobs(limit: number, excludeIds: string[] = []) {
  const db = await getDb()
  const docs = await db
    .collection<JobDoc>("jobs")
    .find({ status: "active", _id: { $nin: excludeIds } })
    .sort({ postedAt: -1 })
    .limit(limit)
    .toArray()
  return attachCompanies(docs, { approvedOnly: true })
}

export async function getSimilarJobs(job: Job, limit = 3) {
  const db = await getDb()
  const same = await db
    .collection<JobDoc>("jobs")
    .find({ status: "active", _id: { $ne: job.id }, category: job.category })
    .sort({ postedAt: -1 })
    .limit(limit)
    .toArray()
  let docs = same
  if (docs.length < limit) {
    const more = await db
      .collection<JobDoc>("jobs")
      .find({
        status: "active",
        _id: { $nin: [job.id, ...docs.map((d) => d._id)] },
      })
      .sort({ postedAt: -1 })
      .limit(limit - docs.length)
      .toArray()
    docs = [...docs, ...more]
  }
  return attachCompanies(docs, { approvedOnly: true })
}

export async function getCompanies(industry?: Industry) {
  const db = await getDb()
  const docs = await db
    .collection<CompanyDoc>("companies")
    .find({ status: "approved", ...(industry ? { industry } : {}) })
    .sort({ name: 1 })
    .toArray()
  const counts = await db
    .collection<JobDoc>("jobs")
    .aggregate<{ _id: string; n: number }>([
      {
        $match: {
          status: "active",
          companyId: { $in: docs.map((d) => d._id) },
        },
      },
      { $group: { _id: "$companyId", n: { $sum: 1 } } },
    ])
    .toArray()
  const byCompany = new Map(counts.map((c) => [c._id, c.n]))
  return docs.map((d) => ({
    ...toCompany(d),
    openJobs: byCompany.get(d._id) ?? 0,
  }))
}

export async function getCompany(id: string) {
  const db = await getDb()
  const doc = await db
    .collection<CompanyDoc>("companies")
    .findOne({ _id: id, status: "approved" })
  if (!doc) return null
  const jobDocs = await db
    .collection<JobDoc>("jobs")
    .find({ companyId: id, status: "active" })
    .sort({ postedAt: -1 })
    .toArray()
  const company = toCompany(doc)
  return {
    ...company,
    jobs: jobDocs.map((j) => ({ ...toJob(j), company })),
  }
}
