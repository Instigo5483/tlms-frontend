import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

function dayOrdinal(n) {
  const s = ['th','st','nd','rd'], v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export default function EditFeeModal({ open, student, onConfirm, onCancel, accentColor = '#4f46e5' }) {
  const [fee, setFee] = useState('')
  const [feeDay, setFeeDay] = useState(1)
  const [applyFrom, setApplyFrom] = useState('next')

  useEffect(() => {
    if (open && student) {
      setFee(student.monthly_fee != null ? String(student.monthly_fee) : '')
      setFeeDay(student.fee_day || 1)
      setApplyFrom('next')
    }
  }, [open, student?.id])

  if (!student) return null

  const numFee = Number(fee)
  const numDay = Math.min(Math.max(Number(feeDay) || 1, 1), 28)
  const canSave = fee !== '' && numFee >= 0 && numDay >= 1

  const inputStyle = {
    width: '100%', height: '48px', padding: '0 14px',
    fontSize: '0.95rem', fontWeight: 500,
    border: '1px solid #e4e4e7', borderRadius: '10px',
    outline: 'none', boxSizing: 'border-box', color: '#18181b', background: '#fff',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="fee-edit-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
          style={{
            position: 'fixed', inset: 0, zIndex: 1001,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(6px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '400px',
              background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px',
              padding: '1.8rem', boxShadow: '0 24px 60px rgba(24,24,27,0.18)',
            }}
          >
            <h3 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.98rem', letterSpacing: '-0.01em', marginBottom: '0.2rem' }}>
              Update Fee
            </h3>
            <p style={{ color: '#71717a', fontSize: '0.83rem', marginBottom: '1.5rem' }}>
              Editing billing for <strong style={{ color: '#18181b' }}>{student.full_name}</strong>
            </p>

            {/* Monthly fee */}
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#71717a', marginBottom: '7px' }}>
                Monthly Fee
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '13px', zIndex: 1, color: '#71717a', fontSize: '1rem', fontWeight: 700, pointerEvents: 'none' }}>₹</span>
                <input
                  type="number" min={0} value={fee}
                  onChange={e => setFee(e.target.value)}
                  placeholder="e.g. 2000"
                  autoFocus
                  style={{ ...inputStyle, paddingLeft: '28px', fontSize: '1.1rem', fontWeight: 700 }}
                />
              </div>
              {numFee === 0 && fee !== '' && (
                <p style={{ fontSize: '0.72rem', color: '#f97316', marginTop: '5px' }}>
                  Setting fee to ₹0 will cancel any pending bills for this student.
                </p>
              )}
            </div>

            {/* Billing day */}
            {numFee > 0 && (
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#71717a', marginBottom: '7px' }}>
                  Billing Day of Month <span style={{ color: '#a1a1aa', fontWeight: 400 }}>(1–28)</span>
                </label>
                <input
                  type="number" min={1} max={28} value={feeDay}
                  onChange={e => setFeeDay(e.target.value)}
                  style={inputStyle}
                />
                <p style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '5px' }}>
                  Bill will be generated on the {dayOrdinal(numDay)} of each month.
                </p>
              </div>
            )}

            {/* Apply from */}
            {numFee > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#71717a', marginBottom: '10px' }}>
                  Apply Changes From
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { value: 'current', label: 'This month', desc: 'Replaces the current pending bill. If already paid, changes take effect next month.' },
                    { value: 'next',    label: 'Next month', desc: 'Keeps this month unchanged — new fee starts from next billing cycle.' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      onClick={() => setApplyFrom(opt.value)}
                      style={{
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                        padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                        border: `1.5px solid ${applyFrom === opt.value ? accentColor : '#e4e4e7'}`,
                        background: applyFrom === opt.value ? `${accentColor}08` : '#fff',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                        border: `2px solid ${applyFrom === opt.value ? accentColor : '#d4d4d8'}`,
                        background: applyFrom === opt.value ? accentColor : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {applyFrom === opt.value && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#18181b', marginBottom: '2px' }}>{opt.label}</p>
                        <p style={{ fontSize: '0.74rem', color: '#71717a', lineHeight: 1.45 }}>{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={onCancel}
                style={{ padding: '8px 18px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '10px', color: '#52525b', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 500 }}
              >Cancel</button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => canSave && onConfirm({ fee: numFee, feeDay: numDay, applyFrom })}
                disabled={!canSave}
                style={{
                  padding: '8px 22px', background: accentColor, border: 'none',
                  borderRadius: '10px', color: '#fff', cursor: canSave ? 'pointer' : 'default',
                  fontSize: '0.83rem', fontWeight: 600, opacity: canSave ? 1 : 0.5,
                }}
              >Save Changes</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
