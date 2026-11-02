import { motion, useReducedMotion } from 'motion/react'
import { Download, FileImage } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import logoUrl from '../assets/sfc-logo.png'
import { SITE_URL, odile } from '../content/brand'
import type { Cert } from '../lib/store'

const W = 1600, H = 1130
const fmt = (d: number) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  ctx.letterSpacing = `${spacing}px`; ctx.fillText(text, x + spacing / 2, y); ctx.letterSpacing = '0px'
}

async function draw(canvas: HTMLCanvasElement, c: Cert) {
  await Promise.all(['700 40px Cinzel', '600 40px "Cormorant Garamond"', 'italic 500 40px "Cormorant Garamond"', '500 20px Inter'].map((f) => document.fonts.load(f).catch(() => null)))
  const ctx = canvas.getContext('2d')!; canvas.width = W; canvas.height = H
  ctx.fillStyle = '#FAF6EC'; ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#015C30'; ctx.lineWidth = 28; ctx.strokeRect(14, 14, W - 28, H - 28)
  ctx.strokeStyle = '#DB9301'; ctx.lineWidth = 3; ctx.strokeRect(54, 54, W - 108, H - 108)
  ctx.lineWidth = 1; ctx.strokeRect(66, 66, W - 132, H - 132)
  const logo = new Image(); logo.src = logoUrl; await logo.decode().catch(() => null)
  if (logo.naturalWidth) ctx.drawImage(logo, W / 2 - 80, 100, 160, 160)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#015C30'; ctx.font = '700 54px Cinzel'; spaced(ctx, 'CERTIFICAT DE RÉUSSITE', W / 2, 335, 8)
  ctx.fillStyle = '#DB9301'; ctx.fillRect(W / 2 - 120, 365, 240, 3)
  ctx.fillStyle = '#5F6B63'; ctx.font = '500 24px Inter'; ctx.fillText('SFC Finances atteste que', W / 2, 430)
  ctx.fillStyle = '#14231A'; ctx.font = 'italic 600 92px "Cormorant Garamond"'; ctx.fillText(c.name, W / 2, 530)
  ctx.fillStyle = '#5F6B63'; ctx.font = '500 24px Inter'; ctx.fillText('a suivi avec succès l’intégralité de la formation', W / 2, 600)
  ctx.fillStyle = '#015C30'; ctx.font = '600 56px "Cormorant Garamond"'
  const words = c.course.split(' '); let line = '', y = 680; const lines: string[] = []
  for (const w of words) { if (ctx.measureText(line + w).width > 1200) { lines.push(line.trim()); line = '' } line += w + ' ' }
  lines.push(line.trim()); lines.forEach((l, i) => ctx.fillText(l, W / 2, y + i * 62)); y += (lines.length - 1) * 62
  ctx.fillStyle = '#5F6B63'; ctx.font = '500 22px Inter'; ctx.fillText('et validé l’évaluation finale.', W / 2, y + 55)
  // footer columns
  const fy = 930
  ctx.font = '500 20px Inter'; ctx.fillStyle = '#5F6B63'
  ctx.fillText('Délivré le', 360, fy - 50); ctx.fillText('Formatrice', W - 360, fy - 50)
  ctx.fillStyle = '#14231A'; ctx.font = '600 32px "Cormorant Garamond"'; ctx.fillText(fmt(c.date), 360, fy)
  ctx.font = 'italic 600 40px "Cormorant Garamond"'; ctx.fillText(odile.name, W - 360, fy)
  ctx.fillStyle = '#DB9301'; ctx.fillRect(220, fy + 18, 280, 2); ctx.fillRect(W - 500, fy + 18, 280, 2)
  ctx.fillStyle = '#5F6B63'; ctx.font = '500 18px Inter'; ctx.fillText(odile.role, W - 360, fy + 50)
  // seal
  ctx.beginPath(); ctx.arc(W / 2, fy - 10, 70, 0, Math.PI * 2); ctx.fillStyle = '#015C30'; ctx.fill()
  ctx.beginPath(); ctx.arc(W / 2, fy - 10, 58, 0, Math.PI * 2); ctx.strokeStyle = '#FECA12'; ctx.lineWidth = 3; ctx.stroke()
  ctx.fillStyle = '#FECA12'; ctx.font = '700 30px Cinzel'; ctx.fillText('SFC', W / 2, fy + 2)
  ctx.fillStyle = '#5F6B63'; ctx.font = '500 17px Inter'
  ctx.fillText(`N° ${c.id}  ·  Vérification : ${SITE_URL.replace('https://', '')}/certificats/${c.id}`, W / 2, H - 98)
  ctx.font = 'italic 500 15px Inter'; ctx.fillText('Certificat de démonstration', W / 2, H - 76)
}

export function Certificate({ cert, actions = true }: { cert: Cert; actions?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null); const [ready, setReady] = useState(false)
  const reduce = useReducedMotion()
  useEffect(() => { if (ref.current) draw(ref.current, cert).then(() => setReady(true)) }, [cert])
  const png = () => { const a = document.createElement('a'); a.href = ref.current!.toDataURL('image/png'); a.download = `certificat-${cert.id}.png`; a.click() }
  const pdf = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [W, H] })
    doc.addImage(ref.current!.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H); doc.save(`certificat-${cert.id}.pdf`)
  }
  return (
    <div>
      <motion.div initial={reduce ? false : { opacity: 0, rotateX: 18, y: 40, scale: 0.94 }} animate={ready ? { opacity: 1, rotateX: 0, y: 0, scale: 1 } : {}} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} style={{ perspective: 1200 }} className="overflow-hidden rounded-xl shadow-lift">
        <canvas ref={ref} className="block h-auto w-full" role="img" aria-label={`Certificat de réussite de ${cert.name} pour la formation ${cert.course}`} />
      </motion.div>
      {actions && <div className="mt-5 flex flex-wrap gap-3"><button className="btn-primary" onClick={pdf} disabled={!ready}><Download className="h-4 w-4" />Télécharger en PDF</button><button className="btn-ghost" onClick={png} disabled={!ready}><FileImage className="h-4 w-4" />Télécharger en PNG</button></div>}
    </div>
  )
}
