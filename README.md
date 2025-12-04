# Mon Entreprise - Application de Gestion Freelance

Application web complète de gestion d'activité freelance, construite avec React et Vite. Entièrement localisée en français.

## 🚀 Fonctionnalités

- **Tableau de bord** - Vue d'ensemble avec métriques clés et graphiques analytiques
- **Gestion des clients** - Créer, modifier, supprimer et rechercher des clients
- **Gestion des projets** - Suivi des projets avec statuts et budgets
- **Gestion des factures** - Création de factures avec génération PDF automatique
- **Suivi du temps** - Enregistrement des heures par projet et type de tâche
- **Paramètres** - Configuration de l'entreprise, devise, TVA, et détails bancaires
- **Filtrage et recherche** - Multi-critères sur tous les écrans
- **Notifications** - Système de toast pour les confirmations et erreurs
- **Persistance** - Données sauvegardées en localStorage

## 📋 Prérequis

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 ou **yarn** >= 1.22.0

## 📦 Installation

### 1. Cloner le projet

```bash
git clone [URL_DU_REPO]
cd Projet
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Vérifier que tout est installé

```bash
npm list
```

Vous devriez voir les dépendances principales :

- react & react-dom (18.x)
- react-router-dom (6.x)
- recharts (graphiques)
- @react-pdf/renderer (génération PDF)
- lucide-react (icônes)
- tailwindcss (styling)

## 🎮 Commandes disponibles

### Développement

Démarrer le serveur de développement avec HMR (Hot Module Replacement) :

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

### Build pour production

Générer les fichiers optimisés pour la production :

```bash
npm run build
```

Les fichiers générés seront dans le dossier `dist/`

### Aperçu de la build

Visualiser la build production localement :

```bash
npm run preview
```

### Linting

Vérifier le code pour les erreurs de style :

```bash
npm run lint
```

## 📁 Structure du projet

```text
Projet/
├── src/
│   ├── components/          # Composants React réutilisables
│   │   ├── Charts.jsx       # Graphiques Recharts
│   │   ├── Layout.jsx       # Layout principal avec sidebar
│   │   └── ...
│   ├── context/             # Contextes React pour l'état global
│   │   ├── ClientContext.jsx
│   │   ├── ProjectContext.jsx
│   │   ├── InvoiceContext.jsx
│   │   ├── ToastContext.jsx
│   │   └── SettingsContext.jsx
│   ├── pages/               # Pages principales
│   │   ├── Dashboard.jsx
│   │   ├── Clients.jsx
│   │   ├── Projects.jsx
│   │   ├── Invoices.jsx
│   │   ├── TimeTracking.jsx
│   │   └── Settings.jsx
│   ├── services/            # Services et utilitaires
│   │   ├── invoicePDF.jsx   # Génération PDF
│   │   └── storage.js       # Gestion localStorage
│   ├── locales/             # Traductions
│   │   └── fr.js            # Traductions françaises
│   ├── utils/               # Fonctions utilitaires
│   │   └── filters.js       # Logique de filtrage
│   ├── hooks/               # Hooks personnalisés
│   │   └── usePdfDownload.js
│   ├── App.jsx              # Composant racine
│   ├── index.css            # Styles globaux
│   └── main.jsx             # Point d'entrée
├── public/                  # Fichiers statiques
├── package.json             # Dépendances et scripts
├── vite.config.js           # Configuration Vite
├── tailwind.config.js       # Configuration Tailwind
└── README.md                # Documentation
```

## 🔧 Configuration

### Tailwind CSS

Le projet utilise Tailwind CSS pour le styling. La configuration se trouve dans `tailwind.config.js`.

### Vite

Configuration dans `vite.config.js` avec support React et hot module replacement.

## 📚 Dépendances principales

| Dépendance | Version | Usage |
|-----------|---------|-------|
| React | 18.x | Framework UI |
| React Router | 6.x | Navigation et routage |
| Recharts | 2.x | Graphiques interactifs |
| @react-pdf/renderer | 3.x | Génération PDF des factures |
| Tailwind CSS | 3.x | Framework CSS |
| Lucide React | Latest | Bibliothèque d'icônes |

## 🌍 Localisation

L'application est entièrement localisée en français. Les traductions se trouvent dans `src/locales/fr.js`.

### Ajouter une nouvelle traduction

1. Ouvrir `src/locales/fr.js`
2. Ajouter la nouvelle clé dans la section appropriée
3. Importer `fr` depuis le fichier et utiliser comme `fr.section.key`

Exemple :

```javascript
// Dans fr.js
dashboard: {
  title: 'Tableau de bord',
  // ...
}

// Dans un composant
import { fr } from '../locales/fr';
<h1>{fr.dashboard.title}</h1>
```

## 💾 Stockage des données

Les données sont stockées en localStorage avec les clés suivantes :

- `freelance_clients` - Liste des clients
- `freelance_projects` - Liste des projets
- `freelance_invoices` - Liste des factures
- `freelance_timeLogs` - Enregistrements de temps
- `freelance_settings` - Paramètres de l'entreprise
- `freelance_nextInvoiceNumber` - Prochain numéro de facture

**Note** : Les données sont perdues si le cache du navigateur est vidé.

## 📝 Utilisation principale

### Créer une facture

1. Aller sur **Factures**
2. Cliquer sur **Créer une Facture**
3. Sélectionner un client
4. Ajouter des articles avec description, quantité et prix
5. Sauvegarder
6. Télécharger le PDF ou marquer comme payée

### Enregistrer du temps

1. Aller sur **Suivi du Temps**
2. Cliquer sur **Ajouter du Temps**
3. Sélectionner un projet et type de tâche
4. Entrer le nombre d'heures
5. Sauvegarder

### Configurer l'entreprise

1. Aller sur **Paramètres**
2. Remplir les informations professionnelles
3. Configurer la devise et le taux de TVA
4. Ajouter les détails bancaires (affichés sur les PDFs)
5. Sauvegarder

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Nettoyer node_modules et réinstaller
rm -rf node_modules
npm install
npm run dev
```

### Erreurs de build

```bash
# Vérifier le linting
npm run lint

# Nettoyer le cache Vite
rm -rf .vite
npm run build
```

### Données perdues

Les données sont stockées en localStorage. Si elles disparaissent :

- Vérifier que le localStorage n'a pas été vidé
- Vérifier la console du navigateur pour les erreurs
- Réinitialiser l'application (les données par défaut seront créées)

## 📱 Compatibilité navigateur

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📄 Licence

Projet personnel

## 📞 Support

Pour tout problème ou question sur l'application, consulter les fichiers source dans les dossiers correspondants.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2025  
**Localisation** : Français
