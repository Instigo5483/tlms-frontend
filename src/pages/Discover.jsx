import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const BACKEND = 'http://localhost:3001'

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science']
const GRADES = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'A-Level']

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    subject: searchParams.get('subject') || '',
    grade: searchParams.get('grade') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  })

  useEffect(() => { fetchTutors() }, [])

  async function fetchTutors(f = filters) {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (f.q)        params.set('q', f.q)
      if (f.subject)  params.set('subject', f.subject)
      if (f.grade)    params.set('grade', f.grade)
      if (f.maxPrice) params.set('maxPrice', f.maxPrice)
      setSearchParams(params)

      const res = await fetch(`${BACKEND}/api/discover?${params}`)
      const data = await res.json()
      setTutors(data)
    } catch {
      setError('Could not load tutors. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  function handleFilter(key, value) {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    fetchTutors(updated)
  }

  function clearFilters() {
    const cleared = { q: '', subject: '', grade: '', maxPrice: '' }
    setFilters(cleared)
    fetchTutors(cleared)
  }

  const activeFilters = Object.values(filters).filter(Boolean).length

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '100vh', background: '#0a0f1e',
        padding: '84px 1.5rem 3rem',
        maxWidth: '1200px', margin: '0 auto'
      }}>

        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.8rem', marginBottom: '0.4rem' }}>
            Find a Tutor
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            {loading ? 'Searching...' : `${tutors.length} tutor${tutors.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Search by name, subject, or bio..."
            value={filters.q}
            onChange={e => handleFilter('q', e.target.value)}
            style={{
              flex: 1, height: '46px', padding: '0 1.2rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px', color: '#f1f5f9',
              fontSize: '0.95rem', outline: 'none'
            }}
          />
          {activeFilters > 0 && (
            <button onClick={clearFilters} style={{
              padding: '0 16px', height: '46px',
              background: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '10px', color: '#f87171',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              whiteSpace: 'nowrap'
            }}>
              Clear ({activeFilters})
            </button>
          )}
        </div>

        {/* Filter row */}
        <div style={{
          display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2rem'
        }}>
          <select value={filters.subject} onChange={e => handleFilter('subject', e.target.value)}
            style={selectStyle}>
            <option value="">All Subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={filters.grade} onChange={e => handleFilter('grade', e.target.value)}
            style={selectStyle}>
            <option value="">All Grades</option>
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          <select value={filters.maxPrice} onChange={e => handleFilter('maxPrice', e.target.value)}
            style={selectStyle}>
            <option value="">Any Price</option>
            <option value="200">Up to ₹200/hr</option>
            <option value="500">Up to ₹500/hr</option>
            <option value="1000">Up to ₹1000/hr</option>
            <option value="2000">Up to ₹2000/hr</option>
          </select>
        </div>

        {/* Results */}
        {error && (
          <div style={{
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: '12px', padding: '1.2rem',
            color: '#f87171', marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px', padding: '1.5rem', height: '200px',
                animation: 'pulse 1.5s infinite'
              }} />
            ))}
          </div>
        ) : tutors.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '5rem 1rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '0.5rem' }}>
              No tutors found
            </p>
            <p style={{ color: '#475569', fontSize: '0.85rem' }}>
              Try adjusting your filters or be the first to sign up as a tutor!
            </p>
            <button onClick={clearFilters} style={{
              marginTop: '1.2rem', padding: '10px 24px',
              background: '#1a73e8', color: '#fff', border: 'none',
              borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.2rem'
          }}>
            {tutors.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        select option { background: #1e293b; color: #f1f5f9; }
      `}</style>
    </>
  )
}

function TutorCard({ tutor }) {
  const initials = tutor.full_name
    ? tutor.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px', padding: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '1rem',
      transition: 'border-color 0.2s, transform 0.2s',
      cursor: 'pointer'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(26,115,232,0.4)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
          background: 'rgba(26,115,232,0.2)',
          border: '2px solid rgba(26,115,232,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '1rem', color: '#60a5fa'
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>
            {tutor.full_name}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
            {tutor.hourly_rate > 0 ? `₹${tutor.hourly_rate}/hr` : 'Rate not set'}
          </div>
        </div>
        {tutor.hourly_rate > 0 && (
          <div style={{
            background: 'rgba(26,115,232,0.15)',
            border: '1px solid rgba(26,115,232,0.25)',
            color: '#60a5fa', fontSize: '0.8rem',
            fontWeight: 700, padding: '4px 10px', borderRadius: '8px',
            whiteSpace: 'nowrap'
          }}>
            ₹{tutor.hourly_rate}/hr
          </div>
        )}
      </div>

      {/* Bio */}
      {tutor.bio && (
        <p style={{
          color: '#94a3b8', fontSize: '0.875rem',
          lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {tutor.bio}
        </p>
      )}

      {/* Subjects */}
      {tutor.subjects?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {tutor.subjects.slice(0, 4).map(s => (
            <span key={s} style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', fontSize: '0.75rem',
              padding: '3px 10px', borderRadius: '6px'
            }}>
              {s}
            </span>
          ))}
          {tutor.subjects.length > 4 && (
            <span style={{ color: '#475569', fontSize: '0.75rem', padding: '3px 6px' }}>
              +{tutor.subjects.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Grade levels */}
      {tutor.grade_levels?.length > 0 && (
        <div style={{ color: '#475569', fontSize: '0.8rem' }}>
          📚 {tutor.grade_levels.join(', ')}
        </div>
      )}
    </div>
  )
}

const selectStyle = {
  height: '40px', padding: '0 12px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px', color: '#f1f5f9',
  fontSize: '0.875rem', outline: 'none', cursor: 'pointer'
}