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

export default function EditTagsModal({ open, student, onConfirm, onCancel, accentColor = '#4f46e5' }) {
  const [tagClass, setTagClass] = useState('')
  const [tagSubjects, setTagSubjects] = useState([])

  useEffect(() => {
    if (open && student) {
      setTagClass(student.tag_class || '')
      setTagSubjects(student.tag_subjects || [])
    }
  }, [open, student?.id])

  if (!student) return null

  function toggleSubject(sub) {
    setTagSubjects(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    )
  }

  const chipBase = {
    padding: '4px 11px', borderRadius: '999px', fontSize: '0.75rem',
    fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.15s',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="tags-overlay"
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
              width: '100%', maxWidth: '460px',
              background: '#fff', border: '1px solid #e4e4e7', borderRadius: '20px',
              padding: '1.8rem', boxShadow: '0 24px 60px rgba(24,24,27,0.18)',
              maxHeight: '85vh', overflowY: 'auto',
            }}
          >
            <h3 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.98rem', letterSpacing: '-0.01em', marginBottom: '0.2rem' }}>
              Assign Tags
            </h3>
            <p style={{ color: '#71717a', fontSize: '0.83rem', marginBottom: '1.5rem' }}>
              Tagging <strong style={{ color: '#18181b' }}>{student.full_name}</strong>
            </p>

            {/* Class tag */}
            <div style={{ marginBottom: '1.4rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#71717a', letterSpacing: '0.05em', marginBottom: '8px' }}>
                CLASS TAG <span style={{ color: '#a1a1aa', fontWeight: 400 }}>· pick one</span>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {CLASS_OPTIONS.map(opt => {
                  const selected = tagClass === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => setTagClass(selected ? '' : opt)}
                      style={{
                        ...chipBase,
                        background: selected ? '#2563eb' : '#eff6ff',
                        color: selected ? '#fff' : '#2563eb',
                        outline: selected ? 'none' : '1px solid #bfdbfe',
                      }}
                    >{opt}</button>
                  )
                })}
              </div>
            </div>

            {/* Subject tags */}
            <div style={{ marginBottom: '1.6rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#71717a', letterSpacing: '0.05em', marginBottom: '8px' }}>
                SUBJECT TAGS <span style={{ color: '#a1a1aa', fontWeight: 400 }}>· pick multiple</span>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SUBJECT_OPTIONS.map(sub => {
                  const selected = tagSubjects.includes(sub)
                  return (
                    <button
                      key={sub}
                      onClick={() => toggleSubject(sub)}
                      style={{
                        ...chipBase,
                        background: selected ? '#059669' : '#ecfdf5',
                        color: selected ? '#fff' : '#059669',
                        outline: selected ? 'none' : '1px solid #a7f3d0',
                      }}
                    >{sub}</button>
                  )
                })}
              </div>
            </div>

            {/* Preview */}
            {(tagClass || tagSubjects.length > 0) && (
              <div style={{
                marginBottom: '1.4rem', padding: '10px 13px',
                background: '#fafafa', border: '1px solid #e4e4e7',
                borderRadius: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.7rem', color: '#a1a1aa', marginRight: '2px' }}>Preview:</span>
                {tagClass && (
                  <span style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: '999px' }}>{tagClass}</span>
                )}
                {tagSubjects.map(s => (
                  <span key={s} style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontSize: '0.72rem', fontWeight: 700, padding: '2px 9px', borderRadius: '999px' }}>{s}</span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={onCancel}
                style={{ padding: '8px 18px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '10px', color: '#52525b', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 500 }}
              >Cancel</button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => onConfirm({ tagClass, tagSubjects })}
                style={{ padding: '8px 22px', background: accentColor, border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600 }}
              >Save Tags</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
