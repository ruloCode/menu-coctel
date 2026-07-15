import { existsSync } from "fs"
import { join } from "path"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Mail, Play } from "lucide-react"
import { getArtistBySlug, getAllArtists } from "@/lib/mock-data"
import PlatformLinks from "@/components/platform-links"
import DiagonalArrow from "@/components/diagonal-arrow"
import BookingDialog from "@/components/booking-dialog"

interface ArtistPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const artists = getAllArtists()
  return artists.map((artist) => ({
    slug: artist.slug,
  }))
}

export async function generateMetadata({ params }: ArtistPageProps) {
  const { slug } = await params
  const artist = getArtistBySlug(slug)

  if (!artist) {
    return {
      title: "Artista No Encontrado | MG Company Group",
    }
  }

  // Per-artist OG card if it was generated, otherwise the brand card
  const ogFile = `/og/og-${artist.slug}.jpg`
  const ogImage = existsSync(join(process.cwd(), "public", ogFile))
    ? ogFile
    : "/og/og-home.jpg"
  const title = `${artist.name} | MG Company Group`
  const description = artist.meta_description ?? artist.bio

  return {
    title,
    description,
    openGraph: {
      type: "profile",
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: artist.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

function SectionKicker({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-8 flex items-center gap-3 md:mb-10">
      <span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-mg-red md:text-xs">
        [ {index} / {label} ]
      </span>
      <span className="h-px flex-1 bg-mg-red/40" />
    </div>
  )
}

function FactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/10 px-6 py-4">
      <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
        {label}
      </dt>
      <dd className="mt-1.5 text-base text-white">{children}</dd>
    </div>
  )
}

export default async function ArtistaPage({ params }: ArtistPageProps) {
  const { slug } = await params
  const artist = getArtistBySlug(slug)

  if (!artist) {
    notFound()
  }

  const artists = getAllArtists()
  const currentIndex = artists.findIndex((a) => a.slug === artist.slug)
  const prevArtist = artists[(currentIndex - 1 + artists.length) % artists.length]
  const nextArtist = artists[(currentIndex + 1) % artists.length]

  const bookingEmail = artist.booking_email ?? artist.agent?.email
  const hasListenSection = Boolean(
    artist.spotify_embed || artist.spotify_album_embed || artist.stream_embed
  )
  const hasMedia =
    (artist.media.audio?.length ?? 0) > 0 || (artist.media.video?.length ?? 0) > 0

  // Dynamic section numbering: skips sections the artist doesn't have
  let sectionCount = 0
  const nextSection = () => String(++sectionCount).padStart(2, "0")

  return (
    <article>
      {/* Cinematic Hero — pulled up under the translucent fixed header */}
      <section className="relative -mt-16 flex min-h-[80svh] items-end overflow-hidden border-b border-white/10 md:-mt-24 md:min-h-[88svh] lg:-mt-28">
        <Image
          src={artist.hero_image_url || artist.photo_url}
          alt={artist.name}
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "center 25%" }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mg-black via-mg-black/40 to-mg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-mg-black/70 via-transparent to-transparent" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 15% 100%, rgba(232,32,12,0.22) 0%, transparent 65%)",
          }}
        />

        <div className="container relative mx-auto w-full px-4 pb-10 pt-52 md:px-6 md:pb-16 md:pt-72 lg:px-10">
          <Link
            href="/artistas"
            className="group mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60 transition-colors hover:text-white md:mb-10"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Roster
          </Link>

          <div className="mb-5 flex items-center gap-3 md:mb-6">
            <span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-mg-red md:text-xs">
              [ Artista MG / {String(currentIndex + 1).padStart(2, "0")} ]
            </span>
            <span className="h-px w-16 bg-mg-red/60 md:w-24" />
          </div>

          <h1 className="max-w-5xl font-heading uppercase leading-[0.85] tracking-tight text-white text-[clamp(3.25rem,11vw,9.5rem)]">
            {artist.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70 md:mt-5 md:text-xs">
            {artist.location && <span>{artist.location}</span>}
            {artist.genre && (
              <>
                <span className="text-mg-red">●</span>
                <span>{artist.genre}</span>
              </>
            )}
            {artist.label && (
              <>
                <span className="text-mg-red">●</span>
                <span>{artist.label}</span>
              </>
            )}
            <span className="text-mg-red">●</span>
            <span>MG Company Group</span>
          </div>

          {artist.tagline && (
            <p className="mt-3 max-w-xl text-sm italic text-white/60 md:text-base">
              &ldquo;{artist.tagline}&rdquo;
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4 md:mt-10 md:gap-5">
            {hasListenSection && (
              <a
                href="#escuchar"
                className="inline-flex items-center gap-3 bg-mg-red px-6 py-3.5 text-white transition-colors duration-300 hover:bg-white hover:text-mg-black md:px-8 md:py-4"
              >
                <Play size={15} className="fill-current" />
                <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] md:text-sm">
                  Escuchar
                </span>
              </a>
            )}
            <BookingDialog artistName={artist.name}>
              <button className="inline-flex items-center gap-3 border-2 border-white/80 px-6 py-3 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-mg-black md:px-8 md:py-3.5">
                <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] md:text-sm">
                  Booking
                </span>
                <DiagonalArrow size={18} strokeWidth={1.75} />
              </button>
            </BookingDialog>
            <PlatformLinks links={artist.social_links} />
          </div>
        </div>
      </section>

      {/* Perfil + Ficha */}
      <section className="container mx-auto px-4 py-14 md:px-6 md:py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <SectionKicker index={nextSection()} label="Perfil" />
            <p className="text-xl font-medium leading-relaxed text-white md:text-2xl">
              {artist.bio}
            </p>
            {artist.bio_full && (
              <div className="mt-8 space-y-5 text-base leading-relaxed text-zinc-400 md:text-lg">
                {artist.bio_full.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border border-white/10 bg-zinc-950/60 lg:sticky lg:top-36">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Ficha técnica
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mg-red">
                  MG
                </span>
              </div>

              <dl>
                <FactRow label="Artista">
                  <span className="font-heading text-2xl uppercase tracking-tight">
                    {artist.name}
                  </span>
                </FactRow>
                {artist.genre && <FactRow label="Género">{artist.genre}</FactRow>}
                {artist.location && <FactRow label="Ubicación">{artist.location}</FactRow>}
                {artist.label && <FactRow label="Sello">{artist.label}</FactRow>}
                {artist.booking_email && (
                  <FactRow label="Booking / Prensa">
                    <a
                      href={`mailto:${artist.booking_email}`}
                      className="break-all transition-colors hover:text-mg-red"
                    >
                      {artist.booking_email}
                    </a>
                  </FactRow>
                )}
                {artist.agent && (
                  <FactRow label="Management">
                    <span className="flex items-center gap-2">
                      {artist.agent.name}
                      <a
                        href={`mailto:${artist.agent.email}`}
                        aria-label={`Email ${artist.agent.name}`}
                        className="p-1 text-white/50 transition-colors hover:text-mg-red"
                      >
                        <Mail size={15} />
                      </a>
                    </span>
                  </FactRow>
                )}
                <div className="border-b border-white/10 px-6 py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Plataformas
                  </dt>
                  <dd className="mt-3">
                    <PlatformLinks links={artist.social_links} />
                  </dd>
                </div>
              </dl>

              <BookingDialog artistName={artist.name}>
                <button className="block w-full bg-mg-red px-6 py-5 text-center font-mono text-xs font-medium uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:bg-white hover:text-mg-black">
                  Solicitar booking
                </button>
              </BookingDialog>
            </div>
          </aside>
        </div>
      </section>

      {/* Escuchar */}
      {hasListenSection && (
        <section
          id="escuchar"
          className="container mx-auto scroll-mt-28 px-4 py-14 md:scroll-mt-36 md:px-6 md:py-20 lg:px-10"
        >
          <SectionKicker index={nextSection()} label="Escuchar" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {artist.spotify_embed && (
              <iframe
                src={artist.spotify_embed}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`${artist.name} en Spotify`}
                style={{ borderRadius: "12px" }}
              />
            )}
            {artist.spotify_album_embed && (
              <iframe
                src={artist.spotify_album_embed}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`${artist.name} - Último álbum`}
                style={{ borderRadius: "12px" }}
              />
            )}
            {artist.stream_embed && (
              <iframe
                src={artist.stream_embed}
                width="100%"
                height="344"
                allow="picture-in-picture"
                allowFullScreen
                loading="lazy"
                title={`${artist.name} stream`}
                className={
                  !artist.spotify_album_embed ? "lg:col-span-1" : "lg:col-span-2"
                }
                style={{ borderRadius: "12px" }}
              />
            )}
          </div>
        </section>
      )}

      {/* Discografía — tracklist editorial */}
      {artist.discography && artist.discography.length > 0 && (
        <section className="container mx-auto px-4 py-14 md:px-6 md:py-20 lg:px-10">
          <SectionKicker index={nextSection()} label="Discografía" />
          <ol className="border-t border-white/10">
            {artist.discography.map((album, index) => {
              const row = (
                <>
                  <span className="col-span-2 font-mono text-sm text-white/40 transition-colors duration-300 group-hover:text-mg-red md:col-span-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-6 font-heading text-2xl uppercase tracking-tight text-white transition-colors duration-300 group-hover:text-mg-red md:col-span-7 md:text-4xl">
                    {album.title}
                  </span>
                  <span className="col-span-2 font-mono text-xs uppercase tracking-[0.2em] text-white/50 md:text-sm">
                    {album.year}
                  </span>
                  <span className="col-span-2 flex justify-end text-white/30 transition-all duration-300 group-hover:text-mg-red">
                    {album.spotify_url && <DiagonalArrow size={22} strokeWidth={1.75} />}
                  </span>
                </>
              )

              return (
                <li key={index}>
                  {album.spotify_url ? (
                    <a
                      href={album.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group grid grid-cols-12 items-center gap-4 border-b border-white/10 px-2 py-5 transition-colors duration-300 hover:bg-white/[0.03] md:py-6"
                    >
                      {row}
                    </a>
                  ) : (
                    <div className="group grid grid-cols-12 items-center gap-4 border-b border-white/10 px-2 py-5 md:py-6">
                      {row}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </section>
      )}

      {/* Videos */}
      {artist.videos && artist.videos.length > 0 && (
        <section className="container mx-auto px-4 py-14 md:px-6 md:py-20 lg:px-10">
          <SectionKicker index={nextSection()} label="Videos" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {artist.videos.map((video, index) => (
              <figure key={index}>
                <div className="aspect-video overflow-hidden border border-white/10 bg-zinc-950">
                  <iframe
                    src={video.youtube_embed_url}
                    width="100%"
                    height="100%"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                    className="h-full w-full"
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-mg-red">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                    {video.title}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Media */}
      {hasMedia && (
        <section className="container mx-auto px-4 py-14 md:px-6 md:py-20 lg:px-10">
          <SectionKicker index={nextSection()} label="Media" />
          <div className="space-y-8">
            {artist.media.audio?.map((embedUrl, index) => (
              <div
                key={`audio-${index}`}
                className="aspect-video overflow-hidden border border-white/10 bg-zinc-950 md:aspect-[2/1]"
              >
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  title={`${artist.name} audio ${index + 1}`}
                  className="h-full w-full"
                />
              </div>
            ))}

            {artist.media.video?.map((embedUrl, index) => (
              <div
                key={`video-${index}`}
                className="aspect-video overflow-hidden border border-white/10 bg-zinc-950"
              >
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${artist.name} video ${index + 1}`}
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Galería */}
      {artist.gallery && artist.gallery.length > 0 && (
        <section className="container mx-auto px-4 py-14 md:px-6 md:py-20 lg:px-10">
          <SectionKicker index={nextSection()} label="Galería" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {artist.gallery.map((photoUrl, index) => (
              <figure
                key={photoUrl}
                className="group relative aspect-[4/5] overflow-hidden border border-white/10 bg-zinc-950"
              >
                <Image
                  src={photoUrl}
                  alt={`${artist.name} — foto ${index + 1}`}
                  fill
                  className="object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <span className="absolute left-0 top-0 border-b border-r border-white/10 bg-mg-black/70 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.3em] text-white/60 backdrop-blur-sm transition-colors duration-500 group-hover:text-mg-red">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Prensa & Booking */}
      {bookingEmail && (
        <section className="relative overflow-hidden border-t border-white/10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 60% at 90% 100%, rgba(232,32,12,0.16) 0%, transparent 60%)",
            }}
          />
          <div className="container relative mx-auto px-4 py-16 md:px-6 md:py-24 lg:px-10">
            <SectionKicker index={nextSection()} label="Prensa & Booking" />
            <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h2 className="font-heading uppercase leading-[0.9] tracking-tight text-white text-[clamp(2.5rem,6vw,4.5rem)]">
                  ¿Prensa, fechas
                  <br />o colaboraciones?
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-zinc-400 md:text-base">
                  Para entrevistas, fechas, festivales y colaboraciones con{" "}
                  {artist.name}, escríbenos a{" "}
                  <a
                    href={`mailto:${bookingEmail}`}
                    className="text-white underline decoration-mg-red underline-offset-4 transition-colors hover:text-mg-red"
                  >
                    {bookingEmail}
                  </a>
                  . El kit de prensa incluye biografía en tres versiones y fotos
                  en alta resolución listas para publicación.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 lg:col-span-5 lg:justify-end">
                <BookingDialog artistName={artist.name}>
                  <button className="inline-flex items-center gap-3 bg-mg-red px-6 py-3.5 text-white transition-colors duration-300 hover:bg-white hover:text-mg-black md:px-8 md:py-4">
                    <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] md:text-sm">
                      Solicitar booking
                    </span>
                    <DiagonalArrow size={18} strokeWidth={1.75} />
                  </button>
                </BookingDialog>
                {artist.press_kit_url ? (
                  <a
                    href={artist.press_kit_url}
                    download
                    className="inline-flex items-center gap-3 border-2 border-white/80 px-6 py-3 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-mg-black md:px-8 md:py-3.5"
                  >
                    <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] md:text-sm">
                      Descargar kit de prensa
                    </span>
                    <DiagonalArrow size={18} strokeWidth={1.75} />
                  </a>
                ) : (
                  <BookingDialog artistName={artist.name} intent="press-kit">
                    <button className="inline-flex items-center gap-3 border-2 border-white/80 px-6 py-3 text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-mg-black md:px-8 md:py-3.5">
                      <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] md:text-sm">
                        Solicitar kit de prensa
                      </span>
                      <DiagonalArrow size={18} strokeWidth={1.75} />
                    </button>
                  </BookingDialog>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Más del roster — prev / next */}
      {artists.length > 1 && (
        <nav aria-label="Más artistas del roster" className="border-t border-white/10">
          <div className="grid md:grid-cols-2">
            <Link
              href={`/artistas/${prevArtist.slug}`}
              className="group flex items-center gap-5 border-b border-white/10 px-4 py-8 transition-colors duration-300 hover:bg-white/[0.03] md:border-b-0 md:border-r md:px-10 md:py-14"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-white/10 md:h-28 md:w-28">
                <Image
                  src={prevArtist.photo_url}
                  alt={prevArtist.name}
                  fill
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  sizes="112px"
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
                <p className="mt-2 font-heading text-3xl uppercase leading-none text-white transition-colors duration-300 group-hover:text-mg-red md:text-4xl">
                  {prevArtist.name}
                </p>
              </div>
            </Link>

            <Link
              href={`/artistas/${nextArtist.slug}`}
              className="group flex flex-row-reverse items-center gap-5 px-4 py-8 text-right transition-colors duration-300 hover:bg-white/[0.03] md:px-10 md:py-14"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-white/10 md:h-28 md:w-28">
                <Image
                  src={nextArtist.photo_url}
                  alt={nextArtist.name}
                  fill
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  sizes="112px"
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
                <p className="mt-2 font-heading text-3xl uppercase leading-none text-white transition-colors duration-300 group-hover:text-mg-red md:text-4xl">
                  {nextArtist.name}
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
      )}
    </article>
  )
}
