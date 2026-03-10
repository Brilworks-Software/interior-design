import { memo } from 'react'

export default memo(function OfficeChair({ color = '#2A2A2A' }) {
  const metal = '#888888'
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.18, 2.0]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Back rest */}
      <mesh position={[0, 2.8, -0.85]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 1.8, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Back post */}
      <mesh position={[0, 2.0, -0.7]} castShadow>
        <boxGeometry args={[0.14, 1.0, 0.14]} />
        <meshStandardMaterial color={metal} roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Cylinder post */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 1.0, 12]} />
        <meshStandardMaterial color={metal} roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Base star */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        return (
          <mesh key={i} position={[Math.cos(rad) * 0.7, 0.08, Math.sin(rad) * 0.7]} rotation={[0, -rad, 0]} castShadow>
            <boxGeometry args={[1.4, 0.08, 0.18]} />
            <meshStandardMaterial color={metal} roughness={0.4} metalness={0.6} />
          </mesh>
        )
      })}
      {/* Armrests */}
      {[-1.1, 1.1].map((x, i) => (
        <mesh key={i} position={[x, 2.3, -0.2]} castShadow>
          <boxGeometry args={[0.16, 0.08, 1.2]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
})
