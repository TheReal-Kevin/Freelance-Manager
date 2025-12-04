/**
 * Utilitaires de filtrage et recherche
 * 
 * Fournit des fonctions pour filtrer et rechercher dans les listes de données
 * Supporte la recherche multi-champs et le filtrage par critères
 */

/**
 * Recherche générique sur plusieurs champs
 * @param {Array} items - Liste d'items à rechercher
 * @param {string} searchQuery - Terme de recherche
 * @param {Array<string>} searchFields - Champs à rechercher (supporte les chemins imbriqués: 'client.name')
 * @returns {Array} Items correspondant à la recherche
 */
export const searchItems = (items, searchQuery, searchFields) => {
  if (!searchQuery.trim()) return items;

  const query = searchQuery.toLowerCase();
  return items.filter(item =>
    searchFields.some(field => {
      // Supporter les chemins imbriqués (ex: 'client.name')
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      return value?.toString().toLowerCase().includes(query);
    })
  );
};

/**
 * Filtre les factures selon plusieurs critères
 * @param {Array} invoices - Liste des factures
 * @param {Object} filters - Critères de filtrage (status, clientId, search, dateFrom, dateTo)
 * @returns {Array} Factures filtrées
 */
export const filterInvoices = (invoices, filters) => {
  let filtered = invoices;

  // Filtrer par statut
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(inv => inv.status === filters.status);
  }

  // Filtrer par client
  if (filters.clientId && filters.clientId !== 'all') {
    filtered = filtered.filter(inv => inv.clientId === filters.clientId);
  }

  // Filtrer par date de création (à partir de)
  if (filters.dateFrom) {
    filtered = filtered.filter(inv => new Date(inv.createdAt) >= new Date(filters.dateFrom));
  }

  // Filtrer par date de création (jusqu'à)
  if (filters.dateTo) {
    filtered = filtered.filter(inv => new Date(inv.createdAt) <= new Date(filters.dateTo));
  }

  // Recherche textuelle
  if (filters.search) {
    filtered = searchItems(filtered, filters.search, ['number', 'notes']);
  }

  return filtered;
};

/**
 * Filtre les projets selon plusieurs critères
 * @param {Array} projects - Liste des projets
 * @param {Object} filters - Critères de filtrage (status, clientId, search)
 * @returns {Array} Projets filtrés
 */
export const filterProjects = (projects, filters) => {
  let filtered = projects;

  // Filtrer par statut
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(proj => proj.status === filters.status);
  }

  // Filtrer par client
  if (filters.clientId && filters.clientId !== 'all') {
    filtered = filtered.filter(proj => proj.clientId === filters.clientId);
  }

  // Recherche textuelle
  if (filters.search) {
    filtered = searchItems(filtered, filters.search, ['name', 'description']);
  }

  return filtered;
};

/**
 * Filtre les clients par recherche textuelle
 * @param {Array} clients - Liste des clients
 * @param {string} searchQuery - Terme de recherche
 * @returns {Array} Clients filtrés
 */
export const filterClients = (clients, searchQuery) => {
  return searchItems(clients, searchQuery, ['name', 'company', 'email', 'phone']);
};
