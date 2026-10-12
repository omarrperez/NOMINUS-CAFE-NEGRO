import React, { useState } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  Building,
  UserCheck,
  ShieldCheck,
  FileCheck,
  Landmark,
  Scale,
  FolderArchive,
  Search,
  CheckSquare,
  Square,
  Loader2,
  ChevronDown,
  Archive,
  Eye,
  CheckCircle2,
  Calendar,
  DollarSign,
  User
} from 'lucide-react';
import { DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { formatBs, formatDateVE, formatTasaBCV, formatUSD } from '../utils/formatters';
import {
  downloadPdfTapaExpediente,
  downloadPdfCuestionarioKYC,
  downloadPdfContratoCompraventa,
  downloadPdfCartaAlBanco,
  downloadPdfDeclaracionOrigenDestino,
  downloadPdfGuiaMarcoLegal,
} from '../utils/pdfGenerator';
import { exportExpedienteIndividualExcel } from '../utils/excelGenerator';
import {
  downloadContratoWord,
  downloadBatchContratosWordZip,
  downloadBatchContratosWordUnified,
} from '../utils/wordGenerator';

interface DocumentosLegalesViewProps {
  expedientes: ExpedienteOperacion[];
  empresa: DatosEmpresaImportadora;
}

export type TipoDocumento =
  | 'lote-contratos'
  | 'contrato'
  | 'kyc'
  | 'tapa'
  | 'carta-banco'
  | 'declaracion-bcv'
  | 'marco-legal';

export const DocumentosLegalesView: React.FC<DocumentosLegalesViewProps> = ({
  expedientes,
  empresa,
}) => {
  const [selectedExpedienteId, setSelectedExpedienteId] = useState<string>(
    expedientes.length > 0 ? expedientes[0].id : ''
  );
  const [docTipo, setDocTipo] = useState<TipoDocumento>('lote-contratos');
  const [copied, setCopied] = useState<boolean>(false);

  // Estados para el espacio de contratos y descarga en Word por lote
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedContracts, setSelectedContracts] = useState<Record<string, boolean>>({});
  const [isGeneratingWord, setIsGeneratingWord] = useState<boolean>(false);
  const [wordProgress, setWordProgress] = useState<{ current: number; total: number } | null>(null);
  const [wordSuccessToast, setWordSuccessToast] = useState<string | null>(null);
  const [showTopWordDropdown, setShowTopWordDropdown] = useState<boolean>(false);

  const op = expedientes.find((e) => e.id === selectedExpedienteId) || expedientes[0];

  if (!op) {
    return (
      <div className="p-8 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
        No hay expedientes disponibles para generar documentos.
      </div>
    );
  }

  // Cálculos consolidados para el lote de contratos
  const totalBsContratos = expedientes.reduce((acc, e) => acc + (e.anticipo?.montoBs || 0), 0);
  const totalUsdContratos = expedientes.reduce((acc, e) => acc + (e.divisas?.montoUsd || 0), 0);

  // Filtrado de expedientes por buscador
  const filteredExpedientes = expedientes.filter((e) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const nombre = (e.cliente.nombre || '').toLowerCase();
    const cedula = (e.cliente.cedula || '').toLowerCase();
    const expNum = (e.numeroExpediente || '').toLowerCase();
    return nombre.includes(term) || cedula.includes(term) || expNum.includes(term);
  });

  // Manejadores de selección múltiple
  const toggleSelectContract = (id: string) => {
    setSelectedContracts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAllFiltered = () => {
    const all: Record<string, boolean> = { ...selectedContracts };
    filteredExpedientes.forEach((e) => {
      all[e.id] = true;
    });
    setSelectedContracts(all);
  };

  const clearAllSelected = () => {
    setSelectedContracts({});
  };

  const selectedCount = Object.keys(selectedContracts).filter((id) => selectedContracts[id]).length;

  // Descargas en Word
  const handleDownloadSingleWord = async (targetOp: ExpedienteOperacion) => {
    try {
      await downloadContratoWord(targetOp, empresa);
      setWordSuccessToast(`Contrato de ${targetOp.cliente.nombre} descargado en Word (.docx)`);
      setTimeout(() => setWordSuccessToast(null), 3500);
    } catch (err) {
      console.error('Error al descargar contrato en Word:', err);
    }
  };

  const handleDownloadBatchZip = async (listToDownload = expedientes) => {
    if (isGeneratingWord || listToDownload.length === 0) return;
    try {
      setIsGeneratingWord(true);
      setShowTopWordDropdown(false);
      setWordProgress({ current: 0, total: listToDownload.length });
      await downloadBatchContratosWordZip(listToDownload, empresa, (curr, tot) => {
        setWordProgress({ current: curr, total: tot });
      });
      setWordSuccessToast(
        `¡Se descargaron ${listToDownload.length} contratos en Word (.docx) comprimidos en ZIP!`
      );
      setTimeout(() => setWordSuccessToast(null), 4000);
    } catch (err) {
      console.error('Error al descargar lote Word en ZIP:', err);
    } finally {
      setIsGeneratingWord(false);
      setWordProgress(null);
    }
  };

  const handleDownloadBatchUnified = async (listToDownload = expedientes) => {
    if (isGeneratingWord || listToDownload.length === 0) return;
    try {
      setIsGeneratingWord(true);
      setShowTopWordDropdown(false);
      setWordProgress({ current: 0, total: listToDownload.length });
      await downloadBatchContratosWordUnified(listToDownload, empresa, (curr, tot) => {
        setWordProgress({ current: curr, total: tot });
      });
      setWordSuccessToast(`¡Dossier maestro de contratos en Word (.docx) descargado!`);
      setTimeout(() => setWordSuccessToast(null), 4000);
    } catch (err) {
      console.error('Error al descargar dossier Word unificado:', err);
    } finally {
      setIsGeneratingWord(false);
      setWordProgress(null);
    }
  };

  const handleDownloadSelectedWord = async () => {
    const list = expedientes.filter((e) => selectedContracts[e.id]);
    if (list.length === 0) return;
    await handleDownloadBatchZip(list);
  };

  // Descargas en PDF
  const handleDownloadPdf = () => {
    switch (docTipo) {
      case 'lote-contratos':
      case 'contrato':
        downloadPdfContratoCompraventa(op, empresa);
        break;
      case 'kyc':
        downloadPdfCuestionarioKYC(op, empresa);
        break;
      case 'tapa':
        downloadPdfTapaExpediente(op, empresa);
        break;
      case 'carta-banco':
        downloadPdfCartaAlBanco(op, empresa);
        break;
      case 'declaracion-bcv':
        downloadPdfDeclaracionOrigenDestino(op, empresa);
        break;
      case 'marco-legal':
        downloadPdfGuiaMarcoLegal(empresa);
        break;
    }
  };

  const handleDownloadExcel = () => {
    exportExpedienteIndividualExcel(op, empresa);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal y Barra de Acciones */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                Generador de Documentos y Contratos Legales
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                Leyes de Venezuela
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Contratos mercantiles de compraventa a entrega futura formalizados a nombre de{' '}
              <strong className="text-stone-700">{empresa.razonSocial}</strong> (RIF {empresa.rif}).
            </p>
          </div>

          {/* Selector de Cliente y Botones de Descarga */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={op.id}
              onChange={(e) => setSelectedExpedienteId(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-800 focus:border-amber-400 focus:outline-hidden"
            >
              {expedientes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.numeroExpediente} - {e.cliente.nombre}
                </option>
              ))}
            </select>

            {/* BOTÓN DESCARGAR EN WORD (.DOCX) - CON DESPLEGABLE DE LOTE */}
            <div className="relative inline-flex items-center shadow-xs rounded-lg">
              <button
                onClick={() =>
                  docTipo === 'lote-contratos'
                    ? handleDownloadBatchZip(expedientes)
                    : handleDownloadSingleWord(op)
                }
                disabled={isGeneratingWord}
                className="flex items-center gap-1.5 rounded-l-lg border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
                title="Descargar contrato(s) en formato Microsoft Word (.docx) editable"
              >
                {isGeneratingWord ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>
                      {wordProgress
                        ? `Generando Word (${wordProgress.current}/${wordProgress.total})...`
                        : 'Generando Word...'}
                    </span>
                  </>
                ) : (
                  <>
                    <FileText className="h-3.5 w-3.5 text-white" />
                    <span>
                      {docTipo === 'lote-contratos'
                        ? `Descargar Lote Word (${expedientes.length})`
                        : 'Descargar Word (.docx)'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowTopWordDropdown(!showTopWordDropdown)}
                disabled={isGeneratingWord}
                className="rounded-r-lg border-y border-r border-blue-600 bg-blue-700 px-2 py-1.5 text-xs text-white hover:bg-blue-800 transition-colors cursor-pointer disabled:opacity-60"
                title="Opciones de exportación en Word (.docx)"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {showTopWordDropdown && (
                <div
                  className="absolute right-0 top-full mt-1.5 z-40 w-72 rounded-xl border border-stone-200 bg-white p-2 shadow-xl"
                  onMouseLeave={() => setShowTopWordDropdown(false)}
                >
                  <div className="px-2 py-1 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100 mb-1">
                    Exportación en Word (.docx)
                  </div>
                  <button
                    onClick={() => handleDownloadSingleWord(op)}
                    className="w-full flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-stone-50 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-800">Contrato Actual en Word</p>
                      <p className="text-[11px] text-stone-500">
                        Descarga solo el contrato de {op.cliente.nombre.slice(0, 20)}...
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDownloadBatchZip(expedientes)}
                    className="w-full flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-stone-50 cursor-pointer mt-1"
                  >
                    <Archive className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-800">Lote en ZIP (15 Archivos .docx)</p>
                      <p className="text-[11px] text-stone-500">
                        Un archivo Word editable para cada persona natural.
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDownloadBatchUnified(expedientes)}
                    className="w-full flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-stone-50 cursor-pointer mt-1"
                  >
                    <FolderArchive className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-800">Dossier Maestro Único (.docx)</p>
                      <p className="text-[11px] text-stone-500">
                        Todos los contratos en un solo archivo Word con saltos de página.
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* BOTÓN DESCARGAR PDF */}
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition-colors cursor-pointer"
              title="Descargar este documento actual en formato PDF formal"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Descargar PDF</span>
            </button>

            {/* BOTÓN DESCARGAR EXCEL */}
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-800 transition-colors cursor-pointer"
              title="Descargar expediente y datos del contrato en formato Excel (.xlsx)"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
              <span>Descargar Excel</span>
            </button>

            {/* BOTÓN IMPRIMIR */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors cursor-pointer"
              title="Imprimir documento con formato oficial"
            >
              <Printer className="h-3.5 w-3.5 text-stone-500" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación de Documentos */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-stone-100 pt-3">
          {/* PESTAÑA PRINCIPAL: ESPACIO DE CONTRATOS POR PERSONAS NATURALES */}
          <button
            onClick={() => setDocTipo('lote-contratos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              docTipo === 'lote-contratos'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <FolderArchive className="h-3.5 w-3.5" />
            <span>Espacio de Contratos (Personas Naturales)</span>
            <span
              className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                docTipo === 'lote-contratos' ? 'bg-white/25 text-white' : 'bg-blue-200 text-blue-900'
              }`}
            >
              {expedientes.length}
            </span>
          </button>

          <button
            onClick={() => setDocTipo('contrato')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              docTipo === 'contrato'
                ? 'bg-rose-100/70 text-rose-900 border border-rose-200 font-semibold shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Scale className="h-3.5 w-3.5 text-rose-700" />
            <span>Visor Individual de Contrato</span>
          </button>

          <button
            onClick={() => setDocTipo('kyc')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              docTipo === 'kyc'
                ? 'bg-sky-100/70 text-sky-900 border border-sky-200 font-semibold shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-sky-700" />
            <span>Cuestionario KYC Persona Natural</span>
          </button>

          <button
            onClick={() => setDocTipo('tapa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              docTipo === 'tapa'
                ? 'bg-amber-100/70 text-amber-900 border border-amber-200 font-semibold shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FileCheck className="h-3.5 w-3.5 text-amber-700" />
            <span>Tapa de Expediente (Checklist)</span>
          </button>

          <button
            onClick={() => setDocTipo('carta-banco')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              docTipo === 'carta-banco'
                ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-200 font-semibold shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Landmark className="h-3.5 w-3.5 text-emerald-700" />
            <span>Carta al Oficial de Cumplimiento</span>
          </button>

          <button
            onClick={() => setDocTipo('declaracion-bcv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              docTipo === 'declaracion-bcv'
                ? 'bg-purple-100/70 text-purple-900 border border-purple-200 font-semibold shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-purple-700" />
            <span>Declaración de Origen Lícito (BCV)</span>
          </button>
          <button
            onClick={() => setDocTipo('marco-legal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              docTipo === 'marco-legal'
                ? 'bg-amber-100/70 text-amber-900 border border-amber-300 font-semibold shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Scale className="h-3.5 w-3.5 text-amber-700" />
            <span>Guía Marco Legal (PDF)</span>
          </button>
        </div>

        {/* Notificación Toast de Éxito al Descargar Word */}
        {wordSuccessToast && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-medium text-blue-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span>{wordSuccessToast}</span>
            </div>
            <button
              onClick={() => setWordSuccessToast(null)}
              className="text-blue-700 hover:text-blue-900 font-bold ml-2 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ESPACIO DEDICADO PARA LOS CONTRATOS DE CADA PERSONA NATURAL    */}
      {/* ============================================================== */}
      {docTipo === 'lote-contratos' ? (
        <div className="space-y-6">
          {/* Tarjeta de Métricas y Controles de Descarga en Lote */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FolderArchive className="h-5 w-5 text-blue-600" />
                  <h2 className="text-base font-bold text-stone-900">
                    Espacio de Contratos de Compraventa · Personas Naturales
                  </h2>
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  Relación individualizada de contratos mercantiles a entrega futura celebrados por{' '}
                  <strong className="text-stone-700">{empresa.razonSocial}</strong> (RIF {empresa.rif}) con cada persona natural. Descárgalos individualmente o por lote en formato Word (.docx).
                </p>
              </div>

              {/* Botones de Acción Masiva en Word */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleDownloadBatchZip(expedientes)}
                  disabled={isGeneratingWord}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                  title="Descarga todos los contratos en archivos Word independientes (.docx) comprimidos en un ZIP"
                >
                  {isGeneratingWord ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>
                        {wordProgress
                          ? `Descargando (${wordProgress.current}/${wordProgress.total})...`
                          : 'Procesando...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4" />
                      <span>Descargar Lote en Word (.docx / ZIP)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownloadBatchUnified(expedientes)}
                  disabled={isGeneratingWord}
                  className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 px-3.5 py-2 text-xs font-bold text-stone-800 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                  title="Descarga un único archivo Word consolidado con todos los contratos separados por saltos de página"
                >
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Dossier Maestro en Word (.docx)</span>
                </button>

                {selectedCount > 0 && (
                  <button
                    onClick={handleDownloadSelectedWord}
                    disabled={isGeneratingWord}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckSquare className="h-4 w-4" />
                    <span>Descargar Seleccionados en Word ({selectedCount})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Resumen KPI y Barra de Búsqueda */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
              <div className="rounded-xl bg-stone-50 p-3 border border-stone-200/70">
                <p className="text-[11px] font-medium text-stone-500 uppercase tracking-wide">
                  Total Contratos
                </p>
                <p className="mt-1 text-base font-bold text-stone-900">
                  {expedientes.length} Personas Naturales
                </p>
              </div>

              <div className="rounded-xl bg-blue-50/60 p-3 border border-blue-200/70">
                <p className="text-[11px] font-medium text-blue-700 uppercase tracking-wide">
                  Total Anticipos Recibidos
                </p>
                <p className="mt-1 text-base font-bold text-blue-900">
                  {formatBs(totalBsContratos)}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50/60 p-3 border border-emerald-200/70">
                <p className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide">
                  Total Divisas Oficiales BCV
                </p>
                <p className="mt-1 text-base font-bold text-emerald-900">
                  {formatUSD(totalUsdContratos)}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50/60 p-3 border border-amber-200/70">
                <p className="text-[11px] font-medium text-amber-800 uppercase tracking-wide">
                  Regla de Oro SUDEBAN
                </p>
                <p className="mt-1 text-base font-bold text-amber-900">
                  100% Sin Terceros
                </p>
              </div>
            </div>

            {/* Buscador y Selección Rápida */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-stone-100 pt-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar persona natural por nombre, cédula o expediente..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={selectAllFiltered}
                  className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  <CheckSquare className="h-3.5 w-3.5 text-blue-600" />
                  <span>Seleccionar Todos</span>
                </button>
                {selectedCount > 0 && (
                  <button
                    onClick={clearAllSelected}
                    className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    <span>Limpiar ({selectedCount})</span>
                  </button>
                )}
                <span className="text-stone-400">|</span>
                <span className="text-stone-500">
                  Mostrando <strong>{filteredExpedientes.length}</strong> de {expedientes.length}
                </span>
              </div>
            </div>
          </div>

          {/* Listado de Contratos de cada Persona Natural */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExpedientes.map((e) => {
              const isSelected = Boolean(selectedContracts[e.id]);
              return (
                <div
                  key={e.id}
                  className={`rounded-2xl border p-4.5 transition-all bg-white shadow-xs flex flex-col justify-between ${
                    isSelected ? 'border-blue-400 ring-2 ring-blue-100 bg-blue-50/20' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    {/* Encabezado de la Tarjeta */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSelectContract(e.id)}
                          className="text-stone-400 hover:text-blue-600 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4.5 w-4.5 text-blue-600" />
                          ) : (
                            <Square className="h-4.5 w-4.5" />
                          )}
                        </button>
                        <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[11px] font-bold border border-stone-200">
                          EXP {e.numeroExpediente}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        <Check className="h-3 w-3" />
                        <span>Firmado</span>
                      </span>
                    </div>

                    {/* Datos del Cliente (Persona Natural) */}
                    <div className="space-y-1 mb-3">
                      <h3 className="font-bold text-stone-900 text-sm leading-snug">
                        {e.cliente.nombre}
                      </h3>
                      <p className="text-xs text-stone-600 font-mono">
                        C.I. {e.cliente.cedula} · RIF: {e.cliente.rif || 'N/A'}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {e.cliente.telefono ? `Tlf: ${e.cliente.telefono} · ` : ''}
                        {e.cliente.ocupacion || 'Comerciante'}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate" title={e.cliente.direccionHabitacion}>
                        {e.cliente.direccionHabitacion}
                      </p>
                    </div>

                    {/* Ficha Resumen del Contrato */}
                    <div className="rounded-xl bg-stone-50 p-2.5 text-[11px] space-y-1.5 border border-stone-200/60 mb-4">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Rubro Contratado:</span>
                        <span className="font-semibold text-stone-800 text-right truncate max-w-[150px]">
                          {e.cliente.producto}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Cantidad:</span>
                        <span className="font-medium text-stone-700">{e.cliente.cantidad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Anticipo en Bs:</span>
                        <span className="font-bold text-blue-900 font-mono">
                          {formatBs(e.anticipo?.montoBs || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Divisas BCV (USD):</span>
                        <span className="font-bold text-emerald-800 font-mono">
                          {formatUSD(e.divisas?.montoUsd || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-stone-200/70 pt-1 text-[10px]">
                        <span className="text-stone-400">Fecha de Firma:</span>
                        <span className="text-stone-600">{formatDateVE(e.fechaContrato)}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-stone-400">Banco Receptor:</span>
                        <span className="text-stone-600 truncate max-w-[130px]" title={e.anticipo?.bancoDestino}>
                          {e.anticipo?.bancoDestino || 'Mercantil'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de Descarga y Visor del Contrato */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-stone-100">
                    <button
                      onClick={() => handleDownloadSingleWord(e)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2 py-1.5 text-[11px] font-semibold text-blue-800 hover:bg-blue-100 transition-colors cursor-pointer"
                      title="Descargar este contrato en Microsoft Word (.docx)"
                    >
                      <FileText className="h-3.5 w-3.5 text-blue-600" />
                      <span>Word (.docx)</span>
                    </button>

                    <button
                      onClick={() => downloadPdfContratoCompraventa(e, empresa)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2 py-1.5 text-[11px] font-semibold text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Descargar este contrato en PDF"
                    >
                      <Download className="h-3.5 w-3.5 text-rose-600" />
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedExpedienteId(e.id);
                        setDocTipo('contrato');
                      }}
                      className="flex items-center justify-center rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-[11px] font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                      title="Ver contrato completo en hoja membretada"
                    >
                      <Eye className="h-3.5 w-3.5 text-stone-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredExpedientes.length === 0 && (
            <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
              No se encontraron personas naturales que coincidan con &quot;{searchTerm}&quot;.
            </div>
          )}
        </div>
      ) : (
        /* ============================================================== */
        /* VISOR DE DOCUMENTO EN HOJA MEMBRETADA (IMPRIMIBLE & PDF)      */
        /* ============================================================== */
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-10 shadow-xs max-w-4xl mx-auto printable-doc font-serif text-slate-800">
          {/* Membrete Oficial de la Empresa Importadora */}
          <div className="border-b-2 border-stone-300 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-sans text-sm font-bold tracking-tight text-slate-900 uppercase">
                  {empresa.razonSocial}
                </h2>
                <p className="font-sans text-xs text-stone-500">
                  RIF: {empresa.rif} · {empresa.registroMercantil}
                </p>
                <p className="font-sans text-xs text-stone-500">
                  {empresa.direccionFiscal} · Tlf: {empresa.telefono}
                </p>
              </div>
              <div className="text-right font-sans">
                <span className="inline-block px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-mono text-xs font-bold border border-stone-200">
                  EXP: {op.numeroExpediente}
                </span>
                <p className="text-[11px] text-stone-400 mt-1">
                  {empresa.ciudadEstado.split(',')[0] || 'Barcelona'}, {formatDateVE(op.fechaContrato)}
                </p>
              </div>
            </div>
          </div>

          {/* 1. DOCUMENTO: CONTRATO DE COMPRAVENTA CON ENTREGA FUTURA */}
          {docTipo === 'contrato' && (
            <div className="space-y-4 text-xs leading-relaxed text-justify">
              <h3 className="font-sans text-center text-sm font-bold text-slate-900 uppercase tracking-wide">
                CONTRATO DE COMPRAVENTA DE CAFÉ IMPORTADO CON ENTREGA FUTURA
                <br />
                <span className="font-normal text-xs text-stone-500">
                  (ORDEN DE COMPRA CON ANTICIPO BANCARIZADO)
                </span>
              </h3>

              <p>
                Entre, <strong className="font-sans">{empresa.razonSocial}</strong>, sociedad mercantil inscrita por ante el {empresa.registroMercantil}, bajo el N° {empresa.folioNumero}, Tomo {empresa.tomoNumero}, de fecha {empresa.fechaRegistro}, titular del RIF N° <strong>{empresa.rif}</strong>, inscrita en el registro que aplica para rubros agroalimentarios (SUNAGRO/SICA: {empresa.registroSunagro}), domiciliada en {empresa.direccionFiscal}, representada en este acto por <strong>{empresa.representanteLegal}</strong>, en su carácter de {empresa.cargoRepresentante}, titular de la cédula de identidad N° <strong>{empresa.cedulaRepresentante}</strong>, en lo sucesivo <strong>&quot;LA EMPRESA&quot;</strong> (importador de registro); y por la otra parte, <strong>{op.cliente.nombre}</strong>, mayor de edad, de nacionalidad {op.cliente.nacionalidad}, titular de la cédula de identidad N° <strong>{op.cliente.cedula}</strong>, RIF personal N° <strong>{op.cliente.rif || 'N/A'}</strong>, domiciliado(a) en {op.cliente.direccionHabitacion}, en lo sucesivo <strong>&quot;EL COMPRADOR&quot;</strong>; se ha convenido en celebrar el presente contrato:
              </p>

              <div>
                <p className="font-sans font-bold text-slate-900">CLÁUSULA PRIMERA - OBJETO</p>
                <p>
                  LA EMPRESA se obliga a vender a EL COMPRADOR, y éste a comprar, <strong>{op.cliente.cantidad}</strong> de <strong>{op.cliente.producto}</strong>, origen <strong>{op.cliente.origen}</strong>, que LA EMPRESA importará por cuenta propia, en su propio nombre y riesgo, como importador de registro. Queda expresamente establecido que LA EMPRESA actúa como compradora e importadora de la mercancía y vendedora frente a EL COMPRADOR, y que el presente contrato es una compraventa con entrega futura; en consecuencia, EL COMPRADOR no confiere mandato alguno sobre fondos a LA EMPRESA.
                </p>
              </div>

              <div>
                <p className="font-sans font-bold text-slate-900">CLÁUSULA SEGUNDA - PRECIO</p>
                <p>
                  El precio total referencial de venta es de <strong>{formatBs(op.anticipo.montoBs)}</strong> o su equivalente en divisas de <strong>{formatUSD(op.divisas.montoUsd)}</strong>, calculado a la tasa de cambio oficial del Banco Central de Venezuela publicada para la fecha de adquisición de las divisas ({formatTasaBCV(op.divisas.tasaBCV)}), más los impuestos de ley (IVA). La factura definitiva se emitirá al momento de la entrega material.
                </p>
              </div>

              <div>
                <p className="font-sans font-bold text-slate-900">CLÁUSULA TERCERA - ANTICIPO Y BANCARIZACIÓN ESTRICTA</p>
                <p>
                  EL COMPRADOR entrega en este acto un anticipo de <strong>{formatBs(op.anticipo.montoBs)}</strong>, como pago parcial del precio de la mercancía. El anticipo ha sido recibido exclusivamente mediante <strong>{op.anticipo.formaPago}</strong> desde una cuenta a nombre de EL COMPRADOR en <strong>{op.anticipo.bancoOrigen}</strong> (Ref. <strong>{op.anticipo.referencia}</strong>), quedando expresamente excluido el efectivo y los pagos de terceros. El anticipo es facturado conforme a la normativa del SENIAT con Factura N° <strong>{op.anticipo.facturaSeniat}</strong> y registrado como pasivo comercial (anticipos de clientes) hasta la entrega definitiva.
                </p>
              </div>

              <div>
                <p className="font-sans font-bold text-slate-900">CLÁUSULA CUARTA - USO DE LOS RECURSOS Y COMPRA DE DIVISAS</p>
                <p>
                  LA EMPRESA declara que el anticipo se aplicará al financiamiento de esta importación específica. LA EMPRESA efectuará la compra de divisas a través de entidades bancarias autorizadas (Mesa de Cambio: {op.divisas.bancoMesaCambio}), en el marco de la normativa cambiaria emanada del Banco Central de Venezuela, declarando el origen y destino lícito de los recursos. Las divisas adquiridas y no utilizadas en esta operación serán reintegradas o vendidas conforme a la normativa vigente.
                </p>
              </div>

              <div>
                <p className="font-sans font-bold text-slate-900">CLÁUSULA QUINTA - PERMISOS Y REGISTROS</p>
                <p>
                  LA EMPRESA gestionará por su cuenta los permisos, licencias, registros y requisitos aplicables a la importación del rubro (SUNAGRO/SICA, SENIAT/aduanas, INSAI sanitarios y cuales otros apliquen).
                </p>
              </div>

              <div>
                <p className="font-sans font-bold text-slate-900">CLÁUSULA SEXTA - TRANSPARENCIA Y PREVENCIÓN DE LAVADO DE DINERO</p>
                <p>
                  Ambas partes declaran que los fondos utilizados provienen de actividades económicas lícitas y que conocen la Ley contra el Lavado de Dinero, el Financiamiento al Terrorismo y los Delitos en Materia de Cambios, la Ley de Instituciones del Sector Bancario y el Instructivo sobre Lavado de Dinero y Financiamiento al Terrorismo (ILFT) de SUDEBAN. EL COMPRADOR autoriza a LA EMPRESA a suministrar la información de esta operación a instituciones financieras cuando sea requerida en el marco de la debida diligencia. EL COMPRADOR presenta su cuestionario KYC debidamente firmado, copia de cédula y RIF.
                </p>
              </div>

              <div>
                <p className="font-sans font-bold text-slate-900">CLÁUSULA SÉPTIMA - DOMICILIO Y JURISDICCIÓN</p>
                <p>
                  Para todos los efectos derivados del presente contrato, las partes eligen como domicilio especial la jurisdicción de la Circunscripción Judicial del Estado Anzoátegui (Barcelona / Lechería), a cuyos tribunales declaran someterse, rigiéndose por las leyes de la República Bolivariana de Venezuela.
                </p>
              </div>

              {/* Cuadro de Firmas */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center font-sans">
                <div>
                  <div className="border-t border-stone-400 pt-2">
                    <p className="font-bold text-slate-900">POR LA EMPRESA</p>
                    <p className="text-stone-600">{empresa.representanteLegal}</p>
                    <p className="text-stone-400 text-[10px]">
                      C.I. {empresa.cedulaRepresentante} · {empresa.cargoRepresentante}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="border-t border-stone-400 pt-2">
                    <p className="font-bold text-slate-900">EL COMPRADOR</p>
                    <p className="text-stone-600">{op.cliente.nombre}</p>
                    <p className="text-stone-400 text-[10px]">
                      C.I. {op.cliente.cedula} · RIF: {op.cliente.rif || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. DOCUMENTO: CUESTIONARIO KYC */}
          {docTipo === 'kyc' && (
            <div className="space-y-4 text-xs font-sans">
              <h3 className="text-center text-sm font-bold text-slate-900 uppercase">
                CUESTIONARIO DE CONOCIMIENTO DEL CLIENTE (KYC) - PERSONA NATURAL
                <br />
                <span className="font-normal text-xs text-stone-500">
                  Anexo Obligatorio del Contrato de Compraventa · SUDEBAN Resol. 083.18
                </span>
              </h3>

              <div className="rounded-xl border border-stone-200 p-3 space-y-2 bg-stone-50/50">
                <h4 className="font-bold text-stone-900">1. DATOS DE IDENTIFICACIÓN</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <p><strong>Nombre y Apellido:</strong> {op.cliente.nombre}</p>
                  <p><strong>Cédula de Identidad:</strong> {op.cliente.cedula}</p>
                  <p><strong>RIF Personal:</strong> {op.cliente.rif || 'N/A'}</p>
                  <p><strong>Nacionalidad / Estado Civil:</strong> {op.cliente.nacionalidad} · {op.cliente.estadoCivil}</p>
                  <p><strong>Fecha y Lugar de Nacimiento:</strong> {formatDateVE(op.cliente.fechaNacimiento)} en {op.cliente.lugarNacimiento}</p>
                  <p><strong>Teléfono / Email:</strong> {op.cliente.telefono} · {op.cliente.email}</p>
                  <p className="col-span-2"><strong>Dirección de Habitación:</strong> {op.cliente.direccionHabitacion}</p>
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 p-3 space-y-2 bg-stone-50/50">
                <h4 className="font-bold text-stone-900">2. ACTIVIDAD ECONÓMICA Y ORIGEN DE LOS FONDOS</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <p><strong>Ocupación / Profesión:</strong> {op.cliente.ocupacion}</p>
                  <p><strong>Origen de los Fondos:</strong> {op.cliente.origenIngresosDeclarado || 'Actividad comercial propia'}</p>
                  <p><strong>Capacidad Económica:</strong> {op.cliente.capacidadEconomicaDeclarada || 'Conforme a ingresos declarados'}</p>
                  <p><strong>¿Es Persona Expuesta Políticamente (PEP)?:</strong> {op.cliente.esPEP ? 'SÍ' : 'NO'}</p>
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 p-3 space-y-2 bg-stone-50/50">
                <h4 className="font-bold text-stone-900">3. CUENTA BANCARIA PARA EL ANTICIPO</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <p><strong>Banco Emisor:</strong> {op.anticipo.bancoOrigen}</p>
                  <p><strong>Titular de la Cuenta:</strong> {op.cliente.nombre}</p>
                  <p><strong>Monto del Anticipo:</strong> {formatBs(op.anticipo.montoBs)}</p>
                  <p><strong>Referencia:</strong> {op.anticipo.referencia}</p>
                  <p className="col-span-2"><strong>Titularidad Coincidente (Sin Terceros):</strong> {op.anticipo.titularCoincide ? 'VERIFICADO (100%)' : 'NO COINCIDE'}</p>
                </div>
              </div>

              <p className="text-[11px] text-justify text-stone-600">
                Declaro bajo fe de juramento que las informaciones suministradas son veraces y que los fondos provienen de actividades lícitas, autorizando a LA EMPRESA y a las entidades bancarias a verificar los datos conforme a la normativa de prevención de legitimación de capitales.
              </p>

              <div className="pt-6 flex justify-center">
                <div className="w-64 text-center border-t border-stone-400 pt-2">
                  <p className="font-bold text-slate-900">{op.cliente.nombre}</p>
                  <p className="text-stone-600">Firma del Cliente</p>
                  <p className="text-stone-400 text-[10px]">C.I. {op.cliente.cedula}</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. DOCUMENTO: TAPA DE EXPEDIENTE */}
          {docTipo === 'tapa' && (
            <div className="space-y-4 text-xs font-sans">
              <h3 className="text-center text-sm font-bold text-slate-900 uppercase">
                TAPA DE EXPEDIENTE REGULATORIO Y TRAZABILIDAD (SUDEBAN / BCV)
                <br />
                <span className="font-normal text-xs text-stone-500">
                  Control Integral de Cumplimiento · Estado: {op.estado}
                </span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-stone-200 p-3 space-y-1 bg-stone-50/50">
                  <h4 className="font-bold text-stone-900">OPERACIÓN COMERCIAL</h4>
                  <p><strong>Expediente:</strong> {op.numeroExpediente}</p>
                  <p><strong>Fecha Contrato:</strong> {formatDateVE(op.fechaContrato)}</p>
                  <p><strong>Cliente:</strong> {op.cliente.nombre} ({op.cliente.cedula})</p>
                  <p><strong>Producto:</strong> {op.cliente.producto} ({op.cliente.cantidad})</p>
                </div>

                <div className="rounded-xl border border-stone-200 p-3 space-y-1 bg-stone-50/50">
                  <h4 className="font-bold text-stone-900">TRAZABILIDAD CAMBIARIA</h4>
                  <p><strong>Anticipo Bs:</strong> {formatBs(op.anticipo.montoBs)}</p>
                  <p><strong>Divisas BCV:</strong> {formatUSD(op.divisas.montoUsd)}</p>
                  <p><strong>Tasa BCV:</strong> {formatTasaBCV(op.divisas.tasaBCV)}</p>
                  <p><strong>Proveedor:</strong> {op.proveedor.nombreProveedor} ({op.proveedor.paisProveedor})</p>
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 p-3 space-y-2">
                <h4 className="font-bold text-stone-900">CHECKLIST DE RECAUDOS ARCHIVADOS</h4>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  {Object.entries(op.documentos).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <span className={val ? 'text-emerald-600 font-bold' : 'text-stone-300'}>
                        {val ? '[X]' : '[ ]'}
                      </span>
                      <span className="text-stone-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="border-t border-stone-400 pt-2">
                    <p className="font-bold text-slate-900">Elaborado por (Cumplimiento)</p>
                    <p className="text-stone-600">{op.elaboradoPor || 'Oficial de Cumplimiento'}</p>
                  </div>
                </div>
                <div>
                  <div className="border-t border-stone-400 pt-2">
                    <p className="font-bold text-slate-900">Revisado por (Dirección)</p>
                    <p className="text-stone-600">{op.revisadoPor || empresa.representanteLegal}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. DOCUMENTO: CARTA AL BANCO */}
          {docTipo === 'carta-banco' && (
            <div className="space-y-4 text-xs font-sans leading-relaxed text-justify">
              <p className="text-right text-stone-500">
                Barcelona, Estado Anzoátegui, {new Date().toLocaleDateString('es-VE')}
              </p>
              <div>
                <p className="font-bold text-slate-900">Señores:</p>
                <p className="font-bold text-slate-900">{op.divisas.bancoMesaCambio.toUpperCase()}</p>
                <p className="text-stone-600">Unidad de Cumplimiento y Control Cambiario</p>
                <p className="text-stone-600">Presente.-</p>
              </div>

              <p>
                <strong>Asunto:</strong> Soporte documental de compra de divisas y pago internacional al proveedor · Expediente N° <strong>{op.numeroExpediente}</strong>.
              </p>

              <p>
                Por medio de la presente, nos dirigimos a ustedes a fin de presentar el soporte documental completo correspondiente a la solicitud de adquisición de divisas y pago internacional por un monto de <strong>{formatUSD(op.divisas.montoUsd)}</strong> canalizada a través de su respetable institución bancaria.
              </p>

              <p>
                <strong>1. ESTRUCTURA JURÍDICA DE LA OPERACIÓN:</strong> Nuestra representada, <strong>{empresa.razonSocial}</strong>, actúa en su propio nombre y riesgo como <strong>IMPORTADOR DE REGISTRO</strong>. La relación con el cliente <strong>{op.cliente.nombre}</strong> (C.I. <strong>{op.cliente.cedula}</strong>) constituye una <strong>COMPRAVENTA CON ENTREGA FUTURA</strong> de {op.cliente.producto} ({op.cliente.cantidad}). En consecuencia, el anticipo recibido es un pago parcial del precio de la mercancía y nuestra empresa NO administra fondos ajenos ni actúa como intermediario cambiario no autorizado.
              </p>

              <p>
                <strong>2. TRAZABILIDAD Y REGLA DE ORO:</strong> El anticipo de <strong>{formatBs(op.anticipo.montoBs)}</strong> fue recibido exclusivamente mediante {op.anticipo.formaPago} proveniente de la cuenta del propio cliente en {op.anticipo.bancoOrigen} (Ref. {op.anticipo.referencia}), certificando la inexistencia de efectivo o fondos de terceras personas no titulares. Dicho anticipo fue debidamente facturado conforme a la Providencia SENIAT 00071 con Factura N° {op.anticipo.facturaSeniat}.
              </p>

              <p>
                <strong>3. DESTINO DE LAS DIVISAS Y PAGO AL PROVEEDOR:</strong> Las divisas adquiridas a la tasa oficial del Banco Central de Venezuela de {op.divisas.tasaBCV} Bs/USD están destinadas al pago directo al proveedor internacional <strong>{op.proveedor.nombreProveedor}</strong> ({op.proveedor.paisProveedor}), respaldado por la Factura Comercial N° {op.proveedor.facturaNumero} y liquidado mediante instrucción SWIFT {op.proveedor.referenciaSwift}.
              </p>

              <p>
                Anexamos a la presente: Contrato de Compraventa, Cuestionario KYC del cliente debidamente firmado con cédula y RIF, Comprobante del anticipo en Bolívares, Declaración de Origen Lícito, Factura del Proveedor y los registros correspondientes del rubro (SUNAGRO/INSAI).
              </p>

              <div className="pt-8">
                <div className="w-64 border-t border-stone-400 pt-2">
                  <p className="font-bold text-slate-900">{empresa.representanteLegal}</p>
                  <p className="text-stone-600">{empresa.cargoRepresentante}</p>
                  <p className="text-stone-400 text-[10px]">C.I. {empresa.cedulaRepresentante} · RIF: {empresa.rif}</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. DOCUMENTO: DECLARACIÓN BCV */}
          {docTipo === 'declaracion-bcv' && (
            <div className="space-y-4 text-xs font-sans leading-relaxed text-justify">
              <h3 className="text-center text-sm font-bold text-slate-900 uppercase">
                DECLARACIÓN JURADA DE ORIGEN Y DESTINO LÍCITO DE FONDOS
                <br />
                <span className="font-normal text-xs text-stone-500">
                  Mesa de Cambio del Banco Central de Venezuela (BCV) / SUDEBAN
                </span>
              </h3>

              <p>
                Quien suscribe, <strong>{empresa.representanteLegal}</strong>, de nacionalidad venezolana, mayor de edad, titular de la Cédula de Identidad N° <strong>{empresa.cedulaRepresentante}</strong>, actuando en mi carácter de {empresa.cargoRepresentante} de la sociedad mercantil <strong>{empresa.razonSocial}</strong>, titular del RIF N° <strong>{empresa.rif}</strong>, declaro bajo fe de juramento ante la entidad bancaria <strong>{op.divisas.bancoMesaCambio}</strong> y ante el Banco Central de Venezuela lo siguiente:
              </p>

              <p>
                <strong>1. ORIGEN LÍCITO DE LOS RECURSOS:</strong> Que los fondos en Bolívares por la cantidad de <strong>{formatBs(op.divisas.montoBsEquivalente || op.divisas.montoUsd * op.divisas.tasaBCV)}</strong> aplicados a la adquisición de <strong>{formatUSD(op.divisas.montoUsd)}</strong> a la tasa oficial de {formatTasaBCV(op.divisas.tasaBCV)} corresponden a ingresos operacionales legítimos de nuestra actividad comercial, específicamente derivados del anticipo bancario recibido del cliente <strong>{op.cliente.nombre}</strong> (C.I. {op.cliente.cedula}) en el marco del Contrato de Compraventa con Entrega Futura N° {op.numeroExpediente}.
              </p>

              <p>
                <strong>2. DESTINO DE LAS DIVISAS:</strong> Que las divisas adquiridas serán destinadas única y exclusivamente a la importación comercial de {op.cliente.producto} mediante transferencia bancaria internacional directa a nuestro proveedor extranjero <strong>{op.proveedor.nombreProveedor}</strong> ({op.proveedor.paisProveedor}), amparado en la Factura Comercial N° {op.proveedor.facturaNumero}.
              </p>

              <p>
                <strong>3. REINTEGRO O VENTA DE REMANENTES:</strong> Que en caso de suscitarse algún remanente no utilizado de las divisas adquiridas o ante cualquier causa que impida la importación declarada, nos comprometemos expresamente a reintegrar o vender dichas divisas al banco en cumplimiento de la normativa cambiaria vigente.
              </p>

              <p>
                Declaro que estos fondos no guardan relación con actividades ilícitas tipificadas en la Ley contra el Lavado de Dinero y el Financiamiento al Terrorismo.
              </p>

              <div className="pt-10 flex justify-center">
                <div className="w-80 text-center border-t border-stone-400 pt-2">
                  <p className="font-bold text-slate-900">{empresa.representanteLegal}</p>
                  <p className="text-stone-600">Declarante Responsable · C.I. {empresa.cedulaRepresentante}</p>
                  <p className="text-stone-400 text-[10px]">Por {empresa.razonSocial} (RIF {empresa.rif})</p>
                </div>
              </div>
            </div>
          )}
          {/* 6. DOCUMENTO: GUÍA DEL MARCO LEGAL, CAMBIARIO Y BANCARIO */}
          {docTipo === 'marco-legal' && (
            <div className="space-y-4 text-xs font-sans leading-relaxed text-justify">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-3 gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 uppercase">
                    GUÍA DEL MARCO LEGAL, CAMBIARIO Y BANCARIO DE VENEZUELA
                  </h3>
                  <p className="text-xs text-amber-800 font-semibold">
                    Régimen Oficial BCV · SUDEBAN (Resolución 083.18) · SENIAT · Código de Comercio
                  </p>
                </div>
                <button
                  onClick={() => downloadPdfGuiaMarcoLegal(empresa)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 px-3 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Descargar Guía en PDF</span>
                </button>
              </div>

              <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 text-[11px] text-amber-950 space-y-1">
                <p className="font-bold">
                  EMPRESA DE REGISTRO: {empresa.razonSocial} · RIF: {empresa.rif}
                </p>
                <p>
                  Domicilio Fiscal: {empresa.direccionFiscal}
                </p>
                <p>
                  Representante Legal: {empresa.representanteLegal} (C.I. {empresa.cedulaRepresentante}) · Objeto: {(empresa.objetoSocial || "").slice(0, 160)}...
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase text-amber-900">
                  1. Régimen Cambiario Vigente del Banco Central de Venezuela (BCV)
                </h4>
                <p>
                  <strong>• Derogación del Régimen de Ilícitos Cambiarios:</strong> Mediante Decreto Constituyente de fecha 02 de agosto de 2018 (G.O. N° 41.452), fue derogada en su totalidad la Ley del Régimen de Ilícitos Cambiarios, restituyendo la plena libre convertibilidad de la moneda y despenalizando las transacciones en divisas.
                </p>
                <p>
                  <strong>• Convenio Cambiario N° 1 (G.O. 6.405 Ext. del 07/09/2018):</strong> Marco rector para pactar operaciones en divisas y adquisición lícita de divisas a través de las Mesas de Cambio de la banca universal supervisada por el BCV.
                </p>
                <p>
                  <strong>• Declaración de Origen y Destino Lícito:</strong> El importador demuestra ante el banco que los Bolívares provienen de ventas lícitas o anticipos comerciales bancarizados y que las divisas adquiridas van al pago directo del proveedor extranjero.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase text-sky-900">
                  2. Normativa Bancaria y Régimen LC/FT/FPADM (SUDEBAN)
                </h4>
                <p>
                  <strong>• Resolución SUDEBAN 083.18:</strong> Administración y control de riesgos de Legitimación de Capitales, Financiamiento al Terrorismo y Financiamiento de la Proliferación de Armas de Destrucción Masiva.
                </p>
                <p>
                  <strong>• Política "Conozca a su Cliente" (KYC):</strong> Obligación de integrar expediente individual con cédula, RIF, constancia de ingresos, perfil financiero y declaración PEP.
                </p>
                <p>
                  <strong>• Titularidad Bancaria Estricta (Cero Terceros):</strong> El pago del anticipo debe salir obligatoriamente de una cuenta bancaria a nombre del titular contratante persona natural.
                </p>
                <p>
                  <strong>• Custodia por 5 Años:</strong> Obligación legal (LODOFT Art. 42) de custodiar expedientes físicos y digitales por al menos 5 años continuos.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase text-emerald-900">
                  3. Régimen Tributario SENIAT y Tratamiento de Anticipos
                </h4>
                <p>
                  <strong>• Providencia SENIAT SNAT/2011/00071:</strong> Todo anticipo de precio recibido previo a la entrega exige emisión de Factura de Anticipo con débito fiscal de IVA.
                </p>
                <p>
                  <strong>• Factura Definitiva al Cierre:</strong> Al despachar la mercancía importada, se emite Factura Definitiva imputando el anticipo facturado.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase text-purple-900">
                  4. Naturaleza Mercantil: Compraventa con Entrega Futura (Código de Comercio)
                </h4>
                <p>
                  <strong>• No es Gestión de Fondos Ajenos:</strong> La empresa actúa a su propio nombre y riesgo; no efectúa captación ni corretaje financiero bursátil.
                </p>
                <p>
                  <strong>• Control SUNAGRO / INSAI:</strong> Registros agroalimentarios, guías SICA y permisos fitosanitarios aplicables al rubro.
                </p>
              </div>

              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="font-bold text-slate-900">{empresa.representanteLegal}</p>
                  <p className="text-stone-600">C.I. {empresa.cedulaRepresentante} · {empresa.cargoRepresentante}</p>
                  <p className="text-stone-400 text-[10px]">{empresa.razonSocial} · RIF {empresa.rif}</p>
                </div>
                <button
                  onClick={() => downloadPdfGuiaMarcoLegal(empresa)}
                  className="flex items-center gap-2 rounded-xl bg-amber-700 hover:bg-amber-800 px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar Documento Oficial en PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
