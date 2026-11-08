import {
  Bookmark,
  ChartNoAxesCombined,
  FileText,
  MousePointerClick,
  Puzzle,
  Search,
  TrendingUp,
  Trophy,
} from "lucide-react"

import { FadeIn, Stagger, StaggerItem } from "@/components/site/motion"
import { SectionHeading } from "@/components/site/section-heading"

const features = [
  {
    icon: Search,
    title: "Smart Search",
    text: "Find your ideal job with advanced filters.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Salary Insights",
    text: "Get real salary data to negotiate confidently.",
  },
  {
    icon: Trophy,
    title: "Top Companies",
    text: "Apply to vetted companies that are hiring.",
  },
  {
    icon: Bookmark,
    title: "Saved Jobs",
    text: "Manage apps & favorites on your dashboard.",
  },
  {
    icon: MousePointerClick,
    title: "One-Click Apply",
    text: "Simplify your job applications for an easier process!",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    text: "Create professional resumes with modern templates.",
  },
  {
    icon: Puzzle,
    title: "Skill-Based Matching",
    text: "Discover jobs that match your skills and experience.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth Resources",
    text: "Boost your career with quick interview tips.",
  },
]

export function Features() {
  return (
    <section
      id="features"
      aria-label="Platform features"
      className="bg-surface"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 sm:py-24 lg:py-[120px] xl:px-[60px]">
        <FadeIn>
          <SectionHeading
            eyebrow="features job"
            title="Everything you need to succeed"
          />
        </FadeIn>

        <Stagger className="mx-auto mt-12 grid max-w-[1320px] gap-x-6 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-12">
          {features.map(({ icon: Icon, title, text }) => (
            <StaggerItem
              key={title}
              className="flex items-center gap-5 sm:gap-6"
            >
              <div className="grid size-16 shrink-0 place-items-center rounded-lg border border-white/10 bg-gradient-to-b from-[#010102] to-[#313131] sm:size-20">
                <Icon aria-hidden className="size-7 text-white sm:size-8" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-tight text-lg leading-[1.4] font-medium text-white">
                  {title}
                </h3>
                <p className="font-tight text-base leading-[1.65] text-white/80">
                  {text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
