import { useNavigate } from 'react-router-dom'
import ThreeBackground from '../components/ThreeBackground'
import Navbar from '../components/Navbar'

export default function Landing() {
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    const q = e.target.querySelector('input').value.trim()
    navigate(`/discover${q ? `?q=${encodeURIComponent(q)}` : ''}`)
  }

  return (
    <>
      <ThreeBackground />
      <Navbar />

      <main style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 1.5rem',
        textAlign: 'center'
      }}>

        {/* Hero text */}
        <div style={{ marginBottom: '2.5rem', maxWidth: '720px' }}>
          <span style={{
            display: 'inline-block', marginBottom: '1.2rem',
            background: 'rgba(26,115,232,0.15)',
            border: '1px solid rgba(26,115,232,0.3)',
            color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600,
            padding: '6px 16px', borderRadius: '20px', letterSpacing: '0.05em'
          }}>
            STUDENTS · TUTORS · TUITION CENTERS
          </span>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800, lineHeight: 1.15,
            color: '#f1f5f9', marginBottom: '1.2rem'
          }}>
            Find the perfect tutor<br />
            <span style={{ color: '#1a73e8' }}>near you</span>
          </h1>

          <p style={{
            fontSize: '1.1rem', color: '#94a3b8',
            lineHeight: 1.7, maxWidth: '560px', margin: '0 auto'
          }}>
            Connect with verified tutors and tuition centers.
            Filter by subject, grade, and budget — all in one place.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{
          display: 'flex', gap: '10px', width: '100%', maxWidth: '540px',
          marginBottom: '3rem'
        }}>
          <input
            type="text"
            placeholder="Search by subject, name, or grade..."
            style={{
              flex: 1, height: '52px', padding: '0 1.2rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px', color: '#f1f5f9',
              fontSize: '0.95rem', outline: 'none',
              backdropFilter: 'blur(8px)'
            }}
          />
          <button type="submit" style={{
            height: '52px', padding: '0 1.6rem',
            background: '#1a73e8', color: '#fff',
            border: 'none', borderRadius: '12px',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}>
            Search
          </button>
        </form>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '500+', label: 'Verified Tutors' },
            { value: '20+', label: 'Subjects' },
            { value: '50+', label: 'Tuition Centers' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('/discover')} style={{
            padding: '12px 28px', background: '#1a73e8',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer'
          }}>
            Browse Tutors
          </button>
          <button onClick={() => navigate('/login')} style={{
            padding: '12px 28px',
            background: 'rgba(255,255,255,0.08)',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px', fontWeight: 600,
            fontSize: '0.95rem', cursor: 'pointer',
            backdropFilter: 'blur(8px)'
          }}>
            Join as Tutor
          </button>
        </div>
      </main>

      {/* Features section */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '5rem 1.5rem', maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <h2 style={{
          textAlign: 'center', fontSize: '2rem',
          fontWeight: 700, color: '#f1f5f9', marginBottom: '3rem'
        }}>
          Why TLMS?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { icon: '🎯', title: 'Smart Matching', desc: 'Filter by subject, grade level, and budget to find your perfect tutor instantly.' },
            { icon: '✅', title: 'Verified Profiles', desc: 'Every tutor and center is verified. Review ratings and bios before you connect.' },
            { icon: '📍', title: 'Local & Online', desc: 'Find tutors near you or online. Your learning, your way.' },
          ].map(f => (
            <div key={f.title} className="glass" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '0.6rem' }}>{f.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: '0.95rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}