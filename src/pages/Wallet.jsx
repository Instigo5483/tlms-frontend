import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL

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

  const platformFee = form.amount ? Math.round(Number(form.amount) * 0.01 * 100) / 100 : 0
  const netAmount = form.amount ? Math.round((Number(form.amount) - platformFee) * 100) / 100 : 0

  return (
    <div style={{ minHeight: '100vh', background: '#050508', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient blobs */}
      <div style={{
        position: 'fixed', top: '-10%', right: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', left: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)', zIndex: 0
      }} />

      <Navbar />
      <main style={{ padding: '80px 1.5rem 3rem', maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '2rem', paddingTop: '1rem' }}
        >
          <h1 style={{
            fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            letterSpacing: '-0.03em', marginBottom: '0.3rem',
            background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Wallet</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem' }}>
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
              style={{
                background: 'rgba(16,185,129,0.05)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '20px', padding: '2rem',
                marginBottom: '2rem', position: 'relative', overflow: 'hidden'
              }}
            >
              {/* Top glow line */}
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '60%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent)'
              }} />

              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>
                AVAILABLE BALANCE
              </p>
              <p style={{
                fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 3rem)',
                letterSpacing: '-0.04em', marginBottom: '2rem',
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                ₹{Number(wallet.balance).toFixed(2)}
              </p>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '1px', background: 'rgba(16,185,129,0.15)',
                borderRadius: '12px', overflow: 'hidden',
                border: '1px solid rgba(16,185,129,0.15)'
              }}>
                <div style={{ padding: '1rem', background: '#050508' }}>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: '4px' }}>TOTAL EARNED</p>
                  <p style={{
                    fontWeight: 700, fontSize: '1rem',
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>₹{Number(wallet.total_earned).toFixed(2)}</p>
                </div>
                <div style={{ padding: '1rem', background: '#050508' }}>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', letterSpacing: '0.08em', marginBottom: '4px' }}>TOTAL WITHDRAWN</p>
                  <p style={{
                    fontWeight: 700, fontSize: '1rem',
                    background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>₹{Number(wallet.total_withdrawn).toFixed(2)}</p>
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
          style={{
            display: 'flex', gap: '4px', marginBottom: '1.5rem',
            background: 'rgba(255,255,255,0.03)', padding: '4px',
            borderRadius: '12px', width: 'fit-content',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          {[
            { key: 'withdraw', label: 'Withdraw' },
            { key: 'history', label: `History (${withdrawals.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '7px 16px', border: 'none', cursor: 'pointer',
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
              background: tab === t.key
                ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))'
                : 'transparent',
              color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.35)',
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
              <div style={{
                background: 'rgba(16,185,129,0.04)',
                border: '1px solid rgba(16,185,129,0.15)',
                borderRadius: '16px', padding: '1.8rem',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '40%', height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)'
                }} />
                <h2 style={{
                  fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>Withdraw Funds</h2>

                <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>
                      Amount (₹) <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>min ₹500</span>
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
                          style={{
                            marginTop: '8px', padding: '12px 14px',
                            background: 'rgba(16,185,129,0.06)',
                            borderRadius: '10px',
                            border: '1px solid rgba(16,185,129,0.12)',
                            fontSize: '0.82rem', overflow: 'hidden'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' }}>
                            <span>Platform fee (1%)</span>
                            <span>− ₹{platformFee}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span style={{ color: 'rgba(255,255,255,0.7)' }}>You receive</span>
                            <span style={{
                              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>₹{netAmount}</span>
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
                        style={{ color: '#f87171', fontSize: '0.82rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', padding: '10px 12px', borderRadius: '8px' }}
                      >{error}</motion.p>
                    )}
                    {success && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ color: '#10b981', fontSize: '0.82rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', padding: '10px 12px', borderRadius: '8px' }}
                      >{success}</motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit" disabled={withdrawing}
                    whileHover={{ scale: withdrawing ? 1 : 1.02 }}
                    whileTap={{ scale: withdrawing ? 1 : 0.98 }}
                    style={{
                      marginTop: '4px', height: '46px',
                      background: withdrawing
                        ? 'rgba(16,185,129,0.1)'
                        : 'linear-gradient(135deg, #10b981, #06b6d4)',
                      color: withdrawing ? 'rgba(255,255,255,0.3)' : '#fff',
                      border: 'none', borderRadius: '12px',
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
                  style={{
                    textAlign: 'center', padding: '4rem 1rem',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: '20px', background: 'rgba(16,185,129,0.04)'
                  }}
                >
                  <div style={{
                    fontSize: '2rem', marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>◎</div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>No withdrawals yet</p>
                </motion.div>
              ) : withdrawals.map((w, i) => (
                <motion.div key={w.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: 'rgba(16,185,129,0.03)',
                    border: '1px solid rgba(16,185,129,0.12)',
                    borderRadius: '14px', padding: '1.2rem',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                  }}
                >
                  <div>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{w.account_name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '2px' }}>
                      {w.bank_account} · {w.ifsc_code}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', marginTop: '2px' }}>
                      {new Date(w.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · fee ₹{w.platform_fee}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em',
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>₹{w.net_amount}</p>
                    <span style={{
                      fontSize: '0.68rem', padding: '2px 10px', borderRadius: '999px',
                      marginTop: '4px', display: 'inline-block',
                      background: w.status === 'completed'
                        ? 'rgba(16,185,129,0.1)'
                        : w.status === 'processing'
                        ? 'rgba(6,182,212,0.1)'
                        : 'rgba(248,113,113,0.1)',
                      border: `1px solid ${w.status === 'completed' ? 'rgba(16,185,129,0.2)' : w.status === 'processing' ? 'rgba(6,182,212,0.2)' : 'rgba(248,113,113,0.2)'}`,
                      color: w.status === 'completed' ? '#10b981' : w.status === 'processing' ? '#06b6d4' : '#f87171'
                    }}>
                      {w.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.75rem',
  fontWeight: 500, color: 'rgba(255,255,255,0.35)',
  marginBottom: '6px', letterSpacing: '0.02em'
}

const inputStyle = {
  width: '100%', height: '42px', padding: '0 14px',
  background: 'rgba(255,255,255,0.04) !important',
  border: '1px solid rgba(16,185,129,0.15) !important',
  borderRadius: '10px !important', color: '#fff !important',
  fontSize: '0.9rem'
}