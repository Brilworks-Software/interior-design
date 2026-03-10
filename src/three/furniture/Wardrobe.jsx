import { memo } from 'react'

export default memo(function Wardrobe({ color = '#D4C4A8' }) {
  const dark = '#8B7A60'
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 4.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 8.0, 2.0]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      {/* Door divider */}
      <mesh position={[0, 4.0, 1.01]}>
        <boxGeometry args={[0.08, 7.9, 0.05]} />
        <meshStandardMaterial color={dark} roughness={0.6} />
      </mesh>
      {/* Door panels (slightly raised) */}
      {[-1.28, 1.28].map((x, i) => (
        <mesh key={i} position={[x, 4.0, 1.02]}>
          <boxGeometry args={[2.3, 7.0, 0.04]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
      {/* Handles */}
      {[[-0.5, 4.0], [0.5, 4.0]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 1.08]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
          <meshStandardMaterial color="#999" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
      {/* Top cornice */}
      <mesh position={[0, 8.1, 0]} castShadow>
        <boxGeometry args={[5.2, 0.2, 2.2]} />
        <meshStandardMaterial color={dark} roughness={0.6} />
      </mesh>
    </group>
  )
})
