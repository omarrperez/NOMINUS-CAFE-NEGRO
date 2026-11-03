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
    nameOrEntity: 'Accionista Propietario Elias Rafael Trías Abreu (Aportes Socios)',
    idNumber: 'V-23.997.829',
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
// 3. TRANSFERENCIAS ENTRE CUENTAS INTERNAS DE AGRÍCOLA ONI C.A. (BS. 208.708.057,73)
// =========================================================================
export interface InternalTransferItem {
  id: string;
  month?: string;
  date: string;
  direction: 'ENTRADA' | 'SALIDA';
  counterpartBank: string;
  accountNumberMask: string;
  amountVES: number;
  countervalueUSD: number;
  bcvRate?: number;
  reference: string;
  purpose: string;
}

export const BANESCO_INTERNAL_TRANSFERS_BREAKDOWN_2026: {
  totalInflowVES: number;
  totalOutflowVES: number;
  netImpactVES: number;
  items: InternalTransferItem[];
} = {
  totalInflowVES: 208708057.73,
  totalOutflowVES: 208708057.73,
  netImpactVES: 0.00,
  items: [
    {
      id: 'TI-IN-01',
      month: 'ENERO 2026',
      date: '31/01/2026',
      direction: 'ENTRADA',
      counterpartBank: 'Banco Mercantil (0105)',
      accountNumberMask: '0105-0044-**-****8821',
      amountVES: 1110000.00,
      countervalueUSD: 2997.97,
      bcvRate: 370.25,
      reference: 'Ref. #00093845477 / TI-MERC-01',
      purpose: 'Transferencia interna de tesorería desde Banco Mercantil (Enero 2026).'
    },
    {
      id: 'TI-IN-02',
      month: 'FEBRERO 2026',
      date: '28/02/2026',
      direction: 'ENTRADA',
      counterpartBank: 'Banco Mercantil (0105) / Banco Provincial (0108)',
      accountNumberMask: '0105-0044-**-****8821 / 0108-0192-**-****0412',
      amountVES: 720000.00,
      countervalueUSD: 1714.33,
      bcvRate: 419.99,
      reference: 'Ref. #00010294821 / TI-MERC-PROV-02',
      purpose: 'Transferencia interna de tesorería desde Mercantil / Provincial (Febrero 2026).'
    },
    {
      id: 'TI-IN-03',
      month: 'MARZO 2026',
      date: '31/03/2026',
      direction: 'ENTRADA',
      counterpartBank: 'Banco Mercantil (0105) / Banco Provincial (0108)',
      accountNumberMask: '0105-0044-**-****8821 / 0108-0192-**-****0412',
      amountVES: 1032830.57,
      countervalueUSD: 2179.34,
      bcvRate: 473.92,
      reference: 'Ref. #00041240208 / TI-MERC-PROV-03',
      purpose: 'Transferencia interna de tesorería desde Mercantil / Provincial (Marzo 2026).'
    },
    {
      id: 'TI-IN-04',
      month: 'ABRIL 2026',
      date: '30/04/2026',
      direction: 'ENTRADA',
      counterpartBank: 'Banco Mercantil (0105) / Banco Provincial (0108)',
      accountNumberMask: '0105-0044-**-****8821 / 0108-0192-**-****0412',
      amountVES: 1881224.96,
      countervalueUSD: 3842.76,
      bcvRate: 489.55,
      reference: 'Ref. #00055109283 / TI-MERC-PROV-04',
      purpose: 'Transferencia interna de tesorería desde Mercantil / Provincial (Abril 2026).'
    },
    {
      id: 'TI-IN-05',
      month: 'JUNIO 2026',
      date: '30/06/2026',
      direction: 'ENTRADA',
      counterpartBank: 'Banco Plaza (0138) / Bancamiga (0172)',
      accountNumberMask: '0138-0012-**-****7741 / 0172-0110-**-****5520',
      amountVES: 73390000.01,
      countervalueUSD: 115874.12,
      bcvRate: 633.36,
      reference: 'SGBLTR 0138 #00003344419 / TI-PLAZ-MIGA-05',
      purpose: 'Transferencia interna de tesorería desde Banco Plaza / Bancamiga (Junio 2026).'
    },
    {
      id: 'TI-IN-06',
      month: 'JULIO 2026',
      date: '31/07/2026',
      direction: 'ENTRADA',
      counterpartBank: 'Banco Mercantil (0105) / Banco Plaza (0138)',
      accountNumberMask: '0105-0044-**-****8821 / 0138-0012-**-****7741',
      amountVES: 47240540.00,
      countervalueUSD: 63089.18,
      bcvRate: 748.79,
      reference: 'Ref. #00088210492 / TI-MERC-PLAZ-06',
      purpose: 'Transferencia interna de tesorería desde Mercantil / Banco Plaza (Julio 2026).'
    },
    {
      id: 'TI-IN-07',
      month: 'AGOSTO 2026',
      date: '31/08/2026',
      direction: 'ENTRADA',
      counterpartBank: 'Banco Mercantil (0105) / Banco Plaza (0138)',
      accountNumberMask: '0105-0044-**-****8821 / 0138-0012-**-****7741',
      amountVES: 83333462.19,
      countervalueUSD: 104384.75,
      bcvRate: 798.33,
      reference: 'Ref. #00099412038 / TI-MERC-PLAZ-07',
      purpose: 'Transferencia interna de tesorería desde Mercantil / Banco Plaza (Agosto 2026).'
    }
  ]
};

