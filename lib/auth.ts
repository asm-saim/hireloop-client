import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

import { DB_NAME, mongoClient } from "@/lib/mongo-client"

const client = mongoClient()
const db = client.db(DB_NAME)

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "seeker", input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Never trust the role sent by the browser: only these two are allowed.
        before: async (user) => {
          const role = (user as { role?: string }).role
          return {
            data: {
              ...user,
              role: role === "recruiter" ? "recruiter" : "seeker",
            },
          }
        },
      },
    },
  },
  database: mongodbAdapter(db, {
    client,
    // Transactions need a replica set (MongoDB Atlas always is one). Against a
    // plain local mongod, set MONGODB_TRANSACTIONS=false in .env.local.
    transaction: process.env.MONGODB_TRANSACTIONS !== "false",
  }),
})
