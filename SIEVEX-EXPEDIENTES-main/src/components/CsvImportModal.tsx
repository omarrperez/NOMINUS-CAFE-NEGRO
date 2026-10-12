import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Database,
  Coins,
  RefreshCw,
  Users
} from 'lucide-react';
import { DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import {
  autoDetectColumns,
  CsvColumnMapping,
  CsvRowParsed,
  downloadCsvTemplate,
  originateExpedientesFromRows,
  parseCsvText,
  parseUploadedFile
} from '../utils/csvOriginator';
import { formatBs, formatUSD, formatTasaBCV } from '../utils/formatters';
import { EXPEDIENTES_PERSONAS_NATURALES } from '../data/realBankData';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  empresa: DatosEmpresaImportadora;
  existingCount: number;
  onExpedientesImported: (nuevos: ExpedienteOperacion[]) => Promise<void>;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  empresa,
  existingCount,
  onExpedientesImported,
}) => {
  const [tabModo, setTabModo] = useState<'archivo' | 'pegar'>('archivo');
  const [fileName, setFileName] = useState<string>('');
  const [pastedText, setPastedText] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<CsvRowParsed[]>([]);
  const [mapping, setMapping] = useState<CsvColumnMapping | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleLoadExtractoReal = () => {
    const rows = EXPEDIENTES_PERSONAS_NATURALES.map((op) => ({
      Nombre: op.cliente.nombre,
      Cedula: op.cliente.cedula,
      RIF: op.cliente.rif,
      Telefono: op.cliente.telefono,
      Email: op.cliente.email,
      Direccion: op.cliente.direccionHabitacion,
      MontoBs: String(op.anticipo.montoBs),
      MontoUSD: String(op.divisas.montoUsd),
      BancoOrigen: op.anticipo.bancoOrigen,
      ReferenciaBancaria: op.anticipo.referencia,
      FechaOperacion: op.fechaContrato,
      Producto: op.cliente.producto,
      Cantidad: op.cliente.cantidad,
      Ocupacion: op.cliente.ocupacion,
    }));
    const sampleHeaders = Object.keys(rows[0]);
    setHeaders(sampleHeaders);
    setRawRows(rows);
    setMapping(autoDetectColumns(sampleHeaders));
    setFileName('Extracto Bancario Real CSV (15 Personas Naturales)');
    setErrorMsg('');
  };

  if (!isOpen) return null;

  // Manejar archivo cargado
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setSuccessMsg('');
    setFileName(file.name);

    try {
      const parsed = await parseUploadedFile(file);
      if (parsed.rows.length === 0) {
        setErrorMsg('El archivo no contiene filas con datos válidos.');
        return;
      }
      setHeaders(parsed.headers);
      setRawRows(parsed.rows);
      setMapping(autoDetectColumns(parsed.headers));
    } catch (err: any) {
      setErrorMsg(`Error al procesar el archivo: ${err.message || 'Formato no soportado'}`);
    }
  };

  // Manejar texto pegado
  const handleProcessPastedText = () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!pastedText.trim()) {
      setErrorMsg('Por favor pegue el texto o contenido CSV antes de procesar.');
      return;
    }

    try {
      const parsed = parseCsvText(pastedText);
      if (parsed.rows.length === 0) {
        setErrorMsg('No se detectaron registros válidos en el texto ingresado.');
        return;
      }
      setHeaders(parsed.headers);
      setRawRows(parsed.rows);
      setMapping(autoDetectColumns(parsed.headers));
      setFileName('Texto pegado directamente');
    } catch (err: any) {
      setErrorMsg(`Error al analizar texto CSV: ${err.message || 'Formato no válido'}`);
    }
  };

  // Ejecutar originación de expedientes
  const handleOriginar = async () => {
    if (!mapping || rawRows.length === 0) return;

    setProcessing(true);
    setErrorMsg('');
    try {
      const nuevosExpedientes = originateExpedientesFromRows(
        rawRows,
        mapping,
        empresa,
        existingCount + 1
      );

      await onExpedientesImported(nuevosExpedientes);
      setSuccessMsg(`¡Se originaron exitosamente ${nuevosExpedientes.length} expedientes con trazabilidad completa!`);

      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setRawRows([]);
        setHeaders([]);
        setFileName('');
        setPastedText('');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(`Error originando expedientes: ${err.message || 'Error inesperado'}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-stone-200 flex flex-col">
        {/* Cabecera Modal */}
        <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
              <Upload className="h-5 w-5 text-amber-800" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Originador de Expedientes desde CSV / Excel
              </h2>
              <p className="text-xs text-stone-500">
                Genera expedientes oficiales para cada Persona Natural con trazabilidad cambiaria y bancaria transparente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Banner de información regulatorio */}
          <div className="flex items-start gap-3 rounded-xl bg-amber-50/70 p-4 border border-amber-200/70 text-xs text-amber-900">
            <Coins className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">
                Trazabilidad Bancaria Automática (SUDEBAN · Mesa de Cambio BCV · SENIAT)
              </p>
              <p className="text-amber-800 leading-relaxed">
                Al procesar el archivo, cada cliente persona natural recibirá un expediente oficial con su Contrato de Compraventa con Entrega Futura, Cuestionario KYC, y la cadena completa del rastro de efectivo: Recepción de anticipo en Bolívares ➔ Solicitud de divisas al BCV (a tasa oficial {formatTasaBCV(empresa.tasaBCVActual)}) ➔ Pago internacional SWIFT ➔ Trámites de aduana y SUNAGRO/SICA.
              </p>
            </div>
          </div>

          {/* Selector de modo y descarga de plantilla */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex rounded-lg bg-stone-100 p-1 border border-stone-200">
              <button
                type="button"
                onClick={() => setTabModo('archivo')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  tabModo === 'archivo'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
                <span>Cargar Archivo (.csv / .xlsx)</span>
              </button>
              <button
                type="button"
                onClick={() => setTabModo('pegar')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  tabModo === 'pegar'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="h-4 w-4 text-sky-700" />
                <span>Pegar Texto CSV Directamente</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleLoadExtractoReal}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300 transition-colors shadow-2xs cursor-pointer"
                title="Cargar los 15 registros de personas naturales del extracto bancario CSV"
              >
                <Users className="h-3.5 w-3.5 text-amber-700" />
                <span>Cargar Extracto Bancario Real CSV</span>
              </button>

              <button
                type="button"
                onClick={downloadCsvTemplate}
                className="flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-stone-500" />
                <span>Descargar Plantilla CSV</span>
              </button>
            </div>
          </div>

          {/* Modo 1: Carga de archivo */}
          {tabModo === 'archivo' && (
            <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/50 p-6 text-center hover:border-amber-400 hover:bg-amber-50/20 transition-all">
              <input
                type="file"
                id="file-upload"
                accept=".csv, .xlsx, .xls, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer space-y-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs border border-stone-200 text-stone-600">
                  <Upload className="h-6 w-6 text-amber-700" />
                </div>
                <div className="text-sm font-semibold text-stone-800">
                  {fileName ? (
                    <span className="text-emerald-800 font-mono">Archivo seleccionado: {fileName}</span>
                  ) : (
                    'Haga clic para seleccionar o arrastre su archivo CSV o Excel aquí'
                  )}
                </div>
                <p className="text-xs text-stone-500">
                  Formatos soportados: .CSV (delimitado por comas, punto y coma o tabuladores) y .XLSX de Excel
                </p>
              </label>
            </div>
          )}

          {/* Modo 2: Pegar texto CSV */}
          {tabModo === 'pegar' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">
                Pegue aquí los datos en formato CSV (con encabezados en la primera fila):
              </label>
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={`Nombre y Apellido,Cédula,RIF,Monto Anticipo Bs,Banco,Referencia,Producto\nPedro Perez,V-14.892.301,V-14892301-4,1281125.00,Banco Provincial,01089923841,Café verde\nMaria Gonzalez,V-17.432.190,V-17432190-2,922410.00,Banesco,01348821945,Café especialidad`}
                className="w-full rounded-xl border border-stone-300 p-3 font-mono text-xs text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleProcessPastedText}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-800 text-white text-xs font-medium hover:bg-stone-900 transition-colors shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Analizar y Previsualizar Texto</span>
                </button>
              </div>
            </div>
          )}

          {/* Mensajes de error o éxito */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Mapeo de columnas y Previsualización */}
          {rawRows.length > 0 && mapping && (
            <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50/50 p-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-stone-700" />
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Registros Detectados: {rawRows.length} Personas Naturales
                  </span>
                </div>
                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200">
                  Columnas Mapeadas Automáticamente
                </span>
              </div>

              {/* Ajuste manual de mapeo si es necesario */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-medium text-stone-600">Columna Nombre:</label>
                  <select
                    value={mapping.nombreKey}
                    onChange={(e) => setMapping({ ...mapping, nombreKey: e.target.value })}
                    className="mt-1 w-full rounded-md border border-stone-300 bg-white p-1 text-xs"
                  >
                    <option value="">(No asignado)</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-stone-600">Columna Cédula:</label>
                  <select
                    value={mapping.cedulaKey}
                    onChange={(e) => setMapping({ ...mapping, cedulaKey: e.target.value })}
                    className="mt-1 w-full rounded-md border border-stone-300 bg-white p-1 text-xs"
                  >
                    <option value="">(No asignado)</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-stone-600">Columna Monto Bs:</label>
                  <select
                    value={mapping.montoBsKey}
                    onChange={(e) => setMapping({ ...mapping, montoBsKey: e.target.value })}
                    className="mt-1 w-full rounded-md border border-stone-300 bg-white p-1 text-xs"
                  >
                    <option value="">(No asignado)</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-stone-600">Columna Banco / Ref:</label>
                  <select
                    value={mapping.referenciaKey}
                    onChange={(e) => setMapping({ ...mapping, referenciaKey: e.target.value })}
                    className="mt-1 w-full rounded-md border border-stone-300 bg-white p-1 text-xs"
                  >
                    <option value="">(No asignado)</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Previsualización de primeras filas */}
              <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100/70 text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Cliente (Persona Natural)</th>
                      <th className="p-2.5">Cédula</th>
                      <th className="p-2.5">Monto Anticipo</th>
                      <th className="p-2.5">USD Estimado</th>
                      <th className="p-2.5">Banco / Referencia</th>
                      <th className="p-2.5">Producto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                    {rawRows.slice(0, 5).map((row, i) => {
                      const nom = (mapping.nombreKey && row[mapping.nombreKey]) || 'Sin nombre';
                      const ced = (mapping.cedulaKey && row[mapping.cedulaKey]) || 'Sin cédula';
                      const mBs = (mapping.montoBsKey && row[mapping.montoBsKey]) || '0';
                      const bco = (mapping.bancoKey && row[mapping.bancoKey]) || 'Banco Provincial';
                      const ref = (mapping.referenciaKey && row[mapping.referenciaKey]) || `REF-${i + 1}`;
                      const prod = (mapping.productoKey && row[mapping.productoKey]) || 'Café verde';
                      const parsedBs = parseFloat(String(mBs).replace(/[^0-9.-]/g, '')) || 0;
                      const usdCalc = (parsedBs / (empresa.tasaBCVActual || 512.45)).toFixed(2);

                      return (
                        <tr key={i} className="hover:bg-amber-50/30">
                          <td className="p-2.5 text-stone-400">{i + 1}</td>
                          <td className="p-2.5 font-sans font-medium text-stone-900">{nom}</td>
                          <td className="p-2.5 text-stone-600">{ced}</td>
                          <td className="p-2.5 text-emerald-800 font-bold">{mBs}</td>
                          <td className="p-2.5 text-sky-800">${usdCalc}</td>
                          <td className="p-2.5 text-stone-600">{bco} · {ref}</td>
                          <td className="p-2.5 text-stone-500 font-sans">{prod}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {rawRows.length > 5 && (
                  <div className="p-2 text-center text-[11px] text-stone-500 bg-stone-50 border-t border-stone-200">
                    ... y {rawRows.length - 5} personas naturales adicionales listas para ser procesadas.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pie de modal con acciones */}
        <div className="flex items-center justify-between border-t border-stone-200/80 bg-stone-50/80 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={rawRows.length === 0 || processing}
            onClick={handleOriginar}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-xs transition-all ${
              rawRows.length > 0 && !processing
                ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-98 cursor-pointer'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {processing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Originando y guardando en Firestore...</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4 text-amber-400" />
                <span>
                  Originar {rawRows.length > 0 ? `${rawRows.length} Expedientes` : 'Expedientes'} con Trazabilidad Completa
                </span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
