"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { getSessionUser, type SessionUser } from "@/lib/session"
import {
  getUserById,
  removeJob,
  revokeSessions,
  setCompanyStatus,
  updateUser,
} from "@/server/repositories/admin"

type Fail = { ok: false; error: string }
type Ok = { ok: true }

async function adminOrFail(): Promise<{ user: SessionUser } | Fail> {
  const user = await getSessionUser()
  if (!user) return { ok: false, error: "Please sign in to continue." }
  if (user.role !== "admin")
    return { ok: false, error: "Only admins can do this." }
  return { user }
}

const refresh = () => {
  revalidatePath("/dashboard/admin", "layout")
  revalidatePath("/jobs", "layout")
  revalidatePath("/companies", "layout")
}

const idSchema = z.string().min(1).max(100)

/** The target must exist, must not be the admin themselves, and must not be an admin. */
async function manageableUser(
  admin: SessionUser,
  userId: string
): Promise<Fail | null> {
  if (!idSchema.safeParse(userId).success)
    return { ok: false, error: "Invalid user." }
  if (userId === admin.id)
    return { ok: false, error: "You can't change your own account here." }
  const target = await getUserById(userId)
  if (!target) return { ok: false, error: "User not found." }
  if (target.role === "admin")
    return { ok: false, error: "Admin accounts can't be changed here." }
  return null
}

export async function setUserRoleAction(
  userId: string,
  role: string
): Promise<Ok | Fail> {
  const auth = await adminOrFail()
  if ("ok" in auth) return auth
  const parsed = z.enum(["seeker", "recruiter"]).safeParse(role)
  if (!parsed.success) return { ok: false, error: "Invalid role." }
  const blocked = await manageableUser(auth.user, userId)
  if (blocked) return blocked
  await updateUser(userId, { role: parsed.data })
  refresh()
  return { ok: true }
}

export async function setUserStatusAction(
  userId: string,
  status: string
): Promise<Ok | Fail> {
  const auth = await adminOrFail()
  if ("ok" in auth) return auth
  const parsed = z.enum(["active", "suspended"]).safeParse(status)
  if (!parsed.success) return { ok: false, error: "Invalid status." }
  const blocked = await manageableUser(auth.user, userId)
  if (blocked) return blocked
  await updateUser(userId, { status: parsed.data })
  // Suspending ends their sessions right away; sign-in is blocked by an auth hook.
  if (parsed.data === "suspended") await revokeSessions(userId)
  refresh()
  return { ok: true }
}

export async function setCompanyStatusAction(
  companyId: string,
  status: string
): Promise<Ok | Fail> {
  const auth = await adminOrFail()
  if ("ok" in auth) return auth
  const parsed = z.enum(["approved", "rejected"]).safeParse(status)
  if (!parsed.success || !idSchema.safeParse(companyId).success)
    return { ok: false, error: "Invalid request." }
  const updated = await setCompanyStatus(companyId, parsed.data)
  if (!updated) return { ok: false, error: "Company not found." }
  refresh()
  return { ok: true }
}

export async function removeJobAction(jobId: string): Promise<Ok | Fail> {
  const auth = await adminOrFail()
  if ("ok" in auth) return auth
  if (!idSchema.safeParse(jobId).success)
    return { ok: false, error: "Invalid job." }
  if (!(await removeJob(jobId))) return { ok: false, error: "Job not found." }
  refresh()
  revalidatePath(`/jobs/${jobId}`)
  return { ok: true }
}
