import Link from "next/link"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/site/motion"

/** Domed purple glow with a faint grid, as in the Figma's closing section. */
function Dome() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-10 aspect-[1498/1037] w-[200vw] max-w-[1498px] -translate-x-1/2 rounded-[50%] sm:w-[160vw]"
        style={{
          background:
            "radial-gradient(ellipse 43% 43% at 50% 0%, #5c53fe 0%, rgb(92 83 254 / 0.6) 29%, rgb(92 83 254 / 0.5) 52%, rgb(92 83 254 / 0) 100%)",
        }}
      >
        <div
          className="absolute inset-0 rounded-[50%] opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255 / 0.14) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.14) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 50% 60% at 50% 0%, black, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 50% 60% at 50% 0%, black, transparent 80%)",
          }}
        />
      </div>
      {/* fade to the page background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[171px] bottom-0 -z-10 bg-gradient-to-b from-transparent via-ink/80 to-ink"
      />
    </>
  )
}

export function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="relative">
      <Dome />
      <FadeIn className="mx-auto flex max-w-[792px] flex-col items-center gap-10 px-4 pt-32 pb-24 text-center sm:gap-12 sm:px-8 sm:pt-40 lg:pt-[153px] lg:pb-[118px]">
        <div className="flex flex-col items-center gap-4">
          <h2
            id="cta-heading"
            className="font-rethink text-4xl leading-[1.2] font-medium tracking-[-0.023em] text-balance text-white sm:text-5xl lg:text-[64px]"
          >
            Your next role is <br className="hidden sm:block" />
            already looking for you
          </h2>
          <p className="max-w-[792px] text-base leading-[1.6] text-white sm:text-xl">
            Build a profile in three minutes. The matches start arriving
            tomorrow morning.
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row">
          <Button
            variant="light"
            size="lg"
            render={<Link href="/register" />}
            nativeButton={false}
          >
            Create a free account
          </Button>
          <Button
            variant="outline"
            size="lg"
            render={<Link href="/pricing" />}
            nativeButton={false}
            className="font-medium"
          >
            View pricing
          </Button>
        </div>
      </FadeIn>
    </section>
  )
}
