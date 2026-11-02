import { BookOpen, Check, CheckCircle2, ChevronDown, Clock, FileQuestion, Lock, PlayCircle, Award } from 'lucide-react'
import { useState } from 'react'
import { Parallax, Reveal } from '../components/motion'
import { Bar, ProgressRing } from '../components/ProgressRing'
import { Cover, Eyebrow } from '../components/ui'
import { odile } from '../content/brand'
import { Link } from '../lib/router'
import { courseLd, useSeo } from '../lib/seo'
import { currentUser, eur, fcfa, getCourse, getProgress, isUnlocked, lessonsOf, modulePercent, owns, percent, resumeLesson, useStore } from '../lib/store'
import NotFound from './NotFound'

const kindIcon = { video: PlayCircle, reading: BookOpen, quiz: FileQuestion }

export default function CourseDetail({ slug }: { slug: string }) {
  useStore()
  const c = getCourse(slug); const u = currentUser()
  const visible = c && (c.status === 'published' || u?.role === 'admin')
  useSeo(visible ? {
    title: c.title, description: `Formation en ligne de ${c.duration} avec Odile T., ${eur(c.price)} : ${c.subtitle.toLowerCase()}. Leçons, cahier PDF, quiz et certificat.`, path: `/formations/${c.slug}`, noindex: c.status !== 'published',
    jsonld: [courseLd(c)],
  } : { title: 'Formation introuvable', description: 'Cette formation n’existe pas.', path: `/formations/${slug}`, noindex: true })
  const [open, setOpen] = useState(0)
  if (!c || !visible) return <NotFound />
  const owned = owns(u?.id, c.slug); const p = u ? getProgress(u.id, c.slug) : { done: [], pos: {}, quiz: {}, updated: 0 }
  const pct = percent(c, p); const resume = resumeLesson(c, p)
  return (
    <>
      <section className="bg-green text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <p className="text-sm text-cream/70"><Link to="/formations" className="hover:text-gold">Formations</Link> / {c.pillar}</p>
            <h1 className="display mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{c.title}</h1>
            <p className="mt-3 text-lg text-gold">{c.subtitle}</p>
            <p className="mt-5 leading-relaxed text-cream/85">{c.description}</p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-cream/80">
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{c.duration}</span>
              <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4" />{c.modules.length} modules · {lessonsOf(c).length} leçons</span>
              <span className="inline-flex items-center gap-2"><Award className="h-4 w-4" />Certificat de réussite</span>
            </div>
            <div className="mt-6 flex items-center gap-3"><img src={odile.portraitSmall} alt="Avatar d’Odile T." className="h-11 w-11 rounded-full object-cover ring-2 ring-gold" /><p className="text-sm">Avec <strong>{odile.name}</strong><br /><span className="text-cream/70">{odile.role}</span></p></div>
          </Reveal>
          <Reveal delay={0.1} className="self-start">
            <div className="overflow-hidden rounded-3xl bg-white text-ink shadow-lift">
              <Cover src={c.cover} alt={`Illustration de la formation ${c.title}`} className="aspect-[16/10] w-full" />
              <div className="p-6">
                {owned ? <>
                  <div className="flex items-center gap-4"><ProgressRing value={pct} /><div><p className="font-semibold text-green">{pct === 100 ? 'Formation terminée' : pct ? 'En cours' : 'Prêt à commencer'}</p><p className="text-sm text-mute">{p.done.length} / {lessonsOf(c).length} leçons</p></div></div>
                  <Link to={`/apprendre/${c.slug}/${resume}`} className="btn-primary mt-5 w-full py-3">{pct ? 'Reprendre' : 'Commencer'}</Link>
                </> : <>
                  <p className="num display text-4xl font-semibold text-green">{eur(c.price)}</p><p className="text-sm text-mute">≈ {fcfa(c.price)} · accès à vie à cette formation</p>
                  <Link to={u ? `/paiement/${c.slug}` : `/inscription?next=/paiement/${c.slug}`} className="btn-primary mt-5 w-full py-3">Acheter la formation</Link>
                  <p className="mt-3 text-center text-xs text-mute">Paiement simulé · Mobile Money ou carte</p>
                </>}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr]">
        <div>
          <Reveal><h2 className="display text-3xl font-semibold text-green">Ce que vous allez apprendre</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">{c.outcomes.map((o) => <li key={o} className="flex gap-2.5 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />{o}</li>)}</ul></Reveal>
          <Reveal><h2 className="display mt-12 text-3xl font-semibold text-green">Programme</h2><p className="mt-2 text-sm text-mute">Les leçons se débloquent dans l’ordre : terminez une leçon pour accéder à la suivante.</p></Reveal>
          <div className="mt-5 space-y-3">
            {c.modules.map((m, i) => { const mp = modulePercent(m, p); return (
              <div key={m.id} className="card overflow-hidden">
                <h3><button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center gap-4 px-5 py-4 text-left">
                  <span className="caps grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-soft text-xs font-bold text-gold-deep">{i + 1}</span>
                  <span className="flex-1"><span className="block font-semibold text-green">{m.title}</span><span className="text-xs text-mute">{m.lessons.length} leçons{owned ? ` · ${mp}%` : ''}</span></span>
                  <ChevronDown className={`h-5 w-5 text-mute transition ${open === i ? 'rotate-180' : ''}`} />
                </button></h3>
                {owned && <div className="px-5"><Bar value={mp} /></div>}
                {open === i && <ul className="divide-y divide-line px-5 py-2">{m.lessons.map((l) => { const I = kindIcon[l.kind]; const done = p.done.includes(l.id); const unlocked = owned && isUnlocked(c, p, l.id); return (
                  <li key={l.id} className="flex items-center gap-3 py-3 text-sm">
                    {done ? <CheckCircle2 className="h-5 w-5 text-green" /> : unlocked ? <I className="h-5 w-5 text-gold-deep" /> : <Lock className="h-4 w-4 text-mute" />}
                    {unlocked ? <Link to={`/apprendre/${c.slug}/${l.id}`} className="flex-1 font-medium text-green hover:underline">{l.title}</Link> : <span className="flex-1 text-ink/80">{l.title}</span>}
                    <span className="text-xs text-mute">{l.duration}</span>
                  </li>) })}</ul>}
              </div>) })}
          </div>
        </div>
        <aside className="space-y-6">
          <Parallax className="overflow-hidden rounded-3xl" amount={20}><img src={odile.teachingSmall} loading="lazy" alt="Odile T. en situation d’enseignement" className="aspect-[4/3] w-full scale-110 object-cover" /></Parallax>
          <div className="card p-6"><h2 className="display text-2xl font-semibold text-green">Passages étudiés</h2><ul className="mt-3 space-y-1.5 text-sm text-mute">{c.verses.map((v) => <li key={v}>{v}</li>)}</ul><p className="mt-3 text-xs text-mute">Références citées pour la méditation personnelle.</p></div>
          <div className="card p-6"><Eyebrow>Certificat</Eyebrow><p className="text-sm text-mute">Atteignez 100 % et réussissez l’évaluation finale (80 %) pour obtenir votre certificat SFC Finances vérifiable.</p></div>
        </aside>
      </div>
    </>
  )
}
