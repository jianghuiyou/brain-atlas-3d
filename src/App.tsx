import { BrainScene } from './components/BrainScene'
import { EducationNotice } from './components/EducationNotice'
import { RegionList } from './components/RegionList'
import { RegionPanel } from './components/RegionPanel'
import { ViewControls } from './components/ViewControls'
import { useBrainView } from './hooks/useBrainView'

function App() {
  const brainView = useBrainView()

  return (
    <main className="app-shell">
      <section className="workspace" aria-label="Brain Atlas 3D">
        <div className="viewer-column">
          <div className="viewer-topbar">
            <div>
              <p className="eyebrow">Brain Atlas 3D</p>
              <h1>可旋转、可定位、可点击的 3D 人脑结构学习工具</h1>
            </div>
            <ViewControls
              onReset={brainView.resetCamera}
            />
          </div>

          <BrainScene
            selectedRegionId={brainView.selectedRegionId}
            hoveredRegionId={brainView.hoveredRegionId}
            viewMode={brainView.viewMode}
            opacity={brainView.opacity}
            resetNonce={brainView.resetNonce}
            onSelectRegion={brainView.setSelectedRegionId}
            onHoverRegion={brainView.setHoveredRegionId}
          />

          <RegionPanel
            region={brainView.selectedRegion}
            onSelectRegion={brainView.setSelectedRegionId}
          />
        </div>

        <aside className="panel-column">
          <RegionList
            selectedRegionId={brainView.selectedRegionId}
            hoveredRegionId={brainView.hoveredRegionId}
            onSelectRegion={brainView.setSelectedRegionId}
            onHoverRegion={brainView.setHoveredRegionId}
          />
          <EducationNotice />
        </aside>
      </section>
    </main>
  )
}

export default App
