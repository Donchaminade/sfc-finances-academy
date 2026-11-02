export type Resource = { id: string; kind: string; title: string; subtitle: string; author: string; description: string; url: string; cover: string; price: string; format: string }

/** Prices noted on Amazon.fr on 2 November 2026. Indicative only; Amazon shows the current price. */
export const PRICE_NOTE = 'Prix indicatif relevé sur Amazon.fr le 2 novembre 2026, susceptible d’évoluer.'

export const defaultResources: Resource[] = [
  {
    id: 'guide-pratique', kind: 'Livre', title: 'Guide pratique pour gérer ses finances avec sagesse', subtitle: 'Le livre d’Odile T.', author: 'Odile T.',
    description: 'Un guide clair et concret pour reprendre la main sur son budget, sortir des dettes et épargner, à la lumière des principes bibliques de sagesse et d’intendance.',
    url: 'https://www.amazon.fr/dp/B0G1CPZSLW', cover: '/img/res-guide.webp', price: '18,99 €', format: 'Broché',
  },
  {
    id: 'mon-planner', kind: 'Cahier', title: 'Mon planner financier', subtitle: 'Sagesse financière', author: 'Odile T.',
    description: 'Le cahier compagnon pour planifier chaque mois : budget, suivi des dépenses, objectifs d’épargne et remboursements, page après page.',
    url: 'https://www.amazon.fr/dp/B0DJKVZX7C', cover: '/img/res-planner.webp', price: '', format: 'Relié',
  },
]
