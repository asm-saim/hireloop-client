import "server-only"

import { ObjectId } from "mongodb"

import { getDb } from "@/lib/db"
import type {
  CompanyDoc,
  JobDoc,
  PaymentDoc,
  SubscriptionDoc,
} from "@/server/models"

export type AuthUser = {
  _id: unknown
  name?: string
  email?: string
  role?: string
  status?: string
  createdAt?: Date
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** Better Auth ids are ObjectIds; accept plain strings too. */
export function userKeys(ids: string[]) {
  return ids.flatMap((id) =>
    ObjectId.isValid(id) ? [new ObjectId(id), id] : [id]
  ) as never[]
}

// ---------- overview ----------

export async function adminStats() {
  const db = await getDb()
  const users = db.collection<AuthUser>("user")
  const [total, recruiters, companies, jobs, revenue] = await Promise.all([
    users.countDocuments({}),
    users.countDocuments({ role: "recruiter" }),
    db.collection<CompanyDoc>("companies").countDocuments({}),
    db.collection<JobDoc>("jobs").countDocuments({}),
    db
      .collection<PaymentDoc>("payments")
      .aggregate<{ total: number }>([
        { $match: { status: "succeeded" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      .toArray(),
  ])
  return {
    users: total,
    recruiters,
    companies,
    jobs,
    revenue: revenue[0]?.total ?? 0,
  }
}

export async function jobsByCategory() {
  const db = await getDb()
  const rows = await db
    .collection<JobDoc>("jobs")
    .aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray()
  return rows.map((r) => ({ category: r._id, count: r.count }))
}

/** New registrations per day for the last 30 days (including zero days). */
export async function signupsLast30() {
  const db = await getDb()
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  start.setUTCDate(start.getUTCDate() - 29)
  const rows = await db
    .collection<AuthUser>("user")
    .aggregate<{ _id: string; n: number }>([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "UTC",
            },
          },
          n: { $sum: 1 },
        },
      },
    ])
    .toArray()
  const byDay = new Map(rows.map((r) => [r._id, r.n]))
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(start)
    d.setUTCDate(start.getUTCDate() + i)
    const key = d.toISOString().slice(0, 10)
    return {
      date: key,
      label: d.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      count: byDay.get(key) ?? 0,
    }
  })
}

export async function recentPayments(limit = 5) {
  const db = await getDb()
  return db
    .collection<PaymentDoc>("payments")
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
}

// ---------- users ----------

export type UserRow = {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: Date | null
}

export async function listUsers(opts: {
  q?: string
  role?: string
}): Promise<UserRow[]> {
  const db = await getDb()
  const filter: Record<string, unknown> = {}
  if (opts.q?.trim()) filter.email = new RegExp(escapeRegex(opts.q.trim()), "i")
  if (opts.role === "seeker" || opts.role === "recruiter")
    filter.role = opts.role
  const docs = await db
    .collection<AuthUser>("user")
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray()
  return docs.map((u) => ({
    id: String(u._id),
    name: u.name ?? "—",
    email: u.email ?? "—",
    role: u.role ?? "seeker",
    status: u.status ?? "active",
    createdAt: u.createdAt ?? null,
  }))
}

export async function getUserById(id: string) {
  const db = await getDb()
  return db
    .collection<AuthUser>("user")
    .findOne({ _id: { $in: userKeys([id]) } })
}

export async function updateUser(id: string, fields: Record<string, unknown>) {
  const db = await getDb()
  const res = await db
    .collection<AuthUser>("user")
    .updateOne(
      { _id: { $in: userKeys([id]) } },
      { $set: { ...fields, updatedAt: new Date() } }
    )
  return res.matchedCount > 0
}

export async function revokeSessions(userId: string) {
  const db = await getDb()
  await db
    .collection("session")
    .deleteMany({ userId: { $in: userKeys([userId]) } })
}

// ---------- companies ----------

export type CompanyAdminRow = {
  id: string
  name: string
  ownerEmail: string
  industry: string
  status: CompanyDoc["status"]
  createdAt: Date | null
}

