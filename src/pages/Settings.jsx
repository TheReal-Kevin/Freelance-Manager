import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { Save } from 'lucide-react';
import { validateRate, validateImageFile } from '../utils/validation';
import { fr } from '../locales/fr';

/**
 * Page Settings - Configuration de l'entreprise
 * 
 * Permet de configurer:
 * - Informations professionnelles (nom, email, téléphone, adresse)
 * - Devise et taux de TVA
 * - Note par défaut pour les factures
 * - Détails bancaires (affichés sur les PDFs)
 * - Logo de l'entreprise
 * 
 * Les modifications sont sauvegardées automatiquement en localStorage
 */
export default function Settings() {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Gère l'upload du logo avec validation
   * SÉCURITÉ: Valider la taille et le type du fichier
   */
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Valider le fichier image
    const fileValidation = validateImageFile(file);
    if (!fileValidation.valid) {
      showToast(fileValidation.error, 'error');
      return;
    }

    // Convertir en base64
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, logo: event.target?.result });
      showToast('Logo téléchargé avec succès', 'success');
    };
    reader.onerror = () => {
      showToast('Erreur lors du téléchargement du logo', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // SÉCURITÉ: Valider le taux de TVA
    const rateValidation = validateRate(formData.taxRate, 'Taux TVA');
    if (!rateValidation.valid) {
      showToast(rateValidation.error, 'error');
      return;
    }

    // Vérifier que le nom de l'entreprise est renseigné
    if (!formData.businessName || formData.businessName.trim() === '') {
      showToast('Veuillez renseigner le nom de l\'entreprise', 'error');
      return;
    }

    updateSettings(formData);
    showToast(fr.settings.saved, 'success');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{fr.settings.title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">{fr.settings.businessInfo}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {fr.settings.businessName}
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {fr.settings.businessEmail}
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {fr.settings.businessPhone}
                </label>
                <input
                  type="tel"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {fr.settings.businessAddress}
              </label>
              <textarea
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                className="input-field"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Paramètres de Facture</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {fr.settings.currency}
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CHF">CHF</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {fr.settings.taxRate}
                </label>
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {fr.settings.invoiceNote}
              </label>
              <textarea
                name="invoiceNote"
                value={formData.invoiceNote}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Par ex. 'Merci pour votre confiance!' ou conditions de paiement..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {fr.settings.bankDetails}
              </label>
              <textarea
                name="bankDetails"
                value={formData.bankDetails}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="IBAN, Code Swift, informations de compte..."
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Autres Paramètres</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fr.settings.uploadLogo}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleLogoUpload}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formats acceptés: JPEG, PNG, GIF, WebP (max 2 MB). Votre logo apparaîtra sur les factures
            </p>
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" /> {fr.common.save}
        </button>
      </form>
    </div>
  );
}
