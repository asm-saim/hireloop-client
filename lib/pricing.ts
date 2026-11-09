export type Plan = {
  name: string
  price: number
  period: string
  featured: boolean
  features: string[]
}

export const seekerPlans: Plan[] = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    featured: false,
    features: [
      "Browse & save up to 10 jobs",
      "Apply to up to 3 jobs per month",
      "Basic profile",
      "Email alerts",
    ],
  },
  {
    name: "Pro",
    price: 19,
    period: "month",
    featured: true,
    features: [
      "Apply to up to 30 jobs per month",
      "Unlimited saved jobs",
      "Application tracking",
      "Salary insights",
    ],
  },
  {
    name: "Premium",
    price: 39,
    period: "month",
    featured: false,
    features: [
      "Everything in Pro",
      "Unlimited applications",
      "Profile boost to recruiters",
      "Early access to new jobs",
      "Priority support",
    ],
  },
]

export const recruiterPlans: Plan[] = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    featured: false,
    features: [
      "Up to 3 active job posts",
      "Basic applicant management",
      "Standard listing visibility",
      "Great for your first year of hiring",
    ],
  },
  {
    name: "Growth",
    price: 49,
    period: "month",
    featured: true,
    features: [
      "Up to 10 active job posts",
      "Applicant tracking",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Enterprise",
    price: 149,
    period: "month",
    featured: false,
    features: [
      "Up to 50 active job posts",
      "Advanced analytics dashboard",
      "Featured job listings",
      "Team collaboration",
      "Custom branding",
      "Priority support",
    ],
  },
]

export const faqs = [
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. You can cancel from your billing page whenever you like. You keep your paid features until the end of the current billing period, then move to the Free plan.",
  },
  {
    q: "Do you offer refunds?",
    a: "All paid plans come with a 14-day money-back guarantee. If HireLoop isn't right for you, contact support within 14 days of your payment and we'll refund it.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept major credit and debit cards. Payments are processed securely by Stripe, and we never store your card details.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. You can upgrade or downgrade at any time, and billing is prorated so you only pay for what you use.",
  },
  {
    q: "What happens if I reach my plan's limit?",
    a: "Seekers who reach their monthly application limit, or recruiters who reach their active job post limit, can upgrade instantly to keep going. Nothing is deleted.",
  },
]
