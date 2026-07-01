import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import WorkPrograms from './pages/WorkPrograms'
import Schedules from './pages/Schedules'
import Journals from './pages/Journals'
import Gallery from './pages/Gallery'
import Reports from './pages/Reports'
import Announcements from './pages/Announcements'

import ProtectedRoute from './components/ProtectedRoute'

const queryClient = new QueryClient()

function App() {
  const setSession = useAuthStore(state => state.setSession)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/members" element={<Members />} />
              <Route path="/programs" element={<WorkPrograms />} />
              <Route path="/schedules" element={<Schedules />} />
              <Route path="/journals" element={<Journals />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
