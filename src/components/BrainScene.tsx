import { useEffect, useMemo, useRef } from 'react'
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

  return (
    <div className="scene-shell">
      <Canvas
        shadows={false}
        camera={{ position: defaultCameraPosition.toArray(), fov: 42, near: 0.1, far: 100 }}
        onPointerMissed={() => props.onSelectRegion('whole-brain')}
      >
        <color attach="background" args={['#080b12']} />
        <ambientLight intensity={1.28} />
        <hemisphereLight args={['#ffffff', '#d8d4cf', 0.92]} />
        <directionalLight position={[2, 4, 3]} intensity={0.68} />
        <directionalLight position={[-3, 2, -2]} intensity={0.26} />
        <BrainModel {...props} />
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
      <p className="scene-help">拖拽旋转，滚轮缩放，点击脑区查看解释。</p>
    </div>
  )
}
