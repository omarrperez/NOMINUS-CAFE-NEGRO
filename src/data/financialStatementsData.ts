// ESTADOS FINANCIEROS OFICIALES DE AGRÍCOLA ONI, C.A. (RIF J-50145638-0)
// AL 31 DE DICIEMBRE DE 2025 Y AL 31 DE AGOSTO DE 2026 (VEN-NIF)
// CONTRATO MUTUO Y MOVIMIENTOS DETALLADOS DE MANUEL BECERRA 2026

export interface BalanceSheetData {
  periodDate: string;
  exchangeRateBCV: number;
  assets: {
    current: {
      cashAndBanks: number;
      tradeReceivables: number;
      manuelBecerraReceivable: number;
      islrWithholdingClients: number;
      prepaidISLR: number;
      totalCurrent: number;
    };
    propertyPlantEquipment: {
      machinery: number;
      vehicles: number;
      furnitureAndOfficeEquipment: number;
      realEstateBuildings: number;
      subtotal: number;
      accumulatedDepreciation: number;
      totalPPE: number;
    };
    totalAssets: number;
  };
  liabilities: {
    current: {
      shareholderPayables: number;
      withholdingTaxesPayable: number;
      ivaPayable: number;
      islrPayable: number;
      totalCurrent: number;
    };
    totalLiabilities: number;
  };
  equity: {
    subscribedCapital: number;
    accumulatedSurplus: number;
    periodProfit: number;
    legalReserve: number;
    totalEquity: number;
  };
  totalLiabilitiesAndEquity: number;
}

export interface IncomeStatementData {
  periodDate: string;
  exchangeRateBCV: number;
  revenues: {
    agriculturalServices: number;
    interestIncome: number;
    totalRevenues: number;
  };
  costs: {
    serviceCosts: number;
    grossProfit: number;
  };
  operatingExpenses: {
    administrativeExpenses: number;
    depreciationExpenses: number;
    totalOperatingExpenses: number;
    operatingProfit: number;
  };
  taxesAndReserves: {
    islrTax: number;
    profitAfterISLR: number;
    legalReserve5Pct: number;
    netProfit: number;
  };
}

// 1. ESTADO DE SITUACIÓN FINANCIERA AL 31 DE DICIEMBRE DE 2025
export const BALANCE_SHEET_2025: BalanceSheetData = {
  periodDate: '31 de diciembre de 2025',
  exchangeRateBCV: 301.37,
  assets: {
    current: {
      cashAndBanks: 2418532.47,
      tradeReceivables: 53109051.79,
      manuelBecerraReceivable: 0.00,
      islrWithholdingClients: 661181.94,
      prepaidISLR: 394563.21,
      totalCurrent: 56583329.41
    },
    propertyPlantEquipment: {
      machinery: 10000.00,
      vehicles: 26145094.00,
      furnitureAndOfficeEquipment: 590000.00,
      realEstateBuildings: 1317600.00,
      subtotal: 28062694.00,
      accumulatedDepreciation: -8.47,
      totalPPE: 28062685.53
    },
    totalAssets: 84646014.94
  },
  liabilities: {
    current: {
      shareholderPayables: 0.00,
      withholdingTaxesPayable: 0.00,
      ivaPayable: 0.00,
      islrPayable: 1395745.15,
      totalCurrent: 1395745.15
    },
    totalLiabilities: 1395745.15
  },
  equity: {
    subscribedCapital: 600000.00,
    accumulatedSurplus: 79877475.85,
    periodProfit: 2712793.94,
    legalReserve: 60000.00,
    totalEquity: 83250269.79
  },
  totalLiabilitiesAndEquity: 84646014.94
};

// 2. ESTADO DE RESULTADO INTEGRAL AL 31 DE DICIEMBRE DE 2025
export const INCOME_STATEMENT_2025: IncomeStatementData = {
  periodDate: '31 de diciembre de 2025',
  exchangeRateBCV: 301.37,
  revenues: {
    agriculturalServices: 40083584.65,
    interestIncome: 0.00,
    totalRevenues: 40083584.65
  },
  costs: {
    serviceCosts: -34930000.00,
    grossProfit: 5153584.65
  },
  operatingExpenses: {
    administrativeExpenses: -985216.56,
    depreciationExpenses: 0.00,
    totalOperatingExpenses: -985216.56,
    operatingProfit: 4168368.09
  },
  taxesAndReserves: {
    islrTax: -1395745.15,
    profitAfterISLR: 2772622.94,
    legalReserve5Pct: -59829.00,
    netProfit: 2712793.94
  }
};

