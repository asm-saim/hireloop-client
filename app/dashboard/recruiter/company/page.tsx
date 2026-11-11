import Link from "next/link"
import { Building2, Globe, MapPin, Pencil, Users } from "lucide-react"

import { StatusPill } from "@/components/dashboard/company-status-badge"
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { CompanyAvatar } from "@/components/jobs/company-avatar"
import { Button } from "@/components/ui/button"
import { requireRole } from "@/lib/session"
import { toCompany } from "@/server/repositories/jobs"
import { getCompanyByOwner } from "@/server/repositories/recruiter"

const STATUS_NOTE = {
  pending:
    "Your company is waiting for admin approval. It will appear publicly once approved.",
  approved: "Your company is verified and visible to job seekers.",
  rejected:
    "Your registration was rejected. Update your details and save to resubmit it for review.",
} as const

export default async function MyCompanyPage() {
  const user = await requireRole("recruiter")
  const doc = await getCompanyByOwner(user.id)

  if (!doc) {
    return (
      <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
        <PageHeader title="My Company" />
        <EmptyState
          icon={Building2}
          title="You haven't registered a company yet"
          text="Register your company to start posting jobs. An admin reviews every registration."
          action={{
            label: "Register company",
            href: "/dashboard/recruiter/company/edit",
          }}
        />
      </div>
    )
  }
  const company = toCompany(doc)

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader title="My Company">
        <Button
          size="sm"
          render={<Link href="/dashboard/recruiter/company/edit" />}
          nativeButton={false}
        >
          <Pencil aria-hidden />
          Edit
        </Button>
      </PageHeader>

      <section className="flex flex-col gap-6 rounded-3xl border border-white/[0.07] bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <CompanyAvatar
            name={company.name}
            logoUrl={company.logoUrl}
            className="size-20 text-2xl"
          />
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-white">
              {company.name}
            </h2>
            <StatusPill status={doc.status} className="w-fit" />
          </div>
        </div>
        <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80">
          {STATUS_NOTE[doc.status]}
        </p>
        <dl className="grid gap-4 text-white/80 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <dt className="sr-only">Industry</dt>
            <Building2 aria-hidden className="size-5 shrink-0" />
            <dd>{company.industry}</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="sr-only">Location</dt>
            <MapPin aria-hidden className="size-5 shrink-0" />
            <dd>{company.location}</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="sr-only">Employees</dt>
            <Users aria-hidden className="size-5 shrink-0" />
            <dd>{company.employees} employees</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="sr-only">Website</dt>
            <Globe aria-hidden className="size-5 shrink-0" />
            <dd>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            </dd>
          </div>
        </dl>
        <p className="max-w-3xl leading-[1.7] text-white/80">
          {company.description}
        </p>
      </section>
    </div>
  )
}
