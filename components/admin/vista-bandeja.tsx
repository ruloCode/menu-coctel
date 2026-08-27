"use client"

import { useTransition } from "react"
import Link from "next/link"
import type { Aviso } from "@/lib/mg/tipos"
import { marcarAvisoLeido, marcarTodoLeido } from "@/app/admin/acciones"
import { Vacio } from "./ui"

const ICONO: Record<string, string> = {
  asignacion: "👤", mencion: "💬", aprobacion: "👀", salud: "🚦", sistema: "⚙",
}

function haceCuanto(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return "ahora"
  if (min < 60) return `${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `${h} h`
  const d = Math.round(h / 24)
  return d < 30 ? `${d} d` : new Date(iso).toLocaleDateString("es-CO")
}

export default function VistaBandeja({ avisos }: { avisos: Aviso[] }) {
  const [pendiente, arrancar] = useTransition()
  const sinLeer = avisos.filter((a) => !a.leido_at)
  const leidos = avisos.filter((a) => a.leido_at)

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Bandeja</h1>
          <div className="sub">Lo que pasó mientras no estabas: asignaciones, menciones y proyectos que se salieron de cauce.</div>
        </div>
        <div className="spacer" />
        {sinLeer.length ? (
          <button className="btn" disabled={pendiente} onClick={() => arrancar(async () => { await marcarTodoLeido() })}>
            Marcar todo como leído
          </button>
        ) : null}
      </div>

      {avisos.length === 0 ? (
        <div className="card">
          <Vacio titulo="Bandeja vacía">
            Aquí llegan los avisos cuando alguien te asigna algo, te menciona en un
            comentario o un proyecto que lideras se marca en riesgo.
          </Vacio>
        </div>
      ) : null}

      {sinLeer.length ? (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, marginBottom: 9 }}>
            Sin leer <span className="muted small">({sinLeer.length})</span>
          </h2>
          {sinLeer.map((a) => <Fila key={a.id} aviso={a} pendiente={pendiente} arrancar={arrancar} />)}
        </div>
      ) : null}

      {leidos.length ? (
        <div>
          <h2 style={{ fontSize: 15, marginBottom: 9 }} className="muted">Ya visto</h2>
          {leidos.slice(0, 30).map((a) => <Fila key={a.id} aviso={a} pendiente={pendiente} arrancar={arrancar} />)}
        </div>
      ) : null}
    </>
  )
}

function Fila({
  aviso, pendiente, arrancar,
}: {
  aviso: Aviso
  pendiente: boolean
  arrancar: (fn: () => void) => void
}) {
  return (
    <Link
      href={aviso.enlace}
      className={aviso.leido_at ? "aviso" : "aviso nuevo"}
      onClick={() => {
        if (!aviso.leido_at && !pendiente) {
          arrancar(async () => { await marcarAvisoLeido(aviso.id) })
        }
      }}
    >
      <span className="ic" aria-hidden>{ICONO[aviso.tipo] ?? "•"}</span>
      <span style={{ minWidth: 0 }}>
        <b>{aviso.titulo}</b>
        {aviso.cuerpo ? <span className="cuerpo">{aviso.cuerpo}</span> : null}
        {aviso.de_nombre ? <span className="cuerpo muted">de {aviso.de_nombre}</span> : null}
      </span>
      <time dateTime={aviso.created_at}>{haceCuanto(aviso.created_at)}</time>
    </Link>
  )
}
