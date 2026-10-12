import React, { useState } from 'react';
import {
  Scale,
  FileCheck,
  Printer,
  Download,
  Eye,
  Shield,
  CheckCircle,
  ChevronRight,
  Copy,
  FileDown,
  FileSpreadsheet,
  Building2,
  Globe,
  Layers,
  Search,
  CheckCircle2
} from 'lucide-react';
import { exportToWord, exportToPdfPrint, exportHtmlToPdf, exportToExcelXlsx } from '../utils/exportUtils';
import { CompanyProfile } from '../data/nominusData';

interface Props {
  company: CompanyProfile;
}

export interface LegalEntityBatchContract {
  id: string;
  batchCode: string;
  contractCode: string;
  companyName: string;
  rif: string;
  repName: string;
  repId: string;
  bankOrigin: string;
  amountVES: number;
  amountUSD: number;
  coffeeQtl: number;
  date: string;
  status: string;
  octoberInvoiceRef: string;
  summary: string;
  clauses: { title: string; content: string }[];
}

export const LEGAL_ENTITY_BATCH_CONTRACTS: LegalEntityBatchContract[] = [
  {
    id: 'ctr-pj-001',
    batchCode: 'LOTE-2026-CAF-001',
    contractCode: 'CTR-MAND-2026-ETN-001',
    companyName: 'EMPRESA ETN, C.A.',
    rif: 'J-50100487-0',
    repName: 'Carlos Eduardo Mendoza',
    repId: 'V-15.482.901',
    bankOrigin: 'BFC (0151) / Banesco (0134)',
    amountVES: 210000000.00,
    amountUSD: 311111.11,
    coffeeQtl: 2100,
    date: '15 de Marzo de 2026',
    status: 'FONDOS EN CUSTODIA / PROCURA INTERNACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-001',
    summary: 'Contrato de Mandato y Gestión de Importación con Financiamiento Mediante Anticipos suscrito entre AGRÍCOLA ONI, C.A. y EMPRESA ETN, C.A. para la adquisición e importación de 2.100 quintales de café pergamino origen Colombia.',
    clauses: [
      {
        title: 'PRIMERA: Objeto, Mandato de Importación y Custodia de Fondos',
        content: 'EMPRESA ETN, C.A. (EL MANDANTE) otorga mandato comercial expreso e irrevocable a AGRÍCOLA ONI, C.A. (EL MANDATARIO) para gestionar, adquirir e importar desde la República de Colombia lotes de café verde y pergamino lavado ante el déficit estructural de la cosecha nacional. Las partes dejan constancia legal de que los recursos por Bs. 210.000.000,00 transferidos durante los últimos 6 meses constituyen fondos en custodia destinados exclusivamente a la procura internacional de café, registrados contablemente como Pasivo Corriente (Anticipos de Clientes NIIF 15) sin emisión de factura comercial de venta inmediata.'
      },
      {
        title: 'SEGUNDA: Código de Lote de Importación y Registro de Rastro de Efectivo',
        content: 'Los fondos transferidos se asocian de forma unívoca al Código de Lote LOTE-2026-CAF-001. EL MANDATARIO garantiza el rastro transparente de efectivo (Cash Traceability), demostrando que el 100% de los bolívares recibidos en la cuenta Banesco se destinaron a la compra de divisas en la Mesa de Cambio oficial Banesco para el pago de facturas de exportación DIAN a la Cooperativa Cafetera de Cúcuta Ltda.'
      },
      {
        title: 'TERCERA: Soporte de Transparencia Bancaria y Prevención de Legitimación',
        content: 'Para dar cumplimiento a las normativas de prevención de legitimación de capitales (Providencia SUDEBAN / Banesco Compliance), el presente contrato se complementa con los anexos obligatorios: Proforma del Exportador Colombiano, Permisos INSAI N° INSAI-FITOSAN-IMP-2026-904, Declaración Única de Aduana (DUA-2026-ADU-004128) y Carta de Porte Internacional.'
      },
      {
        title: 'CUARTA: Cláusula de Finiquito, Absorción y Cruce Contable (Octubre 2026)',
        content: 'Las partes convienen que en el mes de OCTUBRE DE 2026, al concretarse la nacionalización y entrega física de los 2.100 quintales de café en la planta de Araure/Acarigua, AGRÍCOLA ONI, C.A. emitirá la factura definitiva FAC-OCT-2026-001 por el monto total correspondiente. Dicha factura absorberá y extinguirá el saldo de la cuenta de pasivo "Anticipos de Clientes", aplicando el IVA correspondiente y emitiendo los comprobantes de retención de IVA según la Providencia SNAT/2015/0049 e IGTF si aplica.'
      }
    ]
  },
  {
    id: 'ctr-pj-002',
    batchCode: 'LOTE-2026-CAF-002',
    contractCode: 'CTR-MAND-2026-DIS-002',
    companyName: 'DISTRIBUIDORA DIS, C.A.',
    rif: 'J-30643703-7',
    repName: 'Luis Alberto Salazar',
    repId: 'V-12.839.402',
    bankOrigin: 'Provincial (0108) / Banesco (0134)',
    amountVES: 240000000.00,
    amountUSD: 355555.56,
    coffeeQtl: 2400,
    date: '10 de Abril de 2026',
    status: 'FONDOS EN CUSTODIA / PROCURA INTERNACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-002',
    summary: 'Contrato de Mandato y Gestión de Importación con Financiamiento Mediante Anticipos para la reserva e importación de 2.400 quintales de café pergamino lavado asignados al Lote LOTE-2026-CAF-002.',
    clauses: [
      {
        title: 'PRIMERA: Objeto, Mandato de Importación y Custodia de Fondos',
        content: 'DISTRIBUIDORA DIS, C.A. (EL MANDANTE) suscribe con AGRÍCOLA ONI, C.A. (EL MANDATARIO) el presente contrato de gestión de importación con anticipos. Los fondos por Bs. 240.000.000,00 recibidos a través de transferencias bancarias constituyen abonos en custodia para la procura internacional de grano en Colombia, catalogados como Pasivo Corriente conforme a NIIF 15 sin generar venta inmediata.'
      },
      {
        title: 'SEGUNDA: Código de Lote de Importación y Rastro de Efectivo',
        content: 'El presente contrato ampara la asignación prioritaria del Lote de Importación LOTE-2026-CAF-002. AGRÍCOLA ONI, C.A. certifica que los bolívares ingresados fueron canalizados mediante operaciones cambiarias autorizadas ante Banesco Banco Universal para la adquisición de dólares destinados al pago de flete terrestre internacional y compras en frontera.'
      },
      {
        title: 'TERCERA: Documentación Obligatoria de Transparencia y Cumplimiento',
        content: 'El expediente crediticio y bancario se respalda con copias de los certificados fitosanitarios INSAI, manifiestos de carga terrestre, facturas proforma del proveedor internacional y certificaciones de recepción de aduana en San Antonio del Táchira.'
      },
      {
        title: 'CUARTA: Cláusula de Finiquito y Liquidación de Anticipos (Octubre 2026)',
        content: 'En OCTUBRE DE 2026, al culminar el proceso de transporte y pesaje en almacén, AGRÍCOLA ONI, C.A. emitirá la factura fiscal definitiva FAC-OCT-2026-002, la cual compensará en su totalidad el pasivo por anticipos recibidos, registrando las retenciones de IVA de la Providencia 0049 e ISLR Decreto 1808.'
      }
    ]
  },
  {
    id: 'ctr-pj-003',
    batchCode: 'LOTE-2026-CAF-003',
    contractCode: 'CTR-MAND-2026-ORU-003',
    companyName: 'GRUPO AGROINDUSTRIAL ORU, C.A.',
    rif: 'J-41100717-0',
    repName: 'Roberto Antonio Guerrero',
    repId: 'V-18.294.103',
    bankOrigin: 'Banco de Venezuela (0102)',
    amountVES: 185000000.00,
    amountUSD: 274074.07,
    coffeeQtl: 1850,
    date: '22 de Abril de 2026',
    status: 'FONDOS EN CUSTODIA / PROCURA INTERNACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-003',
    summary: 'Contrato de Mandato e Intermediación Comercial para la compra e importación de 1.850 quintales de café verde arábica en Colombia asignados al Lote LOTE-2026-CAF-003.',
    clauses: [
      {
        title: 'PRIMERA: Objeto, Mandato y Custodia de Anticipos',
        content: 'GRUPO AGROINDUSTRIAL ORU, C.A. constituye a AGRÍCOLA ONI, C.A. como su agente e intermediario comercial para la importación de café verde. Los aportes por Bs. 185.000.000,00 son entregados en calidad de anticipos financieros en custodia (Pasivo Corriente) para asegurar volumen de molienda.'
      },
      {
        title: 'SEGUNDA: Vinculación al Lote de Importación y Trazabilidad',
        content: 'Las transferencias se vinculan estrictamente al Código de Lote LOTE-2026-CAF-003, con trazabilidad completa de los desembolsos cambiarios realizados a través de la cuenta custodia en divisas de Banesco Banco Universal.'
      },
      {
        title: 'TERCERA: Soportes de Cumplimiento Financiero',
        content: 'Anexo de documentación exigida por la Intendencia de Protección al Sector Bancario: licencias de importación, planillas DUA SENIAT, guías de movilización de café y recibos de pago a transportistas binacionales.'
      },
      {
        title: 'CUARTA: Absorción de Pasivo y Finiquito en Octubre 2026',
        content: 'La entrega formal de la mercancía en el mes de OCTUBRE DE 2026 activará la emisión de la factura comercial FAC-OCT-2026-003, extinguiendo el anticipo del pasivo e ingresando el débito fiscal IVA con sus respectivas retenciones SENIAT.'
      }
    ]
  },
  {
    id: 'ctr-pj-004',
    batchCode: 'LOTE-2026-CAF-004',
    contractCode: 'CTR-MAND-2026-SOL-004',
    companyName: 'INVERSIONES SOLBTR, C.A.',
    rif: 'J-50013440-3',
    repName: 'Gabriel José Torrealba',
    repId: 'V-16.740.291',
    bankOrigin: 'Banco Activo (0171) / Banco Plaza (0138)',
    amountVES: 165000000.00,
    amountUSD: 244444.44,
    coffeeQtl: 1650,
    date: '18 de Mayo de 2026',
    status: 'FONDOS EN CUSTODIA / PROCURA INTERNACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-004',
    summary: 'Contrato de Mandato de Importación de Café Pergamino para la procuración de 1.650 quintales destinados a la industria torrefactora nacional (Lote LOTE-2026-CAF-004).',
    clauses: [
      {
        title: 'PRIMERA: Mandato Comercial y Naturaleza de los Fondos',
        content: 'INVERSIONES SOLBTR, C.A. asigna a AGRÍCOLA ONI, C.A. mandato de procura internacional de café. El desembolso de Bs. 165.000.000,00 se registra como Anticipos Recibidos de Clientes (Pasivo NIIF 15) en custodia sin emisión previa de factura de venta.'
      },
      {
        title: 'SEGUNDA: Asignación de Lote e Intervención Cambiaria Banesco',
        content: 'Operación asociada al Lote LOTE-2026-CAF-004. Los fondos en moneda nacional se liquidaron en la Mesa de Cambio Banesco para honrar las obligaciones en divisas con proveedores en Norte de Santander, Colombia.'
      },
      {
        title: 'TERCERA: Soportes y Anexos de Transparencia Compliance',
        content: 'Integración en el expediente bancario de facturas proforma DIAN, constancias de inspecional fitosanitaria INSAI y avales de almacenamiento aduanal.'
      },
      {
        title: 'CUARTA: Cláusula de Finiquito y Absorción en Octubre 2026',
        content: 'En OCTUBRE DE 2026 se procederá al cruce contable y emisión de la factura legal FAC-OCT-2026-004, absorbiendo en su totalidad la cuenta de pasivo y emitiendo los comprobantes de retención IVA (75%/100%) exigidos por SENIAT.'
      }
    ]
  },
  {
    id: 'ctr-pj-005',
    batchCode: 'LOTE-2026-CAF-005',
    contractCode: 'CTR-MAND-2026-RIK-005',
    companyName: 'COMERCIALIZADORA RIK Y ALIADOS, C.A.',
    rif: 'J-50145725-2',
    repName: 'Ricardo José Morales',
    repId: 'V-19.302.844',
    bankOrigin: 'Bancamiga (0172) / Banesco (0134)',
    amountVES: 190000000.00,
    amountUSD: 281481.48,
    coffeeQtl: 1900,
    date: '05 de Junio de 2026',
    status: 'FONDOS EN CUSTODIA / PROCURA INTERNACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-005',
    summary: 'Contrato de Mandato y Procura de Café Verde de Exportación para la atención de 1.900 quintales de café asignados al Lote LOTE-2026-CAF-005.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Mandato e Imputación Contable',
        content: 'COMERCIALIZADORA RIK Y ALIADOS, C.A. acuerda con AGRÍCOLA ONI, C.A. la intermediación comercial para la importación de café. Los fondos por Bs. 190.000.000,00 entregados en custodia constituyen Pasivo Corriente de conformidad con NIIF 15.'
      },
      {
        title: 'SEGUNDA: Rastro de Efectivo y Lote de Importación',
        content: 'Fondos vinculados al Lote LOTE-2026-CAF-005, verificados mediante giros interbancarios desde Bancamiga hacia la cuenta corriente Banesco de Agrícola Oni C.A., convertidos posteriormente en divisas oficiales.'
      },
      {
        title: 'TERCERA: Soportes Aduanales y Cumplimiento de Prevención',
        content: 'Expediente respaldado con certificados fitosanitarios INSAI, facturas internacionales de venta DIAN y cartas de porte terrestre internacional.'
      },
      {
        title: 'CUARTA: Absorción de Pasivo y Emisión de Factura (Octubre 2026)',
        content: 'En OCTUBRE DE 2026, con la recepción definitiva del café en almacén, se emitirá la factura FAC-OCT-2026-005 para la extinción del pasivo y acreditación de retenciones de IVA e ISLR.'
      }
    ]
  },
  {
    id: 'ctr-pj-006',
    batchCode: 'LOTE-2026-CAF-006',
    contractCode: 'CTR-MAND-2026-JAG-006',
    companyName: 'CORPORACIÓN AGROINDUSTRIAL J, C.A.',
    rif: 'J-50120729-0',
    repName: 'Julio César Benítez',
    repId: 'V-14.209.833',
    bankOrigin: 'Banco de Venezuela (0102)',
    amountVES: 175000000.00,
    amountUSD: 259259.26,
    coffeeQtl: 1750,
    date: '12 de Julio de 2026',
    status: 'FONDOS EN CUSTODIA / PROCURA INTERNACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-006',
    summary: 'Contrato de Mandato de Intermediación y Procura Internacional de Café Pergamino para la asignación de 1.750 quintales de café verde (Lote LOTE-2026-CAF-006).',
    clauses: [
      {
        title: 'PRIMERA: Mandato Comercial y Custodia Fiduciaria',
        content: 'CORPORACIÓN AGROINDUSTRIAL J, C.A. constituye a AGRÍCOLA ONI, C.A. como mandatario e importador. El anticipo de Bs. 175.000.000,00 constituye fondo en custodia sin generar hecho imponible del IVA hasta la entrega formal de la mercancía.'
      },
      {
        title: 'SEGUNDA: Código de Lote e Intermediación Cambiaria',
        content: 'Operación asociada al Lote LOTE-2026-CAF-006. Trazabilidad completa de la reconversión de moneda nacional a USD oficial en Banesco Banco Universal para pago de proveedores en Colombia.'
      },
      {
        title: 'TERCERA: Expediente de Transparencia Bancaria',
        content: 'Respaldado con certificados sanitarios de origen, guías de tránsito nacional SENIAT/INSAI y facturas de flete internacional.'
      },
      {
        title: 'CUARTA: Liquidación de Pasivo y Finiquito (Octubre 2026)',
        content: 'La entrega material de la mercancía en OCTUBRE DE 2026 generará la factura formal FAC-OCT-2026-006, extinguiendo la obligación en pasivo e imputando los comprobantes de retención tributaria.'
      }
    ]
  }
];

