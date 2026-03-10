import { memo } from 'react'

export default memo(function TVStand({ color = '#4A3010' }) {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.0, 1.8, 1.5]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Middle shelf divider */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.08, 1.6, 1.3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Door handles */}
      {[-1.3, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 1.1, 0.76]}>
          <cylinderGeometry args={[0.06, 0.06, 0.6, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#888" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
      {/* Legs */}
      {[[-2.3, -0.6], [-2.3, 0.6], [2.3, -0.6], [2.3, 0.6]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.1, z]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.15]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
})
