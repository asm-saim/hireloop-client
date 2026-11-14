import type { Metadata } from "next"

import { PricingTabs } from "@/components/pricing/pricing-tabs"
import { PageHeading, PublicShell } from "@/components/site/public-shell"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from "@/lib/pricing"
import { getSessionUser } from "@/lib/session"
import { getRecruiterPlan } from "@/server/repositories/recruiter"
import { getSeekerPlan } from "@/server/repositories/profiles"
import { getSubscription } from "@/server/services/billing"

export const metadata: Metadata = {
  title: "Pricing — HireLoop",
  description:
    "Simple plans for job seekers and recruiters. Start free and upgrade as you grow.",
}

export default async function PricingPage() {
  const user = await getSessionUser()
  const [plan, sub] = user
    ? await Promise.all([
        user.role === "recruiter"
          ? getRecruiterPlan(user.id)
          : getSeekerPlan(user.id),
        getSubscription(user.id),
      ])
    : ["free", null]
  const viewer = {
    role: user?.role ?? ("guest" as const),
    plan,
    status: sub?.status,
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8 xl:px-[3.75rem]">
        <PageHeading
          eyebrow="Pricing"
          title="Pay for the leverage, not the listings"
          text="Start free. Upgrade when you need more applications or more job posts."
        />

        <div className="mx-auto mt-10 max-w-[82.5rem] sm:mt-14">
          <PricingTabs viewer={viewer} />
        </div>

        <section
          aria-labelledby="faq"
          className="mx-auto mt-24 max-w-[47.5rem] sm:mt-32"
        >
          <h2
            id="faq"
            className="mb-8 text-center text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <Accordion>
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </PublicShell>
  )
}
