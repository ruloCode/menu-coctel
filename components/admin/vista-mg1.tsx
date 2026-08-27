"use client"

import { useMemo, useState, useTransition } from "react"
import { fmt } from "@/lib/mg/fechas"
import type { InscripcionMG1 } from "@/lib/mg/datos"
import { actualizarInscripcion } from "@/app/admin/acciones"
import { Kpi, Modal, Tag, Vacio } from "./ui"

const ESTADOS: Record<string, { label: string; color: string }> = {
  nuevo:            { label: "Nuevo",           color: "var(--c-sesion)" },
  preseleccionado:  { label: "Preseleccionado", color: "var(--warning)" },
  seleccionado:     { label: "Seleccionado",    color: "var(--good)" },
  descartado:       { label: "Descartado",      color: "var(--muted)" },
}

export default function VistaMg1({
  inscripciones, puedeEditar,
}: {
  inscripciones: InscripcionMG1[]
  puedeEditar: boolean
}) {
  const [filtro, setFiltro] = useState("todos")
  const [busca, setBusca] = useState("")
  const [detalle, setDetalle] = useState<InscripcionMG1 | null>(null)
  const [, arrancar] = useTransition()

  const lista = useMemo(() => {
    let l = inscripciones
    if (filtro !== "todos") l = l.filter((i) => i.estado === filtro)
    if (busca) {
      const q = busca.toLowerCase()
      l = l.filter((i) => `${i.nombre_artistico} ${i.nombre_completo} ${i.ciudad} ${i.email}`.toLowerCase().includes(q))
    }
    return l
  }, [inscripciones, filtro, busca])

  const conteo = (e: string) => inscripciones.filter((i) => i.estado === e).length

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Convocatoria MG1</h1>
          <div className="sub">Inscripciones que llegan del formulario público de /mg1/convocatoria.</div>
        </div>
        <div className="spacer" />
        <a className="btn" href="/mg1/convocatoria" target="_blank" rel="noopener noreferrer">Ver landing ↗</a>
      </div>

      <div className="kpis">
        <Kpi valor={inscripciones.length} label="Inscripciones totales" />
        <Kpi valor={conteo("nuevo")} label="Sin revisar" />
        <Kpi valor={conteo("preseleccionado")} label="Preseleccionados" />
        <Kpi valor={conteo("seleccionado")} label="Seleccionados" />
      </div>

      <div className="card" style={{ padding: "10px 14px" }}>
        <div className="frow" style={{ margin: 0 }}>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Filtrar por estado">
            <option value="todos">Todos los estados</option>
            {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input placeholder="Buscar nombre, ciudad o correo…" value={busca}
            onChange={(e) => setBusca(e.target.value)} style={{ flex: 1, minWidth: 180 }}
            aria-label="Buscar inscripción" />
          <span className="small muted">{lista.length} resultados</span>
        </div>
      </div>

      <div className="card">
        <h2>Inscripciones</h2>
        {lista.length === 0 ? (
          <Vacio titulo="Nada por aquí todavía">
            Las inscripciones aparecen en cuanto alguien envía el formulario de la convocatoria.
          </Vacio>
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr><th>Recibida</th><th>Nombre artístico</th><th>Ciudad</th><th>Música</th><th>Estado</th><th /></tr>
              </thead>
              <tbody>
                {lista.map((i) => (
                  <tr key={i.id}>
                    <td className="mono small" style={{ whiteSpace: "nowrap" }}>{fmt(i.created_at.slice(0, 10))}</td>
                    <td>
                      <b>{i.nombre_artistico}</b>
                      <br /><span className="muted small">{i.nombre_completo}</span>
                    </td>
                    <td className="small">{i.ciudad}</td>
                    <td className="small">
                      {i.link_musica ? (
                        <a href={i.link_musica} target="_blank" rel="noopener noreferrer">Escuchar ↗</a>
                      ) : "—"}
                    </td>
                    <td>
                      {puedeEditar ? (
                        <select
                          value={i.estado}
                          onChange={(e) => arrancar(async () => { await actualizarInscripcion(i.id, { estado: e.target.value }) })}
                          aria-label={`Estado de ${i.nombre_artistico}`}
                        >
                          {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      ) : (
                        <Tag color={ESTADOS[i.estado]?.color}>{ESTADOS[i.estado]?.label ?? i.estado}</Tag>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn sm" onClick={() => setDetalle(i)}>Ver ficha</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Sobre estos datos</h2>
        <p className="small muted" style={{ marginBottom: 0 }}>
          Son datos personales recogidos con autorización (Ley 1581 de 2012). La tabla es un buzón de solo
          escritura para el público: nadie que no tenga sesión en este panel puede listarlos. Trátalos como lo
          que son y no los saques de aquí sin necesidad.
        </p>
      </div>

      {detalle ? <Ficha inscripcion={detalle} puedeEditar={puedeEditar} onClose={() => setDetalle(null)} /> : null}
    </>
  )
}

function Ficha({
  inscripcion, puedeEditar, onClose,
}: {
  inscripcion: InscripcionMG1
  puedeEditar: boolean
  onClose: () => void
}) {
  const [notas, setNotas] = useState(inscripcion.notas ?? "")
  const [pendiente, arrancar] = useTransition()

  return (
    <Modal
      titulo={inscripcion.nombre_artistico}
      ancho="min(600px, 94vw)"
      onClose={onClose}
      pie={
        puedeEditar ? (
          <>
            <button className="btn" onClick={onClose}>Cerrar</button>
            <button className="btn primary" disabled={pendiente}
              onClick={() => arrancar(async () => { await actualizarInscripcion(inscripcion.id, { notas }); onClose() })}>
              {pendiente ? "Guardando…" : "Guardar notas"}
            </button>
          </>
        ) : <button className="btn primary" onClick={onClose}>Cerrar</button>
      }
    >
      <div className="tabla-wrap">
        <table>
          <tbody>
            <tr><th style={{ width: 150 }}>Nombre completo</th><td>{inscripcion.nombre_completo}</td></tr>
            <tr><th>Correo</th><td><a href={`mailto:${inscripcion.email}`}>{inscripcion.email}</a></td></tr>
            <tr><th>Celular</th><td className="mono">{inscripcion.celular}</td></tr>
            <tr><th>Ciudad</th><td>{inscripcion.ciudad}</td></tr>
            <tr>
              <th>Música</th>
              <td>
                {inscripcion.link_musica
                  ? <a href={inscripcion.link_musica} target="_blank" rel="noopener noreferrer">{inscripcion.link_musica}</a>
                  : "—"}
              </td>
            </tr>
            <tr><th>Edición</th><td className="mono small">{inscripcion.edicion}</td></tr>
            <tr><th>Recibida</th><td className="mono small">{fmt(inscripcion.created_at.slice(0, 10))}</td></tr>
          </tbody>
        </table>
      </div>

      {inscripcion.por_que ? (
        <>
          <h3>Por qué quiere entrar</h3>
          <p className="small" style={{ whiteSpace: "pre-wrap" }}>{inscripcion.por_que}</p>
        </>
      ) : null}

      <h3>Notas de curaduría</h3>
      <textarea rows={3} value={notas} disabled={!puedeEditar} style={{ width: "100%" }}
        placeholder="Lo que el jurado debe saber" onChange={(e) => setNotas(e.target.value)} />
    </Modal>
  )
}
