import React, { useState } from 'react';
import { Scale, FileCheck, Printer, Download, Eye, Shield, CheckCircle, ChevronRight, Copy, FileDown } from 'lucide-react';
import { exportToWord, exportToPdfPrint } from '../utils/exportUtils';
import { CompanyProfile } from '../data/nominusData';

interface Props {
  company: CompanyProfile;
}

interface LegalContract {
  id: string;
  code: string;
  title: string;
  parties: string;
  date: string;
  type: 'MERCANTIL' | 'SEGURIDAD' | 'AGROINDUSTRIAL' | 'LABORAL';
  summary: string;
  clauses: { title: string; content: string }[];
}

const LEGAL_CONTRACTS: LegalContract[] = [
  {
    id: 'ctr-01',
    code: 'CTR-MUT-2026-BECERRA-600M',
    title: 'Contrato de Préstamo Mutuo con Interés y Línea de Crédito Rotativa',
    parties: 'AGRÍCOLA ONI C.A. (Acreedor/Prestamista) y MANUEL BECERRA (Prestatario/Socio)',
    date: '02 de Enero de 2026',
    type: 'MERCANTIL',
    summary: 'Apertura de línea de crédito rotativa por hasta Seiscientos Millones de Bolívares (Bs. 600.000.000,00) para capital de trabajo, con interés pactado, amortizable mediante transferencias bancarias a la cuenta corriente Banesco de Agrícola Oni C.A.',
    clauses: [
      {
        title: 'PRIMERA: Objeto y Límite de la Línea de Crédito',
        content: 'AGRÍCOLA ONI C.A. conviene en otorgar a favor de MANUEL BECERRA, en su condición de socio y aliado comercial, una línea de crédito rotativa de mutuo comercial por un monto de hasta Seiscientos Millones de Bolívares (Bs. 600.000.000,00), ejecutable mediante desembolsos parciales según requerimientos operativos.'
      },
      {
        title: 'SEGUNDA: Desembolsos, Registro Contable y Saldo Exigible',
        content: 'Los desembolsos se ejecutan mediante cargos y transferencias desde la cuenta Banesco de la empresa. Al corte del 31 de agosto de 2026 se han realizado 33 desembolsos por Bs. 498.400.605,30 y el prestatario ha reembolsado 14 abonos por Bs. 186.376.000,00, arrojando un saldo insoluto de capital de Bs. 312.024.605,30 más Bs. 13.924.047,66 de intereses causados declarados como ingreso, para un total en balance de Bs. 325.948.652,96.'
      },
      {
        title: 'TERCERA: Naturaleza No Gravable de las Amortizaciones de Capital',
        content: 'Las partes dejan expresa constancia de que los abonos bancarios efectuados por el prestatario constituyen restitución de capital prestado (recuperación de activo exigible), por lo cual no constituyen hecho imponible de IVA ni enriquecimiento neto gravable de ISLR para la empresa prestamista.'
      },
      {
        title: 'CUARTA: Pagaré Mercantil y Garantía',
        content: 'Para garantizar el fiel cumplimiento de las obligaciones asumidas, el prestatario suscribe pagaré mercantil notariado por el límite de la línea, con renuncia al domicilio y sujeto a la jurisdicción de los tribunales de la Circunscripción Judicial del Estado Portuguesa.'
      }
    ]
  },
  {
    id: 'ctr-02',
    code: 'CTR-MAND-2026-COL-ETN',
    title: 'Contrato de Mandato de Intermediación Comercial y Procura de Café Colombiano',
    parties: 'AGRÍCOLA ONI C.A. (Mandatario / Intermediario) y CLIENTES TORREFACTORES NACIONALES (Mandantes)',
    date: '15 de Mayo de 2026',
    type: 'AGROINDUSTRIAL',
    summary: 'Contrato marco de intermediación para la adquisición e importación de café verde en la República de Colombia ante el déficit estructural de la cosecha venezolana, financiado mediante anticipos en ventas que se facturan formalmente en Octubre de 2026 al entregar la mercancía nacionalizada.',
    clauses: [
      {
        title: 'PRIMERA: Objeto de la Intermediación Comercial',
        content: 'AGRÍCOLA ONI C.A. no opera como productora primaria de café, sino en calidad de mandataria e intermediaria comercial para gestionar en Colombia u otros orígenes la compra, transporte aduanal, inspección fitosanitaria y nacionalización de lotes de café verde y pergamino para abastecer a la industria nacional.'
      },
      {
        title: 'SEGUNDA: Anticipos en Ventas y Régimen de Facturación a partir de Octubre',
        content: 'Los clientes transfieren a la cuenta corriente Banesco de AGRÍCOLA ONI C.A. anticipos en bolívares para asegurar cupos de café. De conformidad con la NIIF 15 y el Art. 1152 del Código Civil, estos abonos constituyen Pasivo Corriente y no ingresos devengados. La entrega material y la emisión de facturas definitivas con IVA e ISLR inician en el mes de OCTUBRE DE 2026.'
      },
      {
        title: 'TERCERA: Destino Exclusivo a Compra de Divisas y Operación Logística',
        content: 'Los fondos en bolívares recibidos como anticipos se destinan estrictamente a la compra oficial de dólares estadounidenses ante Banesco Banco Universal (Mesa de Cambio), para la posterior transferencia internacional a proveedores colombianos, fletes binacionales y tasas aduanales SENIAT.'
      }
    ]
  },
  {
    id: 'ctr-03',
    code: 'CTR-IMP-2026-COL-CUCUTA',
    title: 'Contrato Internacional de Suministro y Compraventa de Café Verde',
    parties: 'COOPERATIVA CAFETERA DE CÚCUTA LTDA. (Vendedor/Exportador) y AGRÍCOLA ONI C.A. (Comprador/Importador)',
    date: '20 de Mayo de 2026',
    type: 'MERCANTIL',
    summary: 'Suministro de 7.500 quintales de café arábica pergamino lavado exportación, origen Norte de Santander / Huila, con entrega en frontera San Antonio - Cúcuta y transporte terrestre hasta almacenes en Acarigua/Araure.',
    clauses: [
      {
        title: 'PRIMERA: Especificaciones del Café y Calidad de Exportación',
        content: 'EL VENDEDOR suministrará a EL COMPRADOR café arábica pergamino lavado con humedad controlada inferior al 12%, rendimiento mínimo de exportación y certificado de origen emitido por la Federación Nacional de Cafeteros de Colombia.'
      },
      {
        title: 'SEGUNDA: Precio y Modalidad de Pago en Divisas Oficiales',
        content: 'El precio total pactado de Cuatrocientos Cuarenta y Cinco Mil Dólares (USD 445.000,00) se liquida mediante transferencias internacionales en moneda extranjera provenientes de la cuenta custodia de AGRÍCOLA ONI C.A. en Banesco Banco Universal contra facturas de exportación DIAN.'
      },
      {
        title: 'TERCERA: Documentación Aduanal y Cumplimiento Sanitario',
        content: 'Cada cargamento se ampara con Factura de Exportación DIAN, Carta de Porte Internacional por Carretera (CPIC), Permiso Fitosanitario de Importación INSAI y Declaración Única de Aduana (DUA) tramitada ante la Aduana Principal de San Antonio del Táchira.'
      }
    ]
  },
  {
    id: 'ctr-04',
    code: 'CTR-BAN-2026-CAMBIO-OFICIAL',
    title: 'Convenio de Operaciones en Mesa de Cambio y Cuenta Custodia Banesco',
    parties: 'BANESCO BANCO UNIVERSAL, C.A. y AGRÍCOLA ONI C.A.',
    date: '05 de Enero de 2026',
    type: 'MERCANTIL',
    summary: 'Adquisición de divisas oficiales a través del mecanismo de Mesa de Cambio e Intervención Cambiaria del BCV, con débito en cuenta en bolívares N° 0134-0342-18-3421089912 y abono en Cuenta Custodia N° 0134-0342-12-3420084712.',
    clauses: [
      {
        title: 'PRIMERA: Mecanismo de Pacto y Liquidación',
        content: 'AGRÍCOLA ONI C.A. instruye a BANESCO BANCO UNIVERSAL la compra de divisas oficiales para fines de importación agroalimentaria. Durante el período enero - agosto 2026 se adquirió un total acumulado de USD 556.890,45 mediante débito de Bs. 375.630.000,00.'
      },
      {
        title: 'SEGUNDA: Destino y Uso Trazable de las Divisas',
        content: 'Las divisas se destinan exclusivamente al pago de proveedores colombianos de café (USD 445.000,00), flete binacional terrestre (USD 67.380,15) y gastos de nacionalización aduanera (USD 35.000,00), con un remanente en custodia de USD 9.510,30.'
      }
    ]
  }
];

