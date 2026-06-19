import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import ConfirmModal from '../components/ConfirmModal'
import AvatarUpload from '../components/AvatarUpload'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const ACCENT = '#4f46e5'

const INDIA_SUBJECTS = [
  'Accountancy','Arts / Drawing','Bengali','Biology','Business Studies','Chemistry',
  'Computer Science','Economics','English','Geography','Gujarati','Hindi','History',
  'Kannada','Malayalam','Marathi','Mathematics','Music','Physical Education',
  'Physics','Political Science','Punjabi','Sanskrit','Social Science',
  'Tamil','Telugu','Urdu',
]

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu',
  'Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
]

const GRADE_LEVELS = [
  'Nursery','LKG','UKG',
  'Class 1','Class 2','Class 3','Class 4','Class 5',
  'Class 6','Class 7','Class 8','Class 9','Class 10',
  'Class 11','Class 12',
  'JEE','NEET','UPSC','APSC','WBJEE','CEE',
]

function DropdownSingle({ value, onChange, options, placeholder, accentColor = ACCENT }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onOut(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    if (open) document.addEventListener('mousedown', onOut)
    return () => document.removeEventListener('mousedown', onOut)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        type="button"
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.99 }}
        style={{
          width: '100%', height: '42px', padding: '0 14px',
          background: '#fff',
          border: `1px solid ${open ? accentColor : '#e4e4e7'}`,
          borderRadius: '10px',
          display: 'flex', alignItems: 'center',
          cursor: 'pointer', fontSize: '0.9rem',
          transition: 'border-color 0.2s',
        }}
      >
        <span style={{ flex: 1, color: value ? '#18181b' : '#a1a1aa', textAlign: 'left' }}>
          {value || placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ opacity: 0.4, fontSize: '0.7rem', flexShrink: 0 }}
        >▾</motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.94 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 300,
              background: '#fff',
              border: '1px solid #e4e4e7',
              borderRadius: '12px',
              boxShadow: '0 16px 40px rgba(24,24,27,0.14)',
              transformOrigin: 'top',
            }}
          >
            <div className="no-scrollbar" style={{ maxHeight: '260px', overflowY: 'auto', borderRadius: '12px' }}>
              {options.map((o, i) => (
                <motion.button
                  key={o} type="button"
                  whileHover={{ x: 4, background: `${accentColor}12` }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => { onChange(o); setOpen(false) }}
                  style={{
                    width: '100%', padding: '10px 16px',
                    background: value === o ? `${accentColor}15` : 'transparent',
                    border: 'none',
                    borderBottom: i < options.length - 1 ? '1px solid #f4f4f5' : 'none',
                    cursor: 'pointer', textAlign: 'left',
                    color: value === o ? accentColor : '#52525b',
                    fontSize: '0.88rem', fontWeight: value === o ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  <span style={{ width: '14px', flexShrink: 0, color: accentColor, fontSize: '0.72rem', fontWeight: 800, opacity: value === o ? 1 : 0 }}>✓</span>
                  {o}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DropdownMulti({ value, onChange, options, placeholder, accentColor = ACCENT }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = value ? value.split(',').map(s => s.trim()).filter(Boolean) : []

  useEffect(() => {
    function onOut(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    if (open) document.addEventListener('mousedown', onOut)
    return () => document.removeEventListener('mousedown', onOut)
  }, [open])

  function toggle(o) {
    const next = selected.includes(o) ? selected.filter(x => x !== o) : [...selected, o]
    onChange(next.join(', '))
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        type="button"
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.99 }}
        style={{
          width: '100%', minHeight: '42px', padding: '6px 14px',
          background: '#fff',
          border: `1px solid ${open ? accentColor : '#e4e4e7'}`,
          borderRadius: '10px', color: '#18181b',
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px',
          cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s',
        }}
      >
        {selected.length === 0 ? (
          <span style={{ color: '#a1a1aa', fontSize: '0.9rem', flex: 1 }}>{placeholder}</span>
        ) : selected.map(s => (
          <span key={s} style={{
            background: `${accentColor}12`, border: `1px solid ${accentColor}35`,
            color: accentColor, borderRadius: '6px', padding: '1px 8px',
            fontSize: '0.75rem', fontWeight: 600,
          }}>{s}</span>
        ))}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ marginLeft: 'auto', opacity: 0.4, fontSize: '0.7rem', flexShrink: 0, paddingLeft: '4px' }}
        >▾</motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.94 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 300,
              background: '#fff',
              border: '1px solid #e4e4e7',
              borderRadius: '12px',
              boxShadow: '0 16px 40px rgba(24,24,27,0.14)',
              transformOrigin: 'top',
            }}
          >
            <div className="no-scrollbar" style={{ maxHeight: '260px', overflowY: 'auto', borderRadius: '12px' }}>
              {options.map((o, i) => {
                const active = selected.includes(o)
                return (
                  <motion.button
                    key={o} type="button"
                    whileHover={{ x: 4, background: active ? `${accentColor}22` : '#fafafa' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggle(o)}
                    style={{
                      width: '100%', padding: '10px 16px',
                      background: active ? `${accentColor}15` : 'transparent',
                      border: 'none',
                      borderBottom: i < options.length - 1 ? '1px solid #f4f4f5' : 'none',
                      cursor: 'pointer', textAlign: 'left',
                      color: active ? accentColor : '#52525b',
                      fontSize: '0.88rem', fontWeight: active ? 600 : 400,
                      display: 'flex', alignItems: 'center', gap: '10px',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    <span style={{
                      width: '15px', height: '15px', borderRadius: '4px', flexShrink: 0,
                      border: `1.5px solid ${active ? accentColor : '#d4d4d8'}`,
                      background: active ? accentColor : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', color: '#fff', fontWeight: 900,
                      transition: 'all 0.15s',
                    }}>{active ? '✓' : ''}</span>
                    {o}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function isProfileComplete(p) {
  return !!(
    p.bio?.trim() &&
    p.phone?.trim() && p.country?.trim() && p.state?.trim() && p.district?.trim() && p.area?.trim()
  )
}

export default function StudentDashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [removeModal, setRemoveModal] = useState(null)
  const [alertMsg, setAlertMsg] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadedProfile, setLoadedProfile] = useState(null)
  const [profile, setProfile] = useState({
    bio: '', phone: '', country: '', state: '', district: '', area: ''
  })

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  useEffect(() => { loadEnrollments(); loadProfile() }, [])

  async function loadProfile() {
    try {
      const res = await fetch(`${BACKEND}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setLoadedProfile(data)
      setProfile({
        bio: data.bio || '',
        phone: data.phone || '',
        country: data.country || '',
        state: data.state || '',
        district: data.district || '',
        area: data.area || '',
      })
    } catch (err) { console.error(err) }
  }

  async function saveProfile() {
    setSaving(true)
    try {
      const res = await fetch(`${BACKEND}/api/student/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          bio: profile.bio,
          phone: profile.phone, country: profile.country,
          state: profile.state, district: profile.district, area: profile.area,
        })
      })
      const data = await res.json()
      if (!res.ok) { setAlertMsg(data.error || 'Failed to save'); return }
      setLoadedProfile(prev => ({
        ...prev, bio: profile.bio,
        phone: profile.phone, country: profile.country,
        state: profile.state, district: profile.district, area: profile.area,
      }))
      setEditing(false)
    } catch { setAlertMsg('Failed to save. Try again.') }
    finally { setSaving(false) }
  }

  async function loadEnrollments() {
    try {
      const res = await fetch(`${BACKEND}/api/enrollments/mine`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setEnrollments(Array.isArray(data) ? data : [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  function handleRemove(enrollmentId) {
    setRemoveModal(enrollmentId)
  }

  async function confirmRemove() {
    const enrollmentId = removeModal
    setRemoveModal(null)
    try {
      const res = await fetch(`${BACKEND}/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) { setAlertMsg('Failed to remove. Try again.'); return }
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId))
    } catch { setAlertMsg('Failed to remove. Try again.') }
  }

  const connected = enrollments.filter(e => e.status === 'accepted')
  const pending = enrollments.filter(e => e.status === 'pending')
  const profileComplete = isProfileComplete(profile)

  const fields = [
    { label: 'Bio', name: 'bio', placeholder: 'Tell tutors and centers about yourself...', type: 'textarea' },
    { label: 'Phone', name: 'phone', placeholder: '+91 98765 43210' },
    { label: 'Country', name: 'country', type: 'select', options: ['India'] },
    { label: 'State', name: 'state', type: 'select', options: INDIA_STATES },
    { label: 'District', name: 'district', placeholder: 'Kamrup' },
    { label: 'Area', name: 'area', placeholder: 'Guwahati' },
  ]

  const tabs = [
    { key: 'profile', label: 'Profile', count: null },
    { key: 'connected', label: 'Connected', count: connected.length },
    { key: 'pending', label: 'Pending', count: pending.length },
    { key: 'explore', label: 'Find Tutors', count: null },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <main style={{ padding: '96px 2.5rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', paddingTop: '1rem', flexWrap: 'wrap' }}
        >
          <AvatarUpload avatarUrl={user?.avatar_url} initials={initials} accentColor={ACCENT} size={48} />
          <div>
            <h1 className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', letterSpacing: '-0.02em', color: '#18181b' }}>
              {user?.full_name?.split(' ')[0] || 'Student'}
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '0.82rem', marginTop: '2px' }}>{user?.email}</p>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px', borderRadius: '999px', background: '#eef2ff', border: '1px solid #e0e7ff', color: ACCENT, whiteSpace: 'nowrap' }}>Student</span>
        </motion.div>

        {/* Profile completeness banner */}
        {!profileComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#f4f4f5', border: '1px solid #d4d4d8', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#18181b' }}
          >
            <span>⚠</span>
            <span>Complete your profile before you can send a connection request to a tutor or center.</span>
            <button onClick={() => { setTab('profile'); setEditing(true) }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: ACCENT, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Complete now →</button>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px', marginBottom: '2rem',
          }}
        >
          {[
            { label: 'Connected', value: connected.length, color: ACCENT },
            { label: 'Pending', value: pending.length, color: ACCENT },
            { label: 'Total', value: enrollments.length, color: ACCENT },
          ].map(s => (
            <div key={s.label} style={{ padding: '1.4rem', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px', textAlign: 'center', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}>
              <div className="font-display" style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: '#f4f4f5', padding: '4px', borderRadius: '12px', width: 'fit-content', flexWrap: 'wrap' }}
        >
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '7px 16px', border: 'none', cursor: 'pointer',
              borderRadius: '9px', fontSize: '0.82rem', fontWeight: 600,
              background: tab === t.key ? '#fff' : 'transparent',
              color: tab === t.key ? '#18181b' : '#a1a1aa',
              boxShadow: tab === t.key ? '0 1px 3px rgba(24,24,27,0.1)' : 'none',
              transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}>
              {t.label}{t.count !== null ? ` (${t.count})` : ''}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {tab === 'profile' ? (
            <motion.div key="profile"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            >
              <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px', padding: '1.8rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem', flexWrap: 'wrap', gap: '10px' }}>
                  <h2 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.95rem' }}>Your Profile</h2>
                  <button onClick={() => setEditing(!editing)} style={{
                    padding: '6px 16px', borderRadius: '999px',
                    border: '1px solid #e4e4e7',
                    background: '#fff', color: '#18181b',
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
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#71717a', marginBottom: '6px', fontWeight: 500 }}>
                            {f.label}
                          </label>
                          {f.type === 'textarea' ? (
                            <textarea rows={3} placeholder={f.placeholder}
                              value={profile[f.name]}
                              onChange={e => setProfile(p => ({ ...p, [f.name]: e.target.value }))}
                              style={{ width: '100%', padding: '10px 14px', resize: 'vertical' }}
                            />
                          ) : f.type === 'select' ? (
                            <DropdownSingle
                              value={profile[f.name] || ''}
                              onChange={val => setProfile(p => ({ ...p, [f.name]: val }))}
                              options={f.options}
                              placeholder={`Select ${f.label.toLowerCase()}...`}
                            />
                          ) : f.type === 'multiselect' ? (
                            <DropdownMulti
                              value={profile[f.name]}
                              onChange={val => setProfile(p => ({ ...p, [f.name]: val }))}
                              options={f.options}
                              placeholder={f.placeholder}
                            />
                          ) : (
                            <input type="text" placeholder={f.placeholder}
                              value={profile[f.name]}
                              onChange={e => setProfile(p => ({ ...p, [f.name]: e.target.value }))}
                              style={{ width: '100%', height: '42px', padding: '0 14px' }}
                            />
                          )}
                        </div>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={saveProfile} disabled={saving}
                        style={{
                          alignSelf: 'flex-start', padding: '10px 28px',
                          background: saving ? '#e4e4e7' : ACCENT,
                          color: saving ? '#a1a1aa' : '#fff',
                          border: 'none', borderRadius: '999px', fontWeight: 700,
                          cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.9rem'
                        }}
                      >{saving ? 'Saving...' : 'Save Changes'}</motion.button>
                    </motion.div>
                  ) : loadedProfile?.bio ? (
                    <motion.div key="view"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                      <p style={{ color: '#52525b', fontSize: '0.9rem', lineHeight: 1.7 }}>{loadedProfile.bio}</p>
                      {loadedProfile.phone && (
                        <p style={{ color: '#a1a1aa', fontSize: '0.82rem' }}>{loadedProfile.phone}</p>
                      )}
                      {(loadedProfile.district || loadedProfile.state) && (
                        <p style={{ color: '#a1a1aa', fontSize: '0.82rem' }}>
                          {[loadedProfile.area, loadedProfile.district, loadedProfile.state, loadedProfile.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.7 }}
                    >Complete your profile so you can send connection requests to tutors and centers.</motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : loading ? (
            <motion.div key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {[1,2,3].map(i => (
                <motion.div key={i}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                  style={{ height: '80px', background: '#fafafa', borderRadius: '16px', border: '1px solid #f0f0f1' }}
                />
              ))}
            </motion.div>
          ) : tab === 'connected' ? (
            <motion.div key="connected"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            >
              {connected.length === 0 ? (
                <EmptyState text="No connections yet" sub="Find a tutor or center to get started" action={() => navigate('/discover')} actionLabel="Browse Tutors" />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '10px' }}>
                  {connected.map((e, i) => (
                    <EnrollmentCard key={e.id} enrollment={e} index={i}
                      onRemove={() => handleRemove(e.id)}
                      onView={() => navigate(`/profile/${e.role}/${e.tutor_id}`)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : tab === 'pending' ? (
            <motion.div key="pending"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            >
              {pending.length === 0 ? (
                <EmptyState text="No pending requests" sub="Your connection requests will appear here" />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '10px' }}>
                  {pending.map((e, i) => (
                    <EnrollmentCard key={e.id} enrollment={e} index={i}
                      onRemove={() => handleRemove(e.id)}
                      onView={() => navigate(`/profile/${e.role}/${e.tutor_id}`)}
                      label="Cancel"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="explore"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '4rem 1rem', border: '1px solid #e4e4e7', borderRadius: '24px', background: '#fafafa' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.6 }}>◎</div>
              <p style={{ color: '#52525b', marginBottom: '0.5rem', fontWeight: 600 }}>Find tutors and centers</p>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Discover verified tutors near you</p>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/discover')}
                style={{ padding: '12px 28px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '999px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
              >Browse Tutors</motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ConfirmModal
        open={!!removeModal}
        title="Remove Connection"
        message="This will end the enrollment. You can re-apply in the future."
        confirmLabel="Remove"
        onConfirm={confirmRemove}
        onCancel={() => setRemoveModal(null)}
        accentColor="#3f3f46"
      />

      <ConfirmModal
        open={!!alertMsg}
        title="Something went wrong"
        message={alertMsg}
        confirmLabel="OK"
        onConfirm={() => setAlertMsg(null)}
        onCancel={() => setAlertMsg(null)}
        hideCancel
        accentColor="#3f3f46"
      />
    </div>
  )
}

function EnrollmentCard({ enrollment, onRemove, onView, label, index }) {
  const isCenter = enrollment.role === 'center'
  const initials = enrollment.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'
  const color = isCenter ? '#334155' : ACCENT
  const bg = isCenter ? '#f1f5f9' : '#eef2ff'
  const border = isCenter ? '#e2e8f0' : '#e0e7ff'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(24,24,27,0.08)' }}
      style={{
        background: '#fff',
        border: '1px solid #e4e4e7',
        borderRadius: '16px', padding: '1.1rem 1.2rem',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        boxShadow: '0 1px 2px rgba(24,24,27,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem', color, overflow: 'hidden' }}>
          {enrollment.avatar_url
            ? <img src={enrollment.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initials}
        </div>
        <div>
          <p style={{ color: '#18181b', fontWeight: 600, fontSize: '0.9rem' }}>{enrollment.name}</p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '3px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '6px', background: bg, color, border: `1px solid ${border}` }}>{isCenter ? 'Center' : 'Tutor'}</span>
            {enrollment.status === 'pending' && (
              <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Awaiting approval</span>
            )}
            {enrollment.status === 'accepted' && enrollment.monthly_fee > 0 && (
              <span style={{ fontSize: '0.72rem', color: ACCENT, fontWeight: 600 }}>₹{enrollment.monthly_fee}/month</span>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onView} style={{ padding: '6px 14px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', color: '#52525b', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500 }}>View</button>
        <button onClick={onRemove} style={{ padding: '6px 14px', background: '#f4f4f5', border: '1px solid #d4d4d8', borderRadius: '8px', color: '#18181b', cursor: 'pointer', fontSize: '0.78rem' }}>{label || 'Remove'}</button>
      </div>
    </motion.div>
  )
}

function EmptyState({ text, sub, action, actionLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ textAlign: 'center', padding: '4rem 1rem', border: '1px solid #e4e4e7', borderRadius: '24px', background: '#fafafa' }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.6 }}>◎</div>
      <p style={{ color: '#52525b', marginBottom: '0.3rem', fontWeight: 600 }}>{text}</p>
      <p style={{ color: '#a1a1aa', fontSize: '0.82rem', marginBottom: action ? '1.5rem' : 0 }}>{sub}</p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={action} style={{ padding: '10px 24px', background: ACCENT, color: '#fff', border: 'none', borderRadius: '999px', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}
        >{actionLabel}</motion.button>
      )}
    </motion.div>
  )
}
