import { memo } from 'react'

export default memo(function ArmChair({ color = '#7B6B5A' }) {
  const legColor = '#4A3020'
  return (
    <group>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.45, 2.2]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.2, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 1.0, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[-1.15, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.75, 2.2]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[1.15, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.75, 2.2]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[2.7, 0.28, 2.3]} />
        <meshStandardMaterial color={legColor} roughness={0.7} />
      </mesh>
      {[[-1.1, -1.0], [-1.1, 1.0], [1.1, -1.0], [1.1, 1.0]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.08, z]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.16, 8]} />
          <meshStandardMaterial color={legColor} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
})
