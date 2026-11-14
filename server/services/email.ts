import "server-only"

import nodemailer, { type Transporter } from "nodemailer"

import { appUrl } from "@/server/services/stripe"
import { STATUS_LABEL, type ApplicationStatus } from "@/server/models"

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!
  )

let transporter: Transporter | undefined
function getTransporter() {
  const host = process.env.SMTP_HOST
  if (!host) return null
  return (transporter ??= nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  }))
}

const MESSAGE: Record<ApplicationStatus, string> = {
  applied: "We've received your application.",
  under_review: "The hiring team has started reviewing your application.",
  shortlisted: "Great news! You've been shortlisted for the next step.",
  rejected:
    "Unfortunately the company has decided not to move forward with your application.",
  offered: "Congratulations! You've received a job offer.",
}

/**
 * Emails the applicant when their status changes. Without SMTP settings it
 * only logs (handy in development). Failures never block the status update.
 */
export async function notifyApplicantStatusChange(input: {
  to: string
  applicantName: string
  jobTitle: string
  companyName: string
  status: ApplicationStatus
}) {
  const label = STATUS_LABEL[input.status]
  const subject = `${input.companyName}: your application is now "${label}"`
  const link = `${appUrl()}/dashboard/seeker/applications`
  const text = `Hi ${input.applicantName},\n\n${MESSAGE[input.status]}\n\nJob: ${input.jobTitle}\nCompany: ${input.companyName}\nStatus: ${label}\n\nView your applications: ${link}\n\n— HireLoop`
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#111">
<h2 style="margin:0 0 12px">Application update</h2>
<p>Hi ${escapeHtml(input.applicantName)},</p>
<p>${escapeHtml(MESSAGE[input.status])}</p>
<table style="border-collapse:collapse;margin:16px 0">
<tr><td style="padding:4px 16px 4px 0;color:#666">Job</td><td><strong>${escapeHtml(input.jobTitle)}</strong></td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#666">Company</td><td>${escapeHtml(input.companyName)}</td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#666">Status</td><td><strong>${escapeHtml(label)}</strong></td></tr></table>
<p><a href="${link}" style="background:#5c53fe;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">View my applications</a></p>
<p style="color:#888;font-size:12px">HireLoop</p></div>`

  const t = getTransporter()
  if (!t) {
    console.info(`[email:not-configured] To ${input.to}: ${subject}`)
    return
  }
  try {
    await t.sendMail({
      from: process.env.EMAIL_FROM ?? "HireLoop <no-reply@hireloop.example>",
      to: input.to,
      subject,
      text,
      html,
    })
  } catch (e) {
    console.error("[email] failed to send status email", e)
  }
}
