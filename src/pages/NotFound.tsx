import { Link } from '../lib/router'
import { useSeo } from '../lib/seo'
export default function NotFound() {
  useSeo({ title: 'Page introuvable', description: 'Cette page n’existe pas ou a été déplacée.', path: location.pathname, noindex: true })
  return <div className="mx-auto max-w-xl px-4 py-28 text-center"><p className="caps text-gold-deep">Erreur 404</p><h1 className="display mt-3 text-5xl font-semibold text-green">Page introuvable</h1><p className="mt-4 text-mute">La page que vous cherchez n’existe pas ou a été déplacée.</p><Link to="/" className="btn-primary mt-8">Retour à l’accueil</Link></div>
}
