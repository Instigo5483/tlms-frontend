import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import Navbar from '../components/Navbar'

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
        padding: '0 1.5rem', textAlign: 'center',
        overflow: 'hidden'
      }}>

        {/* Ambient blobs */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%',
          width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '15%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(50px)'
        }} />

        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)'
        }} />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '2rem', position: 'relative', zIndex: 1 }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            border: '1px solid rgba(168,85,247,0.3)',
            background: 'rgba(168,85,247,0.08)',
            fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
              display: 'inline-block'
            }} />
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Tuition Locate & Management Service
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '860px', marginBottom: '1.5rem' }}
        >
          <h1 style={{
            fontSize: 'clamp(2.8rem, 8vw, 6rem)',
            fontWeight: 900, lineHeight: 1.0,
            letterSpacing: '-0.04em', color: '#fff'
          }}>
            Find the{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Perfect</span>
            <br />
            Tutor{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ec4899, #f97316)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Near You</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative', zIndex: 1,
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '500px', lineHeight: 1.7, marginBottom: '3rem'
          }}
        >
          Compare verified tutors and coaching centers, and connect with the right educator—all in one place.
        </motion.p>

        {/* Search */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', gap: '8px',
            width: '100%', maxWidth: '540px', marginBottom: '4rem'
          }}
        >
          <input
            type="text"
            placeholder="Search by subject, name, or grade..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, height: '52px', padding: '0 1.2rem',
              background: 'rgba(255,255,255,0.05) !important',
              border: '1px solid rgba(168,85,247,0.2) !important',
              borderRadius: '14px !important', color: '#fff !important',
              fontSize: '0.95rem'
            }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              height: '52px', padding: '0 1.6rem',
              background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
              color: '#fff', border: 'none', borderRadius: '14px',
              fontWeight: 700, fontSize: '0.9rem',
              cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            Search
          </motion.button>
        </motion.form>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', gap: 'clamp(1.5rem, 4vw, 3rem)',
            flexWrap: 'wrap', justifyContent: 'center'
          }}
        >
          {[
            { value: '500+', label: 'Verified Tutors', gradient: 'linear-gradient(135deg, #a855f7, #06b6d4)' },
            { value: '20+', label: 'Subjects', gradient: 'linear-gradient(135deg, #ec4899, #f97316)' },
            { value: '50+', label: 'Centers', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800,
                background: stat.gradient,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>{stat.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '1px', height: '40px',
              background: 'linear-gradient(to bottom, rgba(168,85,247,0.6), transparent)',
              margin: '0 auto'
            }}
          />
        </motion.div>
      </motion.section>

      {/* ── Features ── */}
      <section style={{ padding: '8rem 1.5rem', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(40px)'
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <span style={{
            display: 'inline-block', fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(168,85,247,0.8)', marginBottom: '1rem',
            padding: '4px 12px', borderRadius: '999px',
            border: '1px solid rgba(168,85,247,0.2)',
            background: 'rgba(168,85,247,0.06)'
          }}>Features</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900, letterSpacing: '-0.03em',
            color: '#fff', marginBottom: '1rem'
          }}>
            Why{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>TLMS?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            Everything you need to find, connect and learn
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            { icon: '◈', title: 'Smart Matching', desc: 'Filter by subject, grade level, and budget to find your perfect tutor instantly.', color: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)' },
            { icon: '⟡', title: 'Verified Profiles', desc: 'Every tutor and center is verified. Review ratings and bios before you connect.', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)' },
            { icon: '⊕', title: 'Local & Online', desc: 'Find tutors near you or online. GPS-powered discovery for your area.', color: '#ec4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{ padding: '2rem', background: f.bg, border: `1px solid ${f.border}`, borderRadius: '20px' }}
            >
              <div style={{
                width: '44px', height: '44px', border: `1px solid ${f.border}`,
                borderRadius: '12px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.3rem',
                marginBottom: '1.5rem', color: f.color, background: f.bg
              }}>{f.icon}</div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, fontSize: '0.88rem' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats band ── */}
      <section style={{ padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(168,85,247,0.05) 0%, rgba(6,182,212,0.05) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)'
        }} />
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '2rem', position: 'relative', zIndex: 1, textAlign: 'center'
        }}>
          {[
            { value: '10M+', label: 'Sessions Booked', gradient: 'linear-gradient(135deg, #a855f7, #06b6d4)' },
            { value: '50K+', label: 'Active Students', gradient: 'linear-gradient(135deg, #ec4899, #f97316)' },
            { value: '15s', label: 'Avg Match Time', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
            { value: '99.9%', label: 'Uptime', gradient: 'linear-gradient(135deg, #a855f7, #06b6d4)' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900,
                letterSpacing: '-0.03em',
                background: s.gradient,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '8rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(40px)'
        }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem',
            border: '1px solid rgba(168,85,247,0.2)',
            borderRadius: '28px', background: 'rgba(168,85,247,0.05)',
            position: 'relative', overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '60%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)'
          }} />
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 900, letterSpacing: '-0.03em',
            color: '#fff', marginBottom: '1rem'
          }}>
            Ready to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Get Started?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Join thousands of students finding their perfect tutor today.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              onClick={() => navigate('/discover')}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                color: '#fff', border: 'none', borderRadius: '14px',
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer'
              }}
            >Browse Tutors</motion.button>
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{
                padding: '14px 32px', background: 'transparent', color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px',
                fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer'
              }}
            >Join as Tutor</motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '2rem 1.5rem', textAlign: 'center',
        color: 'rgba(255,255,255,0.15)', fontSize: '0.82rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.4rem' }}>
          <img src="/tlms-frontend/logo.jpeg" alt="TLMS" style={{ width: '20px', height: '20px', borderRadius: '6px', objectFit: 'cover' }} />
          <span style={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>TLMS</span>
        </div>
        © 2026 TLMS — Connect. Learn. Succeed.
      </footer>
    </div>
  )
}