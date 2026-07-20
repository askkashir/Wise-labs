import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

/**
 * OPTIONAL real-model path.
 *
 * The default, shippable hero uses the abstract particle figure (`FigureMesh`).
 * If the client later supplies a rigged GLB of "a woman with a laptop", drop the
 * file in `/public`, set `FIGURE_GLB_URL` in `HeroScene.tsx`, and this component
 * renders it in place — no other scene changes required. It is never mounted
 * while the flag is null, so it adds no cost to the default build.
 */
export function FigureMeshGLB({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const { viewport } = useThree()
  const fit = useMemo(() => Math.min(1, viewport.height / 6.4), [viewport.height])
  return <primitive object={scene} scale={fit} />
}
