"use client"

import { useMemo, useState, useTransition } from "react"
import { claveSemana, fmt } from "@/lib/mg/fechas"
import { agendarSesiones, artistaPorId, colorAvance, proyectoPorId } from "@/lib/mg/motor"
import type { Evento, Snapshot, Perfil, Proyecto } from "@/lib/mg/tipos"
import { marcarSesionGrabada } from "@/app/admin/acciones"
import { BarraAvance, Caja, CheckCircular, FichaArtista } from "./avance"
import { Vacio } from "./ui"
import ModalEvento from "./modal-evento"
import QuePaso from "./que-paso"

export default function VistaEstudio({
  snapshot, yo, puedeEditar,
}: {
  snapshot: Snapshot
  yo: Perfil
  puedeEditar: boolean
}) {
  const [evento, setEvento] = useState<Evento | null>(null)
  const [verCerrados, setVerCerrados] = useState(false)
  const [pendiente, arrancar] = useTransition()
  const S = snapshot.config.ajustes
  const R = snapshot.config.reglas

  const sesiones = useMemo(() => agendarSesiones(snapshot), [snapshot])

  // Capacidad por semana: doce columnas en una tira. Antes era una tarjeta por
  // semana, y con doce semanas la pantalla no cabía en ningún sitio.
  const semanas = useMemo(() => {
    const carga: Record<string, number> = {}
    sesiones.forEach((s) => { carga[claveSemana(s.fecha)] = (carga[claveSemana(s.fecha)] ?? 0) + 1 })
    return Object.keys(carga).sort().slice(0, 14).map((wk) => ({ wk, bloques: carga[wk] }))
  }, [sesiones])

  // Una fila por proyecto, no una por sesión. Antes, un álbum de diez temas
  // producía diez filas casi idénticas repartidas por varias tarjetas.
  const porProyecto = useMemo(() => {
    const m: Record<string, Evento[]> = {}
    sesiones.forEach((s) => { if (s.proyecto_id) (m[s.proyecto_id] ||= []).push(s) })

    const conSesiones = Object.keys(m).map((id) => ({
      proyecto: proyectoPorId(snapshot, id)!,
      lista: m[id].sort((a, b) => a.fecha.localeCompare(b.fecha)),
    })).filter((x) => x.proyecto)

    // Proyectos con toda la grabación cerrada: no tienen sesiones agendadas,
    // así que hay que traerlos aparte para poder mostrarlos como terminados.
    const cerrados = snapshot.proyectos
      .filter((p) => p.estado !== "pausado" && p.estado !== "lanzado" && p.tracks > 0 && p.grabados >= p.tracks)
      .map((p) => ({ proyecto: p, lista: [] as Evento[] }))

    return [...conSesiones, ...cerrados].sort((a, b) => a.proyecto.release.localeCompare(b.proyecto.release))
  }, [sesiones, snapshot])

  const abiertos = porProyecto.filter((x) => x.lista.length > 0)
  const terminados = porProyecto.filter((x) => x.lista.length === 0)
  const totalTarde = sesiones.filter((e) => e.tarde).length
  const visibles = verCerrados ? porProyecto : abiertos

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Estudio · Sesiones de grabación</h1>
          <div className="sub">
            Agrupado por proyecto. Cada bloque es una sesión de 4 h sobre la capacidad real del estudio.
          </div>
        </div>
        <div className="spacer" />
        {terminados.length > 0 ? (
          <div className="seg" role="group" aria-label="Proyectos terminados">
            <button className={!verCerrados ? "on" : ""} onClick={() => setVerCerrados(false)}>En grabación</button>
            <button className={verCerrados ? "on" : ""} onClick={() => setVerCerrados(true)}>
              Incluir terminados ({terminados.length})
            </button>
          </div>
        ) : null}
        {puedeEditar ? <QuePaso proyectos={snapshot.proyectos} artistas={snapshot.artistas} /> : null}
      </div>

      {totalTarde > 0 ? (
        <div className="banner" style={{ borderColor: "var(--critical)" }}>
          <span aria-hidden>🔴</span>
          <b style={{ background: "var(--critical)" }}>{totalTarde}</b>
          <span>
            {totalTarde === 1 ? "sesión queda" : "sesiones quedan"} después de su deadline de grabación.
            No caben en la capacidad actual: hay que abrir bloques o mover el release.
          </span>
        </div>
      ) : null}

      {semanas.length > 0 ? (
        <div className="card">
          <h2>
            Capacidad del estudio
            <span className="small muted" style={{ fontWeight: 400 }}>
              martes, jueves y sábado · techo de {S.weeklyCap} bloques por semana
            </span>
          </h2>
          <div className="cap-tira">
            {semanas.map(({ wk, bloques }) => {
              const alto = Math.min(100, (bloques / S.weeklyCap) * 100)
              const color = bloques >= S.weeklyCap ? "var(--critical)"
                : bloques >= S.weeklyCap * 0.75 ? "var(--c-release)" : "var(--c-sesion)"
              return (
                <div className="cap-col" key={wk}>
                  <div className="via" role="img" aria-label={`Semana del ${fmt(wk)}: ${bloques} de ${S.weeklyCap} bloques`}>
                    <i style={{ height: `${alto}%`, background: color }} />
                  </div>
                  <span className="et">{fmt(wk).slice(0, 6)}</span>
                </div>
              )
            })}
          </div>
          <p className="small muted" style={{ marginTop: 10, marginBottom: 0 }}>
            1 canción = 1 bloque de 4 h. El ritmo base son 4 bloques por semana, ampliable a {S.weeklyCap}
            {" "}de los {S.maxCap} posibles: el resto es colchón para repeticiones, mezclas y urgencias.
            El agendador prioriza siempre el deadline más cercano (release − {R.recordingDone} días).
          </p>
        </div>
      ) : null}

      {visibles.length === 0 ? (
        <div className="card"><Vacio titulo="No hay canciones pendientes por grabar" /></div>
      ) : null}

      {visibles.map(({ proyecto, lista }) => (
        <FilaEstudio
          key={proyecto.id}
          proyecto={proyecto}
          lista={lista}
          snapshot={snapshot}
          puedeEditar={puedeEditar}
          pendiente={pendiente}
          onMarcar={(s) => arrancar(async () => { await marcarSesionGrabada(s.id, s.proyecto_id!) })}
          onMover={setEvento}
        />
      ))}

      {evento ? (
        <ModalEvento evento={evento} snapshot={snapshot} yo={yo} puedeEditar={puedeEditar} onClose={() => setEvento(null)} />
      ) : null}
    </>
  )
}

