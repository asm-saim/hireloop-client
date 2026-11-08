"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, LoaderCircle, Lock, Mail } from "lucide-react"

import { AuthDivider, FormError } from "@/components/auth/auth-shell"
import { Field } from "@/components/auth/field"
import { GoogleButton } from "@/components/auth/google-button"
import { Button } from "@/components/ui/button"
import { EMAIL_PATTERN, login } from "@/lib/auth-client"

type Errors = { email?: string; password?: string }

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    const next: Errors = {}
    if (!email.trim()) next.email = "Enter your email address."
    else if (!EMAIL_PATTERN.test(email.trim()))
      next.email = "Enter a valid email address."
    if (!password) next.password = "Enter your password."
    setErrors(next)
    if (Object.keys(next).length) return

    setPending(true)
    try {
      await login({ email: email.trim(), password, remember })
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
          Welcome back
        </h1>
        <p className="text-base leading-[1.6] text-white/80">
          Sign in to pick up your search where you left off.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <GoogleButton label="Continue with Google" />
        <AuthDivider>or sign in with email</AuthDivider>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <FormError message={formError} />
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
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            labelAction={
              <Link
                href="/forgot-password"
                className="text-sm text-brand transition-colors hover:text-brand/80 focus-visible:underline focus-visible:outline-none"
              >
                Forgot password?
              </Link>
            }
          />

          <label className="flex w-fit cursor-pointer items-center gap-3 text-sm text-white select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-5 cursor-pointer rounded-md border border-white/30 bg-[#101010] accent-[#5c53fe]"
            />
            Keep me signed in
          </label>

          <Button
            type="submit"
            disabled={pending}
            className="h-14 w-full rounded-2xl text-base"
          >
            {pending ? (
              <LoaderCircle aria-hidden className="animate-spin" />
            ) : null}
            {pending ? "Signing in…" : "Sign In"}
            {!pending && <ArrowRight aria-hidden />}
          </Button>
        </form>
      </div>

      <p className="text-center text-base text-white/80">
        New to HireLoop?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand transition-colors hover:text-brand/80 focus-visible:underline focus-visible:outline-none"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
