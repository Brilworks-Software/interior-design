import { memo, useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Generic GLB model loader for furniture.
 * Props:
 *  - url: path to .glb file (relative to public/)
 *  - color: override color (applied to all meshes)
 *  - modelScale: extra scale multiplier [x,y,z] to fit footprint
 *  - modelOffset: position offset [x,y,z] to sit correctly on floor
 */
export default memo(function GLBModel({
  url,
  color,
  modelScale = [1, 1, 1],
  modelOffset = [0, 0, 0],
}) {
  const { scene } = useGLTF(url)

  const clone = useMemo(() => {
    const cloned = scene.clone(true)

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // Debug: log bounding box size for each model
    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    box.getSize(size)
    console.log(`[GLB] ${url} — raw size: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`)

    return cloned
  }, [scene, url])

  // Apply color override when color prop changes
  useEffect(() => {
    if (!color) return
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set(color)
      }
    })
  }, [clone, color])

  return (
    <group scale={modelScale} position={modelOffset}>
      <primitive object={clone} />
    </group>
  )
})
