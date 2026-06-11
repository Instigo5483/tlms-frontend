import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { useRef, useState } from 'react'
import Navbar from '../components/Navbar'

export default function Landing() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const [search, setSearch] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/discover${search ? `?q=${encodeURIComponent(search)}` : ''}`)
  }

  return (
    <div ref={containerRef} style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <motion.section style={{ opacity }} style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 1.5rem', textAlign: 'center',
        overflow: 'hidden'
      }}>

        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)'
        }} />

        {/* Glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
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
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#fff', display: 'inline-block'
            }} />
            Tuition Locate & Management Service
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', zIndex: 1, maxWidth: '800px', marginBottom: '1.5rem' }}
        >
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.04em', color: '#fff'
          }}>
            Find the perfect
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.4) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              tutor near you
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative', zIndex: 1,
            fontSize: '1.1rem', color: 'rgba(255,255,255,0.45)',
            maxWidth: '500px', lineHeight: 1.7,
            marginBottom: '3rem'
          }}
        >
          Connect with verified tutors and tuition centers.
          Filter by subject, grade, and budget.
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
            width: '100%', maxWidth: '520px',
            marginBottom: '4rem'
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
              border: '1px solid rgba(255,255,255,0.1) !important',
              borderRadius: '12px !important', color: '#fff !important',
              fontSize: '0.95rem'
            }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              height: '52px', padding: '0 1.6rem',
              background: '#fff', color: '#000',
              border: 'none', borderRadius: '12px',
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
            display: 'flex', gap: '3rem', flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {[
            { value: '500+', label: 'Verified Tutors' },
            { value: '20+', label: 'Subjects' },
            { value: '50+', label: 'Centers' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px', letterSpacing: '0.05em' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            position: 'absolute', bottom: '2rem', left: '50%',
            transform: 'translateX(-50%)', zIndex: 1
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '1px', height: '40px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
              margin: '0 auto'
            }}
          />
        </motion.div>
      </motion.section>

      {/* Features section */}
      <section style={{
        padding: '8rem 1.5rem',
        maxWidth: '1100px', margin: '0 auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#fff', marginBottom: '1rem'
          }}>Why TLMS?</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            Everything you need to find, connect and learn
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
          {[
            { icon: '⟡', title: 'Smart Matching', desc: 'Filter by subject, grade level, and budget to find your perfect tutor instantly.' },
            { icon: '◈', title: 'Verified Profiles', desc: 'Every tutor and center is verified. Review ratings and bios before you connect.' },
            { icon: '⊕', title: 'Local & Online', desc: 'Find tutors near you or online. GPS-powered discovery for your area.' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ background: 'rgba(255,255,255,0.04)' }}
              style={{
                padding: '2.5rem', background: '#000',
                cursor: 'default', transition: 'background 0.3s'
              }}
            >
              <div style={{
                width: '40px', height: '40px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', marginBottom: '1.5rem',
                color: 'rgba(255,255,255,0.6)'
              }}>{f.icon}</div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, fontSize: '0.9rem' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '600px', margin: '0 auto',
            padding: '4rem 2rem',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#fff', marginBottom: '1rem'
          }}>
            Ready to get started?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Join thousands of students finding their perfect tutor today.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              onClick={() => navigate('/discover')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '14px 32px', background: '#fff', color: '#000',
                border: 'none', borderRadius: '12px',
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer'
              }}
            >
              Browse Tutors
            </motion.button>
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '14px 32px',
                background: 'transparent', color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer'
              }}
            >
              Join as Tutor
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.2)',
        fontSize: '0.85rem'
      }}>
        © 2026 TLMS — Tuition Locate & Management Service
      </footer>
    </div>
  )
}