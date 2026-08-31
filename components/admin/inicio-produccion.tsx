"use client"

import Link from "next/link"
import type { Perfil, Snapshot } from "@/lib/mg/tipos"
import { misPendientes, artistaPorId, proyectoPorId } from "@/lib/mg/motor"
import { TIPOS_EVENTO, ESTADOS } from "@/lib/mg/constantes"
import { fmt, hoy } from "@/lib/mg/fechas"
import { Tag, Vacio } from "./ui"

/** Inicio del area de Produccion musical.
 *
 *  El Resumen general es un tablero de gestion: KPIs de cartera, alertas de
 *  salud, carga del equipo. Para quien compone y arregla eso es ruido, y era
 *  justo lo que hacia el panel agobiante. Esta pantalla responde otra
 *  pregunta: "que me toca a mi hoy y donde esta". */
export default function InicioProduccion({ snapshot, yo }: { snapshot: Snapshot; yo: Perfil }) {
  const s = snapshot
  const t = hoy()

  const nombre = (yo.nombre || yo.email).split(" ")[0]
  const mios = misPendientes(s, yo.id)
  const urgente = mios.atrasado.length + mios.hoy.length
  const ahora = [...mios.atrasado, ...mios.hoy, ...mios.semana]

  // El saludo se calcula en el cliente a proposito: en el servidor la hora es
  // UTC y en Bogota saldria "buenas noches" a media tarde.
  const h = new Date().getHours()
  const franja = h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches"

  const enProduccion = s.proyectos
    .filter((p) => !["lanzado", "pausado"].includes(p.estado))
    .sort((a, b) => a.release.localeCompare(b.release))

  const atajos = [
    { href: "/admin/mi-trabajo", titulo: "Mi trabajo",  desc: "Todo lo que tienes asignado, por fecha" },
    { href: "/admin/calendario", titulo: "Mi calendario", desc: "Tus fechas y las del área en el mes" },
    { href: "/admin/estudio",    titulo: "Estudio",     desc: "Sesiones agendadas · propón una nueva" },
    { href: "/admin/area",       titulo: "Mi área",     desc: "Tus compañeros y el canal de Producción" },
  ]

  return (
    <>
      <style>{`
        @keyframes mg-entra { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        .mg-bienvenida { animation: mg-entra .5s cubic-bezier(.16,1,.3,1) both }
        .mg-bienvenida:nth-child(2) { animation-delay: .06s }
        .mg-atajo { display: block; padding: 14px; border-radius: 10px; border: 1px solid var(--grid);
                    text-decoration: none; color: inherit; transition: border-color .15s, transform .15s }
        .mg-atajo:hover { border-color: var(--brand); transform: translateY(-2px) }
      `}</style>

      <div className="card mg-bienvenida">
        <h2 style={{ marginTop: 0, marginBottom: 4 }}>
          {franja}, {nombre} 👋
        </h2>
        <p className="muted" style={{ marginTop: 0 }}>
          {urgente === 0 && ahora.length === 0
            ? "No tienes nada pendiente ahora mismo. Buen momento para adelantar arreglos."
            : urgente === 0
              ? `Vas al día. Tienes ${ahora.length} ${ahora.length === 1 ? "cosa" : "cosas"} en los próximos días.`
              : `Tienes ${urgente} ${urgente === 1 ? "cosa" : "cosas"} para hoy o antes.`}
        </p>

        <div
          className="mg-bienvenida"
          style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", marginTop: 16 }}
        >
          {atajos.map((a) => (
            <Link key={a.href} href={a.href} className="mg-atajo">
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{a.titulo}</div>
              <div className="small muted">{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          Lo tuyo ahora <span className="muted small">· hasta 7 días</span>
        </h3>

        {ahora.length === 0 ? (
          <Vacio titulo="Nada en tu lista para esta semana">
            Cuando alguien te asigne una sesión o un hito, aparece aquí y te llega un aviso a la bandeja.
          </Vacio>
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Qué</th>
                  <th>Proyecto</th>
                </tr>
              </thead>
              <tbody>
                {ahora.map((e) => {
                  const proyecto = proyectoPorId(s, e.proyecto_id)
                  const artista = proyecto ? artistaPorId(s, proyecto.artista_id) : undefined
                  const tipo = TIPOS_EVENTO[e.tipo]
                  const vencido = e.fecha < t

                  return (
                    <tr key={e.id} className={vencido || e.fecha === t ? "warnrow" : undefined}>
                      <td className="mono">
                        {fmt(e.fecha)}
                        {vencido && <span className="small"> · atrasado</span>}
                      </td>
                      <td>
                        <Tag color={tipo?.color}>{tipo?.label ?? e.tipo}</Tag> {e.etiqueta}
                      </td>
                      <td className="small muted">
                        {proyecto ? `${artista?.nombre ?? ""} · ${proyecto.titulo}`.trim() : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="small muted" style={{ marginTop: 10 }}>
          <Link href="/admin/mi-trabajo">Ver todo mi trabajo →</Link>
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Proyectos en producción</h3>
        <p className="small muted" style={{ marginTop: -4 }}>
          Para qué estás escribiendo. Ordenados por fecha de lanzamiento.
        </p>

        {enProduccion.length === 0 ? (
          <Vacio titulo="No hay proyectos activos" />
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr>
                  <th>Artista</th>
                  <th>Proyecto</th>
                  <th>Estado</th>
                  <th>Canciones</th>
                  <th>Release</th>
                </tr>
              </thead>
              <tbody>
                {enProduccion.map((p) => {
                  const artista = artistaPorId(s, p.artista_id)
                  const estado = ESTADOS[p.estado]
                  const faltan = Math.max(0, p.tracks - p.grabados)

                  return (
                    <tr key={p.id}>
                      <td>{artista?.nombre ?? "—"}</td>
                      <td>{p.titulo}</td>
                      <td>
                        <Tag color={estado?.color}>{estado?.label ?? p.estado}</Tag>
                      </td>
                      <td className="mono small">
                        {p.grabados}/{p.tracks}
                        {faltan > 0 && <span className="muted"> · faltan {faltan}</span>}
                      </td>
                      <td className="mono">{fmt(p.release)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
