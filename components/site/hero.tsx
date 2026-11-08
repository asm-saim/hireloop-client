import { MapPin, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const trending = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

function BriefcaseEmoji() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-6 shrink-0">
      <rect x="6" y="0.5" width="12" height="5" rx="2" fill="#6d3326" />
      <rect x="8.5" y="2.5" width="7" height="4" rx="1.4" fill="#2a1710" />
      <rect x="0" y="5" width="24" height="17" rx="3" fill="#c86d36" />
      <path d="M0 13h24v6a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3z" fill="#883f2e" />
      <rect x="9.5" y="11" width="5" height="5" rx="1" fill="#fea613" />
      <rect x="10.6" y="12" width="2.8" height="3" rx="0.6" fill="#fee45a" />
    </svg>
  )
}

export function Hero() {
  return (
    <div className="relative z-10 mx-auto flex max-w-[1320px] flex-col items-center px-4 pt-[150px] sm:px-8 sm:pt-[190px] lg:pt-[180px] xl:px-[60px]">
      <div className="flex w-full max-w-[784px] flex-col items-center gap-8 text-center sm:gap-12">
        <div className="flex w-full flex-col items-center gap-8">
          {/* Announcement pill */}
          <div className="flex items-center justify-center gap-0">
            <span
              aria-hidden
              className="hidden h-px w-10 bg-gradient-to-r from-transparent to-white/70 sm:block sm:w-16"
            />
            <p className="flex items-center gap-3 rounded-full border border-white/10 bg-gradient-to-b from-[#474747] to-[#010102] px-4 py-2 font-mono-label text-sm text-white shadow-[inset_0_0_6px_rgb(0_0_0/0.1)] sm:gap-4 sm:px-6 sm:py-3 sm:text-xl">
              <BriefcaseEmoji />
              50,000+ new jobs this month
            </p>
            <span
              aria-hidden
              className="hidden h-px w-10 bg-gradient-to-l from-transparent to-white/70 sm:block sm:w-16"
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl leading-[1.15] font-bold tracking-[-0.036em] text-balance text-white sm:text-5xl lg:text-[56px]">
              Find Your Dream Job Today
            </h1>
            <p className="max-w-[784px] text-base leading-[1.6] text-pretty text-white sm:text-xl">
              HireLoop connects top talent with world-class companies. Browse
              thousands of curated opportunities and land your next role —
              faster.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-6">
          {/* Search */}
          <form
            action="/jobs"
            method="get"
            role="search"
            className="flex w-full flex-col gap-2 rounded-2xl border border-white/20 bg-[#101010] p-2 sm:h-16 sm:flex-row sm:items-center sm:gap-6 sm:pl-6"
          >
            <label className="flex h-12 flex-1 items-center gap-2 px-3 text-left sm:h-full sm:px-0">
              <Search aria-hidden className="size-6 shrink-0 text-white" />
              <span className="sr-only">Job title, skill or company</span>
              <Input
                name="q"
                placeholder="Job title, skill or company"
                autoComplete="off"
              />
            </label>
            <span
              aria-hidden
              className="h-px w-full bg-white/20 sm:h-6 sm:w-px sm:shrink-0"
            />
            <label className="flex h-12 flex-1 items-center gap-2 px-3 text-left sm:h-full sm:px-0">
              <MapPin aria-hidden className="size-6 shrink-0 text-white" />
              <span className="sr-only">Location or Remote</span>
              <Input
                name="location"
                placeholder="Location or Remote"
                autoComplete="off"
              />
            </label>
            <Button
              type="submit"
              size="icon"
              aria-label="Search jobs"
              className="h-12 w-full shadow-none sm:w-12"
            >
              <Search />
              <span className="sm:sr-only">Search</span>
            </Button>
          </form>

          {/* Trending */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <span className="text-base text-white">Trending Position</span>
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {trending.map((t) => (
                <li key={t}>
                  <Badge variant="tag">
                    <a
                      href={`/jobs?q=${encodeURIComponent(t)}`}
                      className="outline-none hover:text-white/70 focus-visible:underline"
                    >
                      {t}
                    </a>
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
