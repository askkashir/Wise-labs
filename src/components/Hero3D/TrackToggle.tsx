import { motion } from 'framer-motion'
import { useTrack, type Track } from '@/lib/useTrackState'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Rocket, Sprout } from 'lucide-react'

interface Option {
  id: Exclude<Track, 'neutral'>
  index: string
  kicker: string
  title: string
  sub: string
  primary: string
  soft: string
  ink: string
  Icon: typeof Rocket
}

const OPTIONS: Option[] = [
  {
    id: 'founder',
    index: '01',
    kicker: 'Startup Incubation',
    title: 'Founder Flightpath',
    sub: 'Scalable, tech-enabled ventures',
    primary: '#2f6bd4',
    soft: 'rgba(59,130,246,0.12)',
    ink: '#0c1b38',
    Icon: Rocket,
  },
  {
    id: 'enterprise',
    index: '02',
    kicker: 'MSME Training',
    title: 'Enterprise Flightpath',
    sub: 'Small & home-based businesses',
    primary: '#d1701f',
    soft: 'rgba(232,130,60,0.14)',
    ink: '#5a2e0c',
    Icon: Sprout,
  },
]

export function TrackToggle({ className }: { className?: string }) {
  const { track, selectTrack } = useTrack()

  return (
    <div
      className={cn('flex w-full flex-col gap-3 sm:flex-row', className)}
      role="group"
      aria-label="Choose a flight path to preview"
    >
      {OPTIONS.map((opt) => {
        const active = track === opt.id
        return (
          <motion.button
            key={opt.id}
            type="button"
            onClick={() => selectTrack(opt.id)}
            aria-pressed={active}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            className={cn(
              'group relative flex-1 overflow-hidden rounded-2xl border px-5 py-4 text-left transition-colors duration-500',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
            )}
            style={{
              borderColor: active ? opt.primary : 'rgba(74,46,61,0.16)',
              background: active ? opt.soft : 'rgba(255,255,255,0.55)',
              boxShadow: active
                ? `0 18px 44px -18px ${opt.primary}`
                : '0 8px 24px -18px rgba(74,46,61,0.4)',
            }}
          >
            {/* active accent bar */}
            <span
              className="absolute left-0 top-0 h-full w-[3px] origin-top transition-transform duration-500"
              style={{
                background: opt.primary,
                transform: active ? 'scaleY(1)' : 'scaleY(0)',
              }}
            />
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-500"
                style={{
                  background: active ? opt.primary : 'rgba(74,46,61,0.06)',
                  color: active ? '#fff' : opt.ink,
                }}
              >
                <opt.Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[11px] font-semibold tracking-widest"
                    style={{ color: opt.primary }}
                  >
                    {opt.index}
                  </span>
                  <span className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-plum/50">
                    {opt.kicker}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className="font-display text-lg font-semibold leading-tight"
                    style={{ color: active ? opt.ink : '#4A2E3D' }}
                  >
                    {opt.title}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: opt.primary, opacity: active ? 1 : 0.5 }}
                  />
                </div>
                <p className="mt-0.5 truncate text-[13px] text-plum/55">
                  {opt.sub}
                </p>
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
