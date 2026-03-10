import useDesignerStore from '../store/useDesignerStore'
import {
  catalogMap,
  WALL_WT,
  getHalfExtents,
  buildOtherBoxes,
  hitsAny,
  getSurfaceHeightAt,
} from '../utils/furnitureCollision'

function resolvePosition(proposedX, proposedZ, obj, catalogItem, allObjects) {
  const { hw: hwA, hd: hdA } = getHalfExtents(obj, catalogItem)
  const boxes = buildOtherBoxes(allObjects, obj.id, catalogItem)

  // 1. Full movement
  if (!hitsAny(proposedX, proposedZ, hwA, hdA, boxes)) return [proposedX, proposedZ]

  // 2. Slide along X (hold current Z)
  const curZ = obj.position[2]
  if (!hitsAny(proposedX, curZ, hwA, hdA, boxes)) return [proposedX, curZ]

  // 3. Slide along Z (hold current X)
  const curX = obj.position[0]
  if (!hitsAny(curX, proposedZ, hwA, hdA, boxes)) return [curX, proposedZ]

  // 4. Blocked — stay put
  return [curX, curZ]
}

export default function DragPlane({ room, draggingId, onStopDrag }) {
  const moveObject = useDesignerStore((s) => s.moveObject)
  const clearSelection = useDesignerStore((s) => s.clearSelection)

  const hw = room.width / 2
  const hd = room.depth / 2

  function onPointerDown(e) {
    if (!draggingId) clearSelection()
  }

  function onPointerMove(e) {
    if (!draggingId) return
    e.stopPropagation()

    const { objects } = useDesignerStore.getState()
    const obj = objects.find((o) => o.id === draggingId)
    const catalogItem = obj ? catalogMap.get(obj.furnitureId) : null

    let padX = 0.1
    let padZ = 0.1
    if (catalogItem && obj) {
      const fp = getHalfExtents(obj, catalogItem)
      padX = fp.hw
      padZ = fp.hd
    }

    // Wall clamp — subtract half wall thickness so furniture stays clear of the wall face
    const clampedX = Math.max(-hw + WALL_WT + padX, Math.min(hw - WALL_WT - padX, e.point.x))
    const clampedZ = Math.max(-hd + WALL_WT + padZ, Math.min(hd - WALL_WT - padZ, e.point.z))

    // Furniture-to-furniture collision resolution
    let finalX = clampedX
    let finalZ = clampedZ
    if (catalogItem && obj) {
      ;[finalX, finalZ] = resolvePosition(clampedX, clampedZ, obj, catalogItem, objects)
    }

    // Compute Y based on item type
    let y = 0
    if (catalogItem) {
      if (catalogItem.wallMounted) {
        y = catalogItem.mountHeight ?? 4
      } else if (catalogItem.surfaceItem) {
        y = getSurfaceHeightAt(finalX, finalZ, objects, draggingId)
      }
    }

    moveObject(draggingId, [finalX, y, finalZ])
  }

  function onPointerUp(e) {
    if (draggingId) {
      onStopDrag()
    }
  }

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.001, 0]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <planeGeometry args={[room.width, room.depth]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  )
}
