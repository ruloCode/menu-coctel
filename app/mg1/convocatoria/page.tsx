import { existsSync } from "fs"
import { join } from "path"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import BrandMarquee from "@/components/brand-marquee"
import DiagonalArrow from "@/components/diagonal-arrow"
import ScrollProgress from "@/components/scroll-progress"
import ScrollReveal from "@/components/scroll-reveal"
import SectionHeading from "@/components/section-heading"
import SpecMeta from "@/components/spec-meta"
import FaqAccordion, { type FaqItem } from "@/components/mg1/faq-accordion"
import HeroDisc from "@/components/mg1/hero-disc"
import InscripcionForm from "@/components/mg1/inscripcion-form"
import Parallax from "@/components/mg1/parallax"
import PopIn from "@/components/mg1/pop-in"
import PrizeCounter from "@/components/mg1/prize-counter"
import ScrollSpin from "@/components/mg1/scroll-spin"
import Statement from "@/components/mg1/statement"
import VinylDisc, { type DiscTier } from "@/components/mg1/vinyl-disc"

const OG_TITLE = "Concurso MG1 · Convocatoria abierta"
const OG_DESCRIPTION =
  "Un beat. Un verso. Un coro. $10 millones en producción para tu carrera. Inscríbete gratis al primer reality musical de MG Company — Bogotá."

export function generateMetadata(): Metadata {
  const custom = "/og/og-mg1-convocatoria.jpg"
  const ogImage = existsSync(join(process.cwd(), "public", custom))
    ? custom
    : "/og/og-home.jpg"

  return {
    title: "Concurso MG1 · Convocatoria abierta | MG Company Group",
    description: OG_DESCRIPTION,
    alternates: { canonical: "/mg1/convocatoria" },
    openGraph: {
      type: "website",
      locale: "es_CO",
      siteName: "MG Company Group",
      url: "/mg1/convocatoria",
      title: OG_TITLE,
      description: OG_DESCRIPTION,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Concurso MG1 — Convocatoria abierta en Bogotá",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: OG_TITLE,
      description: OG_DESCRIPTION,
      images: [ogImage],
    },
  }
}

const hl = "text-mg-red-bright font-semibold"

const HERO_META = [
  { label: "Inscripción:", value: "Gratuita" },
  { label: "Cupos:", value: "Solo 12 al show" },
  { label: "Ciudad:", value: "Bogotá" },
]

const MARQUEE_ITEMS = [
  "MG1",
  "CONVOCATORIA ABIERTA",
  "CANCIONES, NO FREESTYLE",
  "PRIMERA EDICIÓN · BOGOTÁ",
]

const PREMIO_CHIPS = [
  "Beat exclusivo",
  "Grabación",
  "Mezcla & master",
  "Video oficial",
  "Lanzamiento",
  "Distribución en plataformas",
]

const STEPS: { num: string; title: string; desc: React.ReactNode }[] = [
  {
    num: "1",
    title: "Inscríbete",
    desc: (
      <>
        Llena el formulario con el link a tu música. Es <b className={hl}>gratis</b>. El
        crew de MG elige a los 12 del show.
      </>
    ),
  },
  {
    num: "2",
    title: "Recibe el beat",
    desc: (
      <>
        El <b className={hl}>mismo beat para todos</b>. Escribe un verso y un coro. Sin
        excusas: se ve rapidito quién escribe.
      </>
    ),
  },
  {
    num: "3",
    title: "Compite y crece",
    desc: (
      <>
        Preséntate ante el jurado, recibe <b className={hl}>mentoría real</b> del crew MG
        en cámara y avanza ronda a ronda.
      </>
    ),
  },
  {
    num: "4",
    title: "El público corona",
    desc: (
      <>
        El jurado decide quién llega a la final… pero al campeón lo elige{" "}
        <b className={hl}>la gente con su voto</b>.
      </>
    ),
  },
]

const DISCS: { tier: DiscTier; label: string; sub: string; glow?: boolean }[] = [
  { tier: "bronce", label: "Bronce", sub: "Estás en el show" },
  { tier: "plata", label: "Plata", sub: "Semifinalista" },
  { tier: "oro", label: "Oro", sub: "Finalista" },
  { tier: "ruby", label: "Ruby", sub: "Campeón MG1", glow: true },
]

