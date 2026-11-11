"use client"

import { useId } from "react"
import { CircleAlert } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export const fieldClass =
  "h-14 w-full rounded-2xl border border-white/20 bg-[#101010] px-4 text-base text-white outline-none transition-colors placeholder:text-white/40 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/25"

function Wrapper({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p
          role="alert"
          id={`${id}-error`}
          className="flex items-center gap-1.5 text-sm text-destructive"
        >
          <CircleAlert aria-hidden className="size-4 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-white/60">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  className,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: readonly string[]
  placeholder?: string
  error?: string
  className?: string
}) {
  const id = useId()
  return (
    <Wrapper id={id} label={label} error={error}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        className={cn(fieldClass, error && "border-destructive/70", className)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Wrapper>
  )
}

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  rows = 4,
  maxLength,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  error?: string
  rows?: number
  maxLength?: number
}) {
  const id = useId()
  return (
    <Wrapper id={id} label={label} hint={hint} error={error}>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
      />
    </Wrapper>
  )
}

export function PlainField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  error,
  min,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: "text" | "number" | "date" | "url"
  placeholder?: string
  hint?: string
  error?: string
  min?: string | number
}) {
  const id = useId()
  return (
    <Wrapper id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        type={type}
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        className={cn(fieldClass, error && "border-destructive/70")}
      />
    </Wrapper>
  )
}
