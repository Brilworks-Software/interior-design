import { memo } from 'react'

export default memo(function Bed({ color = '#C4A882' }) {
  const woodColor = '#8B6914'
  const pillowColor = '#F5F0EB'
  return (
    <group>
      {/* Bed frame */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 0.6, 7.0]} />
        <meshStandardMaterial color={woodColor} roughness={0.7} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 1.0, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[5.6, 0.7, 6.2]} />
        <meshStandardMaterial color="#FAFAFA" roughness={0.9} />
      </mesh>
      {/* Duvet */}
      <mesh position={[0, 1.42, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[5.5, 0.3, 5.2]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Pillows */}
      {[-1.3, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 1.5, -2.4]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.4, 1.2]} />
          <meshStandardMaterial color={pillowColor} roughness={0.9} />
        </mesh>
      ))}
      {/* Headboard */}
      <mesh position={[0, 2.4, -3.4]} castShadow receiveShadow>
        <boxGeometry args={[6.0, 3.0, 0.3]} />
        <meshStandardMaterial color={woodColor} roughness={0.7} />
      </mesh>
      {/* Footboard */}
      <mesh position={[0, 1.2, 3.5]} castShadow>
        <boxGeometry args={[6.0, 1.4, 0.25]} />
        <meshStandardMaterial color={woodColor} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-2.8, -3.3], [-2.8, 3.3], [2.8, -3.3], [2.8, 3.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.1, z]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color={woodColor} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
})
