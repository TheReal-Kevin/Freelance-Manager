/**
 * ClientContext - Gestion de l'état global des clients
 * 
 * Ce contexte fournit les fonctionnalités CRUD pour les clients:
 * - Création de nouveaux clients
 * - Modification des informations client
 * - Suppression de clients
 * - Recherche et récupération de clients
 * 
 * Les données sont persistées automatiquement en localStorage
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import STORAGE_KEYS, { loadFromStorage, saveToStorage } from '../services/localStorage';

const ClientContext = createContext();

/**
 * Hook personnalisé pour accéder au contexte ClientContext
 * @returns {Object} Objet contenant les clients et les fonctions CRUD
 * @throws {Error} Si le hook n'est pas utilisé dans un ClientProvider
 */
export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within ClientProvider');
  }
  return context;
};

/**
 * Provider pour le contexte ClientContext
 * Gère l'état des clients et leur persistance en localStorage
 */
export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les clients depuis le localStorage au montage du composant
  useEffect(() => {
    const savedClients = loadFromStorage(STORAGE_KEYS.CLIENTS) || [];
    setClients(savedClients);
    setLoading(false);
  }, []);

  // Sauvegarder les clients en localStorage chaque fois qu'ils changent
  useEffect(() => {
    if (!loading) {
      saveToStorage(STORAGE_KEYS.CLIENTS, clients);
    }
  }, [clients, loading]);

  /**
   * Ajoute un nouveau client
   * @param {Object} clientData - Les données du client (nom, email, téléphone, etc.)
   * @returns {Object} Le nouveau client avec son ID généré
   */
  const addClient = (clientData) => {
    const newClient = {
      id: Date.now().toString(),
      ...clientData,
      createdAt: new Date().toISOString(),
    };
    setClients([...clients, newClient]);
    return newClient;
  };

  /**
   * Met à jour les informations d'un client existant
   * @param {string} id - L'ID du client à modifier
   * @param {Object} clientData - Les nouvelles données du client
   */
  const updateClient = (id, clientData) => {
    setClients(clients.map(client =>
      client.id === id ? { ...client, ...clientData } : client
    ));
  };

  /**
   * Supprime un client de la liste
   * @param {string} id - L'ID du client à supprimer
   */
  const deleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  /**
   * Récupère un client par son ID
   * @param {string} id - L'ID du client à chercher
   * @returns {Object|undefined} Le client trouvé ou undefined
   */
  const getClientById = (id) => {
    return clients.find(client => client.id === id);
  };

  return (
    <ClientContext.Provider value={{
      clients,
      loading,
      addClient,
      updateClient,
      deleteClient,
      getClientById,
    }}>
      {children}
    </ClientContext.Provider>
  );
};
