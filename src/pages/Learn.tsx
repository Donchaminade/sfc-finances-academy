import { AnimatePresence, motion } from 'motion/react'
import { Award, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, FileDown, FileQuestion, Lock, Menu, Pause, Play, PlayCircle, RotateCcw, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Bar, ProgressRing } from '../components/ProgressRing'
import { Modal } from '../components/ui'
import type { Course, Lesson } from '../data/types'
import { getFile } from '../lib/idb'
import { Markdown } from '../lib/markdown'
import { Link, Redirect, navigate } from '../lib/router'
import { useSeo } from '../lib/seo'
import { completeLesson, currentUser, getCourse, getProgress, isUnlocked, issueCert, lessonsOf, modulePercent, owns, percent, resumeLesson, setLast, setPosition, useStore, type Cert, type User } from '../lib/store'
import { useFileUrl } from '../lib/useFileUrl'

const kindIcon = { video: PlayCircle, reading: BookOpen, quiz: FileQuestion }
const isFinal = (c: Course, l: Lesson) => { const ls = lessonsOf(c); return l.kind === 'quiz' && ls[ls.length - 1].id === l.id }

export default function Learn({ slug, lessonId }: { slug: string; lessonId: string }) {
  useStore()
  const c = getCourse(slug); const u = currentUser()
  useSeo({ title: c ? `Apprendre · ${c.title}` : 'Apprendre', description: 'Lecteur de formation SFC Finances.', path: `/apprendre/${slug}/${lessonId}`, noindex: true })
  const [side, setSide] = useState(false)
  const [cert, setCert] = useState<Cert | null>(null)
  useEffect(() => { if (u && c && owns(u.id, c.slug)) setLast(u.id, c.slug, lessonId) }, [u, c, lessonId])
  if (!u) return <Redirect to={`/connexion?next=/apprendre/${slug}/${lessonId}`} />
  if (!c) return <Redirect to="/formations" />
  if (!owns(u.id, c.slug)) return <Redirect to={`/formations/${c.slug}`} />
  const p = getProgress(u.id, c.slug); const ls = lessonsOf(c)
  const lesson = ls.find((l) => l.id === lessonId)
  if (!lesson || !isUnlocked(c, p, lessonId)) return <Redirect to={`/apprendre/${c.slug}/${resumeLesson(c, p)}`} />
  const idx = ls.indexOf(lesson); const next = ls[idx + 1]; const prev = ls[idx - 1]
  const done = p.done.includes(lesson.id); const pct = percent(c, p)
  const mod = c.modules.find((m) => m.lessons.includes(lesson))!

  const onComplete = (score?: number) => {
    completeLesson(u.id, c.slug, lesson.id, score)
    const np = getProgress(u.id, c.slug)
    if (percent(c, np) === 100) setCert(issueCert(u, c))
  }

  return (
    <div className="flex min-h-[calc(100dvh-4rem)]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 shrink-0 overflow-y-auto border-r border-line bg-white transition md:sticky md:top-16 md:z-0 md:h-[calc(100dvh-4rem)] md:translate-x-0 ${side ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-start justify-between gap-3 border-b border-line p-5">
          <div><Link to={`/formations/${c.slug}`} className="text-xs text-mute hover:text-green">← Retour à la formation</Link><p className="display mt-1 text-xl font-semibold leading-tight text-green">{c.title}</p></div>
          <button className="md:hidden" onClick={() => setSide(false)} aria-label="Fermer le sommaire"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex items-center gap-3 border-b border-line p-5"><ProgressRing value={pct} size={54} /><div className="text-sm"><p className="font-semibold text-green">Progression du cours</p><p className="text-mute">{p.done.length} / {ls.length} leçons</p></div></div>
        <nav aria-label="Sommaire de la formation">
          {c.modules.map((m, mi) => <div key={m.id} className="border-b border-line px-3 py-4">
            <div className="px-2"><p className="caps text-[10px] font-bold text-gold-deep">Module {mi + 1}</p><p className="font-semibold text-green">{m.title}</p><div className="mt-2 flex items-center gap-2"><Bar value={modulePercent(m, p)} /><span className="num text-xs text-mute">{modulePercent(m, p)}%</span></div></div>
            <ul className="mt-2">{m.lessons.map((l) => { const I = kindIcon[l.kind]; const ok = isUnlocked(c, p, l.id); const d = p.done.includes(l.id); return (
              <li key={l.id}>{ok ? <Link to={`/apprendre/${c.slug}/${l.id}`} onClick={() => setSide(false)} className={`flex items-center gap-2.5 rounded-xl px-2 py-2 text-sm transition ${l.id === lesson.id ? 'bg-green-soft font-semibold text-green' : 'text-ink/80 hover:bg-sand'}`}>{d ? <CheckCircle2 className="h-4 w-4 shrink-0 text-green" /> : <I className="h-4 w-4 shrink-0 text-gold-deep" />}<span className="flex-1">{l.title}</span><span className="text-[11px] text-mute">{l.duration}</span></Link>
                : <span className="flex items-center gap-2.5 px-2 py-2 text-sm text-mute" title="Terminez la leçon précédente pour débloquer"><Lock className="h-4 w-4 shrink-0" /><span className="flex-1">{l.title}</span></span>}</li>) })}</ul>
          </div>)}
        </nav>
      </aside>
      {side && <div className="fixed inset-0 z-40 bg-ink/30 md:hidden" onClick={() => setSide(false)} />}
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <button className="btn-ghost mb-4 md:hidden" onClick={() => setSide(true)}><Menu className="h-4 w-4" />Sommaire</button>
          <p className="caps text-[11px] font-semibold text-gold-deep">{mod.title} · Leçon {idx + 1} / {ls.length}</p>
          <h1 className="display mt-2 text-4xl font-semibold leading-tight text-green">{lesson.title}</h1>
          <AnimatePresence mode="wait"><motion.div key={lesson.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-6">
            {lesson.kind === 'quiz' ? <Quiz lesson={lesson} final={isFinal(c, lesson)} best={p.quiz[lesson.id]} done={done} onPass={onComplete} />
              : <Content c={c} u={u} lesson={lesson} done={done} startPos={p.pos[lesson.id] ?? 0} onComplete={() => onComplete()} />}
          </motion.div></AnimatePresence>
          {lesson.pdfs.length > 0 && <div className="card mt-6 p-5"><h2 className="font-semibold text-green">Ressources à télécharger</h2><ul className="mt-3 space-y-2">{lesson.pdfs.map((f) => <li key={f.id}>{f.url ? <a href={f.url} download={f.name} className="inline-flex items-center gap-2 text-sm font-medium text-green hover:underline"><FileDown className="h-4 w-4 text-gold-deep" />{f.name} <span className="text-xs text-mute">({Math.round(f.size / 1024)} Ko)</span></a> : <button className="inline-flex items-center gap-2 text-sm font-medium text-green hover:underline" onClick={async () => { const b = await getFile(f.ref); if (!b) return; const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = f.name; a.click() }}><FileDown className="h-4 w-4 text-gold-deep" />{f.name} <span className="text-xs text-mute">({Math.round(f.size / 1024)} Ko)</span></button>}</li>)}</ul></div>}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
            {prev ? <Link to={`/apprendre/${c.slug}/${prev.id}`} className="btn-ghost"><ChevronLeft className="h-4 w-4" />Précédente</Link> : <span />}
            {next ? (done ? <Link to={`/apprendre/${c.slug}/${next.id}`} className="btn-primary">Leçon suivante<ChevronRight className="h-4 w-4" /></Link>
              : <span className="btn cursor-not-allowed bg-sand text-mute" title="Terminez cette leçon pour continuer"><Lock className="h-4 w-4" />Leçon suivante</span>)
              : pct === 100 ? <Link to="/mon-espace/certificats" className="btn-gold"><Award className="h-4 w-4" />Mes certificats</Link> : <span />}
          </div>
        </div>
      </div>
      <Modal open={!!cert} onClose={() => setCert(null)} title="Félicitations !">
        <div className="text-center">
          <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="inline-grid h-20 w-20 place-items-center rounded-full bg-gold text-green-deep"><Award className="h-10 w-10" /></motion.span>
          <p className="mt-4 text-mute">Vous avez terminé « {c.title} ». Votre certificat est prêt.</p>
          <button className="btn-primary mt-6" onClick={() => cert && navigate(`/certificats/${cert.id}`)}>Voir mon certificat</button>
        </div>
      </Modal>
    </div>
  )
}

function Content({ c, u, lesson, done, startPos, onComplete }: { c: Course; u: User; lesson: Lesson; done: boolean; startPos: number; onComplete: () => void }) {
  const [tab, setTab] = useState<'watch' | 'read'>(lesson.kind === 'video' ? 'watch' : 'read')
  return (
    <div>
      {lesson.kind === 'video' && <div className="mb-5 inline-flex rounded-full border border-line bg-white p-1" role="tablist">
        {([['watch', 'Regarder', PlayCircle], ['read', 'Lire la transcription', BookOpen]] as const).map(([k, l, I]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === k ? 'text-cream' : 'text-mute hover:text-green'}`}>{tab === k && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-green" />}<span className="relative inline-flex items-center gap-2"><I className="h-4 w-4" />{l}</span></button>)}
      </div>}
      {done && <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-soft px-3 py-1.5 text-sm font-semibold text-green"><CheckCircle2 className="h-4 w-4" />Leçon terminée</p>}
      {tab === 'watch' && lesson.video ? <Video key={lesson.id} c={c} u={u} lesson={lesson} startPos={startPos} done={done} onComplete={onComplete} />
        : <Reading key={lesson.id} text={lesson.transcript} done={done} onComplete={onComplete} transcript={lesson.kind === 'video'} />}
    </div>
  )
}

function Reading({ text, done, onComplete, transcript }: { text: string; done: boolean; onComplete: () => void; transcript: boolean }) {
  const end = useRef<HTMLDivElement>(null)
  const cb = useRef(onComplete); cb.current = onComplete
  useEffect(() => {
    if (done || !end.current) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { cb.current(); io.disconnect() } }, { threshold: 1 })
    io.observe(end.current); return () => io.disconnect()
  }, [done])
  return (
    <article className="card p-6 sm:p-8">
      {transcript && <p className="caps mb-4 text-[11px] font-semibold text-gold-deep">Transcription</p>}
      <Markdown text={text || 'Contenu à venir.'} />
      <div ref={end} className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-sm text-mute">{done ? <><CheckCircle2 className="h-4 w-4 text-green" />Lecture terminée</> : 'Lisez jusqu’ici pour valider la leçon.'}</div>
    </article>
  )
}

function Video({ c, u, lesson, startPos, done, onComplete }: { c: Course; u: User; lesson: Lesson; startPos: number; done: boolean; onComplete: () => void }) {
  const v = lesson.video!
  if (v.type === 'file') return <FileVideo c={c} u={u} lesson={lesson} startPos={startPos} done={done} onComplete={onComplete} />
  if (v.type === 'url' && v.src) return <EmbedVideo src={v.src} done={done} onComplete={onComplete} />
  return <DemoVideo c={c} u={u} lesson={lesson} startPos={done ? 100 : startPos} done={done} onComplete={onComplete} />
}

/** Simulated player for lessons without a real video file. Seeking is capped at the furthest point watched. */
function DemoVideo({ c, u, lesson, startPos, done, onComplete }: { c: Course; u: User; lesson: Lesson; startPos: number; done: boolean; onComplete: () => void }) {
  const [pos, setPos] = useState(done ? 0 : startPos); const [max, setMax] = useState(done ? 100 : startPos); const [playing, setPlaying] = useState(false)
  const cb = useRef(onComplete); cb.current = onComplete
  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setPos((x) => Math.min(100, x + 1)), 120)
    return () => clearInterval(t)
  }, [playing])
  useEffect(() => {
    if (pos > max) setMax(pos)
    if (playing) setPosition(u.id, c.slug, lesson.id, pos)
    if (pos >= 100 && playing) { setPlaying(false); if (!done) cb.current() }
  }, [pos, max, playing, done, u.id, c.slug, lesson.id])
  const mins = parseInt(lesson.duration) || 8; const fmt = (pp: number) => { const s = Math.round((pp / 100) * mins * 60); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` }
  return (
    <div className="overflow-hidden rounded-2xl bg-green-deep text-cream shadow-lift">
      <div className="relative grid aspect-video place-items-center">
        <img src="/images/odile-enseignement-1200.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => setPlaying(!playing)} className="relative grid h-20 w-20 place-items-center rounded-full bg-gold text-green-deep shadow-lift" aria-label={playing ? 'Pause' : 'Lecture'}>{playing ? <Pause className="h-8 w-8" /> : <Play className="ml-1 h-8 w-8" />}</motion.button>
        {startPos > 0 && !playing && pos === startPos && !done && <p className="absolute bottom-4 rounded-full bg-ink/60 px-3 py-1 text-xs">Reprise à {fmt(startPos)}</p>}
        <span className="absolute left-4 top-4 rounded-full bg-ink/50 px-2.5 py-1 text-[11px]">Vidéo de démonstration</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Lecture'}>{playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</button>
        <span className="num w-12 text-xs">{fmt(pos)}</span>
        <div className="relative h-2 flex-1 cursor-pointer rounded-full bg-cream/20" role="slider" aria-label="Position de lecture" aria-valuenow={pos} aria-valuemin={0} aria-valuemax={100} tabIndex={0}
          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos(Math.min(max, Math.round(((e.clientX - r.left) / r.width) * 100))) }}>
          <div className="absolute inset-y-0 left-0 rounded-full bg-cream/30" style={{ width: `${max}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-gold" style={{ width: `${pos}%` }} />
        </div>
        <span className="num w-12 text-right text-xs">{lesson.duration.replace(' min', ':00')}</span>
        {pos >= 100 && <button onClick={() => { setPos(0); setPlaying(true) }} aria-label="Revoir"><RotateCcw className="h-4 w-4" /></button>}
      </div>
    </div>
  )
}

function FileVideo({ c, u, lesson, startPos, done, onComplete }: { c: Course; u: User; lesson: Lesson; startPos: number; done: boolean; onComplete: () => void }) {
  const url = useFileUrl(lesson.video!.src); const ref = useRef<HTMLVideoElement>(null); const max = useRef(0)
  return url ? <video ref={ref} src={url} controls className="aspect-video w-full rounded-2xl bg-ink"
    onLoadedMetadata={(e) => { const el = e.currentTarget; max.current = done ? el.duration : (startPos / 100) * el.duration; el.currentTime = done ? 0 : max.current }}
    onTimeUpdate={(e) => { const el = e.currentTarget; if (!el.duration) return; if (el.currentTime > max.current + 1.5 && !done) el.currentTime = max.current; else max.current = Math.max(max.current, el.currentTime); setPosition(u.id, c.slug, lesson.id, Math.round((max.current / el.duration) * 100)) }}
    onEnded={() => { if (!done) onComplete() }} /> : <div className="grid aspect-video place-items-center rounded-2xl bg-sand text-mute">Chargement de la vidéo…</div>
}

function ytId(s: string) { const m = s.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m?.[1] }
function EmbedVideo({ src, done, onComplete }: { src: string; done: boolean; onComplete: () => void }) {
  const [t, setT] = useState(20); const id = ytId(src)
  useEffect(() => { if (done) return; const i = setInterval(() => setT((x) => Math.max(0, x - 1)), 1000); return () => clearInterval(i) }, [done])
  return <div>
    <div className="aspect-video overflow-hidden rounded-2xl bg-ink">{id ? <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}`} title="Vidéo de la leçon" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen /> : <video src={src} controls className="h-full w-full" onEnded={() => !done && onComplete()} />}</div>
    {!done && id && <button className="btn-primary mt-4" disabled={t > 0} onClick={onComplete}>{t > 0 ? `J’ai regardé la vidéo (${t} s)` : 'J’ai regardé la vidéo'}</button>}
  </div>
}

function Quiz({ lesson, final, best, done, onPass }: { lesson: Lesson; final: boolean; best?: number; done: boolean; onPass: (score: number) => void }) {
  const qs = lesson.quiz ?? []; const pass = final ? 80 : 70
  const [ans, setAns] = useState<number[]>([]); const [score, setScore] = useState<number | null>(null)
  const submit = () => { const s = Math.round((qs.filter((q, i) => ans[i] === q.answer).length / qs.length) * 100); setScore(s); if (s >= pass) onPass(s) }
  return (
    <div className="card p-6 sm:p-8">
      <p className="text-sm text-mute">{final ? 'Évaluation finale' : 'Quiz de module'} · {qs.length} questions · réussite à partir de {pass} %{best !== undefined ? ` · meilleur score : ${best} %` : ''}</p>
      <ol className="mt-6 space-y-6">{qs.map((q, i) => <li key={i}><fieldset><legend className="font-semibold text-green">{i + 1}. {q.q}</legend>
        <div className="mt-3 space-y-2">{q.options.map((o, j) => { const sel = ans[i] === j; const show = score !== null; const good = j === q.answer; return (
          <label key={j} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm transition ${show && sel ? (good ? 'border-green bg-green-soft' : 'border-red-300 bg-red-50') : sel ? 'border-green bg-green-soft' : 'border-line hover:border-green/40'}`}>
            <input type="radio" name={`q${i}`} className="accent-[#015C30]" checked={sel} onChange={() => { const a = [...ans]; a[i] = j; setAns(a); setScore(null) }} />{o}</label>) })}</div></fieldset></li>)}</ol>
      {score !== null && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status" className={`mt-6 rounded-xl px-4 py-3 text-sm font-semibold ${score >= pass ? 'bg-green-soft text-green' : 'bg-gold-soft text-ink'}`}>{score >= pass ? `Bravo ! ${score} % : ${final ? 'évaluation réussie.' : 'quiz validé.'}` : `${score} % : il faut au moins ${pass} %. Relisez les leçons et réessayez.`}</motion.p>}
      <button className="btn-primary mt-6" disabled={ans.filter((a) => a !== undefined).length < qs.length} onClick={submit}>{done ? 'Repasser le quiz' : 'Valider mes réponses'}</button>
    </div>
  )
}
