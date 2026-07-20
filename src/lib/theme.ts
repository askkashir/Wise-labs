import type { Track } from './useTrackState'

export interface TrackTheme {
  /** primary particle color for the figure */
  figure: string
  /** secondary / highlight particle color */
  figureHi: string
  /** background field particle color */
  field: string
  /** two-stop atmosphere for the hero backdrop */
  bgA: string
  bgB: string
  /** brand accent (CSS-facing) */
  accent: string
  label: string
}

export const TRACK_THEME: Record<Track, TrackTheme> = {
  neutral: {
    figure: '#4a2e3d', // plum
    figureHi: '#e38470', // coral
    field: '#2c7a70', // teal
    bgA: '#f1e4d6',
    bgB: '#e6d4c0',
    accent: '#2c7a70',
    label: 'Potential, not yet defined',
  },
  founder: {
    figure: '#9cc4ff',
    figureHi: '#22d3ee',
    field: '#3b82f6',
    bgA: '#0b1b38',
    bgB: '#123a6b',
    accent: '#3b82f6',
    label: 'Founder Flightpath',
  },
  enterprise: {
    figure: '#ffd9a8',
    figureHi: '#f5a623',
    field: '#e8823c',
    bgA: '#2c1707',
    bgB: '#7a3f12',
    accent: '#e8823c',
    label: 'Enterprise Flightpath',
  },
}
