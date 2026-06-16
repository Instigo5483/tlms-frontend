import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Discover from './pages/Discover'
import Login from './pages/Login'
import OAuthCallback from './pages/OAuthCallback'
import ChooseRole from './pages/ChooseRole'
import StudentDashboard from './pages/StudentDashboard'
import TutorDashboard from './pages/TutorDashboard'
import CenterDashboard from './pages/CenterDashboard'
import Profile from './pages/Profile'
import Payments from './pages/Payments'
import Wallet from './pages/Wallet'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!user.role) return <Navigate to="/choose-role" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function ProtectedRoleRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'student') return <Navigate to="/dashboard/student" replace />
  if (user.role === 'tutor') return <Navigate to="/dashboard/tutor" replace />
  if (user.role === 'center') return <Navigate to="/dashboard/center" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/choose-role" element={
            <ProtectedRoleRoute><ChooseRole /></ProtectedRoleRoute>
          } />
          <Route path="/profile/:type/:id" element={<Profile />} />
          <Route path="/wallet" element={
            <ProtectedRoute><Wallet /></ProtectedRoute>
          } />
          <Route path="/payments" element={
            <ProtectedRoute><Payments /></ProtectedRoute>
          } />
          <Route path="/dashboard/student" element={
            <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/tutor" element={
            <ProtectedRoute role="tutor"><TutorDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/center" element={
            <ProtectedRoute role="center"><CenterDashboard /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
