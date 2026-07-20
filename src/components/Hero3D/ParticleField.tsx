import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildFigureTargets } from '@/lib/figures/generate'
import { TRACK_THEME } from '@/lib/theme'
import { useTrack, usePrefersReducedMotion } from '@/lib/useTrackState'

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uIdle;
  varying float vTw;
  void main() {
    vec3 pos = position;
    float d = uIdle * 0.06;
    pos.x += sin(uTime * 0.3 + aSeed * 6.28) * d;
    pos.y += cos(uTime * 0.25 + aSeed * 6.28) * d;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vTw = 0.6 + 0.4 * sin(uTime * 1.2 + aSeed * 50.0);
    gl_PointSize = aSize * vTw * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vTw;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float dist = length(c);
    float a = smoothstep(0.5, 0.1, dist);
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a * uOpacity * vTw);
  }
`

const rand = (function () {
  let s = 0x2f6a1c
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
})()

export function ParticleField({ count }: { count: number }) {
  const { track } = useTrack()
  const reduce = usePrefersReducedMotion()

  const structureCount = Math.round(count * 0.42)

  // Ghost silhouettes for the neutral state (two faint drifting women).
  const ghost = useMemo(
    () => buildFigureTargets(structureCount),
    [structureCount]
  )

  const layouts = useMemo(() => {
    const neutral = new Float32Array(count * 3)
    const founder = new Float32Array(count * 3)
    const enterprise = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const seeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const isStruct = i < structureCount
      seeds[i] = rand()
      sizes[i] = isStruct ? 26 : 16
      const i3 = i * 3

      // ---- neutral ----
      if (isStruct) {
        // two ghost figures, left-back and right-back
        const g = ghost.neutral
        const gi = (i % ghost.count) * 3
        const side = i % 2 === 0 ? -1 : 1
        neutral[i3] = g[gi] * 0.6 + side * 2.7
        neutral[i3 + 1] = g[gi + 1] * 0.6 - 0.2
        neutral[i3 + 2] = g[gi + 2] - 1.6 - rand() * 0.6
      } else {
        // ambient motes in a soft field
        neutral[i3] = (rand() * 2 - 1) * 4.2
        neutral[i3 + 1] = (rand() * 2 - 1) * 3.0 + 0.2
        neutral[i3 + 2] = -0.6 - rand() * 2.4
      }

      // ---- founder: network node cloud behind figure ----
      if (isStruct) {
        // loose grid on a back plane
        const gx = (i % 7) / 6 - 0.5
        const gy = (Math.floor(i / 7) % 7) / 6 - 0.5
        founder[i3] = gx * 6.2 + (rand() * 2 - 1) * 0.25
        founder[i3 + 1] = gy * 5.0 + 0.3 + (rand() * 2 - 1) * 0.25
        founder[i3 + 2] = -1.8 - rand() * 1.2
      } else {
        founder[i3] = (rand() * 2 - 1) * 4.6
        founder[i3 + 1] = (rand() * 2 - 1) * 3.2 + 0.2
        founder[i3 + 2] = -1.0 - rand() * 2.6
      }

      // ---- enterprise: star burst / rising field ----
      {
        const up = rand()
        enterprise[i3] = (rand() * 2 - 1) * 4.4
        enterprise[i3 + 1] = -2 + up * 5.4 + (rand() * 2 - 1) * 0.3
        enterprise[i3 + 2] = -0.8 - rand() * 2.6
      }
    }

    // founder network lines: connect nearby structure nodes
    const linePairs: number[] = []
    const maxLines = 90
    for (let i = 0; i < structureCount && linePairs.length / 6 < maxLines; i++) {
      for (let j = i + 1; j < structureCount; j++) {
        const dx = founder[i * 3] - founder[j * 3]
        const dy = founder[i * 3 + 1] - founder[j * 3 + 1]
        const dz = founder[i * 3 + 2] - founder[j * 3 + 2]
        const dist = Math.hypot(dx, dy, dz)
        if (dist < 1.3) {
          linePairs.push(
            founder[i * 3],
            founder[i * 3 + 1],
            founder[i * 3 + 2],
            founder[j * 3],
            founder[j * 3 + 1],
            founder[j * 3 + 2]
          )
          if (linePairs.length / 6 >= maxLines) break
        }
      }
    }

    return {
      neutral,
      founder,
      enterprise,
      sizes,
      seeds,
      lines: new Float32Array(linePairs),
    }
  }, [count, structureCount, ghost])

  const current = useMemo(() => new Float32Array(layouts.neutral), [layouts])
  const geomRef = useRef<THREE.BufferGeometry>(null!)
  const lineRef = useRef<THREE.LineBasicMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color(TRACK_THEME.neutral.field) },
      uIdle: { value: reduce ? 0 : 1 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const col = useMemo(() => new THREE.Color(), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30)
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uIdle.value = reduce ? 0 : 1

    const target =
      track === 'founder'
        ? layouts.founder
        : track === 'enterprise'
          ? layouts.enterprise
          : layouts.neutral

    const th = TRACK_THEME[track]
    col.set(th.field)
    const targetOpacity = track === 'neutral' ? 0.5 : 0.62

    if (reduce) {
      current.set(target)
    } else {
      for (let i = 0; i < current.length; i++) {
        const f = 1 - Math.exp(-2.2 * dt)
        current[i] += (target[i] - current[i]) * f
      }
    }
    const posAttr = geomRef.current.getAttribute(
      'position'
    ) as THREE.BufferAttribute
    ;(posAttr.array as Float32Array).set(current)
    posAttr.needsUpdate = true

    uniforms.uColor.value.lerp(col, 1 - Math.exp(-3 * dt))
    uniforms.uOpacity.value = THREE.MathUtils.damp(
      uniforms.uOpacity.value,
      targetOpacity,
      2.5,
      dt
    )

    if (lineRef.current) {
      const lt = track === 'founder' ? 0.22 : 0
      lineRef.current.opacity = THREE.MathUtils.damp(
        lineRef.current.opacity,
        lt,
        3,
        dt
      )
      lineRef.current.color.copy(uniforms.uColor.value)
    }
  })

  return (
    <group>
      <points>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(current), 3]}
          />
          <bufferAttribute attach="attributes-aSize" args={[layouts.sizes, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[layouts.seeds, 1]} />
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

      {layouts.lines.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[layouts.lines, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            ref={lineRef}
            transparent
            opacity={0}
            color={TRACK_THEME.founder.field}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  )
}
