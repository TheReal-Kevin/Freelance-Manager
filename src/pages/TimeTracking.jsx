import React, { useState } from 'react';
import { useTimeLogs } from '../context/TimeLogContext';
import { useProjects } from '../context/ProjectContext';
import { useClients } from '../context/ClientContext';
import { useSettings } from '../context/SettingsContext';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { validateHours } from '../utils/validation';
import { fr } from '../locales/fr';

/**
 * Page TimeTracking - Suivi du temps de travail
 * 
 * Fonctionnalités:
 * - Enregistrer le temps travaillé par projet
 * - Catégoriser par type de tâche (Développement, Design, Réunions, Support, Documentation, Autre)
 * - Afficher la date et le nombre d'heures
 * - Ajouter des descriptions
 * - Modifier et supprimer les enregistrements
 * - Afficher les heures totales par projet
 */
export default function TimeTracking() {
  const { timeLogs, addTimeLog, updateTimeLog, deleteTimeLog, getTotalHoursByProjectId } = useTimeLogs();
  const { projects } = useProjects();
  const { clients } = useClients();
  const { settings } = useSettings();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    projectId: '',
    description: '',
    hours: '',
    date: new Date().toISOString().split('T')[0],
    taskType: 'development',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // SÉCURITÉ: Valider le nombre d'heures
    const hoursValidation = validateHours(formData.hours, 'Heures');
    if (!hoursValidation.valid) {
      alert(hoursValidation.error);
      return;
    }

    // Vérifier qu'un projet a été sélectionné
    if (!formData.projectId) {
      alert('Veuillez sélectionner un projet');
      return;
    }

    // Vérifier qu'une date a été saisie
    if (!formData.date) {
      alert('Veuillez saisir une date');
      return;
    }
    
    if (editingId) {
      updateTimeLog(editingId, {
        ...formData,
        hours: parseFloat(formData.hours),
      });
      setEditingId(null);
    } else {
      addTimeLog({
        ...formData,
        hours: parseFloat(formData.hours),
      });
    }
    
    setFormData({
      projectId: '',
      description: '',
      hours: '',
      date: new Date().toISOString().split('T')[0],
      taskType: 'development',
    });
    setShowForm(false);
  };

  const handleEdit = (log) => {
    setFormData(log);
    setEditingId(log.id);
    setShowForm(true);
  };

  const taskTypes = [
    { value: 'development', label: fr.timeTracking.taskTypeDevelopment },
    { value: 'design', label: fr.timeTracking.taskTypeDesign },
    { value: 'meetings', label: fr.timeTracking.taskTypeMeetings },
    { value: 'support', label: fr.timeTracking.taskTypeSupport },
    { value: 'documentation', label: fr.timeTracking.taskTypeDocumentation },
    { value: 'other', label: fr.timeTracking.taskTypeOther },
  ];

  const getLogsGroupedByProject = () => {
    const grouped = {};
    timeLogs.forEach(log => {
      if (!grouped[log.projectId]) {
        grouped[log.projectId] = [];
      }
      grouped[log.projectId].push(log);
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{fr.timeTracking.title}</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              projectId: '',
              description: '',
              hours: '',
              date: new Date().toISOString().split('T')[0],
              taskType: 'development',
            });
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {fr.timeTracking.addTimeLog}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Sélectionner un Projet</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <select
                value={formData.taskType}
                onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                className="input-field"
              >
                {taskTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field"
                required
                title={fr.timeTracking.date}
              />
              <input
                type="number"
                placeholder={fr.timeTracking.hours}
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="input-field"
                step="0.5"
                min="0"
                required
              />
            </div>
            <textarea
              placeholder={fr.timeTracking.description}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="3"
            />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? fr.timeTracking.editTimeLog : fr.timeTracking.addTimeLog}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                {fr.common.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {Object.keys(getLogsGroupedByProject()).length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-gray-500">{fr.timeTracking.noTimeLogs}</p>
        </div>
      ) : (
        Object.entries(getLogsGroupedByProject()).map(([projectId, logs]) => {
          const project = projects.find(p => p.id === projectId);
          const client = project ? clients.find(c => c.id === project.clientId) : null;
          const totalHours = logs.reduce((sum, log) => sum + parseFloat(log.hours), 0);

          return (
            <div key={projectId} className="card">
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project?.name || 'Projet Inconnu'}
                  </h3>
                  {client && <p className="text-gray-600 text-sm">{client.name}</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {totalHours.toFixed(1)}h
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{log.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
                          {taskTypes.find(t => t.value === log.taskType)?.label || log.taskType}
                        </span>
                        <span>{new Date(log.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-semibold text-gray-900">{log.hours}h</p>
                      <button
                        onClick={() => handleEdit(log)}
                        className="p-2 text-gray-600 hover:text-blue-600"
                        title={fr.common.edit}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteTimeLog(log.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                        title={fr.common.delete}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
