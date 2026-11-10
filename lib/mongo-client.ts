import { MongoClient } from "mongodb"

export const DB_NAME = "hireloop-database"

declare global {
  // Reused across hot reloads in development so we don't open a new
  // connection pool on every file save.
  var __hireloopMongo: MongoClient | undefined
}

/** The single shared MongoClient for the whole app (including Better Auth). */
export function mongoClient(): MongoClient {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local.")
  return (globalThis.__hireloopMongo ??= new MongoClient(uri))
}
