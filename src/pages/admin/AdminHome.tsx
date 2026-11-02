import { Award, BookOpen, Euro, TrendingUp, Users } from 'lucide-react'
import { Item, Stagger } from '../../components/motion'
import { Bar } from '../../components/ProgressRing'
import { Link } from '../../lib/router'
import { eur, getCerts, getCourses, getProgress, getPurchases, getUsers, percent, useStore } from '../../lib/store'
import { AdminLayout } from './AdminLayout'

export function stats() {
  const users = getUsers().filter((u) => u.role === 'learner'); const courses = getCourses()
  const sales = users.flatMap((u) => getPurchases(u.id).map((p) => ({ ...p, user: u })))
  const enroll = users.flatMap((u) => courses.filter((c) => getPurchases(u.id).some((p) => p.item === c.slug)).map((c) => ({ u, c, pct: percent(c, getProgress(u.id, c.slug)) })))
  const completion = enroll.length ? Math.round((enroll.filter((e) => e.pct === 100).length / enroll.length) * 100) : 0
  const avg = enroll.length ? Math.round(enroll.reduce((s, e) => s + e.pct, 0) / enroll.length) : 0
  return { users, courses, sales, enroll, completion, avg, revenue: sales.reduce((s, p) => s + p.amount, 0) }
}

export default function AdminHome() {
  useStore(); const s = stats()
  const kpis = [['Apprenants', s.users.length, Users], ['Ventes', eur(s.revenue), Euro], ['Taux de complétion', `${s.completion} %`, Award], ['Progression moyenne', `${s.avg} %`, TrendingUp]] as const
  return (
    <AdminLayout title="Tableau de bord">
      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([l, v, I]) => <Item key={l} className="card p-5"><div className="flex items-center justify-between"><p className="text-sm text-mute">{l}</p><span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-soft text-gold-deep"><I className="h-4 w-4" /></span></div><p className="num display mt-3 text-4xl font-semibold text-green">{v}</p></Item>)}</Stagger>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="card p-5"><h2 className="font-semibold text-green">Ventes récentes</h2>
          <div className="scroll-thin mt-3 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs text-mute"><th className="py-2">Apprenant</th><th>Article</th><th>Moyen</th><th className="text-right">Montant</th></tr></thead>
            <tbody className="divide-y divide-line">{[...s.sales].sort((a, b) => b.date - a.date).slice(0, 8).map((p) => <tr key={p.ref + p.user.id}><td className="py-2.5"><Link to={`/admin/utilisateurs/${p.user.id}`} className="font-medium text-green hover:underline">{p.user.name}</Link></td><td className="max-w-48 truncate">{s.courses.find((c) => c.slug === p.item)?.title ?? p.item}</td><td>{p.method}</td><td className="num text-right font-semibold">{eur(p.amount)}</td></tr>)}</tbody></table></div></section>
        <section className="card p-5"><h2 className="font-semibold text-green">Formations</h2>
          <ul className="mt-3 space-y-4">{s.courses.map((c) => { const en = s.enroll.filter((e) => e.c.slug === c.slug); const avg = en.length ? Math.round(en.reduce((a, e) => a + e.pct, 0) / en.length) : 0; return <li key={c.slug}><div className="mb-1 flex justify-between text-sm"><span className="truncate font-medium">{c.title}</span><span className="text-xs text-mute">{en.length} inscrit{en.length > 1 ? 's' : ''} · {avg}%</span></div><Bar value={avg} /></li> })}</ul>
          <p className="mt-4 flex items-center gap-2 text-xs text-mute"><BookOpen className="h-3.5 w-3.5" />{s.courses.filter((c) => c.status === 'published').length} publiées · {s.courses.filter((c) => c.status === 'draft').length} brouillon(s) · {getCerts().length} certificat(s)</p></section>
      </div>
    </AdminLayout>
  )
}
