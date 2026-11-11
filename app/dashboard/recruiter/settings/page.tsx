import Link from "next/link"
import { Building2 } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import {
  AccountForm,
  PasswordForm,
} from "@/components/dashboard/settings-forms"
import { Button } from "@/components/ui/button"
import { requireRole } from "@/lib/session"

export default async function RecruiterSettingsPage() {
  const user = await requireRole("recruiter")

  return (
    <div className="mx-auto flex max-w-[48rem] flex-col gap-8">
      <PageHeader
        title="Settings"
        text="Update your personal info and password."
      />
      <AccountForm
        initial={{
          name: user.name,
          email: user.email,
          image: user.image ?? "",
        }}
      />
      <PasswordForm />
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/[0.07] bg-surface p-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Linked company</h2>
          <p className="text-white/70">
            Edit your company details, logo and status.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/dashboard/recruiter/company" />}
          nativeButton={false}
        >
          <Building2 aria-hidden />
          Manage company
        </Button>
      </section>
    </div>
  )
}
