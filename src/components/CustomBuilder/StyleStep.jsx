const WALL_COLORS = [
  '#FFFFFF', '#FAFAFA', '#F5F0EB', '#F0EDE8', '#E8E0D0',
  '#D4C4A8', '#C8A882', '#8B7355', '#5C4A3A', '#3D3530',
  '#8CA0A8', '#A0B4BC', '#B8C8D0', '#6B8E8E', '#4A6B6B',
  '#E8D4D4', '#D4B8B8', '#C4A0A0', '#D4D4E8', '#B8B8D4',
  '#FFF8E8', '#FFE0B0', '#FFD080', '#E8D8C0', '#D4C8B0',
]

const FLOOR_PRESETS = [
  { name: 'Light Wood', color: '#D4C4A8' },
  { name: 'Natural Wood', color: '#C8A870' },
  { name: 'Medium Wood', color: '#A07840' },
  { name: 'Honey Oak', color: '#C4A882' },
  { name: 'Dark Walnut', color: '#5C4020' },
  { name: 'Rich Walnut', color: '#8B6914' },
  { name: 'Cherry', color: '#8B4513' },
  { name: 'Ebony', color: '#3C2415' },
  { name: 'Ash', color: '#E0D4C0' },
  { name: 'Bamboo', color: '#D4B896' },
  { name: 'White Marble', color: '#F0EEEC' },
  { name: 'Cream Marble', color: '#E8E4E0' },
  { name: 'Light Concrete', color: '#C0C0C0' },
  { name: 'Dark Concrete', color: '#808080' },
  { name: 'Slate', color: '#707070' },
]

export default function StyleStep({ wallColor, floorColor, onChangeWallColor, onChangeFloorColor }) {
  return (
    <div className="space-y-6">
      {/* Wall colors */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 mb-3">Wall Color</h4>
        <div className="grid grid-cols-5 gap-2">
          {WALL_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => onChangeWallColor(c)}
              className={`w-full aspect-square rounded-lg border-2 transition-all ${
                wallColor === c ? 'border-gray-900 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-gray-400">Custom:</span>
          <input
            type="color"
            value={wallColor}
            onChange={(e) => onChangeWallColor(e.target.value)}
            className="w-7 h-6 rounded cursor-pointer border border-gray-300"
          />
          <span className="text-[10px] text-gray-500">{wallColor}</span>
        </div>
      </div>

      {/* Floor style */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 mb-1">Floor Style</h4>
        <p className="text-[10px] text-gray-400 mb-3">Material is auto-detected from color (wood / marble / concrete).</p>
        <div className="grid grid-cols-5 gap-2">
          {FLOOR_PRESETS.map((f) => (
            <button
              key={f.color}
              onClick={() => onChangeFloorColor(f.color)}
              className={`flex flex-col items-center gap-1 group`}
              title={f.name}
            >
              <div
                className={`w-full aspect-square rounded-lg border-2 transition-all ${
                  floorColor === f.color ? 'border-gray-900 scale-110 shadow-md' : 'border-gray-200 group-hover:border-gray-400'
                }`}
                style={{ backgroundColor: f.color }}
              />
              <span className="text-[8px] text-gray-500 leading-tight text-center truncate w-full">
                {f.name}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-gray-400">Custom:</span>
          <input
            type="color"
            value={floorColor}
            onChange={(e) => onChangeFloorColor(e.target.value)}
            className="w-7 h-6 rounded cursor-pointer border border-gray-300"
          />
          <span className="text-[10px] text-gray-500">{floorColor}</span>
        </div>
      </div>
    </div>
  )
}
