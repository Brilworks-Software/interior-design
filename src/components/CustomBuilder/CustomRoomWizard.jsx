import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import useDesignerStore from '../../store/useDesignerStore'
import RoomPreview from './RoomPreview'
import ShapeStep from './ShapeStep'
import DimensionsStep from './DimensionsStep'
import DoorsWindowsStep from './DoorsWindowsStep'
import StyleStep from './StyleStep'

const STEP_TITLES = [
  'Set the shape and size',
  'Adjust your dimensions',
  'Add doors and windows',
  'Choose your room style',
]

export default function CustomRoomWizard() {
  const goToSelect = useDesignerStore((s) => s.goToSelect)
  const setRoom = useDesignerStore((s) => s.setRoom)

  const [step, setStep] = useState(1)
  const [shape, setShape] = useState('rectangular')
  const [width, setWidth] = useState(18)
  const [depth, setDepth] = useState(13)
  const [height, setHeight] = useState(9)
  const [wallColor, setWallColor] = useState('#F5F0EB')
  const [floorColor, setFloorColor] = useState('#C4A882')
  const [walls, setWalls] = useState({
    back: { exists: true },
    left: { exists: true },
    right: { exists: true },
    front: { exists: false },
  })

  function updateWall(name, wall) {
    setWalls((prev) => ({ ...prev, [name]: wall }))
  }

  const roomDraft = {
    id: `custom-${Date.now()}`,
    name: 'Custom Room',
    sqft: Math.round(width * depth),
    width,
    depth,
    height,
    walls,
    floorColor,
    wallColor,
    floorTexture: 'wood',
    style: 'custom',
    accent: '#D4B896',
  }

  function handleFinish() {
    setRoom(roomDraft)
  }

  function next() {
    if (step < 4) setStep(step + 1)
  }

  function back() {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="flex w-full h-full bg-gray-200 overflow-hidden">
      {/* Left Panel */}
      <div className="w-[320px] shrink-0 bg-white flex flex-col shadow-lg z-10 h-full overflow-hidden">
        {/* Back to rooms */}
        <button
          onClick={goToSelect}
          className="flex items-center gap-2 px-5 py-3 text-xs text-gray-500 hover:text-gray-800 transition-colors border-b border-gray-100 shrink-0"
        >
          <ArrowLeft size={14} />
          Back to rooms
        </button>

        {/* Step indicator */}
        <div className="px-5 pt-4 pb-2 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Step {step} of 4</p>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">{STEP_TITLES[step - 1]}</h2>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          {step === 1 && (
            <ShapeStep shape={shape} onChange={setShape} />
          )}
          {step === 2 && (
            <DimensionsStep
              width={width}
              depth={depth}
              height={height}
              onChangeWidth={setWidth}
              onChangeDepth={setDepth}
              onChangeHeight={setHeight}
            />
          )}
          {step === 3 && (
            <DoorsWindowsStep
              walls={walls}
              width={width}
              depth={depth}
              height={height}
              onUpdateWall={updateWall}
            />
          )}
          {step === 4 && (
            <StyleStep
              wallColor={wallColor}
              floorColor={floorColor}
              onChangeWallColor={setWallColor}
              onChangeFloorColor={setFloorColor}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="px-5 py-4 border-t border-gray-200 flex gap-3 shrink-0 bg-white relative z-20">
          {step > 1 && (
            <button
              onClick={back}
              className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={next}
              className="flex-1 h-11 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex-1 h-11 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
            >
              Design this room
            </button>
          )}
        </div>
      </div>

      {/* Right Panel - 3D Preview */}
      <div className="flex-1 min-w-0">
        <RoomPreview room={roomDraft} step={step} />
      </div>
    </div>
  )
}
