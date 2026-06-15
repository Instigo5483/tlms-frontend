import { motion, AnimatePresence } from 'motion/react'

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, accentColor = '#f87171', hideCancel = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="confirm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '380px',
              background: '#0d0d14',
              border: `1px solid ${accentColor}28`,
              borderRadius: '20px',
              padding: '1.8rem',
              boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 32px 64px rgba(0,0,0,0.7), 0 0 80px ${accentColor}12`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top shimmer line */}
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: '45%', height: '1px',
              background: `linear-gradient(90deg, transparent, ${accentColor}55, transparent)`
            }} />

            {/* Icon */}
            <div style={{
              width: '42px', height: '42px', borderRadius: '11px',
              background: `${accentColor}12`,
              border: `1px solid ${accentColor}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: accentColor,
              marginBottom: '1.1rem',
              fontFamily: 'monospace',
            }}>!</div>

            <h3 style={{
              color: '#fff', fontWeight: 700, fontSize: '0.98rem',
              letterSpacing: '-0.01em', marginBottom: '0.45rem'
            }}>{title}</h3>

            <p style={{
              color: 'rgba(255,255,255,0.38)', fontSize: '0.85rem',
              lineHeight: 1.65, marginBottom: '1.6rem'
            }}>{message}</p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {!hideCancel && (
                <button
                  onClick={onCancel}
                  style={{
                    padding: '8px 18px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer', fontSize: '0.83rem', fontWeight: 500,
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >Cancel</button>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                style={{
                  padding: '8px 20px',
                  background: `${accentColor}18`,
                  border: `1px solid ${accentColor}38`,
                  borderRadius: '10px',
                  color: accentColor,
                  cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600,
                }}
              >{confirmLabel}</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
