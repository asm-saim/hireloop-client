"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  LoaderCircle,
  Lock,
  Mail,
  Search,
  User,
} from "lucide-react"

import { AuthDivider, FormError } from "@/components/auth/auth-shell"
import { Field } from "@/components/auth/field"
import { GoogleButton } from "@/components/auth/google-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EMAIL_PATTERN, register, type Role } from "@/lib/auth-client"

const roles = [
  {
    value: "seeker",
    title: "Job Seeker",
    text: "Find and apply to jobs",
    icon: Search,
  },
  {
    value: "recruiter",
    title: "Recruiter",
    text: "Hire for your company",
    icon: Building2,
  },
] as const

type Errors = {
  name?: string
  email?: string
  password?: string
  terms?: string
}

export function RegisterForm() {
  const [role, setRole] = useState<Role>("seeker")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    const next: Errors = {}
    if (!name.trim()) next.name = "Enter your full name."
    if (!email.trim()) next.email = "Enter your email address."
    else if (!EMAIL_PATTERN.test(email.trim()))
      next.email = "Enter a valid email address."
    if (password.length < 8) next.password = "Use at least 8 characters."
    if (!terms) next.terms = "Please accept the terms to continue."
    setErrors(next)
    if (Object.keys(next).length) return

    setPending(true)
    try {
      await register({ role, name: name.trim(), email: email.trim(), password })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl leading-[1.15] font-bold tracking-[-0.036em] text-white">
          Create your account
        </h1>
        <p className="text-base leading-[1.6] text-white/80">
          Join HireLoop and start getting matched in minutes.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <GoogleButton label="Sign up with Google" />
        <AuthDivider>or sign up with email</AuthDivider>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <FormError message={formError} />

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm leading-none font-medium text-white">
              I am a
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(({ value, title, text, icon: Icon }) => (
                <label key={value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={role === value}
                    onChange={() => setRole(value)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "flex h-full flex-col gap-2 rounded-2xl border border-white/20 bg-[#101010] p-4 transition-colors",
                      "peer-checked:border-brand peer-checked:bg-brand/10 peer-focus-visible:ring-3 peer-focus-visible:ring-brand/30 hover:border-white/40"
                    )}
                  >
                    <Icon aria-hidden className="size-5 text-white" />
                    <span className="text-sm font-semibold text-white">
                      {title}
                    </span>
                    <span className="text-xs leading-snug text-white/60">
                      {text}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <Field
            label="Full name"
            name="name"
            icon={User}
            placeholder="Your full name"
            autoComplete="name"
            value={name}
            onChange={setName}
            error={errors.name}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            hint="Use 8 or more characters."
          />

          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-white select-none">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                aria-invalid={errors.terms ? true : undefined}
                className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-md border border-white/30 bg-[#101010] accent-[#5c53fe]"
              />
              <span>
                I agree to the{" "}
                <Link href="#" className="text-brand hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-brand hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.terms && (
              <p role="alert" className="text-sm text-destructive">
                {errors.terms}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="h-14 w-full rounded-2xl text-base"
          >
            {pending ? (
              <LoaderCircle aria-hidden className="animate-spin" />
            ) : null}
            {pending ? "Creating account…" : "Create Account"}
            {!pending && <ArrowRight aria-hidden />}
          </Button>
        </form>
      </div>

      <p className="text-center text-base text-white/80">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand transition-colors hover:text-brand/80 focus-visible:underline focus-visible:outline-none"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