// 3. ESTADO DE SITUACIÓN FINANCIERA AL 31 DE AGOSTO DE 2026
export const BALANCE_SHEET_AUGUST_2026: BalanceSheetData = {
  periodDate: '31 de agosto de 2026',
  exchangeRateBCV: 794.99,
  assets: {
    current: {
      cashAndBanks: 999278.01,
      tradeReceivables: 0.00,
      manuelBecerraReceivable: 325948652.96, // Saldo capital Bs. 312.024.605,30 + Intereses Bs. 13.924.047,66
      islrWithholdingClients: 661181.94,
      prepaidISLR: 787174.72,
      totalCurrent: 328396287.63
    },
    propertyPlantEquipment: {
      machinery: 10000.00,
      vehicles: 26145094.00,
      furnitureAndOfficeEquipment: 590000.00,
      realEstateBuildings: 1317600.00,
      subtotal: 28062694.00,
      accumulatedDepreciation: -8.47,
      totalPPE: 28062685.53
    },
    totalAssets: 356458973.16
  },
  liabilities: {
    current: {
      shareholderPayables: 246572875.38,
      withholdingTaxesPayable: 0.00,
      ivaPayable: 0.00,
      islrPayable: 696202.38,
      totalCurrent: 247269077.76
    },
    totalLiabilities: 247269077.76
  },
  equity: {
    subscribedCapital: 600000.00,
    accumulatedSurplus: 82590269.79, // 79.877.475,85 + 2.712.793,94
    periodProfit: 25939625.61,
    legalReserve: 60000.00,
    totalEquity: 109189895.40
  },
  totalLiabilitiesAndEquity: 356458973.16
};

// 4. ESTADO DE RESULTADO INTEGRAL AL 31 DE AGOSTO DE 2026
export const INCOME_STATEMENT_AUGUST_2026: IncomeStatementData = {
  periodDate: '31 de agosto de 2026',
  exchangeRateBCV: 794.99,
  revenues: {
    agriculturalServices: 78717472.35,
    interestIncome: 13924047.66, // Intereses del Contrato Mutuo Becerra
    totalRevenues: 92641520.01 // Lo que figura en Estados Financieros
  },
  costs: {
    serviceCosts: -66701894.40,
    grossProfit: 25939625.61
  },
  operatingExpenses: {
    administrativeExpenses: 0.00,
    depreciationExpenses: 0.00,
    totalOperatingExpenses: 0.00,
    operatingProfit: 25939625.61
  },
  taxesAndReserves: {
    islrTax: 0.00,
    profitAfterISLR: 25939625.61,
    legalReserve5Pct: 0.00,
    netProfit: 25939625.61
  }
};

// =========================================================================
// 5. MOVIMIENTOS DETALLADOS DEL CONTRATO MUTUO MANUEL BECERRA (47 OPERACIONES 2026)
// =========================================================================
export interface BecerraTransaction {
  item: number;
  date: string;
  reference: string;
  bank: string;
  description: string;
  outflowVES: number; // Desembolsos de préstamo a Manuel Becerra (Egresos de Banesco)
  inflowVES: number;  // Pagos / amortizaciones recibidas de Manuel Becerra (Ingresos a Banesco)
}

