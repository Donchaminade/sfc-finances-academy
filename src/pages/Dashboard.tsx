import { Award, PlayCircle, ShieldCheck } from 'lucide-react'
import { Item, Reveal, Stagger } from '../components/motion'
import { Bar, ProgressRing } from '../components/ProgressRing'
import { Cover, Eyebrow } from '../components/ui'
import { Link, Redirect } from '../lib/router'
import { useSeo } from '../lib/seo'
import { currentUser, getProgress, lessonsOf, ownedCourses, percent, resumeLesson, useStore, userCerts } from '../lib/store'

export default function Dashboard({ tab }: { tab: 'cours' | 'certificats' }) {
  useStore()
  useSeo({ title: tab === 'cours' ? 'Mon espace' : 'Mes certificats', description: 'Votre espace apprenant SFC Finances.', path: tab === 'cours' ? '/mon-espace' : '/mon-espace/certificats', noindex: true })
  const u = currentUser()
  if (!u) return <Redirect to={`/connexion?next=${location.pathname}`} />
  const courses = ownedCourses(u.id).map((c) => { const p = getProgress(u.id, c.slug); return { c, p, pct: percent(c, p) } }).sort((a, b) => b.p.updated - a.p.updated)
  const current = courses.find((x) => x.pct < 100 && x.p.updated)
  const certs = userCerts(u.id)
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Reveal><Eyebrow>Mon espace</Eyebrow><h1 className="display text-5xl font-semibold text-green">Bonjour, {u.name.split(' ')[0]}</h1></Reveal>
      <div className="mt-6 flex gap-2" role="tablist">{([['cours', 'Mes cours', '/mon-espace'], ['certificats', `Mes certificats (${certs.length})`, '/mon-espace/certificats']] as const).map(([k, l, to]) => <Link key={k} to={to} role="tab" aria-selected={tab === k} className={`btn border ${tab === k ? 'border-green bg-green text-cream' : 'border-line bg-white text-mute'}`}>{l}</Link>)}</div>
      {tab === 'cours' ? <>
        {current && <Reveal className="mt-8"><div className="grid overflow-hidden rounded-3xl bg-green text-cream md:grid-cols-[1fr_1.4fr]">
          <Cover src={current.c.cover} alt={`Illustration de ${current.c.title}`} className="h-full min-h-48 w-full" />
          <div className="p-7">
            <p className="caps text-[11px] text-gold">Reprendre où vous en étiez</p>
            <h2 className="display mt-2 text-3xl font-semibold">{current.c.title}</h2>
            {(() => { const lid = resumeLesson(current.c, current.p); const l = lessonsOf(current.c).find((x) => x.id === lid); const pos = current.p.pos[lid!] ?? 0; return <>
              <p className="mt-2 text-cream/80">{l?.title}{pos ? ` · reprise à ${pos} %` : ''}</p>
              <div className="mt-5 flex items-center gap-4"><ProgressRing value={current.pct} size={58} light /><div className="flex-1"><Bar value={current.pct} light /><p className="mt-1.5 text-xs text-cream/70">{current.p.done.length} / {lessonsOf(current.c).length} leçons terminées</p></div></div>
              <Link to={`/apprendre/${current.c.slug}/${lid}`} className="btn-gold mt-6 px-6 py-3"><PlayCircle className="h-4 w-4" />Reprendre</Link></> })()}
          </div></div></Reveal>}
        <h2 className="display mt-12 text-3xl font-semibold text-green">Mes formations</h2>
        {courses.length ? <Stagger className="mt-5 grid gap-5 md:grid-cols-2">{courses.map(({ c, p, pct }) => <Item key={c.slug} className="card flex gap-4 p-4">
          <Cover src={c.cover} alt={`Illustration de ${c.title}`} className="h-24 w-28 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1"><h3 className="font-semibold text-green">{c.title}</h3>
            <div className="mt-2 space-y-1">{c.modules.map((m, i) => { const mp = Math.round(m.lessons.filter((l) => p.done.includes(l.id)).length / m.lessons.length * 100); return <div key={m.id} className="flex items-center gap-2 text-[11px] text-mute"><span className="w-16 shrink-0">Module {i + 1}</span><Bar value={mp} /><span className="num w-8 text-right">{mp}%</span></div> })}</div>
            <div className="mt-3 flex items-center justify-between"><span className="num text-sm font-bold text-green">{pct}%</span><Link to={`/apprendre/${c.slug}/${resumeLesson(c, p)}`} className="text-sm font-semibold text-gold-deep hover:underline">{pct === 100 ? 'Revoir' : pct ? 'Reprendre' : 'Commencer'}</Link></div>
          </div></Item>)}</Stagger>
          : <div className="card mt-5 p-10 text-center"><p className="text-mute">Vous n’avez pas encore de formation.</p><Link to="/formations" className="btn-primary mt-4">Découvrir le catalogue</Link></div>}
      </> : <>
        <h2 className="sr-only">Certificats obtenus</h2>
        {certs.length ? <Stagger className="mt-8 grid gap-5 md:grid-cols-2">{certs.map((x) => <Item key={x.id} className="card flex items-center gap-4 p-5">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold-soft text-gold-deep"><Award className="h-7 w-7" /></span>
          <div className="min-w-0 flex-1"><h3 className="font-semibold text-green">{x.course}</h3><p className="num text-xs text-mute">{x.id} · {new Date(x.date).toLocaleDateString('fr-FR')}</p></div>
          <Link to={`/certificats/${x.id}`} className="btn-ghost"><ShieldCheck className="h-4 w-4" />Voir</Link></Item>)}</Stagger>
          : <div className="card mt-8 p-10 text-center text-mute">Terminez une formation à 100 % et réussissez l’évaluation finale pour obtenir votre premier certificat.</div>}
      </>}
    </div>
  )
}
