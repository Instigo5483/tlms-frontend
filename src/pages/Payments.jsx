import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID

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
        theme: { color: '#a855f7' },
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
      <main style={{ padding: '80px 1.5rem 3rem', maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

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
          }}>Payments</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem' }}>
            {user?.role === 'student' ? 'Your monthly fee bills' : 'Payments from your students'}
          </p>
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
            { label: 'Pending', value: pending.length, gradient: 'linear-gradient(135deg, #a855f7, #06b6d4)' },
            { label: 'Paid', value: paid.length, gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
            { label: 'Overdue', value: overdue.length, gradient: 'linear-gradient(135deg, #f87171, #f97316)' },
          ].map(s => (
            <div key={s.label} style={{ padding: '1.2rem', background: '#050508', textAlign: 'center' }}>
              <div style={{
                fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em',
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
          {[
            { key: 'pending', label: `Pending (${pending.length})` },
            { key: 'paid', label: `Paid (${paid.length})` },
            { key: 'overdue', label: `Overdue (${overdue.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '7px 16px', border: 'none', cursor: 'pointer',
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
              background: tab === t.key
                ? 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(6,182,212,0.25))'
                : 'transparent',
              color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.35)',
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
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                  style={{ height: '80px', background: 'rgba(168,85,247,0.05)', borderRadius: '14px', border: '1px solid rgba(168,85,247,0.1)' }}
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
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>No {tab} bills</p>
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
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
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
                background: '#050508',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '28px', padding: '2.5rem',
                maxWidth: '380px', width: '100%',
                textAlign: 'center', position: 'relative', overflow: 'hidden'
              }}
            >
              {/* Background blob */}
              <div style={{
                position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
                pointerEvents: 'none', filter: 'blur(30px)'
              }} />

              {/* Top glow line */}
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '60%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.8), transparent)'
              }} />

              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 180 }}
                style={{
                  width: '76px', height: '76px', borderRadius: '50%',
                  background: 'rgba(16,185,129,0.12)',
                  border: '2px solid rgba(16,185,129,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', fontSize: '2rem',
                  position: 'relative', zIndex: 1,
                  boxShadow: '0 0 30px rgba(16,185,129,0.2)'
                }}
              >
                ✓
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontWeight: 900, fontSize: '1.5rem',
                  letterSpacing: '-0.02em', marginBottom: '0.4rem',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  position: 'relative', zIndex: 1
                }}
              >
                Payment Successful!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                style={{
                  color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem',
                  marginBottom: '2rem', position: 'relative', zIndex: 1
                }}
              >
                Your payment has been confirmed
              </motion.p>

              {/* Amount card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.15)',
                  borderRadius: '16px', padding: '1.4rem',
                  marginBottom: '1rem', position: 'relative', zIndex: 1
                }}
              >
                <p style={{
                  color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem',
                  letterSpacing: '0.12em', marginBottom: '0.5rem', textTransform: 'uppercase'
                }}>Amount Paid</p>
                <p style={{
                  fontWeight: 900, fontSize: '2.2rem', letterSpacing: '-0.04em',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  marginBottom: '0.4rem'
                }}>₹{successData.amount}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                  to <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{successData.name}</span>
                </p>
              </motion.div>

              {/* Invoice number */}
              {successData.invoice && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  style={{
                    color: 'rgba(255,255,255,0.18)', fontSize: '0.7rem',
                    marginBottom: '1.5rem', position: 'relative', zIndex: 1,
                    letterSpacing: '0.06em'
                  }}
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
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  color: '#fff', border: 'none', borderRadius: '14px',
                  fontWeight: 700, fontSize: '0.95rem',
                  cursor: 'pointer', position: 'relative', zIndex: 1,
                  boxShadow: '0 8px 24px rgba(16,185,129,0.25)'
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

  const statusGradient = isPaid
    ? 'linear-gradient(135deg, #10b981, #06b6d4)'
    : isOverdue
    ? 'linear-gradient(135deg, #f87171, #f97316)'
    : 'linear-gradient(135deg, #a855f7, #06b6d4)'

  const borderColor = isPaid
    ? 'rgba(16,185,129,0.15)'
    : isOverdue
    ? 'rgba(248,113,113,0.15)'
    : 'rgba(168,85,247,0.15)'

  const bgColor = isPaid
    ? 'rgba(16,185,129,0.04)'
    : isOverdue
    ? 'rgba(248,113,113,0.04)'
    : 'rgba(168,85,247,0.04)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '14px', padding: '1.2rem 1.4rem',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: statusGradient, opacity: 0.4
      }} />

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
          <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{name}</p>
          <span style={{
            fontSize: '0.68rem', padding: '2px 10px', borderRadius: '999px', fontWeight: 600,
            background: bgColor, border: `1px solid ${borderColor}`,
            color: isPaid ? '#10b981' : isOverdue ? '#f87171' : '#a855f7'
          }}>
            {isPaid ? '✓ Paid' : isOverdue ? '⚠ Overdue' : '⏳ Pending'}
          </span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
          Due {new Date(bill.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        {bill.invoice_number && (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', marginTop: '2px' }}>
            {bill.invoice_number}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{
          fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em',
          background: statusGradient,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          ₹{bill.amount}
        </span>
        {userRole === 'student' && isPending && (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onPay} disabled={paying}
            style={{
              padding: '8px 20px',
              background: paying ? 'rgba(168,85,247,0.1)' : 'linear-gradient(135deg, #a855f7, #06b6d4)',
              color: paying ? 'rgba(255,255,255,0.3)' : '#fff',
              border: 'none', borderRadius: '10px',
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