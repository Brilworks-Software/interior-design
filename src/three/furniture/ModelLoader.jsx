import { memo, useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default memo(function ModelLoader({
  url,
  color,
  modelScale = [1, 1, 1],
  modelOffset = [0, 0, 0],
}) {
  const { scene } = useGLTF(url)

  const { clone, autoOffset } = useMemo(() => {
    const cloned = scene.clone(true)

    cloned.traverse((child) => {
      if (child.isMesh) {
        if (child.material) child.material = child.material.clone()
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)
    console.log(`[Model] ${url} — raw size: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}, min.y: ${box.min.y.toFixed(2)}, center: ${center.x.toFixed(2)},${center.y.toFixed(2)},${center.z.toFixed(2)}`)

    const autoOff = [-center.x, -box.min.y, -center.z]
    return { clone: cloned, autoOffset: autoOff }
  }, [scene, url])

  useEffect(() => {
    if (!color) return
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(color)
      }
    })
  }, [clone, color])

  return (
    <group scale={modelScale} position={modelOffset}>
      <group position={autoOffset}>
        <primitive object={clone} />
      </group>
    </group>
  )
})
