"use client"

import { useMemo, useState } from "react"
import { D, MESES, fmt, hoy, masDias } from "@/lib/mg/fechas"
import { eventosProyecto, artistaPorId } from "@/lib/mg/motor"
import type { Evento, Snapshot } from "@/lib/mg/tipos"
import { Leyenda, Vacio } from "./ui"
import ModalEvento from "./modal-evento"
import QuePaso from "./que-paso"

export default function VistaTimeline({
  snapshot, puedeEditar,
}: {
  snapshot: Snapshot
  puedeEditar: boolean
}) {
  const [evento, setEvento] = useState<Evento | null>(null)

  const { meses, pct, filas } = useMemo(() => {
    const inicio = new Date(2026, 8, 1, 12)
    const fin = D(snapshot.config.ajustes.horizonEnd)
    const meses: Date[] = []
    for (const d = new Date(inicio); d <= fin; d.setMonth(d.getMonth() + 1)) meses.push(new Date(d))

    const total = fin.getTime() - inicio.getTime()
    const pct = (s: string) => Math.max(0, Math.min(100, ((D(s).getTime() - inicio.getTime()) / total) * 100))

    const filas = snapshot.proyectos
      .filter((p) => p.estado !== "pausado" && artistaPorId(snapshot, p.artista_id))
      .map((p) => {
        const evs = eventosProyecto(snapshot, p)
        return {
          p,
          artista: artistaPorId(snapshot, p.artista_id)!,
          release: evs.find((e) => e.id.endsWith(":release")),
          contentDay: evs.find((e) => e.id.endsWith(":contentDay")),
          finPost: masDias(p.release, p.post_meses * 30),
        }
      })

    return { meses, pct, filas }
  }, [snapshot])

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Timeline de proyectos</h1>
          <div className="sub">Cada barra es una campaña completa: pre-lanzamiento, release y ventana de post.</div>
        </div>
        <div className="spacer" />
        {puedeEditar ? <QuePaso proyectos={snapshot.proyectos} artistas={snapshot.artistas} /> : null}
      </div>

      <Leyenda items={[
        { color: "var(--pre-wash)", label: "Pre-lanzamiento" },
        { color: "var(--c-release)", label: "Release" },
        { color: "var(--post-wash)", label: "Post-lanzamiento" },
        { color: "var(--c-content)", label: "Content day" },
        { color: "var(--critical)", label: "Hoy" },
      ]} />

      {filas.length === 0 ? (
        <div className="card"><Vacio titulo="No hay proyectos activos que dibujar" /></div>
      ) : (
        <div className="card tl-wrap" style={{ padding: 12 }}>
          <div className="tl">
            <div className="tl-months">
              {meses.map((m, i) => (
                <div key={i}>{MESES[m.getMonth()].slice(0, 3)} {String(m.getFullYear()).slice(2)}</div>
              ))}
            </div>

            {filas.map(({ p, artista, release, contentDay, finPost }) => (
              <div className="tl-row" key={p.id}>
                <div className="tl-label">
                  <b>{artista.nombre}</b>
                  <span>{p.titulo} · {p.tipo}</span>
                </div>
                <div className="tl-track">
                  {meses.map((_, i) => (
                    <span key={i} className="tl-grid-line" style={{ left: `${(i / meses.length) * 100}%` }} />
                  ))}
                  <span className="tl-today" style={{ left: `${pct(hoy())}%` }} title="Hoy" />
                  <span
                    className="tl-bar"
                    style={{
                      left: `${pct(p.pre_start)}%`,
                      width: `${pct(p.release) - pct(p.pre_start)}%`,
                      background: "var(--pre-wash)",
                      border: "1px solid var(--c-pre)",
                    }}
                    title={`Pre: ${fmt(p.pre_start)} → ${fmt(p.release)}`}
                  />
                  <span
                    className="tl-bar"
                    style={{
                      left: `${pct(p.release)}%`,
                      width: `${pct(finPost) - pct(p.release)}%`,
                      background: "var(--post-wash)",
                      border: "1px solid var(--baseline)",
                    }}
                    title={`Post hasta ${fmt(finPost)}`}
                  />
                  {contentDay ? (
                    <button
                      className="tl-mark"
                      style={{ left: `${pct(contentDay.fecha)}%`, background: "var(--c-content)", border: "none", padding: 0 }}
                      title={`Content day: ${fmt(contentDay.fecha)}`}
                      aria-label={`Content day de ${artista.nombre}: ${fmt(contentDay.fecha)}`}
                      onClick={() => setEvento(contentDay)}
                    />
                  ) : null}
                  {release ? (
                    <button
                      className="tl-mark"
                      style={{ left: `${pct(release.fecha)}%`, background: "var(--c-release)", width: 6, border: "none", padding: 0 }}
                      title={`Release: ${fmt(release.fecha)}`}
                      aria-label={`Release de ${artista.nombre}: ${fmt(release.fecha)}`}
                      onClick={() => setEvento(release)}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {evento ? (
        <ModalEvento evento={evento} snapshot={snapshot} puedeEditar={puedeEditar} onClose={() => setEvento(null)} />
      ) : null}
    </>
  )
}
