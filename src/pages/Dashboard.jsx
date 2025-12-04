import React from 'react';
import { useClients } from '../context/ClientContext';
import { useProjects } from '../context/ProjectContext';
import { useInvoices } from '../context/InvoiceContext';
import { useSettings } from '../context/SettingsContext';
import { TrendingUp, Users, FileText, AlertCircle } from 'lucide-react';
import { RevenueChart, InvoiceStatusChart, ProjectStatusChart, TopClientsChart } from '../components/Charts';
import { fr } from '../locales/fr';

/**
 * Page Dashboard - Vue d'ensemble de l'activité
 * 
 * Affiche les métriques clés:
 * - Revenu total (factures payées)
 * - Montant en attente de paiement
 * - Nombre de clients actifs
 * - Factures en retard
 * 
 * Inclut également 4 graphiques analytiques et listes de projets/factures récents
 */
export default function Dashboard() {
  const { clients } = useClients();
  const { projects } = useProjects();
  const { invoices } = useInvoices();
  const { settings } = useSettings();

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === 'sent' || inv.status === 'draft')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{fr.dashboard.title}</h1>
        <p className="text-gray-600 mt-2">{fr.dashboard.welcome.replace('{businessName}', settings.businessName)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{fr.dashboard.totalRevenue}</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRevenue.toFixed(2)} {settings.currency}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{fr.dashboard.pending}</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingAmount.toFixed(2)} {settings.currency}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{fr.dashboard.activeClients}</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{fr.dashboard.overdue}</p>
              <p className="text-2xl font-bold text-red-600">{overdueInvoices}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart invoices={invoices} settings={settings} />
        <InvoiceStatusChart invoices={invoices} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ProjectStatusChart projects={projects} />
        <TopClientsChart invoices={invoices} clients={clients} settings={settings} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">{fr.dashboard.recentProjects}</h2>
          <div className="space-y-3">
            {projects.slice(-5).reverse().map(project => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{project.name}</p>
                  <p className="text-sm text-gray-600">{project.status}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {project.budget} {settings.currency}
                </span>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-gray-500 text-center py-4">{fr.dashboard.noProjects}</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">{fr.dashboard.recentInvoices}</h2>
          <div className="space-y-3">
            {invoices.slice(-5).reverse().map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{invoice.number}</p>
                  <p className="text-sm text-gray-600">{invoice.status}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {invoice.total} {settings.currency}
                </span>
              </div>
            ))}
            {invoices.length === 0 && (
              <p className="text-gray-500 text-center py-4">{fr.dashboard.noInvoices}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
