export type Question = { q: string; options: string[]; answer: number }
export type Pdf = { id: string; name: string; size: number; ref: string; url?: string }
export type VideoSrc = { type: 'demo' | 'file' | 'url'; src: string }
export type Lesson = {
  id: string
  title: string
  kind: 'video' | 'reading' | 'quiz'
  duration: string
  video?: VideoSrc
  transcript: string
  pdfs: Pdf[]
  quiz?: Question[]
}
export type Module = { id: string; title: string; lessons: Lesson[] }
export type Course = {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  pillar: string
  level: 'Débutant' | 'Intermédiaire' | 'Tous niveaux'
  price: number
  duration: string
  cover: string
  status: 'published' | 'draft'
  outcomes: string[]
  verses: string[]
  modules: Module[]
  updatedAt: number
}
