"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoHeroProps {
  videoSrc?: string
  posterSrc?: string
  className?: string
}

export default function VideoHero({ videoSrc, posterSrc, className }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <section className={cn("relative min-h-screen flex items-center justify-center overflow-hidden", className)}>
      {/* Video or poster background */}
      {videoSrc ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : posterSrc ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${posterSrc})` }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-mg-black" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.h1
          className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-widest text-white"
          style={{
            WebkitTextStroke: "2px rgba(232, 32, 12, 0.8)",
            textShadow: "0 0 40px rgba(232, 32, 12, 0.3)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          MG COMPANY GROUP
        </motion.h1>

        <motion.p
          className="mt-4 text-zinc-300 text-sm md:text-base uppercase tracking-[0.3em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Latin Music Production
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-zinc-400 text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-zinc-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
