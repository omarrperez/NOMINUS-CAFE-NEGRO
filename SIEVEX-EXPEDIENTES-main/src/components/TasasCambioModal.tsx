import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  X,
  Search,
  Calendar,
  Download,
  Calculator,
  ArrowRight,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { HISTORIAL_TASAS_BCV_2026, getTasaBCVPorFecha, convertirBsAUsd, TasaBCVItem } from '../data/tasasBCV';
import { formatBs, formatUSD, formatTasaBCV } from '../utils/formatters';
import * as XLSX from 'xlsx';

interface TasasCambioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TasasCambioModal: React.FC<TasasCambioModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mesFilter, setMesFilter] = useState('todos');

  // Calculadora rápida integrada
  const [calcMontoBs, setCalcMontoBs] = useState<number>(1000000);
  const [calcFecha, setCalcFecha] = useState<string>('2026-06-10');

  const calcResultado = useMemo(() => {
    return convertirBsAUsd(calcMontoBs || 0, calcFecha, 'VENTA');
  }, [calcMontoBs, calcFecha]);

  const filteredTasas = useMemo(() => {
    return HISTORIAL_TASAS_BCV_2026.filter((item) => {
      const matchSearch =
        item.fecha.includes(searchTerm) ||
        item.fechaIso.includes(searchTerm) ||
        String(item.ventaAsk).includes(searchTerm) ||
        String(item.compraBid).includes(searchTerm);

      let matchMes = true;
      if (mesFilter !== 'todos') {
        const mes = item.fechaIso.split('-')[1];
        matchMes = mes === mesFilter;
      }

      return matchSearch && matchMes;
    });
  }, [searchTerm, mesFilter]);

  const stats = useMemo(() => {
    const list = HISTORIAL_TASAS_BCV_2026;
    const minItem = list.reduce((prev, curr) => (curr.ventaAsk < prev.ventaAsk ? curr : prev), list[0]);
    const maxItem = list.reduce((prev, curr) => (curr.ventaAsk > prev.ventaAsk ? curr : prev), list[0]);
    const avgAsk = list.reduce((sum, item) => sum + item.ventaAsk, 0) / list.length;
    return { minItem, maxItem, avgAsk };
  }, []);

  const handleExportExcel = () => {
    const rows = HISTORIAL_TASAS_BCV_2026.map((t, idx) => ({
      Nro: idx + 1,
      Fecha: t.fecha,
      FechaIso: t.fechaIso,
      Moneda: t.moneda,
      CompraBid: t.compraBid,
      VentaAsk: t.ventaAsk,
      SpreadBs: Number((t.ventaAsk - t.compraBid).toFixed(4)),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasas_BCV_Ene_Ago_2026');
    XLSX.writeFile(workbook, `Historial_Tasas_BCV_Ene_Ago_2026_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-stone-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-[#faf8f5]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">
                  Historial Oficial de Tasas de Cambio BCV (Enero a Agosto 2026)
                </h2>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 border border-amber-300">
                  159 Ruedas Bancarias
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Serie oficial de tasas Banco Central de Venezuela (Compra BID / Venta ASK) aplicada a cada transacción por su fecha valor.
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

        {/* Panel Superior: Tarjetas Estadísticas y Calculadora Rápida */}
        <div className="p-6 border-b border-stone-200/70 bg-white space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3">
              <span className="text-[11px] font-medium text-stone-500 block">Tasa Apertura (02/01/2026)</span>
              <span className="text-base font-bold font-mono text-stone-900">Bs. {stats.minItem.ventaAsk.toFixed(4)}</span>
              <span className="text-[10px] text-stone-500 block mt-0.5">Bid: {stats.minItem.compraBid.toFixed(4)}</span>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3">
              <span className="text-[11px] font-medium text-stone-500 block">Tasa Cierre (31/08/2026)</span>
              <span className="text-base font-bold font-mono text-amber-900">Bs. {stats.maxItem.ventaAsk.toFixed(4)}</span>
              <span className="text-[10px] text-stone-500 block mt-0.5">Bid: {stats.maxItem.compraBid.toFixed(4)}</span>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3">
              <span className="text-[11px] font-medium text-stone-500 block">Promedio del Período</span>
              <span className="text-base font-bold font-mono text-stone-800">Bs. {stats.avgAsk.toFixed(4)}</span>
              <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">Enero - Agosto 2026</span>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={handleExportExcel}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 text-xs font-semibold text-white shadow-xs cursor-pointer transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Tasas a Excel</span>
              </button>
            </div>
          </div>

          {/* Calculadora Interactiva por Fecha */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 mb-2">
              <Calculator className="h-4 w-4 text-amber-700" />
              <span>Convertidor Automático Oficial por Fecha de Operación</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <div>
                <label className="text-[11px] font-medium text-stone-600 block mb-1">Monto en Bolívares (Bs.)</label>
                <input
                  type="number"
                  value={calcMontoBs}
                  onChange={(e) => setCalcMontoBs(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-mono font-semibold text-stone-900 focus:outline-hidden focus:border-amber-500"
                  placeholder="Monto Bs"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-stone-600 block mb-1">Fecha de la Transacción</label>
                <input
                  type="date"
                  value={calcFecha}
                  min="2026-01-02"
                  max="2026-08-31"
                  onChange={(e) => setCalcFecha(e.target.value)}
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-mono text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <div>
                <span className="text-[11px] font-medium text-stone-600 block mb-1">Tasa Aplicada ({calcResultado.fechaTasa})</span>
                <div className="rounded-lg bg-amber-100/70 border border-amber-300 px-3 py-1.5 text-xs font-mono font-bold text-amber-950">
                  {formatTasaBCV(calcResultado.tasaAplicada)} (Venta Ask)
                </div>
              </div>
              <div>
                <span className="text-[11px] font-medium text-emerald-800 block mb-1">Equivalente Oficial (USD)</span>
                <div className="rounded-lg bg-emerald-100 border border-emerald-300 px-3 py-1.5 text-xs font-mono font-bold text-emerald-900">
                  {formatUSD(calcResultado.montoUsd)}
                </div>
              </div>
            </div>
          </div>

          {/* Filtros de Tabla */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar por fecha (ej: 10/06/2026, 2026-06-10) o valor de tasa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 pl-9 pr-4 py-2 text-xs text-stone-800 placeholder-stone-400 focus:border-amber-400 focus:bg-white focus:outline-hidden"
              />
            </div>
            <select
              value={mesFilter}
              onChange={(e) => setMesFilter(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2 text-xs font-medium text-stone-700 focus:border-amber-400 focus:outline-hidden"
            >
              <option value="todos">Todos los Meses (159 días)</option>
              <option value="01">Enero 2026</option>
              <option value="02">Febrero 2026</option>
              <option value="03">Marzo 2026</option>
              <option value="04">Abril 2026</option>
              <option value="05">Mayo 2026</option>
              <option value="06">Junio 2026</option>
              <option value="07">Julio 2026</option>
              <option value="08">Agosto 2026</option>
            </select>
          </div>
        </div>

        {/* Tabla de Tasas Diarias */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] font-bold text-stone-700">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Fecha (DD/MM/AAAA)</th>
                <th className="py-2.5 px-3">Fecha ISO</th>
                <th className="py-2.5 px-3">Moneda</th>
                <th className="py-2.5 px-3 text-right">Compra (BID)</th>
                <th className="py-2.5 px-3 text-right">Venta (ASK) Oficial BCV</th>
                <th className="py-2.5 px-3 text-right">Spread Bancario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTasas.map((item, idx) => {
                const spread = item.ventaAsk - item.compraBid;
                return (
                  <tr key={item.fechaIso} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-2 px-3 font-mono text-[11px] text-stone-400">{idx + 1}</td>
                    <td className="py-2 px-3 whitespace-nowrap font-medium text-stone-800">{item.fecha}</td>
                    <td className="py-2 px-3 whitespace-nowrap font-mono text-stone-500 text-[11px]">{item.fechaIso}</td>
                    <td className="py-2 px-3 whitespace-nowrap text-stone-600">{item.moneda}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-700 whitespace-nowrap">
                      {item.compraBid.toFixed(6)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-amber-900 whitespace-nowrap bg-amber-50/40">
                      {item.ventaAsk.toFixed(6)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-[11px] text-stone-500 whitespace-nowrap">
                      +{spread.toFixed(4)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pie de modal */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Datos cargados en Firestore Cloud y en el motor de cálculo de la applet.</span>
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
