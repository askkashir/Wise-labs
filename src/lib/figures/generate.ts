/**
 * Procedural point-set generator for the morphing particle figure.
 *
 * Three posed silhouettes are sampled into point clouds of identical length so
 * a single particle system can lerp between them:
 *   - neutral    : a loose, cocooned standing figure ("potential, not defined")
 *   - founder    : a woman working at a laptop (one arm forward, seated-upright)
 *   - enterprise : a confident woman, one arm raised, small stars rising around
 *
 * Body particles exist in every state (the figure re-poses); accessory
 * particles form the laptop / stars and fold back into the body in neutral.
 */

// deterministic PRNG so the cloud is stable across renders
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Prim =
  | { kind: 'disc'; x: number; y: number; r: number; area: number }
  | {
      kind: 'capsule'
      ax: number
      ay: number
      bx: number
      by: number
      r: number
      area: number
    }
  | { kind: 'quad'; p: [number, number][]; area: number }

const disc = (x: number, y: number, r: number): Prim => ({
  kind: 'disc',
  x,
  y,
  r,
  area: Math.PI * r * r,
})

const cap = (
  ax: number,
  ay: number,
  bx: number,
  by: number,
  r: number
): Prim => {
  const len = Math.hypot(bx - ax, by - ay)
  return { kind: 'capsule', ax, ay, bx, by, r, area: 2 * r * len + Math.PI * r * r }
}

const quad = (p: [number, number][]): Prim => {
  // shoelace area
  let a = 0
  for (let i = 0; i < p.length; i++) {
    const j = (i + 1) % p.length
    a += p[i][0] * p[j][1] - p[j][0] * p[i][1]
  }
  return { kind: 'quad', p, area: Math.abs(a) / 2 }
}

function samplePrim(pr: Prim, rnd: () => number): [number, number] {
  if (pr.kind === 'disc') {
    const ang = rnd() * Math.PI * 2
    const rad = pr.r * Math.sqrt(rnd())
    return [pr.x + Math.cos(ang) * rad, pr.y + Math.sin(ang) * rad]
  }
  if (pr.kind === 'capsule') {
    const t = rnd()
    const cx = pr.ax + (pr.bx - pr.ax) * t
    const cy = pr.ay + (pr.by - pr.ay) * t
    // perpendicular unit
    let dx = pr.bx - pr.ax
    let dy = pr.by - pr.ay
    const l = Math.hypot(dx, dy) || 1
    dx /= l
    dy /= l
    const off = (rnd() * 2 - 1) * pr.r
    return [cx - dy * off, cy + dx * off]
  }
  // quad: split into two triangles by fan, sample uniformly
  const p = pr.p
  const tri = rnd() < 0.5 ? [p[0], p[1], p[2]] : [p[0], p[2], p[3]]
  let u = rnd()
  let v = rnd()
  if (u + v > 1) {
    u = 1 - u
    v = 1 - v
  }
  const x = tri[0][0] + u * (tri[1][0] - tri[0][0]) + v * (tri[2][0] - tri[0][0])
  const y = tri[0][1] + u * (tri[1][1] - tri[0][1]) + v * (tri[2][1] - tri[0][1])
  return [x, y]
}

function sampleSilhouette(
  prims: Prim[],
  count: number,
  rnd: () => number
): Array<[number, number]> {
  const total = prims.reduce((s, p) => s + p.area, 0)
  const out: Array<[number, number]> = []
  for (let i = 0; i < count; i++) {
    let r = rnd() * total
    let chosen = prims[0]
    for (const p of prims) {
      if (r < p.area) {
        chosen = p
        break
      }
      r -= p.area
    }
    out.push(samplePrim(chosen, rnd))
  }
  return out
}

// ---- The three poses (normalized: x ~ [-0.6,0.6], y up [0,1.9]) ----

const NEUTRAL: Prim[] = [
  disc(0, 1.62, 0.17), // head
  cap(0, 1.4, 0.02, 0.92, 0.19), // torso, softly curved
  cap(-0.14, 1.34, -0.2, 0.98, 0.07), // left arm wrapped
  cap(0.14, 1.34, 0.2, 0.98, 0.07), // right arm wrapped
  // cocoon-like flowing lower body (teardrop)
  cap(0.02, 0.94, -0.02, 0.5, 0.22),
  disc(0, 0.34, 0.28),
  disc(0, 0.16, 0.2),
]

