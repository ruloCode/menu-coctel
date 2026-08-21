"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import DiagonalArrow from "@/components/diagonal-arrow"
import VinylDisc from "@/components/mg1/vinyl-disc"
import { inscripcionSchema, type InscripcionInput } from "@/lib/mg1-inscripcion"

const FIELDS = [
  {
    name: "nombre_artistico",
    label: "Nombre artístico *",
    placeholder: "¿Cómo te conocen en la escena?",
    autoComplete: "nickname",
  },
  {
    name: "nombre_completo",
    label: "Nombre completo *",
    placeholder: "Tu nombre real",
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Correo *",
    placeholder: "tu@correo.com",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "celular",
    label: "Celular / WhatsApp *",
    placeholder: "+57 300 123 4567",
    type: "tel",
    autoComplete: "tel",
  },
  {
    name: "ciudad",
    label: "Ciudad *",
    placeholder: "Bogotá",
    autoComplete: "address-level2",
  },
  {
    name: "link_musica",
    label: "Link a tu música *",
    placeholder: "YouTube, Spotify, SoundCloud o Instagram",
    type: "url",
    autoComplete: "url",
  },
] as const satisfies readonly {
  name: keyof InscripcionInput
  label: string
  placeholder: string
  type?: string
  autoComplete?: string
}[]

const inputClass =
  "w-full border-2 border-white/15 bg-white/[0.03] px-4 py-3 text-[15px] text-white " +
  "placeholder:text-zinc-500 transition-colors focus:border-mg-red focus:outline-none " +
  "focus:ring-1 focus:ring-mg-red disabled:opacity-60"

const labelClass =
  "mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400"

export default function InscripcionForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InscripcionInput>({
    resolver: zodResolver(inscripcionSchema),
    defaultValues: { acepta_terminos: true },
  })

  const onSubmit = async (data: InscripcionInput) => {
    setServerError(null)
    try {
      const res = await fetch("/api/mg1/inscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const payload = await res.json().catch(() => ({}))

      if (!res.ok) {
        setServerError(payload.error ?? "No pudimos enviar tu inscripción. Intenta de nuevo.")
        return
      }
      setEnviado(true)
    } catch {
      setServerError("Revisa tu conexión e intenta de nuevo.")
    }
  }

  if (enviado) {
    return (
      <div
        className="flex max-w-2xl flex-col items-center gap-6 border-l-4 border-mg-red bg-white/[0.03] p-8 text-center md:flex-row md:p-10 md:text-left"
        role="status"
      >
        <div className="w-28 shrink-0 [filter:drop-shadow(0_0_26px_rgba(232,32,12,0.55))]">
          <VinylDisc tier="ruby" spinDuration={8} />
        </div>
        <div>
          <p className="font-heading text-3xl uppercase tracking-wide text-mg-red md:text-4xl">
            Inscripción recibida
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-zinc-300">
            Ya estás en la lista de la primera edición. El crew de MG escucha todo lo que
            llega — si quedas entre los <b className="text-white">12 del show</b>, te
            escribimos al correo y al WhatsApp con el beat y las fechas de rodaje.
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
            #ConcursoMG1 · Bogotá
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-2xl">
      <div className="grid gap-5 md:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name} className={field.name === "link_musica" ? "md:col-span-2" : ""}>
            <label className={labelClass} htmlFor={field.name}>
              {field.label}
            </label>
            <input
              id={field.name}
              type={"type" in field ? field.type : "text"}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              aria-invalid={errors[field.name] ? true : undefined}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              className={inputClass}
              disabled={isSubmitting}
              {...register(field.name)}
            />
            {errors[field.name] && (
              <p id={`${field.name}-error`} className="mt-1.5 text-sm text-mg-red-bright">
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}

        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="por_que">
            ¿Por qué tú? (opcional)
          </label>
          <textarea
            id="por_que"
            rows={3}
            maxLength={300}
            placeholder="En una o dos frases: ¿por qué mereces el Disco Ruby?"
            className={`${inputClass} resize-none`}
            disabled={isSubmitting}
            {...register("por_que")}
          />
          {errors.por_que && (
            <p className="mt-1.5 text-sm text-mg-red-bright">{errors.por_que.message}</p>
          )}
        </div>
      </div>

      {/* Honeypot anti-bots: oculto para personas, invisible para lectores de pantalla */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">No llenar</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <label className="mt-7 flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-zinc-400">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 accent-mg-red"
          disabled={isSubmitting}
          {...register("acepta_terminos")}
        />
        <span>
          Autorizo el tratamiento de mis datos por MG Company para la gestión del Concurso
          MG1 (Ley 1581 de 2012) y acepto las reglas del concurso.
        </span>
      </label>
      {errors.acepta_terminos && (
        <p className="mt-1.5 text-sm text-mg-red-bright">{errors.acepta_terminos.message}</p>
      )}

      {serverError && (
        <p
          role="alert"
          className="mt-6 border-l-4 border-mg-red bg-mg-red/10 px-4 py-3 text-sm text-mg-red-bright"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group mt-8 inline-flex w-full items-center justify-center gap-4 border-2 border-mg-red bg-mg-red px-8 py-5 transition-colors duration-300 hover:bg-transparent hover:text-mg-red-bright disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] md:text-sm">
          {isSubmitting ? "Enviando…" : "Enviar mi inscripción"}
        </span>
        {!isSubmitting && (
          <DiagonalArrow
            size={22}
            strokeWidth={1.75}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        )}
      </button>

      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        Inscripción gratuita · Solo 12 llegan al show
      </p>
    </form>
  )
}
