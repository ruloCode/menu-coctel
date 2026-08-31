import { D, DIAS, MESES, masDias } from "@/lib/mg/fechas"

/* Disponibilidad de los inscritos a MG1 para las fechas del concurso.
 *
 * El equipo pregunta por WhatsApp y anota en /admin/mg1. Este archivo es el
 * catalogo: si una fecha no esta aqui, no existe — ni se pinta ni se guarda.
 * Mover una fecha del reality es editar este archivo, no migrar la base. */

/** `dia` es el si/no de los bloques sin franja (una gala no se parte en tres). */
export type Franja = "manana" | "tarde" | "noche" | "dia"

export const FRANJAS: { valor: Franja; label: string; corto: string; horas: string }[] = [
  { valor: "manana", label: "Mañana", corto: "M", horas: "9:00 a 13:00" },
  { valor: "tarde", label: "Tarde", corto: "T", horas: "13:00 a 18:00" },
  { valor: "noche", label: "Noche", corto: "N", horas: "18:00 a 23:00" },
]

export const FRANJA_DIA: Franja = "dia"

const TODAS_FRANJAS: Franja[] = [...FRANJAS.map((f) => f.valor), FRANJA_DIA]
const ORDEN = new Map(TODAS_FRANJAS.map((f, i) => [f, i]))

/** Fechas entre dos extremos, ambos incluidos. El tope corta un rango al reves
 *  o mal escrito, que si no dejaria el bucle corriendo para siempre. */
function rango(desde: string, hasta: string): string[] {
  const fechas: string[] = []
  for (let f = desde; f <= hasta && fechas.length < 90; f = masDias(f, 1)) fechas.push(f)
  return fechas
}

export interface BloqueMG1 {
  clave: "openmic" | "grabacion" | "final"
  titulo: string
  corto: string
  /** 2-4 caracteres para la insignia de la tabla. */
  abrev: string
  descripcion: string
  color: string
  /** true = se pregunta por franja horaria; false = solo puede / no puede. */
  franjas: boolean
  fechas: string[]
}

export const BLOQUES_MG1: BloqueMG1[] = [
  {
    clave: "openmic",
    abrev: "OM",
    titulo: "Gala Open Mic",
    corto: "Open Mic",
    descripcion: "Fecha única. Solo se confirma si asiste.",
    color: "var(--c-hito)",
    franjas: false,
    fechas: ["2026-09-11"],
  },
  {
    clave: "grabacion",
    abrev: "GRAB",
    titulo: "Grabación del reality",
    corto: "Grabación",
    descripcion:
      "Ventana completa de grabación. Entre más días y franjas marque la persona, más fácil es cuadrarla cuando se cierre la agenda con el estudio.",
    color: "var(--c-sesion)",
    franjas: true,
    fechas: rango("2026-09-25", "2026-10-02"),
  },
  {
    clave: "final",
    abrev: "FIN",
    titulo: "Final y coronación",
    corto: "Final",
    descripcion: "Fechas tentativas: se confirma una de las dos.",
    color: "var(--brand)",
    franjas: false,
    fechas: ["2026-10-30", "2026-10-31"],
  },
]

/** Mapa fecha -> franjas confirmadas. Una fecha ausente es "no puede". */
export type Disponibilidad = Record<string, Franja[]>

export const FECHAS_MG1 = new Set(BLOQUES_MG1.flatMap((b) => b.fechas))

export function franjasDe(d: Disponibilidad | null | undefined, fecha: string): Franja[] {
  const v = d?.[fecha]
  return Array.isArray(v) ? v : []
}

export const puedeEse = (d: Disponibilidad | null | undefined, fecha: string): boolean =>
  franjasDe(d, fecha).length > 0

/** Días marcados dentro de un bloque. Es el número que ve el equipo en la tabla. */
export const diasDe = (d: Disponibilidad | null | undefined, bloque: BloqueMG1): number =>
  bloque.fechas.filter((f) => puedeEse(d, f)).length

/**
 * Deja solo fechas y franjas del catálogo, sin entradas vacías.
 * Corre en el servidor: el cliente propone, esta función dispone. Sin esto,
 * cualquiera con sesión podría escribir JSON arbitrario en la columna.
 */
export function sanearDisponibilidad(entrada: unknown): Disponibilidad {
  if (!entrada || typeof entrada !== "object" || Array.isArray(entrada)) return {}
  const salida: Disponibilidad = {}
  for (const [fecha, valor] of Object.entries(entrada as Record<string, unknown>)) {
    if (!FECHAS_MG1.has(fecha) || !Array.isArray(valor)) continue
    const franjas = [...new Set(valor)]
      .filter((v): v is Franja => typeof v === "string" && TODAS_FRANJAS.includes(v as Franja))
      .sort((a, b) => (ORDEN.get(a) ?? 0) - (ORDEN.get(b) ?? 0))
    if (franjas.length) salida[fecha] = franjas
  }
  return salida
}

/** "Vie 25" — para las tarjetas de día, donde el mes ya lo da el bloque. */
export const etiquetaDia = (fecha: string): string => {
  const d = D(fecha)
  return `${DIAS[d.getDay()]} ${d.getDate()}`
}

/** "Vie 25 sep" — para tablas y resúmenes, donde no hay contexto de mes. */
export const etiquetaDiaLarga = (fecha: string): string => {
  const d = D(fecha)
  return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`
}

/** Resumen en una línea, para pegar en una conversación o en las notas. */
export function resumenTexto(d: Disponibilidad | null | undefined): string {
  const partes = BLOQUES_MG1.map((b) => {
    const dias = b.fechas.filter((f) => puedeEse(d, f))
    if (!dias.length) return null
    return `${b.corto}: ${dias.map(etiquetaDiaLarga).join(", ")}`
  }).filter(Boolean)
  return partes.length ? partes.join(" · ") : "Sin disponibilidad marcada"
}
