import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function AvatarUpload({ avatarUrl, initials, accentColor = '#4f46e5', size = 64, onUploaded }) {
  const { token, updateUser } = useAuth()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return }
    if (file.size > 1.5 * 1024 * 1024) { setError('Image must be smaller than 1.5MB.'); return }

    setError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await fetch(`${BACKEND}/api/profile/avatar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Upload failed'); return }
      updateUser({ avatar_url: data.avatar_url })
      onUploaded?.(data.avatar_url)
    } catch {
      setError('Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        disabled={uploading}
        style={{
          width: `${size}px`, height: `${size}px`, borderRadius: '16px',
          background: `${accentColor}12`, border: `1px solid ${accentColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: `${size * 0.3}px`, color: accentColor,
          overflow: 'hidden', padding: 0, cursor: uploading ? 'wait' : 'pointer', position: 'relative',
        }}
      >
        {avatarUrl
          ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : initials}

        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(24,24,27,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: uploading ? 1 : 0, transition: 'opacity 0.2s',
        }}>
          <span style={{ fontSize: `${size * 0.22}px` }}>{uploading ? '⏳' : ''}</span>
        </div>
      </motion.button>

      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        disabled={uploading}
        style={{
          position: 'absolute', bottom: '-4px', right: '-4px',
          width: '22px', height: '22px', borderRadius: '50%',
          background: accentColor, border: '2px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', color: '#fff', cursor: uploading ? 'wait' : 'pointer', padding: 0,
        }}
        title="Change photo"
      >
        ✎
      </motion.button>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

      {error && (
        <p style={{ position: 'absolute', top: '100%', left: 0, marginTop: '6px', fontSize: '0.72rem', color: '#18181b', background: '#f4f4f5', border: '1px solid #d4d4d8', borderRadius: '8px', padding: '4px 8px', whiteSpace: 'nowrap', zIndex: 10 }}>
          {error}
        </p>
      )}
    </div>
  )
}
