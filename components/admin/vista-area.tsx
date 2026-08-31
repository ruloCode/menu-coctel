"use client"

import Link from "next/link"
import type { Perfil, Snapshot } from "@/lib/mg/tipos"
import { todosLosEventos, artistaPorId, proyectoPorId, misPendientes, comentariosDe } from "@/lib/mg/motor"
import { TIPOS_EVENTO } from "@/lib/mg/constantes"
import { fmt, hoy, masDias } from "@/lib/mg/fechas"
import { Avatar } from "./personas"
import { Tag, Vacio } from "./ui"
import HiloComentarios from "./hilo-comentarios"

/** El area de Produccion musical.
 *
 *  Aqui el rol ES el area: companeros = perfiles activos con rol 'produccion'.
 *  No hay tabla de equipos porque no hace falta jerarquia ni pertenencia
 *  multiple; el dia que la haga, esta funcion es el unico sitio que cambia. */
export default function VistaArea({ snapshot, yo }: { snapshot: Snapshot; yo: Perfil }) {
  const s = snapshot
  const t = hoy()
  const limite = masDias(t, 30)

  const companeros = s.equipo.filter((p) => p.rol === "produccion")
  const ids = new Set(companeros.map((p) => p.id))

  // Lo que viene en el area: eventos con responsable del area, en 30 dias.
  // Sin esto, "el calendario de mis companeros" seria el calendario entero.
  const agenda = todosLosEventos(s)
    .filter((e) => e.responsable_id && ids.has(e.responsable_id))
    .filter((e) => !e.hecho && e.fecha >= t && e.fecha <= limite)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))

  const canal = comentariosDe(s, "area", "produccion")

  const nombreCorto = (p: Perfil) => (p.nombre || p.email).split(" ")[0]

  return (
    <>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Producción musical</h2>
        <p className="small muted" style={{ marginTop: -4 }}>
          Composición, arreglos y grabación. {companeros.length}{" "}
          {companeros.length === 1 ? "persona" : "personas"} en el área.
        </p>

        <div className="kpis" style={{ marginTop: 14 }}>
          {companeros.map((p) => {
            const mios = misPendientes(s, p.id)
            const urgente = mios.atrasado.length + mios.hoy.length
            const esYo = p.id === yo.id

            return (
              <div key={p.id} className="kpi" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Avatar perfil={p} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>
                    {p.nombre || p.email}
                    {esYo && <span className="small muted"> · tú</span>}
                  </div>
                  <div className="small muted">
                    {urgente > 0
                      ? `${urgente} ${urgente === 1 ? "pendiente" : "pendientes"} para hoy o antes`
                      : "Al día"}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {companeros.length <= 1 && (
          <p className="small muted" style={{ marginTop: 12 }}>
            Por ahora estás solo en el área. Cuando entren más personas con el rol de
            Producción musical, aparecerán aquí con su carga y su agenda.
          </p>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          Agenda del área <span className="muted small">· próximos 30 días</span>
        </h3>

        {agenda.length === 0 ? (
          <Vacio titulo="Nada agendado en el área para las próximas semanas">
            Cuando alguien del área quede como responsable de una sesión o un hito, aparece acá.
          </Vacio>
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Qué</th>
                  <th>Proyecto</th>
                  <th>Quién</th>
                </tr>
              </thead>
              <tbody>
                {agenda.map((e) => {
                  const quien = companeros.find((p) => p.id === e.responsable_id)
                  const proyecto = proyectoPorId(s, e.proyecto_id)
                  const artista = proyecto ? artistaPorId(s, proyecto.artista_id) : undefined
                  const tipo = TIPOS_EVENTO[e.tipo]

                  return (
                    <tr key={e.id} className={e.fecha === t ? "warnrow" : undefined}>
                      <td className="mono">{fmt(e.fecha)}</td>
                      <td>
                        <Tag color={tipo?.color}>{tipo?.label ?? e.tipo}</Tag>{" "}
                        {e.etiqueta}
                      </td>
                      <td className="small muted">
                        {proyecto ? `${artista?.nombre ?? ""} · ${proyecto.titulo}`.trim() : "—"}
                      </td>
                      <td className="small">{quien ? nombreCorto(quien) : "—"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="small muted" style={{ marginTop: 10 }}>
          ¿Necesitas estudio en una fecha que no está acá?{" "}
          <Link href="/admin/estudio">Propónla desde Estudio</Link> y un manager la confirma.
        </p>
      </div>

      <div className="card">
        <HiloComentarios
          comentarios={canal}
          equipo={s.equipo}
          yo={yo}
          entidadTipo="area"
          entidadId="produccion"
          contexto={{ titulo: "el canal de Producción musical", enlace: "/admin/area" }}
          titulo="Canal del área"
        />
        <p className="small muted" style={{ marginTop: 8 }}>
          Escribe <b>@nombre</b> para que a esa persona le llegue el aviso a su bandeja.
        </p>
      </div>
    </>
  )
}
