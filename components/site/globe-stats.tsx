import {
  BriefcaseBusiness,
  ChartNoAxesColumn,
  Star,
  UserSearch,
} from "lucide-react"

import { CountUp } from "@/components/site/count-up"
import { FadeIn } from "@/components/site/motion"

const stats = [
  { icon: BriefcaseBusiness, value: 50, suffix: "K", label: "Active Jobs" },
  { icon: ChartNoAxesColumn, value: 12, suffix: "K", label: "Companies" },
  { icon: UserSearch, value: 2, suffix: "M", label: "Job Seekers" },
  { icon: Star, value: 97, suffix: "%", label: "Satisfaction Rate" },
]

/** Purple rim-lit globe (exact ellipses, blur and gradient from the Figma). */
function Globe() {
  return (
    <svg
      viewBox="0 0 1236 1037"
      aria-hidden
      className="pointer-events-none absolute top-0 left-1/2 -z-10 h-auto w-[210vw] max-w-none -translate-x-1/2 overflow-visible sm:w-[150vw] lg:w-[1236px]"
    >
      <defs>
        <filter
          id="globe-rim-blur"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="74" />
        </filter>
        <filter id="globe-map-blur" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <radialGradient
          id="globe-inner"
          gradientUnits="userSpaceOnUse"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(618 24) scale(516 443)"
        >
          <stop offset="0" stopColor="#5c53fe" />
          <stop offset="0.29" stopColor="#5c53fe" stopOpacity="0.6" />
          <stop offset="0.52" stopColor="#5c53fe" stopOpacity="0.5" />
          <stop offset="1" stopColor="#5c53fe" stopOpacity="0" />
        </radialGradient>
        <clipPath id="globe-clip">
          <ellipse cx="618" cy="542.5" rx="604" ry="518.5" />
        </clipPath>
      </defs>

      {/* glowing rim */}
      <ellipse
        cx="618"
        cy="518.5"
        rx="618"
        ry="518.5"
        fill="#5c53fe"
        filter="url(#globe-rim-blur)"
      />
      {/* planet body */}
      <ellipse cx="618" cy="542.5" rx="604" ry="518.5" fill="#010103" />
      <ellipse
        cx="618"
        cy="542.5"
        rx="604"
        ry="518.5"
        fill="url(#globe-inner)"
      />
      {/* continents */}
      <g clipPath="url(#globe-clip)">
        <image
          href="/world-map.svg"
          x="10"
          y="36"
          width="1197"
          height="557"
          opacity="0.2"
          filter="url(#globe-map-blur)"
        />
      </g>
    </svg>
  )
}

export function GlobeStats() {
  return (
    <section
      aria-labelledby="stats-heading"
      className="relative mt-20 sm:mt-28 lg:mt-[152px]"
    >
      <Globe />
      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-4 pt-36 pb-16 sm:gap-12 sm:px-8 sm:pt-56 lg:pt-[276px] lg:pb-[72px] xl:px-[60px]">
        <FadeIn>
          <h2
            id="stats-heading"
            className="mx-auto max-w-[600px] text-center text-2xl leading-[1.3] font-medium tracking-[-0.025em] text-balance text-white/70 sm:text-3xl lg:text-[40px]"
          >
            Assisting over 15,000 job seekers find their dream positions.
          </h2>
        </FadeIn>

        <dl className="grid w-full max-w-[1320px] grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, suffix, label }) => (
            <div
              key={label}
              className="flex min-h-[176px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-[#010102] to-[#313131] p-4 sm:min-h-[254px] sm:p-6"
            >
              <Icon aria-hidden className="size-6 text-white" />
              <div className="flex flex-col gap-2 sm:gap-4">
                <dd className="order-1 font-jakarta text-4xl leading-[1.15] font-semibold tracking-[-0.036em] text-white sm:text-5xl lg:text-[56px]">
                  <CountUp value={value} suffix={suffix} />
                </dd>
                <dt className="order-2 font-tight text-base text-white sm:text-lg">
                  {label}
                </dt>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
