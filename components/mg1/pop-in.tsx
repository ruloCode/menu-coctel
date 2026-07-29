"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PopInProps {
  children: React.ReactNode
  delay?: number
  rotate?: number
  className?: string
}

export default function PopIn({ children, delay = 0, rotate = 0, className }: PopInProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, scale: 0.6, rotate, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
        delay,
        filter: { duration: 0.4, delay },
      }}
    >
      {children}
    </motion.div>
  )
}
