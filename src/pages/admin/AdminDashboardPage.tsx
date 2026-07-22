import { useEffect, useState } from 'react'
import { listSubmissions, aggregateByDimension, type StoredSubmission } from '@/lib/admin/submissions'

const TRACK_LABELS: Record<string, string> = {
  founder: 'Founder Flightpath',
  enterprise: 'Enterprise Flightpath',
  mentor: 'Guide Her Growth',
  partner: 'Open the Ecosystem',
}

export function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listSubmissions().then((s) => {
      setSubmissions(s)
      setLoading(false)
    })
  }, [])

  const byTrack = aggregateByDimension(
    submissions.map((s) => ({ ...s, analytics: { ...s.analytics, track: s.track } })),
    'track'
  )
  const byVertical = aggregateByDimension(submissions, 'vertical')

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-plum">Dashboard</h1>
      <p className="mt-2 text-plum/60">Overview of applications across all tracks.</p>

      {loading ? (
        <p className="mt-8 text-plum/50">Loading…</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total applications" value={submissions.length} />
            {Object.entries(TRACK_LABELS).map(([key, label]) => (
              <StatCard key={key} label={label} value={byTrack[key] ?? 0} />
            ))}
          </div>

          {Object.keys(byVertical).length > 0 && (
            <div className="mt-10 rounded-3xl border border-plum/10 bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-plum">
                Founder applications by vertical
              </h2>
              <div className="mt-4 space-y-2">
                {Object.entries(byVertical).map(([vertical, count]) => (
                  <div key={vertical} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 text-sm text-plum/70">{vertical}</span>
                    <div className="h-2 flex-1 rounded-full bg-plum/5">
                      <div
                        className="h-2 rounded-full bg-teal"
                        style={{
                          width: `${(count / submissions.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right text-sm font-semibold text-plum">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-plum/10 bg-white p-5 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-plum/45">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold text-plum">{value}</p>
    </div>
  )
}
