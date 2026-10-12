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
import { LegalEntitiesSeniatRifListView } from './components/LegalEntitiesSeniatRifListView';
import { FiscalAuditorCrossCheckReportView } from './components/FiscalAuditorCrossCheckReportView';

export type ActiveModule =
  | 'IMPORT_AND_ADVANCES'
  | 'FISCAL_AUDITOR_REPORT'
  | 'FINANCIAL_STATEMENTS_BECERRA'
  | 'SENIAT_LEGAL_ENTITIES'
  | 'BANESCO_LETTER_FULL'
  | 'BANESCO_LETTER_ONE_PAGE'
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
  const [activeModule, setActiveModule] = useState<ActiveModule>('IMPORT_AND_ADVANCES');
  const { vouchers, bankMovements, customerAdvances, fxPurchases, importShipments } = useAppData();

  const totalLoaded = customerAdvances.length + fxPurchases.length + importShipments.length + vouchers.length + bankMovements.length;

  const navItems: { id: ActiveModule; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'IMPORT_AND_ADVANCES', label: 'Anticipos & Importación (Colombia)', icon: Globe, badge: 'Principal' },
    { id: 'FISCAL_AUDITOR_REPORT', label: 'Auditoría Fiscal Proveedores', icon: ShieldCheck, badge: 'Auditor' },
    { id: 'SENIAT_LEGAL_ENTITIES', label: 'Clientes Jurídicos & RIF SENIAT', icon: Building2, badge: 'SENIAT' },
    { id: 'FINANCIAL_STATEMENTS_BECERRA', label: 'EEFF 2025-2026 & Manuel Becerra', icon: TrendingUp, badge: 'Auditoría' },
    { id: 'BANESCO_LETTER_FULL', label: 'Carta Respuesta Banesco', icon: FileCheck, badge: 'Oficial' },
    { id: 'BANESCO_LETTER_ONE_PAGE', label: 'Carta 1 Página (Impresión)', icon: FileText, badge: '1 Hoja' },
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Company Bar & BCV Ticker */}
      <MultiCompanyManagerBar
        selectedCompany={selectedCompany}
        onSelectCompany={setSelectedCompany}
        currentRate={currentRate}
        onRefreshRate={handleRefreshRate}
        onPrintActiveView={handlePrintActive}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Model Banner: Intermediary & Importer */}
        <div className="mb-6 bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow no-print">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Agrícola Oni C.A. &middot; Intermediación & Importación de Café</span>
                <span className="text-[10px] bg-stone-800 text-amber-400 border border-stone-700 px-2 py-0.5 rounded font-mono">
                  Déficit Nacional Cubierto con Importación
                </span>
              </h2>
              <p className="text-xs text-stone-400 max-w-3xl mt-0.5 leading-relaxed">
                Recepción de anticipos en ventas en Banesco &rarr; Compra de dólares a Banesco en Mesa de Cambio &rarr; Pago de café en Colombia y flete &rarr; Facturación a clientes en Octubre.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModule('IMPORT_AND_ADVANCES')}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow shrink-0"
            >
              <Ship className="w-3.5 h-3.5" />
              <span>Ver Flujo de Importación</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-4 no-print">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 shadow-lg">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono flex items-center justify-between border-b border-stone-800 mb-2">
                <span>Módulos del Sistema</span>
                <span className="text-amber-500 font-bold">2026</span>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-amber-600 text-stone-950 shadow-md font-bold'
                          : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stone-950' : 'text-amber-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                            isActive
                              ? 'bg-stone-950/20 text-stone-950'
                              : 'bg-stone-800 text-stone-400 border border-stone-700/80'
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
            <div className="bg-stone-900/80 border border-stone-800/80 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-stone-300 font-bold">
                <Info className="w-4 h-4 text-amber-500" />
                <span>Modelo Intermediario</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Empresa: <strong className="text-stone-200">{selectedCompany.name}</strong>
                <br />
                Actividad: <span className="text-amber-300">Intermediación e Importación</span>
                <br />
                RIF: <strong className="font-mono text-stone-300">{selectedCompany.rif}</strong>
                <br />
                Cta Banesco VES: <span className="font-mono text-[10px] text-stone-400">{selectedCompany.banescoAccountVES}</span>
              </p>
              <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-[10px] text-stone-400">
                <span>Facturación: Octubre 2026</span>
                <span className="text-emerald-400 font-semibold">100% Conforme</span>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            {activeModule === 'IMPORT_AND_ADVANCES' && (
              <CoffeeImportAndAdvancesManagerView
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
      <footer className="bg-stone-950 border-t border-stone-800 py-4 mt-auto text-xs text-stone-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif-doc font-bold text-white text-sm">NOMINUS &middot; Agrícola Oni C.A.</span>
            <span>&mdash;</span>
            <span>Intermediación Comercial, Anticipos en Ventas e Importación de Café 2026</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Banesco Cta Corriente</span>
            <span>&middot;</span>
            <span>Mesa de Cambio Oficial</span>
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
