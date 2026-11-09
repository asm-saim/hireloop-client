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
import { getFeaturedJobs } from "@/lib/data/jobs"
import { formatSalary } from "@/lib/format"

export async function FeaturedJobs() {
  const jobs = await getFeaturedJobs()
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
                      {job.summary}
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
                        {job.type}
                      </Badge>
                    </li>
                    <li>
                      <Badge variant="chip">
                        <CircleDollarSign aria-hidden />
                        {formatSalary(job.salaryMin, job.salaryMax)}
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
