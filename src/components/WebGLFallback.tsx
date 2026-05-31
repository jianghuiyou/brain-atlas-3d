import { RegionList } from './RegionList'
import type { BrainRegionId } from '../types/brain'

interface WebGLFallbackProps {
  selectedRegionId: BrainRegionId
  hoveredRegionId: BrainRegionId | null
  onSelectRegion: (id: BrainRegionId) => void
  onHoverRegion: (id: BrainRegionId | null) => void
}

export function WebGLFallback(props: WebGLFallbackProps) {
  return (
    <div className="webgl-fallback" role="status">
      <h2>当前浏览器无法启动 WebGL 3D 视图</h2>
      <p>
        你仍然可以通过下面的文字脑区列表学习内容。建议使用支持 WebGL 的现代浏览器获得完整 3D 体验。
      </p>
      <RegionList {...props} />
    </div>
  )
}
