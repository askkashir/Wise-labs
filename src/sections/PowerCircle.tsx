import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'

function getPartners(t: TFunction) {
  return [
    {
      name: 'JazzWorld',
      role: t('powerCircle.partners.jazz', 'Consortium Lead'),
      logo: '/partners/jazz.png',
    },
    {
      name: 'Mobilink Microfinance Bank',
      role: t('powerCircle.partners.mobilink', 'Co-Lead Partner'),
      logo: '/partners/mobilink-mmbl.webp',
    },
    {
      name: 'Change Mechanics',
      role: t('powerCircle.partners.changeMechanics', 'Managing Partner'),
      logo: '/partners/change-mechanics.png',
    },
  ]
}

function getFunders(t: TFunction) {
  return [
    {
      name: 'Ministry of IT & Telecom',
      role: t('powerCircle.funders.moitt', 'Designed & Funded by'),
      logo: '/partners/moitt.png',
    },
    {
      name: 'Ignite — National Technology Fund',
      role: t('powerCircle.funders.ignite', 'Designed & Funded by'),
      logo: '/partners/ignite.webp',
    },
  ]
}

function getChips(t: TFunction): string[] {
  return [
    t('powerCircle.chips.academic', 'Academic'),
    t('powerCircle.chips.corporate', 'Corporate'),
    t('powerCircle.chips.development', 'Development'),
    t('powerCircle.chips.financial', 'Financial'),
    t('powerCircle.chips.media', 'Media'),
    t('powerCircle.chips.investorNetworks', 'Investor Networks'),
    t('powerCircle.chips.training', 'Training'),
    t('powerCircle.chips.marketAccess', 'Market Access'),
    t('powerCircle.chips.community', 'Community'),
  ]
}

export function PowerCircle() {
  const { t } = useTranslation()
  const PARTNERS = getPartners(t)
  const FUNDERS = getFunders(t)
  const CHIPS = getChips(t)
  const ALL_LOGOS = [...PARTNERS, ...FUNDERS]

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
              {t('nav.links.power-circle', 'The Power Circle')}
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-beige">
              {t('powerCircle.title', 'The ecosystem behind her enterprise')}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-beige/70">
              {t(
                'powerCircle.intro',
                "A premier alliance committed to women-led innovation, access, enterprise, and inclusive growth — because when the right rooms open, women-led businesses don't just enter them. They transform them."
              )}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <p className="mt-14 text-[11px] font-semibold uppercase tracking-[0.2em] text-beige/45">
            {t('powerCircle.consortiumLabel', 'Built by a consortium of change-makers')}
          </p>
        </Reveal>

        {/* Unified partner + funder logo grid */}
        <RevealGroup
          className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-5"
          stagger={0.06}
        >
          {ALL_LOGOS.map((p) => (
            <RevealItem key={p.name}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group flex h-full flex-col items-center gap-4 rounded-2xl bg-beige/[0.06] p-5 text-center ring-1 ring-beige/10 transition-colors duration-500 hover:bg-beige/10 md:p-6"
              >
                <div className="flex h-16 w-full items-center justify-center rounded-xl bg-white/95 p-3 md:h-20">
                  <img
                    src={p.logo}
                    alt={`${p.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-[15px] font-semibold leading-tight text-beige">
                    {p.name}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
                    {p.role}
                  </div>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>

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
              {t(
                'powerCircle.closingLine',
                'Her idea was never small. The ecosystem around it needed to expand.'
              )}
            </p>
            <a
              href="#wise-connect"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-sm font-semibold text-plum transition-transform hover:scale-[1.03]"
            >
              {t('powerCircle.cta', 'Join the Power Circle')}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
