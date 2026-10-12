import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Printer,
  CheckCircle,
  Search,
  Filter,
  Eye,
  ChevronRight,
  X,
  AlertTriangle,
  Trash2,
  Scale,
  DollarSign,
  FileDown,
  Download
} from 'lucide-react';
import { exportToWord, exportToCsv, exportToPdfPrint, exportHtmlToPdf } from '../utils/exportUtils';
import {
  AccountingVoucher,
  RetentionVoucherSummary,
  TRIAL_BALANCE_AGRICOLA_ONI_2026,
  TRIAL_BALANCE_SUMMARY
} from '../data/agricolaOniAccountingVouchers2026Data';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import { useAppData } from '../context/AppDataContext';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
}

export const AgricolaOniAccountingAndVouchersSuiteView: React.FC<Props> = ({ company, currentRate }) => {
  const { vouchers, retentions, addVoucher, deleteVoucher } = useAppData();
  const [selectedVoucher, setSelectedVoucher] = useState<AccountingVoucher | null>(vouchers[0] || null);
  const [activeTab, setActiveTab] = useState<'TRIAL_BALANCE' | 'ENTRIES' | 'RETENTIONS'>('TRIAL_BALANCE');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Modal to add new real voucher
  const [showAddModal, setShowAddModal] = useState(false);
  const [voucherNumber, setVoucherNumber] = useState(`CD-2026-${String(vouchers.length + 1).padStart(3, '0')}`);
  const [voucherType, setVoucherType] = useState<'DIARIO' | 'EGRESO' | 'INGRESO'>('DIARIO');
  const [date, setDate] = useState('2026-08-31');
  const [concept, setConcept] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [rifThirdParty, setRifThirdParty] = useState('');
  const [documentRef, setDocumentRef] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [amountVES, setAmountVES] = useState<number>(0);
  const [accountDebit, setAccountDebit] = useState('1.1.03.01.002 - Inventario Café Pergamino');
  const [accountCredit, setAccountCredit] = useState('1.1.01.01.001 - Banco Banesco Cuenta Corriente VES');

  // Filtered entries
  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      v.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.beneficiaryOrThirdParty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || v.voucherType === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept || amountVES <= 0) return;

    const rate = currentRate.rateUsd;
    const amountUSD = amountVES / rate;

    const newVoucher: AccountingVoucher = {
      id: `vch-${Date.now()}`,
      voucherNumber,
      voucherType,
      date,
      bcvRate: rate,
      concept,
      beneficiaryOrThirdParty: beneficiary || company.name,
      rifThirdParty: rifThirdParty || company.rif,
      documentRef: documentRef || 'Soporte Interno',
      bankAccountRef: bankRef || company.banescoAccountVES,
      approvedBy: company.legalRepresentative,
      reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
      preparedBy: 'Administración Contable',
      status: 'CONFIRMADO',
      lines: [
        {
          accountCode: accountDebit.split(' - ')[0] || '1.1.03.01',
          accountName: accountDebit.split(' - ')[1] || 'Cuenta de Débito',
          reference: documentRef || 'Asiento real',
          debitVES: amountVES,
          creditVES: 0,
          debitUSD: amountUSD,
          creditUSD: 0
        },
        {
          accountCode: accountCredit.split(' - ')[0] || '1.1.01.01',
          accountName: accountCredit.split(' - ')[1] || 'Cuenta de Crédito',
          reference: bankRef || 'Asiento real',
          debitVES: 0,
          creditVES: amountVES,
          debitUSD: 0,
          creditUSD: amountUSD
        }
      ],
      totalDebitVES: amountVES,
      totalCreditVES: amountVES,
      totalDebitUSD: amountUSD,
      totalCreditUSD: amountUSD,
      notes: 'Asiento contable real registrado.'
    };

    addVoucher(newVoucher);
    setSelectedVoucher(newVoucher);
    setShowAddModal(false);
    // Reset form
    setConcept('');
    setAmountVES(0);
    setDocumentRef('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Contabilidad General Agrícola Oni, C.A. (Enero a Agosto 2026)
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Balance de Comprobación VEN-NIF &middot; R.I.F. J-50145638-0 &middot; 46 Comprobantes Banesco Cuadrados
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const rowsHtml = TRIAL_BALANCE_AGRICOLA_ONI_2026.map(row => `
                <tr>
                  <td style="font-family:monospace">${row.accountCode}</td>
                  <td><strong>${row.accountName}</strong></td>
                  <td>${row.nature}</td>
                  <td class="num">${row.totalDebitVES > 0 ? row.totalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}</td>
                  <td class="num">${row.totalCreditVES > 0 ? row.totalCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}</td>
                  <td class="num" style="font-weight:bold;color:#059669">${row.debtorBalanceVES > 0 ? row.debtorBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}</td>
                  <td class="num" style="font-weight:bold;color:#d97706">${row.creditorBalanceVES > 0 ? row.creditorBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}</td>
                  <td class="num" style="color:#2563eb">$${row.totalDebitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td class="num" style="color:#2563eb">$${row.totalCreditUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('');

              const htmlContent = `
                <h1>${company.name} &mdash; RIF ${company.rif}</h1>
                <h2>BALANCE DE COMPROBACIÓN DE SUMAS Y SALDOS (VEN-NIF) &ndash; CORTE AL 31 DE AGOSTO DE 2026</h2>
                <div class="highlight-box">
                  Total Débitos Acumulados: <strong>Bs. ${TRIAL_BALANCE_SUMMARY.totalDebitsVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> ($${TRIAL_BALANCE_SUMMARY.totalDebitsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)<br>
                  Total Créditos Acumulados: <strong>Bs. ${TRIAL_BALANCE_SUMMARY.totalCreditsVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> ($${TRIAL_BALANCE_SUMMARY.totalCreditsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)<br>
                  Diferencia Contable: <strong>Bs. ${(TRIAL_BALANCE_SUMMARY.totalDebitsVES - TRIAL_BALANCE_SUMMARY.totalCreditsVES).toFixed(2)} (CUADRE PERFECTO AL CÉNTIMO)</strong>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Cuenta Contable</th>
                      <th>Naturaleza</th>
                      <th class="num">Total Débitos (Bs)</th>
                      <th class="num">Total Créditos (Bs)</th>
                      <th class="num">Saldo Deudor (Bs)</th>
                      <th class="num">Saldo Acreedor (Bs)</th>
                      <th class="num">Débitos USD</th>
                      <th class="num">Créditos USD</th>
                    </tr>
                  </thead>
                  <tbody>${rowsHtml}</tbody>
                </table>
              `;

              exportToWord('Balance_Comprobacion_2026_Agricola_Oni.doc', 'Balance de Comprobación VEN-NIF 2026', htmlContent);
            }}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
            title="Exportar Balance de Comprobación a Word (.doc)"
          >
            <FileDown className="w-3.5 h-3.5" />
            Word (.doc)
          </button>
          <button
            onClick={() => {
              const headers = ['Codigo', 'Cuenta', 'Naturaleza', 'Total_Debitos_Bs', 'Total_Creditos_Bs', 'Saldo_Deudor_Bs', 'Saldo_Acreedor_Bs', 'Debitos_USD', 'Creditos_USD'];
              const rows = TRIAL_BALANCE_AGRICOLA_ONI_2026.map(r => [
                r.accountCode,
                r.accountName,
                r.nature,
                r.totalDebitVES,
                r.totalCreditVES,
                r.debtorBalanceVES,
                r.creditorBalanceVES,
                r.totalDebitUSD,
                r.totalCreditUSD
              ]);
              exportToCsv('Balance_Comprobacion_VEN_NIF_2026.csv', headers, rows);
            }}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
            title="Exportar Balance de Comprobación a Excel (CSV)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel (CSV)
          </button>
          <button
            onClick={async () => {
              const rowsHtml = TRIAL_BALANCE_AGRICOLA_ONI_2026.map(r => `
                <tr>
                  <td>${r.accountCode}</td>
                  <td>${r.accountName}</td>
                  <td>${r.nature}</td>
                  <td class="num">${r.totalDebitVES > 0 ? `Bs. ${r.totalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
                  <td class="num">${r.totalCreditVES > 0 ? `Bs. ${r.totalCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
                  <td class="num">${r.debtorBalanceVES > 0 ? `Bs. ${r.debtorBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
                  <td class="num">${r.creditorBalanceVES > 0 ? `Bs. ${r.creditorBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
                </tr>
              `).join('');

              const htmlContent = `
                <h1>${company.name}</h1>
                <p><strong>RIF:</strong> ${company.rif} &middot; R.N.C.: 010049247</p>
                <h2>BALANCE DE COMPROBACIÓN AUDITADO VEN-NIF (CORTE 2026)</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Cuenta Contable</th>
                      <th>Naturaleza</th>
                      <th class="num">Débito Bs</th>
                      <th class="num">Crédito Bs</th>
                      <th class="num">Saldo Deudor</th>
                      <th class="num">Saldo Acreedor</th>
                    </tr>
                  </thead>
                  <tbody>${rowsHtml}</tbody>
                </table>
              `;
              await exportHtmlToPdf('Balance_Comprobacion_VEN_NIF_2026_Agricola_Oni.pdf', 'Balance de Comprobación VEN-NIF 2026', htmlContent);
            }}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar Balance de Comprobación en PDF directo"
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
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo Comprobante
          </button>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800">
            <button
              onClick={() => setActiveTab('TRIAL_BALANCE')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'TRIAL_BALANCE'
                  ? 'bg-stone-800 text-amber-400 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Balance de Sumas y Saldos (VEN-NIF)
            </button>
            <button
              onClick={() => setActiveTab('ENTRIES')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'ENTRIES'
                  ? 'bg-stone-800 text-amber-400 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Libro Diario & Comprobantes ({vouchers.length})
            </button>
            <button
              onClick={() => setActiveTab('RETENTIONS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'RETENTIONS'
                  ? 'bg-stone-800 text-amber-400 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Retenciones SENIAT ({retentions.length})
            </button>
          </div>
        </div>
      </div>

      {/* 1. TAB: BALANCE DE COMPROBACIÓN DE SUMAS Y SALDOS */}
      {activeTab === 'TRIAL_BALANCE' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-5 bg-stone-950 border-b border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-amber-400 font-mono font-bold uppercase tracking-wider">
                  AGRÍCOLA ONI, C.A. (RIF J-50145638-0) &middot; EJERCICIO FISCAL 2026
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                  1. BALANCE DE COMPROBACIÓN DE SUMAS Y SALDOS AL 31/08/2026 (VEN-NIF)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir Balance
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-300 font-mono-num">
                <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="px-4 py-3">Código Cuenta</th>
                    <th className="px-4 py-3 font-sans">Denominación de la Cuenta Contable (VEN-NIF)</th>
                    <th className="px-3 py-3 font-sans text-center">Naturaleza</th>
                    <th className="px-4 py-3 text-right">Total Debe (Bs.)</th>
                    <th className="px-4 py-3 text-right">Total Haber (Bs.)</th>
                    <th className="px-4 py-3 text-right font-bold text-sky-400">Saldo Deudor (Bs.)</th>
                    <th className="px-4 py-3 text-right font-bold text-amber-400">Saldo Acreedor (Bs.)</th>
                    <th className="px-4 py-3 text-right text-stone-400">Debe (USD)</th>
                    <th className="px-4 py-3 text-right text-stone-400">Haber (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/70">
                  {TRIAL_BALANCE_AGRICOLA_ONI_2026.map((acc) => (
                    <tr key={acc.accountCode} className="hover:bg-stone-800/30 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-stone-200">{acc.accountCode}</td>
                      <td className="px-4 py-2.5 font-sans font-medium text-stone-100 max-w-xs">{acc.accountName}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          acc.nature === 'ACTIVO'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : acc.nature === 'PASIVO'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {acc.nature}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-stone-300">
                        {acc.totalDebitVES > 0 ? acc.totalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '0'}
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-stone-300">
                        {acc.totalCreditVES > 0 ? acc.totalCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '0'}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-sky-300">
                        {acc.debtorBalanceVES > 0 ? acc.debtorBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '0'}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-amber-300">
                        {acc.creditorBalanceVES > 0 ? acc.creditorBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '0'}
                      </td>
                      <td className="px-4 py-2.5 text-right text-stone-400">
                        ${acc.totalDebitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-right text-stone-400">
                        ${acc.totalCreditUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-stone-950 font-bold border-t-2 border-amber-600/80 text-white text-xs">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 font-sans uppercase text-amber-400">
                      TOTALES CUADRADOS DE COMPROBACIÓN:
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-400">
                      Bs. {TRIAL_BALANCE_SUMMARY.totalDebitsVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-400">
                      Bs. {TRIAL_BALANCE_SUMMARY.totalCreditsVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan={2} className="px-4 py-3 text-center text-amber-300 font-sans">
                      DIFERENCIA: Bs. 0,00 (100% CUADRADO)
                    </td>
                    <td className="px-4 py-3 text-right text-stone-300">
                      ${TRIAL_BALANCE_SUMMARY.totalDebitsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-300">
                      ${TRIAL_BALANCE_SUMMARY.totalCreditsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Accounting Signature Footnote */}
            <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-400 gap-2">
              <div>
                <span>Auditor Responsable: </span>
                <strong className="text-stone-200">{TRIAL_BALANCE_SUMMARY.auditor}</strong>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Normas VEN-NIF PYME Aplicadas y Conciliadas con Banesco Banco Universal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: LIBRO DIARIO Y EXPEDIENTE DE COMPROBANTES */}
      {activeTab === 'ENTRIES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Voucher List */}
          <div className="lg:col-span-5 space-y-3">
            {/* Search and Filters */}
            <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 p-2.5 rounded-lg">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar comprobante, cliente o ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-stone-950 border border-stone-700 text-stone-300 text-[11px] rounded px-2 py-1"
              >
                <option value="ALL">Todos ({vouchers.length})</option>
                <option value="INGRESO">Ingreso (Anticipos)</option>
                <option value="EGRESO">Egreso (Pagos/Compras)</option>
                <option value="DIARIO">Diario (Traspasos)</option>
              </select>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredVouchers.map((v) => {
                const isSelected = selectedVoucher?.id === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVoucher(v)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all relative group ${
                      isSelected
                        ? 'bg-stone-800 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-stone-900/80 border-stone-800 hover:bg-stone-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-amber-400">{v.voucherNumber}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400 font-mono-num text-[11px]">{v.date}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          v.voucherType === 'INGRESO'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : v.voucherType === 'EGRESO'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}>
                          {v.voucherType}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-stone-200 font-medium line-clamp-2">
                      {v.concept}
                    </div>
                    <div className="mt-2 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] font-mono-num">
                      <span className="text-stone-400 truncate max-w-[200px]">{v.beneficiaryOrThirdParty}</span>
                      <span className="font-bold text-emerald-400">
                        Bs. {v.totalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Voucher Details (Printable preview) */}
          <div className="lg:col-span-7">
            {selectedVoucher ? (
              <div className="bg-white text-stone-900 rounded-xl p-6 sm:p-8 shadow-xl border border-stone-200">
                {/* Header */}
                <div className="border-b-2 border-stone-800 pb-4 mb-5 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold font-serif-doc text-lg text-stone-950">AGRÍCOLA ONI, C.A.</h3>
                    <p className="text-[10px] text-stone-600 font-mono">RIF: J-50145638-0 &middot; Carretera Nacional Chabasquén - Biscucuy, Km 4</p>
                    <span className="inline-block mt-2 px-2.5 py-1 rounded bg-stone-100 border border-stone-300 text-[11px] font-bold font-mono text-stone-800">
                      COMPROBANTE DE {selectedVoucher.voucherType}: {selectedVoucher.voucherNumber}
                    </span>
                  </div>

                  <div className="text-right font-mono-num text-xs">
                    <p className="text-stone-500">Fecha de Emisión:</p>
                    <p className="font-bold text-stone-900 text-sm">{selectedVoucher.date}</p>
                    <p className="text-[10px] text-stone-500 mt-1">Cta: 0134-0342-18-3421089912</p>
                  </div>
                </div>

                {/* Concept and Third Party */}
                <div className="bg-stone-50 rounded-lg p-3.5 border border-stone-200 text-xs mb-5 space-y-1.5">
                  <div>
                    <span className="font-bold text-stone-700">Tercero / Cliente: </span>
                    <span className="text-stone-900 font-semibold">{selectedVoucher.beneficiaryOrThirdParty}</span>
                    <span className="text-stone-500 font-mono ml-2">({selectedVoucher.rifThirdParty})</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-700">Concepto / Explicación: </span>
                    <span className="text-stone-800">{selectedVoucher.concept}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-700">Documento / Referencia: </span>
                    <span className="text-stone-600 font-mono">{selectedVoucher.documentRef}</span>
                  </div>
                </div>

                {/* Journal Lines Table */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-xs text-left font-mono-num">
                    <thead className="bg-stone-100 text-stone-700 uppercase text-[10px] border-b border-stone-300">
                      <tr>
                        <th className="px-3 py-2">Código Cta.</th>
                        <th className="px-3 py-2 font-sans">Cuenta Contable</th>
                        <th className="px-3 py-2 text-right">Debe (Bs.)</th>
                        <th className="px-3 py-2 text-right">Haber (Bs.)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {selectedVoucher.lines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-stone-50">
                          <td className="px-3 py-2 text-stone-600 font-mono">{line.accountCode}</td>
                          <td className="px-3 py-2 font-sans">
                            <span className="font-medium text-stone-900 block">{line.accountName}</span>
                            <span className="text-[10px] text-stone-500">{line.reference}</span>
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-stone-900">
                            {line.debitVES > 0 ? line.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-stone-900">
                            {line.creditVES > 0 ? line.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-amber-50 font-bold border-t-2 border-stone-800 text-stone-950 text-xs">
                      <tr>
                        <td colSpan={2} className="px-3 py-2 font-sans uppercase">Totales Cuadrados:</td>
                        <td className="px-3 py-2 text-right">Bs. {selectedVoucher.totalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                        <td className="px-3 py-2 text-right">Bs. {selectedVoucher.totalCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-3 gap-4 text-center text-[10px] pt-4 border-t border-stone-300">
                  <div>
                    <div className="border-t border-stone-700 pt-1 mt-6">
                      <p className="font-bold text-stone-900">{selectedVoucher.preparedBy}</p>
                      <p className="text-stone-500">Preparado por</p>
                    </div>
                  </div>
                  <div>
                    <div className="border-t border-stone-700 pt-1 mt-6">
                      <p className="font-bold text-stone-900">{selectedVoucher.reviewedBy}</p>
                      <p className="text-stone-500">Revisado por (CPC)</p>
                    </div>
                  </div>
                  <div>
                    <div className="border-t border-stone-700 pt-1 mt-6">
                      <p className="font-bold text-stone-900">{selectedVoucher.approvedBy}</p>
                      <p className="text-stone-500">Aprobado por</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex justify-between items-center text-xs">
                  <span className="text-stone-400 text-[10px] font-mono">Control Interno VEN-NIF PYME &middot; Banesco Universal</span>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Imprimir Comprobante
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-12 text-center text-stone-400 text-xs">
                Seleccione un comprobante para visualizar los detalles
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB: RETENCIONES SENIAT */}
      {activeTab === 'RETENTIONS' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Comprobantes de Retención de ISLR e IVA (SENIAT) &middot; Enero a Agosto 2026
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Retención de ISLR 3% Fletes de Carga Pesada (Cód. 053 Decreto 1.808) &middot; Base Bs. 45.495.000,00
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-stone-300 font-mono-num">
              <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                <tr>
                  <th className="px-4 py-3">N° Comprobante SENIAT</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3 font-sans">Proveedor Sujeto a Retención</th>
                  <th className="px-4 py-3">RIF</th>
                  <th className="px-4 py-3">Factura Afectada</th>
                  <th className="px-4 py-3 text-right">Base Imponible (VES)</th>
                  <th className="px-4 py-3 text-right">% Ret.</th>
                  <th className="px-4 py-3 text-right font-bold text-emerald-400">Monto Retenido (VES)</th>
                  <th className="px-4 py-3 text-right">Ref. USD</th>
                  <th className="px-4 py-3 font-sans text-center">Estatus Portal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {retentions.map((ret) => (
                  <tr key={ret.id} className="hover:bg-stone-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-amber-400">{ret.correlative}</td>
                    <td className="px-4 py-3 text-stone-400">{ret.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {ret.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-stone-100 font-medium">{ret.supplier}</td>
                    <td className="px-4 py-3 text-stone-400 font-mono">{ret.rif}</td>
                    <td className="px-4 py-3 text-stone-300 font-mono">{ret.invoiceNumber}</td>
                    <td className="px-4 py-3 text-right text-stone-300">
                      Bs. {(ret.taxableBaseVES || ret.baseAmountVES || 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-amber-400">{ret.retentionRate}%</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400">
                      Bs. {ret.retainedAmountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-400">
                      ${ret.retainedAmountUSD.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800">
                        <CheckCircle className="w-3 h-3" />
                        {ret.seniatStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
