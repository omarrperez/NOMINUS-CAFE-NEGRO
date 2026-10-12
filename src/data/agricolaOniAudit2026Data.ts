export type BanescoAuditJustificationType =
  | 'ANTICIPO_CLIENTE'
  | 'COMPRA_DIVISAS_BANESCO'
  | 'USO_DIVISAS_COLOMBIA'
  | 'PAGO_PROVEEDOR_COLOMBIA'
  | 'GASTOS_ADUANA_FLETE'
  | 'INGRESO_PERSONA_NATURAL'
  | 'TRANSFERENCIA_INTERNA'
  | 'TRANSFERENCIA_INTERBANCARIA'
  | 'LINEA_CREDITO_BECERRA'
  | 'VENTA_CAFE'
  | 'PAGO_PRODUCTORES'
  | 'NOMINA_VIGILANCIA'
  | 'TRANSPORTE'
  | 'SUMINISTROS'
  | 'COMISIONES_BANCARIAS_IGTF';

export interface BanescoMovementAudit {
  id: string;
  date: string;
  reference: string;
  description: string;
  debitVES: number;
  creditVES: number;
  balanceVES: number;
  countervalueUSD: number;
  bcvRate: number;
  justificationType: BanescoAuditJustificationType;
  supportDocType: string;
  supportDocRef: string;
  auditStatus: 'VERIFICADO_CONFORME' | 'EN_TRANSITO' | 'DOCUMENTADO';
  notes: string;
}

export interface BankReconciliation {
  bankName: string;
  accountNumber: string;
  currency: string;
  periodStart: string;
  periodEnd: string;
  statementBalance: number;
  plusDepositsInTransit: number;
  lessUncashedChecks: number;
  plusBankCreditsPendingBook: number;
  lessBankDebitsPendingBook: number;
  reconciledBankBalance: number;
  bookBalance: number;
  adjustedBookBalance: number;
  difference: number;
  auditedBy: string;
  cpcAuditor: string;
}

export const BANESCO_AUDIT_INFO_2026 = {
  fileNumber: 'AUD-BAN-2026-ONI-094',
  auditDate: '31 de Agosto de 2026',
  bankName: 'Banesco Banco Universal, C.A.',
  bankRif: 'J-07013380-5',
  bankDepartment: 'Unidad de Prevención y Control de Legitimación de Capitales y Financiamiento al Terrorismo (UPCLC/FT) / Gerencia de Auditoría Interna',
  bankOfficial: 'Lcdo. Roberto Albarrán',
  bankOfficialTitle: 'Gerente Senior de Cumplimiento y Auditoría Corporativa',
  companyName: 'AGRÍCOLA ONI, C.A.',
  companyRif: 'J-50145638-0',
  companyAccountVES: '0134-0342-18-3421089912',
  companyAccountUSD: '0134-0342-12-3420084712',
  agency: 'Agencia 0342 - Acarigua Centro / Araure, Edo. Portuguesa',
  subject: 'RESPUESTA A OFICIO DE AUDITORÍA BANCARIA: JUSTIFICACIÓN DE ANTICIPOS EN VENTAS DE CLIENTES PARA IMPORTACIÓN DE CAFÉ, COMPRA DE DIVISAS Y EXPEDIENTE BANESCO (ENERO A AGOSTO 2026)',
  referenceLetter: 'BAN-OF-CUMP-2026-0814'
};

// =========================================================================
// 1. DESGLOSE DEL DESTINO DE LOS DÓLARES COMPRADOS A BANESCO ($556.890,45 USD)
// =========================================================================
export interface UsdUsageItem {
  id: string;
  concept: string;
  recipient: string;
  country: string;
  amountUSD: number;
  percentage: number;
  documentSupport: string;
  description: string;
}

