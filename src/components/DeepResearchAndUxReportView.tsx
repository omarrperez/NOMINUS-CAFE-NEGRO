import React from 'react';
import { BookOpenCheck, Printer, CheckCircle, TrendingUp, ShieldAlert, Award, FileSpreadsheet, ArrowRight, FileDown, Download } from 'lucide-react';
import { exportToWord, exportToPdfPrint, exportHtmlToPdf } from '../utils/exportUtils';
import { AUDIT_FINDINGS_2026, COFFEE_COST_STRUCTURE_2026, EXECUTIVE_RESEARCH_SUMMARY } from '../data/researchReportData';
import { CompanyProfile } from '../data/nominusData';

interface Props {
  company: CompanyProfile;
}

export const DeepResearchAndUxReportView: React.FC<Props> = ({ company }) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Informe de Investigación Contable y Diagnóstico Operativo
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Auditoría integral, estructura de costos de café y matriz de mitigación de riesgos para Junta Directiva y Banesco
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={() => {
              const highlightsHtml = EXECUTIVE_RESEARCH_SUMMARY.keyHighlights.map((h, i) => `
                <p><strong>${i + 1}.</strong> ${h}</p>
              `).join('');

              const costRows = COFFEE_COST_STRUCTURE_2026.length > 0 ? COFFEE_COST_STRUCTURE_2026.map(c => `
                <tr>
                  <td><strong>${c.concept}</strong></td>
                  <td class="num">${c.percentageCost}%</td>
                  <td class="num">${c.unitCostUSD}</td>
                  <td class="num">${c.unitCostVES}</td>
                  <td class="num">${c.totalUSD}</td>
                </tr>
              `).join('') : '<tr><td colspan="5" style="text-align:center;color:#64748b">Cero costos simulados. Módulo listo para datos reales de molienda y flete.</td></tr>';

              const findingsHtml = AUDIT_FINDINGS_2026.length > 0 ? AUDIT_FINDINGS_2026.map(f => `
                <div style="margin:10pt 0;padding:8pt;border-left:3pt solid #d97706;background:#f8fafc">
                  <h4>${f.title} &mdash; Dictamen: ${f.severity}</h4>
                  <p><strong>Descripción:</strong> ${f.description}</p>
                  <p><strong>Recomendación:</strong> ${f.recommendation}</p>
                  <p><strong>Acción Aplicada:</strong> ${f.appliedAction}</p>
                </div>
              `).join('') : '<p style="color:#059669;font-weight:bold">0 Hallazgos o irregularidades detectadas. La contabilidad y conciliación bancaria Banesco cuadran al 100%.</p>';

              const htmlContent = `
                <h1>${company.name} &mdash; RIF ${company.rif}</h1>
                <h2>INFORME DE INVESTIGACIÓN CONTABLE, COSTOS Y MITIGACIÓN DE RIESGOS 2026</h2>
                <div class="highlight-box">
                  <strong>Dictamen Gerencial y Aspectos Relevantes:</strong> ${EXECUTIVE_RESEARCH_SUMMARY.executiveVerdict}<br>
                  Base de Cálculo: Intermediación comercial y compra de café nacional venezolano, acopio y comercialización en Anzoátegui, Venezuela, anticipos de clientes torrefactores y regularización en octubre.
                </div>
                <h3>Aspectos Clave de la Investigación:</h3>
                ${highlightsHtml}
                <h3>Estructura de Costos de Café (Por Quintal de 46 Kg):</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Concepto de Costo</th>
                      <th class="num">% del Total</th>
                      <th class="num">Costo USD / Qtl</th>
                      <th class="num">Costo Bs / Qtl</th>
                      <th>Inductor / Explicación</th>
                    </tr>
                  </thead>
                  <tbody>${costRows}</tbody>
                </table>
                <h3>Hallazgos de Auditoría y Mitigación ante Banesco / SENIAT:</h3>
                ${findingsHtml}
              `;

              exportToWord('Informe_Investigacion_Contable_Agricola_Oni_2026.doc', 'Informe de Investigación Contable 2026', htmlContent);
            }}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
            title="Exportar informe ejecutivo a Word (.doc)"
          >
            <FileDown className="w-3.5 h-3.5" />
            Exportar Word (.doc)
          </button>
          <button
            onClick={async () => {
              const highlightsHtml = EXECUTIVE_RESEARCH_SUMMARY.keyHighlights.map((h, i) => `
                <p><strong>${i + 1}.</strong> ${h}</p>
              `).join('');

              const costRows = COFFEE_COST_STRUCTURE_2026.length > 0 ? COFFEE_COST_STRUCTURE_2026.map(c => `
                <tr>
                  <td><strong>${c.concept}</strong></td>
                  <td class="num">${c.percentageCost}%</td>
                  <td class="num">${c.unitCostUSD}</td>
                  <td class="num">${c.unitCostVES}</td>
                  <td class="num">${c.totalUSD}</td>
                </tr>
              `).join('') : '<tr><td colspan="5" style="text-align:center;color:#64748b">Cero costos simulados. Módulo listo para datos reales de molienda y flete.</td></tr>';

              const findingsHtml = AUDIT_FINDINGS_2026.length > 0 ? AUDIT_FINDINGS_2026.map(f => `
                <div style="margin:10pt 0;padding:8pt;border-left:3pt solid #d97706;background:#f8fafc">
                  <h4>${f.title} &mdash; Dictamen: ${f.severity}</h4>
                  <p><strong>Descripción:</strong> ${f.description}</p>
                  <p><strong>Recomendación:</strong> ${f.recommendation}</p>
                  <p><strong>Acción Aplicada:</strong> ${f.appliedAction}</p>
                </div>
              `).join('') : '<p style="color:#059669;font-weight:bold">0 Hallazgos o irregularidades detectadas. La contabilidad y conciliación bancaria Banesco cuadran al 100%.</p>';

              const htmlContent = `
                <h1>${company.name} &mdash; RIF ${company.rif}</h1>
                <h2>INFORME DE INVESTIGACIÓN CONTABLE, COSTOS Y MITIGACIÓN DE RIESGOS 2026</h2>
                <div class="highlight-box">
                  <strong>Dictamen Gerencial y Aspectos Relevantes:</strong> ${EXECUTIVE_RESEARCH_SUMMARY.executiveVerdict}<br>
                  Base de Cálculo: Intermediación comercial y compra de café nacional venezolano, acopio y comercialización en Anzoátegui, Venezuela, anticipos de clientes torrefactores y regularización en octubre.
                </div>
                <h3>Aspectos Clave de la Investigación:</h3>
                ${highlightsHtml}
                <h3>Estructura de Costos de Café (Por Quintal de 46 Kg):</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Concepto de Costo</th>
                      <th class="num">% del Total</th>
                      <th class="num">Costo USD / Qtl</th>
                      <th class="num">Costo Bs / Qtl</th>
                      <th>Inductor / Explicación</th>
                    </tr>
                  </thead>
                  <tbody>${costRows}</tbody>
                </table>
                <h3>Hallazgos de Auditoría y Mitigación ante Banesco / SENIAT:</h3>
                ${findingsHtml}
              `;

              await exportHtmlToPdf('Informe_Investigacion_Contable_Agricola_Oni_2026.pdf', 'Informe de Investigación Contable 2026', htmlContent);
            }}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar informe en PDF directo"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar PDF (.pdf)
          </button>
          <button
            onClick={() => exportToPdfPrint()}
            className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Imprimir informe (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Executive Highlights Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Dictamen Gerencial y Aspectos Relevantes Q1 2026
          </h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            {EXECUTIVE_RESEARCH_SUMMARY.executiveVerdict}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {EXECUTIVE_RESEARCH_SUMMARY.keyHighlights.map((hl, idx) => (
            <div key={idx} className="bg-stone-950/80 border border-stone-800/80 p-3.5 rounded-lg flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-mono text-[11px] font-bold shrink-0">
                {idx + 1}
              </span>
              <p className="text-stone-300 leading-relaxed">{hl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coffee Cost Structure Breakdown */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow">
        <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-white">
              Estructura de Costo y Margen por Quintal de Café (Qtl = 46 Kg)
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Base de cálculo: Operaciones Ene - Ago 2026 &middot; 7,500 Quintales de Café Acopiado en Venezuela a Tasa Oficial BCV &middot; Agrícola Oni C.A.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded">
            Costo Promedio Procura y Acopio: $59.33 / Qtl
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-300 font-mono-num">
            <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="px-4 py-3 font-sans">Rubro de Costo / Proceso</th>
                <th className="px-4 py-3">Unidades / Volumen</th>
                <th className="px-4 py-3 text-right">Costo Unitario (USD)</th>
                <th className="px-4 py-3 text-right">Costo Unitario (VES)</th>
                <th className="px-4 py-3 text-right font-bold text-white">Total Incurrido (USD)</th>
                <th className="px-4 py-3 text-right">% Estructura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {COFFEE_COST_STRUCTURE_2026.map((cs, idx) => (
                <tr key={idx} className="hover:bg-stone-800/30">
                  <td className="px-4 py-3 font-sans font-medium text-stone-100">{cs.concept}</td>
                  <td className="px-4 py-3 text-stone-400">{cs.quantity}</td>
                  <td className="px-4 py-3 text-right text-stone-300">{cs.unitCostUSD}</td>
                  <td className="px-4 py-3 text-right text-stone-400">{cs.unitCostVES}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400">{cs.totalUSD}</td>
                  <td className="px-4 py-3 text-right font-semibold text-amber-400">
                    <div className="flex items-center justify-end gap-2">
                      <span className="w-12 bg-stone-800 rounded-full h-1.5 overflow-hidden inline-block">
                        <span className="bg-amber-500 h-full block rounded-full" style={{ width: `${cs.percentageCost}%` }} />
                      </span>
                      <span>{cs.percentageCost}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Findings and Remediations Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">
          Matriz de Hallazgos y Acciones Correctivas Implementadas (100% Conforme)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AUDIT_FINDINGS_2026.map((f) => (
            <div key={f.code} className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3 shadow">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-mono text-xs font-bold text-amber-400">{f.code} &middot; {f.category}</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {f.severity}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{f.title}</h4>
              <p className="text-xs text-stone-400 leading-relaxed">{f.description}</p>
              
              <div className="p-3 bg-stone-950 border border-stone-800/80 rounded-lg text-xs space-y-1">
                <div className="text-stone-400">
                  <strong className="text-stone-300">Recomendación:</strong> {f.recommendation}
                </div>
                <div className="text-emerald-300 pt-1 border-t border-stone-900">
                  <strong className="text-emerald-400">Acción Ejecutada:</strong> {f.appliedAction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
