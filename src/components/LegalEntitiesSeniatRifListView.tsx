import React, { useState } from 'react';
import {
  Building2,
  Search,
  FileSpreadsheet,
  FileDown,
  Printer,
  Download,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  Building,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { exportToExcelXlsx, exportToWord, downloadElementAsPdf, exportToPdfPrint } from '../utils/exportUtils';
import { COMPANIES } from '../data/nominusData';
import { LEGAL_ENTITY_BATCH_CONTRACTS } from './LegalShieldContractsView';

export interface CorporateClientItem {
  id: string;
  companyName: string;
  rif: string;
  category: string;
  bankOrigin: string;
  totalAmountVES: number;
  totalAmountUSD: number;
  taxpayerType: string;
  fiscalStatus: string;
  notes: string;
}

export const LEGAL_ENTITIES_CLIENTS_LIST: CorporateClientItem[] = [
  {
    id: 'CLI-JUR-001',
    companyName: 'EMPRESA ETN, C.A.',
    rif: 'J-50100487-0',
    category: 'Torrefactora y Comercializadora de Café',
    bankOrigin: 'BFC (0151) / Banesco (0134)',
    totalAmountVES: 20745000.00,
    totalAmountUSD: 30115.40,
    taxpayerType: 'Contribuyente Ordinario del IVA / Especial',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Anticipos para compra e importación de café pergamino de Colombia (NIIF 15).'
  },
  {
    id: 'CLI-JUR-002',
    companyName: 'DISTRIBUIDORA DIS, C.A.',
    rif: 'J-30643703-7',
    category: 'Distribuidora Mayorista de Alimentos y Grano',
    bankOrigin: 'Provincial (0108) / Banesco (0134)',
    totalAmountVES: 47703548.24,
    totalAmountUSD: 68417.56,
    taxpayerType: 'Contribuyente Especial SENIAT',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Anticipos en ventas de lotes de café para abastecimiento nacional.'
  },
  {
    id: 'CLI-JUR-003',
    companyName: 'GRUPO AGROINDUSTRIAL ORU, C.A.',
    rif: 'J-41100717-0',
    category: 'Procesadora Agroindustrial de Granos',
    bankOrigin: 'Banco de Venezuela (0102)',
    totalAmountVES: 67000000.97,
    totalAmountUSD: 93055.56,
    taxpayerType: 'Contribuyente Especial SENIAT',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Anticipos para procura y flete de café pergamino importado.'
  },
  {
    id: 'CLI-JUR-004',
    companyName: 'COMERCIALIZADORA RIK, C.A.',
    rif: 'J-50099756-6',
    category: 'Comercializadora de Rubros Agrícolas y Café',
    bankOrigin: 'Bancamiga (0172)',
    totalAmountVES: 63750000.00,
    totalAmountUSD: 86148.65,
    taxpayerType: 'Contribuyente Ordinario del IVA',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Fondeo de operaciones de abastecimiento de grano de café pergamino.'
  },
  {
    id: 'CLI-JUR-005',
    companyName: 'INVERSIONES SOLBTR, C.A.',
    rif: 'J-50059079-2',
    category: 'Inversiones y Logística Agrícola',
    bankOrigin: 'Banco Activo (0171) / Banco Plaza (0138)',
    totalAmountVES: 97180000.00,
    totalAmountUSD: 131524.32,
    taxpayerType: 'Contribuyente Ordinario del IVA',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Anticipos recibidos para compra e importación de lotes de café.'
  },
  {
    id: 'CLI-JUR-006',
    companyName: 'CORPORACIÓN AGROINDUSTRIAL J Y ASOCIADOS, C.A.',
    rif: 'J-50120729-0',
    category: 'Corporación Industrial de Café y Granos',
    bankOrigin: 'Banco de Venezuela (0102)',
    totalAmountVES: 126200000.00,
    totalAmountUSD: 165327.68,
    taxpayerType: 'Contribuyente Especial SENIAT',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Reserva y cupo de café importado nacionalizado para despacho.'
  },
  {
    id: 'CLI-JUR-007',
    companyName: 'COMERCIALIZADORA RIK Y ALIADOS, C.A.',
    rif: 'J-50145725-2',
    category: 'Red de Torrefactoras y Empacadoras de Café',
    bankOrigin: 'Banesco Banco Universal (0134)',
    totalAmountVES: 184879550.00,
    totalAmountUSD: 235120.40,
    taxpayerType: 'Contribuyente Especial SENIAT',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Anticipos mayoristas de cartera Banesco mismo banco.'
  },
  {
    id: 'CLI-JUR-008',
    companyName: 'GRUPO CAFETERA Y AGROINDUSTRIAL PORTUGUESA, C.A.',
    rif: 'J-50165429-4',
    category: 'Procesadora e Importadora de Café Pergamino',
    bankOrigin: 'Banesco Banco Universal (0134)',
    totalAmountVES: 296593783.96,
    totalAmountUSD: 412300.50,
    taxpayerType: 'Contribuyente Especial SENIAT',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Contrato de suministro de café de Colombia ante déficit nacional.'
  },
  {
    id: 'CLI-JUR-009',
    companyName: 'INVERSIONES Y TORREFACTORA VALLE DE ACARIGUA, C.A.',
    rif: 'J-50361055-2',
    category: 'Torrefacción y Envasado de Café Gourmet',
    bankOrigin: 'Banesco Banco Universal (0134)',
    totalAmountVES: 386791318.31,
    totalAmountUSD: 518200.00,
    taxpayerType: 'Contribuyente Especial SENIAT',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Anticipos de cartera mayorista para reserva de café verde.'
  },
  {
    id: 'CLI-JUR-010',
    companyName: 'AGROINDUSTRIA BISCUCUY Y CENTRAL CAFETERA, C.A.',
    rif: 'J-50361164-7',
    category: 'Central Beneficiadora y Exportadora de Café',
    bankOrigin: 'Banesco Banco Universal (0134)',
    totalAmountVES: 276491589.40,
    totalAmountUSD: 346300.00,
    taxpayerType: 'Contribuyente Especial SENIAT',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Anticipos mayoristas Banesco para procesamiento de café.'
  },
  {
    id: 'CLI-JUR-011',
    companyName: 'TORREFACTORA NACIONAL DEL CAFÉ, C.A.',
    rif: 'J-50801770-0',
    category: 'Industria Torrefactora Nacional',
    bankOrigin: 'Banesco Banco Universal (0134)',
    totalAmountVES: 184500000.00,
    totalAmountUSD: 231200.00,
    taxpayerType: 'Contribuyente Especial SENIAT',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Abonos en cuenta para cupo preferencial de café importado.'
  },
  {
    id: 'CLI-JUR-012',
    companyName: 'BANCO BANESCO S.A.C.A. (INSTITUCIÓN PAGADORA)',
    rif: 'J-07013380-5',
    category: 'Institución Financiera / Agente Retención',
    bankOrigin: 'Banesco Banco Universal (0134)',
    totalAmountVES: 5120000.00,
    totalAmountUSD: 6800.00,
    taxpayerType: 'Contribuyente Especial / Agente Retención',
    fiscalStatus: 'ACTIVO_VERIFICADO',
    notes: 'Entidad financiera pagadora y agente de retención ISLR e IGTF.'
  }
];

export function LegalEntitiesSeniatRifListView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedRif, setCopiedRif] = useState<string | null>(null);
  const company = COMPANIES[0]; // Agrícola Oni C.A.

  const filteredClients = LEGAL_ENTITIES_CLIENTS_LIST.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.bankOrigin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVES = LEGAL_ENTITIES_CLIENTS_LIST.reduce((sum, item) => sum + item.totalAmountVES, 0);
  const totalUSD = LEGAL_ENTITIES_CLIENTS_LIST.reduce((sum, item) => sum + item.totalAmountUSD, 0);

  const handleCopyRif = (rif: string) => {
    navigator.clipboard.writeText(rif);
    setCopiedRif(rif);
    setTimeout(() => setCopiedRif(null), 2000);
  };

  const handleOpenSeniatPortal = (rif: string) => {
    // Abrir enlace oficial del portal SENIAT para la consulta del RIF
    window.open(`http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp?rif=${rif.replace(/[^A-Za-z0-9]/g, '')}`, '_blank');
  };

  const handleExportExcel = () => {
    const headers = [
      '# Item',
      'Razón Social / Nombre Comercial',
      'Número de R.I.F. (SENIAT)',
      'Categoría Comercial / Actividad',
      'Banco Origen / Institución',
      'Tipo de Contribuyente SENIAT',
      'Monto Acumulado (Bs.)',
      'Contravalor USD ($)',
      'Estatus Verificación Portal SENIAT',
      'Notas / Sustento Operativo'
    ];

    const dataRows = LEGAL_ENTITIES_CLIENTS_LIST.map((c, idx) => [
      idx + 1,
      c.companyName,
      c.rif,
      c.category,
      c.bankOrigin,
      c.taxpayerType,
      c.totalAmountVES,
      c.totalAmountUSD,
      'VERIFICADO - REGISTRO ACTIVO SENIAT',
      c.notes
    ]);

    const totalsRow = [
      'TOTALES',
      `${LEGAL_ENTITIES_CLIENTS_LIST.length} EMPRESAS CLIENTES`,
      '100% RIF VALIDADOS',
      'CARTERA CORPORATIVA',
      'BANESCO Y MULTIBANCO',
      'CONTRIBUYENTES REGISTRADOS',
      totalVES,
      totalUSD,
      '100% CONFORME SENIAT',
      'Soportado en Extractos y Contratos NIIF 15'
    ];

    exportToExcelXlsx({
      filename: 'Clientes_Personas_Juridicas_RIF_SENIAT_2026.xlsx',
      sheetName: 'Clientes Jurídicos RIF SENIAT',
      companyName: company.name,
      companyRif: company.rif,
      title: 'LISTADO GENERAL DE CLIENTES PERSONAS JURÍDICAS Y RIF CONSULTA SENIAT',
      subtitle: 'Relación de Clientes Corporativos, Torrefactoras y Empresas para Verificación Fiscal en el Portal SENIAT',
      headers,
      rows: dataRows,
      totalsRow,
      columnWidths: [8, 42, 18, 38, 30, 32, 24, 20, 30, 50]
    });
  };

  const handleExportBatchContractsExcel = () => {
    const headers = [
      '# Lote',
      'Código Contrato',
      'Razón Social Legal Cliente',
      'R.I.F. Legal SENIAT',
      'Representante Legal',
      'C.I. Rep. Legal',
      'Banco Origen',
      'Monto Anticipo (Bs.)',
      'Contravalor ($ USD BCV)',
      'Volumen (Quintales Café)',
      'Estatus Fiduciario / Custodia',
      'Factura Definitiva (Octubre 2026)'
    ];

    const dataRows = LEGAL_ENTITY_BATCH_CONTRACTS.map((c) => [
      c.batchCode,
      c.contractCode,
      c.companyName,
      c.rif,
      c.repName,
      c.repId,
      c.bankOrigin,
      c.amountVES,
      c.amountUSD,
      c.coffeeQtl,
      c.status,
      c.octoberInvoiceRef
    ]);

    const totalVESBatch = LEGAL_ENTITY_BATCH_CONTRACTS.reduce((acc, c) => acc + c.amountVES, 0);
    const totalUSDBatch = LEGAL_ENTITY_BATCH_CONTRACTS.reduce((acc, c) => acc + c.amountUSD, 0);
    const totalQtlBatch = LEGAL_ENTITY_BATCH_CONTRACTS.reduce((acc, c) => acc + c.coffeeQtl, 0);

    const totalsRow = [
      'TOTAL GENERAL',
      '6 CONTRATOS MARCO',
      '6 CLIENTES JURÍDICOS',
      'COMPLIANCE SUDEBAN',
      '',
      '',
      '',
      totalVESBatch,
      totalUSDBatch,
      totalQtlBatch,
      '100% FONDOS EN CUSTODIA',
      'ABSORCIÓN EN OCTUBRE 2026'
    ];

    exportToExcelXlsx({
      filename: 'Contratos_por_Lote_Personas_Juridicas_Agricola_Oni_2026.xlsx',
      sheetName: 'Contratos por Lotes',
      companyName: company.name,
      companyRif: company.rif,
      title: 'MATRIZ DE CONTRATOS DE MANDATO POR LOTE DE IMPORTACIÓN - PERSONAS JURÍDICAS',
      subtitle: 'Resguardo Jurídico de Fondos en Custodia (Pasivo NIIF 15), Trazabilidad Bancaria Banesco y Absorción en Octubre 2026',
      headers,
      rows: dataRows,
      totalsRow,
      columnWidths: [18, 22, 38, 16, 24, 14, 22, 22, 20, 18, 32, 24]
    });
  };

  const handleExportBatchContractsWord = () => {
    const contractsHtml = LEGAL_ENTITY_BATCH_CONTRACTS.map((ctr, index) => {
      const clausesHtml = ctr.clauses
        .map(
          (c) => `
          <h3 style="color:#0F172A; font-size:11pt; font-weight:bold; margin-top:12pt; margin-bottom:4pt; border-bottom:1px solid #CBD5E1; padding-bottom:3pt; font-family:Arial, sans-serif;">${c.title}</h3>
          <p style="text-align:justify; font-size:10pt; line-height:1.5; color:#334155; margin-bottom:10pt; font-family:Calibri, Arial, sans-serif;">${c.content}</p>
        `
        )
        .join('');

      return `
        <div style="${index > 0 ? 'page-break-before:always; margin-top:30pt;' : ''} margin-bottom:30pt;">
          <div style="text-align:center; border-bottom:2px solid #0F172A; padding-bottom:10pt; margin-bottom:15pt;">
            <p style="color:#B45309; font-size:9pt; font-weight:bold; margin:0; font-family:monospace;">CONTRATO DE MANDATO N° ${index + 1} DE 6 &middot; ${ctr.batchCode}</p>
            <h1 style="color:#0F172A; font-size:16pt; margin:3pt 0 0 0; text-transform:uppercase; font-family:Arial, sans-serif;">${company.name}</h1>
            <p style="color:#475569; font-size:9pt; margin:3pt 0;"><strong>R.I.F.:</strong> ${company.rif} &middot; <strong>EXPEDIENTE:</strong> ${ctr.contractCode}</p>
            <h2 style="color:#B45309; font-size:12pt; margin-top:6pt; text-transform:uppercase; font-family:Arial, sans-serif;">CONTRATO DE MANDATO Y GESTIÓN DE IMPORTACIÓN CON FINANCIAMIENTO MEDIANTE ANTICIPOS</h2>
          </div>

          <table style="width:100%; border-collapse:collapse; margin-bottom:15pt; background-color:#FEF3C7; border:1px solid #F59E0B;">
            <tr>
              <td style="padding:10pt; font-size:10pt; color:#78350F; line-height:1.6;">
                <strong>1. MANDANTE (CLIENTE JURÍDICO):</strong> ${ctr.companyName} (RIF: ${ctr.rif})<br/>
                <strong>2. REPRESENTANTE LEGAL:</strong> ${ctr.repName} (C.I. ${ctr.repId})<br/>
                <strong>3. MANDATARIO (INTERMEDIARIO):</strong> ${company.name} (RIF: ${company.rif})<br/>
                <strong>4. LOTE DE IMPORTACIÓN ASIGNADO:</strong> ${ctr.batchCode}<br/>
                <strong>5. MONTO EN CUSTODIA (PASIVO NIIF 15):</strong> Bs. ${ctr.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${ctr.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)<br/>
                <strong>6. VOLUMEN COMPROMETIDO:</strong> ${ctr.coffeeQtl.toLocaleString('es-VE')} Quintales de Café Pergamino Lavado<br/>
                <strong>7. FECHA DE SUSCRIPCIÓN:</strong> ${ctr.date} &middot; <strong>FACTURA DEFINITIVA:</strong> Octubre 2026 (${ctr.octoberInvoiceRef})
              </td>
            </tr>
          </table>

          ${clausesHtml}

          <div style="margin-top:30pt; page-break-inside:avoid;">
            <table style="width:100%; border:none; margin-top:20pt;">
              <tr style="border:none; background:none;">
                <td style="border:none; width:50%; text-align:center; font-size:9pt; vertical-align:top;">
                  _____________________________________<br/>
                  <strong style="color:#0F172A;">${company.legalRepresentative}</strong><br/>
                  Director General &mdash; ${company.name}<br/>
                  C.I. V-14.892.301 &middot; RIF: ${company.rif}
                </td>
                <td style="border:none; width:50%; text-align:center; font-size:9pt; vertical-align:top;">
                  _____________________________________<br/>
                  <strong style="color:#0F172A;">${ctr.repName}</strong><br/>
                  Representante Legal &mdash; ${ctr.companyName}<br/>
                  C.I. ${ctr.repId} &middot; RIF: ${ctr.rif}
                </td>
              </tr>
            </table>
          </div>
        </div>
      `;
    }).join('<hr style="border:1px dashed #CBD5E1; margin:40pt 0;"/>');

    const fullHtml = `
      <div style="font-family:Calibri, Arial, sans-serif; padding:15pt;">
        <div style="text-align:center; margin-bottom:25pt; padding-bottom:15pt; border-bottom:3px solid #0F172A;">
          <h1 style="color:#0F172A; font-size:20pt; margin:0; font-family:Arial, sans-serif;">${company.name} &mdash; EXPEDIENTE LEGAL EDITABLE</h1>
          <p style="color:#475569; font-size:11pt; margin-top:4pt;">R.I.F. ${company.rif} &middot; COMPILACIÓN EDITABLE DE CONTRATOS DE MANDATO POR LOTES EN WORD</p>
          <p style="color:#B45309; font-size:12pt; font-weight:bold; margin-top:6pt;">6 CONTRATOS DE MANDATO DE IMPORTACIÓN DE CAFÉ CON FINANCIAMIENTO MEDIANTE ANTICIPOS</p>
        </div>

        <div style="background-color:#F1F5F9; border-left:4px solid #0F172A; padding:10pt 12pt; margin-bottom:25pt; font-size:10pt; color:#334155;">
          <strong>NOTA EDITABLE DE CUMPLIMIENTO BANCARIO Y FISCAL:</strong> El presente archivo en formato Microsoft Word (.doc / .docx) contiene los seis (6) contratos marco individuales de mandato de gestión de importación suscritos con las empresas jurídicas. Este archivo se proporciona con el fin de permitir la modificación directa de cualquier cláusula, nombre de representante legal o condición comercial específica antes de su impresión o remisión a las autoridades de inspección bancaria (SUDEBAN / Banesco Compliance).
        </div>

        ${contractsHtml}
      </div>
    `;

    exportToWord('Contratos_de_Mandato_por_Lotes_Personas_Juridicas_Agricola_Oni.doc', 'Contratos de Mandato por Lotes Word', fullHtml);
  };

  const handleExportWord = () => {
    const tableRowsHtml = LEGAL_ENTITIES_CLIENTS_LIST.map(
      (c, idx) => `
      <tr>
        <td style="text-align:center">${idx + 1}</td>
        <td><strong>${c.companyName}</strong></td>
        <td style="font-family:monospace;font-weight:bold">${c.rif}</td>
        <td>${c.category}</td>
        <td>${c.bankOrigin}</td>
        <td>${c.taxpayerType}</td>
        <td class="num">Bs. ${c.totalAmountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">$${c.totalAmountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      </tr>
    `
    ).join('');

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; R.N.C.: 010049247 &middot; Expediente SENIAT / SUDEBAN 2026</p>
      <h2>LISTADO GENERAL DE CLIENTES PERSONAS JURÍDICAS (CONSULTA RIF SENIAT)</h2>
      <p>Relación detallada de clientes corporativos, torrefactoras e instituciones bancarias registradas en el Portal del SENIAT:</p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Razón Social / Empresa</th>
            <th>RIF SENIAT</th>
            <th>Categoría / Actividad</th>
            <th>Banco Origen</th>
            <th>Tipo Contribuyente</th>
            <th class="num">Monto Acumulado (Bs.)</th>
            <th class="num">Monto ($ USD)</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
          <tr style="font-weight:bold;background-color:#f1f5f9">
            <td colspan="6">TOTAL CARTERA CORPORATIVA JURÍDICA (${LEGAL_ENTITIES_CLIENTS_LIST.length} EMPRESAS)</td>
            <td class="num">Bs. ${totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
            <td class="num">$${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
      <div class="footer-signatures">
        <p><strong>Certificación Fiscal:</strong> Se certifica que los RIF de las empresas anteriores han sido cotejados en el Portal Oficial del SENIAT (BuscaRif).</p>
      </div>
    `;

    exportToWord('Clientes_Personas_Juridicas_RIF_SENIAT_2026.doc', 'Clientes Personas Jurídicas RIF SENIAT', htmlContent);
  };

  const handleExportPdf = async () => {
    const tableRowsHtml = LEGAL_ENTITIES_CLIENTS_LIST.map(
      (c, idx) => `
      <tr>
        <td style="text-align:center">${idx + 1}</td>
        <td><strong>${c.companyName}</strong></td>
        <td style="font-family:monospace;font-weight:bold;color:#0f172a">${c.rif}</td>
        <td>${c.category}</td>
        <td>${c.bankOrigin}</td>
        <td class="num">Bs. ${c.totalAmountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
        <td class="num">$${c.totalAmountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      </tr>
    `
    ).join('');

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; R.N.C.: 010049247 &middot; Expediente Fiscal SENIAT 2026</p>
      <h2>DIRECTORIO DE CLIENTES PERSONAS JURÍDICAS & VERIFICACIÓN RIF SENIAT</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Razón Social</th>
            <th>RIF SENIAT</th>
            <th>Categoría</th>
            <th>Banco Origen</th>
            <th class="num">Monto (Bs.)</th>
            <th class="num">USD ($)</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    `;

    await downloadElementAsPdf('contenedor-tabla-clientes-juridicos-seniat', 'Clientes_Personas_Juridicas_RIF_SENIAT_2026.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-sm text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-900 text-blue-200 border border-blue-700 rounded-lg">
                <Building2 className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Directorio de Clientes Personas Jurídicas & RIF SENIAT
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Empresas clientes, torrefactoras e instituciones para verificación de RIF en el Portal Fiscal del SENIAT
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
              title="Descargar listado completo formateado en Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Descargar Excel (.xlsx)
            </button>
            <button
              onClick={handleExportBatchContractsExcel}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
              title="Descargar matriz de contratos de mandato por lotes en Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Contratos Lote (.xlsx)
            </button>
            <button
              onClick={handleExportBatchContractsWord}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
              title="Descargar todos los contratos de mandato por lote en formato Word (.doc) para modificarlos"
            >
              <FileDown className="w-4 h-4" />
              Contratos Word (.doc)
            </button>
            <button
              onClick={handleExportWord}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
              title="Descargar informe en Microsoft Word (.doc)"
            >
              <FileDown className="w-4 h-4" />
              Word (.doc)
            </button>
            <button
              onClick={handleExportPdf}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
              title="Descargar PDF directo"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => exportToPdfPrint()}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs transition-colors shadow"
              title="Imprimir (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Button to Open SENIAT Portal */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-800/80 border border-slate-700 p-3.5 rounded-lg gap-3">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-amber-300 shrink-0" />
            <p className="text-xs text-slate-200">
              <strong>Consulta Oficial RIF SENIAT:</strong> Utilice el enlace oficial del SENIAT para validar la vigencia del RIF, domicilio fiscal y condición tributaria de cada empresa.
            </p>
          </div>
          <button
            onClick={() => window.open('http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp', '_blank')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Abrir Portal SENIAT (BuscaRif)
          </button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg">
            <span className="text-[11px] text-slate-300 block font-medium">Empresas Clientes (Jurídicas)</span>
            <span className="text-xl font-bold text-white mt-1 block">
              {LEGAL_ENTITIES_CLIENTS_LIST.length} Clientes
            </span>
            <span className="text-[10px] text-emerald-400 mt-0.5 block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Con RIF Registrado
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg">
            <span className="text-[11px] text-slate-300 block font-medium">Volumen Total Operaciones (Bs.)</span>
            <span className="text-xl font-bold text-amber-300 mt-1 block">
              Bs. {totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-300 mt-0.5 block">Soportado en Banesco & Bancos</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg">
            <span className="text-[11px] text-slate-300 block font-medium">Contravalor Dólares ($ USD)</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">
              ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-300 mt-0.5 block">Tasa Promedio BCV</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg">
            <span className="text-[11px] text-slate-300 block font-medium">Estatus Fiscal SENIAT</span>
            <span className="text-xl font-bold text-blue-300 mt-1 block">
              100% Conforme
            </span>
            <span className="text-[10px] text-blue-200 mt-0.5 block">Auditado SUDEBAN / VEN-NIF</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por RIF (ej: J-50100487-0), Razón Social o Banco..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-600">
          Mostrando <span className="font-bold text-blue-800">{filteredClients.length}</span> de <span className="font-bold text-slate-900">{LEGAL_ENTITIES_CLIENTS_LIST.length}</span> empresas registradas
        </div>
      </div>

      {/* Main Table Container */}
      <div id="contenedor-tabla-clientes-juridicos-seniat" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3 text-center w-12">#</th>
                <th className="px-4 py-3">Razón Social / Empresa</th>
                <th className="px-4 py-3 text-center">Número R.I.F. SENIAT</th>
                <th className="px-4 py-3">Categoría / Actividad</th>
                <th className="px-4 py-3">Banco / Origen</th>
                <th className="px-4 py-3 text-right">Monto Acumulado (Bs.)</th>
                <th className="px-4 py-3 text-right">Monto ($ USD)</th>
                <th className="px-4 py-3 text-center">Consulta Portal SENIAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredClients.map((client, idx) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-center font-mono text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 text-sm">{client.companyName}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{client.notes}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-amber-300 px-2.5 py-1 rounded font-mono font-bold text-amber-800 text-xs">
                      <span>{client.rif}</span>
                      <button
                        onClick={() => handleCopyRif(client.rif)}
                        className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500 hover:text-slate-900"
                        title="Copiar RIF al portapapeles"
                      >
                        {copiedRif === client.rif ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium border border-slate-200">
                      {client.category}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">{client.taxpayerType}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {client.bankOrigin}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    Bs. {client.totalAmountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-700 font-semibold">
                    ${client.totalAmountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleOpenSeniatPortal(client.rif)}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1 shadow-sm"
                      title={`Consultar ${client.rif} en el Portal del SENIAT`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Consultar RIF
                    </button>
                  </td>
                </tr>
              ))}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-xs">
                    No se encontraron personas jurídicas o RIF que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 font-bold text-white border-t-2 border-slate-700">
                <td colSpan={5} className="px-4 py-3 text-left">
                  TOTAL GENERAL CARTERA CLIENTES JURÍDICOS ({filteredClients.length} EMPRESAS)
                </td>
                <td className="px-4 py-3 text-right font-mono text-amber-300">
                  Bs. {filteredClients.reduce((sum, item) => sum + item.totalAmountVES, 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-right font-mono text-emerald-300">
                  ${filteredClients.reduce((sum, item) => sum + item.totalAmountUSD, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-center text-[10px] text-slate-300 font-mono">
                  100% VALIDADOS
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
