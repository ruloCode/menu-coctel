import ScrollingText from "@/components/scrolling-text"
import ContactForm from "@/components/contact-form"
import { mockContactInfo } from "@/lib/mock-data"
import { Mail, MapPin, Phone } from "lucide-react"

export const metadata = {
  title: "Contacto | MG Company Group",
  description: "Contacta a MG Company Group. Booking, prensa, colaboraciones y mas.",
}

export default function ContactoPage() {
  const contact = mockContactInfo

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 overflow-hidden border-b border-white/10">
        <ScrollingText text="Contacto" />
      </section>

      {/* Contact Content */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-tight mb-8">
              Enviar Mensaje
            </h2>
            <ContactForm />
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
              <h3 className="font-heading text-xl uppercase mb-4">Direccion</h3>
              <div className="flex items-start gap-3 text-zinc-400">
                <MapPin size={20} className="mt-1 flex-shrink-0 text-mg-red" />
                <div>
                  <p>{contact.address.line1}</p>
                  {contact.address.line2 && <p>{contact.address.line2}</p>}
                  <p>{contact.address.city}, {contact.address.postal_code}</p>
                  <p>{contact.address.country}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6 space-y-4">
              <h3 className="font-heading text-xl uppercase mb-4">Correos</h3>
              <div>
                <p className="text-sm text-zinc-500 uppercase mb-1">General</p>
                <a
                  href={`mailto:${contact.email.general}`}
                  className="text-zinc-300 hover:text-mg-red transition-colors inline-flex items-center gap-2"
                >
                  <Mail size={16} />
                  {contact.email.general}
                </a>
              </div>
              {contact.email.bookings && (
                <div>
                  <p className="text-sm text-zinc-500 uppercase mb-1">Booking</p>
                  <a
                    href={`mailto:${contact.email.bookings}`}
                    className="text-zinc-300 hover:text-mg-red transition-colors inline-flex items-center gap-2"
                  >
                    <Mail size={16} />
                    {contact.email.bookings}
                  </a>
                </div>
              )}
              {contact.email.press && (
                <div>
                  <p className="text-sm text-zinc-500 uppercase mb-1">Prensa</p>
                  <a
                    href={`mailto:${contact.email.press}`}
                    className="text-zinc-300 hover:text-mg-red transition-colors inline-flex items-center gap-2"
                  >
                    <Mail size={16} />
                    {contact.email.press}
                  </a>
                </div>
              )}
            </div>

            {contact.phone && (
              <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
                <h3 className="font-heading text-xl uppercase mb-4">Telefono</h3>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-zinc-300 hover:text-mg-red transition-colors inline-flex items-center gap-2"
                >
                  <Phone size={16} />
                  {contact.phone}
                </a>
              </div>
            )}

            {/* Social Media Links */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
              <h3 className="font-heading text-xl uppercase mb-4">Redes Sociales</h3>
              <div className="flex flex-wrap gap-3">
                {contact.social.instagram && (
                  <a
                    href={contact.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-white/20 text-sm hover:bg-mg-red hover:border-mg-red transition-all"
                  >
                    Instagram
                  </a>
                )}
                {contact.social.youtube && (
                  <a
                    href={contact.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-white/20 text-sm hover:bg-mg-red hover:border-mg-red transition-all"
                  >
                    YouTube
                  </a>
                )}
                {contact.social.spotify && (
                  <a
                    href={contact.social.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-white/20 text-sm hover:bg-mg-red hover:border-mg-red transition-all"
                  >
                    Spotify
                  </a>
                )}
                {contact.social.tiktok && (
                  <a
                    href={contact.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-white/20 text-sm hover:bg-mg-red hover:border-mg-red transition-all"
                  >
                    TikTok
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