const VALUE_CARDS: { title: string; items: React.ReactNode[] }[] = [
  {
    title: "Lo que te llevas por competir",
    items: [
      <>
        <b className="text-white">Clips profesionales de tu presentación</b>, con calidad
        de show, para tus redes y tu portafolio.
      </>,
      <>
        <b className="text-white">Mentoría real del crew MG en cámara:</b> sonido, letra,
        imagen y audiencia — lo que una productora le trabaja a un artista.
      </>,
      <>
        <b className="text-white">Exposición a nuevas audiencias</b> durante toda la
        temporada: <b className={hl}>estreno semanal</b> + clips verticales.
      </>,
      <>
        <b className="text-white">Red y comunidad:</b> compites, colaboras y te mides con
        la nueva escena de la ciudad.
      </>,
    ],
  },
  {
    title: "Tu música es tuya",
    items: [
      <>
        En las eliminatorias,{" "}
        <b className="text-white">tu tema sigue siendo 100% tuyo</b>: solo autorizas tu
        aparición en el show y sus clips.
      </>,
      <>
        Desde la semifinal, las canciones se{" "}
        <b className="text-white">producen con el equipo MG</b> y se comparten en partes
        iguales — porque ahí <b className={hl}>MG invierte producción en ti</b>.
      </>,
      <>
        Sin letra pequeña rara: las reglas{" "}
        <b className="text-white">se te entregan por escrito</b> antes de competir.
      </>,
    ],
  },
]

const REQUISITOS: React.ReactNode[] = [
  <>
    Artista de <b className="text-white">música urbana</b>.
  </>,
  <>
    <b className="text-white">Mayor de edad</b>, en Bogotá o con posibilidad de asistir a
    los rodajes.
  </>,
  <>
    <b className="text-white">Música propia</b> — un link donde te podamos escuchar.
  </>,
  <>
    Disponibilidad en las fechas de grabación (se confirman con los{" "}
    <b className={hl}>12 elegidos</b>).
  </>,
]

const FAQS: FaqItem[] = [
  {
    question: "¿Cuánto cuesta participar?",
    answer: (
      <>
        Nada. La inscripción y la participación son <b className="text-white">gratuitas</b>.
      </>
    ),
  },
  {
    question: "¿Tengo que improvisar?",
    answer: (
      <>
        No. MG1 no es freestyle: es <b className="text-white">canción escrita</b>. Recibes
        el beat con anticipación.
      </>
    ),
  },
  {
    question: "¿Dónde se graba?",
    answer: (
      <>
        En un estudio audiovisual profesional en Bogotá. El show se estrena en{" "}
        <b className="text-white">YouTube</b>.
      </>
    ),
  },
  {
    question: "¿Quién elige al ganador?",
    answer: (
      <>
        El jurado decide quién avanza;{" "}
        <b className="text-white">al campeón lo corona la votación del público</b>.
      </>
    ),
  },
]

