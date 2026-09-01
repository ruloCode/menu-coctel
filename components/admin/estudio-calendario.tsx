"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { D, DIAS, MESES, iso, masDias, hoy } from "@/lib/mg/fechas"
import { artistaPorId, proyectoPorId } from "@/lib/mg/motor"
import { capacidadDe, cargaPorDia, motivoBloqueo } from "@/lib/mg/estudio"
import type { Evento, Snapshot } from "@/lib/mg/tipos"
import { moverEvento } from "@/app/admin/acciones"

/**
 * Calendario de sesiones de grabación.
 *
 * Se puede mover una sesión a cualquier día, incluso a uno en que el estudio
 * no abre o que ya está lleno. Es deliberado: el motor propone y la persona
 * dispone — bloquear el arrastre obligaría a pelearse con las reglas justo
 * cuando hay que romperlas. Lo que sí hace la vista es marcar el conflicto,
 * para que moverlo sea una decisión y no un descuido.
 *
 * Todo lo que se puede hacer arrastrando se puede hacer con el teclado:
 * Espacio levanta la sesión, las flechas la mueven, Enter confirma, Esc
 * cancela. Un calendario que solo responde al ratón deja fuera a quien navega
 * con teclado y es, además, imposible de usar bien en una pantalla táctil.
 */
