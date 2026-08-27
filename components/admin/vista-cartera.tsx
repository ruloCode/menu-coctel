"use client"

import { useMemo, useState, useTransition } from "react"
import { ESTADOS } from "@/lib/mg/constantes"
import { SALUD, artistaPorId, comentariosDe, eventosProyecto, saludVencida } from "@/lib/mg/motor"
import { diasEntre, fmt, hoy } from "@/lib/mg/fechas"
import type { Perfil, Proyecto, ReporteSalud, Salud, Snapshot } from "@/lib/mg/tipos"
import { asignarLider, reportarSalud } from "@/app/admin/acciones"
import { puede } from "@/lib/mg/permisos"
import { Campo, Kpi, Modal, Tag, Vacio } from "./ui"
import { Persona, SelectorPersona } from "./personas"
import HiloComentarios from "./hilo-comentarios"

const REPORTABLES: { v: Exclude<Salud, "sin_reportar">; l: string; ayuda: string }[] = [
  { v: "en_curso",  l: "En curso",  ayuda: "Llega a la fecha sin ayuda" },
  { v: "en_riesgo", l: "En riesgo", ayuda: "Llega si algo cambia; hace falta una decisión" },
  { v: "desviado",  l: "Desviado",  ayuda: "Ya no llega a la fecha comprometida" },
]

