import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import type { BrainRegionId, ViewMode } from '../types/brain'

const modelBaseUrl = import.meta.env.BASE_URL
const LOCAL_BRAIN_GLB_URL = `${modelBaseUrl}models/brain-atlas.glb`
const LOCAL_NIH_STL_URL = `${modelBaseUrl}models/nih-hra-allen-brain.stl`
const MODEL_MANIFEST_URL = `${modelBaseUrl}models/model-manifest.json`

interface ModelManifest {
  brainAtlasGlb?: boolean
  nihAnatomicalBrain?: boolean
}

interface AtlasMeshMapping {
  primaryRegionId: BrainRegionId
  regionIds: BrainRegionId[]
}

const atlasMeshRegionMap: Record<string, AtlasMeshMapping> = {
  dlpfc: {
    primaryRegionId: 'dorsolateral-prefrontal-cortex',
    regionIds: ['dorsolateral-prefrontal-cortex', 'prefrontal-cortex', 'frontal-lobe'],
  },
  vmpfc: {
    primaryRegionId: 'ventromedial-prefrontal-cortex',
    regionIds: ['ventromedial-prefrontal-cortex', 'prefrontal-cortex', 'frontal-lobe'],
  },
  mpfc: {
    primaryRegionId: 'medial-prefrontal-cortex',
    regionIds: ['medial-prefrontal-cortex', 'prefrontal-cortex', 'frontal-lobe'],
  },
  'cortex-motor': { primaryRegionId: 'motor-cortex', regionIds: ['motor-cortex', 'frontal-lobe'] },
  dacc: {
    primaryRegionId: 'dorsal-anterior-cingulate-cortex',
    regionIds: ['dorsal-anterior-cingulate-cortex', 'frontal-lobe'],
  },
  'cortex-frontal': { primaryRegionId: 'frontal-lobe', regionIds: ['frontal-lobe'] },
  'cortex-somatosensory': {
    primaryRegionId: 'somatosensory-cortex',
    regionIds: ['somatosensory-cortex', 'parietal-lobe'],
  },
  'angular-gyrus': { primaryRegionId: 'angular-gyrus', regionIds: ['angular-gyrus', 'parietal-lobe'] },
  tpj: { primaryRegionId: 'temporoparietal-junction', regionIds: ['temporoparietal-junction', 'parietal-lobe'] },
  'cortex-parietal': { primaryRegionId: 'parietal-lobe', regionIds: ['parietal-lobe'] },
  'cortex-temporal': { primaryRegionId: 'temporal-cortex', regionIds: ['temporal-cortex', 'temporal-lobe'] },
  'cortex-occipital': { primaryRegionId: 'visual-cortex', regionIds: ['visual-cortex', 'occipital-lobe'] },
  'cortex-ventral': { primaryRegionId: 'ventral-visual-stream', regionIds: ['ventral-visual-stream', 'occipital-lobe', 'temporal-lobe'] },
  hippocampus: { primaryRegionId: 'hippocampus', regionIds: ['hippocampus', 'temporal-lobe'] },
  amygdala: { primaryRegionId: 'amygdala', regionIds: ['amygdala', 'temporal-lobe'] },
  thalamus: { primaryRegionId: 'thalamus', regionIds: ['thalamus'] },
  'corpus-callosum': { primaryRegionId: 'corpus-callosum', regionIds: ['corpus-callosum'] },
  cerebellum: { primaryRegionId: 'cerebellum', regionIds: ['cerebellum'] },
  brainstem: { primaryRegionId: 'brainstem', regionIds: ['brainstem'] },
}

interface AnatomicalBrainModelProps {
  selectedRegionId: BrainRegionId
  hoveredRegionId: BrainRegionId | null
  viewMode: ViewMode
  opacity: number
  onLoadStateChange: (ready: boolean) => void
  onLoadFailureChange?: (failed: boolean) => void
  onSelectRegion: (id: BrainRegionId) => void
  onHoverRegion: (id: BrainRegionId | null) => void
}

