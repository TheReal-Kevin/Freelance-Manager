import React, { createContext, useContext, useState, useEffect } from 'react';
import STORAGE_KEYS, { loadFromStorage, saveToStorage } from '../services/localStorage';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

const DEFAULT_SETTINGS = {
  businessName: 'Mon Entreprise',
  businessEmail: '',
  businessPhone: '',
  businessAddress: '',
  currency: 'EUR',
  taxRate: 20,
  invoiceNote: 'Merci pour votre confiance!',
  bankDetails: '',
  logo: null,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSettings = loadFromStorage(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveToStorage(STORAGE_KEYS.SETTINGS, settings);
    }
  }, [settings, loading]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      updateSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
