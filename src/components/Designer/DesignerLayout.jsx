import { useEffect } from 'react'
import useDesignerStore from '../../store/useDesignerStore'
import Toolbar from './Toolbar'
import CatalogSidebar from './Catalog/CatalogSidebar'
import PropertiesPanel from './Properties/PropertiesPanel'
import Viewport from './Viewport'
import ViewportControls from './ViewportControls'

export default function DesignerLayout() {
  const selectedRoom = useDesignerStore((s) => s.selectedRoom)
  const selectedObjectId = useDesignerStore((s) => s.selectedObjectId)
  const removeObject = useDesignerStore((s) => s.removeObject)
  const copyObject = useDesignerStore((s) => s.copyObject)
  const pasteObject = useDesignerStore((s) => s.pasteObject)
  const undo = useDesignerStore((s) => s.undo)
  const redo = useDesignerStore((s) => s.redo)

  useEffect(() => {
    function handleKeyDown(e) {
      const meta = e.metaKey || e.ctrlKey
      // Skip if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedObjectId) {
        e.preventDefault()
        removeObject(selectedObjectId)
      } else if (meta && e.key === 'd' && selectedObjectId) {
        e.preventDefault()
        copyObject(selectedObjectId)
        pasteObject()
      } else if (meta && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (meta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedObjectId, removeObject, copyObject, pasteObject, undo, redo])

  if (!selectedRoom) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Top toolbar */}
      <Toolbar />

      {/* Main area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Left: Catalog */}
        <CatalogSidebar />

        {/* Center: 3D Viewport */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Viewport room={selectedRoom} />
          <ViewportControls />
        </div>

        {/* Right: Properties */}
        <PropertiesPanel />
      </div>
    </div>
  )
}
