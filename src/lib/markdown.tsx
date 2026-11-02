import type { ReactNode } from 'react'

/** Minimal markdown: "## " headings, "- " lists, paragraphs, **bold**. */
const inline = (s: string) => s.split(/(\*\*[^*]+\*\*)/).map((t, i) => t.startsWith('**') ? <strong key={i}>{t.slice(2, -2)}</strong> : t)
export function Markdown({ text }: { text: string }) {
  const out: ReactNode[] = []; let list: string[] = []
  const flush = () => { if (list.length) { out.push(<ul key={out.length}>{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>); list = [] } }
  for (const raw of text.split('\n')) {
    const l = raw.trim()
    if (l.startsWith('- ')) { list.push(l.slice(2)); continue }
    flush()
    if (!l) continue
    if (l.startsWith('## ') || l.startsWith('# ')) out.push(<h2 key={out.length}>{l.replace(/^#+ /, '')}</h2>)
    else out.push(<p key={out.length}>{inline(l)}</p>)
  }
  flush()
  return <div className="prose-sfc">{out}</div>
}
