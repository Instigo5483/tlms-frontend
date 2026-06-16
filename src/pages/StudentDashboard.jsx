import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const ACCENT = '#4f46e5'

export default function StudentDashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('connected')
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [removeModal, setRemoveModal] = useState(null)
  const [alertMsg, setAlertMsg] = useState(null)

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  useEffect(() => { loadEnrollments() }, [])

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

  const tabs = [
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
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
            background: '#eef2ff', border: '1px solid #e0e7ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1rem', color: ACCENT
          }}>{initials}</div>
          <div>
            <h1 className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', letterSpacing: '-0.02em', color: '#18181b' }}>
              {user?.full_name?.split(' ')[0] || 'Student'}
            </h1>
            <p style={{ color: '#a1a1aa', fontSize: '0.82rem', marginTop: '2px' }}>{user?.email}</p>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px', borderRadius: '999px', background: '#eef2ff', border: '1px solid #e0e7ff', color: ACCENT, whiteSpace: 'nowrap' }}>Student</span>
        </motion.div>

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
            { label: 'Pending', value: pending.length, color: '#db2777' },
            { label: 'Total', value: enrollments.length, color: '#059669' },
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
          style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: '#f4f4f5', padding: '4px', borderRadius: '12px', width: 'fit-content' }}
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
          {loading ? (
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

function EnrollmentCard({ enrollment, onRemove, onView, label, index }) {
  const isCenter = enrollment.role === 'center'
  const initials = enrollment.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'
  const color = isCenter ? '#db2777' : ACCENT
  const bg = isCenter ? '#fdf2f8' : '#eef2ff'
  const border = isCenter ? '#fbcfe8' : '#e0e7ff'

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
        <div style={{ width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem', color }}>{initials}</div>
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
        <button onClick={onRemove} style={{ padding: '6px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem' }}>{label || 'Remove'}</button>
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
