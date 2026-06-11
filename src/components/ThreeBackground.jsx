import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let cachedModel = null
let isLoading = false
let loadCallbacks = []

function preloadModel(url, onProgress) {
  if (cachedModel) return Promise.resolve(cachedModel)
  if (isLoading) return new Promise(resolve => loadCallbacks.push(resolve))
  isLoading = true
  return new Promise((resolve) => {
    const loader = new GLTFLoader()
    loader.load(url, (gltf) => {
      cachedModel = gltf
      isLoading = false
      loadCallbacks.forEach(cb => cb(gltf))
      loadCallbacks = []
      resolve(gltf)
    }, (xhr) => {
      if (xhr.total && onProgress) onProgress(Math.round((xhr.loaded / xhr.total) * 100))
    }, (err) => {
      console.error('Model load error:', err)
      isLoading = false
      resolve(null)
    })
  })
}

const MODEL_URL = 'https://tlms-backend-production.up.railway.app/static/models/lowpoly_stylized_classroom.glb'

export default function ThreeBackground({ onLoaded }) {
  const mountRef = useRef(null)
  const [progress, setProgress] = useState(cachedModel ? 100 : 0)
  const [loaded, setLoaded] = useState(!!cachedModel)

  useEffect(() => {
    const canvas = mountRef.current
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x0a0f1e, 25, 70)

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 1.2, 6)
    camera.lookAt(0, 0.8, 0)

    const lights = [
      { pos: [0, 10, 10],  i: 1.8 },
      { pos: [0, 5, -12],  i: 1.5 },
      { pos: [-8, 4, 0],   i: 1.2 },
      { pos: [8, 4, 0],    i: 1.2 },
      { pos: [0, -4, 0],   i: 1.0 },
      { pos: [0, 10, -5],  i: 1.0 },
    ]
    lights.forEach(({ pos, i }) => {
      const l = new THREE.DirectionalLight(0xffffff, i)
      l.position.set(...pos)
      scene.add(l)
    })
    scene.add(new THREE.AmbientLight(0xffffff, 1.5))

    let model
    preloadModel(MODEL_URL, (p) => setProgress(p)).then((gltf) => {
      if (!gltf) return
      model = gltf.scene.clone()
      model.scale.set(1.5, 1.5, 1.5)
      model.position.set(0, -1.5, 0)
      model.traverse(child => {
        if (child.isMesh) {
          child.material = child.material.clone()
          child.material.transparent = true
          child.material.opacity = 0.92
        }
      })
      scene.add(model)
      setProgress(100)
      setTimeout(() => { setLoaded(true); if (onLoaded) onLoaded() }, 600)
    })

    const mouse = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.6
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.3
    }
    window.addEventListener('mousemove', onMouseMove)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let frame
    const animate = () => {
      frame = requestAnimationFrame(animate)
      target.x += (mouse.x - target.x) * 0.03
      target.y += (mouse.y - target.y) * 0.03
      camera.position.x = 0 + target.x * 0.4
      camera.position.y = 1.2 + target.y * 0.25
      camera.lookAt(0, 0.8, 0)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return (
    <>
      <canvas ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />

      {/* Loading screen */}
      {!loaded && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: '#06090f',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '0',
          transition: 'opacity 0.6s',
        }}>
          {/* Logo */}
          <div style={{
            fontSize: '2.2rem', fontWeight: 900,
            color: '#f1f5f9', letterSpacing: '0.15em',
            marginBottom: '0.4rem'
          }}>
            TLMS
          </div>
          <div style={{
            fontSize: '0.8rem', color: '#334155',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: '4rem'
          }}>
            Tuition Locate & Management Service
          </div>

          {/* Animated classroom icon */}
          <div style={{
            width: '64px', height: '64px', marginBottom: '2.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem',
            animation: 'float 2s ease-in-out infinite'
          }}>
            🎓
          </div>

          {/* Progress bar */}
          <div style={{ width: '260px', marginBottom: '1rem' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#475569', letterSpacing: '0.1em' }}>
                LOADING CLASSROOM
              </span>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700,
                color: '#1a73e8'
              }}>
                {progress}%
              </span>
            </div>
            <div style={{
              width: '100%', height: '2px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '999px', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #1a73e8, #60a5fa)',
                borderRadius: '999px',
                transition: 'width 0.4s ease',
                boxShadow: '0 0 8px rgba(26,115,232,0.6)'
              }} />
            </div>
          </div>

          {/* Hint */}
          <p style={{
            fontSize: '0.72rem', color: '#1e293b',
            letterSpacing: '0.08em', marginTop: '1rem'
          }}>
            {progress < 30 ? 'Preparing classroom...' :
             progress < 60 ? 'Loading assets...' :
             progress < 90 ? 'Almost ready...' : 'Entering classroom...'}
          </p>

          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
        </div>
      )}
    </>
  )
}