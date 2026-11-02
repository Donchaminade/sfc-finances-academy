import { Eye, EyeOff, UserRound, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Reveal } from '../components/motion'
import { DemoNote, Logo } from '../components/ui'
import { brand, odile } from '../content/brand'
import { DEMO_ADMIN, DEMO_LEARNER } from '../data/demo'
import { Link, navigate } from '../lib/router'
import { useSeo } from '../lib/seo'
import { login, register } from '../lib/store'

export default function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const signup = mode === 'signup'
  useSeo({ title: signup ? 'Créer un compte' : 'Connexion', description: signup ? 'Créez votre compte SFC Finances et commencez votre parcours d’éducation financière.' : 'Connectez-vous à votre espace SFC Finances.', path: signup ? '/inscription' : '/connexion', noindex: true })
  const next = new URLSearchParams(location.search).get('next') || ''
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' })
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [show, setShow] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr('')
    if (signup && f.password.length < 8) return setErr('Le mot de passe doit contenir au moins 8 caractères.')
    if (signup && f.password !== f.confirm) return setErr('Les mots de passe ne correspondent pas.')
    setBusy(true)
    try {
      if (signup) await register(f.name, f.email, f.password)
      const u = await login(f.email, f.password)
      navigate(next.startsWith('/') ? next : u.role === 'admin' ? '/admin' : '/mon-espace')
    } catch (x) { setErr((x as Error).message) } finally { setBusy(false) }
  }
  const fill = (a: typeof DEMO_LEARNER) => setF({ name: a.name, email: a.email, password: a.password, confirm: a.password })
  return (
    <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2">
      <Reveal className="hidden md:block">
        <div className="relative overflow-hidden rounded-3xl bg-green p-10 text-cream">
          <Logo size={60} light />
          <p className="display mt-8 text-3xl italic leading-snug">« {brand.slogan} »</p>
          <p className="mt-5 text-cream/80">{brand.mission}</p>
          <div className="mt-8 flex items-center gap-3"><img src={odile.portraitSmall} alt="Avatar d’Odile T." className="h-12 w-12 rounded-full object-cover ring-2 ring-gold" /><p className="text-sm">{brand.withOdile}</p></div>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <form onSubmit={submit} className="card mx-auto w-full max-w-md space-y-4 p-7">
          <div className="md:hidden"><Logo /></div>
          <h1 className="display text-4xl font-semibold text-green">{signup ? 'Créer un compte' : 'Bon retour !'}</h1>
          <p className="text-sm text-mute">{signup ? 'Quelques secondes pour commencer votre parcours.' : 'Connectez-vous pour reprendre vos formations.'}</p>
          {signup && <div><label className="label" htmlFor="a-name">Nom complet</label><input id="a-name" className="input" required autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>}
          <div><label className="label" htmlFor="a-mail">E-mail</label><input id="a-mail" type="email" className="input" required autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div><label className="label" htmlFor="a-pw">Mot de passe</label><div className="relative"><input id="a-pw" type={show ? 'text' : 'password'} className="input pr-11" required autoComplete={signup ? 'new-password' : 'current-password'} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mute" aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
          {signup && <div><label className="label" htmlFor="a-pw2">Confirmer le mot de passe</label><input id="a-pw2" type={show ? 'text' : 'password'} className="input" required autoComplete="new-password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} /></div>}
          {err && <p role="alert" className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{err}</p>}
          <button className="btn-primary w-full py-3" disabled={busy}>{busy ? 'Patientez…' : signup ? 'Créer mon compte' : 'Se connecter'}</button>
          <p className="text-center text-sm text-mute">{signup ? <>Déjà inscrit ? <Link to={`/connexion${next ? `?next=${next}` : ''}`} className="font-semibold text-green">Se connecter</Link></> : <>Nouveau ? <Link to={`/inscription${next ? `?next=${next}` : ''}`} className="font-semibold text-green">Créer un compte</Link></>}</p>
          {!signup && <div className="space-y-2 border-t border-line pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-mute">Comptes de démonstration</p>
            <div className="flex gap-2"><button type="button" className="btn-ghost flex-1" onClick={() => fill(DEMO_LEARNER)}><UserRound className="h-4 w-4" />Apprenant</button><button type="button" className="btn-ghost flex-1" onClick={() => fill(DEMO_ADMIN)}><ShieldCheck className="h-4 w-4" />Admin</button></div>
          </div>}
          <DemoNote>Démonstration : vos données restent dans ce navigateur uniquement.</DemoNote>
        </form>
      </Reveal>
    </div>
  )
}
