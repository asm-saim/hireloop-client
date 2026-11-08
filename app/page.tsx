import { Cta } from "@/components/site/cta"
import { Features } from "@/components/site/features"
import { FeaturedJobs } from "@/components/site/featured-jobs"
import { Footer } from "@/components/site/footer"
import { GlobeStats } from "@/components/site/globe-stats"
import { Hero } from "@/components/site/hero"
import { Navbar } from "@/components/site/navbar"
import { Pricing } from "@/components/site/pricing"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        {/* soft light haze behind the nav, from the Figma's top gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_55%_70%_at_50%_0%,rgb(255_255_255/0.08),transparent)]"
        />
        <Hero />
        <GlobeStats />
        <FeaturedJobs />
        <Features />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </>
  )
}