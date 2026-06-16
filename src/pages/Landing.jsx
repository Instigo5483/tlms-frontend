import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, animate, AnimatePresence } from 'motion/react'
import { useRef, useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

const C = {
  indigo: '#4f46e5',
  purple: '#7c3aed',
  cyan:   '#0891b2',
  pink:   '#db2777',
  green:  '#059669',
  orange: '#ea580c',
}

const cardBase = {
  background: '#fff',
  border: '1px solid #e4e4e7',
  borderRadius: '20px',
  boxShadow: '0 1px 2px rgba(24,24,27,0.04)',
}
const cardHover = { y: -6, boxShadow: '0 20px 40px rgba(24,24,27,0.10)', transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }

function AnimatedStat({ value, label, color, delay }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0
  const suffix = value.replace(/[0-9]/g, '')
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const unsub = count.on('change', v => setDisplay(Math.round(v)))
    const controls = animate(count, numericValue, { duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] })
    return () => { controls.stop(); unsub() }
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} style={{ textAlign: 'center' }}>
      <div className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color }}>{display}{suffix}</div>
      <div style={{ fontSize: '0.82rem', color: '#71717a', marginTop: '2px' }}>{label}</div>
    </motion.div>
  )
}

function SectionBadge({ label, color = C.indigo }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: '0.72rem', fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color, marginBottom: '1rem',
      padding: '5px 14px', borderRadius: '999px',
      border: `1px solid ${color}28`,
      background: `${color}0d`,
    }}>{label}</span>
  )
}

function getFeeRate(earned) {
  if (earned < 50000)  return { rate: 0.01,   label: '1%',     tier: 'Starter' }
  if (earned < 100000) return { rate: 0.0075,  label: '0.75%',  tier: 'Growing' }
  if (earned < 500000) return { rate: 0.005,   label: '0.5%',   tier: 'Established' }
  return                      { rate: 0.0025,  label: '0.25%',  tier: 'Top Earner' }
}

