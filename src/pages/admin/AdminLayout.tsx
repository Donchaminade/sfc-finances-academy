import { BarChart3, BookOpen, ExternalLink, LogOut, Menu, Users, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Logo } from '../../components/ui'
import { Link, Redirect, navigate, usePath } from '../../lib/router'
import { useSeo } from '../../lib/seo'
import { currentUser, logout, useStore } from '../../lib/store'

const nav = [['/admin', 'Tableau de bord', BarChart3], ['/admin/formations', 'Formations', BookOpen], ['/admin/utilisateurs', 'Utilisateurs', Users]] as const

export function AdminLayout({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  useStore(); const path = usePath(); const [open, setOpen] = useState(false)
  useSeo({ title: `Admin · ${title}`, description: 'Administration SFC Finances.', path, noindex: true })
  const u = currentUser()
  if (!u) return <Redirect to={`/connexion?next=${path}`} />
  if (u.role !== 'admin') return <div className="grid min-h-dvh place-items-center bg-cream p-6 text-center"><div><h1 className="display text-4xl font-semibold text-green">Accès réservé</h1><p className="mt-3 text-mute">Cet espace est réservé aux administrateurs.</p><Link to="/" className="btn-primary mt-6">Retour au site</Link></div></div>
  const active = (to: string) => (to === '/admin' ? path === '/admin' : path.startsWith(to))
  const side = (
    <div className="flex h-dvh flex-col bg-green-deep text-cream">
      <div className="flex items-center justify-between p-5"><Link to="/admin"><Logo size={40} light /></Link><button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Fermer le menu"><X className="h-5 w-5" /></button></div>
      <p className="caps px-6 text-[10px] text-gold/80">Administration</p>
      <nav className="mt-3 flex-1 space-y-1 px-3">{nav.map(([to, l, I]) => <Link key={to} to={to} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active(to) ? 'bg-cream text-green' : 'text-cream/80 hover:bg-cream/10'}`}><I className="h-4 w-4" />{l}</Link>)}
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/70 hover:bg-cream/10"><ExternalLink className="h-4 w-4" />Voir le site</Link></nav>
      <div className="border-t border-cream/10 p-4">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-sm font-bold text-green-deep">{u.name[0]}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{u.name}</p><p className="truncate text-xs text-cream/60">Administrateur</p></div></div>
        <button className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-cream/80 hover:bg-cream/10" onClick={() => { logout(); navigate('/') }}><LogOut className="h-4 w-4" />Se déconnecter</button>
      </div>
    </div>
  )
  return (
    <div className="flex min-h-dvh bg-cream">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 lg:block">{side}</aside>
      {open && <div className="fixed inset-0 z-50 flex lg:hidden"><div className="w-64">{side}</div><div className="flex-1 bg-ink/30" onClick={() => setOpen(false)} /></div>}
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-cream/90 px-4 py-4 backdrop-blur sm:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir le menu"><Menu className="h-5 w-5 text-green" /></button>
          <h1 className="display flex-1 truncate text-3xl font-semibold text-green">{title}</h1>{actions}
        </header>
        <div className="p-4 sm:p-8">{children}</div>
      </main>
    </div>
  )
}

export function Tip({ label, children }: { label: string; children: ReactNode }) {
  return <span className="group relative inline-flex">{children}<span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[11px] text-cream opacity-0 transition group-hover:opacity-100">{label}</span></span>
}
