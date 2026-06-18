import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const ACCENT = '#4f46e5'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.85 2.08-1.81 2.72v2.26h2.92C16.46 14.2 17.64 11.96 17.64 9.2z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.85.87-3.04.87-2.34 0-4.32-1.58-5.03-3.7H.96v2.33C2.44 15.98 5.48 18 9 18z"/>
      <path fill="#FBBC05" d="M3.97 10.73c-.18-.54-.28-1.12-.28-1.73s.1-1.19.28-1.73V4.94H.96A8.99 8.99 0 000 9c0 1.45.35 2.83.96 4.06l3.01-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.94l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419z"/>
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('student')
  const [error, setError] = useState(searchParams.get('error') === 'oauth_failed' ? 'That sign-in attempt failed. Please try again.' : '')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', password: '', center_name: '' })

  function startOAuth(provider) {
    window.location.href = `${BACKEND}/api/auth/${provider}`
  }

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
              src="/tlms-icon.svg"
              alt="TLMS"
              style={{ width: '72px', height: '72px', marginBottom: '0.8rem' }}
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

          {/* OAuth buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.4rem' }}>
            <motion.button
              type="button" onClick={() => startOAuth('google')}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              style={{
                height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: '#fff', border: '1px solid #e4e4e7', borderRadius: '999px',
                fontWeight: 600, fontSize: '0.88rem', color: '#18181b', cursor: 'pointer',
              }}
            >
              <GoogleIcon /> Continue with Google
            </motion.button>
            <motion.button
              type="button" onClick={() => startOAuth('discord')}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              style={{
                height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: '#fff', border: '1px solid #e4e4e7', borderRadius: '999px',
                fontWeight: 600, fontSize: '0.88rem', color: '#18181b', cursor: 'pointer',
              }}
            >
              <DiscordIcon /> Continue with Discord
            </motion.button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.4rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#e4e4e7' }} />
            <span style={{ fontSize: '0.72rem', color: '#a1a1aa', letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#e4e4e7' }} />
          </div>

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
