"use client"

import { useRef, useState, useTransition } from "react"
import { fmt, hoy } from "@/lib/mg/fechas"
import type { Snapshot } from "@/lib/mg/tipos"
import { restaurarRespaldo } from "@/app/admin/acciones"
import { Vacio } from "./ui"

function descargar(nombre: string, contenido: string, mime: string) {
  const blob = new Blob([contenido], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = nombre
  a.click()
  URL.revokeObjectURL(url)
}

/** CSV con comillas escapadas: los títulos y notas llevan comas y saltos de línea. */
function aCsv(filas: Record<string, unknown>[]): string {
  if (!filas.length) return ""
  const cols = Object.keys(filas[0])
  const celda = (v: unknown) => {
    const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [cols.join(","), ...filas.map((f) => cols.map((c) => celda(f[c])).join(","))].join("\n")
}

export default function VistaDatos({
  snapshot, puedeRestaurar,
}: {
  snapshot: Snapshot
  puedeRestaurar: boolean
}) {
  const archivo = useRef<HTMLInputElement>(null)
  const [aviso, setAviso] = useState<{ ok: boolean; msg: string } | null>(null)
  const [pendiente, arrancar] = useTransition()

  const exportarJson = () =>
    descargar(`mg-panel-respaldo-${hoy()}.json`, JSON.stringify(snapshot, null, 2), "application/json")

  const exportarCsv = (nombre: string, filas: Record<string, unknown>[]) =>
    descargar(`mg-${nombre}-${hoy()}.csv`, aCsv(filas), "text/csv;charset=utf-8")

  const importar = (f: File) => {
    const lector = new FileReader()
    lector.onload = () => {
      arrancar(async () => {
        const r = await restaurarRespaldo(String(lector.result))
        setAviso({ ok: r.ok, msg: r.ok ? "Respaldo restaurado." : r.error ?? "No se pudo restaurar" })
      })
    }
    lector.onerror = () => setAviso({ ok: false, msg: "No se pudo leer el archivo." })
    lector.readAsText(f)
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Datos y bitácora</h1>
          <div className="sub">Los cambios viven en Supabase. Aquí se sacan respaldos y se audita quién cambió qué.</div>
        </div>
      </div>

      <div className="card">
        <h2>Exportar</h2>
        <p className="small">
          El JSON es el respaldo completo del panel (incluye reglas, excepciones del calendario y métricas).
          Los CSV sirven para abrir en Excel o Google Sheets.
        </p>
        <div className="frow" style={{ marginTop: 10 }}>
          <button className="btn primary" onClick={exportarJson}>⬇ Respaldo completo (.json)</button>
          <button className="btn" onClick={() => exportarCsv("proyectos", snapshot.proyectos as unknown as Record<string, unknown>[])}>
            Proyectos (.csv)
          </button>
          <button className="btn" onClick={() => exportarCsv("publicaciones", snapshot.publicaciones as unknown as Record<string, unknown>[])}>
            Publicaciones (.csv)
          </button>
          <button className="btn" onClick={() => exportarCsv("radar", snapshot.radar as unknown as Record<string, unknown>[])}>
            Radar (.csv)
          </button>
        </div>
      </div>

      {puedeRestaurar ? (
        <div className="card">
          <h2>Restaurar respaldo</h2>
          <p className="small">
            Sube un JSON exportado desde aquí. La restauración <b>agrega y actualiza, nunca borra</b>:
            un respaldo viejo no puede eliminar trabajo posterior. Revisa la bitácora después de restaurar.
          </p>
          <div className="frow" style={{ marginTop: 10 }}>
            <button className="btn" disabled={pendiente} onClick={() => archivo.current?.click()}>
              {pendiente ? "Restaurando…" : "⬆ Elegir archivo .json"}
            </button>
            <input
              ref={archivo} type="file" accept="application/json,.json" style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                if (confirm("¿Restaurar este respaldo? Se sobrescriben los registros que compartan id.")) importar(f)
                e.target.value = ""
              }}
            />
          </div>
          {aviso ? (
            <div className={aviso.ok ? "alert good" : "alert critical"} style={{ marginTop: 10 }} role="status">
              <span aria-hidden>{aviso.ok ? "✓" : "⚠"}</span><span>{aviso.msg}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="card">
        <h2>Bitácora completa <span className="muted small">(últimos {snapshot.bitacora.length} movimientos)</span></h2>
        {snapshot.bitacora.length === 0 ? (
          <Vacio titulo="Sin cambios registrados todavía" />
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Quién</th><th>Qué pasó</th></tr></thead>
              <tbody>
                {snapshot.bitacora.map((l) => (
                  <tr key={l.id}>
                    <td className="mono muted" style={{ whiteSpace: "nowrap" }}>{fmt(l.fecha)}</td>
                    <td className="muted" style={{ whiteSpace: "nowrap" }}>{l.actor_nombre || "—"}</td>
                    <td>{l.mensaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
