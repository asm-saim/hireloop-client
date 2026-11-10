import "server-only"

import type { Db } from "mongodb"
import { connection } from "next/server"

import { DB_NAME, mongoClient } from "@/lib/mongo-client"

let indexesReady: Promise<unknown> | undefined

async function ensureIndexes(db: Db) {
  await Promise.all([
    db
      .collection("applications")
      .createIndex({ userId: 1, jobId: 1 }, { unique: true }),
    db.collection("applications").createIndex({ userId: 1, createdAt: -1 }),
    db
      .collection("saved_jobs")
      .createIndex({ userId: 1, jobId: 1 }, { unique: true }),
    db.collection("jobs").createIndex({ status: 1, postedAt: -1 }),
    db.collection("payments").createIndex({ userId: 1, createdAt: -1 }),
  ])
}

/**
 * Database handle for server code. Calling it opts the page out of build-time
 * prerendering (the data changes per request) and makes sure indexes exist.
 */
export async function getDb(): Promise<Db> {
  await connection()
  const db = mongoClient().db(DB_NAME)
  indexesReady ??= ensureIndexes(db).catch((e) => {
    indexesReady = undefined
    throw e
  })
  await indexesReady
  return db
}
