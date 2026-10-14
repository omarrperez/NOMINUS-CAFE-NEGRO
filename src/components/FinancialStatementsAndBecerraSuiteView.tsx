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
  BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026,
  BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026,
  ADVANCE_CLIENT_INDIVIDUAL_DETAILS
} from '../data/financialStatementsData';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
}

type SubTab =
  | 'TABLA_ORIGEN_MES'
  | 'TABLA_CARGOS_MES'
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
  const [advancesFilter, setAdvancesFilter] = useState<'ALL' | 'PERSONA_NATURAL' | 'PERSONA_JURIDICA' | 'TORREFACTORA_BANESCO'>('ALL');

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

Atención: Gerencia Senior de Cumplimiento Banesco Banco Universal

ASUNTO: RESPUESTA FORMAL A REQUERIMIENTO SOBRE DISPARIDAD ENTRE INGRESOS DECLARADOS EN ESTADOS FINANCIEROS Y CRÉDITOS BANCARIOS MOVILIZADOS EN BBU (PERÍODO ENERO - AGOSTO 2026)

Estimados señores:

En atención a su comunicación sobre la presunta disparidad entre los Ingresos Declarados en Estados Financieros (Bs. 92.641.520,01 / USD 116.531,68) y los Créditos Bancarios Movilizados en BBU (Promedio USD 2.781.830,18 / Total Bs. 1.966.597.105,35), dejamos formal y categórica constancia de lo siguiente:

1. JUSTIFICACIÓN DE LA DIFERENCIA:
- Bs. 1.542.017.092,63 (78,4%): ANTICIPOS EN VENTAS DE CLIENTES JURÍDICOS (NIIF 15) para la intermediación y compra de café en Venezuela a tasa oficial BCV. Bajo NIIF 15 constituyen Pasivo Corriente, no ventas gravadas. Se facturan formalmente a partir de OCTUBRE DE 2026 sustituyendo el anticipo contra facturas de venta.
- Bs. 186.376.000,00 (9,5%): REINTEGROS DE CAPITAL DEL CONTRATO DE PRÉSTAMO MUTUO Y LÍNEA DE CRÉDITO suscrito con el socio Manuel Becerra (Límite Bs. 600.000.000,00). Reducen la cuenta de activo "Cuentas por Cobrar Manuel Becerra" (saldo en balance Bs. 325.948.652,96).
- Bs. 208.708.057,73 (10,6%): TRANSFERENCIAS ENTRE CUENTAS PROPIAS DE AGRÍCOLA ONI C.A. (Banco Provincial, Mercantil, Plaza, Bancamiga). Impacto patrimonial neto de Bs. 0,00.
- Bs. 29.495.954,99 (1,5%): APORTES DE PRESIDENTE Y ACCIONISTA PROPIETARIO ELIAS RAFAEL TRÍAS ABREU Y RESERVAS DE PERSONAS NATURALES.

2. INGRESOS FISCALES REALES DEVENGADOS:
Los ingresos operacionales por Servicios Agrícolas (Bs. 78.717.472,35) más los Ingresos por Intereses del Mutuo Becerra (Bs. 13.924.047,66) totalizan exactamente Bs. 92.641.520,01, tal como refleja fielmente el Estado de Resultados al 31/08/2026.

Soportes Anexos: Contrato Mutuo Becerra Bs. 600M, Contratos a Futuro de Café Nacional, Comprobantes de compra de divisas ($556.890,45 USD), Guías SICA/CVC y Estados Financieros auditados C.P.C. 16.336.

