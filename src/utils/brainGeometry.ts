import * as THREE from 'three'
import type { BrainRegionId, ViewMode } from '../types/brain'

export interface RegionGeometryConfig {
  id: BrainRegionId
  label: string
  color: string
  position: [number, number, number]
  scale: [number, number, number]
  rotation?: [number, number, number]
  layer: 'outer' | 'inner'
  shape: 'sphere' | 'capsule' | 'tube'
}

export const defaultCameraPosition = new THREE.Vector3(0.4, 2.2, 7.2)
export const defaultCameraTarget = new THREE.Vector3(0, 0.25, 0)

export const regionFocusTargets: Partial<Record<BrainRegionId, [number, number, number]>> = {
  'left-hemisphere': [-1.3, 0.5, 0],
  'right-hemisphere': [1.3, 0.5, 0],
  'frontal-lobe': [0, 0.85, 1.15],
  'prefrontal-cortex': [0, 0.9, 1.95],
  'dorsolateral-prefrontal-cortex': [0, 1.03, 1.65],
  'ventromedial-prefrontal-cortex': [0, 0.54, 1.72],
  'medial-prefrontal-cortex': [0, 0.88, 1.78],
  'motor-cortex': [0, 1.08, 0.55],
  'dorsal-anterior-cingulate-cortex': [0, 0.68, 0.58],
  'parietal-lobe': [0, 1.25, -0.15],
  'somatosensory-cortex': [0, 1.08, 0.05],
  'angular-gyrus': [0, 0.82, -0.92],
  'temporoparietal-junction': [0, 0.5, -0.55],
  'temporal-lobe': [0, -0.25, 0.55],
  'temporal-cortex': [0, -0.22, 0.22],
  'occipital-lobe': [0, 0.55, -1.65],
  'visual-cortex': [0, 0.55, -1.65],
  'ventral-visual-stream': [0, -0.1, -0.95],
  amygdala: [0, -0.12, 0.25],
  hippocampus: [0, -0.1, -0.15],
  hypothalamus: [0, -0.42, 0.2],
  thalamus: [0, 0.02, -0.04],
  'corpus-callosum': [0, 0.38, -0.12],
  cerebellum: [0, -0.9, -1.55],
  brainstem: [0, -1.18, -0.55],
}

export const regionFocusDirections: Partial<Record<BrainRegionId, [number, number, number]>> = {
  'left-hemisphere': [0, 0.08, 1.18],
  'right-hemisphere': [0, 0.08, 1.18],
  'frontal-lobe': [0.18, 0.32, 1.08],
  'prefrontal-cortex': [0.12, 0.28, 1.1],
  'dorsolateral-prefrontal-cortex': [0.36, 0.34, 1.02],
  'ventromedial-prefrontal-cortex': [0.12, 0.18, 1.14],
  'medial-prefrontal-cortex': [0.08, 0.34, 1.1],
  'motor-cortex': [0.18, 0.86, 0.62],
  'dorsal-anterior-cingulate-cortex': [0.16, 0.58, 0.86],
  'parietal-lobe': [0.18, 1.02, -0.28],
  'somatosensory-cortex': [0.2, 0.92, 0.18],
  'angular-gyrus': [0.46, 0.52, -0.9],
  'temporoparietal-junction': [0.72, 0.36, -0.68],
  'temporal-lobe': [1.12, 0.16, 0.24],
  'temporal-cortex': [1.12, 0.14, 0.14],
  'occipital-lobe': [0.12, 0.3, -1.15],
  'visual-cortex': [0.12, 0.3, -1.15],
  'ventral-visual-stream': [0.42, 0.1, -1.02],
  amygdala: [1.0, 0.18, 0.18],
  hippocampus: [1.0, 0.18, -0.1],
  hypothalamus: [0.2, 0.08, 1.06],
  thalamus: [0.18, 0.22, 1.05],
  'corpus-callosum': [0.95, 0.22, 0.36],
  cerebellum: [0.18, -0.18, -1.1],
  brainstem: [0.12, -0.32, 1.02],
}

