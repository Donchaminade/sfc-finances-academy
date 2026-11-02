import { motion, useReducedMotion } from 'motion/react'

export function ProgressRing({ value, size = 64, stroke = 6, label = true, light = false }: { value: number; size?: number; stroke?: number; label?: boolean; light?: boolean }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r
  const reduce = useReducedMotion()
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={`Progression : ${value} %`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? "rgba(250,246,236,.2)" : "#E7E0CE"} strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? '#FECA12' : value >= 100 ? '#DB9301' : '#015C30'} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: reduce ? c * (1 - value / 100) : c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      {label && <span className={`num absolute text-xs font-bold ${light ? "text-cream" : "text-green"}`}>{value}%</span>}
    </div>
  )
}

export function Bar({ value, light = false }: { value: number; light?: boolean }) {
  return <div className={`h-2 w-full overflow-hidden rounded-full ${light ? 'bg-cream/20' : 'bg-sand'}`}><motion.div className={`h-full rounded-full ${light ? 'bg-gold' : value >= 100 ? 'bg-gold-deep' : 'bg-green'}`} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} /></div>
}
