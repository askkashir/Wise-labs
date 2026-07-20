import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'

const PARTNERS = [
  { name: 'JazzWorld', role: 'Consortium Lead', featured: true },
  { name: 'Mobilink Microfinance Bank', role: 'Co-Lead Partner', featured: false },
  { name: 'Change Mechanics', role: 'Managing Partner', featured: false },
]

const CHIPS = [
  'Academic',
  'Corporate',
  'Development',
  'Financial',
  'Media',
  'Investor Networks',
  'Training',
  'Market Access',
  'Community',
]

export function PowerCircle() {
  return (
    <section
      id="power-circle"
      className="relative overflow-hidden py-28 text-beige md:py-36"
      style={{
        background:
          'radial-gradient(120% 100% at 80% 0%, #4a2e3d 0%, #33212b 55%, #241820 100%)',
      }}
    >
      <div className="grain opacity-[0.07]" />
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-[-10%] top-1/3 h-80 w-80 rounded-full bg-teal/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-8%] top-10 h-72 w-72 rounded-full bg-coral/15 blur-[120px]" />

      <div className="container-wise relative">
        <div className="max-w-3xl">
          <Reveal>
            <p
              className="text-[11px] font-semibold uppercase tracking-eyebrow"
              style={{ color: '#E38470' }}
            >
              The Power Circle
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-beige">
              The ecosystem behind her enterprise
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-beige/70">
              A premier alliance committed to women-led innovation, access,
              enterprise, and inclusive growth — because when the right rooms
              open, women-led businesses don't just enter them. They transform
              them.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <p className="mt-14 text-[11px] font-semibold uppercase tracking-[0.2em] text-beige/45">
            Built by a consortium of change-makers
          </p>
        </Reveal>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {PARTNERS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="glass group flex h-full flex-col justify-between rounded-3xl p-8"
              >
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-coral">
                    {p.role}
                  </div>
                  <div className="mt-4 font-display text-2xl font-bold text-beige">
                    {p.name}
                  </div>
                </div>
                <div className="mt-8 h-px w-full bg-beige/10">
                  <div className="h-px w-0 bg-coral transition-all duration-500 group-hover:w-full" />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Funders */}
        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-beige/10 bg-beige/[0.03] p-8 md:flex-row md:items-center md:justify-between">
            <span className="text-sm italic text-beige/55">Designed &amp; funded by</span>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="font-display text-xl font-semibold text-beige">
                Ministry of IT &amp; Telecom
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-coral" />
              <span className="font-display text-xl font-semibold text-beige">
                Ignite — National Technology Fund
              </span>
            </div>
          </div>
        </Reveal>

        {/* Ecosystem chips */}
        <RevealGroup className="mt-12 flex flex-wrap gap-3" stagger={0.04}>
          {CHIPS.map((chip) => (
            <RevealItem key={chip}>
              <span className="inline-flex rounded-full border border-beige/15 bg-beige/[0.04] px-4 py-2 text-sm font-medium text-beige/75 transition-colors hover:border-coral/50 hover:text-beige">
                {chip}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Closing + CTA */}
        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col items-start gap-6 border-t border-beige/10 pt-10 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium italic leading-snug text-beige">
              Her idea was never small. The ecosystem around it needed to expand.
            </p>
            <a
              href="#wise-connect"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-sm font-semibold text-plum transition-transform hover:scale-[1.03]"
            >
              Join the Power Circle
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
