import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const ACCENT = '#2563eb'

export default function Wallet() {
  const { token } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [withdrawals, setWithdrawals] = useState([])
  const [payoutAccount, setPayoutAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('withdraw')

  const [amount, setAmount] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawError, setWithdrawError] = useState('')
  const [withdrawSuccess, setWithdrawSuccess] = useState('')

  const [payoutType, setPayoutType] = useState('bank')
  const [payoutForm, setPayoutForm] = useState({ upi: '', bank_account: '', bank_ifsc: '', account_name: '' })
  const [savingPayout, setSavingPayout] = useState(false)
  const [payoutError, setPayoutError] = useState('')
  const [payoutSuccess, setPayoutSuccess] = useState('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    await Promise.all([loadWallet(), loadWithdrawals(), loadPayoutAccount()])
    setLoading(false)
  }

  async function loadWallet() {
    try {
      const res = await fetch(`${BACKEND}/api/wallet`, { headers: { 'Authorization': `Bearer ${token}` } })
      setWallet(await res.json())
    } catch {}
  }

  async function loadWithdrawals() {
    try {
      const res = await fetch(`${BACKEND}/api/wallet/withdrawals`, { headers: { 'Authorization': `Bearer ${token}` } })
      const data = await res.json()
      setWithdrawals(Array.isArray(data) ? data : [])
    } catch {}
  }

  async function loadPayoutAccount() {
    try {
      const res = await fetch(`${BACKEND}/api/wallet/payout-account`, { headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setPayoutAccount(data)
        if (data?.payout_type) {
          setPayoutType(data.payout_type)
          setPayoutForm({
            upi: data.payout_upi || '',
            bank_account: data.payout_bank_account || '',
            bank_ifsc: data.payout_bank_ifsc || '',
            account_name: data.payout_account_name || '',
          })
        }
      }
    } catch {}
  }

  async function handleSavePayoutAccount(e) {
    e.preventDefault()
    setPayoutError(''); setPayoutSuccess('')
    setSavingPayout(true)
    try {
      const res = await fetch(`${BACKEND}/api/wallet/payout-account`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          payout_type: payoutType,
          upi: payoutForm.upi,
          bank_account: payoutForm.bank_account,
          bank_ifsc: payoutForm.bank_ifsc,
          account_name: payoutForm.account_name,
        })
      })
      const data = await res.json()
      if (!res.ok) { setPayoutError(data.error); return }
      setPayoutSuccess('Payout account saved successfully.')
      await loadPayoutAccount()
    } catch { setPayoutError('Failed to save. Try again.') }
    finally { setSavingPayout(false) }
  }

  async function handleWithdraw(e) {
    e.preventDefault()
    setWithdrawError(''); setWithdrawSuccess('')
    if (Number(amount) < 500) { setWithdrawError('Minimum withdrawal amount is ₹500'); return }
    if (Number(amount) > wallet?.balance) { setWithdrawError('Insufficient balance'); return }
    if (!payoutAccount?.payout_type) { setWithdrawError('Set up a payout account first'); return }
    setWithdrawing(true)
    try {
      const res = await fetch(`${BACKEND}/api/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(amount) })
      })
      const data = await res.json()
      if (!res.ok) { setWithdrawError(data.error); return }
      setWithdrawSuccess(data.message)
      setAmount('')
      loadWallet(); loadWithdrawals()
      setTab('history')
    } catch { setWithdrawError('Failed to process withdrawal') }
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
  const platformFee = amount ? Math.round(Number(amount) * feeRate * 100) / 100 : 0
  const netAmount = amount ? Math.round((Number(amount) - platformFee) * 100) / 100 : 0

  const hasPayout = !!(payoutAccount?.payout_type)
  const payoutLabel = hasPayout
    ? payoutAccount.payout_type === 'upi'
      ? payoutAccount.payout_upi
      : `${payoutAccount.payout_account_name} · ···${(payoutAccount.payout_bank_account || '').slice(-4)} · ${payoutAccount.payout_bank_ifsc}`
    : null

  const TABS = [
    { key: 'withdraw', label: 'Withdraw' },
    { key: 'payout', label: hasPayout ? 'Payout Account' : 'Payout Account !' },
    { key: 'history', label: `History (${withdrawals.length})` },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <main style={{ padding: '96px 2.5rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '2rem', paddingTop: '1rem' }}
        >
          <h1 className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(1.5rem, 4vw, 2rem)', letterSpacing: '-0.02em', marginBottom: '0.3rem', color: '#18181b' }}>Wallet</h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.88rem' }}>
            Manage your earnings. Request a withdrawal and you'll be paid to your saved bank or UPI account.
          </p>
        </motion.div>

        <AnimatePresence>
          {!loading && wallet && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '24px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}
            >
              <p style={{ color: '#a1a1aa', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>AVAILABLE BALANCE</p>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: '#f4f4f5', padding: '4px', borderRadius: '12px', width: 'fit-content' }}
        >
          {TABS.map(t => (
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

          {/* ── Withdraw tab ── */}
          {tab === 'withdraw' && (
            <motion.div key="withdraw"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            >
              <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px', padding: '1.8rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)', maxWidth: '480px' }}>
                <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem', color: '#18181b' }}>Withdraw Funds</h2>

                {!hasPayout ? (
                  <div style={{ padding: '14px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', marginBottom: '1.4rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600, marginBottom: '4px' }}>No payout account set up</p>
                    <p style={{ fontSize: '0.8rem', color: '#3b82f6' }}>
                      Go to{' '}
                      <button onClick={() => setTab('payout')} style={{ background: 'none', border: 'none', color: ACCENT, fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                        Payout Account
                      </button>{' '}
                      to add your bank or UPI details before withdrawing.
                    </p>
                  </div>
                ) : (
                  <div style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '0.68rem', color: '#a1a1aa', letterSpacing: '0.08em', marginBottom: '3px' }}>PAYOUT TO</p>
                      <p style={{ fontSize: '0.88rem', color: '#18181b', fontWeight: 600 }}>{payoutLabel}</p>
                      <p style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '2px' }}>
                        via {payoutAccount.payout_type === 'upi' ? 'UPI' : 'Bank Transfer (IMPS)'}
                      </p>
                    </div>
                    <button onClick={() => setTab('payout')} style={{ background: 'none', border: 'none', color: ACCENT, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                      Change
                    </button>
                  </div>
                )}

                <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>
                      Amount (₹) <span style={{ color: '#d4d4d8', fontWeight: 400 }}>min ₹500</span>
                    </label>
                    <input
                      type="number" placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      min="500" required style={inputStyle}
                    />
                    <AnimatePresence>
                      {Number(amount) > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ marginTop: '8px', padding: '12px 14px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '0.82rem', overflow: 'hidden' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717a', marginBottom: '6px' }}>
                            <span>Platform fee ({feeLabel})</span>
                            <span>− ₹{platformFee}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span style={{ color: '#18181b' }}>You receive</span>
                            <span style={{ color: ACCENT }}>₹{netAmount}</span>
                          </div>
                          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #bfdbfe', fontSize: '0.72rem', color: '#64748b' }}>
                            Platform fee (₹{platformFee}) goes to TLMS
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {withdrawError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ color: '#18181b', fontSize: '0.82rem', background: '#f4f4f5', border: '1px solid #d4d4d8', padding: '10px 12px', borderRadius: '10px' }}
                      >{withdrawError}</motion.p>
                    )}
                    {withdrawSuccess && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ color: ACCENT, fontSize: '0.82rem', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 12px', borderRadius: '10px' }}
                      >{withdrawSuccess}</motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit" disabled={withdrawing || !hasPayout}
                    whileHover={{ scale: (withdrawing || !hasPayout) ? 1 : 1.02 }}
                    whileTap={{ scale: (withdrawing || !hasPayout) ? 1 : 0.98 }}
                    style={{
                      marginTop: '4px', height: '46px',
                      background: (withdrawing || !hasPayout) ? '#e4e4e7' : ACCENT,
                      color: (withdrawing || !hasPayout) ? '#a1a1aa' : '#fff',
                      border: 'none', borderRadius: '999px',
                      fontWeight: 700, fontSize: '0.95rem',
                      cursor: (withdrawing || !hasPayout) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {withdrawing ? 'Processing...' : 'Withdraw Funds'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── Payout Account tab ── */}
          {tab === 'payout' && (
            <motion.div key="payout"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            >
              <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px', padding: '1.8rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)', maxWidth: '480px' }}>
                <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem', color: '#18181b' }}>Payout Account</h2>
                <p style={{ color: '#a1a1aa', fontSize: '0.82rem', marginBottom: '1.6rem', lineHeight: 1.6 }}>
                  Save your bank or UPI details. When you request a withdrawal, the platform admin will manually send the payment to this account.
                </p>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '1.4rem' }}>
                  {[{ key: 'bank', label: 'Bank Account' }, { key: 'upi', label: 'UPI' }].map(({ key, label }) => (
                    <button key={key} type="button" onClick={() => setPayoutType(key)}
                      style={{
                        padding: '8px 20px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                        background: payoutType === key ? ACCENT : '#f4f4f5',
                        color: payoutType === key ? '#fff' : '#71717a',
                        border: `1px solid ${payoutType === key ? ACCENT : '#e4e4e7'}`,
                        transition: 'all 0.18s'
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSavePayoutAccount} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <AnimatePresence mode="wait">
                    {payoutType === 'upi' ? (
                      <motion.div key="upi"
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                      >
                        <label style={labelStyle}>UPI ID / VPA</label>
                        <input type="text" placeholder="yourname@upi or yourname@paytm"
                          value={payoutForm.upi}
                          onChange={e => setPayoutForm(f => ({ ...f, upi: e.target.value }))}
                          required style={inputStyle} />
                      </motion.div>
                    ) : (
                      <motion.div key="bank"
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                      >
                        <div>
                          <label style={labelStyle}>Account Holder Name</label>
                          <input type="text" placeholder="Name as per bank account"
                            value={payoutForm.account_name}
                            onChange={e => setPayoutForm(f => ({ ...f, account_name: e.target.value }))}
                            required style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Bank Account Number</label>
                          <input type="text" placeholder="Enter account number"
                            value={payoutForm.bank_account}
                            onChange={e => setPayoutForm(f => ({ ...f, bank_account: e.target.value }))}
                            required style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>IFSC Code</label>
                          <input type="text" placeholder="e.g. SBIN0001234"
                            value={payoutForm.bank_ifsc}
                            onChange={e => setPayoutForm(f => ({ ...f, bank_ifsc: e.target.value.toUpperCase() }))}
                            required style={inputStyle} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {payoutError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ color: '#18181b', fontSize: '0.82rem', background: '#f4f4f5', border: '1px solid #d4d4d8', padding: '10px 12px', borderRadius: '10px' }}
                      >{payoutError}</motion.p>
                    )}
                    {payoutSuccess && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ color: ACCENT, fontSize: '0.82rem', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 12px', borderRadius: '10px' }}
                      >{payoutSuccess}</motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit" disabled={savingPayout}
                    whileHover={{ scale: savingPayout ? 1 : 1.02 }}
                    whileTap={{ scale: savingPayout ? 1 : 0.98 }}
                    style={{
                      marginTop: '4px', height: '46px',
                      background: savingPayout ? '#e4e4e7' : ACCENT,
                      color: savingPayout ? '#a1a1aa' : '#fff',
                      border: 'none', borderRadius: '999px',
                      fontWeight: 700, fontSize: '0.95rem',
                      cursor: savingPayout ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {savingPayout ? 'Saving...' : hasPayout ? 'Update Payout Account' : 'Save Payout Account'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── History tab ── */}
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
                const isProcessing = w.status === 'processing'
                const isCompleted = w.status === 'completed'
                const statusColor = isCompleted ? ACCENT : isProcessing ? '#475569' : '#18181b'
                const statusBg = isCompleted ? '#eff6ff' : isProcessing ? '#f1f5f9' : '#f4f4f5'
                const statusBorder = isCompleted ? '#bfdbfe' : isProcessing ? '#e2e8f0' : '#d4d4d8'
                const isUpi = w.payout_mode === 'upi' || w.ifsc_code === 'UPI'
                return (
                  <motion.div key={w.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}
                  >
                    <div>
                      <p style={{ color: '#18181b', fontWeight: 600, fontSize: '0.9rem' }}>
                        {isUpi ? w.bank_account : w.account_name}
                      </p>
                      <p style={{ color: '#a1a1aa', fontSize: '0.78rem', marginTop: '2px' }}>
                        {isUpi ? 'UPI' : `···${(w.bank_account || '').slice(-4)} · ${w.ifsc_code}`}
                      </p>
                      <p style={{ color: '#d4d4d8', fontSize: '0.72rem', marginTop: '2px' }}>
                        {new Date(w.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}fee ₹{w.platform_fee}
                      </p>
                      {w.utr_reference && (
                        <p style={{ color: '#a1a1aa', fontSize: '0.72rem', marginTop: '2px' }}>
                          UTR: <span style={{ color: '#71717a', fontWeight: 600 }}>{w.utr_reference}</span>
                        </p>
                      )}
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
