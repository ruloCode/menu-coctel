"use client"

import { useEffect, useRef } from "react"

const GLARE_IDLE =
  "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.28), rgba(255,255,255,0) 55%)"

export default function HeroDisc() {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const glare = glareRef.current
    if (!card) return

    const ac = new AbortController()
    const sig = { signal: ac.signal }
    let raf = 0
    let spin = 0
    let vel = 0
    let dragging = false
    let lastX = 0
    let rx = 0
    let ry = 0

    const apply = () => {
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotate(${spin}deg)`
    }

    card.addEventListener(
      "pointermove",
      (e) => {
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        if (dragging) {
          const d = e.clientX - lastX
          lastX = e.clientX
          spin += d * 0.5
          vel = d * 0.5
        } else {
          ry = (px - 0.5) * 24
          rx = -(py - 0.5) * 24
        }
        if (glare) {
          glare.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.34), rgba(255,255,255,0) 55%)`
        }
        apply()
      },
      sig,
    )

    card.addEventListener(
      "pointerdown",
      (e) => {
        dragging = true
        lastX = e.clientX
        vel = 0
        if (raf) cancelAnimationFrame(raf)
        card.setPointerCapture(e.pointerId)
        card.style.transition = "none"
        card.style.cursor = "grabbing"
      },
      sig,
    )

    const end = () => {
      if (!dragging) return
      dragging = false
      card.style.cursor = "grab"
      const momentum = () => {
        spin += vel
        vel *= 0.95
        apply()
        if (Math.abs(vel) > 0.05) raf = requestAnimationFrame(momentum)
        else card.style.transition = "transform 0.18s ease-out"
      }
      raf = requestAnimationFrame(momentum)
    }
    card.addEventListener("pointerup", end, sig)
    card.addEventListener("pointercancel", end, sig)

    card.addEventListener(
      "pointerleave",
      () => {
        if (dragging) return
        rx = 0
        ry = 0
        apply()
        if (glare) glare.style.background = GLARE_IDLE
      },
      sig,
    )

    return () => {
      ac.abort()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div style={{ perspective: "900px" }}>
      <div
        ref={cardRef}
        className="relative cursor-grab select-none touch-none will-change-transform"
        style={{ transformStyle: "preserve-3d", transition: "transform 0.18s ease-out" }}
      >
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full h-auto drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)]"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="mg1-hero-ruby" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#ff6b52" />
              <stop offset="45%" stopColor="#E8200C" />
              <stop offset="80%" stopColor="#5e0d04" />
              <stop offset="100%" stopColor="#1c0300" />
            </radialGradient>
            <radialGradient id="mg1-hero-gold" cx="35%" cy="28%" r="95%">
              <stop offset="0%" stopColor="#f9e79b" />
              <stop offset="55%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#8a6a1c" />
            </radialGradient>
            <path id="mg1-hero-arc" d="M 100 57 a 43 43 0 1 1 -0.1 0" fill="none" />
          </defs>
          <g
            className="mg1-anim"
            style={{ transformOrigin: "100px 100px", animation: "mg1-spin 26s linear infinite" }}
          >
            <circle cx="100" cy="100" r="96" fill="url(#mg1-hero-ruby)" />
            <circle cx="100" cy="100" r="96" fill="none" stroke="#d4af37" strokeWidth="1.6" />
            <circle cx="100" cy="100" r="86" fill="none" stroke="#00000066" strokeWidth="1.4" />
            <circle cx="100" cy="100" r="76" fill="none" stroke="#00000066" strokeWidth="1.2" />
            <circle cx="100" cy="100" r="66" fill="none" stroke="#00000066" strokeWidth="1" />
            <circle cx="100" cy="100" r="56" fill="none" stroke="#00000066" strokeWidth="1" />
            <text
              fontFamily="var(--font-mono), monospace"
              fontSize="6.4"
              fontWeight="500"
              fill="#e9c766"
              letterSpacing="2.4"
            >
              <textPath href="#mg1-hero-arc">
                MUSIC GENERATION ONE · PRIMERA EDICIÓN · BOGOTÁ
              </textPath>
            </text>
            <circle cx="100" cy="100" r="34" fill="url(#mg1-hero-gold)" />
            <circle cx="100" cy="100" r="34" fill="none" stroke="#7a5c15" strokeWidth="1.2" />
            <circle cx="100" cy="100" r="30.5" fill="none" stroke="#7a5c15" strokeWidth="0.7" />
            <text
              x="100"
              y="104"
              textAnchor="middle"
              fontFamily="var(--font-bebas), sans-serif"
              fontSize="21"
              fill="#5a1206"
            >
              MG1
            </text>
            <text
              x="100"
              y="115"
              textAnchor="middle"
              fontFamily="var(--font-mono), monospace"
              fontSize="5.5"
              fontWeight="500"
              fill="#5a1206"
              letterSpacing="1.5"
            >
              DISCO RUBY
            </text>
            <circle cx="100" cy="100" r="3.2" fill="#1c0300" />
          </g>
        </svg>
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-full mix-blend-screen"
          style={{ background: GLARE_IDLE }}
        />
      </div>
    </div>
  )
}
