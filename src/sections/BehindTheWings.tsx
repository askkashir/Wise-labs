import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { WiseMark } from '@/components/WiseLabLogo'
import { LinkedinIcon } from '@/components/BrandIcons'

export function BehindTheWings() {
  const { t } = useTranslation()
  return (
    <section
      id="behind-the-wings"
      className="relative overflow-hidden bg-white py-28 md:py-36"
    >
      <div className="container-wise relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">{t('behindTheWings.eyebrow')}</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
              {t('behindTheWings.title1')}
              <br />
              {t('behindTheWings.title2')}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-pretty leading-relaxed text-plum/70">
              {t('behindTheWings.intro')}
            </p>
          </Reveal>
        </div>

        {/* Featured team card */}
        <Reveal delay={0.1}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="mt-14 grid overflow-hidden rounded-3xl border border-plum/10 shadow-card md:grid-cols-[minmax(0,340px)_1fr]"
          >
            {/* monogram panel */}
            <div
              className="relative flex min-h-[240px] items-center justify-center overflow-hidden p-10"
              style={{
                background:
                  'radial-gradient(120% 120% at 30% 20%, #4a2e3d 0%, #33212b 100%)',
              }}
            >
              <div className="pointer-events-none absolute inset-0 grain opacity-10" />
              <div className="pointer-events-none absolute -right-6 -top-6 opacity-20">
                <WiseMark variant="white" className="h-28 w-auto" />
              </div>
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-beige/20 bg-beige/5">
                <span className="font-display text-4xl font-bold tracking-tight text-beige">
                  MJD
                </span>
              </div>
            </div>

            {/* details */}
            <div className="flex flex-col justify-center bg-white p-8 md:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-plum">
                    {t('behindTheWings.director.name')}
                  </h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-teal">
                    {t('behindTheWings.director.title')}
                  </p>
                </div>
                <a
                  href="https://www.linkedin.com/in/muneaza-j-durrani-35a85810"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Muneaza Jamil Durrani on LinkedIn (opens in a new tab)"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-plum/15 text-plum transition-colors hover:border-teal hover:bg-teal hover:text-white"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              </div>
              <p className="mt-5 leading-relaxed text-plum/70">
                {t('behindTheWings.director.bio')}
              </p>
            </div>
          </motion.div>
        </Reveal>

        {/* Coming soon crew */}
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center gap-6 rounded-3xl border border-dashed border-plum/15 bg-beige/40 p-8 sm:flex-row sm:justify-between">
            <div className="flex -space-x-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-plum/10 to-teal/10"
                  style={{ opacity: 1 - i * 0.13 }}
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-plum/25" fill="currentColor">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
                  </svg>
                </div>
              ))}
            </div>
            <p className="max-w-md text-center text-[15px] text-plum/60 sm:text-right">
              {t('behindTheWings.moreComingSoon')}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
