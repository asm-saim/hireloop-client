export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
  "Internship",
] as const
export type JobType = (typeof JOB_TYPES)[number]

export const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Data & AI",
  "Product",
  "Operations",
] as const
export type JobCategory = (typeof JOB_CATEGORIES)[number]

export const INDUSTRIES = [
  "Fintech",
  "AI",
  "Developer Tools",
  "E-Commerce",
  "Healthcare",
  "Design",
] as const
export type Industry = (typeof INDUSTRIES)[number]

export type Company = {
  id: string
  name: string
  industry: Industry
  location: string
  employees: string
  website: string
  description: string
}

export type Job = {
  id: string
  title: string
  companyId: string
  category: JobCategory
  type: JobType
  location: string
  /** Annual salary range, USD. */
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
}

export type JobWithCompany = Job & { company: Company }
