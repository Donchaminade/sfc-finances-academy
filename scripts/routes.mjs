// Public routes that are prerendered and listed in the sitemap.
export const slugs = ['intendance-biblique-des-finances', 'budget-et-gestion-des-revenus', 'epargner-avec-sagesse', 'planifier-ses-projets', 'sortir-des-dettes', 'donner-et-generosite']
export const routes = ['/', '/formations', '/a-propos', '/certificats', ...slugs.map((s) => `/formations/${s}`)]
