import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { WiseMark } from './WiseLabLogo'
import { Button } from './ui/button'
import { MagneticButton } from './MagneticButton'
import { LanguageSwitcher } from './LanguageSwitcher'
import { PM_BANNER_HEIGHT } from './PMBanner'
import { NAV_LINKS } from '@/lib/nav'
import { useTrack } from '@/lib/useTrackState'
import { cn } from '@/lib/utils'

export function Nav() {
  const { t } = useTranslation()
  const { track } = useTrack()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string>('hero')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = ['hero', ...NAV_LINKS.map((l) => l.id)]
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // over hero with a track active -> dark backdrop -> white logo/links
  const overDarkHero = !scrolled && active === 'hero' && track !== 'neutral'
  const lightText = overDarkHero
  const logoVariant = lightText ? 'white' : 'color'

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ top: PM_BANNER_HEIGHT }}
        className={cn(
          'fixed inset-x-0 z-50 transition-colors duration-500',
          scrolled
            ? 'border-b border-plum/10 bg-beige/80 backdrop-blur-xl'
            : 'border-b border-transparent'
        )}
      >
        <nav className="container-wise flex h-[68px] items-center justify-between gap-6">
          <a
            href="#hero"
            aria-label={t('nav.home')}
            className="flex items-center gap-2.5"
          >
            <WiseMark variant={logoVariant} className="h-9 w-auto" />
            <span className="flex flex-col leading-none">
              <span
                className={cn(
                  'font-sans text-lg font-bold tracking-tight transition-colors',
                  lightText ? 'text-white' : 'text-plum'
                )}
              >
                WISE{' '}
                <span className={lightText ? 'text-white/80' : 'text-coral'}>
                  Lab
                </span>
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-active={active === l.id}
                className={cn(
                  'link-underline text-[13px] font-medium transition-colors',
                  lightText
                    ? 'text-white/85 hover:text-white'
                    : 'text-plum/75 hover:text-plum',
                  active === l.id && (lightText ? 'text-white' : 'text-plum')
                )}
              >
                {t(`nav.links.${l.id}`, l.label)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher light={lightText} className="hidden sm:inline-flex" />
            <MagneticButton className="hidden sm:inline-flex" strength={0.4}>
              <Button
                asChild
                size="sm"
                className="h-10 px-5"
                style={{ background: 'var(--track-primary)', color: 'var(--track-ink)' }}
              >
                <a href="#enter-the-lab">{t('nav.cta')}</a>
              </Button>
            </MagneticButton>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t('nav.openMenu')}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden',
                lightText ? 'text-white hover:bg-white/10' : 'text-plum hover:bg-plum/10'
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-plum/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-beige p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <WiseMark variant="color" className="h-9 w-auto" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={t('nav.closeMenu')}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-plum hover:bg-plum/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-10 flex flex-col gap-1">
                {NAV_LINKS.map((l, i) => (
                  <motion.a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="border-b border-plum/10 py-3.5 font-display text-xl font-medium text-plum"
                  >
                    {t(`nav.links.${l.id}`, l.label)}
                  </motion.a>
                ))}
              </div>
              <div className="mt-6">
                <LanguageSwitcher />
              </div>
              <a
                href="#enter-the-lab"
                onClick={() => setMenuOpen(false)}
                className="mt-4 flex h-12 items-center justify-center rounded-full text-sm font-semibold"
                style={{ background: 'var(--track-primary)', color: 'var(--track-ink)' }}
              >
                {t('nav.cta')}
              </a>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
