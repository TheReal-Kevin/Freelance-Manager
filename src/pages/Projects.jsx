import React, { useState, useMemo } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useClients } from '../context/ClientContext';
import { useSettings } from '../context/SettingsContext';
import { useTimeLogs } from '../context/TimeLogContext';
import { Plus, Edit2, Trash2, Calendar, Clock, X } from 'lucide-react';
import { filterProjects } from '../utils/filters';
import { fr } from '../locales/fr';

/**
 * Page Projects - Gestion des projets
 * 
 * Fonctionnalités:
 * - Créer, modifier et supprimer des projets
 * - Assigner des projets à des clients
 * - Définir le statut (Prospect, En cours, Terminé, En attente)
 * - Définir le budget et les dates de début/fin
 * - Afficher les heures enregistrées par projet
 * - Filtrer par statut, client et recherche texte
 */
export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { clients } = useClients();
  const { settings } = useSettings();
  const { getTotalHoursByProjectId } = useTimeLogs();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    clientId: 'all',
    search: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    status: 'prospect',
    budget: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const filteredProjects = useMemo(() => filterProjects(projects, filters), [projects, filters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateProject(editingId, formData);
      setEditingId(null);
    } else {
      addProject(formData);
    }
    setFormData({
      name: '',
      clientId: '',
      status: 'prospect',
      budget: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setShowForm(false);
  };

  const handleEdit = (project) => {
    setFormData(project);
    setEditingId(project.id);
    setShowForm(true);
  };

  const statusColors = {
    prospect: 'bg-gray-200 text-gray-800',
    'in-progress': 'bg-blue-200 text-blue-800',
    completed: 'bg-green-200 text-green-800',
    'on-hold': 'bg-yellow-200 text-yellow-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{fr.projects.title}</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              name: '',
              clientId: '',
              status: 'prospect',
              budget: '',
              startDate: '',
              endDate: '',
              description: '',
            });
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {fr.projects.addProject}
        </button>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-900">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Rechercher par nom de projet..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="input-field"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field"
          >
            <option value="all">Tous les Statuts</option>
            <option value="prospect">{fr.projects.statusProspect}</option>
            <option value="in-progress">{fr.projects.statusInProgress}</option>
            <option value="completed">{fr.projects.statusCompleted}</option>
            <option value="on-hold">{fr.projects.statusOnHold}</option>
          </select>
          <select
            value={filters.clientId}
            onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}
            className="input-field"
          >
            <option value="all">Tous les Clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        {(filters.search || filters.status !== 'all' || filters.clientId !== 'all') && (
          <button
            onClick={() => setFilters({ status: 'all', clientId: 'all', search: '' })}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <X className="w-4 h-4" /> Effacer les filtres
          </button>
        )}
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={fr.projects.name}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Sélectionner un Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
              >
                <option value="prospect">{fr.projects.statusProspect}</option>
                <option value="in-progress">{fr.projects.statusInProgress}</option>
                <option value="completed">{fr.projects.statusCompleted}</option>
                <option value="on-hold">{fr.projects.statusOnHold}</option>
              </select>
              <input
                type="number"
                placeholder={fr.projects.budget}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="input-field"
              />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
                title={fr.projects.startDate}
              />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
                title={fr.projects.endDate}
              />
            </div>
            <textarea
              placeholder={fr.projects.description}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="3"
            />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? fr.projects.editProject : fr.projects.addProject}
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

      <div className="grid gap-4">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-gray-500">
              {projects.length === 0 ? fr.projects.noProjects : 'Aucun projet ne correspond à vos filtres.'}
            </p>
          </div>
        ) : (
          filteredProjects.map(project => {
            const client = clients.find(c => c.id === project.clientId);
            return (
              <div key={project.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[project.status]}`}>
                        {project.status === 'prospect' ? fr.projects.statusProspect : project.status === 'in-progress' ? fr.projects.statusInProgress : project.status === 'completed' ? fr.projects.statusCompleted : fr.projects.statusOnHold}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{client?.name || 'Client Inconnu'}</p>
                    {project.description && <p className="text-gray-600 mt-2">{project.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">{fr.projects.budget}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {project.budget} {settings.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {fr.projects.hoursLogged}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {getTotalHoursByProjectId(project.id).toFixed(1)}h
                    </p>
                  </div>
                  {project.startDate && (
                    <div>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Début
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(project.startDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                  {project.endDate && (
                    <div>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Fin
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(project.endDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
