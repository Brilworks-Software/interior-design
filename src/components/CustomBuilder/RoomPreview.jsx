import { useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Room from '../../three/Room'
import SceneSetup from '../../three/SceneSetup'

function CameraController({ step, room }) {
  const { camera } = useThree()
  const controlsRef = useRef()
  const targetPos = useRef(null)
  const targetLook = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    const maxDim = Math.max(room.width, room.depth)
    if (step <= 2) {
      // Top-down view
      targetPos.current = new THREE.Vector3(0, maxDim * 1.6, 0.01)
      targetLook.current = new THREE.Vector3(0, 0, 0)
    } else {
      // Dollhouse view
      targetPos.current = new THREE.Vector3(maxDim * 0.6, maxDim * 0.55, maxDim * 0.6)
      targetLook.current = new THREE.Vector3(0, room.height * 0.35, 0)
    }
    if (!initialized.current) {
      camera.position.copy(targetPos.current)
      initialized.current = true
    }
  }, [step, room.width, room.depth, room.height])

  useFrame(() => {
    if (!targetPos.current) return
    camera.position.lerp(targetPos.current, 0.06)
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, 0.06)
      controlsRef.current.update()
    }
    if (camera.position.distanceTo(targetPos.current) < 0.05) {
      targetPos.current = null
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={3}
      maxDistance={80}
      enableDamping
      dampingFactor={0.08}
    />
  )
}

export default function RoomPreview({ room, step }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#E5E5E5' }}>
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [0, 30, 0.01], fov: 50, near: 0.1, far: 200 }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
      >
        <SceneSetup room={room} />
        <Room room={room} viewMode={step <= 2 ? 'top' : 'dollhouse'} />
        <CameraController step={step} room={room} />
      </Canvas>
    </div>
  )
}
