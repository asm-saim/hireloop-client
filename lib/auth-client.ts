import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export type Role = "seeker" | "recruiter"

export type LoginInput = {
  email: string
  password: string
  remember: boolean
}

export type RegisterInput = {
  role: Role
  name: string
  email: string
  password: string
}

export const authClient = createAuthClient({
  // Leave undefined if the app and the auth API are on the same domain.
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [inferAdditionalFields({ user: { role: { type: "string" } } })],
})

export const { signIn, signUp, signOut, useSession } = authClient

const GENERIC_ERROR = "Something went wrong. Please try again."

// /dashboard looks up the user's role and forwards to the right dashboard.
const AFTER_AUTH = "/dashboard"

export async function login({ email, password, remember }: LoginInput) {
  const { error } = await authClient.signIn.email({
    email,
    password,
    rememberMe: remember,
  })
  if (error) throw new Error(error.message ?? GENERIC_ERROR)
  window.location.assign(AFTER_AUTH)
}

export async function register({ role, name, email, password }: RegisterInput) {
  const { error } = await authClient.signUp.email({
    name,
    email,
    password,
    role,
  })
  if (error) throw new Error(error.message ?? GENERIC_ERROR)
  window.location.assign(AFTER_AUTH)
}

export async function startGoogleSignIn() {
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: AFTER_AUTH,
  })
  if (error) throw new Error(error.message ?? GENERIC_ERROR)
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/