function FilaEstudio({
  proyecto: p, lista, snapshot, puedeEditar, pendiente, onMarcar, onMover,
}: {
  proyecto: Proyecto
  lista: Evento[]
  snapshot: Snapshot
  puedeEditar: boolean
  pendiente: boolean
  onMarcar: (s: Evento) => void
  onMover: (s: Evento) => void
}) {
  const a = artistaPorId(snapshot, p.artista_id)
  const completo = p.grabados >= p.tracks
  const pct = p.tracks ? Math.round((p.grabados / p.tracks) * 100) : 0

  return (
    <div className="card" style={completo ? { background: "color-mix(in srgb, var(--c-post) 6%, var(--surface))" } : undefined}>
      <div className="frow" style={{ marginBottom: 12 }}>
        <FichaArtista id={p.artista_id} nombre={a?.nombre ?? "?"} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 650, fontSize: 14 }}>{a?.nombre ?? "?"} · {p.titulo}</div>
          <div className="small muted">
            {p.tipo} · release {fmt(p.release)}
          </div>
        </div>
        <div className="spacer" />
        {completo ? (
          <span className="tag" style={{ background: "var(--c-post)" }}>
            <CheckCircular color="#fff" /> Grabación completa
          </span>
        ) : null}
        <BarraAvance
          hechas={p.grabados}
          total={p.tracks}
          pct={pct}
          color={colorAvance(pct, completo)}
          etiqueta="grabadas"
        />
      </div>

      <div className="sesiones">
        {/* Las ya grabadas se reconstruyen del contador del proyecto: el
            agendador solo programa lo que falta, así que una sesión pasada
            deja de existir como evento. Lo que queda es el hecho: ya se grabó. */}
        {Array.from({ length: p.grabados }, (_, i) => (
          <span className="sesion hecha" key={`hecha-${i}`}>
            <Caja hecha />
            <span>
              <span className="cuando">Grabada</span>
              <span className="n" style={{ display: "block" }}>Sesión {i + 1}/{p.tracks}</span>
            </span>
          </span>
        ))}

        {lista.map((s, i) => (
          <button
            key={s.id}
            className={s.tarde ? "sesion tarde" : "sesion"}
            disabled={!puedeEditar || pendiente}
            onClick={() => onMarcar(s)}
            title={s.tarde ? "Queda después del deadline de grabación" : "Marcar como grabada"}
          >
            <Caja hecha={false} />
            <span>
              <span className="cuando">{fmt(s.fecha)}</span>
              <span className="n" style={{ display: "block" }}>
                Sesión {p.grabados + i + 1}/{p.tracks}{s.tarde ? " · tarde" : ""}
              </span>
            </span>
          </button>
        ))}
      </div>

      {lista.length > 0 ? (
        <div className="acciones" style={{ marginTop: 10 }}>
          <button className="btn sm" onClick={() => onMover(lista[0])}>Mover la próxima sesión</button>
        </div>
      ) : null}
    </div>
  )
}
