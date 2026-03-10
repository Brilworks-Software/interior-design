import { memo } from 'react'

export default memo(function DiningTable({ color = '#8B6914' }) {
  const legColor = '#6B4A14'
  return (
    <group>
      {/* Tabletop */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 0.2, 3.5]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Apron front/back */}
      <mesh position={[0, 2.2, 1.55]} castShadow>
        <boxGeometry args={[5.4, 0.3, 0.1]} />
        <meshStandardMaterial color={legColor} roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.2, -1.55]} castShadow>
        <boxGeometry args={[5.4, 0.3, 0.1]} />
        <meshStandardMaterial color={legColor} roughness={0.7} />
      </mesh>
      {/* Apron sides */}
      <mesh position={[2.7, 2.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 3.1]} />
        <meshStandardMaterial color={legColor} roughness={0.7} />
      </mesh>
      <mesh position={[-2.7, 2.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 3.1]} />
        <meshStandardMaterial color={legColor} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-2.6, -1.5], [-2.6, 1.5], [2.6, -1.5], [2.6, 1.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.05, z]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 2.1, 0.2]} />
          <meshStandardMaterial color={legColor} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
})
