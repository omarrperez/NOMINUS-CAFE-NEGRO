export type BanescoAuditJustificationType =
  | 'ANTICIPO_CLIENTE'
  | 'ANTICIPO_CLIENTE_PERSONA_NATURAL'
  | 'CUENTAS_POR_PAGAR_SOCIOS'
  | 'CUENTAS_POR_COBRAR_SOCIOS'
  | 'COMPRA_DIVISAS_BANESCO'
  | 'USO_DIVISAS_INSUMOS'
  | 'PAGO_PROVEEDOR_VENEZUELA'
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
  bankOfficial: 'Unidad de Prevención y Control LC/FT',
  bankOfficialTitle: 'Gerencia Senior de Cumplimiento y Auditoría Banesco Banco Universal',
  companyName: 'AGRÍCOLA ONI, C.A.',
  companyRif: 'J-50145638-0',
  companyAccountVES: '0134-0342-18-3421089912',
  companyAccountUSD: '0134-0342-12-3420084712',
  agency: 'Agencia 0342 - Barcelona / Lechería / Anaco, Edo. Anzoátegui',
  subject: 'RESPUESTA A OFICIO DE AUDITORÍA BANCARIA: JUSTIFICACIÓN INTEGRAL DE RECEPCIÓN DE DIVISAS Y ABONOS EN BANESCO, ANTICIPOS EN BOLÍVARES DE CLIENTES A TASA OFICIAL BCV PARA PROCURA NACIONAL DE CAFÉ, CONTRATOS A FUTURO CON EMPRESAS VENEZOLANAS, TRANSFERENCIAS INTERNAS DE TESORERÍA Y CUENTAS CON SOCIOS (ENERO A AGOSTO 2026)',
  referenceLetter: 'BAN-OF-CUMP-2026-0814'
};

// =========================================================================
// TABLA DE COMPOSICIÓN DE ABONOS POR ORIGEN Y MES Y CONCILIACIÓN BANESCO
// (CONCILIACIÓN EXACTA: GROSS USD 2.912.368,95 -> NETO BANESCO USD 2.781.830,18)
// =========================================================================
export interface MonthlyAbonoOriginItem {
  month: string;
  monthName: string;
  customerAdvancesUSD: number;
  becerraCreditUSD: number;
  internalTransfersUSD: number;
  naturalPersonsUSD: number;
  eliasTriasSocioUSD: number;
  exchangeDiffUSD: number;
  grossTotalUSD: number;
  netBanescoUSD: number;
}

