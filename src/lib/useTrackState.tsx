import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Track = 'neutral' | 'founder' | 'enterprise'

interface TrackContextValue {
  track: Track
  /** Set an explicit track. */
  setTrack: (t: Track) => void
  /** Toggle helper: choosing the active track again returns to neutral. */
  selectTrack: (t: Exclude<Track, 'neutral'>) => void
  reset: () => void
}

const TrackContext = createContext<TrackContextValue | null>(null)

export function TrackProvider({ children }: { children: ReactNode }) {
  const [track, setTrack] = useState<Track>('neutral')

  // Propagate the active track to the document root so CSS custom
  // properties recolor the entire page — including Radix portals.
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-track', track)
    return () => {
      root.removeAttribute('data-track')
    }
  }, [track])

  const selectTrack = useCallback((t: Exclude<Track, 'neutral'>) => {
    setTrack((prev) => (prev === t ? 'neutral' : t))
  }, [])

  const reset = useCallback(() => setTrack('neutral'), [])

  const value = useMemo(
    () => ({ track, setTrack, selectTrack, reset }),
    [track, selectTrack, reset]
  )

  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
}

export function useTrack() {
  const ctx = useContext(TrackContext)
  if (!ctx) throw new Error('useTrack must be used within a TrackProvider')
  return ctx
}

/** Reactive prefers-reduced-motion hook. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}
