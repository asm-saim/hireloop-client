import { CompanyForm } from "@/components/dashboard/company-form"
import { PageHeader } from "@/components/dashboard/page-header"
import { requireRole } from "@/lib/session"
import { toCompany } from "@/server/repositories/jobs"
import { getCompanyByOwner } from "@/server/repositories/recruiter"

export default async function EditCompanyPage() {
  const user = await requireRole("recruiter")
  const doc = await getCompanyByOwner(user.id)
  const company = doc ? toCompany(doc) : null

  return (
    <div className="mx-auto flex max-w-[48rem] flex-col gap-8">
      <PageHeader
        title={company ? "Edit company" : "Register your company"}
        text={
          company
            ? "Update how your company appears to job seekers."
            : "New registrations are reviewed by an admin before they appear publicly."
        }
      />
      <CompanyForm
        isEdit={!!company}
        initial={{
          name: company?.name ?? "",
          industry: company?.industry ?? "",
          website: company?.website ?? "",
          location: company?.location ?? "",
          employees: company?.employees ?? "",
          description: company?.description ?? "",
          logoUrl: company?.logoUrl,
        }}
      />
    </div>
  )
}
