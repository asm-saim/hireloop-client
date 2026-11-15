import { Atmosphere } from "@/components/site/atmosphere"
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
    <div className="relative isolate overflow-x-clip bg-black">
      <Atmosphere />

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
