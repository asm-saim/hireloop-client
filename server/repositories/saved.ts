import "server-only"

import { randomUUID } from "node:crypto"

import { getDb } from "@/lib/db"
import type { JobWithCompany } from "@/lib/data/types"
import { getJobsByIds } from "@/server/repositories/jobs"
import type { SavedJobDoc } from "@/server/models"

const col = async () => (await getDb()).collection<SavedJobDoc>("saved_jobs")

export type SavedRow = {
  id: string
  savedAt: Date
  jobId: string
  job: JobWithCompany | null
}

export async function listSaved(userId: string): Promise<SavedRow[]> {
  const docs = await (
    await col()
  )
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()
  const jobs = await getJobsByIds(docs.map((d) => d.jobId))
  return docs.map((d) => ({
    id: d._id,
    savedAt: d.createdAt,
    jobId: d.jobId,
    job: jobs.get(d.jobId) ?? null,
  }))
}

export async function savedJobIds(userId: string) {
  const docs = await (
    await col()
  )
    .find({ userId }, { projection: { jobId: 1 } })
    .toArray()
  return new Set(docs.map((d) => d.jobId))
}

export async function countSaved(userId: string) {
  return (await col()).countDocuments({ userId })
}

export async function saveJob(userId: string, jobId: string) {
  await (
    await col()
  ).updateOne(
    { userId, jobId },
    {
      $setOnInsert: { _id: randomUUID(), userId, jobId, createdAt: new Date() },
    },
    { upsert: true }
  )
}

export async function unsaveJob(userId: string, jobId: string) {
  await (await col()).deleteOne({ userId, jobId })
}
