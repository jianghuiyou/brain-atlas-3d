export type BrainLayer = 'overview' | 'outer' | 'inner'
export type BrainSide = 'left' | 'right' | 'midline' | 'bilateral'
export type AtlasMappingAccuracy = 'direct' | 'approximate' | 'unavailable' | 'overview'

export type BrainRegionId =
  | 'whole-brain'
  | 'left-hemisphere'
  | 'right-hemisphere'
  | 'frontal-lobe'
  | 'prefrontal-cortex'
  | 'dorsolateral-prefrontal-cortex'
  | 'ventromedial-prefrontal-cortex'
  | 'medial-prefrontal-cortex'
  | 'motor-cortex'
  | 'dorsal-anterior-cingulate-cortex'
  | 'parietal-lobe'
  | 'somatosensory-cortex'
  | 'angular-gyrus'
  | 'temporoparietal-junction'
  | 'temporal-lobe'
  | 'temporal-cortex'
  | 'occipital-lobe'
  | 'visual-cortex'
  | 'ventral-visual-stream'
  | 'amygdala'
  | 'hippocampus'
  | 'hypothalamus'
  | 'thalamus'
  | 'corpus-callosum'
  | 'cerebellum'
  | 'brainstem'

export type ViewMode = 'whole' | 'left' | 'right' | 'outer' | 'inner' | 'focus'

export interface SourceLink {
  label: string
  url: string
}

export interface BrainRegion {
  id: BrainRegionId
  name: string
  englishName: string
  parentId?: BrainRegionId
  layer: BrainLayer
  side: BrainSide
  shortSummary: string
  plainExplanation: string
  functionDetail: string
  systemContext: string
  studyNote: string
  relatedRegions: BrainRegionId[]
  atlasMappingAccuracy: AtlasMappingAccuracy
  atlasMappingNote: string
  caution?: string
  sources: SourceLink[]
}

export interface BrainRegionLearningNote {
  emotionNeurochemistry: string
  furtherReading: SourceLink[]
}

export interface BrainRegionTreeItem {
  id: BrainRegionId
  children?: BrainRegionId[]
}

export interface BrainRegionGroup {
  id: string
  title: string
  description: string
  items: BrainRegionTreeItem[]
}
