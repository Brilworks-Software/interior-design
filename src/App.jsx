import { Component } from 'react'
import useDesignerStore from './store/useDesignerStore'
import RoomSelector from './components/RoomSelector/RoomSelector'
import DesignerLayout from './components/Designer/DesignerLayout'
import CustomRoomWizard from './components/CustomBuilder/CustomRoomWizard'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, background: '#1a1a1a', color: '#f87171', fontFamily: 'monospace', height: '100vh' }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Render Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11, color: '#9ca3af', marginTop: 12 }}>{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function AppInner() {
  const screen = useDesignerStore((s) => s.screen)
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {screen === 'select' && <RoomSelector />}
      {screen === 'custom' && <CustomRoomWizard />}
      {screen === 'design' && <DesignerLayout />}
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  )
}
