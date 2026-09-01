"use client"

import { useEffect, useMemo, useState } from "react"
import { fmt, hoy } from "@/lib/mg/fechas"
import { artistaPorId } from "@/lib/mg/motor"
import {
  FASES, cargaPorSemana, filasEstudio, resumenEstudio, type Fase,
} from "@/lib/mg/estudio"
import type { Evento, Perfil, Snapshot } from "@/lib/mg/tipos"
import { Kpi } from "./ui"
import ModalEvento from "./modal-evento"
import QuePaso from "./que-paso"
import EstudioCalendario from "./estudio-calendario"
import EstudioMezcla from "./estudio-mezcla"
import { EstudioLista, EstudioTablero, EstudioTimeline, SesionesCerradas } from "./estudio-vistas"

const VISTAS = [
  { clave: "calendario", label: "Calendario", ayuda: "Mover fechas" },
  { clave: "tablero",    label: "Tablero",    ayuda: "Por fase" },
  { clave: "mezcla",     label: "Mezcla y máster", ayuda: "Qué está en la mesa" },
  { clave: "timeline",   label: "Línea de tiempo", ayuda: "Solapes" },
  { clave: "lista",      label: "Lista",      ayuda: "Cerrar el día" },
] as const
type Vista = (typeof VISTAS)[number]["clave"]

const CLAVE_VISTA = "mg:estudio:vista"

