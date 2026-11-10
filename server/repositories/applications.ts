import "server-only"

import { randomUUID } from "node:crypto"

import { getDb } from "@/lib/db"
import type { JobWithCompany } from "@/lib/data/types"
import { getJobsByIds } from "@/server/repositories/jobs"
import {
  APPLICATION_STATUSES,
  type ApplicationDoc,
  type ApplicationStatus,
} from "@/server/models"

export type ApplicationRow = {
  id: string
  status: ApplicationStatus
  createdAt: Date
  updatedAt: Date
  jobId: string
  job: JobWithCompany | null
}

const col = async () =>
  (await getDb()).collection<ApplicationDoc>("applications")

export async function listApplications(
  userId: string
): Promise<ApplicationRow[]> {
  const docs = await (
    await col()
  )
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()
  const jobs = await getJobsByIds(docs.map((d) => d.jobId))
  return docs.map((d) => ({
    id: d._id,
    status: d.status,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    jobId: d.jobId,
    job: jobs.get(d.jobId) ?? null,
  }))
}

export async function statusCounts(userId: string) {
  const rows = await (
    await col()
  )
    .aggregate<{ _id: ApplicationStatus; n: number }>([
      { $match: { userId } },
      { $group: { _id: "$status", n: { $sum: 1 } } },
    ])
    .toArray()
  const counts = Object.fromEntries(
    APPLICATION_STATUSES.map((s) => [s, 0])
  ) as Record<ApplicationStatus, number>
  for (const r of rows) counts[r._id] = r.n
  return counts
}

export async function applicationsThisMonth(userId: string) {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  return (await col()).countDocuments({ userId, createdAt: { $gte: start } })
}

export async function appliedJobIds(userId: string) {
  const docs = await (
    await col()
  )
    .find({ userId }, { projection: { jobId: 1 } })
    .toArray()
  return new Set(docs.map((d) => d.jobId))
}

/** Returns false when the user already applied (unique index on user+job). */
export async function createApplication(input: {
  userId: string
  jobId: string
  companyId: string
  coverLetter?: string
}) {
  const now = new Date()
  try {
    await (
      await col()
    ).insertOne({
      _id: randomUUID(),
      jobId: input.jobId,
      companyId: input.companyId,
      userId: input.userId,
      status: "applied",
      coverLetter: input.coverLetter || undefined,
      createdAt: now,
      updatedAt: now,
    })
    return true
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return false
    throw e
  }
}
