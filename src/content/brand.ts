/** SFC Finances brand copy. The quoted texts are the official wording, keep them unchanged. */
export const SITE_URL = 'https://sfc-finances-academy.vercel.app'

export const brand = {
  name: 'SFC Finances',
  slogan: 'La sagesse divine au service de vos finances',
  intro:
    'SFC Finances est une plateforme d’éducation financière qui accompagne chacun dans la compréhension et la gestion responsable de ses finances à la lumière de la Parole de Dieu.',
  approach:
    'À travers des enseignements bibliques, des conseils pratiques et des contenus inspirants, SFC Finances vous aide à développer de bonnes habitudes financières, à mieux gérer vos revenus, à épargner avec sagesse, à planifier vos projets et à devenir un intendant fidèle des ressources que Dieu vous confie.',
  mission:
    'Notre mission est de vous aider à concilier foi, sagesse et bonne gestion financière afin de construire une vie financière plus saine, équilibrée et sereine.',
  withOdile: 'Avec Odile T., conseillère en finances personnelles, apprenez à comprendre les finances selon la Parole de Dieu.',
  socialLine: 'Retrouvez-nous sur YouTube, Facebook et Instagram (@sfc_finances), et rejoignez notre chaîne WhatsApp.',
  location: 'Lomé, Togo',
  handle: '@sfc_finances',
}

/** Official links. TikTok has no confirmed URL yet: set `url` to show it. */
export const TIKTOK_URL = ''
export const WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029Vb6kYx1Au3aUkz6RW40J'

export const socialsAll = [
  { id: 'youtube', name: 'YouTube', handle: '@sfcfinances', url: 'https://youtube.com/@sfcfinances' },
  { id: 'facebook', name: 'Facebook', handle: 'SFC Finances', url: 'https://www.facebook.com/share/1DW11fHChe/' },
  { id: 'instagram', name: 'Instagram', handle: '@sfc_finances', url: 'https://www.instagram.com/sfc_finances' },
  { id: 'whatsapp', name: 'Chaîne WhatsApp', handle: 'SFC Finances', url: WHATSAPP_CHANNEL },
  { id: 'tiktok', name: 'TikTok', handle: '@sfcfinances', url: TIKTOK_URL },
] as const

export const socials = socialsAll.filter((s) => s.url)

export const odile = {
  name: 'Odile T.',
  role: 'Conseillère en finances personnelles',
  portrait: '/images/odile-portrait-480.webp',
  portraitSmall: '/images/odile-portrait-160.webp',
  teaching: '/images/odile-enseignement-1200.webp',
  teachingSmall: '/images/odile-enseignement-640.webp',
  bio:
    'Odile T. accompagne celles et ceux qui souhaitent remettre de l’ordre dans leurs finances et les aligner avec leurs valeurs. Avec douceur et pédagogie, elle relie les principes de la Parole de Dieu aux gestes concrets du quotidien : faire un budget, épargner, planifier et donner.',
}

export const pillars = [
  { title: 'Intendance biblique', text: 'Comprendre que nos ressources nous sont confiées, et apprendre à les gérer avec fidélité.' },
  { title: 'Budget & revenus', text: 'Savoir où va chaque franc et donner une mission à vos revenus, chaque mois.' },
  { title: 'Épargne avec sagesse', text: 'Constituer une réserve pas à pas, sans pression, avec des objectifs clairs.' },
  { title: 'Planifier ses projets', text: 'Calculer la dépense avant de bâtir, et avancer avec sérénité vers vos projets.' },
  { title: 'Sortir des dettes', text: 'Retrouver la liberté grâce à un plan réaliste, patient et encourageant.' },
  { title: 'Donner & générosité', text: 'Faire de la générosité une joie réfléchie, intégrée à votre budget.' },
]

export const testimonials = [
  { name: 'Afi M.', city: 'Lomé', text: 'Pour la première fois, je sais où va mon salaire. Le module budget m’a apporté beaucoup de paix à la maison.' },
  { name: 'Kossi A.', city: 'Kara', text: 'Les leçons sont courtes et claires. Relier la Parole à mes choix d’argent a changé ma façon de dépenser.' },
  { name: 'Mireille D.', city: 'Cotonou', text: 'J’ai commencé une épargne régulière dès la deuxième semaine. Le ton est bienveillant, jamais culpabilisant.' },
  { name: 'Yao K.', city: 'Lomé', text: 'Le plan de sortie des dettes m’a redonné espoir. Je suis la progression module par module.' },
]

export const faq = [
  { q: 'À qui s’adressent les formations SFC Finances ?', a: 'À toute personne qui souhaite mieux gérer ses finances à la lumière de la Parole de Dieu : étudiants, jeunes actifs, couples, familles, entrepreneurs et responsables d’église.' },
  { q: 'Faut-il des connaissances en finance pour commencer ?', a: 'Non. Les parcours partent des bases et avancent pas à pas, avec des exemples simples et des exercices pratiques.' },
  { q: 'Comment se déroule une formation ?', a: 'Chaque formation est découpée en modules et en leçons (vidéo ou lecture). Les leçons se débloquent dans l’ordre, et un quiz valide chaque étape. Vous pouvez arrêter et reprendre exactement là où vous étiez.' },
  { q: 'Est-ce que j’obtiens un certificat ?', a: 'Oui. Lorsque vous atteignez 100 % et réussissez l’évaluation finale, un certificat SFC Finances à votre nom est délivré, avec un identifiant unique et une page de vérification.' },
  { q: 'Quels moyens de paiement sont acceptés ?', a: 'Mobile Money (Flooz, T-Money) et carte bancaire. Sur cette démonstration, le paiement est entièrement simulé : aucune somme n’est débitée.' },
  { q: 'Les enseignements remplacent-ils un conseil personnalisé ?', a: 'Non. Les formations donnent des repères et des outils d’éducation financière. Pour une situation particulière, rapprochez-vous d’un professionnel qualifié.' },
]

export const plans = [
  { name: 'Formation à l’unité', price: 'dès 19 €', period: 'accès à vie', features: ['Une formation au choix', 'Leçons vidéo et lecture', 'Quiz et suivi de progression', 'Certificat de réussite'], cta: 'Voir les formations', highlight: false },
  { name: 'Pass Sagesse', price: '79 €', period: '12 mois', features: ['Toutes les formations', 'Nouveaux contenus inclus', 'Reprise et suivi multi-cours', 'Tous les certificats'], cta: 'Choisir le Pass', highlight: true },
  { name: 'Églises & groupes', price: 'Sur demande', period: 'tarif groupe', features: ['Accès pour vos membres', 'Parcours adaptés aux groupes', 'Suivi de la progression', 'Accompagnement à l’organisation'], cta: 'Nous écrire', highlight: false },
]
