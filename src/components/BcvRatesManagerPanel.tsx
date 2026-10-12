import React, { useState } from 'react';
import { DollarSign, ArrowRightLeft, TrendingUp, Calendar, RefreshCw, Calculator, ShieldCheck, Search, Filter } from 'lucide-react';
import { BCV_RATES_HISTORY, BcvRateItem } from '../data/nominusData';

interface Props {
  currentRate: BcvRateItem;
  onUpdateRate: (newRate: BcvRateItem) => void;
}

export const BcvRatesManagerPanel: React.FC<Props> = ({ currentRate, onUpdateRate }) => {
  const [rates] = useState<BcvRateItem[]>(BCV_RATES_HISTORY);
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [searchDate, setSearchDate] = useState<string>('');
  const [rateType, setRateType] = useState<'ASK' | 'BID'>('ASK'); // ASK: Venta, BID: Compra

  const [calcAmount, setCalcAmount] = useState<string>('1000');
  const [calcDirection, setCalcDirection] = useState<'USD_TO_VES' | 'VES_TO_USD'>('USD_TO_VES');
  const [customRate, setCustomRate] = useState<string>(currentRate.rateUsd.toString());

  // Coffee Quintals Quick Calculator
  const [coffeeQtl, setCoffeeQtl] = useState<number>(100);
  const [pricePerQtlUSD, setPricePerQtlUSD] = useState<number>(55);

  const numericCalcAmount = parseFloat(calcAmount) || 0;
  const activeRateValue = currentRate.rateUsd;
  const convertedAmount =
    calcDirection === 'USD_TO_VES'
      ? numericCalcAmount * activeRateValue
      : numericCalcAmount / (activeRateValue || 1);

  const totalCoffeeUSD = coffeeQtl * pricePerQtlUSD;
  const totalCoffeeVES = totalCoffeeUSD * activeRateValue;

  const handleApplyCustomRate = () => {
    const parsed = parseFloat(customRate);
    if (!isNaN(parsed) && parsed > 0) {
      const updated: BcvRateItem = {
        ...currentRate,
        rateUsd: parsed,
        askUsd: parsed,
        bidUsd: parsed * 0.9975,
        rateEur: parsed * 1.07,
        source: 'Ajuste Manual Autorizado'
      };
      onUpdateRate(updated);
    }
  };

  // Filter rates by month and search
  const filteredRates = rates.filter((r) => {
    // date is formatted like DD/MM/YYYY
    const month = r.date.split('/')[1];
    const matchesMonth =
      selectedMonth === 'ALL' ||
      (selectedMonth === '01' && month === '01') ||
      (selectedMonth === '02' && month === '02') ||
      (selectedMonth === '03' && month === '03') ||
      (selectedMonth === '04' && month === '04') ||
      (selectedMonth === '05' && month === '05') ||
      (selectedMonth === '06' && month === '06') ||
      (selectedMonth === '07' && month === '07') ||
      (selectedMonth === '08' && month === '08');

    const matchesSearch =
      !searchDate ||
      r.date.includes(searchDate) ||
      r.rateUsd.toString().includes(searchDate);

    return matchesMonth && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Histórico Oficial del Dólar BCV & Calculadora Cambiaria
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Serie Diaria Enero 2026 &ndash; Agosto 2026 &middot; Precios Oficiales Compra (BID) y Venta (ASK) Banco Central de Venezuela
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-emerald-950/80 border border-emerald-800/80 px-3.5 py-1.5 rounded-lg text-xs font-mono-num flex items-center gap-2">
            <div>
              <div className="text-[10px] text-emerald-300 uppercase font-sans">Tasa Seleccionada:</div>
              <div className="text-emerald-400 font-bold text-base leading-none">
                Bs. {currentRate.rateUsd.toFixed(6)}
              </div>
            </div>
            <span className="text-stone-400 text-[10px] font-sans">({currentRate.date})</span>
          </div>
        </div>
      </div>

      {/* Grid of Tools: Converter & Coffee Value Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Converter Tool */}
        <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-500" />
              Conversor Bimonetario Inmediato (Tasa Oficial)
            </h3>
            <button
              onClick={() => setCalcDirection(d => d === 'USD_TO_VES' ? 'VES_TO_USD' : 'USD_TO_VES')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 p-1"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Invertir ({calcDirection === 'USD_TO_VES' ? 'USD → VES' : 'VES → USD'})
            </button>
          </div>

          <div className="space-y-3 font-mono-num">
            <div>
              <label className="block text-xs font-sans text-stone-400 mb-1">
                {calcDirection === 'USD_TO_VES' ? 'Monto en Dólares (USD):' : 'Monto en Bolívares (VES):'}
              </label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white font-bold text-base focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-4 rounded-lg bg-stone-950 border border-stone-800">
              <span className="text-xs font-sans text-stone-400 block">
                {calcDirection === 'USD_TO_VES' ? 'Contravalor en Bolívares (VES):' : 'Contravalor en Dólares (USD):'}
              </span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {calcDirection === 'USD_TO_VES'
                  ? `Bs. ${convertedAmount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
                  : `$ ${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`}
              </div>
              <span className="text-[11px] font-sans text-stone-500 mt-1 block">
                Liquidado a tasa de: Bs. {activeRateValue.toFixed(4)} por USD ({currentRate.date})
              </span>
            </div>
          </div>
        </div>

        {/* Coffee Valuation Quick Calculator */}
        <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Valoración de Café en Bolívares
            </h3>
            <span className="text-[11px] text-stone-400">Café Pergamino Lavado</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono-num">
            <div>
              <label className="block text-xs font-sans text-stone-400 mb-1">Quintales (Qtl):</label>
              <input
                type="number"
                value={coffeeQtl}
                onChange={(e) => setCoffeeQtl(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-sans text-stone-400 mb-1">Precio USD/Qtl:</label>
              <input
                type="number"
                value={pricePerQtlUSD}
                onChange={(e) => setPricePerQtlUSD(parseFloat(e.target.value) || 0)}
                className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-white font-bold"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 space-y-2 font-mono-num">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-400 font-sans">Total Valoración Dólares:</span>
              <span className="font-bold text-white text-base">$ {totalCoffeeUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-stone-800 pt-2">
              <span className="text-stone-400 font-sans">Total a Liquidar en Bolívares:</span>
              <span className="font-bold text-emerald-400 text-lg">Bs. {totalCoffeeVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Manual adjustment if needed */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="number"
              step="0.0001"
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              className="w-32 bg-stone-950 border border-stone-700 rounded px-2 py-1 text-xs text-white font-mono-num"
              placeholder="Tasa custom"
            />
            <button
              onClick={handleApplyCustomRate}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors"
            >
              Fijar Tasa Específica
            </button>
          </div>
        </div>
      </div>

      {/* Historical Rates Table: Enero 2026 - Agosto 2026 */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow">
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Histórico Oficial del Dólar BCV (Enero 2026 &ndash; Agosto 2026)</span>
              <span className="bg-stone-800 text-amber-400 px-2 py-0.5 rounded text-[10px]">
                {filteredRates.length} Fechas Oficiales
              </span>
            </h3>
            <span className="text-[11px] text-stone-400">
              Datos certificados de la Mesa de Cambio y Banco Central de Venezuela
            </span>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar fecha (ej: 04/05/2026)..."
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="bg-stone-900 border border-stone-700 rounded px-2.5 py-1 text-xs text-stone-200 placeholder-stone-500 w-44"
              />
              <Search className="w-3 h-3 text-stone-400 absolute right-2 top-2 pointer-events-none" />
            </div>

            {/* Month selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-stone-900 border border-stone-700 rounded px-2.5 py-1 text-xs text-stone-200 font-sans"
            >
              <option value="ALL">Todos los Meses (Ene - Ago)</option>
              <option value="08">Agosto 2026</option>
              <option value="07">Julio 2026</option>
              <option value="06">Junio 2026</option>
              <option value="05">Mayo 2026</option>
              <option value="04">Abril 2026</option>
              <option value="03">Marzo 2026</option>
              <option value="02">Febrero 2026</option>
              <option value="01">Enero 2026</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[520px]">
          <table className="w-full text-xs text-left text-stone-300 font-mono-num">
            <thead className="bg-stone-950/90 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 sticky top-0 z-10 backdrop-blur">
              <tr>
                <th className="px-4 py-2.5">Fecha Valor</th>
                <th className="px-4 py-2.5">Moneda</th>
                <th className="px-4 py-2.5 text-right font-bold text-sky-400">Compra (BID)</th>
                <th className="px-4 py-2.5 text-right font-bold text-emerald-400">Venta (ASK) / Tasa Oficial</th>
                <th className="px-4 py-2.5 text-right font-bold text-amber-300">EUR (VES)</th>
                <th className="px-4 py-2.5 text-right">Variación Diaria</th>
                <th className="px-4 py-2.5 text-center font-sans">Acción en Sistema</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredRates.map((r) => {
                const isSelected = currentRate.date === r.date;
                return (
                  <tr
                    key={r.date}
                    className={`hover:bg-stone-800/40 transition-colors ${
                      isSelected ? 'bg-amber-950/30 border-l-2 border-amber-500' : ''
                    }`}
                  >
                    <td className="px-4 py-2 text-stone-200 font-bold flex items-center gap-1.5">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      <span>{r.date}</span>
                    </td>
                    <td className="px-4 py-2 text-stone-400 font-sans text-[11px]">USD E.U.A.</td>
                    <td className="px-4 py-2 text-right text-sky-300 font-semibold">
                      {r.bidUsd !== undefined ? `Bs. ${r.bidUsd.toFixed(6)}` : `Bs. ${(r.rateUsd * 0.9975).toFixed(6)}`}
                    </td>
                    <td className="px-4 py-2 text-right text-emerald-400 font-bold">
                      {r.askUsd !== undefined ? `Bs. ${r.askUsd.toFixed(6)}` : `Bs. ${r.rateUsd.toFixed(6)}`}
                    </td>
                    <td className="px-4 py-2 text-right text-stone-300">
                      Bs. {r.rateEur.toFixed(4)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <span className={r.variationPct >= 0 ? 'text-amber-400' : 'text-emerald-400'}>
                        {r.variationPct >= 0 ? `+${r.variationPct.toFixed(2)}%` : `${r.variationPct.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => onUpdateRate(r)}
                        className={`px-2.5 py-1 rounded text-[11px] font-sans font-medium transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-stone-950 font-bold'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                        }`}
                      >
                        {isSelected ? 'Tasa Activa' : 'Aplicar Tasa'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex justify-between items-center text-[11px] text-stone-400 font-mono">
          <span>Mostrando {filteredRates.length} de {rates.length} registros oficiales</span>
          <span className="text-emerald-400">Rango: 02/01/2026 (Bs. 304.68) &rarr; 31/08/2026 (Bs. 798.33)</span>
        </div>
      </div>
    </div>
  );
};
