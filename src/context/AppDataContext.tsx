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
  status: 'RECIBIDO' | 'EN_CONVERSION_DIVISAS' | 'CAFE_IMPORTADO' | 'FACTURADO_OCTUBRE';
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
  destinationPurpose: 'PAGO_PROVEEDOR_COLOMBIA' | 'FLETE_INTERNACIONAL' | 'GASTOS_ADUANEROS';
  notes?: string;
}

export interface ImportShipmentColombia {
  id: string;
  shipmentCode: string;
  date: string;
  supplierName: string;
  supplierNit: string;
  originCountry: string;
  coffeeVariety: string;
  volumeQtl: number;
  totalInvoiceUSD: number;
  invoiceCommercialRef: string;
  duaSeniatNumber: string;
  insaiPermit: string;
  internationalFreightUSD: number;
  customsCostsUSD: number;
  status: 'ORDEN_COMPRA' | 'TRANSITO_FRONTERA' | 'EN_ADUANA' | 'NACIONALIZADO_EN_ALMACEN';
}

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
    clientName: 'EMPRESA ETN, C.A.',
    clientRif: 'J-50100487-0',
    amountVES: 20745000,
    countervalueUSD: 30115.40,
    bcvRate: 688.00,
    coffeeVolumeTargetQtl: 500,
    bankReference: '#00033005568',
    status: 'CAFE_IMPORTADO',
    notes: 'Anticipo en ventas para importación de café verde de Colombia. Entrega programada octubre.'
  },
  {
    id: 'ADV-2026-002',
    advanceNumber: 'ANT-2026-002',
    date: '2026-06-19',
    clientName: 'DISTRIBUIDORA DIS, C.A.',
    clientRif: 'J-30643703-7',
    amountVES: 35823999.24,
    countervalueUSD: 51986.65,
    bcvRate: 690.00,
    coffeeVolumeTargetQtl: 850,
    bankReference: '#00058529036',
    status: 'CAFE_IMPORTADO',
    notes: 'Anticipo clientes jurídicos para abastecimiento cafetalero.'
  },
  {
    id: 'ADV-2026-003',
    advanceNumber: 'ANT-2026-003',
    date: '2026-07-09',
    clientName: 'DISTRIBUIDORA DIS & EMPRESA ETN',
    clientRif: 'J-30643703-7',
    amountVES: 11879549,
    countervalueUSD: 16430.91,
    bcvRate: 723.00,
    coffeeVolumeTargetQtl: 280,
    bankReference: '#00005995465',
    status: 'CAFE_IMPORTADO',
    notes: 'Fondos de clientes para intermediación comercial de café.'
  },
  {
    id: 'ADV-2026-004',
    advanceNumber: 'ANT-2026-004',
    date: '2026-07-29',
    clientName: 'GRUPO AGROINDUSTRIAL ORU, C.A.',
    clientRif: 'J-41100717-0',
    amountVES: 67000000.97,
    countervalueUSD: 93055.56,
    bcvRate: 745.00,
    coffeeVolumeTargetQtl: 1500,
    bankReference: '#00016671975',
    status: 'CAFE_IMPORTADO',
    notes: 'Abonos en cuenta para importación y suministro agroindustrial.'
  },
  {
    id: 'ADV-2026-005',
    advanceNumber: 'ANT-2026-005',
    date: '2026-08-06',
    clientName: 'INVERSIONES SOLBTR / AGROPECUARIA AGR',
    clientRif: 'J-40918820-2',
    amountVES: 97180000,
    countervalueUSD: 131524.32,
    bcvRate: 756.70,
    coffeeVolumeTargetQtl: 2100,
    bankReference: '#0000000198',
    status: 'CAFE_IMPORTADO',
    notes: 'Lotes de transferencias interbancarias para contingencia de demanda.'
  },
  {
    id: 'ADV-2026-006',
    advanceNumber: 'ANT-2026-006',
    date: '2026-08-11',
    clientName: 'COMERCIALIZADORA RIK, C.A.',
    clientRif: 'J-50099756-6',
    amountVES: 63750000,
    countervalueUSD: 86148.65,
    bcvRate: 764.35,
    coffeeVolumeTargetQtl: 1400,
    bankReference: '#00030445172',
    status: 'CAFE_IMPORTADO',
    notes: 'Fondeo de operaciones de abastecimiento de grano de café.'
  },
  {
    id: 'ADV-2026-007',
    advanceNumber: 'ANT-2026-007',
    date: '2026-08-31',
    clientName: 'CORPORACIÓN AGROINDUSTRIAL J Y ASOCIADOS',
    clientRif: 'J-50123891-9',
    amountVES: 126200000,
    countervalueUSD: 165327.68,
    bcvRate: 798.33,
    coffeeVolumeTargetQtl: 2650,
    bankReference: '#000041945646',
    status: 'CAFE_IMPORTADO',
    notes: 'Liquidación de compromisos de entrega de café para despacho en octubre.'
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
    destinationPurpose: 'PAGO_PROVEEDOR_COLOMBIA',
    notes: 'Mesa de Cambio Banesco. Compra autorizada para procura inicial en Cúcuta.'
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
    destinationPurpose: 'PAGO_PROVEEDOR_COLOMBIA',
    notes: 'Mesa de Cambio Banesco. Pago anticipado segundo lote Cooperativa Huila.'
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
    destinationPurpose: 'PAGO_PROVEEDOR_COLOMBIA',
    notes: 'Intervención Cambiaria BCV / Banesco. Lote de café pergamino lavado.'
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
    destinationPurpose: 'FLETE_INTERNACIONAL',
    notes: 'Mesa de Cambio Banesco. Flete internacional y despacho aduanal DUA.'
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
    destinationPurpose: 'GASTOS_ADUANEROS',
    notes: 'Mesa de Cambio Banesco. Liquidación arancelaria y custodia final.'
  }
];

