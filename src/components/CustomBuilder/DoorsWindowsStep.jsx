import { useState } from 'react'
import { Trash2 } from 'lucide-react'

/* ── SVG Door Illustrations ── */
function SinglePanelDoorSvg() {
  return (
    <svg viewBox="0 0 40 72" className="w-full h-full">
      <rect x="4" y="2" width="32" height="68" rx="1" fill="#f0f0f0" stroke="#999" strokeWidth="1.2" />
      <rect x="8" y="6" width="24" height="26" rx="1" fill="none" stroke="#bbb" strokeWidth="0.8" />
      <rect x="8" y="36" width="24" height="26" rx="1" fill="none" stroke="#bbb" strokeWidth="0.8" />
      <circle cx="28" cy="49" r="1.5" fill="#999" />
    </svg>
  )
}
function GlassDoorSvg() {
  return (
    <svg viewBox="0 0 40 72" className="w-full h-full">
      <rect x="4" y="2" width="32" height="68" rx="1" fill="#f0f0f0" stroke="#999" strokeWidth="1.2" />
      <rect x="8" y="6" width="24" height="50" rx="1" fill="#d8e8f0" stroke="#aac" strokeWidth="0.8" />
      <rect x="8" y="60" width="24" height="6" rx="0.5" fill="none" stroke="#bbb" strokeWidth="0.8" />
      <circle cx="28" cy="49" r="1.5" fill="#999" />
    </svg>
  )
}
function FrenchDoubleDoorSvg() {
  return (
    <svg viewBox="0 0 60 72" className="w-full h-full">
      <rect x="2" y="2" width="26" height="68" rx="1" fill="#f0f0f0" stroke="#999" strokeWidth="1.2" />
      <rect x="32" y="2" width="26" height="68" rx="1" fill="#f0f0f0" stroke="#999" strokeWidth="1.2" />
      {[8, 26, 44].map((y) => (
        <g key={`l${y}`}>
          <rect x="5" y={y} width="20" height="14" rx="0.5" fill="#d8e8f0" stroke="#aac" strokeWidth="0.6" />
          <rect x="35" y={y} width="20" height="14" rx="0.5" fill="#d8e8f0" stroke="#aac" strokeWidth="0.6" />
        </g>
      ))}
      <circle cx="25" cy="49" r="1.2" fill="#999" />
      <circle cx="35" cy="49" r="1.2" fill="#999" />
    </svg>
  )
}
function DoublePanelDoorSvg() {
  return (
    <svg viewBox="0 0 60 72" className="w-full h-full">
      <rect x="2" y="2" width="26" height="68" rx="1" fill="#f0f0f0" stroke="#999" strokeWidth="1.2" />
      <rect x="32" y="2" width="26" height="68" rx="1" fill="#f0f0f0" stroke="#999" strokeWidth="1.2" />
      <rect x="6" y="6" width="18" height="24" rx="0.5" fill="none" stroke="#bbb" strokeWidth="0.7" />
      <rect x="6" y="34" width="18" height="28" rx="0.5" fill="none" stroke="#bbb" strokeWidth="0.7" />
      <rect x="36" y="6" width="18" height="24" rx="0.5" fill="none" stroke="#bbb" strokeWidth="0.7" />
      <rect x="36" y="34" width="18" height="28" rx="0.5" fill="none" stroke="#bbb" strokeWidth="0.7" />
      <circle cx="25" cy="49" r="1.2" fill="#999" />
      <circle cx="35" cy="49" r="1.2" fill="#999" />
    </svg>
  )
}
function BifoldDoorSvg() {
  return (
    <svg viewBox="0 0 60 72" className="w-full h-full">
      {[2, 16, 30, 44].map((x, i) => (
        <g key={i}>
          <rect x={x} y="2" width="13" height="68" rx="0.5" fill="#f0f0f0" stroke="#999" strokeWidth="1" />
          <rect x={x + 2} y="6" width="9" height="56" rx="0.5" fill="none" stroke="#bbb" strokeWidth="0.6" />
        </g>
      ))}
    </svg>
  )
}
function GlassDoubleDoorSvg() {
  return (
    <svg viewBox="0 0 60 72" className="w-full h-full">
      <rect x="2" y="2" width="26" height="68" rx="1" fill="#f0f0f0" stroke="#999" strokeWidth="1.2" />
      <rect x="32" y="2" width="26" height="68" rx="1" fill="#f0f0f0" stroke="#999" strokeWidth="1.2" />
      <rect x="5" y="6" width="20" height="50" rx="0.5" fill="#d8e8f0" stroke="#aac" strokeWidth="0.7" />
      <rect x="35" y="6" width="20" height="50" rx="0.5" fill="#d8e8f0" stroke="#aac" strokeWidth="0.7" />
      <circle cx="25" cy="49" r="1.2" fill="#999" />
      <circle cx="35" cy="49" r="1.2" fill="#999" />
    </svg>
  )
}

