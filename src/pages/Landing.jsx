import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import Navbar from '../components/Navbar'

const grad = {
  purple: 'linear-gradient(135deg, #a855f7, #06b6d4)',
  pink:   'linear-gradient(135deg, #ec4899, #f97316)',
  green:  'linear-gradient(135deg, #10b981, #06b6d4)',
  warm:   'linear-gradient(135deg, #f97316, #ec4899)',
}

function SectionBadge({ label, color = '#a855f7' }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: '0.72rem', fontWeight: 600,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color, marginBottom: '1rem',
      padding: '4px 14px', borderRadius: '999px',
      border: `1px solid ${color}33`,
      background: `${color}0d`,
    }}>{label}</span>
  )
}

function Blob({ style }) {
  return <div style={{ position: 'absolute', pointerEvents: 'none', filter: 'blur(70px)', ...style }} />
}

export default function Landing() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const [search, setSearch] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/discover${search ? `?q=${encodeURIComponent(search)}` : ''}`)
  }

  return (
    <div ref={containerRef} style={{ background: '#050508', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <motion.section style={{
        opacity,
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 1.5rem', textAlign: 'center', paddingTop: '80px',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px', background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px', background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px)`, backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(168,85,247,0.3)', background: 'rgba(168,85,247,0.08)', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #a855f7, #06b6d4)', display: 'inline-block' }} />
            <span style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tuition Locate & Management Service</span>
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', zIndex: 1, maxWidth: '860px', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', color: '#fff' }}>
            Find the{' '}
            <span style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Perfect</span>
            <br />
            Tutor{' '}
            <span style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Near You</span>
          </h1>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', zIndex: 1, fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.45)', maxWidth: '500px', lineHeight: 1.7, marginBottom: '3rem' }}>
          Compare verified tutors and coaching centers, and connect with the right educator—all in one place.
        </motion.p>

        <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '8px', width: '100%', maxWidth: '540px', marginBottom: '4rem' }}>
          <input type="text" placeholder="Search by subject, name, or grade..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, height: '52px', padding: '0 1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '14px', color: '#fff', fontSize: '0.95rem' }} />
          <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ height: '52px', padding: '0 1.6rem', background: 'linear-gradient(135deg, #a855f7, #06b6d4)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Search</motion.button>
        </motion.form>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 'clamp(1.5rem, 4vw, 3rem)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '500+', label: 'Verified Tutors', gradient: grad.purple },
            { value: '20+',  label: 'Subjects',        gradient: grad.pink },
            { value: '50+',  label: 'Centers',         gradient: grad.green },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(168,85,247,0.6), transparent)', margin: '0 auto' }} />
        </motion.div>
      </motion.section>

      {/* ── What is TLMS ── */}
      <section style={{ padding: 'clamp(4rem,10vw,8rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <Blob style={{ top: '10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>

          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <SectionBadge label="About" />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: '1.2rem', lineHeight: 1.1 }}>
              What is{' '}
              <span style={{ background: grad.purple, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TLMS?</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.85, fontSize: '1rem', marginBottom: '1.2rem' }}>
              <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Tuition Locate & Management Service (TLMS)</strong> is a unified platform built to bridge the gap between learners and educators across India.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '2rem' }}>
              Whether you are a student searching for the right tutor in your area, a tutor growing your teaching career, or a coaching center ready to scale — TLMS brings everyone onto one intelligent platform.
            </p>
            <motion.button onClick={() => navigate('/discover')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #a855f7, #06b6d4)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
              Explore the Platform →
            </motion.button>
          </motion.div>

          {/* Pillars */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: '🎯', title: 'Locate', desc: 'Search and discover verified tutors & centers filtered by subject, grade, location, and budget.', color: '#a855f7' },
              { icon: '🤝', title: 'Connect', desc: 'Send and receive enrollment requests. Build lasting student-teacher relationships on one platform.', color: '#06b6d4' },
              { icon: '⚙️', title: 'Manage', desc: 'Track students, manage payments, and run your teaching business with built-in tools.', color: '#ec4899' },
            ].map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} whileHover={{ x: 4 }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1.2rem 1.4rem', background: `${p.color}0a`, border: `1px solid ${p.color}22`, borderRadius: '16px' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{p.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: p.color, fontSize: '0.95rem', marginBottom: '3px' }}>{p.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How TLMS Works ── */}
      <section style={{ padding: 'clamp(4rem,10vw,8rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(168,85,247,0.03) 50%, transparent)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <SectionBadge label="Process" color="#06b6d4" />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: '0.8rem' }}>
              How{' '}
              <span style={{ background: grad.purple, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TLMS Works</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem', maxWidth: '420px', margin: '0 auto' }}>Get up and running in three simple steps</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', position: 'relative' }}>
            {[
              { step: '01', icon: '👤', title: 'Create Your Profile', desc: 'Sign up as a Student, Tutor, or Tuition Center. Fill in your details — subjects, grades, location, and rates.', color: '#a855f7' },
              { step: '02', icon: '🔍', title: 'Discover & Connect', desc: 'Students browse and filter tutors by subject, grade, and location. Tutors receive join requests from interested students. Centers list their programs and start getting discovered.', color: '#06b6d4' },
              { step: '03', icon: '📚', title: 'Learn & Grow', desc: 'Get connected with your tutor or center, start learning right away, and easily handle your tuition fees — all from one place.', color: '#ec4899' },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12 }} whileHover={{ y: -5, transition: { duration: 0.2 } }} style={{ position: 'relative', padding: '2rem', background: `${s.color}08`, border: `1px solid ${s.color}22`, borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', fontSize: '3.5rem', fontWeight: 900, color: `${s.color}12`, letterSpacing: '-0.05em', lineHeight: 1 }}>{s.step}</div>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${s.color}15`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.2rem' }}>{s.icon}</div>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.6rem' }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, fontSize: '0.875rem' }}>{s.desc}</p>
                <div style={{ marginTop: '1.5rem', height: '2px', background: `linear-gradient(90deg, ${s.color}60, transparent)`, borderRadius: '1px' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why TLMS ── */}
      <section style={{ padding: 'clamp(4rem,10vw,8rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <Blob style={{ bottom: '0', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <SectionBadge label="Why Us" />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: '0.8rem' }}>
              Why Choose{' '}
              <span style={{ background: grad.purple, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TLMS?</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem', maxWidth: '420px', margin: '0 auto' }}>Built specifically for India's education ecosystem</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {[
              { icon: '🇮🇳', title: 'Built for India', desc: 'Covers all 36 states and UTs. Supports India-specific grades, subjects, and competitive exams like JEE, NEET, UPSC, and more.', color: '#a855f7' },
              { icon: '📍', title: 'Find Tutors Near You', desc: 'Share your location and instantly see tutors and coaching centers available in your area — no guessing, no calls.', color: '#06b6d4' },
              { icon: '✅', title: 'Verified Educators', desc: 'Every tutor and tuition center maintains a public profile with bio, subjects, grades, rates, and contact — fully transparent.', color: '#10b981' },
              { icon: '💸', title: 'Transparent Pricing', desc: 'Filter by monthly rate. See exactly what a tutor charges before reaching out — no hidden fees, no surprises.', color: '#f97316' },
              { icon: '🗂️', title: 'All-in-One Management', desc: 'Tutors and centers manage their students, track enrollment requests, and handle payments from a single dashboard.', color: '#ec4899' },
              { icon: '👛', title: 'Easy Fee Management', desc: 'A simple system for managing tuition fees between students and educators — no outside apps or spreadsheets needed.', color: '#a855f7' },
            ].map((r, i) => (
              <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ padding: '1.6rem', background: `${r.color}08`, border: `1px solid ${r.color}1a`, borderRadius: '18px' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>{r.icon}</div>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{r.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, fontSize: '0.845rem' }}>{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: 'clamp(4rem,10vw,8rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(6,182,212,0.03) 50%, transparent)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <SectionBadge label="Features" color="#ec4899" />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: '0.8rem' }}>
              Everything in{' '}
              <span style={{ background: grad.pink, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>One Platform</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>Powerful tools designed for students, tutors, and centers</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
            {[
              { icon: '🔎', title: 'Smart Search & Filter', desc: 'Filter by subject, grade, location, and budget to find your perfect match.', color: '#a855f7' },
              { icon: '🧑‍💼', title: 'Rich Educator Profiles', desc: 'Tutors and centers showcase their specialties, rates, bio, and contact info.', color: '#06b6d4' },
              { icon: '📩', title: 'Join Requests', desc: 'Students send a join request to any tutor or center they like. Tutors and centers can then accept or decline with a single tap.', color: '#10b981' },
              { icon: '📊', title: 'Student Dashboard', desc: 'Students track their enrolled tutors and centers and manage all connections in one view.', color: '#f97316' },
              { icon: '💰', title: 'Payment Tracking', desc: 'Log and track payments per student. Full payment history for tutors and centers.', color: '#ec4899' },
              { icon: '👛', title: 'Wallet & Fees', desc: 'Keep all your tuition payments in one place. Send or receive fees without needing any outside app.', color: '#a855f7' },
              { icon: '📱', title: 'Fully Responsive', desc: 'Works beautifully on mobile, tablet, and desktop — learn on the go.', color: '#06b6d4' },
              { icon: '🔒', title: 'Safe & Private', desc: 'Your account is protected — only you can see and manage your profile and personal information.', color: '#10b981' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} whileHover={{ y: -3, transition: { duration: 0.15 } }} style={{ padding: '1.4rem', background: `${f.color}07`, border: `1px solid ${f.color}18`, borderRadius: '16px' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '0.7rem' }}>{f.icon}</div>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, fontSize: '0.8rem' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Students ── */}
      <section style={{ padding: 'clamp(4rem,10vw,8rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <Blob style={{ top: '20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ marginBottom: '3rem' }}>
            <SectionBadge label="For Students" />
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: '0.6rem' }}>
              Find your{' '}
              <span style={{ background: grad.purple, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ideal tutor</span>
              {' '}in minutes
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.7 }}>Stop wasting time searching. TLMS puts the right educator right in front of you — local, affordable, and perfectly matched to your needs.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🎓', title: 'Any Grade, Any Subject', desc: 'From Nursery to Class 12, JEE, NEET, UPSC and beyond — find specialists for every stage of your academic journey.' },
              { icon: '📍', title: 'Near You or Anywhere', desc: 'Use your location to find tutors close to where you live, or connect with educators from anywhere in India.' },
              { icon: '💬', title: 'Compare & Choose', desc: 'View detailed profiles including bio, subjects, grade levels, and monthly rates before sending a single request.' },
              { icon: '📋', title: 'Manage Your Learning', desc: 'Your student dashboard keeps all enrolled tutors and centers in one place — no more scattered contacts.' },
            ].map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ padding: '1.6rem', background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.18)', borderRadius: '18px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.93rem', marginBottom: '0.4rem' }}>{b.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.845rem', lineHeight: 1.65 }}>{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ marginTop: '2rem' }}>
            <motion.button onClick={() => navigate('/discover')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ padding: '13px 30px', background: 'linear-gradient(135deg, #a855f7, #06b6d4)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
              Find a Tutor Now →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── For Tutors ── */}
      <section style={{ padding: 'clamp(4rem,10vw,8rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(6,182,212,0.03) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <Blob style={{ top: '10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ marginBottom: '3rem', textAlign: 'right' }}>
            <SectionBadge label="For Tutors" color="#06b6d4" />
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: '0.6rem' }}>
              Grow your{' '}
              <span style={{ background: grad.purple, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>teaching career</span>
              {' '}with TLMS
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.7, marginLeft: 'auto' }}>Whether you are just starting out or already teaching, TLMS gives you the tools to find students, manage your work, and get paid — all in one place.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🌟', title: 'Get Discovered by Students', desc: 'Create a public profile with your subjects, grades, rates, and bio. Students searching in your area will find you instantly.' },
              { icon: '📥', title: 'Receive Join Requests', desc: 'When a student is interested, they send you a request. Simply accept or decline it from your dashboard.' },
              { icon: '🧑‍🎓', title: 'Manage Your Students', desc: 'See all your active students in one organised list. Remove students who are no longer enrolled — changes reflect instantly.' },
              { icon: '💳', title: 'Track Your Earnings', desc: 'Log monthly payments per student and keep a clear record of all your earnings — all from your dashboard, no extra tools needed.' },
            ].map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ padding: '1.6rem', background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.18)', borderRadius: '18px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.93rem', marginBottom: '0.4rem' }}>{b.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.845rem', lineHeight: 1.65 }}>{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <motion.button onClick={() => navigate('/login')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ padding: '13px 30px', background: 'linear-gradient(135deg, #06b6d4, #a855f7)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
              Join as a Tutor →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── For Tuition Centers ── */}
      <section style={{ padding: 'clamp(4rem,10vw,8rem) 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <Blob style={{ bottom: '10%', left: '-5%', width: '600px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }} style={{ marginBottom: '3rem' }}>
            <SectionBadge label="For Tuition Centers" color="#ec4899" />
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: '0.6rem' }}>
              Scale your{' '}
              <span style={{ background: grad.pink, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>coaching center</span>
              {' '}with confidence
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '540px', lineHeight: 1.7 }}>TLMS gives coaching centers a professional presence online and the management tools to operate efficiently — from new enrollments to payment tracking.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🏫', title: 'Professional Center Profile', desc: 'List your center with name, address, subjects, grade levels, monthly rate, bio, and website — a complete public listing for students to find you.' },
              { icon: '🗺️', title: 'Local & Regional Reach', desc: 'Be discoverable by students and parents searching for coaching centers in your district, area, or state.' },
              { icon: '👥', title: 'Student Enrollment System', desc: 'Manage incoming requests and your enrolled student base directly from your center dashboard — no spreadsheets needed.' },
              { icon: '📈', title: 'Payment & Financial Tracking', desc: 'Track monthly fees per student, maintain payment records, and use the built-in wallet to manage your center\'s finances.' },
            ].map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ padding: '1.6rem', background: 'rgba(236,72,153,0.07)', border: '1px solid rgba(236,72,153,0.18)', borderRadius: '18px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.93rem', marginBottom: '0.4rem' }}>{b.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.845rem', lineHeight: 1.65 }}>{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ marginTop: '2rem' }}>
            <motion.button onClick={() => navigate('/login')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ padding: '13px 30px', background: 'linear-gradient(135deg, #ec4899, #f97316)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
              Register Your Center →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(4rem,10vw,8rem) 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <Blob style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ maxWidth: '640px', margin: '0 auto', padding: 'clamp(2.5rem,6vw,4rem) 2rem', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '28px', background: 'rgba(168,85,247,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)' }} />
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', marginBottom: '1rem' }}>
            Ready to{' '}
            <span style={{ background: grad.purple, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get Started?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Join TLMS today — find tutors, grow your student base, or manage your coaching center. It's free to get started.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button onClick={() => navigate('/discover')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #a855f7, #06b6d4)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
              Browse Tutors
            </motion.button>
            <motion.button onClick={() => navigate('/login')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ padding: '14px 32px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>
              Create an Account
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '2rem 1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '0.82rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.4rem' }}>
          <img src="/logo.jpeg" alt="TLMS" style={{ width: '20px', height: '20px', borderRadius: '6px', objectFit: 'cover' }} />
          <span style={{ fontWeight: 700, background: grad.purple, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TLMS</span>
        </div>
        © 2026 TLMS — Connect. Learn. Succeed.
      </footer>
    </div>
  )
}
