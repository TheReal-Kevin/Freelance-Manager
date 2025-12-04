import React from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { fr } from '../locales/fr';

/**
 * Graphique de revenu par mois
 * Affiche en courbe le revenu total des factures payées pour chaque mois
 */
export const RevenueChart = ({ invoices, settings }) => {
  const monthlyData = {};
  
  invoices.forEach(invoice => {
    if (invoice.status === 'paid') {
      const date = new Date(invoice.createdAt);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (invoice.total || 0);
    }
  });

  const data = Object.entries(monthlyData).map(([month, revenue]) => ({
    month,
    revenue: parseFloat(revenue.toFixed(2)),
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">{fr.charts.revenueByMonth}</h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{fr.charts.noRevenueData}</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => `${value.toFixed(2)} ${settings.currency}`}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#4F46E5" 
              dot={{ fill: '#4F46E5' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

/**
 * Graphique de répartition des factures par statut
 * Affiche en camembert le nombre de factures pour chaque statut
 */
export const InvoiceStatusChart = ({ invoices }) => {
  const statusCounts = {
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
  };

  invoices.forEach(invoice => {
    statusCounts[invoice.status]++;
  });

  const data = [
    { name: fr.invoices.statusDraft, value: statusCounts.draft, color: '#D1D5DB' },
    { name: fr.invoices.statusSent, value: statusCounts.sent, color: '#60A5FA' },
    { name: fr.invoices.statusPaid, value: statusCounts.paid, color: '#34D399' },
    { name: fr.invoices.statusOverdue, value: statusCounts.overdue, color: '#F87171' },
  ].filter(item => item.value > 0);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">{fr.charts.invoiceStatus}</h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aucune facture pour le moment</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

/**
 * Graphique d'aperçu du statut des projets
 * Affiche en barres le nombre de projets pour chaque statut
 */
export const ProjectStatusChart = ({ projects }) => {
  const statusCounts = {
    prospect: 0,
    'in-progress': 0,
    completed: 0,
    'on-hold': 0,
  };

  projects.forEach(project => {
    statusCounts[project.status]++;
  });

  const data = [
    { name: fr.projects.statusProspect, value: statusCounts.prospect },
    { name: fr.projects.statusInProgress, value: statusCounts['in-progress'] },
    { name: fr.projects.statusCompleted, value: statusCounts.completed },
    { name: fr.projects.statusOnHold, value: statusCounts['on-hold'] },
  ].filter(item => item.value > 0);

  const colors = ['#D1D5DB', '#60A5FA', '#34D399', '#FBBF24'];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">{fr.charts.projectStatus}</h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{fr.charts.noProjectData}</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

/**
 * Graphique des meilleurs clients par revenu
 * Affiche en barres les clients générant le plus de revenu (factures payées)
 */
export const TopClientsChart = ({ invoices, clients, settings }) => {
  const clientRevenue = {};

  invoices.forEach(invoice => {
    if (invoice.status === 'paid') {
      clientRevenue[invoice.clientId] = (clientRevenue[invoice.clientId] || 0) + (invoice.total || 0);
    }
  });

  const data = Object.entries(clientRevenue)
    .map(([clientId, revenue]) => {
      const client = clients.find(c => c.id === clientId);
      return {
        name: client?.name || 'Inconnu',
        revenue: parseFloat(revenue.toFixed(2)),
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">{fr.charts.topClients}</h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{fr.charts.noClientsData}</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip 
              formatter={(value) => `${value.toFixed(2)} ${settings.currency}`}
            />
            <Bar dataKey="revenue" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
