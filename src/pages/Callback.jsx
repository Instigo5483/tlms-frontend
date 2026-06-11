import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function Callback() {
  const { getAccessTokenSilently, user: auth0User, isLoading, isAuthenticated } = useAuth0()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [needsProfile, setNeedsProfile] = useState(false)
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({ full_name: '', center_name: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && isAuthenticated && auth0User) {
      syncUser()
    }
  }, [isLoading, isAuthenticated, auth0User])

  async function syncUser(extraData = null) {
    try {
      const token = await getAccessTokenSilently()
      const body = {
        email: auth0User.email,
        role: extraData?.role || role,
        full_name: extraData?.full_name || auth0User.name || auth0User.email,
        center_name: extraData?.center_name || ''
      }

      const res = await fetch(`${BACKEND}/api/auth/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      const data = await res.json()

      if (res.status === 400 && data.error?.includes('role')) {
        setNeedsProfile(true)
        return
      }

      if (!res.ok) { setError(data.error || 'Sync failed'); return }

      login(data.token, data.user)

      if (data.user.role === 'student') navigate('/dashboard/student')
      else if (data.user.role === 'tutor') navigate('/dashboard/tutor')
      else navigate('/dashboard/center')

    } catch (err) {
      console.error(err)
      setNeedsProfile(true)
    }
  }

  async function handleProfileSubmit(e) {
    e.preventDefault()
    if (!form.full_name) { setError('Full name is required'); return }
    setSaving(true)
    await syncUser({ role, full_name: form.full_name, center_name: form.center_name })
    setSaving(false)
  }

  if (isLoading) return (
    <div style={{
      minHeight: '100vh', background: '#080c14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#64748b'
    }}>
      Verifying your email...
    </div>
  )

  if (needsProfile) return (
    <div style={{
      minHeight: '100vh', background: '#080c14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <h2 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.4rem' }}>
          Complete your profile
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
          {auth0User?.email} — tell us about yourself
        </p>

        {/* Role tabs */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.05)',
          borderRadius: '10px', padding: '4px', marginBottom: '1.5rem', gap: '2px'
        }}>
          {['student', 'tutor', 'center'].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex: 1, padding: '8px 4px', border: 'none', cursor: 'pointer',
              borderRadius: '8px', fontWeight: 600, fontSize: '0.78rem',
              background: role === r ? '#1a73e8' : 'transparent',
              color: role === r ? '#fff' : '#94a3b8'
            }}>
              {r === 'student' ? 'Student' : r === 'tutor' ? 'Tutor' : 'Center'}
            </button>
          ))}
        </div>

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text" placeholder="Your full name"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              required style={inputStyle}
            />
          </div>

          {role === 'center' && (
            <div>
              <label style={labelStyle}>Center Name</label>
              <input
                type="text" placeholder="Your tuition center name"
                value={form.center_name}
                onChange={e => setForm(f => ({ ...f, center_name: e.target.value }))}
                required style={inputStyle}
              />
            </div>
          )}

          {error && (
            <p style={{
              color: '#f87171', fontSize: '0.85rem',
              background: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.2)',
              padding: '10px 14px', borderRadius: '8px'
            }}>{error}</p>
          )}

          <button type="submit" disabled={saving} style={{
            height: '48px', background: saving ? '#1557b0' : '#1a73e8',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontWeight: 700, fontSize: '1rem',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}>
            {saving ? 'Setting up...' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#080c14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#64748b'
    }}>
      Setting up your account...
    </div>
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