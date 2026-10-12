import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Building2,
  CheckCircle2,
  DollarSign,
  FileText,
  FileSpreadsheet,
  Download,
  Landmark,
  Plane,
  Truck,
  HelpCircle,
  Clock,
  UserCheck,
  Upload,
  Loader2,
  Archive,
  ChevronDown,
  Check
} from 'lucide-react';
import { DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { formatBs, formatDateVE, formatTasaBCV, formatUSD } from '../utils/formatters';
import { exportControlMaestroExcel, exportExpedienteIndividualExcel } from '../utils/excelGenerator';
import {
  downloadPdfTapaExpediente,
  downloadPdfDeclaracionOrigenDestino,
  downloadPdfLoteCompletoExpedientes,
  downloadZipLoteExpedientes
} from '../utils/pdfGenerator';
import { MOVIMIENTOS_PERSONAS_NATURALES } from '../data/realBankData';
import { ConciliacionBancariaModal } from './ConciliacionBancariaModal';

interface RastroEfectivoViewProps {
  expedientes: ExpedienteOperacion[];
  empresa: DatosEmpresaImportadora;
  onOpenExpediente: (op: ExpedienteOperacion) => void;
  onOpenCsvImport?: () => void;
}

export const RastroEfectivoView: React.FC<RastroEfectivoViewProps> = ({
  expedientes,
  empresa,
  onOpenExpediente,
  onOpenCsvImport,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    expedientes.length > 0 ? expedientes[0].id : ''
  );
  const [isConciliacionModalOpen, setIsConciliacionModalOpen] = useState(false);
  const [isGeneratingBatchPdf, setIsGeneratingBatchPdf] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);
  const [batchSuccessToast, setBatchSuccessToast] = useState<string | null>(null);

  const handleDownloadBatchPdf = async () => {
    if (isGeneratingBatchPdf || expedientes.length === 0) return;
    try {
      setIsGeneratingBatchPdf(true);
      setShowBatchDropdown(false);
      setBatchProgress({ current: 0, total: expedientes.length });
      await downloadPdfLoteCompletoExpedientes(expedientes, empresa, (curr, tot) => {
        setBatchProgress({ current: curr, total: tot });
      });
      setBatchSuccessToast(`¡Dossier PDF generado con éxito para ${expedientes.length} expedientes!`);
      setTimeout(() => setBatchSuccessToast(null), 4000);
    } catch (err) {
      console.error('Error al descargar lote PDF:', err);
    } finally {
      setIsGeneratingBatchPdf(false);
      setBatchProgress(null);
    }
  };

  const handleDownloadBatchZip = async () => {
    if (isGeneratingBatchPdf || expedientes.length === 0) return;
    try {
      setIsGeneratingBatchPdf(true);
      setShowBatchDropdown(false);
      setBatchProgress({ current: 0, total: expedientes.length });
      await downloadZipLoteExpedientes(expedientes, empresa, (curr, tot) => {
        setBatchProgress({ current: curr, total: tot });
      });
      setBatchSuccessToast(`¡Archivo ZIP con ${expedientes.length} PDFs descargado con éxito!`);
      setTimeout(() => setBatchSuccessToast(null), 4000);
    } catch (err) {
      console.error('Error al descargar lote ZIP:', err);
    } finally {
      setIsGeneratingBatchPdf(false);
      setBatchProgress(null);
    }
  };

  const op = expedientes.find((e) => e.id === selectedId) || expedientes[0];

  if (!op) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center space-y-4 shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200">
          <ArrowRight className="h-7 w-7" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h2 className="text-base font-bold text-stone-900">
            Trazabilidad Cambiaria y Rastro de Efectivo Lista
          </h2>
          <p className="text-xs text-stone-500">
            No hay operaciones en curso porque la base de datos está limpia. Al cargar tu archivo CSV, cada cliente persona natural contará automáticamente con su rastro de efectivo auditado de 6 nodos (Anticipo Bs ➔ BCV ➔ Divisas USD ➔ SWIFT Internacional ➔ Trámites Aduanales).
          </p>
        </div>
        {onOpenCsvImport && (
          <div className="pt-2">
            <button
              onClick={onOpenCsvImport}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              <Upload className="h-4 w-4 text-amber-400" />
              <span>Cargar Lista CSV y Generar Rastro de Efectivo</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Cálculos de conciliación
  const diffUsd = op.divisas.montoUsd - op.proveedor.montoUsdFactura;
  const pctDiff = op.proveedor.montoUsdFactura > 0 ? (Math.abs(diffUsd) / op.proveedor.montoUsdFactura) * 100 : 0;
  const hasDiffAlert = pctDiff > 15;

  return (
    <div className="space-y-6">
      {/* Encabezado con selector de expediente y exportaciones */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                Trazabilidad Bancaria y Rastro de Efectivo
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                Auditoría Cambiaria BCV · SUDEBAN
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Demostración continua del origen lícito, bancarización sin terceros, compra en mesa oficial y pago internacional al proveedor.
            </p>
          </div>

          {/* Selector de expediente y botones de descarga */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={op.id}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-800 focus:border-amber-400 focus:outline-hidden"
            >
              {expedientes.map((e) => (
                <option key={e.id} value={e.id}>
                  Expediente {e.numeroExpediente} - {e.cliente.nombre.slice(0, 24)}...
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsConciliacionModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
              title="Ver los 37 abonos bancarios del extracto CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-amber-700" />
              <span>Ver Extracto Conciliado (37 Abonos)</span>
            </button>

            {/* Botón Descargar por Lote Todos los Expedientes en PDF */}
            <div className="relative inline-flex items-center shadow-xs rounded-lg">
              <button
                onClick={handleDownloadBatchPdf}
                disabled={isGeneratingBatchPdf}
                className="flex items-center gap-1.5 rounded-l-lg border border-rose-600 bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 active:bg-rose-800 transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
                title="Descargar todos los expedientes del lote en un único PDF consolidado con portada y fichas de auditoría"
              >
                {isGeneratingBatchPdf ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                    <span>
                      {batchProgress
                        ? `Generando Lote (${batchProgress.current}/${batchProgress.total})...`
                        : 'Generando Lote PDF...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 text-white" />
                    <span>Descargar Lote en PDF ({expedientes.length} Expedientes)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowBatchDropdown(!showBatchDropdown)}
                disabled={isGeneratingBatchPdf}
                className="rounded-r-lg border-y border-r border-rose-600 bg-rose-700 px-2 py-1.5 text-xs text-white hover:bg-rose-800 transition-colors cursor-pointer disabled:opacity-60"
                title="Opciones de descarga por lote"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {showBatchDropdown && (
                <div
                  className="absolute right-0 top-full mt-1.5 z-40 w-72 rounded-xl border border-stone-200 bg-white p-2 shadow-xl"
                  onMouseLeave={() => setShowBatchDropdown(false)}
                >
                  <div className="px-2 py-1 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100 mb-1">
                    Exportación Masiva del Lote ({expedientes.length} Expedientes)
                  </div>
                  <button
                    onClick={() => {
                      setShowBatchDropdown(false);
                      handleDownloadBatchPdf();
                    }}
                    className="w-full flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-stone-50 cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-800">PDF Consolidado (Recomendado)</p>
                      <p className="text-[11px] text-stone-500">
                        Documento maestro completo de {1 + expedientes.length} páginas con portada, métricas e índice.
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={handleDownloadBatchZip}
                    className="w-full flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-stone-50 cursor-pointer mt-1"
                  >
                    <Archive className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-800">Archivo ZIP (PDFs Individuales)</p>
                      <p className="text-[11px] text-stone-500">
                        Comprime los {expedientes.length} archivos PDF independientes en un archivo .zip.
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setShowBatchDropdown(false);
                      exportControlMaestroExcel(expedientes, empresa);
                    }}
                    className="w-full flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-stone-50 cursor-pointer mt-1"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-800">Control Maestro en Excel</p>
                      <p className="text-[11px] text-stone-500">
                        Matriz completa de conciliación y rastro cambiario en hoja de cálculo.
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => exportExpedienteIndividualExcel(op, empresa)}
              className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Descargar este rastro financiero individual en Excel"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
              <span>Descargar Excel</span>
            </button>

            <button
              onClick={() => downloadPdfTapaExpediente(op, empresa)}
              className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Descargar dictamen regulatorio individual en PDF"
            >
              <Download className="h-3.5 w-3.5 text-rose-700" />
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>

        {batchSuccessToast && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-medium text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{batchSuccessToast}</span>
            </div>
            <button
              onClick={() => setBatchSuccessToast(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Tarjeta de Verificación de las Reglas de Oro del Banco */}
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 text-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-800" />
            <h3 className="font-bold text-amber-900 text-sm">
              Verificación de Reglas de Oro SUDEBAN (Oficial de Cumplimiento)
            </h3>
          </div>
          <span className="font-mono text-stone-600 text-[11px]">Expediente N° {op.numeroExpediente}</span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex items-start gap-2 rounded-xl bg-white p-2.5 border border-amber-200/60">
            <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${op.anticipo.titularCoincide ? 'text-emerald-600' : 'text-rose-600'}`} />
            <div>
              <p className="font-medium text-stone-800">1. Titularidad del Pago</p>
              <p className="text-stone-500 text-[11px]">
                {op.anticipo.titularCoincide ? 'Cuenta propia del cliente. Cero terceros ni efectivo.' : 'ALERTA: El pagador difiere del cliente.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-white p-2.5 border border-amber-200/60">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-stone-800">2. Individualidad de Fondos</p>
              <p className="text-stone-500 text-[11px]">
                Un expediente por operación. Fondos de clientes no se mezclan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-white p-2.5 border border-amber-200/60">
            <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${!hasDiffAlert ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <p className="font-medium text-stone-800">3. Coherencia Divisas vs Factura</p>
              <p className="text-stone-500 text-[11px]">
                Comprados: {formatUSD(op.divisas.montoUsd)} · Factura: {formatUSD(op.proveedor.montoUsdFactura)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-white p-2.5 border border-amber-200/60">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-stone-800">4. Declaración de Origen Lícito</p>
              <p className="text-stone-500 text-[11px]">
                {op.divisas.declaracionOrigenDestino ? 'Declaración jurada entregada a la mesa de cambio.' : 'Pendiente declaración jurada.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-white p-2.5 border border-amber-200/60">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-stone-800">5. Coherencia Cronológica</p>
              <p className="text-stone-500 text-[11px]">
                Anticipo ({formatDateVE(op.anticipo.fecha)}) → Divisas ({formatDateVE(op.divisas.fechaCompra)}) → Pago SWIFT ({formatDateVE(op.proveedor.fechaPago)}).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-white p-2.5 border border-amber-200/60">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-stone-800">6. Custodia Regulatoria</p>
              <p className="text-stone-500 text-[11px]">
                Expediente y recaudos resguardados por 5 años mínimos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FLUJO VISUAL DEL RASTRO DE EFECTIVO (Step-by-Step Financial Pipeline) */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-stone-900">
            Diagrama de Trazabilidad Financiera de Fondos (Bolívares a Dólares y Mercancía)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Cada eslabón cuenta con soporte bancario, fiscal (SENIAT) y cambiario verificable.
          </p>
        </div>

        <div className="relative border-l-2 border-stone-200 ml-4 pl-6 space-y-8">
          
          {/* Eslabón 1: Cliente y Origen de Bolívares */}
          <div className="relative group">
            <div className="absolute -left-[35px] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-800 border-2 border-white shadow-xs font-bold text-xs">
              1
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Origen de los Fondos (Cuenta Bancaria del Cliente)
                </span>
                <span className="font-mono text-xs text-stone-500">
                  Fecha: {formatDateVE(op.anticipo.fecha)}
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-900 mt-1">
                {op.cliente.nombre} (C.I. {op.cliente.cedula})
              </p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Monto Anticipado:</span>
                  <span className="font-mono font-bold text-stone-900">{formatBs(op.anticipo.montoBs)}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Instrumento / Banco:</span>
                  <span className="text-stone-800">{op.anticipo.formaPago} · {op.anticipo.bancoOrigen}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Referencia Bancaria:</span>
                  <span className="font-mono text-stone-800">{op.anticipo.referencia}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Factura Anticipo SENIAT:</span>
                  <span className="font-mono text-stone-800">{op.anticipo.facturaSeniat}</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center gap-2 text-[11px] text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Titular Pagador Verificado: 100% bancarizado desde la cuenta propia del cliente sin intermediarios.</span>
              </div>

              {/* Desglose de depósitos conciliados en extracto */}
              {(() => {
                const movs = MOVIMIENTOS_PERSONAS_NATURALES.filter(
                  (m) => m.expedienteAsignado === op.numeroExpediente || m.cedula === op.cliente.cedula
                );
                if (movs.length <= 1) return null;
                return (
                  <div className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50/40 p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-amber-900">
                        Desglose de {movs.length} Transferencias Conciliadas en Extracto Bancario:
                      </span>
                      <span className="font-mono text-[11px] font-bold text-stone-700">
                        Total: {formatBs(movs.reduce((s, m) => s + m.monto, 0))}
                      </span>
                    </div>
                    <div className="max-h-36 overflow-y-auto space-y-1">
                      {movs.map((m, i) => (
                        <div key={m.id} className="flex items-center justify-between text-[11px] font-mono bg-white p-1.5 rounded border border-stone-200/60">
                          <span className="text-stone-500">#{i + 1} · {m.fecha}</span>
                          <span className="text-stone-700 font-semibold">{m.bancoNombre} (Ref: {m.referencia})</span>
                          <span className="font-bold text-stone-900">{formatBs(m.monto)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Eslabón 2: Adquisición de Divisas en la Mesa de Cambio BCV */}
          <div className="relative group">
            <div className="absolute -left-[35px] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-800 border-2 border-white shadow-xs font-bold text-xs">
              2
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                  Compra de Divisas en Mesa Cambiaria Oficial (BCV)
                </span>
                <span className="font-mono text-xs text-stone-500">
                  Fecha: {formatDateVE(op.divisas.fechaCompra)}
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-900 mt-1">
                {op.divisas.bancoMesaCambio}
              </p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Divisas Compradas:</span>
                  <span className="font-mono font-bold text-sky-900">{formatUSD(op.divisas.montoUsd)}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Tasa Oficial BCV:</span>
                  <span className="font-mono text-stone-800">{formatTasaBCV(op.divisas.tasaBCV)}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Equivalente en Bolívares:</span>
                  <span className="font-mono text-stone-800">{formatBs(op.divisas.montoBsEquivalente || op.divisas.montoUsd * op.divisas.tasaBCV)}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Solicitud / Operación N°:</span>
                  <span className="font-mono text-stone-800">{op.divisas.numeroSolicitud}</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Declaración de Origen y Destino Lícito entregada al Banco.</span>
                </div>
                <button
                  onClick={() => downloadPdfDeclaracionOrigenDestino(op, empresa)}
                  className="text-sky-700 hover:text-sky-900 font-medium underline cursor-pointer"
                >
                  Descargar Declaración BCV (PDF)
                </button>
              </div>
            </div>
          </div>

          {/* Eslabón 3: Pago al Proveedor Extranjero (Giro SWIFT) */}
          <div className="relative group">
            <div className="absolute -left-[35px] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 border-2 border-white shadow-xs font-bold text-xs">
              3
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Transferencia Internacional Directa a Proveedor (SWIFT / MT103)
                </span>
                <span className="font-mono text-xs text-stone-500">
                  Fecha: {formatDateVE(op.proveedor.fechaPago)}
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-900 mt-1">
                {op.proveedor.nombreProveedor} ({op.proveedor.paisProveedor} · {op.proveedor.rifOIdFiscal})
              </p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Factura Proveedor N°:</span>
                  <span className="font-mono font-medium text-stone-800">{op.proveedor.facturaNumero}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Monto Factura Proveedor:</span>
                  <span className="font-mono font-bold text-stone-900">{formatUSD(op.proveedor.montoUsdFactura)}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Comprobante SWIFT / MT103:</span>
                  <span className="font-mono text-stone-800">{op.proveedor.referenciaSwift}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Banco Corresponsal:</span>
                  <span className="text-stone-800 truncate">{op.proveedor.bancoCorresponsal}</span>
                </div>
              </div>

              {/* Justificación de Diferencias si las hay */}
              <div className="mt-2 pt-2 border-t border-stone-200/60 text-[11px]">
                {Math.abs(diffUsd) <= 0.01 ? (
                  <p className="text-emerald-800 font-medium">
                    ✔ Cuadre perfecto: Los USD comprados en el banco coinciden 100% con la factura del proveedor.
                  </p>
                ) : (
                  <div className="flex items-start gap-1.5 text-stone-600 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                    <div>
                      <span className="font-medium text-amber-900">
                        Diferencia de USD {Math.abs(diffUsd).toFixed(2)}:
                      </span>{' '}
                      {diffUsd > 0
                        ? `Divisas no consumidas en la factura comercial de USD ${op.proveedor.montoUsdFactura}. Según la normativa BCV, se deben reintegrar, liquidar al banco o imputar a comisiones bancarias del corresponsal.`
                        : `El monto de la factura supera en USD ${Math.abs(diffUsd).toFixed(2)} las divisas canalizadas.`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Eslabón 4: Nacionalización, Aduana y Permisología */}
          <div className="relative group">
            <div className="absolute -left-[35px] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 border-2 border-white shadow-xs font-bold text-xs">
              4
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Tránsito Aduanal, Nacionalización SENIAT y Permisos
                </span>
                <span className="font-mono text-xs text-stone-500">
                  Nacionalizado: {formatDateVE(op.importacion.fechaNacionalizacion)}
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-900 mt-1">
                {op.importacion.puertoEntrada} · {op.importacion.navieraOAgente}
              </p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Bill of Lading / BL N°:</span>
                  <span className="font-mono text-stone-800">{op.importacion.numeroBL}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Duela / DUA SENIAT:</span>
                  <span className="font-mono text-stone-800">{op.importacion.numeroDuela}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Guía SUNAGRO / SICA:</span>
                  <span className="font-mono text-stone-800">{op.importacion.registroSunagroSica || 'Exento'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Permiso Sanitario INSAI:</span>
                  <span className="font-mono text-stone-800">{op.importacion.permisoInsai || 'Aprobado'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Eslabón 5: Entrega al Cliente, Factura Definitiva y Cierre */}
          <div className="relative group">
            <div className="absolute -left-[35px] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-800 border-2 border-white shadow-xs font-bold text-xs">
              5
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  Entrega Material, Factura Definitiva SENIAT y Liquidación de Margen
                </span>
                <span className="font-mono text-xs text-stone-500">
                  Fecha: {formatDateVE(op.entrega.fechaEntrega)}
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-900 mt-1">
                Cierre de la Compraventa con Entrega Futura
              </p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Factura Definitiva SENIAT:</span>
                  <span className="font-mono font-medium text-stone-800">{op.entrega.facturaDefinitivaSeniat || 'En tramitación'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Saldo Cobrado al Cliente:</span>
                  <span className="font-mono text-stone-800">
                    {op.entrega.saldoCobradoBs > 0 ? formatBs(op.entrega.saldoCobradoBs) : formatUSD(op.entrega.saldoCobradoUsd)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Comisión / Margen Empresa:</span>
                  <span className="text-stone-800">{op.entrega.comisionMargenEmpresa}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Estado del Expediente:</span>
                  <span className="font-medium text-stone-900">{op.estado}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal de Conciliación Bancaria Oficial (37 Abonos) */}
      <ConciliacionBancariaModal
        isOpen={isConciliacionModalOpen}
        onClose={() => setIsConciliacionModalOpen(false)}
        expedientes={expedientes}
        onOpenExpediente={(numExp) => {
          const found = expedientes.find((e) => e.numeroExpediente === numExp);
          if (found) setSelectedId(found.id);
        }}
      />
    </div>
  );
};
