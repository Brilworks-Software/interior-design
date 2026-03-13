import { memo } from 'react'

export default memo(function KitchenCabinet({ color = '#FFFFFF' }) {
  return (
    <group>
      {/* Cabinet body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2.2, 1]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Door panels */}
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.51]}>
          <boxGeometry args={[1.8, 1.9, 0.04]} />
          <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
      ))}
      {/* Handles */}
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x, -0.3, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.35, 8]} />
          <meshStandardMaterial color="#AAA" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
})
