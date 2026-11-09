import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Settings,
  SquarePlus,
  Users,
  type LucideIcon,
} from "lucide-react"

import type { DashboardRole } from "@/lib/session"

export type NavLink = { label: string; href: string; icon: LucideIcon }

export const roleNav: Record<DashboardRole, NavLink[]> = {
  seeker: [
    { label: "Overview", href: "/dashboard/seeker", icon: LayoutDashboard },
    {
      label: "Browse & Apply",
      href: "/dashboard/seeker/jobs",
      icon: BriefcaseBusiness,
    },
    { label: "Saved Jobs", href: "/dashboard/seeker/saved", icon: Bookmark },
    {
      label: "My Applications",
      href: "/dashboard/seeker/applications",
      icon: ClipboardList,
    },
    { label: "Billing", href: "/dashboard/seeker/billing", icon: CreditCard },
    { label: "Settings", href: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { label: "Overview", href: "/dashboard/recruiter", icon: LayoutDashboard },
    {
      label: "My Company",
      href: "/dashboard/recruiter/company",
      icon: Building2,
    },
    {
      label: "Manage Jobs",
      href: "/dashboard/recruiter/jobs",
      icon: BriefcaseBusiness,
    },
    {
      label: "Post a Job",
      href: "/dashboard/recruiter/jobs/new",
      icon: SquarePlus,
    },
    {
      label: "Billing",
      href: "/dashboard/recruiter/billing",
      icon: CreditCard,
    },
    {
      label: "Settings",
      href: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Manage Companies",
      href: "/dashboard/admin/companies",
      icon: Building2,
    },
    {
      label: "Manage Jobs",
      href: "/dashboard/admin/jobs",
      icon: BriefcaseBusiness,
    },
    { label: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
}

export const publicNav = [
  { label: "Home", href: "/" },
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
]

export const roleLabel: Record<DashboardRole, string> = {
  seeker: "Job Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
}