export async function listCompaniesAdmin(): Promise<CompanyAdminRow[]> {
  const db = await getDb()
  const companies = await db
    .collection<CompanyDoc>("companies")
    .find({})
    .sort({ createdAt: -1, name: 1 })
    .toArray()
  const ownerIds = [
    ...new Set(companies.flatMap((c) => (c.ownerId ? [c.ownerId] : []))),
  ]
  const owners = ownerIds.length
    ? await db
        .collection<AuthUser>("user")
        .find(
          { _id: { $in: userKeys(ownerIds) } },
          { projection: { email: 1 } }
        )
        .toArray()
    : []
  const emailById = new Map(owners.map((o) => [String(o._id), o.email ?? "—"]))
  return companies.map((c) => ({
    id: c._id,
    name: c.name,
    ownerEmail: c.ownerId ? (emailById.get(c.ownerId) ?? "—") : "—",
    industry: c.industry,
    status: c.status,
    createdAt: c.createdAt ?? null,
  }))
}

export async function setCompanyStatus(
  id: string,
  status: "approved" | "rejected"
) {
  const db = await getDb()
  const res = await db
    .collection<CompanyDoc>("companies")
    .updateOne({ _id: id }, { $set: { status } })
  return res.matchedCount > 0
}

// ---------- jobs ----------

export type JobAdminRow = {
  id: string
  title: string
  companyName: string
  category: string
  type: string
  postedAt: Date
  status: JobDoc["status"]
}

export async function listJobsAdmin(opts: {
  q?: string
  status?: string
  category?: string
}): Promise<JobAdminRow[]> {
  const db = await getDb()
  const and: object[] = []
  if (opts.status === "active" || opts.status === "closed")
    and.push({ status: opts.status })
  if (opts.category) and.push({ category: opts.category })
  const q = opts.q?.trim()
  if (q) {
    const re = new RegExp(escapeRegex(q), "i")
    const matching = await db
      .collection<CompanyDoc>("companies")
      .find({ name: re }, { projection: { _id: 1 } })
      .toArray()
    and.push({
      $or: [{ title: re }, { companyId: { $in: matching.map((c) => c._id) } }],
    })
  }
  const jobs = await db
    .collection<JobDoc>("jobs")
    .find(and.length ? { $and: and } : {})
    .sort({ postedAt: -1 })
    .limit(200)
    .toArray()
  const companies = await db
    .collection<CompanyDoc>("companies")
    .find(
      { _id: { $in: [...new Set(jobs.map((j) => j.companyId))] } },
      { projection: { name: 1 } }
    )
    .toArray()
  const nameById = new Map(companies.map((c) => [c._id, c.name]))
  return jobs.map((j) => ({
    id: j._id,
    title: j.title,
    companyName: nameById.get(j.companyId) ?? "—",
    category: j.category,
    type: j.type,
    postedAt: j.postedAt,
    status: j.status,
  }))
}

export async function removeJob(id: string) {
  const db = await getDb()
  const res = await db.collection<JobDoc>("jobs").deleteOne({ _id: id })
  return res.deletedCount > 0
}

// ---------- payments ----------

export async function paymentsSummary() {
  const db = await getDb()
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)
  const sum = async (match: object) =>
    (
      await db
        .collection<PaymentDoc>("payments")
        .aggregate<{ total: number }>([
          { $match: { status: "succeeded", ...match } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ])
        .toArray()
    )[0]?.total ?? 0
  const subs = db.collection<SubscriptionDoc>("subscriptions")
  const [total, monthly, seekerSubs, recruiterSubs] = await Promise.all([
    sum({}),
    sum({ createdAt: { $gte: monthStart } }),
    subs.countDocuments({
      plan: { $in: ["pro", "premium"] },
      status: { $ne: "canceled" },
    }),
    subs.countDocuments({
      plan: { $in: ["growth", "enterprise"] },
      status: { $ne: "canceled" },
    }),
  ])
  return { total, monthly, seekerSubs, recruiterSubs }
}

export async function listAllPayments() {
  const db = await getDb()
  return db
    .collection<PaymentDoc>("payments")
    .find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray()
}
