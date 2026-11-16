import { mkdir, readFile, readdir, writeFile, rm, cp, stat } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { config as loadEnv } from 'dotenv'
import { createEventsHandler } from '../green/server/events-handler.mjs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(root, 'green')
const development = process.argv.includes('--dev')
const generated = path.join(root, development ? '.green-dev' : '.green-site')
const app = path.join(generated, 'app')

async function writeChanged(file, value) {
  const contents = Buffer.isBuffer(value) ? value : Buffer.from(value)
  const previous = await readFile(file).catch(error => {
    if (error.code !== 'ENOENT') throw error
    return null
  })
  if (previous?.equals(contents)) return
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, contents)
}

async function prepare() {
  const files = new Map()
  async function collect(source, destination) {
    for (const entry of await readdir(source, { withFileTypes: true })) {
      const from = path.join(source, entry.name)
      const to = path.join(destination, entry.name)
      if (entry.isDirectory()) await collect(from, to)
      else files.set(to, await readFile(from))
    }
  }
  await collect(path.join(sourceRoot, 'src/app/(frontend)'), app)
  await collect(path.join(sourceRoot, 'public'), path.join(generated, 'public'))
  const { content } = await import(`${pathToFileURL(path.join(sourceRoot, 'static/content.mjs')).href}?v=${Date.now()}`)
  files.set(path.join(app, 'lib/data.ts'), await readFile(path.join(sourceRoot, 'static/data.ts.template')))
  files.set(path.join(app, 'lib/content.json'), Buffer.from(JSON.stringify(content)))
  files.set(path.join(generated, 'src/payload-types.ts'), await readFile(path.join(sourceRoot, 'src/payload-types.ts')))
  for (const [file, contents] of files) {
    const value = file.endsWith('.tsx') ? contents.toString().replace(/export const dynamic = 'force-dynamic'\s*/g, '') : contents
    await writeChanged(file, value)
  }
  async function prune(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) await prune(file)
      else if (!files.has(file)) await rm(file)
    }
  }
  await prune(app)
  await prune(path.join(generated, 'public'))
await writeChanged(path.join(generated, 'next.config.mjs'), `export default { ${development ? "async rewrites() { return [{ source: '/api/termine', destination: 'http://127.0.0.1:3006/api/termine' }] }," : "output: 'export',"} trailingSlash: true, images: { unoptimized: true }, outputFileTracingRoot: ${JSON.stringify(root)} }\n`)
  const config = path.join(generated, 'tsconfig.json')
  if (!(await stat(config).catch(() => null))) await writeChanged(config, JSON.stringify({ compilerOptions: {
    target: 'ES2022', lib: ['DOM', 'DOM.Iterable', 'ES2022'], strict: true, noEmit: true,
    skipLibCheck: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler',
    resolveJsonModule: true, isolatedModules: true, jsx: 'react-jsx', plugins: [{ name: 'next' }],
    paths: { '@/*': ['./src/*'] },
  }, include: ['**/*.ts', '**/*.tsx', '.next/types/**/*.ts'], exclude: ['node_modules'] }))
}

await prepare()
if (process.argv.includes('--prepare-only')) process.exit(0)
let functionServer
if (development) {
  loadEnv({ path: path.join(sourceRoot, '.env.local') })
  const eventsHandler = createEventsHandler()
  functionServer = createServer(async (request, response) => {
    if (request.url?.split('?')[0] !== '/api/termine') { response.writeHead(404); response.end(); return }
    try {
      const result = await eventsHandler(new Request('http://127.0.0.1:3006/api/termine', { method: request.method }))
      response.writeHead(result.status, Object.fromEntries(result.headers))
      response.end(await result.text())
    } catch { response.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); response.end('{"error":"temporarily_unavailable"}') }
  })
  await new Promise((resolve, reject) => { functionServer.once('error', reject); functionServer.listen(3006, '127.0.0.1', resolve) })
  console.log('Lokaler Termin-Endpunkt vorbereitet (Port 3006, intern über /api/termine erreichbar).')
}
const args = development ? ['dev', generated, '--webpack', '--hostname', '127.0.0.1', '--port', '3004'] : ['build', generated, '--webpack']
const server = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), ...args], {
  cwd: root, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
})
let timer
if (development) {
  async function fingerprint(directory) {
    const entries = await readdir(directory, { withFileTypes: true })
    return (await Promise.all(entries.filter(entry => entry.name !== 'dist').map(async entry => {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) return fingerprint(file)
      const info = await stat(file)
      return `${file}:${info.mtimeMs}:${info.size}`
    }))).join('\n')
  }
  let previous = await fingerprint(sourceRoot)
  let checking = false
  timer = setInterval(async () => {
    if (checking) return
    checking = true
    try {
      const current = await fingerprint(sourceRoot)
      if (current !== previous) {
        await prepare()
        previous = current
        console.log('Grüne Quellen aktualisiert.')
      }
    } catch (error) { console.error(error) }
    finally { checking = false }
  }, 800)
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { clearInterval(timer); functionServer?.close(); server.kill(signal) })
server.on('error', error => { console.error(error); clearInterval(timer); functionServer?.close(); process.exit(1) })
server.on('exit', async code => {
  clearInterval(timer)
  functionServer?.close()
  if (!development && code === 0) {
    const output = path.join(sourceRoot, 'dist')
    await rm(output, { recursive: true, force: true })
    await cp(path.join(generated, 'out'), output, { recursive: true })
    console.log('Grüner statischer Export: green/dist/ — nicht automatisch veröffentlicht.')
  }
  process.exit(code ?? 0)
})
