import ScrollingText from "@/components/scrolling-text"
import GalleryGrid from "@/components/gallery-grid"
import { getAllGalleryItems } from "@/lib/mock-data"

export const metadata = {
  title: "Galeria | MG Company Group",
  description: "Galeria de fotos y videos de MG Company Group. Estudio, eventos en vivo, detras de camaras y mas.",
}

export default function GaleriaPage() {
  const galleryItems = getAllGalleryItems()

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 overflow-hidden border-b border-white/10">
        <ScrollingText text="Galeria" />
      </section>

      {/* Gallery */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <GalleryGrid items={galleryItems} />
      </section>
    </>
  )
}
