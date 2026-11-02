import { ArrowDown, ArrowUp, ExternalLink, ImageUp, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Cover, Modal } from '../../components/ui'
import type { Resource } from '../../content/resources'
import { putFile } from '../../lib/idb'
import { getResources, resetResources, saveResources, useStore } from '../../lib/store'
import { AdminLayout, Tip } from './AdminLayout'

const blank = (): Resource => ({ id: 'r' + crypto.randomUUID().slice(0, 8), kind: 'Livre', title: 'Nouvelle ressource', subtitle: '', author: 'Odile T.', description: '', url: 'https://www.amazon.fr/dp/', cover: '', price: '', format: '' })

export default function AdminResources() {
  useStore()
  const [list, setList] = useState<Resource[]>(() => getResources())
  const [saved, setSaved] = useState(false); const [reset, setReset] = useState(false)
  const up = (i: number, p: Partial<Resource>) => { setSaved(false); setList(list.map((r, j) => (j === i ? { ...r, ...p } : r))) }
  const move = (i: number, d: number) => { const n = [...list]; [n[i], n[i + d]] = [n[i + d], n[i]]; setList(n); setSaved(false) }
  const valid = list.every((r) => r.title.trim() && /^https:\/\//.test(r.url))
  return (
    <AdminLayout title="Ressources" actions={<>
      <Tip label="Restaurer les ressources d’origine"><button className="btn-ghost px-3" aria-label="Restaurer" onClick={() => setReset(true)}><RotateCcw className="h-4 w-4" /></button></Tip>
      <button className="btn-primary" disabled={!valid} onClick={() => { saveResources(list); setSaved(true) }}><Save className="h-4 w-4" />{saved ? 'Enregistré' : 'Enregistrer'}</button></>}>
      <p className="mb-5 max-w-2xl text-sm text-mute">Livres et cahiers affichés sur l’accueil, la page Ressources et le pied de page. Les boutons « Acheter sur Amazon » ouvrent le lien dans un nouvel onglet. Laissez le prix vide pour ne pas l’afficher.</p>
      <div className="space-y-5">
        {list.map((r, i) => <Row key={r.id} r={r} first={i === 0} last={i === list.length - 1} onChange={(p) => up(i, p)} onMove={(d) => move(i, d)} onDelete={() => { setList(list.filter((_, j) => j !== i)); setSaved(false) }} />)}
      </div>
      <button className="btn-ghost mt-5" onClick={() => { setList([...list, blank()]); setSaved(false) }}><Plus className="h-4 w-4" />Ajouter une ressource</button>
      <Modal open={reset} onClose={() => setReset(false)} title="Restaurer les ressources ?"><p className="text-sm text-mute">Les modifications seront remplacées par le livre et le planner d’origine.</p><div className="mt-5 flex justify-end gap-2"><button className="btn-ghost" onClick={() => setReset(false)}>Annuler</button><button className="btn-primary" onClick={() => { resetResources(); setList(getResources()); setReset(false) }}>Restaurer</button></div></Modal>
    </AdminLayout>
  )
}

function Row({ r, first, last, onChange, onMove, onDelete }: { r: Resource; first: boolean; last: boolean; onChange: (p: Partial<Resource>) => void; onMove: (d: number) => void; onDelete: () => void }) {
  const img = useRef<HTMLInputElement>(null)
  const f = (k: keyof Resource, label: string, ph = '') => <div><label className="label" htmlFor={`${r.id}-${k}`}>{label}</label><input id={`${r.id}-${k}`} className="input" value={r[k]} placeholder={ph} onChange={(e) => onChange({ [k]: e.target.value })} /></div>
  return (
    <section className="card grid gap-5 p-5 md:grid-cols-[140px_1fr]">
      <div>
        <Cover src={r.cover} alt={`Couverture : ${r.title}`} fallbackTitle={r.title} className="aspect-[2/3] w-full rounded-lg" />
        <button className="btn-ghost mt-2 w-full px-2 py-1.5 text-xs" onClick={() => img.current?.click()}><ImageUp className="h-3.5 w-3.5" />Couverture</button>
        <input ref={img} type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) onChange({ cover: await putFile(file) }); e.target.value = '' }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {f('title', 'Titre')}{f('subtitle', 'Sous-titre')}{f('kind', 'Type', 'Livre, Cahier…')}{f('format', 'Format', 'Broché, Relié…')}{f('author', 'Auteur')}{f('price', 'Prix affiché (optionnel)', '18,99 €')}
        <div className="sm:col-span-2">{f('url', 'Lien Amazon', 'https://www.amazon.fr/dp/…')}</div>
        <div className="sm:col-span-2"><label className="label" htmlFor={`${r.id}-desc`}>Description</label><textarea id={`${r.id}-desc`} rows={3} className="input" value={r.description} onChange={(e) => onChange({ description: e.target.value })} /></div>
        <div className="flex items-center gap-1 sm:col-span-2">
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-green hover:underline"><ExternalLink className="h-4 w-4" />Tester le lien</a>
          <span className="flex-1" />
          <button disabled={first} onClick={() => onMove(-1)} aria-label="Monter" className="rounded-lg p-2 text-mute hover:bg-sand disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
          <button disabled={last} onClick={() => onMove(1)} aria-label="Descendre" className="rounded-lg p-2 text-mute hover:bg-sand disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
          <button onClick={onDelete} aria-label={`Supprimer ${r.title}`} className="rounded-lg p-2 text-mute hover:bg-sand hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  )
}
