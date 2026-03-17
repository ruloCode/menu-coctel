import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Music2, Mail, ArrowLeft, Disc3 } from "lucide-react"
import { getArtistBySlug, getAllArtists } from "@/lib/mock-data"
import ScrollingText from "@/components/scrolling-text"
import PlatformLinks from "@/components/platform-links"

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

  return {
    title: `${artist.name} | MG Company Group`,
    description: artist.bio,
  }
}

export default async function ArtistaPage({ params }: ArtistPageProps) {
  const { slug } = await params
  const artist = getArtistBySlug(slug)

  if (!artist) {
    notFound()
  }

  return (
    <>
      {/* Scrolling Artist Name Header */}
      <section className="py-12 md:py-20 overflow-hidden border-b border-white/10">
        <ScrollingText text={artist.name} />
      </section>

      {/* Main Content - Two Columns on Desktop */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Photo + Biography */}
          <div className="space-y-10">
            {/* Hero Image */}
            <div className="relative aspect-square lg:aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900">
              <Image
                src={artist.hero_image_url || artist.photo_url}
                alt={artist.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Biography */}
            <div>
              <h2 className="font-heading text-3xl uppercase tracking-tight mb-6">Biografia</h2>
              <p className="text-xl leading-relaxed mb-6">
                <strong>{artist.bio}</strong>
              </p>
              {artist.bio_full && (
                <div className="text-lg text-zinc-400 leading-relaxed space-y-4">
                  {artist.bio_full.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Info + Spotify */}
          <div className="space-y-8">
            {/* Info Grid */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-sm uppercase font-bold text-zinc-400 mb-1">Artista</h3>
                <p className="text-2xl font-black uppercase tracking-tight">{artist.name}</p>
              </div>

              {artist.agent && (
                <div>
                  <h3 className="text-sm uppercase font-bold text-zinc-400 mb-1">Agente</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold">{artist.agent.name}</p>
                    <a
                      href={`mailto:${artist.agent.email}`}
                      className="p-2 hover:bg-white/10 rounded transition-colors"
                      aria-label={`Email ${artist.agent.name}`}
                    >
                      <Mail size={16} />
                    </a>
                  </div>
                </div>
              )}

              {artist.location && (
                <div>
                  <h3 className="text-sm uppercase font-bold text-zinc-400 mb-1">Ubicacion</h3>
                  <p className="text-lg">{artist.location}</p>
                </div>
              )}

              {artist.label && (
                <div>
                  <h3 className="text-sm uppercase font-bold text-zinc-400 mb-1">Sello</h3>
                  <p className="text-lg">{artist.label}</p>
                </div>
              )}

              {/* Platform Links */}
              <div className="pt-2">
                <PlatformLinks links={artist.social_links} />
              </div>
            </div>

            {/* Spotify Embed */}
            {artist.spotify_embed && (
              <div>
                <h3 className="font-heading text-xl uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Music2 size={20} className="text-mg-red" />
                  Escuchar
                </h3>
                <iframe
                  src={artist.spotify_embed}
                  width="100%"
                  height="352"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`${artist.name} en Spotify`}
                  style={{ borderRadius: '12px' }}
                />
                {artist.spotify_album_embed && (
                  <iframe
                    src={artist.spotify_album_embed}
                    width="100%"
                    height="352"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={`${artist.name} - Último álbum`}
                    className="mt-4"
                    style={{ borderRadius: '12px' }}
                  />
                )}
              </div>
            )}

            {/* Stream Embed */}
            {artist.stream_embed && (
              <iframe
                src={artist.stream_embed}
                width="100%"
                height="344"
                allow="picture-in-picture"
                allowFullScreen
                loading="lazy"
                title={`${artist.name} stream`}
                style={{ borderRadius: '24px' }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Discography Section */}
      {artist.discography && artist.discography.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-heading text-3xl uppercase tracking-tight mb-8 flex items-center gap-3">
            <Disc3 size={28} className="text-mg-red" />
            Discografia
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {artist.discography.map((album, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-white/10 rounded-lg p-6 hover:border-mg-red/50 transition-colors"
              >
                <h3 className="text-lg font-bold mb-1">{album.title}</h3>
                <p className="text-zinc-400 text-sm mb-3">{album.year}</p>
                {album.spotify_url && (
                  <a
                    href={album.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-mg-red hover:underline"
                  >
                    <Music2 size={14} />
                    Escuchar en Spotify
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Videos Section */}
      {artist.videos && artist.videos.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-heading text-3xl uppercase tracking-tight mb-8">Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artist.videos.map((video, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                  <iframe
                    src={video.youtube_embed_url}
                    width="100%"
                    height="100%"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                    className="w-full h-full"
                  />
                </div>
                <h3 className="text-sm font-medium text-zinc-300">{video.title}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Media Section */}
      {((artist.media.audio?.length ?? 0) > 0 || (artist.media.video?.length ?? 0) > 0) && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="font-heading text-3xl uppercase tracking-tight mb-8">Media</h2>
          <div className="space-y-8">
            {artist.media.audio?.map((embedUrl, index) => (
              <div key={`audio-${index}`} className="aspect-video md:aspect-[2/1] bg-zinc-900 rounded-lg overflow-hidden">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  title={`${artist.name} audio ${index + 1}`}
                  className="w-full h-full"
                />
              </div>
            ))}

            {artist.media.video?.map((embedUrl, index) => (
              <div key={`video-${index}`} className="aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${artist.name} video ${index + 1}`}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Back to Artists Link */}
      <section className="container mx-auto px-4 py-12">
        <Link
          href="/artistas"
          className="inline-flex items-center gap-2 text-sm uppercase font-bold hover:text-mg-red transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver a Artistas
        </Link>
      </section>
    </>
  )
}
