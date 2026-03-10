import { Text, Line } from '@react-three/drei'
import useDesignerStore from '../store/useDesignerStore'
import { furnitureCatalog } from '../data/furnitureCatalog'

function formatMeasure(feet, unit) {
  if (unit === 'cm') return `${Math.round(feet * 30.48)} cm`
  return `${feet.toFixed(1)} ft`
}

function DimensionLine({ start, end, label, labelPos, labelRotY = 0 }) {
  // Ticks must be perpendicular to the line direction.
  // Lines run either along X or along Z — pick the other axis for the tick.
  const T = 0.15
  const alongX = Math.abs(end[0] - start[0]) > Math.abs(end[2] - start[2])
  const tick = ([x, y, z]) => alongX
    ? [[x, y, z - T], [x, y, z + T]]   // line along X → tick along Z
    : [[x - T, y, z], [x + T, y, z]]   // line along Z → tick along X

  return (
    <group>
      <Line
        points={[start, end]}
        color="#1C6EF2"
        lineWidth={1.5}
        dashed
        dashSize={0.3}
        gapSize={0.15}
      />
      <Line points={tick(start)} color="#1C6EF2" lineWidth={1.5} />
      <Line points={tick(end)}   color="#1C6EF2" lineWidth={1.5} />
      <Text
        position={labelPos}
        rotation={[0, labelRotY, 0]}
        fontSize={0.35}
        color="#1C6EF2"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#ffffff"
      >
        {label}
      </Text>
    </group>
  )
}

function RoomDimensions({ room, unit }) {
  const hw = room.width / 2
  const hd = room.depth / 2

  return (
    <group>
      {/* Width line — along front opening */}
      <DimensionLine
        start={[-hw, 0.05, hd + 0.6]}
        end={[hw, 0.05, hd + 0.6]}
        label={formatMeasure(room.width, unit)}
        labelPos={[0, 0.05, hd + 1.1]}
        labelRotY={0}
      />
      {/* Depth line — along left wall */}
      <DimensionLine
        start={[-hw - 0.6, 0.05, -hd]}
        end={[-hw - 0.6, 0.05, hd]}
        label={formatMeasure(room.depth, unit)}
        labelPos={[-hw - 1.2, 0.05, 0]}
        labelRotY={Math.PI / 2}
      />
    </group>
  )
}

function ProductDimensions({ obj, unit }) {
  const catalogItem = furnitureCatalog.find((f) => f.id === obj.furnitureId)
  if (!catalogItem) return null

  const rot = obj.rotation % 360
  const rotated = rot === 90 || rot === 270
  const fw = (rotated ? catalogItem.footprint.depth : catalogItem.footprint.width) / 2 * obj.scale
  const fd = (rotated ? catalogItem.footprint.width : catalogItem.footprint.depth) / 2 * obj.scale
  const [cx, , cz] = obj.position
  const y = 0.25

  const corners = [
    [cx - fw, y, cz - fd],
    [cx + fw, y, cz - fd],
    [cx + fw, y, cz + fd],
    [cx - fw, y, cz + fd],
    [cx - fw, y, cz - fd],
  ]

  const wLabel = formatMeasure(rotated ? catalogItem.footprint.depth : catalogItem.footprint.width, unit)
  const dLabel = formatMeasure(rotated ? catalogItem.footprint.width : catalogItem.footprint.depth, unit)

  return (
    <group>
      <Line points={corners} color="#FFFFFF" lineWidth={3} />
      {/* Width label — front edge */}
      <Text
        position={[cx, 0.25, cz + fd + 0.5]}
        fontSize={0.32}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#222222"
      >
        {wLabel}
      </Text>
      {/* Depth label — right edge */}
      <Text
        position={[cx + fw + 0.5, 0.25, cz]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.32}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#222222"
      >
        {dLabel}
      </Text>
    </group>
  )
}

export default function MeasurementOverlay({ room }) {
  const showRoomDimensions = useDesignerStore((s) => s.showRoomDimensions)
  const showProductDimensions = useDesignerStore((s) => s.showProductDimensions)
  const measureUnit = useDesignerStore((s) => s.measureUnit)
  const selectedObjectId = useDesignerStore((s) => s.selectedObjectId)
  const objects = useDesignerStore((s) => s.objects)

  const selectedObj = selectedObjectId ? objects.find((o) => o.id === selectedObjectId) : null

  return (
    <group>
      {showRoomDimensions && <RoomDimensions room={room} unit={measureUnit} />}
      {showProductDimensions && selectedObj && (
        <ProductDimensions obj={selectedObj} unit={measureUnit} />
      )}
    </group>
  )
}
