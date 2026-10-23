import { cp, mkdir, readFile, readdir, writeFile, rm } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { content } from '../static/content.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const generated = path.join(root, '.static-site')
const app = path.join(generated, 'app')
const output = path.join(root, 'dist')
// Nur generierte Verzeichnisse werden ersetzt; die Payload-Anwendung bleibt erhalten.
await mkdir(generated, { recursive: true })
await rm(app, { recursive: true, force: true })
await cp(path.join(root, 'src/app/(frontend)'), app, { recursive: true })
await cp(path.join(root, 'public'), path.join(generated, 'public'), { recursive: true })
await mkdir(path.join(generated, 'src'), { recursive: true })
await cp(path.join(root, 'src/payload-types.ts'), path.join(generated, 'src/payload-types.ts'))
await cp(path.join(root, 'static/data.ts.template'), path.join(app, 'lib/data.ts'))
await writeFile(path.join(app, 'lib/content.json'), JSON.stringify(content))

async function prepare(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) await prepare(file)
    else if (entry.name.endsWith('.tsx')) {
      let source = await readFile(file, 'utf8')
      source = source.replace(/export const dynamic = 'force-dynamic'\s*/g, '')
      source = source.replace('<Link href="/admin">Redaktion</Link>', '')
      source = source.replace('Porträt und persönliche Zeile können direkt im CMS ergänzt werden.', 'Weitere Informationen zu unserer Besetzung folgen.')
      source = source.replace('Fotos und Galerien lassen sich im Payload-CMS veröffentlichen.', 'Weitere Bilder von unseren Auftritten folgen.')
      if (entry.name === 'layout.tsx') source = source.replace('<body>', '<body id="start">')
      await writeFile(file, source)
    }
  }
}
await prepare(app)
await writeFile(path.join(generated, 'next.config.mjs'), `export default { output: 'export', trailingSlash: true, images: { unoptimized: true }, outputFileTracingRoot: ${JSON.stringify(root)} }\n`)
await writeFile(path.join(generated, 'tsconfig.json'), JSON.stringify({ compilerOptions: {
  target: 'ES2022', lib: ['DOM', 'DOM.Iterable', 'ES2022'], strict: true, noEmit: true,
  skipLibCheck: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler',
  resolveJsonModule: true, isolatedModules: true, jsx: 'react-jsx', plugins: [{ name: 'next' }],
  paths: { '@/*': ['./src/*'] },
}, include: ['**/*.ts', '**/*.tsx', '.next/types/**/*.ts'], exclude: ['node_modules'] }))
const build = spawnSync(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build', generated, '--webpack'], {
  cwd: root, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
})
if (build.status !== 0) process.exit(build.status ?? 1)
await rm(output, { recursive: true, force: true })
await cp(path.join(generated, 'out'), output, { recursive: true })
console.log('Statische Website fertig: dist/ — bereit für Netlify, ohne Datenbank oder Serverfunktionen.')
