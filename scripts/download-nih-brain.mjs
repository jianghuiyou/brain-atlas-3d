import { createWriteStream, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pipeline } from 'node:stream/promises'

const NIH_STL_URL =
  'https://3d.nih.gov/api/submissions/26436/runs/a4c89cda-cd5d-46d8-b3d3-184f8ebc4248/output-files/607510'
const outputPath = resolve('public/models/nih-hra-allen-brain.stl')
const manifestPath = resolve('public/models/model-manifest.json')

mkdirSync(dirname(outputPath), { recursive: true })

console.log('开始下载 NIH HRA/Allen 解剖级人脑 STL 模型...')
console.log(`来源：${NIH_STL_URL}`)
console.log(`保存到：${outputPath}`)
console.log('提示：该文件约 30MB+，当前网络代理较慢时可能需要较长时间。')

const response = await fetch(NIH_STL_URL, {
  headers: {
    'User-Agent': 'Mozilla/5.0',
  },
})

if (!response.ok || !response.body) {
  throw new Error(`下载失败：HTTP ${response.status} ${response.statusText}`)
}

await pipeline(response.body, createWriteStream(outputPath))
writeFileSync(
  manifestPath,
  `${JSON.stringify(
    {
      brainAtlasGlb: false,
      nihAnatomicalBrain: true,
    },
    null,
    2,
  )}\n`,
)

console.log('下载完成。重新运行 npm run dev 后，页面会优先加载这个解剖级模型。')
