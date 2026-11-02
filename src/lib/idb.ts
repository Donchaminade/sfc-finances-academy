/** Tiny IndexedDB key/value store for uploaded files (covers, videos, PDFs). */
const DB = 'sfc-files', STORE = 'files'
let dbp: Promise<IDBDatabase> | null = null
function db() {
  if (!dbp) dbp = new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1)
    r.onupgradeneeded = () => r.result.createObjectStore(STORE)
    r.onsuccess = () => res(r.result)
    r.onerror = () => rej(r.error)
  })
  return dbp
}
function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>) {
  return db().then((d) => new Promise<T>((res, rej) => {
    const q = fn(d.transaction(STORE, mode).objectStore(STORE))
    q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error)
  }))
}
export const putFile = async (file: Blob) => { const id = 'f_' + crypto.randomUUID().slice(0, 12); await tx('readwrite', (s) => s.put(file, id)); return 'idb:' + id }
export const getFile = (ref: string) => tx<Blob | undefined>('readonly', (s) => s.get(ref.replace(/^idb:/, '')))
export const delFile = (ref: string) => tx('readwrite', (s) => s.delete(ref.replace(/^idb:/, '')))
