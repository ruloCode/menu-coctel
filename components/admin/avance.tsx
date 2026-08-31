"use client"

import { colorDe } from "./personas"

/** Barra de avance. `sm` es la variante para la cabecera de artista, donde
 *  resume varios proyectos y no debe competir con la de cada proyecto. */
export function BarraAvance({
  hechas, total, pct, color, sm, etiqueta,
}: {
  hechas: number
  total: number
  pct: number
  color: string
  sm?: boolean
  etiqueta?: string
}) {
  return (
    <div className={sm ? "prog sm" : "prog"}>
      {!sm ? (
        <span className="small muted mono">
          {hechas}/{total} {etiqueta ?? "tareas"}
        </span>
      ) : null}
      <div
        className="via"
        role="img"
        aria-label={`${pct}% completado, ${hechas} de ${total} ${etiqueta ?? "tareas"}`}
      >
        <i style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="pct" style={{ color: pct === 100 ? "var(--muted)" : "var(--ink)" }}>{pct}%</span>
    </div>
  )
}

/** Casilla de completado. Sin librería de iconos: un check en SVG escala y
 *  hereda el color, cosa que un carácter tipográfico no hace igual de bien. */
export function Caja({ hecha }: { hecha: boolean }) {
  return (
    <span className="caja" aria-hidden>
      {hecha ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : null}
    </span>
  )
}

export function Flecha() {
  return (
    <svg className="flecha" width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function CheckCircular({ color = "var(--c-post)" }: { color?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  )
}

export const iniciales = (nombre: string) =>
  nombre.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase()

/** Ficha de color del artista. Reusa colorDe para que el mismo artista tenga
 *  siempre el mismo color en todo el panel. */
export function FichaArtista({ id, nombre }: { id: string; nombre: string }) {
  return (
    <span className="ini" style={{ background: colorDe(id) }} aria-hidden>
      {iniciales(nombre)}
    </span>
  )
}
