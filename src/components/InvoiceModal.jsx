import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL

function buildInvoiceHTML(inv) {
  const paidDate = new Date(inv.paid_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const dueDate = new Date(inv.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Invoice ${inv.invoice_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #18181b; }
  .page { max-width: 700px; margin: 40px auto; padding: 48px; border: 1px solid #e4e4e7; border-radius: 16px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
  .brand { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.04em; color: #18181b; }
  .brand-sub { font-size: 0.78rem; color: #a1a1aa; margin-top: 3px; }
  .invoice-label { text-align: right; }
  .invoice-label h2 { font-size: 1.4rem; font-weight: 700; letter-spacing: -0.02em; color: #2563eb; }
  .invoice-label p { font-size: 0.8rem; color: #71717a; margin-top: 4px; }
  .divider { border: none; border-top: 1px solid #e4e4e7; margin: 0 0 32px; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .party label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; color: #a1a1aa; text-transform: uppercase; margin-bottom: 10px; display: block; }
  .party p { font-size: 0.88rem; color: #18181b; margin-bottom: 3px; }
  .party p.name { font-weight: 700; font-size: 0.95rem; }
  .party p.light { color: #71717a; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead th { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #a1a1aa; padding: 10px 12px; border-bottom: 1px solid #e4e4e7; text-align: left; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 16px 12px; font-size: 0.88rem; color: #18181b; border-bottom: 1px solid #f4f4f5; vertical-align: top; }
  tbody td:last-child { text-align: right; font-weight: 700; }
  .sub-text { font-size: 0.75rem; color: #a1a1aa; margin-top: 4px; }
  .total-row { display: flex; justify-content: flex-end; gap: 48px; align-items: center; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px 20px; margin-bottom: 32px; }
  .total-row span { font-size: 0.82rem; color: #6b7280; }
  .total-row strong { font-size: 1.2rem; font-weight: 800; letter-spacing: -0.02em; color: #2563eb; }
  .meta { background: #fafafa; border: 1px solid #f0f0f1; border-radius: 10px; padding: 16px 20px; margin-bottom: 40px; font-size: 0.78rem; color: #71717a; display: flex; flex-direction: column; gap: 6px; }
  .meta strong { color: #52525b; }
  .footer { text-align: center; font-size: 0.72rem; color: #d4d4d8; border-top: 1px solid #f4f4f5; padding-top: 24px; line-height: 1.7; }
  @media print {
    body { background: #fff; }
    .page { border: none; border-radius: 0; margin: 0; max-width: 100%; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div>
      <div class="brand">TLMS</div>
      <div class="brand-sub">The Learning Management System</div>
    </div>
    <div class="invoice-label">
      <h2>INVOICE</h2>
      <p>${inv.invoice_number}</p>
      <p style="margin-top:6px">Paid on ${paidDate}</p>
    </div>
  </div>

  <hr class="divider"/>

  <div class="parties">
    <div class="party">
      <label>Billed To</label>
      <p class="name">${inv.student_name}</p>
      <p class="light">${inv.student_email}</p>
      ${inv.student_phone ? `<p class="light">${inv.student_phone}</p>` : ''}
    </div>
    <div class="party">
      <label>Service Provider</label>
      <p class="name">${inv.tutor_name}</p>
      ${inv.tutor_phone ? `<p class="light">${inv.tutor_phone}</p>` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          Monthly Tuition Fee
          <p class="sub-text">Due date: ${dueDate}</p>
        </td>
        <td>₹${Number(inv.amount).toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <div class="total-row">
    <span>Total Paid</span>
    <strong>₹${Number(inv.amount).toFixed(2)}</strong>
  </div>

  <div class="meta">
    <div><strong>Payment ID:</strong> ${inv.razorpay_payment_id || '—'}</div>
    <div><strong>Payment Method:</strong> Razorpay (Online)</div>
    <div><strong>Status:</strong> Paid ✓</div>
  </div>

  <div class="footer">
    This is a computer-generated invoice and does not require a signature.<br/>
    Generated by TLMS · tlms.website
  </div>
</div>
<script>
  window.onload = function() {
    if (window.location.search.includes('print=1')) {
      window.print();
    }
  }
</script>
</body>
</html>`
}

export default function InvoiceModal({ billId, onClose }) {
  const { token } = useAuth()
  const [inv, setInv] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${BACKEND}/api/bills/${billId}/invoice`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setInv(data)
      })
      .catch(() => setError('Could not load invoice'))
      .finally(() => setLoading(false))
  }, [billId])

  function openPrint(autoprint = false) {
    const html = buildInvoiceHTML(inv)
    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    if (autoprint) {
      // slight delay to let styles render before print dialog
      setTimeout(() => win.print(), 400)
    }
  }

  const paidDate = inv ? new Date(inv.paid_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  const dueDate = inv ? new Date(inv.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(24,24,27,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '24px', padding: '2rem', maxWidth: '520px', width: '100%', boxShadow: '0 32px 64px rgba(24,24,27,0.18)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Modal header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#18181b' }}>Invoice</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', fontSize: '1.2rem', lineHeight: 1 }}>✕</button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
              Loading invoice...
            </motion.div>
          </div>
        ) : error ? (
          <p style={{ color: '#71717a', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>{error}</p>
        ) : (
          <>
            {/* Invoice preview */}
            <div style={{ border: '1px solid #e4e4e7', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.2rem', background: '#fafafa' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.03em', color: '#18181b' }}>TLMS</div>
                  <div style={{ fontSize: '0.7rem', color: '#a1a1aa', marginTop: '2px' }}>The Learning Management System</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#2563eb', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Invoice</div>
                  <div style={{ fontSize: '0.68rem', color: '#a1a1aa', marginTop: '3px' }}>{inv.invoice_number}</div>
                </div>
              </div>

              <div style={{ height: '1px', background: '#e4e4e7', marginBottom: '1rem' }} />

              {/* Parties */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                {[
                  { label: 'Billed To', name: inv.student_name, sub: inv.student_email },
                  { label: 'From', name: inv.tutor_name, sub: inv.tutor_phone || null },
                ].map(p => (
                  <div key={p.label}>
                    <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>{p.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#18181b' }}>{p.name}</div>
                    {p.sub && <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '2px' }}>{p.sub}</div>}
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: '#e4e4e7', marginBottom: '1rem' }} />

              {/* Line item */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#18181b' }}>Monthly Tuition Fee</div>
                  <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '2px' }}>Due date: {dueDate}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#18181b' }}>₹{Number(inv.amount).toFixed(2)}</div>
              </div>

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 16px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#52525b' }}>Total Paid</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563eb', letterSpacing: '-0.02em' }}>₹{Number(inv.amount).toFixed(2)}</span>
              </div>

              {/* Payment meta */}
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span>Payment ID: <span style={{ color: '#71717a', fontWeight: 600 }}>{inv.razorpay_payment_id || '—'}</span></span>
                <span>Paid on: <span style={{ color: '#71717a', fontWeight: 600 }}>{paidDate}</span></span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => openPrint(false)}
                style={{ flex: 1, height: '44px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem', color: '#18181b', cursor: 'pointer' }}
              >
                View Full Invoice
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => openPrint(true)}
                style={{ flex: 1, height: '44px', background: '#2563eb', border: 'none', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem', color: '#fff', cursor: 'pointer' }}
              >
                Download PDF
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
