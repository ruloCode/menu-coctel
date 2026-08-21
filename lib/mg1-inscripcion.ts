import { z } from "zod"

export const MG1_EDICION = "mg1-2026"

// Schema compartido cliente/servidor: el cliente valida antes de enviar,
// el route handler vuelve a validar porque nunca se confia en el cliente.
export const inscripcionSchema = z.object({
  nombre_artistico: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre artístico")
    .max(60, "Máximo 60 caracteres"),
  nombre_completo: z
    .string()
    .trim()
    .min(3, "Escribe tu nombre completo")
    .max(80, "Máximo 80 caracteres"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Ingresa un correo válido")
    .max(120, "Máximo 120 caracteres"),
  celular: z
    .string()
    .trim()
    .min(7, "Ingresa un número válido")
    .max(20, "Máximo 20 caracteres")
    .regex(/^[+()\d\s-]+$/, "Solo números, espacios, + y -"),
  ciudad: z
    .string()
    .trim()
    .min(2, "Escribe tu ciudad")
    .max(60, "Máximo 60 caracteres"),
  link_musica: z
    .string()
    .trim()
    .url("Pega un link completo (https://...)")
    .max(300, "Máximo 300 caracteres"),
  por_que: z.string().trim().max(300, "Máximo 300 caracteres").optional().or(z.literal("")),
  acepta_terminos: z.literal(true, {
    errorMap: () => ({ message: "Necesitamos tu autorización para inscribirte" }),
  }),
  // Honeypot: los bots llenan todo, las personas no ven este campo.
  // Se acepta cualquier valor a proposito — el route handler descarta en silencio
  // los envios que lo traen lleno, para no darle al bot señal de que fue detectado.
  website: z.string().optional(),
})

export type InscripcionInput = z.infer<typeof inscripcionSchema>
