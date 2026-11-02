import { Award, ChevronRight, Search } from 'lucide-react'
import { useState } from 'react'
import { Bar, ProgressRing } from '../../components/ProgressRing'
import { Link } from '../../lib/router'
import { eur, getCourses, getProgress, getPurchases, getUsers, lessonsOf, ownedCourses, percent, useStore, userCerts } from '../../lib/store'
import { AdminLayout } from './AdminLayout'

const ago = (t: number) => { const d = Math.round((Date.now() - t) / 864e5); return d <= 0 ? 'Aujourd’hui' : d === 1 ? 'Hier' : `Il y a ${d} j` }

export default function AdminUsers() {
  useStore(); const [q, setQ] = useState(''); const [f, setF] = useState('all')
  const rows = getUsers().filter((u) => u.role === 'learner').map((u) => { const cs = ownedCourses(u.id); const pcts = cs.map((c) => percent(c, getProgress(u.id, c.slug))); return { u, cs, avg: pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0, certs: userCerts(u.id).length, spent: getPurchases(u.id).reduce((s, p) => s + p.amount, 0), last: Math.max(u.lastActive, ...cs.map((c) => getProgress(u.id, c.slug).updated)) } })
    .filter((r) => (r.u.name + r.u.email).toLowerCase().includes(q.toLowerCase()) && (f === 'all' || (f === 'buyers' ? r.cs.length > 0 : f === 'certified' ? r.certs > 0 : r.cs.length === 0)))
  return (
    <AdminLayout title="Utilisateurs">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1"><span className="sr-only">Rechercher</span><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" /><input className="input pl-10" placeholder="Nom ou e-mail…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <label><span className="sr-only">Filtrer</span><select className="input sm:w-52" value={f} onChange={(e) => setF(e.target.value)}><option value="all">Tous les apprenants</option><option value="buyers">Avec une formation</option><option value="certified">Certifiés</option><option value="none">Sans achat</option></select></label>
      </div>
      <div className="card scroll-thin overflow-x-auto"><table className="w-full min-w-[820px] text-sm">
        <thead><tr className="border-b border-line text-left text-xs text-mute"><th className="p-4">Apprenant</th><th>Formations</th><th>Progression</th><th>Dépenses</th><th>Dernière activité</th><th>Certificats</th><th /></tr></thead>
        <tbody className="divide-y divide-line">{rows.map(({ u, cs, avg, certs, spent, last }) => <tr key={u.id} className="hover:bg-sand/40">
          <td className="p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-green-soft font-bold text-green">{u.name[0]}</span><div><p className="font-semibold text-green">{u.name}</p><p className="text-xs text-mute">{u.email}</p></div></div></td>
          <td className="max-w-56 text-xs">{cs.length ? cs.map((c) => c.title).join(', ') : <span className="text-mute">Aucune</span>}</td>
          <td><div className="flex w-32 items-center gap-2"><Bar value={avg} /><span className="num text-xs">{avg}%</span></div></td>
          <td className="num">{eur(spent)}</td><td className="text-xs text-mute">{ago(last)}</td>
          <td>{certs ? <span className="inline-flex items-center gap-1 text-gold-deep"><Award className="h-4 w-4" />{certs}</span> : <span className="text-mute">0</span>}</td>
          <td className="pr-4 text-right"><Link to={`/admin/utilisateurs/${u.id}`} className="inline-flex items-center text-sm font-semibold text-green hover:underline">Détail<ChevronRight className="h-4 w-4" /></Link></td></tr>)}</tbody></table>
        {!rows.length && <p className="p-8 text-center text-mute">Aucun apprenant trouvé.</p>}</div>
    </AdminLayout>
  )
}

export function AdminUser({ id }: { id: string }) {
  useStore(); const u = getUsers().find((x) => x.id === id)
  if (!u) return <AdminLayout title="Utilisateur"><p className="text-mute">Utilisateur introuvable.</p></AdminLayout>
  const purchases = getPurchases(u.id); const cs = ownedCourses(u.id); const certs = userCerts(u.id)
  return (
    <AdminLayout title={u.name}>
      <Link to="/admin/utilisateurs" className="text-sm text-mute hover:text-green">← Tous les utilisateurs</Link>
      <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <section className="card p-5"><h2 className="font-semibold text-green">Profil</h2><dl className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><dt className="text-mute">E-mail</dt><dd>{u.email}</dd></div><div className="flex justify-between"><dt className="text-mute">Inscription</dt><dd>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</dd></div><div className="flex justify-between"><dt className="text-mute">Dernière activité</dt><dd>{ago(u.lastActive)}</dd></div><div className="flex justify-between"><dt className="text-mute">Certificats</dt><dd>{certs.length}</dd></div></dl></section>
          <section className="card p-5"><h2 className="font-semibold text-green">Achats</h2><ul className="mt-3 divide-y divide-line text-sm">{purchases.map((p) => <li key={p.ref} className="flex justify-between py-2"><span>{p.item === 'pass' ? 'Pass Sagesse' : getCourses().find((c) => c.slug === p.item)?.title ?? p.item}<br /><span className="text-xs text-mute">{p.method} · {new Date(p.date).toLocaleDateString('fr-FR')}</span></span><span className="num font-semibold">{eur(p.amount)}</span></li>)}{!purchases.length && <li className="py-2 text-mute">Aucun achat.</li>}</ul></section>
        </div>
        <section className="space-y-4">{cs.map((c) => { const p = getProgress(u.id, c.slug); return (
          <div key={c.slug} className="card p-5"><div className="flex items-center gap-4"><ProgressRing value={percent(c, p)} size={56} /><div><h2 className="font-semibold text-green">{c.title}</h2><p className="text-xs text-mute">{p.done.length} / {lessonsOf(c).length} leçons</p></div></div>
            <div className="mt-4 space-y-3">{c.modules.map((m) => <div key={m.id}><p className="text-xs font-semibold text-mute">{m.title}</p><ul className="mt-1 grid gap-1 sm:grid-cols-2">{m.lessons.map((l) => { const d = p.done.includes(l.id); return <li key={l.id} className="flex items-center gap-2 text-xs"><span className={`h-2.5 w-2.5 rounded-full ${d ? 'bg-green' : p.last === l.id ? 'bg-gold' : 'bg-line'}`} />{l.title}{p.quiz[l.id] !== undefined && <span className="text-mute">({p.quiz[l.id]} %)</span>}{p.last === l.id && !d && <span className="text-gold-deep">en cours{p.pos[l.id] ? ` · ${p.pos[l.id]} %` : ''}</span>}</li> })}</ul></div>)}</div>
          </div>) })}{!cs.length && <p className="card p-8 text-center text-mute">Aucune formation.</p>}</section>
      </div>
    </AdminLayout>
  )
}
