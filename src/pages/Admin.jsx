import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const ACCENT = '#2563eb'

export default function Admin() {
  const [secret, setSecret] = useState(() => sessionStorage.getItem('admin_secret') || '')
  const [authed, setAuthed] = useState(false)
  const [withdrawals, setWithdrawals] = useState([])
  const [subjectRequests, setSubjectRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [adminTab, setAdminTab] = useState('withdrawals')
  const [filter, setFilter] = useState('pending')
  const [completing, setCompleting] = useState(null)
  const [utrInputs, setUtrInputs] = useState({})
  const [updatingStatus, setUpdatingStatus] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/admin/withdrawals`, {
        headers: { 'x-admin-secret': secret }
      })
      if (res.status === 401) { setError('Wrong secret key'); return }
      const data = await res.json()
      sessionStorage.setItem('admin_secret', secret)
      setWithdrawals(data)
      setAuthed(true)
      loadSubjectRequests(secret)
    } catch { setError('Could not connect to backend') }
    finally { setLoading(false) }
  }

  async function loadWithdrawals() {
    try {
      const res = await fetch(`${BACKEND}/api/admin/withdrawals`, {
        headers: { 'x-admin-secret': secret }
      })
      const data = await res.json()
      setWithdrawals(data)
    } catch {}
  }

  async function loadSubjectRequests(s = secret) {
    try {
      const res = await fetch(`${BACKEND}/api/admin/subject-requests`, {
        headers: { 'x-admin-secret': s }
      })
      if (res.ok) setSubjectRequests(await res.json())
    } catch {}
  }

  async function updateSubjectStatus(id, status) {
    setUpdatingStatus(id + status)
    try {
      const res = await fetch(`${BACKEND}/api/admin/subject-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setSubjectRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      }
    } catch {}
    finally { setUpdatingStatus(null) }
  }

  async function markComplete(w) {
    setCompleting(w.id)
    try {
      const res = await fetch(`${BACKEND}/api/admin/withdrawals/${w.id}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ utr_reference: utrInputs[w.id] || '' })
      })
      if (res.ok) {
        setUtrInputs(u => { const n = { ...u }; delete n[w.id]; return n })
        await loadWithdrawals()
      }
    } catch {}
    finally { setCompleting(null) }
  }

  const filtered = withdrawals.filter(w =>
    filter === 'all' ? true :
    filter === 'pending' ? ['pending', 'processing'].includes(w.status) :
    w.status === filter
  )

  const pendingCount = withdrawals.filter(w => ['pending', 'processing'].includes(w.status)).length

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: '380px', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 24px 60px rgba(24,24,27,0.08)' }}
        >
          <h1 className="font-display" style={{ fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.02em', marginBottom: '0.3rem', color: '#18181b' }}>Admin Panel</h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1.8rem' }}>TLMS withdrawal management</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Admin Secret Key</label>
              <input
                type="password" placeholder="Enter secret key"
                value={secret} onChange={e => setSecret(e.target.value)}
                required style={inputStyle}
              />
            </div>
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ fontSize: '0.82rem', color: '#18181b', background: '#f4f4f5', border: '1px solid #d4d4d8', padding: '10px 12px', borderRadius: '10px' }}
                >{error}</motion.p>
              )}
            </AnimatePresence>
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{ height: '46px', background: loading ? '#e4e4e7' : ACCENT, color: loading ? '#a1a1aa' : '#fff', border: 'none', borderRadius: '999px', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Checking...' : 'Enter'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e4e4e7', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span className="font-display" style={{ fontWeight: 700, fontSize: '1.1rem', color: '#18181b' }}>TLMS Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '4px', background: '#f4f4f5', padding: '4px', borderRadius: '12px' }}>
          {[
            { key: 'withdrawals', label: `Withdrawals${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
            { key: 'subject-requests', label: `Subject Requests${subjectRequests.length > 0 ? ` (${subjectRequests.length})` : ''}` },
          ].map(t => (
            <button key={t.key} onClick={() => setAdminTab(t.key)} style={{
              padding: '6px 14px', border: 'none', cursor: 'pointer', borderRadius: '9px',
              fontSize: '0.8rem', fontWeight: 600,
              background: adminTab === t.key ? '#fff' : 'transparent',
              color: adminTab === t.key ? '#18181b' : '#a1a1aa',
              boxShadow: adminTab === t.key ? '0 1px 3px rgba(24,24,27,0.1)' : 'none',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

        {adminTab === 'withdrawals' && (
          <>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: '#f4f4f5', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
              {[
                { key: 'pending', label: `Pending (${pendingCount})` },
                { key: 'completed', label: 'Completed' },
                { key: 'all', label: 'All' },
              ].map(t => (
                <button key={t.key} onClick={() => setFilter(t.key)} style={{
                  padding: '7px 16px', border: 'none', cursor: 'pointer', borderRadius: '9px',
                  fontSize: '0.82rem', fontWeight: 600,
                  background: filter === t.key ? '#fff' : 'transparent',
                  color: filter === t.key ? '#18181b' : '#a1a1aa',
                  boxShadow: filter === t.key ? '0 1px 3px rgba(24,24,27,0.1)' : 'none',
                  transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}>{t.label}</button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px' }}>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>No withdrawals in this view</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map((w, i) => {
                  const isPending = ['pending', 'processing'].includes(w.status)
                  const isUpi = w.payout_mode === 'upi' || w.ifsc_code === 'UPI'
                  return (
                    <motion.div key={w.id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ background: '#fff', border: `1px solid ${isPending ? '#bfdbfe' : '#e4e4e7'}`, borderRadius: '16px', padding: '1.2rem 1.4rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#18181b' }}>{w.full_name}</span>
                            <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '999px', background: isPending ? '#eff6ff' : '#f4f4f5', border: `1px solid ${isPending ? '#bfdbfe' : '#d4d4d8'}`, color: isPending ? ACCENT : '#71717a' }}>
                              {w.status}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <a href={`mailto:${w.email}`} style={{ fontSize: '0.8rem', color: ACCENT, textDecoration: 'none' }}>{w.email}</a>
                            {w.phone && <a href={`tel:${w.phone}`} style={{ fontSize: '0.8rem', color: ACCENT, textDecoration: 'none' }}>{w.phone}</a>}
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '2px' }}>
                            {isUpi
                              ? `UPI: ${w.bank_account}`
                              : `Bank: ${w.account_name} · ···${(w.bank_account || '').slice(-4)} · ${w.ifsc_code}`
                            }
                          </p>
                          <p style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                            {new Date(w.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            {w.utr_reference && ` · UTR: ${w.utr_reference}`}
                          </p>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 800, fontSize: '1.1rem', color: ACCENT, letterSpacing: '-0.02em' }}>₹{w.net_amount}</p>
                          <p style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '2px' }}>fee ₹{w.platform_fee}</p>
                        </div>
                      </div>

                      {isPending && (
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f4f4f5', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            placeholder="UTR / Transaction ID (optional)"
                            value={utrInputs[w.id] || ''}
                            onChange={e => setUtrInputs(u => ({ ...u, [w.id]: e.target.value }))}
                            style={{ ...inputStyle, flex: 1, minWidth: '200px', height: '38px', fontSize: '0.82rem' }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            disabled={completing === w.id}
                            onClick={() => markComplete(w)}
                            style={{
                              padding: '0 20px', height: '38px', background: completing === w.id ? '#e4e4e7' : ACCENT,
                              color: completing === w.id ? '#a1a1aa' : '#fff', border: 'none', borderRadius: '999px',
                              fontWeight: 700, fontSize: '0.82rem', cursor: completing === w.id ? 'not-allowed' : 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {completing === w.id ? 'Saving...' : 'Mark as Paid'}
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {adminTab === 'subject-requests' && (
          <>
            {subjectRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px' }}>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>No subject requests yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {subjectRequests.map((r, i) => {
                  const status = r.status || 'processing'
                  const statusCfg = {
                    processing: { label: 'Processing', bg: '#fffbeb', border: '#fde68a', color: '#b45309' },
                    accepted:   { label: 'Accepted',   bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
                    rejected:   { label: 'Rejected',   bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
                  }[status]
                  return (
                    <motion.div key={r.id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '1.2rem 1.4rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#18181b' }}>{r.name || '—'}</span>
                            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: '#f4f4f5', border: '1px solid #e4e4e7', color: '#71717a' }}>{r.role}</span>
                            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, color: statusCfg.color, fontWeight: 600 }}>
                              {statusCfg.label}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <a href={`mailto:${r.email}`} style={{ fontSize: '0.8rem', color: ACCENT, textDecoration: 'none' }}>{r.email}</a>
                            {r.phone && <a href={`tel:${r.phone}`} style={{ fontSize: '0.8rem', color: ACCENT, textDecoration: 'none' }}>{r.phone}</a>}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                          {new Date(r.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                        {(r.entries || []).map((entry, j) => (
                          <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: ACCENT, fontSize: '0.8rem', fontWeight: 600, padding: '3px 10px', borderRadius: '6px' }}>
                              {entry.subject}
                            </span>
                            {entry.grade && (
                              <span style={{ color: '#71717a', fontSize: '0.78rem' }}>for {entry.grade}</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Status action buttons */}
                      <div style={{ display: 'flex', gap: '6px', paddingTop: '12px', borderTop: '1px solid #f4f4f5', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa', alignSelf: 'center', marginRight: '4px' }}>Set status:</span>
                        {[
                          { key: 'processing', label: 'Processing', activeColor: '#b45309', activeBg: '#fffbeb', activeBorder: '#fde68a' },
                          { key: 'accepted',   label: 'Accepted',   activeColor: '#15803d', activeBg: '#f0fdf4', activeBorder: '#bbf7d0' },
                          { key: 'rejected',   label: 'Rejected',   activeColor: '#dc2626', activeBg: '#fef2f2', activeBorder: '#fecaca' },
                        ].map(opt => {
                          const isActive = status === opt.key
                          const isBusy = updatingStatus === r.id + opt.key
                          return (
                            <motion.button
                              key={opt.key}
                              whileHover={{ scale: isActive ? 1 : 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              disabled={isActive || !!updatingStatus}
                              onClick={() => updateSubjectStatus(r.id, opt.key)}
                              style={{
                                padding: '5px 14px', border: `1px solid ${isActive ? opt.activeBorder : '#e4e4e7'}`,
                                borderRadius: '999px', cursor: isActive ? 'default' : 'pointer',
                                fontSize: '0.78rem', fontWeight: 600,
                                background: isActive ? opt.activeBg : '#fff',
                                color: isActive ? opt.activeColor : '#71717a',
                                opacity: isBusy ? 0.5 : 1,
                                transition: 'all 0.15s',
                              }}
                            >{isBusy ? '…' : opt.label}</motion.button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#71717a', marginBottom: '6px' }
const inputStyle = { width: '100%', height: '42px', padding: '0 14px', boxSizing: 'border-box' }
