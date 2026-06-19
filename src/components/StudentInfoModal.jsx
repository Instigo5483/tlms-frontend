import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

function dayOrdinal(n) {
  const s = ['th','st','nd','rd'], v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export default function StudentInfoModal({ open, student, onClose, onAccept, onDecline, onRemove, onEdit, accentColor = '#4f46e5' }) {
  const [avatarError, setAvatarError] = useState(false)
  useEffect(() => setAvatarError(false), [student?.id])

  if (!student) return null
  const isPending = student.status === 'pending'
  const isAccepted = student.status === 'accepted'
  const initials = student.full_name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(6px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '420px',
              background: '#fff', border: '1px solid #e4e4e7', borderRadius: '24px',
              padding: '1.8rem', boxShadow: '0 32px 64px rgba(24,24,27,0.18)',
              maxHeight: '85vh', overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.2rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                background: `${accentColor}12`, border: `1px solid ${accentColor}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1rem', color: accentColor, overflow: 'hidden',
              }}>
                {student.avatar_url && !avatarError
                  ? <img
                      src={student.avatar_url}
                      alt=""
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  : initials}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#18181b' }}>{student.full_name || 'Student'}</div>
                <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{student.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.4rem' }}>
              {student.bio && (
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#a1a1aa', letterSpacing: '0.06em', marginBottom: '4px' }}>ABOUT</p>
                  <p style={{ fontSize: '0.88rem', color: '#3f3f46', lineHeight: 1.6 }}>{student.bio}</p>
                </div>
              )}

              {student.student_grades?.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#a1a1aa', letterSpacing: '0.06em', marginBottom: '4px' }}>CLASS</p>
                  <p style={{ fontSize: '0.88rem', color: '#3f3f46' }}>{student.student_grades.join(', ')}</p>
                </div>
              )}

              {student.student_subjects?.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#a1a1aa', letterSpacing: '0.06em', marginBottom: '6px' }}>NEEDS HELP WITH</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {student.student_subjects.map(s => (
                      <span key={s} style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}28`, color: accentColor, fontSize: '0.78rem', padding: '3px 10px', borderRadius: '6px' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {student.phone && (
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#a1a1aa', letterSpacing: '0.06em', marginBottom: '4px' }}>PHONE</p>
                  <p style={{ fontSize: '0.88rem', color: '#3f3f46' }}>{student.phone}</p>
                </div>
              )}

              {(student.district || student.state) && (
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#a1a1aa', letterSpacing: '0.06em', marginBottom: '4px' }}>LOCATION</p>
                  <p style={{ fontSize: '0.88rem', color: '#3f3f46' }}>
                    {[student.area, student.district, student.state, student.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {isAccepted && student.monthly_fee > 0 && (
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#a1a1aa', letterSpacing: '0.06em', marginBottom: '4px' }}>FEE</p>
                  <p style={{ fontSize: '0.88rem', color: accentColor, fontWeight: 700 }}>₹{student.monthly_fee}/month · billed on the {dayOrdinal(student.fee_day || 1)} each month</p>
                </div>
              )}
            </div>

            {/* Tags display */}
            {isAccepted && (student.tag_class || student.tag_subjects?.length > 0) && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#a1a1aa', letterSpacing: '0.06em', marginBottom: '6px' }}>TAGS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {student.tag_class && (
                    <span style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>{student.tag_class}</span>
                  )}
                  {student.tag_subjects?.map(s => (
                    <span key={s} style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {isPending && (
                <>
                  <button onClick={() => onDecline(student.id)} style={{ padding: '9px 18px', background: '#f4f4f5', border: '1px solid #d4d4d8', borderRadius: '999px', color: '#18181b', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Decline</button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => onAccept(student.id)} style={{ padding: '9px 20px', background: accentColor, border: 'none', borderRadius: '999px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>Accept</motion.button>
                </>
              )}
              {isAccepted && (
                <>
                  <button onClick={() => onEdit?.(student.id)} style={{ padding: '9px 18px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '999px', color: '#18181b', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Edit</button>
                  <button onClick={() => onRemove(student.id)} style={{ padding: '9px 18px', background: '#f4f4f5', border: '1px solid #d4d4d8', borderRadius: '999px', color: '#18181b', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Remove</button>
                </>
              )}
              <button onClick={onClose} style={{ padding: '9px 18px', background: 'transparent', border: '1px solid #e4e4e7', borderRadius: '999px', color: '#71717a', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
