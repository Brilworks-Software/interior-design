# 3D Room Designer — Progress Tracker

## Status Legend
- [x] Done
- [~] In progress
- [ ] Not started

---

## Phase 1 — Foundation [COMPLETE]

- [x] Scaffold Vite + React project
- [x] Install dependencies: Three.js, @react-three/fiber, @react-three/drei, zustand, nanoid, lucide-react
- [x] Install Tailwind CSS v3 with PostCSS
- [x] Configure tailwind.config.js with content paths
- [x] Replace index.css with Tailwind directives + global resets
- [x] Create Zustand store (`src/store/useDesignerStore.js`)
  - [x] Screen routing state (select / design)
  - [x] Room state (setRoom)
  - [x] Objects array + addObject / updateObject / removeObject
  - [x] Selection state + selectObject / clearSelection
  - [x] View mode state (dollhouse / top / front / side)
  - [x] Undo / redo with 50-step history stack
  - [x] Export / Import design as JSON
  - [x] goToSelect action
- [x] Build App.jsx with screen routing

---

## Phase 2 — Room Selection [COMPLETE]

- [x] Define 8 room presets in `src/data/rooms.js`
  - [x] Neutral Standard (247 sq.ft)
  - [x] Open Spacious (473 sq.ft)
  - [x] Bright Spacious (279 sq.ft)
  - [x] Cozy Contemporary (193 sq.ft)
  - [x] Warm Contemporary (172 sq.ft)
  - [x] Peaceful Hideaway (164 sq.ft)
  - [x] Refreshing Oasis (226 sq.ft)
  - [x] Sunny Natural (226 sq.ft)
- [x] Define 18 furniture items in `src/data/furnitureCatalog.js`
- [x] Build `RoomSelector.jsx` — responsive grid header + room grid
- [x] Build `RoomCard.jsx` — live 3D mini preview via R3F Canvas + room info
- [x] Clicking a card calls setRoom → switches to design screen

---

## Phase 3 — 3D Viewport (Core) [COMPLETE]

- [x] Build `Viewport.jsx` with R3F Canvas + proper height
- [x] Build `SceneSetup.jsx` — ambient, directional, hemisphere lights + shadows (PCFSoftShadowMap 2048px)
- [x] Build `Room.jsx` — floor, back wall, left wall, right wall from room definition
  - [x] Wall gap approach for windows (segments around opening + glass pane)
  - [x] Wall gap approach for doors
  - [x] Baseboard trim detail
  - [x] Ceiling plane
- [x] Add OrbitControls from drei (damping, polar angle limits)
- [x] Build `DesignerLayout.jsx` (sidebar + viewport + properties panel)
- [x] Build `ViewportControls.jsx` — view mode buttons overlay
- [x] Smooth camera transitions via useFrame lerp
- [x] **Milestone: Orbitable 3D room visible**

---

## Phase 4 — Furniture Components [COMPLETE]

- [x] Build ALL 18 furniture pieces (parametric geometry, color prop, castShadow/receiveShadow)
  - [x] Sofa, ArmChair, DiningChair, OfficeChair
  - [x] DiningTable, CoffeeTable, SideTable, Desk
  - [x] Bookshelf (with books), TVStand, Wardrobe
  - [x] FloorLamp, TableLamp (with emissive bulb glow)
  - [x] Rug, Plant, WallArt
  - [x] Bed, Nightstand
- [x] Furniture registry `src/three/furniture/index.js`
- [x] Build `FurnitureGroup.jsx` — selection wireframe bounding box, transforms

---

## Phase 5 — Catalog & Placement [COMPLETE]

- [x] Build `CatalogSidebar.jsx` with category filter tabs
- [x] Implement `addObject` action — places furniture at room center
- [x] **Milestone: Add furniture from catalog to 3D scene**

---

## Phase 6 — Interaction [COMPLETE]

- [x] Build `DragPlane.jsx` — invisible floor plane for pointer raycasting
- [x] Implement drag-to-reposition (disable OrbitControls during drag, clamp to room bounds)
- [x] Implement click-to-select with stopPropagation
- [x] Build `PropertiesPanel.jsx` — rotation slider, scale slider, color swatches + custom picker
- [x] Implement delete selected object
- [x] **Milestone: Full interactive furniture placement and editing**

---

## Phase 7 — View Controls [COMPLETE]

