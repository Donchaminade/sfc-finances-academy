import { useEffect, useState } from 'react'
import { getFile } from './idb'

/** Resolve a stored reference ("idb:…" or a plain URL) to a usable URL. */
export function useFileUrl(ref?: string) {
  const [blobUrl, setBlobUrl] = useState<{ ref: string; url: string } | null>(null)
  const isIdb = !!ref?.startsWith('idb:')
  useEffect(() => {
    if (!ref || !isIdb) return
    let url = '', alive = true
    getFile(ref).then((b) => { if (b && alive) { url = URL.createObjectURL(b); setBlobUrl({ ref, url }) } })
    return () => { alive = false; if (url) URL.revokeObjectURL(url) }
  }, [ref, isIdb])
  if (!ref) return ''
  if (!isIdb) return ref
  return blobUrl?.ref === ref ? blobUrl.url : ''
}
