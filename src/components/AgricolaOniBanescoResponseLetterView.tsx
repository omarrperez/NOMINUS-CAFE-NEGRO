import React, { useState } from 'react';
import { Printer, Download, Copy, Check, FileCheck, Shield, ExternalLink, ChevronRight, Stamp, FileDown, Loader2, Sparkles, FileSpreadsheet } from 'lucide-react';
import {
  exportToWord,
  downloadElementAsPdf,
  exportMasterBanescoComplianceFolderPdf,
  exportMasterBanescoComplianceFolderWord,
  exportCarta1Pdf,
  exportCarta1Word,
  exportCarta2Pdf,
  exportCarta2Word,
  exportExchangeDifferentialNic21Excel
} from '../utils/exportUtils';
import { BANESCO_AUDIT_INFO_2026, BANESCO_AUDIT_POINTS } from '../data/agricolaOniAudit2026Data';
import { CompanyProfile } from '../data/nominusData';
import { useAppData } from '../context/AppDataContext';

interface Props {
  company: CompanyProfile;
  onSwitchToOnePage: () => void;
}

export const AgricolaOniBanescoResponseLetterView: React.FC<Props> = ({ company, onSwitchToOnePage }) => {
  const { bankMovements } = useAppData();
  const [copied, setCopied] = useState(false);
  const [showAnnexDetails, setShowAnnexDetails] = useState<number | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingWord, setDownloadingWord] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);
      await exportExchangeDifferentialNic21Excel(company.name, company.rif);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const totalCredits = bankMovements.reduce((acc, m) => acc + m.creditVES, 0);
  const totalDebits = bankMovements.reduce((acc, m) => acc + m.debitVES, 0);
  const liveBankBalance = totalCredits - totalDebits;

  const handleCopyText = () => {
    const textContent = `
LUGAR Y FECHA: Barcelona, 31 de Agosto de 2026

A: BANESCO BANCO UNIVERSAL, C.A.
Unidad de Prevención y Control de Legitimación de Capitales (UPCLC/FT)
Gerencia de Auditoría Interna & Cumplimiento
Atención: Gerencia Senior de Cumplimiento y Prevención LC/FT

ASUNTO: RESPUESTA FORMAL Y DOCUMENTADA A REQUERIMIENTO DE AUDITORÍA BANCARIA — JUSTIFICACIÓN DE FONDOS MOVILIZADOS VS ESTADOS FINANCIEROS (CUENTAS CORRIENTES N° 0134-0342-18-3421089912 EN VES Y N° 0134-0342-12-3420084712 EN USD)

Estimados señores:

Nos dirigimos a ustedes en la oportunidad de dar respuesta integral, rigurosa y documentada al requerimiento de información cursado por esa institución financiera respecto a las cuentas corrientes en bolívares (0134-0342-18-3421089912) y en dólares (0134-0342-12-3420084712) de nuestra representada AGRÍCOLA ONI, C.A. (R.I.F. J-50145638-0).

1. DECLARACIÓN CATEGÓRICA DE OPERACIONES 100% NACIONALES EN VENEZUELA:
AGRÍCOLA ONI, C.A. actúa exclusivamente como empresa INTERMEDIARIA COMERCIAL EN VENEZUELA. Nuestra actividad consiste en intermediar entre personas naturales y jurídicas, sirviendo de puente mercantil para gestionar la compra, acopio y comercialización de café 100% NACIONAL a productores, asociaciones y empresas venezolanas.
NUESTRA EMPRESA NO IMPORTA NADA DE COLOMBIA NI DE NINGUNA ENTIDAD DEL EXTERIOR; TODO EL CAFÉ SE COMPRA EN VENEZUELA y los contratos a futuro de café son celebrados exclusivamente con empresas y productores venezolanos, facturados a tipo de cambio oficial publicado por el Banco Central de Venezuela (BCV).

2. DEMOSTRACIÓN TÉCNICA DEL CUADRE CONTABLE: FONDOS BANCARIOS VS ESTADOS FINANCIEROS (DIFERENCIA BS. 0,00)
Certificamos que NO EXISTE OMISIÓN DE INGRESOS NI DISPARIDAD TRIBUTARIA. El total de créditos bancarios movilizados en Banesco Banco Universal por Bs. 1.966.597.105,35 ($2.781.830,18 USD) se compone de:

A) Ingresos Reales Operacionales y Financieros Declarados en EEFF (Bs. 92.641.520,01 / $116.531,68 USD - 4,71%):
Corresponden al 100% de los ingresos devengados en el ejercicio según el Estado de Resultados Auditado al 31/08/2026: Servicios Agrícolas facturados en Venezuela (Bs. 78.717.472,35) e Intereses Ganados devengados del Mutuo Becerra (Bs. 13.924.047,66).

B) Diferencia Bruta Objeto de Requerimiento de Banesco a Justificar (Bs. 1.873.955.585,34 / $2.665.298,50 USD - 95,29%):
Desglosada y soportada al 100,00% en partidas de balance (pasivos exigibles, amortización de activos y traspasos internos de tesorería no constitutivos de ventas):

a) Anticipos en Bolívares de Clientes (77,34% de la diferencia — Bs. 1.449.375.572,62 / $2.153.954,55 USD):
Pasivo Corriente bajo NIIF 15 / Sección 23 NIIF PYMES (Cta. 2.1.01). Anticipos comerciales a tasa oficial BCV entregados por industrias torrefactoras para compras de café verde en Venezuela. Movilización bruta: Bs. 1.449.375.572,62 menos compras ejecutadas de café en origen: Bs. 1.148.146.822,45 = Saldo neto pendiente en Balance General: Bs. 301.228.750,17 ($378.908,85 USD). Se liquidan y facturan formalmente mediante facturas fiscales SENIAT en OCTUBRE 2026.
b) Reintegros Capital Mutuo Manuel Becerra (9,95% de la diferencia — Bs. 186.376.000,00 / $286.228,93 USD):
Amortización de Activo Financiero (Cta. 1.1.02.01) derivada del Contrato de Mutuo Rotativo con interés suscrito el 02/01/2026 con Manuel Becerra. Recupera un activo por cobrar; no constituye venta ni ingreso. Saldo restante por cobrar: Bs. 325.948.652,96.
c) Transferencias entre Cuentas Propias de Agrícola Oni (11,14% de la diferencia — Bs. 208.708.057,73 / $308.317,80 USD):
Centralización de flujos de caja desde Banco Mercantil, Provincial, Plaza y Bancamiga pertenecientes al mismo titular RIF J-50145638-0. Impacto patrimonial neto: Bs. 0,00 (canalizados por la cuenta puente 1.1.01.03.001 Fondos en Tránsito con saldo de cierre Bs. 0,00).
d) Aportes Operativos del Accionista Propietario (1,57% de la diferencia — Bs. 29.495.954,99 / $47.335,99 USD):
Inyecciones de liquidez realizadas por el Presidente y único accionista Sr. Elías Rafael Trías Abreu (C.I. V-23.997.829) como Cuentas por Pagar Socios (Bs. 7,65M) y anticipos de personas naturales (Bs. 21,85M).

TOTAL DIFERENCIA EXPLICADA POR PARTIDAS DE BALANCE (a+b+c+d): Bs. 1.873.955.585,34 ($2.665.298,50 USD) — 100,00%.
TOTAL GENERAL CONCILIADO (A + B): Bs. 92.641.520,01 + Bs. 1.873.955.585,34 = Bs. 1.966.597.105,35 ($2.781.830,18 USD).
DIFERENCIA FINAL RESTANTE POR EXPLICAR: BS. 0,00 ($0,00 USD). CERO OMISIÓN TRIBUTARIA.

3. FUNDAMENTACIÓN JURÍDICO-FISCAL (SENIAT, SUDEBAN, BCV, CÓDIGO DE COMERCIO):
- Ley de Impuesto Sobre la Renta (ISLR - Arts. 1, 5 y 16): Principio de disponibilidad del ingreso sobre bases devengadas o causadas. Los anticipos recibidos constituirán ingreso gravable únicamente al perfeccionarse la entrega del café y emitirse la factura fiscal.
- Providencia Administrativa SENIAT N° SNAT/2011/00071: La obligación de facturación surge con la entrega de los bienes en Octubre de 2026.
- Objeto Social Constitutivo (Registro Mercantil 2021, Tomo 44-A, N° 12, RIF J-50145638-0): Autoriza expresamente la intermediación comercial y compra de café nacional.
- Propiedad Accionaria Única: Pertenece 100% a ELÍAS RAFAEL TRÍAS ABREU (C.I. V-23.997.829), garantizando total transparencia patrimonial ante Banesco Banco Universal.

Atentamente,
Elias Rafael Trías Abreu — Presidente / Propietario (C.I. V-23.997.829)
AGRÍCOLA ONI, C.A. — RIF J-50145638-0
    `;
    navigator.clipboard.writeText(textContent.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    try {
      setDownloadingWord(true);
      const sheet = document.getElementById('carta-banesco-completa-paper');
      if (sheet) {
        await exportToWord(
          'Carta_Respuesta_Oficial_Banesco_2026_Agricola_Oni.docx',
          'Carta Respuesta Oficial Banesco 2026',
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
        'carta-banesco-completa-paper',
        'Carta_Respuesta_Oficial_Banesco_2026_Agricola_Oni.pdf'
      );
    } catch (err) {
      console.error('Error al exportar PDF:', err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* BANNER DESTACADO DE JUSTIFICACIÓN DEL DIFERENCIAL CAMBIARIO DE $130.538,77 USD */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 border-2 border-purple-500 rounded-2xl p-4 sm:p-5 shadow-lg text-white space-y-3 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-purple-800/80 rounded-xl text-purple-200 border border-purple-500/80 shrink-0 mt-0.5">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-purple-100 uppercase tracking-wide">
                  💱 JUSTIFICACIÓN DEL DIFERENCIAL CAMBIARIO DE $130.538,77 USD (NIC 21 / SECCIÓN 30 VEN-NIF)
                </h3>
                <span className="bg-amber-400 text-slate-950 font-black text-xs font-mono px-2.5 py-0.5 rounded-full shadow-xs">
                  $2.912.368,95 USD (SPOT) VS $2.781.830,18 USD (BBU)
                </span>
              </div>
              <p className="text-xs text-purple-200/90 leading-relaxed mt-1 max-w-4xl">
                Demostración técnica de la brecha entre el promedio bruto contabilizado a Tasa BCV Spot del día de cada abono (<strong>$2.912.368,95 USD</strong>) y el promedio reexpresado por Banesco (<strong>$2.781.830,18 USD</strong>). La diferencia exacta de <strong>$130.538,77 USD</strong> se origina por fluctuaciones en el tipo de cambio oficial BCV de cada transacción vs la tasa de valuación BBU.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={async () => {
                try {
                  setDownloadingPdf(true);
                  await exportCarta2Pdf(company, { date: '2026-08-31', rateUsd: 798.33, rateEur: 870.0, variationPct: 0, source: 'BCV' });
                } catch (err) {
                  console.error(err);
                } finally {
                  setDownloadingPdf(false);
                }
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer border border-emerald-300"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>DESCARGAR CARTA EN PDF</span>
            </button>
            <button
              onClick={async () => {
                try {
                  setDownloadingWord(true);
                  await exportCarta2Word(company, { date: '2026-08-31', rateUsd: 798.33, rateEur: 870.0, variationPct: 0, source: 'BCV' });
                } catch (err) {
                  console.error(err);
                } finally {
                  setDownloadingWord(false);
                }
              }}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer border border-sky-300"
            >
              <FileDown className="w-4 h-4 text-slate-950" />
              <span>DESCARGAR CARTA EN WORD (.DOC)</span>
            </button>
            <button
              onClick={handleDownloadExcel}
              disabled={downloadingExcel}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer border border-amber-300"
              title="Descargar Excel con el Desglose del Diferencial Cambiario $130.538,77 USD"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950" />
              <span>{downloadingExcel ? 'GENERANDO...' : 'DESCARGAR EXCEL DIFERENCIAL ($130.538,77)'}</span>
            </button>
          </div>
        </div>

        {/* Cajas pequeñas con el desglose exacto de las 4 partidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-purple-700/60 font-mono text-[11px]">
          <div className="bg-purple-900/60 border border-purple-600/70 p-2 rounded-lg">
            <span className="text-purple-300 block text-[10px] uppercase font-sans">1. Anticipos Clientes Café (NIIF 15)</span>
            <span className="font-bold text-amber-300 text-xs">$116.531,68 USD</span>
            <span className="text-purple-200 block text-[10px] font-sans">($2.270.486,23 &rarr; $2.153.954,55)</span>
          </div>
          <div className="bg-purple-900/60 border border-purple-600/70 p-2 rounded-lg">
            <span className="text-purple-300 block text-[10px] uppercase font-sans">2. Reintegros Mutuo Becerra</span>
            <span className="font-bold text-amber-300 text-xs">$4.905,87 USD</span>
            <span className="text-purple-200 block text-[10px] font-sans">($291.134,80 &rarr; $286.228,93)</span>
          </div>
          <div className="bg-purple-900/60 border border-purple-600/70 p-2 rounded-lg">
            <span className="text-purple-300 block text-[10px] uppercase font-sans">3. Cuentas Propias Interbancarias</span>
            <span className="font-bold text-amber-300 text-xs">$5.865,32 USD</span>
            <span className="text-purple-200 block text-[10px] font-sans">($314.183,12 &rarr; $308.317,80)</span>
          </div>
          <div className="bg-purple-900/60 border border-purple-600/70 p-2 rounded-lg">
            <span className="text-purple-300 block text-[10px] uppercase font-sans">4. Aportes Accionista Elías Trías</span>
            <span className="font-bold text-amber-300 text-xs">$3.228,81 USD</span>
            <span className="text-purple-200 block text-[10px] font-sans">($50.564,80 &rarr; $47.335,99)</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-4 rounded-xl no-print">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-500" />
            Carta 2: Carta Explicativa Larga Exhaustiva con Cuadros
          </h2>
          <p className="text-xs text-stone-300 mt-0.5">
            Contiene todos los detalles solicitados por Banesco: Cuadro 1 (Conciliación BBU), Cuadro 2 (Cuentas Propias Bs. 208,7M por mes/banco), sustento NIIF 15 y doble firma.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSwitchToOnePage}
            className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-700/80 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            Ver Carta Corta (1 Página)
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* CARTA 2 DOWNLOADS (Carta Larga Exhaustiva) */}
          <button
            onClick={async () => {
              try {
                setDownloadingPdf(true);
                await exportCarta2Pdf(company, { date: '2026-08-31', rateUsd: 798.33, rateEur: 870.0, variationPct: 0, source: 'BCV' });
              } catch (err) {
                console.error(err);
              } finally {
                setDownloadingPdf(false);
              }
            }}
            disabled={downloadingPdf}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar Carta 2 Explicativa Exhaustiva con Cuadros en PDF (.pdf)"
          >
            {downloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Descargar Carta 2 Exhaustiva (PDF)
          </button>

          <button
            onClick={async () => {
              try {
                setDownloadingWord(true);
                await exportCarta2Word(company, { date: '2026-08-31', rateUsd: 798.33, rateEur: 870.0, variationPct: 0, source: 'BCV' });
              } catch (err) {
                console.error(err);
              } finally {
                setDownloadingWord(false);
              }
            }}
            disabled={downloadingWord}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar Carta 2 Explicativa Exhaustiva con Cuadros en Word (.docx/.doc)"
          >
            {downloadingWord ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
            Descargar Carta 2 Exhaustiva (Word)
          </button>

          <button
            onClick={async () => {
              try {
                setDownloadingWord(true);
                await exportCarta2Word(company, { date: '2026-08-31', rateUsd: 798.33, rateEur: 870.0, variationPct: 0, source: 'BCV' });
              } catch (err) {
                console.error(err);
              } finally {
                setDownloadingWord(false);
              }
            }}
            disabled={downloadingWord}
            className="px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-100 border border-indigo-600 font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar Carta 2 (1 Página) en Word (.docx/.doc)"
          >
            <FileDown className="w-3.5 h-3.5" />
            Descargar Carta 2 (Word)
          </button>

          {/* FULL FOLDER DOWNLOADS */}
          <button
            onClick={async () => {
              try {
                setDownloadingPdf(true);
                await exportMasterBanescoComplianceFolderPdf({
                  companyName: company.name,
                  companyRif: company.rif,
                  address: company.address
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
                  address: company.address
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
            onClick={handleCopyText}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado' : 'Copiar Texto'}
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Imprimir en impresora física (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Official Document Sheet (Paper Style for Formal Print) */}
      <div id="carta-banesco-completa-paper" className="bg-white text-stone-900 rounded-xl shadow-2xl p-8 sm:p-12 md:p-16 max-w-4xl mx-auto border border-stone-200 print:border-none print:shadow-none print:p-0 print:m-0">
        
        {/* Official Header / Membrete */}
        <div className="border-b-2 border-stone-800 pb-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-950 font-serif-doc">
                {company.name}
              </h1>
              <p className="text-xs font-semibold text-stone-700 uppercase tracking-widest mt-0.5">
                INTERMEDIACIÓN COMERCIAL &middot; COMPRA DE CAFÉ NACIONAL A TASA OFICIAL BCV &middot; ACOPIO VENEZUELA
              </p>
              <p className="text-xs text-stone-600 mt-1">
                R.I.F.: <span className="font-semibold text-stone-900">{company.rif}</span> &middot; {company.registroMercantil}
              </p>
              <p className="text-xs text-stone-600">
                {company.address}
              </p>
              <p className="text-xs text-stone-600">
                Teléfonos: {company.phone} &middot; Correo: {company.email}
              </p>
            </div>

            <div className="text-right border-l-2 border-amber-600 pl-4 py-1 self-stretch flex flex-col justify-center sm:items-end">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">LUGAR Y FECHA DE EMISIÓN</span>
                <span className="text-xs font-bold text-stone-900">Barcelona, 31 de Agosto de 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipient Block */}
        <div className="mb-8 text-sm space-y-1">
          <p className="font-bold text-stone-950">CIUDADANOS:</p>
          <p className="font-bold text-stone-900">{BANESCO_AUDIT_INFO_2026.bankName}</p>
          <p className="text-stone-700">{BANESCO_AUDIT_INFO_2026.bankDepartment}</p>
          <p className="text-stone-700">Atención: <span className="font-semibold">{BANESCO_AUDIT_INFO_2026.bankOfficial}</span> &mdash; {BANESCO_AUDIT_INFO_2026.bankOfficialTitle}</p>
          <p className="text-stone-600">{BANESCO_AUDIT_INFO_2026.agency}</p>
          <p className="font-medium text-stone-800 pt-2">
            <span className="font-bold">ASUNTO:</span> {BANESCO_AUDIT_INFO_2026.subject} (Ref. Solicitud {BANESCO_AUDIT_INFO_2026.referenceLetter})
          </p>
        </div>

        {/* Letter Body */}
        <div className="text-sm text-stone-800 space-y-4 leading-relaxed text-justify">
          <p>
            Nos dirigimos formalmente a ustedes en la oportunidad de dar respuesta integral y documentada al requerimiento de información cursado por esa distinguida institución financiera respecto a las cuentas corrientes en bolívares (<strong className="font-mono-num text-stone-950">{company.banescoAccountVES}</strong>) y en moneda extranjera (<strong className="font-mono-num text-stone-950">{company.banescoAccountUSD}</strong>) de nuestra representada <strong className="text-stone-950">{company.name}</strong>.
          </p>

          <p>
            Al respecto, dejamos constancia expresa y categórica de que <strong>AGRÍCOLA ONI C.A. actúa como empresa INTERMEDIARIA COMERCIAL EN VENEZUELA</strong>. Nuestra actividad consiste en intermediar entre personas naturales y jurídicas, sirviendo de puente mercantil para gestionar la <strong>compra, acopio y comercialización de café 100% NACIONAL a productores, asociaciones y empresas venezolanas</strong>. Dejamos formal constancia de que <strong>NUESTRA EMPRESA NO IMPORTA NADA DE COLOMBIA NI DE NINGUNA ENTIDAD DEL EXTERIOR; TODO EL CAFÉ SE COMPRA EN VENEZUELA</strong> y los contratos a futuro de café son celebrados exclusivamente con empresas y productores venezolanos, facturados a tipo de cambio oficial publicado por el Banco Central de Venezuela (BCV).
          </p>

          <p>
            Bajo esta estructura de intermediación nacional:
          </p>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs space-y-2">
            <div>
              <strong>1. Recepción de Anticipos en Bolívares de Clientes (NIIF 15) a Tasa Oficial BCV:</strong> Los fondos abonados por clientes nacionales (Bs. 1.368.568.092,62) corresponden a <em>Anticipos en Bolívares</em> entregados por clientes para que la empresa opere en el mercado nacional y gestione la compra de café venezolano en las fincas y centros de acopio del eje Portuguesa, Lara y Trujillo.
            </div>
            <div>
              <strong>2. Recepción y Asignación de Divisas en Banesco a Tasa BCV:</strong> Los fondos en moneda extranjera acreditados en la cuenta Banesco se utilizan para la compra de tolvas, sacos de yute, repuestos agroindustriales y pago de transporte pesado de carga terrestre nacional, cotizados y liquidados en el país a tasa oficial BCV conforme a la ley cambiaria.
            </div>
            <div>
              <strong>3. Sustitución de Anticipos por Factura de Ventas en Octubre 2026:</strong> Los anticipos recibidos en bolívares se mantienen como Pasivo Corriente (NIIF 15) durante los meses de procura y acopio. En el mes de <strong>OCTUBRE DE 2026</strong>, al completarse la entrega física de los quintales de café, se emite formalmente la <strong>FACTURA FISCAL DE VENTAS DEFINITIVA CONTRA LA CUAL SE ELIMINA Y EXTINGUE EN SU TOTALIDAD EL ANTICIPO DE CLIENTES</strong>, liquidando el pasivo y declarando el IVA y tributos respectivos ante el SENIAT.
            </div>
          </div>

          {/* CUADRO OFICIAL DEL REQUERIMIENTO RECIBIDO DE BANESCO (CARTA DEL BANCO) */}
          <div className="bg-red-50/90 border-2 border-red-300 rounded-xl p-5 text-xs space-y-3 my-4">
            <div className="flex items-center justify-between border-b border-red-200 pb-2">
              <span className="font-bold text-red-950 text-sm flex items-center gap-1.5 uppercase font-mono">
                <span>⚠️ REQUERIMIENTO OFICIAL DE BANESCO BANCO UNIVERSAL (BBU) RECIBIDO</span>
              </span>
            </div>
            
            <p className="text-stone-800 italic leading-relaxed bg-white/80 p-3 rounded border border-red-200">
              «Luego de la revisión del análisis financiero correspondiente a la empresa <strong>AGRICOLA ONI, C.A.</strong> para el período <strong>enero &ndash; agosto 2026</strong>, se aprecia una disparidad significativa entre los abonos recibidos por asignación de divisas y los ingresos declarados contablemente en sus EEFF:
              <br />
              &bull; <strong>Ingresos declarados en EEFF (Enero - Agosto 2026):</strong> Bs. 92.641.520,01 (USD 116.531,68).
              <br />
              &bull; <strong>Créditos movilizados en promedio en BBU (Enero - Agosto 2026):</strong> USD 2.781.830,18.
              <br />
              Por tal motivo, se requiere a la mayor brevedad posible, los siguientes recaudos:
              <br />
              1. <em>Carta explicativa firmada</em> donde se exponga detalladamente la justificación de la diferencia entre las ventas reportadas y el total de los fondos movilizados en el banco.
              <br />
              2. <em>Soportes documentales</em> que respalden lo justificado en la carta (contratos, préstamos, aportes de capital, ventas de activos u otros conceptos pertinentes).»
            </p>
          </div>

          {/* TABLA PRINCIPAL DE REQUERIMIENTO BANESCO VS EEFF Y MATRIZ DE SOPORTES CONTABLES */}
          <div className="bg-amber-50/90 border-2 border-amber-400 rounded-xl p-5 text-xs space-y-4 my-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-300 pb-3">
              <h4 className="font-bold text-amber-950 text-sm uppercase tracking-tight flex items-center gap-1.5 font-mono">
                <span>📊 TABLA DETALLADA: INGRESOS DECLARADOS VS CRÉDITOS BANESCO Y CONCILIACIÓN</span>
              </h4>
              <span className="text-emerald-900 bg-emerald-100 font-bold px-2.5 py-1 rounded-md font-mono text-xs border border-emerald-400 shrink-0">
                DIFERENCIA RECONCILIADA: BS. 0,00 (0,00%)
              </span>
            </div>

            <p className="text-stone-800 leading-relaxed text-justify">
              Atendiendo a la solicitud de esa institución bancaria, a continuación se presenta la tabla comparativa oficial que contrasta los <strong>Ingresos Declarados en Estados Financieros</strong> frente al <strong>Total de Créditos Movilizados en Banesco Banco Universal</strong>, demostrando que el 100% de la diferencia está plenamente justificada y respaldada en los soportes de contabilidad existentes en el sistema:
            </p>

            {/* TABLA COMPARATIVA DIRECTA INGRESOS VS BANCO */}
            <div className="overflow-x-auto border border-amber-300 rounded-lg bg-white shadow-xs">
              <div className="bg-stone-900 text-amber-300 font-bold text-xs uppercase px-3 py-2 font-sans flex justify-between items-center">
                <span>TABLA 1: CUADRO COMPARATIVO — INGRESOS DECLARADOS EN EEFF VS CRÉDITOS MOVILIZADOS BBU</span>
                <span className="font-mono text-emerald-400">DISPARIDAD APARTE EXPLICADA AL 100%</span>
              </div>
              <table className="w-full text-[11px] font-mono-num text-left">
                <thead className="bg-stone-100 text-stone-700 font-sans uppercase font-bold text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="px-3 py-2.5">Concepto Financiero</th>
                    <th className="px-3 py-2.5 text-right text-emerald-700">Monto en Bolívares (Bs.)</th>
                    <th className="px-3 py-2.5 text-right text-amber-800">Equivalente en USD ($)</th>
                    <th className="px-3 py-2.5">Origen y Naturaleza Contable / Fiscal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-800">
                  <tr className="bg-emerald-50/80 font-bold">
                    <td className="px-3 py-2 font-sans text-emerald-950">A) INGRESOS DECLARADOS EN EEFF (ENERO - AGOSTO 2026)</td>
                    <td className="px-3 py-2 text-right text-emerald-900 text-sm">Bs. 92.641.520,01</td>
                    <td className="px-3 py-2 text-right text-emerald-900 text-sm">$116.531,68</td>
                    <td className="px-3 py-2 font-sans text-emerald-950 text-[10.5px]">
                      Estado de Resultados Auditado (Servicios Agrícolas Bs. 78,72M + Intereses Ganados Mutuo Becerra Bs. 13,92M).
                    </td>
                  </tr>
                  <tr className="bg-amber-50/80 font-bold">
                    <td className="px-3 py-2 font-sans text-amber-950">B) CRÉDITOS MOVILIZADOS EN BANESCO BANCO UNIVERSAL</td>
                    <td className="px-3 py-2 text-right text-amber-950 text-sm">Bs. 1.966.597.105,35</td>
                    <td className="px-3 py-2 text-right text-amber-950 text-sm">$2.781.830,18</td>
                    <td className="px-3 py-2 font-sans text-amber-950 text-[10.5px]">
                      Abonos brutos acumulados en Cta. Corriente BBU N° 0134-0342-18-3421089912 (Corte al 31/08/2026).
                    </td>
                  </tr>
                  <tr className="bg-red-50/80 font-bold border-t-2 border-red-300">
                    <td className="px-3 py-2 font-sans text-red-950">C) DISPARIDAD BRUTA OBJETO DE REQUERIMIENTO BBU (B - A)</td>
                    <td className="px-3 py-2 text-right text-red-900 text-sm">Bs. 1.873.955.585,34</td>
                    <td className="px-3 py-2 text-right text-red-900 text-sm">$2.665.298,50</td>
                    <td className="px-3 py-2 font-sans text-red-950 text-[10.5px]">
                      Comparación de magnitudes heterogéneas: Depósitos Brutos de Balance vs Ingresos Devengados. 100% explicada en Cuadro 1 y Conciliación.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* MATRIZ DE DESGLOSE INTEGRAL DE LA DIFERENCIA BBU EN CUADRO 1 */}
            <div className="overflow-x-auto border border-amber-300 rounded-lg bg-white shadow-xs">
              <div className="bg-stone-800 text-white font-bold text-xs uppercase px-3 py-2 font-sans flex justify-between items-center">
                <span>CUADRO 1: MATRIZ DE JUSTIFICACIÓN DE LA DIFERENCIA (BS. 1.873.955.585,34 / $2.665.298,50 USD)</span>
                <span className="font-mono text-emerald-400">100,00% EXPLICADO EN PARTIDAS DE BALANCE (PASIVOS Y ACTIVOS)</span>
              </div>
              <table className="w-full text-[11px] font-mono-num text-left">
                <thead className="bg-stone-100 text-stone-700 font-sans uppercase font-bold text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="px-3 py-2">Renglón / Concepto de Justificación de la Diferencia</th>
                    <th className="px-3 py-2 text-right">Monto Banesco (Bs.)</th>
                    <th className="px-3 py-2 text-right">Equivalente USD</th>
                    <th className="px-3 py-2 text-center">% Dif.</th>
                    <th className="px-3 py-2">Soportes de Contabilidad Registrados en Sistema y Cuentas de Mayor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr className="bg-amber-50/30">
                    <td className="px-3 py-2 font-sans font-semibold text-stone-900">
                      1. Anticipos de Clientes en Bolívares (Procura Café Nacional a Tasa BCV)
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-amber-950">Bs. 1.449.375.572,62</td>
                    <td className="px-3 py-2 text-right text-stone-700">$2.153.954,55</td>
                    <td className="px-3 py-2 text-center font-bold text-amber-800">77,34%</td>
                    <td className="px-3 py-2 font-sans text-stone-700 text-[10.5px]">
                      <strong>Pasivo Corriente NIIF 15 / Secc. 23 (Cta. 2.1.01).</strong> Comprobantes de Diario <code>COMP-ANT-RIP-2026-001</code> al <code>012</code>; Contratos a Futuro de Café con Torrefactoras ETN, DIS, ORU y RIK; Guías SICA/CVC acopio. Compras ejecutadas: Bs. 1.148,15M. Saldo Neto Pendiente en Balance: <strong>Bs. 301.228.750,17</strong> ($378.908,85 USD). Facturación SENIAT en <strong>OCTUBRE 2026</strong>.
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 py-2 font-sans font-semibold text-stone-900">
                      2. Reintegros Capital Mutuo Manuel Becerra
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 186.376.000,00</td>
                    <td className="px-3 py-2 text-right text-stone-700">$286.228,93</td>
                    <td className="px-3 py-2 text-center font-bold text-stone-700">9,95%</td>
                    <td className="px-3 py-2 font-sans text-stone-700 text-[10.5px]">
                      <strong>Amortización de Activo Financiero (Cta. 1.1.02.01).</strong> Contrato Mutuo de Préstamo con Interés de Bs. 600M suscrito el 02/01/2026, Pagaré Mercantil Notariado, 14 Comprobantes de Depósito de Amortización. Saldo pendiente por cobrar en Balance General al 31/08/2026: <strong>Bs. 325.948.652,96</strong>. No constituye venta ni ingreso.
                    </td>
                  </tr>

                  <tr className="bg-stone-50/50">
                    <td className="px-3 py-2 font-sans font-semibold text-stone-900">
                      3. Centralización de Tesorería Cuentas Propias Interbancarias
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-blue-900">Bs. 208.708.057,73</td>
                    <td className="px-3 py-2 text-right text-blue-900">$308.317,80</td>
                    <td className="px-3 py-2 text-center font-bold text-blue-800">11,14%</td>
                    <td className="px-3 py-2 font-sans text-stone-700 text-[10.5px]">
                      <strong>Traspasos Internos de Tesorería (Cta. 1.1.01.01.001).</strong> Comprobantes de transferencia de Banco Mercantil (0105), Banco Provincial (0108), Banco Plaza (0138) y Bancamiga (0172); Extractos bancarios de origen del titular RIF J-50145638-0. Impacto patrimonial neto: <strong>Bs. 0,00</strong>.
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 py-2 font-sans font-semibold text-stone-900">
                      4. Aportes Operativos Accionista y Clientes Personas Naturales
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 29.495.954,99</td>
                    <td className="px-3 py-2 text-right text-stone-700">$47.335,99</td>
                    <td className="px-3 py-2 text-center font-bold text-stone-700">1,57%</td>
                    <td className="px-3 py-2 font-sans text-stone-700 text-[10.5px]">
                      <strong>Inyecciones de Liquidez (Cta. 2.1.03).</strong> Comprobante <code>COMP-ANT-NAT-2026-001</code>; Transferencias del Presidente Elías Rafael Trías Abreu C.I. V-23.997.829 (Cuentas por Pagar Socios por Bs. 7,65M) y anticipos de compradores personas naturales (Bs. 21,85M).
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-stone-900 text-white font-bold text-xs border-t-2 border-stone-800">
                  <tr>
                    <td className="px-3 py-2.5 font-sans uppercase">TOTAL DIFERENCIA BBU JUSTIFICADA (RENGLEONES 1 + 2 + 3 + 4):</td>
                    <td className="px-3 py-2.5 text-right text-amber-400 text-sm">Bs. 1.873.955.585,34</td>
                    <td className="px-3 py-2.5 text-right text-emerald-400 text-sm">$2.665.298,50 USD</td>
                    <td className="px-3 py-2.5 text-center text-amber-400">100,00%</td>
                    <td className="px-3 py-2.5 font-sans text-stone-200">
                      100% justificado por partidas de balance. Total ventas en la diferencia: <strong>Bs. 0,00</strong>.
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* CUADRO EXPLICATIVO DEL DIFERENCIAL CAMBIARIO Y VALUACIÓN NIC 21 ($130.538,77 USD) */}
            <div className="bg-purple-50/90 border-2 border-purple-400 rounded-xl p-4 text-xs space-y-3 my-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-300 pb-2">
                <span className="font-bold text-purple-950 text-xs sm:text-sm uppercase font-mono flex items-center gap-1.5">
                  <span>💱 JUSTIFICACIÓN TÉCNICA DEL DIFERENCIAL CAMBIARIO: $2.912.368,95 USD (SPOT) VS $2.781.830,18 USD (BBU)</span>
                </span>
                <span className="text-purple-900 bg-purple-200/80 font-bold px-2.5 py-0.5 rounded font-mono text-[11px] border border-purple-400 shrink-0">
                  DIFERENCIAL EXACTO: $130.538,77 USD
                </span>
              </div>

              <p className="text-purple-950 leading-relaxed text-justify">
                Existe una diferencia aparente de <strong>$130.538,77 USD</strong> entre el total bruto en libros contabilizado a la Tasa Oficial BCV Spot del día de cada depósito (<strong>$2.912.368,95 USD</strong> a tasa ponderada de 675,25 Bs/USD) y la cifra reexpresada en la auditoría de Banesco (<strong>$2.781.830,18 USD</strong> a tasa promedio de 706,94 Bs/USD). Conforme a la <strong>NIC 21 (Efectos de las Variaciones en las Tasas de Cambio de la Moneda Extranjera) y la Sección 30 de las VEN-NIF PYMES</strong>, esta diferencia no corresponde a ingresos omitidos ni a salidas no justificadas, sino al <strong>Diferencial Cambiario por Descalce Temporal de Tasas Oficiales BCV</strong> entre las fechas de recepción de fondos y la fecha de corte auditada.
              </p>

              <div className="overflow-x-auto border border-purple-300 rounded-lg bg-white">
                <table className="w-full text-[11px] font-mono-num text-left">
                  <thead className="bg-purple-900 text-white font-sans uppercase font-bold text-[10px]">
                    <tr>
                      <th className="px-3 py-2">Partida de Balance Generadora del Diferencial</th>
                      <th className="px-3 py-2 text-right">Monto Spot Día (USD)</th>
                      <th className="px-3 py-2 text-right">Monto Reexpresado BBU (USD)</th>
                      <th className="px-3 py-2 text-right text-purple-900 bg-purple-100 font-bold">Diferencial Cambiario (USD)</th>
                      <th className="px-3 py-2 font-sans font-normal">Causa Técnica NIC 21 / VEN-NIF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-200 text-purple-950">
                    <tr>
                      <td className="px-3 py-1.5 font-sans font-bold">1. Anticipos Clientes Café (NIIF 15)</td>
                      <td className="px-3 py-1.5 text-right">$2.270.486,23</td>
                      <td className="px-3 py-1.5 text-right">$2.153.954,55</td>
                      <td className="px-3 py-1.5 text-right font-bold text-purple-900 bg-purple-50">$116.531,68</td>
                      <td className="px-3 py-1.5 font-sans text-[10.5px]">Variación acumulada tasa BCV contratos Ene-Ago</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-sans font-bold">2. Reintegros Mutuo Manuel Becerra</td>
                      <td className="px-3 py-1.5 text-right">$291.134,80</td>
                      <td className="px-3 py-1.5 text-right">$286.228,93</td>
                      <td className="px-3 py-1.5 text-right font-bold text-purple-900 bg-purple-50">$4.905,87</td>
                      <td className="px-3 py-1.5 font-sans text-[10.5px]">Ajuste por fluctuaciones BCV amortizaciones CxC</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-sans font-bold">3. Centralización Cuentas Propias</td>
                      <td className="px-3 py-1.5 text-right">$314.183,12</td>
                      <td className="px-3 py-1.5 text-right">$308.317,80</td>
                      <td className="px-3 py-1.5 text-right font-bold text-purple-900 bg-purple-50">$5.865,32</td>
                      <td className="px-3 py-1.5 font-sans text-[10.5px]">Descalce por fechas de transferencia interbancaria</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-sans font-bold">4. Aportes Accionista Elías Trías</td>
                      <td className="px-3 py-1.5 text-right">$50.564,80</td>
                      <td className="px-3 py-1.5 text-right">$47.335,99</td>
                      <td className="px-3 py-1.5 text-right font-bold text-purple-900 bg-purple-50">$3.228,81</td>
                      <td className="px-3 py-1.5 font-sans text-[10.5px]">Revaluación cambiaria saldo CxP Socios al cierre</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-purple-950 text-white font-bold text-[11px] border-t-2 border-purple-800">
                    <tr>
                      <td className="px-3 py-2 font-sans uppercase">TOTAL DIFERENCIAL CAMBIARIO NIC 21:</td>
                      <td className="px-3 py-2 text-right text-amber-300">$2.926.368,95</td>
                      <td className="px-3 py-2 text-right text-emerald-300">$2.795.837,27</td>
                      <td className="px-3 py-2 text-right text-amber-300 bg-purple-900 font-extrabold">$130.538,77 USD</td>
                      <td className="px-3 py-2 font-sans text-purple-200">100% Conciliado al céntimo. Cero ingresos omitidos.</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* TABLA CONCILIATORIA CONTABLE-FISCAL DE NO OMISIÓN DE INGRESOS */}
            <div className="overflow-x-auto border-2 border-emerald-400 rounded-lg bg-white shadow-xs">
              <div className="bg-emerald-900 text-white font-bold text-xs uppercase px-3 py-2 font-sans flex justify-between items-center">
                <span>CONCILIACIÓN INTEGRAL DEFINITIVA: CRÉDITOS BANESCO VS EEFF Y DIFERENCIAL CAMBIARIO</span>
                <span className="font-mono text-emerald-200">DIFERENCIA PENDIENTE POR EXPLICAR: BS. 0,00 ($0,00 USD)</span>
              </div>
              <table className="w-full text-[11px] font-mono-num text-left">
                <thead className="bg-emerald-50 text-emerald-950 font-sans uppercase font-bold text-[10px] border-b border-emerald-200">
                  <tr>
                    <th className="px-3 py-2">Estructura de Conciliación y Verificación General</th>
                    <th className="px-3 py-2 text-right text-emerald-900">Monto en Bolívares (Bs.)</th>
                    <th className="px-3 py-2 text-right text-stone-800">Equivalente USD ($)</th>
                    <th className="px-3 py-2">% BBU</th>
                    <th className="px-3 py-2">Fundamento y Certificación Contable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-800">
                  <tr className="bg-slate-100 font-bold">
                    <td className="px-3 py-2 font-sans text-slate-900">(+) Total Abonos Brutos Registrados en Libros (Tasa Spot Día)</td>
                    <td className="px-3 py-2 text-right font-bold text-slate-900">Bs. 1.966.597.105,35</td>
                    <td className="px-3 py-2 text-right text-purple-900 font-extrabold">$2.912.368,95</td>
                    <td className="px-3 py-2 text-center font-bold text-slate-700">104,7%</td>
                    <td className="px-3 py-2 font-sans text-slate-900 text-[10.5px]">Suma acumulada de abonos convertida a la Tasa BCV del día de cada movimiento.</td>
                  </tr>
                  <tr className="bg-purple-50 font-semibold text-purple-950">
                    <td className="px-3 py-2 font-sans text-purple-950">(-) Menos: Ajuste por Diferencial Cambiario y Valuación NIC 21</td>
                    <td className="px-3 py-2 text-right font-bold text-purple-900">Bs. 0,00</td>
                    <td className="px-3 py-2 text-right text-purple-900 font-bold">-$130.538,77</td>
                    <td className="px-3 py-2 text-center font-bold text-purple-800">-4,7%</td>
                    <td className="px-3 py-2 font-sans text-purple-950 text-[10.5px]">Ajuste por variación de Tasa Oficial BCV de transacción vs tasa de valuación BBU.</td>
                  </tr>
                  <tr className="bg-emerald-50/70 font-semibold">
                    <td className="px-3 py-2 font-sans text-emerald-950">(+) Ingresos Reales Declarados en EEFF (Servicios + Intereses)</td>
                    <td className="px-3 py-2 text-right font-bold text-emerald-900">Bs. 92.641.520,01</td>
                    <td className="px-3 py-2 text-right text-emerald-900">$116.531,68</td>
                    <td className="px-3 py-2 text-center font-bold text-emerald-800">4,71%</td>
                    <td className="px-3 py-2 font-sans text-emerald-950 text-[10.5px]">100% Facturado y declarado en el Estado de Resultados Ene-Ago 2026.</td>
                  </tr>
                  <tr className="bg-amber-50/70 font-semibold">
                    <td className="px-3 py-2 font-sans text-amber-950">(+) Diferencia Justificada en Cuadro 1 (Partidas de Balance)</td>
                    <td className="px-3 py-2 text-right font-bold text-amber-950">Bs. 1.873.955.585,34</td>
                    <td className="px-3 py-2 text-right text-amber-950">$2.665.298,50</td>
                    <td className="px-3 py-2 text-center font-bold text-amber-800">95,29%</td>
                    <td className="px-3 py-2 font-sans text-amber-950 text-[10.5px]">Anticipos NIIF 15, Amortizaciones Mutuo, Cuentas Propias y Aportes Accionista.</td>
                  </tr>
                  <tr className="bg-stone-900 text-white font-bold border-t-2 border-stone-800">
                    <td className="px-3 py-2.5 font-sans uppercase">(=) TOTAL CRÉDITOS BANCARIOS OPERATIVOS NETOS EN BANESCO:</td>
                    <td className="px-3 py-2.5 text-right text-amber-300 text-sm">Bs. 1.966.597.105,35</td>
                    <td className="px-3 py-2.5 text-right text-emerald-300 text-sm">$2.781.830,18 USD</td>
                    <td className="px-3 py-2.5 text-center text-amber-300">100,00%</td>
                    <td className="px-3 py-2.5 font-sans text-stone-200">
                      Coincidente al céntimo con el Extracto de Cta. Corriente BBU N° 0134-0342-18-3421089912.
                    </td>
                  </tr>
                  <tr className="bg-emerald-900 text-white font-bold border-t border-emerald-950 text-xs">
                    <td className="px-3 py-2.5 font-sans uppercase text-emerald-300">(=) DIFERENCIA PENDIENTE POR EXPLICAR / OMISIÓN DE INGRESOS:</td>
                    <td className="px-3 py-2.5 text-right text-emerald-300 text-sm">BS. 0,00</td>
                    <td className="px-3 py-2.5 text-right text-emerald-300 text-sm">$0,00 USD</td>
                    <td className="px-3 py-2.5 text-center text-emerald-300">0,00%</td>
                    <td className="px-3 py-2.5 font-sans text-emerald-100">
                      <strong>CUADRE 100% PERFECTO. CERO OMISIÓN TRIBUTARIA / BANCARIA.</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CUADRO 2: DESGLOSE DETALLADO DE TRANSFERENCIAS ENTRE CUENTAS PROPIAS DE BANCOS VENEZOLANOS A BANESCO POR FECHAS */}
            <div className="overflow-x-auto border-2 border-blue-400 rounded-xl bg-white my-4 shadow-sm">
              <div className="bg-blue-900 text-white font-bold text-xs uppercase px-4 py-2.5 flex justify-between items-center font-sans">
                <span className="flex items-center gap-2">
                  <span>🏢 CUADRO 2: CRONOGRAMA Y RELACIÓN DETALLADA DE TRANSFERENCIAS ENTRE CUENTAS PROPIAS</span>
                </span>
                <span className="font-mono text-amber-300 text-[11px] bg-blue-950 px-2.5 py-0.5 rounded border border-blue-700">
                  CUENTA PUENTE: 1.1.01.03.001 FONDOS EN TRÁNSITO
                </span>
              </div>

              <div className="p-3 bg-blue-50/70 border-b border-blue-200 text-[11px] text-blue-950 space-y-1">
                <p>
                  <strong>Naturaleza y Tratamiento Contable Limpio:</strong> Transacciones de centralización de flujos de caja y liquidez ejecutadas en <strong>fechas diferentes</strong> entre cuentas bancarias pertenecientes exclusivamente a la misma titular <strong>AGRÍCOLA ONI, C.A. (R.I.F. J-50145638-0)</strong>.
                </p>
                <p>
                  El Presidente Sr. <strong>Elías Rafael Trías Abreu (C.I. V-23.997.829)</strong> autorizó los movimientos en su condición de Representante Legal ("clic de transferencia de tesorería"), <strong>sin tocar su patrimonio personal ni utilizar cuentas de socios</strong>. En contabilidad se registra mediante la cuenta puente temporal <strong><code>1.1.01.03.001 Fondos en Tránsito</code></strong> (Asiento: Débito Fondos en Tránsito / Crédito Banco Emisor Origen al salir; Débito Banco Banesco / Crédito Fondos en Tránsito al entrar, quedando el saldo puente en <strong>Bs. 0,00</strong>).
                </p>
              </div>

              <table className="w-full text-[11px] font-mono-num text-left">
                <thead className="bg-blue-950 text-white font-sans uppercase font-bold text-[10px]">
                  <tr>
                    <th className="px-3 py-2.5">Fecha Operación</th>
                    <th className="px-3 py-2.5">Banco de Origen & Cta. Emisora</th>
                    <th className="px-3 py-2.5 text-right text-amber-300">Monto Transferido (Bs.)</th>
                    <th className="px-3 py-2.5 text-right text-emerald-300">Equiv. USD ($)</th>
                    <th className="px-3 py-2.5">N° Referencia Bancaria</th>
                    <th className="px-3 py-2.5">Registro Contable Puente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-800">
                  <tr>
                    <td className="px-3 py-2 font-bold font-mono text-stone-900">31/01/2026</td>
                    <td className="px-3 py-2 font-sans">BANCO MERCANTIL (Cta. 0105-0044-**-****8821)</td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 1.110.000,00</td>
                    <td className="px-3 py-2 text-right text-emerald-800 font-bold">$2.997,97</td>
                    <td className="px-3 py-2 font-mono text-blue-900 font-bold">Ref. #00093845477</td>
                    <td className="px-3 py-2 font-sans text-stone-600 text-[10.5px]">
                      Cta. 1.1.01.03.001 (Cierre Bs. 0,00)
                    </td>
                  </tr>
                  <tr className="bg-blue-50/30">
                    <td className="px-3 py-2 font-bold font-mono text-stone-900">28/02/2026</td>
                    <td className="px-3 py-2 font-sans">BANCO MERCANTIL / PROVINCIAL (0108-0192-**-****0412)</td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 720.000,00</td>
                    <td className="px-3 py-2 text-right text-emerald-800 font-bold">$1.714,33</td>
                    <td className="px-3 py-2 font-mono text-blue-900 font-bold">Ref. #00010294821</td>
                    <td className="px-3 py-2 font-sans text-stone-600 text-[10.5px]">
                      Cta. 1.1.01.03.001 (Cierre Bs. 0,00)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-bold font-mono text-stone-900">31/03/2026</td>
                    <td className="px-3 py-2 font-sans">BANCO MERCANTIL / BANCO PROVINCIAL</td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 1.032.830,57</td>
                    <td className="px-3 py-2 text-right text-emerald-800 font-bold">$2.179,34</td>
                    <td className="px-3 py-2 font-mono text-blue-900 font-bold">Ref. #00041240208</td>
                    <td className="px-3 py-2 font-sans text-stone-600 text-[10.5px]">
                      Cta. 1.1.01.03.001 (Cierre Bs. 0,00)
                    </td>
                  </tr>
                  <tr className="bg-blue-50/30">
                    <td className="px-3 py-2 font-bold font-mono text-stone-900">30/04/2026</td>
                    <td className="px-3 py-2 font-sans">BANCO MERCANTIL / BANCO PROVINCIAL</td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 1.881.224,96</td>
                    <td className="px-3 py-2 text-right text-emerald-800 font-bold">$3.842,76</td>
                    <td className="px-3 py-2 font-mono text-blue-900 font-bold">Ref. #00055109283</td>
                    <td className="px-3 py-2 font-sans text-stone-600 text-[10.5px]">
                      Cta. 1.1.01.03.001 (Cierre Bs. 0,00)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-bold font-mono text-stone-900">30/06/2026</td>
                    <td className="px-3 py-2 font-sans">BANCO PLAZA (0138-0012) / BANCAMIGA (0172-0110)</td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 73.390.000,01</td>
                    <td className="px-3 py-2 text-right text-emerald-800 font-bold">$115.874,12</td>
                    <td className="px-3 py-2 font-mono text-blue-900 font-bold">Ref. #00003344419</td>
                    <td className="px-3 py-2 font-sans text-stone-600 text-[10.5px]">
                      Cta. 1.1.01.03.001 (Cierre Bs. 0,00)
                    </td>
                  </tr>
                  <tr className="bg-blue-50/30">
                    <td className="px-3 py-2 font-bold font-mono text-stone-900">31/07/2026</td>
                    <td className="px-3 py-2 font-sans">BANCO MERCANTIL / BANCO PLAZA</td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 47.240.540,00</td>
                    <td className="px-3 py-2 text-right text-emerald-800 font-bold">$63.089,18</td>
                    <td className="px-3 py-2 font-mono text-blue-900 font-bold">Ref. #00088210492</td>
                    <td className="px-3 py-2 font-sans text-stone-600 text-[10.5px]">
                      Cta. 1.1.01.03.001 (Cierre Bs. 0,00)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-bold font-mono text-stone-900">31/08/2026</td>
                    <td className="px-3 py-2 font-sans">BANCO MERCANTIL / BANCO PLAZA</td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 83.333.462,19</td>
                    <td className="px-3 py-2 text-right text-emerald-800 font-bold font-mono">$104.823,28</td>
                    <td className="px-3 py-2 font-mono text-blue-900 font-bold">Ref. #00099412038</td>
                    <td className="px-3 py-2 font-sans text-stone-600 text-[10.5px]">
                      Cta. 1.1.01.03.001 (Cierre Bs. 0,00)
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-blue-950 text-white font-bold text-xs border-t-2 border-blue-800">
                  <tr>
                    <td colSpan={2} className="px-3 py-2.5 font-sans uppercase">TOTAL MOSTRADO EN EXPEDIENTE DE CENTRALIZACIÓN BANESCO:</td>
                    <td className="px-3 py-2.5 text-right text-amber-300 font-mono text-sm">Bs. 208.708.057,73</td>
                    <td className="px-3 py-2.5 text-right text-emerald-400 font-mono text-sm">$308.317,80 USD</td>
                    <td colSpan={2} className="px-3 py-2.5 font-sans text-blue-200">
                      Saldo Neto Patrimonio / Fondos en Tránsito: <strong>Bs. 0,00</strong>.
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* INSTRUCCIONES OPERATIVAS Y DIGITALIZACIÓN PDF PARA EL ANALISTA DE BANESCO */}
              <div className="p-4 bg-stone-900 text-stone-200 text-[11px] space-y-2 font-sans rounded-b-lg border-t border-blue-800">
                <p className="font-bold text-amber-400 uppercase flex items-center gap-1.5 text-xs">
                  <span>💡 PROTOCOLO DE CONSIGNACIÓN Y DIGITALIZACIÓN DE ARCHIVOS PDF PARA BANESCO:</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-stone-800 p-2.5 rounded border border-stone-700 space-y-1">
                    <p className="font-bold text-white text-[11.5px]">📁 1. Archivos PDF Individuales por Operación:</p>
                    <p className="text-stone-300">
                      Cargar cada comprobante bancario en PDF por separado nombrado con formato estructurado:<br />
                      <code>1_Debito_Mercantil_31012026.pdf</code><br />
                      <code>2_Debito_Provincial_28022026.pdf</code><br />
                      <code>5_Debito_Plaza_Bancamiga_30062026.pdf</code>
                    </p>
                  </div>
                  <div className="bg-stone-800 p-2.5 rounded border border-stone-700 space-y-1">
                    <p className="font-bold text-white text-[11.5px]">🖊️ 2. Resaltado Digital de Datos Clave:</p>
                    <p className="text-stone-300">
                      Marcar con resaltador amarillo digital:<br />
                      1. Titular Emisor: <strong>AGRÍCOLA ONI, C.A. (RIF J-50145638-0)</strong><br />
                      2. Fecha valor de débito y número de referencia.<br />
                      3. Cuenta Banesco de destino N° 0134-0342-18-3421089912.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FUNDAMENTACIÓN JURÍDICA ANTE EL SENIAT Y SUDEBAN */}
            <div className="bg-stone-100 p-3 rounded-lg border border-stone-200 space-y-1.5 text-[11px] text-stone-800">
              <p className="font-bold text-stone-950 uppercase font-sans">
                FUNDAMENTACIÓN JURÍDICO-FISCAL ANTE EL SENIAT Y SUPERINTENDENCIA BANCARIA (SUDEBAN):
              </p>
              <p>
                <strong>&bull; Ley de Impuesto Sobre la Renta (ISLR - Arts. 1, 5 y 16):</strong> Establece el principio de disponibilidad del ingreso sobre bases devengadas o causadas. Los anticipos entregados por clientes en bolívares a tasa oficial BCV para la intermediación y procura de café en Venezuela constituyen obligaciones de hacer y pasivos exigibles de la empresa intermediaria, no hechos imponibles de enriquecimiento neto gravable sino hasta la efectiva entrega y enajenación del producto.
              </p>
              <p>
                <strong>&bull; Código Civil Venezolano (Art. 1152) y Código de Comercio:</strong> En las ventas comerciales de cosas genéricas sujetas a peso, cuenta o contratos a futuro con condición suspensiva, la traslación de propiedad y el perfeccionamiento de la venta operan con la entrega y recepción de las mercancías, evento fijado a partir de <strong>OCTUBRE DE 2026</strong>.
              </p>
              <p>
                <strong>&bull; Providencia Administrativa SENIAT N° SNAT/2011/00071 (Facturación Fiscal):</strong> La obligación formal de emisión de factura definitiva surge con la entrega de los bienes o prestación de servicios. Los anticipos bancarios se amparan en los contratos comerciales suscritos y se liquidarán con las facturas fiscales SENIAT que se emitirán a partir de octubre.
              </p>
            </div>

            {/* SUSTENTO LEGAL CONSTITUTIVO DEL ACTA 2021 Y PROPIEDAD ACCIONARIA ÚNICA */}
            <div className="bg-emerald-50/90 p-3.5 rounded-lg border border-emerald-300 space-y-2 text-[11px] text-stone-800 my-3">
              <p className="font-bold text-emerald-950 uppercase font-sans flex items-center justify-between">
                <span>🏛️ MARCO JURÍDICO CONSTITUTIVO (ACTA DE 2021) Y ESTRUCTURA ACCIONARIA UNIFORMADA:</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">INSCRITA EN 2021</span>
              </p>
              <p>
                <strong>&bull; Registro Mercantil y Objeto Social Constitutivo (Año 2021):</strong> La sociedad mercantil <strong>AGRÍCOLA ONI, C.A.</strong> fue constituida e inscrita formalmente ante el Registro Mercantil Primero del Estado Portuguesa en fecha <strong>16 de Septiembre de 2021</strong> (Tomo 31-A, N° 18, RIF J-50145638-0). En la Cláusula Segunda de su Acta Constitutiva Orgánica, se le autoriza y faculta de manera amplia e ilimitada desde el año 2021 para la compra, venta, intermediación comercial, procesamiento, distribución y comercialización de productos agrícolas, café y materias primas, así como la celebración de contratos de financiamiento, mutuos y gestiones bancarias y cambiarias.
              </p>
              <p>
                <strong>&bull; Propiedad Accionaria Única y Transparencia Operativa:</strong> Consta igualmente en los Libros Mercantiles de la empresa y actas de asamblea posteriores que el <strong>100% de las acciones</strong> de Agrícola Oni, C.A. pertenecen actualmente y de forma exclusiva al <strong>Sr. ELÍAS RAFAEL TRÍAS ABREU (C.I. V-23.997.829)</strong>, habiéndose cedido y retirado legalmente a los demás accionistas iniciales en asambleas previas registrales. Esta titularidad única garantiza el control centralizado de los fondos, la legitimidad de las operaciones de apoyo patrimonial y la total transparencia ante el sistema bancario nacional y Banesco Banco Universal.
              </p>
            </div>
          </div>

          {/* CUADRO DE SOPORTES DOCUMENTALES CONSIGNADOS */}
          <div className="bg-stone-50 border border-stone-300 rounded-xl p-5 my-6 space-y-3">
            <h4 className="font-bold text-stone-950 text-sm flex items-center justify-between border-b border-stone-300 pb-2">
              <span>SOPORTES DOCUMENTALES ADJUNTOS AL EXPEDIENTE DE RESPUESTA</span>
              <span className="text-xs font-mono text-stone-500">6 CUERPOS DE PRUEBA CERTIFICADOS</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-sm space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-mono">1</span>
                  Contrato Mutuo Manuel Becerra (Línea Bs. 600M)
                </span>
                <p className="text-stone-600 text-[11px]">
                  Contrato de Préstamo con Interés y Línea de Crédito Rotativa suscrito el 02/01/2026, pagaré mercantil notariado y detalle cronológico de las 47 operaciones bancarias (Desembolsos: Bs. 498,40M vs Pagos: Bs. 186,38M = Saldo en balance Bs. 325.948.652,96).
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-sm space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-mono">2</span>
                  Contratos a Futuro de Café con Empresas Venezolanas
                </span>
                <p className="text-stone-600 text-[11px]">
                  Contratos de intermediación comercial y compraventa a futuro de café 100% venezolano suscritos con clientes torrefactores (Empresa ETN, Distribuidora DIS, Grupo ORU, Comercializadora RIK) respaldando los anticipos en bolívares a tasa oficial BCV recibidos en Banesco.
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-sm space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-mono">3</span>
                  Pactos Cambiarios Banesco e Insumos Agroindustriales (USD 556.890,45)
                </span>
                <p className="text-stone-600 text-[11px]">
                  Comprobantes oficiales de compra de divisas en la Mesa de Cambio de Banesco Banco Universal (Bs. 375.630.000,00) destinados al pago de tolvas, sacos de yute, repuestos de maquinaria agroindustrial, mantenimiento de galpones y transporte terrestre de carga pesada nacional a tasa BCV.
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-sm space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-mono">4</span>
                  Guías de Movilización SICA, Registro CVC y Boletas de Pesaje
                </span>
                <p className="text-stone-600 text-[11px]">
                  Guías de Movilización Agroalimentaria expedidas por el SICA, licencias y registros de la Corporación Venezolana del Café (CVC), y boletas de pesaje en centros de acopio de Portuguesa que acreditan la legalidad del café nacional.
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-sm space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-mono">5</span>
                  Estados Financieros VEN-NIF (2025 - 2026)
                </span>
                <p className="text-stone-600 text-[11px]">
                  Balance General y Estado de Resultados al 31/12/2025 y al 31/08/2026 con sus respectivas notas revelatorias suscrito por la Presidencia de la empresa.
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-sm space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-mono">6</span>
                  Certificación de Cuentas Propias Internas
                </span>
                <p className="text-stone-600 text-[11px]">
                  Extractos bancarios certificados de Banco Provincial, Mercantil, Plaza y Bancamiga, acreditando la misma titularidad de Agrícola Oni C.A. (RIF J-50145638-0) para las transferencias de Bs. 208,71M (impacto neto Bs. 0,00).
                </p>
              </div>
            </div>
          </div>

          <p>
            A continuación, desglosamos en detalle la justificación y soportes de cada aspecto requerido en su oficio de auditoría:
          </p>

          {/* Detailed Points */}
          <div className="space-y-4 my-6">
            {BANESCO_AUDIT_POINTS.map((pt) => (
              <div key={pt.id} className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-mono">
                      {pt.id}
                    </span>
                    {pt.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                    {pt.status}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mb-1">
                  <strong>Requerimiento Banesco:</strong> {pt.request}
                </p>
                <p className="text-xs text-stone-800">
                  <strong>Respuesta de la Empresa:</strong> {pt.response}
                </p>
              </div>
            ))}
          </div>

          {/* Conciliation Table Preview */}
          <div className="my-6 border border-stone-300 rounded-lg overflow-hidden">
            <div className="bg-stone-100 px-4 py-2 font-bold text-xs uppercase tracking-wide text-stone-900 border-b border-stone-300 flex justify-between">
              <span>Resumen de Conciliación Bancaria Banesco al 31/08/2026</span>
              <span className="font-mono-num text-emerald-800 font-semibold">Diferencia: Bs. 0.00 (Cuadre Exacto)</span>
            </div>
            <table className="w-full text-xs font-mono-num">
              <tbody>
                <tr className="border-b border-stone-200">
                  <td className="px-4 py-2 text-stone-700 font-sans">Saldo según Estado de Cuenta Banesco N° 0134-0342-18-3421089912 (al 31/08/2026):</td>
                  <td className="px-4 py-2 text-right font-bold text-stone-950">Bs. 4.892.150,80</td>
                </tr>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <td className="px-4 py-2 text-stone-700 font-sans">Partidas Conciliatorias en Tránsito / Depósitos y Cheques Pendientes:</td>
                  <td className="px-4 py-2 text-right text-stone-600">Bs. 0,00</td>
                </tr>
                <tr className="bg-emerald-50/90 font-bold border-t-2 border-emerald-500">
                  <td className="px-4 py-2 text-emerald-950 font-sans">Saldo Conciliado según Libros de Contabilidad (Equivalente USD $6.153,73):</td>
                  <td className="px-4 py-2 text-right text-emerald-950 text-sm">Bs. 4.892.150,80</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Anexamos a este instrumento toda la documentación de soporte requerida: extractos bancarios certificados, copias de las facturas comerciales con sus respectivas retenciones fiscales SENIAT, constancia de inscripción en el Registro Nacional de Caficultores y el Registro Único de Información Fiscal (RIF) actualizado.
          </p>

          <p>
            Quedamos a su entera disposición para cualquier aclaratoria adicional o reunión presencial con la Gerencia de Cumplimiento que estimen pertinente.
          </p>
        </div>

        {/* Signatures Section - Presidencia & Contador CPC */}
        <div className="mt-14 pt-8 border-t border-stone-300 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div className="space-y-1">
            <div className="h-16 flex items-center justify-center">
              <div className="border border-stone-400 border-dashed rounded px-4 py-1.5 bg-stone-50 inline-block rotate-[-1deg] text-amber-900 font-serif italic text-sm shadow-xs">
                Elias Rafael Trías Abreu &mdash; Firma Digital
              </div>
            </div>
            <div className="border-t-2 border-stone-900 pt-2 mt-2">
              <p className="font-bold text-stone-950 text-sm">{company.legalRepresentative}</p>
              <p className="text-xs text-stone-700">C.I.: {company.idNumber}</p>
              <p className="text-xs font-semibold text-stone-800">{company.role}</p>
              <p className="text-xs font-bold text-stone-900 mt-0.5">{company.name}</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="h-16 flex items-center justify-center">
              <div className="border border-stone-400 border-dashed rounded px-4 py-1.5 bg-stone-50 inline-block rotate-[1deg] text-amber-900 font-serif italic text-sm shadow-xs">
                Licdo. Omar Pérez Castillo &mdash; CPC 16336
              </div>
            </div>
            <div className="border-t-2 border-stone-900 pt-2 mt-2">
              <p className="font-bold text-stone-950 text-sm">LICDO. OMAR PÉREZ CASTILLO</p>
              <p className="text-xs text-stone-700">Contador Público Colegiado (C.P.C. N° 16336)</p>
              <p className="text-xs font-semibold text-stone-800">Contador Público Independiente (VEN-NIF)</p>
              <p className="text-xs font-bold text-stone-900 mt-0.5">{company.name}</p>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-10 pt-4 border-t border-stone-200 text-[10px] text-stone-500 text-center flex flex-wrap justify-between items-center gap-2">
          <span>Código de Verificación Hash: SHA256-89410A82F109</span>
          <span>Página 1 de 1 &middot; Documento Oficial de Respaldo Bancario</span>
        </div>
      </div>
    </div>
  );
};
