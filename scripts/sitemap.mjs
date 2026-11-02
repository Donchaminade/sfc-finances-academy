import { writeFileSync } from 'node:fs'
import { routes } from './routes.mjs'
const base = 'https://sfc-finances-academy.vercel.app'
const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${base}${r}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${r === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`
writeFileSync('public/sitemap.xml', xml)
