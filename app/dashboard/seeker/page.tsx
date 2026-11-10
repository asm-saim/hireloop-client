import Link from "next/link"
import {
  Award,
  Bell,
  BookmarkCheck,
  BriefcaseBusiness,
  CalendarCheck,
  FileText,
  Pencil,
  Send,
} from "lucide-react"

import { UserAvatar } from "@/components/dashboard/avatar"
import { PageHeader } from "@/components/dashboard/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusChart } from "@/components/dashboard/status-chart"
import { Button } from "@/components/ui/button"
import { formatDate, timeAgo } from "@/lib/format"
import { requireRole } from "@/lib/session"
import { listApplications } from "@/server/repositories/applications"
import { getLatestJobs } from "@/server/repositories/jobs"
import { getProfile } from "@/server/repositories/profiles"
import { countSaved } from "@/server/repositories/saved"
import {
  APPLICATION_STATUSES,
  STATUS_LABEL,
  type ApplicationStatus,
} from "@/server/models"

type Activity = {
  id: string
  at: Date
  text: React.ReactNode
  icon: typeof Send
}

export default async function SeekerOverview() {
  const user = await requireRole("seeker")
  const [applications, saved, profile] = await Promise.all([
    listApplications(user.id),
    countSaved(user.id),
    getProfile(user.id),
  ])

  const counts = Object.fromEntries(
    APPLICATION_STATUSES.map((s) => [s, 0])
  ) as Record<ApplicationStatus, number>
  for (const a of applications) counts[a.status]++

  const alerts = await getLatestJobs(
    2,
    applications.map((a) => a.jobId)
  )

  const activity: Activity[] = [
    ...applications.flatMap((a): Activity[] => {
      const title = a.job ? `${a.job.title} at ${a.job.company.name}` : "a job"
      const items: Activity[] = [
        {
          id: `${a.id}-applied`,
          at: a.createdAt,
          icon: Send,
          text: (
            <>
              You applied to <strong className="font-medium">{title}</strong>
            </>
          ),
        },
      ]
      if (a.status !== "applied") {
        items.push({
          id: `${a.id}-status`,
          at: a.updatedAt,
          icon: CalendarCheck,
          text: (
            <>
              Your application for{" "}
              <strong className="font-medium">{title}</strong> is now{" "}
              <strong className="font-medium">{STATUS_LABEL[a.status]}</strong>
            </>
          ),
        })
      }
      return items
    }),
    ...alerts.map((j): Activity => ({
      id: `alert-${j.id}`,
      at: j.postedAt,
      icon: Bell,
      text: (
        <>
          Job alert:{" "}
          <Link
            href={`/jobs/${j.id}`}
            className="font-medium underline-offset-2 hover:underline"
          >
            {j.title}
          </Link>{" "}
          at {j.company.name}
        </>
      ),
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 6)

  return (
    <div className="mx-auto flex max-w-[68.75rem] flex-col gap-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        text="Here is where your job search stands today."
      />

      <section
        aria-label="Summary"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard icon={BookmarkCheck} label="Saved Jobs" value={saved} />
        <StatCard
          icon={Send}
          label="Applications Submitted"
          value={applications.length}
        />
        <StatCard
          icon={CalendarCheck}
          label="Interviews Scheduled"
          value={counts.shortlisted}
          hint="Shortlisted applications"
        />
        <StatCard icon={Award} label="Offers Received" value={counts.offered} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <section
          aria-labelledby="profile-heading"
          className="flex flex-col gap-5 rounded-3xl border border-white/[0.07] bg-surface p-6"
        >
          <h2 id="profile-heading" className="sr-only">
            Profile
          </h2>
          <div className="flex items-center gap-4">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="size-16 text-lg"
            />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-white">
                {user.name}
              </p>
              <p className="truncate text-sm text-white/70">{user.email}</p>
            </div>
          </div>
          {profile.headline && (
            <p className="text-white/80">{profile.headline}</p>
          )}
          {profile.skills.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {profile.skills.slice(0, 6).map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-chip px-3 py-1 text-xs text-white"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            render={<Link href="/dashboard/seeker/settings" />}
            nativeButton={false}
          >
            <Pencil aria-hidden />
            Edit profile
          </Button>
        </section>

        <section
          aria-labelledby="chart-heading"
          className="flex flex-col gap-5 rounded-3xl border border-white/[0.07] bg-surface p-6"
        >
          <h2 id="chart-heading" className="text-xl font-semibold text-white">
            Application status
          </h2>
          {applications.length ? (
            <StatusChart counts={counts} />
          ) : (
            <div className="flex flex-col items-start gap-3 py-6">
              <p className="text-white/70">
                You haven&apos;t applied to any jobs yet. Your results will show
                up here.
              </p>
              <Button
                size="sm"
                render={<Link href="/dashboard/seeker/jobs" />}
                nativeButton={false}
              >
                <BriefcaseBusiness aria-hidden />
                Browse jobs
              </Button>
            </div>
          )}
        </section>
      </div>

      <section
        aria-labelledby="activity-heading"
        className="flex flex-col gap-4 rounded-3xl border border-white/[0.07] bg-surface p-6"
      >
        <h2 id="activity-heading" className="text-xl font-semibold text-white">
          Recent activity
        </h2>
        {activity.length ? (
          <ul className="flex flex-col divide-y divide-white/[0.07]">
            {activity.map(({ id, at, text, icon: Icon }) => (
              <li
                key={id}
                className="flex items-start gap-4 py-3 first:pt-0 last:pb-0"
              >
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-chip">
                  <Icon aria-hidden className="size-4 text-white" />
                </span>
                <div className="min-w-0 flex-1 text-white/90">
                  <p>{text}</p>
                  <p className="text-sm text-white/50" title={formatDate(at)}>
                    {timeAgo(at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex items-center gap-2 text-white/70">
            <FileText aria-hidden className="size-4" />
            Nothing yet. Apply to a job to get started.
          </p>
        )}
      </section>
    </div>
  )
}
