"use client"

import { useMemo, useTransition } from "react"
import { D, fmt, hoy, masDias } from "@/lib/mg/fechas"
import { artistaPorId } from "@/lib/mg/motor"
import { colaDeMezcla, faseDe, responsableMezcla, ventanaMezcla, proyectosDeEstudio } from "@/lib/mg/estudio"
import type { Snapshot } from "@/lib/mg/tipos"
import { asignarEvento, marcarEvento } from "@/app/admin/acciones"
import { SelectorPersona } from "./personas"
import { Vacio } from "./ui"

/**
 * Mezcla y máster: qué hay en la mesa y para cuándo.
 *
 * Es la mitad del proceso que antes no existía en el módulo. Al cerrarse la
 * grabación el proyecto simplemente desaparecía de Estudio, y la fecha de
 * entrega del máster quedaba como un hito suelto en el calendario general que
 * nadie miraba hasta que ya se había pasado.
 *
 * La ventana (deadline de grabación → entrega del máster) son 21 días con las
 * reglas por defecto. La barra muestra cuánto de esa ventana se ha consumido:
 * es el dato que dice si hay que preocuparse, mucho mejor que la fecha sola.
 */
export default function EstudioMezcla({
  snapshot, puedeEditar,
}: {
  snapshot: Snapshot
  puedeEditar: boolean
}) {
  const t = hoy()
  const [pendiente, arrancar] = useTransition()
  const cola = useMemo(() => colaDeMezcla(snapshot, t), [snapshot, t])

  // Tener la grabación cerrada no es lo mismo que estar en la mesa. Un tema
  // grabado con cuatro meses de margen está en cola, no en producción: darle
  // una tarjeta igual de grande que a uno vencido entierra lo urgente bajo
  // veinte cosas que no corren prisa.
  const enMesa = useMemo(() => cola.filter((x) => x.v.vencida || x.v.apretada || x.v.restantes <= 30), [cola])
  const enCola = useMemo(() => cola.filter((x) => !enMesa.includes(x)), [cola, enMesa])

  // Lo que va a caer pronto en la mesa. Sin esto, quien mezcla se entera el
  // día que le llega el aviso y no puede reservar tiempo por adelantado.
  const enCamino = useMemo(() => {
    return proyectosDeEstudio(snapshot)
      .filter((p) => p.grabados < p.tracks && faseDe(p) !== "listo")
      .map((p) => ({ p, v: ventanaMezcla(snapshot, p, t), faltan: p.tracks - p.grabados }))
      .filter((x) => x.v.inicio <= masDias(t, 45))
      .sort((a, b) => a.v.inicio.localeCompare(b.v.inicio))
  }, [snapshot, t])

  return (
    <>
      <div className="card">
        <h2>
          En la mesa de mezcla
          <span className="small muted" style={{ fontWeight: 400 }}>
            grabación cerrada y entrega a menos de 30 días · lo más urgente arriba
          </span>
        </h2>

        {enMesa.length === 0 ? (
          <Vacio titulo="Nada esperando mezcla">
            Nada con la entrega a menos de 30 días. Cuando se cierre la última sesión de grabación de
            un proyecto, aparece aquí y le llega un aviso a quien lo mezcla.
          </Vacio>
        ) : (
          <div className="mez-lista">
            {enMesa.map(({ p, v }) => {
              const nm = artistaPorId(snapshot, p.artista_id)?.nombre ?? "?"
              const resp = responsableMezcla(snapshot, p)
              const perfil = snapshot.equipo.find((m) => m.id === resp)
              // Cuánto de la ventana se ha consumido ya.
              const usado = v.dias > 0
                ? Math.max(0, Math.min(100, Math.round(((D(t).getTime() - D(v.inicio).getTime()) / 86400000 / v.dias) * 100)))
                : 100
              const color = v.vencida ? "var(--critical)" : v.apretada ? "var(--warning)" : "var(--c-pre)"

              return (
                <div className={`mez-fila${v.vencida ? " vencida" : ""}`} key={p.id}>
                  <div className="mez-cab">
                    <div style={{ minWidth: 0 }}>
                      <b>{nm} · {p.titulo}</b>
                      <div className="small muted">
                        {p.tracks} {p.tracks === 1 ? "tema grabado" : "temas grabados"} · release {fmt(p.release)}
                      </div>
                    </div>
                    <div className="spacer" />
                    <span className="tag" style={{ background: color }}>
                      {v.vencida
                        ? `Vencida hace ${-v.restantes} d`
                        : v.restantes === 0 ? "Entrega hoy" : `Quedan ${v.restantes} d`}
                    </span>
                  </div>

                  <div className="mez-barra" role="img"
                    aria-label={`Ventana de mezcla de ${v.dias} días, ${usado}% consumido. Entrega ${fmt(v.entrega)}.`}>
                    <i style={{ width: `${usado}%`, background: color }} />
                  </div>
                  <div className="mez-hitos small muted">
                    <span>Tope de grabación · {fmt(v.inicio)}</span>
                    <span className="spacer" />
                    <span>Entrega máster · <b style={{ color: "var(--ink)" }}>{fmt(v.entrega)}</b></span>
                  </div>

                  <div className="mez-pie">
                    <span className="small muted">Mezcla y máster:</span>
                    {puedeEditar ? (
                      <SelectorPersona
                        equipo={snapshot.equipo}
                        valor={resp}
                        etiqueta={`Quién mezcla ${p.titulo}`}
                        disabled={pendiente}
                        onChange={(id) => arrancar(async () => {
                          await asignarEvento(`${p.id}:master`, id, `🎚 Master final · ${nm}`)
                        })}
                      />
                    ) : (
                      <span className="small">{perfil?.nombre ?? "Sin asignar"}</span>
                    )}
                    <div className="spacer" />
                    {puedeEditar ? (
                      <button className="btn sm primary" disabled={pendiente}
                        onClick={() => arrancar(async () => {
                          await marcarEvento(`${p.id}:master`, true, `🎚 Master final · ${nm}`)
                        })}>
                        Máster entregado
                      </button>
                    ) : null}
                  </div>

                  {!resp ? (
                    <p className="small" style={{ color: "var(--warning)", margin: "8px 0 0" }}>
                      Nadie tiene asignada esta mezcla. Sin dueño no arranca.
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {enCola.length > 0 ? (
        <div className="card">
          <h2>
            Grabado y en cola
            <span className="small muted" style={{ fontWeight: 400 }}>
              se puede mezclar ya, pero la entrega está a más de 30 días
            </span>
          </h2>
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr><th>Proyecto</th><th>Temas</th><th>Entrega máster</th><th>Faltan</th><th>Mezcla</th></tr>
              </thead>
              <tbody>
                {enCola.map(({ p, v }) => {
                  const nm = artistaPorId(snapshot, p.artista_id)?.nombre ?? "?"
                  const perfil = snapshot.equipo.find((m) => m.id === responsableMezcla(snapshot, p))
                  return (
                    <tr key={p.id}>
                      <td><b>{nm}</b><br /><span className="small muted">{p.titulo}</span></td>
                      <td className="mono">{p.tracks}</td>
                      <td className="small" style={{ whiteSpace: "nowrap" }}>{fmt(v.entrega)}</td>
                      <td className="mono small">{v.restantes} d</td>
                      <td className="small">{perfil?.nombre ?? <span className="muted">sin asignar</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="card">
        <h2>
          En camino
          <span className="small muted" style={{ fontWeight: 400 }}>
            grabación abierta con el tope a menos de 45 días
          </span>
        </h2>
        {enCamino.length === 0 ? (
          <Vacio titulo="Nada entrando a la mesa en el próximo mes y medio" />
        ) : (
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr>
                  <th>Proyecto</th><th>Faltan</th><th>Tope grabación</th>
                  <th>Entrega máster</th><th>Ventana</th><th>Mezcla</th>
                </tr>
              </thead>
              <tbody>
                {enCamino.map(({ p, v, faltan }) => {
                  const nm = artistaPorId(snapshot, p.artista_id)?.nombre ?? "?"
                  const perfil = snapshot.equipo.find((m) => m.id === responsableMezcla(snapshot, p))
                  return (
                    <tr key={p.id}>
                      <td><b>{nm}</b><br /><span className="small muted">{p.titulo}</span></td>
                      <td className="mono">{faltan} de {p.tracks}</td>
                      <td className="small" style={{ whiteSpace: "nowrap" }}>{fmt(v.inicio)}</td>
                      <td className="small" style={{ whiteSpace: "nowrap" }}>{fmt(v.entrega)}</td>
                      <td className="mono small">{v.dias} d</td>
                      <td className="small">{perfil?.nombre ?? <span className="muted">sin asignar</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
