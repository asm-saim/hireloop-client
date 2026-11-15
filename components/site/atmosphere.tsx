/** Fractal-noise film. Kills gradient banding and reads as "current" dark UI. */
const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

const particles = [
  "radial-gradient(1.5px 1.5px at 22% 78%, rgba(126,190,255,.9), transparent)",
  "radial-gradient(1px 1px at 35% 92%, rgba(56,189,248,.9), transparent)",
  "radial-gradient(1.5px 1.5px at 62% 85%, rgba(126,190,255,.9), transparent)",
  "radial-gradient(1px 1px at 78% 70%, rgba(45,212,191,.8), transparent)",
  "radial-gradient(1px 1px at 88% 88%, rgba(56,189,248,.9), transparent)",
  "radial-gradient(1px 1px at 12% 60%, rgba(255,255,255,.5), transparent)",
].join(",")

/**
 * Backdrop for the top of the page: a black arch, an aurora mesh in the brand
 * ramp, a faint dot grid, drifting particles and a grain film.
 *
 * Renders nothing to assistive tech and is clipped to the first viewport.
 */
export function Atmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[100svh] max-h-[60rem] min-h-[43.75rem] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_85%,transparent)]"
    >
      {/* grey top/edges, black arch rising from the bottom center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_100%_at_50%_100%,#000_40%,#303032_100%)]" />

      {/* subtle light lift along the top */}
      <div className="absolute inset-x-0 top-0 h-[18.75rem] bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(255_255_255/0.04),transparent)]" />

      {/* aurora mesh — brand blue, aqua, indigo */}
      <div className="absolute bottom-[-14%] left-1/2 h-72 w-[52%] -translate-x-1/2 rounded-full bg-brand/40 blur-[7.5rem] motion-safe:animate-glow-pulse" />
      <div className="absolute right-[4%] bottom-[2%] h-64 w-[40%] rounded-full bg-aqua/20 blur-[7.5rem] [animation-delay:-4s] motion-safe:animate-glow-pulse" />
      <div className="absolute bottom-[12%] left-[2%] h-64 w-[36%] rounded-full bg-[#363795]/50 blur-[7.5rem] [animation-delay:-9s] motion-safe:animate-glow-pulse" />

      {/* dot grid, faded toward the arch */}
      <div className="absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.6)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_45%_at_50%_0%,#000,transparent_75%)] [background-size:1.75rem_1.75rem] opacity-[0.14]" />

      {/* tiny particles */}
      <div
        className="absolute inset-0 motion-safe:animate-particle-twinkle"
        style={{ backgroundImage: particles }}
      />

      {/* grain film */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: grain }}
      />
    </div>
  )
}
