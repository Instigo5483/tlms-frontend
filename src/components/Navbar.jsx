import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: '64px',
      background: 'rgba(10,15,30,0.6)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}>
      <Link to="/" style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none' }}>
        TLMS
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/discover" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem' }}>Discover</Link>
        {user ? (
          <>
            <Link
              to={user.role === 'student' ? '/dashboard/student' : '/dashboard/tutor'}
              style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem' }}
            >
              Dashboard
            </Link>
            <button onClick={handleLogout} style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
              color: '#94a3b8', padding: '6px 16px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '0.9rem'
            }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{
            background: '#1a73e8', color: '#fff', padding: '8px 20px',
            borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600
          }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}