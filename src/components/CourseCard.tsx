import { motion } from 'motion/react'
import { BookOpen, Clock } from 'lucide-react'
import type { Course } from '../data/types'
import { Link } from '../lib/router'
import { eur, lessonsOf } from '../lib/store'
import { Bar } from './ProgressRing'
import { Cover } from './ui'

export function CourseCard({ c, progress, headingLevel = 3 }: { c: Course; progress?: number; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as 'h2' | 'h3'
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="card group flex h-full flex-col overflow-hidden hover:shadow-lift">
      <Link to={`/formations/${c.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-sand">
          <Cover src={c.cover} alt={`Illustration de la formation ${c.title}`} className="h-full w-full transition duration-500 group-hover:scale-105" />
          <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-green">{c.pillar}</span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <H className="display text-2xl font-semibold leading-tight text-green">{c.title}</H>
          <p className="mt-1.5 text-sm text-mute">{c.subtitle}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-mute">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{c.duration}</span>
            <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />{lessonsOf(c).length} leçons</span>
            <span>{c.level}</span>
          </div>
          <div className="mt-auto pt-5">
            {progress !== undefined ? <div><div className="mb-1.5 flex justify-between text-xs"><span className="text-mute">Progression</span><span className="num font-semibold text-green">{progress}%</span></div><Bar value={progress} /></div>
              : <p className="flex items-baseline justify-between"><span className="num text-xl font-bold text-green">{eur(c.price)}</span><span className="text-sm font-semibold text-gold-deep group-hover:underline">Découvrir</span></p>}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
