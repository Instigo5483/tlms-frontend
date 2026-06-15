import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export default function CustomCursor() {
  const [isTouch] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )

  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)
  const ringX = useSpring(mouseX, { stiffness: 140, damping: 22, mass: 0.5 })
  const ringY = useSpring(mouseY, { stiffness: 140, damping: 22, mass: 0.5 })

  const [hover, setHover] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isTouch) return

    function onMove(e) {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)
    }

    function onOver(e) {
      const el = e.target
      const interactive =
        el.tagName === 'A' || el.tagName === 'BUTTON' ||
        el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' ||
        !!el.closest('a') || !!el.closest('button') ||
        getComputedStyle(el).cursor === 'pointer'
      setHover(interactive)
    }

    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [isTouch, mouseX, mouseY])

  if (isTouch) return null

  return (
    <>
      {/* Dot — snaps to cursor */}
      <motion.div
        initial={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 99999,
          pointerEvents: 'none', borderRadius: '50%',
          x: mouseX, y: mouseY,
          translateX: '-50%', translateY: '-50%',
        }}
        animate={{
          width: clicking ? 4 : 6,
          height: clicking ? 4 : 6,
          scale: hover ? 1.4 : 1,
          background: hover ? '#06b6d4' : '#a855f7',
          boxShadow: hover
            ? '0 0 10px rgba(6,182,212,0.95), 0 0 28px rgba(6,182,212,0.4)'
            : '0 0 8px rgba(168,85,247,0.95), 0 0 22px rgba(168,85,247,0.35)',
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.15, opacity: { duration: 0.3 } }}
      />

      {/* Ring — spring-lagged */}
      <motion.div
        initial={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 99998,
          pointerEvents: 'none', borderRadius: '50%',
          x: ringX, y: ringY,
          translateX: '-50%', translateY: '-50%',
          borderWidth: '1.5px', borderStyle: 'solid',
        }}
        animate={{
          width: hover ? 44 : 26,
          height: hover ? 44 : 26,
          borderColor: hover ? 'rgba(6,182,212,0.6)' : 'rgba(168,85,247,0.45)',
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.3, opacity: { duration: 0.3 } }}
      />
    </>
  )
}
