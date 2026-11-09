import { Cta } from "@/components/site/cta"
import { Features } from "@/components/site/features"
import { FeaturedJobs } from "@/components/site/featured-jobs"
import { Footer } from "@/components/site/footer"
import { GlobeStats } from "@/components/site/globe-stats"
import { Hero } from "@/components/site/hero"
import { Navbar } from "@/components/site/navbar"
import { Pricing } from "@/components/site/pricing"

const particles = [
  "radial-gradient(1.5px 1.5px at 22% 78%, rgba(150,140,255,.9), transparent)",
  "radial-gradient(1px 1px at 35% 92%, rgba(150,140,255,.9), transparent)",
  "radial-gradient(1.5px 1.5px at 62% 85%, rgba(150,140,255,.9), transparent)",
  "radial-gradient(1px 1px at 78% 70%, rgba(150,140,255,.8), transparent)",
  "radial-gradient(1px 1px at 88% 88%, rgba(150,140,255,.9), transparent)",
  "radial-gradient(1px 1px at 12% 60%, rgba(255,255,255,.5), transparent)",
].join(",")

export default function HomePage() {
  return (
    <div className="relative isolate overflow-x-clip bg-black">
      {/* Backdrop: spans navbar + hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[100svh] max-h-[60rem] min-h-[43.75rem] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_85%,transparent)]"
      >
        {/* grey top/edges, black arch rising from the bottom center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_100%_at_50%_100%,#000_40%,#303032_100%)]" />

        {/* subtle light lift along the top */}
        <div className="absolute inset-x-0 top-0 h-[18.75rem] bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(255_255_255/0.04),transparent)]" />

        {/* purple glow at the bottom */}
        <div className="absolute bottom-[-12%] left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full bg-[#6351ff]/50 blur-[7.5rem]" />

        {/* tiny particles */}
        <div className="absolute inset-0" style={{ backgroundImage: particles }} />
      </div>

      <Navbar />
      <main className="relative">
        <Hero />
        <GlobeStats />
        <FeaturedJobs />
        <Features />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}