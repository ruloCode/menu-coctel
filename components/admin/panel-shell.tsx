"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { seccionesVisibles, etiquetaRol } from "@/lib/mg/permisos"
import type { Perfil } from "@/lib/mg/tipos"
import { cerrarSesion } from "@/app/admin/acciones"

const CLAVE_TEMA = "mg-panel-tema"

export default function PanelShell({
  perfil, avisos, children,
}: {
  perfil: Perfil
  /** Contadores por sección, para las píldoras de la navegación. */
  avisos: Record<string, number>
  children: ReactNode
}) {
  const pathname = usePathname()
  const [tema, setTema] = useState<"light" | "dark">("light")

  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE_TEMA)
    if (guardado === "dark" || guardado === "light") {
      setTema(guardado)
    } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      setTema("dark")
    }
  }, [])

  const cambiarTema = () => {
    const nuevo = tema === "dark" ? "light" : "dark"
    setTema(nuevo)
    try {
      localStorage.setItem(CLAVE_TEMA, nuevo)
    } catch {
      // Navegación privada: el tema simplemente no se recuerda.
    }
  }

  const secciones = seccionesVisibles(perfil.rol)
  const grupos = [...new Set(secciones.map((s) => s.grupo))]
  const iniciales = (perfil.nombre || perfil.email).slice(0, 2).toUpperCase()

  return (
    <div className="panel" data-tema={tema}>
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-mark" aria-hidden>MG</span>
            <span className="brand-txt">
              <b>MG Company</b>
              <span>Centro de operaciones</span>
            </span>
          </div>

          {grupos.map((g) => (
            <div key={g}>
              <div className="nav-grupo">{g}</div>
              <nav className="nav">
                {secciones.filter((s) => s.grupo === g).map((s) => {
                  const href = s.slug ? `/admin/${s.slug}` : "/admin"
                  const activo = s.slug ? pathname.startsWith(href) : pathname === "/admin"
                  const n = avisos[s.slug] ?? 0
                  return (
                    <Link key={s.slug} href={href} aria-current={activo ? "page" : undefined}>
                      <span className="ic" style={{ color: s.color }} aria-hidden>{s.icon}</span>
                      <span className="txt">{s.label}</span>
                      {n > 0 ? <span className="pill">{n}</span> : null}
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}

          <div className="side-foot">
            <div className="usuario">
              <span className="avatar" aria-hidden>{iniciales}</span>
              <span className="usuario-txt">
                <b>{perfil.nombre || perfil.email}</b>
                <span>{etiquetaRol(perfil.rol)}</span>
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn sm ghost" onClick={cambiarTema} title="Cambiar tema" style={{ flex: 1 }}>
                {tema === "dark" ? "☀" : "☾"} <span className="txt">Tema</span>
              </button>
              <form action={cerrarSesion} style={{ flex: 1, display: "flex" }}>
                <button className="btn sm ghost" style={{ flex: 1 }} title="Cerrar sesión">
                  ⏻ <span className="txt">Salir</span>
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="main">{children}</main>
      </div>
    </div>
  )
}
