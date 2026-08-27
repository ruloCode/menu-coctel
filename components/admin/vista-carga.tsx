"use client"

import { useState, useTransition } from "react"
import { cargaPorPersona } from "@/lib/mg/motor"
import { DIAS, MESES, D, fmt } from "@/lib/mg/fechas"
import type { Perfil, Snapshot } from "@/lib/mg/tipos"
import { guardarCapacidad } from "@/app/admin/acciones"
import { puede } from "@/lib/mg/permisos"
import { Kpi, Vacio } from "./ui"
import { Avatar } from "./personas"

export default function VistaCarga({ snapshot, yo }: { snapshot: Snapshot; yo: Perfil }) {
  const [semanas, setSemanas] = useState(8)
  const [pendiente, arrancar] = useTransition()
  const { lunes, filas } = cargaPorPersona(snapshot, semanas)

  const puedeAjustar = puede(yo.rol, "equipo")
  const sobrecargados = filas.filter((f) => f.semanasExcedidas > 0)
  const sinCarga = filas.filter((f) => f.total === 0)

  const nivel = (n: number, cap: number) =>
    n === 0 ? "vacio" : n > cap ? "excede" : n === cap ? "tope" : "ok"

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Carga del equipo</h1>
          <div className="sub">Quién está saturado y cuándo. Sirve para mover trabajo antes de que el release se caiga.</div>
        </div>
        <div className="spacer" />
        <div className="seg">
          {[4, 8, 12].map((n) => (
            <button key={n} className={semanas === n ? "on" : ""} onClick={() => setSemanas(n)}>
              {n} sem
            </button>
          ))}
        </div>
      </div>

      <div className="kpis">
        <Kpi valor={filas.length} label="Personas activas" />
        <Kpi valor={sobrecargados.length} label="Por encima de su tope" ayuda={sobrecargados.length ? "requieren atención" : "nadie saturado"} />
        <Kpi valor={sinCarga.length} label="Sin nada asignado" />
        <Kpi valor={filas.reduce((n, f) => n + f.total, 0)} label="Compromisos abiertos" ayuda={`en ${semanas} semanas`} />
      </div>

      {sobrecargados.length ? (
        <div className="banner" style={{ borderColor: "var(--critical)" }}>
          <span aria-hidden>🔴</span>
          <b style={{ background: "var(--critical)" }}>{sobrecargados.length}</b>
          <span>
            {sobrecargados.length === 1 ? "persona pasa" : "personas pasan"} de su capacidad en alguna semana:{" "}
            {sobrecargados.map((f) => f.perfil.nombre || f.perfil.email).join(", ")}.
          </span>
        </div>
      ) : null}

      <div className="card">
        <h2>Compromisos por semana</h2>
        <p className="small muted">
          Cada casilla cuenta los eventos abiertos asignados a esa persona esa semana.
          El fondo compara contra su capacidad declarada: verde por debajo, ámbar en el tope, rojo por encima.
        </p>

        {filas.length === 0 ? (
          <Vacio titulo="No hay personas activas todavía" />
        ) : (
          <div className="carga-grid">
            <table>
              <thead>
                <tr>
                  <th style={{ minWidth: 190 }}>Persona</th>
                  <th style={{ width: 74 }}>Tope</th>
                  {lunes.map((wk) => (
                    <th key={wk} style={{ textAlign: "center" }}>
                      {D(wk).getDate()} {MESES[D(wk).getMonth()].slice(0, 3)}
                    </th>
                  ))}
                  <th style={{ width: 60, textAlign: "center" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {filas.map(({ perfil, semanas: conteo, total, semanasExcedidas }) => (
                  <tr key={perfil.id}>
                    <td>
                      <span className="persona">
                        <Avatar perfil={perfil} />
                        <span>
                          {perfil.nombre || perfil.email}
                          {semanasExcedidas ? (
                            <span className="warnrow small"> · {semanasExcedidas} sem por encima</span>
                          ) : null}
                        </span>
                      </span>
                    </td>
                    <td>
                      {puedeAjustar ? (
                        <input
                          type="number" min={0} max={40} defaultValue={perfil.capacidad_semanal}
                          disabled={pendiente} style={{ width: 56 }}
                          aria-label={`Capacidad semanal de ${perfil.nombre || perfil.email}`}
                          onBlur={(e) => {
                            const v = +e.target.value
                            if (v !== perfil.capacidad_semanal) {
                              arrancar(async () => { await guardarCapacidad(perfil.id, v) })
                            }
                          }}
                        />
                      ) : (
                        <span className="mono small">{perfil.capacidad_semanal}</span>
                      )}
                    </td>
                    {lunes.map((wk) => {
                      const n = conteo[wk] ?? 0
                      return (
                        <td key={wk} style={{ padding: "5px 4px" }}>
                          <span
                            className={`celda-carga ${nivel(n, perfil.capacidad_semanal)}`}
                            title={`Semana del ${fmt(wk)}: ${n} de ${perfil.capacidad_semanal}`}
                          >
                            {n || "·"}
                          </span>
                        </td>
                      )
                    })}
                    <td className="mono" style={{ textAlign: "center", fontWeight: 600 }}>{total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Cómo leer esta pantalla</h2>
        <ul className="small" style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 6 }}>
          <li>El <b>tope</b> es una declaración, no una medición. Empieza con el que tenga sentido y ajústalo a las tres semanas con datos reales.</li>
          <li>Una fila en rojo no significa que la persona esté fallando: significa que <b>el plan no cabe</b>. Se resuelve moviendo trabajo o moviendo el release.</li>
          <li>Las filas en cero suelen ser el hallazgo más útil: hay capacidad libre que nadie está usando.</li>
          <li>Solo cuenta lo <b>asignado y abierto</b>. Lo que nadie tiene a cargo no aparece aquí — eso se ve en Mi trabajo, en “Sin responsable”.</li>
        </ul>
      </div>
    </>
  )
}
