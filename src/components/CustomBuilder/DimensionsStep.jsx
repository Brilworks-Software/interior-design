import { useState } from 'react'

function SliderField({ label, value, min, max, step, unit, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-12 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-gray-900 h-1.5"
      />
      <span className="text-xs font-medium text-gray-700 w-14 text-right">{value} {unit}</span>
    </div>
  )
}

function FloorPlan({ width, depth, unit }) {
  const padding = 40
  const maxSvgW = 240
  const maxSvgH = 180
  const scale = Math.min((maxSvgW - padding * 2) / width, (maxSvgH - padding * 2) / depth)
  const rw = width * scale
  const rd = depth * scale
  const svgW = rw + padding * 2
  const svgH = rd + padding * 2
  const rx = padding
  const ry = padding

  const formatDim = (v) => {
    if (unit === 'cm') return `${Math.round(v * 30.48)} cm`
    const ft = Math.floor(v)
    const inches = Math.round((v - ft) * 12)
    return inches > 0 ? `${ft}' ${inches}"` : `${ft}'`
  }

  return (
    <svg width={svgW} height={svgH} className="mx-auto">
      {/* Room outline */}
      <rect
        x={rx}
        y={ry}
        width={rw}
        height={rd}
        fill="#F5F0EB"
        stroke="#333"
        strokeWidth="2"
      />

      {/* Grid lines */}
      {Array.from({ length: Math.floor(width) - 1 }, (_, i) => (
        <line
          key={`vg${i}`}
          x1={rx + (i + 1) * scale}
          y1={ry}
          x2={rx + (i + 1) * scale}
          y2={ry + rd}
          stroke="#ddd"
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: Math.floor(depth) - 1 }, (_, i) => (
        <line
          key={`hg${i}`}
          x1={rx}
          y1={ry + (i + 1) * scale}
          x2={rx + rw}
          y2={ry + (i + 1) * scale}
          stroke="#ddd"
          strokeWidth="0.5"
        />
      ))}

      {/* Width dimension (top) */}
      <line x1={rx} y1={ry - 12} x2={rx + rw} y2={ry - 12} stroke="#666" strokeWidth="1" />
      <line x1={rx} y1={ry - 18} x2={rx} y2={ry - 6} stroke="#666" strokeWidth="1" />
      <line x1={rx + rw} y1={ry - 18} x2={rx + rw} y2={ry - 6} stroke="#666" strokeWidth="1" />
      <text x={rx + rw / 2} y={ry - 20} textAnchor="middle" className="text-[10px] fill-gray-600 font-medium">
        {formatDim(width)}
      </text>

      {/* Depth dimension (right) */}
      <line x1={rx + rw + 12} y1={ry} x2={rx + rw + 12} y2={ry + rd} stroke="#666" strokeWidth="1" />
      <line x1={rx + rw + 6} y1={ry} x2={rx + rw + 18} y2={ry} stroke="#666" strokeWidth="1" />
      <line x1={rx + rw + 6} y1={ry + rd} x2={rx + rw + 18} y2={ry + rd} stroke="#666" strokeWidth="1" />
      <text
        x={rx + rw + 24}
        y={ry + rd / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(90, ${rx + rw + 24}, ${ry + rd / 2})`}
        className="text-[10px] fill-gray-600 font-medium"
      >
        {formatDim(depth)}
      </text>

      {/* Area label */}
      <text x={rx + rw / 2} y={ry + rd / 2} textAnchor="middle" dominantBaseline="middle" className="text-[11px] fill-gray-400 font-medium">
        {Math.round(width * depth)} {unit === 'cm' ? 'sq m' : 'sqft'}
      </text>
    </svg>
  )
}

export default function DimensionsStep({ width, depth, height, onChangeWidth, onChangeDepth, onChangeHeight }) {
  const [unit, setUnit] = useState('ft')

  return (
    <div className="space-y-6">
      <p className="text-xs text-gray-500">
        Edit the floor plan on the right to match your room's wall dimensions.
      </p>

      {/* 2D Floor Plan */}
      <div className="bg-gray-50 rounded-xl p-3">
        <FloorPlan width={width} depth={depth} unit={unit} />
      </div>

      {/* Unit toggle */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5 w-fit">
        <button
          onClick={() => setUnit('ft')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            unit === 'ft' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          Feet
        </button>
        <button
          onClick={() => setUnit('cm')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            unit === 'cm' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
          }`}
        >
          Centimeters
        </button>
      </div>

      {/* Dimension sliders */}
      <div className="space-y-3">
        <SliderField label="Width" value={width} min={10} max={35} step={1} unit="ft" onChange={onChangeWidth} />
        <SliderField label="Depth" value={depth} min={8} max={25} step={1} unit="ft" onChange={onChangeDepth} />
        <SliderField label="Height" value={height} min={8} max={14} step={0.5} unit="ft" onChange={onChangeHeight} />
      </div>
    </div>
  )
}
