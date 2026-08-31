import type { Area, RolApp } from "./tipos"

// Espejo en cliente de lo que ya impone RLS en Postgres. Sirve para no
// mostrar botones que van a fallar; la autoridad real siempre es la base de
// datos (migraciones 003, 004, 013 y 015), nunca este archivo.

export const ROLES: { valor: RolApp; label: string; desc: string }[] = [
  { valor: "owner",       label: "Owner",       desc: "Control total, incluida la gestión del equipo y el traspaso de la cuenta." },
  { valor: "admin",       label: "Admin",       desc: "Todo el panel y la gestión del equipo, salvo tocar al owner." },
  { valor: "manager",     label: "Manager",     desc: "Opera el calendario: artistas, proyectos, estudio, fiestas y radar. Aprueba los cambios que pide su área." },
  { valor: "contenido",   label: "Contenido",   desc: "Módulo de Redes: crea y edita publicaciones. No cambia el plan de lanzamientos." },
  { valor: "produccion",  label: "Producción musical", desc: "Composición, arreglos y grabación. Ve su trabajo, los proyectos de producción y el calendario del área; propone sesiones de estudio." },
  { valor: "audiovisual", label: "Producción audiovisual", desc: "Guion, rodaje y edición. Ve su trabajo, el calendario de contenido y las piezas de cada lanzamiento." },
  { valor: "artista",     label: "Artista",     desc: "Ve el calendario y aprueba o pide cambios en las piezas de su propia cuenta." },
  { valor: "viewer",      label: "Solo lectura", desc: "Ve todo el panel sin poder modificar nada." },
]

export type Permiso =
  | "operar"         // artistas, proyectos, calendario, estudio, fiestas, radar
  | "publicar"       // crear y editar publicaciones
  | "aprobarPropio"  // aprobar solo lo de su cuenta de artista
  | "aprobarCambios" // decidir sobre lo que pide un área: mover fechas y demás
  | "proponerSesion" // sembrar una sesion de estudio que otro confirma
  | "area"           // canal y compañeros de su área de trabajo
  | "verComo"        // previsualizar el panel de otro rol
  | "reglas"         // cambiar las reglas del sistema
  | "equipo"         // invitar, cambiar roles, desactivar cuentas
  | "exportar"

const MATRIZ: Record<RolApp, Permiso[]> = {
  owner:       ["operar", "publicar", "aprobarCambios", "proponerSesion", "area", "verComo", "reglas", "equipo", "exportar"],
  admin:       ["operar", "publicar", "aprobarCambios", "proponerSesion", "area", "verComo", "reglas", "equipo", "exportar"],
  manager:     ["operar", "publicar", "aprobarCambios", "proponerSesion", "area", "exportar"],
  contenido:   ["publicar", "area", "exportar"],
  produccion:  ["proponerSesion", "area"],
  audiovisual: ["publicar", "area"],
  artista:     ["aprobarPropio"],
  viewer:      [],
}

export const puede = (rol: RolApp | null | undefined, permiso: Permiso): boolean =>
  !!rol && MATRIZ[rol].includes(permiso)

export const etiquetaRol = (rol: RolApp): string =>
  ROLES.find((r) => r.valor === rol)?.label ?? rol

/* ============================================================
   Áreas de trabajo
   ============================================================
   El rol ES el área. Quien opera no pertenece a una sola, así que ve todas. */

export const AREAS: { valor: Area; label: string; desc: string }[] = [
  { valor: "produccion",  label: "Producción musical",    desc: "Composición, arreglos y grabación." },
  { valor: "audiovisual", label: "Producción audiovisual", desc: "Guion, rodaje y edición." },
]

export const areaDeRol = (rol: RolApp | null | undefined): Area | null =>
  rol === "produccion" ? "produccion" : rol === "audiovisual" ? "audiovisual" : null

export const etiquetaArea = (a: Area): string => AREAS.find((x) => x.valor === a)?.label ?? a

/* ============================================================
   Secciones del panel
   ============================================================ */

/** El primer grupo es personal: lo que le toca a quien abrió el panel. Va
 *  arriba a propósito — es la razón por la que alguien vuelve mañana.
 *  Zeri encabeza porque es la puerta de entrada: preguntar antes que buscar. */
export const SECCIONES = [
  { slug: "zeri",       label: "Zeri",               icon: "◆", color: "var(--brand)",           grupo: "Lo mío" },
  { slug: "mi-trabajo",  label: "Mi trabajo",          icon: "◆", color: "var(--brand)",           grupo: "Lo mío" },
  { slug: "bandeja",     label: "Bandeja",             icon: "◉", color: "var(--c-sesion)",        grupo: "Lo mío" },
  { slug: "area",        label: "Mi área",             icon: "◈", color: "var(--c-content)",       grupo: "Lo mío", permiso: "area" as Permiso },
  { slug: "",            label: "Resumen",             icon: "◍", color: "var(--ink)",             grupo: "Operación" },
  { slug: "cartera",     label: "Cartera y salud",     icon: "▣", color: "var(--good)",            grupo: "Operación" },
  { slug: "reuniones",   label: "Reuniones",           icon: "▢", color: "var(--c-hito)",          grupo: "Operación" },
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

/** Roles con panel recortado: en vez de "todo menos lo que el permiso niega",
 *  se les da una lista corta y explícita.
 *
 *  El motivo no es de seguridad sino de carga mental. El panel completo son 19
 *  secciones pensadas para quien coordina; a quien compone, arregla o escribe
 *  guiones, la mitad le estorba. Lo que no está aquí no aparece en la
 *  navegación Y además se bloquea por ruta en el layout.
 *
 *  Al añadir una sección nueva, revisar si pertenece a estas listas. Por
 *  omisión NO se añade: el recorte falla del lado seguro. */
export const SECCIONES_POR_ROL: Partial<Record<RolApp, string[]>> = {
  produccion: ["zeri", "mi-trabajo", "bandeja", "area", "", "calendario", "estudio", "artistas", "reuniones"],
  // Audiovisual no ve Estudio (es grabación de audio) pero sí Redes, que es
  // donde vive el calendario de contenido que ellos producen.
  audiovisual: ["zeri", "mi-trabajo", "bandeja", "area", "", "calendario", "redes", "artistas", "reuniones"],
  contenido: ["zeri", "mi-trabajo", "bandeja", "area", "", "calendario", "redes", "artistas"],
  artista: ["zeri", "mi-trabajo", "bandeja", "", "calendario"],
}

export const seccionesVisibles = (rol: RolApp | null | undefined) => {
  const permitidas = rol ? SECCIONES_POR_ROL[rol] : undefined

  if (permitidas) {
    return SECCIONES.filter((s) => permitidas.includes(s.slug))
  }

  return SECCIONES.filter((s) => !s.permiso || puede(rol, s.permiso))
}

/** Guardia de ruta. La navegación oculta lo que no toca, pero alguien puede
 *  escribir /admin/cartera a mano; el layout del panel usa esto para redirigir. */
export const puedeVerSeccion = (rol: RolApp | null | undefined, slug: string): boolean =>
  seccionesVisibles(rol).some((s) => s.slug === slug)

/** Dónde mandar a alguien que pidió una sección que no le corresponde: a la
 *  primera que sí, no a un 403 seco. */
export const seccionInicial = (rol: RolApp | null | undefined): string => {
  const visibles = seccionesVisibles(rol)
  const inicio = visibles.find((s) => s.slug === "") ?? visibles[0]
  return inicio ? `/admin/${inicio.slug}`.replace(/\/$/, "") : "/admin"
}
