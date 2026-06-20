import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const BACKEND = import.meta.env.VITE_BACKEND_URL

const inputStyle = {
  width: '100%', height: '42px', padding: '0 12px',
  border: '1px solid #e4e4e7', borderRadius: '10px',
  fontSize: '0.88rem', outline: 'none',
  boxSizing: 'border-box', color: '#18181b',
  background: '#fafafa',
}

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

  const canSubmit = !submitting && entries.some(e => e.subject.trim())

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
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '460px',
              background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px',
              padding: '1.6rem', boxShadow: '0 24px 64px rgba(24,24,27,0.2)',
              maxHeight: '88vh', overflowY: 'auto', overflowX: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '2.4rem 0' }}
                >
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: '#ecfdf5', border: '1.5px solid #6ee7b7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', margin: '0 auto 14px', color: '#059669',
                  }}>✓</div>
                  <p style={{ fontWeight: 700, color: '#18181b', fontSize: '1rem', margin: '0 0 4px' }}>Request sent!</p>
                  <p style={{ color: '#71717a', fontSize: '0.85rem', margin: 0 }}>We'll review and add it to the list soon.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Header */}
                  <div style={{ marginBottom: '1.2rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.02rem', color: '#18181b', margin: '0 0 4px' }}>
                      Request a Subject
                    </h3>
                    <p style={{ color: '#71717a', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                      Don't see what you need? Tell us — we'll add it.
                    </p>
                  </div>

                  {/* Entry cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                    {entries.map((entry, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: '#f9f9fb', border: '1px solid #e4e4e7',
                          borderRadius: '12px', padding: '12px',
                          position: 'relative',
                        }}
                      >
                        {entries.length > 1 && (
                          <button
                            onClick={() => removeEntry(i)}
                            style={{
                              position: 'absolute', top: '10px', right: '10px',
                              width: '22px', height: '22px', flexShrink: 0,
                              borderRadius: '50%', border: '1px solid #d4d4d8',
                              background: '#fff', cursor: 'pointer',
                              color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              padding: 0,
                            }}
                          >×</button>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div>
                            <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#52525b', display: 'block', marginBottom: '5px' }}>
                              Subject name <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                              value={entry.subject}
                              onChange={e => updateEntry(i, 'subject', e.target.value)}
                              placeholder="e.g. Environmental Science"
                              style={{ ...inputStyle, paddingRight: entries.length > 1 ? '32px' : '12px' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#52525b', display: 'block', marginBottom: '5px' }}>
                              Class / Level <span style={{ color: '#a1a1aa', fontWeight: 400 }}>(optional)</span>
                            </label>
                            <input
                              value={entry.grade}
                              onChange={e => updateEntry(i, 'grade', e.target.value)}
                              placeholder="e.g. Grade 10, A-Level, Beginners…"
                              style={inputStyle}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Add another */}
                  <button
                    onClick={addMore}
                    style={{
                      width: '100%', padding: '9px', marginBottom: '1.2rem',
                      background: 'none', border: '1.5px dashed #d4d4d8', borderRadius: '10px',
                      cursor: 'pointer', color: '#71717a', fontSize: '0.82rem', fontWeight: 500,
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = accentColor }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#d4d4d8'; e.currentTarget.style.color = '#71717a' }}
                  >
                    + Add another subject
                  </button>

                  {/* Footer */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button
                      onClick={onClose}
                      style={{
                        padding: '9px 18px', background: '#f4f4f5', border: '1px solid #e4e4e7',
                        borderRadius: '10px', color: '#52525b', cursor: 'pointer',
                        fontSize: '0.83rem', fontWeight: 500,
                      }}
                    >Cancel</button>
                    <motion.button
                      whileHover={{ scale: canSubmit ? 1.03 : 1 }}
                      whileTap={{ scale: canSubmit ? 0.97 : 1 }}
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      style={{
                        padding: '9px 22px', border: 'none', borderRadius: '10px',
                        background: canSubmit ? accentColor : '#e4e4e7',
                        color: canSubmit ? '#fff' : '#a1a1aa',
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                        fontSize: '0.83rem', fontWeight: 600,
                        transition: 'background 0.15s',
                      }}
                    >{submitting ? 'Sending…' : 'Submit Request'}</motion.button>
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
