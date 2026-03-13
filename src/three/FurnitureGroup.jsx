import { useRef, useEffect, Suspense } from 'react'
import * as THREE from 'three'
import { furnitureComponents } from './furniture/index'
import { furnitureModels } from '../data/furnitureModels'
import ModelLoader from './furniture/ModelLoader'
import useDesignerStore from '../store/useDesignerStore'

const outlineMat = new THREE.LineBasicMaterial({ color: 0xffffff, depthTest: false })

function buildOutlines(group) {
  if (!group) return
  group.traverse((child) => {
    if (child.isMesh && child.geometry && !child.userData._hasOutline) {
      const edges = new THREE.EdgesGeometry(child.geometry, 30)
      const line = new THREE.LineSegments(edges, outlineMat)
      line.userData._outline = true
      line.raycast = () => {}
      line.renderOrder = 999
      line.visible = false
      child.add(line)
      child.userData._hasOutline = true
    }
  })
}

function setOutlineVisibility(group, visible) {
  if (!group) return
  group.traverse((child) => {
    if (child.userData._outline) child.visible = visible
  })
}

export default function FurnitureGroup({ obj, draggingId, onStartDrag, onStopDrag }) {
  const groupRef = useRef()
  const selectObject = useDesignerStore((s) => s.selectObject)
  const selectedObjectId = useDesignerStore((s) => s.selectedObjectId)
  const realisticMode = useDesignerStore((s) => s.realisticMode)
  const isSelected = obj.id === selectedObjectId

  const FurnitureComponent = furnitureComponents[obj.furnitureId]
  const modelConfig = furnitureModels[obj.furnitureId]
  const useGLB = realisticMode && modelConfig

  const rotRad = (obj.rotation * Math.PI) / 180

  // Build outlines once after mount, then just toggle visibility
  useEffect(() => {
    buildOutlines(groupRef.current)
  }, [])

  // Rebuild outlines when switching between realistic/basic mode
  useEffect(() => {
    // Small delay to let the new geometry mount
    const timer = setTimeout(() => {
      buildOutlines(groupRef.current)
      setOutlineVisibility(groupRef.current, isSelected)
    }, 150)
    return () => clearTimeout(timer)
  }, [realisticMode])

  useEffect(() => {
    setOutlineVisibility(groupRef.current, isSelected)
  }, [isSelected])

  // In realistic mode, hide items that don't have a GLB model
  if (realisticMode && !modelConfig) return null
  if (!realisticMode && !FurnitureComponent) return null

  function handlePointerDown(e) {
    e.stopPropagation()
    if (!isSelected) selectObject(obj.id)
    onStartDrag(obj.id)
    document.body.style.cursor = 'grabbing'
  }

  function handlePointerUp(e) {
    if (draggingId === obj.id) {
      e.stopPropagation()
      onStopDrag()
      document.body.style.cursor = 'grab'
    }
  }

  function handlePointerEnter() {
    if (draggingId === null) {
      document.body.style.cursor = 'grab'
    }
  }

  function handlePointerLeave() {
    if (draggingId !== obj.id) {
      document.body.style.cursor = 'default'
    }
  }

  return (
    <group
      ref={groupRef}
      position={obj.position}
      rotation={[0, rotRad, 0]}
      scale={[obj.scale, obj.scale, obj.scale]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {useGLB ? (
        <Suspense fallback={FurnitureComponent ? <FurnitureComponent color={obj.color} /> : null}>
          <ModelLoader
            url={modelConfig.path}
            color={obj.color}
            modelScale={modelConfig.scale}
            modelOffset={modelConfig.offset}
          />
        </Suspense>
      ) : (
        <FurnitureComponent color={obj.color} />
      )}
    </group>
  )
}
