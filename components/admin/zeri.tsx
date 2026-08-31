"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { responder, type Propuesta, type Respuesta } from "@/lib/zeri/motor"
import { personaDe, saludo } from "@/lib/zeri/personas"
import { etiquetaRol } from "@/lib/mg/permisos"
import type { Perfil, Snapshot } from "@/lib/mg/tipos"
import { aplicarQuePaso, solicitarCambio } from "@/app/admin/acciones"

type Turno =
  | { de: "zeri"; r: Respuesta; id: number }
  | { de: "yo"; txt: string; id: number }
  | { de: "sistema"; txt: string; ok: boolean; id: number }

export default function Zeri({
  snapshot, yo, puedeOperar,
}: {
  snapshot: Snapshot
  yo: Perfil
  puedeOperar: boolean
}) {
  const persona = personaDe(yo.rol)
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [texto, setTexto] = useState("")
  const [pendiente, arrancar] = useTransition()
  const fondo = useRef<HTMLDivElement>(null)
  const siguienteId = useRef(1)

  // El saludo se monta en el cliente porque la franja horaria depende de la
  // hora local: en el servidor es UTC y en Bogotá saldría "buenas noches" a
  // media tarde.
  useEffect(() => {
    setTurnos([{
      de: "zeri",
      id: 0,
      r: {
        texto: `${saludo(yo.nombre || yo.email)} ${persona.presentacion}`,
        sugerencias: persona.sugerencias,
      },
    }])
  }, [yo.nombre, yo.email, persona])

  useEffect(() => {
    fondo.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [turnos, pendiente])

  const enviar = (entrada: string) => {
    const limpio = entrada.trim()
    if (!limpio) return

    const r = responder(limpio, { snapshot, perfil: yo, puedeOperar })
    setTurnos((t) => [
      ...t,
      { de: "yo", txt: limpio, id: siguienteId.current++ },
      { de: "zeri", r, id: siguienteId.current++ },
    ])
    setTexto("")
  }

  const confirmar = (p: Propuesta) => {
    arrancar(async () => {
      const r = puedeOperar
        ? await aplicarQuePaso(p.proyectoId, p.que, p.dias)
        : await solicitarCambio(p.proyectoId, p.resumen, `Pedido desde Zeri por ${yo.nombre}.`)

      setTurnos((t) => [...t, {
        de: "sistema",
        id: siguienteId.current++,
        ok: r.ok,
        txt: r.ok
          ? puedeOperar
            ? `Hecho: ${p.resumen}. El calendario ya está recalculado.`
            : `Solicitud enviada: ${p.resumen}. Le llegó a quien aprueba cambios de calendario.`
          : r.error ?? "No se pudo aplicar.",
      }])
    })
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Zeri</h1>
          <div className="sub">{persona.foco}</div>
        </div>
        <div className="spacer" />
        <span className="tag outline">{etiquetaRol(yo.rol)}</span>
      </div>

      <div className="card zeri">
        <div className="zeri-hilo">
          {turnos.map((t) =>
            t.de === "yo" ? (
              <div className="zeri-yo" key={t.id}><div className="burbuja">{t.txt}</div></div>
            ) : t.de === "sistema" ? (
              <div className={t.ok ? "zeri-sistema ok" : "zeri-sistema mal"} key={t.id}>
                <span aria-hidden>{t.ok ? "✓" : "⚠"}</span>
                <span>{t.txt}</span>
              </div>
            ) : (
              <div className="zeri-el" key={t.id}>
                <span className="cara" style={{ background: persona.color }} aria-hidden>E</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="burbuja">{t.r.texto}</div>

                  {t.r.detalle?.length ? (
                    <div className="zeri-lista">
                      {t.r.detalle.map((d, i) => (
                        <div className="zeri-item" key={i}>
                          <span className="punto" style={{ background: d.color ?? "var(--muted)" }} aria-hidden />
                          <span className="txt">{d.txt}</span>
                          {d.sub ? <span className="cuando">{d.sub}</span> : null}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {t.r.propuesta ? (
                    <div className="zeri-propuesta">
                      <span className="small">
                        {puedeOperar
                          ? "Esto cambia el calendario de verdad."
                          : "Tu rol no aplica cambios de calendario: esto se envía como solicitud a quien decide."}
                      </span>
                      <button
                        className="btn brand sm"
                        disabled={pendiente}
                        onClick={() => confirmar(t.r.propuesta!)}
                      >
                        {pendiente ? "…" : puedeOperar ? "Aplicar y recalcular" : "Enviar solicitud"}
                      </button>
                    </div>
                  ) : null}

                  {t.r.sugerencias?.length ? (
                    <div className="zeri-sugerencias">
                      {t.r.sugerencias.map((sug) => (
                        <button key={sug} className="btn sm" onClick={() => enviar(sug)}>{sug}</button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ),
          )}
          <div ref={fondo} />
        </div>

        <form
          className="zeri-entrada"
          onSubmit={(e) => { e.preventDefault(); enviar(texto) }}
        >
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Cuéntale a Zeri qué pasó, o pregúntale algo…"
            aria-label="Mensaje para Zeri"
            autoFocus
          />
          <button className="btn brand" type="submit" disabled={!texto.trim()}>Enviar</button>
        </form>
      </div>

      <p className="small muted">
        Zeri funciona <b>dentro de tu navegador</b>: entiende lo que le escribes con reglas, no llamando
        a un modelo. Por eso responde al instante y no consume nada. Cuando no entienda algo, te lo dirá
        en vez de inventar.
      </p>
    </>
  )
}
