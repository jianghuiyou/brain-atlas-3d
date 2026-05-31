interface ViewControlsProps {
  onReset: () => void
}

export function ViewControls({ onReset }: ViewControlsProps) {
  return (
    <div className="view-controls" aria-label="3D 视图控制">
      <button type="button" className="reset-button" onClick={onReset} aria-label="重置 3D 视角">
        重置视角
      </button>
    </div>
  )
}
