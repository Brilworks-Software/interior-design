import { memo } from 'react'

export default memo(function WallArt({ color = '#F5F0EB' }) {
  const frameColor = '#4A3010'
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.5, 2.0, 0.15]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>
      {/* Canvas / art surface */}
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[2.1, 1.65, 0.05]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Abstract art detail */}
      <mesh position={[-0.4, 0.2, 0.12]}>
        <boxGeometry args={[0.6, 0.8, 0.02]} />
        <meshStandardMaterial color="#8B7A5A" roughness={0.8} />
      </mesh>
      <mesh position={[0.3, -0.2, 0.12]}>
        <boxGeometry args={[0.5, 0.6, 0.02]} />
        <meshStandardMaterial color="#5A7A8A" roughness={0.8} />
      </mesh>
    </group>
  )
})
