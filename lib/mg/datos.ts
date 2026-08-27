import "server-only"

import { createClient } from "@/lib/supabase/server"
import { AJUSTES_DEFAULT, REGLAS_DEFAULT } from "./constantes"
import type { Aviso, Comentario, Perfil, ReporteSalud, Reunion, Snapshot } from "./tipos"

/** El perfil del usuario autenticado, o null si no hay sesion o esta inactivo. */
export async function perfilActual(): Promise<Perfil | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("perfiles")
    .select("id, email, nombre, rol, activo, avatar_url, artista_id, capacidad_semanal, ultimo_acceso, created_at")
    .eq("id", user.id)
    .maybeSingle()

  if (!data || !data.activo) return null
  return data as Perfil
}

/**
 * Carga todo lo que el motor de eventos necesita para derivar el calendario.
 * Una sola ida a la base por request: el volumen es de decenas de filas por
 * tabla, asi que paginar o cargar por seccion complicaria mas de lo que ahorra.
 */
export async function cargarSnapshot(): Promise<Snapshot> {
  const supabase = await createClient()

  const [artistas, proyectos, estados, extra, config, publicaciones, radar, textos, bitacora, equipo, comentarios] =
    await Promise.all([
      supabase.from("mg_artistas").select("*").order("orden"),
      supabase.from("mg_proyectos").select("*").order("release"),
      supabase.from("mg_eventos_estado").select("*"),
      supabase.from("mg_eventos_extra").select("*"),
      supabase.from("mg_config").select("*").eq("id", "global").maybeSingle(),
      supabase.from("mg_publicaciones").select("*").order("fecha"),
      supabase.from("mg_radar").select("*").order("nombre"),
      supabase.from("mg_textos").select("*").order("created_at", { ascending: false }),
      supabase.from("mg_bitacora").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("perfiles")
        .select("id, email, nombre, rol, activo, avatar_url, artista_id, capacidad_semanal, ultimo_acceso, created_at")
        .eq("activo", true).order("nombre"),
      supabase.from("mg_comentarios").select("*").order("created_at"),
    ])

  const eventosEstado: Snapshot["eventosEstado"] = {}
  for (const e of estados.data ?? []) {
    eventosEstado[e.evento_id] = {
      evento_id: e.evento_id,
      fecha_override: e.fecha_override,
      hecho: e.hecho,
      eliminado: e.eliminado,
      responsable_id: e.responsable_id,
      prioridad: e.prioridad,
      hecho_at: e.hecho_at,
    }
  }

  return {
    artistas: artistas.data ?? [],
    proyectos: proyectos.data ?? [],
    eventosEstado,
    eventosExtra: extra.data ?? [],
    config: {
      // Los defaults cubren las claves que una config guardada por una version
      // anterior todavia no tenga.
      reglas: { ...REGLAS_DEFAULT, ...(config.data?.reglas ?? {}) },
      ajustes: { ...AJUSTES_DEFAULT, ...(config.data?.ajustes ?? {}) },
      slots: config.data?.slots ?? null,
    },
    publicaciones: publicaciones.data ?? [],
    radar: radar.data ?? [],
    textos: textos.data ?? [],
    bitacora: bitacora.data ?? [],
    equipo: (equipo.data ?? []) as Perfil[],
    comentarios: (comentarios.data ?? []) as Comentario[],
  }
}

/** Bandeja de la persona en sesion. Solo devuelve lo suyo: lo garantiza RLS. */
export async function cargarAvisos(): Promise<Aviso[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("mg_avisos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(80)
  return (data ?? []) as Aviso[]
}

export async function cargarReuniones(): Promise<Reunion[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("mg_reuniones").select("*").order("fecha", { ascending: false })
  return (data ?? []) as Reunion[]
}

export async function cargarReunion(id: string): Promise<Reunion | null> {
  const supabase = await createClient()
  const { data } = await supabase.from("mg_reuniones").select("*").eq("id", id).maybeSingle()
  return (data as Reunion) ?? null
}

export async function cargarHistorialSalud(): Promise<ReporteSalud[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("mg_salud_historial")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(120)
  return (data ?? []) as ReporteSalud[]
}

export async function cargarEquipo(): Promise<Perfil[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("perfiles")
    .select("id, email, nombre, rol, activo, avatar_url, artista_id, capacidad_semanal, ultimo_acceso, created_at")
    .order("created_at")
  return (data ?? []) as Perfil[]
}

export interface InscripcionMG1 {
  id: string
  edicion: string
  nombre_artistico: string
  nombre_completo: string
  email: string
  celular: string
  ciudad: string
  link_musica: string
  por_que: string | null
  estado: string
  notas: string | null
  created_at: string
}

export async function cargarInscripcionesMG1(): Promise<InscripcionMG1[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("mg1_inscripciones")
    .select("*")
    .order("created_at", { ascending: false })
  return (data ?? []) as InscripcionMG1[]
}
