import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, FileText, Clock, Settings } from 'lucide-react';
import { fr } from '../locales/fr';

/**
 * Composant Layout - Mise en page principale
 * 
 * Structure:
 * - Sidebar gauche avec navigation et branding
 * - Zone principale pour le contenu des pages
 * 
 * Affiche les 6 sections principales de l'application
 */
export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: fr.layout.dashboard, icon: LayoutDashboard },
    { path: '/clients', label: fr.layout.clients, icon: Users },
    { path: '/projects', label: fr.layout.projects, icon: Briefcase },
    { path: '/invoices', label: fr.layout.invoices, icon: FileText },
    { path: '/time-tracking', label: fr.layout.timeTracking, icon: Clock },
    { path: '/settings', label: fr.layout.settings, icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-indigo-600 text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Mon Entreprise</h1>
          <p className="text-indigo-200 text-sm mt-1">Gestion d'activité</p>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-100 hover:bg-indigo-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
