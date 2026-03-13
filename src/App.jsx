import { Component, useEffect } from 'react'
import useDesignerStore from './store/useDesignerStore'
import RoomSelector from './components/RoomSelector/RoomSelector'
import DesignerLayout from './components/Designer/DesignerLayout'
import CustomRoomWizard from './components/CustomBuilder/CustomRoomWizard'
import SignupModal from './components/SignupModal'

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
  const showSignupModal = useDesignerStore((s) => s.showSignupModal)
  const signupModalClosable = useDesignerStore((s) => s.signupModalClosable)
  const setShowSignupModal = useDesignerStore((s) => s.setShowSignupModal)

  useEffect(() => {
    if (localStorage.getItem('has_signed_up_designs')) return

    let startTime = parseInt(localStorage.getItem('session_start_time'), 10)
    if (!startTime || isNaN(startTime)) {
      startTime = Date.now()
      localStorage.setItem('session_start_time', startTime.toString())
    }

    const interval = setInterval(() => {
      if (localStorage.getItem('has_signed_up_designs')) {
        clearInterval(interval)
        return
      }

      const elapsedMs = Date.now() - startTime
      const elapsedMinutes = Math.floor(elapsedMs / 60000)

      if (elapsedMinutes >= 10 && elapsedMinutes < 25) {
        if (!localStorage.getItem('has_shown_10min_popup')) {
          localStorage.setItem('has_shown_10min_popup', 'true')
          useDesignerStore.getState().setShowSignupModal(true, true)
        }
      }

      if (elapsedMinutes >= 25) {
        const state = useDesignerStore.getState()
        if (!state.showSignupModal || state.signupModalClosable) {
          useDesignerStore.getState().setShowSignupModal(true, false)
        }
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ width: '100%', minHeight: '100%' }}>
      {showSignupModal && (
        <SignupModal
          onComplete={() => setShowSignupModal(false)}
          onClose={() => setShowSignupModal(false)}
          closable={signupModalClosable}
        />
      )}
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
