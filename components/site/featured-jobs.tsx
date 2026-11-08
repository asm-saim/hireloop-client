import Link from "next/link"
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleDollarSign,
  MapPin,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FadeIn, Stagger, StaggerItem } from "@/components/site/motion"
import { SectionHeading } from "@/components/site/section-heading"

// Hand-picked listings. Swap for real data once the jobs API exists.
const jobs = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    description:
      "Build fast, accessible interfaces for a product used by millions of job seekers every month.",
    location: "New York, USA",
    schedule: "Hybrid",
    salary: "€25–€40/hour",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    description:
      "Own the end-to-end design of hiring workflows, from first sketch to shipped experience.",
    location: "Berlin, Germany",
    schedule: "Remote",
    salary: "€70–€95k/year",
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    description:
      "Design reliable APIs and data pipelines that match candidates with the right roles in real time.",
    location: "London, UK",
    schedule: "Hybrid",
    salary: "£65–£90k/year",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    description:
      "Turn hiring data into salary insights and market trends that candidates and recruiters rely on.",
    location: "Toronto, Canada",
    schedule: "Full-time",
    salary: "$80–$105k/year",
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    description:
      "Keep deployments boring: automate infrastructure, monitoring and releases across the platform.",
    location: "Dhaka, Bangladesh",
    schedule: "Remote",
    salary: "$30–$50/hour",
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    description:
      "Improve skill-based matching with ranking models and evaluation tooling built for hiring.",
    location: "San Francisco, USA",
    schedule: "Hybrid",
    salary: "$140–$190k/year",
  },
]

export function FeaturedJobs() {
  return (
    <section id="jobs" aria-label="Featured jobs" className="bg-background">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 sm:py-24 lg:py-[120px] xl:px-[60px]">
        <FadeIn>
          <SectionHeading
            eyebrow="Smart job discovery"
            title="The roles you'd never find by searching"
          />
        </FadeIn>

        <Stagger className="mx-auto mt-12 grid max-w-[1320px] gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {jobs.map((job) => (
            <StaggerItem key={job.id} hover className="h-full">
              <article className="flex h-full flex-col justify-between gap-8 rounded-3xl bg-surface p-6 lg:min-h-[363px]">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <h3 className="font-tight text-2xl leading-[1.3] font-medium text-white sm:text-[32px]">
                      {job.title}
                    </h3>
                    <p className="text-base leading-normal text-white/70">
                      {job.description}
                    </p>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    <li>
                      <Badge variant="chip">
                        <MapPin aria-hidden />
                        {job.location}
                      </Badge>
                    </li>
                    <li>
                      <Badge variant="chip">
                        <BriefcaseBusiness aria-hidden />
                        {job.schedule}
                      </Badge>
                    </li>
                    <li>
                      <Badge variant="chip">
                        <CircleDollarSign aria-hidden />
                        {job.salary}
                      </Badge>
                    </li>
                  </ul>
                </div>
                <Button
                  variant="secondary"
                  render={<Link href={`/jobs/${job.id}`} />}
                  nativeButton={false}
                  className="h-[55px] w-fit gap-1 bg-white/[0.06] px-6 text-base"
                >
                  Apply Now
                  <ArrowRight aria-hidden />
                </Button>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn className="mt-10 flex justify-center">
          <Button
            variant="light"
            size="lg"
            render={<Link href="/jobs" />}
            nativeButton={false}
          >
            View all job open
          </Button>
        </FadeIn>
      </div>
    </section>
  )
}
