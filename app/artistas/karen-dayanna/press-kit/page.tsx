import Image from "next/image"

import {
  BIOGRAFIA,
  CIFRAS,
  CORREO,
  FICHA,
  NOTA_EN_VIVO,
  NOTA_ESCENARIO,
  NOTA_PLATAFORMAS,
  RIDER,
  SENCILLOS,
} from "../datos"

import "./impresion.css"

export const metadata = {
  title: "Press Kit · Karen Dayanna | MG Company Group",
  description:
    "Versión imprimible del press kit de Karen Dayanna: biografía, discografía, rider técnico, fotografía, audiencia y contacto.",
  // Es una vista de servicio para generar el PDF, no una pagina de destino.
  robots: { index: false, follow: false },
}

const LAMINAS = ["01", "02", "03", "04", "05", "06"]

function PieHoja({ n }: { n: number }) {
  return (
    <div className="pie-hoja">
      <span>Karen Dayanna · Press Kit</span>
      <span>MG Company Group</span>
      <span>
        {LAMINAS[n - 1]} / {String(LAMINAS.length).padStart(2, "0")}
      </span>
    </div>
  )
}

function Chevrones({ color = "rgba(255,255,255,0.55)" }: { color?: string }) {
  return (
    <svg width="30" height="64" viewBox="0 0 34 72" fill="none" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M4 ${6 + i * 22} L17 ${20 + i * 22} L30 ${6 + i * 22}`}
          stroke={color}
          strokeWidth="7"
          strokeLinecap="square"
          opacity={0.4 + i * 0.3}
        />
      ))}
    </svg>
  )
}

export default function PressKitImprimible() {
  return (
    <div className="pliego kd">
      {/* ── Portada ─────────────────────────────────────────────────────── */}
      <section className="hoja">
        <Image
          src="/artists/karen-dayanna/kd-sesion-cuarto.jpg"
          alt=""
          fill
          priority
          sizes="1440px"
          className="object-cover object-[58%_45%]"
        />
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,5,9,0.94) 0%, rgba(5,5,9,0.55) 46%, rgba(5,5,9,0.25) 100%), radial-gradient(ellipse 45% 50% at 8% 100%, rgba(167,139,250,0.28) 0%, transparent 62%)",
          }}
        />
        <div className="hoja-pad">
          <div className="flex items-center gap-4">
            <Image src="/logo-mg.png" alt="" width={34} height={34} className="object-contain" />
            <span className="font-mono text-[13px] uppercase tracking-[0.3em] text-white/85">
              MG Company Group
            </span>
          </div>

          <div className="mt-auto">
            <p className="rotulo mb-6 max-w-[540px]">Press Kit · 2026</p>
            <h1 className="titulo-lamina text-[126px]">
              Karen
              <br />
              Dayanna
            </h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/artists/karen-dayanna/firma.svg"
              alt="Firma de Karen Dayanna"
              className="mt-7 w-[400px] opacity-80"
            />
            <p className="cuerpo mt-8 max-w-[620px] text-[25px] leading-relaxed text-white/88">
              Canciones sobre la memoria y todo lo que perdura. En vivo, mucho
              más que un show: un encuentro.
            </p>
          </div>
        </div>
        <PieHoja n={1} />
      </section>

      {/* ── 01 Biografía ────────────────────────────────────────────────── */}
      <section className="hoja">
        <Image
          src="/artists/karen-dayanna/tex-papel.jpg"
          alt=""
          fill
          sizes="1440px"
          loading="eager"
          className="object-cover opacity-40"
        />
        <div className="hoja-pad">
          <p className="rotulo">01 / Biografía</p>

          <div className="mt-12 grid flex-1 grid-cols-[46px_1fr_360px] gap-x-14">
            <div className="pt-2">
              <Chevrones />
            </div>

            <div className="cuerpo space-y-6 pr-6 text-[26px] leading-[1.45] text-white/92">
              {BIOGRAFIA.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div>
              <div className="rounded-2xl border border-white/18 bg-white/[0.03] p-7">
                <p className="cuerpo text-[20px] leading-relaxed text-white/88">
                  {NOTA_ESCENARIO}
                </p>
              </div>
              <dl className="mt-8">
                {FICHA.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-5 border-b border-white/12 py-[13px]"
                  >
                    <dt className="etiqueta text-white/45">{k}</dt>
                    <dd className="dato text-right text-[15px] leading-snug text-white/88">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        <PieHoja n={2} />
      </section>

      {/* ── 02 Discografía ──────────────────────────────────────────────── */}
      <section className="hoja">
        <div className="hoja-pad">
          <p className="rotulo">02 / Discografía · Pistas y videos</p>

          <div className="mt-11 grid flex-1 grid-cols-2 gap-16">
            {SENCILLOS.map((s) => (
              <article key={s.titulo}>
                <div className="flex items-start gap-7">
                  <div className="relative h-[224px] w-[224px] shrink-0 overflow-hidden rounded-2xl border border-white/12">
                    <Image src={s.cover} alt="" fill sizes="224px" loading="eager" className="object-cover" />
                  </div>
                  <div className="pt-1">
                    <span className="pastilla etiqueta text-white/75">
                      {s.orden}
                    </span>
                    <h2 className="titulo-lamina mt-5 text-[52px]">{s.titulo}</h2>
                  </div>
                </div>
                <p className="cuerpo mt-7 text-[20px] leading-[1.5] text-white/85">{s.texto}</p>
                <p className="mt-5 etiqueta text-[#a78bfa]">
                  Spotify · {s.enlace.replace("https://", "")}
                </p>
              </article>
            ))}
          </div>
        </div>
        <PieHoja n={3} />
      </section>

      {/* ── 03 Rider técnico ────────────────────────────────────────────── */}
      <section className="hoja">
        <Image
          src="/artists/karen-dayanna/kd-live-sala.jpg"
          alt=""
          fill
          sizes="1440px"
          loading="eager"
          className="object-cover opacity-25"
        />
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,5,9,0.92) 0%, rgba(5,5,9,0.86) 55%, #050509 100%)",
          }}
        />
        <div className="hoja-pad">
          <p className="rotulo">03 / Rider técnico</p>

          <div className="mt-11 grid flex-1 grid-cols-[1fr_1.25fr] gap-16">
            <div>
              <h2 className="titulo-lamina text-[74px]">
                Mucho
                <br />
                más que
                <br />
                un show
              </h2>
              <p className="cuerpo mt-8 text-[20px] leading-[1.55] text-white/85">
                {NOTA_EN_VIVO}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-9 pt-2">
              {RIDER.map((b) => (
                <div key={b.titulo}>
                  <span className="pastilla cuerpo text-[18px] text-white/92">{b.titulo}</span>
                  <ul className="mt-5 space-y-[11px]">
                    {b.puntos.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span className="mt-[5px] font-mono text-[11px] leading-none text-[#a78bfa]">
                          +
                        </span>
                        <span className="dato text-[15px] leading-[1.5] text-white/88">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <PieHoja n={4} />
      </section>

      {/* ── 04 Fotografía ───────────────────────────────────────────────── */}
      <section className="hoja">
        <div className="hoja-pad">
          <p className="rotulo">04 / Fotografía</p>

          <div className="mt-9 flex flex-1 gap-6">
            <div className="flex w-[300px] shrink-0 flex-col">
              <h2 className="titulo-lamina text-[76px]">Foto&shy;grafía</h2>
              <p className="cuerpo mt-6 text-[18px] leading-relaxed text-white/78">
                Fotografías oficiales disponibles para prensa, festivales y
                promotores. El paquete completo en alta resolución se entrega
                bajo solicitud.
              </p>
              <div className="mt-auto pb-2">
                <Chevrones />
              </div>
            </div>

            <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-5">
              {[
                { src: "/artists/karen-dayanna/kd-portrait.jpg", pos: "object-[center_15%]", span: "row-span-2" },
                { src: "/artists/karen-dayanna/kd-closeup.jpg", pos: "object-[center_25%]", span: "" },
                { src: "/artists/karen-dayanna/kd-blazer.jpg", pos: "object-[center_20%]", span: "row-span-2" },
                { src: "/artists/karen-dayanna/kd-live-sala.jpg", pos: "object-[center_45%]", span: "" },
              ].map((f) => (
                <div
                  key={f.src}
                  className={`relative overflow-hidden rounded-xl border border-white/10 ${f.span}`}
                >
                  <Image
                    src={f.src}
                    alt=""
                    fill
                    sizes="330px"
                    loading="eager"
                    className={`object-cover ${f.pos}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <PieHoja n={5} />
      </section>

      {/* ── 05 + 06 Audiencia y contacto ────────────────────────────────── */}
      <section className="hoja">
        <Image
          src="/artists/karen-dayanna/tex-cielo.jpg"
          alt=""
          fill
          sizes="1440px"
          loading="eager"
          className="object-cover opacity-35"
        />
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(90deg, #050509 0%, rgba(5,5,9,0.92) 55%, rgba(5,5,9,0.78) 100%), radial-gradient(ellipse 45% 55% at 92% 100%, rgba(232,32,12,0.16) 0%, transparent 62%)",
          }}
        />
        <div className="hoja-pad">
          <p className="rotulo">05 / Plataformas &amp; audiencia · 06 / Bookings</p>

          <div className="mt-10 grid grid-cols-[1fr_1fr] gap-16">
            <div>
              <p className="cuerpo text-[21px] leading-[1.5] text-white/88">
                {NOTA_PLATAFORMAS}
              </p>
              <div className="mt-9 space-y-6">
                {CIFRAS.map((c) => (
                  <div key={c.etiqueta} className="border-t border-white/14 pt-4">
                    <p className="dato text-[13px] text-white/60">{c.fuentes}</p>
                    <p className="titulo-lamina mt-2 flex items-baseline gap-2 text-[54px]">
                      <span className="text-[0.42em] text-[#a78bfa]">↗</span>
                      {c.valor.toLocaleString("es-CO", {
                        minimumFractionDigits: c.decimales ?? 0,
                        maximumFractionDigits: c.decimales ?? 0,
                      })}
                      <span className="text-[#a78bfa]">{c.sufijo}</span>
                      <span className="etiqueta ml-3 text-white/65">
                        {c.etiqueta}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="titulo-lamina text-[60px]">
                Para contrataciones,
                <br />
                colaboración
                <br />y eventos
              </h2>
              <p className="cuerpo mt-6 text-[19px] leading-relaxed text-white/82">
                Posibilidades de movilidad nacional e internacional.
              </p>

              <dl className="mt-8 space-y-[15px]">
                {[
                  ["Correo", CORREO],
                  ["Instagram", "@dakaq.r"],
                  ["Spotify", "Karen Dayanna"],
                  ["Ubicación", "Bogotá, Colombia"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-6 border-b border-white/12 pb-3">
                    <dt className="etiqueta w-[112px] shrink-0 text-white/45">{k}</dt>
                    <dd className="dato text-[16px] text-white/92">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/artists/karen-dayanna/firma.svg"
                alt="Firma de Karen Dayanna"
                className="mt-auto w-[300px] self-end opacity-55"
              />
            </div>
          </div>
        </div>
        <PieHoja n={6} />
      </section>
    </div>
  )
}
