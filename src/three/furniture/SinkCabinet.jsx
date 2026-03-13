import { memo } from 'react'

export default memo(function SinkCabinet({ color = '#E8E0D8' }) {
  return (
    <group>
      {/* Countertop */}
      <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.15, 2]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Base cabinet */}
      <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2.7, 2]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Sink basin (recessed) */}
      <mesh position={[0, 2.75, 0]}>
        <boxGeometry args={[1.8, 0.4, 1.2]} />
        <meshStandardMaterial color="#999" roughness={0.2} metalness={0.5} />
      </mesh>
      {/* Sink inner */}
      <mesh position={[0, 2.65, 0]}>
        <boxGeometry args={[1.5, 0.3, 0.9]} />
        <meshStandardMaterial color="#AAA" roughness={0.15} metalness={0.6} />
      </mesh>
      {/* Faucet base */}
      <mesh position={[0, 3.0, -0.6]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
        <meshStandardMaterial color="#BBB" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Faucet arm */}
      <mesh position={[0, 3.3, -0.3]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
        <meshStandardMaterial color="#BBB" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Cabinet doors */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 1.35, 1.01]}>
          <boxGeometry args={[1.2, 2.4, 0.04]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
      {/* Handles */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 1.8, 1.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
          <meshStandardMaterial color="#AAA" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
})