export const DEFAULT_IMPORT_SHIPMENTS_2026: ImportShipmentColombia[] = [
  {
    id: 'IMP-COL-2026-001',
    shipmentCode: 'IMP-COL-2026-001',
    date: '2026-05-20',
    supplierName: 'Cooperativa Cafetera de Cúcuta Ltda.',
    supplierNit: 'NIT: 890.501.240-3',
    originCountry: 'Colombia (Norte de Santander)',
    coffeeVariety: 'Café Arábica Pergamino Lavado Exportación',
    volumeQtl: 2500,
    totalInvoiceUSD: 155000,
    invoiceCommercialRef: 'EXP-COL-008412',
    duaSeniatNumber: 'DUA-2026-ADU-004128',
    insaiPermit: 'INSAI-FITOSAN-IMP-2026-904',
    internationalFreightUSD: 23400,
    customsCostsUSD: 12000,
    status: 'NACIONALIZADO_EN_ALMACEN'
  },
  {
    id: 'IMP-COL-2026-002',
    shipmentCode: 'IMP-COL-2026-002',
    date: '2026-07-15',
    supplierName: 'Cooperativa de Caficultores del Huila Ltda.',
    supplierNit: 'NIT: 891.100.842-1',
    originCountry: 'Colombia (Huila)',
    coffeeVariety: 'Café Arábica Supremo Excelso',
    volumeQtl: 3000,
    totalInvoiceUSD: 180000,
    invoiceCommercialRef: 'EXP-COL-009104',
    duaSeniatNumber: 'DUA-2026-ADU-005891',
    insaiPermit: 'INSAI-FITOSAN-IMP-2026-1180',
    internationalFreightUSD: 26800,
    customsCostsUSD: 14000,
    status: 'NACIONALIZADO_EN_ALMACEN'
  },
  {
    id: 'IMP-COL-2026-003',
    shipmentCode: 'IMP-COL-2026-003',
    date: '2026-08-25',
    supplierName: 'Exportadora Andina de Café Santander S.A.S.',
    supplierNit: 'NIT: 900.842.115-7',
    originCountry: 'Colombia (Santander)',
    coffeeVariety: 'Café Pergamino Lavado Especial',
    volumeQtl: 2000,
    totalInvoiceUSD: 110000,
    invoiceCommercialRef: 'EXP-COL-009588',
    duaSeniatNumber: 'DUA-2026-ADU-007204',
    insaiPermit: 'INSAI-FITOSAN-IMP-2026-1402',
    internationalFreightUSD: 17180.15,
    customsCostsUSD: 9000,
    status: 'NACIONALIZADO_EN_ALMACEN'
  }
];

export const DEFAULT_OCTOBER_INVOICES_2026: OctoberInvoice[] = [
  {
    id: 'INV-OCT-001',
    invoiceNumber: 'FAC-OCT-2026-001',
    date: '2026-10-05',
    clientName: 'EMPRESA ETN, C.A.',
    clientRif: 'J-50100487-0',
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
    clientName: 'DISTRIBUIDORA DIS, C.A.',
    clientRif: 'J-30643703-7',
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
    clientName: 'GRUPO AGROINDUSTRIAL ORU, C.A.',
    clientRif: 'J-41100717-0',
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
    clientName: 'INVERSIONES SOLBTR / AGROPECUARIA AGR',
    clientRif: 'J-40918820-2',
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
    clientName: 'COMERCIALIZADORA RIK, C.A.',
    clientRif: 'J-50099756-6',
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
    clientName: 'CORPORACIÓN AGROINDUSTRIAL J Y ASOCIADOS',
    clientRif: 'J-50123891-9',
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
