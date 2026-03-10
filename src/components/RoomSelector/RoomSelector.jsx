import { rooms } from '../../data/rooms'
import { demoBedroom, demoLivingRoom } from '../../data/demoDesigns'
import RoomCard from './RoomCard'
import useDesignerStore from '../../store/useDesignerStore'
import { Plus } from 'lucide-react'

export default function RoomSelector() {
  const setRoom = useDesignerStore((s) => s.setRoom)
  const loadDemo = useDesignerStore((s) => s.loadDemo)
  const goToCustom = useDesignerStore((s) => s.goToCustom)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">3D</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">3D Room Designer</h1>
            <p className="text-sm text-gray-500">Choose a room to start designing</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadDemo(demoBedroom)}
            className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
          >
            Demo Bedroom
          </button>
          <button
            onClick={() => loadDemo(demoLivingRoom)}
            className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
          >
            Demo Living Room
          </button>
        </div>
      </header>

      {/* Room grid */}
      <main className="flex-1 overflow-auto px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Select a Room</h2>
            <p className="text-gray-500 mt-1">
              Pick one of our preset rooms to begin — you can furnish and customise it from there.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <button
              onClick={goToCustom}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-amber-400 hover:bg-amber-50 transition-all p-6 min-h-[140px]"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Plus size={20} className="text-amber-600" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-700">Custom Room</div>
                <div className="text-xs text-gray-400 mt-0.5">Set shape, dimensions, doors & windows</div>
              </div>
            </button>
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onSelect={setRoom} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
