import React, { useState } from 'react';
import { Database, ShieldCheck, Download, Upload, CheckCircle2, Lock, RefreshCw, KeyRound, AlertTriangle, Trash2, FileCode } from 'lucide-react';
import { CompanyProfile } from '../data/nominusData';
import { useAppData } from '../context/AppDataContext';

interface Props {
  company: CompanyProfile;
}

export const SecurityDatabaseCenterView: React.FC<Props> = ({ company }) => {
  const {
    vouchers,
    retentions,
    bankMovements,
    workers,
    pettyCash,
    receipts,
    contracts,
    customerAdvances,
    fxPurchases,
    importShipments,
    octoberInvoices,
    clearAllDatabase,
    importFullDatabase,
    exportDatabaseJSON
  } = useAppData();

  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const ok = importFullDatabase(parsed);
      if (ok) {
        setImportStatus('SUCCESS');
        setJsonInput('');
        setTimeout(() => setImportStatus('IDLE'), 3000);
      } else {
        setImportStatus('ERROR');
      }
    } catch {
      setImportStatus('ERROR');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const ok = importFullDatabase(parsed);
        if (ok) {
          setImportStatus('SUCCESS');
          setTimeout(() => setImportStatus('IDLE'), 3000);
        } else {
          setImportStatus('ERROR');
        }
      } catch {
        setImportStatus('ERROR');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BASE_DATOS_REAL_${company.id}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadEmptyTemplate = () => {
    const template = {
      version: '2026.1',
      customerAdvances: [
        {
          id: 'adv-001',
          advanceNumber: 'ANT-2026-001',
          date: '2026-03-31',
          clientName: 'Distribuidora Cafetalera Los Andes C.A.',
          clientRif: 'J-31049281-0',
          amountVES: 1500000.00,
          countervalueUSD: 27372.26,
          bcvRate: 54.80,
          coffeeVolumeTargetQtl: 500,
          bankReference: 'Ref: 84920194',
          status: 'RECIBIDO',
          notes: 'Anticipo para importación de café de Colombia por déficit de cosecha nacional.'
        }
      ],
      fxPurchases: [
        {
          id: 'fx-001',
          purchaseNumber: 'OP-CAMBIO-2026-001',
          date: '2026-03-31',
          banescoDebitVES: 1500000.00,
          exchangeRate: 54.80,
          usdCredited: 27372.26,
          banescoCommissionVES: 0,
          banescoRef: 'MESA-BANESCO-849',
          destinationPurpose: 'PAGO_PROVEEDOR_COLOMBIA',
          notes: 'Compra de divisas a Banesco para pago de café en Colombia'
        }
      ],
      importShipments: [
        {
          id: 'imp-001',
          shipmentCode: 'IMP-COL-2026-001',
          date: '2026-03-31',
          supplierName: 'Cooperativa Cafetera de Cúcuta Ltda.',
          supplierNit: 'NIT: 890.501.240-3',
          originCountry: 'Colombia',
          coffeeVariety: 'Café Pergamino Lavado Especial',
          volumeQtl: 500,
          totalInvoiceUSD: 27000,
          invoiceCommercialRef: 'EXP-COL-008412',
          duaSeniatNumber: 'DUA-2026-ADU-004128',
          insaiPermit: 'INSAI-FITOSAN-IMP-2026-904',
          internationalFreightUSD: 1800,
          customsCostsUSD: 1200,
          status: 'NACIONALIZADO_EN_ALMACEN'
        }
      ],
      octoberInvoices: [
        {
          id: 'inv-001',
          invoiceNumber: 'FAC-OCT-2026-001',
          date: '2026-10-05',
          clientName: 'Distribuidora Cafetalera Los Andes C.A.',
          clientRif: 'J-31049281-0',
          coffeeVolumeQtl: 500,
          totalInvoiceVES: 1500000.00,
          totalInvoiceUSD: 27372.26,
          amortizedAdvanceVES: 1500000.00,
          balanceDueVES: 0,
          status: 'FACTURADO'
        }
      ],
      vouchers: [],
      bankMovements: [],
      workers: [],
      pettyCash: [],
      receipts: []
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PLANTILLA_CARGA_DATOS_REALES_NOMINUS.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRecords =
    (vouchers?.length || 0) +
    (bankMovements?.length || 0) +
    (workers?.length || 0) +
    (pettyCash?.length || 0) +
    (receipts?.length || 0) +
    (customerAdvances?.length || 0) +
    (fxPurchases?.length || 0) +
    (importShipments?.length || 0) +
    (octoberInvoices?.length || 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Centro de Base de Datos & Carga de Información Real
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Gestión de persistencia local, vaciado de datos de prueba y carga masiva de datos contables y bancarios reales
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadEmptyTemplate}
            className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            Descargar Plantilla JSON
          </button>
          <button
            onClick={handleDownloadBackup}
            className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Exportar Base de Datos
          </button>
        </div>
      </div>

      {/* Database State Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono-num">
        <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl">
          <span className="text-stone-400 text-[10px] font-sans block">Comprobantes Contables:</span>
          <span className="text-xl font-bold text-white block mt-1">{vouchers.length}</span>
          <span className="text-[10px] text-stone-500 font-sans">Asientos en libros</span>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl">
          <span className="text-stone-400 text-[10px] font-sans block">Movimientos Banesco:</span>
          <span className="text-xl font-bold text-emerald-400 block mt-1">{bankMovements.length}</span>
          <span className="text-[10px] text-stone-500 font-sans">Partidas bancarias</span>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl">
          <span className="text-stone-400 text-[10px] font-sans block">Trabajadores Nómina:</span>
          <span className="text-xl font-bold text-amber-400 block mt-1">{workers.length}</span>
          <span className="text-[10px] text-stone-500 font-sans">Personal activo</span>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl">
          <span className="text-stone-400 text-[10px] font-sans block">Recibos de Café:</span>
          <span className="text-xl font-bold text-white block mt-1">{receipts.length}</span>
          <span className="text-[10px] text-stone-500 font-sans">Tickets de pesaje</span>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl">
          <span className="text-stone-400 text-[10px] font-sans block">Caja Chica Finca:</span>
          <span className="text-xl font-bold text-white block mt-1">{pettyCash.length}</span>
          <span className="text-[10px] text-stone-500 font-sans">Vales menores</span>
        </div>
      </div>

      {/* Main Action Section: Load Real Data (Upload or Paste JSON) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
          <div className="border-b border-stone-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                Cargar tu Información Real
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Pega aquí tu JSON con comprobantes, movimientos bancarios o sube el archivo directamente
              </p>
            </div>

            {/* File Upload Button */}
            <label className="cursor-pointer px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded text-xs font-semibold transition-colors flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Subir Archivo .JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div>
            <textarea
              rows={8}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{\n  "vouchers": [ ... ],\n  "bankMovements": [ ... ],\n  "workers": [ ... ]\n}`}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-xs font-mono text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              {importStatus === 'SUCCESS' && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  ¡Información real cargada exitosamente a la base de datos!
                </span>
              )}
              {importStatus === 'ERROR' && (
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Error al procesar el JSON. Verifique la sintaxis o descargue la plantilla.
                </span>
              )}
            </div>

            <button
              onClick={handleImport}
              disabled={!jsonInput.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-stone-950 font-bold rounded-lg text-xs shadow transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Procesar y Cargar Datos Reales
            </button>
          </div>
        </div>

        {/* Clear Database Control Card */}
        <div className="lg:col-span-4 bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <Trash2 className="w-4 h-4" />
              <h3 className="text-sm font-bold">Limpiar Toda la Base de Datos</h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Elimina todos los registros de comprobantes contables, extractos bancarios, nómina y recibos para dejar el sistema en blanco y limpio.
            </p>

            <div className="mt-4 p-3 bg-stone-950 border border-stone-800 rounded text-xs space-y-1 font-mono-num">
              <div className="text-stone-400 font-sans text-[11px]">Estado actual de registros:</div>
              <div className="text-white font-bold">{totalRecords} registros almacenados</div>
              <div className="text-[10px] text-stone-500 font-sans">
                {totalRecords === 0 ? 'Base de datos limpia (0 datos)' : 'Listo para depurar si lo deseas'}
              </div>
            </div>
          </div>

          <div>
            {showClearConfirm ? (
              <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg space-y-2">
                <p className="text-[11px] text-red-200 font-semibold">
                  ¿Seguro que deseas vaciar todos los datos de la aplicación?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      clearAllDatabase();
                      setShowClearConfirm(false);
                    }}
                    className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-xs"
                  >
                    Sí, Vaciar Base de Datos
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="w-full py-1.5 bg-stone-800 text-stone-300 rounded text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-2 bg-stone-800 hover:bg-red-950 hover:text-red-300 text-stone-300 border border-stone-700 hover:border-red-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Vaciar Base de Datos Ahora
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
