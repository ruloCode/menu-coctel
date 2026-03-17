"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const contactSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electronico valido"),
  telefono: z.string().min(7, "Ingresa un numero de telefono valido"),
  empresa: z.string().optional(),
  asunto: z.enum(["Booking", "Prensa", "Colaboracion", "Otro"], {
    required_error: "Selecciona un asunto",
  }),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Form data:", data)
    toast.success("Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.")
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">
            Nombre *
          </label>
          <Input
            {...register("nombre")}
            placeholder="Tu nombre completo"
            className="bg-zinc-900 border-zinc-700 focus:border-mg-red"
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">
            Email *
          </label>
          <Input
            {...register("email")}
            type="email"
            placeholder="tu@email.com"
            className="bg-zinc-900 border-zinc-700 focus:border-mg-red"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">
            Telefono *
          </label>
          <Input
            {...register("telefono")}
            type="tel"
            placeholder="+57 300 123 4567"
            className="bg-zinc-900 border-zinc-700 focus:border-mg-red"
          />
          {errors.telefono && (
            <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">
            Empresa
          </label>
          <Input
            {...register("empresa")}
            placeholder="Nombre de tu empresa (opcional)"
            className="bg-zinc-900 border-zinc-700 focus:border-mg-red"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">
          Asunto *
        </label>
        <Select onValueChange={(value) => setValue("asunto", value as ContactFormData["asunto"])}>
          <SelectTrigger className="bg-zinc-900 border-zinc-700 focus:border-mg-red">
            <SelectValue placeholder="Selecciona un asunto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Booking">Booking</SelectItem>
            <SelectItem value="Prensa">Prensa</SelectItem>
            <SelectItem value="Colaboracion">Colaboracion</SelectItem>
            <SelectItem value="Otro">Otro</SelectItem>
          </SelectContent>
        </Select>
        {errors.asunto && (
          <p className="text-red-500 text-sm mt-1">{errors.asunto.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wide">
          Mensaje *
        </label>
        <Textarea
          {...register("mensaje")}
          placeholder="Cuentanos sobre tu proyecto o consulta..."
          rows={6}
          className="bg-zinc-900 border-zinc-700 focus:border-mg-red resize-none"
        />
        {errors.mensaje && (
          <p className="text-red-500 text-sm mt-1">{errors.mensaje.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-mg-red hover:bg-red-700 text-white px-10 py-3 rounded-full uppercase font-bold tracking-wide transition-all"
      >
        {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
      </Button>
    </form>
  )
}
