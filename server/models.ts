export const APPLICATION_STATUSES = [
  "applied",
  "under_review",
  "shortlisted",
  "rejected",
  "offered",
] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  applied: "Applied",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  offered: "Offered",
}

export type JobStatus = "active" | "closed" | "draft"
export type CompanyStatus = "pending" | "approved" | "rejected"

export type CompanyDoc = {
  _id: string
  name: string
  industry: string
  location: string
  employees: string
  website: string
  description: string
  status: CompanyStatus
  ownerId?: string
}

export type JobDoc = {
  _id: string
  title: string
  companyId: string
  ownerId?: string
  category: string
  type: string
  location: string
  salaryMin: number
  salaryMax: number
  summary: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  postedAt: Date
  deadline: Date
  featured: boolean
  status: JobStatus
}

export type ApplicationDoc = {
  _id: string
  jobId: string
  companyId: string
  userId: string
  status: ApplicationStatus
  coverLetter?: string
  createdAt: Date
  updatedAt: Date
}

export type SavedJobDoc = {
  _id: string
  userId: string
  jobId: string
  createdAt: Date
}

export type ProfileDoc = {
  _id: string // the user id
  headline: string
  bio: string
  skills: string[]
  resumeUrl: string
}

export type SubscriptionDoc = {
  _id: string // the user id
  plan: string
  updatedAt: Date
}

export type PaymentDoc = {
  _id: string
  userId: string
  email: string
  plan: string
  amount: number
  transactionId: string
  status: "succeeded" | "failed" | "refunded"
  createdAt: Date
}
