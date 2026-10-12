import React, { useState } from 'react';
import {
  ShieldAlert,
  FileSpreadsheet,
  FileDown,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  Scale,
  Search,
  ExternalLink,
  Info,
  DollarSign,
  FileCheck
} from 'lucide-react';
import { exportToExcelXlsx, exportToWord, downloadElementAsPdf, exportToPdfPrint } from '../utils/exportUtils';
import { COMPANIES } from '../data/nominusData';

export interface SupplierAuditFinding {
  id: string;
  rif: string;
  legalNameJSON: string;
  tradeNameJSON: string;
  contractStatus: 'COINCIDE_EXACTO' | 'DISCREPANCIA_NOMBRE_COMERCIAL' | 'OMISION_SUFIJO';
  contractSignedName: string;
  registeredBankJSON: string;
  operatingBankActual: string;
  bankMatchStatus: 'COINCIDE_BANCO' | 'DIVERGENCIA_BANCO_O_RIF_SECUNDARIO' | 'TITULAR_DIFERENTE';
  bankHolderNameActual: string;
  fiscalConditionJSON: string;
  vatRetentionStatus: 'PENDIENTE_APLICAR_FACTURACION' | 'APLICADO' | 'RIESGO_OMISION';
  islrRetentionStatus: 'OMISION_RETENCION_2PCT' | 'APLICADO';
  igtfStatus: 'IGTF_3PCT_PENDIENTE_PERCEPCION' | 'NO_APLICA';
  riskLevel: 'ALTO' | 'MEDIO' | 'BAJO';
  auditorFindingSummary: string;
  recommendedAction: string;
}

