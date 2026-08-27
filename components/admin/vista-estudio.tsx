"use client"

import { useMemo, useState, useTransition } from "react"
import { claveSemana, fmt } from "@/lib/mg/fechas"
import { agendarSesiones, proyectoPorId } from "@/lib/mg/motor"
import type { Evento, Snapshot } from "@/lib/mg/tipos"
import { marcarSesionGrabada } from "@/app/admin/acciones"
import { Tag, Vacio } from "./ui"
import ModalEvento from "./modal-evento"
import QuePaso from "./que-paso"

export default function VistaEstudio({
  snapshot, puedeEditar,
}: {
  snapshot: Snapshot
  puedeEditar: boolean
}) {
  const [evento, setEvento] = useState<Evento | null>(null)
  const [pendiente, arrancar] = useTransition()
  const S = snapshot.config.ajustes
  const R = snapshot.config.reglas

  const semanas = useMemo(() => {
    const sesiones = agendarSesiones(snapshot)
    const porSemana: Record<string, Evento[]> = {}
    sesiones.forEach((s) => { (porSemana[claveSemana(s.fecha)] ||= []).push(s) })
    return Object.keys(porSemana).sort().map((wk) => ({ wk, lista: porSemana[wk] }))
  }, [snapshot])

  const totalTarde = semanas.reduce((n, s) => n + s.lista.filter((e) => e.tarde).length, 0)

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Estudio · Sesiones de grabación</h1>
          <div className="sub">El agendador reparte lo que falta grabar sobre la capacidad real del estudio.</div>
        </div>
        <div className="spacer" />
        {puedeEditar ? <QuePaso proyectos={snapshot.proyectos} artistas={snapshot.artistas} /> : null}
      </div>

      <div className="card">
        <h2>Cómo se agenda (regla de la casa)</h2>
        <p className="small">
          1 canción = 1 bloque de 4 h (a veces 2 el mismo día). Días de sesión:{" "}
          <b>martes, jueves y sábado</b> (sábado hasta {S.satBlocks} bloques) → ritmo base de{" "}
          <b>4 bloques por semana</b>, ampliable hasta {S.weeklyCap} de los {S.maxCap} posibles: el resto es{" "}
          <b>colchón</b> para repeticiones, mezclas y urgencias, y es lo que permite absorber atrasos sin mover releases.
          El agendador prioriza siempre el deadline más cercano (release − {R.recordingDone} días).
        </p>
      </div>

      {totalTarde > 0 ? (
        <div className="banner" style={{ borderColor: "var(--critical)" }}>
          <span aria-hidden>🔴</span>
          <b style={{ background: "var(--critical)" }}>{totalTarde}</b>
          <span>
            {totalTarde === 1 ? "sesión queda" : "sesiones quedan"} después de su deadline de grabación.
            No caben en la capacidad actual: hay que abrir bloques o mover el release.
          </span>
        </div>
      ) : null}

      {semanas.length === 0 ? (
        <div className="card"><Vacio titulo="🎉 No hay canciones pendientes por grabar" /></div>
      ) : null}

      {semanas.map(({ wk, lista }) => {
        const carga = lista.length
        const excede = carga > S.weeklyCap
        return (
          <div className="card" key={wk}>
            <div className="week-cap">
              <b>Semana del {fmt(wk)}</b>
              <div className="bar" role="img" aria-label={`${carga} de ${S.weeklyCap} bloques planificados`}>
                <div className={excede ? "fill over" : "fill"} style={{ width: `${Math.min(100, (carga / S.weeklyCap) * 100)}%` }} />
              </div>
              <span className="mono small">{carga}/{S.weeklyCap} bloques</span>
            </div>

            <div className="tabla-wrap">
              <table>
                <tbody>
                  {lista.map((s) => {
                    const p = proyectoPorId(snapshot, s.proyecto_id)
                    const hecha = snapshot.eventosEstado[s.id]?.hecho
                    return (
                      <tr key={s.id}>
                        <td className="mono" style={{ width: 132, whiteSpace: "nowrap" }}>{fmt(s.fecha)}</td>
                        <td>
                          {s.etiqueta}
                          {s.tarde ? <span className="warnrow small"> ⚠ después del deadline</span> : null}
                        </td>
                        <td className="muted small" style={{ whiteSpace: "nowrap" }}>
                          {p ? `${p.titulo} · release ${fmt(p.release)}` : ""}
                        </td>
                        <td style={{ width: 170, textAlign: "right", whiteSpace: "nowrap" }}>
                          {hecha ? (
                            <Tag color="var(--good)">Grabada ✓</Tag>
                          ) : puedeEditar ? (
                            <button
                              className="btn sm"
                              disabled={pendiente}
                              onClick={() => arrancar(async () => { await marcarSesionGrabada(s.id, s.proyecto_id!) })}
                            >
                              ✓ Grabada
                            </button>
                          ) : null}{" "}
                          <button className="btn sm" onClick={() => setEvento(s)}>Mover</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      {evento ? (
        <ModalEvento evento={evento} snapshot={snapshot} puedeEditar={puedeEditar} onClose={() => setEvento(null)} />
      ) : null}
    </>
  )
}
