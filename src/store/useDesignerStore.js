import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { findFreePosition } from '../utils/furnitureCollision'
import { demoBedroom, demoLivingRoom } from '../data/demoDesigns'

const MAX_HISTORY = 50

function cloneObjects(objects) {
  return JSON.parse(JSON.stringify(objects))
}

const useDesignerStore = create((set, get) => ({
  // App screen
  screen: 'select',

  // Room
  selectedRoom: null,
  roomWallColor: null,   // null = use room default
  roomFloorColor: null,  // null = use room default
  setRoom: (room) => set({
    selectedRoom: room,
    screen: 'design',
    objects: [],
    selectedObjectId: null,
    roomWallColor: null,
    roomFloorColor: null,
    history: [[]],
    historyIndex: 0,
    viewMode: 'dollhouse',
    lightingMode: 'off',
  }),
  setWallColor: (color) => set({ roomWallColor: color }),
  setFloorColor: (color) => set({ roomFloorColor: color }),

  // Placed objects
  objects: [],

  addObject: (furnitureId, catalogItem) => {
    set((state) => {
      const draft = { furnitureId, rotation: 0, scale: 1 }
      const position = state.selectedRoom
        ? findFreePosition(draft, state.objects, state.selectedRoom)
        : [0, 0, 0]
      const newObj = {
        id: nanoid(),
        furnitureId,
        position,
        rotation: 0,
        scale: 1,
        color: catalogItem?.defaultColor ?? '#8B7355',
      }
      const newObjects = [...state.objects, newObj]
      const history = [...state.history.slice(0, state.historyIndex + 1), cloneObjects(newObjects)].slice(-MAX_HISTORY)
      return { objects: newObjects, selectedObjectId: newObj.id, history, historyIndex: history.length - 1 }
    })
  },

  updateObject: (id, changes) => {
    set((state) => {
      const newObjects = state.objects.map((o) => (o.id === id ? { ...o, ...changes } : o))
      const history = [...state.history.slice(0, state.historyIndex + 1), cloneObjects(newObjects)].slice(-MAX_HISTORY)
      return { objects: newObjects, history, historyIndex: history.length - 1 }
    })
  },

  // Position-only update during drag — does NOT add to history
  moveObject: (id, position) => {
    set((state) => ({
      objects: state.objects.map((o) => (o.id === id ? { ...o, position } : o)),
    }))
  },

  // Live property update (e.g. slider in-progress) — does NOT add to history
  updateObjectLive: (id, changes) => {
    set((state) => ({
      objects: state.objects.map((o) => (o.id === id ? { ...o, ...changes } : o)),
    }))
  },

  removeObject: (id) => {
    set((state) => {
      const newObjects = state.objects.filter((o) => o.id !== id)
      const history = [...state.history.slice(0, state.historyIndex + 1), cloneObjects(newObjects)].slice(-MAX_HISTORY)
      return {
        objects: newObjects,
        selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
        history,
        historyIndex: history.length - 1,
      }
    })
  },

  // Selection
  selectedObjectId: null,
  selectObject: (id) => set({ selectedObjectId: id }),
  clearSelection: () => set({ selectedObjectId: null }),

  // Camera view mode
  viewMode: 'dollhouse',
  setViewMode: (mode) => set({ viewMode: mode }),

  // Grid snap
  gridSnap: false,
  gridSize: 0.5,
  toggleGridSnap: () => set((s) => ({ gridSnap: !s.gridSnap })),
  setGridSize: (size) => set({ gridSize: size }),

  // Wall snap
  wallSnap: false,
  toggleWallSnap: () => set((s) => ({ wallSnap: !s.wallSnap })),

  // Lighting mood
  lightingMode: 'off',   // 'off' | 'bright' | 'cozy' | 'evening' | 'night'
  setLightingMode: (mode) => set({ lightingMode: mode }),

  // Realistic 3D models (GLB) toggle
  realisticMode: false,
  toggleRealisticMode: () => set((s) => ({ realisticMode: !s.realisticMode })),

  // Measurements
  showRoomDimensions: false,
  showProductDimensions: false,
  measureUnit: 'ft',
  toggleRoomDimensions: () => set((s) => ({ showRoomDimensions: !s.showRoomDimensions })),
  toggleProductDimensions: () => set((s) => ({ showProductDimensions: !s.showProductDimensions })),
  setMeasureUnit: (unit) => set({ measureUnit: unit }),

  // History (undo/redo)
  history: [],
  historyIndex: -1,

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex <= 0) return
    set({ objects: history[historyIndex - 1], historyIndex: historyIndex - 1, selectedObjectId: null })
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return
    set({ objects: history[historyIndex + 1], historyIndex: historyIndex + 1, selectedObjectId: null })
  },

  // Export / Import
  exportDesign: () => {
    const { selectedRoom, objects, roomWallColor, roomFloorColor } = get()
    return JSON.stringify({ selectedRoom, objects, roomWallColor, roomFloorColor }, null, 2)
  },

  importDesign: (json) => {
    try {
      const data = JSON.parse(json)
      const importedObjects = data.objects ?? []
      set({
        selectedRoom: data.selectedRoom,
        objects: importedObjects,
        roomWallColor: data.roomWallColor ?? null,
        roomFloorColor: data.roomFloorColor ?? null,
        screen: 'design',
        selectedObjectId: null,
        history: [cloneObjects(importedObjects)],
        historyIndex: 0,
      })
    } catch (e) {
      console.error('Failed to import design:', e)
    }
  },

  // Copy / Paste
  copiedObjectData: null,
  copyObject: (id) => {
    const obj = get().objects.find((o) => o.id === id)
    if (obj) set({ copiedObjectData: { ...obj } })
  },
  pasteObject: () => {
    const { copiedObjectData, selectedRoom } = get()
    if (!copiedObjectData) return
    set((state) => {
      const startX = copiedObjectData.position[0] + 1.5
      const startZ = copiedObjectData.position[2] + 1.5
      const position = selectedRoom
        ? findFreePosition(copiedObjectData, state.objects, selectedRoom, startX, startZ)
        : [startX, 0, startZ]
      const newObj = { ...copiedObjectData, id: nanoid(), position }
      const newObjects = [...state.objects, newObj]
      const history = [...state.history.slice(0, state.historyIndex + 1), cloneObjects(newObjects)].slice(-MAX_HISTORY)
      return { objects: newObjects, selectedObjectId: newObj.id, history, historyIndex: history.length - 1 }
    })
  },

  // Load demo design
  loadDemo: (demo) => {
    const objects = demo.objects.map((o) => ({ ...o, id: nanoid() }))
    set({
      selectedRoom: demo.selectedRoom,
      objects,
      roomWallColor: demo.roomWallColor,
      roomFloorColor: demo.roomFloorColor,
      screen: 'design',
      selectedObjectId: null,
      history: [cloneObjects(objects)],
      historyIndex: 0,
      viewMode: 'dollhouse',
      lightingMode: 'cozy',
    })
  },

  // Go back to room selection
  goToSelect: () => set({ screen: 'select', selectedObjectId: null }),

  // Go to custom room builder
  goToCustom: () => set({ screen: 'custom', selectedObjectId: null }),
}))

export default useDesignerStore
