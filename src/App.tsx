import { useEffect, useState } from 'react'
import { Footer } from './components/Footer'
import { PageFade } from './components/motion'
import { Navbar } from './components/Navbar'
import { match, usePath } from './lib/router'
import { ensureDemo, getCourses } from './lib/store'
import About from './pages/About'
import Auth from './pages/Auth'
import Checkout from './pages/Checkout'
import CourseDetail from './pages/CourseDetail'
import Dashboard from './pages/Dashboard'
import Formations from './pages/Formations'
import Landing from './pages/Landing'
import Learn from './pages/Learn'
import NotFound from './pages/NotFound'
import Verify from './pages/Verify'
import AdminCourseEdit from './pages/admin/AdminCourseEdit'
import AdminCourses from './pages/admin/AdminCourses'
import AdminHome from './pages/admin/AdminHome'
import AdminUsers, { AdminUser } from './pages/admin/AdminUsers'
import AdminResources from './pages/admin/AdminResources'
import Resources from './pages/Resources'

getCourses()

function route(path: string) {
  const p = path.split('#')[0].replace(/\/$/, '') || '/'
  let m: Record<string, string> | null
  if (p === '/') return <Landing />
  if (p === '/formations') return <Formations />
  if ((m = match('/formations/:slug', p))) return <CourseDetail slug={m.slug} />
  if (p === '/a-propos') return <About />
  if (p === '/ressources') return <Resources />
  if (p === '/connexion') return <Auth mode="login" />
  if (p === '/inscription') return <Auth mode="signup" />
  if ((m = match('/paiement/:item', p))) return <Checkout item={m.item} />
  if (p === '/mon-espace') return <Dashboard tab="cours" />
  if (p === '/mon-espace/certificats') return <Dashboard tab="certificats" />
  if ((m = match('/apprendre/:slug/:lesson', p))) return <Learn slug={m.slug} lessonId={m.lesson} />
  if (p === '/certificats') return <Verify />
  if ((m = match('/certificats/:id', p))) return <Verify id={m.id} />
  if (p === '/admin') return <AdminHome />
  if (p === '/admin/formations') return <AdminCourses />
  if (p === '/admin/formations/nouvelle') return <AdminCourseEdit />
  if ((m = match('/admin/formations/:slug', p))) return <AdminCourseEdit key={m.slug} slug={m.slug} />
  if (p === '/admin/utilisateurs') return <AdminUsers />
  if (p === '/admin/ressources') return <AdminResources />
  if ((m = match('/admin/utilisateurs/:id', p))) return <AdminUser id={m.id} />
  return <NotFound />
}

export default function App() {
  const path = usePath(); const [ready, setReady] = useState(false)
  useEffect(() => { ensureDemo().finally(() => setReady(true)) }, [])
  const base = path.split('#')[0]
  const admin = base.startsWith('/admin'); const learn = base.startsWith('/apprendre')
  if (!ready && (admin || learn || base.startsWith('/mon-espace'))) return <div className="grid min-h-dvh place-items-center text-mute">Chargement…</div>
  if (admin) return <PageFade k={base}>{route(path)}</PageFade>
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:p-2">Aller au contenu</a>
      <Navbar />
      <main id="contenu" className="flex-1"><PageFade k={base}>{route(path)}</PageFade></main>
      {!learn && <Footer />}
    </div>
  )
}
