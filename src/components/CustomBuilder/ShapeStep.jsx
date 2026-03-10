const SHAPES = [
  {
    id: 'rectangular',
    name: 'Rectangular',
    available: true,
    icon: (active) => (
      <svg viewBox="0 0 80 60" className="w-full h-full">
        <rect x="10" y="8" width="60" height="44" fill="none" stroke={active ? '#000' : '#999'} strokeWidth={active ? 2.5 : 1.5} rx="1" />
      </svg>
    ),
  },
  {
    id: 'l-shape',
    name: 'L-Shape',
    available: false,
    icon: (active) => (
      <svg viewBox="0 0 80 60" className="w-full h-full">
        <path d="M10 8 H50 V32 H30 V52 H10 Z" fill="none" stroke={active ? '#000' : '#999'} strokeWidth={active ? 2.5 : 1.5} />
      </svg>
    ),
  },
  {
    id: 'cut',
    name: 'Cut',
    available: false,
    icon: (active) => (
      <svg viewBox="0 0 80 60" className="w-full h-full">
        <path d="M10 8 H70 V52 H10 V32 H30 V28 H10 Z" fill="none" stroke={active ? '#000' : '#999'} strokeWidth={active ? 2.5 : 1.5} />
      </svg>
    ),
  },
  {
    id: 't-shape',
    name: 'T-Shape',
    available: false,
    icon: (active) => (
      <svg viewBox="0 0 80 60" className="w-full h-full">
        <path d="M10 8 H70 V24 H50 V52 H30 V24 H10 Z" fill="none" stroke={active ? '#000' : '#999'} strokeWidth={active ? 2.5 : 1.5} />
      </svg>
    ),
  },
]

export default function ShapeStep({ shape, onChange }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {SHAPES.map((s) => {
          const active = shape === s.id
          return (
            <button
              key={s.id}
              onClick={() => s.available && onChange(s.id)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                active
                  ? 'border-gray-900 bg-white shadow-sm'
                  : s.available
                    ? 'border-gray-200 bg-white hover:border-gray-400'
                    : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="w-16 h-12">{s.icon(active)}</div>
              <span className={`text-xs font-semibold ${active ? 'text-gray-900' : 'text-gray-500'}`}>
                {s.name}
              </span>
              {!s.available && (
                <span className="absolute top-1.5 right-1.5 text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
