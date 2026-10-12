import React, { useState } from 'react';
import { Printer, ArrowLeft, Stamp, CheckCircle, ShieldCheck, FileDown, Download, Loader2 } from 'lucide-react';
import { exportToWord, downloadElementAsPdf } from '../utils/exportUtils';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import { BANESCO_AUDIT_INFO_2026 } from '../data/agricolaOniAudit2026Data';
import { useAppData } from '../context/AppDataContext';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
  onBackToFullLetter: () => void;
}

export const AgricolaOniBanescoOnePageLetterView: React.FC<Props> = ({ company, currentRate, onBackToFullLetter }) => {
  const { bankMovements } = useAppData();
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingWord, setDownloadingWord] = useState(false);

  const totalCredits = bankMovements.reduce((acc, m) => acc + m.creditVES, 0);
  const totalDebits = bankMovements.reduce((acc, m) => acc + m.debitVES, 0);
  const liveBankBalance = totalCredits - totalDebits;
  const liveBankBalanceUSD = currentRate.rateUsd > 0 ? liveBankBalance / currentRate.rateUsd : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    try {
      setDownloadingWord(true);
      const sheet = document.getElementById('carta-banesco-1-pagina-paper');
      if (sheet) {
        await exportToWord(
          'Carta_Banesco_1_Pagina_Agricola_Oni.docx',
          'Carta Banesco 1 Página Ejecutiva',
          sheet.innerHTML
        );
      }
    } catch (err) {
      console.error('Error al exportar Word:', err);
    } finally {
      setDownloadingWord(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setDownloadingPdf(true);
      await downloadElementAsPdf(
        'carta-banesco-1-pagina-paper',
        'Carta_Banesco_1_Pagina_Agricola_Oni.pdf'
      );
    } catch (err) {
      console.error('Error al exportar PDF:', err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900 border border-stone-800 p-3 rounded-lg no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToFullLetter}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors"
            title="Volver a la carta extendida"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Carta Banesco Formato Ejecutivo (1 Página Exacta)
            </h3>
            <p className="text-[11px] text-stone-400">
              Calibrada para impresión en una sola hoja tamaño carta oficial con membrete y sellos de la empresa
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportWord}
            disabled={downloadingWord}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar directamente en formato Microsoft Word (.docx)"
          >
            {downloadingWord ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
            {downloadingWord ? 'Generando Word...' : 'Descargar Word (.docx)'}
          </button>
          <button
            onClick={handleExportPdf}
            disabled={downloadingPdf}
            className="px-3.5 py-1.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar directamente el archivo PDF (.pdf)"
          >
            {downloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {downloadingPdf ? 'Generando PDF...' : 'Descargar PDF (.pdf)'}
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Imprimir en impresora física (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </div>

      {/* The 1-Page Letter Sheet */}
      <div id="carta-banesco-1-pagina-paper" className="bg-white text-stone-900 p-8 sm:p-10 max-w-3xl mx-auto rounded-lg shadow-xl border border-stone-200 text-[12px] leading-tight font-sans print:p-0 print:border-none print:shadow-none print:text-[11px]">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-stone-900 pb-3 mb-4">
          <div>
            <h1 className="text-xl font-bold font-serif-doc tracking-tight text-stone-950">{company.name}</h1>
            <p className="text-[10px] font-bold text-stone-700 uppercase tracking-wider">INTERMEDIACIÓN COMERCIAL & IMPORTACIÓN DE CAFÉ &middot; RIF: {company.rif}</p>
            <p className="text-[9.5px] text-stone-600">{company.address}</p>
            <p className="text-[9.5px] text-stone-600">Contacto: {company.phone} | {company.email}</p>
          </div>
          <div className="text-right text-[10px] font-mono-num border-l border-stone-400 pl-3">
            <p className="font-bold text-stone-900">OFICIO N° AO-DIR-BAN-2026-042</p>
            <p className="text-stone-600">REF: {BANESCO_AUDIT_INFO_2026.fileNumber}</p>
            <p className="text-stone-700 mt-1">Acarigua, {new Date().toLocaleDateString('es-VE')}</p>
          </div>
        </div>

        {/* Addressee & Subject */}
        <div className="mb-2.5">
          <p className="font-bold text-stone-900">CIUDADANOS: BANESCO BANCO UNIVERSAL, C.A.</p>
          <p className="text-stone-700">Gerencia de Auditoría y Unidad de Prevención LC/FT &mdash; Atención: Lcdo. Roberto Albarrán</p>
          <p className="text-stone-900 text-[10.5px] font-bold pt-0.5">
            Asunto: Justificación de Disparidad entre Ventas en EEFF (Bs. 92.641.520,01 / USD 116.531,68) y Créditos Movilizados en BBU (USD 2.781.830,18 / Bs. 1.966.597.105,35)
          </p>
        </div>

        {/* Concise Declarative Text */}
        <div className="space-y-2 text-justify text-stone-800">
          <p>
            En representación legal de <strong>{company.name}</strong> (RIF {company.rif}), damos formal respuesta a su requerimiento informando que <strong>no existe omisión de ingresos</strong>. Nuestra empresa opera como <strong>INTERMEDIARIA COMERCIAL E IMPORTADORA DE CAFÉ</strong> (la producción venezolana no cubre la demanda interna) y la disparidad entre los créditos bancarios y los ingresos declarados al 31/08/2026 se justifica técnicamente en:
          </p>

          <div className="bg-stone-50 border border-stone-300 rounded p-2.5 space-y-1.5 text-[10.5px]">
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-amber-800">1.</span>
              <span><strong>Anticipos en Ventas de Clientes (78,4% &mdash; Bs. 1.542,02M / USD 2.270.486,23):</strong> Son anticipos de torrefactoras nacionales para intermediar e importar café desde Colombia. Conforme a la <strong>NIIF 15</strong> y el Art. 1152 del Código Civil, son <em>Pasivo Corriente</em>, no ventas devengadas. La entrega física y facturación definitiva SENIAT inician en <strong>OCTUBRE 2026</strong>.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-amber-800">2.</span>
              <span><strong>Reintegros Mutuo Manuel Becerra (9,5% &mdash; Bs. 186,38M / USD 286.228,93):</strong> Amortizaciones de capital de la línea de crédito rotativa de Bs. 600M suscrita con el socio Manuel Becerra. Disminuyen la cuenta de activo exigible (saldo por cobrar en balance: Bs. 325,95M). No es venta.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-amber-800">3.</span>
              <span><strong>Transferencias entre Cuentas Propias (10,6% &mdash; Bs. 208,71M):</strong> Movilizaciones internas desde Provincial, Mercantil, Plaza y Bancamiga con el mismo titular RIF J-50145638-0. Impacto patrimonial neto: Bs. 0,00.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-amber-800">4.</span>
              <span><strong>Compra de Divisas en Banesco Mesa de Cambio ($556.890,45 USD):</strong> Empleadas en pagar proveedores en Colombia ($445.000), fletes ($67.380) y aduana ($35.000).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-emerald-800">5.</span>
              <span><strong>Ingresos Reales Declarados en EEFF (Bs. 92.641.520,01 / USD 116.531,68):</strong> Integrados por Bs. 78.717.472,35 de Servicios Agrícolas facturados y Bs. 13.924.047,66 de Intereses del Mutuo Becerra, coincidiendo al céntimo con el Estado de Resultados.</span>
            </div>
            <div className="flex items-start gap-1.5 bg-emerald-50 p-1.5 rounded border border-emerald-200">
              <span className="font-bold text-emerald-900">6.</span>
              <span><strong>Sustento Legal Constitutivo (Acta 2021) y Accionista Único:</strong> Inscrita en el Registro Mercantil el 16/09/2021 (Tomo 31-A, N° 18, RIF J-50145638-0). Su Objeto Social de 2021 autoriza expresamente la intermediación comercial, importación de café y contratos financieros. El 100% de las acciones pertenecen exclusivamente al <strong>Sr. ELÍAS RAFAEL TRÍAS ABREU (C.I. V-18.492.301)</strong>.</span>
            </div>
          </div>

          {/* Resumen de Cuadre de Auditoría Banesco */}
          <div className="border border-emerald-800 rounded p-2.5 bg-emerald-50/90 flex items-center justify-between gap-3 text-xs font-mono-num shadow-sm">
            <div>
              <span className="font-sans font-bold text-emerald-950 block text-[11px] uppercase">
                🎯 CUADRE DEFINITIVO DE AUDITORÍA BANESCO (01/01/2026 AL 31/08/2026):
              </span>
              <span className="text-[10px] text-emerald-850 font-sans block mt-0.5">
                Explicación del 100% de los Créditos Bancarios (USD 2.781.830,18) vs Ventas Declaradas en EEFF (USD 116.531,68 / Bs. 92.641.520,01)
              </span>
            </div>
            <div className="text-right whitespace-nowrap">
              <span className="text-xs font-bold text-emerald-950 bg-emerald-200 px-2 py-0.5 rounded border border-emerald-400 block font-mono">
                DIFERENCIA SIN JUSTIFICAR: BS. 0,00
              </span>
              <span className="text-[9.5px] text-emerald-800 font-semibold font-sans block mt-0.5">
                Conciliación Auditada al 100% &middot; Sin Omisión de Ingresos
              </span>
            </div>
          </div>

          <p className="text-[11px]">
            Constatamos la autenticidad de los soportes anexos (facturas, guías y conciliación) en el expediente {BANESCO_AUDIT_INFO_2026.fileNumber}.
          </p>
        </div>

        {/* Dual Signature Block */}
        <div className="mt-8 pt-4 border-t border-stone-300 grid grid-cols-2 gap-6 text-center">
          <div>
            <div className="h-10 flex items-center justify-center">
              <span className="font-serif italic text-amber-900 text-xs border-b border-stone-600 px-4">Omar Pérez &mdash; Rep. Legal</span>
            </div>
            <p className="font-bold text-stone-900 text-[11px] mt-1">{company.legalRepresentative}</p>
            <p className="text-[10px] text-stone-600">C.I.: {company.idNumber} &middot; Presidente</p>
            <p className="text-[10px] font-semibold text-stone-800">{company.name}</p>
          </div>

          <div>
            <div className="h-10 flex items-center justify-center">
              <span className="font-mono text-emerald-800 text-[10px] border-b border-stone-600 px-4">Lcda. Carmen Rivas CPC 41.802</span>
            </div>
            <p className="font-bold text-stone-900 text-[11px] mt-1">Lcda. Carmen Rivas</p>
            <p className="text-[10px] text-stone-600">Contador Público Colegiado</p>
            <p className="text-[10px] font-semibold text-stone-800">Auditor Financiero Externo</p>
          </div>
        </div>

        <div className="mt-6 pt-2 border-t border-stone-200 text-[9px] text-stone-400 text-center flex justify-between font-mono">
          <span>EXPEDIENTE: AUD-BAN-2026-ONI-094</span>
          <span>VALIDEZ SUDEBAN / BANESCO BANCO UNIVERSAL</span>
        </div>
      </div>
    </div>
  );
};
