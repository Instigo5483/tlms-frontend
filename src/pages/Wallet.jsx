import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function Wallet() {
  const { user, token } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [form, setForm] = useState({
    amount: '', bank_account: '', ifsc_code: '', account_name: ''
  })
  const [withdrawing, setWithdrawing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadWallet()
    loadWithdrawals()
  }, [])

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
    setError('')
    setSuccess('')
    if (Number(form.amount) < 500) {
      setError('Minimum withdrawal amount is ₹500')
      return
    }
    if (Number(form.amount) > wallet?.balance) {
      setError('Insufficient balance')
      return
    }
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
      loadWallet()
      loadWithdrawals()
      setTab('history')
    } catch {
      setError('Failed to process withdrawal')
    } finally {
      setWithdrawing(false)
    }
  }

  const platformFee = form.amount ? Math.round(Number(form.amount) * 0.01 * 100) / 100 : 0
  const netAmount = form.amount ? Math.round((Number(form.amount) - platformFee) * 100) / 100 : 0

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '100vh', background: '#080c14',
        padding: '84px 1.5rem 3rem',
        maxWidth: '900px', margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.3rem' }}>
            Wallet
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage your earnings and withdrawals
          </p>
        </div>

        {/* Balance card */}
        {!loading && wallet && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(26,115,232,0.2) 0%, rgba(26,115,232,0.05) 100%)',
            border: '1px solid rgba(26,115,232,0.3)',
            borderRadius: '20px', padding: '2rem',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              AVAILABLE BALANCE
            </p>
            <p style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '2.5rem', marginBottom: '1.5rem' }}>
              ₹{Number(wallet.balance).toFixed(2)}
            </p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.78rem' }}>TOTAL EARNED</p>
                <p style={{ color: '#34d399', fontWeight: 700, fontSize: '1rem' }}>
                  ₹{Number(wallet.total_earned).toFixed(2)}
                </p>
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.78rem' }}>TOTAL WITHDRAWN</p>
                <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '1rem' }}>
                  ₹{Number(wallet.total_withdrawn).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '1.5rem',
          background: 'rgba(255,255,255,0.04)',
          padding: '4px', borderRadius: '10px', width: 'fit-content'
        }}>
          {[
            { key: 'overview', label: 'Withdraw' },
            { key: 'history', label: `History (${withdrawals.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '8px 18px', border: 'none', cursor: 'pointer',
              borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
              background: tab === t.key ? '#1a73e8' : 'transparent',
              color: tab === t.key ? '#fff' : '#64748b',
              transition: 'all 0.2s'
            }}>{t.label}</button>
          ))}
        </div>

        {/* Withdraw tab */}
        {tab === 'overview' && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '1.8rem'
          }}>
            <h2 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              Withdraw Funds
            </h2>

            <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Amount (₹) <span style={{ color: '#475569', fontWeight: 400 }}>min ₹500</span></label>
                <input
                  type="number" placeholder="Enter amount"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  min="500" required style={inputStyle}
                />
                {form.amount > 0 && (
                  <div style={{
                    marginTop: '8px', padding: '10px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '8px', fontSize: '0.82rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: '4px' }}>
                      <span>Platform fee (1%)</span>
                      <span>- ₹{platformFee}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 700 }}>
                      <span>You receive</span>
                      <span>₹{netAmount}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Account Holder Name</label>
                <input
                  type="text" placeholder="Name as per bank account"
                  value={form.account_name}
                  onChange={e => setForm(f => ({ ...f, account_name: e.target.value }))}
                  required style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Bank Account Number</label>
                <input
                  type="text" placeholder="Enter account number"
                  value={form.bank_account}
                  onChange={e => setForm(f => ({ ...f, bank_account: e.target.value }))}
                  required style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>IFSC Code</label>
                <input
                  type="text" placeholder="e.g. SBIN0001234"
                  value={form.ifsc_code}
                  onChange={e => setForm(f => ({ ...f, ifsc_code: e.target.value.toUpperCase() }))}
                  required style={inputStyle}
                />
              </div>

              {error && (
                <p style={{
                  color: '#f87171', fontSize: '0.85rem',
                  background: 'rgba(248,113,113,0.1)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  padding: '10px 14px', borderRadius: '8px'
                }}>{error}</p>
              )}

              {success && (
                <p style={{
                  color: '#34d399', fontSize: '0.85rem',
                  background: 'rgba(29,158,117,0.1)',
                  border: '1px solid rgba(29,158,117,0.2)',
                  padding: '10px 14px', borderRadius: '8px'
                }}>{success}</p>
              )}

              <button type="submit" disabled={withdrawing} style={{
                height: '48px', background: withdrawing ? '#1557b0' : '#1a73e8',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontWeight: 700, fontSize: '1rem',
                cursor: withdrawing ? 'not-allowed' : 'pointer'
              }}>
                {withdrawing ? 'Processing...' : 'Withdraw Funds'}
              </button>
            </form>
          </div>
        )}

        {/* History tab */}
        {tab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {withdrawals.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '4rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>💸</div>
                <p style={{ color: '#64748b' }}>No withdrawals yet</p>
              </div>
            ) : withdrawals.map(w => (
              <div key={w.id} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px', padding: '1.2rem',
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
              }}>
                <div>
                  <p style={{ color: '#f1f5f9', fontWeight: 600 }}>
                    Withdrawal to {w.account_name}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '3px' }}>
                    {w.bank_account} · IFSC: {w.ifsc_code}
                  </p>
                  <p style={{ color: '#475569', fontSize: '0.78rem', marginTop: '3px' }}>
                    {new Date(w.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p style={{ color: '#475569', fontSize: '0.78rem' }}>
                    Platform fee: ₹{w.platform_fee}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#34d399', fontWeight: 700, fontSize: '1.1rem' }}>
                    ₹{w.net_amount}
                  </p>
                  <span style={{
                    fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px',
                    background: w.status === 'completed' ? 'rgba(29,158,117,0.15)' :
                                w.status === 'processing' ? 'rgba(26,115,232,0.15)' :
                                'rgba(248,113,113,0.15)',
                    color: w.status === 'completed' ? '#34d399' :
                           w.status === 'processing' ? '#60a5fa' : '#f87171'
                  }}>
                    {w.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.85rem',
  fontWeight: 600, color: '#94a3b8', marginBottom: '6px'
}

const inputStyle = {
  width: '100%', height: '44px', padding: '0 14px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px', color: '#ffffff',
  fontSize: '0.95rem', outline: 'none'
}