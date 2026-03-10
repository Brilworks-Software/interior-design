# 3D Room Designer — Project Plan

## Overview

A browser-based interior design tool where users select a preset room, view it in an interactive 3D dollhouse perspective, furnish it with household objects from a catalog, and save/export their designs. Built for client demos — semi-realistic visual style with clean geometry, textured materials, and good lighting.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Build tool | Vite | Fast dev server, good Three.js support |
| UI framework | React 18 | Component-based, Claude Code handles well |
| 3D engine | Three.js + @react-three/fiber | React integration for Three.js |
| 3D helpers | @react-three/drei | OrbitControls, shadows, helpers, etc. |
| State management | Zustand | Lightweight, no boilerplate, good for complex 3D state |
| Styling | Tailwind CSS | Rapid UI styling |
| Icons | lucide-react | Clean icon set |
| ID generation | nanoid | Unique IDs for placed objects |

---

## Project Structure

```
room-designer/
├── public/
│   └── textures/                  # Optional: wood, fabric textures (can add later)
├── src/
│   ├── main.jsx                   # Entry point
│   ├── App.jsx                    # Top-level routing (room select vs designer)
│   │
│   ├── store/
│   │   └── useDesignerStore.js    # Zustand store — single source of truth
│   │
│   ├── data/
│   │   ├── rooms.js               # Preset room definitions
│   │   └── furnitureCatalog.js    # Furniture catalog definitions
│   │
│   ├── components/
│   │   ├── RoomSelector/
│   │   │   ├── RoomSelector.jsx   # Grid of room cards
│   │   │   └── RoomCard.jsx       # Individual room card with thumbnail
│   │   │
│   │   ├── Designer/
│   │   │   ├── DesignerLayout.jsx # Main layout (sidebar + viewport + panel)
│   │   │   ├── Viewport.jsx       # Canvas + scene setup
│   │   │   ├── ViewportControls.jsx # Zoom, view angle buttons overlay
│   │   │   │
│   │   │   ├── Catalog/
│   │   │   │   ├── CatalogSidebar.jsx    # Left sidebar
│   │   │   │   ├── CategoryFilter.jsx    # Category tabs/buttons
│   │   │   │   └── CatalogItem.jsx       # Individual furniture item card
│   │   │   │
│   │   │   ├── Properties/
│   │   │   │   ├── PropertiesPanel.jsx   # Right panel (shows when object selected)
│   │   │   │   ├── RotationControl.jsx   # Rotation slider
│   │   │   │   ├── ScaleControl.jsx      # Resize slider
│   │   │   │   └── ColorControl.jsx      # Color picker
│   │   │   │
│   │   │   └── Toolbar.jsx        # Top bar: save, export, undo, redo, back
│   │
│   ├── three/
│   │   ├── Room.jsx               # 3D room shell (walls, floor, ceiling)
│   │   ├── FurnitureGroup.jsx     # Wrapper for placed furniture (selection, transform)
│   │   ├── DragPlane.jsx          # Invisible floor plane for raycasting drag
│   │   ├── SceneSetup.jsx         # Lights, shadows, environment
│   │   │
│   │   └── furniture/             # One file per furniture piece
│   │       ├── Sofa.jsx
│   │       ├── ArmChair.jsx
│   │       ├── DiningTable.jsx
│   │       ├── DiningChair.jsx
│   │       ├── CoffeeTable.jsx
│   │       ├── Bookshelf.jsx
│   │       ├── TVStand.jsx
│   │       ├── Bed.jsx
│   │       ├── Wardrobe.jsx
│   │       ├── Desk.jsx
│   │       ├── OfficeChair.jsx
│   │       ├── FloorLamp.jsx
│   │       ├── TableLamp.jsx
│   │       ├── Rug.jsx
│   │       ├── Plant.jsx
│   │       ├── SideTable.jsx
│   │       ├── DiningSet.jsx      # Table + chairs grouped
│   │       └── index.js           # Registry mapping furniture ID → component
│   │
│   └── utils/
│       ├── exportDesign.js        # Save/load JSON
│       ├── screenshot.js          # Capture canvas as PNG
│       └── constants.js           # Shared constants (colors, defaults)
│
├── index.html
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

## Zustand Store Design

```js
// store/useDesignerStore.js

