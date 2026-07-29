"use client"

import { useEffect, useRef, useState } from "react"
import { animate, motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  delay?: number
  duration?: number
  className?: string
}

export default function AnimatedCounter({
  value,
  delay = 0,
  duration = 1.3,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setDone(true),
    })
    return () => controls.stop()
  }, [inView, value, delay, duration])

  return (
    <motion.span
      ref={ref}
      className={cn("inline-block", className)}
      initial={{ opacity: 0, scale: 0.4, y: 12 }}
      animate={
        inView
          ? done
            ? { opacity: 1, scale: [1.22, 1], y: 0 }
            : { opacity: 1, scale: 1, y: 0 }
          : undefined
      }
      transition={
        done
          ? { duration: 0.3, ease: "easeOut" }
          : { type: "spring", stiffness: 210, damping: 17, delay }
      }
    >
      {count}
    </motion.span>
  )
}
