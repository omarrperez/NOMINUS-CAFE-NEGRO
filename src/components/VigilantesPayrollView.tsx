import React, { useState } from 'react';
import { Users, Shield, Printer, CheckCircle, Search, Eye, Download, X, AlertCircle, Plus, Trash2, FileSpreadsheet, FileDown } from 'lucide-react';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import { useAppData, WorkerPayrollItem } from '../context/AppDataContext';
import { exportToWord, exportToCsv, exportHtmlToPdf, exportToPdfPrint } from '../utils/exportUtils';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
}

export const VigilantesPayrollView: React.FC<Props> = ({ company, currentRate }) => {
  const { workers, addWorker, deleteWorker } = useAppData();
  const [selectedWorker, setSelectedWorker] = useState<WorkerPayrollItem | null>(null);
  const [filterDept, setFilterDept] = useState<string>('ALL');

  // Modal to add real worker
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [name, setName] = useState('');
  const [cedula, setCedula] = useState('');
  const [role, setRole] = useState('Vigilante de Custodia Armada');
  const [department, setDepartment] = useState<'VIGILANCIA' | 'ADMINISTRACION' | 'ALMACEN_LOGISTICA' | 'ADUANA_TRANSPORTE'>('VIGILANCIA');
  const [banescoAccount, setBanescoAccount] = useState('0134-');
  const [baseSalaryUSD, setBaseSalaryUSD] = useState<number>(200);
  const [attendanceBonusUSD, setAttendanceBonusUSD] = useState<number>(50);
  const [nightShiftHours, setNightShiftHours] = useState<number>(0);
  const [daexPermit, setDaexPermit] = useState('');

  const filteredWorkers = workers.filter(
    (w) => filterDept === 'ALL' || w.department === filterDept
  );

  // Compute payroll numbers for a worker
  const calculateWorkerNet = (w: WorkerPayrollItem) => {
    const rate = currentRate.rateUsd;
    const baseVES = w.baseSalaryUSD * rate;
    const bonusVES = w.attendanceBonusUSD * rate;
    const nightShiftVES = (w.nightShiftHours * (w.baseSalaryUSD / 160) * 1.3) * rate; // recargo 30% nocturno LOTTT
    const grossVES = baseVES + bonusVES + nightShiftVES;

    // Retenciones LOTTT
    const ivssVES = baseVES * 0.04;
    const faovVES = baseVES * 0.01;
    const incesVES = baseVES * 0.005;
    const totalDeductionsVES = ivssVES + faovVES + incesVES;

    const netVES = grossVES - totalDeductionsVES;
    const netUSD = rate > 0 ? netVES / rate : 0;

    return {
      baseVES,
      bonusVES,
      nightShiftVES,
      grossVES,
      ivssVES,
      faovVES,
      incesVES,
      totalDeductionsVES,
      netVES,
      netUSD
    };
  };

  const totalPayrollVES = workers.reduce((acc, w) => acc + calculateWorkerNet(w).netVES, 0);
  const totalPayrollUSD = currentRate.rateUsd > 0 ? totalPayrollVES / currentRate.rateUsd : 0;

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cedula) return;

    const newWorker: WorkerPayrollItem = {
      id: `w-${Date.now()}`,
      name,
      cedula,
      role,
      department,
      banescoAccount: banescoAccount || '0134-0000-00-0000000000',
      baseSalaryUSD,
      attendanceBonusUSD,
      nightShiftHours,
      daexPermit: daexPermit || undefined,
      status: 'ACTIVO'
    };

    addWorker(newWorker);
    setShowAddWorkerModal(false);
    // Reset
    setName('');
    setCedula('');
    setDaexPermit('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Nómina de Vigilancia Privada y Operadores Agrícolas
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Base de datos limpia &middot; Liquidación Banesco Pago Electrónico &middot; Tasa Oficial BCV: Bs. {currentRate.rateUsd.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddWorkerModal(true)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Trabajador Real
          </button>
          <button
            onClick={() => {
              const rowsHtml = filteredWorkers.map(w => {
                const net = calculateWorkerNet(w);
                return `
                  <tr>
                    <td>${w.name}</td>
                    <td>${w.cedula}</td>
                    <td>${w.role}</td>
                    <td>${w.department}</td>
                    <td>${w.banescoAccount}</td>
                    <td class="num">$${w.baseSalaryUSD.toFixed(2)}</td>
                    <td class="num">$${w.attendanceBonusUSD.toFixed(2)}</td>
                    <td class="num"><strong>Bs. ${net.netVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong></td>
                  </tr>
                `;
              }).join('');

              const htmlContent = `
                <h1>${company.name}</h1>
                <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Tasa BCV:</strong> Bs. ${currentRate.rateUsd.toFixed(2)}</p>
                <h2>NÓMINA GENERAL DE EMPLEADOS Y CUSTODIOS AGRÍCOLAS (2026)</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Nombre y Apellido</th>
                      <th>Cédula</th>
                      <th>Cargo</th>
                      <th>Departamento</th>
                      <th>Cuenta Banesco</th>
                      <th class="num">Sueldo USD</th>
                      <th class="num">Bono USD</th>
                      <th class="num">Neto Bs</th>
                    </tr>
                  </thead>
                  <tbody>${rowsHtml}</tbody>
                </table>
              `;
              exportToWord('Nomina_General_Trabajadores_Agricola_Oni.doc', 'Nómina General de Trabajadores', htmlContent);
            }}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow"
            title="Exportar nómina a Word (.doc)"
          >
            <FileDown className="w-3.5 h-3.5" />
            Word (.doc)
          </button>

          <button
            onClick={() => {
              const headers = ['Nombre', 'Cedula', 'Cargo', 'Departamento', 'Cuenta_Banesco', 'Sueldo_Base_USD', 'Bono_USD', 'Neto_VES', 'Neto_USD'];
              const rows = filteredWorkers.map(w => {
                const net = calculateWorkerNet(w);
                return [
                  w.name,
                  w.cedula,
                  w.role,
                  w.department,
                  w.banescoAccount,
                  w.baseSalaryUSD,
                  w.attendanceBonusUSD,
                  net.netVES,
                  net.netUSD
                ];
              });
              exportToCsv('Nomina_General_Trabajadores_2026.csv', headers, rows);
            }}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow"
            title="Exportar nómina a Excel (CSV)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel (CSV)
          </button>

          <button
            onClick={async () => {
              const rowsHtml = filteredWorkers.map(w => {
                const net = calculateWorkerNet(w);
                return `
                  <tr>
                    <td>${w.name}</td>
                    <td>${w.cedula}</td>
                    <td>${w.role}</td>
                    <td>${w.department}</td>
                    <td>${w.banescoAccount}</td>
                    <td class="num">$${w.baseSalaryUSD.toFixed(2)}</td>
                    <td class="num">$${w.attendanceBonusUSD.toFixed(2)}</td>
                    <td class="num"><strong>Bs. ${net.netVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong></td>
                  </tr>
                `;
              }).join('');

              const htmlContent = `
                <h1>${company.name}</h1>
                <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Tasa BCV:</strong> Bs. ${currentRate.rateUsd.toFixed(2)}</p>
                <h2>NÓMINA GENERAL DE EMPLEADOS Y CUSTODIOS AGRÍCOLAS (2026)</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Nombre y Apellido</th>
                      <th>Cédula</th>
                      <th>Cargo</th>
                      <th>Departamento</th>
                      <th>Cuenta Banesco</th>
                      <th class="num">Sueldo USD</th>
                      <th class="num">Bono USD</th>
                      <th class="num">Neto Bs</th>
                    </tr>
                  </thead>
                  <tbody>${rowsHtml}</tbody>
                </table>
              `;
              await exportHtmlToPdf('Nomina_General_Trabajadores_Agricola_Oni.pdf', 'Nómina General de Trabajadores', htmlContent);
            }}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1 shadow"
            title="Descargar nómina en PDF directo"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>

          <button
            onClick={() => exportToPdfPrint()}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Imprimir planilla (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </div>

      {workers.length === 0 ? (
        /* Empty State */
        <div className="bg-stone-900 border border-dashed border-stone-700 rounded-xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Nómina Limpia (0 Trabajadores)</h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto mt-1">
              Todos los vigilantes y empleados simulados han sido retirados. Ingrese su personal real con sus cuentas Banesco, cédulas y asignaciones salariales.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setShowAddWorkerModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" />
              Ingresar Primer Empleado Real
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Summary and Filters */}
          <div className="flex items-center justify-between bg-stone-900 border border-stone-800 p-3 rounded-lg text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Filtrar Departamento:</span>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="bg-stone-950 border border-stone-700 text-stone-200 rounded px-2.5 py-1"
              >
                <option value="ALL">Todos ({workers.length})</option>
                <option value="VIGILANCIA">Vigilancia y Custodia</option>
                <option value="ADMINISTRACION">Administración y Facturación</option>
                <option value="ALMACEN_LOGISTICA">Almacén y Distribución</option>
                <option value="ADUANA_TRANSPORTE">Transporte Binacional y Aduana</option>
              </select>
            </div>
            <div className="font-mono-num text-right">
              <span className="text-stone-400 text-[11px] font-sans mr-2">Total Nómina:</span>
              <span className="text-emerald-400 font-bold">Bs. {totalPayrollVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
              <span className="text-stone-400 text-[11px] ml-1">(${totalPayrollUSD.toFixed(2)} USD)</span>
            </div>
          </div>

          {/* Main Table */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-stone-300 font-mono-num">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="px-4 py-3 font-sans">Trabajador & Cédula</th>
                    <th className="px-4 py-3 font-sans">Cargo / Custodia</th>
                    <th className="px-4 py-3">Cta Banesco</th>
                    <th className="px-4 py-3 text-right">Salario Base USD</th>
                    <th className="px-4 py-3 text-right">Bono Asist. USD</th>
                    <th className="px-4 py-3 text-right">Horas Noct.</th>
                    <th className="px-4 py-3 text-right text-amber-300">Total Devengado (VES)</th>
                    <th className="px-4 py-3 text-right text-stone-400">Deducciones Ley (VES)</th>
                    <th className="px-4 py-3 text-right font-bold text-emerald-400">Neto a Cobrar (VES)</th>
                    <th className="px-4 py-3 text-center font-sans">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {filteredWorkers.map((w) => {
                    const calc = calculateWorkerNet(w);
                    return (
                      <tr key={w.id} className="hover:bg-stone-800/30">
                        <td className="px-4 py-3 font-sans">
                          <div className="text-stone-100 font-bold">{w.name}</div>
                          <div className="text-stone-400 text-[11px] font-mono">{w.cedula}</div>
                        </td>
                        <td className="px-4 py-3 font-sans">
                          <div className="text-stone-200">{w.role}</div>
                          {w.daexPermit && (
                            <span className="text-[10px] text-amber-400 font-mono block">
                              Porte: {w.daexPermit}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-stone-400">{w.banescoAccount}</td>
                        <td className="px-4 py-3 text-right">${w.baseSalaryUSD.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">${w.attendanceBonusUSD.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">{w.nightShiftHours} hrs</td>
                        <td className="px-4 py-3 text-right font-medium text-amber-300">
                          Bs. {calc.grossVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right text-stone-400">
                          -Bs. {calc.totalDeductionsVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-400">
                          Bs. {calc.netVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedWorker(w)}
                              className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[11px] font-sans font-medium flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3 text-amber-400" />
                              Recibo
                            </button>
                            <button
                              onClick={() => deleteWorker(w.id)}
                              className="p-1 text-stone-500 hover:text-red-400 rounded"
                              title="Eliminar de nómina"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Individual Pay Slip Modal */}
      {selectedWorker && (() => {
        const calc = calculateWorkerNet(selectedWorker);
        return (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white text-stone-900 rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-300">
              <button
                onClick={() => setSelectedWorker(null)}
                className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b-2 border-stone-800 pb-3 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold font-serif-doc text-base text-stone-950">{company.name}</h3>
                    <p className="text-[10px] text-stone-600 font-mono">RIF: {company.rif} &middot; Finca Cafetalera</p>
                    <span className="inline-block mt-1 font-bold text-xs uppercase tracking-wide text-amber-900">
                      RECIBO DE PAGO DE NÓMINA INDIVIDUAL
                    </span>
                  </div>
                  <div className="text-right text-[10px] font-mono-num">
                    <p className="font-bold text-stone-800">EJERCICIO 2026</p>
                    <p className="text-stone-500">Tasa BCV: Bs. {currentRate.rateUsd.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded p-3 mb-4 text-xs font-mono-num grid grid-cols-2 gap-2">
                <div>
                  <span className="text-stone-500 font-sans block text-[10px]">Trabajador:</span>
                  <span className="font-bold text-stone-950 font-sans">{selectedWorker.name}</span>
                  <span className="text-stone-600 block">{selectedWorker.cedula}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-sans block text-[10px]">Cargo & Departamento:</span>
                  <span className="font-semibold text-stone-900 font-sans">{selectedWorker.role}</span>
                  <span className="text-stone-600 font-mono text-[10px]">Cta Banesco: {selectedWorker.banescoAccount}</span>
                </div>
              </div>

              <div className="border border-stone-300 rounded overflow-hidden mb-4 text-xs font-mono-num">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 text-[10px] text-stone-700 uppercase border-b border-stone-300 font-sans">
                    <tr>
                      <th className="px-3 py-1.5">Concepto</th>
                      <th className="px-3 py-1.5 text-right">Asignaciones (Bs.)</th>
                      <th className="px-3 py-1.5 text-right">Deducciones (Bs.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-[11px]">
                    <tr>
                      <td className="px-3 py-1.5 font-sans">Salario Base (${selectedWorker.baseSalaryUSD} USD)</td>
                      <td className="px-3 py-1.5 text-right font-medium">Bs. {calc.baseVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-1.5 text-right text-stone-400">—</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-sans">Bono de Asistencia (${selectedWorker.attendanceBonusUSD} USD)</td>
                      <td className="px-3 py-1.5 text-right font-medium">Bs. {calc.bonusVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-1.5 text-right text-stone-400">—</td>
                    </tr>
                    <tr className="bg-stone-50/50">
                      <td className="px-3 py-1.5 font-sans text-stone-600">IVSS (4%)</td>
                      <td className="px-3 py-1.5 text-right text-stone-400">—</td>
                      <td className="px-3 py-1.5 text-right text-amber-900">-Bs. {calc.ivssVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="bg-stone-50/50">
                      <td className="px-3 py-1.5 font-sans text-stone-600">FAOV (1%)</td>
                      <td className="px-3 py-1.5 text-right text-stone-400">—</td>
                      <td className="px-3 py-1.5 text-right text-amber-900">-Bs. {calc.faovVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-stone-100 font-bold border-t-2 border-stone-800 text-xs">
                    <tr>
                      <td className="px-3 py-2 font-sans uppercase">NETO A TRANSFERIR BANESCO:</td>
                      <td colSpan={2} className="px-3 py-2 text-right text-emerald-900 text-sm">
                        Bs. {calc.netVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} (${calc.netUSD.toFixed(2)} USD)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-300 text-[10px] text-center">
                <div>
                  <div className="border-t border-stone-600 pt-1 mt-8">
                    <p className="font-bold text-stone-900 font-sans">{company.name}</p>
                    <p className="text-stone-500 font-sans">Administración de Nómina</p>
                  </div>
                </div>
                <div>
                  <div className="border-t border-stone-600 pt-1 mt-8 flex justify-between items-center px-4">
                    <span className="font-sans font-bold text-stone-900">{selectedWorker.name}</span>
                    <span className="border border-stone-400 text-stone-400 px-2 py-0.5 text-[8px] rounded">Firma / Huella</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir Recibo
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Add Real Worker */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-md w-full p-6 text-stone-200 shadow-2xl relative">
            <button
              onClick={() => setShowAddWorkerModal(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-white mb-3">Registrar Trabajador / Vigilante Real</h3>

            <form onSubmit={handleCreateWorker} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pedro José Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Cédula de Identidad:</label>
                  <input
                    type="text"
                    required
                    placeholder="V-00.000.000"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Departamento:</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                  >
                    <option value="VIGILANCIA">Vigilancia / Seguridad</option>
                    <option value="ADMINISTRACION">Administración / Facturación</option>
                    <option value="ALMACEN_LOGISTICA">Almacén y Despacho</option>
                    <option value="ADUANA_TRANSPORTE">Transporte Binacional y Aduana</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Cargo Desempeñado:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Vigilante de Custodia Armada"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Cuenta Banesco (20 dígitos):</label>
                <input
                  type="text"
                  placeholder="0134-XXXX-XX-XXXXXXXXXX"
                  value={banescoAccount}
                  onChange={(e) => setBanescoAccount(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Salario USD:</label>
                  <input
                    type="number"
                    required
                    value={baseSalaryUSD}
                    onChange={(e) => setBaseSalaryUSD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2 py-1.5 font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Bono USD:</label>
                  <input
                    type="number"
                    value={attendanceBonusUSD}
                    onChange={(e) => setAttendanceBonusUSD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2 py-1.5"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Horas Noct:</label>
                  <input
                    type="number"
                    value={nightShiftHours}
                    onChange={(e) => setNightShiftHours(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Permiso Porte DAEX (Opcional):</label>
                <input
                  type="text"
                  placeholder="DAEX-PORT-2026-XXX"
                  value={daexPermit}
                  onChange={(e) => setDaexPermit(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddWorkerModal(false)}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs shadow"
                >
                  Guardar Trabajador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