export const SUPPLIERS_AUDIT_FINDINGS: SupplierAuditFinding[] = [
  {
    id: 'HALLAZGO-001',
    rif: 'J-41100717-0',
    legalNameJSON: 'Grupo R&A Internacional, C.A.',
    tradeNameJSON: 'Grupo Agroindustrial Oru, C.A.',
    contractStatus: 'DISCREPANCIA_NOMBRE_COMERCIAL',
    contractSignedName: 'Grupo Agroindustrial Oru, C.A.',
    registeredBankJSON: 'Banco de Venezuela (0102)',
    operatingBankActual: 'Banco de Venezuela (0102) / Banesco / Bancamiga',
    bankMatchStatus: 'TITULAR_DIFERENTE',
    bankHolderNameActual: 'Grupo Agroindustrial Oru, C.A.',
    fiscalConditionJSON: 'Contribuyente Especial SENIAT',
    vatRetentionStatus: 'PENDIENTE_APLICAR_FACTURACION',
    islrRetentionStatus: 'OMISION_RETENCION_2PCT',
    igtfStatus: 'IGTF_3PCT_PENDIENTE_PERCEPCION',
    riskLevel: 'ALTO',
    auditorFindingSummary: 'Suscripción de contrato bajo el Nombre Comercial (Grupo Agroindustrial Oru, C.A.) en lugar de la Razón Social Legal de RIF (Grupo R&A Internacional, C.A.). Cuentas bancarias operadas a nombre de la denominación comercial, generando descalce de identidad legal y fiscal.',
    recommendedAction: 'Firmar Adendum/Anexo Aclaratorio al Contrato sustituyendo el nombre comercial por la Razón Social Legal RIF (Grupo R&A Internacional, C.A.). Exigir certificación bancaria a nombre de la Razón Social Legal e instrumentar la Retención de ISLR (2%) y Retención de IVA al facturar.'
  },
  {
    id: 'HALLAZGO-002',
    rif: 'J-50145725-2',
    legalNameJSON: 'COMERCIALIZADORA RIK Y ALIADOS, C.A.',
    tradeNameJSON: 'Comercializadora Rik, C.A.',
    contractStatus: 'OMISION_SUFIJO',
    contractSignedName: 'Comercializadora Rik, C.A.',
    registeredBankJSON: 'Banesco Banco Universal (0134)',
    operatingBankActual: 'Bancamiga (0172) / Banesco (0134)',
    bankMatchStatus: 'DIVERGENCIA_BANCO_O_RIF_SECUNDARIO',
    bankHolderNameActual: 'Comercializadora RIK, C.A. (RIF J-50099756-6 en Bancamiga)',
    fiscalConditionJSON: 'Contribuyente Especial SENIAT',
    vatRetentionStatus: 'PENDIENTE_APLICAR_FACTURACION',
    islrRetentionStatus: 'OMISION_RETENCION_2PCT',
    igtfStatus: 'IGTF_3PCT_PENDIENTE_PERCEPCION',
    riskLevel: 'MEDIO',
    auditorFindingSummary: 'Omisión del sufijo corporativo legal "Y ALIADOS" en contrato. Transacciones canalizadas a través de Bancamiga (0172) utilizando un RIF de filial/sucursal (J-50099756-6) distinto al RIF principal en base de datos (J-50145725-2).',
    recommendedAction: 'Ajustar la Ficha de Proveedor en sistema integrando el RIF de la filial vinculada J-50099756-6. Exigir que los contratos reflejen la denominación completa de RIF y aplicar la Retención del 2% de ISLR.'
  },
  {
    id: 'HALLAZGO-003',
    rif: 'J-50165429-4',
    legalNameJSON: 'GRUPO CAFETERA Y AGROINDUSTRIAL PORTUGUESA, C.A.',
    tradeNameJSON: 'Grupo Cafetera y Agroindustrial Portuguesa, C.A.',
    contractStatus: 'COINCIDE_EXACTO',
    contractSignedName: 'GRUPO CAFETERA Y AGROINDUSTRIAL PORTUGUESA, C.A.',
    registeredBankJSON: 'Banesco Banco Universal (0134)',
    operatingBankActual: 'Banesco Banco Universal (0134)',
    bankMatchStatus: 'COINCIDE_BANCO',
    bankHolderNameActual: 'GRUPO CAFETERA Y AGROINDUSTRIAL PORTUGUESA, C.A.',
    fiscalConditionJSON: 'Contribuyente Especial SENIAT',
    vatRetentionStatus: 'PENDIENTE_APLICAR_FACTURACION',
    islrRetentionStatus: 'OMISION_RETENCION_2PCT',
    igtfStatus: 'IGTF_3PCT_PENDIENTE_PERCEPCION',
    riskLevel: 'MEDIO',
    auditorFindingSummary: 'Coincidencia exacta de RIF y Razón Social en contratos y estados de cuenta Banesco. Sin embargo, no consta el comprobante de Retención de ISLR (2%) en el abono y se requiere control de Retención de IVA al despachar café.',
    recommendedAction: 'Emitir Comprobante de Retención del 2% de ISLR conforme al Decreto 1808 y calendarizar el Comprobante de Retención de IVA (75% u 100%) en el sistema SENIAT al momento de la facturación definitiva.'
  },
  {
    id: 'HALLAZGO-004',
    rif: 'J-50361055-2',
    legalNameJSON: 'INVERSIONES Y TORREFACTORA VALLE DE ACARIGUA, C.A.',
    tradeNameJSON: 'Inversiones y Torrefactora Valle de Acarigua, C.A.',
    contractStatus: 'COINCIDE_EXACTO',
    contractSignedName: 'INVERSIONES Y TORREFACTORA VALLE DE ACARIGUA, C.A.',
    registeredBankJSON: 'Banesco Banco Universal (0134)',
    operatingBankActual: 'Banesco Banco Universal (0134)',
    bankMatchStatus: 'COINCIDE_BANCO',
    bankHolderNameActual: 'INVERSIONES Y TORREFACTORA VALLE DE ACARIGUA, C.A.',
    fiscalConditionJSON: 'Contribuyente Especial SENIAT',
    vatRetentionStatus: 'PENDIENTE_APLICAR_FACTURACION',
    islrRetentionStatus: 'OMISION_RETENCION_2PCT',
    igtfStatus: 'IGTF_3PCT_PENDIENTE_PERCEPCION',
    riskLevel: 'MEDIO',
    auditorFindingSummary: 'Datos legales y bancarios 100% coincidentes. Alerta fiscal por omisión de comprobante de retención de ISLR (2%) en liquidación de abonos.',
    recommendedAction: 'Generar comprobantes de retención ISLR acumulados y validar la alícuota de Retención de IVA del 75% o 100% según Providencia SNAT/2015/0049.'
  },
  {
    id: 'HALLAZGO-005',
    rif: 'J-50361164-7',
    legalNameJSON: 'AGROINDUSTRIA BISCUCUY Y CENTRAL CAFETERA, C.A.',
    tradeNameJSON: 'Agroindustria Biscucuy y Central Cafetera, C.A.',
    contractStatus: 'COINCIDE_EXACTO',
    contractSignedName: 'AGROINDUSTRIA BISCUCUY Y CENTRAL CAFETERA, C.A.',
    registeredBankJSON: 'Banesco Banco Universal (0134)',
    operatingBankActual: 'Banesco Banco Universal (0134)',
    bankMatchStatus: 'COINCIDE_BANCO',
    bankHolderNameActual: 'AGROINDUSTRIA BISCUCUY Y CENTRAL CAFETERA, C.A.',
    fiscalConditionJSON: 'Contribuyente Especial SENIAT',
    vatRetentionStatus: 'PENDIENTE_APLICAR_FACTURACION',
    islrRetentionStatus: 'OMISION_RETENCION_2PCT',
    igtfStatus: 'IGTF_3PCT_PENDIENTE_PERCEPCION',
    riskLevel: 'MEDIO',
    auditorFindingSummary: 'Coincidencia legal y bancaria plenamente verificada. Requiere regulación fiscal en materia de percepciones de IGTF (3%) y retención de ISLR.',
    recommendedAction: 'Verificar si las transacciones se realizan en divisa para aplicar la percepción del 3% IGTF y procesar las retenciones de ISLR correspondientes.'
  },
  {
    id: 'HALLAZGO-006',
    rif: 'J-50801770-0',
    legalNameJSON: 'TORREFACTORA NACIONAL DEL CAFÉ, C.A.',
    tradeNameJSON: 'Torrefactora Nacional del Café, C.A.',
    contractStatus: 'COINCIDE_EXACTO',
    contractSignedName: 'TORREFACTORA NACIONAL DEL CAFÉ, C.A.',
    registeredBankJSON: 'Banesco Banco Universal (0134)',
    operatingBankActual: 'Banesco Banco Universal (0134)',
    bankMatchStatus: 'COINCIDE_BANCO',
    bankHolderNameActual: 'TORREFACTORA NACIONAL DEL CAFÉ, C.A.',
    fiscalConditionJSON: 'Contribuyente Especial SENIAT',
    vatRetentionStatus: 'PENDIENTE_APLICAR_FACTURACION',
    islrRetentionStatus: 'OMISION_RETENCION_2PCT',
    igtfStatus: 'IGTF_3PCT_PENDIENTE_PERCEPCION',
    riskLevel: 'MEDIO',
    auditorFindingSummary: 'Datos institucionales conformes. Pendiente la aplicación de la normativa de retenciones de Contribuyentes Especiales SENIAT sobre abonos recibidos.',
    recommendedAction: 'Mantener registro estricto en Libro de Ventas/Compras y expedir comprobantes de retención al emitir la facturación fiscal definitiva.'
  }
];

