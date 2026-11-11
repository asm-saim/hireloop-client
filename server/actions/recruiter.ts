"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import {
  CURRENCIES,
  EMPLOYEE_RANGES,
  INDUSTRIES,
  JOB_CATEGORIES,
  JOB_TYPES,
} from "@/lib/data/types"
import { getSessionUser, type SessionUser } from "@/lib/session"
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type CompanyDoc,
} from "@/server/models"
import {
  countActiveJobs,
  deleteJob,
  getCompanyApplication,
  getCompanyByOwner,
  getCompanyJob,
  getRecruiterPlan,
  getUserBasics,
  insertJob,
  saveCompany,
  setApplicationStatus,
  updateJobFields,
} from "@/server/repositories/recruiter"
import { notifyApplicantStatusChange } from "@/server/services/email"
import { RECRUITER_LIMITS } from "@/server/services/plan-limits"

type Fail = { ok: false; error: string }
type Ok<T = object> = { ok: true } & T

async function recruiterOrFail(): Promise<{ user: SessionUser } | Fail> {
  const user = await getSessionUser()
  if (!user) return { ok: false, error: "Please sign in to continue." }
  if (user.role !== "recruiter")
    return { ok: false, error: "Only recruiters can do this." }
  return { user }
}

async function recruiterWithCompany(): Promise<
  { user: SessionUser; company: CompanyDoc } | Fail
> {
  const auth = await recruiterOrFail()
  if ("ok" in auth) return auth
  const company = await getCompanyByOwner(auth.user.id)
  if (!company)
    return { ok: false, error: "Register your company before posting jobs." }
  return { user: auth.user, company }
}

function refresh() {
  revalidatePath("/dashboard/recruiter", "layout")
  revalidatePath("/jobs", "layout")
  revalidatePath("/companies", "layout")
}

// ---------- company ----------

const LOGO_MAX_BYTES = 300 * 1024

function detectImageType(b: Buffer): string | null {
  if (
    b.length > 3 &&
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47
  )
    return "image/png"
  if (b.length > 2 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff)
    return "image/jpeg"
  if (
    b.length > 12 &&
    b.toString("ascii", 0, 4) === "RIFF" &&
    b.toString("ascii", 8, 12) === "WEBP"
  )
    return "image/webp"
  return null
}

const companySchema = z.object({
  name: z.string().trim().min(2, "Enter the company name.").max(80),
  industry: z.enum(INDUSTRIES, { error: "Choose an industry." }),
  website: z
    .string()
    .trim()
    .max(200)
    .refine(
      (v) => /^https?:\/\/[^\s.]+\.\S+$/i.test(v),
      "Website must be a full link, like https://example.com"
    ),
  location: z.string().trim().min(2, "Enter the location.").max(80),
  employees: z.enum(EMPLOYEE_RANGES, { error: "Choose an employee range." }),
  description: z
    .string()
    .trim()
    .min(20, "Write at least 20 characters about the company.")
    .max(500, "Keep the description under 500 characters."),
})

export async function saveCompanyAction(
  formData: FormData
): Promise<Ok<{ companyId: string }> | Fail> {
  const auth = await recruiterOrFail()
  if ("ok" in auth) return auth

  const parsed = companySchema.safeParse(
    Object.fromEntries(
      [
        "name",
        "industry",
        "website",
        "location",
        "employees",
        "description",
      ].map((k) => [k, formData.get(k) ?? ""])
    )
  )
  if (!parsed.success)
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Check the form.",
    }

  let logo: { data: Buffer; type: string } | undefined
  const file = formData.get("logo")
  if (file instanceof File && file.size > 0) {
    if (file.size > LOGO_MAX_BYTES)
      return { ok: false, error: "The logo must be 300 KB or smaller." }
    const data = Buffer.from(await file.arrayBuffer())
    const type = detectImageType(data)
    if (!type)
      return { ok: false, error: "The logo must be a PNG, JPG or WebP image." }
    logo = { data, type }
  }

  const companyId = await saveCompany(auth.user.id, parsed.data, logo)
  refresh()
  return { ok: true, companyId }
}

