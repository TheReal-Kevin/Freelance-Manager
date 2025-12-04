import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
/**
 * Service de génération de factures en PDF
 * 
 * Utilise react-pdf pour générer des PDF professionnels des factures
 * Include le logo, les détails de l'entreprise, les articles, les totaux et notes
 * Format: A4, avec styling personnalisé en couleur
 */
import { fr } from '../locales/fr';

// Définition des styles pour le document PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  companyInfo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  companyDetails: {
    fontSize: 10,
    marginTop: 5,
    color: '#666',
  },
  invoiceTitle: {
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  invoiceDate: {
    fontSize: 10,
    marginTop: 10,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    width: 100,
  },
  value: {
    fontSize: 10,
    color: '#1F2937',
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
  },
  tableCell: {
    fontSize: 10,
    flex: 1,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
    color: '#4F46E5',
  },
  amountCell: {
    textAlign: 'right',
    flex: 0.8,
  },
  descriptionCell: {
    flex: 2,
  },
  totals: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  totalRow: {
    display: 'flex',
    flexDirection: 'row',
    width: 200,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 10,
    flex: 1,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 10,
    textAlign: 'right',
    fontWeight: 'bold',
    width: 80,
  },
  grandTotal: {
    display: 'flex',
    flexDirection: 'row',
    width: 200,
    borderTopWidth: 2,
    borderTopColor: '#4F46E5',
    paddingTop: 8,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4F46E5',
    flex: 1,
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4F46E5',
    textAlign: 'right',
    width: 80,
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 15,
    fontSize: 9,
    color: '#666',
  },
});

/**
 * Composant de rendu PDF d'une facture
 * 
 * @param {Object} invoice - Les données de la facture (numéro, articles, total, etc.)
 * @param {Object} client - Les informations du client (nom, adresse, etc.)
 * @param {Object} settings - Les paramètres de l'entreprise (nom, logo, coordonnées, etc.)
 * @returns {ReactNode} Document PDF au format A4
 */
export const InvoicePDF = ({ invoice, client, settings }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          {settings.logo && (
            <Image style={styles.logo} src={settings.logo} />
          )}
          <Text style={styles.companyInfo}>{settings.businessName}</Text>
          {settings.businessAddress && (
            <Text style={styles.companyDetails}>{settings.businessAddress}</Text>
          )}
          {settings.businessEmail && (
            <Text style={styles.companyDetails}>{settings.businessEmail}</Text>
          )}
          {settings.businessPhone && (
            <Text style={styles.companyDetails}>{settings.businessPhone}</Text>
          )}
        </View>

        <View style={styles.invoiceTitle}>
          <Text style={styles.invoiceNumber}>{invoice.number}</Text>
          {invoice.createdAt && (
            <Text style={styles.invoiceDate}>
              {fr.invoicePDF.invoiceDate}: {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
            </Text>
          )}
          {invoice.dueDate && (
            <Text style={styles.invoiceDate}>
              {fr.invoicePDF.dueDate}: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{fr.invoicePDF.billTo}</Text>
        <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5 }}>
          {client?.name}
        </Text>
        {client?.company && (
          <Text style={{ fontSize: 10, color: '#666' }}>{client.company}</Text>
        )}
        {client?.address && (
          <Text style={{ fontSize: 10, color: '#666' }}>{client.address}</Text>
        )}
        {client?.email && (
          <Text style={{ fontSize: 10, color: '#666' }}>{client.email}</Text>
        )}
        {client?.phone && (
          <Text style={{ fontSize: 10, color: '#666' }}>{client.phone}</Text>
        )}
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCellHeader, styles.descriptionCell]}>{fr.invoicePDF.description}</Text>
          <Text style={[styles.tableCellHeader, { textAlign: 'center', flex: 0.6 }]}>{fr.invoicePDF.quantity}</Text>
          <Text style={[styles.tableCellHeader, { textAlign: 'right', flex: 0.8 }]}>{fr.invoicePDF.unitPrice}</Text>
          <Text style={[styles.tableCellHeader, styles.amountCell]}>{fr.invoicePDF.amount}</Text>
        </View>

        {invoice.items?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.descriptionCell]}>
              {item.description}
            </Text>
            <Text style={[styles.tableCell, { textAlign: 'center', flex: 0.6 }]}>
              {item.quantity}
            </Text>
            <Text style={[styles.tableCell, { textAlign: 'right', flex: 0.8 }]}>
              {(parseFloat(item.unitPrice) || 0).toFixed(2)} {settings.currency}
            </Text>
            <Text style={[styles.tableCell, styles.amountCell]}>
              {(parseFloat(item.quantity) * parseFloat(item.unitPrice)).toFixed(2)} {settings.currency}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{fr.invoicePDF.subtotal}:</Text>
            <Text style={styles.totalValue}>
              {(invoice.subtotal || 0).toFixed(2)} {settings.currency}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{fr.invoicePDF.tax} ({settings.taxRate}%):</Text>
            <Text style={styles.totalValue}>
              {(invoice.tax || 0).toFixed(2)} {settings.currency}
            </Text>
          </View>

          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>{fr.invoicePDF.total}:</Text>
            <Text style={styles.grandTotalValue}>
              {(invoice.total || 0).toFixed(2)} {settings.currency}
            </Text>
          </View>
        </View>
      </View>

      {invoice.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{fr.invoicePDF.notes}</Text>
          <Text style={{ fontSize: 10, color: '#666' }}>{invoice.notes}</Text>
        </View>
      )}

      {settings.bankDetails && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{fr.invoicePDF.bankDetails}</Text>
          <Text style={{ fontSize: 10, color: '#666', whiteSpace: 'pre-wrap' }}>
            {settings.bankDetails}
          </Text>
        </View>
      )}

      {settings.invoiceNote && (
        <View style={styles.footer}>
          <Text>{settings.invoiceNote}</Text>
        </View>
      )}
    </Page>
  </Document>
);
