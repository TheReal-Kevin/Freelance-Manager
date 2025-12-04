/**
 * Service de gestion du localStorage
 * 
 * Fournit des fonctions pour lire, écrire et supprimer des données dans le localStorage
 * avec gestion d'erreurs pour la sérialisation/désérialisation JSON
 */

// Clés de stockage standardisées pour tous les contextes
const STORAGE_KEYS = {
  CLIENTS: 'freelance_clients',
  PROJECTS: 'freelance_projects',
  INVOICES: 'freelance_invoices',
  SETTINGS: 'freelance_settings',
  TIME_LOGS: 'freelance_time_logs',
};

/**
 * Charge des données depuis le localStorage
 * @param {string} key - La clé du stockage
 * @returns {Object|Array|null} Les données parsées ou null en cas d'erreur
 */
export const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    // Retourner null silencieusement en cas d'erreur de parsing
    return null;
  }
};

/**
 * Sauvegarde des données dans le localStorage
 * @param {string} key - La clé du stockage
 * @param {Object|Array} data - Les données à sauvegarder (seront sérialisées en JSON)
 */
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.error('Failed to save to localStorage');
  }
};

/**
 * Supprime une clé du localStorage
 * @param {string} key - La clé du stockage à supprimer
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    console.error('Failed to remove from localStorage');
  }
};

export default STORAGE_KEYS;
