"use client"

import Link from "next/link"
import type { Perfil, Snapshot } from "@/lib/mg/tipos"
import { artistaPorId, avanceProyecto, colorAvance, misPendientes, proyectoPorId, todosLosEventos } from "@/lib/mg/motor"
import { TIPOS_EVENTO } from "@/lib/mg/constantes"
import { fmt, hoy, masDias, diasEntre } from "@/lib/mg/fechas"
import { BarraAvance } from "./avance"
import { Tag, Vacio } from "./ui"

/** Inicio del área de Producción audiovisual.
 *
 *  Su unidad de trabajo no es la canción sino la PIEZA: el content day donde
 *  se rueda y las publicaciones que salen de ahí. Por eso esta pantalla
 *  ordena por rodaje, no por release. */
export default function InicioAudiovisual({ snapshot, yo }: { snapshot: Snapshot; yo: Perfil }) {
  const s = snapshot
  const t = hoy()

  const nombre = (yo.nombre || yo.email).split(" ")[0]
  const mios = misPendientes(s, yo.id)
  const urgente = mios.atrasado.length + mios.hoy.length
  const ahora = [...mios.atrasado, ...mios.hoy, ...mios.semana]

  const h = new Date().getHours()
  const franja = h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches"

  // Los content days son los días de rodaje: el hito que estructura su mes.
  const rodajes = todosLosEventos(s)
    .filter((e) => e.tipo === "content" && !e.hecho && e.fecha >= t && e.fecha <= masDias(t, 90))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))

  const enRevision = s.publicaciones.filter((p) => p.estado === "revision" || p.estado === "error")

  const conPiezas = s.proyectos
    .filter((p) => !["lanzado", "pausado"].includes(p.estado))
    .sort((a, b) => a.release.localeCompare(b.release))
    .slice(0, 6)

  const atajos = [
    { href: "/admin/zeri", titulo: "Zeri", desc: "Pregúntale por guiones, rodajes o el calendario" },
    { href: "/admin/mi-trabajo", titulo: "Mi trabajo", desc: "Todo lo que tienes asignado, por fecha" },
    { href: "/admin/redes", titulo: "Redes", desc: "Calendario de contenido y piezas por publicar" },
    { href: "/admin/area", titulo: "Mi área", desc: "Tus compañeros y el canal de audiovisual" },
  ]

  return (
    <>
      <style>{`
        @keyframes mg-entra { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        .mg-bienvenida { animation: mg-entra .5s cubic-bezier(.16,1,.3,1) both }
        .mg-atajo { display: block; padding: 14px; border-radius: 10px; border: 1px solid var(--grid);
                    text-decoration: none; color: inherit; transition: border-color .15s, transform .15s }
        .mg-atajo:hover { border-color: var(--brand); transform: translateY(-2px) }
      `}</style>

      <div className="card mg-bienvenida">
        <h2 style={{ marginTop: 0, marginBottom: 4 }}>{franja}, {nombre} 👋</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          {urgente === 0 && ahora.length === 0
            ? "No tienes nada pendiente ahora mismo. Buen momento para adelantar guion."
            : urgente === 0
              ? `Vas al día. Tienes ${ahora.length} ${ahora.length === 1 ? "cosa" : "cosas"} en los próximos días.`
              : `Tienes ${urgente} ${urgente === 1 ? "cosa" : "cosas"} para hoy o antes.`}
        </p>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", marginTop: 16 }}>
          {atajos.map((a) => (
            <Link key={a.href} href={a.href} className="mg-atajo">
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{a.titulo}</div>
              <div className="small muted">{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Próximos rodajes <span className="muted small">· content days</span></h3>
        {rodajes.length === 0 ? (
          <Vacio titulo="No hay content days agendados">
            Cada lanzamiento genera el suyo automáticamente al fijar la fecha de release.
          </Vacio>
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Rodaje</th><th>Proyecto</th><th>Faltan</th></tr></thead>
              <tbody>
                {rodajes.map((e) => {
                  const p = proyectoPorId(s, e.proyecto_id)
                  const a = p ? artistaPorId(s, p.artista_id) : undefined
                  return (
                    <tr key={e.id} className={e.fecha === t ? "warnrow" : undefined}>
                      <td className="mono">{fmt(e.fecha)}</td>
                      <td><Tag color={TIPOS_EVENTO.content.color}>Content day</Tag> {e.etiqueta}</td>
                      <td className="small muted">{p ? `${a?.nombre ?? ""} · ${p.titulo}`.trim() : "—"}</td>
                      <td className="mono small">{diasEntre(t, e.fecha)} d</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Lo tuyo ahora <span className="muted small">· hasta 7 días</span></h3>
        {ahora.length === 0 ? (
          <Vacio titulo="Nada en tu lista para esta semana" />
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Qué</th><th>Proyecto</th></tr></thead>
              <tbody>
                {ahora.map((e) => {
                  const p = proyectoPorId(s, e.proyecto_id)
                  const a = p ? artistaPorId(s, p.artista_id) : undefined
                  const tipo = TIPOS_EVENTO[e.tipo]
                  const vencido = e.fecha < t
                  return (
                    <tr key={e.id} className={vencido || e.fecha === t ? "warnrow" : undefined}>
                      <td className="mono">{fmt(e.fecha)}{vencido ? " · atrasado" : ""}</td>
                      <td><Tag color={tipo?.color}>{tipo?.label ?? e.tipo}</Tag> {e.etiqueta}</td>
                      <td className="small muted">{p ? `${a?.nombre ?? ""} · ${p.titulo}`.trim() : "—"}</td>
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

      {enRevision.length > 0 ? (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Piezas esperando revisión</h3>
          <p className="small muted" style={{ marginTop: -4 }}>
            {enRevision.length} {enRevision.length === 1 ? "publicación" : "publicaciones"} sin aprobar.
          </p>
          <Link href="/admin/redes" className="btn sm">Ir a Redes</Link>
        </div>
      ) : null}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Lanzamientos que necesitan piezas</h3>
        <p className="small muted" style={{ marginTop: -4 }}>
          Ordenados por fecha de salida. La barra es el avance de hitos del proyecto completo.
        </p>
        {conPiezas.length === 0 ? <Vacio titulo="No hay proyectos activos" /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {conPiezas.map((p) => {
              const a = artistaPorId(s, p.artista_id)
              const av = avanceProyecto(s, p)
              return (
                <div key={p.id} className="frow" style={{ margin: 0, padding: "9px 0", borderBottom: "1px solid var(--grid)" }}>
                  <div style={{ minWidth: 200 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a?.nombre ?? "?"} · {p.titulo}</div>
                    <div className="small muted">{p.tipo} · sale {fmt(p.release)}</div>
                  </div>
                  <div className="spacer" />
                  <BarraAvance hechas={av.hechas} total={av.total} pct={av.pct} color={colorAvance(av.pct, av.completo)} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
