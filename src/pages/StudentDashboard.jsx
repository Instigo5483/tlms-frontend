import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  return (
    <>
      <Navbar />
      <main style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        background: '#0a0f1e',
        padding: '84px 1.5rem 3rem',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '1rem', marginBottom: '2.5rem'
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'rgba(26,115,232,0.2)',
            border: '2px solid rgba(26,115,232,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1.1rem', color: '#60a5fa'
          }}>
            {initials}
          </div>
          <div>
            <h1 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.5rem' }}>
              Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{user?.email}</p>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem', marginBottom: '2.5rem'
        }}>
          {[
            { label: 'Saved Tutors', value: '0', icon: '🔖' },
            { label: 'Sessions Booked', value: '0', icon: '📅' },
            { label: 'Subjects Learning', value: '0', icon: '📚' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px', padding: '1.4rem'
            }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f1f5f9' }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <h2 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem', marginBottom: '2.5rem'
        }}>
          {[
            { icon: '🔍', title: 'Find a Tutor', desc: 'Browse and filter tutors by subject or grade', action: () => navigate('/discover') },
            { icon: '👤', title: 'Edit Profile', desc: 'Update your name, grade, and subjects', action: () => {} },
          ].map(a => (
            <button key={a.title} onClick={a.action} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px', padding: '1.4rem',
              textAlign: 'left', cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(26,115,232,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{a.icon}</div>
              <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>{a.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{a.desc}</div>
            </button>
          ))}
        </div>

        {/* Recent activity placeholder */}
        <h2 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
          Recent Activity
        </h2>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px', padding: '3rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>📭</div>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>No activity yet.</p>
          <button onClick={() => navigate('/discover')} style={{
            marginTop: '1rem', padding: '10px 24px',
            background: '#1a73e8', color: '#fff',
            border: 'none', borderRadius: '8px',
            fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
          }}>
            Find your first tutor
          </button>
        </div>

      </main>
    </>
  )
}