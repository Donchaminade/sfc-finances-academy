import { CheckCircle2, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { Certificate } from '../components/Certificate'
import { Reveal } from '../components/motion'
import { DemoNote, Eyebrow } from '../components/ui'
import { Link, navigate } from '../lib/router'
import { useSeo } from '../lib/seo'
import { currentUser, findCert, useStore } from '../lib/store'

export default function Verify({ id }: { id?: string }) {
  useStore()
  useSeo({ title: 'Vérification de certificat', description: 'Vérifiez l’authenticité d’un certificat SFC Finances à partir de son identifiant.', path: id ? `/certificats/${id}` : '/certificats', noindex: !!id })
  const cert = id ? findCert(id) : undefined; const u = currentUser(); const [q, setQ] = useState(id ?? '')
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Reveal><Eyebrow>Vérification</Eyebrow><h1 className="display text-4xl font-semibold text-green sm:text-5xl">Vérifier un certificat</h1></Reveal>
      <form className="mt-6 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (q.trim()) navigate(`/certificats/${q.trim().toUpperCase()}`) }}>
        <label className="flex-1"><span className="sr-only">Identifiant du certificat</span><input className="input num" placeholder="SFC-2026-XXXX-XXXX" value={q} onChange={(e) => setQ(e.target.value)} /></label><button className="btn-primary">Vérifier</button>
      </form>
      {id && (cert ? <div className="mt-8">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-green-soft px-4 py-2 text-sm font-semibold text-green"><CheckCircle2 className="h-4 w-4" />Certificat valide · délivré à {cert.name} le {new Date(cert.date).toLocaleDateString('fr-FR')}</p>
        <Certificate cert={cert} actions={u?.id === cert.uid} />
        {u?.id === cert.uid && <Link to="/mon-espace/certificats" className="mt-3 inline-block text-sm text-green hover:underline">← Mes certificats</Link>}
      </div> : <p className="mt-8 flex items-center gap-2 rounded-2xl bg-gold-soft p-5 text-sm"><ShieldAlert className="h-5 w-5 text-gold-deep" />Aucun certificat ne correspond à l’identifiant « {id} ».</p>)}
      <div className="mt-8"><DemoNote>Vérification simulée : les certificats de cette démonstration sont enregistrés uniquement dans le navigateur où ils ont été délivrés.</DemoNote></div>
    </div>
  )
}
