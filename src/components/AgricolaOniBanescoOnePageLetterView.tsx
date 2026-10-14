import React, { useState } from 'react';
import { Printer, ArrowLeft, Stamp, CheckCircle, ShieldCheck, FileDown, Download, Loader2 } from 'lucide-react';
import {
  exportToWord,
  downloadElementAsPdf,
  exportMasterBanescoComplianceFolderPdf,
  exportMasterBanescoComplianceFolderWord,
  exportCarta1Pdf,
  exportCarta1Word,
  exportCarta2Pdf,
  exportCarta2Word
} from '../utils/exportUtils';
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
      const letterWordHtml = `
        <div style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 10.5pt; color: #0f172a; line-height: 1.4; padding: 10px; max-width: 700px; margin: 0 auto;">
          <!-- MEMBRETE EN TABLA DE ALTA FIDELIDAD -->
          <table style="width: 100%; border-collapse: collapse; border-bottom: 2pt solid #0f766e; margin-bottom: 12px; padding-bottom: 8px;">
            <tr>
              <td style="vertical-align: top; text-align: left;">
                <h1 style="font-size: 15pt; color: #0f172a; margin: 0 0 2px 0; font-weight: bold; text-transform: uppercase;">
                  ${company.name}
                </h1>
                <p style="font-size: 9pt; color: #334155; margin: 0 0 2px 0; font-weight: bold; text-transform: uppercase;">
                  INTERMEDIACIÓN COMERCIAL & COMPRA DE CAFÉ NACIONAL A TASA BCV &middot; R.I.F.: ${company.rif}
                </p>
                <p style="font-size: 8.5pt; color: #475569; margin: 0;">
                  ${company.address}<br>
                  Contacto: ${company.phone} | ${company.email}
                </p>
              </td>
              <td style="vertical-align: top; text-align: right; width: 210px; border-left: 1.5pt solid #cbd5e1; padding-left: 10px;">
                <p style="font-size: 8.5pt; font-weight: bold; color: #0f172a; margin: 0; text-transform: uppercase;">
                  LUGAR Y FECHA DE EMISIÓN
                </p>
                <p style="font-size: 9.5pt; font-weight: bold; color: #0f766e; margin: 3px 0 0 0;">
                  Barcelona, 31 de Agosto de 2026
                </p>
                <p style="font-size: 8pt; color: #64748b; margin: 3px 0 0 0;">
                  Tasa Oficial BCV: Bs. ${currentRate.rateUsd.toFixed(2)} / USD
                </p>
              </td>
            </tr>
          </table>

          <!-- DESTINATARIO Y ASUNTO EN CUADRO ENMARCADO -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
            <tr>
              <td>
                <p style="font-weight: bold; margin: 0 0 2px 0; font-size: 10.5pt; color: #0f172a;">
                  CIUDADANOS: BANESCO BANCO UNIVERSAL, C.A.
                </p>
                <p style="color: #334155; margin: 0 0 6px 0; font-size: 9.5pt;">
                  Gerencia de Auditoría Interna y Unidad de Prevención y Control LC/FT (UPCLC/FT) Banesco Banco Universal
                </p>
                <div style="background-color: #f8fafc; border: 1pt solid #cbd5e1; border-left: 3.5pt solid #0f766e; padding: 7px 10px; font-weight: bold; font-size: 9.5pt; color: #0f172a; text-align: justify;">
                  ASUNTO: CARTA DE RESPUESTA FORMAL Y SÍNTESIS DE AUDITORÍA BANCARIA — JUSTIFICACIÓN DE FONDOS MOVILIZADOS ($2.912.368,95 USD / Bs. 1.966.597.105,35) VS ESTADOS FINANCIEROS (CUENTAS CORRIENTES N° 0134-0342-18-3421089912 EN VES Y N° 0134-0342-12-3420084712 EN USD CONVENIO 20).
                </div>
              </td>
            </tr>
          </table>

          <!-- TEXTO DECLARATIVO DE LA EMPRESA -->
          <p style="text-align: justify; margin-bottom: 10px; font-size: 9.5pt;">
            En representación legal de <strong>${company.name}</strong> (R.I.F. ${company.rif}), damos formal respuesta a su requerimiento informando que <strong>NO EXISTE OMISIÓN DE INGRESOS NI DIFERENCIA NO JUSTIFICADA</strong>. Nuestra empresa opera exclusivamente como <strong>INTERMEDIARIA COMERCIAL Y MANDANTE EN LA COMPRA DE CAFÉ VERDE 100% NACIONAL EN VENEZUELA</strong> para torrefactoras e industrias venezolanas. No importamos café de Colombia ni del exterior; todo el café se adquiere en el mercado nacional a tipo de cambio oficial publicado por el Banco Central de Venezuela (BCV). La movilización bancaria acumulada se justifica con total solidez técnica y contable:
          </p>

          <!-- TABLA DE DESGLOSE CUADRADA -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 9pt; background-color: #f8fafc; border: 1pt solid #cbd5e1;">
            <tr>
              <td style="padding: 7px 9px; border-bottom: 1pt solid #e2e8f0;">
                <strong>1. Anticipos de Clientes Jurídicos en Bolívares (78,41% — Bs. 1.542.017.092,63 / $2.270.486,23 USD):</strong><br>
                Fondos recibidos de compradores bajo Contrato Marco de Intermediación. Registrados como <em>Pasivos Corrientes Exigibles en Café</em> bajo NIIF 15 / Sección 23. Se sustituyen por factura fiscal SENIAT en Octubre 2026 con la entrega del café.
              </td>
            </tr>
            <tr>
              <td style="padding: 7px 9px; border-bottom: 1pt solid #e2e8f0;">
                <strong>2. Reintegros Capital Mutuo Manuel Becerra (9,48% — Bs. 186.376.000,00 / $286.228,93 USD):</strong><br>
                Amortización de Activo Financiero de la Línea de Crédito Rotativa suscrita con el socio Manuel Becerra. Disminuyen la Cuenta por Cobrar en balance. No constituye venta ni ingreso.
              </td>
            </tr>
            <tr>
              <td style="padding: 7px 9px; border-bottom: 1pt solid #e2e8f0;">
                <strong>3. Transferencias Cuentas Propias Agrícola Oni (10,61% — Bs. 208.708.057,73 / $308.317,80 USD):</strong><br>
                Traspasos de tesorería interna desde Provincial, Mercantil, Plaza y Bancamiga mismo RIF J-50145638-0. Impacto patrimonial neto: Bs. 0,00.
              </td>
            </tr>
            <tr>
              <td style="padding: 7px 9px; border-bottom: 1pt solid #e2e8f0;">
                <strong>4. Aportes Operativos Accionista / Personas Naturales (1,50% — Bs. 29.495.954,99 / $47.335,99 USD):</strong><br>
                Inyecciones de liquidez Presidente Sr. Elias Rafael Trías Abreu y anticipos de compradores personas naturales.
              </td>
            </tr>
            <tr>
              <td style="padding: 7px 9px; border-bottom: 1pt solid #e2e8f0;">
                <strong>5. Ingresos Reales Declarados en EEFF (Bs. 92.641.520,01 / $116.531,68 USD):</strong><br>
                Servicios Agrícolas facturados ($78,72M) + Intereses Ganados Mutuo ($13,92M), 100% idéntico al Estado de Resultados al 31/08/2026.
              </td>
            </tr>
            <tr>
              <td style="padding: 7px 9px;">
                <strong>6. Operaciones Mesa Cambiaria Banesco ($556.890,45 USD) y Sustento Legal (Acta 2021):</strong><br>
                Divisas liquidadas e invertidas 100% en Venezuela en insumos agrícolas, fletes terrestres y servicios técnicos. Acta Constitutiva de 16/09/2021 (Tomo 44-A, N° 12) autoriza la intermediación de café y pertenece 100% al Sr. ELÍAS RAFAEL TRÍAS ABREU (C.I. V-23.997.829).
              </td>
            </tr>
          </table>

          <!-- CUADRE AUDITORÍA DESTACADO EN VERDE -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; background-color: #f0fdf4; border: 1.5pt solid #16a34a;">
            <tr>
              <td style="padding: 9px; text-align: center; color: #15803d;">
                <p style="margin: 0; font-size: 10pt; font-weight: bold; text-transform: uppercase;">
                  🎯 CUADRE DEFINITIVO DE AUDITORÍA BANESCO — DIFERENCIA FINAL POR OMISIÓN DE INGRESOS: BS. 0,00 ($0,00 USD)
                </p>
                <p style="margin: 3px 0 0 0; font-size: 8.5pt; color: #166534;">
                  Conciliación Auditada al 100% &middot; Explicación Total del Monto Exigido de $2.912.368,95 USD (Bs. 1.966.597.105,35)
                </p>
              </td>
            </tr>
          </table>

          <p style="font-size: 9pt; margin-bottom: 15px; color: #334155; text-align: justify;">
            Constatamos la autenticidad de los soportes anexos (facturas, guías y conciliación) adjuntos a la presente comunicación.
          </p>

          <!-- FIRMA CENTRADA Y CUADRADA DEL PRESIDENTE -->
          <table style="width: 100%; border-collapse: collapse; margin-top: 25px;">
            <tr>
              <td style="text-align: center;">
                <p style="margin: 0 0 35px 0; font-size: 9.5pt; color: #334155;">Atentamente,</p>
                <div style="display: inline-block; border-top: 1.5pt solid #0f172a; width: 300px; padding-top: 6px;">
                  <p style="margin: 0; font-weight: bold; font-size: 10.5pt; color: #0f172a;">
                    SR. ELÍAS RAFAEL TRÍAS ABREU
                  </p>
                  <p style="margin: 2px 0 0 0; font-size: 9pt; color: #475569;">
                    Presidente y Representante Legal &middot; C.I. V-23.997.829
                  </p>
                  <p style="margin: 2px 0 0 0; font-size: 9pt; font-weight: bold; color: #0f766e;">
                    ${company.name} &middot; R.I.F. ${company.rif}
                  </p>
                </div>
              </td>
            </tr>
          </table>

          <!-- FOOTER -->
          <p style="margin-top: 20px; text-align: center; font-size: 8pt; color: #64748b; border-top: 1pt solid #e2e8f0; padding-top: 6px;">
            DOCUMENTO OFICIAL DE RESPUESTA Y RESPALDO BANCARIO &middot; BANESCO BANCO UNIVERSAL, C.A.
          </p>
        </div>
      `;

      await exportToWord(
        'Carta_2_Respuesta_Oficial_Banesco_Agricola_Oni.doc',
        'Carta Banesco 1 Página Ejecutiva',
        letterWordHtml
      );
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
              Calibrada para impresión y descarga oficial en Word (.doc/.docx) y PDF con diseño cuadrado institucional
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* CARTA 2 DOWNLOADS */}
          <button
            onClick={async () => {
              try {
                setDownloadingPdf(true);
                await exportCarta2Pdf(company, currentRate);
              } catch (err) {
                console.error(err);
              } finally {
                setDownloadingPdf(false);
              }
            }}
            disabled={downloadingPdf}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow cursor-pointer"
            title="Descargar Carta 2 (1 Página) en PDF (.pdf)"
          >
            {downloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Descargar Carta 2 (PDF)
          </button>

          <button
            onClick={async () => {
              try {
                setDownloadingWord(true);
                await exportCarta2Word(company, currentRate);
              } catch (err) {
                console.error(err);
              } finally {
                setDownloadingWord(false);
              }
            }}
            disabled={downloadingWord}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow cursor-pointer"
            title="Descargar Carta 2 (1 Página) en Microsoft Word (.docx/.doc) perfectamente cuadrada"
          >
            {downloadingWord ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
            Descargar Carta 2 (Word)
          </button>

          {/* CARTA 1 DOWNLOADS */}
          <button
            onClick={async () => {
              try {
                setDownloadingPdf(true);
                await exportCarta1Pdf(company);
              } catch (err) {
                console.error(err);
              } finally {
                setDownloadingPdf(false);
              }
            }}
            disabled={downloadingPdf}
            className="px-3 py-1.5 bg-teal-800 hover:bg-teal-700 text-teal-100 border border-teal-600 font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow cursor-pointer"
            title="Descargar Carta 1 (Extendida) en PDF (.pdf)"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar Carta 1 (PDF)
          </button>

          <button
            onClick={async () => {
              try {
                setDownloadingWord(true);
                await exportCarta1Word(company);
              } catch (err) {
                console.error(err);
              } finally {
                setDownloadingWord(false);
              }
            }}
            disabled={downloadingWord}
            className="px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-100 border border-indigo-600 font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow cursor-pointer"
            title="Descargar Carta 1 (Extendida) en Word (.docx/.doc)"
          >
            <FileDown className="w-3.5 h-3.5" />
            Descargar Carta 1 (Word)
          </button>

          {/* EXPEDIENTE COMPLETO */}
          <button
            onClick={async () => {
              try {
                setDownloadingPdf(true);
                await exportMasterBanescoComplianceFolderPdf({
                  companyName: company.name,
                  companyRif: company.rif,
                  address: company.address,
                  bcvRate: currentRate.rateUsd
                });
              } catch (e) {
                console.error(e);
              } finally {
                setDownloadingPdf(false);
              }
            }}
            disabled={downloadingPdf}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow cursor-pointer"
            title="Descargar Expediente Completo con Cartas, Anexos, Separadores A-E y EEFF en PDF"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            Expediente Completo (PDF)
          </button>

          <button
            onClick={async () => {
              try {
                setDownloadingWord(true);
                await exportMasterBanescoComplianceFolderWord({
                  companyName: company.name,
                  companyRif: company.rif,
                  address: company.address,
                  bcvRate: currentRate.rateUsd
                });
              } catch (e) {
                console.error(e);
              } finally {
                setDownloadingWord(false);
              }
            }}
            disabled={downloadingWord}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow cursor-pointer"
            title="Descargar Expediente Completo en Microsoft Word (.docx) editable"
          >
            <FileDown className="w-3.5 h-3.5" />
            Expediente Completo (Word)
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

      {/* The 1-Page Letter Sheet (Styled with HTML Tables for 100% Word / PDF alignment) */}
      <div id="carta-banesco-1-pagina-paper" className="bg-white text-stone-900 p-6 sm:p-8 max-w-3xl mx-auto rounded-lg shadow-xl border border-stone-200 text-[11.5px] leading-tight font-sans print:p-0 print:border-none print:shadow-none print:text-[11px]">
        {/* Header Table */}
        <table className="w-full border-collapse border-b-2 border-stone-900 pb-2 mb-3">
          <tbody>
            <tr>
              <td className="align-top text-left">
                <h1 className="text-lg font-bold font-serif-doc tracking-tight text-stone-950 uppercase m-0">{company.name}</h1>
                <p className="text-[9.5px] font-bold text-stone-700 uppercase tracking-wider m-0">INTERMEDIACIÓN COMERCIAL & COMPRA DE CAFÉ NACIONAL A TASA BCV &middot; RIF: {company.rif}</p>
                <p className="text-[9px] text-stone-600 m-0">{company.address}</p>
                <p className="text-[9px] text-stone-600 m-0">Contacto: {company.phone} | {company.email}</p>
              </td>
              <td className="align-top text-right w-48 border-l border-stone-400 pl-3">
                <p className="font-bold text-stone-900 text-[9px] uppercase font-sans m-0">LUGAR Y FECHA DE EMISIÓN</p>
                <p className="text-emerald-800 font-bold text-[10px] mt-0.5 m-0">Barcelona, 31 de Agosto de 2026</p>
                <p className="text-stone-600 text-[8.5px] mt-0.5 m-0">Tasa Oficial BCV: Bs. {currentRate.rateUsd.toFixed(2)} / USD</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Addressee & Subject Box */}
        <div className="mb-2">
          <p className="font-bold text-stone-900 m-0 text-[11px]">CIUDADANOS: BANESCO BANCO UNIVERSAL, C.A.</p>
          <p className="text-stone-700 text-[10px] m-0 mb-1">Gerencia de Auditoría Interna y Unidad de Prevención LC/FT Banesco Banco Universal</p>
          <div className="bg-slate-50 border border-slate-300 border-l-4 border-l-emerald-700 p-2 text-[10px] font-bold text-stone-950 text-justify rounded-sm">
            ASUNTO: Justificación de Fondos Movilizados en BBU ($2.912.368,95 USD / Bs. 1.966.597.105,35) vs Ingresos Declarados en EEFF (Bs. 92.641.520,01 / $116.531,68 USD) &mdash; Intermediación de Café Nacional a Tasa Oficial BCV
          </div>
        </div>

        {/* Concise Declarative Text */}
        <div className="space-y-2 text-justify text-stone-800">
          <p className="m-0 text-[10.5px]">
            En representación legal de <strong>{company.name}</strong> (RIF {company.rif}), damos formal respuesta a su requerimiento informando que <strong>no existe omisión de ingresos</strong>. Nuestra empresa opera exclusivamente como <strong>INTERMEDIARIA COMERCIAL ENTRE PERSONAS NATURALES Y JURÍDICAS EN VENEZUELA</strong>. No importamos café del exterior; todo el café se compra en Venezuela a tipo de cambio oficial BCV. La movilización bancaria de 6 meses se justifica con total solidez técnica y contable:
          </p>

          <table className="w-full border-collapse bg-stone-50 border border-stone-300 rounded text-[10px]">
            <tbody>
              <tr className="border-b border-stone-200">
                <td className="p-2">
                  <span className="font-bold text-amber-900">1. Anticipos en Bolívares de Clientes (78,4% &mdash; Bs. 1.542,02M / USD 2.270.486,23):</span>
                  <span className="text-stone-800"> Son anticipos de torrefactoras venezolanas a tasa BCV. Conforme a la <strong>NIIF 15</strong> y Art. 1152 del Código Civil, son <em>Pasivo Corriente Exigible en Café</em>. En <strong>OCTUBRE 2026</strong> se sustituyen por la factura fiscal de ventas definitiva.</span>
                </td>
              </tr>
              <tr className="border-b border-stone-200">
                <td className="p-2">
                  <span className="font-bold text-amber-900">2. Reintegros Mutuo Manuel Becerra (9,5% &mdash; Bs. 186,38M / USD 286.228,93):</span>
                  <span className="text-stone-800"> Amortizaciones de capital de la línea de crédito rotativa suscrita con el socio Manuel Becerra. Disminuyen la cuenta de activo exigible. No es venta.</span>
                </td>
              </tr>
              <tr className="border-b border-stone-200">
                <td className="p-2">
                  <span className="font-bold text-amber-900">3. Transferencias entre Cuentas Propias (10,6% &mdash; Bs. 208,71M):</span>
                  <span className="text-stone-800"> Movilizaciones internas desde Provincial, Mercantil, Plaza y Bancamiga mismo RIF J-50145638-0. Impacto patrimonial neto: Bs. 0,00.</span>
                </td>
              </tr>
              <tr className="border-b border-stone-200">
                <td className="p-2">
                  <span className="font-bold text-amber-900">4. Aportes Operativos Accionista / Personas Naturales (1,5% &mdash; Bs. 29,50M):</span>
                  <span className="text-stone-800"> Inyecciones de liquidez Presidente Sr. Elias Rafael Trías Abreu y anticipos de compradores personas naturales.</span>
                </td>
              </tr>
              <tr className="border-b border-stone-200">
                <td className="p-2">
                  <span className="font-bold text-emerald-900">5. Ingresos Reales Declarados en EEFF (Bs. 92.641.520,01 / USD 116.531,68):</span>
                  <span className="text-stone-800"> Servicios Agrícolas facturados ($78,72M) + Intereses del Mutuo Becerra ($13,92M), coincidiendo al céntimo con el Estado de Resultados.</span>
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  <span className="font-bold text-emerald-900">6. Uso de Divisas Banesco ($556.890,45 USD) y Sustento Legal Constitutivo (Acta 2021):</span>
                  <span className="text-stone-800"> Invertidos 100% en Venezuela en insumos, repuestos y fletes. Acta Constitutiva del 16/09/2021 (Tomo 44-A, N° 12) autoriza la intermediación de café y pertenece 100% al <strong>Sr. ELÍAS RAFAEL TRÍAS ABREU (C.I. V-23.997.829)</strong>.</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Resumen de Cuadre de Auditoría Banesco */}
          <div className="border-1.5 border-emerald-600 rounded p-2 bg-emerald-50 text-center shadow-sm">
            <p className="font-sans font-bold text-emerald-950 text-[10.5px] uppercase m-0">
              🎯 CUADRE DEFINITIVO DE AUDITORÍA BANESCO — DIFERENCIA FINAL POR OMISIÓN DE INGRESOS: BS. 0,00 ($0,00 USD)
            </p>
            <p className="text-[9.5px] text-emerald-850 font-sans mt-0.5 m-0">
              Conciliación Auditada al 100% &middot; Explicación del 100% del Monto Exigido de $2.912.368,95 USD (Bs. 1.966.597.105,35)
            </p>
          </div>

          <p className="text-[10px] m-0 text-stone-700">
            Constatamos la autenticidad de los soportes anexos (facturas, guías y conciliación) adjuntos a la presente comunicación.
          </p>
        </div>

        {/* Signature Block */}
        <div className="mt-6 pt-3 border-t border-stone-300 text-center">
          <div className="max-w-xs mx-auto">
            <p className="text-[9.5px] text-stone-600 mb-6">Atentamente,</p>
            <div className="border-t-2 border-stone-900 pt-1.5">
              <p className="font-bold text-stone-950 text-[11px] m-0">{company.legalRepresentative}</p>
              <p className="text-[9.5px] text-stone-600 m-0">C.I.: {company.idNumber} &middot; Presidente / Propietario</p>
              <p className="text-[9.5px] font-bold text-emerald-800 m-0">{company.name} &middot; RIF: {company.rif}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-1.5 border-t border-stone-200 text-[8.5px] text-stone-500 text-center font-mono">
          <span>DOCUMENTO OFICIAL DE RESPUESTA Y RESPALDO BANCARIO &middot; BANESCO BANCO UNIVERSAL, C.A.</span>
        </div>
      </div>
    </div>
  );
};

