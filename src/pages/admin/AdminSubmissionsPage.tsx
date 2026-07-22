import { useEffect, useState } from 'react'
import { listSubmissions, type StoredSubmission } from '@/lib/admin/submissions'

const TRACK_LABELS: Record<string, string> = {
  founder: 'Founder Flightpath',
  enterprise: 'Enterprise Flightpath',
  mentor: 'Guide Her Growth',
  partner: 'Open the Ecosystem',
}

export function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    listSubmissions().then((s) => {
      setSubmissions(s)
      setLoading(false)
    })
  }, [])

  const filtered = filter === 'all' ? submissions : submissions.filter((s) => s.track === filter)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-plum">Submissions</h1>
          <p className="mt-2 text-plum/60">All application submissions, newest first.</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 rounded-xl border border-plum/15 bg-white px-3 text-sm"
        >
          <option value="all">All tracks</option>
          {Object.entries(TRACK_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-8 text-plum/50">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-plum/10 bg-white p-6 text-plum/50">
          No submissions yet.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-2xl border border-plum/10 bg-white shadow-card">
              <button
                type="button"
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <div>
                  <p className="font-semibold text-plum">
                    {String(
                      s.values.primaryFounderName ??
                        s.values.primaryContactName ??
                        s.values.fullName ??
                        s.values.contactName ??
                        'Untitled applicant'
                    )}
                  </p>
                  <p className="mt-1 text-sm text-plum/50">
                    {TRACK_LABELS[s.track]} · {new Date(s.submittedAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-sm font-semibold text-teal">
                  {expanded === s.id ? 'Hide' : 'View'}
                </span>
              </button>
              {expanded === s.id && (
                <div className="border-t border-plum/10 p-5">
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(s.values).map(([key, val]) => (
                      <div key={key}>
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-plum/40">
                          {key}
                        </dt>
                        <dd className="mt-0.5 break-words text-sm text-plum/80">
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
