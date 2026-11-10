"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { getSessionUser, type SessionUser } from "@/lib/session"
import {
  applicationsThisMonth,
  createApplication,
} from "@/server/repositories/applications"
import { getJob } from "@/server/repositories/jobs"
import { getSeekerPlan, saveProfile } from "@/server/repositories/profiles"
import {
  countSaved,
  saveJob,
  savedJobIds,
  unsaveJob,
} from "@/server/repositories/saved"
import { SEEKER_LIMITS } from "@/server/services/plan-limits"

type Fail = { ok: false; error: string }
type Ok<T = object> = { ok: true } & T

async function seekerOrFail(): Promise<{ user: SessionUser } | Fail> {
  const user = await getSessionUser()
  if (!user) return { ok: false, error: "Please sign in to continue." }
  if (user.role !== "seeker")
    return { ok: false, error: "Only job seekers can do this." }
  return { user }
}

function refresh() {
  revalidatePath("/dashboard/seeker", "layout")
}

const idSchema = z.string().min(1).max(100)

export async function toggleSaveJob(
  jobId: string
): Promise<Ok<{ saved: boolean }> | Fail> {
  const auth = await seekerOrFail()
  if ("ok" in auth) return auth
  const id = idSchema.safeParse(jobId)
  if (!id.success) return { ok: false, error: "Invalid job." }

  const { user } = auth
  const already = (await savedJobIds(user.id)).has(id.data)
  if (already) {
    await unsaveJob(user.id, id.data)
    refresh()
    return { ok: true, saved: false }
  }

  const job = await getJob(id.data)
  if (!job) return { ok: false, error: "This job is no longer available." }

  const limit = SEEKER_LIMITS[await getSeekerPlan(user.id)].savedJobs
  if (limit !== null && (await countSaved(user.id)) >= limit) {
    return {
      ok: false,
      error: `Your plan allows up to ${limit} saved jobs. Upgrade for unlimited saves.`,
    }
  }

  await saveJob(user.id, id.data)
  refresh()
  return { ok: true, saved: true }
}

const applySchema = z.object({
  jobId: idSchema,
  coverLetter: z
    .string()
    .trim()
    .max(3000, "Cover letter is too long.")
    .optional(),
})

export async function applyToJob(input: {
  jobId: string
  coverLetter?: string
}): Promise<Ok | Fail> {
  const auth = await seekerOrFail()
  if ("ok" in auth) return auth
  const parsed = applySchema.safeParse(input)
  if (!parsed.success)
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid request.",
    }

  const { user } = auth
  const job = await getJob(parsed.data.jobId)
  if (!job) return { ok: false, error: "This job is no longer available." }
  if (job.deadline.getTime() < Date.now())
    return {
      ok: false,
      error: "The application deadline for this job has passed.",
    }

  const plan = await getSeekerPlan(user.id)
  const limit = SEEKER_LIMITS[plan].applicationsPerMonth
  if (limit !== null && (await applicationsThisMonth(user.id)) >= limit) {
    return {
      ok: false,
      error: `You've used all ${limit} applications on your plan this month. Upgrade to apply to more jobs.`,
    }
  }

  const created = await createApplication({
    userId: user.id,
    jobId: job.id,
    companyId: job.companyId,
    coverLetter: parsed.data.coverLetter,
  })
  if (!created)
    return { ok: false, error: "You've already applied to this job." }

  refresh()
  revalidatePath(`/jobs/${job.id}`)
  return { ok: true }
}

const profileSchema = z.object({
  headline: z
    .string()
    .trim()
    .max(120, "Headline must be 120 characters or fewer."),
  bio: z.string().trim().max(1000, "Bio must be 1000 characters or fewer."),
  skills: z
    .array(z.string().trim().min(1).max(40))
    .max(30, "Add at most 30 skills."),
  resumeUrl: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => v === "" || /^https?:\/\/\S+$/i.test(v),
      "Resume link must start with http:// or https://"
    ),
})

export async function updateSeekerProfile(input: {
  headline: string
  bio: string
  skills: string[]
  resumeUrl: string
}): Promise<Ok | Fail> {
  const auth = await seekerOrFail()
  if ("ok" in auth) return auth
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success)
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid profile.",
    }
  await saveProfile(auth.user.id, parsed.data)
  refresh()
  return { ok: true }
}
