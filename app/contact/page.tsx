import ScrollingText from "@/components/scrolling-text"
import { getAllAgents, mockContactInfo } from "@/lib/mock-data"
import { Mail, MapPin } from "lucide-react"

export const metadata = {
  title: "Contact | MG-Company",
  description: "Get in touch with MG-Company. Contact our booking agents and learn more about working with us.",
}

export default function ContactPage() {
  const agents = getAllAgents()
  const contact = mockContactInfo

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 overflow-hidden border-b border-white/10">
        <ScrollingText text="Contact" />
      </section>

      {/* Contact Info */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-4">
                {contact.company_name}
              </h2>
              <div className="flex items-start gap-2 text-zinc-400">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <div>
                  <p>{contact.address.line1}</p>
                  {contact.address.line2 && <p>{contact.address.line2}</p>}
                  <p>{contact.address.city}, {contact.address.postal_code}</p>
                  <p>{contact.address.country}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold uppercase mb-3">General Enquiries</h3>
              <a
                href={`mailto:${contact.email.general}`}
                className="text-xl hover:text-zinc-400 transition-colors inline-flex items-center gap-2"
              >
                <Mail size={20} />
                {contact.email.general}
              </a>
            </div>

            {contact.email.bookings && (
              <div>
                <h3 className="text-lg font-bold uppercase mb-3">Booking Enquiries</h3>
                <a
                  href={`mailto:${contact.email.bookings}`}
                  className="text-xl hover:text-zinc-400 transition-colors inline-flex items-center gap-2"
                >
                  <Mail size={20} />
                  {contact.email.bookings}
                </a>
              </div>
            )}

            {contact.email.press && (
              <div>
                <h3 className="text-lg font-bold uppercase mb-3">Press Enquiries</h3>
                <a
                  href={`mailto:${contact.email.press}`}
                  className="text-xl hover:text-zinc-400 transition-colors inline-flex items-center gap-2"
                >
                  <Mail size={20} />
                  {contact.email.press}
                </a>
              </div>
            )}
          </div>

          {/* About Section */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-8">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">About Us</h3>
            <p className="text-lg text-zinc-400 leading-relaxed">
              {contact.about.short}
            </p>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
            Our Agents
          </h2>
          <p className="text-zinc-400 text-lg">
            Meet our team of experienced booking agents
          </p>
        </div>

        {/* Agents Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-4 text-sm font-bold uppercase text-zinc-400">Name</th>
                <th className="text-left py-4 px-4 text-sm font-bold uppercase text-zinc-400">Email</th>
                <th className="text-left py-4 px-4 text-sm font-bold uppercase text-zinc-400">Specialization</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-bold">{agent.name}</td>
                  <td className="py-4 px-4">
                    <a
                      href={`mailto:${agent.email}`}
                      className="hover:text-zinc-400 transition-colors inline-flex items-center gap-2"
                    >
                      <Mail size={16} />
                      {agent.email}
                    </a>
                  </td>
                  <td className="py-4 px-4 text-zinc-400">{agent.bio || "General booking"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agents Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-zinc-900/50 border border-white/10 rounded-lg p-6 space-y-3"
            >
              <h3 className="text-xl font-black uppercase">{agent.name}</h3>
              <a
                href={`mailto:${agent.email}`}
                className="text-sm hover:text-zinc-400 transition-colors inline-flex items-center gap-2"
              >
                <Mail size={16} />
                {agent.email}
              </a>
              {agent.bio && (
                <p className="text-sm text-zinc-400">{agent.bio}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Mailing List CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center bg-zinc-900/50 border border-white/10 rounded-lg p-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            Join Our Mailing List
          </h2>
          <p className="text-lg text-zinc-400 mb-8">
            Stay updated with our latest news, events, and artist announcements.
          </p>
          <a
            href={`mailto:${contact.email.general}?subject=Mailing List Subscription`}
            className="inline-block px-8 py-4 bg-white text-black rounded-full text-sm uppercase font-bold hover:bg-zinc-200 transition-all"
          >
            Subscribe Now
          </a>
        </div>
      </section>
    </>
  )
}
