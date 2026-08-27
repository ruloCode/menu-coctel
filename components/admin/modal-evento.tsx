"use client"

import { useState, useTransition } from "react"
import { TIPOS_EVENTO } from "@/lib/mg/constantes"
import { comentariosDe, proyectoPorId, artistaPorId } from "@/lib/mg/motor"
import type { Evento, Perfil, Prioridad, Snapshot } from "@/lib/mg/tipos"
import {
  asignarEvento, cambiarPrioridad, eliminarEvento, marcarEvento, moverEvento, restaurarEvento,
} from "@/app/admin/acciones"
import { Campo, Modal, Tag } from "./ui"
import { PRIORIDADES, Persona, SelectorPersona } from "./personas"
import HiloComentarios from "./hilo-comentarios"

/** Detalle de un evento del calendario. Es el sitio donde una fecha del motor
 *  se convierte en trabajo de alguien: responsable, prioridad y conversación. */
export default function ModalEvento({
  evento, snapshot, yo, puedeEditar, onClose,
}: {
  evento: Evento
  snapshot: Snapshot
  yo: Perfil
  puedeEditar: boolean
  onClose: () => void
}) {
  const estado = snapshot.eventosEstado[evento.id]
  const [fecha, setFecha] = useState(evento.fecha)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const correr = (fn: () => Promise<{ ok: boolean; error?: string }>, cerrar = true) => {
    setError(null)
    arrancar(async () => {
      const r = await fn()
      if (r.ok) { if (cerrar) onClose() }
      else setError(r.error ?? "No se pudo aplicar")
    })
  }

  // Los eventos derivados tienen una fecha calculada a la que se puede volver;
  // los manuales (ex…) no tienen "original" a la que regresar.
  const derivado = evento.id.includes(":") && !evento.id.startsWith("ex")
  const proyecto = proyectoPorId(snapshot, evento.proyecto_id)
  const responsable = snapshot.equipo.find((m) => m.id === evento.responsable_id)

  return (
    <Modal
      titulo={evento.etiqueta}
      ancho="min(620px, 94vw)"
      onClose={onClose}
      pie={
        puedeEditar ? (
          <>
            <button className="btn danger" disabled={pendiente}
              onClick={() => correr(() => eliminarEvento(evento.id, evento.etiqueta))}>
              Cancelar evento
            </button>
            {derivado && (estado?.fecha_override || estado?.eliminado) ? (
              <button className="btn" disabled={pendiente} onClick={() => correr(() => restaurarEvento(evento.id))}>
                Volver a la fecha derivada
              </button>
            ) : null}
            <button className="btn" disabled={pendiente}
              onClick={() => correr(() => marcarEvento(evento.id, !evento.hecho, evento.etiqueta))}>
              {evento.hecho ? "Reabrir" : "Marcar como hecho"}
            </button>
            <button className="btn primary" disabled={pendiente || fecha === evento.fecha}
              onClick={() => correr(() => moverEvento(evento.id, fecha, evento.etiqueta))}>
              Guardar fecha
            </button>
          </>
        ) : (
          <button className="btn primary" onClick={onClose}>Cerrar</button>
        )
      }
    >
      <Campo label="Tipo">
        <Tag color={TIPOS_EVENTO[evento.tipo].color}>{TIPOS_EVENTO[evento.tipo].label}</Tag>
        {evento.hecho ? <Tag color="var(--good)">Hecho</Tag> : null}
      </Campo>

      <Campo label="Fecha">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} disabled={!puedeEditar} />
        {estado?.fecha_override ? <span className="small muted">Movido a mano</span> : null}
      </Campo>

      <Campo label="Responsable">
        {puedeEditar ? (
          <SelectorPersona
            equipo={snapshot.equipo}
            valor={evento.responsable_id}
            disabled={pendiente}
            onChange={(id) => correr(() => asignarEvento(evento.id, id, evento.etiqueta), false)}
          />
        ) : (
          <Persona perfil={responsable} />
        )}
        {responsable ? <span className="small muted">Le aparece en Mi trabajo</span> : null}
      </Campo>

      <Campo label="Prioridad">
        {puedeEditar ? (
          <select
            value={evento.prioridad}
            disabled={pendiente}
            onChange={(e) => correr(() => cambiarPrioridad(evento.id, e.target.value as Prioridad), false)}
            aria-label="Prioridad"
          >
            {PRIORIDADES.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
          </select>
        ) : (
          <span className="small">{PRIORIDADES.find((p) => p.v === evento.prioridad)?.l}</span>
        )}
      </Campo>

      {proyecto ? (
        <Campo label="Proyecto">
          <span className="small">
            {artistaPorId(snapshot, proyecto.artista_id)?.nombre} · {proyecto.titulo}
          </span>
        </Campo>
      ) : null}

      {evento.tarde ? (
        <div className="alert critical">
          <span aria-hidden>🔴</span>
          <span>Esta sesión no cabe antes del deadline de grabación. Hay que abrir capacidad o mover el release.</span>
        </div>
      ) : null}

      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}

      <div style={{ marginTop: 18, borderTop: "1px solid var(--grid)", paddingTop: 6 }}>
        <HiloComentarios
          comentarios={comentariosDe(snapshot, "evento", evento.id)}
          equipo={snapshot.equipo}
          yo={yo}
          entidadTipo="evento"
          entidadId={evento.id}
          contexto={{ titulo: evento.etiqueta, enlace: "/admin/calendario" }}
        />
      </div>
    </Modal>
  )
}