export const regionConfigs: RegionGeometryConfig[] = [
  { id: 'left-hemisphere', label: '左半球', color: '#d9a28e', position: [-0.95, 0.45, -0.1], scale: [1.15, 1.05, 1.35], rotation: [0.08, 0.05, -0.08], layer: 'outer', shape: 'sphere' },
  { id: 'right-hemisphere', label: '右半球', color: '#d9a28e', position: [0.95, 0.45, -0.1], scale: [1.15, 1.05, 1.35], rotation: [0.08, -0.05, 0.08], layer: 'outer', shape: 'sphere' },
  { id: 'frontal-lobe', label: '额叶', color: '#f28f7b', position: [0, 0.72, 1.05], scale: [1.82, 0.72, 0.82], rotation: [-0.18, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'prefrontal-cortex', label: '前额叶', color: '#ffbd8a', position: [0, 0.62, 1.78], scale: [1.45, 0.45, 0.28], rotation: [-0.28, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'dorsolateral-prefrontal-cortex', label: '背外侧前额叶', color: '#ffae73', position: [0, 0.98, 1.54], scale: [1.12, 0.34, 0.34], rotation: [-0.18, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'ventromedial-prefrontal-cortex', label: '腹内侧前额叶', color: '#ffc182', position: [0, 0.46, 1.58], scale: [0.72, 0.28, 0.28], rotation: [-0.22, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'medial-prefrontal-cortex', label: '内侧前额叶', color: '#ffcf9b', position: [0, 0.82, 1.68], scale: [0.78, 0.32, 0.3], rotation: [-0.18, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'motor-cortex', label: '运动皮层', color: '#ff8f73', position: [0, 1.03, 0.48], scale: [1.38, 0.28, 0.28], rotation: [-0.04, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'dorsal-anterior-cingulate-cortex', label: '背侧前扣带皮层', color: '#f7a36e', position: [0, 0.62, 0.55], scale: [0.78, 0.26, 0.28], rotation: [0, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'parietal-lobe', label: '顶叶', color: '#caa6ff', position: [0, 1.12, -0.15], scale: [1.62, 0.58, 0.92], rotation: [0.08, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'somatosensory-cortex', label: '躯体感觉皮层', color: '#bda2ff', position: [0, 1.04, 0.02], scale: [1.34, 0.28, 0.3], rotation: [0.04, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'angular-gyrus', label: '角回', color: '#d6b8ff', position: [0, 0.78, -0.86], scale: [0.9, 0.32, 0.32], rotation: [0.1, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'temporoparietal-junction', label: '颞顶联合区', color: '#c8b4ff', position: [0, 0.45, -0.48], scale: [0.92, 0.3, 0.36], rotation: [0.04, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'temporal-lobe', label: '颞叶', color: '#f0b36d', position: [0, -0.18, 0.42], scale: [1.82, 0.42, 0.72], rotation: [-0.08, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'temporal-cortex', label: '颞叶皮层', color: '#f4c17f', position: [0, -0.18, 0.18], scale: [1.6, 0.36, 0.58], rotation: [-0.08, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'occipital-lobe', label: '枕叶', color: '#90c8c2', position: [0, 0.46, -1.36], scale: [1.45, 0.6, 0.54], rotation: [0.18, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'visual-cortex', label: '视觉皮层', color: '#8edbd1', position: [0, 0.46, -1.38], scale: [1.24, 0.48, 0.42], rotation: [0.18, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'ventral-visual-stream', label: '腹侧视觉通路', color: '#7bd0c9', position: [0, -0.12, -0.9], scale: [1.22, 0.28, 0.38], rotation: [0.12, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'cerebellum', label: '小脑', color: '#d89a83', position: [0, -0.88, -1.32], scale: [1.14, 0.44, 0.58], rotation: [0.1, 0, 0], layer: 'outer', shape: 'sphere' },
  { id: 'brainstem', label: '脑干', color: '#c8875f', position: [0, -1.22, -0.42], scale: [0.36, 0.82, 0.34], rotation: [0.18, 0, 0], layer: 'outer', shape: 'capsule' },
  { id: 'amygdala', label: '杏仁核', color: '#ff6f91', position: [0, -0.16, 0.18], scale: [0.58, 0.18, 0.24], rotation: [0.1, 0, 0], layer: 'inner', shape: 'sphere' },
  { id: 'hippocampus', label: '海马体', color: '#8fd4ff', position: [0, -0.08, -0.18], scale: [1, 1, 1], rotation: [0, 0, 0], layer: 'inner', shape: 'tube' },
  { id: 'hypothalamus', label: '下丘脑', color: '#ffd166', position: [0, -0.42, 0.08], scale: [0.36, 0.22, 0.26], rotation: [0, 0, 0], layer: 'inner', shape: 'sphere' },
  { id: 'thalamus', label: '丘脑', color: '#b8f27f', position: [0, 0.02, -0.1], scale: [0.58, 0.32, 0.38], rotation: [0, 0, 0], layer: 'inner', shape: 'sphere' },
  { id: 'corpus-callosum', label: '胼胝体', color: '#fff0a6', position: [0, 0.42, -0.12], scale: [1, 1, 1], rotation: [0, 0, 0], layer: 'inner', shape: 'tube' },
]

export function shouldShowRegion(id: BrainRegionId, mode: ViewMode) {
  if (mode === 'inner') return true
  if (mode === 'outer' || mode === 'whole' || mode === 'focus') {
    return regionConfigs.find((region) => region.id === id)?.layer !== 'inner'
  }
  if (mode === 'left') return id !== 'right-hemisphere'
  if (mode === 'right') return id !== 'left-hemisphere'
  return true
}

export function isRegionEmphasized(id: BrainRegionId, mode: ViewMode) {
  if (mode === 'left') return id === 'left-hemisphere'
  if (mode === 'right') return id === 'right-hemisphere'
  if (mode === 'inner') return regionConfigs.find((region) => region.id === id)?.layer === 'inner'
  return true
}

export function makeHippocampusCurve(side: -1 | 1) {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(side * 0.28, -0.12, 0.3),
    new THREE.Vector3(side * 0.48, -0.04, 0.04),
    new THREE.Vector3(side * 0.44, -0.12, -0.32),
    new THREE.Vector3(side * 0.2, -0.24, -0.48),
  ])
}

export function makeCorpusCallosumCurve() {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.72, 0.26, -0.16),
    new THREE.Vector3(-0.28, 0.55, -0.2),
    new THREE.Vector3(0.28, 0.55, -0.2),
    new THREE.Vector3(0.72, 0.26, -0.16),
  ])
}

function surfaceNoise(x: number, y: number, z: number, seed: number) {
  return (
    Math.sin(x * 9.2 + y * 4.7 + seed) * 0.038 +
    Math.sin(y * 13.4 - z * 5.3 + seed * 0.7) * 0.028 +
    Math.sin((x + z) * 17.1 + seed * 1.9) * 0.018
  )
}

export function makeOrganicBlobGeometry(seed: number) {
  const geometry = new THREE.SphereGeometry(1, 72, 48)
  const positions = geometry.attributes.position

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index)
    const y = positions.getY(index)
    const z = positions.getZ(index)
    const noise = surfaceNoise(x, y, z, seed)
    const bottomTuck = y < -0.45 ? 1 - Math.abs(y + 0.45) * 0.1 : 1
    const frontalFullness = z > 0.38 ? 1 + z * 0.035 : 1
    const radius = (1 + noise) * bottomTuck * frontalFullness

    positions.setXYZ(index, x * radius, y * radius, z * radius)
  }

  geometry.computeVertexNormals()
  return geometry
}

export function makeCortexHemisphereGeometry(side: -1 | 1) {
  const geometry = new THREE.SphereGeometry(1, 112, 72)
  const positions = geometry.attributes.position

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index)
    const y = positions.getY(index)
    const z = positions.getZ(index)
    const superiorCurve = 1 + Math.max(y, 0) * 0.08
    const occipitalTaper = z < -0.38 ? 1 + z * 0.08 : 1
    const temporalDrop = y < -0.28 && z > -0.25 ? 1.08 : 1
    const fissurePinch = Math.max(0, 1 - Math.abs(x)) * 0.08
    const noise = surfaceNoise(x + side * 0.35, y, z, side * 4.3)
    const radius = (1 + noise) * superiorCurve * occipitalTaper * temporalDrop

    positions.setXYZ(
      index,
      x * radius * 0.86 - fissurePinch * side,
      y * radius * 0.98 - Math.max(-y - 0.45, 0) * 0.16,
      z * radius * 1.18 + Math.max(z, 0) * 0.12,
    )
  }

  geometry.computeVertexNormals()
  return geometry
}

export function makeSulcusCurve(side: -1 | 1, row: number, band: number) {
  const points: THREE.Vector3[] = []
  const count = 54
  const yBase = 0.95 - row * 0.18
  const zStart = 1.42 - band * 0.12

  for (let index = 0; index < count; index += 1) {
    const t = index / (count - 1)
    const z = zStart - t * 2.55
    const sweep = Math.sin(t * Math.PI)
    const x = side * (0.38 + sweep * (0.52 + row * 0.018))
    const y =
      yBase -
      t * 0.48 +
      Math.sin(t * Math.PI * 4 + row * 0.7 + band) * 0.055 +
      Math.sin(t * Math.PI * 9 + band) * 0.018

    points.push(new THREE.Vector3(x, y, z))
  }

  return new THREE.CatmullRomCurve3(points)
}

export function makeSylvianFissureCurve(side: -1 | 1) {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(side * 0.28, 0.05, 1.1),
    new THREE.Vector3(side * 0.72, -0.08, 0.68),
    new THREE.Vector3(side * 1.04, -0.18, 0.12),
    new THREE.Vector3(side * 0.88, -0.12, -0.7),
  ])
}
