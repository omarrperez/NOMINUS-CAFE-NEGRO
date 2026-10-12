import React, { useState } from 'react';
import {
  FileText,
  User,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Plus,
  Trash2,
  AlertTriangle,
  Building,
  CreditCard,
  Upload
} from 'lucide-react';
import { DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { formatBs, formatDateVE, formatUSD } from '../utils/formatters';
import { downloadPdfTapaExpediente, downloadPdfContratoCompraventa, downloadPdfCuestionarioKYC } from '../utils/pdfGenerator';
import { exportExpedienteIndividualExcel } from '../utils/excelGenerator';

interface ExpedientesViewProps {
  expedientes: ExpedienteOperacion[];
  empresa: DatosEmpresaImportadora;
  onOpenExpediente: (op: ExpedienteOperacion) => void;
  onNewExpediente: () => void;
  onDeleteExpediente: (id: string) => void;
  onOpenCsvImport?: () => void;
}

export const ExpedientesView: React.FC<ExpedientesViewProps> = ({
  expedientes,
  empresa,
  onOpenExpediente,
  onNewExpediente,
  onDeleteExpediente,
  onOpenCsvImport,
}) => {
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState<string>('todos');

  const filtered = expedientes.filter((op) => {
    const matchesSearch =
      op.numeroExpediente.toLowerCase().includes(search.toLowerCase()) ||
      op.cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
      op.cliente.cedula.toLowerCase().includes(search.toLowerCase()) ||
      op.cliente.producto.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filterState === 'todos' || op.estado.toLowerCase() === filterState.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado en colores pasteles */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                Expedientes de Personas Naturales
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                Diligencia Debida Individual
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Un expediente por cliente y operación: control de KYC, titularidad del anticipo, divisas y entrega.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenCsvImport && (
              <button
                onClick={onOpenCsvImport}
                className="flex items-center gap-1.5 rounded-xl bg-amber-100/90 px-3.5 py-2 text-xs font-semibold text-amber-950 border border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer shadow-xs"
              >
                <Upload className="h-4 w-4 text-amber-800" />
                <span>Cargar Lista CSV / Originar</span>
              </button>
            )}

            <button
              onClick={onNewExpediente}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Nuevo Expediente</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, cédula o producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-2 pl-9 pr-3 text-xs placeholder:text-stone-400 focus:border-amber-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white p-1 text-xs">
          <button
            onClick={() => setFilterState('todos')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterState === 'todos' ? 'bg-stone-100 font-semibold text-stone-900' : 'text-stone-600'
            }`}
          >
            Todos ({expedientes.length})
          </button>
          <button
            onClick={() => setFilterState('en proceso')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterState === 'en proceso' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-stone-600'
            }`}
          >
            En Proceso
          </button>
          <button
            onClick={() => setFilterState('en aduana')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterState === 'en aduana' ? 'bg-sky-100 text-sky-900 font-semibold' : 'text-stone-600'
            }`}
          >
            En Aduana
          </button>
          <button
            onClick={() => setFilterState('cerrado')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filterState === 'cerrado' ? 'bg-emerald-100 text-emerald-900 font-semibold' : 'text-stone-600'
            }`}
          >
            Cerrados
          </button>
        </div>
      </div>

      {/* Grid de Expedientes o Estado Vacío */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/50 p-10 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-800">
            No hay expedientes para mostrar
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {expedientes.length === 0
              ? 'La base de datos está limpia. Puedes originar expedientes cargando tu archivo CSV o creando uno nuevo.'
              : 'No se encontraron expedientes que coincidan con los filtros de búsqueda.'}
          </p>
          {onOpenCsvImport && (
            <div className="pt-2">
              <button
                onClick={onOpenCsvImport}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-xs cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-amber-400" />
                <span>Cargar Lista CSV / Originar Expedientes</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((op) => {
          const docsOk = Object.values(op.documentos).filter(Boolean).length;
          const totalDocs = Object.keys(op.documentos).length;
          const pct = Math.round((docsOk / totalDocs) * 100);

          const statusBadge =
            op.estado === 'Cerrado'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : op.estado === 'En aduana'
              ? 'bg-sky-50 text-sky-800 border-sky-200'
              : 'bg-amber-50 text-amber-800 border-amber-200';

          return (
            <div
              key={op.id}
              className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs hover:border-amber-300/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Cabecera de Tarjeta */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-stone-500">
                      EXPEDIENTE {op.numeroExpediente}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 line-clamp-1 mt-0.5">
                      {op.cliente.nombre}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono">
                      {op.cliente.cedula} · {op.cliente.rif || 'Sin RIF'}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${statusBadge}`}>
                    {op.estado}
                  </span>
                </div>

                {/* Datos del Pedido y Rubro */}
                <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50/70 p-3 text-xs space-y-1.5">
                  <div className="flex justify-between text-stone-600">
                    <span className="text-stone-400">Producto:</span>
                    <span className="font-medium text-stone-800">{op.cliente.producto}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span className="text-stone-400">Origen / Cantidad:</span>
                    <span className="text-stone-800">{op.cliente.origen} · {op.cliente.cantidad}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span className="text-stone-400">Proveedor:</span>
                    <span className="text-stone-800 truncate max-w-[170px]">{op.proveedor.nombreProveedor}</span>
                  </div>
                </div>

                {/* Datos Financieros Bancarios */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-amber-100 bg-amber-50/40 p-2">
                    <span className="text-[10px] text-amber-800 font-medium block">Anticipo en Bs.</span>
                    <span className="font-mono font-bold text-amber-900 text-xs">
                      {formatBs(op.anticipo.montoBs)}
                    </span>
                    <span className="text-[10px] text-stone-500 block truncate">
                      {op.anticipo.bancoOrigen}
                    </span>
                  </div>

                  <div className="rounded-lg border border-sky-100 bg-sky-50/40 p-2">
                    <span className="text-[10px] text-sky-800 font-medium block">Divisas BCV</span>
                    <span className="font-mono font-bold text-sky-900 text-xs">
                      {formatUSD(op.divisas.montoUsd)}
                    </span>
                    <span className="text-[10px] text-stone-500 block">
                      Tasa: {op.divisas.tasaBCV} Bs/USD
                    </span>
                  </div>
                </div>

                {/* Barra de Progreso Documental (SUDEBAN) */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                    <span>Recaudos SUDEBAN / Banco</span>
                    <span className="font-mono font-medium">{docsOk}/{totalDocs} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct === 100 ? 'bg-emerald-500' : pct > 60 ? 'bg-amber-500' : 'bg-sky-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Alerta de Debida Diligencia si titular no coincide */}
                {!op.anticipo.titularCoincide && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 p-2 text-[11px] text-rose-800">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                    <span>ALERTA SUDEBAN: El pagador no coincide con el titular del contrato.</span>
                  </div>
                )}
              </div>

              {/* Acciones de la Tarjeta con Botones de Descarga solicitados */}
              <div className="mt-5 pt-3 border-t border-stone-100 space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => downloadPdfTapaExpediente(op, empresa)}
                    className="flex items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50/60 px-2 py-1.5 text-[11px] font-medium text-rose-800 hover:bg-rose-100/70 transition-colors cursor-pointer"
                    title="Descargar Tapa y Checklist del Expediente en PDF"
                  >
                    <Download className="h-3 w-3 text-rose-700" />
                    <span>Tapa PDF</span>
                  </button>

                  <button
                    onClick={() => exportExpedienteIndividualExcel(op, empresa)}
                    className="flex items-center justify-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50/60 px-2 py-1.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100/70 transition-colors cursor-pointer"
                    title="Descargar Ficha Completa del Expediente en Excel (.xlsx)"
                  >
                    <FileSpreadsheet className="h-3 w-3 text-emerald-700" />
                    <span>Ficha Excel</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenExpediente(op)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-stone-900 px-3 py-2 text-xs font-medium text-white hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Gestionar Expediente</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Está seguro de eliminar el expediente ${op.numeroExpediente}?`)) {
                        onDeleteExpediente(op.id);
                      }
                    }}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Eliminar expediente"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
