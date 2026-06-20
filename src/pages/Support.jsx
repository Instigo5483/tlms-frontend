import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const SUPPORT_EMAIL = 'support@tlms.website'
const DISCORD_URL = 'https://discord.gg/6zbbqUrQq9'

const STATUS_CONFIG = {
  processing: { label: 'Processing', bg: '#fffbeb', border: '#fde68a', color: '#b45309' },
  accepted:   { label: 'Accepted',   bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
  rejected:   { label: 'Rejected',   bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
}

export default function Support() {
  const { token, user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || user?.role === 'student') { setLoading(false); return }
    fetch(`${BACKEND}/api/subject-requests/mine`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setRequests(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '100px 1.5rem 4rem' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 style={{ fontWeight: 800, fontSize: '1.7rem', color: '#18181b', margin: '0 0 6px', letterSpacing: '-0.03em' }}>Support</h1>
          <p style={{ color: '#71717a', fontSize: '0.9rem', margin: 0 }}>Get help or track your requests</p>
        </motion.div>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '2.4rem' }}
        >
          {/* Email */}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            style={{ textDecoration: 'none' }}
          >
            <motion.div
              whileHover={{ scale: 1.015, boxShadow: '0 8px 24px rgba(79,70,229,0.1)' }}
              whileTap={{ scale: 0.99 }}
              style={{
                background: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px',
                padding: '1.4rem', cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: '#eff6ff', border: '1px solid #bfdbfe',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', marginBottom: '12px',
              }}>✉</div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#18181b', margin: '0 0 4px' }}>Email Support</p>
              <p style={{ fontSize: '0.82rem', color: '#4f46e5', margin: 0 }}>{SUPPORT_EMAIL}</p>
              <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: '4px 0 0' }}>We reply within 24 hours</p>
            </motion.div>
          </a>

          {/* Discord */}
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <motion.div
              whileHover={{ scale: 1.015, boxShadow: '0 8px 24px rgba(88,101,242,0.1)' }}
              whileTap={{ scale: 0.99 }}
              style={{
                background: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px',
                padding: '1.4rem', cursor: 'pointer',
              }}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: '#eef2ff', border: '1px solid #c7d2fe',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#5865F2">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#18181b', margin: '0 0 4px' }}>Discord Server</p>
              <p style={{ fontSize: '0.82rem', color: '#5865F2', margin: 0 }}>Join our community</p>
              <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: '4px 0 0' }}>Raise a support ticket</p>
            </motion.div>
          </a>
        </motion.div>

        {/* Subject Requests — tutors and centers only */}
        {user?.role !== 'student' && <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#18181b', margin: '0 0 1rem', letterSpacing: '-0.01em' }}>
            Your Subject Requests
          </h2>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[0, 1].map(i => (
                <div key={i} style={{
                  background: '#fff', border: '1px solid #e4e4e7', borderRadius: '14px',
                  height: '80px', animation: 'pulse 1.4s ease-in-out infinite',
                  opacity: 0.6,
                }} />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div style={{
              background: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px',
              padding: '2.5rem', textAlign: 'center',
            }}>
              <p style={{ color: '#a1a1aa', fontSize: '0.88rem', margin: 0 }}>No subject requests yet</p>
              <p style={{ color: '#d4d4d8', fontSize: '0.8rem', margin: '4px 0 0' }}>
                Use the "Request a subject not listed…" option in your profile subjects dropdown
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {requests.map((r, i) => {
                const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.processing
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: '#fff', border: '1px solid #e4e4e7', borderRadius: '14px',
                      padding: '1rem 1.2rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                        {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
                        background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
                      }}>{cfg.label}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(r.entries || []).map((entry, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{
                            background: '#f4f4f5', border: '1px solid #e4e4e7',
                            color: '#3f3f46', fontSize: '0.8rem', fontWeight: 600,
                            padding: '3px 10px', borderRadius: '6px',
                          }}>{entry.subject}</span>
                          {entry.grade && (
                            <span style={{ color: '#a1a1aa', fontSize: '0.75rem' }}>· {entry.grade}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>}

      </div>
    </div>
  )
}
