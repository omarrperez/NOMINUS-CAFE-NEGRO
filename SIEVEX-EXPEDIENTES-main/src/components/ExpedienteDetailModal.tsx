import React, { useState } from 'react';
import {
  X,
  Save,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  User,
  CreditCard,
  DollarSign,
  Building,
  Ship,
  CheckSquare,
  FileText,
  Printer
} from 'lucide-react';
import { DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { formatBs, formatDateVE, formatTasaBCV, formatUSD } from '../utils/formatters';
import { downloadPdfTapaExpediente, downloadPdfContratoCompraventa, downloadPdfCuestionarioKYC } from '../utils/pdfGenerator';
import { exportExpedienteIndividualExcel } from '../utils/excelGenerator';

interface ExpedienteDetailModalProps {
  expediente: ExpedienteOperacion;
  empresa: DatosEmpresaImportadora;
  isOpen: boolean;
  onClose: () => void;
  onSave: (op: ExpedienteOperacion) => void;
}

export const ExpedienteDetailModal: React.FC<ExpedienteDetailModalProps> = ({
  expediente,
  empresa,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ExpedienteOperacion>(expediente);
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const updateCliente = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      cliente: { ...prev.cliente, [field]: value },
    }));
  };

  const updateAnticipo = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      anticipo: { ...prev.anticipo, [field]: value },
    }));
  };

  const updateDivisas = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev.divisas, [field]: value };
      if (field === 'montoUsd' || field === 'tasaBCV') {
        const usd = field === 'montoUsd' ? Number(value) : Number(updated.montoUsd);
        const tasa = field === 'tasaBCV' ? Number(value) : Number(updated.tasaBCV);
        updated.montoBsEquivalente = usd * tasa;
      }
      return { ...prev, divisas: updated };
    });
  };

  const updateProveedor = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      proveedor: { ...prev.proveedor, [field]: value },
    }));
  };

  const updateImportacion = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      importacion: { ...prev.importacion, [field]: value },
    }));
  };

  const updateEntrega = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      entrega: { ...prev.entrega, [field]: value },
    }));
  };

  const updateDocumento = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      documentos: { ...prev.documentos, [field]: value },
    }));
  };

  const handleSaveAndClose = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Cabecera del Modal en colores pasteles */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-stone-50/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                {formData.numeroExpediente}
              </span>
              <h2 className="text-lg font-bold text-stone-900">
                {formData.cliente.nombre || 'Nuevo Expediente'}
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Expediente de persona natural · Marco regulatorio SUDEBAN / BCV / SENIAT
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadPdfTapaExpediente(formData, empresa)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-medium text-rose-800 transition-colors cursor-pointer"
              title="Descargar Tapa PDF"
            >
              <Download className="h-3.5 w-3.5 text-rose-700" />
              <span className="hidden sm:inline">PDF Tapa</span>
            </button>

            <button
              onClick={() => exportExpedienteIndividualExcel(formData, empresa)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-medium text-emerald-800 transition-colors cursor-pointer"
              title="Descargar Ficha en Excel"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Excel</span>
            </button>

            <button
              onClick={handleSaveAndClose}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white transition-colors cursor-pointer shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Guardar</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Pestañas de Pasos del Expediente */}
        <div className="flex items-center gap-1 border-b border-stone-200 px-6 py-2 bg-stone-100/60 overflow-x-auto text-xs">
          {[
            { id: 1, label: '1. Cliente y KYC', icon: User },
            { id: 2, label: '2. Anticipo en Bs.', icon: CreditCard },
            { id: 3, label: '3. Divisas BCV', icon: DollarSign },
            { id: 4, label: '4. Proveedor SWIFT', icon: Building },
            { id: 5, label: '5. Aduana y Permisos', icon: Ship },
            { id: 6, label: '6. Entrega y Cierre', icon: CheckSquare },
            { id: 7, label: '7. Checklist Recaudos', icon: FileText },
          ].map((step) => {
            const Icon = step.icon;
            const active = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200 font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-amber-800' : 'text-stone-500'}`} />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido del Paso Activo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* PASO 1: CLIENTE Y KYC */}
          {activeStep === 1 && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-amber-900">
                <p className="font-semibold">Debida Diligencia de la Persona Natural (Resolución SUDEBAN 083.18)</p>
                <p className="text-[11px] mt-0.5">
                  Verifique que la identidad esté respaldada por cédula laminada y RIF vigente. La empresa actúa como comprador e importador de registro.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Nombre Completo:</label>
                  <input
                    type="text"
                    value={formData.cliente.nombre}
                    onChange={(e) => updateCliente('nombre', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Ej: Juan José Pérez"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Cédula de Identidad:</label>
                  <input
                    type="text"
                    value={formData.cliente.cedula}
                    onChange={(e) => updateCliente('cedula', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="V-12345678"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">RIF Personal:</label>
                  <input
                    type="text"
                    value={formData.cliente.rif}
                    onChange={(e) => updateCliente('rif', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="V-12345678-0"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Fecha de Nacimiento:</label>
                  <input
                    type="date"
                    value={formData.cliente.fechaNacimiento}
                    onChange={(e) => updateCliente('fechaNacimiento', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Lugar de Nacimiento:</label>
                  <input
                    type="text"
                    value={formData.cliente.lugarNacimiento}
                    onChange={(e) => updateCliente('lugarNacimiento', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Ciudad, Estado"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Estado Civil:</label>
                  <select
                    value={formData.cliente.estadoCivil}
                    onChange={(e) => updateCliente('estadoCivil', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                  >
                    <option value="Soltero(a)">Soltero(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viudo(a)">Viudo(a)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-medium text-stone-700 block mb-1">Dirección de Habitación:</label>
                  <input
                    type="text"
                    value={formData.cliente.direccionHabitacion}
                    onChange={(e) => updateCliente('direccionHabitacion', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Urb, Calle, Edif, Apto, Ciudad"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Teléfono:</label>
                  <input
                    type="text"
                    value={formData.cliente.telefono}
                    onChange={(e) => updateCliente('telefono', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="0412-1234567"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Correo Electrónico:</label>
                  <input
                    type="email"
                    value={formData.cliente.email}
                    onChange={(e) => updateCliente('email', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="cliente@email.com"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Ocupación / Profesión:</label>
                  <input
                    type="text"
                    value={formData.cliente.ocupacion}
                    onChange={(e) => updateCliente('ocupacion', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Comerciante / Caficultor"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Actividad Económica Principal:</label>
                  <input
                    type="text"
                    value={formData.cliente.actividadEconomica}
                    onChange={(e) => updateCliente('actividadEconomica', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Venta de café y tostado"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-medium text-stone-700 block mb-1">Origen Declarado de Ingresos:</label>
                  <input
                    type="text"
                    value={formData.cliente.origenIngresosDeclarado}
                    onChange={(e) => updateCliente('origenIngresosDeclarado', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Ventas operativas del comercio y ahorros bancarios legítimos"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Capacidad Económica Estimada:</label>
                  <input
                    type="text"
                    value={formData.cliente.capacidadEconomicaDeclarada}
                    onChange={(e) => updateCliente('capacidadEconomicaDeclarada', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Ingresos demostrables USD 3.000 - 5.000 / mes"
                  />
                </div>
              </div>

              {/* Rubro y Orden */}
              <div className="border-t border-stone-200 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Producto a Importar:</label>
                  <input
                    type="text"
                    value={formData.cliente.producto}
                    onChange={(e) => updateCliente('producto', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Café verde supremo"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">País de Origen:</label>
                  <input
                    type="text"
                    value={formData.cliente.origen}
                    onChange={(e) => updateCliente('origen', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Colombia / Ecuador"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Cantidad / Volumen:</label>
                  <input
                    type="text"
                    value={formData.cliente.cantidad}
                    onChange={(e) => updateCliente('cantidad', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="50 sacos de 60 kg"
                  />
                </div>
              </div>

              {/* Checkboxes de Validación */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50">
                  <input
                    type="checkbox"
                    checked={formData.cliente.contratoFirmado}
                    onChange={(e) => updateCliente('contratoFirmado', e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Contrato firmado</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50">
                  <input
                    type="checkbox"
                    checked={formData.cliente.kycFirmado}
                    onChange={(e) => updateCliente('kycFirmado', e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>KYC firmado</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50">
                  <input
                    type="checkbox"
                    checked={formData.cliente.cedulaAnexa}
                    onChange={(e) => updateCliente('cedulaAnexa', e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Copia cédula anexa</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50">
                  <input
                    type="checkbox"
                    checked={formData.cliente.esPEP}
                    onChange={(e) => updateCliente('esPEP', e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span className={formData.cliente.esPEP ? 'font-bold text-rose-800' : ''}>Es PEP (Alerta)</span>
                </label>
              </div>
            </div>
          )}

          {/* PASO 2: ANTICIPO EN BOLÍVARES */}
          {activeStep === 2 && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-amber-900">
                <p className="font-semibold">Regla de Oro Bancaria: Bancarización Estricta del Titular</p>
                <p className="text-[11px] mt-0.5">
                  El anticipo SOLO puede provenir de cuenta propia del cliente (transferencia, punto de venta o depósito cheque). Queda terminantemente prohibido el efectivo o transferencias de terceras personas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Monto Anticipo en Bs.:</label>
                  <input
                    type="number"
                    value={formData.anticipo.montoBs}
                    onChange={(e) => updateAnticipo('montoBs', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono font-bold focus:border-amber-400 focus:outline-hidden"
                    placeholder="500000"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Fecha del Anticipo:</label>
                  <input
                    type="date"
                    value={formData.anticipo.fecha}
                    onChange={(e) => updateAnticipo('fecha', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Forma de Pago:</label>
                  <select
                    value={formData.anticipo.formaPago}
                    onChange={(e) => updateAnticipo('formaPago', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                  >
                    <option value="Transferencia">Transferencia</option>
                    <option value="Punto de venta">Punto de venta</option>
                    <option value="Depósito bancario">Depósito bancario</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Banco Origen (Cliente):</label>
                  <input
                    type="text"
                    value={formData.anticipo.bancoOrigen}
                    onChange={(e) => updateAnticipo('bancoOrigen', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Banco Provincial"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Banco Destino (Empresa):</label>
                  <input
                    type="text"
                    value={formData.anticipo.bancoDestino}
                    onChange={(e) => updateAnticipo('bancoDestino', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Banco Provincial"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Referencia Bancaria / Operación:</label>
                  <input
                    type="text"
                    value={formData.anticipo.referencia}
                    onChange={(e) => updateAnticipo('referencia', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    placeholder="REF-0098412854"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">N° Factura Anticipo SENIAT:</label>
                  <input
                    type="text"
                    value={formData.anticipo.facturaSeniat}
                    onChange={(e) => updateAnticipo('facturaSeniat', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono font-bold focus:border-amber-400 focus:outline-hidden"
                    placeholder="A-00123"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-medium text-stone-700 block mb-1">Nota de Caja / Bancaria:</label>
                  <input
                    type="text"
                    value={formData.anticipo.notaCaja || ''}
                    onChange={(e) => updateAnticipo('notaCaja', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Verificación del titular pagador con documento y comprobante"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.anticipo.titularCoincide}
                    onChange={(e) => updateAnticipo('titularCoincide', e.target.checked)}
                    className="rounded text-emerald-600 h-4 w-4"
                  />
                  <span>
                    Certifico bajo fe de juramento que el titular pagador de la cuenta coincide 100% con el cliente ({formData.cliente.nombre}).
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* PASO 3: COMPRA DE DIVISAS (BCV) */}
          {activeStep === 3 && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3 text-sky-900">
                <p className="font-semibold">Mesa de Cambio Bancaria Oficial y Convenio Cambiario N° 1 del BCV</p>
                <p className="text-[11px] mt-0.5">
                  La adquisición de moneda extranjera debe canalizarse a la tasa oficial del BCV del día, consignando la declaración jurada de origen y destino lícito.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Monto Divisas Comprado (USD):</label>
                  <input
                    type="number"
                    value={formData.divisas.montoUsd}
                    onChange={(e) => updateDivisas('montoUsd', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono font-bold focus:border-amber-400 focus:outline-hidden text-sky-900"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Tasa Oficial BCV Usada (Bs/USD):</label>
                  <input
                    type="number"
                    value={formData.divisas.tasaBCV}
                    onChange={(e) => updateDivisas('tasaBCV', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    placeholder="500.00"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Equivalente en Bolívares:</label>
                  <input
                    type="text"
                    disabled
                    value={formatBs(formData.divisas.montoBsEquivalente || formData.divisas.montoUsd * formData.divisas.tasaBCV)}
                    className="w-full rounded-lg border border-stone-200 bg-stone-100 p-2 text-xs font-mono text-stone-700"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Fecha Operación Cambiaria:</label>
                  <input
                    type="date"
                    value={formData.divisas.fechaCompra}
                    onChange={(e) => updateDivisas('fechaCompra', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Banco / Mesa de Cambio:</label>
                  <input
                    type="text"
                    value={formData.divisas.bancoMesaCambio}
                    onChange={(e) => updateDivisas('bancoMesaCambio', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Banco Provincial - Mesa de Cambio"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">N° Solicitud Bancaria:</label>
                  <input
                    type="text"
                    value={formData.divisas.numeroSolicitud}
                    onChange={(e) => updateDivisas('numeroSolicitud', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    placeholder="MC-2026-89104"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">IGTF 3% en Divisas (USD):</label>
                  <input
                    type="number"
                    value={formData.divisas.igtfDivisas3Porc || 0}
                    onChange={(e) => updateDivisas('igtfDivisas3Porc', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    placeholder="30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-medium text-stone-700 block mb-1">Cuenta Custodia / Moneda Extranjera:</label>
                  <input
                    type="text"
                    value={formData.divisas.cuentaCustodiaUsd}
                    onChange={(e) => updateDivisas('cuentaCustodiaUsd', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    placeholder="0108-0024-59-0200114589"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-sky-200 bg-sky-50 text-sky-900 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.divisas.declaracionOrigenDestino}
                    onChange={(e) => updateDivisas('declaracionOrigenDestino', e.target.checked)}
                    className="rounded text-sky-600 h-4 w-4"
                  />
                  <span>
                    Declaración Jurada de Origen y Destino Lícito suscrita y entregada formalmente a la mesa de cambio del banco.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* PASO 4: PROVEEDOR INTERNACIONAL SWIFT */}
          {activeStep === 4 && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 text-indigo-900">
                <p className="font-semibold">Transferencia Internacional al Proveedor (Mensaje SWIFT / MT103)</p>
                <p className="text-[11px] mt-0.5">
                  El beneficiario del pago al exterior debe coincidir de forma idéntica con el emisor de la factura comercial.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">Proveedor Extranjero:</label>
                  <input
                    type="text"
                    value={formData.proveedor.nombreProveedor}
                    onChange={(e) => updateProveedor('nombreProveedor', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Cafés Andinos S.A.S."
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">País del Proveedor:</label>
                  <input
                    type="text"
                    value={formData.proveedor.paisProveedor}
                    onChange={(e) => updateProveedor('paisProveedor', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Colombia"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">ID Fiscal del Proveedor (NIT/RUC):</label>
                  <input
                    type="text"
                    value={formData.proveedor.rifOIdFiscal}
                    onChange={(e) => updateProveedor('rifOIdFiscal', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="NIT 900.452.190-4"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">N° Factura Comercial Proveedor:</label>
                  <input
                    type="text"
                    value={formData.proveedor.facturaNumero}
                    onChange={(e) => updateProveedor('facturaNumero', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono font-bold focus:border-amber-400 focus:outline-hidden"
                    placeholder="INV-2026-455"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Monto Factura Proveedor (USD):</label>
                  <input
                    type="number"
                    value={formData.proveedor.montoUsdFactura}
                    onChange={(e) => updateProveedor('montoUsdFactura', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono font-bold focus:border-amber-400 focus:outline-hidden text-indigo-900"
                    placeholder="980"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Fecha de Transferencia:</label>
                  <input
                    type="date"
                    value={formData.proveedor.fechaPago}
                    onChange={(e) => updateProveedor('fechaPago', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">N° SWIFT / MT103 / TRN:</label>
                  <input
                    type="text"
                    value={formData.proveedor.referenciaSwift}
                    onChange={(e) => updateProveedor('referenciaSwift', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    placeholder="SWIFT-789456"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-medium text-stone-700 block mb-1">Banco Corresponsal Internacional:</label>
                  <input
                    type="text"
                    value={formData.proveedor.bancoCorresponsal}
                    onChange={(e) => updateProveedor('bancoCorresponsal', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Bancolombia S.A. / Citibank New York"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-900 font-medium">
                  <input
                    type="checkbox"
                    checked={formData.proveedor.beneficiarioCoincide}
                    onChange={(e) => updateProveedor('beneficiarioCoincide', e.target.checked)}
                    className="rounded text-indigo-600 h-4 w-4"
                  />
                  <span>
                    Confirmado: El beneficiario de la transferencia bancaria coincide de forma exacta con el nombre de la factura comercial extranjera.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* PASO 5: ADUANA Y PERMISOLOGÍA */}
          {activeStep === 5 && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-emerald-900">
                <p className="font-semibold">Nacionalización Aduanera SENIAT y Permisos de Rubros (SICA/INSAI)</p>
                <p className="text-[11px] mt-0.5">
                  El café y los rubros agroalimentarios exigen guía SICA (SUNAGRO) y permiso sanitario INSAI al ingresar por aduana venezolana.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">N° Bill of Lading (BL) / Guía Aérea:</label>
                  <input
                    type="text"
                    value={formData.importacion.numeroBL}
                    onChange={(e) => updateImportacion('numeroBL', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    placeholder="BL-MAO-2231"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Fecha de Embarque:</label>
                  <input
                    type="date"
                    value={formData.importacion.fechaEmbarque}
                    onChange={(e) => updateImportacion('fechaEmbarque', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Naviera / Agente de Aduana:</label>
                  <input
                    type="text"
                    value={formData.importacion.navieraOAgente}
                    onChange={(e) => updateImportacion('navieraOAgente', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Maersk Line / Agente Aduanal"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">N° Duela / DUA (Declaración Aduanas):</label>
                  <input
                    type="text"
                    value={formData.importacion.numeroDuela}
                    onChange={(e) => updateImportacion('numeroDuela', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono font-bold focus:border-amber-400 focus:outline-hidden"
                    placeholder="DUA-2026-88901"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Fecha de Nacionalización:</label>
                  <input
                    type="date"
                    value={formData.importacion.fechaNacionalizacion}
                    onChange={(e) => updateImportacion('fechaNacionalizacion', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Puerto / Aduana de Entrada:</label>
                  <input
                    type="text"
                    value={formData.importacion.puertoEntrada}
                    onChange={(e) => updateImportacion('puertoEntrada', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="Puerto Cabello / La Guaira"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Arancel e Impuestos Aduana (Bs.):</label>
                  <input
                    type="number"
                    value={formData.importacion.arancelPagadoBs}
                    onChange={(e) => updateImportacion('arancelPagadoBs', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    placeholder="35000"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Guía SUNAGRO / SICA:</label>
                  <input
                    type="text"
                    value={formData.importacion.registroSunagroSica}
                    onChange={(e) => updateImportacion('registroSunagroSica', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    placeholder="SICA-GUIA-440192"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Permiso Sanitario INSAI:</label>
                  <input
                    type="text"
                    value={formData.importacion.permisoInsai}
                    onChange={(e) => updateImportacion('permisoInsai', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    placeholder="INSAI-FITO-2026-1190"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 6: ENTREGA Y CIERRE */}
          {activeStep === 6 && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-rose-900">
                <p className="font-semibold">Facturación Definitiva SENIAT y Liquidación de la Operación</p>
                <p className="text-[11px] mt-0.5">
                  Emisión de factura fiscal final al cliente y cierre formal de la cuenta de pasivo de anticipo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">N° Factura Definitiva SENIAT:</label>
                  <input
                    type="text"
                    value={formData.entrega.facturaDefinitivaSeniat}
                    onChange={(e) => updateEntrega('facturaDefinitivaSeniat', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono font-bold focus:border-amber-400 focus:outline-hidden"
                    placeholder="F-00456"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Fecha de Entrega al Cliente:</label>
                  <input
                    type="date"
                    value={formData.entrega.fechaEntrega}
                    onChange={(e) => updateEntrega('fechaEntrega', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Estado General del Expediente:</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData((prev) => ({ ...prev, estado: e.target.value as any }))}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-semibold focus:border-amber-400 focus:outline-hidden"
                  >
                    <option value="En proceso">En proceso</option>
                    <option value="En aduana">En aduana</option>
                    <option value="Cerrado">Cerrado</option>
                    <option value="Observado">Observado</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Saldo Liquidado en Bs.:</label>
                  <input
                    type="number"
                    value={formData.entrega.saldoCobradoBs}
                    onChange={(e) => updateEntrega('saldoCobradoBs', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    placeholder="15000"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">Comisión / Margen de la Empresa:</label>
                  <input
                    type="text"
                    value={formData.entrega.comisionMargenEmpresa}
                    onChange={(e) => updateEntrega('comisionMargenEmpresa', e.target.value)}
                    className="w-full rounded-lg border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                    placeholder="2% del valor en USD (USD 20)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <input
                    type="checkbox"
                    checked={formData.entrega.entregadoConforme}
                    onChange={(e) => updateEntrega('entregadoConforme', e.target.checked)}
                    className="rounded text-emerald-600 h-4 w-4"
                  />
                  <span>Mercancía recibida a total satisfacción por el cliente (Acta de Entrega firmada).</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <input
                    type="checkbox"
                    checked={formData.entrega.reconciliacionCuadrada}
                    onChange={(e) => updateEntrega('reconciliacionCuadrada', e.target.checked)}
                    className="rounded text-emerald-600 h-4 w-4"
                  />
                  <span>Montos 100% conciliados (Anticipo + Saldo = Factura Definitiva).</span>
                </label>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">Observaciones y Notas de Cumplimiento:</label>
                <textarea
                  rows={3}
                  value={formData.observaciones}
                  onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
                  className="w-full rounded-xl border border-stone-200 p-2 text-xs focus:border-amber-400 focus:outline-hidden"
                  placeholder="Detalles sobre gastos bancarios, diferencias cambiarias o auditoría..."
                />
              </div>
            </div>
          )}

          {/* PASO 7: CHECKLIST DOCUMENTAL DE 13 RECAUDOS */}
          {activeStep === 7 && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-700">
                <p className="font-semibold">Checklist de los 13 Recaudos Obligatorios para Instituciones Bancarias</p>
                <p className="text-[11px] mt-0.5">
                  Marque cada recaudo a medida que se encuentre archivado físicamente o digitalmente en el expediente. Se deben conservar por al menos 5 años.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  ['contratoCompraventa', '1. Contrato de compraventa con entrega futura firmado'],
                  ['cuestionarioKYC', '2. Cuestionario KYC debidamente diligenciado y firmado'],
                  ['copiaCedulaRif', '3. Copia de Cédula de Identidad y RIF vigente'],
                  ['facturaAnticipoSeniat', '4. Factura del anticipo emitida según Providencia SENIAT 00071'],
                  ['comprobantePagoCliente', '5. Comprobante bancario del pago recibido del cliente'],
                  ['solicitudDivisasBCV', '6. Solicitud bancaria de compra de divisas en mesa de cambio'],
                  ['declaracionOrigenDestinoLícito', '7. Declaración jurada de origen y destino lícito de recursos'],
                  ['facturaProveedor', '8. Factura comercial del proveedor internacional'],
                  ['comprobanteSwift', '9. Comprobante bancario de transferencia internacional SWIFT MT103'],
                  ['billOfLading', '10. Bill of Lading (BL) o Guía de Embarque Aéreo'],
                  ['duelaAduana', '11. Declaración de aduana SENIAT (Duela / DUA)'],
                  ['licenciaSunagroInsai', '12. Guía SICA (SUNAGRO) y permisos sanitarios INSAI'],
                  ['facturaDefinitivaSeniat', '13. Factura definitiva de venta SENIAT'],
                  ['comprobanteEntrega', '14. Comprobante o acta de entrega conforme firmada por el cliente'],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors cursor-pointer ${
                      formData.documentos[key as keyof typeof formData.documentos]
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(formData.documentos[key as keyof typeof formData.documentos])}
                      onChange={(e) => updateDocumento(key, e.target.checked)}
                      className="rounded text-emerald-600 h-4 w-4"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Pie del Modal con Botones */}
        <div className="flex items-center justify-between border-t border-stone-200 px-6 py-3 bg-stone-50 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 disabled:opacity-40 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              ← Anterior
            </button>
            <span className="text-stone-400">Paso {activeStep} de 7</span>
            <button
              onClick={() => setActiveStep((prev) => Math.min(7, prev + 1))}
              disabled={activeStep === 7}
              className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 disabled:opacity-40 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Siguiente →
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAndClose}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
