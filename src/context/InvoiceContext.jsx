/**
 * InvoiceContext - Gestion de l'état global des factures
 * 
 * Ce contexte fournit:
 * - Génération automatique des numéros de facture (INV-001, INV-002, etc.)
 * - Opérations CRUD pour les factures
 * - Filtrage des factures par client
 * - Persistance des factures en localStorage
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import STORAGE_KEYS, { loadFromStorage, saveToStorage } from '../services/localStorage';

const InvoiceContext = createContext();

/**
 * Hook personnalisé pour accéder au contexte InvoiceContext
 * @returns {Object} Objet contenant les factures et les fonctions CRUD
 * @throws {Error} Si le hook n'est pas utilisé dans un InvoiceProvider
 */
export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within InvoiceProvider');
  }
  return context;
};

/**
 * Provider pour le contexte InvoiceContext
 * Gère l'état des factures et leur persistance en localStorage
 */
export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les factures depuis le localStorage au montage du composant
  useEffect(() => {
    const savedInvoices = loadFromStorage(STORAGE_KEYS.INVOICES) || [];
    setInvoices(savedInvoices);
    setLoading(false);
  }, []);

  // Sauvegarder les factures en localStorage chaque fois qu'elles changent
  useEffect(() => {
    if (!loading) {
      saveToStorage(STORAGE_KEYS.INVOICES, invoices);
    }
  }, [invoices, loading]);

  /**
   * Génère le prochain numéro de facture de manière séquentielle
   * Format: INV-001, INV-002, etc.
   * @returns {string} Le numéro de facture suivant
   */
  const getNextInvoiceNumber = () => {
    if (invoices.length === 0) return 'INV-001';
    // Extraire le numéro séquentiel de la dernière facture
    const lastNumber = parseInt(invoices[invoices.length - 1].number.split('-')[1]) || 0;
    return `INV-${String(lastNumber + 1).padStart(3, '0')}`;
  };

  /**
   * Ajoute une nouvelle facture avec un numéro auto-généré
   * @param {Object} invoiceData - Les données de la facture (articles, client, etc.)
   * @returns {Object} La nouvelle facture avec son ID et son numéro
   */
  const addInvoice = (invoiceData) => {
    const newInvoice = {
      id: Date.now().toString(),
      number: getNextInvoiceNumber(),
      ...invoiceData,
      createdAt: new Date().toISOString(),
      status: 'draft',
    };
    setInvoices([...invoices, newInvoice]);
    return newInvoice;
  };

  /**
   * Met à jour une facture existante
   * @param {string} id - L'ID de la facture à modifier
   * @param {Object} invoiceData - Les nouvelles données de la facture
   */
  const updateInvoice = (id, invoiceData) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === id ? { ...invoice, ...invoiceData } : invoice
    ));
  };

  /**
   * Supprime une facture de la liste
   * @param {string} id - L'ID de la facture à supprimer
   */
  const deleteInvoice = (id) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
  };

  /**
   * Récupère une facture par son ID
   * @param {string} id - L'ID de la facture à chercher
   * @returns {Object|undefined} La facture trouvée ou undefined
   */
  const getInvoiceById = (id) => {
    return invoices.find(invoice => invoice.id === id);
  };

  /**
   * Récupère toutes les factures d'un client
   * @param {string} clientId - L'ID du client
   * @returns {Array} Les factures du client
   */
  const getInvoicesByClientId = (clientId) => {
    return invoices.filter(invoice => invoice.clientId === clientId);
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      loading,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      getInvoiceById,
      getInvoicesByClientId,
      getNextInvoiceNumber,
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};
