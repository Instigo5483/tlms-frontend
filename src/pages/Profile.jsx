import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const ACCENT = '#4f46e5'

export default function Profile() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrollStatus, setEnrollStatus] = useState(null)
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState('')
  const [removeModal, setRemoveModal] = useState(false)
  const [alertMsg, setAlertMsg] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const endpoint = type === 'center' ? `/api/center/${id}` : `/api/tutor/${id}`
        const res = await fetch(`${BACKEND}${endpoint}`)
        const data = await res.json()
        if (!res.ok) { setError('Profile not found'); return }
        setProfile(data)
      } catch {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    async function checkStatus() {
      if (!user || user.role !== 'student') return
      try {
        const res = await fetch(`${BACKEND}/api/enroll/status/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setEnrollStatus(data)
      } catch (err) { console.error(err) }
    }

    load()
    checkStatus()
  }, [id, type])

  async function handleEnroll() {
    if (!user) { navigate('/login'); return }
    setEnrolling(true)
    try {
      const res = await fetch(`${BACKEND}/api/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ tutor_id: id })
      })
      const data = await res.json()
      if (!res.ok) { setAlertMsg(data.error || 'Failed to send request'); return }
      setEnrollStatus(data)
    } catch { setAlertMsg('Failed to send request. Try again.') }
    finally { setEnrolling(false) }
  }

  function handleRemove() {
    if (!enrollStatus?.id) return
    setRemoveModal(true)
  }

  async function confirmRemove() {
    setRemoveModal(false)
    try {
      const res = await fetch(`${BACKEND}/api/enrollments/${enrollStatus.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) { setAlertMsg('Failed to remove. Try again.'); return }
      setEnrollStatus(null)
    } catch { setAlertMsg('Failed to remove. Try again.') }
  }

  function EnrollButton() {
    if (!user || user.role !== 'student') return null
    if (!enrollStatus) return (
      <motion.button
        onClick={handleEnroll} disabled={enrolling}
        whileHover={{ scale: enrolling ? 1 : 1.03 }}
        whileTap={{ scale: enrolling ? 1 : 0.97 }}
        style={{
          padding: '10px 24px',
          background: enrolling ? '#e4e4e7' : ACCENT,
          color: '#fff', border: 'none', borderRadius: '999px',
          fontWeight: 700, cursor: enrolling ? 'not-allowed' : 'pointer',
          fontSize: '0.9rem', whiteSpace: 'nowrap'
        }}>
        {enrolling ? 'Sending...' : type === 'center' ? 'Enroll' : 'Connect'}
      </motion.button>
    )
    if (enrollStatus.status === 'pending') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ padding: '8px 16px', borderRadius: '10px', background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', fontSize: '0.82rem', fontWeight: 600 }}>⏳ Request Pending</span>
        <button onClick={handleRemove} style={{ padding: '8px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem' }}>Cancel</button>
      </div>
    )
    if (enrollStatus.status === 'accepted') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ padding: '8px 16px', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', fontSize: '0.82rem', fontWeight: 600 }}>✓ Connected</span>
        <button onClick={handleRemove} style={{ padding: '8px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem' }}>Remove</button>
      </div>
    )
    if (enrollStatus.status === 'rejected') return (
      <span style={{ padding: '8px 16px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>Request Declined</span>
    )
    return null
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <main style={{ padding: '120px 1.5rem', textAlign: 'center' }}>
        <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Loading profile...</motion.div>
      </main>
    </div>
  )

  if (error || !profile) return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <main style={{ padding: '120px 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.25 }}>◎</div>
        <p style={{ color: '#71717a', marginBottom: '1.5rem' }}>{error || 'Profile not found'}</p>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/discover')}
          style={{ padding: '10px 24px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '999px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Back to Discover</motion.button>
      </main>
    </div>
  )

  const isCenter = type === 'center'
  const initials = (isCenter ? profile.center_name : profile.full_name)
    ?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'
  const displayName = isCenter ? profile.center_name : profile.full_name
  const roleColor = isCenter ? '#db2777' : ACCENT
  const roleBg = isCenter ? '#fdf2f8' : '#eef2ff'
  const roleBorder = isCenter ? '#fbcfe8' : '#e0e7ff'

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />

      <main style={{ padding: '96px 1.5rem 3rem', maxWidth: '800px', margin: '0 auto' }}>
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/discover')}
          style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1.5rem', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>← Back to Discover</motion.button>

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '24px', padding: '2rem', marginBottom: '1.2rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '18px', flexShrink: 0,
              background: roleBg, border: `1px solid ${roleBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.4rem', color: roleColor
            }}>{initials}</div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h1 className="font-display" style={{ color: '#18181b', fontWeight: 700, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', letterSpacing: '-0.02em' }}>
                  {displayName}
                </h1>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: '999px', background: roleBg, color: roleColor, border: `1px solid ${roleBorder}` }}>{isCenter ? 'Tuition Center' : 'Tutor'}</span>
              </div>
              {(profile.district || profile.state) && (
                <p style={{ color: '#71717a', fontSize: '0.85rem', marginBottom: '6px' }}>
                  📍 {[profile.area, profile.district, profile.state, profile.country].filter(Boolean).join(', ')}
                </p>
              )}
              {!isCenter && profile.monthly_rate > 0 && (
                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: ACCENT }}>₹{profile.monthly_rate}/month</p>
              )}
            </div>

            <EnrollButton />
          </div>
        </motion.div>

        {/* Bio */}
        {profile.bio && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.2rem' }}
          >
            <h2 style={{ color: '#71717a', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>About</h2>
            <p style={{ color: '#3f3f46', lineHeight: 1.8, fontSize: '0.92rem' }}>{profile.bio}</p>
          </motion.div>
        )}

        {/* Subjects & Classes */}
        {(profile.subjects?.length > 0 || profile.grade_levels?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.2rem' }}
          >
            <h2 style={{ color: '#71717a', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Subjects & Classes</h2>
            {profile.subjects?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#a1a1aa', fontSize: '0.72rem', marginBottom: '8px', letterSpacing: '0.06em' }}>SUBJECTS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.subjects.map(s => (
                    <span key={s} style={{ background: '#eef2ff', border: '1px solid #e0e7ff', color: ACCENT, fontSize: '0.82rem', padding: '5px 14px', borderRadius: '8px' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {profile.grade_levels?.length > 0 && (
              <div>
                <p style={{ color: '#a1a1aa', fontSize: '0.72rem', marginBottom: '8px', letterSpacing: '0.06em' }}>CLASS LEVELS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.grade_levels.map(g => (
                    <span key={g} style={{ background: '#ecfeff', border: '1px solid #a5f3fc', color: '#0891b2', fontSize: '0.82rem', padding: '5px 14px', borderRadius: '8px' }}>{g}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Contact */}
        {(profile.phone || profile.email || profile.website || profile.address) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '20px', padding: '1.5rem' }}
          >
            <h2 style={{ color: '#71717a', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {profile.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '20px' }}>📞</span>
                  <span style={{ color: '#52525b', fontSize: '0.88rem' }}>{profile.phone}</span>
                </div>
              )}
              {profile.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '20px' }}>✉️</span>
                  <a href={`mailto:${profile.email}`} style={{ fontSize: '0.88rem', color: ACCENT }}>{profile.email}</a>
                </div>
              )}
              {isCenter && profile.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ width: '20px' }}>🏢</span>
                  <span style={{ color: '#52525b', fontSize: '0.88rem', lineHeight: 1.6 }}>{profile.address}</span>
                </div>
              )}
              {isCenter && profile.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '20px' }}>🌐</span>
                  <a href={profile.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.88rem', color: '#db2777' }}>{profile.website}</a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      <ConfirmModal
        open={removeModal}
        title="Remove Connection"
        message="This will cancel your enrollment. You can send a new request in the future."
        confirmLabel="Remove"
        onConfirm={confirmRemove}
        onCancel={() => setRemoveModal(false)}
        accentColor="#dc2626"
      />

      <ConfirmModal
        open={!!alertMsg}
        title="Something went wrong"
        message={alertMsg}
        confirmLabel="OK"
        onConfirm={() => setAlertMsg(null)}
        onCancel={() => setAlertMsg(null)}
        hideCancel
        accentColor="#dc2626"
      />
    </div>
  )
}
