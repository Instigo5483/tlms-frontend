import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function CenterDashboard() {
  const { user, token } = useAuth()

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  const [tab, setTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(null)
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [profile, setProfile] = useState({
    center_name: '', phone: '', address: '',
    country: '', state: '', district: '', area: '',
    subjects: '', grade_levels: '', bio: '', website: ''
  })

  useEffect(() => { loadProfile(); loadStudents() }, [])

  async function loadProfile() {
    try {
      const res = await fetch(`${BACKEND}/api/center/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setLoaded(data)
      setProfile({
        center_name: data.center_name || '',
        phone: data.phone || '',
        address: data.address || '',
        country: data.country || '',
        state: data.state || '',
        district: data.district || '',
        area: data.area || '',
        subjects: data.subjects?.join(', ') || '',
        grade_levels: data.grade_levels?.join(', ') || '',
        bio: data.bio || '',
        website: data.website || ''
      })
    } catch (err) { console.error(err) }
  }

  async function loadStudents() {
    setStudentsLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/enrollments/incoming`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setStudents(Array.isArray(data) ? data : [])
    } catch (err) { console.error(err) }
    finally { setStudentsLoading(false) }
  }

  async function save() {
    setSaving(true)
    try {
      const subjectsArr = profile.subjects.split(',').map(s => s.trim()).filter(Boolean)
      const gradesArr = profile.grade_levels.split(',').map(s => s.trim()).filter(Boolean)
      const res = await fetch(`${BACKEND}/api/center/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...profile, subjects: subjectsArr, grade_levels: gradesArr })
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Failed to save'); return }
      setLoaded(prev => ({ ...prev, ...profile, subjects: subjectsArr, grade_levels: gradesArr }))
      setEditing(false)
    } catch { alert('Failed to save. Try again.') }
    finally { setSaving(false) }
  }

  async function handleAccept(enrollmentId) {
    const fee = prompt('Set monthly fee (₹) for this student (enter 0 for free):')
    if (fee === null) return
    try {
      await fetch(`${BACKEND}/api/enrollments/${enrollmentId}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ monthly_fee: Number(fee), fee_day: 1 })
      })
      setStudents(prev => prev.map(s =>
        s.id === enrollmentId ? { ...s, status: 'accepted', monthly_fee: Number(fee) } : s
      ))
    } catch { alert('Failed. Try again.') }
  }

  async function handleReject(enrollmentId) {
    if (!confirm('Decline this request?')) return
    try {
      await fetch(`${BACKEND}/api/enrollments/${enrollmentId}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setStudents(prev => prev.map(s =>
        s.id === enrollmentId ? { ...s, status: 'rejected' } : s
      ))
    } catch { alert('Failed. Try again.') }
  }

  async function handleRemoveStudent(enrollmentId) {
    if (!confirm('Remove this student?')) return
    try {
      await fetch(`${BACKEND}/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setStudents(prev => prev.filter(s => s.id !== enrollmentId))
    } catch { alert('Failed. Try again.') }
  }

  const pending = students.filter(s => s.status === 'pending')
  const accepted = students.filter(s => s.status === 'accepted')

  const fields = [
    { label: 'Center Name', name: 'center_name', placeholder: 'ABC Tuition Center' },
    { label: 'Phone', name: 'phone', placeholder: '+91 98765 43210' },
    { label: 'Address', name: 'address', placeholder: 'Full address', type: 'textarea' },
    { label: 'Country', name: 'country', placeholder: 'India' },
    { label: 'State', name: 'state', placeholder: 'Assam' },
    { label: 'District', name: 'district', placeholder: 'Kamrup' },
    { label: 'Area (optional)', name: 'area', placeholder: 'Guwahati' },
    { label: 'Subjects (comma separated)', name: 'subjects', placeholder: 'Math, Science' },
    { label: 'Grade Levels (comma separated)', name: 'grade_levels', placeholder: 'Grade 9, Grade 10' },
    { label: 'Bio', name: 'bio', placeholder: 'About your center...', type: 'textarea' },
    { label: 'Website (optional)', name: 'website', placeholder: 'https://yourcenter.com' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <Navbar />
      <main style={{ padding: '80px 1.5rem 3rem', maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', paddingTop: '1rem', flexWrap: 'wrap' }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1rem', color: '#fff'
          }}>{initials}</div>
          <div>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', letterSpacing: '-0.02em' }}>
              {loaded?.center_name || user?.full_name || 'Center'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginTop: '2px' }}>{user?.email}</p>
          </div>
          <span style={{
            marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 600,
            padding: '4px 12px', borderRadius: '999px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap'
          }}>Tuition Center</span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1px', marginBottom: '2rem',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          {[
            { label: 'Students', value: accepted.length },
            { label: 'Requests', value: pending.length },
            { label: 'Subjects', value: loaded?.subjects?.length || 0 },
          ].map(s => (
            <div key={s.label} style={{ padding: '1.2rem', background: '#000' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            display: 'flex', gap: '4px', marginBottom: '1.5rem',
            background: '#0a0a0a', padding: '4px', borderRadius: '12px',
            width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          {[
            { key: 'profile', label: 'Profile' },
            { key: 'requests', label: `Requests (${pending.length})` },
            { key: 'students', label: `Students (${accepted.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '7px 16px', border: 'none', cursor: 'pointer',
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
              background: tab === t.key ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}>{t.label}</button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Profile tab */}
          {tab === 'profile' && (
            <motion.div key="profile"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            >
              <div style={{
                background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px', padding: '1.8rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
                  <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>Center Profile</h2>
                  <button onClick={() => setEditing(!editing)} style={{
                    padding: '6px 16px', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'transparent', color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                  }}>{editing ? 'Cancel' : 'Edit'}</button>
                </div>

                <AnimatePresence mode="wait">
                  {editing ? (
                    <motion.div key="edit"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                    >
                      {fields.map(f => (
                        <div key={f.name}>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', fontWeight: 500 }}>
                            {f.label}
                          </label>
                          {f.type === 'textarea' ? (
                            <textarea rows={3} placeholder={f.placeholder}
                              value={profile[f.name]}
                              onChange={e => setProfile(p => ({ ...p, [f.name]: e.target.value }))}
                              style={{ width: '100%', padding: '10px 14px', background: '#111 !important', border: '1px solid rgba(255,255,255,0.08) !important', borderRadius: '10px !important', color: '#fff !important', fontSize: '0.9rem', resize: 'vertical' }}
                            />
                          ) : (
                            <input type="text" placeholder={f.placeholder}
                              value={profile[f.name]}
                              onChange={e => setProfile(p => ({ ...p, [f.name]: e.target.value }))}
                              style={{ width: '100%', height: '42px', padding: '0 14px', background: '#111 !important', border: '1px solid rgba(255,255,255,0.08) !important', borderRadius: '10px !important', color: '#fff !important', fontSize: '0.9rem' }}
                            />
                          )}
                        </div>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={save} disabled={saving}
                        style={{
                          alignSelf: 'flex-start', padding: '10px 28px',
                          background: saving ? 'rgba(255,255,255,0.1)' : '#fff',
                          color: saving ? 'rgba(255,255,255,0.4)' : '#000',
                          border: 'none', borderRadius: '10px', fontWeight: 700,
                          cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.9rem'
                        }}
                      >{saving ? 'Saving...' : 'Save Changes'}</motion.button>
                    </motion.div>
                  ) : loaded?.bio ? (
                    <motion.div key="view"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                    >
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7 }}>{loaded.bio}</p>
                      {loaded.address && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>{loaded.address}</p>}
                      {loaded.phone && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>{loaded.phone}</p>}
                      {loaded.website && (
                        <a href={loaded.website} target="_blank" rel="noreferrer"
                          style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>{loaded.website}</a>
                      )}
                      {loaded.subjects?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {loaded.subjects.map(s => (
                            <span key={s} style={{
                              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                              color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', padding: '3px 10px', borderRadius: '6px'
                            }}>{s}</span>
                          ))}
                        </div>
                      )}
                      {loaded.grade_levels?.length > 0 && (
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>{loaded.grade_levels.join(', ')}</p>
                      )}
                      {(loaded.district || loaded.state) && (
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                          {[loaded.area, loaded.district, loaded.state, loaded.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="empty"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem', lineHeight: 1.7 }}
                    >
                      Complete your center profile so students can find you.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Requests tab */}
          {tab === 'requests' && (
            <motion.div key="requests"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {studentsLoading ? (
                [1,2,3].map(i => (
                  <motion.div key={i}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                    style={{ height: '80px', background: '#0a0a0a', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}
                  />
                ))
              ) : pending.length === 0 ? (
                <EmptyState text="No pending requests" sub="New connection requests will appear here" />
              ) : pending.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px', padding: '1.1rem 1.2rem',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
                  }}
                >
                  <div>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{s.full_name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: '2px' }}>{s.email}</p>
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', marginTop: '2px' }}>
                      {new Date(s.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleAccept(s.id)} style={{
                      padding: '7px 16px',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', color: '#fff',
                      cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
                    }}>Accept</button>
                    <button onClick={() => handleReject(s.id)} style={{
                      padding: '7px 16px',
                      background: 'rgba(248,113,113,0.06)',
                      border: '1px solid rgba(248,113,113,0.15)',
                      borderRadius: '8px', color: '#f87171',
                      cursor: 'pointer', fontSize: '0.78rem'
                    }}>Decline</button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Students tab */}
          {tab === 'students' && (
            <motion.div key="students"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {accepted.length === 0 ? (
                <EmptyState text="No students yet" sub="Accept connection requests to add students" />
              ) : accepted.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px', padding: '1.1rem 1.2rem',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
                  }}
                >
                  <div>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{s.full_name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: '2px' }}>{s.email}</p>
                    {s.monthly_fee > 0 && (
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '3px' }}>
                        ₹{s.monthly_fee}/month · due day {s.fee_day || 1}
                      </p>
                    )}
                  </div>
                  <button onClick={() => handleRemoveStudent(s.id)} style={{
                    padding: '7px 14px',
                    background: 'rgba(248,113,113,0.06)',
                    border: '1px solid rgba(248,113,113,0.15)',
                    borderRadius: '8px', color: '#f87171',
                    cursor: 'pointer', fontSize: '0.78rem'
                  }}>Remove</button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function EmptyState({ text, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        textAlign: 'center', padding: '4rem 1rem',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px', background: '#0a0a0a'
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.2 }}>◎</div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '0.3rem' }}>{text}</p>
      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.82rem' }}>{sub}</p>
    </motion.div>
  )
}