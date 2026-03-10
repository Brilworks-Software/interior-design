import { Canvas } from '@react-three/fiber'

function MiniRoom({ room }) {
  const { width, depth, height, floorColor, wallColor } = room
  const hw = width / 2
  const hd = depth / 2

  return (
    <>
      {/* Ambient + directional light */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 10, 8]} intensity={0.8} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, height / 2, -hd]} receiveShadow>
        <boxGeometry args={[width, height, 0.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-hw, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, height, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right wall */}
      <mesh position={[hw, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, height, depth]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
    </>
  )
}

export default function RoomCard({ room, onSelect }) {
  const scale = Math.max(room.width, room.depth)
  const camDist = scale * 0.9

  return (
    <div
      onClick={() => onSelect(room)}
      className="group cursor-pointer rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-amber-400 transition-all duration-200"
    >
      {/* 3D Mini Preview */}
      <div style={{ height: 180 }} className="bg-gray-100">
        <Canvas
          camera={{
            position: [camDist * 0.7, camDist * 0.6, camDist * 0.7],
            fov: 45,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <MiniRoom room={room} />
        </Canvas>
      </div>

      {/* Card Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight">{room.name}</h3>
          <span className="text-xs text-gray-500 ml-2 shrink-0">{room.sqft} sq.ft</span>
        </div>
        <div className="mt-2 flex gap-2 items-center">
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: room.wallColor }}
            title="Wall color"
          />
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: room.floorColor }}
            title="Floor color"
          />
          <span className="text-xs text-gray-400 capitalize ml-1">{room.style}</span>
        </div>
      </div>
    </div>
  )
}