export const LegalShieldContractsView: React.FC<Props> = ({ company }) => {
  const [selectedContract, setSelectedContract] = useState<LegalContract>(LEGAL_CONTRACTS[0]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Módulo de Blindaje Legal y Contratos Mercantiles
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Instrumentos contractuales autenticables &middot; Blindaje regulatorio SUDEBAN, SENIAT, DAEX y CVC
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto no-print">
          <button
            onClick={() => {
              const clausesHtml = selectedContract.clauses.map(c => `
                <h3>${c.title}</h3>
                <p>${c.content}</p>
              `).join('');

              const htmlContent = `
                <h1>${company.name}</h1>
                <p><strong>RIF:</strong> ${company.rif} &middot; <strong>Expediente:</strong> ${selectedContract.code}</p>
                <h2>${selectedContract.title.toUpperCase()}</h2>
                <div class="highlight-box">
                  <strong>Partes:</strong> ${selectedContract.parties}<br>
                  <strong>Fecha de Suscripción:</strong> ${selectedContract.date}<br>
                  <strong>Objeto:</strong> ${selectedContract.summary}
                </div>
                ${clausesHtml}
                <div class="footer-signatures">
                  <table style="border:none;margin-top:40pt">
                    <tr style="border:none;background:none">
                      <td style="border:none;width:50%;text-align:center">
                        _____________________________________<br>
                        <strong>${company.legalRepresentative}</strong><br>
                        Por: ${company.name}<br>
                        C.I. ${company.idNumber}
                      </td>
                      <td style="border:none;width:50%;text-align:center">
                        _____________________________________<br>
                        <strong>Parte Contratante / Aval</strong><br>
                        Aceptado Conforme
                      </td>
                    </tr>
                  </table>
                </div>
              `;
              exportToWord(`${selectedContract.code}_Agricola_Oni.doc`, selectedContract.title, htmlContent);
            }}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
            title="Exportar contrato a Microsoft Word (.doc)"
          >
            <FileDown className="w-3.5 h-3.5" />
            Exportar Word (.doc)
          </button>
          <button
            onClick={() => exportToPdfPrint()}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Imprimir contrato o guardar como PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Main Grid: Contracts List + Contract Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Contract Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase text-stone-400 tracking-wider font-mono">
            Expediente de Contratos Vigentes 2026
          </h3>
          <div className="space-y-2">
            {LEGAL_CONTRACTS.map((ctr) => {
              const isSelected = selectedContract.id === ctr.id;
              return (
                <div
                  key={ctr.id}
                  onClick={() => setSelectedContract(ctr)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-stone-800 border-amber-500 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-stone-900/80 border-stone-800 hover:bg-stone-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-amber-400 font-semibold">{ctr.code}</span>
                    <span className="text-[10px] text-stone-400">{ctr.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-100">{ctr.title}</h4>
                  <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">{ctr.parties}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Contract Full Legal Text (Paper View) */}
        <div className="lg:col-span-8">
          <div className="bg-white text-stone-900 rounded-xl p-8 sm:p-12 shadow-xl border border-stone-200">
            {/* Header */}
            <div className="text-center border-b-2 border-stone-900 pb-5 mb-6">
              <span className="text-xs font-bold font-mono text-amber-900 tracking-widest block uppercase">
                DOCUMENTO LEGAL VINCULANTE &middot; {selectedContract.code}
              </span>
              <h2 className="text-xl font-bold font-serif-doc mt-2 text-stone-950">
                {selectedContract.title}
              </h2>
              <p className="text-xs font-semibold text-stone-600 mt-1">
                Partes: {selectedContract.parties}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Suscrito en fecha: {selectedContract.date}
              </p>
            </div>

            {/* Summary Callout */}
            <div className="bg-stone-50 border border-stone-300 rounded p-3 mb-6 text-xs text-stone-700 leading-relaxed italic">
              <strong>Síntesis del Acuerdo:</strong> {selectedContract.summary}
            </div>

            {/* Clauses */}
            <div className="space-y-4 text-xs text-justify leading-relaxed text-stone-800">
              {selectedContract.clauses.map((clause, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="font-bold text-stone-950 font-serif-doc text-sm">
                    {clause.title}
                  </h4>
                  <p>{clause.content}</p>
                </div>
              ))}
            </div>

            {/* Signature Area */}
            <div className="mt-12 pt-6 border-t border-stone-300 grid grid-cols-2 gap-8 text-center text-[11px]">
              <div>
                <div className="border-t border-stone-700 pt-1 mt-10">
                  <p className="font-bold text-stone-950">POR: AGRÍCOLA ONI C.A.</p>
                  <p className="text-stone-600">Ing. Omar Pérez &mdash; Director General</p>
                  <p className="text-stone-500 text-[10px]">C.I.: V-14.892.301 &middot; RIF: J-30849201-4</p>
                </div>
              </div>

              <div>
                <div className="border-t border-stone-700 pt-1 mt-10">
                  <p className="font-bold text-stone-950">POR: LA CONTRAPARTE</p>
                  <p className="text-stone-600">Representante Legal Acreditado</p>
                  <p className="text-stone-500 text-[10px]">Cédula de Identidad y Poder Anexo</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-stone-200 text-[9px] text-stone-400 text-center font-mono">
              REGISTRO DE BLINDAJE JURÍDICO &middot; CONTRATO AUDITADO Y DEPOSITADO ANTE CONSULTORÍA JURÍDICA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
