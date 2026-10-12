import React, { useState } from 'react';
import { Receipt, Printer, QrCode, CheckCircle, RefreshCw, FileText, User, Scale, Plus, Save, FileDown, Download } from 'lucide-react';
import { exportToWord, exportToPdfPrint, downloadElementAsPdf } from '../utils/exportUtils';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import { useAppData, CoffeeReceiptRecord } from '../context/AppDataContext';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
}

export const ReceiptGeneratorView: React.FC<Props> = ({ company, currentRate }) => {
  const { receipts, addReceipt } = useAppData();
  const [receiptNumber, setReceiptNumber] = useState(`REC-2026-${String(receipts.length + 1).padStart(4, '0')}`);
  const [producerName, setProducerName] = useState('');
  const [producerId, setProducerId] = useState('V-');
  const [farmLocation, setFarmLocation] = useState('Acarigua / Araure, Edo. Portuguesa (Almacén de Recepción)');
  const [coffeeType, setCoffeeType] = useState('Café Arábica Pergamino Lavado Exportación');
  const [sacksCount, setSacksCount] = useState<number>(0);
  const [weightKg, setWeightKg] = useState<number>(0);
  const [humidityPct, setHumidityPct] = useState<number>(11.8);
  const [priceUSDPerQtl, setPriceUSDPerQtl] = useState<number>(54.00);
  const [advanceDeductionUSD, setAdvanceDeductionUSD] = useState<number>(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Computations
  const quintales = weightKg > 0 ? weightKg / 46 : 0;
  const subtotalUSD = quintales * priceUSDPerQtl;
  const netUSD = Math.max(0, subtotalUSD - advanceDeductionUSD);
  const netVES = netUSD * currentRate.rateUsd;

  const handleSaveReceipt = () => {
    if (!producerName || weightKg <= 0) return;

    const record: CoffeeReceiptRecord = {
      id: `rec-${Date.now()}`,
      receiptNumber,
      date: new Date().toISOString().split('T')[0],
      producerName,
      producerId,
      farmLocation,
      coffeeType,
      sacksCount,
      weightKg,
      quintales,
      humidityPct,
      priceUSDPerQtl,
      subtotalUSD,
      advanceDeductionUSD,
      netUSD,
      netVES,
      bcvRate: currentRate.rateUsd
    };

    addReceipt(record);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    // Prepare next
    setReceiptNumber(`REC-2026-${String(receipts.length + 2).padStart(4, '0')}`);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Generador de Recibos de Recepción y Liquidación de Café
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Ticket de pesaje en romana, liquidación en quintales (46 kg) y cálculo bimonetario &middot; Tasa BCV: Bs. {currentRate.rateUsd.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handleSaveReceipt}
            disabled={!producerName || weightKg <= 0}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
          >
            <Save className="w-3.5 h-3.5" />
            {savedSuccess ? '¡Guardado con Éxito!' : 'Guardar en Base de Datos Real'}
          </button>
          <button
            onClick={() => {
              const receiptPaper = document.getElementById('recibo-cafe-live-preview');
              if (receiptPaper) {
                exportToWord(`${receiptNumber}_Agricola_Oni.doc`, `Recibo de Recepción y Pesaje ${receiptNumber}`, receiptPaper.innerHTML);
              }
            }}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
            title="Exportar recibo a Word (.doc)"
          >
            <FileDown className="w-3.5 h-3.5" />
            Word (.doc)
          </button>
          <button
            onClick={async () => {
              const receiptPaper = document.getElementById('recibo-cafe-live-preview');
              if (receiptPaper) {
                await downloadElementAsPdf('recibo-cafe-live-preview', `${receiptNumber}_Agricola_Oni.pdf`);
              }
            }}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar recibo en PDF directo"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar PDF (.pdf)
          </button>
          <button
            onClick={() => exportToPdfPrint()}
            className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Imprimir recibo (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </div>

      {/* 2 Columns: Configurator Form & Real-time Live Receipt Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4 text-xs font-mono-num">
          <h3 className="font-bold text-sm text-white font-sans border-b border-stone-800 pb-2">
            Parámetros del Recibo Real
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-stone-400 font-sans block mb-1">N° de Recibo / Ticket:</label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-stone-100 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-stone-400 font-sans block mb-1">Productor Caficultor:</label>
                <input
                  type="text"
                  placeholder="Nombre y apellido"
                  value={producerName}
                  onChange={(e) => setProducerName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-stone-100"
                />
              </div>
              <div>
                <label className="text-stone-400 font-sans block mb-1">Cédula / RIF:</label>
                <input
                  type="text"
                  placeholder="V-00.000.000"
                  value={producerId}
                  onChange={(e) => setProducerId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 font-sans block mb-1">Finca / Origen:</label>
              <input
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-stone-100"
              />
            </div>

            <div>
              <label className="text-stone-400 font-sans block mb-1">Variedad y Grano:</label>
              <input
                type="text"
                value={coffeeType}
                onChange={(e) => setCoffeeType(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-stone-100"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-stone-400 font-sans block mb-1">Sacos:</label>
                <input
                  type="number"
                  placeholder="0"
                  value={sacksCount || ''}
                  onChange={(e) => {
                    const s = parseInt(e.target.value) || 0;
                    setSacksCount(s);
                    if (s > 0 && weightKg === 0) setWeightKg(s * 46);
                  }}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-stone-100 font-bold"
                />
              </div>
              <div>
                <label className="text-stone-400 font-sans block mb-1">Kilos Netos:</label>
                <input
                  type="number"
                  placeholder="0"
                  value={weightKg || ''}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-stone-100 font-bold"
                />
              </div>
              <div>
                <label className="text-stone-400 font-sans block mb-1">% Humedad:</label>
                <input
                  type="number"
                  step="0.1"
                  value={humidityPct}
                  onChange={(e) => setHumidityPct(parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-stone-400 font-sans block mb-1">Precio USD / Qtl:</label>
                <input
                  type="number"
                  step="0.5"
                  value={priceUSDPerQtl}
                  onChange={(e) => setPriceUSDPerQtl(parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-stone-100 font-bold"
                />
              </div>
              <div>
                <label className="text-stone-400 font-sans block mb-1">Anticipo Deducible USD:</label>
                <input
                  type="number"
                  step="10"
                  value={advanceDeductionUSD}
                  onChange={(e) => setAdvanceDeductionUSD(parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-amber-400 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Printable Receipt */}
        <div className="lg:col-span-7">
          <div id="recibo-cafe-live-preview" className="bg-white text-stone-900 rounded-xl p-6 sm:p-8 shadow-2xl border border-stone-300 max-w-md mx-auto print:border-none print:shadow-none print:p-0">
            {/* Header */}
            <div className="text-center border-b-2 border-stone-900 pb-3 mb-4">
              <h3 className="font-bold font-serif-doc text-base text-stone-950">{company.name}</h3>
              <p className="text-[10px] text-stone-600 font-mono">RIF: {company.rif} &middot; Acopio</p>
              <div className="mt-2 inline-block px-2.5 py-0.5 bg-stone-100 border border-stone-400 rounded text-xs font-bold font-mono tracking-wider text-stone-950">
                RECIBO DE RECEPCIÓN Y PESAJE: {receiptNumber}
              </div>
              <p className="text-[10px] text-stone-500 mt-1 font-mono-num">
                Fecha: {new Date().toLocaleDateString('es-VE')} &middot; Báscula Romana N° 01
              </p>
            </div>

            {/* Producer Info */}
            <div className="text-xs space-y-1 mb-4 border-b border-stone-200 pb-3">
              <div><strong>Caficultor:</strong> {producerName || 'Por ingresar'}</div>
              <div><strong>Cédula / RIF:</strong> <span className="font-mono">{producerId}</span></div>
              <div><strong>Origen:</strong> {farmLocation}</div>
              <div><strong>Rubro:</strong> {coffeeType}</div>
            </div>

            {/* Weights & Calculations Table */}
            <div className="border border-stone-800 rounded overflow-hidden mb-4 text-xs font-mono-num">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <td className="px-3 py-1.5 font-sans font-semibold">Cantidad de Sacos:</td>
                    <td className="px-3 py-1.5 text-right font-bold">{sacksCount} Sacos</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="px-3 py-1.5 font-sans font-semibold">Peso Bruto en Báscula:</td>
                    <td className="px-3 py-1.5 text-right">{weightKg.toLocaleString()} Kg</td>
                  </tr>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <td className="px-3 py-1.5 font-sans font-semibold">Humedad Medida:</td>
                    <td className="px-3 py-1.5 text-right">{humidityPct}%</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="px-3 py-1.5 font-sans font-semibold">Quintales (46 Kg):</td>
                    <td className="px-3 py-1.5 text-right font-bold text-amber-900">{quintales.toFixed(2)} Qtl</td>
                  </tr>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <td className="px-3 py-1.5 font-sans font-semibold">Precio / Quintal:</td>
                    <td className="px-3 py-1.5 text-right">${priceUSDPerQtl.toFixed(2)} USD</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="px-3 py-1.5 font-sans font-semibold">Subtotal Cosecha USD:</td>
                    <td className="px-3 py-1.5 text-right">${subtotalUSD.toFixed(2)} USD</td>
                  </tr>
                  {advanceDeductionUSD > 0 && (
                    <tr className="border-b border-stone-200 bg-amber-50/50 text-amber-900">
                      <td className="px-3 py-1.5 font-sans font-semibold">Deducción de Anticipo:</td>
                      <td className="px-3 py-1.5 text-right font-bold">-${advanceDeductionUSD.toFixed(2)} USD</td>
                    </tr>
                  )}
                  <tr className="bg-stone-900 text-white font-bold text-sm">
                    <td className="px-3 py-2 font-sans">TOTAL A LIQUIDAR (VES):</td>
                    <td className="px-3 py-2 text-right text-emerald-400">
                      Bs. {netVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Rate footer */}
            <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono-num mb-4">
              <span>Tasa BCV Aplicada: Bs. {currentRate.rateUsd.toFixed(2)}</span>
              <span>Neto Ref. USD: ${netUSD.toFixed(2)}</span>
            </div>

            {/* QR verification code representation */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded flex items-center justify-between gap-3 mb-6">
              <div className="w-12 h-12 border-2 border-stone-800 p-1 flex items-center justify-center bg-white">
                <QrCode className="w-10 h-10 text-stone-950" />
              </div>
              <div className="text-[10px] text-stone-600 font-mono flex-1">
                <p className="font-bold text-stone-900">CERTIFICACIÓN ELECTRÓNICA SICA</p>
                <p>Hash: {receiptNumber}</p>
                <p>Inspección: Aprobado Calidad A</p>
              </div>
            </div>

            {/* Dual Signatures */}
            <div className="grid grid-cols-2 gap-4 text-center text-[10px] pt-2 border-t border-stone-300">
              <div>
                <div className="border-t border-stone-700 pt-1 mt-6">
                  <p className="font-bold text-stone-900">{company.name}</p>
                  <p className="text-stone-500">Operador de Romana</p>
                </div>
              </div>
              <div>
                <div className="border-t border-stone-700 pt-1 mt-6">
                  <p className="font-bold text-stone-900">{producerName || 'Caficultor'}</p>
                  <p className="text-stone-500">Firma de Recibido</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Receipts History List */}
      {receipts.length > 0 && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow">
          <div className="px-5 py-3 bg-stone-950 border-b border-stone-800 flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase font-mono">
              Historial de Recibos Reales Guardados ({receipts.length})
            </h3>
          </div>
          <table className="w-full text-xs text-left text-stone-300 font-mono-num">
            <thead className="bg-stone-950 text-stone-400 uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2">Recibo</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2 font-sans">Caficultor</th>
                <th className="px-4 py-2 text-right">Quintales</th>
                <th className="px-4 py-2 text-right">Neto USD</th>
                <th className="px-4 py-2 text-right font-bold text-emerald-400">Neto VES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {receipts.map((r) => (
                <tr key={r.id} className="hover:bg-stone-800/30">
                  <td className="px-4 py-2 text-amber-400 font-bold">{r.receiptNumber}</td>
                  <td className="px-4 py-2 text-stone-400">{r.date}</td>
                  <td className="px-4 py-2 font-sans font-medium text-white">{r.producerName}</td>
                  <td className="px-4 py-2 text-right">{r.quintales.toFixed(2)} Qtl</td>
                  <td className="px-4 py-2 text-right">${r.netUSD.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-bold text-emerald-400">
                    Bs. {r.netVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
