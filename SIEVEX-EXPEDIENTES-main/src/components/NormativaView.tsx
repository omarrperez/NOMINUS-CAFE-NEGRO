import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  Landmark,
  FileCheck,
  BookOpen,
  CheckCircle2,
  Download,
  Loader2,
  FileText,
  Building2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { DatosEmpresaImportadora } from '../types';
import { downloadPdfGuiaMarcoLegal } from '../utils/pdfGenerator';

interface NormativaViewProps {
  empresa: DatosEmpresaImportadora;
}

export const NormativaView: React.FC<NormativaViewProps> = ({ empresa }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      // Breve delay para feedback visual
      await new Promise((r) => setTimeout(r, 200));
      downloadPdfGuiaMarcoLegal(empresa);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } catch (error) {
      console.error('Error generando Guía del Marco Legal en PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast de confirmación de descarga */}
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 text-emerald-300" />
          <span>¡Guía del Marco Legal, Cambiario y Bancario descargada con éxito en PDF!</span>
        </div>
      )}

      {/* Encabezado con Botón de Descarga Destacado */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Scale className="h-5 w-5 text-amber-800" />
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                Marco Legal, Cambiario y Bancario de Venezuela
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 border border-stone-200">
                Guía de Cumplimiento Regulatorio
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Resumen técnico-jurídico preparado para oficiales de cumplimiento, auditores y gerencia de operaciones en Venezuela · {empresa.razonSocial} (RIF {empresa.rif}).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-700 hover:bg-amber-800 active:bg-amber-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:shadow-md disabled:opacity-60 cursor-pointer"
              title="Descargar la Guía Oficial del Marco Legal en formato PDF de alta resolución"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 text-amber-200" />
                  <span>Descargar Guía en PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Barra informativa de empresa asignada */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-500">
          <span className="inline-flex items-center gap-1 font-medium text-stone-700">
            <Building2 className="h-3.5 w-3.5 text-amber-700" />
            {empresa.razonSocial}
          </span>
          <span>•</span>
          <span>RIF: <strong className="text-stone-700">{empresa.rif}</strong></span>
          <span>•</span>
          <span>Rep. Legal: <strong className="text-stone-700">{empresa.representanteLegal}</strong> (C.I. {empresa.cedulaRepresentante})</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="h-3 w-3" />
            Convenio Cambiario N° 1 BCV · Resol. SUDEBAN 083.18
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Columna 1: Régimen Cambiario y BCV */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Landmark className="h-4 w-4 text-amber-800" />
                <h2 className="text-sm font-bold text-stone-900">
                  1. Régimen Cambiario Vigente del Banco Central de Venezuela (BCV)
                </h2>
              </div>
            </div>
            <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
              <p>
                <strong>• Derogación del Régimen de Ilícitos Cambiarios:</strong> Mediante Decreto Constituyente de fecha 02 de agosto de 2018 (G.O. N° 41.452), fue derogada en su totalidad la Ley del Régimen de Ilícitos Cambiarios, restituyendo la libre convertibilidad de la moneda y despenalizando las transacciones en divisas.
              </p>
              <p>
                <strong>• Convenio Cambiario N° 1 (G.O. 6.405 Extraordinario del 07/09/2018):</strong> Establece el marco general de libre convertibilidad de la moneda en todo el territorio nacional. Las empresas y particulares pueden adquirir y vender divisas legalmente mediante las <em>Mesas de Cambio</em> del sistema bancario nacional supervisado.
              </p>
              <p>
                <strong>• Declaración de Origen y Destino Lícito:</strong> Es requisito normativo obligatorio suscrito ante el banco para toda compra de divisas. El importador debe demostrar que los fondos en Bolívares provienen de ventas legítimas (anticipos con factura SENIAT) y que las divisas están destinadas al pago directo a un proveedor extranjero con factura comercial.
              </p>
              <p>
                <strong>• Destino no consumido de divisas:</strong> La normativa cambiaria estipula que toda divisa adquirida para una importación que no se concrete o tenga remanentes debe ser reintegrada o vendida al banco; jamás puede desviarse a cuentas particulares ni operaciones no declaradas.
              </p>
              <p>
                <strong>• Impuesto a las Grandes Transacciones Financieras (IGTF):</strong> Grava con una alícuota del 3% los pagos y transferencias efectuados en divisas dentro del sistema financiero nacional o a Sujetos Pasivos Especiales.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-800" />
              <h2 className="text-sm font-bold text-stone-900">
                2. Régimen Tributario SENIAT y Facturación
              </h2>
            </div>
            <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
              <p>
                <strong>• Providencia SENIAT SNAT/2011/00071:</strong> Toda recepción de dinero previa a la entrega de bienes o prestación de servicios debe ser documentada obligatoriamente mediante una <em>Factura de Anticipo</em> con IVA correspondiente.
              </p>
              <p>
                <strong>• Factura Definitiva al Cierre:</strong> Al momento de la nacionalización y entrega material del café, se emite la Factura Definitiva, imputando el anticipo facturado previamente y liquidando el saldo restante.
              </p>
              <p>
                <strong>• Retenciones de ISLR e IVA:</strong> Aplicables según la condición de Contribuyente Especial de las partes intervinientes.
              </p>
            </div>
          </div>
        </div>

        {/* Columna 2: SUDEBAN y Prevención de Legitimación */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-sky-200/80 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-sky-800" />
              <h2 className="text-sm font-bold text-stone-900">
                3. Normativa Bancaria SUDEBAN (Resolución 083.18)
              </h2>
            </div>
            <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
              <p>
                <strong>• Instructivo LC/FT/FPADM:</strong> Normas relativas a la Administración y Fiscalización de los Riesgos relacionados con los Delitos de Legitimación de Capitales, Financiamiento al Terrorismo y Financiamiento de la Proliferación de Armas de Destrucción Masiva.
              </p>
              <p>
                <strong>• Política "Conozca a su Cliente" (KYC):</strong> Exigencia ineludible de conformar un expediente individual para cada persona natural que contenga: cédula de identidad, RIF vigente, constancia o certificación de ingresos, perfil económico y declaración de condición PEP (Persona Expuesta Políticamente).
              </p>
              <p>
                <strong>• Regla de Oro - Titularidad Bancaria Estricta:</strong> La SUDEBAN y las unidades de cumplimiento bancario sancionan severamente la recepción de fondos de terceras personas no firmantes del contrato. El dinero del anticipo debe salir exclusivamente de una cuenta bancaria a nombre del titular contratante. Cero depósitos en efectivo sin justificación.
              </p>
              <p>
                <strong>• Plazo de Custodia Documental (5 Años):</strong> El Artículo 42 de la Ley Orgánica contra la Delincuencia Organizada y las normas de SUDEBAN ordenan conservar los expedientes completos y comprobantes por un lapso no menor a <strong>cinco (5) años</strong> continuos.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-stone-800" />
              <h2 className="text-sm font-bold text-stone-900">
                4. Estructura Jurídica Mercantil: Importador de Registro
              </h2>
            </div>
            <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
              <p>
                <strong>• Compraventa con Entrega Futura (Código de Comercio Art. 133):</strong> La empresa actúa en su propio nombre y riesgo como importadora y vendedora de la mercancía. El cliente compra café que la empresa importará.
              </p>
              <p>
                <strong>• No es Gestión de Fondos Ajenos:</strong> Al estructurarse como compraventa comercial con anticipo de precio, la empresa <strong>no administra dinero de terceros</strong> ni requiere licencias bancarias o fiduciarias reservadas para instituciones financieras.
              </p>
              <p>
                <strong>• Rubros Regulados (Café):</strong> Requiere registro en el Sistema Integral de Control Agroalimentario (<strong>SUNAGRO / SICA</strong>) y la emisión de guías de movilización, así como los permisos zoosanitarios y fitosanitarios del Instituto Nacional de Salud Agrícola Integral (<strong>INSAI</strong>).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de Auditoría Rápida */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 text-xs text-emerald-950 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            <span>Protocolo ante Solicitud de Información del Oficial de Cumplimiento Bancario</span>
          </h3>
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Descargar Guía Completa en PDF</span>
          </button>
        </div>
        <p className="leading-relaxed">
          Cuando el banco emita una alerta o solicite justificación del movimiento en Bolívares o compra de divisas, presente inmediatamente:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-emerald-900">
          <li>La <strong>Carta de Explicación al Banco</strong> dirigida a la Unidad de Cumplimiento (disponible en la pestaña Documentos).</li>
          <li>La <strong>Tapa de Expediente Regulatorio</strong> con los 13 recaudos marcados y las firmas de auditoría.</li>
          <li>El <strong>Contrato de Compraventa con Entrega Futura</strong> firmado por el cliente antes de recibir el anticipo.</li>
          <li>El <strong>Cuestionario KYC</strong> con copia de cédula y RIF demostrando el origen de fondos.</li>
          <li>El <strong>Comprobante bancario</strong> y Factura de Anticipo SENIAT donde se evidencie que el pagador es el mismo titular.</li>
          <li>La <strong>Factura Comercial del Proveedor Internacional</strong> y el Comprobante SWIFT que respaldan el destino de los dólares.</li>
        </ul>
      </div>
    </div>
  );
};
