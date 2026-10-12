import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  ArrowRightLeft,
  BookOpen,
  FolderOpen,
  Building2,
  Plus,
  Coins,
  Calculator,
  Database,
  Upload,
  TrendingUp
} from 'lucide-react';
import { DatosEmpresaImportadora } from '../types';
import { formatTasaBCV } from '../utils/formatters';

export type ActiveTab = 'control-maestro' | 'expedientes' | 'rastro-efectivo' | 'contabilidad' | 'database' | 'documentos' | 'normativa';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  empresa: DatosEmpresaImportadora;
  onOpenConfig: () => void;
  onNewExpediente: () => void;
  onOpenCsvImport?: () => void;
  onOpenTasasModal?: () => void;
  totalExpedientes: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  empresa,
  onOpenConfig,
  onNewExpediente,
  onOpenCsvImport,
  onOpenTasasModal,
  totalExpedientes,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        
        {/* Zona 1: Identidad Minimalista en tonos pasteles */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/80 text-amber-900 shadow-xs border border-amber-200/60">
            <Coins className="h-5 w-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 tracking-tight text-base sm:text-lg">
                SIEVEX
              </span>
              <span className="text-xs font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200/60">
                SUDEBAN · BCV
              </span>
            </div>
            <p className="hidden sm:block text-xs text-stone-500 truncate max-w-xs md:max-w-md">
              Control de Expedientes y Trazabilidad Cambiaria · Venezuela
            </p>
          </div>
        </div>

        {/* Zona 2: Navegación de Pestañas con estilo pastel sutil */}
        <nav className="flex items-center gap-1 rounded-xl bg-stone-200/50 p-1 border border-stone-200">
          <button
            onClick={() => setActiveTab('control-maestro')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'control-maestro'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-amber-700" />
            <span>Control Maestro</span>
          </button>

          <button
            onClick={() => setActiveTab('expedientes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'expedientes'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5 text-sky-700" />
            <span>Expedientes</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 text-[10px] font-mono">
              {totalExpedientes}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rastro-efectivo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'rastro-efectivo'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-emerald-700" />
            <span>Rastro de Efectivo</span>
          </button>

          <button
            onClick={() => setActiveTab('contabilidad')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'contabilidad'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
            }`}
          >
            <Calculator className="h-3.5 w-3.5 text-indigo-700" />
            <span>Contabilidad</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'database'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
            }`}
          >
            <Database className="h-3.5 w-3.5 text-sky-700" />
            <span>Base de Datos</span>
          </button>

          <button
            onClick={() => setActiveTab('documentos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'documentos'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-rose-700" />
            <span>Documentos</span>
          </button>

          <button
            onClick={() => setActiveTab('normativa')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'normativa'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-stone-700" />
            <span>Marco Legal</span>
          </button>
        </nav>

        {/* Zona 3: Botones de Acción y Tasa BCV */}
        <div className="flex items-center gap-2">
          {/* Indicador de Empresa y Tasa BCV */}
          <button
            onClick={onOpenConfig}
            title={`Empresa Titular: ${empresa.razonSocial} (RIF ${empresa.rif}) · Tasa BCV: ${formatTasaBCV(empresa.tasaBCVActual)}`}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 hover:bg-amber-100/70 transition-colors cursor-pointer"
          >
            <Building2 className="h-3.5 w-3.5 text-amber-800 shrink-0" />
            <div className="flex flex-col items-start leading-tight">
              <span className="font-bold text-[11px] text-slate-800 truncate max-w-[140px]">{empresa.razonSocial}</span>
              <span className="font-mono text-[10px] text-stone-500">{empresa.rif} · {formatTasaBCV(empresa.tasaBCVActual)}</span>
            </div>
          </button>

          {onOpenTasasModal && (
            <button
              onClick={onOpenTasasModal}
              title="Ver el Historial Oficial de Tasas de Cambio BCV Enero - Agosto 2026 (159 Ruedas)"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-100/80 border border-amber-300 text-xs font-semibold text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
            >
              <TrendingUp className="h-3.5 w-3.5 text-amber-800" />
              <span>Tasas BCV 2026</span>
            </button>
          )}

          {onOpenCsvImport && (
            <button
              onClick={onOpenCsvImport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300/80 rounded-lg shadow-xs transition-all whitespace-nowrap cursor-pointer"
              title="Cargar archivo CSV / Excel o pegar texto para originar expedientes de Personas Naturales"
            >
              <Upload className="h-3.5 w-3.5 text-amber-800" />
              <span>Cargar CSV</span>
            </button>
          )}

          <button
            onClick={onNewExpediente}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-900 active:bg-slate-950 rounded-lg shadow-xs transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nuevo Expediente</span>
          </button>
        </div>

      </div>
    </header>
  );
};