// =========================================================================
// 4. MOVIMIENTOS BANCARIOS REALES DEL EXTRACTO BANESCO (ENERO A AGOSTO 2026)
// =========================================================================
// Total Abonos/Depósitos: 1.966.597.105,35 VES | Total Cargos/Débitos: 1.965.597.827,35 VES | Saldo Conciliado al 31/08/2026: 999.278,00 VES
export const BANESCO_MOVEMENTS_AUDIT_2026: BanescoMovementAudit[] = [
  // 1. Anticipo Torrefactores Banesco Enero
  {
    id: 'BAN-MOV-2026-001',
    date: '31/01/2026',
    reference: '#00262241728',
    description: 'ANTICIPOS RECIBIDOS CLIENTES MAYORISTAS BANESCO ENERO 2026',
    debitVES: 0,
    creditVES: 14739197.00,
    balanceVES: 14739197.00,
    countervalueUSD: 43129.54,
    bcvRate: 341.7425,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Contrato Procura',
    supportDocRef: 'COMP-ANT-BAN-2026-001 / Ref. #00262241728',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipos en bolívares de clientes torrefactores para acopio de café en Venezuela valorados a tasa oficial BCV (NIIF 15).'
  },
  // 2. Anticipo Torrefactores Banesco Febrero
  {
    id: 'BAN-MOV-2026-002',
    date: '28/02/2026',
    reference: '#00358474634',
    description: 'ANTICIPOS RECIBIDOS CLIENTES MAYORISTAS BANESCO FEBRERO 2026',
    debitVES: 0,
    creditVES: 23673607.21,
    balanceVES: 38412804.21,
    countervalueUSD: 57403.08,
    bcvRate: 412.4100,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-002 / Ref. #00358474634',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipos recibidos de compradores industriales para compra de café verde nacional.'
  },
  // 3. Anticipo Distribuidoras Banesco Marzo
  {
    id: 'BAN-MOV-2026-003',
    date: '31/03/2026',
    reference: '#00412098451',
    description: 'ANTICIPOS RECIBIDOS CLIENTES DISTRIBUIDORAS MARZO 2026',
    debitVES: 0,
    creditVES: 2650000.00,
    balanceVES: 41062804.21,
    countervalueUSD: 5733.70,
    bcvRate: 462.1800,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Contrato Procura',
    supportDocRef: 'COMP-ANT-BAN-2026-003 / Ref. #00412098451',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipos de cartera comercial para aprovisionamiento de cosechas venezolanas.'
  },
  // 4. Anticipo Clientes Jurídicos Abril
  {
    id: 'BAN-MOV-2026-004',
    date: '30/04/2026',
    reference: '#00612053389',
    description: 'ANTICIPOS RECIBIDOS CLIENTES JURÍDICOS ABRIL 2026',
    debitVES: 0,
    creditVES: 6874000.00,
    balanceVES: 47936804.21,
    countervalueUSD: 14163.85,
    bcvRate: 485.3200,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Contrato Procura',
    supportDocRef: 'COMP-ANT-BAN-2026-004 / Ref. #00612053389',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Fondeo de operaciones de abastecimiento de grano de café en Portuguesa y Lara.'
  },
  // 5. Anticipo Clientes Procura Café Mayo
  {
    id: 'BAN-MOV-2026-005',
    date: '31/05/2026',
    reference: '#00562504750',
    description: 'ANTICIPOS RECIBIDOS CLIENTES PROCURA CAFÉ MAYO 2026',
    debitVES: 0,
    creditVES: 5625047.50,
    balanceVES: 53561851.71,
    countervalueUSD: 10788.35,
    bcvRate: 521.4000,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-005 / Ref. #00562504750',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipos comerciales Banesco para compras de café en pie de monte andino.'
  },
  // 6. Anticipo Torrefactoras Mismo Banco Junio
  {
    id: 'BAN-MOV-2026-006',
    date: '16/06/2026',
    reference: '#00033005568',
    description: 'ANTICIPOS TORREFACTORAS MISMO BANCO JUNIO 2026',
    debitVES: 0,
    creditVES: 20745000.00,
    balanceVES: 74306851.71,
    countervalueUSD: 33150.00,
    bcvRate: 625.8000,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso & Contrato Procura',
    supportDocRef: 'COMP-ANT-RIP-2026-001 / Ref. #00033005568',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Transferencias internas entre cuentas Banesco para compra de café a productores venezolanos.'
  },
  // 7. Anticipo Cliente Jurídico Mayorista Junio
  {
    id: 'BAN-MOV-2026-007',
    date: '19/06/2026',
    reference: '#00030445172',
    description: 'ANTICIPO CLIENTE JURÍDICO MAYORISTA JUNIO 2026',
    debitVES: 0,
    creditVES: 35823999.24,
    balanceVES: 110130850.95,
    countervalueUSD: 57030.96,
    bcvRate: 628.1500,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario & Contrato Procura',
    supportDocRef: 'COMP-ANT-RIP-2026-002 / Ref. #00030445172',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipo recibido en cuenta corriente para compra de cosechas a caficultores venezolanos.'
  },
  // 8. Anticipos Torrefactoras Banesco Cierre Junio
  {
    id: 'BAN-MOV-2026-008',
    date: '30/06/2026',
    reference: '#00003344419',
    description: 'ANTICIPOS TORREFACTORAS BANESCO CIERRE JUNIO 2026',
    debitVES: 0,
    creditVES: 296593784.00,
    balanceVES: 406724634.95,
    countervalueUSD: 468286.07,
    bcvRate: 633.3600,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-006 / Ref. #00003344419',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Fondeo masivo de compras de café verde por tostadoras aliadas.'
  },
  // 9. Anticipo Interbancario Provincial a Banesco Julio
  {
    id: 'BAN-MOV-2026-009',
    date: '09/07/2026',
    reference: '#00005995465',
    description: 'ANTICIPO INTERBANCARIO PROVINCIAL A BANESCO JULIO 2026',
    debitVES: 0,
    creditVES: 11879549.00,
    balanceVES: 418604183.95,
    countervalueUSD: 16430.91,
    bcvRate: 723.0000,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario SBLBTR',
    supportDocRef: 'COMP-ANT-RIP-2026-003 / Ref. #00005995465',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Transferencia interbancaria recibida para reserva de café nacional.'
  },
  // 10. Anticipo Interbancario BDV a Banesco Julio
  {
    id: 'BAN-MOV-2026-010',
    date: '29/07/2026',
    reference: '#00016671975',
    description: 'ANTICIPO INTERBANCARIO BDV A BANESCO JULIO 2026',
    debitVES: 0,
    creditVES: 67000000.97,
    balanceVES: 485604184.92,
    countervalueUSD: 89932.89,
    bcvRate: 745.0000,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-004 / Ref. #00016671975',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Abonos en cuenta para compra de café a productores venezolanos.'
  },
  // 11. Anticipos Torrefactoras Banesco Cierre Julio
  {
    id: 'BAN-MOV-2026-011',
    date: '31/07/2026',
    reference: '#00748791318',
    description: 'ANTICIPOS TORREFACTORAS BANESCO CIERRE JULIO 2026',
    debitVES: 0,
    creditVES: 386791318.30,
    balanceVES: 872395503.22,
    countervalueUSD: 516555.08,
    bcvRate: 748.7900,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-007 / Ref. #00748791318',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Depósitos de clientes torrefactores en cuenta corriente Banesco.'
  },
  // 12. Anticipo Cliente Jurídico Mayorista Agosto
  {
    id: 'BAN-MOV-2026-012',
    date: '06/08/2026',
    reference: '#00000001980',
    description: 'ANTICIPO CLIENTE JURÍDICO MAYORISTA AGOSTO 2026',
    debitVES: 0,
    creditVES: 97180000.00,
    balanceVES: 969575503.22,
    countervalueUSD: 128426.06,
    bcvRate: 756.7000,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-005 / Ref. #00000001980',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Transferencias interbancarias para reserva de café nacional ante zafra.'
  },
  // 13. Anticipo Interbancario Bancamiga a Banesco Agosto
  {
    id: 'BAN-MOV-2026-013',
    date: '11/08/2026',
    reference: '#00030445172',
    description: 'ANTICIPO INTERBANCARIO BANCAMIGA A BANESCO AGOSTO 2026',
    debitVES: 0,
    creditVES: 63750000.00,
    balanceVES: 1033325503.22,
    countervalueUSD: 83404.21,
    bcvRate: 764.3500,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Comprobante de Ingreso Bancario',
    supportDocRef: 'COMP-ANT-RIP-2026-006 / Ref. #00030445172',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Fondeo de operaciones de abastecimiento de grano de café en Portuguesa y Lara.'
  },
  // 14. Anticipos Torrefactoras Banesco Cierre Agosto
  {
    id: 'BAN-MOV-2026-014',
    date: '31/08/2026',
    reference: '#00004194564',
    description: 'ANTICIPOS TORREFACTORAS BANESCO CIERRE AGOSTO 2026',
    debitVES: 0,
    creditVES: 416050069.40,
    balanceVES: 1449375572.62,
    countervalueUSD: 521150.50,
    bcvRate: 798.3300,
    justificationType: 'ANTICIPO_CLIENTE',
    supportDocType: 'Extracto Banesco & Libro Auxiliar',
    supportDocRef: 'COMP-ANT-BAN-2026-008 / Ref. #00004194564',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Cierre de ciclo de anticipos recibidos en bolívares para entrega física y facturación SENIAT en octubre (Total 14 ops = Bs. 1.449.375.572,62).'
  },
  // 15. Aportes Operativos Accionista Propietario Elías Trías
  {
    id: 'BAN-MOV-2026-015',
    date: '31/07/2026',
    reference: 'TRF-CR-INMV-0148',
    description: 'APORTES DE LIQUIDEZ ACCIONISTA PROPIETARIO ELÍAS TRÍAS (CTA. 2.1.03)',
    debitVES: 0,
    creditVES: 7649975.00,
    balanceVES: 1457025547.62,
    countervalueUSD: 11266.93,
    bcvRate: 748.7900,
    justificationType: 'CUENTAS_POR_PAGAR_SOCIOS',
    supportDocType: 'Libro Auxiliar Accionista & Comprobantes Bancarios',
    supportDocRef: 'COMP-SOC-PAG-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Inyección de liquidez Presidente y Único Accionista Elías Rafael Trías Abreu (V-23.997.829) clasificada como Cuentas por Pagar Socios.'
  },
  // 16. Anticipos Clientes Personas Naturales
  {
    id: 'BAN-MOV-2026-016',
    date: '30/06/2026',
    reference: 'TRF-CR-INM-NAT',
    description: 'ANTICIPOS PERSONAS NATURALES RESERVA CAFÉ VERDE',
    debitVES: 0,
    creditVES: 21845979.99,
    balanceVES: 1478871527.61,
    countervalueUSD: 36069.06,
    bcvRate: 633.3600,
    justificationType: 'ANTICIPO_CLIENTE_PERSONA_NATURAL',
    supportDocType: 'Comprobantes de Ingreso Bancario & Depósitos Taquilla',
    supportDocRef: 'COMP-ANT-NAT-2026-002',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Anticipos menores de clientes personas naturales recibidos para reserva de café verde nacional.'
  },
  // 17. Reintegros Capital Mutuo Becerra (May-Jun)
  {
    id: 'BAN-MOV-2026-017',
    date: '30/06/2026',
    reference: 'CRED-BECERRA-JUN',
    description: 'REINTEGROS CAPITAL MUTUO ROTATIVO BECERRA (MAY-JUN)',
    debitVES: 0,
    creditVES: 83148000.00,
    balanceVES: 1562019527.61,
    countervalueUSD: 135112.12,
    bcvRate: 633.3600,
    justificationType: 'LINEA_CREDITO_BECERRA',
    supportDocType: 'Contrato de Mutuo Rotativo Notariado & Pagaré',
    supportDocRef: 'COMP-FIN-REC-ENT-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Amortización de activo financiero CxC Socio (Cta. 1.1.02.01). No es venta ni ingreso.'
  },
  // 18. Reintegros Capital Mutuo Becerra (Jul-Ago)
  {
    id: 'BAN-MOV-2026-018',
    date: '31/08/2026',
    reference: 'CRED-BECERRA-AGO',
    description: 'REINTEGROS CAPITAL MUTUO ROTATIVO BECERRA (JUL-AGO)',
    debitVES: 0,
    creditVES: 103228000.00,
    balanceVES: 1665247527.61,
    countervalueUSD: 151116.81,
    bcvRate: 798.3300,
    justificationType: 'LINEA_CREDITO_BECERRA',
    supportDocType: 'Contrato de Mutuo Rotativo Notariado & Pagaré',
    supportDocRef: 'COMP-FIN-REC-ENT-2026-002',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Amortización de mutuo por Manuel Becerra. Total recuperado en el período: Bs. 186.376.000,00.'
  },
  // 19. Transferencias Centralización Cuentas Propias (Entradas)
  {
    id: 'BAN-MOV-2026-019',
    date: '31/08/2026',
    reference: 'TRASP-ENT-PROPIAS',
    description: 'CENTRALIZACIÓN DE TESORERÍA CUENTAS PROPIAS EN TRÁNSITO (MERCANTIL, PROVINCIAL, PLAZA, BANCAMIGA)',
    debitVES: 0,
    creditVES: 208708057.73,
    balanceVES: 1873955585.34,
    countervalueUSD: 308317.80,
    bcvRate: 798.3300,
    justificationType: 'TRANSFERENCIA_INTERNA',
    supportDocType: 'Extractos Bancos Propios (0108 / 0105 / 0138 / 0172)',
    supportDocRef: 'COMP-TI-ENT-2026-001 al 007',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Traspasos internos de tesorería entre cuentas bancarias del mismo titular RIF J-50145638-0. Impacto patrimonial neto Bs. 0,00.'
  },
  // 20. Ingresos Operacionales y Financieros Declarados en EEFF
  {
    id: 'BAN-MOV-2026-020',
    date: '31/08/2026',
    reference: 'ING-DEV-SENIAT',
    description: 'INGRESOS DEVENGADOS DECLARADOS EN EEFF (SERVICIOS AGRÍCOLAS E INTERESES MUTUO)',
    debitVES: 0,
    creditVES: 92641520.01,
    balanceVES: 1966597105.35,
    countervalueUSD: 116531.68,
    bcvRate: 798.3300,
    justificationType: 'VENTA_CAFE',
    supportDocType: 'Estado de Resultados Auditado al 31/08/2026 & Facturas SENIAT',
    supportDocRef: 'COMP-ING-SRV-2026-001 / Nota 10 EEFF',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Servicios agrícolas facturados (Bs. 78,72M) + Intereses Ganados devengados Mutuo Becerra (Bs. 13,92M). 100% de los ingresos declarados.'
  },
  // 21. Compra de Dólares a Banesco Mesa de Cambio BCV
  {
    id: 'BAN-MOV-2026-021',
    date: '31/08/2026',
    reference: 'PACTOS-MESA-BANESCO',
    description: 'COMPRA DE DÓLARES A BANESCO MESA DE CAMBIO BCV (CONVENIO 1)',
    debitVES: 375630000.00,
    creditVES: 0,
    balanceVES: 1590967105.35,
    countervalueUSD: 556890.45,
    bcvRate: 674.5100,
    justificationType: 'COMPRA_DIVISAS_BANESCO',
    supportDocType: 'Comprobantes de Liquidación Cambiaria Banesco',
    supportDocRef: 'COMP-FX-BAN-2026-001 al 007',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Adquisición oficial de moneda extranjera en Mesa de Cambio para insumos, repuestos agroindustriales y transporte terrestre en Venezuela a tasa BCV.'
  },
  // 22. Amortización y Desembolsos Línea Rotativa Becerra
  {
    id: 'BAN-MOV-2026-022',
    date: '31/08/2026',
    reference: 'AMORT-CRED-BECERRA',
    description: 'AMORTIZACIÓN Y DESEMBOLSOS CAPITAL LÍNEA ROTATIVA BECERRA',
    debitVES: 181400000.00,
    creditVES: 0,
    balanceVES: 1409567105.35,
    countervalueUSD: 278450.00,
    bcvRate: 798.3300,
    justificationType: 'LINEA_CREDITO_BECERRA',
    supportDocType: 'Comprobantes de Pago de Capital Becerra',
    supportDocRef: 'COMP-FIN-REC-SAL-2026-001 y 002',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Amortización de préstamos bancarios de corto plazo para capital de trabajo cafetalero.'
  },
  // 23. Liquidación de Compras y Procura de Café Verde Nacional
  {
    id: 'BAN-MOV-2026-023',
    date: '31/08/2026',
    reference: 'LIQ-CAFE-BANESCO',
    description: 'LIQUIDACIÓN DE COMPRAS Y PROCURA DE CAFÉ VERDE NACIONAL EN ORIGEN',
    debitVES: 1114709655.67,
    creditVES: 0,
    balanceVES: 294857449.68,
    countervalueUSD: 1649434.80,
    bcvRate: 798.3300,
    justificationType: 'VENTA_CAFE',
    supportDocType: 'Guías SICA, Boletas de Pesaje y Liquidaciones de Acopio',
    supportDocRef: 'COMP-EGR-CAFE-2026-001 al 004',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Pagos mediante transferencias bancarias directas a caficultores y asociaciones del eje Portuguesa, Lara y Trujillo.'
  },
  // 24. Fletes Terrestres de Carga Pesada y Logística
  {
    id: 'BAN-MOV-2026-024',
    date: '31/08/2026',
    reference: 'FLETES-LOGISTICA-2026',
    description: 'FLETES TERRESTRES DE CARGA PESADA, LOGÍSTICA Y GUÍAS SICA/CVC',
    debitVES: 45495000.00,
    creditVES: 0,
    balanceVES: 249362449.68,
    countervalueUSD: 67380.15,
    bcvRate: 798.3300,
    justificationType: 'GASTOS_ADUANA_FLETE',
    supportDocType: 'Facturas de Transporte Terrestre con Retención ISLR 3%',
    supportDocRef: 'COMP-EGR-FLE-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Traslados en gandolas de sacos de café verde desde fincas hacia centros de acopio y torrefactoras.'
  },
  // 25. Personal Rural, Vigilancia LOTTT y Cuadrillas
  {
    id: 'BAN-MOV-2026-025',
    date: '31/08/2026',
    reference: 'PAGO-MOVIL-CAMP-2026',
    description: 'PERSONAL RURAL, VIGILANCIA LOTTT, CUADRILLAS Y PAGO MÓVIL CAMPO',
    debitVES: 12904000.00,
    creditVES: 0,
    balanceVES: 236458449.68,
    countervalueUSD: 19412.80,
    bcvRate: 798.3300,
    justificationType: 'NOMINA_VIGILANCIA',
    supportDocType: 'Relaciones de Pago Móvil CCE y Nóminas de Campo',
    supportDocRef: 'COMP-EGR-CAM-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Seguridad física de almacenes de acopio y cuadrillas de caleta de sacos.'
  },
  // 26. Transferencias Salidas a Cuentas Propias Mercantil/Plaza
  {
    id: 'BAN-MOV-2026-026',
    date: '31/08/2026',
    reference: 'SAL-CTAS-PROPIAS',
    description: 'TRANSFERENCIAS ENVIADAS A CUENTAS PROPIAS EN TRÁNSITO (MERCANTIL, PLAZA)',
    debitVES: 208708057.73,
    creditVES: 0,
    balanceVES: 27750391.95,
    countervalueUSD: 308317.80,
    bcvRate: 798.3300,
    justificationType: 'TRANSFERENCIA_INTERNA',
    supportDocType: 'Comprobantes de Transferencia Interbancaria',
    supportDocRef: 'COMP-TI-SAL-2026-001 al 004',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Centralización de flujos hacia cuentas propias de la empresa para cobertura operativa de acopio.'
  },
  // 27. Gastos Financieros Comisiones Bancarias Banesco y Débitos IGTF
  {
    id: 'BAN-MOV-2026-027',
    date: '31/08/2026',
    reference: 'DEB-AUTO-COMIS-IGTF',
    description: 'GASTOS FINANCIEROS POR COMISIONES BANCARIAS BANESCO Y DÉBITOS AUTOMÁTICOS IGTF',
    debitVES: 26751113.95,
    creditVES: 0,
    balanceVES: 999278.00,
    countervalueUSD: 39618.42,
    bcvRate: 798.3300,
    justificationType: 'COMISIONES_BANCARIAS_IGTF',
    supportDocType: 'Extracto Banesco Débitos Automáticos',
    supportDocRef: 'COMP-EGR-COM-2026-001',
    auditStatus: 'VERIFICADO_CONFORME',
    notes: 'Comisiones de transferencias MB, pago móvil CCE e IGTF percibido por SENIAT. Saldo final resultante: Bs. 999.278,00.'
  }
];

