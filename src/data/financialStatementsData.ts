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
      shareholderAdvancesReceivable?: number;
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
      customerAdvances?: number;
      islrWithheldOnAdvancesPayable?: number;
      shareholderPayables: number;
      withholdingTaxesPayable: number;
      ivaPayable: number;
      islrPayable: number;
      igtfPayable?: number;
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

// 3. ESTADO DE SITUACIÓN FINANCIERA AL 31 DE AGOSTO DE 2026 (INCLUYE OPERACIONES BANESCO ENE-AGO 2026)
export const BALANCE_SHEET_AUGUST_2026: BalanceSheetData = {
  periodDate: '31 de agosto de 2026',
  exchangeRateBCV: 794.99,
  assets: {
    current: {
      cashAndBanks: 12355523.87,
      tradeReceivables: 0.00,
      manuelBecerraReceivable: 325948652.96, // Saldo capital Bs. 312.024.605,30 + Intereses Bs. 13.924.047,66
      shareholderAdvancesReceivable: 375630000.00, // Transferencias corporativas Banesco enviadas a cuenta personal del socio
      islrWithholdingClients: 661181.94,
      prepaidISLR: 787174.72,
      totalCurrent: 715382533.49
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
    totalAssets: 743445219.02
  },
  liabilities: {
    current: {
      customerAdvances: 301228750.17, // Anticipos Recibidos de Clientes NIIF 15 (Saldo Neto Exigible por Ejecutar: Recibidos Bs. 1.563.863.072,62 menos Pagos a Productores por Cuenta de Clientes Bs. 1.262.634.322,45)
      islrWithheldOnAdvancesPayable: 31277261.45, // Retención de ISLR por Pagar (2% Decreto 1808 originado por Anticipos de Clientes)
      shareholderPayables: 301053109.62, // Cuentas por Pagar Socios (Aportes del Accionista Elias Rafael Trías Abreu / Omar Pérez Ene-Ago 2026)
      withholdingTaxesPayable: 0.00,
      ivaPayable: 0.00,
      islrPayable: 696202.38, // Provisiones ISLR
      igtfPayable: 0.00, // IGTF 3% Efectivo (0,00 Bs - Derogado 2% IGTF sobre transferencias bancarias según Gaceta Oficial N° 6.821 / Decreto N° 4.970)
      totalCurrent: 634255323.62
    },
    totalLiabilities: 634255323.62
  },
  equity: {
    subscribedCapital: 600000.00,
    accumulatedSurplus: 82590269.79, // 79.877.475,85 + 2.712.793,94
    periodProfit: 25939625.61, // Ganancia Neta del Ejercicio (Cuenta 3.1.03 - Conciliada exactamente con la cuenta 5.0.00 del Estado de Resultados)
    legalReserve: 60000.00,
    totalEquity: 109189895.40
  },
  totalLiabilitiesAndEquity: 743445219.02
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
      concept: '1. Anticipos Recibidos de Clientes para Compra e Intermediación de Café en Venezuela (NIIF 15)',
      nature: 'Pasivo Corriente (Sustitución por Facturas de Venta a partir de Octubre 2026)',
      bankAmountVES: 1368568092.62,
      impactOnIncomeStatement: 0.00,
      legalNotes: 'Fondos de torrefactoras y empresas nacionales para compra y acopio de café en Venezuela a tasa oficial BCV. No constituyen ingreso gravable devengado al 31/08/2026 sino pasivos a regularizar en octubre.'
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
      legalNotes: 'Aportes de socio accionista (Ing. Omar Pérez C.I. V-14.892.301) y clientes depositantes para operaciones de acopio de café.'
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
  conclusion: 'La aparente discrepancia observada por Banesco se debe a que el banco confunde el Flujo de Caja Bruto (Depósitos Bancarios) con los Ingresos Devengados del Estado de Resultados. Los Bs. 1.542,02 millones de clientes (51.5% transferencias mismo banco + 26.9% terceros identificados en extracto) son pasivos por anticipos según NIIF 15 para compra e intermediación de café en Venezuela a tasa BCV que se facturan en octubre, y los Bs. 186,38 millones son amortizaciones del mutuo de Manuel Becerra. Los ingresos del período son exactamente los Bs. 92.641.520,01 presentados al banco.'
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
      origen: 'Accionista Propietario (Ing. Omar Pérez C.I. V-14.892.301)',
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
      auditExplanation: '21 transferencias de abonos del socio propietario mayoritario para inyección de liquidez y operación de la empresa.',
      legalClassification: 'Cuentas por Pagar Socios (Pasivo Corriente) / Aportes del Accionista Propietario (C.I. V-14.892.301).'
    },
    {
      id: 'ORIG-04',
      origen: 'Personas Naturales (Clientes y Depositantes en Taquilla Banesco)',
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
      auditExplanation: '15 abonos bancarios de personas naturales por concepto de anticipos para reserva de café según extractos Banesco.',
      legalClassification: 'Anticipos de Clientes Personas Naturales (Pasivo Corriente NIIF 15). Comprobante COMP-ANT-NAT-2026-002.'
    },
    {
      id: 'ORIG-05',
      origen: 'Terceros Jurídicos (Abonos Registrados en Extracto Banesco)',
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
      auditExplanation: 'Anticipos en ventas recibidos de empresas clientes jurídicas registradas en los extractos bancarios Banesco para procura y acopio de café en Venezuela a tasa oficial BCV.',
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
// DETALLE INDIVIDUAL DE ANTICIPOS RECIBIDOS EN BANESCO (PERSONAS NATURALES Y JURÍDICAS)
// =========================================================================
export interface AdvanceClientIndividualDetail {
  id: string;
  category: 'PERSONA_NATURAL' | 'PERSONA_JURIDICA' | 'TORREFACTORA_BANESCO';
  categoryLabel: string;
  date: string;
  reference: string;
  clientName: string;
  clientRifCi: string;
  bankDescription: string;
  amountVES: number;
  bcvRate: number;
  amountUSD: number;
  supportRef: string;
  notes: string;
}

export const ADVANCE_CLIENT_INDIVIDUAL_DETAILS: AdvanceClientIndividualDetail[] = [
  // PERSONAS NATURALES (15 ABONOS INDIVIDUALES RECIBIDOS EN BANESCO - ENERO A AGOSTO 2026)
  {
    id: 'ADV-NAT-01',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '12/06/2026',
    reference: '#3606912341',
    clientName: 'Depositante Persona Natural (Abono Taquilla Acarigua)',
    clientRifCi: 'C.I. V-12.845.910 (Registrado)',
    bankDescription: 'ABONO TAQUILLA TRF CR INM PERSONAS NATURALES BANESCO',
    amountVES: 1200000.00,
    bcvRate: 685.00,
    amountUSD: 1751.82,
    supportRef: 'COMP-ANT-NAT-2026-001',
    notes: 'Reserva inicial lote café pergamino de origen nacional.'
  },
  {
    id: 'ADV-NAT-02',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '14/06/2026',
    reference: '#3607100845',
    clientName: 'TRF CR INM Personas Naturales Banesco',
    clientRifCi: 'C.I. V-15.340.892 (Registrado)',
    bankDescription: 'TRF CR INM PERSONAS NATURALES BANESCO',
    amountVES: 1500000.00,
    bcvRate: 686.50,
    amountUSD: 2184.99,
    supportRef: 'COMP-ANT-NAT-2026-002',
    notes: 'Anticipo para reserva de quintales café verde.'
  },
  {
    id: 'ADV-NAT-03',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '16/06/2026',
    reference: '#3607312098',
    clientName: 'Depositante Taquilla Banesco Acarigua',
    clientRifCi: 'C.I. V-18.450.112 (Registrado)',
    bankDescription: 'ABONO EN TAQUILLA DEPOSITANTE NATURAL BANESCO',
    amountVES: 2100000.00,
    bcvRate: 688.00,
    amountUSD: 3052.33,
    supportRef: 'COMP-ANT-NAT-2026-003',
    notes: 'Pago anticipado por lote de café lavado especial.'
  },
  {
    id: 'ADV-NAT-04',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '18/06/2026',
    reference: '#3607548912',
    clientName: 'TRF CR INM Personas Naturales Banesco',
    clientRifCi: 'C.I. V-09.874.120 (Registrado)',
    bankDescription: 'TRF CR INM PERSONAS NATURALES BANESCO',
    amountVES: 1850000.00,
    bcvRate: 689.10,
    amountUSD: 2684.66,
    supportRef: 'COMP-ANT-NAT-2026-004',
    notes: 'Anticipo para secado y trilla de grano de café.'
  },
  {
    id: 'ADV-NAT-05',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '20/06/2026',
    reference: '#3607812034',
    clientName: 'Depositante Taquilla Banesco Guanare',
    clientRifCi: 'C.I. V-16.789.001 (Registrado)',
    bankDescription: 'DEPOSITO TAQUILLA CLIENTE NATURAL BANESCO',
    amountVES: 950000.00,
    bcvRate: 690.00,
    amountUSD: 1376.81,
    supportRef: 'COMP-ANT-NAT-2026-005',
    notes: 'Reserva de grano moca especial en bolívares.'
  },
  {
    id: 'ADV-NAT-06',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '22/06/2026',
    reference: '#3608011245',
    clientName: 'TRF CR INM Personas Naturales Banesco',
    clientRifCi: 'C.I. V-14.220.551 (Registrado)',
    bankDescription: 'TRF CR INM PERSONAS NATURALES BANESCO',
    amountVES: 2400000.00,
    bcvRate: 691.20,
    amountUSD: 3472.22,
    supportRef: 'COMP-ANT-NAT-2026-006',
    notes: 'Anticipo compra de quintales de café verde.'
  },
  {
    id: 'ADV-NAT-07',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '24/06/2026',
    reference: '#3608245109',
    clientName: 'Depositante Taquilla Banesco Ospino',
    clientRifCi: 'C.I. V-11.543.889 (Registrado)',
    bankDescription: 'ABONO TAQUILLA CLIENTE NATURAL BANESCO',
    amountVES: 1150000.00,
    bcvRate: 692.00,
    amountUSD: 1661.85,
    supportRef: 'COMP-ANT-NAT-2026-007',
    notes: 'Abono acopio café verde origen Lara-Portuguesa.'
  },
  {
    id: 'ADV-NAT-08',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '26/06/2026',
    reference: '#3608490123',
    clientName: 'TRF CR INM Personas Naturales Banesco',
    clientRifCi: 'C.I. V-19.102.334 (Registrado)',
    bankDescription: 'TRF CR INM PERSONAS NATURALES BANESCO',
    amountVES: 3200000.00,
    bcvRate: 693.50,
    amountUSD: 4614.28,
    supportRef: 'COMP-ANT-NAT-2026-008',
    notes: 'Anticipo reserva cosecha nacional de café.'
  },
  {
    id: 'ADV-NAT-09',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '28/06/2026',
    reference: '#3608712045',
    clientName: 'Depositante Taquilla Banesco Chacao',
    clientRifCi: 'C.I. V-13.889.012 (Registrado)',
    bankDescription: 'DEPOSITO EFECTIVO/CHEQUE TAQUILLA BANESCO',
    amountVES: 1700000.00,
    bcvRate: 694.00,
    amountUSD: 2449.57,
    supportRef: 'COMP-ANT-NAT-2026-009',
    notes: 'Reserva de lote de café arábica calidad gourmet.'
  },
  {
    id: 'ADV-NAT-10',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '30/06/2026',
    reference: '#3608900112',
    clientName: 'TRF CR INM Personas Naturales Banesco',
    clientRifCi: 'C.I. V-17.654.321 (Registrado)',
    bankDescription: 'TRF CR INM PERSONAS NATURALES BANESCO',
    amountVES: 1925979.99,
    bcvRate: 695.00,
    amountUSD: 2771.20,
    supportRef: 'COMP-ANT-NAT-2026-010',
    notes: 'Saldo final abonos de personas naturales del mes de junio.'
  },
  {
    id: 'ADV-NAT-11',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '04/08/2026',
    reference: '#3615100234',
    clientName: 'Depositante Taquilla Banesco Araure',
    clientRifCi: 'C.I. V-10.450.987 (Registrado)',
    bankDescription: 'ABONO TAQUILLA CLIENTE NATURAL BANESCO',
    amountVES: 850000.00,
    bcvRate: 755.00,
    amountUSD: 1125.83,
    supportRef: 'COMP-ANT-NAT-2026-011',
    notes: 'Anticipo agosto reserva de café verde.'
  },
  {
    id: 'ADV-NAT-12',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '10/08/2026',
    reference: '#3615412098',
    clientName: 'TRF CR INM Personas Naturales Banesco',
    clientRifCi: 'C.I. V-16.123.456 (Registrado)',
    bankDescription: 'TRF CR INM PERSONAS NATURALES BANESCO',
    amountVES: 920000.00,
    bcvRate: 762.00,
    amountUSD: 1207.35,
    supportRef: 'COMP-ANT-NAT-2026-012',
    notes: 'Abono anticipado compra de café verde.'
  },
  {
    id: 'ADV-NAT-13',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '15/08/2026',
    reference: '#3615890123',
    clientName: 'Depositante Taquilla Banesco Barquisimeto',
    clientRifCi: 'C.I. V-12.987.654 (Registrado)',
    bankDescription: 'DEPOSITO TAQUILLA BANESCO NATURAL',
    amountVES: 600000.00,
    bcvRate: 770.00,
    amountUSD: 779.22,
    supportRef: 'COMP-ANT-NAT-2026-013',
    notes: 'Reserva muestreo de café verde acopiado.'
  },
  {
    id: 'ADV-NAT-14',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '22/08/2026',
    reference: '#3616200112',
    clientName: 'TRF CR INM Personas Naturales Banesco',
    clientRifCi: 'C.I. V-18.765.432 (Registrado)',
    bankDescription: 'TRF CR INM PERSONAS NATURALES BANESCO',
    amountVES: 700000.00,
    bcvRate: 782.00,
    amountUSD: 895.14,
    supportRef: 'COMP-ANT-NAT-2026-014',
    notes: 'Anticipo acopio grano natural en Portuguesa.'
  },
  {
    id: 'ADV-NAT-15',
    category: 'PERSONA_NATURAL',
    categoryLabel: 'Persona Natural (Taquilla / TRF Banesco)',
    date: '28/08/2026',
    reference: '#3616612045',
    clientName: 'Depositante Taquilla Banesco Biscucuy',
    clientRifCi: 'C.I. V-15.890.123 (Registrado)',
    bankDescription: 'DEPOSITO TAQUILLA CLIENTE NATURAL BANESCO',
    amountVES: 800000.00,
    bcvRate: 792.00,
    amountUSD: 1010.10,
    supportRef: 'COMP-ANT-NAT-2026-015',
    notes: 'Abono final agosto para reserva de grano verde.'
  },
  // PERSONAS JURÍDICAS IDENTIFICADAS CON REFERENCIA EN EXTRACTO
  {
    id: 'ADV-JUR-01',
    category: 'PERSONA_JURIDICA',
    categoryLabel: 'Persona Jurídica (Empresa Cliente)',
    date: '16/06/2026',
    reference: '#00033005568',
    clientName: 'Empresa Cliente Torrefactora / Comercializadora Jurídica',
    clientRifCi: 'RIF J-30445172-0 (Registrado)',
    bankDescription: 'ANTICIPO RECIBIDO CLIENTES JURÍDICOS EXTRACTO BANESCO',
    amountVES: 20745000.00,
    bcvRate: 688.00,
    amountUSD: 30115.40,
    supportRef: 'COMP-ANT-RIP-2026-001',
    notes: 'Anticipo en bolívares a tasa oficial BCV para acopio de café en Venezuela.'
  },
  {
    id: 'ADV-JUR-02',
    category: 'PERSONA_JURIDICA',
    categoryLabel: 'Persona Jurídica (Empresa Cliente)',
    date: '19/06/2026',
    reference: '#00030445172',
    clientName: 'Empresa Cliente Torrefactora / Comercializadora Jurídica',
    clientRifCi: 'RIF J-30445172-0 (Registrado)',
    bankDescription: 'ANTICIPO EN VENTAS CLIENTES JURÍDICOS EXTRACTO BANESCO',
    amountVES: 35823999.24,
    bcvRate: 690.00,
    amountUSD: 51986.65,
    supportRef: 'COMP-ANT-RIP-2026-002',
    notes: 'Anticipo recibido en cuenta Banesco para compra de cosechas a caficultores.'
  },
  {
    id: 'ADV-JUR-03',
    category: 'PERSONA_JURIDICA',
    categoryLabel: 'Persona Jurídica (Empresa Cliente)',
    date: '09/07/2026',
    reference: '#00005995465',
    clientName: 'Empresa Cliente Torrefactora / Comercializadora Jurídica',
    clientRifCi: 'RIF J-00059954-6 (Registrado)',
    bankDescription: 'ANTICIPO RECIBIDO CLIENTES JURÍDICOS EXTRACTO BANESCO',
    amountVES: 11879549.00,
    bcvRate: 723.00,
    amountUSD: 16430.91,
    supportRef: 'COMP-ANT-RIP-2026-003',
    notes: 'Procura e intermediación de lotes de café verde en mercado nacional.'
  },
  {
    id: 'ADV-JUR-04',
    category: 'PERSONA_JURIDICA',
    categoryLabel: 'Persona Jurídica (Empresa Cliente)',
    date: '29/07/2026',
    reference: '#00016671975',
    clientName: 'Empresa Cliente Torrefactora / Comercializadora Jurídica',
    clientRifCi: 'RIF J-00166719-7 (Registrado)',
    bankDescription: 'ANTICIPO CLIENTES JURÍDICOS EXTRACTO BANESCO',
    amountVES: 67000000.97,
    bcvRate: 745.00,
    amountUSD: 93055.56,
    supportRef: 'COMP-ANT-RIP-2026-004',
    notes: 'Abonos en cuenta para compra de café a productores venezolanos.'
  },
  {
    id: 'ADV-JUR-05',
    category: 'PERSONA_JURIDICA',
    categoryLabel: 'Persona Jurídica (Empresa Cliente)',
    date: '06/08/2026',
    reference: '#0000000198',
    clientName: 'Empresa Cliente Torrefactora / Comercializadora Jurídica',
    clientRifCi: 'RIF J-00000198-0 (Registrado)',
    bankDescription: 'ANTICIPOS RECIBIDOS CLIENTES JURÍDICOS EXTRACTO BANESCO',
    amountVES: 97180000.00,
    bcvRate: 756.70,
    amountUSD: 131524.32,
    supportRef: 'COMP-ANT-RIP-2026-005',
    notes: 'Transferencias interbancarias para reserva de café verde nacional.'
  },
  {
    id: 'ADV-JUR-06',
    category: 'PERSONA_JURIDICA',
    categoryLabel: 'Persona Jurídica (Empresa Cliente)',
    date: '11/08/2026',
    reference: '#00030445172',
    clientName: 'Empresa Cliente Torrefactora / Comercializadora Jurídica',
    clientRifCi: 'RIF J-30445172-0 (Registrado)',
    bankDescription: 'ANTICIPOS RECIBIDOS CLIENTES JURÍDICOS EXTRACTO BANESCO',
    amountVES: 63750000.00,
    bcvRate: 764.35,
    amountUSD: 86148.65,
    supportRef: 'COMP-ANT-RIP-2026-006',
    notes: 'Fondeo de operaciones de abastecimiento de grano de café en Portuguesa y Lara.'
  },
  {
    id: 'ADV-JUR-07',
    category: 'PERSONA_JURIDICA',
    categoryLabel: 'Persona Jurídica (Empresa Cliente)',
    date: '31/08/2026',
    reference: '#000041945646',
    clientName: 'Empresa Cliente Torrefactora / Comercializadora Jurídica',
    clientRifCi: 'RIF J-04194564-6 (Registrado)',
    bankDescription: 'ANTICIPOS RECIBIDOS CLIENTES JURÍDICOS EXTRACTO BANESCO',
    amountVES: 126200000.00,
    bcvRate: 798.33,
    amountUSD: 165327.68,
    supportRef: 'COMP-ANT-RIP-2026-007',
    notes: 'Liquidación de compromisos de entrega de café para facturación en octubre.'
  },
  // CARTERA MAYORISTA BANESCO TORREFACTORAS (TRANS.CTAS MISMO BANCO)
  {
    id: 'ADV-TOR-01',
    category: 'TORREFACTORA_BANESCO',
    categoryLabel: 'Torrefactoras Banesco (Transf. Internas Mismo Banco)',
    date: '31/01/2026',
    reference: '#00262241728',
    clientName: 'Cartera Mayorista de Clientes Torrefactores Banesco (Enero)',
    clientRifCi: 'Cuentas Torrefactoras Banesco',
    bankDescription: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO ENERO 2026',
    amountVES: 14739197.00,
    bcvRate: 370.25,
    amountUSD: 43040.44,
    supportRef: 'COMP-ANT-BAN-2026-001',
    notes: 'Transferencias entre cuentas Banesco de clientes torrefactores.'
  },
  {
    id: 'ADV-TOR-02',
    category: 'TORREFACTORA_BANESCO',
    categoryLabel: 'Torrefactoras Banesco (Transf. Internas Mismo Banco)',
    date: '28/02/2026',
    reference: '#00358474634',
    clientName: 'Cartera Mayorista de Clientes Torrefactores Banesco (Febrero)',
    clientRifCi: 'Cuentas Torrefactoras Banesco',
    bankDescription: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO FEBRERO 2026',
    amountVES: 23673607.21,
    bcvRate: 419.99,
    amountUSD: 61956.57,
    supportRef: 'COMP-ANT-BAN-2026-002',
    notes: 'Anticipos recibidos de compradores industriales en Banesco.'
  },
  {
    id: 'ADV-TOR-03',
    category: 'TORREFACTORA_BANESCO',
    categoryLabel: 'Torrefactoras Banesco (Transf. Internas Mismo Banco)',
    date: '31/03/2026',
    reference: 'TRANS-MAR-2026',
    clientName: 'Cartera Mayorista de Clientes Torrefactores Banesco (Marzo)',
    clientRifCi: 'Cuentas Torrefactoras Banesco',
    bankDescription: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO MARZO 2026',
    amountVES: 2650000.00,
    bcvRate: 473.92,
    amountUSD: 6235.29,
    supportRef: 'COMP-ANT-BAN-2026-003',
    notes: 'Anticipos recibidos de cartera comercial Banesco.'
  },
  {
    id: 'ADV-TOR-04',
    category: 'TORREFACTORA_BANESCO',
    categoryLabel: 'Torrefactoras Banesco (Transf. Internas Mismo Banco)',
    date: '30/04/2026',
    reference: '#61205338957',
    clientName: 'Cartera Mayorista de Clientes Torrefactores Banesco (Abril)',
    clientRifCi: 'Cuentas Torrefactoras Banesco',
    bankDescription: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO ABRIL 2026',
    amountVES: 6874000.00,
    bcvRate: 489.55,
    amountUSD: 14365.73,
    supportRef: 'COMP-ANT-BAN-2026-004',
    notes: 'Anticipos recibidos de cartera comercial Banesco.'
  },
  {
    id: 'ADV-TOR-05',
    category: 'TORREFACTORA_BANESCO',
    categoryLabel: 'Torrefactoras Banesco (Transf. Internas Mismo Banco)',
    date: '31/05/2026',
    reference: 'TRANS-MAY-2026',
    clientName: 'Cartera Mayorista de Clientes Torrefactores Banesco (Mayo)',
    clientRifCi: 'Cuentas Torrefactoras Banesco',
    bankDescription: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO MAYO 2026',
    amountVES: 5625047.50,
    bcvRate: 554.43,
    amountUSD: 10317.40,
    supportRef: 'COMP-ANT-BAN-2026-005',
    notes: 'Anticipos comerciales Banesco para aprovisionamiento.'
  },
  {
    id: 'ADV-TOR-06',
    category: 'TORREFACTORA_BANESCO',
    categoryLabel: 'Torrefactoras Banesco (Transf. Internas Mismo Banco)',
    date: '30/06/2026',
    reference: '#00003344419',
    clientName: 'Cartera Mayorista de Clientes Torrefactores Banesco (Junio)',
    clientRifCi: 'Cuentas Torrefactoras Banesco',
    bankDescription: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO JUNIO 2026',
    amountVES: 296593784.00,
    bcvRate: 633.36,
    amountUSD: 462524.42,
    supportRef: 'COMP-ANT-BAN-2026-006',
    notes: 'Fondeo masivo de compras de café verde por tostadoras aliadas.'
  },
  {
    id: 'ADV-TOR-07',
    category: 'TORREFACTORA_BANESCO',
    categoryLabel: 'Torrefactoras Banesco (Transf. Internas Mismo Banco)',
    date: '31/07/2026',
    reference: 'TRANS-JUL-2026',
    clientName: 'Cartera Mayorista de Clientes Torrefactores Banesco (Julio)',
    clientRifCi: 'Cuentas Torrefactoras Banesco',
    bankDescription: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO JULIO 2026',
    amountVES: 386791318.30,
    bcvRate: 748.79,
    amountUSD: 570152.30,
    supportRef: 'COMP-ANT-BAN-2026-007',
    notes: 'Depósitos de clientes en cuenta corriente Banesco.'
  },
  {
    id: 'ADV-TOR-08',
    category: 'TORREFACTORA_BANESCO',
    categoryLabel: 'Torrefactoras Banesco (Transf. Internas Mismo Banco)',
    date: '31/08/2026',
    reference: 'TRANS-AGO-2026',
    clientName: 'Cartera Mayorista de Clientes Torrefactores Banesco (Agosto)',
    clientRifCi: 'Cuentas Torrefactoras Banesco',
    bankDescription: 'TRANS.CTAS CLIENTES MAYORISTAS MISMO BANCO BANESCO AGOSTO 2026',
    amountVES: 276491589.40,
    bcvRate: 798.33,
    amountUSD: 375813.64,
    supportRef: 'COMP-ANT-BAN-2026-008',
    notes: 'Cierre de ciclo de anticipos recibidos para despacho en octubre.'
  }
];

// =========================================================================
// 8.B. TABLA OFICIAL: COMPOSICIÓN DE SALIDAS O CARGOS POR CONCEPTO Y MES (BS) - ENERO A AGOSTO 2026
// =========================================================================
export interface MonthlyOutflowRow {
  id: string;
  concepto: string;
  category: 'CUENTAS_PROPIAS' | 'MUTUO_BECERRA' | 'PROVEEDORES_CAFE' | 'FLETES_LOGISTICA' | 'PERSONAL_CAMPO' | 'CUENTAS_COBRAR_SOCIOS' | 'COMISIONES_IGTF';
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

export const BANESCO_MONTHLY_DEBIT_OUTFLOW_COMPOSITION_2026: {
  rows: MonthlyOutflowRow[];
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
      id: 'OUT-01',
      concepto: 'Transferencias Interbancarias entre Cuentas Propias (Provincial, Mercantil, Plaza, Bancamiga)',
      category: 'CUENTAS_PROPIAS',
      ene: 500000.00,
      feb: 600000.00,
      mar: 1110000.00,
      abr: 2000000.00,
      may: 0.00,
      jun: 38400000.00,
      jul: 42100000.00,
      ago: 68500000.00,
      totalBs: 153210000.00,
      pctDelTotal: 7.8,
      totalUSD: 226910.30,
      auditExplanation: 'Fondeo de tesorería institucional enviado desde Banesco a cuentas propias de la misma empresa AGRÍCOLA ONI C.A. (RIF J-50145638-0) en Banco Provincial, Mercantil, Plaza y Bancamiga.',
      legalClassification: 'Transferencias Internas de Tesorería en Tránsito (Efecto Neto Patrimonial: Bs. 0,00). NO ES EGRESO A TERCEROS.'
    },
    {
      id: 'OUT-02',
      concepto: 'Amortización de Capital Línea de Crédito Rotativa Becerra (Socio/Tercero)',
      category: 'MUTUO_BECERRA',
      ene: 0.00,
      feb: 0.00,
      mar: 0.00,
      abr: 0.00,
      may: 4500000.00,
      jun: 61200000.00,
      jul: 76800000.00,
      ago: 38900000.00,
      totalBs: 181400000.00,
      pctDelTotal: 9.3,
      totalUSD: 278450.00,
      auditExplanation: 'Devolución de capital y amortizaciones de la Línea de Crédito Rotativa de Bs. 600M desembolsada por el socio Manuel Becerra para soporte de liquidez.',
      legalClassification: 'Disminución de Pasivo Financiero con Terceros / Amortización Préstamo Mutuo Becerra (Pasivo Corriente).'
    },
    {
      id: 'OUT-03',
      concepto: 'Procura de Café y Pagos a Proveedores por Cuenta de Clientes (Intermediación Comercial)',
      category: 'PROVEEDORES_CAFE',
      ene: 8500000.00,
      feb: 12200000.00,
      mar: 1500000.00,
      abr: 3520000.00,
      may: 28000000.00,
      jun: 298450000.00,
      jul: 412300000.00,
      ago: 396800000.00,
      totalBs: 1161270000.00,
      pctDelTotal: 59.3,
      totalUSD: 1718440.12,
      auditExplanation: 'Transferencias bancarias a comercializadoras primarias y productores venezolanos para la procura de café gestionada por cuenta de clientes torrefactores.',
      legalClassification: 'Aplicación de Fondos por Cuenta de Clientes / Procura de Café Intermediada en Venezuela (Disminución de Anticipos Recibidos de Clientes NIIF 15).'
    },
    {
      id: 'OUT-04',
      concepto: 'Costo Logístico de Fletes Terrestres, Almacenaje, Aduana y Guías SICA/INSAI',
      category: 'FLETES_LOGISTICA',
      ene: 2100000.00,
      feb: 3400000.00,
      mar: 450000.00,
      abr: 845000.00,
      may: 3200000.00,
      jun: 11200000.00,
      jul: 12800000.00,
      ago: 11500000.00,
      totalBs: 45495000.00,
      pctDelTotal: 2.3,
      totalUSD: 67380.15,
      auditExplanation: 'Pago de fletes terrestres de transporte pesado desde zonas cafeteras a galpones de acopio en Portuguesa y Lara, almacenaje y permisos fitosanitarios.',
      legalClassification: 'Gastos Operacionales Directos / Fletes Terrestres Sujetos a Retención ISLR 3% (Decreto 1.808).'
    },
    {
      id: 'OUT-05',
      concepto: 'Gastos de Personal Rural, Vigilancia LOTTT, Caleta y Pago Móvil de Campo',
      category: 'PERSONAL_CAMPO',
      ene: 650000.00,
      feb: 820000.00,
      mar: 210000.00,
      abr: 324000.00,
      may: 1100000.00,
      jun: 3100000.00,
      jul: 3400000.00,
      ago: 3300000.00,
      totalBs: 12904000.00,
      pctDelTotal: 0.7,
      totalUSD: 19412.80,
      auditExplanation: 'Desembolsos por cuadrillas de caleteros en patios de secado, vigilancia de fincas y pagos móviles inmediatos a recolectores de café en campo.',
      legalClassification: 'Gastos de Personal Operativo Rural LOTTT y Servicios Directos de Campo.'
    },
    {
      id: 'OUT-06',
      concepto: 'Préstamos y Avances al Accionista Propietario (Ing. Omar Pérez C.I. V-14.892.301)',
      category: 'CUENTAS_COBRAR_SOCIOS',
      ene: 3200000.00,
      feb: 7100000.00,
      mar: 350000.00,
      abr: 580000.00,
      may: 2100000.00,
      jun: 112500000.00,
      jul: 128400000.00,
      ago: 121400000.00,
      totalBs: 375630000.00,
      pctDelTotal: 19.2,
      totalUSD: 556890.45,
      auditExplanation: 'Transferencias enviadas desde Banesco a la cuenta personal del accionista mayoritario Ing. Omar Pérez por concepto de adelantos y préstamos corporativos.',
      legalClassification: 'Cuentas por Cobrar Socios (Activo Corriente). No constituye dividendo ni remuneración personal.'
    },
    {
      id: 'OUT-07',
      concepto: 'Gastos Financieros, Comisiones Bancarias Banesco y Débitos Automáticos IGTF 3%',
      category: 'COMISIONES_IGTF',
      ene: 413197.00,
      feb: 773607.21,
      mar: 122830.57,
      abr: 196434.16,
      may: 602813.30,
      jun: 8783983.96,
      jul: 10391318.31,
      ago: 5467029.44,
      totalBs: 26751113.95,
      pctDelTotal: 1.4,
      totalUSD: 39618.42,
      auditExplanation: 'Comisiones bancarias Banesco por emisión de transferencias, mantenimiento de cuenta, Pago Móvil CCE y percepción automática de IGTF 3% SENIAT.',
      legalClassification: 'Gastos Financieros y Deducciones Tributarias Legales.'
    }
  ],
  totals: {
    ene: 15363197.00,
    feb: 24893607.21,
    mar: 3742830.57,
    abr: 7465434.16,
    may: 39502813.30,
    jun: 533633983.96,
    jul: 686191318.31,
    ago: 645867029.44,
    totalBs: 1956660113.95,
    pctDelTotal: 100.0,
    totalUSD: 2897684.28
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
  periodSubTitle: 'Desde el 01 de Enero de 2026 hasta el 31 de Agosto de 2026 (Incluye Operaciones Banesco)',
  comparativeBaseDate: '31 de Diciembre de 2025',
  exchangeRateBCV: 794.99,
  rows: [
    {
      code: '1.1.01',
      accountName: 'Efectivo y Bancos (Banesco Cta. Cte. y Caja Chica)',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 2418532.47, creditVES: 0.00 },
      movements2026: { debitVES: 1966597105.35, creditVES: 1956660113.95 },
      finalBalance2026: { debitVES: 12355523.87, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 15541.74, creditUSD: 0.00 }
    },
    {
      code: '1.1.02',
      accountName: 'Cuentas por Cobrar Comerciales Clientes (Corte 31/12/2025 cobradas en 2026)',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 53109051.79, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 53109051.79 },
      finalBalance2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 0.00 }
    },
    {
      code: '1.1.03',
      accountName: 'Cuentas por Cobrar Socios - Transferencias Corporativas Banesco (Elías Rafael Trías Abreu V-23.997.829)',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 375630000.00, creditVES: 0.00 },
      finalBalance2026: { debitVES: 375630000.00, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 472496.51, creditUSD: 0.00 }
    },
    {
      code: '1.1.04',
      accountName: 'Cuentas por Cobrar Socios - Contrato Mutuo y Financiamiento Manuel Becerra',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 512324652.96, creditVES: 186376000.00 },
      finalBalance2026: { debitVES: 325948652.96, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 410003.46, creditUSD: 0.00 }
    },
    {
      code: '1.1.05',
      accountName: 'Retenciones ISLR por Cobrar a Clientes Retenidas',
      category: 'ACTIVO',
      initialBalance2025: { debitVES: 661181.94, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalance2026: { debitVES: 661181.94, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 831.69, creditUSD: 0.00 }
    },
    {
      code: '1.1.06',
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
      accountName: 'Anticipos Recibidos de Clientes (NIIF 15 - Torrefactoras y Clientes Jurídicos Banesco)',
      category: 'PASIVO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 1262634322.45, creditVES: 1563863072.62 },
      finalBalance2026: { debitVES: 0.00, creditVES: 301228750.17 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 378908.85 }
    },
    {
      code: '2.1.02',
      accountName: 'Retención de ISLR por Pagar (Originada por Anticipos de Clientes 2% Decreto 1808)',
      category: 'PASIVO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 31277261.45 },
      finalBalance2026: { debitVES: 0.00, creditVES: 31277261.45 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 39342.96 }
    },
    {
      code: '2.1.03',
      accountName: 'Cuentas por Pagar Socios (Aportes Accionista Elias Rafael Trías Abreu V-23.997.829 / Omar Pérez)',
      category: 'PASIVO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 301053109.62 },
      finalBalance2026: { debitVES: 0.00, creditVES: 301053109.62 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 378687.92 }
    },
    {
      code: '2.1.04',
      accountName: 'ISLR por Pagar / Provisiones Tributarias',
      category: 'PASIVO',
      initialBalance2025: { debitVES: 0.00, creditVES: 1395745.15 },
      movements2026: { debitVES: 1395745.15, creditVES: 696202.38 },
      finalBalance2026: { debitVES: 0.00, creditVES: 696202.38 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 875.74 }
    },
    {
      code: '2.1.05',
      accountName: 'IGTF 3% Efectivo Divisas por Pagar (Derogado 2% Transferencias Bancarias per Gaceta 6.821)',
      category: 'PASIVO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalance2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 0.00 }
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
      accountName: 'Ganancia Neta Ejercicio 2025 (Trasladada a Superávit Acumulado)',
      category: 'PATRIMONIO',
      initialBalance2025: { debitVES: 0.00, creditVES: 2712793.94 },
      movements2026: { debitVES: 2712793.94, creditVES: 0.00 },
      finalBalance2026: { debitVES: 0.00, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 0.00, creditUSD: 0.00 }
    },
    {
      code: '3.3.01',
      accountName: 'Reserva Legal Cumplida (10% Capital Social)',
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
      accountName: 'Gastos Financieros y Comisiones Bancarias Banesco',
      category: 'EGRESO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 26751113.95, creditVES: 0.00 },
      finalBalance2026: { debitVES: 26751113.95, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 33649.62, creditUSD: 0.00 }
    },
    {
      code: '5.1.02',
      accountName: 'Costos Operacionales y Servicios Agrícolas',
      category: 'EGRESO',
      initialBalance2025: { debitVES: 0.00, creditVES: 0.00 },
      movements2026: { debitVES: 39950780.45, creditVES: 0.00 },
      finalBalance2026: { debitVES: 39950780.45, creditVES: 0.00 },
      finalBalanceUSD: { debitUSD: 50253.19, creditUSD: 0.00 }
    }
  ],
  totals: {
    initialDebitVES: 84646023.41,
    initialCreditVES: 84646023.41,
    movementsDebitVES: 4188389125.76,
    movementsCreditVES: 4188389125.76,
    finalDebitVES: 810147121.89,
    finalCreditVES: 810147121.89,
    finalDebitUSD: 1019065.80,
    finalCreditUSD: 1019065.80
  }
};


