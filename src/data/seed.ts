import type { Course, Lesson, Module, Question } from './types'

/**
 * Example catalogue. The course content is illustrative example material written for this demo.
 * Bible passages are cited by reference only.
 */
type L = { t: string; k: 'video' | 'reading'; d: string; intro: string; points: string[]; ref?: string; practice: string }
type M = { t: string; lessons: L[]; quiz?: Question[] }

const md = (l: L) =>
  `${l.intro}\n\n## Points clés\n${l.points.map((p) => `- ${p}`).join('\n')}\n\n${l.ref ? `## À méditer\nRelisez ${l.ref} et notez ce que ce passage vous dit de votre manière de gérer.\n\n` : ''}## Mise en pratique\n${l.practice}\n\n## Pour aller plus loin\nPrenez un moment de calme pour faire le point. Avancer lentement mais régulièrement vaut mieux qu’un grand changement abandonné après une semaine. Notez une décision concrète à appliquer avant la prochaine leçon.`

let n = 0
const lesson = (l: L): Lesson => ({ id: `l${++n}`, title: l.t, kind: l.k, duration: l.d, video: l.k === 'video' ? { type: 'demo', src: '' } : undefined, transcript: md(l), pdfs: [] })
const quizLesson = (title: string, quiz: Question[]): Lesson => ({ id: `l${++n}`, title, kind: 'quiz', duration: `${quiz.length} questions`, transcript: '', pdfs: [], quiz })
const mod = (m: M, i: number): Module => ({ id: `m${n}-${i}`, title: m.t, lessons: [...m.lessons.map(lesson), ...(m.quiz ? [quizLesson(i === 2 ? 'Évaluation finale' : `Quiz : ${m.t}`, m.quiz)] : [])] })

function course(c: Omit<Course, 'id' | 'modules' | 'status' | 'updatedAt'> & { mods: M[] }): Course {
  const { mods, ...rest } = c
  return { ...rest, id: c.slug, status: 'published', updatedAt: 0, modules: mods.map(mod) }
}

