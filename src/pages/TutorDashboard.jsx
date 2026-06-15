import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import ConfirmModal from '../components/ConfirmModal'
import InputModal from '../components/InputModal'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

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

function DropdownSingle({ value, onChange, options, placeholder, accentColor = '#06b6d4' }) {
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
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${open ? accentColor + '55' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '10px',
          display: 'flex', alignItems: 'center',
          cursor: 'pointer', fontSize: '0.9rem',
          transition: 'border-color 0.2s',
        }}
      >
        <span style={{ flex: 1, color: value ? '#fff' : 'rgba(255,255,255,0.2)', textAlign: 'left' }}>
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
              background: '#0d0d16',
              border: `1px solid ${accentColor}28`,
              borderRadius: '12px',
              boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px ${accentColor}10`,
              transformOrigin: 'top',
            }}
          >
            <div className="no-scrollbar" style={{ maxHeight: '260px', overflowY: 'auto', borderRadius: '12px' }}>
              {options.map((o, i) => (
                <motion.button
                  key={o} type="button"
                  whileHover={{ x: 4, background: accentColor + '12' }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => { onChange(o); setOpen(false) }}
                  style={{
                    width: '100%', padding: '10px 16px',
                    background: value === o ? accentColor + '18' : 'transparent',
                    border: 'none',
                    borderBottom: i < options.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    cursor: 'pointer', textAlign: 'left',
                    color: value === o ? accentColor : 'rgba(255,255,255,0.6)',
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

function DropdownMulti({ value, onChange, options, placeholder, accentColor = '#06b6d4' }) {
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
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${open ? accentColor + '55' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '10px', color: '#fff',
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px',
          cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s',
        }}
      >
        {selected.length === 0 ? (
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', flex: 1 }}>{placeholder}</span>
        ) : selected.map(s => (
          <span key={s} style={{
            background: accentColor + '1a', border: `1px solid ${accentColor}40`,
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
              background: '#0d0d16',
              border: `1px solid ${accentColor}28`,
              borderRadius: '12px',
              boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px ${accentColor}10`,
              transformOrigin: 'top',
            }}
          >
            <div className="no-scrollbar" style={{ maxHeight: '260px', overflowY: 'auto', borderRadius: '12px' }}>
              {options.map((o, i) => {
                const active = selected.includes(o)
                return (
                  <motion.button
                    key={o} type="button"
                    whileHover={{ x: 4, background: active ? accentColor + '22' : 'rgba(255,255,255,0.06)' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggle(o)}
                    style={{
                      width: '100%', padding: '10px 16px',
                      background: active ? accentColor + '15' : 'transparent',
                      border: 'none',
                      borderBottom: i < options.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      cursor: 'pointer', textAlign: 'left',
                      color: active ? accentColor : 'rgba(255,255,255,0.6)',
                      fontSize: '0.88rem', fontWeight: active ? 600 : 400,
                      display: 'flex', alignItems: 'center', gap: '10px',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    <span style={{
                      width: '15px', height: '15px', borderRadius: '4px', flexShrink: 0,
                      border: `1.5px solid ${active ? accentColor : 'rgba(255,255,255,0.2)'}`,
                      background: active ? accentColor : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', color: '#050508', fontWeight: 900,
                      transition: 'all 0.15s', flexShrink: 0,
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

export default function TutorDashboard() {
  const { user, token } = useAuth()

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  const [tab, setTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadedProfile, setLoadedProfile] = useState(null)
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [feeModal, setFeeModal] = useState(null)
  const [alertMsg, setAlertMsg] = useState(null)
  const [profile, setProfile] = useState({
    bio: '', monthly_rate: '', subjects: '', grade_levels: '',
    phone: '', country: '', state: '', district: '', area: ''
  })

  useEffect(() => { loadProfile(); loadStudents() }, [])

  async function loadProfile() {
    try {
      const res = await fetch(`${BACKEND}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setLoadedProfile(data)
      setProfile({
        bio: data.bio || '',
        monthly_rate: data.monthly_rate || '',
        subjects: data.subjects?.join(', ') || '',
        grade_levels: data.grade_levels?.join(', ') || '',
        phone: data.phone || '',
        country: data.country || '',
        state: data.state || '',
        district: data.district || '',
        area: data.area || '',
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

  async function saveProfile() {
    setSaving(true)
    try {
      const res = await fetch(`${BACKEND}/api/tutor/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          bio: profile.bio,
          monthly_rate: Number(profile.monthly_rate),
          subjects: profile.subjects.split(',').map(s => s.trim()).filter(Boolean),
          grade_levels: profile.grade_levels.split(',').map(s => s.trim()).filter(Boolean),
          phone: profile.phone, country: profile.country,
          state: profile.state, district: profile.district, area: profile.area,
        })
      })
      const data = await res.json()
      if (!res.ok) { setAlertMsg(data.error || 'Failed to save'); return }
      setLoadedProfile(prev => ({
        ...prev, bio: profile.bio,
        monthly_rate: Number(profile.monthly_rate),
        subjects: profile.subjects.split(',').map(s => s.trim()).filter(Boolean),
        grade_levels: profile.grade_levels.split(',').map(s => s.trim()).filter(Boolean),
        phone: profile.phone, country: profile.country,
        state: profile.state, district: profile.district, area: profile.area,
      }))
      setEditing(false)
    } catch { setAlertMsg('Failed to save. Try again.') }
    finally { setSaving(false) }
  }

  function handleAccept(enrollmentId) {
    setFeeModal(enrollmentId)
  }

  async function submitAccept(fee) {
    const enrollmentId = feeModal
    setFeeModal(null)
    try {
      const res = await fetch(`${BACKEND}/api/enrollments/${enrollmentId}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ monthly_fee: Number(fee), fee_day: 1 })
      })
      if (!res.ok) { setAlertMsg('Failed to accept the request. Please try again.'); return }
      setStudents(prev => prev.map(s =>
        s.id === enrollmentId ? { ...s, status: 'accepted', monthly_fee: Number(fee) } : s
      ))
    } catch { setAlertMsg('Failed to accept the request. Please try again.') }
  }

  function handleReject(enrollmentId) {
    setModal({
      title: 'Decline Request',
      message: 'This enrollment request will be declined. The student can send a new request later.',
      confirmLabel: 'Decline',
      onConfirm: async () => {
        setModal(null)
        try {
          const res = await fetch(`${BACKEND}/api/enrollments/${enrollmentId}/reject`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (!res.ok) { setAlertMsg('Failed to decline. Try again.'); return }
          setStudents(prev => prev.map(s =>
            s.id === enrollmentId ? { ...s, status: 'rejected' } : s
          ))
        } catch { setAlertMsg('Failed. Try again.') }
      }
    })
  }

  function handleRemoveStudent(enrollmentId) {
    setModal({
      title: 'Remove Student',
      message: 'This will end the enrollment. The student can re-apply in the future.',
      confirmLabel: 'Remove',
      onConfirm: async () => {
        setModal(null)
        try {
          const res = await fetch(`${BACKEND}/api/enrollments/${enrollmentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (!res.ok) { setAlertMsg('Failed to remove student. Try again.'); return }
          setStudents(prev => prev.filter(s => s.id !== enrollmentId))
        } catch { setAlertMsg('Failed. Try again.') }
      }
    })
  }

  const pending = students.filter(s => s.status === 'pending')
  const accepted = students.filter(s => s.status === 'accepted')

  const fields = [
    { label: 'Bio', name: 'bio', placeholder: 'Tell students about yourself...', type: 'textarea' },
    { label: 'Subjects', name: 'subjects', type: 'multiselect', options: INDIA_SUBJECTS, placeholder: 'Select subjects you teach...' },
    { label: 'Class Levels', name: 'grade_levels', type: 'multiselect', options: GRADE_LEVELS, placeholder: 'Select class levels...' },
    { label: 'Monthly Rate (₹)', name: 'monthly_rate', placeholder: '2000', type: 'number' },
    { label: 'Phone', name: 'phone', placeholder: '+91 98765 43210' },
    { label: 'Country', name: 'country', type: 'select', options: ['India'] },
    { label: 'State', name: 'state', type: 'select', options: INDIA_STATES },
    { label: 'District', name: 'district', placeholder: 'Kamrup' },
    { label: 'Area (optional)', name: 'area', placeholder: 'Guwahati' },
  ]

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Navbar />
      <main style={{ padding: '88px 2.5rem 3rem', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', paddingTop: '1rem', flexWrap: 'wrap' }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
            background: 'rgba(6,182,212,0.15)',
            border: '1px solid rgba(6,182,212,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1rem', color: '#06b6d4'
          }}>{initials}</div>
          <div>
            <h1 style={{
              fontWeight: 800, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>{user?.full_name || 'Tutor'}</h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', marginTop: '2px' }}>{user?.email}</p>
          </div>
          <span style={{
            marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 600,
            padding: '4px 12px', borderRadius: '999px',
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.2)',
            color: 'rgba(6,182,212,0.8)', whiteSpace: 'nowrap'
          }}>Tutor</span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1px', marginBottom: '2rem',
            background: 'rgba(6,182,212,0.15)',
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(6,182,212,0.2)'
          }}
        >
          {[
            { label: 'Students', value: accepted.length, gradient: 'linear-gradient(135deg, #a855f7, #06b6d4)' },
            { label: 'Requests', value: pending.length, gradient: 'linear-gradient(135deg, #ec4899, #f97316)' },
            { label: 'Subjects', value: loadedProfile?.subjects?.length || 0, gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
            { label: 'Rate', value: loadedProfile?.monthly_rate ? `₹${loadedProfile.monthly_rate}` : '—', gradient: 'linear-gradient(135deg, #a855f7, #06b6d4)' },
          ].map(s => (
            <div key={s.label} style={{ padding: '1.2rem', background: '#050508', textAlign: 'center' }}>
              <div style={{
                fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em',
                background: s.gradient,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{s.label}</div>
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
            background: 'rgba(255,255,255,0.03)', padding: '4px',
            borderRadius: '12px', width: 'fit-content',
            border: '1px solid rgba(255,255,255,0.06)'
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
              background: tab === t.key
                ? 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))'
                : 'transparent',
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
                background: 'rgba(6,182,212,0.04)',
                border: '1px solid rgba(6,182,212,0.15)',
                borderRadius: '16px', padding: '1.8rem',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '40%', height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)'
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
                  <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Your Profile</h2>
                  <button onClick={() => setEditing(!editing)} style={{
                    padding: '6px 16px', borderRadius: '8px',
                    border: '1px solid rgba(6,182,212,0.2)',
                    background: 'rgba(6,182,212,0.08)', color: 'rgba(6,182,212,0.8)',
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
                              style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04) !important', border: '1px solid rgba(6,182,212,0.15) !important', borderRadius: '10px !important', color: '#fff !important', fontSize: '0.9rem', resize: 'vertical' }}
                            />
                          ) : f.type === 'select' ? (
                            <DropdownSingle
                              value={profile[f.name] || ''}
                              onChange={val => setProfile(p => ({ ...p, [f.name]: val }))}
                              options={f.options}
                              placeholder={`Select ${f.label.toLowerCase()}...`}
                              accentColor="#06b6d4"
                            />
                          ) : f.type === 'multiselect' ? (
                            <DropdownMulti
                              value={profile[f.name]}
                              onChange={val => setProfile(p => ({ ...p, [f.name]: val }))}
                              options={f.options}
                              placeholder={f.placeholder}
                              accentColor="#06b6d4"
                            />
                          ) : (
                            <input type={f.type || 'text'} placeholder={f.placeholder}
                              value={profile[f.name]}
                              onChange={e => setProfile(p => ({ ...p, [f.name]: e.target.value }))}
                              style={{ width: '100%', height: '42px', padding: '0 14px', background: 'rgba(255,255,255,0.04) !important', border: '1px solid rgba(6,182,212,0.15) !important', borderRadius: '10px !important', color: '#fff !important', fontSize: '0.9rem' }}
                            />
                          )}
                        </div>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={saveProfile} disabled={saving}
                        style={{
                          alignSelf: 'flex-start', padding: '10px 28px',
                          background: saving ? 'rgba(6,182,212,0.1)' : 'linear-gradient(135deg, #06b6d4, #a855f7)',
                          color: saving ? 'rgba(255,255,255,0.3)' : '#fff',
                          border: 'none', borderRadius: '10px', fontWeight: 700,
                          cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.9rem'
                        }}
                      >{saving ? 'Saving...' : 'Save Changes'}</motion.button>
                    </motion.div>
                  ) : loadedProfile?.bio ? (
                    <motion.div key="view"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7 }}>{loadedProfile.bio}</p>
                      {loadedProfile.subjects?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {loadedProfile.subjects.map(s => (
                            <span key={s} style={{
                              background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)',
                              color: 'rgba(6,182,212,0.8)', fontSize: '0.78rem', padding: '3px 10px', borderRadius: '6px'
                            }}>{s}</span>
                          ))}
                        </div>
                      )}
                      {loadedProfile.grade_levels?.length > 0 && (
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>{loadedProfile.grade_levels.join(', ')}</p>
                      )}
                      {loadedProfile.monthly_rate > 0 && (
                        <p style={{
                          fontWeight: 800, fontSize: '1rem',
                          background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
                          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>₹{loadedProfile.monthly_rate}/month</p>
                      )}
                      {loadedProfile.phone && (
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>{loadedProfile.phone}</p>
                      )}
                      {(loadedProfile.district || loadedProfile.state) && (
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                          {[loadedProfile.area, loadedProfile.district, loadedProfile.state, loadedProfile.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem', lineHeight: 1.7 }}
                    >Complete your profile so students can find you on the Discover page.</motion.div>
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
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '10px' }}
            >
              {studentsLoading ? (
                [1,2,3].map(i => (
                  <motion.div key={i}
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                    style={{ height: '80px', background: 'rgba(6,182,212,0.04)', borderRadius: '14px', border: '1px solid rgba(6,182,212,0.1)' }}
                  />
                ))
              ) : pending.length === 0 ? (
                <EmptyState text="No pending requests" sub="New connection requests will appear here" color="#06b6d4" />
              ) : pending.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: 'rgba(6,182,212,0.03)',
                    border: '1px solid rgba(6,182,212,0.12)',
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
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleAccept(s.id)} style={{
                        padding: '7px 16px',
                        background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))',
                        border: '1px solid rgba(6,182,212,0.2)',
                        borderRadius: '8px', color: '#fff',
                        cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
                      }}>Accept</motion.button>
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
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '10px' }}
            >
              {accepted.length === 0 ? (
                <EmptyState text="No students yet" sub="Accept connection requests to add students" color="#06b6d4" />
              ) : accepted.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: 'rgba(6,182,212,0.03)',
                    border: '1px solid rgba(6,182,212,0.12)',
                    borderRadius: '14px', padding: '1.1rem 1.2rem',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
                  }}
                >
                  <div>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{s.full_name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: '2px' }}>{s.email}</p>
                    {s.monthly_fee > 0 && (
                      <p style={{
                        fontSize: '0.75rem', marginTop: '3px', fontWeight: 600,
                        background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                      }}>₹{s.monthly_fee}/month · due day {s.fee_day || 1}</p>
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

      <InputModal
        open={feeModal !== null}
        title="Set Monthly Fee"
        message="Enter the monthly fee for this student. Set to 0 for a free enrollment."
        label="Monthly Fee"
        placeholder="e.g. 2000"
        type="number"
        prefix="₹"
        confirmLabel="Accept Student"
        onConfirm={submitAccept}
        onCancel={() => setFeeModal(null)}
        accentColor="#06b6d4"
      />

      <ConfirmModal
        open={!!modal}
        title={modal?.title}
        message={modal?.message}
        confirmLabel={modal?.confirmLabel}
        onConfirm={modal?.onConfirm}
        onCancel={() => setModal(null)}
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

function EmptyState({ text, sub, color = '#a855f7' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        textAlign: 'center', padding: '4rem 1rem',
        border: `1px solid ${color}25`,
        borderRadius: '20px',
        background: `${color}08`
      }}
    >
      <div style={{
        fontSize: '2rem', marginBottom: '1rem',
        background: `linear-gradient(135deg, ${color}, #a855f7)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
      }}>◎</div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '0.3rem' }}>{text}</p>
      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.82rem' }}>{sub}</p>
    </motion.div>
  )
}