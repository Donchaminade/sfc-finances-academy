import { motion } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import type { Resource } from '../content/resources'
import { Cover } from './ui'

export function ResourceCard({ r, headingLevel = 3 }: { r: Resource; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as 'h2' | 'h3'
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="card flex h-full flex-col gap-6 p-6 sm:flex-row hover:shadow-lift">
      <div className="mx-auto w-40 shrink-0 sm:mx-0">
        <Cover src={r.cover} alt={`Couverture : ${r.title}`} className="aspect-[2/3] w-full rounded-lg shadow-lift" fallbackTitle={r.title} />
      </div>
      <div className="flex flex-1 flex-col">
        <p className="caps text-xs text-gold-deep">{r.kind}{r.format ? ` · ${r.format}` : ''}</p>
        <H className="display mt-1 text-2xl font-semibold leading-tight text-green">{r.title}</H>
        <p className="mt-1 text-sm text-mute">{r.subtitle}{r.author ? ` · ${r.author}` : ''}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink/80">{r.description}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          {r.price ? <span className="num text-xl font-bold text-green">{r.price}</span> : <span />}
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn-gold">Acheter sur Amazon <ExternalLink className="h-4 w-4" aria-hidden /></a>
        </div>
      </div>
    </motion.article>
  )
}