// ---------- jobs ----------

const lines = (max: number) =>
  z
    .string()
    .transform((v) =>
      v
        .split("\n")
        .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
        .filter(Boolean)
    )
    .pipe(
      z
        .array(
          z.string().max(300, "Each line must be 300 characters or fewer.")
        )
        .max(max, `Use at most ${max} lines.`)
    )

const jobSchema = z
  .object({
    intent: z.enum(["draft", "publish"]),
    title: z
      .string()
      .trim()
      .min(3, "Enter a job title (3+ characters).")
      .max(100),
    category: z.enum(JOB_CATEGORIES, { error: "Choose a category." }),
    type: z.enum(JOB_TYPES, { error: "Choose a job type." }),
    currency: z.enum(CURRENCIES),
    salaryMin: z.coerce
      .number()
      .min(0, "Salary can't be negative.")
      .max(10_000_000),
    salaryMax: z.coerce
      .number()
      .min(0, "Salary can't be negative.")
      .max(10_000_000),
    remote: z.boolean(),
    location: z.string().trim().max(80),
    deadline: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose an application deadline."),
    overview: z
      .string()
      .trim()
      .max(1500, "Keep the overview under 1500 characters."),
    responsibilities: lines(15),
    requirements: lines(15),
    benefits: lines(15),
  })
  .superRefine((v, ctx) => {
    const add = (message: string) => ctx.addIssue({ code: "custom", message })
    if (v.salaryMax < v.salaryMin)
      add("Maximum salary must be at least the minimum.")
    if (v.intent === "publish") {
      if (!v.remote && v.location.length < 2)
        add("Enter the job location or turn on Remote.")
      if (v.overview.length < 20)
        add("Write a short overview of the role (20+ characters).")
      if (v.responsibilities.length < 1) add("Add at least one responsibility.")
      if (v.requirements.length < 1) add("Add at least one requirement.")
      if (v.salaryMax <= 0) add("Enter a salary range.")
      const end = new Date(`${v.deadline}T23:59:59`)
      if (Number.isNaN(end.getTime()) || end.getTime() < Date.now())
        add("The deadline must be today or later.")
    }
  })

export type JobInput = z.input<typeof jobSchema>

async function canActivate(
  user: SessionUser,
  company: CompanyDoc,
  jobIsAlreadyActive: boolean
): Promise<string | null> {
  if (company.status !== "approved")
    return company.status === "rejected"
      ? "Your company registration was rejected. Update it on the My Company page to resubmit."
      : "Your company is waiting for admin approval. You can save drafts until then."
  if (jobIsAlreadyActive) return null
  const limit = RECRUITER_LIMITS[await getRecruiterPlan(user.id)].activeJobs
  if ((await countActiveJobs(company._id)) >= limit)
    return `Your plan allows ${limit} active job posts. Close a job or upgrade to publish more.`
  return null
}

function jobFields(v: z.output<typeof jobSchema>) {
  return {
    title: v.title,
    category: v.category,
    type: v.type,
    currency: v.currency,
    salaryMin: v.salaryMin,
    salaryMax: v.salaryMax,
    location: v.remote ? "Remote" : v.location,
    deadline: new Date(`${v.deadline}T23:59:59`),
    summary: v.overview.slice(0, 200),
    description: v.overview,
    responsibilities: v.responsibilities,
    requirements: v.requirements,
    benefits: v.benefits,
  }
}

