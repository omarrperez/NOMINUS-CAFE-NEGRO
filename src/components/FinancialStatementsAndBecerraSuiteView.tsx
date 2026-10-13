import React, { useState } from 'react';
import {
  FileSpreadsheet,
  TrendingUp,
  Scale,
  Calendar,
  DollarSign,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Printer,
  Search,
  Filter,
  Eye,
  FileCheck,
  Building2,
  Users,
  ShieldCheck,
  ChevronRight,
  FileText,
  AlertTriangle,
  Receipt,
  Download,
  Copy,
  Check,
  FileDown
} from 'lucide-react';
import { exportToWord, exportToCsv, exportToExcelXlsx, exportToPdfPrint, downloadElementAsPdf, exportHtmlToPdf } from '../utils/exportUtils';
import {
  BALANCE_SHEET_2025,
  INCOME_STATEMENT_2025,
  BALANCE_SHEET_AUGUST_2026,
  INCOME_STATEMENT_AUGUST_2026,
  MANUEL_BECERRA_MOVEMENTS_2026,
  MANUEL_BECERRA_SUMMARY_2026,
  BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION,
  BANESCO_OFFICIAL_LETTER_2026,
  BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026
} from '../data/financialStatementsData';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
}

type SubTab =
  | 'TABLA_ORIGEN_MES'
  | 'CARTA_BANCO_OFICIAL'
  | 'MANUEL_BECERRA'
  | 'CONCILIACION_BANCO'
  | 'EEFF_COMPARATIVO'
  | 'ESTADO_RESULTADOS';

