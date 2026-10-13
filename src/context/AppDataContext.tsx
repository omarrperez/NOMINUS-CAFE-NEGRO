import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AccountingVoucher,
  RetentionVoucherSummary,
  AGRICOLA_ONI_VOUCHERS_2026,
  RETENTION_VOUCHERS_SUMMARY
} from '../data/agricolaOniAccountingVouchers2026Data';
import {
  BanescoMovementAudit,
  BANESCO_MOVEMENTS_AUDIT_2026
} from '../data/agricolaOniAudit2026Data';

export interface CustomerAdvance {
  id: string;
  advanceNumber: string;
  date: string;
  clientName: string;
  clientRif: string;
  amountVES: number;
  countervalueUSD: number;
  bcvRate: number;
  coffeeVolumeTargetQtl: number;
  bankReference: string;
  status: 'RECIBIDO' | 'EN_PROCURA_NACIONAL' | 'CAFE_ACOPIADO_VE' | 'FACTURADO_OCTUBRE';
  notes?: string;
}

export interface BanescoFxPurchase {
  id: string;
  purchaseNumber: string;
  date: string;
  banescoDebitVES: number;
  exchangeRate: number;
  usdCredited: number;
  banescoCommissionVES: number;
  banescoRef: string;
  destinationPurpose: 'PAGO_INSUMOS_MAQUINARIA_VE' | 'FLETE_TRANSPORTE_NACIONAL' | 'SERVICIOS_AGROINDUSTRIALES_VE';
  notes?: string;
}

export interface NationalCoffeeBatchPurchase {
  id: string;
  batchCode?: string;
  date: string;
  supplierName: string;
  supplierRif?: string;
  locationState?: string; // Portuguesa, Lara, Mérida, Táchira
  coffeeVariety: string;
  volumeQtl: number;
  pricePerQtlUSD?: number;
  totalAmountUSD?: number;
  totalAmountVES?: number;
  bcvRate?: number;
  sicaPermitNumber?: string;
  cvcPermit?: string;
  nationalFreightVES?: number;
  status: 'CONTRATO_FUTURO' | 'EN_RECOLECCION' | 'ACOPIADO_EN_ALMACEN' | 'DESPACHADO_OCTUBRE' | 'NACIONALIZADO_EN_ALMACEN';
  // Legacy aliases for backward compatibility
  shipmentCode?: string;
  supplierNit?: string;
  originCountry?: string;
  totalInvoiceUSD?: number;
  invoiceCommercialRef?: string;
  duaSeniatNumber?: string;
  insaiPermit?: string;
  internationalFreightUSD?: number;
  customsCostsUSD?: number;
}

// Alias for backward compatibility
export type ImportShipmentColombia = NationalCoffeeBatchPurchase;

export interface OctoberInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientRif: string;
  coffeeVolumeQtl: number;
  totalInvoiceVES: number;
  totalInvoiceUSD: number;
  amortizedAdvanceVES: number;
  balanceDueVES: number;
  associatedAdvanceId?: string;
  status: 'FACTURADO' | 'ENTREGADO';
}

export interface WorkerPayrollItem {
  id: string;
  name: string;
  cedula: string;
  role: string;
  department: 'VIGILANCIA' | 'ADMINISTRACION' | 'ALMACEN_LOGISTICA' | 'ADUANA_TRANSPORTE';
  banescoAccount: string;
  baseSalaryUSD: number;
  attendanceBonusUSD: number;
  nightShiftHours: number;
  daexPermit?: string;
  status: 'ACTIVO' | 'DE_GUARDIA';
}

export interface PettyCashEntry {
  id: string;
  date: string;
  voucher: string;
  concept: string;
  responsible: string;
  amountUSD: number;
  amountVES: number;
  type: 'EGRESO' | 'REPOSICION';
  receiptRef: string;
}

export interface CoffeeReceiptRecord {
  id: string;
  receiptNumber: string;
  date: string;
  producerName: string;
  producerId: string;
  farmLocation: string;
  coffeeType: string;
  sacksCount: number;
  weightKg: number;
  quintales: number;
  humidityPct: number;
  priceUSDPerQtl: number;
  subtotalUSD: number;
  advanceDeductionUSD: number;
  netUSD: number;
  netVES: number;
  bcvRate: number;
}