export async function createJobAction(
  input: JobInput
): Promise<Ok<{ jobId: string }> | Fail> {
  const auth = await recruiterWithCompany()
  if ("ok" in auth) return auth
  const parsed = jobSchema.safeParse(input)
  if (!parsed.success)
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Check the form.",
    }

  const { user, company } = auth
  const publish = parsed.data.intent === "publish"
  if (publish) {
    const blocked = await canActivate(user, company, false)
    if (blocked) return { ok: false, error: blocked }
  }

  const jobId = await insertJob({
    ...jobFields(parsed.data),
    companyId: company._id,
    ownerId: user.id,
    postedAt: new Date(),
    featured: false,
    status: publish ? "active" : "draft",
  })
  refresh()
  return { ok: true, jobId }
}

export async function updateJobAction(
  jobId: string,
  input: JobInput
): Promise<Ok<{ jobId: string }> | Fail> {
  const auth = await recruiterWithCompany()
  if ("ok" in auth) return auth
  const parsed = jobSchema.safeParse(input)
  if (!parsed.success)
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Check the form.",
    }

  const { user, company } = auth
  const job = await getCompanyJob(company._id, jobId)
  if (!job) return { ok: false, error: "Job not found." }

  const publish = parsed.data.intent === "publish"
  if (publish) {
    const blocked = await canActivate(user, company, job.status === "active")
    if (blocked) return { ok: false, error: blocked }
  }

  await updateJobFields(company._id, jobId, {
    ...jobFields(parsed.data),
    status: publish ? "active" : "draft",
    // A draft that gets published is "posted" now.
    ...(publish && job.status !== "active" ? { postedAt: new Date() } : {}),
  })
  refresh()
  revalidatePath(`/jobs/${jobId}`)
  return { ok: true, jobId }
}

export async function setJobStatusAction(
  jobId: string,
  status: "active" | "closed"
): Promise<Ok | Fail> {
  const auth = await recruiterWithCompany()
  if ("ok" in auth) return auth
  const { user, company } = auth
  const job = await getCompanyJob(company._id, jobId)
  if (!job) return { ok: false, error: "Job not found." }

  if (status === "active") {
    if (job.deadline.getTime() < Date.now())
      return {
        ok: false,
        error:
          "The deadline has passed. Edit the job and set a new deadline first.",
      }
    const blocked = await canActivate(user, company, job.status === "active")
    if (blocked) return { ok: false, error: blocked }
  }
  await updateJobFields(company._id, jobId, { status })
  refresh()
  revalidatePath(`/jobs/${jobId}`)
  return { ok: true }
}

export async function deleteJobAction(jobId: string): Promise<Ok | Fail> {
  const auth = await recruiterWithCompany()
  if ("ok" in auth) return auth
  const removed = await deleteJob(auth.company._id, jobId)
  if (!removed) return { ok: false, error: "Job not found." }
  refresh()
  revalidatePath(`/jobs/${jobId}`)
  return { ok: true }
}

// ---------- applicants ----------

export async function updateApplicationStatusAction(
  applicationId: string,
  status: string
): Promise<Ok<{ status: ApplicationStatus }> | Fail> {
  const auth = await recruiterWithCompany()
  if ("ok" in auth) return auth
  const parsed = z.enum(APPLICATION_STATUSES).safeParse(status)
  if (!parsed.success) return { ok: false, error: "Invalid status." }

  const { company } = auth
  const app = await getCompanyApplication(company._id, applicationId)
  if (!app) return { ok: false, error: "Application not found." }
  if (app.status === parsed.data) return { ok: true, status: parsed.data }

  await setApplicationStatus(app._id, parsed.data)

  const [applicant, job] = await Promise.all([
    getUserBasics(app.userId),
    getCompanyJob(company._id, app.jobId),
  ])
  if (applicant?.email) {
    await notifyApplicantStatusChange({
      to: applicant.email,
      applicantName: applicant.name ?? "there",
      jobTitle: job?.title ?? "your application",
      companyName: company.name,
      status: parsed.data,
    })
  }
  refresh()
  revalidatePath("/dashboard/seeker", "layout")
  return { ok: true, status: parsed.data }
}
