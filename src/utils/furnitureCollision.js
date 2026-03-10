import { furnitureCatalog } from '../data/furnitureCatalog'

export const catalogMap = new Map(furnitureCatalog.map((f) => [f.id, f]))

export const FURNITURE_GAP = 0.04
export const WALL_WT = 0.1   // half wall thickness

export function getHalfExtents(obj, catalogItem) {
  const rot = (obj.rotation ?? 0) % 360
  const rotated = rot === 90 || rot === 270
  const scale = obj.scale ?? 1
  return {
    hw: (rotated ? catalogItem.footprint.depth : catalogItem.footprint.width) / 2 * scale,
    hd: (rotated ? catalogItem.footprint.width : catalogItem.footprint.depth) / 2 * scale,
  }
}

// Returns flat list of AABB boxes for objects that can block the dragging item.
// Skips stackable items and skips all blockers when dragging item is stackable.
export function buildOtherBoxes(allObjects, draggingId, draggingCatalog) {
  if (draggingCatalog.stackable) return []
  const boxes = []
  for (const o of allObjects) {
    if (o.id === draggingId) continue
    const catalog = catalogMap.get(o.furnitureId)
    if (!catalog || catalog.stackable) continue
    const { hw, hd } = getHalfExtents(o, catalog)
    boxes.push({ cx: o.position[0], cz: o.position[2], hw, hd })
  }
  return boxes
}

export function hitsAny(cx, cz, hwA, hdA, boxes) {
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i]
    if (
      Math.abs(cx - b.cx) < hwA + b.hw + FURNITURE_GAP &&
      Math.abs(cz - b.cz) < hdA + b.hd + FURNITURE_GAP
    ) return true
  }
  return false
}

/**
 * Returns the surface height at (x, z) if there is a furniture piece with a
 * surfaceHeight whose footprint covers that point. Otherwise returns 0.
 */
export function getSurfaceHeightAt(x, z, allObjects, excludeId) {
  for (const o of allObjects) {
    if (o.id === excludeId) continue
    const catalog = catalogMap.get(o.furnitureId)
    if (!catalog || !catalog.surfaceHeight) continue
    const { hw, hd } = getHalfExtents(o, catalog)
    const ox = o.position[0]
    const oz = o.position[2]
    if (Math.abs(x - ox) <= hw && Math.abs(z - oz) <= hd) {
      return catalog.surfaceHeight * (o.scale ?? 1)
    }
  }
  return 0
}

// Spiral candidate positions outward from (startX, startZ) in STEP-ft increments.
const STEP = 1.5
const SPIRAL_OFFSETS = (() => {
  const offsets = [[0, 0]]
  for (let ring = 1; ring <= 8; ring++) {
    for (let dx = -ring; dx <= ring; dx++) {
      for (let dz = -ring; dz <= ring; dz++) {
        if (Math.abs(dx) === ring || Math.abs(dz) === ring) {
          offsets.push([dx * STEP, dz * STEP])
        }
      }
    }
  }
  return offsets
})()

/**
 * Find the nearest free position for newObj given existing objects and room bounds.
 * startX/startZ default to room center; pass a custom start for paste offset.
 */
export function findFreePosition(newObj, allObjects, room, startX = 0, startZ = 0) {
  const catalog = catalogMap.get(newObj.furnitureId)
  if (!catalog || catalog.stackable) {
    let y = 0
    if (catalog?.wallMounted) {
      y = catalog.mountHeight ?? 4
    } else if (catalog?.surfaceItem) {
      y = getSurfaceHeightAt(startX, startZ, allObjects, newObj.id ?? '__new__')
    }
    return [startX, y, startZ]
  }

  const { hw, hd } = getHalfExtents(newObj, catalog)
  const roomHW = room.width / 2
  const roomHD = room.depth / 2
  const minX = -roomHW + WALL_WT + hw
  const maxX =  roomHW - WALL_WT - hw
  const minZ = -roomHD + WALL_WT + hd
  const maxZ =  roomHD - WALL_WT - hd

  // Build blocker boxes — exclude the new object itself (it has no id yet, so none match)
  const boxes = buildOtherBoxes(allObjects, newObj.id ?? '__new__', catalog)

  for (const [dx, dz] of SPIRAL_OFFSETS) {
    const cx = Math.max(minX, Math.min(maxX, startX + dx))
    const cz = Math.max(minZ, Math.min(maxZ, startZ + dz))
    if (!hitsAny(cx, cz, hw, hd, boxes)) return [cx, 0, cz]
  }

  // Fallback — room is very full, just use clamped start
  return [Math.max(minX, Math.min(maxX, startX)), 0, Math.max(minZ, Math.min(maxZ, startZ))]
}
