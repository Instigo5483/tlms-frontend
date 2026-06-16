import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import ConfirmModal from '../components/ConfirmModal'
import InputModal from '../components/InputModal'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const ACCENT = '#334155'

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

function VisibilityToggle({ checked, onChange, disabled, color = ACCENT }) {
  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      style={{
        width: '44px', height: '24px', borderRadius: '999px', flexShrink: 0, padding: 0,
        background: checked ? color : '#e4e4e7',
        border: 'none',
        position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition: 'background 0.2s',
      }}
    >
      <motion.div
        animate={{ x: checked ? 21 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: 0, boxShadow: '0 1px 3px rgba(24,24,27,0.2)' }}
      />
    </motion.button>
  )
}

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
  const [modal, setModal] = useState(null)
  const [feeModal, setFeeModal] = useState(null)
  const [alertMsg, setAlertMsg] = useState(null)
  const [togglingVisibility, setTogglingVisibility] = useState(false)
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
        body: JSON.stringify({ ...profile, subjects: subjectsArr, grade_levels: gradesArr, is_visible: !!loaded?.is_visible })
      })
      const data = await res.json()
      if (!res.ok) { setAlertMsg(data.error || 'Failed to save'); return }
      setLoaded(prev => ({ ...prev, ...profile, subjects: subjectsArr, grade_levels: gradesArr }))
      setEditing(false)
    } catch { setAlertMsg('Failed to save. Try again.') }
    finally { setSaving(false) }
  }

  async function toggleVisibility(next) {
    setTogglingVisibility(true)
    try {
      const res = await fetch(`${BACKEND}/api/center/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          center_name: loaded?.center_name || '',
          phone: loaded?.phone || '',
          address: loaded?.address || '',
          country: loaded?.country || '',
          state: loaded?.state || '',
          district: loaded?.district || '',
          area: loaded?.area || '',
          subjects: loaded?.subjects || [],
          grade_levels: loaded?.grade_levels || [],
          bio: loaded?.bio || '',
          website: loaded?.website || '',
          monthly_rate: Number(loaded?.monthly_rate) || 0,
          lat: loaded?.lat, lng: loaded?.lng,
          is_visible: next,
        })
      })
      const data = await res.json()
      if (!res.ok) { setAlertMsg(data.error || 'Failed to update visibility'); return }
      setLoaded(prev => ({ ...prev, is_visible: next }))
    } catch { setAlertMsg('Failed to update visibility. Try again.') }
    finally { setTogglingVisibility(false) }
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
    { label: 'Center Name', name: 'center_name', placeholder: 'ABC Tuition Center' },
    { label: 'Monthly Rate (₹)', name: 'monthly_rate', placeholder: 'e.g. 2000', type: 'number' },
    { label: 'Phone', name: 'phone', placeholder: '+91 98765 43210' },
    { label: 'Address', name: 'address', placeholder: 'Full address', type: 'textarea' },
    { label: 'Country', name: 'country', type: 'select', options: ['India'] },
    { label: 'State', name: 'state', type: 'select', options: INDIA_STATES },
    { label: 'District', name: 'district', placeholder: 'Kamrup' },
    { label: 'Area', name: 'area', placeholder: 'Guwahati' },
    { label: 'Subjects', name: 'subjects', type: 'multiselect', options: INDIA_SUBJECTS, placeholder: 'Select subjects offered...' },
    { label: 'Class Levels', name: 'grade_levels', type: 'multiselect', options: GRADE_LEVELS, placeholder: 'Select class levels...' },
    { label: 'Bio', name: 'bio', placeholder: 'About your center...', type: 'textarea' },
    { label: 'Website (optional)', name: 'website', placeholder: 'https://yourcenter.com' },
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
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0, background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: ACCENT }}>{initials}</div>
          <div>
            <h1 className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', letterSpacing: '-0.02em', color: '#18181b' }}>{loaded?.center_name || user?.full_name || 'Center'}</h1>
            <p style={{ color: '#a1a1aa', fontSize: '0.82rem', marginTop: '2px' }}>{user?.email}</p>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px', borderRadius: '999px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: ACCENT, whiteSpace: 'nowrap' }}>Tuition Center</span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '2rem' }}
        >
          {[
            { label: 'Students', value: accepted.length, color: ACCENT },
            { label: 'Requests', value: pending.length, color: ACCENT },
            { label: 'Subjects', value: loaded?.subjects?.length || 0, color: ACCENT },
          ].map(s => (
            <div key={s.label} style={{ padding: '1.2rem', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px', textAlign: 'center', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}>
              <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: '#f4f4f5', padding: '4px', borderRadius: '12px', width: 'fit-content' }}
        >
          {[
            { key: 'profile', label: 'Profile' },
            { key: 'requests', label: `Requests (${pending.length})` },
            { key: 'students', label: `Students (${accepted.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '7px 16px', border: 'none', cursor: 'pointer',
              borderRadius: '9px', fontSize: '0.82rem', fontWeight: 600,
              background: tab === t.key ? '#fff' : 'transparent',
              color: tab === t.key ? '#18181b' : '#a1a1aa',
              boxShadow: tab === t.key ? '0 1px 3px rgba(24,24,27,0.1)' : 'none',
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
              <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px', padding: '1.8rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem', flexWrap: 'wrap', gap: '10px' }}>
                  <h2 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.95rem' }}>Center Profile</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: loaded?.is_visible ? ACCENT : '#a1a1aa', whiteSpace: 'nowrap' }}>
                        {loaded?.is_visible ? 'Visible on Discover' : 'Hidden from Discover'}
                      </span>
                      <VisibilityToggle checked={!!loaded?.is_visible} onChange={toggleVisibility} disabled={togglingVisibility} />
                    </div>
                    <button onClick={() => setEditing(!editing)} style={{
                      padding: '6px 16px', borderRadius: '999px',
                      border: '1px solid #e4e4e7',
                      background: '#fff', color: '#18181b',
                      cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                    }}>{editing ? 'Cancel' : 'Edit'}</button>
                  </div>
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
                            <input type={f.type === 'number' ? 'number' : 'text'} placeholder={f.placeholder}
                              value={profile[f.name] ?? ''}
                              onChange={e => setProfile(p => ({ ...p, [f.name]: e.target.value }))}
                              style={{ width: '100%', height: '42px', padding: '0 14px' }}
                            />
                          )}
                        </div>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={save} disabled={saving}
                        style={{
                          alignSelf: 'flex-start', padding: '10px 28px',
                          background: saving ? '#e4e4e7' : ACCENT,
                          color: saving ? '#a1a1aa' : '#fff',
                          border: 'none', borderRadius: '999px', fontWeight: 700,
                          cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.9rem'
                        }}
                      >{saving ? 'Saving...' : 'Save Changes'}</motion.button>
                    </motion.div>
                  ) : loaded?.bio ? (
                    <motion.div key="view"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                    >
                      <p style={{ color: '#52525b', fontSize: '0.9rem', lineHeight: 1.7 }}>{loaded.bio}</p>
                      {loaded.address && <p style={{ color: '#a1a1aa', fontSize: '0.82rem' }}>{loaded.address}</p>}
                      {loaded.phone && <p style={{ color: '#a1a1aa', fontSize: '0.82rem' }}>{loaded.phone}</p>}
                      {loaded.website && (
                        <a href={loaded.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', color: ACCENT }}>{loaded.website}</a>
                      )}
                      {loaded.subjects?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {loaded.subjects.map(s => (
                            <span key={s} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: ACCENT, fontSize: '0.78rem', padding: '3px 10px', borderRadius: '6px' }}>{s}</span>
                          ))}
                        </div>
                      )}
                      {loaded.grade_levels?.length > 0 && (
                        <p style={{ color: '#a1a1aa', fontSize: '0.82rem' }}>{loaded.grade_levels.join(', ')}</p>
                      )}
                      {(loaded.district || loaded.state) && (
                        <p style={{ color: '#a1a1aa', fontSize: '0.82rem' }}>
                          {[loaded.area, loaded.district, loaded.state, loaded.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.7 }}
                    >Complete your center profile so students can find you.</motion.div>
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
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                    style={{ height: '80px', background: '#fafafa', borderRadius: '16px', border: '1px solid #f0f0f1' }}
                  />
                ))
              ) : pending.length === 0 ? (
                <EmptyState text="No pending requests" sub="New connection requests will appear here" />
              ) : pending.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '1.1rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}
                >
                  <div>
                    <p style={{ color: '#18181b', fontWeight: 600, fontSize: '0.9rem' }}>{s.full_name}</p>
                    <p style={{ color: '#71717a', fontSize: '0.78rem', marginTop: '2px' }}>{s.email}</p>
                    <p style={{ color: '#a1a1aa', fontSize: '0.72rem', marginTop: '2px' }}>
                      {new Date(s.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleAccept(s.id)} style={{ padding: '7px 16px', background: ACCENT, border: 'none', borderRadius: '999px', color: '#fff', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Accept</motion.button>
                    <button onClick={() => handleReject(s.id)} style={{ padding: '7px 16px', background: '#f4f4f5', border: '1px solid #d4d4d8', borderRadius: '999px', color: '#18181b', cursor: 'pointer', fontSize: '0.78rem' }}>Decline</button>
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
                <EmptyState text="No students yet" sub="Accept connection requests to add students" />
              ) : accepted.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '1.1rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}
                >
                  <div>
                    <p style={{ color: '#18181b', fontWeight: 600, fontSize: '0.9rem' }}>{s.full_name}</p>
                    <p style={{ color: '#71717a', fontSize: '0.78rem', marginTop: '2px' }}>{s.email}</p>
                    {s.monthly_fee > 0 && (
                      <p style={{ fontSize: '0.75rem', marginTop: '3px', fontWeight: 600, color: ACCENT }}>₹{s.monthly_fee}/month · due day {s.fee_day || 1}</p>
                    )}
                  </div>
                  <button onClick={() => handleRemoveStudent(s.id)} style={{ padding: '7px 14px', background: '#f4f4f5', border: '1px solid #d4d4d8', borderRadius: '999px', color: '#18181b', cursor: 'pointer', fontSize: '0.78rem' }}>Remove</button>
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
        accentColor={ACCENT}
      />

      <ConfirmModal
        open={!!modal}
        title={modal?.title}
        message={modal?.message}
        confirmLabel={modal?.confirmLabel}
        onConfirm={modal?.onConfirm}
        onCancel={() => setModal(null)}
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

function EmptyState({ text, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ textAlign: 'center', padding: '4rem 1rem', border: '1px solid #e4e4e7', borderRadius: '24px', background: '#fafafa' }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.6 }}>◎</div>
      <p style={{ color: '#52525b', fontWeight: 600, marginBottom: '0.3rem' }}>{text}</p>
      <p style={{ color: '#a1a1aa', fontSize: '0.82rem' }}>{sub}</p>
    </motion.div>
  )
}
