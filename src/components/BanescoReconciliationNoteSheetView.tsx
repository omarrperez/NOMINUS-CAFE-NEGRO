import React, { useState } from 'react';
import {
  Printer,
  FileDown,
  Download,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Stamp,
  Award,
  Loader2,
  ArrowRight,
  Calculator,
  HelpCircle
} from 'lucide-react';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import { BANESCO_CREDITS_ORIGIN_AND_RECONCILIATION_2026, BANESCO_AUDIT_INFO_2026 } from '../data/agricolaOniAudit2026Data';
import { downloadNativeDocx, downloadElementAsPdf } from '../utils/exportUtils';
import * as XLSX from 'xlsx';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
  onNavigateToAuditSheet?: () => void;
}

export const BanescoReconciliationNoteSheetView: React.FC<Props> = ({
  company,
  currentRate,
  onNavigateToAuditSheet
}) => {
  const [downloadingWord, setDownloadingWord] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const data = BANESCO_CREDITS_ORIGIN_AND_RECONCILIATION_2026;

  // Print handle
  const handlePrint = () => {
    window.print();
  };

  // Export Excel specifically for this reconciliation sheet
  const handleExportExcel = () => {
    try {
      setDownloadingExcel(true);
      const wb = XLSX.utils.book_new();

      // Sheet 1: Resumen de Conciliación Consolidada
      const summaryRows = [
        ['AGRÍCOLA ONI, C.A. - RIF: J-50145638-0'],
        ['NOTA TÉCNICA Y HOJA DE CONCILIACIÓN DE ABONOS BANCARIOS - BANESCO 2026'],
        ['Período: Enero a Agosto 2026 | Referencia: BAN-OF-CUMP-2026-0814'],
        [''],
        ['Partida de Conciliación / Concepto de Tesorería', 'Monto Acumulado (USD)', 'Promedio Mensual (USD)', 'Clasificación / Sustento Contable'],
        [
          '(+) 1. Abonos Brutos Totales Registrados en Libros',
          data.accumulatedGrossTotalUSD,
          data.grossMonthlyAverageUSD,
          'Ingresos brutos por anticipos + traspasos + aportes'
        ],
        [
          '(-) 2. Cuentas por Pagar Socios - Aportes del Accionista Propietario (Elias Rafael Trías Abreu C.I. V-14.892.301)',
          -378687.92,
          -47335.99,
          'Aportes de liquidez del Presidente y accionista mayoritario para compra de café (VEN-NIF)'
        ],
        [
          '(-) 3. Transferencias Neutras Internas (Provincial/Mercantil/Bancamiga/Plaza)',
          -308317.84,
          -38539.73,
          'Traspasos entre cuentas de la misma titularidad para Mesa de Cambio BBU'
        ],
        [
          '(-) 4. Revaluación Cambiaria y Ajuste Tasa Ponderada BBU vs BCV',
          -357304.40,
          -44663.05,
          'Diferencial por tipo de cambio ponderado diario BCV vs Cierre Banesco'
        ],
        [
          '(=) CRÉDITOS BANCARIOS OPERATIVOS NETOS EN BANESCO',
          data.accumulatedNetBanescoUSD,
          data.netBanescoMonthlyAverageUSD,
          'Monto Exacto Movilizado y Reportado por Banesco Banco Universal'
        ],
        [''],
        ['OBSERVACIÓN AUDITORÍA BANCARIA:'],
        ['La cifra reportada por Banesco de USD 2.781.830,18 promediados mensualmente cuadra al 100%'],
        ['una vez deducidos los aportes del accionista propietario, traspasos de tesorería y diferencial cambiario.']
      ];

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Conciliación Consolidada');

      // Sheet 2: Desglose Mes a Mes
      const monthlyHeaders = [
        'Mes',
        'Anticipos Clientes Persona Jurídica (USD)',
        'Crédito Manuel Becerra (USD)',
        'Personas Naturales (USD)',
        'Traspasos Internos Tesorería (USD)',
        'Aportes Accionista Propietario (USD)',
        'Dif. Valuación Cambiaria (USD)',
        'Abono Bruto Libros (USD)',
        'Crédito Neto Banesco (USD)'
      ];

      const monthlyDataRows = data.breakdownMonthly.map((m) => [
        m.monthName,
        m.customerAdvancesUSD,
        m.becerraCreditUSD,
        m.naturalPersonsUSD,
        m.internalTransfersUSD,
        m.eliasTriasSocioUSD,
        m.exchangeDiffUSD,
        m.grossTotalUSD,
        m.netBanescoUSD
      ]);

      const wsMonthly = XLSX.utils.aoa_to_sheet([
        ['AGRÍCOLA ONI, C.A. - COMPOSICIÓN Y CONCILIACIÓN DE ABONOS MENSUALES (ENERO - AGOSTO 2026)'],
        [''],
        monthlyHeaders,
        ...monthlyDataRows
      ]);

      XLSX.utils.book_append_sheet(wb, wsMonthly, 'Desglose Mensual Banesco');

      XLSX.writeFile(wb, 'Nota_Conciliacion_Abonos_Banesco_2026_Agricola_Oni.xlsx');
    } catch (err) {
      console.error('Error al exportar Excel:', err);
    } finally {
      setTimeout(() => setDownloadingExcel(false), 600);
    }
  };

  // Export Native Docx
  const handleExportWord = async () => {
    try {
      setDownloadingWord(true);
      await downloadNativeDocx('Nota_Conciliacion_Bancos_Banesco_Agricola_Oni.docx', {
        companyName: 'AGRÍCOLA ONI, C.A.',
        companyRif: 'J-50145638-0',
        title: 'NOTA TÉCNICA DE AUDITORÍA CONTABLE Y CONCILIACIÓN BANCARIA',
        subtitle: 'Justificación del Cuadre Matemático de Créditos Movilizados en Banesco (Promedio USD 2.781.830,18/mes) vs Abonos en Libros (Promedio USD 2.912.368,95/mes)',
        fileReference: 'Ref: BAN-NOTA-CONC-2026-0814',
        date: '12 de Octubre de 2026',
        addressee: [
          'BANESCO BANCO UNIVERSAL, C.A.',
          'Gerencia de Prevención y Control de Legitimación de Capitales (UPCLC/FT)',
          'Subgerencia de Riesgo Cambiario y Mesa de Moneda Extranjera'
        ],
        paragraphs: [
          'Mediante la presente nota explicativa de auditoría y tesorería, la gerencia de AGRÍCOLA ONI, C.A. rinde formal justificación sobre la estructura de fondos movilizados en la cuenta corriente Banesco durante el período Enero a Agosto de 2026.',
          'El análisis efectuado por nuestro departamento contable en conjunto con la auditoría externa del CPC ratifica la concordancia absoluta de las cifras reportadas por Banesco de USD 2.781.830,18 promediados por mes, previa depuración de partidas de tesorería y aportes de accionistas.',
          '1. REGISTRO DE CUENTAS POR PAGAR SOCIOS (ELIAS RAFAEL TRÍAS ABREU C.I. V-14.892.301):\nLos aportes inyectados por el Presidente y accionista principal Elias Rafael Trías Abreu (C.I. V-14.892.301) por un monto total de USD 378.687,92 (promedio de USD 47.335,99/mes) para financiar la logística de acopio de café pergamino en el campo no constituyen ingresos por ventas, sino pasivos patrimoniales registrados bajo la cuenta "Cuentas por Pagar Socios" según la norma VEN-NIF.',
          '2. TRASPASOS DE TESORERÍA ENTRE CUENTAS PROPIAS:\nSe identificaron transferencias por USD 308.317,84 (promedio USD 38.539,73/mes) entre cuentas corrientes de la misma sociedad mercantil (Provincial, Mercantil, Bancamiga, Plaza) para concentrar fondos en Banesco destinados a la adjudicación de divisas en la Mesa de Cambio. Dichas operaciones tienen efecto patrimonial neutro.',
          '3. AJUSTE POR DIFERENCIAL DE VALUACIÓN CAMBIARIA:\nExiste una variación técnica de USD 357.304,40 (promedio USD 44.663,05/mes) generada por el calce entre la tasa oficial diaria fijada por el Banco Central de Venezuela (BCV) al momento de cada registro contable y la tasa de cierre ponderada aplicada por Banesco en su sistema de movimientos de Mesa de Cambio.'
        ],
        highlightBox: 'RESUMEN DE CONCILIACIÓN:\n(+) Abonos Brutos Libros: USD 23.298.951,60 (Prom: USD 2.912.368,95/mes)\n(-) Cuentas por Pagar Socios: -USD 378.687,92 (Prom: -USD 47.335,99/mes)\n(-) Transferencias Neutras: -USD 308.317,84 (Prom: -USD 38.539,73/mes)\n(-) Diferencial Cambiario: -USD 357.304,40 (Prom: -USD 44.663,05/mes)\n(=) Créditos Operativos Netos Banesco: USD 22.254.641,44 (Prom: USD 2.781.830,18/mes) -> CUADRE PERFECTO 100%',
        table: {
          headers: ['Mes', 'Abono Bruto Libros (USD)', 'Aportes Socio ($)', 'Transf. Propias ($)', 'Dif. Cambiario ($)', 'Neto Banesco (USD)'],
          rows: data.breakdownMonthly.map((m) => [
            m.monthName,
            `$${m.grossTotalUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`,
            `$${m.eliasTriasSocioUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`,
            `$${m.internalTransfersUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`,
            `$${m.exchangeDiffUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`,
            `$${m.netBanescoUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
          ])
        },
        signers: [
          { name: 'Elias Rafael Trías Abreu', title: 'Presidente / Propietario', idNumber: 'C.I. V-14.892.301' },
          { name: 'Licdo. Omar Pérez Castillo', title: 'Contador Público Colegiado', idNumber: 'C.P.C. N° 16.336' }
        ]
      });
    } catch (err) {
      console.error('Error exportando Word:', err);
    } finally {
      setDownloadingWord(false);
    }
  };

  // Export PDF
  const handleExportPdf = async () => {
    try {
      setDownloadingPdf(true);
      await downloadElementAsPdf('nota-conciliacion-banesco-paper', 'Nota_Conciliacion_Banesco_Agricola_Oni.pdf');
    } catch (err) {
      console.error('Error exportando PDF:', err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header Bar (No-Print) */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4 no-print text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Nota Explicativa de Conciliación Bancaria Banesco
              </h2>
              <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                GUARDADA PERMANENTE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Hoja oficial calibrada para auditorías de cumplimiento, expediente Banesco y revisiones futuras de SUDEBAN.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToAuditSheet && (
            <button
              onClick={onNavigateToAuditSheet}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-400" />
              <span>Ver Matriz en Auditoría</span>
            </button>
          )}

          <button
            onClick={handleExportExcel}
            disabled={downloadingExcel}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar Hoja de Cálculo Excel (.xlsx)"
          >
            {downloadingExcel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportWord}
            disabled={downloadingWord}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar documento editable Word (.docx)"
          >
            {downloadingWord ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
            <span>Word (.docx)</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={downloadingPdf}
            className="px-3.5 py-1.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar PDF imprimible"
          >
            {downloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>PDF (.pdf)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Imprimir documento oficial en papel"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Hoja</span>
          </button>
        </div>
      </div>

      {/* Official Paper Sheet Area */}
      <div className="flex justify-center">
        <div
          id="nota-conciliacion-banesco-paper"
          className="bg-white text-slate-900 border border-slate-300 rounded-none shadow-2xl p-8 sm:p-12 max-w-4xl w-full font-serif text-sm leading-relaxed tracking-normal relative print:p-0 print:border-none print:shadow-none print:max-w-none"
        >
          {/* Paper Header / Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-slate-900" />
                <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 font-sans">
                  {company.name}
                </h1>
              </div>
              <p className="text-xs font-sans text-slate-700 mt-1 font-semibold">
                R.I.F.: {company.rif} &middot; INTERMEDIACIÓN COMERCIAL Y COMPRA DE CAFÉ NACIONAL
              </p>
              <p className="text-[11px] font-sans text-slate-600">
                Sector Pan de Azúcar, Carretera Sanare - El Tocuyo, Edo. Lara, Venezuela
              </p>
            </div>

            <div className="text-right font-sans shrink-0">
              <span className="inline-block bg-slate-100 border border-slate-300 text-slate-800 text-xs px-3 py-1 font-bold font-mono rounded">
                REF: BAN-NOTA-CONC-2026-0814
              </span>
              <p className="text-xs text-slate-600 mt-1 font-semibold">
                Fecha de Emisión: 12 de Octubre de 2026
              </p>
              <p className="text-[10px] text-emerald-800 font-mono font-bold mt-0.5">
                EXPEDIENTE BANESCO &middot; VERIFICADO
              </p>
            </div>
          </div>

          {/* Addressee Section */}
          <div className="mb-6 font-sans text-xs space-y-1 bg-slate-50 p-4 border border-slate-200 rounded">
            <p className="font-bold text-slate-900 uppercase">Señores:</p>
            <p className="font-bold text-slate-900 text-sm">BANESCO BANCO UNIVERSAL, C.A.</p>
            <p className="text-slate-700 font-medium">
              Atención: Gerencia de Prevención y Control de Legitimación de Capitales (UPCLC/FT)
            </p>
            <p className="text-slate-700 font-medium">
              Subgerencia de Riesgo Cambiario y Mesa de Moneda Extranjera
            </p>
            <p className="text-slate-600 italic">Oficina Principal / Agencia Acarigua - Araure, Edo. Portuguesa</p>
          </div>

          {/* Document Subject Title */}
          <div className="mb-6 text-center border-y border-slate-300 py-3 bg-slate-100/60 font-sans">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              NOTA TÉCNICA DE AUDITORÍA CONTABLE Y CONCILIACIÓN DE ABONOS BANCARIOS
            </h2>
            <p className="text-xs text-slate-700 font-semibold mt-1">
              Justificación del Cuadre Perfecto entre el Promedio Mensual Movilizado en Banesco (USD 2.781.830,18) y los Abonos Brutos en Libros (USD 2.912.368,95)
            </p>
          </div>

          {/* Statement Paragraphs */}
          <div className="space-y-4 text-xs leading-relaxed text-slate-800 text-justify">
            <p>
              Mediante la presente nota explicativa y hoja de cálculo de conciliación contable, la Junta Directiva y la Gerencia de Finanzas de <strong>AGRÍCOLA ONI, C.A. (RIF: {company.rif})</strong> presenta ante Banesco Banco Universal, C.A. el análisis cualitativo y cuantitativo que justifica la concordancia matemática absoluta de los créditos bancarios movilizados en la cuenta corriente N° <span className="font-mono font-semibold">{company.banescoAccountVES}</span> durante el período correspondiente de <strong>Enero a Agosto de 2026</strong>.
            </p>

            <p>
              Según las comunicaciones de auditoría bancaria, el promedio mensual de créditos movilizados por la empresa en Banesco asciende a <strong>USD 2.781.830,18</strong> (acumulando <strong>USD 22.254.641,44</strong> en los 8 meses analizados). Al contrastar dicha cifra con la matriz bruta de abonos contables registrada en nuestros libros (USD 2.912.368,95 promedio mensual / USD 23.298.951,60 total), surge una diferencia aparente de <strong>USD 130.538,77 mensuales</strong> (USD 1.044.310,16 acumulados).
            </p>

            <p>
              A continuación se detalla la reestructuración y conciliación matemática aprobada por nuestro Contador Público Colegiado (CPC), donde se demuestra que dicha brecha responde exclusivamente a tres (3) partidas de tesorería y patrimonio legalmente justificadas:
            </p>
          </div>

          {/* Summary Reconciliation Box */}
          <div className="my-6 font-sans border-2 border-slate-800 bg-slate-50 p-3.5 sm:p-5 rounded-lg overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-300 pb-2.5 mb-3 gap-2">
              <span className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-800 shrink-0" />
                Matriz de Conciliación Consolidada (Enero - Agosto 2026)
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold bg-slate-800 text-white px-2 py-0.5 rounded shrink-0 self-start sm:self-auto">
                Valores en USD Convertidos al BCV
              </span>
            </div>

            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full text-[11px] sm:text-xs text-left border-collapse min-w-[480px]">
                <thead>
                  <tr className="border-b-2 border-slate-400 text-slate-900 bg-slate-200/90 font-bold">
                    <th className="py-2.5 px-2 font-bold w-[45%] text-slate-900">Concepto / Partida de Tesorería</th>
                    <th className="py-2.5 px-2 text-right font-bold whitespace-nowrap w-[23%] text-slate-900">Acumulado 8M (USD)</th>
                    <th className="py-2.5 px-2 text-right font-bold whitespace-nowrap w-[22%] text-slate-900">Promedio Mensual (USD)</th>
                    <th className="py-2.5 px-2 text-center font-bold whitespace-nowrap w-[10%] text-slate-900">% Part.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono text-[11px] sm:text-xs">
                  <tr className="bg-white hover:bg-slate-100/60 transition-colors">
                    <td className="py-2 px-2.5 font-sans font-bold text-slate-900">
                      (+) 1. Abonos Brutos Totales Registrados en Libros
                    </td>
                    <td className="py-2 px-2.5 text-right font-bold text-slate-900 whitespace-nowrap">
                      $23.298.951,60
                    </td>
                    <td className="py-2 px-2.5 text-right font-bold text-slate-900 whitespace-nowrap">
                      $2.912.368,95
                    </td>
                    <td className="py-2 px-2.5 text-center font-sans font-bold text-slate-700 whitespace-nowrap">100,0%</td>
                  </tr>
                  <tr className="bg-amber-50/60 hover:bg-amber-50 transition-colors">
                    <td className="py-2 px-2.5 font-sans text-slate-800">
                      (-) 2. Cuentas por Pagar Socios (Elias Rafael Trías Abreu C.I. V-14.892.301)
                    </td>
                    <td className="py-2 px-2.5 text-right text-amber-900 font-semibold whitespace-nowrap">
                      -$378.687,92
                    </td>
                    <td className="py-2 px-2.5 text-right text-amber-900 font-semibold whitespace-nowrap">
                      -$47.335,99
                    </td>
                    <td className="py-2 px-2.5 text-center font-sans font-bold text-amber-900 whitespace-nowrap">-1,6%</td>
                  </tr>
                  <tr className="bg-blue-50/60 hover:bg-blue-50 transition-colors">
                    <td className="py-2 px-2.5 font-sans text-slate-800">
                      (-) 3. Transferencias Neutras Internas (Provincial/Mercantil/Bancamiga/Plaza)
                    </td>
                    <td className="py-2 px-2.5 text-right text-blue-900 font-semibold whitespace-nowrap">
                      -$308.317,84
                    </td>
                    <td className="py-2 px-2.5 text-right text-blue-900 font-semibold whitespace-nowrap">
                      -$38.539,73
                    </td>
                    <td className="py-2 px-2.5 text-center font-sans font-bold text-blue-900 whitespace-nowrap">-1,3%</td>
                  </tr>
                  <tr className="bg-purple-50/60 hover:bg-purple-50 transition-colors">
                    <td className="py-2 px-2.5 font-sans text-slate-800">
                      (-) 4. Revaluación Cambiaria y Valuación Tasa Ponderada BBU vs BCV
                    </td>
                    <td className="py-2 px-2.5 text-right text-purple-900 font-semibold whitespace-nowrap">
                      -$357.304,40
                    </td>
                    <td className="py-2 px-2.5 text-right text-purple-900 font-semibold whitespace-nowrap">
                      -$44.663,05
                    </td>
                    <td className="py-2 px-2.5 text-center font-sans font-bold text-purple-900 whitespace-nowrap">-1,5%</td>
                  </tr>
                  <tr className="bg-emerald-100/90 font-bold border-t-2 border-slate-900">
                    <td className="py-2.5 px-2.5 font-sans text-emerald-950 uppercase font-bold">
                      (=) CRÉDITOS BANCARIOS OPERATIVOS NETOS EN BANESCO
                    </td>
                    <td className="py-2.5 px-2.5 text-right text-emerald-950 text-xs sm:text-sm font-extrabold whitespace-nowrap">
                      $22.254.641,44
                    </td>
                    <td className="py-2.5 px-2.5 text-right text-emerald-950 text-xs sm:text-sm font-extrabold whitespace-nowrap">
                      $2.781.830,18
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-sans text-emerald-950 font-extrabold whitespace-nowrap bg-emerald-200/60 rounded">95,5%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-[11px] text-emerald-900 bg-emerald-50 border border-emerald-300 p-2 rounded flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>RESULTADO CONCLUYENTE:</strong> El saldo neto operativo ajustado de <strong>USD 2.781.830,18/mes</strong> coincide al 100,00% con la cifra observada por la auditoría de Banesco.
              </span>
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="my-6 font-sans border border-slate-300 rounded-lg bg-white p-3.5 shadow-sm overflow-hidden">
            <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1.5 mb-2.5 flex items-center justify-between flex-wrap gap-1">
              <span>Cuadro Desglosado Mes a Mes (Enero a Agosto 2026)</span>
              <span className="text-[10px] text-slate-600 font-mono font-semibold">Cifras en USD a Tasa Oficial BCV</span>
            </h3>

            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full text-[10px] sm:text-[11px] text-left border-collapse border border-slate-300 min-w-[620px]">
                <thead>
                  <tr className="bg-slate-800 text-white font-bold text-[10px]">
                    <th className="p-1.5 border border-slate-700 whitespace-nowrap text-center">Mes</th>
                    <th className="p-1.5 border border-slate-700 text-right whitespace-nowrap">Anticipos P. Jurídicas</th>
                    <th className="p-1.5 border border-slate-700 text-right whitespace-nowrap">Créd. Becerra</th>
                    <th className="p-1.5 border border-slate-700 text-right whitespace-nowrap">P. Naturales</th>
                    <th className="p-1.5 border border-slate-700 text-right whitespace-nowrap">Trasp. Propios</th>
                    <th className="p-1.5 border border-slate-700 text-right text-amber-300 whitespace-nowrap">Aportes Socio</th>
                    <th className="p-1.5 border border-slate-700 text-right whitespace-nowrap">Abono Bruto Libros</th>
                    <th className="p-1.5 border border-slate-700 text-right text-emerald-300 whitespace-nowrap">Neto Banesco</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[10px]">
                  {data.breakdownMonthly.map((m, idx) => (
                    <tr key={m.month} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-1.5 border border-slate-300 font-sans font-bold text-slate-900 text-center whitespace-nowrap">
                        {m.monthName}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-right whitespace-nowrap">
                        ${m.customerAdvancesUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-right whitespace-nowrap">
                        ${m.becerraCreditUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-right whitespace-nowrap">
                        ${m.naturalPersonsUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-right text-slate-600 whitespace-nowrap">
                        ${m.internalTransfersUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-right font-bold text-amber-900 bg-amber-50/50 whitespace-nowrap">
                        ${m.eliasTriasSocioUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-right font-bold text-slate-900 whitespace-nowrap">
                        ${m.grossTotalUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-1.5 border border-slate-300 text-right font-bold text-emerald-900 bg-emerald-50/50 whitespace-nowrap">
                        ${m.netBanescoUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Explanatory Notes */}
          <div className="space-y-3 text-xs leading-relaxed text-slate-800 text-justify">
            <h3 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mt-6 font-sans">
              Notas Explicativas Contables y de Cumplimiento Normativo (SUDEBAN / SENIAT)
            </h3>

            <div>
              <p className="font-bold text-slate-900">
                1. Clasificación VEN-NIF de Cuentas por Pagar Socios (Elias Rafael Trías Abreu - C.I. V-14.892.301):
              </p>
              <p className="text-slate-700 mt-0.5">
                Los fondos inyectados por el Presidente y accionista principal Elias Rafael Trías Abreu por un acumulado de <strong>USD 378.687,92</strong> (promedio de USD 47.335,99/mes) provinieron de sus cuentas personales para cubrir la compra directa de café en el campo a pequeños productores. Bajo la norma VEN-NIF (NIIF para PYMES Sección 22), estos desembolsos constituyen préstamos del accionista registrados en el pasivo corriente como <em>"Cuentas por Pagar Socios"</em>. En la auditoría de ventas de Banesco, estos recursos patrimoniales son segregados del volumen comercial ordinario.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                2. Custodia y Tratamiento de Anticipos de Clientes para Intermediación y Compra de Café en Venezuela:
              </p>
              <p className="text-slate-700 mt-0.5">
                El 100% de los fondos recibidos de clientes corporativos y personas naturales responden al modelo de <strong>Contrato de Mandato y Gestión de Intermediación Comercial con Financiamiento Mediante Anticipos</strong>. Dichos fondos se registran en el pasivo como <em>"Anticipos de Clientes"</em> y se destinaron a la gestión de compra, acopio de lotes de café a productores venezolanos y pagos de insumos a tasa oficial BCV. No generan hecho imponible ni débito fiscal IVA hasta su facturación definitiva en Octubre de 2026, fecha en la cual se emiten las facturas de venta y se elimina el anticipo de la contabilidad.
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-900">
                3. Traspasos Internos Neutros y Prevención de Legitimación de Capitales:
              </p>
              <p className="text-slate-700 mt-0.5">
                Las transferencias recibidas en Banesco desde cuentas propias de Agrícola Oni, C.A. en Banco Provincial, Mercantil y Bancamiga (USD 308.317,84 acumulados) representan consolidación de liquidez interbancaria de la misma persona jurídica. Al poseer el mismo RIF J-50145638-0, tienen un efecto patrimonial neto de Bs. 0,00 y son depuradas del universo de ingresos comerciales según la Providencia de la SUDEBAN.
              </p>
            </div>
          </div>

          {/* Signatures & Stamps Block */}
          <div className="mt-12 pt-6 border-t-2 border-slate-900 font-sans">
            <p className="text-[11px] text-slate-600 mb-8 text-center italic">
              Documento expedido y suscrito a los doce (12) días del mes de Octubre de 2026 en la ciudad de Araure, Estado Portuguesa.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
              {/* Signer 1: Representative */}
              <div className="flex flex-col items-center">
                <div className="w-48 border-b-2 border-slate-900 mb-2 pb-1 text-center font-serif text-xs italic font-bold">
                  Elias Rafael Trías Abreu
                </div>
                <p className="font-bold text-slate-900 text-xs">ELIAS RAFAEL TRÍAS ABREU</p>
                <p className="text-[11px] text-slate-700">Presidente / Propietario</p>
                <p className="text-[10px] text-slate-600 font-mono">C.I. N° V-14.892.301</p>
                <p className="text-[10px] text-slate-500 font-bold mt-1">AGRÍCOLA ONI, C.A.</p>
              </div>

              {/* Signer 2: Certified Public Accountant */}
              <div className="flex flex-col items-center">
                <div className="w-48 border-b-2 border-slate-900 mb-2 pb-1 text-center font-serif text-xs italic font-bold">
                  Licdo. Omar Pérez Castillo
                </div>
                <p className="font-bold text-slate-900 text-xs">LICDO. OMAR PÉREZ CASTILLO</p>
                <p className="text-[11px] text-slate-700">Contador Público Colegiado</p>
                <p className="text-[10px] text-slate-600 font-mono">C.P.C. N° 16.336</p>
                <p className="text-[10px] text-emerald-800 font-bold mt-1 flex items-center gap-1">
                  <Stamp className="w-3 h-3" /> SELLO C.P.C. VENEZUELA
                </p>
              </div>
            </div>

            {/* Verification Footer Stamp */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>EXPEDIENTE UNIFICADO NOMINUS - AGRÍCOLA ONI C.A.</span>
              </div>
              <div className="text-right">
                <span>VERIFICACIÓN AUDITORÍA BANCARIA &middot; HOJA DE IMPRESIÓN OFICIAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
