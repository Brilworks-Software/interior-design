import { ArrowLeft, Save, Camera, Undo2, Redo2, Download, Upload } from 'lucide-react'
import useDesignerStore from '../../store/useDesignerStore'

export default function Toolbar() {
  const selectedRoom = useDesignerStore((s) => s.selectedRoom)
  const objects = useDesignerStore((s) => s.objects)
  const historyIndex = useDesignerStore((s) => s.historyIndex)
  const historyLen = useDesignerStore((s) => s.history.length)
  const goToSelect = useDesignerStore((s) => s.goToSelect)
  const undo = useDesignerStore((s) => s.undo)
  const redo = useDesignerStore((s) => s.redo)
  const exportDesign = useDesignerStore((s) => s.exportDesign)
  const importDesign = useDesignerStore((s) => s.importDesign)
  const setShowSignupModal = useDesignerStore((s) => s.setShowSignupModal)

  function handleExport() {
    if (!localStorage.getItem('has_signed_up_designs')) {
      setShowSignupModal(true, false)
      return
    }
    const json = exportDesign()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `room-design-${selectedRoom?.id ?? 'export'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => importDesign(ev.target.result)
      reader.readAsText(file)
    }
    input.click()
  }

  function handleScreenshot() {
    if (!localStorage.getItem('has_signed_up_designs')) {
      setShowSignupModal(true, false)
      return
    }
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `room-design-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < historyLen - 1

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0" style={{ height: 52 }}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={goToSelect}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Rooms</span>
        </button>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">3D</span>
          </div>
          <span className="font-semibold text-gray-800 text-sm">{selectedRoom?.name}</span>
          <span className="text-xs text-gray-400">{selectedRoom?.sqft} sq.ft</span>
        </div>
      </div>

      {/* Center — undo/redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Redo"
        >
          <Redo2 size={16} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 mr-2">{objects.length} object{objects.length !== 1 ? 's' : ''}</span>
        <button
          onClick={handleImport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          title="Import design"
        >
          <Upload size={14} />
          <span>Import</span>
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          title="Export JSON"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
        <button
          onClick={handleScreenshot}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
          title="Screenshot"
        >
          <Camera size={14} />
          <span>Screenshot</span>
        </button>
      </div>
    </div>
  )
}
