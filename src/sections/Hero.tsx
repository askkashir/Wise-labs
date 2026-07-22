import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Hero3D } from '@/components/Hero3D'
import { TrackToggle } from '@/components/Hero3D/TrackToggle'
import { Button } from '@/components/ui/button'
import { MagneticButton } from '@/components/MagneticButton'
import { useTrack } from '@/lib/useTrackState'
import { TRACK_THEME } from '@/lib/theme'

export function Hero() {
  const { t } = useTranslation()
  const { track } = useTrack()
  const dark = track !== 'neutral'
  const words = t('hero.headlineWords', { returnObjects: true }) as string[]

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Atmospheric background — recolors with the active track */}
      <div
        className="absolute inset-0 -z-10 transition-[background] duration-700"
        style={{
          background:
            'radial-gradient(120% 120% at 72% 30%, var(--hero-bg-b) 0%, var(--hero-bg-a) 62%)',
        }}
      />
      {/* accent glow */}
      <div
        className="pointer-events-none absolute -z-10 h-[60vh] w-[60vh] rounded-full blur-[120px] transition-all duration-700"
        style={{
          right: '14%',
          top: '18%',
          background: 'var(--track-glow)',
          opacity: dark ? 0.7 : 0.35,
        }}
      />
      <div className="grain -z-10" />

      {/* 3D figure — occupies the right on desktop, full-bleed behind on mobile */}
      <div className="absolute inset-0 lg:left-[42%]">
        <Hero3D />
      </div>
      {/* legibility scrim on small screens */}
      <div
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, var(--hero-bg-a) 0%, transparent 30%, transparent 60%, var(--hero-bg-a) 100%)',
          opacity: 0.55,
        }}
      />

      <div className="container-wise relative z-10 flex flex-1 flex-col justify-center pt-28 pb-40 md:pt-32">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow theme-shift"
            style={{ color: dark ? TRACK_THEME[track].accent : undefined }}
          >
            {t('hero.eyebrow')}
          </motion.p>

          <h1
            className="mt-5 font-display text-[clamp(2.9rem,7vw,5.5rem)] font-bold leading-[0.98] theme-shift"
            style={{ color: dark ? 'var(--track-ink)' : '#4A2E3D' }}
          >
            {words.map((w, i) => (
              <span key={i} className="mr-[0.28em] inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.6 + i * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-md text-lg leading-relaxed theme-shift"
            style={{ color: dark ? 'rgba(255,255,255,0.78)' : 'rgba(74,46,61,0.72)' }}
          >
            {t('hero.subheadline')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              <Button
                asChild
                variant="track"
                size="lg"
                style={{ background: 'var(--track-primary)' }}
              >
                <a href="#enter-the-lab">{t('hero.cta')}</a>
              </Button>
            </MagneticButton>
            <span
              className="text-sm theme-shift"
              style={{ color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(74,46,61,0.55)' }}
            >
              {t('hero.orPreview')}
            </span>
          </motion.div>

          {/* Track selectors — the centerpiece interaction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <TrackToggle />
          </motion.div>
        </div>
      </div>

      {/* Credibility strip */}
      <div className="container-wise relative z-10 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="border-t pt-5 theme-shift"
          style={{ borderColor: dark ? 'rgba(255,255,255,0.14)' : 'rgba(74,46,61,0.14)' }}
        >
          <p
            className="max-w-2xl text-[13px] leading-relaxed theme-shift"
            style={{ color: dark ? 'rgba(255,255,255,0.62)' : 'rgba(74,46,61,0.6)' }}
          >
            {t('hero.credibilityLine')}
          </p>
          <div
            className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium theme-shift"
            style={{ color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(74,46,61,0.7)' }}
          >
            <span className="text-[11px] uppercase tracking-[0.14em] opacity-60">
              {t('hero.trustedBy')}
            </span>
            <span>Jazz World</span>
            <span className="opacity-40">·</span>
            <span>Mobilink Bank</span>
            <span className="opacity-40">·</span>
            <span>Change Mechanics</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