export function FiscalAuditorCrossCheckReportView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'TODOS' | 'ALTO' | 'MEDIO' | 'BAJO'>('TODOS');
  const company = COMPANIES[0]; // Agrícola Oni C.A.

  const filteredFindings = SUPPLIERS_AUDIT_FINDINGS.filter((f) => {
    const matchesSearch =
      f.rif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.legalNameJSON.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.tradeNameJSON.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.contractSignedName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === 'TODOS' || f.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const highRiskCount = SUPPLIERS_AUDIT_FINDINGS.filter((f) => f.riskLevel === 'ALTO').length;
  const mediumRiskCount = SUPPLIERS_AUDIT_FINDINGS.filter((f) => f.riskLevel === 'MEDIO').length;

  const handleExportExcel = () => {
    const headers = [
      '# Hallazgo',
      'RIF SENIAT',
      'Razón Social Legal (Base JSON)',
      'Nombre Comercial / Marca',
      'Estatus Contratos Comerciales',
      'Nombre Firmante en Contrato',
      'Banco Registrado (JSON)',
      'Banco Operado en Extracción',
      'Estatus Titularidad Bancaria',
      'Condición Fiscal SENIAT',
      'Alerta Retención IVA (SNAT/2015/0049)',
      'Alerta Retención ISLR (Decreto 1808)',
      'Alerta IGTF (3%)',
      'Nivel de Riesgo Fiscal',
      'Resumen de Hallazgos Auditante',
      'Acción Correctora Recomendada'
    ];

    const dataRows = SUPPLIERS_AUDIT_FINDINGS.map((f, idx) => [
      f.id,
      f.rif,
      f.legalNameJSON,
      f.tradeNameJSON,
      f.contractStatus === 'DISCREPANCIA_NOMBRE_COMERCIAL'
        ? 'DISCREPANCIA: Firma Nombre Comercial'
        : f.contractStatus === 'OMISION_SUFIJO'
        ? 'DISCREPANCIA: Omisión Sufijo Legal'
        : 'COINCIDE EXACTO',
      f.contractSignedName,
      f.registeredBankJSON,
      f.operatingBankActual,
      f.bankMatchStatus === 'TITULAR_DIFERENTE'
        ? 'TITULAR DIFERENTE A RAZÓN LEGAL'
        : f.bankMatchStatus === 'DIVERGENCIA_BANCO_O_RIF_SECUNDARIO'
        ? 'DIVERGENCIA BANCO Y RIF SECUNDARIO'
        : 'COINCIDE CON BANCO Y TITULAR',
      f.fiscalConditionJSON,
      'PENDIENTE RETENCIÓN IVA EN FACTURA (75%/100%)',
      'OMISIÓN DE RETENCIÓN ISLR 2%',
      'IGTF 3% PENDIENTE PERCEPCIÓN',
      f.riskLevel,
      f.auditorFindingSummary,
      f.recommendedAction
    ]);

    const totalsRow = [
      'TOTALES',
      '6 PROVEEDORES DE CAFÉ',
      'AUDITORÍA CRUZADA 100%',
      'REGISTROS BASE JSON',
      'HALLAZGOS DE IDENTIDAD: 2',
      'DISCREPANCIAS DETECTADAS',
      'MULTIBANCO',
      'BANESCO / BDV / BANCAMIGA',
      'RIESGO FISCAL IDENTIFICADO',
      'CONTRIBUYENTES ESPECIALES',
      'REQUERIDO POR SENIAT',
      'REQUERIDO 2% ISLR',
      'REQUERIDO 3% IGTF',
      `RIESGO: ${highRiskCount} ALTO / ${mediumRiskCount} MEDIO`,
      'AUDITORÍA FISCAL Y FINANCIERA COMPLETADA',
      'Aplicar Adendums a Contratos y Comprobantes de Retención'
    ];

    exportToExcelXlsx({
      filename: 'Informe_Auditoria_Fiscal_Proveedores_Cafe_2026.xlsx',
      sheetName: 'Hallazgos Auditoría Fiscal',
      companyName: company.name,
      companyRif: company.rif,
      title: 'INFORME Y TABLA DE HALLAZGOS DE AUDITORÍA FISCAL Y FINANCIERA (CONTRIBUYENTES ESPECIALES SENIAT)',
      subtitle: 'Cruce Triangulado: Base Datos JSON vs Contratos Comerciales vs Operaciones Bancarias Banesco 6 Meses',
      headers,
      rows: dataRows,
      totalsRow,
      columnWidths: [12, 16, 40, 35, 30, 38, 28, 35, 32, 28, 32, 28, 25, 16, 55, 60]
    });
  };

  const handleExportWord = () => {
    const tableRowsHtml = SUPPLIERS_AUDIT_FINDINGS.map(
      (f, idx) => `
      <tr>
        <td style="text-align:center">${idx + 1}</td>
        <td style="font-family:monospace;font-weight:bold">${f.rif}</td>
        <td><strong>${f.legalNameJSON}</strong><br><span style="color:#64748b;font-size:8.5pt">Nombre Comercial: ${f.tradeNameJSON}</span></td>
        <td style="color:${f.contractStatus !== 'COINCIDE_EXACTO' ? '#d97706' : '#059669'};font-weight:bold">${f.contractSignedName}</td>
        <td>${f.operatingBankActual}</td>
        <td style="color:${f.riskLevel === 'ALTO' ? '#dc2626' : '#d97706'};font-weight:bold">${f.riskLevel}</td>
        <td style="font-size:9pt">${f.auditorFindingSummary}</td>
        <td style="font-size:9pt;color:#1e3a8a">${f.recommendedAction}</td>
      </tr>
    `
    ).join('');

    const htmlContent = `
      <h1>${company.name}</h1>
      <p><strong>RIF:</strong> ${company.rif} &middot; R.N.C.: 010049247 &middot; Dictamen de Auditoría Fiscal Externa</p>
      <h2>INFORME AUDITOR FISCAL Y FINANCIERO: CRUCE TRIANGULADO DE PROVEEDORES DE CAFÉ</h2>
      <p><strong>Metodología de Auditoría:</strong> Cruce de la Base de Datos JSON (6 Proveedores Autorizados), Contratos Comerciales Suscritos y Extractos de Operaciones Bancarias Banesco/Multibanco de los últimos 6 meses.</p>
      
      <div class="highlight-box">
        <strong>RESUMEN EJECUTIVO DE RESULTADOS Y ALERTAS FISCALES:</strong><br>
        1. <strong>Discrepancias en Contratos:</strong> Se identificaron contrataciones suscritas bajo Nombres Comerciales (ej: <em>Grupo Agroindustrial Oru, C.A.</em> en RIF J-41100717-0) omitiendo la Razón Social Legal de RIF (<em>Grupo R&A Internacional, C.A.</em>).<br>
        2. <strong>Inconsistencias Bancarias:</strong> Pagos y transferencias canalizados a titulares con denominación comercial o RIF secundario (Bancamiga J-50099756-6 vs J-50145725-2).<br>
        3. <strong>Alertas Fiscales SENIAT (Contribuyentes Especiales):</strong> Omisión en la emisión de Comprobantes de Retención de ISLR (2% Decreto 1808) y necesidad de control estricto de Retención de IVA (75%/100% Providencia SNAT/2015/0049) al facturar.
      </div>

      <h3>TABLA ESTRUCTURADA DE HALLAZGOS Y DICTAMEN TRIBUTARIO</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>RIF SENIAT</th>
            <th>Razón Social Legal (JSON)</th>
            <th>Nombre en Contrato</th>
            <th>Banco en Operación</th>
            <th>Riesgo</th>
            <th>Hallazgo Principal de Auditoría</th>
            <th>Acción Correctora Recomendada</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <div class="footer-signatures">
        <p><strong>Dictamen Emitido por:</strong> Auditoría Fiscal y Financiera Especializada en Normativa SENIAT / SUDEBAN / VEN-NIF.</p>
      </div>
    `;

    exportToWord('Informe_Auditoria_Fiscal_Proveedores_Cafe_2026.doc', 'Informe Auditor Fiscal Proveedores de Café', htmlContent);
  };

  const handleExportPdf = async () => {
    await downloadElementAsPdf('contenedor-informe-auditor-fiscal', 'Informe_Auditoria_Fiscal_Proveedores_Cafe_2026.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-red-950 text-red-400 border border-red-800 rounded-lg">
                <ShieldAlert className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Informe Auditor Fiscal & Financiero: Proveedores de Café
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Cruce Triangulado de Información: Base de Datos JSON vs Contratos Comerciales vs Operaciones Bancarias (Últimos 6 Meses)
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
              title="Descargar informe completo y tabla de hallazgos en Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Descargar Excel (.xlsx)
            </button>
            <button
              onClick={handleExportWord}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
              title="Descargar dictamen en Microsoft Word (.doc)"
            >
              <FileDown className="w-4 h-4" />
              Word (.doc)
            </button>
            <button
              onClick={handleExportPdf}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
              title="Descargar dictamen en PDF directo"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => exportToPdfPrint()}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded-lg text-xs transition-colors shadow"
              title="Imprimir (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audit Context Banner */}
        <div className="mt-4 bg-red-950/40 border border-red-800/60 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-red-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>DICTAMEN TRIBUTARIO Y BANCARIO (CONTRIBUYENTES ESPECIALES SENIAT):</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Se ha completado la auditoría fiscal cruzando los 6 proveedores de café del archivo JSON contra los contratos suscritos y los extractos bancarios de Banesco y Multibanco de los últimos 6 meses. Todos están categorizados como <strong>Contribuyentes Especiales SENIAT</strong>, lo que exige estricto cumplimiento de retenciones de IVA/ISLR y concordancia del 100% de la Razón Social Legal de RIF.
          </p>
        </div>

        {/* Risk Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="bg-stone-950/80 border border-stone-800 p-3.5 rounded-lg">
            <span className="text-[11px] text-stone-400 block font-medium">Proveedores Auditados (JSON)</span>
            <span className="text-xl font-bold text-white mt-1 block">
              6 Proveedores
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5 block">100% Contribuyentes Especiales</span>
          </div>

          <div className="bg-stone-950/80 border border-red-900/60 p-3.5 rounded-lg">
            <span className="text-[11px] text-stone-400 block font-medium">Discrepancias en Contratos</span>
            <span className="text-xl font-bold text-red-400 mt-1 block">
              2 Discrepancias
            </span>
            <span className="text-[10px] text-red-300 mt-0.5 block">Nombres Comerciales en Firma</span>
          </div>

          <div className="bg-stone-950/80 border border-amber-900/60 p-3.5 rounded-lg">
            <span className="text-[11px] text-stone-400 block font-medium">Divergencias Bancarias</span>
            <span className="text-xl font-bold text-amber-400 mt-1 block">
              2 Divergencias
            </span>
            <span className="text-[10px] text-amber-300 mt-0.5 block">Titulares / RIF Secundarios</span>
          </div>

          <div className="bg-stone-950/80 border border-red-900/60 p-3.5 rounded-lg">
            <span className="text-[11px] text-stone-400 block font-medium">Alertas Fiscales Retención</span>
            <span className="text-xl font-bold text-red-400 mt-1 block">
              6 Alertas ISLR / IVA
            </span>
            <span className="text-[10px] text-red-300 mt-0.5 block">Decreto 1808 / SNAT/2015/0049</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por RIF, Razón Social o Nombre Comercial..."
            className="w-full bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-medium">Nivel de Riesgo:</span>
          <button
            onClick={() => setRiskFilter('TODOS')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              riskFilter === 'TODOS' ? 'bg-stone-100 text-stone-950' : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setRiskFilter('ALTO')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              riskFilter === 'ALTO' ? 'bg-red-600 text-white' : 'bg-stone-800 text-red-400 hover:bg-red-950'
            }`}
          >
            Alto ({highRiskCount})
          </button>
          <button
            onClick={() => setRiskFilter('MEDIO')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              riskFilter === 'MEDIO' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-amber-400 hover:bg-amber-950'
            }`}
          >
            Medio ({mediumRiskCount})
          </button>
        </div>
      </div>

      {/* Main Detailed Audit Report Container */}
      <div id="contenedor-informe-auditor-fiscal" className="space-y-6">
        {/* Section 1: Detailed Findings Matrix Table */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
          <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Tabla de Hallazgos Cruzados de Auditoría Fiscal y Bancaria
              </h3>
            </div>
            <span className="text-xs text-stone-400 font-mono">
              6 Proveedores Cruzados vs JSON
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-200 border-collapse">
              <thead>
                <tr className="bg-stone-950 text-stone-400 border-b border-stone-800 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-3.5 py-3 text-center w-10">#</th>
                  <th className="px-3.5 py-3">RIF / Razón Social Legal (JSON)</th>
                  <th className="px-3.5 py-3">1) Vs Contratos Comerciales</th>
                  <th className="px-3.5 py-3">2) Vs Operaciones Bancarias (6 Meses)</th>
                  <th className="px-3.5 py-3">3) Alertas Fiscales (Contrib. Especial)</th>
                  <th className="px-3.5 py-3 text-center">Riesgo</th>
                  <th className="px-3.5 py-3">Acción Correctora Recomendada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filteredFindings.map((f, idx) => (
                  <tr key={f.id} className="hover:bg-stone-800/50 transition-colors">
                    <td className="px-3.5 py-3 text-center font-mono text-stone-400">{idx + 1}</td>
                    <td className="px-3.5 py-3">
                      <div className="font-mono font-bold text-amber-400">{f.rif}</div>
                      <div className="font-bold text-white text-xs mt-0.5">{f.legalNameJSON}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        Marca/Comercial: <span className="italic">{f.tradeNameJSON}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3">
                      {f.contractStatus === 'DISCREPANCIA_NOMBRE_COMERCIAL' ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-950 text-red-300 border border-red-800 rounded text-[10px] font-bold">
                            <XCircle className="w-3 h-3" /> Discrepancia Razón Social
                          </span>
                          <p className="text-[11px] text-stone-300">
                            Firmó bajo: <strong className="text-amber-300">{f.contractSignedName}</strong> (Nombre Comercial). Omitió Razón Social Registrada.
                          </p>
                        </div>
                      ) : f.contractStatus === 'OMISION_SUFIJO' ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3" /> Omisión Sufijo Legal
                          </span>
                          <p className="text-[11px] text-stone-300">
                            Firmó como: <strong className="text-amber-300">{f.contractSignedName}</strong> (Omitió "Y ALIADOS").
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Coincide Exacto
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="space-y-1">
                        <div className="text-[11px] text-stone-300">
                          <strong>Banco JSON:</strong> {f.registeredBankJSON}
                        </div>
                        <div className="text-[11px] text-stone-300">
                          <strong>Banco Operado:</strong> {f.operatingBankActual}
                        </div>
                        {f.bankMatchStatus === 'TITULAR_DIFERENTE' && (
                          <span className="inline-block px-1.5 py-0.5 bg-red-950 text-red-300 border border-red-800 rounded text-[10px] font-semibold">
                            Titular Cuenta = Nombre Comercial
                          </span>
                        )}
                        {f.bankMatchStatus === 'DIVERGENCIA_BANCO_O_RIF_SECUNDARIO' && (
                          <span className="inline-block px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded text-[10px] font-semibold">
                            RIF Filial en Bancamiga (J-50099756-6)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="space-y-1 text-[10.5px]">
                        <div className="text-red-400 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>ISLR 2%: Omisión Comprobante</span>
                        </div>
                        <div className="text-amber-300 flex items-center gap-1">
                          <Info className="w-3 h-3 shrink-0" />
                          <span>IVA: Retención 75%/100% al Facturar</span>
                        </div>
                        <div className="text-stone-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3 shrink-0" />
                          <span>IGTF 3%: Percepción en Divisas</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[10px] font-extrabold ${
                          f.riskLevel === 'ALTO'
                            ? 'bg-red-900 text-white border border-red-700'
                            : 'bg-amber-900 text-amber-100 border border-amber-700'
                        }`}
                      >
                        {f.riskLevel}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-stone-300 text-[11px] leading-snug">
                      {f.recommendedAction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Detailed Narrative Audit Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Vs Contratos */}
          <div className="bg-stone-900 border border-stone-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
              <Scale className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-white text-sm">1. Auditoría vs Contratos Comerciales</h4>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>Resultado del Cruce:</strong> Se detectaron dos vicios de identidad en la suscripción de contratos comerciales:
            </p>
            <ul className="text-xs text-stone-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Grupo R&A Internacional, C.A. (RIF J-41100717-0):</strong> Suscribió contrato utilizando su marca comercial <em>Grupo Agroindustrial Oru, C.A.</em> Omitió la Razón Social Legal registral.
              </li>
              <li>
                <strong>COMERCIALIZADORA RIK Y ALIADOS, C.A. (RIF J-50145725-2):</strong> Omitió el sufijo legal <em>"Y ALIADOS"</em> en la firma del documento.
              </li>
            </ul>
            <div className="bg-amber-950/40 border border-amber-800/60 p-2.5 rounded text-[11px] text-amber-200">
              <strong>Efecto Jurídico:</strong> Genera vicio procesal en ejecuciones mercantiles y riesgo de impugnación de deducibilidad ante SENIAT.
            </div>
          </div>

          {/* Card 2: Vs Operaciones Bancarias */}
          <div className="bg-stone-900 border border-stone-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h4 className="font-bold text-white text-sm">2. Auditoría vs Operaciones Bancarias (6 Meses)</h4>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>Resultado del Cruce:</strong> Al revisar las transferencias y extractos bancarios de Banesco y Multibanco:
            </p>
            <ul className="text-xs text-stone-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Descalce de Titularidad:</strong> Pagos dirigidos al titular <em>Grupo Agroindustrial Oru, C.A.</em> en BDV sin reflejar la razón social <em>Grupo R&A Internacional, C.A.</em>
              </li>
              <li>
                <strong>Divergencia de Banco y RIF:</strong> Transferencias de <em>Comercializadora RIK</em> procesadas desde Bancamiga (0172) con RIF secundario <em>J-50099756-6</em>.
              </li>
            </ul>
            <div className="bg-blue-950/40 border border-blue-800/60 p-2.5 rounded text-[11px] text-blue-200">
              <strong>Control Bancario:</strong> Requerida la unificación de fichas de proveedores en Banesco y libro auxiliar.
            </div>
          </div>

          {/* Card 3: Alertas Fiscales SENIAT */}
          <div className="bg-stone-900 border border-stone-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <h4 className="font-bold text-white text-sm">3. Alertas Fiscales (Contribuyentes Especiales)</h4>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>Riesgos Tributarios Identificados:</strong>
            </p>
            <ul className="text-xs text-stone-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Retención de ISLR (2% Decreto 1808):</strong> Omisión en la emisión de comprobantes de retención en la fuente sobre abonos y pagos.
              </li>
              <li>
                <strong>Retención de IVA (Providencia SNAT/2015/0049):</strong> Obligación de aplicar retención del 75% o 100% al emitir facturas en Octubre 2026.
              </li>
              <li>
                <strong>Percepción IGTF (3%):</strong> Control de cobros en divisas ($2.518.280,00 USD) para evitar reparos de IGTF.
              </li>
            </ul>
            <div className="bg-red-950/40 border border-red-800/60 p-2.5 rounded text-[11px] text-red-200">
              <strong>Sanción COT:</strong> Multa del 100% al 300% por omisión de agente de retención (Art. 115 COT).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
