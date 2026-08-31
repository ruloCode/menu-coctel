/**
 * Número listo para un link de wa.me: solo dígitos, con indicativo.
 *
 * Casi todo el mundo escribe el celular en formato local colombiano (10
 * dígitos que empiezan por 3), así que ese caso se completa con el 57. Si ya
 * trae indicativo se respeta tal cual. Un fijo o un número que no cuadra
 * devuelve null y la interfaz simplemente no ofrece el link, en vez de armar
 * uno roto que abra un chat con un desconocido.
 */
export function whatsapp(celular: string | null | undefined): string | null {
  const d = (celular ?? "").replace(/\D/g, "")
  if (d.length === 10 && d.startsWith("3")) return `57${d}`
  if (d.length >= 11 && d.length <= 15) return d
  return null
}
