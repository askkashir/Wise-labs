import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Check, Rocket, Sprout } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { useTrack, type Track } from '@/lib/useTrackState'
import { cn } from '@/lib/utils'

interface TrackCard {
  id: Exclude<Track, 'neutral'>
  index: string
  i18nKey: 'founder' | 'enterprise'
  primary: string
  accent: string
  soft: string
  Icon: typeof Rocket
}

const CARDS: TrackCard[] = [
  {
    id: 'founder',
    index: '01',
    i18nKey: 'founder',
    primary: '#0F3D3B',
    accent: '#2E7D7B',
    soft: 'rgba(46,125,123,0.10)',
    Icon: Rocket,
  },
  {
    id: 'enterprise',
    index: '02',
    i18nKey: 'enterprise',
    primary: '#B85C1A',
    accent: '#E8823C',
    soft: 'rgba(232,130,60,0.10)',
    Icon: Sprout,
  },
]

export function BuildTracks() {
  const { t } = useTranslation()
  const { track, selectTrack } = useTrack()

  return (
    <section
      id="build-tracks"
      className="relative overflow-hidden bg-white py-28 md:py-36"
    >
      <div className="container-wise relative">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{t('buildTracks.eyebrow')}</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
            {t('buildTracks.title')}
          </h2>
          <p className="mt-4 text-lg text-plum/70">
            {t('buildTracks.subtitle')}
          </p>
          <p className="mt-3 text-sm text-plum/50">
            {t('buildTracks.helper')}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {CARDS.map((c, i) => {
            const active = track === c.id
            return (
              <Reveal key={c.id} delay={i * 0.1}>
                <motion.div
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  onClick={() => selectTrack(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      selectTrack(c.id)
                    }
                  }}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  className={cn(
                    'group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border p-8 transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:p-10'
                  )}
                  style={{
                    borderColor: active ? c.accent : 'rgba(74,46,61,0.12)',
                    background: active ? c.soft : '#fff',
                    boxShadow: active
                      ? `0 24px 60px -24px ${c.accent}`
                      : '0 1px 2px rgb(74 46 61 / 0.05), 0 16px 40px -24px rgb(74 46 61 / 0.35)',
                  }}
                >
                  {/* index watermark */}
                  <span
                    className="pointer-events-none absolute -right-2 -top-8 select-none font-display text-[9rem] font-bold leading-none transition-opacity duration-500"
                    style={{ color: c.accent, opacity: active ? 0.14 : 0.05 }}
                  >
                    {c.index}
                  </span>

                  <div className="relative flex items-center justify-between">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-500"
                      style={{
                        background: active ? c.primary : c.soft,
                        color: active ? '#fff' : c.primary,
                      }}
                    >
                      <c.Icon className="h-6 w-6" strokeWidth={1.6} />
                    </span>
                    <AnimatedBadge active={active} accent={c.accent} label={t('buildTracks.selected')} />
                  </div>

                  <p
                    className="relative mt-6 text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: c.accent }}
                  >
                    {t(`buildTracks.${c.i18nKey}.kicker`)}
                  </p>
                  <h3 className="relative mt-2 font-display text-3xl font-bold text-plum">
                    {t(`buildTracks.${c.i18nKey}.title`)}
                  </h3>
                  <p className="relative mt-3 text-[15px] font-medium text-plum/75">
                    {t(`buildTracks.${c.i18nKey}.lead`)}
                  </p>
                  <p className="relative mt-4 text-[15px] leading-relaxed text-plum/60">
                    {t(`buildTracks.${c.i18nKey}.body`)}
                  </p>

                  <p
                    className="relative mt-6 font-display text-lg font-medium italic"
                    style={{ color: c.primary }}
                  >
                    {t(`buildTracks.${c.i18nKey}.motto`)}
                  </p>

                  <div className="relative mt-8 flex items-center justify-between pt-6">
                    <a
                      href="#enter-the-lab"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                      style={{ background: c.primary }}
                    >
                      {t(`buildTracks.${c.i18nKey}.cta`)}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <span
                      className="text-xs font-medium transition-opacity duration-300"
                      style={{ color: c.accent, opacity: active ? 1 : 0 }}
                    >
                      {t('buildTracks.previewingAbove')}
                    </span>
                  </div>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function AnimatedBadge({
  active,
  accent,
  label,
}: {
  active: boolean
  accent: string
  label: string
}) {
  return (
    <motion.span
      initial={false}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
      style={{ background: accent, color: '#fff' }}
    >
      <Check className="h-3.5 w-3.5" /> {label}
    </motion.span>
  )
}
