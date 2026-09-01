import type { Evento, Perfil, Proyecto, Snapshot } from "./tipos"
import { D, claveSemana, hoy, masDias } from "./fechas"
import { agendarSesiones, artistaPorId, eventosProyecto } from "./motor"

/* ============================================================
   Modulo de estudio: grabacion, mezcla y master
   ============================================================
   Todo lo de aqui se DERIVA del snapshot. No hay tabla de "fases" ni de
   "asignacion de mezcla": la fase sale del estado del proyecto mas el contador
   de grabadas, y quien mezcla es el responsable del hito `master`, que ya es
   un evento anotable. Inventar entidades para esto habria duplicado la
   verdad en dos sitios que se desincronizan. */

export type Fase = "por_grabar" | "grabando" | "mezcla" | "master" | "listo"

export const FASES: { clave: Fase; label: string; color: string; ayuda: string }[] = [
  { clave: "por_grabar", label: "Por grabar",  color: "var(--muted)",     ayuda: "Con sesiones agendadas y ninguna cerrada" },
  { clave: "grabando",   label: "Grabando",    color: "var(--c-sesion)",  ayuda: "Grabación empezada, aún faltan temas" },
  { clave: "mezcla",     label: "En mezcla",   color: "var(--c-pre)",     ayuda: "Grabación cerrada: le toca a quien mezcla" },
  { clave: "master",     label: "En máster",   color: "var(--c-hito)",    ayuda: "Mezcla aprobada, eligiendo masters" },
  { clave: "listo",      label: "Listo",       color: "var(--c-post)",    ayuda: "Máster entregado" },
]

/**
 * En que punto de la produccion musical esta el proyecto.
 *
 * Se apoya en los hechos duros (cuantas canciones hay grabadas) antes que en
 * `estado`, y NO trata 'planeacion' como terminado: ese valor habla de la
 * planeacion de la campana, que es otro eje — el mismo desdoblamiento que ya
 * existe entre `estado` y `salud`. Contarlo como listo metia en la columna
 * "Listo" proyectos con cero canciones grabadas y sesiones aun por delante.
 */
export const faseDe = (p: Proyecto): Fase => {
  if (p.estado === "listo" || p.estado === "lanzado") return "listo"
  if (p.estado === "seleccion_masters") return "master"
  if (p.tracks > 0 && p.grabados >= p.tracks) return "mezcla"
  return p.grabados > 0 ? "grabando" : "por_grabar"
}

/** Proyectos que le importan al estudio: los vivos con temas por producir. */
export const proyectosDeEstudio = (s: Snapshot): Proyecto[] =>
  s.proyectos.filter((p) => p.estado !== "pausado" && p.estado !== "lanzado" && p.tracks > 0)

/* ---------- quien mezcla ---------- */

/**
 * Responsable de la mezcla y el master.
 *
 * Cascada a proposito: la anotacion del hito `master` gana porque es la
 * decision mas especifica y la mas reciente; si nadie la tomo, responde el
 * lider del proyecto; y si tampoco hay, el area de produccion en bloque, que
 * es mejor que no avisar a nadie.
 */
export function responsableMezcla(s: Snapshot, p: Proyecto): string | null {
  return s.eventosEstado[`${p.id}:master`]?.responsable_id ?? p.lider_id ?? null
}

export const areaProduccion = (s: Snapshot): Perfil[] =>
  s.equipo.filter((m) => m.activo && m.rol === "produccion")

/** A quien hay que avisarle cuando se cierra la grabacion de un proyecto. */
export function destinatariosMezcla(s: Snapshot, p: Proyecto): string[] {
  const uno = responsableMezcla(s, p)
  if (uno) return [uno]
  return areaProduccion(s).map((m) => m.id)
}

/* ---------- la ventana de mezcla ---------- */

export interface VentanaMezcla {
  /** Deadline de grabación: el día en que la mezcla debería poder arrancar. */
  inicio: string
  /** Master final: la fecha de entrega. */
  entrega: string
  /** Días entre una y otra. Con las reglas por defecto son 21. */
  dias: number
  /** Días desde hoy hasta la entrega. Negativo = ya se pasó. */
  restantes: number
  /** La grabación ya está cerrada, así que la mezcla puede empezar de verdad. */
  arrancable: boolean
  /** El hito de master ya se marcó como hecho. */
  entregado: boolean
  vencida: boolean
  /** Queda menos de una cuarta parte de la ventana y no se ha entregado. */
  apretada: boolean
}

export function ventanaMezcla(s: Snapshot, p: Proyecto, t = hoy()): VentanaMezcla {
  const R = s.config.reglas
  const hitos = eventosProyecto(s, p)
  // Se leen del motor, no se recalculan: si alguien movió el hito a mano, la
  // ventana real es la movida, no la teórica.
  const inicio = hitos.find((e) => e.id === `${p.id}:recDeadline`)?.fecha
    ?? masDias(p.release, -R.recordingDone)
  const hitoMaster = hitos.find((e) => e.id === `${p.id}:master`)
  const entrega = hitoMaster?.fecha ?? masDias(p.release, -R.masterFinal)

  const dias = Math.round((D(entrega).getTime() - D(inicio).getTime()) / 86400000)
  const restantes = Math.round((D(entrega).getTime() - D(t).getTime()) / 86400000)
  const entregado = !!hitoMaster?.hecho
  const arrancable = p.tracks > 0 && p.grabados >= p.tracks

  return {
    inicio,
    entrega,
    dias,
    restantes,
    arrancable,
    entregado,
    vencida: !entregado && restantes < 0,
    apretada: !entregado && restantes >= 0 && dias > 0 && restantes <= dias / 4,
  }
}

