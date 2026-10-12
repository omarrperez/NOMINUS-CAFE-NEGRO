import React, { useState } from 'react';
import {
  FileCheck,
  FileText,
  ShieldCheck,
  BookOpen,
  FileSpreadsheet,
  DollarSign,
  Users,
  Scale,
  Receipt,
  Database,
  BookOpenCheck,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  Printer,
  Sparkles,
  Info,
  Upload,
  CheckCircle2,
  Globe,
  Ship,
  ArrowRightLeft,
  TrendingUp
} from 'lucide-react';

import { COMPANIES, CompanyProfile, CURRENT_BCV_RATE, BcvRateItem } from './data/nominusData';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { MultiCompanyManagerBar } from './components/MultiCompanyManagerBar';
import { CoffeeImportAndAdvancesManagerView } from './components/CoffeeImportAndAdvancesManagerView';
import { AgricolaOniBanescoResponseLetterView } from './components/AgricolaOniBanescoResponseLetterView';
import { AgricolaOniBanescoOnePageLetterView } from './components/AgricolaOniBanescoOnePageLetterView';
import { AgricolaOniBankAuditSheetView } from './components/AgricolaOniBankAuditSheetView';
import { BanescoLedgerAndCashTrailView } from './components/BanescoLedgerAndCashTrailView';
import { AgricolaOniAccountingAndVouchersSuiteView } from './components/AgricolaOniAccountingAndVouchersSuiteView';
import { BcvRatesManagerPanel } from './components/BcvRatesManagerPanel';
import { VigilantesPayrollView } from './components/VigilantesPayrollView';
import { LegalShieldContractsView } from './components/LegalShieldContractsView';
import { ReceiptGeneratorView } from './components/ReceiptGeneratorView';
import { SecurityDatabaseCenterView } from './components/SecurityDatabaseCenterView';
import { DeepResearchAndUxReportView } from './components/DeepResearchAndUxReportView';
import { FinancialStatementsAndBecerraSuiteView } from './components/FinancialStatementsAndBecerraSuiteView';
import { LayoutGrid } from 'lucide-react';
import { DashboardOverviewView } from './components/DashboardOverviewView';
import { LegalEntitiesSeniatRifListView } from './components/LegalEntitiesSeniatRifListView';
import { FiscalAuditorCrossCheckReportView } from './components/FiscalAuditorCrossCheckReportView';
import { BanescoReconciliationNoteSheetView } from './components/BanescoReconciliationNoteSheetView';
import { AccountingSheetFullJournalView } from './components/AccountingSheetFullJournalView';
import { DualCurrencyFinancialStatementsSheetView } from './components/DualCurrencyFinancialStatementsSheetView';

export type ActiveModule =
  | 'DASHBOARD'
  | 'IMPORT_AND_ADVANCES'
  | 'FINANCIAL_STATEMENTS_DUAL_SHEET'
  | 'ACCOUNTING_SHEET'
  | 'FISCAL_AUDITOR_REPORT'
  | 'SENIAT_LEGAL_ENTITIES'
  | 'FINANCIAL_STATEMENTS_BECERRA'
  | 'BANESCO_LETTER_FULL'
  | 'BANESCO_LETTER_ONE_PAGE'
  | 'BANESCO_RECONCILIATION_NOTE'
  | 'BANESCO_AUDIT_SHEET'
  | 'BANESCO_LEDGER'
  | 'ACCOUNTING_SUITE'
  | 'BCV_RATES'
  | 'VIGILANTES_PAYROLL'
  | 'LEGAL_CONTRACTS'
  | 'RECEIPT_GENERATOR'
  | 'SECURITY_CENTER'
  | 'RESEARCH_REPORT';

