"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import SpecMeta from "./spec-meta"
import DiagonalArrow from "./diagonal-arrow"

const CONTACT_META = [
  { label: "Email:", value: "hola@mgcompanygroup.com" },
  { label: "Whatsapp:", value: "+57 300 000 0000" },
  { label: "Instagram:", value: "@mgcompanygroup" },
  { label: "Location:", value: "Bogotá / Cartagena" },
]

const wordVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden bg-mg-black border-t border-white/10"
      style={{
        backgroundImage: "url(/generated/cta-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-mg-black/85" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 70%, rgba(232,32,12,0.35) 0%, transparent 60%)",
        }}
      />

      <div className="relative container mx-auto px-4 md:px-6 lg:px-10 pt-16 md:pt-24 pb-10 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8 md:mb-10"
        >
          <span className="text-mg-red text-xl leading-none">&#10022;</span>
          <span className="font-mono text-mg-red text-xs md:text-sm uppercase tracking-[0.3em] font-medium">
            Cierre / Contacto
          </span>
          <span className="h-px flex-1 bg-mg-red/40" />
          <span className="font-mono text-white/40 text-[11px] md:text-xs uppercase tracking-[0.25em]">
            05 / 05
          </span>
        </motion.div>

        <div className="relative grid grid-cols-12 gap-6 md:gap-8 items-center">
          <div className="hidden md:block md:col-span-3 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -10 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto"
            >
              <div
                className="absolute inset-0 rounded-full bg-mg-red"
                style={{
                  boxShadow:
                    "0 25px 50px -12px rgba(0,0,0,0.7), inset 0 0 0 6px rgba(255,255,255,1), inset 0 -2px 8px rgba(0,0,0,0.2)",
                }}
              />
              <div className="absolute inset-4 md:inset-5 flex items-center justify-center">
                <Image
                  src="/logo-mg.png"
                  alt="MG Company Group"
                  width={140}
                  height={140}
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
            </motion.div>
          </div>

          <h2 className="col-span-12 md:col-span-9 font-heading uppercase leading-[0.85] tracking-tight text-stroke">
            <motion.span
              custom={0}
              variants={wordVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="block text-[clamp(3rem,12vw,11rem)]"
            >
              Trabajemos
            </motion.span>
            <motion.span
              custom={1}
              variants={wordVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="block text-[clamp(3rem,12vw,11rem)]"
            >
              Juntos
            </motion.span>
          </h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 md:mt-12 max-w-xl text-zinc-300 text-base md:text-lg leading-relaxed"
        >
          MG Company Group impulsa el talento latino con marketing digital,
          producción audiovisual, sonora y eventos. ¿Tienes un proyecto?
          Hablemos.
        </motion.p>

        <div className="mt-10 md:mt-14 border-t border-white/15 pt-6 md:pt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <SpecMeta items={CONTACT_META} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href="/contacto"
              className="group inline-flex items-center gap-4 border-2 border-white px-6 md:px-8 py-4 md:py-5 hover:bg-mg-red hover:border-mg-red transition-colors duration-300"
            >
              <span className="font-mono uppercase text-xs md:text-sm tracking-[0.3em] font-medium text-white">
                Iniciar proyecto
              </span>
              <DiagonalArrow
                size={28}
                strokeWidth={1.75}
                className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