export default function MG1ConvocatoriaPage() {
  return (
    <div className="overflow-x-clip bg-mg-black text-white">
      <ScrollProgress />

      {/* Hero */}
      <header className="relative flex min-h-svh items-center overflow-hidden border-t-8 border-mg-red">
        <div className="container mx-auto grid grid-cols-12 items-center gap-x-4 gap-y-12 px-4 py-16 md:px-6 md:py-20 lg:gap-x-10 lg:px-10">
          <div className="col-span-12 lg:col-span-7">
            <Parallax from={0} to={-70}>
              <ScrollReveal direction="up">
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none text-mg-red">&#10022;</span>
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-mg-red-bright">
                    [ MG Company presenta · Convocatoria abierta ]
                  </span>
                  <span className="h-px flex-1 bg-mg-red/40" />
                </div>

                <h1 className="mt-6 font-heading uppercase leading-[0.9] tracking-tight text-[clamp(2.75rem,8.5vw,7rem)]">
                  <span className="block text-stroke">Un beat.</span>
                  <span className="block">Un verso. Un coro.</span>
                  <span className="block text-mg-red">$10 millones</span>
                  <span className="block">en tu carrera.</span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg">
                  MG1 es el <b className={hl}>primer reality musical</b> de MG Company:{" "}
                  <b className={hl}>12 artistas emergentes</b> de Bogotá compiten con{" "}
                  <b className={hl}>canciones</b>, no con freestyle. El campeón se lleva{" "}
                  <b className={hl}>$10.000.000 COP en producción</b> — sencillo, video,
                  lanzamiento y distribución — y lo corona <b className={hl}>el público</b>.
                </p>

                <a
                  href="#inscripcion"
                  className="group mt-9 inline-flex items-center gap-4 border-2 border-mg-red bg-mg-red px-6 py-4 transition-colors duration-300 hover:bg-transparent hover:text-mg-red-bright md:px-8 md:py-5"
                >
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] md:text-sm">
                    Quiero participar
                  </span>
                  <DiagonalArrow
                    size={24}
                    strokeWidth={1.75}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>

                <div className="mt-8 border-l-4 border-mg-red pl-5">
                  <SpecMeta items={HERO_META} className="[&_dd]:text-mg-red-bright" />
                </div>
              </ScrollReveal>
            </Parallax>
          </div>

          <div className="col-span-12 mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-md">
            <ScrollReveal direction="up" delay={0.15}>
              <Parallax from={0} to={60}>
                <HeroDisc />
                <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
                  El Disco Ruby · solo existe uno
                </p>
              </Parallax>
            </ScrollReveal>
          </div>
        </div>
      </header>

      <BrandMarquee items={MARQUEE_ITEMS} variant="red" />

      {/* El premio */}
      <section className="bg-mg-red text-center">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-white/80">
            [ El premio ]
          </p>

          <PrizeCounter
            value={10_000_000}
            className="mt-4 block font-heading leading-none tracking-tight text-[clamp(3.5rem,13vw,9rem)]"
          />

          <p className="mt-3 font-mono text-xs font-medium uppercase tracking-[0.22em] md:text-sm">
            Pesos en producción para tu carrera
          </p>

          <ul className="mx-auto mt-9 flex max-w-3xl flex-wrap justify-center gap-3">
            {PREMIO_CHIPS.map((chip, i) => (
              <PopIn key={chip} delay={i * 0.06}>
                <li className="border border-white/40 bg-black/25 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.15em] md:text-xs">
                  {chip}
                </li>
              </PopIn>
            ))}
          </ul>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-white md:text-base">
              + el <b>Disco Ruby MG1</b> para la pared de tu casa + la chaqueta{" "}
              <b>MG1 Champion</b>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 01 · Así funciona */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
        <ScrollReveal direction="up" className="[&_.font-mono]:text-mg-red-bright">
          <SectionHeading
            index="01"
            kicker="El formato"
            title="Así funciona"
            subtitle={
              <>
                Sin trucos y sin improvisación: aquí gana el que{" "}
                <b className={hl}>escribe y hace canciones</b>. Cuatro capítulos en
                YouTube, grabados en un estudio audiovisual profesional de Bogotá.
              </>
            }
          />
        </ScrollReveal>

        <div className="mt-10 md:mt-14">
          <Statement />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.num} direction="up" delay={i * 0.08}>
              <div className="h-full border-t-4 border-mg-red bg-white/[0.03] p-6 transition-transform duration-300 hover:-translate-y-1">
                <PopIn delay={i * 0.08 + 0.15} rotate={-90}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mg-red font-heading text-xl">
                    {step.num}
                  </span>
                </PopIn>
                <h3 className="mt-5 font-heading text-2xl uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <BrandMarquee items={MARQUEE_ITEMS} variant="outline" />

      {/* 02 · Los discos */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
        <ScrollReveal direction="up" className="[&_.font-mono]:text-mg-red-bright">
          <SectionHeading
            index="02"
            kicker="El símbolo"
            title="Sube de nivel: los discos"
            subtitle={
              <>
                Tu estatus en MG1 es un disco que <b className={hl}>sube de color</b> a
                medida que avanzas — y te lo llevas de recuerdo. Solo existe un{" "}
                <b className={hl}>Disco Ruby</b>: el del campeón.
              </>
            }
          />
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-2 gap-6 md:mt-16 md:grid-cols-4 md:gap-8">
          {DISCS.map((disc, i) => (
            <ScrollReveal key={disc.tier} direction="up" delay={i * 0.1}>
              <ScrollSpin range={i % 2 === 0 ? 40 : -40}>
                <div
                  className={
                    disc.glow
                      ? "mg1-anim [filter:drop-shadow(0_0_26px_rgba(232,32,12,0.65))]"
                      : undefined
                  }
                >
                  <VinylDisc tier={disc.tier} spinDuration={disc.glow ? 8 : 13} />
                </div>
              </ScrollSpin>
              <PopIn delay={i * 0.1 + 0.2}>
                <div className="mt-4 text-center">
                  <p
                    className={`font-heading text-xl uppercase tracking-wide md:text-2xl ${
                      disc.glow ? "text-mg-red" : ""
                    }`}
                  >
                    {disc.label}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 md:text-xs">
                    {disc.sub}
                  </p>
                </div>
              </PopIn>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 03 · Aquí ganas aunque no ganes */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
          <ScrollReveal direction="up" className="[&_.font-mono]:text-mg-red-bright">
            <SectionHeading
              index="03"
              kicker="El valor"
              title="Aquí ganas aunque no ganes"
              subtitle={
                <>
                  Competir en MG1 es entrar a una productora por una temporada:{" "}
                  <b className={hl}>material, mentoría y audiencia</b> aunque el Disco Ruby
                  se lo lleve otro.
                </>
              }
            />
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
            {VALUE_CARDS.map((card, i) => (
              <ScrollReveal key={card.title} direction="up" delay={i * 0.1}>
                <div className="h-full border-t-4 border-mg-red bg-white/[0.03] p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8">
                  <h3 className="font-heading text-2xl uppercase tracking-wide text-mg-red">
                    {card.title}
                  </h3>
                  <ul className="mt-5 list-disc space-y-3 pl-5 marker:text-mg-red">
                    {card.items.map((item, j) => (
                      <li
                        key={j}
                        className="text-sm leading-relaxed text-zinc-300 md:text-[15px]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · ¿Puedes entrar? */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
        <ScrollReveal direction="up" className="[&_.font-mono]:text-mg-red-bright">
          <SectionHeading
            index="04"
            kicker="Requisitos"
            title="¿Puedes entrar?"
            subtitle={
              <>
                La convocatoria es abierta y gratuita. Esto es todo lo que necesitas para
                que tu inscripción cuente.
              </>
            }
          />
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
          <ScrollReveal direction="up">
            <div className="h-full border-t-4 border-mg-red bg-white/[0.03] p-6 md:p-8">
              <h3 className="font-heading text-2xl uppercase tracking-wide text-mg-red">
                Requisitos
              </h3>
              <ul className="mt-5 list-disc space-y-3 pl-5 marker:text-mg-red">
                {REQUISITOS.map((item, i) => (
                  <li key={i} className="text-sm leading-relaxed text-zinc-300 md:text-[15px]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <div className="h-full border-t-4 border-mg-red bg-white/[0.03] p-6 md:p-8">
              <h3 className="font-heading text-2xl uppercase tracking-wide text-mg-red">
                Preguntas rápidas
              </h3>
              <div className="mt-4">
                <FaqAccordion items={FAQS} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 05 · Inscripción */}
      <section
        id="inscripcion"
        className="scroll-mt-8 border-t border-white/10 bg-white/[0.02]"
      >
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
          <ScrollReveal direction="up" className="[&_.font-mono]:text-mg-red-bright">
            <SectionHeading
              index="05"
              kicker="Inscripción"
              title="Inscríbete — cupos limitados"
              subtitle={
                <>
                  Solo <b className={hl}>12 llegan al show</b>. Llena el formulario y deja
                  que tu música hable. <b className={hl}>#ConcursoMG1</b>
                </>
              }
            />
          </ScrollReveal>

          <div className="mt-12 md:mt-16">
            <InscripcionForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-8 md:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-70">
            <Image
              src="/logo-mg.png"
              alt="MG Company Group"
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400 md:text-xs">
              Concurso MG1 · Primera edición · Bogotá
            </span>
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-mg-red-bright md:text-xs">
            #ConcursoMG1
          </span>
        </div>
      </footer>
    </div>
  )
}
