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
    contractCode: 'CTR-FUT-2026-ETN-001',
    companyName: 'EMPRESA ETN, C.A.',
    rif: 'J-50100487-0',
    repName: 'Carlos Eduardo Mendoza',
    repId: 'V-15.482.901',
    bankOrigin: 'BFC (0151) / Banesco (0134)',
    amountVES: 210000000.00,
    amountUSD: 311111.11,
    coffeeQtl: 2100,
    date: '15 de Marzo de 2026',
    status: 'ANTICIPO EN CUSTODIA / GESTIÓN DE ACOPIO NACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-001',
    summary: 'Contrato a Futuro de Compraventa e Intermediación de Café Nacional con Financiamiento Mediante Anticipos en Bolívares a Tasa Oficial BCV suscrito entre AGRÍCOLA ONI, C.A. y EMPRESA ETN, C.A. para la reserva y acopio de 2.100 quintales de café verde venezolano.',
    clauses: [
      {
        title: 'PRIMERA: Objeto, Intermediación en Venezuela y Custodia de Fondos',
        content: 'EMPRESA ETN, C.A. (EL COMPRADOR) encomienda formalmente a AGRÍCOLA ONI, C.A. (EL INTERMEDIARIO) la gestión de compra, intermediación y acopio de café verde en el mercado nacional venezolano (zonas productoras de Portuguesa, Lara y Trujillo) con productores y empresas locales. Las partes dejan constancia de que los recursos por Bs. 210.000.000,00 transferidos en cuenta Banesco constituyen un anticipo en bolívares calculado a tasa oficial BCV, registrado contablemente como Pasivo Corriente (Anticipos de Clientes NIIF 15) para operar en el mercado cafetalero.'
      },
      {
        title: 'SEGUNDA: Código de Lote Nacional y Trazabilidad Bancaria',
        content: 'Los fondos transferidos se asocian al Código de Lote LOTE-2026-CAF-001. EL INTERMEDIARIO demuestra el rastro íntegro de efectivo, evidenciando que los bolívares recibidos en Banesco se aplican a la liquidación de cosechas a caficultores venezolanos, flete terrestre nacional y pagos operativos a tasa oficial BCV conforme a la ley cambiaria.'
      },
      {
        title: 'TERCERA: Soporte de Legalidad Agroalimentaria Nacional',
        content: 'Para estricto cumplimiento ante Banesco, SUDEBAN y SENIAT, la operación se respalda en Guías de Movilización Agroalimentaria SICA N° GUIA-SICA-VE-2026-004128, Registro CVC (Corporación Venezolana del Café) y boletas de recepción y pesaje en galpones de Acarigua/Araure.'
      },
      {
        title: 'CUARTA: Cláusula de Finiquito, Sustitución de Factura y Extinción de Anticipo (Octubre 2026)',
        content: 'Las partes convienen expresamente que en el mes de OCTUBRE DE 2026, al completarse la entrega física de los 2.100 quintales de café nacional, AGRÍCOLA ONI, C.A. emitirá la factura fiscal de ventas definitiva FAC-OCT-2026-001 a tasa oficial BCV. Dicha factura de ventas sustituirá y eliminará al 100% el saldo del anticipo de cliente, perfeccionando la venta mercantil y liquidando las retenciones de IVA e ISLR ante el SENIAT.'
      }
    ]
  },
  {
    id: 'ctr-pj-002',
    batchCode: 'LOTE-2026-CAF-002',
    contractCode: 'CTR-FUT-2026-DIS-002',
    companyName: 'DISTRIBUIDORA DIS, C.A.',
    rif: 'J-30643703-7',
    repName: 'Luis Alberto Salazar',
    repId: 'V-12.839.402',
    bankOrigin: 'Provincial (0108) / Banesco (0134)',
    amountVES: 240000000.00,
    amountUSD: 355555.56,
    coffeeQtl: 2400,
    date: '10 de Abril de 2026',
    status: 'ANTICIPO EN CUSTODIA / GESTIÓN DE ACOPIO NACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-002',
    summary: 'Contrato a Futuro de Compraventa e Intermediación de Café Nacional con Financiamiento Mediante Anticipos en Bolívares a Tasa Oficial BCV para la compra y acopio de 2.400 quintales de café pergamino lavado asignados al Lote LOTE-2026-CAF-002.',
    clauses: [
      {
        title: 'PRIMERA: Objeto, Intermediación en Venezuela y Custodia de Fondos',
        content: 'DISTRIBUIDORA DIS, C.A. (EL COMPRADOR) entrega fondos en calidad de anticipo en bolívares a AGRÍCOLA ONI, C.A. (EL INTERMEDIARIO) para que gestione compras en el mercado nacional con empresas y caficultores de Portuguesa y Lara. Todo el café se adquiere en territorio venezolano a valor oficial BCV.'
      },
      {
        title: 'SEGUNDA: Liquidación y Sustitución de Factura en Octubre 2026',
        content: 'En el mes de OCTUBRE DE 2026 se emite la factura de ventas definitiva FAC-OCT-2026-002 a tasa BCV contra la cual se eliminará de la contabilidad el pasivo por anticipo de clientes.'
      }
    ]
  },
  {
    id: 'ctr-pj-003',
    batchCode: 'LOTE-2026-CAF-003',
    contractCode: 'CTR-FUT-2026-ORU-003',
    companyName: 'GRUPO AGROINDUSTRIAL ORU, C.A.',
    rif: 'J-41100717-0',
    repName: 'Roberto Antonio Guerrero',
    repId: 'V-18.294.103',
    bankOrigin: 'Banco de Venezuela (0102)',
    amountVES: 185000000.00,
    amountUSD: 274074.07,
    coffeeQtl: 1850,
    date: '22 de Abril de 2026',
    status: 'ANTICIPO EN CUSTODIA / GESTIÓN DE ACOPIO NACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-003',
    summary: 'Contrato a Futuro e Intermediación Comercial para la compra y acopio de 1.850 quintales de café verde arábica venezolano a valor oficial BCV asignados al Lote LOTE-2026-CAF-003.',
    clauses: [
      {
        title: 'PRIMERA: Objeto, Intermediación en Venezuela y Custodia de Anticipos',
        content: 'GRUPO AGROINDUSTRIAL ORU, C.A. encomienda a AGRÍCOLA ONI, C.A. la intermediación comercial para la compra y acopio de café verde nacional en Venezuela. Los recursos por Bs. 185.000.000,00 se entregan en calidad de anticipos en bolívares a tasa oficial BCV (Pasivo Corriente NIIF 15) para asegurar cosecha nacional.'
      },
      {
        title: 'SEGUNDA: Vinculación al Lote Nacional y Trazabilidad',
        content: 'Las transferencias se vinculan estrictamente al Código de Lote LOTE-2026-CAF-003, demostrando la aplicación de los fondos en la adquisición de cosechas a caficultores de Portuguesa y Lara a tasa oficial BCV.'
      },
      {
        title: 'TERCERA: Soportes de Cumplimiento Agroalimentario Nacional',
        content: 'Anexo de documentación exigida por la Intendencia de Protección al Sector Bancario: guías de movilización agroalimentaria SICA, permisos CVC y boletas de pesaje en centros de acopio.'
      },
      {
        title: 'CUARTA: Absorción de Pasivo y Sustitución de Factura en Octubre 2026',
        content: 'La entrega física del café nacional en el mes de OCTUBRE DE 2026 activará la emisión de la factura de venta definitiva FAC-OCT-2026-003 a tasa BCV, eliminando el anticipo del pasivo contable y liquidando el IVA y tributos SENIAT.'
      }
    ]
  },
  {
    id: 'ctr-pj-004',
    batchCode: 'LOTE-2026-CAF-004',
    contractCode: 'CTR-FUT-2026-SOL-004',
    companyName: 'INVERSIONES SOLBTR, C.A.',
    rif: 'J-50013440-3',
    repName: 'Gabriel José Torrealba',
    repId: 'V-16.740.291',
    bankOrigin: 'Banco Activo (0171) / Banco Plaza (0138)',
    amountVES: 165000000.00,
    amountUSD: 244444.44,
    coffeeQtl: 1650,
    date: '18 de Mayo de 2026',
    status: 'ANTICIPO EN CUSTODIA / GESTIÓN DE ACOPIO NACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-004',
    summary: 'Contrato a Futuro de Compraventa e Intermediación de Café Nacional para el acopio de 1.650 quintales destinados a la industria torrefactora nacional a tasa oficial BCV (Lote LOTE-2026-CAF-004).',
    clauses: [
      {
        title: 'PRIMERA: Mandato Comercial de Compra Nacional y Naturaleza de los Fondos',
        content: 'INVERSIONES SOLBTR, C.A. asigna a AGRÍCOLA ONI, C.A. la gestión de intermediación y procura de café en Venezuela. El desembolso de Bs. 165.000.000,00 se registra como Anticipos Recibidos de Clientes (Pasivo NIIF 15) en bolívares a tasa oficial BCV sin emisión previa de factura de venta.'
      },
      {
        title: 'SEGUNDA: Asignación de Lote y Trazabilidad en Cuenta Banesco',
        content: 'Operación asociada al Lote LOTE-2026-CAF-004. Los fondos en moneda nacional se emplean para liquidar compras de café y transporte terrestre pesado en el eje cafetalero nacional.'
      },
      {
        title: 'TERCERA: Soportes y Anexos de Transparencia Compliance',
        content: 'Integración en el expediente bancario de guías SICA, constancias de la Corporación Venezolana del Café (CVC) y boletas de recepción en almacén de Araure.'
      },
      {
        title: 'CUARTA: Cláusula de Finiquito y Sustitución de Factura en Octubre 2026',
        content: 'En OCTUBRE DE 2026 se procederá al cruce contable y emisión de la factura de ventas definitiva FAC-OCT-2026-004 a tasa BCV, eliminando en su totalidad la cuenta de pasivo y liquidando el IVA correspondiente ante el SENIAT.'
      }
    ]
  },
  {
    id: 'ctr-pj-005',
    batchCode: 'LOTE-2026-CAF-005',
    contractCode: 'CTR-FUT-2026-RIK-005',
    companyName: 'COMERCIALIZADORA RIK Y ALIADOS, C.A.',
    rif: 'J-50145725-2',
    repName: 'Ricardo José Morales',
    repId: 'V-19.302.844',
    bankOrigin: 'Bancamiga (0172) / Banesco (0134)',
    amountVES: 190000000.00,
    amountUSD: 281481.48,
    coffeeQtl: 1900,
    date: '05 de Junio de 2026',
    status: 'ANTICIPO EN CUSTODIA / GESTIÓN DE ACOPIO NACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-005',
    summary: 'Contrato a Futuro de Compraventa e Intermediación de Café Verde Nacional para la entrega de 1.900 quintales asignados al Lote LOTE-2026-CAF-005 a tasa BCV.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Mandato e Imputación Contable',
        content: 'COMERCIALIZADORA RIK Y ALIADOS, C.A. encomienda a AGRÍCOLA ONI, C.A. la intermediación comercial para la compra de café en Venezuela. Los fondos por Bs. 190.000.000,00 entregados en custodia constituyen Pasivo Corriente por anticipos de clientes de conformidad con NIIF 15 a tasa BCV.'
      },
      {
        title: 'SEGUNDA: Rastro de Efectivo y Lote Nacional',
        content: 'Fondos vinculados al Lote LOTE-2026-CAF-005, verificados mediante transferencias bancarias desde Bancamiga hacia Banesco, aplicados íntegramente a compra de cosechas en territorio venezolano.'
      },
      {
        title: 'TERCERA: Soportes Agrícolas y Prevención de Legitimación',
        content: 'Expediente respaldado con licencias de movilización SICA, guías de origen CVC y contratos de transporte terrestre nacional.'
      },
      {
        title: 'CUARTA: Eliminación de Pasivo y Emisión de Factura de Venta (Octubre 2026)',
        content: 'En OCTUBRE DE 2026, con la entrega definitiva del café, se emitirá la factura fiscal de ventas FAC-OCT-2026-005 para la extinción total del anticipo y liquidación de tributos SENIAT.'
      }
    ]
  },
  {
    id: 'ctr-pj-006',
    batchCode: 'LOTE-2026-CAF-006',
    contractCode: 'CTR-FUT-2026-JAG-006',
    companyName: 'CORPORACIÓN AGROINDUSTRIAL J, C.A.',
    rif: 'J-50120729-0',
    repName: 'Julio César Benítez',
    repId: 'V-14.209.833',
    bankOrigin: 'Banco de Venezuela (0102)',
    amountVES: 175000000.00,
    amountUSD: 259259.26,
    coffeeQtl: 1750,
    date: '12 de Julio de 2026',
    status: 'ANTICIPO EN CUSTODIA / GESTIÓN DE ACOPIO NACIONAL',
    octoberInvoiceRef: 'FAC-OCT-2026-006',
    summary: 'Contrato a Futuro de Intermediación y Procura Nacional de Café Pergamino para la asignación de 1.750 quintales de café verde venezolano (Lote LOTE-2026-CAF-006).',
    clauses: [
      {
        title: 'PRIMERA: Mandato Comercial y Custodia de Anticipo',
        content: 'CORPORACIÓN AGROINDUSTRIAL J, C.A. designa a AGRÍCOLA ONI, C.A. como su intermediario comercial en Venezuela. El anticipo de Bs. 175.000.000,00 constituye fondo en custodia a tasa BCV sin generar hecho imponible del IVA hasta la entrega formal y facturación de la mercancía.'
      },
      {
        title: 'SEGUNDA: Código de Lote y Trazabilidad Bancaria',
        content: 'Operación asociada al Lote LOTE-2026-CAF-006. Trazabilidad completa de los desembolsos a productores y pagos operativos a tasa oficial BCV en Banesco Banco Universal.'
      },
      {
        title: 'TERCERA: Expediente de Cumplimiento Bancario',
        content: 'Respaldado con guías de movilización agroalimentaria SICA, boletas de pesaje CVC y facturas de transporte terrestre nacional.'
      },
      {
        title: 'CUARTA: Liquidación de Pasivo y Sustitución de Factura (Octubre 2026)',
        content: 'La entrega física en OCTUBRE DE 2026 generará la factura formal de ventas FAC-OCT-2026-006 a tasa BCV, extinguiendo la obligación en pasivo e imputando los comprobantes de retención tributaria.'
      }
    ]
  }
];