export const MANUEL_BECERRA_MOVEMENTS_2026: BecerraTransaction[] = [
  { item: 1, date: '06/05/2026', reference: '3600133147', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 1500000.00 },
  { item: 2, date: '15/05/2026', reference: '61353987017', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 13700000.00 },
  { item: 3, date: '25/05/2026', reference: '61455660227', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 3000000.00 },
  { item: 4, date: '27/05/2026', reference: '3603818256', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 2000000.00, inflowVES: 0 },
  { item: 5, date: '02/06/2026', reference: '3605046069', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 365000.00, inflowVES: 0 },
  { item: 6, date: '05/06/2026', reference: '3605612140', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 835000.00, inflowVES: 0 },
  { item: 7, date: '05/06/2026', reference: '3605630117', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 4050000.00, inflowVES: 0 },
  { item: 8, date: '05/06/2026', reference: '3605630738', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 36000000.00, inflowVES: 0 },
  { item: 9, date: '09/06/2026', reference: '61605464794', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 36248000.00 },
  { item: 10, date: '09/06/2026', reference: '61605548129', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 3700000.00 },
  { item: 11, date: '15/06/2026', reference: '3607248177', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 500000.00, inflowVES: 0 },
  { item: 12, date: '16/06/2026', reference: '3607360183', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 32500000.00, inflowVES: 0 },
  { item: 13, date: '16/06/2026', reference: '61679071434', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 25000000.00 },
  { item: 14, date: '18/06/2026', reference: '3607869982', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 15000000.00, inflowVES: 0 },
  { item: 15, date: '19/06/2026', reference: '3607948391', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 5000000.00, inflowVES: 0 },
  { item: 16, date: '19/06/2026', reference: '3607948940', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 5000000.01, inflowVES: 0 },
  { item: 17, date: '19/06/2026', reference: '3607992268', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 15000000.00, inflowVES: 0 },
  { item: 18, date: '19/06/2026', reference: '3608125055', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 10000000.00, inflowVES: 0 },
  { item: 19, date: '19/06/2026', reference: '3608125960', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 79790000.00, inflowVES: 0 },
  { item: 20, date: '19/06/2026', reference: '3608033529', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 5000000.00, inflowVES: 0 },
  { item: 21, date: '01/07/2026', reference: '3609678714', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 1000000.00, inflowVES: 0 },
  { item: 22, date: '07/07/2026', reference: '3610642810', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 565000.00, inflowVES: 0 },
  { item: 23, date: '08/07/2026', reference: '3610770085', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 26500000.00, inflowVES: 0 },
  { item: 24, date: '08/07/2026', reference: '3610925654', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 150000.00, inflowVES: 0 },
  { item: 25, date: '10/07/2026', reference: '3611167966', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 87900000.00, inflowVES: 0 },
  { item: 26, date: '10/07/2026', reference: '3611271343', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 13120000.00, inflowVES: 0 },
  { item: 27, date: '10/07/2026', reference: '3611311850', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 6875605.29, inflowVES: 0 },
  { item: 28, date: '13/07/2026', reference: '3611731383', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 102000.00, inflowVES: 0 },
  { item: 29, date: '13/07/2026', reference: '3611731722', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 101898000.00, inflowVES: 0 },
  { item: 30, date: '14/07/2026', reference: '3611756071', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 2500000.00 },
  { item: 31, date: '15/07/2026', reference: '61961302310', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 950000.00 },
  { item: 32, date: '20/07/2026', reference: '61991611407', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 200000.00, inflowVES: 0 },
  { item: 33, date: '20/07/2026', reference: '61991372259', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 200000.00 },
  { item: 34, date: '21/07/2026', reference: '62021307849', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 26400000.00, inflowVES: 0 },
  { item: 35, date: '21/07/2026', reference: '62021317367', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 26400000.00 },
  { item: 36, date: '27/07/2026', reference: '62089625117', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 12000000.00 },
  { item: 37, date: '27/07/2026', reference: '62081509567', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 3000000.00 },
  { item: 38, date: '27/07/2026', reference: '62081531019', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 500000.00 },
  { item: 39, date: '27/07/2026', reference: '3613992496', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 330000.00 },
  { item: 40, date: '27/07/2026', reference: '3613993611', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 248000.00 },
  { item: 41, date: '29/07/2026', reference: '62106664904', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 21300000.00 },
  { item: 42, date: '29/07/2026', reference: '62106926077', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 6800000.00 },
  { item: 43, date: '03/08/2026', reference: '3615056914', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 825000.00, inflowVES: 0 },
  { item: 44, date: '03/08/2026', reference: '3615099189', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 825000.00, inflowVES: 0 },
  { item: 45, date: '05/08/2026', reference: '62171461499', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 0, inflowVES: 29000000.00 },
  { item: 46, date: '12/08/2026', reference: '3616711990', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 1000000.00, inflowVES: 0 },
  { item: 47, date: '28/08/2026', reference: '3619429622', bank: 'BANESCO', description: 'TRFMB 0134 J501456380 AGRICOLA ONICA 5128', outflowVES: 20000000.00, inflowVES: 0 }
];

