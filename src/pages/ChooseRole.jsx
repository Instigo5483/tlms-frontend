import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const ACCENT = '#4f46e5'

const ROLES = [
  { key: 'student', icon: '🎓', title: 'Student', desc: 'Find and connect with tutors and coaching centers near you.' },
  { key: 'tutor', icon: '🧑‍🏫', title: 'Tutor', desc: 'Get discovered by students and manage your teaching business.' },
  { key: 'center', icon: '🏫', title: 'Tuition Center', desc: 'List your center and manage enrollments and payments.' },
]

export default function ChooseRole() {
  const navigate = useNavigate()
  const { user, token, login } = useAuth()
  const [role, setRole] = useState(null)
  const [centerName, setCenterName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleContinue() {
    if (!role) return
    if (role === 'center' && !centerName.trim()) { setError('Please enter your center name.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND}/api/auth/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role, center_name: centerName })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong'); return }
      login(data.token, data.user)
      if (role === 'student') navigate('/dashboard/student')
      else if (role === 'tutor') navigate('/dashboard/tutor')
      else navigate('/dashboard/center')
    } catch {
      setError('Failed to save your role. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 1.5rem 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: '460px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 24px 60px rgba(24,24,27,0.08)' }}
        >
          <h2 className="font-display" style={{ fontWeight: 700, fontSize: '1.35rem', letterSpacing: '-0.02em', marginBottom: '0.3rem', color: '#18181b' }}>
            Welcome{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1.8rem' }}>
            Tell us who you are so we can set up your account.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.2rem' }}>
            {ROLES.map(r => (
              <motion.button
                key={r.key} type="button" onClick={() => setRole(r.key)}
                whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '14px 16px', borderRadius: '16px', textAlign: 'left', cursor: 'pointer',
                  background: role === r.key ? '#eef2ff' : '#fff',
                  border: `1px solid ${role === r.key ? ACCENT : '#e4e4e7'}`,
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: role === r.key ? ACCENT : '#18181b' }}>{r.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '2px' }}>{r.desc}</div>
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {role === 'center' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }} style={{ overflow: 'hidden', marginBottom: '1rem' }}
              >
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#71717a', marginBottom: '6px' }}>Center Name</label>
                <input type="text" placeholder="Your tuition center name" value={centerName}
                  onChange={e => setCenterName(e.target.value)}
                  style={{ width: '100%', height: '42px', padding: '0 12px' }} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ color: '#18181b', fontSize: '0.82rem', background: '#f4f4f5', border: '1px solid #d4d4d8', padding: '10px 12px', borderRadius: '10px', marginBottom: '1rem' }}
              >{error}</motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="button" disabled={!role || loading} onClick={handleContinue}
            whileHover={{ scale: !role || loading ? 1 : 1.02 }} whileTap={{ scale: !role || loading ? 1 : 0.98 }}
            style={{
              width: '100%', height: '46px',
              background: !role || loading ? '#e4e4e7' : ACCENT,
              boxShadow: !role || loading ? 'none' : '0 8px 20px rgba(79,70,229,0.28)',
              color: !role || loading ? '#a1a1aa' : '#fff',
              border: 'none', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem',
              cursor: !role || loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Setting up...' : 'Continue'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
