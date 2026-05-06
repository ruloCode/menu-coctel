"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import SpecMeta from "./spec-meta"
import DiagonalArrow from "./diagonal-arrow"

interface VideoHeroProps {
  videoSrc?: string
  posterSrc?: string
  className?: string
}

const TOP_WORD = "MARCA"
const BOTTOM_WORD = "MG COMPANY GROUP"

const META_ITEMS = [
  { label: "Date:", value: "ENERO 29, 2026" },
  { label: "Website:", value: "Artistic growth company" },
  { label: "Sound:", value: "Mind of gods" },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    },
  },
}

const letterVariants = {
  hidden: { opacity: 0, y: "60%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
}

function AnimatedWord({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <motion.span
      className={cn("inline-flex overflow-hidden leading-[0.85]", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          className="inline-block whitespace-pre"
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default function VideoHero({ videoSrc, posterSrc, className }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: window.innerHeight * 0.95,
        behavior: "smooth",
      })
    }
  }

  return (
    <section
      className={cn(
        "relative min-h-[100svh] flex flex-col overflow-hidden bg-mg-black",
        className,
      )}
    >
      {videoSrc ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : posterSrc ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${posterSrc})` }}
        />
      ) : null}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(232,32,12,0.45) 0%, rgba(232,32,12,0.15) 35%, transparent 65%)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-14 pt-24 md:pt-28">
        <motion.div
          className="font-mono text-mg-red text-xs md:text-sm uppercase tracking-[0.4em] mb-4 md:mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Manual de
        </motion.div>

        <h1 className="font-heading uppercase text-white leading-[0.85] tracking-tight">
          <AnimatedWord
            text={TOP_WORD}
            className="block text-mg-red text-[clamp(5rem,18vw,17rem)] font-normal"
          />
          <AnimatedWord
            text={BOTTOM_WORD}
            className="block text-white text-[clamp(2.25rem,8.2vw,7.6rem)] font-normal mt-1 md:mt-2"
          />
        </h1>

        <motion.div
          className="mt-6 md:mt-8 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.3em] text-white/60 leading-relaxed">
            Mind of gods company group — productora artística integral.
            Marketing digital, producción audiovisual, sonido y eventos.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 px-6 md:px-10 lg:px-14 pb-8 md:pb-10 flex items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <SpecMeta items={META_ITEMS} />
        </motion.div>

        <motion.button
          type="button"
          onClick={handleScroll}
          aria-label="Scroll"
          className="group relative shrink-0 text-white hover:text-mg-red transition-colors"
          initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <DiagonalArrow size={56} strokeWidth={1.5} className="md:[--s:72px] [width:var(--s,56px)] [height:var(--s,56px)]" />
        </motion.button>
      </div>

      <div className="absolute top-0 inset-x-0 h-px bg-white/10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-white/10 pointer-events-none" />
    </section>
  )
}
