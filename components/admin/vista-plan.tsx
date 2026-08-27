"use client"

import { useState, useTransition } from "react"
import { ETIQUETAS_REGLA } from "@/lib/mg/constantes"
import type { Reglas, Snapshot } from "@/lib/mg/tipos"
import { guardarAjustes, guardarReglas } from "@/app/admin/acciones"

const PORQUE: Record<keyof Reglas, [string, string]> = {
  recordingDone: ["🎙 Grabación terminada", "Da aire para mezcla y para que el content day tenga la música lista."],
  contentDay:    ["🎬 Content day (rodaje único)", "Deja 2 semanas de edición y arranque de campaña. Un solo día evita perder ~40% de productividad en cambios de contexto."],
  masterFinal:   ["🎚 Master final", "Estándar de la industria: master listo al menos 5 semanas antes."],
  editingDone:   ["✂️ Edición de contenido lista", "El contenido tiene que existir cuando la campaña acelera."],
  distributor:   ["📦 Entrega al distribuidor", "Habilita pre-save y pitch. Recomendado: 4 semanas."],
  pitch:         ["🎯 Pitch editorial Spotify", "Mínimo oficial: 7 días. Recomendado: 3–4 semanas."],
  presave:       ["🔗 Pre-save activo", "2–4 semanas es la ventana con mejor conversión."],
}

const ORDEN: (keyof Reglas)[] = [
  "recordingDone", "contentDay", "masterFinal", "editingDone", "distributor", "pitch", "presave",
]