/* ── SVG Window Illustrations ── */
function StandardWindowSvg() {
  return (
    <svg viewBox="0 0 48 40" className="w-full h-full">
      <rect x="2" y="2" width="44" height="36" rx="1" fill="#d8e8f0" stroke="#999" strokeWidth="1.2" />
      <line x1="24" y1="2" x2="24" y2="38" stroke="#999" strokeWidth="1" />
      <line x1="2" y1="20" x2="46" y2="20" stroke="#999" strokeWidth="0.7" />
      <rect x="3" y="36" width="42" height="3" rx="0.5" fill="#e8e0d0" stroke="#bbb" strokeWidth="0.5" />
    </svg>
  )
}
function LargeWindowSvg() {
  return (
    <svg viewBox="0 0 56 44" className="w-full h-full">
      <rect x="2" y="2" width="52" height="40" rx="1" fill="#d8e8f0" stroke="#999" strokeWidth="1.2" />
      <line x1="19" y1="2" x2="19" y2="42" stroke="#999" strokeWidth="0.8" />
      <line x1="37" y1="2" x2="37" y2="42" stroke="#999" strokeWidth="0.8" />
      <rect x="3" y="40" width="50" height="3" rx="0.5" fill="#e8e0d0" stroke="#bbb" strokeWidth="0.5" />
    </svg>
  )
}
function SmallWindowSvg() {
  return (
    <svg viewBox="0 0 36 32" className="w-full h-full">
      <rect x="4" y="2" width="28" height="28" rx="1" fill="#d8e8f0" stroke="#999" strokeWidth="1.2" />
      <line x1="18" y1="2" x2="18" y2="30" stroke="#999" strokeWidth="0.8" />
      <rect x="5" y="28" width="26" height="3" rx="0.5" fill="#e8e0d0" stroke="#bbb" strokeWidth="0.5" />
    </svg>
  )
}
function PictureWindowSvg() {
  return (
    <svg viewBox="0 0 60 36" className="w-full h-full">
      <rect x="2" y="2" width="56" height="32" rx="1" fill="#d8e8f0" stroke="#999" strokeWidth="1.2" />
      <rect x="3" y="32" width="54" height="3" rx="0.5" fill="#e8e0d0" stroke="#bbb" strokeWidth="0.5" />
    </svg>
  )
}

const DOOR_STYLES = [
  { id: 'single', name: 'Single Panel Door', width: 3, Svg: SinglePanelDoorSvg },
  { id: 'glass', name: 'Glass Door', width: 3, Svg: GlassDoorSvg },
  { id: 'french', name: 'French Double Door', width: 5, Svg: FrenchDoubleDoorSvg },
  { id: 'double', name: 'Double Panel Door', width: 5, Svg: DoublePanelDoorSvg },
  { id: 'bifold', name: 'Bifold Panel Door', width: 6, Svg: BifoldDoorSvg },
  { id: 'glass-double', name: 'Glass Double Door', width: 5, Svg: GlassDoubleDoorSvg },
]

const WINDOW_STYLES = [
  { id: 'standard', name: 'Standard Window', width: 4, height: 3, elevation: 3, Svg: StandardWindowSvg },
  { id: 'large', name: 'Large Window', width: 6, height: 4, elevation: 2.5, Svg: LargeWindowSvg },
  { id: 'small', name: 'Small Window', width: 2.5, height: 2.5, elevation: 3.5, Svg: SmallWindowSvg },
  { id: 'picture', name: 'Picture Window', width: 8, height: 5, elevation: 2.5, Svg: PictureWindowSvg },
]

const WALL_NAMES = ['back', 'left', 'right', 'front']
const WALL_LABELS = { back: 'Back', left: 'Left', right: 'Right', front: 'Front' }

function wallLength(wallName, width, depth) {
  return wallName === 'back' || wallName === 'front' ? width : depth
}

function StyleCard({ item, onClick }) {
  const Svg = item.Svg
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-1.5 rounded-md border border-gray-200 bg-white hover:border-gray-900 hover:bg-gray-50 transition-all text-left"
    >
      <div className="w-9 h-9 shrink-0 flex items-center justify-center">
        <Svg />
      </div>
      <span className="text-[9px] font-medium leading-tight text-gray-600">
        {item.name}
      </span>
    </button>
  )
}

function SliderField({ label, value, min, max, step, unit, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-500 w-14 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-gray-900 h-1"
      />
      <span className="text-[10px] text-gray-600 w-12 text-right">{value}{unit}</span>
    </div>
  )
}

