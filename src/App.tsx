import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useProviders } from './hooks/useProviders'
import Home from './pages/Home'
import ProviderDetail from './pages/ProviderDetail'
import Feedback from './pages/Feedback'

export default function App() {
  const { providers, loading, error, isUsingFallback } = useProviders()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              providers={providers}
              loading={loading}
              error={error}
              isUsingFallback={isUsingFallback}
            />
          }
        />
        <Route
          path="/provider/:id"
          element={<ProviderDetail providers={providers} />}
        />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </BrowserRouter>
  )
}