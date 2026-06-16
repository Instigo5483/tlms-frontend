import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const ACCENT = '#4f46e5'

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
      <Navbar />

      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 1.5rem 2rem',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%', maxWidth: '400px',
            background: '#fff',
            border: '1px solid #e4e4e7',
            borderRadius: '24px', padding: '2.5rem',
            boxShadow: '0 24px 60px rgba(24,24,27,0.08)',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <img
              src="/logo.jpeg"
              alt="TLMS"
              style={{ width: '52px', height: '52px', borderRadius: '14px', objectFit: 'cover', marginBottom: '0.8rem' }}
            />
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#a1a1aa', textTransform: 'uppercase' }}>
              Connect · Learn · Succeed
            </div>
          </div>

          {/* Mode toggle */}
          <div style={{
            display: 'flex', background: '#f4f4f5',
            borderRadius: '12px', padding: '3px',
            marginBottom: '2rem',
          }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '8px', border: 'none',
                borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? '#18181b' : '#a1a1aa',
                boxShadow: mode === m ? '0 1px 3px rgba(24,24,27,0.1)' : 'none',
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
              <h2 className="font-display" style={{ fontWeight: 700, fontSize: '1.35rem', letterSpacing: '-0.02em', marginBottom: '0.3rem', color: '#18181b' }}>
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
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
                <div style={{ display: 'flex', gap: '4px', background: '#f4f4f5', borderRadius: '10px', padding: '3px' }}>
                  {roles.map(r => (
                    <button key={r.key} onClick={() => setRole(r.key)} style={{
                      flex: 1, padding: '7px 4px', border: 'none',
                      borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: role === r.key ? '#fff' : 'transparent',
                      color: role === r.key ? '#18181b' : '#a1a1aa',
                      boxShadow: role === r.key ? '0 1px 3px rgba(24,24,27,0.1)' : 'none',
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
                    color: '#18181b', fontSize: '0.82rem',
                    background: '#f4f4f5',
                    border: '1px solid #d4d4d8',
                    padding: '10px 12px', borderRadius: '10px'
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
                background: loading ? '#e4e4e7' : ACCENT,
                boxShadow: loading ? 'none' : '0 8px 20px rgba(79,70,229,0.28)',
                color: loading ? '#a1a1aa' : '#fff',
                border: 'none', borderRadius: '999px',
                fontWeight: 700, fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s'
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: '#a1a1aa' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              style={{ background: 'none', border: 'none', color: ACCENT, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
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
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#71717a', marginBottom: '6px', letterSpacing: '0.02em' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', height: '42px', padding: '0 12px',
}
