import type { Course, Lesson, Module, Question } from './types'

/**
 * SFC Finances catalogue: the two paid formations taught by Odile T., structured week by week.
 * Lesson texts are demo content to be replaced by the final course material. Bible passages are cited by reference only.
 */
type L = { t: string; k: 'video' | 'reading'; d: string; intro: string; points: string[]; ref?: string; practice: string }
type M = { t: string; lessons: L[]; quiz?: Question[]; final?: boolean }

const md = (l: L) =>
  `${l.intro}\n\n## Points clés\n${l.points.map((p) => `- ${p}`).join('\n')}\n\n${l.ref ? `## À méditer\nRelisez ${l.ref} et notez ce que ce passage vous dit de votre manière de gérer.\n\n` : ''}## Mise en pratique\n${l.practice}\n\n## Pour aller plus loin\nPrenez un moment de calme pour faire le point. Avancer lentement mais régulièrement vaut mieux qu’un grand changement abandonné après une semaine. Notez une décision concrète à appliquer avant la prochaine leçon.`

let n = 0
let pdf: Lesson['pdfs'] = []
const lesson = (l: L): Lesson => ({ id: `l${++n}`, title: l.t, kind: l.k, duration: l.d, video: l.k === 'video' ? { type: 'demo', src: '' } : undefined, transcript: md(l), pdfs: l.k === 'reading' ? pdf : [] })
const quizLesson = (title: string, quiz: Question[]): Lesson => ({ id: `l${++n}`, title, kind: 'quiz', duration: `${quiz.length} questions`, transcript: '', pdfs: [], quiz })
const mod = (m: M, i: number): Module => ({ id: `m${n}-${i}`, title: m.t, lessons: [...m.lessons.map(lesson), ...(m.quiz ? [quizLesson(m.final ? 'Évaluation finale' : `Quiz : ${m.t}`, m.quiz)] : [])] })

function course(c: Omit<Course, 'id' | 'modules' | 'status' | 'updatedAt'> & { mods: M[]; workbook: { name: string; url: string; size: number } }): Course {
  const { mods, workbook, ...rest } = c
  pdf = [{ id: `pdf-${c.slug}`, name: workbook.name, size: workbook.size, ref: '', url: workbook.url }]
  mods[mods.length - 1].final = true
  return { ...rest, id: c.slug, status: 'published', updatedAt: 0, modules: mods.map(mod) }
}

/** Formation titles and durations live here so they can be renamed in one place. */
export const F1 = { slug: 'reprendre-le-controle-de-vos-finances', title: 'Reprendre le contrôle de vos finances', weeks: 3, duration: '3 semaines', price: 70 }
export const F2 = { slug: 'restaurer-et-prosperer', title: 'Restaurer et Prospère', weeks: 8, duration: '8 semaines', price: 500 }

