import useDesignerStore from '../../store/useDesignerStore'

const WALL_PRESETS = [
  { label: 'Off-white',  color: '#F5F0EB' },
  { label: 'Pure White', color: '#FFFFFF' },
  { label: 'Warm Beige', color: '#C8A882' },
  { label: 'Light Gray', color: '#E0DCDA' },
  { label: 'Cool Gray',  color: '#B0B8C0' },
  { label: 'Sage Green', color: '#8CA89A' },
  { label: 'Dark Slate', color: '#3D3530' },
  { label: 'Navy',       color: '#2A3A5A' },
  { label: 'Dusty Rose', color: '#C4958A' },
  { label: 'Terracotta', color: '#C47A5A' },
]

const FLOOR_PRESETS = [
  { label: 'Light Wood', color: '#C4A882' },
  { label: 'Dark Wood',  color: '#5C4020' },
  { label: 'Concrete',   color: '#9A9890' },
  { label: 'Marble',     color: '#E8E8E0' },
]

export default function RoomCustomPanel({ onClose }) {
  const selectedRoom = useDesignerStore((s) => s.selectedRoom)
  const roomWallColor = useDesignerStore((s) => s.roomWallColor)
  const roomFloorColor = useDesignerStore((s) => s.roomFloorColor)
  const setWallColor = useDesignerStore((s) => s.setWallColor)
  const setFloorColor = useDesignerStore((s) => s.setFloorColor)

  const activeWall = roomWallColor ?? selectedRoom?.wallColor
  const activeFloor = roomFloorColor ?? selectedRoom?.floorColor

  return (
    <div className="absolute bottom-14 right-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Customise Room</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
      </div>

      <div className="px-4 py-4 space-y-5 max-h-96 overflow-y-auto">
        {/* Wall Color */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Wall Color</label>
            <span className="text-xs font-mono text-gray-400">{activeWall}</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {WALL_PRESETS.map((p) => (
              <button
                key={p.color}
                onClick={() => setWallColor(p.color)}
                title={p.label}
                className={`w-full aspect-square rounded border-2 transition-all ${
                  activeWall === p.color ? 'border-amber-500 scale-110' : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: p.color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Custom:</label>
            <input
              type="color"
              value={activeWall}
              onChange={(e) => setWallColor(e.target.value)}
              className="w-8 h-7 rounded cursor-pointer border border-gray-300"
            />
            <button
              onClick={() => setWallColor(selectedRoom?.wallColor)}
              className="text-xs text-gray-400 hover:text-amber-600 ml-auto"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Floor Material */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">Floor</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {FLOOR_PRESETS.map((p) => (
              <button
                key={p.color}
                onClick={() => setFloorColor(p.color)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-left ${
                  activeFloor === p.color ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span
                  className="w-5 h-5 rounded flex-shrink-0 border border-gray-300"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-xs font-medium text-gray-700">{p.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Custom:</label>
            <input
              type="color"
              value={activeFloor}
              onChange={(e) => setFloorColor(e.target.value)}
              className="w-8 h-7 rounded cursor-pointer border border-gray-300"
            />
            <button
              onClick={() => setFloorColor(selectedRoom?.floorColor)}
              className="text-xs text-gray-400 hover:text-amber-600 ml-auto"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
