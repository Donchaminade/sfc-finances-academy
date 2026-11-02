import { ArrowDown, ArrowUp, BookOpen, ChevronDown, FileQuestion, FileText, GripVertical, ImagePlus, Link2, PlayCircle, Plus, Save, Trash2, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { AsyncButton, Cover } from '../../components/ui'
import type { Course, Lesson, Module, Question } from '../../data/types'
import { delFile, putFile } from '../../lib/idb'
import { navigate } from '../../lib/router'
import { getCourse, getCourses, saveCourse, slugify, useStore } from '../../lib/store'
import { useFileUrl } from '../../lib/useFileUrl'
import { AdminLayout, Tip } from './AdminLayout'

const uid = (p: string) => p + crypto.randomUUID().slice(0, 8)
const blank = (): Course => ({ id: uid('c'), slug: '', title: '', subtitle: '', description: '', pillar: 'Budget & organisation', level: 'Débutant', price: 70, duration: '3 semaines', cover: '/img/cover-intendance.webp', status: 'draft', outcomes: [], verses: [], updatedAt: 0, modules: [{ id: uid('m'), title: 'Module 1', lessons: [] }] })
const move = <T,>(a: T[], i: number, j: number) => { if (j < 0 || j >= a.length) return a; const b = [...a]; const [x] = b.splice(i, 1); b.splice(j, 0, x); return b }
const pillars = ['Budget & organisation', 'Restauration & prospérité', 'Intendance biblique', 'Épargne', 'Sortir des dettes', 'Générosité']

export default function AdminCourseEdit({ slug }: { slug?: string }) {
  useStore()
  const orig = slug ? getCourse(slug) : undefined
  const [c, setC] = useState<Course>(() => structuredClone(orig ?? blank()))
  const [err, setErr] = useState('')
  const set = (p: Partial<Course>) => setC((x) => ({ ...x, ...p }))
  const setMods = (fn: (m: Module[]) => Module[]) => setC((x) => ({ ...x, modules: fn(x.modules) }))
  const coverIn = useRef<HTMLInputElement>(null)
  const save = async () => {
    const s = c.slug || slugify(c.title)
    if (!c.title.trim()) { setErr('Le titre est obligatoire.'); throw new Error() }
    if (getCourses().some((x) => x.slug === s && x.slug !== orig?.slug)) { setErr('Ce slug est déjà utilisé.'); throw new Error() }
    setErr(''); await new Promise((r) => setTimeout(r, 500))
    saveCourse({ ...c, slug: s, id: orig?.id ?? s }, orig?.slug)
    setTimeout(() => navigate(`/admin/formations/${s}`, true), 700)
  }
  return (
    <AdminLayout title={orig ? 'Modifier la formation' : 'Nouvelle formation'} actions={<AsyncButton className="btn-primary" done="Enregistré" onClick={save}><Save className="h-4 w-4" />Enregistrer</AsyncButton>}>
      {err && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="card space-y-4 p-6">
          <h2 className="font-semibold text-green">Informations</h2>
          <div><label className="label" htmlFor="f-title">Titre</label><input id="f-title" className="input" value={c.title} onChange={(e) => set({ title: e.target.value, ...(orig ? {} : { slug: slugify(e.target.value) }) })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="f-slug">Slug (URL)</label><input id="f-slug" className="input" value={c.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} /></div>
            <div><label className="label" htmlFor="f-sub">Sous-titre</label><input id="f-sub" className="input" value={c.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></div>
          </div>
          <div><label className="label" htmlFor="f-desc">Description</label><textarea id="f-desc" rows={5} className="input" value={c.description} onChange={(e) => set({ description: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-4">
            <div><label className="label" htmlFor="f-price">Prix (€)</label><input id="f-price" type="number" min={0} step={1} className="input num" value={c.price} onChange={(e) => set({ price: Number(e.target.value) })} /></div>
            <div><label className="label" htmlFor="f-dur">Durée</label><input id="f-dur" className="input" value={c.duration} onChange={(e) => set({ duration: e.target.value })} /></div>
            <div><label className="label" htmlFor="f-pil">Pilier</label><select id="f-pil" className="input" value={c.pillar} onChange={(e) => set({ pillar: e.target.value })}>{pillars.map((p) => <option key={p}>{p}</option>)}</select></div>
            <div><label className="label" htmlFor="f-lvl">Niveau</label><select id="f-lvl" className="input" value={c.level} onChange={(e) => set({ level: e.target.value as Course['level'] })}>{['Débutant', 'Intermédiaire', 'Tous niveaux'].map((p) => <option key={p}>{p}</option>)}</select></div>
          </div>
          <div><label className="label" htmlFor="f-out">Objectifs (un par ligne)</label><textarea id="f-out" rows={3} className="input" value={c.outcomes.join('\n')} onChange={(e) => set({ outcomes: e.target.value.split('\n') })} /></div>
          <div><label className="label" htmlFor="f-ver">Passages bibliques (références, séparées par des virgules)</label><input id="f-ver" className="input" value={c.verses.join(', ')} onChange={(e) => set({ verses: e.target.value.split(',').map((s) => s.trim()) })} /></div>
        </section>
        <section className="space-y-6">
          <div className="card p-6"><h2 className="font-semibold text-green">Statut</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">{(['published', 'draft'] as const).map((s) => <button key={s} onClick={() => set({ status: s })} aria-pressed={c.status === s} className={`btn border ${c.status === s ? 'border-green bg-green text-cream' : 'border-line bg-white text-mute'}`}>{s === 'published' ? 'Publiée' : 'Brouillon'}</button>)}</div>
            <p className="mt-2 text-xs text-mute">Les modifications enregistrées apparaissent immédiatement sur le site public.</p></div>
          <div className="card p-6"><h2 className="font-semibold text-green">Image de couverture</h2>
            <Cover src={c.cover} alt="Aperçu de la couverture" className="mt-3 aspect-[16/10] w-full rounded-xl" />
            <input ref={coverIn} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) set({ cover: await putFile(f) }); e.target.value = '' }} />
            <button className="btn-ghost mt-3 w-full" onClick={() => coverIn.current?.click()}><ImagePlus className="h-4 w-4" />Téléverser une image</button></div>
        </section>
      </div>
      <section className="mt-6">
        <div className="flex items-center justify-between"><h2 className="display text-3xl font-semibold text-green">Contenu</h2><button className="btn-ghost" onClick={() => setMods((m) => [...m, { id: uid('m'), title: `Module ${m.length + 1}`, lessons: [] }])}><Plus className="h-4 w-4" />Ajouter un module</button></div>
        <p className="mt-1 text-sm text-mute">Glissez-déposez ou utilisez les flèches pour réordonner les modules et les leçons.</p>
        <div className="mt-4 space-y-4">{c.modules.map((m, mi) => <ModuleEditor key={m.id} m={m} i={mi} n={c.modules.length}
          onChange={(nm) => setMods((ms) => ms.map((x) => (x.id === m.id ? nm : x)))} onMove={(d) => setMods((ms) => move(ms, mi, mi + d))} onDrop={(from) => setMods((ms) => move(ms, from, mi))}
          onDelete={() => setMods((ms) => ms.filter((x) => x.id !== m.id))} />)}</div>
      </section>
    </AdminLayout>
  )
}

function ModuleEditor({ m, i, n, onChange, onMove, onDrop, onDelete }: { m: Module; i: number; n: number; onChange: (m: Module) => void; onMove: (d: number) => void; onDrop: (from: number) => void; onDelete: () => void }) {
  const [open, setOpen] = useState<string | null>(null)
  const setL = (ls: Lesson[]) => onChange({ ...m, lessons: ls })
  const add = (kind: Lesson['kind']) => { const l: Lesson = { id: uid('l'), title: kind === 'quiz' ? 'Nouveau quiz' : 'Nouvelle leçon', kind, duration: kind === 'quiz' ? '3 questions' : '8 min', transcript: '', pdfs: [], ...(kind === 'video' ? { video: { type: 'demo', src: '' } } : {}), ...(kind === 'quiz' ? { quiz: [{ q: 'Question ?', options: ['Réponse A', 'Réponse B'], answer: 0 }] } : {}) }; setL([...m.lessons, l]); setOpen(l.id) }
  return (
    <div className="card" draggable onDragStart={(e) => { e.dataTransfer.setData('mod', String(i)) }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const f = e.dataTransfer.getData('mod'); if (f !== '') onDrop(Number(f)) }}>
      <div className="flex items-center gap-2 border-b border-line p-4">
        <GripVertical className="h-4 w-4 cursor-grab text-mute" aria-hidden />
        <span className="caps text-[11px] font-bold text-gold-deep">Module {i + 1}</span>
        <label className="flex-1"><span className="sr-only">Titre du module</span><input className="input py-1.5 font-semibold" value={m.title} onChange={(e) => onChange({ ...m, title: e.target.value })} /></label>
        <Tip label="Monter"><button className="rounded-lg p-2 text-mute hover:bg-sand disabled:opacity-30" disabled={i === 0} onClick={() => onMove(-1)} aria-label="Monter le module"><ArrowUp className="h-4 w-4" /></button></Tip>
        <Tip label="Descendre"><button className="rounded-lg p-2 text-mute hover:bg-sand disabled:opacity-30" disabled={i === n - 1} onClick={() => onMove(1)} aria-label="Descendre le module"><ArrowDown className="h-4 w-4" /></button></Tip>
        <Tip label="Supprimer le module"><button className="rounded-lg p-2 text-mute hover:bg-red-50 hover:text-red-600" onClick={onDelete} aria-label="Supprimer le module"><Trash2 className="h-4 w-4" /></button></Tip>
      </div>
      <ul className="divide-y divide-line">{m.lessons.map((l, li) => { const I = { video: PlayCircle, reading: BookOpen, quiz: FileQuestion }[l.kind]; return (
        <li key={l.id} draggable onDragStart={(e) => { e.stopPropagation(); e.dataTransfer.setData('les', String(li)) }} onDrop={(e) => { const f = e.dataTransfer.getData('les'); if (f !== '') { e.stopPropagation(); setL(move(m.lessons, Number(f), li)) } }}>
          <div className="flex items-center gap-2 px-4 py-2.5">
            <GripVertical className="h-4 w-4 cursor-grab text-mute" aria-hidden /><I className="h-4 w-4 text-gold-deep" />
            <button className="flex-1 text-left text-sm font-medium" onClick={() => setOpen(open === l.id ? null : l.id)}>{l.title} <span className="text-xs text-mute">· {l.duration}{l.pdfs.length ? ` · ${l.pdfs.length} PDF` : ''}</span></button>
            <button className="rounded-lg p-1.5 text-mute hover:bg-sand disabled:opacity-30" disabled={li === 0} onClick={() => setL(move(m.lessons, li, li - 1))} aria-label="Monter la leçon"><ArrowUp className="h-3.5 w-3.5" /></button>
            <button className="rounded-lg p-1.5 text-mute hover:bg-sand disabled:opacity-30" disabled={li === m.lessons.length - 1} onClick={() => setL(move(m.lessons, li, li + 1))} aria-label="Descendre la leçon"><ArrowDown className="h-3.5 w-3.5" /></button>
            <button className="rounded-lg p-1.5 text-mute hover:bg-red-50 hover:text-red-600" onClick={() => setL(m.lessons.filter((x) => x.id !== l.id))} aria-label="Supprimer la leçon"><Trash2 className="h-3.5 w-3.5" /></button>
            <ChevronDown className={`h-4 w-4 text-mute transition ${open === l.id ? 'rotate-180' : ''}`} />
          </div>
          {open === l.id && <LessonEditor l={l} onChange={(nl) => setL(m.lessons.map((x) => (x.id === l.id ? nl : x)))} />}
        </li>) })}</ul>
      <div className="flex flex-wrap gap-2 p-4">{([['video', 'Vidéo', PlayCircle], ['reading', 'Lecture', BookOpen], ['quiz', 'Quiz', FileQuestion]] as const).map(([k, lb, I]) => <button key={k} className="btn-ghost py-1.5" onClick={() => add(k)}><Plus className="h-3.5 w-3.5" /><I className="h-3.5 w-3.5" />{lb}</button>)}</div>
    </div>
  )
}

function LessonEditor({ l, onChange }: { l: Lesson; onChange: (l: Lesson) => void }) {
  const set = (p: Partial<Lesson>) => onChange({ ...l, ...p })
  const vIn = useRef<HTMLInputElement>(null); const pIn = useRef<HTMLInputElement>(null)
  const vUrl = useFileUrl(l.video?.type === 'file' ? l.video.src : undefined)
  return (
    <div className="space-y-4 bg-sand/40 px-4 py-5 sm:px-10">
      <div className="grid gap-3 sm:grid-cols-[1fr_10rem]"><div><label className="label" htmlFor={`t-${l.id}`}>Titre</label><input id={`t-${l.id}`} className="input" value={l.title} onChange={(e) => set({ title: e.target.value })} /></div><div><label className="label" htmlFor={`d-${l.id}`}>Durée</label><input id={`d-${l.id}`} className="input" value={l.duration} onChange={(e) => set({ duration: e.target.value })} /></div></div>
      {l.kind === 'video' && <div><p className="label">Vidéo</p>
        <div className="flex flex-wrap gap-2">{([['demo', 'Démo simulée'], ['file', 'Fichier'], ['url', 'Lien / YouTube']] as const).map(([k, lb]) => <button key={k} onClick={() => set({ video: { type: k, src: k === l.video?.type ? l.video.src : '' } })} className={`btn border py-1.5 ${l.video?.type === k ? 'border-green bg-green text-cream' : 'border-line bg-white text-mute'}`}>{lb}</button>)}</div>
        {l.video?.type === 'file' && <div className="mt-3"><input ref={vIn} type="file" accept="video/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { if (l.video?.src) delFile(l.video.src); set({ video: { type: 'file', src: await putFile(f) } }) } e.target.value = '' }} />
          {vUrl && <video src={vUrl} controls className="mb-2 aspect-video w-full max-w-md rounded-xl bg-ink" />}
          <button className="btn-ghost" onClick={() => vIn.current?.click()}><Upload className="h-4 w-4" />{l.video.src ? 'Remplacer la vidéo' : 'Téléverser une vidéo'}</button><p className="mt-1 text-xs text-mute">Stockée localement dans ce navigateur (IndexedDB).</p></div>}
        {l.video?.type === 'url' && <label className="relative mt-3 block"><span className="sr-only">Lien de la vidéo</span><Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" /><input className="input pl-9" placeholder="https://www.youtube.com/watch?v=…" value={l.video.src} onChange={(e) => set({ video: { type: 'url', src: e.target.value } })} /></label>}
      </div>}
      {l.kind !== 'quiz' && <div><label className="label" htmlFor={`tr-${l.id}`}>{l.kind === 'video' ? 'Transcription complète' : 'Texte de la leçon'} (markdown : ## titre, - liste)</label><textarea id={`tr-${l.id}`} rows={8} className="input font-mono text-xs" value={l.transcript} onChange={(e) => set({ transcript: e.target.value })} /></div>}
      {l.kind === 'quiz' && <QuizEditor qs={l.quiz ?? []} onChange={(quiz) => set({ quiz, duration: `${quiz.length} questions` })} />}
      <div><p className="label">PDF téléchargeables</p>
        <ul className="space-y-1.5">{l.pdfs.map((f) => <li key={f.id} className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-gold-deep" /><span className="flex-1">{f.name} <span className="text-xs text-mute">({Math.round(f.size / 1024)} Ko)</span></span><button onClick={() => { if (f.ref) delFile(f.ref); set({ pdfs: l.pdfs.filter((x) => x.id !== f.id) }) }} aria-label={`Retirer ${f.name}`} className="text-mute hover:text-red-600"><X className="h-4 w-4" /></button></li>)}</ul>
        <input ref={pIn} type="file" accept="application/pdf" multiple className="hidden" onChange={async (e) => { const fs = [...(e.target.files ?? [])]; const add = await Promise.all(fs.map(async (f) => ({ id: uid('p'), name: f.name, size: f.size, ref: await putFile(f) }))); set({ pdfs: [...l.pdfs, ...add] }); e.target.value = '' }} />
        <button className="btn-ghost mt-2 py-1.5" onClick={() => pIn.current?.click()}><Upload className="h-3.5 w-3.5" />Ajouter un PDF</button></div>
    </div>
  )
}

function QuizEditor({ qs, onChange }: { qs: Question[]; onChange: (q: Question[]) => void }) {
  const up = (i: number, p: Partial<Question>) => onChange(qs.map((q, j) => (j === i ? { ...q, ...p } : q)))
  return <div className="space-y-4"><p className="label">Questions (cochez la bonne réponse)</p>
    {qs.map((q, i) => <div key={i} className="rounded-xl border border-line bg-white p-4">
      <div className="flex gap-2"><input className="input" value={q.q} onChange={(e) => up(i, { q: e.target.value })} aria-label={`Question ${i + 1}`} /><button onClick={() => onChange(qs.filter((_, j) => j !== i))} aria-label="Supprimer la question" className="text-mute hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>
      <div className="mt-2 space-y-1.5">{q.options.map((o, j) => <div key={j} className="flex items-center gap-2"><input type="radio" name={`ans-${i}-${q.q.length}`} checked={q.answer === j} onChange={() => up(i, { answer: j })} className="accent-[#015C30]" aria-label="Bonne réponse" /><input className="input py-1.5" value={o} onChange={(e) => up(i, { options: q.options.map((x, k) => (k === j ? e.target.value : x)) })} aria-label={`Réponse ${j + 1}`} /></div>)}
        <button className="text-xs font-semibold text-green" onClick={() => up(i, { options: [...q.options, 'Nouvelle réponse'] })}>+ Réponse</button></div>
    </div>)}
    <button className="btn-ghost py-1.5" onClick={() => onChange([...qs, { q: 'Nouvelle question ?', options: ['Réponse A', 'Réponse B'], answer: 0 }])}><Plus className="h-3.5 w-3.5" />Question</button></div>
}
