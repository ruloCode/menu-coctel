"use client"

import { useMemo } from "react"
import type { Perfil, Prioridad } from "@/lib/mg/tipos"

/* Piezas compartidas por todo lo que tiene que ver con personas. */

const PALETA = [
  "var(--c-sesion)", "var(--c-content)", "var(--c-pre)", "var(--c-hito)",
  "var(--c-fiesta)", "var(--c-release)", "var(--c-seguimiento)",
]

/** Color estable por persona: derivado del id, no del orden de la lista, para
 *  que a nadie le cambie el color cuando entra alguien nuevo al equipo. */
export function colorDe(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return PALETA[h % PALETA.length]
}

export const iniciales = (p: { nombre: string; email: string }) =>
  (p.nombre || p.email).trim().slice(0, 2).toUpperCase()

export function Avatar({ perfil, sm }: { perfil?: Perfil | null; sm?: boolean }) {
  if (!perfil) {
    return <span className={sm ? "av sm vacio" : "av vacio"} aria-hidden>—</span>
  }
  return (
    <span
      className={sm ? "av sm" : "av"}
      style={{ background: colorDe(perfil.id) }}
      title={perfil.nombre || perfil.email}
      aria-hidden
    >
      {iniciales(perfil)}
    </span>
  )
}

export function Persona({ perfil, sm }: { perfil?: Perfil | null; sm?: boolean }) {
  return (
    <span className="persona">
      <Avatar perfil={perfil} sm={sm} />
      <span className={sm ? "small" : undefined} style={{ color: perfil ? undefined : "var(--muted)" }}>
        {perfil ? perfil.nombre || perfil.email : "Sin responsable"}
      </span>
    </span>
  )
}

/** Selector de responsable. Un solo dueño a propósito: dueños compartidos es
 *  lo mismo que nadie responsable. */
export function SelectorPersona({
  equipo, valor, onChange, disabled, ancho = 168, etiqueta = "Responsable",
}: {
  equipo: Perfil[]
  valor: string | null
  onChange: (id: string | null) => void
  disabled?: boolean
  ancho?: number
  etiqueta?: string
}) {
  const ordenado = useMemo(
    () => [...equipo].sort((a, b) => (a.nombre || a.email).localeCompare(b.nombre || b.email)),
    [equipo],
  )
  return (
    <select
      value={valor ?? ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value || null)}
      style={{ width: ancho, maxWidth: "100%" }}
      aria-label={etiqueta}
    >
      <option value="">— sin responsable —</option>
      {ordenado.map((m) => (
        <option key={m.id} value={m.id}>{m.nombre || m.email}</option>
      ))}
    </select>
  )
}

export const PRIORIDADES: { v: Prioridad; l: string }[] = [
  { v: "urgente", l: "Urgente" },
  { v: "alta", l: "Alta" },
  { v: "normal", l: "Normal" },
  { v: "baja", l: "Baja" },
]

export function ChipPrioridad({ prioridad }: { prioridad: Prioridad }) {
  if (prioridad === "normal") return null
  const l = PRIORIDADES.find((p) => p.v === prioridad)?.l ?? prioridad
  return <span className={`prio ${prioridad}`}>{prioridad === "urgente" ? "▲ " : ""}{l}</span>
}
