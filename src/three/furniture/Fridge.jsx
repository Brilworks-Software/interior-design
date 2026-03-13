import { memo } from 'react'

export default memo(function Fridge({ color = '#C0C0C0' }) {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 7, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Door split line */}
      <mesh position={[0, 4.8, 1.26]}>
        <boxGeometry args={[2.3, 0.06, 0.02]} />
        <meshStandardMaterial color="#666" roughness={0.5} />
      </mesh>
      {/* Upper door panel */}
      <mesh position={[0, 5.8, 1.26]}>
        <boxGeometry args={[2.3, 1.8, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.3} />
      </mesh>
      {/* Lower door panel */}
      <mesh position={[0, 3.0, 1.26]}>
        <boxGeometry args={[2.3, 3.4, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.3} />
      </mesh>
      {/* Handles */}
      {[5.5, 3.2].map((y, i) => (
        <mesh key={i} position={[0.8, y, 1.35]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#999" roughness={0.2} metalness={0.8} />
        </mesh>
      ))}
    </group>
  )
})
