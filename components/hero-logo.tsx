"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface HeroLogoProps {
  text: string
  className?: string
}

export default function HeroLogo({ text, className = "" }: HeroLogoProps) {
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()

  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.85])
  const y = useTransform(scrollY, [0, 400], [0, -80])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center py-8 md:py-12 ${className}`}>
        <h1 className="text-display text-center px-4 md:px-6 text-stroke font-heading">
          {text}
        </h1>
      </div>
    )
  }

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className={`min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center py-8 md:py-12 ${className}`}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.1,
        }}
        className="text-display text-center px-4 md:px-6 text-stroke will-change-transform font-heading"
      >
        {text}
      </motion.h1>
    </motion.div>
  )
}
