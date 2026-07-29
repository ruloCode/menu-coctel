import type { Metadata } from "next"
import Image from "next/image"
import BrandMarquee from "@/components/brand-marquee"
import DiagonalArrow from "@/components/diagonal-arrow"
import ScrollProgress from "@/components/scroll-progress"
import ScrollReveal from "@/components/scroll-reveal"
import SectionHeading from "@/components/section-heading"
import SpecMeta from "@/components/spec-meta"
import HeroDisc from "@/components/mg1/hero-disc"
import Parallax from "@/components/mg1/parallax"
import PopIn from "@/components/mg1/pop-in"
import ScrollSpin from "@/components/mg1/scroll-spin"
import StatItem from "@/components/mg1/stat-item"
import Statement from "@/components/mg1/statement"
import VinylDisc, { type DiscTier } from "@/components/mg1/vinyl-disc"

const INVITEE = "Thaisa"

const WHATSAPP_URL = `https://wa.me/573150589998?text=${encodeURIComponent(
  `Hola, crew de MG. Soy ${INVITEE} — vi la propuesta para ser jurado de MG1. ¡Hablemos!`,
)}`

const OG_TITLE = `${INVITEE}, queremos que seas jurado de MG1`
const OG_DESCRIPTION =
  "Tu silla en la mesa del primer reality musical de MG Company te espera: 4 capítulos, 3 días de rodaje y gran final en vivo en Bogotá."