{
  // App state
  screen: 'select' | 'design',       // Which screen is active

  // Room
  selectedRoom: null,                  // Room definition object
  setRoom: (room) => {},

  // Placed objects array
  objects: [
    {
      id: 'nano-id-string',
      furnitureId: 'sofa',             // Maps to catalog + component
      position: [x, y, z],            // Three.js coordinates
      rotation: 0,                     // Y-axis rotation in degrees
      scale: 1,                        // Uniform scale factor
      color: '#8B7355',                // Current color
    }
  ],
  addObject: (furnitureId) => {},      // Adds at room center
  updateObject: (id, changes) => {},   // Partial update
  removeObject: (id) => {},
  
  // Selection
  selectedObjectId: null,
  selectObject: (id) => {},
  clearSelection: () => {},

  // Camera
  viewMode: 'dollhouse' | 'top' | 'front' | 'side',
  setViewMode: (mode) => {},

  // History (undo/redo)
  history: [],
  historyIndex: -1,
  undo: () => {},
  redo: () => {},

  // Export
  exportDesign: () => {},              // Returns JSON blob
  importDesign: (json) => {},          // Loads from JSON
}
```

---

## Data Definitions

### Room Presets (`data/rooms.js`)

Each room is defined as:

```js
{
  id: 'neutral-standard',
  name: 'Neutral Standard',
  sqft: 247,
  // Dimensions in Three.js units (1 unit = 1 foot)
  width: 19,        // X axis
  depth: 13,        // Z axis
  height: 9,        // Y axis (wall height)
  // Wall config — which walls exist and where doors/windows are
  walls: {
    back:  { exists: true },
    left:  { exists: true, door: { position: 0.3, width: 3 } },
    right: { exists: true, window: { position: 0.5, width: 4, height: 3, elevation: 3 } },
    front: { exists: false }   // Open side for dollhouse view
  },
  // Appearance
  floorColor: '#C4A882',       // Warm wood
  wallColor: '#F5F0EB',        // Off-white
  floorTexture: 'wood',        // For future texture mapping
  style: 'neutral',            // Tag for thumbnail styling
}
```

Define **8 rooms** matching the IKEA-style grid:
1. Neutral Standard (247 sq.ft) — off-white walls, light wood floor
2. Open Spacious (473 sq.ft) — white walls, light wood floor, big windows
3. Bright Spacious (279 sq.ft) — white walls, large windows, bright lighting
4. Cozy Contemporary (193 sq.ft) — dark accent wall, warm wood floor
5. Warm Contemporary (172 sq.ft) — warm-toned walls, medium wood floor
6. Peaceful Hideaway (164 sq.ft) — soft blue-gray walls, light floor
7. Refreshing Oasis (226 sq.ft) — white walls, dark wood floor
8. Sunny Natural (226 sq.ft) — cream walls, natural wood, extra light sources

### Furniture Catalog (`data/furnitureCatalog.js`)

Each item:

```js
{
  id: 'sofa',
  name: 'Sofa',
  category: 'seating',          // seating | tables | storage | lighting | decor | bedroom
  defaultColor: '#8B7355',
  colorOptions: ['#8B7355', '#4A4A4A', '#C4A882', '#2F4F4F', '#8B0000'],
  defaultScale: 1,
  minScale: 0.6,
  maxScale: 1.4,
  // Footprint for placement validation
  footprint: { width: 6, depth: 3 },
  // Description for the catalog card
  description: '3-seat sofa',
}
```

**18 furniture items across 6 categories:**

| Category | Items |
|----------|-------|
| Seating | Sofa, Armchair, Dining Chair, Office Chair |
| Tables | Dining Table, Coffee Table, Side Table, Desk |
| Storage | Bookshelf, TV Stand, Wardrobe |
| Lighting | Floor Lamp, Table Lamp |
| Decor | Rug, Plant (potted), Wall Art (flat) |
| Bedroom | Bed, Nightstand |

---

## Furniture Rendering Strategy

### Approach: Parametric Geometry (GLTF-Ready)

Each furniture piece is a React component that builds geometry from Three.js primitives. Every component follows this contract:

```jsx
// three/furniture/Sofa.jsx
export default function Sofa({ color = '#8B7355' }) {
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[6, 0.5, 3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 1.5, -1.2]} castShadow>
        <boxGeometry args={[6, 1.2, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-2.7, 1.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Right arm */}
      <mesh position={[2.7, 1.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}
```

**Key principles for each furniture component:**
- Accept `color` prop — apply to ALL meshes in the group
- All meshes set `castShadow` and `receiveShadow` where appropriate
- Use `meshStandardMaterial` with appropriate `roughness` and `metalness`
- Center the geometry at origin, with the bottom sitting at Y=0 (floor level)
- Use reasonable real-world proportions (1 unit = 1 foot)

**To swap in GLTF models later**, replace the component body:
```jsx
import { useGLTF } from '@react-three/drei'
export default function Sofa({ color }) {
  const { scene } = useGLTF('/models/sofa.glb')
  // Clone, apply color, return
}
```

### Furniture Registry (`three/furniture/index.js`)

```js
import Sofa from './Sofa'
import ArmChair from './ArmChair'
// ...

export const furnitureComponents = {
  sofa: Sofa,
  armchair: ArmChair,
  // ...
}
```

This registry is used by `FurnitureGroup.jsx` to dynamically render the correct component.

---

## 3D Scene Architecture

### Scene Setup (`three/SceneSetup.jsx`)

```
- Ambient light (soft fill, intensity 0.4)
- Directional light (main, casts shadows, position top-right)
- Hemisphere light (sky/ground color for natural feel)
- Shadow map: 2048x2048, soft shadows
- Fog: very subtle, adds depth
```

### Room Shell (`three/Room.jsx`)

- Floor: `PlaneGeometry` rotated flat, receives shadows
- Walls: `BoxGeometry` or `PlaneGeometry` — only render walls marked `exists: true`
- Front wall always absent (dollhouse open side)
- Windows: cut out from wall geometry using CSG (Constructive Solid Geometry) via `three-bvh-csg` OR simpler approach — just leave a gap in the wall by rendering wall segments around the window opening
- Door: similar gap approach
- Baseboard trim: thin box along wall base (subtle detail that adds realism)

### FurnitureGroup Wrapper (`three/FurnitureGroup.jsx`)

Every placed object is wrapped in this component:

```jsx
<FurnitureGroup
  id={obj.id}
  position={obj.position}
  rotation={obj.rotation}
  scale={obj.scale}
  isSelected={obj.id === selectedObjectId}
  onSelect={() => selectObject(obj.id)}
>
  <FurnitureComponent color={obj.color} />
</FurnitureGroup>
```

This wrapper handles:
- Positioning and rotation transforms
- Click-to-select (stopPropagation to prevent orbit control interference)
- Visual selection indicator (wireframe bounding box or subtle glow outline)
- Hover cursor change

---

## Critical Implementation Details

### 1. Drag-to-Position on Floor Plane

This is the trickiest interaction. Here's the approach:

```
1. User clicks a placed object → it becomes "selected"
2. User can then drag it → enters "dragging" mode
3. During drag:
   a. Disable OrbitControls
   b. Raycast from mouse position onto an invisible floor plane (DragPlane.jsx)
   c. Update object position to the intersection point
   d. Clamp position to stay within room bounds
4. On mouse up → exit dragging, re-enable OrbitControls
```

**DragPlane.jsx**: An invisible `PlaneGeometry` the size of the room floor, at Y=0, with `visible={false}`. Used purely as a raycast target.

**Important**: Use `@react-three/fiber`'s `useThree` to get the raycaster and camera. Use pointer events (`onPointerDown`, `onPointerMove`, `onPointerUp`) on the drag plane.

### 2. Click Selection vs Orbit Control Conflict

```
- onPointerDown on a furniture object: 
    → e.stopPropagation() to prevent orbit control from consuming the event
    → Set selectedObjectId in store
- onPointerDown on empty space (floor or walls):
    → clearSelection()
    → Let OrbitControls handle the event normally
- When dragging an object:
    → Temporarily disable OrbitControls via ref: controlsRef.current.enabled = false
    → Re-enable on pointer up
```

### 3. Camera View Switching

Store preset camera positions and targets:

```js
const viewPresets = {
  dollhouse: { position: [15, 12, 15], target: [0, 0, 0] },
  top:       { position: [0, 20, 0],   target: [0, 0, 0] },
  front:     { position: [0, 5, 15],   target: [0, 3, 0] },
  side:      { position: [15, 5, 0],   target: [0, 3, 0] },
}
```

Animate transitions using `drei`'s `CameraControls` or manually interpolate with `useFrame`. Smooth 500ms transition between views.

### 4. Color Changing on Multi-Part Furniture

Each furniture component accepts a `color` prop and applies it to ALL child meshes. When user picks a new color in PropertiesPanel:

```
→ updateObject(selectedId, { color: newColor })
→ Store updates → React re-renders → Furniture component receives new color prop
→ All meshes update automatically
```

### 5. Performance Considerations

- Enable shadow maps but limit shadow-casting to the main directional light only
- Use `shadowMap.type = THREE.PCFSoftShadowMap` for quality
- Set shadow camera frustum to room bounds (don't waste shadow map resolution)
- Use `React.memo` on furniture components to avoid unnecessary re-renders
- Instanced geometry is NOT needed at this scale (< 50 objects)

---

## UI Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Rooms    Room: Neutral Standard    💾 Save  📷 Screenshot │  ← Toolbar
├────────────┬──────────────────────────────────┬──────────────────┤
│            │                                  │                  │
│  CATALOG   │         3D VIEWPORT              │   PROPERTIES     │
│            │                                  │                  │
│ [Seating]  │   ┌─────────────────────┐        │  Selected: Sofa  │
│ [Tables]   │   │                     │        │                  │
│ [Storage]  │   │   Dollhouse View    │        │  Rotation: ──●── │
│ [Lighting] │   │                     │        │  Scale:    ──●── │
│ [Decor]    │   │   of furnished      │        │  Color:   🔴🔵🟢 │
│ [Bedroom]  │   │   room              │        │                  │
│            │   │                     │        │  [Delete Object] │
│ ┌────────┐ │   └─────────────────────┘        │                  │
│ │ 🛋 Sofa │ │                                  │                  │
│ └────────┘ │   [Dollhouse] [Top] [Front] [Side] │               │
│ ┌────────┐ │          View Mode Buttons       │                  │
│ │ 🪑 Chair│ │                                  │                  │
│ └────────┘ │                                  │                  │
│            │                                  │                  │
├────────────┴──────────────────────────────────┴──────────────────┤
│  Status: 5 objects placed | Room: 247 sq.ft                      │
└──────────────────────────────────────────────────────────────────┘
```

- Catalog sidebar: ~240px wide, scrollable
- Properties panel: ~260px wide, only visible when an object is selected
- Viewport: fills remaining space
- View mode buttons: overlaid on bottom of viewport

---

## Implementation Order

Build in this sequence so there's a working demo at every stage:

### Phase 1 — Foundation
1. Scaffold Vite + React + Tailwind project
2. Install Three.js, @react-three/fiber, @react-three/drei, zustand, nanoid, lucide-react
3. Create the Zustand store with basic state
4. Build `App.jsx` with screen routing

### Phase 2 — Room Selection
5. Define room presets in `data/rooms.js`
6. Build `RoomSelector` grid with `RoomCard` components
7. Clicking a card sets the room and switches to design screen

### Phase 3 — 3D Viewport (Core)
8. Build `Viewport.jsx` with R3F Canvas
9. Build `SceneSetup.jsx` (lights, shadows)
10. Build `Room.jsx` — render floor + walls from room definition
11. Add `OrbitControls` from drei
12. **Milestone: You can see a 3D room and orbit around it**

### Phase 4 — Furniture Components
13. Build 5 core pieces first: Sofa, DiningTable, Bookshelf, FloorLamp, Bed
14. Create furniture registry in `three/furniture/index.js`
15. Build `FurnitureGroup.jsx` wrapper with selection highlight
16. Test: hardcode a sofa in the room, verify it renders

### Phase 5 — Catalog & Placement
17. Define furniture catalog in `data/furnitureCatalog.js`
18. Build `CatalogSidebar` with category filters
19. Implement `addObject` — clicking catalog item places it at room center
20. **Milestone: You can add furniture to the room from the catalog**

### Phase 6 — Interaction
21. Build `DragPlane.jsx` for floor raycasting
22. Implement drag-to-reposition with orbit control disabling
23. Implement click-to-select with stopPropagation
24. Build `PropertiesPanel` with rotation slider, scale slider, color picker
25. Implement delete selected object
26. **Milestone: Full interactive furniture placement and editing**

### Phase 7 — View Controls
27. Add view mode buttons (dollhouse, top, front, side)
28. Implement smooth camera transitions between views
29. Add zoom in/out buttons (in addition to scroll zoom)

### Phase 8 — Remaining Furniture
30. Build remaining 13 furniture components
31. Test each one in the scene for proportions and appearance

### Phase 9 — Polish & Export
32. Implement save/export as JSON download
33. Implement import from JSON file
34. Add screenshot capture (canvas.toDataURL)
35. Add undo/redo (if time permits — store history stack)
36. Final visual polish — hover states, transitions, loading states

---

## Room Card Thumbnails (Room Selection Screen)

For the room selection grid, render a **mini 3D preview** of each empty room. Two approaches:

**Option A (Recommended):** Use a small R3F `Canvas` inside each `RoomCard` with a fixed camera angle, no controls, and the room shell rendered. This gives a live 3D preview matching the IKEA screenshot style. Performance is fine for 8 small canvases.

**Option B:** Pre-render static images. Simpler but less impressive for a demo.

---

## Known Gotchas for Claude Code

> Include these notes so Claude Code handles them correctly:

1. **@react-three/fiber Canvas must have an explicit height.** The parent div needs `height: 100vh` or similar. Without this, the canvas will have zero height and nothing renders.

2. **OrbitControls import**: Use `import { OrbitControls } from '@react-three/drei'` — NOT from `three/examples`. Drei's version is the R3F-compatible one.

3. **Pointer events in R3F**: Use `onPointerDown`, `onPointerUp`, `onPointerMove` on mesh elements — NOT `onClick` for drag operations. `onClick` fires after mouse up and doesn't give you drag tracking.

4. **Material color updates**: When using `meshStandardMaterial`, the `color` prop accepts hex strings directly. No need to create `new THREE.Color()` in JSX.

5. **Shadow setup requires ALL of these**: (a) `shadows` prop on `<Canvas>`, (b) `castShadow` on the light, (c) `castShadow` on meshes, (d) `receiveShadow` on the floor, (e) shadow camera frustum sized to the room.

6. **Zustand with R3F**: Components inside `<Canvas>` can use Zustand hooks directly. No special bridging needed.

7. **stopPropagation in R3F**: Call `e.stopPropagation()` in pointer event handlers on furniture to prevent the event from reaching OrbitControls. This is how you distinguish "clicking an object" from "clicking to orbit."

8. **Camera animation**: Use `useFrame` for smooth transitions. Store target position/lookAt in refs and lerp toward them each frame.

9. **Tailwind with Vite**: Need `@tailwindcss/vite` plugin in vite config for Tailwind v4, OR use PostCSS setup for Tailwind v3. Recommend Tailwind v3 for stability.

10. **nanoid import**: Use `import { nanoid } from 'nanoid'` — it's ESM-only in recent versions.

---

## Stretch Goals (Post-MVP)

- Wall color customization per room
- Floor material switching (wood, tile, carpet)
- Snap-to-wall placement for furniture like bookshelves
- Grid snapping for precise alignment
- Copy/paste furniture
- Room dimension editing
- Multi-select and group move
- GLTF model loading for higher-fidelity furniture
- Texture maps on furniture (wood grain, fabric weave)
- Measurement overlay / dimension lines
