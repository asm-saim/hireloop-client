import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"

import "./globals.css"

// Fonts are self-hosted (app/fonts) so the build never needs network access.
const manrope = localFont({
  src: "./fonts/Manrope.woff2",
  variable: "--nf-manrope",
  weight: "200 800",
  display: "swap",
})
const interTight = localFont({
  src: "./fonts/InterTight.woff2",
  variable: "--nf-inter-tight",
  weight: "100 900",
  display: "swap",
})
const jakarta = localFont({
  src: "./fonts/PlusJakartaSans.woff2",
  variable: "--nf-jakarta",
  weight: "200 800",
  display: "swap",
})
const rethink = localFont({
  src: "./fonts/RethinkSans.woff2",
  variable: "--nf-rethink",
  weight: "400 800",
  display: "swap",
})
const geist = localFont({
  src: "./fonts/Geist.woff2",
  variable: "--nf-geist",
  weight: "100 900",
  display: "swap",
})
const spaceMono = localFont({
  src: "./fonts/SpaceMono.woff2",
  variable: "--nf-space-mono",
  weight: "400",
  display: "swap",
})

export const metadata: Metadata = {
  title: "HireLoop — The modern job hunting portal",
  description:
    "HireLoop connects top talent with world-class companies. Browse thousands of curated opportunities and land your next role — faster.",
}

export const viewport: Viewport = {
  themeColor: "#010103",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = [
    manrope.variable,
    interTight.variable,
    jakarta.variable,
    rethink.variable,
    geist.variable,
    spaceMono.variable,
  ].join(" ")

  return (
    <html lang="en" className={`dark ${fontVars}`}>
      <body className="min-h-svh overflow-x-clip">{children}</body>
    </html>
  )
}