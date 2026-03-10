import { memo } from 'react'

export default memo(function Desk({ color = '#B89060' }) {
  const legColor = '#8B6A40'
  return (
    <group>
      {/* Desktop */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 0.15, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      {/* Modesty panel */}
      <mesh position={[0, 1.45, -1.1]} castShadow>
        <boxGeometry args={[4.6, 1.8, 0.1]} />
        <meshStandardMaterial color={legColor} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-2.3, -1.1], [-2.3, 1.1], [2.3, -1.1], [2.3, 1.1]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.2, z]} castShadow>
          <boxGeometry args={[0.15, 2.4, 0.15]} />
          <meshStandardMaterial color={legColor} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
})
