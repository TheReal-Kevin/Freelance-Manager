import React, { useState, useMemo } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { useClients } from '../context/ClientContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, Download, FileText, X, Check } from 'lucide-react';
import { usePdfDownload } from '../hooks/usePdfDownload';
import { InvoicePDF } from '../services/invoicePDF';
import { filterInvoices } from '../utils/filters';
import { validateInvoiceItems, calculateInvoiceTotal } from '../utils/validation';
import { fr } from '../locales/fr';

/**
 * Page Invoices - Gestion complète des factures
 * 
 * Fonctionnalités:
 * - Créer des factures avec génération automatique du numéro
 * - Ajouter/modifier articles avec quantité et prix unitaire
 * - Filtrer par statut, client, et plage de dates
 * - Calculer automatiquement sous-total, TVA et total
 * - Télécharger les factures en PDF
 * - Marquer les factures comme payées
 * - Supprimer les factures
 */
export default function Invoices() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, getNextInvoiceNumber } = useInvoices();
  const { clients } = useClients();
  const { settings } = useSettings();
  const { downloadPdf } = usePdfDownload();
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    clientId: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
  });
  const [formData, setFormData] = useState({
    clientId: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    status: 'draft',
    dueDate: '',
    notes: '',
  });

  const filteredInvoices = useMemo(() => filterInvoices(invoices, filters), [invoices, filters]);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // SÉCURITÉ: Valider les articles et les montants avant de soumettre
    const itemsValidation = validateInvoiceItems(formData.items);
    if (!itemsValidation.valid) {
      showToast(itemsValidation.error, 'error');
      return;
    }

    // Calculer les totaux avec validations
    const totals = calculateInvoiceTotal(formData.items, settings.taxRate);
    if (totals.error) {
      showToast(totals.error, 'error');
      return;
    }

    // Vérifier qu'un client a été sélectionné
    if (!formData.clientId) {
      showToast('Veuillez sélectionner un client', 'error');
      return;
    }
    
    if (editingId) {
      updateInvoice(editingId, {
        ...formData,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
      });
      setEditingId(null);
      showToast(fr.invoices.updatedSuccessfully, 'success');
    } else {
      const newInvoice = addInvoice({
        ...formData,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
      });
      showToast(fr.invoices.createdSuccessfully.replace('{number}', newInvoice.number), 'success');
    }
    
    setFormData({
      clientId: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      status: 'draft',
      dueDate: '',
      notes: '',
    });
    setShowForm(false);
  };

  const handleEdit = (invoice) => {
    setFormData({
      clientId: invoice.clientId,
      items: invoice.items || [],
      status: invoice.status,
      dueDate: invoice.dueDate,
      notes: invoice.notes,
    });
    setEditingId(invoice.id);
    setShowForm(true);
  };

  const handleDownloadPdf = async (invoice) => {
    try {
      const client = clients.find(c => c.id === invoice.clientId);
      const document = <InvoicePDF invoice={invoice} client={client} settings={settings} />;
      await downloadPdf(document, `${invoice.number}.pdf`);
      showToast(fr.invoices.downloadSuccess, 'success');
    } catch (error) {
      showToast(fr.invoices.downloadError, 'error');
    }
  };

  const handleMarkAsPaid = (invoice) => {
    updateInvoice(invoice.id, { status: 'paid' });
    showToast(fr.invoices.markedAsPaid, 'success');
  };

  const statusColors = {
    draft: 'bg-gray-200 text-gray-800',
    sent: 'bg-blue-200 text-blue-800',
    paid: 'bg-green-200 text-green-800',
    overdue: 'bg-red-200 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{fr.invoices.title}</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              clientId: '',
              items: [{ description: '', quantity: 1, unitPrice: 0 }],
              status: 'draft',
              dueDate: '',
              notes: '',
            });
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> {fr.invoices.addInvoice}
        </button>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-900">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Rechercher par N° facture..."
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
            <option value="draft">{fr.invoices.statusDraft}</option>
            <option value="sent">{fr.invoices.statusSent}</option>
            <option value="paid">{fr.invoices.statusPaid}</option>
            <option value="overdue">{fr.invoices.statusOverdue}</option>
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
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="input-field"
            title={fr.invoices.from}
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="input-field"
            title={fr.invoices.to}
          />
        </div>
        {(filters.search || filters.status !== 'all' || filters.clientId !== 'all' || filters.dateFrom || filters.dateTo) && (
          <button
            onClick={() => setFilters({ status: 'all', clientId: 'all', search: '', dateFrom: '', dateTo: '' })}
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
                <option value="draft">{fr.invoices.statusDraft}</option>
                <option value="sent">{fr.invoices.statusSent}</option>
                <option value="paid">{fr.invoices.statusPaid}</option>
                <option value="overdue">{fr.invoices.statusOverdue}</option>
              </select>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input-field"
                title={fr.invoices.dueDate}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Articles de Facture</h3>
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                  <input
                    type="text"
                    placeholder={fr.invoices.description}
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="input-field md:col-span-6"
                  />
                  <input
                    type="number"
                    placeholder={fr.invoices.quantity}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="input-field md:col-span-3"
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder={fr.invoices.unitPrice}
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    className="input-field md:col-span-3"
                    step="0.01"
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="btn-danger md:col-span-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="btn-secondary"
              >
                + {fr.invoices.addItem}
              </button>
            </div>

            <textarea
              placeholder={fr.invoices.notes}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
            />

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? fr.invoices.editInvoice : fr.invoices.addInvoice}
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
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-gray-500">
              {invoices.length === 0 ? fr.invoices.noInvoices : 'Aucune facture ne correspond à vos filtres.'}
            </p>
          </div>
        ) : (
          filteredInvoices.map(invoice => {
            const client = clients.find(c => c.id === invoice.clientId);
            const statusLabels = {
              draft: fr.invoices.statusDraft,
              sent: fr.invoices.statusSent,
              paid: fr.invoices.statusPaid,
              overdue: fr.invoices.statusOverdue,
            };
            return (
              <div key={invoice.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900">{invoice.number}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[invoice.status]}`}>
                        {statusLabels[invoice.status] || invoice.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{client?.name || 'Client Inconnu'}</p>
                    {invoice.dueDate && (
                      <p className="text-gray-600 text-sm mt-1">
                        {fr.invoices.dueDate}: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-2xl font-bold text-gray-900">
                      {invoice.total?.toFixed(2) || '0.00'} {settings.currency}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {invoice.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkAsPaid(invoice)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium"
                          title={fr.invoices.markAsPaid}
                        >
                          <Check className="w-4 h-4" /> {fr.invoices.markAsPaid}
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(invoice)}
                        className="p-2 text-gray-600 hover:text-blue-600"
                        title={fr.common.edit}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteInvoice(invoice.id);
                          showToast(`Facture ${invoice.number} supprimée`, 'success');
                        }}
                        className="p-2 text-gray-600 hover:text-red-600"
                        title={fr.common.delete}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(invoice)}
                        className="p-2 text-gray-600 hover:text-green-600"
                        title={fr.invoices.download}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
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