/** Lo que espera en la mesa de mezcla, lo más urgente primero. */
export function colaDeMezcla(s: Snapshot, t = hoy()) {
  return proyectosDeEstudio(s)
    .map((p) => ({ p, v: ventanaMezcla(s, p, t), fase: faseDe(p) }))
    .filter((x) => !x.v.entregado && (x.fase === "mezcla" || x.fase === "master"))
    .sort((a, b) => a.v.restantes - b.v.restantes)
}

/* ---------- capacidad real del estudio ---------- */

export interface CapacidadDia {
  fecha: string
  esDiaSesion: boolean
  tope: number
  usados: number
  lleno: boolean
  excedido: boolean
}

/**
 * Carga por día calculada sobre la fecha FINAL de cada sesión.
 *
 * El agendador contabiliza la capacidad sobre el hueco que calculó, pero
 * muestra `fecha_override` si alguien movió la sesión a mano. Contar sobre lo
 * que se ve es lo único honesto: si tres sesiones acabaron el mismo martes,
 * el martes está lleno, lo hubiera planeado el motor o no.
 */
export function cargaPorDia(sesiones: Evento[]): Record<string, number> {
  const carga: Record<string, number> = {}
  sesiones.forEach((e) => { carga[e.fecha] = (carga[e.fecha] ?? 0) + 1 })
  return carga
}

export function capacidadDe(s: Snapshot, fecha: string, carga: Record<string, number>): CapacidadDia {
  const A = s.config.ajustes
  const dow = D(fecha).getDay()
  const esDiaSesion = A.sessionDays.includes(dow)
  const tope = esDiaSesion ? (dow === 6 ? A.satBlocks : A.weekdayBlocks) : 0
  const usados = carga[fecha] ?? 0
  return { fecha, esDiaSesion, tope, usados, lleno: esDiaSesion && usados >= tope, excedido: usados > tope }
}

/** Por qué NO se puede soltar una sesión en un día. null = se puede. */
export function motivoBloqueo(s: Snapshot, fecha: string, carga: Record<string, number>): string | null {
  const c = capacidadDe(s, fecha, carga)
  if (!c.esDiaSesion) return "El estudio no abre ese día"
  if (c.usados >= c.tope) return `Ese día ya tiene sus ${c.tope} bloques ocupados`
  return null
}

/* ---------- carga por semana ---------- */

export function cargaPorSemana(s: Snapshot, sesiones: Evento[], semanas = 14) {
  const carga: Record<string, number> = {}
  sesiones.forEach((e) => { const wk = claveSemana(e.fecha); carga[wk] = (carga[wk] ?? 0) + 1 })
  const inicio = claveSemana(hoy())
  return Array.from({ length: semanas }, (_, i) => {
    const wk = masDias(inicio, i * 7)
    return { wk, bloques: carga[wk] ?? 0, tope: s.config.ajustes.weeklyCap }
  })
}

/* ---------- resumen para los KPIs ---------- */

export function resumenEstudio(s: Snapshot, t = hoy()) {
  const sesiones = agendarSesiones(s)
  const proyectos = proyectosDeEstudio(s)
  const cola = colaDeMezcla(s, t)

  return {
    sesiones,
    porGrabar: sesiones.length,
    tarde: sesiones.filter((e) => e.tarde).length,
    estaSemana: sesiones.filter((e) => e.fecha >= t && e.fecha <= masDias(t, 7)).length,
    enMezcla: cola.length,
    mezclaVencida: cola.filter((x) => x.v.vencida).length,
    mezclaApretada: cola.filter((x) => x.v.apretada).length,
    proyectos,
  }
}

/* ---------- agrupacion por proyecto, para las vistas de lista ---------- */

export interface FilaEstudio {
  proyecto: Proyecto
  artista: string
  sesiones: Evento[]
  fase: Fase
  ventana: VentanaMezcla
  pct: number
}

export function filasEstudio(s: Snapshot, sesiones: Evento[], t = hoy()): FilaEstudio[] {
  const porProyecto: Record<string, Evento[]> = {}
  sesiones.forEach((e) => { if (e.proyecto_id) (porProyecto[e.proyecto_id] ||= []).push(e) })

  return proyectosDeEstudio(s)
    .map((p) => ({
      proyecto: p,
      artista: artistaPorId(s, p.artista_id)?.nombre ?? "?",
      sesiones: (porProyecto[p.id] ?? []).sort((a, b) => a.fecha.localeCompare(b.fecha)),
      fase: faseDe(p),
      ventana: ventanaMezcla(s, p, t),
      pct: p.tracks ? Math.round((p.grabados / p.tracks) * 100) : 0,
    }))
    .sort((a, b) => a.proyecto.release.localeCompare(b.proyecto.release))
}
