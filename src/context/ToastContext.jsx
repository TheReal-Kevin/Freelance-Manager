/**
 * ToastContext - Système de notifications
 * 
 * Fournit un système de notifications temporaires (toasts) qui s'auto-supprime
 * après un délai configurable. Utilisé pour les messages de succès, erreur, etc.
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

/**
 * Hook personnalisé pour afficher des notifications
 * @returns {Object} Objet avec les fonctions showToast et removeToast
 * @throws {Error} Si le hook n'est pas utilisé dans un ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

/**
 * Provider pour le contexte ToastContext
 * Gère l'affichage et la suppression automatique des notifications
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Affiche une notification temporaire
   * @param {string} message - Le texte de la notification
   * @param {string} type - Le type de notification: 'success', 'error', 'warning', 'info'
   * @param {number} duration - La durée en millisecondes (0 = ne pas auto-supprimer)
   * @returns {string} L'ID de la notification (peut être utilisé pour la supprimer manuellement)
   */
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    const toast = { id, message, type };

    setToasts(prev => [...prev, toast]);

    // Auto-supprimer le toast après le délai spécifié
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  /**
   * Supprime manuellement une notification par son ID
   * @param {string} id - L'ID de la notification à supprimer
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};
