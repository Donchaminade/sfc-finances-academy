import { Item, Parallax, Reveal, Stagger } from '../components/motion'
import { Eyebrow } from '../components/ui'
import { directrice, parcours, values } from '../content/about'
import { brand, odile } from '../content/brand'
import { Link } from '../lib/router'
import { directriceLd, odileLd, useSeo } from '../lib/seo'

export default function About() {
  useSeo({ title: 'À propos de SFC Finances', description: 'Découvrez SFC Finances, plateforme d’éducation financière chrétienne basée à Lomé (Togo) : notre fondatrice, notre mission, nos valeurs et Odile T.', path: '/a-propos', jsonld: [directriceLd, odileLd] })
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6">
        <Reveal className="max-w-3xl"><Eyebrow>À propos</Eyebrow><h1 className="display text-5xl font-semibold leading-tight text-green sm:text-6xl">Une plateforme née d’une conviction</h1><p className="mt-5 text-lg leading-relaxed text-mute">{brand.intro}</p></Reveal>
      </section>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 md:grid-cols-[.9fr_1.1fr]" aria-labelledby="fondatrice">
        <Parallax className="relative mx-auto w-full max-w-sm" amount={24}>
          <div className="absolute -inset-3 rounded-t-[200px] rounded-b-3xl border-2 border-gold/70" aria-hidden />
          <picture><source srcSet={directrice.photoSet} sizes="(min-width: 768px) 384px, 90vw" type="image/webp" />
            <img src={directrice.photo} alt={directrice.name ? `Portrait de ${directrice.name}, ${directrice.title} de SFC Finances` : `Portrait de la ${directrice.title} de SFC Finances`} className="relative aspect-[4/5] w-full rounded-t-[200px] rounded-b-3xl object-cover shadow-lift" /></picture>
        </Parallax>
        <Reveal>
          <Eyebrow>{directrice.title}</Eyebrow>
          <h2 id="fondatrice" className="display text-4xl font-semibold text-green">{directrice.name || 'La fondatrice de SFC Finances'}</h2>
          {directrice.description.map((d) => <p key={d} className="mt-4 leading-relaxed text-mute">{d}</p>)}
        </Reveal>
      </section>
      <section className="bg-sand/60" aria-labelledby="parcours">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <Reveal><Eyebrow>Parcours</Eyebrow><h2 id="parcours" className="display text-4xl font-semibold text-green">Les grandes étapes</h2></Reveal>
          <Stagger className="relative mt-10 space-y-8 border-l-2 border-gold/60 pl-8">
            {parcours.map((p) => <Item key={p.label} className="relative"><span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-cream bg-green" /><h3 className="display text-2xl font-semibold text-green">{p.label}</h3><p className="mt-1 text-mute">{p.text}</p></Item>)}
          </Stagger>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" aria-labelledby="valeurs">
        <Reveal><Eyebrow>Nos valeurs</Eyebrow><h2 id="valeurs" className="display text-4xl font-semibold text-green">Ce qui nous guide</h2><p className="mt-3 max-w-2xl text-mute">{brand.mission}</p></Reveal>
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{values.map((v) => <Item key={v.title} className="card p-6"><h3 className="caps text-sm font-bold text-gold-deep">{v.title}</h3><p className="mt-3 text-sm leading-relaxed text-mute">{v.text}</p></Item>)}</Stagger>
      </section>
      <section className="bg-green text-cream" aria-labelledby="equipe">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[auto_1fr]">
          <img src={odile.portrait} loading="lazy" alt="Portrait d’Odile T., conseillère en finances personnelles" className="h-44 w-44 rounded-full object-cover ring-4 ring-gold" />
          <Reveal><Eyebrow light>L’équipe pédagogique</Eyebrow><h2 id="equipe" className="display text-4xl font-semibold">{odile.name}, {odile.role.toLowerCase()}</h2><p className="mt-4 leading-relaxed text-cream/85">{odile.bio}</p><Link to="/formations" className="btn-gold mt-6">Voir ses formations</Link></Reveal>
        </div>
      </section>
    </>
  )
}