export interface LegalContractRecord {
  id: string;
  code: string;
  title: string;
  parties: string;
  date: string;
  type: 'MERCANTIL' | 'SEGURIDAD' | 'AGROINDUSTRIAL' | 'LABORAL';
  summary: string;
  clauses: { title: string; content: string }[];
}

interface AppDataContextType {
  // Model Collections
  customerAdvances: CustomerAdvance[];
  fxPurchases: BanescoFxPurchase[];
  importShipments: ImportShipmentColombia[];
  octoberInvoices: OctoberInvoice[];
  vouchers: AccountingVoucher[];
  retentions: RetentionVoucherSummary[];
  bankMovements: BanescoMovementAudit[];
  workers: WorkerPayrollItem[];
  pettyCash: PettyCashEntry[];
  receipts: CoffeeReceiptRecord[];
  contracts: LegalContractRecord[];

  // Action methods
  addCustomerAdvance: (adv: CustomerAdvance) => void;
  deleteCustomerAdvance: (id: string) => void;
  addFxPurchase: (fx: BanescoFxPurchase) => void;
  deleteFxPurchase: (id: string) => void;
  addImportShipment: (imp: ImportShipmentColombia) => void;
  deleteImportShipment: (id: string) => void;
  addOctoberInvoice: (inv: OctoberInvoice) => void;
  deleteOctoberInvoice: (id: string) => void;

  addVoucher: (voucher: AccountingVoucher) => void;
  deleteVoucher: (id: string) => void;
  addBankMovement: (mov: BanescoMovementAudit) => void;
  deleteBankMovement: (id: string) => void;
  addWorker: (worker: WorkerPayrollItem) => void;
  deleteWorker: (id: string) => void;
  addPettyCash: (item: PettyCashEntry) => void;
  addReceipt: (receipt: CoffeeReceiptRecord) => void;
  addContract: (contract: LegalContractRecord) => void;
  clearAllDatabase: () => void;
  importFullDatabase: (jsonData: any) => boolean;
  exportDatabaseJSON: () => string;
}

