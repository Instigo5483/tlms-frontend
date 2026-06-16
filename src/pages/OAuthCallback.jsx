import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../hooks/useAuth'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const token = searchParams.get('token')
    if (!token) { navigate('/login?error=oauth_failed'); return }

    async function finish() {
      try {
        const res = await fetch(`${BACKEND}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const user = await res.json()
        if (!res.ok || !user?.id) { navigate('/login?error=oauth_failed'); return }
        login(token, user)
        if (!user.role) navigate('/choose-role')
        else if (user.role === 'student') navigate('/dashboard/student')
        else if (user.role === 'tutor') navigate('/dashboard/tutor')
        else navigate('/dashboard/center')
      } catch {
        navigate('/login?error=oauth_failed')
      }
    }
    finish()
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ color: '#71717a', fontSize: '0.9rem' }}>
        Signing you in...
      </motion.div>
    </div>
  )
}
