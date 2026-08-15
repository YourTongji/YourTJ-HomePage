/**
 * Resolves a public asset against Vite's BASE_URL so the build keeps working
 * both on a custom domain and under a GitHub Pages project path.
 */
export const assetUrl = (path: string): string => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
