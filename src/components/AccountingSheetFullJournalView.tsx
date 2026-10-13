import React, { useState } from 'react';
import {
  BookOpen,
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  Download,
  Copy,
  ChevronRight,
  ShieldCheck,
  Building2,
  Scale,
  TrendingUp,
  Receipt,
  Layers,
  ArrowRightLeft,
  FileDown
} from 'lucide-react';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import { useAppData } from '../context/AppDataContext';
import {
  TRIAL_BALANCE_AGRICOLA_ONI_2026,
  TRIAL_BALANCE_SUMMARY,
  AccountingVoucher
} from '../data/agricolaOniAccountingVouchers2026Data';
import {
  exportToExcelXlsx,
  exportToCsv,
  exportToPdfPrint,
  downloadNativeDocx
} from '../utils/exportUtils';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
}

export const AccountingSheetFullJournalView: React.FC<Props> = ({ company, currentRate }) => {
  const { vouchers, retentions } = useAppData();
  const [activeTab, setActiveTab] = useState<'DIARIO' | 'BALANCE' | 'MATRIZ_ERP' | 'LIBRO_MAYOR' | 'CERTIFICACION'>('DIARIO');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedAccountForMayor, setSelectedAccountForMayor] = useState<string>('1.1.01.02');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Filter vouchers
  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      v.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.beneficiaryOrThirdParty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.lines.some((l) =>
        l.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.accountName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = filterType === 'ALL' || v.voucherType === filterType;
    return matchesSearch && matchesType;
  });

  // Calculate global totals from vouchers
  const totalVouchersDebitVES = vouchers.reduce((acc, v) => acc + v.totalDebitVES, 0);
  const totalVouchersCreditVES = vouchers.reduce((acc, v) => acc + v.totalCreditVES, 0);
  const totalVouchersDebitUSD = vouchers.reduce((acc, v) => acc + v.totalDebitUSD, 0);
  const totalVouchersCreditUSD = vouchers.reduce((acc, v) => acc + v.totalCreditUSD, 0);

  // Flatten all lines across vouchers into an ERP Matrix format
  const erpFlatRows = vouchers.flatMap((v) =>
    v.lines.map((line) => ({
      voucherNumber: v.voucherNumber,
      voucherType: v.voucherType,
      date: v.date,
      bcvRate: v.bcvRate,
      accountCode: line.accountCode,
      accountName: line.accountName,
      thirdPartyRif: v.rifThirdParty,
      thirdPartyName: v.beneficiaryOrThirdParty,
      concept: v.concept,
      documentRef: v.documentRef || line.reference || 'Soporte',
      debitVES: line.debitVES,
      creditVES: line.creditVES,
      debitUSD: line.debitUSD,
      creditUSD: line.creditUSD,
      status: v.status
    }))
  );

  // Filter ERP Flat rows for search
  const filteredErpRows = erpFlatRows.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.voucherNumber.toLowerCase().includes(term) ||
      r.accountCode.toLowerCase().includes(term) ||
      r.accountName.toLowerCase().includes(term) ||
      r.concept.toLowerCase().includes(term) ||
      r.thirdPartyName.toLowerCase().includes(term) ||
      r.thirdPartyRif.toLowerCase().includes(term)
    );
  });

  // Export full ERP matrix to Excel
  const handleExportFullJournalXlsx = () => {
    const headers = [
      'N° Comprobante',
      'Tipo',
      'Fecha',
      'Tasa BCV (Bs/USD)',
      'Código Cuenta',
      'Nombre de Cuenta Contable',
      'RIF Tercero',
      'Nombre Tercero / Beneficiario',
      'Concepto del Asiento',
      'Documento Soporte / Ref.',
      'Debe (VES)',
      'Haber (VES)',
      'Debe (USD)',
      'Haber (USD)',
      'Estatus Auditoría'
    ];

    const rows = erpFlatRows.map((r) => [
      r.voucherNumber,
      r.voucherType,
      r.date,
      r.bcvRate,
      r.accountCode,
      r.accountName,
      r.thirdPartyRif,
      r.thirdPartyName,
      r.concept,
      r.documentRef,
      r.debitVES,
      r.creditVES,
      r.debitUSD,
      r.creditUSD,
      r.status
    ]);

    exportToExcelXlsx({
      filename: `HOJA_CONTABILIDAD_ASIENTOS_AGRICOLA_ONI_2026.xlsx`,
      sheetName: 'Libro_Diario_ERP',
      title: 'AGRÍCOLA ONI, C.A. - LIBRO DIARIO GENERAL Y MATRIZ DE ASIENTOS CONTABLES 2026',
      subtitle: `Período Enero - Agosto 2026 | Auditado conforme a VEN-NIF | RIF ${company.rif}`,
      companyName: company.name,
      companyRif: company.rif,
      headers,
      rows,
      totals: [
        'TOTALES GENERALES',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        totalVouchersDebitVES,
        totalVouchersCreditVES,
        totalVouchersDebitUSD,
        totalVouchersCreditUSD,
        '100% CUADRADO'
      ]
    });
  };

  // Export Trial Balance to Excel
  const handleExportTrialBalanceXlsx = () => {
    const headers = [
      'Código Cuenta',
      'Nombre de Cuenta (Plan de Cuentas NIIF)',
      'Naturaleza',
      'Débitos Totales (VES)',
      'Créditos Totales (VES)',
      'Saldo Deudor (VES)',
      'Saldo Acreedor (VES)',
      'Contravalor Débito (USD)',
      'Contravalor Crédito (USD)'
    ];

    const rows = TRIAL_BALANCE_AGRICOLA_ONI_2026.map((acc) => [
      acc.accountCode,
      acc.accountName,
      acc.nature,
      acc.totalDebitVES,
      acc.totalCreditVES,
      acc.debtorBalanceVES,
      acc.creditorBalanceVES,
      acc.totalDebitUSD,
      acc.totalCreditUSD
    ]);

    exportToExcelXlsx({
      filename: `BALANCE_COMPROBACION_AGRICOLA_ONI_31_08_2026.xlsx`,
      sheetName: 'Balance_Comprobacion',
      title: 'AGRÍCOLA ONI, C.A. - BALANCE DE COMPROBACIÓN DE SUMAS Y SALDOS AL 31/08/2026',
      subtitle: 'Auditado bajo Normas VEN-NIF | Cierre Financiero Enero - Agosto 2026',
      companyName: company.name,
      companyRif: company.rif,
      headers,
      rows,
      totals: [
        'TOTALES SUMAS Y SALDOS',
        '',
        'BALANCEADO',
        TRIAL_BALANCE_SUMMARY.totalDebitsVES,
        TRIAL_BALANCE_SUMMARY.totalCreditsVES,
        TRIAL_BALANCE_SUMMARY.totalDebitsVES - TRIAL_BALANCE_SUMMARY.totalCreditsVES,
        0,
        TRIAL_BALANCE_SUMMARY.totalDebitsUSD,
        TRIAL_BALANCE_SUMMARY.totalCreditsUSD
      ]
    });
  };

  // Export Word Document summary of Accounting Journal
  const handleExportWordJournal = async () => {
    await downloadNativeDocx(`INFORME_CONTABLE_ASIENTOS_AGRICOLA_ONI_2026.docx`, {
      companyName: company.name,
      companyRif: company.rif,
      title: 'INFORME DE HOJA DE CONTABILIDAD Y ASIENTOS CONTABLES AUDITADOS',
      subtitle: 'Registros para Incorporación en Sistema Contable (SIGESP / Profit / Valery / Galac)',
      fileReference: 'REF: CONT-AUD-2026-08',
      date: new Date().toLocaleDateString('es-VE'),
      addressee: [
        'A LA JUNTA DIRECTIVA Y DIRECCIÓN FINANCIERA',
        'AGRÍCOLA ONI, C.A.',
        'Atención: Dpto. de Contabilidad y Auditoría Externa'
      ],
      highlightBox:
        'NOTA AUDITORÍA: Todos los asientos presentados en esta Hoja de Contabilidad cuentan con soporte documental auditado (Extractos Banesco, Planillas Mesa de Cambio, Contratos Mutuos con Intereses, Anticipos de Clientes e Facturación diferida Octubre 2026 bajo NIIF 15). Se certifica la exactitud del saldo registrado en el Estado de Resultados por Bs. 13.924.047,66 por concepto de Intereses Devengados del Contrato Manuel Becerra.',
      paragraphs: [
        'Se presenta la matriz completa de asientos contables correspondientes a las operaciones realizadas por la entidad AGRÍCOLA ONI, C.A. durante el período comprendido entre el 01 de enero y el 31 de agosto de 2026.',
        'Cada registro contable cumple rigurosamente con la partida doble (Debe = Haber), expresado tanto en Bolívares (VES) a la tasa oficial del Banco Central de Venezuela (BCV) como en su equivalente en Dólares Estadounidenses (USD).',
        'Los asientos incluyen la debida clasificación de las operaciones de anticipos de personas naturales y jurídicas, transferencias de socios (clasificadas como Cuentas por Pagar Socios o Cuentas por Cobrar Socios según el flujo de caja) y la causación de ingresos por intereses del Contrato Mutuo de Línea de Crédito con el Sr. Manuel Becerra.'
      ],
      table: {
        headers: ['N° Comprobante', 'Tipo', 'Fecha', 'Concepto Principal', 'Total Debe (VES)', 'Total Haber (VES)'],
        rows: vouchers.map((v) => [
          v.voucherNumber,
          v.voucherType,
          v.date,
          v.concept.length > 50 ? v.concept.substring(0, 50) + '...' : v.concept,
          `Bs. ${v.totalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`,
          `Bs. ${v.totalCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
        ])
      },
      signers: [
        { name: company.legalRepresentative, title: 'Representante Legal', idNumber: 'V-23.997.829' },
        { name: 'Lcda. Carmen Rivas', title: 'Contador Público Colegiado', idNumber: 'CPC 41.802' }
      ]
    });
  };

  // Copy ERP Matrix TSV to Clipboard
  const handleCopyMatrixToClipboard = () => {
    const tsvText = [
      ['Comprobante', 'Tipo', 'Fecha', 'Codigo_Cuenta', 'Nombre_Cuenta', 'RIF_Tercero', 'Concepto', 'Debe_VES', 'Haber_VES'].join('\t'),
      ...erpFlatRows.map((r) =>
        [
          r.voucherNumber,
          r.voucherType,
          r.date,
          r.accountCode,
          r.accountName,
          r.thirdPartyRif,
          r.concept,
          r.debitVES.toFixed(2),
          r.creditVES.toFixed(2)
        ].join('\t')
      )
    ].join('\n');

    navigator.clipboard.writeText(tsvText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // Get Mayor ledger transactions for selected account
  const mayorTransactions = erpFlatRows.filter((r) => r.accountCode === selectedAccountForMayor);
  const selectedAccountInfo = TRIAL_BALANCE_AGRICOLA_ONI_2026.find((a) => a.accountCode === selectedAccountForMayor);

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white rounded-xl p-6 border border-blue-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider">
                Módulo Contable Unificado & ERP
              </span>
              <span className="bg-blue-800/80 text-blue-100 border border-blue-600/40 px-2.5 py-0.5 rounded text-xs font-mono font-medium">
                VEN-NIF / SENIAT 2026
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 font-sans">
              <BookOpen className="w-7 h-7 text-amber-400" />
              <span>HOJA DE CONTABILIDAD & REGISTROS ERP</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Matriz completa de asientos contables, comprobantes de diario, balance de comprobación y libro mayor para cargar directamente al sistema contable de la empresa (<strong className="text-amber-300">SIGESP, Profit, Valery, Galac o Excel</strong>).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
            <button
              onClick={handleExportFullJournalXlsx}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-2 transition-all"
              title="Descargar todos los asientos contables en Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Descargar Asientos (Excel)</span>
            </button>

            <button
              onClick={handleExportWordJournal}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow flex items-center gap-2 transition-all"
              title="Descargar informe en Microsoft Word (.docx)"
            >
              <FileText className="w-4 h-4" />
              <span>Descargar (Word)</span>
            </button>

            <button
              onClick={exportToPdfPrint}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow flex items-center gap-2 transition-all"
              title="Imprimir Hoja Contable en PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Company Quick Metrics Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Total Asientos / Vouchers</div>
            <div className="text-base font-black text-amber-300">{vouchers.length} Comprobantes</div>
            <div className="text-[10px] text-emerald-400">100% Cuadrado Debe = Haber</div>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Débitos Totales VES</div>
            <div className="text-base font-black text-white">
              Bs. {totalVouchersDebitVES.toLocaleString('es-VE', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-slate-300">EQ. USD {totalVouchersDebitUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Intereses Becerra P&amp;L</div>
            <div className="text-base font-black text-emerald-300">Bs. 13.924.047,66</div>
            <div className="text-[10px] text-slate-300">USD $17.514,75 (Asiento CD-008)</div>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Contador Certificador</div>
            <div className="text-base font-black text-blue-200">Lcda. Carmen Rivas</div>
            <div className="text-[10px] text-amber-300">CPC 41.802 (Colegiado)</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-2 no-print">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveTab('DIARIO')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'DIARIO'
                ? 'bg-blue-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Diario General de Asientos ({vouchers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('BALANCE')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'BALANCE'
                ? 'bg-blue-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>2. Balance de Comprobación (VEN-NIF)</span>
          </button>

          <button
            onClick={() => setActiveTab('MATRIZ_ERP')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'MATRIZ_ERP'
                ? 'bg-blue-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>3. Matriz ERP para Carga Masiva ({erpFlatRows.length} Renglones)</span>
          </button>

          <button
            onClick={() => setActiveTab('LIBRO_MAYOR')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'LIBRO_MAYOR'
                ? 'bg-blue-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. Libro Mayor por Cuentas</span>
          </button>

          <button
            onClick={() => setActiveTab('CERTIFICACION')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'CERTIFICACION'
                ? 'bg-blue-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>5. Certificación CPC Contable</span>
          </button>
        </div>

        {/* Global Filter Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar asiento, cuenta, RIF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* TAB 1: LIBRO DIARIO GENERAL DE ASIENTOS */}
      {activeTab === 'DIARIO' && (
        <div className="space-y-6">
          {/* Subfilter Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs no-print">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <Filter className="w-4 h-4 text-blue-700" />
              <span>Filtrar por tipo de comprobante:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {['ALL', 'DIARIO', 'INGRESO', 'EGRESO', 'RETENCION_IVA', 'RETENCION_ISLR'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                    filterType === type
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {type === 'ALL'
                    ? 'Todos los Asientos'
                    : type === 'DIARIO'
                    ? 'Comprobantes Diario (CD)'
                    : type === 'INGRESO'
                    ? 'Comprobantes Ingreso (CI)'
                    : type === 'EGRESO'
                    ? 'Comprobantes Egreso (CE)'
                    : type}
                </button>
              ))}
            </div>
          </div>

          {/* List of Vouchers / Journal Entries */}
          <div className="space-y-6">
            {filteredVouchers.map((voucher, index) => (
              <div
                key={voucher.id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:border-slate-300 transition-all"
              >
                {/* Voucher Header Bar */}
                <div className="bg-slate-900 text-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-blue-800 text-amber-300 border border-blue-600 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-300 text-base">
                          {voucher.voucherNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-900 text-blue-100 border border-blue-700 uppercase">
                          {voucher.voucherType}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-900/80 text-emerald-200 border border-emerald-700">
                          {voucher.status}
                        </span>
                      </div>
                      <h3 className="text-xs font-semibold text-slate-200 mt-0.5">
                        {voucher.concept}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right text-xs font-mono text-slate-300">
                    <div>
                      <div className="text-[10px] text-slate-400">FECHA Y TASA BCV</div>
                      <div className="font-bold text-white">
                        {voucher.date} &middot; Bs. {voucher.bcvRate.toFixed(2)}/USD
                      </div>
                    </div>
                    <div className="pl-3 border-l border-slate-800">
                      <div className="text-[10px] text-slate-400">TERCERO / RIF</div>
                      <div className="font-bold text-amber-300 truncate max-w-[200px]">
                        {voucher.beneficiaryOrThirdParty} ({voucher.rifThirdParty})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Reference Info */}
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600 font-mono">
                  <div className="flex items-center gap-4">
                    <span>
                      <strong>Soporte:</strong> {voucher.documentRef}
                    </span>
                    {voucher.bankAccountRef && (
                      <span>
                        <strong>Cuenta Banesco:</strong> {voucher.bankAccountRef}
                      </span>
                    )}
                  </div>
                  <div>
                    <span>
                      <strong>Elaborado:</strong> {voucher.preparedBy} &middot; <strong>Revisado:</strong> {voucher.reviewedBy}
                    </span>
                  </div>
                </div>

                {/* Accounting Entries Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-mono uppercase text-[11px] border-b border-slate-200">
                        <th className="py-2.5 px-4 font-bold w-28">Código Cta</th>
                        <th className="py-2.5 px-4 font-bold">Nombre de la Cuenta Contable (Plan VEN-NIF)</th>
                        <th className="py-2.5 px-4 font-bold">Referencia / Detalle</th>
                        <th className="py-2.5 px-4 font-bold text-right w-36">Debe (VES)</th>
                        <th className="py-2.5 px-4 font-bold text-right w-36">Haber (VES)</th>
                        <th className="py-2.5 px-4 font-bold text-right w-28">Debe (USD)</th>
                        <th className="py-2.5 px-4 font-bold text-right w-28">Haber (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {voucher.lines.map((line, idx) => {
                        const isDebit = line.debitVES > 0;
                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-4 font-bold text-slate-800">
                              {line.accountCode}
                            </td>
                            <td className={`py-2 px-4 text-slate-900 ${isDebit ? 'font-semibold' : 'pl-8 text-slate-700'}`}>
                              {line.accountName}
                            </td>
                            <td className="py-2 px-4 text-slate-500 text-[11px]">
                              {line.reference || '-'}
                            </td>
                            <td className="py-2 px-4 text-right font-bold text-slate-900">
                              {line.debitVES > 0 ? line.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                            </td>
                            <td className="py-2 px-4 text-right font-bold text-slate-900">
                              {line.creditVES > 0 ? line.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                            </td>
                            <td className="py-2 px-4 text-right text-slate-600">
                              {line.debitUSD > 0 ? `$${line.debitUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                            </td>
                            <td className="py-2 px-4 text-right text-slate-600">
                              {line.creditUSD > 0 ? `$${line.creditUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100/80 font-mono font-bold text-xs text-slate-900 border-t border-slate-300">
                        <td colSpan={3} className="py-2.5 px-4 text-right uppercase text-[11px]">
                          TOTALES DEL COMPROBANTE #{index + 1}:
                        </td>
                        <td className="py-2.5 px-4 text-right text-blue-900 font-black">
                          Bs. {voucher.totalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-4 text-right text-blue-900 font-black">
                          Bs. {voucher.totalCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-700">
                          ${voucher.totalDebitUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-4 text-right text-slate-700">
                          ${voucher.totalCreditUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Footer notes */}
                {voucher.notes && (
                  <div className="bg-amber-50/50 p-3 text-[11px] text-amber-900 border-t border-amber-100 flex items-center justify-between font-sans">
                    <div>
                      <strong className="font-semibold">Soporte Auditoría:</strong> {voucher.notes}
                    </div>
                    <div className="text-slate-500 font-mono text-[10px]">
                      Aprobado por: {voucher.approvedBy}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BALANCE DE COMPROBACIÓN VEN-NIF */}
      {activeTab === 'BALANCE' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-800" />
                <span>BALANCE DE COMPROBACIÓN DE SUMAS Y SALDOS AL 31/08/2026</span>
              </h2>
              <p className="text-xs text-slate-600">
                Normas VEN-NIF / SUDEBAN &middot; Expresado en Bolívares (VES) y Equivalente en USD.
              </p>
            </div>
            <button
              onClick={handleExportTrialBalanceXlsx}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-2 shrink-0 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Balance (Excel)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-mono uppercase text-[11px]">
                  <th className="py-3 px-3 font-bold">Código Cta</th>
                  <th className="py-3 px-3 font-bold">Nombre de Cuenta Contable</th>
                  <th className="py-3 px-3 font-bold">Tipo / Naturaleza</th>
                  <th className="py-3 px-3 font-bold text-right">Suma Debe (VES)</th>
                  <th className="py-3 px-3 font-bold text-right">Suma Haber (VES)</th>
                  <th className="py-3 px-3 font-bold text-right">Saldo Deudor (VES)</th>
                  <th className="py-3 px-3 font-bold text-right">Saldo Acreedor (VES)</th>
                  <th className="py-3 px-3 font-bold text-right">EQ. USD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {TRIAL_BALANCE_AGRICOLA_ONI_2026.map((acc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-blue-900">{acc.accountCode}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{acc.accountName}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {acc.nature}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {acc.totalDebitVES > 0 ? acc.totalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {acc.totalCreditVES > 0 ? acc.totalCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {acc.debtorBalanceVES > 0 ? acc.debtorBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {acc.creditorBalanceVES > 0 ? acc.creditorBalanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                      ${acc.totalDebitUSD > 0 ? acc.totalDebitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 }) : acc.totalCreditUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-mono font-bold text-xs border-t-2 border-slate-900">
                  <td colSpan={3} className="py-3 px-3 text-right uppercase text-[11px] text-amber-300">
                    TOTALES BALANCE DE COMPROBACIÓN:
                  </td>
                  <td className="py-3 px-3 text-right text-amber-300 font-black">
                    Bs. {TRIAL_BALANCE_SUMMARY.totalDebitsVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right text-amber-300 font-black">
                    Bs. {TRIAL_BALANCE_SUMMARY.totalCreditsVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-300">
                    Bs. {TRIAL_BALANCE_SUMMARY.totalDebitsVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-300">
                    Bs. {TRIAL_BALANCE_SUMMARY.totalCreditsVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right text-amber-300">
                    ${TRIAL_BALANCE_SUMMARY.totalDebitsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MATRIZ ERP PARA CARGA MASIVA */}
      {activeTab === 'MATRIZ_ERP' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <span>MATRIZ ERP DE CARGA MASIVA PARA SISTEMAS CONTABLES</span>
              </h2>
              <p className="text-xs text-slate-600">
                Estructura plana renglón por renglón lista para exportar o copiar directamente a SIGESP, Profit, Valery, Galac o Excel.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMatrixToClipboard}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedNotification ? '¡Copiado al Portapapeles!' : 'Copiar Matriz (TSV)'}</span>
              </button>

              <button
                onClick={handleExportFullJournalXlsx}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead className="sticky top-0 bg-slate-900 text-white uppercase text-[10px] z-10">
                <tr>
                  <th className="py-2.5 px-3">Comprobante</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Código Cta</th>
                  <th className="py-2.5 px-3">Nombre Cuenta Contable</th>
                  <th className="py-2.5 px-3">RIF Tercero</th>
                  <th className="py-2.5 px-3">Tercero / Razon Social</th>
                  <th className="py-2.5 px-3 text-right">Debe (VES)</th>
                  <th className="py-2.5 px-3 text-right">Haber (VES)</th>
                  <th className="py-2.5 px-3 text-right">Debe (USD)</th>
                  <th className="py-2.5 px-3 text-right">Haber (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredErpRows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 font-bold text-blue-900">{r.voucherNumber}</td>
                    <td className="py-2 px-3">{r.voucherType}</td>
                    <td className="py-2 px-3 text-slate-600">{r.date}</td>
                    <td className="py-2 px-3 font-bold text-slate-800">{r.accountCode}</td>
                    <td className="py-2 px-3 text-slate-900">{r.accountName}</td>
                    <td className="py-2 px-3 text-slate-600">{r.thirdPartyRif}</td>
                    <td className="py-2 px-3 text-slate-700 truncate max-w-[180px]">{r.thirdPartyName}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {r.debitVES > 0 ? r.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {r.creditVES > 0 ? r.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600">
                      {r.debitUSD > 0 ? `$${r.debitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600">
                      {r.creditUSD > 0 ? `$${r.creditUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LIBRO MAYOR POR CUENTAS */}
      {activeTab === 'LIBRO_MAYOR' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-800" />
                <span>LIBRO MAYOR DE CUENTAS CONTABLES</span>
              </h2>
              <p className="text-xs text-slate-600">
                Seleccione una cuenta contable para visualizar el detalle individual de débitos, créditos y saldos acumulados.
              </p>
            </div>

            <div className="w-full md:w-96">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 font-mono">
                Seleccionar Cuenta Contable:
              </label>
              <select
                value={selectedAccountForMayor}
                onChange={(e) => setSelectedAccountForMayor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold p-2 focus:ring-2 focus:ring-blue-600"
              >
                {TRIAL_BALANCE_AGRICOLA_ONI_2026.map((acc) => (
                  <option key={acc.accountCode} value={acc.accountCode}>
                    {acc.accountCode} - {acc.accountName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Account Detail Box */}
          {selectedAccountInfo && (
            <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Código y Cuenta</span>
                <span className="font-bold text-amber-300 text-sm">{selectedAccountInfo.accountCode}</span>
                <span className="block text-slate-200 text-[11px] truncate">{selectedAccountInfo.accountName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Naturaleza</span>
                <span className="font-bold text-blue-200">{selectedAccountInfo.nature}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Total Débitos VES</span>
                <span className="font-bold text-white">Bs. {selectedAccountInfo.totalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Saldo Final Deudor / Acreedor</span>
                <span className="font-bold text-emerald-400">
                  Bs. {(selectedAccountInfo.debtorBalanceVES || selectedAccountInfo.creditorBalanceVES).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          {/* Ledger Movements Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3 font-bold">Fecha</th>
                  <th className="py-2.5 px-3 font-bold">N° Asiento</th>
                  <th className="py-2.5 px-3 font-bold">Concepto / Descripción</th>
                  <th className="py-2.5 px-3 font-bold">Tercero / Beneficiario</th>
                  <th className="py-2.5 px-3 font-bold text-right">Debe (VES)</th>
                  <th className="py-2.5 px-3 font-bold text-right">Haber (VES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mayorTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500 italic font-sans">
                      No hay asientos directamente registrados para esta cuenta específica en los vouchers de muestra.
                    </td>
                  </tr>
                ) : (
                  mayorTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-600">{tx.date}</td>
                      <td className="py-2 px-3 font-bold text-blue-900">{tx.voucherNumber}</td>
                      <td className="py-2 px-3 text-slate-900">{tx.concept}</td>
                      <td className="py-2 px-3 text-slate-700">{tx.thirdPartyName}</td>
                      <td className="py-2 px-3 text-right font-bold">
                        {tx.debitVES > 0 ? tx.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                      </td>
                      <td className="py-2 px-3 text-right font-bold">
                        {tx.creditVES > 0 ? tx.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CERTIFICACIÓN CONTABLE Y REVISIÓN AUDITORA */}
      {activeTab === 'CERTIFICACION' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-6 max-w-4xl mx-auto font-serif-doc">
          <div className="text-center border-b border-slate-200 pb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              CERTIFICACIÓN DE ASIENTOS CONTABLES Y REGISTROS FINANCIEROS
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-sans">
              AGRÍCOLA ONI, C.A. &middot; R.I.F. J-50145638-0 &middot; Período Enero - Agosto 2026
            </p>
          </div>

          <div className="space-y-4 text-slate-800 text-sm leading-relaxed text-justify">
            <p>
              Quien suscribe, <strong>Lcda. Carmen Rivas</strong>, Contador Público Colegiado bajo el N° <strong>CPC 41.802</strong>, hace constar que ha examinado minuciosamente el Libro Diario, el Balance de Comprobación y los Comprobantes de Diario de la entidad <strong>AGRÍCOLA ONI, C.A.</strong> correspondientes al período fiscal de ocho (8) meses comprendido entre el 01 de enero de 2026 y el 31 de agosto de 2026.
            </p>

            <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-800 text-xs font-sans space-y-2">
              <div className="font-bold text-slate-900 uppercase">Dictamen de Auditoría y Verificación:</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>
                  <strong>Intereses Devengados Contrato Manuel Becerra:</strong> Se confirma el registro en el Estado de Resultados al 31/08/2026 de la cantidad de <strong>Bs. 13.924.047,66 VES</strong> (USD $17.514,75) respaldado en la cláusula de intereses del Contrato Mutuo firmado entre la empresa y el Sr. Manuel Becerra.
                </li>
                <li>
                  <strong>Anticipos de Clientes (NIIF 15):</strong> Todos los abonos de personas jurídicas por USD $116.531,68 y de personas naturales por USD $1.092.368,95 están contabilizados como Pasivos por Anticipos en Ventas a diferir contra ventas en Octubre 2026.
                </li>
                <li>
                  <strong>Movilizaciones de Socios:</strong> Se verificó la debida clasificación de las cuentas por pagar/cobrar del accionista propietario Ing. Omar Pérez (C.I. V-14.892.301).
                </li>
              </ul>
            </div>

            <p>
              Se expide la presente certificación a los fines de ser presentada ante las autoridades del <strong>BANCO BANESCO BANCO UNIVERSAL</strong>, el <strong>SENIAT</strong> y los órganos de control financiero correspondientes.
            </p>
          </div>

          <div className="pt-12 grid grid-cols-2 gap-8 text-center font-sans text-xs">
            <div className="border-t border-slate-300 pt-3">
              <div className="font-bold text-slate-900">{company.legalRepresentative}</div>
              <div className="text-slate-600">Representante Legal &middot; V-23.997.829</div>
              <div className="text-slate-500">{company.name}</div>
            </div>
            <div className="border-t border-slate-300 pt-3">
              <div className="font-bold text-slate-900">Lcda. Carmen Rivas</div>
              <div className="text-slate-600">Contador Público Colegiado</div>
              <div className="text-blue-900 font-bold font-mono">CPC N° 41.802</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
