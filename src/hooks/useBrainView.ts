import { useMemo, useState } from 'react'
import { brainRegionById } from '../data/brainRegions'
import type { BrainRegionId, ViewMode } from '../types/brain'

export function useBrainView() {
  const [selectedRegionId, setSelectedRegionId] = useState<BrainRegionId>('whole-brain')
  const [hoveredRegionId, setHoveredRegionId] = useState<BrainRegionId | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('whole')
  const [opacity] = useState(100)
  const [resetNonce, setResetNonce] = useState(0)

  const selectedRegion = useMemo(
    () => brainRegionById[selectedRegionId],
    [selectedRegionId],
  )

  return {
    selectedRegionId,
    selectedRegion,
    hoveredRegionId,
    viewMode,
    opacity,
    resetNonce,
    setSelectedRegionId,
    setHoveredRegionId,
    setViewMode,
    resetCamera: () => setResetNonce((value) => value + 1),
  }
}
