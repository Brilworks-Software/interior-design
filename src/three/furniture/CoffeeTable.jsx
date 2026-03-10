import { memo } from 'react'

export default memo(function CoffeeTable({ color = '#9B7840' }) {
  const metal = '#707070'
  return (
    <group>
      {/* Tabletop */}
      <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.0, 0.15, 2.0]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Lower shelf */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.1, 1.5]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Legs — hairpin style */}
      {[[-1.7, -0.85], [-1.7, 0.85], [1.7, -0.85], [1.7, 0.85]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.6, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
          <meshStandardMaterial color={metal} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
    </group>
  )
})
