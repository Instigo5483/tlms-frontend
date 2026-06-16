import { motion, AnimatePresence } from 'motion/react'

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, accentColor = '#3f3f46', hideCancel = false }) {
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
              width: '100%', maxWidth: '380px',
              background: '#fff',
              border: '1px solid #e4e4e7',
              borderRadius: '20px',
              padding: '1.8rem',
              boxShadow: '0 24px 60px rgba(24,24,27,0.18)',
            }}
          >
            {/* Icon */}
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: `${accentColor}12`,
              border: `1px solid ${accentColor}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: accentColor,
              marginBottom: '1.1rem',
              fontFamily: 'monospace',
            }}>!</div>

            <h3 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.98rem', letterSpacing: '-0.01em', marginBottom: '0.45rem' }}>{title}</h3>

            <p style={{ color: '#71717a', fontSize: '0.85rem', lineHeight: 1.65, marginBottom: '1.6rem' }}>{message}</p>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {!hideCancel && (
                <button
                  onClick={onCancel}
                  style={{
                    padding: '8px 18px',
                    background: '#f4f4f5',
                    border: '1px solid #e4e4e7',
                    borderRadius: '10px',
                    color: '#52525b',
                    cursor: 'pointer', fontSize: '0.83rem', fontWeight: 500,
                    transition: 'all 0.18s',
                  }}
                >Cancel</button>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                style={{
                  padding: '8px 20px',
                  background: accentColor,
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
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