export function AnatomicalBrainModel({
  selectedRegionId,
  hoveredRegionId,
  viewMode,
  opacity,
  onLoadStateChange,
  onLoadFailureChange,
  onSelectRegion,
  onHoverRegion,
}: AnatomicalBrainModelProps) {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  const [model, setModel] = useState<THREE.Object3D | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    onLoadFailureChange?.(failed)
  }, [failed, onLoadFailureChange])
  const active = selectedRegionId === 'whole-brain' || hoveredRegionId === 'whole-brain'
  const innerMode = viewMode === 'inner'
  const pickRegionFromObject = (object: THREE.Object3D): BrainRegionId => {
    let current: THREE.Object3D | null = object

    while (current) {
      const regionId = current.userData.regionId as BrainRegionId | undefined
      if (regionId) return regionId
      current = current.parent
    }

    return 'whole-brain'
  }

  useEffect(() => {
    let cancelled = false
    const gltfLoader = new GLTFLoader()
    const stlLoader = new STLLoader()

    function cloneMaterial(material: THREE.Material | THREE.Material[]) {
      return Array.isArray(material)
        ? material.map((item) => item.clone())
        : material.clone()
    }

    function makeMirroredHemisphere(source: THREE.Object3D) {
      const mirrored = source.clone(false)

      source.children.forEach((child) => {
        const clonedChild = child.clone(true)
        clonedChild.traverse((node) => {
          if (!(node instanceof THREE.Mesh)) return
          node.geometry = node.geometry.clone()
          node.material = cloneMaterial(node.material)
        })
        mirrored.add(clonedChild)
      })

      mirrored.scale.x *= -1
      mirrored.name = 'mirrored-right-hemisphere'
      return mirrored
    }

    function readAtlasSide(object: THREE.Object3D) {
      let current: THREE.Object3D | null = object

      while (current) {
        const side = current.userData.atlasSide as 'left' | 'right' | undefined
        if (side) return side
        current = current.parent
      }

      return undefined
    }

    function completeBilateralAtlas(root: THREE.Object3D) {
      const box = new THREE.Box3().setFromObject(root)
      const center = new THREE.Vector3()
      box.getCenter(center)

      if (Math.abs(center.x) < 0.15) return root

      const bilateral = new THREE.Group()
      bilateral.name = 'bilateral-brain-atlas'
      root.userData.atlasSide = center.x > 0 ? 'left' : 'right'
      const mirrored = makeMirroredHemisphere(root)
      mirrored.userData.atlasSide = root.userData.atlasSide === 'right' ? 'left' : 'right'
      bilateral.add(root)
      bilateral.add(mirrored)
      return bilateral
    }

    function normalizeObject(root: THREE.Object3D) {
      const box = new THREE.Box3().setFromObject(root)
      const center = new THREE.Vector3()
      const size = new THREE.Vector3()
      box.getCenter(center)
      box.getSize(size)
      const largestAxis = Math.max(size.x, size.y, size.z) || 1

      root.position.sub(center)
      root.scale.setScalar(3.8 / largestAxis)
      root.rotation.set(-Math.PI / 2, 0, Math.PI)

      root.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return
        const mapping = atlasMeshRegionMap[child.name]
        child.castShadow = false
        child.receiveShadow = false
        child.userData.regionId = mapping?.primaryRegionId ?? 'whole-brain'
        child.userData.regionIds = mapping?.regionIds ?? ['whole-brain']
        child.userData.atlasSide = readAtlasSide(child)
        child.userData.sourceMeshName = child.name
        child.material = cloneMaterial(child.material)
      })
    }

    async function loadLocalAnatomicalModel() {
      let manifest: ModelManifest

      try {
        const response = await fetch(MODEL_MANIFEST_URL)
        manifest = (await response.json()) as ModelManifest

      } catch {
        if (!cancelled) {
          setFailed(true)
          onLoadStateChange(false)
        }
        return
      }

      if (manifest.brainAtlasGlb) {
        try {
          const response = await fetch(LOCAL_BRAIN_GLB_URL)
          if (!response.ok) {
            throw new Error(`GLB load failed: ${response.status}`)
          }

          const buffer = await response.arrayBuffer()
          gltfLoader.parse(
            buffer,
            '',
            (gltf) => {
              if (cancelled) return
              const root = completeBilateralAtlas(gltf.scene)
              normalizeObject(root)
              setModel(root)
              setGeometry(null)
              onLoadStateChange(true)
            },
            () => {
              if (cancelled) return
              setFailed(true)
              onLoadStateChange(false)
            },
          )
        } catch {
          if (!cancelled) {
            setFailed(true)
            onLoadStateChange(false)
          }
        }
        return
      }

      if (!manifest.nihAnatomicalBrain) {
        if (!cancelled) {
          setFailed(true)
          onLoadStateChange(false)
        }
        return
      }

      try {
        const response = await fetch(LOCAL_NIH_STL_URL)
        if (!response.ok) {
          throw new Error(`STL load failed: ${response.status}`)
        }

        const buffer = await response.arrayBuffer()
        const loadedGeometry = stlLoader.parse(buffer)
        if (cancelled) return

        loadedGeometry.computeVertexNormals()
        loadedGeometry.center()

        loadedGeometry.computeBoundingBox()
        const box = loadedGeometry.boundingBox ?? new THREE.Box3()
        const size = new THREE.Vector3()
        box.getSize(size)
        const largestAxis = Math.max(size.x, size.y, size.z) || 1
        loadedGeometry.scale(3.8 / largestAxis, 3.8 / largestAxis, 3.8 / largestAxis)
        loadedGeometry.rotateX(-Math.PI / 2)
        loadedGeometry.rotateZ(Math.PI)
        loadedGeometry.computeBoundingSphere()
        loadedGeometry.computeVertexNormals()

        setGeometry(loadedGeometry)
        setModel(null)
        onLoadStateChange(true)
      } catch {
        if (!cancelled) {
          setFailed(true)
          onLoadStateChange(false)
        }
      }
    }

    void loadLocalAnatomicalModel()

    return () => {
      cancelled = true
    }
  }, [onLoadStateChange])

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: active ? '#e8b7a6' : '#c99184',
        roughness: 0.86,
        metalness: 0.02,
        clearcoat: 0.18,
        transparent: true,
        opacity: innerMode ? 0.24 : Math.max(0.42, opacity / 100),
        emissive: active ? '#3b1d18' : '#130807',
        emissiveIntensity: active ? 0.28 : 0.06,
        side: THREE.DoubleSide,
        depthWrite: !innerMode,
      }),
    [active, innerMode, opacity],
  )

  useEffect(() => {
    if (!model) return

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      const regionId = child.userData.regionId as BrainRegionId | undefined
      const regionIds = (child.userData.regionIds as BrainRegionId[] | undefined) ?? []
      const atlasSide = child.userData.atlasSide as 'left' | 'right' | undefined
      const isSelected = regionId === selectedRegionId || regionIds.includes(selectedRegionId)
      const isHovered = Boolean(hoveredRegionId && (regionId === hoveredRegionId || regionIds.includes(hoveredRegionId)))
      const sideSelected =
        (selectedRegionId === 'left-hemisphere' && atlasSide === 'left') ||
        (selectedRegionId === 'right-hemisphere' && atlasSide === 'right')
      const sideEmphasizedByView =
        (viewMode === 'left' && atlasSide === 'left') || (viewMode === 'right' && atlasSide === 'right')
      const activeBySelection = isSelected || isHovered || sideSelected || sideEmphasizedByView
      child.renderOrder = activeBySelection ? 10 : 0

      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial) && !(material instanceof THREE.MeshPhysicalMaterial)) {
          return
        }
        material.transparent = false
        material.opacity = Math.max(0.98, opacity / 100)
        material.depthWrite = true
        material.depthTest = true
        material.color.set(activeBySelection ? '#ef958c' : '#d7d2ca')
        material.roughness = activeBySelection ? 0.66 : 0.76
        material.metalness = 0.02
        material.emissive = new THREE.Color(activeBySelection || active ? '#4a211f' : '#38342f')
        material.emissiveIntensity = activeBySelection ? 0.08 : active ? 0.06 : 0.04
        material.needsUpdate = true
      })
    })
  }, [active, hoveredRegionId, innerMode, model, opacity, selectedRegionId, viewMode])

  if (failed) {
    return null
  }

  if (!geometry && !model) {
    return (
      <group position={[0, 0.4, -0.15]}>
        <mesh>
          <sphereGeometry args={[1.35, 32, 18]} />
          <meshBasicMaterial color="#d9a28e" transparent opacity={0.12} wireframe />
        </mesh>
      </group>
    )
  }

  if (model) {
    return (
      <primitive
        object={model}
        position={[0, 0.52, -0.08]}
        onClick={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation()
          onSelectRegion(pickRegionFromObject(event.object))
        }}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation()
          onHoverRegion(pickRegionFromObject(event.object))
        }}
        onPointerOut={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation()
          onHoverRegion(null)
        }}
      />
    )
  }

  if (!geometry) {
    return null
  }

  return (
    <mesh
      geometry={geometry}
      position={[0, 0.52, -0.08]}
      castShadow
      receiveShadow
      onClick={(event) => {
        event.stopPropagation()
        onSelectRegion('whole-brain')
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHoverRegion('whole-brain')
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        onHoverRegion(null)
      }}
    >
      <primitive object={material} attach="material" />
    </mesh>
  )
}
