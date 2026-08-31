"use client"

import { useMemo, useState, useTransition } from "react"
import { ESTADOS, TIPOS_EVENTO } from "@/lib/mg/constantes"
import { diasEntre, fmt, hoy, masDias } from "@/lib/mg/fechas"
import { artistaPorId, avanceProyecto, colorAvance } from "@/lib/mg/motor"
import type { Artista, EstadoProyecto, Evento, Perfil, Proyecto, Snapshot, Tier } from "@/lib/mg/tipos"
import {
  cerrarMiPendiente, crearArtista, crearProyecto, eliminarProyecto, guardarArtista,
  guardarProyecto, marcarEvento, moverRelease,
} from "@/app/admin/acciones"
import { BarraAvance, Caja, CheckCircular, FichaArtista, Flecha } from "./avance"
import { Campo, Modal, Tag, Vacio } from "./ui"
import QuePaso from "./que-paso"

const TIPOS = ["Single", "EP", "Álbum", "Por definir"]

const TIERS: [Tier, string][] = [
  ["marca", "Artistas de la marca — 2 lanzamientos · 3 meses pre + 3 meses post"],
  ["compilado", "Compilado MG — 1 lanzamiento · 2 meses pre + 1 mes post · master 50/50"],
]

type Modo = "artista" | "release"
type Filtro = "todos" | "abiertos" | "cerrados"

/** Trimestre de una fecha ISO, para dar ritmo a la vista por lanzamiento sin
 *  inventar una dimensión que el modelo no tenga. */
const trimestre = (iso: string) => `Q${Math.floor(+iso.slice(5, 7) === 0 ? 0 : (+iso.slice(5, 7) - 1) / 3) + 1} ${iso.slice(0, 4)}`

