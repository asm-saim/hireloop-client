"use client"

import { useId, useState } from "react"
import { CircleAlert, Eye, EyeOff, type LucideIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FieldProps = {
  label: string
  name: string
  icon: LucideIcon
  error?: string
  hint?: string
  type?: "text" | "email" | "password"
  placeholder?: string
  autoComplete?: string
  value: string
  onChange: (value: string) => void
  labelAction?: React.ReactNode
}

/** Labelled input in the same pill style as the homepage search bar. */
export function Field({
  label,
  name,
  icon: Icon,
  error,
  hint,
  type = "text",
  placeholder,
  autoComplete,
  value,
  onChange,
  labelAction,
}: FieldProps) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const isPassword = type === "password"
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={id}>{label}</Label>
        {labelAction}
      </div>
      <div
        className={cn(
          "flex h-14 items-center gap-3 rounded-2xl border bg-[#101010] px-4 transition-colors focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/25",
          error ? "border-destructive/70" : "border-white/20"
        )}
      >
        <Icon aria-hidden className="size-5 shrink-0 text-white/70" />
        <Input
          id={id}
          name={name}
          type={isPassword && visible ? "text" : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="placeholder:text-white/40"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="-mr-1 grid size-9 shrink-0 place-items-center rounded-lg text-white/70 transition-colors outline-none hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {visible ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        )}
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
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
