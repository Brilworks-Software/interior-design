import { memo } from 'react'

export default memo(function Rug({ color = '#8B7060' }) {
  const border = '#6B5040'
  return (
    <group>
      {/* Main rug surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[6.0, 4.0]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      {/* Border strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <planeGeometry args={[6.2, 4.2]} />
        <meshStandardMaterial color={border} roughness={0.95} />
      </mesh>
    </group>
  )
})
