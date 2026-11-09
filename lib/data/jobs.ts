import { companies } from "@/lib/data/companies"
import type {
  Company,
  Industry,
  Job,
  JobCategory,
  JobType,
  JobWithCompany,
} from "@/lib/data/types"

const day = 86_400_000
const ago = (d: number) => new Date(Date.now() - d * day)
const inDays = (d: number) => new Date(Date.now() + d * day)

const commonBenefits = [
  "Competitive salary and equity",
  "Flexible hours and a learning budget",
  "Health insurance and paid time off",
]

type Seed = Omit<Job, "postedAt" | "deadline" | "benefits" | "featured"> & {
  postedDaysAgo: number
  deadlineInDays: number
  featured?: boolean
}

// Sample data. Replace with a database query when the Job model exists.
const seeds: Seed[] = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    companyId: "codelane",
    category: "Engineering",
    type: "Full-time",
    location: "Berlin, Germany",
    salaryMin: 70000,
    salaryMax: 95000,
    summary:
      "Build fast, accessible interfaces for a product used by millions of developers every month.",
    description:
      "You'll join the web platform team that owns the CodeLane dashboard. We care about performance, accessibility and well-tested components, and you'll have real influence over how we build.",
    responsibilities: [
      "Ship new product features end to end with designers and backend engineers",
      "Improve performance, accessibility and developer experience across the app",
      "Review code and mentor teammates",
      "Help evolve our component library",
    ],
    requirements: [
      "3+ years building production web apps with React and TypeScript",
      "Strong grasp of HTML, CSS and browser performance",
      "Experience writing component and integration tests",
      "Clear written communication in English",
    ],
    postedDaysAgo: 2,
    deadlineInDays: 21,
    featured: true,
  },
  {
    id: "product-designer",
    title: "Product Designer",
    companyId: "pixel-harbor",
    category: "Design",
    type: "Remote",
    location: "Remote (Europe)",
    salaryMin: 65000,
    salaryMax: 90000,
    summary:
      "Own the end-to-end design of hiring workflows, from first sketch to shipped experience.",
    description:
      "Pixel Harbor partners with startups on products people love. As a product designer you'll lead projects from discovery through delivery and shape our design system.",
    responsibilities: [
      "Lead discovery, wireframing and high-fidelity design for client products",
      "Maintain and extend shared design systems",
      "Present work to clients and incorporate feedback",
      "Collaborate closely with engineers during delivery",
    ],
    requirements: [
      "4+ years of product design experience with a strong portfolio",
      "Fluency in Figma and prototyping",
      "Comfort facilitating workshops and user research",
      "Great visual and interaction craft",
    ],
    postedDaysAgo: 4,
    deadlineInDays: 18,
    featured: true,
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    companyId: "northwind-pay",
    category: "Engineering",
    type: "Full-time",
    location: "New York, USA",
    salaryMin: 120000,
    salaryMax: 160000,
    summary:
      "Design reliable APIs and data pipelines that move money safely and quickly.",
    description:
      "NorthWind Pay's payments core processes millions of transactions a day. You'll design services that are correct first, then fast, and own them in production.",
    responsibilities: [
      "Design and build resilient payment APIs",
      "Own services in production, including on-call rotation",
      "Improve observability and reliability",
      "Contribute to technical design reviews",
    ],
    requirements: [
      "5+ years of backend experience (Go, Node.js or similar)",
      "Solid knowledge of databases and distributed systems",
      "Experience operating production systems",
      "Care for correctness and security",
    ],
    postedDaysAgo: 1,
    deadlineInDays: 25,
    featured: true,
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    companyId: "cartwheel",
    category: "Data & AI",
    type: "Full-time",
    location: "London, UK",
    salaryMin: 55000,
    salaryMax: 75000,
    summary:
      "Turn marketplace data into insights that guide product and growth decisions.",
    description:
      "Join the analytics team that helps Cartwheel understand its buyers and sellers. You'll build dashboards, run experiments and tell clear stories with data.",
    responsibilities: [
      "Build and maintain dashboards and reports",
      "Analyse experiments and recommend decisions",
      "Partner with product and marketing teams",
      "Improve data quality and documentation",
    ],
    requirements: [
      "2+ years in an analytics role",
      "Strong SQL; Python or R is a plus",
      "Experience with BI tools such as Looker or Metabase",
      "Ability to explain findings to non-technical colleagues",
    ],
    postedDaysAgo: 6,
    deadlineInDays: 14,
    featured: true,
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    companyId: "stackbridge",
    category: "Engineering",
    type: "Remote",
    location: "Remote (Worldwide)",
    salaryMin: 60000,
    salaryMax: 90000,
    summary:
      "Keep deployments boring: automate infrastructure, monitoring and releases.",
    description:
      "StackBridge ships deployment tools, so our own infrastructure has to be excellent. You'll automate everything and make reliability a team habit.",
    responsibilities: [
      "Manage cloud infrastructure with infrastructure as code",
      "Improve CI/CD pipelines and release safety",
      "Build monitoring, alerting and incident tooling",
      "Support engineers with deployment questions",
    ],
    requirements: [
      "3+ years of DevOps or SRE experience",
      "Hands-on with Kubernetes, Terraform and a major cloud",
      "Scripting skills in Bash and Python or Go",
      "Calm, methodical approach to incidents",
    ],
    postedDaysAgo: 3,
    deadlineInDays: 20,
    featured: true,
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    companyId: "neuralforge",
    category: "Data & AI",
    type: "Full-time",
    location: "San Francisco, USA",
    salaryMin: 150000,
    salaryMax: 200000,
    summary:
      "Improve retrieval and ranking models with evaluation tooling built for enterprise search.",
    description:
      "NeuralForge is hiring an AI engineer to push the quality of our search stack. You'll run experiments, build evaluation harnesses and ship models to production.",
    responsibilities: [
      "Train and evaluate ranking and retrieval models",
      "Build tooling for offline and online evaluation",
      "Productionise models with the platform team",
      "Share findings through internal write-ups",
    ],
    requirements: [
      "Experience shipping ML models to production",
      "Strong Python and a major deep learning framework",
      "Familiarity with information retrieval or LLM tooling",
      "Rigorous, experiment-driven mindset",
    ],
    postedDaysAgo: 5,
    deadlineInDays: 30,
    featured: true,
  },
  {
    id: "product-manager",
    title: "Senior Product Manager",
    companyId: "lumenbank",
    category: "Product",
    type: "Full-time",
    location: "Singapore",
    salaryMin: 110000,
    salaryMax: 150000,
    summary:
      "Lead the roadmap for everyday banking features used by millions of customers.",
    description:
      "As a senior PM at LumenBank you'll own a product area end to end, balancing customer needs, regulation and business goals.",
    responsibilities: [
      "Define strategy and roadmap for your product area",
      "Work with engineering and design to ship",
      "Use data and research to prioritise",
      "Align stakeholders across the business",
    ],
    requirements: [
      "5+ years of product management, ideally in fintech",
      "Track record of shipping consumer products",
      "Strong analytical and communication skills",
      "Comfort working in a regulated environment",
    ],
    postedDaysAgo: 8,
    deadlineInDays: 12,
  },
  {
    id: "ux-researcher",
    title: "UX Researcher",
    companyId: "medisync",
    category: "Design",
    type: "Contract",
    location: "Toronto, Canada",
    salaryMin: 80000,
    salaryMax: 100000,
    summary:
      "Run research with clinicians and patients to shape our scheduling and records tools.",
    description:
      "A six-month contract to build our research practice. You'll plan studies, talk to users and turn insight into product direction.",
    responsibilities: [
      "Plan and run interviews and usability studies",
      "Synthesize findings into clear recommendations",
      "Build a lightweight research repository",
      "Partner with designers and PMs",
    ],
    requirements: [
      "3+ years of UX research experience",
      "Experience in healthcare or regulated domains is a plus",
      "Strong facilitation and synthesis skills",
      "Available for a 6-month engagement",
    ],
    postedDaysAgo: 9,
    deadlineInDays: 10,
  },
  {
    id: "fullstack-engineer",
    title: "Full-Stack Engineer",
    companyId: "orbitcart",
    category: "Engineering",
    type: "Full-time",
    location: "Sydney, Australia",
    salaryMin: 90000,
    salaryMax: 125000,
    summary:
      "Build checkout and merchant tools across the stack for fast-growing online stores.",
    description:
      "OrbitCart's merchant platform needs engineers who enjoy both product and platform work. You'll ship features across React, Node.js and Postgres.",
    responsibilities: [
      "Build features across the frontend and API layers",
      "Improve checkout conversion and reliability",
      "Write tests and review code",
      "Collaborate with product and support",
    ],
    requirements: [
      "3+ years of full-stack experience",
      "React, TypeScript and Node.js",
      "Comfort with SQL databases",
      "Product-minded approach",
    ],
    postedDaysAgo: 7,
    deadlineInDays: 16,
  },
  {
    id: "ml-intern",
    title: "Machine Learning Intern",
    companyId: "helix-health",
    category: "Data & AI",
    type: "Internship",
    location: "Boston, USA",
    salaryMin: 40000,
    salaryMax: 52000,
    summary:
      "Work with our research team on models that support early diagnosis.",
    description:
      "A 12-week summer internship with mentorship from senior researchers and a real project you'll present to the company.",
    responsibilities: [
      "Prototype and evaluate models on clinical datasets",
      "Document experiments and results",
      "Present findings to the team",
      "Support data cleaning and labelling",
    ],
    requirements: [
      "Currently studying computer science, statistics or similar",
      "Python and basic ML experience",
      "Curiosity and strong communication",
      "Eligible to work in the US",
    ],
    postedDaysAgo: 10,
    deadlineInDays: 9,
  },
  {
    id: "operations-manager",
    title: "Operations Manager",
    companyId: "cartwheel",
    category: "Operations",
    type: "Part-time",
    location: "London, UK",
    salaryMin: 35000,
    salaryMax: 48000,
    summary:
      "Keep seller onboarding and support running smoothly, three days a week.",
    description:
      "A part-time role for an organised operator. You'll manage seller onboarding, improve processes and coordinate with support.",
    responsibilities: [
      "Oversee the seller onboarding pipeline",
      "Document and improve operating procedures",
      "Coordinate with customer support",
      "Report on key operational metrics",
    ],
    requirements: [
      "2+ years in operations or marketplace support",
      "Excellent organisation and follow-through",
      "Comfortable with spreadsheets and ticketing tools",
      "Available three days a week",
    ],
    postedDaysAgo: 12,
    deadlineInDays: 7,
  },
  {
    id: "security-engineer",
    title: "Security Engineer",
    companyId: "lumenbank",
    category: "Engineering",
    type: "Full-time",
    location: "Singapore",
    salaryMin: 100000,
    salaryMax: 140000,
    summary:
      "Protect customer money and data with threat modelling, tooling and response.",
    description:
      "Join LumenBank's security team to harden our platform. You'll own reviews, tooling and incident response with engineering teams.",
    responsibilities: [
      "Run threat modelling and security reviews",
      "Build detection and response tooling",
      "Lead security incident investigations",
      "Advise teams on secure design",
    ],
    requirements: [
      "4+ years in application or cloud security",
      "Experience with secure SDLC and pentest findings",
      "Scripting ability in Python or Go",
      "Calm under pressure",
    ],
    postedDaysAgo: 11,
    deadlineInDays: 15,
  },
  {
    id: "growth-marketer",
    title: "Growth Marketing Lead",
    companyId: "orbitcart",
    category: "Operations",
    type: "Remote",
    location: "Remote (APAC)",
    salaryMin: 70000,
    salaryMax: 95000,
    summary:
      "Grow merchant acquisition with experiments across paid, content and partnerships.",
    description:
      "Own acquisition for OrbitCart's merchant platform. You'll plan and run experiments across channels and report on what works.",
    responsibilities: [
      "Plan and run acquisition experiments",
      "Manage paid and content channels",
      "Build partnerships with agencies and platforms",
      "Report on funnel performance",
    ],
    requirements: [
      "4+ years in B2B or SaaS growth",
      "Data-driven approach to experimentation",
      "Experience managing a budget",
      "Strong writing skills",
    ],
    postedDaysAgo: 14,
    deadlineInDays: 6,
  },
  {
    id: "design-intern",
    title: "Design Intern",
    companyId: "pixel-harbor",
    category: "Design",
    type: "Internship",
    location: "Amsterdam, Netherlands",
    salaryMin: 24000,
    salaryMax: 30000,
    summary:
      "Learn alongside senior designers while contributing to real client projects.",
    description:
      "A three-month paid internship. You'll work on live projects, get regular feedback and leave with portfolio-ready work.",
    responsibilities: [
      "Support designers on client projects",
      "Create UI explorations and assets",
      "Take part in critiques and reviews",
      "Help maintain design system documentation",
    ],
    requirements: [
      "Studying or recently graduated in design",
      "Working knowledge of Figma",
      "A portfolio with a few projects",
      "Eagerness to learn",
    ],
    postedDaysAgo: 13,
    deadlineInDays: 8,
  },
]