export const metadata: Metadata = {
  title: "MG1 · Invitación Jurado | MG Company Group",
  description: OG_DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "MG Company Group",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [
      {
        url: "/og/og-mg1-jurado.jpg",
        width: 1200,
        height: 630,
        alt: `MG1 — Propuesta confidencial: ${INVITEE}, jurado invitado`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: ["/og/og-mg1-jurado.jpg"],
  },
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

const hl = "text-mg-red-bright font-semibold"

const CHAPTERS: { num: string; title: string; desc: React.ReactNode }[] = [
  {
    num: "1",
    title: 'CAP 1 · "El Primer Corte"',
    desc: (
      <>
        Arranca la competencia: <b className={hl}>mismo beat para los 12</b>, un verso y
        un coro por cabeza. Primer veredicto,{" "}
        <b className={hl}>primera eliminación</b>… y un cierre que deja a todos
        comentando.
      </>
    ),
  },
  {
    num: "2",
    title: 'CAP 2 · "Corte y Queda"',
    desc: (
      <>
        Se cierran las eliminatorias. Quedan <b className={hl}>6 semifinalistas</b>.
      </>
    ),
  },
  {
    num: "3",
    title: 'CAP 3 · "La Prueba en Equipo"',
    desc: (
      <>
        Draft de capitanes: dos tríos arman <b className={hl}>una canción completa</b>{" "}
        juntos sobre un beat inédito de MG. El trío ganador{" "}
        <b className={hl}>pasa completo a la final</b>.
      </>
    ),
  },
  {
    num: "4",
    title: 'CAP 4 · "El Sencillo MG" (La Final)',
    desc: (
      <>
        Evento <b className={hl}>en vivo</b> en un bar de Bogotá: tres finalistas, tres
        temas inéditos, <b className={hl}>mentoría 1:1</b> y coronación.{" "}
        <b className={hl}>El público vota</b> y el campeón se anuncia al estrenar el
        capítulo.
      </>
    ),
  },
]

const DISCS: { tier: DiscTier; label: string; sub: string; glow?: boolean }[] = [
  { tier: "bronce", label: "Bronce", sub: "Llegaste al estudio" },
  { tier: "plata", label: "Plata", sub: "Semifinalista" },
  { tier: "oro", label: "Oro", sub: "Finalista" },
  { tier: "ruby", label: "Ruby", sub: "Campeón MG1", glow: true },
]

const ROLE_CARDS: { title: string; items: React.ReactNode[] }[] = [
  {
    title: "Lo que haces",
    items: [
      <>
        <b className="text-white">Voz y voto real en cada corte</b> junto a los otros{" "}
        <b className={hl}>dos jurados de MG</b>.
      </>,
      <>
        <b className="text-white">Mentor 1:1 en la gran final:</b> una dinámica de{" "}
        <b className={hl}>balotas</b> te asigna (o te elige) un finalista y lo acompañas
        en el estudio a pulir su <b className={hl}>tema inédito</b>.
      </>,
      <>
        <b className="text-white">Protagonista de los momentos clave:</b>{" "}
        deliberaciones, desacuerdos de mesa,{" "}
        <b className={hl}>ceremonia de discos</b>, balotas.
      </>,
      <>
        <b className="text-white">Total libertad editorial:</b>{" "}
        <b className={hl}>nadie te guioniza</b> opiniones ni veredictos.
      </>,
    ],
  },
  {
    title: "Lo que te llevas",
    items: [
      <>
        <b className="text-white">Clips editados de ti</b>, con{" "}
        <b className={hl}>calidad de show</b>, listos para tus redes.
      </>,
      <>
        <b className="text-white">Exposición cruzada</b> con la audiencia de MG y de los{" "}
        <b className={hl}>12 artistas</b>, toda la temporada (
        <b className={hl}>estreno semanal</b> + clips verticales).
      </>,
      <>
        <b className="text-white">Asociación con un formato original:</b> canción
        terminada, no freestyle — <b className={hl}>un nicho sin saturar</b> en
        Colombia.
      </>,
      <>
        <b className="text-white">La experiencia completa</b> de un rodaje de reality,{" "}
        <b className={hl}>sin costo alguno para ti</b>.
      </>,
    ],
  },
  {
    title: "Lo que te pedimos",
    items: [
      <>
        <b className="text-white">3 días de rodaje</b> en Bogotá:{" "}
        <b className={hl}>2 en estudio + la gran final en vivo</b> (fechas por confirmar
        contigo).
      </>,
      <>
        <b className="text-white">Confirmar por escrito</b> las fechas y la{" "}
        <b className={hl}>hora de llegada</b> de cada día.
      </>,
      <>
        <b className="text-white">2 outfits</b> por cada día de rodaje.
      </>,
      <>
        <b className="text-white">Respuestas honestas y con carácter</b> —{" "}
        <b className={hl}>lo tuyo</b>.
      </>,
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
    <div className="overflow-x-clip bg-mg-black text-white">
      <ScrollProgress />

      {/* Hero */}
      <header className="relative flex min-h-svh items-center border-t-8 border-mg-red overflow-hidden">
        <div className="container mx-auto grid grid-cols-12 items-center gap-x-4 gap-y-12 px-4 py-16 md:px-6 md:py-20 lg:gap-x-10 lg:px-10">
          <div className="col-span-12 lg:col-span-7">
            <Parallax from={0} to={-70}>
              <ScrollReveal direction="up">
                <div className="flex items-center gap-3">
                  <span className="text-mg-red text-xl leading-none">&#10022;</span>
                  <span className="font-mono text-mg-red-bright text-xs uppercase tracking-[0.3em] font-medium">
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
                  El <b className={hl}>primer reality musical</b> de MG Company:{" "}
                  <b className={hl}>doce artistas emergentes</b> de Bogotá,{" "}
                  <b className={hl}>un mismo beat</b>,{" "}
                  <b className={hl}>canciones de verdad</b>. La historia ya está escrita
                  — solo le falta una voz en la mesa.{" "}
                  <b className={hl}>La tuya, {INVITEE}.</b>
                </p>

                <div className="mt-8 border-l-4 border-mg-red pl-5">
                  <p className="font-heading text-xl md:text-2xl uppercase tracking-wide">
                    Propuesta para {INVITEE} · Jurado Invitado
                  </p>
                  <SpecMeta items={HERO_META} className="mt-3 [&_dd]:text-mg-red-bright" />
                </div>

                <div className="mt-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-zinc-400">
                  <span className="animate-bounce motion-reduce:animate-none">
                    &darr;
                  </span>
                  Desliza — la historia empieza abajo
                </div>
              </ScrollReveal>
            </Parallax>
          </div>

          <div className="col-span-12 mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-md">
            <ScrollReveal direction="up" delay={0.15}>
              <Parallax from={0} to={60}>
                <HeroDisc />
              </Parallax>

              <Parallax from={0} to={30}>
                <PopIn delay={0.35} rotate={-4}>
                  <div
                    className="mx-auto mt-6 max-w-xs border border-[#8a6a1c] px-5 py-3 text-center text-[#3d2c05] shadow-[0_12px_26px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.55)]"
                    style={{
                      background:
                        "linear-gradient(135deg, #f7e08a, #d4af37 45%, #9a7a24)",
                    }}
                  >
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.34em]">
                      Presentado a
                    </p>
                    <p className="font-heading text-3xl uppercase tracking-[0.1em]">
                      {INVITEE}
                    </p>
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em]">
                      Jurado invitado · MG1 primera edición
                    </p>
                  </div>
                </PopIn>

                <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Muévelo con el cursor · arrástralo para girarlo
                </p>
              </Parallax>
            </ScrollReveal>
          </div>
        </div>
      </header>

      <BrandMarquee items={MARQUEE_ITEMS} variant="red" />

      {/* 01 · La historia */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
        <ScrollReveal direction="up" className="[&_.font-mono]:text-mg-red-bright">
          <SectionHeading
            index="01"
            kicker="La historia"
            title="Así empieza la historia"
            subtitle={
              <>
                Un <b className={hl}>estudio de grabación real</b> en Bogotá. Sin
                público, sin luces de tarima — estética íntima de sesión. Entran{" "}
                <b className={hl}>doce artistas emergentes</b> y todos reciben lo mismo:{" "}
                <b className={hl}>un beat</b>. Cada uno tiene{" "}
                <b className={hl}>un verso y un coro</b> para demostrar quién es. Aquí
                no se compite improvisando —
              </>
            }
          />
        </ScrollReveal>

        <div className="mt-10 md:mt-14">
          <Statement />
          <ScrollReveal direction="up" delay={0.2}>
            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-zinc-300">
              Un nicho sin saturar en Colombia:{" "}
              <b className={hl}>temas terminados, con calidad de show</b>. Ronda a
              ronda, alguien decide quién sigue y quién se va.{" "}
              <b className={hl}>Esa mesa es la que te estamos ofreciendo.</b>
            </p>
          </ScrollReveal>
        </div>

        <div className="mt-12 md:mt-16">
          {CHAPTERS.map((chapter, i) => (
            <ScrollReveal key={chapter.num} direction="up" delay={i * 0.08}>
              <div className="group grid grid-cols-12 items-start gap-4 border-b border-white/10 px-2 py-6 transition-colors duration-300 hover:bg-white/[0.03] md:items-center md:py-7">
                <div className="col-span-2 md:col-span-1">
                  <PopIn delay={i * 0.08 + 0.15} rotate={-90}>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mg-red font-heading text-xl transition-transform duration-300 group-hover:scale-110">
                      {chapter.num}
                    </span>
                  </PopIn>
                </div>
                <div className="col-span-10 md:col-span-4">
                  <h3 className="font-heading text-xl md:text-2xl uppercase tracking-wide group-hover:text-mg-red transition-colors duration-300">
                    {chapter.title}
                  </h3>
                </div>
                <p className="col-span-10 col-start-3 md:col-span-7 md:col-start-6 text-sm md:text-base leading-relaxed text-zinc-300">
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
        <ScrollReveal direction="up" className="[&_.font-mono]:text-mg-red-bright">
          <SectionHeading
            index="02"
            kicker="El símbolo"
            title="El símbolo: los discos"
            subtitle={
              <>
                El estatus de cada concursante es un disco que{" "}
                <b className={hl}>sube de color</b> a medida que avanza. Solo existe un{" "}
                <b className={hl}>Disco Ruby</b> y se lo lleva{" "}
                <b className={hl}>el campeón</b> a su casa. La ceremonia de entrega es
                el clímax de cada ronda…{" "}
                <b className={hl}>y tú la entregas desde la mesa.</b>
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
                    className={`font-heading text-xl md:text-2xl uppercase tracking-wide ${
                      disc.glow ? "text-mg-red" : ""
                    }`}
                  >
                    {disc.label}
                  </p>
                  <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-zinc-400">
                    {disc.sub}
                  </p>
                </div>
              </PopIn>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 03 · Tu lugar en la mesa */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
          <ScrollReveal direction="up" className="[&_.font-mono]:text-mg-red-bright">
            <SectionHeading
              index="03"
              kicker="Tu silla"
              title="Tu lugar en la mesa"
              subtitle={
                <>
                  Ser jurado de MG1 es descubrir al próximo nombre de la escena{" "}
                  <b className={hl}>antes que nadie</b> — y que la gente te vea hacerlo.
                  Tu criterio decide quién avanza,{" "}
                  <b className={hl}>tus frases se vuelven los clips</b> que todos
                  comentan, y tu nombre queda en la{" "}
                  <b className={hl}>primera edición</b> de un formato hecho para crecer.
                </>
              }
            />
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
            {ROLE_CARDS.map((card, i) => (
              <ScrollReveal key={card.title} direction="up" delay={i * 0.1}>
                <div className="h-full border-t-4 border-mg-red bg-white/[0.03] p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8">
                  <h3 className="font-heading text-2xl uppercase tracking-wide text-mg-red">
                    {card.title}
                  </h3>
                  <ul className="mt-5 list-disc space-y-3 pl-5 marker:text-mg-red">
                    {card.items.map((item, j) => (
                      <li
                        key={j}
                        className="text-sm md:text-[15px] leading-relaxed text-zinc-300"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}

            <ScrollReveal direction="up" delay={0.3}>
              <div className="h-full border-t-4 border-mg-red bg-white/[0.03] p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8">
                <h3 className="font-heading text-2xl uppercase tracking-wide text-mg-red">
                  El formato en números
                </h3>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {STATS.map((stat, i) => (
                    <StatItem
                      key={stat.label}
                      value={stat.value}
                      label={stat.label}
                      sub={stat.sub}
                      index={i}
                    />
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
          <PopIn>
            <div
              className="mb-8 flex h-9 items-end justify-center gap-1.5"
              aria-hidden="true"
            >
              {[0, 0.15, 0.3, 0.45, 0.6].map((delay) => (
                <span
                  key={delay}
                  className="mg1-anim h-full w-1.5 origin-bottom bg-white"
                  style={{ animation: `mg1-eq 1s ease-in-out ${delay}s infinite` }}
                />
              ))}
            </div>
          </PopIn>

          <PopIn delay={0.1}>
            <h2 className="font-heading uppercase leading-[0.95] tracking-tight text-[clamp(2.5rem,6vw,5rem)]">
              El beat ya suena.
              <br />
              Solo falta tu voz.
            </h2>
          </PopIn>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-white">
              Queremos contarte <b>el formato completo</b> y cuadrar fechas contigo.
              Escríbenos y coordinamos una <b>llamada de 20 minutos</b> con el crew de
              MG. — <b>MG Company · Bogotá</b>
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex items-center gap-4 border-2 border-white px-6 py-4 transition-colors duration-300 hover:bg-white hover:text-mg-red md:px-8 md:py-5"
            >
              <span className="font-mono text-xs md:text-sm font-medium uppercase tracking-[0.3em]">
                ¿Hablamos? · WhatsApp
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
            <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-zinc-400">
              Concurso MG1 · Primera edición
            </span>
          </div>
          <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-mg-red-bright">
            Confidencial
          </span>
        </div>
      </footer>
    </div>
  )
}
