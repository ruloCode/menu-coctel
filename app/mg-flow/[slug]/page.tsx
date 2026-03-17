import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Play } from "lucide-react"
import { getShowBySlug, getAllShows } from "@/lib/mock-data"

interface ShowPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const shows = getAllShows()
  return shows.map((show) => ({
    slug: show.slug,
  }))
}

export async function generateMetadata({ params }: ShowPageProps) {
  const { slug } = await params
  const show = getShowBySlug(slug)

  if (!show) {
    return {
      title: "Show No Encontrado | MG Company Group",
    }
  }

  return {
    title: `${show.title} | MG Company Group`,
    description: show.description,
  }
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { slug } = await params
  const show = getShowBySlug(slug)

  if (!show) {
    notFound()
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-end overflow-hidden">
        <Image
          src={show.thumbnail}
          alt={show.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <span className="text-mg-red text-sm uppercase tracking-widest font-medium mb-2 block">
            {show.category}
          </span>
          <h1 className="font-heading text-4xl md:text-6xl uppercase text-white mb-3">
            {show.title}
          </h1>
          <p className="text-zinc-300 text-base md:text-lg max-w-2xl">
            {show.description}
          </p>
          <p className="text-zinc-400 text-sm mt-3">
            {show.episodes.length} {show.episodes.length === 1 ? "episodio" : "episodios"}
          </p>
        </div>
      </section>

      {/* Episodes */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-tight mb-8">
          Episodios
        </h2>
        <div className="space-y-8">
          {show.episodes.map((episode, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 border border-white/10 rounded-lg overflow-hidden"
            >
              {/* Episode Header */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-mg-red flex items-center justify-center flex-shrink-0">
                    <Play size={16} className="text-white ml-0.5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{episode.title}</h3>
                    {episode.duration && (
                      <span className="text-zinc-400 text-sm inline-flex items-center gap-1 mt-1">
                        <Clock size={14} />
                        {episode.duration}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-zinc-500 text-sm font-medium">
                  EP {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* YouTube Embed */}
              <div className="aspect-video">
                <iframe
                  src={episode.youtube_embed_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={episode.title}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Back Link */}
      <section className="container mx-auto px-4 py-8">
        <Link
          href="/mg-flow"
          className="inline-flex items-center gap-2 text-sm uppercase font-bold hover:text-mg-red transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver a MG Flow
        </Link>
      </section>
    </>
  )
}
