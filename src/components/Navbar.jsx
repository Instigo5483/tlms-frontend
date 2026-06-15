import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() { logout(); navigate('/'); setMenuOpen(false) }

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

  const navLinks = [
    { to: '/discover', label: 'Discover', show: true },
    { to: getDashboardPath(), label: 'Dashboard', show: !!user },
    { to: '/payments', label: 'Payments', show: !!user },
    { to: '/wallet', label: 'Wallet', show: !!user && user.role !== 'student' },
  ].filter(l => l.show)

  return (
    <>
      <style>{`
        .tlms-nav-wrapper {
          position: fixed;
          top: 16px;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 100;
          display: flex;
          justify-content: center;
          padding: 0 16px;
          box-sizing: border-box;
          pointer-events: none;
        }
        .tlms-nav {
          width: 100%;
          max-width: 1000px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0 1rem;
          height: 48px;
          background: rgba(5,5,8,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 999px;
          border: 1px solid rgba(168,85,247,0.2);
          box-sizing: border-box;
          pointer-events: all;
        }
        .tlms-dropdown-wrapper {
          position: fixed;
          top: 76px;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 99;
          display: none;
          justify-content: center;
          padding: 0 16px;
          box-sizing: border-box;
          pointer-events: none;
        }
        .tlms-dropdown {
          width: 100%;
          max-width: 1000px;
          background: rgba(5,5,8,0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(168,85,247,0.2);
          padding: 0.8rem;
          overflow: hidden;
          box-sizing: border-box;
          position: relative;
          pointer-events: all;
        }
        .tlms-desktop-nav { display: flex; }
        .tlms-hamburger { display: none; }

        @media (max-width: 680px) {
          .tlms-desktop-nav { display: none !important; }
          .tlms-hamburger { display: flex !important; }
          .tlms-dropdown-wrapper { display: flex !important; }
        }
        @media (min-width: 681px) {
          .tlms-dropdown-wrapper { display: none !important; }
        }
      `}</style>

      {/* Nav wrapper */}
      <div className="tlms-nav-wrapper">
        <motion.nav
          className="tlms-nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <Link to="/" onClick={() => setMenuOpen(false)} style={{
            textDecoration: 'none', display: 'flex',
            alignItems: 'center', gap: '8px', flexShrink: 0
          }}>
            <img
              src="/logo.jpeg"
              alt="TLMS"
              style={{ width: '26px', height: '26px', borderRadius: '7px', objectFit: 'cover' }}
            />
            <span style={{
              fontWeight: 800, fontSize: '0.9rem',
              letterSpacing: '0.05em', whiteSpace: 'nowrap',
              background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>TLMS</span>
          </Link>

          {/* Desktop nav links */}
          <div className="tlms-desktop-nav" style={{
            gap: '0.1rem', alignItems: 'center',
            flexWrap: 'nowrap', overflow: 'hidden', flex: 1,
            justifyContent: 'center'
          }}>
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="tlms-desktop-nav" style={{
            gap: '0.4rem', alignItems: 'center', flexShrink: 0
          }}>
            {user ? (
              <>
                <span style={{
                  fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)',
                  maxWidth: '70px', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>{getDisplayName()}</span>
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
                >Logout</motion.button>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/login" style={{
                  background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                  color: '#fff', padding: '6px 16px', borderRadius: '999px',
                  textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700,
                  whiteSpace: 'nowrap', display: 'block'
                }}>Login</Link>
              </motion.div>
            )}
          </div>

          {/* Hamburger */}
          <motion.button
            className="tlms-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            whileTap={{ scale: 0.92 }}
            style={{
              background: menuOpen ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: '8px', padding: '7px 10px',
              cursor: 'pointer', flexDirection: 'column',
              gap: '4px', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <motion.div
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: '16px', height: '2px', background: '#a855f7', borderRadius: '2px' }}
            />
            <motion.div
              animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              style={{ width: '16px', height: '2px', background: '#a855f7', borderRadius: '2px' }}
            />
            <motion.div
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: '16px', height: '2px', background: '#a855f7', borderRadius: '2px' }}
            />
          </motion.button>
        </motion.nav>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 98,
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(2px)',
              }}
            />

            {/* Dropdown wrapper */}
            <div className="tlms-dropdown-wrapper">
              <motion.div
                className="tlms-dropdown"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Top glow */}
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '50%', height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)'
                }} />

                {/* Nav links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '0.8rem' }}>
                  {navLinks.map((l, i) => (
                    <motion.div
                      key={l.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={l.to}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                          fontSize: '0.9rem', fontWeight: 500,
                          padding: '10px 14px', borderRadius: '10px',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      >
                        {l.label}
                        <span style={{ color: 'rgba(168,85,247,0.5)', fontSize: '0.8rem' }}>→</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Auth */}
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '0.8rem',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '0.8rem'
                }}>
                  {user ? (
                    <>
                      <div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginBottom: '1px' }}>Signed in as</p>
                        <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{getDisplayName()}</p>
                      </div>
                      <motion.button
                        onClick={handleLogout}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          background: 'rgba(168,85,247,0.08)',
                          border: '1px solid rgba(168,85,247,0.2)',
                          color: 'rgba(255,255,255,0.6)',
                          padding: '8px 20px', borderRadius: '999px',
                          cursor: 'pointer', fontSize: '0.82rem',
                          fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0
                        }}
                      >Logout</motion.button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        flex: 1, textAlign: 'center',
                        background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                        color: '#fff', padding: '10px',
                        borderRadius: '12px', textDecoration: 'none',
                        fontSize: '0.9rem', fontWeight: 700, display: 'block'
                      }}
                    >Login</Link>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
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
    >{children}</Link>
  )
}