export const seedCourses: Course[] = [
  course({
    slug: 'intendance-biblique-des-finances',
    title: 'Intendance biblique des finances',
    subtitle: 'Gérer ce qui nous est confié avec fidélité',
    description: 'Une formation fondatrice pour comprendre ce que la Bible enseigne sur l’argent, la responsabilité et la fidélité. Vous découvrirez le principe d’intendance, poserez un regard apaisé sur votre situation, et repartirez avec vos premières décisions concrètes.',
    pillar: 'Intendance biblique', level: 'Débutant', price: 29, duration: '2 h 10', cover: '/img/cover-intendance.webp',
    outcomes: ['Comprendre le principe d’intendance', 'Faire un état des lieux serein de vos finances', 'Définir vos priorités selon vos valeurs', 'Poser trois premières décisions concrètes'],
    verses: ['Luc 16:10', 'Proverbes 21:5', 'Psaume 24:1'],
    mods: [
      { t: 'Fondements', lessons: [
        { t: 'Ce que la Parole dit de l’argent', k: 'video', d: '9 min', intro: 'L’argent n’est ni bon ni mauvais en soi. C’est un outil, et la Bible parle souvent de la manière dont nous l’utilisons. Cette leçon pose les bases d’un regard juste et apaisé.', points: ['Tout ce que nous avons nous est confié', 'Le cœur compte autant que les chiffres', 'La sagesse se manifeste dans les choix quotidiens'], ref: 'Psaume 24:1', practice: 'Écrivez en une phrase votre relation actuelle avec l’argent : peur, indifférence, contrôle, confiance ?' },
        { t: 'Le principe d’intendance', k: 'reading', d: '7 min', intro: 'Un intendant gère un bien qui ne lui appartient pas, au service de son maître. Appliqué à nos finances, ce principe change notre façon de décider.', points: ['Être fidèle dans les petites choses', 'Rendre compte de sa gestion', 'Gérer pour servir, pas seulement pour posséder'], ref: 'Luc 16:10', practice: 'Listez trois dépenses récentes et demandez-vous si elles reflètent une gestion fidèle.' },
      ], quiz: [
        { q: 'Selon le principe d’intendance, nos ressources sont avant tout…', options: ['Une récompense méritée', 'Des biens qui nous sont confiés', 'Un sujet à éviter'], answer: 1 },
        { q: 'Être fidèle « dans les petites choses » signifie…', options: ['Négliger les petites dépenses', 'Bien gérer aussi les petits montants', 'Attendre d’avoir beaucoup pour bien gérer'], answer: 1 },
      ] },
      { t: 'Faire le point', lessons: [
        { t: 'Un état des lieux sans culpabilité', k: 'video', d: '11 min', intro: 'Avant de changer, il faut voir clair. Nous allons dresser la liste de vos revenus, dépenses, dettes et épargne, avec bienveillance.', points: ['Rassembler les chiffres d’un mois type', 'Distinguer charges fixes et variables', 'Regarder la réalité sans se juger'], practice: 'Remplissez le tableau « Mon mois type » : revenus, charges fixes, dépenses variables, dettes.' },
        { t: 'Définir ses priorités', k: 'reading', d: '6 min', intro: 'Vos finances racontent vos priorités. Ici, vous allez les choisir consciemment plutôt que de les subir.', points: ['Les besoins avant les envies', 'Une place pour donner, épargner et vivre', 'Des priorités écrites et partagées en famille'], ref: 'Proverbes 21:5', practice: 'Classez vos cinq priorités financières pour les douze prochains mois.' },
      ] },
      { t: 'Passer à l’action', lessons: [
        { t: 'Trois décisions pour commencer', k: 'video', d: '8 min', intro: 'La fidélité se construit par de petites décisions répétées. Nous terminons par un plan simple pour les trente prochains jours.', points: ['Une habitude à commencer', 'Une dépense à réduire', 'Un rendez-vous mensuel avec vos finances'], practice: 'Notez vos trois décisions et la date de votre premier « rendez-vous finances ».' },
      ], quiz: [
        { q: 'Avant de changer ses habitudes, il est conseillé de…', options: ['Faire un état des lieux', 'Ouvrir un crédit', 'Ne rien noter'], answer: 0 },
        { q: 'Un « rendez-vous finances » mensuel sert à…', options: ['Culpabiliser', 'Faire le point et ajuster', 'Éviter de parler d’argent'], answer: 1 },
        { q: 'Les priorités financières devraient être…', options: ['Écrites et réfléchies', 'Changées chaque jour', 'Fixées par la publicité'], answer: 0 },
      ] },
    ],
  }),
  course({
    slug: 'budget-et-gestion-des-revenus',
    title: 'Budget & gestion des revenus',
    subtitle: 'Donner une mission à chaque franc',
    description: 'Apprenez à construire un budget simple qui fonctionne vraiment, adapté aux revenus réguliers comme irréguliers. Méthode des enveloppes, suivi mensuel et dialogue en famille : tout pour retrouver la maîtrise et la paix.',
    pillar: 'Budget & revenus', level: 'Débutant', price: 35, duration: '2 h 40', cover: '/img/cover-budget.webp',
    outcomes: ['Construire un budget mensuel réaliste', 'Utiliser la méthode des enveloppes', 'Gérer des revenus irréguliers', 'Suivre et ajuster chaque mois'],
    verses: ['Proverbes 27:23', 'Luc 14:28'],
    mods: [
      { t: 'Les bases du budget', lessons: [
        { t: 'Pourquoi un budget libère', k: 'video', d: '8 min', intro: 'Un budget n’est pas une prison : c’est un plan qui vous permet de dire oui à l’essentiel.', points: ['Décider à l’avance plutôt que subir', 'Moins de stress en fin de mois', 'Un outil de dialogue en famille'], ref: 'Proverbes 27:23', practice: 'Notez ce que vous aimeriez que votre budget vous permette dans un an.' },
        { t: 'Construire son premier budget', k: 'reading', d: '10 min', intro: 'Pas à pas, nous construisons un budget à partir de votre mois type.', points: ['Partir du revenu net réel', 'Lister les charges fixes', 'Prévoir donner, épargner et imprévus'], practice: 'Remplissez le modèle de budget avec vos chiffres du mois dernier.' },
      ], quiz: [
        { q: 'Un budget sert d’abord à…', options: ['Décider à l’avance de l’usage de ses revenus', 'Se priver de tout', 'Impressionner les autres'], answer: 0 },
        { q: 'On construit son budget à partir…', options: ['Du revenu brut espéré', 'Du revenu net réellement perçu', 'Des dépenses des voisins'], answer: 1 },
      ] },
      { t: 'Méthodes pratiques', lessons: [
        { t: 'La méthode des enveloppes', k: 'video', d: '12 min', intro: 'Chaque catégorie reçoit son enveloppe : quand elle est vide, on s’arrête. Simple et efficace, en espèces ou sur Mobile Money.', points: ['Choisir 5 à 7 enveloppes', 'Alimenter en début de mois', 'Ne pas « emprunter » entre enveloppes sans décision'], practice: 'Définissez vos enveloppes et le montant de chacune.' },
        { t: 'Revenus irréguliers : mode d’emploi', k: 'reading', d: '8 min', intro: 'Commerçants, indépendants, saisonniers : un budget reste possible avec un revenu de base prudent.', points: ['Calculer un revenu de base prudent', 'Mettre le surplus en réserve', 'Lisser les mois difficiles'], practice: 'Calculez la moyenne de vos trois mois les plus faibles : ce sera votre base.' },
      ] },
      { t: 'Suivre et ajuster', lessons: [
        { t: 'Le rendez-vous mensuel', k: 'video', d: '9 min', intro: 'Un budget vit. Chaque mois, on compare le prévu au réel et on ajuste avec douceur.', points: ['Comparer prévu et réel', 'Célébrer les progrès', 'Ajuster sans abandonner'], ref: 'Luc 14:28', practice: 'Fixez la date de votre rendez-vous budget du mois prochain.' },
      ], quiz: [
        { q: 'Dans la méthode des enveloppes, quand une enveloppe est vide…', options: ['On continue de dépenser', 'On s’arrête ou on décide consciemment', 'On emprunte'], answer: 1 },
        { q: 'Avec un revenu irrégulier, on budgète sur la base…', options: ['Du meilleur mois', 'D’un revenu prudent', 'D’un crédit'], answer: 1 },
        { q: 'Le rendez-vous mensuel consiste à…', options: ['Comparer prévu et réel', 'Supprimer le budget', 'Ignorer les écarts'], answer: 0 },
      ] },
    ],
  }),
  course({
    slug: 'epargner-avec-sagesse',
    title: 'Épargner avec sagesse',
    subtitle: 'Construire une réserve pas à pas',
    description: 'L’épargne n’est pas réservée aux hauts revenus. Découvrez comment constituer un fonds d’urgence, épargner pour vos objectifs et garder un cœur confiant, même avec de petits montants.',
    pillar: 'Épargne avec sagesse', level: 'Débutant', price: 29, duration: '1 h 55', cover: '/img/cover-bourse.webp',
    outcomes: ['Comprendre le rôle de l’épargne', 'Constituer un fonds d’urgence', 'Épargner par objectifs', 'Automatiser ses versements'],
    verses: ['Proverbes 6:6-8', 'Proverbes 21:20'],
    mods: [
      { t: 'Pourquoi épargner', lessons: [
        { t: 'La sagesse de la fourmi', k: 'video', d: '7 min', intro: 'La fourmi prépare en été ce dont elle aura besoin plus tard. Épargner, c’est prévoir avec sagesse sans vivre dans la peur.', points: ['Prévoir n’est pas manquer de foi', 'De petits montants réguliers', 'L’épargne protège la famille'], ref: 'Proverbes 6:6-8', practice: 'Choisissez un montant d’épargne hebdomadaire, même modeste.' },
        { t: 'Le fonds d’urgence', k: 'reading', d: '8 min', intro: 'Une réserve pour les imprévus évite de s’endetter au premier coup dur.', points: ['Objectif : un à trois mois de charges', 'Un compte séparé et accessible', 'On le reconstitue après usage'], practice: 'Calculez le montant cible de votre fonds d’urgence.' },
      ], quiz: [
        { q: 'Le fonds d’urgence sert à…', options: ['Financer les vacances', 'Faire face aux imprévus', 'Prêter à tout le monde'], answer: 1 },
        { q: 'Pour épargner, il faut…', options: ['Un gros salaire', 'De la régularité, même avec de petits montants', 'Attendre la fin du mois'], answer: 1 },
      ] },
      { t: 'Épargner par objectifs', lessons: [
        { t: 'Nommer ses objectifs', k: 'video', d: '9 min', intro: 'Une épargne qui a un nom est plus facile à tenir : scolarité, logement, projet familial.', points: ['Un objectif, un montant, une date', 'Diviser en versements mensuels', 'Suivre sa progression'], practice: 'Écrivez deux objectifs avec leur montant et leur date.' },
        { t: 'Automatiser pour tenir', k: 'reading', d: '6 min', intro: 'Épargner dès la réception du revenu plutôt qu’avec ce qui reste.', points: ['Se payer en premier', 'Virement ou transfert automatique', 'Revoir le montant chaque trimestre'], ref: 'Proverbes 21:20', practice: 'Programmez votre premier versement d’épargne.' },
      ] },
      { t: 'Garder un cœur confiant', lessons: [
        { t: 'Épargne et confiance', k: 'video', d: '7 min', intro: 'Épargner avec sagesse, c’est conjuguer prévoyance et confiance, sans thésauriser par peur.', points: ['Prévoyance et générosité vont ensemble', 'Éviter l’accumulation anxieuse', 'Revoir ses motivations'], practice: 'Notez ce qui motive votre épargne : sécurité, projet, liberté ?' },
      ], quiz: [
        { q: '« Se payer en premier » signifie…', options: ['Épargner dès la réception du revenu', 'Dépenser d’abord pour soi', 'Ne rien épargner'], answer: 0 },
        { q: 'Un objectif d’épargne efficace comporte…', options: ['Un montant et une date', 'Seulement une envie', 'Aucun suivi'], answer: 0 },
        { q: 'L’épargne sage s’accompagne…', options: ['De peur permanente', 'De prévoyance et de confiance', 'D’avarice'], answer: 1 },
      ] },
    ],
  }),
  course({
    slug: 'planifier-ses-projets',
    title: 'Planifier ses projets',
    subtitle: 'Calculer la dépense avant de bâtir',
    description: 'Mariage, scolarité, construction, création d’activité : apprenez à chiffrer un projet, à établir un calendrier réaliste et à avancer sans vous mettre en danger financièrement.',
    pillar: 'Planifier ses projets', level: 'Intermédiaire', price: 39, duration: '2 h 20', cover: '/img/cover-bilan.webp',
    outcomes: ['Chiffrer un projet de façon réaliste', 'Établir un plan de financement', 'Prévoir les imprévus', 'Suivre l’avancement'],
    verses: ['Luc 14:28', 'Proverbes 16:3'],
    mods: [
      { t: 'Clarifier le projet', lessons: [
        { t: 'Calculer la dépense', k: 'video', d: '10 min', intro: 'Avant de bâtir une tour, on s’assoit pour calculer la dépense. Ce principe s’applique à tous nos projets.', points: ['Définir précisément le projet', 'Lister tous les coûts', 'Prévoir une marge pour l’imprévu'], ref: 'Luc 14:28', practice: 'Décrivez votre projet en cinq lignes et listez ses coûts.' },
        { t: 'Prioriser ses projets', k: 'reading', d: '7 min', intro: 'On ne peut pas tout faire en même temps. Choisir, c’est avancer.', points: ['Urgent, important ou souhaitable', 'Un projet principal à la fois', 'Associer la famille à la décision'], ref: 'Proverbes 16:3', practice: 'Classez vos projets en trois catégories.' },
      ], quiz: [
        { q: 'Avant de lancer un projet, il faut d’abord…', options: ['Calculer la dépense', 'Emprunter', 'Commencer sans plan'], answer: 0 },
        { q: 'Une marge pour imprévus sert à…', options: ['Rien', 'Absorber les surcoûts', 'Dépenser plus'], answer: 1 },
      ] },
      { t: 'Financer sans se mettre en danger', lessons: [
        { t: 'Le plan de financement', k: 'video', d: '12 min', intro: 'Épargne, apport, tontine, crédit éventuel : nous comparons les options avec prudence.', points: ['Privilégier l’épargne et l’apport', 'Mesurer le coût réel d’un crédit', 'Ne jamais mettre en danger les besoins essentiels'], practice: 'Remplissez le tableau de financement de votre projet.' },
        { t: 'Le calendrier réaliste', k: 'reading', d: '6 min', intro: 'Un bon calendrier découpe le projet en étapes financées une à une.', points: ['Des étapes claires', 'Un montant par étape', 'Des points de contrôle'], practice: 'Découpez votre projet en quatre étapes datées.' },
      ] },
      { t: 'Suivre et persévérer', lessons: [
        { t: 'Tenir dans la durée', k: 'video', d: '8 min', intro: 'Les projets prennent du temps. Nous voyons comment garder le cap avec patience.', points: ['Suivi mensuel', 'Ajuster sans renoncer', 'Célébrer chaque étape'], practice: 'Planifiez votre premier point de suivi.' },
      ], quiz: [
        { q: 'Un plan de financement prudent privilégie…', options: ['Le crédit à la consommation', 'L’épargne et l’apport', 'Les dépenses immédiates'], answer: 1 },
        { q: 'Découper un projet en étapes permet…', options: ['De le financer progressivement', 'De l’oublier', 'D’augmenter les coûts'], answer: 0 },
        { q: 'Un crédit ne doit jamais…', options: ['Être comparé', 'Mettre en danger les besoins essentiels', 'Être remboursé'], answer: 1 },
      ] },
    ],
  }),
  course({
    slug: 'sortir-des-dettes',
    title: 'Sortir des dettes',
    subtitle: 'Retrouver la liberté pas à pas',
    description: 'Un parcours bienveillant pour faire face à ses dettes : inventaire, priorités, plan de remboursement, dialogue avec les créanciers et nouvelles habitudes pour ne plus y retomber.',
    pillar: 'Sortir des dettes', level: 'Tous niveaux', price: 39, duration: '2 h 30', cover: '/img/cover-dettes.webp',
    outcomes: ['Faire l’inventaire de ses dettes', 'Choisir une méthode de remboursement', 'Dialoguer avec ses créanciers', 'Prévenir le surendettement'],
    verses: ['Proverbes 22:7', 'Romains 13:8'],
    mods: [
      { t: 'Regarder la situation en face', lessons: [
        { t: 'L’inventaire des dettes', k: 'video', d: '10 min', intro: 'La première étape vers la liberté est de tout écrire : à qui, combien, à quel taux, à quelle échéance.', points: ['Lister toutes les dettes', 'Noter taux et échéances', 'Ne pas se juger'], ref: 'Proverbes 22:7', practice: 'Remplissez le tableau d’inventaire de vos dettes.' },
        { t: 'Arrêter de creuser', k: 'reading', d: '6 min', intro: 'Avant de rembourser, on cesse d’ajouter de nouvelles dettes.', points: ['Suspendre les nouveaux crédits', 'Identifier les déclencheurs', 'Un petit fonds d’urgence'], practice: 'Notez les trois situations qui vous poussent à emprunter.' },
      ], quiz: [
        { q: 'La première étape pour sortir des dettes est…', options: ['Emprunter à nouveau', 'Faire l’inventaire complet', 'Ignorer les relances'], answer: 1 },
        { q: 'Avant de rembourser, il faut…', options: ['Arrêter de contracter de nouvelles dettes', 'Ouvrir un autre crédit', 'Ne rien changer'], answer: 0 },
      ] },
      { t: 'Le plan de remboursement', lessons: [
        { t: 'Boule de neige ou avalanche', k: 'video', d: '12 min', intro: 'Deux méthodes : rembourser d’abord la plus petite dette, ou la plus chère. Les deux fonctionnent si l’on persévère.', points: ['Boule de neige : motivation rapide', 'Avalanche : moins d’intérêts', 'Choisir et s’y tenir'], practice: 'Classez vos dettes selon la méthode choisie.' },
        { t: 'Parler à ses créanciers', k: 'reading', d: '8 min', intro: 'L’honnêteté et la transparence ouvrent souvent des solutions : échéancier, report, accord.', points: ['Prendre l’initiative', 'Proposer un montant réaliste', 'Garder une trace écrite'], ref: 'Romains 13:8', practice: 'Préparez le message à envoyer à un créancier.' },
      ] },
      { t: 'Rester libre', lessons: [
        { t: 'De nouvelles habitudes', k: 'video', d: '9 min', intro: 'Une fois libéré, on protège sa liberté avec un budget, une épargne et des choix réfléchis.', points: ['Budget et fonds d’urgence', 'Réfléchir avant d’acheter', 'Célébrer la liberté retrouvée'], practice: 'Écrivez votre « charte anti-dettes » en trois règles.' },
      ], quiz: [
        { q: 'La méthode « boule de neige » rembourse d’abord…', options: ['La plus petite dette', 'La plus ancienne', 'Au hasard'], answer: 0 },
        { q: 'Face à un créancier, il est conseillé de…', options: ['Se cacher', 'Prendre l’initiative du dialogue', 'Promettre l’impossible'], answer: 1 },
        { q: 'Pour rester libre, on s’appuie sur…', options: ['Un budget et une épargne', 'De nouveaux crédits', 'L’improvisation'], answer: 0 },
      ] },
    ],
  }),
  course({
    slug: 'donner-et-generosite',
    title: 'Donner & générosité',
    subtitle: 'Une générosité joyeuse et réfléchie',
    description: 'Découvrez la place du don dans une vie financière équilibrée : la dîme et les offrandes, l’aide aux proches, la solidarité, et comment intégrer la générosité à votre budget avec joie et sagesse.',
    pillar: 'Donner & générosité', level: 'Tous niveaux', price: 25, duration: '1 h 40', cover: '/img/cover-generosite.webp',
    outcomes: ['Comprendre la place du don', 'Intégrer le don au budget', 'Aider ses proches avec sagesse', 'Donner avec joie, sans pression'],
    verses: ['2 Corinthiens 9:7', 'Actes 20:35'],
    mods: [
      { t: 'Le cœur du don', lessons: [
        { t: 'Donner avec joie', k: 'video', d: '8 min', intro: 'La générosité naît d’un cœur reconnaissant, pas de la contrainte.', points: ['Donner librement', 'La reconnaissance comme moteur', 'Le don transforme celui qui donne'], ref: '2 Corinthiens 9:7', practice: 'Notez un moment où donner vous a apporté de la joie.' },
        { t: 'Dîme, offrandes et solidarité', k: 'reading', d: '9 min', intro: 'Différentes formes de don coexistent. Nous les clarifions pour décider en conscience.', points: ['Comprendre chaque forme de don', 'Décider en prière et en famille', 'Rester régulier et discret'], practice: 'Listez les formes de don que vous pratiquez déjà.' },
      ], quiz: [
        { q: 'Selon la leçon, le don naît…', options: ['De la contrainte', 'D’un cœur reconnaissant', 'De la pression sociale'], answer: 1 },
        { q: 'Une décision de don se prend idéalement…', options: ['En conscience et en famille', 'Sous pression', 'Au hasard'], answer: 0 },
      ] },
      { t: 'Donner avec sagesse', lessons: [
        { t: 'Le don dans le budget', k: 'video', d: '9 min', intro: 'Prévoir le don dans le budget permet de donner régulièrement sans se mettre en difficulté.', points: ['Une ligne « donner » dans le budget', 'Un pourcentage choisi', 'Ajuster selon les saisons'], practice: 'Ajoutez une ligne « donner » à votre budget.' },
        { t: 'Aider ses proches sans s’épuiser', k: 'reading', d: '8 min', intro: 'La solidarité familiale est précieuse. Elle gagne à être organisée pour durer.', points: ['Fixer un cadre clair', 'Préférer aider à se relever', 'Savoir dire non avec amour'], ref: 'Actes 20:35', practice: 'Définissez votre enveloppe « solidarité » mensuelle.' },
      ] },
      { t: 'Une vie généreuse', lessons: [
        { t: 'La générosité au quotidien', k: 'video', d: '7 min', intro: 'Temps, talents, attention : la générosité ne se limite pas à l’argent.', points: ['Donner de son temps', 'Partager ses compétences', 'Cultiver la gratitude'], practice: 'Choisissez un geste généreux non financier pour cette semaine.' },
      ], quiz: [
        { q: 'Prévoir le don dans le budget permet…', options: ['De donner régulièrement sans difficulté', 'De ne jamais donner', 'De s’endetter'], answer: 0 },
        { q: 'Aider ses proches avec sagesse suppose…', options: ['Un cadre clair', 'Tout donner sans limite', 'Ne jamais aider'], answer: 0 },
        { q: 'La générosité peut aussi passer par…', options: ['Son temps et ses talents', 'Uniquement l’argent', 'Rien d’autre'], answer: 0 },
      ] },
    ],
  }),
]
