import Link from "next/link"
import { cargarSnapshot, perfilActual } from "@/lib/mg/datos"
import { calcularAlertas, todosLosEventos, eventoHecho, artistaPorId, misPendientes, SALUD, saludVencida } from "@/lib/mg/motor"
import { fmt, hoy, masDias, diasEntre } from "@/lib/mg/fechas"
import { TIPOS_EVENTO, ESTADOS } from "@/lib/mg/constantes"
import { puede } from "@/lib/mg/permisos"
import { Kpi, Tag, Vacio } from "@/components/admin/ui"
import QuePaso from "@/components/admin/que-paso"

export const dynamic = "force-dynamic"

export default async function ResumenPage() {
  const [s, perfil] = await Promise.all([cargarSnapshot(), perfilActual()])
  const t = hoy()

  const eventos = todosLosEventos(s)
  const proximos = eventos.filter((e) => e.fecha >= t && !eventoHecho(s, e.id)).slice(0, 14)
  const activos = s.proyectos.filter((p) => !["pausado", "lanzado"].includes(p.estado))
  const cancionesFaltantes = activos.reduce((acc, p) => acc + Math.max(0, p.tracks - p.grabados), 0)
  const releases2026 = s.proyectos.filter((p) => p.release < "2027-01-01" && p.estado !== "pausado").length
  const siguienteRelease = s.proyectos
    .filter((p) => p.release >= t && p.estado !== "pausado")
    .sort((a, b) => (a.release < b.release ? -1 : 1))[0]
  const alertas = calcularAlertas(s)
  const enRevision = s.publicaciones.filter((p) => p.estado === "revision").length
  const mios = perfil ? misPendientes(s, perfil.id) : null
  const urgente = mios ? mios.atrasado.length + mios.hoy.length : 0
  const enRiesgo = activos.filter((p) => p.salud === "en_riesgo" || p.salud === "desviado")
  const sinReporte = activos.filter((p) => saludVencida(p))

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Resumen general</h1>
          <div className="sub">Todo el calendario se deriva de las fechas de release. Cambia una y el resto se recalcula.</div>
        </div>
        <div className="spacer" />
        {puede(perfil?.rol, "operar") ? (
          <QuePaso proyectos={s.proyectos} artistas={s.artistas} />
        ) : null}
      </div>

      {mios && urgente > 0 ? (
        <div className="banner" style={{ borderColor: mios.atrasado.length ? "var(--critical)" : "var(--baseline)" }}>
          <span aria-hidden>{mios.atrasado.length ? "🔴" : "📌"}</span>
          <b style={mios.atrasado.length ? { background: "var(--critical)" } : undefined}>{urgente}</b>
          <span>
            {mios.atrasado.length
              ? `${mios.atrasado.length} cosa(s) tuyas están atrasadas`
              : `Tienes ${urgente} cosa(s) para hoy`}
            {mios.atrasado.length && mios.hoy.length ? ` y ${mios.hoy.length} vence(n) hoy` : ""}.
          </span>
          <Link className="btn sm" href="/admin/mi-trabajo" style={{ marginLeft: "auto" }}>Ver mi trabajo</Link>
        </div>
      ) : null}

      <div className="kpis">
        <Kpi valor={activos.length} label="Proyectos activos" />
        <Kpi valor={cancionesFaltantes} label="Canciones por grabar" ayuda={`en ${activos.length} proyectos`} />
        <Kpi valor={releases2026} label="Releases hasta dic 2026" />
        <Kpi
          valor={siguienteRelease ? diasEntre(t, siguienteRelease.release) : "—"}
          label="Días al próximo release"
          ayuda={siguienteRelease
            ? `${artistaPorId(s, siguienteRelease.artista_id)?.nombre} · ${fmt(siguienteRelease.release)}`
            : "sin releases futuros"}
        />
        <Kpi valor={enRiesgo.length} label="Proyectos en riesgo" ayuda={sinReporte.length ? `${sinReporte.length} sin reporte fresco` : "reportes al día"} />
        <Kpi valor={enRevision} label="Piezas esperando aprobación" />
      </div>

      {enRiesgo.length ? (
        <div className="card">
          <h2>🚦 Salud de la cartera</h2>
          <div className="tabla-wrap">
            <table>
              <thead><tr><th>Proyecto</th><th>Salud</th><th>Qué pasó</th><th>Release</th></tr></thead>
              <tbody>
                {enRiesgo.map((p) => (
                  <tr key={p.id}>
                    <td>{artistaPorId(s, p.artista_id)?.nombre} · {p.titulo}</td>
                    <td><Tag color={SALUD[p.salud].color}>{SALUD[p.salud].label}</Tag></td>
                    <td className="small">{p.salud_nota || <span className="muted">sin nota</span>}</td>
                    <td className="mono small" style={{ whiteSpace: "nowrap" }}>{fmt(p.release)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link className="btn sm" href="/admin/cartera" style={{ marginTop: 10 }}>Ver la cartera completa</Link>
        </div>
      ) : null}

      {alertas.length ? (
        <div className="card">
          <h2>⚠ Alertas <span className="muted small">({alertas.length})</span></h2>
          {alertas.map((a, i) => (
            <div key={i} className={a.nivel === "critical" ? "alert critical" : "alert"}>
              <span aria-hidden>{a.nivel === "critical" ? "🔴" : "🟡"}</span>
              <span>{a.msg}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <h2>Alertas</h2>
          <div className="alert good"><span aria-hidden>✅</span><span>Nada exige atención inmediata.</span></div>
        </div>
      )}

      <div className="card">
        <h2>Próximos 14 eventos</h2>
        {proximos.length === 0 ? (
          <Vacio titulo="No hay nada agendado hacia adelante">
            Crea un proyecto en <Link href="/admin/artistas">Artistas y proyectos</Link> y el calendario se llena solo.
          </Vacio>
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr><th>Fecha</th><th>Faltan</th><th>Tipo</th><th>Evento</th></tr>
              </thead>
              <tbody>
                {proximos.map((e) => {
                  const dias = diasEntre(t, e.fecha)
                  return (
                    <tr key={e.id}>
                      <td className="mono" style={{ whiteSpace: "nowrap" }}>{fmt(e.fecha)}</td>
                      <td className={dias <= 7 ? "warnrow mono" : "mono muted"} style={{ whiteSpace: "nowrap" }}>
                        {dias === 0 ? "hoy" : `${dias} d`}
                      </td>
                      <td><Tag color={TIPOS_EVENTO[e.tipo].color}>{TIPOS_EVENTO[e.tipo].label}</Tag></td>
                      <td>{e.etiqueta}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Estado de los lanzamientos</h2>
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr><th>Artista</th><th>Proyecto</th><th>Estado</th><th>Grabado</th><th>Release</th></tr>
            </thead>
            <tbody>
              {s.proyectos
                .filter((p) => p.release >= masDias(t, -30))
                .slice(0, 12)
                .map((p) => (
                  <tr key={p.id}>
                    <td>{artistaPorId(s, p.artista_id)?.nombre}</td>
                    <td>{p.titulo}</td>
                    <td><Tag color={ESTADOS[p.estado].color}>{ESTADOS[p.estado].label}</Tag></td>
                    <td className="mono">{p.grabados}/{p.tracks}</td>
                    <td className="mono" style={{ whiteSpace: "nowrap" }}>{fmt(p.release)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Bitácora de cambios</h2>
        {s.bitacora.length === 0 ? (
          <p className="small muted">Todavía no hay movimientos registrados.</p>
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Quién</th><th>Qué pasó</th></tr></thead>
              <tbody>
                {s.bitacora.slice(0, 12).map((l) => (
                  <tr key={l.id}>
                    <td className="mono muted" style={{ whiteSpace: "nowrap" }}>{fmt(l.fecha)}</td>
                    <td className="muted" style={{ whiteSpace: "nowrap" }}>{l.actor_nombre || "—"}</td>
                    <td>{l.mensaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Link className="btn sm" href="/admin/datos" style={{ marginTop: 10 }}>Ver bitácora completa</Link>
      </div>
    </>
  )
}
