import ArtistFilter from "@/components/artist-filter"
import { getAllArtists } from "@/lib/mock-data"

export const metadata = {
  title: "Artistas | MG Company Group",
  description: "Explora nuestro roster completo de artistas de musica urbana y latina.",
}

export default function ArtistasPage() {
  const artists = getAllArtists()

  return (
    <>
      {/* Editorial Header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 85% 0%, rgba(232,32,12,0.16) 0%, transparent 60%)",
          }}
        />
        <div className="container relative mx-auto px-4 pb-10 pt-10 md:px-6 md:pb-14 md:pt-16 lg:px-10">
          <div className="mb-6 flex items-center gap-3 md:mb-8">
            <span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-mg-red md:text-xs">
              [ Roster / MG Music ]
            </span>
            <span className="h-px flex-1 bg-mg-red/40" />
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 md:block">
              EST. 2024
            </span>
          </div>

          <h1 className="font-heading uppercase leading-[0.85] tracking-tight text-white text-[clamp(4rem,15vw,12rem)]">
            Artistas
          </h1>

          <div className="mt-6 grid grid-cols-12 items-end gap-6 md:mt-8">
            <p className="col-span-12 text-sm leading-relaxed text-zinc-400 md:col-span-6 md:text-base">
              Voces del Caribe y la diáspora latina. Música urbana, reggae,
              romántica y rap con sello propio — cada proyecto con una sola
              productora detrás, de punta a punta.
            </p>
            <div className="col-span-12 flex items-center justify-start gap-3 md:col-span-6 md:justify-end">
              <span className="font-heading text-5xl leading-none text-mg-red md:text-6xl">
                {String(artists.length).padStart(2, "0")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 md:text-[11px]">
                Proyectos
                <br />
                activos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Roster Grid with Search */}
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:px-10">
        <ArtistFilter artists={artists} />
      </section>
    </>
  )
}
