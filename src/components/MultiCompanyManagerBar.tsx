import React from 'react';
import { Building2, ShieldCheck, TrendingUp, RefreshCw, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { COMPANIES, CompanyProfile, BcvRateItem } from '../data/nominusData';

interface Props {
  selectedCompany: CompanyProfile;
  onSelectCompany: (company: CompanyProfile) => void;
  currentRate: BcvRateItem;
  onRefreshRate: () => void;
  onPrintActiveView: () => void;
  onNavigateToDashboard?: () => void;
}

export const MultiCompanyManagerBar: React.FC<Props> = ({
  selectedCompany,
  onSelectCompany,
  currentRate,
  onRefreshRate,
  onPrintActiveView,
  onNavigateToDashboard
}) => {
  return (
    <header className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-b border-emerald-200/90 text-slate-800 sticky top-0 z-40 shadow-xs backdrop-blur-md">
      {/* Top Banner / Corporate Credentials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-emerald-200/60 bg-white/40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-900 font-bold tracking-wide">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            SISTEMA INTEGRAL SIEVEX &middot; EXPEDIENTE BANCARIO 2026
          </span>
          <span className="text-emerald-300 hidden sm:inline">|</span>
          <span className="text-slate-600 font-medium hidden sm:inline">
            SUDEBAN &middot; SENIAT &middot; CVC &middot; BANESCO BANCO UNIVERSAL
          </span>
        </div>

        {/* BCV Exchange Rate Pill / Live Indicator */}
        <div className="flex items-center gap-2.5 font-mono-num">
          <div className="flex items-center gap-2 bg-white/90 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs shadow-2xs">
            <span className="text-slate-600 font-sans font-medium text-[11px]">BCV USD:</span>
            <span className="text-emerald-800 font-bold">Bs. {currentRate.rateUsd.toFixed(2)}</span>
            <span className="text-slate-400 text-[10px]">({currentRate.date})</span>
          </div>

          <div className="flex items-center gap-2 bg-white/90 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs shadow-2xs hidden md:flex">
            <span className="text-slate-600 font-sans font-medium text-[11px]">BCV EUR:</span>
            <span className="text-amber-800 font-bold">Bs. {currentRate.rateEur.toFixed(2)}</span>
          </div>

          <button
            onClick={onRefreshRate}
            title="Sincronizar tasa oficial BCV"
            className="p-1.5 text-slate-600 hover:text-emerald-900 hover:bg-emerald-100/80 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Bar / Company Selector & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Company Identity & Dropdown */}
        <div className="flex items-center gap-3">
          {onNavigateToDashboard ? (
            <button
              onClick={onNavigateToDashboard}
              title="Ir al Dashboard Principal"
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white shadow-xs border border-emerald-300 font-serif-doc text-lg font-bold tracking-tight transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              AO
            </button>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs border border-emerald-300 font-serif-doc text-lg font-bold tracking-tight shrink-0">
              AO
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="company-select" className="sr-only">Seleccionar Empresa</label>
              <select
                id="company-select"
                value={selectedCompany.id}
                onChange={(e) => {
                  const found = COMPANIES.find(c => c.id === e.target.value);
                  if (found) onSelectCompany(found);
                }}
                className="bg-white border border-emerald-300 text-slate-900 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
              >
                {COMPANIES.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name} &mdash; RIF: {company.rif}
                  </option>
                ))}
              </select>

              <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Contribuyente Especial
              </span>
            </div>

            <div className="text-[11px] text-slate-600 mt-0.5 flex flex-wrap items-center gap-2 font-mono-num font-medium">
              <span>RIF: {selectedCompany.rif}</span>
              <span>&middot;</span>
              <span>Cta Banesco: {selectedCompany.banescoAccountVES}</span>
              <span className="hidden sm:inline">&middot;</span>
              <span className="hidden sm:inline text-emerald-800 font-semibold">{selectedCompany.sector}</span>
            </div>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {onNavigateToDashboard && (
            <button
              onClick={onNavigateToDashboard}
              className="flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <span>🏠 Inicio Dashboard</span>
            </button>
          )}

          <button
            onClick={onPrintActiveView}
            className="flex items-center gap-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-sky-700" />
            <span>Imprimir Vista</span>
          </button>

          <div className="bg-teal-100 border border-teal-300 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-teal-900 font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span className="text-[11px]">Banesco 100% Conforme</span>
          </div>
        </div>
      </div>
    </header>
  );
};
