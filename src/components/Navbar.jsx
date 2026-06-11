import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() { logout(); navigate('/') }

  function getDashboardPath() {
    if (!user) return '/'
    if (user.role === 'student') return '/dashboard/student'
    if (user.role === 'tutor') return '/dashboard/tutor'
    return '/dashboard/center'
  }

  function getDisplayName() {
    if (user?.center_name) return user.center_name.split(' ')[0]
    if (user?.full_name) return user.full_name.split(' ')[0]
    return user?.email?.split('@')[0] || ''
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      transformTemplate={({ y }) => `translateX(-50%) translateY(${y})`}
      style={{
        position: 'fixed', top: '16px',
        left: '50%',
        width: '80%',
        maxWidth: '1000px',
        zIndex: 100,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        padding: '0 1.2rem', height: '48px',
        background: 'rgba(5,5,8,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '999px',
        border: '1px solid rgba(168,85,247,0.2)',
      }}>

      {/* Logo */}
      <Link to="/" style={{
        textDecoration: 'none', display: 'flex',
        alignItems: 'center', gap: '8px', flexShrink: 0
      }}>
        <img
          src="/tlms-frontend/logo.jpeg"
          alt="TLMS"
          style={{
            width: '28px', height: '28px',
            borderRadius: '8px', objectFit: 'cover'
          }}
        />
        <span style={{
          fontWeight: 800, fontSize: '0.95rem',
          letterSpacing: '0.05em', whiteSpace: 'nowrap',
          background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>TLMS</span>
      </Link>

      {/* Nav links */}
      <div style={{
        display: 'flex', gap: '0.1rem', alignItems: 'center',
        flexWrap: 'nowrap', overflow: 'hidden'
      }}>
        <NavLink to="/discover">Discover</NavLink>
        {user && <NavLink to={getDashboardPath()}>Dashboard</NavLink>}
        {user && <NavLink to="/payments">Payments</NavLink>}
        {user && user.role !== 'student' && <NavLink to="/wallet">Wallet</NavLink>}
      </div>

      {/* Auth */}
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
        {user ? (
          <>
            <span style={{
              fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)',
              maxWidth: '80px', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {getDisplayName()}
            </span>
            <motion.button
              onClick={handleLogout}
              whileHover={{ background: 'rgba(168,85,247,0.15)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: 'rgba(168,85,247,0.08)',
                border: '1px solid rgba(168,85,247,0.2)',
                color: 'rgba(255,255,255,0.6)',
                padding: '4px 12px', borderRadius: '999px',
                cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500,
                whiteSpace: 'nowrap'
              }}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/login" style={{
              background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
              color: '#fff',
              padding: '6px 16px', borderRadius: '999px',
              textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700,
              whiteSpace: 'nowrap', display: 'block'
            }}>
              Login
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

function NavLink({ to, children }) {
  return (
    <Link to={to} style={{
      color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
      fontSize: '0.82rem', fontWeight: 500,
      padding: '4px 12px', borderRadius: '999px',
      display: 'block', transition: 'all 0.2s',
      whiteSpace: 'nowrap'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.color = '#fff'
        e.currentTarget.style.background = 'rgba(168,85,247,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </Link>
  )
}