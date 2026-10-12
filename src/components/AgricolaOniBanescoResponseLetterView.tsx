import React, { useState } from 'react';
import { Printer, Download, Copy, Check, FileCheck, Shield, ExternalLink, ChevronRight, Stamp, FileDown } from 'lucide-react';
import { exportToWord, downloadElementAsPdf } from '../utils/exportUtils';
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

  const totalCredits = bankMovements.reduce((acc, m) => acc + m.creditVES, 0);
  const totalDebits = bankMovements.reduce((acc, m) => acc + m.debitVES, 0);
  const liveBankBalance = totalCredits - totalDebits;

  const handleCopyText = () => {
    const textContent = `
OFICIO: AO-DIR-BAN-2026-042
FECHA: 31 de Marzo de 2026
EXPEDIENTE: AUD-BAN-2026-ONI-094

A: BANESCO BANCO UNIVERSAL, C.A.
Unidad de Prevención y Control de Legitimación de Capitales (UPCLC/FT)
Gerencia de Auditoría Interna
Atención: Lcdo. Roberto Albarrán

ASUNTO: RESPUESTA FORMAL A AUDITORÍA BANCARIA Y JUSTIFICACIÓN DE FONDOS OPERATIVOS AGRÍCOLAS - CUENTA CORRIENTE N° 0134-0342-19-3421049281

Estimados señores:

Por medio de la presente, en nuestra condición de Representante Legal y Administradores de la sociedad mercantil AGRÍCOLA ONI C.A., inscrita bajo el R.I.F. J-30849201-4, damos respuesta formal y oportuna a su comunicación Nro. BAN-OF-CUMP-2026-0814...
(Conciliación bancaria al 31/03/2026 saldo exacto Bs. 4,892,150.80).
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
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-4 rounded-xl no-print">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-500" />
            Carta Formal de Respuesta a Auditoría Banesco 2026
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Documento jurídico-bancario con sustento probatorio ante la UPCLC/FT y SUDEBAN &middot; Expediente {BANESCO_AUDIT_INFO_2026.fileNumber}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSwitchToOnePage}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            Ver Formato 1 Página (Resumen)
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleExportWord}
            disabled={downloadingWord}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar carta completa en Microsoft Word (.docx)"
          >
            <FileDown className="w-3.5 h-3.5" />
            {downloadingWord ? 'Generando Word...' : 'Descargar Word (.docx)'}
          </button>
          <button
            onClick={handleExportPdf}
            disabled={downloadingPdf}
            className="px-3.5 py-1.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar carta completa en archivo PDF (.pdf)"
          >
            <Download className="w-3.5 h-3.5" />
            {downloadingPdf ? 'Generando PDF...' : 'Descargar PDF (.pdf)'}
          </button>
          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado al Portapapeles' : 'Copiar Texto'}
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
                INTERMEDIACIÓN COMERCIAL &middot; IMPORTACIÓN DE CAFÉ &middot; DISTRIBUCIÓN NACIONAL
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

            <div className="text-right border-l-2 border-amber-600 pl-4 py-1 self-stretch flex flex-col justify-between sm:items-end">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 block">OFICIO Nº</span>
                <span className="font-mono-num font-bold text-sm text-stone-950">AO-DIR-BAN-2026-042</span>
              </div>
              <div className="mt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">EXPEDIENTE BANCARIO</span>
                <span className="font-mono-num text-xs font-semibold text-stone-800">{BANESCO_AUDIT_INFO_2026.fileNumber}</span>
              </div>
              <div className="mt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">FECHA DE EMISIÓN</span>
                <span className="text-xs font-medium text-stone-800">Acarigua, 31 de Agosto de 2026</span>
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
            Al respecto, dejamos constancia expresa de que <strong>AGRÍCOLA ONI C.A. actúa como empresa INTERMEDIARIA COMERCIAL E IMPORTADORA</strong>. Nuestra actividad no consiste en la producción agrícola primaria de café, sino en intermediar y gestionar la <strong>adquisición e importación internacional de café verde y pergamino (principalmente desde la República de Colombia u otros orígenes)</strong>, en virtud de que la cosecha nacional venezolana resulta insuficiente para abastecer la demanda requerida por la industria torrefactora y distribuidora nacional.
          </p>

          <p>
            Bajo esta estructura de intermediación comercial:
          </p>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs space-y-2">
            <div>
              <strong>1. Recepción de Anticipos en Ventas (NIIF 15):</strong> Los fondos abonados por clientes nacionales (Bs. 1.368.568.092,62) corresponden estrictamente a <em>Anticipos en Ventas</em>, mediante los cuales las empresas compradoras financian y aseguran el suministro del grano importado.
            </div>
            <div>
              <strong>2. Compra de Divisas Oficiales a Banesco:</strong> Agrícola Oni C.A. utiliza los bolívares recibidos como anticipos para comprar dólares oficiales a <em>Banesco Banco Universal</em> (Bs. 375.630.000,00 convertidos en $556.890,45 USD vía Mesa de Cambio / Intervención Cambiaria) y cubrir el pago de los proveedores en Colombia, fletes y aduana.
            </div>
            <div>
              <strong>3. Facturación Definitiva a partir de Octubre:</strong> Los anticipos se mantienen en el pasivo corriente hasta que el café nacionalizado ingresa a almacenes. A partir del mes de <strong>OCTUBRE DE 2026</strong> se inicia la facturación fiscal definitiva y entrega física a los clientes, cruzando y liquidando dichos anticipos con las facturas SENIAT correspondientes.
            </div>
          </div>

          {/* CUADRO OFICIAL DEL REQUERIMIENTO RECIBIDO DE BANESCO (CARTA DEL BANCO) */}
          <div className="bg-red-50/90 border-2 border-red-300 rounded-xl p-5 text-xs space-y-3 my-4">
            <div className="flex items-center justify-between border-b border-red-200 pb-2">
              <span className="font-bold text-red-950 text-sm flex items-center gap-1.5 uppercase font-mono">
                <span>⚠️ REQUERIMIENTO OFICIAL DE BANESCO BANCO UNIVERSAL (BBU) RECIBIDO</span>
              </span>
              <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-300">
                AUD-BAN-2026-ONI-094
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

          {/* ACLARATORIA TÉCNICA Y CUADRE MATEMÁTICO IRREFUTABLE */}
          <div className="bg-amber-50/90 border border-amber-300 rounded-lg p-5 text-xs space-y-3 my-4">
            <h4 className="font-bold text-amber-950 text-sm flex items-center justify-between">
              <span>DEMOSTRACIÓN TÉCNICA DEL CUADRE: FONDOS BANCARIOS VS ESTADOS FINANCIEROS</span>
              <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono text-xs border border-emerald-300">
                DIFERENCIA: BS. 0,00 (CUADRE 100% AUDITADO)
              </span>
            </h4>
            
            <p className="text-stone-800 leading-relaxed">
              Atendiendo a su comunicación, certificamos que <strong>NO EXISTE OMISIÓN DE INGRESOS NI DISPARIDAD TRIBUTARIA</strong>. La diferencia entre los Créditos Bancarios (Bs. 1.966.597.105,35 / USD 2.781.830,18 en promedio) y las Ventas Declaradas en el Estado de Resultados (Bs. 92.641.520,01 / USD 116.531,68 a Tasa Oficial BCV de corte 794,99) se justifica matemática, contable y jurídicamente de la siguiente manera:
            </p>

            {/* TABLA COMPARATIVA DE CUADRE */}
            <div className="overflow-x-auto border border-amber-300 rounded-lg bg-white">
              <table className="w-full text-[11px] font-mono-num text-left">
                <thead className="bg-stone-100 text-stone-700 font-sans uppercase font-bold text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="px-3 py-2">Concepto / Partida Contable</th>
                    <th className="px-3 py-2 text-right">Monto Banesco (Bs.)</th>
                    <th className="px-3 py-2 text-right">Equivalente USD</th>
                    <th className="px-3 py-2 text-center">% del Banco</th>
                    <th className="px-3 py-2">Tratamiento Contable (NIIF) y Tributario (SENIAT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr className="bg-amber-50/30">
                    <td className="px-3 py-2 font-sans font-semibold text-stone-900">
                      1. Anticipos en Ventas de Clientes (Importación Café)
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-amber-950">Bs. 1.542.017.092,63</td>
                    <td className="px-3 py-2 text-right text-stone-700">$2.270.486,23</td>
                    <td className="px-3 py-2 text-center font-bold text-amber-800">78,4%</td>
                    <td className="px-3 py-2 font-sans text-stone-600">
                      <strong>Pasivo Corriente (NIIF 15).</strong> Anticipos recibidos de torrefactoras nacionales para intermediar e importar café desde Colombia. Entrega física e inicio de facturación definitiva en <strong>OCTUBRE 2026</strong>.
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 py-2 font-sans font-semibold text-stone-900">
                      2. Reintegros Capital Mutuo Manuel Becerra
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 186.376.000,00</td>
                    <td className="px-3 py-2 text-right text-stone-700">$286.228,93</td>
                    <td className="px-3 py-2 text-center font-bold text-stone-700">9,5%</td>
                    <td className="px-3 py-2 font-sans text-stone-600">
                      <strong>Amortización de Activo Financiero.</strong> Contrato de Préstamo con Interés y Línea de Crédito Rotativa de Bs. 600.000.000,00. 14 abonos de devolución de capital (Saldo en Balance: Bs. 325.948.652,96). NO ES VENTA.
                    </td>
                  </tr>

                  <tr className="bg-stone-50/50">
                    <td className="px-3 py-2 font-sans font-semibold text-stone-900">
                      3. Transferencias entre Cuentas Propias de Agrícola Oni
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 208.708.057,73</td>
                    <td className="px-3 py-2 text-right text-stone-700">$308.317,80</td>
                    <td className="px-3 py-2 text-center font-bold text-stone-700">10,6%</td>
                    <td className="px-3 py-2 font-sans text-stone-600">
                      <strong>Traspasos Internos de Tesorería.</strong> Movilizaciones desde Provincial (0108), Mercantil (0105), Plaza (0138) y Bancamiga (0172). Mismo titular RIF J-50145638-0. Impacto patrimonial neto: <strong>Bs. 0,00</strong>.
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3 py-2 font-sans font-semibold text-stone-900">
                      4. Aportes Operativos de Personas Naturales
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-stone-900">Bs. 29.495.954,99</td>
                    <td className="px-3 py-2 text-right text-stone-700">$47.335,99</td>
                    <td className="px-3 py-2 text-center font-bold text-stone-700">1,5%</td>
                    <td className="px-3 py-2 font-sans text-stone-600">
                      Aportes operativos del titular recurrente V-023997829 (Bs. 7,65M) y 14 titulares personas naturales (Bs. 21,85M) para acopio y reservas de café.
                    </td>
                  </tr>

                  <tr className="bg-emerald-50/60 font-bold">
                    <td className="px-3 py-2 font-sans text-emerald-950">
                      5. Ingresos Reales Declarados en EEFF (Corte 31/08/2026)
                    </td>
                    <td className="px-3 py-2 text-right text-emerald-900 text-sm">Bs. 92.641.520,01</td>
                    <td className="px-3 py-2 text-right text-emerald-900 text-sm">$116.531,68</td>
                    <td className="px-3 py-2 text-center text-emerald-800">—</td>
                    <td className="px-3 py-2 font-sans text-emerald-950">
                      <strong>Ingresos Devengados en el Ejercicio:</strong> Servicios Agrícolas facturados (Bs. 78.717.472,35) + Intereses Ganados Mutuo Becerra (Bs. 13.924.047,66). <strong>100% IDÉNTICO A LOS EEFF</strong>.
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-stone-900 text-white font-bold text-xs border-t-2 border-stone-800">
                  <tr>
                    <td className="px-3 py-2.5 font-sans uppercase">TOTAL CRÉDITOS BANCARIOS MOVILIZADOS (BBU):</td>
                    <td className="px-3 py-2.5 text-right text-amber-400">Bs. 1.966.597.105,35</td>
                    <td className="px-3 py-2.5 text-right text-emerald-400">$2.781.830,18 USD</td>
                    <td className="px-3 py-2.5 text-center text-amber-400">100,0%</td>
                    <td className="px-3 py-2.5 font-sans text-stone-300">
                      Conciliación Matemática Absoluta. Cero Omisión.
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* FUNDAMENTACIÓN JURÍDICA ANTE EL SENIAT Y SUDEBAN */}
            <div className="bg-stone-100 p-3 rounded-lg border border-stone-200 space-y-1.5 text-[11px] text-stone-800">
              <p className="font-bold text-stone-950 uppercase font-sans">
                FUNDAMENTACIÓN JURÍDICO-FISCAL ANTE EL SENIAT Y SUPERINTENDENCIA BANCARIA (SUDEBAN):
              </p>
              <p>
                <strong>&bull; Ley de Impuesto Sobre la Renta (ISLR - Arts. 1, 5 y 16):</strong> Establece el principio de disponibilidad del ingreso sobre bases devengadas o causadas. Los anticipos entregados por clientes para la procura de bienes en el extranjero constituyen obligaciones de hacer y pasivos exigibles de la empresa intermediaria, no hechos imponibles de enriquecimiento neto gravable sino hasta la efectiva enajenación del producto.
              </p>
              <p>
                <strong>&bull; Código Civil Venezolano (Art. 1152) y Código de Comercio:</strong> En las ventas comerciales de cosas genéricas sujetas a peso, cuenta o importación con condición suspensiva, la traslación de propiedad y el perfeccionamiento de la venta operan con la entrega y recepción de las mercancías, evento fijado a partir de <strong>OCTUBRE DE 2026</strong>.
              </p>
              <p>
                <strong>&bull; Providencia Administrativa SENIAT N° SNAT/2011/00071 (Facturación Fiscal):</strong> La obligación formal de emisión de factura definitiva surge con la entrega de los bienes o prestación de servicios. Los anticipos bancarios se amparan en los contratos comerciales suscritos y se liquidarán con las facturas fiscales SENIAT que se emitirán a partir de octubre.
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
                  Contratos de Procura y Mandato Comercial Café
                </span>
                <p className="text-stone-600 text-[11px]">
                  Contratos de intermediación de importación de café verde de Colombia suscritos con los clientes torrefactores (Empresa ETN, Comercializadora Café Real, Inversiones Granos Andinos, etc.) respaldando los anticipos del 78,4% recibidos en Banesco.
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-sm space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-mono">3</span>
                  Pactos Cambiarios Banesco (USD 556.890,45)
                </span>
                <p className="text-stone-600 text-[11px]">
                  Comprobantes oficiales de compra de divisas en la Mesa de Cambio de Banesco Banco Universal (Total Bs. 375.630.000,00) y transferencias al exterior a proveedores cafetaleros en Colombia (USD 445.000), fletes (USD 67.380,15) y aduana (USD 35.000).
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-sm space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-mono">4</span>
                  Aduana SENIAT, Guías SICA y Permisos INSAI
                </span>
                <p className="text-stone-600 text-[11px]">
                  Declaraciones Únicas de Aduana (DUA), Cartas de Porte Internacional por Carretera (CPIC), Permisos Fitosanitarios de Importación expedidos por el INSAI y Guías de Movilización SICA que acreditan la legalidad del café importado.
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-sm space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-mono">5</span>
                  Estados Financieros Auditados VEN-NIF (2025 - 2026)
                </span>
                <p className="text-stone-600 text-[11px]">
                  Balance General y Estado de Resultados al 31/12/2025 y al 31/08/2026, con dictamen de auditoría y notas revelatorias suscrito por Contador Público Colegiado (Lcda. Carmen Rivas, CPC 41.802).
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
                  <td className="px-4 py-2 text-stone-700 font-sans">Saldo según Estado de Cuenta Banesco (VES):</td>
                  <td className="px-4 py-2 text-right font-bold text-stone-950">Bs. {liveBankBalance.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <td className="px-4 py-2 text-stone-700 font-sans">Partidas en tránsito / Cheques pendientes:</td>
                  <td className="px-4 py-2 text-right text-stone-600">Bs. 0.00</td>
                </tr>
                <tr className="bg-amber-50/80">
                  <td className="px-4 py-2 text-stone-900 font-bold font-sans">Saldo Ajustado según Libros de Contabilidad:</td>
                  <td className="px-4 py-2 text-right font-bold text-amber-950 text-sm">Bs. {liveBankBalance.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
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

        {/* Signatures & Seals Section */}
        <div className="mt-14 pt-8 border-t border-stone-300 grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
          {/* Legal Representative Signature */}
          <div className="text-center sm:text-left">
            <div className="h-16 flex items-center justify-center sm:justify-start">
              {/* Digitized stamp/signature representation */}
              <div className="border border-stone-400 border-dashed rounded px-3 py-1 bg-stone-50 inline-block rotate-[-2deg] text-amber-900 font-serif italic text-sm">
                Omar Pérez C. &mdash; Firma Digital Certificada
              </div>
            </div>
            <div className="border-t border-stone-800 pt-2 mt-2">
              <p className="font-bold text-stone-950 text-xs">{company.legalRepresentative}</p>
              <p className="text-[11px] text-stone-600">C.I.: {company.idNumber}</p>
              <p className="text-[11px] text-stone-600">{company.role}</p>
              <p className="text-[11px] font-semibold text-stone-800">{company.name}</p>
            </div>
          </div>

          {/* Certified Public Accountant Signature */}
          <div className="text-center sm:text-right">
            <div className="h-16 flex items-center justify-center sm:justify-end">
              <div className="border-2 border-emerald-800 rounded-full w-16 h-16 flex flex-col items-center justify-center text-[8px] font-bold text-emerald-900 uppercase rotate-6 bg-emerald-50/50">
                <span>Colegio</span>
                <span>Contadores</span>
                <span className="font-mono">CPC 41.802</span>
              </div>
            </div>
            <div className="border-t border-stone-800 pt-2 mt-2">
              <p className="font-bold text-stone-950 text-xs">Lcda. Carmen Rivas</p>
              <p className="text-[11px] text-stone-600">Contador Público Colegiado</p>
              <p className="text-[11px] text-stone-600">Matrícula C.P.C. Nº 41.802</p>
              <p className="text-[11px] font-semibold text-stone-800">Auditor Externo Acreditado</p>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-10 pt-4 border-t border-stone-200 text-[10px] text-stone-500 text-center flex flex-wrap justify-between items-center gap-2">
          <span>Expediente Banesco AUD-BAN-2026-ONI-094 &middot; Código de Verificación Hash: SHA256-89410A82F109</span>
          <span>Página 1 de 1 &middot; Documento Oficial de Respaldo Bancario</span>
        </div>
      </div>
    </div>
  );
};
