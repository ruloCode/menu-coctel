"use client"

import { useState } from "react"
import { fmt, hoy } from "@/lib/mg/fechas"
import { eventosFiestas } from "@/lib/mg/motor"
import type { Evento, Snapshot, Perfil } from "@/lib/mg/tipos"
import { Tag } from "./ui"
import ModalEvento from "./modal-evento"

export default function VistaFiestas({
  snapshot, yo, puedeEditar,
}: {
  snapshot: Snapshot
  yo: Perfil
  puedeEditar: boolean
}) {
  const [evento, setEvento] = useState<Evento | null>(null)
  const fiestas = eventosFiestas(snapshot)
  const t = hoy()

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Fiestas MG · Showcases</h1>
          <div className="sub">Residencia mensual: el último sábado de cada mes, con el artista que lanza como headliner.</div>
        </div>
      </div>

      <div className="card">
        <h2>El modelo: residencia mensual</h2>
        <p className="small">
          La evidencia de la industria favorece la <b>noche recurrente</b>: mismo bar aliado, mismo día del mes
          (último sábado), marca fija (“Noche MG”). 2–3 artistas por noche y de <b>headliner el artista que
          lanza ese mes</b> — así cada fiesta se vuelve fiesta de lanzamiento, generadora de contenido y de
          streams. Mensual es sostenible; semanal satura al equipo y al público.
        </p>

        <h3>Checklist por fiesta (T = fecha de la fiesta)</h3>
        <ul className="small" style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 4 }}>
          <li><b>T−4 semanas:</b> confirmar bar aliado y line-up (headliner + 2 invitados).</li>
          <li><b>T−3 semanas:</b> flyer y anuncio del line-up en redes.</li>
          <li><b>T−1 semana:</b> preventa / lista de invitados, prueba de sonido agendada.</li>
          <li><b>T:</b> registrar TODO en video — es materia prima del post-lanzamiento.</li>
          <li><b>T+3 días:</b> publicar recap (aftermovie corto) y clips por artista.</li>
        </ul>
      </div>

      <div className="card">
        <h2>Calendario de fiestas <span className="muted small">({fiestas.length})</span></h2>
        <div className="tabla-wrap">
          <table>
            <thead><tr><th>Fecha</th><th>Noche</th><th /><th /></tr></thead>
            <tbody>
              {fiestas.map((e) => (
                <tr key={e.id}>
                  <td className="mono" style={{ width: 140, whiteSpace: "nowrap" }}>{fmt(e.fecha)}</td>
                  <td>{e.etiqueta}</td>
                  <td style={{ width: 1 }}>
                    {snapshot.eventosEstado[e.id]?.hecho ? <Tag color="var(--good)">Hecha</Tag>
                      : e.fecha < t ? <Tag outline>Pasada</Tag> : null}
                  </td>
                  <td style={{ width: 110, textAlign: "right" }}>
                    <button className="btn sm" onClick={() => setEvento(e)}>
                      {puedeEditar ? "Editar" : "Ver"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {evento ? (
        <ModalEvento evento={evento} snapshot={snapshot} yo={yo} puedeEditar={puedeEditar} onClose={() => setEvento(null)} />
      ) : null}
    </>
  )
}
