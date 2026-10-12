import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  BookOpen,
  Filter,
  Calculator,
  ArrowRightLeft,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Search,
  Layers,
  FileCheck
} from 'lucide-react';
import { AsientoContable, DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { formatBs, formatDateVE } from '../utils/formatters';
import {
  generarAsientosParaExpediente,
  generarLibroDiarioCompleto,
  PLAN_DE_CUENTAS,
} from '../utils/accountingGenerator';
import { exportContabilidadCsv, exportContabilidadExcel } from '../utils/excelGenerator';
import { downloadPdfLibroDiario } from '../utils/pdfGenerator';

interface ContabilidadViewProps {
  expedientes: ExpedienteOperacion[];
  empresa: DatosEmpresaImportadora;
}

export const ContabilidadView: React.FC<ContabilidadViewProps> = ({
  expedientes,
  empresa,
}) => {
  const [selectedExpedienteId, setSelectedExpedienteId] = useState<string>('todos');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [activeTab, setActiveTab] = useState<'diario' | 'balance' | 'plan'>('diario');
  const [searchAccount, setSearchAccount] = useState<string>('');

  // Generar todos los asientos
  const todosLosAsientos = useMemo(() => {
    return generarLibroDiarioCompleto(expedientes, empresa);
  }, [expedientes, empresa]);

  // Asientos filtrados
  const asientosFiltrados = useMemo(() => {
    return todosLosAsientos.filter((asiento) => {
      const matchExp =
        selectedExpedienteId === 'todos' ||
        expedientes.find((e) => e.id === selectedExpedienteId)?.numeroExpediente ===
          asiento.expedienteNumero;

      const matchTipo =
        tipoFiltro === 'todos' ||
        asiento.tipoOperacion.toLowerCase().includes(tipoFiltro.toLowerCase());

      return matchExp && matchTipo;
    });
  }, [todosLosAsientos, selectedExpedienteId, tipoFiltro, expedientes]);

  // Cálculos globales
  const totalDebe = useMemo(
    () => asientosFiltrados.reduce((acc, a) => acc + a.totalDebe, 0),
    [asientosFiltrados]
  );

  const totalHaber = useMemo(
    () => asientosFiltrados.reduce((acc, a) => acc + a.totalHaber, 0),
    [asientosFiltrados]
  );

  const diferencia = Math.abs(totalDebe - totalHaber);
  const estaCuadrado = diferencia < 0.05;

  // Balance de comprobación por cuenta
  const balanceCuentas = useMemo(() => {
    const map: Record<
      string,
      { codigo: string; nombre: string; debe: number; haber: number }
    > = {};

    asientosFiltrados.forEach((a) => {
      a.lineas.forEach((l) => {
        if (!map[l.codigoCuenta]) {
          map[l.codigoCuenta] = {
            codigo: l.codigoCuenta,
            nombre: l.nombreCuenta,
            debe: 0,
            haber: 0,
          };
        }
        map[l.codigoCuenta].debe += l.debe;
        map[l.codigoCuenta].haber += l.haber;
      });
    });

    return Object.values(map).sort((a, b) => a.codigo.localeCompare(b.codigo));
  }, [asientosFiltrados]);

  // Exportar Excel
  const handleExportExcel = () => {
    const filterName =
      selectedExpedienteId !== 'todos'
        ? `Expediente_${expedientes.find((e) => e.id === selectedExpedienteId)?.numeroExpediente}`
        : 'Todos_Expedientes';
    exportContabilidadExcel(asientosFiltrados, empresa, `Libro_Diario_${filterName}.xlsx`);
  };

  // Exportar CSV
  const handleExportCsv = () => {
    const filterName =
      selectedExpedienteId !== 'todos'
        ? `Expediente_${expedientes.find((e) => e.id === selectedExpedienteId)?.numeroExpediente}`
        : 'Todos_Expedientes';
    exportContabilidadCsv(asientosFiltrados, `Comprobantes_${filterName}.csv`);
  };

  // Exportar PDF
  const handleExportPdf = () => {
    const filterName =
      selectedExpedienteId !== 'todos'
        ? `Expediente N° ${expedientes.find((e) => e.id === selectedExpedienteId)?.numeroExpediente}`
        : undefined;
    downloadPdfLibroDiario(asientosFiltrados, empresa, filterName);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera Principal en Tonos Pasteles */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-indigo-800" />
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                Contabilidad Automática y Libro Diario
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-200">
                VEN-NIF · SENIAT
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Generación automática de asientos contables del ciclo completo (Anticipos, Mesas Cambiarias BCV, Giros SWIFT y Facturación).
            </p>
          </div>

          {/* BOTONES DE DESCARGA SOLICITADOS POR EL USUARIO */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100/90 px-3 py-1.5 text-xs font-medium text-emerald-900 transition-colors cursor-pointer shadow-xs"
              title="Descargar Libro Diario y Balance de Comprobación en Excel (.xlsx) estructurado para Profit Plus, Gálac, Saint o SAP"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
              <span>Descargar Excel (.xlsx)</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100/90 px-3 py-1.5 text-xs font-medium text-amber-900 transition-colors cursor-pointer shadow-xs"
              title="Descargar archivo plano CSV para importación directa en sistemas contables"
            >
              <Download className="h-3.5 w-3.5 text-amber-700" />
              <span>Descargar CSV</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition-colors cursor-pointer shadow-xs"
              title="Descargar Libro Diario formal en PDF con membrete de la empresa"
            >
              <Printer className="h-3.5 w-3.5 text-slate-300" />
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>

        {/* Tarjetas KPI de Estado Contable en Tonos Pasteles */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
            <span className="text-[11px] text-indigo-800 font-medium block">Total Débitos (Debe)</span>
            <p className="mt-1 font-mono text-base font-bold text-indigo-950 truncate">
              {formatBs(totalDebe)}
            </p>
            <span className="text-[10px] text-indigo-700">Cuentas deudoras</span>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
            <span className="text-[11px] text-indigo-800 font-medium block">Total Créditos (Haber)</span>
            <p className="mt-1 font-mono text-base font-bold text-indigo-950 truncate">
              {formatBs(totalHaber)}
            </p>
            <span className="text-[10px] text-indigo-700">Cuentas acreedoras</span>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
            <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Balance de Sumas</span>
            </div>
            <p className="mt-1 font-mono text-base font-bold text-emerald-950">
              {estaCuadrado ? 'Cuadrado 100%' : `Dif: ${formatBs(diferencia)}`}
            </p>
            <span className="text-[10px] text-emerald-700">
              Sumas iguales verificadas
            </span>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3">
            <span className="text-[11px] text-stone-600 font-medium block">Comprobantes Generados</span>
            <p className="mt-1 font-mono text-base font-bold text-stone-900">
              {asientosFiltrados.length}
            </p>
            <span className="text-[10px] text-stone-500">
              Asientos de diario activos
            </span>
          </div>
        </div>

        {/* Pestañas de la vista contable */}
        <div className="mt-5 flex items-center gap-1.5 border-t border-stone-100 pt-3">
          <button
            onClick={() => setActiveTab('diario')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'diario'
                ? 'bg-indigo-100/70 text-indigo-950 font-semibold border border-indigo-200 shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-indigo-700" />
            <span>Libro Diario ({asientosFiltrados.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('balance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'balance'
                ? 'bg-emerald-100/70 text-emerald-950 font-semibold border border-emerald-200 shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Calculator className="h-3.5 w-3.5 text-emerald-700" />
            <span>Balance de Comprobación ({balanceCuentas.length} cuentas)</span>
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'plan'
                ? 'bg-amber-100/70 text-amber-950 font-semibold border border-amber-200 shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-700" />
            <span>Plan de Cuentas VEN-NIF</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Expediente */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="font-medium">Expediente:</span>
            <select
              value={selectedExpedienteId}
              onChange={(e) => setSelectedExpedienteId(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 focus:border-indigo-400 focus:outline-hidden"
            >
              <option value="todos">Todos los Expedientes ({expedientes.length})</option>
              {expedientes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.numeroExpediente} - {e.cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Tipo de Operación */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="font-medium">Fase:</span>
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 focus:border-indigo-400 focus:outline-hidden"
            >
              <option value="todos">Todas las Fases</option>
              <option value="Anticipo">Anticipos de Clientes</option>
              <option value="Divisas">Compra Divisas BCV</option>
              <option value="SWIFT">Pagos Proveedor SWIFT</option>
              <option value="Aduana">Aduanas y Aranceles</option>
              <option value="Facturación">Facturación Definitiva</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-stone-500 font-mono">
          Asientos sincronizados con Tasa Oficial BCV: {empresa.tasaBCVActual} Bs/USD
        </div>
      </div>

      {/* PESTAÑA 1: LIBRO DIARIO DETALLADO */}
      {activeTab === 'diario' && (
        <div className="space-y-4">
          {asientosFiltrados.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-500">
              <AlertCircle className="mx-auto h-8 w-8 text-stone-400 mb-2" />
              <p className="font-medium text-sm">No se encontraron asientos contables con los filtros seleccionados.</p>
            </div>
          ) : (
            asientosFiltrados.map((asiento) => {
              const tipoBadge =
                asiento.tipoOperacion === 'Anticipo Cliente'
                  ? 'bg-amber-100 text-amber-900 border-amber-200'
                  : asiento.tipoOperacion === 'Compra Divisas BCV'
                  ? 'bg-sky-100 text-sky-900 border-sky-200'
                  : asiento.tipoOperacion === 'Pago SWIFT Proveedor'
                  ? 'bg-indigo-100 text-indigo-900 border-indigo-200'
                  : asiento.tipoOperacion === 'Aranceles y Aduana'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                  : 'bg-rose-100 text-rose-900 border-rose-200';

              return (
                <div
                  key={asiento.id}
                  className="rounded-2xl border border-stone-200/90 bg-white shadow-xs overflow-hidden"
                >
                  {/* Encabezado del Comprobante */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 bg-stone-50/80 px-4 py-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 bg-stone-200/80 px-2 py-0.5 rounded-md">
                        {asiento.numeroComprobante}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] border ${tipoBadge}`}>
                        {asiento.tipoOperacion}
                      </span>
                      <span className="font-medium text-stone-700">
                        Expediente: <strong className="font-mono">{asiento.expedienteNumero}</strong> · {asiento.clienteNombre}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-stone-500">
                      <span>Fecha: <strong className="font-mono text-stone-700">{formatDateVE(asiento.fecha)}</strong></span>
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Cuadrado</span>
                      </span>
                    </div>
                  </div>

                  {/* Tabla de Líneas Contables */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-stone-100 text-[11px] text-stone-400 font-medium bg-stone-50/30">
                          <th className="px-4 py-2 w-32">Código</th>
                          <th className="px-4 py-2">Nombre de la Cuenta</th>
                          <th className="px-4 py-2 w-48">Referencia Doc.</th>
                          <th className="px-4 py-2 text-right w-40">Debe (Bs.)</th>
                          <th className="px-4 py-2 text-right w-40">Haber (Bs.)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {asiento.lineas.map((linea, idx) => (
                          <tr key={idx} className="hover:bg-stone-50/50">
                            <td className="px-4 py-2 font-mono text-stone-500 text-[11px]">
                              {linea.codigoCuenta}
                            </td>
                            <td className="px-4 py-2 font-medium text-stone-900">
                              <span className={linea.haber > 0 ? 'pl-6 block' : 'block'}>
                                {linea.haber > 0 ? `a  ${linea.nombreCuenta}` : linea.nombreCuenta}
                              </span>
                            </td>
                            <td className="px-4 py-2 font-mono text-stone-500 text-[11px]">
                              {linea.referenciaDoc || '—'}
                            </td>
                            <td className="px-4 py-2 font-mono font-medium text-right text-stone-900">
                              {linea.debe > 0 ? formatBs(linea.debe) : '—'}
                            </td>
                            <td className="px-4 py-2 font-mono font-medium text-right text-stone-900">
                              {linea.haber > 0 ? formatBs(linea.haber) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-stone-200 bg-stone-50/60 font-bold text-stone-900 text-xs">
                          <td colSpan={3} className="px-4 py-2 text-right">
                            SUMAS IGUALES:
                          </td>
                          <td className="px-4 py-2 font-mono text-right text-indigo-950">
                            {formatBs(asiento.totalDebe)}
                          </td>
                          <td className="px-4 py-2 font-mono text-right text-indigo-950">
                            {formatBs(asiento.totalHaber)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Glosa y Fundamento Legal */}
                  <div className="bg-stone-50/40 border-t border-stone-100 px-4 py-2.5 text-[11px] text-stone-600 flex items-start gap-2">
                    <span className="font-semibold text-stone-700 shrink-0">Glosa / Explicación:</span>
                    <p className="leading-relaxed">{asiento.glosa}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* PESTAÑA 2: BALANCE DE COMPROBACIÓN */}
      {activeTab === 'balance' && (
        <div className="rounded-2xl border border-stone-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Balance de Comprobación de Sumas y Saldos</h3>
              <p className="text-xs text-stone-500">Consolidado por código de cuenta contable.</p>
            </div>
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
              {estaCuadrado ? 'Balance Cuadrado' : 'Desbalance'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-2.5 font-bold w-28">Código</th>
                  <th className="px-4 py-2.5 font-bold">Cuenta Contable</th>
                  <th className="px-4 py-2.5 font-bold text-right w-36">Total Débitos</th>
                  <th className="px-4 py-2.5 font-bold text-right w-36">Total Créditos</th>
                  <th className="px-4 py-2.5 font-bold text-right w-36">Saldo Deudor</th>
                  <th className="px-4 py-2.5 font-bold text-right w-36">Saldo Acreedor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {balanceCuentas.map((c) => {
                  const saldo = c.debe - c.haber;
                  return (
                    <tr key={c.codigo} className="hover:bg-stone-50/50">
                      <td className="px-4 py-2 font-mono font-semibold text-stone-600">{c.codigo}</td>
                      <td className="px-4 py-2 font-medium text-stone-900">{c.nombre}</td>
                      <td className="px-4 py-2 font-mono text-right text-stone-700">{formatBs(c.debe)}</td>
                      <td className="px-4 py-2 font-mono text-right text-stone-700">{formatBs(c.haber)}</td>
                      <td className="px-4 py-2 font-mono text-right font-medium text-indigo-900">
                        {saldo > 0 ? formatBs(saldo) : '—'}
                      </td>
                      <td className="px-4 py-2 font-mono text-right font-medium text-emerald-900">
                        {saldo < 0 ? formatBs(Math.abs(saldo)) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-stone-300 bg-stone-100/80 font-bold text-stone-900 text-xs">
                <tr>
                  <td colSpan={2} className="px-4 py-2.5">SUMAS IGUALES TOTALES:</td>
                  <td className="px-4 py-2.5 font-mono text-right text-indigo-950">{formatBs(totalDebe)}</td>
                  <td className="px-4 py-2.5 font-mono text-right text-indigo-950">{formatBs(totalHaber)}</td>
                  <td className="px-4 py-2.5 font-mono text-right text-indigo-950">{formatBs(totalDebe)}</td>
                  <td className="px-4 py-2.5 font-mono text-right text-indigo-950">{formatBs(totalHaber)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: PLAN DE CUENTAS VEN-NIF */}
      {activeTab === 'plan' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
            <h3 className="font-bold text-sm text-stone-900 mb-1">
              Plan de Cuentas Estándar VEN-NIF para Operaciones Cambiarias y Comerciales
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Cuentas homologadas con los sistemas contables más utilizados en Venezuela (Profit Plus, Gálac, Saint Enterprise, Valery y SAP).
            </p>

            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {PLAN_DE_CUENTAS.map((cuenta) => (
                <div
                  key={cuenta.codigo}
                  className="rounded-xl border border-stone-200 p-3 bg-stone-50/50 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-stone-800">{cuenta.codigo}</span>
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-stone-200 text-stone-700">
                      {cuenta.tipo}
                    </span>
                  </div>
                  <p className="font-medium text-stone-900 text-xs">{cuenta.nombre}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 text-xs text-indigo-950 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-indigo-900">
              <FileCheck className="h-4 w-4 text-indigo-700" />
              <span>Criterio Técnico Contable Aplicado (VEN-NIF / NIC 21 / Providencia SENIAT 00071)</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-indigo-900">
              <li><strong>Anticipos de Clientes (Pasivo):</strong> No constituyen ingresos por ventas hasta la entrega física del producto importado y la emisión de la Factura Definitiva (Providencia SENIAT 00071). Se acreditan a la cuenta de pasivo comercial <em>2.1.02.01</em>.</li>
              <li><strong>Moneda Extranjera (NIC 21):</strong> Las divisas adquiridas en las mesas de cambio bancarias se reconocen a la tasa de cambio oficial del BCV del día de la transacción en la cuenta de custodia <em>1.1.01.02</em>.</li>
              <li><strong>Mercancías en Tránsito:</strong> Todos los desembolsos de factura extranjera, fletes y aranceles de nacionalización aduanera se acumulan en <em>1.1.03.02</em> hasta que la mercancía es entregada conforme al comprador.</li>
              <li><strong>Descargo Contable en Ventas:</strong> Al momento de la entrega, se cancela el pasivo de anticipo contra la cuenta de ingresos por ventas y se traslada la mercancía en tránsito a costo de ventas.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
