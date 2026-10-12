import React, { useState } from 'react';
import { X, Save, Building2, Coins } from 'lucide-react';
import { DatosEmpresaImportadora } from '../types';

interface CompanyConfigModalProps {
  empresa: DatosEmpresaImportadora;
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevaEmpresa: DatosEmpresaImportadora) => void;
}

export const CompanyConfigModal: React.FC<CompanyConfigModalProps> = ({
  empresa,
  isOpen,
  onClose,
  onSave,
}) => {
  const [data, setData] = useState<DatosEmpresaImportadora>(empresa);

  if (!isOpen) return null;

  const handleChange = (field: keyof DatosEmpresaImportadora, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: field === 'tasaBCVActual' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-auto">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-800" />
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Parámetros de la Empresa Importadora de Registro
              </h2>
              <p className="text-xs text-stone-500">
                Estos datos se incorporan automáticamente en todos los contratos, cartas al banco y expedientes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-900 block text-xs">Tasa Oficial del Banco Central de Venezuela (BCV)</span>
              <span className="text-[11px] text-amber-800">Tasa de referencia para conversiones de divisas del día.</span>
            </div>
            <div className="w-36">
              <input
                type="number"
                step="0.01"
                value={data.tasaBCVActual}
                onChange={(e) => handleChange('tasaBCVActual', e.target.value)}
                className="w-full rounded-lg border border-amber-300 bg-white p-2 text-right font-mono font-bold text-sm text-stone-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="font-medium text-stone-700 block mb-1">Razón Social:</label>
              <input
                type="text"
                value={data.razonSocial}
                onChange={(e) => handleChange('razonSocial', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">RIF de la Empresa:</label>
              <input
                type="text"
                value={data.rif}
                onChange={(e) => handleChange('rif', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono font-bold focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Registro SUNAGRO / SICA:</label>
              <input
                type="text"
                value={data.registroSunagro}
                onChange={(e) => handleChange('registroSunagro', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-medium text-stone-700 block mb-1">Registro Mercantil:</label>
              <input
                type="text"
                value={data.registroMercantil}
                onChange={(e) => handleChange('registroMercantil', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Tomo y Folio:</label>
              <input
                type="text"
                value={`Tomo ${data.tomoNumero}, Folio ${data.folioNumero}`}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange('tomoNumero', val);
                }}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Fecha de Registro:</label>
              <input
                type="text"
                value={data.fechaRegistro}
                onChange={(e) => handleChange('fechaRegistro', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-medium text-stone-700 block mb-1">Domicilio Fiscal Completo:</label>
              <input
                type="text"
                value={data.direccionFiscal}
                onChange={(e) => handleChange('direccionFiscal', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Representante Legal:</label>
              <input
                type="text"
                value={data.representanteLegal}
                onChange={(e) => handleChange('representanteLegal', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Cédula del Representante:</label>
              <input
                type="text"
                value={data.cedulaRepresentante}
                onChange={(e) => handleChange('cedulaRepresentante', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Cargo / Calidad:</label>
              <input
                type="text"
                value={data.cargoRepresentante}
                onChange={(e) => handleChange('cargoRepresentante', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Teléfono:</label>
              <input
                type="text"
                value={data.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-medium text-stone-700 block mb-1">Objeto Social Estatutario:</label>
              <textarea
                rows={3}
                value={data.objetoSocial || ''}
                onChange={(e) => handleChange('objetoSocial', e.target.value)}
                placeholder="Actos de comercio, siembra, procesamiento, transporte, importación y exportación..."
                className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-medium text-stone-700 block mb-1">Banco Principal Receptor:</label>
              <input
                type="text"
                value={data.bancoPrincipal}
                onChange={(e) => handleChange('bancoPrincipal', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Cuenta Corriente (Bolívares):</label>
              <input
                type="text"
                value={data.cuentaBancariaBs}
                onChange={(e) => handleChange('cuentaBancariaBs', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-medium text-stone-700 block mb-1">Cuenta Custodia (Convenio N° 1 Divisas):</label>
              <input
                type="text"
                value={data.cuentaCustodiaUsd}
                onChange={(e) => handleChange('cuentaCustodiaUsd', e.target.value)}
                className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Pie */}
        <div className="flex items-center justify-end gap-2 border-t border-stone-200 px-6 py-3 bg-stone-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 text-xs transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Guardar Parámetros</span>
          </button>
        </div>

      </div>
    </div>
  );
};
