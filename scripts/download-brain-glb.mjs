import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

Object.defineProperty(globalThis, 'navigator', {
  value: { userAgent: '' },
  writable: true,
  configurable: true,
})

const { dkFunctionalMap, runPipeline } = await import('freesurfer-to-glb')

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
