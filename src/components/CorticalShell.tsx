import { useMemo } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import type { BrainRegionId } from '../types/brain'
import {
  makeCortexHemisphereGeometry,
  makeSulcusCurve,
  makeSylvianFissureCurve,
} from '../utils/brainGeometry'

interface CorticalShellProps {
  selectedRegionId: BrainRegionId
  hoveredRegionId: BrainRegionId | null
  innerMode: boolean
  onSelectRegion: (id: BrainRegionId) => void
  onHoverRegion: (id: BrainRegionId | null) => void
}

function HemisphereShell({
  side,
  selectedRegionId,
  hoveredRegionId,
  innerMode,
  onSelectRegion,
  onHoverRegion,
}: CorticalShellProps & { side: -1 | 1 }) {
  const regionId: BrainRegionId = side === -1 ? 'left-hemisphere' : 'right-hemisphere'
  const geometry = useMemo(() => makeCortexHemisphereGeometry(side), [side])
  const active = selectedRegionId === regionId || hoveredRegionId === regionId
  const opacity = innerMode ? 0.16 : active ? 0.82 : 0.68

  const handlePointer = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    onHoverRegion(regionId)
  }

  return (
    <mesh
      geometry={geometry}
      position={[side * 0.62, 0.42, -0.08]}
      scale={[1.05, 1.06, 1.12]}
      castShadow
      receiveShadow
      onClick={(event) => {
        event.stopPropagation()
        onSelectRegion(regionId)
      }}
      onPointerOver={handlePointer}
      onPointerOut={(event) => {
        event.stopPropagation()
        onHoverRegion(null)
      }}
    >
      <meshStandardMaterial
        color={active ? '#f4b49c' : '#d89a88'}
        roughness={0.82}
        metalness={0.02}
        transparent
        opacity={opacity}
        emissive={active ? '#4a241e' : '#160b0a'}
        emissiveIntensity={active ? 0.35 : 0.08}
        depthWrite={!innerMode}
      />
    </mesh>
  )
}

function Sulci({ innerMode }: { innerMode: boolean }) {
  const sulcusMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: innerMode ? '#f1c0b2' : '#5b2f37',
        roughness: 0.92,
        transparent: true,
        opacity: innerMode ? 0.16 : 0.56,
      }),
    [innerMode],
  )
  const fissureMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2f1721',
        roughness: 0.95,
        transparent: true,
        opacity: innerMode ? 0.2 : 0.76,
      }),
    [innerMode],
  )
  const curves = useMemo(() => {
    const result: Array<{ curve: THREE.CatmullRomCurve3; radius: number; fissure?: boolean }> = []

    for (const side of [-1, 1] as const) {
      for (let row = 0; row < 9; row += 1) {
        for (let band = 0; band < 2; band += 1) {
          result.push({ curve: makeSulcusCurve(side, row, band), radius: row % 3 === 0 ? 0.018 : 0.012 })
        }
      }
      result.push({ curve: makeSylvianFissureCurve(side), radius: 0.032, fissure: true })
    }

    return result
  }, [])

  return (
    <group position={[0, 0.42, -0.08]}>
      {curves.map(({ curve, radius, fissure }, index) => (
        <mesh key={index}>
          <tubeGeometry args={[curve, 72, radius, 8, false]} />
          <primitive object={fissure ? fissureMaterial : sulcusMaterial} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, 0.18, 0.06]} rotation={[0.06, 0, 0]}>
        <boxGeometry args={[0.055, 1.8, 2.75]} />
        <meshBasicMaterial color="#12080d" transparent opacity={innerMode ? 0.26 : 0.78} />
      </mesh>
    </group>
  )
}

export function CorticalShell(props: CorticalShellProps) {
  return (
    <group>
      <HemisphereShell side={-1} {...props} />
      <HemisphereShell side={1} {...props} />
      <Sulci innerMode={props.innerMode} />
    </group>
  )
}