- [x] Build `ViewportControls.jsx` — dollhouse / top / front / side buttons
- [x] Smooth camera transition via useFrame lerp
- [x] OrbitControls damping

---

## Phase 8 — Remaining Furniture [COMPLETE]

- [x] All 18 furniture items built in Phase 4

---

## Phase 9 — Polish & Export [COMPLETE]

- [x] Export as JSON download (Toolbar)
- [x] Import from JSON file (Toolbar)
- [x] Screenshot capture — canvas.toDataURL (Toolbar)
- [x] Undo/redo UI buttons in Toolbar
- [x] `Toolbar.jsx` — back, import, export, screenshot, undo/redo, object count

---

## Phase 10 — Placement & Interaction Polish [COMPLETE]

> These features were reverted after causing drag smoothness issues.
> They must be implemented in the order below, tested one at a time.

### 10a — Hover Cursor [x]
- [x] Add `onPointerEnter` → `cursor: grab` and `onPointerLeave` → `cursor: default` in `FurnitureGroup`
- [x] Change to `cursor: grabbing` when drag starts, back to `grab` on release
- **Note:** No per-frame DOM writes. Set cursor only on pointer events, not in `useFrame`.

### 10b — Grid Snap (on drop, not during drag) [x]
- [x] Add `gridSnap: true` and `gridSize: 0.5` to store
- [x] Add `toggleGridSnap` action and Grid toggle button in `ViewportControls`
- [x] Apply snap only in `onPointerUp` inside `DragPlane` — NOT in `onPointerMove`
- [x] During drag the object follows cursor freely; on release it snaps to nearest 0.5ft grid point
- **Note:** Never round position inside `onPointerMove`. Snap is a one-time correction on drop.

### 10c — Snap-to-Wall (on drop, not during drag) [x]
- [ ] After grid snap is applied on drop, check proximity to each wall (threshold ~1.2 units)
- [ ] If within threshold, override position to be flush with wall using furniture footprint + scale
- [ ] Look up footprint from `furnitureCatalog` using the dragging object's `furnitureId`
- [ ] Account for rotation: if object rotated 90°/270°, swap width/depth for wall offset
- **Note:** Wall snap runs after grid snap, both only on `pointerUp`. No wall proximity checks during drag.

### 10d — Copy / Paste (Duplicate) [x]
- [ ] Add `copiedObjectData`, `copyObject(id)`, `pasteObject()` to store
- [ ] `pasteObject` places duplicate at original position + [1.5, 0, 1.5] offset, auto-selects it
- [ ] Add Duplicate button (copy icon) in `PropertiesPanel` header
- [ ] Add `Ctrl/Cmd+D` keyboard shortcut in `DesignerLayout` via `useEffect`
- [ ] Also wire `Delete/Backspace` → delete selected, `Ctrl+Z/Y` → undo/redo via same `useEffect`
- **Note:** Keyboard shortcuts only — no drag changes here, safe to add independently.

### 10e — Measurement Overlay (popover panel, ref: sample-1) [x]
- [ ] Add `showMeasurements: false` toggle to Zustand store
- [ ] Add `measureUnit: 'ft'` (ft/cm) toggle to Zustand store
- [ ] Create `src/three/MeasurementOverlay.jsx` using `Text` + `Line` from `@react-three/drei`
  - [ ] Show room width + depth as dimension lines at floor level (dashed line style)
  - [ ] When an object is selected, show its footprint width/depth labels in the same units
  - [ ] All label positions computed from static store data — NO bounding-box calcs in `useFrame`
- [ ] Add a ruler icon button (far right of `ViewportControls` pill bar) to open the measurement popover
- [ ] Measurement popover (styled like sample-1 top-right panel): white card, rounded, shadow
  - Toggle row: "Room dimensions" (on/off switch)
  - Toggle row: "Product dimensions" — only relevant when object selected
  - Unit picker row: "ft" / "cm" segmented control
- [ ] Mount `<MeasurementOverlay>` inside `<Canvas>` in `Viewport.jsx` (only renders when toggle is on)
- **Note:** The popover is a React/DOM overlay (absolute-positioned), not a Three.js object.
  No per-frame DOM writes. Measurement lines are static Three.js objects updated only on store change.

---

## Phase 11 — Room Customization Floating Button (ref: sample-2) [COMPLETE]