export const FinancialStatementsAndBecerraSuiteView: React.FC<Props> = ({ company, currentRate }) => {
  const [activeTab, setActiveTab] = useState<SubTab>('TABLA_ORIGEN_MES');
  const [becerraFilter, setBecerraFilter] = useState<'TODOS' | 'EGRESOS' | 'INGRESOS'>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredBecerraMovements = MANUEL_BECERRA_MOVEMENTS_2026.filter((mov) => {
    const matchesSearch =
      mov.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.date.includes(searchTerm) ||
      mov.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (becerraFilter === 'EGRESOS') return matchesSearch && mov.outflowVES > 0;
    if (becerraFilter === 'INGRESOS') return matchesSearch && mov.inflowVES > 0;
    return matchesSearch;
  });

  const handleCopyLetter = () => {
    const textContent = `
OFICIO: AO-EXP-BAN-2026-0831
FECHA: 31 de Agosto de 2026
EXPEDIENTE: AUD-BAN-2026-ONI-094

A: BANESCO BANCO UNIVERSAL, C.A.
Gerencia de Cumplimiento / UPCLC/FT / Auditoría Interna
Atención: Lcdo. Roberto Albarrán

ASUNTO: RESPUESTA FORMAL A REQUERIMIENTO SOBRE DISPARIDAD ENTRE INGRESOS DECLARADOS EN ESTADOS FINANCIEROS Y CRÉDITOS BANCARIOS MOVILIZADOS EN BBU (PERÍODO ENERO - AGOSTO 2026)

Estimados señores:

En atención a su comunicación sobre la presunta disparidad entre los Ingresos Declarados en Estados Financieros (Bs. 92.641.520,01 / USD 116.531,68) y los Créditos Bancarios Movilizados en BBU (Promedio USD 2.781.830,18 / Total Bs. 1.966.597.105,35), dejamos formal y categórica constancia de lo siguiente:

1. JUSTIFICACIÓN DE LA DIFERENCIA:
- Bs. 1.542.017.092,63 (78,4%): ANTICIPOS EN VENTAS DE CLIENTES JURÍDICOS (NIIF 15) para la intermediación y compra de café en Venezuela a tasa oficial BCV. Bajo NIIF 15 constituyen Pasivo Corriente, no ventas gravadas. Se facturan formalmente a partir de OCTUBRE DE 2026 sustituyendo el anticipo contra facturas de venta.
- Bs. 186.376.000,00 (9,5%): REINTEGROS DE CAPITAL DEL CONTRATO DE PRÉSTAMO MUTUO Y LÍNEA DE CRÉDITO suscrito con el socio Manuel Becerra (Límite Bs. 600.000.000,00). Reducen la cuenta de activo "Cuentas por Cobrar Manuel Becerra" (saldo en balance Bs. 325.948.652,96).
- Bs. 208.708.057,73 (10,6%): TRANSFERENCIAS ENTRE CUENTAS PROPIAS DE AGRÍCOLA ONI C.A. (Banco Provincial, Mercantil, Plaza, Bancamiga). Impacto patrimonial neto de Bs. 0,00.
- Bs. 29.495.954,99 (1,5%): APORTES Y RESERVAS DE PERSONAS NATURALES (V-023997829 y 14 titulares).

2. INGRESOS FISCALES REALES DEVENGADOS:
Los ingresos operacionales por Servicios Agrícolas (Bs. 78.717.472,35) más los Ingresos por Intereses del Mutuo Becerra (Bs. 13.924.047,66) totalizan exactamente Bs. 92.641.520,01, tal como refleja fielmente el Estado de Resultados al 31/08/2026.

Soportes Anexos: Contrato Mutuo Becerra Bs. 600M, Contratos a Futuro de Café Nacional, Comprobantes de compra de divisas ($556.890,45 USD), Guías SICA/CVC y Estados Financieros auditados CPC 41.802.

Atentamente,
Omar Pérez C. (Representante Legal) & Lcda. Carmen Rivas (CPC 41.802)
    `;
    navigator.clipboard.writeText(textContent.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportTable1Word = () => {
    const tableRows = BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.rows.map(r => `
      <tr>
        <td><strong>${r.origen}</strong><br><small style="color:#64748b">${r.legalClassification}</small></td>
        <td class="num">${r.ene.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.feb.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.mar.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.abr.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.may.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.jun.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.jul.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.ago.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num" style="font-weight:bold;color:#0f172a">${r.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num" style="font-weight:bold;color:#d97706">${r.pctDelTotal.toFixed(1)}%</td>
        <td class="num" style="font-weight:bold;color:#059669">$${r.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join('');

    const totals = BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals;

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Cuenta Banesco:</strong> ${company.banescoAccountVES}</p>
      <h2>COMPOSICIÓN OFICIAL DE ABONOS POR ORIGEN Y MES (BS) &ndash; ENERO A AGOSTO 2026</h2>
      <div class="highlight-box">
        <strong>Cuadre Oficial del Estado de Cuenta Banesco vs Estados Financieros:</strong><br>
        Total Créditos Movilizados: <strong>Bs. ${totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> ($${totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD).<br>
        Ventas e Ingresos Fiscales Declarados: <strong>Bs. 92.641.520,01</strong> ($116.531,68 USD).<br>
        Anticipos Recibidos para Compra de Café en Venezuela (NIIF 15): <strong>Bs. 1.542.017.092,63 (78,4%)</strong> &mdash; Se facturan a partir de Octubre 2026.
      </div>
      <table>
        <thead>
          <tr>
            <th>Origen de Fondos</th>
            <th class="num">Ene</th>
            <th class="num">Feb</th>
            <th class="num">Mar</th>
            <th class="num">Abr</th>
            <th class="num">May</th>
            <th class="num">Jun</th>
            <th class="num">Jul</th>
            <th class="num">Ago</th>
            <th class="num">Total Bs</th>
            <th class="num">%</th>
            <th class="num">Total USD</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          <tr style="background-color:#0f172a;color:#ffffff;font-weight:bold">
            <td style="color:#ffffff">TOTAL GENERAL AUDITADO</td>
            <td class="num" style="color:#ffffff">${totals.ene.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.feb.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.mar.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.abr.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.may.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.jun.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.jul.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.ago.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">100.0%</td>
            <td class="num" style="color:#ffffff">$${totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
      <div class="footer-signatures">
        <table style="border:none">
          <tr style="border:none;background:none">
            <td style="border:none;width:50%;text-align:center">
              _____________________________________<br>
              <strong>${company.legalRepresentative}</strong><br>
              Presidente / Representante Legal<br>
              ${company.name}
            </td>
            <td style="border:none;width:50%;text-align:center">
              _____________________________________<br>
              <strong>Lcda. Carmen Rivas</strong><br>
              Contador Público Colegiado Nro. 41.802<br>
              Auditor Externo Independiente
            </td>
          </tr>
        </table>
      </div>
    `;

    exportToWord('Composicion_Abonos_Banesco_2026_Agricola_Oni.doc', 'Composición de Abonos Banesco 2026', htmlContent);
  };

  const handleExportTable1Csv = () => {
    const headers = [
      'Origen de Fondos',
      'Clasificación Legal / Contable (Sustento Banesco)',
      'Enero (Bs.)',
      'Febrero (Bs.)',
      'Marzo (Bs.)',
      'Abril (Bs.)',
      'Mayo (Bs.)',
      'Junio (Bs.)',
      'Julio (Bs.)',
      'Agosto (Bs.)',
      'Total Acumulado (Bs.)',
      '% del Total',
      'Contravalor USD ($)'
    ];
    const dataRows = BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.rows.map(r => [
      r.origen,
      r.legalClassification,
      r.ene,
      r.feb,
      r.mar,
      r.abr,
      r.may,
      r.jun,
      r.jul,
      r.ago,
      r.totalBs,
      `${r.pctDelTotal.toFixed(1)}%`,
      r.totalUSD
    ]);
    const t = BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals;
    const totalsRow = [
      'TOTAL GENERAL CONSOLIDADOS',
      'Cuadre 100% Extracto Bancario Banesco vs EEFF 2026',
      t.ene,
      t.feb,
      t.mar,
      t.abr,
      t.may,
      t.jun,
      t.jul,
      t.ago,
      t.totalBs,
      '100.0%',
      t.totalUSD
    ];

    exportToExcelXlsx({
      filename: 'Cuadre_Oficial_Abonos_Banesco_y_EEFF_2026.xlsx',
      sheetName: 'Cuadre Oficial Abonos 2026',
      title: 'COMPOSICIÓN OFICIAL DE ABONOS POR ORIGEN Y MES (BS) - ENERO A AGOSTO 2026',
      subtitle: 'Cuadre Oficial del Estado de Cuenta Banesco N° 0134-0342-18-3421089912 vs Estados Financieros',
      headers,
      rows: dataRows,
      totalsRow,
      columnWidths: [38, 65, 16, 16, 16, 16, 16, 16, 16, 16, 22, 14, 20]
    });
  };

  const handleExportBecerraCsv = () => {
    const headers = ['# Item', 'Fecha', 'Referencia Banesco', 'Institución Bancaria', 'Descripción / Detalle', 'Desembolso Préstamo (Egreso Bs.)', 'Amortización Pago (Ingreso Bs.)'];
    const dataRows = MANUEL_BECERRA_MOVEMENTS_2026.map(m => [
      m.item,
      m.date,
      m.reference,
      m.bank,
      m.description,
      m.outflowVES,
      m.inflowVES
    ]);
    const totalsRow = [
      'TOTALES',
      '47 MOVIMIENTOS',
      '',
      'BANESCO',
      'Línea de Crédito Rotativa Becerra',
      MANUEL_BECERRA_SUMMARY_2026.totalDisbursedVES,
      MANUEL_BECERRA_SUMMARY_2026.totalRepaidVES
    ];

    exportToExcelXlsx({
      filename: 'Contrato_Mutuo_Becerra_47_Movimientos_2026.xlsx',
      sheetName: 'Movimientos Mutuo Becerra',
      title: 'RELACIÓN DETALLADA DE MOVIMIENTOS BANCARIOS BANESCO - MANUEL BECERRA (47 OPERACIONES 2026)',
      subtitle: `Préstamos Otorgados: Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalDisbursedVES.toLocaleString('es-VE')} | Amortizados: Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalRepaidVES.toLocaleString('es-VE')} | Saldo x Cobrar: Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalReceivableAugust31VES.toLocaleString('es-VE')} ($${MANUEL_BECERRA_SUMMARY_2026.totalReceivableUSD.toLocaleString('en-US')} USD)`,
      headers,
      rows: dataRows,
      totalsRow,
      columnWidths: [8, 14, 20, 16, 50, 25, 25]
    });
  };

  const handleExportConciliacionCsv = () => {
    const headers = ['# Item', 'Concepto de Conciliación', 'Naturaleza Legal / Contable', 'Monto Movilizado Banesco (Bs.)', 'Impacto en Estado de Resultados (Bs.)', 'Sustento Legal y Fiscal SENIAT / SUDEBAN'];
    const dataRows = BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.breakdown.map((item, idx) => [
      idx + 1,
      item.concept,
      item.nature,
      item.bankAmountVES,
      item.impactOnIncomeStatement,
      item.legalNotes
    ]);

    exportToExcelXlsx({
      filename: 'Conciliacion_Banesco_vs_Estados_Financieros_2026.xlsx',
      sheetName: 'Conciliación Banesco vs EEFF',
      title: 'CONCILIACIÓN ANALÍTICA: BANESCO VS ESTADOS FINANCIEROS (CORTE 31/08/2026)',
      subtitle: 'Ingresos Banesco Bs. 1.966.597.105,35 vs Ingresos EEFF Bs. 92.641.520,01 | Diferencia 100% Justificada',
      headers,
      rows: dataRows,
      columnWidths: [8, 45, 35, 25, 25, 60]
    });
  };

  const handleExportBalanceSheetExcel = () => {
    const headers = ['Concepto / Rubro Contable (VEN-NIF)', '31/12/2025 (Bs.)', '31/12/2025 (US$)', '31/08/2026 (Bs.)', '31/08/2026 (US$)'];
    const dataRows = [
      ['ACTIVO CORRIENTE', '', '', '', ''],
      ['Efectivo en Caja y Bancos', BALANCE_SHEET_2025.assets.current.cashAndBanks, BALANCE_SHEET_2025.assets.current.cashAndBanks / 301.37, BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks, BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks / 794.99],
      ['Cuentas por Cobrar Manuel Becerra', 0, 0, BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable, BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable / 794.99],
      ['Total Activo Corriente', BALANCE_SHEET_2025.assets.current.totalCurrent, BALANCE_SHEET_2025.assets.current.totalCurrent / 301.37, BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent, BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent / 794.99],
      ['TOTAL ACTIVO', BALANCE_SHEET_2025.assets.totalAssets, BALANCE_SHEET_2025.assets.totalAssets / 301.37, BALANCE_SHEET_AUGUST_2026.assets.totalAssets, BALANCE_SHEET_AUGUST_2026.assets.totalAssets / 794.99],
      ['PASIVO CORRIENTE', '', '', '', ''],
      ['Cuentas por Pagar Socios / Anticipos', 0, 0, BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables, BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables / 794.99],
      ['TOTAL PASIVO Y PATRIMONIO', BALANCE_SHEET_2025.totalLiabilitiesAndEquity, BALANCE_SHEET_2025.totalLiabilitiesAndEquity / 301.37, BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity, BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity / 794.99]
    ];

    exportToExcelXlsx({
      filename: 'Estado_Situacion_Financiera_VEN_NIF_2025_2026.xlsx',
      sheetName: 'Balance General Comparativo',
      title: 'ESTADO DE SITUACIÓN FINANCIERA COMPARATIVO (VEN-NIF)',
      subtitle: 'Cierre Diciembre 2025 (Tasa BCV 301,37) vs Corte Agosto 2026 (Tasa BCV 794,99)',
      headers,
      rows: dataRows,
      columnWidths: [45, 25, 20, 25, 20]
    });
  };

  const handleExportIncomeStatementExcel = () => {
    const headers = ['Concepto de Resultados', 'Ejercicio 2025 (Bs.)', 'Ejercicio 2025 (US$)', 'Enero-Agosto 2026 (Bs.)', 'Enero-Agosto 2026 (US$)'];
    const dataRows = [
      ['INGRESOS OPERACIONALES', '', '', '', ''],
      ['Ventas por Servicios Agrícolas Facturados', INCOME_STATEMENT_2025.revenues.agriculturalServices, INCOME_STATEMENT_2025.revenues.agriculturalServices / INCOME_STATEMENT_2025.exchangeRateBCV, INCOME_STATEMENT_AUGUST_2026.revenues.agriculturalServices, INCOME_STATEMENT_AUGUST_2026.revenues.agriculturalServices / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV],
      ['Ingresos Financieros por Intereses de Mutuo (Becerra)', 0, 0, INCOME_STATEMENT_AUGUST_2026.revenues.interestIncome, INCOME_STATEMENT_AUGUST_2026.revenues.interestIncome / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV],
      ['TOTAL INGRESOS', INCOME_STATEMENT_2025.revenues.totalRevenues, INCOME_STATEMENT_2025.revenues.totalRevenues / INCOME_STATEMENT_2025.exchangeRateBCV, INCOME_STATEMENT_AUGUST_2026.revenues.totalRevenues, INCOME_STATEMENT_AUGUST_2026.revenues.totalRevenues / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV],
      ['COSTOS OPERACIONALES', '', '', '', ''],
      ['Costos Directos de Servicios', INCOME_STATEMENT_2025.costs.serviceCosts, INCOME_STATEMENT_2025.costs.serviceCosts / INCOME_STATEMENT_2025.exchangeRateBCV, INCOME_STATEMENT_AUGUST_2026.costs.serviceCosts, INCOME_STATEMENT_AUGUST_2026.costs.serviceCosts / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV],
      ['UTILIDAD BRUTA', INCOME_STATEMENT_2025.costs.grossProfit, INCOME_STATEMENT_2025.costs.grossProfit / INCOME_STATEMENT_2025.exchangeRateBCV, INCOME_STATEMENT_AUGUST_2026.costs.grossProfit, INCOME_STATEMENT_AUGUST_2026.costs.grossProfit / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV],
      ['GASTOS OPERATIVOS Y ADMINISTRATIVOS', INCOME_STATEMENT_2025.operatingExpenses.administrativeExpenses, INCOME_STATEMENT_2025.operatingExpenses.administrativeExpenses / INCOME_STATEMENT_2025.exchangeRateBCV, INCOME_STATEMENT_AUGUST_2026.operatingExpenses.administrativeExpenses, INCOME_STATEMENT_AUGUST_2026.operatingExpenses.administrativeExpenses / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV],
      ['UTILIDAD EN OPERACIONES', INCOME_STATEMENT_2025.operatingExpenses.operatingProfit, INCOME_STATEMENT_2025.operatingExpenses.operatingProfit / INCOME_STATEMENT_2025.exchangeRateBCV, INCOME_STATEMENT_AUGUST_2026.operatingExpenses.operatingProfit, INCOME_STATEMENT_AUGUST_2026.operatingExpenses.operatingProfit / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV],
      ['UTILIDAD NETA DEL EJERCICIO', INCOME_STATEMENT_2025.taxesAndReserves.netProfit, INCOME_STATEMENT_2025.taxesAndReserves.netProfit / INCOME_STATEMENT_2025.exchangeRateBCV, INCOME_STATEMENT_AUGUST_2026.taxesAndReserves.netProfit, INCOME_STATEMENT_AUGUST_2026.taxesAndReserves.netProfit / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV]
    ];

    exportToExcelXlsx({
      filename: 'Estado_Resultados_Integrales_2025_2026.xlsx',
      sheetName: 'Estado de Resultados',
      title: 'ESTADO DE RESULTADO INTEGRAL COMPARATIVO (VEN-NIF)',
      subtitle: 'Cierre 2025 vs Corte 8 Meses al 31 de Agosto de 2026',
      headers,
      rows: dataRows,
      columnWidths: [48, 25, 20, 25, 20]
    });
  };

  const handleExportBecerraWord = () => {
    const rowsHtml = MANUEL_BECERRA_MOVEMENTS_2026.map(m => `
      <tr>
        <td style="text-align:center">${m.item}</td>
        <td>${m.date}</td>
        <td style="font-family:monospace">${m.reference}</td>
        <td>${m.bank}</td>
        <td>${m.description}</td>
        <td class="num" style="color:#d97706">${m.outflowVES > 0 ? m.outflowVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}</td>
        <td class="num" style="color:#059669">${m.inflowVES > 0 ? m.inflowVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Instrumento:</strong> Contrato de Préstamo Mutuo y Línea de Crédito Rotativa (Límite Bs. 600.000.000,00)</p>
      <h2>RELACIÓN DETALLADA DE MOVIMIENTOS BANCARIOS BANESCO &ndash; MANUEL BECERRA (47 OPERACIONES 2026)</h2>
      <div class="highlight-box">
        <strong>Resumen de Liquidación al 31 de Agosto de 2026:</strong><br>
        Total Desembolsado a Manuel Becerra (33 salidas): <strong>Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalDisbursedVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong><br>
        Total Reembolsado / Amortizado por Becerra (14 entradas): <strong>Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalRepaidVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> (${MANUEL_BECERRA_SUMMARY_2026.percentagePaidPct.toFixed(2)}% del capital amortizado)<br>
        Saldo Deudor Principal Restante: <strong>Bs. ${MANUEL_BECERRA_SUMMARY_2026.principalBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong><br>
        Intereses Devengados en Ejercicio (EEFF): <strong>Bs. ${MANUEL_BECERRA_SUMMARY_2026.interestIncomeVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong><br>
        Saldo Total por Cobrar en Activo Corriente: <strong>Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalReceivableAugust31VES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> ($${MANUEL_BECERRA_SUMMARY_2026.totalReceivableUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Referencia</th>
            <th>Banco</th>
            <th>Descripción Banesco</th>
            <th class="num">Desembolso (Egreso)</th>
            <th class="num">Amortización (Ingreso)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="background-color:#0f172a;color:#ffffff;font-weight:bold">
            <td colspan="5" style="color:#ffffff">TOTALES CONSOLIDADOS (47 MOVIMIENTOS)</td>
            <td class="num" style="color:#ffffff">Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalDisbursedVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalRepaidVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
    `;

    exportToWord('Contrato_Mutuo_Manuel_Becerra_47_Movimientos_2026.doc', 'Contrato Mutuo Manuel Becerra 2026', htmlContent);
  };

  const handleExportTable1Pdf = async () => {
    const totals = BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals;
    const tableRows = BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.rows.map(r => `
      <tr>
        <td><strong>${r.origen}</strong><br><small style="color:#64748b">${r.legalClassification}</small></td>
        <td class="num">${r.ene.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.feb.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.mar.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.abr.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.may.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.jun.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.jul.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">${r.ago.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num" style="font-weight:bold;color:#0f172a">${r.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num" style="font-weight:bold;color:#d97706">${r.pctDelTotal.toFixed(1)}%</td>
        <td class="num" style="font-weight:bold;color:#059669">$${r.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Cuenta Banesco:</strong> ${company.banescoAccountVES}</p>
      <h2>COMPOSICIÓN OFICIAL DE ABONOS POR ORIGEN Y MES (BS) &ndash; ENERO A AGOSTO 2026</h2>
      <div class="highlight-box">
        <strong>Cuadre Oficial del Estado de Cuenta Banesco vs Estados Financieros:</strong><br>
        Total Créditos Movilizados: <strong>Bs. ${totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> ($${totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD).<br>
        Ventas e Ingresos Fiscales Declarados: <strong>Bs. 92.641.520,01</strong> ($116.531,68 USD).<br>
        Anticipos Recibidos para Compra de Café en Venezuela (NIIF 15): <strong>Bs. 1.542.017.092,63 (78,4%)</strong> &mdash; Se facturan a partir de Octubre 2026.
      </div>
      <table>
        <thead>
          <tr>
            <th>Origen de Fondos</th>
            <th class="num">Ene</th>
            <th class="num">Feb</th>
            <th class="num">Mar</th>
            <th class="num">Abr</th>
            <th class="num">May</th>
            <th class="num">Jun</th>
            <th class="num">Jul</th>
            <th class="num">Ago</th>
            <th class="num">Total Bs</th>
            <th class="num">%</th>
            <th class="num">Total USD</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          <tr style="background-color:#0f172a;color:#ffffff;font-weight:bold">
            <td style="color:#ffffff">TOTAL GENERAL AUDITADO</td>
            <td class="num" style="color:#ffffff">${totals.ene.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.feb.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.mar.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.abr.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.may.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.jun.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.jul.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.ago.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">${totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">100.0%</td>
            <td class="num" style="color:#ffffff">$${totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
      <div class="footer-signatures">
        <table style="border:none">
          <tr style="border:none;background:none">
            <td style="border:none;width:50%;text-align:center">
              _____________________________________<br>
              <strong>${company.legalRepresentative}</strong><br>
              Presidente / Representante Legal<br>
              ${company.name}
            </td>
            <td style="border:none;width:50%;text-align:center">
              _____________________________________<br>
              <strong>Lcda. Carmen Rivas</strong><br>
              Contador Público Colegiado Nro. 41.802<br>
              Auditor Externo Independiente
            </td>
          </tr>
        </table>
      </div>
    `;

    await exportHtmlToPdf('Composicion_Abonos_Banesco_2026_Agricola_Oni.pdf', 'Composición Oficial de Abonos Banesco 2026', htmlContent);
  };

  const handleExportBecerraPdf = async () => {
    const rowsHtml = MANUEL_BECERRA_MOVEMENTS_2026.map(m => `
      <tr>
        <td style="text-align:center">${m.item}</td>
        <td>${m.date}</td>
        <td><strong>${m.reference}</strong></td>
        <td>${m.description}</td>
        <td class="num">${m.outflowVES > 0 ? `Bs. ${m.outflowVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
        <td class="num">${m.inflowVES > 0 ? `Bs. ${m.inflowVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; Expediente Banesco AUD-BAN-2026-ONI-094</p>
      <h2>CONTRATO DE MUTUO EN CUENTA CORRIENTE &ndash; MANUEL BECERRA (47 MOVIMIENTOS 2026)</h2>
      <div class="highlight-box">
        Total Préstamos Otorgados (Egresos): <strong>Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalDisbursedVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong>.<br>
        Total Reembolsos / Pagos Recibidos (Ingresos): <strong>Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalRepaidVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong>.<br>
        Saldo por Cobrar al 31/08/2026: <strong>Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalReceivableAugust31VES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> ($${MANUEL_BECERRA_SUMMARY_2026.totalReceivableUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD).
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Referencia Banesco</th>
            <th>Descripción / Banco</th>
            <th class="num">Desembolso (Egreso)</th>
            <th class="num">Amortización (Ingreso)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="background-color:#0f172a;color:#ffffff;font-weight:bold">
            <td colspan="4" style="color:#ffffff">TOTALES CONSOLIDADOS (47 MOVIMIENTOS)</td>
            <td class="num" style="color:#ffffff">Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalDisbursedVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">Bs. ${MANUEL_BECERRA_SUMMARY_2026.totalRepaidVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
    `;

    await exportHtmlToPdf('Contrato_Mutuo_Manuel_Becerra_47_Movimientos_2026.pdf', 'Contrato Mutuo Manuel Becerra 2026', htmlContent);
  };

  const handleExportConciliacionWord = () => {
    const breakdownRows = BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.breakdown.map(b => `
      <tr>
        <td><strong>${b.concept}</strong><br><small style="color:#64748b">${b.legalNotes}</small></td>
        <td class="num">${b.bankAmountVES > 0 ? `Bs. ${b.bankAmountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
        <td>${b.nature}</td>
        <td class="num">${b.impactOnIncomeStatement > 0 ? `Bs. ${b.impactOnIncomeStatement.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '0,00'}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Expediente:</strong> AUD-BAN-2026-ONI-094</p>
      <h2>CONCILIACIÓN TÉCNICA Y CONTABLE &ndash; EXTRACTO BANESCO VS ESTADOS FINANCIEROS (CORTE 31/08/2026)</h2>
      <div class="highlight-box">
        <strong>Aclaratoria Jurídico-Contable sobre Depósitos vs Ingresos:</strong><br>
        Total Depósitos en Cuenta Corriente BBU: <strong>Bs. ${BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.bankDepositsTotalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong>.<br>
        Ingresos Fiscales Declarados en Estado de Resultados: <strong>Bs. ${BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.financialStatementRevenuesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong>.<br>
        La diferencia de Bs. 1.873.955.585,34 corresponde en 82,3% a Anticipos de Clientes para Compra e Intermediación de Café en Venezuela (NIIF 15) que se facturan en Octubre 2026, y a Préstamos de Accionistas/Relacionadas no sujetos a ISLR.
      </div>
      <table>
        <thead>
          <tr>
            <th>Concepto de Movimiento</th>
            <th class="num">Monto Banesco (Bs.)</th>
            <th>Naturaleza Jurídico-Contable</th>
            <th class="num">Impacto en EEFF (Bs.)</th>
          </tr>
        </thead>
        <tbody>
          ${breakdownRows}
          <tr style="background-color:#0f172a;color:#ffffff;font-weight:bold">
            <td style="color:#ffffff">TOTAL INGRESOS AUDITADOS EN ESTADO DE RESULTADOS</td>
            <td colspan="2" style="color:#ffffff">—</td>
            <td class="num" style="color:#ffffff">Bs. ${BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.financialStatementRevenuesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top:16pt"><strong>Conclusión Oficial:</strong> ${BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.conclusion}</p>
    `;

    exportToWord('Conciliacion_Tecnica_Banesco_vs_EEFF_2026.doc', 'Conciliación Técnica Banesco vs EEFF 2026', htmlContent);
  };

  const handleExportConciliacionPdf = async () => {
    const breakdownRows = BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.breakdown.map(b => `
      <tr>
        <td><strong>${b.concept}</strong><br><small style="color:#64748b">${b.legalNotes}</small></td>
        <td class="num">${b.bankAmountVES > 0 ? `Bs. ${b.bankAmountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
        <td>${b.nature}</td>
        <td class="num">${b.impactOnIncomeStatement > 0 ? `Bs. ${b.impactOnIncomeStatement.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '0,00'}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Expediente:</strong> AUD-BAN-2026-ONI-094</p>
      <h2>CONCILIACIÓN TÉCNICA Y CONTABLE &ndash; EXTRACTO BANESCO VS ESTADOS FINANCIEROS (CORTE 31/08/2026)</h2>
      <div class="highlight-box">
        <strong>Aclaratoria Jurídico-Contable sobre Depósitos vs Ingresos:</strong><br>
        Total Depósitos en Cuenta Corriente BBU: <strong>Bs. ${BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.bankDepositsTotalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong>.<br>
        Ingresos Fiscales Declarados en Estado de Resultados: <strong>Bs. ${BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.financialStatementRevenuesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong>.
      </div>
      <table>
        <thead>
          <tr>
            <th>Concepto de Movimiento</th>
            <th class="num">Monto Banesco (Bs.)</th>
            <th>Naturaleza Jurídico-Contable</th>
            <th class="num">Impacto en EEFF (Bs.)</th>
          </tr>
        </thead>
        <tbody>
          ${breakdownRows}
          <tr style="background-color:#0f172a;color:#ffffff;font-weight:bold">
            <td style="color:#ffffff">TOTAL INGRESOS AUDITADOS EN ESTADO DE RESULTADOS</td>
            <td colspan="2" style="color:#ffffff">—</td>
            <td class="num" style="color:#ffffff">Bs. ${BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.financialStatementRevenuesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top:16pt"><strong>Conclusión Oficial:</strong> ${BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.conclusion}</p>
    `;

    await exportHtmlToPdf('Conciliacion_Tecnica_Banesco_vs_EEFF_2026.pdf', 'Conciliación Técnica Banesco vs EEFF 2026', htmlContent);
  };

  const handleExportBalanceSheetWord = () => {
    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; R.N.C.: 010049247</p>
      <h2>ESTADO DE SITUACIÓN FINANCIERA COMPARATIVO (VEN-NIF)</h2>
      <p>Al 31 de Diciembre de 2025 (Tasa 301,37) y al 31 de Agosto de 2026 (Tasa 794,99)</p>
      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th class="num">31/12/2025 (Bs.)</th>
            <th class="num">31/12/2025 (US$)</th>
            <th class="num">31/08/2026 (Bs.)</th>
            <th class="num">31/08/2026 (US$)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colspan="5"><strong>ACTIVO CORRIENTE</strong></td></tr>
          <tr><td>Efectivo en Caja y Bancos</td><td class="num">${BALANCE_SHEET_2025.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.cashAndBanks/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Cuentas por Cobrar Manuel Becerra</td><td class="num">—</td><td class="num">—</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Total Activo Corriente</td><td class="num">${BALANCE_SHEET_2025.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.totalCurrent/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="font-weight:bold"><td style="color:#0f172a">TOTAL ACTIVO</td><td class="num">${BALANCE_SHEET_2025.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.totalAssets/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.totalAssets/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td colspan="5"><strong>PASIVO CORRIENTE</strong></td></tr>
          <tr><td>Cuentas por Pagar Socios / Anticipos</td><td class="num">—</td><td class="num">—</td><td class="num">${BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="font-weight:bold"><td style="color:#0f172a">TOTAL PASIVO Y PATRIMONIO</td><td class="num">${BALANCE_SHEET_2025.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.totalLiabilitiesAndEquity/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
        </tbody>
      </table>
    `;
    exportToWord('Balance_General_Comparativo_2025_2026_Agricola_Oni.doc', 'Balance General Comparativo VEN-NIF 2025-2026', htmlContent);
  };

  const handleExportBalanceSheetPdf = async () => {
    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; R.N.C.: 010049247</p>
      <h2>ESTADO DE SITUACIÓN FINANCIERA COMPARATIVO (VEN-NIF)</h2>
      <p>Al 31 de Diciembre de 2025 (Tasa 301,37) y al 31 de Agosto de 2026 (Tasa 794,99)</p>
      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th class="num">31/12/2025 (Bs.)</th>
            <th class="num">31/12/2025 (US$)</th>
            <th class="num">31/08/2026 (Bs.)</th>
            <th class="num">31/08/2026 (US$)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colspan="5"><strong>ACTIVO CORRIENTE</strong></td></tr>
          <tr><td>Efectivo en Caja y Bancos</td><td class="num">${BALANCE_SHEET_2025.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.cashAndBanks/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Cuentas por Cobrar Manuel Becerra</td><td class="num">—</td><td class="num">—</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Total Activo Corriente</td><td class="num">${BALANCE_SHEET_2025.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.totalCurrent/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="font-weight:bold"><td style="color:#0f172a">TOTAL ACTIVO</td><td class="num">${BALANCE_SHEET_2025.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.totalAssets/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.totalAssets/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td colspan="5"><strong>PASIVO CORRIENTE</strong></td></tr>
          <tr><td>Cuentas por Pagar Socios / Anticipos</td><td class="num">—</td><td class="num">—</td><td class="num">${BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="font-weight:bold"><td style="color:#0f172a">TOTAL PASIVO Y PATRIMONIO</td><td class="num">${BALANCE_SHEET_2025.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.totalLiabilitiesAndEquity/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
        </tbody>
      </table>
    `;
    await exportHtmlToPdf('Balance_General_Comparativo_2025_2026_Agricola_Oni.pdf', 'Balance General Comparativo VEN-NIF 2025-2026', htmlContent);
  };

  const handleExportIncomeStatementWord = () => {
    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; R.N.C.: 010049247</p>
      <h2>ESTADO DE RESULTADO INTEGRAL COMPARATIVO (VEN-NIF)</h2>
      <p>Ejercicio 2025 cerrado vs Corte de 8 meses al 31 de agosto de 2026</p>
      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th class="num">Año 2025 (Bs.)</th>
            <th class="num">Año 2025 (US$)</th>
            <th class="num">Ene-Ago 2026 (Bs.)</th>
            <th class="num">Ene-Ago 2026 (US$)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colspan="5"><strong>INGRESOS OPERACIONALES Y FINANCIEROS</strong></td></tr>
          <tr><td>Ingresos por Servicios Agrícolas</td><td class="num">${INCOME_STATEMENT_2025.revenues.agriculturalServices.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_2025.revenues.agriculturalServices/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${INCOME_STATEMENT_AUGUST_2026.revenues.agriculturalServices.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_AUGUST_2026.revenues.agriculturalServices/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Ingresos por Intereses (Manuel Becerra)</td><td class="num">—</td><td class="num">—</td><td class="num">${INCOME_STATEMENT_AUGUST_2026.revenues.interestIncome.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_AUGUST_2026.revenues.interestIncome/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="font-weight:bold"><td style="color:#0f172a">TOTAL INGRESOS</td><td class="num">${INCOME_STATEMENT_2025.revenues.totalRevenues.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_2025.revenues.totalRevenues/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${INCOME_STATEMENT_AUGUST_2026.revenues.totalRevenues.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_AUGUST_2026.revenues.totalRevenues/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td colspan="5"><strong>COSTO DE SERVICIOS Y OPERACIÓN</strong></td></tr>
          <tr><td>Costo de Servicios Prestados</td><td class="num">${INCOME_STATEMENT_2025.costs.serviceCosts.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_2025.costs.serviceCosts/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${INCOME_STATEMENT_AUGUST_2026.costs.serviceCosts.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_AUGUST_2026.costs.serviceCosts/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="font-weight:bold"><td style="color:#0f172a">UTILIDAD DEL EJERCICIO</td><td class="num">${INCOME_STATEMENT_2025.taxesAndReserves.netProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_2025.taxesAndReserves.netProfit/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${INCOME_STATEMENT_AUGUST_2026.taxesAndReserves.netProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_AUGUST_2026.taxesAndReserves.netProfit/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
        </tbody>
      </table>
    `;
    exportToWord('Estado_Resultados_Auditado_2025_2026_Agricola_Oni.doc', 'Estado de Resultados Comparativo 2025-2026', htmlContent);
  };

  const handleExportIncomeStatementPdf = async () => {
    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; R.N.C.: 010049247</p>
      <h2>ESTADO DE RESULTADO INTEGRAL COMPARATIVO (VEN-NIF)</h2>
      <p>Ejercicio 2025 cerrado vs Corte de 8 meses al 31 de agosto de 2026</p>
      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th class="num">Año 2025 (Bs.)</th>
            <th class="num">Año 2025 (US$)</th>
            <th class="num">Ene-Ago 2026 (Bs.)</th>
            <th class="num">Ene-Ago 2026 (US$)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colspan="5"><strong>INGRESOS OPERACIONALES Y FINANCIEROS</strong></td></tr>
          <tr><td>Ingresos por Servicios Agrícolas</td><td class="num">${INCOME_STATEMENT_2025.revenues.agriculturalServices.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_2025.revenues.agriculturalServices/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${INCOME_STATEMENT_AUGUST_2026.revenues.agriculturalServices.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_AUGUST_2026.revenues.agriculturalServices/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Ingresos por Intereses (Manuel Becerra)</td><td class="num">—</td><td class="num">—</td><td class="num">${INCOME_STATEMENT_AUGUST_2026.revenues.interestIncome.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_AUGUST_2026.revenues.interestIncome/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="font-weight:bold"><td style="color:#0f172a">TOTAL INGRESOS</td><td class="num">${INCOME_STATEMENT_2025.revenues.totalRevenues.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_2025.revenues.totalRevenues/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${INCOME_STATEMENT_AUGUST_2026.revenues.totalRevenues.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_AUGUST_2026.revenues.totalRevenues/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="font-weight:bold"><td style="color:#0f172a">UTILIDAD DEL EJERCICIO</td><td class="num">${INCOME_STATEMENT_2025.taxesAndReserves.netProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_2025.taxesAndReserves.netProfit/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${INCOME_STATEMENT_AUGUST_2026.taxesAndReserves.netProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(INCOME_STATEMENT_AUGUST_2026.taxesAndReserves.netProfit/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
        </tbody>
      </table>
    `;
    await exportHtmlToPdf('Estado_Resultados_Auditado_2025_2026_Agricola_Oni.pdf', 'Estado de Resultados Comparativo 2025-2026', htmlContent);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-950 text-amber-400 border border-amber-800 rounded">
                <Scale className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Respuestas a Banesco / SENIAT: Cuadre Oficial de Abonos & EEFF 2026
              </h2>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              {company.name} &middot; RIF <span className="font-mono text-amber-400">{company.rif}</span> &middot; Expediente Banesco AUD-BAN-2026-ONI-094
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={() => {
                if (activeTab === 'MANUEL_BECERRA') {
                  handleExportBecerraCsv();
                } else if (activeTab === 'CONCILIACION_BANCO') {
                  handleExportConciliacionCsv();
                } else if (activeTab === 'EEFF_COMPARATIVO') {
                  handleExportBalanceSheetExcel();
                } else if (activeTab === 'ESTADO_RESULTADOS') {
                  handleExportIncomeStatementExcel();
                } else {
                  handleExportTable1Csv();
                }
              }}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
              title="Descargar hoja de cálculo oficial en Microsoft Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Descargar Excel (.xlsx)
            </button>
            <button
              onClick={() => {
                if (activeTab === 'CARTA_BANCO_OFICIAL') {
                  const letterHtml = document.getElementById('carta-banesco-doc-container')?.innerHTML;
                  if (letterHtml) {
                    exportToWord('Carta_Explicativa_Banesco_Agricola_Oni_2026.doc', 'Carta Explicativa Banesco - Agrícola Oni C.A.', letterHtml);
                  }
                } else if (activeTab === 'MANUEL_BECERRA') {
                  handleExportBecerraWord();
                } else if (activeTab === 'CONCILIACION_BANCO') {
                  handleExportConciliacionWord();
                } else if (activeTab === 'EEFF_COMPARATIVO') {
                  handleExportBalanceSheetWord();
                } else if (activeTab === 'ESTADO_RESULTADOS') {
                  handleExportIncomeStatementWord();
                } else {
                  handleExportTable1Word();
                }
              }}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
              title="Descargar documento editable en formato Microsoft Word (.doc)"
            >
              <FileDown className="w-3.5 h-3.5" />
              Descargar Word (.doc)
            </button>
            <button
              onClick={async () => {
                if (activeTab === 'CARTA_BANCO_OFICIAL') {
                  const letterEl = document.getElementById('carta-banesco-doc-container');
                  if (letterEl) {
                    await downloadElementAsPdf(letterEl, 'Carta_Explicativa_Oficial_Banesco_Agricola_Oni_2026.pdf');
                  } else {
                    exportToPdfPrint();
                  }
                } else if (activeTab === 'MANUEL_BECERRA') {
                  await handleExportBecerraPdf();
                } else if (activeTab === 'CONCILIACION_BANCO') {
                  await handleExportConciliacionPdf();
                } else if (activeTab === 'EEFF_COMPARATIVO') {
                  await handleExportBalanceSheetPdf();
                } else if (activeTab === 'ESTADO_RESULTADOS') {
                  await handleExportIncomeStatementPdf();
                } else {
                  await handleExportTable1Pdf();
                }
              }}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
              title="Descargar archivo PDF directo"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar PDF
            </button>
            <button
              onClick={() => exportToPdfPrint()}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded text-xs font-medium transition-colors flex items-center gap-1 shadow"
              title="Imprimir documento físico (Ctrl+P)"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 font-mono-num">
          <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-lg">
            <span className="text-[11px] font-sans font-medium text-stone-400 block">Créditos Movilizados en BBU</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">
              Bs. {BANESCO_OFFICIAL_LETTER_2026.bankCreditsTotalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-stone-400 font-sans">
              ${BANESCO_OFFICIAL_LETTER_2026.bankCreditsAverageUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD prom.
            </span>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-lg">
            <span className="text-[11px] font-sans font-medium text-stone-400 block">Ventas Declaradas en EEFF</span>
            <span className="text-lg font-bold text-white mt-1 block">
              Bs. {BANESCO_OFFICIAL_LETTER_2026.reportedRevenuesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-stone-400 font-sans">
              ${BANESCO_OFFICIAL_LETTER_2026.reportedRevenuesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </span>
          </div>

          <div className="bg-stone-950/80 border border-amber-900/60 p-4 rounded-lg bg-amber-950/10">
            <span className="text-[11px] font-sans font-medium text-amber-300 block">Anticipos Ventas Café (NIIF 15)</span>
            <span className="text-lg font-bold text-amber-400 mt-1 block">
              Bs. {(528578549.25 + 1013438543.38).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-stone-400 font-sans">
              78.4% del banco &middot; Factura en Octubre
            </span>
          </div>

          <div className="bg-stone-950/80 border border-emerald-900/60 p-4 rounded-lg bg-emerald-950/20">
            <span className="text-[11px] font-sans font-medium text-emerald-300 block">Ctas x Cobrar Manuel Becerra</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">
              Bs. {BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-stone-400 font-sans">
              Línea Bs. 600M &middot; Saldo Cuadrado
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 border-t border-stone-800 mt-5 no-print text-xs">
          <button
            onClick={() => setActiveTab('TABLA_ORIGEN_MES')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'TABLA_ORIGEN_MES'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>1. Composición de Abonos por Origen (Ene - Ago 2026)</span>
          </button>

          <button
            onClick={() => setActiveTab('CARTA_BANCO_OFICIAL')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'CARTA_BANCO_OFICIAL'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>2. Carta Explicativa a Banesco / SENIAT (Firmada)</span>
          </button>

          <button
            onClick={() => setActiveTab('MANUEL_BECERRA')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'MANUEL_BECERRA'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>3. Contrato Mutuo Manuel Becerra (47 Movs)</span>
          </button>

          <button
            onClick={() => setActiveTab('CONCILIACION_BANCO')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'CONCILIACION_BANCO'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Conciliación Técnica: Banesco vs Ingresos EEFF</span>
          </button>

          <button
            onClick={() => setActiveTab('EEFF_COMPARATIVO')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'EEFF_COMPARATIVO'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>5. Balance General (2025 vs 2026)</span>
          </button>

          <button
            onClick={() => setActiveTab('ESTADO_RESULTADOS')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ESTADO_RESULTADOS'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>6. Estado de Resultados (2025 vs 2026)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COMPOSICIÓN DE ABONOS POR ORIGEN Y MES (BS) - LA TABLA EXACTA */}
      {/* ========================================================================= */}
      {activeTab === 'TABLA_ORIGEN_MES' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-amber-500" />
                  Composición Oficial de Abonos por Origen y Mes (Bs) &ndash; Enero a Agosto 2026
                </h3>
                <p className="text-xs text-stone-400 mt-1 max-w-3xl leading-relaxed">
                  Cuadro oficial de depósitos bancarios Banesco (Cuenta Corriente N° 0134-0342-18-3421089912). Se identifica detalladamente cada origen de fondos para desvirtuar la observación de la Unidad de Cumplimiento.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-end gap-3 shrink-0">
                <div className="flex items-center gap-1.5 no-print">
                  <button
                    onClick={handleExportTable1Word}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow"
                    title="Exportar esta tabla completa a Microsoft Word"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Word (.doc)
                  </button>
                  <button
                    onClick={handleExportTable1Csv}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow"
                    title="Exportar a CSV compatible con Excel"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Excel (CSV)
                  </button>
                  <button
                    onClick={handleExportTable1Pdf}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1 shadow"
                    title="Descargar tabla oficial en archivo PDF directo"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                  <button
                    onClick={() => exportToPdfPrint()}
                    className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded text-xs transition-colors shadow"
                    title="Imprimir (Ctrl+P)"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 text-right font-mono-num">
                  <span className="text-[10px] text-stone-400 block font-sans">Total Fondos Movilizados:</span>
                  <span className="text-lg font-bold text-emerald-400 block">
                    Bs. {BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-stone-300 block">
                    ${BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Aclaratoria sobre el renglón amarillo (51.5%) */}
            <div className="bg-amber-950/30 border border-amber-600/60 p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Actualización Clave: Identificación Total del Renglón Amarillo (51.5%)</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                El renglón que anteriormente figuraba como <strong className="text-amber-300 font-mono">«Banesco sin identificar (TRANS,CTAS)»</strong> por <strong>Bs. 1.013.438.543,38 (51.5% del total)</strong> ha sido completamente verificado y clasificado: corresponde a <strong>ANTICIPOS EN VENTAS DE CLIENTES TORREFACTORES INDUSTRIALES</strong> mediante transferencias internas entre cuentas Banesco. Junto al renglón de Terceros con RIF (Bs. 528,58M &middot; 26.9%), suman <strong>Bs. 1.542,02 millones (78.4%)</strong> de anticipos para compra e intermediación de café en Venezuela a tasa BCV bajo la norma <strong>NIIF 15</strong>, cuyo café se entrega y factura en <strong>Octubre de 2026</strong>.
              </p>
            </div>

            {/* Tabla Completa con los 8 Meses */}
            <div className="overflow-x-auto border border-stone-800 rounded-lg">
              <table className="w-full text-xs text-left text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-mono">
                  <tr>
                    <th className="px-3 py-2.5">Origen</th>
                    <th className="px-2.5 py-2.5 text-right">Ene</th>
                    <th className="px-2.5 py-2.5 text-right">Feb</th>
                    <th className="px-2.5 py-2.5 text-right">Mar</th>
                    <th className="px-2.5 py-2.5 text-right">Abr</th>
                    <th className="px-2.5 py-2.5 text-right">May</th>
                    <th className="px-2.5 py-2.5 text-right">Jun</th>
                    <th className="px-2.5 py-2.5 text-right">Jul</th>
                    <th className="px-2.5 py-2.5 text-right">Ago</th>
                    <th className="px-3 py-2.5 text-right text-white">Total Bs</th>
                    <th className="px-2.5 py-2.5 text-right text-amber-400">% Total</th>
                    <th className="px-3 py-2.5 text-right text-emerald-400">Total US$</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono-num">
                  {BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.rows.map((row) => {
                    const isYellowRow = row.id === 'ORIG-06';
                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors ${
                          isYellowRow
                            ? 'bg-amber-950/40 font-bold border-y-2 border-amber-600/80 hover:bg-amber-900/30'
                            : 'hover:bg-stone-800/40'
                        }`}
                      >
                        <td className="px-3 py-2.5 font-sans">
                          <span className={`block font-semibold ${isYellowRow ? 'text-amber-300 text-xs' : 'text-stone-100'}`}>
                            {row.origen}
                          </span>
                          <span className="text-[10px] text-stone-400 block font-normal mt-0.5">{row.legalClassification}</span>
                        </td>
                        <td className="px-2.5 py-2.5 text-right text-stone-400">{row.ene > 0 ? row.ene.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-stone-400">{row.feb > 0 ? row.feb.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-stone-400">{row.mar > 0 ? row.mar.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-stone-400">{row.abr > 0 ? row.abr.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-stone-400">{row.may > 0 ? row.may.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-stone-300">{row.jun > 0 ? row.jun.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-stone-300">{row.jul > 0 ? row.jul.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-stone-300">{row.ago > 0 ? row.ago.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-3 py-2.5 text-right font-bold text-white whitespace-nowrap">
                          {row.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-2.5 py-2.5 text-right font-bold text-amber-400 whitespace-nowrap">
                          {row.pctDelTotal.toFixed(1)}%
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-emerald-400 whitespace-nowrap">
                          ${row.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-stone-950 border-t-2 border-stone-700 font-mono-num font-bold text-xs text-white">
                  <tr>
                    <td className="px-3 py-3 uppercase font-sans">TOTAL</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.ene.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.feb.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.mar.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.abr.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.may.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.jun.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.jul.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.ago.toLocaleString('es-VE')}</td>
                    <td className="px-3 py-3 text-right text-emerald-400">
                      Bs. {BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-2.5 py-3 text-right text-amber-400">100.0%</td>
                    <td className="px-3 py-3 text-right text-emerald-400">
                      ${BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CARTA EXPLICATIVA OFICIAL FIRMADA A BANESCO / SENIAT */}
      {/* ========================================================================= */}
      {activeTab === 'CARTA_BANCO_OFICIAL' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-4 rounded-xl no-print">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Carta Explicativa Formal Firmada (Respuesta al Oficio de Banesco)
              </h3>
              <p className="text-xs text-stone-400">
                Lista para consignar ante la Unidad de Prevención LC/FT de Banesco y la Gerencia de Fiscalización del SENIAT.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  const letterElement = document.getElementById('carta-banesco-doc-container');
                  if (letterElement) {
                    exportToWord('Carta_Explicativa_Banesco_Agricola_Oni_2026.doc', 'Carta Explicativa Oficial - Banesco Banco Universal', letterElement.innerHTML);
                  }
                }}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow"
                title="Descargar carta oficial en formato Microsoft Word editable (.doc)"
              >
                <FileDown className="w-3.5 h-3.5" />
                Descargar en Word (.doc)
              </button>
              <button
                onClick={handleCopyLetter}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs font-semibold flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado al Portapapeles' : 'Copiar Texto Oficial'}
              </button>
              <button
                onClick={async () => {
                  const letterElement = document.getElementById('carta-banesco-doc-container');
                  if (letterElement) {
                    await downloadElementAsPdf(letterElement, 'Carta_Explicativa_Oficial_Banesco_Agricola_Oni_2026.pdf');
                  }
                }}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs flex items-center gap-1.5 shadow"
                title="Descargar carta oficial en archivo PDF directo"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar PDF
              </button>
              <button
                onClick={() => exportToPdfPrint()}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded text-xs font-semibold flex items-center gap-1 shadow"
                title="Imprimir (Ctrl+P)"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir
              </button>
            </div>
          </div>

          {/* Official Letter Paper */}
          <div id="carta-banesco-doc-container" className="bg-white text-stone-900 rounded-xl shadow-2xl p-8 sm:p-12 max-w-4xl mx-auto border border-stone-200 text-xs leading-relaxed font-sans print:shadow-none print:border-none print:p-0 print:m-0">
            {/* Header */}
            <div className="border-b-2 border-stone-900 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-xl font-bold font-serif-doc tracking-tight text-stone-950 uppercase">{company.name}</h1>
                <p className="text-[10px] font-bold text-stone-700 tracking-wider">RIF: {company.rif} &middot; {company.registroMercantil}</p>
                <p className="text-[9.5px] text-stone-600">{company.address}</p>
                <p className="text-[9.5px] text-stone-600">Contacto: {company.phone} &middot; {company.email}</p>
              </div>

              <div className="text-right font-mono text-[10px] border-l-2 border-amber-600 pl-3">
                <p className="font-bold text-stone-950">OFICIO N° AO-EXP-BAN-2026-0831</p>
                <p className="text-stone-600">EXPEDIENTE: AUD-BAN-2026-ONI-094</p>
                <p className="text-stone-800 mt-1 font-semibold">Acarigua, 31 de Agosto de 2026</p>
              </div>
            </div>

            {/* Recipient */}
            <div className="mb-4 space-y-0.5">
              <p className="font-bold text-stone-950">CIUDADANOS:</p>
              <p className="font-bold text-stone-900">BANESCO BANCO UNIVERSAL, C.A.</p>
              <p className="text-stone-700">Unidad de Prevención y Control de Legitimación de Capitales (UPCLC/FT) / Auditoría Interna</p>
              <p className="text-stone-700">Atención: Lcdo. Roberto Albarrán &mdash; Gerente Senior de Cumplimiento</p>
              <p className="text-stone-700 font-bold pt-1">
                ASUNTO: JUSTIFICACIÓN DOCUMENTADA DE LA DISPARIDAD ENTRE VENTAS REPORTADAS EN EEFF (BS. 92.641.520,01) Y FONDOS MOVILIZADOS EN CUENTA CORRIENTE (USD 2.781.830,18 / BS. 1.966.597.105,35) &ndash; PERÍODO ENERO A AGOSTO 2026
              </p>
            </div>

            {/* Body */}
            <div className="space-y-3 text-justify text-stone-800">
              <p>
                Nos dirigimos formalmente a ustedes en la oportunidad de dar respuesta puntual y documentada a su requerimiento de información, mediante el cual solicitan justificar la diferencia entre las ventas reportadas en los Estados Financieros al 31 de agosto de 2026 (<strong>Bs. 92.641.520,01 / USD 116.531,68</strong>) y el total de créditos movilizados en la cuenta corriente BBU N° <strong className="font-mono">{company.banescoAccountVES}</strong> (<strong>USD 2.781.830,18 en promedio / Bs. 1.966.597.105,35 acumulados</strong>).
              </p>

              <p>
                Al respecto, certificamos bajo fe de juramento que <strong>AGRÍCOLA ONI C.A. opera como empresa INTERMEDIARIA COMERCIAL</strong> (no como productora agrícola primaria ni importadora). La empresa compra todo el café en Venezuela a empresas, asociaciones y productores nacionales, actuando como intermediaria entre personas naturales y jurídicas, las cuales le otorgan anticipos en bolívares calculados a tasa oficial BCV para que la empresa gestione en el mercado nacional la compra y acopio del grano, sustituyendo estos anticipos en el mes de octubre por facturas fiscales de venta definitivas.
              </p>

              {/* Justificación Cuadre Numérico */}
              <div className="bg-stone-50 border border-stone-300 rounded p-3 space-y-2">
                <p className="font-bold text-stone-950">
                  DESGLOSE TÉCNICO Y CUADRE MATEMÁTICO DE LOS FONDOS MOVILIZADOS (BS. 1.966.597.105,35):
                </p>

                <div className="space-y-1.5 pl-2 text-[11px]">
                  <div>
                    <strong>1. Anticipos en Ventas de Clientes (NIIF 15) &mdash; Bs. 1.542.017.092,63 (78,4%):</strong>
                    <br />
                    Corresponde a la suma de <em>Terceros con RIF</em> (Bs. 528.578.549,25) y <em>Transferencias entre cuentas de clientes torrefactores en Banesco</em> (Bs. 1.013.438.543,38). Bajo la norma internacional VEN-NIF (NIIF 15), estos recursos constituyen <strong>PASIVO CORRIENTE (Anticipos Recibidos)</strong> y NO son ingresos devengados del período. La entrega física del grano importado y la emisión de facturas definitivas con IVA se ejecuta formalmente a partir de <strong>OCTUBRE DE 2026</strong>.
                  </div>

                  <div>
                    <strong>2. Reintegros de Capital &ndash; Contrato Mutuo Manuel Becerra &mdash; Bs. 186.376.000,00 (9,5%):</strong>
                    <br />
                    Amortizaciones de capital recibidas en cuenta corriente derivadas del <em>Contrato de Préstamo Mutuo y Línea de Crédito Rotativa</em> (límite Bs. 600.000.000,00) suscrito con el socio Manuel Becerra. Estas transferencias disminuyen la cuenta de activo <em>Cuentas por Cobrar Manuel Becerra</em> (saldo en balance: Bs. 325.948.652,96, que incluye Bs. 13.924.047,66 de intereses ganados). NO constituyen venta comercial.
                  </div>

                  <div>
                    <strong>3. Transferencias entre Cuentas Propias de Agrícola Oni C.A. &mdash; Bs. 208.708.057,73 (10,6%):</strong>
                    <br />
                    Movilizaciones internas de tesorería desde cuentas propias de la empresa en Banco Provincial (0108), Mercantil (0105), Banco Plaza (0138) y Bancamiga (0172). Su impacto patrimonial es Bs. 0,00 y no representan ingresos de terceros.
                  </div>

                  <div>
                    <strong>4. Aportes Operativos de Personas Naturales &mdash; Bs. 29.495.954,99 (1,5%):</strong>
                    <br />
                    Integrados por el titular recurrente V-023997829 (Bs. 7.649.975,00) y 14 personas naturales (Bs. 21.845.979,99) por reservas menores y suministros de campo.
                  </div>

                  <div>
                    <strong>5. Ventas y Servicios Agrícolas Reales Devengados &mdash; Bs. 92.641.520,01:</strong>
                    <br />
                    Ingresos por servicios agrícolas realizados y facturados (Bs. 78.717.472,35) más ingresos por intereses del mutuo Becerra (Bs. 13.924.047,66), exactamente idénticos a los declarados en el Estado de Resultados.
                  </div>
                </div>
              </div>

              {/* Soportes Anexos Entregados */}
              <div className="pt-2">
                <p className="font-bold text-stone-950 mb-1">RECAUDOS Y SOPORTES DOCUMENTALES CONSIGNADOS:</p>
                <ol className="list-decimal pl-5 space-y-0.5 text-[11px] text-stone-700">
                  <li>Copia del <strong>Contrato de Préstamo Mutuo y Línea de Crédito Rotativa de Bs. 600.000.000,00</strong> suscrito con el socio Manuel Becerra y relación de 47 movimientos.</li>
                  <li>Contratos de intermediación y compra de café nacional con clientes torrefactores (ETN C.A., Distribuidora DIS, Grupo ORU, Comercializadora RIK, Inversiones Solbtr, Corp. Agroindustrial J).</li>
                  <li>Comprobantes oficiales de compra de divisas a Banesco Mesa de Cambio (Total USD 556.890,45 / Bs. 375.630.000,00) destinadas a adquisición de repuestos, maquinaria agroindustrial y logística en Venezuela.</li>
                  <li>Guías Únicas de Movilización y Acopio SICA / CVC, pesajes de romana y contratos a futuro con asociaciones cafetaleras venezolanas.</li>
                  <li>Estados de Situación Financiera al 31/12/2025 y al 31/08/2026 debidamente auditados y dictaminados por Contador Público Colegiado bajo VEN-NIF.</li>
                </ol>
              </div>

              <p className="pt-1">
                Con la presente exposición y soportes anexos, queda plenamente justificada la correlación entre los flujos bancarios y la contabilidad fiscal de la empresa, desvirtuando cualquier presunción de irregularidad o evasión ante Banesco y el SENIAT.
              </p>
            </div>

            {/* Firmas Oficiales */}
            <div className="mt-8 pt-6 border-t border-stone-400 grid grid-cols-2 gap-8 items-end">
              <div>
                <div className="h-10 flex items-center">
                  <span className="font-serif italic text-amber-900 text-xs border-b border-stone-700 px-4">
                    Omar Pérez C. &mdash; Presidente / Rep. Legal
                  </span>
                </div>
                <p className="font-bold text-stone-950 mt-1">{company.legalRepresentative}</p>
                <p className="text-[10px] text-stone-600">C.I.: {company.idNumber}</p>
                <p className="text-[10px] text-stone-700 font-semibold">{company.name}</p>
              </div>

              <div className="text-right">
                <div className="h-10 flex items-center justify-end">
                  <span className="font-mono text-emerald-800 text-[10px] border-b border-stone-700 px-4">
                    Lcda. Carmen Rivas &middot; Matrícula CPC 41.802
                  </span>
                </div>
                <p className="font-bold text-stone-950 mt-1">Lcda. Carmen Rivas</p>
                <p className="text-[10px] text-stone-600">Contador Público Colegiado Nro. 41.802</p>
                <p className="text-[10px] text-stone-700 font-semibold">Auditor Externo Independiente</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CONTRATO MUTUO MANUEL BECERRA (47 MOVIMIENTOS) */}
      {/* ========================================================================= */}
      {activeTab === 'MANUEL_BECERRA' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-sm uppercase tracking-wide font-mono">
                    EXPEDIENTE MUTUO 2026
                  </span>
                  <span className="bg-stone-800 text-amber-400 text-[10px] px-2 py-0.5 rounded font-mono">
                    Límite Aprobado: Bs. 600.000.000,00
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Movimientos Bancarios Banesco: Contrato de Préstamo Mutuo &ndash; Manuel Becerra
                </h3>
                <p className="text-xs text-stone-400 mt-1 max-w-3xl leading-relaxed">
                  Manuel Becerra es socio en una empresa vinculada. Se suscribió un <strong>Contrato de Préstamo Mutuo y Línea de Crédito Rotativa</strong> por hasta Bs. 600.000.000,00. Al corte del 31 de agosto de 2026, ya ha reembolsado un porcentaje de los desembolsos recibidos.
                </p>
              </div>

              <div className="bg-stone-950 p-4 rounded-lg border border-stone-800 text-right shrink-0 font-mono-num">
                <span className="text-[10px] text-stone-400 block font-sans">Saldo Total por Cobrar en Balance:</span>
                <span className="text-xl font-bold text-amber-400 block">
                  Bs. {MANUEL_BECERRA_SUMMARY_2026.totalReceivableAugust31VES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-stone-300 block">
                  ${MANUEL_BECERRA_SUMMARY_2026.totalReceivableUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD (BCV 794,99)
                </span>
              </div>
            </div>

            {/* Cuadro de Cuadre Matemático del Mutuo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono-num">
              <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-sans">Total Desembolsado (Egresos)</span>
                <span className="text-base font-bold text-amber-400 block mt-0.5">
                  Bs. {MANUEL_BECERRA_SUMMARY_2026.totalDisbursedVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-stone-500 font-sans">33 Transferencias prestadas</span>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-sans">Total Amortizado (Ingresos)</span>
                <span className="text-base font-bold text-emerald-400 block mt-0.5">
                  Bs. {MANUEL_BECERRA_SUMMARY_2026.totalRepaidVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-emerald-500/80 font-sans">
                  {MANUEL_BECERRA_SUMMARY_2026.percentagePaidPct.toFixed(2)}% del capital reembolsado
                </span>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-sans">Saldo Capital Restante</span>
                <span className="text-base font-bold text-white block mt-0.5">
                  Bs. {MANUEL_BECERRA_SUMMARY_2026.principalBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-stone-400 font-sans">Capital exigible pendiente</span>
              </div>

              <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800">
                <span className="text-[10px] text-stone-400 block font-sans">Intereses Ganados (EEFF)</span>
                <span className="text-base font-bold text-emerald-400 block mt-0.5">
                  Bs. {MANUEL_BECERRA_SUMMARY_2026.interestIncomeVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-stone-400 font-sans">Registrado en Estado Resultados</span>
              </div>
            </div>

            {/* Filtros de la Tabla */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar por referencia Banesco o fecha..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded pl-9 pr-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 no-print">
                  <button
                    onClick={handleExportBecerraWord}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow"
                    title="Exportar movimientos del Contrato Mutuo a Word"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Word (.doc)
                  </button>
                  <button
                    onClick={handleExportBecerraCsv}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow"
                    title="Exportar movimientos a Excel (CSV)"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Excel (CSV)
                  </button>
                  <button
                    onClick={handleExportBecerraPdf}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1 shadow"
                    title="Descargar movimientos en archivo PDF directo"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                  <button
                    onClick={() => exportToPdfPrint()}
                    className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded text-xs transition-colors shadow"
                    title="Imprimir (Ctrl+P)"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-stone-400" />
                  <select
                    value={becerraFilter}
                    onChange={(e) => setBecerraFilter(e.target.value as any)}
                    className="bg-stone-950 border border-stone-700 text-stone-300 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                  >
                    <option value="TODOS">Todos los Movimientos (47)</option>
                    <option value="EGRESOS">Egresos / Préstamos Otorgados (33)</option>
                    <option value="INGRESOS">Ingresos / Pagos Recibidos (14)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabla Completa de los 47 Movimientos */}
            <div className="overflow-x-auto border border-stone-800 rounded-lg">
              <table className="w-full text-xs text-left text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-mono">
                  <tr>
                    <th className="px-3 py-2.5 text-center">#</th>
                    <th className="px-3 py-2.5">Fecha</th>
                    <th className="px-3 py-2.5">Referencia Banesco</th>
                    <th className="px-3 py-2.5">Banco / Descripción</th>
                    <th className="px-3 py-2.5 text-right text-amber-400">Egresos (Préstamo)</th>
                    <th className="px-3 py-2.5 text-right text-emerald-400">Ingresos (Pagos de Becerra)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono-num">
                  {filteredBecerraMovements.map((mov) => (
                    <tr key={mov.item} className="hover:bg-stone-800/40 transition-colors">
                      <td className="px-3 py-2 text-center text-stone-500">{mov.item}</td>
                      <td className="px-3 py-2 text-stone-300 whitespace-nowrap">{mov.date}</td>
                      <td className="px-3 py-2 font-mono font-semibold text-amber-400 whitespace-nowrap">{mov.reference}</td>
                      <td className="px-3 py-2 font-sans text-stone-300 text-[11px] truncate max-w-xs">{mov.description}</td>
                      <td className="px-3 py-2 text-right text-amber-300 font-medium whitespace-nowrap">
                        {mov.outflowVES > 0 ? `Bs. ${mov.outflowVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                      <td className="px-3 py-2 text-right text-emerald-400 font-bold whitespace-nowrap">
                        {mov.inflowVES > 0 ? `Bs. ${mov.inflowVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-stone-950 border-t-2 border-stone-800 font-mono-num font-bold text-xs">
                  <tr>
                    <td colSpan={4} className="px-3 py-2.5 text-right text-white uppercase font-sans">
                      Totales de la Operación Mutuo 2026:
                    </td>
                    <td className="px-3 py-2.5 text-right text-amber-400">
                      Bs. {MANUEL_BECERRA_SUMMARY_2026.totalDisbursedVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2.5 text-right text-emerald-400">
                      Bs. {MANUEL_BECERRA_SUMMARY_2026.totalRepaidVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CONCILIACIÓN TÉCNICA BANESCO VS ESTADOS FINANCIEROS */}
      {/* ========================================================================= */}
      {activeTab === 'CONCILIACION_BANCO' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4">
            <div className="border-b border-stone-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-red-950 text-red-400 border border-red-800 rounded">
                    <AlertCircle className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Respuesta Técnica a la Carta de Banesco: Discrepancia de Ingresos vs Depósitos
                  </h3>
                </div>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  El Banco Banesco envió una comunicación observando que los <strong>depósitos bancarios (Bs. 1.966.597.105,35 / USD 2.781.830,18)</strong> no coinciden con los <strong>ingresos del Estado de Resultados al 31/08/2026 (Bs. 92.641.520,01 / USD 116.531,68)</strong>.
                  Esta diferencia se debe a que el banco confunde el <em>Flujo de Caja Bruto</em> con los <em>Ingresos Fiscales Devengados</em>. A continuación se presenta la demostración técnica irrefutable:
                </p>
              </div>

              <div className="flex items-center gap-1.5 no-print shrink-0">
                <button
                  onClick={handleExportConciliacionWord}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold flex items-center gap-1 shadow"
                  title="Descargar conciliación técnica en Word"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Word (.doc)
                </button>
                <button
                  onClick={handleExportConciliacionPdf}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs flex items-center gap-1 shadow"
                  title="Descargar conciliación en PDF directo"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={() => exportToPdfPrint()}
                  className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded text-xs transition-colors shadow"
                  title="Imprimir (Ctrl+P)"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cuadro de Conciliación Demostrativo */}
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-800 pb-3 font-mono">
                <span className="text-xs text-stone-400 uppercase font-sans font-bold">Total Depósitos Registrados en Extracto Banesco:</span>
                <span className="text-lg font-bold text-emerald-400">Bs. {BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.bankDepositsTotalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="space-y-3 text-xs">
                {BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.breakdown.map((row, idx) => (
                  <div key={idx} className="p-3 bg-stone-900/80 border border-stone-800 rounded-lg space-y-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <span className="font-bold text-stone-100">{row.concept}</span>
                      <span className="font-mono font-semibold text-amber-400">
                        {row.bankAmountVES > 0 ? `Bs. ${row.bankAmountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-stone-400">
                      <span className="text-amber-500/90 font-mono font-medium">{row.nature}</span>
                      {row.impactOnIncomeStatement > 0 && (
                        <span className="text-emerald-400 font-mono font-bold">
                          Impacto en EEFF: +Bs. {row.impactOnIncomeStatement.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 pt-1 border-t border-stone-800/80">{row.legalNotes}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t-2 border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono">
                <span className="text-xs text-stone-200 uppercase font-sans font-bold">
                  Ingresos Netos Auditados según Estado de Resultados (Corte 31/08/2026):
                </span>
                <span className="text-lg font-bold text-white">
                  Bs. {BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.financialStatementRevenuesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Dictamen Jurídico y Contable */}
            <div className="bg-emerald-950/30 border border-emerald-800/80 rounded-xl p-4 text-xs text-stone-300 space-y-2">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Conclusión Oficial para la Unidad de Cumplimiento de Banesco
              </h4>
              <p className="leading-relaxed">
                {BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.conclusion}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BALANCE GENERAL COMPARATIVO (2025 VS CORTE AGOSTO 2026) */}
      {/* ========================================================================= */}
      {activeTab === 'EEFF_COMPARATIVO' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Estado de Situación Financiera Comparativo (VEN-NIF)
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Al 31 de diciembre de 2025 (Tasa 301,37) y al 31 de agosto de 2026 (Tasa 794,99)
                </p>
              </div>

              <div className="flex items-center gap-1.5 no-print shrink-0">
                <button
                  onClick={handleExportBalanceSheetExcel}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1 shadow"
                  title="Descargar Balance General en Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Excel (.xlsx)
                </button>
                <button
                  onClick={handleExportBalanceSheetWord}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold flex items-center gap-1 shadow"
                  title="Descargar Balance General en Word"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Word (.doc)
                </button>
                <button
                  onClick={handleExportBalanceSheetPdf}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs flex items-center gap-1 shadow"
                  title="Descargar Balance General en PDF directo"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={() => exportToPdfPrint()}
                  className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded text-xs transition-colors shadow"
                  title="Imprimir (Ctrl+P)"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-mono">
                  <tr>
                    <th className="px-4 py-2.5">Concepto / Denominación</th>
                    <th className="px-4 py-2.5 text-right">Al 31/12/2025 (Bs.)</th>
                    <th className="px-4 py-2.5 text-right">Al 31/12/2025 (US$)</th>
                    <th className="px-4 py-2.5 text-right text-amber-400">Al 31/08/2026 (Bs.)</th>
                    <th className="px-4 py-2.5 text-right text-amber-400">Al 31/08/2026 (US$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono-num">
                  {/* ACTIVO */}
                  <tr className="bg-stone-950/60 font-bold text-white uppercase text-[11px]">
                    <td colSpan={5} className="px-4 py-2">ACTIVO</td>
                  </tr>
                  <tr className="bg-stone-950/30 font-semibold text-stone-300">
                    <td colSpan={5} className="px-4 py-1.5 pl-6">Activo Corriente</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1.5 pl-8">Efectivo en Caja y Banco</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.assets.current.cashAndBanks / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-white font-bold">{BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-stone-300">${(BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1.5 pl-8">Cuentas por Cobrar Comerciales</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.assets.current.tradeReceivables.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.assets.current.tradeReceivables / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-stone-500">—</td>
                    <td className="px-4 py-1.5 text-right text-stone-500">—</td>
                  </tr>
                  <tr className="bg-amber-950/10 font-bold">
                    <td className="px-4 py-1.5 pl-8 text-amber-300">Cuentas por Cobrar Manuel Becerra</td>
                    <td className="px-4 py-1.5 text-right text-stone-500">—</td>
                    <td className="px-4 py-1.5 text-right text-stone-500">—</td>
                    <td className="px-4 py-1.5 text-right text-amber-400">{BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-amber-400">${(BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1.5 pl-8">Retención ISLR Clientes / por Compensar</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.assets.current.islrWithholdingClients.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.assets.current.islrWithholdingClients / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_AUGUST_2026.assets.current.islrWithholdingClients.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_AUGUST_2026.assets.current.islrWithholdingClients / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1.5 pl-8">ISLR pre Pagado</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.assets.current.prepaidISLR.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.assets.current.prepaidISLR / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_AUGUST_2026.assets.current.prepaidISLR.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_AUGUST_2026.assets.current.prepaidISLR / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-stone-950/40 font-bold">
                    <td className="px-4 py-1.5 pl-6">Total Activo Corriente</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.assets.current.totalCurrent / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-emerald-400">{BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-emerald-400">${(BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>

                  {/* PROPIEDAD PLANTA Y EQUIPOS */}
                  <tr className="bg-stone-950/30 font-semibold text-stone-300">
                    <td colSpan={5} className="px-4 py-1.5 pl-6">Propiedad, Planta y Equipos (Nota 7)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1.5 pl-8">Total Propiedad, Planta y Equipos</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.assets.propertyPlantEquipment.totalPPE.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.assets.propertyPlantEquipment.totalPPE / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_AUGUST_2026.assets.propertyPlantEquipment.totalPPE.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_AUGUST_2026.assets.propertyPlantEquipment.totalPPE / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-stone-950 font-bold text-white border-y border-stone-700">
                    <td className="px-4 py-2">TOTAL ACTIVO</td>
                    <td className="px-4 py-2 text-right">{BALANCE_SHEET_2025.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">${(BALANCE_SHEET_2025.assets.totalAssets / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-emerald-400">{BALANCE_SHEET_AUGUST_2026.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-emerald-400">${(BALANCE_SHEET_AUGUST_2026.assets.totalAssets / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>

                  {/* PASIVO */}
                  <tr className="bg-stone-950/60 font-bold text-white uppercase text-[11px]">
                    <td colSpan={5} className="px-4 py-2">PASIVO</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1.5 pl-8">Cuentas por Pagar Accionistas</td>
                    <td className="px-4 py-1.5 text-right text-stone-500">—</td>
                    <td className="px-4 py-1.5 text-right text-stone-500">—</td>
                    <td className="px-4 py-1.5 text-right text-amber-400 font-bold">{BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-amber-400">${(BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1.5 pl-8">I.S.L.R. por Pagar</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.liabilities.current.islrPayable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.liabilities.current.islrPayable / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_AUGUST_2026.liabilities.current.islrPayable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_AUGUST_2026.liabilities.current.islrPayable / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-stone-950/40 font-bold">
                    <td className="px-4 py-1.5 pl-6">TOTAL PASIVO</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.liabilities.totalLiabilities.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.liabilities.totalLiabilities / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-amber-400">{BALANCE_SHEET_AUGUST_2026.liabilities.totalLiabilities.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-amber-400">${(BALANCE_SHEET_AUGUST_2026.liabilities.totalLiabilities / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>

                  {/* PATRIMONIO */}
                  <tr className="bg-stone-950/60 font-bold text-white uppercase text-[11px]">
                    <td colSpan={5} className="px-4 py-2">PATRIMONIO</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1.5 pl-8">Capital Social Suscrito y Pagado</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.equity.subscribedCapital.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.equity.subscribedCapital / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_AUGUST_2026.equity.subscribedCapital.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_AUGUST_2026.equity.subscribedCapital / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1.5 pl-8">Superávit Acumulado</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.equity.accumulatedSurplus.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.equity.accumulatedSurplus / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_AUGUST_2026.equity.accumulatedSurplus.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_AUGUST_2026.equity.accumulatedSurplus / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1.5 pl-8">Utilidad del Ejercicio</td>
                    <td className="px-4 py-1.5 text-right text-emerald-400">{BALANCE_SHEET_2025.equity.periodProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-emerald-400">${(BALANCE_SHEET_2025.equity.periodProfit / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-emerald-400 font-bold">{BALANCE_SHEET_AUGUST_2026.equity.periodProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-emerald-400 font-bold">${(BALANCE_SHEET_AUGUST_2026.equity.periodProfit / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-1.5 pl-8">Reserva Legal</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.equity.legalReserve.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.equity.legalReserve / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_AUGUST_2026.equity.legalReserve.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_AUGUST_2026.equity.legalReserve / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-stone-950/40 font-bold">
                    <td className="px-4 py-1.5 pl-6">TOTAL PATRIMONIO</td>
                    <td className="px-4 py-1.5 text-right">{BALANCE_SHEET_2025.equity.totalEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right">${(BALANCE_SHEET_2025.equity.totalEquity / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-emerald-400">{BALANCE_SHEET_AUGUST_2026.equity.totalEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-emerald-400">${(BALANCE_SHEET_AUGUST_2026.equity.totalEquity / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-stone-950 font-bold text-white border-y-2 border-stone-600">
                    <td className="px-4 py-2.5">TOTAL PASIVO Y PATRIMONIO</td>
                    <td className="px-4 py-2.5 text-right">{BALANCE_SHEET_2025.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right">${(BALANCE_SHEET_2025.totalLiabilitiesAndEquity / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-emerald-400">{BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-emerald-400">${(BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: ESTADO DE RESULTADOS INTEGRAL (2025 VS AGOSTO 2026) */}
      {/* ========================================================================= */}
      {activeTab === 'ESTADO_RESULTADOS' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Estado de Resultado Integral Comparativo
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Ejercicio 2025 cerrado vs Corte de 8 meses al 31 de agosto de 2026
                </p>
              </div>

              <div className="flex items-center gap-1.5 no-print shrink-0">
                <button
                  onClick={handleExportIncomeStatementExcel}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1 shadow"
                  title="Descargar Estado de Resultados en Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Excel (.xlsx)
                </button>
                <button
                  onClick={handleExportIncomeStatementWord}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold flex items-center gap-1 shadow"
                  title="Descargar Estado de Resultados en Word"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Word (.doc)
                </button>
                <button
                  onClick={handleExportIncomeStatementPdf}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs flex items-center gap-1 shadow"
                  title="Descargar Estado de Resultados en PDF directo"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={() => exportToPdfPrint()}
                  className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded text-xs transition-colors shadow"
                  title="Imprimir (Ctrl+P)"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-mono">
                  <tr>
                    <th className="px-4 py-2.5">Concepto</th>
                    <th className="px-4 py-2.5 text-right">Año 2025 (Bs.)</th>
                    <th className="px-4 py-2.5 text-right">Año 2025 (US$)</th>
                    <th className="px-4 py-2.5 text-right text-amber-400">Ene-Ago 2026 (Bs.)</th>
                    <th className="px-4 py-2.5 text-right text-amber-400">Ene-Ago 2026 (US$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono-num">
                  <tr className="bg-stone-950/60 font-bold text-white uppercase text-[11px]">
                    <td colSpan={5} className="px-4 py-2">INGRESOS OPERACIONALES Y FINANCIEROS</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 pl-6">Ingresos por Servicios Agrícolas</td>
                    <td className="px-4 py-2 text-right">{INCOME_STATEMENT_2025.revenues.agriculturalServices.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">${(INCOME_STATEMENT_2025.revenues.agriculturalServices / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-emerald-400 font-bold">{INCOME_STATEMENT_AUGUST_2026.revenues.agriculturalServices.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-emerald-400">${(INCOME_STATEMENT_AUGUST_2026.revenues.agriculturalServices / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-amber-950/10 font-bold">
                    <td className="px-4 py-2 pl-6 text-amber-300">Ingresos por Intereses (Contrato Mutuo Manuel Becerra)</td>
                    <td className="px-4 py-2 text-right text-stone-500">—</td>
                    <td className="px-4 py-2 text-right text-stone-500">—</td>
                    <td className="px-4 py-2 text-right text-amber-400">{INCOME_STATEMENT_AUGUST_2026.revenues.interestIncome.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-amber-400">${(INCOME_STATEMENT_AUGUST_2026.revenues.interestIncome / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-stone-950 font-bold text-white border-y border-stone-700">
                    <td className="px-4 py-2">TOTAL INGRESOS</td>
                    <td className="px-4 py-2 text-right">{INCOME_STATEMENT_2025.revenues.totalRevenues.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">${(INCOME_STATEMENT_2025.revenues.totalRevenues / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-emerald-400">{INCOME_STATEMENT_AUGUST_2026.revenues.totalRevenues.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-emerald-400">${(INCOME_STATEMENT_AUGUST_2026.revenues.totalRevenues / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 pl-6 text-amber-300">Costos de Servicios</td>
                    <td className="px-4 py-2 text-right">{INCOME_STATEMENT_2025.costs.serviceCosts.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">${(INCOME_STATEMENT_2025.costs.serviceCosts / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-amber-400">{INCOME_STATEMENT_AUGUST_2026.costs.serviceCosts.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-amber-400">${(INCOME_STATEMENT_AUGUST_2026.costs.serviceCosts / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-stone-950/80 font-bold text-white">
                    <td className="px-4 py-2">UTILIDAD BRUTA</td>
                    <td className="px-4 py-2 text-right">{INCOME_STATEMENT_2025.costs.grossProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">${(INCOME_STATEMENT_2025.costs.grossProfit / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-emerald-400">{INCOME_STATEMENT_AUGUST_2026.costs.grossProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-emerald-400">${(INCOME_STATEMENT_AUGUST_2026.costs.grossProfit / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 pl-6">Gastos de Administración</td>
                    <td className="px-4 py-2 text-right">{INCOME_STATEMENT_2025.operatingExpenses.administrativeExpenses.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">${(INCOME_STATEMENT_2025.operatingExpenses.administrativeExpenses / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-stone-500">—</td>
                    <td className="px-4 py-2 text-right text-stone-500">—</td>
                  </tr>
                  <tr className="bg-stone-950 font-bold border-t border-stone-800">
                    <td className="px-4 py-2">UTILIDAD EN OPERACIONES</td>
                    <td className="px-4 py-2 text-right">{INCOME_STATEMENT_2025.operatingExpenses.operatingProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">${(INCOME_STATEMENT_2025.operatingExpenses.operatingProfit / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-emerald-400">{INCOME_STATEMENT_AUGUST_2026.operatingExpenses.operatingProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-emerald-400">${(INCOME_STATEMENT_AUGUST_2026.operatingExpenses.operatingProfit / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-stone-950 font-bold text-emerald-400 border-y-2 border-emerald-800/80">
                    <td className="px-4 py-2.5">UTILIDAD NETA DEL EJERCICIO</td>
                    <td className="px-4 py-2.5 text-right">{INCOME_STATEMENT_2025.taxesAndReserves.netProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right">${(INCOME_STATEMENT_2025.taxesAndReserves.netProfit / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-emerald-400 font-bold">{INCOME_STATEMENT_AUGUST_2026.taxesAndReserves.netProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-emerald-400 font-bold">${(INCOME_STATEMENT_AUGUST_2026.taxesAndReserves.netProfit / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
