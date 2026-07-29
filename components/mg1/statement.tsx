"use client"

import { motion } from "framer-motion"

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
}

const word = {
  hidden: { opacity: 0, y: 46, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Statement() {
  return (
    <motion.p
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="font-heading uppercase leading-[0.9] tracking-tight text-[clamp(2.75rem,7vw,6.5rem)]"
    >
      <motion.span variants={word} className="inline-block text-mg-red">
        Canciones,
      </motion.span>{" "}
      <span className="relative inline-block text-zinc-600">
        <motion.span variants={word} className="inline-block">
          no freestyle
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-[52%] h-[0.075em] w-full origin-left bg-mg-red"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        />
      </span>
      <motion.span variants={word} className="inline-block">
        .
      </motion.span>
    </motion.p>
  )
}
