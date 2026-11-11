import "server-only"

import { ObjectId, Binary } from "mongodb"

import { getDb } from "@/lib/db"
import { makeId } from "@/server/services/ids"
import {
  type ApplicationDoc,
  type ApplicationStatus,
  type CompanyDoc,
  type CompanyLogoDoc,
  type JobDoc,
  type JobStatus,
  type ProfileDoc,
  type SubscriptionDoc,
} from "@/server/models"

// ---------- company ----------

export async function getCompanyByOwner(userId: string) {
  const db = await getDb()
  return db.collection<CompanyDoc>("companies").findOne({ ownerId: userId })
}

export type CompanyInput = {
  name: string
  industry: string
  website: string
  location: string
  employees: string
  description: string
}

/**
 * Creates the recruiter's company (status "pending") or updates it. Editing an
 * approved company keeps it approved; editing a rejected one resubmits it.
 */
export async function saveCompany(
  userId: string,
  input: CompanyInput,
  logo?: { data: Buffer; type: string }
) {
  const db = await getDb()
  const companies = db.collection<CompanyDoc>("companies")
  const existing = await companies.findOne({ ownerId: userId })
  const version = Date.now()
  let id: string

  if (existing) {
    id = existing._id
    await companies.updateOne(
      { _id: id },
      {
        $set: {
          ...input,
          status: existing.status === "rejected" ? "pending" : existing.status,
          ...(logo ? { logoVersion: version } : {}),
        },
      }
    )
  } else {
    id = makeId(input.name)
    await companies.insertOne({
      _id: id,
      ...input,
      status: "pending",
      ownerId: userId,
      ...(logo ? { logoVersion: version } : {}),
    })
  }

  if (logo) {
    await db
      .collection<CompanyLogoDoc>("company_logos")
      .replaceOne(
        { _id: id },
        { data: new Binary(logo.data), type: logo.type, version },
        { upsert: true }
      )
  }
  return id
}

// ---------- jobs ----------

export type CompanyJobRow = {
  id: string
  title: string
  status: JobStatus
  postedAt: Date
  applicants: number
}

export async function listCompanyJobs(
  companyId: string
): Promise<CompanyJobRow[]> {
  const db = await getDb()
  const jobs = await db
    .collection<JobDoc>("jobs")
    .find({ companyId })
    .sort({ postedAt: -1 })
    .toArray()
  const counts = await db
    .collection<ApplicationDoc>("applications")
    .aggregate<{ _id: string; n: number }>([
      { $match: { companyId } },
      { $group: { _id: "$jobId", n: { $sum: 1 } } },
    ])
    .toArray()
  const byJob = new Map(counts.map((c) => [c._id, c.n]))
  return jobs.map((j) => ({
    id: j._id,
    title: j.title,
    status: j.status,
    postedAt: j.postedAt,
    applicants: byJob.get(j._id) ?? 0,
  }))
}

export async function getCompanyJob(companyId: string, jobId: string) {
  const db = await getDb()
  return db.collection<JobDoc>("jobs").findOne({ _id: jobId, companyId })
}

export async function countActiveJobs(companyId: string) {
  const db = await getDb()
  return db
    .collection<JobDoc>("jobs")
    .countDocuments({ companyId, status: "active" })
}

export async function insertJob(doc: Omit<JobDoc, "_id">) {
  const db = await getDb()
  const _id = makeId(doc.title)
  await db.collection<JobDoc>("jobs").insertOne({ _id, ...doc })
  return _id
}

export async function updateJobFields(
  companyId: string,
  jobId: string,
  fields: Partial<Omit<JobDoc, "_id" | "companyId">>
) {
  const db = await getDb()
  const res = await db
    .collection<JobDoc>("jobs")
    .updateOne({ _id: jobId, companyId }, { $set: fields })
  return res.matchedCount > 0
}

export async function deleteJob(companyId: string, jobId: string) {
  const db = await getDb()
  const res = await db
    .collection<JobDoc>("jobs")
    .deleteOne({ _id: jobId, companyId })
  return res.deletedCount > 0
}

// ---------- applicants ----------

export type ApplicantRow = {
  id: string
  status: ApplicationStatus
  createdAt: Date
  coverLetter?: string
  userId: string
  name: string
  email: string
  headline: string
  resumeUrl: string
}

type AuthUser = { _id: unknown; name?: string; email?: string }

