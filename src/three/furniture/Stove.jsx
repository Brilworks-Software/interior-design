import { memo } from 'react'

export default memo(function Stove({ color = '#2A2A2A' }) {
  return (
    <group>
      {/* Oven body */}
      <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 2.7, 2]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Stovetop surface */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <boxGeometry args={[2.5, 0.1, 2]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Burners (4) */}
      {[[-0.55, -0.45], [-0.55, 0.45], [0.55, -0.45], [0.55, 0.45]].map(([x, z], i) => (
        <mesh key={i} position={[x, 2.86, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.03, 8, 24]} />
          <meshStandardMaterial color="#555" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      {/* Oven door */}
      <mesh position={[0, 1.1, 1.01]}>
        <boxGeometry args={[2.2, 1.8, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Oven window */}
      <mesh position={[0, 1.3, 1.03]}>
        <boxGeometry args={[1.6, 1, 0.02]} />
        <meshStandardMaterial color="#222" roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 2.2, 1.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
        <meshStandardMaterial color="#999" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Knobs */}
      {[-0.8, -0.3, 0.3, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 2.65, 1.05]}>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#666" roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
    </group>
  )
})