export const MANUEL_BECERRA_SUMMARY_2026 = {
  contractTitle: 'Contrato de Préstamo Mutuo y Línea de Crédito Rotativa',
  debtorName: 'Manuel Becerra',
  relationship: 'Socio en empresa vinculada / Aliado Estratégico',
  lineLimitVES: 600000000.00, // Límite de la línea de crédito de Bs. 600.000.000,00
  totalDisbursedVES: 498400605.30, // Suma de la columna Egresos en Banesco
  totalRepaidVES: 186376000.00,   // Suma de la columna Ingresos en Banesco
  principalBalanceVES: 312024605.30, // 498.400.605,30 - 186.376.000,00
  interestIncomeVES: 13924047.66,    // Reconocido en Estado de Resultados al 31/08/2026
  totalReceivableAugust31VES: 325948652.96, // 312.024.605,30 + 13.924.047,66 = Cuentas por Cobrar en Balance
  totalReceivableUSD: 410003.46, // Al cambio implícito de 794,99
  percentagePaidPct: 37.39 // 186.376.000 / 498.400.605,30 = 37.39%
};

// =========================================================================
// 6. MATRIZ DE CONCILIACIÓN: EXTRACTO BANESCO VS ESTADOS FINANCIEROS
// =========================================================================
export const BANESCO_VS_FINANCIAL_STATEMENTS_RECONCILIATION = {
  period: '01 de Enero al 31 de Agosto de 2026',
  bankDepositsTotalVES: 1966597105.00,
  financialStatementRevenuesVES: 92641520.01,
  
  // Demostración formal y matemática de por qué los depósitos no son ingresos devengados
  breakdown: [
    {
      concept: '1. Anticipos Recibidos de Clientes para Importación de Café (NIIF 15)',
      nature: 'Pasivo Corriente (Facturación Definitiva a partir de Octubre 2026)',
      bankAmountVES: 1368568092.62,
      impactOnIncomeStatement: 0.00,
      legalNotes: 'Fondos de torrefactoras nacionales para compra e importación de café de Colombia ante déficit nacional. No constituyen ingreso gravable devengado al 31/08/2026.'
    },
    {
      concept: '2. Reintegros / Amortizaciones de Capital Manuel Becerra (Contrato Mutuo)',
      nature: 'Recuperación de Activo Exigible (Cuentas por Cobrar)',
      bankAmountVES: 186376000.00,
      impactOnIncomeStatement: 0.00,
      legalNotes: 'Pagos parciales de la línea de crédito de Bs. 600.000.000,00. Disminuyen el saldo deudor de Manuel Becerra, no generan ingreso fiscal de venta.'
    },
    {
      concept: '3. Transferencias entre Cuentas Internas Propias de Agrícola Oni C.A.',
      nature: 'Traspasos entre Cuentas Propias (Provincial, Mercantil, Plaza, Bancamiga)',
      bankAmountVES: 153210000.00,
      impactOnIncomeStatement: 0.00,
      legalNotes: 'Movilizaciones de fondos entre cuentas del mismo titular RIF J-50145638-0. Impacto patrimonial neto de Bs. 0,00.'
    },
    {
      concept: '4. Reservas Operativas y Abonos de Personas Naturales',
      nature: 'Aportes de Campo y Reserva de Quintales',
      bankAmountVES: 29495954.99,
      impactOnIncomeStatement: 0.00,
      legalNotes: 'Aportes de titular V-023997829 y 14 titulares para operaciones y fletes de café.'
    },
    {
      concept: '5. Ingresos Devengados por Servicios Agrícolas Realizados',
      nature: 'Ingresos Operativos Devengados en el Ejercicio',
      bankAmountVES: 228947057.39,
      impactOnIncomeStatement: 78717472.35,
      legalNotes: 'Ingresos netos por servicios agrícolas prestados y facturados según Nota 10 de los Estados Financieros.'
    },
    {
      concept: '6. Ingresos por Intereses Financieros Contrato Mutuo Manuel Becerra',
      nature: 'Ingresos Financieros Devengados',
      bankAmountVES: 0.00,
      impactOnIncomeStatement: 13924047.66,
      legalNotes: 'Intereses causados por la línea de crédito otorgada a Manuel Becerra, reconocidos en el Estado de Resultados.'
    }
  ],
  conclusion: 'La aparente discrepancia observada por Banesco se debe a que el banco confunde el Flujo de Caja Bruto (Depósitos Bancarios) con los Ingresos Devengados del Estado de Resultados. Los Bs. 1.542,02 millones de clientes (51.5% transferencias mismo banco + 26.9% terceros con RIF) son pasivos por anticipos según NIIF 15 para importación de café que se facturan en octubre, y los Bs. 186,38 millones son amortizaciones del mutuo de Manuel Becerra. Los ingresos del período son exactamente los Bs. 92.641.520,01 presentados al banco.'
};

