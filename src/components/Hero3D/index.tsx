import { Component, lazy, Suspense, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { WiseMark } from '@/components/WiseLabLogo'

const HeroScene = lazy(() =>
  import('./HeroScene').then((m) => ({ default: m.HeroScene }))
)

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    )
  } catch {
    return false
  }
}

/** Simple, always-works 2D stand-in used when WebGL is missing or the scene errors. */
function Fallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        className="pointer-events-none absolute h-[46vh] w-[46vh] rounded-full blur-[90px]"
        style={{ background: 'var(--track-glow)', opacity: 0.6 }}
      />
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <WiseMark variant="color" className="h-[38vh] w-auto opacity-90" />
      </motion.div>
    </div>
  )
}

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) return <Fallback />
    return this.props.children
  }
}

export function Hero3D() {
  if (typeof window !== 'undefined' && !webglAvailable()) return <Fallback />
  return (
    <SceneBoundary>
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
    </SceneBoundary>
  )
}
