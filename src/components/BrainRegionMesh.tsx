import { useMemo } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import type { BrainRegionId } from '../types/brain'
import type { RegionGeometryConfig } from '../utils/brainGeometry'
import {
  makeCorpusCallosumCurve,
  makeHippocampusCurve,
  makeOrganicBlobGeometry,
} from '../utils/brainGeometry'

interface BrainRegionMeshProps {
  config: RegionGeometryConfig
  selectedRegionId: BrainRegionId
  hoveredRegionId: BrainRegionId | null
  visible: boolean
  emphasized: boolean
  outerOpacity: number
  innerMode: boolean
  onSelectRegion: (id: BrainRegionId) => void
  onHoverRegion: (id: BrainRegionId | null) => void
}

function RegionGeometry({ config }: { config: RegionGeometryConfig }) {
  const organicGeometry = useMemo(() => {
    const seed = config.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return makeOrganicBlobGeometry(seed)
  }, [config.id])

  if (config.id === 'corpus-callosum') {
    return <tubeGeometry args={[makeCorpusCallosumCurve(), 48, 0.075, 12, false]} />
  }

  if (config.shape === 'capsule') {
    return <capsuleGeometry args={[0.42, 1.05, 8, 18]} />
  }

  return <primitive object={organicGeometry} attach="geometry" />
}

export function BrainRegionMesh({
  config,
  selectedRegionId,
  hoveredRegionId,
  visible,
  emphasized,
  outerOpacity,
  innerMode,
  onSelectRegion,
  onHoverRegion,
}: BrainRegionMeshProps) {
  const isSelected = selectedRegionId === config.id
  const isHovered = hoveredRegionId === config.id
  const isOuter = config.layer === 'outer'
  const overlayOpacity = config.id === 'left-hemisphere' || config.id === 'right-hemisphere' ? 0.18 : 0.58
  const baseOpacity = isOuter ? outerOpacity * overlayOpacity : 0.96
  const opacity = visible ? (emphasized ? baseOpacity : baseOpacity * 0.32) : 0
  const color = useMemo(() => new THREE.Color(config.color), [config.color])
  const emissive = isSelected || isHovered ? color.clone().multiplyScalar(0.45) : new THREE.Color('#1b0f14')

  const stopAndSelect = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    onSelectRegion(config.id)
  }

  const hoverHandlers = {
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation()
      onHoverRegion(config.id)
    },
    onPointerOut: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation()
      onHoverRegion(null)
    },
  }

  const material = (
    <meshStandardMaterial
      color={color}
      transparent
      opacity={opacity}
      roughness={0.64}
      metalness={0.04}
      emissive={emissive}
      emissiveIntensity={isSelected ? 0.55 : isHovered ? 0.35 : 0.08}
      depthWrite={opacity > 0.65}
    />
  )

  const highlightMaterial = (
    <meshBasicMaterial color="#fff4c2" transparent opacity={isSelected ? 0.2 : 0.12} wireframe />
  )

  const hippocampusCurves = [makeHippocampusCurve(-1), makeHippocampusCurve(1)]

  return (
    <group
      position={config.position}
      scale={config.scale}
      rotation={config.rotation}
      visible={visible || innerMode}
    >
      {config.id === 'hippocampus' ? (
        hippocampusCurves.map((curve, index) => (
          <mesh
            key={index}
            userData={{ regionId: config.id }}
            castShadow
            receiveShadow
            onClick={stopAndSelect}
            {...hoverHandlers}
          >
            <tubeGeometry args={[curve, 36, 0.055, 10, false]} />
            {material}
          </mesh>
        ))
      ) : (
        <mesh
          userData={{ regionId: config.id }}
          castShadow
          receiveShadow
          onClick={stopAndSelect}
          {...hoverHandlers}
        >
          <RegionGeometry config={config} />
          {material}
        </mesh>
      )}
      {(isSelected || isHovered) && visible && (
        config.id === 'hippocampus' ? (
          hippocampusCurves.map((curve, index) => (
            <mesh key={`highlight-${index}`} scale={[1.04, 1.04, 1.04]}>
              <tubeGeometry args={[curve, 36, 0.058, 10, false]} />
              {highlightMaterial}
            </mesh>
          ))
        ) : (
          <mesh scale={[1.04, 1.04, 1.04]}>
            <RegionGeometry config={config} />
            {highlightMaterial}
          </mesh>
        )
      )}
    </group>
  )
}
