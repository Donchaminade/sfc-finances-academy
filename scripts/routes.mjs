// Public routes that are prerendered and listed in the sitemap.
export const slugs = ['reprendre-le-controle-de-vos-finances', 'restaurer-et-prosperer']
export const routes = ['/', '/formations', '/a-propos', '/ressources', '/certificats', ...slugs.map((s) => `/formations/${s}`)]
// Prerendered too (noindex), but not listed in the sitemap.
export const extraRoutes = ['/connexion', '/inscription']
