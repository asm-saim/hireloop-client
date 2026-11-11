// Loads the sample companies and jobs into MongoDB. Safe to run repeatedly.
// Usage: npm run seed
import { MongoClient } from "mongodb"

import {
  commonBenefits,
  sampleCompanies,
  sampleJobSeeds,
} from "../server/seed-data"

const DAY = 86_400_000

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI is not set (put it in .env.local).")
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db("hireloop-database")

  for (const c of sampleCompanies) {
    const { id, ...rest } = c
    await db
      .collection("companies")
      .replaceOne(
        { _id: id as never },
        { ...rest, status: "approved" },
        { upsert: true }
      )
  }

  for (const s of sampleJobSeeds) {
    const { id, postedDaysAgo, deadlineInDays, featured, ...rest } = s
    await db.collection("jobs").replaceOne(
      { _id: id as never },
      {
        ...rest,
        currency: "USD",
        benefits: commonBenefits,
        postedAt: new Date(Date.now() - postedDaysAgo * DAY),
        deadline: new Date(Date.now() + deadlineInDays * DAY),
        featured: featured ?? false,
        status: "active",
      },
      { upsert: true }
    )
  }

  console.log(
    `Seeded ${sampleCompanies.length} companies and ${sampleJobSeeds.length} jobs.`
  )
  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
