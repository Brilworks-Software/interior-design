import { memo } from 'react'

export default memo(function Microwave({ color = '#2A2A2A' }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.8, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Door window */}
      <mesh position={[-0.15, 0.4, 0.61]}>
        <boxGeometry args={[0.9, 0.55, 0.02]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Control panel */}
      <mesh position={[0.55, 0.4, 0.61]}>
        <boxGeometry args={[0.3, 0.55, 0.02]} />
        <meshStandardMaterial color="#333" roughness={0.5} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.35, 0.4, 0.65]}>
        <boxGeometry args={[0.06, 0.5, 0.06]} />
        <meshStandardMaterial color="#999" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  )
})
