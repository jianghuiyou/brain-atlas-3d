import { useMemo, useState } from 'react'
import { brainRegionById, brainRegionGroups } from '../data/brainRegions'
import type { BrainRegionId, BrainRegionTreeItem } from '../types/brain'

interface RegionListProps {
  selectedRegionId: BrainRegionId
  hoveredRegionId: BrainRegionId | null
  onSelectRegion: (id: BrainRegionId) => void
  onHoverRegion: (id: BrainRegionId | null) => void
}

export function RegionList({
  selectedRegionId,
  hoveredRegionId,
  onSelectRegion,
  onHoverRegion,
}: RegionListProps) {
  const expandableItems = useMemo(
    () => brainRegionGroups.flatMap((group) => group.items.filter((item) => item.children?.length)),
    [],
  )
  const [expandedItems, setExpandedItems] = useState<Partial<Record<BrainRegionId, boolean>>>(() =>
    expandableItems.reduce(
      (acc, item) => {
        acc[item.id] = false
        return acc
      },
      {} as Partial<Record<BrainRegionId, boolean>>,
    ),
  )

  const renderRegionButton = (id: BrainRegionId, depth = 0) => {
    const region = brainRegionById[id]

    return (
      <button
        key={id}
        type="button"
        className={`region-button ${hoveredRegionId === id ? 'hovered' : ''} ${depth > 0 ? 'child-region' : ''}`}
        aria-pressed={selectedRegionId === id}
        onClick={() => onSelectRegion(id)}
        onFocus={() => onHoverRegion(id)}
        onBlur={() => onHoverRegion(null)}
        onPointerEnter={() => onHoverRegion(id)}
        onPointerLeave={() => onHoverRegion(null)}
      >
        <span>{region.name}</span>
        <small>{region.englishName}</small>
      </button>
    )
  }

  const renderTreeItem = (item: BrainRegionTreeItem) => {
    const hasChildren = Boolean(item.children?.length)
    const expanded = expandedItems[item.id] || Boolean(item.children?.includes(selectedRegionId))
    const childListId = `region-children-${item.id}`

    if (!hasChildren) {
      return renderRegionButton(item.id)
    }

    return (
      <div key={item.id} className="region-tree-item">
        <div className="region-parent-row">
          {renderRegionButton(item.id)}
          <button
            type="button"
            className="expand-button"
            aria-expanded={expanded}
            aria-controls={childListId}
            aria-label={`${expanded ? '收起' : '展开'}${brainRegionById[item.id].name}的下级脑区`}
            onClick={() => setExpandedItems((current) => ({ ...current, [item.id]: !expanded }))}
          >
            {expanded ? '−' : '+'}
          </button>
        </div>
        {expanded && (
          <div id={childListId} className="region-children">
            {item.children?.map((childId) => renderRegionButton(childId, 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav className="region-list" aria-label="脑区列表">
      <div className="list-title">分层脑区目录</div>
      {brainRegionGroups.map((group) => (
        <section key={group.id} className="region-group">
          <h2>{group.title}</h2>
          <p>{group.description}</p>
          <div className="region-buttons">
            {group.items.map((item) => renderTreeItem(item))}
          </div>
        </section>
      ))}
    </nav>
  )
}
