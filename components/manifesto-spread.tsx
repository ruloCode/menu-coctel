"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ManifestoSpreadProps {
  className?: string
}

const COLLAGE_IMAGES = [
  {
    src: "/artists/miguelacho-tf/tf-03.jpg",
    alt: "Sesión de estudio MG",
    caption: "BTS / ESTUDIO",
  },
  {
    src: "/artists/bombo-hustle/bombo-02.jpg",
    alt: "Producción en vivo MG",
    caption: "EN VIVO",
  },
]

const HERO_IMAGE = {
  src: "/artists/solofk/solofk-02.jpg",
  alt: "Artista MG en sesión",
}

export default function ManifestoSpread({ className }: ManifestoSpreadProps) {
  return (
    <section
      className={cn(
        "relative bg-mg-black border-t border-white/10 overflow-hidden",
        className,
      )}
    >
      <div className="relative container mx-auto px-4 md:px-6 lg:px-10 pt-16 md:pt-24 pb-0">
        <div className="grid grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="col-span-12 md:col-span-7 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-5 md:mb-6"
            >
              <span className="text-mg-red text-xl leading-none">&#10022;</span>
              <span className="font-mono text-mg-red text-xs md:text-sm uppercase tracking-[0.3em] font-medium">
                A big dream needs a great team
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 md:space-y-5 max-w-xl"
            >
              <p className="text-white text-base md:text-lg leading-relaxed">
                <span className="font-mono text-mg-red uppercase tracking-wider text-sm">
                  MG (Mind of Gods)
                </span>{" "}
                es una compañía dedicada a la creación, producción y promoción
                de experiencias artísticas únicas, combinando el poder del
                marketing digital, la producción audiovisual y sonora, y la
                gestión de eventos.
              </p>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                Ofrecemos soluciones creativas e innovadoras que potencian el
                talento y conectan con el público de manera auténtica. Una
                compañía versátil, en constante evolución, diseñada para
                atender artistas emergentes, marcas y profesionales de la
                industria creativa.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 md:mt-10 grid grid-cols-2 gap-3 md:gap-4"
            >
              {COLLAGE_IMAGES.map((img, i) => (
                <div
                  key={img.src}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden border border-white/10",
                    i === 0 && "translate-y-2 md:translate-y-4",
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 30vw"
                    className="object-cover grayscale-[20%] contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/80">
                    {img.caption}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="col-span-12 md:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden border border-white/10"
            >
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -left-8 md:-left-14 top-1/2 -translate-y-1/2 z-10"
              style={{ transformOrigin: "center" }}
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40">
                <div
                  className="absolute inset-0 rounded-full bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]"
                  style={{
                    boxShadow:
                      "0 25px 50px -12px rgba(0,0,0,0.7), inset 0 0 0 6px rgba(255,255,255,1), inset 0 -2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <div className="absolute inset-3 md:inset-4 flex items-center justify-center">
                  <Image
                    src="/logo-mg.png"
                    alt="MG"
                    width={120}
                    height={120}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 md:mt-16 border-t border-white/15 pt-4 md:pt-6"
        >
          <h3
            className="font-heading text-white uppercase leading-[0.85] tracking-tight text-center"
            style={{ fontSize: "clamp(2.75rem, 13vw, 11rem)" }}
          >
            MG Company Group
          </h3>
        </motion.div>
      </div>
    </section>
  )
}
