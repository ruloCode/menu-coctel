"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/* Piezas visuales compartidas por todo el panel. */

/**
 * `suave` invierte el tratamiento: el color pasa a ser la TINTA sobre un fondo
 * teñido, en vez de texto blanco sobre el color liso.
 *
 * El motivo es legibilidad. Blanco sobre el ámbar de release (#eda100) o sobre
 * el morado claro del tema oscuro (#9085e9) no llega al contraste mínimo — se
 * lee mal justo en la columna de estado, que es la que más se escanea. Con
 * fondo teñido al 14% el texto conserva el significado del color y se lee.
 */
export function Tag({
  color, outline, suave, children,
}: {
  color?: string
  outline?: boolean
  suave?: boolean
  children: ReactNode
}) {
  if (outline) return <span className="tag outline">{children}</span>

  if (suave) {
    return (
      <span className="tag suave" style={{ "--c": color } as React.CSSProperties}>
        {children}
      </span>
    )
  }

  return <span className="tag" style={{ background: color }}>{children}</span>
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

/**
 * Copia un dato al portapapeles y lo confirma en el sitio.
 *
 * Existe para el trabajo de contactar por WhatsApp: nombre, nombre artístico y
 * celular se copian de a uno sin seleccionar texto a mano en una tabla.
 * `navigator.clipboard` no existe fuera de un contexto seguro (http que no sea
 * localhost), de ahí el respaldo con execCommand.
 */
export function Copiar({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  const [copiado, setCopiado] = useState(false)
  const reloj = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(reloj.current), [])

  const copiar = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(valor)
      } else {
        const caja = document.createElement("textarea")
        caja.value = valor
        caja.style.position = "fixed"
        caja.style.opacity = "0"
        document.body.appendChild(caja)
        caja.select()
        document.execCommand("copy")
        document.body.removeChild(caja)
      }
      setCopiado(true)
      clearTimeout(reloj.current)
      reloj.current = setTimeout(() => setCopiado(false), 1400)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <button
      type="button"
      className="copiar"
      onClick={copiar}
      title={copiado ? "Copiado" : `Copiar ${etiqueta}`}
      aria-label={copiado ? `${etiqueta} copiado` : `Copiar ${etiqueta}`}
    >
      {copiado ? (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
          <rect x="5.6" y="5.6" width="8.4" height="8.4" rx="1.8"
            stroke="currentColor" strokeWidth="1.6" />
          <path d="M10.6 3.3a1.8 1.8 0 00-1.7-1.3H3.8A1.8 1.8 0 002 3.8v5.1c0 .8.5 1.4 1.3 1.7"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}
