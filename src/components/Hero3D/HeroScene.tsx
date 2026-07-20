import { Suspense, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { FigureMesh } from './FigureMesh'
import { FigureMeshGLB } from './FigureMeshGLB'
import { ParticleField } from './ParticleField'

// Feature flag for the optional real rigged model. Leave null to ship the
// abstract particle figure (default). Point it at a GLB in /public to swap in
// a real "woman with a laptop" without touching the rest of the scene.
const FIGURE_GLB_URL: string | null = null

function useCounts() {
  return useMemo(() => {
    if (typeof window === 'undefined') return { figure: 2400, field: 460 }
    const w = window.innerWidth
    const cores = navigator.hardwareConcurrency || 4
    if (w < 640 || cores <= 4) return { figure: 1700, field: 260 }
    if (w < 1024) return { figure: 2600, field: 380 }
    return { figure: 3600, field: 520 }
  }, [])
}

export function HeroScene() {
  const counts = useCounts()

  // Some embedded/headless browsers don't fire the initial ResizeObserver
  // callback r3f relies on, leaving the canvas at its default 300x150.
  // Nudge a resize across a few frames after mount to force measurement.
  useEffect(() => {
    let n = 0
    let raf = 0
    const tick = () => {
      window.dispatchEvent(new Event('resize'))
      if (++n < 4) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0.1, 7], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ParticleField count={counts.field} />
        {FIGURE_GLB_URL ? (
          <FigureMeshGLB url={FIGURE_GLB_URL} />
        ) : (
          <FigureMesh count={counts.figure} />
        )}
      </Suspense>
    </Canvas>
  )
}