export default function VistaCartera({
  snapshot, historial, yo,
}: {
  snapshot: Snapshot
  historial: ReporteSalud[]
  yo: Perfil
}) {
  const [reportando, setReportando] = useState<Proyecto | null>(null)
  const [detalle, setDetalle] = useState<Proyecto | null>(null)
  const [pendiente, arrancar] = useTransition()
  const puedeOperar = puede(yo.rol, "operar")
  const t = hoy()

  const activos = useMemo(
    () => snapshot.proyectos
      .filter((p) => !["lanzado", "pausado"].includes(p.estado))
      .sort((a, b) => {
        const d = SALUD[a.salud].orden - SALUD[b.salud].orden
        return d !== 0 ? d : a.release < b.release ? -1 : 1
      }),
    [snapshot.proyectos],
  )

  const cuenta = (s: Salud) => activos.filter((p) => p.salud === s).length
  const vencidos = activos.filter((p) => saludVencida(p))

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Cartera y salud</h1>
          <div className="sub">Un semáforo por proyecto, puesto a mano cada semana. Es el reporte que sale del equipo hacia dirección.</div>
        </div>
      </div>

      <div className="kpis">
        <Kpi valor={activos.length} label="Proyectos activos" />
        <Kpi valor={cuenta("en_curso")} label="En curso" />
        <Kpi valor={cuenta("en_riesgo")} label="En riesgo" />
        <Kpi valor={cuenta("desviado")} label="Desviados" />
        <Kpi valor={vencidos.length} label="Sin reporte fresco" ayuda="más de 10 días" />
      </div>

      {vencidos.length ? (
        <div className="banner">
          <span aria-hidden>🕐</span>
          <b>{vencidos.length}</b>
          <span>
            {vencidos.length === 1 ? "proyecto lleva" : "proyectos llevan"} más de diez días sin reporte.
            Un semáforo viejo no es información.
          </span>
        </div>
      ) : null}

      <div className="card">
        <h2>Estado semanal</h2>
        <p className="small muted">
          Ojo: la <b>salud</b> no es lo mismo que el <b>estado</b>. El estado describe la producción musical
          (mezcla, selección de masters); la salud dice si el proyecto llega a la fecha. Un proyecto puede
          estar en mezcla y desviado al mismo tiempo.
        </p>

        {activos.length === 0 ? (
          <Vacio titulo="No hay proyectos activos" />
        ) : (
          activos.map((p) => {
            const artista = artistaPorId(snapshot, p.artista_id)
            const lider = snapshot.equipo.find((m) => m.id === p.lider_id)
            const s = SALUD[p.salud]
            const viejo = saludVencida(p)
            const dias = diasEntre(t, p.release)
            const hitos = eventosProyecto(snapshot, p)
            const cerrados = hitos.filter((h) => h.hecho).length

            return (
              <div className="tarjeta-salud" key={p.id} style={{ borderLeftColor: s.color }}>
                <div className="cab">
                  <span className="salud-punto" style={{ background: s.color }} aria-hidden />
                  <b>{artista?.nombre} — {p.titulo}</b>
                  <Tag color={s.color}>{s.label}</Tag>
                  <Tag outline>{ESTADOS[p.estado].label}</Tag>
                  <span className="spacer" />
                  <button className="btn sm" onClick={() => setDetalle(p)}>Abrir</button>
                  {puedeOperar ? (
                    <button className="btn sm primary" onClick={() => setReportando(p)}>Reportar</button>
                  ) : null}
                </div>

                {p.salud_nota ? <p className="nota">“{p.salud_nota}”</p> : null}

                <div className="pie">
                  <span>Release {fmt(p.release)} · {dias >= 0 ? `en ${dias} d` : `hace ${Math.abs(dias)} d`}</span>
                  <span>{cerrados}/{hitos.length} hitos cerrados</span>
                  <span>{p.grabados}/{p.tracks} grabadas</span>
                  <span className={viejo ? "warnrow" : undefined}>
                    {p.salud_at ? `Reportado ${fmt(p.salud_at.slice(0, 10))}` : "Nunca reportado"}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Responsable: <Persona perfil={lider} sm />
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {historial.length ? (
        <div className="card">
          <h2>Historial de reportes</h2>
          <p className="small muted">
            Sirve para responder “¿desde cuándo veníamos mal y quién lo dijo?”.
          </p>
          <div className="tabla-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Proyecto</th><th>Salud</th><th>Nota</th><th>Quién</th></tr></thead>
              <tbody>
                {historial.slice(0, 25).map((r) => {
                  const p = snapshot.proyectos.find((x) => x.id === r.proyecto_id)
                  const a = p ? artistaPorId(snapshot, p.artista_id) : null
                  return (
                    <tr key={r.id}>
                      <td className="mono small" style={{ whiteSpace: "nowrap" }}>{fmt(r.created_at.slice(0, 10))}</td>
                      <td className="small">{a?.nombre} · {p?.titulo ?? r.proyecto_id}</td>
                      <td><Tag color={SALUD[r.salud].color}>{SALUD[r.salud].label}</Tag></td>
                      <td className="small">{r.nota || <span className="muted">sin nota</span>}</td>
                      <td className="small muted" style={{ whiteSpace: "nowrap" }}>{r.autor_nombre || "—"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {reportando ? (
        <Reportar
          proyecto={reportando}
          snapshot={snapshot}
          onClose={() => setReportando(null)}
        />
      ) : null}

      {detalle ? (
        <Modal
          titulo={`${artistaPorId(snapshot, detalle.artista_id)?.nombre} — ${detalle.titulo}`}
          ancho="min(620px, 94vw)"
          onClose={() => setDetalle(null)}
          pie={<button className="btn primary" onClick={() => setDetalle(null)}>Cerrar</button>}
        >
          <Campo label="Responsable">
            {puedeOperar ? (
              <SelectorPersona
                equipo={snapshot.equipo}
                valor={detalle.lider_id}
                disabled={pendiente}
                onChange={(id) => arrancar(async () => { await asignarLider(detalle.id, id) })}
              />
            ) : (
              <Persona perfil={snapshot.equipo.find((m) => m.id === detalle.lider_id)} />
            )}
          </Campo>
          <Campo label="Salud">
            <Tag color={SALUD[detalle.salud].color}>{SALUD[detalle.salud].label}</Tag>
            {detalle.salud_nota ? <span className="small muted">“{detalle.salud_nota}”</span> : null}
          </Campo>

          <div style={{ marginTop: 16, borderTop: "1px solid var(--grid)", paddingTop: 6 }}>
            <HiloComentarios
              comentarios={comentariosDe(snapshot, "proyecto", detalle.id)}
              equipo={snapshot.equipo}
              yo={yo}
              entidadTipo="proyecto"
              entidadId={detalle.id}
              contexto={{ titulo: detalle.titulo, enlace: "/admin/cartera" }}
            />
          </div>
        </Modal>
      ) : null}
    </>
  )
}

function Reportar({
  proyecto, snapshot, onClose,
}: {
  proyecto: Proyecto
  snapshot: Snapshot
  onClose: () => void
}) {
  const [salud, setSalud] = useState<Exclude<Salud, "sin_reportar">>(
    proyecto.salud === "sin_reportar" ? "en_curso" : proyecto.salud,
  )
  const [nota, setNota] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()
  const artista = artistaPorId(snapshot, proyecto.artista_id)

  const guardar = () => {
    // Si algo no va bien, la nota es obligatoria: un semáforo en rojo sin
    // explicación no le sirve a nadie en la reunión del lunes.
    if (salud !== "en_curso" && !nota.trim()) {
      setError("Explica en una línea qué pasó. Un rojo sin contexto no se puede accionar.")
      return
    }
    arrancar(async () => {
      const r = await reportarSalud(proyecto.id, salud, nota.trim())
      if (r.ok) onClose()
      else setError(r.error ?? "No se pudo guardar")
    })
  }

  return (
    <Modal
      titulo={`Reportar · ${artista?.nombre} — ${proyecto.titulo}`}
      onClose={onClose}
      pie={
        <>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={guardar} disabled={pendiente}>
            {pendiente ? "Guardando…" : "Guardar reporte"}
          </button>
        </>
      }
    >
      <p className="small muted">
        Release el {fmt(proyecto.release)}. Responde una sola pregunta: ¿llega a esa fecha?
      </p>

      <div style={{ display: "grid", gap: 7, margin: "14px 0" }}>
        {REPORTABLES.map((o) => (
          <label
            key={o.v}
            style={{
              display: "flex", gap: 10, alignItems: "flex-start",
              padding: "10px 12px", borderRadius: 8, cursor: "pointer",
              border: `1px solid ${salud === o.v ? SALUD[o.v].color : "var(--grid)"}`,
              background: salud === o.v ? "var(--page)" : "var(--surface)",
            }}
          >
            <input
              type="radio" name="salud" value={o.v} checked={salud === o.v}
              onChange={() => setSalud(o.v)} style={{ marginTop: 3 }}
            />
            <span>
              <b style={{ fontSize: 13.5 }}>{o.l}</b>
              <span className="small muted" style={{ display: "block" }}>{o.ayuda}</span>
            </span>
          </label>
        ))}
      </div>

      <Campo label="Qué pasó" crece>
        <textarea
          rows={3} value={nota} style={{ width: "100%" }}
          placeholder={salud === "en_curso" ? "Opcional" : "Obligatorio: qué se atravesó y qué decisión hace falta"}
          onChange={(e) => setNota(e.target.value)}
        />
      </Campo>

      {salud !== "en_curso" ? (
        <p className="small muted">Al guardar, owners y admins reciben un aviso en su bandeja.</p>
      ) : null}

      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
    </Modal>
  )
}
