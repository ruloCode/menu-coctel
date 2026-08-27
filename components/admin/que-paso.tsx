"use client"

import { useState, useTransition } from "react"
import { aplicarQuePaso, type QuePaso } from "@/app/admin/acciones"
import { Campo, Modal } from "./ui"
import type { Proyecto, Artista } from "@/lib/mg/tipos"

const OPCIONES: { v: QuePaso; l: string }[] = [
  { v: "delay",    l: "⏳ El proyecto se atrasó → mover release y recalcular todo" },
  { v: "song",     l: "✅ Se terminó de grabar una canción" },
  { v: "allrec",   l: "🎙 Se terminó TODA la grabación" },
  { v: "ready",    l: "🚀 El proyecto quedó listo para lanzar" },
  { v: "launched", l: "🎉 ¡Se lanzó!" },
  { v: "pause",    l: "⏸ Pausar proyecto (negociación caída, artista no disponible)" },
  { v: "resume",   l: "▶️ Reactivar proyecto pausado" },
]

/**
 * El atajo central del panel: en vez de editar seis campos a mano, el equipo
 * dice qué pasó en la vida real y el sistema recalcula el calendario completo.
 */
export default function QuePaso({
  proyectos, artistas, proyectoId, etiqueta = "⚡ ¿Qué pasó?", clase = "btn primary",
}: {
  proyectos: Proyecto[]
  artistas: Artista[]
  proyectoId?: string
  etiqueta?: string
  clase?: string
}) {
  const [abierto, setAbierto] = useState(false)
  const [pid, setPid] = useState(proyectoId ?? "")
  const [que, setQue] = useState<QuePaso>("delay")
  const [dias, setDias] = useState(14)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const disponibles = proyectos.filter((p) => p.estado !== "lanzado")
  const nombre = (id: string) => artistas.find((a) => a.id === id)?.nombre ?? "?"

  const abrir = () => {
    setPid(proyectoId ?? disponibles[0]?.id ?? "")
    setQue("delay")
    setError(null)
    setAbierto(true)
  }

  const aplicar = () => {
    arrancar(async () => {
      const r = await aplicarQuePaso(pid, que, dias)
      if (r.ok) setAbierto(false)
      else setError(r.error ?? "No se pudo aplicar")
    })
  }

  return (
    <>
      <button className={clase} onClick={abrir} disabled={!disponibles.length}>{etiqueta}</button>

      {abierto ? (
        <Modal
          titulo="⚡ ¿Qué pasó?"
          onClose={() => setAbierto(false)}
          pie={
            <>
              <button className="btn" onClick={() => setAbierto(false)}>Cancelar</button>
              <button className="btn primary" onClick={aplicar} disabled={pendiente || !pid}>
                {pendiente ? "Recalculando…" : "Aplicar y recalcular"}
              </button>
            </>
          }
        >
          <p className="small muted">
            Cuéntale al sistema qué cambió en la realidad y él recalcula el calendario de ahí en adelante.
          </p>

          <Campo label="Proyecto">
            <select value={pid} onChange={(e) => setPid(e.target.value)} style={{ flex: 1, minWidth: 220 }}>
              {disponibles.map((p) => (
                <option key={p.id} value={p.id}>
                  {nombre(p.artista_id)} — {p.titulo} ({p.grabados}/{p.tracks} grabadas)
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Qué sucedió">
            <select value={que} onChange={(e) => setQue(e.target.value as QuePaso)} style={{ flex: 1, minWidth: 220 }}>
              {OPCIONES.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </Campo>

          {que === "delay" ? (
            <Campo label="Atraso">
              <select value={dias} onChange={(e) => setDias(+e.target.value)}>
                <option value={7}>1 semana</option>
                <option value={14}>2 semanas</option>
                <option value={21}>3 semanas</option>
                <option value={28}>4 semanas</option>
                <option value={56}>8 semanas</option>
              </select>
              <span className="small muted">El release aterriza en el viernes siguiente.</span>
            </Campo>
          ) : null}

          {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
        </Modal>
      ) : null}
    </>
  )
}