export default function VistaArtistas({
  snapshot, yo, puedeEditar,
}: {
  snapshot: Snapshot
  yo: Perfil
  puedeEditar: boolean
}) {
  const [modo, setModo] = useState<Modo>("artista")
  const [filtro, setFiltro] = useState<Filtro>("todos")
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({})
  const [nuevoProyecto, setNuevoProyecto] = useState(false)
  const [nuevoArtista, setNuevoArtista] = useState(false)
  const [detalle, setDetalle] = useState<Proyecto | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, arrancar] = useTransition()

  const correr = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null)
    arrancar(async () => {
      const r = await fn()
      if (!r.ok) setError(r.error ?? "No se pudo guardar el cambio")
    })
  }

  // El avance se calcula una vez por render del snapshot: lo consultan la
  // cabecera del artista, la fila del proyecto y los dos modos de vista.
  const avances = useMemo(() => {
    const m: Record<string, ReturnType<typeof avanceProyecto>> = {}
    snapshot.proyectos.forEach((p) => { m[p.id] = avanceProyecto(snapshot, p) })
    return m
  }, [snapshot])

  const pasaFiltro = (p: Proyecto) => {
    if (filtro === "abiertos") return !avances[p.id].completo
    if (filtro === "cerrados") return avances[p.id].completo
    return true
  }

  const visibles = snapshot.proyectos.filter(pasaFiltro)
  const cerrados = snapshot.proyectos.filter((p) => avances[p.id].completo).length
  const alternar = (id: string) => setAbiertos((a) => ({ ...a, [id]: !a[id] }))

  const filaProps = (p: Proyecto) => ({
    proyecto: p,
    snapshot,
    yo,
    avance: avances[p.id],
    abierto: !!abiertos[p.id],
    puedeEditar,
    onAlternar: () => alternar(p.id),
    onDetalle: () => setDetalle(p),
    onError: setError,
  })

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Artistas y proyectos</h1>
          <div className="sub">
            Cada proyecto avanza sobre sus hitos derivados. Despliega uno para marcarlos.
          </div>
        </div>
        <div className="spacer" />
        {puedeEditar ? (
          <>
            <button className="btn" onClick={() => setNuevoArtista(true)}>＋ Artista</button>
            <button className="btn" onClick={() => setNuevoProyecto(true)}>＋ Proyecto</button>
            <QuePaso proyectos={snapshot.proyectos} artistas={snapshot.artistas} />
          </>
        ) : null}
      </div>

      {error ? (
        <div className="alert critical" role="status">
          <span aria-hidden>⚠</span>
          <span>{error}</span>
          <button className="btn sm ghost" style={{ marginLeft: "auto" }} onClick={() => setError(null)}>✕</button>
        </div>
      ) : null}

      <div className="frow" style={{ marginBottom: 16 }}>
        <div className="seg" role="group" aria-label="Modo de vista">
          <button className={modo === "artista" ? "on" : ""} onClick={() => setModo("artista")}>Por artista</button>
          <button className={modo === "release" ? "on" : ""} onClick={() => setModo("release")}>Por lanzamiento</button>
        </div>

        <div className="seg" role="group" aria-label="Filtro de completado">
          <button className={filtro === "todos" ? "on" : ""} onClick={() => setFiltro("todos")}>Todos</button>
          <button className={filtro === "abiertos" ? "on" : ""} onClick={() => setFiltro("abiertos")}>Ocultar completado</button>
          <button className={filtro === "cerrados" ? "on" : ""} onClick={() => setFiltro("cerrados")}>Solo terminados</button>
        </div>

        <div className="spacer" />
        <span className="small muted mono">
          {snapshot.proyectos.length - cerrados} en curso · {cerrados} completados
        </span>
      </div>

      {visibles.length === 0 ? (
        <div className="card">
          <Vacio titulo={filtro === "cerrados" ? "Todavía no hay proyectos completados" : "Nada que mostrar con este filtro"}>
            Un proyecto se da por completado cuando todos sus hitos están marcados.
          </Vacio>
        </div>
      ) : null}

      {modo === "artista"
        ? TIERS.map(([tier, label]) => {
            const delTier = snapshot.artistas.filter((a) => a.tier === tier)
            const conProyectos = delTier
              .map((a) => ({ artista: a, proyectos: visibles.filter((p) => p.artista_id === a.id) }))
              .filter((x) => x.proyectos.length > 0)

            if (conProyectos.length === 0) return null

            return (
              <div key={tier} style={{ marginBottom: 24 }}>
                <div className="frow" style={{ marginBottom: 9 }}>
                  <h2 style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {label}
                  </h2>
                </div>

                {conProyectos.map(({ artista, proyectos }) => {
                  // El avance del artista suma los hitos de todos sus proyectos
                  // VISIBLES: si el filtro esconde los cerrados, el porcentaje
                  // tiene que hablar de lo que se está viendo.
                  const hechas = proyectos.reduce((n, p) => n + avances[p.id].hechas, 0)
                  const total = proyectos.reduce((n, p) => n + avances[p.id].total, 0)
                  const pct = total ? Math.round((hechas / total) * 100) : 0
                  const grabadas = proyectos.reduce((n, p) => n + p.grabados, 0)
                  const temas = proyectos.reduce((n, p) => n + p.tracks, 0)

                  return (
                    <div className="art-bloque" key={artista.id}>
                      <div className="art-cab">
                        <FichaArtista id={artista.id} nombre={artista.nombre} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 650 }}>
                            {artista.nombre}
                            {!artista.confirmado && puedeEditar ? (
                              <button
                                className="btn ghost sm"
                                title="Confirmar escritura oficial del nombre"
                                aria-label={`Confirmar la escritura del nombre de ${artista.nombre}`}
                                onClick={() => correr(() => guardarArtista(artista.id, { confirmado: true }))}
                              >✎</button>
                            ) : null}
                          </div>
                          <div className="small muted">
                            {proyectos.length} {proyectos.length === 1 ? "proyecto" : "proyectos"} · {grabadas} de {temas} temas grabados
                          </div>
                        </div>
                        <div className="spacer" />
                        <BarraAvance hechas={hechas} total={total} pct={pct} color={colorAvance(pct, pct === 100)} sm />
                      </div>

                      {proyectos.map((p) => <FilaProyecto key={p.id} {...filaProps(p)} />)}
                    </div>
                  )
                })}
              </div>
            )
          })
        : (() => {
            const orden = [...visibles].sort((a, b) => a.release.localeCompare(b.release))
            const grupos = [...new Set(orden.map((p) => trimestre(p.release)))]

            return grupos.map((q) => {
              const items = orden.filter((p) => trimestre(p.release) === q)
              return (
                <div key={q} style={{ marginBottom: 22 }}>
                  <div className="frow" style={{ marginBottom: 9 }}>
                    <h2 style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {q}
                    </h2>
                    <div className="spacer" />
                    <span className="small muted">
                      {items.length} {items.length === 1 ? "lanzamiento" : "lanzamientos"}
                    </span>
                  </div>
                  <div className="art-bloque">
                    {items.map((p) => (
                      <FilaProyecto key={p.id} {...filaProps(p)} conArtista conCuentaAtras />
                    ))}
                  </div>
                </div>
              )
            })
          })()}

      {detalle ? (
        <DetalleProyecto
          proyecto={snapshot.proyectos.find((p) => p.id === detalle.id) ?? detalle}
          snapshot={snapshot}
          puedeEditar={puedeEditar}
          onClose={() => setDetalle(null)}
        />
      ) : null}
      {nuevoProyecto ? <NuevoProyecto snapshot={snapshot} onClose={() => setNuevoProyecto(false)} /> : null}
      {nuevoArtista ? <NuevoArtista onClose={() => setNuevoArtista(false)} /> : null}
    </>
  )
}

