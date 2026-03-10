import { memo } from 'react'

export default memo(function FloorLamp({ color = '#C8B890' }) {
  const metal = '#888'
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.5, 0.2, 16]} />
        <meshStandardMaterial color={metal} roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 5.6, 10]} />
        <meshStandardMaterial color={metal} roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 5.9, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.4, 1.1, 20, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.7} side={2} />
      </mesh>
      {/* Shade top cap */}
      <mesh position={[0, 6.45, 0]}>
        <cylinderGeometry args={[0.41, 0.41, 0.05, 20]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Bulb glow */}
      <mesh position={[0, 5.7, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#FFF8D0" emissive="#FFF0A0" emissiveIntensity={1} />
      </mesh>
    </group>
  )
})
