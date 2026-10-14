import React from 'react';
import {
  Globe,
  Scale,
  BookOpen,
  ShieldCheck,
  Building2,
  TrendingUp,
  FileCheck,
  FileText,
  Printer,
  BookOpenCheck,
  FileSpreadsheet,
  DollarSign,
  Users,
  Receipt,
  Database,
  ArrowRight,
  Ship,
  Sparkles,
  CheckCircle2,
  Award,
  BadgeCheck,
  ChevronRight,
  PieChart,
  Layers,
  FolderArchive,
  Download,
  FileDown
} from 'lucide-react';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import { ActiveModule } from '../App';
import { exportMasterBanescoComplianceFolderPdf, exportMasterBanescoComplianceFolderWord } from '../utils/exportUtils';

interface DashboardOverviewViewProps {
  company: CompanyProfile;
  currentRate: BcvRateItem;
  onNavigate: (module: ActiveModule) => void;
  totalLoaded: number;
}

export const DashboardOverviewView: React.FC<DashboardOverviewViewProps> = ({
  company,
  currentRate,
  onNavigate,
  totalLoaded
}) => {
  // Categorized modules with pastel colors and descriptions
  const categories = [
    {
      title: 'Estados Financieros, Banco & Conciliación',
      subtitle: 'Balance Dual (Bs./USD), Flujo de Entrega y Conciliación Bancaria',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      modules: [
        {
          id: 'BANESCO_FOLDER_WORKFLOW' as ActiveModule,
          title: 'Flujo & Carpeta Exp. Banesco',
          subtitle: 'Guía paso a paso, 5 separadores A-E y lista de chequeo para Banesco',
          icon: FolderArchive,
          badge: 'Carpeta Bank',
          pastelBg: 'bg-amber-50/90 hover:bg-amber-100/90 border-amber-300/80 text-amber-950 font-bold',
          iconBg: 'bg-amber-200 text-amber-900'
        },
        {
          id: 'FINANCIAL_STATEMENTS_DUAL_SHEET' as ActiveModule,
          title: 'EEFF Dual (Bs. & USD) + Excel',
          subtitle: 'Balance General, G&P y Balance de Comprobación al 31/08/2026',
          icon: Scale,
          badge: '31-08-2026',
          pastelBg: 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200/80 text-emerald-950',
          iconBg: 'bg-emerald-200/70 text-emerald-800'
        },
        {
          id: 'FINANCIAL_STATEMENTS_BECERRA' as ActiveModule,
          title: 'EEFF 2025-2026 & Contrato Becerra',
          subtitle: 'Análisis de Mutuo Cambiario e Intereses Financieros Becerra',
          icon: TrendingUp,
          badge: 'Auditoría',
          pastelBg: 'bg-teal-50/80 hover:bg-teal-100/80 border-teal-200/80 text-teal-950',
          iconBg: 'bg-teal-200/70 text-teal-800'
        },
        {
          id: 'BANESCO_RECONCILIATION_NOTE' as ActiveModule,
          title: 'Nota Conciliación Banesco',
          subtitle: 'Explicación contable del promedio Bs. 2.781.830,18/mes',
          icon: Printer,
          badge: 'Hoja Impresión',
          pastelBg: 'bg-sky-50/80 hover:bg-sky-100/80 border-sky-200/80 text-sky-950',
          iconBg: 'bg-sky-200/70 text-sky-800'
        },
        {
          id: 'BANESCO_AUDIT_SHEET' as ActiveModule,
          title: 'Auditoría & Conciliación Banco',
          subtitle: 'Cruces de abonos Banesco, orígenes y análisis por mes',
          icon: ShieldCheck,
          badge: 'Banesco',
          pastelBg: 'bg-blue-50/80 hover:bg-blue-100/80 border-blue-200/80 text-blue-950',
          iconBg: 'bg-blue-200/70 text-blue-800'
        },
        {
          id: 'BANESCO_LETTER_FULL' as ActiveModule,
          title: 'Carta Respuesta Banesco Completa',
          subtitle: 'Alegatos legales y bancarios completos firmados',
          icon: FileCheck,
          badge: 'Oficial',
          pastelBg: 'bg-indigo-50/80 hover:bg-indigo-100/80 border-indigo-200/80 text-indigo-950',
          iconBg: 'bg-indigo-200/70 text-indigo-800'
        },
        {
          id: 'BANESCO_LETTER_ONE_PAGE' as ActiveModule,
          title: 'Carta 1 Página Banesco',
          subtitle: 'Resumen ejecutivo de 1 hoja listo para entregar al banco',
          icon: FileText,
          badge: '1 Hoja',
          pastelBg: 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-300/80 text-slate-900',
          iconBg: 'bg-slate-300/70 text-slate-800'
        },
        {
          id: 'BANESCO_LEDGER' as ActiveModule,
          title: 'Libro Auxiliar Banesco & Caja',
          subtitle: 'Listado de movimientos bancarios y arqueo de caja chica',
          icon: BookOpen,
          badge: 'Bancos',
          pastelBg: 'bg-cyan-50/80 hover:bg-cyan-100/80 border-cyan-200/80 text-cyan-950',
          iconBg: 'bg-cyan-200/70 text-cyan-800'
        }
      ]
    },
    {
      title: 'Operaciones de Café Nacional, Anticipos & Contratos',
      subtitle: 'Intermediación comercial con empresas venezolanas, acopio y tasa BCV',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      modules: [
        {
          id: 'IMPORT_AND_ADVANCES' as ActiveModule,
          title: 'Anticipos en Bs. & Café Nacional',
          subtitle: 'Cadena de valor: Anticipos en Bs. (BCV) &rarr; Acopio Nacional &rarr; Facturación Octubre',
          icon: Globe,
          badge: 'Flujo Principal',
          pastelBg: 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200/80 text-amber-950',
          iconBg: 'bg-amber-200/70 text-amber-800'
        },
        {
          id: 'RECEIPT_GENERATOR' as ActiveModule,
          title: 'Recibos & Pesaje de Café',
          subtitle: 'Generación de recibos de recepción y pesaje de café en lote',
          icon: Receipt,
          badge: 'Campo',
          pastelBg: 'bg-orange-50/80 hover:bg-orange-100/80 border-orange-200/80 text-orange-950',
          iconBg: 'bg-orange-200/70 text-orange-800'
        }
      ]
    },
    {
      title: 'Contabilidad ERP, Comprobantes & Blindaje Legal',
      subtitle: 'Libro Diario ERP, Retenciones IVA/ISLR, RIF SENIAT y Contratos',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      modules: [
        {
          id: 'ACCOUNTING_SHEET' as ActiveModule,
          title: 'Hoja de Contabilidad & Asientos',
          subtitle: 'Asientos contables completos para importar a sistema ERP (Excel/PDF)',
          icon: BookOpen,
          badge: 'Diario ERP',
          pastelBg: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/80 text-purple-950',
          iconBg: 'bg-purple-200/70 text-purple-800'
        },
        {
          id: 'ACCOUNTING_SUITE' as ActiveModule,
          title: 'Comprobantes & Retenciones',
          subtitle: 'Comprobantes de retención IVA, ISLR y voucher contable',
          icon: FileSpreadsheet,
          badge: 'Vouchers',
          pastelBg: 'bg-fuchsia-50/80 hover:bg-fuchsia-100/80 border-fuchsia-200/80 text-fuchsia-950',
          iconBg: 'bg-fuchsia-200/70 text-fuchsia-800'
        },
        {
          id: 'FISCAL_AUDITOR_REPORT' as ActiveModule,
          title: 'Auditoría Fiscal Proveedores',
          subtitle: 'Reporte de validación de proveedores y retenciones fiscales',
          icon: ShieldCheck,
          badge: 'Auditor',
          pastelBg: 'bg-violet-50/80 hover:bg-violet-100/80 border-violet-200/80 text-violet-950',
          iconBg: 'bg-violet-200/70 text-violet-800'
        },
        {
          id: 'SENIAT_LEGAL_ENTITIES' as ActiveModule,
          title: 'Clientes Jurídicos & RIF SENIAT',
          subtitle: 'Directorio de RIFs de empresas compradoras de café',
          icon: Building2,
          badge: 'SENIAT',
          pastelBg: 'bg-rose-50/80 hover:bg-rose-100/80 border-rose-200/80 text-rose-950',
          iconBg: 'bg-rose-200/70 text-rose-800'
        },
        {
          id: 'LEGAL_CONTRACTS' as ActiveModule,
          title: 'Blindaje Legal & Contratos',
          subtitle: 'Contratos de anticipo, mutuo cambiario y préstamos accionistas',
          icon: Scale,
          badge: 'Contratos',
          pastelBg: 'bg-stone-100 hover:bg-stone-200/80 border-stone-300 text-stone-900',
          iconBg: 'bg-stone-300/70 text-stone-800'
        }
      ]
    },
    {
      title: 'Tasas BCV, Nómina & Base de Datos',
      subtitle: 'Sincronización cambiaria, control de personal y respaldo de datos',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      modules: [
        {
          id: 'BCV_RATES' as ActiveModule,
          title: 'Tasas BCV & Calculadora',
          subtitle: 'Sincronizador oficial de tipo de cambio BCV USD/EUR',
          icon: DollarSign,
          badge: 'Mesa Cambio',
          pastelBg: 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200/80 text-emerald-950',
          iconBg: 'bg-emerald-200/70 text-emerald-800'
        },
        {
          id: 'VIGILANTES_PAYROLL' as ActiveModule,
          title: 'Nómina & Seguridad',
          subtitle: 'Nómina de vigilantes y resguardo físico de depósitos de café',
          icon: Users,
          badge: 'Nómina',
          pastelBg: 'bg-lime-50/80 hover:bg-lime-100/80 border-lime-200/80 text-lime-950',
          iconBg: 'bg-lime-200/70 text-lime-800'
        },
        {
          id: 'SECURITY_CENTER' as ActiveModule,
          title: 'Base de Datos & Carga Real',
          subtitle: 'Resguardo de registros contables y carga de archivos',
          icon: Database,
          badge: 'Sistemas',
          pastelBg: 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900',
          iconBg: 'bg-slate-300/70 text-slate-800'
        },
        {
          id: 'RESEARCH_REPORT' as ActiveModule,
          title: 'Informe Ejecutivo & Costos',
          subtitle: 'Estudio técnico-económico de intermediación y compra de café nacional',
          icon: BookOpenCheck,
          badge: 'Informe',
          pastelBg: 'bg-indigo-50/80 hover:bg-indigo-100/80 border-indigo-200/80 text-indigo-950',
          iconBg: 'bg-indigo-200/70 text-indigo-800'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Master Expediente Completo Unificado Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border-2 border-amber-500/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 uppercase tracking-wider font-mono">
              <FolderArchive className="w-4 h-4 text-amber-400" />
              <span>EXPEDIENTE COMPLETO UNIFICADO BANESCO 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-serif-doc">
              Carpeta de Cumplimiento Consolidada para Entregar a Banesco
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              Descarga en <strong>UN SOLO ARCHIVO UNIFICADO</strong> todo el expediente listo para imprimir (Portadas, Carta 1 Extendida, Carta 2 Ejecutiva de 1 Hoja, Conciliación $2,91M USD vs EEFF, Dictamen CPC, Soportes de Clientes y EEFF Auditados al 31/08/2026).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={async () => {
                await exportMasterBanescoComplianceFolderPdf({
                  companyName: company.name,
                  companyRif: company.rif,
                  address: company.address,
                  bcvRate: currentRate.rateUsd
                });
              }}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-amber-300"
              title="Descargar todo el expediente unido en 1 solo archivo PDF"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Descargar Expediente COMPLETO (PDF)</span>
            </button>

            <button
              onClick={async () => {
                await exportMasterBanescoComplianceFolderWord({
                  companyName: company.name,
                  companyRif: company.rif,
                  address: company.address,
                  bcvRate: currentRate.rateUsd
                });
              }}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-blue-400"
              title="Descargar todo el expediente unido en 1 solo archivo Word (.docx) editable"
            >
              <FileDown className="w-4 h-4 text-white" />
              <span>Descargar Expediente COMPLETO (Word)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Hero / Pastel Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Panel Principal &middot; Sistema SIEVEX 2026</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-serif-doc">
              Bienvenido al Panel Ejecutivo de <span className="text-emerald-800">{company.name}</span>
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              Plataforma contable, bancaria y de intermediación comercial de café nacional. Selecciona cualquiera de las secciones en los recuadros a continuación para acceder directamente al módulo correspondiente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('FINANCIAL_STATEMENTS_DUAL_SHEET')}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Scale className="w-4 h-4" />
              <span>Ver EEFF Duales al 31-08-2026</span>
            </button>
            <button
              onClick={() => onNavigate('BANESCO_RECONCILIATION_NOTE')}
              className="px-4 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Nota Banesco Imprimir</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-200/60">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Promedio Banesco</p>
              <p className="text-sm font-bold text-slate-900 font-mono-num">Bs. 2.781.830,18 / mes</p>
              <p className="text-[10px] text-emerald-700 font-semibold">100% Cuadrado con Banco</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-amber-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Volumen de Café</p>
              <p className="text-sm font-bold text-slate-900 font-mono-num">18.000 Qq Acopiados</p>
              <p className="text-[10px] text-emerald-700 font-semibold">Café Nacional Venezuela</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-sky-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Tasa Oficial BCV</p>
              <p className="text-sm font-bold text-slate-900 font-mono-num">Bs. {currentRate.rateUsd.toFixed(2)} / USD</p>
              <p className="text-[10px] text-sky-700 font-semibold">Mesa de Cambio Banesco</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Balance Comprobación</p>
              <p className="text-sm font-bold text-slate-900 font-mono-num">Bs. 423.160.876,03</p>
              <p className="text-[10px] text-purple-700 font-semibold">Débitos = Créditos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Categories and Modules (Cuadrados Pequeños) */}
      <div className="space-y-8">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-3">
            {/* Category Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span>{cat.title}</span>
                </h2>
                <p className="text-xs text-slate-500">{cat.subtitle}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
                {cat.modules.length} Módulos
              </span>
            </div>

            {/* Square Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cat.modules.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => onNavigate(m.id)}
                    className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer ${m.pastelBg}`}
                  >
                    <div>
                      {/* Top icon and badge row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className={`p-2.5 rounded-xl ${m.iconBg} group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-white/70 text-slate-700 border border-slate-200/60 shadow-2xs">
                          {m.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xs font-bold mb-1 leading-snug group-hover:text-emerald-900 transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-[11px] opacity-80 leading-relaxed line-clamp-2">
                        {m.subtitle}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-2 border-t border-slate-900/5 flex items-center justify-between text-[11px] font-semibold text-slate-600 group-hover:text-slate-900">
                      <span>Ingresar al módulo</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-slate-500" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
