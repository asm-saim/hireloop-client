import { Footer } from "@/components/site/footer"
import { Navbar } from "@/components/site/navbar"

/** Navbar + footer wrapper for public pages that don't have the hero. */
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="relative pt-[7.5rem] sm:pt-[8.75rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26.25rem] bg-[radial-gradient(ellipse_60%_70%_at_50%_0%,rgb(92_83_254/0.22),transparent)]"
        />
        {children}
      </main>
      <div className="pt-16 pb-6 sm:pt-24">
        <Footer />
      </div>
    </>
  )
}

export function PageHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text?: string
}) {
  return (
    <div className="mx-auto flex max-w-[40rem] flex-col items-center gap-4 text-center">
      <p className="flex items-center gap-4 font-mono-label text-base text-white sm:text-xl">
        <span aria-hidden className="size-2 bg-brand" />
        {eyebrow}
        <span aria-hidden className="size-2 bg-brand" />
      </p>
      <h1 className="text-4xl leading-[1.15] font-bold tracking-[-0.036em] text-balance text-white sm:text-5xl">
        {title}
      </h1>
      {text && (
        <p className="text-base leading-[1.6] text-white/80 sm:text-lg">
          {text}
        </p>
      )}
    </div>
  )
}