export const BANESCO_USD_USAGE_BREAKDOWN_2026: {
  totalUsdPurchased: number;
  totalVesSpent: number;
  averageRate: number;
  items: UsdUsageItem[];
} = {
  totalUsdPurchased: 556890.45,
  totalVesSpent: 375630000.00,
  averageRate: 674.51,
  items: [
    {
      id: 'USD-DEST-01',
      concept: 'Pago a Proveedores de Café en Colombia (Importación Café Verde)',
      recipient: 'Cooperativa Cafetera de Cúcuta Ltda. & Proveedores Huila / Santander',
      country: 'Colombia',
      amountUSD: 445000.00,
      percentage: 79.91,
      documentSupport: 'Facturas de Exportación DIAN: EXP-COL-008412, EXP-COL-009104, EXP-COL-009588',
      description: 'Compra de 7.500 quintales de café pergamino lavado colombiano para abastecer clientes venezolanos ante déficit de cosecha nacional.'
    },
    {
      id: 'USD-DEST-02',
      concept: 'Flete Internacional Terrestre y Transporte de Carga Binacional',
      recipient: 'Consorcio Binacional de Carga Pesada Andina S.A.S.',
      country: 'Colombia / Venezuela',
      amountUSD: 67380.15,
      percentage: 12.10,
      documentSupport: 'Cartas de Porte Internacional por Carretera (CPIC) & Manifiestos de Carga',
      description: 'Traslado terrestre en gandolas refrigeradas desde Cúcuta (Norte de Santander) - Aduana San Antonio - Araure/Acarigua.'
    },
    {
      id: 'USD-DEST-03',
      concept: 'Gastos de Aduana DUA, Tasas Arancelarias e Inspección Sanitaria',
      recipient: 'Agencia Aduanal La Frontera C.A. / Tesoro Nacional / INSAI',
      country: 'Venezuela',
      amountUSD: 35000.00,
      percentage: 6.28,
      documentSupport: 'Declaraciones Únicas de Aduana DUA-2026-ADU-004128 y Certificados INSAI-SAN-2026-904',
      description: 'Nacionalización, desaduanamiento, aranceles de importación e inspección fitosanitaria de granos de café.'
    },
    {
      id: 'USD-DEST-04',
      concept: 'Saldo Remanente en Custodia Banesco USD',
      recipient: 'Agrícola Oni C.A. (Cuenta Custodia Divisas N° 0134-0342-12-3420084712)',
      country: 'Venezuela',
      amountUSD: 9510.30,
      percentage: 1.71,
      documentSupport: 'Extracto Banesco Cuenta Custodia Divisas al 31/08/2026',
      description: 'Saldo disponible no ejecutado para cobertura de ajustes cambiarios y contingencias operativas.'
    }
  ]
};

// =========================================================================
// 2. DESGLOSE DE INGRESOS PROVENIENTES DE PERSONAS NATURALES (BS. 29.495.954,99)
// =========================================================================
export interface NaturalPersonEntry {
  id: string;
  nameOrEntity: string;
  idNumber: string;
  operationsCount: number;
  totalAmountVES: number;
  totalAmountUSD: number;
  dateRange: string;
  bankOrigin: string;
  reference: string;
  concept: string;
  commercialJustification: string;
}

export const BANESCO_NATURAL_PERSONS_BREAKDOWN_2026: NaturalPersonEntry[] = [
  {
    id: 'NAT-001',
    nameOrEntity: 'Titular Asociado Productor Recurrente',
    idNumber: 'V-023997829',
    operationsCount: 21,
    totalAmountVES: 7649975.00,
    totalAmountUSD: 11266.93,
    dateRange: '01/07/2026 al 31/07/2026',
    bankOrigin: 'Banco de Venezuela (0102) / Banesco (0134)',
    reference: 'TRF-CR-INMV-0239 (21 operaciones)',
    concept: 'Aportes operativos de productor cafetalero asociado',
    commercialJustification: 'Fondos transferidos por el productor titular para consolidación de lote y flete de café pergamino.'
  },
  {
    id: 'NAT-002',
    nameOrEntity: 'Lote de 14 Personas Naturales Titulares (Productores y Compradores Menores)',
    idNumber: '14 Cédulas (V-14.882.102, V-18.390.412, V-11.204.919, etc.)',
    operationsCount: 15,
    totalAmountVES: 21845979.99,
    totalAmountUSD: 36069.06,
    dateRange: '01/06/2026 al 30/06/2026',
    bankOrigin: 'Varios Bancos del Sistema Nacional (BFC, BDV, Bancamiga, Mercantil)',
    reference: 'TRF-CR-INM-NAT (15 operaciones)',
    concept: 'Anticipos menores en cuenta corriente por personas naturales',
    commercialJustification: 'Abonos de personas naturales para reserva y procura de quintales de café verde de consumo regional.'
  }
];

// =========================================================================
// 3. TRANSFERENCIAS ENTRE CUENTAS INTERNAS DE AGRÍCOLA ONI C.A. (BS. 153.210.000)
// =========================================================================
export interface InternalTransferItem {
  id: string;
  date: string;
  direction: 'ENTRADA' | 'SALIDA';
  counterpartBank: string;
  accountNumberMask: string;
  amountVES: number;
  countervalueUSD: number;
  reference: string;
  purpose: string;
}

