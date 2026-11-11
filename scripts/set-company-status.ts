// Usage: npm run company-status -- <companyId> approved
// Statuses: pending | approved | rejected. (The Admin dashboard does this in Part 3.)
import { MongoClient } from "mongodb"

const [id, status] = process.argv.slice(2)
if (!id || !["pending", "approved", "rejected"].includes(status ?? "")) {
  console.error(
    "Usage: npm run company-status -- <companyId> <pending|approved|rejected>"
  )
  process.exit(1)
}

const uri = process.env.MONGODB_URI
if (!uri) throw new Error("MONGODB_URI is not set (put it in .env.local).")
const client = new MongoClient(uri)
await client.connect()
const res = await client
  .db("hireloop-database")
  .collection("companies")
  .updateOne({ _id: id as never }, { $set: { status } })
console.log(
  res.matchedCount
    ? `Company ${id} is now ${status}.`
    : `No company with id ${id}.`
)
await client.close()
