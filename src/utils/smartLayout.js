import { furnitureCatalog } from '../data/furnitureCatalog'
import { hitsAny, getHalfExtents, WALL_WT, FURNITURE_GAP } from './furnitureCollision'

const catalogMap = new Map(furnitureCatalog.map((f) => [f.id, f]))

/**
 * Room coordinate system:
 *   X: left (-width/2) to right (+width/2)
 *   Z: back (-depth/2) to front (+depth/2)
 *   Back wall = -depth/2, Front = +depth/2 (open, no wall)
 *   Left wall = -width/2, Right wall = +width/2
 */

// Priority order for placement — items placed first get best spots
const PLACEMENT_ORDER = [
  'bed', 'sofa', 'dining-table', 'tv-stand', 'desk',
  'kitchen-counter', 'fridge', 'stove', 'sink-cabinet', 'kitchen-island',
  'dishwasher', 'kitchen-cabinet',
  'wardrobe', 'bookshelf', 'nightstand', 'coffee-table',
  'armchair', 'office-chair', 'dining-chair', 'bar-stool', 'side-table',
  'rug', 'floor-lamp', 'plant', 'table-lamp', 'microwave', 'wall-art',
]

/**
 * Place furniture intelligently in a room.
 * @param {Array} items - [{ furnitureId, scale, quantity }]
 * @param {Object} room - room preset object
 * @returns {Array} positioned objects ready for the store
 */
