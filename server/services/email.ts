import "server-only"

import type { ApplicationStatus } from "@/server/models"

/**
 * Placeholder for the status-change email. It only logs for now; it is wired
 * into the status update so Part 3 can replace this body with a real email
 * provider (Resend, SES, Nodemailer…) without touching any caller.
 */
export async function notifyApplicantStatusChange(input: {
  to: string
  applicantName: string
  jobTitle: string
  companyName: string
  status: ApplicationStatus
}) {
  console.info(
    `[email:stub] To ${input.to}: your application for ${input.jobTitle} at ${input.companyName} is now "${input.status}".`
  )
}
