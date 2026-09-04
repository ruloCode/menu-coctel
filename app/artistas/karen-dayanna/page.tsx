import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Instagram, Mail, MapPin } from "lucide-react"

import { getAllArtists, getArtistBySlug } from "@/lib/mock-data"
import BookingDialog from "@/components/booking-dialog"
import DiagonalArrow from "@/components/diagonal-arrow"
import PlatformLinks from "@/components/platform-links"
import KdHero from "@/components/artists/kd-hero"
import KdManifiesto from "@/components/artists/kd-manifiesto"
import KdSencillos, { type Sencillo } from "@/components/artists/kd-sencillos"
import KdGaleria, { type FotoGaleria } from "@/components/artists/kd-galeria"
import KdMarquee from "@/components/artists/kd-marquee"
import KdCifras, { type Cifra } from "@/components/artists/kd-cifras"
import ScrollReveal from "@/components/scroll-reveal"

import "./kd.css"

const SLUG = "karen-dayanna"
const CORREO = "daka.musicaindependiente@gmail.com"

export const metadata = {
  title: "Karen Dayanna | MG Company Group",
  description:
    "Karen Dayanna, cantautora bogotana de canción de autor, pop e indie. Escucha Pa' Toda la Vida y Volaré, mira sus fotos y contáctala para booking y prensa.",
  openGraph: {
    type: "profile" as const,
    title: "Karen Dayanna | MG Company Group",
    description:
      "Cantautora bogotana. Canciones sobre la memoria y todo lo que perdura. Mucho más que un show.",
    images: [
      {
        url: "/og/og-karen-dayanna.jpg",
        width: 1200,
        height: 630,
        alt: "Karen Dayanna — MG Company Group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Karen Dayanna | MG Company Group",
    description:
      "Cantautora bogotana. Canciones sobre la memoria y todo lo que perdura. Mucho más que un show.",
    images: ["/og/og-karen-dayanna.jpg"],
  },
}

const SENCILLOS: Sencillo[] = [
  {
    titulo: "Pa' Toda la Vida",
    orden: "Sencillo debut",
    cover: "/artists/karen-dayanna/cover-pa-toda-la-vida.jpg",
    texto:
      "Sencillo debut con el cual Karen Dayanna abre su camino en la escena musical. La canción se despliega como un retrato honesto de las emociones que perduran en el tiempo: el amor, la memoria y los vínculos que nos marcan profundamente.",
    enlace: "https://hypeddit.com/0twf6n",
  },
  {
    titulo: "Volaré",
    orden: "Segundo lanzamiento",
    cover: "/artists/karen-dayanna/cover-volare.jpg",
    texto:
      "Una propuesta íntima que entrelaza la calidez de lo acústico con una sensibilidad moderna. A través de la metáfora del vuelo retrata el proceso de enfrentar la vida, invitando a reflexionar sobre los procesos personales y la valentía necesaria para avanzar.",
    enlace: "https://hypeddit.com/i9pwd8",
  },
]

const FOTOS: FotoGaleria[] = [
  {
    src: "/artists/karen-dayanna/kd-closeup.jpg",
    foco: "object-[center_25%]",
    alto: "aspect-[4/5]",
    pie: "Retrato nocturno",
    deriva: 28,
  },
  {
    src: "/artists/karen-dayanna/kd-live-01.jpg",
    foco: "object-[center_35%]",
    alto: "aspect-[3/4]",
    pie: "En vivo · La Casa de Los Amigos",
    deriva: -34,
  },
  {
    src: "/artists/karen-dayanna/kd-blazer.jpg",
    foco: "object-[center_20%]",
    alto: "aspect-[4/5]",
    pie: "Sesión de prensa",
    deriva: 20,
  },
  {
    src: "/artists/karen-dayanna/kd-live-wide.jpg",
    alto: "aspect-[16/10]",
    pie: "Puesta en escena completa",
    deriva: -22,
  },
  {
    src: "/artists/karen-dayanna/kd-cuarto.jpg",
    alto: "aspect-[16/10]",
    pie: "Sesión de Pa' Toda la Vida",
    deriva: 30,
  },
  {
    src: "/artists/karen-dayanna/kd-portrait.jpg",
    foco: "object-[center_15%]",
    alto: "aspect-[3/4]",
    pie: "Retrato oficial",
    deriva: -26,
  },
]

const CIFRAS: Cifra[] = [
  {
    valor: 200,
    sufijo: "+",
    etiqueta: "Streams",
    fuentes: "Spotify · Soundcloud · YouTube · Pandora",
  },
  {
    valor: 700,
    sufijo: "+",
    etiqueta: "Follows / subs",
    fuentes: "Meta · TikTok · YouTube",
  },
  {
    valor: 21.5,
    sufijo: "K+",
    decimales: 1,
    etiqueta: "Views",
    fuentes: "Alcance en redes sociales",
  },
]

const RIDER: { titulo: string; puntos: string[] }[] = [
  {
    titulo: "Formato de presentación",
    puntos: ["Solista acústico", "Solista acústico + pista"],
  },
  {
    titulo: "Audio",
    puntos: [
      "1 micrófono para voz (Shure SM58 o equivalente)",
      "1 caja directa para guitarra acústica",
    ],
  },
  {
    titulo: "Escenario",
    puntos: [
      "Espacio mínimo de 2 × 2 m",
      "1 monitor de piso (preferible, si aplica)",
      "Alimentación eléctrica suficiente para instrumento",
      "Iluminación cálida o neutra (preferible)",
    ],
  },
  {
    titulo: "Presentación",
    puntos: [
      "Duración: 30 o 45 min",
      "Prueba de sonido: 30 – 60 min",
      "Rider técnico detallado disponible bajo solicitud",
    ],
  },
]

/** Kicker de seccion: corchetes de MG con la regla degradada a su violeta. */
function Kicker({ indice, label }: { indice: string; label: string }) {
  return (
    <div className="mb-10 flex items-center gap-3 md:mb-14">
      <span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-mg-red md:text-xs">
        [ {indice} / {label} ]
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-mg-red/60 via-[#a78bfa]/40 to-transparent" />
    </div>
  )
}

function Chevrones({ className = "" }: { className?: string }) {
  return (
    <svg
      width="30"
      height="64"
      viewBox="0 0 34 72"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M4 ${6 + i * 22} L17 ${20 + i * 22} L30 ${6 + i * 22}`}
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="square"
          opacity={0.4 + i * 0.3}
        />
      ))}
    </svg>
  )
}

export default function KarenDayannaPage() {
  const artistas = getAllArtists()
  const karen = getArtistBySlug(SLUG)
  const indice = artistas.findIndex((a) => a.slug === SLUG)
  const anterior = artistas[(indice - 1 + artistas.length) % artistas.length]
  const siguiente = artistas[(indice + 1) % artistas.length]

  return (
    <article className="kd">
      <KdHero />

      {/* 01 — Biografía */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "url(/artists/karen-dayanna/tex-papel.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container relative mx-auto px-4 py-20 md:px-6 md:py-32 lg:px-10">
          <Kicker indice="01" label="Biografía" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="hidden lg:col-span-1 lg:block">
              <Chevrones className="text-white/60" />
            </div>

            <div className="lg:col-span-7">
              <KdManifiesto />
            </div>

            <aside className="lg:col-span-4">
              <div className="kd-sheen rounded-2xl border border-white/15 bg-white/[0.02] p-6 backdrop-blur-sm md:p-8">
                <p className="kd-contrast text-lg leading-relaxed text-white/80 md:text-xl">
                  Sus presentaciones combinan el abrazo cálido de la remembranza,
                  la profundidad sonora y una conexión intensa con las emociones,
                  creando experiencias inmersivas en cada escenario.
                </p>
              </div>

              <dl className="mt-8 space-y-0">
                {[
                  ["Origen", "Bogotá, Colombia"],
                  ["Género", "Canción de autor · Pop · Indie · Folk"],
                  ["Formato", "Solista acústico · Solista + pista"],
                  ["Movilidad", "Nacional e internacional"],
                  ["Sello", "MG Company Group"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-white/10 py-4"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                      {k}
                    </dt>
                    <dd className="kd-contrast text-right text-base text-white/85">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* 02 — Discografía */}
      <section className="relative border-t border-white/10">
        <div className="container mx-auto px-4 py-20 md:px-6 md:py-28 lg:px-10">
          <Kicker indice="02" label="Discografía" />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="hidden lg:col-span-1 lg:block">
              <h2 className="kd-vertical font-heading text-[clamp(2.5rem,4vw,4rem)] uppercase leading-none tracking-tight text-white/25">
                Pistas y videos
              </h2>
            </div>
            <div className="lg:col-span-11">
              <KdSencillos sencillos={SENCILLOS} />
            </div>
          </div>
        </div>
      </section>

      {/* 03 — En vivo + rider */}
      <section className="relative overflow-hidden border-t border-white/10">
        <Image
          src="/artists/karen-dayanna/kd-live-wide.jpg"
          alt=""
          aria-hidden="true"
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050509] via-[#050509]/85 to-[#050509]" />

        <div className="relative py-20 md:py-28">
          <KdMarquee texto="Mucho más que un show" className="mb-16 md:mb-24" />

          <div className="container mx-auto px-4 md:px-6 lg:px-10">
            <Kicker indice="03" label="Rider técnico" />

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <ScrollReveal>
                  <p className="kd-contrast text-xl leading-relaxed text-white/80 md:text-2xl">
                    Cada presentación de Karen Dayanna propone un espacio íntimo
                    donde la música se convierte en refugio. A través de una
                    puesta en escena cálida y cercana, el público recorre
                    historias de memoria y transformación, creando una
                    experiencia que trasciende el concierto para convertirse en
                    un encuentro emocional.
                  </p>
                </ScrollReveal>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-7">
                {RIDER.map((bloque, i) => (
                  <ScrollReveal key={bloque.titulo} delay={i * 0.08}>
                    <div>
                      <span className="kd-pill kd-sheen kd-contrast text-base text-white/85">
                        {bloque.titulo}
                      </span>
                      <ul className="mt-5 space-y-3">
                        {bloque.puntos.map((p) => (
                          <li key={p} className="flex gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-[0.35em] font-mono text-xs leading-none text-[#a78bfa]"
                            >
                              +
                            </span>
                            <span className="kd-contrast text-base leading-snug text-white/70">
                              {p}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Fotografía */}
      <section className="border-t border-white/10">
        <div className="container mx-auto px-4 py-20 md:px-6 md:py-28 lg:px-10">
          <Kicker indice="04" label="Fotografía" />
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-heading text-[clamp(3rem,9vw,7rem)] uppercase leading-[0.85] tracking-tight text-white">
              Fotografía
            </h2>
            <p className="kd-contrast max-w-sm text-base text-white/55">
              Fotografías oficiales disponibles para prensa, festivales y
              promotores. El paquete completo en alta resolución se entrega bajo
              solicitud.
            </p>
          </div>
          <KdGaleria fotos={FOTOS} />
        </div>
      </section>

      {/* 05 — Plataformas y audiencia */}
      <section className="relative overflow-hidden border-t border-white/10">
        <Image
          src="/artists/karen-dayanna/tex-cielo.jpg"
          alt=""
          aria-hidden="true"
          fill
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050509] via-[#050509]/90 to-[#050509]/70" />

        <div className="container relative mx-auto px-4 py-20 md:px-6 md:py-28 lg:px-10">
          <Kicker indice="05" label="Plataformas & audiencia" />

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <ScrollReveal>
                <p className="kd-contrast text-xl leading-relaxed text-white/80 md:text-2xl">
                  A través de plataformas digitales, performances en vivo y
                  eventos, Karen abre su camino en la escena emergente,
                  posicionándose como una de las voces frescas que apuestan por
                  la autenticidad en la música independiente de Bogotá.
                </p>
              </ScrollReveal>
              <div className="mt-8">
                <PlatformLinks links={karen?.social_links ?? {}} />
              </div>
            </div>

            <div className="lg:col-span-7">
              <KdCifras cifras={CIFRAS} />
            </div>
          </div>
        </div>
      </section>

      {/* 06 — Bookings & contacto */}
      <section className="relative overflow-hidden border-t border-white/10">
        <Image
          src="/artists/karen-dayanna/tex-luces.jpg"
          alt=""
          aria-hidden="true"
          fill
          className="object-cover opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050509] via-[#050509]/80 to-[#050509]/95" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 55% at 85% 100%, rgba(232,32,12,0.18) 0%, transparent 62%)",
          }}
        />

        <div className="container relative mx-auto px-4 py-20 md:px-6 md:py-32 lg:px-10">
          <Kicker indice="06" label="Bookings & contacto" />

          <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-heading text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.86] tracking-tight text-white">
                Para contrataciones,
                <br />
                colaboración y eventos
              </h2>
              <p className="kd-contrast mt-6 max-w-xl text-lg leading-relaxed text-white/65 md:text-xl">
                Posibilidades de movilidad nacional e internacional. Escribe a{" "}
                <a
                  href={`mailto:${CORREO}`}
                  className="kd-link-underline text-white"
                >
                  {CORREO}
                </a>{" "}
                o gestiona la fecha directamente con MG Company Group.
              </p>

              <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
                {[
                  {
                    icono: <Mail size={15} />,
                    etiqueta: "Correo",
                    valor: CORREO,
                    href: `mailto:${CORREO}`,
                  },
                  {
                    icono: <Instagram size={15} />,
                    etiqueta: "Instagram",
                    valor: "@dakaq.r",
                    href: "https://www.instagram.com/dakaq.r/",
                  },
                  {
                    icono: <MapPin size={15} />,
                    etiqueta: "Ubicación",
                    valor: "Bogotá, Colombia",
                  },
                ].map((d) => (
                  <div key={d.etiqueta} className="border-t border-white/15 pt-4">
                    <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                      <span className="text-[#a78bfa]">{d.icono}</span>
                      {d.etiqueta}
                    </dt>
                    <dd className="kd-contrast mt-2 text-[15px] leading-snug text-white/85 [overflow-wrap:anywhere]">
                      {d.href ? (
                        <a
                          href={d.href}
                          target={d.href.startsWith("http") ? "_blank" : undefined}
                          rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="kd-link-underline"
                        >
                          {d.valor}
                        </a>
                      ) : (
                        d.valor
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-5 lg:items-end">
              <BookingDialog artistName="Karen Dayanna">
                <button className="group inline-flex items-center gap-3 rounded-full bg-mg-red px-8 py-4 text-white transition-colors duration-300 hover:bg-white hover:text-mg-black">
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] md:text-sm">
                    Solicitar booking
                  </span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <DiagonalArrow size={18} strokeWidth={1.75} />
                  </span>
                </button>
              </BookingDialog>

              <BookingDialog artistName="Karen Dayanna" intent="press-kit">
                <button className="group inline-flex items-center gap-3 rounded-full border border-white/60 px-8 py-4 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-mg-black">
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] md:text-sm">
                    Kit de prensa
                  </span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <DiagonalArrow size={18} strokeWidth={1.75} />
                  </span>
                </button>
              </BookingDialog>
            </div>
          </div>

          {/* Su firma cierra la pagina, como cierra su press kit */}
          <div className="mt-20 flex justify-center md:mt-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/artists/karen-dayanna/firma.svg"
              alt="Firma de Karen Dayanna"
              className="w-[min(80vw,34rem)] opacity-55"
            />
          </div>
        </div>
      </section>

      {/* Roster */}
      <nav aria-label="Más artistas del roster" className="border-t border-white/10">
        <div className="grid md:grid-cols-2">
          <Link
            href={`/artistas/${anterior.slug}`}
            className="group flex items-center gap-5 border-b border-white/10 px-4 py-8 transition-colors duration-300 hover:bg-white/[0.03] md:border-b-0 md:border-r md:px-10 md:py-14"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 md:h-28 md:w-28">
              <Image
                src={anterior.photo_url}
                alt={anterior.name}
                fill
                sizes="112px"
                className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
              />
            </div>
            <div>
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                <ArrowLeft
                  size={12}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                Anterior
              </p>
              <p className="mt-2 font-heading text-3xl uppercase leading-none text-white transition-colors duration-300 group-hover:text-[#cbb6e6] md:text-4xl">
                {anterior.name}
              </p>
            </div>
          </Link>

          <Link
            href={`/artistas/${siguiente.slug}`}
            className="group flex flex-row-reverse items-center gap-5 px-4 py-8 text-right transition-colors duration-300 hover:bg-white/[0.03] md:px-10 md:py-14"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 md:h-28 md:w-28">
              <Image
                src={siguiente.photo_url}
                alt={siguiente.name}
                fill
                sizes="112px"
                className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
              />
            </div>
            <div>
              <p className="flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                Siguiente
                <ArrowRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </p>
              <p className="mt-2 font-heading text-3xl uppercase leading-none text-white transition-colors duration-300 group-hover:text-[#cbb6e6] md:text-4xl">
                {siguiente.name}
              </p>
            </div>
          </Link>
        </div>

        <div className="border-t border-white/10 py-6 text-center md:py-8">
          <Link
            href="/artistas"
            className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-mg-red"
          >
            Ver todo el roster
            <DiagonalArrow size={16} strokeWidth={1.75} />
          </Link>
        </div>
      </nav>
    </article>
  )
}
