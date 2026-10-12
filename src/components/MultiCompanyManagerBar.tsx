import React from 'react';
import { Building2, ShieldCheck, TrendingUp, RefreshCw, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { COMPANIES, CompanyProfile, BcvRateItem } from '../data/nominusData';

interface Props {
  selectedCompany: CompanyProfile;
  onSelectCompany: (company: CompanyProfile) => void;
  currentRate: BcvRateItem;
  onRefreshRate: () => void;
  onPrintActiveView: () => void;
}

export const MultiCompanyManagerBar: React.FC<Props> = ({
  selectedCompany,
  onSelectCompany,
  currentRate,
  onRefreshRate,
  onPrintActiveView
}) => {
  return (
    <header className="bg-stone-950 border-b border-stone-800 text-stone-200 sticky top-0 z-40 shadow-xl backdrop-blur-md">
      {/* Top Banner / Corporate Credentials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-stone-800/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-500 font-semibold tracking-wide">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            EXPEDIENTE BANCARIO & CONTABLE 2026
          </span>
          <span className="text-stone-600 hidden sm:inline">|</span>
          <span className="text-stone-400 hidden sm:inline">
            SUDEBAN &middot; SENIAT &middot; CVC &middot; BANESCO BANCO UNIVERSAL
          </span>
        </div>

        {/* BCV Exchange Rate Pill / Live Indicator */}
        <div className="flex items-center gap-3 font-mono-num">
          <div className="flex items-center gap-2 bg-stone-900 border border-stone-700/80 px-2.5 py-1 rounded">
            <span className="text-stone-400 font-sans font-medium text-[11px]">BCV USD:</span>
            <span className="text-emerald-400 font-semibold">Bs. {currentRate.rateUsd.toFixed(2)}</span>
            <span className="text-stone-500 text-[10px]">({currentRate.date})</span>
          </div>

          <div className="flex items-center gap-2 bg-stone-900 border border-stone-700/80 px-2.5 py-1 rounded hidden md:flex">
            <span className="text-stone-400 font-sans font-medium text-[11px]">BCV EUR:</span>
            <span className="text-amber-300 font-semibold">Bs. {currentRate.rateEur.toFixed(2)}</span>
          </div>

          <button
            onClick={onRefreshRate}
            title="Sincronizar tasa oficial BCV"
            className="p-1 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Bar / Company Selector & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Company Identity & Dropdown */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 flex items-center justify-center text-white shadow-md border border-amber-600/40 font-serif-doc text-xl font-bold tracking-tight">
            AO
          </div>

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
                className="bg-stone-900 border border-stone-700 text-stone-100 text-sm font-bold rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {COMPANIES.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name} &mdash; RIF: {company.rif}
                  </option>
                ))}
              </select>

              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" />
                Contribuyente Especial
              </span>
            </div>

            <div className="text-xs text-stone-400 mt-1 flex flex-wrap items-center gap-2 font-mono-num">
              <span>RIF: {selectedCompany.rif}</span>
              <span>&middot;</span>
              <span>Cta Banesco: {selectedCompany.banescoAccountVES}</span>
              <span className="hidden sm:inline">&middot;</span>
              <span className="hidden sm:inline text-stone-300">{selectedCompany.sector}</span>
            </div>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onPrintActiveView}
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-stone-400" />
            <span>Imprimir Vista Oficial</span>
          </button>

          <div className="bg-amber-950/50 border border-amber-800/60 px-3 py-1.5 rounded-md text-xs flex items-center gap-2 text-amber-200">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">Auditoría Banesco: 100% Conforme</span>
          </div>
        </div>
      </div>
    </header>
  );
};
