import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildFigureTargets } from '@/lib/figures/generate'
import { TRACK_THEME } from '@/lib/theme'
import { useTrack, usePrefersReducedMotion } from '@/lib/useTrackState'

const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uSizeScale;
  uniform float uIdle;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec3 pos = position;
    // ambient per-particle drift (GPU-side, cheap)
    float d = uIdle * 0.028;
    pos.x += sin(uTime * 0.5 + aSeed * 6.2831) * d;
    pos.y += cos(uTime * 0.42 + aSeed * 6.2831) * d;
    pos.z += sin(uTime * 0.6 + aSeed * 3.14) * d * 0.6;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float tw = 0.82 + 0.22 * sin(uTime * 1.6 + aSeed * 40.0);
    gl_PointSize = aSize * uSizeScale * tw * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.12, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * uOpacity);
  }
`

export function FigureMesh({ count }: { count: number }) {
  const { track } = useTrack()
  const reduce = usePrefersReducedMotion()
  const { viewport } = useThree()

  const data = useMemo(() => buildFigureTargets(count), [count])

  // mutable current state
  const current = useMemo(() => {
    const a = new Float32Array(data.neutral) // start at neutral
    return a
  }, [data])

  const colorCurrent = useMemo(() => new Float32Array(count * 3), [count])
  const geomRef = useRef<THREE.BufferGeometry>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  // per-particle base size (accessory particles a touch larger to pop as stars/laptop)
  const sizes = useMemo(() => {
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) s[i] = data.roles[i] === 1 ? 68 : 54
    return s
  }, [count, data])

  // initialise colors to neutral palette
  const initialColors = useMemo(() => {
    const th = TRACK_THEME.neutral
    const cBody = new THREE.Color(th.figure)
    const cAcc = new THREE.Color(th.figureHi)
    for (let i = 0; i < count; i++) {
      const c = data.roles[i] === 1 ? cAcc : cBody
      colorCurrent[i * 3] = c.r
      colorCurrent[i * 3 + 1] = c.g
      colorCurrent[i * 3 + 2] = c.b
    }
    return colorCurrent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, data])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSizeScale: { value: 1 },
      uOpacity: { value: 0 }, // fade in
      uIdle: { value: reduce ? 0 : 1 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const targetColor = useMemo(() => new THREE.Color(), [])
  const bodyColor = useMemo(() => new THREE.Color(), [])
  const accColor = useMemo(() => new THREE.Color(), [])
  const pointer = useMemo(() => new THREE.Vector2(), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30)
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uIdle.value = reduce ? 0 : 1

    // fade in
    uniforms.uOpacity.value = THREE.MathUtils.damp(
      uniforms.uOpacity.value,
      1,
      3,
      dt
    )

    const target =
      track === 'founder'
        ? data.founder
        : track === 'enterprise'
          ? data.enterprise
          : data.neutral

    const th = TRACK_THEME[track]
    bodyColor.set(th.figure)
    accColor.set(th.figureHi)

    const posAttr = geomRef.current.getAttribute(
      'position'
    ) as THREE.BufferAttribute
    const colAttr = geomRef.current.getAttribute(
      'aColor'
    ) as THREE.BufferAttribute

    if (reduce) {
      // snap — respect reduced motion
      current.set(target)
      for (let i = 0; i < count; i++) {
        const c = data.roles[i] === 1 ? accColor : bodyColor
        colorCurrent[i * 3] = c.r
        colorCurrent[i * 3 + 1] = c.g
        colorCurrent[i * 3 + 2] = c.b
      }
    } else {
      for (let i = 0; i < count; i++) {
        const seed = data.seeds[i]
        // organic ease: slightly different rate per particle
        const k = 2.4 + seed * 2.2
        const f = 1 - Math.exp(-k * dt)
        const i3 = i * 3
        current[i3] += (target[i3] - current[i3]) * f
        current[i3 + 1] += (target[i3 + 1] - current[i3 + 1]) * f
        current[i3 + 2] += (target[i3 + 2] - current[i3 + 2]) * f

        targetColor.copy(data.roles[i] === 1 ? accColor : bodyColor)
        const cf = 1 - Math.exp(-3 * dt)
        colorCurrent[i3] += (targetColor.r - colorCurrent[i3]) * cf
        colorCurrent[i3 + 1] += (targetColor.g - colorCurrent[i3 + 1]) * cf
        colorCurrent[i3 + 2] += (targetColor.b - colorCurrent[i3 + 2]) * cf
      }
    }

    ;(posAttr.array as Float32Array).set(current)
    posAttr.needsUpdate = true
    ;(colAttr.array as Float32Array).set(colorCurrent)
    colAttr.needsUpdate = true

    // gentle cursor parallax + idle sway
    if (groupRef.current) {
      const px = reduce ? 0 : state.pointer.x
      const py = reduce ? 0 : state.pointer.y
      pointer.set(px, py)
      const targetRotY = pointer.x * 0.32 + (reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.15) * 0.06)
      const targetRotX = -pointer.y * 0.16
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        4,
        dt
      )
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        4,
        dt
      )
      const breathe = reduce ? 1 : 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.014
      groupRef.current.scale.setScalar(breathe)
    }
  })

  // scale the whole figure to fit the available viewport height nicely
  const fit = Math.min(1, viewport.height / 6.4)

  return (
    <group ref={groupRef} scale={fit}>
      <points>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(current), 3]}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[new Float32Array(initialColors), 3]}
          />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  )
}
