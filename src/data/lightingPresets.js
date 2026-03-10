// envIntensity controls scene.environmentIntensity (how much IBL contributes)
// Manual light values are tuned assuming IBL is running alongside them

export const LIGHTING_PRESETS = {
  bright: {
    label: 'Bright',
    envIntensity: 0.9,
    ambient:     { intensity: 0.2,  color: '#FFFFFF' },
    directional: { intensity: 0.8,  color: '#FFF8F0', position: [10, 16, 10] },
    hemisphere:  { sky: '#E8F4FF', ground: '#C4A882', intensity: 0.25 },
    frontPoint:  { intensity: 0.25, color: '#FFFFFF' },
    window:      { intensity: 4,    color: '#FFF5E0' },
  },
  cozy: {
    label: 'Cozy',
    envIntensity: 0.2,
    ambient:     { intensity: 0.1,  color: '#FFE0B0' },
    directional: { intensity: 0.2,  color: '#FFB84D', position: [6, 10, 14] },
    hemisphere:  { sky: '#FFD080', ground: '#7A4010', intensity: 0.1 },
    frontPoint:  { intensity: 0.08, color: '#FFD080' },
    window:      { intensity: 1.8,  color: '#FFB84D' },
  },
  evening: {
    label: 'Evening',
    envIntensity: 0.08,
    ambient:     { intensity: 0.06, color: '#FF7040' },
    directional: { intensity: 0.12, color: '#FF5520', position: [18, 3, 12] },
    hemisphere:  { sky: '#FF7040', ground: '#2A0800', intensity: 0.06 },
    frontPoint:  { intensity: 0,    color: '#FF8050' },
    window:      { intensity: 1.0,  color: '#FF6030' },
  },
  night: {
    label: 'Night',
    envIntensity: 0.04,
    ambient:     { intensity: 0.1,  color: '#C8B89A' },
    directional: { intensity: 0,    color: '#000000', position: [10, 16, 10] },
    hemisphere:  { sky: '#1A1410', ground: '#0A0806', intensity: 0.08 },
    frontPoint:  { intensity: 0,    color: '#000000' },
    window:      { intensity: 0,    color: '#000000' },
  },
}

// Original pre-enhancement baseline (used when lighting toggle is OFF)
export const OFF_LIGHTING = {
  envIntensity: 0,
  ambient:     { intensity: 0.45, color: '#FFFFFF' },
  directional: { intensity: 1.1,  color: '#FFFFFF', position: [10, 16, 10] },
  hemisphere:  { sky: '#E8F4FF', ground: '#C4A882', intensity: 0.35 },
  frontPoint:  { intensity: 0.3,  color: '#FFFFFF' },
  window:      { intensity: 0,    color: '#FFFFFF' },
}
