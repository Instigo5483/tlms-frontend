import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID
const ACCENT = '#4f46e5'

export default function Payments() {
  const { user, token } = useAuth()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(null)
  const [tab, setTab] = useState('pending')
  const [successData, setSuccessData] = useState(null)

  useEffect(() => { loadBills() }, [])

  async function loadBills() {
    try {
      const res = await fetch(`${BACKEND}/api/bills`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setBills(Array.isArray(data) ? data : [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function handlePay(bill) {
    setPaying(bill.id)
    try {
      const res = await fetch(`${BACKEND}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ bill_id: bill.id })
      })
      const order = await res.json()
      if (!res.ok) { alert(order.error || 'Failed to create order'); return }

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount * 100,
        currency: 'INR',
        name: 'TLMS',
        description: `Monthly fee — ${bill.tutor_name}`,
        order_id: order.order_id,
        handler: async (response) => {
          const verifyRes = await fetch(`${BACKEND}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              payment_db_id: order.payment_db_id,
              bill_id: bill.id
            })
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            setSuccessData({
              invoice: verifyData.invoice_number,
              amount: bill.amount,
              name: bill.tutor_name
            })
            loadBills()
          } else {
            alert('Payment verification failed.')
          }
        },
        prefill: { email: user.email, name: user.full_name },
        theme: { color: ACCENT },
        modal: { ondismiss: () => setPaying(null) }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      alert('Payment failed. Try again.')
    } finally {
      setPaying(null)
    }
  }

  const pending = bills.filter(b => b.status === 'pending')
  const paid = bills.filter(b => b.status === 'paid')
  const overdue = bills.filter(b => b.status === 'overdue')
  const current = tab === 'pending' ? pending : tab === 'paid' ? paid : overdue

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
          <h1 className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(1.5rem, 4vw, 2rem)', letterSpacing: '-0.02em', marginBottom: '0.3rem', color: '#18181b' }}>Payments</h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.88rem' }}>
            {user?.role === 'student' ? 'Your monthly fee bills' : 'Payments from your students'}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '2rem' }}
        >
          {[
            { label: 'Pending', value: pending.length, color: ACCENT },
            { label: 'Paid', value: paid.length, color: '#2563eb' },
            { label: 'Overdue', value: overdue.length, color: '#18181b' },
          ].map(s => (
            <div key={s.label} style={{ padding: '1.2rem', background: '#fff', border: '1px solid #e4e4e7', borderRadius: '16px', textAlign: 'center', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }}>
              <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', color: s.color }}>{s.value}</div>
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
          {[
            { key: 'pending', label: `Pending (${pending.length})` },
            { key: 'paid', label: `Paid (${paid.length})` },
            { key: 'overdue', label: `Overdue (${overdue.length})` },
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

        {/* Bill list */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {[1,2,3].map(i => (
                <motion.div key={i}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                  style={{ height: '80px', background: '#fafafa', borderRadius: '16px', border: '1px solid #f0f0f1' }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div key={tab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {current.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: '4rem 1rem', border: '1px solid #e4e4e7', borderRadius: '24px', background: '#fafafa' }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.6 }}>◎</div>
                  <p style={{ color: '#52525b', fontWeight: 600 }}>No {tab} bills</p>
                </motion.div>
              ) : current.map((bill, i) => (
                <BillCard
                  key={bill.id} bill={bill} index={i}
                  userRole={user?.role}
                  onPay={() => handlePay(bill)}
                  paying={paying === bill.id}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {successData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: 'rgba(24,24,27,0.4)',
              backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={() => setSuccessData(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff',
                border: '1px solid #e4e4e7',
                borderRadius: '28px', padding: '2.5rem',
                maxWidth: '380px', width: '100%',
                textAlign: 'center',
                boxShadow: '0 32px 64px rgba(24,24,27,0.18)',
              }}
            >
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 180 }}
                style={{
                  width: '76px', height: '76px', borderRadius: '50%',
                  background: '#eff6ff',
                  border: '2px solid #bfdbfe',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', fontSize: '2rem', color: '#2563eb',
                }}
              >
                ✓
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display"
                style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: '0.4rem', color: '#18181b' }}
              >
                Payment Successful!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '2rem' }}
              >
                Your payment has been confirmed
              </motion.p>

              {/* Amount card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '1.4rem', marginBottom: '1rem' }}
              >
                <p style={{ color: '#a1a1aa', fontSize: '0.7rem', letterSpacing: '0.12em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Amount Paid</p>
                <p className="font-display" style={{ fontWeight: 700, fontSize: '2.2rem', letterSpacing: '-0.03em', color: '#2563eb', marginBottom: '0.4rem' }}>₹{successData.amount}</p>
                <p style={{ color: '#a1a1aa', fontSize: '0.82rem' }}>
                  to <span style={{ color: '#52525b', fontWeight: 600 }}>{successData.name}</span>
                </p>
              </motion.div>

              {/* Invoice number */}
              {successData.invoice && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  style={{ color: '#d4d4d8', fontSize: '0.7rem', marginBottom: '1.5rem', letterSpacing: '0.06em' }}
                >
                  {successData.invoice}
                </motion.p>
              )}

              {/* Done button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSuccessData(null)}
                style={{
                  width: '100%', height: '48px',
                  background: '#2563eb',
                  color: '#fff', border: 'none', borderRadius: '999px',
                  fontWeight: 700, fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BillCard({ bill, userRole, onPay, paying, index }) {
  const isPaid = bill.status === 'paid'
  const isOverdue = bill.status === 'overdue'
  const isPending = bill.status === 'pending'
  const name = userRole === 'student' ? bill.tutor_name : bill.student_name

  const statusColor = isPaid ? '#2563eb' : isOverdue ? '#18181b' : ACCENT
  const bgColor = isPaid ? '#eff6ff' : isOverdue ? '#f4f4f5' : '#eef2ff'
  const borderColor = isPaid ? '#bfdbfe' : isOverdue ? '#d4d4d8' : '#e0e7ff'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(24,24,27,0.08)' }}
      style={{
        background: '#fff',
        border: '1px solid #e4e4e7',
        borderRadius: '16px', padding: '1.2rem 1.4rem',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        boxShadow: '0 1px 2px rgba(24,24,27,0.04)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
          <p style={{ color: '#18181b', fontWeight: 600, fontSize: '0.9rem' }}>{name}</p>
          <span style={{ fontSize: '0.68rem', padding: '2px 10px', borderRadius: '999px', fontWeight: 600, background: bgColor, border: `1px solid ${borderColor}`, color: statusColor }}>
            {isPaid ? '✓ Paid' : isOverdue ? '⚠ Overdue' : '⏳ Pending'}
          </span>
        </div>
        <p style={{ color: '#a1a1aa', fontSize: '0.78rem' }}>
          Due {new Date(bill.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        {bill.invoice_number && (
          <p style={{ color: '#d4d4d8', fontSize: '0.72rem', marginTop: '2px' }}>
            {bill.invoice_number}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: statusColor }}>
          ₹{bill.amount}
        </span>
        {userRole === 'student' && isPending && (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onPay} disabled={paying}
            style={{
              padding: '8px 20px',
              background: paying ? '#e4e4e7' : ACCENT,
              color: paying ? '#a1a1aa' : '#fff',
              border: 'none', borderRadius: '999px',
              fontWeight: 700, cursor: paying ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem', whiteSpace: 'nowrap'
            }}
          >
            {paying ? '...' : 'Pay Now'}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
