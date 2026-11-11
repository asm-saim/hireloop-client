// Usage: npm run set-role -- someone@example.com admin
// Roles: seeker | recruiter | admin. Use this to create your first admin.
import { MongoClient } from "mongodb"

const [email, role] = process.argv.slice(2)
if (!email || !["seeker", "recruiter", "admin"].includes(role ?? "")) {
  console.error("Usage: npm run set-role -- <email> <seeker|recruiter|admin>")
  process.exit(1)
}

const uri = process.env.MONGODB_URI
if (!uri) throw new Error("MONGODB_URI is not set (put it in .env.local).")
const client = new MongoClient(uri)
await client.connect()
const res = await client
  .db("hireloop-database")
  .collection("user")
  .updateOne({ email }, { $set: { role } })
console.log(
  res.matchedCount ? `${email} is now ${role}.` : `No user with email ${email}.`
)
await client.close()
