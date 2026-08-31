"use client"

import { useState, useTransition } from "react"
import { ROLES, etiquetaRol } from "@/lib/mg/permisos"
import { fmt } from "@/lib/mg/fechas"
import type { Artista, Perfil, RolApp } from "@/lib/mg/tipos"
import { cambiarEstadoCuenta, cambiarRol, vincularArtista } from "@/app/admin/acciones"
import { Tag, Vacio } from "./ui"

const COLOR_ROL: Record<RolApp, string> = {
  owner: "var(--c-hito)",
  admin: "var(--c-sesion)",
  manager: "var(--c-pre)",
  contenido: "var(--c-content)",
  produccion: "var(--c-release)",
  artista: "var(--c-fiesta)",
  viewer: "var(--muted)",
}

export default function VistaEquipo({
  perfiles, artistas, yo,
}: {
  perfiles: Perfil[]
  artistas: Artista[]
  yo: Perfil
}) {
  const [error, setError] = useState<string | null>(null)
  const [pendiente, arrancar] = useTransition()

  const correr = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null)
    arrancar(async () => {
      const r = await fn()
      if (!r.ok) setError(r.error ?? "No se pudo aplicar el cambio")
    })
  }

  const porAprobar = perfiles.filter((p) => !p.activo)
  const activos = perfiles.filter((p) => p.activo)

  // El owner es intocable para un admin; nadie se edita a sí mismo el rol.
  const puedeTocar = (p: Perfil) =>
    p.id !== yo.id && (yo.rol === "owner" || p.rol !== "owner")

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Equipo y accesos</h1>
          <div className="sub">Quién entra al panel y qué puede tocar. Los permisos los impone la base de datos, no la interfaz.</div>
        </div>
      </div>

      {error ? <div className="alert critical"><span aria-hidden>⚠</span><span>{error}</span></div> : null}

      {porAprobar.length ? (
        <div className="banner">
          <span aria-hidden>👋</span>
          <b>{porAprobar.length}</b>
          <span>
            {porAprobar.length === 1 ? "cuenta creada espera" : "cuentas creadas esperan"} que le asignes
            un rol y la actives.
          </span>
        </div>
      ) : null}

      <div className="card">
        <h2>Cómo se entra al panel</h2>
        <p className="small">
          Cada persona crea su propia cuenta en <b>/admin/login → Crear cuenta</b>. Queda inactiva hasta que
          alguien de aquí le asigne un rol y la active. Así el acceso nunca depende de compartir una
          contraseña, y una salida del equipo se corta con un solo switch.
        </p>
      </div>

      {porAprobar.length ? (
        <div className="card">
          <h2>Esperando aprobación <span className="muted small">({porAprobar.length})</span></h2>
          <TablaMiembros
            perfiles={porAprobar}
            artistas={artistas}
            puedeTocar={puedeTocar}
            pendiente={pendiente}
            correr={correr}
            yo={yo}
          />
        </div>
      ) : null}

      <div className="card">
        <h2>Miembros activos <span className="muted small">({activos.length})</span></h2>
        {activos.length === 0 ? (
          <Vacio titulo="Sin miembros activos" />
        ) : (
          <TablaMiembros
            perfiles={activos}
            artistas={artistas}
            puedeTocar={puedeTocar}
            pendiente={pendiente}
            correr={correr}
            yo={yo}
          />
        )}
      </div>

      <div className="card">
        <h2>Qué puede hacer cada rol</h2>
        <div className="tabla-wrap">
          <table>
            <thead><tr><th>Rol</th><th>Alcance</th></tr></thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r.valor}>
                  <td style={{ width: 130 }}><Tag color={COLOR_ROL[r.valor]}>{r.label}</Tag></td>
                  <td className="small">{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ marginTop: 10, marginBottom: 0 }}>
          Un rol <b>artista</b> solo sirve vinculado a una ficha del roster: sin vínculo, no puede aprobar nada.
        </p>
      </div>
    </>
  )
}

function TablaMiembros({
  perfiles, artistas, puedeTocar, pendiente, correr, yo,
}: {
  perfiles: Perfil[]
  artistas: Artista[]
  puedeTocar: (p: Perfil) => boolean
  pendiente: boolean
  correr: (fn: () => Promise<{ ok: boolean; error?: string }>) => void
  yo: Perfil
}) {
  return (
    <div className="tabla-wrap">
      <table>
        <thead>
          <tr><th>Persona</th><th>Rol</th><th>Artista vinculado</th><th>Último acceso</th><th style={{ textAlign: "right" }}>Acceso</th></tr>
        </thead>
        <tbody>
          {perfiles.map((p) => {
            const editable = puedeTocar(p)
            return (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="avatar" style={{ background: COLOR_ROL[p.rol] }} aria-hidden>
                      {(p.nombre || p.email).slice(0, 2).toUpperCase()}
                    </span>
                    <span>
                      <b>{p.nombre || "—"}</b>
                      {p.id === yo.id ? <span className="muted small"> · tú</span> : null}
                      <br />
                      <span className="muted small">{p.email}</span>
                    </span>
                  </div>
                </td>
                <td>
                  {editable ? (
                    <select
                      value={p.rol}
                      disabled={pendiente}
                      onChange={(e) => correr(() => cambiarRol(p.id, e.target.value))}
                      aria-label={`Rol de ${p.nombre || p.email}`}
                    >
                      {ROLES.filter((r) => r.valor !== "owner" || yo.rol === "owner").map((r) => (
                        <option key={r.valor} value={r.valor}>{r.label}</option>
                      ))}
                    </select>
                  ) : (
                    <Tag color={COLOR_ROL[p.rol]}>{etiquetaRol(p.rol)}</Tag>
                  )}
                </td>
                <td>
                  {p.rol === "artista" ? (
                    <select
                      value={p.artista_id ?? ""}
                      disabled={pendiente || !editable}
                      onChange={(e) => correr(() => vincularArtista(p.id, e.target.value || null))}
                      aria-label={`Artista vinculado a ${p.nombre || p.email}`}
                    >
                      <option value="">— sin vincular —</option>
                      {artistas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                    </select>
                  ) : (
                    <span className="muted small">—</span>
                  )}
                </td>
                <td className="muted small mono" style={{ whiteSpace: "nowrap" }}>
                  {p.ultimo_acceso ? fmt(p.ultimo_acceso.slice(0, 10)) : "nunca"}
                </td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  {editable ? (
                    <button
                      className={p.activo ? "btn sm danger" : "btn sm"}
                      disabled={pendiente}
                      onClick={() => correr(() => cambiarEstadoCuenta(p.id, !p.activo))}
                    >
                      {p.activo ? "Desactivar" : "Activar"}
                    </button>
                  ) : (
                    <Tag outline>{p.activo ? "Activa" : "Inactiva"}</Tag>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
