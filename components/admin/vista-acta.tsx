"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { fmt, hoy, masDias } from "@/lib/mg/fechas"
import { TIPOS_EVENTO } from "@/lib/mg/constantes"
import { comentariosDe } from "@/lib/mg/motor"
import type { Evento, Perfil, Reunion, Snapshot, TipoEvento } from "@/lib/mg/tipos"
import { asignarEvento, cerrarMiPendiente, crearAcuerdo, marcarEvento } from "@/app/admin/acciones"
import { puede } from "@/lib/mg/permisos"
import { Campo, Modal, Tag, Vacio } from "./ui"
import { SelectorPersona } from "./personas"
import HiloComentarios from "./hilo-comentarios"

export default function VistaActa({
  reunion, acuerdos, snapshot, yo,
}: {
  reunion: Reunion
  /** Los eventos nacidos en esta junta, ya resueltos por el motor. */
  acuerdos: Evento[]
  snapshot: Snapshot
  yo: Perfil
}) {
  const [nuevo, setNuevo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()
  const puedeOperar = puede(yo.rol, "operar")
  const t = hoy()

  const correr = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null)
    arrancar(async () => {
      const r = await fn()
      if (!r.ok) setError(r.error ?? "No se pudo aplicar")
    })
  }

  const sinDueno = acuerdos.filter((a) => !a.responsable_id && !a.hecho).length
  const cerrados = acuerdos.filter((a) => a.hecho).length

  return (
    <>
      <div className="topbar">
        <div>
          <Link href="/admin/reuniones" className="small muted" style={{ textDecoration: "none" }}>← Reuniones</Link>
          <h1 style={{ marginTop: 4 }}>{reunion.titulo}</h1>
          <div className="sub">
            {fmt(reunion.fecha)}
            {reunion.duracion_min ? ` · ${reunion.duracion_min} min` : ""}
            {reunion.participantes.length ? ` · ${reunion.participantes.join(", ")}` : ""}
          </div>
        </div>
        <div className="spacer" />
        {puedeOperar ? <button className="btn primary" onClick={() => setNuevo(true)}>＋ Acuerdo</button> : null}
      </div>

      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}

      {sinDueno ? (
        <div className="banner">
          <span aria-hidden>👤</span>
          <b>{sinDueno}</b>
          <span>
            {sinDueno === 1 ? "acuerdo sigue" : "acuerdos siguen"} sin responsable. Un acuerdo sin dueño
            es una conversación, no un compromiso.
          </span>
        </div>
      ) : null}

      <div className="card acta">
        <h2>Resumen</h2>
        <div className="acta-resumen">
          {reunion.resumen.split("\n\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      {reunion.decisiones.length ? (
        <div className="card acta">
          <h2>Decisiones <span className="muted small">({reunion.decisiones.length})</span></h2>
          <ul className="lista-limpia">
            {reunion.decisiones.map((d, i) => (
              <li className="decision" key={i}>
                <div>
                  <b>{d.texto}</b>
                  {d.detalle ? <span>{d.detalle}</span> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="card">
        <h2>
          Acuerdos <span className="muted small">({acuerdos.length}{cerrados ? ` · ${cerrados} cerrados` : ""})</span>
        </h2>
        <p className="small muted">
          Cada uno es un evento real: aparece en el calendario y, si tiene responsable, en su Mi trabajo.
        </p>

        {acuerdos.length === 0 ? (
          <Vacio titulo="Esta junta no dejó compromisos con fecha" />
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr><th /><th>Fecha</th><th>Qué</th><th>Tipo</th><th style={{ width: 186 }}>Responsable</th></tr>
              </thead>
              <tbody>
                {acuerdos.map((a) => {
                  const vencido = a.fecha < t && !a.hecho
                  return (
                    <tr key={a.id}>
                      <td style={{ width: 1 }}>
                        {puedeOperar || a.responsable_id === yo.id ? (
                          <button
                            className="tick"
                            title={a.hecho ? "Reabrir" : "Marcar como hecho"}
                            aria-label={`${a.hecho ? "Reabrir" : "Cerrar"}: ${a.etiqueta}`}
                            disabled={pendiente}
                            style={a.hecho ? { borderColor: "var(--good)", color: "var(--good)" } : undefined}
                            onClick={() => correr(() =>
                              puedeOperar
                                ? marcarEvento(a.id, !a.hecho, a.etiqueta)
                                : cerrarMiPendiente(a.id, !a.hecho))}
                          >✓</button>
                        ) : null}
                      </td>
                      <td className={vencido ? "mono small warnrow" : "mono small"} style={{ whiteSpace: "nowrap" }}>
                        {fmt(a.fecha)}{vencido ? " ⚠" : ""}
                      </td>
                      <td className={a.hecho ? "small muted" : "small"}>
                        {a.hecho ? <s>{a.etiqueta}</s> : a.etiqueta}
                      </td>
                      <td><Tag color={TIPOS_EVENTO[a.tipo].color}>{TIPOS_EVENTO[a.tipo].label}</Tag></td>
                      <td>
                        {puedeOperar ? (
                          <SelectorPersona
                            equipo={snapshot.equipo}
                            valor={a.responsable_id}
                            disabled={pendiente}
                            onChange={(id) => correr(() => asignarEvento(a.id, id, a.etiqueta))}
                          />
                        ) : (
                          <span className="small">
                            {snapshot.equipo.find((m) => m.id === a.responsable_id)?.nombre ?? "—"}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {reunion.riesgos.length ? (
        <div className="card acta">
          <h2>Riesgos <span className="muted small">({reunion.riesgos.length})</span></h2>
          <ul className="lista-limpia">
            {[...reunion.riesgos]
              .sort((a, b) => ({ alto: 0, medio: 1, bajo: 2 })[a.nivel] - ({ alto: 0, medio: 1, bajo: 2 })[b.nivel])
              .map((r, i) => (
                <li className="riesgo" key={i}>
                  <span className={`nivel ${r.nivel}`}>{r.nivel}</span>
                  <span>{r.texto}</span>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {reunion.pendientes.length ? (
        <div className="card acta">
          <h2>Quedó sin resolver <span className="muted small">({reunion.pendientes.length})</span></h2>
          <p className="small muted">
            No son tareas: son preguntas que hay que cerrar en la próxima junta o antes.
          </p>
          <ul className="lista-limpia">
            {reunion.pendientes.map((p, i) => (
              <li className="pendiente-junta" key={i}><span>{p.texto}</span></li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="card acta">
        <HiloComentarios
          comentarios={comentariosDe(snapshot, "reunion", reunion.id)}
          equipo={snapshot.equipo}
          yo={yo}
          entidadTipo="reunion"
          entidadId={reunion.id}
          contexto={{ titulo: reunion.titulo, enlace: `/admin/reuniones/${reunion.id}` }}
          titulo="Comentarios del acta"
        />
      </div>

      {nuevo ? (
        <NuevoAcuerdo
          reunionId={reunion.id}
          snapshot={snapshot}
          onClose={() => setNuevo(false)}
        />
      ) : null}
    </>
  )
}

function NuevoAcuerdo({
  reunionId, snapshot, onClose,
}: {
  reunionId: string
  snapshot: Snapshot
  onClose: () => void
}) {
  const [etiqueta, setEtiqueta] = useState("")
  const [fecha, setFecha] = useState(masDias(hoy(), 7))
  const [tipo, setTipo] = useState<TipoEvento>("hito")
  const [responsable, setResponsable] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const crear = () => {
    if (!etiqueta.trim()) { setError("Escribe en qué consiste el acuerdo."); return }
    arrancar(async () => {
      const r = await crearAcuerdo({
        reunionId, etiqueta: etiqueta.trim(), fecha, tipo, responsableId: responsable,
      })
      if (r.ok) onClose()
      else setError(r.error ?? "No se pudo crear")
    })
  }

  return (
    <Modal titulo="Nuevo acuerdo" onClose={onClose} pie={
      <>
        <button className="btn" onClick={onClose}>Cancelar</button>
        <button className="btn primary" onClick={crear} disabled={pendiente}>
          {pendiente ? "Creando…" : "Agregar acuerdo"}
        </button>
      </>
    }>
      <Campo label="Qué se acordó" crece>
        <input value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)} style={{ width: "100%" }}
          placeholder="Ej: Conseguir la locación de grabación" autoFocus />
      </Campo>
      <Campo label="Para cuándo">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </Campo>
      <Campo label="Tipo">
        <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoEvento)}>
          {(Object.keys(TIPOS_EVENTO) as TipoEvento[]).map((k) => (
            <option key={k} value={k}>{TIPOS_EVENTO[k].label}</option>
          ))}
        </select>
      </Campo>
      <Campo label="Responsable">
        <SelectorPersona equipo={snapshot.equipo} valor={responsable} onChange={setResponsable} />
        <span className="small muted">Le llega un aviso a su bandeja.</span>
      </Campo>
      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
    </Modal>
  )
}
