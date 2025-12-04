/**
 * ProjectContext - Gestion de l'état global des projets
 * 
 * Ce contexte fournit:
 * - Gestion CRUD des projets
 * - Suivi du statut des projets (Prospect, En cours, Terminé, En attente)
 * - Agrégation du temps enregistré par projet
 * - Persistance des projets en localStorage
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import STORAGE_KEYS, { loadFromStorage, saveToStorage } from '../services/localStorage';

const ProjectContext = createContext();

/**
 * Hook personnalisé pour accéder au contexte ProjectContext
 * @returns {Object} Objet contenant les projets et les fonctions CRUD
 * @throws {Error} Si le hook n'est pas utilisé dans un ProjectProvider
 */
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
};

/**
 * Provider pour le contexte ProjectContext
 * Gère l'état des projets et leur persistance en localStorage
 */
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les projets depuis le localStorage au montage du composant
  useEffect(() => {
    const savedProjects = loadFromStorage(STORAGE_KEYS.PROJECTS) || [];
    setProjects(savedProjects);
    setLoading(false);
  }, []);

  // Sauvegarder les projets en localStorage chaque fois qu'ils changent
  useEffect(() => {
    if (!loading) {
      saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    }
  }, [projects, loading]);

  /**
   * Ajoute un nouveau projet avec le statut "Prospect" par défaut
   * @param {Object} projectData - Les données du projet (nom, client, budget, etc.)
   * @returns {Object} Le nouveau projet avec son ID généré
   */
  const addProject = (projectData) => {
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: new Date().toISOString(),
      status: 'prospect',
      timeLogged: 0,
    };
    setProjects([...projects, newProject]);
    return newProject;
  };

  /**
   * Met à jour les informations d'un projet existant
   * @param {string} id - L'ID du projet à modifier
   * @param {Object} projectData - Les nouvelles données du projet
   */
  const updateProject = (id, projectData) => {
    setProjects(projects.map(project =>
      project.id === id ? { ...project, ...projectData } : project
    ));
  };

  /**
   * Supprime un projet de la liste
   * @param {string} id - L'ID du projet à supprimer
   */
  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const getProjectById = (id) => {
    return projects.find(project => project.id === id);
  };

  const getProjectsByClientId = (clientId) => {
    return projects.filter(project => project.clientId === clientId);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      addProject,
      updateProject,
      deleteProject,
      getProjectById,
      getProjectsByClientId,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
