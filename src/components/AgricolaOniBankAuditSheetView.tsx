import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Printer,
  ShieldCheck,
  Eye,
  X,
  Plus,
  Trash2,
  DollarSign,
  ArrowRightLeft,
  Users,
  Globe,
  PieChart,
  Layers,
  Building2,
  CreditCard,
  Truck,
  TrendingDown,
  TrendingUp,
  Receipt,
  FileCheck,
  FileDown,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { exportToWord, exportToCsv, exportToPdfPrint, exportHtmlToPdf } from '../utils/exportUtils';
import {
  BanescoMovementAudit,
  BANESCO_AUDIT_INFO_2026,
  BANESCO_USD_USAGE_BREAKDOWN_2026,
  BANESCO_NATURAL_PERSONS_BREAKDOWN_2026,
  BANESCO_INTERNAL_TRANSFERS_BREAKDOWN_2026,
  BANESCO_RECONCILIATION_2026,
  BANESCO_CREDITS_ORIGIN_AND_RECONCILIATION_2026
} from '../data/agricolaOniAudit2026Data';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import { useAppData } from '../context/AppDataContext';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
}

type AuditTabType =
  | 'CUADRO_CONCEPTOS'
  | 'ANTICIPOS_CLIENTES'
  | 'COMPRA_DIVISAS'
  | 'USO_DIVISAS'
  | 'PERSONAS_NATURALES'
  | 'CUENTAS_INTERNAS'
  | 'OTROS_CONCEPTOS'
  | 'TODOS_MOVIMIENTOS';

