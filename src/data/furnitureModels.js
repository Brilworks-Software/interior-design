// GLB model configuration for realistic furniture.
// Each key matches a furniture ID from furnitureCatalog.
// Only add entries here when the corresponding .glb file exists in public/models/.
// scale: adjust to match catalog footprint (GLB models are typically in meters, scene uses ~feet)
// offset: [x, y, z] to position model correctly (y to sit on floor)

export const furnitureModels = {
  sofa:           { path: '/models/sofa.glb',          scale: [1.2, 1.2, 1.2], offset: [0, 0, 0] },
  armchair:       { path: '/models/armchair.glb',      scale: [2, 2, 2],       offset: [0, 0, 0] },
  'dining-chair': { path: '/models/dining-chair.glb',  scale: [2.5, 2.5, 2.5], offset: [0, 0, 0] },
  'office-chair': { path: '/models/office-chair.glb',  scale: [3, 3, 3],       offset: [0, 0, 0] },
  desk:           { path: '/models/desk.glb',          scale: [3, 3, 3],       offset: [0, 0, 0] },
  bed:            { path: '/models/bed.glb',           scale: [3, 3, 3],       offset: [0, 0, 0] },
  nightstand:     { path: '/models/nightstand.glb',    scale: [1.5, 1.5, 1.5], offset: [0, 0, 0] },
  'side-table':   { path: '/models/side-table.glb',    scale: [1.5, 1.5, 1.5], offset: [0, 0, 0] },
  wardrobe:       { path: '/models/wardrobe.glb',      scale: [2, 2, 2],       offset: [0, 0, 0] },
  'floor-lamp':   { path: '/models/floor-lamp.glb',    scale: [2, 2, 2],       offset: [0, 0, 0] },
  'table-lamp':   { path: '/models/table-lamp.glb',    scale: [0.01, 0.01, 0.01], offset: [0, 0, 0] },
  rug:            { path: '/models/rug.glb',           scale: [0.05, 0.05, 0.05], offset: [0, 0, 0] },
  plant:          { path: '/models/plant.glb',         scale: [2, 2, 2],       offset: [0, 0, 0] },
}