Atentamente,
Elias Rafael Trías Abreu (Presidente) & Licdo. Omar Pérez Castillo (Contador Público Independiente, Ven-Nif - C.P.C. 16.336)
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
        <td class="num" style="font-weight:bold;color:#334155">${r.pctDelTotal.toFixed(1)}%</td>
        <td class="num" style="font-weight:bold;color:#0f172a">$${r.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
          <tr style="background-color:#f1f5f9;color:#000000;font-weight:bold;border-top:2px solid #000;border-bottom:3px double #000">
            <td style="font-weight:bold">TOTAL GENERAL AUDITADO</td>
            <td class="num">${totals.ene.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.feb.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.mar.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.abr.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.may.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.jun.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.jul.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.ago.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="font-weight:bold">${totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="font-weight:bold">100.0%</td>
            <td class="num" style="font-weight:bold">$${totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
              <strong>Licdo. Omar Pérez Castillo</strong><br>
              Contador Público C.P.C. 16.336<br>
              Contador Público Independiente, Ven-Nif
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
      companyName: company.name,
      companyRif: company.rif,
      title: 'COMPOSICIÓN OFICIAL DE ABONOS POR ORIGEN Y MES (BS) - ENERO A AGOSTO 2026',
      subtitle: 'Cuadre Oficial del Estado de Cuenta Banesco N° 0134-0342-18-3421089912 vs Estados Financieros',
      headers,
      rows: dataRows,
      totalsRow,
      columnWidths: [38, 65, 16, 16, 16, 16, 16, 16, 16, 16, 22, 14, 20]
    });
  };

  const handleExportTableOutflowWord = () => {
    const tableRows = BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.rows.map(r => `
      <tr>
        <td><strong>${r.concepto}</strong><br><small style="color:#64748b">${r.legalClassification}</small></td>
        <td class="num">${r.ene > 0 ? r.ene.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.feb > 0 ? r.feb.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.mar > 0 ? r.mar.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.abr > 0 ? r.abr.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.may > 0 ? r.may.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.jun > 0 ? r.jun.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.jul > 0 ? r.jul.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.ago > 0 ? r.ago.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num" style="font-weight:bold;color:#0f172a">${r.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num" style="font-weight:bold;color:#d97706">${r.pctDelTotal.toFixed(1)}%</td>
        <td class="num" style="font-weight:bold;color:#059669">$${r.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join('');

    const totals = BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals;

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Cuenta Banesco:</strong> ${company.banescoAccountVES}</p>
      <h2>COMPOSICIÓN OFICIAL DE SALIDAS Y CARGOS BANESCO POR CONCEPTO Y MES (BS) &ndash; ENERO A AGOSTO 2026</h2>
      <div class="highlight-box">
        <strong>Resumen de Conciliación de Débitos / Egresos Bancarios:</strong><br>
        Total Cargos Movilizados en Banesco: <strong>Bs. ${totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> ($${totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD).<br>
        Principal Destino (59,3%): <strong>Bs. 1.161.270.000,00</strong> en Costo de Ventas y Liquidación de Compra de Café Verde a Productores.<br>
        Saldo Final Conciliado en Banesco al 31/08/2026: <strong>Bs. 9.936.991,40</strong>.
      </div>
      <table>
        <thead>
          <tr>
            <th>Concepto / Destino de Fondos</th>
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
          <tr style="background-color:#f1f5f9;color:#000000;font-weight:bold;border-top:2px solid #000;border-bottom:3px double #000">
            <td style="font-weight:bold">TOTAL GENERAL DE SALIDAS Y CARGOS</td>
            <td class="num">${totals.ene.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.feb.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.mar.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.abr.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.may.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.jun.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.jul.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.ago.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="font-weight:bold">${totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="font-weight:bold">100.0%</td>
            <td class="num" style="font-weight:bold">$${totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
              <strong>Licdo. Omar Pérez Castillo</strong><br>
              Contador Público C.P.C. 16.336<br>
              Contador Público Independiente, Ven-Nif
            </td>
          </tr>
        </table>
      </div>
    `;

    exportToWord('Composicion_Salidas_Cargos_Banesco_2026_Agricola_Oni.doc', 'Composición de Salidas y Cargos Banesco 2026', htmlContent);
  };

  const handleExportTableOutflowExcel = () => {
    const headers = [
      'Concepto / Destino de Fondos',
      'Clasificación Legal / Contable (Auditoría)',
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
    const dataRows = BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.rows.map(r => [
      r.concepto,
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
    const t = BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals;
    const totalsRow = [
      'TOTAL GENERAL DE SALIDAS Y CARGOS BANESCO',
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
      filename: 'Composicion_Salidas_Cargos_Banesco_2026_Agricola_Oni.xlsx',
      sheetName: 'Salidas Banesco 2026',
      companyName: company.name,
      companyRif: company.rif,
      title: 'COMPOSICIÓN OFICIAL DE SALIDAS Y CARGOS BANESCO POR CONCEPTO Y MES (BS) - ENERO A AGOSTO 2026',
      subtitle: 'Cuadre Oficial de Débitos del Estado de Cuenta Banesco N° 0134-0342-18-3421089912 vs Contabilidad EEFF',
      headers,
      rows: dataRows,
      totalsRow,
      columnWidths: [42, 65, 16, 16, 16, 16, 16, 16, 16, 16, 22, 14, 20]
    });
  };

  const handleExportTableOutflowPdf = async () => {
    const totals = BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals;
    const tableRows = BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.rows.map(r => `
      <tr>
        <td><strong>${r.concepto}</strong><br><small style="color:#64748b">${r.legalClassification}</small></td>
        <td class="num">${r.ene > 0 ? r.ene.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.feb > 0 ? r.feb.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.mar > 0 ? r.mar.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.abr > 0 ? r.abr.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.may > 0 ? r.may.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.jun > 0 ? r.jun.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.jul > 0 ? r.jul.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num">${r.ago > 0 ? r.ago.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}</td>
        <td class="num" style="font-weight:bold;color:#0f172a">${r.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num" style="font-weight:bold;color:#d97706">${r.pctDelTotal.toFixed(1)}%</td>
        <td class="num" style="font-weight:bold;color:#059669">$${r.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Cuenta Banesco:</strong> ${company.banescoAccountVES}</p>
      <h2>COMPOSICIÓN OFICIAL DE SALIDAS Y CARGOS BANESCO POR CONCEPTO Y MES (BS) &ndash; ENERO A AGOSTO 2026</h2>
      <div class="highlight-box">
        <strong>Resumen Auditado de Débitos en Banesco:</strong><br>
        Total Cargos Movilizados en Banesco: <strong>Bs. ${totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> ($${totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD).<br>
        Costo de Ventas Directo (Materia Prima / Café Verde): <strong>Bs. 1.161.270.000,00 (59,3%)</strong>.<br>
        Préstamos Accionista (Omar Pérez C.I. V-14.892.301): <strong>Bs. 375.630.000,00 (19,2%)</strong> &middot; Cuentas por Cobrar Socios.
      </div>
      <table>
        <thead>
          <tr>
            <th>Concepto / Destino de Fondos</th>
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
            <td style="color:#ffffff">TOTAL GENERAL DE SALIDAS Y CARGOS</td>
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
    `;

    exportHtmlToPdf('Composicion_Salidas_Cargos_Banesco_2026_Agricola_Oni.pdf', 'Composición Oficial de Salidas y Cargos Banesco 2026', htmlContent);
  };

  const handleExportAdvancesDetailExcel = () => {
    const headers = [
      '# Ref',
      'Fecha',
      'Categoría de Cliente',
      'RIF / C.I. Cliente',
      'Referencia Banesco',
      'Descripción en Extracto Bancario Banesco',
      'Monto Recibido (Bs.)',
      'Tasa BCV',
      'Monto Equiv. (US$)',
      'Comprobante / Soporte',
      'Notas Auditadas & Calificación NIIF 15'
    ];
    const dataRows = ADVANCE_CLIENT_INDIVIDUAL_DETAILS.map(item => [
      item.id,
      item.date,
      item.categoryLabel,
      item.clientRifCi,
      item.reference,
      item.bankDescription,
      item.amountVES,
      item.bcvRate,
      item.amountUSD,
      item.supportRef,
      item.notes
    ]);

    const totalVES = ADVANCE_CLIENT_INDIVIDUAL_DETAILS.reduce((acc, i) => acc + i.amountVES, 0);
    const totalUSD = ADVANCE_CLIENT_INDIVIDUAL_DETAILS.reduce((acc, i) => acc + i.amountUSD, 0);

    const totalsRow = [
      'TOTAL GENERAL',
      'Ene-Ago 2026',
      'Personas Naturales + Jurídicas',
      '100% Identificados',
      'Extracto Banesco',
      'Pasivo Corriente NIIF 15 - Facturación en Octubre',
      totalVES,
      '—',
      totalUSD,
      'Auditado Conforme',
      'Sustento Legal y Fiscal SENIAT / VEN-NIF'
    ];

    exportToExcelXlsx({
      filename: 'Detalle_Anticipos_Clientes_Personas_Naturales_y_Juridicas_2026.xlsx',
      sheetName: 'Detalle Anticipos Clientes',
      title: 'LISTA DETALLADA DE INGRESOS POR ANTICIPOS DE CLIENTES (PERSONAS NATURALES Y JURÍDICAS) - BANESCO 2026',
      subtitle: `Total Bolívares: Bs. ${totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} | Total US$: $${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD | 79.5% de Ingresos Banesco`,
      headers,
      rows: dataRows,
      totalsRow,
      columnWidths: [12, 12, 32, 22, 18, 45, 22, 12, 18, 22, 45]
    });
  };

  const handleExportAdvancesDetailWord = () => {
    const rowsHtml = ADVANCE_CLIENT_INDIVIDUAL_DETAILS.map(item => `
      <tr>
        <td style="font-family:monospace">${item.id}</td>
        <td>${item.date}</td>
        <td><strong>${item.categoryLabel}</strong><br><small style="color:#475569">${item.clientRifCi}</small></td>
        <td style="font-family:monospace">${item.reference}</td>
        <td>${item.bankDescription}</td>
        <td class="num" style="font-weight:bold;color:#059669">Bs. ${item.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">Bs. ${item.bcvRate.toFixed(2)}</td>
        <td class="num" style="font-weight:bold;color:#0f172a">$${item.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        <td><small>${item.supportRef}</small></td>
      </tr>
    `).join('');

    const totalVES = ADVANCE_CLIENT_INDIVIDUAL_DETAILS.reduce((acc, i) => acc + i.amountVES, 0);
    const totalUSD = ADVANCE_CLIENT_INDIVIDUAL_DETAILS.reduce((acc, i) => acc + i.amountUSD, 0);

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Cuenta Banesco:</strong> ${company.banescoAccountVES}</p>
      <h2>DETALLE OFICIAL DE INGRESOS RECIBIDOS POR ANTICIPOS DE CLIENTES (PERSONAS NATURALES Y JURÍDICAS) &ndash; BANESCO 2026</h2>
      <div class="highlight-box">
        <strong>Resumen de Anticipos de Clientes en Banesco (NIIF 15):</strong><br>
        1. Personas Naturales (15 Abonos Taquilla/Transferencias): <strong>Bs. 21.845.979,99</strong> ($36.069,06 USD).<br>
        2. Terceros Jurídicos con RIF en Extracto: <strong>Bs. 528.578.549,25</strong> ($726.080,44 USD).<br>
        3. Cartera Torrefactoras Banesco (TRANS.CTAS Mismo Banco): <strong>Bs. 1.013.438.543,38</strong> ($1.544.405,79 USD).<br>
        <strong>TOTAL CONSOLIDADO ANTICIPOS: Bs. ${totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)</strong>.
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Fecha</th>
            <th>Categoría / Identificación Cliente</th>
            <th>Ref. Banesco</th>
            <th>Descripción en Extracto</th>
            <th class="num">Monto (Bs.)</th>
            <th class="num">Tasa BCV</th>
            <th class="num">Equiv. (US$)</th>
            <th>Comprobante Soporte</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="background-color:#0f172a;color:#ffffff;font-weight:bold">
            <td colspan="5" style="color:#ffffff">TOTAL GENERAL ANTICIPOS A CLIENTES</td>
            <td class="num" style="color:#ffffff">Bs. ${totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="color:#ffffff">—</td>
            <td class="num" style="color:#ffffff">$${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td style="color:#ffffff">Pasivo Corriente NIIF 15</td>
          </tr>
        </tbody>
      </table>
    `;

    exportToWord('Detalle_Oficial_Anticipos_Clientes_Banesco_2026.doc', 'Detalle de Anticipos Recibidos de Clientes Banesco 2026', htmlContent);
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
    const headers = ['# Item', 'Concepto de Conciliación', 'Naturaleza Legal / Contable', 'Monto Movilizado Banesco (Bs.)', 'Impacto en Estado de Resultados (Bs.)', 'Sustento Legal y Fiscal SENIAT / VEN-NIF'];
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
      ['ACTIVO CORRIENTE (CIRCULANTE)', '', '', '', ''],
      ['Efectivo en Caja y Bancos (Banesco Cta. Cte.)', BALANCE_SHEET_2025.assets.current.cashAndBanks, BALANCE_SHEET_2025.assets.current.cashAndBanks / 301.37, BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks, BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks / 794.99],
      ['Cuentas por Cobrar Comerciales Clientes (Corte 2025)', BALANCE_SHEET_2025.assets.current.tradeReceivables, BALANCE_SHEET_2025.assets.current.tradeReceivables / 301.37, 0, 0],
      ['Cuentas por Cobrar Socios - Transferencias Fondos Banesco (Elías Rafael Trías Abreu V-23.997.829)', 0, 0, BALANCE_SHEET_AUGUST_2026.assets.current.shareholderAdvancesReceivable || 375630000.00, (BALANCE_SHEET_AUGUST_2026.assets.current.shareholderAdvancesReceivable || 375630000.00) / 794.99],
      ['Cuentas por Cobrar Socios - Préstamo Mutuo Manuel Becerra', 0, 0, BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable, BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable / 794.99],
      ['Retención ISLR Clientes / por Compensar', BALANCE_SHEET_2025.assets.current.islrWithholdingClients, BALANCE_SHEET_2025.assets.current.islrWithholdingClients / 301.37, BALANCE_SHEET_AUGUST_2026.assets.current.islrWithholdingClients, BALANCE_SHEET_AUGUST_2026.assets.current.islrWithholdingClients / 794.99],
      ['ISLR Pagado por Anticipado / Crédito Fiscal Exigible', BALANCE_SHEET_2025.assets.current.prepaidISLR, BALANCE_SHEET_2025.assets.current.prepaidISLR / 301.37, BALANCE_SHEET_AUGUST_2026.assets.current.prepaidISLR, BALANCE_SHEET_AUGUST_2026.assets.current.prepaidISLR / 794.99],
      ['Total Activo Corriente', BALANCE_SHEET_2025.assets.current.totalCurrent, BALANCE_SHEET_2025.assets.current.totalCurrent / 301.37, BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent, BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent / 794.99],
      ['PROPIEDAD, PLANTA Y EQUIPOS', '', '', '', ''],
      ['Total Propiedad, Planta y Equipos Neta', BALANCE_SHEET_2025.assets.propertyPlantEquipment.totalPPE, BALANCE_SHEET_2025.assets.propertyPlantEquipment.totalPPE / 301.37, BALANCE_SHEET_AUGUST_2026.assets.propertyPlantEquipment.totalPPE, BALANCE_SHEET_AUGUST_2026.assets.propertyPlantEquipment.totalPPE / 794.99],
      ['TOTAL ACTIVO', BALANCE_SHEET_2025.assets.totalAssets, BALANCE_SHEET_2025.assets.totalAssets / 301.37, BALANCE_SHEET_AUGUST_2026.assets.totalAssets, BALANCE_SHEET_AUGUST_2026.assets.totalAssets / 794.99],
      ['PASIVO CORRIENTE (CIRCULANTE)', '', '', '', ''],
      ['Anticipos Recibidos de Clientes (NIIF 15 - Saldo Neto por Ejecutar)', 0, 0, BALANCE_SHEET_AUGUST_2026.liabilities.current.customerAdvances || 301228750.17, (BALANCE_SHEET_AUGUST_2026.liabilities.current.customerAdvances || 301228750.17) / 794.99],
      ['Retención de ISLR por Pagar (Originada por Anticipos de Clientes 2% Decreto 1808)', 0, 0, BALANCE_SHEET_AUGUST_2026.liabilities.current.islrWithheldOnAdvancesPayable || 31277261.45, (BALANCE_SHEET_AUGUST_2026.liabilities.current.islrWithheldOnAdvancesPayable || 31277261.45) / 794.99],
      ['Cuentas por Pagar Socios (Aportes Accionista Elias Rafael Trías Abreu V-23.997.829)', 0, 0, BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables, BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables / 794.99],
      ['I.S.L.R. por Pagar / Provisiones Tributarias', BALANCE_SHEET_2025.liabilities.current.islrPayable, BALANCE_SHEET_2025.liabilities.current.islrPayable / 301.37, BALANCE_SHEET_AUGUST_2026.liabilities.current.islrPayable, BALANCE_SHEET_AUGUST_2026.liabilities.current.islrPayable / 794.99],
      ['IGTF 3% Efectivo Divisas por Pagar (Derogado 2% Bancario)', 0, 0, BALANCE_SHEET_AUGUST_2026.liabilities.current.igtfPayable || 0, 0],
      ['TOTAL PASIVO (PASIVO CORRIENTE)', BALANCE_SHEET_2025.liabilities.totalLiabilities, BALANCE_SHEET_2025.liabilities.totalLiabilities / 301.37, BALANCE_SHEET_AUGUST_2026.liabilities.totalLiabilities, BALANCE_SHEET_AUGUST_2026.liabilities.totalLiabilities / 794.99],
      ['PATRIMONIO NETO', '', '', '', ''],
      ['Capital Social Suscrito y Pagado', BALANCE_SHEET_2025.equity.subscribedCapital, BALANCE_SHEET_2025.equity.subscribedCapital / 301.37, BALANCE_SHEET_AUGUST_2026.equity.subscribedCapital, BALANCE_SHEET_AUGUST_2026.equity.subscribedCapital / 794.99],
      ['Superávit Acumulado (Ejercicios Anteriores)', BALANCE_SHEET_2025.equity.accumulatedSurplus, BALANCE_SHEET_2025.equity.accumulatedSurplus / 301.37, BALANCE_SHEET_AUGUST_2026.equity.accumulatedSurplus, BALANCE_SHEET_AUGUST_2026.equity.accumulatedSurplus / 794.99],
      ['Utilidad Neta del Ejercicio (Ene-Ago 2026)', BALANCE_SHEET_2025.equity.periodProfit, BALANCE_SHEET_2025.equity.periodProfit / 301.37, BALANCE_SHEET_AUGUST_2026.equity.periodProfit, BALANCE_SHEET_AUGUST_2026.equity.periodProfit / 794.99],
      ['Reserva Legal (5% Código de Comercio)', BALANCE_SHEET_2025.equity.legalReserve, BALANCE_SHEET_2025.equity.legalReserve / 301.37, BALANCE_SHEET_AUGUST_2026.equity.legalReserve, BALANCE_SHEET_AUGUST_2026.equity.legalReserve / 794.99],
      ['TOTAL PATRIMONIO NETO', BALANCE_SHEET_2025.equity.totalEquity, BALANCE_SHEET_2025.equity.totalEquity / 301.37, BALANCE_SHEET_AUGUST_2026.equity.totalEquity, BALANCE_SHEET_AUGUST_2026.equity.totalEquity / 794.99],
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
            <td class="num">${totals.abr.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.may.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.jun.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.jul.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">${totals.ago.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="font-weight:bold">${totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num" style="font-weight:bold">100.0%</td>
            <td class="num" style="font-weight:bold">$${totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
              <strong>Licdo. Omar Pérez Castillo</strong><br>
              Contador Público C.P.C. 16.336<br>
              Contador Público Independiente, Ven-Nif
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
      <p>Al 31 de Diciembre de 2025 (Tasa BCV 301,37) y al 31 de Agosto de 2026 (Tasa BCV 794,99)</p>
      <table>
        <thead>
          <tr>
            <th>Concepto / Cuenta Contable</th>
            <th class="num">31/12/2025 (Bs.)</th>
            <th class="num">31/12/2025 (US$)</th>
            <th class="num">31/08/2026 (Bs.)</th>
            <th class="num">31/08/2026 (US$)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#f1f5f9;font-weight:bold"><td colspan="5">ACTIVO CORRIENTE (CIRCULANTE)</td></tr>
          <tr><td>Efectivo en Caja y Bancos (Banesco Cta. Cte.)</td><td class="num">${BALANCE_SHEET_2025.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.cashAndBanks/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Cuentas por Cobrar Comerciales Clientes (Corte 2025)</td><td class="num">${BALANCE_SHEET_2025.assets.current.tradeReceivables.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.tradeReceivables/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">—</td><td class="num">—</td></tr>
          <tr><td>Cuentas por Cobrar Socios - Transferencias Fondos Banesco (Elías Rafael Trías Abreu V-23.997.829)</td><td class="num">—</td><td class="num">—</td><td class="num">${(BALANCE_SHEET_AUGUST_2026.assets.current.shareholderAdvancesReceivable || 375630000.00).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${((BALANCE_SHEET_AUGUST_2026.assets.current.shareholderAdvancesReceivable || 375630000.00)/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Cuentas por Cobrar Socios - Préstamo Mutuo Manuel Becerra</td><td class="num">—</td><td class="num">—</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Retención ISLR Clientes / por Compensar</td><td class="num">${BALANCE_SHEET_2025.assets.current.islrWithholdingClients.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.islrWithholdingClients/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.islrWithholdingClients.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.islrWithholdingClients/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>ISLR Pagado por Anticipado / Crédito Fiscal Exigible</td><td class="num">${BALANCE_SHEET_2025.assets.current.prepaidISLR.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.prepaidISLR/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.prepaidISLR.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.prepaidISLR/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#e2e8f0;font-weight:bold"><td>Total Activo Corriente</td><td class="num">${BALANCE_SHEET_2025.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.totalCurrent/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#f1f5f9;font-weight:bold"><td colspan="5">PROPIEDAD, PLANTA Y EQUIPOS</td></tr>
          <tr><td>Total Propiedad, Planta y Equipos Neta</td><td class="num">${BALANCE_SHEET_2025.assets.propertyPlantEquipment.totalPPE.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.propertyPlantEquipment.totalPPE/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.propertyPlantEquipment.totalPPE.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.propertyPlantEquipment.totalPPE/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#f8fafc;font-weight:bold;color:#000000;border-top:1px solid #000;border-bottom:2px solid #000"><td style="font-weight:bold">TOTAL ACTIVO</td><td class="num">${BALANCE_SHEET_2025.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.totalAssets/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">${BALANCE_SHEET_AUGUST_2026.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">$${(BALANCE_SHEET_AUGUST_2026.assets.totalAssets/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#f1f5f9;font-weight:bold"><td colspan="5">PASIVO CORRIENTE (CIRCULANTE)</td></tr>
          <tr><td>Anticipos Recibidos de Clientes (NIIF 15 - Saldo Neto por Ejecutar)</td><td class="num">—</td><td class="num">—</td><td class="num">${(BALANCE_SHEET_AUGUST_2026.liabilities.current.customerAdvances || 301228750.17).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${((BALANCE_SHEET_AUGUST_2026.liabilities.current.customerAdvances || 301228750.17)/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Retención de ISLR por Pagar (Originada por Anticipos de Clientes 2% Decreto 1808)</td><td class="num">—</td><td class="num">—</td><td class="num">${(BALANCE_SHEET_AUGUST_2026.liabilities.current.islrWithheldOnAdvancesPayable || 31277261.45).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${((BALANCE_SHEET_AUGUST_2026.liabilities.current.islrWithheldOnAdvancesPayable || 31277261.45)/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Cuentas por Pagar Socios (Aportes Accionista Elias Rafael Trías Abreu V-23.997.829)</td><td class="num">—</td><td class="num">—</td><td class="num">${BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>I.S.L.R. por Pagar / Provisiones Tributarias</td><td class="num">${BALANCE_SHEET_2025.liabilities.current.islrPayable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.liabilities.current.islrPayable/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.liabilities.current.islrPayable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.liabilities.current.islrPayable/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>IGTF 3% Efectivo Divisas por Pagar (Derogado 2% Bancario)</td><td class="num">—</td><td class="num">—</td><td class="num">0,00</td><td class="num">$0.00</td></tr>
          <tr style="background:#f8fafc;font-weight:bold;color:#000000;border-top:1px solid #000;border-bottom:2px solid #000"><td style="font-weight:bold">TOTAL PASIVO (PASIVO CORRIENTE)</td><td class="num">${BALANCE_SHEET_2025.liabilities.totalLiabilities.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.liabilities.totalLiabilities/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">${BALANCE_SHEET_AUGUST_2026.liabilities.totalLiabilities.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">$${(BALANCE_SHEET_AUGUST_2026.liabilities.totalLiabilities/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#f1f5f9;font-weight:bold"><td colspan="5">PATRIMONIO NETO</td></tr>
          <tr><td>Capital Social Suscrito y Pagado</td><td class="num">${BALANCE_SHEET_2025.equity.subscribedCapital.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.equity.subscribedCapital/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.equity.subscribedCapital.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.equity.subscribedCapital/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Superávit Acumulado (Ejercicios Anteriores)</td><td class="num">${BALANCE_SHEET_2025.equity.accumulatedSurplus.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.equity.accumulatedSurplus/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.equity.accumulatedSurplus.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.equity.accumulatedSurplus/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Utilidad Neta del Ejercicio (Ene-Ago 2026)</td><td class="num">${BALANCE_SHEET_2025.equity.periodProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.equity.periodProfit/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.equity.periodProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.equity.periodProfit/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Reserva Legal (5% Código de Comercio)</td><td class="num">${BALANCE_SHEET_2025.equity.legalReserve.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.equity.legalReserve/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.equity.legalReserve.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.equity.legalReserve/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#e2e8f0;font-weight:bold"><td>TOTAL PATRIMONIO NETO</td><td class="num">${BALANCE_SHEET_2025.equity.totalEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.equity.totalEquity/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.equity.totalEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.equity.totalEquity/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#ffffff;color:#000000;font-weight:bold;border-top:2px solid #000;border-bottom:3px double #000"><td style="font-weight:bold">TOTAL PASIVO Y PATRIMONIO</td><td class="num">${BALANCE_SHEET_2025.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.totalLiabilitiesAndEquity/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">${BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">$${(BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
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
      <p>Al 31 de Diciembre de 2025 (Tasa BCV 301,37) y al 31 de Agosto de 2026 (Tasa BCV 794,99)</p>
      <table>
        <thead>
          <tr>
            <th>Concepto / Cuenta Contable</th>
            <th class="num">31/12/2025 (Bs.)</th>
            <th class="num">31/12/2025 (US$)</th>
            <th class="num">31/08/2026 (Bs.)</th>
            <th class="num">31/08/2026 (US$)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#f1f5f9;font-weight:bold"><td colspan="5">ACTIVO CORRIENTE (CIRCULANTE)</td></tr>
          <tr><td>Efectivo en Caja y Bancos (Banesco Cta. Cte.)</td><td class="num">${BALANCE_SHEET_2025.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.cashAndBanks/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Cuentas por Cobrar Comerciales Clientes (Corte 2025)</td><td class="num">${BALANCE_SHEET_2025.assets.current.tradeReceivables.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.tradeReceivables/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">—</td><td class="num">—</td></tr>
          <tr><td>Cuentas por Cobrar Socios - Transferencias Fondos Banesco (Elías Rafael Trías Abreu V-23.997.829)</td><td class="num">—</td><td class="num">—</td><td class="num">${(BALANCE_SHEET_AUGUST_2026.assets.current.shareholderAdvancesReceivable || 375630000.00).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${((BALANCE_SHEET_AUGUST_2026.assets.current.shareholderAdvancesReceivable || 375630000.00)/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Cuentas por Cobrar Socios - Préstamo Mutuo Manuel Becerra</td><td class="num">—</td><td class="num">—</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Retención ISLR Clientes / por Compensar</td><td class="num">${BALANCE_SHEET_2025.assets.current.islrWithholdingClients.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.islrWithholdingClients/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.islrWithholdingClients.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.islrWithholdingClients/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>ISLR Pagado por Anticipado / Crédito Fiscal Exigible</td><td class="num">${BALANCE_SHEET_2025.assets.current.prepaidISLR.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.prepaidISLR/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.prepaidISLR.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.prepaidISLR/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#e2e8f0;font-weight:bold"><td>Total Activo Corriente</td><td class="num">${BALANCE_SHEET_2025.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.current.totalCurrent/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#f1f5f9;font-weight:bold"><td colspan="5">PROPIEDAD, PLANTA Y EQUIPOS</td></tr>
          <tr><td>Total Propiedad, Planta y Equipos Neta</td><td class="num">${BALANCE_SHEET_2025.assets.propertyPlantEquipment.totalPPE.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.propertyPlantEquipment.totalPPE/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.assets.propertyPlantEquipment.totalPPE.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.assets.propertyPlantEquipment.totalPPE/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#f8fafc;font-weight:bold;color:#000000;border-top:1px solid #000;border-bottom:2px solid #000"><td style="font-weight:bold">TOTAL ACTIVO</td><td class="num">${BALANCE_SHEET_2025.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.assets.totalAssets/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">${BALANCE_SHEET_AUGUST_2026.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">$${(BALANCE_SHEET_AUGUST_2026.assets.totalAssets/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#f1f5f9;font-weight:bold"><td colspan="5">PASIVO CORRIENTE (CIRCULANTE)</td></tr>
          <tr><td>Anticipos Recibidos de Clientes (NIIF 15 - Saldo Neto por Ejecutar)</td><td class="num">—</td><td class="num">—</td><td class="num">${(BALANCE_SHEET_AUGUST_2026.liabilities.current.customerAdvances || 301228750.17).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${((BALANCE_SHEET_AUGUST_2026.liabilities.current.customerAdvances || 301228750.17)/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Retención de ISLR por Pagar (Originada por Anticipos de Clientes 2% Decreto 1808)</td><td class="num">—</td><td class="num">—</td><td class="num">${(BALANCE_SHEET_AUGUST_2026.liabilities.current.islrWithheldOnAdvancesPayable || 31277261.45).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${((BALANCE_SHEET_AUGUST_2026.liabilities.current.islrWithheldOnAdvancesPayable || 31277261.45)/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Cuentas por Pagar Socios (Aportes Accionista Elias Rafael Trías Abreu V-23.997.829)</td><td class="num">—</td><td class="num">—</td><td class="num">${BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>I.S.L.R. por Pagar / Provisiones Tributarias</td><td class="num">${BALANCE_SHEET_2025.liabilities.current.islrPayable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.liabilities.current.islrPayable/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.liabilities.current.islrPayable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.liabilities.current.islrPayable/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>IGTF 3% Efectivo Divisas por Pagar (Derogado 2% Bancario)</td><td class="num">—</td><td class="num">—</td><td class="num">0,00</td><td class="num">$0.00</td></tr>
          <tr style="background:#f8fafc;font-weight:bold;color:#000000;border-top:1px solid #000;border-bottom:2px solid #000"><td style="font-weight:bold">TOTAL PASIVO (PASIVO CORRIENTE)</td><td class="num">${BALANCE_SHEET_2025.liabilities.totalLiabilities.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.liabilities.totalLiabilities/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">${BALANCE_SHEET_AUGUST_2026.liabilities.totalLiabilities.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">$${(BALANCE_SHEET_AUGUST_2026.liabilities.totalLiabilities/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#f1f5f9;font-weight:bold"><td colspan="5">PATRIMONIO NETO</td></tr>
          <tr><td>Capital Social Suscrito y Pagado</td><td class="num">${BALANCE_SHEET_2025.equity.subscribedCapital.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.equity.subscribedCapital/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.equity.subscribedCapital.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.equity.subscribedCapital/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Superávit Acumulado (Ejercicios Anteriores)</td><td class="num">${BALANCE_SHEET_2025.equity.accumulatedSurplus.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.equity.accumulatedSurplus/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.equity.accumulatedSurplus.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.equity.accumulatedSurplus/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Utilidad Neta del Ejercicio (Ene-Ago 2026)</td><td class="num">${BALANCE_SHEET_2025.equity.periodProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.equity.periodProfit/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.equity.periodProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.equity.periodProfit/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td>Reserva Legal (5% Código de Comercio)</td><td class="num">${BALANCE_SHEET_2025.equity.legalReserve.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.equity.legalReserve/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.equity.legalReserve.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.equity.legalReserve/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#e2e8f0;font-weight:bold"><td>TOTAL PATRIMONIO NETO</td><td class="num">${BALANCE_SHEET_2025.equity.totalEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.equity.totalEquity/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num">${BALANCE_SHEET_AUGUST_2026.equity.totalEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_AUGUST_2026.equity.totalEquity/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr style="background:#ffffff;color:#000000;font-weight:bold;border-top:2px solid #000;border-bottom:3px double #000"><td style="font-weight:bold">TOTAL PASIVO Y PATRIMONIO</td><td class="num">${BALANCE_SHEET_2025.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num">$${(BALANCE_SHEET_2025.totalLiabilitiesAndEquity/301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">${BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td><td class="num" style="font-weight:bold">$${(BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity/794.99).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
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
    <div className="bg-slate-50/50 p-2 sm:p-4 rounded-2xl space-y-6">
      {/* Header Banner in Soft Pastel Theme */}
      <div className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-sky-50 border-2 border-amber-200/90 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-amber-200/80 text-amber-900 border border-amber-300 rounded-lg shadow-xs">
                <Scale className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight">
                Respuestas a Banesco / SENIAT: Cuadre Oficial de Abonos & EEFF 2026
              </h2>
            </div>
            <p className="text-xs text-amber-900/80 font-medium mt-1.5 flex flex-wrap items-center gap-1">
              <span>{company.name}</span> &middot; <span>RIF <strong className="font-mono text-amber-950">{company.rif}</strong></span> &middot; <span>Expediente Banesco AUD-BAN-2026-ONI-094</span>
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
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Descargar hoja de cálculo oficial en Microsoft Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
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
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Descargar documento editable en formato Microsoft Word (.doc)"
            >
              <FileDown className="w-4 h-4" />
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
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 shadow-sm"
              title="Descargar archivo PDF directo"
            >
              <Download className="w-4 h-4" />
              Descargar PDF
            </button>
            <button
              onClick={() => exportToPdfPrint()}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
              title="Imprimir documento físico (Ctrl+P)"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              Imprimir
            </button>
          </div>
        </div>

        {/* 4 KPI Cards in Professional Grayscale Accounting Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 font-mono-num">
          <div className="bg-slate-50 border border-slate-300 p-4 rounded-xl shadow-2xs">
            <span className="text-[11px] font-sans font-bold text-slate-700 block uppercase tracking-wide">Créditos Movilizados en BBU</span>
            <span className="text-lg font-black text-slate-950 mt-1 block">
              Bs. {BANESCO_OFFICIAL_LETTER_2026.bankCreditsTotalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-600 font-bold font-sans">
              ${BANESCO_OFFICIAL_LETTER_2026.bankCreditsAverageUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD prom.
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-4 rounded-xl shadow-2xs">
            <span className="text-[11px] font-sans font-bold text-slate-700 block uppercase tracking-wide">Ventas Declaradas en EEFF</span>
            <span className="text-lg font-black text-slate-950 mt-1 block">
              Bs. {BANESCO_OFFICIAL_LETTER_2026.reportedRevenuesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-600 font-bold font-sans">
              ${BANESCO_OFFICIAL_LETTER_2026.reportedRevenuesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-4 rounded-xl shadow-2xs">
            <span className="text-[11px] font-sans font-bold text-slate-700 block uppercase tracking-wide">Anticipos Ventas Café (NIIF 15)</span>
            <span className="text-lg font-black text-slate-950 mt-1 block">
              Bs. {(528578549.25 + 1013438543.38).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-600 font-bold font-sans">
              78.4% del banco &middot; Factura en Octubre
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-300 p-4 rounded-xl shadow-2xs">
            <span className="text-[11px] font-sans font-bold text-slate-700 block uppercase tracking-wide">Ctas x Cobrar Manuel Becerra</span>
            <span className="text-lg font-black text-slate-950 mt-1 block">
              Bs. {BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-600 font-bold font-sans">
              Línea Bs. 600M &middot; Saldo Cuadrado
            </span>
          </div>
        </div>

        {/* PROMINENT PROFESSIONAL MONOCHROME TAB NAVIGATION MENU */}
        <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-2xs mt-6 no-print">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono">
                MENÚ OFICIAL DE CUADERNOS E INFORMES CONTABLES (VEN-NIF):
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-0.5 rounded-full border border-slate-300 shadow-2xs font-mono">
              7 Módulos Disponibles
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('TABLA_ORIGEN_MES')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'TABLA_ORIGEN_MES'
                  ? 'bg-slate-900 text-white font-black shadow-xs border border-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-300 shadow-2xs'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${activeTab === 'TABLA_ORIGEN_MES' ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'}`}>1</span>
              <FileSpreadsheet className="w-4 h-4 text-slate-600" />
              <span>1. Composición de Abonos por Origen (Ene - Ago 2026)</span>
            </button>

            <button
              onClick={() => setActiveTab('TABLA_CARGOS_MES')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'TABLA_CARGOS_MES'
                  ? 'bg-slate-900 text-white font-black shadow-xs border border-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-300 shadow-2xs'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${activeTab === 'TABLA_CARGOS_MES' ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'}`}>2</span>
              <FileSpreadsheet className="w-4 h-4 text-slate-600" />
              <span>2. Composición de Salidas y Cargos Banesco (Ene - Ago 2026)</span>
            </button>

            <button
              onClick={() => setActiveTab('CARTA_BANCO_OFICIAL')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'CARTA_BANCO_OFICIAL'
                  ? 'bg-slate-900 text-white font-black shadow-xs border border-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-300 shadow-2xs'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${activeTab === 'CARTA_BANCO_OFICIAL' ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'}`}>3</span>
              <FileCheck className="w-4 h-4 text-slate-600" />
              <span>3. Carta Explicativa a Banesco / SENIAT (Firmada)</span>
            </button>

            <button
              onClick={() => setActiveTab('MANUEL_BECERRA')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'MANUEL_BECERRA'
                  ? 'bg-slate-900 text-white font-black shadow-xs border border-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-300 shadow-2xs'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${activeTab === 'MANUEL_BECERRA' ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'}`}>4</span>
              <Users className="w-4 h-4 text-slate-600" />
              <span>4. Contrato Mutuo Manuel Becerra (47 Movs)</span>
            </button>

            <button
              onClick={() => setActiveTab('CONCILIACION_BANCO')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'CONCILIACION_BANCO'
                  ? 'bg-slate-900 text-white font-black shadow-xs border border-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-300 shadow-2xs'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${activeTab === 'CONCILIACION_BANCO' ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'}`}>5</span>
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>5. Conciliación Técnica: Banesco vs Ingresos EEFF</span>
            </button>

            <button
              onClick={() => setActiveTab('EEFF_COMPARATIVO')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'EEFF_COMPARATIVO'
                  ? 'bg-slate-900 text-white font-black shadow-xs border border-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-300 shadow-2xs'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${activeTab === 'EEFF_COMPARATIVO' ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'}`}>6</span>
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>6. Balance General (2025 vs 2026)</span>
            </button>

            <button
              onClick={() => setActiveTab('ESTADO_RESULTADOS')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'ESTADO_RESULTADOS'
                  ? 'bg-slate-900 text-white font-black shadow-xs border border-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-300 shadow-2xs'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${activeTab === 'ESTADO_RESULTADOS' ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'}`}>7</span>
              <TrendingUp className="w-4 h-4 text-slate-600" />
              <span>7. Estado de Resultados (2025 vs 2026)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COMPOSICIÓN DE ABONOS POR ORIGEN Y MES (BS) - LA TABLA EXACTA */}
      {/* ========================================================================= */}
      {activeTab === 'TABLA_ORIGEN_MES' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-amber-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-950 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  Composición Oficial de Abonos por Origen y Mes (Bs) &ndash; Enero a Agosto 2026
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
                  Cuadro oficial de depósitos bancarios Banesco (Cuenta Corriente N° 0134-0342-18-3421089912). Se identifica detalladamente cada origen de fondos para desvirtuar la observación de la Unidad de Cumplimiento.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-end gap-3 shrink-0">
                <div className="flex items-center gap-1.5 no-print">
                  <button
                    onClick={handleExportTable1Word}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                    title="Exportar esta tabla completa a Microsoft Word"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Word (.doc)
                  </button>
                  <button
                    onClick={handleExportTable1Csv}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                    title="Exportar a CSV compatible con Excel"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Excel (CSV)
                  </button>
                  <button
                    onClick={handleExportTable1Pdf}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 shadow-xs"
                    title="Descargar tabla oficial en archivo PDF directo"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                  <button
                    onClick={() => exportToPdfPrint()}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs transition-all shadow-2xs"
                    title="Imprimir (Ctrl+P)"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-right font-mono-num shadow-xs">
                  <span className="text-[10px] text-emerald-800 block font-sans font-bold">Total Fondos Movilizados:</span>
                  <span className="text-lg font-black text-emerald-950 block">
                    Bs. {BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-emerald-800 font-bold block">
                    ${BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Aclaratoria sobre el renglón amarillo (51.5%) */}
            <div className="bg-amber-100/90 border border-amber-300 p-4 rounded-xl text-xs space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-950 font-black">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Actualización Clave: Identificación Total del Renglón Amarillo (51.5%)</span>
              </div>
              <p className="text-amber-950 leading-relaxed font-medium">
                El renglón que anteriormente figuraba como <strong className="text-amber-900 font-mono">«Banesco sin identificar (TRANS,CTAS)»</strong> por <strong>Bs. 1.013.438.543,38 (51.5% del total)</strong> ha sido completamente verificado y clasificado: corresponde a <strong>ANTICIPOS EN VENTAS DE CLIENTES TORREFACTORES INDUSTRIALES</strong> mediante transferencias internas entre cuentas Banesco. Junto al renglón de Terceros con RIF (Bs. 528,58M &middot; 26.9%), suman <strong>Bs. 1.542,02 millones (78.4%)</strong> de anticipos para compra e intermediación de café en Venezuela a tasa BCV bajo la norma <strong>NIIF 15</strong>, cuyo café se entrega y factura en <strong>Octubre de 2026</strong>.
              </p>
            </div>

            {/* Tabla Completa con los 8 Meses */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-xs text-left text-slate-800">
                <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b-2 border-slate-300 font-mono font-bold">
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
                    <th className="px-3 py-2.5 text-right text-slate-900 font-black">Total Bs</th>
                    <th className="px-2.5 py-2.5 text-right text-amber-900 font-black">% Total</th>
                    <th className="px-3 py-2.5 text-right text-emerald-900 font-black">Total US$</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-num">
                  {BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.rows.map((row) => {
                    const isYellowRow = row.id === 'ORIG-06';
                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors ${
                          isYellowRow
                            ? 'bg-amber-100 font-bold border-y-2 border-amber-400 hover:bg-amber-200/80 text-amber-950'
                            : 'hover:bg-amber-50/60 text-slate-800'
                        }`}
                      >
                        <td className="px-3 py-2.5 font-sans">
                          <span className={`block font-semibold ${isYellowRow ? 'text-amber-950 text-xs font-bold' : 'text-slate-900 font-bold'}`}>
                            {row.origen}
                          </span>
                          <span className="text-[10px] text-slate-500 block font-normal mt-0.5">{row.legalClassification}</span>
                        </td>
                        <td className="px-2.5 py-2.5 text-right text-slate-600">{row.ene > 0 ? row.ene.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-600">{row.feb > 0 ? row.feb.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-600">{row.mar > 0 ? row.mar.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-600">{row.abr > 0 ? row.abr.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-600">{row.may > 0 ? row.may.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-700">{row.jun > 0 ? row.jun.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-700">{row.jul > 0 ? row.jul.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-700">{row.ago > 0 ? row.ago.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-3 py-2.5 text-right font-black text-slate-950 whitespace-nowrap">
                          {row.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-2.5 py-2.5 text-right font-black text-amber-900 whitespace-nowrap">
                          {row.pctDelTotal.toFixed(1)}%
                        </td>
                        <td className="px-3 py-2.5 text-right font-black text-emerald-900 whitespace-nowrap">
                          ${row.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-200 border-t-2 border-slate-400 font-mono-num font-bold text-xs text-slate-950">
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
                    <td className="px-3 py-3 text-right text-emerald-950 font-black">
                      Bs. {BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-2.5 py-3 text-right text-amber-950 font-black">100.0%</td>
                    <td className="px-3 py-3 text-right text-emerald-950 font-black">
                      ${BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026.totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* SECCIÓN ADICIONAL: LISTA DETALLADA DE CLIENTES (PERSONAS NATURALES Y JURÍDICAS) */}
          <div className="bg-white border-2 border-emerald-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-200/80 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-emerald-950 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Lista Oficial y Detallada de Clientes que Otorgaron Anticipos (Personas Naturales y Jurídicas)
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
                  Relación analítica e individualizada de abonos bancarios en Banesco (Cuenta N° 0134-0342-18-3421089912) clasificados como Anticipos Recibidos de Clientes bajo la norma NIIF 15.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 no-print shrink-0">
                <button
                  onClick={handleExportAdvancesDetailExcel}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  title="Exportar esta lista completa de Personas Naturales y Jurídicas a Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel (.xlsx)
                </button>
                <button
                  onClick={handleExportAdvancesDetailWord}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                  title="Exportar esta lista a Microsoft Word (.doc)"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Word (.doc)
                </button>
                <button
                  onClick={() => exportToPdfPrint()}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs transition-all shadow-2xs"
                  title="Imprimir lista (Ctrl+P)"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Botones Interactivos de Selección de Categoría de Anticipos */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 font-mono-num text-xs no-print">
              <button
                type="button"
                onClick={() => setAdvancesFilter('ALL')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  advancesFilter === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                <span className="text-[10px] font-sans font-bold uppercase block opacity-80">Ver Todos (30 Registros)</span>
                <span className="text-sm font-black mt-0.5 block">Bs. 1.563.864.529,24</span>
                <span className="text-[10px] font-bold opacity-90">$2.306.555,29 USD &middot; Total Anticipos</span>
              </button>

              <button
                type="button"
                onClick={() => setAdvancesFilter('PERSONA_NATURAL')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  advancesFilter === 'PERSONA_NATURAL'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/40'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300'
                }`}
              >
                <span className="text-[10px] font-sans font-bold uppercase block opacity-90">1. Personas Naturales (15 Abonos)</span>
                <span className="text-sm font-black mt-0.5 block">Bs. 21.845.979,99</span>
                <span className="text-[10px] font-bold opacity-90">$36.069,06 USD &middot; Taquilla/Transf. Banesco</span>
              </button>

              <button
                type="button"
                onClick={() => setAdvancesFilter('PERSONA_JURIDICA')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  advancesFilter === 'PERSONA_JURIDICA'
                    ? 'bg-sky-700 text-white border-sky-800 shadow-md ring-2 ring-sky-500/40'
                    : 'bg-sky-50 hover:bg-sky-100 text-sky-950 border-sky-300'
                }`}
              >
                <span className="text-[10px] font-sans font-bold uppercase block opacity-90">2. Personas Jurídicas (Empresas RIF)</span>
                <span className="text-sm font-black mt-0.5 block">Bs. 528.578.549,25</span>
                <span className="text-[10px] font-bold opacity-90">$726.080,44 USD &middot; 7 Referencias Bancarias</span>
              </button>

              <button
                type="button"
                onClick={() => setAdvancesFilter('TORREFACTORA_BANESCO')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  advancesFilter === 'TORREFACTORA_BANESCO'
                    ? 'bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/40'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                }`}
              >
                <span className="text-[10px] font-sans font-bold uppercase block opacity-90">3. Cartera Torrefactoras Banesco</span>
                <span className="text-sm font-black mt-0.5 block">Bs. 1.013.438.543,38</span>
                <span className="text-[10px] font-bold opacity-90">$1.544.405,79 USD &middot; TRANS.CTAS Mismo Banco</span>
              </button>
            </div>

            {/* Título Dinámico según Filtro Activo */}
            <div className="bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-300 flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase font-sans flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                {advancesFilter === 'PERSONA_NATURAL' && 'CUADRO DETALLADO: 15 ABONOS DE PERSONAS NATURALES QUE OTORGARON ANTICIPO (BANESCO)'}
                {advancesFilter === 'PERSONA_JURIDICA' && 'CUADRO DETALLADO: PERSONAS JURÍDICAS QUE OTORGARON ANTICIPO EN VENTAS (BANESCO)'}
                {advancesFilter === 'TORREFACTORA_BANESCO' && 'CUADRO DETALLADO: CARTERA MAYORISTA DE TORREFACTORAS BANESCO (TRANS.CTAS)'}
                {advancesFilter === 'ALL' && 'LISTA CONSOLIDADA COMPLETA DE ANTICIPOS A CLIENTES (PERSONAS NATURALES Y JURÍDICAS)'}
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-600">
                Mostrando {
                  ADVANCE_CLIENT_INDIVIDUAL_DETAILS.filter((item) => {
                    if (advancesFilter === 'PERSONA_NATURAL') return item.category === 'PERSONA_NATURAL';
                    if (advancesFilter === 'PERSONA_JURIDICA') return item.category === 'PERSONA_JURIDICA';
                    if (advancesFilter === 'TORREFACTORA_BANESCO') return item.category === 'TORREFACTORA_BANESCO';
                    return true;
                  }).length
                } registro(s)
              </span>
            </div>

            {/* Tabla Detallada Filtrada */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-xs text-left text-slate-800">
                <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b-2 border-slate-300 font-mono font-bold">
                  <tr>
                    <th className="px-3 py-2.5"># Ref</th>
                    <th className="px-2.5 py-2.5">Fecha</th>
                    <th className="px-3 py-2.5">Categoría & Identificación del Cliente</th>
                    <th className="px-2.5 py-2.5">Ref. Banesco</th>
                    <th className="px-3 py-2.5">Descripción en Extracto Banesco</th>
                    <th className="px-3 py-2.5 text-right text-emerald-900 font-black">Monto (Bs.)</th>
                    <th className="px-2.5 py-2.5 text-right">Tasa BCV</th>
                    <th className="px-3 py-2.5 text-right text-slate-900 font-black">Monto (US$)</th>
                    <th className="px-3 py-2.5">Comprobante & Soporte NIIF 15</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-num">
                  {ADVANCE_CLIENT_INDIVIDUAL_DETAILS.filter((item) => {
                    if (advancesFilter === 'PERSONA_NATURAL') return item.category === 'PERSONA_NATURAL';
                    if (advancesFilter === 'PERSONA_JURIDICA') return item.category === 'PERSONA_JURIDICA';
                    if (advancesFilter === 'TORREFACTORA_BANESCO') return item.category === 'TORREFACTORA_BANESCO';
                    return true;
                  }).map((item) => {
                    const isNatural = item.category === 'PERSONA_NATURAL';
                    const isJuridica = item.category === 'PERSONA_JURIDICA';
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isNatural
                            ? 'bg-emerald-50/70 hover:bg-emerald-100/80 font-medium'
                            : isJuridica
                            ? 'bg-sky-50/50 hover:bg-sky-100/70 font-medium'
                            : 'hover:bg-amber-50/60'
                        }`}
                      >
                        <td className="px-3 py-2.5 font-mono text-[11px] font-bold text-slate-700">{item.id}</td>
                        <td className="px-2.5 py-2.5 text-slate-700 whitespace-nowrap">{item.date}</td>
                        <td className="px-3 py-2.5 font-sans">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase mb-0.5 ${
                            isNatural
                              ? 'bg-emerald-200 text-emerald-950 border border-emerald-300'
                              : isJuridica
                              ? 'bg-sky-200 text-sky-950 border border-sky-300'
                              : 'bg-amber-200 text-amber-950 border border-amber-300'
                          }`}>
                            {item.categoryLabel}
                          </span>
                          <span className="block font-bold text-slate-900 text-xs">{item.clientName}</span>
                          <span className="text-[10px] text-slate-500 block">{item.clientRifCi}</span>
                        </td>
                        <td className="px-2.5 py-2.5 font-mono font-bold text-slate-800 whitespace-nowrap">{item.reference}</td>
                        <td className="px-3 py-2.5 font-sans text-xs text-slate-700 max-w-xs">{item.bankDescription}</td>
                        <td className="px-3 py-2.5 text-right font-black text-emerald-950 whitespace-nowrap">
                          Bs. {item.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-2.5 py-2.5 text-right text-slate-600 whitespace-nowrap">
                          Bs. {item.bcvRate.toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-black text-slate-950 whitespace-nowrap">
                          ${item.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 py-2.5 font-sans text-[11px]">
                          <span className="font-bold text-slate-800 block">{item.supportRef}</span>
                          <span className="text-[10px] text-slate-500 leading-tight block">{item.notes}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 text-slate-950 font-mono-num font-bold text-xs border-t-2 border-b-4 border-double border-slate-900">
                  <tr>
                    <td colSpan={5} className="px-3 py-3 uppercase font-sans tracking-wider text-slate-900 font-black">
                      SUBTOTAL / TOTAL FILTRADO EN TABLA
                    </td>
                    <td className="px-3 py-3 text-right text-slate-950 font-black">
                      Bs. {ADVANCE_CLIENT_INDIVIDUAL_DETAILS.filter((item) => {
                        if (advancesFilter === 'PERSONA_NATURAL') return item.category === 'PERSONA_NATURAL';
                        if (advancesFilter === 'PERSONA_JURIDICA') return item.category === 'PERSONA_JURIDICA';
                        if (advancesFilter === 'TORREFACTORA_BANESCO') return item.category === 'TORREFACTORA_BANESCO';
                        return true;
                      }).reduce((a, b) => a + b.amountVES, 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-2.5 py-3 text-right text-slate-400">—</td>
                    <td className="px-3 py-3 text-right text-slate-950 font-black">
                      ${ADVANCE_CLIENT_INDIVIDUAL_DETAILS.filter((item) => {
                        if (advancesFilter === 'PERSONA_NATURAL') return item.category === 'PERSONA_NATURAL';
                        if (advancesFilter === 'PERSONA_JURIDICA') return item.category === 'PERSONA_JURIDICA';
                        if (advancesFilter === 'TORREFACTORA_BANESCO') return item.category === 'TORREFACTORA_BANESCO';
                        return true;
                      }).reduce((a, b) => a + b.amountUSD, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-3 font-sans text-[10px] text-slate-600">
                      100% Pasivo Corriente NIIF 15 &middot; Facturación en Octubre 2026
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COMPOSICIÓN DE SALIDAS O CARGOS BANESCO POR CONCEPTO Y MES (BS) */}
      {/* ========================================================================= */}
      {activeTab === 'TABLA_CARGOS_MES' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-red-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-red-200/80 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-red-600" />
                  Composición Oficial de Salidas y Cargos Banesco por Concepto y Mes (Bs) &ndash; Enero a Agosto 2026
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
                  Matriz oficial de débitos y egresos en Banesco (Cuenta Corriente N° 0134-0342-18-3421089912). Muestra el destino detallado de cada desembolso registrado en la contabilidad y estados financieros de la empresa.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-end gap-3 shrink-0">
                <div className="flex items-center gap-1.5 no-print">
                  <button
                    onClick={handleExportTableOutflowExcel}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    title="Exportar a Microsoft Excel (.xlsx) nativo con formato oficial"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Excel (.xlsx)
                  </button>
                  <button
                    onClick={handleExportTableOutflowWord}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                    title="Exportar esta tabla a Microsoft Word (.doc)"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Word (.doc)
                  </button>
                  <button
                    onClick={handleExportTableOutflowPdf}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 shadow-xs"
                    title="Descargar tabla en PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                  <button
                    onClick={() => exportToPdfPrint()}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs transition-all shadow-2xs"
                    title="Imprimir (Ctrl+P)"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-right font-mono-num shadow-xs">
                  <span className="text-[10px] text-red-800 block font-sans font-bold">Total Salidas / Cargos Banesco:</span>
                  <span className="text-lg font-black text-red-950 block">
                    Bs. {BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-red-800 font-bold block">
                    ${BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Resumen explicativo de conciliación */}
            <div className="bg-emerald-50/90 border border-emerald-200 p-4 rounded-xl text-xs space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-950 font-black">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Conciliación Matemática 100% Exacta entre Entradas, Salidas y Saldo en Cuenta Banesco</span>
              </div>
              <p className="text-slate-800 leading-relaxed font-medium">
                (+) Total Abonos / Entradas Banesco (Ene-Ago 2026): <strong className="text-emerald-800 font-bold">Bs. 1.966.597.105,35</strong> ($2.912.368,95 USD) <br />
                (-) Total Cargos / Salidas Banesco (Ene-Ago 2026): <strong className="text-red-700 font-bold">Bs. 1.956.660.113,95</strong> ($2.897.684,28 USD) <br />
                (=) Saldo Conciliado en Banesco al 31/08/2026: <strong className="text-amber-900 font-bold">Bs. 9.936.991,40</strong> ($14.684,67 USD Tasa BCV 676.70 / BBU). El 59.3% de las salidas corresponde al Costo de Ventas para acopio de café verde, y el 19.2% a préstamos corporativos al accionista registrados como Cuentas por Cobrar Socios.
              </p>
            </div>

            {/* Tabla Completa de Salidas y Cargos */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-xs text-left text-slate-800">
                <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b-2 border-slate-300 font-mono font-bold">
                  <tr>
                    <th className="px-3 py-2.5">Concepto / Destino de Fondos</th>
                    <th className="px-2.5 py-2.5 text-right">Ene</th>
                    <th className="px-2.5 py-2.5 text-right">Feb</th>
                    <th className="px-2.5 py-2.5 text-right">Mar</th>
                    <th className="px-2.5 py-2.5 text-right">Abr</th>
                    <th className="px-2.5 py-2.5 text-right">May</th>
                    <th className="px-2.5 py-2.5 text-right">Jun</th>
                    <th className="px-2.5 py-2.5 text-right">Jul</th>
                    <th className="px-2.5 py-2.5 text-right">Ago</th>
                    <th className="px-3 py-2.5 text-right text-slate-900 font-black">Total Bs</th>
                    <th className="px-2.5 py-2.5 text-right text-amber-900 font-black">% Total</th>
                    <th className="px-3 py-2.5 text-right text-emerald-900 font-black">Total US$</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-num">
                  {BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.rows.map((row) => {
                    const isMainCostRow = row.id === 'OUT-03';
                    const isShareholderRow = row.id === 'OUT-06';
                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors ${
                          isMainCostRow
                            ? 'bg-emerald-50/80 font-bold border-y border-emerald-300 hover:bg-emerald-100'
                            : isShareholderRow
                            ? 'bg-blue-50/80 font-semibold border-y border-blue-200 hover:bg-blue-100'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-3 py-2.5 font-sans">
                          <span className={`block font-semibold ${isMainCostRow ? 'text-emerald-950 font-bold text-xs' : isShareholderRow ? 'text-blue-950 font-bold text-xs' : 'text-slate-900 font-bold'}`}>
                            {row.concepto}
                          </span>
                          <span className="text-[10px] text-slate-500 block font-normal mt-0.5">{row.legalClassification}</span>
                        </td>
                        <td className="px-2.5 py-2.5 text-right text-slate-600">{row.ene > 0 ? row.ene.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-600">{row.feb > 0 ? row.feb.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-600">{row.mar > 0 ? row.mar.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-600">{row.abr > 0 ? row.abr.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-600">{row.may > 0 ? row.may.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-700">{row.jun > 0 ? row.jun.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-700">{row.jul > 0 ? row.jul.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-2.5 py-2.5 text-right text-slate-700">{row.ago > 0 ? row.ago.toLocaleString('es-VE') : '—'}</td>
                        <td className="px-3 py-2.5 text-right font-black text-slate-950 whitespace-nowrap">
                          {row.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-2.5 py-2.5 text-right font-black text-amber-900 whitespace-nowrap">
                          {row.pctDelTotal.toFixed(1)}%
                        </td>
                        <td className="px-3 py-2.5 text-right font-black text-emerald-900 whitespace-nowrap">
                          ${row.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 border-t-2 border-b-4 border-double border-slate-900 font-mono-num font-bold text-xs text-slate-950">
                  <tr>
                    <td className="px-3 py-3 uppercase font-sans font-black">TOTAL GENERAL DE SALIDAS Y CARGOS</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.ene.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.feb.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.mar.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.abr.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.may.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.jun.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.jul.toLocaleString('es-VE')}</td>
                    <td className="px-2.5 py-3 text-right">{BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.ago.toLocaleString('es-VE')}</td>
                    <td className="px-3 py-3 text-right text-slate-950 font-black">
                      Bs. {BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-2.5 py-3 text-right text-slate-950 font-black">100.0%</td>
                    <td className="px-3 py-3 text-right text-slate-950 font-black">
                      ${BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026.totals.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CARTA EXPLICATIVA OFICIAL FIRMADA A BANESCO / SENIAT */}
      {/* ========================================================================= */}
      {activeTab === 'CARTA_BANCO_OFICIAL' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border-2 border-blue-200/90 p-5 rounded-2xl shadow-sm no-print">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Carta Explicativa Formal Firmada (Respuesta al Oficio de Banesco)
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
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
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                title="Descargar carta oficial en formato Microsoft Word editable (.doc)"
              >
                <FileDown className="w-4 h-4" />
                Descargar en Word (.doc)
              </button>
              <button
                onClick={handleCopyLetter}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                {copied ? 'Copiado al Portapapeles' : 'Copiar Texto Oficial'}
              </button>
              <button
                onClick={async () => {
                  const letterElement = document.getElementById('carta-banesco-doc-container');
                  if (letterElement) {
                    await downloadElementAsPdf(letterElement, 'Carta_Explicativa_Oficial_Banesco_Agricola_Oni_2026.pdf');
                  }
                }}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                title="Descargar carta oficial en archivo PDF directo"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
              <button
                onClick={() => exportToPdfPrint()}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                title="Imprimir (Ctrl+P)"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                Imprimir
              </button>
            </div>
          </div>

          {/* Official Letter Paper */}
          <div id="carta-banesco-doc-container" className="bg-white text-stone-900 rounded-2xl shadow-xl p-8 sm:p-12 max-w-4xl mx-auto border border-stone-200 text-xs leading-relaxed font-sans print:shadow-none print:border-none print:p-0 print:m-0">
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
              <p className="text-stone-700 font-bold">Atención: Gerencia Senior de Cumplimiento Banesco Banco Universal</p>
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
                    Integrados por el Presidente y accionista propietario Elias Rafael Trías Abreu C.I. V-14.892.301 (Bs. 7.649.975,00) y compradores personas naturales identificadas en extractos Banesco (Bs. 21.845.979,99) por reservas menores y suministros de campo.
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
                    Elias Rafael Trías Abreu &mdash; Presidente / Propietario
                  </span>
                </div>
                <p className="font-bold text-stone-950 mt-1">{company.legalRepresentative}</p>
                <p className="text-[10px] text-stone-600">C.I.: {company.idNumber}</p>
                <p className="text-[10px] text-stone-700 font-semibold">{company.name}</p>
              </div>

              <div className="text-right">
                <div className="h-10 flex items-center justify-end">
                  <span className="font-mono text-emerald-800 text-[10px] border-b border-stone-700 px-4">
                    Licdo. Omar Pérez Castillo &middot; Matrícula C.P.C. 16.336
                  </span>
                </div>
                <p className="font-bold text-stone-950 mt-1">Licdo. Omar Pérez Castillo</p>
                <p className="text-[10px] text-stone-600">Contador Público C.P.C. 16.336</p>
                <p className="text-[10px] text-stone-700 font-semibold">Contador Público Independiente, Ven-Nif</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CONTRATO MUTUO MANUEL BECERRA (47 MOVIMIENTOS) */}
      {/* ========================================================================= */}
      {activeTab === 'MANUEL_BECERRA' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-purple-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-200/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-700 font-extrabold text-xs uppercase tracking-wider font-mono bg-purple-100 px-2.5 py-0.5 rounded border border-purple-300">
                    EXPEDIENTE MUTUO 2026
                  </span>
                  <span className="bg-amber-100 text-amber-950 text-[11px] px-2.5 py-0.5 rounded font-bold border border-amber-300">
                    Límite Aprobado: Bs. 600.000.000,00
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  Movimientos Bancarios Banesco: Contrato de Préstamo Mutuo &ndash; Manuel Becerra
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
                  Manuel Becerra es socio en una empresa vinculada. Se suscribió un <strong>Contrato de Préstamo Mutuo y Línea de Crédito Rotativa</strong> por hasta Bs. 600.000.000,00. Al corte del 31 de agosto de 2026, ya ha reembolsado un porcentaje de los desembolsos recibidos.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 text-right shrink-0 font-mono-num shadow-2xs">
                <span className="text-[10px] text-purple-800 block font-sans font-bold">Saldo Total por Cobrar en Balance:</span>
                <span className="text-xl font-black text-purple-950 block">
                  Bs. {MANUEL_BECERRA_SUMMARY_2026.totalReceivableAugust31VES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-purple-800 font-bold block">
                  ${MANUEL_BECERRA_SUMMARY_2026.totalReceivableUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD (BCV 794,99)
                </span>
              </div>
            </div>

            {/* Cuadro de Cuadre Matemático del Mutuo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono-num">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-600 block font-sans font-bold">Total Desembolsado (Egresos)</span>
                <span className="text-base font-black text-amber-900 block mt-0.5">
                  Bs. {MANUEL_BECERRA_SUMMARY_2026.totalDisbursedVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-slate-500 font-sans font-medium">33 Transferencias prestadas</span>
              </div>

              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-[10px] text-emerald-800 block font-sans font-bold">Total Amortizado (Ingresos)</span>
                <span className="text-base font-black text-emerald-950 block mt-0.5">
                  Bs. {MANUEL_BECERRA_SUMMARY_2026.totalRepaidVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-emerald-800 font-sans font-bold">
                  {MANUEL_BECERRA_SUMMARY_2026.percentagePaidPct.toFixed(2)}% del capital reembolsado
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-600 block font-sans font-bold">Saldo Capital Restante</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">
                  Bs. {MANUEL_BECERRA_SUMMARY_2026.principalBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-slate-500 font-sans font-medium">Capital exigible pendiente</span>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-[10px] text-amber-900 block font-sans font-bold">Intereses Ganados (EEFF)</span>
                <span className="text-base font-black text-amber-950 block mt-0.5">
                  Bs. {MANUEL_BECERRA_SUMMARY_2026.interestIncomeVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-amber-800 font-sans font-medium">Registrado en Estado Resultados</span>
              </div>
            </div>

            {/* Filtros de la Tabla */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por referencia Banesco o fecha..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono shadow-2xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 no-print">
                  <button
                    onClick={handleExportBecerraWord}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                    title="Exportar movimientos del Contrato Mutuo a Word"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Word (.doc)
                  </button>
                  <button
                    onClick={handleExportBecerraCsv}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                    title="Exportar movimientos a Excel (CSV)"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Excel (CSV)
                  </button>
                  <button
                    onClick={handleExportBecerraPdf}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 shadow-2xs"
                    title="Descargar movimientos en archivo PDF directo"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                  <button
                    onClick={() => exportToPdfPrint()}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs transition-all shadow-2xs"
                    title="Imprimir (Ctrl+P)"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={becerraFilter}
                    onChange={(e) => setBecerraFilter(e.target.value as any)}
                    className="bg-white border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500 shadow-2xs"
                  >
                    <option value="TODOS">Todos los Movimientos (47)</option>
                    <option value="EGRESOS">Egresos / Préstamos Otorgados (33)</option>
                    <option value="INGRESOS">Ingresos / Pagos Recibidos (14)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabla Completa de los 47 Movimientos */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-xs text-left text-slate-800">
                <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b-2 border-slate-300 font-mono font-bold">
                  <tr>
                    <th className="px-3 py-2.5 text-center">#</th>
                    <th className="px-3 py-2.5">Fecha</th>
                    <th className="px-3 py-2.5">Referencia Banesco</th>
                    <th className="px-3 py-2.5">Banco / Descripción</th>
                    <th className="px-3 py-2.5 text-right text-amber-900 font-black">Egresos (Préstamo)</th>
                    <th className="px-3 py-2.5 text-right text-emerald-900 font-black">Ingresos (Pagos de Becerra)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-num">
                  {filteredBecerraMovements.map((mov) => (
                    <tr key={mov.item} className="hover:bg-amber-50/50 transition-colors">
                      <td className="px-3 py-2 text-center text-slate-500">{mov.item}</td>
                      <td className="px-3 py-2 text-slate-700 font-medium whitespace-nowrap">{mov.date}</td>
                      <td className="px-3 py-2 font-mono font-bold text-amber-900 whitespace-nowrap">{mov.reference}</td>
                      <td className="px-3 py-2 font-sans text-slate-800 text-[11px] truncate max-w-xs">{mov.description}</td>
                      <td className="px-3 py-2 text-right text-amber-900 font-bold whitespace-nowrap">
                        {mov.outflowVES > 0 ? `Bs. ${mov.outflowVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                      <td className="px-3 py-2 text-right text-emerald-900 font-extrabold whitespace-nowrap">
                        {mov.inflowVES > 0 ? `Bs. ${mov.inflowVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-200 border-t-2 border-slate-400 font-mono-num font-bold text-xs text-slate-950">
                  <tr>
                    <td colSpan={4} className="px-3 py-2.5 text-right text-slate-950 uppercase font-sans font-bold">
                      Totales de la Operación Mutuo 2026:
                    </td>
                    <td className="px-3 py-2.5 text-right text-amber-950 font-black">
                      Bs. {MANUEL_BECERRA_SUMMARY_2026.totalDisbursedVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2.5 text-right text-emerald-950 font-black">
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
      {/* TAB 5: CONCILIACIÓN TÉCNICA BANESCO VS ESTADOS FINANCIEROS */}
      {/* ========================================================================= */}
      {activeTab === 'CONCILIACION_BANCO' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-teal-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="border-b border-teal-200/80 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-red-100 text-red-700 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    Respuesta Técnica a la Carta de Banesco: Discrepancia de Ingresos vs Depósitos
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  El Banco Banesco envió una comunicación observando que los <strong>depósitos bancarios (Bs. 1.966.597.105,35 / USD 2.781.830,18)</strong> no coinciden con los <strong>ingresos del Estado de Resultados al 31/08/2026 (Bs. 92.641.520,01 / USD 116.531,68)</strong>.
                  Esta diferencia se debe a que el banco confunde el <em>Flujo de Caja Bruto</em> con los <em>Ingresos Fiscales Devengados</em>. A continuación se presenta la demostración técnica irrefutable:
                </p>
              </div>

              <div className="flex items-center gap-1.5 no-print shrink-0">
                <button
                  onClick={handleExportConciliacionWord}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                  title="Descargar conciliación técnica en Word"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Word (.doc)
                </button>
                <button
                  onClick={handleExportConciliacionPdf}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 shadow-2xs"
                  title="Descargar conciliación en PDF directo"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={() => exportToPdfPrint()}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs transition-all shadow-2xs"
                  title="Imprimir (Ctrl+P)"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cuadro de Conciliación Demostrativo */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3 font-mono">
                <span className="text-xs text-slate-700 uppercase font-sans font-bold">Total Depósitos Registrados en Extracto Banesco:</span>
                <span className="text-lg font-black text-emerald-800">Bs. {BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.bankDepositsTotalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="space-y-3 text-xs">
                {BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.breakdown.map((row, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <span className="font-bold text-slate-900">{row.concept}</span>
                      <span className="font-mono font-bold text-amber-900">
                        {row.bankAmountVES > 0 ? `Bs. ${row.bankAmountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-600">
                      <span className="text-amber-800 font-mono font-bold">{row.nature}</span>
                      {row.impactOnIncomeStatement > 0 && (
                        <span className="text-emerald-800 font-mono font-bold">
                          Impacto en EEFF: +Bs. {row.impactOnIncomeStatement.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 font-medium">{row.legalNotes}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t-2 border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono">
                <span className="text-xs text-slate-800 uppercase font-sans font-bold">
                  Ingresos Netos Auditados según Estado de Resultados (Corte 31/08/2026):
                </span>
                <span className="text-lg font-black text-slate-900">
                  Bs. {BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.financialStatementRevenuesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Dictamen Jurídico y Contable */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-slate-800 space-y-2 shadow-2xs">
              <h4 className="text-sm font-black text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Conclusión Oficial para la Unidad de Cumplimiento de Banesco
              </h4>
              <p className="leading-relaxed font-medium">
                {BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION.conclusion}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: BALANCE GENERAL COMPARATIVO (2025 VS CORTE AGOSTO 2026) */}
      {/* ========================================================================= */}
      {activeTab === 'EEFF_COMPARATIVO' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-300 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Estado de Situación Financiera Comparativo (VEN-NIF)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Al 31 de diciembre de 2025 (Tasa 301,37) y al 31 de agosto de 2026 (Tasa 794,99)
                </p>
              </div>

              <div className="flex items-center gap-1.5 no-print shrink-0">
                <button
                  onClick={handleExportBalanceSheetExcel}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                  title="Descargar Balance General en Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Excel (.xlsx)
                </button>
                <button
                  onClick={handleExportBalanceSheetWord}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                  title="Descargar Balance General en Word"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Word (.doc)
                </button>
                <button
                  onClick={handleExportBalanceSheetPdf}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
                  title="Descargar Balance General en PDF directo"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={() => exportToPdfPrint()}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs transition-all shadow-2xs"
                  title="Imprimir (Ctrl+P)"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-2xs">
              <table className="w-full text-xs text-left text-slate-800">
                <thead className="bg-slate-100 text-slate-900 uppercase text-[10px] tracking-wider border-y-2 border-black font-mono font-bold">
                  <tr>
                    <th className="px-4 py-2.5">Concepto / Denominación</th>
                    <th className="px-4 py-2.5 text-right">Al 31/12/2025 (Bs.)</th>
                    <th className="px-4 py-2.5 text-right">Al 31/12/2025 (US$)</th>
                    <th className="px-4 py-2.5 text-right text-slate-900 font-bold">Al 31/08/2026 (Bs.)</th>
                    <th className="px-4 py-2.5 text-right text-slate-900 font-bold">Al 31/08/2026 (US$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-num">
                  {/* ACTIVO */}
                  <tr className="bg-slate-100 font-bold text-slate-900 uppercase text-[11px] border-y border-slate-300">
                    <td colSpan={5} className="px-4 py-2">ACTIVO</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-800">
                    <td colSpan={5} className="px-4 py-1.5 pl-6">Activo Corriente (Circulante)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">Efectivo en Caja y Bancos (Banesco Cta. Cte.)</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">{BALANCE_SHEET_2025.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">${(BALANCE_SHEET_2025.assets.current.cashAndBanks / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-950 font-bold">{BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-700 font-bold">${(BALANCE_SHEET_AUGUST_2026.assets.current.cashAndBanks / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">Cuentas por Cobrar Comerciales Clientes (Corte 2025)</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">{BALANCE_SHEET_2025.assets.current.tradeReceivables.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">${(BALANCE_SHEET_2025.assets.current.tradeReceivables / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">Cuentas por Cobrar Socios - Transferencias Fondos Banesco (Elías Rafael Trías Abreu V-23.997.829)</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-900 font-semibold">{(BALANCE_SHEET_AUGUST_2026.assets.current.shareholderAdvancesReceivable || 375630000.00).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-700">${((BALANCE_SHEET_AUGUST_2026.assets.current.shareholderAdvancesReceivable || 375630000.00) / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">Cuentas por Cobrar Socios - Préstamo Mutuo Manuel Becerra</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-900 font-bold">{BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-700 font-bold">${(BALANCE_SHEET_AUGUST_2026.assets.current.manuelBecerraReceivable / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">Retención ISLR Clientes / por Compensar</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">{BALANCE_SHEET_2025.assets.current.islrWithholdingClients.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">${(BALANCE_SHEET_2025.assets.current.islrWithholdingClients / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">{BALANCE_SHEET_AUGUST_2026.assets.current.islrWithholdingClients.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">${(BALANCE_SHEET_AUGUST_2026.assets.current.islrWithholdingClients / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">ISLR Pagado por Anticipado / Crédito Fiscal Exigible</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">{BALANCE_SHEET_2025.assets.current.prepaidISLR.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">${(BALANCE_SHEET_2025.assets.current.prepaidISLR / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">{BALANCE_SHEET_AUGUST_2026.assets.current.prepaidISLR.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">${(BALANCE_SHEET_AUGUST_2026.assets.current.prepaidISLR / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold border-t border-b border-slate-300">
                    <td className="px-4 py-1.5 pl-6 text-slate-950">Total Activo Corriente</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">{BALANCE_SHEET_2025.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">${(BALANCE_SHEET_2025.assets.current.totalCurrent / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-950 font-bold">{BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800 font-bold">${(BALANCE_SHEET_AUGUST_2026.assets.current.totalCurrent / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>

                  {/* PROPIEDAD PLANTA Y EQUIPOS */}
                  <tr className="bg-slate-50 font-bold text-slate-800">
                    <td colSpan={5} className="px-4 py-1.5 pl-6">Propiedad, Planta y Equipos (Nota 7)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">Total Propiedad, Planta y Equipos Neta</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">{BALANCE_SHEET_2025.assets.propertyPlantEquipment.totalPPE.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">${(BALANCE_SHEET_2025.assets.propertyPlantEquipment.totalPPE / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">{BALANCE_SHEET_AUGUST_2026.assets.propertyPlantEquipment.totalPPE.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">${(BALANCE_SHEET_AUGUST_2026.assets.propertyPlantEquipment.totalPPE / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-white font-bold text-slate-950 border-t-2 border-b-2 border-slate-900">
                    <td className="px-4 py-2 font-black">TOTAL ACTIVO</td>
                    <td className="px-4 py-2 text-right">{BALANCE_SHEET_2025.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">${(BALANCE_SHEET_2025.assets.totalAssets / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-950 font-black">{BALANCE_SHEET_AUGUST_2026.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-950 font-black">${(BALANCE_SHEET_AUGUST_2026.assets.totalAssets / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>

                  {/* PASIVO */}
                  <tr className="bg-slate-100 font-bold text-slate-900 uppercase text-[11px] border-y border-slate-300">
                    <td colSpan={5} className="px-4 py-2">PASIVO</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-800">
                    <td colSpan={5} className="px-4 py-1.5 pl-6">Pasivo Corriente (Circulante)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium font-bold">Anticipos Recibidos de Clientes (NIIF 15 - Saldo Neto por Ejecutar)</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-950 font-bold">{(BALANCE_SHEET_AUGUST_2026.liabilities.current.customerAdvances || 297098072.62).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800 font-bold">${((BALANCE_SHEET_AUGUST_2026.liabilities.current.customerAdvances || 297098072.62) / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">Retención de ISLR por Pagar (Originada por Anticipos de Clientes 2% Decreto 1808)</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-900 font-bold">{(BALANCE_SHEET_AUGUST_2026.liabilities.current.islrWithheldOnAdvancesPayable || 31277261.45).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-700 font-bold">${((BALANCE_SHEET_AUGUST_2026.liabilities.current.islrWithheldOnAdvancesPayable || 31277261.45) / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">Cuentas por Pagar Socios (Aportes Accionista Elias Rafael Trías Abreu V-23.997.829 / Omar Pérez)</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-900 font-bold">{BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800 font-bold">${(BALANCE_SHEET_AUGUST_2026.liabilities.current.shareholderPayables / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">I.S.L.R. por Pagar / Provisiones Tributarias</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">{BALANCE_SHEET_2025.liabilities.current.islrPayable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">${(BALANCE_SHEET_2025.liabilities.current.islrPayable / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">{BALANCE_SHEET_AUGUST_2026.liabilities.current.islrPayable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">${(BALANCE_SHEET_AUGUST_2026.liabilities.current.islrPayable / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-600 font-normal italic">IGTF 3% Efectivo Divisas por Pagar (Derogado 2% Transferencias Bancarias)</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-400">—</td>
                    <td className="px-4 py-1.5 text-right text-slate-600 font-mono">{(BALANCE_SHEET_AUGUST_2026.liabilities.current.igtfPayable || 0.00).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-600 font-mono">$0.00</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold border-t border-b border-slate-300">
                    <td className="px-4 py-1.5 pl-6 text-slate-950">TOTAL PASIVO (PASIVO CORRIENTE)</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">{BALANCE_SHEET_2025.liabilities.totalLiabilities.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">${(BALANCE_SHEET_2025.liabilities.totalLiabilities / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-950 font-bold">{BALANCE_SHEET_AUGUST_2026.liabilities.totalLiabilities.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800 font-bold">${(BALANCE_SHEET_AUGUST_2026.liabilities.totalLiabilities / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>

                  {/* PATRIMONIO */}
                  <tr className="bg-slate-100 font-bold text-slate-900 uppercase text-[11px] border-y border-slate-300">
                    <td colSpan={5} className="px-4 py-2">PATRIMONIO NETO</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">Capital Social Suscrito y Pagado</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">{BALANCE_SHEET_2025.equity.subscribedCapital.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">${(BALANCE_SHEET_2025.equity.subscribedCapital / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">{BALANCE_SHEET_AUGUST_2026.equity.subscribedCapital.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">${(BALANCE_SHEET_AUGUST_2026.equity.subscribedCapital / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">Superávit Acumulado (Ejercicios Anteriores)</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">{BALANCE_SHEET_2025.equity.accumulatedSurplus.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">${(BALANCE_SHEET_2025.equity.accumulatedSurplus / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">{BALANCE_SHEET_AUGUST_2026.equity.accumulatedSurplus.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">${(BALANCE_SHEET_AUGUST_2026.equity.accumulatedSurplus / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium font-bold">Utilidad Neta del Ejercicio (Ene-Ago 2026)</td>
                    <td className="px-4 py-1.5 text-right text-slate-800 font-bold">{BALANCE_SHEET_2025.equity.periodProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800 font-bold">${(BALANCE_SHEET_2025.equity.periodProfit / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-950 font-bold">{BALANCE_SHEET_AUGUST_2026.equity.periodProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-950 font-bold">${(BALANCE_SHEET_AUGUST_2026.equity.periodProfit / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-1.5 pl-8 text-slate-900 font-medium">Reserva Legal (5% Código de Comercio)</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">{BALANCE_SHEET_2025.equity.legalReserve.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-600">${(BALANCE_SHEET_2025.equity.legalReserve / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">{BALANCE_SHEET_AUGUST_2026.equity.legalReserve.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">${(BALANCE_SHEET_AUGUST_2026.equity.legalReserve / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold border-t border-b border-slate-300">
                    <td className="px-4 py-1.5 pl-6 text-slate-950">TOTAL PATRIMONIO NETO</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">{BALANCE_SHEET_2025.equity.totalEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-800">${(BALANCE_SHEET_2025.equity.totalEquity / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-950 font-bold">{BALANCE_SHEET_AUGUST_2026.equity.totalEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-1.5 text-right text-slate-950 font-bold">${(BALANCE_SHEET_AUGUST_2026.equity.totalEquity / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-white text-slate-950 font-black border-t-2 border-b-4 border-double border-black">
                    <td className="px-4 py-2.5 font-black">TOTAL PASIVO Y PATRIMONIO</td>
                    <td className="px-4 py-2.5 text-right text-slate-900">{BALANCE_SHEET_2025.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-slate-900">${(BALANCE_SHEET_2025.totalLiabilitiesAndEquity / BALANCE_SHEET_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-slate-950 font-black">{BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-slate-950 font-black">${(BALANCE_SHEET_AUGUST_2026.totalLiabilitiesAndEquity / BALANCE_SHEET_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: ESTADO DE RESULTADOS INTEGRAL (2025 VS AGOSTO 2026) */}
      {/* ========================================================================= */}
      {activeTab === 'ESTADO_RESULTADOS' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-300 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Estado de Resultado Integral Comparativo
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Ejercicio 2025 cerrado vs Corte de 8 meses al 31 de agosto de 2026
                </p>
              </div>

              <div className="flex items-center gap-1.5 no-print shrink-0">
                <button
                  onClick={handleExportIncomeStatementExcel}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                  title="Descargar Estado de Resultados en Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Excel (.xlsx)
                </button>
                <button
                  onClick={handleExportIncomeStatementWord}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                  title="Descargar Estado de Resultados en Word"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Word (.doc)
                </button>
                <button
                  onClick={handleExportIncomeStatementPdf}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
                  title="Descargar Estado de Resultados en PDF directo"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={() => exportToPdfPrint()}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs transition-all shadow-2xs"
                  title="Imprimir (Ctrl+P)"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-2xs">
              <table className="w-full text-xs text-left text-slate-800">
                <thead className="bg-slate-100 text-slate-900 uppercase text-[10px] tracking-wider border-y-2 border-black font-mono font-bold">
                  <tr>
                    <th className="px-4 py-2.5">Concepto</th>
                    <th className="px-4 py-2.5 text-right">Año 2025 (Bs.)</th>
                    <th className="px-4 py-2.5 text-right">Año 2025 (US$)</th>
                    <th className="px-4 py-2.5 text-right text-slate-900 font-bold">Ene-Ago 2026 (Bs.)</th>
                    <th className="px-4 py-2.5 text-right text-slate-900 font-bold">Ene-Ago 2026 (US$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono-num">
                  <tr className="bg-slate-100 font-bold text-slate-900 uppercase text-[11px] border-y border-slate-300">
                    <td colSpan={5} className="px-4 py-2">INGRESOS OPERACIONALES Y FINANCIEROS</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2 pl-6 text-slate-900 font-medium">Ingresos por Servicios Agrícolas</td>
                    <td className="px-4 py-2 text-right text-slate-600">{INCOME_STATEMENT_2025.revenues.agriculturalServices.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-600">${(INCOME_STATEMENT_2025.revenues.agriculturalServices / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-950 font-bold">{INCOME_STATEMENT_AUGUST_2026.revenues.agriculturalServices.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-800 font-bold">${(INCOME_STATEMENT_AUGUST_2026.revenues.agriculturalServices / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2 pl-6 text-slate-900 font-medium">Ingresos por Intereses (Contrato Mutuo Manuel Becerra)</td>
                    <td className="px-4 py-2 text-right text-slate-400">—</td>
                    <td className="px-4 py-2 text-right text-slate-400">—</td>
                    <td className="px-4 py-2 text-right text-slate-950 font-bold">{INCOME_STATEMENT_AUGUST_2026.revenues.interestIncome.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-800 font-bold">${(INCOME_STATEMENT_AUGUST_2026.revenues.interestIncome / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-950 border-t border-b border-slate-300">
                    <td className="px-4 py-2">TOTAL INGRESOS</td>
                    <td className="px-4 py-2 text-right text-slate-800">{INCOME_STATEMENT_2025.revenues.totalRevenues.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-800">${(INCOME_STATEMENT_2025.revenues.totalRevenues / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-950 font-bold">{INCOME_STATEMENT_AUGUST_2026.revenues.totalRevenues.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-800 font-bold">${(INCOME_STATEMENT_AUGUST_2026.revenues.totalRevenues / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2 pl-6 text-slate-900 font-medium">Costos de Servicios</td>
                    <td className="px-4 py-2 text-right text-slate-600">{INCOME_STATEMENT_2025.costs.serviceCosts.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-600">${(INCOME_STATEMENT_2025.costs.serviceCosts / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-800 font-semibold">{INCOME_STATEMENT_AUGUST_2026.costs.serviceCosts.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-800 font-semibold">${(INCOME_STATEMENT_AUGUST_2026.costs.serviceCosts / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-950 border-t border-b border-slate-300">
                    <td className="px-4 py-2">UTILIDAD BRUTA</td>
                    <td className="px-4 py-2 text-right text-slate-800">{INCOME_STATEMENT_2025.costs.grossProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-800">${(INCOME_STATEMENT_2025.costs.grossProfit / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-950 font-bold">{INCOME_STATEMENT_AUGUST_2026.costs.grossProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-800 font-bold">${(INCOME_STATEMENT_AUGUST_2026.costs.grossProfit / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2 pl-6 text-slate-900 font-medium">Gastos de Administración</td>
                    <td className="px-4 py-2 text-right text-slate-600">{INCOME_STATEMENT_2025.operatingExpenses.administrativeExpenses.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-600">${(INCOME_STATEMENT_2025.operatingExpenses.administrativeExpenses / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-400">—</td>
                    <td className="px-4 py-2 text-right text-slate-400">—</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold border-t border-slate-300">
                    <td className="px-4 py-2">UTILIDAD EN OPERACIONES</td>
                    <td className="px-4 py-2 text-right text-slate-800">{INCOME_STATEMENT_2025.operatingExpenses.operatingProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-800">${(INCOME_STATEMENT_2025.operatingExpenses.operatingProfit / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-950 font-bold">{INCOME_STATEMENT_AUGUST_2026.operatingExpenses.operatingProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right text-slate-800 font-bold">${(INCOME_STATEMENT_AUGUST_2026.operatingExpenses.operatingProfit / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="bg-white text-slate-950 font-black border-t-2 border-b-4 border-double border-black">
                    <td className="px-4 py-2.5 font-black">UTILIDAD NETA DEL EJERCICIO</td>
                    <td className="px-4 py-2.5 text-right">{INCOME_STATEMENT_2025.taxesAndReserves.netProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right">${(INCOME_STATEMENT_2025.taxesAndReserves.netProfit / INCOME_STATEMENT_2025.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-slate-950 font-black">{INCOME_STATEMENT_AUGUST_2026.taxesAndReserves.netProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2.5 text-right text-slate-950 font-black">${(INCOME_STATEMENT_AUGUST_2026.taxesAndReserves.netProfit / INCOME_STATEMENT_AUGUST_2026.exchangeRateBCV).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
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
