/**
 * Genera public/og/og-karen-dayanna.jpg (1200x630).
 *
 * Sigue el sistema de las tarjetas OG que ya existen en public/og — marca MG
 * arriba, kicker entre corchetes, nombre en Bebas, pie con el dominio — pero
 * cambia el resplandor rojo por el violeta de su press kit y suma su firma
 * manuscrita. El rojo se reserva para lo que es de MG.
 *
 * Playwright no es dependencia del proyecto (solo hace falta para regenerar
 * esta tarjeta), asi que se resuelve del proyecto si esta y, si no, de donde
 * npx lo haya dejado:
 *
 *   npx --yes playwright@1 --version   # deja playwright en la cache de npx
 *   node scripts/generar-og-karen-dayanna.mjs
 */
import { fileURLToPath, pathToFileURL } from "node:url"
import { dirname, join } from "node:path"
import { mkdir, readdir, writeFile, rm } from "node:fs/promises"
import { existsSync } from "node:fs"
import { homedir } from "node:os"

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

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..")
const publico = (rel) => pathToFileURL(join(raiz, "public", rel)).href

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; background:#0a0a0d; overflow:hidden;
         font-family:'JetBrains Mono',monospace; color:#fff; }
  .card { position:relative; width:1200px; height:630px; }

  /* Retrato a la derecha, fundido hacia el negro por la izquierda */
  .foto { position:absolute; inset:0 0 0 auto; width:620px; height:630px;
          background:url('${publico("artists/karen-dayanna/kd-portrait.jpg")}') center 18% / cover no-repeat;
          -webkit-mask-image:linear-gradient(90deg, transparent 0%, #000 34%, #000 100%);
          mask-image:linear-gradient(90deg, transparent 0%, #000 34%, #000 100%); }
  .tinte { position:absolute; inset:0 0 0 auto; width:620px; height:630px;
           background:linear-gradient(200deg, rgba(167,139,250,0.30) 0%, transparent 55%); }

  /* Resplandor violeta abajo a la izquierda: el acento de su pagina */
  .glow { position:absolute; inset:0;
          background:radial-gradient(ellipse 46% 52% at 6% 100%, rgba(167,139,250,0.30) 0%, transparent 62%),
                     radial-gradient(ellipse 30% 34% at 52% 4%, rgba(232,32,12,0.14) 0%, transparent 60%); }

  .contenido { position:absolute; inset:0; padding:56px 60px; display:flex; flex-direction:column; }

  .marca { display:flex; align-items:center; gap:18px; }
  .marca img { width:42px; height:42px; object-fit:contain; }
  .marca span { font-size:19px; letter-spacing:0.30em; font-weight:500; }

  .centro { margin-top:auto; margin-bottom:auto; }
  .kicker { display:flex; align-items:center; gap:22px; margin-bottom:22px; }
  .kicker span { color:#e8200c; font-size:19px; letter-spacing:0.32em; font-weight:500; white-space:nowrap; }
  .kicker i { display:block; width:160px; height:1px;
              background:linear-gradient(90deg,#e8200c,rgba(167,139,250,0.55),transparent); }

  h1 { font-family:'Bebas Neue',sans-serif; font-size:126px; line-height:0.84;
       letter-spacing:-0.005em; text-transform:uppercase; }

  .meta { margin-top:22px; font-size:19px; letter-spacing:0.24em; color:rgba(255,255,255,0.72); }
  .meta b { color:#a78bfa; font-weight:400; padding:0 10px; }

  .firma { margin-top:26px; width:300px; opacity:0.62; }

  .pie { display:flex; align-items:center; justify-content:space-between; }
  .pie span { font-size:17px; letter-spacing:0.28em; color:rgba(255,255,255,0.62); }
  .pie i { display:block; width:104px; height:7px; background:#e8200c; }
</style></head>
<body><div class="card">
  <div class="foto"></div><div class="tinte"></div><div class="glow"></div>
  <div class="contenido">
    <div class="marca">
      <img src="${publico("logo-mg.png")}" alt="">
      <span>MG COMPANY GROUP</span>
    </div>
    <div class="centro">
      <div class="kicker"><span>[ ARTISTA MG ]</span><i></i></div>
      <h1>Karen<br>Dayanna</h1>
      <div class="meta">BOGOTÁ, COLOMBIA <b>●</b> CANCIÓN DE AUTOR</div>
      <img class="firma" src="${publico("artists/karen-dayanna/firma.svg")}" alt="">
    </div>
    <div class="pie"><span>MGCOMPANY.CO</span><i></i></div>
  </div>
</div></body></html>`

const navegador = await chromium.launch({ executablePath: await navegadorInstalado() })
const pagina = await navegador.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
})
// setContent deja la pagina en about:blank y desde ahi Chromium bloquea
// file://, asi que escribimos el HTML y navegamos a el de verdad.
const temporal = join(raiz, "public", ".og-karen-dayanna.tmp.html")
await writeFile(temporal, html, "utf-8")
await pagina.goto(pathToFileURL(temporal).href, { waitUntil: "networkidle" })
await pagina.evaluate(() => document.fonts.ready)
await mkdir(join(raiz, "public", "og"), { recursive: true })
await pagina.screenshot({
  path: join(raiz, "public", "og", "og-karen-dayanna.jpg"),
  type: "jpeg",
  quality: 92,
})
await navegador.close()
await rm(temporal, { force: true })
console.log("public/og/og-karen-dayanna.jpg")
