import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const ACCENT = '#059669'

export default function Wallet() {
  const { user, token } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('withdraw')
  const [form, setForm] = useState({ amount: '', bank_account: '', ifsc_code: '', account_name: '' })
  const [withdrawing, setWithdrawing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { loadWallet(); loadWithdrawals() }, [])

  async function loadWallet() {
    try {
      const res = await fetch(`${BACKEND}/api/wallet`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setWallet(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function loadWithdrawals() {
    try {
      const res = await fetch(`${BACKEND}/api/wallet/withdrawals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setWithdrawals(Array.isArray(data) ? data : [])
    } catch (err) { console.error(err) }
  }

  async function handleWithdraw(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (Number(form.amount) < 500) { setError('Minimum withdrawal amount is ₹500'); return }
    if (Number(form.amount) > wallet?.balance) { setError('Insufficient balance'); return }
    setWithdrawing(true)
    try {
      const res = await fetch(`${BACKEND}/api/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          amount: Number(form.amount),
          bank_account: form.bank_account,
          ifsc_code: form.ifsc_code,
          account_name: form.account_name
        })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSuccess(data.message)
      setForm({ amount: '', bank_account: '', ifsc_code: '', account_name: '' })
      loadWallet(); loadWithdrawals()
      setTab('history')
    } catch { setError('Failed to process withdrawal') }
    finally { setWithdrawing(false) }
  }

  const totalEarned = Number(wallet?.total_earned) || 0
  const feeRate = totalEarned < 50000 ? 0.01
    : totalEarned < 100000 ? 0.0075
    : totalEarned < 500000 ? 0.005
    : 0.0025
  const feeLabel = totalEarned < 50000 ? '1%'
    : totalEarned < 100000 ? '0.75%'
    : totalEarned < 500000 ? '0.5%'
    : '0.25%'
  const platformFee = form.amount ? Math.round(Number(form.amount) * feeRate * 100) / 100 : 0
  const netAmount = form.amount ? Math.round((Number(form.amount) - platformFee) * 100) / 100 : 0

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <main style={{ padding: '96px 2.5rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '2rem', paddingTop: '1rem' }}
        >
          <h1 className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(1.5rem, 4vw, 2rem)', letterSpacing: '-0.02em', marginBottom: '0.3rem', color: '#18181b' }}>Wallet</h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.88rem' }}>
            Manage your earnings and withdrawals
          </p>
        </motion.div>

        {/* Balance card */}
        <AnimatePresence>
          {!loading && wallet && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '24px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}
            >
              <p style={{ color: '#a1a1aa', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>
                AVAILABLE BALANCE
              </p>
              <p className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '2rem', color: ACCENT }}>
                ₹{Number(wallet.balance).toFixed(2)}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '1rem', background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '14px' }}>
                  <p style={{ color: '#a1a1aa', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: '4px' }}>TOTAL EARNED</p>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: ACCENT }}>₹{Number(wallet.total_earned).toFixed(2)}</p>
                </div>
                <div style={{ padding: '1rem', background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: '14px' }}>
                  <p style={{ color: '#a1a1aa', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: '4px' }}>TOTAL WITHDRAWN</p>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: '#4f46e5' }}>₹{Number(wallet.total_withdrawn).toFixed(2)}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: '#f4f4f5', padding: '4px', borderRadius: '12px', width: 'fit-content' }}
        >
          {[
            { key: 'withdraw', label: 'Withdraw' },
            { key: 'history', label: `History (${withdrawals.length})` },
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
          {/* Withdraw tab */}
          {tab === 'withdraw' && (
            <motion.div key="withdraw"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            >
              <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px', padding: '1.8rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}>
                <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem', color: '#18181b' }}>Withdraw Funds</h2>

                <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>
                      Amount (₹) <span style={{ color: '#d4d4d8', fontWeight: 400 }}>min ₹500</span>
                    </label>
                    <input type="number" placeholder="0.00"
                      value={form.amount}
                      onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                      min="500" required style={inputStyle} />
                    <AnimatePresence>
                      {form.amount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ marginTop: '8px', padding: '12px 14px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0', fontSize: '0.82rem', overflow: 'hidden' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717a', marginBottom: '6px' }}>
                            <span>Platform fee ({feeLabel})</span>
                            <span>− ₹{platformFee}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span style={{ color: '#18181b' }}>You receive</span>
                            <span style={{ color: ACCENT }}>₹{netAmount}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label style={labelStyle}>Account Holder Name</label>
                    <input type="text" placeholder="Name as per bank account"
                      value={form.account_name}
                      onChange={e => setForm(f => ({ ...f, account_name: e.target.value }))}
                      required style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Bank Account Number</label>
                    <input type="text" placeholder="Enter account number"
                      value={form.bank_account}
                      onChange={e => setForm(f => ({ ...f, bank_account: e.target.value }))}
                      required style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>IFSC Code</label>
                    <input type="text" placeholder="e.g. SBIN0001234"
                      value={form.ifsc_code}
                      onChange={e => setForm(f => ({ ...f, ifsc_code: e.target.value.toUpperCase() }))}
                      required style={inputStyle} />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ color: '#dc2626', fontSize: '0.82rem', background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 12px', borderRadius: '10px' }}
                      >{error}</motion.p>
                    )}
                    {success && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ color: ACCENT, fontSize: '0.82rem', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 12px', borderRadius: '10px' }}
                      >{success}</motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit" disabled={withdrawing}
                    whileHover={{ scale: withdrawing ? 1 : 1.02 }}
                    whileTap={{ scale: withdrawing ? 1 : 0.98 }}
                    style={{
                      marginTop: '4px', height: '46px',
                      background: withdrawing ? '#e4e4e7' : ACCENT,
                      color: withdrawing ? '#a1a1aa' : '#fff',
                      border: 'none', borderRadius: '999px',
                      fontWeight: 700, fontSize: '0.95rem',
                      cursor: withdrawing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {withdrawing ? 'Processing...' : 'Withdraw Funds'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {/* History tab */}
          {tab === 'history' && (
            <motion.div key="history"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {withdrawals.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: '4rem 1rem', border: '1px solid #e4e4e7', borderRadius: '24px', background: '#fafafa' }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.6 }}>◎</div>
                  <p style={{ color: '#52525b', fontWeight: 600 }}>No withdrawals yet</p>
                </motion.div>
              ) : withdrawals.map((w, i) => {
                const statusColor = w.status === 'completed' ? ACCENT : w.status === 'processing' ? '#0891b2' : '#dc2626'
                const statusBg = w.status === 'completed' ? '#ecfdf5' : w.status === 'processing' ? '#ecfeff' : '#fef2f2'
                const statusBorder = w.status === 'completed' ? '#a7f3d0' : w.status === 'processing' ? '#a5f3fc' : '#fecaca'
                return (
                  <motion.div key={w.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}
                  >
                    <div>
                      <p style={{ color: '#18181b', fontWeight: 600, fontSize: '0.9rem' }}>{w.account_name}</p>
                      <p style={{ color: '#a1a1aa', fontSize: '0.78rem', marginTop: '2px' }}>
                        {w.bank_account} · {w.ifsc_code}
                      </p>
                      <p style={{ color: '#d4d4d8', fontSize: '0.72rem', marginTop: '2px' }}>
                        {new Date(w.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · fee ₹{w.platform_fee}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: ACCENT }}>₹{w.net_amount}</p>
                      <span style={{ fontSize: '0.68rem', padding: '2px 10px', borderRadius: '999px', marginTop: '4px', display: 'inline-block', background: statusBg, border: `1px solid ${statusBorder}`, color: statusColor }}>
                        {w.status}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.75rem',
  fontWeight: 500, color: '#71717a',
  marginBottom: '6px', letterSpacing: '0.02em'
}

const inputStyle = {
  width: '100%', height: '42px', padding: '0 14px',
}
