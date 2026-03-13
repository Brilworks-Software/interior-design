import { furnitureCatalog } from '../data/furnitureCatalog'
import { rooms } from '../data/rooms'

// Synonym map: user term -> catalog id
const FURNITURE_ALIASES = {
  bed: 'bed',
  'king bed': 'bed',
  'queen bed': 'bed',
  'double bed': 'bed',
  'single bed': 'bed',
  sofa: 'sofa',
  couch: 'sofa',
  settee: 'sofa',
  armchair: 'armchair',
  'arm chair': 'armchair',
  'accent chair': 'armchair',
  'dining chair': 'dining-chair',
  'dining chairs': 'dining-chair',
  chair: 'dining-chair',
  'office chair': 'office-chair',
  'desk chair': 'office-chair',
  'dining table': 'dining-table',
  'coffee table': 'coffee-table',
  'center table': 'coffee-table',
  'centre table': 'coffee-table',
  table: 'dining-table',
  'side table': 'side-table',
  'end table': 'side-table',
  nightstand: 'nightstand',
  'night stand': 'nightstand',
  'bedside table': 'nightstand',
  desk: 'desk',
  'study table': 'desk',
  'work desk': 'desk',
  'computer desk': 'desk',
  bookshelf: 'bookshelf',
  'book shelf': 'bookshelf',
  bookcase: 'bookshelf',
  shelf: 'bookshelf',
  'tv stand': 'tv-stand',
  'tv unit': 'tv-stand',
  'tv console': 'tv-stand',
  'media console': 'tv-stand',
  wardrobe: 'wardrobe',
  closet: 'wardrobe',
  cupboard: 'wardrobe',
  almirah: 'wardrobe',
  'floor lamp': 'floor-lamp',
  'standing lamp': 'floor-lamp',
  lamp: 'floor-lamp',
  'table lamp': 'table-lamp',
  'bedside lamp': 'table-lamp',
  rug: 'rug',
  carpet: 'rug',
  mat: 'rug',
  plant: 'plant',
  'potted plant': 'plant',
  'wall art': 'wall-art',
  painting: 'wall-art',
  poster: 'wall-art',
  frame: 'wall-art',
  // Kitchen
  'kitchen counter': 'kitchen-counter',
  'kitchen countertop': 'kitchen-counter',
  countertop: 'kitchen-counter',
  counter: 'kitchen-counter',
  'kitchen island': 'kitchen-island',
  island: 'kitchen-island',
  fridge: 'fridge',
  refrigerator: 'fridge',
  freezer: 'fridge',
  stove: 'stove',
  oven: 'stove',
  range: 'stove',
  cooktop: 'stove',
  'gas stove': 'stove',
  'sink cabinet': 'sink-cabinet',
  sink: 'sink-cabinet',
  'kitchen sink': 'sink-cabinet',
  'wall cabinet': 'kitchen-cabinet',
  'kitchen cabinet': 'kitchen-cabinet',
  'upper cabinet': 'kitchen-cabinet',
  cabinet: 'kitchen-cabinet',
  microwave: 'microwave',
  dishwasher: 'dishwasher',
  'bar stool': 'bar-stool',
  'bar stools': 'bar-stool',
  stool: 'bar-stool',
  stools: 'bar-stool',
}

// Room type keywords -> best room preset
const ROOM_TYPE_MAP = {
  bedroom: ['bright-spacious', 'neutral-standard', 'peaceful-hideaway'],
  'bed room': ['bright-spacious', 'neutral-standard', 'peaceful-hideaway'],
  'living room': ['open-spacious', 'neutral-standard', 'sunny-natural'],
  livingroom: ['open-spacious', 'neutral-standard', 'sunny-natural'],
  lounge: ['open-spacious', 'cozy-contemporary'],
  'dining room': ['open-spacious', 'warm-contemporary'],
  office: ['neutral-standard', 'bright-spacious'],
  'home office': ['neutral-standard', 'bright-spacious'],
  study: ['neutral-standard', 'peaceful-hideaway'],
  'kids room': ['bright-spacious', 'sunny-natural'],
  'guest room': ['peaceful-hideaway', 'warm-contemporary'],
  kitchen: ['modern-kitchen', 'open-kitchen'],
  'modular kitchen': ['modern-kitchen', 'open-kitchen'],
  'open kitchen': ['open-kitchen', 'modern-kitchen'],
  pantry: ['modern-kitchen'],
}

// Size keywords that suggest room scale
const SIZE_KEYWORDS = {
  small: 'small',
  compact: 'small',
  tiny: 'small',
  cozy: 'small',
  medium: 'medium',
  standard: 'medium',
  normal: 'medium',
  large: 'large',
  big: 'large',
  spacious: 'large',
  huge: 'large',
}

const catalogMap = new Map(furnitureCatalog.map((f) => [f.id, f]))
const roomMap = new Map(rooms.map((r) => [r.id, r]))

/**
 * Parse a natural language room description.
 * Returns { room, items: [{ furnitureId, scale, quantity }], message }
 */
