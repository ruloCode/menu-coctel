"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { fmt, hoy } from "@/lib/mg/fechas"
import type { EventoExtra, Perfil, Reunion } from "@/lib/mg/tipos"
import { crearReunion } from "@/app/admin/acciones"
import { puede } from "@/lib/mg/permisos"
import { Campo, Kpi, Modal, Vacio } from "./ui"

export default function VistaReuniones({
  reuniones, acuerdos, yo,
}: {
  reuniones: Reunion[]
  /** Todos los eventos nacidos en juntas, para contar por reunión. */
  acuerdos: EventoExtra[]
  yo: Perfil
}) {
  const [nueva, setNueva] = useState(false)
  const puedeOperar = puede(yo.rol, "operar")
  const t = hoy()

  const deLaReunion = (id: string) => acuerdos.filter((a) => a.reunion_id === id)
  const totalAcuerdos = acuerdos.length
  const abiertos = acuerdos.filter((a) => a.fecha >= t).length

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Reuniones</h1>
          <div className="sub">De lo que se habló a lo que alguien tiene que hacer. Los acuerdos caen solos en Mi trabajo y el calendario.</div>
        </div>
        <div className="spacer" />
        {puedeOperar ? <button className="btn primary" onClick={() => setNueva(true)}>＋ Registrar reunión</button> : null}
      </div>

      <div className="kpis">
        <Kpi valor={reuniones.length} label="Actas registradas" />
        <Kpi valor={totalAcuerdos} label="Acuerdos generados" />
        <Kpi valor={abiertos} label="Acuerdos por vencer" ayuda={`${totalAcuerdos - abiertos} ya pasaron de fecha`} />
        <Kpi
          valor={reuniones.reduce((n, r) => n + r.riesgos.filter((x) => x.nivel === "alto").length, 0)}
          label="Riesgos altos abiertos"
        />
      </div>

      <div className="card">
        <h2>Actas</h2>
        {reuniones.length === 0 ? (
          <Vacio titulo="Todavía no hay actas">
            Registra una reunión y anota sus decisiones. Lo que se acuerde se convierte en trabajo con dueño y fecha.
          </Vacio>
        ) : (
          reuniones.map((r) => {
            const acs = deLaReunion(r.id)
            const vencidos = acs.filter((a) => a.fecha < t).length
            const altos = r.riesgos.filter((x) => x.nivel === "alto").length
            return (
              <Link className="reunion-fila" href={`/admin/reuniones/${r.id}`} key={r.id}>
                <span>
                  <b>{r.titulo}</b>
                  <span className="meta">
                    <span>{fmt(r.fecha)}</span>
                    {r.duracion_min ? <span>{r.duracion_min} min</span> : null}
                    <span>{r.decisiones.length} decisiones</span>
                    <span>{acs.length} acuerdos{vencidos ? ` · ${vencidos} pasados de fecha` : ""}</span>
                    {altos ? <span className="warnrow">{altos} riesgo{altos > 1 ? "s" : ""} alto{altos > 1 ? "s" : ""}</span> : null}
                  </span>
                </span>
                <span className="btn sm">Abrir acta</span>
              </Link>
            )
          })
        )}
      </div>

      <div className="card">
        <h2>Por qué los acuerdos no son una lista aparte</h2>
        <p className="small">
          Lo que se acuerda en una junta entra al sistema como un <b>evento con dueño y fecha</b>, igual que un
          hito de lanzamiento o una sesión de estudio. Por eso un compromiso nacido aquí aparece automáticamente
          en <Link href="/admin/mi-trabajo">Mi trabajo</Link> de quien lo tenga, en el{" "}
          <Link href="/admin/calendario">Calendario</Link> y en la{" "}
          <Link href="/admin/carga">Carga del equipo</Link>. No hay dos listas que mantener sincronizadas —
          que es exactamente donde mueren las actas de reunión.
        </p>
      </div>

      {nueva ? <NuevaReunion onClose={() => setNueva(false)} /> : null}
    </>
  )
}

function NuevaReunion({ onClose }: { onClose: () => void }) {
  const [titulo, setTitulo] = useState("")
  const [fecha, setFecha] = useState(hoy())
  const [duracion, setDuracion] = useState<number | "">("")
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const crear = () => {
    if (!titulo.trim()) { setError("Ponle un título a la reunión."); return }
    arrancar(async () => {
      const r = await crearReunion({ titulo: titulo.trim(), fecha, duracion_min: duracion === "" ? null : +duracion })
      if (r.ok) onClose()
      else setError(r.error ?? "No se pudo crear")
    })
  }

  return (
    <Modal titulo="Registrar reunión" onClose={onClose} pie={
      <>
        <button className="btn" onClick={onClose}>Cancelar</button>
        <button className="btn primary" onClick={crear} disabled={pendiente}>
          {pendiente ? "Creando…" : "Crear acta"}
        </button>
      </>
    }>
      <Campo label="Título" crece>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} style={{ width: "100%" }}
          placeholder="Ej: Cronograma del reality y evento final" autoFocus />
      </Campo>
      <Campo label="Fecha">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </Campo>
      <Campo label="Duración">
        <input type="number" min={1} max={600} value={duracion} style={{ width: 90 }}
          placeholder="min" onChange={(e) => setDuracion(e.target.value === "" ? "" : +e.target.value)} />
        <span className="small muted">minutos</span>
      </Campo>
      <p className="small muted">
        El resumen, las decisiones y los acuerdos se agregan dentro del acta.
      </p>
      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
    </Modal>
  )
}