const FOUNDER: Prim[] = [
  disc(-0.16, 1.6, 0.16), // head
  cap(-0.14, 1.4, -0.08, 0.92, 0.18), // upright torso
  cap(-0.08, 0.92, 0.24, 0.84, 0.15), // upper legs (seated)
  cap(0.24, 0.84, 0.3, 0.36, 0.12), // lower legs down
  cap(-0.1, 1.22, 0.34, 0.98, 0.08), // arm reaching forward to laptop
  cap(-0.16, 1.3, -0.3, 1.06, 0.07), // back arm
]

const ENTERPRISE: Prim[] = [
  disc(0.02, 1.62, 0.16), // head
  cap(0.02, 1.42, 0.06, 0.9, 0.18), // torso
  cap(0.1, 1.34, 0.42, 1.86, 0.08), // raised arm
  disc(0.44, 1.9, 0.07), // raised hand
  cap(-0.06, 1.3, -0.26, 1.02, 0.08), // hand-on-hip arm
  cap(0.0, 0.9, -0.1, 0.06, 0.13), // left leg
  cap(0.08, 0.9, 0.16, 0.06, 0.13), // right leg
]

// laptop slab for founder accessory (a tilted screen + base near the reaching hand)
const LAPTOP: Prim[] = [
  quad([
    [0.36, 0.86],
    [0.66, 0.92],
    [0.64, 1.24],
    [0.34, 1.18],
  ]), // screen
  quad([
    [0.34, 0.84],
    [0.66, 0.9],
    [0.72, 0.82],
    [0.4, 0.76],
  ]), // base
]

export interface FigureTargets {
  count: number
  bodyCount: number
  neutral: Float32Array
  founder: Float32Array
  enterprise: Float32Array
  roles: Uint8Array // 0 = body, 1 = accessory
  seeds: Float32Array // per-particle 0..1 for stagger / twinkle
}

const S = 2.35 // world scale
const Y0 = 0.86 // vertical centering

function toWorld(
  pts: Array<[number, number]>,
  rnd: () => number,
  zSpread = 0.32
): Float32Array {
  const arr = new Float32Array(pts.length * 3)
  for (let i = 0; i < pts.length; i++) {
    arr[i * 3] = pts[i][0] * S
    arr[i * 3 + 1] = (pts[i][1] - Y0) * S
    arr[i * 3 + 2] = (rnd() * 2 - 1) * zSpread
  }
  return arr
}

export function buildFigureTargets(
  count: number,
  accessoryRatio = 0.24
): FigureTargets {
  const rnd = mulberry32(0x1a2b3c)
  const accessoryCount = Math.round(count * accessoryRatio)
  const bodyCount = count - accessoryCount

  // body samples per pose
  const nBody = sampleSilhouette(NEUTRAL, bodyCount, rnd)
  const fBody = sampleSilhouette(FOUNDER, bodyCount, rnd)
  const eBody = sampleSilhouette(ENTERPRISE, bodyCount, rnd)

  // accessory samples
  const nAcc = sampleSilhouette(NEUTRAL, accessoryCount, rnd) // fold into body
  const fAcc = sampleSilhouette(LAPTOP, accessoryCount, rnd) // laptop
  // enterprise stars: rising arc of small clusters to the upper-right
  const eAcc: Array<[number, number]> = []
  for (let i = 0; i < accessoryCount; i++) {
    const t = rnd()
    const arcX = -0.1 + t * 0.85
    const arcY = 0.9 + t * 1.05 + Math.sin(t * Math.PI) * 0.15
    eAcc.push([arcX + (rnd() * 2 - 1) * 0.12, arcY + (rnd() * 2 - 1) * 0.12])
  }

  const neutral = toWorld([...nBody, ...nAcc], mulberry32(0x55))
  const founder = toWorld([...fBody, ...fAcc], mulberry32(0x66))
  const enterprise = toWorld([...eBody, ...eAcc], mulberry32(0x77))

  const roles = new Uint8Array(count)
  const seeds = new Float32Array(count)
  const sr = mulberry32(0x99)
  for (let i = 0; i < count; i++) {
    roles[i] = i >= bodyCount ? 1 : 0
    seeds[i] = sr()
  }

  return { count, bodyCount, neutral, founder, enterprise, roles, seeds }
}
