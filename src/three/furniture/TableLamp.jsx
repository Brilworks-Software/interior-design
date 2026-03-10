import { memo } from 'react'

export default memo(function TableLamp({ color = '#F5F0E0' }) {
  const base = '#8B6914'
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.6, 16]} />
        <meshStandardMaterial color={base} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 10]} />
        <meshStandardMaterial color={base} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.28, 0.85, 18, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.75} side={2} />
      </mesh>
      {/* Shade top cap */}
      <mesh position={[0, 1.97, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.04, 18]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.13, 10, 10]} />
        <meshStandardMaterial color="#FFF8D0" emissive="#FFE880" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
})
