import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import useDesignerStore from '../../store/useDesignerStore'
import { furnitureCatalog } from '../../data/furnitureCatalog'
import { getSurfaceHeightAt, catalogMap } from '../../utils/furnitureCollision'
import { LIGHTING_PRESETS, OFF_LIGHTING } from '../../data/lightingPresets'
import SceneSetup from '../../three/SceneSetup'
import Room from '../../three/Room'
import FurnitureGroup from '../../three/FurnitureGroup'
import DragPlane from '../../three/DragPlane'
import MeasurementOverlay from '../../three/MeasurementOverlay'

const WALL_SNAP_THRESHOLD = 1.5

function snapToGrid(value, gridSize) {
  return Math.round(value / gridSize) * gridSize
}

const WALL_WT = 0.1 // half wall thickness — inner face sits 0.1 inside hw/hd

function applySnap(obj, room, gridSnap, gridSize, wallSnap) {
  const hw = room.width / 2
  const hd = room.depth / 2
  let x = obj.position[0]
  let z = obj.position[2]

  // Base clamp: always keep furniture inside wall inner faces, accounting for footprint
  const catalogItem = furnitureCatalog.find((f) => f.id === obj.furnitureId)
  if (catalogItem) {
    const rot = obj.rotation % 360
    const rotated = rot === 90 || rot === 270
    const fw = (rotated ? catalogItem.footprint.depth : catalogItem.footprint.width) / 2 * obj.scale
    const fd = (rotated ? catalogItem.footprint.width : catalogItem.footprint.depth) / 2 * obj.scale
    x = Math.max(-hw + WALL_WT + fw, Math.min(hw - WALL_WT - fw, x))
    z = Math.max(-hd + WALL_WT + fd, Math.min(hd - WALL_WT - fd, z))
  }

  if (gridSnap) {
    x = Math.max(-hw + 0.5, Math.min(hw - 0.5, snapToGrid(x, gridSize)))
    z = Math.max(-hd + 0.5, Math.min(hd - 0.5, snapToGrid(z, gridSize)))
  }

  if (wallSnap) {
    if (catalogItem) {
      const rot = obj.rotation % 360
      const rotated = rot === 90 || rot === 270
      const fw = (rotated ? catalogItem.footprint.depth : catalogItem.footprint.width) / 2 * obj.scale
      const fd = (rotated ? catalogItem.footprint.width : catalogItem.footprint.depth) / 2 * obj.scale

      if (z < -hd + WALL_SNAP_THRESHOLD + fd) z = -hd + WALL_WT + fd
      if (x < -hw + WALL_SNAP_THRESHOLD + fw) x = -hw + WALL_WT + fw
      if (x > hw - WALL_SNAP_THRESHOLD - fw) x = hw - WALL_WT - fw
    }
  }

  return [x, z]
}

const VIEW_PRESETS = {
  dollhouse:  { position: new THREE.Vector3(15, 10, 15), target: new THREE.Vector3(0, 3.5, 0) },
  top:        { position: new THREE.Vector3(0, 30, 0.01), target: new THREE.Vector3(0, 0, 0) },
  front:      { position: new THREE.Vector3(0, 5, 20),  target: new THREE.Vector3(0, 3.5, 0) },
  back:       { position: new THREE.Vector3(0, 5, -20), target: new THREE.Vector3(0, 3.5, 0) },
  'side-right': { position: new THREE.Vector3(20, 5, 0),  target: new THREE.Vector3(0, 3.5, 0) },
  'side-left':  { position: new THREE.Vector3(-20, 5, 0), target: new THREE.Vector3(0, 3.5, 0) },
}

function EnvIntensity({ value }) {
  const { scene } = useThree()
  useFrame(() => {
    if (scene.environmentIntensity !== value) {
      scene.environmentIntensity = value
    }
  })
  return null
}

function CameraController({ viewMode, controlsRef }) {
  const { camera } = useThree()
  const targetPos = useRef(null)
  const targetLook = useRef(null)

  useEffect(() => {
    const preset = VIEW_PRESETS[viewMode]
    if (!preset) return
    targetPos.current = preset.position.clone()
    targetLook.current = preset.target.clone()
  }, [viewMode])

  useFrame(() => {
    if (!targetPos.current || !controlsRef.current) return
    camera.position.lerp(targetPos.current, 0.08)
    controlsRef.current.target.lerp(targetLook.current, 0.08)
    controlsRef.current.update()
    if (camera.position.distanceTo(targetPos.current) < 0.01) {
      targetPos.current = null
    }
  })

  return null
}

function DraggableScene({ room, controlsRef }) {
  const objects = useDesignerStore((s) => s.objects)
  const updateObject = useDesignerStore((s) => s.updateObject)
  const storeDraggingId = useDesignerStore((s) => s.setDraggingId)
  const [draggingId, setDraggingId] = useState(null)
  const draggingIdRef = useRef(null)

  useEffect(() => {
    function handleGlobalPointerUp() {
      if (draggingIdRef.current) {
        stopDrag()
        document.body.style.cursor = 'default'
      }
    }
    window.addEventListener('pointerup', handleGlobalPointerUp)
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp)
  }, [])

  function startDrag(id) {
    draggingIdRef.current = id
    setDraggingId(id)
    storeDraggingId(id)
    if (controlsRef.current) controlsRef.current.enabled = false
  }

  function stopDrag() {
    const id = draggingIdRef.current
    if (!id) return

    const { gridSnap, gridSize, wallSnap, objects: storeObjects } = useDesignerStore.getState()
    const obj = storeObjects.find((o) => o.id === id)
    if (obj) {
      const [x, z] = applySnap(obj, room, gridSnap, gridSize, wallSnap)
      const catalog = catalogMap.get(obj.furnitureId)
      let y = 0
      if (catalog?.wallMounted) {
        y = catalog.mountHeight ?? 4
      } else if (catalog?.surfaceItem) {
        y = getSurfaceHeightAt(x, z, storeObjects, id)
      }
      updateObject(id, { position: [x, y, z] })
    }

    draggingIdRef.current = null
    setDraggingId(null)
    storeDraggingId(null)
    if (controlsRef.current) controlsRef.current.enabled = true
  }

  return (
    <>
      <DragPlane
        room={room}
        draggingId={draggingId}
        onStopDrag={stopDrag}
      />
      {objects.map((obj) => (
        <FurnitureGroup
          key={obj.id}
          obj={obj}
          draggingId={draggingId}
          onStartDrag={startDrag}
          onStopDrag={stopDrag}
        />
      ))}
    </>
  )
}

export default function Viewport({ room }) {
  const controlsRef = useRef()
  const viewMode = useDesignerStore((s) => s.viewMode)
  const lightingMode = useDesignerStore((s) => s.lightingMode)

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [15, 10, 15], fov: 50, near: 0.1, far: 200 }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
      >
        {lightingMode !== 'off' && <Environment preset="apartment" background={false} />}
        <EnvIntensity value={lightingMode === 'off' ? 0 : (LIGHTING_PRESETS[lightingMode]?.envIntensity ?? 0)} />
        <SceneSetup room={room} />
        <Room room={room} viewMode={viewMode} />
        <DraggableScene room={room} controlsRef={controlsRef} />
        <MeasurementOverlay room={room} />
        <CameraController viewMode={viewMode} controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={[0, 3.5, 0]}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={3}
          maxDistance={50}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  )
}
