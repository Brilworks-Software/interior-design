import { memo } from 'react'

export default memo(function DiningChair({ color = '#9B8870' }) {
  const wood = '#6B4A2A'
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.12, 1.6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Back slats */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 2.4, -0.74]} castShadow receiveShadow>
          <boxGeometry args={[0.22, 1.6, 0.08]} />
          <meshStandardMaterial color={wood} roughness={0.6} />
        </mesh>
      ))}
      {/* Top rail */}
      <mesh position={[0, 3.15, -0.74]} castShadow>
        <boxGeometry args={[1.6, 0.16, 0.1]} />
        <meshStandardMaterial color={wood} roughness={0.6} />
      </mesh>
      {/* Legs */}
      {[[-0.65, -0.65], [-0.65, 0.65], [0.65, -0.65], [0.65, 0.65]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.75, z]} castShadow>
          <boxGeometry args={[0.1, 1.5, 0.1]} />
          <meshStandardMaterial color={wood} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
})
