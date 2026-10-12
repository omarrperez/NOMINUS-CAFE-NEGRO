import React, { useState } from 'react';
import { BookOpen, DollarSign, ArrowDownRight, ArrowUpRight, Plus, Download, Printer, Search, Wallet, X, FileSpreadsheet, FileDown } from 'lucide-react';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import { useAppData, PettyCashEntry } from '../context/AppDataContext';
import { exportToWord, exportToCsv, exportHtmlToPdf, exportToPdfPrint, exportToExcelXlsx } from '../utils/exportUtils';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
}

export const BanescoLedgerAndCashTrailView: React.FC<Props> = ({ company, currentRate }) => {
  const { bankMovements, pettyCash, addPettyCash } = useAppData();
  const [activeTab, setActiveTab] = useState<'BANESCO_LEDGER' | 'PETTY_CASH'>('BANESCO_LEDGER');
  const [currencyMode, setCurrencyMode] = useState<'VES' | 'USD'>('VES');
  const [filterMonth, setFilterMonth] = useState<string>('ALL');

  // Modal to add petty cash
  const [showAddPettyCashModal, setShowAddPettyCashModal] = useState(false);
  const [pcDate, setPcDate] = useState('2026-03-31');
  const [pcVoucher, setPcVoucher] = useState(`CC-${String(pettyCash.length + 1).padStart(3, '0')}`);
  const [pcConcept, setPcConcept] = useState('');
  const [pcResponsible, setPcResponsible] = useState('');
  const [pcAmountUSD, setPcAmountUSD] = useState<number>(0);
  const [pcType, setPcType] = useState<'EGRESO' | 'REPOSICION'>('EGRESO');
  const [pcReceiptRef, setPcReceiptRef] = useState('');

  // Filter movements by month
  const filteredBankMovements = bankMovements.filter((m) => {
    if (filterMonth === '01') return m.date.startsWith('2026-01');
    if (filterMonth === '02') return m.date.startsWith('2026-02');
    if (filterMonth === '03') return m.date.startsWith('2026-03');
    return true;
  });

  const handleCreatePettyCash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pcConcept || pcAmountUSD <= 0) return;

    const rate = currentRate.rateUsd;
    const amountVES = pcAmountUSD * rate;

    const newEntry: PettyCashEntry = {
      id: `pc-${Date.now()}`,
      date: pcDate,
      voucher: pcVoucher,
      concept: pcConcept,
      responsible: pcResponsible || 'Administración de Finca',
      amountUSD: pcAmountUSD,
      amountVES,
      type: pcType,
      receiptRef: pcReceiptRef || 'Vale de Caja'
    };

    addPettyCash(newEntry);
    setShowAddPettyCashModal(false);
    // Reset
    setPcConcept('');
    setPcAmountUSD(0);
    setPcReceiptRef('');
  };

  const totalPettyExpensesUSD = pettyCash.filter(p => p.type === 'EGRESO').reduce((acc, p) => acc + p.amountUSD, 0);
  const totalPettyReplenishedUSD = pettyCash.filter(p => p.type === 'REPOSICION').reduce((acc, p) => acc + p.amountUSD, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner and Tabs */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Libro Auxiliar Banesco & Trazabilidad de Flujo
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Registro cronológico y analítico de cuentas bancarias y caja chica operativa en fincas cafetaleras
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800">
          <button
            onClick={() => setActiveTab('BANESCO_LEDGER')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'BANESCO_LEDGER'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Libro Mayor Banesco ({bankMovements.length})
          </button>
          <button
            onClick={() => setActiveTab('PETTY_CASH')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'PETTY_CASH'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Caja Chica Finca ({pettyCash.length})
          </button>
        </div>
      </div>

      {activeTab === 'BANESCO_LEDGER' ? (
        /* Banesco Ledger Tab */
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900 border border-stone-800 p-3 rounded-lg text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Filtrar Mes:</span>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="bg-stone-950 border border-stone-700 text-stone-200 rounded px-2.5 py-1 focus:outline-none"
              >
                <option value="ALL">Todo el Trimestre (Q1 2026)</option>
                <option value="01">Enero 2026</option>
                <option value="02">Febrero 2026</option>
                <option value="03">Marzo 2026</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-stone-950 rounded p-0.5 border border-stone-700 mr-2">
                <button
                  onClick={() => setCurrencyMode('VES')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    currencyMode === 'VES' ? 'bg-amber-600 text-stone-950' : 'text-stone-400'
                  }`}
                >
                  Bolívares (VES)
                </button>
                <button
                  onClick={() => setCurrencyMode('USD')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    currencyMode === 'USD' ? 'bg-emerald-600 text-stone-950' : 'text-stone-400'
                  }`}
                >
                  Dólares (USD BCV)
                </button>
              </div>

              <button
                onClick={() => {
                  const rowsHtml = filteredBankMovements.map(m => `
                    <tr>
                      <td>${m.date}</td>
                      <td><strong>${m.reference}</strong></td>
                      <td>${m.description}</td>
                      <td class="num">Bs. ${m.bcvRate.toFixed(2)}</td>
                      <td class="num">${m.debitVES > 0 ? `Bs. ${m.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
                      <td class="num">${m.creditVES > 0 ? `Bs. ${m.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
                      <td class="num">Bs. ${m.balanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                      <td>${m.supportDocType} (${m.supportDocRef})</td>
                    </tr>
                  `).join('');

                  const htmlContent = `
                    <h1>${company.name}</h1>
                    <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Cuenta Banesco:</strong> ${company.banescoAccountVES}</p>
                    <h2>LIBRO AUXILIAR DE BANCOS - BANESCO BANCO UNIVERSAL (2026)</h2>
                    <table>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Referencia</th>
                          <th>Descripción y Tercero</th>
                          <th class="num">Tasa BCV</th>
                          <th class="num">Débito (Egreso)</th>
                          <th class="num">Crédito (Abono)</th>
                          <th class="num">Saldo Bs</th>
                          <th>Soporte Documental</th>
                        </tr>
                      </thead>
                      <tbody>${rowsHtml}</tbody>
                    </table>
                  `;
                  exportToWord('Libro_Auxiliar_Banesco_2026_Agricola_Oni.doc', 'Libro Auxiliar Banesco 2026', htmlContent);
                }}
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow"
                title="Descargar libro auxiliar en Microsoft Word (.doc)"
              >
                <FileDown className="w-3.5 h-3.5" />
                Word (.doc)
              </button>

              <button
                onClick={() => {
                  const headers = [
                    'Fecha',
                    'Referencia Bancaria',
                    'Descripción / Titular y Beneficiario',
                    'Tasa BCV (Bs/$)',
                    'Débito / Egreso (Bs.)',
                    'Crédito / Abono (Bs.)',
                    'Saldo Disponible (Bs.)',
                    'Monto USD ($)',
                    'Tipo Documento Soporte',
                    'Referencia Documental'
                  ];

                  const rows = filteredBankMovements.map(m => [
                    m.date,
                    m.reference,
                    m.description,
                    m.bcvRate,
                    m.debitVES,
                    m.creditVES,
                    m.balanceVES,
                    m.countervalueUSD,
                    m.supportDocType,
                    m.supportDocRef
                  ]);

                  const totalDebits = filteredBankMovements.reduce((sum, m) => sum + m.debitVES, 0);
                  const totalCredits = filteredBankMovements.reduce((sum, m) => sum + m.creditVES, 0);
                  const totalUSD = filteredBankMovements.reduce((sum, m) => sum + m.countervalueUSD, 0);

                  const totalsRow = [
                    'TOTALES',
                    `${filteredBankMovements.length} MOVIMIENTOS`,
                    'AUDITORÍA BANCARIA COMPLIANCE',
                    '',
                    totalDebits,
                    totalCredits,
                    totalCredits - totalDebits,
                    totalUSD,
                    'REGISTROS CERTIFICADOS',
                    'Soporte Digital Depositado'
                  ];

                  exportToExcelXlsx({
                    filename: 'Libro_Auxiliar_Banesco_y_Rastro_Efectivo_2026.xlsx',
                    sheetName: 'Libro Auxiliar Banesco',
                    companyName: company.name,
                    companyRif: company.rif,
                    title: 'LIBRO AUXILIAR BANCARIO Y RASTRO DE EFECTIVO (BANESCO BANCO UNIVERSAL)',
                    subtitle: `Cuenta Corriente N° ${company.banescoAccountVES} - Trazabilidad y Auditable para SUDEBAN`,
                    headers,
                    rows,
                    totalsRow,
                    columnWidths: [14, 18, 48, 16, 22, 22, 22, 18, 28, 24]
                  });
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow"
                title="Descargar libro auxiliar y rastro de efectivo formateado en Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Excel (.xlsx)
              </button>

              <button
                onClick={async () => {
                  const rowsHtml = filteredBankMovements.map(m => `
                    <tr>
                      <td>${m.date}</td>
                      <td><strong>${m.reference}</strong></td>
                      <td>${m.description}</td>
                      <td class="num">Bs. ${m.bcvRate.toFixed(2)}</td>
                      <td class="num">${m.debitVES > 0 ? `Bs. ${m.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
                      <td class="num">${m.creditVES > 0 ? `Bs. ${m.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
                      <td class="num">Bs. ${m.balanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                      <td>${m.supportDocType} (${m.supportDocRef})</td>
                    </tr>
                  `).join('');

                  const htmlContent = `
                    <h1>${company.name}</h1>
                    <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Cuenta Banesco:</strong> ${company.banescoAccountVES}</p>
                    <h2>LIBRO AUXILIAR DE BANCOS - BANESCO BANCO UNIVERSAL (2026)</h2>
                    <table>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Referencia</th>
                          <th>Descripción y Tercero</th>
                          <th class="num">Tasa BCV</th>
                          <th class="num">Débito (Egreso)</th>
                          <th class="num">Crédito (Abono)</th>
                          <th class="num">Saldo Bs</th>
                          <th>Soporte Documental</th>
                        </tr>
                      </thead>
                      <tbody>${rowsHtml}</tbody>
                    </table>
                  `;
                  await exportHtmlToPdf('Libro_Auxiliar_Banesco_2026_Agricola_Oni.pdf', 'Libro Auxiliar Banesco 2026', htmlContent);
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1 shadow"
                title="Descargar libro auxiliar en PDF directo"
              >
                <Download className="w-3.5 h-3.5" />
                PDF
              </button>

              <button
                onClick={() => exportToPdfPrint()}
                className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded text-xs transition-colors shadow"
                title="Imprimir (Ctrl+P)"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {bankMovements.length === 0 ? (
            <div className="bg-stone-900 border border-dashed border-stone-700 rounded-xl p-12 text-center text-xs text-stone-400">
              No hay movimientos en el libro auxiliar bancario. Ingrese los movimientos en la pestaña de Auditoría & Conciliación.
            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-300 font-mono-num">
                  <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-mono">
                    <tr>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Referencia</th>
                      <th className="px-4 py-3 font-sans">Detalle y Tercero</th>
                      <th className="px-4 py-3 text-right">Tasa BCV</th>
                      <th className="px-4 py-3 text-right">
                        Débito / Salida ({currencyMode})
                      </th>
                      <th className="px-4 py-3 text-right">
                        Crédito / Entrada ({currencyMode})
                      </th>
                      <th className="px-4 py-3 text-right font-bold text-white">
                        Saldo ({currencyMode})
                      </th>
                      <th className="px-4 py-3 font-sans">Comprobante de Respaldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {filteredBankMovements.map((item) => {
                      const isUSD = currencyMode === 'USD';
                      const debitVal = isUSD ? (item.debitVES > 0 ? item.countervalueUSD : 0) : item.debitVES;
                      const creditVal = isUSD ? (item.creditVES > 0 ? item.countervalueUSD : 0) : item.creditVES;
                      const balanceVal = isUSD ? item.balanceVES / item.bcvRate : item.balanceVES;

                      return (
                        <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                          <td className="px-4 py-3 text-stone-400 whitespace-nowrap">{item.date}</td>
                          <td className="px-4 py-3 text-amber-400 font-semibold whitespace-nowrap">{item.reference}</td>
                          <td className="px-4 py-3 font-sans">
                            <div className="text-stone-100 font-medium">{item.description}</div>
                            <div className="text-[10px] text-stone-400">{item.supportDocType}</div>
                          </td>
                          <td className="px-4 py-3 text-right text-stone-400">Bs. {item.bcvRate.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-amber-300 font-medium">
                            {debitVal > 0 ? (isUSD ? `$ ${debitVal.toFixed(2)}` : `Bs. ${debitVal.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`) : '—'}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-400 font-medium">
                            {creditVal > 0 ? (isUSD ? `$ ${creditVal.toFixed(2)}` : `Bs. ${creditVal.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`) : '—'}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-white">
                            {isUSD ? `$ ${balanceVal.toFixed(2)}` : `Bs. ${balanceVal.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`}
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-stone-300">
                            {item.supportDocRef}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Petty Cash Tab */
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-stone-900 border border-stone-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">Arqueo de Caja Chica en Finca</h3>
              <p className="text-xs text-stone-400">Control de gastos menores en efectivo (combustible, mecates, insumos de emergencia)</p>
            </div>
            <button
              onClick={() => setShowAddPettyCashModal(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Registrar Vale de Caja Real
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-num">
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-lg">
              <span className="text-xs text-stone-400 font-sans block">Gastos Registrados:</span>
              <span className="text-xl font-bold text-amber-400 block mt-1">${totalPettyExpensesUSD.toFixed(2)} USD</span>
              <span className="text-[11px] text-stone-500 font-sans">Bs. {(totalPettyExpensesUSD * currentRate.rateUsd).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-4 rounded-lg">
              <span className="text-xs text-stone-400 font-sans block">Reposiciones de Fondo:</span>
              <span className="text-xl font-bold text-emerald-400 block mt-1">${totalPettyReplenishedUSD.toFixed(2)} USD</span>
              <span className="text-[11px] text-stone-500 font-sans">Bs. {(totalPettyReplenishedUSD * currentRate.rateUsd).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-4 rounded-lg bg-emerald-950/20 border-emerald-900/60">
              <span className="text-xs text-emerald-300 font-sans block">Saldo Neto en Caja Operativa:</span>
              <span className="text-xl font-bold text-emerald-400 block mt-1">${(totalPettyReplenishedUSD - totalPettyExpensesUSD).toFixed(2)} USD</span>
              <span className="text-[11px] text-stone-400 font-sans">Calculado en tiempo real</span>
            </div>
          </div>

          {pettyCash.length === 0 ? (
            <div className="bg-stone-900 border border-dashed border-stone-700 rounded-xl p-10 text-center text-xs text-stone-400">
              No hay vales de caja chica registrados. Haga clic en 'Registrar Vale de Caja Real' para agregar erogaciones operativas.
            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow">
              <div className="px-4 py-3 bg-stone-950 border-b border-stone-800 flex justify-between items-center">
                <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wide">
                  Comprobantes de Caja Chica Operativa &middot; Agrícola Oni C.A.
                </h3>
                <span className="text-[11px] text-stone-400 font-mono">Tasa BCV: Bs. {currentRate.rateUsd.toFixed(2)}</span>
              </div>
              <table className="w-full text-xs text-left text-stone-300 font-mono-num">
                <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="px-4 py-2.5">Fecha</th>
                    <th className="px-4 py-2.5">Vale N°</th>
                    <th className="px-4 py-2.5 font-sans">Concepto</th>
                    <th className="px-4 py-2.5 font-sans">Responsable</th>
                    <th className="px-4 py-2.5 text-right">Monto USD</th>
                    <th className="px-4 py-2.5 text-right">Monto VES</th>
                    <th className="px-4 py-2.5 font-sans">Soporte</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {pettyCash.map((pc) => (
                    <tr key={pc.id} className="hover:bg-stone-800/30">
                      <td className="px-4 py-2.5 text-stone-400">{pc.date}</td>
                      <td className="px-4 py-2.5 text-amber-400 font-semibold">{pc.voucher}</td>
                      <td className="px-4 py-2.5 font-sans text-stone-200">{pc.concept}</td>
                      <td className="px-4 py-2.5 font-sans text-stone-400">{pc.responsible}</td>
                      <td className={`px-4 py-2.5 text-right font-medium ${pc.type === 'REPOSICION' ? 'text-emerald-400' : 'text-amber-300'}`}>
                        {pc.type === 'REPOSICION' ? `+$${pc.amountUSD.toFixed(2)}` : `-$${pc.amountUSD.toFixed(2)}`}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-medium ${pc.type === 'REPOSICION' ? 'text-emerald-400' : 'text-stone-300'}`}>
                        {pc.type === 'REPOSICION' ? `+Bs. ${pc.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : `-Bs. ${pc.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="px-4 py-2.5 font-sans text-stone-400 text-[11px]">{pc.receiptRef}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Add Petty Cash */}
      {showAddPettyCashModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-md w-full p-6 text-stone-200 shadow-2xl relative">
            <button
              onClick={() => setShowAddPettyCashModal(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-white mb-3">Registrar Vale de Caja Chica Real</h3>

            <form onSubmit={handleCreatePettyCash} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Fecha:</label>
                  <input
                    type="date"
                    required
                    value={pcDate}
                    onChange={(e) => setPcDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">N° Vale:</label>
                  <input
                    type="text"
                    required
                    value={pcVoucher}
                    onChange={(e) => setPcVoucher(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-amber-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Concepto:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Combustible de emergencia para secadora..."
                  value={pcConcept}
                  onChange={(e) => setPcConcept(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Responsable / Solicitante:</label>
                  <input
                    type="text"
                    placeholder="Nombre del solicitante"
                    value={pcResponsible}
                    onChange={(e) => setPcResponsible(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Monto en Dólares (USD):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={pcAmountUSD || ''}
                    onChange={(e) => setPcAmountUSD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Tipo de Registro:</label>
                  <select
                    value={pcType}
                    onChange={(e) => setPcType(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                  >
                    <option value="EGRESO">Egreso (Gasto Menor)</option>
                    <option value="REPOSICION">Reposición (Entrada a Caja)</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Documento Soporte:</label>
                  <input
                    type="text"
                    placeholder="Factura #0012 / Recibo"
                    value={pcReceiptRef}
                    onChange={(e) => setPcReceiptRef(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPettyCashModal(false)}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs"
                >
                  Guardar Vale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
