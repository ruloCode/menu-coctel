"use client"

import { useEffect, useState } from "react"
import { artistaPorId, avanceProyecto, colorAvance } from "@/lib/mg/motor"
import { fmt, hoy, diasEntre } from "@/lib/mg/fechas"
import type { Snapshot } from "@/lib/mg/tipos"

/**
 * Lo primero que se ve al abrir el panel.
 *
 * El Resumen empezaba con seis cifras (proyectos activos, canciones por
 * grabar, releases, días al próximo…) y esa pared de números pone a la
 * defensiva: son todas cosas que faltan. Esto responde antes otra pregunta,
 * la que de verdad tranquiliza: ¿cuánto llevamos hecho?
 *
 * La animación no es decorativa. Las barras crecen desde cero al entrar, que
 * es la lectura correcta —esto se construyó— en vez de aparecer ya cortadas,
 * que se lee como lo que falta.
 */
export default function Pulso({ snapshot }: { snapshot: Snapshot }) {
  const s = snapshot
  const t = hoy()
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMontado(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const activos = s.proyectos
    .filter((p) => !["pausado", "lanzado"].includes(p.estado))
    .sort((a, b) => a.release.localeCompare(b.release))

  const avances = activos.map((p) => ({ p, av: avanceProyecto(s, p) }))
  const hechas = avances.reduce((n, x) => n + x.av.hechas, 0)
  const total = avances.reduce((n, x) => n + x.av.total, 0)
  const pct = total ? Math.round((hechas / total) * 100) : 0

  const grabadas = activos.reduce((n, p) => n + p.grabados, 0)
  const temas = activos.reduce((n, p) => n + p.tracks, 0)
  const cerrados = s.proyectos.filter((p) => p.estado === "lanzado").length

  // Anillo: 2πr con r=52.
  const R = 52
  const circ = 2 * Math.PI * R
  const relleno = montado ? (pct / 100) * circ : 0

  const frase =
    pct >= 80 ? "Casi todo el trabajo del trimestre está cerrado."
    : pct >= 50 ? "Vamos por encima de la mitad del trabajo planificado."
    : pct >= 20 ? "El trimestre está en marcha."
    : "Arrancando el trimestre."

  return (
    <div className="card pulso">
      <div className="pulso-cab">
        <div className="pulso-anillo">
          <svg viewBox="0 0 120 120" width="120" height="120" role="img"
               aria-label={`${pct}% del trabajo completado: ${hechas} de ${total} hitos`}>
            <circle cx="60" cy="60" r={R} fill="none" stroke="var(--grid)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r={R} fill="none"
              stroke={colorAvance(pct, pct === 100)} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${relleno} ${circ}`}
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dasharray 1.1s cubic-bezier(.16,1,.3,1)" }}
            />
          </svg>
          <div className="pulso-num">
            <b>{pct}%</b>
            <span>hecho</span>
          </div>
        </div>

        <div className="pulso-txt">
          <h2 style={{ marginBottom: 2 }}>{frase}</h2>
          <p className="muted" style={{ margin: 0 }}>
            {hechas} de {total} hitos completados en {activos.length}{" "}
            {activos.length === 1 ? "proyecto activo" : "proyectos activos"}
            {cerrados > 0 ? ` · ${cerrados} ya ${cerrados === 1 ? "lanzado" : "lanzados"}` : ""}.
          </p>
          <p className="small muted" style={{ margin: "6px 0 0" }}>
            {grabadas} de {temas} canciones grabadas.
          </p>
        </div>
      </div>

      {avances.length > 0 ? (
        <div className="pulso-barras">
          {avances.slice(0, 10).map(({ p, av }, i) => {
            const a = artistaPorId(s, p.artista_id)
            const dias = diasEntre(t, p.release)
            return (
              <div className="pulso-fila" key={p.id}>
                <span className="quien">{a?.nombre ?? "?"}</span>
                <span className="que small muted">{p.titulo}</span>
                <div className="via">
                  <i
                    style={{
                      width: montado ? `${av.pct}%` : "0%",
                      background: colorAvance(av.pct, av.completo),
                      transitionDelay: `${i * 55}ms`,
                    }}
                  />
                </div>
                <span className="pctito mono">{av.pct}%</span>
                <span className="cuando small muted">
                  {dias < 0 ? fmt(p.release) : `en ${dias} d`}
                </span>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