export default function VistaPlan({ snapshot, puedeEditar }: { snapshot: Snapshot; puedeEditar: boolean }) {
  const [reglas, setReglas] = useState<Reglas>(snapshot.config.reglas)
  const [ajustes, setAjustes] = useState(snapshot.config.ajustes)
  const [aviso, setAviso] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const sucio = JSON.stringify(reglas) !== JSON.stringify(snapshot.config.reglas)
  const sucioAjustes = JSON.stringify(ajustes) !== JSON.stringify(snapshot.config.ajustes)

  const guardar = () => {
    arrancar(async () => {
      const r = await guardarReglas(reglas as unknown as Record<string, number>)
      setAviso(r.ok ? "Reglas guardadas. Todo el calendario se recalculó." : r.error ?? "No se pudo guardar")
    })
  }

  const guardarCapacidad = () => {
    arrancar(async () => {
      const r = await guardarAjustes(ajustes as unknown as Record<string, unknown>)
      setAviso(r.ok ? "Capacidad actualizada. Las sesiones se reagendaron." : r.error ?? "No se pudo guardar")
    })
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Plan y reglas del sistema</h1>
          <div className="sub">Estas reglas son el motor: cambiar una recalcula el calendario de todos los proyectos.</div>
        </div>
      </div>

      {aviso ? <div className="alert good"><span aria-hidden>✓</span><span>{aviso}</span></div> : null}

      <div className="card">
        <h2>La lógica del calendario (programación hacia atrás)</h2>
        <p className="small">
          Cada proyecto se calcula <b>hacia atrás desde su fecha de release</b>. Está basado en ventanas
          estándar de la industria (Spotify exige pitch mínimo 7 días antes; los distribuidores recomiendan
          entrega 3–4 semanas antes) y en gestión de cadena crítica: los colchones se concentran, no se dispersan.
        </p>

        <div className="tabla-wrap">
          <table>
            <thead><tr><th>Hito</th><th>Días antes del release</th><th>Por qué</th></tr></thead>
            <tbody>
              {ORDEN.map((k) => (
                <tr key={k}>
                  <td>{PORQUE[k][0]}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <input
                      type="number" min={1} max={120} value={reglas[k]} disabled={!puedeEditar}
                      onChange={(e) => setReglas((r) => ({ ...r, [k]: +e.target.value }))}
                      aria-label={ETIQUETAS_REGLA[k]}
                    /> días
                  </td>
                  <td className="small muted">{PORQUE[k][1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {puedeEditar ? (
          <div className="acciones">
            <button className="btn" onClick={() => setReglas(snapshot.config.reglas)} disabled={!sucio}>Descartar</button>
            <button className="btn primary" onClick={guardar} disabled={!sucio || pendiente}>
              {pendiente ? "Recalculando…" : "Guardar y recalcular"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="card">
        <h2>Capacidad del estudio</h2>
        <p className="small">
          Con un tope real de {ajustes.maxCap} bloques por semana, el sistema planifica a{" "}
          <b>{ajustes.weeklyCap} bloques</b> y guarda {ajustes.maxCap - ajustes.weeklyCap} de colchón.
          Cuando algo se atrasa, <b>primero se consume el colchón</b>; solo si se agota se mueve el release.
        </p>

        <div className="frow">
          <label>Bloques planificados por semana</label>
          <input type="number" min={1} max={ajustes.maxCap} value={ajustes.weeklyCap} disabled={!puedeEditar}
            onChange={(e) => setAjustes((a) => ({ ...a, weeklyCap: +e.target.value }))} />
        </div>
        <div className="frow">
          <label>Tope real por semana</label>
          <input type="number" min={1} max={30} value={ajustes.maxCap} disabled={!puedeEditar}
            onChange={(e) => setAjustes((a) => ({ ...a, maxCap: +e.target.value }))} />
        </div>
        <div className="frow">
          <label>Bloques entre semana</label>
          <input type="number" min={0} max={4} value={ajustes.weekdayBlocks} disabled={!puedeEditar}
            onChange={(e) => setAjustes((a) => ({ ...a, weekdayBlocks: +e.target.value }))} />
          <label style={{ minWidth: "auto" }}>Bloques el sábado</label>
          <input type="number" min={0} max={4} value={ajustes.satBlocks} disabled={!puedeEditar}
            onChange={(e) => setAjustes((a) => ({ ...a, satBlocks: +e.target.value }))} />
        </div>
        <div className="frow">
          <label>Días de sesión</label>
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d, i) => (
            <label key={d} style={{ minWidth: "auto", display: "inline-flex", gap: 4, alignItems: "center" }}>
              <input
                type="checkbox" checked={ajustes.sessionDays.includes(i)} disabled={!puedeEditar}
                onChange={(e) => setAjustes((a) => ({
                  ...a,
                  sessionDays: e.target.checked
                    ? [...a.sessionDays, i].sort()
                    : a.sessionDays.filter((x) => x !== i),
                }))}
              />
              {d}
            </label>
          ))}
        </div>
        <div className="frow">
          <label>Horizonte de planeación</label>
          <input type="date" value={ajustes.horizonEnd} disabled={!puedeEditar}
            onChange={(e) => setAjustes((a) => ({ ...a, horizonEnd: e.target.value }))} />
        </div>

        {puedeEditar ? (
          <div className="acciones">
            <button className="btn" onClick={() => setAjustes(snapshot.config.ajustes)} disabled={!sucioAjustes}>Descartar</button>
            <button className="btn primary" onClick={guardarCapacidad} disabled={!sucioAjustes || pendiente}>
              Guardar capacidad
            </button>
          </div>
        ) : null}
      </div>

      <div className="card">
        <h2>Plantilla semanal sugerida</h2>
        <div className="tabla-wrap">
          <table>
            <thead><tr><th>Día</th><th>Bloques</th><th>Uso</th></tr></thead>
            <tbody>
              <tr><td>Martes</td><td>1 × 4 h</td><td>Sesión de grabación (1 canción)</td></tr>
              <tr><td>Jueves</td><td>1 × 4 h</td><td>Sesión de grabación (1 canción)</td></tr>
              <tr><td>Sábado</td><td>2 × 4 h</td><td>Doble sesión — canciones difíciles o 2 artistas</td></tr>
              <tr><td>Lun / Mié / Vie</td><td>—</td><td>Mezcla, edición de contenido, gestión, redes</td></tr>
              <tr><td>Colchón</td><td>hasta {ajustes.maxCap - ajustes.weeklyCap} bloques</td><td>Repeticiones, urgencias, artistas que fallan cita</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
