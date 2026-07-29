import type { Metadata } from "next"
import Image from "next/image"
import BrandMarquee from "@/components/brand-marquee"
import DiagonalArrow from "@/components/diagonal-arrow"
import ScrollProgress from "@/components/scroll-progress"
import ScrollReveal from "@/components/scroll-reveal"
import SectionHeading from "@/components/section-heading"
import SpecMeta from "@/components/spec-meta"
import AnimatedCounter from "@/components/mg1/animated-counter"
import HeroDisc from "@/components/mg1/hero-disc"
import VinylDisc, { type DiscTier } from "@/components/mg1/vinyl-disc"

const INVITEE = "Thaisa"

export const metadata: Metadata = {
  title: "MG1 · Invitación Jurado | MG Company Group",
  description:
    "Propuesta confidencial: jurado invitado de MG1, el primer reality musical de MG Company.",
  robots: { index: false, follow: false },
}

const HERO_META = [
  { label: "Formato:", value: "4 capítulos · YouTube" },
  { label: "Rodaje:", value: "3 días · Bogotá" },
  { label: "Cierre:", value: "Gran final en vivo" },
]

const MARQUEE_ITEMS = [
  "MG1",
  "EL PRIMER REALITY MUSICAL DE MG COMPANY",
  "CANCIONES, NO FREESTYLE",
  "PRIMERA EDICIÓN · BOGOTÁ",
]

const CHAPTERS = [
  {
    num: "1",
    title: 'CAP 1 · "El Primer Corte"',
    desc: "Arranca la competencia: mismo beat para los 12, un verso y un coro por cabeza. Primer veredicto, primera eliminación… y un cierre que deja a todos comentando.",
  },
  {
    num: "2",
    title: 'CAP 2 · "Corte y Queda"',
    desc: "Se cierran las eliminatorias. Quedan 6 semifinalistas.",
  },
  {
    num: "3",
    title: 'CAP 3 · "La Prueba en Equipo"',
    desc: "Draft de capitanes: dos tríos arman una canción completa juntos sobre un beat inédito de MG. El trío ganador pasa completo a la final.",
  },
  {
    num: "4",
    title: 'CAP 4 · "El Sencillo MG" (La Final)',
    desc: "Evento en vivo en un bar de Bogotá: tres finalistas, tres temas inéditos, mentoría 1:1 y coronación. El público vota y el campeón se anuncia al estrenar el capítulo.",
  },
]

const DISCS: { tier: DiscTier; label: string; sub: string; glow?: boolean }[] = [
  { tier: "bronce", label: "Bronce", sub: "Llegaste al estudio" },
  { tier: "plata", label: "Plata", sub: "Semifinalista" },
  { tier: "oro", label: "Oro", sub: "Finalista" },
  { tier: "ruby", label: "Ruby", sub: "Campeón MG1", glow: true },
]

const ROLE_CARDS = [
  {
    title: "Lo que haces",
    items: [
      ["Voz y voto real en cada corte", " junto a los otros dos jurados de MG."],
      [
        "Mentor 1:1 en la gran final:",
        " una dinámica de balotas te asigna (o te elige) un finalista y lo acompañas en el estudio a pulir su tema inédito.",
      ],
      [
        "Protagonista de los momentos clave:",
        " deliberaciones, desacuerdos de mesa, ceremonia de discos, balotas.",
      ],
      ["Total libertad editorial:", " nadie te guioniza opiniones ni veredictos."],
    ],
  },
  {
    title: "Lo que te llevas",
    items: [
      ["Clips editados de ti", ", con calidad de show, listos para tus redes."],
      [
        "Exposición cruzada",
        " con la audiencia de MG y de los 12 artistas, toda la temporada (estreno semanal + clips verticales).",
      ],
      [
        "Asociación con un formato original:",
        " canción terminada, no freestyle — un nicho sin saturar en Colombia.",
      ],
      ["La experiencia completa", " de un rodaje de reality, sin costo alguno para ti."],
    ],
  },
  {
    title: "Lo que te pedimos",
    items: [
      [
        "3 días de rodaje",
        " en Bogotá: 2 en estudio + la gran final en vivo (fechas por confirmar contigo).",
      ],
      ["Confirmar por escrito", " las fechas y la hora de llegada de cada día."],
      ["2 outfits", " por cada día de rodaje."],
      ["Respuestas honestas y con carácter", " — lo tuyo."],
    ],
  },
]

const STATS = [
  { value: 4, label: "Capítulos", sub: "estreno semanal" },
  { value: 3, label: "Días de rodaje", sub: "2 en estudio + final en vivo" },
  { value: 12, label: "Artistas", sub: "moviendo audiencias" },
]

