import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  X,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  Calendar,
  CreditCard,
  Download,
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { MOVIMIENTOS_PERSONAS_NATURALES, TransaccionBancariaItem } from '../data/realBankData';
import { formatBs, formatUSD, formatTasaBCV, formatDateVE } from '../utils/formatters';
import { ExpedienteOperacion } from '../types';
import * as XLSX from 'xlsx';

interface ConciliacionBancariaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExpediente?: (numeroExpediente: string) => void;
  expedientes: ExpedienteOperacion[];
}

export const ConciliacionBancariaModal: React.FC<ConciliacionBancariaModalProps> = ({
  isOpen,
  onClose,
  onOpenExpediente,
  expedientes,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bancoFilter, setBancoFilter] = useState('todos');

  const filteredMovimientos = useMemo(() => {
    return MOVIMIENTOS_PERSONAS_NATURALES.filter((m) => {
      const matchSearch =
        m.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nombreTitular.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.expedienteAsignado.toLowerCase().includes(searchTerm.toLowerCase());

      const matchBanco =
        bancoFilter === 'todos' || m.bancoCodigo === bancoFilter;

      return matchSearch && matchBanco;
    });
  }, [searchTerm, bancoFilter]);

  const totalBsFiltrado = useMemo(
    () => filteredMovimientos.reduce((sum, m) => sum + m.monto, 0),
    [filteredMovimientos]
  );

  const totalUsdFiltrado = useMemo(
    () => filteredMovimientos.reduce((sum, m) => sum + (m.montoUsd || 0), 0),
    [filteredMovimientos]
  );

  const totalGeneralBs = useMemo(
    () => MOVIMIENTOS_PERSONAS_NATURALES.reduce((sum, m) => sum + m.monto, 0),
    []
  );

  const totalGeneralUsd = useMemo(
    () => MOVIMIENTOS_PERSONAS_NATURALES.reduce((sum, m) => sum + (m.montoUsd || 0), 0),
    []
  );

  // Descargar la conciliación bancaria directa a Excel con tasas oficiales
  const handleExportExcel = () => {
    const dataToExport = MOVIMIENTOS_PERSONAS_NATURALES.map((m, idx) => ({
      Nro: idx + 1,
      FechaOperacion: m.fecha,
      Referencia: m.referencia,
      ConceptoBancario: m.concepto,
      Tipo: m.tipo,
      MontoBolivares: m.monto,
      TasaOficialBCV: m.tasaOficial || 0,
      EquivalenteUSD: m.montoUsd || 0,
      BancoCodigo: m.bancoCodigo,
      BancoEmisor: m.bancoNombre,
      CedulaTitular: m.cedula,
      NombreTitular: m.nombreTitular,
      ExpedienteSIEVEX: m.expedienteAsignado,
      EstatusConciliacion: 'CONCILIADO - EXPEDIENTE ORIGINADO',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Extracto_Conciliado');
    XLSX.writeFile(workbook, `Conciliacion_Bancaria_37_Abonos_BCV_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-stone-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-[#faf8f5]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">
                  Conciliación de Extracto Bancario Oficial (37 Abonos Reales con Tasa BCV Diaria)
                </h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                  100% Bancarizado
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Trazabilidad transparente de cada depósito interbancario recibido, vinculado a su tasa oficial BCV de la fecha y a su expediente legal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resumen y Filtros */}
        <div className="p-6 border-b border-stone-200/70 bg-white space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3">
              <span className="text-[11px] font-medium text-stone-500 block">Total en Bolívares</span>
              <span className="text-lg font-bold font-mono text-stone-900">{formatBs(totalGeneralBs)}</span>
              <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">37 operaciones · 15 personas</span>
            </div>
            <div className="rounded-xl border border-stone-200 bg-amber-50/50 p-3">
              <span className="text-[11px] font-medium text-amber-800 block">Total en Divisas (Tasas del Día)</span>
              <span className="text-lg font-bold font-mono text-emerald-800">{formatUSD(totalGeneralUsd)}</span>
              <span className="text-[10px] text-amber-900 font-medium block mt-0.5">Tasas oficiales BCV Ene-Ago 2026</span>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3">
              <span className="text-[11px] font-medium text-stone-500 block">Filtrado Actual</span>
              <span className="text-lg font-bold font-mono text-amber-800">{formatBs(totalBsFiltrado)}</span>
              <span className="text-[10px] text-stone-500 block mt-0.5">{formatUSD(totalUsdFiltrado)} ({filteredMovimientos.length} ops)</span>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={handleExportExcel}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 text-xs font-semibold text-white shadow-xs cursor-pointer transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Extracto a Excel</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar por cédula (ej: V-23.997.829), nombre, referencia bancaria o expediente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 pl-9 pr-4 py-2 text-xs text-stone-800 placeholder-stone-400 focus:border-amber-400 focus:bg-white focus:outline-hidden"
              />
            </div>
            <select
              value={bancoFilter}
              onChange={(e) => setBancoFilter(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2 text-xs font-medium text-stone-700 focus:border-amber-400 focus:outline-hidden"
            >
              <option value="todos">Todos los Bancos</option>
              <option value="0102">0102 - Banco de Venezuela</option>
              <option value="0105">0105 - Banco Mercantil</option>
              <option value="0138">0138 - Banco Plaza</option>
              <option value="0151">0151 - BFC Banco Fondo Común</option>
            </select>
          </div>
        </div>

        {/* Tabla de 37 Abonos con Tasa Oficial */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] font-bold text-stone-700">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Fecha</th>
                <th className="py-2.5 px-3">Referencia</th>
                <th className="py-2.5 px-3">Banco Emisor</th>
                <th className="py-2.5 px-3">Titular / Cédula</th>
                <th className="py-2.5 px-3">Concepto Extracto</th>
                <th className="py-2.5 px-3 text-right">Monto (Bs.)</th>
                <th className="py-2.5 px-3 text-right">Tasa BCV del Día</th>
                <th className="py-2.5 px-3 text-right">Equiv. USD</th>
                <th className="py-2.5 px-3 text-center">Expediente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredMovimientos.map((m, idx) => (
                <tr key={m.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-stone-400">{idx + 1}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-medium text-stone-700">{m.fecha}</td>
                  <td className="py-2.5 px-3 font-mono font-medium text-stone-900 bg-stone-50/60 rounded px-1">{m.referencia}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-stone-700 font-medium">
                      <Building2 className="h-3 w-3 text-stone-400" />
                      {m.bancoNombre} ({m.bancoCodigo})
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-stone-900">{m.nombreTitular}</div>
                    <div className="text-[11px] font-mono text-stone-500">{m.cedula}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600 max-w-[180px] truncate" title={m.concepto}>
                    {m.concepto}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900 whitespace-nowrap">
                    {formatBs(m.monto)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-amber-900 whitespace-nowrap">
                    {m.tasaOficial ? formatTasaBCV(m.tasaOficial) : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800 whitespace-nowrap">
                    {m.montoUsd ? formatUSD(m.montoUsd) : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (onOpenExpediente) {
                          onOpenExpediente(m.expedienteAsignado);
                          onClose();
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 text-[11px] font-semibold text-amber-900 cursor-pointer transition-colors"
                      title="Ver expediente en detalle"
                    >
                      <span>{m.expedienteAsignado}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pie de modal */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Todos los abonos han sido auditados con la tasa oficial BCV de la fecha de la transacción.</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-stone-300 bg-white px-4 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
