import { AnimatePresence, motion } from 'motion/react'
import { Check, Loader2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import logo from '../assets/sfc-logo.png'
import { useFileUrl } from '../lib/useFileUrl'

export function Logo({ size = 44, text = true, light = false }: { size?: number; text?: boolean; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <img src={logo} alt="Logo SFC Finances" width={size} height={size} className={`shrink-0 object-contain ${light ? "rounded-full bg-cream p-1" : ""}`} style={{ width: size, height: size }} />
      {text && <span className="leading-none"><span className={`caps block text-[15px] font-bold ${light ? 'text-cream' : 'text-green'}`}>SFC</span><span className={`caps block text-[10px] ${light ? 'text-gold' : 'text-gold-deep'}`}>Finances</span></span>}
    </span>
  )
}

/** Async button: idle → loading → success. */
export function AsyncButton({ onClick, children, className = 'btn-primary', done = 'Terminé', type = 'button', disabled }: { onClick?: () => Promise<unknown> | void; children: ReactNode; className?: string; done?: string; type?: 'button' | 'submit'; disabled?: boolean }) {
  const [st, setSt] = useState<'idle' | 'load' | 'ok'>('idle')
  return (
    <button type={type} disabled={disabled || st !== 'idle'} className={`${className} relative overflow-hidden`} onClick={async () => {
      if (!onClick) return
      setSt('load')
      try { await onClick(); setSt('ok'); setTimeout(() => setSt('idle'), 1200) } catch { setSt('idle') }
    }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={st} className="inline-flex items-center gap-2" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.2 }}>
          {st === 'load' ? <><Loader2 className="h-4 w-4 animate-spin" /> Patientez…</> : st === 'ok' ? <><Check className="h-4 w-4" /> {done}</> : children}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/30 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-label={title} className="card max-h-[90dvh] w-full max-w-lg overflow-auto p-6" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>
            <p className="display mb-4 text-2xl font-semibold text-green">{title}</p>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Cover({ src, alt, className = '', fallbackTitle }: { src: string; alt: string; className?: string; fallbackTitle?: string }) {
  const url = useFileUrl(src)
  if (url) return <img src={url} alt={alt} loading="lazy" className={`object-cover ${className}`} />
  if (fallbackTitle) return <div role="img" aria-label={alt} className={`flex flex-col justify-between border-4 border-double border-gold bg-green p-4 text-cream ${className}`}><span className="caps text-[10px] text-gold">SFC Finances</span><span className="display text-lg font-semibold leading-tight">{fallbackTitle}</span><span className="text-[10px] text-cream/70">Odile T.</span></div>
  return <div className={`bg-sand ${className}`} />
}

export function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return <p className={`caps mb-3 text-xs font-semibold ${light ? 'text-gold' : 'text-gold-deep'}`}>{children}</p>
}

export function DemoNote({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-gold/60 bg-gold-soft px-4 py-3 text-sm text-ink/80">{children}</p>
}