export default function VistaEstudio({
  snapshot, yo, puedeEditar,
}: {
  snapshot: Snapshot
  yo: Perfil
  puedeEditar: boolean
}) {
  const t = hoy()
  const [vista, setVista] = useState<Vista>("calendario")
  const [evento, setEvento] = useState<Evento | null>(null)
  const [artista, setArtista] = useState("todos")
  const [fase, setFase] = useState<"todas" | Fase>("todas")
  const [soloTarde, setSoloTarde] = useState(false)

  // La vista elegida se recuerda: quien mezcla entra siempre a "Mezcla" y
  // quien agenda entra siempre a "Calendario". Es preferencia de cada
  // navegador, no dato del panel, así que localStorage y no la base.
  useEffect(() => {
    try {
      const g = localStorage.getItem(CLAVE_VISTA) as Vista | null
      if (g && VISTAS.some((v) => v.clave === g)) setVista(g)
    } catch { /* modo privado o almacenamiento bloqueado */ }
  }, [])
  const cambiarVista = (v: Vista) => {
    setVista(v)
    try { localStorage.setItem(CLAVE_VISTA, v) } catch { /* da igual */ }
  }

  const resumen = useMemo(() => resumenEstudio(snapshot, t), [snapshot, t])
  const todasFilas = useMemo(() => filasEstudio(snapshot, resumen.sesiones, t), [snapshot, resumen.sesiones, t])

  const filas = useMemo(() => todasFilas.filter((f) =>
    (artista === "todos" || f.proyecto.artista_id === artista) &&
    (fase === "todas" || f.fase === fase) &&
    (!soloTarde || f.sesiones.some((s) => s.tarde))
  ), [todasFilas, artista, fase, soloTarde])

  const idsVisibles = useMemo(() => new Set(filas.map((f) => f.proyecto.id)), [filas])
  const sesiones = useMemo(
    () => resumen.sesiones.filter((e) => e.proyecto_id && idsVisibles.has(e.proyecto_id) && (!soloTarde || e.tarde)),
    [resumen.sesiones, idsVisibles, soloTarde],
  )

  const semanas = useMemo(() => cargaPorSemana(snapshot, sesiones), [snapshot, sesiones])
  const S = snapshot.config.ajustes
  const R = snapshot.config.reglas
  const filtrando = artista !== "todos" || fase !== "todas" || soloTarde

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Estudio · Producción musical</h1>
          <div className="sub">
            De la sesión de grabación al máster entregado. La ventana de mezcla son{" "}
            {R.recordingDone - R.masterFinal} días: del tope de grabación (release − {R.recordingDone})
            a la entrega del máster (release − {R.masterFinal}).
          </div>
        </div>
        <div className="spacer" />
        {puedeEditar ? <QuePaso proyectos={snapshot.proyectos} artistas={snapshot.artistas} /> : null}
      </div>

      <div className="kpis">
        <Kpi valor={resumen.porGrabar} label="Sesiones por grabar" ayuda={`${resumen.estaSemana} en los próximos 7 días`} />
        <Kpi valor={resumen.tarde} label="Sesiones fuera de plazo" ayuda={resumen.tarde ? "No caben antes del deadline" : "Todo cabe"} />
        <Kpi valor={resumen.enMezcla} label="En mezcla y máster" ayuda={`${resumen.mezclaApretada} con la ventana apretada`} />
        <Kpi valor={resumen.mezclaVencida} label="Másters vencidos" ayuda={resumen.mezclaVencida ? "Fecha de entrega pasada" : "Ninguno atrasado"} />
      </div>

      {resumen.tarde > 0 ? (
        <div className="banner" style={{ borderColor: "var(--critical)" }}>
          <span aria-hidden>🔴</span>
          <b style={{ background: "var(--critical)" }}>{resumen.tarde}</b>
          <span>
            {resumen.tarde === 1 ? "sesión queda" : "sesiones quedan"} después de su deadline de grabación.
            No caben en la capacidad actual: hay que abrir bloques, mover el release o repartir a otra semana.
          </span>
        </div>
      ) : null}

      {resumen.mezclaVencida > 0 ? (
        <div className="banner" style={{ borderColor: "var(--critical)" }}>
          <span aria-hidden>🎚</span>
          <b style={{ background: "var(--critical)" }}>{resumen.mezclaVencida}</b>
          <span>
            {resumen.mezclaVencida === 1 ? "máster pasó" : "másters pasaron"} su fecha de entrega y sigue
            {resumen.mezclaVencida === 1 ? "" : "n"} sin cerrar. Está en “Mezcla y máster”.
          </span>
        </div>
      ) : null}

      {/* ---- filtros: sin ellos, con el roster entero esto es una lista larga ---- */}
      <div className="card" style={{ padding: "10px 14px" }}>
        <div className="frow" style={{ margin: 0 }}>
          <select value={artista} onChange={(e) => setArtista(e.target.value)} aria-label="Filtrar por artista">
            <option value="todos">Todos los artistas</option>
            {snapshot.artistas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
          <select value={fase} onChange={(e) => setFase(e.target.value as Fase | "todas")} aria-label="Filtrar por fase">
            <option value="todas">Todas las fases</option>
            {FASES.map((f) => <option key={f.clave} value={f.clave}>{f.label}</option>)}
          </select>
          <label className="small" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input type="checkbox" checked={soloTarde} onChange={(e) => setSoloTarde(e.target.checked)} />
            Solo lo que va tarde
          </label>
          <div className="spacer" />
          <span className="small muted">{filas.length} de {todasFilas.length} proyectos</span>
          {filtrando ? (
            <button className="btn sm" onClick={() => { setArtista("todos"); setFase("todas"); setSoloTarde(false) }}>
              Limpiar
            </button>
          ) : null}
        </div>
      </div>

      <div className="seg seg-vistas" role="tablist" aria-label="Vistas del estudio">
        {VISTAS.map((v) => (
          <button key={v.clave} role="tab" aria-selected={vista === v.clave}
            className={vista === v.clave ? "on" : ""} onClick={() => cambiarVista(v.clave)} title={v.ayuda}>
            {v.label}
          </button>
        ))}
      </div>

      {/* La capacidad acompaña a las vistas de agenda, no a las de mezcla. */}
      {(vista === "calendario" || vista === "lista") && semanas.length > 0 ? (
        <div className="card">
          <h2>
            Capacidad del estudio
            <span className="small muted" style={{ fontWeight: 400 }}>
              techo de {S.weeklyCap} bloques por semana de los {S.maxCap} posibles
            </span>
          </h2>
          <div className="cap-tira">
            {semanas.map(({ wk, bloques, tope }) => {
              const alto = Math.min(100, (bloques / tope) * 100)
              const color = bloques > tope ? "var(--critical)"
                : bloques >= tope ? "var(--c-release)"
                : bloques >= tope * 0.75 ? "var(--warning)" : "var(--c-sesion)"
              return (
                <div className="cap-col" key={wk}>
                  <div className="via" role="img" aria-label={`Semana del ${fmt(wk)}: ${bloques} de ${tope} bloques`}>
                    <i style={{ height: `${alto}%`, background: color }} />
                  </div>
                  <span className="et">{fmt(wk).slice(0, 6)}</span>
                </div>
              )
            })}
          </div>
          <p className="small muted" style={{ marginTop: 10, marginBottom: 0 }}>
            1 canción = 1 bloque de 4 h. Se cuenta sobre la fecha final de cada sesión, así que
            las que muevas a mano también pesan aquí. El agendador prioriza siempre el deadline más cercano.
          </p>
        </div>
      ) : null}

      {vista === "calendario" ? (
        <EstudioCalendario snapshot={snapshot} sesiones={sesiones} puedeEditar={puedeEditar} onAbrir={setEvento} />
      ) : null}
      {vista === "tablero" ? <EstudioTablero snapshot={snapshot} filas={filas} onAbrir={setEvento} /> : null}
      {vista === "mezcla" ? <EstudioMezcla snapshot={snapshot} puedeEditar={puedeEditar} /> : null}
      {vista === "timeline" ? <EstudioTimeline filas={filas} /> : null}
      {vista === "lista" ? (
        <>
          <EstudioLista snapshot={snapshot} sesiones={sesiones} puedeEditar={puedeEditar} onAbrir={setEvento} />
          <SesionesCerradas filas={filas} puedeEditar={puedeEditar} />
        </>
      ) : null}

      {evento ? (
        <ModalEvento evento={evento} snapshot={snapshot} yo={yo} puedeEditar={puedeEditar} onClose={() => setEvento(null)} />
      ) : null}
    </>
  )
}
