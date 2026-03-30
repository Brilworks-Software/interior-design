import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

// Initialize PostHog
// Add VITE_POSTHOG_KEY to your .env file
const posthogKey = import.meta.env.VITE_POSTHOG_KEY
if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'always', // Ensure user profiles are created to link session recordings
  })
} else {
  console.warn('PostHog is not initialized: VITE_POSTHOG_KEY is missing.')
}

createRoot(document.getElementById('root')).render(
  <PostHogProvider client={posthog}>
    <App />
  </PostHogProvider>
)