export default function EstudioCalendario({
  snapshot, sesiones, puedeEditar, onAbrir,
}: {
  snapshot: Snapshot
  sesiones: Evento[]
  puedeEditar: boolean
  onAbrir: (e: Evento) => void
}) {
  const t = hoy()
  // Abre en el mes de la primera sesión, no en el de hoy. A fin de mes, "hoy"
  // enseña una rejilla vacía mientras todo el trabajo está en la página
  // siguiente, y obliga a un clic antes de ver nada.
  const [ancla, setAncla] = useState(() => {
    const primera = sesiones.map((e) => e.fecha).sort()[0]
    return (primera && primera > t ? primera : t).slice(0, 7) + "-01"
  })
  const [arrastrada, setArrastrada] = useState<string | null>(null)
  const [sobre, setSobre] = useState<string | null>(null)
  const [agarrada, setAgarrada] = useState<{ id: string; destino: string } | null>(null)
  const [aviso, setAviso] = useState("")
  const [, arrancar] = useTransition()
  const rejilla = useRef<HTMLDivElement>(null)

  const carga = useMemo(() => cargaPorDia(sesiones), [sesiones])

  const porDia = useMemo(() => {
    const m: Record<string, Evento[]> = {}
    sesiones.forEach((e) => { (m[e.fecha] ||= []).push(e) })
    return m
  }, [sesiones])

  // Los deadlines de grabación y las entregas de máster se pintan como marcas,
  // no como fichas: no se arrastran, pero son contra lo que se está moviendo.
  const hitos = useMemo(() => {
    const m: Record<string, { txt: string; color: string }[]> = {}
    snapshot.proyectos.forEach((p) => {
      if (p.estado === "pausado" || p.estado === "lanzado") return
      const nm = artistaPorId(snapshot, p.artista_id)?.nombre ?? "?"
      const rec = snapshot.eventosEstado[`${p.id}:recDeadline`]?.fecha_override
        ?? masDias(p.release, -snapshot.config.reglas.recordingDone)
      const mas = snapshot.eventosEstado[`${p.id}:master`]?.fecha_override
        ?? masDias(p.release, -snapshot.config.reglas.masterFinal)
      if (p.grabados < p.tracks) (m[rec] ||= []).push({ txt: `Tope grabación · ${nm}`, color: "var(--critical)" })
      ;(m[mas] ||= []).push({ txt: `Entrega máster · ${nm}`, color: "var(--c-hito)" })
    })
    return m
  }, [snapshot])

  const celdas = useMemo(() => {
    const primero = D(ancla)
    // La rejilla empieza en lunes: el estudio no abre domingo, así que abrir
    // la semana en domingo desperdiciaría la primera columna.
    const desfase = (primero.getDay() + 6) % 7
    const arranque = iso(new Date(primero.getFullYear(), primero.getMonth(), 1 - desfase, 12))
    return Array.from({ length: 42 }, (_, i) => masDias(arranque, i))
  }, [ancla])

  const mesActual = D(ancla).getMonth()

  const mover = (id: string, fecha: string) => {
    const ev = sesiones.find((e) => e.id === id)
    if (!ev || ev.fecha === fecha) return
    arrancar(async () => { await moverEvento(id, fecha, ev.etiqueta) })
  }

  /* ---------- teclado ---------- */
  const alTeclear = (e: React.KeyboardEvent, ev: Evento) => {
    if (!puedeEditar) return
    const activa = agarrada?.id === ev.id

    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault()
      if (activa) {
        mover(ev.id, agarrada.destino)
        setAviso(`${ev.etiqueta} movida al ${textoFecha(agarrada.destino)}.`)
        setAgarrada(null)
      } else {
        setAgarrada({ id: ev.id, destino: ev.fecha })
        setAviso(`Sesión levantada. Usa las flechas para elegir día, Enter para confirmar, Escape para cancelar.`)
      }
      return
    }
    if (!activa) return

    if (e.key === "Escape") {
      e.preventDefault(); setAgarrada(null); setAviso("Movimiento cancelado."); return
    }
    if (e.key === "Enter") {
      e.preventDefault()
      mover(ev.id, agarrada.destino)
      setAviso(`${ev.etiqueta} movida al ${textoFecha(agarrada.destino)}.`)
      setAgarrada(null)
      return
    }
    const saltos: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (saltos[e.key] !== undefined) {
      e.preventDefault()
      const destino = masDias(agarrada.destino, saltos[e.key])
      setAgarrada({ id: ev.id, destino })
      const bloqueo = motivoBloqueo(snapshot, destino, carga)
      setAviso(`${textoFecha(destino)}${bloqueo ? ` — ojo: ${bloqueo.toLowerCase()}` : " — libre"}.`)
    }
  }

  useEffect(() => { if (!puedeEditar) setAgarrada(null) }, [puedeEditar])

  return (
    <div className="card">
      <div className="cal-nav">
        <h2 style={{ margin: 0 }}>
          {MESES[mesActual][0].toUpperCase() + MESES[mesActual].slice(1)} {D(ancla).getFullYear()}
        </h2>
        <div className="spacer" />
        <button className="btn sm" onClick={() => setAncla(mesAnterior(ancla))} aria-label="Mes anterior">←</button>
        <button className="btn sm" onClick={() => setAncla(t.slice(0, 7) + "-01")}>Hoy</button>
        <button className="btn sm" onClick={() => setAncla(mesSiguiente(ancla))} aria-label="Mes siguiente">→</button>
      </div>

      {puedeEditar ? (
        <p className="small muted" style={{ marginBottom: 8 }}>
          Arrastra una sesión a otro día, o enfócala con Tab y pulsa Espacio para moverla con las flechas.
          Se puede soltar en cualquier día: si el estudio no abre o ya está lleno, la vista lo marca en vez de impedirlo.
        </p>
      ) : null}

      <div className="cal-dias">
        {DIAS.slice(1).concat(DIAS[0]).map((d) => <span key={d}>{d}</span>)}
      </div>

      <div className="cal-rejilla" ref={rejilla}>
        {celdas.map((f) => {
          const cap = capacidadDe(snapshot, f, carga)
          const lista = porDia[f] ?? []
          const marcas = hitos[f] ?? []
          const fuera = D(f).getMonth() !== mesActual
          const destino = agarrada?.destino === f

          const clases = ["cal-d"]
          if (fuera) clases.push("fuera")
          if (f === t) clases.push("hoy")
          if (!cap.esDiaSesion) clases.push("cerrado")
          if (cap.excedido) clases.push("excedido")
          if (sobre === f || destino) clases.push("destino")

          return (
            <div
              key={f}
              className={clases.join(" ")}
              onDragOver={(e) => { if (arrastrada) { e.preventDefault(); setSobre(f) } }}
              onDragLeave={() => setSobre((s) => (s === f ? null : s))}
              onDrop={(e) => {
                e.preventDefault()
                if (arrastrada) mover(arrastrada, f)
                setArrastrada(null); setSobre(null)
              }}
            >
              <div className="cal-cab">
                <span className="n">{D(f).getDate()}</span>
                {cap.esDiaSesion ? (
                  <span className={cap.excedido ? "cap malo" : cap.lleno ? "cap lleno" : "cap"}
                    title={`${cap.usados} de ${cap.tope} bloques`}>
                    {cap.usados}/{cap.tope}
                  </span>
                ) : null}
              </div>

              {marcas.map((m, i) => (
                <span className="cal-marca" key={i} style={{ borderLeftColor: m.color }} title={m.txt}>{m.txt}</span>
              ))}

              {lista.map((ev) => {
                const p = proyectoPorId(snapshot, ev.proyecto_id)
                const nm = p ? artistaPorId(snapshot, p.artista_id)?.nombre ?? "?" : "?"
                const levantada = agarrada?.id === ev.id
                return (
                  <button
                    key={ev.id}
                    className={`cal-ses${ev.tarde ? " tarde" : ""}${levantada ? " levantada" : ""}`}
                    draggable={puedeEditar}
                    onDragStart={() => setArrastrada(ev.id)}
                    onDragEnd={() => { setArrastrada(null); setSobre(null) }}
                    onClick={() => onAbrir(ev)}
                    onKeyDown={(e) => alTeclear(e, ev)}
                    aria-label={`${ev.etiqueta}, ${textoFecha(ev.fecha)}${ev.tarde ? ", después del deadline" : ""}. Espacio para mover.`}
                    title={ev.etiqueta}
                  >
                    {nm}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      <p className="sr-live" role="status" aria-live="polite">{aviso}</p>

      <div className="legend" style={{ marginTop: 12, marginBottom: 0 }}>
        <span><i style={{ background: "var(--c-sesion)" }} />Sesión agendada</span>
        <span><i style={{ background: "var(--critical)" }} />Después del deadline</span>
        <span><i style={{ background: "var(--c-hito)" }} />Entrega de máster</span>
        <span><i style={{ background: "var(--grid)" }} />El estudio no abre</span>
      </div>
    </div>
  )
}

const textoFecha = (f: string) => `${DIAS[D(f).getDay()]} ${D(f).getDate()} de ${MESES[D(f).getMonth()]}`
const mesAnterior = (a: string) => { const d = D(a); return iso(new Date(d.getFullYear(), d.getMonth() - 1, 1, 12)) }
const mesSiguiente = (a: string) => { const d = D(a); return iso(new Date(d.getFullYear(), d.getMonth() + 1, 1, 12)) }
