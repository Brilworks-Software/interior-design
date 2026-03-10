import { memo } from 'react'

export default memo(function Bookshelf({ color = '#A07840' }) {
  const shelves = 5
  const totalH = 7.5
  const shelfSpacing = totalH / shelves
  // Random-ish book colors for visual interest
  const bookColors = ['#8B0000', '#1C3A5A', '#2F4F2F', '#5A3A00', '#4A0A5A', '#8B4A00', '#1A4A4A']

  return (
    <group>
      {/* Left panel */}
      <mesh position={[-1.65, totalH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, totalH, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Right panel */}
      <mesh position={[1.65, totalH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, totalH, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Back panel */}
      <mesh position={[0, totalH / 2, -0.45]} castShadow receiveShadow>
        <boxGeometry args={[3.3, totalH, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Top */}
      <mesh position={[0, totalH - 0.06, 0]} castShadow>
        <boxGeometry args={[3.42, 0.12, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Shelves + books */}
      {Array.from({ length: shelves }).map((_, i) => {
        const y = shelfSpacing * i + 0.06
        return (
          <group key={i}>
            <mesh position={[0, y, 0]} receiveShadow>
              <boxGeometry args={[3.3, 0.1, 1.0]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Books on shelf */}
            {i < shelves - 1 && Array.from({ length: 7 }).map((_, j) => (
              <mesh key={j} position={[-1.35 + j * 0.42, y + 0.38, -0.1]} castShadow>
                <boxGeometry args={[0.28, 0.55, 0.7]} />
                <meshStandardMaterial color={bookColors[(i * 3 + j) % bookColors.length]} roughness={0.9} />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
})
