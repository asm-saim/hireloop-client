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
import { cn } from "@/lib/utils"

/** Each icon gets a hue from the brand ramp so the grid isn't eight greys. */
const tints = {
  brand: "border-brand/30 bg-brand/15 text-brand",
  aqua: "border-aqua/30 bg-aqua/15 text-aqua",
  mint: "border-mint/30 bg-mint/15 text-mint",
  gold: "border-gold/30 bg-gold/15 text-gold",
}

const features = [
  {
    icon: Search,
    title: "Smart Search",
    text: "Find your ideal job with advanced filters.",
    tint: tints.aqua,
  },
  {
    icon: ChartNoAxesCombined,
    title: "Salary Insights",
    text: "Get real salary data to negotiate confidently.",
    tint: tints.mint,
  },
  {
    icon: Trophy,
    title: "Top Companies",
    text: "Apply to vetted companies that are hiring.",
    tint: tints.gold,
  },
  {
    icon: Bookmark,
    title: "Saved Jobs",
    text: "Manage apps & favorites on your dashboard.",
    tint: tints.brand,
  },
  {
    icon: MousePointerClick,
    title: "One-Click Apply",
    text: "Simplify your job applications for an easier process!",
    tint: tints.aqua,
  },
  {
    icon: FileText,
    title: "Resume Builder",
    text: "Create professional resumes with modern templates.",
    tint: tints.gold,
  },
  {
    icon: Puzzle,
    title: "Skill-Based Matching",
    text: "Discover jobs that match your skills and experience.",
    tint: tints.mint,
  },
  {
    icon: TrendingUp,
    title: "Career Growth Resources",
    text: "Boost your career with quick interview tips.",
    tint: tints.brand,
  },
]

export function Features() {
  return (
    <section
      id="features"
      aria-label="Platform features"
      className="relative isolate overflow-hidden"
    >
      {/* cool wash so the band reads as its own space without a flat slab */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgb(56_189_248/0.06),transparent)]"
      />
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-8 sm:py-24 lg:py-[7.5rem] xl:px-[3.75rem]">
        <FadeIn>
          <SectionHeading
            eyebrow="features job"
            title="Everything you need to succeed"
          />
        </FadeIn>

        <Stagger className="mx-auto mt-12 grid max-w-[82.5rem] gap-x-6 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-12">
          {features.map(({ icon: Icon, title, text, tint }) => (
            <StaggerItem
              key={title}
              className="flex items-center gap-5 sm:gap-6"
            >
              <div
                className={cn(
                  "grid size-16 shrink-0 place-items-center rounded-2xl border shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] sm:size-20",
                  tint
                )}
              >
                <Icon aria-hidden className="size-7 sm:size-8" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-tight text-lg leading-[1.4] font-semibold text-white">
                  {title}
                </h3>
                <p className="font-tight text-base leading-[1.65] text-white/70">
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
