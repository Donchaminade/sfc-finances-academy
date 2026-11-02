import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, BookOpenCheck, Check, ChevronDown, HandHeart, Landmark, Mail, PiggyBank, Route, Scale, Wallet } from 'lucide-react'
import { useState } from 'react'
import { CourseCard } from '../components/CourseCard'
import { Item, Parallax, Reveal, Stagger } from '../components/motion'
import { SocialIcon } from '../components/SocialIcon'
import { AsyncButton, DemoNote, Eyebrow } from '../components/ui'
import { ResourceCard } from '../components/ResourceCard'
import { WHATSAPP_CHANNEL, brand, faq, groupOffer, odile, pillars, socials, testimonials } from '../content/brand'
import { PRICE_NOTE } from '../content/resources'
import { Link } from '../lib/router'
import { courseLd, faqLd, odileLd, useSeo } from '../lib/seo'
import { eur, fcfa, getResources, lessonsOf, publishedCourses, useStore } from '../lib/store'

const icons = [Landmark, Wallet, PiggyBank, Route, Scale, HandHeart]

export default function Landing() {
  useStore()
  const reduce = useReducedMotion()
  useSeo({ title: 'SFC Finances – La sagesse divine au service de vos finances', description: 'Éducation financière chrétienne en français avec Odile T. : deux formations, « Reprendre le contrôle de vos finances » (3 semaines) et « Restaurer et Prospérer » (8 semaines).', path: '/', jsonld: [odileLd, faqLd(faq), ...publishedCourses().map(courseLd)] })
  const courses = publishedCourses()
  const resources = getResources()
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.1fr_.9fr] md:pt-20">
          <div>
            <motion.p className="caps text-xs font-semibold text-gold-deep" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Éducation financière chrétienne</motion.p>
            <motion.h1 className="display mt-4 text-[2.6rem] font-semibold leading-[1.05] text-green sm:text-6xl" initial={reduce ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
              <span className="caps block text-lg tracking-[0.3em] text-ink sm:text-xl">SFC Finances</span>
              La sagesse divine au service de vos finances
            </motion.h1>
            <motion.p className="mt-6 max-w-xl text-lg leading-relaxed text-mute" initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>{brand.intro}</motion.p>
            <motion.div className="mt-8 flex flex-wrap gap-3" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
              <Link to="/formations" className="btn-primary px-6 py-3">Découvrir les formations <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/a-propos" className="btn-ghost px-6 py-3">Notre histoire</Link>
            </motion.div>
            <p className="mt-6 text-sm text-mute">Avec <strong className="text-green">Odile T.</strong>, conseillère en finances personnelles</p>
          </div>
          <Parallax className="relative mx-auto w-full max-w-sm" amount={24}>
            <div className="absolute -inset-3 rounded-t-[200px] rounded-b-3xl border-2 border-gold/70" aria-hidden />
            <picture>
              <source srcSet={`${odile.portraitSmall} 160w, ${odile.portrait} 480w, /images/odile-portrait-960.webp 960w`} sizes="(min-width: 768px) 384px, 90vw" type="image/webp" />
              <img src={odile.portrait} alt="Portrait d’Odile T., conseillère en finances personnelles chez SFC Finances" className="relative aspect-[4/5] w-full rounded-t-[200px] rounded-b-3xl object-cover shadow-lift" width={480} height={600} fetchPriority="high" />
            </picture>
            <div className="card absolute -bottom-5 -left-4 flex items-center gap-3 px-4 py-3">
              <BookOpenCheck className="h-6 w-6 text-gold-deep" /><div><p className="text-sm font-semibold text-green">{courses.length} formations</p><p className="text-xs text-mute">à votre rythme, certifiantes</p></div>
            </div>
          </Parallax>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-green text-cream" aria-labelledby="mission">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
          <Reveal><Eyebrow light>Notre mission</Eyebrow><h2 id="mission" className="display text-4xl font-semibold leading-tight sm:text-5xl">Concilier foi, sagesse et bonne gestion</h2></Reveal>
          <Reveal delay={0.1}><p className="text-lg leading-relaxed text-cream/90">{brand.mission}</p><p className="mt-5 leading-relaxed text-cream/75">{brand.approach}</p></Reveal>
        </div>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" aria-labelledby="piliers">
        <Reveal className="max-w-2xl"><Eyebrow>Ce que vous apprendrez</Eyebrow><h2 id="piliers" className="display text-4xl font-semibold text-green sm:text-5xl">Six piliers pour des finances sereines</h2></Reveal>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => { const I = icons[i]; return (
            <Item key={p.title} className="card p-6 transition hover:-translate-y-1 hover:shadow-lift">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-soft text-gold-deep"><I className="h-6 w-6" /></span>
              <h3 className="display mt-5 text-2xl font-semibold text-green">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{p.text}</p>
            </Item>) })}
        </Stagger>
      </section>

      {/* FORMATIONS */}
      <section className="bg-sand/60" aria-labelledby="formations">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-4"><div><Eyebrow>Nos formations</Eyebrow><h2 id="formations" className="display text-4xl font-semibold text-green sm:text-5xl">Des parcours pas à pas</h2></div><Link to="/formations" className="btn-ghost">Voir les formations <ArrowRight className="h-4 w-4" /></Link></Reveal>
          <p className="mt-4 max-w-2xl text-mute">Deux parcours structurés semaine par semaine, avec Odile T. : vidéos, lectures, cahier d’exercices, quiz et certificat.</p>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-2">{courses.map((c) => <Item key={c.slug}><CourseCard c={c} /></Item>)}</Stagger>
        </div>
      </section>

      {/* ODILE */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2" aria-labelledby="odile">
        <Parallax className="overflow-hidden rounded-3xl shadow-lift" amount={30}>
          <picture><source srcSet={`${odile.teachingSmall} 640w, ${odile.teaching} 1200w`} sizes="(min-width: 768px) 560px, 92vw" type="image/webp" />
            <img src={odile.teaching} loading="lazy" alt="Odile T. animant un enseignement sur les finances personnelles" className="aspect-[4/5] w-full scale-110 object-cover" /></picture>
        </Parallax>
        <Reveal>
          <Eyebrow>Votre formatrice</Eyebrow>
          <h2 id="odile" className="display text-4xl font-semibold text-green sm:text-5xl">Avec Odile T.</h2>
          <p className="display mt-5 text-2xl italic leading-snug text-ink">« {brand.withOdile} »</p>
          <p className="mt-5 leading-relaxed text-mute">{odile.bio}</p>
          <div className="mt-6 flex items-center gap-3"><img src={odile.portraitSmall} alt="Avatar d’Odile T." className="h-12 w-12 rounded-full object-cover ring-2 ring-gold" /><div><p className="font-semibold text-green">{odile.name}</p><p className="text-sm text-mute">{odile.role}</p></div></div>
        </Reveal>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-green-deep text-cream" aria-labelledby="temoignages">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal><Eyebrow light>Témoignages</Eyebrow><h2 id="temoignages" className="display text-4xl font-semibold sm:text-5xl">Ils avancent avec sérénité</h2><p className="mt-3 text-sm text-cream/60">Témoignages d’exemple, présentés à titre illustratif.</p></Reveal>
          <Stagger className="mt-10 grid gap-5 md:grid-cols-2">
            {testimonials.map((t) => <Item key={t.name} className="rounded-2xl border border-cream/10 bg-cream/5 p-6">
              <p className="display text-xl italic leading-snug">« {t.text} »</p>
              <p className="mt-4 text-sm"><span className="font-semibold text-gold">{t.name}</span> <span className="ml-2 rounded-full bg-cream/10 px-2 py-0.5 text-[11px] text-cream/70">Exemple</span></p>
            </Item>)}
          </Stagger>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6" aria-labelledby="tarifs-t">
        <Reveal className="mx-auto max-w-2xl text-center"><Eyebrow>Tarifs</Eyebrow><h2 id="tarifs-t" className="display text-4xl font-semibold text-green sm:text-5xl">Investir dans la sagesse</h2><p className="mt-4 text-mute">Deux formations, un paiement unique chacune. L’achat débloque uniquement la formation choisie, avec un accès à vie.</p></Reveal>
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {courses.map((c, i) => { const hl = i === courses.length - 1; return <Item key={c.slug} className={`relative flex flex-col rounded-3xl border p-7 ${hl ? 'border-green bg-green text-cream shadow-lift' : 'card'}`}>
            {hl && <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-xs font-bold text-green-deep">Programme complet</span>}
            <h3 className={`caps text-sm font-semibold ${hl ? 'text-gold' : 'text-gold-deep'}`}>{c.title}</h3>
            <p className="num display mt-3 text-4xl font-semibold">{eur(c.price)}</p><p className={`text-sm ${hl ? 'text-cream/70' : 'text-mute'}`}>{c.duration} · ≈ {fcfa(c.price)}</p>
            <ul className="mt-6 space-y-2.5 text-sm">{[`${c.modules.length} semaines de contenu`, `${lessonsOf(c).length} leçons et quiz`, 'Cahier d’exercices PDF', 'Certificat de réussite', 'Accès à vie'].map((f) => <li key={f} className="flex gap-2"><Check className={`h-4 w-4 shrink-0 ${hl ? 'text-gold' : 'text-green'}`} />{f}</li>)}</ul>
            <Link to={`/formations/${c.slug}`} className={`mt-8 ${hl ? 'btn-gold' : 'btn-primary'}`}>Découvrir la formation</Link>
          </Item> })}
          <Item className="card relative flex flex-col rounded-3xl border p-7">
            <h3 className="caps text-sm font-semibold text-gold-deep">{groupOffer.name}</h3>
            <p className="display mt-3 text-4xl font-semibold">{groupOffer.price}</p><p className="text-sm text-mute">{groupOffer.period}</p>
            <ul className="mt-6 space-y-2.5 text-sm">{groupOffer.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-green" />{f}</li>)}</ul>
            <Link to="/#contact" className="btn-ghost mt-8">{groupOffer.cta}</Link>
          </Item>
        </Stagger>
        <p className="mt-6 text-center text-xs text-mute">Montants en FCFA indicatifs (1 € = 655,957 FCFA).</p>
      </section>

      {/* RESSOURCES */}
      <section id="ressources" className="scroll-mt-20 border-t border-line" aria-labelledby="ressources-t">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-4"><div><Eyebrow>Ressources</Eyebrow><h2 id="ressources-t" className="display text-4xl font-semibold text-green sm:text-5xl">Le livre et le planner d’Odile T.</h2></div><Link to="/ressources" className="btn-ghost">Toutes les ressources <ArrowRight className="h-4 w-4" /></Link></Reveal>
          <Stagger className="mt-10 grid gap-6 lg:grid-cols-2">{resources.map((r) => <Item key={r.id}><ResourceCard r={r} /></Item>)}</Stagger>
          <p className="mt-5 text-xs text-mute">{PRICE_NOTE}</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-sand/60" aria-labelledby="faq-t">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <Reveal className="text-center"><Eyebrow>Questions fréquentes</Eyebrow><h2 id="faq-t" className="display text-4xl font-semibold text-green sm:text-5xl">Vos questions, nos réponses</h2></Reveal>
          <Stagger className="mt-10 space-y-3">{faq.map((f) => <Item key={f.q}><Faq q={f.q} a={f.a} /></Item>)}</Stagger>
        </div>
      </section>

      <Contact />
    </>
  )
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <h3><button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-green" aria-expanded={open} onClick={() => setOpen(!open)}>{q}<ChevronDown className={`h-5 w-5 shrink-0 text-gold-deep transition ${open ? 'rotate-180' : ''}`} /></button></h3>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-relaxed text-mute">{a}</p></motion.div>
    </div>
  )
}