export function parseChatMessage(text) {
  const lower = text.toLowerCase().trim()
  const result = {
    room: null,
    items: [],
    roomType: null,
    sizeHint: null,
    message: '',
  }

  // 1. Detect room type
  for (const [keyword, presetIds] of Object.entries(ROOM_TYPE_MAP)) {
    if (lower.includes(keyword)) {
      result.roomType = keyword
      // Pick the first matching preset
      result.room = roomMap.get(presetIds[0])
      break
    }
  }

  // 2. Detect size preference
  for (const [keyword, size] of Object.entries(SIZE_KEYWORDS)) {
    if (lower.includes(keyword)) {
      result.sizeHint = size
      break
    }
  }

  // Adjust room based on size
  if (result.roomType && result.sizeHint) {
    const presetIds = ROOM_TYPE_MAP[result.roomType]
    if (result.sizeHint === 'small') {
      // Pick the smallest room
      const sorted = presetIds
        .map((id) => roomMap.get(id))
        .filter(Boolean)
        .sort((a, b) => a.sqft - b.sqft)
      if (sorted.length) result.room = sorted[0]
    } else if (result.sizeHint === 'large') {
      // Pick the largest room
      const sorted = presetIds
        .map((id) => roomMap.get(id))
        .filter(Boolean)
        .sort((a, b) => b.sqft - a.sqft)
      if (sorted.length) result.room = sorted[0]
    }
  }

  // If no room type detected, default to neutral-standard
  if (!result.room) {
    result.room = roomMap.get('neutral-standard')
  }

  // 3. Extract furniture items with optional dimensions and quantity
  // Sort aliases by length (longest first) so "side table" matches before "table"
  const sortedAliases = Object.keys(FURNITURE_ALIASES).sort((a, b) => b.length - a.length)

  // Track which parts of the string we've consumed
  let remaining = lower

  for (const alias of sortedAliases) {
    // Use word boundary matching
    const pattern = new RegExp(
      `(?:(?:(\\d+)\\s+)?${escapeRegex(alias)}s?(?:\\s+(\\d+)\\s*[xX*]\\s*(\\d+))?)`,
      'gi'
    )
    let match
    while ((match = pattern.exec(remaining)) !== null) {
      const quantityBefore = match[1] ? parseInt(match[1], 10) : 1
      const dimW = match[2] ? parseInt(match[2], 10) : null
      const dimD = match[3] ? parseInt(match[3], 10) : null

      const furnitureId = FURNITURE_ALIASES[alias]
      const catalog = catalogMap.get(furnitureId)
      if (!catalog) continue

      // Calculate scale from dimensions if provided
      let scale = 1
      if (dimW && dimD) {
        const baseW = catalog.footprint.width
        const scaleW = dimW / baseW
        scale = Math.max(catalog.minScale, Math.min(catalog.maxScale, scaleW))
      }

      // Check if we already added this furniture id (avoid duplicates from alias overlap)
      const existing = result.items.find((it) => it.furnitureId === furnitureId)
      if (!existing) {
        result.items.push({
          furnitureId,
          scale,
          quantity: quantityBefore,
          dimensions: dimW && dimD ? `${dimW}x${dimD}` : null,
        })
      }
    }
  }

  // Also try a dimension-first pattern: "6x6 bed"
  const dimFirstPattern = /(\d+)\s*[xX*]\s*(\d+)\s+(\w[\w\s]*?)(?=\s+and\s+|\s+with\s+|,|$)/gi
  let dimMatch
  while ((dimMatch = dimFirstPattern.exec(lower)) !== null) {
    const dimW = parseInt(dimMatch[1], 10)
    const dimD = parseInt(dimMatch[2], 10)
    const name = dimMatch[3].trim()

    // Try to match the name to an alias
    const matchedAlias = sortedAliases.find((a) => name.includes(a))
    if (matchedAlias) {
      const furnitureId = FURNITURE_ALIASES[matchedAlias]
      const catalog = catalogMap.get(furnitureId)
      if (catalog) {
        const existing = result.items.find((it) => it.furnitureId === furnitureId)
        if (existing && !existing.dimensions) {
          const scaleW = dimW / catalog.footprint.width
          existing.scale = Math.max(catalog.minScale, Math.min(catalog.maxScale, scaleW))
          existing.dimensions = `${dimW}x${dimD}`
        } else if (!existing) {
          const scaleW = dimW / catalog.footprint.width
          result.items.push({
            furnitureId,
            scale: Math.max(catalog.minScale, Math.min(catalog.maxScale, scaleW)),
            quantity: 1,
            dimensions: `${dimW}x${dimD}`,
          })
        }
      }
    }
  }

  // 4. Build response message
  const roomName = result.room?.name || 'Standard Room'
  if (result.items.length === 0) {
    result.message = `I'll set up a ${roomName} for you. You can add furniture from the catalog on the left.`
  } else {
    const itemNames = result.items.map((it) => {
      const catalog = catalogMap.get(it.furnitureId)
      const qty = it.quantity > 1 ? `${it.quantity}x ` : ''
      const dim = it.dimensions ? ` (${it.dimensions})` : ''
      return `${qty}${catalog.name}${dim}`
    })
    const lastItem = itemNames.pop()
    const itemStr = itemNames.length ? itemNames.join(', ') + ' and ' + lastItem : lastItem
    result.message = `Setting up a ${roomName} with ${itemStr}. You can rearrange and customize everything in the designer.`
  }

  return result
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
