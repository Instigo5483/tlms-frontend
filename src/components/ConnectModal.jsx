import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const ALL_SUBJECTS = [
  'Accountancy','Arts / Drawing','Bengali','Biology','Business Studies','Chemistry',
  'Computer Science','Economics','English','Geography','Gujarati','Hindi','History',
  'Kannada','Malayalam','Marathi','Mathematics','Music','Physical Education',
  'Physics','Political Science','Punjabi','Sanskrit','Social Science',
  'Tamil','Telugu','Urdu',
]

const ALL_GRADES = [
  'Nursery','LKG','UKG',
  'Class 1','Class 2','Class 3','Class 4','Class 5',
  'Class 6','Class 7','Class 8','Class 9','Class 10',
  'Class 11','Class 12',
  'JEE','NEET','UPSC','APSC','WBJEE','CEE',
]

export default function ConnectModal({ open, tutorName, tutorSubjects, tutorGrades, isCenter, onConfirm, onCancel, accentColor = '#4f46e5' }) {
  const [subjects, setSubjects] = useState([])
  const [grade, setGrade] = useState('')
  const [sending, setSending] = useState(false)
  const inFlight = useRef(false)

  useEffect(() => {
    if (open) { setSubjects([]); setGrade(''); setSending(false); inFlight.current = false }
  }, [open])

  const subjectOptions = tutorSubjects?.length > 0 ? tutorSubjects : ALL_SUBJECTS
  const gradeOptions = tutorGrades?.length > 0 ? tutorGrades : ALL_GRADES

  function toggleSubject(sub) {
    setSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub])
  }

  async function handleSend() {
    if (inFlight.current) return
    inFlight.current = true
    setSending(true)
    try {
      await onConfirm({ subjects, grade })
    } finally {
      inFlight.current = false
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="connect-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
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
              width: '100%', maxWidth: '440px',
              background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px',
              padding: '1.8rem', boxShadow: '0 24px 60px rgba(24,24,27,0.18)',
              maxHeight: '88vh', overflowY: 'auto',
            }}
          >
            <h3 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.98rem', letterSpacing: '-0.01em', marginBottom: '0.2rem' }}>
              {isCenter ? 'Enroll' : 'Connect'} with {tutorName}
            </h3>
            <p style={{ color: '#71717a', fontSize: '0.83rem', marginBottom: '1.6rem' }}>
              Select what you want to study — this helps {tutorName} prepare for you.
            </p>

            {/* Class */}
            <div style={{ marginBottom: '1.4rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#52525b', letterSpacing: '0.04em', marginBottom: '8px' }}>
                YOUR CLASS <span style={{ fontWeight: 400, color: '#a1a1aa' }}>· optional</span>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {gradeOptions.map(opt => {
                  const sel = grade === opt
                  return (
                    <button key={opt} onClick={() => setGrade(sel ? '' : opt)} style={{
                      padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                      cursor: 'pointer', border: 'none', transition: 'all 0.12s',
                      background: sel ? accentColor : `${accentColor}10`,
                      color: sel ? '#fff' : accentColor,
                      outline: sel ? 'none' : `1px solid ${accentColor}30`,
                    }}>{opt}</button>
                  )
                })}
              </div>
            </div>

            {/* Subjects */}
            <div style={{ marginBottom: '1.6rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#52525b', letterSpacing: '0.04em', marginBottom: '8px' }}>
                SUBJECTS NEEDED <span style={{ fontWeight: 400, color: '#a1a1aa' }}>· optional, multiple</span>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {subjectOptions.map(sub => {
                  const sel = subjects.includes(sub)
                  return (
                    <button key={sub} onClick={() => toggleSubject(sub)} style={{
                      padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                      cursor: 'pointer', border: 'none', transition: 'all 0.12s',
                      background: sel ? accentColor : `${accentColor}10`,
                      color: sel ? '#fff' : accentColor,
                      outline: sel ? 'none' : `1px solid ${accentColor}30`,
                    }}>{sub}</button>
                  )
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={onCancel}
                style={{ padding: '8px 18px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '10px', color: '#52525b', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 500 }}
              >Cancel</button>
              <motion.button
                whileHover={{ scale: sending ? 1 : 1.03 }} whileTap={{ scale: sending ? 1 : 0.97 }}
                onClick={handleSend}
                disabled={sending}
                style={{
                  padding: '8px 22px', background: sending ? '#e4e4e7' : accentColor, border: 'none',
                  borderRadius: '10px', color: sending ? '#a1a1aa' : '#fff',
                  cursor: sending ? 'not-allowed' : 'pointer', fontSize: '0.83rem', fontWeight: 600,
                }}
              >{sending ? 'Sending...' : isCenter ? 'Send Enrollment' : 'Send Request'}</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
