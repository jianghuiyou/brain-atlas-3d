import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AnatomicalBrainModel } from './AnatomicalBrainModel'
import { BrainLabels } from './BrainLabels'
import { BrainRegionMesh } from './BrainRegionMesh'
import { CorticalShell } from './CorticalShell'
import { brainRegionById } from '../data/brainRegions'
import { regionConfigs, shouldShowRegion, isRegionEmphasized, regionFocusTargets } from '../utils/brainGeometry'
import type { BrainRegionId, ViewMode } from '../types/brain'

interface BrainModelProps {
  selectedRegionId: BrainRegionId
  hoveredRegionId: BrainRegionId | null
  viewMode: ViewMode
  opacity: number
  onSelectRegion: (id: BrainRegionId) => void
  onHoverRegion: (id: BrainRegionId | null) => void
}

function GyriLines({ innerMode }: { innerMode: boolean }) {
  return (
    <group>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={`cerebellum-line-${index}`} position={[0, -0.74 - index * 0.06, -1.27]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62 - index * 0.035, 0.007, 6, 80]} />
          <meshBasicMaterial color="#74434b" transparent opacity={innerMode ? 0.16 : 0.42} />
        </mesh>
      ))}
    </group>
  )
}

function SelectedRegionLocator({ selectedRegionId }: { selectedRegionId: BrainRegionId }) {
  const markerRef = useRef<THREE.Group>(null)
  const target = regionFocusTargets[selectedRegionId]

  useFrame(({ clock }) => {
    if (!markerRef.current) return
    const pulse = 1 + Math.sin(clock.elapsedTime * 4.2) * 0.12
    markerRef.current.scale.setScalar(pulse)
  })

  if (!target || selectedRegionId === 'whole-brain') return null

  const region = brainRegionById[selectedRegionId]
  const markerColor = '#f28f86'

  if (region.atlasMappingAccuracy !== 'unavailable') return null

  return (
    <group position={target}>
      <group ref={markerRef}>
        <mesh renderOrder={20}>
          <sphereGeometry args={[0.045, 32, 16]} />
          <meshBasicMaterial color={markerColor} transparent opacity={0.82} depthTest={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={19}>
          <torusGeometry args={[0.16, 0.005, 12, 80]} />
          <meshBasicMaterial color={markerColor} transparent opacity={0.78} depthTest={false} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]} renderOrder={19}>
          <torusGeometry args={[0.2, 0.004, 12, 80]} />
          <meshBasicMaterial color={markerColor} transparent opacity={0.46} depthTest={false} />
        </mesh>
      </group>
      <Html center distanceFactor={8} position={[0.36, 0.42, 0.16]} className="focus-marker-label">
        <span>{region.name}</span>
      </Html>
    </group>
  )
}

export function BrainModel({
  selectedRegionId,
  hoveredRegionId,
  viewMode,
  opacity,
  onSelectRegion,
  onHoverRegion,
}: BrainModelProps) {
  const innerMode = viewMode === 'inner'
  const [anatomicalReady, setAnatomicalReady] = useState(false)
  const selectedConfig = regionConfigs.find((config) => config.id === selectedRegionId)
  const outerOpacity = innerMode ? 0.22 : opacity / 100

  return (
    <group rotation={[-0.08, -0.22, 0]}>
      <AnatomicalBrainModel
        selectedRegionId={selectedRegionId}
        hoveredRegionId={hoveredRegionId}
        viewMode={viewMode}
        opacity={opacity}
        onLoadStateChange={setAnatomicalReady}
        onSelectRegion={onSelectRegion}
        onHoverRegion={onHoverRegion}
      />
      {anatomicalReady && <SelectedRegionLocator selectedRegionId={selectedRegionId} />}
      {!anatomicalReady && (
        <CorticalShell
          selectedRegionId={selectedRegionId}
          hoveredRegionId={hoveredRegionId}
          innerMode={innerMode}
          onSelectRegion={onSelectRegion}
          onHoverRegion={onHoverRegion}
        />
      )}
      {!anatomicalReady && <GyriLines innerMode={innerMode} />}
      {!anatomicalReady && regionConfigs.map((config) => {
          const visible = shouldShowRegion(config.id, viewMode)
          const relatedToSelection = selectedConfig?.layer === config.layer || selectedRegionId === 'whole-brain'
          const emphasized =
            isRegionEmphasized(config.id, viewMode) &&
            (selectedRegionId === 'whole-brain' || selectedRegionId === config.id || relatedToSelection)

          return (
            <BrainRegionMesh
              key={config.id}
              config={config}
              selectedRegionId={selectedRegionId}
              hoveredRegionId={hoveredRegionId}
              visible={visible}
              emphasized={emphasized}
              outerOpacity={outerOpacity}
              innerMode={innerMode}
              onSelectRegion={onSelectRegion}
              onHoverRegion={onHoverRegion}
            />
          )
        })}
      {!anatomicalReady && (
        <BrainLabels selectedRegionId={selectedRegionId} hoveredRegionId={hoveredRegionId} viewMode={viewMode} />
      )}
    </group>
  )
}
