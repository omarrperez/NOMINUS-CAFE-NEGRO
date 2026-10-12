export interface AccountingEntryLine {
  accountCode: string;
  accountName: string;
  reference: string;
  debitVES: number;
  creditVES: number;
  debitUSD: number;
  creditUSD: number;
  comment?: string;
}

export interface AccountingVoucher {
  id: string;
  voucherNumber: string;
  voucherType: 'DIARIO' | 'EGRESO' | 'INGRESO' | 'RETENCION_IVA' | 'RETENCION_ISLR';
  date: string;
  bcvRate: number;
  concept: string;
  beneficiaryOrThirdParty: string;
  rifThirdParty: string;
  documentRef: string; // Factura SENIAT, Nota, Guía SICA
  bankAccountRef?: string;
  approvedBy: string;
  reviewedBy: string;
  preparedBy: string;
  status: 'AUDITADO' | 'CONFIRMADO' | 'EN_REVISION';
  lines: AccountingEntryLine[];
  totalDebitVES: number;
  totalCreditVES: number;
  totalDebitUSD: number;
  totalCreditUSD: number;
  notes?: string;
}

export interface RetentionVoucherSummary {
  id: string;
  correlative: string;
  date: string;
  type: 'IVA' | 'ISLR';
  supplier: string;
  rif: string;
  invoiceNumber: string;
  controlNumber?: string;
  totalInvoiceVES?: number;
  taxableBaseVES?: number;
  baseAmountVES?: number;
  taxAmountVES?: number;
  retentionRate: number;
  retainedAmountVES: number;
  retainedAmountUSD: number;
  bcvRate: number;
  seniatStatus: string;
}

// 1. BALANCE DE COMPROBACIÓN DE SUMAS Y SALDOS AL 31/08/2026 (VEN-NIF)
export interface TrialBalanceAccount {
  accountCode: string;
  accountName: string;
  nature: 'ACTIVO' | 'PASIVO' | 'COSTO_OPERATIVO' | 'GASTO_OPERATIVO' | 'GASTO_FINANCIERO';
  totalDebitVES: number;
  totalCreditVES: number;
  debtorBalanceVES: number;
  creditorBalanceVES: number;
  totalDebitUSD: number;
  totalCreditUSD: number;
}

export const TRIAL_BALANCE_AGRICOLA_ONI_2026: TrialBalanceAccount[] = [
  {
    accountCode: '1.1.01.02',
    accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
    nature: 'ACTIVO',
    totalDebitVES: 1966597105.00,
    totalCreditVES: 1956660113.60,
    debtorBalanceVES: 9936991.40,
    creditorBalanceVES: 0,
    totalDebitUSD: 2912368.95,
    totalCreditUSD: 2907112.24
  },
  {
    accountCode: '1.1.01.03',
    accountName: 'Banesco Cuenta Custodia Divisas USD / Anticipos Procura Café Exterior',
    nature: 'ACTIVO',
    totalDebitVES: 375630000.00,
    totalCreditVES: 0,
    debtorBalanceVES: 375630000.00,
    creditorBalanceVES: 0,
    totalDebitUSD: 556890.45,
    totalCreditUSD: 0
  },
  {
    accountCode: '1.1.02.04',
    accountName: 'Cuentas por Cobrar Manuel Becerra (Contrato Mutuo / Capital Bs. 312,02M + Intereses Bs. 13,92M)',
    nature: 'ACTIVO',
    totalDebitVES: 512324652.96,
    totalCreditVES: 186376000.00,
    debtorBalanceVES: 325948652.96,
    creditorBalanceVES: 0,
    totalDebitUSD: 644441.63,
    totalCreditUSD: 234438.17
  },
  {
    accountCode: '1.1.02.05',
    accountName: 'Retenciones ISLR Clientes y Pagos por Anticipado ISLR (SENIAT)',
    nature: 'ACTIVO',
    totalDebitVES: 1448356.66,
    totalCreditVES: 0,
    debtorBalanceVES: 1448356.66,
    creditorBalanceVES: 0,
    totalDebitUSD: 1821.85,
    totalCreditUSD: 0
  },
  {
    accountCode: '1.2.01.01',
    accountName: 'Propiedad, Planta y Equipment Neto (Vehículos, Maquinaria y Muebles)',
    nature: 'ACTIVO',
    totalDebitVES: 28062685.53,
    totalCreditVES: 0,
    debtorBalanceVES: 28062685.53,
    creditorBalanceVES: 0,
    totalDebitUSD: 35299.42,
    totalCreditUSD: 0
  },
  {
    accountCode: '2.1.01.01',
    accountName: 'Cuentas por Pagar Socios (Aportes del Socio Propietario Elías Rafael Trías Abreu V-23.997.829)',
    nature: 'PASIVO',
    totalDebitVES: 0,
    totalCreditVES: 246572875.38,
    debtorBalanceVES: 0,
    creditorBalanceVES: 246572875.38,
    totalDebitUSD: 0,
    totalCreditUSD: 310158.46
  },
  {
    accountCode: '2.1.01.02',
    accountName: 'Obligaciones Fiscales ISLR por Pagar al Cierre',
    nature: 'PASIVO',
    totalDebitVES: 0,
    totalCreditVES: 696202.38,
    debtorBalanceVES: 0,
    creditorBalanceVES: 696202.38,
    totalDebitUSD: 0,
    totalCreditUSD: 875.74
  },
  {
    accountCode: '2.1.04.01',
    accountName: 'Anticipos Recibidos de Clientes Jurídicos y Torrefactoras Banesco (NIIF 15 - Facturación Octubre 2026)',
    nature: 'PASIVO',
    totalDebitVES: 0,
    totalCreditVES: 1542017092.63,
    debtorBalanceVES: 0,
    creditorBalanceVES: 1542017092.63,
    totalDebitUSD: 0,
    totalCreditUSD: 2270486.23
  },
  {
    accountCode: '2.1.04.02',
    accountName: 'Anticipos Recibidos de Productor / Asociado Recurrente V-023997829',
    nature: 'PASIVO',
    totalDebitVES: 0,
    totalCreditVES: 7649975.00,
    debtorBalanceVES: 0,
    creditorBalanceVES: 7649975.00,
    totalDebitUSD: 0,
    totalCreditUSD: 11266.93
  },
  {
    accountCode: '2.1.04.03',
    accountName: 'Anticipos Recibidos de Compradores y Personas Naturales (V-24493340 / V-20105311)',
    nature: 'PASIVO',
    totalDebitVES: 0,
    totalCreditVES: 21845979.99,
    debtorBalanceVES: 0,
    creditorBalanceVES: 21845979.99,
    totalDebitUSD: 0,
    totalCreditUSD: 36069.06
  },
  {
    accountCode: '3.1.01.01',
    accountName: 'Capital Social Suscrito y Pagado y Reservas Legales',
    nature: 'PASIVO',
    totalDebitVES: 0,
    totalCreditVES: 660000.00,
    debtorBalanceVES: 0,
    creditorBalanceVES: 660000.00,
    totalDebitUSD: 0,
    totalCreditUSD: 830.20
  },
  {
    accountCode: '3.2.01.01',
    accountName: 'Superávit Acumulado de Ejercicios Anteriores',
    nature: 'PASIVO',
    totalDebitVES: 0,
    totalCreditVES: 82590269.79,
    debtorBalanceVES: 0,
    creditorBalanceVES: 82590269.79,
    totalDebitUSD: 0,
    totalCreditUSD: 103888.44
  },
  {
    accountCode: '4.1.01.01',
    accountName: 'Ingresos Operativos Devengados por Servicios Agrícolas y Producción',
    nature: 'PASIVO',
    totalDebitVES: 0,
    totalCreditVES: 78717472.35,
    debtorBalanceVES: 0,
    creditorBalanceVES: 78717472.35,
    totalDebitUSD: 0,
    totalCreditUSD: 99016.93
  },
  {
    accountCode: '4.2.01.01',
    accountName: 'Ingresos Financieros por Intereses Devengados Contrato Mutuo Manuel Becerra',
    nature: 'PASIVO',
    totalDebitVES: 0,
    totalCreditVES: 13924047.66,
    debtorBalanceVES: 0,
    creditorBalanceVES: 13924047.66,
    totalDebitUSD: 0,
    totalCreditUSD: 17514.75
  },
  {
    accountCode: '5.1.01.01',
    accountName: 'Costos Operativos de Servicios y Producción Agrícola',
    nature: 'COSTO_OPERATIVO',
    totalDebitVES: 66701894.40,
    totalCreditVES: 0,
    debtorBalanceVES: 66701894.40,
    creditorBalanceVES: 0,
    totalDebitUSD: 83902.81,
    totalCreditUSD: 0
  }
];