export const DEFAULT_CUSTOMER_ADVANCES_2026: CustomerAdvance[] = [
  {
    id: 'ADV-2026-001',
    advanceNumber: 'ANT-2026-001',
    date: '2026-06-16',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #00033005568',
    clientRif: 'S/N EN EXTRACTO BANCO',
    amountVES: 20745000,
    countervalueUSD: 30115.40,
    bcvRate: 688.00,
    coffeeVolumeTargetQtl: 500,
    bankReference: '#00033005568',
    status: 'CAFE_ACOPIADO_VE',
    notes: 'Abono recibido en Banesco por transferencia (Ref. #00033005568). Registrado como anticipo en bolívares a tasa BCV para acopio de café en Venezuela. Sustitución con factura de venta en octubre.'
  },
  {
    id: 'ADV-2026-002',
    advanceNumber: 'ANT-2026-002',
    date: '2026-06-19',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #00058529036',
    clientRif: 'S/N EN EXTRACTO BANCO',
    amountVES: 35823999.24,
    countervalueUSD: 51986.65,
    bcvRate: 690.00,
    coffeeVolumeTargetQtl: 850,
    bankReference: '#00058529036',
    status: 'CAFE_ACOPIADO_VE',
    notes: 'Anticipo de cliente jurídico por transferencia bancaria (Ref. #00058529036). Procura y acopio de café verde nacional.'
  },
  {
    id: 'ADV-2026-003',
    advanceNumber: 'ANT-2026-003',
    date: '2026-07-09',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #00005995465',
    clientRif: 'S/N EN EXTRACTO BANCO',
    amountVES: 11879549,
    countervalueUSD: 16430.91,
    bcvRate: 723.00,
    coffeeVolumeTargetQtl: 280,
    bankReference: '#00005995465',
    status: 'CAFE_ACOPIADO_VE',
    notes: 'Fondos de clientes para intermediación y compra de lotes de café en el mercado venezolano a tasa BCV.'
  },
  {
    id: 'ADV-2026-004',
    advanceNumber: 'ANT-2026-004',
    date: '2026-07-29',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #00016671975',
    clientRif: 'S/N EN EXTRACTO BANCO',
    amountVES: 67000000.97,
    countervalueUSD: 93055.56,
    bcvRate: 745.00,
    coffeeVolumeTargetQtl: 1500,
    bankReference: '#00016671975',
    status: 'CAFE_ACOPIADO_VE',
    notes: 'Abonos en cuenta corriente por transferencia Banesco para adquisición de cosecha cafetalera venezolana.'
  },
  {
    id: 'ADV-2026-005',
    advanceNumber: 'ANT-2026-005',
    date: '2026-08-06',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #0000000198',
    clientRif: 'S/N EN EXTRACTO BANCO',
    amountVES: 97180000,
    countervalueUSD: 131524.32,
    bcvRate: 756.70,
    coffeeVolumeTargetQtl: 2100,
    bankReference: '#0000000198',
    status: 'CAFE_ACOPIADO_VE',
    notes: 'Lotes de transferencias interbancarias según extracto Banesco para reserva de café nacional en Portuguesa y Lara.'
  },
  {
    id: 'ADV-2026-006',
    advanceNumber: 'ANT-2026-006',
    date: '2026-08-11',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #00030445172',
    clientRif: 'S/N EN EXTRACTO BANCO',
    amountVES: 63750000,
    countervalueUSD: 86148.65,
    bcvRate: 764.35,
    coffeeVolumeTargetQtl: 1400,
    bankReference: '#00030445172',
    status: 'CAFE_ACOPIADO_VE',
    notes: 'Fondeo de operaciones de abastecimiento de grano de café en centros de acopio nacionales.'
  },
  {
    id: 'ADV-2026-007',
    advanceNumber: 'ANT-2026-007',
    date: '2026-08-31',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #000041945646',
    clientRif: 'S/N EN EXTRACTO BANCO',
    amountVES: 126200000,
    countervalueUSD: 165327.68,
    bcvRate: 798.33,
    coffeeVolumeTargetQtl: 2650,
    bankReference: '#000041945646',
    status: 'CAFE_ACOPIADO_VE',
    notes: 'Compromiso de entrega de café acopiado en Venezuela para despacho y facturación de venta definitiva en octubre.'
  }
];

export const DEFAULT_BANESCO_FX_PURCHASES_2026: BanescoFxPurchase[] = [
  {
    id: 'FX-2026-001',
    purchaseNumber: 'OP-CAMBIO-001',
    date: '2026-02-15',
    banescoDebitVES: 48500000,
    exchangeRate: 404.54,
    usdCredited: 119890.00,
    banescoCommissionVES: 242500,
    banescoRef: 'PACTO-MC-2026-0214',
    destinationPurpose: 'PAGO_INSUMOS_MAQUINARIA_VE',
    notes: 'Mesa de Cambio Banesco. Compra autorizada para insumos y repuestos agroindustriales en Portuguesa.'
  },
  {
    id: 'FX-2026-002',
    purchaseNumber: 'OP-CAMBIO-002',
    date: '2026-04-30',
    banescoDebitVES: 52410000,
    exchangeRate: 489.58,
    usdCredited: 107050.00,
    banescoCommissionVES: 262050,
    banescoRef: 'PACTO-MC-2026-0489',
    destinationPurpose: 'PAGO_INSUMOS_MAQUINARIA_VE',
    notes: 'Mesa de Cambio Banesco. Adquisición de tolvas y mantenimiento de despulpadora en Venezuela.'
  },
  {
    id: 'FX-2026-003',
    purchaseNumber: 'OP-CAMBIO-003',
    date: '2026-06-15',
    banescoDebitVES: 85200000,
    exchangeRate: 631.11,
    usdCredited: 135000.00,
    banescoCommissionVES: 426000,
    banescoRef: 'PACTO-MC-2026-0631',
    destinationPurpose: 'PAGO_INSUMOS_MAQUINARIA_VE',
    notes: 'Intervención Cambiaria BCV / Banesco. Acondicionamiento de galpones y secadoras de café en Araure.'
  },
  {
    id: 'FX-2026-004',
    purchaseNumber: 'OP-CAMBIO-004',
    date: '2026-07-20',
    banescoDebitVES: 92320000,
    exchangeRate: 727.79,
    usdCredited: 126850.45,
    banescoCommissionVES: 461600,
    banescoRef: 'PACTO-MC-2026-0728',
    destinationPurpose: 'FLETE_TRANSPORTE_NACIONAL',
    notes: 'Mesa de Cambio Banesco. Flete terrestre nacional y logística de gandolas desde zonas cafetaleras.'
  },
  {
    id: 'FX-2026-005',
    purchaseNumber: 'OP-CAMBIO-005',
    date: '2026-08-28',
    banescoDebitVES: 97200000,
    exchangeRate: 797.80,
    usdCredited: 68100.00,
    banescoCommissionVES: 486000,
    banescoRef: 'PACTO-MC-2026-0814',
    destinationPurpose: 'SERVICIOS_AGROINDUSTRIALES_VE',
    notes: 'Mesa de Cambio Banesco. Servicios de laboratorio cafetalero, pesaje y custodia remanente en cuenta.'
  }
];

