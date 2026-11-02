/**
 * À propos: editable content.
 * The director's name is not confirmed yet. Fill `directrice.name` when it is known.
 * Swap the photo by replacing public/images/directrice.jpg (keep the same file name).
 */
export const directrice = {
  name: '', // TODO: confirm the name with SFC Finances
  title: 'Fondatrice & Directrice Générale',
  photo: '/images/directrice.jpg',
  photoSet: '/images/directrice-480.webp 480w, /images/directrice-960.webp 960w',
  description: [
    'À l’origine de SFC Finances, une conviction simple : la manière dont nous gérons l’argent est aussi une question de sagesse, de fidélité et de paix intérieure.',
    'Elle porte la vision de la plateforme : rendre l’éducation financière accessible, bienveillante et enracinée dans la Parole de Dieu, pour aider chacun à bâtir une vie financière plus saine, équilibrée et sereine.',
  ],
}

/**
 * Parcours (timeline). Neutral wording on purpose: no dates, diplomas or employers have been confirmed.
 * TODO: complete each entry with SFC Finances (period, details).
 */
export const parcours = [
  { label: 'La conviction', text: 'Le constat que beaucoup de familles manquent de repères pour gérer leurs revenus avec sérénité.' },
  { label: 'La vision', text: 'Relier foi et bonne gestion financière dans un enseignement clair, pratique et respectueux.' },
  { label: 'La création de SFC Finances', text: 'Le lancement d’une plateforme d’éducation financière ouverte à tous.' },
  { label: 'Aujourd’hui', text: 'Des enseignements partagés en ligne et une équipe pédagogique autour d’Odile T., conseillère en finances personnelles.' },
]

export const values = [
  { title: 'Foi', text: 'La Parole de Dieu comme boussole pour nos choix financiers.' },
  { title: 'Sagesse', text: 'Des décisions réfléchies, patientes et éclairées.' },
  { title: 'Fidélité', text: 'Être un intendant fidèle de ce qui nous est confié, dans les petites comme dans les grandes choses.' },
  { title: 'Sérénité', text: 'Une vie financière apaisée, pour soi et pour sa famille.' },
]