function FeeCalculator() {
  const trackRef = useRef(null)
  const dragging = useRef(false)
  const MAX = 1000000
  const [earned, setEarned] = useState(0)
  const [withdrawStr, setWithdrawStr] = useState('')

  const pct = (earned / MAX) * 100
  const { rate, label, tier } = getFeeRate(earned)
  const withdrawNum = Math.max(0, Number(withdrawStr) || 0)
  const exceedsEarned = withdrawNum > earned && withdrawNum > 0
  const effectiveWithdraw = exceedsEarned ? earned : withdrawNum
  const fee = Math.round(effectiveWithdraw * rate * 100) / 100
  const net = Math.round((effectiveWithdraw - fee) * 100) / 100

  const fmt = v => `₹${Number(v).toLocaleString('en-IN')}`

  function valFromX(clientX) {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return null
    return Math.round(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * MAX / 5000) * 5000
  }

  function onPointerDown(e) {
    dragging.current = true
    trackRef.current?.setPointerCapture(e.pointerId)
    const v = valFromX(e.clientX); if (v !== null) setEarned(v)
  }
  function onPointerMove(e) {
    if (!dragging.current) return
    const v = valFromX(e.clientX); if (v !== null) setEarned(v)
  }
  function onPointerUp() { dragging.current = false }

  const tierColor = tier === 'Starter' ? C.purple : tier === 'Growing' ? C.cyan : tier === 'Established' ? C.green : C.orange

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
      style={{ ...cardBase, boxShadow: '0 16px 40px rgba(24,24,27,0.09)', padding: '2rem' }}
    >
      <h3 className="font-display" style={{ fontWeight: 700, fontSize: '1.15rem', color: '#18181b', marginBottom: '0.3rem' }}>Fee calculator</h3>
      <p style={{ color: '#a1a1aa', fontSize: '0.82rem', marginBottom: '1.6rem' }}>Drag the slider to see your fee tier</p>

      {/* Earned slider */}
      <div style={{ marginBottom: '1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.82rem' }}>
          <span style={{ color: '#71717a' }}>Total earned so far</span>
          <span style={{ color: C.green, fontWeight: 700 }}>{fmt(earned)}</span>
        </div>
        <div
          ref={trackRef}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          style={{ position: 'relative', height: '5px', background: '#f0f0f1', borderRadius: '3px', cursor: 'pointer', margin: '8px 0' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.purple}, ${C.green})`, borderRadius: '3px', pointerEvents: 'none' }} />
          <motion.div
            whileHover={{ scale: 1.25 }} whileTap={{ scale: 1.05 }}
            onPointerDown={onPointerDown}
            style={{ position: 'absolute', top: 'calc(50% - 9px)', left: `calc(${pct}% - 9px)`, width: '18px', height: '18px', borderRadius: '50%', background: '#fff', border: `2px solid ${C.green}`, boxShadow: '0 2px 8px rgba(24,24,27,0.15)', cursor: 'grab', touchAction: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#d4d4d8', marginTop: '4px' }}>
          <span>₹0</span><span>₹10 Lakh+</span>
        </div>
      </div>

      {/* Tier badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: `${tierColor}0d`, border: `1px solid ${tierColor}28`, borderRadius: '12px', marginBottom: '1.4rem' }}>
        <span style={{ fontSize: '0.82rem', color: '#52525b' }}>{tier} tier</span>
        <span style={{ fontWeight: 800, fontSize: '1rem', color: tierColor }}>{label} withdrawal fee</span>
      </div>

      {/* Withdraw input */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 500 }}>Amount to withdraw (₹)</label>
          {earned > 0 && (
            <button type="button" onClick={() => setWithdrawStr(String(earned))}
              style={{ fontSize: '0.7rem', color: C.green, background: `${C.green}0d`, border: `1px solid ${C.green}30`, borderRadius: '6px', padding: '2px 8px', cursor: 'pointer', fontWeight: 600 }}>
              Max
            </button>
          )}
        </div>
        <input
          type="number" placeholder="e.g. 5000"
          value={withdrawStr} onChange={e => setWithdrawStr(e.target.value)}
          style={{ width: '100%', height: '44px', padding: '0 14px', borderColor: exceedsEarned ? '#fca5a5' : undefined }}
        />
      </div>

      {/* Exceeds warning */}
      <AnimatePresence>
        {exceedsEarned && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.8rem', color: '#dc2626' }}>
            <span>⚠</span>
            <span>Cannot exceed total earned. Calculating for{' '}<strong>{fmt(earned)}</strong> instead.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {withdrawNum > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ borderTop: '1px solid #f0f0f1', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#71717a' }}>Withdraw amount</span>
                <span style={{ color: exceedsEarned ? '#dc2626' : '#18181b', fontWeight: 600 }}>{fmt(effectiveWithdraw)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#71717a' }}>Platform fee ({label})</span>
                <span style={{ color: '#dc2626', fontWeight: 600 }}>− {fmt(fee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.98rem', paddingTop: '6px', borderTop: '1px solid #f0f0f1' }}>
                <span style={{ color: '#18181b', fontWeight: 700 }}>You receive</span>
                <span style={{ fontWeight: 800, color: C.green }}>{fmt(net)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/discover${search ? `?q=${encodeURIComponent(search)}` : ''}`)
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{
        position: 'relative', minHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 1.5rem', textAlign: 'center', paddingTop: '100px',
        overflow: 'hidden',
      }}>
        {/* subtle dot grid, very low opacity for depth without noise */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(#e4e4e7 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)',
        }} />

        <motion.div initial={{ opacity: 0, y: -10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 1, marginBottom: '2rem', width: '84px', height: '84px', borderRadius: '22px', background: C.indigo, boxShadow: '0 16px 32px rgba(79,70,229,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo.jpeg" alt="TLMS" style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover' }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', zIndex: 1, maxWidth: '860px', marginBottom: '1.4rem' }}>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.4rem, 7vw, 4.6rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#18181b' }}>
            Find the perfect<br />tutor near you.
          </h1>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: '#71717a', maxWidth: '480px', lineHeight: 1.7, marginBottom: '2.4rem' }}>
          Compare verified tutors and coaching centers, and connect with the right educator — all in one place.
        </motion.p>

        <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '8px', width: '100%', maxWidth: '520px', marginBottom: '3rem' }}>
          <input type="text" placeholder="Search by subject, name, or class..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, height: '52px', padding: '0 1.2rem', borderRadius: '999px', fontSize: '0.95rem', boxShadow: '0 1px 2px rgba(24,24,27,0.04)' }} />
          <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ height: '52px', padding: '0 1.8rem', background: '#18181b', color: '#fff', border: 'none', borderRadius: '999px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Search
          </motion.button>
        </motion.form>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
          style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 'clamp(1.6rem, 4vw, 3.2rem)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '1000+', label: 'Students',        color: C.cyan },
            { value: '500+',  label: 'Verified Tutors', color: C.indigo },
            { value: '20+',   label: 'Subjects',        color: C.pink },
            { value: '50+',   label: 'Centers',         color: C.green },
          ].map((stat, i) => (
            <AnimatedStat key={stat.label} value={stat.value} label={stat.label} color={stat.color} delay={0.5 + i * 0.1} />
          ))}
        </motion.div>
      </section>

      {/* ── What is TLMS ── */}
      <section style={{ padding: 'clamp(4rem,10vw,7rem) 1.5rem', background: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <SectionBadge label="About" />
            <h2 className="font-display" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#18181b', marginBottom: '1.1rem', lineHeight: 1.15 }}>
              What is TLMS?
            </h2>
            <p style={{ color: '#3f3f46', lineHeight: 1.85, fontSize: '1rem', marginBottom: '1.1rem' }}>
              <strong>Tuition Locate & Management Service (TLMS)</strong> is a unified platform built to bridge the gap between learners and educators across India.
            </p>
            <p style={{ color: '#71717a', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.8rem' }}>
              Whether you are a student searching for the right tutor in your area, a tutor growing your teaching career, or a coaching center ready to scale — TLMS brings everyone onto one intelligent platform.
            </p>
            <motion.button onClick={() => navigate('/discover')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '12px 26px', background: C.indigo, color: '#fff', border: 'none', borderRadius: '999px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(79,70,229,0.25)' }}>
              Explore the platform →
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '🎯', title: 'Locate', desc: 'Search and discover verified tutors & centers filtered by subject, class, location, and budget.', color: C.purple },
              { icon: '🤝', title: 'Connect', desc: 'Send and receive join requests. Build lasting student-teacher relationships on one platform.', color: C.cyan },
              { icon: '⚙️', title: 'Manage', desc: 'Track students, manage payments, and run your teaching business with built-in tools.', color: C.pink },
            ].map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} whileHover={{ x: 4 }}
                style={{ ...cardBase, display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1.3rem 1.4rem' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{p.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: p.color, fontSize: '0.95rem', marginBottom: '3px' }}>{p.title}</div>
                  <div style={{ color: '#71717a', fontSize: '0.85rem', lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How TLMS Works ── */}
      <section style={{ padding: 'clamp(4rem,10vw,7rem) 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <SectionBadge label="Process" color={C.cyan} />
            <h2 className="font-display" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#18181b', marginBottom: '0.7rem' }}>How TLMS works</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '420px', margin: '0 auto' }}>Get up and running in three simple steps</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { step: '01', icon: '👤', title: 'Create your profile', desc: 'Sign up as a Student, Tutor, or Tuition Center. Fill in your details — subjects, classes, location, and rates.', color: C.purple },
              { step: '02', icon: '🔍', title: 'Discover & connect', desc: 'Students browse and filter tutors by subject, class, and location. Tutors receive join requests from interested students. Centers list their programs and start getting discovered.', color: C.cyan },
              { step: '03', icon: '📚', title: 'Learn & grow', desc: 'Get connected with your tutor or center, start learning right away, and easily handle your tuition fees — all from one place.', color: C.pink },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} whileHover={cardHover}
                style={{ ...cardBase, position: 'relative', padding: '2rem', overflow: 'hidden' }}>
                <div className="font-display" style={{ position: 'absolute', top: '0.6rem', right: '1.2rem', fontSize: '3.2rem', fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.04em' }}>{s.step}</div>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: `${s.color}0f`, border: `1px solid ${s.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1.2rem' }}>{s.icon}</div>
                <h3 style={{ color: '#18181b', fontWeight: 700, fontSize: '1.02rem', marginBottom: '0.6rem' }}>{s.title}</h3>
                <p style={{ color: '#71717a', lineHeight: 1.7, fontSize: '0.875rem' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why TLMS ── */}
      <section style={{ padding: 'clamp(4rem,10vw,7rem) 1.5rem', background: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <SectionBadge label="Why us" />
            <h2 className="font-display" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#18181b', marginBottom: '0.7rem' }}>Why choose TLMS?</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '420px', margin: '0 auto' }}>Built specifically for India's education ecosystem</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {[
              { icon: '🇮🇳', title: 'Built for India', desc: 'Covers all 36 states and UTs. Supports India-specific classes, subjects, and competitive exams like JEE, NEET, UPSC, and more.', color: C.purple },
              { icon: '📍', title: 'Find tutors near you', desc: 'Share your location and instantly see tutors and coaching centers available in your area — no guessing, no calls.', color: C.cyan },
              { icon: '✅', title: 'Verified educators', desc: 'Every tutor and tuition center maintains a public profile with bio, subjects, classes, rates, and contact — fully transparent.', color: C.green },
              { icon: '💸', title: 'Transparent pricing', desc: 'Filter by monthly rate. See exactly what a tutor charges before reaching out — no hidden fees, no surprises.', color: C.orange },
              { icon: '🗂️', title: 'All-in-one management', desc: 'Tutors and centers manage their students, track join requests, and handle payments from a single dashboard.', color: C.pink },
              { icon: '👛', title: 'Easy fee management', desc: 'A simple system for managing tuition fees between students and educators — no outside apps or spreadsheets needed.', color: C.indigo },
            ].map((r, i) => (
              <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }} whileHover={cardHover}
                style={{ ...cardBase, padding: '1.6rem' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>{r.icon}</div>
                <h3 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{r.title}</h3>
                <p style={{ color: '#71717a', lineHeight: 1.7, fontSize: '0.845rem' }}>{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: 'clamp(4rem,10vw,7rem) 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <SectionBadge label="Features" color={C.pink} />
            <h2 className="font-display" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#18181b', marginBottom: '0.7rem' }}>Everything in one platform</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>Powerful tools designed for students, tutors, and centers</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
            {[
              { icon: '🔎', title: 'Smart search & filter', desc: 'Filter by subject, class, location, and budget to find your perfect match.', color: C.purple },
              { icon: '🧑‍💼', title: 'Rich educator profiles', desc: 'Tutors and centers showcase their specialties, rates, bio, and contact info.', color: C.cyan },
              { icon: '📩', title: 'Join requests', desc: 'Students send a join request to any tutor or center they like. Tutors and centers can then accept or decline with a single tap.', color: C.green },
              { icon: '📊', title: 'Student dashboard', desc: 'Students track their enrolled tutors and centers and manage all connections in one view.', color: C.orange },
              { icon: '💰', title: 'Payment tracking', desc: 'Log and track payments per student. Full payment history for tutors and centers.', color: C.pink },
              { icon: '👛', title: 'Wallet & fees', desc: 'Keep all your tuition payments in one place. Send or receive fees without needing any outside app.', color: C.indigo },
              { icon: '📱', title: 'Fully responsive', desc: 'Works beautifully on mobile, tablet, and desktop — learn on the go.', color: C.cyan },
              { icon: '🔒', title: 'Safe & private', desc: 'Your account is protected — only you can see and manage your profile and personal information.', color: C.green },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(24,24,27,0.08)', transition: { duration: 0.15 } }}
                style={{ ...cardBase, padding: '1.4rem' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '0.7rem' }}>{f.icon}</div>
                <h3 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>{f.title}</h3>
                <p style={{ color: '#a1a1aa', lineHeight: 1.6, fontSize: '0.8rem' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Students ── */}
      <section style={{ padding: 'clamp(4rem,10vw,7rem) 1.5rem', background: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ marginBottom: '2.6rem' }}>
            <SectionBadge label="For students" color={C.purple} />
            <h2 className="font-display" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#18181b', marginBottom: '0.6rem' }}>Find your ideal tutor in minutes</h2>
            <p style={{ color: '#71717a', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.7 }}>Stop wasting time searching. TLMS puts the right educator right in front of you — local, affordable, and perfectly matched to your needs.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🎓', title: 'Any class, any subject', desc: 'From Nursery to Class 12, JEE, NEET, UPSC and beyond — find specialists for every stage of your academic journey.' },
              { icon: '📍', title: 'Near you or anywhere', desc: 'Use your location to find tutors close to where you live, or connect with educators from anywhere in India.' },
              { icon: '💬', title: 'Compare & choose', desc: 'View detailed profiles including bio, subjects, class levels, and monthly rates before sending a single request.' },
              { icon: '📋', title: 'Manage your learning', desc: 'Your student dashboard keeps all enrolled tutors and centers in one place — no more scattered contacts.' },
            ].map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={cardHover}
                style={{ ...cardBase, padding: '1.6rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <h3 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.93rem', marginBottom: '0.4rem' }}>{b.title}</h3>
                  <p style={{ color: '#71717a', fontSize: '0.845rem', lineHeight: 1.65 }}>{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ marginTop: '2rem' }}>
            <motion.button onClick={() => navigate('/discover')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ padding: '13px 28px', background: C.purple, color: '#fff', border: 'none', borderRadius: '999px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: `0 8px 20px ${C.purple}40` }}>
              Find a tutor now →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── For Tutors ── */}
      <section style={{ padding: 'clamp(4rem,10vw,7rem) 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ marginBottom: '2.6rem', textAlign: 'right' }}>
            <SectionBadge label="For tutors" color={C.cyan} />
            <h2 className="font-display" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#18181b', marginBottom: '0.6rem' }}>Grow your teaching career with TLMS</h2>
            <p style={{ color: '#71717a', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.7, marginLeft: 'auto' }}>Whether you are just starting out or already teaching, TLMS gives you the tools to find students, manage your work, and get paid — all in one place.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🌟', title: 'Get discovered by students', desc: 'Create a public profile with your subjects, classes, rates, and bio. Students searching in your area will find you instantly.' },
              { icon: '📥', title: 'Receive join requests', desc: 'When a student is interested, they send you a request. Simply accept or decline it from your dashboard.' },
              { icon: '🧑‍🎓', title: 'Manage your students', desc: 'See all your active students in one organised list. Remove students who are no longer enrolled — changes reflect instantly.' },
              { icon: '💳', title: 'Track your earnings', desc: 'Log monthly payments per student and keep a clear record of all your earnings — all from your dashboard, no extra tools needed.' },
            ].map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={cardHover}
                style={{ ...cardBase, padding: '1.6rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <h3 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.93rem', marginBottom: '0.4rem' }}>{b.title}</h3>
                  <p style={{ color: '#71717a', fontSize: '0.845rem', lineHeight: 1.65 }}>{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <motion.button onClick={() => navigate('/login')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ padding: '13px 28px', background: C.cyan, color: '#fff', border: 'none', borderRadius: '999px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: `0 8px 20px ${C.cyan}40` }}>
              Join as a tutor →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── For Tuition Centers ── */}
      <section style={{ padding: 'clamp(4rem,10vw,7rem) 1.5rem', background: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ marginBottom: '2.6rem' }}>
            <SectionBadge label="For tuition centers" color={C.pink} />
            <h2 className="font-display" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#18181b', marginBottom: '0.6rem' }}>Scale your coaching center with confidence</h2>
            <p style={{ color: '#71717a', fontSize: '1rem', maxWidth: '540px', lineHeight: 1.7 }}>TLMS gives coaching centers a professional presence online and the management tools to operate efficiently — from new enrollments to payment tracking.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🏫', title: 'Professional center profile', desc: 'List your center with name, address, subjects, class levels, monthly rate, bio, and website — a complete public listing for students to find you.' },
              { icon: '🗺️', title: 'Local & regional reach', desc: 'Be discoverable by students and parents searching for coaching centers in your district, area, or state.' },
              { icon: '👥', title: 'Student enrollment system', desc: 'Manage incoming requests and your enrolled student base directly from your center dashboard — no spreadsheets needed.' },
              { icon: '📈', title: 'Payment & financial tracking', desc: 'Track monthly fees per student, maintain payment records, and use the built-in wallet to manage your center\'s finances.' },
            ].map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={cardHover}
                style={{ ...cardBase, padding: '1.6rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <h3 style={{ color: '#18181b', fontWeight: 700, fontSize: '0.93rem', marginBottom: '0.4rem' }}>{b.title}</h3>
                  <p style={{ color: '#71717a', fontSize: '0.845rem', lineHeight: 1.65 }}>{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ marginTop: '2rem' }}>
            <motion.button onClick={() => navigate('/login')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ padding: '13px 28px', background: C.pink, color: '#fff', border: 'none', borderRadius: '999px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: `0 8px 20px ${C.pink}40` }}>
              Register your center →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Fee Structure ── */}
      <section style={{ padding: 'clamp(4rem,10vw,7rem) 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}>
            <SectionBadge label="Pricing" color={C.green} />
            <h2 className="font-display" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#18181b', marginBottom: '0.8rem', lineHeight: 1.15 }}>
              The more you earn, the less you pay
            </h2>
            <p style={{ color: '#71717a', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.8rem' }}>
              We use a tiered fee system for withdrawals. As your total earnings grow, your withdrawal fee goes down — rewarding educators who use TLMS long-term.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { range: 'Under ₹50,000 earned',          fee: '1%',     color: C.purple },
                { range: '₹50,000 – ₹1,00,000 earned',   fee: '0.75%',  color: C.cyan },
                { range: '₹1,00,000 – ₹5,00,000 earned', fee: '0.5%',   color: C.green },
                { range: 'Above ₹5,00,000 earned',        fee: '0.25%',  color: C.orange },
              ].map((t, i) => (
                <motion.div key={t.range} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: `${t.color}0a`, border: `1px solid ${t.color}25`, borderRadius: '14px' }}>
                  <span style={{ color: '#52525b', fontSize: '0.85rem' }}>{t.range}</span>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: t.color }}>{t.fee}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <FeeCalculator />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(4rem,10vw,7rem) 1.5rem', textAlign: 'center', background: '#fafafa' }}>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: '640px', margin: '0 auto', padding: 'clamp(2.5rem,6vw,3.6rem) 2rem', borderRadius: '28px', background: '#18181b', boxShadow: '0 24px 60px rgba(24,24,27,0.25)' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.3rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.9rem' }}>
            Ready to get started?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.2rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Join TLMS today — find tutors, grow your student base, or manage your coaching center. It's free to get started.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button onClick={() => navigate('/discover')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ padding: '14px 30px', background: '#fff', color: '#18181b', border: 'none', borderRadius: '999px', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer' }}>
              Browse tutors
            </motion.button>
            <motion.button onClick={() => navigate('/login')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ padding: '14px 30px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '999px', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer' }}>
              Create an account
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #f0f0f1', padding: '2rem 1.5rem', textAlign: 'center', color: '#a1a1aa', fontSize: '0.82rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.4rem' }}>
          <img src="/logo.jpeg" alt="TLMS" style={{ width: '20px', height: '20px', borderRadius: '6px', objectFit: 'cover' }} />
          <span style={{ fontWeight: 700, color: '#18181b' }}>TLMS</span>
        </div>
        © 2026 TLMS — Connect. Learn. Succeed.
      </footer>
    </div>
  )
}
