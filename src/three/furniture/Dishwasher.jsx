import { memo } from 'react'

export default memo(function Dishwasher({ color = '#C0C0C0' }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2.7, 2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Front door panel */}
      <mesh position={[0, 1.35, 1.01]}>
        <boxGeometry args={[1.8, 2.4, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.3} />
      </mesh>
      {/* Control strip */}
      <mesh position={[0, 2.55, 1.03]}>
        <boxGeometry args={[1.6, 0.2, 0.02]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 2.3, 1.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
        <meshStandardMaterial color="#999" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  )
})
