"use client"

import { useMemo, useState, useTransition } from "react"
import { D, DIAS, fmt, hoy, masDias } from "@/lib/mg/fechas"
import { artistaPorId } from "@/lib/mg/motor"
import { FASES, type FilaEstudio, type Fase } from "@/lib/mg/estudio"
import type { Evento, Snapshot } from "@/lib/mg/tipos"
import { marcarSesionGrabada, revertirSesionGrabada } from "@/app/admin/acciones"
import { Vacio } from "./ui"

/* ============================================================
   Tablero por fase
   ============================================================ */

/** Dónde está cada proyecto del pipeline. Responde "¿qué hay atascado?" de un
 *  vistazo, que es lo que una lista ordenada por fecha nunca deja ver. */
export function EstudioTablero({
  snapshot, filas, onAbrir,
}: {
  snapshot: Snapshot
  filas: FilaEstudio[]
  onAbrir: (e: Evento) => void
}) {
  const porFase = useMemo(() => {
    const m = {} as Record<Fase, FilaEstudio[]>
    FASES.forEach((f) => { m[f.clave] = [] })
    filas.forEach((f) => m[f.fase].push(f))
    return m
  }, [filas])

  return (
    <div className="tablero">
      {FASES.map((f) => (
        <div className="tab-col" key={f.clave}>
          <div className="tab-cab">
            <i style={{ background: f.color }} aria-hidden />
            <b>{f.label}</b>
            <span className="tab-n mono">{porFase[f.clave].length}</span>
          </div>
          <p className="small muted tab-ayuda">{f.ayuda}</p>

          {porFase[f.clave].length === 0 ? (
            <div className="tab-vacio small muted">Vacío</div>
          ) : porFase[f.clave].map((x) => {
            const prox = x.sesiones[0]
            return (
              <div className="tab-ficha" key={x.proyecto.id}>
                <b>{x.artista}</b>
                <span className="small muted" style={{ display: "block" }}>{x.proyecto.titulo}</span>

                <div className="tab-via" role="img"
                  aria-label={`${x.proyecto.grabados} de ${x.proyecto.tracks} temas grabados`}>
                  <i style={{ width: `${x.pct}%`, background: f.color }} />
                </div>
                <span className="small muted">{x.proyecto.grabados}/{x.proyecto.tracks} grabadas</span>

                <div className="tab-meta small">
                  {x.fase === "mezcla" || x.fase === "master" ? (
                    <span style={{ color: x.ventana.vencida ? "var(--critical)" : undefined }}>
                      Máster {fmt(x.ventana.entrega)}
                      {x.ventana.vencida ? " · vencido" : ` · ${x.ventana.restantes} d`}
                    </span>
                  ) : prox ? (
                    <button className="tab-enlace" onClick={() => onAbrir(prox)}>
                      Próxima sesión {fmt(prox.fecha)}
                    </button>
                  ) : (
                    <span className="muted">Release {fmt(x.proyecto.release)}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/* ============================================================
   Línea de tiempo
   ============================================================ */

/**
 * Un carril por proyecto con las tres etapas encadenadas: grabación, mezcla y
 * campaña. Es la única vista que deja ver el solape entre proyectos, que es de
 * donde salen los cuellos de botella del estudio.
 */
export function EstudioTimeline({ filas }: { filas: FilaEstudio[] }) {
  const t = hoy()

  const { desde, hasta, meses } = useMemo(() => {
    if (!filas.length) return { desde: t, hasta: masDias(t, 90), meses: [] as { x: number; txt: string }[] }
    const fechas = filas.flatMap((f) => [f.ventana.inicio, f.ventana.entrega, f.proyecto.release, ...f.sesiones.map((s) => s.fecha)])
    const desde = [t, ...fechas].sort()[0]
    const hasta = fechas.sort()[fechas.length - 1]
    const total = Math.max(1, dias(desde, hasta))

    const marcas: { x: number; txt: string }[] = []
    const d = D(desde)
    const cur = new Date(d.getFullYear(), d.getMonth() + 1, 1, 12)
    const fin = D(hasta)
    while (cur <= fin) {
      marcas.push({
        x: (dias(desde, `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-01`) / total) * 100,
        txt: `${cur.toLocaleDateString("es", { month: "short" })}`,
      })
      cur.setMonth(cur.getMonth() + 1)
    }
    return { desde, hasta, meses: marcas }
  }, [filas, t])

  if (!filas.length) return <div className="card"><Vacio titulo="Nada que dibujar todavía" /></div>

  const total = Math.max(1, dias(desde, hasta))
  const pos = (f: string) => Math.max(0, Math.min(100, (dias(desde, f) / total) * 100))

  return (
    <div className="card">
      <h2>
        Línea de tiempo
        <span className="small muted" style={{ fontWeight: 400 }}>
          grabación → mezcla y máster → campaña, hasta el release
        </span>
      </h2>

      <div className="tl2-wrap">
        <div className="tl2">
          <div className="tl2-escala" aria-hidden>
            {meses.map((m, i) => <span key={i} style={{ left: `${m.x}%` }}>{m.txt}</span>)}
            <b className="tl2-hoy" style={{ left: `${pos(t)}%` }} />
          </div>

          {filas.map((x) => {
            const ini = x.sesiones[0]?.fecha ?? x.ventana.inicio
            return (
              <div className="tl2-fila" key={x.proyecto.id}>
                <div className="tl2-et">
                  <b>{x.artista}</b>
                  <span className="small muted">{x.proyecto.titulo}</span>
                </div>
                <div className="tl2-carril">
                  <span className="tl2-barra grab"
                    style={{ left: `${pos(ini)}%`, width: `${Math.max(1.2, pos(x.ventana.inicio) - pos(ini))}%` }}
                    title={`Grabación · ${fmt(ini)} a ${fmt(x.ventana.inicio)}`} />
                  <span className="tl2-barra mez"
                    style={{ left: `${pos(x.ventana.inicio)}%`, width: `${Math.max(1.2, pos(x.ventana.entrega) - pos(x.ventana.inicio))}%` }}
                    title={`Mezcla y máster · ${fmt(x.ventana.inicio)} a ${fmt(x.ventana.entrega)}`} />
                  <span className="tl2-barra camp"
                    style={{ left: `${pos(x.ventana.entrega)}%`, width: `${Math.max(1.2, pos(x.proyecto.release) - pos(x.ventana.entrega))}%` }}
                    title={`Campaña · hasta ${fmt(x.proyecto.release)}`} />
                  <span className="tl2-rel" style={{ left: `${pos(x.proyecto.release)}%` }}
                    title={`Release ${fmt(x.proyecto.release)}`} />
                  {x.sesiones.map((s) => (
                    <span key={s.id} className={`tl2-pin${s.tarde ? " tarde" : ""}`}
                      style={{ left: `${pos(s.fecha)}%` }} title={`${s.etiqueta} · ${fmt(s.fecha)}`} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="legend" style={{ marginTop: 12, marginBottom: 0 }}>
        <span><i style={{ background: "var(--c-sesion)" }} />Grabación</span>
        <span><i style={{ background: "var(--c-pre)" }} />Mezcla y máster</span>
        <span><i style={{ background: "var(--c-release)" }} />Campaña</span>
        <span><i style={{ background: "var(--brand)" }} />Release</span>
      </div>
    </div>
  )
}

const dias = (a: string, b: string) => Math.round((D(b).getTime() - D(a).getTime()) / 86400000)

/* ============================================================
   Lista de sesiones
   ============================================================ */

type Orden = "fecha" | "artista" | "release"

/** La vista operativa: una fila por sesión, ordenable. Es la que sirve para
 *  ir cerrando el día, no para planear. */
export function EstudioLista({
  snapshot, sesiones, puedeEditar, onAbrir,
}: {
  snapshot: Snapshot
  sesiones: Evento[]
  puedeEditar: boolean
  onAbrir: (e: Evento) => void
}) {
  const t = hoy()
  const [orden, setOrden] = useState<Orden>("fecha")
  const [pendiente, arrancar] = useTransition()

  const filas = useMemo(() => {
    const con = sesiones.map((e) => {
      const p = snapshot.proyectos.find((x) => x.id === e.proyecto_id)
      return { e, p, artista: p ? artistaPorId(snapshot, p.artista_id)?.nombre ?? "?" : "?" }
    })
    const cmp: Record<Orden, (a: typeof con[0], b: typeof con[0]) => number> = {
      fecha: (a, b) => a.e.fecha.localeCompare(b.e.fecha),
      artista: (a, b) => a.artista.localeCompare(b.artista) || a.e.fecha.localeCompare(b.e.fecha),
      release: (a, b) => (a.p?.release ?? "").localeCompare(b.p?.release ?? "") || a.e.fecha.localeCompare(b.e.fecha),
    }
    return [...con].sort(cmp[orden])
  }, [sesiones, snapshot, orden])

  if (!filas.length) return <div className="card"><Vacio titulo="No hay sesiones agendadas" /></div>

  const Th = ({ o, children }: { o: Orden; children: React.ReactNode }) => (
    <th>
      <button className="th-orden" onClick={() => setOrden(o)} aria-sort={orden === o ? "ascending" : "none"}>
        {children}{orden === o ? " ↑" : ""}
      </button>
    </th>
  )

  return (
    <div className="card">
      <h2>Sesiones agendadas <span className="small muted" style={{ fontWeight: 400 }}>{filas.length} bloques</span></h2>
      <div className="tabla-wrap">
        <table>
          <thead>
            <tr>
              <Th o="fecha">Fecha</Th>
              <Th o="artista">Artista</Th>
              <th>Proyecto</th>
              <th>Sesión</th>
              <Th o="release">Release</Th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filas.map(({ e, p, artista }) => (
              <tr key={e.id} className={e.tarde ? "fila-tarde" : undefined}>
                <td className="small mono" style={{ whiteSpace: "nowrap" }}>
                  {DIAS[D(e.fecha).getDay()]} {fmt(e.fecha).slice(4)}
                </td>
                <td><b>{artista}</b></td>
                <td className="small">{p?.titulo ?? "—"}</td>
                <td className="small mono">{e.etiqueta.match(/Sesión (\d+\/\d+)/)?.[1] ?? "—"}</td>
                <td className="small" style={{ whiteSpace: "nowrap" }}>{p ? fmt(p.release) : "—"}</td>
                <td>
                  {e.tarde ? <span className="tag" style={{ background: "var(--critical)" }}>Tarde</span>
                    : e.fecha < t ? <span className="tag outline">Sin cerrar</span>
                    : <span className="small muted">Agendada</span>}
                </td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <button className="btn sm" onClick={() => onAbrir(e)}>Mover</button>
                  {puedeEditar ? (
                    <button className="btn sm primary" style={{ marginLeft: 6 }} disabled={pendiente}
                      onClick={() => arrancar(async () => { await marcarSesionGrabada(e.id, e.proyecto_id!) })}>
                      Grabada
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Sesiones ya cerradas de un proyecto, con opción de deshacer. */
export function SesionesCerradas({
  filas, puedeEditar,
}: {
  filas: FilaEstudio[]
  puedeEditar: boolean
}) {
  const [pendiente, arrancar] = useTransition()
  const conCerradas = filas.filter((f) => f.proyecto.grabados > 0)
  if (!conCerradas.length) return null

  return (
    <div className="card">
      <h2>Grabado hasta ahora <span className="small muted" style={{ fontWeight: 400 }}>por si hay que deshacer un clic</span></h2>
      <div className="tabla-wrap">
        <table>
          <thead><tr><th>Proyecto</th><th>Grabadas</th><th>Fase</th><th /></tr></thead>
          <tbody>
            {conCerradas.map((x) => (
              <tr key={x.proyecto.id}>
                <td><b>{x.artista}</b><br /><span className="small muted">{x.proyecto.titulo}</span></td>
                <td className="mono">{x.proyecto.grabados}/{x.proyecto.tracks}</td>
                <td>
                  <span className="tag" style={{ background: FASES.find((f) => f.clave === x.fase)!.color }}>
                    {FASES.find((f) => f.clave === x.fase)!.label}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  {puedeEditar ? (
                    <button className="btn sm" disabled={pendiente}
                      title="Devuelve una canción al contador y reabre la sesión"
                      onClick={() => arrancar(async () => {
                        await revertirSesionGrabada(`${x.proyecto.id}:ses${x.proyecto.grabados}`, x.proyecto.id)
                      })}>
                      Deshacer una
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