// =========================================================================
// 7. OFICIO OFICIAL DE REQUERIMIENTO BANESCO (AGOSTO 2026)
// =========================================================================
export const BANESCO_OFFICIAL_LETTER_2026 = {
  letterSubject: 'DISPARIDAD ENTRE ABONOS EN CUENTA Y VENTAS REPORTADAS EN ESTADOS FINANCIEROS (ENE - AGO 2026)',
  companyName: 'AGRÍCOLA ONI, C.A.',
  companyRif: 'J-50145638-0',
  reportedRevenuesVES: 92641520.01,
  reportedRevenuesUSD: 116531.68,
  bankCreditsAverageUSD: 2781830.18, // Créditos movilizados en promedio en BBU
  bankCreditsTotalVES: 1966597105.35, // Total abonos del extracto bancario
  bankCreditsTotalUSD: 2912368.95,
  requirements: [
    'Carta explicativa firmada donde se exponga detalladamente la justificación de la diferencia entre las ventas reportadas y el total de los fondos movilizados en el banco.',
    'Soportes documentales que respalden lo justificado en la carta (contratos, préstamos, aportes de capital, ventas de activos u otros conceptos pertinentes).'
  ]
};

// =========================================================================
// 8. TABLA OFICIAL: COMPOSICIÓN DE ABONOS POR ORIGEN Y MES (BS) - ENERO A AGOSTO 2026
// =========================================================================
export interface MonthlyOriginRow {
  id: string;
  origen: string;
  category: 'LINEA_MUTUO' | 'CUENTAS_PROPIAS' | 'PERSONA_NATURAL_V023' | 'PERSONAS_NATURALES_V' | 'TERCEROS_RIF' | 'BANESCO_TRANS_CTAS_IDENTIFICADO';
  ene: number;
  feb: number;
  mar: number;
  abr: number;
  may: number;
  jun: number;
  jul: number;
  ago: number;
  totalBs: number;
  pctDelTotal: number;
  totalUSD: number;
  auditExplanation: string;
  legalClassification: string;
}

