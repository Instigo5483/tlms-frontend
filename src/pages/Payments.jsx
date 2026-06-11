import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID

export default function Payments() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(null)
  const [tab, setTab] = useState('pending')

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
            alert(`✅ Payment successful!\nInvoice: ${verifyData.invoice_number}`)
            loadBills()
          } else {
            alert('Payment verification failed.')
          }
        },
        prefill: { email: user.email, name: user.full_name },
        theme: { color: '#1a73e8' },
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
            Payments & Bills
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {user?.role === 'student' ? 'Your monthly fee bills' : 'Payments from your students'}
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem', marginBottom: '2rem'
        }}>
          {[
            { label: 'Pending', value: pending.length, color: '#fbbf24', bg: 'rgba(234,179,8,0.1)' },
            { label: 'Paid', value: paid.length, color: '#34d399', bg: 'rgba(29,158,117,0.1)' },
            { label: 'Overdue', value: overdue.length, color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, border: `1px solid ${s.color}30`,
              borderRadius: '12px', padding: '1.2rem', textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '1.5rem',
          background: 'rgba(255,255,255,0.04)',
          padding: '4px', borderRadius: '10px', width: 'fit-content'
        }}>
          {[
            { key: 'pending', label: `Pending (${pending.length})` },
            { key: 'paid', label: `Paid (${paid.length})` },
            { key: 'overdue', label: `Overdue (${overdue.length})` },
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

        {/* Bill list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(tab === 'pending' ? pending : tab === 'paid' ? paid : overdue).length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '4rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>
                  {tab === 'pending' ? '🧾' : tab === 'paid' ? '✅' : '⚠️'}
                </div>
                <p style={{ color: '#64748b' }}>
                  No {tab} bills
                </p>
              </div>
            ) : (tab === 'pending' ? pending : tab === 'paid' ? paid : overdue).map(bill => (
              <BillCard
                key={bill.id}
                bill={bill}
                userRole={user?.role}
                onPay={() => handlePay(bill)}
                paying={paying === bill.id}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

function BillCard({ bill, userRole, onPay, paying }) {
  const isPending = bill.status === 'pending'
  const isPaid = bill.status === 'paid'
  const isOverdue = bill.status === 'overdue'

  const statusColor = isPaid ? '#34d399' : isOverdue ? '#f87171' : '#fbbf24'
  const statusBg = isPaid ? 'rgba(29,158,117,0.1)' : isOverdue ? 'rgba(248,113,113,0.1)' : 'rgba(234,179,8,0.1)'
  const statusLabel = isPaid ? '✓ Paid' : isOverdue ? '⚠ Overdue' : '⏳ Pending'

  const name = userRole === 'student' ? bill.tutor_name : bill.student_name

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${isPaid ? 'rgba(29,158,117,0.2)' : isOverdue ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: '14px', padding: '1.4rem',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem' }}>{name}</p>
          <span style={{
            fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px',
            background: statusBg, color: statusColor, fontWeight: 600
          }}>{statusLabel}</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.82rem' }}>
          Due: {new Date(bill.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        {bill.invoice_number && (
          <p style={{ color: '#475569', fontSize: '0.78rem', marginTop: '3px' }}>
            Invoice: {bill.invoice_number}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: '1.2rem' }}>
          ₹{bill.amount}
        </span>
        {userRole === 'student' && isPending && (
          <button onClick={onPay} disabled={paying} style={{
            padding: '10px 24px', background: '#1a73e8',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontWeight: 700, cursor: paying ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem', opacity: paying ? 0.7 : 1
          }}>
            {paying ? 'Opening...' : 'Pay Now'}
          </button>
        )}
      </div>
    </div>
  )
}