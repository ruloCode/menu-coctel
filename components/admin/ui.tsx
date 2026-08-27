"use client"

import { useEffect, useRef, type ReactNode } from "react"

/* Piezas visuales compartidas por todo el panel. */

export function Tag({ color, outline, children }: { color?: string; outline?: boolean; children: ReactNode }) {
  return (
    <span className={outline ? "tag outline" : "tag"} style={outline ? undefined : { background: color }}>
      {children}
    </span>
  )
}

export function Kpi({ valor, label, ayuda }: { valor: ReactNode; label: string; ayuda?: string }) {
  return (
    <div className="kpi">
      <div className="v mono">{valor}</div>
      <div className="l">{label}</div>
      {ayuda ? <div className="h">{ayuda}</div> : null}
    </div>
  )
}

export function Vacio({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <h3>{titulo}</h3>
      {children ? <p className="small">{children}</p> : null}
    </div>
  )
}

/**
 * Modal accesible: bloquea el scroll de fondo, cierra con Escape y devuelve el
 * foco al elemento que lo abrió. `ancho` acepta cualquier medida CSS.
 */
export function Modal({
  titulo, ancho = "min(560px, 92vw)", onClose, children, pie,
}: {
  titulo: ReactNode
  ancho?: string
  onClose: () => void
  children: ReactNode
  pie?: ReactNode
}) {
  const caja = useRef<HTMLDivElement>(null)
  const previo = useRef<Element | null>(null)

  useEffect(() => {
    previo.current = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    caja.current?.focus()

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
      ;(previo.current as HTMLElement | null)?.focus?.()
    }
  }, [onClose])

  return (
    <div
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 50, padding: 16,
      }}
    >
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-label={typeof titulo === "string" ? titulo : undefined}
        tabIndex={-1}
        style={{
          background: "var(--surface)", borderRadius: 14, padding: "20px 22px",
          width: ancho, maxHeight: "88vh", overflowY: "auto",
          border: "1px solid var(--ring)", outline: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>{titulo}</h2>
          <button className="btn ghost sm" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        {children}
        {pie ? <div className="acciones">{pie}</div> : null}
      </div>
    </div>
  )
}

/** Campo de formulario con etiqueta a la izquierda (la fila del prototipo). */
export function Campo({ label, children, crece }: { label: ReactNode; children: ReactNode; crece?: boolean }) {
  return (
    <div className="frow">
      <label>{label}</label>
      <div className={crece ? "crece" : undefined} style={crece ? undefined : { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  )
}

export function Leyenda({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="legend">
      {items.map((t) => (
        <span key={t.label}>
          <i style={{ background: t.color }} />
          {t.label}
        </span>
      ))}
    </div>
  )
}