export const seedCourses: Course[] = [
  course({
    slug: F1.slug, title: F1.title, duration: F1.duration, price: F1.price,
    subtitle: 'Trois semaines pour voir clair, s’organiser et avancer en paix',
    description: 'Un parcours de trois semaines pour faire un état des lieux honnête de votre situation, bâtir un budget qui vous ressemble et poser des habitudes durables, à la lumière de la Parole de Dieu. Chaque semaine associe enseignements vidéo, lectures, un cahier d’exercices et un quiz.',
    pillar: 'Budget & organisation', level: 'Débutant', cover: '/img/cover-budget.webp',
    outcomes: ['Faire un état des lieux serein de vos finances', 'Construire un budget mensuel réaliste', 'Identifier et réduire les fuites d’argent', 'Installer un rendez-vous financier régulier'],
    verses: ['Proverbes 27:23', 'Luc 14:28', 'Luc 16:10'],
    workbook: { name: 'Cahier d’exercices – Reprendre le contrôle.pdf', url: '/pdf/cahier-reprendre-le-controle.pdf', size: 735079 },
    mods: [
      { t: 'Semaine 1 : Voir clair', lessons: [
        { t: 'Dieu nous confie, nous gérons', k: 'video', d: '10 min', intro: 'Reprendre le contrôle commence par un changement de regard : nos ressources nous sont confiées, et nous sommes appelés à les gérer avec fidélité.', points: ['L’argent est un outil, pas un maître', 'Être fidèle dans les petites choses', 'Avancer sans peur ni culpabilité'], ref: 'Luc 16:10', practice: 'Écrivez en une phrase votre relation actuelle avec l’argent.' },
        { t: 'Mon état des lieux', k: 'reading', d: '12 min', intro: 'Nous rassemblons les chiffres d’un mois type : revenus, charges fixes, dépenses variables, dettes et épargne.', points: ['Relevés et reçus du dernier mois', 'Charges fixes et dépenses variables', 'Regarder la réalité avec bienveillance'], ref: 'Proverbes 27:23', practice: 'Complétez la fiche « Mon mois type » du cahier d’exercices.' },
      ], quiz: [
        { q: 'Selon l’enseignement, nos ressources sont avant tout…', options: ['Des biens qui nous sont confiés', 'Une récompense méritée', 'Un sujet à éviter'], answer: 0 },
        { q: 'Un état des lieux financier sert à…', options: ['Se juger', 'Voir clair avant d’agir', 'Remplacer le budget'], answer: 1 },
      ] },
      { t: 'Semaine 2 : S’organiser', lessons: [
        { t: 'Construire son budget', k: 'video', d: '12 min', intro: 'Un budget, c’est donner une mission à chaque franc avant que le mois commence.', points: ['Revenus moins dépenses prévues = zéro', 'Une ligne pour donner, épargner et vivre', 'Adapter aux revenus irréguliers'], ref: 'Luc 14:28', practice: 'Préparez votre budget du mois prochain avec la grille du cahier.' },
        { t: 'Repérer les fuites d’argent', k: 'reading', d: '9 min', intro: 'Les petites dépenses répétées pèsent lourd. Nous apprenons à les repérer sans nous priver de tout.', points: ['Abonnements et achats impulsifs', 'Différencier besoin et envie', 'Remplacer plutôt que supprimer'], practice: 'Listez trois fuites et une alternative pour chacune.' },
      ], quiz: [
        { q: 'Dans un budget « base zéro », chaque franc…', options: ['Reçoit une mission', 'Reste sur le compte', 'Est dépensé au hasard'], answer: 0 },
        { q: 'Face aux petites dépenses répétées, on conseille de…', options: ['Les ignorer', 'Les repérer et les remplacer', 'Tout supprimer d’un coup'], answer: 1 },
      ] },
      { t: 'Semaine 3 : Tenir dans la durée', lessons: [
        { t: 'Mon rendez-vous financier', k: 'video', d: '9 min', intro: 'La régularité vaut mieux que la perfection. Un rendez-vous mensuel permet d’ajuster sans se décourager.', points: ['Un moment fixe chaque mois', 'Faire le point en couple ou en famille', 'Célébrer les progrès'], practice: 'Fixez la date de votre premier rendez-vous financier.' },
        { t: 'Mon plan pour les 90 prochains jours', k: 'reading', d: '10 min', intro: 'Nous terminons par un plan simple : trois décisions concrètes et un objectif d’épargne de précaution.', points: ['Trois décisions à appliquer', 'Un premier objectif d’épargne', 'Prier et persévérer'], ref: 'Proverbes 21:5', practice: 'Rédigez votre plan 90 jours dans le cahier d’exercices.' },
      ], quiz: [
        { q: 'Avant de changer ses habitudes, il est conseillé de…', options: ['Faire un état des lieux', 'Ouvrir un crédit', 'Ne rien noter'], answer: 0 },
        { q: 'Un rendez-vous financier mensuel sert à…', options: ['Culpabiliser', 'Faire le point et ajuster', 'Éviter de parler d’argent'], answer: 1 },
        { q: 'Les décisions du plan 90 jours doivent être…', options: ['Concrètes et écrites', 'Vagues', 'Changées chaque jour'], answer: 0 },
      ] },
    ],
  }),
  course({
    slug: F2.slug, title: F2.title, duration: F2.duration, price: F2.price,
    subtitle: 'Un accompagnement de huit semaines pour se relever et bâtir durablement',
    description: 'Le programme approfondi de SFC Finances : huit semaines pour guérir son rapport à l’argent, sortir des dettes, constituer une épargne, protéger sa famille, développer ses revenus et vivre la générosité. Un cheminement complet, respectueux de la foi, avec Odile T.',
    pillar: 'Restauration & prospérité', level: 'Tous niveaux', cover: '/img/cover-bourse.webp',
    outcomes: ['Guérir son rapport à l’argent', 'Établir un plan de sortie des dettes', 'Constituer une épargne de précaution', 'Développer et diversifier ses revenus', 'Transmettre et vivre la générosité'],
    verses: ['Joël 2:25', 'Proverbes 21:5', 'Proverbes 22:7', 'Deutéronome 8:18', '2 Corinthiens 9:7'],
    workbook: { name: 'Cahier d’exercices – Restaurer et Prospérer.pdf', url: '/pdf/cahier-restaurer-et-prosperer.pdf', size: 737805 },
    mods: [
      { t: 'Semaine 1 : Restaurer son rapport à l’argent', lessons: [
        { t: 'Ce que Dieu veut restaurer', k: 'video', d: '12 min', intro: 'La restauration commence par l’espérance : ce qui a été perdu peut être rebâti, pas à pas.', points: ['Accueillir la grâce d’un nouveau départ', 'Identifier ses croyances sur l’argent', 'Sortir de la honte'], ref: 'Joël 2:25', practice: 'Notez trois croyances sur l’argent héritées de votre histoire.' },
        { t: 'Mon histoire financière', k: 'reading', d: '10 min', intro: 'Comprendre d’où l’on vient aide à choisir où l’on va.', points: ['Les événements marquants', 'Les habitudes familiales', 'Ce que je veux garder ou changer'], practice: 'Complétez la frise « Mon histoire financière ».' },
      ], quiz: [
        { q: 'La restauration financière commence par…', options: ['L’espérance et un regard nouveau', 'Un nouveau crédit', 'L’oubli du passé'], answer: 0 },
        { q: 'Identifier ses croyances sur l’argent permet…', options: ['De choisir consciemment', 'De se juger', 'Rien de concret'], answer: 0 },
      ] },
      { t: 'Semaine 2 : Le bilan complet', lessons: [
        { t: 'Patrimoine, dettes et flux', k: 'video', d: '13 min', intro: 'Nous établissons un bilan complet : ce que vous possédez, ce que vous devez et ce qui entre et sort chaque mois.', points: ['Actifs et passifs', 'Flux mensuels', 'Le reste à vivre'], ref: 'Proverbes 27:23', practice: 'Remplissez le tableau de bilan du cahier.' },
        { t: 'Lire son bilan sans peur', k: 'reading', d: '9 min', intro: 'Un bilan n’est pas un verdict, c’est un point de départ.', points: ['Repérer les urgences', 'Distinguer l’essentiel', 'Fixer un premier cap'], practice: 'Entourez les trois urgences de votre bilan.' },
      ], quiz: [
        { q: 'Le « reste à vivre » correspond à…', options: ['Ce qui reste après les charges fixes', 'Le total des dettes', 'L’épargne'], answer: 0 },
        { q: 'Un bilan financier est…', options: ['Un point de départ', 'Un verdict définitif', 'Inutile'], answer: 0 },
      ] },
      { t: 'Semaine 3 : Un budget qui libère', lessons: [
        { t: 'Le budget base zéro', k: 'video', d: '11 min', intro: 'Chaque franc reçoit une mission : donner, épargner, vivre, rembourser.', points: ['Planifier avant de dépenser', 'La méthode des enveloppes', 'Revenus irréguliers'], ref: 'Luc 14:28', practice: 'Construisez votre budget base zéro.' },
        { t: 'Budget en couple et en famille', k: 'reading', d: '9 min', intro: 'Le budget devient un outil d’unité quand il est construit ensemble.', points: ['Parler d’argent avec douceur', 'Objectifs communs', 'Rôles clairs'], practice: 'Planifiez une discussion budget en famille.' },
      ], quiz: [
        { q: 'La méthode des enveloppes consiste à…', options: ['Répartir l’argent par poste à l’avance', 'Tout garder dans une enveloppe', 'Dépenser librement'], answer: 0 },
        { q: 'En couple, le budget gagne à être…', options: ['Construit ensemble', 'Caché', 'Imposé'], answer: 0 },
      ] },
      { t: 'Semaine 4 : Sortir des dettes', lessons: [
        { t: 'Comprendre l’esclavage de la dette', k: 'video', d: '12 min', intro: 'La dette pèse sur la liberté. Nous la regardons en face pour mieux en sortir.', points: ['Lister toutes ses dettes', 'Stopper les nouvelles dettes', 'Négocier avec ses créanciers'], ref: 'Proverbes 22:7', practice: 'Dressez la liste complète de vos dettes.' },
        { t: 'La méthode boule de neige', k: 'reading', d: '10 min', intro: 'Rembourser la plus petite dette d’abord crée un élan qui encourage.', points: ['Ordonner ses dettes', 'Payer le minimum partout', 'Réinvestir chaque dette soldée'], practice: 'Établissez votre plan boule de neige.' },
      ], quiz: [
        { q: 'Dans la méthode boule de neige, on rembourse d’abord…', options: ['La plus petite dette', 'La plus grande', 'Au hasard'], answer: 0 },
        { q: 'La première étape pour sortir des dettes est de…', options: ['Les lister toutes', 'Emprunter encore', 'Les ignorer'], answer: 0 },
      ] },
      { t: 'Semaine 5 : Épargner avec sagesse', lessons: [
        { t: 'L’épargne de précaution', k: 'video', d: '10 min', intro: 'Une réserve pour les imprévus protège la paix du foyer.', points: ['Un premier palier modeste', 'Puis trois à six mois de charges', 'Un compte séparé'], ref: 'Proverbes 21:20', practice: 'Fixez votre premier palier d’épargne.' },
        { t: 'Épargner pour ses projets', k: 'reading', d: '9 min', intro: 'Chaque projet mérite son enveloppe : études, logement, équipement.', points: ['Nommer ses projets', 'Calculer un montant mensuel', 'Automatiser'], practice: 'Créez une enveloppe projet.' },
      ], quiz: [
        { q: 'L’épargne de précaution sert à…', options: ['Faire face aux imprévus', 'Acheter des envies', 'Rien'], answer: 0 },
        { q: 'Pour épargner régulièrement, il est utile de…', options: ['Automatiser', 'Attendre la fin du mois', 'Ne rien prévoir'], answer: 0 },
      ] },
      { t: 'Semaine 6 : Développer ses revenus', lessons: [
        { t: 'Talents et opportunités', k: 'video', d: '12 min', intro: 'Dieu donne la force d’acquérir des richesses : nous explorons vos talents et les opportunités autour de vous.', points: ['Inventaire de ses compétences', 'Activités complémentaires', 'Travail honnête et diligent'], ref: 'Deutéronome 8:18', practice: 'Listez trois idées de revenus complémentaires.' },
        { t: 'Lancer une activité avec prudence', k: 'reading', d: '10 min', intro: 'Avancer par petites étapes limite les risques.', points: ['Tester avant d’investir', 'Séparer les comptes', 'Mesurer les résultats'], practice: 'Choisissez une idée et sa première étape.' },
      ], quiz: [
        { q: 'Pour lancer une activité, il est prudent de…', options: ['Tester à petite échelle', 'Tout investir d’un coup', 'Mélanger les comptes'], answer: 0 },
        { q: 'L’inventaire des compétences sert à…', options: ['Repérer ses talents', 'Se comparer', 'Rien'], answer: 0 },
      ] },
      { t: 'Semaine 7 : Protéger et transmettre', lessons: [
        { t: 'Protéger sa famille', k: 'video', d: '11 min', intro: 'Prévoir, c’est aimer : assurances, documents et organisation protègent ceux qu’on aime.', points: ['Les protections essentielles', 'Ranger ses documents', 'Informer ses proches'], practice: 'Rassemblez vos documents importants.' },
        { t: 'Transmettre la sagesse financière', k: 'reading', d: '9 min', intro: 'Enseigner aux enfants la valeur de l’argent est un héritage précieux.', points: ['Argent de poche éducatif', 'Montrer l’exemple', 'Parler de générosité'], ref: 'Proverbes 13:22', practice: 'Prévoyez une activité financière avec vos enfants.' },
      ], quiz: [
        { q: 'Protéger sa famille passe notamment par…', options: ['Organiser ses documents', 'Ne rien prévoir', 'Garder le silence'], answer: 0 },
        { q: 'Transmettre la sagesse financière aux enfants passe par…', options: ['L’exemple et l’enseignement', 'Le secret', 'L’interdiction d’en parler'], answer: 0 },
      ] },
      { t: 'Semaine 8 : Prospérer et donner', lessons: [
        { t: 'La prospérité selon la Parole', k: 'video', d: '12 min', intro: 'Prospérer, c’est vivre dans la paix, la suffisance et la générosité, pas dans l’accumulation.', points: ['Le contentement', 'La générosité joyeuse', 'Une vision à long terme'], ref: '2 Corinthiens 9:7', practice: 'Écrivez votre définition de la prospérité.' },
        { t: 'Mon plan de vie financière', k: 'reading', d: '12 min', intro: 'Nous rassemblons tout le parcours dans un plan clair pour les douze prochains mois.', points: ['Objectifs à 1 an', 'Rendez-vous mensuels', 'Accompagnement et redevabilité'], practice: 'Finalisez votre plan de vie financière dans le cahier.' },
      ], quiz: [
        { q: 'Selon le parcours, prospérer signifie surtout…', options: ['Paix, suffisance et générosité', 'Accumuler sans fin', 'Ne jamais donner'], answer: 0 },
        { q: 'Dans la méthode boule de neige, on rembourse d’abord…', options: ['La plus grande dette', 'La plus petite dette', 'Au hasard'], answer: 1 },
        { q: 'L’épargne de précaution sert à…', options: ['Faire face aux imprévus', 'Financer des envies', 'Remplacer le budget'], answer: 0 },
      ] },
    ],
  }),
]