export default function MG1JuradoPage() {
  return (
    <div className="bg-mg-black text-white">
      <ScrollProgress />

      {/* Hero */}
      <header className="relative flex min-h-svh items-center border-t-8 border-mg-red overflow-hidden">
        <div className="container mx-auto grid grid-cols-12 items-center gap-x-4 gap-y-12 px-4 py-16 md:px-6 md:py-20 lg:gap-x-10 lg:px-10">
          <div className="col-span-12 lg:col-span-7">
            <ScrollReveal direction="up">
              <div className="flex items-center gap-3">
                <span className="text-mg-red text-xl leading-none">&#10022;</span>
                <span className="font-mono text-mg-red text-[11px] md:text-xs uppercase tracking-[0.3em] font-medium">
                  [ MG Company presenta ]
                </span>
                <span className="h-px flex-1 bg-mg-red/40" />
              </div>

              <h1 className="mt-6 font-heading uppercase leading-[0.9] tracking-tight text-[clamp(3rem,9vw,7.5rem)]">
                <span className="block text-stroke">{INVITEE},</span>
                <span className="block">queremos que seas</span>
                <span className="block">
                  jurado de <span className="text-mg-red">MG1</span>.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-zinc-300">
                El primer reality musical de MG Company: doce artistas emergentes de
                Bogotá, un mismo beat,{" "}
                <b className="text-mg-red font-semibold">canciones de verdad</b>. La
                historia ya está escrita — solo le falta una voz en la mesa.{" "}
                <b className="text-mg-red font-semibold">La tuya, {INVITEE}.</b>
              </p>

              <div className="mt-8 border-l-4 border-mg-red pl-5">
                <p className="font-heading text-xl md:text-2xl uppercase tracking-wide">
                  Propuesta para {INVITEE} · Jurado Invitado
                </p>
                <SpecMeta items={HERO_META} className="mt-3" />
              </div>

              <div className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                <span className="animate-bounce motion-reduce:animate-none">&darr;</span>
                Desliza — la historia empieza abajo
              </div>
            </ScrollReveal>
          </div>

          <div className="col-span-12 mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-md">
            <ScrollReveal direction="up" delay={0.15}>
              <HeroDisc />

              <div
                className="mx-auto mt-6 max-w-xs border border-[#8a6a1c] px-5 py-3 text-center text-[#3d2c05] shadow-[0_12px_26px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.55)]"
                style={{
                  background: "linear-gradient(135deg, #f7e08a, #d4af37 45%, #9a7a24)",
                }}
              >
                <p className="font-mono text-[9px] font-medium uppercase tracking-[0.34em]">
                  Presentado a
                </p>
                <p className="font-heading text-3xl uppercase tracking-[0.1em]">{INVITEE}</p>
                <p className="font-mono text-[9px] font-medium uppercase tracking-[0.2em]">
                  Jurado invitado · MG1 primera edición
                </p>
              </div>

              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Muévelo con el cursor · arrástralo para girarlo
              </p>
            </ScrollReveal>
          </div>
        </div>
      </header>

      <BrandMarquee items={MARQUEE_ITEMS} variant="red" />

      {/* 01 · La historia */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
        <ScrollReveal direction="up">
          <SectionHeading
            index="01"
            kicker="La historia"
            title="Así empieza la historia"
            subtitle="Un estudio de grabación real en Bogotá. Sin público, sin luces de tarima — estética íntima de sesión. Entran doce artistas emergentes y todos reciben lo mismo: un beat. Cada uno tiene un verso y un coro para demostrar quién es. Aquí no se compite improvisando —"
          />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1} className="mt-10 md:mt-14">
          <p className="font-heading uppercase leading-[0.9] tracking-tight text-[clamp(2.75rem,7vw,6.5rem)]">
            <span className="text-mg-red">Canciones,</span>{" "}
            <span className="text-zinc-600 line-through decoration-mg-red decoration-4">
              no freestyle
            </span>
            .
          </p>
          <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-zinc-400">
            Un nicho sin saturar en Colombia: temas terminados, con calidad de show. Ronda
            a ronda, alguien decide quién sigue y quién se va. Esa mesa es la que te
            estamos ofreciendo.
          </p>
        </ScrollReveal>

        <div className="mt-12 md:mt-16">
          {CHAPTERS.map((chapter, i) => (
            <ScrollReveal key={chapter.num} direction="up" delay={i * 0.08}>
              <div className="group grid grid-cols-12 items-start gap-4 border-b border-white/10 px-2 py-6 transition-colors duration-300 hover:bg-white/[0.03] md:items-center md:py-7">
                <div className="col-span-2 md:col-span-1">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mg-red font-heading text-xl">
                    {chapter.num}
                  </span>
                </div>
                <div className="col-span-10 md:col-span-4">
                  <h3 className="font-heading text-xl md:text-2xl uppercase tracking-wide group-hover:text-mg-red transition-colors duration-300">
                    {chapter.title}
                  </h3>
                </div>
                <p className="col-span-10 col-start-3 md:col-span-7 md:col-start-6 text-sm md:text-base leading-relaxed text-zinc-400">
                  {chapter.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <BrandMarquee items={MARQUEE_ITEMS} variant="outline" />

      {/* 02 · Los discos */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
        <ScrollReveal direction="up">
          <SectionHeading
            index="02"
            kicker="El símbolo"
            title="El símbolo: los discos"
            subtitle="El estatus de cada concursante es un disco que sube de color a medida que avanza. Solo existe un Disco Ruby y se lo lleva el campeón a su casa. La ceremonia de entrega es el clímax de cada ronda… y tú la entregas desde la mesa."
          />
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-2 gap-6 md:mt-16 md:grid-cols-4 md:gap-8">
          {DISCS.map((disc, i) => (
            <ScrollReveal key={disc.tier} direction="up" delay={i * 0.1}>
              <div
                className={
                  disc.glow
                    ? "mg1-anim [filter:drop-shadow(0_0_26px_rgba(232,32,12,0.65))]"
                    : undefined
                }
              >
                <VinylDisc tier={disc.tier} spinDuration={disc.glow ? 8 : 13} />
              </div>
              <div className="mt-4 text-center">
                <p
                  className={`font-heading text-xl md:text-2xl uppercase tracking-wide ${
                    disc.glow ? "text-mg-red" : ""
                  }`}
                >
                  {disc.label}
                </p>
                <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  {disc.sub}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 03 · Tu lugar en la mesa */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
          <ScrollReveal direction="up">
            <SectionHeading
              index="03"
              kicker="Tu silla"
              title="Tu lugar en la mesa"
              subtitle="Ser jurado de MG1 es descubrir al próximo nombre de la escena antes que nadie — y que la gente te vea hacerlo. Tu criterio decide quién avanza, tus frases se vuelven los clips que todos comentan, y tu nombre queda en la primera edición de un formato hecho para crecer."
            />
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
            {ROLE_CARDS.map((card, i) => (
              <ScrollReveal key={card.title} direction="up" delay={i * 0.1}>
                <div className="h-full border-t-4 border-mg-red bg-white/[0.03] p-6 md:p-8">
                  <h3 className="font-heading text-2xl uppercase tracking-wide text-mg-red">
                    {card.title}
                  </h3>
                  <ul className="mt-5 list-disc space-y-3 pl-5 marker:text-mg-red">
                    {card.items.map(([strong, rest]) => (
                      <li key={strong} className="text-sm md:text-[15px] leading-relaxed text-zinc-300">
                        <b className="text-white">{strong}</b>
                        {rest}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}

            <ScrollReveal direction="up" delay={0.3}>
              <div className="h-full border-t-4 border-mg-red bg-white/[0.03] p-6 md:p-8">
                <h3 className="font-heading text-2xl uppercase tracking-wide text-mg-red">
                  El formato en números
                </h3>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="border-l-4 border-mg-red pl-4">
                      <AnimatedCounter
                        value={stat.value}
                        className="font-heading text-[clamp(2.75rem,5vw,4rem)] leading-none text-mg-red"
                      />
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-400">
                        {stat.label}
                        <span className="block text-zinc-600">{stat.sub}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mg-red text-center">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
          <ScrollReveal direction="up">
            <div className="mb-8 flex h-9 items-end justify-center gap-1.5" aria-hidden="true">
              {[0, 0.15, 0.3, 0.45, 0.6].map((delay) => (
                <span
                  key={delay}
                  className="mg1-anim h-full w-1.5 origin-bottom bg-white"
                  style={{ animation: `mg1-eq 1s ease-in-out ${delay}s infinite` }}
                />
              ))}
            </div>

            <h2 className="font-heading uppercase leading-[0.95] tracking-tight text-[clamp(2.5rem,6vw,5rem)]">
              El beat ya suena.
              <br />
              Solo falta tu voz.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white/90">
              Queremos contarte el formato completo y cuadrar fechas contigo. Escríbenos y
              coordinamos una llamada de 20 minutos con el crew de MG. —{" "}
              <b>MG Company · Bogotá</b>
            </p>

            <a
              href={`mailto:hola@mgcompanygroup.com?subject=MG1 · Jurado invitado — ${INVITEE}`}
              className="group mt-10 inline-flex items-center gap-4 border-2 border-white px-6 py-4 transition-colors duration-300 hover:bg-white hover:text-mg-red md:px-8 md:py-5"
            >
              <span className="font-mono text-xs md:text-sm font-medium uppercase tracking-[0.3em]">
                ¿Hablamos?
              </span>
              <DiagonalArrow
                size={24}
                strokeWidth={1.75}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-8 md:px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <Image
              src="/logo-mg.png"
              alt="MG Company Group"
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-zinc-500">
              Concurso MG1 · Primera edición
            </span>
          </div>
          <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-mg-red">
            Confidencial
          </span>
        </div>
      </footer>
    </div>
  )
}
