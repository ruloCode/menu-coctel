import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Instagram, Music2, Youtube, Globe, Mail, ArrowLeft } from "lucide-react"
import { getArtistBySlug, getAllArtists } from "@/lib/mock-data"
import ScrollingText from "@/components/scrolling-text"

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
      title: "Artist Not Found | MG-Company",
    }
  }

  return {
    title: `${artist.name} | MG-Company`,
    description: artist.bio,
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = await params
  const artist = getArtistBySlug(slug)

  if (!artist) {
    notFound()
  }

  const socialIcons = {
    instagram: <Instagram size={20} />,
    spotify: <Music2 size={20} />,
    youtube: <Youtube size={20} />,
    soundcloud: <Music2 size={20} />,
    apple_music: <Music2 size={20} />,
    website: <Globe size={20} />,
  }

  return (
    <>
      {/* Scrolling Artist Name Header */}
      <section className="py-12 md:py-20 overflow-hidden border-b border-white/10">
        <ScrollingText text={artist.name} />
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Hero Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900">
            <Image
              src={artist.hero_image_url || artist.photo_url}
              alt={artist.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Artist Info Card */}
          <div className="space-y-8">
            {/* Info Grid */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-sm uppercase font-bold text-zinc-400 mb-1">Artist</h3>
                <p className="text-2xl font-black uppercase tracking-tight">{artist.name}</p>
              </div>

              {artist.agent && (
                <div>
                  <h3 className="text-sm uppercase font-bold text-zinc-400 mb-1">Agent</h3>
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
                  <h3 className="text-sm uppercase font-bold text-zinc-400 mb-1">Based</h3>
                  <p className="text-lg">{artist.location}</p>
                </div>
              )}

              {artist.label && (
                <div>
                  <h3 className="text-sm uppercase font-bold text-zinc-400 mb-1">Label</h3>
                  <p className="text-lg">{artist.label}</p>
                </div>
              )}
            </div>

            {/* Social Links */}
            {Object.keys(artist.social_links).length > 0 && (
              <div className="flex flex-wrap gap-3">
                {Object.entries(artist.social_links).map(([platform, url]) => {
                  if (!url) return null
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
                      aria-label={platform}
                    >
                      {socialIcons[platform as keyof typeof socialIcons] || <Globe size={20} />}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
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
      </section>

      {/* Media Section */}
      {(artist.media.audio?.length > 0 || artist.media.video?.length > 0) && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Media</h2>
          <div className="space-y-8">
            {/* Audio Embeds */}
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

            {/* Video Embeds */}
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
          href="/artists"
          className="inline-flex items-center gap-2 text-sm uppercase font-bold hover:text-zinc-400 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Artists
        </Link>
      </section>
    </>
  )
}
