"use client"

import { useState, useTransition } from "react"
import { ESTADOS } from "@/lib/mg/constantes"
import { fmt, hoy, masDias } from "@/lib/mg/fechas"
import { artistaPorId, eventosProyecto } from "@/lib/mg/motor"
import type { EstadoProyecto, Proyecto, Snapshot, Tier } from "@/lib/mg/tipos"
import {
  crearArtista, crearProyecto, eliminarProyecto, guardarArtista, guardarProyecto, moverRelease,
} from "@/app/admin/acciones"
import { Campo, Modal, Tag, Vacio } from "./ui"
import QuePaso from "./que-paso"

const TIPOS = ["Single", "EP", "Álbum", "Por definir"]

const TIERS: [Tier, string][] = [
  ["marca", "Artistas de la marca — 2 lanzamientos · 3 meses pre + 3 meses post"],
  ["compilado", "Compilado MG — 1 lanzamiento · 2 meses pre + 1 mes post · master 50/50"],
]

export default function VistaArtistas({
  snapshot, puedeEditar,
}: {
  snapshot: Snapshot
  puedeEditar: boolean
}) {
  const [nuevoProyecto, setNuevoProyecto] = useState(false)
  const [nuevoArtista, setNuevoArtista] = useState(false)
  const [detalle, setDetalle] = useState<Proyecto | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, arrancar] = useTransition()

  // Las ediciones en línea van sin confirmación, así que cualquier rechazo de la
  // base (p. ej. dejar menos temas de los que ya están grabados) tiene que verse.
  const correr = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null)
    arrancar(async () => {
      const r = await fn()
      if (!r.ok) setError(r.error ?? "No se pudo guardar el cambio")
    })
  }

  const editar = <K extends keyof Proyecto>(id: string, campo: K, valor: Proyecto[K]) => {
    correr(() => guardarProyecto(id, { [campo]: valor } as never))
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Artistas y proyectos</h1>
          <div className="sub">Todo es editable en línea. Al mover un release, sus fechas derivadas se recalculan solas.</div>
        </div>
        <div className="spacer" />
        {puedeEditar ? (
          <>
            <button className="btn" onClick={() => setNuevoArtista(true)}>＋ Artista</button>
            <button className="btn" onClick={() => setNuevoProyecto(true)}>＋ Proyecto</button>
          </>
        ) : null}
        {puedeEditar ? <QuePaso proyectos={snapshot.proyectos} artistas={snapshot.artistas} /> : null}
      </div>

      {error ? (
        <div className="alert critical" role="status">
          <span aria-hidden>⚠</span>
          <span>{error}</span>
          <button className="btn sm ghost" style={{ marginLeft: "auto" }} onClick={() => setError(null)}>✕</button>
        </div>
      ) : null}

      <p className="small muted" style={{ marginBottom: 14 }}>
        Los nombres con <b>✎</b> están pendientes de confirmar su escritura oficial: hasta que se
        confirmen, aparecen como alerta en el resumen porque un nombre mal escrito en un DSP
        no se corrige después del lanzamiento.
      </p>

      {TIERS.map(([tier, label]) => {
        const proyectos = snapshot.proyectos.filter((p) => artistaPorId(snapshot, p.artista_id)?.tier === tier)
        return (
          <div className="card" key={tier}>
            <h2>{label}</h2>
            {proyectos.length === 0 ? (
              <Vacio titulo="Sin proyectos en esta categoría" />
            ) : (
              <div className="tabla-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Artista</th><th>Proyecto</th><th>Tipo</th><th>Temas</th><th>Grabadas</th>
                      <th>Release</th><th>Inicio pre</th><th>Estado</th><th />
                    </tr>
                  </thead>
                  <tbody>
                    {proyectos.map((p) => {
                      const a = artistaPorId(snapshot, p.artista_id)!
                      return [
                        <tr key={p.id}>
                          <td>
                            <input
                              defaultValue={a.nombre}
                              disabled={!puedeEditar}
                              style={{ maxWidth: 128, fontWeight: 600 }}
                              onBlur={(e) => {
                                if (e.target.value !== a.nombre) {
                                  correr(() => guardarArtista(a.id, { nombre: e.target.value, confirmado: true }))
                                }
                              }}
                            />
                            {!a.confirmado && puedeEditar ? (
                              <button
                                className="btn ghost sm"
                                title="Confirmar escritura oficial del nombre"
                                aria-label={`Confirmar la escritura del nombre de ${a.nombre}`}
                                onClick={() => correr(() => guardarArtista(a.id, { confirmado: true }))}
                              >✎</button>
                            ) : null}
                          </td>
                          <td>
                            <input defaultValue={p.titulo} disabled={!puedeEditar} style={{ maxWidth: 168 }}
                              onBlur={(e) => { if (e.target.value !== p.titulo) editar(p.id, "titulo", e.target.value) }} />
                          </td>
                          <td>
                            <select defaultValue={p.tipo} disabled={!puedeEditar}
                              onChange={(e) => editar(p.id, "tipo", e.target.value)}>
                              {TIPOS.map((t) => <option key={t}>{t}</option>)}
                            </select>
                          </td>
                          <td>
                            <input type="number" min={1} max={20} defaultValue={p.tracks} disabled={!puedeEditar}
                              onBlur={(e) => { if (+e.target.value !== p.tracks) editar(p.id, "tracks", +e.target.value) }} />
                          </td>
                          <td>
                            <input type="number" min={0} max={p.tracks} defaultValue={p.grabados} disabled={!puedeEditar}
                              onBlur={(e) => { if (+e.target.value !== p.grabados) editar(p.id, "grabados", +e.target.value) }} />
                          </td>
                          <td>
                            <input type="date" defaultValue={p.release} disabled={!puedeEditar}
                              onChange={(e) => {
                                if (e.target.value && e.target.value !== p.release) {
                                  correr(() => moverRelease(p.id, e.target.value))
                                }
                              }} />
                          </td>
                          <td>
                            <input type="date" defaultValue={p.pre_start} disabled={!puedeEditar}
                              onChange={(e) => { if (e.target.value) editar(p.id, "pre_start", e.target.value) }} />
                          </td>
                          <td>
                            <select defaultValue={p.estado} disabled={!puedeEditar}
                              onChange={(e) => editar(p.id, "estado", e.target.value as EstadoProyecto)}>
                              {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                          </td>
                          <td><button className="btn sm" onClick={() => setDetalle(p)}>Ver</button></td>
                        </tr>,
                        p.notas ? (
                          <tr key={p.id + "-n"}>
                            <td />
                            <td colSpan={8} className="small muted">↳ {p.notas}</td>
                          </tr>
                        ) : null,
                      ]
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}

      {detalle ? (
        <DetalleProyecto proyecto={detalle} snapshot={snapshot} puedeEditar={puedeEditar} onClose={() => setDetalle(null)} />
      ) : null}
      {nuevoProyecto ? <NuevoProyecto snapshot={snapshot} onClose={() => setNuevoProyecto(false)} /> : null}
      {nuevoArtista ? <NuevoArtista onClose={() => setNuevoArtista(false)} /> : null}
    </>
  )
}

function DetalleProyecto({
  proyecto, snapshot, puedeEditar, onClose,
}: {
  proyecto: Proyecto
  snapshot: Snapshot
  puedeEditar: boolean
  onClose: () => void
}) {
  const a = artistaPorId(snapshot, proyecto.artista_id)
  const eventos = eventosProyecto(snapshot, proyecto)
  const [notas, setNotas] = useState(proyecto.notas)
  const [pendiente, arrancar] = useTransition()

  return (
    <Modal
      titulo={`${a?.nombre ?? "?"} — ${proyecto.titulo}`}
      ancho="min(660px, 94vw)"
      onClose={onClose}
      pie={
        puedeEditar ? (
          <>
            <button
              className="btn danger"
              disabled={pendiente}
              onClick={() => {
                if (!confirm(`¿Eliminar el proyecto “${proyecto.titulo}”? Se borran también sus fechas movidas a mano.`)) return
                arrancar(async () => { await eliminarProyecto(proyecto.id); onClose() })
              }}
            >Eliminar proyecto</button>
            <button className="btn primary" disabled={pendiente}
              onClick={() => arrancar(async () => { await guardarProyecto(proyecto.id, { notas }); onClose() })}>
              Guardar notas
            </button>
          </>
        ) : <button className="btn primary" onClick={onClose}>Cerrar</button>
      }
    >
      <div className="kpis" style={{ marginBottom: 14 }}>
        <div className="kpi"><div className="v mono">{proyecto.grabados}/{proyecto.tracks}</div><div className="l">Canciones grabadas</div></div>
        <div className="kpi"><div className="v mono" style={{ fontSize: 17 }}>{fmt(proyecto.release)}</div><div className="l">Release</div></div>
        <div className="kpi"><div className="v mono">{proyecto.post_meses}</div><div className="l">Meses de post</div></div>
      </div>

      <h3>Fechas derivadas</h3>
      <div className="tabla-wrap">
        <table>
          <tbody>
            {eventos.map((e) => (
              <tr key={e.id}>
                <td className="mono" style={{ width: 130, whiteSpace: "nowrap" }}>{fmt(e.fecha)}</td>
                <td>{e.etiqueta}</td>
                <td style={{ width: 1 }}>
                  {snapshot.eventosEstado[e.id]?.hecho ? <Tag color="var(--good)">Hecho</Tag> : null}
                  {snapshot.eventosEstado[e.id]?.fecha_override ? <Tag outline>Movido</Tag> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Notas</h3>
      <textarea rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} disabled={!puedeEditar}
        style={{ width: "100%" }} placeholder="Lo que el equipo tiene que saber de este proyecto" />
    </Modal>
  )
}

function NuevoProyecto({ snapshot, onClose }: { snapshot: Snapshot; onClose: () => void }) {
  const [artista, setArtista] = useState(snapshot.artistas[0]?.id ?? "")
  const [titulo, setTitulo] = useState("Nuevo lanzamiento")
  const [tipo, setTipo] = useState("EP")
  const [tracks, setTracks] = useState(4)
  const [release, setRelease] = useState(masDias(hoy(), 120))
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const crear = () => {
    arrancar(async () => {
      const r = await crearProyecto({ artista_id: artista, titulo, tipo, tracks, release })
      if (r.ok) onClose()
      else setError(r.error ?? "No se pudo crear")
    })
  }

  return (
    <Modal titulo="Nuevo proyecto" onClose={onClose} pie={
      <>
        <button className="btn" onClick={onClose}>Cancelar</button>
        <button className="btn primary" onClick={crear} disabled={pendiente || !artista}>
          {pendiente ? "Creando…" : "Crear"}
        </button>
      </>
    }>
      <Campo label="Artista">
        <select value={artista} onChange={(e) => setArtista(e.target.value)} style={{ minWidth: 200 }}>
          {snapshot.artistas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
        </select>
      </Campo>
      <Campo label="Título" crece>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} style={{ width: "100%" }} />
      </Campo>
      <Campo label="Tipo">
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          {TIPOS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </Campo>
      <Campo label="Temas">
        <input type="number" min={1} max={20} value={tracks} onChange={(e) => setTracks(+e.target.value)} />
      </Campo>
      <Campo label="Release">
        <input type="date" value={release} onChange={(e) => setRelease(e.target.value)} />
        <span className="small muted">El inicio del pre se calcula solo según el tier del artista.</span>
      </Campo>
      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
    </Modal>
  )
}

function NuevoArtista({ onClose }: { onClose: () => void }) {
  const [nombre, setNombre] = useState("")
  const [tier, setTier] = useState<Tier>("compilado")
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const crear = () => {
    if (!nombre.trim()) { setError("Escribe el nombre artístico."); return }
    arrancar(async () => {
      const r = await crearArtista(nombre.trim(), tier)
      if (r.ok) onClose()
      else setError(r.error ?? "No se pudo crear")
    })
  }

  return (
    <Modal titulo="Nuevo artista en el roster" onClose={onClose} pie={
      <>
        <button className="btn" onClick={onClose}>Cancelar</button>
        <button className="btn primary" onClick={crear} disabled={pendiente}>
          {pendiente ? "Creando…" : "Agregar al roster"}
        </button>
      </>
    }>
      <Campo label="Nombre artístico" crece>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: "100%" }} autoFocus />
      </Campo>
      <Campo label="Categoría">
        <select value={tier} onChange={(e) => setTier(e.target.value as Tier)}>
          <option value="marca">Artista de la marca</option>
          <option value="compilado">Compilado MG</option>
        </select>
      </Campo>
      <p className="small muted">
        La categoría define la ventana de campaña: marca = 3 meses de pre y 3 de post;
        compilado = 2 de pre y 1 de post.
      </p>
      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
    </Modal>
  )
}
