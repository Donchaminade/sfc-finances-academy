import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

const subs = new Set<() => void>()
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('popstate', () => subs.forEach((s) => s()))
export const usePath = () => useSyncExternalStore((l) => (subs.add(l), () => subs.delete(l)), () => location.pathname + location.hash, () => location.pathname)

export function navigate(to: string, replace = false) {
  if (to === location.pathname + location.hash) return
  history[replace ? 'replaceState' : 'pushState'](null, '', to)
  subs.forEach((s) => s())
  if (!to.includes('#')) window.scrollTo({ top: 0 })
  else setTimeout(() => document.getElementById(to.split('#')[1])?.scrollIntoView({ behavior: 'smooth' }), 80)
}

export function match(pattern: string, path: string) {
  const a = pattern.split('/').filter(Boolean), b = path.split('#')[0].split('/').filter(Boolean)
  if (a.length !== b.length) return null
  const out: Record<string, string> = {}
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) out[a[i].slice(1)] = decodeURIComponent(b[i])
    else if (a[i] !== b[i]) return null
  }
  return out
}

export function Link({ to, onClick, ...p }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={to} {...p} onClick={(e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault(); navigate(to)
  }} />
}

export function Redirect({ to }: { to: string }) {
  useEffect(() => { navigate(to, true) }, [to])
  return null
}
