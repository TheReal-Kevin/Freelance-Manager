import React, { useState, useMemo } from 'react';
import { useClients } from '../context/ClientContext';
import { useProjects } from '../context/ProjectContext';
import { useInvoices } from '../context/InvoiceContext';
import { Plus, Edit2, Trash2, Mail, Phone, X } from 'lucide-react';
import { filterClients } from '../utils/filters';
import { fr } from '../locales/fr';

/**
 * Page Clients - Gestion des clients
 * 
 * Fonctionnalités:
 * - Créer, modifier et supprimer des clients
 * - Rechercher par nom, entreprise ou email
 * - Afficher le nombre de projets et factures par client
 * - Afficher la valeur totale des factures par client
 * - Afficher les coordonnées de contact
 */
export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const { projects } = useProjects();
  const { invoices } = useInvoices();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
  });

  const filteredClients = useMemo(() => filterClients(clients, searchQuery), [clients, searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateClient(editingId, formData);
      setEditingId(null);
    } else {
      addClient(formData);
    }
    setFormData({ name: '', email: '', phone: '', company: '', address: '', notes: '' });
    setShowForm(false);
  };

  const handleEdit = (client) => {
    setFormData(client);
    setEditingId(client.id);
    setShowForm(true);
  };

  const getClientStats = (clientId) => {
    const clientProjects = projects.filter(p => p.clientId === clientId);
    const clientInvoices = invoices.filter(i => i.clientId === clientId);
    return {
      projects: clientProjects.length,
      invoices: clientInvoices.length,
      totalValue: clientInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{fr.clients.title}</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', email: '', phone: '', company: '', address: '', notes: '' });
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {fr.clients.addClient}
        </button>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={fr.clients.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field flex-1"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <X className="w-4 h-4" /> {fr.common.clear}
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={fr.clients.name}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="email"
                placeholder={fr.clients.email}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
              <input
                type="tel"
                placeholder={fr.clients.phone}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder={fr.clients.company}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="input-field"
              />
            </div>
            <input
              type="text"
              placeholder={fr.clients.address}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field"
            />
            <textarea
              placeholder={fr.clients.notes}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
            />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? fr.clients.editClient : fr.clients.addClient}
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
        {filteredClients.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-gray-500">
              {clients.length === 0 ? fr.clients.noClients : 'Aucun client ne correspond à votre recherche.'}
            </p>
          </div>
        ) : (
          filteredClients.map(client => {
            const stats = getClientStats(client.id);
            return (
              <div key={client.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                    {client.company && <p className="text-gray-600">{client.company}</p>}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      {client.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {client.email}
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {client.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">{fr.clients.projects}</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.projects}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{fr.clients.invoices}</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.invoices}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{fr.clients.totalValue}</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
