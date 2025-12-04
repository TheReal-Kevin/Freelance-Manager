import React, { createContext, useContext, useState, useEffect } from 'react';
import STORAGE_KEYS, { loadFromStorage, saveToStorage } from '../services/localStorage';

const TimeLogContext = createContext();

export const useTimeLogs = () => {
  const context = useContext(TimeLogContext);
  if (!context) {
    throw new Error('useTimeLogs must be used within TimeLogProvider');
  }
  return context;
};

export const TimeLogProvider = ({ children }) => {
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTimeLogs = loadFromStorage('freelance_time_logs') || [];
    setTimeLogs(savedTimeLogs);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveToStorage('freelance_time_logs', timeLogs);
    }
  }, [timeLogs, loading]);

  const addTimeLog = (logData) => {
    const newLog = {
      id: Date.now().toString(),
      ...logData,
      createdAt: new Date().toISOString(),
    };
    setTimeLogs([...timeLogs, newLog]);
    return newLog;
  };

  const updateTimeLog = (id, logData) => {
    setTimeLogs(timeLogs.map(log =>
      log.id === id ? { ...log, ...logData } : log
    ));
  };

  const deleteTimeLog = (id) => {
    setTimeLogs(timeLogs.filter(log => log.id !== id));
  };

  const getTimeLogsByProjectId = (projectId) => {
    return timeLogs.filter(log => log.projectId === projectId);
  };

  const getTotalHoursByProjectId = (projectId) => {
    return getTimeLogsByProjectId(projectId).reduce((sum, log) => sum + (log.hours || 0), 0);
  };

  const getTotalHours = () => {
    return timeLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
  };

  return (
    <TimeLogContext.Provider value={{
      timeLogs,
      loading,
      addTimeLog,
      updateTimeLog,
      deleteTimeLog,
      getTimeLogsByProjectId,
      getTotalHoursByProjectId,
      getTotalHours,
    }}>
      {children}
    </TimeLogContext.Provider>
  );
};