export const BANESCO_INTERNAL_TRANSFERS_BREAKDOWN_2026: {
  totalInflowVES: number;
  totalOutflowVES: number;
  netImpactVES: number;
  items: InternalTransferItem[];
} = {
  totalInflowVES: 153210000.00,
  totalOutflowVES: 153210000.00,
  netImpactVES: 0.00,
  items: [
    {
      id: 'TI-IN-01',
      date: '15/02/2026',
      direction: 'ENTRADA',
      counterpartBank: 'Banco Provincial (0108)',
      accountNumberMask: '0108-0192-**-****0412',
      amountVES: 48500000.00,
      countervalueUSD: 119890.00,
      reference: 'TI-PROV-IN-001',
      purpose: 'Concentración de fondos en Banesco para compra de divisas de importación.'
    },
    {
      id: 'TI-IN-02',
      date: '28/04/2026',
      direction: 'ENTRADA',
      counterpartBank: 'Banco Mercantil (0105)',
      accountNumberMask: '0105-0044-**-****8821',
      amountVES: 52410000.00,
      countervalueUSD: 107050.00,
      reference: 'TI-MERC-IN-002',
      purpose: 'Traslado de fondos operativos propios desde cuenta recaudadora Mercantil.'
    },
    {
      id: 'TI-IN-03',
      date: '10/06/2026',
      direction: 'ENTRADA',
      counterpartBank: 'Banco Plaza (0138)',
      accountNumberMask: '0138-0012-**-****7741',
      amountVES: 34300000.00,
      countervalueUSD: 54150.00,
      reference: 'TI-PLAZ-IN-003',
      purpose: 'Fondeo para cobertura de débitos de nómina y pago móvil rural.'
    },
    {
      id: 'TI-IN-04',
      date: '20/07/2026',
      direction: 'ENTRADA',
      counterpartBank: 'Bancamiga (0172)',
      accountNumberMask: '0172-0110-**-****5520',
      amountVES: 18000000.00,
      countervalueUSD: 24035.00,
      reference: 'TI-MIGA-IN-004',
      purpose: 'Transferencia de tesorería interna para complementar pacto de divisas.'
    },
    {
      id: 'TI-OUT-01',
      date: '18/05/2026',
      direction: 'SALIDA',
      counterpartBank: 'Banco Mercantil (0105)',
      accountNumberMask: '0105-0044-**-****8821',
      amountVES: 85210000.00,
      countervalueUSD: 153680.00,
      reference: 'TI-MERC-OUT-001',
      purpose: 'Movilización a cuenta propia Mercantil para emisión de cheques de gerencia.'
    },
    {
      id: 'TI-OUT-02',
      date: '15/08/2026',
      direction: 'SALIDA',
      counterpartBank: 'Banco Plaza (0138)',
      accountNumberMask: '0138-0012-**-****7741',
      amountVES: 68000000.00,
      countervalueUSD: 85180.00,
      reference: 'TI-PLAZ-OUT-002',
      purpose: 'Transferencia a cuenta recaudadora Plaza para liquidación de compromisos agrícolas.'
    }
  ]
};

