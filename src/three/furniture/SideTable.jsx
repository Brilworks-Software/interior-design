import { memo } from 'react'

export default memo(function SideTable({ color = '#A07840' }) {
  return (
    <group>
      {/* Round top */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.12, 24]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.6, 12]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 24]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )
})
