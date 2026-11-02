import { brand, socials } from '../content/brand'
import { Link } from '../lib/router'
import { SocialIcon } from './SocialIcon'
import { Logo } from './ui'

export function Footer() {
  return (
    <footer className="bg-green-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo size={52} light />
          <p className="display mt-4 max-w-sm text-xl italic text-cream/90">« {brand.slogan} »</p>
          <p className="mt-3 text-sm text-cream/70">{brand.location}</p>
        </div>
        <div>
          <p className="caps mb-4 text-xs text-gold">Plateforme</p>
          <ul className="space-y-2 text-sm text-cream/80">
            {[['/formations', 'Toutes les formations'], ['/a-propos', 'À propos'], ['/#tarifs', 'Tarifs'], ['/#faq', 'Questions fréquentes'], ['/mon-espace', 'Mon espace']].map(([to, l]) => <li key={to}><Link to={to} className="hover:text-gold">{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="caps mb-4 text-xs text-gold">Nous suivre</p>
          <ul className="space-y-2.5 text-sm">
            {socials.map((s) => <li key={s.id}><a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-cream/80 hover:text-gold"><SocialIcon id={s.id} />{s.name}{s.id === 'instagram' && <span className="text-cream/50">{s.handle}</span>}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-cream/60 sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} SFC Finances. Tous droits réservés.</p>
          <p>Démonstration : paiements et certificats simulés.</p>
        </div>
      </div>
    </footer>
  )
}
