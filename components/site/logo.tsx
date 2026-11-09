import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="HireLoop home"
      className={cn("block", className)}
    >
      <Image
        src="/logo.png"
        alt="HireLoop"
        width={154}
        height={41}
        priority
        className="h-auto w-[8.125rem] sm:w-[9.625rem]"
      />
    </Link>
  )
}