export function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6" aria-labelledby="contact-t">
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h2 id="contact-t" className="display text-4xl font-semibold text-green sm:text-5xl">Restons en lien</h2>
          <p className="mt-4 text-mute">{brand.socialLine}</p>
          <a href={WHATSAPP_CHANNEL} target="_blank" rel="noopener noreferrer" className="btn mt-6 bg-[#1f8f4e] px-6 py-3 text-white hover:bg-green-deep"><SocialIcon id="whatsapp" className="h-5 w-5" /> Rejoindre la chaîne</a>
          <ul className="mt-6 flex flex-wrap gap-2">{socials.filter((s) => s.id !== 'whatsapp').map((s) => <li key={s.id}><a href={s.url} target="_blank" rel="noopener noreferrer" className="btn-ghost"><SocialIcon id={s.id} />{s.name}</a></li>)}</ul>
        </Reveal>
        <Reveal delay={0.1}>
          <form className="card space-y-4 p-6" onSubmit={(e) => e.preventDefault()}>
            <h3 className="display text-2xl font-semibold text-green">Écrivez-nous</h3>
            <div><label className="label" htmlFor="c-name">Nom</label><input id="c-name" className="input" required /></div>
            <div><label className="label" htmlFor="c-mail">E-mail</label><input id="c-mail" type="email" className="input" required /></div>
            <div><label className="label" htmlFor="c-msg">Message</label><textarea id="c-msg" rows={4} className="input" /></div>
            {sent ? <DemoNote>Merci ! Votre message a bien été pris en compte (démonstration : aucun envoi réel).</DemoNote>
              : <AsyncButton className="btn-primary w-full" done="Envoyé" onClick={() => new Promise((r) => setTimeout(r, 900)).then(() => setTimeout(() => setSent(true), 900))}><Mail className="h-4 w-4" /> Envoyer</AsyncButton>}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
