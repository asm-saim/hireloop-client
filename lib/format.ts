export function formatSalary(min: number, max: number) {
  const k = (n: number) => `$${Math.round(n / 1000)}k`
  return `${k(min)} – ${k(max)} / year`
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

/** "5 days ago", "yesterday", "in 3 days" */
export function timeAgo(date: Date, now = new Date()) {
  const days = Math.round((date.getTime() - now.getTime()) / 86_400_000)
  if (Math.abs(days) < 30) return rtf.format(days, "day")
  const months = Math.round(days / 30)
  return rtf.format(months, "month")
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
}