// Combine with other special contracts
const SPECIAL_CONTRACTS = [
  {
    id: 'ctr-01',
    batchCode: 'N/A (LÍNEA DE CRÉDITO)',
    contractCode: 'CTR-MUT-2026-BECERRA-600M',
    companyName: 'MANUEL BECERRA (SOCIO)',
    rif: 'V-023997829',
    repName: 'Manuel Becerra',
    repId: 'V-023997829',
    bankOrigin: 'Banesco Banco Universal (0134)',
    amountVES: 600000000.00,
    amountUSD: 888888.89,
    coffeeQtl: 0,
    date: '02 de Enero de 2026',
    status: 'LÍNEA ROTATIVA ACTIVA',
    octoberInvoiceRef: 'PAGARÉ NOTARIADO N° 4012',
    summary: 'Contrato de Préstamo Mutuo con Interés y Línea de Crédito Rotativa otorgado por AGRÍCOLA ONI C.A. a favor de MANUEL BECERRA por hasta Bs. 600.000.000,00.',
    clauses: [
      {
        title: 'PRIMERA: Objeto y Límite de la Línea de Crédito',
        content: 'AGRÍCOLA ONI C.A. conviene en otorgar a favor de MANUEL BECERRA una línea de crédito rotativa de mutuo comercial por hasta Bs. 600.000.000,00 para capital de trabajo y fomento cafetalero.'
      },
      {
        title: 'SEGUNDA: Reembolsos y Naturaleza No Gravable',
        content: 'Las amortizaciones recibidas en la cuenta Banesco constituyen recuperación de capital prestado, por lo cual no constituyen hecho imponible de IVA ni enriquecimiento de ISLR.'
      }
    ]
  },
  {
    id: 'ctr-03',
    batchCode: 'LOTE-IMP-COL-CUCUTA',
    contractCode: 'CTR-IMP-2026-COL-CUCUTA',
    companyName: 'COOPERATIVA CAFETERA DE CÚCUTA LTDA.',
    rif: 'NIT: 890.501.240-3',
    repName: 'Gerencia de Exportaciones Colombia',
    repId: 'NIT: 890.501.240-3',
    bankOrigin: 'Banesco Cuenta Custodia / GIRO DIAN',
    amountVES: 300375000.00,
    amountUSD: 445000.00,
    coffeeQtl: 7500,
    date: '20 de Mayo de 2026',
    status: 'SUMINISTRO INTERNACIONAL ACTIVO',
    octoberInvoiceRef: 'FACTURA DIAN EXP-COL-008412',
    summary: 'Contrato Internacional de Suministro y Compraventa de Café Verde por USD 445.000,00 para abastecer 7.500 quintales de café pergamino lavado.',
    clauses: [
      {
        title: 'PRIMERA: Especificaciones y Calidad de Exportación',
        content: 'Suministro de café arábica pergamino lavado con humedad < 12% y certificado fitosanitario de exportación en frontera Cúcuta - San Antonio.'
      }
    ]
  }
];

