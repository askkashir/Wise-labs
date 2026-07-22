import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Rocket, Store, Compass, Network } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'

const MotionLink = motion(Link)

const PILLARS = [
  {
    i18nKey: 'founder',
    color: '#2E7D7B',
    href: '/apply/founder',
    Icon: Rocket,
  },
  {
    i18nKey: 'enterprise',
    color: '#E8823C',
    href: '/apply/enterprise',
    Icon: Store,
  },
  {
    i18nKey: 'mentor',
    color: '#2C7A70',
    href: '/apply/mentor',
    Icon: Compass,
  },
  {
    i18nKey: 'partner',
    color: '#E38470',
    href: '/apply/partner',
    Icon: Network,
  },
] as const

export function EnterTheLab() {
  const { t } = useTranslation()
  return (
    <section id="enter-the-lab" className="relative overflow-hidden py-28 md:py-36">
      <div className="grain" />
      <div className="container-wise relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">{t('enterTheLab.eyebrow')}</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
              {t('enterTheLab.title1')}
              <br />
              {t('enterTheLab.title2')}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-pretty leading-relaxed text-plum/70">
              {t('enterTheLab.intro')}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <RevealItem key={p.i18nKey}>
              <MotionLink
                to={p.href}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-plum/10 bg-white p-8 shadow-card transition-shadow duration-500 hover:shadow-card-hover"
              >
                {/* top accent rail */}
                <span
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: p.color }}
                />
                <div className="flex items-start justify-between">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-105"
                    style={{ background: `${p.color}14`, color: p.color }}
                  >
                    <p.Icon className="h-7 w-7" strokeWidth={1.4} />
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-plum/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    style={{ color: undefined }}
                  />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-plum">
                  {t(`enterTheLab.pillars.${p.i18nKey}.title`)}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-plum/65">
                  {t(`enterTheLab.pillars.${p.i18nKey}.body`)}
                </p>
                <span
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  style={{ color: p.color }}
                >
                  {t(`enterTheLab.pillars.${p.i18nKey}.cta`)}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </MotionLink>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-12 text-center font-display text-xl font-medium italic text-plum/70">
            {t('enterTheLab.closing')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
