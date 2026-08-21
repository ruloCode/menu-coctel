import { appendFile, mkdir } from "fs/promises"
import { join } from "path"
import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { MG1_EDICION, inscripcionSchema } from "@/lib/mg1-inscripcion"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Codigo de Postgres para violacion de unique constraint
const PG_UNIQUE_VIOLATION = "23505"

// Fallback de desarrollo: si aun no hay credenciales de Supabase, las
// inscripciones caen en un .jsonl local para poder probar el flujo completo.
// En produccion nunca se usa: se responde 503 antes de perder datos.
const DEV_STORE = join(process.cwd(), ".data", "mg1-inscripciones.jsonl")

async function saveToDevFile(row: Record<string, unknown>) {
  await mkdir(join(process.cwd(), ".data"), { recursive: true })
  await appendFile(DEV_STORE, `${JSON.stringify(row)}\n`, "utf8")
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const parsed = inscripcionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Revisa los datos del formulario",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const { website, ...data } = parsed.data

  // Honeypot lleno -> bot. Respondemos 200 para no darle señal.
  if (website) {
    return NextResponse.json({ ok: true })
  }

  const row = {
    ...data,
    por_que: data.por_que || null,
    edicion: MG1_EDICION,
    origen: request.headers.get("referer"),
    user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
  }

  const supabase = getSupabaseAdmin()

  if (!supabase) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[mg1/inscripcion] Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY: inscripcion NO guardada",
        { email: row.email },
      )
      return NextResponse.json(
        { error: "El registro no está disponible en este momento. Escríbenos por WhatsApp." },
        { status: 503 },
      )
    }

    await saveToDevFile({ ...row, created_at: new Date().toISOString() })
    console.warn(`[mg1/inscripcion] Supabase sin configurar — guardado en ${DEV_STORE}`)
    return NextResponse.json({ ok: true, storage: "dev-file" })
  }

  const { error } = await supabase.from("mg1_inscripciones").insert(row)

  if (error) {
    if (error.code === PG_UNIQUE_VIOLATION) {
      return NextResponse.json(
        { error: "Ese correo ya está inscrito en MG1. ¡Ya estás dentro!" },
        { status: 409 },
      )
    }
    console.error("[mg1/inscripcion] Error de Supabase:", error)
    return NextResponse.json(
      { error: "No pudimos guardar tu inscripción. Intenta de nuevo en un momento." },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true, storage: "supabase" })
}
