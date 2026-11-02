import { motion, useReducedMotion, useScroll, useTransform, type HTMLMotionProps } from 'motion/react'
import { useRef, type ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, delay = 0, className, as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'section' | 'li' }) {
  const reduce = useReducedMotion()
  const C = motion[as]
  return <C className={className} initial={reduce ? false : { opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, ease, delay }}>{children}</C>
}

export function Stagger({ children, className, step = 0.08 }: { children: ReactNode; className?: string; step?: number }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={{ show: { transition: { staggerChildren: step } } }}>{children}</motion.div>
}
export function Item({ children, className, ...p }: HTMLMotionProps<'div'>) {
  return <motion.div className={className} variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }} {...p}>{children}</motion.div>
}

export function Parallax({ children, className, amount = 40 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [amount, -amount])
  return <div ref={ref} className={className}><motion.div style={{ y }} className="h-full w-full">{children}</motion.div></div>
}

export function PageFade({ children, k }: { children: ReactNode; k: string }) {
  const reduce = useReducedMotion()
  return <motion.div key={k} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>{children}</motion.div>
}
