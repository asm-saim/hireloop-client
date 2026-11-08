import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db("hireloop-database")

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
  }),
})