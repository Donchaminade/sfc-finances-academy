import type { Course } from '../data/types'
import { useEffect } from 'react'
import { SITE_URL, brand, odile, socials } from '../content/brand'
import { directrice } from '../content/about'

const KEYWORDS = 'finance, éducation financière, finances chrétiennes, SFC Finances, Paris, France, francophone, budget, épargne'

function meta(attr: 'name' | 'property', key: string, val: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.content = val
}

export type Seo = { title: string; description: string; path: string; noindex?: boolean; image?: string; jsonld?: object[] }

export function useSeo({ title, description, path, noindex, image = '/og-image.png', jsonld = [] }: Seo) {
  const ld = JSON.stringify(jsonld)
  const ssr = (globalThis as { __SSR_HEAD__?: object }).__SSR_HEAD__
  if (ssr) Object.assign(ssr, { title: title.includes('SFC Finances') ? title : `${title} | SFC Finances`, description, url: SITE_URL + path, noindex, image: SITE_URL + image, jsonld: [orgLd, ...jsonld] })
  useEffect(() => {
    const full = title.includes('SFC Finances') ? title : `${title} | SFC Finances`
    document.title = full
    meta('name', 'description', description)
    meta('name', 'keywords', KEYWORDS)
    meta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    const url = SITE_URL + path
    let can = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!can) { can = document.createElement('link'); can.rel = 'canonical'; document.head.appendChild(can) }
    can.href = url
    meta('property', 'og:title', full); meta('property', 'og:description', description); meta('property', 'og:url', url)
    meta('property', 'og:image', SITE_URL + image); meta('property', 'og:type', 'website')
    meta('name', 'twitter:card', 'summary_large_image'); meta('name', 'twitter:title', full)
    meta('name', 'twitter:description', description); meta('name', 'twitter:image', SITE_URL + image)
    document.head.querySelectorAll('script[data-ld]').forEach((s) => s.remove())
    for (const o of [orgLd, ...JSON.parse(ld)]) {
      const s = document.createElement('script'); s.type = 'application/ld+json'; s.dataset.ld = '1'; s.textContent = JSON.stringify(o); document.head.appendChild(s)
    }
  }, [title, description, path, noindex, image, ld])
}

export const orgLd = {
  '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: brand.name, slogan: brand.slogan,
  url: SITE_URL, logo: SITE_URL + '/icons/icon-512.png', description: brand.mission,
  address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' },
  sameAs: socials.map((s) => s.url),
}
export const odileLd = {
  '@context': 'https://schema.org', '@type': 'Person', name: odile.name, jobTitle: odile.role,
  image: SITE_URL + odile.portrait, worksFor: { '@type': 'EducationalOrganization', name: brand.name },
}
export const directriceLd = {
  '@context': 'https://schema.org', '@type': 'Person', ...(directrice.name ? { name: directrice.name } : { name: 'Fondatrice de SFC Finances' }),
  jobTitle: directrice.title, image: SITE_URL + directrice.photo, worksFor: { '@type': 'EducationalOrganization', name: brand.name },
}
export const faqLd = (items: readonly { q: string; a: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
})

const weeks = (d: string) => Number(/(\d+)\s*semaine/.exec(d)?.[1] ?? 0)
export const courseLd = (c: Course) => ({
  '@context': 'https://schema.org', '@type': 'Course', name: c.title, description: c.description, inLanguage: 'fr', url: `${SITE_URL}/formations/${c.slug}`,
  image: SITE_URL + c.cover, provider: { '@type': 'EducationalOrganization', name: brand.name, sameAs: SITE_URL },
  instructor: { '@type': 'Person', name: odile.name, jobTitle: odile.role },
  offers: { '@type': 'Offer', price: c.price, priceCurrency: 'EUR', category: 'Paid', availability: 'https://schema.org/InStock', url: `${SITE_URL}/formations/${c.slug}` },
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', ...(weeks(c.duration) ? { courseSchedule: { '@type': 'Schedule', duration: `P${weeks(c.duration)}W`, repeatFrequency: 'P1W' } } : {}), instructor: { '@type': 'Person', name: odile.name } },
})