// TOTALES GENERALES DEL BALANCE
export const TRIAL_BALANCE_SUMMARY = {
  totalDebitsVES: 2950702688.55,
  totalCreditsVES: 2950702688.55,
  totalDebitsUSD: 4296706.91,
  totalCreditsUSD: 4296706.91,
  asOfDate: '31/08/2026',
  standard: 'VEN-NIF',
  auditor: 'Lcda. Carmen Rivas (CPC 41.802)',
  companyName: 'AGRÍCOLA ONI, C.A.',
  companyRif: 'J-50145638-0'
};

// 2. LIBRO DIARIO GENERAL Y EXPEDIENTE DE COMPROBANTES BANESCO (ENERO A AGOSTO 2026)
export const AGRICOLA_ONI_VOUCHERS_2026: AccountingVoucher[] = [
  // 16/06/2026 - COMP-ANT-RIP-2026-001
  {
    id: 'VCH-2026-001',
    voucherNumber: 'COMP-ANT-RIP-2026-001',
    voucherType: 'INGRESO',
    date: '16/06/2026',
    bcvRate: 688.00,
    concept: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15) - Ref. #00033005568 BFC 0151',
    beneficiaryOrThirdParty: 'EMPRESA ETN, C.A.',
    rifThirdParty: 'J-50100487-0',
    documentRef: 'Ref. #00033005568 BFC 0151 / ETN, C.A.',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Ref. #00033005568 BFC 0151',
        debitVES: 20745000,
        creditVES: 0,
        debitUSD: 30115.40,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15)',
        reference: 'Auxiliar Cliente J-50100487-0 ETN, C.A.',
        debitVES: 0,
        creditVES: 20745000,
        debitUSD: 0,
        creditUSD: 30115.40
      }
    ],
    totalDebitVES: 20745000,
    totalCreditVES: 20745000,
    totalDebitUSD: 30115.40,
    totalCreditUSD: 30115.40,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 19/06/2026 - COMP-ANT-RIP-2026-002
  {
    id: 'VCH-2026-002',
    voucherNumber: 'COMP-ANT-RIP-2026-002',
    voucherType: 'INGRESO',
    date: '19/06/2026',
    bcvRate: 690.00,
    concept: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15) - Ref. #00058529036 y Lotes DIS Jun',
    beneficiaryOrThirdParty: 'DISTRIBUIDORA DIS, C.A. y Otros Terceros Jurídicos Junio',
    rifThirdParty: 'J-30643703-7 / J-50013440-3 / J-50145725-2',
    documentRef: 'Ref. #00058529036 y Lotes DIS Jun',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Ref. #00058529036 y Lotes DIS Jun',
        debitVES: 35823999.24,
        creditVES: 0,
        debitUSD: 51986.65,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15)',
        reference: 'Auxiliar Cliente J-30643703-7 DIS y Aliados Jun',
        debitVES: 0,
        creditVES: 35823999.24,
        debitUSD: 0,
        creditUSD: 51986.65
      }
    ],
    totalDebitVES: 35823999.24,
    totalCreditVES: 35823999.24,
    totalDebitUSD: 51986.65,
    totalCreditUSD: 51986.65,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 09/07/2026 - COMP-ANT-RIP-2026-003
  {
    id: 'VCH-2026-003',
    voucherNumber: 'COMP-ANT-RIP-2026-003',
    voucherType: 'INGRESO',
    date: '09/07/2026',
    bcvRate: 723.00,
    concept: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15) - Ref. #00005995465 SBLBTR 0108 y Lotes Jul',
    beneficiaryOrThirdParty: 'DISTRIBUIDORA DIS, C.A. / EMPRESA ETN, C.A.',
    rifThirdParty: 'J-30643703-7 / J-50013440-3 / J-50145725-2',
    documentRef: 'Ref. #00005995465 SBLBTR 0108 y Lotes Jul',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Ref. #00005995465 SBLBTR 0108 y Lotes Jul',
        debitVES: 11879549,
        creditVES: 0,
        debitUSD: 163801.22,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15)',
        reference: 'Auxiliar Cliente J-30643703-7 DIS, C.A.',
        debitVES: 0,
        creditVES: 11879549,
        debitUSD: 0,
        creditUSD: 163801.22
      }
    ],
    totalDebitVES: 11879549,
    totalCreditVES: 11879549,
    totalDebitUSD: 163801.22,
    totalCreditUSD: 163801.22,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 29/07/2026 - COMP-ANT-RIP-2026-004
  {
    id: 'VCH-2026-004',
    voucherNumber: 'COMP-ANT-RIP-2026-004',
    voucherType: 'INGRESO',
    date: '29/07/2026',
    bcvRate: 745.00,
    concept: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15) - 14 Refs. #00016671975-2043 BDV 0102',
    beneficiaryOrThirdParty: 'GRUPO AGROINDUSTRIAL ORU, C.A.',
    rifThirdParty: 'J-41100717-0',
    documentRef: '14 Refs. #00016671975-2043 BDV 0102',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: '14 Refs. #00016671975-2043 BDV 0102',
        debitVES: 67000000.97,
        creditVES: 0,
        debitUSD: 93055.56,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15)',
        reference: 'Auxiliar Cliente J-41100717-0 ORU, C.A.',
        debitVES: 0,
        creditVES: 67000000.97,
        debitUSD: 0,
        creditUSD: 93055.56
      }
    ],
    totalDebitVES: 67000000.97,
    totalCreditVES: 67000000.97,
    totalDebitUSD: 93055.56,
    totalCreditUSD: 93055.56,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 06/08/2026 - COMP-ANT-RIP-2026-005
  {
    id: 'VCH-2026-005',
    voucherNumber: 'COMP-ANT-RIP-2026-005',
    voucherType: 'INGRESO',
    date: '06/08/2026',
    bcvRate: 756.70,
    concept: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15) - Refs. #0000000198, #0000000295 y Lotes 05-06 Ago',
    beneficiaryOrThirdParty: 'INVERSIONES SOLBTR 0191 / AGROPECUARIA AGR',
    rifThirdParty: 'J-50120729-0 / J-50145638-3 / J-50145725-2',
    documentRef: 'Refs. #0000000198, #0000000295 y Lotes 05-06 Ago',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Refs. #0000000198, #0000000295 y Lotes 05-06 Ago',
        debitVES: 97180000,
        creditVES: 0,
        debitUSD: 131524.32,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15)',
        reference: 'Auxiliar Cliente J-50120729-0 Aliados Ago',
        debitVES: 0,
        creditVES: 97180000,
        debitUSD: 0,
        creditUSD: 131524.32
      }
    ],
    totalDebitVES: 97180000,
    totalCreditVES: 97180000,
    totalDebitUSD: 131524.32,
    totalCreditUSD: 131524.32,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 11/08/2026 - COMP-ANT-RIP-2026-006
  {
    id: 'VCH-2026-006',
    voucherNumber: 'COMP-ANT-RIP-2026-006',
    voucherType: 'INGRESO',
    date: '11/08/2026',
    bcvRate: 764.35,
    concept: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15) - 14 Refs. #00030445172-97286 Bancamiga 0172',
    beneficiaryOrThirdParty: 'COMERCIALIZADORA RIK, C.A.',
    rifThirdParty: 'J-50099756-6',
    documentRef: '14 Refs. #00030445172-97286 Bancamiga 0172',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: '14 Refs. #00030445172-97286 Bancamiga 0172',
        debitVES: 63750000,
        creditVES: 0,
        debitUSD: 86148.65,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15)',
        reference: 'Auxiliar Cliente J-50099756-6 RIK, C.A.',
        debitVES: 0,
        creditVES: 63750000,
        debitUSD: 0,
        creditUSD: 86148.65
      }
    ],
    totalDebitVES: 63750000,
    totalCreditVES: 63750000,
    totalDebitUSD: 86148.65,
    totalCreditUSD: 86148.65,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/08/2026 - COMP-ANT-RIP-2026-007
  {
    id: 'VCH-2026-007',
    voucherNumber: 'COMP-ANT-RIP-2026-007',
    voucherType: 'INGRESO',
    date: '31/08/2026',
    bcvRate: 798.33,
    concept: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15) - Refs. #000041945646, #000042467191 y #000042432420 BDV',
    beneficiaryOrThirdParty: 'CORPORACION AGROINDUSTRIAL J / SOLIDARIOS Ago',
    rifThirdParty: 'J-50809452-2 / J-50059079-2',
    documentRef: 'Refs. #000041945646, #000042467191 y #000042432420 BDV',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Refs. #000041945646, #000042467191 BDV',
        debitVES: 126200000,
        creditVES: 0,
        debitUSD: 165327.68,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes Jurídicos Nacionales (Pasivo NIIF 15)',
        reference: 'Auxiliares Clientes J-50809452-2 y J-50059079-2',
        debitVES: 0,
        creditVES: 126200000,
        debitUSD: 0,
        creditUSD: 165327.68
      }
    ],
    totalDebitVES: 126200000,
    totalCreditVES: 126200000,
    totalDebitUSD: 165327.68,
    totalCreditUSD: 165327.68,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/01/2026 - COMP-ANT-BAN-2026-001
  {
    id: 'VCH-2026-008',
    voucherNumber: 'COMP-ANT-BAN-2026-001',
    voucherType: 'INGRESO',
    date: '31/01/2026',
    bcvRate: 370.25,
    concept: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco - Extracto Banesco Ene-2026 TRANS.CTAS',
    beneficiaryOrThirdParty: 'Clientes Mayoristas Banesco Ene-2026 (Ref. #00262241728 y conexos)',
    rifThirdParty: 'Clientes Comerciales Titulares Banesco',
    documentRef: 'Extracto Banesco Ene-2026 TRANS.CTAS',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Extracto Banesco Ene-2026 TRANS.CTAS',
        debitVES: 14739197,
        creditVES: 0,
        debitUSD: 43040.44,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco',
        reference: 'Libro Auxiliar de Referencias Banesco Ene-2026',
        debitVES: 0,
        creditVES: 14739197,
        debitUSD: 0,
        creditUSD: 43040.44
      }
    ],
    totalDebitVES: 14739197,
    totalCreditVES: 14739197,
    totalDebitUSD: 43040.44,
    totalCreditUSD: 43040.44,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 28/02/2026 - COMP-ANT-BAN-2026-002
  {
    id: 'VCH-2026-009',
    voucherNumber: 'COMP-ANT-BAN-2026-002',
    voucherType: 'INGRESO',
    date: '28/02/2026',
    bcvRate: 419.99,
    concept: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco - Extracto Banesco Feb-2026 TRANS.CTAS',
    beneficiaryOrThirdParty: 'Clientes Mayoristas Banesco Feb-2026 (Refs. #00358474634 / #03583889582)',
    rifThirdParty: 'Cartera de Clientes Comerciales Titulares Banesco',
    documentRef: 'Extracto Banesco Feb-2026 TRANS.CTAS',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Extracto Banesco Feb-2026 TRANS.CTAS',
        debitVES: 23673607.21,
        creditVES: 0,
        debitUSD: 61956.57,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco',
        reference: 'Libro Auxiliar de Referencias Banesco Feb-2026',
        debitVES: 0,
        creditVES: 23673607.21,
        debitUSD: 0,
        creditUSD: 61956.57
      }
    ],
    totalDebitVES: 23673607.21,
    totalCreditVES: 23673607.21,
    totalDebitUSD: 61956.57,
    totalCreditUSD: 61956.57,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/03/2026 - COMP-ANT-BAN-2026-003
  {
    id: 'VCH-2026-010',
    voucherNumber: 'COMP-ANT-BAN-2026-003',
    voucherType: 'INGRESO',
    date: '31/03/2026',
    bcvRate: 473.92,
    concept: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco - Extracto Banesco Mar-2026 TRANS.CTAS',
    beneficiaryOrThirdParty: 'Auxiliar Clientes Banesco Mar-2026',
    rifThirdParty: 'Cartera de Clientes Comerciales Titulares Banesco',
    documentRef: 'Extracto Banesco Mar-2026 TRANS.CTAS',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Extracto Banesco Mar-2026 TRANS.CTAS',
        debitVES: 2650000,
        creditVES: 0,
        debitUSD: 6235.29,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco',
        reference: 'Libro Auxiliar de Referencias Banesco Mar-2026',
        debitVES: 0,
        creditVES: 2650000,
        debitUSD: 0,
        creditUSD: 6235.29
      }
    ],
    totalDebitVES: 2650000,
    totalCreditVES: 2650000,
    totalDebitUSD: 6235.29,
    totalCreditUSD: 6235.29,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/04/2026 - COMP-ANT-BAN-2026-004
  {
    id: 'VCH-2026-011',
    voucherNumber: 'COMP-ANT-BAN-2026-004',
    voucherType: 'INGRESO',
    date: '30/04/2026',
    bcvRate: 489.55,
    concept: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco - Extracto Banesco Abr-2026 TRANS.CTAS',
    beneficiaryOrThirdParty: 'Auxiliar Clientes Banesco Abr-2026 (Ref. #61205338957)',
    rifThirdParty: 'Cartera de Clientes Comerciales Titulares Banesco',
    documentRef: 'Extracto Banesco Abr-2026 TRANS.CTAS',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Extracto Banesco Abr-2026 TRANS.CTAS',
        debitVES: 6874000,
        creditVES: 0,
        debitUSD: 14365.73,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco',
        reference: 'Libro Auxiliar de Referencias Banesco Abr-2026',
        debitVES: 0,
        creditVES: 6874000,
        debitUSD: 0,
        creditUSD: 14365.73
      }
    ],
    totalDebitVES: 6874000,
    totalCreditVES: 6874000,
    totalDebitUSD: 14365.73,
    totalCreditUSD: 14365.73,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/05/2026 - COMP-ANT-BAN-2026-005
  {
    id: 'VCH-2026-012',
    voucherNumber: 'COMP-ANT-BAN-2026-005',
    voucherType: 'INGRESO',
    date: '31/05/2026',
    bcvRate: 554.43,
    concept: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco - Extracto Banesco May-2026 TRANS.CTAS',
    beneficiaryOrThirdParty: 'Auxiliar Clientes Banesco May-2026',
    rifThirdParty: 'Cartera de Clientes Comerciales Titulares Banesco',
    documentRef: 'Extracto Banesco May-2026 TRANS.CTAS',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Extracto Banesco May-2026 TRANS.CTAS',
        debitVES: 5625047.50,
        creditVES: 0,
        debitUSD: 10317.40,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco',
        reference: 'Libro Auxiliar de Referencias Banesco May-2026',
        debitVES: 0,
        creditVES: 5625047.50,
        debitUSD: 0,
        creditUSD: 10317.40
      }
    ],
    totalDebitVES: 5625047.50,
    totalCreditVES: 5625047.50,
    totalDebitUSD: 10317.40,
    totalCreditUSD: 10317.40,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/06/2026 - COMP-ANT-BAN-2026-006
  {
    id: 'VCH-2026-013',
    voucherNumber: 'COMP-ANT-BAN-2026-006',
    voucherType: 'INGRESO',
    date: '30/06/2026',
    bcvRate: 633.36,
    concept: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco - Extracto Banesco Jun-2026 TRANS.CTAS',
    beneficiaryOrThirdParty: 'Auxiliar Mayoristas Banesco Jun-2026',
    rifThirdParty: 'J-501654294820 / J-50120729-0 y Agroindustriales Titulares Banesco',
    documentRef: 'Extracto Banesco Jun-2026 TRANS.CTAS',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Extracto Banesco Jun-2026 TRANS.CTAS',
        debitVES: 296593784,
        creditVES: 0,
        debitUSD: 462524.42,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco',
        reference: 'Libro Auxiliar de Referencias Banesco Jun-2026',
        debitVES: 0,
        creditVES: 296593784,
        debitUSD: 0,
        creditUSD: 462524.42
      }
    ],
    totalDebitVES: 296593784,
    totalCreditVES: 296593784,
    totalDebitUSD: 462524.42,
    totalCreditUSD: 462524.42,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/07/2026 - COMP-ANT-BAN-2026-007
  {
    id: 'VCH-2026-014',
    voucherNumber: 'COMP-ANT-BAN-2026-007',
    voucherType: 'INGRESO',
    date: '31/07/2026',
    bcvRate: 748.79,
    concept: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco - Extracto Banesco Jul-2026 TRANS.CTAS',
    beneficiaryOrThirdParty: 'Auxiliar Mayoristas Banesco Jul-2026',
    rifThirdParty: 'J-503610552289 / J-503611647712 / J-503614101072 Clientes Mayoristas Banesco',
    documentRef: 'Extracto Banesco Jul-2026 TRANS.CTAS',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Extracto Banesco Jul-2026 TRANS.CTAS',
        debitVES: 386791318.30,
        creditVES: 0,
        debitUSD: 570152.30,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco',
        reference: 'Libro Auxiliar de Referencias Banesco Jul-2026',
        debitVES: 0,
        creditVES: 386791318.30,
        debitUSD: 0,
        creditUSD: 570152.30
      }
    ],
    totalDebitVES: 386791318.30,
    totalCreditVES: 386791318.30,
    totalDebitUSD: 570152.30,
    totalCreditUSD: 570152.30,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/08/2026 - COMP-ANT-BAN-2026-008
  {
    id: 'VCH-2026-015',
    voucherNumber: 'COMP-ANT-BAN-2026-008',
    voucherType: 'INGRESO',
    date: '31/08/2026',
    bcvRate: 798.33,
    concept: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco - Extracto Banesco Ago-2026 TRANS.CTAS',
    beneficiaryOrThirdParty: 'Auxiliar Mayoristas Banesco Ago-2026',
    rifThirdParty: 'J-508017700002 / J-50817553324 Clientes Mayoristas Agroindustriales Titulares Banesco',
    documentRef: 'Extracto Banesco Ago-2026 TRANS.CTAS',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Extracto Banesco Ago-2026 TRANS.CTAS',
        debitVES: 276491589.40,
        creditVES: 0,
        debitUSD: 375813.64,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.01',
        accountName: 'Anticipos Recibidos de Clientes - Auxiliar Mismo Banco Banesco',
        reference: 'Libro Auxiliar de Referencias Banesco Ago-2026',
        debitVES: 0,
        creditVES: 276491589.40,
        debitUSD: 0,
        creditUSD: 375813.64
      }
    ],
    totalDebitVES: 276491589.40,
    totalCreditVES: 276491589.40,
    totalDebitUSD: 375813.64,
    totalCreditUSD: 375813.64,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/07/2026 - COMP-ANT-NAT-2026-001
  {
    id: 'VCH-2026-016',
    voucherNumber: 'COMP-ANT-NAT-2026-001',
    voucherType: 'INGRESO',
    date: '31/07/2026',
    bcvRate: 748.79,
    concept: 'Anticipos Recibidos de Productor / Asociado Persona Natural Recurrente V-023997829',
    beneficiaryOrThirdParty: 'PRODUCTOR ASOCIADO TITULAR V-023997829 (TR/TRE)',
    rifThirdParty: 'V-02399782-9',
    documentRef: '21 Abonos TRF CR INMV 023997829 (Ene-Ago)',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: '21 Abonos TRF CR INMV 023997829',
        debitVES: 7649975,
        creditVES: 0,
        debitUSD: 11266.93,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.02',
        accountName: 'Anticipos Recibidos de Productor / Asociado Persona Natural Recurrente',
        reference: 'Auxiliar V-02399782-9 (Ene: Bs. 3,4M a Ago: Bs. 4,24M)',
        debitVES: 0,
        creditVES: 7649975,
        debitUSD: 0,
        creditUSD: 11266.93
      }
    ],
    totalDebitVES: 7649975,
    totalCreditVES: 7649975,
    totalDebitUSD: 11266.93,
    totalCreditUSD: 11266.93,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/06/2026 - COMP-ANT-NAT-2026-002
  {
    id: 'VCH-2026-017',
    voucherNumber: 'COMP-ANT-NAT-2026-002',
    voucherType: 'INGRESO',
    date: '30/06/2026',
    bcvRate: 633.36,
    concept: 'Anticipos Recibidos de Productores y Personas Naturales (Pasivo)',
    beneficiaryOrThirdParty: 'Productores y Personas Naturales Titulares',
    rifThirdParty: 'V-02449334-0, V-03210531-1, V-01640804-0, V-01060705-8, V-01515479-1, V-01556350-0 y 8 Productores',
    documentRef: '15 Abonos TRF CR INM Personas Naturales V-',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: '15 Abonos TRF CR INM Personas Naturales V-',
        debitVES: 21845979.99,
        creditVES: 0,
        debitUSD: 36069.06,
        creditUSD: 0
      },
      {
        accountCode: '2.1.04.03',
        accountName: 'Anticipos Recibidos de Productores y Personas Naturales (Pasivo)',
        reference: 'Auxiliar 14 Cédulas V- (Jun: Bs. 17,9M a Ago: Bs. 3,87M)',
        debitVES: 0,
        creditVES: 21845979.99,
        debitUSD: 0,
        creditUSD: 36069.06
      }
    ],
    totalDebitVES: 21845979.99,
    totalCreditVES: 21845979.99,
    totalDebitUSD: 36069.06,
    totalCreditUSD: 36069.06,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/01/2026 - COMP-TI-ENT-2026-001
  {
    id: 'VCH-2026-018',
    voucherNumber: 'COMP-TI-ENT-2026-001',
    voucherType: 'DIARIO',
    date: '31/01/2026',
    bcvRate: 370.25,
    concept: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito - Ref. #00093845477 J501456380 AGR',
    beneficiaryOrThirdParty: 'AGRÍCOLA ONI, C.A. (Cuentas Propias en 0108 Provincial / 0105 Mercantil)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Ref. #00093845477 J501456380 AGR',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Ref. #00093845477 J501456380 AGR',
        debitVES: 1110000,
        creditVES: 0,
        debitUSD: 3241.35,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.99',
        accountName: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito (0105/0108)',
        reference: 'Descarga Cta. Propia (Provincial/Mercantil) J-50145638-0',
        debitVES: 0,
        creditVES: 1110000,
        debitUSD: 0,
        creditUSD: 3241.35
      }
    ],
    totalDebitVES: 1110000,
    totalCreditVES: 1110000,
    totalDebitUSD: 3241.35,
    totalCreditUSD: 3241.35,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 28/02/2026 - COMP-TI-ENT-2026-002
  {
    id: 'VCH-2026-019',
    voucherNumber: 'COMP-TI-ENT-2026-002',
    voucherType: 'DIARIO',
    date: '28/02/2026',
    bcvRate: 419.99,
    concept: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito - Traspasos Recibidos Feb-2026 J501456380',
    beneficiaryOrThirdParty: 'AGRÍCOLA ONI, C.A. (Cuentas Propias 0105 Mercantil / 0108 Provincial)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Traspasos Recibidos Feb-2026 J501456380',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Traspasos Recibidos Feb-2026 J501456380',
        debitVES: 720000,
        creditVES: 0,
        debitUSD: 1884.32,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.99',
        accountName: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito',
        reference: 'Descarga Cta. Propia Otros Bancos Feb-2026',
        debitVES: 0,
        creditVES: 720000,
        debitUSD: 0,
        creditUSD: 1884.32
      }
    ],
    totalDebitVES: 720000,
    totalCreditVES: 720000,
    totalDebitUSD: 1884.32,
    totalCreditUSD: 1884.32,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/03/2026 - COMP-TI-ENT-2026-003
  {
    id: 'VCH-2026-020',
    voucherNumber: 'COMP-TI-ENT-2026-003',
    voucherType: 'DIARIO',
    date: '31/03/2026',
    bcvRate: 473.92,
    concept: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito - Ref. #00041240208 y Lotes Mar-2026 J501456380',
    beneficiaryOrThirdParty: 'AGRÍCOLA ONI, C.A. (Cuentas Propias 0108 Provincial / 0105 Mercantil)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Ref. #00041240208 y Lotes Mar-2026 J501456380',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Ref. #00041240208 y Lotes Mar-2026',
        debitVES: 1032830.57,
        creditVES: 0,
        debitUSD: 2430.19,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.99',
        accountName: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito',
        reference: 'Descarga Cta. Propia Otros Bancos Mar-2026',
        debitVES: 0,
        creditVES: 1032830.57,
        debitUSD: 0,
        creditUSD: 2430.19
      }
    ],
    totalDebitVES: 1032830.57,
    totalCreditVES: 1032830.57,
    totalDebitUSD: 2430.19,
    totalCreditUSD: 2430.19,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/04/2026 - COMP-TI-ENT-2026-004
  {
    id: 'VCH-2026-021',
    voucherNumber: 'COMP-TI-ENT-2026-004',
    voucherType: 'DIARIO',
    date: '30/04/2026',
    bcvRate: 489.55,
    concept: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito - Abr: Bs. 582.934,16 + May: Bs. 1.298.290,80',
    beneficiaryOrThirdParty: 'AGRÍCOLA ONI, C.A. (Cuentas Propias 0105 / 0108 / 0138)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Traspasos Cta. Propia Abr-May 2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Abr: Bs. 582.934,16 + May: Bs. 1.298.290,80',
        debitVES: 1881224.96,
        creditVES: 0,
        debitUSD: 3608.03,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.99',
        accountName: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito',
        reference: 'Descarga Ctas. Propias Abr-May 2026',
        debitVES: 0,
        creditVES: 1881224.96,
        debitUSD: 0,
        creditUSD: 3608.03
      }
    ],
    totalDebitVES: 1881224.96,
    totalCreditVES: 1881224.96,
    totalDebitUSD: 3608.03,
    totalCreditUSD: 3608.03,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/06/2026 - COMP-TI-ENT-2026-005
  {
    id: 'VCH-2026-022',
    voucherNumber: 'COMP-TI-ENT-2026-005',
    voucherType: 'DIARIO',
    date: '30/06/2026',
    bcvRate: 633.36,
    concept: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito - SGBLTR 0138 #00003344419 y Lotes Jun J501456380',
    beneficiaryOrThirdParty: 'AGRÍCOLA ONI, C.A. (Cuentas Propias 0138 Banco Plaza y 0172 Bancamiga)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'SGBLTR 0138 #00003344419 y Lotes Jun J501456380',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'SGBLTR 0138 #00003344419 y Lotes Jun',
        debitVES: 73390000.01,
        creditVES: 0,
        debitUSD: 108661.53,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.99',
        accountName: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito (0138 Plaza)',
        reference: 'Descarga Cta. Propia Plaza y Bancamiga Jun-2026',
        debitVES: 0,
        creditVES: 73390000.01,
        debitUSD: 0,
        creditUSD: 108661.53
      }
    ],
    totalDebitVES: 73390000.01,
    totalCreditVES: 73390000.01,
    totalDebitUSD: 108661.53,
    totalCreditUSD: 108661.53,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/07/2026 - COMP-TI-ENT-2026-006
  {
    id: 'VCH-2026-023',
    voucherNumber: 'COMP-TI-ENT-2026-006',
    voucherType: 'DIARIO',
    date: '31/07/2026',
    bcvRate: 748.79,
    concept: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito - Traspasos propios Jul-2026 J501456380',
    beneficiaryOrThirdParty: 'AGRÍCOLA ONI, C.A. (Cuentas Propias 0105 Mercantil y 0138 Banco Plaza)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Traspasos propios Jul-2026 J501456380',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Traspasos propios Jul-2026 J501456380',
        debitVES: 47240540,
        creditVES: 0,
        debitUSD: 69257.50,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.99',
        accountName: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito (0105/0138)',
        reference: 'Descarga Ctas. Propias Mercantil y Plaza Jul-2026',
        debitVES: 0,
        creditVES: 47240540,
        debitUSD: 0,
        creditUSD: 69257.50
      }
    ],
    totalDebitVES: 47240540,
    totalCreditVES: 47240540,
    totalDebitUSD: 69257.50,
    totalCreditUSD: 69257.50,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/08/2026 - COMP-TI-ENT-2026-007
  {
    id: 'VCH-2026-024',
    voucherNumber: 'COMP-TI-ENT-2026-007',
    voucherType: 'DIARIO',
    date: '31/08/2026',
    bcvRate: 798.33,
    concept: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito - Traspasos Propios Ago-2026 J501456380',
    beneficiaryOrThirdParty: 'AGRÍCOLA ONI, C.A. (Cuentas Propias 0105 / 0138 / 0172)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Traspasos Propios Ago-2026 J501456380',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Traspasos Propios Ago-2026 J501456380',
        debitVES: 83333462.19,
        creditVES: 0,
        debitUSD: 119234.88,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.99',
        accountName: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito',
        reference: 'Descarga Ctas. Propias Otros Bancos Ago-2026',
        debitVES: 0,
        creditVES: 83333462.19,
        debitUSD: 0,
        creditUSD: 119234.88
      }
    ],
    totalDebitVES: 83333462.19,
    totalCreditVES: 83333462.19,
    totalDebitUSD: 119234.88,
    totalCreditUSD: 119234.88,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/05/2026 - COMP-TI-SAL-2026-001 (Salida de Cta. Banesco a Otras Cuentas)
  {
    id: 'VCH-2026-025',
    voucherNumber: 'COMP-TI-SAL-2026-001',
    voucherType: 'EGRESO',
    date: '31/05/2026',
    bcvRate: 554.43,
    concept: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito - Cargo por Fondeo a Ctas. Propias Ene-May 2026',
    beneficiaryOrThirdParty: 'AGRÍCOLA ONI, C.A. (Cuentas Propias en Mercantil, Provincial, Plaza y Bancamiga)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Salidas TRF. MB Ene-May 2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.99',
        accountName: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito',
        reference: 'Cargo por Fondeo a Ctas. Propias Ene-May 2026',
        debitVES: 4210000,
        creditVES: 0,
        debitUSD: 9393.13,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Salidas TRF. MB Ene-May 2026',
        debitVES: 0,
        creditVES: 4210000,
        debitUSD: 0,
        creditUSD: 9393.13
      }
    ],
    totalDebitVES: 4210000,
    totalCreditVES: 4210000,
    totalDebitUSD: 9393.13,
    totalCreditUSD: 9393.13,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/06/2026 - COMP-TI-SAL-2026-002
  {
    id: 'VCH-2026-026',
    voucherNumber: 'COMP-TI-SAL-2026-002',
    voucherType: 'EGRESO',
    date: '30/06/2026',
    bcvRate: 633.36,
    concept: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito - Fondeo a Ctas. Propias Otros Bancos Jun-2026',
    beneficiaryOrThirdParty: 'AGRÍCOLA ONI, C.A. (Cuentas Propias Otros Bancos)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Salidas TRF. MB Jun-2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.99',
        accountName: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito',
        reference: 'Fondeo a Ctas. Propias Otros Bancos Jun-2026',
        debitVES: 38400000,
        creditVES: 0,
        debitUSD: 56855.20,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Salidas TRF. MB Jun-2026',
        debitVES: 0,
        creditVES: 38400000,
        debitUSD: 0,
        creditUSD: 56855.20
      }
    ],
    totalDebitVES: 38400000,
    totalCreditVES: 38400000,
    totalDebitUSD: 56855.20,
    totalCreditUSD: 56855.20,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/07/2026 - COMP-TI-SAL-2026-003
  {
    id: 'VCH-2026-027',
    voucherNumber: 'COMP-TI-SAL-2026-003',
    voucherType: 'EGRESO',
    date: '31/07/2026',
    bcvRate: 748.79,
    concept: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito - Fondeo a Ctas. Propias Otros Bancos Jul-2026',
    beneficiaryOrThirdParty: 'AGRÍCOLA ONI, C.A. (Cuentas Propias Otros Bancos)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Salidas TRF. MB Jul-2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.99',
        accountName: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito',
        reference: 'Fondeo a Ctas. Propias Otros Bancos Jul-2026',
        debitVES: 42100000,
        creditVES: 0,
        debitUSD: 61721.16,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Salidas TRF. MB Jul-2026',
        debitVES: 0,
        creditVES: 42100000,
        debitUSD: 0,
        creditUSD: 61721.16
      }
    ],
    totalDebitVES: 42100000,
    totalCreditVES: 42100000,
    totalDebitUSD: 61721.16,
    totalCreditUSD: 61721.16,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/08/2026 - COMP-TI-SAL-2026-004
  {
    id: 'VCH-2026-028',
    voucherNumber: 'COMP-TI-SAL-2026-004',
    voucherType: 'EGRESO',
    date: '31/08/2026',
    bcvRate: 798.33,
    concept: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito - Fondeo a Ctas. Propias Otros Bancos Ago-2026',
    beneficiaryOrThirdParty: 'AGRÍCOLA ONI, C.A. (Cuentas Propias Otros Bancos)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Salidas TRF. MB Ago-2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.99',
        accountName: 'Transferencias Interbancarias entre Cuentas Propias en Tránsito',
        reference: 'Fondeo a Ctas. Propias Otros Bancos Ago-2026',
        debitVES: 68500000,
        creditVES: 0,
        debitUSD: 98940.81,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Salidas TRF. MB Ago-2026',
        debitVES: 0,
        creditVES: 68500000,
        debitUSD: 0,
        creditUSD: 98940.81
      }
    ],
    totalDebitVES: 68500000,
    totalCreditVES: 68500000,
    totalDebitUSD: 98940.81,
    totalCreditUSD: 98940.81,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/01/2026 - COMP-FX-BAN-2026-001 (COMPRAS DÓLARES BANESCO)
  {
    id: 'VCH-2026-029',
    voucherNumber: 'COMP-FX-BAN-2026-001',
    voucherType: 'EGRESO',
    date: '30/01/2026',
    bcvRate: 370.25,
    concept: 'Compra de Dólares a Banesco Mesa de Cambio Ene-2026 (USD 5.402,25)',
    beneficiaryOrThirdParty: 'BANESCO BANCO UNIVERSAL, C.A. (Mesa de Cambio BCV)',
    rifThirdParty: 'J-07013380-5',
    documentRef: 'Pactos Mesa de Cambio Ene-2026 (USD 5.402,25)',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.03',
        accountName: 'Banesco Cuenta Custodia Divisas USD / Anticipos a Proveedores Exterior Café',
        reference: 'Pactos Mesa de Cambio Ene-2026 (USD 5.402,25)',
        debitVES: 1850000,
        creditVES: 0,
        debitUSD: 5402.25,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Cargo Liquidación Mesa de Cambio Ene-2026',
        debitVES: 0,
        creditVES: 1850000,
        debitUSD: 0,
        creditUSD: 5402.25
      }
    ],
    totalDebitVES: 1850000,
    totalCreditVES: 1850000,
    totalDebitUSD: 5402.25,
    totalCreditUSD: 5402.25,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 27/02/2026 - COMP-FX-BAN-2026-002
  {
    id: 'VCH-2026-030',
    voucherNumber: 'COMP-FX-BAN-2026-002',
    voucherType: 'EGRESO',
    date: '27/02/2026',
    bcvRate: 419.99,
    concept: 'Compra de Dólares a Banesco Mesa de Cambio Feb-2026 (USD 7.720,49)',
    beneficiaryOrThirdParty: 'BANESCO BANCO UNIVERSAL, C.A. (Mesa de Cambio BCV)',
    rifThirdParty: 'J-07013380-5',
    documentRef: 'Pactos Mesa de Cambio Feb-2026 (USD 7.720,49)',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.03',
        accountName: 'Banesco Cuenta Custodia Divisas USD / Café en Tránsito Internacional',
        reference: 'Pactos Mesa de Cambio Feb-2026 (USD 7.720,49)',
        debitVES: 2950000,
        creditVES: 0,
        debitUSD: 7720.49,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Cargo Liquidación Mesa de Cambio Feb-2026',
        debitVES: 0,
        creditVES: 2950000,
        debitUSD: 0,
        creditUSD: 7720.49
      }
    ],
    totalDebitVES: 2950000,
    totalCreditVES: 2950000,
    totalDebitUSD: 7720.49,
    totalCreditUSD: 7720.49,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/04/2026 - COMP-FX-BAN-2026-003
  {
    id: 'VCH-2026-031',
    voucherNumber: 'COMP-FX-BAN-2026-003',
    voucherType: 'EGRESO',
    date: '30/04/2026',
    bcvRate: 489.55,
    concept: 'Compra de Dólares a Banesco Mesa de Cambio Mar-Abr (Pactos Mar: Bs. 450k + Abr: Bs. 980k)',
    beneficiaryOrThirdParty: 'BANESCO BANCO UNIVERSAL, C.A. (Mesa de Cambio BCV)',
    rifThirdParty: 'J-07013380-5',
    documentRef: 'Pactos Mar: Bs. 450k + Abr: Bs. 980k',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.03',
        accountName: 'Banesco Cuenta Custodia Divisas USD / Café en Tránsito Internacional',
        reference: 'Pactos Mar: Bs. 450k + Abr: Bs. 980k',
        debitVES: 1430000,
        creditVES: 0,
        debitUSD: 3106.80,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Cargo Liquidación Mesa de Cambio Mar-Abr 2026',
        debitVES: 0,
        creditVES: 1430000,
        debitUSD: 0,
        creditUSD: 3106.80
      }
    ],
    totalDebitVES: 1430000,
    totalCreditVES: 1430000,
    totalDebitUSD: 3106.80,
    totalCreditUSD: 3106.80,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 29/05/2026 - COMP-FX-BAN-2026-004
  {
    id: 'VCH-2026-032',
    voucherNumber: 'COMP-FX-BAN-2026-004',
    voucherType: 'EGRESO',
    date: '29/05/2026',
    bcvRate: 554.43,
    concept: 'Compra de Dólares a Banesco Mesa de Cambio May-2026 (USD 6.236,24)',
    beneficiaryOrThirdParty: 'BANESCO BANCO UNIVERSAL, C.A. (Mesa de Cambio BCV)',
    rifThirdParty: 'J-07013380-5',
    documentRef: 'Pactos Mesa de Cambio May-2026 (USD 6.236,24)',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.03',
        accountName: 'Banesco Cuenta Custodia Divisas USD / Café en Tránsito Internacional',
        reference: 'Pactos Mesa de Cambio May-2026 (USD 6.236,24)',
        debitVES: 3400000,
        creditVES: 0,
        debitUSD: 6236.24,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Cargo Liquidación Mesa de Cambio May-2026',
        debitVES: 0,
        creditVES: 3400000,
        debitUSD: 0,
        creditUSD: 6236.24
      }
    ],
    totalDebitVES: 3400000,
    totalCreditVES: 3400000,
    totalDebitUSD: 6236.24,
    totalCreditUSD: 6236.24,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/06/2026 - COMP-FX-BAN-2026-005
  {
    id: 'VCH-2026-033',
    voucherNumber: 'COMP-FX-BAN-2026-005',
    voucherType: 'EGRESO',
    date: '30/06/2026',
    bcvRate: 633.36,
    concept: 'Compra de Dólares a Banesco Mesa de Cambio Jun-2026 (USD 134.272,94)',
    beneficiaryOrThirdParty: 'BANESCO BANCO UNIVERSAL, C.A. (Mesa de Cambio BCV)',
    rifThirdParty: 'J-07013380-5',
    documentRef: 'Pactos Mesa de Cambio Jun-2026 (USD 134.272,94)',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.03',
        accountName: 'Banesco Cuenta Custodia Divisas USD / Café en Tránsito Internacional',
        reference: 'Pactos Mesa de Cambio Jun-2026 (USD 134.272,94)',
        debitVES: 88600000,
        creditVES: 0,
        debitUSD: 134272.94,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Cargo Liquidación Mesa de Cambio Jun-2026',
        debitVES: 0,
        creditVES: 88600000,
        debitUSD: 0,
        creditUSD: 134272.94
      }
    ],
    totalDebitVES: 88600000,
    totalCreditVES: 88600000,
    totalDebitUSD: 134272.94,
    totalCreditUSD: 134272.94,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/07/2026 - COMP-FX-BAN-2026-006
  {
    id: 'VCH-2026-034',
    voucherNumber: 'COMP-FX-BAN-2026-006',
    voucherType: 'EGRESO',
    date: '31/07/2026',
    bcvRate: 748.79,
    concept: 'Compra de Dólares a Banesco Mesa de Cambio Jul-2026 (USD 198.231,39)',
    beneficiaryOrThirdParty: 'BANESCO BANCO UNIVERSAL, C.A. (Mesa de Cambio BCV)',
    rifThirdParty: 'J-07013380-5',
    documentRef: 'Pactos Mesa de Cambio Jul-2026 (USD 198.231,39)',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.03',
        accountName: 'Banesco Cuenta Custodia Divisas USD / Café en Tránsito Internacional',
        reference: 'Pactos Mesa de Cambio Jul-2026 (USD 198.231,39)',
        debitVES: 134500000,
        creditVES: 0,
        debitUSD: 198231.39,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Cargo Liquidación Mesa de Cambio Jul-2026',
        debitVES: 0,
        creditVES: 134500000,
        debitUSD: 0,
        creditUSD: 198231.39
      }
    ],
    totalDebitVES: 134500000,
    totalCreditVES: 134500000,
    totalDebitUSD: 198231.39,
    totalCreditUSD: 198231.39,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/08/2026 - COMP-FX-BAN-2026-007
  {
    id: 'VCH-2026-035',
    voucherNumber: 'COMP-FX-BAN-2026-007',
    voucherType: 'EGRESO',
    date: '31/08/2026',
    bcvRate: 798.33,
    concept: 'Compra de Dólares a Banesco Mesa de Cambio Ago-2026 (USD 201.920,34)',
    beneficiaryOrThirdParty: 'BANESCO BANCO UNIVERSAL, C.A. (Mesa de Cambio BCV)',
    rifThirdParty: 'J-07013380-5',
    documentRef: 'Pactos Mesa de Cambio Ago-2026 (USD 201.920,34)',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.03',
        accountName: 'Banesco Cuenta Custodia Divisas USD / Café en Tránsito Internacional',
        reference: 'Pactos Mesa de Cambio Ago-2026 (USD 201.920,34)',
        debitVES: 142900000,
        creditVES: 0,
        debitUSD: 201920.34,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Cargo Liquidación Mesa de Cambio Ago-2026',
        debitVES: 0,
        creditVES: 142900000,
        debitUSD: 0,
        creditUSD: 201920.34
      }
    ],
    totalDebitVES: 142900000,
    totalCreditVES: 142900000,
    totalDebitUSD: 201920.34,
    totalCreditUSD: 201920.34,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/06/2026 - COMP-FIN-REC-ENT-2026-001 (Línea de Crédito Rotativa Becerra - Desembolso)
  {
    id: 'VCH-2026-036',
    voucherNumber: 'COMP-FIN-REC-ENT-2026-001',
    voucherType: 'INGRESO',
    date: '30/06/2026',
    bcvRate: 633.36,
    concept: 'Desembolsos Línea Becerra May (Bs. 18,2M) + Jun (Bs. 64,95M) - Pasivo Financiero Reembolsable',
    beneficiaryOrThirdParty: 'Contrato de Línea de Crédito Rotativa Becerra 2026 - BECERRA',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Contrato de Línea de Crédito Rotativa Becerra 2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Desembolsos Línea Becerra May (Bs. 18,2M) + Jun (Bs. 64,95M)',
        debitVES: 83148000,
        creditVES: 0,
        debitUSD: 135112.12,
        creditUSD: 0
      },
      {
        accountCode: '2.1.01.02',
        accountName: 'Obligaciones Financieras Corto Plazo - Línea de Crédito Rotativa Becerra',
        reference: 'Pasivo Financiero Reembolsable (No gravable con ISLR/IVA)',
        debitVES: 0,
        creditVES: 83148000,
        debitUSD: 0,
        creditUSD: 135112.12
      }
    ],
    totalDebitVES: 83148000,
    totalCreditVES: 83148000,
    totalDebitUSD: 135112.12,
    totalCreditUSD: 135112.12,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/08/2026 - COMP-FIN-REC-ENT-2026-002
  {
    id: 'VCH-2026-037',
    voucherNumber: 'COMP-FIN-REC-ENT-2026-002',
    voucherType: 'INGRESO',
    date: '31/08/2026',
    bcvRate: 798.33,
    concept: 'Desembolsos Línea Becerra Jul (Bs. 74,22M) + Ago (Bs. 29,0M)',
    beneficiaryOrThirdParty: 'Contrato de Línea de Crédito Rotativa Becerra 2026 - BECERRA',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Contrato de Línea de Crédito Rotativa Becerra 2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Desembolsos Línea Becerra Jul (Bs. 74,22M) + Ago (Bs. 29,0M)',
        debitVES: 103228000,
        creditVES: 0,
        debitUSD: 151116.81,
        creditUSD: 0
      },
      {
        accountCode: '2.1.01.02',
        accountName: 'Obligaciones Financieras Corto Plazo - Línea de Crédito Rotativa Becerra',
        reference: 'Pasivo Financiero Reembolsable Jul-Ago',
        debitVES: 0,
        creditVES: 103228000,
        debitUSD: 0,
        creditUSD: 151116.81
      }
    ],
    totalDebitVES: 103228000,
    totalCreditVES: 103228000,
    totalDebitUSD: 151116.81,
    totalCreditUSD: 151116.81,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/06/2026 - COMP-FIN-REC-SAL-2026-001 (Amortización Capital Línea Becerra)
  {
    id: 'VCH-2026-038',
    voucherNumber: 'COMP-FIN-REC-SAL-2026-001',
    voucherType: 'EGRESO',
    date: '30/06/2026',
    bcvRate: 633.36,
    concept: 'Amortización Capital May (Bs. 4,5M) + Jun (Bs. 61,2M) Línea de Crédito Becerra',
    beneficiaryOrThirdParty: 'Contrato de Línea de Crédito Rotativa Becerra 2026 - BECERRA',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Salidas Banesco Amortización Línea Becerra May-Jun',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '2.1.01.02',
        accountName: 'Obligaciones Financieras Corto Plazo - Línea de Crédito Rotativa Becerra',
        reference: 'Amortización Capital May (Bs. 4,5M) + Jun (Bs. 61,2M)',
        debitVES: 65700000,
        creditVES: 0,
        debitUSD: 106224.74,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Salidas Banesco Amortización Línea Becerra May-Jun',
        debitVES: 0,
        creditVES: 65700000,
        debitUSD: 0,
        creditUSD: 106224.74
      }
    ],
    totalDebitVES: 65700000,
    totalCreditVES: 65700000,
    totalDebitUSD: 106224.74,
    totalCreditUSD: 106224.74,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/08/2026 - COMP-FIN-REC-SAL-2026-002
  {
    id: 'VCH-2026-039',
    voucherNumber: 'COMP-FIN-REC-SAL-2026-002',
    voucherType: 'EGRESO',
    date: '31/08/2026',
    bcvRate: 798.33,
    concept: 'Amortización Capital Jul (Bs. 76,8M) + Ago (Bs. 38,9M) Línea de Crédito Becerra',
    beneficiaryOrThirdParty: 'Contrato de Línea de Crédito Rotativa Becerra 2026 - BECERRA',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Salidas Banesco Amortización Línea Becerra Jul-Ago',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '2.1.01.02',
        accountName: 'Obligaciones Financieras Corto Plazo - Línea de Crédito Rotativa Becerra',
        reference: 'Amortización Capital Jul (Bs. 76,8M) + Ago (Bs. 38,9M)',
        debitVES: 115700000,
        creditVES: 0,
        debitUSD: 172225.26,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Salidas Banesco Amortización Línea Becerra Jul-Ago',
        debitVES: 0,
        creditVES: 115700000,
        debitUSD: 0,
        creditUSD: 172225.26
      }
    ],
    totalDebitVES: 115700000,
    totalCreditVES: 115700000,
    totalDebitUSD: 172225.26,
    totalCreditUSD: 172225.26,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/05/2026 - COMP-EGR-CAFE-2026-001 (Liquidaciones de Cosecha Ene-May 2026)
  {
    id: 'VCH-2026-040',
    voucherNumber: 'COMP-EGR-CAFE-2026-001',
    voucherType: 'EGRESO',
    date: '31/05/2026',
    bcvRate: 554.43,
    concept: 'Costo de Ventas / Liquidación de Compra de Café Verde y Cosecha - Liquidaciones Ene-May 2026',
    beneficiaryOrThirdParty: 'Proveedores Cafetaleros Ene-May 2026 (RUNSAI y Centros de Acopio)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Liquidaciones de Cosecha Ene-May 2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '5.1.01.01',
        accountName: 'Costo de Ventas / Liquidación de Compra de Café Verde y Cosecha',
        reference: 'Liquidaciones de Cosecha Ene-May 2026',
        debitVES: 53720000,
        creditVES: 0,
        debitUSD: 128363.20,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Salidas TRANS.CTAS a Terceros Banesco Ene-May',
        debitVES: 0,
        creditVES: 53720000,
        debitUSD: 0,
        creditUSD: 128363.20
      }
    ],
    totalDebitVES: 53720000,
    totalCreditVES: 53720000,
    totalDebitUSD: 128363.20,
    totalCreditUSD: 128363.20,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 30/06/2026 - COMP-EGR-CAFE-2026-002
  {
    id: 'VCH-2026-041',
    voucherNumber: 'COMP-EGR-CAFE-2026-002',
    voucherType: 'EGRESO',
    date: '30/06/2026',
    bcvRate: 633.36,
    concept: 'Costo de Ventas / Liquidación de Compra de Café Verde - Liquidación Lotes Cafetaleros Jun-2026',
    beneficiaryOrThirdParty: 'Proveedores Agrícolas Comercializadoras Primarias y Productores (Lote Junio 2026)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Liquidación Lotes Cafetaleros Jun-2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '5.1.01.01',
        accountName: 'Costo de Ventas / Liquidación de Compra de Café Verde y Cosecha',
        reference: 'Liquidación Lotes Cafetaleros Jun-2026',
        debitVES: 298450000,
        creditVES: 0,
        debitUSD: 444055.94,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Salidas TRANS.CTAS a Terceros Banesco Jun-2026',
        debitVES: 0,
        creditVES: 298450000,
        debitUSD: 0,
        creditUSD: 444055.94
      }
    ],
    totalDebitVES: 298450000,
    totalCreditVES: 298450000,
    totalDebitUSD: 444055.94,
    totalCreditUSD: 444055.94,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/07/2026 - COMP-EGR-CAFE-2026-003
  {
    id: 'VCH-2026-042',
    voucherNumber: 'COMP-EGR-CAFE-2026-003',
    voucherType: 'EGRESO',
    date: '31/07/2026',
    bcvRate: 748.79,
    concept: 'Costo de Ventas / Liquidación de Compra de Café Verde - Liquidación Lotes Cafetaleros Jul-2026',
    beneficiaryOrThirdParty: 'Proveedores Agrícolas Comercializadoras Primarias y Productores (Lote Julio 2026)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Liquidación Lotes Cafetaleros Jul-2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '5.1.01.01',
        accountName: 'Costo de Ventas / Liquidación de Compra de Café Verde y Cosecha',
        reference: 'Liquidación Lotes Cafetaleros Jul-2026',
        debitVES: 412300000,
        creditVES: 0,
        debitUSD: 593066.74,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Salidas TRANS.CTAS a Terceros Banesco Jul-2026',
        debitVES: 0,
        creditVES: 412300000,
        debitUSD: 0,
        creditUSD: 593066.74
      }
    ],
    totalDebitVES: 412300000,
    totalCreditVES: 412300000,
    totalDebitUSD: 593066.74,
    totalCreditUSD: 593066.74,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/08/2026 - COMP-EGR-CAFE-2026-004
  {
    id: 'VCH-2026-043',
    voucherNumber: 'COMP-EGR-CAFE-2026-004',
    voucherType: 'EGRESO',
    date: '31/08/2026',
    bcvRate: 798.33,
    concept: 'Costo de Ventas / Liquidación de Compra de Café Verde - Liquidación Lotes Cafetaleros Ago-2026',
    beneficiaryOrThirdParty: 'Proveedores Agrícolas Comercializadoras Primarias y Productores (Lote Agosto 2026)',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Liquidación Lotes Cafetaleros Ago-2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '5.1.01.01',
        accountName: 'Costo de Ventas / Liquidación de Compra de Café Verde y Cosecha',
        reference: 'Liquidación Lotes Cafetaleros Ago-2026',
        debitVES: 396800000,
        creditVES: 0,
        debitUSD: 552964.24,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Salidas TRANS.CTAS a Terceros Banesco Ago-2026',
        debitVES: 0,
        creditVES: 396800000,
        debitUSD: 0,
        creditUSD: 552964.24
      }
    ],
    totalDebitVES: 396800000,
    totalCreditVES: 396800000,
    totalDebitUSD: 552964.24,
    totalCreditUSD: 552964.24,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/08/2026 - COMP-EGR-FLE-2026-001 (Fletes, Almacenaje, Aduana y Guías)
  {
    id: 'VCH-2026-044',
    voucherNumber: 'COMP-EGR-FLE-2026-001',
    voucherType: 'EGRESO',
    date: '31/08/2026',
    bcvRate: 798.33,
    concept: 'Costo Logístico de Fletes Terrestres, Almacenaje, Aduana y Guías INSAI/SICA Ene-Ago 2026',
    beneficiaryOrThirdParty: 'Transportistas con Retención ISLR 3% (Cód. 053 Decreto 1.808) / Transporte Pesado y Aduana',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Facturas de Transporte Ene-Ago 2026 (Sujetas a Ret. ISLR 3%)',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '5.1.02.04',
        accountName: 'Costo Logístico de Fletes Terrestres, Almacenaje, Aduana y Guías INSAI/SICA',
        reference: 'Facturas de Transporte Ene-Ago 2026',
        debitVES: 45495000,
        creditVES: 0,
        debitUSD: 67380.15,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Pagos Netos de Fletes y Logística Ene-Ago 2026',
        debitVES: 0,
        creditVES: 45495000,
        debitUSD: 0,
        creditUSD: 67380.15
      }
    ],
    totalDebitVES: 45495000,
    totalCreditVES: 45495000,
    totalDebitUSD: 67380.15,
    totalCreditUSD: 67380.15,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/08/2026 - COMP-EGR-CAM-2026-001 (Personal Rural, Vigilancia y Pago Móvil)
  {
    id: 'VCH-2026-045',
    voucherNumber: 'COMP-EGR-CAM-2026-001',
    voucherType: 'EGRESO',
    date: '31/08/2026',
    bcvRate: 798.33,
    concept: 'Gastos de Personal Rural, Vigilancia LOTTT, Caleta y Pago Móvil de Campo Ene-Ago 2026',
    beneficiaryOrThirdParty: 'Personal de Vigilancia Rural, Cuadrillas de Caleta y Proveedores Menores de Campo',
    rifThirdParty: 'J-50145638-0',
    documentRef: 'Relaciones de Pago Móvil CCE y Nómina Ene-Ago 2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '5.2.01.01',
        accountName: 'Gastos de Personal Rural, Vigilancia LOTTT, Caleta y Pago Móvil de Campo',
        reference: 'Relaciones de Pago Móvil CCE y Nómina Ene-Ago 2026',
        debitVES: 12904000,
        creditVES: 0,
        debitUSD: 19412.80,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Cargos Banesco Pago Móvil CCE Ene-Ago 2026',
        debitVES: 0,
        creditVES: 12904000,
        debitUSD: 0,
        creditUSD: 19412.80
      }
    ],
    totalDebitVES: 12904000,
    totalCreditVES: 12904000,
    totalDebitUSD: 19412.80,
    totalCreditUSD: 19412.80,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  },

  // 31/08/2026 - COMP-EGR-COM-2026-001 (Comisiones Bancarias Banesco e IGTF)
  {
    id: 'VCH-2026-046',
    voucherNumber: 'COMP-EGR-COM-2026-001',
    voucherType: 'EGRESO',
    date: '31/08/2026',
    bcvRate: 798.33,
    concept: 'Gastos Financieros por Comisiones Bancarias Banesco y Débitos Automáticos IGTF Ene-Ago 2026',
    beneficiaryOrThirdParty: 'BANESCO BANCO UNIVERSAL C.A. / SENIAT (Percepción y Retención IGTF)',
    rifThirdParty: 'J-07013380-5 / G-20000303-0',
    documentRef: 'Débitos Automáticos Banesco Ene-Ago 2026',
    bankAccountRef: '0134-0342-18-3421089912',
    approvedBy: 'Ing. Omar Pérez',
    reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
    preparedBy: 'Administración Contable',
    status: 'CONFIRMADO',
    lines: [
      {
        accountCode: '5.3.01.01',
        accountName: 'Gastos Financieros por Comisiones Bancarias Banesco y Gasto IGTF',
        reference: 'Débitos Automáticos Banesco Ene-Ago 2026',
        debitVES: 26751113.95,
        creditVES: 0,
        debitUSD: 39618.42,
        creditUSD: 0
      },
      {
        accountCode: '1.1.01.02',
        accountName: 'Banesco Banco Universal - Cta. Cte. N° 0134-0342-18-3421089912 (VES)',
        reference: 'Cargos COM. TRF. MB / COM. PAGO MOVIL CCE / IGTF',
        debitVES: 0,
        creditVES: 26751113.95,
        debitUSD: 0,
        creditUSD: 39618.42
      }
    ],
    totalDebitVES: 26751113.95,
    totalCreditVES: 26751113.95,
    totalDebitUSD: 39618.42,
    totalCreditUSD: 39618.42,
    notes: 'Estado Firma y Sello SENIAT: EMITIDO_PENDIENTE_FIRMA'
  }
];

// RESUMEN DE RETENCIONES SENIAT DERIVADAS DE LA CONTABILIDAD OFICIAL
export const RETENTION_VOUCHERS_SUMMARY: RetentionVoucherSummary[] = [
  {
    id: 'RET-2026-001',
    correlative: 'RET-ISLR-2026-001',
    date: '31/08/2026',
    type: 'ISLR',
    supplier: 'Transportistas de Fletes Terrestres y Carga Pesada Ene-Ago 2026',
    rif: 'J-50145638-0',
    invoiceNumber: 'EXP-FLETE-ENE-AGO-2026',
    controlNumber: '00-008492',
    totalInvoiceVES: 45495000,
    taxableBaseVES: 45495000,
    baseAmountVES: 45495000,
    taxAmountVES: 1364850,
    retentionRate: 3.0,
    retainedAmountVES: 1364850,
    retainedAmountUSD: 1709.63,
    bcvRate: 798.33,
    seniatStatus: 'ENTERADO_SENIAT'
  }
];