export const DEFAULT_IMPORT_SHIPMENTS_2026: ImportShipmentColombia[] = [
  {
    id: 'LOTE-VE-2026-001',
    shipmentCode: 'LOTE-VE-2026-001',
    date: '2026-05-20',
    supplierName: 'Productores Agrícolas Nacionales (Zona Unda - Chabasquén)',
    supplierNit: 'RIF: Productores Nacionales',
    originCountry: 'Venezuela (Portuguesa)',
    coffeeVariety: 'Café Arábica Pergamino Lavado Variedad Caturra/Bourbon',
    volumeQtl: 2500,
    totalInvoiceUSD: 155000,
    invoiceCommercialRef: 'CONTR-PROCURA-UNDA-001',
    duaSeniatNumber: 'GUIA-SICA-VE-2026-004128',
    insaiPermit: 'CVC-GUIA-NAC-2026-904',
    internationalFreightUSD: 23400,
    customsCostsUSD: 12000,
    status: 'NACIONALIZADO_EN_ALMACEN'
  },
  {
    id: 'LOTE-VE-2026-002',
    shipmentCode: 'LOTE-VE-2026-002',
    date: '2026-07-15',
    supplierName: 'Productores Agrícolas Nacionales (Zona Biscucuy)',
    supplierNit: 'RIF: Productores Nacionales',
    originCountry: 'Venezuela (Portuguesa)',
    coffeeVariety: 'Café Arábica Grano Oro Calidad Gourmet',
    volumeQtl: 3000,
    totalInvoiceUSD: 180000,
    invoiceCommercialRef: 'CONTR-PROCURA-BISC-002',
    duaSeniatNumber: 'GUIA-SICA-VE-2026-005891',
    insaiPermit: 'CVC-GUIA-NAC-2026-1180',
    internationalFreightUSD: 26800,
    customsCostsUSD: 14000,
    status: 'NACIONALIZADO_EN_ALMACEN'
  },
  {
    id: 'LOTE-VE-2026-003',
    shipmentCode: 'LOTE-VE-2026-003',
    date: '2026-08-25',
    supplierName: 'Productores Agrícolas Nacionales (Zona Sanare / Lara)',
    supplierNit: 'RIF: Productores Nacionales',
    originCountry: 'Venezuela (Lara)',
    coffeeVariety: 'Café Arábica Pergamino Fino Típica',
    volumeQtl: 2000,
    totalInvoiceUSD: 110000,
    invoiceCommercialRef: 'CONTR-PROCURA-LARA-003',
    duaSeniatNumber: 'GUIA-SICA-VE-2026-007204',
    insaiPermit: 'CVC-GUIA-NAC-2026-1402',
    internationalFreightUSD: 17180.15,
    customsCostsUSD: 9000,
    status: 'ACOPIADO_EN_ALMACEN'
  }
];