/* ============================================================
   Una fila de proyecto, con su checklist desplegable
   ============================================================ */

function FilaProyecto({
  proyecto: p, snapshot, yo, avance, abierto, puedeEditar, conArtista, conCuentaAtras,
  onAlternar, onDetalle, onError,
}: {
  proyecto: Proyecto
  snapshot: Snapshot
  yo: Perfil
  avance: ReturnType<typeof avanceProyecto>
  abierto: boolean
  puedeEditar: boolean
  conArtista?: boolean
  conCuentaAtras?: boolean
  onAlternar: () => void
  onDetalle: () => void
  onError: (e: string | null) => void
}) {
  const [pendiente, arrancar] = useTransition()
  const a = artistaPorId(snapshot, p.artista_id)
  const { hechas, total, pct, completo, tareas } = avance
  const estado = ESTADOS[p.estado]
  const dias = diasEntre(hoy(), p.release)

  /** Quien opera cierra cualquier hito; quien no, solo lo que tiene asignado.
   *  Son dos acciones distintas a propósito: marcarEvento exige el permiso
   *  "operar", y cerrarMiPendiente se apoya en la policy "cierro lo mío", que
   *  solo alcanza las filas donde uno es el responsable. */
  const puedeMarcar = (e: Evento) => puedeEditar || e.responsable_id === yo.id

  const marcar = (e: Evento) => {
    onError(null)
    arrancar(async () => {
      const r = puedeEditar
        ? await marcarEvento(e.id, !e.hecho, e.etiqueta)
        : await cerrarMiPendiente(e.id, !e.hecho)
      if (r && typeof r === "object" && "ok" in r && !r.ok) {
        onError((r as { error?: string }).error ?? "No se pudo marcar la tarea")
      }
    })
  }

  return (
    <>
      <button
        className={completo ? "proy-fila cerrado" : "proy-fila"}
        onClick={onAlternar}
        aria-expanded={abierto}
      >
        <Flecha />
        {completo ? <CheckCircular /> : null}

        {conArtista ? <FichaArtista id={p.artista_id} nombre={a?.nombre ?? "?"} /> : null}

        <span style={{ minWidth: 178 }}>
          <span className="nom" style={{ display: "block" }}>
            {conArtista ? `${a?.nombre ?? "?"} · ` : ""}{p.titulo}
          </span>
          <span className="sub">{p.tipo} · {p.grabados}/{p.tracks} grabadas</span>
        </span>

        <Tag suave color={completo ? "var(--c-post)" : estado?.color}>
          {completo ? "Completado" : estado?.label ?? p.estado}
        </Tag>

        <span className="spacer" />

        {conCuentaAtras && !completo ? (
          <span className="small mono" style={{ color: dias <= 60 ? "var(--brand)" : "var(--muted)", whiteSpace: "nowrap" }}>
            {dias < 0 ? `${Math.abs(dias)} d atrás` : `en ${dias} d`}
          </span>
        ) : null}

        <BarraAvance hechas={hechas} total={total} pct={pct} color={colorAvance(pct, completo)} />

        <span style={{ width: 96, textAlign: "right" }}>
          <span className="small muted" style={{ display: "block", textTransform: "uppercase", letterSpacing: "0.04em", fontSize: 11 }}>
            Release
          </span>
          <span className="mono small">{fmt(p.release)}</span>
        </span>
      </button>

      {abierto ? (
        <div className={completo ? "proy-cuerpo cerrado" : "proy-cuerpo"}>
          <div className="tareas">
            {tareas.map((e) => {
              const tipo = TIPOS_EVENTO[e.tipo]
              const vencida = !e.hecho && e.fecha < hoy()
              return (
                <button
                  key={e.id}
                  className={`tarea${e.hecho ? " hecha" : ""}${vencida ? " vencida" : ""}`}
                  onClick={() => marcar(e)}
                  disabled={!puedeMarcar(e) || pendiente}
                  aria-pressed={e.hecho}
                  title={puedeMarcar(e) ? undefined : "Solo puedes cerrar los hitos asignados a ti"}
                >
                  <Caja hecha={e.hecho} />
                  <span className="punto" style={{ background: tipo?.color }} aria-hidden />
                  <span className="txt">{e.etiqueta}</span>
                  <span className="cuando">{fmt(e.fecha)}</span>
                </button>
              )
            })}
          </div>

          <div className="acciones" style={{ padding: "0 15px 14px", marginTop: 0 }}>
            {p.notas ? <span className="small muted" style={{ marginRight: "auto" }}>↳ {p.notas}</span> : null}
            <button className="btn sm" onClick={onDetalle}>
              {puedeEditar ? "Editar proyecto" : "Ver detalle"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

/* ============================================================
   Detalle: aquí vive la edición
   ============================================================
   Antes cada celda de la tabla era un input, y eso convertía la pantalla en
   una hoja de cálculo. Editar pasa a ser una acción deliberada; la lista
   queda para leer. */

function DetalleProyecto({
  proyecto, snapshot, puedeEditar, onClose,
}: {
  proyecto: Proyecto
  snapshot: Snapshot
  puedeEditar: boolean
  onClose: () => void
}) {
  const a = artistaPorId(snapshot, proyecto.artista_id)
  const avance = avanceProyecto(snapshot, proyecto)
  const [notas, setNotas] = useState(proyecto.notas)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const correr = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null)
    arrancar(async () => {
      const r = await fn()
      if (!r.ok) setError(r.error ?? "No se pudo guardar el cambio")
    })
  }

  const editar = <K extends keyof Proyecto>(campo: K, valor: Proyecto[K]) =>
    correr(() => guardarProyecto(proyecto.id, { [campo]: valor } as never))

  return (
    <Modal
      titulo={`${a?.nombre ?? "?"} — ${proyecto.titulo}`}
      ancho="min(680px, 94vw)"
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
      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}

      <div className="kpis" style={{ marginBottom: 14 }}>
        <div className="kpi">
          <div className="v mono">{avance.hechas}/{avance.total}</div>
          <div className="l">Hitos completados</div>
          <div className="h">{avance.pct}% del proyecto</div>
        </div>
        <div className="kpi"><div className="v mono">{proyecto.grabados}/{proyecto.tracks}</div><div className="l">Canciones grabadas</div></div>
        <div className="kpi"><div className="v mono" style={{ fontSize: 17 }}>{fmt(proyecto.release)}</div><div className="l">Release</div></div>
      </div>

      <h3>Datos del proyecto</h3>
      <div className="frow">
        <Campo label="Título" crece>
          <input defaultValue={proyecto.titulo} disabled={!puedeEditar} style={{ width: "100%" }}
            onBlur={(e) => { if (e.target.value !== proyecto.titulo) editar("titulo", e.target.value) }} />
        </Campo>
        <Campo label="Tipo">
          <select defaultValue={proyecto.tipo} disabled={!puedeEditar}
            onChange={(e) => editar("tipo", e.target.value)}>
            {TIPOS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Campo>
      </div>
      <div className="frow">
        <Campo label="Temas">
          <input type="number" min={1} max={20} defaultValue={proyecto.tracks} disabled={!puedeEditar}
            onBlur={(e) => { if (+e.target.value !== proyecto.tracks) editar("tracks", +e.target.value) }} />
        </Campo>
        <Campo label="Grabadas">
          <input type="number" min={0} max={proyecto.tracks} defaultValue={proyecto.grabados} disabled={!puedeEditar}
            onBlur={(e) => { if (+e.target.value !== proyecto.grabados) editar("grabados", +e.target.value) }} />
        </Campo>
        <Campo label="Estado">
          <select defaultValue={proyecto.estado} disabled={!puedeEditar}
            onChange={(e) => editar("estado", e.target.value as EstadoProyecto)}>
            {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Campo>
      </div>
      <div className="frow">
        <Campo label="Release">
          <input type="date" defaultValue={proyecto.release} disabled={!puedeEditar}
            onChange={(e) => { if (e.target.value && e.target.value !== proyecto.release) correr(() => moverRelease(proyecto.id, e.target.value)) }} />
        </Campo>
        <Campo label="Inicio pre">
          <input type="date" defaultValue={proyecto.pre_start} disabled={!puedeEditar}
            onChange={(e) => { if (e.target.value) editar("pre_start", e.target.value) }} />
        </Campo>
      </div>
      <p className="small muted">Al mover el release, todas sus fechas derivadas se recalculan solas.</p>

      <h3>Fechas derivadas</h3>
      <div className="tabla-wrap">
        <table>
          <tbody>
            {avance.tareas.map((e) => (
              <tr key={e.id}>
                <td className="mono" style={{ width: 130, whiteSpace: "nowrap" }}>{fmt(e.fecha)}</td>
                <td>{e.etiqueta}</td>
                <td style={{ width: 1 }}>
                  {e.hecho ? <Tag color="var(--c-post)">Hecho</Tag> : null}
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

/* ============================================================
   Altas (sin cambios de comportamiento)
   ============================================================ */

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
          {snapshot.artistas.map((a: Artista) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
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
