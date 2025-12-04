/**
 * Utilitaires de validation - Sécurité des données
 * 
 * Fournit des validations pour:
 * - Montants (factures, budget)
 * - Quantités
 * - Taux (TVA, pourcentages)
 * - Fichiers (logo, uploads)
 * 
 * SÉCURITÉ: Toutes les validations sont côté client
 * Ces validations améliorent l'UX mais ne remplacent pas une validation serveur
 */

// Limites de validation
const VALIDATION_LIMITS = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999.99,
  MIN_QUANTITY: 0.01,
  MAX_QUANTITY: 99999,
  MIN_RATE: 0,
  MAX_RATE: 100,
  MIN_HOURS: 0.25,
  MAX_HOURS: 24,
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2 MB en bytes
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

/**
 * Valide un montant monétaire
 * @param {number|string} amount - Le montant à valider
 * @param {string} fieldName - Nom du champ pour le message d'erreur
 * @returns {Object} { valid: boolean, error: string|null }
 */
export const validateAmount = (amount, fieldName = 'Montant') => {
  const parsed = parseFloat(amount);

  // Vérifier que c'est un nombre
  if (isNaN(parsed)) {
    return { valid: false, error: `${fieldName} doit être un nombre` };
  }

  // Vérifier la limite minimale
  if (parsed < VALIDATION_LIMITS.MIN_AMOUNT) {
    return { valid: false, error: `${fieldName} doit être supérieur à ${VALIDATION_LIMITS.MIN_AMOUNT}` };
  }

  // Vérifier la limite maximale
  if (parsed > VALIDATION_LIMITS.MAX_AMOUNT) {
    return { valid: false, error: `${fieldName} dépasse la limite maximale (${VALIDATION_LIMITS.MAX_AMOUNT})` };
  }

  return { valid: true, error: null };
};

/**
 * Valide une quantité
 * @param {number|string} quantity - La quantité à valider
 * @param {string} fieldName - Nom du champ pour le message d'erreur
 * @returns {Object} { valid: boolean, error: string|null }
 */
export const validateQuantity = (quantity, fieldName = 'Quantité') => {
  const parsed = parseFloat(quantity);

  if (isNaN(parsed)) {
    return { valid: false, error: `${fieldName} doit être un nombre` };
  }

  if (parsed < VALIDATION_LIMITS.MIN_QUANTITY) {
    return { valid: false, error: `${fieldName} doit être supérieure à ${VALIDATION_LIMITS.MIN_QUANTITY}` };
  }

  if (parsed > VALIDATION_LIMITS.MAX_QUANTITY) {
    return { valid: false, error: `${fieldName} dépasse la limite maximale` };
  }

  return { valid: true, error: null };
};

/**
 * Valide un taux (TVA, pourcentage)
 * @param {number|string} rate - Le taux à valider
 * @param {string} fieldName - Nom du champ pour le message d'erreur
 * @returns {Object} { valid: boolean, error: string|null }
 */
export const validateRate = (rate, fieldName = 'Taux') => {
  const parsed = parseFloat(rate);

  if (isNaN(parsed)) {
    return { valid: false, error: `${fieldName} doit être un nombre` };
  }

  if (parsed < VALIDATION_LIMITS.MIN_RATE || parsed > VALIDATION_LIMITS.MAX_RATE) {
    return { valid: false, error: `${fieldName} doit être entre 0 et 100` };
  }

  return { valid: true, error: null };
};

/**
 * Valide les heures travaillées
 * @param {number|string} hours - Nombre d'heures
 * @param {string} fieldName - Nom du champ pour le message d'erreur
 * @returns {Object} { valid: boolean, error: string|null }
 */
export const validateHours = (hours, fieldName = 'Heures') => {
  const parsed = parseFloat(hours);

  if (isNaN(parsed)) {
    return { valid: false, error: `${fieldName} doit être un nombre` };
  }

  if (parsed < VALIDATION_LIMITS.MIN_HOURS) {
    return { valid: false, error: `${fieldName} doit être supérieur à ${VALIDATION_LIMITS.MIN_HOURS}` };
  }

  if (parsed > VALIDATION_LIMITS.MAX_HOURS) {
    return { valid: false, error: `${fieldName} dépasse la limite d'une journée (${VALIDATION_LIMITS.MAX_HOURS} heures)` };
  }

  return { valid: true, error: null };
};

/**
 * Valide un fichier image (logo)
 * @param {File} file - Le fichier à valider
 * @returns {Object} { valid: boolean, error: string|null }
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: true, error: null };
  }

  // Vérifier la taille du fichier
  if (file.size > VALIDATION_LIMITS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux (max ${VALIDATION_LIMITS.MAX_FILE_SIZE / 1024 / 1024} MB)`,
    };
  }

  // Vérifier le type MIME
  if (!VALIDATION_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Format d\'image non autorisé (JPEG, PNG, GIF, WebP)' };
  }

  return { valid: true, error: null };
};

/**
 * Valide un ensemble d'articles de facture
 * @param {Array} items - Articles à valider
 * @returns {Object} { valid: boolean, error: string|null }
 */
export const validateInvoiceItems = (items) => {
  if (!items || items.length === 0) {
    return { valid: false, error: 'Au moins un article est requis' };
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.description || item.description.trim() === '') {
      return { valid: false, error: `Article ${i + 1}: Description requise` };
    }

    const qtyValidation = validateQuantity(item.quantity, `Article ${i + 1} - Quantité`);
    if (!qtyValidation.valid) {
      return qtyValidation;
    }

    const priceValidation = validateAmount(item.unitPrice, `Article ${i + 1} - Prix unitaire`);
    if (!priceValidation.valid) {
      return priceValidation;
    }
  }

  return { valid: true, error: null };
};

/**
 * Arrondit un montant à 2 décimales (protection contre les erreurs d'arrondi)
 * @param {number} amount - Le montant à arrondir
 * @returns {number} Montant arrondi à 2 décimales
 */
export const roundAmount = (amount) => {
  return Math.round(amount * 100) / 100;
};

/**
 * Calcule le total d'une facture avec validations
 * @param {Array} items - Articles de la facture
 * @param {number} taxRate - Taux de TVA
 * @returns {Object} { subtotal, tax, total, error: null|string }
 */
export const calculateInvoiceTotal = (items, taxRate) => {
  // Valider les articles
  const itemsValidation = validateInvoiceItems(items);
  if (!itemsValidation.valid) {
    return { error: itemsValidation.error };
  }

  // Valider le taux de TVA
  const rateValidation = validateRate(taxRate, 'Taux TVA');
  if (!rateValidation.valid) {
    return { error: rateValidation.error };
  }

  // Calculer avec protection contre les erreurs d'arrondi
  const subtotal = roundAmount(
    items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return sum + qty * price;
    }, 0)
  );

  const tax = roundAmount(subtotal * (taxRate / 100));
  const total = roundAmount(subtotal + tax);

  return { subtotal, tax, total, error: null };
};