export const BANESCO_MONTHLY_ORIGIN_COMPOSITION_2026: {
  rows: MonthlyOriginRow[];
  totals: {
    ene: number;
    feb: number;
    mar: number;
    abr: number;
    may: number;
    jun: number;
    jul: number;
    ago: number;
    totalBs: number;
    pctDelTotal: number;
    totalUSD: number;
  };
} = {
  rows: [
    {
      id: 'ORIG-01',
      origen: 'Becerra (linea de credito)',
      category: 'LINEA_MUTUO',
      ene: 0,
      feb: 0,
      mar: 0,
      abr: 0,
      may: 18200000.00,
      jun: 64948000.00,
      jul: 74228000.00,
      ago: 29000000.00,
      totalBs: 186376000.00,
      pctDelTotal: 9.5,
      totalUSD: 286228.93,
      auditExplanation: 'Reintegros y amortizaciones del Contrato de Préstamo Mutuo y Línea de Crédito Rotativa de Bs. 600.000.000,00 suscrito con el socio Manuel Becerra. 14 abonos bancarios.',
      legalClassification: 'Recuperación de Activo Exigible (Cuentas por Cobrar en Balance: Bs. 325.948.652,96). NO ES VENTA NI INGRESO FISCAL.'
    },
    {
      id: 'ORIG-02',
      origen: 'Agrícola Onica J-501456380 (otros bancos)',
      category: 'CUENTAS_PROPIAS',
      ene: 1110000.00,
      feb: 720000.00,
      mar: 1032830.57,
      abr: 582934.16,
      may: 1298290.80,
      jun: 73390000.01,
      jul: 47240540.00,
      ago: 83333462.19,
      totalBs: 208708057.73,
      pctDelTotal: 10.6,
      totalUSD: 308317.80,
      auditExplanation: 'Transferencias entre cuentas bancarias propias de la empresa Agrícola Oni C.A. (Banco Provincial 0108, Mercantil 0105, Banco Plaza 0138, Bancamiga 0172).',
      legalClassification: 'Movilización Interna de Tesorería Institucional. Impacto patrimonial neto: Bs. 0,00. NO ES INGRESO DE TERCEROS.'
    },
    {
      id: 'ORIG-03',
      origen: 'Persona V-023997829 (Socio Propietario Agrícola Oni C.A.)',
      category: 'PERSONA_NATURAL_V023',
      ene: 14000.00,
      feb: 500000.00,
      mar: 60000.00,
      abr: 8500.00,
      may: 179475.00,
      jun: 1000000.00,
      jul: 1648000.00,
      ago: 4240000.00,
      totalBs: 7649975.00,
      pctDelTotal: 0.4,
      totalUSD: 11266.93,
      auditExplanation: '21 transferencias de abonos del socio propietario V-23.997.829 para inyección de liquidez y operación de la empresa.',
      legalClassification: 'Cuentas por Pagar Socios (Pasivo Corriente) / Aportes del Socio Propietario V-23.997.829.'
    },
    {
      id: 'ORIG-04',
      origen: 'Personas Naturales (V-24493340 Juan Lander / V-20105311 Blanca Trías)',
      category: 'PERSONAS_NATURALES_V',
      ene: 0,
      feb: 0,
      mar: 0,
      abr: 0,
      may: 0,
      jun: 17975979.99,
      jul: 0,
      ago: 3870000.00,
      totalBs: 21845979.99,
      pctDelTotal: 1.1,
      totalUSD: 36069.06,
      auditExplanation: '15 abonos bancarios de personas naturales por concepto de anticipos para reserva de café (Juan Rafael Lander Ramírez V-24.493.340, Blanca Cristina Trías Abreu V-20.105.311 y otros).',
      legalClassification: 'Anticipos de Clientes Personas Naturales (Pasivo Corriente NIIF 15). Comprobante COMP-ANT-NAT-2026-002.'
    },
    {
      id: 'ORIG-05',
      origen: 'Terceros con RIF (PPV/SGLBTR/INM)',
      category: 'TERCEROS_RIF',
      ene: 0,
      feb: 0,
      mar: 0,
      abr: 0,
      may: 0,
      jun: 56568999.24,
      jul: 184879550.00,
      ago: 287130000.01,
      totalBs: 528578549.25,
      pctDelTotal: 26.9,
      totalUSD: 726080.44,
      auditExplanation: 'Anticipos en ventas recibidos de empresas clientes jurídicas con RIF (ETN C.A., Distribuidora DIS, Grupo ORU, Comercializadora RIK, Inversiones Solbtr, Corp. Agroindustrial J) para importación de café de Colombia ante déficit nacional.',
      legalClassification: 'Anticipos en Ventas de Clientes Jurídicos (Pasivo Corriente NIIF 15). Entrega y facturación definitiva en OCTUBRE 2026.'
    },
    {
      id: 'ORIG-06',
      origen: 'Banesco sin identificar (TRANS,CTAS) -> [ANTICIPOS CLIENTES TORREFACTORAS BANESCO]',
      category: 'BANESCO_TRANS_CTAS_IDENTIFICADO',
      ene: 14739197.00,
      feb: 23673607.21,
      mar: 2650000.00,
      abr: 6874000.00,
      may: 5625047.50,
      jun: 296593783.96,
      jul: 386791318.31,
      ago: 276491589.40,
      totalBs: 1013438543.38,
      pctDelTotal: 51.5,
      totalUSD: 1544405.79,
      auditExplanation: 'Transferencias internas entre cuentas Banesco de clientes torrefactores industriales (TRANS.CTAS MISMO BANCO). Corresponden a ANTICIPOS EN VENTAS para asegurar cupos de café importado nacionalizado en Acarigua/Araure.',
      legalClassification: 'Anticipos de Cartera Mayorista Banesco (Pasivo NIIF 15). 100% IDENTIFICADOS. Facturación fiscal SENIAT a emitirse a partir de OCTUBRE 2026.'
    }
  ],
  totals: {
    ene: 15863197.00,
    feb: 24893607.21,
    mar: 3742830.57,
    abr: 7465434.16,
    may: 25302813.30,
    jun: 510476763.20,
    jul: 694787408.31,
    ago: 684065051.60,
    totalBs: 1966597105.35,
    pctDelTotal: 100.0,
    totalUSD: 2912368.95
  }
};

