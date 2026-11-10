import "server-only"

import { getDb } from "@/lib/db"
import type { ProfileDoc, PaymentDoc, SubscriptionDoc } from "@/server/models"
import { normalizeSeekerPlan } from "@/server/services/plan-limits"

export async function getProfile(userId: string): Promise<ProfileDoc> {
  const db = await getDb()
  const doc = await db
    .collection<ProfileDoc>("profiles")
    .findOne({ _id: userId })
  return (
    doc ?? { _id: userId, headline: "", bio: "", skills: [], resumeUrl: "" }
  )
}

export async function saveProfile(
  userId: string,
  data: Omit<ProfileDoc, "_id">
) {
  const db = await getDb()
  await db
    .collection<ProfileDoc>("profiles")
    .updateOne({ _id: userId }, { $set: data }, { upsert: true })
}

export async function getSeekerPlan(userId: string) {
  const db = await getDb()
  const doc = await db
    .collection<SubscriptionDoc>("subscriptions")
    .findOne({ _id: userId })
  return normalizeSeekerPlan(doc?.plan)
}

export async function listPayments(userId: string) {
  const db = await getDb()
  return db
    .collection<PaymentDoc>("payments")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()
}
