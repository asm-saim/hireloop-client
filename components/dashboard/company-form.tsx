"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle, Upload } from "lucide-react"
import { toast } from "sonner"

import { FormError } from "@/components/auth/auth-shell"
import {
  PlainField,
  SelectField,
  TextareaField,
} from "@/components/dashboard/form-parts"
import { CompanyAvatar } from "@/components/jobs/company-avatar"
import { Button } from "@/components/ui/button"
import { EMPLOYEE_RANGES, INDUSTRIES } from "@/lib/data/types"
import { saveCompanyAction } from "@/server/actions/recruiter"

const MAX_LOGO = 300 * 1024

export type CompanyFormValues = {
  name: string
  industry: string
  website: string
  location: string
  employees: string
  description: string
  logoUrl?: string
}

export function CompanyForm({
  initial,
  isEdit,
}: {
  initial: CompanyFormValues
  isEdit: boolean
}) {
  const router = useRouter()
  const [v, setV] = useState(initial)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | undefined>(initial.logoUrl)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const set = (k: keyof CompanyFormValues) => (val: string) =>
    setV((p) => ({ ...p, [k]: val }))

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    setError(null)
    if (!f) return
    if (!/^image\/(png|jpeg|webp)$/.test(f.type)) {
      setError("The logo must be a PNG, JPG or WebP image.")
      e.target.value = ""
      return
    }
    if (f.size > MAX_LOGO) {
      setError("The logo must be 300 KB or smaller.")
      e.target.value = ""
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const fd = new FormData()
    for (const k of [
      "name",
      "industry",
      "website",
      "location",
      "employees",
      "description",
    ] as const)
      fd.set(k, v[k])
    if (file) fd.set("logo", file)

    startTransition(async () => {
      const res = await saveCompanyAction(fd)
      if (!res.ok) {
        setError(res.error)
        return
      }
      toast.success(isEdit ? "Company updated" : "Company submitted for review")
      router.push("/dashboard/recruiter/company")
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-6 rounded-3xl border border-white/[0.07] bg-surface p-6"
    >
      <FormError message={error} />

      <div className="flex flex-wrap items-center gap-5">
        <CompanyAvatar
          name={v.name || "Company"}
          logoUrl={preview}
          className="size-20 text-2xl"
        />
        <div className="flex flex-col gap-2">
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-[#0e0b16] px-4 py-2.5 text-sm font-medium text-white transition-colors focus-within:ring-3 focus-within:ring-ring/50 hover:bg-white/10">
            <Upload aria-hidden className="size-4" />
            {preview ? "Change logo" : "Upload logo"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onFile}
              className="sr-only"
            />
          </label>
          <p className="text-sm text-white/60">
            PNG, JPG or WebP, up to 300 KB.
          </p>
        </div>
      </div>

      <PlainField
        label="Company name"
        value={v.name}
        onChange={set("name")}
        placeholder="Acme Inc."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          label="Industry"
          value={v.industry}
          onChange={set("industry")}
          options={INDUSTRIES}
          placeholder="Select industry"
        />
        <SelectField
          label="Employee count"
          value={v.employees}
          onChange={set("employees")}
          options={EMPLOYEE_RANGES}
          placeholder="Select range"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <PlainField
          label="Location"
          value={v.location}
          onChange={set("location")}
          placeholder="City, Country"
        />
        <PlainField
          label="Website"
          type="url"
          value={v.website}
          onChange={set("website")}
          placeholder="https://example.com"
        />
      </div>
      <TextareaField
        label="Short description"
        value={v.description}
        onChange={set("description")}
        maxLength={500}
        hint={`${v.description.length}/500`}
        placeholder="What does your company do?"
      />

      <Button type="submit" disabled={pending} className="w-fit">
        {pending && <LoaderCircle aria-hidden className="animate-spin" />}
        {pending ? "Saving…" : isEdit ? "Save changes" : "Submit for review"}
      </Button>
    </form>
  )
}
