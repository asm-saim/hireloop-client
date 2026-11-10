"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Briefcase,
  ImageIcon,
  Link2,
  Lock,
  LoaderCircle,
  Mail,
  User,
} from "lucide-react"
import { toast } from "sonner"

import { Field } from "@/components/auth/field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { authClient } from "@/lib/auth-client"
import { updateSeekerProfile } from "@/server/actions/seeker"

const isHttpUrl = (v: string) => v === "" || /^https?:\/\/\S+$/i.test(v)

const card =
  "flex flex-col gap-5 rounded-3xl border border-white/[0.07] bg-surface p-6"

export function ProfileForm({
  initial,
}: {
  initial: {
    name: string
    email: string
    image: string
    headline: string
    bio: string
    skills: string
    resumeUrl: string
  }
}) {
  const router = useRouter()
  const [v, setV] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, startTransition] = useTransition()
  const set = (k: keyof typeof initial) => (val: string) =>
    setV((p) => ({ ...p, [k]: val }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!v.name.trim()) next.name = "Enter your name."
    if (!isHttpUrl(v.image.trim()))
      next.image = "Photo link must start with http:// or https://"
    if (!isHttpUrl(v.resumeUrl.trim()))
      next.resumeUrl = "Resume link must start with http:// or https://"
    setErrors(next)
    if (Object.keys(next).length) return

    startTransition(async () => {
      const { error } = await authClient.updateUser({
        name: v.name.trim(),
        image: v.image.trim() || null,
      })
      if (error) {
        toast.error(error.message ?? "Couldn't update your account.")
        return
      }
      const res = await updateSeekerProfile({
        headline: v.headline,
        bio: v.bio,
        skills: v.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        resumeUrl: v.resumeUrl,
      })
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Profile updated")
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} noValidate className={card}>
      <h2 className="text-xl font-semibold text-white">Profile</h2>
      <Field
        label="Full name"
        name="name"
        icon={User}
        value={v.name}
        onChange={set("name")}
        error={errors.name}
        autoComplete="name"
      />
      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white/60">
          <Mail aria-hidden className="size-5 shrink-0" />
          {initial.email}
        </div>
        <p className="text-sm text-white/60">
          Your email is your sign-in and can&apos;t be changed here.
        </p>
      </div>
      <Field
        label="Photo link"
        name="image"
        icon={ImageIcon}
        placeholder="https://…/photo.jpg"
        value={v.image}
        onChange={set("image")}
        error={errors.image}
      />
      <Field
        label="Headline"
        name="headline"
        icon={Briefcase}
        placeholder="e.g. Frontend developer"
        value={v.headline}
        onChange={set("headline")}
      />
      <label className="flex flex-col gap-2 text-sm font-medium text-white">
        Bio
        <Textarea
          value={v.bio}
          onChange={(e) => set("bio")(e.target.value)}
          maxLength={1000}
          placeholder="A few lines about you…"
        />
      </label>
      <Field
        label="Skills"
        name="skills"
        icon={Briefcase}
        placeholder="React, TypeScript, Figma"
        hint="Separate skills with commas."
        value={v.skills}
        onChange={set("skills")}
      />
      <Field
        label="Resume link (PDF)"
        name="resumeUrl"
        icon={Link2}
        placeholder="https://…/resume.pdf"
        hint="Paste a link to your resume. File upload isn't available yet."
        value={v.resumeUrl}
        onChange={set("resumeUrl")}
        error={errors.resumeUrl}
      />
      <Button type="submit" disabled={pending} className="w-fit">
        {pending && <LoaderCircle aria-hidden className="animate-spin" />}
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}

export function PasswordForm() {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [errors, setErrors] = useState<{ current?: string; next?: string }>({})
  const [pending, startTransition] = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!current) errs.current = "Enter your current password."
    if (next.length < 8) errs.next = "Use at least 8 characters."
    setErrors(errs)
    if (Object.keys(errs).length) return

    startTransition(async () => {
      const { error } = await authClient.changePassword({
        currentPassword: current,
        newPassword: next,
      })
      if (error) {
        setErrors({
          current: error.message ?? "Couldn't change your password.",
        })
        return
      }
      toast.success("Password changed")
      setCurrent("")
      setNext("")
    })
  }

  return (
    <form onSubmit={submit} noValidate className={card}>
      <h2 className="text-xl font-semibold text-white">Password</h2>
      <Field
        label="Current password"
        name="current"
        type="password"
        icon={Lock}
        autoComplete="current-password"
        value={current}
        onChange={setCurrent}
        error={errors.current}
      />
      <Field
        label="New password"
        name="new"
        type="password"
        icon={Lock}
        autoComplete="new-password"
        hint="Use 8 or more characters."
        value={next}
        onChange={setNext}
        error={errors.next}
      />
      <Button
        type="submit"
        variant="outline"
        disabled={pending}
        className="w-fit"
      >
        {pending && <LoaderCircle aria-hidden className="animate-spin" />}
        {pending ? "Updating…" : "Change password"}
      </Button>
    </form>
  )
}