export function smartLayout(items, room) {
  const hw = room.width / 2  // half width
  const hd = room.depth / 2  // half depth

  // Room edges (inset by wall thickness)
  const bounds = {
    minX: -hw + WALL_WT,
    maxX: hw - WALL_WT,
    minZ: -hd + WALL_WT,
    maxZ: hd - WALL_WT,
  }

  // Expand items by quantity and sort by placement order
  const expanded = []
  for (const item of items) {
    const qty = item.quantity || 1
    for (let i = 0; i < qty; i++) {
      expanded.push({ ...item, _index: i })
    }
  }
  expanded.sort((a, b) => {
    const ai = PLACEMENT_ORDER.indexOf(a.furnitureId)
    const bi = PLACEMENT_ORDER.indexOf(b.furnitureId)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })

  const placed = []       // final positioned objects
  const boxes = []        // collision boxes for placed items
  // Track key anchor positions for relational placement
  const anchors = {
    bed: null,        // { x, z, hw, hd }
    sofa: null,
    diningTable: null,
    desk: null,
    tvStand: null,
    kitchenCounter: null,
    kitchenIsland: null,
    fridge: null,
    stove: null,
    sink: null,
  }

  function addBox(cx, cz, objHw, objHd) {
    boxes.push({ cx, cz, hw: objHw, hd: objHd })
  }

  function isFree(cx, cz, objHw, objHd) {
    // Check room bounds
    if (cx - objHw < bounds.minX || cx + objHw > bounds.maxX) return false
    if (cz - objHd < bounds.minZ || cz + objHd > bounds.maxZ) return false
    // Check collisions with placed items
    return !hitsAny(cx, cz, objHw, objHd, boxes)
  }

  function clampX(x, objHw) {
    return Math.max(bounds.minX + objHw, Math.min(bounds.maxX - objHw, x))
  }
  function clampZ(z, objHd) {
    return Math.max(bounds.minZ + objHd, Math.min(bounds.maxZ - objHd, z))
  }

  // Try a position, return true if placed
  function tryPlace(obj, x, z, rotation) {
    const catalog = catalogMap.get(obj.furnitureId)
    if (!catalog) return false
    const mock = { ...obj, rotation, scale: obj.scale || 1 }
    const { hw: eHw, hd: eHd } = getHalfExtents(mock, catalog)
    const cx = clampX(x, eHw)
    const cz = clampZ(z, eHd)

    if (catalog.stackable || catalog.wallMounted || catalog.surfaceItem) {
      // Stackable items don't collide
      obj._placed = { x: cx, z: cz, rotation, hw: eHw, hd: eHd }
      return true
    }

    if (isFree(cx, cz, eHw, eHd)) {
      addBox(cx, cz, eHw, eHd)
      obj._placed = { x: cx, z: cz, rotation, hw: eHw, hd: eHd }
      return true
    }
    return false
  }

  // Try multiple candidates, return first success
  function tryPlaceCandidates(obj, candidates) {
    for (const [x, z, rot] of candidates) {
      if (tryPlace(obj, x, z, rot)) return true
    }
    return false
  }

  // Fallback: spiral from center
  function fallbackPlace(obj) {
    const catalog = catalogMap.get(obj.furnitureId)
    if (!catalog) return
    const mock = { ...obj, rotation: 0, scale: obj.scale || 1 }
    const { hw: eHw, hd: eHd } = getHalfExtents(mock, catalog)
    const step = 1.5
    for (let ring = 0; ring <= 10; ring++) {
      for (let dx = -ring; dx <= ring; dx++) {
        for (let dz = -ring; dz <= ring; dz++) {
          if (ring > 0 && Math.abs(dx) !== ring && Math.abs(dz) !== ring) continue
          const cx = clampX(dx * step, eHw)
          const cz = clampZ(dz * step, eHd)
          if (isFree(cx, cz, eHw, eHd)) {
            addBox(cx, cz, eHw, eHd)
            obj._placed = { x: cx, z: cz, rotation: 0, hw: eHw, hd: eHd }
            return
          }
        }
      }
    }
    // Absolute fallback
    obj._placed = { x: 0, z: 0, rotation: 0, hw: eHw, hd: eHd }
  }

  // --- Placement strategies per furniture type ---

  function placeBed(obj) {
    // Center-x, pushed toward back wall
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const depth = catalog.footprint.depth * scale / 2
    const backZ = bounds.minZ + depth
    const candidates = [
      [0, backZ, 0],
      [-2, backZ, 0],
      [2, backZ, 0],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
    if (obj._placed) anchors.bed = obj._placed
  }

  function placeSofa(obj) {
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const depth = catalog.footprint.depth * scale / 2
    // Center of room, slightly toward front
    const z = hd * 0.25
    const candidates = [
      [0, z, 0],
      [-hw * 0.25, z, 0],
      [hw * 0.25, z, 0],
      [0, 0, 0],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
    if (obj._placed) anchors.sofa = obj._placed
  }

  function placeTvStand(obj) {
    // Against back wall, centered or aligned with sofa
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const depth = catalog.footprint.depth * scale / 2
    const backZ = bounds.minZ + depth
    const cx = anchors.sofa ? anchors.sofa.x : 0
    const candidates = [
      [cx, backZ, 0],
      [0, backZ, 0],
      [-hw * 0.3, backZ, 0],
      [hw * 0.3, backZ, 0],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
    if (obj._placed) anchors.tvStand = obj._placed
  }

  function placeDiningTable(obj) {
    // Right side of room or center if no sofa
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const halfW = catalog.footprint.width * scale / 2
    const rightX = hw * 0.45
    const candidates = anchors.sofa
      ? [
          [rightX, -hd * 0.15, 0],
          [rightX, 0, 0],
          [-hw * 0.4, hd * 0.2, 0],
        ]
      : [
          [0, -hd * 0.1, 0],
          [0, 0, 0],
        ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
    if (obj._placed) anchors.diningTable = obj._placed
  }

  function placeDesk(obj) {
    // Against right wall facing left, or left wall if right is taken
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const depth = catalog.footprint.depth * scale / 2
    const rightX = bounds.maxX - depth
    const leftX = bounds.minX + depth
    const candidates = [
      [rightX, -hd * 0.25, 270],
      [rightX, 0, 270],
      [rightX, hd * 0.2, 270],
      [leftX, -hd * 0.25, 90],
      [leftX, 0, 90],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
    if (obj._placed) anchors.desk = obj._placed
  }

  function placeWardrobe(obj) {
    // Against left wall, rotated 90
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const depth = catalog.footprint.depth * scale / 2
    const leftX = bounds.minX + depth
    const rightX = bounds.maxX - depth
    const candidates = [
      [leftX, -hd * 0.15, 90],
      [leftX, hd * 0.15, 90],
      [leftX, 0, 90],
      [rightX, -hd * 0.15, 270],
      [rightX, 0, 270],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
  }

  function placeBookshelf(obj) {
    // Against a wall
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const depth = catalog.footprint.depth * scale / 2
    const leftX = bounds.minX + depth
    const rightX = bounds.maxX - depth
    const candidates = [
      [leftX, hd * 0.35, 90],
      [leftX, -hd * 0.35, 90],
      [rightX, hd * 0.35, 270],
      [rightX, -hd * 0.35, 270],
      [0, bounds.minZ + depth, 0],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
  }

  function placeNightstand(obj, index) {
    if (!anchors.bed) {
      fallbackPlace(obj)
      return
    }
    // Place beside bed — left for index 0, right for index 1
    const bed = anchors.bed
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const nsHw = catalog.footprint.width * scale / 2
    const offsetX = bed.hw + nsHw + FURNITURE_GAP
    const side = index === 0 ? -1 : 1
    const x = bed.x + side * offsetX
    const z = bed.z - bed.hd + catalog.footprint.depth * scale / 2
    const candidates = [
      [x, z, 0],
      [bed.x + side * (bed.hw + nsHw + 0.5), z, 0],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
  }

  function placeCoffeeTable(obj) {
    if (!anchors.sofa) {
      fallbackPlace(obj)
      return
    }
    // In front of sofa (toward back wall from sofa)
    const sofa = anchors.sofa
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const ctHd = catalog.footprint.depth * scale / 2
    const gap = sofa.hd + ctHd + 1.5
    const z = sofa.z - gap
    const candidates = [
      [sofa.x, z, 0],
      [sofa.x, sofa.z - sofa.hd - ctHd - 0.8, 0],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
  }

  function placeArmchair(obj, index) {
    if (anchors.sofa) {
      // Beside sofa, facing inward
      const sofa = anchors.sofa
      const catalog = catalogMap.get(obj.furnitureId)
      const scale = obj.scale || 1
      const acHw = catalog.footprint.width * scale / 2
      const side = index === 0 ? -1 : 1
      const offsetX = sofa.hw + acHw + 1.5
      const candidates = [
        [sofa.x + side * offsetX, sofa.z - 1, side === -1 ? 90 : 270],
        [sofa.x + side * offsetX, sofa.z, side === -1 ? 90 : 270],
      ]
      if (tryPlaceCandidates(obj, candidates)) return
    }
    // Near center
    const candidates = [
      [-hw * 0.35, hd * 0.2, 90],
      [hw * 0.35, hd * 0.2, 270],
      [0, hd * 0.3, 0],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
  }

  function placeOfficeChair(obj) {
    if (anchors.desk) {
      // In front of desk
      const desk = anchors.desk
      const rot = desk.rotation
      const catalog = catalogMap.get(obj.furnitureId)
      const scale = obj.scale || 1
      const chairHd = catalog.footprint.depth * scale / 2
      let x = desk.x, z = desk.z
      if (rot === 270) {
        x = desk.x - desk.hd - chairHd - 0.5
        z = desk.z
      } else if (rot === 90) {
        x = desk.x + desk.hd + chairHd + 0.5
        z = desk.z
      } else {
        z = desk.z + desk.hd + chairHd + 0.5
      }
      const candidates = [
        [x, z, (rot + 180) % 360],
        [x, z, rot],
      ]
      if (tryPlaceCandidates(obj, candidates)) return
    }
    fallbackPlace(obj)
  }

  function placeDiningChair(obj, index) {
    if (!anchors.diningTable) {
      fallbackPlace(obj)
      return
    }
    const dt = anchors.diningTable
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const chairHd = catalog.footprint.depth * scale / 2
    // Place around table: back, front, left, right
    const positions = [
      [dt.x, dt.z - dt.hd - chairHd - 0.3, 0],       // back
      [dt.x, dt.z + dt.hd + chairHd + 0.3, 180],      // front
      [dt.x - dt.hw - chairHd - 0.3, dt.z, 90],       // left
      [dt.x + dt.hw + chairHd + 0.3, dt.z, 270],      // right
      // Extra positions for more chairs
      [dt.x - 2, dt.z - dt.hd - chairHd - 0.3, 0],
      [dt.x + 2, dt.z - dt.hd - chairHd - 0.3, 0],
    ]
    const pos = positions[index % positions.length]
    if (!tryPlace(obj, pos[0], pos[1], pos[2])) fallbackPlace(obj)
  }

  function placeSideTable(obj, index) {
    // Beside an armchair or sofa
    if (anchors.sofa) {
      const sofa = anchors.sofa
      const catalog = catalogMap.get(obj.furnitureId)
      const scale = obj.scale || 1
      const stHw = catalog.footprint.width * scale / 2
      const side = index === 0 ? 1 : -1
      const x = sofa.x + side * (sofa.hw + stHw + 0.3)
      const candidates = [
        [x, sofa.z, 0],
        [x, sofa.z - 1, 0],
      ]
      if (tryPlaceCandidates(obj, candidates)) return
    }
    if (anchors.bed) {
      const bed = anchors.bed
      const x = index === 0 ? bed.x - bed.hw - 1.5 : bed.x + bed.hw + 1.5
      if (tryPlace(obj, x, bed.z, 0)) return
    }
    fallbackPlace(obj)
  }

  function placeRug(obj) {
    // Center of seating area or room center
    const cx = anchors.sofa ? anchors.sofa.x : anchors.bed ? anchors.bed.x : 0
    const cz = anchors.sofa
      ? anchors.sofa.z - 1
      : anchors.bed
      ? anchors.bed.z + anchors.bed.hd + 2
      : 0
    // Rugs are stackable, always succeeds
    tryPlace(obj, cx, cz, 0)
  }

  function placeFloorLamp(obj, index) {
    // Corners or beside seating
    const candidates = [
      [bounds.minX + 1, bounds.maxZ - 1, 0],
      [bounds.maxX - 1, bounds.maxZ - 1, 0],
      [bounds.minX + 1, bounds.minZ + 1, 0],
      [bounds.maxX - 1, bounds.minZ + 1, 0],
    ]
    const start = index % candidates.length
    const ordered = [...candidates.slice(start), ...candidates.slice(0, start)]
    if (!tryPlaceCandidates(obj, ordered)) fallbackPlace(obj)
  }

  function placePlant(obj, index) {
    // Corners
    const corners = [
      [bounds.maxX - 1, bounds.maxZ - 1, 0],
      [bounds.minX + 1, bounds.maxZ - 1, 0],
      [bounds.maxX - 1, bounds.minZ + 1, 0],
      [bounds.minX + 1, bounds.minZ + 1, 0],
    ]
    const pos = corners[index % corners.length]
    if (!tryPlace(obj, pos[0], pos[1], pos[2])) fallbackPlace(obj)
  }

  function placeTableLamp(obj, index) {
    // On top of nightstand or side table — find a surface to sit on
    for (const p of placed) {
      const pCatalog = catalogMap.get(p.furnitureId)
      if (!pCatalog || !pCatalog.surfaceHeight) continue
      // Check if we already placed a lamp on this surface
      const alreadyHasLamp = placed.some(
        (o) =>
          o.furnitureId === 'table-lamp' &&
          Math.abs(o.position[0] - p.position[0]) < 0.5 &&
          Math.abs(o.position[2] - p.position[2]) < 0.5
      )
      if (alreadyHasLamp) continue
      const y = pCatalog.surfaceHeight * (p.scale || 1)
      obj._placed = { x: p.position[0], z: p.position[2], rotation: 0, hw: 0.4, hd: 0.4, y }
      return
    }
    // Fallback: place on floor
    fallbackPlace(obj)
  }

  function placeWallArt(obj, index) {
    // On back wall
    const z = bounds.minZ + 0.1
    const positions = [0, -hw * 0.3, hw * 0.3]
    const x = positions[index % positions.length]
    obj._placed = { x, z, rotation: 0, hw: 1.25, hd: 0.1, y: 4 }
  }

  // --- Kitchen placement strategies ---

  function placeKitchenCounter(obj) {
    // Along back wall
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const depth = catalog.footprint.depth * scale / 2
    const backZ = bounds.minZ + depth
    const candidates = [
      [-hw * 0.25, backZ, 0],
      [0, backZ, 0],
      [hw * 0.25, backZ, 0],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
    if (obj._placed) anchors.kitchenCounter = obj._placed
  }

  function placeFridge(obj) {
    // Corner of back wall, against left or right wall
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const depth = catalog.footprint.depth * scale / 2
    const width = catalog.footprint.width * scale / 2
    const candidates = [
      [bounds.maxX - width, bounds.minZ + depth, 0],
      [bounds.minX + width, bounds.minZ + depth, 0],
      [bounds.maxX - depth, -hd * 0.2, 270],
      [bounds.minX + depth, -hd * 0.2, 90],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
    if (obj._placed) anchors.fridge = obj._placed
  }

  function placeStove(obj) {
    // Along back wall, beside counter
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const depth = catalog.footprint.depth * scale / 2
    const backZ = bounds.minZ + depth
    const cx = anchors.kitchenCounter
      ? anchors.kitchenCounter.x + anchors.kitchenCounter.hw + catalog.footprint.width * scale / 2 + 0.2
      : hw * 0.15
    const candidates = [
      [cx, backZ, 0],
      [-hw * 0.1, backZ, 0],
      [hw * 0.1, backZ, 0],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
    if (obj._placed) anchors.stove = obj._placed
  }

  function placeSinkCabinet(obj) {
    // Along back wall, typically under window or beside counter
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const depth = catalog.footprint.depth * scale / 2
    const backZ = bounds.minZ + depth
    const cx = anchors.kitchenCounter
      ? anchors.kitchenCounter.x - anchors.kitchenCounter.hw - catalog.footprint.width * scale / 2 - 0.2
      : 0
    const candidates = [
      [cx, backZ, 0],
      [0, backZ, 0],
      [hw * 0.2, backZ, 0],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
    if (obj._placed) anchors.sink = obj._placed
  }

  function placeKitchenIsland(obj) {
    // Center of kitchen, parallel to counter
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const candidates = [
      [0, 0, 0],
      [0, hd * 0.1, 0],
      [-hw * 0.15, 0, 0],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
    if (obj._placed) anchors.kitchenIsland = obj._placed
  }

  function placeDishwasher(obj) {
    // Beside sink on back wall
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const depth = catalog.footprint.depth * scale / 2
    const backZ = bounds.minZ + depth
    if (anchors.sink) {
      const sx = anchors.sink.x + anchors.sink.hw + catalog.footprint.width * scale / 2 + 0.2
      const candidates = [
        [sx, backZ, 0],
        [anchors.sink.x - anchors.sink.hw - catalog.footprint.width * scale / 2 - 0.2, backZ, 0],
      ]
      if (tryPlaceCandidates(obj, candidates)) return
    }
    // Fallback: along left wall
    const leftX = bounds.minX + depth
    const candidates = [
      [leftX, 0, 90],
      [leftX, -hd * 0.2, 90],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
  }

  function placeKitchenCabinet(obj, index) {
    // Wall-mounted above counter/sink on back wall
    const z = bounds.minZ + 0.1
    const positions = anchors.kitchenCounter
      ? [anchors.kitchenCounter.x, anchors.kitchenCounter.x - 2.5, anchors.kitchenCounter.x + 2.5]
      : [0, -hw * 0.25, hw * 0.25]
    const x = positions[index % positions.length]
    obj._placed = { x, z, rotation: 0, hw: 2, hd: 0.5, y: 5.5 }
  }

  function placeMicrowave(obj) {
    // On top of counter or kitchen island
    for (const p of placed) {
      if (p.furnitureId !== 'kitchen-counter' && p.furnitureId !== 'kitchen-island') continue
      const pCatalog = catalogMap.get(p.furnitureId)
      if (!pCatalog || !pCatalog.surfaceHeight) continue
      const alreadyUsed = placed.some(
        (o) => o.furnitureId === 'microwave' &&
          Math.abs(o.position[0] - p.position[0]) < 1 &&
          Math.abs(o.position[2] - p.position[2]) < 1
      )
      if (alreadyUsed) continue
      const y = pCatalog.surfaceHeight * (p.scale || 1)
      obj._placed = { x: p.position[0], z: p.position[2], rotation: 0, hw: 0.75, hd: 0.6, y }
      return
    }
    fallbackPlace(obj)
  }

  function placeBarStool(obj, index) {
    // In front of kitchen island or counter
    const anchor = anchors.kitchenIsland || anchors.kitchenCounter
    if (!anchor) {
      fallbackPlace(obj)
      return
    }
    const catalog = catalogMap.get(obj.furnitureId)
    const scale = obj.scale || 1
    const stoolHd = catalog.footprint.depth * scale / 2
    const z = anchor.z + anchor.hd + stoolHd + 0.3
    const spacing = 2
    const startX = anchor.x - (spacing * 0.5)
    const x = startX + index * spacing
    const candidates = [
      [x, z, 180],
      [x + 1, z, 180],
    ]
    if (!tryPlaceCandidates(obj, candidates)) fallbackPlace(obj)
  }

  // --- Main placement loop ---
  const itemCounters = {}

  for (const item of expanded) {
    const fid = item.furnitureId
    const idx = itemCounters[fid] || 0
    itemCounters[fid] = idx + 1

    switch (fid) {
      case 'bed': placeBed(item); break
      case 'sofa': placeSofa(item); break
      case 'tv-stand': placeTvStand(item); break
      case 'dining-table': placeDiningTable(item); break
      case 'desk': placeDesk(item); break
      case 'wardrobe': placeWardrobe(item); break
      case 'bookshelf': placeBookshelf(item); break
      case 'nightstand': placeNightstand(item, idx); break
      case 'coffee-table': placeCoffeeTable(item); break
      case 'armchair': placeArmchair(item, idx); break
      case 'office-chair': placeOfficeChair(item); break
      case 'dining-chair': placeDiningChair(item, idx); break
      case 'side-table': placeSideTable(item, idx); break
      case 'rug': placeRug(item); break
      case 'floor-lamp': placeFloorLamp(item, idx); break
      case 'plant': placePlant(item, idx); break
      case 'table-lamp': placeTableLamp(item, idx); break
      case 'wall-art': placeWallArt(item, idx); break
      // Kitchen
      case 'kitchen-counter': placeKitchenCounter(item); break
      case 'fridge': placeFridge(item); break
      case 'stove': placeStove(item); break
      case 'sink-cabinet': placeSinkCabinet(item); break
      case 'kitchen-island': placeKitchenIsland(item); break
      case 'dishwasher': placeDishwasher(item); break
      case 'kitchen-cabinet': placeKitchenCabinet(item, idx); break
      case 'microwave': placeMicrowave(item); break
      case 'bar-stool': placeBarStool(item, idx); break
      default: fallbackPlace(item); break
    }

    if (item._placed) {
      const catalog = catalogMap.get(fid)
      let y = 0
      if (item._placed.y !== undefined) {
        y = item._placed.y
      } else if (catalog?.wallMounted) {
        y = catalog.mountHeight ?? 4
      }
      placed.push({
        furnitureId: fid,
        position: [item._placed.x, y, item._placed.z],
        rotation: item._placed.rotation,
        scale: item.scale || 1,
        color: catalog?.defaultColor ?? '#8B7355',
      })
    }
  }

  return placed
}