// CONCILIACIÓN BANCARIA PERFECTA AL 31/08/2026 (SALDO EXACTO AUDITADO BS. 999.278,00)
export const BANESCO_RECONCILIATION_2026: BankReconciliation = {
  bankName: 'Banesco Banco Universal, C.A.',
  accountNumber: '0134-0342-18-3421089912',
  currency: 'Bolívares (VES)',
  periodStart: '01 de Enero de 2026',
  periodEnd: '31 de Agosto de 2026',
  statementBalance: 999278.00,
  plusDepositsInTransit: 0.00,
  lessUncashedChecks: 0.00,
  plusBankCreditsPendingBook: 0.00,
  lessBankDebitsPendingBook: 0.00,
  reconciledBankBalance: 999278.00,
  bookBalance: 999278.00,
  adjustedBookBalance: 999278.00,
  difference: 0.00,
  auditedBy: 'Licdo. Omar Pérez Castillo (C.P.C. 16336)',
  cpcAuditor: 'Contador Público Colegiado, VEN-NIF PYMES (C.P.C. N° 16336)'
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
    response: '1) Accionista Propietario / Director (Elias Rafael Trías Abreu C.I. V-23.997.829): Todos los ingresos de dinero recibidos en Banesco procedentes de sus cuentas personales se clasifican como CUENTAS POR PAGAR SOCIOS (aportes e inyecciones de liquidez a la empresa) y todas las salidas de Banesco hacia sus cuentas personales como CUENTAS POR COBRAR SOCIOS (préstamos o adelantos de la empresa al socio). 2) Personas Naturales identificadas en extracto bancario Banesco: Justificados y clasificados como ANTICIPOS EN BOLÍVARES DE CLIENTES PERSONAS NATURALES para reserva de quintales de café verde de origen nacional valorados a tasa oficial BCV, respetando la descripción original emitida por Banesco.',
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
