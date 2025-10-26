import ScrollingText from "@/components/scrolling-text"
import { mockContactInfo } from "@/lib/mock-data"
import Link from "next/link"
import { Target, Users, Globe2, TrendingUp } from "lucide-react"

export const metadata = {
  title: "About | MG-Company",
  description: "Learn about MG-Company's mission, values, and commitment to supporting exceptional talent in Latin America.",
}

export default function AboutPage() {
  const contact = mockContactInfo

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 overflow-hidden border-b border-white/10">
        <ScrollingText text="About" />
      </section>

      {/* Introduction */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8">
            Elevating Latin American Talent
          </h1>
          <p className="text-2xl md:text-3xl text-zinc-400 leading-relaxed mb-8">
            {contact.about.short}
          </p>
          <p className="text-xl text-zinc-400 leading-relaxed">
            {contact.about.long}
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-12 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Value 1 */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6">
              <Users className="text-black" size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
              Artist-First Approach
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              We put our artists at the center of everything we do. Their success is our success,
              and we're committed to providing personalized support that helps them achieve their goals.
            </p>
          </div>

          {/* Value 2 */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6">
              <Globe2 className="text-black" size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
              Global Reach
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              With partnerships across Latin America, Europe, and North America, we connect our artists
              with opportunities worldwide while staying true to their roots.
            </p>
          </div>

          {/* Value 3 */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6">
              <Target className="text-black" size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
              Strategic Vision
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              We don't just book shows—we build careers. Our team provides strategic guidance,
              artist development, and long-term career planning to ensure sustainable success.
            </p>
          </div>

          {/* Value 4 */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="text-black" size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
              Innovation
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              We embrace new technologies and industry trends to stay ahead of the curve,
              ensuring our artists have access to the best opportunities in the evolving music landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8">
            What We Do
          </h2>
          <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Booking & Tour Management</h3>
              <p>
                We secure the best performance opportunities for our artists, from intimate club shows
                to major festival appearances. Our team handles all aspects of tour coordination,
                ensuring smooth and successful performances.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Artist Development</h3>
              <p>
                We work closely with artists to develop their brand, refine their sound, and expand
                their reach. From emerging talent to established acts, we provide tailored support
                at every stage of an artist's career.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Brand Partnerships</h3>
              <p>
                We connect artists with brand opportunities that align with their values and aesthetic,
                creating mutually beneficial partnerships that enhance visibility and revenue streams.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Strategic Consulting</h3>
              <p>
                Our experienced team provides strategic guidance on career decisions, release strategies,
                and long-term planning to help artists build sustainable, fulfilling careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8">
            Ready to Work Together?
          </h2>
          <p className="text-xl text-zinc-400 mb-12">
            Whether you're an artist looking for representation or a promoter seeking exceptional talent,
            we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-black rounded-full text-sm uppercase font-bold hover:bg-zinc-200 transition-all"
            >
              Get in Touch
            </Link>
            <Link
              href="/artists"
              className="px-8 py-4 border border-white rounded-full text-sm uppercase font-bold hover:bg-white hover:text-black transition-all"
            >
              View Our Artists
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
