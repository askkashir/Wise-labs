import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Rocket, Store, Compass, Network, X } from 'lucide-react'
import { usePrefersReducedMotion } from '@/lib/useTrackState'

const TRACKS = [
  { key: 'founder', href: '/apply/founder', color: '#2E7D7B', Icon: Rocket },
  { key: 'enterprise', href: '/apply/enterprise', color: '#E8823C', Icon: Store },
  { key: 'mentor', href: '/apply/mentor', color: '#2C7A70', Icon: Compass },
  { key: 'partner', href: '/apply/partner', color: '#E38470', Icon: Network },
] as const

/**
 * Persistent "Apply Now" launcher, fixed bottom-left on every page (mirrors
 * WhatsAppButton, fixed bottom-right). Reuses the enterTheLab.pillars.* i18n
 * keys so track names/CTAs stay in sync with the Enter the Lab section
 * without a second copy of the same strings to maintain.
 */
export function ApplyNowButton() {
  const { t } = useTranslation()
  const reduce = usePrefersReducedMotion()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-[min(88vw,320px)] overflow-hidden rounded-3xl border border-plum/10 bg-white p-2.5 shadow-card-hover"
          >
            <p className="px-3 pb-2 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-plum/45">
              {t('applyNow.chooseTrack')}
            </p>
            <div className="space-y-1">
              {TRACKS.map(({ key, href, color, Icon }) => (
                <Link
                  key={key}
                  to={href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-plum/[0.04]"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${color}14`, color }}
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-plum">
                      {t(`enterTheLab.pillars.${key}.title`)}
                    </span>
                    <span className="block truncate text-xs text-plum/55">
                      {t(`enterTheLab.pillars.${key}.cta`)}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-plum/25 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t('applyNow.close') : t('applyNow.cta')}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex h-14 items-center gap-2.5 rounded-full px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-6px_rgba(74,46,61,0.45)]"
        style={{ background: 'var(--track-primary, #4A2E3D)' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              className="flex"
            >
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span
              key="rocket"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              className="flex"
            >
              <Rocket className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
        {open ? t('applyNow.close') : t('applyNow.cta')}
      </motion.button>
    </div>
  )
}
