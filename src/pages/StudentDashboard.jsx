import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function StudentDashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('connected')
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

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

  async function handleRemove(enrollmentId) {
    if (!confirm('Remove this connection?')) return
    try {
      await fetch(`${BACKEND}/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId))
    } catch { alert('Failed to remove. Try again.') }
  }

  const connected = enrollments.filter(e => e.status === 'accepted')
  const pending = enrollments.filter(e => e.status === 'pending')

  const tabs = [
    { key: 'connected', label: 'Connected', count: connected.length },
    { key: 'pending', label: 'Pending', count: pending.length },
    { key: 'explore', label: 'Find Tutors', count: null },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#050508', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient blobs */}
      <div style={{
        position: 'fixed', top: '-10%', right: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', left: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)', zIndex: 0
      }} />

      <Navbar />
      <main style={{ padding: '80px 1.5rem 3rem', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', paddingTop: '1rem', flexWrap: 'wrap' }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
            background: 'rgba(168,85,247,0.15)',
            border: '1px solid rgba(168,85,247,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1rem',
            background2: 'linear-gradient(135deg, #a855f7, #06b6d4)',
            color: '#a855f7'
          }}>{initials}</div>
          <div>
            <h1 style={{
              fontWeight: 800, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {user?.full_name?.split(' ')[0] || 'Student'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', marginTop: '2px' }}>{user?.email}</p>
          </div>
          <span style={{
            marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 600,
            padding: '4px 12px', borderRadius: '999px',
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.2)',
            color: 'rgba(168,85,247,0.8)', whiteSpace: 'nowrap'
          }}>Student</span>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px', marginBottom: '2rem',
            background: 'rgba(168,85,247,0.15)',
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(168,85,247,0.2)'
          }}
        >
          {[
            { label: 'Connected', value: connected.length, gradient: 'linear-gradient(135deg, #a855f7, #06b6d4)' },
            { label: 'Pending', value: pending.length, gradient: 'linear-gradient(135deg, #ec4899, #f97316)' },
            { label: 'Total', value: enrollments.length, gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
          ].map(s => (
            <div key={s.label} style={{ padding: '1.4rem', background: '#050508', textAlign: 'center' }}>
              <div style={{
                fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em',
                background: s.gradient,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>{s.value}</div>
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
            background: 'rgba(255,255,255,0.03)', padding: '4px',
            borderRadius: '12px', width: 'fit-content',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '7px 16px', border: 'none', cursor: 'pointer',
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
              background: tab === t.key
                ? 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(6,182,212,0.25))'
                : 'transparent',
              color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.35)',
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
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                  style={{ height: '80px', background: 'rgba(168,85,247,0.05)', borderRadius: '14px', border: '1px solid rgba(168,85,247,0.1)' }}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
              style={{
                textAlign: 'center', padding: '4rem 1rem',
                border: '1px solid rgba(168,85,247,0.15)',
                borderRadius: '20px',
                background: 'rgba(168,85,247,0.05)'
              }}
            >
              <div style={{
                fontSize: '2.5rem', marginBottom: '1rem',
                background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>◎</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', fontWeight: 600 }}>Find tutors and centers</p>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Discover verified tutors near you</p>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/discover')}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
                }}
              >Browse Tutors</motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function EnrollmentCard({ enrollment, onRemove, onView, label, index }) {
  const isCenter = enrollment.role === 'center'
  const initials = enrollment.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px', padding: '1.1rem 1.2rem',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
          background: isCenter ? 'rgba(6,182,212,0.1)' : 'rgba(168,85,247,0.1)',
          border: `1px solid ${isCenter ? 'rgba(6,182,212,0.2)' : 'rgba(168,85,247,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '0.82rem',
          color: isCenter ? '#06b6d4' : '#a855f7'
        }}>{initials}</div>
        <div>
          <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{enrollment.name}</p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '3px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.68rem', padding: '2px 8px', borderRadius: '6px',
              background: isCenter ? 'rgba(6,182,212,0.08)' : 'rgba(168,85,247,0.08)',
              color: isCenter ? 'rgba(6,182,212,0.7)' : 'rgba(168,85,247,0.7)',
              border: `1px solid ${isCenter ? 'rgba(6,182,212,0.15)' : 'rgba(168,85,247,0.15)'}`
            }}>{isCenter ? 'Center' : 'Tutor'}</span>
            {enrollment.status === 'pending' && (
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>Awaiting approval</span>
            )}
            {enrollment.status === 'accepted' && enrollment.monthly_fee > 0 && (
              <span style={{
                fontSize: '0.72rem',
                background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                fontWeight: 600
              }}>₹{enrollment.monthly_fee}/month</span>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onView} style={{
          padding: '6px 14px', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px', color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500
        }}>View</button>
        <button onClick={onRemove} style={{
          padding: '6px 14px',
          background: 'rgba(248,113,113,0.06)',
          border: '1px solid rgba(248,113,113,0.15)',
          borderRadius: '8px', color: '#f87171',
          cursor: 'pointer', fontSize: '0.78rem'
        }}>{label || 'Remove'}</button>
      </div>
    </motion.div>
  )
}

function EmptyState({ text, sub, action, actionLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        textAlign: 'center', padding: '4rem 1rem',
        border: '1px solid rgba(168,85,247,0.15)',
        borderRadius: '20px', background: 'rgba(168,85,247,0.04)'
      }}
    >
      <div style={{
        fontSize: '2rem', marginBottom: '1rem',
        background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
      }}>◎</div>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem', fontWeight: 600 }}>{text}</p>
      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.82rem', marginBottom: action ? '1.5rem' : 0 }}>{sub}</p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={action} style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem'
          }}
        >{actionLabel}</motion.button>
      )}
    </motion.div>
  )
}