// =========================================================================
// 9. BALANCE DE COMPROBACIÓN GENERAL AL 31 DE AGOSTO DE 2026 (VEN-NIF)
// DUAL VES & USD CON CONCILIACIÓN DE SALDOS 31/12/2025 Y MOVIMIENTOS 2026
// =========================================================================
export interface TrialBalanceRow {
  code: string;
  accountName: string;
  category: 'ACTIVO' | 'PASIVO' | 'PATRIMONIO' | 'INGRESO' | 'EGRESO';
  initialBalance2025: {
    debitVES: number;
    creditVES: number;
  };
  movements2026: {
    debitVES: number;
    creditVES: number;
  };
  finalBalance2026: {
    debitVES: number;
    creditVES: number;
  };
  finalBalanceUSD: {
    debitUSD: number;
    creditUSD: number;
  };
}

export const TRIAL_BALANCE_AUGUST_2026 = {
  periodTitle: 'BALANCE DE COMPROBACIÓN DE SALDOS Y MOVIMIENTOS',
  periodSubTitle: 'Desde el 01 de Enero de 2026 hasta el 31 de Agosto de 2026',
  comparativeBaseDate: '31 de Diciembre de 2025',
  exchangeRateBCV: 794.99,
  rows: [
    {
      code: '1.1.01',
      accountName: 'Efectivo y Bancos (Banesco Cta. Cte. y Caja Chica)',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 2418532.47, creditVES: 0.00 },
      movements2026: { debitVES: 1966597105.35, creditVES: 1968016359.81 },
      finalBalance2026: { debitVES: 999278.01, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 1256.97, creditUSD: 0.00 }
    },
    {
      code: '1.1.02',
      accountName: 'Cuentas por Cobrar Comerciales (Clientes)',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 53109051.79, creditVES: 0.00 },
      movements2026: { debitVES: 78717472.35, creditVES: 131826524.14 },
      finalBalance2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 0.00 }
    },
    {
      code: '1.1.03',
      accountName: 'Cuentas por Cobrar Socios - Mutuo y Línea de Crédito Manuel Becerra',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 512324652.96, creditVES: 186376000.00 },
      finalBalance2026: { debitVES: 325948652.96, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 410003.46, creditUSD: 0.00 }
    },
    {
      code: '1.1.04',
      accountName: 'Retenciones ISLR Clientes Retenidas',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 661181.94, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalance2026: { debitVES: 661181.94, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 831.69, creditUSD: 0.00 }
    },
    {
      code: '1.1.05',
      accountName: 'ISLR Pagado por Anticipado / Crédito Fiscal Exigible',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 394563.21, creditVES: 0.00 },
      movements2026: { debitVES: 392611.51, creditVES: 0.00 },
      finalBalance2026: { debitVES: 787174.72, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 990.17, creditUSD: 0.00 }
    },
    {
      code: '1.2.01',
      accountName: 'Maquinarias y Equipos Agrícolas',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 10000.00, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalance2026: { debitVES: 10000.00, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 12.58, creditUSD: 0.00 }
    },
    {
      code: '1.2.02',
      accountName: 'Vehículos y Flota de Carga Agrícola',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 26145094.00, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalance2026: { debitVES: 26145094.00, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 32887.32, creditUSD: 0.00 }
    },
    {
      code: '1.2.03',
      accountName: 'Muebles y Equipos de Oficina',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 590000.00, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalance2026: { debitVES: 590000.00, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 742.15, creditUSD: 0.00 }
    },
    {
      code: '1.2.04',
      accountName: 'Edificaciones e Inmuebles Industriales',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 1317600.00, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalance2026: { debitVES: 1317600.00, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 1657.38, creditUSD: 0.00 }
    },
    {
      code: '1.2.05',
      accountName: 'Depreciación Acumulada Propiedad, Planta y Equipos',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 0.00, creditVES: 8.47 },
      movements2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalance2026: { debitVES: 0.00, creditVES: 8.47 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 0.01 }
    },
    {
      code: '2.1.01',
      accountName: 'Cuentas por Pagar Socios (Elías Rafael Trias Abreu)',
      category: 'PASIVO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 246572875.38 },
      finalBalance2026: { debitVES: 0.00, creditVES: 246572875.38 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 310158.46 }
    },
    {
      code: '2.1.02',
      accountName: 'ISLR por Pagar / Provisiones Tributarias',
      category: 'PASIVO',
      initialBalance2025: { debitVES: 0.00, creditVES: 1395745.15 },
      movements2026: { debitVES: 1395745.15, creditVES: 696202.38 },
      finalBalance2026: { debitVES: 0.00, creditVES: 696202.38 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 875.74 }
    },
    {
      code: '3.1.01',
      accountName: 'Capital Social Suscrito y Pagado',
      category: 'PATRIMONIO',
      initialBalance2025: { debitVES: 0.00, creditVES: 600000.00 },
      movements2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalance2026: { debitVES: 0.00, creditVES: 600000.00 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 754.73 }
    },
    {
      code: '3.2.01',
      accountName: 'Superávit Acumulado (Resultados de Ejercicios Anteriores)',
      category: 'PATRIMONIO',
      initialBalance2025: { debitVES: 0.00, creditVES: 79877475.85 },
      movements2026: { debitVES: 0.00, creditVES: 2712793.94 },
      finalBalance2026: { debitVES: 0.00, creditVES: 82590269.79 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 103888.44 }
    },
    {
      code: '3.2.02',
      accountName: 'Utilidad Neta del Ejercicio 2025 (Cierre)',
      category: 'PATRIMONIO',
      initialBalance2025: { debitVES: 0.00, creditVES: 2712793.94 },
      movements2026: { debitVES: 2712793.94, creditVES: 0.00 },
      finalBalance2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 0.00 }
    },
    {
      code: '3.3.01',
      accountName: 'Reserva Legal Cumplida (10% Capital)',
      category: 'PATRIMONIO',
      initialBalance2025: { debitVES: 0.00, creditVES: 60000.00 },
      movements2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalance2026: { debitVES: 0.00, creditVES: 60000.00 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 75.47 }
    },
    {
      code: '4.1.01',
      accountName: 'Ingresos por Servicios Agrícolas y Procesamiento',
      category: 'INGRESO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 78717472.35 },
      finalBalance2026: { debitVES: 0.00, creditVES: 78717472.35 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 99016.93 }
    },
    {
      code: '4.2.01',
      accountName: 'Ingresos por Intereses Financieros Contrato Mutuo Becerra',
      category: 'INGRESO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 13924047.66 },
      finalBalance2026: { debitVES: 0.00, creditVES: 13924047.66 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 17514.75 }
    },
    {
      code: '5.1.01',
      accountName: 'Costo Operacional de Servicios Agrícolas Prestados',
      category: 'EGRESO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 66701894.40, creditVES: 0.00 },
      finalBalance2026: { debitVES: 66701894.40, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 83902.81, creditUSD: 0.00 }
    }
  ],
  totals: {
    initialDebitVES: 84646023.41,
    initialCreditVES: 84646023.41,
    movementsDebitVES: 2559508835.31,
    movementsCreditVES: 2559508835.31,
    finalDebitVES: 423160876.03,
    finalCreditVES: 423160876.03,
    finalDebitUSD: 532284.53,
    finalCreditUSD: 532284.53
  }
};


