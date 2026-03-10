import { useRef } from 'react'
import useDesignerStore from '../../../store/useDesignerStore'
import { furnitureCatalog } from '../../../data/furnitureCatalog'
import { Trash2, Copy } from 'lucide-react'

function RoomPanel() {
  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200" style={{ width: 260 }}>
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Properties</h2>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <p className="text-xs text-gray-400 text-center">Select a furniture item to edit its properties.</p>
      </div>
    </div>
  )
}

export default function PropertiesPanel() {
  const objects = useDesignerStore((s) => s.objects)
  const selectedObjectId = useDesignerStore((s) => s.selectedObjectId)
  const updateObject = useDesignerStore((s) => s.updateObject)
  const updateObjectLive = useDesignerStore((s) => s.updateObjectLive)
  const removeObject = useDesignerStore((s) => s.removeObject)
  const copyObject = useDesignerStore((s) => s.copyObject)
  const pasteObject = useDesignerStore((s) => s.pasteObject)
  // Refs must be declared before any early returns (Rules of Hooks)
  const rotDraftRef = useRef(0)
  const scaleDraftRef = useRef(1)

  const obj = objects.find((o) => o.id === selectedObjectId)
  if (!obj) {
    return <RoomPanel />
  }

  const catalogItem = furnitureCatalog.find((f) => f.id === obj.furnitureId)
  // Keep refs in sync with current object so onPointerUp always commits the latest value
  rotDraftRef.current = obj.rotation
  scaleDraftRef.current = obj.scale

  function handleDelete() {
    removeObject(obj.id)
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200" style={{ width: 260 }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Properties</h2>
          <p className="text-xs text-gray-500 mt-0.5">{catalogItem?.name ?? obj.furnitureId}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { copyObject(obj.id); pasteObject() }}
            className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded transition-colors"
            title="Duplicate (Cmd+D)"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Rotation */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-gray-600">Rotation</label>
            <span className="text-xs text-gray-400">{Math.round(obj.rotation)}°</span>
          </div>
          <div className="flex gap-1.5 mb-2">
            {[0, 90, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => updateObject(obj.id, { rotation: deg })}
                className={`flex-1 py-1.5 text-xs rounded transition-colors ${
                  obj.rotation === deg
                    ? 'bg-amber-500 text-white font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-600'
                }`}
              >
                {deg}°
              </button>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={obj.rotation}
            onChange={(e) => {
              const val = Number(e.target.value)
              rotDraftRef.current = val
              updateObjectLive(obj.id, { rotation: val })
            }}
            onPointerUp={() => updateObject(obj.id, { rotation: rotDraftRef.current })}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Scale */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-gray-600">Scale</label>
            <span className="text-xs text-gray-400">{obj.scale.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min={catalogItem?.minScale ?? 0.5}
            max={catalogItem?.maxScale ?? 2.0}
            step={0.05}
            value={obj.scale}
            onChange={(e) => {
              const val = Number(e.target.value)
              scaleDraftRef.current = val
              updateObjectLive(obj.id, { scale: val })
            }}
            onPointerUp={() => updateObject(obj.id, { scale: scaleDraftRef.current })}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">{catalogItem?.minScale ?? 0.5}x</span>
            <button
              onClick={() => updateObject(obj.id, { scale: 1 })}
              className="text-xs text-gray-500 hover:text-amber-600"
            >
              Reset
            </button>
            <span className="text-xs text-gray-400">{catalogItem?.maxScale ?? 2.0}x</span>
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">Color</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(catalogItem?.colorOptions ?? [obj.color]).map((c) => (
              <button
                key={c}
                onClick={() => updateObject(obj.id, { color: c })}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  obj.color === c ? 'border-amber-500 scale-110' : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
          {/* Custom color picker */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Custom:</label>
            <input
              type="color"
              value={obj.color}
              onChange={(e) => updateObject(obj.id, { color: e.target.value })}
              className="w-8 h-7 rounded cursor-pointer border border-gray-300"
            />
            <span className="text-xs text-gray-400 font-mono">{obj.color}</span>
          </div>
        </div>

        {/* Position info */}
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-2">Position</label>
          <div className="bg-gray-50 rounded px-3 py-2 text-xs text-gray-500 font-mono space-y-1">
            <div>X: {obj.position[0].toFixed(1)}</div>
            <div>Z: {obj.position[2].toFixed(1)}</div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Drag the object in the viewport to reposition</p>
        </div>
      </div>
    </div>
  )
}
