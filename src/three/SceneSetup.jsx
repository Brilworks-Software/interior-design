import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import useDesignerStore from '../store/useDesignerStore'
import { LIGHTING_PRESETS, OFF_LIGHTING } from '../data/lightingPresets'

RectAreaLightUniformsLib.init()

export default function SceneSetup({ room }) {
  const { gl } = useThree()
  const lightingMode = useDesignerStore((s) => s.lightingMode)

  useEffect(() => {
    gl.shadowMap.enabled = true
    gl.shadowMap.type = THREE.PCFSoftShadowMap
  }, [gl])

  const L = lightingMode === 'off' ? OFF_LIGHTING : (LIGHTING_PRESETS[lightingMode] ?? OFF_LIGHTING)

  return (
    <>
      <ambientLight intensity={L.ambient.intensity} color={L.ambient.color} />

      <directionalLight
        position={L.directional.position}
        intensity={L.directional.intensity}
        color={L.directional.color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-(room.width / 2 + 2)}
        shadow-camera-right={room.width / 2 + 2}
        shadow-camera-top={room.depth / 2 + 2}
        shadow-camera-bottom={-(room.depth / 2 + 2)}
        shadow-bias={-0.001}
      />

      <hemisphereLight
        skyColor={L.hemisphere.sky}
        groundColor={L.hemisphere.ground}
        intensity={L.hemisphere.intensity}
      />

      <pointLight
        position={[0, room.height * 0.7, room.depth]}
        intensity={L.frontPoint.intensity}
        color={L.frontPoint.color}
      />
    </>
  )
}
