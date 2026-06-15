import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '../components/Navbar'

const BACKEND = import.meta.env.VITE_BACKEND_URL

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu',
  'Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
]

const INDIA_SUBJECTS = [
  'Accountancy','Arts / Drawing','Bengali','Biology','Business Studies','Chemistry',
  'Computer Science','Economics','English','Geography','Gujarati','Hindi','History',
  'Kannada','Malayalam','Marathi','Mathematics','Music','Physical Education',
  'Physics','Political Science','Punjabi','Sanskrit','Social Science',
  'Tamil','Telugu','Urdu',
]

const INDIA_GRADES = [
  'Nursery','LKG','UKG',
  'Class 1','Class 2','Class 3','Class 4','Class 5',
  'Class 6','Class 7','Class 8','Class 9','Class 10',
  'Class 11','Class 12',
  'JEE','NEET','UPSC','APSC','WBJEE','CEE',
]

const PRICE_MAX = 10000
const PRICE_STEP = 500

function PriceRangeSlider({ minVal, maxVal, onChange }) {
  const trackRef = useRef(null)
  const activeHandle = useRef(null)
  const [localMin, setLocalMin] = useState(minVal)
  const [localMax, setLocalMax] = useState(maxVal)

  const minPct = (localMin / PRICE_MAX) * 100
  const maxPct = (localMax / PRICE_MAX) * 100

  function valFromX(clientX) {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return null
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round((pct * PRICE_MAX) / PRICE_STEP) * PRICE_STEP
  }

  function onHandleDown(e, handle) {
    e.stopPropagation()
    activeHandle.current = handle
    trackRef.current?.setPointerCapture(e.pointerId)
  }

  function onTrackMove(e) {
    if (!activeHandle.current) return
    const val = valFromX(e.clientX)
    if (val === null) return
    if (activeHandle.current === 'min') {
      setLocalMin(Math.max(0, Math.min(val, localMax - PRICE_STEP)))
    } else {
      setLocalMax(Math.min(PRICE_MAX, Math.max(val, localMin + PRICE_STEP)))
    }
  }

  function onTrackUp() {
    if (!activeHandle.current) return
    activeHandle.current = null
    onChange(localMin, localMax)
  }

  function onTrackClick(e) {
    if (activeHandle.current) return
    const val = valFromX(e.clientX)
    if (val === null) return
    const distMin = Math.abs(val - localMin)
    const distMax = Math.abs(val - localMax)
    if (distMin <= distMax) {
      const n = Math.max(0, Math.min(val, localMax - PRICE_STEP))
      setLocalMin(n); onChange(n, localMax)
    } else {
      const n = Math.min(PRICE_MAX, Math.max(val, localMin + PRICE_STEP))
      setLocalMax(n); onChange(localMin, n)
    }
  }

  return (
    <div
      ref={trackRef}
      onClick={onTrackClick}
      onPointerMove={onTrackMove}
      onPointerUp={onTrackUp}
      onPointerCancel={onTrackUp}
      style={{
        position: 'relative', height: '38px',
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        display: 'flex', alignItems: 'center',
        padding: '0 10px', cursor: 'pointer',
      }}
    >
      {/* Track line */}
      <div style={{ position: 'relative', width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
        {/* Filled range */}
        <div style={{
          position: 'absolute', top: 0, height: '100%',
          left: `${minPct}%`, width: `${maxPct - minPct}%`,
          background: 'linear-gradient(90deg, #a855f7, #06b6d4)',
          borderRadius: '2px', pointerEvents: 'none',
        }} />

        {/* Min handle */}
        <motion.div
          onPointerDown={e => onHandleDown(e, 'min')}
          whileHover={{ scale: 1.25 }} whileTap={{ scale: 1.05 }}
          style={{
            position: 'absolute',
            top: 'calc(50% - 8px)', left: `calc(${minPct}% - 8px)`,
            width: '16px', height: '16px', borderRadius: '50%',
            background: '#a855f7',
            boxShadow: '0 0 0 3px rgba(168,85,247,0.3), 0 2px 8px rgba(0,0,0,0.6)',
            cursor: 'grab', touchAction: 'none',
          }}
        />

        {/* Max handle */}
        <motion.div
          onPointerDown={e => onHandleDown(e, 'max')}
          whileHover={{ scale: 1.25 }} whileTap={{ scale: 1.05 }}
          style={{
            position: 'absolute',
            top: 'calc(50% - 8px)', left: `calc(${maxPct}% - 8px)`,
            width: '16px', height: '16px', borderRadius: '50%',
            background: '#06b6d4',
            boxShadow: '0 0 0 3px rgba(6,182,212,0.3), 0 2px 8px rgba(0,0,0,0.6)',
            cursor: 'grab', touchAction: 'none',
          }}
        />
      </div>
    </div>
  )
}

function DropdownSingle({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onOut(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    if (open) document.addEventListener('mousedown', onOut)
    return () => document.removeEventListener('mousedown', onOut)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        type="button"
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.99 }}
        style={{
          width: '100%', height: '38px', padding: '0 12px',
          background: '#0a0a0a',
          border: `1px solid ${open ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '10px',
          display: 'flex', alignItems: 'center',
          cursor: 'pointer', fontSize: '0.85rem',
          transition: 'border-color 0.2s',
        }}
      >
        <span style={{ flex: 1, color: value ? '#fff' : 'rgba(255,255,255,0.25)', textAlign: 'left' }}>
          {value || placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ opacity: 0.4, fontSize: '0.65rem', flexShrink: 0 }}
        >▾</motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.94 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, zIndex: 300,
              background: '#0d0d16',
              border: '1px solid rgba(168,85,247,0.2)',
              borderRadius: '12px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
              transformOrigin: 'top',
            }}
          >
            <div className="no-scrollbar" style={{ maxHeight: '240px', overflowY: 'auto', borderRadius: '12px' }}>
              {options.map((o, i) => (
                <motion.button
                  key={o} type="button"
                  whileHover={{ x: 4, background: 'rgba(168,85,247,0.1)' }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => { onChange(o === value ? '' : o); setOpen(false) }}
                  style={{
                    width: '100%', padding: '9px 14px',
                    background: value === o ? 'rgba(168,85,247,0.15)' : 'transparent',
                    border: 'none',
                    borderBottom: i < options.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    cursor: 'pointer', textAlign: 'left',
                    color: value === o ? '#a855f7' : 'rgba(255,255,255,0.6)',
                    fontSize: '0.85rem', fontWeight: value === o ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: '9px',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  <span style={{ width: '13px', flexShrink: 0, color: '#a855f7', fontSize: '0.7rem', fontWeight: 800, opacity: value === o ? 1 : 0 }}>✓</span>
                  {o}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterData, setFilterData] = useState({ subjects: [], grades: [], locations: [] })
  const [gpsLoading, setGpsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filterAnimDone, setFilterAnimDone] = useState(false)

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    subject: searchParams.get('subject') || '',
    grade: searchParams.get('grade') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    country: searchParams.get('country') || '',
    state: searchParams.get('state') || '',
    district: searchParams.get('district') || '',
    area: searchParams.get('area') || '',
    type: searchParams.get('type') || '',
  })

  useEffect(() => { loadFilters(); fetchTutors(filters); autoDetectLocation() }, [])

  async function loadFilters() {
    try {
      const res = await fetch(`${BACKEND}/api/filters`)
      const data = await res.json()
      setFilterData(data)
    } catch (err) { console.error(err) }
  }

  async function autoDetectLocation() {
    if (!navigator.geolocation) return
    if (filters.country || filters.district) return
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        const data = await res.json()
        const addr = data.address
        const detected = {
          country: addr.country || '',
          state: addr.state || '',
          district: addr.county || addr.state_district || addr.district || '',
          area: addr.suburb || addr.village || addr.town || addr.city || '',
        }
        setFilters(f => { const updated = { ...f, ...detected }; fetchTutors(updated); return updated })
      } catch (err) { console.error(err) }
      finally { setGpsLoading(false) }
    }, () => setGpsLoading(false))
  }

  async function fetchTutors(f = filters) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(f).forEach(([k, v]) => { if (v) params.set(k, v) })
      setSearchParams(params)
      const res = await fetch(`${BACKEND}/api/discover?${params}`)
      const data = await res.json()
      setTutors(data)
    } catch { setTutors([]) }
    finally { setLoading(false) }
  }

  function handleFilter(key, value) {
    const updated = { ...filters, [key]: value }
    if (key === 'country') { updated.state = ''; updated.district = ''; updated.area = '' }
    if (key === 'state') { updated.district = ''; updated.area = '' }
    if (key === 'district') { updated.area = '' }
    setFilters(updated)
    fetchTutors(updated)
  }

  function clearFilters() {
    const cleared = { q: '', subject: '', grade: '', minPrice: '', maxPrice: '', country: '', state: '', district: '', area: '', type: '' }
    setFilters(cleared)
    fetchTutors(cleared)
  }

  const countries = [...new Set(filterData.locations.map(l => l.country).filter(Boolean))].sort()
  const states = [...new Set(filterData.locations.filter(l => !filters.country || l.country === filters.country).map(l => l.state).filter(Boolean))].sort()
  const districts = [...new Set(filterData.locations.filter(l => (!filters.state || l.state === filters.state)).map(l => l.district).filter(Boolean))].sort()
  const areas = [...new Set(filterData.locations.filter(l => (!filters.district || l.district === filters.district)).map(l => l.area).filter(Boolean))].sort()
  const activeFilters = Object.values(filters).filter(Boolean).length

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '88px 2.5rem 3rem', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '2rem', paddingTop: '1rem' }}
        >
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: 800, color: '#fff',
            letterSpacing: '-0.03em', marginBottom: '0.3rem'
          }}>Discover the <span style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>perfect tutor</span> for your success</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
            {loading ? 'Searching...' : `${tutors.length} result${tutors.length !== 1 ? 's' : ''} found`}
            {gpsLoading && <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: '8px' }}>· Detecting location...</span>}
          </p>
        </motion.div>

        {/* Search + controls row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}
        >
          <input
            type="text" placeholder="Search by name, subject, or bio..."
            value={filters.q}
            onChange={e => handleFilter('q', e.target.value)}
            style={{
              flex: 1, minWidth: '200px', height: '44px', padding: '0 1.2rem',
              background: '#0a0a0a !important',
              border: '1px solid rgba(255,255,255,0.08) !important',
              borderRadius: '12px !important', color: '#fff !important',
              fontSize: '0.9rem'
            }}
          />

          <div style={{
            display: 'flex', background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', padding: '3px', gap: '2px'
          }}>
            {[['', 'All'], ['tutor', 'Tutors'], ['center', 'Centers']].map(([val, label]) => (
              <button key={val} onClick={() => handleFilter('type', val)} style={{
                padding: '6px 14px', border: 'none', cursor: 'pointer',
                borderRadius: '9px', fontSize: '0.82rem', fontWeight: 600,
                background: filters.type === val ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: filters.type === val ? '#fff' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}>{label}</button>
            ))}
          </div>

          <button onClick={() => { setShowFilters(v => !v); setFilterAnimDone(false) }} style={{
            height: '44px', padding: '0 16px',
            background: showFilters ? 'rgba(255,255,255,0.1)' : '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', color: '#fff',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s', whiteSpace: 'nowrap'
          }}>
            ⚡ Filters {activeFilters > 0 && `(${activeFilters})`}
          </button>

          {activeFilters > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFilters}
              style={{
                height: '44px', padding: '0 16px',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.15)',
                borderRadius: '12px', color: '#f87171',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                whiteSpace: 'nowrap'
              }}
            >
              Clear
            </motion.button>
          )}
        </motion.div>

        {/* Expandable filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => { if (showFilters) setFilterAnimDone(true) }}
              style={{ overflow: filterAnimDone ? 'visible' : 'hidden', marginBottom: '1.5rem' }}
            >
              <div style={{
                padding: '1.5rem', background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                display: 'flex', gap: '12px', flexWrap: 'wrap',
                alignItems: 'flex-end'
              }}>
                <div style={{ flex: '1 1 140px' }}>
                  <label style={filterLabelStyle}>Subject</label>
                  <DropdownSingle
                    value={filters.subject}
                    onChange={val => handleFilter('subject', val)}
                    options={INDIA_SUBJECTS}
                    placeholder="All"
                  />
                </div>
                <div style={{ flex: '1 1 140px' }}>
                  <label style={filterLabelStyle}>Grade</label>
                  <DropdownSingle
                    value={filters.grade}
                    onChange={val => handleFilter('grade', val)}
                    options={INDIA_GRADES}
                    placeholder="All"
                  />
                </div>
                <div style={{ flex: '2 1 220px' }}>
                  <label style={filterLabelStyle}>
                    Monthly Rate
                    <span style={{ marginLeft: '6px', color: '#a855f7', fontWeight: 600 }}>
                      {filters.minPrice ? `₹${Number(filters.minPrice).toLocaleString('en-IN')}` : '₹0'}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 3px' }}>—</span>
                    <span style={{ color: '#06b6d4', fontWeight: 600 }}>
                      {!filters.maxPrice || Number(filters.maxPrice) >= PRICE_MAX ? '₹10k+' : `₹${Number(filters.maxPrice).toLocaleString('en-IN')}`}
                    </span>
                  </label>
                  <PriceRangeSlider
                    minVal={filters.minPrice ? parseInt(filters.minPrice) : 0}
                    maxVal={filters.maxPrice ? parseInt(filters.maxPrice) : PRICE_MAX}
                    onChange={(min, max) => {
                      const updated = {
                        ...filters,
                        minPrice: min > 0 ? String(min) : '',
                        maxPrice: max < PRICE_MAX ? String(max) : '',
                      }
                      setFilters(updated)
                      fetchTutors(updated)
                    }}
                  />
                </div>
                <div style={{ flex: '1 1 120px' }}>
                  <label style={filterLabelStyle}>Country</label>
                  <DropdownSingle
                    value={filters.country}
                    onChange={val => handleFilter('country', val)}
                    options={['India']}
                    placeholder="All"
                  />
                </div>
                <div style={{ flex: '1 1 120px' }}>
                  <label style={filterLabelStyle}>State</label>
                  <DropdownSingle
                    value={filters.state}
                    onChange={val => handleFilter('state', val)}
                    options={INDIA_STATES}
                    placeholder="All"
                  />
                </div>
                <div style={{ flex: '1 1 120px' }}>
                  <label style={filterLabelStyle}>District</label>
                  <input type="text" placeholder="Kamrup" value={filters.district}
                    onChange={e => handleFilter('district', e.target.value)}
                    list="district-list" style={filterInputStyle} />
                  <datalist id="district-list">{districts.map(d => <option key={d} value={d} />)}</datalist>
                </div>
                <div style={{ flex: '1 1 120px' }}>
                  <label style={filterLabelStyle}>Area <span style={{ color: 'rgba(255,255,255,0.2)' }}>(optional)</span></label>
                  <input type="text" placeholder="Guwahati" value={filters.area}
                    onChange={e => handleFilter('area', e.target.value)}
                    list="area-list" style={filterInputStyle} />
                  <datalist id="area-list">{areas.map(a => <option key={a} value={a} />)}</datalist>
                </div>
                <button onClick={autoDetectLocation} disabled={gpsLoading} style={{
                  height: '38px', padding: '0 14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                  whiteSpace: 'nowrap', alignSelf: 'flex-end'
                }}>
                  {gpsLoading ? '...' : '📍 Auto'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '12px'
          }}>
            {[1,2,3,4,5,6].map(i => (
              <motion.div key={i}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                style={{
                  height: '200px', background: '#0a0a0a',
                  borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)'
                }}
              />
            ))}
          </div>
        ) : tutors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center', padding: '6rem 1rem',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px', background: '#0a0a0a'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>◎</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: 600 }}>No results found</p>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Try adjusting your filters</p>
            <button onClick={clearFilters} style={{
              padding: '10px 24px', background: '#fff', color: '#000',
              border: 'none', borderRadius: '10px', fontWeight: 700,
              cursor: 'pointer', fontSize: '0.9rem'
            }}>Clear Filters</button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '12px'
            }}
          >
            {tutors.map((tutor, i) => (
              <TutorCard
                key={`${tutor.role}-${tutor.id}`}
                tutor={tutor}
                index={i}
                onClick={() => navigate(`/profile/${tutor.role}/${tutor.id}`)}
              />
            ))}
          </motion.div>
        )}
      </main>
      <style>{`select option { background: #111; color: #fff; }`}</style>
    </div>
  )
}

function TutorCard({ tutor, index, onClick }) {
  const isCenter = tutor.role === 'center'
  const initials = tutor.full_name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      whileHover={{ background: '#111' }}
      style={{
        padding: '1.5rem',
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'background 0.2s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
          background: isCenter ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '3px' }}>
            {tutor.full_name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>{isCenter ? 'Center' : 'Tutor'}</span>
            {tutor.monthly_rate > 0 && (
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>₹{tutor.monthly_rate}/mo</span>
            )}
          </div>
        </div>
      </div>

      {tutor.bio && (
        <p style={{
          color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', lineHeight: 1.6,
          marginBottom: '1rem',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>{tutor.bio}</p>
      )}

      {tutor.subjects?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '0.8rem' }}>
          {tutor.subjects.slice(0, 3).map(s => (
            <span key={s} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem',
              padding: '2px 8px', borderRadius: '6px'
            }}>{s}</span>
          ))}
          {tutor.subjects.length > 3 && (
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', padding: '2px 6px' }}>
              +{tutor.subjects.length - 3}
            </span>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {(tutor.district || tutor.state) && (
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
            📍 {[tutor.area, tutor.district, tutor.state].filter(Boolean).join(', ')}
          </span>
        )}
        <span style={{
          fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)',
          marginLeft: 'auto', fontWeight: 600
        }}>View →</span>
      </div>
    </motion.div>
  )
}

const filterLabelStyle = {
  display: 'block', fontSize: '0.72rem',
  color: 'rgba(255,255,255,0.35)', marginBottom: '6px',
  fontWeight: 500, letterSpacing: '0.03em'
}

const filterSelectStyle = {
  width: '100%', height: '38px', padding: '0 10px',
  background: '#111 !important',
  border: '1px solid rgba(255,255,255,0.08) !important',
  borderRadius: '10px !important', color: '#fff !important',
  fontSize: '0.82rem', cursor: 'pointer'
}

const filterInputStyle = {
  width: '100%', height: '38px', padding: '0 10px',
  background: '#111 !important',
  border: '1px solid rgba(255,255,255,0.08) !important',
  borderRadius: '10px !important', color: '#fff !important',
  fontSize: '0.82rem'
}