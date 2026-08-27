"use client"

import { useState, useTransition, type ReactNode } from "react"
import type { Comentario, Perfil } from "@/lib/mg/tipos"
import { borrarComentario, comentar } from "@/app/admin/acciones"
import { Avatar } from "./personas"

/** Fecha relativa corta: en un hilo importa "hace 2 h", no el timestamp. */
function haceCuanto(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return "ahora"
  if (min < 60) return `hace ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.round(h / 24)
  return d < 30 ? `hace ${d} d` : new Date(iso).toLocaleDateString("es-CO")
}

/** Resalta las @menciones sin usar dangerouslySetInnerHTML: el cuerpo lo
 *  escribe una persona y no tiene por qué poder inyectar marcado. */
function ConMenciones({ texto, equipo }: { texto: string; equipo: Perfil[] }) {
  const nombres = equipo.map((m) => m.nombre).filter(Boolean)
  if (!nombres.length) return <>{texto}</>

  const patron = new RegExp(`(@(?:${nombres.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}))`, "gi")
  const partes = texto.split(patron)

  return (
    <>
      {partes.map((parte, i) =>
        patron.test(parte) && parte.startsWith("@")
          ? <span key={i} className="mencion">{parte}</span>
          : <span key={i}>{parte}</span>,
      )}
    </>
  )
}

export default function HiloComentarios({
  comentarios, equipo, yo, entidadTipo, entidadId, contexto, titulo = "Conversación",
}: {
  comentarios: Comentario[]
  equipo: Perfil[]
  yo: Perfil
  entidadTipo: string
  entidadId: string
  contexto: { titulo: string; enlace: string }
  titulo?: ReactNode
}) {
  const [texto, setTexto] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const enviar = () => {
    if (!texto.trim()) return
    arrancar(async () => {
      const r = await comentar(entidadTipo, entidadId, texto, contexto)
      if (r.ok) { setTexto(""); setError(null) }
      else setError(r.error ?? "No se pudo enviar")
    })
  }

  const puedeEscribir = yo.rol !== "viewer"

  return (
    <div>
      <h3>{titulo} <span className="muted small">({comentarios.length})</span></h3>

      {comentarios.length === 0 ? (
        <p className="small muted" style={{ margin: "4px 0 10px" }}>
          Sin comentarios. Lo que se decide aquí queda; lo que se decide en un chat se pierde.
        </p>
      ) : (
        <div className="hilo">
          {comentarios.map((c) => {
            const autor = equipo.find((m) => m.id === c.autor)
            return (
              <div className="comentario" key={c.id}>
                <Avatar perfil={autor} />
                <div className="burbuja">
                  <div className="cab">
                    <b>{c.autor_nombre || autor?.nombre || "—"}</b>
                    <time dateTime={c.created_at}>{haceCuanto(c.created_at)}</time>
                    {c.autor === yo.id || yo.rol === "owner" || yo.rol === "admin" ? (
                      <button
                        className="borrar"
                        title="Borrar comentario"
                        onClick={() => arrancar(async () => { await borrarComentario(c.id) })}
                      >✕</button>
                    ) : null}
                  </div>
                  <div className="cuerpo"><ConMenciones texto={c.cuerpo} equipo={equipo} /></div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {puedeEscribir ? (
        <div style={{ marginTop: 10 }}>
          <textarea
            rows={2}
            value={texto}
            placeholder="Escribe aquí. Usa @nombre para avisarle a alguien."
            style={{ width: "100%" }}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              // Enviar con ⌘/Ctrl + Enter, como en cualquier hilo de trabajo.
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); enviar() }
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span className="small muted">⌘↵ para enviar</span>
            <span className="spacer" />
            <button className="btn sm primary" onClick={enviar} disabled={pendiente || !texto.trim()}>
              {pendiente ? "Enviando…" : "Comentar"}
            </button>
          </div>
          {error ? <div className="alert critical" style={{ marginTop: 8 }}><span aria-hidden>⚠</span><span>{error}</span></div> : null}
        </div>
      ) : null}
    </div>
  )
}
