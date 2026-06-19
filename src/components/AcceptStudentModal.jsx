import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const CLASS_OPTIONS = [
  'Nursery','LKG','UKG',
  'Class 1','Class 2','Class 3','Class 4','Class 5',
  'Class 6','Class 7','Class 8','Class 9','Class 10',
  'Class 11','Class 12',
  'JEE','NEET','UPSC','APSC','WBJEE','CEE',
]

const SUBJECT_OPTIONS = [
  'Accountancy','Arts / Drawing','Bengali','Biology','Business Studies','Chemistry',
  'Computer Science','Economics','English','Geography','Gujarati','Hindi','History',
  'Kannada','Malayalam','Marathi','Mathematics','Music','Physical Education',
  'Physics','Political Science','Punjabi','Sanskrit','Social Science',
  'Tamil','Telugu','Urdu',
]

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`
}

function dayOrdinal(n) {
  const s = ['th','st','nd','rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export default function AcceptStudentModal({
  open, studentName, studentSubjects, studentGrades, onConfirm, onCancel, accentColor = '#4f46e5'
}) {
  const [fee, setFee] = useState('')
  const [startDate, setStartDate] = useState(todayISO())
  const [tagClass, setTagClass] = useState('')
  const [tagSubjects, setTagSubjects] = useState([])

  useEffect(() => {
    if (open) {
      setFee('')
      setStartDate(todayISO())
      setTagClass(studentGrades?.[0] || '')
      setTagSubjects(studentSubjects || [])
    }
  }, [open])

  const day = startDate ? parseInt(startDate.split('-')[2], 10) : null

  function toggleSubject(sub) {
    setTagSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub])
  }

  function handleConfirm() {
    if (!fee || Number(fee) < 0) return
    if (!startDate) return
    onConfirm({ fee: Number(fee), startDate, tagClass, tagSubjects })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="accept-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(24,24,27,0.4)',
            backdropFilter: 'blur(6px)',
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
              background: '#fff',
              border: '1px solid #e4e4e7',
              borderRadius: '20px',
              padding: '1.8rem',
              boxShadow: '0 24px 60px rgba(24,24,27,0.18)',
            }}
          >
            <h3 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.98rem', letterSpacing: '-0.01em', marginBottom: '0.3rem' }}>
              Accept Student
            </h3>
            {studentName && (
              <p style={{ color: '#71717a', fontSize: '0.83rem', marginBottom: '1.4rem' }}>
                Setting up billing for <strong style={{ color: '#18181b' }}>{studentName}</strong>
              </p>
            )}

            {/* Monthly fee */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#71717a', marginBottom: '7px' }}>
                Monthly Fee
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  position: 'absolute', left: '13px', zIndex: 1,
                  color: '#71717a', fontSize: '1rem', fontWeight: 700, pointerEvents: 'none'
                }}>₹</span>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={fee}
                  onChange={e => setFee(e.target.value)}
                  autoFocus
                  min={0}
                  style={{
                    width: '100%', height: '48px',
                    paddingLeft: '28px', paddingRight: '14px',
                    fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em',
                    border: '1px solid #e4e4e7', borderRadius: '10px',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <p style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '5px' }}>
                Set to 0 for free enrollment — no bills will be generated.
              </p>
            </div>

            {/* Payment start date */}
            {Number(fee) > 0 && (
              <div style={{ marginBottom: '1.4rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#71717a', marginBottom: '7px' }}>
                  Payment Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={todayISO()}
                  onChange={e => setStartDate(e.target.value)}
                  style={{
                    width: '100%', height: '48px',
                    padding: '0 14px',
                    fontSize: '0.9rem', fontWeight: 500,
                    border: '1px solid #e4e4e7', borderRadius: '10px',
                    outline: 'none', boxSizing: 'border-box',
                    color: '#18181b', background: '#fff',
                    cursor: 'pointer',
                  }}
                />
                {day && (
                  <div style={{
                    marginTop: '10px', padding: '10px 13px',
                    background: `${accentColor}0d`,
                    border: `1px solid ${accentColor}22`,
                    borderRadius: '10px', fontSize: '0.78rem', color: '#3f3f46', lineHeight: 1.55,
                  }}>
                    <span style={{ fontWeight: 700, color: accentColor }}>First bill:</span> {formatDate(startDate)}<br />
                    <span style={{ fontWeight: 700, color: accentColor }}>Recurring:</span> every month on the <strong>{dayOrdinal(day)}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            <div style={{ marginBottom: '1.4rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#71717a', letterSpacing: '0.05em', marginBottom: '6px' }}>
                CLASS TAG <span style={{ fontWeight: 400, color: '#a1a1aa' }}>· optional</span>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                {CLASS_OPTIONS.map(opt => {
                  const sel = tagClass === opt
                  return (
                    <button key={opt} onClick={() => setTagClass(sel ? '' : opt)} style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
                      cursor: 'pointer', border: 'none',
                      background: sel ? '#2563eb' : '#eff6ff', color: sel ? '#fff' : '#2563eb',
                      outline: sel ? 'none' : '1px solid #bfdbfe',
                    }}>{opt}</button>
                  )
                })}
              </div>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#71717a', letterSpacing: '0.05em', marginBottom: '6px' }}>
                SUBJECT TAGS <span style={{ fontWeight: 400, color: '#a1a1aa' }}>· optional, multiple</span>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {SUBJECT_OPTIONS.map(sub => {
                  const sel = tagSubjects.includes(sub)
                  return (
                    <button key={sub} onClick={() => toggleSubject(sub)} style={{
                      padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
                      cursor: 'pointer', border: 'none',
                      background: sel ? '#059669' : '#ecfdf5', color: sel ? '#fff' : '#059669',
                      outline: sel ? 'none' : '1px solid #a7f3d0',
                    }}>{sub}</button>
                  )
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={onCancel}
                style={{
                  padding: '8px 18px',
                  background: '#f4f4f5', border: '1px solid #e4e4e7',
                  borderRadius: '10px', color: '#52525b',
                  cursor: 'pointer', fontSize: '0.83rem', fontWeight: 500,
                }}
              >Cancel</button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirm}
                disabled={!fee || (Number(fee) > 0 && !startDate)}
                style={{
                  padding: '8px 22px',
                  background: accentColor, border: 'none',
                  borderRadius: '10px', color: '#fff',
                  cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600,
                  opacity: (!fee || (Number(fee) > 0 && !startDate)) ? 0.5 : 1,
                }}
              >Accept Student</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
