import type { RolApp } from "./tipos"

// Espejo en cliente de lo que ya impone RLS en Postgres. Sirve para no
// mostrar botones que van a fallar; la autoridad real siempre es la base de
// datos (migraciones 003 y 004), nunca este archivo.

export const ROLES: { valor: RolApp; label: string; desc: string }[] = [
  { valor: "owner",     label: "Owner",      desc: "Control total, incluida la gestión del equipo y el traspaso de la cuenta." },
  { valor: "admin",     label: "Admin",      desc: "Todo el panel y la gestión del equipo, salvo tocar al owner." },
  { valor: "manager",   label: "Manager",    desc: "Opera el calendario: artistas, proyectos, estudio, fiestas y radar." },
  { valor: "contenido", label: "Contenido",  desc: "Módulo de Redes: crea y edita publicaciones. No cambia el plan de lanzamientos." },
  { valor: "artista",   label: "Artista",    desc: "Ve el calendario y aprueba o pide cambios en las piezas de su propia cuenta." },
  { valor: "viewer",    label: "Solo lectura", desc: "Ve todo el panel sin poder modificar nada." },
]

export type Permiso =
  | "operar"        // artistas, proyectos, calendario, estudio, fiestas, radar
  | "publicar"      // crear y editar publicaciones
  | "aprobarPropio" // aprobar solo lo de su cuenta de artista
  | "reglas"        // cambiar las reglas del sistema
  | "equipo"        // invitar, cambiar roles, desactivar cuentas
  | "exportar"

const MATRIZ: Record<RolApp, Permiso[]> = {
  owner:     ["operar", "publicar", "reglas", "equipo", "exportar"],
  admin:     ["operar", "publicar", "reglas", "equipo", "exportar"],
  manager:   ["operar", "publicar", "exportar"],
  contenido: ["publicar", "exportar"],
  artista:   ["aprobarPropio"],
  viewer:    [],
}

export const puede = (rol: RolApp | null | undefined, permiso: Permiso): boolean =>
  !!rol && MATRIZ[rol].includes(permiso)

export const etiquetaRol = (rol: RolApp): string =>
  ROLES.find((r) => r.valor === rol)?.label ?? rol

/** Secciones del panel visibles para cada rol.
 *  El primer grupo es personal: lo que le toca a quien abrió el panel. Va
 *  arriba a propósito — es la razón por la que alguien vuelve mañana. */
export const SECCIONES = [
  { slug: "mi-trabajo",  label: "Mi trabajo",          icon: "◆", color: "var(--brand)",           grupo: "Lo mío" },
  { slug: "bandeja",     label: "Bandeja",             icon: "◉", color: "var(--c-sesion)",        grupo: "Lo mío" },
  { slug: "",            label: "Resumen",             icon: "◍", color: "var(--ink)",             grupo: "Operación" },
  { slug: "cartera",     label: "Cartera y salud",     icon: "▣", color: "var(--good)",            grupo: "Operación" },
  { slug: "carga",       label: "Carga del equipo",    icon: "▥", color: "var(--c-content)",       grupo: "Operación" },
  { slug: "calendario",  label: "Calendario",          icon: "▦", color: "var(--c-release)",       grupo: "Operación" },
  { slug: "timeline",    label: "Timeline",            icon: "▤", color: "var(--c-pre)",           grupo: "Operación" },
  { slug: "estudio",     label: "Estudio",             icon: "◉", color: "var(--c-sesion)",        grupo: "Operación" },
  { slug: "artistas",    label: "Artistas y proyectos",icon: "◈", color: "var(--c-content)",       grupo: "Catálogo" },
  { slug: "fiestas",     label: "Fiestas MG",          icon: "◆", color: "var(--c-fiesta)",        grupo: "Catálogo" },
  { slug: "redes",       label: "Redes",               icon: "◐", color: "var(--c-publicacion)",   grupo: "Catálogo" },
  { slug: "radar",       label: "Radar",               icon: "◎", color: "var(--c-seguimiento)",   grupo: "Catálogo" },
  { slug: "mg1",         label: "Convocatoria MG1",    icon: "◇", color: "var(--c-hito)",          grupo: "Catálogo" },
  { slug: "plan",        label: "Plan y reglas",       icon: "⚙", color: "var(--c-hito)",          grupo: "Administración" },
  { slug: "equipo",      label: "Equipo y accesos",    icon: "◑", color: "var(--muted)",           grupo: "Administración", permiso: "equipo" as Permiso },
  { slug: "datos",       label: "Datos y bitácora",    icon: "◌", color: "var(--muted)",           grupo: "Administración" },
]

export const seccionesVisibles = (rol: RolApp | null | undefined) =>
  SECCIONES.filter((s) => !s.permiso || puede(rol, s.permiso))
