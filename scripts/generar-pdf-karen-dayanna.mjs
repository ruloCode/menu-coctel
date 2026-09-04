/**
 * Genera public/press/press-kit-karen-dayanna.pdf desde la vista imprimible
 * /artistas/karen-dayanna/press-kit.
 *
 * Cada <section class="hoja"> es una lamina de 1440x810px — el mismo 16:9 del
 * press kit original de la artista — asi que el PDF sale paginado sin cortes a
 * mitad de parrafo.
 *
 * Necesita el servidor levantado:
 *   npm run dev -- -p 3005
 *   node scripts/generar-pdf-karen-dayanna.mjs [http://localhost:3005]
 *
 * Playwright no es dependencia del proyecto; se resuelve del proyecto si esta
 * y, si no, de donde npx lo haya dejado.
 */
import { fileURLToPath, pathToFileURL } from "node:url"
import { dirname, join } from "node:path"
import { mkdir, readdir, stat } from "node:fs/promises"
import { existsSync } from "node:fs"
import { homedir } from "node:os"

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..")
const origen = process.argv[2] ?? "http://localhost:3005"
const destino = join(raiz, "public", "press", "press-kit-karen-dayanna.pdf")

async function cargarPlaywright() {
  try {
    return await import("playwright")
  } catch {
    const cache = join(homedir(), ".npm", "_npx")
    if (!existsSync(cache)) throw new Error("Instala playwright: npx --yes playwright@1 --version")
    for (const entrada of await readdir(cache)) {
      const candidato = join(cache, entrada, "node_modules", "playwright", "index.mjs")
      if (existsSync(candidato)) return import(pathToFileURL(candidato).href)
    }
    throw new Error("No encontre playwright. Corre: npx --yes playwright@1 --version")
  }
}

/**
 * La version de playwright de la cache de npx no siempre coincide con el build
 * de Chromium descargado, asi que apuntamos al headless shell mas reciente que
 * haya en disco en vez de confiar en el pin.
 */
async function navegadorInstalado() {
  const base = join(homedir(), "Library", "Caches", "ms-playwright")
  if (!existsSync(base)) return undefined
  const builds = (await readdir(base))
    .filter((d) => d.startsWith("chromium_headless_shell-"))
    .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))
  for (const build of builds) {
    const bin = join(base, build, "chrome-headless-shell-mac-arm64", "chrome-headless-shell")
    if (existsSync(bin)) return bin
  }
  return undefined
}

const { chromium } = await cargarPlaywright()
const navegador = await chromium.launch({ executablePath: await navegadorInstalado() })
const pagina = await navegador.newPage({ viewport: { width: 1440, height: 810 } })

const url = `${origen}/artistas/karen-dayanna/press-kit`
// "networkidle" no sirve aqui: en `next dev` el websocket de HMR mantiene la
// red ocupada para siempre y la espera nunca resuelve.
const respuesta = await pagina.goto(url, { waitUntil: "load", timeout: 120000 })
if (!respuesta?.ok()) {
  await navegador.close()
  throw new Error(`${url} respondio ${respuesta?.status()}. Levanta el servidor primero.`)
}

// Sin esperar a que las fotos esten decodificadas el PDF sale con laminas a
// medio pintar. La espera lleva tope: una imagen que nunca resuelve no puede
// dejar el script colgado para siempre.
const pendientes = await pagina.evaluate(async () => {
  await Promise.race([
    Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => new Promise((ok) => { img.onload = img.onerror = ok }))
    ),
    new Promise((ok) => setTimeout(ok, 20000)),
  ])
  await document.fonts.ready
  return Array.from(document.images).filter((img) => !img.complete || img.naturalWidth === 0).length
})
if (pendientes > 0) console.warn(`aviso: ${pendientes} imagen(es) sin cargar`)
await pagina.waitForTimeout(1200)

const laminas = await pagina.locator("section.hoja").count()

await mkdir(join(raiz, "public", "press"), { recursive: true })
await pagina.pdf({
  path: destino,
  width: "1440px",
  height: "810px",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
  preferCSSPageSize: false,
})
await navegador.close()

const { size } = await stat(destino)
console.log(`public/press/press-kit-karen-dayanna.pdf — ${laminas} láminas, ${(size / 1024 / 1024).toFixed(1)} MB`)
