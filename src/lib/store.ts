import { useSyncExternalStore } from 'react'
import { seedCourses } from '../data/seed'
import { defaultResources, type Resource } from '../content/resources'
import type { Course } from '../data/types'
import { DEMO_ADMIN, DEMO_LEARNER } from '../data/demo'

export type User = { id: string; name: string; email: string; hash: string; role: 'learner' | 'admin'; createdAt: number; lastActive: number }
export type Progress = { done: string[]; last?: string; pos: Record<string, number>; quiz: Record<string, number>; updated: number }
export type Cert = { id: string; uid: string; name: string; course: string; slug: string; date: number }
export type Purchase = { item: string; amount: number; method: string; date: number; ref: string }

const listeners = new Set<() => void>()
let version = 0
const emit = () => { version++; listeners.forEach((l) => l()) }
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('storage', emit)
export const useStore = () => useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => version, () => version)

const read = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d } catch { return d } }
const write = (k: string, v: unknown) => { localStorage.setItem(k, JSON.stringify(v)); emit() }

export async function sha256(s: string) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
}

/* ---------- courses ---------- */
const SEED_V = 'v2'
export function getCourses(): Course[] {
  if (localStorage.getItem('sfc.seed') !== SEED_V) { if (localStorage.getItem('sfc.seed')) Object.keys(localStorage).filter((k) => k.startsWith('sfc.') && k !== 'sfc.resources').forEach((k) => localStorage.removeItem(k)); localStorage.setItem('sfc.courses', JSON.stringify(seedCourses)); localStorage.setItem('sfc.seed', SEED_V) }
  return read<Course[]>('sfc.courses', seedCourses)
}
export const publishedCourses = () => getCourses().filter((c) => c.status === 'published')
export const getCourse = (slug: string) => getCourses().find((c) => c.slug === slug)
export function saveCourse(c: Course, prevSlug?: string) {
  const list = getCourses(); const i = list.findIndex((x) => x.slug === (prevSlug ?? c.slug))
  c.updatedAt = Date.now()
  if (i >= 0) list[i] = c; else list.push(c)
  write('sfc.courses', list)
}
export const deleteCourse = (slug: string) => write('sfc.courses', getCourses().filter((c) => c.slug !== slug))
export const resetCourses = () => { localStorage.removeItem('sfc.seed'); getCourses(); emit() }
export const lessonsOf = (c: Course) => c.modules.flatMap((m) => m.lessons)
export const slugify = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/* ---------- users & session ---------- */
export const getUsers = () => read<User[]>('sfc.users', [])
export const currentUser = (): User | undefined => { const id = localStorage.getItem('sfc.session'); return id ? getUsers().find((u) => u.id === id) : undefined }
const touch = (id: string) => { const us = getUsers(); const u = us.find((x) => x.id === id); if (u) { u.lastActive = Date.now(); localStorage.setItem('sfc.users', JSON.stringify(us)) } }

export async function register(name: string, email: string, password: string, role: User['role'] = 'learner') {
  const us = getUsers(); const em = email.trim().toLowerCase()
  if (us.some((u) => u.email === em)) throw new Error('Un compte existe déjà avec cette adresse e-mail.')
  const u: User = { id: 'u_' + crypto.randomUUID().slice(0, 10), name: name.trim(), email: em, hash: await sha256(em + ':' + password), role, createdAt: Date.now(), lastActive: Date.now() }
  write('sfc.users', [...us, u]); return u
}
export async function login(email: string, password: string) {
  const em = email.trim().toLowerCase(); const u = getUsers().find((x) => x.email === em)
  if (!u || u.hash !== (await sha256(em + ':' + password))) throw new Error('Adresse e-mail ou mot de passe incorrect.')
  localStorage.setItem('sfc.session', u.id); touch(u.id); emit(); return u
}
export const logout = () => { localStorage.removeItem('sfc.session'); emit() }

/* ---------- purchases ---------- */
export const getPurchases = (uid: string) => read<Purchase[]>(`sfc.purchases.${uid}`, [])
export const addPurchase = (uid: string, p: Purchase) => write(`sfc.purchases.${uid}`, [...getPurchases(uid), p])
export const owns = (uid: string | undefined, slug: string) => !!uid && getPurchases(uid).some((p) => p.item === slug)
export const ownedCourses = (uid: string) => getCourses().filter((c) => owns(uid, c.slug) && c.status === 'published')

