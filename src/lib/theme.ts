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
    figure: '#7fc2bd',
    figureHi: '#4fd1c5',
    field: '#2e7d7b',
    bgA: '#0b2320',
    bgB: '#154a47',
    accent: '#2e7d7b',
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
