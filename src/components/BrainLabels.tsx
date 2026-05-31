import { Html } from '@react-three/drei'
import { regionConfigs, shouldShowRegion } from '../utils/brainGeometry'
import type { BrainRegionId, ViewMode } from '../types/brain'

interface BrainLabelsProps {
  selectedRegionId: BrainRegionId
  hoveredRegionId: BrainRegionId | null
  viewMode: ViewMode
}

export function BrainLabels({ selectedRegionId, hoveredRegionId, viewMode }: BrainLabelsProps) {
  const featured = regionConfigs.filter((config) => {
    if (!shouldShowRegion(config.id, viewMode)) return false
    if (viewMode === 'inner') return config.layer === 'inner'
    return ['frontal-lobe', 'parietal-lobe', 'temporal-lobe', 'occipital-lobe', 'cerebellum', 'brainstem'].includes(config.id)
  })

  return (
    <>
      {featured.map((config) => {
        const active = selectedRegionId === config.id || hoveredRegionId === config.id
        return (
          <Html key={config.id} position={config.position} center distanceFactor={8} occlude>
            <span className={active ? 'brain-label active' : 'brain-label'}>{config.label}</span>
          </Html>
        )
      })}
    </>
  )
}