/* ---------- progress ---------- */
const pk = (uid: string, slug: string) => `sfc.progress.${uid}.${slug}`
export const getProgress = (uid: string, slug: string) => read<Progress>(pk(uid, slug), { done: [], pos: {}, quiz: {}, updated: 0 })
function saveProgress(uid: string, slug: string, p: Progress, silent = false) {
  p.updated = Date.now(); localStorage.setItem(pk(uid, slug), JSON.stringify(p)); touch(uid); if (!silent) emit()
}
export function setPosition(uid: string, slug: string, lessonId: string, pos: number) {
  const p = getProgress(uid, slug); p.last = lessonId; p.pos[lessonId] = Math.max(p.pos[lessonId] ?? 0, pos); saveProgress(uid, slug, p, true)
}
export function setLast(uid: string, slug: string, lessonId: string) { const p = getProgress(uid, slug); if (p.last !== lessonId) { p.last = lessonId; saveProgress(uid, slug, p, true) } }
export function completeLesson(uid: string, slug: string, lessonId: string, score?: number) {
  const p = getProgress(uid, slug)
  if (score !== undefined) p.quiz[lessonId] = Math.max(p.quiz[lessonId] ?? 0, score)
  if (!p.done.includes(lessonId)) p.done.push(lessonId)
  p.last = lessonId; saveProgress(uid, slug, p)
}
export function percent(c: Course, p: Progress) { const ls = lessonsOf(c); return ls.length ? Math.round((ls.filter((l) => p.done.includes(l.id)).length / ls.length) * 100) : 0 }
export function modulePercent(m: Course['modules'][number], p: Progress) { return m.lessons.length ? Math.round((m.lessons.filter((l) => p.done.includes(l.id)).length / m.lessons.length) * 100) : 0 }
/** A lesson is unlocked when every previous lesson is completed. */
export function isUnlocked(c: Course, p: Progress, lessonId: string) {
  const ls = lessonsOf(c); const i = ls.findIndex((l) => l.id === lessonId)
  return i >= 0 && ls.slice(0, i).every((l) => p.done.includes(l.id))
}
export function resumeLesson(c: Course, p: Progress) {
  const ls = lessonsOf(c)
  if (p.last && ls.some((l) => l.id === p.last) && !p.done.includes(p.last)) return p.last
  return (ls.find((l) => !p.done.includes(l.id)) ?? ls[ls.length - 1])?.id
}

/* ---------- certificates ---------- */
export const getCerts = () => read<Cert[]>('sfc.certs', [])
export const findCert = (id: string) => getCerts().find((c) => c.id === id.toUpperCase())
export const userCerts = (uid: string) => getCerts().filter((c) => c.uid === uid)
export function issueCert(u: User, c: Course) {
  const ex = getCerts().find((x) => x.uid === u.id && x.slug === c.slug); if (ex) return ex
  const r = () => Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, 'X')
  const cert: Cert = { id: `SFC-${new Date().getFullYear()}-${r()}-${r()}`, uid: u.id, name: u.name, course: c.title, slug: c.slug, date: Date.now() }
  write('sfc.certs', [...getCerts(), cert]); return cert
}

/* ---------- demo seeding ---------- */
let demoP: Promise<void> | null = null
export const ensureDemo = () => (demoP ??= seedDemo())
async function seedDemo() {
  if (localStorage.getItem('sfc.demo') === '3') return
  getCourses()
  const us = getUsers()
  for (const [acc, role] of [[DEMO_LEARNER, 'learner'], [DEMO_ADMIN, 'admin']] as const) {
    if (!us.some((u) => u.email === acc.email)) {
      const u = await register(acc.name, acc.email, acc.password, role)
      if (role === 'learner') {
        const c = seedCourses[0]
        addPurchase(u.id, { item: c.slug, amount: c.price, method: 'Flooz', date: Date.now() - 86400e3 * 6, ref: 'DEMO-0001' })
        const ls = lessonsOf(c)
        const p: Progress = { done: ls.slice(0, 3).map((l) => l.id), last: ls[3].id, pos: { [ls[3].id]: 42 }, quiz: { [ls[2].id]: 100 }, updated: Date.now() }
        localStorage.setItem(pk(u.id, c.slug), JSON.stringify(p))
      }
    }
  }
  /* a few illustrative learners for the admin table */
  const sample = [['Kossi Agbeko', 'kossi.demo@sfc-demo.app', 2], ['Mireille Dossou', 'mireille.demo@sfc-demo.app', 2], ['Yao Kouassi', 'yao.demo@sfc-demo.app', 1]] as const
  for (const [name, email, k] of sample) {
    if (getUsers().some((u) => u.email === email)) continue
    const u = await register(name, email, crypto.randomUUID())
    seedCourses.slice(0, k).forEach((c, i) => {
      addPurchase(u.id, { item: c.slug, amount: c.price, method: i % 2 ? 'T-Money' : 'Flooz', date: Date.now() - 86400e3 * (10 - i), ref: 'DEMO-S' + i })
      const ls = lessonsOf(c); const d = Math.max(1, Math.round(ls.length * ((k - i) / 3)))
      localStorage.setItem(pk(u.id, c.slug), JSON.stringify({ done: ls.slice(0, d).map((l) => l.id), last: ls[Math.min(d, ls.length - 1)].id, pos: {}, quiz: {}, updated: Date.now() - 86400e3 * i }))
    })
  }
  localStorage.setItem('sfc.demo', '3'); emit()
}

export const eur = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: n % 1 ? 2 : 0 })
/** Fixed parity EUR/XOF. */
export const fcfa = (n: number) => Math.round(n * 655.957).toLocaleString('fr-FR') + ' FCFA'

/* ---------- resources (Amazon products) ---------- */
export const getResources = () => read<Resource[]>('sfc.resources', defaultResources)
export const saveResources = (list: Resource[]) => write('sfc.resources', list)
export const resetResources = () => { localStorage.removeItem('sfc.resources'); emit() }