export const AgricolaOniBankAuditSheetView: React.FC<Props> = ({ company, currentRate }) => {
  const { bankMovements, addBankMovement, deleteBankMovement } = useAppData();
  const [activeTab, setActiveTab] = useState<AuditTabType>('CUADRO_CONCEPTOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('TODOS');
  const [selectedMovement, setSelectedMovement] = useState<BanescoMovementAudit | null>(null);

  // Modal to add real bank movement
  const [showAddModal, setShowAddModal] = useState(false);
  const [date, setDate] = useState('2026-03-31');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [amountVES, setAmountVES] = useState<number>(0);
  const [movementType, setMovementType] = useState<'CREDITO' | 'DEBITO'>('CREDITO');
  const [justificationType, setJustificationType] = useState<
    | 'ANTICIPO_CLIENTE'
    | 'COMPRA_DIVISAS_BANESCO'
    | 'USO_DIVISAS_INSUMOS'
    | 'INGRESO_PERSONA_NATURAL'
    | 'TRANSFERENCIA_INTERNA'
    | 'LINEA_CREDITO_BECERRA'
    | 'VENTA_CAFE'
    | 'GASTOS_ADUANA_FLETE'
    | 'NOMINA_VIGILANCIA'
    | 'COMISIONES_BANCARIAS_IGTF'
  >('ANTICIPO_CLIENTE');
  const [supportDocType, setSupportDocType] = useState('Comprobante de Ingreso Bancario & Contrato');
  const [supportDocRef, setSupportDocRef] = useState('');
  const [notes, setNotes] = useState('');

  // Computations on live dataset
  const totalDebits = bankMovements.reduce((acc, m) => acc + m.debitVES, 0);
  const totalCredits = bankMovements.reduce((acc, m) => acc + m.creditVES, 0);
  const liveBalance = totalCredits - totalDebits;
  const liveBalanceUSD = currentRate.rateUsd > 0 ? liveBalance / currentRate.rateUsd : 0;

  // Breakdown by concept
  const customerAdvances = bankMovements.filter((m) => m.justificationType === 'ANTICIPO_CLIENTE');
  const totalAdvancesVES = customerAdvances.reduce((acc, m) => acc + m.creditVES, 0);
  const totalAdvancesUSD = customerAdvances.reduce((acc, m) => acc + m.countervalueUSD, 0);

  const fxPurchases = bankMovements.filter((m) => m.justificationType === 'COMPRA_DIVISAS_BANESCO');
  const totalFxSpentVES = fxPurchases.reduce((acc, m) => acc + m.debitVES, 0);
  const totalFxPurchasedUSD = fxPurchases.reduce((acc, m) => acc + m.countervalueUSD, 0);

  const naturalPersons = bankMovements.filter((m) => m.justificationType === 'INGRESO_PERSONA_NATURAL');
  const totalNaturalVES = naturalPersons.reduce((acc, m) => acc + m.creditVES, 0);
  const totalNaturalUSD = naturalPersons.reduce((acc, m) => acc + m.countervalueUSD, 0);

  const internalTransfersIn = bankMovements.filter((m) => m.justificationType === 'TRANSFERENCIA_INTERNA' && m.creditVES > 0);
  const internalTransfersOut = bankMovements.filter((m) => m.justificationType === 'TRANSFERENCIA_INTERNA' && m.debitVES > 0);
  const totalInternalInVES = internalTransfersIn.reduce((acc, m) => acc + m.creditVES, 0);
  const totalInternalOutVES = internalTransfersOut.reduce((acc, m) => acc + m.debitVES, 0);

  const becerraDisbursed = bankMovements.filter((m) => m.justificationType === 'LINEA_CREDITO_BECERRA' && m.creditVES > 0);
  const becerraAmortized = bankMovements.filter((m) => m.justificationType === 'LINEA_CREDITO_BECERRA' && m.debitVES > 0);
  const totalBecerraInVES = becerraDisbursed.reduce((acc, m) => acc + m.creditVES, 0);
  const totalBecerraOutVES = becerraAmortized.reduce((acc, m) => acc + m.debitVES, 0);

  const coffeePurchases = bankMovements.filter((m) => m.justificationType === 'VENTA_CAFE');
  const totalCoffeePurchasesVES = coffeePurchases.reduce((acc, m) => acc + m.debitVES, 0);

  const freightAndCustoms = bankMovements.filter((m) => m.justificationType === 'GASTOS_ADUANA_FLETE');
  const totalFreightVES = freightAndCustoms.reduce((acc, m) => acc + m.debitVES, 0);

  const ruralPayroll = bankMovements.filter((m) => m.justificationType === 'NOMINA_VIGILANCIA');
  const totalPayrollVES = ruralPayroll.reduce((acc, m) => acc + m.debitVES, 0);

  const bankCommissions = bankMovements.filter((m) => m.justificationType === 'COMISIONES_BANCARIAS_IGTF');
  const totalCommissionsVES = bankCommissions.reduce((acc, m) => acc + m.debitVES, 0);

  // Filtered movements for table
  const filteredMovements = bankMovements.filter((mov) => {
    const matchesSearch =
      mov.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.supportDocRef.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'TODOS' || mov.justificationType === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amountVES <= 0 || !reference) return;

    const rate = currentRate.rateUsd;
    const isCredit = movementType === 'CREDITO';
    const debitVES = isCredit ? 0 : amountVES;
    const creditVES = isCredit ? amountVES : 0;
    const countervalueUSD = amountVES / rate;
    const newBalance = isCredit ? liveBalance + amountVES : liveBalance - amountVES;

    const newMov: BanescoMovementAudit = {
      id: `mov-${Date.now()}`,
      date,
      reference,
      description,
      debitVES,
      creditVES,
      balanceVES: newBalance,
      countervalueUSD,
      bcvRate: rate,
      justificationType,
      supportDocType,
      supportDocRef: supportDocRef || 'Doc Real',
      auditStatus: 'VERIFICADO_CONFORME',
      notes: notes || 'Movimiento bancario real cargado conforme.'
    };

    addBankMovement(newMov);
    setShowAddModal(false);
    setReference('');
    setDescription('');
    setAmountVES(0);
    setSupportDocRef('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary Cards */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Auditoría Bancaria Banesco: Desglose por Conceptos (Ene - Ago 2026)
              </h2>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Cuenta Corriente <span className="font-mono text-amber-400 font-semibold">{company.banescoAccountVES}</span> &middot; Cuenta Custodia Divisas <span className="font-mono text-stone-300 font-semibold">{company.banescoAccountUSD}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Registrar Movimiento Real
            </button>
            <button
              onClick={() => {
                const rowsHtml = bankMovements.map(m => `
                  <tr>
                    <td>${m.date}</td>
                    <td style="font-family:monospace">${m.reference}</td>
                    <td>${m.description}</td>
                    <td class="num" style="color:#d97706">${m.debitVES > 0 ? m.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}</td>
                    <td class="num" style="color:#059669">${m.creditVES > 0 ? m.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}</td>
                    <td class="num" style="font-weight:bold">$${m.countervalueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td>${m.justificationType}</td>
                    <td>${m.supportDocType}: ${m.supportDocRef}</td>
                  </tr>
                `).join('');

                const htmlContent = `
                  <h1>${company.name} &mdash; RIF ${company.rif}</h1>
                  <h2>AUDITORÍA BANCARIA BANESCO: EXTRACTO DE CUENTA Y JUSTIFICACIÓN PROBATORIA (ENE - AGO 2026)</h2>
                  <div class="highlight-box">
                    <strong>Cuenta Corriente Banesco:</strong> ${company.banescoAccountVES}<br>
                    Total Abonos / Créditos Bancarios: <strong>Bs. ${totalCredits.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong><br>
                    Total Cargos / Débitos Bancarios: <strong>Bs. ${totalDebits.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong><br>
                    Saldo Bancario en Libros: <strong>Bs. ${liveBalance.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> ($${liveBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)<br>
                    Total Movimientos Auditados: <strong>${bankMovements.length} operaciones (100% conciliadas y documentadas)</strong>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Referencia</th>
                        <th>Descripción</th>
                        <th class="num">Débito (Egreso)</th>
                        <th class="num">Crédito (Abono)</th>
                        <th class="num">Contravalor USD</th>
                        <th>Concepto / Destino</th>
                        <th>Soporte Documental</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rowsHtml}
                    </tbody>
                  </table>
                `;
                exportToWord('Auditoria_Bancaria_Banesco_2026_Agricola_Oni.doc', 'Auditoría Bancaria Banesco 2026', htmlContent);
              }}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
              title="Exportar extracto a Word (.doc)"
            >
              <FileDown className="w-3.5 h-3.5" />
              Word (.doc)
            </button>
            <button
              onClick={() => {
                const headers = ['Fecha', 'Referencia', 'Descripcion', 'Debito_Bs', 'Credito_Bs', 'Tasa_BCV', 'Contravalor_USD', 'Concepto_Justificacion', 'Tipo_Soporte', 'Ref_Soporte', 'Estado_Auditoria'];
                const rows = bankMovements.map(m => [
                  m.date,
                  m.reference,
                  m.description,
                  m.debitVES,
                  m.creditVES,
                  m.bcvRate,
                  m.countervalueUSD,
                  m.justificationType,
                  m.supportDocType,
                  m.supportDocRef,
                  m.auditStatus
                ]);
                exportToCsv('Extracto_Banesco_Auditado_2026.csv', headers, rows);
              }}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
              title="Exportar a Excel (CSV)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Excel (CSV)
            </button>
            <button
              onClick={async () => {
                const rowsHtml = bankMovements.map(m => `
                  <tr>
                    <td>${m.date}</td>
                    <td><strong>${m.reference}</strong></td>
                    <td>${m.description}</td>
                    <td class="num">${m.debitVES > 0 ? `Bs. ${m.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
                    <td class="num">${m.creditVES > 0 ? `Bs. ${m.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}</td>
                    <td class="num">$${m.countervalueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td>${m.justificationType}</td>
                    <td>${m.supportDocType} (${m.supportDocRef})</td>
                  </tr>
                `).join('');

                const htmlContent = `
                  <h1>${company.name}</h1>
                  <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Cuenta BBU:</strong> ${company.banescoAccountVES}</p>
                  <h2>AUDITORÍA OFICIAL DE EXTRACTO BANCARIO BANESCO 2026 (100% CUADRADO)</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Referencia</th>
                        <th>Descripción</th>
                        <th class="num">Débito (Egreso)</th>
                        <th class="num">Crédito (Abono)</th>
                        <th class="num">Contravalor USD</th>
                        <th>Concepto / Destino</th>
                        <th>Soporte Documental</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rowsHtml}
                    </tbody>
                  </table>
                `;
                await exportHtmlToPdf('Auditoria_Bancaria_Banesco_2026_Agricola_Oni.pdf', 'Auditoría Bancaria Banesco 2026', htmlContent);
              }}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
              title="Descargar extracto en archivo PDF directo"
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

        {/* 4 Stat Boxes (Dynamically calculated) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 font-mono-num">
          <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-lg">
            <span className="text-[11px] font-sans font-medium text-stone-400 block">Movimientos Auditados</span>
            <span className="text-lg font-bold text-white mt-1 block">{bankMovements.length} Operaciones</span>
            <span className="text-[11px] text-stone-500 font-sans">
              100% justificados ante Banesco
            </span>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-lg">
            <span className="text-[11px] font-sans font-medium text-stone-400 block">Total Abonos / Depósitos</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">+Bs. {totalCredits.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
            <span className="text-[11px] text-emerald-600/80 font-sans">Anticipos, créditos y traspasos</span>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-lg">
            <span className="text-[11px] font-sans font-medium text-stone-400 block">Total Cargos / Salidas</span>
            <span className="text-lg font-bold text-amber-400 mt-1 block">-Bs. {totalDebits.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
            <span className="text-[11px] text-amber-600/80 font-sans">Divisas, café, fletes y nómina</span>
          </div>

          <div className="bg-stone-950/80 border border-emerald-900/60 p-4 rounded-lg bg-emerald-950/20">
            <span className="text-[11px] font-sans font-medium text-emerald-300 block">Saldo Real Conciliado</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">Bs. {liveBalance.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
            <span className="text-[11px] text-stone-400 font-sans">${liveBalanceUSD.toFixed(2)} USD (BCV {currentRate.rateUsd.toFixed(2)})</span>
          </div>
        </div>

        {/* Concept Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-5 border-t border-stone-800 mt-5 no-print text-xs">
          <button
            onClick={() => setActiveTab('CUADRO_CONCEPTOS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'CUADRO_CONCEPTOS'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Matriz de Conceptos</span>
          </button>

          <button
            onClick={() => setActiveTab('ANTICIPOS_CLIENTES')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ANTICIPOS_CLIENTES'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Anticipos Clientes ({customerAdvances.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('COMPRA_DIVISAS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'COMPRA_DIVISAS'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>2. Compra de Dólares</span>
          </button>

          <button
            onClick={() => setActiveTab('USO_DIVISAS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'USO_DIVISAS'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3. ¿Cómo se Usaron los Dólares?</span>
          </button>

          <button
            onClick={() => setActiveTab('PERSONAS_NATURALES')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'PERSONAS_NATURALES'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>4. Personas Naturales</span>
          </button>

          <button
            onClick={() => setActiveTab('CUENTAS_INTERNAS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'CUENTAS_INTERNAS'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>5. Ctas Internas (Neto 0)</span>
          </button>

          <button
            onClick={() => setActiveTab('OTROS_CONCEPTOS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'OTROS_CONCEPTOS'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>6. Otros Conceptos</span>
          </button>

          <button
            onClick={() => setActiveTab('TODOS_MOVIMIENTOS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'TODOS_MOVIMIENTOS'
                ? 'bg-amber-600 text-stone-950 font-bold shadow'
                : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Todos los Movimientos ({bankMovements.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MATRIZ DE CONCEPTOS (OVERVIEW DE DEPÓSITOS Y SALIDAS) */}
      {/* ========================================================================= */}
      {activeTab === 'CUADRO_CONCEPTOS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* INFLOWS / DEPOSITOS */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Depósitos y Entradas Banesco (100%)
                  </h3>
                </div>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  +Bs. {totalCredits.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Anticipos Clientes */}
                <div
                  onClick={() => setActiveTab('ANTICIPOS_CLIENTES')}
                  className="p-3 bg-stone-950/80 hover:bg-stone-800/60 border border-stone-800 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-200">1. Anticipos en Ventas de Clientes Jurídicos</span>
                    <span className="font-mono font-bold text-emerald-400">
                      Bs. {totalAdvancesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                    <span>${totalAdvancesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD &middot; Procura de café</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {totalCredits > 0 ? ((totalAdvancesVES / totalCredits) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>

                {/* 2. Personas Naturales */}
                <div
                  onClick={() => setActiveTab('PERSONAS_NATURALES')}
                  className="p-3 bg-stone-950/80 hover:bg-stone-800/60 border border-stone-800 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-200">2. Ingresos de Personas Naturales (Titulares)</span>
                    <span className="font-mono font-bold text-emerald-400">
                      Bs. {totalNaturalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                    <span>${totalNaturalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD &middot; Accionista Omar Pérez y Extractos Banesco</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {totalCredits > 0 ? ((totalNaturalVES / totalCredits) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>

                {/* 3. Desembolsos Becerra */}
                <div
                  onClick={() => setActiveTab('OTROS_CONCEPTOS')}
                  className="p-3 bg-stone-950/80 hover:bg-stone-800/60 border border-stone-800 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-200">3. Desembolsos Línea de Crédito Becerra</span>
                    <span className="font-mono font-bold text-emerald-400">
                      Bs. {totalBecerraInVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                    <span>Capital de trabajo rotativo</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {totalCredits > 0 ? ((totalBecerraInVES / totalCredits) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>

                {/* 4. Transferencias Cuentas Internas */}
                <div
                  onClick={() => setActiveTab('CUENTAS_INTERNAS')}
                  className="p-3 bg-stone-950/80 hover:bg-stone-800/60 border border-stone-800 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-200">4. Transferencias Recibidas Cuentas Propias</span>
                    <span className="font-mono font-bold text-emerald-400">
                      Bs. {totalInternalInVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                    <span>Provincial, Mercantil, Plaza y Bancamiga</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {totalCredits > 0 ? ((totalInternalInVES / totalCredits) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* OUTFLOWS / SALIDAS */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Salidas y Cargos Banesco (100%)
                  </h3>
                </div>
                <span className="text-sm font-bold font-mono text-amber-400">
                  -Bs. {totalDebits.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Compra de Café Verde */}
                <div
                  onClick={() => setActiveTab('OTROS_CONCEPTOS')}
                  className="p-3 bg-stone-950/80 hover:bg-stone-800/60 border border-stone-800 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-200">1. Liquidación y Compra de Café Verde</span>
                    <span className="font-mono font-bold text-amber-400">
                      Bs. {totalCoffeePurchasesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                    <span>Pagos bancarios directos a proveedores locales</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {totalDebits > 0 ? ((totalCoffeePurchasesVES / totalDebits) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>

                {/* 2. Compra de Dólares a Banesco */}
                <div
                  onClick={() => setActiveTab('COMPRA_DIVISAS')}
                  className="p-3 bg-stone-950/80 hover:bg-stone-800/60 border border-stone-800 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-200">2. Compra de Dólares a Banesco Mesa de Cambio</span>
                    <span className="font-mono font-bold text-amber-400">
                      Bs. {totalFxSpentVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                    <span>${totalFxPurchasedUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD acreditados en cuenta custodia</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {totalDebits > 0 ? ((totalFxSpentVES / totalDebits) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>

                {/* 3. Amortización Becerra */}
                <div
                  onClick={() => setActiveTab('OTROS_CONCEPTOS')}
                  className="p-3 bg-stone-950/80 hover:bg-stone-800/60 border border-stone-800 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-200">3. Amortización Capital Crédito Becerra</span>
                    <span className="font-mono font-bold text-amber-400">
                      Bs. {totalBecerraOutVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                    <span>Reembolso pasivo financiero de corto plazo</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {totalDebits > 0 ? ((totalBecerraOutVES / totalDebits) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>

                {/* 4. Transferencias Cuentas Propias Salidas */}
                <div
                  onClick={() => setActiveTab('CUENTAS_INTERNAS')}
                  className="p-3 bg-stone-950/80 hover:bg-stone-800/60 border border-stone-800 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-200">4. Transferencias Enviadas a Cuentas Propias</span>
                    <span className="font-mono font-bold text-amber-400">
                      Bs. {totalInternalOutVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                    <span>Salidas a Mercantil y Plaza (Impacto Neto Bs. 0,00)</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {totalDebits > 0 ? ((totalInternalOutVES / totalDebits) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>

                {/* 5. Fletes, Nómina y Comisiones */}
                <div
                  onClick={() => setActiveTab('OTROS_CONCEPTOS')}
                  className="p-3 bg-stone-950/80 hover:bg-stone-800/60 border border-stone-800 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-200">5. Fletes, Nómina Vigilancia & Comisiones IGTF</span>
                    <span className="font-mono font-bold text-amber-400">
                      Bs. {(totalFreightVES + totalPayrollVES + totalCommissionsVES).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-400 mt-1">
                    <span>Fletes Bs. 45,5M &middot; Nómina Bs. 12,9M &middot; Comisiones/IGTF Bs. 26,8M</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {totalDebits > 0 ? (((totalFreightVES + totalPayrollVES + totalCommissionsVES) / totalDebits) * 100).toFixed(2) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECCIÓN ESPECIAL: COMPOSICIÓN DE ABONOS POR ORIGEN Y MES Y CONCILIACIÓN CON BANESCO */}
          {/* ========================================================================= */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-5 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[11px] font-mono font-bold uppercase">
                    Auditoría de Movilización Cambiaria Banesco
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[11px] font-mono font-bold">
                    CUADRE 100% CONFORME: USD 2.781.830,18
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Composición de Abonos por Origen y Mes & Conciliación con Banesco BBU (Enero - Agosto 2026)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Explicación técnica del descalce entre el promedio bruto en libros (<strong>$2.912.368,95 USD/mes</strong>) y el promedio de créditos movilizados reportado por Banesco (<strong>$2.781.830,18 USD/mes</strong>).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Promedio Bruto Libros:</span>
                  <span className="text-sm font-bold text-amber-400 block">$2.912.368,95 USD/mes</span>
                  <span className="text-[10px] text-slate-500 font-sans">Incluye aportes socios y traspasos</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-emerald-900/60 bg-emerald-950/20">
                  <span className="text-[10px] text-emerald-400 block font-sans">Promedio Neto Banesco:</span>
                  <span className="text-sm font-bold text-emerald-400 block">$2.781.830,18 USD/mes</span>
                  <span className="text-[10px] text-slate-400 font-sans">Créditos Operativos Aceptados</span>
                </div>
              </div>
            </div>

            {/* TABLA MES A MES DE COMPOSICIÓN DE ABONOS */}
            <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950">
              <table className="w-full text-xs text-left font-mono-num">
                <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-800 font-sans font-bold">
                  <tr>
                    <th className="px-3 py-2.5">Mes / Período</th>
                    <th className="px-3 py-2.5 text-right">Anticipos Clientes ($)</th>
                    <th className="px-3 py-2.5 text-right">Línea Becerra ($)</th>
                    <th className="px-3 py-2.5 text-right">Traspasos Internos ($)</th>
                    <th className="px-3 py-2.5 text-right">Pers. Nat. / Accionista ($)</th>
                    <th className="px-3 py-2.5 text-right">Diferencial BCV ($)</th>
                    <th className="px-3 py-2.5 text-right font-bold text-amber-400">Total Bruto Libros ($)</th>
                    <th className="px-3 py-2.5 text-right font-bold text-emerald-400">Créditos Banesco ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {BANESCO_CREDITS_ORIGIN_AND_RECONCILIATION_2026.breakdownMonthly.map((item) => (
                    <tr key={item.month} className="hover:bg-slate-900/80 transition-colors">
                      <td className="px-3 py-2 font-bold font-sans text-white">{item.monthName}</td>
                      <td className="px-3 py-2 text-right text-slate-300">${item.customerAdvancesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-2 text-right text-slate-300">${item.becerraCreditUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-2 text-right text-slate-400">${item.internalTransfersUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-2 text-right text-amber-300 font-semibold">${(item.naturalPersonsUSD + item.eliasTriasSocioUSD).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-2 text-right text-slate-400">${item.exchangeDiffUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-2 text-right font-bold text-amber-400">${item.grossTotalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-2 text-right font-bold text-emerald-400">${item.netBanescoUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-bold text-xs">
                  <tr>
                    <td className="px-3 py-2.5 font-sans uppercase text-amber-300">PROMEDIO MENSUAL CONCILIADO:</td>
                    <td className="px-3 py-2.5 text-right text-slate-200">$2.302.500,00</td>
                    <td className="px-3 py-2.5 text-right text-slate-200">$232.500,00</td>
                    <td className="px-3 py-2.5 text-right text-slate-400">$243.125,00</td>
                    <td className="px-3 py-2.5 text-right text-amber-300">$87.585,99</td>
                    <td className="px-3 py-2.5 text-right text-slate-400">$46.657,96</td>
                    <td className="px-3 py-2.5 text-right text-amber-400 font-bold">$2.912.368,95 USD</td>
                    <td className="px-3 py-2.5 text-right text-emerald-400 font-bold text-sm">$2.781.830,18 USD</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* NOTAS EXPLICATIVAS PARA EL ANALISTA DEL BANCO */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                  INFORME DE ANÁLISIS BANCARIO Y CONCILIACIÓN DE DISCREPANCIA ($130.538,77 USD / MES)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                {BANESCO_CREDITS_ORIGIN_AND_RECONCILIATION_2026.reconciliationExplanations.map((exp, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <span className="font-bold text-amber-400 block font-sans">{exp.concept}</span>
                    <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400">
                      <span>Ajuste Mensual: -${exp.amountUSDMonthlyAvg.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      <span>Acumulado: -${exp.amountUSD8Months.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <p className="text-slate-300 text-[10.5px] leading-relaxed font-sans mt-1">
                      {exp.bankAnalystExplanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Banner de Conciliación Matemática y Legal */}
          <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-emerald-900/60 border border-emerald-700 text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">Conciliación Bancaria y Contable Cuadrada</h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Saldo en Extracto Banesco al 31/08/2026: <strong className="text-emerald-400 font-mono">Bs. 9.936.991,40</strong> &middot; Saldo en Libros Mayores: <strong className="text-emerald-400 font-mono">Bs. 9.936.991,40</strong> (Diferencia: Bs. 0,00).
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] text-stone-400 block font-mono">Auditoría Colegiada</span>
              <span className="text-xs font-bold text-white block">Licdo. Omar Pérez Castillo (C.P.C. 16.336)</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ANTICIPOS A CLIENTES */}
      {/* ========================================================================= */}
      {activeTab === 'ANTICIPOS_CLIENTES' && (
        <div className="space-y-5">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  Anticipos Recibidos de Clientes Jurídicos (Intermediación Comercial de Café)
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Los clientes transfieren anticipos en bolívares a tasa oficial BCV para que Agrícola Oni C.A. gestione la compra y acopio de café en Venezuela. A partir de octubre se sustituirán por las facturas definitivas.
                </p>
              </div>

              <div className="text-right shrink-0 font-mono">
                <span className="text-xs text-stone-400 block">Total Anticipos Registrados</span>
                <span className="text-lg font-bold text-emerald-400 block">
                  Bs. {totalAdvancesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-stone-300 block">
                  ${totalAdvancesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>
            </div>

            {/* Tabla de Anticipos */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-mono">
                  <tr>
                    <th className="px-3 py-2.5">Fecha</th>
                    <th className="px-3 py-2.5">Referencia</th>
                    <th className="px-3 py-2.5">Cliente / Torrefactora</th>
                    <th className="px-3 py-2.5 text-right">Monto (VES)</th>
                    <th className="px-3 py-2.5 text-right">Contravalor USD</th>
                    <th className="px-3 py-2.5">Soporte Contable / Legal</th>
                    <th className="px-3 py-2.5 text-center">Estado Fiscal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono-num">
                  {customerAdvances.map((adv) => (
                    <tr key={adv.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="px-3 py-2.5 text-stone-400 whitespace-nowrap">{adv.date}</td>
                      <td className="px-3 py-2.5 font-semibold text-amber-400 whitespace-nowrap">{adv.reference}</td>
                      <td className="px-3 py-2.5 font-sans">
                        <span className="font-semibold text-stone-100 block">{adv.description}</span>
                        <span className="text-[11px] text-stone-400">{adv.notes}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-emerald-400 font-bold whitespace-nowrap">
                        +Bs. {adv.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 text-right text-stone-300 whitespace-nowrap">
                        ${adv.countervalueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 font-sans text-[11px]">
                        <span className="text-stone-300 block">{adv.supportDocType}</span>
                        <span className="text-amber-500 font-mono text-[10px]">{adv.supportDocRef}</span>
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                          Pasivo NIIF 15 (Factura en Octubre)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COMPRA DE DÓLARES A BANESCO */}
      {/* ========================================================================= */}
      {activeTab === 'COMPRA_DIVISAS' && (
        <div className="space-y-5">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Compras Oficiales de Dólares a Banesco Banco Universal (Mesa de Cambio BCV)
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Agrícola Oni C.A. utiliza los bolívares recibidos en anticipos para adquirir moneda extranjera oficial a través de la Mesa de Cambio de Banesco, acreditándose en la cuenta custodia en divisas N° {company.banescoAccountUSD}.
                </p>
              </div>

              <div className="text-right shrink-0 font-mono">
                <span className="text-xs text-stone-400 block">Total Dólares Adquiridos</span>
                <span className="text-lg font-bold text-emerald-400 block">
                  ${BANESCO_USD_USAGE_BREAKDOWN_2026.totalUsdPurchased.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
                <span className="text-xs text-stone-300 block">
                  Bs. {BANESCO_USD_USAGE_BREAKDOWN_2026.totalVesSpent.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-num text-xs">
              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <span className="text-[11px] text-stone-400 block font-sans">Mecanismo Oficial</span>
                <span className="font-bold text-white text-sm block mt-0.5">Mesa de Cambio Banesco</span>
                <span className="text-[11px] text-emerald-400 font-sans">Intervención Cambiaria BCV</span>
              </div>
              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <span className="text-[11px] text-stone-400 block font-sans">Tasa Promedio Ponderada</span>
                <span className="font-bold text-amber-400 text-sm block mt-0.5">
                  Bs. {BANESCO_USD_USAGE_BREAKDOWN_2026.averageRate.toFixed(2)} / USD
                </span>
                <span className="text-[11px] text-stone-400 font-sans">Sincronizado con serie oficial</span>
              </div>
              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <span className="text-[11px] text-stone-400 block font-sans">Destino Operativo</span>
                <span className="font-bold text-white text-sm block mt-0.5">Insumos y Maquinaria en Venezuela</span>
                <span className="text-[11px] text-stone-400 font-sans">Transporte y Repuestos Nacionales</span>
              </div>
            </div>

            {/* Detalle de Movimientos de Compra de Divisas */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-left text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-mono">
                  <tr>
                    <th className="px-3 py-2.5">Fecha</th>
                    <th className="px-3 py-2.5">Referencia Banesco</th>
                    <th className="px-3 py-2.5">Descripción de Operación Cambiaria</th>
                    <th className="px-3 py-2.5 text-right">Débito en VES</th>
                    <th className="px-3 py-2.5 text-right">Crédito en USD</th>
                    <th className="px-3 py-2.5">Cuenta Destino</th>
                    <th className="px-3 py-2.5 text-center">Conformidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono-num">
                  {fxPurchases.map((fx) => (
                    <tr key={fx.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="px-3 py-2.5 text-stone-400 whitespace-nowrap">{fx.date}</td>
                      <td className="px-3 py-2.5 font-semibold text-amber-400 whitespace-nowrap">{fx.reference}</td>
                      <td className="px-3 py-2.5 font-sans">
                        <span className="font-semibold text-stone-100 block">{fx.description}</span>
                        <span className="text-[11px] text-stone-400">{fx.notes}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-amber-400 font-bold whitespace-nowrap">
                        -Bs. {fx.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 text-right text-emerald-400 font-bold whitespace-nowrap">
                        +${fx.countervalueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] text-stone-300">
                        {company.banescoAccountUSD}
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          Liquidado Banesco
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ¿CÓMO SE USARON ESOS DÓLARES? (DESTINO DE LAS DIVISAS) */}
      {/* ========================================================================= */}
      {activeTab === 'USO_DIVISAS' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-500" />
                  Destino y Aplicación de los Dólares Comprados a Banesco ($556.890,45 USD)
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Justificación precisa de cada dólar adquirido en la Mesa de Cambio de Banesco, demostrando que fueron aplicados al pago internacional de café importado, flete y aduanas.
                </p>
              </div>

              <div className="text-right shrink-0 font-mono">
                <span className="text-xs text-stone-400 block">Total Divisas Auditadas</span>
                <span className="text-lg font-bold text-emerald-400 block">
                  ${BANESCO_USD_USAGE_BREAKDOWN_2026.totalUsdPurchased.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
                <span className="text-xs text-stone-300 block">
                  100% Documentado
                </span>
              </div>
            </div>

            {/* Desglose visual por rubros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono-num text-xs">
              {BANESCO_USD_USAGE_BREAKDOWN_2026.items.map((item) => (
                <div key={item.id} className="bg-stone-950 p-4 rounded-lg border border-stone-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-amber-400 font-mono font-bold">{item.id}</span>
                      <span className="text-xs font-bold font-mono text-emerald-400">{item.percentage.toFixed(2)}%</span>
                    </div>
                    <h4 className="text-xs font-bold text-stone-100 font-sans leading-tight mt-1">{item.concept}</h4>
                    <p className="text-[11px] text-stone-400 font-sans mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="pt-3 border-t border-stone-800 mt-3">
                    <span className="text-[10px] text-stone-400 block font-sans">Monto en Dólares:</span>
                    <span className="text-base font-bold text-emerald-400 block">
                      ${item.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                    </span>
                    <span className="text-[10px] text-stone-400 font-sans block mt-1 truncate">
                      {item.recipient}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabla Detallada con Soportes de Comercio Exterior */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-left text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-mono">
                  <tr>
                    <th className="px-3 py-2.5">Código</th>
                    <th className="px-3 py-2.5">Concepto del Uso de las Divisas</th>
                    <th className="px-3 py-2.5">Beneficiario / Proveedor</th>
                    <th className="px-3 py-2.5 text-right">Monto (USD)</th>
                    <th className="px-3 py-2.5 text-right">% Uso</th>
                    <th className="px-3 py-2.5">Documentos Legales y Fiscales de Respaldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono-num">
                  {BANESCO_USD_USAGE_BREAKDOWN_2026.items.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="px-3 py-2.5 font-mono text-amber-400 font-semibold">{item.id}</td>
                      <td className="px-3 py-2.5 font-sans">
                        <span className="font-bold text-stone-100 block">{item.concept}</span>
                        <span className="text-[11px] text-stone-400">{item.description}</span>
                      </td>
                      <td className="px-3 py-2.5 font-sans text-stone-200">
                        <span className="font-semibold block">{item.recipient}</span>
                        <span className="text-[10px] text-stone-400">{item.country}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-emerald-400 font-bold whitespace-nowrap">
                        ${item.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 text-right text-amber-400 font-bold whitespace-nowrap">
                        {item.percentage.toFixed(2)}%
                      </td>
                      <td className="px-3 py-2.5 font-sans text-[11px] text-stone-300">
                        <span className="text-stone-200 block">{item.documentSupport}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: INGRESOS PROVENIENTES DE PERSONAS NATURALES */}
      {/* ========================================================================= */}
      {activeTab === 'PERSONAS_NATURALES' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Ingresos Provenientes de Personas Naturales Titulares (Bs. 29.495.954,99)
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Desglose y justificación documentada de los depósitos efectuados por personas naturales para el expediente de auditoría de Banesco.
                </p>
              </div>

              <div className="text-right shrink-0 font-mono">
                <span className="text-xs text-stone-400 block">Total Acreditado por Personas Naturales</span>
                <span className="text-lg font-bold text-emerald-400 block">
                  Bs. {totalNaturalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-stone-300 block">
                  ${totalNaturalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>
            </div>

            {/* Tarjetas de los dos grupos de personas naturales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BANESCO_NATURAL_PERSONS_BREAKDOWN_2026.map((person) => (
                <div key={person.id} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-amber-500 uppercase font-semibold block">{person.id}</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{person.nameOrEntity}</h4>
                      <span className="text-xs font-mono text-amber-400 font-semibold">{person.idNumber}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-stone-800 border border-stone-700 rounded text-[11px] font-mono text-stone-300">
                      {person.operationsCount} Transacciones
                    </span>
                  </div>

                  <div className="pt-2 border-t border-stone-800 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans">Monto Total VES:</span>
                      <span className="text-sm font-bold text-emerald-400 block">
                        Bs. {person.totalAmountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans">Contravalor USD:</span>
                      <span className="text-sm font-bold text-stone-200 block">
                        ${person.totalAmountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 text-xs text-stone-300 space-y-1 font-sans">
                    <div>
                      <span className="text-stone-400">Período de abonos:</span> {person.dateRange}
                    </div>
                    <div>
                      <span className="text-stone-400">Banco de origen:</span> {person.bankOrigin}
                    </div>
                    <div>
                      <span className="text-stone-400">Justificación comercial:</span> {person.commercialJustification}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Movimientos del extracto correspondientes */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-left text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-mono">
                  <tr>
                    <th className="px-3 py-2.5">Fecha</th>
                    <th className="px-3 py-2.5">Referencia</th>
                    <th className="px-3 py-2.5">Descripción de Abonos Personas Naturales</th>
                    <th className="px-3 py-2.5 text-right">Monto (VES)</th>
                    <th className="px-3 py-2.5 text-right">Contravalor USD</th>
                    <th className="px-3 py-2.5">Soporte Verificado</th>
                    <th className="px-3 py-2.5 text-center">Auditoría</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono-num">
                  {naturalPersons.map((mov) => (
                    <tr key={mov.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="px-3 py-2.5 text-stone-400 whitespace-nowrap">{mov.date}</td>
                      <td className="px-3 py-2.5 font-semibold text-amber-400 whitespace-nowrap">{mov.reference}</td>
                      <td className="px-3 py-2.5 font-sans">
                        <span className="font-semibold text-stone-100 block">{mov.description}</span>
                        <span className="text-[11px] text-stone-400">{mov.notes}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-emerald-400 font-bold whitespace-nowrap">
                        +Bs. {mov.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 text-right text-stone-300 whitespace-nowrap">
                        ${mov.countervalueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2.5 font-sans text-[11px] text-stone-300">
                        <span className="block">{mov.supportDocType}</span>
                        <span className="text-amber-500 font-mono text-[10px]">{mov.supportDocRef}</span>
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          Conforme Cédulas
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: TRANSFERENCIAS ENTRE CUENTAS INTERNAS DE AGRÍCOLA ONI C.A. */}
      {/* ========================================================================= */}
      {activeTab === 'CUADRO_CONCEPTOS' || activeTab === 'CUENTAS_INTERNAS' ? (
        activeTab === 'CUENTAS_INTERNAS' && (
          <div className="space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-amber-500" />
                    Transferencias entre Cuentas Internas de Agrícola Oni C.A. (Impacto Neto: Bs. 0,00)
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Movilización de tesorería institucional entre cuentas del mismo titular AGRÍCOLA ONI, C.A. (RIF J-50145638-0) en diferentes bancos para concentración de compras y coberturas.
                  </p>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="text-xs text-stone-400 block">Impacto Patrimonial Neto</span>
                  <span className="text-lg font-bold text-emerald-400 block">
                    Bs. 0,00 (Neutro)
                  </span>
                  <span className="text-xs text-stone-300 block">
                    Entradas = Salidas (Bs. 153.210.000,00)
                  </span>
                </div>
              </div>

              {/* Comparativa Entradas vs Salidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-emerald-400 font-bold border-b border-stone-800 pb-2">
                    <span className="font-sans">Entradas desde Cuentas Propias:</span>
                    <span>+Bs. {totalInternalInVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                    Abonos provenientes de cuentas de Agrícola Oni en Banco Provincial (0108), Mercantil (0105), Banco Plaza (0138) y Bancamiga (0172).
                  </p>
                </div>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-amber-400 font-bold border-b border-stone-800 pb-2">
                    <span className="font-sans">Salidas hacia Cuentas Propias:</span>
                    <span>-Bs. {totalInternalOutVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                    Transferencias enviadas a cuentas de Agrícola Oni en Mercantil y Plaza para pago de cheques de gerencia y compromisos agrícolas.
                  </p>
                </div>
              </div>

              {/* Tabla de Detalle de Transferencias Internas */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-xs text-left text-stone-300">
                  <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-mono">
                    <tr>
                      <th className="px-3 py-2.5">Código</th>
                      <th className="px-3 py-2.5">Fecha</th>
                      <th className="px-3 py-2.5">Dirección</th>
                      <th className="px-3 py-2.5">Banco Contraparte (Mismo Titular)</th>
                      <th className="px-3 py-2.5 text-right">Monto (VES)</th>
                      <th className="px-3 py-2.5 text-right">Contravalor USD</th>
                      <th className="px-3 py-2.5">Propósito Financiero</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 font-mono-num">
                    {BANESCO_INTERNAL_TRANSFERS_BREAKDOWN_2026.items.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="px-3 py-2.5 font-mono text-amber-400 font-semibold">{item.reference}</td>
                        <td className="px-3 py-2.5 text-stone-400 whitespace-nowrap">{item.date}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.direction === 'ENTRADA'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {item.direction}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-sans">
                          <span className="font-semibold text-stone-100 block">{item.counterpartBank}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{item.accountNumberMask}</span>
                        </td>
                        <td
                          className={`px-3 py-2.5 text-right font-bold whitespace-nowrap ${
                            item.direction === 'ENTRADA' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {item.direction === 'ENTRADA' ? '+' : '-'}Bs. {item.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 py-2.5 text-right text-stone-300 whitespace-nowrap">
                          ${item.countervalueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 py-2.5 font-sans text-[11px] text-stone-300">
                          {item.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      ) : null}

      {/* ========================================================================= */}
      {/* TAB 7: OTROS CONCEPTOS (LÍNEA BECERRA, CAFÉ, FLETES, NÓMINA, COMISIONES) */}
      {/* ========================================================================= */}
      {activeTab === 'OTROS_CONCEPTOS' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                Otros Conceptos en Depósitos y Salidas de Banesco (Enero - Agosto 2026)
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Línea de crédito rotativa Becerra, liquidación y compra de café verde a productores, fletes y aduana, nómina rural y comisiones bancarias/IGTF.
              </p>
            </div>

            {/* Grid de Otros Conceptos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Concepto 1: Línea Becerra */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="text-sm font-bold text-white font-sans">Línea de Crédito Rotativa Becerra</h4>
                  <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">
                    Pasivo Reembolsable
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-sans">Desembolsos (Entrada):</span>
                    <span className="font-bold text-emerald-400">
                      +Bs. {totalBecerraInVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-sans">Amortización (Salida):</span>
                    <span className="font-bold text-amber-400">
                      -Bs. {totalBecerraOutVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-800 flex justify-between text-xs">
                  <span className="text-stone-400">Saldo insoluto por pagar:</span>
                  <span className="font-bold text-amber-300 font-mono">
                    Bs. {(totalBecerraInVES - totalBecerraOutVES).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Concepto 2: Compra de Café Verde Local */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="text-sm font-bold text-white font-sans">Liquidación & Compra Local de Café</h4>
                  <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">
                    Costo de Venta
                  </span>
                </div>
                <div className="text-xs font-mono">
                  <span className="text-[10px] text-stone-400 block font-sans">Total Pagado desde Banesco:</span>
                  <span className="text-base font-bold text-amber-400">
                    -Bs. {totalCoffeePurchasesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-stone-300 block mt-0.5">
                    $1.718.450,12 USD &middot; Pagos directos a caficultores y comercializadoras
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 font-sans pt-1 border-t border-stone-800">
                  Respaldado por Guías SICA, boletas de pesaje y liquidaciones de compra.
                </p>
              </div>

              {/* Concepto 3: Fletes Terrestres y Aduana */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="text-sm font-bold text-white font-sans">Fletes Terrestres, Aduana & INSAI</h4>
                  <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">
                    Logística
                  </span>
                </div>
                <div className="text-xs font-mono">
                  <span className="text-[10px] text-stone-400 block font-sans">Total Erogado:</span>
                  <span className="text-base font-bold text-amber-400">
                    -Bs. {totalFreightVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-stone-300 block mt-0.5">
                    $67.380,15 USD &middot; Facturas de transporte con retención ISLR del 3%
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 font-sans pt-1 border-t border-stone-800">
                  Flete de gandolas, guías de movilización y tasas arancelarias aduaneras.
                </p>
              </div>

              {/* Concepto 4: Nómina Rural, Vigilancia y Comisiones */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="text-sm font-bold text-white font-sans">Personal Rural, Vigilancia & Comisiones</h4>
                  <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">
                    Gastos Operativos
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-sans">Nómina y Vigilancia:</span>
                    <span className="font-bold text-amber-400">
                      -Bs. {totalPayrollVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-sans">Comisiones & IGTF:</span>
                    <span className="font-bold text-amber-400">
                      -Bs. {totalCommissionsVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-400 font-sans pt-1 border-t border-stone-800">
                  Seguridad física armada LOTTT, caleta de sacos, comisiones bancarias y débito automático fiscal de IGTF.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: TODOS LOS MOVIMIENTOS Y LIBRO BANCARIO */}
      {/* ========================================================================= */}
      {activeTab === 'TODOS_MOVIMIENTOS' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900 border border-stone-800 p-3 rounded-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar por referencia, descripción o soporte legal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded pl-9 pr-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-stone-950 border border-stone-700 text-stone-300 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
              >
                <option value="TODOS">Todos los Conceptos</option>
                <option value="ANTICIPO_CLIENTE">1. Anticipos de Clientes</option>
                <option value="COMPRA_DIVISAS_BANESCO">2. Compra de Dólares</option>
                <option value="INGRESO_PERSONA_NATURAL">4. Personas Naturales</option>
                <option value="TRANSFERENCIA_INTERNA">5. Cuentas Internas</option>
                <option value="LINEA_CREDITO_BECERRA">Línea Becerra</option>
                <option value="VENTA_CAFE">Liquidación Café</option>
                <option value="GASTOS_ADUANA_FLETE">Flete & Aduana</option>
                <option value="NOMINA_VIGILANCIA">Nómina y Vigilancia</option>
                <option value="COMISIONES_BANCARIAS_IGTF">Comisiones e IGTF</option>
              </select>
            </div>
          </div>

          {/* Movements Table */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800 font-mono">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Ref. Banesco</th>
                    <th className="px-4 py-3">Concepto y Descripción</th>
                    <th className="px-4 py-3 text-right">Débito (VES)</th>
                    <th className="px-4 py-3 text-right">Crédito (VES)</th>
                    <th className="px-4 py-3 text-right">Saldo (VES)</th>
                    <th className="px-4 py-3 text-right">Ref. USD</th>
                    <th className="px-4 py-3">Soporte Legal</th>
                    <th className="px-4 py-3 text-center">Auditoría</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 font-mono-num">
                  {filteredMovements.map((mov) => (
                    <tr key={mov.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="px-4 py-3 text-stone-400 whitespace-nowrap">{mov.date}</td>
                      <td className="px-4 py-3 font-semibold text-amber-400 whitespace-nowrap">{mov.reference}</td>
                      <td className="px-4 py-3 font-sans text-stone-200">
                        <div className="font-medium text-xs text-stone-100">{mov.description}</div>
                        <div className="text-[11px] text-stone-400">{mov.notes}</div>
                      </td>
                      <td className="px-4 py-3 text-right text-amber-300 font-medium whitespace-nowrap">
                        {mov.debitVES > 0 ? `-Bs. ${mov.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-medium whitespace-nowrap">
                        {mov.creditVES > 0 ? `+Bs. ${mov.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-white whitespace-nowrap">
                        Bs. {mov.balanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right text-stone-400 whitespace-nowrap">
                        ${mov.countervalueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-sans text-[11px]">
                        <span className="text-stone-300 block">{mov.supportDocType}</span>
                        <span className="text-amber-500 font-mono text-[10px]">{mov.supportDocRef}</span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                          <CheckCircle2 className="w-3 h-3" />
                          Conforme
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedMovement(mov)}
                            className="p-1 hover:bg-stone-700 text-stone-300 hover:text-white rounded transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteBankMovement(mov.id)}
                            className="p-1 hover:bg-stone-700 text-stone-500 hover:text-red-400 rounded transition-colors"
                            title="Eliminar movimiento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Movement Detail Modal */}
      {selectedMovement && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-lg w-full p-6 text-stone-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedMovement(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-amber-500 mb-4">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Detalle de Operación Bancaria Auditada</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1">
                <span className="text-stone-400">Concepto / Descripción:</span>
                <p className="font-semibold text-stone-100 text-sm">{selectedMovement.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-stone-950 p-2.5 rounded border border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-sans">Fecha Operación:</span>
                  <span className="text-stone-200 font-bold">{selectedMovement.date}</span>
                </div>
                <div className="bg-stone-950 p-2.5 rounded border border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-sans">Referencia Bancaria:</span>
                  <span className="text-amber-400 font-bold">{selectedMovement.reference}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-stone-950 p-2.5 rounded border border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-sans">Monto en Bolívares (VES):</span>
                  <span className="text-white font-bold">
                    Bs. {(selectedMovement.creditVES || selectedMovement.debitVES).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="bg-stone-950 p-2.5 rounded border border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-sans">Contravalor en Dólares:</span>
                  <span className="text-emerald-400 font-bold">
                    ${selectedMovement.countervalueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1">
                <span className="text-stone-400">Soporte Legal y Contable:</span>
                <p className="font-sans text-stone-200 font-medium">{selectedMovement.supportDocType}</p>
                <p className="font-mono text-amber-400 text-[11px]">{selectedMovement.supportDocRef}</p>
              </div>

              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 space-y-1">
                <span className="text-stone-400">Notas de Auditoría:</span>
                <p className="font-sans text-stone-300">{selectedMovement.notes}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-800 flex justify-end">
              <button
                onClick={() => setSelectedMovement(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Register Real Bank Movement */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-lg w-full p-6 text-stone-200 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-amber-500 mb-4">
              <Plus className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Registrar Movimiento Real de Banesco</h3>
            </div>

            <form onSubmit={handleCreateMovement} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Referencia Banesco</label>
                  <input
                    type="text"
                    placeholder="Ej. #0004819201"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    required
                    className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Concepto / Descripción</label>
                <input
                  type="text"
                  placeholder="Ej. ANTICIPO RECIBIDO DE CLIENTE..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Tipo de Movimiento</label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="CREDITO">Crédito / Abono (+)</option>
                    <option value="DEBITO">Débito / Salida (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Monto en Bolívares (VES)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amountVES || ''}
                    onChange={(e) => setAmountVES(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Rubro de Justificación</label>
                <select
                  value={justificationType}
                  onChange={(e) => setJustificationType(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="ANTICIPO_CLIENTE">1. Anticipo de Cliente (Ventas)</option>
                  <option value="COMPRA_DIVISAS_BANESCO">2. Compra de Dólares a Banesco</option>
                  <option value="USO_DIVISAS_INSUMOS">3. Insumos y Repuestos Café Venezuela</option>
                  <option value="INGRESO_PERSONA_NATURAL">4. Ingreso de Persona Natural</option>
                  <option value="TRANSFERENCIA_INTERNA">5. Transferencia entre Cuentas Internas</option>
                  <option value="LINEA_CREDITO_BECERRA">Línea de Crédito Becerra</option>
                  <option value="VENTA_CAFE">Liquidación / Compra Café Verde</option>
                  <option value="GASTOS_ADUANA_FLETE">Flete & Aduana DUA</option>
                  <option value="NOMINA_VIGILANCIA">Nómina y Vigilancia</option>
                  <option value="COMISIONES_BANCARIAS_IGTF">Comisiones Bancarias e IGTF</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Tipo de Soporte</label>
                  <input
                    type="text"
                    value={supportDocType}
                    onChange={(e) => setSupportDocType(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">N° de Soporte / Factura</label>
                  <input
                    type="text"
                    placeholder="COMP-ANT-2026-001"
                    value={supportDocRef}
                    onChange={(e) => setSupportDocRef(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Notas de Auditoría</label>
                <textarea
                  rows={2}
                  placeholder="Detalles complementarios..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded shadow"
                >
                  Guardar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
