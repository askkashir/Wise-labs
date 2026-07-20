import { motion, type Variants } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/useTrackState'
import { cn } from '@/lib/utils'

type Variant = 'color' | 'white' | 'black'

interface Palette {
  wings: string
  leaves: string
  flame: string
  wise: string
  lab: string
  tagline: string
}

const PALETTES: Record<Variant, Palette> = {
  color: {
    wings: '#4A2E3D',
    leaves: '#2C7A70',
    flame: '#E38470',
    wise: '#4A2E3D',
    lab: '#E38470',
    tagline: '#4A2E3D',
  },
  white: {
    wings: '#FFFFFF',
    leaves: '#FFFFFF',
    flame: '#FFFFFF',
    wise: '#FFFFFF',
    lab: 'rgba(255,255,255,0.82)',
    tagline: 'rgba(255,255,255,0.7)',
  },
  black: {
    wings: '#1A1216',
    leaves: '#1A1216',
    flame: '#1A1216',
    wise: '#1A1216',
    lab: '#1A1216',
    tagline: 'rgba(26,18,22,0.7)',
  },
}

/* ---- Shared butterfly mark paths (symmetric about x=100) ---- */

// Upper wing (plum) — left; right is mirrored via scale(-1,1)
const WING =
  'M99,111 C84,86 57,88 41,71 C25,54 29,29 40,13 C54,35 76,45 89,65 C98,79 99,97 99,111 Z'

// Lower leaf (teal) — left; right mirrored
const LEAF =
  'M97,108 C77,111 58,117 51,133 C66,121 84,115 98,111 Z'

// Central coral flame — main plume with a forked base notch
const FLAME_MAIN =
  'M100,112 C95,94 89,82 98,60 C103,46 95,35 101,19 C103,12 101,6 100,2 C98,8 96,15 97,25 C99,41 90,51 95,72 C98,89 95,100 100,112 Z'
const FLAME_WISP =
  'M104,110 C109,98 107,86 114,73 C111,89 113,100 106,110 Z'

interface MarkProps {
  variant?: Variant
  animateIntro?: boolean
  className?: string
}

/** Just the butterfly mark (used in the nav next to an HTML wordmark). */
export function WiseMark({
  variant = 'color',
  animateIntro = false,
  className,
}: MarkProps) {
  const p = PALETTES[variant]
  const reduce = usePrefersReducedMotion()
  const animate = animateIntro && !reduce

  const group: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
  }
  const wingsV: Variants = {
    hidden: { opacity: 0, scale: 0.72, y: 6 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }
  const leavesV: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }
  const flameV: Variants = {
    hidden: { opacity: 0, scaleY: 0.25, y: 12 },
    show: { opacity: 1, scaleY: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }

  const originBottom = {
    transformBox: 'fill-box' as const,
    transformOrigin: 'center bottom',
  }

  return (
    <svg
      viewBox="0 0 200 140"
      className={className}
      role="img"
      aria-label="WISE Lab butterfly mark"
      fill="none"
    >
      <title>WISE Lab</title>
      <motion.g
        variants={animate ? group : undefined}
        initial={animate ? 'hidden' : false}
        animate={animate ? 'show' : undefined}
      >
        {/* Plum wings */}
        <motion.g variants={animate ? wingsV : undefined} style={originBottom}>
          <path d={WING} fill={p.wings} />
          <path d={WING} fill={p.wings} transform="translate(200,0) scale(-1,1)" />
        </motion.g>
        {/* Teal leaves */}
        <motion.g variants={animate ? leavesV : undefined} style={originBottom}>
          <path d={LEAF} fill={p.leaves} />
          <path d={LEAF} fill={p.leaves} transform="translate(200,0) scale(-1,1)" />
        </motion.g>
        {/* Coral flame */}
        <motion.g variants={animate ? flameV : undefined} style={originBottom}>
          <path d={FLAME_MAIN} fill={p.flame} />
          <path d={FLAME_WISP} fill={p.flame} opacity={0.9} />
          <path
            d={FLAME_WISP}
            fill={p.flame}
            opacity={0.9}
            transform="translate(200,0) scale(-1,1)"
          />
        </motion.g>
      </motion.g>
    </svg>
  )
}

interface LogoProps {
  variant?: Variant
  animateIntro?: boolean
  showTagline?: boolean
  /** height of the butterfly mark in px; text scales from it */
  size?: number
  className?: string
}

/** Full stacked lockup: mark + WISE Lab wordmark + tagline. */
export function WiseLabLogo({
  variant = 'color',
  animateIntro = false,
  showTagline = true,
  size = 92,
  className,
}: LogoProps) {
  const p = PALETTES[variant]
  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <WiseMark
        variant={variant}
        animateIntro={animateIntro}
        className="w-auto"
        // svg aspect 200x140 -> width = height * 200/140
        // set via style so it scales crisply
      />
      <style>{''}</style>
      <div className="flex flex-col items-center leading-none" style={{ marginTop: size * 0.06 }}>
        <div
          className="font-sans font-bold tracking-tight"
          style={{ fontSize: size * 0.44, lineHeight: 1 }}
        >
          <span style={{ color: p.wise }}>WISE</span>{' '}
          <span style={{ color: p.lab }}>Lab</span>
        </div>
        {showTagline && (
          <div
            className="font-sans font-semibold uppercase"
            style={{
              color: p.tagline,
              letterSpacing: '0.3em',
              fontSize: Math.max(size * 0.11, 8),
              marginTop: size * 0.09,
              marginRight: '-0.3em',
            }}
          >
            Her Idea . Her Enterprise
          </div>
        )}
      </div>
    </div>
  )
}

export default WiseLabLogo
