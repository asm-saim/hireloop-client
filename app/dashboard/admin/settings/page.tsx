import { PageHeader } from "@/components/dashboard/page-header"
import {
  AccountForm,
  PasswordForm,
} from "@/components/dashboard/settings-forms"
import { requireRole } from "@/lib/session"

export default async function AdminSettingsPage() {
  const user = await requireRole("admin")
  return (
    <div className="mx-auto flex max-w-[48rem] flex-col gap-8">
      <PageHeader
        title="Settings"
        text="Update your admin profile and password."
      />
      <AccountForm
        initial={{
          name: user.name,
          email: user.email,
          image: user.image ?? "",
        }}
      />
      <PasswordForm />
    </div>
  )
}
