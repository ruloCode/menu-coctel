// Utilidades de fecha en hora local, siempre con strings YYYY-MM-DD.
// Se construye el Date al mediodia para que ningun cambio de horario ni
// desfase de zona horaria corra el dia una casilla en el calendario.

export const D = (s: string): Date => {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(s)) s = hoy()
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y, m - 1, d, 12)
}

export const iso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

export const hoy = (): string => iso(new Date())

export const masDias = (s: string, n: number): string => {
  const d = D(s)
  d.setDate(d.getDate() + n)
  return iso(d)
}

export const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]
export const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
export const DIAS_LARGOS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export const fmt = (s: string): string => {
  const d = D(s)
  return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)} ${String(d.getFullYear()).slice(2)}`
}

export const fmtLargo = (s: string): string => {
  const d = D(s)
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

/** Empuja fuera de la semana muerta de fin de ano (20 dic - 3 ene). */
export function evitarFestivos(s: string): string {
  const d = D(s)
  const m = d.getMonth()
  const dia = d.getDate()
  if (m === 11 && dia >= 20) return iso(new Date(d.getFullYear() + 1, 0, 4, 12))
  if (m === 0 && dia <= 3) return iso(new Date(d.getFullYear(), 0, 4, 12))
  return s
}

/** Lunes de la semana a la que pertenece la fecha (clave de carga semanal). */
export function claveSemana(s: string): string {
  const d = D(s)
  const dia = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - dia)
  return iso(d)
}

export function ultimoSabado(y: number, m: number): string {
  const d = new Date(y, m + 1, 0, 12)
  while (d.getDay() !== 6) d.setDate(d.getDate() - 1)
  return iso(d)
}

export const esFecha = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)

/** Dias entre dos fechas (b - a). */
export const diasEntre = (a: string, b: string): number =>
  Math.round((D(b).getTime() - D(a).getTime()) / 86400000)
