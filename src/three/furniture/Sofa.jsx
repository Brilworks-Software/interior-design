import { memo } from 'react'

export default memo(function Sofa({ color = '#8B7355' }) {
  const legColor = '#5A4030'
  return (
    <group>
      {/* Seat cushion */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.6, 0.5, 2.6]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Back rest */}
      <mesh position={[0, 1.3, -1.1]} castShadow receiveShadow>
        <boxGeometry args={[5.6, 1.1, 0.55]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-2.65, 1.0, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.85, 2.6]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Right arm */}
      <mesh position={[2.65, 1.0, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.85, 2.6]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Base / skirt */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.8, 0.3, 2.8]} />
        <meshStandardMaterial color={legColor} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-2.4, -2.4], [-2.4, 2.4], [2.4, -2.4], [2.4, 2.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.08, z]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.16, 8]} />
          <meshStandardMaterial color={legColor} roughness={0.5} metalness={0.1} />
        </mesh>
      ))}
    </group>
  )
})
