import { memo } from 'react'

export default memo(function Plant({ color = '#3A7A3A' }) {
  const potColor = '#8B6914'
  const darkGreen = '#2A5A2A'
  return (
    <group>
      {/* Pot */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.35, 0.9, 16]} />
        <meshStandardMaterial color={potColor} roughness={0.8} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 1.01, 0]} receiveShadow>
        <cylinderGeometry args={[0.44, 0.44, 0.08, 16]} />
        <meshStandardMaterial color="#3A2A1A" roughness={1} />
      </mesh>
      {/* Foliage — layered spheres */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.85, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[-0.4, 1.85, 0.2]} castShadow>
        <sphereGeometry args={[0.6, 10, 10]} />
        <meshStandardMaterial color={darkGreen} roughness={0.9} />
      </mesh>
      <mesh position={[0.45, 1.9, -0.2]} castShadow>
        <sphereGeometry args={[0.55, 10, 10]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.95, 0]} castShadow>
        <sphereGeometry args={[0.5, 10, 10]} />
        <meshStandardMaterial color={darkGreen} roughness={0.9} />
      </mesh>
    </group>
  )
})
