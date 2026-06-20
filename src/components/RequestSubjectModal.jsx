import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function RequestSubjectModal({ open, onClose, token, accentColor = '#4f46e5' }) {
  const [entries, setEntries] = useState([{ subject: '', grade: '' }])
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const inFlight = useRef(false)

  useEffect(() => {
    if (open) {
      setEntries([{ subject: '', grade: '' }])
      setDone(false)
      setSubmitting(false)
      inFlight.current = false
    }
  }, [open])

  function updateEntry(i, field, val) {
    setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))
  }

  function addMore() {
    setEntries(prev => [...prev, { subject: '', grade: '' }])
  }

  function removeEntry(i) {
    if (entries.length === 1) return
    setEntries(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit() {
    if (inFlight.current) return
    const valid = entries.filter(e => e.subject.trim())
    if (!valid.length) return
    inFlight.current = true
    setSubmitting(true)
    try {
      await fetch(`${BACKEND}/api/subject-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ entries: valid })
      })
      setDone(true)
      setTimeout(onClose, 2000)
    } catch {}
    finally { setSubmitting(false); inFlight.current = false }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="req-sub-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 1100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', background: 'rgba(24,24,27,0.45)', backdropFilter: 'blur(6px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '480px',
              background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px',
              padding: '1.8rem', boxShadow: '0 24px 60px rgba(24,24,27,0.18)',
              maxHeight: '88vh', overflowY: 'auto',
            }}
          >
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '2.4rem 0' }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: '#ecfdf5', border: '1px solid #a7f3d0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', margin: '0 auto 14px',
                  }}>✓</div>
                  <p style={{ fontWeight: 700, color: '#18181b', fontSize: '1rem', marginBottom: '4px' }}>Request sent!</p>
                  <p style={{ color: '#71717a', fontSize: '0.85rem' }}>We'll review and add it to the list soon.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#18181b', marginBottom: '0.25rem' }}>
                    Request a Subject
                  </h3>
                  <p style={{ color: '#71717a', fontSize: '0.83rem', marginBottom: '1.4rem' }}>
                    Don't see what you need? Tell us the subject name and class level — we'll add it.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                    {entries.map((entry, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          value={entry.subject}
                          onChange={e => updateEntry(i, 'subject', e.target.value)}
                          placeholder="Subject name *"
                          style={{
                            flex: 1, height: '40px', padding: '0 12px',
                            border: '1px solid #e4e4e7', borderRadius: '8px',
                            fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
                          }}
                        />
                        <input
                          value={entry.grade}
                          onChange={e => updateEntry(i, 'grade', e.target.value)}
                          placeholder="Class / Level (optional)"
                          style={{
                            flex: 1, height: '40px', padding: '0 12px',
                            border: '1px solid #e4e4e7', borderRadius: '8px',
                            fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
                          }}
                        />
                        {entries.length > 1 && (
                          <button
                            onClick={() => removeEntry(i)}
                            style={{
                              width: '28px', height: '28px', flexShrink: 0,
                              borderRadius: '50%', border: '1px solid #e4e4e7',
                              background: '#f4f4f5', cursor: 'pointer',
                              color: '#71717a', fontSize: '1rem', lineHeight: 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >×</button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addMore}
                    style={{
                      width: '100%', padding: '8px', marginBottom: '1.4rem',
                      background: 'none', border: '1px dashed #d4d4d8', borderRadius: '8px',
                      cursor: 'pointer', color: '#71717a', fontSize: '0.82rem', fontWeight: 500,
                    }}
                  >
                    + Add another
                  </button>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={onClose}
                      style={{
                        padding: '8px 18px', background: '#f4f4f5', border: '1px solid #e4e4e7',
                        borderRadius: '10px', color: '#52525b', cursor: 'pointer',
                        fontSize: '0.83rem', fontWeight: 500,
                      }}
                    >Cancel</button>
                    <motion.button
                      whileHover={{ scale: submitting ? 1 : 1.03 }}
                      whileTap={{ scale: submitting ? 1 : 0.97 }}
                      onClick={handleSubmit}
                      disabled={submitting || !entries.some(e => e.subject.trim())}
                      style={{
                        padding: '8px 22px', border: 'none', borderRadius: '10px',
                        background: (submitting || !entries.some(e => e.subject.trim())) ? '#e4e4e7' : accentColor,
                        color: (submitting || !entries.some(e => e.subject.trim())) ? '#a1a1aa' : '#fff',
                        cursor: (submitting || !entries.some(e => e.subject.trim())) ? 'not-allowed' : 'pointer',
                        fontSize: '0.83rem', fontWeight: 600,
                      }}
                    >{submitting ? 'Sending...' : 'Submit Request'}</motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