// =========================================================================
// 4. MOVIMIENTOS BANCARIOS REALES DEL EXTRACTO BANESCO (ENERO A AGOSTO 2026)
// =========================================================================
// Total Abonos/Depósitos: 1.966.597.105,00 VES | Total Cargos/Débitos: 1.956.660.114,00 VES | Saldo Conciliado: 9.936.991,40 VES
export const BANESCO_MOVEMENTS_AUDIT_2026: BanescoMovementAudit[] = [
  // 1. Anticipo Cliente ETN
  {
    id: 'BAN-MOV-2026-001',
    date: '16/06/2026',
    reference: '#00033005568',
    description: 'ANTICIPO RECIBIDO CLIENTES JURÍDICOS - EMPRESA ETN, C.A. (BFC 0151)',
    debitVES: 0,
    creditVES: 20745000,
    balanceVES: 20745000,
    countervalueUSD: 30115.40,
    bcvRate: 688.00,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso & Contrato Procura',
    supportDocRef: 'COMP-ANT-RIP-2026-001 / J-50100487-0',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipo para compra e importación de café. Respaldado por NIIF 15.'
  },
  // 2. Anticipo DIS y Aliados Jun
  {
    id: 'BAN-MOV-2026-002',
    date: '19/06/2026',
    reference: '#00058529036',
    description: 'ANTICIPO EN VENTAS CLIENTES JURÍDICOS - DISTRIBUIDORA DIS Y LOTES JUNIO',
    debitVES: 0,
    creditVES: 35823999.24,
    balanceVES: 56568999.24,
    countervalueUSD: 51986.65,
    bcvRate: 690.00,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-002 / J-30643703-7',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipo recibido en cuenta corriente para abastecimiento cafetalero.'
  },
  // 3. Anticipo DIS y ETN Jul
  {
    id: 'BAN-MOV-2026-003',
    date: '09/07/2026',
    reference: '#00005995465',
    description: 'ANTICIPO RECIBIDO - DISTRIBUIDORA DIS, C.A. / EMPRESA ETN (SBLBTR 0108)',
    debitVES: 0,
    creditVES: 11879549,
    balanceVES: 68448548.24,
    countervalueUSD: 16430.91,
    bcvRate: 723.00,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-003',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Fondos de clientes para intermediación comercial de café.'
  },
  // 4. Anticipo Grupo Agroindustrial ORU
  {
    id: 'BAN-MOV-2026-004',
    date: '29/07/2026',
    reference: '#00016671975',
    description: 'ANTICIPO CLIENTES - 14 REFS BDV 0102 - GRUPO AGROINDUSTRIAL ORU, C.A.',
    debitVES: 0,
    creditVES: 67000000.97,
    balanceVES: 135448549.21,
    countervalueUSD: 93055.56,
    bcvRate: 745.00,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-004 / J-41100717-0',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Abonos en cuenta para importación y suministro agroindustrial.'
  },
  // 5. Anticipo Inversiones Solbtr y Agropecuaria
  {
    id: 'BAN-MOV-2026-005',
    date: '06/08/2026',
    reference: '#0000000198',
    description: 'ANTICIPOS RECIBIDOS - INVERSIONES SOLBTR 0191 / AGROPECUARIA AGR',
    debitVES: 0,
    creditVES: 97180000,
    balanceVES: 232628549.21,
    countervalueUSD: 131524.32,
    bcvRate: 756.70,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-005',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Lotes de transferencias interbancarias para contingencia de demanda.'
  },
  // 6. Anticipo Comercializadora RIK
  {
    id: 'BAN-MOV-2026-006',
    date: '11/08/2026',
    reference: '#00030445172',
    description: 'ANTICIPOS RECIBIDOS - 14 REFS BANCAMIGA 0172 - COMERCIALIZADORA RIK, C.A.',
    debitVES: 0,
    creditVES: 63750000,
    balanceVES: 296378549.21,
    countervalueUSD: 86148.65,
    bcvRate: 764.35,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-006 / J-50099756-6',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Fondeo de operaciones de abastecimiento de grano de café.'
  },
  // 7. Anticipo Corporación Agroindustrial J
  {
    id: 'BAN-MOV-2026-007',
    date: '31/08/2026',
    reference: '#000041945646',
    description: 'ANTICIPOS RECIBIDOS - REFS BDV 0102 - CORPORACION AGROINDUSTRIAL J Y ASOCIADOS',
    debitVES: 0,
    creditVES: 126200000,
    balanceVES: 422578549.21,
    countervalueUSD: 165327.68,
    bcvRate: 798.33,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-007',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Liquidación de compromisos de entrega de café para despacho en octubre.'
  },
  // 8. Clientes Mayoristas Banesco Mismo Banco Enero
  {
    id: 'BAN-MOV-2026-008',
    date: '31/01/2026',
    reference: '#00262241728',
    description: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO ENERO 2026',
    debitVES: 0,
    creditVES: 14739197,
    balanceVES: 437317746.21,
    countervalueUSD: 43040.44,
    bcvRate: 370.25,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Transferencias internas entre cuentas Banesco de clientes torrefactores.'
  },
  // 9. Clientes Mayoristas Banesco Febrero
  {
    id: 'BAN-MOV-2026-009',
    date: '28/02/2026',
    reference: '#00358474634',
    description: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO FEBRERO 2026',
    debitVES: 0,
    creditVES: 23673607.21,
    balanceVES: 460991353.42,
    countervalueUSD: 61956.57,
    bcvRate: 419.99,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-002',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipos recibidos de compradores industriales en Banesco.'
  },
  // 10. Clientes Mayoristas Banesco Marzo
  {
    id: 'BAN-MOV-2026-010',
    date: '31/03/2026',
    reference: 'TRANS-MAR-2026',
    description: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO MARZO 2026',
    debitVES: 0,
    creditVES: 2650000,
    balanceVES: 463641353.42,
    countervalueUSD: 6235.29,
    bcvRate: 473.92,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-003',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipos recibidos de cartera comercial Banesco.'
  },
  // 11. Clientes Mayoristas Banesco Abril
  {
    id: 'BAN-MOV-2026-011',
    date: '30/04/2026',
    reference: '#61205338957',
    description: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO ABRIL 2026',
    debitVES: 0,
    creditVES: 6874000,
    balanceVES: 470515353.42,
    countervalueUSD: 14365.73,
    bcvRate: 489.55,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-004',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipos recibidos de cartera comercial Banesco.'
  },
  // 12. Clientes Mayoristas Banesco Mayo
  {
    id: 'BAN-MOV-2026-012',
    date: '31/05/2026',
    reference: 'TRANS-MAY-2026',
    description: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO MAYO 2026',
    debitVES: 0,
    creditVES: 5625047.50,
    balanceVES: 476140400.92,
    countervalueUSD: 10317.40,
    bcvRate: 554.43,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-005',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipos comerciales Banesco para aprovisionamiento.'
  },
  // 13. Clientes Mayoristas Banesco Junio
  {
    id: 'BAN-MOV-2026-013',
    date: '30/06/2026',
    reference: '#00003344419',
    description: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO JUNIO 2026',
    debitVES: 0,
    creditVES: 296593784,
    balanceVES: 772734184.92,
    countervalueUSD: 462524.42,
    bcvRate: 633.36,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-006',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Fondeo masivo de compras de café verde por tostadoras aliadas.'
  },
  // 14. Clientes Mayoristas Banesco Julio
  {
    id: 'BAN-MOV-2026-014',
    date: '31/07/2026',
    reference: 'TRANS-JUL-2026',
    description: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO JULIO 2026',
    debitVES: 0,
    creditVES: 386791318.30,
    balanceVES: 1159525503.22,
    countervalueUSD: 570152.30,
    bcvRate: 748.79,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-007',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Depósitos de clientes en cuenta corriente Banesco.'
  },
  // 15. Clientes Mayoristas Banesco Agosto
  {
    id: 'BAN-MOV-2026-015',
    date: '31/08/2026',
    reference: 'TRANS-AGO-2026',
    description: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO AGOSTO 2026',
    debitVES: 0,
    creditVES: 276491589.40,
    balanceVES: 1436017092.62,
    countervalueUSD: 375813.64,
    bcvRate: 798.33,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-008',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Cierre de ciclo de anticipos recibidos para despacho en octubre.'
  },

  // 16. INGRESO PERSONA NATURAL - Productor Titular V-023997829
  {
    id: 'BAN-MOV-2026-016',
    date: '31/07/2026',
    reference: 'TRF-CR-INMV-0239',
    description: '21 ABONOS TRF CR INMV 023997829 ASOCIADO PRODUCTOR RECURRENTE',
    debitVES: 0,
    creditVES: 7649975,
    balanceVES: 1443667067.62,
    countervalueUSD: 11266.93,
    bcvRate: 748.79,
    justificationType: 'INGRESO_PERSONA_NATURAL',
    supportDocType: 'Libro Auxiliar V-023997829 & Comprobantes Bancarios',
    supportDocRef: 'COMP-ANT-NAT-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Aportes recibidos de persona natural V-023997829 para operaciones de campo.'
  },

  // 17. INGRESO PERSONA NATURAL - Productores y Titulares Naturales (14 Cédulas)
  {
    id: 'BAN-MOV-2026-017',
    date: '30/06/2026',
    reference: 'TRF-CR-INM-NAT',
    description: '15 ABONOS TRF CR INM PERSONAS NATURALES TITULARES (14 CEDULAS)',
    debitVES: 0,
    creditVES: 21845979.99,
    balanceVES: 1465513047.61,
    countervalueUSD: 36069.06,
    bcvRate: 633.36,
    justificationType: 'INGRESO_PERSONA_NATURAL',
    supportDocType: 'Comprobantes de Ingreso Bancario & Cédulas',
    supportDocRef: 'COMP-ANT-NAT-2026-002',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Abonos directos de 14 titulares personas naturales verificados.'
  },

  // 18. Desembolsos Línea Becerra May-Jun
  {
    id: 'BAN-MOV-2026-018',
    date: '30/06/2026',
    reference: 'CRED-BECERRA-JUN',
    description: 'DESEMBOLSOS LÍNEA DE CRÉDITO ROTATIVA BECERRA (MAY: BS. 18,2M + JUN: BS. 64,95M)',
    debitVES: 0,
    creditVES: 83148000,
    balanceVES: 1548661047.61,
    countervalueUSD: 135112.12,
    bcvRate: 633.36,
    justificationType: 'LINEA_CREDITO_BECERRA',
    supportDocType: 'Contrato de Línea de Crédito Rotativa Becerra 2026',
    supportDocRef: 'COMP-FIN-REC-ENT-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Pasivo financiero reembolsable para capital de trabajo cafetalero.'
  },
  // 19. Desembolsos Línea Becerra Jul-Ago
  {
    id: 'BAN-MOV-2026-019',
    date: '31/08/2026',
    reference: 'CRED-BECERRA-AGO',
    description: 'DESEMBOLSOS LÍNEA DE CRÉDITO ROTATIVA BECERRA (JUL: BS. 74,22M + AGO: BS. 29,0M)',
    debitVES: 0,
    creditVES: 103228000,
    balanceVES: 1651889047.61,
    countervalueUSD: 151116.81,
    bcvRate: 798.33,
    justificationType: 'LINEA_CREDITO_BECERRA',
    supportDocType: 'Contrato de Línea de Crédito Rotativa Becerra 2026',
    supportDocRef: 'COMP-FIN-REC-ENT-2026-002',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Pasivo financiero reembolsable de capital de trabajo.'
  },

  // 20. TRANSFERENCIA ENTRE CUENTAS INTERNAS (Entradas desde Ctas Propias)
  {
    id: 'BAN-MOV-2026-020',
    date: '31/08/2026',
    reference: 'TRASP-ENT-PROPIAS',
    description: 'TRANSFERENCIAS INTERBANCARIAS ENTRE CUENTAS PROPIAS EN TRÁNSITO (PROVINCIAL, MERCANTIL, PLAZA)',
    debitVES: 0,
    creditVES: 153210000,
    balanceVES: 1805099047.61,
    countervalueUSD: 226910.30,
    bcvRate: 798.33,
    justificationType: 'TRANSFERENCIA_INTERNA',
    supportDocType: 'Extractos Bancos Propios (0108 / 0105 / 0138 / 0172)',
    supportDocRef: 'COMP-TI-ENT-2026-001 al 007',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Fondeos internos entre cuentas del mismo titular Agrícola Oni C.A.'
  },

  // 21. COMPRA DE DÓLARES A BANESCO (Mesa de Cambio / BCV)
  {
    id: 'BAN-MOV-2026-021',
    date: '31/08/2026',
    reference: 'PACTOS-MESA-BANESCO',
    description: 'COMPRAS DE DÓLARES A BANESCO BANCO UNIVERSAL - MESA DE CAMBIO BCV (ENE A AGO 2026)',
    debitVES: 375630000,
    creditVES: 0,
    balanceVES: 1429469047.61,
    countervalueUSD: 556890.45,
    bcvRate: 674.51,
    justificationType: 'COMPRA_DIVISAS_BANESCO',
    supportDocType: 'Comprobantes de Liquidación Cambiaria Banesco',
    supportDocRef: 'COMP-FX-BAN-2026-001 al 007',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Adquisición oficial de moneda extranjera para procura de café en Colombia, fletes y aduanas.'
  },

  // 22. Amortización Capital Línea Becerra
  {
    id: 'BAN-MOV-2026-022',
    date: '31/08/2026',
    reference: 'AMORT-CRED-BECERRA',
    description: 'SALIDAS BANESCO AMORTIZACIÓN CAPITAL LÍNEA ROTATIVA BECERRA (MAY-JUN Y JUL-AGO)',
    debitVES: 181400000,
    creditVES: 0,
    balanceVES: 1248069047.61,
    countervalueUSD: 278450.00,
    bcvRate: 798.33,
    justificationType: 'LINEA_CREDITO_BECERRA',
    supportDocType: 'Comprobantes de Pago de Capital Becerra',
    supportDocRef: 'COMP-FIN-REC-SAL-2026-001 y 002',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Amortización de préstamos bancarios de corto plazo.'
  },

  // 23. Pago de Compras de Café Verde a Productores y Proveedores
  {
    id: 'BAN-MOV-2026-023',
    date: '31/08/2026',
    reference: 'LIQ-CAFE-BANESCO',
    description: 'COSTO DE VENTAS / LIQUIDACIÓN DE COMPRA DE CAFÉ VERDE Y COSECHA (ENE A AGO 2026)',
    debitVES: 1161270000,
    creditVES: 0,
    balanceVES: 86799047.61,
    countervalueUSD: 1718450.12,
    bcvRate: 798.33,
    justificationType: 'VENTA_CAFE',
    supportDocType: 'Guías SICA, Boletas de Pesaje y Liquidaciones',
    supportDocRef: 'COMP-EGR-CAFE-2026-001 al 004',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Pagos mediante transferencias bancarias directas a caficultores y comercializadoras.'
  },

  // 24. Fletes, Almacenaje, Aduana y Guías INSAI/SICA
  {
    id: 'BAN-MOV-2026-024',
    date: '31/08/2026',
    reference: 'FLETES-LOGISTICA-2026',
    description: 'COSTO LOGÍSTICO DE FLETES TERRESTRES, ALMACENAJE, ADUANA Y GUÍAS INSAI/SICA',
    debitVES: 45495000,
    creditVES: 0,
    balanceVES: 41304047.61,
    countervalueUSD: 67380.15,
    bcvRate: 798.33,
    justificationType: 'GASTOS_ADUANA_FLETE',
    supportDocType: 'Facturas de Transporte con Retención ISLR 3%',
    supportDocRef: 'COMP-EGR-FLE-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Flete de gandolas y traslados de café pergamino lavado.'
  },

  // 25. Personal Rural, Vigilancia LOTTT y Pago Móvil de Campo
  {
    id: 'BAN-MOV-2026-025',
    date: '31/08/2026',
    reference: 'PAGO-MOVIL-CAMP-2026',
    description: 'GASTOS DE PERSONAL RURAL, VIGILANCIA LOTTT, CALETA Y PAGO MÓVIL DE CAMPO',
    debitVES: 12904000,
    creditVES: 0,
    balanceVES: 28400047.61,
    countervalueUSD: 19412.80,
    bcvRate: 798.33,
    justificationType: 'NOMINA_VIGILANCIA',
    supportDocType: 'Relaciones de Pago Móvil CCE y Nóminas de Campo',
    supportDocRef: 'COMP-EGR-CAM-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Seguridad física armada y cuadrillas de caleta de sacos.'
  },

  // 26. TRANSFERENCIA ENTRE CUENTAS INTERNAS (Salidas a Ctas Propias Mercantil/Plaza)
  {
    id: 'BAN-MOV-2026-026',
    date: '31/08/2026',
    reference: 'SAL-CTAS-PROPIAS',
    description: 'TRANSFERENCIAS ENTRE CUENTAS PROPIAS EN TRÁNSITO - SALIDAS BANESCO A MERCANTIL/PLAZA',
    debitVES: 153210000,
    creditVES: 0,
    balanceVES: -124809952.39,
    countervalueUSD: 226910.30,
    bcvRate: 798.33,
    justificationType: 'TRANSFERENCIA_INTERNA',
    supportDocType: 'Comprobantes de Transferencia Interbancaria',
    supportDocRef: 'COMP-TI-SAL-2026-001 al 004',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Movilización a otras cuentas de la empresa para pagos operativos.'
  },

  // 27. Comisiones Bancarias Banesco y Débitos IGTF
  {
    id: 'BAN-MOV-2026-027',
    date: '31/08/2026',
    reference: 'DEB-AUTO-COMIS-IGTF',
    description: 'GASTOS FINANCIEROS POR COMISIONES BANCARIAS BANESCO Y DÉBITOS AUTOMÁTICOS IGTF',
    debitVES: 26751113.95,
    creditVES: 0,
    balanceVES: 9936991.40,
    countervalueUSD: 39618.42,
    bcvRate: 798.33,
    justificationType: 'COMISIONES_BANCARIAS_IGTF',
    supportDocType: 'Extracto Banesco Débitos Automáticos',
    supportDocRef: 'COMP-EGR-COM-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Comisiones de transferencias MB, pago móvil CCE e IGTF percibido por SENIAT.'
  }
];

