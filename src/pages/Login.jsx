import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ThreeBackground from '../components/ThreeBackground'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = 'http://localhost:3001'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [mode, setMode] = useState('login')       // 'login' | 'signup'
  const [role, setRole] = useState('student')     // 'student' | 'tutor'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    full_name: '', email: '', password: ''
  })

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
        : { email: form.email, password: form.password, role, full_name: form.full_name }

      const res = await fetch(`${BACKEND}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()

      if (!res.ok) { setError(data.error || 'Something went wrong'); return }

      login(data.token, data.user)
      navigate(data.user.role === 'student' ? '/dashboard/student' : '/dashboard/tutor')
    } catch {
      setError('Cannot connect to server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ThreeBackground />
      <Navbar />

      <main style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 1.5rem 2rem'
      }}>
        <div className="glass" style={{
          width: '100%', maxWidth: '420px', padding: '2.5rem'
        }}>

          {/* Role tabs */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px', padding: '4px', marginBottom: '1.8rem'
          }}>
            {['student', 'tutor'].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: '9px', border: 'none', cursor: 'pointer',
                borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem',
                transition: 'all 0.2s',
                background: role === r ? '#1a73e8' : 'transparent',
                color: role === r ? '#fff' : '#94a3b8'
              }}>
                {r === 'student' ? 'Student / Parent' : 'Tutor / Center'}
              </button>
            ))}
          </div>

          {/* Title */}
          <h2 style={{
            color: '#f1f5f9', fontWeight: 700,
            fontSize: '1.4rem', marginBottom: '0.4rem'
          }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
            {mode === 'login'
              ? `Sign in as ${role}`
              : `Join as ${role === 'student' ? 'a student' : 'a tutor'}`}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {mode === 'signup' && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  name="full_name" type="text" placeholder="Your full name"
                  value={form.full_name} onChange={handleChange}
                  required style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email</label>
              <input
                name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                required style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                name="password" type="password" placeholder="••••••••"
                value={form.password} onChange={handleChange}
                required minLength={6} style={inputStyle}
              />
            </div>

            {error && (
              <p style={{
                color: '#f87171', fontSize: '0.85rem',
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.2)',
                padding: '10px 14px', borderRadius: '8px'
              }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} style={{
              marginTop: '6px', height: '48px',
              background: loading ? '#1557b0' : '#1a73e8',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Mode toggle */}
          <p style={{
            textAlign: 'center', marginTop: '1.5rem',
            fontSize: '0.9rem', color: '#64748b'
          }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              style={{
                background: 'none', border: 'none',
                color: '#1a73e8', fontWeight: 700,
                cursor: 'pointer', fontSize: '0.9rem'
              }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

        </div>
      </main>
    </>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.85rem',
  fontWeight: 600, color: '#94a3b8', marginBottom: '6px'
}

const inputStyle = {
  width: '100%', height: '44px', padding: '0 14px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px', color: '#f1f5f9',
  fontSize: '0.95rem', outline: 'none'
}