export const LegalShieldContractsView: React.FC<Props> = ({ company }) => {
  const [activeTab, setActiveTab] = useState<'BATCH_MATRIX' | 'SINGLE_CONTRACT'>('BATCH_MATRIX');
  const [selectedContract, setSelectedContract] = useState<LegalEntityBatchContract>(LEGAL_ENTITY_BATCH_CONTRACTS[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBatchContracts = LEGAL_ENTITY_BATCH_CONTRACTS.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contractCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.repName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVES = LEGAL_ENTITY_BATCH_CONTRACTS.reduce((acc, c) => acc + c.amountVES, 0);
  const totalUSD = LEGAL_ENTITY_BATCH_CONTRACTS.reduce((acc, c) => acc + c.amountUSD, 0);
  const totalQtl = LEGAL_ENTITY_BATCH_CONTRACTS.reduce((acc, c) => acc + c.coffeeQtl, 0);

  const handleExportSingleContractWord = (ctr: LegalEntityBatchContract) => {
    const clausesHtml = ctr.clauses
      .map(
        (c) => `
        <h3 style="color:#0F172A; font-size:11pt; font-weight:bold; margin-top:12pt; margin-bottom:4pt; border-bottom:1px solid #CBD5E1; padding-bottom:3pt; font-family:Arial, sans-serif;">${c.title}</h3>
        <p style="text-align:justify; font-size:10pt; line-height:1.5; color:#334155; margin-bottom:10pt; font-family:Calibri, Arial, sans-serif;">${c.content}</p>
      `
      )
      .join('');

    const htmlContent = `
      <div style="font-family:Calibri, Arial, sans-serif; padding:15pt;">
        <div style="text-align:center; border-bottom:2px solid #0F172A; padding-bottom:10pt; margin-bottom:15pt;">
          <h1 style="color:#0F172A; font-size:16pt; margin:0; text-transform:uppercase; font-family:Arial, sans-serif;">${company.name}</h1>
          <p style="color:#475569; font-size:9pt; margin:3pt 0;"><strong>R.I.F.:</strong> ${company.rif} &middot; <strong>CÓDIGO DE REGISTRO BANCARIO:</strong> ${ctr.contractCode}</p>
          <h2 style="color:#B45309; font-size:13pt; margin-top:8pt; text-transform:uppercase; font-family:Arial, sans-serif;">CONTRATO DE MANDATO Y GESTIÓN DE IMPORTACIÓN CON FINANCIAMIENTO MEDIANTE ANTICIPOS</h2>
          <p style="color:#1E293B; font-size:10pt; font-weight:bold;">INSTRUMENTO JURÍDICO AUDITABLE SUDEBAN / SENIAT &middot; ${ctr.batchCode}</p>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-bottom:15pt; background-color:#FEF3C7; border:1px solid #F59E0B;">
          <tr>
            <td style="padding:10pt; font-size:10pt; color:#78350F; line-height:1.6;">
              <strong>1. MANDANTE (CLIENTE):</strong> ${ctr.companyName} (RIF: ${ctr.rif})<br/>
              <strong>2. REPRESENTANTE LEGAL:</strong> ${ctr.repName} (C.I. ${ctr.repId})<br/>
              <strong>3. MANDATARIO (INTERMEDIARIO):</strong> ${company.name} (RIF: ${company.rif})<br/>
              <strong>4. LOTE DE IMPORTACIÓN ASIGNADO:</strong> ${ctr.batchCode}<br/>
              <strong>5. MONTO EN CUSTODIA (PASIVO NIIF 15):</strong> Bs. ${ctr.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${ctr.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)<br/>
              <strong>6. VOLUMEN COMPROMETIDO:</strong> ${ctr.coffeeQtl.toLocaleString('es-VE')} Quintales de Café Pergamino Lavado<br/>
              <strong>7. FECHA DE SUSCRIPCIÓN:</strong> ${ctr.date} &middot; <strong>FACTURA DEFINITIVA:</strong> Octubre 2026 (${ctr.octoberInvoiceRef})
            </td>
          </tr>
        </table>

        ${clausesHtml}

        <div style="margin-top:40pt; page-break-inside:avoid;">
          <p style="font-size:9pt; color:#64748B; text-align:center; margin-bottom:30pt;">
            En fe de conformidad y para resguardo jurídico de las partes y certificación ante instituciones financieras y tributarias, se firma el presente instrumento.
          </p>
          <table style="width:100%; border:none; margin-top:20pt;">
            <tr style="border:none; background:none;">
              <td style="border:none; width:50%; text-align:center; font-size:9pt; vertical-align:top;">
                _____________________________________<br/>
                <strong style="color:#0F172A;">${company.legalRepresentative}</strong><br/>
                Director General &mdash; ${company.name}<br/>
                C.I. V-14.892.301 &middot; RIF: ${company.rif}
              </td>
              <td style="border:none; width:50%; text-align:center; font-size:9pt; vertical-align:top;">
                _____________________________________<br/>
                <strong style="color:#0F172A;">${ctr.repName}</strong><br/>
                Representante Legal &mdash; ${ctr.companyName}<br/>
                C.I. ${ctr.repId} &middot; RIF: ${ctr.rif}
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top:30pt; padding-top:8pt; border-t:1px solid #E2E8F0; text-align:center; font-size:8pt; color:#94A3B8;">
          CERTIFICACIÓN DE COMPLIANCE &middot; ARCHIVADO EN EXPEDIENTE SUDEBAN / SENIAT BBU-2026-ONI-094
        </div>
      </div>
    `;

    exportToWord(`${ctr.contractCode}_${ctr.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.doc`, ctr.companyName, htmlContent);
  };

  const handleExportAllBatchContractsWord = () => {
    const contractsHtml = LEGAL_ENTITY_BATCH_CONTRACTS.map((ctr, index) => {
      const clausesHtml = ctr.clauses
        .map(
          (c) => `
          <h3 style="color:#0F172A; font-size:11pt; font-weight:bold; margin-top:12pt; margin-bottom:4pt; border-bottom:1px solid #CBD5E1; padding-bottom:3pt; font-family:Arial, sans-serif;">${c.title}</h3>
          <p style="text-align:justify; font-size:10pt; line-height:1.5; color:#334155; margin-bottom:10pt; font-family:Calibri, Arial, sans-serif;">${c.content}</p>
        `
        )
        .join('');

      return `
        <div style="${index > 0 ? 'page-break-before:always; margin-top:30pt;' : ''} margin-bottom:30pt;">
          <div style="text-align:center; border-bottom:2px solid #0F172A; padding-bottom:10pt; margin-bottom:15pt;">
            <p style="color:#B45309; font-size:9pt; font-weight:bold; margin:0; font-family:monospace;">CONTRATO DE MANDATO N° ${index + 1} DE 6 &middot; ${ctr.batchCode}</p>
            <h1 style="color:#0F172A; font-size:16pt; margin:3pt 0 0 0; text-transform:uppercase; font-family:Arial, sans-serif;">${company.name}</h1>
            <p style="color:#475569; font-size:9pt; margin:3pt 0;"><strong>R.I.F.:</strong> ${company.rif} &middot; <strong>EXPEDIENTE:</strong> ${ctr.contractCode}</p>
            <h2 style="color:#B45309; font-size:12pt; margin-top:6pt; text-transform:uppercase; font-family:Arial, sans-serif;">CONTRATO DE MANDATO Y GESTIÓN DE IMPORTACIÓN CON FINANCIAMIENTO MEDIANTE ANTICIPOS</h2>
          </div>

          <table style="width:100%; border-collapse:collapse; margin-bottom:15pt; background-color:#FEF3C7; border:1px solid #F59E0B;">
            <tr>
              <td style="padding:10pt; font-size:10pt; color:#78350F; line-height:1.6;">
                <strong>1. MANDANTE (CLIENTE JURÍDICO):</strong> ${ctr.companyName} (RIF: ${ctr.rif})<br/>
                <strong>2. REPRESENTANTE LEGAL:</strong> ${ctr.repName} (C.I. ${ctr.repId})<br/>
                <strong>3. MANDATARIO (INTERMEDIARIO):</strong> ${company.name} (RIF: ${company.rif})<br/>
                <strong>4. LOTE DE IMPORTACIÓN ASIGNADO:</strong> ${ctr.batchCode}<br/>
                <strong>5. MONTO EN CUSTODIA (PASIVO NIIF 15):</strong> Bs. ${ctr.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${ctr.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)<br/>
                <strong>6. VOLUMEN COMPROMETIDO:</strong> ${ctr.coffeeQtl.toLocaleString('es-VE')} Quintales de Café Pergamino Lavado<br/>
                <strong>7. FECHA DE SUSCRIPCIÓN:</strong> ${ctr.date} &middot; <strong>FACTURA DEFINITIVA:</strong> Octubre 2026 (${ctr.octoberInvoiceRef})
              </td>
            </tr>
          </table>

          ${clausesHtml}

          <div style="margin-top:30pt; page-break-inside:avoid;">
            <table style="width:100%; border:none; margin-top:20pt;">
              <tr style="border:none; background:none;">
                <td style="border:none; width:50%; text-align:center; font-size:9pt; vertical-align:top;">
                  _____________________________________<br/>
                  <strong style="color:#0F172A;">${company.legalRepresentative}</strong><br/>
                  Director General &mdash; ${company.name}<br/>
                  C.I. V-14.892.301 &middot; RIF: ${company.rif}
                </td>
                <td style="border:none; width:50%; text-align:center; font-size:9pt; vertical-align:top;">
                  _____________________________________<br/>
                  <strong style="color:#0F172A;">${ctr.repName}</strong><br/>
                  Representante Legal &mdash; ${ctr.companyName}<br/>
                  C.I. ${ctr.repId} &middot; RIF: ${ctr.rif}
                </td>
              </tr>
            </table>
          </div>
        </div>
      `;
    }).join('<hr style="border:1px dashed #CBD5E1; margin:40pt 0;"/>');

    const fullHtml = `
      <div style="font-family:Calibri, Arial, sans-serif; padding:15pt;">
        <div style="text-align:center; margin-bottom:25pt; padding-bottom:15pt; border-bottom:3px solid #0F172A;">
          <h1 style="color:#0F172A; font-size:20pt; margin:0; font-family:Arial, sans-serif;">${company.name} &mdash; EXPEDIENTE LEGAL EDITABLE</h1>
          <p style="color:#475569; font-size:11pt; margin-top:4pt;">R.I.F. ${company.rif} &middot; COMPILACIÓN EDITABLE DE CONTRATOS DE MANDATO POR LOTES EN WORD</p>
          <p style="color:#B45309; font-size:12pt; font-weight:bold; margin-top:6pt;">6 CONTRATOS DE MANDATO DE IMPORTACIÓN DE CAFÉ CON FINANCIAMIENTO MEDIANTE ANTICIPOS</p>
        </div>

        <div style="background-color:#F1F5F9; border-left:4px solid #0F172A; padding:10pt 12pt; margin-bottom:25pt; font-size:10pt; color:#334155;">
          <strong>NOTA EDITABLE DE CUMPLIMIENTO BANCARIO Y FISCAL:</strong> El presente archivo en formato Microsoft Word (.doc / .docx) contiene los seis (6) contratos marco individuales de mandato de gestión de importación suscritos con las empresas jurídicas. Este archivo se proporciona con el fin de permitir la modificación directa de cualquier cláusula, nombre de representante legal o condición comercial específica antes de su impresión o remisión a las autoridades de inspección bancaria (SUDEBAN / Banesco Compliance).
        </div>

        ${contractsHtml}
      </div>
    `;

    exportToWord('Contratos_de_Mandato_por_Lotes_Personas_Juridicas_Agricola_Oni.doc', 'Contratos de Mandato por Lotes Word', fullHtml);
  };

  const handleExportBatchContractsExcel = () => {
    const headers = [
      '# Lote',
      'Código Contrato',
      'Razón Social Legal Cliente',
      'R.I.F. Legal SENIAT',
      'Representante Legal',
      'C.I. Rep. Legal',
      'Banco Origen',
      'Monto Anticipo (Bs.)',
      'Contravalor ($ USD BCV)',
      'Volumen (Quintales Café)',
      'Estatus Fiduciario / Custodia',
      'Factura Definitiva (Octubre 2026)'
    ];

    const dataRows = LEGAL_ENTITY_BATCH_CONTRACTS.map((c) => [
      c.batchCode,
      c.contractCode,
      c.companyName,
      c.rif,
      c.repName,
      c.repId,
      c.bankOrigin,
      c.amountVES,
      c.amountUSD,
      c.coffeeQtl,
      c.status,
      c.octoberInvoiceRef
    ]);

    const totalsRow = [
      'TOTAL GENERAL',
      '6 CONTRATOS MARCO',
      '6 CLIENTES JURÍDICOS',
      'COMPLIANCE SUDEBAN',
      '',
      '',
      '',
      totalVES,
      totalUSD,
      totalQtl,
      '100% FONDOS EN CUSTODIA',
      'ABSORCIÓN EN OCTUBRE 2026'
    ];

    exportToExcelXlsx({
      filename: 'Contratos_por_Lote_Personas_Juridicas_Agricola_Oni_2026.xlsx',
      sheetName: 'Contratos por Lotes',
      companyName: company.name,
      companyRif: company.rif,
      title: 'MATRIZ DE CONTRATOS DE MANDATO POR LOTE DE IMPORTACIÓN - PERSONAS JURÍDICAS',
      subtitle: 'Resguardo Jurídico de Fondos en Custodia (Pasivo NIIF 15), Trazabilidad Bancaria Banesco y Absorción en Octubre 2026',
      headers,
      rows: dataRows,
      totalsRow,
      columnWidths: [18, 22, 38, 16, 24, 14, 22, 22, 20, 18, 32, 24]
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Tabs */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Blindaje Legal & Contratos de Mandato por Lotes
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Contratos de Mandato de Importación para las 6 Personas Jurídicas &middot; Blindaje SUDEBAN, SENIAT, NIIF 15 y Prevención de Legitimación
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          <div className="flex bg-stone-950 p-1 rounded-lg border border-stone-800">
            <button
              onClick={() => setActiveTab('BATCH_MATRIX')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'BATCH_MATRIX'
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Matriz de Lotes ({LEGAL_ENTITY_BATCH_CONTRACTS.length})
            </button>
            <button
              onClick={() => setActiveTab('SINGLE_CONTRACT')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'SINGLE_CONTRACT'
                  ? 'bg-amber-600 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Lector de Contrato
            </button>
          </div>

          <button
            onClick={handleExportAllBatchContractsWord}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
            title="Descargar todos los contratos de las 6 personas jurídicas en formato Word (.doc) para modificarlos"
          >
            <FileDown className="w-3.5 h-3.5" />
            Descargar Lotes Word (.doc)
          </button>

          <button
            onClick={handleExportBatchContractsExcel}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
            title="Descargar matriz completa de contratos por lote en formato Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Descargar Lotes Excel (.xlsx)
          </button>
        </div>
      </div>

      {activeTab === 'BATCH_MATRIX' ? (
        /* Batch Contracts Matrix Tab */
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
              <span className="text-xs text-stone-400 block">Total Contratos de Mandato</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">
                6 Empresas Jurídicas
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                100% con RIF y Rep. Legal registrado
              </span>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
              <span className="text-xs text-stone-400 block">Monto en Custodia (Pasivo NIIF 15)</span>
              <span className="text-xl font-bold text-white mt-1 block">
                Bs. {totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-emerald-400 mt-0.5 block font-mono">
                ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </span>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
              <span className="text-xs text-stone-400 block">Volumen Comprometido en Café</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">
                {totalQtl.toLocaleString('es-VE')} Quintales
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                Café Arábica Pergamino Lavado Colombia
              </span>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
              <span className="text-xs text-stone-400 block">Estatus de Absorción Fiscal</span>
              <span className="text-xl font-bold text-blue-400 mt-1 block">
                Octubre de 2026
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Emisión de Factura + Retenciones Prov. 0049
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 p-3 rounded-lg">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por lote, código de contrato, empresa cliente o RIF..."
              className="bg-transparent text-xs text-stone-200 placeholder-stone-500 focus:outline-none w-full"
            />
          </div>

          {/* Table of Batch Contracts */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3"># Lote</th>
                    <th className="p-3">Código Contrato</th>
                    <th className="p-3">Razón Social Legal</th>
                    <th className="p-3">R.I.F. SENIAT</th>
                    <th className="p-3">Representante Legal</th>
                    <th className="p-3">Banco Origen</th>
                    <th className="p-3 text-right">Monto Anticipo (Bs.)</th>
                    <th className="p-3 text-right">USD ($)</th>
                    <th className="p-3 text-right">Vol. (Qtl)</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-stone-300">
                  {filteredBatchContracts.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-800/50 transition-colors">
                      <td className="p-3 font-mono text-amber-400 font-bold whitespace-nowrap">
                        {c.batchCode}
                      </td>
                      <td className="p-3 font-mono text-stone-200 font-semibold whitespace-nowrap">
                        {c.contractCode}
                      </td>
                      <td className="p-3 font-bold text-white max-w-xs">
                        {c.companyName}
                      </td>
                      <td className="p-3 font-mono text-stone-300 whitespace-nowrap">
                        {c.rif}
                      </td>
                      <td className="p-3 text-stone-300">
                        {c.repName} <span className="text-[10px] text-stone-500 block">({c.repId})</span>
                      </td>
                      <td className="p-3 text-stone-400 text-[11px]">
                        {c.bankOrigin}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-stone-100">
                        Bs. {c.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-400">
                        ${c.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-mono text-amber-300 font-bold">
                        {c.coffeeQtl.toLocaleString('es-VE')}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedContract(c);
                              setActiveTab('SINGLE_CONTRACT');
                            }}
                            className="px-2 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                            title="Ver contrato en lector"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Ver</span>
                          </button>
                          <button
                            onClick={() => handleExportSingleContractWord(c)}
                            className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                            title="Descargar este contrato en Word (.doc) para modificarlo"
                          >
                            <FileDown className="w-3 h-3" />
                            <span>Word</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-stone-950 font-bold text-white font-mono text-xs border-t-2 border-stone-800">
                  <tr>
                    <td colSpan={6} className="p-3 text-amber-400">
                      TOTAL GENERAL CONTRATOS POR LOTE ({filteredBatchContracts.length} CLIENTES JURÍDICOS)
                    </td>
                    <td className="p-3 text-right text-amber-300">
                      Bs. {totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-emerald-400">
                      ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-amber-300">
                      {totalQtl.toLocaleString('es-VE')} Qtl
                    </td>
                    <td className="p-3 text-center text-stone-500 text-[10px]">
                      NIIF 15 PASIVO
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Single Contract Document Viewer Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Contract Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-stone-400 tracking-wider font-mono">
              Expediente de Contratos Vigentes
            </h3>

            <div className="space-y-2">
              <span className="text-[10px] text-amber-400 font-mono font-bold block uppercase px-1">
                Contratos de Mandato por Lotes (Personas Jurídicas)
              </span>
              {LEGAL_ENTITY_BATCH_CONTRACTS.map((ctr) => {
                const isSelected = selectedContract.id === ctr.id;
                return (
                  <div
                    key={ctr.id}
                    onClick={() => setSelectedContract(ctr)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-stone-800 border-amber-500 shadow-md ring-1 ring-amber-500/20'
                        : 'bg-stone-900/80 border-stone-800 hover:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-amber-400 font-semibold">{ctr.batchCode}</span>
                      <span className="text-[10px] text-stone-400">{ctr.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-stone-100">{ctr.companyName}</h4>
                    <p className="text-[11px] font-mono text-stone-400 mt-0.5">RIF: {ctr.rif}</p>
                    <p className="text-[10px] text-emerald-400 mt-1 font-mono">
                      Bs. {ctr.amountVES.toLocaleString('es-VE')} (${ctr.amountUSD.toLocaleString('en-US')} USD)
                    </p>
                  </div>
                );
              })}

              <span className="text-[10px] text-stone-400 font-mono font-bold block uppercase px-1 pt-3">
                Otros Contratos Marco y Préstamos
              </span>
              {SPECIAL_CONTRACTS.map((ctr) => {
                const isSelected = selectedContract.id === ctr.id;
                return (
                  <div
                    key={ctr.id}
                    onClick={() => setSelectedContract(ctr as any)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-stone-800 border-amber-500 shadow-md ring-1 ring-amber-500/20'
                        : 'bg-stone-900/80 border-stone-800 hover:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-blue-400 font-semibold">{ctr.contractCode}</span>
                      <span className="text-[10px] text-stone-400">{ctr.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-stone-100">{ctr.companyName}</h4>
                    <p className="text-[11px] text-stone-400 mt-0.5">{ctr.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Contract Paper Document */}
          <div className="lg:col-span-8 space-y-4">
            {/* Top Toolbar for Active Paper Contract */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-900 border border-stone-800 p-3 rounded-xl no-print">
              <span className="text-xs font-mono text-amber-400 font-bold">
                CÓDIGO: {selectedContract.contractCode} &middot; {selectedContract.batchCode}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportSingleContractWord(selectedContract)}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
                  title="Descargar este contrato en formato Microsoft Word (.doc) para editar"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Word (.doc)
                </button>

                <button
                  onClick={async () => {
                    const clausesHtml = selectedContract.clauses
                      .map(
                        (c) => `
                      <h3>${c.title}</h3>
                      <p>${c.content}</p>
                    `
                      )
                      .join('');

                    const htmlContent = `
                      <h1>${company.name} &mdash; RIF ${company.rif}</h1>
                      <h2>CONTRATO DE MANDATO Y GESTIÓN DE IMPORTACIÓN (${selectedContract.batchCode})</h2>
                      <p><strong>Código de Registro:</strong> ${selectedContract.contractCode} &middot; <strong>Fecha:</strong> ${selectedContract.date}</p>
                      <div class="highlight-box">
                        <strong>Mandante:</strong> ${selectedContract.companyName} (RIF: ${selectedContract.rif})<br>
                        <strong>Representante:</strong> ${selectedContract.repName} (C.I. ${selectedContract.repId})<br>
                        <strong>Monto en Custodia:</strong> Bs. ${selectedContract.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${selectedContract.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)
                      </div>
                      ${clausesHtml}
                      <div class="footer-signatures">
                        <table style="border:none;margin-top:40pt">
                          <tr style="border:none;background:none">
                            <td style="border:none;width:50%;text-align:center">
                              _____________________________________<br>
                              <strong>${company.legalRepresentative}</strong><br>
                              Director General Agrícola Oni C.A.
                            </td>
                            <td style="border:none;width:50%;text-align:center">
                              _____________________________________<br>
                              <strong>${selectedContract.repName}</strong><br>
                              Representante Legal ${selectedContract.companyName}
                            </td>
                          </tr>
                        </table>
                      </div>
                    `;
                    await exportHtmlToPdf(`${selectedContract.contractCode}_Agricola_Oni.pdf`, selectedContract.companyName, htmlContent);
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF (.pdf)
                </button>

                <button
                  onClick={() => exportToPdfPrint()}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded text-xs transition-colors flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir
                </button>
              </div>
            </div>

            {/* Paper Document Layout */}
            <div className="bg-white text-stone-900 rounded-xl p-8 sm:p-12 shadow-xl border border-stone-200 font-serif">
              {/* Header */}
              <div className="text-center border-b-2 border-stone-900 pb-5 mb-6 font-sans">
                <span className="text-xs font-bold font-mono text-amber-900 tracking-widest block uppercase">
                  INSTRUMENTO JURÍDICO AUDITABLE &middot; {selectedContract.batchCode}
                </span>
                <h2 className="text-xl font-bold mt-2 text-stone-950 uppercase tracking-tight">
                  Contrato de Mandato y Gestión de Importación con Financiamiento Mediante Anticipos
                </h2>
                <p className="text-xs font-semibold text-stone-700 mt-1">
                  Entre: AGRÍCOLA ONI C.A. (Mandatario) y {selectedContract.companyName} (Mandante)
                </p>
                <p className="text-xs text-stone-500 mt-0.5 font-mono">
                  RIF Mandante: {selectedContract.rif} &middot; Registro Cómputo: {selectedContract.contractCode}
                </p>
              </div>

              {/* Summary Callout */}
              <div className="bg-stone-50 border border-stone-300 rounded p-4 mb-6 text-xs text-stone-800 leading-relaxed font-sans">
                <p><strong>Síntesis del Acuerdo Fiduciario:</strong> {selectedContract.summary}</p>
                <div className="mt-2 pt-2 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  <div><strong>Monto Recibido:</strong> Bs. {selectedContract.amountVES.toLocaleString('es-VE')}</div>
                  <div><strong>Contravalor Divisas:</strong> ${selectedContract.amountUSD.toLocaleString('en-US')} USD</div>
                  <div><strong>Volumen Café:</strong> {selectedContract.coffeeQtl.toLocaleString('es-VE')} Quintales</div>
                </div>
              </div>

              {/* Clauses */}
              <div className="space-y-5 text-xs text-justify leading-relaxed text-stone-900">
                {selectedContract.clauses.map((clause, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h4 className="font-bold text-stone-950 text-sm border-b border-stone-200 pb-0.5">
                      {clause.title}
                    </h4>
                    <p className="text-stone-800">{clause.content}</p>
                  </div>
                ))}
              </div>

              {/* Signature Area */}
              <div className="mt-12 pt-8 border-t-2 border-stone-800 grid grid-cols-2 gap-8 text-center text-[11px] font-sans">
                <div>
                  <p className="text-stone-400 font-mono text-[9px] mb-8">
                    POR EL MANDATARIO E INTERMEDIARIO
                  </p>
                  <div className="border-t border-stone-700 pt-1">
                    <p className="font-bold text-stone-950">{company.legalRepresentative}</p>
                    <p className="text-stone-600">Director General &mdash; {company.name}</p>
                    <p className="text-stone-500 font-mono text-[10px]">C.I. V-14.892.301 &middot; RIF: {company.rif}</p>
                  </div>
                </div>

                <div>
                  <p className="text-stone-400 font-mono text-[9px] mb-8">
                    POR EL MANDANTE Y CLIENTE
                  </p>
                  <div className="border-t border-stone-700 pt-1">
                    <p className="font-bold text-stone-950">{selectedContract.repName}</p>
                    <p className="text-stone-600">Representante Legal &mdash; {selectedContract.companyName}</p>
                    <p className="text-stone-500 font-mono text-[10px]">C.I. {selectedContract.repId} &middot; RIF: {selectedContract.rif}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-3 border-t border-stone-200 text-[9px] text-stone-400 text-center font-mono font-sans">
                CERTIFICACIÓN DE COMPLIANCE &middot; ARCHIVADO EN EXPEDIENTE SUDEBAN / SENIAT BBU-2026-ONI-094
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
