import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL

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
          background: enrolling ? 'rgba(168,85,247,0.2)' : 'linear-gradient(135deg, #a855f7, #06b6d4)',
          color: '#fff', border: 'none', borderRadius: '12px',
          fontWeight: 700, cursor: enrolling ? 'not-allowed' : 'pointer',
          fontSize: '0.9rem', whiteSpace: 'nowrap'
        }}>
        {enrolling ? 'Sending...' : type === 'center' ? 'Enroll' : 'Connect'}
      </motion.button>
    )
    if (enrollStatus.status === 'pending') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          padding: '8px 16px', borderRadius: '10px',
          background: 'rgba(234,179,8,0.1)',
          border: '1px solid rgba(234,179,8,0.2)',
          color: '#fbbf24', fontSize: '0.82rem', fontWeight: 600
        }}>⏳ Request Pending</span>
        <button onClick={handleRemove} style={{
          padding: '8px 14px', background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.15)',
          borderRadius: '8px', color: '#f87171',
          cursor: 'pointer', fontSize: '0.78rem'
        }}>Cancel</button>
      </div>
    )
    if (enrollStatus.status === 'accepted') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          padding: '8px 16px', borderRadius: '10px',
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.2)',
          color: '#10b981', fontSize: '0.82rem', fontWeight: 600
        }}>✓ Connected</span>
        <button onClick={handleRemove} style={{
          padding: '8px 14px', background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.15)',
          borderRadius: '8px', color: '#f87171',
          cursor: 'pointer', fontSize: '0.78rem'
        }}>Remove</button>
      </div>
    )
    if (enrollStatus.status === 'rejected') return (
      <span style={{
        padding: '8px 16px', borderRadius: '10px',
        background: 'rgba(248,113,113,0.08)',
        border: '1px solid rgba(248,113,113,0.15)',
        color: '#f87171', fontSize: '0.82rem', fontWeight: 600
      }}>Request Declined</span>
    )
    return null
  }

  if (loading) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '120px 1.5rem', textAlign: 'center' }}>
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}
        >Loading profile...</motion.div>
      </main>
    </div>
  )

  if (error || !profile) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '120px 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>◎</div>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>{error || 'Profile not found'}</p>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/discover')}
          style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
          }}>Back to Discover</motion.button>
      </main>
    </div>
  )

  const isCenter = type === 'center'
  const initials = (isCenter ? profile.center_name : profile.full_name)
    ?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'
  const displayName = isCenter ? profile.center_name : profile.full_name

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Navbar />

      <main style={{
        padding: '84px 1.5rem 3rem',
        maxWidth: '800px', margin: '0 auto',
        position: 'relative', zIndex: 1
      }}>
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/discover')}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.35)',
            cursor: 'pointer', fontSize: '0.85rem',
            marginBottom: '1.5rem', padding: 0,
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>← Back to Discover</motion.button>

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: isCenter ? 'rgba(6,182,212,0.05)' : 'rgba(168,85,247,0.05)',
            border: `1px solid ${isCenter ? 'rgba(6,182,212,0.2)' : 'rgba(168,85,247,0.2)'}`,
            borderRadius: '20px', padding: '2rem', marginBottom: '1.2rem',
            position: 'relative', overflow: 'hidden'
          }}
        >
          {/* Top line */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '40%', height: '1px',
            background: `linear-gradient(90deg, transparent, ${isCenter ? 'rgba(6,182,212,0.5)' : 'rgba(168,85,247,0.5)'}, transparent)`
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '16px', flexShrink: 0,
              background: isCenter ? 'rgba(6,182,212,0.15)' : 'rgba(168,85,247,0.15)',
              border: `1px solid ${isCenter ? 'rgba(6,182,212,0.3)' : 'rgba(168,85,247,0.3)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.4rem',
              color: isCenter ? '#06b6d4' : '#a855f7'
            }}>{initials}</div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', letterSpacing: '-0.02em' }}>
                  {displayName}
                </h1>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
                  background: isCenter ? 'rgba(6,182,212,0.12)' : 'rgba(168,85,247,0.12)',
                  color: isCenter ? '#06b6d4' : '#a855f7',
                  border: `1px solid ${isCenter ? 'rgba(6,182,212,0.2)' : 'rgba(168,85,247,0.2)'}`
                }}>{isCenter ? 'Tuition Center' : 'Tutor'}</span>
              </div>
              {(profile.district || profile.state) && (
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', marginBottom: '6px' }}>
                  📍 {[profile.area, profile.district, profile.state, profile.country].filter(Boolean).join(', ')}
                </p>
              )}
              {!isCenter && profile.monthly_rate > 0 && (
                <p style={{
                  fontWeight: 800, fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>₹{profile.monthly_rate}/month</p>
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
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px', padding: '1.5rem', marginBottom: '1.2rem'
            }}
          >
            <h2 style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>About</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '0.92rem' }}>{profile.bio}</p>
          </motion.div>
        )}

        {/* Subjects & Grades */}
        {(profile.subjects?.length > 0 || profile.grade_levels?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px', padding: '1.5rem', marginBottom: '1.2rem'
            }}
          >
            <h2 style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Subjects & Classes</h2>
            {profile.subjects?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', marginBottom: '8px', letterSpacing: '0.06em' }}>SUBJECTS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.subjects.map(s => (
                    <span key={s} style={{
                      background: 'rgba(168,85,247,0.1)',
                      border: '1px solid rgba(168,85,247,0.2)',
                      color: '#a855f7', fontSize: '0.82rem',
                      padding: '5px 14px', borderRadius: '8px'
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {profile.grade_levels?.length > 0 && (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', marginBottom: '8px', letterSpacing: '0.06em' }}>GRADE LEVELS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.grade_levels.map(g => (
                    <span key={g} style={{
                      background: 'rgba(6,182,212,0.08)',
                      border: '1px solid rgba(6,182,212,0.15)',
                      color: 'rgba(6,182,212,0.8)', fontSize: '0.82rem',
                      padding: '5px 14px', borderRadius: '8px'
                    }}>{g}</span>
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
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px', padding: '1.5rem'
            }}
          >
            <h2 style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {profile.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)', width: '20px' }}>📞</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>{profile.phone}</span>
                </div>
              )}
              {profile.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)', width: '20px' }}>✉️</span>
                  <a href={`mailto:${profile.email}`} style={{
                    fontSize: '0.88rem',
                    background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>{profile.email}</a>
                </div>
              )}
              {isCenter && profile.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)', width: '20px' }}>🏢</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: 1.6 }}>{profile.address}</span>
                </div>
              )}
              {isCenter && profile.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)', width: '20px' }}>🌐</span>
                  <a href={profile.website} target="_blank" rel="noreferrer" style={{
                    fontSize: '0.88rem',
                    background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>{profile.website}</a>
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
        accentColor="#f87171"
      />

      <ConfirmModal
        open={!!alertMsg}
        title="Something went wrong"
        message={alertMsg}
        confirmLabel="OK"
        onConfirm={() => setAlertMsg(null)}
        onCancel={() => setAlertMsg(null)}
        hideCancel
        accentColor="#f87171"
      />
    </div>
  )
}