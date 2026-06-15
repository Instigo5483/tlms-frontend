import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', password: '', center_name: '' })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, role, full_name: form.full_name, center_name: form.center_name }
      const res = await fetch(`${BACKEND}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong'); return }
      login(data.token, data.user)
      if (data.user.role === 'student') navigate('/dashboard/student')
      else if (data.user.role === 'tutor') navigate('/dashboard/tutor')
      else navigate('/dashboard/center')
    } catch {
      setError('Cannot connect to server.')
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { key: 'student', label: 'Student' },
    { key: 'tutor', label: 'Tutor' },
    { key: 'center', label: 'Center' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient blobs */}
      <div style={{
        position: 'fixed', top: '-20%', right: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', left: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(50px)', zIndex: 0
      }} />

      <Navbar />

      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 1.5rem 2rem', position: 'relative', zIndex: 1
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%', maxWidth: '400px',
            background: 'rgba(10,10,15,0.9)',
            border: '1px solid rgba(168,85,247,0.2)',
            borderRadius: '24px', padding: '2.5rem',
            position: 'relative', overflow: 'hidden'
          }}
        >
          {/* Top glow line */}
          <div style={{
            position: 'absolute', top: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '60%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)'
          }} />

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <img
              src="/logo.jpeg"
              alt="TLMS"
              style={{ width: '52px', height: '52px', borderRadius: '14px', objectFit: 'cover', marginBottom: '0.8rem' }}
            />
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
              Connect · Learn · Succeed
            </div>
          </div>

          {/* Mode toggle */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.04)',
            borderRadius: '12px', padding: '3px',
            marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.06)'
          }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '8px', border: 'none',
                borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                background: mode === m
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(6,182,212,0.3))'
                  : 'transparent',
                color: mode === m ? '#fff' : 'rgba(255,255,255,0.35)',
              }}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{ marginBottom: '1.8rem' }}
            >
              <h2 style={{
                fontWeight: 700, fontSize: '1.3rem',
                letterSpacing: '-0.02em', marginBottom: '0.3rem',
                background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
                {mode === 'login'
                  ? 'Enter your credentials to continue'
                  : 'Fill in your details to get started'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Role tabs — signup only */}
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginBottom: '1.2rem', overflow: 'hidden' }}
              >
                <div style={{
                  display: 'flex', gap: '4px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '10px', padding: '3px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  {roles.map(r => (
                    <button key={r.key} onClick={() => setRole(r.key)} style={{
                      flex: 1, padding: '7px 4px', border: 'none',
                      borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: role === r.key
                        ? 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(6,182,212,0.25))'
                        : 'transparent',
                      color: role === r.key ? '#fff' : 'rgba(255,255,255,0.35)',
                    }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <Field label="Full Name">
                    <input name="full_name" type="text" placeholder="Your full name"
                      value={form.full_name} onChange={handleChange} required style={inputStyle} />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {mode === 'signup' && role === 'center' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <Field label="Center Name">
                    <input name="center_name" type="text" placeholder="Your tuition center name"
                      value={form.center_name} onChange={handleChange} required style={inputStyle} />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            <Field label="Email">
              <input name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required style={inputStyle} />
            </Field>

            <Field label="Password">
              <input name="password" type="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} required minLength={6} style={inputStyle} />
            </Field>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    color: '#f87171', fontSize: '0.82rem',
                    background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.15)',
                    padding: '10px 12px', borderRadius: '8px'
                  }}
                >{error}</motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{
                marginTop: '4px', height: '46px',
                background: loading
                  ? 'rgba(255,255,255,0.08)'
                  : 'linear-gradient(135deg, #a855f7, #06b6d4)',
                color: loading ? 'rgba(255,255,255,0.3)' : '#fff',
                border: 'none', borderRadius: '12px',
                fontWeight: 700, fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s'
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: '1.5rem',
            fontSize: '0.82rem', color: 'rgba(255,255,255,0.25)'
          }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(168,85,247,0.8)', fontWeight: 600,
                cursor: 'pointer', fontSize: '0.82rem'
              }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: '0.78rem',
        fontWeight: 500, color: 'rgba(255,255,255,0.4)',
        marginBottom: '6px', letterSpacing: '0.02em'
      }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', height: '42px', padding: '0 12px',
  background: 'rgba(255,255,255,0.04) !important',
  border: '1px solid rgba(168,85,247,0.15) !important',
  borderRadius: '10px !important', color: '#fff !important',
  fontSize: '0.9rem'
}