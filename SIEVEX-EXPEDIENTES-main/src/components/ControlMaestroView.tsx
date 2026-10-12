import React, { useState, useMemo } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Filter,
  DollarSign,
  Briefcase,
  AlertCircle,
  Upload,
  Trash2,
  Plus,
  Users
} from 'lucide-react';
import { DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { formatBs, formatDateVE, formatTasaBCV, formatUSD } from '../utils/formatters';
import { exportControlMaestroCsv, exportControlMaestroExcel, exportExpedienteIndividualExcel } from '../utils/excelGenerator';
import { downloadPdfTapaExpediente } from '../utils/pdfGenerator';
import { downloadCsvTemplate } from '../utils/csvOriginator';
import { ConciliacionBancariaModal } from './ConciliacionBancariaModal';

interface ControlMaestroViewProps {
  expedientes: ExpedienteOperacion[];
  empresa: DatosEmpresaImportadora;
  onOpenExpediente: (op: ExpedienteOperacion) => void;
  onNewExpediente: () => void;
  onOpenCsvImport?: () => void;
  onClearAllData?: () => void;
  onLoadRealCsvData?: () => void;
}

export const ControlMaestroView: React.FC<ControlMaestroViewProps> = ({
  expedientes,
  empresa,
  onOpenExpediente,
  onNewExpediente,
  onOpenCsvImport,
  onClearAllData,
  onLoadRealCsvData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [sortField, setSortField] = useState<string>('numeroExpediente');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [isConciliacionModalOpen, setIsConciliacionModalOpen] = useState(false);

  // Filtrado y ordenamiento
  const filteredExpedientes = useMemo(() => {
    return expedientes
      .filter((op) => {
        const matchesSearch =
          op.numeroExpediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.cliente.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.cliente.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.proveedor.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === 'todos' || op.estado.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA: any = (a as any)[sortField] ?? a.cliente.nombre;
        let valB: any = (b as any)[sortField] ?? b.cliente.nombre;

        if (sortField === 'montoBs') {
          valA = a.anticipo.montoBs;
          valB = b.anticipo.montoBs;
        } else if (sortField === 'montoUsd') {
          valA = a.divisas.montoUsd;
          valB = b.divisas.montoUsd;
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [expedientes, searchTerm, statusFilter, sortField, sortAsc]);

  // Cálculos de resumen financiero
  const totalAnticiposBs = useMemo(
    () => expedientes.reduce((acc, curr) => acc + (curr.anticipo.montoBs || 0), 0),
    [expedientes]
  );

  const totalDivisasUsd = useMemo(
    () => expedientes.reduce((acc, curr) => acc + (curr.divisas.montoUsd || 0), 0),
    [expedientes]
  );

  const totalCerrados = useMemo(
    () => expedientes.filter((op) => op.estado === 'Cerrado').length,
    [expedientes]
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra Superior con Paleta Pastel y Resumen */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                Control Maestro de Operaciones
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                Modelo Oficial de Trazabilidad
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Registro, conciliación y auditoría de compraventas con entrega futura y adquisición cambiaria BCV.
            </p>
          </div>

          {/* Botones de Acción: Cargar CSV, Limpiar, y Descargas */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenCsvImport && (
              <button
                onClick={onOpenCsvImport}
                className="flex items-center gap-1.5 rounded-lg bg-amber-100/90 px-3 py-1.5 text-xs font-semibold text-amber-950 border border-amber-300 hover:bg-amber-200/90 transition-colors cursor-pointer shadow-xs"
                title="Cargar archivo CSV o pegar lista para originar expedientes de Personas Naturales"
              >
                <Upload className="h-3.5 w-3.5 text-amber-800" />
                <span>Cargar Lista CSV / Originar</span>
              </button>
            )}

            <button
              onClick={() => setIsConciliacionModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer shadow-2xs"
              title="Ver conciliación de los 37 abonos bancarios del extracto CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-amber-700" />
              <span>Extracto Conciliado (37 Abonos)</span>
            </button>

            <button
              onClick={() => exportControlMaestroExcel(expedientes, empresa)}
              disabled={expedientes.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-900 border border-emerald-200 hover:bg-emerald-100/80 disabled:opacity-40 transition-colors cursor-pointer"
              title="Descargar libro Excel completo con las 27 columnas y hojas de conciliación"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
              <span>Descargar Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => exportControlMaestroCsv(expedientes)}
              disabled={expedientes.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-800 border border-stone-200 hover:bg-stone-200/80 disabled:opacity-40 transition-colors cursor-pointer"
              title="Descargar archivo plano CSV para Google Sheets o Excel rápido"
            >
              <Download className="h-3.5 w-3.5 text-stone-600" />
              <span>Descargar CSV</span>
            </button>

            {expedientes.length > 0 && onClearAllData && (
              <button
                onClick={() => {
                  if (window.confirm('¿Está seguro de que desea eliminar todos los expedientes simulados para dejar la base de datos limpia?')) {
                    onClearAllData();
                  }
                }}
                className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 border border-rose-200 hover:bg-rose-100/80 transition-colors cursor-pointer"
                title="Elimina todos los datos simulados de Firestore y almacenamiento local"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                <span>Limpiar Datos Simulados</span>
              </button>
            )}
          </div>
        </div>

        {/* Tarjetas KPI de Estado Financiero en tonos pasteles */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-stone-100 bg-stone-50/70 p-3">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs">
              <Briefcase className="h-3.5 w-3.5 text-stone-600" />
              <span>Expedientes Totales</span>
            </div>
            <p className="mt-1 font-mono text-lg font-bold text-stone-900">
              {expedientes.length}
            </p>
            <span className="text-[11px] text-stone-500">
              {totalCerrados} cerrados · {expedientes.length - totalCerrados} en curso
            </span>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
            <div className="flex items-center gap-1.5 text-amber-800 text-xs">
              <DollarSign className="h-3.5 w-3.5 text-amber-700" />
              <span>Anticipos en Bolívares</span>
            </div>
            <p className="mt-1 font-mono text-lg font-bold text-amber-900 truncate">
              {formatBs(totalAnticiposBs)}
            </p>
            <span className="text-[11px] text-amber-700">
              100% bancarizados sin terceros
            </span>
          </div>

          <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3">
            <div className="flex items-center gap-1.5 text-sky-800 text-xs">
              <Download className="h-3.5 w-3.5 text-sky-700" />
              <span>Divisas Compradas BCV</span>
            </div>
            <p className="mt-1 font-mono text-lg font-bold text-sky-900 truncate">
              {formatUSD(totalDivisasUsd)}
            </p>
            <span className="text-[11px] text-sky-700">
              Mesas de cambio autorizadas
            </span>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
              <span>Tasa BCV Referencial</span>
            </div>
            <p className="mt-1 font-mono text-lg font-bold text-emerald-900 truncate">
              {formatTasaBCV(empresa.tasaBCVActual)}
            </p>
            <span className="text-[11px] text-emerald-700">
              Oficial Banco Central
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, cédula, producto o número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-2 pl-9 pr-3 text-xs placeholder:text-stone-400 focus:border-amber-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white p-1 text-xs">
            <Filter className="ml-1.5 h-3.5 w-3.5 text-stone-400" />
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'todos' ? 'bg-stone-100 font-semibold text-stone-900' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todos ({expedientes.length})
            </button>
            <button
              onClick={() => setStatusFilter('en proceso')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'en proceso' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              En Proceso
            </button>
            <button
              onClick={() => setStatusFilter('en aduana')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'en aduana' ? 'bg-sky-100 text-sky-900 font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              En Aduana
            </button>
            <button
              onClick={() => setStatusFilter('cerrado')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === 'cerrado' ? 'bg-emerald-100 text-emerald-900 font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cerrados
            </button>
          </div>
        </div>
      </div>

      {/* Estado Vacío Limpio - Listo para Cargar CSV */}
      {expedientes.length === 0 && (
        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/40 p-8 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 border border-amber-300">
            <Upload className="h-7 w-7 text-amber-800" />
          </div>
          <div className="max-w-xl mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-stone-900">
              Base de Datos Limpia · Lista para Cargar Archivo CSV / Excel
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Se ha limpiado toda la información simulada. Ahora puedes originar los expedientes para cada una de las personas naturales de tu archivo CSV o listado, calculando automáticamente el rastro de efectivo, la compra de divisas en mesa oficial BCV y los asientos contables correspondientes.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onLoadRealCsvData && (
              <button
                onClick={onLoadRealCsvData}
                className="flex items-center gap-2 rounded-xl bg-amber-700 hover:bg-amber-800 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer"
              >
                <Users className="h-4 w-4 text-amber-200" />
                <span>Cargar los 15 Expedientes Reales del Extracto CSV</span>
              </button>
            )}
            {onOpenCsvImport && (
              <button
                onClick={onOpenCsvImport}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Upload className="h-4 w-4 text-amber-400" />
                <span>Cargar Lista CSV / Originar Expedientes</span>
              </button>
            )}
            <button
              onClick={downloadCsvTemplate}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-medium text-stone-700 border border-stone-200 hover:bg-stone-50 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="h-4 w-4 text-stone-500" />
              <span>Descargar Plantilla CSV Modelo</span>
            </button>
            <button
              onClick={onNewExpediente}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-medium text-stone-700 border border-stone-200 hover:bg-stone-50 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4 text-stone-500" />
              <span>Crear Expediente Manual</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabla Interactiva de Alta Densidad (Exactamente las columnas del Excel Mistral de la imagen) */}
      <div className="rounded-2xl border border-stone-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[620px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-20 bg-stone-100/95 backdrop-blur-xs text-stone-700 font-medium border-b border-stone-200 shadow-2xs">
              <tr className="divide-x divide-stone-200">
                <th className="px-3 py-2.5 whitespace-nowrap cursor-pointer hover:bg-stone-200/70" onClick={() => handleSort('numeroExpediente')}>
                  <div className="flex items-center gap-1 font-bold">
                    <span>Expediente N°</span>
                    <ArrowUpDown className="h-3 w-3 text-stone-400" />
                  </div>
                </th>
                <th className="px-3 py-2.5 whitespace-nowrap">Fecha contrato</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Cliente (Nombre y Apellido)</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Cédula / RIF</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Email / Teléfono</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Producto</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Origen del café</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Proveedor extranjero</th>
                <th className="px-3 py-2.5 whitespace-nowrap text-right cursor-pointer hover:bg-stone-200/70" onClick={() => handleSort('montoBs')}>
                  <div className="flex items-center justify-end gap-1 font-bold">
                    <span>Monto anticipo (Bs.)</span>
                    <ArrowUpDown className="h-3 w-3 text-stone-400" />
                  </div>
                </th>
                <th className="px-3 py-2.5 whitespace-nowrap">Fecha anticipo</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Forma de pago / Banco</th>
                <th className="px-3 py-2.5 whitespace-nowrap">N° Factura anticipo</th>
                <th className="px-3 py-2.5 whitespace-nowrap text-right cursor-pointer hover:bg-stone-200/70" onClick={() => handleSort('montoUsd')}>
                  <div className="flex items-center justify-end gap-1 font-bold">
                    <span>USD comprados</span>
                    <ArrowUpDown className="h-3 w-3 text-stone-400" />
                  </div>
                </th>
                <th className="px-3 py-2.5 whitespace-nowrap text-right">Tasa BCV (Bs/USD)</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Fecha compra divisas</th>
                <th className="px-3 py-2.5 whitespace-nowrap">N° Factura proveedor</th>
                <th className="px-3 py-2.5 whitespace-nowrap text-right">Monto factura (USD)</th>
                <th className="px-3 py-2.5 whitespace-nowrap">N° SWIFT / Transferencia</th>
                <th className="px-3 py-2.5 whitespace-nowrap">N° Bill of Lading</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Fecha embarque</th>
                <th className="px-3 py-2.5 whitespace-nowrap">N° Duela / Aduana</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Fecha nacionalización</th>
                <th className="px-3 py-2.5 whitespace-nowrap">N° Factura definitiva</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Fecha entrega</th>
                <th className="px-3 py-2.5 whitespace-nowrap">Comisión / margen</th>
                <th className="px-3 py-2.5 whitespace-nowrap text-center font-bold">Estado</th>
                <th className="px-3 py-2.5 whitespace-nowrap text-center sticky right-0 bg-stone-100 z-10 shadow-xs">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredExpedientes.length === 0 ? (
                <tr>
                  <td colSpan={27} className="px-6 py-12 text-center text-stone-500">
                    <AlertCircle className="mx-auto h-8 w-8 text-stone-400 mb-2" />
                    <p className="font-medium text-sm">No se encontraron expedientes con los filtros seleccionados.</p>
                    <p className="text-xs text-stone-400 mt-1">Modifique su búsqueda o agregue un nuevo cliente.</p>
                  </td>
                </tr>
              ) : (
                filteredExpedientes.map((op) => {
                  const statusColors =
                    op.estado === 'Cerrado'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : op.estado === 'En aduana'
                      ? 'bg-sky-50 text-sky-800 border-sky-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200';

                  return (
                    <tr
                      key={op.id}
                      className="hover:bg-amber-50/30 transition-colors divide-x divide-stone-100 cursor-pointer"
                      onClick={() => onOpenExpediente(op)}
                    >
                      <td className="px-3 py-2.5 font-mono font-bold text-stone-900 whitespace-nowrap">
                        {op.numeroExpediente}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-500">
                        {formatDateVE(op.fechaContrato)}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-stone-900 whitespace-nowrap max-w-[200px] truncate" title={op.cliente.nombre}>
                        {op.cliente.nombre}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-600">
                        {op.cliente.cedula}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-stone-500 max-w-[160px] truncate">
                        {op.cliente.email} · {op.cliente.telefono}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-stone-800">
                        {op.cliente.producto}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-stone-600">
                        {op.cliente.origen}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-stone-700 max-w-[180px] truncate" title={op.proveedor.nombreProveedor}>
                        {op.proveedor.nombreProveedor}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-medium text-right text-stone-900 whitespace-nowrap">
                        {formatBs(op.anticipo.montoBs)}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-500">
                        {formatDateVE(op.anticipo.fecha)}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-stone-600">
                        {op.anticipo.formaPago} - {op.anticipo.bancoOrigen}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-700">
                        {op.anticipo.facturaSeniat}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-medium text-right text-sky-800 whitespace-nowrap">
                        {formatUSD(op.divisas.montoUsd)}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-right text-stone-600 whitespace-nowrap">
                        {op.divisas.tasaBCV.toLocaleString('es-VE')}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-500">
                        {formatDateVE(op.divisas.fechaCompra)}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-700">
                        {op.proveedor.facturaNumero}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-right text-stone-800 whitespace-nowrap">
                        {formatUSD(op.proveedor.montoUsdFactura)}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-600 max-w-[140px] truncate" title={op.proveedor.referenciaSwift}>
                        {op.proveedor.referenciaSwift}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-600">
                        {op.importacion.numeroBL}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-500">
                        {formatDateVE(op.importacion.fechaEmbarque)}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-600">
                        {op.importacion.numeroDuela}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-500">
                        {formatDateVE(op.importacion.fechaNacionalizacion)}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-700">
                        {op.entrega.facturaDefinitivaSeniat || '—'}
                      </td>
                      <td className="px-3 py-2.5 font-mono whitespace-nowrap text-stone-500">
                        {formatDateVE(op.entrega.fechaEntrega)}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-stone-600">
                        {op.entrega.comisionMargenEmpresa}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium border ${statusColors}`}>
                          {op.estado}
                        </span>
                      </td>
                      <td
                        className="px-2 py-2.5 whitespace-nowrap text-center sticky right-0 bg-white shadow-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenExpediente(op)}
                            className="p-1 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                            title="Ver expediente completo"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => downloadPdfTapaExpediente(op, empresa)}
                            className="p-1 rounded-md text-rose-700 hover:text-rose-900 hover:bg-rose-50"
                            title="Descargar PDF oficial de Tapa de Expediente"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => exportExpedienteIndividualExcel(op, empresa)}
                            className="p-1 rounded-md text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50"
                            title="Descargar Excel de este expediente individual"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pie de tabla con información regulatoria */}
        <div className="border-t border-stone-200 bg-stone-50 px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <span>
            Mostrando {filteredExpedientes.length} de {expedientes.length} operaciones · Conservar expedientes por mínimo 5 años (SUDEBAN).
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono">Regla de oro: Pagos exclusivos del titular bancario</span>
          </div>
        </div>
      </div>

      {/* Modal de Conciliación Bancaria Oficial (37 Abonos Reales de Personas Naturales) */}
      <ConciliacionBancariaModal
        isOpen={isConciliacionModalOpen}
        onClose={() => setIsConciliacionModalOpen(false)}
        expedientes={expedientes}
        onOpenExpediente={(numExp) => {
          const found = expedientes.find((e) => e.numeroExpediente === numExp);
          if (found) onOpenExpediente(found);
        }}
      />
    </div>
  );
};
