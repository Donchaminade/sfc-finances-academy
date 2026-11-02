import { Search } from 'lucide-react'
import { useState } from 'react'
import { CourseCard } from '../components/CourseCard'
import { Item, Reveal, Stagger } from '../components/motion'
import { Eyebrow } from '../components/ui'
import { useSeo } from '../lib/seo'
import { publishedCourses, useStore } from '../lib/store'

export default function Formations() {
  useStore()
  useSeo({ title: 'Formations en éducation financière chrétienne', description: 'Budget, épargne, dettes, projets, générosité : découvrez les formations SFC Finances, à suivre à votre rythme depuis Lomé, le Togo ou ailleurs.', path: '/formations' })
  const all = publishedCourses()
  const [q, setQ] = useState(''); const [pillar, setPillar] = useState('Toutes'); const [level, setLevel] = useState('Tous'); const [sort, setSort] = useState('pop')
  const pillars = ['Toutes', ...new Set(all.map((c) => c.pillar))]
  let list = all.filter((c) => (pillar === 'Toutes' || c.pillar === pillar) && (level === 'Tous' || c.level === level) && (c.title + c.description).toLowerCase().includes(q.toLowerCase()))
  if (sort === 'asc') list = [...list].sort((a, b) => a.price - b.price)
  if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price)
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal><Eyebrow>Catalogue</Eyebrow><h1 className="display text-5xl font-semibold text-green">Nos formations</h1><p className="mt-3 max-w-2xl text-mute">Des parcours courts et pratiques, enracinés dans la Parole de Dieu, pour reprendre la main sur vos finances, étape par étape.</p></Reveal>
      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1"><span className="sr-only">Rechercher une formation</span><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" /><input className="input pl-10" placeholder="Rechercher une formation…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <label><span className="sr-only">Niveau</span><select className="input md:w-44" value={level} onChange={(e) => setLevel(e.target.value)}>{['Tous', 'Débutant', 'Intermédiaire', 'Tous niveaux'].map((l) => <option key={l}>{l}</option>)}</select></label>
        <label><span className="sr-only">Trier</span><select className="input md:w-44" value={sort} onChange={(e) => setSort(e.target.value)}><option value="pop">Recommandées</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option></select></label>
      </div>
      <div className="scroll-thin mt-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filtrer par pilier">
        {pillars.map((p) => <button key={p} onClick={() => setPillar(p)} aria-pressed={pillar === p} className={`btn shrink-0 border px-4 py-2 ${pillar === p ? 'border-green bg-green text-cream' : 'border-line bg-white text-mute hover:text-green'}`}>{p}</button>)}
      </div>
      <h2 className="sr-only">Résultats</h2>
      <p className="mt-4 text-sm text-mute">{list.length} formation{list.length > 1 ? 's' : ''}</p>
      <Stagger key={pillar + level + sort} className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((c) => <Item key={c.slug}><CourseCard c={c} /></Item>)}</Stagger>
      {!list.length && <p className="card mt-6 p-10 text-center text-mute">Aucune formation ne correspond à votre recherche.</p>}
    </div>
  )
}
