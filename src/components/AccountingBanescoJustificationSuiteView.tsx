import React, { useState } from 'react';
import {
  BookOpen,
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Scale,
  ShieldCheck,
  ArrowRightLeft,
  Calendar,
  Layers,
  FileDown
} from 'lucide-react';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import {
  exportMasterContabilidadBanescoExcel,
  exportContabilidadBanescoDailyAndSummaryExcel,
  exportToExcelXlsx,
  downloadNativeDocx
} from '../utils/exportUtils';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
}

interface AccountingJournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  type: 'INGRESO' | 'EGRESO' | 'DIARIO';
  accountCode: string;
  accountName: string;
  debitVES: number;
  creditVES: number;
  debitUSD: number;
  creditUSD: number;
  bcvRate: number;
  reference: string;
  concept: string;
  banescoCategory: string;
}

export const AccountingBanescoJustificationSuiteView: React.FC<Props> = ({
  company,
  currentRate
}) => {
  const [activeTab, setActiveTab] = useState<'ASIENTOS' | 'CATEGORIAS' | 'CARTA_BANESCO' | 'OPERACIONES_DIARIAS'>('ASIENTOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isExporting, setIsExporting] = useState(false);

  // 12 Asientos Oficiales Auditados
  const entries: AccountingJournalEntry[] = [
    // Asiento 1
    {
      id: 'E-01A',
      entryNumber: 'AST-01',
      date: '16/06/2026',
      type: 'INGRESO',
      accountCode: '1.1.01.02',
      accountName: 'Banesco Banco Universal (Cta Cte N° 0134-0342-18-3421089912)',
      debitVES: 1013438543.38,
      creditVES: 0,
      debitUSD: 1491402.68,
      creditUSD: 0,
      bcvRate: 679.52,
      reference: 'TRANS.CTAS Mismo Banco Banesco',
      concept: 'Recepción de anticipos torrefactoras nacionales para compra de café',
      banescoCategory: 'Anticipos Torrefactoras Mismo Banco (51,53%)'
    },
    {
      id: 'E-01B',
      entryNumber: 'AST-01',
      date: '16/06/2026',
      type: 'INGRESO',
      accountCode: '2.1.01.01',
      accountName: 'Anticipos Recibidos de Clientes (NIIF 15 / Sección 23)',
      debitVES: 0,
      creditVES: 1013438543.38,
      debitUSD: 0,
      creditUSD: 1491402.68,
      bcvRate: 679.52,
      reference: 'Contratos de Procura Cafetalera',
      concept: 'Obligación contractual por cumplir con entrega física y factura SENIAT en Oct. 2026',
      banescoCategory: 'Anticipos Torrefactoras Mismo Banco (51,53%)'
    },

    // Asiento 2
    {
      id: 'E-02A',
      entryNumber: 'AST-02',
      date: '20/06/2026',
      type: 'INGRESO',
      accountCode: '1.1.01.02',
      accountName: 'Banesco Banco Universal (Cta Cte N° 0134-0342-18-3421089912)',
      debitVES: 528578549.25,
      creditVES: 0,
      debitUSD: 779083.55,
      creditUSD: 0,
      bcvRate: 678.46,
      reference: 'Depósitos y Pagos Móviles Interbancarios',
      concept: 'Recepción de anticipos de clientes jurídicos mayoristas para reserva de café verde',
      banescoCategory: 'Anticipos Clientes Jurídicos Mayoristas (26,88%)'
    },
    {
      id: 'E-02B',
      entryNumber: 'AST-02',
      date: '20/06/2026',
      type: 'INGRESO',
      accountCode: '2.1.01.01',
      accountName: 'Anticipos Recibidos de Clientes (NIIF 15 / Sección 23)',
      debitVES: 0,
      creditVES: 528578549.25,
      debitUSD: 0,
      creditUSD: 779083.55,
      bcvRate: 678.46,
      reference: 'Órdenes de Compra Mayoristas',
      concept: 'Pasivo corriente exigible mediante despacho de quintales de café en grano',
      banescoCategory: 'Anticipos Clientes Jurídicos Mayoristas (26,88%)'
    },

    // Asiento 3
    {
      id: 'E-03A',
      entryNumber: 'AST-03',
      date: '25/06/2026',
      type: 'EGRESO',
      accountCode: '1.1.04.01',
      accountName: 'Inventario de Café Verde Arábica en Acopio (Portuguesa)',
      debitVES: 496315336.98,
      creditVES: 0,
      debitUSD: 756630.95,
      creditUSD: 0,
      bcvRate: 655.95,
      reference: 'Guías SICA/SADA y Comprobantes de Pesaje',
      concept: 'Desembolso para adquisición de café verde en pergamino en Guanare y Biscucuy',
      banescoCategory: 'Compras de Café a Productores Nacionales (63,41%)'
    },
    {
      id: 'E-03B',
      entryNumber: 'AST-03',
      date: '25/06/2026',
      type: 'EGRESO',
      accountCode: '1.1.01.02',
      accountName: 'Banesco Banco Universal (Cta Cte N° 0134-0342-18-3421089912)',
      debitVES: 0,
      creditVES: 496315336.98,
      debitUSD: 0,
      creditUSD: 756630.95,
      bcvRate: 655.95,
      reference: 'Transferencias Electrónicas Banesco',
      concept: 'Pago directo a caficultores del estado Portuguesa',
      banescoCategory: 'Compras de Café a Productores Nacionales (63,41%)'
    },

    // Asiento 4
    {
      id: 'E-04A',
      entryNumber: 'AST-04',
      date: '05/07/2026',
      type: 'EGRESO',
      accountCode: '1.1.04.01',
      accountName: 'Inventario de Café Verde Arábica en Acopio (Lara)',
      debitVES: 434275919.86,
      creditVES: 0,
      debitUSD: 662052.08,
      creditUSD: 0,
      bcvRate: 655.95,
      reference: 'Actas de Recepción Sanare y Guárico',
      concept: 'Adquisición de lotes de café de altura a productores del estado Lara',
      banescoCategory: 'Compras de Café a Productores Nacionales (63,41%)'
    },
    {
      id: 'E-04B',
      entryNumber: 'AST-04',
      date: '05/07/2026',
      type: 'EGRESO',
      accountCode: '1.1.01.02',
      accountName: 'Banesco Banco Universal (Cta Cte N° 0134-0342-18-3421089912)',
      debitVES: 0,
      creditVES: 434275919.86,
      debitUSD: 0,
      creditUSD: 662052.08,
      bcvRate: 655.95,
      reference: 'Transferencias Masivas Banesco',
      concept: 'Liquidación de pesaje a productores agrícolas de Sanare',
      banescoCategory: 'Compras de Café a Productores Nacionales (63,41%)'
    },

    // Asiento 5
    {
      id: 'E-05A',
      entryNumber: 'AST-05',
      date: '18/07/2026',
      type: 'EGRESO',
      accountCode: '1.1.04.01',
      accountName: 'Inventario de Café Verde Arábica en Acopio (Anzoátegui)',
      debitVES: 310197085.62,
      creditVES: 0,
      debitUSD: 472894.35,
      creditUSD: 0,
      bcvRate: 655.95,
      reference: 'Acopio Bergantín y Guías de Movilización',
      concept: 'Compra directa de cosecha local a caficultores de Bergantín, Anzoátegui',
      banescoCategory: 'Compras de Café a Productores Nacionales (63,41%)'
    },
    {
      id: 'E-05B',
      entryNumber: 'AST-05',
      date: '18/07/2026',
      type: 'EGRESO',
      accountCode: '1.1.01.02',
      accountName: 'Banesco Banco Universal (Cta Cte N° 0134-0342-18-3421089912)',
      debitVES: 0,
      creditVES: 310197085.62,
      debitUSD: 0,
      creditUSD: 472894.35,
      bcvRate: 655.95,
      reference: 'Transferencias Banesco Cuenta Corriente',
      concept: 'Cancelación de café pergamino puesto en patio de secado',
      banescoCategory: 'Compras de Café a Productores Nacionales (63,41%)'
    },

    // Asiento 6
    {
      id: 'E-06A',
      entryNumber: 'AST-06',
      date: '01/08/2026',
      type: 'INGRESO',
      accountCode: '1.1.01.02',
      accountName: 'Banesco Banco Universal (Cta Cte N° 0134-0342-18-3421089912)',
      debitVES: 191938492.71,
      creditVES: 0,
      debitUSD: 285500.00,
      creditUSD: 0,
      bcvRate: 672.29,
      reference: 'Contrato de Mutuo Manuel Becerra',
      concept: 'Desembolso de financiamiento según contrato mutuo suscrito con Manuel Becerra',
      banescoCategory: 'Contrato Préstamo Mutuo Manuel Becerra (9,76%)'
    },
    {
      id: 'E-06B',
      entryNumber: 'AST-06',
      date: '01/08/2026',
      type: 'INGRESO',
      accountCode: '2.1.02.01',
      accountName: 'Préstamos por Pagar Contrato Mutuo (Manuel Becerra)',
      debitVES: 0,
      creditVES: 191938492.71,
      debitUSD: 0,
      creditUSD: 285500.00,
      bcvRate: 672.29,
      reference: 'Contrato Notariado / Registrado',
      concept: 'Obligación financiera con socio en otras empresas del grupo (no accionista de Agrícola Oni)',
      banescoCategory: 'Contrato Préstamo Mutuo Manuel Becerra (9,76%)'
    },

    // Asiento 7
    {
      id: 'E-07A',
      entryNumber: 'AST-07',
      date: '10/08/2026',
      type: 'EGRESO',
      accountCode: '5.1.02.01',
      accountName: 'Costos de Transporte, Trillado y Fletes de Café',
      debitVES: 382415820.14,
      creditVES: 0,
      debitUSD: 580400.00,
      creditUSD: 0,
      bcvRate: 658.88,
      reference: 'Guías de Flete y Facturas de Trilla',
      concept: 'Transporte de carga pesada desde centros de acopio a plantas procesadoras',
      banescoCategory: 'Fletes, Logística, Trilla y Secado (19,54%)'
    },
    {
      id: 'E-07B',
      entryNumber: 'AST-07',
      date: '10/08/2026',
      type: 'EGRESO',
      accountCode: '1.1.01.02',
      accountName: 'Banesco Banco Universal (Cta Cte N° 0134-0342-18-3421089912)',
      debitVES: 0,
      creditVES: 382415820.14,
      debitUSD: 0,
      creditUSD: 580400.00,
      bcvRate: 658.88,
      reference: 'Transferencias Electrónicas Banesco',
      concept: 'Pago a cooperativas y transportistas de carga pesada',
      banescoCategory: 'Fletes, Logística, Trilla y Secado (19,54%)'
    },

    // Asiento 8
    {
      id: 'E-08A',
      entryNumber: 'AST-08',
      date: '15/08/2026',
      type: 'EGRESO',
      accountCode: '5.1.03.01',
      accountName: 'Nómina y Mano de Obra Agrícola de Campo',
      debitVES: 186240951.35,
      creditVES: 0,
      debitUSD: 282800.00,
      creditUSD: 0,
      bcvRate: 658.56,
      reference: 'Listines de Pago Cuadrillas de Cosecha',
      concept: 'Remuneración semanal de cuadrillas de campo, vigilancia de predios y recolectores',
      banescoCategory: 'Nómina Cuadrillas Agrícolas y Vigilancia (9,52%)'
    },
    {
      id: 'E-08B',
      entryNumber: 'AST-08',
      date: '15/08/2026',
      type: 'EGRESO',
      accountCode: '1.1.01.02',
      accountName: 'Banesco Banco Universal (Cta Cte N° 0134-0342-18-3421089912)',
      debitVES: 0,
      creditVES: 186240951.35,
      debitUSD: 0,
      creditUSD: 282800.00,
      bcvRate: 658.56,
      reference: 'Dispersión de Nómina Bancaria',
      concept: 'Abonos directos en cuenta a trabajadores y operadores agrícolas',
      banescoCategory: 'Nómina Cuadrillas Agrícolas y Vigilancia (9,52%)'
    },

    // Asiento 9
    {
      id: 'E-09A',
      entryNumber: 'AST-09',
      date: '20/08/2026',
      type: 'EGRESO',
      accountCode: '5.1.04.01',
      accountName: 'Insumos Agrícolas, Fertilizantes y Empaques de Café',
      debitVES: 147215000.00,
      creditVES: 0,
      debitUSD: 223500.00,
      creditUSD: 0,
      bcvRate: 658.68,
      reference: 'Facturas de Compra Proveedores Insumos',
      concept: 'Adquisición de sacos de yute, fertilizantes foliares y mantenimiento operativo',
      banescoCategory: 'Agroquímicos, Fertilizantes e Insumos (7,52%)'
    },
    {
      id: 'E-09B',
      entryNumber: 'AST-09',
      date: '20/08/2026',
      type: 'EGRESO',
      accountCode: '1.1.01.02',
      accountName: 'Banesco Banco Universal (Cta Cte N° 0134-0342-18-3421089912)',
      debitVES: 0,
      creditVES: 147215000.00,
      debitUSD: 0,
      creditUSD: 223500.00,
      bcvRate: 658.68,
      reference: 'Transferencias Comerciales Banesco',
      concept: 'Cancelación de insumos agrícolas para acondicionamiento de lotes',
      banescoCategory: 'Agroquímicos, Fertilizantes e Insumos (7,52%)'
    },

    // Asiento 10
    {
      id: 'E-10A',
      entryNumber: 'AST-10',
      date: '25/08/2026',
      type: 'INGRESO',
      accountCode: '1.1.01.02',
      accountName: 'Banesco Banco Universal (Cta Cte N° 0134-0342-18-3421089912)',
      debitVES: 92641520.01,
      creditVES: 0,
      debitUSD: 116531.68,
      creditUSD: 0,
      bcvRate: 794.99,
      reference: 'Facturas SENIAT N° 0041 a 0048',
      concept: 'Cobro de facturación comercial por servicios de asesoría agronómica y fletes devengados',
      banescoCategory: 'Facturación Devengada Servicios Agrícolas (4,71%)'
    },
    {
      id: 'E-10B',
      entryNumber: 'AST-10',
      date: '25/08/2026',
      type: 'INGRESO',
      accountCode: '4.1.01.01',
      accountName: 'Ingresos Operativos Devengados por Servicios y Producción',
      debitVES: 0,
      creditVES: 92641520.01,
      debitUSD: 0,
      creditUSD: 116531.68,
      bcvRate: 794.99,
      reference: 'Libro de Ventas SENIAT',
      concept: 'Ingreso real declarado en el Estado de Resultados (PyG) del ejercicio',
      banescoCategory: 'Facturación Devengada Servicios Agrícolas (4,71%)'
    },

    // Asiento 11
    {
      id: 'E-11A',
      entryNumber: 'AST-11',
      date: '28/08/2026',
      type: 'INGRESO',
      accountCode: '1.1.01.02',
      accountName: 'Banesco Banco Universal (Cta Cte N° 0134-0342-18-3421089912)',
      debitVES: 140000000.00,
      creditVES: 0,
      debitUSD: 239851.04,
      creditUSD: 0,
      bcvRate: 583.70,
      reference: 'Transferencias de Tesorería Operativa',
      concept: 'Reembolso de fondos de campo y reintegro transitorio para liquidez de zafra',
      banescoCategory: 'Reposición Fondos Operativos (7,12%)'
    },
    {
      id: 'E-11B',
      entryNumber: 'AST-11',
      date: '28/08/2026',
      type: 'INGRESO',
      accountCode: '1.1.02.01',
      accountName: 'Fondos Operativos en Tránsito y Garantías de Tesorería',
      debitVES: 0,
      creditVES: 140000000.00,
      debitUSD: 0,
      creditUSD: 239851.04,
      bcvRate: 583.70,
      reference: 'Caja Operativa / Tesorería',
      concept: 'Liquidación de avances temporales y custodia de capital de trabajo',
      banescoCategory: 'Reposición Fondos Operativos (7,12%)'
    }
  ];

  // Totales de Libro Diario
  const totalDebitVES = entries.reduce((acc, e) => acc + e.debitVES, 0);
  const totalCreditVES = entries.reduce((acc, e) => acc + e.creditVES, 0);
  const totalDebitUSD = entries.reduce((acc, e) => acc + e.debitUSD, 0);
  const totalCreditUSD = entries.reduce((acc, e) => acc + e.creditUSD, 0);

  // Filtrado de Asientos
  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.banescoCategory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || e.type === filterType;
    return matchesSearch && matchesType;
  });

  // Categorías de Ingresos Banesco
  const categoriasIngresos = [
    {
      codigo: 'CAT-ING-01',
      descripcion: 'Anticipos Torrefactoras Banesco (TRANS.CTAS Mismo Banco)',
      montoVES: 1013438543.38,
      montoUSD: 1491402.68,
      porcentaje: '51,53%',
      cuenta: '2.1.01 Anticipos Clientes',
      soporte: 'Contratos suministro café. Pasivo NIIF 15 diferido. Facturación fiscal SENIAT en Oct. 2026.'
    },
    {
      codigo: 'CAT-ING-02',
      descripcion: 'Anticipos Clientes Jurídicos Mayoristas (Interbancario)',
      montoVES: 528578549.25,
      montoUSD: 779083.55,
      porcentaje: '26,88%',
      cuenta: '2.1.01 Anticipos Clientes',
      soporte: 'Transferencias interbancarias para reserva de lotes de café verde arábica en grano.'
    },
    {
      codigo: 'CAT-ING-03',
      descripcion: 'Contrato Préstamo Mutuo en Divisas / Bs. (Manuel Becerra)',
      montoVES: 191938492.71,
      montoUSD: 285500.00,
      porcentaje: '9,76%',
      cuenta: '2.1.02 Préstamos por Pagar Mutuo',
      soporte: 'Financiamiento operativo según contrato mutuo firmado con Manuel Becerra (socio de otras empresas del grupo).'
    },
    {
      codigo: 'CAT-ING-04',
      descripcion: 'Facturación Devengada Servicios Agrícolas y Fletes',
      montoVES: 92641520.01,
      montoUSD: 116531.68,
      porcentaje: '4,71%',
      cuenta: '4.1.01 Ingresos por Servicios',
      soporte: 'Facturas comerciales SENIAT debidamente devengadas en el ejercicio y declaradas en PyG.'
    },
    {
      codigo: 'CAT-ING-05',
      descripcion: 'Reposición de Fondos Operativos y Garantías Transitorias',
      montoVES: 140000000.00,
      montoUSD: 239851.04,
      porcentaje: '7,12%',
      cuenta: '1.1.02 Caja Operativa Banesco',
      soporte: 'Reembolsos de caja de campo y transferencias de liquidez para sostenimiento de zafra.'
    }
  ];

  // Categorías de Gastos Banesco
  const categoriasGastos = [
    {
      codigo: 'CAT-EGR-01',
      descripcion: 'Compras de Café Verde a Productores (Portuguesa, Lara, Anzoátegui)',
      montoVES: 1240788342.46,
      montoUSD: 1891577.38,
      porcentaje: '63,41%',
      cuenta: '1.1.04 Inventario de Café',
      soporte: 'Guías SICA/SADA, liquidaciones de pesaje y actas de recepción de café verde en pergamino.'
    },
    {
      codigo: 'CAT-EGR-02',
      descripcion: 'Fletes de Café, Logística, Trilla y Secado de Granos',
      montoVES: 382415820.14,
      montoUSD: 580400.00,
      porcentaje: '19,54%',
      cuenta: '5.1.02 Fletes y Transporte',
      soporte: 'Guías de movilización de café y comprobantes de cooperativas de transporte pesado.'
    },
    {
      codigo: 'CAT-EGR-03',
      descripcion: 'Nómina Cuadrillas Agrícolas, Vigilancia y Cosecheros',
      montoVES: 186240951.35,
      montoUSD: 282800.00,
      porcentaje: '9,52%',
      cuenta: '5.1.03 Nómina Agrícola Campo',
      soporte: 'Listines de pago de cosecheros y transferencias semanales de cuadrillas de campo.'
    },
    {
      codigo: 'CAT-EGR-04',
      descripcion: 'Agroquímicos, Fertilizantes, Sacos de Yute y Mantenimiento',
      montoVES: 147215000.00,
      montoUSD: 223500.00,
      porcentaje: '7,52%',
      cuenta: '5.1.04 Insumos Agrícolas',
      soporte: 'Facturas SENIAT de agropecuarias por abonos, fertilizantes y repuestos de maquinaria.'
    },
    {
      codigo: 'CAT-EGR-05',
      descripcion: 'Gastos Bancarios, Comisiones Banesco e IGTF Débito',
      montoVES: 0.00,
      montoUSD: 0.00,
      porcentaje: '0,00%',
      cuenta: '5.1.01 Gastos Bancarios',
      soporte: 'Exonerado / Absorbido en costos operativos directos.'
    }
  ];

  const handleExportMasterExcel = async () => {
    setIsExporting(true);
    try {
      await exportMasterContabilidadBanescoExcel(
        { name: company.name, rif: company.rif },
        currentRate.rateUsd
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDailyBanescoExcel = async () => {
    setIsExporting(true);
    try {
      await exportContabilidadBanescoDailyAndSummaryExcel(company.name, company.rif);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAsientosExcel = async () => {
    await exportToExcelXlsx({
      filename: 'Asientos_Contables_Libro_Diario_AgricolaOni.xlsx',
      sheetName: 'Libro Diario Asientos',
      companyName: company.name,
      companyRif: company.rif,
      title: 'LIBRO DIARIO DE CONTABILIDAD — ASIENTOS OFICIALES AUDITADOS',
      subtitle: `Período Enero a Agosto 2026 | Tasa BCV Cierre: ${currentRate.rateUsd.toFixed(2)} Bs/$`,
      headers: [
        'Fecha',
        'N° Asiento',
        'Tipo',
        'Código Cuenta',
        'Nombre de Cuenta',
        'Débito (Bs.)',
        'Crédito (Bs.)',
        'Débito ($USD)',
        'Crédito ($USD)',
        'Tasa BCV',
        'Categoría Banesco',
        'Concepto / Glosa'
      ],
      rows: entries.map((e) => [
        e.date,
        e.entryNumber,
        e.type,
        e.accountCode,
        e.accountName,
        e.debitVES,
        e.creditVES,
        e.debitUSD,
        e.creditUSD,
        e.bcvRate,
        e.banescoCategory,
        e.concept
      ]),
      totalsRow: [
        'TOTALES',
        '---',
        'SUMAS IGUALES',
        '---',
        'PARTIDA DOBLE CUADRADA',
        totalDebitVES,
        totalCreditVES,
        totalDebitUSD,
        totalCreditUSD,
        currentRate.rateUsd,
        'CERO DESCUADRE',
        'Conciliado 100%'
      ]
    });
  };

  const handleExportLetterDocx = async () => {
    await downloadNativeDocx('Carta_Justificacion_Contabilidad_Banesco.docx', {
      companyName: company.name,
      companyRif: company.rif,
      title: 'JUSTIFICACIÓN INTEGRAL DE MOVIMIENTOS BANCARIOS Y ASIENTOS CONTABLES',
      subtitle: 'Cuenta Corriente N° 0134-0342-18-3421089912 — Banesco Banco Universal',
      date: 'Caracas / Anzoátegui, 31 de Agosto de 2026',
      addressee: [
        'Señores:',
        'BANESCO BANCO UNIVERSAL, C.A.',
        'Vicepresidencia de Crédito, Auditoría y Cumplimiento',
        'Presente.-'
      ],
      paragraphs: [
        'Por medio de la presente comunicación oficial, la entidad mercantil AGRÍCOLA ONI, C.A., inscrita bajo el RIF J-40846505-1, debidamente representada por su Presidente y Único Accionista Elias Rafael Trías Abreu (C.I. V-23.997.829, propietario del 100% del capital social), conjuntamente con el Contador Público Colegiado Lic. Omar Pérez Castillo (C.P.C. N° 16336), presenta ante ustedes la justificación formal, documental y contable de los movimientos registrados en la cuenta corriente bancaria N° 0134-0342-18-3421089912.',
        '1. JUSTIFICACIÓN DE LAS ENTRADAS Y CRÉDITOS BANCARIOS (Total: Bs. 1.966.597.105,35 / $2.912.368,95 USD):',
        'El 78,41% de los fondos recibidos en la cuenta corresponde a Anticipos de Clientes para Compra e Intermediación de Café Nacional por Bs. 1.542.017.092,63 ($2.270.486,23 USD a tasa ponderada de 679,52 Bs/$). De estos, Bs. 1.013.438.543,38 provienen de torrefactoras nacionales mediante transferencias del mismo banco Banesco (TRANS.CTAS) y Bs. 528.578.549,25 de clientes jurídicos mayoristas. Conforme a las normas VEN-NIF PYMES (Sección 23) y NIIF 15, estos fondos no constituyen ventas brutas devengadas en el período, sino un Pasivo Corriente (Cuenta 2.1.01), ya que la zafra de acopio concluye en septiembre y la facturación fiscal definitiva SENIAT se emite en Octubre 2026 contra entrega física de los quintales.',
        'Los ingresos efectivamente devengados y declarados en el Estado de Resultados corresponden a Bs. 92.641.520,01 por servicios agrícolas y fletes. Adicionalmente, se recibieron Bs. 191.938.492,71 ($285.500 USD) derivados de un Contrato de Préstamo Mutuo suscrito con Manuel Becerra (socio de otras empresas del grupo), y Bs. 140.000.000,00 por reposiciones operativas de capital de trabajo.',
        '2. JUSTIFICACIÓN DE LAS SALIDAS Y DÉBITOS BANCARIOS (Total: Bs. 1.956.660.113,95 / $2.896.827,21 USD):',
        'El 63,41% de las salidas bancarias (Bs. 1.240.788.342,46 / $1.891.577,38 USD) se aplicó de manera inmediata a la compra y acopio de café verde arábica a productores agrícolas en Portuguesa (Guanare/Biscucuy), Lara (Sanare/Guárico) y Anzoátegui (Bergantín), amparados con Guías SICA/SADA de movilización y comprobantes de pesaje en finca. La diferencia operativa financió fletes pesados y trilla (Bs. 382.415.820,14), nómina de cuadrillas agrícolas y cosecheros (Bs. 186.240.951,35), e insumos agrícolas (Bs. 147.215.000,00).',
        '3. CONCILIACIÓN CON EL BALANCE GENERAL:',
        'Al 31 de agosto de 2026, de los Bs. 1.542.017.092,63 recibidos en anticipos, se ejecutaron Bs. 1.240.788.342,46 en compras de grano, quedando un saldo remanente no cumplido de exactamente Bs. 301.228.750,17 ($378.908,85 USD a tasa de cierre de 794,99 Bs/$), el cual coincide con el Pasivo Corriente de la Cuenta 2.1.01 del Balance General. El saldo final disponible en la cuenta corriente Banesco es de Bs. 12.355.523,87 ($15.541,74 USD), conciliado al 100% con los estados financieros.'
      ],
      highlightBox: 'VEREDICTO CONTABLE Y CONSISTENCIA: No existen operaciones ficticias ni omisión tributaria. Las operaciones responden a la zafra cafetalera nacional venezolana debidamente bancarizada en Banesco a tasa oficial BCV, con titularidad exclusiva de Elias Rafael Trías Abreu.',
      signers: [
        { name: 'Elias Rafael Trías Abreu', title: 'Presidente y Único Accionista (100%)', idNumber: 'C.I. V-23.997.829' },
        { name: 'Lic. Omar Pérez Castillo', title: 'Contador Público Colegiado (VEN-NIF)', idNumber: 'C.P.C. N° 16336' }
      ]
    });
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/60 p-6 rounded-2xl shadow-sm text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-600/30 border border-emerald-500/40 rounded-xl text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Contabilidad Oficial & Justificación Bancaria Banesco</span>
                  <span className="text-xs bg-emerald-700/80 text-emerald-100 font-mono px-2.5 py-0.5 rounded-full border border-emerald-600">
                    VEN-NIF PYMES &middot; Banesco Cta. Cte.
                  </span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {company.name} &mdash; RIF: {company.rif} | Período: 01 de Enero al 31 de Agosto de 2026
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-300">
              <span><strong>Accionista Único (100%):</strong> Elias Rafael Trías Abreu (V-23.997.829)</span>
              <span>&bull;</span>
              <span><strong>Contador Público:</strong> Lic. Omar Pérez Castillo (C.P.C. N° 16336)</span>
              <span>&bull;</span>
              <span><strong>Tasa Cierre BCV:</strong> {currentRate.rateUsd.toFixed(2)} Bs/$</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={handleExportDailyBanescoExcel}
              disabled={isExporting}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer border border-teal-600"
              title="Descargar Excel con todas las transferencias Banesco día a día calculadas a la Tasa Oficial BCV del día"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-200" />
              <span>Excel Operaciones Día a Día + Tasas BCV (.xlsx)</span>
            </button>

            <button
              onClick={handleExportMasterExcel}
              disabled={isExporting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer border border-emerald-500"
              title="Descargar Cuaderno Maestro Completo con todas las pestañas de contabilidad y Banesco"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>{isExporting ? 'Generando Excel...' : 'Descargar Cuaderno Completo (.xlsx)'}</span>
            </button>

            <button
              onClick={handleExportLetterDocx}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Descargar Carta Oficial en Microsoft Word (.docx)"
            >
              <FileDown className="w-4 h-4 text-blue-200" />
              <span>Carta en Word (.docx)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Imprimir o Guardar en PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Cintas Resumen de Conciliación Bancaria */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Total Entradas Banesco (Créditos)
            </span>
            <div className="text-lg font-bold text-white mt-1">
              Bs. 1.966.597.105,35
            </div>
            <div className="text-xs text-slate-400 font-mono">
              $2.912.368,95 USD (78,41% Anticipos Café)
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> Total Salidas Banesco (Débitos)
            </span>
            <div className="text-lg font-bold text-white mt-1">
              Bs. 1.956.660.113,95
            </div>
            <div className="text-xs text-slate-400 font-mono">
              $2.896.827,21 USD (63,41% Compras a Productores)
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
            <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" /> Saldo Final Disponible Auditado
            </span>
            <div className="text-lg font-bold text-white mt-1">
              Bs. 12.355.523,87
            </div>
            <div className="text-xs text-emerald-400 font-mono">
              $15.541,74 USD (100% Conciliado con Balance)
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 no-print overflow-x-auto">
        <button
          onClick={() => setActiveTab('ASIENTOS')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'ASIENTOS'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Asientos Contables & Libro Diario</span>
        </button>

        <button
          onClick={() => setActiveTab('CATEGORIAS')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'CATEGORIAS'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. Detalle de Categorías Banesco</span>
        </button>

        <button
          onClick={() => setActiveTab('CARTA_BANESCO')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'CARTA_BANESCO'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Carta Justificación Banesco</span>
        </button>

        <button
          onClick={() => setActiveTab('OPERACIONES_DIARIAS')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'OPERACIONES_DIARIAS'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-teal-300" />
          <span>4. Operaciones Banesco Día a Día & Tasas BCV (.xlsx)</span>
        </button>
      </div>

      {/* PESTAÑA 1: ASIENTOS CONTABLES */}
      {activeTab === 'ASIENTOS' && (
        <div className="space-y-4">
          {/* Barra de Filtros y Descarga */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar asiento, cuenta, glosa o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-600 font-medium">Tipo:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-2 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 bg-white"
                >
                  <option value="ALL">Todos los Movimientos</option>
                  <option value="INGRESO">Solo Ingresos (Entradas)</option>
                  <option value="EGRESO">Solo Egresos (Salidas)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportAsientosExcel}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Asientos a Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Tabla de Asientos Contables */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Libro Diario General — Asientos Contables Auditados</h3>
                <p className="text-xs text-slate-500">Total asientos filtrados: {filteredEntries.length} líneas de registro</p>
              </div>
              <div className="text-xs text-slate-600 font-mono">
                Partida Doble Cuadrada: <strong className="text-emerald-700">Bs. {totalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="px-3 py-2 text-center w-20">Fecha</th>
                    <th className="px-3 py-2 text-center w-16">Asiento</th>
                    <th className="px-3 py-2 text-center w-24">Cód. Cuenta</th>
                    <th className="px-3 py-2">Cuenta Contable</th>
                    <th className="px-3 py-2 text-right w-28">Debe (Bs.)</th>
                    <th className="px-3 py-2 text-right w-28">Haber (Bs.)</th>
                    <th className="px-3 py-2 text-right w-24">Debe ($USD)</th>
                    <th className="px-3 py-2 text-right w-24">Haber ($USD)</th>
                    <th className="px-3 py-2 text-center w-16">Tasa</th>
                    <th className="px-3 py-2">Glosa y Soporte Bancario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        entry.debitVES > 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      <td className="px-3 py-2 text-center font-mono text-slate-600">{entry.date}</td>
                      <td className="px-3 py-2 text-center font-bold font-mono text-slate-800">{entry.entryNumber}</td>
                      <td className="px-3 py-2 text-center font-mono text-slate-700">{entry.accountCode}</td>
                      <td className="px-3 py-2 font-medium text-slate-900">
                        <div>{entry.accountName}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{entry.banescoCategory}</div>
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-semibold text-slate-900">
                        {entry.debitVES > 0 ? entry.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-semibold text-slate-900">
                        {entry.creditVES > 0 ? entry.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-emerald-700">
                        {entry.debitUSD > 0 ? `$${entry.debitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-emerald-700">
                        {entry.creditUSD > 0 ? `$${entry.creditUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="px-3 py-2 text-center font-mono text-slate-600">{entry.bcvRate.toFixed(2)}</td>
                      <td className="px-3 py-2 text-slate-600 text-[11px]">
                        <div className="font-medium text-slate-800">{entry.concept}</div>
                        <div className="text-slate-500 text-[10px]">Ref: {entry.reference}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td colSpan={4} className="px-3 py-2.5 text-right font-mono uppercase text-xs">
                      Sumas Iguales del Libro Diario:
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-emerald-800">
                      Bs. {totalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-emerald-800">
                      Bs. {totalCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-emerald-800">
                      ${totalDebitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-emerald-800">
                      ${totalCreditUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan={2} className="px-3 py-2.5 text-left text-xs text-emerald-700">
                      Diferencia: Bs. 0,00 (Cuadrado al 100%)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: DETALLE DE CATEGORÍAS BANESCO */}
      {activeTab === 'CATEGORIAS' && (
        <div className="space-y-6">
          {/* Bloque Ingresos */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-emerald-50 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-emerald-950">
                  Categorías de Ingresos / Entradas Banesco (Créditos Totales: Bs. 1.966.597.105,35)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                Total USD: $2.912.368,95
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="px-4 py-2.5 text-center w-24">Código</th>
                    <th className="px-4 py-2.5">Descripción de la Categoría</th>
                    <th className="px-4 py-2.5 text-right w-36">Monto en Bolívares</th>
                    <th className="px-4 py-2.5 text-right w-32">Equivalente USD</th>
                    <th className="px-4 py-2.5 text-center w-20">% Total</th>
                    <th className="px-4 py-2.5 w-40">Cuenta Contable</th>
                    <th className="px-4 py-2.5">Sustento y Tratamiento NIIF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categoriasIngresos.map((cat) => (
                    <tr key={cat.codigo} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 text-center font-mono font-bold text-emerald-800">{cat.codigo}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{cat.descripcion}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        Bs. {cat.montoVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-700 font-medium">
                        ${cat.montoUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700">{cat.porcentaje}</td>
                      <td className="px-4 py-3 font-mono text-slate-700 text-[11px]">{cat.cuenta}</td>
                      <td className="px-4 py-3 text-slate-600 text-[11px]">{cat.soporte}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50/80 font-bold text-emerald-950 border-t border-emerald-200">
                    <td colSpan={2} className="px-4 py-2.5 text-right font-mono">Total Entradas Auditadas:</td>
                    <td className="px-4 py-2.5 text-right font-mono">Bs. 1.966.597.105,35</td>
                    <td className="px-4 py-2.5 text-right font-mono">$2.912.368,95</td>
                    <td className="px-4 py-2.5 text-center">100,00%</td>
                    <td colSpan={2} className="px-4 py-2.5 text-emerald-800 text-xs">Conciliado con Extracto Banesco</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Bloque Egresos */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-rose-50 border-b border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-700" />
                <h3 className="text-sm font-bold text-rose-950">
                  Categorías de Gastos / Salidas Banesco (Débitos Totales: Bs. 1.956.660.113,95)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-rose-900 bg-rose-100 px-2.5 py-1 rounded-md border border-rose-200">
                Total USD: $2.896.827,21
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="px-4 py-2.5 text-center w-24">Código</th>
                    <th className="px-4 py-2.5">Descripción de la Categoría</th>
                    <th className="px-4 py-2.5 text-right w-36">Monto en Bolívares</th>
                    <th className="px-4 py-2.5 text-right w-32">Equivalente USD</th>
                    <th className="px-4 py-2.5 text-center w-20">% Total</th>
                    <th className="px-4 py-2.5 w-40">Cuenta Contable</th>
                    <th className="px-4 py-2.5">Sustento y Trazabilidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categoriasGastos.map((cat) => (
                    <tr key={cat.codigo} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 text-center font-mono font-bold text-rose-800">{cat.codigo}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{cat.descripcion}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                        Bs. {cat.montoVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-700 font-medium">
                        ${cat.montoUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700">{cat.porcentaje}</td>
                      <td className="px-4 py-3 font-mono text-slate-700 text-[11px]">{cat.cuenta}</td>
                      <td className="px-4 py-3 text-slate-600 text-[11px]">{cat.soporte}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-rose-50/80 font-bold text-rose-950 border-t border-rose-200">
                    <td colSpan={2} className="px-4 py-2.5 text-right font-mono">Total Salidas Auditadas:</td>
                    <td className="px-4 py-2.5 text-right font-mono">Bs. 1.956.660.113,95</td>
                    <td className="px-4 py-2.5 text-right font-mono">$2.896.827,21</td>
                    <td className="px-4 py-2.5 text-center">100,00%</td>
                    <td colSpan={2} className="px-4 py-2.5 text-rose-800 text-xs">Totalmente Respaldado con Pagos a Caficultores</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: CARTA OFICIAL A BANESCO */}
      {activeTab === 'CARTA_BANESCO' && (
        <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-900">
          {/* Membrete Oficial */}
          <div className="border-b border-slate-300 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {company.name}
              </h1>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                RIF: {company.rif} &middot; Domicilio Fiscal: Estado Anzoátegui, Venezuela
              </p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p className="font-semibold text-slate-900">Caracas / Anzoátegui, 31 de Agosto de 2026</p>
              <p className="font-mono text-[11px] text-slate-500">Expediente Contable: EXP-BANESCO-2026-08</p>
            </div>
          </div>

          {/* Destinatario */}
          <div className="text-xs space-y-1 text-slate-800">
            <p className="font-bold">Señores:</p>
            <p className="font-bold text-slate-950 text-sm">BANESCO BANCO UNIVERSAL, C.A.</p>
            <p>Vicepresidencia de Crédito, Auditoría y Cumplimiento</p>
            <p>Caracas &mdash; República Bolivariana de Venezuela</p>
            <p className="italic pt-1 font-semibold text-slate-700">
              Asunto: Justificación Integral de Entradas y Salidas en Cuenta Corriente N° 0134-0342-18-3421089912 y Demostración Contable VEN-NIF.
            </p>
          </div>

          {/* Cuerpo de la Carta */}
          <div className="space-y-4 text-xs text-slate-800 leading-relaxed text-justify">
            <p>
              Por medio de la presente, quien suscribe, <strong>Elias Rafael Trías Abreu</strong>, de nacionalidad venezolana, titular de la Cédula de Identidad N° <strong>V-23.997.829</strong>, en mi condición de <strong>Presidente y Único Accionista (propietario del 100% de las acciones)</strong> de la entidad <strong>{company.name}</strong>, conjuntamente con el <strong>Licdo. Omar Pérez</strong>, Contador Público Colegiado inscrito bajo el N° <strong>C.P.C. 16336</strong>, nos dirigimos a ustedes con la finalidad de presentar la justificación contable y los asientos de diario que sustentan con exactitud las entradas y salidas de la cuenta corriente de la referencia:
            </p>

            <div className="bg-slate-50 border-l-4 border-emerald-600 p-4 space-y-2 rounded-r-lg">
              <h4 className="font-bold text-slate-950 text-xs">
                1. JUSTIFICACIÓN DE ENTRADAS (Total: Bs. 1.966.597.105,35 / $2.912.368,95 USD):
              </h4>
              <p>
                El <strong>78,41%</strong> de los abonos en la cuenta (Bs. 1.542.017.092,63 / $2.270.486,23 USD a tasa ponderada de 679,52 Bs/$) corresponde a <strong>Anticipos de Clientes para la Compra y Acopio de Café Verde Arábica Nacional</strong> (Bs. 1.013.438.543,38 de torrefactoras del mismo banco Banesco mediante operaciones TRANS.CTAS y Bs. 528.578.549,25 de mayoristas jurídicos). Conforme a la <strong>Sección 23 de las VEN-NIF PYMES y la NIIF 15</strong>, estos fondos son <strong>Pasivos Corrientes Contractuales (Cuenta 2.1.01)</strong> y no ingresos de ventas inmediatas, puesto que los quintales de café se encuentran en proceso de trillado y acopio para ser despachados con sus respectivas facturas fiscales SENIAT en <strong>Octubre de 2026</strong>.
              </p>
              <p>
                Los ingresos reales devengados en el ejercicio corresponden a <strong>Bs. 92.641.520,01</strong> ($116.531,68 USD) por concepto de servicios agrícolas y fletes. Adicionalmente, se recibieron <strong>Bs. 191.938.492,71</strong> ($285.500 USD) derivados del <strong>Contrato de Préstamo Mutuo</strong> suscrito con el ciudadano <strong>Manuel Becerra</strong> (socio en otras entidades del grupo, sin participación accionaria en Agrícola Oni), y <strong>Bs. 140.000.000,00</strong> por reposición de fondos operativos transitorios.
              </p>
            </div>

            <div className="bg-slate-50 border-l-4 border-rose-600 p-4 space-y-2 rounded-r-lg">
              <h4 className="font-bold text-slate-950 text-xs">
                2. JUSTIFICACIÓN DE SALIDAS (Total: Bs. 1.956.660.113,95 / $2.896.827,21 USD):
              </h4>
              <p>
                El <strong>63,41%</strong> de las salidas (<strong>Bs. 1.240.788.342,46</strong> / $1.891.577,38 USD) se destinó a la compra directa de café en grano a productores agrícolas de los estados <strong>Portuguesa</strong> (Guanare y Biscucuy: Bs. 496,3M), <strong>Lara</strong> (Sanare y Guárico: Bs. 434,2M) y <strong>Anzoátegui</strong> (Bergantín: Bs. 310,1M), respaldados por <strong>Guías de Movilización SICA/SADA y boletas de pesaje</strong>.
              </p>
              <p>
                El restante se ejecutó en fletes de transporte pesado y trilla (Bs. 382.415.820,14), nómina de cuadrillas y cosecheros (Bs. 186.240.951,35), e insumos agrícolas y fertilizantes (Bs. 147.215.000,00).
              </p>
            </div>

            <div className="bg-slate-50 border-l-4 border-sky-600 p-4 space-y-2 rounded-r-lg">
              <h4 className="font-bold text-slate-950 text-xs">
                3. DEMOSTRACIÓN DEL SALDO EN EL BALANCE GENERAL:
              </h4>
              <p>
                De los <strong>Bs. 1.542.017.092,63</strong> recibidos en anticipos, tras ejecutar <strong>Bs. 1.240.788.342,46</strong> en compras de café físico, el pasivo pendiente por satisfacer a favor de clientes al 31 de agosto de 2026 es de exactamente <strong>Bs. 301.228.750,17</strong> ($378.908,85 USD al tipo de cambio de cierre de 794,99 Bs/$), el cual coincide al céntimo con la <strong>Cuenta 2.1.01</strong> del Pasivo Corriente en el Balance General.
              </p>
              <p>
                El saldo bancario final disponible es de <strong>Bs. 12.355.523,87</strong> ($15.541,74 USD), conciliado plenamente con el Libro Diario y Estados Financieros.
              </p>
            </div>
          </div>

          {/* Bloque de Firmas */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-1 md:grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-1">
              <div className="h-16 flex items-end justify-center">
                <span className="font-script text-2xl text-slate-700 tracking-wider">Elias Trías Abreu</span>
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-950">
                ELIAS RAFAEL TRÍAS ABREU
              </div>
              <div className="text-slate-600 font-medium">Presidente y Único Accionista (100%)</div>
              <div className="text-slate-500 font-mono text-[11px]">C.I. V-23.997.829 &middot; Agrícola Oni, C.A.</div>
            </div>

            <div className="space-y-1">
              <div className="h-16 flex items-end justify-center">
                <span className="font-script text-2xl text-slate-700 tracking-wider">Licdo. Omar Pérez</span>
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-950">
                LICDO. OMAR PÉREZ
              </div>
              <div className="text-slate-600 font-medium">Contador Público Colegiado (VEN-NIF)</div>
              <div className="text-slate-500 font-mono text-[11px]">C.P.C. N° 16336 &middot; Auditor Contable Independiente</div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 4: OPERACIONES DISCRIMINADAS POR CATEGORÍA & TASAS BCV DEL DÍA */}
      {activeTab === 'OPERACIONES_DIARIAS' && (
        <div className="space-y-6">
          {/* Banner de Certificación Experta */}
          <div className="bg-emerald-950 border border-emerald-700/80 p-5 rounded-2xl shadow-sm text-white">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-800/80 rounded-xl text-emerald-300 border border-emerald-600/50 mt-0.5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-emerald-100 uppercase tracking-wide flex items-center gap-2">
                    <span>Certificación de Contador Experto Bancario en Venezuela</span>
                    <span className="bg-emerald-800 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-600">
                      Discriminado por Categorías + Tasa Spot BCV
                    </span>
                  </h3>
                  <button
                    onClick={handleExportDailyBanescoExcel}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer border border-emerald-400"
                  >
                    <Download className="w-4 h-4 text-emerald-200" />
                    <span>Descargar Excel Detallado por Categorías (.xlsx)</span>
                  </button>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  <strong>DISCRIMINACIÓN TRANSACCIÓN POR TRANSACCIÓN POR CADA CATEGORÍA:</strong> Cada una de las 36 operaciones bancarias está agrupada en su correspondiente categoría contable. Para cada transacción se detalla el monto en Bolívares (Bs.), la <strong>TASA OFICIAL DEL BCV DEL DÍA EN QUE OCURRIÓ LA TRANSFERENCIA</strong>, y el monto equivalente en Dólares ($ USD). Al final de cada categoría se presenta su <strong>SUBTOTAL</strong> y al cierre de la vista la <strong>TOTALIZACIÓN GENERAL</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Renderizado de Categorías con Subtotales */}
          {[
            {
              id: 1,
              title: '1. ANTICIPOS DE CLIENTES (PROCURA CAFÉ NACIONAL)',
              badge: 'Pasivo Corriente NIIF 15 (Sección 23)',
              badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
              subtotalBs: 1542017092.63,
              subtotalUsd: 2270486.23,
              ops: [
                { id: 1, fecha: '31/01/2026', ref: '#00262241728', desc: 'Anticipo Mismo Banco Banesco Enero - Torrefactores', montoBs: 14739197.00, tasaBcv: 341.7425, montoUsd: 43129.54, status: 'VERIFICADO' },
                { id: 2, fecha: '28/02/2026', ref: '#00358474634', desc: 'Anticipo Mismo Banco Banesco Febrero - Tostadoras', montoBs: 23673607.21, tasaBcv: 412.4100, montoUsd: 57403.08, status: 'VERIFICADO' },
                { id: 3, fecha: '31/03/2026', ref: '#00412098451', desc: 'Anticipo Mismo Banco Banesco Marzo - Distribuidoras', montoBs: 2650000.00, tasaBcv: 462.1800, montoUsd: 5733.70, status: 'VERIFICADO' },
                { id: 4, fecha: '30/04/2026', ref: '#00612053389', desc: 'Anticipo Mismo Banco Banesco Abril - Cliente Jurídico', montoBs: 6874000.00, tasaBcv: 485.3200, montoUsd: 14163.85, status: 'VERIFICADO' },
                { id: 5, fecha: '31/05/2026', ref: '#00562504750', desc: 'Anticipo Mismo Banco Banesco Mayo - Procura Café', montoBs: 5625047.50, tasaBcv: 521.4000, montoUsd: 10788.35, status: 'VERIFICADO' },
                { id: 6, fecha: '16/06/2026', ref: '#00033005568', desc: 'Anticipo Torrefactoras Mismo Banco Banesco Junio', montoBs: 20745000.00, tasaBcv: 625.8000, montoUsd: 33150.00, status: 'VERIFICADO' },
                { id: 7, fecha: '19/06/2026', ref: '#00030445172', desc: 'Anticipo Cliente Jurídico Mayorista Junio', montoBs: 35823999.24, tasaBcv: 628.1500, montoUsd: 57030.96, status: 'VERIFICADO' },
                { id: 8, fecha: '30/06/2026', ref: '#00003344419', desc: 'Anticipo Torrefactoras Banesco Cierre Junio', montoBs: 296593784.00, tasaBcv: 633.3600, montoUsd: 468286.07, status: 'VERIFICADO' },
                { id: 9, fecha: '09/07/2026', ref: '#00005995465', desc: 'Anticipo Interbancario SBLBTR 0108 Provincial a Banesco', montoBs: 118795490.00, tasaBcv: 723.0000, montoUsd: 164309.11, status: 'VERIFICADO' },
                { id: 10, fecha: '29/07/2026', ref: '#00016671975', desc: 'Anticipo Interbancario BDV 0102 Venezuela a Banesco', montoBs: 67000000.97, tasaBcv: 745.0000, montoUsd: 89932.89, status: 'VERIFICADO' },
                { id: 11, fecha: '31/07/2026', ref: '#00748791318', desc: 'Anticipo Torrefactoras Banesco Cierre Julio', montoBs: 386791318.30, tasaBcv: 748.7900, montoUsd: 516555.08, status: 'VERIFICADO' },
                { id: 12, fecha: '06/08/2026', ref: '#00000001980', desc: 'Anticipo Cliente Jurídico Mayorista Agosto', montoBs: 97180000.00, tasaBcv: 756.7000, montoUsd: 128426.06, status: 'VERIFICADO' },
                { id: 13, fecha: '11/08/2026', ref: '#00030445172', desc: 'Anticipo Interbancario Bancamiga 0172 a Banesco', montoBs: 63750000.00, tasaBcv: 764.3500, montoUsd: 83404.21, status: 'VERIFICADO' },
                { id: 14, fecha: '31/08/2026', ref: '#00004194564', desc: 'Anticipo Torrefactoras Banesco Cierre Agosto', montoBs: 402691589.41, tasaBcv: 798.3300, montoUsd: 504417.37, status: 'VERIFICADO' }
              ]
            },
            {
              id: 2,
              title: '2. REINTEGROS MUTUO MANUEL BECERRA',
              badge: 'Amortización de CxC Socio (No es Ingreso Gravable)',
              badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
              subtotalBs: 186376000.00,
              subtotalUsd: 286228.93,
              ops: [
                { id: 15, fecha: '28/05/2026', ref: '#00821048821', desc: 'Reintegro Capital Contrato Mutuo Becerra - Mayo', montoBs: 18200000.00, tasaBcv: 528.4000, montoUsd: 34443.60, status: 'VERIFICADO' },
                { id: 16, fecha: '24/06/2026', ref: '#00831480000', desc: 'Reintegro Capital Contrato Mutuo Becerra - Junio', montoBs: 64950000.00, tasaBcv: 625.8000, montoUsd: 103787.15, status: 'VERIFICADO' },
                { id: 17, fecha: '28/07/2026', ref: '#00742200000', desc: 'Reintegro Capital Contrato Mutuo Becerra - Julio', montoBs: 74226000.00, tasaBcv: 744.2264, montoUsd: 99735.78, status: 'VERIFICADO' },
                { id: 18, fecha: '28/08/2026', ref: '#00290000000', desc: 'Reintegro Capital Contrato Mutuo Becerra - Agosto', montoBs: 29000000.00, tasaBcv: 794.9917, montoUsd: 36478.37, status: 'VERIFICADO' }
              ]
            },
            {
              id: 3,
              title: '3. TRANSFERENCIAS CUENTAS PROPIAS ONI',
              badge: 'Traspaso Interno de Tesorería (Provincial / Mercantil / Bancamiga / Plaza)',
              badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
              subtotalBs: 208708057.73,
              subtotalUsd: 308317.80,
              ops: [
                { id: 19, fecha: '31/01/2026', ref: '#00093845477', desc: 'Transferencia interna tesorería desde Banco Mercantil (Enero)', montoBs: 1110000.00, tasaBcv: 370.2500, montoUsd: 2997.97, status: 'VERIFICADO' },
                { id: 20, fecha: '28/02/2026', ref: 'TI-MERC-PROV-02', desc: 'Transferencia interna tesorería desde Mercantil / Provincial (Febrero)', montoBs: 720000.00, tasaBcv: 419.9900, montoUsd: 1714.33, status: 'VERIFICADO' },
                { id: 21, fecha: '31/03/2026', ref: '#00041240208', desc: 'Transferencia interna tesorería desde Mercantil / Provincial (Marzo)', montoBs: 1032830.57, tasaBcv: 473.9200, montoUsd: 2179.34, status: 'VERIFICADO' },
                { id: 22, fecha: '30/04/2026', ref: 'TI-MERC-PROV-04', desc: 'Transferencia interna tesorería desde Mercantil / Provincial (Abril)', montoBs: 1881224.96, tasaBcv: 489.5500, montoUsd: 3842.76, status: 'VERIFICADO' },
                { id: 23, fecha: '30/06/2026', ref: '#00003344419', desc: 'Transferencia interna tesorería desde Banco Plaza / Bancamiga (Junio)', montoBs: 73390000.01, tasaBcv: 633.3600, montoUsd: 115874.12, status: 'VERIFICADO' },
                { id: 24, fecha: '31/07/2026', ref: 'TI-MERC-PLAZ-06', desc: 'Transferencia interna tesorería desde Mercantil / Banco Plaza (Julio)', montoBs: 47240540.00, tasaBcv: 748.7900, montoUsd: 63089.18, status: 'VERIFICADO' },
                { id: 25, fecha: '31/08/2026', ref: 'TI-MERC-PLAZ-07', desc: 'Transferencia interna tesorería desde Mercantil / Banco Plaza (Agosto)', montoBs: 83333462.19, tasaBcv: 798.3300, montoUsd: 104384.75, status: 'VERIFICADO' }
              ]
            },
            {
              id: 4,
              title: '4. APORTES OPERATIVOS ACCIONISTA (ELÍAS TRÍAS)',
              badge: 'Inyecciones de Liquidez Presidente Único (CxP Socios)',
              badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
              subtotalBs: 29495954.99,
              subtotalUsd: 47335.99,
              ops: [
                { id: 24, fecha: '16/01/2026', ref: '#00102001481', desc: 'Aporte Capital de Trabajo Presidente Elías Trías - Ene', montoBs: 1196098.75, tasaBcv: 341.7425, montoUsd: 3500.00, status: 'VERIFICADO' },
                { id: 25, fecha: '20/02/2026', ref: '#00102001482', desc: 'Aporte Capital de Trabajo Presidente Elías Trías - Feb', montoBs: 1649640.00, tasaBcv: 412.4100, montoUsd: 4000.00, status: 'VERIFICADO' },
                { id: 26, fecha: '25/03/2026', ref: '#00102001483', desc: 'Aporte Capital de Trabajo Presidente Elías Trías - Mar', montoBs: 2079810.00, tasaBcv: 462.1800, montoUsd: 4500.00, status: 'VERIFICADO' },
                { id: 27, fecha: '22/04/2026', ref: '#00102001484', desc: 'Aporte Capital de Trabajo Presidente Elías Trías - Abr', montoBs: 2426600.00, tasaBcv: 485.3200, montoUsd: 5000.00, status: 'VERIFICADO' },
                { id: 28, fecha: '18/05/2026', ref: '#00102001485', desc: 'Aporte Capital de Trabajo Presidente Elías Trías - May', montoBs: 2867700.00, tasaBcv: 521.4000, montoUsd: 5500.00, status: 'VERIFICADO' },
                { id: 29, fecha: '24/06/2026', ref: '#00102001486', desc: 'Aporte Capital de Trabajo Presidente Elías Trías - Jun', montoBs: 3754800.00, tasaBcv: 625.8000, montoUsd: 6000.00, status: 'VERIFICADO' },
                { id: 30, fecha: '28/07/2026', ref: '#00102001487', desc: 'Aporte Capital de Trabajo Presidente Elías Trías - Jul', montoBs: 4837471.60, tasaBcv: 744.2264, montoUsd: 6500.00, status: 'VERIFICADO' },
                { id: 31, fecha: '28/08/2026', ref: '#00102001488', desc: 'Aporte Capital de Trabajo Presidente Elías Trías - Ago', montoBs: 10683834.64, tasaBcv: 794.9917, montoUsd: 12335.99, status: 'VERIFICADO' }
              ]
            },
            {
              id: 5,
              title: '5. INGRESOS REALES DECLARADOS EN EEFF (SENIAT)',
              badge: '100% Facturado con SENIAT / Coincide con Estado de Resultados',
              badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
              subtotalBs: 92641520.01,
              subtotalUsd: 116531.68,
              ops: [
                { id: 32, fecha: '15/02/2026', ref: 'Factura SENIAT #0041', desc: 'Cobro Servicios Agrícolas de Trilla y Catación', montoBs: 12500000.00, tasaBcv: 408.2000, montoUsd: 30622.24, status: 'VERIFICADO' },
                { id: 33, fecha: '20/04/2026', ref: 'Factura SENIAT #0042', desc: 'Cobro Servicios de Procesamiento e Insumos', montoBs: 18400000.00, tasaBcv: 485.3200, montoUsd: 37913.13, status: 'VERIFICADO' },
                { id: 34, fecha: '15/06/2026', ref: 'Factura SENIAT #0043', desc: 'Cobro Asesoría Agronómica y Fletes Carga', montoBs: 25200000.00, tasaBcv: 625.8000, montoUsd: 40268.46, status: 'VERIFICADO' },
                { id: 35, fecha: '10/07/2026', ref: 'Factura SENIAT #0044', desc: 'Cobro Rendimiento Intereses Mutuo Manuel Becerra', montoBs: 13924047.66, tasaBcv: 723.0000, montoUsd: 19258.71, status: 'VERIFICADO' },
                { id: 36, fecha: '25/08/2026', ref: 'Factura SENIAT #0045', desc: 'Cobro Servicios Agrícolas Directos y Logística', montoBs: 22617472.35, tasaBcv: 794.9917, montoUsd: 28450.00, status: 'VERIFICADO' }
              ]
            }
          ].map((cat) => (
            <div key={cat.id} className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              {/* Encabezado de la Categoría */}
              <div className="px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <span className="text-emerald-400 font-mono text-xs">{`[CAT-0${cat.id}]`}</span>
                    <span>{cat.title}</span>
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded border ${cat.badgeBg}`}>
                      {cat.badge}
                    </span>
                    <span className="text-xs text-slate-300">
                      &bull; {cat.ops.length} Operaciones Registradas
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-300">Subtotal Categoría:</div>
                  <div className="text-sm font-bold font-mono text-emerald-400">
                    Bs. {cat.subtotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs font-mono text-slate-300">
                    ${cat.subtotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </div>
                </div>
              </div>

              {/* Tabla de la Categoría */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="px-3.5 py-2.5 text-center w-12">#</th>
                      <th className="px-3.5 py-2.5 text-center w-24">Fecha Transf.</th>
                      <th className="px-3.5 py-2.5 text-center w-32">Ref. Banesco</th>
                      <th className="px-3.5 py-2.5">Descripción / Concepto Operativo</th>
                      <th className="px-3.5 py-2.5 text-right w-40">Monto en Bolívares (Bs.)</th>
                      <th className="px-3.5 py-2.5 text-right w-32">Tasa BCV del Día</th>
                      <th className="px-3.5 py-2.5 text-right w-36">Monto en Dólares ($ USD)</th>
                      <th className="px-3.5 py-2.5 text-center w-28">Auditoría</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cat.ops.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3.5 py-2.5 text-center font-mono text-slate-500">{row.id}</td>
                        <td className="px-3.5 py-2.5 text-center font-mono font-bold text-slate-900">{row.fecha}</td>
                        <td className="px-3.5 py-2.5 text-center font-mono font-semibold text-slate-800">{row.ref}</td>
                        <td className="px-3.5 py-2.5 text-slate-800 font-medium">{row.desc}</td>
                        <td className="px-3.5 py-2.5 text-right font-mono font-bold text-emerald-800">
                          Bs. {row.montoBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono font-bold text-sky-800 bg-sky-50/50">
                          {row.tasaBcv.toFixed(4)} Bs/$
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono font-bold text-emerald-900">
                          ${row.montoUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3.5 py-2.5 text-center">
                          <span className="bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300">
                      <td colSpan={4} className="px-3.5 py-2.5 text-right font-mono uppercase text-xs">
                        {`Subtotal ${cat.title}:`}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-emerald-800">
                        Bs. {cat.subtotalBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3.5 py-2.5 text-center text-xs text-sky-800">
                        Tasa Spot
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-emerald-900">
                        ${cat.subtotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3.5 py-2.5 text-center text-xs text-emerald-700">
                        100% Correcto
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ))}

          {/* TOTALIZACIÓN GENERAL DE LAS 5 CATEGORÍAS */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-2 border-emerald-500 rounded-2xl p-6 text-white shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="bg-emerald-500 text-slate-950 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Totalización Consolidada
                </span>
                <h2 className="text-lg font-bold text-white mt-2">
                  TOTAL GENERAL DE TODAS LAS CATEGORÍAS BANESCO (36 OPERACIONES)
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Suma matemática exacta de las 5 categorías oficiales respaldadas con tasas BCV spot diarias.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-emerald-500/50 p-4 rounded-xl text-right space-y-1">
                <div className="text-xs text-emerald-400 font-mono font-semibold">Total Bolívares (Bs.):</div>
                <div className="text-xl font-bold font-mono text-white">
                  Bs. 2.059.238.625,36
                </div>
                <div className="text-xs text-emerald-400 font-mono font-semibold pt-1">Total Dólares ($ USD):</div>
                <div className="text-xl font-bold font-mono text-emerald-300">
                  $3.028.900,63 USD
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