function MainAppContent() {
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile>(COMPANIES[0]);
  const [currentRate, setCurrentRate] = useState<BcvRateItem>(CURRENT_BCV_RATE);
  const [activeModule, setActiveModule] = useState<ActiveModule>('DASHBOARD');
  const { vouchers, bankMovements, customerAdvances, fxPurchases, importShipments } = useAppData();

  const totalLoaded = customerAdvances.length + fxPurchases.length + importShipments.length + vouchers.length + bankMovements.length;

  const navItems: { id: ActiveModule; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'DASHBOARD', label: 'Inicio Dashboard', icon: LayoutGrid, badge: 'Inicio' },
    { id: 'IMPORT_AND_ADVANCES', label: 'Anticipos & Importación (Colombia)', icon: Globe, badge: 'Principal' },
    { id: 'FINANCIAL_STATEMENTS_DUAL_SHEET', label: 'EEFF Dual (Bs. & USD) + Excel Banco', icon: Scale, badge: '31-08-2026' },
    { id: 'ACCOUNTING_SHEET', label: 'Hoja de Contabilidad & Asientos ERP', icon: BookOpen, badge: 'Diario ERP' },
    { id: 'FISCAL_AUDITOR_REPORT', label: 'Auditoría Fiscal Proveedores', icon: ShieldCheck, badge: 'Auditor' },
    { id: 'SENIAT_LEGAL_ENTITIES', label: 'Clientes Jurídicos & RIF SENIAT', icon: Building2, badge: 'SENIAT' },
    { id: 'FINANCIAL_STATEMENTS_BECERRA', label: 'EEFF 2025-2026 & Manuel Becerra', icon: TrendingUp, badge: 'Auditoría' },
    { id: 'BANESCO_LETTER_FULL', label: 'Carta Respuesta Banesco', icon: FileCheck, badge: 'Oficial' },
    { id: 'BANESCO_LETTER_ONE_PAGE', label: 'Carta 1 Página (Impresión)', icon: FileText, badge: '1 Hoja' },
    { id: 'BANESCO_RECONCILIATION_NOTE', label: 'Nota Conciliación (Imprimir)', icon: Printer, badge: 'Hoja Nota' },
    { id: 'BANESCO_AUDIT_SHEET', label: 'Auditoría & Conciliación', icon: ShieldCheck, badge: `${bankMovements.length}` },
    { id: 'BANESCO_LEDGER', label: 'Libro Auxiliar & Caja Chica', icon: BookOpen },
    { id: 'ACCOUNTING_SUITE', label: 'Comprobantes & Retenciones', icon: FileSpreadsheet, badge: `${vouchers.length}` },
    { id: 'BCV_RATES', label: 'Tasas BCV & Calculadora', icon: DollarSign },
    { id: 'VIGILANTES_PAYROLL', label: 'Nómina & Seguridad', icon: Users },
    { id: 'LEGAL_CONTRACTS', label: 'Blindaje Legal & Contratos', icon: Scale },
    { id: 'RECEIPT_GENERATOR', label: 'Recibos & Pesaje Café', icon: Receipt },
    { id: 'SECURITY_CENTER', label: 'Base de Datos & Carga Real', icon: Database, badge: 'Cargar' },
    { id: 'RESEARCH_REPORT', label: 'Informe Ejecutivo & Costos', icon: BookOpenCheck }
  ];

  const handleRefreshRate = () => {
    const refreshed = {
      ...currentRate,
      date: new Date().toISOString().split('T')[0],
      source: 'Banco Central de Venezuela (Sincronizado)'
    };
    setCurrentRate(refreshed);
  };

  const handlePrintActive = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Top Company Bar & BCV Ticker */}
      <MultiCompanyManagerBar
        selectedCompany={selectedCompany}
        onSelectCompany={setSelectedCompany}
        currentRate={currentRate}
        onRefreshRate={handleRefreshRate}
        onPrintActiveView={handlePrintActive}
        onNavigateToDashboard={() => setActiveModule('DASHBOARD')}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Concentrador de Páginas & Header Pastel (Cuadrito Concentrador de Módulos) */}
        <div className="mb-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-xs no-print text-slate-900 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0 font-bold shadow-2xs">
                <Globe className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 flex flex-wrap items-center gap-2">
                  <span>Agrícola Oni C.A. &middot; Intermediación & Importación de Café</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-md font-bold font-mono">
                    Déficit Nacional Cubierto con Importación
                  </span>
                </h2>
                <p className="text-xs text-slate-600 max-w-3xl mt-1 leading-relaxed font-medium">
                  Recepción de anticipos en ventas en Banesco &rarr; Compra de dólares a Banesco en Mesa de Cambio &rarr; Pago de café en Colombia y flete &rarr; Facturación a clientes en Octubre.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveModule('DASHBOARD')}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Panel Principal</span>
              </button>
              <button
                onClick={() => setActiveModule('IMPORT_AND_ADVANCES')}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Ship className="w-3.5 h-3.5" />
                <span>Flujo Importación</span>
              </button>
            </div>
          </div>

          {/* Concentrador Visual de Módulos (Cuadrados Pequeños) */}
          <div className="pt-3 border-t border-emerald-200/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Acceso Rápido Concentrado (19 Páginas del Expediente):
              </span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                Módulo Activo: {navItems.find(i => i.id === activeModule)?.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    title={item.label}
                    className={`p-2 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between items-start gap-1 cursor-pointer text-xs ${
                      isActive
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs font-bold scale-[1.02]'
                        : 'bg-white/80 hover:bg-emerald-100/90 text-slate-800 border-slate-200 hover:border-emerald-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />}
                    </div>
                    <span className="text-[10px] leading-tight line-clamp-1 font-semibold">
                      {item.label.split(' ')[0]} {item.label.split(' ')[1] || ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-4 no-print">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-3 shadow-xs">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center justify-between border-b border-slate-100 mb-2">
                <span>Módulos del Sistema</span>
                <span className="text-emerald-700 font-bold">SIEVEX 2026</span>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-700 text-white shadow-xs font-bold'
                          : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium ${
                            isActive
                              ? 'bg-emerald-900/90 text-emerald-100'
                              : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Context Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-4 text-xs space-y-2 shadow-xs text-slate-700">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Info className="w-4 h-4 text-emerald-700" />
                <span>Modelo Intermediario</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Empresa: <strong className="text-slate-900">{selectedCompany.name}</strong>
                <br />
                Actividad: <span className="text-emerald-800 font-semibold">Intermediación e Importación</span>
                <br />
                RIF: <strong className="font-mono text-slate-900">{selectedCompany.rif}</strong>
                <br />
                Cta Banesco VES: <span className="font-mono text-[10px] text-slate-600">{selectedCompany.banescoAccountVES}</span>
              </p>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500">
                <span>Facturación: Octubre 2026</span>
                <span className="text-emerald-700 font-semibold">100% Conforme</span>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            {activeModule === 'DASHBOARD' && (
              <DashboardOverviewView
                company={selectedCompany}
                currentRate={currentRate}
                onNavigate={(m) => setActiveModule(m)}
                totalLoaded={totalLoaded}
              />
            )}

            {activeModule === 'IMPORT_AND_ADVANCES' && (
              <CoffeeImportAndAdvancesManagerView
                company={selectedCompany}
                currentRate={currentRate}
              />
            )}

            {activeModule === 'FINANCIAL_STATEMENTS_DUAL_SHEET' && (
              <DualCurrencyFinancialStatementsSheetView
                company={selectedCompany}
                currentRate={currentRate}
              />
            )}

            {activeModule === 'ACCOUNTING_SHEET' && (
              <AccountingSheetFullJournalView
                company={selectedCompany}
                currentRate={currentRate}
              />
            )}

            {activeModule === 'FISCAL_AUDITOR_REPORT' && (
              <FiscalAuditorCrossCheckReportView />
            )}

            {activeModule === 'SENIAT_LEGAL_ENTITIES' && (
              <LegalEntitiesSeniatRifListView />
            )}

            {activeModule === 'FINANCIAL_STATEMENTS_BECERRA' && (
              <FinancialStatementsAndBecerraSuiteView
                company={selectedCompany}
                currentRate={currentRate}
              />
            )}

            {activeModule === 'BANESCO_LETTER_FULL' && (
              <AgricolaOniBanescoResponseLetterView
                company={selectedCompany}
                onSwitchToOnePage={() => setActiveModule('BANESCO_LETTER_ONE_PAGE')}
              />
            )}

            {activeModule === 'BANESCO_LETTER_ONE_PAGE' && (
              <AgricolaOniBanescoOnePageLetterView
                company={selectedCompany}
                currentRate={currentRate}
                onBackToFullLetter={() => setActiveModule('BANESCO_LETTER_FULL')}
              />
            )}

            {activeModule === 'BANESCO_RECONCILIATION_NOTE' && (
              <BanescoReconciliationNoteSheetView
                company={selectedCompany}
                currentRate={currentRate}
                onNavigateToAuditSheet={() => setActiveModule('BANESCO_AUDIT_SHEET')}
              />
            )}

            {activeModule === 'BANESCO_AUDIT_SHEET' && (
              <AgricolaOniBankAuditSheetView
                company={selectedCompany}
                currentRate={currentRate}
              />
            )}

            {activeModule === 'BANESCO_LEDGER' && (
              <BanescoLedgerAndCashTrailView
                company={selectedCompany}
                currentRate={currentRate}
              />
            )}

            {activeModule === 'ACCOUNTING_SUITE' && (
              <AgricolaOniAccountingAndVouchersSuiteView
                company={selectedCompany}
                currentRate={currentRate}
              />
            )}

            {activeModule === 'BCV_RATES' && (
              <BcvRatesManagerPanel
                currentRate={currentRate}
                onUpdateRate={(newRate) => setCurrentRate(newRate)}
              />
            )}

            {activeModule === 'VIGILANTES_PAYROLL' && (
              <VigilantesPayrollView
                company={selectedCompany}
                currentRate={currentRate}
              />
            )}

            {activeModule === 'LEGAL_CONTRACTS' && (
              <LegalShieldContractsView company={selectedCompany} />
            )}

            {activeModule === 'RECEIPT_GENERATOR' && (
              <ReceiptGeneratorView
                company={selectedCompany}
                currentRate={currentRate}
              />
            )}

            {activeModule === 'SECURITY_CENTER' && (
              <SecurityDatabaseCenterView company={selectedCompany} />
            )}

            {activeModule === 'RESEARCH_REPORT' && (
              <DeepResearchAndUxReportView company={selectedCompany} />
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-50/90 via-teal-50/90 to-sky-50/90 border-t border-emerald-200/90 py-4 mt-auto text-xs text-slate-700 font-medium no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif-doc font-bold text-emerald-950 text-sm">NOMINUS &middot; Agrícola Oni C.A.</span>
            <span>&mdash;</span>
            <span className="text-slate-600">Intermediación Comercial, Anticipos en Ventas e Importación de Café 2026</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600">
            <span>Banesco Cta Corriente</span>
            <span>&middot;</span>
            <span className="text-emerald-800 font-bold">Mesa de Cambio Oficial</span>
            <span>&middot;</span>
            <span>Facturación Octubre</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <MainAppContent />
    </AppDataProvider>
  );
}