// Combine with other special contracts (Becerra, Accionista Propietario Elias Rafael Trías Abreu, Personas Naturales)
export const SPECIAL_CONTRACTS: LegalEntityBatchContract[] = [
  {
    id: 'ctr-01',
    batchCode: 'LÍNEA ROTATIVA Y MUTUO',
    contractCode: 'CTR-MUT-2026-BECERRA-600M',
    companyName: 'MANUEL BECERRA (SOCIO Y ALIADO)',
    rif: 'V-12894012',
    repName: 'Manuel Becerra',
    repId: 'V-12.894.012',
    bankOrigin: 'Banesco Banco Universal (0134)',
    amountVES: 600000000.00,
    amountUSD: 888888.89,
    coffeeQtl: 0,
    date: '02 de Enero de 2026',
    status: 'LÍNEA ROTATIVA ACTIVA CON INTERESES',
    octoberInvoiceRef: 'PAGARÉ NOTARIADO N° 4012 / ASIENTO INT-BECERRA',
    summary: 'Contrato de Préstamo Mutuo Mercantil con Intereses y Línea de Crédito Rotativa suscrito con Manuel Becerra por hasta Bs. 600.000.000,00. Generación de intereses devengados por Bs. 13.924.047,66 reconocidos en el Estado de Resultados.',
    clauses: [
      {
        title: 'PRIMERA: Objeto y Límite de la Línea de Crédito Rotativa',
        content: 'AGRÍCOLA ONI, C.A. (EL PRESTAMISTA) concede a favor de MANUEL BECERRA (EL PRESTATARIO) una línea de crédito rotativa de mutuo comercial por hasta la suma de Seiscientos Millones de Bolívares (Bs. 600.000.000,00) para el financiamiento de operaciones cafetaleras y fomento de acopio.'
      },
      {
        title: 'SEGUNDA: Reembolsos, Amortizaciones y Disminución del Activo Exigible',
        content: 'Durante el período comprendido entre enero y agosto de 2026, EL PRESTATARIO ha efectuado 14 amortizaciones parciales de capital mediante transferencias bancarias a la cuenta Banesco de la empresa por un total de Bs. 186.376.000,00. Dichos reembolsos constituyen recuperación de activo exigible (disminución del saldo por cobrar), por lo cual no constituyen hecho imponible del IVA ni ingreso de ventas.'
      },
      {
        title: 'TERCERA: Tasa de Interés Financiero y Reconocimiento Contable en Estado de Resultados',
        content: 'Las partes convienen una tasa de interés flotante preferencial sobre los saldos deudores de la línea de crédito. Al 31 de agosto de 2026, los intereses financiado causados ascienden a la cantidad de Trece Millones Novecientos Veinticuatro Mil Cuarenta y Siete Bolívares con 66/100 (Bs. 13.924.047,66), equivalentes a USD 17.514,75 al TC oficial BCV de 794,99 VES/USD. Dicho monto se ha reconocido e incorporado de forma transparente en el Estado de Resultados al 31/08/2026 bajo el rubro "Ingresos Financieros por Intereses Contrato Mutuo Manuel Becerra", elevando el activo exigible por cobrar en el Balance General a la cifra de Bs. 325.948.652,96 (Bs. 312.024.605,30 de saldo capital principal + Bs. 13.924.047,66 de intereses causados).'
      },
      {
        title: 'CUARTA: Documentación de Resguardo y Transparencia Compliance',
        content: 'El presente instrumento se autentica mediante Pagaré Notariado N° 4012 y se incorpora al expediente bancario auditado AUD-BAN-2026-ONI-094 para resguardo ante Banesco Compliance y el SENIAT.'
      }
    ]
  },
  {
    id: 'ctr-soc-in',
    batchCode: 'CUENTAS POR PAGAR SOCIOS',
    contractCode: 'CTR-SOCIO-2026-ELIAS-INGRESOS',
    companyName: 'ELIAS RAFAEL TRÍAS ABREU (ACCIONISTA PROPIETARIO Y PRESIDENTE)',
    rif: 'V-23997829',
    repName: 'Elias Rafael Trías Abreu',
    repId: 'V-23.997.829',
    bankOrigin: 'Banco de Venezuela (0102) / Banesco (0134)',
    amountVES: 7649975.00,
    amountUSD: 11266.93,
    coffeeQtl: 0,
    date: '01 de Enero de 2026',
    status: 'APORTES DE LIQUIDEZ Y CAJA CHICA',
    octoberInvoiceRef: 'COMP-SOCIO-IN-2026-001',
    summary: 'Contrato de Mutuo y Aporte de Liquidez de Socio Accionista otorgado por Elias Rafael Trías Abreu (C.I. V-14.892.301), Presidente y Propietario de AGRÍCOLA ONI, C.A. por Bs. 7.649.975,00 para cobertura de gastos de operación rural y caja chica en Banesco.',
    clauses: [
      {
        title: 'PRIMERA: Objeto y Aporte de Liquidez Inmediata',
        content: 'ELIAS RAFAEL TRÍAS ABREU (C.I. V-14.892.301), en su condición de Presidente y Socio Propietario de AGRÍCOLA ONI, C.A. (RIF J-50145638-0), transfiere desde sus cuentas personales hacia la cuenta corriente Banesco de la sociedad fondos en bolívares por un total acumulado de Bs. 7.649.975,00 ($11.266,93 USD) en 21 operaciones bancarias registradas entre enero y agosto de 2026.'
      },
      {
        title: 'SEGUNDA: Clasificación Contable y Exclusión de Ventas Comerciales',
        content: 'De conformidad con los VEN-NIF, dichos abonos se registran contablemente en la cuenta de pasivo corriente "Cuentas por Pagar Socios". En la auditoría bancaria de Banesco, estos fondos se convalidan como aportes de liquidez del accionista, quedando totalmente excluidos del cálculo de ventas gravables o ingresos brutos por comercialización.'
      },
      {
        title: 'TERCERA: Reembolsos y Mutuo Financiero',
        content: 'La sociedad mercantil reembolsará estos montos al socio accionista a medida que la tesorería de la empresa cuente con disponibilidad de liquidez sobrante post-cosecha.'
      }
    ]
  },
  {
    id: 'ctr-soc-out',
    batchCode: 'CUENTAS POR COBRAR SOCIOS',
    contractCode: 'CTR-SOCIO-2026-ELIAS-EGRESOS',
    companyName: 'ELIAS RAFAEL TRÍAS ABREU (AVANCES / EGRESOS ACCIONISTA)',
    rif: 'V-14892301',
    repName: 'Elias Rafael Trías Abreu',
    repId: 'V-14.892.301',
    bankOrigin: 'Banesco Banco Universal (0134)',
    amountVES: 15400000.00,
    amountUSD: 22100.00,
    coffeeQtl: 0,
    date: '15 de Enero de 2026',
    status: 'AVANCES Y REEMBOLSOS A ACCIONISTA',
    octoberInvoiceRef: 'COMP-SOCIO-OUT-2026-001',
    summary: 'Contrato de Préstamo de Tesorería y Regularización de Cuentas con Accionista suscrito entre AGRÍCOLA ONI, C.A. y Elias Rafael Trías Abreu (C.I. V-14.892.301) para justificar las transferencias de egreso hacia sus cuentas personales.',
    clauses: [
      {
        title: 'PRIMERA: Objeto y Avances de Tesorería Corporativa',
        content: 'AGRÍCOLA ONI, C.A. conviene en otorgar avances temporales de liquidez a favor del Presidente y Accionista Mayoritario Elias Rafael Trías Abreu cuando requiera montos para la atención de compromisos personales o delegaciones de representación comercial.'
      },
      {
        title: 'SEGUNDA: Regla Contable - Cuentas por Cobrar Socios',
        content: 'Toda salida o egreso bancario de la cuenta Banesco de AGRÍCOLA ONI, C.A. dirigido hacia cuentas personales del accionista Elias Rafael Trías Abreu se clasifica obligatoriamente como "Cuentas por Cobrar Socios" (Activo Corriente) en la contabilidad general de la empresa.'
      }
    ]
  },
  {
    id: 'ctr-nat-001',
    batchCode: 'ABONO-NAT-001',
    contractCode: 'CTR-ANT-NAT-2026-001',
    companyName: 'Depositante Persona Natural (Abono Taquilla Acarigua)',
    rif: 'C.I. V-12.845.910',
    repName: 'Depositante Taquilla Banesco',
    repId: 'V-12.845.910',
    bankOrigin: 'Banesco Banco Universal (#3606912341)',
    amountVES: 1200000.00,
    amountUSD: 1751.82,
    coffeeQtl: 12,
    date: '12 de Junio de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-001',
    summary: 'Contrato de Mandato y Anticipo de Cliente Persona Natural por Bs. 1.200.000,00 ($1.751,82 USD) recibido en Banesco Acarigua (Ref: #3606912341) para reserva inicial de lote de café pergamino de origen nacional.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo y Custodia',
        content: 'El cliente persona natural identificado en el extracto bancario Banesco entrega a AGRÍCOLA ONI, C.A. la suma de Un Millón Dosocientos Mil Bolívares (Bs. 1.200.000,00) a tasa BCV oficial en calidad de anticipo financiero para la reserva de 12 quintales de café verde.'
      },
      {
        title: 'SEGUNDA: Extinción del Pasivo NIIF 15',
        content: 'La entrega de la mercancía en octubre de 2026 extinguirá la obligación mediante la correspondiente factura formal de venta a tasa oficial BCV.'
      }
    ]
  },
  {
    id: 'ctr-nat-002',
    batchCode: 'ABONO-NAT-002',
    contractCode: 'CTR-ANT-NAT-2026-002',
    companyName: 'TRF CR INM Personas Naturales Banesco',
    rif: 'C.I. V-15.340.892',
    repName: 'Titular Transferencia Inmediata',
    repId: 'V-15.340.892',
    bankOrigin: 'Banesco Banco Universal (#3607100845)',
    amountVES: 1500000.00,
    amountUSD: 2184.99,
    coffeeQtl: 15,
    date: '14 de Junio de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-002',
    summary: 'Contrato de Mandato y Anticipo de Cliente Persona Natural por Bs. 1.500.000,00 ($2.184,99 USD) recibido vía Transferencia Crédito Inmediato Banesco (Ref: #3607100845) para reserva de quintales de café verde.',
    clauses: [
      {
        title: 'PRIMERA: Objeto y Reserva de Café Verde',
        content: 'El cliente efectúa un abono de Bs. 1.500.000,00 para asegurar la reserva y congelación de precio de 15 quintales de café arábica nacional.'
      }
    ]
  },
  {
    id: 'ctr-nat-003',
    batchCode: 'ABONO-NAT-003',
    contractCode: 'CTR-ANT-NAT-2026-003',
    companyName: 'Depositante Taquilla Banesco Acarigua',
    rif: 'C.I. V-18.450.112',
    repName: 'Depositante Taquilla Acarigua',
    repId: 'V-18.450.112',
    bankOrigin: 'Banesco Banco Universal (#3607312098)',
    amountVES: 2100000.00,
    amountUSD: 3052.33,
    coffeeQtl: 21,
    date: '16 de Junio de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-003',
    summary: 'Contrato de Mandato y Anticipo de Cliente Persona Natural por Bs. 2.100.000,00 ($3.052,33 USD) recibido en taquilla Banesco Acarigua (Ref: #3607312098) por concepto de pago anticipado por lote de café lavado especial.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo',
        content: 'Abono recibido en taquilla por Bs. 2.100.000,00 para la reserva de 21 quintales de café lavado de alta calidad.'
      }
    ]
  },
  {
    id: 'ctr-nat-004',
    batchCode: 'ABONO-NAT-004',
    contractCode: 'CTR-ANT-NAT-2026-004',
    companyName: 'TRF CR INM Personas Naturales Banesco',
    rif: 'C.I. V-09.874.120',
    repName: 'Titular Transferencia Inmediata',
    repId: 'V-09.874.120',
    bankOrigin: 'Banesco Banco Universal (#3607548912)',
    amountVES: 1850000.00,
    amountUSD: 2684.66,
    coffeeQtl: 18,
    date: '18 de Junio de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-004',
    summary: 'Contrato de Mandato y Anticipo por Bs. 1.850.000,00 ($2.684,66 USD) para secado, trilla y preparación de lote de café pergamino.',
    clauses: [
      {
        title: 'PRIMERA: Objeto y Acondicionamiento',
        content: 'Anticipo para financiamiento y trilla de 18 quintales de café pergamino lavado.'
      }
    ]
  },
  {
    id: 'ctr-nat-005',
    batchCode: 'ABONO-NAT-005',
    contractCode: 'CTR-ANT-NAT-2026-005',
    companyName: 'Depositante Taquilla Banesco Guanare',
    rif: 'C.I. V-16.789.001',
    repName: 'Depositante Taquilla Guanare',
    repId: 'V-16.789.001',
    bankOrigin: 'Banesco Banco Universal (#3607812034)',
    amountVES: 950000.00,
    amountUSD: 1376.81,
    coffeeQtl: 9,
    date: '20 de Junio de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-005',
    summary: 'Contrato de Mandato y Anticipo por Bs. 950.000,00 ($1.376,81 USD) depositado en Guanare para reserva de grano moca especial.',
    clauses: [
      {
        title: 'PRIMERA: Objeto y Reserva Especial',
        content: 'Depósito de Bs. 950.000,00 para reserva de café especial tipo moca.'
      }
    ]
  },
  {
    id: 'ctr-nat-006',
    batchCode: 'ABONO-NAT-006',
    contractCode: 'CTR-ANT-NAT-2026-006',
    companyName: 'TRF CR INM Personas Naturales Banesco',
    rif: 'C.I. V-14.220.551',
    repName: 'Titular Transferencia Inmediata',
    repId: 'V-14.220.551',
    bankOrigin: 'Banesco Banco Universal (#3608011245)',
    amountVES: 2400000.00,
    amountUSD: 3472.22,
    coffeeQtl: 24,
    date: '22 de Junio de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-006',
    summary: 'Contrato de Mandato y Anticipo por Bs. 2.400.000,00 ($3.472,22 USD) para reserva y compra de 24 quintales de café verde.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo',
        content: 'Abono de Bs. 2.400.000,00 para acopio y reserva de 24 quintales en depósito.'
      }
    ]
  },
  {
    id: 'ctr-nat-007',
    batchCode: 'ABONO-NAT-007',
    contractCode: 'CTR-ANT-NAT-2026-007',
    companyName: 'Depositante Taquilla Banesco Ospino',
    rif: 'C.I. V-11.543.889',
    repName: 'Depositante Taquilla Ospino',
    repId: 'V-11.543.889',
    bankOrigin: 'Banesco Banco Universal (#3608245109)',
    amountVES: 1150000.00,
    amountUSD: 1661.85,
    coffeeQtl: 11,
    date: '24 de Junio de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-007',
    summary: 'Contrato de Mandato y Anticipo por Bs. 1.150.000,00 ($1.661,85 USD) abonado en Ospino para acopio de café origen Lara-Portuguesa.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo',
        content: 'Depósito de Bs. 1.150.000,00 para reserva de 11 quintales de café regional.'
      }
    ]
  },
  {
    id: 'ctr-nat-008',
    batchCode: 'ABONO-NAT-008',
    contractCode: 'CTR-ANT-NAT-2026-008',
    companyName: 'TRF CR INM Personas Naturales Banesco',
    rif: 'C.I. V-19.102.334',
    repName: 'Titular Transferencia Inmediata',
    repId: 'V-19.102.334',
    bankOrigin: 'Banesco Banco Universal (#3608490123)',
    amountVES: 3200000.00,
    amountUSD: 4614.28,
    coffeeQtl: 32,
    date: '26 de Junio de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-008',
    summary: 'Contrato de Mandato y Anticipo por Bs. 3.200.000,00 ($4.614,28 USD) abonado vía Banesco para reserva de cosecha nacional de café.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo',
        content: 'Transferencia de Bs. 3.200.000,00 para reserva de 32 quintales de café pergamino.'
      }
    ]
  },
  {
    id: 'ctr-nat-009',
    batchCode: 'ABONO-NAT-009',
    contractCode: 'CTR-ANT-NAT-2026-009',
    companyName: 'Depositante Taquilla Banesco Chacao',
    rif: 'C.I. V-13.889.012',
    repName: 'Depositante Taquilla Chacao',
    repId: 'V-13.889.012',
    bankOrigin: 'Banesco Banco Universal (#3608712045)',
    amountVES: 1700000.00,
    amountUSD: 2449.57,
    coffeeQtl: 17,
    date: '28 de Junio de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-009',
    summary: 'Contrato de Mandato y Anticipo por Bs. 1.700.000,00 ($2.449,57 USD) depositado en Chacao para reserva de café gourmet.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo',
        content: 'Abono de Bs. 1.700.000,00 para reserva de 17 quintales de café verde arábica.'
      }
    ]
  },
  {
    id: 'ctr-nat-010',
    batchCode: 'ABONO-NAT-010',
    contractCode: 'CTR-ANT-NAT-2026-010',
    companyName: 'TRF CR INM Personas Naturales Banesco',
    rif: 'C.I. V-17.654.321',
    repName: 'Titular Transferencia Inmediata',
    repId: 'V-17.654.321',
    bankOrigin: 'Banesco Banco Universal (#3608900112)',
    amountVES: 1925979.99,
    amountUSD: 2771.20,
    coffeeQtl: 19,
    date: '30 de Junio de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-010',
    summary: 'Contrato de Mandato y Anticipo por Bs. 1.925.979,99 ($2.771,20 USD) abonado en Banesco para cierre de paquete de junio.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo',
        content: 'Transferencia de Bs. 1.925.979,99 para reserva de 19 quintales de grano.'
      }
    ]
  },
  {
    id: 'ctr-nat-011',
    batchCode: 'ABONO-NAT-011',
    contractCode: 'CTR-ANT-NAT-2026-011',
    companyName: 'Depositante Taquilla Banesco Araure',
    rif: 'C.I. V-10.450.987',
    repName: 'Depositante Taquilla Araure',
    repId: 'V-10.450.987',
    bankOrigin: 'Banesco Banco Universal (#3615100234)',
    amountVES: 850000.00,
    amountUSD: 1125.83,
    coffeeQtl: 8,
    date: '04 de Agosto de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-011',
    summary: 'Contrato de Mandato y Anticipo por Bs. 850.000,00 ($1.125,83 USD) abonado en Araure para reserva de café verde de agosto.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo',
        content: 'Depósito de Bs. 850.000,00 para reserva de 8 quintales de café verde.'
      }
    ]
  },
  {
    id: 'ctr-nat-012',
    batchCode: 'ABONO-NAT-012',
    contractCode: 'CTR-ANT-NAT-2026-012',
    companyName: 'TRF CR INM Personas Naturales Banesco',
    rif: 'C.I. V-16.123.456',
    repName: 'Titular Transferencia Inmediata',
    repId: 'V-16.123.456',
    bankOrigin: 'Banesco Banco Universal (#3615412098)',
    amountVES: 920000.00,
    amountUSD: 1207.35,
    coffeeQtl: 9,
    date: '10 de Agosto de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-012',
    summary: 'Contrato de Mandato y Anticipo por Bs. 920.000,00 ($1.207,35 USD) recibido vía Banesco para compra anticipada de café.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo',
        content: 'Abono de Bs. 920.000,00 para reserva de 9 quintales de grano verde.'
      }
    ]
  },
  {
    id: 'ctr-nat-013',
    batchCode: 'ABONO-NAT-013',
    contractCode: 'CTR-ANT-NAT-2026-013',
    companyName: 'Depositante Taquilla Banesco Barquisimeto',
    rif: 'C.I. V-12.987.654',
    repName: 'Depositante Barquisimeto',
    repId: 'V-12.987.654',
    bankOrigin: 'Banesco Banco Universal (#3615890123)',
    amountVES: 600000.00,
    amountUSD: 779.22,
    coffeeQtl: 6,
    date: '15 de Agosto de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-013',
    summary: 'Contrato de Mandato y Anticipo por Bs. 600.000,00 ($779,22 USD) depositado en Barquisimeto para reserva y muestreo.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo',
        content: 'Depósito de Bs. 600.000,00 para reserva de 6 quintales de café.'
      }
    ]
  },
  {
    id: 'ctr-nat-014',
    batchCode: 'ABONO-NAT-014',
    contractCode: 'CTR-ANT-NAT-2026-014',
    companyName: 'TRF CR INM Personas Naturales Banesco',
    rif: 'C.I. V-18.765.432',
    repName: 'Titular Transferencia Inmediata',
    repId: 'V-18.765.432',
    bankOrigin: 'Banesco Banco Universal (#3616200112)',
    amountVES: 700000.00,
    amountUSD: 895.14,
    coffeeQtl: 7,
    date: '22 de Agosto de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-014',
    summary: 'Contrato de Mandato y Anticipo por Bs. 700.000,00 ($895,14 USD) recibido vía Banesco para acopio en Portuguesa.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo',
        content: 'Transferencia de Bs. 700.000,00 para reserva de 7 quintales de grano verde.'
      }
    ]
  },
  {
    id: 'ctr-nat-015',
    batchCode: 'ABONO-NAT-015',
    contractCode: 'CTR-ANT-NAT-2026-015',
    companyName: 'Depositante Taquilla Banesco Biscucuy',
    rif: 'C.I. V-15.890.123',
    repName: 'Depositante Biscucuy',
    repId: 'V-15.890.123',
    bankOrigin: 'Banesco Banco Universal (#3616612045)',
    amountVES: 800000.00,
    amountUSD: 1010.10,
    coffeeQtl: 8,
    date: '28 de Agosto de 2026',
    status: 'FONDOS EN CUSTODIA / RESERVA CAFÉ',
    octoberInvoiceRef: 'COMP-ANT-NAT-2026-015',
    summary: 'Contrato de Mandato y Anticipo por Bs. 800.000,00 ($1.010,10 USD) abonado en Biscucuy para reserva final de agosto.',
    clauses: [
      {
        title: 'PRIMERA: Objeto del Anticipo',
        content: 'Depósito en taquilla por Bs. 800.000,00 para reserva de 8 quintales de café verde.'
      }
    ]
  },
  {
    id: 'ctr-03',
    batchCode: 'LOTE-VE-NAC-UNDA',
    contractCode: 'CTR-PROCURA-2026-NAC-UNDA',
    companyName: 'ASOCIACIÓN DE CAFICULTORES DEL MUNICIPIO UNDA (CHABASQUÉN)',
    rif: 'RIF: J-40192840-1',
    repName: 'Directorio de Productores Chabasquén',
    repId: 'RIF: J-40192840-1',
    bankOrigin: 'Banesco / BDV / Pago Móvil CCE',
    amountVES: 300375000.00,
    amountUSD: 445000.00,
    coffeeQtl: 7500,
    date: '20 de Mayo de 2026',
    status: 'ACOPIO NACIONAL ACTIVO',
    octoberInvoiceRef: 'GUIA-SICA-VE-2026-004128',
    summary: 'Contrato Marco de Compraventa y Acopio de Café Verde Nacional por USD 445.000,00 a tipo de cambio oficial BCV para abastecer 7.500 quintales de café pergamino lavado de Portuguesa.',
    clauses: [
      {
        title: 'PRIMERA: Especificaciones y Calidad de Café Nacional',
        content: 'Acopio y suministro de café arábica pergamino lavado con humedad < 12% y guía de movilización SICA/CVC en centros de recepción de Chabasquén y Biscucuy, Estado Portuguesa.'
      }
    ]
  }
];

