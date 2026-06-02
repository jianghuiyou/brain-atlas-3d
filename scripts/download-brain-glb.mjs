import { mkdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

Object.defineProperty(globalThis, 'navigator', {
  value: { userAgent: '' },
  writable: true,
  configurable: true,
})

const { dkFunctionalMap, runPipeline } = await import('freesurfer-to-glb')
const { NodeIO } = await import('@gltf-transform/core')
const { EXTMeshoptCompression } = await import('@gltf-transform/extensions')
const { dedup, prune, reorder, quantize, simplify, weld } = await import('@gltf-transform/functions')
const meshoptModule = await import('meshoptimizer')
const MeshoptEncoder = meshoptModule.MeshoptEncoder ?? meshoptModule.default?.MeshoptEncoder
const MeshoptSimplifier = meshoptModule.MeshoptSimplifier ?? meshoptModule.default?.MeshoptSimplifier

const outputPath = resolve('public/models/brain-atlas.glb')
const cacheDir = resolve('.cache/brain-for-web')
const manifestPath = resolve('public/models/model-manifest.json')

mkdirSync(dirname(outputPath), { recursive: true })
mkdirSync(cacheDir, { recursive: true })

console.log('开始生成 FreeSurfer / Brainder.org 大脑 GLB 模型...')
console.log('来源网格：Brainder.org Brain for Blender，CC BY-SA 3.0')
console.log('转换工具：freesurfer-to-glb，Apache-2.0')
console.log(`输出：${outputPath}`)

await runPipeline({
  cacheDir,
  outputPath,
  regionMap: dkFunctionalMap,
  targetRadius: 3,
})

const sizeBefore = statSync(outputPath).size
console.log(`原始 GLB 大小：${(sizeBefore / 1024 / 1024).toFixed(2)} MB`)

await MeshoptEncoder.ready
await MeshoptSimplifier.ready
const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression])
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder })

const document = await io.read(outputPath)
await document.transform(
  dedup(),
  prune(),
  weld({ tolerance: 0.0001 }),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.5, error: 0.001 }),
  reorder({ encoder: MeshoptEncoder, level: 'medium' }),
  quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }),
)

document
  .createExtension(EXTMeshoptCompression)
  .setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE })

await io.write(outputPath, document)
const sizeAfter = statSync(outputPath).size
console.log(`压缩后 GLB 大小：${(sizeAfter / 1024 / 1024).toFixed(2)} MB（减少 ${(100 * (1 - sizeAfter / sizeBefore)).toFixed(1)}%）`)

writeFileSync(
  manifestPath,
  `${JSON.stringify(
    {
      brainAtlasGlb: true,
      nihAnatomicalBrain: false,
    },
    null,
    2,
  )}\n`,
)

console.log('GLB 生成完成。页面会优先加载 public/models/brain-atlas.glb 作为默认主模型。')
