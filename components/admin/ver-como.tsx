"use client"

import { useTransition } from "react"
import { ROLES, etiquetaRol, puede } from "@/lib/mg/permisos"
import type { Perfil } from "@/lib/mg/tipos"
import { verComo } from "@/app/admin/acciones"

/**
 * Previsualizar el panel de otro rol, para owner y admin.
 *
 * Coordinar un equipo con roles recortados tiene un problema práctico: quien
 * decide qué ve cada área nunca ve lo que ve el área. Esto lo resuelve sin
 * pedirle la contraseña a nadie.
 *
 * Es una LENTE, no una suplantación: cambia el rol con el que la interfaz
 * decide qué mostrar, pero la sesión y el id siguen siendo los propios, así
 * que RLS responde al rol real. Sirve para revisar navegación y diseño, no
 * para comprobar permisos de escritura ajenos.
 */
export default function VerComo({ perfil }: { perfil: Perfil }) {
  const [pendiente, arrancar] = useTransition()
  const real = perfil.verComoReal ?? perfil.rol
  const viendo = perfil.verComoReal ? perfil.rol : ""

  // La puerta real esta en perfilActual, que comprueba el rol de la BASE.
  // Esto solo evita pintar un control que no haria nada.
  if (!puede(real, "verComo")) return null

  return (
    <label className="ver-como" title="Previsualizar el panel de otro rol">
      <span className="small muted">Ver como</span>
      <select
        value={viendo}
        disabled={pendiente}
        onChange={(e) => arrancar(async () => { await verComo(e.target.value) })}
      >
        <option value="">{etiquetaRol(real)} · yo</option>
        {ROLES.filter((r) => r.valor !== real).map((r) => (
          <option key={r.valor} value={r.valor}>{r.label}</option>
        ))}
      </select>
    </label>
  )
}

/** Aviso permanente mientras se mira con otros ojos. Sin esto es fácil olvidar
 *  que lo que falta en pantalla falta por la lente, no porque no exista. */
export function AvisoVerComo({ perfil }: { perfil: Perfil }) {
  const [pendiente, arrancar] = useTransition()
  if (!perfil.verComoReal) return null

  return (
    <div className="banner ver-como-aviso">
      <span aria-hidden>👁</span>
      <span>
        Estás viendo el panel como <b>{etiquetaRol(perfil.rol)}</b>. Es una previsualización:
        tus permisos reales siguen siendo los de {etiquetaRol(perfil.verComoReal)}.
      </span>
      <button
        className="btn sm"
        style={{ marginLeft: "auto" }}
        disabled={pendiente}
        onClick={() => arrancar(async () => { await verComo("") })}
      >
        Volver a mi panel
      </button>
    </div>
  )
}
