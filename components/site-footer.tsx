"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Mail, Youtube, Music2 } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-16 md:py-20 mt-16 md:mt-20 lg:mt-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity duration-200">
              <Image
                src="/logo-mg.png"
                alt="MG Company Group"
                width={64}
                height={64}
                className="h-14 w-14"
              />
            </Link>
            <p className="mt-4 text-sm text-zinc-400">
              Productora artistica integral. Musica, cine, eventos en vivo y desarrollo de talento.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm uppercase font-bold mb-2 text-mg-red font-heading text-lg">Navegacion</h3>
            <Link href="/nosotros" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Nosotros</Link>
            <Link href="/artistas" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Artistas</Link>
            <Link href="/proyectos" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Proyectos</Link>
            <Link href="/mg-flow" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">MG Flow</Link>
            <Link href="/galeria" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Galeria</Link>
            <Link href="/contacto" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">Contacto</Link>
          </div>

          {/* Unidades */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm uppercase font-bold mb-2 text-mg-red font-heading text-lg">Unidades</h3>
            <Link href="/proyectos/mg-music" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">MG Music</Link>
            <Link href="/proyectos/mg-film" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">MG Film</Link>
            <Link href="/proyectos/mg-up" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">MG Up</Link>
            <Link href="/proyectos/mg-live" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">MG Live</Link>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm uppercase font-bold mb-4 text-mg-red font-heading text-lg">Siguenos</h3>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/mgcompanygroup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border-2 border-white/20 rounded-full hover:bg-mg-red hover:border-mg-red hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com/@mgcompanygroup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border-2 border-white/20 rounded-full hover:bg-mg-red hover:border-mg-red hover:scale-110 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://open.spotify.com/mgcompanygroup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border-2 border-white/20 rounded-full hover:bg-mg-red hover:border-mg-red hover:scale-110 transition-all duration-300"
                aria-label="Spotify"
              >
                <Music2 size={20} />
              </a>
              <a
                href="mailto:info@mgcompanygroup.com"
                className="w-12 h-12 flex items-center justify-center border-2 border-white/20 rounded-full hover:bg-mg-red hover:border-mg-red hover:scale-110 transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-white/10 text-center">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} MG Company Group. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
