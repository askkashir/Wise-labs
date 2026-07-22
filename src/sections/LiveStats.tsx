import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { fetchLiveStats, getNextCycleDeadline, type LiveStats } from '@/lib/stats'

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState(() => Math.max(0, target.getTime() - Date.now()))

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, target.getTime() - Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [target])

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((remaining / (1000 * 60)) % 60)
  const seconds = Math.floor((remaining / 1000) % 60)
  return { days, hours, minutes, seconds }
}

/**
 * Live stats + countdown section. Gated behind VITE_FEATURE_LIVE_STATS
 * (default off) since there's no real data source yet — see
 * TODO_FOR_HUMAN.md item 10. Not mounted in App.tsx by default; flip the
 * flag and add <LiveStats /> to the landing page once real numbers exist.
 */
export function LiveStats() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<LiveStats | null>(null)
  const deadline = getNextCycleDeadline()
  const countdown = useCountdown(deadline)

  useEffect(() => {
    fetchLiveStats().then(setStats)
  }, [])

  if (import.meta.env.VITE_FEATURE_LIVE_STATS !== 'true') return null

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="container-wise relative">
        <Reveal>
          <p className="eyebrow">{t('liveStats.eyebrow')}</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3rem)] font-bold text-plum">
            {t('liveStats.title')}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-3" stagger={0.08}>
          <RevealItem>
            <StatCard label={t('liveStats.applications')} value={stats?.applications ?? 0} />
          </RevealItem>
          <RevealItem>
            <StatCard label={t('liveStats.cities')} value={stats?.cities ?? 0} />
          </RevealItem>
          <RevealItem>
            <StatCard label={t('liveStats.mentors')} value={stats?.mentors ?? 0} />
          </RevealItem>
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl border border-plum/10 bg-beige/40 p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-plum/50">
              {t('liveStats.countdownLabel')}
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 font-display text-3xl font-bold text-plum">
              <TimeUnit value={countdown.days} label={t('liveStats.days')} />
              <TimeUnit value={countdown.hours} label={t('liveStats.hours')} />
              <TimeUnit value={countdown.minutes} label={t('liveStats.minutes')} />
              <TimeUnit value={countdown.seconds} label={t('liveStats.seconds')} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-plum/10 bg-white p-8 text-center shadow-card">
      <p className="font-display text-4xl font-bold text-teal">{value}</p>
      <p className="mt-2 text-sm font-medium text-plum/60">{label}</p>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span>{String(value).padStart(2, '0')}</span>
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-plum/45">
        {label}
      </span>
    </div>
  )
}
