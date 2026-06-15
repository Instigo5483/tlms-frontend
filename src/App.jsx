import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import CustomCursor from './components/CustomCursor'
import Landing from './pages/Landing'
import Discover from './pages/Discover'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import TutorDashboard from './pages/TutorDashboard'
import CenterDashboard from './pages/CenterDashboard'
import Profile from './pages/Profile'
import Payments from './pages/Payments'
import Wallet from './pages/Wallet'

function GlobalBackground() {
  return (
    <div aria-hidden="true" style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(168,85,247,0.032) 1px, transparent 1px),
          linear-gradient(90deg, rgba(168,85,247,0.032) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '65vw', height: '65vw', maxWidth: '900px', maxHeight: '900px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.13) 0%, transparent 70%)',
        filter: 'blur(80px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: '65vw', height: '65vw', maxWidth: '900px', maxHeight: '900px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)',
        filter: 'blur(80px)',
      }} />
      <div style={{
        position: 'absolute', top: '38%', left: '22%',
        width: '40vw', height: '40vw', maxWidth: '600px', maxHeight: '600px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.055) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />
    </div>
  )
}

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <GlobalBackground />
      <CustomCursor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/login" element={<Login />} />
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
