import "server-only"

import { createClient } from "@/lib/supabase/server"
import { AJUSTES_DEFAULT, REGLAS_DEFAULT } from "./constantes"
import type { Perfil, Snapshot } from "./tipos"

/** El perfil del usuario autenticado, o null si no hay sesion o esta inactivo. */
export async function perfilActual(): Promise<Perfil | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("perfiles")
    .select("id, email, nombre, rol, activo, avatar_url, artista_id, ultimo_acceso, created_at")
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

  const [artistas, proyectos, estados, extra, config, publicaciones, radar, textos, bitacora] =
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
    ])

  const eventosEstado: Snapshot["eventosEstado"] = {}
  for (const e of estados.data ?? []) {
    eventosEstado[e.evento_id] = {
      evento_id: e.evento_id,
      fecha_override: e.fecha_override,
      hecho: e.hecho,
      eliminado: e.eliminado,
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
  }
}

export async function cargarEquipo(): Promise<Perfil[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("perfiles")
    .select("id, email, nombre, rol, activo, avatar_url, artista_id, ultimo_acceso, created_at")
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