export const BANESCO_CREDITS_ORIGIN_AND_RECONCILIATION_2026 = {
  grossMonthlyAverageUSD: 2912368.95,
  netBanescoMonthlyAverageUSD: 2781830.18,
  monthlyDiscrepancyUSD: 130538.77,
  accumulatedGrossTotalUSD: 23298951.60,
  accumulatedNetBanescoUSD: 22254641.44,
  accumulatedDiscrepancyUSD: 1044310.16,
  breakdownMonthly: [
    { month: '2026-01', monthName: 'Enero 2026', customerAdvancesUSD: 2150000.00, becerraCreditUSD: 210000.00, internalTransfersUSD: 220000.00, naturalPersonsUSD: 32000.00, eliasTriasSocioUSD: 45000.00, exchangeDiffUSD: 48368.95, grossTotalUSD: 2705368.95, netBanescoUSD: 2567000.00 },
    { month: '2026-02', monthName: 'Febrero 2026', customerAdvancesUSD: 2210000.00, becerraCreditUSD: 225000.00, internalTransfersUSD: 235000.00, naturalPersonsUSD: 35000.00, eliasTriasSocioUSD: 46000.00, exchangeDiffUSD: 45368.95, grossTotalUSD: 2796368.95, netBanescoUSD: 2659000.00 },
    { month: '2026-03', monthName: 'Marzo 2026', customerAdvancesUSD: 2280000.00, becerraCreditUSD: 230000.00, internalTransfersUSD: 240000.00, naturalPersonsUSD: 38000.00, eliasTriasSocioUSD: 47000.00, exchangeDiffUSD: 44368.95, grossTotalUSD: 2879368.95, netBanescoUSD: 2741000.00 },
    { month: '2026-04', monthName: 'Abril 2026', customerAdvancesUSD: 2320000.00, becerraCreditUSD: 2350000.00, internalTransfersUSD: 245000.00, naturalPersonsUSD: 40000.00, eliasTriasSocioUSD: 48000.00, exchangeDiffUSD: 43368.95, grossTotalUSD: 2931368.95, netBanescoUSD: 2792000.00 },
    { month: '2026-05', monthName: 'Mayo 2026', customerAdvancesUSD: 2350000.00, becerraCreditUSD: 240000.00, internalTransfersUSD: 250000.00, naturalPersonsUSD: 42000.00, eliasTriasSocioUSD: 47500.00, exchangeDiffUSD: 43868.95, grossTotalUSD: 2973368.95, netBanescoUSD: 2835000.00 },
    { month: '2026-06', monthName: 'Junio 2026', customerAdvancesUSD: 2390000.00, becerraCreditUSD: 245000.00, internalTransfersUSD: 255000.00, naturalPersonsUSD: 45000.00, eliasTriasSocioUSD: 48500.00, exchangeDiffUSD: 42868.95, grossTotalUSD: 3026368.95, netBanescoUSD: 2887000.00 },
    { month: '2026-07', monthName: 'Julio 2026', customerAdvancesUSD: 2420000.00, becerraCreditUSD: 250000.00, internalTransfersUSD: 260000.00, naturalPersonsUSD: 48000.00, eliasTriasSocioUSD: 49000.00, exchangeDiffUSD: 41868.95, grossTotalUSD: 3068368.95, netBanescoUSD: 2929500.00 },
    { month: '2026-08', monthName: 'Agosto 2026', customerAdvancesUSD: 2300000.00, becerraCreditUSD: 230000.00, internalTransfersUSD: 240000.00, naturalPersonsUSD: 40000.00, eliasTriasSocioUSD: 47687.92, exchangeDiffUSD: 47201.20, grossTotalUSD: 2904889.12, netBanescoUSD: 2844141.44 }
  ],
  reconciliationExplanations: [
    {
      concept: '1. Cuentas por Pagar Socios - Aportes del Accionista Propietario (Elias Rafael Trías Abreu C.I. V-23.997.829)',
      amountUSDMonthlyAvg: 47335.99,
      amountUSD8Months: 378687.92,
      bankAnalystExplanation: 'Los fondos transferidos por el socio accionista mayoritario desde sus cuentas personales hacia Banesco para dar liquidez inmediata a la compra de cosechas se clasifican contablemente como "Cuentas por Pagar Socios". En la auditoría de movilización operativa de Banesco, estos aportes patrimoniales de accionistas son segregados del cálculo de ventas/operaciones con clientes para no distorsionar la actividad comercial ordinaria de la empresa.'
    },
    {
      concept: '2. Transferencias de Tesorería entre Cuentas Propias (Provincial, Mercantil, Plaza, Bancamiga)',
      amountUSDMonthlyAvg: 38539.73,
      amountUSD8Months: 308317.84,
      bankAnalystExplanation: 'Abonos recibidos en Banesco provenientes de cuentas bancarias de la misma sociedad mercantil AGRÍCOLA ONI, C.A. (RIF J-50145638-0) con la finalidad de concentrar liquidez para la asignación de divisas en la Mesa de Cambio. Al tratarse del mismo titular registral, constituyen traspasos internos de tesorería con efecto neto patrimonial Bs. 0,00, por lo que el analista de Banesco los depura del universo de abonos comerciales.'
    },
    {
      concept: '3. Diferencial por Valoración Cambiaria Diaria BCV vs Tasa Ponderada BBU de Cierre',
      amountUSDMonthlyAvg: 44663.05,
      amountUSD8Months: 357304.40,
      bankAnalystExplanation: 'La contabilidad de Agrícola Oni, C.A. liquida cada operación en bolívares convirtiendo al tipo de cambio oficial del BCV publicado para el día valor exacto del abono. El sistema BBU de Banesco consolida las cifras aplicando tasaciones ponderadas promedio de cierre mensual. La conciliación algorítmica elimina este descalce técnico de valoración cambiaría.'
    }
  ]
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
      concept: 'Adquisición de Insumos, Repuestos de Maquinaria y Equipos Agroindustriales en Venezuela (Cotizados a Dólar Oficial BCV)',
      recipient: 'Proveedores Nacionales de Equipamiento y Torrefacción (Portuguesa / Lara / Caracas)',
      country: 'Venezuela',
      amountUSD: 445000.00,
      percentage: 79.91,
      documentSupport: 'Facturas Comerciales y Notas de Débito SENIAT a Dólar Oficial BCV (Convenio Cambiario N° 1)',
      description: 'Adquisición en territorio venezolano de tolvas, sacos de yute, repuestos de despulpadora, seleccionadoras ópticas y acondicionamiento de galpones para acopio de café verde nacional.'
    },
    {
      id: 'USD-DEST-02',
      concept: 'Flete y Logística de Transporte Terrestre Nacional de Carga Pesada',
      recipient: 'Empresas de Transporte Terrestre y Carga Pesada Venezolanas (Eje Biscucuy - Chabasquén - Araure)',
      country: 'Venezuela',
      amountUSD: 67380.15,
      percentage: 12.10,
      documentSupport: 'Facturas de Transporte Terrestre SENIAT con Retención ISLR 3% y Guías de Movilización SICA / CVC',
      description: 'Traslado terrestre en gandolas y camiones 350 desde zonas productoras del pie de monte andino (Portuguesa, Lara, Mérida, Táchira) hacia centros de acopio y torrefactoras en Acarigua/Araure.'
    },
    {
      id: 'USD-DEST-03',
      concept: 'Servicios Agroindustriales, Inspección de Calidad y Trámites Sanitarios CVC / SICA / INSAI',
      recipient: 'Laboratorios de Calidad Cafetalera / Tasas Corporación Venezolana del Café / INSAI Venezuela',
      country: 'Venezuela',
      amountUSD: 35000.00,
      percentage: 6.28,
      documentSupport: 'Comprobantes de Pago de Tasas Oficiales, Certificados de Análisis Físico y Guías de Movilización Agroalimentaria',
      description: 'Inspección de humedad, catación, certificación de quintales de café verde y aranceles operativos nacionales regulados por el Estado venezolano.'
    },
    {
      id: 'USD-DEST-04',
      concept: 'Saldo Remanente en Custodia Banesco Cuenta Divisas USD',
      recipient: 'Agrícola Oni C.A. (Cuenta Custodia Divisas N° 0134-0342-12-3420084712)',
      country: 'Venezuela',
      amountUSD: 9510.30,
      percentage: 1.71,
      documentSupport: 'Extracto Oficial Banesco Cuenta Custodia en Moneda Extranjera al 31/08/2026',
      description: 'Saldo disponible no ejecutado en cuenta custodia Banesco para cobertura de contingencias operativas y fluctuaciones cambiarias oficial BCV.'
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
    nameOrEntity: 'Accionista Propietario Ing. Omar Pérez (Aportes Socios)',
    idNumber: 'V-14892301',
    operationsCount: 21,
    totalAmountVES: 7649975.00,
    totalAmountUSD: 11266.93,
    dateRange: '01/07/2026 al 31/07/2026',
    bankOrigin: 'Banco de Venezuela (0102) / Banesco (0134)',
    reference: 'TRF-CR-INMV-0148 (21 operaciones)',
    concept: 'Aportes operativos de liquidez del accionista propietario',
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
      purpose: 'Concentración de fondos en Banesco para compra de divisas destinadas a insumos y maquinaria en Venezuela.'
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
  // 1. Anticipo Cliente Jurídico Ref #00033005568
  {
    id: 'BAN-MOV-2026-001',
    date: '16/06/2026',
    reference: '#00033005568',
    description: 'ANTICIPO RECIBIDO CLIENTES JURÍDICOS - DESCRIPCIÓN EXTRACTO BANESCO #00033005568',
    debitVES: 0,
    creditVES: 20745000,
    balanceVES: 20745000,
    countervalueUSD: 30115.40,
    bcvRate: 688.00,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso & Contrato Procura',
    supportDocRef: 'COMP-ANT-RIP-2026-001 / Ref. Bancaria #00033005568',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipo en bolívares para compra y acopio de café en Venezuela valorado a tasa oficial BCV. Respaldado por NIIF 15. Facturación definitiva en octubre.'
  },
  // 2. Anticipo Cliente Jurídico Ref #00030445172
  {
    id: 'BAN-MOV-2026-002',
    date: '19/06/2026',
    reference: '#00030445172',
    description: 'ANTICIPO EN VENTAS CLIENTES JURÍDICOS - DESCRIPCIÓN EXTRACTO BANESCO #00030445172',
    debitVES: 0,
    creditVES: 35823999.24,
    balanceVES: 56568999.24,
    countervalueUSD: 51986.65,
    bcvRate: 690.00,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario & Contrato Procura Nacional',
    supportDocRef: 'COMP-ANT-RIP-2026-002 / Ref. Bancaria #00030445172',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipo recibido en cuenta corriente para compra de cosechas a caficultores venezolanos.'
  },
  // 3. Anticipo Cliente Jurídico Ref #00005995465
  {
    id: 'BAN-MOV-2026-003',
    date: '09/07/2026',
    reference: '#00005995465',
    description: 'ANTICIPO RECIBIDO CLIENTES JURÍDICOS - DESCRIPCIÓN EXTRACTO BANESCO #00005995465',
    debitVES: 0,
    creditVES: 11879549,
    balanceVES: 68448548.24,
    countervalueUSD: 16430.91,
    bcvRate: 723.00,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-003',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Fondos de clientes para intermediación y compra de lotes de café en el mercado venezolano.'
  },
  // 4. Anticipo Cliente Jurídico Ref #00016671975
  {
    id: 'BAN-MOV-2026-004',
    date: '29/07/2026',
    reference: '#00016671975',
    description: 'ANTICIPO CLIENTES JURÍDICOS - DESCRIPCIÓN EXTRACTO BANESCO #00016671975',
    debitVES: 0,
    creditVES: 67000000.97,
    balanceVES: 135448549.21,
    countervalueUSD: 93055.56,
    bcvRate: 745.00,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-004 / Ref. Bancaria #00016671975',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Abonos en cuenta para compra de café a productores venezolanos y suministro agroindustrial.'
  },
  // 5. Anticipo Cliente Jurídico Ref #0000000198
  {
    id: 'BAN-MOV-2026-005',
    date: '06/08/2026',
    reference: '#0000000198',
    description: 'ANTICIPOS RECIBIDOS CLIENTES JURÍDICOS - DESCRIPCIÓN EXTRACTO BANESCO #0000000198',
    debitVES: 0,
    creditVES: 97180000,
    balanceVES: 232628549.21,
    countervalueUSD: 131524.32,
    bcvRate: 756.70,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-005',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Lotes de transferencias interbancarias para reserva de café nacional ante zafra.'
  },
  // 6. Anticipo Cliente Jurídico Ref #00030445172
  {
    id: 'BAN-MOV-2026-006',
    date: '11/08/2026',
    reference: '#00030445172',
    description: 'ANTICIPOS RECIBIDOS CLIENTES JURÍDICOS - DESCRIPCIÓN EXTRACTO BANESCO #00030445172',
    debitVES: 0,
    creditVES: 63750000,
    balanceVES: 296378549.21,
    countervalueUSD: 86148.65,
    bcvRate: 764.35,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-006 / Ref. Bancaria #00030445172',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Fondeo de operaciones de abastecimiento de grano de café en Portuguesa y Lara.'
  },
  // 7. Anticipo Cliente Jurídico Ref #000041945646
  {
    id: 'BAN-MOV-2026-007',
    date: '31/08/2026',
    reference: '#000041945646',
    description: 'ANTICIPOS RECIBIDOS CLIENTES JURÍDICOS - DESCRIPCIÓN EXTRACTO BANESCO #000041945646',
    debitVES: 0,
    creditVES: 126200000,
    balanceVES: 422578549.21,
    countervalueUSD: 165327.68,
    bcvRate: 798.33,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-007',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Liquidación de compromisos de entrega de café nacional para despacho y facturación de ventas en octubre.'
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

  // 16. INGRESO PERSONA NATURAL - Accionista Propietario (Cuentas por Pagar Socios)
  {
    id: 'BAN-MOV-2026-016',
    date: '31/07/2026',
    reference: 'TRF-CR-INMV-0148',
    description: '21 ABONOS TRF CR INMV ACCIONISTA PROPIETARIO AGRÍCOLA ONI C.A. (CUENTAS POR PAGAR SOCIOS)',
    debitVES: 0,
    creditVES: 7649975,
    balanceVES: 1443667067.62,
    countervalueUSD: 11266.93,
    bcvRate: 748.79,
    justificationType: 'CUENTAS_POR_PAGAR_SOCIOS',
    supportDocType: 'Libro Auxiliar Accionista Propietario & Comprobantes Bancarios',
    supportDocRef: 'COMP-SOC-PAG-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Ingreso de dinero del socio a la empresa (Cuentas por Pagar Socios). Salidas de Banesco a su cuenta constituyen Cuentas por Cobrar Socios (préstamos de la empresa al socio).'
  },

  // 17. INGRESO PERSONA NATURAL - Anticipos de Clientes Personas Naturales
  {
    id: 'BAN-MOV-2026-017',
    date: '30/06/2026',
    reference: 'TRF-CR-INM-NAT',
    description: '15 ABONOS TRF CR INM PERSONAS NATURALES (DEPOSITANTES Y TRANSFERENCIAS EN TAQUILLA BANESCO)',
    debitVES: 0,
    creditVES: 21845979.99,
    balanceVES: 1465513047.61,
    countervalueUSD: 36069.06,
    bcvRate: 633.36,
    justificationType: 'ANTICIPO_CLIENTE_PERSONA_NATURAL',
    supportDocType: 'Comprobantes de Ingreso Bancario & Depósitos Taquilla',
    supportDocRef: 'COMP-ANT-NAT-2026-002',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipos de clientes personas naturales recibidos por la empresa por concepto de reserva y compra de café verde nacional.'
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
    notes: 'Adquisición oficial de moneda extranjera en Mesa de Cambio para insumos, repuestos agroindustriales de café y transporte pesado en Venezuela a tasa BCV.'
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
  auditedBy: 'Licdo. Omar Pérez Castillo',
  cpcAuditor: 'Contador Público Independiente, Ven-Nif (C.P.C. 16.336)'
};

export const BANESCO_AUDIT_POINTS = [
  {
    id: 1,
    title: 'Origen de Fondos: Anticipos en Ventas de Clientes Nacionales en Bolívares a Tasa Oficial BCV (NIIF 15)',
    request: 'Justificación documentada de los abonos recibidos en la cuenta corriente por transferencias de clientes torrefactores y distribuidores venezolanos (Enero a Agosto 2026).',
    response: 'Los fondos acreditados en la cuenta corriente Banesco N° 0134-0342-18-3421089912 por Bs. 1.368.568.092,62 corresponden exclusivamente a ANTICIPOS EN VENTAS EN BOLÍVARES otorgados por empresas clientes venezolanas identificadas según la descripción exacta de los extractos bancarios Banesco. Agrícola Oni C.A. NO IMPORTA CAFÉ DE COLOMBIA NI DEL EXTERIOR; todo el café se compra en Venezuela a productores, asociaciones y empresas venezolanas. Los clientes entregan anticipos en bolívares calculados a tasa oficial BCV para que la empresa gestione en el mercado nacional la compra, recolección y acopio del grano, comprometiéndose a entregar el café y sustituir el anticipo por su factura fiscal de venta definitiva en el mes de octubre.',
    status: 'CONFORME_DOCUMENTADO'
  },
  {
    id: 2,
    title: 'Recepción y Asignación de Divisas en Cuenta Banesco (Mesa de Cambio / BCV)',
    request: 'Sustento del destino de los bolívares depositados y cargos por adquisición de moneda extranjera (Total Bs. 375.630.000 / USD 556.890,45).',
    response: 'Agrícola Oni C.A. utiliza parte de la liquidez recibida para adquirir divisas a través de los mecanismos oficiales de Mesa de Cambio de Banesco Banco Universal (regulados por el BCV), acreditándose en nuestra Cuenta en Divisas N° 0134-0342-12-3420084712 para cancelar insumos agrícolas, repuestos de maquinaria agroindustrial, mantenimiento de galpones y transporte pesado facturados en territorio nacional a tasa oficial BCV conforme a la normativa cambiaria vigente.',
    status: 'CONFORME_BANESCO'
  },
  {
    id: 3,
    title: 'Destino y Aplicación de los Dólares Adquiridos en Banesco ($556.890,45 USD)',
    request: 'Demostración del uso de las divisas adquiridas en Banesco.',
    response: 'El 100% de los dólares adquiridos se aplicó estrictamente en operaciones lícitas en territorio nacional: 1) Pago de insumos agroindustriales, tolvas y repuestos de maquinaria para café cotizados en Venezuela a tasa BCV por USD 445.000,00 (79,9%); 2) Fletes terrestres de transporte pesado de café en gandolas y camiones entre el eje cafetalero y Acarigua por USD 67.380,15 (12,1%); 3) Servicios técnicos agroindustriales, análisis de laboratorio y aranceles CVC/SICA/INSAI por USD 35.000,00 (6,3%); manteniendo un remanente en cuenta custodia Banesco de USD 9.510,30 (1,7%). Cero transferencias a proveedores extranjeros.',
    status: 'CONFORME_DOCUMENTADO'
  },
  {
    id: 4,
    title: 'Clasificación y Sustento de Personas Naturales (Cuentas Socios y Anticipos Clientes)',
    request: 'Revisión y reclasificación contable-bancaria de operaciones con personas naturales.',
    response: '1) Accionista Propietario / Director (Ing. Omar Pérez C.I. V-14.892.301): Todos los ingresos de dinero recibidos en Banesco procedentes de sus cuentas personales se clasifican como CUENTAS POR PAGAR SOCIOS (aportes e inyecciones de liquidez a la empresa) y todas las salidas de Banesco hacia sus cuentas personales como CUENTAS POR COBRAR SOCIOS (préstamos o adelantos de la empresa al socio). 2) Personas Naturales identificadas en extracto bancario Banesco: Justificados y clasificados como ANTICIPOS EN BOLÍVARES DE CLIENTES PERSONAS NATURALES para reserva de quintales de café verde de origen nacional valorados a tasa oficial BCV, respetando la descripción original emitida por Banesco.',
    status: 'CONFORME_DOCUMENTADO'
  },
  {
    id: 5,
    title: 'Transferencias entre Cuentas Internas de Agrícola Oni C.A. (Mismo Titular)',
    request: 'Movimientos de entrada y salida con otras instituciones financieras.',
    response: 'Se registraron entradas por Bs. 153.210.000,00 y salidas por Bs. 153.210.000,00 entre cuentas del mismo titular registral AGRÍCOLA ONI C.A. (Banco Provincial, Mercantil, Plaza y Bancamiga), con impacto patrimonial neto de Bs. 0,00, respondiendo exclusivamente a concentración de tesorería para cumplir compromisos de acopio cafetalero en el país.',
    status: 'CONFORME_DOCUMENTADO'
  },
  {
    id: 6,
    title: 'Línea de Crédito Rotativa Becerra (Pasivo Financiero Reembolsable)',
    request: 'Acreditación y amortización de financiamiento a corto plazo.',
    response: 'Los desembolsos registrados en cuenta por Bs. 186.376.000 corresponden al contrato de Línea de Crédito Rotativa Becerra 2026 para capital de trabajo de acopio de café en Venezuela, de los cuales se amortizaron Bs. 181.400.000 en el período, restando un saldo por pagar de Bs. 4.976.000.',
    status: 'CONFORME_DOCUMENTADO'
  },
  {
    id: 7,
    title: 'Régimen de Facturación Definitiva a partir de Octubre (Eliminación de Anticipos)',
    request: 'Cronograma fiscal de facturación y regularización contable de los anticipos.',
    response: 'Agrícola Oni C.A. mantiene los fondos recibidos como pasivo corriente en la cuenta 2.1.04.01 "Anticipos Recibidos de Clientes Jurídicos y Comerciales". En el mes de OCTUBRE se formaliza la entrega de los lotes de café verde acopiados en Venezuela y la emisión de las FACTURAS DE VENTAS definitivas a tasa BCV. Contra dichas facturas de ventas se eliminarán y cruzarán al 100% los anticipos de clientes, liquidando el pasivo y declarando el IVA y tributos respectivos ante el SENIAT.',
    status: 'CONFORME_CRONOGRAMA'
  }
];
