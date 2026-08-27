import type { FichaRadar } from "./tipos"
import { CATS, RECS, type TipoScore } from "./constantes"

// Puntaje 0-100 por categoria. La idea: convertir corazonadas en un numero
// comparable, sin pretender que el numero decida por el equipo.

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
/** Escala logaritmica: la diferencia entre 300 y 3.000 seguidores pesa como la
 *  que hay entre 3.000 y 30.000. Sin esto un solo perfil grande aplasta la tabla. */
const sLog = (v: unknown, lo: number, hi: number, pts: number) => {
  const n = +(v ?? 0) || 0
  if (n <= 0) return 0
  const L = Math.log10(n)
  return clamp((L - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo)), 0, 1) * pts
}
const sLin = (v: unknown, lo: number, hi: number, pts: number) =>
  clamp(((+(v ?? 0) || 0) - lo) / (hi - lo), 0, 1) * pts
const sStar = (v: unknown, pts: number) => clamp((+(v ?? 0) || 0) / 5, 0, 1) * pts
const sChk = (v: unknown, pts: number) => (v ? pts : 0)

export const ultimaMedicion = (e: FichaRadar) =>
  e.mediciones.length ? e.mediciones[e.mediciones.length - 1].m : null
export const penultimaMedicion = (e: FichaRadar) =>
  e.mediciones.length > 1 ? e.mediciones[e.mediciones.length - 2].m : null

/** Audiencia total sumando solo las redes que aplican a la categoria. */
export function audiencia(e: FichaRadar, m?: Record<string, number> | null): number {
  const med = m ?? ultimaMedicion(e)
  if (!med) return 0
  const nets = CATS[e.cat]?.nets ?? []
  let t = 0
  if (nets.includes("ig")) t += +med.ig_seg || 0
  if (nets.includes("tt")) t += +med.tt_seg || 0
  if (nets.includes("yt")) t += +med.yt_sub || 0
  if (nets.includes("sp")) t += +med.sp_oy || 0
  return t
}

/** Crecimiento % entre las dos ultimas mediciones. null si no hay con que comparar. */
export function crecimiento(e: FichaRadar): number | null {
  const a = ultimaMedicion(e)
  const b = penultimaMedicion(e)
  if (!a || !b) return null
  const na = audiencia(e, a)
  const nb = audiencia(e, b)
  if (!nb) return null
  return ((na - nb) / nb) * 100
}

export function puntaje(e: FichaRadar): number | null {
  const tipo = CATS[e.cat]?.score ?? null
  if (!tipo) return null

  const f = e.campos ?? {}
  const m = ultimaMedicion(e)
  // Sin una medicion base no hay puntaje honesto para los perfiles de audiencia.
  if (!m && ["artista", "creador", "influencer", "dj", "venue", "prensa"].includes(tipo)) return null

  const g = crecimiento(e)
  // Sin historial se asume un 40% del peso: ni premia ni castiga de mas.
  const gPts = (p: number) => (g === null ? p * 0.4 : clamp((g + 5) / 30, 0, 1) * p) // −5%→0, +25%→máx
  const aud = audiencia(e)

  switch (tipo) {
    case "artista":
      return Math.round(
        gPts(25) + sLog(aud, 300, 100000, 20) + sLin(f.posts, 0, 20, 15) + sLin(f.eng, 0, 8, 10) +
        (sChk(f.inv_video, 4.5) + sChk(f.inv_dist, 3.5) + sChk(f.inv_foto, 3.5) + sChk(f.inv_mezcla, 3.5)) +
        sStar(f.criterio, 15))
    case "musico":
      return Math.round(
        sStar(f.tecnico, 30) + sStar(f.versatil, 20) + sStar(f.actitud, 20) +
        (f.tarifa ? clamp(1 - (+f.tarifa) / 400000, 0, 1) * 15 : 7.5) +
        (sChk(f.s_estudio, 5) + sChk(f.s_vivo, 5) + sChk(f.s_equipo, 5)))
    case "creador":
      return Math.round(
        sLog(aud, 500, 200000, 30) + sLin(f.eng, 0, 8, 20) + sLin(f.posts, 0, 20, 15) +
        sStar(f.prod, 15) + sStar(f.encaje, 20))
    case "influencer":
      return Math.round(
        sLog(aud, 1000, 300000, 25) + sLin(f.eng, 0, 8, 25) + sLin(f.posts, 0, 20, 15) +
        (sChk(f.local, 10) + sChk(f.urbano_aud, 10)) + sStar(f.criterio, 15))
    case "dj":
      return Math.round(
        sLog(aud, 300, 80000, 25) + sLin(f.sets, 0, 12, 20) + sStar(f.urbano, 15) +
        sChk(f.pincha, 10) + sLin(f.eng, 0, 8, 15) + sStar(f.criterio, 15))
    case "venue":
      return Math.round(
        sLog(f.aforo, 30, 800, 20) + sChk(f.envivo, 20) + sStar(f.enfoque, 15) +
        sLin(f.eventos, 0, 12, 15) + sChk(f.publica, 10) + sLog(m?.ig_seg ?? 0, 300, 50000, 20))
    case "proveedor":
      return Math.round(
        sStar(f.calidad, 30) + sStar(f.plazos, 20) +
        (f.rango ? ({ "Económico": 20, "Medio": 14, "Alto": 6, "Por negociar": 10 }[String(f.rango)] ?? 10) : 10) +
        (f.dispo ? ({ "Inmediata": 15, "1-2 semanas": 11, "1 mes": 6, "Saturado": 2 }[String(f.dispo)] ?? 7) : 7) +
        (sChk(f.urbanos, 5) + sChk(f.porta, 4) + sChk(f.equipo, 3) + clamp((+(f.conMG ?? 0) || 0) / 3, 0, 1) * 3))
    case "prensa":
      return Math.round(
        sLog(aud, 500, 200000, 35) + sStar(f.afinidad, 25) + sStar(f.emergentes, 20) + sStar(f.criterio, 20))
  }
  return null
}

/** Traduce el puntaje a una recomendacion accionable segun la categoria. */
export function recomendacion(e: FichaRadar): [number, string, string] | null {
  const tipo = CATS[e.cat]?.score as TipoScore | null
  const s = puntaje(e)
  if (!tipo || s === null) return null
  return RECS[tipo].find((r) => s >= r[0]) ?? null
}
