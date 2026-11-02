import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, CreditCard, Lock, ShieldCheck, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { AsyncButton, Cover, DemoNote } from '../components/ui'
import { Link, Redirect } from '../lib/router'
import { useSeo } from '../lib/seo'
import { addPurchase, currentUser, eur, fcfa, getCourse, lessonsOf, owns, useStore } from '../lib/store'
import NotFound from './NotFound'


export default function Checkout({ item }: { item: string }) {
  useStore()
  useSeo({ title: 'Paiement', description: 'Finalisez votre accès à la formation.', path: `/paiement/${item}`, noindex: true })
  const u = currentUser()
  const c = getCourse(item)
  const [method, setMethod] = useState<'momo' | 'card'>('momo')
  const [op, setOp] = useState<'Flooz' | 'T-Money'>('Flooz')
  const [step, setStep] = useState(1)
  const [ref, setRef] = useState('')
  if (!u) return <Redirect to={`/connexion?next=/paiement/${item}`} />
  if (!c || c.status !== 'published') return <NotFound />
  const title = c.title
  const price = c.price
  if (step === 1 && owns(u.id, c.slug)) return <div className="mx-auto max-w-lg px-4 py-24 text-center"><h1 className="display text-4xl font-semibold text-green">Vous avez déjà accès</h1><Link to={`/formations/${c.slug}`} className="btn-primary mt-6">Aller à la formation</Link></div>

  const pay = async () => {
    await new Promise((r) => setTimeout(r, 1600))
    const r = 'SFC-' + Date.now().toString(36).toUpperCase()
    addPurchase(u.id, { item, amount: price, method: method === 'card' ? 'Carte' : op, date: Date.now(), ref: r })
    setRef(r); setTimeout(() => setStep(3), 600)
  }
  const first = lessonsOf(c)[0]?.id
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="display text-4xl font-semibold text-green sm:text-5xl">Paiement sécurisé</h1>
      <ol className="mt-6 flex gap-2 text-xs font-semibold" aria-label="Étapes">{['Moyen de paiement', 'Confirmation', 'Accès'].map((s, i) => <li key={s} className={`flex-1 rounded-full px-3 py-2 text-center ${step > i ? 'bg-green text-cream' : 'bg-sand text-mute'}`}>{i + 1}. {s}</li>)}</ol>
      <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr]">
        <div className="card p-6">
          <AnimatePresence mode="wait">
            {step === 1 && <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="display text-2xl font-semibold text-green">Choisissez votre moyen de paiement</h2>
              <div className="grid grid-cols-2 gap-3" role="radiogroup">
                {([['momo', 'Mobile Money', Smartphone], ['card', 'Carte bancaire', CreditCard]] as const).map(([k, l, I]) => <button key={k} role="radio" aria-checked={method === k} onClick={() => setMethod(k)} className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition active:scale-[.98] ${method === k ? 'border-green bg-green-soft' : 'border-line hover:border-green/40'}`}><I className="h-6 w-6 text-green" /><span className="font-semibold text-green">{l}</span></button>)}
              </div>
              {method === 'momo' ? <div className="space-y-4">
                <div className="flex gap-2">{(['Flooz', 'T-Money'] as const).map((o) => <button key={o} onClick={() => setOp(o)} aria-pressed={op === o} className={`btn flex-1 border ${op === o ? 'border-gold-deep bg-gold-soft text-green-deep' : 'border-line bg-white text-mute'}`}>{o}</button>)}</div>
                <div><label className="label" htmlFor="p-tel">Numéro {op} (démo)</label><div className="flex"><span className="grid place-items-center rounded-l-xl border border-r-0 border-line bg-sand px-3 text-sm">+228</span><input id="p-tel" className="input rounded-l-none" defaultValue={op === 'Flooz' ? '99 00 00 00' : '90 00 00 00'} inputMode="tel" /></div></div>
              </div> : <div className="space-y-4">
                <div><label className="label" htmlFor="p-card">Numéro de carte (démo)</label><input id="p-card" className="input num" defaultValue="4242 4242 4242 4242" readOnly /></div>
                <div className="grid grid-cols-2 gap-3"><div><label className="label" htmlFor="p-exp">Expiration</label><input id="p-exp" className="input num" defaultValue="12 / 30" readOnly /></div><div><label className="label" htmlFor="p-cvc">CVC</label><input id="p-cvc" className="input num" defaultValue="123" readOnly /></div></div>
              </div>}
              <DemoNote><strong>Paiement de démonstration.</strong> Aucune somme n’est débitée et aucune donnée bancaire réelle n’est demandée. N’entrez jamais vos vraies coordonnées.</DemoNote>
              <button className="btn-primary w-full py-3" onClick={() => setStep(2)}>Continuer</button>
            </motion.div>}
            {step === 2 && <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="display text-2xl font-semibold text-green">Confirmez le paiement</h2>
              {method === 'momo' ? <p className="text-mute">Une demande de paiement {op} (simulée) va être envoyée. Sur un vrai paiement, vous valideriez avec votre code secret sur votre téléphone.</p> : <p className="text-mute">Votre carte de démonstration va être débitée de façon simulée.</p>}
              <div className="rounded-2xl bg-sand p-4 text-sm"><p className="flex justify-between"><span>Montant</span><strong className="num">{eur(price)}</strong></p><p className="flex justify-between text-mute"><span>Équivalent</span><span className="num">≈ {fcfa(price)}</span></p><p className="flex justify-between text-mute"><span>Moyen</span><span>{method === 'card' ? 'Carte' : op}</span></p></div>
              <div className="flex gap-3"><button className="btn-ghost" onClick={() => setStep(1)}>Retour</button><AsyncButton className="btn-gold flex-1 py-3" done="Paiement accepté" onClick={pay}><Lock className="h-4 w-4" /> Payer {eur(price)}</AsyncButton></div>
            </motion.div>}
            {step === 3 && <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} className="inline-grid h-20 w-20 place-items-center rounded-full bg-green text-gold"><CheckCircle2 className="h-10 w-10" /></motion.span>
              <h2 className="display mt-5 text-3xl font-semibold text-green">Paiement confirmé</h2>
              <p className="mt-2 text-mute">Référence (démo) : <span className="num font-semibold">{ref}</span></p>
              <p className="mt-1 text-mute">Votre accès à « {title} » est actif.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {first ? <Link to={`/apprendre/${c.slug}/${first}`} className="btn-primary px-6 py-3">Commencer la formation</Link> : <Link to="/mon-espace" className="btn-primary px-6 py-3">Accéder à mes formations</Link>}
                <Link to="/mon-espace" className="btn-ghost">Mon espace</Link>
              </div>
            </motion.div>}
          </AnimatePresence>
        </div>
        <aside className="card h-fit overflow-hidden">
          <Cover src={c.cover} alt={`Illustration de la formation ${c.title}`} className="aspect-[16/9] w-full" />
          <div className="p-5">
            <h2 className="font-semibold text-green">{title}</h2>
            <p className="mt-1 text-sm text-mute">{`${lessonsOf(c).length} leçons · ${c.duration} · accès à vie · certificat`}</p>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4"><span className="text-sm text-mute">Total</span><span className="num display text-3xl font-semibold text-green">{eur(price)}</span></div>
            <p className="mt-3 flex items-center gap-2 text-xs text-mute"><ShieldCheck className="h-4 w-4 text-green" />Paiement simulé, sans données réelles</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
