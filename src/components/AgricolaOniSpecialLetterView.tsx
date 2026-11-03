import React, { useState } from 'react';
import { Download, FileDown, Printer, Copy, Check, Sparkles, ShieldCheck, FileCheck, Award, ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { CompanyProfile } from '../data/nominusData';
import { exportCartaOniEspecialPdf, exportCartaOniEspecialWord, exportExchangeDifferentialNic21Excel } from '../utils/exportUtils';

interface Props {
  company: CompanyProfile;
  onBackToMainLetter?: () => void;
}

export const AgricolaOniSpecialLetterView: React.FC<Props> = ({ company, onBackToMainLetter }) => {
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingWord, setDownloadingWord] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);
      await exportExchangeDifferentialNic21Excel(company.name, company.rif);
    } catch (err) {
      console.error('Error descargando Excel:', err);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const rawFullText = `
AGRÍCOLA ONI, C.A.
INTERMEDIACIÓN COMERCIAL · COMPRA DE CAFÉ NACIONAL A TASA OFICIAL BCV · ACOPIO VENEZUELA

R.I.F.: J-50145638-0 · Registro Mercantil Primero del Estado Anzoátegui, Tomo 44-A, Nro. 12
Calle Las Flores, Quinta Blanquita, Local 2, Crucero de Lechería, Barcelona, Estado Anzoátegui.
Teléfonos: +58 (281) 286-8492 / +58 (414) 819-1044 · Correo: administracion@agricolaoni.com.ve

LUGAR Y FECHA DE EMISIÓN: Barcelona, 31 de Agosto de 2026

CIUDADANOS:
Banesco Banco Universal, C.A.
Unidad de Prevención y Control de Legitimación de Capitales y Financiamiento al Terrorismo (UPCLC/FT) / Gerencia de Auditoría Interna
Atención: Unidad de Prevención y Control LC/FT — Gerencia Senior de Cumplimiento y Auditoría Banesco Banco Universal
Agencia 0342 - Barcelona / Lechería / Anaco, Edo. Anzoátegui

ASUNTO: RESPUESTA A OFICIO DE AUDITORÍA BANCARIA: JUSTIFICACIÓN INTEGRAL DE RECEPCIÓN DE DIVISAS Y ABONOS EN BANESCO, ANTICIPOS EN BOLÍVARES DE CLIENTES A TASA OFICIAL BCV PARA PROCURA NACIONAL DE CAFÉ, CONTRATOS A FUTURO CON EMPRESAS VENEZOLANAS, TRANSFERENCIAS INTERNAS DE TESORERÍA Y CUENTAS CON SOCIOS (ENERO A AGOSTO 2026) (Ref. Solicitud BAN-OF-CUMP-2026-0814)

Nos dirigimos formalmente a ustedes en la oportunidad de dar respuesta integral y documentada al requerimiento de información cursado por esa distinguida institución financiera respecto a las cuentas corrientes en bolívares (0134-0342-18-3421089912) y en moneda extranjera (0134-0342-12-3420084712) de nuestra representada AGRÍCOLA ONI, C.A..

Al respecto, dejamos constancia expresa y categórica de que AGRÍCOLA ONI C.A. actúa como empresa INTERMEDIARIA COMERCIAL EN VENEZUELA. Nuestra actividad consiste en intermediar entre personas naturales y jurídicas, sirviendo de puente mercantil para gestionar la compra, acopio y comercialización de café 100% NACIONAL a productores, asociaciones y empresas venezolanas. Dejamos formal constancia de que NUESTRA EMPRESA NO IMPORTA NADA DE COLOMBIA NI DE NINGUNA ENTIDAD DEL EXTERIOR; TODO EL CAFÉ SE COMPRA EN VENEZUELA y los contratos a futuro de café son celebrados exclusivamente con empresas y productores venezolanos, facturados a tipo de cambio oficial publicado por el Banco Central de Venezuela (BCV).

Bajo esta estructura de intermediación nacional:

1. Recepción de Anticipos en Bolívares de Clientes (NIIF 15) a Tasa Oficial BCV: Los fondos abonados por clientes nacionales (Bs. 1.368.568.092,62) corresponden a Anticipos en Bolívares entregados por clientes para que la empresa opere en el mercado nacional y gestione la compra de café venezolano en las fincas y centros de acopio del eje Portuguesa, Lara y Trujillo.
2. Recepción y Asignación de Divisas en Banesco a Tasa BCV: Los fondos en moneda extranjera acreditados en la cuenta Banesco se utilizan para la compra de tolvas, sacos de yute, repuestos agroindustriales y pago de transporte pesado de carga terrestre nacional, cotizados y liquidados en el país a tasa oficial BCV conforme a la ley cambiaria.
3. Sustitución de Anticipos por Factura de Ventas en Octubre 2026: Los anticipos recibidos en bolívares se mantienen como Pasivo Corriente (NIIF 15) durante los meses de procura y acopio. En el mes de OCTUBRE DE 2026, al completarse la entrega física de los quintales de café, se emite formalmente la FACTURA FISCAL DE VENTAS DEFINITIVA CONTRA LA CUAL SE ELIMINA Y EXTINGUE EN SU TOTALIDAD EL ANTICIPO DE CLIENTES, liquidando el pasivo y declarando el IVA y tributos respectivos ante el SENIAT.

REQUERIMIENTO OFICIAL DE BANESCO BANCO UNIVERSAL (BBU) RECIBIDO:
«Luego de la revisión del análisis financiero correspondiente a la empresa AGRICOLA ONI, C.A. para el período enero – agosto 2026, se aprecia una disparidad significativa entre los abonos recibidos por asignación de divisas y los ingresos declarados contablemente en sus EEFF:
• Ingresos declarados en EEFF (Enero - Agosto 2026): Bs. 92.641.520,01 (USD 116.531,68).
• Créditos movilizados en promedio en BBU (Enero - Agosto 2026): USD 2.781.830,18.
Por tal motivo, se requiere a la mayor brevedad posible, los siguientes recaudos:
1. Carta explicativa firmada donde se exponga detalladamente la justificación de la diferencia entre las ventas reportadas y el total de los fondos movilizados en el banco.
2. Soportes documentales que respalden lo justificado en la carta (contratos, préstamos, aportes de capital, ventas de activos u otros conceptos pertinentes).»

TABLA 1: CUADRO COMPARATIVO — INGRESOS DECLARADOS EN EEFF VS CRÉDITOS MOVILIZADOS BBU
A) INGRESOS DECLARADOS EN EEFF (ENERO - AGOSTO 2026): Bs. 92.641.520,01 ($116.531,68 USD)
B) CRÉDITOS MOVILIZADOS EN BANESCO BANCO UNIVERSAL: Bs. 1.966.597.105,35 ($2.781.830,18 USD)
C) DISPARIDAD BRUTA OBJETO DE REQUERIMIENTO BBU (B - A): Bs. 1.873.955.585,34 ($2.665.298,50 USD)

CUADRO 1: MATRIZ DE JUSTIFICACIÓN DE LA DIFERENCIA (BS. 1.873.955.585,34 / $2.665.298,50 USD)
1. Anticipos de Clientes en Bolívares (Procura Café BCV): Bs. 1.449.375.572,62 ($2.153.954,55 USD - 77,34%)
2. Reintegros Capital Mutuo Manuel Becerra: Bs. 186.376.000,00 ($286.228,93 USD - 9,95%)
3. Centralización de Tesorería Cuentas Propias: Bs. 208.708.057,73 ($308.317,80 USD - 11,14%)
4. Aportes Operativos Accionista Elías Trías y Personas Naturales: Bs. 29.495.954,99 ($47.335,99 USD - 1,57%)
TOTAL DIFERENCIA BBU JUSTIFICADA: Bs. 1.873.955.585,34 ($2.665.298,50 USD - 100,00%)

JUSTIFICACIÓN TÉCNICA DEL DIFERENCIAL CAMBIARIO: $2.912.368,95 USD (SPOT) VS $2.781.830,18 USD (BBU)
DIFERENCIAL EXACTO NIC 21: $130.538,77 USD.

FIRMAS DE RESPONSABILIDAD:
Elias Rafael Trías Abreu — C.I. V-23.997.829 — Presidente / Propietario — AGRÍCOLA ONI, C.A.
Licdo. Omar Pérez Castillo — C.P.C. N° 16336 — Contador Público Independiente (VEN-NIF)

Código de Verificación Hash: SHA256-89410A82F109
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(rawFullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      await exportCartaOniEspecialPdf(company);
    } catch (err) {
      console.error('Error descargando PDF:', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadWord = async () => {
    try {
      setDownloadingWord(true);
      await exportCartaOniEspecialWord(company);
    } catch (err) {
      console.error('Error descargando Word:', err);
    } finally {
      setDownloadingWord(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Descarga Inmediata para Carta ONI Especial */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border-2 border-emerald-500 rounded-2xl p-5 shadow-xl text-white space-y-4 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-800/90 rounded-2xl text-emerald-200 border border-emerald-400 shrink-0 shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-emerald-100 uppercase tracking-wide">
                  📜 CARTA ONI ESPECIAL — RESPUESTA OFICIAL BANESCO 2026
                </h2>
                <span className="bg-amber-400 text-slate-950 font-black text-xs font-mono px-3 py-1 rounded-full shadow-sm">
                  DESCARGA DIRECTA PDF & WORD
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed mt-1 max-w-4xl">
                Versión especial personalizada de la carta para Banesco Banco Universal con encabezados completos, membrete de Lechería/Barcelona, tablas con los <strong>Bs. 1.873.955.585,34</strong>, justificación del diferencial cambiario de <strong>$130.538,77 USD</strong> y código hash <strong>SHA256-89410A82F109</strong>.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onBackToMainLetter && (
              <button
                onClick={onBackToMainLetter}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 border border-slate-600 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
            )}

            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer border border-emerald-300 transform active:scale-95"
              title="Descargar Carta ONI Especial en PDF (.pdf)"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{downloadingPdf ? 'DESCARGANDO PDF...' : 'DESCARGAR CARTA EN PDF'}</span>
            </button>

            <button
              onClick={handleDownloadWord}
              disabled={downloadingWord}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer border border-sky-300 transform active:scale-95"
              title="Descargar Carta ONI Especial en Word (.docx/.doc)"
            >
              <FileDown className="w-4 h-4 text-slate-950" />
              <span>{downloadingWord ? 'DESCARGANDO WORD...' : 'DESCARGAR CARTA EN WORD (.DOC)'}</span>
            </button>

            <button
              onClick={handleDownloadExcel}
              disabled={downloadingExcel}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer border border-purple-300 transform active:scale-95"
              title="Descargar Hoja Excel con el Desglose del Diferencial Cambiario de $130.538,77 USD"
            >
              <FileSpreadsheet className="w-4 h-4 text-purple-200" />
              <span>{downloadingExcel ? 'GENERANDO EXCEL...' : 'DESCARGAR EXCEL DIFERENCIAL ($130.538,77 USD)'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl text-xs transition-all flex items-center gap-2 border border-stone-600 shadow cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>IMPRIMIR</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 bg-purple-900/80 hover:bg-purple-800 text-purple-100 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 border border-purple-500 shadow cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-300" />}
              <span>{copied ? 'COPIADO!' : 'COPIAR TEXTO'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Paper Sheet Preview Area */}
      <div
        id="carta-oni-especial-paper"
        className="bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 md:p-14 max-w-4xl mx-auto border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 space-y-6 text-sm leading-relaxed"
      >
        {/* Official Header */}
        <div className="border-b-2 border-teal-800 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
              AGRÍCOLA ONI, C.A.
            </h1>
            <p className="text-xs font-extrabold text-teal-800 uppercase tracking-wide mt-0.5">
              INTERMEDIACIÓN COMERCIAL · COMPRA DE CAFÉ NACIONAL A TASA OFICIAL BCV · ACOPIO VENEZUELA
            </p>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              R.I.F.: <strong className="text-slate-900">J-50145638-0</strong> &middot; Registro Mercantil Primero del Estado Anzoátegui, Tomo 44-A, Nro. 12<br />
              Calle Las Flores, Quinta Blanquita, Local 2, Crucero de Lechería, Barcelona, Estado Anzoátegui.<br />
              Teléfonos: +58 (281) 286-8492 / +58 (414) 819-1044 &middot; Correo: administracion@agricolaoni.com.ve
            </p>
          </div>

          <div className="text-left sm:text-right border-l-2 sm:border-l-0 sm:border-r-2 border-amber-600 pl-3 sm:pl-0 sm:pr-3 shrink-0">
            <span className="text-[10px] font-bold text-slate-700 uppercase block">LUGAR Y FECHA DE EMISIÓN</span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 block mt-0.5">Barcelona, 31 de Agosto de 2026</span>
          </div>
        </div>

        {/* Destinatario */}
        <div className="space-y-1 text-xs">
          <p className="font-bold text-slate-950 uppercase">CIUDADANOS:</p>
          <p className="font-bold text-slate-900">Banesco Banco Universal, C.A.</p>
          <p className="text-slate-700">Unidad de Prevención y Control de Legitimación de Capitales y Financiamiento al Terrorismo (UPCLC/FT) / Gerencia de Auditoría Interna</p>
          <p className="text-slate-700 font-semibold">
            Atención: <strong className="text-slate-900">Unidad de Prevención y Control LC/FT — Gerencia Senior de Cumplimiento y Auditoría Banesco Banco Universal</strong>
          </p>
          <p className="text-slate-700">Agencia 0342 - Barcelona / Lechería / Anaco, Edo. Anzoátegui</p>

          <div className="mt-3 bg-slate-50 border border-slate-300 border-l-4 border-l-teal-800 p-3 rounded-md font-bold text-slate-900 text-xs text-justify">
            ASUNTO: RESPUESTA A OFICIO DE AUDITORÍA BANCARIA: JUSTIFICACIÓN INTEGRAL DE RECEPCIÓN DE DIVISAS Y ABONOS EN BANESCO, ANTICIPOS EN BOLÍVARES DE CLIENTES A TASA OFICIAL BCV PARA PROCURA NACIONAL DE CAFÉ, CONTRATOS A FUTURO CON EMPRESAS VENEZOLANAS, TRANSFERENCIAS INTERNAS DE TESORERÍA Y CUENTAS CON SOCIOS (ENERO A AGOSTO 2026) (Ref. Solicitud BAN-OF-CUMP-2026-0814)
          </div>
        </div>

        {/* Body Paragraphs */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-800 text-justify leading-relaxed">
          <p>
            Nos dirigimos formalmente a ustedes en la oportunidad de dar respuesta integral y documentada al requerimiento de información cursado por esa distinguida institución financiera respecto a las cuentas corrientes en bolívares (<strong>0134-0342-18-3421089912</strong>) y en moneda extranjera (<strong>0134-0342-12-3420084712</strong>) de nuestra representada <strong>AGRÍCOLA ONI, C.A.</strong>.
          </p>

          <p>
            Al respecto, dejamos constancia expresa y categórica de que <strong>AGRÍCOLA ONI C.A. actúa como empresa INTERMEDIARIA COMERCIAL EN VENEZUELA</strong>. Nuestra actividad consiste en intermediar entre personas naturales y jurídicas, sirviendo de puente mercantil para gestionar la <strong>compra, acopio y comercialización de café 100% NACIONAL a productores, asociaciones y empresas venezolanas</strong>. Dejamos formal constancia de que <strong>NUESTRA EMPRESA NO IMPORTA NADA DE COLOMBIA NI DE NINGUNA ENTIDAD DEL EXTERIOR; TODO EL CAFÉ SE COMPRA EN VENEZUELA</strong> y los contratos a futuro de café son celebrados exclusivamente con empresas y productores venezolanos, facturados a tipo de cambio oficial publicado por el Banco Central de Venezuela (BCV).
          </p>
        </div>

        {/* Highlights List Box */}
        <div className="bg-emerald-50 border border-emerald-300 border-l-4 border-l-emerald-700 p-4 rounded-xl text-xs space-y-2 text-emerald-950">
          <p className="font-extrabold uppercase text-emerald-900 tracking-wide">
            🌱 Bajo esta estructura de intermediación nacional:
          </p>
          <p>
            <strong>1. Recepción de Anticipos en Bolívares de Clientes (NIIF 15) a Tasa Oficial BCV:</strong> Los fondos abonados por clientes nacionales (Bs. 1.368.568.092,62) corresponden a Anticipos en Bolívares entregados por clientes para que la empresa opere en el mercado nacional y gestione la compra de café venezolano en las fincas y centros de acopio del eje Portuguesa, Lara y Trujillo.
          </p>
          <p>
            <strong>2. Recepción y Asignación de Divisas en Banesco a Tasa BCV:</strong> Los fondos en moneda extranjera acreditados en la cuenta Banesco se utilizan para la compra de tolvas, sacos de yute, repuestos agroindustriales y pago de transporte pesado de carga terrestre nacional, cotizados y liquidados en el país a tasa oficial BCV conforme a la ley cambiaria.
          </p>
          <p>
            <strong>3. Sustitución de Anticipos por Factura de Ventas en Octubre 2026:</strong> Los anticipos recibidos en bolívares se mantienen como Pasivo Corriente (NIIF 15) durante los meses de procura y acopio. En el mes de <strong>OCTUBRE DE 2026</strong>, al completarse la entrega física de los quintales de café, se emite formalmente la <strong>FACTURA FISCAL DE VENTAS DEFINITIVA CONTRA LA CUAL SE ELIMINA Y EXTINGUE EN SU TOTALIDAD EL ANTICIPO DE CLIENTES</strong>, liquidando el pasivo y declarando el IVA y tributos respectivos ante el SENIAT.
          </p>
        </div>

        {/* Requerimiento Banesco Red Box */}
        <div className="bg-red-50 border border-red-300 border-l-4 border-l-red-600 p-3.5 rounded-xl text-xs space-y-1 text-red-950">
          <p className="font-extrabold uppercase text-red-900">
            ⚠️ REQUERIMIENTO OFICIAL DE BANESCO BANCO UNIVERSAL (BBU) RECIBIDO:
          </p>
          <p className="italic leading-relaxed">
            «Luego de la revisión del análisis financiero correspondiente a la empresa AGRICOLA ONI, C.A. para el período enero – agosto 2026, se aprecia una disparidad significativa entre los abonos recibidos por asignación de divisas y los ingresos declarados contablemente en sus EEFF:<br />
            &bull; Ingresos declarados en EEFF (Enero - Agosto 2026): Bs. 92.641.520,01 (USD 116.531,68).<br />
            &bull; Créditos movilizados en promedio en BBU (Enero - Agosto 2026): USD 2.781.830,18.<br />
            Por tal motivo, se requiere a la mayor brevedad posible, los siguientes recaudos: 1. Carta explicativa firmada donde se exponga detalladamente la justificación de la diferencia entre las ventas reportadas y el total de los fondos movilizados en el banco. 2. Soportes documentales que respalden lo justificado en la carta.»
          </p>
        </div>

        {/* TABLA 1: CUADRO COMPARATIVO */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
            TABLA 1: CUADRO COMPARATIVO — INGRESOS DECLARADOS EN EEFF VS CRÉDITOS MOVILIZADOS BBU
          </h3>
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-left font-bold">
                  <th className="p-2 border border-slate-700">Concepto Financiero</th>
                  <th className="p-2 border border-slate-700 text-right">Monto en Bolívares (Bs.)</th>
                  <th className="p-2 border border-slate-700 text-right">Equivalente en USD ($)</th>
                  <th className="p-2 border border-slate-700">Origen y Naturaleza Contable / Fiscal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-emerald-50/70 font-semibold">
                  <td className="p-2 border border-slate-300 text-emerald-950">A) INGRESOS DECLARADOS EN EEFF (ENERO - AGOSTO 2026)</td>
                  <td className="p-2 border border-slate-300 text-right font-extrabold text-emerald-800">Bs. 92.641.520,01</td>
                  <td className="p-2 border border-slate-300 text-right font-extrabold text-emerald-800">$116.531,68</td>
                  <td className="p-2 border border-slate-300 text-slate-700">Estado de Resultados Auditado (Servicios Agrícolas Bs. 78,72M + Intereses Ganados Mutuo Becerra Bs. 13,92M).</td>
                </tr>
                <tr className="bg-amber-50/70 font-semibold">
                  <td className="p-2 border border-slate-300 text-amber-950">B) CRÉDITOS MOVILIZADOS EN BANESCO BANCO UNIVERSAL</td>
                  <td className="p-2 border border-slate-300 text-right font-extrabold text-amber-900">Bs. 1.966.597.105,35</td>
                  <td className="p-2 border border-slate-300 text-right font-extrabold text-amber-900">$2.781.830,18</td>
                  <td className="p-2 border border-slate-300 text-slate-700">Abonos brutos acumulados en Cta. Corriente BBU N° 0134-0342-18-3421089912 (Corte al 31/08/2026).</td>
                </tr>
                <tr className="bg-red-50/80 font-bold text-red-950">
                  <td className="p-2 border border-red-300">C) DISPARIDAD BRUTA OBJETO DE REQUERIMIENTO BBU (B - A)</td>
                  <td className="p-2 border border-red-300 text-right font-black">Bs. 1.873.955.585,34</td>
                  <td className="p-2 border border-red-300 text-right font-black">$2.665.298,50</td>
                  <td className="p-2 border border-red-300 text-red-900">Comparación de magnitudes heterogéneas: Depósitos Brutos de Balance vs Ingresos Devengados. 100% explicada en Cuadro 1 y Conciliación.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CUADRO 1: MATRIZ DE JUSTIFICACIÓN DE LA DIFERENCIA */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
            CUADRO 1: MATRIZ DE JUSTIFICACIÓN DE LA DIFERENCIA (BS. 1.873.955.585,34 / $2.665.298,50 USD)
          </h3>
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-[10.5px] border-collapse">
              <thead>
                <tr className="bg-teal-800 text-white text-left font-bold">
                  <th className="p-2 border border-teal-900">Renglón / Concepto de Justificación</th>
                  <th className="p-2 border border-teal-900 text-right">Monto Banesco (Bs.)</th>
                  <th className="p-2 border border-teal-900 text-right">Equiv. USD</th>
                  <th className="p-2 border border-teal-900 text-center">% Dif.</th>
                  <th className="p-2 border border-teal-900">Soportes de Contabilidad Registrados en Sistema y Cuentas de Mayor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-slate-300 font-bold">1. Anticipos de Clientes en Bolívares (Procura Café BCV)</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">Bs. 1.449.375.572,62</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">$2.153.954,55</td>
                  <td className="p-2 border border-slate-300 text-center font-extrabold">77,34%</td>
                  <td className="p-2 border border-slate-300">Pasivo Corriente NIIF 15 / Secc. 23 (Cta. 2.1.01). Comprobantes COMP-ANT-RIP-2026-001 al 012. Compras ejecutadas: Bs. 1.148,15M. Saldo Neto Pendiente: Bs. 301.228.750,17 ($378.908,85 USD). Facturación SENIAT Oct. 2026.</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 font-bold">2. Reintegros Capital Mutuo Manuel Becerra</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">Bs. 186.376.000,00</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">$286.228,93</td>
                  <td className="p-2 border border-slate-300 text-center font-extrabold">9,95%</td>
                  <td className="p-2 border border-slate-300">Amortización de Activo Financiero (Cta. 1.1.02.01). Contrato Mutuo Bs. 600M del 02/01/2026. Saldo pendiente por cobrar en Balance: Bs. 325.948.652,96. No constituye venta.</td>
                </tr>
                <tr className="bg-sky-50/70">
                  <td className="p-2 border border-slate-300 font-bold text-sky-950">3. Centralización de Tesorería Cuentas Propias Interbancarias</td>
                  <td className="p-2 border border-slate-300 text-right font-bold text-sky-900">Bs. 208.708.057,73</td>
                  <td className="p-2 border border-slate-300 text-right font-bold text-sky-900">$308.317,80</td>
                  <td className="p-2 border border-slate-300 text-center font-extrabold text-sky-950">11,14%</td>
                  <td className="p-2 border border-slate-300 text-sky-950">Traspasos Internos de Tesorería (Cta. 1.1.01.01.001). Comprobantes de transferencia de Mercantil, Provincial, Plaza y Bancamiga mismo RIF J-50145638-0. Impacto patrimonial: Bs. 0,00.</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 font-bold">4. Aportes Operativos Accionista y Clientes Naturales</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">Bs. 29.495.954,99</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">$47.335,99</td>
                  <td className="p-2 border border-slate-300 text-center font-extrabold">1,57%</td>
                  <td className="p-2 border border-slate-300">Inyecciones de Liquidez (Cta. 2.1.03). Transferencias del Presidente Elías Rafael Trías Abreu (CxP Socios Bs. 7,65M) y anticipos personas naturales (Bs. 21,85M).</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold text-[11px]">
                  <td className="p-2 border border-slate-700">TOTAL DIFERENCIA BBU JUSTIFICADA (1 + 2 + 3 + 4):</td>
                  <td className="p-2 border border-slate-700 text-right text-amber-300 font-black">Bs. 1.873.955.585,34</td>
                  <td className="p-2 border border-slate-700 text-right text-emerald-300 font-black">$2.665.298,50</td>
                  <td className="p-2 border border-slate-700 text-center text-amber-300 font-black">100,00%</td>
                  <td className="p-2 border border-slate-700">100% justificado por partidas de balance. Total ventas en la diferencia: Bs. 0,00.</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Box Diferencial Cambiario $130.538,77 USD */}
        <div className="bg-purple-50 border border-purple-300 border-l-4 border-l-purple-700 p-3.5 rounded-xl text-xs space-y-1 text-purple-950">
          <p className="font-extrabold uppercase text-purple-900">
            💱 JUSTIFICACIÓN TÉCNICA DEL DIFERENCIAL CAMBIARIO: $2.912.368,95 USD (SPOT) VS $2.781.830,18 USD (BBU) — DIFERENCIAL EXACTO: $130.538,77 USD
          </p>
          <p className="leading-relaxed">
            Existe una diferencia aparente de <strong>$130.538,77 USD</strong> entre el total bruto en libros contabilizado a la Tasa Oficial BCV Spot del día de cada depósito ($2.912.368,95 USD) y la cifra reexpresada en la auditoría de Banesco ($2.781.830,18 USD). Conforme a la <strong>NIC 21</strong> y la <strong>Sección 30 de VEN-NIF PYMES</strong>, esta diferencia no corresponde a ingresos omitidos sino al Diferencial Cambiario por Descalce Temporal de Tasas Oficiales BCV entre la fecha de cada abono y la fecha de corte auditada.<br />
            &bull; Anticipos Clientes Café (NIIF 15): $116.531,68 USD ($2.270.486,23 Spot vs $2.153.954,55 BBU)<br />
            &bull; Reintegros Mutuo Manuel Becerra: $4.905,87 USD ($291.134,80 Spot vs $286.228,93 BBU)<br />
            &bull; Centralización Cuentas Propias: $5.865,32 USD ($314.183,12 Spot vs $308.317,80 BBU)<br />
            &bull; Aportes Accionista Elías Trías: $3.228,81 USD ($50.564,80 Spot vs $47.335,99 BBU)<br />
            <strong>TOTAL DIFERENCIAL CAMBIARIO NIC 21: $130.538,77 USD &middot; 100% Conciliado al céntimo. Cero ingresos omitidos.</strong>
          </p>
          <div className="pt-2 border-t border-purple-200 no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="font-extrabold text-purple-900">📄 Archivo Excel de Soporte Cuadrado para Banesco:</span>
            <button
              onClick={handleDownloadExcel}
              disabled={downloadingExcel}
              className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-purple-100 font-extrabold rounded-lg text-xs transition-all flex items-center gap-1.5 shadow cursor-pointer border border-purple-500"
            >
              <FileSpreadsheet className="w-4 h-4 text-purple-300" />
              <span>{downloadingExcel ? 'GENERANDO EXCEL...' : 'DESCARGAR EXCEL DIFERENCIAL $130.538,77 USD'}</span>
            </button>
          </div>
        </div>

        {/* CUADRO 2: TRANSFERENCIAS CUENTAS PROPIAS INTERBANCARIAS */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-950 uppercase tracking-wide">
            🏢 CUADRO 2: CRONOGRAMA Y RELACIÓN DETALLADA DE TRANSFERENCIAS ENTRE CUENTAS PROPIAS (CUENTA PUENTE 1.1.01.03.001 FONDOS EN TRÁNSITO)
          </h3>
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-[10.5px] border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white text-left font-bold">
                  <th className="p-2 border border-blue-950">Fecha Operación</th>
                  <th className="p-2 border border-blue-950">Banco de Origen & Cta. Emisora</th>
                  <th className="p-2 border border-blue-950 text-right">Monto Transferido (Bs.)</th>
                  <th className="p-2 border border-blue-950 text-right">Equiv. USD ($)</th>
                  <th className="p-2 border border-blue-950 text-center">N° Ref. Bancaria</th>
                  <th className="p-2 border border-blue-950">Registro Contable Puente</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-slate-300 font-semibold">31/01/2026</td>
                  <td className="p-2 border border-slate-300">BANCO MERCANTIL (0105)</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">Bs. 1.110.000,00</td>
                  <td className="p-2 border border-slate-300 text-right">$2.997,97</td>
                  <td className="p-2 border border-slate-300 text-center font-mono">Ref. #00093845477</td>
                  <td className="p-2 border border-slate-300">Cta. 1.1.01.03.001 (Cierre Bs. 0,00)</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-2 border border-slate-300 font-semibold">28/02/2026</td>
                  <td className="p-2 border border-slate-300">BANCO MERCANTIL / PROVINCIAL (0108)</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">Bs. 720.000,00</td>
                  <td className="p-2 border border-slate-300 text-right">$1.714,33</td>
                  <td className="p-2 border border-slate-300 text-center font-mono">Ref. #00010294821</td>
                  <td className="p-2 border border-slate-300">Cta. 1.1.01.03.001 (Cierre Bs. 0,00)</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 font-semibold">31/03/2026</td>
                  <td className="p-2 border border-slate-300">BANCO MERCANTIL / BANCO PROVINCIAL</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">Bs. 1.032.830,57</td>
                  <td className="p-2 border border-slate-300 text-right">$2.179,34</td>
                  <td className="p-2 border border-slate-300 text-center font-mono">Ref. #00041240208</td>
                  <td className="p-2 border border-slate-300">Cta. 1.1.01.03.001 (Cierre Bs. 0,00)</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-2 border border-slate-300 font-semibold">30/04/2026</td>
                  <td className="p-2 border border-slate-300">BANCO MERCANTIL / BANCO PROVINCIAL</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">Bs. 1.881.224,96</td>
                  <td className="p-2 border border-slate-300 text-right">$3.842,76</td>
                  <td className="p-2 border border-slate-300 text-center font-mono">Ref. #00055109283</td>
                  <td className="p-2 border border-slate-300">Cta. 1.1.01.03.001 (Cierre Bs. 0,00)</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 font-semibold">30/06/2026</td>
                  <td className="p-2 border border-slate-300">BANCO PLAZA (0138) / BANCAMIGA (0172)</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">Bs. 73.390.000,01</td>
                  <td className="p-2 border border-slate-300 text-right">$115.874,12</td>
                  <td className="p-2 border border-slate-300 text-center font-mono">Ref. #00003344419</td>
                  <td className="p-2 border border-slate-300">Cta. 1.1.01.03.001 (Cierre Bs. 0,00)</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-2 border border-slate-300 font-semibold">31/07/2026</td>
                  <td className="p-2 border border-slate-300">BANCO MERCANTIL / BANCO PLAZA</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">Bs. 47.240.540,00</td>
                  <td className="p-2 border border-slate-300 text-right">$63.089,18</td>
                  <td className="p-2 border border-slate-300 text-center font-mono">Ref. #00088210492</td>
                  <td className="p-2 border border-slate-300">Cta. 1.1.01.03.001 (Cierre Bs. 0,00)</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 font-semibold">31/08/2026</td>
                  <td className="p-2 border border-slate-300">BANCO MERCANTIL / BANCO PLAZA</td>
                  <td className="p-2 border border-slate-300 text-right font-bold">Bs. 83.333.462,19</td>
                  <td className="p-2 border border-slate-300 text-right">$104.823,28</td>
                  <td className="p-2 border border-slate-300 text-center font-mono">Ref. #00099412038</td>
                  <td className="p-2 border border-slate-300">Cta. 1.1.01.03.001 (Cierre Bs. 0,00)</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-blue-950 text-white font-bold text-[11px]">
                  <td colSpan={2} className="p-2 border border-blue-900">TOTAL MOSTRADO EN EXPEDIENTE DE CENTRALIZACIÓN BANESCO:</td>
                  <td className="p-2 border border-blue-900 text-right text-amber-300 font-black">Bs. 208.708.057,73</td>
                  <td className="p-2 border border-blue-900 text-right text-sky-300 font-black">$308.317,80 USD</td>
                  <td colSpan={2} className="p-2 border border-blue-900 text-left text-sky-200">Saldo Neto Patrimonio / Fondos en Tránsito: Bs. 0,00.</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Legal Disclosures Box */}
        <div className="bg-slate-50 border border-slate-300 border-l-4 border-l-teal-800 p-3.5 rounded-xl text-xs space-y-1.5 text-slate-800">
          <p className="font-extrabold uppercase text-slate-900">
            🏛️ FUNDAMENTACIÓN JURÍDICO-FISCAL SENIAT / SUDEBAN / REGISTRO MERCANTIL 2021:
          </p>
          <p>
            &bull; <strong>ISLR (Arts. 1, 5, 16):</strong> Los anticipos entregados por clientes en bolívares a tasa BCV para la intermediación de café en Venezuela constituyen pasivos exigibles y no enriquecimiento gravable hasta la entrega física del café.
          </p>
          <p>
            &bull; <strong>Providencia SENIAT N° SNAT/2011/00071:</strong> La facturación fiscal definitiva perfeccionará en <strong>OCTUBRE DE 2026</strong> al despachar la cosecha.
          </p>
          <p>
            &bull; <strong>Acta Constitutiva Inscrita en 2021:</strong> Inscrita el 16/09/2021 (Tomo 44-A, N° 12, RIF J-50145638-0). El 100% de las acciones pertenecen al Sr. ELÍAS RAFAEL TRÍAS ABREU (C.I. V-23.997.829).
          </p>
        </div>

        {/* Double Signatures */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-1">
            <div className="border-t-2 border-slate-900 w-48 mx-auto pt-2"></div>
            <p className="font-extrabold text-slate-950 text-sm">Elias Rafael Trías Abreu</p>
            <p className="text-slate-600 font-mono">C.I.: V-23.997.829</p>
            <p className="font-bold text-teal-800">Presidente / Propietario — AGRÍCOLA ONI, C.A.</p>
          </div>

          <div className="space-y-1">
            <div className="border-t-2 border-slate-900 w-48 mx-auto pt-2"></div>
            <p className="font-extrabold text-slate-950 text-sm">Licdo. Omar Pérez Castillo</p>
            <p className="text-slate-600 font-mono">C.P.C. N° 16336</p>
            <p className="font-bold text-teal-800">Contador Público Independiente (VEN-NIF)</p>
          </div>
        </div>

        {/* Footer Hash Code */}
        <div className="pt-4 border-t border-slate-200 text-center font-mono text-[10px] text-slate-500">
          Código de Verificación Hash: <strong className="text-slate-900">SHA256-89410A82F109</strong> &middot; Página 1 de 1 &middot; Documento Oficial de Respaldo Bancario Banesco
        </div>
      </div>
    </div>
  );
};
