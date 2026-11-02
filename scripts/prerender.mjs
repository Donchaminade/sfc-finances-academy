// Prerenders the public routes to static HTML (server-side React render) so crawlers see real content.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { routes, extraRoutes } from './routes.mjs'

const mem = new Map()
globalThis.localStorage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) }
const loc = { pathname: '/', hash: '', search: '' }
globalThis.location = loc

const { render } = await import(pathToFileURL(join(process.cwd(), 'dist-ssr/entry-server.js')).href)
const shell = readFileSync('dist/index.html', 'utf8')
writeFileSync('dist/200.html', shell.replace(/\s*<link rel="canonical" href="[^"]*" \/?>/, '').replace('</head>', '    <meta name="robots" content="noindex, nofollow" />\n  </head>'))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

for (const r of [...routes, ...extraRoutes]) {
  loc.pathname = r
  const head = {}; globalThis.__SSR_HEAD__ = head
  let html = render()
  html = html.replace(/opacity:0;?/g, '').replace(/transform:translateY\([^)]*\);?/g, '').replace(/ style=""/g, '')
  let page = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(head.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(head.description)}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${head.url}"`)
  const extra = [
    `<meta name="robots" content="${head.noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    `<meta property="og:title" content="${esc(head.title)}" />`, `<meta property="og:description" content="${esc(head.description)}" />`, `<meta property="og:url" content="${head.url}" />`,
    `<meta name="twitter:title" content="${esc(head.title)}" />`, `<meta name="twitter:description" content="${esc(head.description)}" />`, `<meta name="twitter:image" content="${head.image}" />`,
    ...head.jsonld.map((o) => `<script type="application/ld+json" data-ld="1">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`),
  ].join('\n    ')
  page = page.replace('</head>', `    ${extra}\n  </head>`).replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  const out = r === '/' ? 'dist/index.html' : join('dist', r, 'index.html')
  mkdirSync(join(out, '..'), { recursive: true }); writeFileSync(out, page)
  console.log('prerendered', r, '→', head.title)
}
rmSync('dist-ssr', { recursive: true, force: true })
