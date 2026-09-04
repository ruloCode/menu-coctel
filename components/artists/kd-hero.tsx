"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { ArrowLeft } from "lucide-react"

const NOMBRE = "KAREN DAYANNA"

const salida = [0.16, 1, 0.3, 1] as const

/**
 * Cortina de apertura: cada letra sube desde debajo de su propia linea de
 * recorte, como si el nombre se revelara detras de una mascara. El espacio
 * entre nombre y apellido se dibuja aparte para que no colapse.
 */
function NombreAnimado({ reducido }: { reducido: boolean }) {
  return (
    <h1
      aria-label="Karen Dayanna"
      className="flex flex-wrap font-heading uppercase leading-[0.82] tracking-[-0.01em] text-white text-[clamp(3.5rem,13vw,11rem)]"
    >
      {NOMBRE.split("").map((letra, i) =>
        letra === " " ? (
          <span key={i} className="w-[0.28em]" />
        ) : (
          <span key={i} className="overflow-hidden py-[0.06em]">
            <motion.span
              className="block"
              initial={reducido ? { y: 0 } : { y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 1.1,
                delay: reducido ? 0 : 0.25 + i * 0.045,
                ease: salida,
              }}
            >
              {letra}
            </motion.span>
          </span>
        )
      )}
    </h1>
  )
}

function Chevrones({ y }: { y?: MotionValue<number> }) {
  return (
    <motion.svg
      style={y ? { y } : undefined}
      width="34"
      height="72"
      viewBox="0 0 34 72"
      fill="none"
      aria-hidden="true"
      className="text-white/70"
    >
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M4 ${6 + i * 22} L17 ${20 + i * 22} L30 ${6 + i * 22}`}
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="square"
          initial={{ opacity: 0.25 }}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{
            duration: 2.1,
            repeat: Infinity,
            delay: i * 0.22,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.svg>
  )
}

export default function KdHero() {
  const ref = useRef<HTMLElement>(null)
  const reducido = useReducedMotion() ?? false

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // La foto se queda atras del texto al hacer scroll (parallax clasico) y se
  // funde a negro justo antes de que la seccion salga de pantalla.
  const fotoY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const fotoEscala = useTransform(scrollYProgress, [0, 1], [1.06, 1.16])
  const velo = useTransform(scrollYProgress, [0.35, 1], [0, 0.85])
  const textoY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const textoOpacidad = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const chevronY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), {
    stiffness: 90,
    damping: 20,
  })

  // El panel del retrato deriva mas rapido que el fondo: es lo que da la
  // sensacion de capas sin recurrir a sombras.
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -90])

  const estatico = reducido

  return (
    <section
      ref={ref}
      className="kd-grain relative -mt-16 flex min-h-[92svh] items-end overflow-hidden border-b border-white/10 md:-mt-24 md:min-h-[100svh] lg:-mt-28"
    >
      {/* De fondo, la misma toma que abre su press kit: apaisada, aguanta
          cualquier ancho sin convertirse en un primer plano recortado. */}
      <motion.div
        className="absolute inset-0"
        style={estatico ? undefined : { y: fotoY, scale: fotoEscala }}
      >
        <Image
          src="/artists/karen-dayanna/kd-portrait.jpg"
          alt="Karen Dayanna"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_12%] md:hidden"
        />
        <Image
          src="/artists/karen-dayanna/kd-live-wide.jpg"
          alt="Karen Dayanna en vivo en La Casa de Los Amigos"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-[58%_45%] md:block"
        />
      </motion.div>

      {/* Gradientes: legibilidad abajo e izquierda, aire arriba a la derecha */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050509] via-[#050509]/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050509]/85 via-[#050509]/20 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 12% 92%, rgba(167,139,250,0.20) 0%, transparent 62%), radial-gradient(ellipse 40% 35% at 95% 8%, rgba(232,32,12,0.16) 0%, transparent 60%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#050509]"
        style={estatico ? { opacity: 0 } : { opacity: velo }}
      />

      <motion.div
        className="container relative mx-auto w-full px-4 pb-14 pt-44 md:px-6 md:pb-20 md:pt-64 lg:px-10 xl:max-w-[min(100%,72rem)] xl:pr-0"
        style={estatico ? undefined : { y: textoY, opacity: textoOpacidad }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <Link
            href="/artistas"
            className="group mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/55 transition-colors hover:text-white md:mb-10"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            Roster
          </Link>
        </motion.div>

        <div className="mb-5 flex items-center gap-3 md:mb-7">
          <motion.span
            className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-mg-red md:text-xs"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: salida }}
          >
            [ Artista MG / Cantautora ]
          </motion.span>
          <motion.span
            className="h-px bg-gradient-to-r from-mg-red via-[#a78bfa] to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "min(28vw, 22rem)" }}
            transition={{ duration: 1.2, delay: 0.3, ease: salida }}
          />
        </div>

        <NombreAnimado reducido={estatico} />

        {/* Su firma manuscrita, vectorizada del press kit, revelada de izquierda
            a derecha como si se estuviera escribiendo. */}
        <motion.div
          className="mt-6 w-[min(78vw,30rem)] md:mt-8"
          initial={estatico ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.6, delay: 1.05, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/artists/karen-dayanna/firma.svg"
            alt=""
            aria-hidden="true"
            className="w-full opacity-80"
          />
        </motion.div>

        <motion.div
          className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/65 md:text-xs"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.35, ease: salida }}
        >
          <span>Bogotá, Colombia</span>
          <span className="text-[#a78bfa]">●</span>
          <span>Canción de autor · Pop · Indie · Folk</span>
          <span className="text-mg-red">●</span>
          <span>MG Company Group</span>
        </motion.div>

        <motion.p
          className="kd-contrast mt-5 max-w-2xl text-lg leading-relaxed text-white/75 md:text-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5, ease: salida }}
        >
          Canciones sobre la memoria y todo lo que perdura. En vivo, mucho más
          que un show: un encuentro.
        </motion.p>
      </motion.div>

      <div className="pointer-events-none absolute right-10 top-1/2 hidden w-[19rem] -translate-y-1/2 xl:block 2xl:w-[22rem]">
        <motion.figure
          style={estatico ? undefined : { y: panelY }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 0.7, ease: salida }}
        >
          <div className="kd-grain relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/15 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)]">
            <Image
              src="/artists/karen-dayanna/kd-portrait.jpg"
              alt=""
              aria-hidden="true"
              fill
              sizes="22rem"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050509]/55 via-transparent to-transparent" />
          </div>
        </motion.figure>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-8 right-5 hidden md:right-10 md:block xl:right-[24rem] 2xl:right-[27rem]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <Chevrones y={estatico ? undefined : chevronY} />
      </motion.div>
    </section>
  )
}
