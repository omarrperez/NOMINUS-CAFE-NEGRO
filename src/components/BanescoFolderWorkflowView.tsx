import React, { useState } from 'react';
import {
  FolderArchive,
  FileText,
  CheckSquare,
  Printer,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  ChevronRight,
  Building2,
  Users,
  DollarSign,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
  BookOpen,
  FileCheck,
  Scale,
  Receipt,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Eye,
  X
} from 'lucide-react';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import { exportToWord, downloadNativeDocx } from '../utils/exportUtils';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
  onNavigateToModule?: (module: string) => void;
}

export const BanescoFolderWorkflowView: React.FC<Props> = ({ company, currentRate, onNavigateToModule }) => {
  const [activeSeparator, setActiveSeparator] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Interactive Checklist State
  const [checklist, setChecklist] = useState({
    cartaFirmada: true,
    notaConciliacion: true,
    dictamenAuditor: true,
    contratosJuridicos: true,
    rifClientesJuridicos: true,
    recibosNaturales: true,
    cedulasProductores: true,
    comprobantesMesaBanesco: true,
    facturasInsumosVenezuela: true,
    actaConstitutivaOni: true,
    rifOniVigente: true,
    eeffAudita2026: true,
    libroAuxiliarBanesco: true
  });

  const handleToggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = Object.keys(checklist).length;
  const completedItems = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  // Plain text for direct copying into Microsoft Word
  const plainTextGuide = `
================================================================================
GUÍA Y FLUJO DE ARMADO DE CARPETA DE CUMPLIMIENTO - BANESCO BANCO UNIVERSAL
================================================================================
EMPRESA: ${company.name}
R.I.F.: ${company.rif}
CUENTA CORRIENTE BANESCO: ${company.banescoAccountVES}
EXPEDIENTE BANCARIO: AUD-BAN-2026-ONI-094
FECHA DE EMISIÓN: 31 de Agosto de 2026
TASA OFICIAL BCV: Bs. ${currentRate.rateUsd.toFixed(2)} / USD
================================================================================

1. ESTRUCTURA Y MODELO DE LA CARPETA FÍSICA (SEPARADORES A - E)
--------------------------------------------------------------------------------

SEPARADOR A: CARTA EXPLICATIVA OFICIAL Y DICTAMEN DE AUDITORÍA
- Carta de Respuesta Oficial (Oficio AO-DIR-BAN-2026-042): Firmada en físico por el Presidente (Elias Rafael Trías Abreu) y el Contador Público Colegiado (Licdo. Omar Pérez Castillo, C.P.C. 16.336).
- Nota de Conciliación Bancaria Certificada: Reporte firmado y sellado por el CPC explicando la diferencia de Bs. 0,00 en omisión de ingresos y la naturaleza de Pasivo Exigible en Café bajo NIIF 15 / Sección 23.
- Dictamen de Auditoría Fiscal y Contable: Informe de cumplimiento tributario e ISLR/IGTF ante SENIAT y SUDEBAN.

SEPARADOR B: RESPALDO DE ANTICIPOS DE CLIENTES JURÍDICOS (Bs. 427.800.000,00)
- 6 Contratos Marco de Mandato e Intermediación Comercial suscritos con empresas compradoras.
- Comprobantes de transferencias bancarias de origen (Banesco, BFC, Provincial) por Bs. 427.800.000,00.
- Copia de RIF SENIAT vigente y Cédula de Identidad de representantes legales de los 6 clientes jurídicos.

SEPARADOR C: RESPALDO DE ANTICIPOS DE PERSONAS NATURALES Y PRODUCTORES (Bs. 326.413.000,00)
- Fichas de identificación de clientes e intermediarios naturales.
- Recibos de depósitos de anticipos en Banesco y comprobantes de recepción de café.
- Copias de Cédula de Identidad, RIF personal y Guías SICA/SUNAGRO de movilización nacional de café.

SEPARADOR D: ADQUISICIÓN DE DIVISAS EN MESA DE CAMBIO BANESCO Y USO DE FONDOS ($18.428.571,43 USD)
- Comprobantes de débito en VES y acreditación en USD en Cta Custodia Convenio 20 Banesco.
- Planillas de adjudicación cambiaria oficial emitidas por Banesco Banco Universal.
- Facturas, cotizaciones y comprobantes de pago a proveedores de maquinaria, repuestos e insumos agrícolas consumidos 100% en Venezuela.

SEPARADOR E: REGISTRO LEGAL Y ESTADOS FINANCIEROS AUDITADOS DE AGRÍCOLA ONI C.A.
- Copia del Acta Constitutiva y Estatutos Sociales de Agrícola Oni C.A. (RIF J-50145638-0).
- Copia del RIF SENIAT actualizado de la empresa.
- Balance General y Estado de Resultados Dual (Bs. y USD) al 31/08/2026.
- Libro Auxiliar de Banco Banesco y Estados de Cuenta Bancarios oficiales.

--------------------------------------------------------------------------------
2. FLUJO DE TRABAJO PARA ENTREGA EN TAQUILLA DE CUMPLIMIENTO BANESCO
--------------------------------------------------------------------------------
Paso 1 - Impresión y Firmas: Imprimir 2 ejemplares de la Carta Explicativa (1 para entregar a Banesco y 1 copia de recibimiento para la empresa). Firmar con bolígrafo azul y colocar sello húmedo del CPC.
Paso 2 - Compaginación: Insertar separadores de cartulina con pestañas rotuladas (A a E) en una carpeta de gancho marrón o azul tipo lomo ancho.
Paso 3 - Verificación de Soportes: Cotejar cada comprobante bancario contra la Nota de Conciliación.
Paso 4 - Entrega Física: Consignar la carpeta en la taquilla de la Unidad de Prevención de Legitimación de Capitales (UPCL) en la Agencia Banesco.
Paso 5 - Resguardo del Acuse de Recibo: Exigir el sello húmedo de recepción de Banesco con fecha, hora y firma del funcionario analista en la copia cliente.

================================================================================
Documento generado por el Sistema Integral de Control Contable SIEVEX 2026
================================================================================
`.trim();

  // Helper HTML for Word export
  const getWordHtmlContent = () => `
    <div style="font-family: Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5;">
      <div style="text-align: center; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 15px;">
        <h1 style="color: #065f46; font-size: 18pt; margin: 0;">
          GUÍA Y FLUJO DE ARMADO DE CARPETA DE CUMPLIMIENTO
        </h1>
        <h2 style="color: #0f766e; font-size: 14pt; margin: 5px 0 0 0;">
          BANESCO BANCO UNIVERSAL &middot; UNIDAD DE CUMPLIMIENTO (UPCL)
        </h2>
      </div>

      <p><strong>Empresa Titular:</strong> ${company.name} (RIF: ${company.rif})</p>
      <p><strong>Cuenta Corriente Banesco:</strong> ${company.banescoAccountVES}</p>
      <p><strong>Expediente Bancario:</strong> AUD-BAN-2026-ONI-094</p>
      <p><strong>Fecha de Emisión:</strong> 31 de Agosto de 2026</p>
      <p><strong>Tasa Oficial BCV:</strong> Bs. ${currentRate.rateUsd.toFixed(2)} / USD</p>

      <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 15px 0;" />

      <h2 style="color: #0f766e; font-size: 13pt; background-color: #f0fdf4; padding: 6px 10px; border-left: 4px solid #059669;">
        1. ESTRUCTURA Y MODELO DE LA CARPETA FÍSICA (SEPARADORES A - E)
      </h2>

      <h3>SEPARADOR A: CARTA EXPLICATIVA OFICIAL Y DICTAMEN DE AUDITORÍA</h3>
      <ul>
        <li><strong>Carta de Respuesta Oficial (Oficio AO-DIR-BAN-2026-042):</strong> Firmada en físico por el Presidente (Elias Rafael Trías Abreu) y el Contador Público Colegiado (Licdo. Omar Pérez Castillo, C.P.C. 16.336).</li>
        <li><strong>Nota de Conciliación Bancaria Certificada:</strong> Reporte con firma y sello del CPC explicando la diferencia de Bs. 0,00 en omisiones de ingresos.</li>
        <li><strong>Dictamen de Auditoría Fiscal y Contable:</strong> Informe de cumplimiento de VEN-NIF (NIIF 15 / Sección 23) sobre Pasivos Exigibles en Café.</li>
      </ul>

      <h3>SEPARADOR B: RESPALDO DE ANTICIPOS DE CLIENTES JURÍDICOS (Bs. 427.800.000,00)</h3>
      <ul>
        <li>6 Contratos Marco de Mandato e Intermediación Comercial suscritos con empresas compradoras.</li>
        <li>Comprobantes de transferencias bancarias de origen (Banesco, BFC, Provincial) por Bs. 427.800.000,00.</li>
        <li>Copia de RIF SENIAT vigente y cédulas de representantes legales de los 6 clientes jurídicos.</li>
      </ul>

      <h3>SEPARADOR C: RESPALDO DE ANTICIPOS DE PERSONAS NATURALES Y PRODUCTORES (Bs. 326.413.000,00)</h3>
      <ul>
        <li>Fichas de identificación de clientes e intermediarios naturales.</li>
        <li>Recibos de depósitos de anticipos en Banesco y comprobantes de recepción de café.</li>
        <li>Copias de Cédula de Identidad, RIF personal y Guías SICA/SUNAGRO de movilización.</li>
      </ul>

      <h3>SEPARADOR D: ADQUISICIÓN DE DIVISAS EN MESA DE CAMBIO BANESCO Y USO DE FONDOS ($18.428.571,43 USD)</h3>
      <ul>
        <li>Comprobantes de débito en VES y acreditación en USD en Cuenta Custodia Convenio 20 Banesco.</li>
        <li>Planillas de adjudicación cambiaria emitidas por Banesco Banco Universal.</li>
        <li>Facturas, cotizaciones y comprobantes de pago a proveedores de maquinaria, repuestos e insumos agrícolas consumidos 100% en Venezuela.</li>
      </ul>

      <h3>SEPARADOR E: REGISTRO LEGAL Y ESTADOS FINANCIEROS AUDITADOS DE AGRÍCOLA ONI C.A.</h3>
      <ul>
        <li>Copia del Acta Constitutiva y Estatutos Sociales de Agrícola Oni C.A. (RIF J-50145638-0).</li>
        <li>Copia del RIF SENIAT actualizado de la empresa.</li>
        <li>Balance General y Estado de Resultados Dual (Bs. y USD) al 31/08/2026.</li>
        <li>Libro Auxiliar de Banco Banesco y Estados de Cuenta Bancarios.</li>
      </ul>

      <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 15px 0;" />

      <h2 style="color: #0f766e; font-size: 13pt; background-color: #f0fdf4; padding: 6px 10px; border-left: 4px solid #059669;">
        2. FLUJO DE TRABAJO PARA ENTREGA EN TAQUILLA DE CUMPLIMIENTO BANESCO
      </h2>
      <ol style="line-height: 1.6;">
        <li><strong>Paso 1 - Impresión y Firmas:</strong> Imprimir 2 ejemplares de la Carta Explicativa (1 para Banesco y 1 copia de recibimiento para la empresa). Firmar en tinta azul y colocar sello CPC.</li>
        <li><strong>Paso 2 - Compaginación:</strong> Insertar separadores de cartulina con pestañas rotuladas (A a E) en una carpeta de gancho marrón o azul tipo lomo ancho.</li>
        <li><strong>Paso 3 - Verificación de Soportes:</strong> Cotejar cada comprobante bancario de Banesco contra la Nota de Conciliación.</li>
        <li><strong>Paso 4 - Entrega Física:</strong> Consignar la carpeta en la taquilla de la Unidad de Prevención de Legitimación de Capitales (UPCL) en la Agencia Banesco.</li>
        <li><strong>Paso 5 - Resguardo del Acuse de Recibo:</strong> Exigir el sello húmedo de recepción de Banesco con fecha, hora y firma del funcionario analista en la copia cliente.</li>
      </ol>

      <p style="margin-top: 30px; font-size: 9pt; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
        Documento generado por el Sistema Integral de Control Contable y Bancario SIEVEX 2026 &middot; Agrícola Oni C.A.
      </p>
    </div>
  `;

  // Export to Word (.doc)
  const handleExportWordDoc = async () => {
    try {
      const html = getWordHtmlContent();
      await exportToWord('Guia_Armado_Carpeta_Expediente_Banesco_2026.doc', 'Guía Armado Carpeta Banesco', html);
      setDownloadNotification('¡Archivo Microsoft Word (.doc) descargado exitosamente!');
      setTimeout(() => setDownloadNotification(null), 5000);
    } catch (err) {
      console.error('Error al exportar Word:', err);
      setDownloadNotification('No se pudo descargar automáticamente. Por favor usa la opción "Copiar Texto al Portapapeles".');
    }
  };

  // Export to Native Docx (.docx)
  const handleExportNativeDocx = async () => {
    try {
      await downloadNativeDocx('Guia_Armado_Carpeta_Expediente_Banesco_2026.docx', {
        companyName: company.name,
        companyRif: company.rif,
        title: 'GUÍA Y FLUJO DE ARMADO DE CARPETA DE CUMPLIMIENTO - BANESCO BANCO UNIVERSAL',
        subtitle: 'Modelo de Entrega y Separadores para la Unidad de Prevención de Legitimación de Capitales (UPCL)',
        fileReference: 'EXPEDIENTE BANCARIO: AUD-BAN-2026-ONI-094',
        date: '31 de Agosto de 2026',
        paragraphs: [
          `Empresa Titular: ${company.name} (RIF: ${company.rif})`,
          `Cuenta Corriente Banesco: ${company.banescoAccountVES}`,
          `Tasa Oficial BCV: Bs. ${currentRate.rateUsd.toFixed(2)} / USD`,
          'SEPARADOR A: CARTA EXPLICATIVA OFICIAL Y DICTAMEN DE AUDITORÍA (Oficio AO-DIR-BAN-2026-042 firmada por Elias Rafael Trías Abreu y Licdo. Omar Pérez Castillo C.P.C. 16.336).',
          'SEPARADOR B: RESPALDO DE ANTICIPOS DE CLIENTES JURÍDICOS (6 Contratos Marco, Transferencias Bs. 427.80M y RIF SENIAT).',
          'SEPARADOR C: RESPALDO DE ANTICIPOS DE PERSONAS NATURALES Y PRODUCTORES (Fichas, Recibos Bs. 326.41M, Cédulas y Guías SUNAGRO).',
          'SEPARADOR D: ADQUISICIÓN DE DIVISAS EN MESA DE CAMBIO BANESCO Y USO DE FONDOS ($18.42M USD en insumos comprados 100% en Venezuela).',
          'SEPARADOR E: REGISTRO LEGAL Y ESTADOS FINANCIEROS AUDITADOS DE AGRÍCOLA ONI C.A. (Acta Constitutiva, RIF, EEFF Duales al 31/08/2026 y Libro Auxiliar Banesco).'
        ],
        signers: [
          { name: 'Elias Rafael Trías Abreu', title: 'Presidente / Propietario - Agrícola Oni C.A.', idNumber: 'V-14.892.301' },
          { name: 'Licdo. Omar Pérez Castillo', title: 'Contador Público Colegiado', idNumber: 'C.P.C. 16.336' }
        ]
      });
      setDownloadNotification('¡Archivo Microsoft Word (.docx) descargado exitosamente!');
      setTimeout(() => setDownloadNotification(null), 5000);
    } catch (err) {
      console.error('Error al exportar DOCX:', err);
      // Fallback to .doc
      handleExportWordDoc();
    }
  };

  // Copy plain text to clipboard
  const handleCopyText = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(plainTextGuide);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = plainTextGuide;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedStatus('¡Texto de la Guía Copiado al Portapapeles! Ya puedes pegarlo directamente en Microsoft Word (Ctrl + V).');
      setTimeout(() => setCopiedStatus(null), 5000);
    } catch (err) {
      console.error('Error al copiar:', err);
      setShowPreviewModal(true);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans pb-12">
      
      {/* Toast Notifications */}
      {downloadNotification && (
        <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-emerald-500 animate-fade-in no-print">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{downloadNotification}</span>
          </div>
          <button
            onClick={() => setDownloadNotification(null)}
            className="text-emerald-300 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {copiedStatus && (
        <div className="bg-blue-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-blue-500 animate-fade-in no-print">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
            <span className="text-xs font-semibold">{copiedStatus}</span>
          </div>
          <button
            onClick={() => setCopiedStatus(null)}
            className="text-blue-300 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Panel */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FolderArchive className="w-3.5 h-3.5 text-emerald-400" />
                Instructivo Oficial de Entrega Banesco
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono">
                Expediente: AUD-BAN-2026-ONI-094
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Flujo de Armado y Modelo de Carpeta de Entrega a Banesco
            </h1>
            
            <p className="text-slate-300 text-sm leading-relaxed font-normal">
              Guía paso a paso para compaginar la carpeta física y digital con la carta explicativa y todos los soportes legales, contables y bancarios requeridos por Banesco Banco Universal. Diseñado bajo la óptica estricta del <strong className="text-emerald-300">Analista de Cumplimiento / UPCL de Banesco</strong> que va a recibir la carpeta.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 no-print">
            
            <button
              onClick={handleExportWordDoc}
              title="Descargar archivo en formato Word .doc"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Guía Word (.doc)</span>
            </button>

            <button
              onClick={handleCopyText}
              title="Copiar texto de la guía directamente al portapapeles para pegar en Word (Ctrl + V)"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <Copy className="w-4 h-4" />
              <span>Copiar Texto a Word</span>
            </button>

            <button
              onClick={() => setShowPreviewModal(true)}
              title="Ver texto completo en pantalla para copiar manualmente"
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Texto</span>
            </button>

            <button
              onClick={() => window.print()}
              title="Imprimir la hoja de trabajo directamente"
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>

          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">Empresa Titular:</span>
            <span className="text-emerald-300 font-bold">{company.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">RIF SENIAT:</span>
            <span className="text-white font-bold">{company.rif}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Cuenta Corriente Banesco:</span>
            <span className="text-white font-bold">{company.banescoAccountVES}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Avance de Armado:</span>
            <span className="text-emerald-400 font-bold">{progressPercent}% Listo ({completedItems}/{totalItems})</span>
          </div>
        </div>
      </div>

      {/* Direct Export & Copy Options Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
              <Download className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Opciones de Exportación Directa e Impresión</h3>
              <p className="text-xs text-slate-600">Si tu navegador restringe la descarga directa de archivos, utiliza el botón "Copiar Texto a Word" para pegarlo directamente en Microsoft Word con <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">Ctrl + V</code>.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportWordDoc}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .doc</span>
            </button>
            <button
              onClick={handleExportNativeDocx}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .docx</span>
            </button>
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Texto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Perspective Banner (Como el Analista del Banco) */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-slate-800 shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>Criterio del Analista de Cumplimiento en Banesco que recibe esta carpeta</span>
              <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md font-mono">
                Recepción & Verificación Inmediata
              </span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              El analista de la <strong>Unidad de Prevención de Legitimación de Capitales (UPCL) de Banesco</strong> busca verificar tres cosas en menos de 5 minutos: 
              <strong>1)</strong> Que exista una carta formal firmada que explique el origen de los fondos; 
              <strong>2)</strong> Que cada abono o depósito en cuenta tenga su contrato de soporte e identificación del ordenante; y 
              <strong>3)</strong> Que las compras de divisas en la Mesa de Cambio coincidan con facturas o proformas de insumos comprados dentro de Venezuela. Si la carpeta se entrega con el orden exacto de los <strong>Separadores A a E</strong> que se presenta a continuación, el expediente se aprobará sin observaciones ni solicitudes adicionales.
            </p>
          </div>
        </div>
      </div>

      {/* Flujo de Trabajo en 5 Pasos Visuales */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-700" />
            <span>Flujo Operativo de 5 Pasos para la Entrega a Banesco</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">Paso a Paso Cronológico</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          
          {/* Step 1 */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                <span>PASO 1</span>
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">1</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Impresión & Firmas</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Imprimir Carta Explicativa (AO-DIR-BAN-2026-042). Firmar con bolígrafo azul el Representante Legal y el CPC (con sello de actuación).
              </p>
            </div>
            {onNavigateToModule && (
              <button
                onClick={() => onNavigateToModule('BANESCO_LETTER_FULL')}
                className="text-[10px] font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 mt-2 underline cursor-pointer"
              >
                Ir a Carta <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Step 2 */}
          <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-teal-900 mb-1">
                <span>PASO 2</span>
                <span className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px]">2</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Compaginación</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Armar carpeta de gancho marrón o azul tipo lomo ancho. Colocar los 5 separadores físicos de cartulina con pestañas laterales rotuladas (A a E).
              </p>
            </div>
            <span className="text-[10px] text-teal-800 font-semibold mt-2">Usar Carpeta Gancho</span>
          </div>

          {/* Step 3 */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-1">
                <span>PASO 3</span>
                <span className="w-5 h-5 rounded-full bg-sky-700 text-white flex items-center justify-center text-[10px]">3</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Anexo de Soportes</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Insertar en cada separador los contratos, comprobantes de transferencias, RIF, fichas de clientes y facturas de insumos en Venezuela.
              </p>
            </div>
            <span className="text-[10px] text-sky-800 font-semibold mt-2">Ver Matriz en App</span>
          </div>

          {/* Step 4 */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900 mb-1">
                <span>PASO 4</span>
                <span className="w-5 h-5 rounded-full bg-indigo-700 text-white flex items-center justify-center text-[10px]">4</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Nota Conciliación</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Anexar la Nota de Conciliación Bancaria con firma del contador ratificando Bs. 0,00 de omisión de ingresos y pasivo NIIF 15.
              </p>
            </div>
            {onNavigateToModule && (
              <button
                onClick={() => onNavigateToModule('BANESCO_RECONCILIATION_NOTE')}
                className="text-[10px] font-bold text-indigo-800 hover:text-indigo-900 flex items-center gap-1 mt-2 underline cursor-pointer"
              >
                Ir a Nota Conciliación <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Step 5 */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-purple-900 mb-1">
                <span>PASO 5</span>
                <span className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px]">5</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Entrega & Acuse</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Consignar carpeta física en la Agencia Banesco. Solicitar sello húmedo con fecha, hora y firma en la Carta copia cliente.
              </p>
            </div>
            <span className="text-[10px] text-purple-800 font-semibold mt-2">Copia de Recibido</span>
          </div>

        </div>
      </div>

      {/* Modelo Interactivo de la Carpeta (Separadores A - E) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-emerald-700" />
              <span>Modelo Visual Interactivo de la Carpeta (Estructura por Separadores)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Haz clic en cada pestaña para inspeccionar exactamente qué documentos deben ir dentro de cada sección.
            </p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full font-bold font-mono shrink-0">
            5 Separadores con Pestañas Color
          </span>
        </div>

        {/* Tab Buttons / Folder Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 no-print">
          <button
            onClick={() => setActiveSeparator('A')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-x cursor-pointer ${
              activeSeparator === 'A'
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-md translate-y-[1px]'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-900 text-emerald-100 text-[10px] flex items-center justify-center font-mono">A</span>
            <span>SEPARADOR A: Carta Explicativa & Dictamen</span>
          </button>

          <button
            onClick={() => setActiveSeparator('B')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-x cursor-pointer ${
              activeSeparator === 'B'
                ? 'bg-blue-800 text-white border-blue-900 shadow-md translate-y-[1px]'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-100 text-[10px] flex items-center justify-center font-mono">B</span>
            <span>SEPARADOR B: Clientes Jurídicos (Bs. 427.80M)</span>
          </button>

          <button
            onClick={() => setActiveSeparator('C')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-x cursor-pointer ${
              activeSeparator === 'C'
                ? 'bg-amber-800 text-white border-amber-900 shadow-md translate-y-[1px]'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-900 text-amber-100 text-[10px] flex items-center justify-center font-mono">C</span>
            <span>SEPARADOR C: Clientes Naturales (Bs. 326.41M)</span>
          </button>

          <button
            onClick={() => setActiveSeparator('D')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-x cursor-pointer ${
              activeSeparator === 'D'
                ? 'bg-teal-800 text-white border-teal-900 shadow-md translate-y-[1px]'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-teal-900 text-teal-100 text-[10px] flex items-center justify-center font-mono">D</span>
            <span>SEPARADOR D: Mesa Banesco ($18.42M USD)</span>
          </button>

          <button
            onClick={() => setActiveSeparator('E')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-x cursor-pointer ${
              activeSeparator === 'E'
                ? 'bg-slate-800 text-white border-slate-900 shadow-md translate-y-[1px]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-900 text-slate-100 text-[10px] flex items-center justify-center font-mono">E</span>
            <span>SEPARADOR E: Legal & EEFF Agrícola Oni</span>
          </button>
        </div>

        {/* Content Panel for Active Separator */}
        <div className="p-6 rounded-2xl border bg-slate-50/50 space-y-6">
          
          {/* SEPARADOR A */}
          {activeSeparator === 'A' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-bold flex items-center justify-center text-sm font-mono">A</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">SEPARADOR A: Carta Explicativa Oficial & Dictamen de Contador Público</h3>
                    <p className="text-xs text-slate-600">Documento principal dirigido a la UPCL de Banesco e informe de auditoría contable/fiscal.</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-md border border-emerald-300 font-mono">
                  Sección Principal
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <FileText className="w-4 h-4" />
                    <span>1. Carta Oficial de Respuesta (Oficio AO-DIR-BAN-2026-042)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Carta dirigida a Banesco UPCL en papel membretado. Contiene la explicación exhaustiva de las operaciones de intermediación comercial y compra de café nacional.
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-emerald-900 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    &bull; Firmas: Elias Rafael Trías Abreu (Presidente) y Licdo. Omar Pérez Castillo (C.P.C. 16.336).
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <FileCheck className="w-4 h-4" />
                    <span>2. Nota de Conciliación Bancaria Banesco</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Hoja de trabajo que concilia el saldo contable con el saldo bancario en Banesco al 31/08/2026, certificando que la diferencia aducida de omisión de ingresos es de <strong>Bs. 0,00</strong>.
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-emerald-900 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    &bull; Certificación de Pasivo NIIF 15 / Sección 23.
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>3. Dictamen de Auditoría Fiscal SENIAT/SUDEBAN</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Dictamen formal emitido por Contador Público Colegiado indicando el estricto cumplimiento tributario del ISLR e IGTF, y la no existencia de ventas devengadas sin facturar.
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-emerald-900 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    &bull; Anexo con Sello de Actuación Profesional CPC.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEPARADOR B */}
          {activeSeparator === 'B' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-blue-800 text-white font-bold flex items-center justify-center text-sm font-mono">B</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">SEPARADOR B: Soporte de Anticipos de Clientes Jurídicos (Bs. 427.800.000,00)</h3>
                    <p className="text-xs text-slate-600">Soportes legales y bancarios de las 6 empresas jurídicas que transfirieron anticipos a Banesco.</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded-md border border-blue-300 font-mono">
                  6 Empresas Jurídicas
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>Documentos Requeridos por Cada Cliente Jurídico (Juegos de Expediente Indivduales):</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-900 block">1. AgroInsumos El Cafetal C.A.</span>
                    <span className="text-[11px] text-slate-600 block">RIF: J-30948102-3 &middot; Depósito BFC: Bs. 85.00M</span>
                    <span className="text-[10px] text-slate-500 block">&bull; Incluye: Contrato de Mandato + Transf. BFC + RIF + Cédula Rep. Legal</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-900 block">2. Comercializadora San José C.A.</span>
                    <span className="text-[11px] text-slate-600 block">RIF: J-40829103-5 &middot; Depósito Provincial: Bs. 72.30M</span>
                    <span className="text-[10px] text-slate-500 block">&bull; Incluye: Contrato de Mandato + Transf. Provincial + RIF + Cédula Rep. Legal</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-900 block">3. Distribuidora Central de Café C.A.</span>
                    <span className="text-[11px] text-slate-600 block">RIF: J-50192834-1 &middot; Depósito Banesco: Bs. 98.50M</span>
                    <span className="text-[10px] text-slate-500 block">&bull; Incluye: Contrato Mandato + Comprobante Banesco Mismo Banco + RIF</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-900 block">4. Inversiones Campo Verde C.A.</span>
                    <span className="text-[11px] text-slate-600 block">RIF: J-40192837-9 &middot; Depósito Banesco: Bs. 64.00M</span>
                    <span className="text-[10px] text-slate-500 block">&bull; Incluye: Contrato Mandato + Comprobante Banesco Mismo Banco + RIF</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-900 block">5. Torrefactora Los Andes C.A.</span>
                    <span className="text-[11px] text-slate-600 block">RIF: J-30192847-2 &middot; Depósito Banesco: Bs. 58.00M</span>
                    <span className="text-[10px] text-slate-500 block">&bull; Incluye: Contrato Mandato + Comprobante Banesco Mismo Banco + RIF</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-900 block">6. Agrocafé del Centro C.A.</span>
                    <span className="text-[11px] text-slate-600 block">RIF: J-50293847-8 &middot; Depósito Banesco: Bs. 50.00M</span>
                    <span className="text-[10px] text-slate-500 block">&bull; Incluye: Contrato Mandato + Comprobante Banesco Mismo Banco + RIF</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEPARADOR C */}
          {activeSeparator === 'C' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-amber-800 text-white font-bold flex items-center justify-center text-sm font-mono">C</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">SEPARADOR C: Soporte de Anticipos de Personas Naturales y Productores (Bs. 326.413.000,00)</h3>
                    <p className="text-xs text-slate-600">Soportes de acopio, pagos y anticipos de clientes e intermediarios naturales.</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-md border border-amber-300 font-mono">
                  Personas Naturales
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-amber-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-700" />
                    <span>1. Trazabilidad de Productor Principal: Manuel Becerra</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 text-[11px] list-disc list-inside">
                    <li>Comprobantes de anticipos y abonos recibidos/pagados por Bs. 498.40M / Bs. 210.00M.</li>
                    <li>Copia de Cédula de Identidad V-12.849.201 y RIF personal vigente.</li>
                    <li>Ficha de Inscripción de Productor Agrícola y Acopio de Café en Finca/Lote.</li>
                    <li>Guías SICA/SUNAGRO de movilización de café verde en Venezuela.</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-amber-900 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-amber-700" />
                    <span>2. Recibos de Pesaje & Compromisos de Entrega</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 text-[11px] list-disc list-inside">
                    <li>Recibos de pesaje de café pergamino seco generados por el sistema con firma de recepción.</li>
                    <li>Comprobantes de depósitos/transferencias individuales realizadas en Banesco.</li>
                    <li>Constancia de entrega física proyectada para la cosecha de Octubre 2026.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SEPARADOR D */}
          {activeSeparator === 'D' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-teal-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-teal-800 text-white font-bold flex items-center justify-center text-sm font-mono">D</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">SEPARADOR D: Resguardo de Operaciones Cambiarias Banesco ($18.428.571,43 USD)</h3>
                    <p className="text-xs text-slate-600">Comprobantes de compra de divisas oficiales en Mesa Banesco y facturas de insumos en Venezuela.</p>
                  </div>
                </div>
                <span className="text-xs bg-teal-100 text-teal-900 font-bold px-3 py-1 rounded-md border border-teal-300 font-mono">
                  Mesa de Cambio Banesco
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-teal-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-teal-700" />
                    <span>1. Adjudicaciones Oficiales Mesa de Cambio Banesco</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 text-[11px] list-disc list-inside">
                    <li>Comprobantes de Débito en Bolívares de Cta Corriente Banesco (Bs. 1.290.000.000,00).</li>
                    <li>Comprobantes de Crédito en Dólares de Cta Custodia Convenio 20 Banesco ($18.428.571,43 USD).</li>
                    <li>Pases de cambio y planillas de liquidación BCV emitidas por Banesco Banco Universal.</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-teal-900 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-teal-700" />
                    <span>2. Soportes de Uso de Fondos 100% Nacional (Venezuela)</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 text-[11px] list-disc list-inside">
                    <li>Cotizaciones y facturas proforma de compra de maquinaria, repuestos y sacos para café en Venezuela.</li>
                    <li>Comprobantes de pago a proveedores nacionales de fertilizantes e insumos agrícolas.</li>
                    <li>Demostración estricta de no salida de capitales ni transferencias internacionales no autorizadas.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SEPARADOR E */}
          {activeSeparator === 'E' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-sm font-mono">E</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">SEPARADOR E: Resguardo Legal, RIF y EEFF Auditados de Agrícola Oni C.A.</h3>
                    <p className="text-xs text-slate-600">Documentos constitutivos, estados financieros duales y libro auxiliar de Banesco.</p>
                  </div>
                </div>
                <span className="text-xs bg-slate-200 text-slate-900 font-bold px-3 py-1 rounded-md border border-slate-300 font-mono">
                  Documentación Legal
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-slate-700" />
                    <span>1. Acta Constitutiva & RIF</span>
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Copia legible del Acta Constitutiva de Agrícola Oni C.A. y RIF SENIAT J-50145638-0 actualizado.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-slate-700" />
                    <span>2. EEFF Dual (Bs. y USD)</span>
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Balance General y Estado de Resultados al 31/08/2026 firmado por CPC a tasa oficial BCV.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-slate-700" />
                    <span>3. Libro Auxiliar Banesco</span>
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Impresión completa del Libro Mayor Auxiliar de la Cuenta Corriente Banesco 2026.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-700" />
                    <span>4. Extractos Bancarios</span>
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Estados de cuenta bancarios oficiales de Banesco emitidos a través de BanescOnline Empresa.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Operation-by-Operation Document Mapping Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
              <span>Matriz Detallada: Soportes Requeridos por Cada Operación Banesco</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifica exactamente qué documento debe ir adosado según la naturaleza de la transacción bancaria.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">SIEVEX 2026 Audit Matrix</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-800 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3">Tipo de Operación con Banesco</th>
                <th className="p-3">Comprobante Bancario Originador</th>
                <th className="p-3">Soporte Legal y Contable Obligatorio</th>
                <th className="p-3">Soporte Tributario SENIAT / SUDEBAN</th>
                <th className="p-3 text-center">Ubicación Carpeta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-bold text-slate-900">
                  1. Anticipos de Clientes Jurídicos (Bs. 427.80M)
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-600">
                  Transferencia BFC / Provincial / Banesco Mismo Banco
                </td>
                <td className="p-3">
                  Contrato Marco de Mandato e Intermediación Comercial firmado
                </td>
                <td className="p-3 text-emerald-800 font-medium">
                  Copia RIF SENIAT vigente + Nota NIIF 15 Pasivo Exigible en Café
                </td>
                <td className="p-3 text-center font-mono font-bold text-blue-900 bg-blue-50/50 rounded-lg">
                  Separador B
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-bold text-slate-900">
                  2. Anticipos de Personas Naturales (Bs. 326.41M)
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-600">
                  Planilla de Depósito / Transf. Banesco
                </td>
                <td className="p-3">
                  Ficha de Productor + Recibo de Pesaje y Recepción de Café
                </td>
                <td className="p-3 text-emerald-800 font-medium">
                  Copia Cédula Identidad + Guía SICA/SUNAGRO
                </td>
                <td className="p-3 text-center font-mono font-bold text-amber-900 bg-amber-50/50 rounded-lg">
                  Separador C
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-bold text-slate-900">
                  3. Compra Dólares Mesa Banesco ($18.42M USD)
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-600">
                  Débito VES Cta Corriente + Crédito USD Cta Custodia
                </td>
                <td className="p-3">
                  Pase de Adjudicación Cambiaria Banesco
                </td>
                <td className="p-3 text-emerald-800 font-medium">
                  Cotizaciones y Facturas de Insumos/Repuestos en Venezuela
                </td>
                <td className="p-3 text-center font-mono font-bold text-teal-900 bg-teal-50/50 rounded-lg">
                  Separador D
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-bold text-slate-900">
                  4. Transferencias Internas y Aportes Socios
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-600">
                  Transferencia Mismo Titular Banesco
                </td>
                <td className="p-3">
                  Asiento Contable de Tesorería / Préstamo de Socio
                </td>
                <td className="p-3 text-emerald-800 font-medium">
                  Acta de Asamblea de Aumento Capital o Préstamo Temporal
                </td>
                <td className="p-3 text-center font-mono font-bold text-slate-900 bg-slate-100 rounded-lg">
                  Separador E
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-bold text-slate-900">
                  5. Pagos a Productores y Proveedores Nacionales
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-600">
                  Comprobante de Egreso / Transferencia Banesco
                </td>
                <td className="p-3">
                  Factura Comercial de Compra o Recibo de Pago de Café
                </td>
                <td className="p-3 text-emerald-800 font-medium">
                  Comprobante de Retención de ISLR / IGTF si aplica
                </td>
                <td className="p-3 text-center font-mono font-bold text-emerald-900 bg-emerald-50/50 rounded-lg">
                  Separador A/E
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Checklist for Folder Assembly */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <span>Lista de Chequeo Interactiva de Armado de la Carpeta Banesco</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Marca cada elemento a medida que lo imprimas, firmes y archives dentro de la carpeta física.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">PROGRESO DE ARMADO:</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">{progressPercent}% COMPLETO</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center font-mono font-bold text-xs text-white bg-slate-900/80">
              {completedItems}/{totalItems}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-2">
          
          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.cartaFirmada ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.cartaFirmada}
              onChange={() => handleToggleCheck('cartaFirmada')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">1. Carta Respuesta Explicativa Firmada</span>
              <span className="text-[10px] text-slate-400">Firmas Elias Rafael Trías Abreu y Licdo. Omar Pérez Castillo (C.P.C.)</span>
            </div>
          </label>

          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.notaConciliacion ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.notaConciliacion}
              onChange={() => handleToggleCheck('notaConciliacion')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">2. Nota de Conciliación Bancaria Banesco</span>
              <span className="text-[10px] text-slate-400">Certificando Bs. 0,00 de omisión de ingresos</span>
            </div>
          </label>

          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.dictamenAuditor ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.dictamenAuditor}
              onChange={() => handleToggleCheck('dictamenAuditor')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">3. Dictamen Auditor de Cumplimiento CPC</span>
              <span className="text-[10px] text-slate-400">Sello de Actuación Profesional Licdo. Omar Pérez Castillo (C.P.C. 16.336)</span>
            </div>
          </label>

          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.contratosJuridicos ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.contratosJuridicos}
              onChange={() => handleToggleCheck('contratosJuridicos')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">4. 6 Contratos Marco Mandato Jurídicos</span>
              <span className="text-[10px] text-slate-400">Suscritos con empresas compradoras de café</span>
            </div>
          </label>

          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.rifClientesJuridicos ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.rifClientesJuridicos}
              onChange={() => handleToggleCheck('rifClientesJuridicos')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">5. Copia RIF SENIAT 6 Empresas Jurídicas</span>
              <span className="text-[10px] text-slate-400">Actualizados y vigentes con cédulas de rep. legal</span>
            </div>
          </label>

          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.recibosNaturales ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.recibosNaturales}
              onChange={() => handleToggleCheck('recibosNaturales')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">6. Recibos de Depósitos / Anticipos Naturales</span>
              <span className="text-[10px] text-slate-400">Resguardo de Bs. 326.41M en anticipos</span>
            </div>
          </label>

          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.cedulasProductores ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.cedulasProductores}
              onChange={() => handleToggleCheck('cedulasProductores')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">7. Cédulas & Guías SUNAGRO Productores</span>
              <span className="text-[10px] text-slate-400">Trazabilidad de Manuel Becerra y acopios</span>
            </div>
          </label>

          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.comprobantesMesaBanesco ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.comprobantesMesaBanesco}
              onChange={() => handleToggleCheck('comprobantesMesaBanesco')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">8. Pases Cambiarios Mesa Banesco</span>
              <span className="text-[10px] text-slate-400">Débitos en VES y crédito en USD Cta Custodia</span>
            </div>
          </label>

          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.facturasInsumosVenezuela ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.facturasInsumosVenezuela}
              onChange={() => handleToggleCheck('facturasInsumosVenezuela')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">9. Facturas / Proformas Insumos en Venezuela</span>
              <span className="text-[10px] text-slate-400">Demostrando uso local de divisas adquiridas</span>
            </div>
          </label>

          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.actaConstitutivaOni ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.actaConstitutivaOni}
              onChange={() => handleToggleCheck('actaConstitutivaOni')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">10. Acta Constitutiva Agrícola Oni C.A.</span>
              <span className="text-[10px] text-slate-400">Copia legalizada con RIF J-50145638-0</span>
            </div>
          </label>

          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.eeffAudita2026 ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.eeffAudita2026}
              onChange={() => handleToggleCheck('eeffAudita2026')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">11. EEFF Duales Auditados al 31/08/2026</span>
              <span className="text-[10px] text-slate-400">Balance e Ingresos en Bs. y USD</span>
            </div>
          </label>

          <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
            checklist.libroAuxiliarBanesco ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-300'
          }`}>
            <input
              type="checkbox"
              checked={checklist.libroAuxiliarBanesco}
              onChange={() => handleToggleCheck('libroAuxiliarBanesco')}
              className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400"
            />
            <div>
              <span className="font-bold block">12. Libro Auxiliar Banesco Impreso</span>
              <span className="text-[10px] text-slate-400">Trazabilidad completa de entradas y salidas</span>
            </div>
          </label>

        </div>
      </div>

      {/* Preview Modal / Expandable Text Box for Direct Copying */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Texto Completo de la Guía de Armado (Listo para Copiar a Word)</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-800 bg-slate-50 leading-relaxed whitespace-pre-wrap select-all border-b border-slate-200">
              {plainTextGuide}
            </div>

            <div className="p-4 bg-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-medium">
                Haz clic en <strong>"Copiar Todo el Texto"</strong> o selecciona el texto superior y presiona <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">Ctrl + C</code>.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyText}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar Todo el Texto</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
