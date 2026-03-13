import { memo } from 'react'

export default memo(function KitchenCounter({ color = '#E8E0D8' }) {
  return (
    <group>
      {/* Countertop */}
      <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.15, 2]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Base cabinets */}
      <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 2.7, 2]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Cabinet doors (3 panels) */}
      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x, 1.35, 1.01]}>
          <boxGeometry args={[1.8, 2.4, 0.04]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
      {/* Handles */}
      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x, 1.8, 1.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#AAA" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
})
