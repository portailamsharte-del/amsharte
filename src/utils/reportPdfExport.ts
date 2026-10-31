import { MonthlyReport } from '../types';
import { NGO_INFO } from '../data/initialData';
import { formatFCFA } from './helpers';

/**
 * Builds the complete standalone, official printable HTML document for a monthly report.
 * Structured according to Republic of Benin standards and technical partner requirements (PTF/FEM/MCVT).
 */
export function buildMonthlyReportOfficialHtml(report: MonthlyReport): string {
  const activitiesListHtml = report.activitiesCompleted.length > 0 
    ? report.activitiesCompleted.map(act => `
        <li style="margin-bottom: 6px; line-height: 1.5; color: #1e293b;">
          <strong>•</strong> ${escapeHtml(act)}
        </li>
      `).join('')
    : '<li style="color: #64748b;">Aucune activité détaillée enregistrée.</li>';

  const resultsCardsHtml = report.quantitativeResults.map(res => `
    <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 8px;">
      <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">${escapeHtml(res.label)}</div>
      <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 3px;">${escapeHtml(res.value)}</div>
    </div>
  `).join('');

  const formattedBudget = report.financialNeedsFCFA 
    ? `${report.financialNeedsFCFA.toLocaleString('fr-FR')} FCFA`
    : 'Pris en charge sur budget régulier';

  const statusLabel = 
    report.status === 'vise_de' ? 'VISÉ ET APPROUVÉ PAR LE DIRECTEUR EXÉCUTIF' :
    report.status === 'valide_cpi' ? 'VALIDÉ PAR LE CHARGÉ DE PROGRAMMES (CPI)' :
    report.status === 'soumis_cpi' ? 'SOUMIS POUR REVUE AU CPI' : 'BROUILLON EN COURS';

  const statusColor = 
    report.status === 'vise_de' ? '#047857' :
    report.status === 'valide_cpi' ? '#0284c7' : '#d97706';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>AMSHARTE - Rapport Mensuel ${escapeHtml(report.month)} ${report.year} - ${escapeHtml(report.reference)}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 20mm 15mm;
    }
    @media print {
      body {
        margin: 0;
        background: #fff;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      color: #0f172a;
      line-height: 1.5;
      background: #f1f5f9;
      margin: 0;
      padding: 20px;
    }
    .document-sheet {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 35px 45px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      position: relative;
    }
    .watermark {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 85px;
      font-weight: 900;
      color: rgba(16, 185, 129, 0.04);
      pointer-events: none;
      z-index: 0;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 5px;
    }
    .official-header {
      border-bottom: 2px solid #059669;
      padding-bottom: 15px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .republic-text {
      text-align: center;
      font-size: 10px;
      font-weight: bold;
      color: #334155;
      line-height: 1.3;
    }
    .republic-motto {
      font-style: italic;
      font-size: 9px;
      color: #059669;
      margin-top: 2px;
    }
    .ngo-identity {
      text-align: left;
    }
    .ngo-title {
      font-size: 15px;
      font-weight: 900;
      color: #064e3b;
      letter-spacing: -0.3px;
    }
    .ngo-subtitle {
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
    }
    .ngo-contact-strip {
      font-size: 9px;
      color: #475569;
      margin-top: 3px;
    }
    .report-banner {
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-left: 5px solid #059669;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .report-title {
      font-size: 16px;
      font-weight: 900;
      color: #064e3b;
      margin: 0 0 4px 0;
      text-transform: uppercase;
    }
    .report-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      font-size: 10.5px;
      color: #334155;
      margin-top: 6px;
    }
    .meta-box strong {
      color: #0f172a;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 22px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      text-transform: uppercase;
    }
    .section-title-num {
      background: #059669;
      color: #fff;
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 3px;
    }
    .content-paragraph {
      font-size: 11.5px;
      line-height: 1.6;
      color: #334155;
      margin: 0 0 10px 0;
      text-align: justify;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .results-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 8px;
    }
    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 11px;
    }
    .info-card-title {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .signatures-block {
      margin-top: 35px;
      padding-top: 15px;
      border-top: 1px solid #cbd5e1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .signature-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      text-align: center;
      position: relative;
    }
    .signature-role {
      font-size: 10px;
      font-weight: bold;
      color: #475569;
      text-transform: uppercase;
    }
    .signature-name {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 3px;
    }
    .stamp-box {
      margin: 15px auto 6px auto;
      width: 140px;
      padding: 6px;
      border: 2px dashed #059669;
      color: #059669;
      font-weight: 900;
      font-size: 9px;
      text-transform: uppercase;
      border-radius: 4px;
      transform: rotate(-2deg);
      background: rgba(16, 185, 129, 0.05);
    }
    .stamp-box-de {
      border-color: #1d4ed8;
      color: #1d4ed8;
      background: rgba(29, 78, 216, 0.05);
      transform: rotate(2deg);
    }
    .signature-date {
      font-size: 9px;
      color: #64748b;
    }
    .footer-stamp {
      margin-top: 25px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 8.5px;
      color: #94a3b8;
      line-height: 1.4;
    }
    .action-bar {
      max-width: 800px;
      margin: 0 auto 15px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      padding: 12px 20px;
      border-radius: 8px;
      color: #fff;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 12px;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary {
      background: #10b981;
      color: #fff;
    }
    .btn-primary:hover {
      background: #059669;
    }
    .btn-secondary {
      background: #475569;
      color: #fff;
    }
    .btn-secondary:hover {
      background: #334155;
    }
  </style>
</head>
<body>

  <!-- Screen Control Bar (hidden upon printing) -->
  <div class="action-bar no-print">
    <div>
      <span style="font-weight: 800; font-size: 13px; color: #34d399;">Rapport Mensuel AMSHARTE (Format Officiel PDF)</span>
      <span style="font-size: 11px; color: #cbd5e1; margin-left: 10px;">Prêt pour impression et envoi Bailleurs / Partenaires PTF</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <button onclick="window.close()" class="btn btn-secondary">Fermer</button>
      <button onclick="window.print()" class="btn btn-primary">🖨️ Imprimer / Enregistrer en PDF</button>
    </div>
  </div>

  <!-- A4 Printable Sheet -->
  <div class="document-sheet">
    <div class="watermark">AMSHARTE</div>

    <!-- Official Header -->
    <div class="official-header">
      <div class="ngo-identity">
        <div class="ngo-title">ONG AMSHARTE (ASR-E)</div>
        <div class="ngo-subtitle">Sauvegarde de l'Environnement, des Tortues Marines &amp; Hygiène SST</div>
        <div class="ngo-contact-strip">
          Siège : Togbin Fandji (Abomey-Calavi / Cotonou) • Tél : ${escapeHtml(NGO_INFO.phones[0])} / ${escapeHtml(NGO_INFO.phones[1])}<br>
          Email : ${escapeHtml(NGO_INFO.email)} • Site Web : www.ong-amsharte.org
        </div>
      </div>

      <div class="republic-text">
        RÉPUBLIQUE DU BÉNIN<br>
        <span style="font-size: 9px; font-weight: normal; color: #64748b;">Fraternité — Justice — Travail</span><br>
        <span class="republic-motto">Ministère du Cadre de Vie &amp; MISP</span><br>
        <span style="font-size: 8.5px; color: #059669; font-weight: bold;">Loi N° 2025-19 Certifiée</span>
      </div>
    </div>

    <!-- Report Title Banner -->
    <div class="report-banner">
      <div class="report-title">
        RAPPORT D'ACTIVITÉ MENSUEL — ${escapeHtml(report.month.toUpperCase())} ${report.year}
      </div>
      <div class="report-meta-grid">
        <div class="meta-box">
          <strong>Réf. Document :</strong> ${escapeHtml(report.reference)}
        </div>
        <div class="meta-box">
          <strong>Date de dépôt :</strong> ${escapeHtml(report.dateSubmitted)} (Échéance J+10)
        </div>
        <div class="meta-box">
          <strong>Statut :</strong> <span style="font-weight: bold; color: ${statusColor};">${escapeHtml(statusLabel)}</span>
        </div>
      </div>
      <div style="margin-top: 6px; font-size: 11px; color: #334155;">
        <strong>Auteur / Rédacteur :</strong> ${escapeHtml(report.authorName)} — <em>${escapeHtml(report.authorRole)}</em>
      </div>
    </div>

    <!-- 1. Synthèse Exécutive -->
    <div class="section-title">
      <span class="section-title-num">1</span> Synthèse Opérationnelle &amp; Contexte d'Intervention
    </div>
    <p class="content-paragraph">${escapeHtml(report.summary)}</p>

    <!-- 2. Activités Réalisées -->
    <div class="section-title">
      <span class="section-title-num">2</span> Détail des Activités &amp; Réalisations Physiques
    </div>
    <ul style="padding-left: 18px; margin-top: 6px; margin-bottom: 12px; font-size: 11.5px;">
      ${activitiesListHtml}
    </ul>

    <!-- 3. Résultats & Indicateurs Clés -->
    <div class="section-title">
      <span class="section-title-num">3</span> Résultats Quantitatifs &amp; Indicateurs d'Impact Clés
    </div>
    <div class="results-container">
      ${resultsCardsHtml}
    </div>

    <!-- 4. Contraintes & Solutions -->
    <div class="section-title">
      <span class="section-title-num">4</span> Difficultés Rencontrées &amp; Mesures Correctives
    </div>
    <div class="grid-2">
      <div class="info-card">
        <div class="info-card-title" style="color: #b45309;">⚠️ Contraintes et défis observés :</div>
        <div style="color: #475569; line-height: 1.5;">${escapeHtml(report.challengesFaced)}</div>
      </div>
      <div class="info-card">
        <div class="info-card-title" style="color: #047857;">✅ Solutions &amp; ajustements appliqués :</div>
        <div style="color: #475569; line-height: 1.5;">${escapeHtml(report.solutionsApplied)}</div>
      </div>
    </div>

    <!-- 5. Perspectives & Finances -->
    <div class="section-title">
      <span class="section-title-num">5</span> Planification du Mois Prochain &amp; Besoins Budgétaires
    </div>
    <div class="grid-2">
      <div class="info-card">
        <div class="info-card-title" style="color: #0369a1;">📅 Priorités opérationnelles futures :</div>
        <div style="color: #475569; line-height: 1.5;">${escapeHtml(report.nextMonthPlanning)}</div>
      </div>
      <div class="info-card">
        <div class="info-card-title" style="color: #4338ca;">💰 Cadrage Financier (Dolibarr) :</div>
        <div style="color: #0f172a; font-weight: 800; font-size: 14px; margin-top: 4px;">${formattedBudget}</div>
        <div style="color: #64748b; font-size: 9.5px; margin-top: 2px;">Soumis à validation comptable et conformité trésorerie.</div>
      </div>
    </div>

    <!-- 6. Signatures et Visas Officiels -->
    <div class="signatures-block">
      <div class="signature-card">
        <div class="signature-role">Rédigé &amp; Certifié par le CPI</div>
        <div class="signature-name">Henri Doudédji FATCHINA</div>
        <div style="font-size: 9.5px; color: #64748b;">Chargé de Programmes par Intérim</div>
        
        <div class="stamp-box">
          ✓ VISA TECHNIQUE CONFORME<br>
          <span style="font-size: 7.5px; font-weight: normal;">Direction des Programmes AMSHARTE</span>
        </div>
        <div class="signature-date">Signé le ${escapeHtml(report.dateSubmitted)} à Togbin Fandji</div>
      </div>

      <div class="signature-card">
        <div class="signature-role">Vu &amp; Approuvé pour Transmission PTF</div>
        <div class="signature-name">SONON Tchéhouéa</div>
        <div style="font-size: 9.5px; color: #64748b;">Directeur Exécutif (DE)</div>
        
        <div class="stamp-box stamp-box-de">
          ★ VISA DE DIRECTION EXÉCUTIVE<br>
          <span style="font-size: 7.5px; font-weight: normal;">Bon pour diffusion aux Bailleurs</span>
        </div>
        <div class="signature-date">Approbation formelle — Siège National</div>
      </div>
    </div>

    <!-- Legal Compliance Stamp Footer -->
    <div class="footer-stamp">
      AMSHARTE — Organisation Non Gouvernementale régie par la Loi 2025-19 en République du Bénin.<br>
      Partenaire officiel du Ministère du Cadre de Vie (MCVT - Lettre N° 878) et de la Police Républicaine (BPLP).<br>
      Ce rapport consolidé est destiné aux Partenaires Techniques et Financiers (PTF), au Ministère de tutelle et aux Archives Institutionnelles.
    </div>
  </div>

  <script>
    // Auto-trigger print if requested via query or on ready
    window.addEventListener('DOMContentLoaded', () => {
      if (window.location.search.includes('autoprint=true')) {
        setTimeout(() => { window.print(); }, 600);
      }
    });
  </script>
</body>
</html>`;
}

/**
 * Helper to escape HTML characters
 */
function escapeHtml(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Directly triggers a printable pop-up window formatted for A4 printing and "Save as PDF".
 */
export function openReportPdfPrintWindow(report: MonthlyReport): void {
  const html = buildMonthlyReportOfficialHtml(report);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    // Fallback if pop-up blocked: download printable HTML file
    downloadReportPrintableDocument(report);
  }
}

/**
 * Downloads the report as an official standalone printable HTML/PDF package.
 */
export function downloadReportPrintableDocument(report: MonthlyReport): void {
  const html = buildMonthlyReportOfficialHtml(report);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `RAPPORT-MENSUEL-AMSHARTE-${report.month.toUpperCase()}-${report.year}-${report.reference}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