export const DEFAULT_OCTOBER_INVOICES_2026: OctoberInvoice[] = [
  {
    id: 'INV-OCT-001',
    invoiceNumber: 'FAC-OCT-2026-001',
    date: '2026-10-05',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #00033005568',
    clientRif: 'S/N EN EXTRACTO BANCO',
    coffeeVolumeQtl: 500,
    totalInvoiceVES: 20745000,
    totalInvoiceUSD: 30115.40,
    amortizedAdvanceVES: 20745000,
    balanceDueVES: 0,
    associatedAdvanceId: 'ADV-2026-001',
    status: 'FACTURADO'
  },
  {
    id: 'INV-OCT-002',
    invoiceNumber: 'FAC-OCT-2026-002',
    date: '2026-10-08',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #00058529036',
    clientRif: 'S/N EN EXTRACTO BANCO',
    coffeeVolumeQtl: 850,
    totalInvoiceVES: 35823999.24,
    totalInvoiceUSD: 51986.65,
    amortizedAdvanceVES: 35823999.24,
    balanceDueVES: 0,
    associatedAdvanceId: 'ADV-2026-002',
    status: 'FACTURADO'
  },
  {
    id: 'INV-OCT-003',
    invoiceNumber: 'FAC-OCT-2026-003',
    date: '2026-10-12',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #00016671975',
    clientRif: 'S/N EN EXTRACTO BANCO',
    coffeeVolumeQtl: 1500,
    totalInvoiceVES: 67000000.97,
    totalInvoiceUSD: 93055.56,
    amortizedAdvanceVES: 67000000.97,
    balanceDueVES: 0,
    associatedAdvanceId: 'ADV-2026-004',
    status: 'FACTURADO'
  },
  {
    id: 'INV-OCT-004',
    invoiceNumber: 'FAC-OCT-2026-004',
    date: '2026-10-15',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #0000000198',
    clientRif: 'S/N EN EXTRACTO BANCO',
    coffeeVolumeQtl: 2100,
    totalInvoiceVES: 97180000,
    totalInvoiceUSD: 131524.32,
    amortizedAdvanceVES: 97180000,
    balanceDueVES: 0,
    associatedAdvanceId: 'ADV-2026-005',
    status: 'FACTURADO'
  },
  {
    id: 'INV-OCT-005',
    invoiceNumber: 'FAC-OCT-2026-005',
    date: '2026-10-20',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #00030445172',
    clientRif: 'S/N EN EXTRACTO BANCO',
    coffeeVolumeQtl: 1400,
    totalInvoiceVES: 63750000,
    totalInvoiceUSD: 86148.65,
    amortizedAdvanceVES: 63750000,
    balanceDueVES: 0,
    associatedAdvanceId: 'ADV-2026-006',
    status: 'FACTURADO'
  },
  {
    id: 'INV-OCT-006',
    invoiceNumber: 'FAC-OCT-2026-006',
    date: '2026-10-25',
    clientName: 'CLIENTE JURÍDICO - DESCRIPCIÓN BANESCO #000041945646',
    clientRif: 'S/N EN EXTRACTO BANCO',
    coffeeVolumeQtl: 2650,
    totalInvoiceVES: 126200000,
    totalInvoiceUSD: 165327.68,
    amortizedAdvanceVES: 126200000,
    balanceDueVES: 0,
    associatedAdvanceId: 'ADV-2026-007',
    status: 'FACTURADO'
  }
];

const STORAGE_KEY = 'NOMINUS_DATABASE_PROD_2026';

