import { memo } from 'react'

export default memo(function Nightstand({ color = '#A07840' }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.8, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Drawer face */}
      <mesh position={[0, 1.25, 0.91]}>
        <boxGeometry args={[1.75, 0.55, 0.04]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 1.25, 0.95]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
        <meshStandardMaterial color="#AAA" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Top surface */}
      <mesh position={[0, 2.06, 0]} castShadow>
        <boxGeometry args={[2.1, 0.1, 1.9]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      {/* Legs */}
      {[[-0.8, -0.75], [-0.8, 0.75], [0.8, -0.75], [0.8, 0.75]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.1, z]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.2, 8]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
})