export async function listApplicants(jobId: string): Promise<ApplicantRow[]> {
  const db = await getDb()
  const apps = await db
    .collection<ApplicationDoc>("applications")
    .find({ jobId })
    .sort({ createdAt: -1 })
    .toArray()
  if (!apps.length) return []

  const ids = [...new Set(apps.map((a) => a.userId))]
  // Better Auth stores user ids as ObjectIds; accept string ids too.
  const keys = ids.flatMap((id) =>
    ObjectId.isValid(id) ? [new ObjectId(id), id] : [id]
  )
  const users = await db
    .collection<AuthUser>("user")
    .find({ _id: { $in: keys as never[] } })
    .toArray()
  const userById = new Map(users.map((u) => [String(u._id), u]))
  const profiles = await db
    .collection<ProfileDoc>("profiles")
    .find({ _id: { $in: ids } })
    .toArray()
  const profileById = new Map(profiles.map((p) => [p._id, p]))

  return apps.map((a) => {
    const u = userById.get(a.userId)
    const p = profileById.get(a.userId)
    return {
      id: a._id,
      status: a.status,
      createdAt: a.createdAt,
      coverLetter: a.coverLetter,
      userId: a.userId,
      name: u?.name ?? "Unknown applicant",
      email: u?.email ?? "",
      headline: p?.headline ?? "",
      resumeUrl: p?.resumeUrl ?? "",
    }
  })
}

export async function getCompanyApplication(
  companyId: string,
  applicationId: string
) {
  const db = await getDb()
  return db
    .collection<ApplicationDoc>("applications")
    .findOne({ _id: applicationId, companyId })
}

export async function setApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  const db = await getDb()
  await db
    .collection<ApplicationDoc>("applications")
    .updateOne(
      { _id: applicationId },
      { $set: { status, updatedAt: new Date() } }
    )
}

export async function getUserBasics(userId: string) {
  const db = await getDb()
  const key = ObjectId.isValid(userId) ? new ObjectId(userId) : userId
  return db
    .collection<AuthUser>("user")
    .findOne({ _id: key as never }, { projection: { name: 1, email: 1 } })
}

// ---------- overview ----------

export async function recruiterStats(companyId: string) {
  const db = await getDb()
  const [byStatus, applicants] = await Promise.all([
    db
      .collection<JobDoc>("jobs")
      .aggregate<{ _id: JobStatus; n: number }>([
        { $match: { companyId } },
        { $group: { _id: "$status", n: { $sum: 1 } } },
      ])
      .toArray(),
    db.collection<ApplicationDoc>("applications").countDocuments({ companyId }),
  ])
  const n = (s: JobStatus) => byStatus.find((r) => r._id === s)?.n ?? 0
  return {
    totalJobs: n("active") + n("closed") + n("draft"),
    active: n("active"),
    closed: n("closed"),
    applicants,
  }
}

/** Applicants received in the last 30 days, per job post (published jobs only). */
export async function applicantsPerJobLast30(companyId: string) {
  const db = await getDb()
  const since = new Date(Date.now() - 30 * 86_400_000)
  const [jobs, counts] = await Promise.all([
    db
      .collection<JobDoc>("jobs")
      .find({ companyId, status: { $ne: "draft" } })
      .sort({ postedAt: -1 })
      .toArray(),
    db
      .collection<ApplicationDoc>("applications")
      .aggregate<{ _id: string; n: number }>([
        { $match: { companyId, createdAt: { $gte: since } } },
        { $group: { _id: "$jobId", n: { $sum: 1 } } },
      ])
      .toArray(),
  ])
  const byJob = new Map(counts.map((c) => [c._id, c.n]))
  return jobs
    .map((j) => ({ title: j.title, applicants: byJob.get(j._id) ?? 0 }))
    .slice(0, 8)
}

export async function recentApplicants(companyId: string, limit = 6) {
  const db = await getDb()
  const apps = await db
    .collection<ApplicationDoc>("applications")
    .find({ companyId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
  if (!apps.length) return []
  const jobs = await db
    .collection<JobDoc>("jobs")
    .find(
      { _id: { $in: apps.map((a) => a.jobId) } },
      { projection: { title: 1 } }
    )
    .toArray()
  const titleById = new Map(jobs.map((j) => [j._id, j.title]))
  const users = await Promise.all(apps.map((a) => getUserBasics(a.userId)))
  return apps.map((a, i) => ({
    id: a._id,
    jobId: a.jobId,
    jobTitle: titleById.get(a.jobId) ?? "a job",
    name: users[i]?.name ?? "Someone",
    createdAt: a.createdAt,
  }))
}

export async function getRecruiterPlan(userId: string) {
  const db = await getDb()
  const doc = await db
    .collection<SubscriptionDoc>("subscriptions")
    .findOne({ _id: userId })
  return doc?.plan === "growth" || doc?.plan === "enterprise"
    ? doc.plan
    : "free"
}
