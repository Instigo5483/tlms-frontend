import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
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
      } catch (err) {
        console.error(err)
      }
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tutor_id: id })
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Failed to send request'); return }
      setEnrollStatus(data)
    } catch {
      alert('Failed to send request. Try again.')
    } finally {
      setEnrolling(false)
    }
  }

  async function handleRemove() {
    if (!enrollStatus?.id) return
    if (!confirm('Remove this connection?')) return
    try {
      await fetch(`${BACKEND}/api/enrollments/${enrollStatus.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setEnrollStatus(null)
    } catch {
      alert('Failed to remove. Try again.')
    }
  }

  function EnrollButton() {
    if (!user || user.role !== 'student') return null
    if (!enrollStatus) return (
      <button onClick={handleEnroll} disabled={enrolling} style={{
        padding: '10px 24px', background: '#1a73e8',
        color: '#fff', border: 'none', borderRadius: '10px',
        fontWeight: 700, cursor: enrolling ? 'not-allowed' : 'pointer',
        fontSize: '0.95rem', whiteSpace: 'nowrap'
      }}>
        {enrolling ? 'Sending...' : type === 'center' ? 'Enroll' : 'Connect'}
      </button>
    )
    if (enrollStatus.status === 'pending') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          padding: '8px 16px', borderRadius: '10px',
          background: 'rgba(234,179,8,0.15)',
          border: '1px solid rgba(234,179,8,0.3)',
          color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600
        }}>⏳ Request Pending</span>
        <button onClick={handleRemove} style={{
          padding: '8px 14px', background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.2)',
          borderRadius: '8px', color: '#f87171',
          cursor: 'pointer', fontSize: '0.82rem'
        }}>Cancel</button>
      </div>
    )
    if (enrollStatus.status === 'accepted') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          padding: '8px 16px', borderRadius: '10px',
          background: 'rgba(29,158,117,0.15)',
          border: '1px solid rgba(29,158,117,0.3)',
          color: '#34d399', fontSize: '0.85rem', fontWeight: 600
        }}>✓ Connected</span>
        <button onClick={handleRemove} style={{
          padding: '8px 14px', background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.2)',
          borderRadius: '8px', color: '#f87171',
          cursor: 'pointer', fontSize: '0.82rem'
        }}>Remove</button>
      </div>
    )
    if (enrollStatus.status === 'rejected') return (
      <span style={{
        padding: '8px 16px', borderRadius: '10px',
        background: 'rgba(248,113,113,0.1)',
        border: '1px solid rgba(248,113,113,0.2)',
        color: '#f87171', fontSize: '0.85rem', fontWeight: 600
      }}>Request Declined</span>
    )
    return null
  }

  if (loading) return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#080c14', padding: '100px 1.5rem', textAlign: 'center' }}>
        <div style={{ color: '#64748b' }}>Loading...</div>
      </main>
    </>
  )

  if (error || !profile) return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#080c14', padding: '100px 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
        <p style={{ color: '#64748b' }}>{error || 'Profile not found'}</p>
        <button onClick={() => navigate('/discover')} style={{
          marginTop: '1rem', padding: '10px 24px', background: '#1a73e8',
          color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>Back to Discover</button>
      </main>
    </>
  )

  const isCenter = type === 'center'
  const initials = (isCenter ? profile.center_name : profile.full_name)
    ?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'
  const displayName = isCenter ? profile.center_name : profile.full_name

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '100vh', background: '#080c14',
        padding: '84px 1.5rem 3rem',
        maxWidth: '800px', margin: '0 auto'
      }}>
        <button onClick={() => navigate('/discover')} style={{
          background: 'none', border: 'none', color: '#64748b',
          cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1.5rem', padding: 0
        }}>← Back to Discover</button>

        {/* Header card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
              background: isCenter ? 'rgba(29,158,117,0.2)' : 'rgba(26,115,232,0.2)',
              border: `2px solid ${isCenter ? 'rgba(29,158,117,0.4)' : 'rgba(26,115,232,0.4)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '1.4rem',
              color: isCenter ? '#34d399' : '#60a5fa'
            }}>{initials}</div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.6rem' }}>{displayName}</h1>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: '10px',
                  background: isCenter ? 'rgba(29,158,117,0.15)' : 'rgba(26,115,232,0.15)',
                  color: isCenter ? '#34d399' : '#60a5fa'
                }}>{isCenter ? 'Tuition Center' : 'Tutor'}</span>
              </div>
              {(profile.district || profile.state) && (
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '6px' }}>
                  📍 {[profile.area, profile.district, profile.state, profile.country].filter(Boolean).join(', ')}
                </p>
              )}
              {!isCenter && profile.monthly_rate > 0 && (
                <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '1.1rem' }}>
                  ₹{profile.monthly_rate}/month
                </p>
              )}
            </div>

            <EnrollButton />
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem'
          }}>
            <h2 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem', marginBottom: '0.8rem' }}>About</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.95rem' }}>{profile.bio}</p>
          </div>
        )}

        {/* Subjects & Grades */}
        {(profile.subjects?.length > 0 || profile.grade_levels?.length > 0) && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem'
          }}>
            <h2 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>Subjects & Grades</h2>
            {profile.subjects?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '8px' }}>SUBJECTS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.subjects.map(s => (
                    <span key={s} style={{
                      background: 'rgba(26,115,232,0.12)',
                      border: '1px solid rgba(26,115,232,0.2)',
                      color: '#60a5fa', fontSize: '0.85rem',
                      padding: '5px 14px', borderRadius: '8px'
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {profile.grade_levels?.length > 0 && (
              <div>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '8px' }}>GRADE LEVELS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.grade_levels.map(g => (
                    <span key={g} style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#94a3b8', fontSize: '0.85rem',
                      padding: '5px 14px', borderRadius: '8px'
                    }}>{g}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact */}
        {(profile.phone || profile.email || profile.website || profile.address) && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.5rem'
          }}>
            <h2 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {profile.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#475569', width: '20px' }}>📞</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{profile.phone}</span>
                </div>
              )}
              {profile.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#475569', width: '20px' }}>✉️</span>
                  <a href={`mailto:${profile.email}`} style={{ color: '#1a73e8', fontSize: '0.9rem' }}>{profile.email}</a>
                </div>
              )}
              {isCenter && profile.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#475569', width: '20px' }}>🏢</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{profile.address}</span>
                </div>
              )}
              {isCenter && profile.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#475569', width: '20px' }}>🌐</span>
                  <a href={profile.website} target="_blank" rel="noreferrer" style={{ color: '#1a73e8', fontSize: '0.9rem' }}>{profile.website}</a>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  )
}