import { Eye, EyeOff, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Cover, Modal } from '../../components/ui'
import { Link, navigate } from '../../lib/router'
import { deleteCourse, eur, getCourses, lessonsOf, resetCourses, saveCourse, useStore } from '../../lib/store'
import { AdminLayout, Tip } from './AdminLayout'

export default function AdminCourses() {
  useStore(); const [del, setDel] = useState<string | null>(null); const [reset, setReset] = useState(false)
  const list = getCourses()
  return (
    <AdminLayout title="Formations" actions={<><Tip label="Restaurer le catalogue d’origine"><button className="btn-ghost px-3" onClick={() => setReset(true)} aria-label="Restaurer"><RotateCcw className="h-4 w-4" /></button></Tip><Link to="/admin/formations/nouvelle" className="btn-primary"><Plus className="h-4 w-4" />Nouvelle</Link></>}>
      <div className="card scroll-thin overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead><tr className="border-b border-line text-left text-xs text-mute"><th className="p-4">Formation</th><th>Statut</th><th>Prix</th><th>Contenu</th><th>Mise à jour</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-line">{list.map((c) => <tr key={c.slug} className="hover:bg-sand/40">
            <td className="p-4"><div className="flex items-center gap-3"><Cover src={c.cover} alt="" className="h-11 w-16 rounded-lg" /><div><p className="font-semibold text-green">{c.title}</p><p className="text-xs text-mute">/{c.slug}</p></div></div></td>
            <td><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.status === 'published' ? 'bg-green-soft text-green' : 'bg-gold-soft text-gold-deep'}`}>{c.status === 'published' ? 'Publiée' : 'Brouillon'}</span></td>
            <td className="num">{eur(c.price)}</td><td className="text-mute">{c.modules.length} mod. · {lessonsOf(c).length} leçons</td>
            <td className="text-xs text-mute">{c.updatedAt ? new Date(c.updatedAt).toLocaleDateString('fr-FR') : 'Origine'}</td>
            <td className="p-4"><div className="flex justify-end gap-1">
              <Tip label={c.status === 'published' ? 'Passer en brouillon' : 'Publier'}><button className="rounded-lg p-2 text-mute hover:bg-sand hover:text-green" aria-label={c.status === 'published' ? 'Passer en brouillon' : 'Publier'} onClick={() => saveCourse({ ...c, status: c.status === 'published' ? 'draft' : 'published' })}>{c.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></Tip>
              <Tip label="Modifier"><button className="rounded-lg p-2 text-mute hover:bg-sand hover:text-green" aria-label="Modifier" onClick={() => navigate(`/admin/formations/${c.slug}`)}><Pencil className="h-4 w-4" /></button></Tip>
              <Tip label="Supprimer"><button className="rounded-lg p-2 text-mute hover:bg-red-50 hover:text-red-600" aria-label="Supprimer" onClick={() => setDel(c.slug)}><Trash2 className="h-4 w-4" /></button></Tip>
            </div></td></tr>)}</tbody>
        </table>
      </div>
      <Modal open={!!del} onClose={() => setDel(null)} title="Supprimer la formation ?"><p className="text-sm text-mute">Cette action retire la formation du catalogue. Les apprenants n’y auront plus accès.</p><div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={() => setDel(null)}>Annuler</button><button className="btn bg-red-600 text-white hover:bg-red-700" onClick={() => { deleteCourse(del!); setDel(null) }}>Supprimer</button></div></Modal>
      <Modal open={reset} onClose={() => setReset(false)} title="Restaurer le catalogue ?"><p className="text-sm text-mute">Toutes les modifications des formations seront remplacées par le contenu d’origine.</p><div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={() => setReset(false)}>Annuler</button><button className="btn-primary" onClick={() => { resetCourses(); setReset(false) }}>Restaurer</button></div></Modal>
    </AdminLayout>
  )
}
