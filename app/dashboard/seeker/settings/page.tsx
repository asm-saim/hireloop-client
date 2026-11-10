import { PageHeader } from "@/components/dashboard/page-header"
import {
  PasswordForm,
  ProfileForm,
} from "@/components/dashboard/settings-forms"
import { requireRole } from "@/lib/session"
import { getProfile } from "@/server/repositories/profiles"

export default async function SeekerSettingsPage() {
  const user = await requireRole("seeker")
  const profile = await getProfile(user.id)

  return (
    <div className="mx-auto flex max-w-[48rem] flex-col gap-8">
      <PageHeader
        title="Settings"
        text="Update your profile, skills and password."
      />
      <ProfileForm
        initial={{
          name: user.name,
          email: user.email,
          image: user.image ?? "",
          headline: profile.headline,
          bio: profile.bio,
          skills: profile.skills.join(", "),
          resumeUrl: profile.resumeUrl,
        }}
      />
      <PasswordForm />
    </div>
  )
}
