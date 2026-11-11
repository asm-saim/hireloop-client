"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"

import { FormError } from "@/components/auth/auth-shell"
import {
  PlainField,
  SelectField,
  TextareaField,
} from "@/components/dashboard/form-parts"
import { Button } from "@/components/ui/button"
import { CURRENCIES, JOB_CATEGORIES, JOB_TYPES } from "@/lib/data/types"
import { cn } from "@/lib/utils"
import { createJobAction, updateJobAction } from "@/server/actions/recruiter"

export type JobFormValues = {
  title: string
  category: string
  type: string
  currency: string
  salaryMin: string
  salaryMax: string
  remote: boolean
  location: string
  deadline: string
  overview: string
  responsibilities: string
  requirements: string
  benefits: string
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="flex flex-col gap-5 rounded-3xl border border-white/[0.07] bg-surface p-6">
      <legend className="float-left mb-1 w-full text-xl font-semibold text-white">
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

export function JobForm({
  jobId,
  companyName,
  initial,
  publishBlockedReason,
  isActive,
}: {
  jobId?: string
  companyName: string
  initial: JobFormValues
  /** When set, publishing is disabled and this explains why. */
  publishBlockedReason?: string | null
  isActive: boolean
}) {
  const router = useRouter()
  const [v, setV] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const set = (k: keyof JobFormValues) => (val: string) =>
    setV((p) => ({ ...p, [k]: val }))
  // Today as YYYY-MM-DD, read once (not on every render) for the date picker minimum.
  const [today] = useState(() => new Date().toISOString().slice(0, 10))

  function submit(intent: "draft" | "publish") {
    setError(null)
    const input = {
      intent,
      title: v.title,
      category: v.category as (typeof JOB_CATEGORIES)[number],
      type: v.type as (typeof JOB_TYPES)[number],
      currency: v.currency as (typeof CURRENCIES)[number],
      salaryMin: v.salaryMin || "0",
      salaryMax: v.salaryMax || "0",
      remote: v.remote,
      location: v.location,
      deadline: v.deadline,
      overview: v.overview,
      responsibilities: v.responsibilities,
      requirements: v.requirements,
      benefits: v.benefits,
    }
    startTransition(async () => {
      const res = jobId
        ? await updateJobAction(jobId, input)
        : await createJobAction(input)
      if (!res.ok) {
        setError(res.error)
        return
      }
      toast.success(intent === "publish" ? "Job published" : "Draft saved")
      router.push("/dashboard/recruiter/jobs")
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit("publish")
      }}
      noValidate
      className="flex flex-col gap-6"
    >
      <FormError message={error} />

      <Section title="Job info">
        <PlainField
          label="Job title"
          value={v.title}
          onChange={set("title")}
          placeholder="e.g. Senior Frontend Engineer"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Category"
            value={v.category}
            onChange={set("category")}
            options={JOB_CATEGORIES}
          />
          <SelectField
            label="Job type"
            value={v.type}
            onChange={set("type")}
            options={JOB_TYPES}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-[8rem_1fr_1fr]">
          <SelectField
            label="Currency"
            value={v.currency}
            onChange={set("currency")}
            options={CURRENCIES}
          />
          <PlainField
            label="Minimum salary / year"
            type="number"
            min={0}
            value={v.salaryMin}
            onChange={set("salaryMin")}
            placeholder="60000"
          />
          <PlainField
            label="Maximum salary / year"
            type="number"
            min={0}
            value={v.salaryMax}
            onChange={set("salaryMax")}
            placeholder="90000"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#101010] px-4 py-3">
            <span id="remote-label" className="text-sm font-medium text-white">
              Remote job
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={v.remote}
              aria-labelledby="remote-label"
              onClick={() => setV((p) => ({ ...p, remote: !p.remote }))}
              className={cn(
                "relative h-7 w-12 rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                v.remote ? "bg-brand" : "bg-white/20"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 left-1 size-5 rounded-full bg-white transition-transform",
                  v.remote && "translate-x-5"
                )}
              />
            </button>
          </div>
          {!v.remote && (
            <PlainField
              label="Location"
              value={v.location}
              onChange={set("location")}
              placeholder="City, Country"
            />
          )}
        </div>
        <PlainField
          label="Application deadline"
          type="date"
          min={today}
          value={v.deadline}
          onChange={set("deadline")}
        />
      </Section>

      <Section title="Job description">
        <TextareaField
          label="Overview"
          value={v.overview}
          onChange={set("overview")}
          rows={4}
          maxLength={1500}
          hint="A short summary of the role. The first 200 characters appear on job cards."
        />
        <TextareaField
          label="Responsibilities"
          value={v.responsibilities}
          onChange={set("responsibilities")}
          rows={5}
          hint="One per line."
        />
        <TextareaField
          label="Requirements"
          value={v.requirements}
          onChange={set("requirements")}
          rows={5}
          hint="One per line."
        />
        <TextareaField
          label="Benefits (optional)"
          value={v.benefits}
          onChange={set("benefits")}
          rows={3}
          hint="One per line."
        />
      </Section>

      <Section title="Company">
        <p className="text-white/80">
          This job will be posted for{" "}
          <strong className="font-semibold text-white">{companyName}</strong>.
        </p>
      </Section>

      {publishBlockedReason && (
        <p className="rounded-xl border border-white/20 bg-white/[0.04] px-4 py-3 text-sm text-white/80">
          {publishBlockedReason}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={pending || !!publishBlockedReason}
          size="lg"
        >
          {pending && <LoaderCircle aria-hidden className="animate-spin" />}
          {isActive ? "Save changes" : "Publish job"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={pending}
          onClick={() => submit("draft")}
        >
          {isActive ? "Unpublish & save as draft" : "Save as draft"}
        </Button>
      </div>
    </form>
  )
}