const AppDataContext = createContext<AppDataContextType | null>(null);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // New Intermediary & Importer collections populated with official 2026 operations
  const [customerAdvances, setCustomerAdvances] = useState<CustomerAdvance[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_customerAdvances`);
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && parsed.length > 0 ? parsed : DEFAULT_CUSTOMER_ADVANCES_2026;
    } catch {
      return DEFAULT_CUSTOMER_ADVANCES_2026;
    }
  });

  const [fxPurchases, setFxPurchases] = useState<BanescoFxPurchase[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_fxPurchases`);
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && parsed.length > 0 ? parsed : DEFAULT_BANESCO_FX_PURCHASES_2026;
    } catch {
      return DEFAULT_BANESCO_FX_PURCHASES_2026;
    }
  });

  const [importShipments, setImportShipments] = useState<ImportShipmentColombia[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_importShipments`);
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && parsed.length > 0 ? parsed : DEFAULT_IMPORT_SHIPMENTS_2026;
    } catch {
      return DEFAULT_IMPORT_SHIPMENTS_2026;
    }
  });

  const [octoberInvoices, setOctoberInvoices] = useState<OctoberInvoice[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_octoberInvoices`);
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && parsed.length > 0 ? parsed : DEFAULT_OCTOBER_INVOICES_2026;
    } catch {
      return DEFAULT_OCTOBER_INVOICES_2026;
    }
  });

  // Base collections populated with official Agricola Oni 2026 accounting records
  const [vouchers, setVouchers] = useState<AccountingVoucher[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_vouchers`);
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && parsed.length > 0 ? parsed : AGRICOLA_ONI_VOUCHERS_2026;
    } catch {
      return AGRICOLA_ONI_VOUCHERS_2026;
    }
  });

  const [retentions, setRetentions] = useState<RetentionVoucherSummary[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_retentions`);
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && parsed.length > 0 ? parsed : RETENTION_VOUCHERS_SUMMARY;
    } catch {
      return RETENTION_VOUCHERS_SUMMARY;
    }
  });

  const [bankMovements, setBankMovements] = useState<BanescoMovementAudit[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_bankMovements`);
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && parsed.length > 0 ? parsed : BANESCO_MOVEMENTS_AUDIT_2026;
    } catch {
      return BANESCO_MOVEMENTS_AUDIT_2026;
    }
  });

  const [workers, setWorkers] = useState<WorkerPayrollItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_workers`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pettyCash, setPettyCash] = useState<PettyCashEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pettyCash`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [receipts, setReceipts] = useState<CoffeeReceiptRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_receipts`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [contracts, setContracts] = useState<LegalContractRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_contracts`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage sync
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_customerAdvances`, JSON.stringify(customerAdvances));
      localStorage.setItem(`${STORAGE_KEY}_fxPurchases`, JSON.stringify(fxPurchases));
      localStorage.setItem(`${STORAGE_KEY}_importShipments`, JSON.stringify(importShipments));
      localStorage.setItem(`${STORAGE_KEY}_octoberInvoices`, JSON.stringify(octoberInvoices));
      localStorage.setItem(`${STORAGE_KEY}_vouchers`, JSON.stringify(vouchers));
      localStorage.setItem(`${STORAGE_KEY}_retentions`, JSON.stringify(retentions));
      localStorage.setItem(`${STORAGE_KEY}_bankMovements`, JSON.stringify(bankMovements));
      localStorage.setItem(`${STORAGE_KEY}_workers`, JSON.stringify(workers));
      localStorage.setItem(`${STORAGE_KEY}_pettyCash`, JSON.stringify(pettyCash));
      localStorage.setItem(`${STORAGE_KEY}_receipts`, JSON.stringify(receipts));
      localStorage.setItem(`${STORAGE_KEY}_contracts`, JSON.stringify(contracts));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
    }
  }, [customerAdvances, fxPurchases, importShipments, octoberInvoices, vouchers, retentions, bankMovements, workers, pettyCash, receipts, contracts]);

  const addCustomerAdvance = (adv: CustomerAdvance) => setCustomerAdvances(prev => [adv, ...prev]);
  const deleteCustomerAdvance = (id: string) => setCustomerAdvances(prev => prev.filter(a => a.id !== id));

  const addFxPurchase = (fx: BanescoFxPurchase) => setFxPurchases(prev => [fx, ...prev]);
  const deleteFxPurchase = (id: string) => setFxPurchases(prev => prev.filter(f => f.id !== id));

  const addImportShipment = (imp: ImportShipmentColombia) => setImportShipments(prev => [imp, ...prev]);
  const deleteImportShipment = (id: string) => setImportShipments(prev => prev.filter(i => i.id !== id));

  const addOctoberInvoice = (inv: OctoberInvoice) => setOctoberInvoices(prev => [inv, ...prev]);
  const deleteOctoberInvoice = (id: string) => setOctoberInvoices(prev => prev.filter(i => i.id !== id));

  const addVoucher = (voucher: AccountingVoucher) => setVouchers((prev) => [voucher, ...prev]);
  const deleteVoucher = (id: string) => setVouchers((prev) => prev.filter((v) => v.id !== id));

  const addBankMovement = (mov: BanescoMovementAudit) => setBankMovements((prev) => [mov, ...prev]);
  const deleteBankMovement = (id: string) => setBankMovements((prev) => prev.filter((m) => m.id !== id));

  const addWorker = (worker: WorkerPayrollItem) => setWorkers((prev) => [worker, ...prev]);
  const deleteWorker = (id: string) => setWorkers((prev) => prev.filter((w) => w.id !== id));

  const addPettyCash = (item: PettyCashEntry) => setPettyCash((prev) => [item, ...prev]);
  const addReceipt = (receipt: CoffeeReceiptRecord) => setReceipts((prev) => [receipt, ...prev]);
  const addContract = (contract: LegalContractRecord) => setContracts((prev) => [contract, ...prev]);

  const clearAllDatabase = () => {
    setCustomerAdvances([]);
    setFxPurchases([]);
    setImportShipments([]);
    setOctoberInvoices([]);
    setVouchers([]);
    setRetentions([]);
    setBankMovements([]);
    setWorkers([]);
    setPettyCash([]);
    setReceipts([]);
    setContracts([]);
    localStorage.clear();
  };

  const importFullDatabase = (data: any): boolean => {
    try {
      if (data.customerAdvances && Array.isArray(data.customerAdvances)) setCustomerAdvances(data.customerAdvances);
      if (data.fxPurchases && Array.isArray(data.fxPurchases)) setFxPurchases(data.fxPurchases);
      if (data.importShipments && Array.isArray(data.importShipments)) setImportShipments(data.importShipments);
      if (data.octoberInvoices && Array.isArray(data.octoberInvoices)) setOctoberInvoices(data.octoberInvoices);
      if (data.vouchers && Array.isArray(data.vouchers)) setVouchers(data.vouchers);
      if (data.retentions && Array.isArray(data.retentions)) setRetentions(data.retentions);
      if (data.bankMovements && Array.isArray(data.bankMovements)) setBankMovements(data.bankMovements);
      if (data.workers && Array.isArray(data.workers)) setWorkers(data.workers);
      if (data.pettyCash && Array.isArray(data.pettyCash)) setPettyCash(data.pettyCash);
      if (data.receipts && Array.isArray(data.receipts)) setReceipts(data.receipts);
      if (data.contracts && Array.isArray(data.contracts)) setContracts(data.contracts);
      return true;
    } catch (err) {
      console.error('Error importando JSON:', err);
      return false;
    }
  };

  const exportDatabaseJSON = () => {
    const payload = {
      version: '2026.2_INTERMEDIARY_IMPORT',
      exportedAt: new Date().toISOString(),
      customerAdvances,
      fxPurchases,
      importShipments,
      octoberInvoices,
      vouchers,
      retentions,
      bankMovements,
      workers,
      pettyCash,
      receipts,
      contracts
    };
    return JSON.stringify(payload, null, 2);
  };

  return (
    <AppDataContext.Provider
      value={{
        customerAdvances,
        fxPurchases,
        importShipments,
        octoberInvoices,
        vouchers,
        retentions,
        bankMovements,
        workers,
        pettyCash,
        receipts,
        contracts,
        addCustomerAdvance,
        deleteCustomerAdvance,
        addFxPurchase,
        deleteFxPurchase,
        addImportShipment,
        deleteImportShipment,
        addOctoberInvoice,
        deleteOctoberInvoice,
        addVoucher,
        deleteVoucher,
        addBankMovement,
        deleteBankMovement,
        addWorker,
        deleteWorker,
        addPettyCash,
        addReceipt,
        addContract,
        clearAllDatabase,
        importFullDatabase,
        exportDatabaseJSON
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData debe ser usado dentro de un AppDataProvider');
  }
  return context;
};
