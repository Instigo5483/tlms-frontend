import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

export default function TutorDashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadedProfile, setLoadedProfile] = useState(null)
  const [profile, setProfile] = useState({
    bio: '', hourly_rate: '', subjects: '', grade_levels: ''
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`${BACKEND}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setLoadedProfile(data)
        setProfile({
          bio: data.bio || '',
          hourly_rate: data.hourly_rate || '',
          subjects: data.subjects?.join(', ') || '',
          grade_levels: data.grade_levels?.join(', ') || '',
        })
      } catch (err) {
        console.error('Failed to load profile', err)
      }
    }
    loadProfile()
  }, [])

  async function saveProfile() {
    setSaving(true)
    try {
      const res = await fetch(`${BACKEND}/api/tutor/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bio: profile.bio,
          hourly_rate: Number(profile.hourly_rate),
          subjects: profile.subjects.split(',').map(s => s.trim()).filter(Boolean),
          grade_levels: profile.grade_levels.split(',').map(s => s.trim()).filter(Boolean),
        })
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Failed to save'); return }

      // Update loadedProfile to reflect saved values
      setLoadedProfile(prev => ({
        ...prev,
        bio: profile.bio,
        hourly_rate: Number(profile.hourly_rate),
        subjects: profile.subjects.split(',').map(s => s.trim()).filter(Boolean),
        grade_levels: profile.grade_levels.split(',').map(s => s.trim()).filter(Boolean),
      }))
      setEditing(false)
    } catch {
      alert('Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const subjectCount = loadedProfile?.subjects?.length || 0

  return (
    <>
      <Navbar />
      <main style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh', background: '#0a0f1e',
        padding: '84px 1.5rem 3rem',
        maxWidth: '1100px', margin: '0 auto'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '2.5rem',
          flexWrap: 'wrap', gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: 'rgba(26,115,232,0.2)',
              border: '2px solid rgba(26,115,232,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '1.1rem', color: '#60a5fa'
            }}>
              {initials}
            </div>
            <div>
              <h1 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.5rem' }}>
                {user?.full_name || 'Tutor'}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{user?.email}</p>
            </div>
          </div>
          <span style={{
            background: 'rgba(26,115,232,0.15)',
            border: '1px solid rgba(26,115,232,0.3)',
            color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600,
            padding: '5px 14px', borderRadius: '20px'
          }}>
            Tutor Account
          </span>
        </div>

        {/* Profile card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '1.8rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '1.4rem'
          }}>
            <h2 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1.05rem' }}>
              Your Profile
            </h2>
            <button onClick={() => setEditing(!editing)} style={{
              padding: '7px 18px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent', color: '#94a3b8',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
            }}>
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Bio', name: 'bio', placeholder: 'Tell students about yourself...', type: 'textarea' },
                { label: 'Subjects (comma separated)', name: 'subjects', placeholder: 'Math, Physics, Chemistry' },
                { label: 'Grade Levels (comma separated)', name: 'grade_levels', placeholder: 'Grade 9, Grade 10, A-Level' },
                { label: 'Hourly Rate (₹)', name: 'hourly_rate', placeholder: '500', type: 'number' },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
                    {f.label}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea
                      rows={3} placeholder={f.placeholder}
                      value={profile[f.name]}
                      onChange={e => setProfile(p => ({ ...p, [f.name]: e.target.value }))}
                      style={{
                        width: '100%', padding: '10px 14px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '8px', color: '#f1f5f9',
                        fontSize: '0.95rem', outline: 'none', resize: 'vertical'
                      }}
                    />
                  ) : (
                    <input
                      type={f.type || 'text'} placeholder={f.placeholder}
                      value={profile[f.name]}
                      onChange={e => setProfile(p => ({ ...p, [f.name]: e.target.value }))}
                      style={{
                        width: '100%', height: '44px', padding: '0 14px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '8px', color: '#f1f5f9',
                        fontSize: '0.95rem', outline: 'none'
                      }}
                    />
                  )}
                </div>
              ))}
              <button onClick={saveProfile} disabled={saving} style={{
                alignSelf: 'flex-start', padding: '10px 28px',
                background: '#1a73e8', color: '#fff', border: 'none',
                borderRadius: '8px', fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.95rem'
              }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : loadedProfile?.bio ? (
            // Show saved profile data
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {loadedProfile.bio}
              </p>
              {loadedProfile.subjects?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {loadedProfile.subjects.map(s => (
                    <span key={s} style={{
                      background: 'rgba(26,115,232,0.12)',
                      border: '1px solid rgba(26,115,232,0.2)',
                      color: '#60a5fa', fontSize: '0.8rem',
                      padding: '3px 12px', borderRadius: '6px'
                    }}>{s}</span>
                  ))}
                </div>
              )}
              {loadedProfile.grade_levels?.length > 0 && (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  📚 {loadedProfile.grade_levels.join(', ')}
                </p>
              )}
              {loadedProfile.hourly_rate > 0 && (
                <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '1rem' }}>
                  ₹{loadedProfile.hourly_rate}/hr
                </p>
              )}
            </div>
          ) : (
            // Empty state
            <div style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.7 }}>
              <p>Complete your profile so students can find you on the Discover page.</p>
              <p style={{ marginTop: '0.5rem', color: '#475569' }}>
                Add your subjects, grade levels, hourly rate, and a short bio.
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { label: 'Profile Views', value: '0', icon: '👁️' },
            { label: 'Student Inquiries', value: '0', icon: '✉️' },
            { label: 'Subjects Listed', value: String(subjectCount), icon: '📘' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px', padding: '1.4rem'
            }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f1f5f9' }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

      </main>
    </>
  )
}