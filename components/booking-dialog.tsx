"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const bookingSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre"),
  telefono: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,15}$/, "Ingresa un teléfono válido"),
  correo: z.string().trim().email("Ingresa un correo válido"),
})

type BookingValues = z.infer<typeof bookingSchema>

type RequestIntent = "booking" | "press-kit"

interface BookingDialogProps {
  artistName: string
  /** Qué se solicita: booking (default) o kit de prensa */
  intent?: RequestIntent
  /** Trigger element (button) rendered by the parent */
  children: React.ReactNode
}

const INTENT_COPY: Record<
  RequestIntent,
  { kicker: string; title: string; tag: string; successBody: string }
> = {
  booking: {
    kicker: "[ Booking ]",
    title: "Solicitar booking",
    tag: "Booking",
    successBody:
      "Recibimos tus datos. El equipo de MG Company te contactará muy pronto para coordinar fechas y condiciones.",
  },
  "press-kit": {
    kicker: "[ Prensa ]",
    title: "Kit de prensa",
    tag: "Kit de prensa",
    successBody:
      "Recibimos tus datos. Te enviaremos el kit de prensa — biografías y fotos en alta resolución — al correo registrado.",
  },
}

const inputClass =
  "w-full border-0 border-b border-white/20 bg-transparent py-2.5 text-base text-white placeholder:text-white/25 transition-colors focus:border-mg-red focus:outline-none"

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
        {label}
      </label>
      {children}
      <p
        role="alert"
        className={`mt-1.5 min-h-[16px] font-mono text-[10px] uppercase tracking-[0.15em] text-mg-red ${error ? "opacity-100" : "opacity-0"}`}
      >
        {error ?? ""}
      </p>
    </div>
  )
}

export default function BookingDialog({
  artistName,
  intent = "booking",
  children,
}: BookingDialogProps) {
  const copy = INTENT_COPY[intent]
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"form" | "sending" | "success">("form")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
  })

  const onSubmit = async (_values: BookingValues) => {
    setStatus("sending")
    // Envío simulado — conectar aquí el endpoint real (Supabase / email) cuando exista
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setStatus("success")
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      // Reset after the close animation so reopening starts fresh
      setTimeout(() => {
        setStatus("form")
        reset()
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md border-white/15 bg-mg-black p-0 sm:rounded-none">
        <AnimatePresence mode="wait" initial={false}>
          {status !== "success" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="p-7 md:p-8"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-mg-red">
                  {copy.kicker}
                </span>
                <span className="h-px flex-1 bg-mg-red/40" />
              </div>
              <DialogTitle className="font-heading text-3xl font-normal uppercase leading-none tracking-tight text-white md:text-4xl">
                {copy.title}
              </DialogTitle>
              <DialogDescription className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                {artistName} · Te contactamos en 48h
              </DialogDescription>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
                <Field label="Nombre" error={errors.nombre?.message}>
                  <input
                    {...register("nombre")}
                    type="text"
                    placeholder="Tu nombre completo"
                    autoComplete="name"
                    className={inputClass}
                  />
                </Field>

                <Field label="Teléfono" error={errors.telefono?.message}>
                  <input
                    {...register("telefono")}
                    type="tel"
                    placeholder="+57 300 000 0000"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </Field>

                <Field label="Correo" error={errors.correo?.message}>
                  <input
                    {...register("correo")}
                    type="email"
                    placeholder="tu@correo.com"
                    autoComplete="email"
                    className={inputClass}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-2 flex w-full items-center justify-center gap-3 bg-mg-red px-6 py-4 font-mono text-xs font-medium uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:bg-white hover:text-mg-black disabled:pointer-events-none disabled:opacity-80"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    "Enviar solicitud"
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center p-8 py-10 text-center md:p-10"
            >
              <motion.svg
                width="92"
                height="92"
                viewBox="0 0 92 92"
                fill="none"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <motion.circle
                  cx="46"
                  cy="46"
                  r="42"
                  stroke="#E8200C"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
                <motion.path
                  d="M30 47.5 L41.5 59 L63 34"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="square"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, delay: 0.45, ease: "easeOut" }}
                />
              </motion.svg>

              <DialogTitle className="mt-6 font-heading text-4xl font-normal uppercase leading-none tracking-tight text-white">
                Solicitud registrada
              </DialogTitle>
              <DialogDescription className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mg-red">
                {copy.tag} · {artistName}
              </DialogDescription>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
                {copy.successBody}
              </p>

              <button
                onClick={() => handleOpenChange(false)}
                className="mt-8 inline-flex items-center gap-3 border border-white/40 px-8 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:border-mg-red hover:bg-mg-red"
              >
                Listo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
