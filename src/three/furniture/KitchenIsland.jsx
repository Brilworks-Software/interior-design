import { memo } from 'react'

export default memo(function KitchenIsland({ color = '#D4C4A8' }) {
  return (
    <group>
      {/* Countertop */}
      <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.15, 2.5]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 2.7, 2.5]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Front panel doors */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 1.35, 1.26]}>
          <boxGeometry args={[1.4, 2.4, 0.04]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
      {/* Handles */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 1.8, 1.32]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#AAA" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
      {/* Overhang lip on front for stools */}
      <mesh position={[0, 2.75, 1.4]} castShadow>
        <boxGeometry args={[5, 0.1, 0.4]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  )
})