> Design reference: sample-2 shows a paint-swatch icon in the bottom toolbar.
> Clicking it reveals a popover with wall + floor customization.
> This REPLACES the wall/floor section in `PropertiesPanel` (RoomPanel component).
> Wall/floor changes must NOT be triggered by clicking walls or floors in the 3D scene.

### 11a — Remove wall/floor from PropertiesPanel [x]
- [ ] Delete the `RoomPanel` component from `PropertiesPanel.jsx`
- [ ] When no object is selected, `PropertiesPanel` shows a simple placeholder ("Select a furniture item")
- [ ] Remove `WALL_PRESETS` and `FLOOR_PRESETS` constants from `PropertiesPanel.jsx`
- **Note:** `setWallColor` and `setFloorColor` store actions remain unchanged.

### 11b — Add paint icon button to ViewportControls pill bar [x]
- [ ] Add a paint-swatch icon button at the right end of the `ViewportControls` pill
- [ ] Use `Palette` icon from `lucide-react`
- [ ] Button shows a tooltip label ("Customise room") on hover (pure CSS title attr or small tooltip div)
- [ ] Clicking the button toggles a popover panel; clicking again or pressing Escape closes it
- [ ] Button state: highlighted (amber background) when popover is open

### 11c — Room Customisation Popover panel [x]
- [ ] Create `src/components/Designer/RoomCustomPanel.jsx`
- [ ] Positioned as a DOM overlay (absolute, above the ViewportControls pill), white card, rounded corners, shadow — similar aesthetic to sample-1 panel
- [ ] **Wall Color section:**
  - Label: "Wall Color"
  - 10 color swatches (same presets as current `WALL_PRESETS` in PropertiesPanel)
  - Custom color picker input
  - Reset button (resets to room default)
- [ ] **Floor Material section:**
  - Label: "Floor"
  - 4 material presets as large labeled swatches/buttons:
    - Light Wood (`#C4A882`)
    - Dark Wood (`#5C4020`)
    - Concrete (`#9A9890`)
    - Marble (`#E8E8E0`)
  - Custom color picker input for fine-tuning
  - Reset button
- [ ] Each swatch shows a small color square + label text (not just a dot)
- **Note:** This panel is 100% DOM/React — no Three.js interaction. Zero impact on drag plane or pointer events inside the Canvas.

### 11d — Ensure no 3D scene click triggers wall/floor changes [x]
- [ ] Confirm `Room.jsx` floor and wall meshes have NO `onClick` or `onPointerDown` handlers
- [ ] Confirm `DragPlane.jsx` only handles object drag and deselection — no room color logic
- [ ] This is a verification step, not a code change (walls/floors were never clickable for color)

---

## Phase 12 — Visual Quality & Lighting [COMPLETE]

- [x] Procedural floor textures: wood planks (grain + knots), concrete (noise patches), marble (veins)
- [x] Floor material roughness/metalness varies by type (wood 0.3/0.04, marble 0.1/0.06, concrete 0.85/0)
- [x] Wall roughness reduced from 0.9 → 0.55 so walls catch directional light (white looks white)
- [x] RectAreaLightUniformsLib initialised for window area lights
- [x] WindowRectLight: RectAreaLight at each window opening, aimed into room via lookAt
- [x] Lighting mood system in store: `lightingMode` ('off' | 'bright' | 'cozy' | 'evening' | 'night')
- [x] `src/data/lightingPresets.js`: LIGHTING_PRESETS + OFF_LIGHTING baseline
- [x] SceneSetup reads lightingMode → applies preset ambient/directional/hemisphere/front values
- [x] WindowLights reads lightingMode → applies preset window intensity/color
- [x] `<Environment preset="apartment">` mounted in Viewport only when lightingMode !== 'off'
- [x] Lighting button in pill bar → popover with on/off toggle + mood grid (Bright/Cozy/Evening/Night)

---

## Notes

- 1 Three.js unit = 1 foot
- Front wall always absent (dollhouse open side)
- OrbitControls must be disabled during object drag
- Shadow map: PCFSoftShadowMap, 2048x2048, frustum = room bounds
- Use React.memo on furniture components for performance
- nanoid import: `import { nanoid } from 'nanoid'` (ESM-only)
- **Drag smoothness rule:** Never modify position inside `onPointerMove` with snapping logic. Only clamp to room bounds during move. All snapping (grid + wall) happens once on `pointerUp`.
