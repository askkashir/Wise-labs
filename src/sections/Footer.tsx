import { WiseLabLogo } from '@/components/WiseLabLogo'
import { NAV_LINKS } from '@/lib/nav'

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden pt-20 pb-10 text-beige"
      style={{
        background:
          'radial-gradient(120% 120% at 20% 0%, #33212b 0%, #241820 60%, #1b1219 100%)',
      }}
    >
      <div className="grain opacity-[0.06]" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-5%] h-80 w-80 rounded-full bg-teal/10 blur-[130px]" />

      <div className="container-wise relative">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <WiseLabLogo variant="white" size={104} showTagline />
            <p className="mt-6 font-display text-2xl font-medium text-beige/90">
              Her idea. Her enterprise. Her flight.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-6 gap-y-3 md:justify-items-end">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="link-underline text-sm font-medium text-beige/70 transition-colors hover:text-beige"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-beige/10 bg-beige/[0.03]">
          <img
            src="/pm-banner.jpg"
            alt="Under the vision of the Honorable Prime Minister of Pakistan, WISE Lab is designed and funded by the Ministry of IT & Telecom and Ignite — National Technology Fund."
            className="w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="mt-8 space-y-1.5 border-t border-beige/10 pt-8 text-sm text-beige/55">
          <p>Under the vision of the Prime Minister of Pakistan.</p>
          <p>
            Designed &amp; funded by the Ministry of IT &amp; Telecom and Ignite —
            National Technology Fund.
          </p>
          <p className="pt-1">
            <a href="#" onClick={(e) => e.preventDefault()} className="link-underline text-coral">
              wiselab.org.pk
            </a>
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 text-sm text-beige/45 sm:flex-row sm:items-center">
          <p>
            © 2026 WISE Lab — Women Innovation and Startup Empowerment Lab.
          </p>
          <p className="font-display italic text-beige/60">From cocoon to flight.</p>
        </div>
      </div>
    </footer>
  )
}
