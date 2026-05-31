import { brainRegionById } from '../data/brainRegions'
import { brainRegionLearningNotes } from '../data/brainRegionLearningNotes'
import type { BrainRegion, BrainRegionId } from '../types/brain'

interface RegionPanelProps {
  region: BrainRegion
  onSelectRegion: (id: BrainRegionId) => void
}

export function RegionPanel({ region, onSelectRegion }: RegionPanelProps) {
  const parentRegion = region.parentId ? brainRegionById[region.parentId] : null
  const learningNote = brainRegionLearningNotes[region.id]
  const sourceLinks = [...region.sources, ...learningNote.furtherReading].filter(
    (source, index, sources) => sources.findIndex((item) => item.url === source.url) === index,
  )

  return (
    <article className="region-panel" aria-live="polite">
      <div className="panel-kicker">当前脑区</div>
      <header className="panel-header">
        <div>
          <h1>{region.name}</h1>
          <p className="english-name">{region.englishName}</p>
        </div>
        <span className="layer-pill">
          {region.layer === 'inner' ? '内层' : region.layer === 'outer' ? '外层' : '总览'}
        </span>
      </header>
      <p className="summary">{region.shortSummary}</p>
      {parentRegion && (
        <div className="hierarchy-note">
          <strong>所属层级</strong>
          <button type="button" onClick={() => onSelectRegion(parentRegion.id)}>
            {parentRegion.name} {parentRegion.englishName}
          </button>
        </div>
      )}
      <div className={`mapping-note mapping-${region.atlasMappingAccuracy}`}>
        <strong>
          3D 对应：
          {region.atlasMappingAccuracy === 'direct'
            ? '较直接'
            : region.atlasMappingAccuracy === 'approximate'
              ? '近似/局部'
              : region.atlasMappingAccuracy === 'unavailable'
                ? '当前无独立网格'
                : '总览'}
        </strong>
        <span>{region.atlasMappingNote}</span>
      </div>

      <section>
        <h2>位置与功能</h2>
        <p>{region.plainExplanation}</p>
      </section>
      <section>
        <h2>功能概览</h2>
        <p>{region.functionDetail}</p>
      </section>
      <section>
        <h2>系统连接</h2>
        <p>{region.systemContext}</p>
      </section>
      <section>
        <h2>情绪与神经化学</h2>
        <p>{learningNote.emotionNeurochemistry}</p>
      </section>
      <section>
        <h2>学习提示</h2>
        <p>{region.studyNote}</p>
      </section>

      {region.relatedRegions.length > 0 && (
        <section>
          <h2>相关脑区</h2>
          <div className="related-list">
            {region.relatedRegions.map((id) => (
              <button key={id} type="button" onClick={() => onSelectRegion(id)}>
                {brainRegionById[id].name}
              </button>
            ))}
          </div>
        </section>
      )}

      {region.caution && (
        <section className="caution-box">
          <h2>谨慎理解</h2>
          <p>{region.caution}</p>
        </section>
      )}

      <section>
        <h2>资料来源</h2>
        <ul className="source-list">
          {sourceLinks.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
