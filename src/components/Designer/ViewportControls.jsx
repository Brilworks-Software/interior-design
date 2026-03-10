import { useState, useEffect, useRef } from 'react'
import useDesignerStore from '../../store/useDesignerStore'
import RoomCustomPanel from './RoomCustomPanel'
import { LIGHTING_PRESETS } from '../../data/lightingPresets'

const flatViews = ['dollhouse', 'top']
const sideViews = [
  { id: 'front',      label: 'Front' },
  { id: 'back',       label: 'Back'  },
  { id: 'side-left',  label: 'Left'  },
  { id: 'side-right', label: 'Right' },
]

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
  )
}

export default function ViewportControls() {
  const viewMode = useDesignerStore((s) => s.viewMode)
  const setViewMode = useDesignerStore((s) => s.setViewMode)
  const gridSnap = useDesignerStore((s) => s.gridSnap)
  const toggleGridSnap = useDesignerStore((s) => s.toggleGridSnap)
  const gridSize = useDesignerStore((s) => s.gridSize)
  const setGridSize = useDesignerStore((s) => s.setGridSize)
  const wallSnap = useDesignerStore((s) => s.wallSnap)
  const toggleWallSnap = useDesignerStore((s) => s.toggleWallSnap)
  const showRoomDimensions = useDesignerStore((s) => s.showRoomDimensions)
  const showProductDimensions = useDesignerStore((s) => s.showProductDimensions)
  const measureUnit = useDesignerStore((s) => s.measureUnit)
  const toggleRoomDimensions = useDesignerStore((s) => s.toggleRoomDimensions)
  const toggleProductDimensions = useDesignerStore((s) => s.toggleProductDimensions)
  const setMeasureUnit = useDesignerStore((s) => s.setMeasureUnit)

  const lightingMode = useDesignerStore((s) => s.lightingMode)
  const setLightingMode = useDesignerStore((s) => s.setLightingMode)
  const realisticMode = useDesignerStore((s) => s.realisticMode)
  const toggleRealisticMode = useDesignerStore((s) => s.toggleRealisticMode)

  // Single open panel — ensures mutual exclusivity
  const [openPanel, setOpenPanel] = useState(null) // 'measure' | 'room' | 'lighting' | 'grid' | null
  const containerRef = useRef()
  const anyMeasure = showRoomDimensions || showProductDimensions

  function togglePanel(name) {
    setOpenPanel((cur) => (cur === name ? null : name))
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenPanel(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="absolute bottom-4 left-1/2 -translate-x-1/2">
      {/* Room customise popover */}
      {openPanel === 'room' && <RoomCustomPanel onClose={() => setOpenPanel(null)} />}

      {/* Side view popover */}
      {openPanel === 'side' && (
        <div className="absolute bottom-12 left-0 w-44 bg-white rounded-xl shadow-xl border border-gray-100 p-3 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Side View</p>
          <div className="grid grid-cols-2 gap-1.5">
            {sideViews.map((v) => (
              <button
                key={v.id}
                onClick={() => { setViewMode(v.id); setOpenPanel(null) }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                  viewMode === v.id
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid popover */}
      {openPanel === 'grid' && (
        <div className="absolute bottom-12 left-0 w-52 bg-white rounded-xl shadow-xl border border-gray-100 p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Grid Snap</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Enabled</span>
            <Toggle checked={gridSnap} onChange={toggleGridSnap} />
          </div>
          {gridSnap && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Grid size</p>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
                {[0.25, 0.5, 1].map((size) => (
                  <button
                    key={size}
                    onClick={() => setGridSize(size)}
                    className={`flex-1 py-1.5 transition-colors ${
                      gridSize === size ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {size === 0.25 ? '¼ ft' : size === 0.5 ? '½ ft' : '1 ft'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lighting popover */}
      {openPanel === 'lighting' && (
        <div className="absolute bottom-12 right-0 w-60 bg-white rounded-xl shadow-xl border border-gray-100 p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lighting Mood</p>

          {/* Off toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Enhanced lighting</span>
            <Toggle
              checked={lightingMode !== 'off'}
              onChange={() => setLightingMode(lightingMode === 'off' ? 'bright' : 'off')}
            />
          </div>

          {/* Mood buttons — only when on */}
          {lightingMode !== 'off' && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {Object.entries(LIGHTING_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setLightingMode(key)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                    lightingMode === key
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Measure popover */}
      {openPanel === 'measure' && (
        <div className="absolute bottom-12 right-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Room dimensions</span>
            <Toggle checked={showRoomDimensions} onChange={toggleRoomDimensions} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Product dimensions</span>
            <Toggle checked={showProductDimensions} onChange={toggleProductDimensions} />
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700">Unit</span>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
              <button
                onClick={() => setMeasureUnit('ft')}
                className={`px-3 py-1 transition-colors ${measureUnit === 'ft' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                ft
              </button>
              <button
                onClick={() => setMeasureUnit('cm')}
                className={`px-3 py-1 transition-colors ${measureUnit === 'cm' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                cm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pill bar */}
      <div className="flex gap-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-1 py-1 shadow-lg">
        {flatViews.map((id) => (
          <button
            key={id}
            onClick={() => setViewMode(id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-all capitalize ${
              viewMode === id
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {id}
          </button>
        ))}
        <button
          onClick={() => togglePanel('side')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
            openPanel === 'side' || sideViews.some((v) => v.id === viewMode)
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {sideViews.find((v) => v.id === viewMode)?.label ?? 'Side'}
        </button>

        <div className="w-px bg-gray-200 mx-1 self-stretch" />

        <button
          onClick={() => togglePanel('grid')}
          title="Grid Snap"
          className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
            openPanel === 'grid' || gridSnap ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Grid{gridSnap ? ` · ${gridSize === 0.25 ? '¼' : gridSize === 0.5 ? '½' : '1'} ft` : ''}
        </button>

        <button
          onClick={toggleWallSnap}
          title="Snap to Wall"
          className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
            wallSnap ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Wall
        </button>

        <div className="w-px bg-gray-200 mx-1 self-stretch" />

        <button
          onClick={() => togglePanel('measure')}
          title="Measurements"
          className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
            openPanel === 'measure' || anyMeasure ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Measure
        </button>

        <button
          onClick={() => togglePanel('room')}
          title="Customise Room"
          className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
            openPanel === 'room' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Room
        </button>

        <button
          onClick={() => togglePanel('lighting')}
          title="Lighting Mood"
          className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
            openPanel === 'lighting' || lightingMode !== 'off' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Lighting
        </button>

        <div className="w-px bg-gray-200 mx-1 self-stretch" />

        <button
          onClick={toggleRealisticMode}
          title="Toggle Realistic 3D Models"
          className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
            realisticMode ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Realistic
        </button>
      </div>
    </div>
  )
}
