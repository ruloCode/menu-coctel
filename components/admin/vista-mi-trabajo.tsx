"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { CUBETAS, misPendientes, proyectoPorId, sinResponsable, artistaPorId, type Cubeta } from "@/lib/mg/motor"
import { TIPOS_EVENTO } from "@/lib/mg/constantes"
import { diasEntre, fmt, hoy } from "@/lib/mg/fechas"
import type { Evento, Perfil, Snapshot } from "@/lib/mg/tipos"
import { asignarEvento, cerrarMiPendiente } from "@/app/admin/acciones"
import { puede } from "@/lib/mg/permisos"
import { Kpi, Tag, Vacio } from "./ui"
import { Avatar, ChipPrioridad, SelectorPersona } from "./personas"
import ModalEvento from "./modal-evento"

export default function VistaMiTrabajo({ snapshot, yo }: { snapshot: Snapshot; yo: Perfil }) {
  const [detalle, setDetalle] = useState<Evento | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const t = hoy()
  const grupos = misPendientes(snapshot, yo.id)
  const total = Object.values(grupos).reduce((n, g) => n + g.length, 0)
  const huerfanos = puede(yo.rol, "operar") ? sinResponsable(snapshot, 21) : []

  const cerrar = (e: Evento) => {
    setError(null)
    arrancar(async () => {
      const r = await cerrarMiPendiente(e.id, true)
      if (!r.ok) setError(r.error ?? "No se pudo cerrar")
    })
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Mi trabajo</h1>
          <div className="sub">Lo que te toca a ti, ordenado por cuándo vence. Lo cerrado desaparece.</div>
        </div>
      </div>

      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}

      <div className="kpis">
        <Kpi valor={grupos.atrasado.length} label="Atrasado" ayuda={grupos.atrasado.length ? "empieza por aquí" : "nada vencido"} />
        <Kpi valor={grupos.hoy.length} label="Vence hoy" />
        <Kpi valor={grupos.semana.length} label="Esta semana" />
        <Kpi valor={total} label="Abierto en total" ayuda="próximos 60 días" />
      </div>

      {total === 0 ? (
        <div className="card">
          <Vacio titulo="No tienes nada asignado">
            Cuando alguien te asigne un hito, una sesión o una pieza, aparece aquí.
            {puede(yo.rol, "operar") ? <> Mientras tanto, mira <Link href="/admin/calendario">el calendario</Link>.</> : null}
          </Vacio>
        </div>
      ) : null}

      {CUBETAS.map(({ clave, label, ayuda }) => {
        const lista = grupos[clave as Cubeta]
        if (!lista.length) return null
        return (
          <div className={`cubeta ${clave}`} key={clave}>
            <h2>
              {label}
              <span className="n">{lista.length}</span>
              <span className="ayuda">{ayuda}</span>
            </h2>
            {lista.map((e) => {
              const p = proyectoPorId(snapshot, e.proyecto_id)
              const dias = diasEntre(t, e.fecha)
              return (
                <div className={`pendiente${clave === "atrasado" ? " vencido" : ""}`} key={e.id}>
                  <button
                    className="tick"
                    title="Marcar como hecho"
                    aria-label={`Marcar como hecho: ${e.etiqueta}`}
                    disabled={pendiente}
                    onClick={() => cerrar(e)}
                  >✓</button>
                  <button
                    className="cuerpo"
                    onClick={() => setDetalle(e)}
                    style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer", color: "inherit" }}
                  >
                    <b>{e.etiqueta}</b>
                    <span className="meta">
                      <span>{fmt(e.fecha)}</span>
                      <span>{dias === 0 ? "hoy" : dias < 0 ? `${Math.abs(dias)} d de retraso` : `en ${dias} d`}</span>
                      {p ? <span>{artistaPorId(snapshot, p.artista_id)?.nombre} · {p.titulo}</span> : null}
                    </span>
                  </button>
                  <span className="der">
                    <ChipPrioridad prioridad={e.prioridad} />
                    <Tag color={TIPOS_EVENTO[e.tipo].color}>{TIPOS_EVENTO[e.tipo].label}</Tag>
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}

      {huerfanos.length ? (
        <div className="card" style={{ marginTop: 26 }}>
          <h2>Sin responsable <span className="muted small">({huerfanos.length} en 21 días)</span></h2>
          <p className="small muted">
            Esto es lo que un calendario no puede resolver solo. Repártelo aquí mismo.
          </p>
          <div className="tabla-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Qué</th><th>Tipo</th><th style={{ width: 190 }}>Asignar a</th></tr></thead>
              <tbody>
                {huerfanos.slice(0, 25).map((e) => (
                  <tr key={e.id}>
                    <td className="mono small" style={{ whiteSpace: "nowrap" }}>{fmt(e.fecha)}</td>
                    <td className="small">{e.etiqueta}</td>
                    <td><Tag color={TIPOS_EVENTO[e.tipo].color}>{TIPOS_EVENTO[e.tipo].label}</Tag></td>
                    <td>
                      <SelectorPersona
                        equipo={snapshot.equipo}
                        valor={null}
                        disabled={pendiente}
                        onChange={(id) => arrancar(async () => { await asignarEvento(e.id, id, e.etiqueta) })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {huerfanos.length > 25 ? (
            <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>
              Se muestran los 25 más próximos de {huerfanos.length}.
            </p>
          ) : null}
        </div>
      ) : null}

      {detalle ? (
        <ModalEvento
          evento={detalle}
          snapshot={snapshot}
          yo={yo}
          puedeEditar={puede(yo.rol, "operar")}
          onClose={() => setDetalle(null)}
        />
      ) : null}
    </>
  )
}
