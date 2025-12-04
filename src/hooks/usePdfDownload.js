/**
 * Hook personnalisé pour télécharger des PDFs
 * 
 * Utilise react-pdf pour générer le blob et file-saver pour déclencher le téléchargement
 */
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

/**
 * Hook pour télécharger un document PDF
 * @returns {Object} Objet avec la fonction downloadPdf
 */
export const usePdfDownload = () => {
  /**
   * Télécharge un document PDF généré
   * @param {ReactNode} document - Le document React-PDF à télécharger
   * @param {string} filename - Le nom du fichier à télécharger (ex: "facture-001.pdf")
   * @throws {Error} En cas d'erreur lors de la génération du PDF
   */
  const downloadPdf = async (document, filename) => {
    try {
      const blob = await pdf(document).toBlob();
      saveAs(blob, filename);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      throw error;
    }
  };

  return { downloadPdf };
};