function PlacedItem({ type, label, color, wall, wallLen, roomHeight, onUpdate, onRemove }) {
  return (
    <div className={`${color} rounded p-2 space-y-1.5`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium">{label}</span>
        <button onClick={onRemove} className="text-gray-400 hover:text-red-500">
          <Trash2 size={12} />
        </button>
      </div>
      {type === 'door' && wall.door && (
        <>
          <SliderField label="Position" value={wall.door.position} min={0.15} max={0.85} step={0.05} unit="" onChange={(v) => onUpdate({ ...wall, door: { ...wall.door, position: v } })} />
          <SliderField label="Width" value={wall.door.width} min={2} max={wallLen * 0.5} step={0.5} unit=" ft" onChange={(v) => onUpdate({ ...wall, door: { ...wall.door, width: v } })} />
        </>
      )}
      {type === 'window' && wall.window && (
        <>
          <SliderField label="Position" value={wall.window.position} min={0.15} max={0.85} step={0.05} unit="" onChange={(v) => onUpdate({ ...wall, window: { ...wall.window, position: v } })} />
          <SliderField label="Width" value={wall.window.width} min={2} max={wallLen * 0.8} step={0.5} unit=" ft" onChange={(v) => onUpdate({ ...wall, window: { ...wall.window, width: v } })} />
          <SliderField label="Height" value={wall.window.height} min={2} max={roomHeight * 0.6} step={0.5} unit=" ft" onChange={(v) => onUpdate({ ...wall, window: { ...wall.window, height: v } })} />
          <SliderField label="Elevation" value={wall.window.elevation} min={1} max={roomHeight - wall.window.height - 1} step={0.5} unit=" ft" onChange={(v) => onUpdate({ ...wall, window: { ...wall.window, elevation: v } })} />
        </>
      )}
    </div>
  )
}

export default function DoorsWindowsStep({ walls, width, depth, height, onUpdateWall }) {
  const [activeWall, setActiveWall] = useState('back')

  const wall = walls[activeWall]
  const wallLen = wallLength(activeWall, width, depth)

  function addDoor(styleId) {
    if (!wall.exists) return
    const style = DOOR_STYLES.find((s) => s.id === styleId)
    const dw = Math.min(style.width, wallLen * 0.5)
    const { window: _, ...rest } = wall
    onUpdateWall(activeWall, { ...rest, door: { position: 0.5, width: dw, style: styleId } })
  }

  function addWindow(styleId) {
    if (!wall.exists) return
    const style = WINDOW_STYLES.find((s) => s.id === styleId)
    const ww = Math.min(style.width, wallLen * 0.8)
    const { door: _, ...rest } = wall
    onUpdateWall(activeWall, { ...rest, window: { position: 0.5, width: ww, height: style.height, elevation: style.elevation, style: styleId } })
  }

  function removeDoor() {
    const { door: _, ...rest } = wall
    onUpdateWall(activeWall, rest)
  }

  function removeWindow() {
    const { window: _, ...rest } = wall
    onUpdateWall(activeWall, rest)
  }

  function toggleExists() {
    onUpdateWall(activeWall, { ...wall, exists: !wall.exists })
  }

  return (
    <div className="space-y-3 pb-2">
      {/* Wall selector */}
      <div>
        <h4 className="text-xs font-bold text-gray-900 mb-2">Select wall</h4>
        <div className="flex gap-1.5">
          {WALL_NAMES.map((name) => (
            <button
              key={name}
              onClick={() => setActiveWall(name)}
              className={`flex-1 py-1.5 text-[10px] font-semibold rounded-md transition-colors ${
                activeWall === name
                  ? 'bg-gray-900 text-white'
                  : walls[name].exists
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-300'
              }`}
            >
              {WALL_LABELS[name]}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-gray-500">{WALL_LABELS[activeWall]} wall &middot; {wallLen} ft</span>
          <button
            onClick={toggleExists}
            className={`px-2.5 py-0.5 text-[10px] rounded font-medium transition-colors ${
              wall.exists ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {wall.exists ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {wall.exists && (
        <>
          {/* Currently placed */}
          {(wall.door || wall.window) && (
            <div className="space-y-1.5">
              {wall.door && (
                <PlacedItem
                  type="door"
                  label={DOOR_STYLES.find((s) => s.id === wall.door.style)?.name || 'Door'}
                  color="bg-amber-50 text-amber-800"
                  wall={wall}
                  wallLen={wallLen}
                  roomHeight={height}
                  onUpdate={(w) => onUpdateWall(activeWall, w)}
                  onRemove={removeDoor}
                />
              )}
              {wall.window && (
                <PlacedItem
                  type="window"
                  label={WINDOW_STYLES.find((s) => s.id === wall.window.style)?.name || 'Window'}
                  color="bg-blue-50 text-blue-800"
                  wall={wall}
                  wallLen={wallLen}
                  roomHeight={height}
                  onUpdate={(w) => onUpdateWall(activeWall, w)}
                  onRemove={removeWindow}
                />
              )}
            </div>
          )}

          {/* Door styles */}
          {!wall.door && (
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-2">Door styles</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {DOOR_STYLES.map((d) => (
                  <StyleCard key={d.id} item={d} onClick={() => addDoor(d.id)} />
                ))}
              </div>
            </div>
          )}

          {/* Window styles */}
          {!wall.window && (
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-2">Window styles</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {WINDOW_STYLES.map((w) => (
                  <StyleCard key={w.id} item={w} onClick={() => addWindow(w.id)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!wall.exists && (
        <p className="text-xs text-gray-400 text-center py-4">This wall is turned off. Toggle it on to add doors or windows.</p>
      )}
    </div>
  )
}
