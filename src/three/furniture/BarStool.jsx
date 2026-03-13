import { memo } from 'react'

export default memo(function BarStool({ color = '#2A2A2A' }) {
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.2, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Seat cushion top */}
      <mesh position={[0, 2.55, 0]}>
        <cylinderGeometry args={[0.5, 0.52, 0.12, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Center pole */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Base ring */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.04, 8, 24]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Footrest ring */}
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.03, 8, 24]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  )
})
