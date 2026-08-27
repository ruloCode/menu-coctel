"use client"

import { useState, useTransition } from "react"
import { TIPOS_EVENTO } from "@/lib/mg/constantes"
import type { Evento, Snapshot } from "@/lib/mg/tipos"
import { eliminarEvento, marcarEvento, moverEvento, restaurarEvento } from "@/app/admin/acciones"
import { Campo, Modal, Tag } from "./ui"

/** Detalle de un evento del calendario, compartido por calendario, timeline y estudio. */
export default function ModalEvento({
  evento, snapshot, puedeEditar, onClose,
}: {
  evento: Evento
  snapshot: Snapshot
  puedeEditar: boolean
  onClose: () => void
}) {
  const estado = snapshot.eventosEstado[evento.id]
  const [fecha, setFecha] = useState(evento.fecha)
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const correr = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    arrancar(async () => {
      const r = await fn()
      if (r.ok) onClose()
      else setError(r.error ?? "No se pudo aplicar")
    })
  }

  // Los eventos derivados tienen una fecha calculada a la que se puede volver;
  // los manuales (ex…) no tienen "original" a la que regresar.
  const derivado = evento.id.includes(":") && !evento.id.startsWith("ex")
  const proyecto = snapshot.proyectos.find((p) => p.id === evento.proyecto_id)

  return (
    <Modal
      titulo={evento.etiqueta}
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
              onClick={() => correr(() => marcarEvento(evento.id, !estado?.hecho, evento.etiqueta))}>
              {estado?.hecho ? "Reabrir" : "Marcar como hecho"}
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
      </Campo>
      <Campo label="Fecha">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} disabled={!puedeEditar} />
        {estado?.fecha_override ? <span className="small muted">Movido a mano</span> : null}
      </Campo>
      {proyecto ? (
        <Campo label="Proyecto">
          <span className="small">{proyecto.titulo} · release {proyecto.release}</span>
        </Campo>
      ) : null}
      {evento.tarde ? (
        <div className="alert critical">
          <span aria-hidden>🔴</span>
          <span>Esta sesión no cabe antes del deadline de grabación. Hay que abrir capacidad o mover el release.</span>
        </div>
      ) : null}
      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}
    </Modal>
  )
}
