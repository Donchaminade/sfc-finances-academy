import { AnimatePresence, motion } from 'motion/react'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, navigate, usePath } from '../lib/router'
import { currentUser, logout, useStore } from '../lib/store'
import { Logo } from './ui'

const links = [['/', 'Accueil'], ['/formations', 'Formations'], ['/a-propos', 'À propos'], ['/#tarifs', 'Tarifs'], ['/#contact', 'Contact']] as const

export function Navbar() {
  useStore(); const path = usePath(); const u = currentUser(); const [open, setOpen] = useState(false)
  const active = (to: string) => (to === '/' ? path === '/' : !to.includes('#') && path.startsWith(to))
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Navigation principale">
        <Link to="/" aria-label="SFC Finances, accueil"><Logo size={42} /></Link>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map(([to, l]) => <li key={to}><Link to={to} className={`relative rounded-full px-3 py-2 text-sm font-medium transition ${active(to) ? 'text-green' : 'text-mute hover:text-green'}`}>{l}{active(to) && <motion.span layoutId="nav" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded bg-gold" />}</Link></li>)}
        </ul>
        <div className="hidden items-center gap-2 md:flex">
          {u ? <>
            {u.role === 'admin' && <Link to="/admin" className="btn-ghost">Administration</Link>}
            <Link to="/mon-espace" className="btn-primary">Mon espace</Link>
            <button className="btn px-3 text-mute hover:text-green" onClick={() => { logout(); navigate('/') }} aria-label="Se déconnecter" title="Se déconnecter"><LogOut className="h-4 w-4" /></button>
          </> : <>
            <Link to="/connexion" className="btn px-3 text-green hover:text-green-deep">Connexion</Link>
            <Link to="/inscription" className="btn-primary">Commencer</Link>
          </>}
        </div>
        <button className="rounded-full p-2 text-green md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </nav>
      <AnimatePresence>
        {open && <motion.div className="border-t border-line bg-cream px-4 pb-4 md:hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
          <ul className="py-2">{links.map(([to, l]) => <li key={to}><Link to={to} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-2.5 font-medium text-green">{l}</Link></li>)}</ul>
          <div className="flex gap-2">{u ? <>
            <Link to="/mon-espace" onClick={() => setOpen(false)} className="btn-primary flex-1">Mon espace</Link>
            {u.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)} className="btn-ghost flex-1">Admin</Link>}
            <button className="btn-ghost" onClick={() => { logout(); setOpen(false); navigate('/') }} aria-label="Se déconnecter"><LogOut className="h-4 w-4" /></button>
          </> : <><Link to="/connexion" onClick={() => setOpen(false)} className="btn-ghost flex-1">Connexion</Link><Link to="/inscription" onClick={() => setOpen(false)} className="btn-primary flex-1">Commencer</Link></>}</div>
        </motion.div>}
      </AnimatePresence>
    </header>
  )
}
