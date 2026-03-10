import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import useDesignerStore from '../store/useDesignerStore'
import { LIGHTING_PRESETS, OFF_LIGHTING } from '../data/lightingPresets'

function getMaterialType(color) {
  if (!color || color.length < 7) return 'wood'
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  if (r > 200 && g > 200 && b > 200) return 'marble'
  if (Math.abs(r - g) < 25 && Math.abs(g - b) < 25) return 'concrete'
  return 'wood'
}

function createFloorTexture(color) {
  const type = getMaterialType(color)
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  if (type === 'wood') {
    const numPlanks = 8
    const plankH = 512 / numPlanks
    for (let i = 0; i < numPlanks; i++) {
      const y = i * plankH
      const v = (Math.random() - 0.5) * 28
      const pr = Math.min(255, Math.max(0, r + v))
      const pg = Math.min(255, Math.max(0, g + v * 0.7))
      const pb = Math.min(255, Math.max(0, b + v * 0.4))
      ctx.fillStyle = `rgb(${Math.round(pr)},${Math.round(pg)},${Math.round(pb)})`
      ctx.fillRect(0, y, 512, plankH)
      // Plank divider
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(0, y + plankH - 1.5, 512, 2)
      // Grain lines
      for (let j = 0; j < 16; j++) {
        const gy = y + (j / 16) * plankH + (Math.random() - 0.5) * (plankH / 16)
        const alpha = 0.03 + Math.random() * 0.09
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`
        ctx.lineWidth = 0.4 + Math.random() * 0.7
        ctx.beginPath()
        ctx.moveTo(0, gy)
        for (let x = 0; x <= 512; x += 24) {
          ctx.lineTo(x, gy + (Math.random() - 0.5) * 3)
        }
        ctx.stroke()
      }
      // Occasional knot
      if (Math.random() < 0.18) {
        const kx = 60 + Math.random() * 392
        const ky = y + plankH * 0.5
        ctx.strokeStyle = 'rgba(0,0,0,0.14)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.ellipse(kx, ky, 14, 7, Math.random() * 0.4, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
    // Sheen highlight
    const grad = ctx.createLinearGradient(0, 0, 512, 512)
    grad.addColorStop(0, 'rgba(255,255,255,0.12)')
    grad.addColorStop(0.35, 'rgba(255,255,255,0.18)')
    grad.addColorStop(0.65, 'rgba(255,255,255,0.07)')
    grad.addColorStop(1, 'rgba(0,0,0,0.05)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 512)

  } else if (type === 'concrete') {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const sz = 8 + Math.random() * 38
      const alpha = 0.015 + Math.random() * 0.04
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha})`
      ctx.beginPath()
      ctx.ellipse(x, y, sz, sz * 0.6, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.07)'
    ctx.lineWidth = 1
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath(); ctx.moveTo(i * 128, 0); ctx.lineTo(i * 128, 512); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, i * 128); ctx.lineTo(512, i * 128); ctx.stroke()
    }

  } else {
    // Marble
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 512, 512)
    for (let v = 0; v < 10; v++) {
      let mx = Math.random() * 512
      let my = Math.random() * 512
      const alpha = 0.05 + Math.random() * 0.12
      ctx.strokeStyle = `rgba(140,140,140,${alpha})`
      ctx.lineWidth = 0.5 + Math.random() * 2.5
      ctx.beginPath()
      ctx.moveTo(mx, my)
      for (let i = 0; i < 18; i++) {
        mx += (Math.random() - 0.35) * 45
        my += (Math.random() - 0.5) * 35
        ctx.lineTo(mx, my)
      }
      ctx.stroke()
    }
    const mg = ctx.createLinearGradient(0, 0, 512, 512)
    mg.addColorStop(0, 'rgba(255,255,255,0.2)')
    mg.addColorStop(0.5, 'rgba(255,255,255,0.07)')
    mg.addColorStop(1, 'rgba(220,220,220,0.14)')
    ctx.fillStyle = mg
    ctx.fillRect(0, 0, 512, 512)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

const FRAME_COLOR = '#E8E2D8'
const FRAME_T = 0.12   // frame thickness
const FRAME_D = 0.18   // frame depth (how far it protrudes)
const MULLION = 0.06   // centre divider thickness

function WindowUnit({ cx, cy, ww, wh }) {
  // cx, cy = centre of window opening in local wall space
  // ww, wh = window width/height
  const hw = ww / 2
  const hh = wh / 2
  const fd = FRAME_D
  const ft = FRAME_T
  const mt = MULLION

  return (
    <group position={[cx, cy, 0]}>
      {/* ── Outer frame: top, bottom, left, right ── */}
      {/* Top rail */}
      <mesh position={[0, hh - ft / 2, fd / 2]} castShadow>
        <boxGeometry args={[ww, ft, fd]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
      </mesh>
      {/* Bottom rail */}
      <mesh position={[0, -hh + ft / 2, fd / 2]} castShadow>
        <boxGeometry args={[ww, ft, fd]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
      </mesh>
      {/* Left stile */}
      <mesh position={[-hw + ft / 2, 0, fd / 2]} castShadow>
        <boxGeometry args={[ft, wh, fd]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
      </mesh>
      {/* Right stile */}
      <mesh position={[hw - ft / 2, 0, fd / 2]} castShadow>
        <boxGeometry args={[ft, wh, fd]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
      </mesh>

      {/* ── Centre mullion (vertical divider) ── */}
      <mesh position={[0, 0, fd / 2]} castShadow>
        <boxGeometry args={[mt, wh - ft * 2, fd]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
      </mesh>

      {/* ── Glass panes (left & right of mullion) ── */}
      {[-hw / 2 - mt / 4, hw / 2 + mt / 4].map((px, i) => (
        <mesh key={i} position={[px, 0, 0.04]}>
          <boxGeometry args={[ww / 2 - ft - mt / 2, wh - ft * 2, 0.06]} />
          <meshStandardMaterial
            color="#C8DFF0"
            transparent
            opacity={0.25}
            roughness={0}
            metalness={0.15}
          />
        </mesh>
      ))}

      {/* ── Window sill (protrudes inward) ── */}
      <mesh position={[0, -hh - 0.06, fd + 0.15]} castShadow receiveShadow>
        <boxGeometry args={[ww + 0.18, 0.1, 0.35]} />
        <meshStandardMaterial color="#E0D8CC" roughness={0.7} />
      </mesh>
    </group>
  )
}

function WallWithWindow({ position, rotation, wallW, wallH, win, wallColor }) {
  const { width: ww, height: wh, elevation: we, position: wp } = win
  const leftW = wallW * wp - ww / 2
  const rightW = wallW * (1 - wp) - ww / 2
  const bottomH = we
  const topH = wallH - we - wh
  // centre of window in local wall coords
  const cx = wallW * (wp - 0.5)
  const cy = we + wh / 2

  return (
    <group position={position} rotation={rotation}>
      {/* Wall segments around opening */}
      {leftW > 0.01 && (
        <mesh position={[-wallW / 2 + leftW / 2, wallH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[leftW, wallH, 0.2]} />
          <meshStandardMaterial color={wallColor} roughness={0.55} />
        </mesh>
      )}
      {rightW > 0.01 && (
        <mesh position={[wallW / 2 - rightW / 2, wallH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[rightW, wallH, 0.2]} />
          <meshStandardMaterial color={wallColor} roughness={0.55} />
        </mesh>
      )}
      {bottomH > 0.01 && (
        <mesh position={[cx, bottomH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[ww, bottomH, 0.2]} />
          <meshStandardMaterial color={wallColor} roughness={0.55} />
        </mesh>
      )}
      {topH > 0.01 && (
        <mesh position={[cx, wallH - topH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[ww, topH, 0.2]} />
          <meshStandardMaterial color={wallColor} roughness={0.55} />
        </mesh>
      )}

      {/* Detailed window unit */}
      <WindowUnit cx={cx} cy={cy} ww={ww} wh={wh} />
    </group>
  )
}

function WallWithDoor({ position, rotation, wallW, wallH, door, wallColor }) {
  const { position: dp, width: dw } = door
  const doorH = wallH * 0.75
  const leftW = wallW * dp - dw / 2
  const rightW = wallW * (1 - dp) - dw / 2
  const topH = wallH - doorH

  return (
    <group position={position} rotation={rotation}>
      {leftW > 0.01 && (
        <mesh position={[-wallW / 2 + leftW / 2, wallH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[leftW, wallH, 0.2]} />
          <meshStandardMaterial color={wallColor} roughness={0.55} />
        </mesh>
      )}
      {rightW > 0.01 && (
        <mesh position={[wallW / 2 - rightW / 2, wallH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[rightW, wallH, 0.2]} />
          <meshStandardMaterial color={wallColor} roughness={0.55} />
        </mesh>
      )}
      {topH > 0.01 && (
        <mesh position={[wallW * (dp - 0.5), doorH + topH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[dw, topH, 0.2]} />
          <meshStandardMaterial color={wallColor} roughness={0.55} />
        </mesh>
      )}
    </group>
  )
}

function SolidWall({ position, rotation, width, height, color }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[width, height, 0.2]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  )
}

function Baseboard({ position, rotation, length, color }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <boxGeometry args={[length, 0.3, 0.15]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  )
}

function CeilingLights({ width, depth, height, lightingMode }) {
  const cols = Math.max(2, Math.round(width / 7))
  const rows = Math.max(2, Math.round(depth / 6))
  const positions = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = -width / 2 + (width / (cols + 1)) * (c + 1)
      const z = -depth / 2 + (depth / (rows + 1)) * (r + 1)
      positions.push([x, z])
    }
  }

  // Intensity by mood: night = main light source, off/bright = subtle fill, cozy/evening = warm glow
  const bulbIntensity = lightingMode === 'night' ? 5.5 : lightingMode === 'cozy' ? 2.0 : lightingMode === 'evening' ? 1.2 : 0.5
  const pointIntensity = lightingMode === 'night' ? 5.0 : lightingMode === 'cozy' ? 1.2 : lightingMode === 'evening' ? 0.7 : 0.35
  const lightDistance = lightingMode === 'night' ? height * 3.0 : height * 1.8

  return (
    <group>
      {positions.map(([x, z], i) => (
        <group key={i} position={[x, height - 0.01, z]}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.25, 0.12, 16]} />
            <meshStandardMaterial color="#C8C8C8" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <circleGeometry args={[0.18, 16]} />
            <meshStandardMaterial
              color="#FFF8E0"
              emissive="#FFE88A"
              emissiveIntensity={bulbIntensity}
              roughness={0}
            />
          </mesh>
          <pointLight
            position={[0, -0.3, 0]}
            intensity={pointIntensity}
            distance={lightDistance}
            decay={2}
            color="#FFF5E0"
          />
        </group>
      ))}
    </group>
  )
}

function WindowRectLight({ from, toward, lightWidth, lightHeight, intensity, color }) {
  const ref = useRef()
  useEffect(() => {
    if (ref.current) {
      ref.current.lookAt(toward[0], toward[1], toward[2])
    }
  }, [toward])
  return (
    <rectAreaLight
      ref={ref}
      position={from}
      width={lightWidth}
      height={lightHeight}
      intensity={intensity}
      color={color}
    />
  )
}

function WindowLights({ room, windowPreset }) {
  const { width, depth, walls } = room
  const hw = width / 2
  const hd = depth / 2
  const lights = []

  if (windowPreset.intensity === 0) return null

  if (walls.back?.window) {
    const win = walls.back.window
    const wx = width * (win.position - 0.5)
    const wy = win.elevation + win.height / 2
    lights.push({ key: 'back', from: [wx, wy, -hd + 0.2], toward: [wx, wy, hd], lightWidth: win.width, lightHeight: win.height })
  }
  if (walls.left?.window) {
    const win = walls.left.window
    const wz = depth * (win.position - 0.5)
    const wy = win.elevation + win.height / 2
    lights.push({ key: 'left', from: [-hw + 0.2, wy, wz], toward: [hw, wy, wz], lightWidth: win.width, lightHeight: win.height })
  }
  if (walls.right?.window) {
    const win = walls.right.window
    const wz = depth * (win.position - 0.5)
    const wy = win.elevation + win.height / 2
    lights.push({ key: 'right', from: [hw - 0.2, wy, wz], toward: [-hw, wy, wz], lightWidth: win.width, lightHeight: win.height })
  }

  return (
    <>
      {lights.map((l) => (
        <WindowRectLight
          key={l.key}
          {...l}
          intensity={windowPreset.intensity}
          color={windowPreset.color}
        />
      ))}
    </>
  )
}

export default function Room({ room, viewMode }) {
  const roomWallColor = useDesignerStore((s) => s.roomWallColor)
  const roomFloorColor = useDesignerStore((s) => s.roomFloorColor)
  const lightingMode = useDesignerStore((s) => s.lightingMode)
  const windowPreset = lightingMode === 'off'
    ? OFF_LIGHTING.window
    : (LIGHTING_PRESETS[lightingMode]?.window ?? OFF_LIGHTING.window)
  const { width, depth, height, walls } = room
  const wallColor = roomWallColor ?? room.wallColor
  const floorColor = roomFloorColor ?? room.floorColor
  const hw = width / 2
  const hd = depth / 2
  const baseColor = '#E8E0D0'
  const showCeiling   = viewMode !== 'top'
  const showBackWall  = viewMode !== 'back'
  const showLeftWall  = viewMode !== 'side-left'
  const showRightWall = viewMode !== 'side-right'

  const floorTexture = useMemo(() => {
    const tex = createFloorTexture(floorColor)
    tex.repeat.set(width / 3, depth / 3)
    return tex
  }, [floorColor, width, depth])

  const matType = getMaterialType(floorColor)
  const floorRoughness = matType === 'marble' ? 0.1 : matType === 'concrete' ? 0.85 : 0.3
  const floorMetalness = matType === 'marble' ? 0.06 : matType === 'concrete' ? 0 : 0.04

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          map={floorTexture}
          roughness={floorRoughness}
          metalness={floorMetalness}
          envMapIntensity={matType === 'marble' ? 1.8 : matType === 'concrete' ? 0.3 : 1.0}
        />
      </mesh>

      {/* Ceiling — solid box, hidden in top view so you can see inside */}
      {showCeiling && (
        <>
          <mesh position={[0, height + 0.1, 0]}>
            <boxGeometry args={[width + 0.4, 0.25, depth + 0.4]} />
            <meshStandardMaterial color="#EEEAE6" roughness={0.95} />
          </mesh>
          {/* Inner ceiling face (visible from inside) */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
            <planeGeometry args={[width, depth]} />
            <meshStandardMaterial color="#F0EDE8" roughness={1} />
          </mesh>
          {/* Recessed ceiling lights */}
          <CeilingLights width={width} depth={depth} height={height} lightingMode={lightingMode} />
        </>
      )}

      {/* Back wall */}
      {walls.back?.exists && showBackWall && (
        walls.back.window ? (
          <WallWithWindow
            position={[0, 0, -hd]}
            rotation={[0, 0, 0]}
            wallW={width}
            wallH={height}
            win={walls.back.window}
            wallColor={wallColor}
          />
        ) : (
          <SolidWall
            position={[0, height / 2, -hd]}
            rotation={[0, 0, 0]}
            width={width}
            height={height}
            color={wallColor}
          />
        )
      )}

      {/* Left wall */}
      {walls.left?.exists && showLeftWall && (
        walls.left.door ? (
          <WallWithDoor
            position={[-hw, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            wallW={depth}
            wallH={height}
            door={walls.left.door}
            wallColor={wallColor}
          />
        ) : walls.left.window ? (
          <WallWithWindow
            position={[-hw, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            wallW={depth}
            wallH={height}
            win={walls.left.window}
            wallColor={wallColor}
          />
        ) : (
          <SolidWall
            position={[-hw, height / 2, 0]}
            rotation={[0, Math.PI / 2, 0]}
            width={depth}
            height={height}
            color={wallColor}
          />
        )
      )}

      {/* Right wall */}
      {walls.right?.exists && showRightWall && (
        walls.right.door ? (
          <WallWithDoor
            position={[hw, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            wallW={depth}
            wallH={height}
            door={walls.right.door}
            wallColor={wallColor}
          />
        ) : walls.right.window ? (
          <WallWithWindow
            position={[hw, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            wallW={depth}
            wallH={height}
            win={walls.right.window}
            wallColor={wallColor}
          />
        ) : (
          <SolidWall
            position={[hw, height / 2, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            width={depth}
            height={height}
            color={wallColor}
          />
        )
      )}

      {/* Baseboards */}
      {showBackWall  && <Baseboard position={[0, 0.15, -hd + 0.075]} rotation={[0, 0, 0]} length={width} color={baseColor} />}
      {showLeftWall  && <Baseboard position={[-hw + 0.075, 0.15, 0]} rotation={[0, Math.PI / 2, 0]} length={depth} color={baseColor} />}
      {showRightWall && <Baseboard position={[hw - 0.075, 0.15, 0]} rotation={[0, Math.PI / 2, 0]} length={depth} color={baseColor} />}

      {/* Window rect area lights — driven by lighting mood */}
      <WindowLights room={room} windowPreset={windowPreset} />
    </group>
  )
}