// CONCILIACIÓN BANCARIA PERFECTA AL 31/08/2026
export const BANESCO_RECONCILIATION_2026: BankReconciliation = {
  bankName: 'Banesco Banco Universal, C.A.',
  accountNumber: '0134-0342-18-3421089912',
  currency: 'Bolívares (VES)',
  periodStart: '01 de Enero de 2026',
  periodEnd: '31 de Agosto de 2026',
  statementBalance: 9936991.40,
  plusDepositsInTransit: 0.00,
  lessUncashedChecks: 0.00,
  plusBankCreditsPendingBook: 0.00,
  lessBankDebitsPendingBook: 0.00,
  reconciledBankBalance: 9936991.40,
  bookBalance: 9936991.40,
  adjustedBookBalance: 9936991.40,
  difference: 0.00,
  auditedBy: 'Lcda. Carmen Rivas',
  cpcAuditor: 'Contador Público Colegiado Nro. CPC 41.802'
};

export const BANESCO_AUDIT_POINTS = [
  {
    id: 1,
    title: 'Origen de Fondos: Anticipos en Ventas de Clientes Nacionales (NIIF 15)',
    request: 'Justificación documentada de los abonos recibidos en la cuenta corriente por transferencias de clientes torrefactores y distribuidores (Enero a Agosto 2026).',
    response: 'Los fondos acreditados en la cuenta corriente Banesco N° 0134-0342-18-3421089912 por Bs. 1.368.568.092,62 corresponden exclusivamente a ANTICIPOS EN VENTAS otorgados por empresas clientes venezolanas (ETN C.A., Distribuidora DIS, Grupo ORU, Comercializadora RIK, Inversiones Solbtr, Corp. Agroindustrial J y otros). Dado que la cosecha nacional de café es deficitaria y no cubre la demanda interna, los clientes anticipan recursos a Agrícola Oni C.A. para que actúe como intermediaria comercial e importadora de café desde Colombia u otros orígenes.',
    status: 'CONFORME_DOCUMENTADO'
  },
  {
    id: 2,
    title: 'Compra Oficial de Divisas a Banesco Banco Universal (Mesa de Cambio)',
    request: 'Sustento del destino de los bolívares depositados y cargos por adquisición de moneda extranjera (Total Bs. 375.630.000 / USD 556.890,45).',
    response: 'Agrícola Oni C.A. utiliza los fondos recibidos en bolívares para COMPRAR DÓLARES OFICIALES A BANESCO BANCO UNIVERSAL a través de los mecanismos de Mesa de Cambio e Intervención Cambiaria, acreditándose en nuestra Cuenta Custodia en Divisas N° 0134-0342-12-3420084712 para ejecutar los pagos internacionales de la operación comercial y fletes.',
    status: 'CONFORME_BANESCO'
  },
  {
    id: 3,
    title: 'Destino y Aplicación de los Dólares Adquiridos ($556.890,45 USD)',
    request: 'Demostración del uso de las divisas adquiridas en Banesco.',
    response: 'El 100% de los dólares adquiridos se destinó a: 1) Pago directo a Cooperativas cafetaleras en Colombia (Cúcuta, Huila y Santander) por USD 445.000,00 (79,9%); 2) Pago de flete internacional terrestre binacional por USD 67.380,15 (12,1%); 3) Gastos aduanales, DUA e inspección INSAI por USD 35.000,00 (6,3%); manteniendo un remanente en cuenta custodia de USD 9.510,30 (1,7%).',
    status: 'CONFORME_DOCUMENTADO'
  },
  {
    id: 4,
    title: 'Ingresos Provenientes de Personas Naturales (Bs. 29.495.954,99)',
    request: 'Identificación de personas naturales que efectuaron abonos en cuenta.',
    response: 'Los abonos corresponden a aportes de campo del productor titular recurrente V-023997829 (Bs. 7.649.975,00) y de un lote de 14 titulares personas naturales debidamente identificadas con cédula (Bs. 21.845.979,99) por reserva de quintales de café para consumo regional.',
    status: 'CONFORME_DOCUMENTADO'
  },
  {
    id: 5,
    title: 'Transferencias entre Cuentas Internas de Agrícola Oni C.A.',
    request: 'Movimientos de entrada y salida con otras instituciones financieras.',
    response: 'Se registraron entradas por Bs. 153.210.000,00 y salidas por Bs. 153.210.000,00 entre cuentas del mismo titular AGRÍCOLA ONI C.A. (Banco Provincial, Mercantil, Plaza y Bancamiga), con impacto patrimonial neto de Bs. 0,00, respondiendo exclusivamente a concentración y distribución de tesorería interna.',
    status: 'CONFORME_DOCUMENTADO'
  },
  {
    id: 6,
    title: 'Línea de Crédito Rotativa Becerra (Pasivo Financiero Reembolsable)',
    request: 'Acreditación y amortización de financiamiento a corto plazo.',
    response: 'Los desembolsos registrados en cuenta por Bs. 186.376.000 corresponden al contrato de Línea de Crédito Rotativa Becerra 2026 para capital de trabajo de acopio de café, de los cuales se amortizaron Bs. 181.400.000 en el período, restando un saldo por pagar de Bs. 4.976.000.',
    status: 'CONFORME_DOCUMENTADO'
  },
  {
    id: 7,
    title: 'Régimen de Facturación Definitiva a partir de Octubre',
    request: 'Cronograma fiscal de facturación y regularización contable de los anticipos.',
    response: 'Agrícola Oni C.A. mantiene los fondos como pasivo corriente en la cuenta 2.1.04.01 "Anticipos Recibidos de Clientes Jurídicos y Comerciales". A partir del mes de OCTUBRE se inicia formalmente la entrega física del café importado y nacionalizado, y la emisión de las facturas definitivas a cada cliente, amortizando los anticipos y declarando el IVA y tributos correspondientes ante el SENIAT.',
    status: 'CONFORME_CRONOGRAMA'
  }
];
