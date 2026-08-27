"use client"

import { useMemo, useState, useTransition } from "react"
import { D, DIAS, MESES, fmt, fmtLargo, hoy, iso } from "@/lib/mg/fechas"
import { TIPOS_EVENTO } from "@/lib/mg/constantes"
import type { Evento, Snapshot, TipoEvento } from "@/lib/mg/tipos"
import { crearEventoManual } from "@/app/admin/acciones"
import { Campo, Leyenda, Modal, Tag } from "./ui"
import ModalEvento from "./modal-evento"

const TIPOS_VISIBLES: TipoEvento[] = [
  "sesion", "content", "pre", "release", "fiesta", "post", "hito", "seguimiento", "publicacion",
]

export default function VistaCalendario({
  snapshot, eventos, puedeEditar,
}: {
  snapshot: Snapshot
  eventos: Evento[]
  puedeEditar: boolean
}) {
  const ahora = new Date()
  const [cursor, setCursor] = useState({ y: ahora.getFullYear(), m: ahora.getMonth() })
  const [filtro, setFiltro] = useState<TipoEvento | "todos">("todos")
  const [dia, setDia] = useState<string | null>(null)
  const [evento, setEvento] = useState<Evento | null>(null)
  const [nuevoEn, setNuevoEn] = useState<string | null>(null)

  const t = hoy()

  const visibles = useMemo(
    () => (filtro === "todos" ? eventos : eventos.filter((e) => e.tipo === filtro)),
    [eventos, filtro],
  )

  const porDia = useMemo(() => {
    const m: Record<string, Evento[]> = {}
    visibles.forEach((e) => { (m[e.fecha] ||= []).push(e) })
    return m
  }, [visibles])

  // Rejilla de 6 semanas empezando en domingo, con los días de relleno atenuados.
  const celdas = useMemo(() => {
    const primero = new Date(cursor.y, cursor.m, 1, 12)
    const inicio = new Date(primero)
    inicio.setDate(1 - primero.getDay())
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(inicio)
      d.setDate(inicio.getDate() + i)
      return { ds: iso(d), delMes: d.getMonth() === cursor.m, num: d.getDate() }
    })
  }, [cursor])

  const mover = (n: number) => {
    setCursor((c) => {
      let m = c.m + n
      let y = c.y
      if (m < 0) { m = 11; y-- }
      if (m > 11) { m = 0; y++ }
      return { y, m }
    })
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Calendario</h1>
          <div className="sub">Los hitos se derivan de cada release. Muévelos a mano solo cuando la realidad lo pida.</div>
        </div>
        <div className="spacer" />
        <div className="seg">
          <button onClick={() => mover(-1)} aria-label="Mes anterior">‹</button>
          <button onClick={() => setCursor({ y: ahora.getFullYear(), m: ahora.getMonth() })}>Hoy</button>
          <button onClick={() => mover(1)} aria-label="Mes siguiente">›</button>
        </div>
        <strong style={{ minWidth: 148, textTransform: "capitalize", fontSize: 15 }}>
          {MESES[cursor.m]} {cursor.y}
        </strong>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value as TipoEvento | "todos")}>
          <option value="todos">Todos los tipos</option>
          {TIPOS_VISIBLES.map((k) => <option key={k} value={k}>{TIPOS_EVENTO[k].label}</option>)}
        </select>
      </div>

      <div className="card">
        <Leyenda items={TIPOS_VISIBLES.map((k) => ({ color: TIPOS_EVENTO[k].color, label: TIPOS_EVENTO[k].label }))} />

        <div className="cal-head" aria-hidden>
          {DIAS.map((d) => <div key={d}>{d}</div>)}
        </div>

        <div className="cal-grid">
          {celdas.map((c) => {
            const evs = porDia[c.ds] ?? []
            return (
              <button
                key={c.ds}
                className={`cal-cell${c.delMes ? "" : " dim"}${c.ds === t ? " today" : ""}`}
                onClick={() => setDia(c.ds)}
                aria-label={`${fmtLargo(c.ds)} — ${evs.length} evento(s)`}
              >
                <span className="dnum">{c.num}</span>
                {evs.slice(0, 3).map((e) => (
                  <span
                    key={e.id}
                    className={`chip${snapshot.eventosEstado[e.id]?.hecho ? " done" : ""}`}
                    style={{ background: TIPOS_EVENTO[e.tipo].color }}
                    title={e.etiqueta}
                  >
                    {e.etiqueta}
                  </span>
                ))}
                {evs.length > 3 ? <span className="chip more">+{evs.length - 3} más</span> : null}
              </button>
            )
          })}
        </div>
      </div>

      {dia ? (
        <DetalleDia
          ds={dia}
          eventos={porDia[dia] ?? []}
          snapshot={snapshot}
          puedeEditar={puedeEditar}
          onClose={() => setDia(null)}
          onEvento={(e) => { setDia(null); setEvento(e) }}
          onNuevo={() => { setNuevoEn(dia); setDia(null) }}
        />
      ) : null}

      {evento ? (
        <ModalEvento
          evento={evento}
          snapshot={snapshot}
          puedeEditar={puedeEditar}
          onClose={() => setEvento(null)}
        />
      ) : null}

      {nuevoEn ? (
        <NuevoEvento ds={nuevoEn} snapshot={snapshot} onClose={() => setNuevoEn(null)} />
      ) : null}
    </>
  )
}

