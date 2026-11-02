import { ResourceCard } from '../components/ResourceCard'
import { Item, Reveal, Stagger } from '../components/motion'
import { Eyebrow } from '../components/ui'
import { PRICE_NOTE } from '../content/resources'
import { useSeo } from '../lib/seo'
import { getResources, useStore } from '../lib/store'

export default function Resources() {
  useStore()
  const list = getResources()
  useSeo({ title: 'Ressources : livre et planner financier d’Odile T.', description: 'Le livre « Guide pratique pour gérer ses finances avec sagesse » et le cahier « Mon planner financier » d’Odile T., disponibles sur Amazon.', path: '/ressources' })
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal className="max-w-2xl"><Eyebrow>Ressources</Eyebrow><h1 className="display text-5xl font-semibold text-green">Pour aller plus loin, chez vous</h1><p className="mt-4 text-mute">Prolongez les formations avec le livre et le planner financier d’Odile T. : des outils concrets pour appliquer la sagesse financière au quotidien.</p></Reveal>
      <Stagger className="mt-10 grid gap-6 lg:grid-cols-2">{list.map((r) => <Item key={r.id}><ResourceCard r={r} headingLevel={2} /></Item>)}</Stagger>
      <p className="mt-6 text-xs text-mute">{PRICE_NOTE} Les achats se font directement sur Amazon.</p>
    </div>
  )
}