export const ALL_SYSTEM_CONTRACTS = [
  ...LEGAL_ENTITY_BATCH_CONTRACTS.map(c => ({ ...c, categoryGroup: 'PERSONA_JURIDICA' })),
  ...SPECIAL_CONTRACTS.map(c => ({
    ...c,
    categoryGroup: c.id.includes('nat')
      ? 'PERSONA_NATURAL'
      : c.id.includes('soc')
      ? 'SOCIO_PRESIDENTE'
      : 'MUTUO_PROCURA'
  }))
];

export const LegalShieldContractsView: React.FC<Props> = ({ company }) => {
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'BATCH_MATRIX' | 'SINGLE_CONTRACT'>('BATCH_MATRIX');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'PERSONA_JURIDICA' | 'PERSONA_NATURAL' | 'SOCIO_PRESIDENTE' | 'MUTUO_PROCURA'>('ALL');
  const [selectedContract, setSelectedContract] = useState<LegalEntityBatchContract>(ALL_SYSTEM_CONTRACTS[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const pjContracts = ALL_SYSTEM_CONTRACTS.filter((c) => c.categoryGroup === 'PERSONA_JURIDICA');
  const natContracts = ALL_SYSTEM_CONTRACTS.filter((c) => c.categoryGroup === 'PERSONA_NATURAL');
  const socContracts = ALL_SYSTEM_CONTRACTS.filter((c) => c.categoryGroup === 'SOCIO_PRESIDENTE');
  const mutContracts = ALL_SYSTEM_CONTRACTS.filter((c) => c.categoryGroup === 'MUTUO_PROCURA');

  const pjVES = pjContracts.reduce((acc, c) => acc + c.amountVES, 0);
  const pjUSD = pjContracts.reduce((acc, c) => acc + c.amountUSD, 0);
  const pjQtl = pjContracts.reduce((acc, c) => acc + c.coffeeQtl, 0);

  const natVES = natContracts.reduce((acc, c) => acc + c.amountVES, 0);
  const natUSD = natContracts.reduce((acc, c) => acc + c.amountUSD, 0);
  const natQtl = natContracts.reduce((acc, c) => acc + c.coffeeQtl, 0);

  const filteredContracts = ALL_SYSTEM_CONTRACTS.filter((c) => {
    const matchesCategory = categoryFilter === 'ALL' || c.categoryGroup === categoryFilter;
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.rif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contractCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.repName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalVES = filteredContracts.reduce((acc, c) => acc + c.amountVES, 0);
  const totalUSD = filteredContracts.reduce((acc, c) => acc + c.amountUSD, 0);
  const totalQtl = filteredContracts.reduce((acc, c) => acc + c.coffeeQtl, 0);

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
          <h2 style="color:#B45309; font-size:13pt; margin-top:8pt; text-transform:uppercase; font-family:Arial, sans-serif;">CONTRATO A FUTURO DE COMPRAVENTA E INTERMEDIACIÓN DE CAFÉ NACIONAL CON FINANCIAMIENTO MEDIANTE ANTICIPOS A TASA BCV</h2>
          <p style="color:#1E293B; font-size:10pt; font-weight:bold;">INSTRUMENTO JURÍDICO AUDITABLE SUDEBAN / SENIAT &middot; ${ctr.batchCode}</p>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-bottom:15pt; background-color:#FEF3C7; border:1px solid #F59E0B;">
          <tr>
            <td style="padding:10pt; font-size:10pt; color:#78350F; line-height:1.6;">
              <strong>1. MANDANTE / COMPRADOR:</strong> ${ctr.companyName} (RIF: ${ctr.rif})<br/>
              <strong>2. REPRESENTANTE LEGAL:</strong> ${ctr.repName} (C.I. ${ctr.repId})<br/>
              <strong>3. INTERMEDIARIO COMERCIAL:</strong> ${company.name} (RIF: ${company.rif})<br/>
              <strong>4. LOTE DE ACOPIO NACIONAL ASIGNADO:</strong> ${ctr.batchCode}<br/>
              <strong>5. MONTO EN CUSTODIA (PASIVO NIIF 15 A TASA BCV):</strong> Bs. ${ctr.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${ctr.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)<br/>
              <strong>6. VOLUMEN COMPROMETIDO:</strong> ${ctr.coffeeQtl.toLocaleString('es-VE')} Quintales de Café Pergamino Lavado Nacional<br/>
              <strong>7. FECHA DE SUSCRIPCIÓN:</strong> ${ctr.date} &middot; <strong>SUSTITUCIÓN POR FACTURA DE VENTAS:</strong> Octubre 2026 (${ctr.octoberInvoiceRef})
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
            <p style="color:#B45309; font-size:9pt; font-weight:bold; margin:0; font-family:monospace;">CONTRATO A FUTURO N° ${index + 1} DE 6 &middot; ${ctr.batchCode}</p>
            <h1 style="color:#0F172A; font-size:16pt; margin:3pt 0 0 0; text-transform:uppercase; font-family:Arial, sans-serif;">${company.name}</h1>
            <p style="color:#475569; font-size:9pt; margin:3pt 0;"><strong>R.I.F.:</strong> ${company.rif} &middot; <strong>EXPEDIENTE:</strong> ${ctr.contractCode}</p>
            <h2 style="color:#B45309; font-size:12pt; margin-top:6pt; text-transform:uppercase; font-family:Arial, sans-serif;">CONTRATO A FUTURO DE COMPRAVENTA E INTERMEDIACIÓN DE CAFÉ NACIONAL CON FINANCIAMIENTO MEDIANTE ANTICIPOS A TASA BCV</h2>
          </div>

          <table style="width:100%; border-collapse:collapse; margin-bottom:15pt; background-color:#FEF3C7; border:1px solid #F59E0B;">
            <tr>
              <td style="padding:10pt; font-size:10pt; color:#78350F; line-height:1.6;">
                <strong>1. MANDANTE / COMPRADOR (CLIENTE JURÍDICO):</strong> ${ctr.companyName} (RIF: ${ctr.rif})<br/>
                <strong>2. REPRESENTANTE LEGAL:</strong> ${ctr.repName} (C.I. ${ctr.repId})<br/>
                <strong>3. INTERMEDIARIO COMERCIAL:</strong> ${company.name} (RIF: ${company.rif})<br/>
                <strong>4. LOTE DE ACOPIO NACIONAL ASIGNADO:</strong> ${ctr.batchCode}<br/>
                <strong>5. MONTO EN CUSTODIA (PASIVO NIIF 15 A TASA BCV):</strong> Bs. ${ctr.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${ctr.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)<br/>
                <strong>6. VOLUMEN COMPROMETIDO:</strong> ${ctr.coffeeQtl.toLocaleString('es-VE')} Quintales de Café Pergamino Lavado Nacional<br/>
                <strong>7. FECHA DE SUSCRIPCIÓN:</strong> ${ctr.date} &middot; <strong>SUSTITUCIÓN POR FACTURA DE VENTAS:</strong> Octubre 2026 (${ctr.octoberInvoiceRef})
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
          <p style="color:#475569; font-size:11pt; margin-top:4pt;">R.I.F. ${company.rif} &middot; COMPILACIÓN EDITABLE DE CONTRATOS A FUTURO POR LOTES EN WORD</p>
          <p style="color:#B45309; font-size:12pt; font-weight:bold; margin-top:6pt;">6 CONTRATOS A FUTURO DE COMPRAVENTA E INTERMEDIACIÓN DE CAFÉ NACIONAL CON FINANCIAMIENTO MEDIANTE ANTICIPOS A TASA BCV</p>
        </div>

        <div style="background-color:#F1F5F9; border-left:4px solid #0F172A; padding:10pt 12pt; margin-bottom:25pt; font-size:10pt; color:#334155;">
          <strong>NOTA EDITABLE DE CUMPLIMIENTO BANCARIO Y FISCAL:</strong> El presente archivo en formato Microsoft Word (.doc / .docx) contiene los seis (6) contratos marco individuales de compraventa e intermediación de café nacional suscritos con las empresas jurídicas venezolanas. Este archivo se proporciona con el fin de permitir la modificación directa de cualquier cláusula, nombre de representante legal o condición comercial específica antes de su impresión o remisión a las autoridades de inspección bancaria (SUDEBAN / Banesco Compliance).
        </div>

        ${contractsHtml}
      </div>
    `;

    exportToWord('Contratos_a_Futuro_Cafe_Nacional_Personas_Juridicas_Agricola_Oni.doc', 'Contratos a Futuro por Lotes Word', fullHtml);
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
      title: 'MATRIZ DE CONTRATOS DE MANDATO POR LOTE DE COMPRA Y GESTIÓN NACIONAL - PERSONAS JURÍDICAS',
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
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-white shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Blindaje Legal & Contratos de Mandato por Lotes
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Contratos de Mandato e Intermediación Comercial para las 6 Personas Jurídicas &middot; Blindaje SUDEBAN, SENIAT, NIIF 15 y Prevención de Legitimación
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('SUMMARY')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                activeTab === 'SUMMARY'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Resumen de Firmas ({pjContracts.length + natContracts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('BATCH_MATRIX')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'BATCH_MATRIX'
                  ? 'bg-blue-700 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Matriz de Contratos ({ALL_SYSTEM_CONTRACTS.length})
            </button>
            <button
              onClick={() => setActiveTab('SINGLE_CONTRACT')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'SINGLE_CONTRACT'
                  ? 'bg-blue-700 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Lector de Contrato
            </button>
          </div>

          <button
            onClick={handleExportAllBatchContractsWord}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
            title="Descargar todos los contratos de las personas jurídicas en formato Word (.doc) para modificarlos"
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

      {/* EXECUTIVE SUMMARY OF PENDING CONTRACTS BY CATEGORY */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-amber-400 uppercase tracking-wide">
                Resumen Ejecutivo: Contratos Pendientes de Firma por Anticipos de Clientes
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Clasificación Contable NIIF 15 (Pasivo Corriente) basada en extractos bancarios Banesco & 'customerAdvances'
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">TOTAL PENDIENTES DE FIRMA:</span>
            <span className="text-amber-400 text-sm font-extrabold">{pjContracts.length + natContracts.length} CONTRATOS</span>
          </div>
        </div>

        {/* 3 Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Personas Jurídicas */}
          <div className="bg-slate-950/90 border border-blue-800/80 p-4 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> 1. CLIENTES PERSONAS JURÍDICAS
              </span>
              <span className="bg-blue-900/80 text-blue-200 text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                {pjContracts.length} Contratos
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Contratos Pendientes:</span>
                <span className="text-white font-bold">{pjContracts.length} Por Firmar</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Monto Total VES:</span>
                <span className="text-emerald-400 font-bold">Bs. {pjVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Contravalor USD BCV:</span>
                <span className="text-emerald-400 font-bold">${pjUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Volumen Compromiso:</span>
                <span className="text-amber-400 font-bold">{pjQtl.toLocaleString('es-VE')} Quintales</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
              <strong className="text-blue-300 block mb-0.5">Clasificación Contable:</strong>
              Pasivo Corriente (NIIF 15) &middot; Anticipos de Clientes Personas Jurídicas para Procura de Café en Venezuela.
            </div>
          </div>

          {/* 2. Personas Naturales */}
          <div className="bg-slate-950/90 border border-emerald-800/80 p-4 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 2. CLIENTES PERSONAS NATURALES
              </span>
              <span className="bg-emerald-900/80 text-emerald-200 text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                {natContracts.length} Contratos
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Contratos Pendientes:</span>
                <span className="text-white font-bold">{natContracts.length} Por Firmar</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Monto Total VES:</span>
                <span className="text-emerald-400 font-bold">Bs. {natVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Contravalor USD BCV:</span>
                <span className="text-emerald-400 font-bold">${natUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Volumen Compromiso:</span>
                <span className="text-amber-400 font-bold">{natQtl.toLocaleString('es-VE')} Quintales</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
              <strong className="text-emerald-300 block mb-0.5">Clasificación Contable:</strong>
              Pasivo Corriente (NIIF 15) &middot; 15 abonos individuales de depositantes en taquilla/TRF Banesco.
            </div>
          </div>

          {/* 3. Regla Excepción Dueño / Accionista Propietario */}
          <div className="bg-slate-950/90 border border-purple-800/80 p-4 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-400" /> 3. REGLA ESPECIAL ACCIONISTA
              </span>
              <span className="bg-purple-900/80 text-purple-200 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                EXCLUIDO DE CLIENTES
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Nombre Propietario:</span>
                <span className="text-white font-bold">Elias Rafael Trías Abreu</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Cédula de Identidad:</span>
                <span className="text-white font-bold">V-14.892.301</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Aportes Liquidez (Ingreso):</span>
                <span className="text-purple-300 font-bold">Bs. 7.649.975,00</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Avances Egresos (Salidas):</span>
                <span className="text-purple-300 font-bold">Bs. 15.400.000,00</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-purple-200 font-sans leading-relaxed">
              <strong className="text-amber-400 block mb-0.5">REGLA FISCAL OBLIGATORIA:</strong>
              Registrado exclusivamente en <span className="underline font-bold text-white">Cuentas por Pagar / Cobrar Socios</span>. Excluido de ventas y de anticipos de clientes.
            </div>
          </div>
        </div>

        {/* Consolidated Total Box */}
        <div className="bg-slate-950 border border-amber-500/50 p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold text-amber-300 tracking-wide">TOTAL ANTICIPOS DE CLIENTES PENDIENTES DE FIRMA:</span>
            <span className="text-white font-mono font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
              {pjContracts.length + natContracts.length} CONTRATOS ({pjContracts.length} Jurídicos + {natContracts.length} Naturales)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono font-bold">
            <span className="text-slate-300">VES: <strong className="text-white">Bs. {(pjVES + natVES).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong></span>
            <span className="text-slate-300">USD BCV: <strong className="text-emerald-400">${(pjUSD + natUSD).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
            <span className="text-slate-300">Café: <strong className="text-amber-400">{(pjQtl + natQtl).toLocaleString('es-VE')} Qtl</strong></span>
          </div>
        </div>
      </div>

      {activeTab === 'SUMMARY' ? (
        /* Summary Overview Tab Details */
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-600" />
              Desglose Completo de Contratos Pendientes de Firma por Categoria
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Verificación de concordancia entre los abonos recibidos en la cuenta Banesco Cta. 0134-0342-18-3421089912 y los contratos legales emitidos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personas Jurídicas Table Card */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-700" /> Clientes Personas Jurídicas ({pjContracts.length})
                </span>
                <span className="text-xs font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  Bs. {pjVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="divide-y divide-slate-200 font-mono text-xs max-h-60 overflow-y-auto">
                {pjContracts.map((c, i) => (
                  <div key={c.id} className="py-2 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-800 block">{i + 1}. {c.companyName}</span>
                      <span className="text-[10px] text-slate-500 font-sans block">{c.contractCode} &middot; RIF: {c.rif}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">Bs. {c.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
                      <span className="text-[10px] text-emerald-700 block">${c.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personas Naturales Table Card */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Clientes Personas Naturales ({natContracts.length})
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Bs. {natVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="divide-y divide-slate-200 font-mono text-xs max-h-60 overflow-y-auto">
                {natContracts.map((c, i) => (
                  <div key={c.id} className="py-2 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-800 block">{i + 1}. {c.companyName}</span>
                      <span className="text-[10px] text-slate-500 font-sans block">{c.contractCode} &middot; C.I. {c.repId}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">Bs. {c.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
                      <span className="text-[10px] text-emerald-700 block">${c.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'BATCH_MATRIX' ? (
        /* Batch Contracts Matrix Tab */
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <span className="text-xs text-slate-600 block">Total Contratos de Mandato</span>
              <span className="text-xl font-bold text-amber-700 mt-1 block">
                {pjContracts.length + natContracts.length} Contratos
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                6 Jurídicos + 15 Naturales
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <span className="text-xs text-slate-600 block">Monto en Custodia (Pasivo NIIF 15)</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">
                Bs. {totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-emerald-700 mt-0.5 block font-mono">
                ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <span className="text-xs text-slate-600 block">Volumen Comprometido en Café</span>
              <span className="text-xl font-bold text-amber-700 mt-1 block">
                {totalQtl.toLocaleString('es-VE')} Quintales
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Café Arábica Pergamino Lavado Venezolano (Tasa Oficial BCV)
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <span className="text-xs text-slate-600 block">Estatus de Absorción Fiscal</span>
              <span className="text-xl font-bold text-blue-800 mt-1 block">
                Octubre de 2026
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Emisión de Factura + Retenciones Prov. 0049
              </span>
            </div>
          </div>

          {/* Interactive Category Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs no-print">
            <button
              type="button"
              onClick={() => setCategoryFilter('ALL')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                categoryFilter === 'ALL'
                  ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todos ({ALL_SYSTEM_CONTRACTS.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('PERSONA_JURIDICA')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                categoryFilter === 'PERSONA_JURIDICA'
                  ? 'bg-blue-900 text-blue-200 border-blue-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🏢 Jurídicas ({pjContracts.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('PERSONA_NATURAL')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                categoryFilter === 'PERSONA_NATURAL'
                  ? 'bg-emerald-900 text-emerald-200 border-emerald-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              👤 Naturales ({natContracts.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('SOCIO_PRESIDENTE')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                categoryFilter === 'SOCIO_PRESIDENTE'
                  ? 'bg-purple-900 text-purple-200 border-purple-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              👔 Presidente & Socio ({socContracts.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('MUTUO_PROCURA')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                categoryFilter === 'MUTUO_PROCURA'
                  ? 'bg-amber-900 text-amber-200 border-amber-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              🤝 Mutuo & Procura ({mutContracts.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por lote, código de contrato, cliente, RIF o representante..."
              className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
            />
          </div>

          {/* Table of Batch Contracts */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-200 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3"># Lote</th>
                    <th className="p-3">Código Contrato</th>
                    <th className="p-3">Razón Social / Nombre Legal</th>
                    <th className="p-3">R.I.F. SENIAT</th>
                    <th className="p-3">Representante / Titular</th>
                    <th className="p-3">Banco / Origen</th>
                    <th className="p-3 text-right">Monto (Bs.)</th>
                    <th className="p-3 text-right">USD ($)</th>
                    <th className="p-3 text-right">Vol. (Qtl)</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {filteredContracts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono text-amber-700 font-bold whitespace-nowrap">
                        {c.batchCode}
                      </td>
                      <td className="p-3 font-mono text-slate-900 font-semibold whitespace-nowrap">
                        {c.contractCode}
                      </td>
                      <td className="p-3 font-bold text-slate-900 max-w-xs">
                        {c.companyName}
                      </td>
                      <td className="p-3 font-mono text-slate-700 whitespace-nowrap">
                        {c.rif}
                      </td>
                      <td className="p-3 text-slate-700">
                        {c.repName} <span className="text-[10px] text-slate-500 block">({c.repId})</span>
                      </td>
                      <td className="p-3 text-slate-600 text-[11px]">
                        {c.bankOrigin}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        Bs. {c.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-700 font-semibold">
                        ${c.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right font-mono text-amber-700 font-bold">
                        {c.coffeeQtl > 0 ? `${c.coffeeQtl.toLocaleString('es-VE')} Qtl` : '&mdash;'}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedContract(c);
                              setActiveTab('SINGLE_CONTRACT');
                            }}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="Ver contrato completo en formato papel"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver</span>
                          </button>
                          <button
                            onClick={() => handleExportSingleContractWord(c)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
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
                <tfoot className="bg-slate-900 font-bold text-white font-mono text-xs border-t-2 border-slate-700">
                  <tr>
                    <td colSpan={6} className="p-3 text-amber-300">
                      TOTAL CONTRATOS REGISTRADOS ({filteredContracts.length} INSTRUMENTOS)
                    </td>
                    <td className="p-3 text-right text-amber-300">
                      Bs. {totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-emerald-300">
                      ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right text-amber-300">
                      {totalQtl.toLocaleString('es-VE')} Qtl
                    </td>
                    <td className="p-3 text-center text-slate-300 text-[10px]">
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
                      <h2>CONTRATO DE MANDATO Y GESTIÓN DE INTERMEDIACIÓN COMERCIAL (${selectedContract.batchCode})</h2>
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
                  Contrato de Mandato y Gestión de Intermediación Comercial con Financiamiento Mediante Anticipos
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