function DetalleDia({
  ds, eventos, snapshot, puedeEditar, onClose, onEvento, onNuevo,
}: {
  ds: string
  eventos: Evento[]
  snapshot: Snapshot
  puedeEditar: boolean
  onClose: () => void
  onEvento: (e: Evento) => void
  onNuevo: () => void
}) {
  return (
    <Modal
      titulo={fmtLargo(ds)}
      onClose={onClose}
      pie={
        <>
          {puedeEditar ? <button className="btn" onClick={onNuevo}>＋ Evento manual</button> : null}
          <button className="btn primary" onClick={onClose}>Cerrar</button>
        </>
      }
    >
      {eventos.length === 0 ? (
        <p className="small muted">Nada agendado este día.</p>
      ) : (
        <div className="tabla-wrap">
          <table>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id}>
                  <td style={{ width: 1 }}><Tag color={TIPOS_EVENTO[e.tipo].color}>{TIPOS_EVENTO[e.tipo].label}</Tag></td>
                  <td className={snapshot.eventosEstado[e.id]?.hecho ? "muted" : ""}>
                    {snapshot.eventosEstado[e.id]?.hecho ? <s>{e.etiqueta}</s> : e.etiqueta}
                  </td>
                  <td style={{ width: 1 }}>
                    <button className="btn sm" onClick={() => onEvento(e)}>Abrir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  )
}

function NuevoEvento({ ds, snapshot, onClose }: { ds: string; snapshot: Snapshot; onClose: () => void }) {
  const [etiqueta, setEtiqueta] = useState("")
  const [fecha, setFecha] = useState(ds)
  const [tipo, setTipo] = useState<TipoEvento>("hito")
  const [proyecto, setProyecto] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const guardar = () => {
    if (!etiqueta.trim()) { setError("Escribe de qué se trata el evento."); return }
    arrancar(async () => {
      const r = await crearEventoManual({ tipo, fecha, etiqueta: etiqueta.trim(), proyecto_id: proyecto || null })
      if (r.ok) onClose()
      else setError(r.error ?? "No se pudo crear")
    })
  }

  return (
    <Modal
      titulo="Nuevo evento manual"
      onClose={onClose}
      pie={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={guardar} disabled={pendiente}>
            {pendiente ? "Guardando…" : "Agregar al calendario"}
          </button>
        </>
      }
    >
      <Campo label="Descripción" crece>
        <input value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)}
          placeholder="Ej: Reunión con Dinastía Inc" style={{ width: "100%" }} />
      </Campo>
      <Campo label="Fecha">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </Campo>
      <Campo label="Tipo">
        <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoEvento)}>
          {TIPOS_VISIBLES.map((k) => <option key={k} value={k}>{TIPOS_EVENTO[k].label}</option>)}
        </select>
      </Campo>
      <Campo label="Proyecto">
        <select value={proyecto} onChange={(e) => setProyecto(e.target.value)}>
          <option value="">— sin proyecto —</option>
          {snapshot.proyectos.map((p) => (
            <option key={p.id} value={p.id}>
              {snapshot.artistas.find((a) => a.id === p.artista_id)?.nombre} — {p.titulo}
            </option>
          ))}
        </select>
      </Campo>
      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
    </Modal>
  )
}