const allJobs: Job[] = seeds.map(
  ({ postedDaysAgo, deadlineInDays, featured, ...job }) => ({
    ...job,
    benefits: commonBenefits,
    postedAt: ago(postedDaysAgo),
    deadline: inDays(deadlineInDays),
    featured: featured ?? false,
  })
)

const companyById = new Map(companies.map((c) => [c.id, c]))

function withCompany(job: Job): JobWithCompany {
  return { ...job, company: companyById.get(job.companyId)! }
}

export type JobFilters = {
  q?: string
  location?: string
  types?: JobType[]
  category?: JobCategory
  minSalary?: number
  maxSalary?: number
}

export async function getJobs(filters: JobFilters = {}) {
  const q = filters.q?.trim().toLowerCase()
  const loc = filters.location?.trim().toLowerCase()
  return allJobs
    .map(withCompany)
    .filter((j) => {
      if (
        q &&
        ![j.title, j.company.name, j.category, j.summary]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false
      if (loc && !j.location.toLowerCase().includes(loc)) return false
      if (filters.types?.length && !filters.types.includes(j.type)) return false
      if (filters.category && j.category !== filters.category) return false
      if (filters.minSalary && j.salaryMax < filters.minSalary) return false
      if (filters.maxSalary && j.salaryMin > filters.maxSalary) return false
      return true
    })
    .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
}

export async function getJob(id: string) {
  const job = allJobs.find((j) => j.id === id)
  return job ? withCompany(job) : null
}

export async function getFeaturedJobs(limit = 6) {
  return allJobs
    .filter((j) => j.featured)
    .slice(0, limit)
    .map(withCompany)
}

export async function getSimilarJobs(job: Job, limit = 3) {
  return allJobs
    .filter((j) => j.id !== job.id)
    .sort(
      (a, b) =>
        Number(b.category === job.category) -
        Number(a.category === job.category)
    )
    .slice(0, limit)
    .map(withCompany)
}

export async function getCompanies(industry?: Industry) {
  const list = industry
    ? companies.filter((c) => c.industry === industry)
    : companies
  return list.map((c) => ({
    ...c,
    openJobs: allJobs.filter((j) => j.companyId === c.id).length,
  }))
}

export async function getCompany(id: string) {
  const company: Company | undefined = companyById.get(id)
  if (!company) return null
  return {
    ...company,
    jobs: allJobs.filter((j) => j.companyId === id).map(withCompany),
  }
}
