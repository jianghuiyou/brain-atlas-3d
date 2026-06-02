import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { BrainModel } from './BrainModel'
import { WebGLFallback } from './WebGLFallback'
import { isWebGLAvailable } from '../utils/webgl'
import {
  defaultCameraPosition,
  defaultCameraTarget,
  regionFocusDirections,
  regionFocusTargets,
} from '../utils/brainGeometry'
import type { BrainRegionId, ViewMode } from '../types/brain'

interface BrainSceneProps {
  selectedRegionId: BrainRegionId
  hoveredRegionId: BrainRegionId | null
  viewMode: ViewMode
  opacity: number
  resetNonce: number
  onSelectRegion: (id: BrainRegionId) => void
  onHoverRegion: (id: BrainRegionId | null) => void
}

function CameraController({
  controlsRef,
  selectedRegionId,
  viewMode,
  resetNonce,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>
  selectedRegionId: BrainRegionId
  viewMode: ViewMode
  resetNonce: number
}) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.copy(defaultCameraPosition)
    controlsRef.current?.target.copy(defaultCameraTarget)
    controlsRef.current?.update()
  }, [camera, controlsRef, resetNonce])

  useEffect(() => {
    if (selectedRegionId === 'whole-brain') return
    const targetTuple = regionFocusTargets[selectedRegionId]
    if (!targetTuple) return

    const target = new THREE.Vector3(...targetTuple)
    const isHemisphereSelection =
      selectedRegionId === 'left-hemisphere' || selectedRegionId === 'right-hemisphere'
    const focusTarget = isHemisphereSelection
      ? new THREE.Vector3(0, 0.42, -0.04)
      : target.clone().lerp(defaultCameraTarget, 0.46)
    const mappedDirection = regionFocusDirections[selectedRegionId]
    let direction = mappedDirection
      ? new THREE.Vector3(...mappedDirection)
      : new THREE.Vector3(0.45, 0.38, 1)

    if (!mappedDirection && viewMode === 'left') {
      direction = new THREE.Vector3(-1.1, 0.32, 0.55)
    } else if (!mappedDirection && viewMode === 'right') {
      direction = new THREE.Vector3(1.1, 0.32, 0.55)
    }

    direction.normalize()
    const distance = isHemisphereSelection ? 5.9 : 5.45
    camera.position.copy(focusTarget.clone().add(direction.multiplyScalar(distance)))
    controlsRef.current?.target.copy(focusTarget)
    controlsRef.current?.update()
  }, [camera, controlsRef, selectedRegionId, viewMode])

  return null
}

export function BrainScene(props: BrainSceneProps) {
  const webglAvailable = useMemo(() => isWebGLAvailable(), [])
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const [progress, setProgress] = useState<{ loaded: number; total: number } | null>(null)
  const [ready, setReady] = useState(false)

  if (!webglAvailable) {
    return (
      <WebGLFallback
        selectedRegionId={props.selectedRegionId}
        hoveredRegionId={props.hoveredRegionId}
        onSelectRegion={props.onSelectRegion}
        onHoverRegion={props.onHoverRegion}
      />
    )
  }

  const showLoadingOverlay = !ready
  const percent = progress && progress.total > 0
    ? Math.min(100, Math.round((progress.loaded / progress.total) * 100))
    : null
  const loadedMb = progress ? (progress.loaded / 1024 / 1024).toFixed(2) : null
  const totalMb = progress && progress.total ? (progress.total / 1024 / 1024).toFixed(2) : null

  return (
    <div className="scene-shell">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        shadows={false}
        camera={{ position: defaultCameraPosition.toArray(), fov: 38, near: 0.1, far: 100 }}
        onPointerMissed={() => props.onSelectRegion('whole-brain')}
      >
        <color attach="background" args={['#e7e3dc']} />
        <ambientLight intensity={1.42} />
        <hemisphereLight args={['#ffffff', '#d7d1c8', 1.05]} />
        <directionalLight position={[2.5, 4, 3]} intensity={0.58} />
        <directionalLight position={[-3, 2.2, -2]} intensity={0.32} />
        <BrainModel
          {...props}
          onLoadProgressChange={setProgress}
          onLoadReadyChange={setReady}
        />
        <CameraController
          controlsRef={controlsRef}
          selectedRegionId={props.selectedRegionId}
          viewMode={props.viewMode}
          resetNonce={props.resetNonce}
        />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={3.2}
          maxDistance={10}
          target={defaultCameraTarget.toArray()}
        />
      </Canvas>
      {showLoadingOverlay && (
        <div className="scene-loading-overlay" role="status" aria-live="polite">
          <div className="scene-loading-card">
            <div className="scene-loading-spinner" aria-hidden />
            <p className="scene-loading-title">3D 解剖大脑模型加载中</p>
            <div className="scene-loading-bar">
              <div
                className="scene-loading-bar-fill"
                style={{ width: percent != null ? `${percent}%` : '12%' }}
              />
            </div>
            <p className="scene-loading-meta">
              {percent != null
                ? `${percent}%${loadedMb && totalMb ? ` · ${loadedMb} / ${totalMb} MB` : ''}`
                : '正在请求模型，首次加载受网络环境影响可能较慢，请稍候…'}
            </p>
          </div>
        </div>
      )}
      <p className="scene-help">拖拽旋转，滚轮缩放，点击脑区查看解释。</p>
    </div>
  )
}
