import Link from "next/link"

import { Logo } from "@/components/site/logo"
import { cn } from "@/lib/utils"

const columns = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "/jobs" },
      { label: "Worker AI", href: "#features" },
      { label: "Companies", href: "/companies" },
      { label: "Salary data", href: "#features" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "#" },
      { label: "Career library", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "#" },
      { label: "Newsroom", href: "#" },
    ],
  },
]

type IconProps = { className?: string }

function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M13.5 21v-8h2.7l.5-3.2h-3.2V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.6V13h2.8v8z" />
    </svg>
  )
}
function PinterestIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M12.017 2C6.5 2 2.029 6.47 2.029 11.987c0 4.232 2.632 7.848 6.347 9.302-.088-.79-.166-2.002.034-2.866.182-.78 1.172-4.964 1.172-4.964s-.299-.6-.299-1.484c0-1.386.806-2.426 1.81-2.426.852 0 1.265.64 1.265 1.407 0 .857-.545 2.139-.828 3.327-.237.994.499 1.804 1.479 1.804 1.775 0 3.14-1.871 3.14-4.572 0-2.39-1.717-4.058-4.17-4.058-2.84 0-4.508 2.13-4.508 4.332 0 .858.33 1.78.742 2.28.082.1.094.185.071.286-.075.313-.244.994-.277 1.134-.044.187-.144.226-.334.137-1.246-.58-2.025-2.4-2.025-3.872 0-3.152 2.29-6.046 6.6-6.046 3.465 0 6.16 2.47 6.16 5.77 0 3.446-2.172 6.218-5.19 6.218-1.012 0-1.964-.526-2.29-1.148l-.623 2.373c-.225.868-.835 1.956-1.243 2.62.936.288 1.923.444 2.96.444 5.517 0 9.988-4.47 9.988-9.986C22.005 6.47 17.534 2 12.017 2z" />
    </svg>
  )
}
function LinkedinIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M6.94 9.5H3.56V20h3.38zM5.25 4a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM20.44 14.1c0-3.15-1.68-4.8-3.93-4.8-1.8 0-2.6 1-3.05 1.7V9.5h-3.38c.04.96 0 10.5 0 10.5h3.38v-5.86c0-.31.02-.62.12-.84.25-.62.82-1.27 1.78-1.27 1.25 0 1.75.96 1.75 2.36V20h3.38z" />
    </svg>
  )
}

const socials = [
  { label: "Facebook", href: "#", Icon: FacebookIcon, active: false },
  { label: "Pinterest", href: "#", Icon: PinterestIcon, active: true },
  { label: "LinkedIn", href: "#", Icon: LinkedinIcon, active: false },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 xl:px-[60px]">
      <div className="flex flex-col gap-12 rounded-2xl border border-white/[0.07] bg-ink px-6 py-10 sm:px-10 lg:gap-[72px] lg:px-0 lg:py-10">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-24 lg:px-10 xl:gap-[400px]">
          <div className="flex max-w-[288px] flex-col gap-6">
            <Logo />
            <p className="text-base leading-[1.9] text-white">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:gap-x-[72px]"
          >
            {columns.map((col) => (
              <div
                key={col.title}
                className="flex min-w-[130px] flex-col gap-6"
              >
                <h2 className="font-tight text-lg leading-[1.4] font-medium text-brand">
                  {col.title}
                </h2>
                <ul className="flex flex-col gap-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-base leading-[1.9] text-footer-link transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <ul className="flex gap-2">
            {socials.map(({ label, href, Icon, active }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className={cn(
                    "grid size-10 place-items-center rounded-lg text-white transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    active
                      ? "bg-brand hover:bg-brand/90"
                      : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  <Icon className="size-6" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-1 text-base leading-[1.9] text-footer-meta sm:flex-row sm:gap-6">
            <p>Copyright {year} — HireLoop</p>
            <p>Terms &amp; Policy - Privacy Guideline</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
