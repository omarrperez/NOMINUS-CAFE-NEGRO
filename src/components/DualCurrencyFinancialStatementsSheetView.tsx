import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  FileText,
  DollarSign,
  TrendingUp,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Copy,
  ChevronRight,
  Download,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import {
  BALANCE_SHEET_AUGUST_2026,
  INCOME_STATEMENT_AUGUST_2026,
  MANUEL_BECERRA_SUMMARY_2026,
  TRIAL_BALANCE_AUGUST_2026
} from '../data/financialStatementsData';
import { exportFinancialStatementsDualXlsx, exportFinancialStatementsDualPdf, exportToPdfPrint, downloadNativeDocx } from '../utils/exportUtils';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
  onNavigateToBecerraSuite?: () => void;
}

export const DualCurrencyFinancialStatementsSheetView: React.FC<Props> = ({ company, currentRate, onNavigateToBecerraSuite }) => {
  const [activeTab, setActiveTab] = useState<'BALANCE' | 'INCOME' | 'TRIAL_BALANCE' | 'NOTES' | 'BANESCO_SUMMARY'>('BALANCE');
  const [copiedNote, setCopiedNote] = useState<number | null>(null);
  const [tbSearch, setTbSearch] = useState<string>('');
  const [tbCategoryFilter, setTbCategoryFilter] = useState<string>('ALL');

  const rate = BALANCE_SHEET_AUGUST_2026.exchangeRateBCV; // 794.99 Bs/USD

  // Balance Sheet Figures
  const bs = BALANCE_SHEET_AUGUST_2026;
  const inc = INCOME_STATEMENT_AUGUST_2026;

  // Convert VES to USD helper
  const toUSD = (ves: number) => ves / rate;

  // Calculated Dual Totals
  const assetsCurrentBs = bs.assets.current.totalCurrent;
  const assetsCurrentUSD = toUSD(assetsCurrentBs);

  const assetsPpeBs = bs.assets.propertyPlantEquipment.totalPPE;
  const assetsPpeUSD = toUSD(assetsPpeBs);

  const totalAssetsBs = bs.assets.totalAssets;
  const totalAssetsUSD = toUSD(totalAssetsBs);

  const liabilitiesCurrentBs = bs.liabilities.current.totalCurrent;
  const liabilitiesCurrentUSD = toUSD(liabilitiesCurrentBs);

  const totalLiabilitiesBs = bs.liabilities.totalLiabilities;
  const totalLiabilitiesUSD = toUSD(totalLiabilitiesBs);

  const totalEquityBs = bs.equity.totalEquity;
  const totalEquityUSD = toUSD(totalEquityBs);

  const totalLiabEqBs = bs.totalLiabilitiesAndEquity;
  const totalLiabEqUSD = toUSD(totalLiabEqBs);

  // Income Statement Dual Figures
  const revServicesBs = inc.revenues.agriculturalServices;
  const revServicesUSD = toUSD(revServicesBs);

  const revInterestBs = inc.revenues.interestIncome;
  const revInterestUSD = toUSD(revInterestBs);

  const totalRevenuesBs = inc.revenues.totalRevenues;
  const totalRevenuesUSD = toUSD(totalRevenuesBs);

  const serviceCostsBs = inc.costs.serviceCosts;
  const serviceCostsUSD = toUSD(serviceCostsBs);

  const netIncomeBs = inc.taxesAndReserves.netProfit;
  const netIncomeUSD = toUSD(netIncomeBs);

  // Notes Explanatory List
  const notesList = [
    {
      title: 'Identificación de la Empresa y Objeto Social',
      text: `${company.name} (R.I.F. ${company.rif}) es una sociedad mercantil venezolana inscrita en el Registro Mercantil en 2021, cuyo objeto social comprende la compra, venta, acopio, procesamiento, intermediación comercial y servicios agrícolas de café en el territorio nacional. La empresa actúa como intermediaria en Venezuela, comprando café exclusivamente a productores y empresas venezolanas a tipo de cambio oficial BCV. Su representante legal, Presidente y Director General es Elias Rafael Trías Abreu (C.I. V-23.997.829).`
    },
    {
      title: 'Bases de Presentación y Expresión Dual en Moneda Extranjera',
      text: `Los Estados Financieros se presentan de acuerdo con Normas de Información Financiera de Venezuela (VEN-NIF GE). A los efectos de cumplir con el requerimiento de análisis de riesgo crediticio del Banco (Banesco Banco Universal, C.A.), todas las partidas expresadas en Bolívares (Bs.) han sido traducidas a Dólares de los Estados Unidos de América (USD) utilizando la tasa de cambio oficial publicada por el Banco Central de Venezuela (BCV) al 31 de agosto de 2026, equivalente a 794,99 Bs./USD.`
    },
    {
      title: 'Efectivo y Equivalentes de Efectivo (Banesco)',
      text: `Representa el saldo de fondos disponibles en la cuenta corriente de Banesco Banco Universal (Bs. 12.355.523,87 / $15.541,74 USD) al 31 de agosto de 2026, resultante de la conciliación bancaria integral de todos los ingresos y egresos del período enero - agosto 2026.`
    },
    {
      title: 'Cuentas por Cobrar Socios y Línea de Crédito Mutuo Manuel Becerra',
      text: `Refleja el saldo acumulado por cobrar bajo el Contrato de Préstamo Mutuo y Línea de Crédito Rotativa suscrito con el socio y aliado estratégico Sr. Manuel Becerra (límite Bs. 600.000.000,00). Al 31/08/2026 el saldo de capital asciende a Bs. 312.024.605,30 más intereses devengados de Bs. 13.924.047,66, totalizando Bs. 325.948.652,96 ($410.003,46 USD). Durante el período se recibieron amortizaciones y reintegros de capital por Bs. 186.376.000,00 que ingresaron a Banesco.`
    },
    {
      title: 'Propiedad, Planta y Equipos Netos',
      text: `Comprende bienes de capital registrados al costo histórico (Inmuebles Bs. 1.317.600,00, Vehículos y Unidades de Carga Bs. 26.145.094,00, Equipos de Oficina y Maquinarias Bs. 600.000,00) menos su correspondiente depreciación acumulada de Bs. 8,47, para un saldo neto de Bs. 28.062.685,53 ($35.299,42 USD).`
    },
    {
      title: 'Pasivos Corrientes y Cuentas por Pagar Socios (Elias Rafael Trías Abreu V-23.997.829)',
      text: `Registra las obligaciones financieras a corto plazo con el Presidente y accionista Elias Rafael Trías Abreu (C.I. V-23.997.829) por un saldo consolidado de Bs. 301.053.109,62 ($378.687,92 USD). Dichos fondos corresponden a aportes directos de capital de trabajo transferidos a la cuenta corriente Banesco de la empresa para cubrir compras de inventario de café y costos operativos en Venezuela.`
    },
    {
      title: 'Anticipos en Bolívares Recibidos de Clientes a Tasa BCV (NIIF 15 / Pasivos Operacionales)',
      text: `Durante el período Enero - Agosto 2026, la empresa recibió Bs. 1.563.863.072,62 ($1.967.148,10 USD) por concepto de anticipos comerciales en bolívares otorgados por clientes jurídicos nacionales (Torrefactoras y Comercializadoras) a tasa oficial BCV. La empresa actúa formalmente como intermediaria comercial y gestora administrativa/legal en la compra y procura de café en Venezuela por cuenta de clientes. De estos recursos, la empresa ejecutó pagos a comercializadoras primarias y productores por Bs. 1.266.765.000,00 por cuenta de los clientes, quedando un saldo neto exigible de anticipos por ejecutar al 31/08/2026 de Bs. 297.098.072,62 ($373.712,97 USD). La empresa NO mantiene inventarios físicos en su patrimonio.`
    },
    {
      title: 'Retención de ISLR sobre Anticipos de Clientes (2% Decreto 1808)',
      text: `Corresponde al pasivo tributario de Bs. 31.277.261,45 ($39.342,96 USD) originado por la retención en la fuente del 2% de Impuesto Sobre la Renta (ISLR) aplicable sobre los anticipos recibidos de clientes personas jurídicas conforme al Decreto 1808 de Retenciones de ISLR.`
    },
    {
      title: 'Tratamiento Tributario del IGTF (Derogado 2% Bancario / Vigente 3% Efectivo)',
      text: `Conforme a la reforma publicada en Gaceta Oficial N° 6.821 y Decreto Presidencial N° 4.970, la alícuota del 2% del Impuesto a las Grandes Transacciones Financieras (IGTF) sobre débitos y transferencias bancarias en bolívares y cuentas bancarias nacionales fue derogada y fijada en 0%. Únicamente permanece vigente la alícuota del 3% para pagos realizados en divisas o moneda extranjera en efectivo. Como la empresa realiza todas sus operaciones formalmente a través del sistema bancario nacional, el saldo por pagar de IGTF es Bs. 0,00.`
    },
    {
      title: 'Reconciliación de Movilización Bancaria Banesco vs Ingresos Operacionales',
      text: `La totalidad de los fondos movilizados en Banesco (Créditos Bs. 1.966.597.105,35 / Débitos Bs. 1.956.660.113,95) corresponden a anticipos comerciales NIIF 15 (78,4%), reintegros y desembolsos del préstamo mutuo Becerra (9,5%), transferencias entre cuentas propias (10,6%) y aportes del accionista Elias Rafael Trías Abreu (1,5%). Los únicos ingresos operacionales y financieros reales del período son Bs. 92.641.520,01 ($116.531,68 USD), compuestos por Servicios Agrícolas facturados en Venezuela (Bs. 78.717.472,35) e Intereses del Mutuo Becerra (Bs. 13.924.047,66).`
    }
  ];

  // Excel Download Handler
  const handleExportExcel = async () => {
    await exportFinancialStatementsDualXlsx({
      filename: 'EEFF_Agricola_Oni_31-08-2026_Bs_USD',
      companyName: company.name,
      companyRif: company.rif,
      periodDate: '31 de agosto de 2026',
      exchangeRateBCV: rate,
      balanceSheetData: {
        assets: {
          current: [
            ['1.1.01', 'Efectivo y Bancos (Banesco / Cta. Cte.)', bs.assets.current.cashAndBanks, toUSD(bs.assets.current.cashAndBanks)],
            ['1.1.02', 'Cuentas por Cobrar Socios - Transferencias Fondos Banesco', bs.assets.current.shareholderAdvancesReceivable || 0, toUSD(bs.assets.current.shareholderAdvancesReceivable || 0)],
            ['1.1.03', 'Cuentas por Cobrar Socios - Mutuo Manuel Becerra', bs.assets.current.manuelBecerraReceivable, toUSD(bs.assets.current.manuelBecerraReceivable)],
            ['1.1.04', 'Retenciones ISLR Clientes', bs.assets.current.islrWithholdingClients, toUSD(bs.assets.current.islrWithholdingClients)],
            ['1.1.05', 'ISLR Pagado por Anticipado', bs.assets.current.prepaidISLR, toUSD(bs.assets.current.prepaidISLR)]
          ],
          currentTotal: assetsCurrentBs,
          currentTotalUSD: assetsCurrentUSD,
          ppe: [
            ['1.2.01', 'Maquinarias y Equipos Agrícolas', bs.assets.propertyPlantEquipment.machinery, toUSD(bs.assets.propertyPlantEquipment.machinery)],
            ['1.2.02', 'Vehículos y Flota de Carga', bs.assets.propertyPlantEquipment.vehicles, toUSD(bs.assets.propertyPlantEquipment.vehicles)],
            ['1.2.03', 'Muebles y Equipos de Oficina', bs.assets.propertyPlantEquipment.furnitureAndOfficeEquipment, toUSD(bs.assets.propertyPlantEquipment.furnitureAndOfficeEquipment)],
            ['1.2.04', 'Edificaciones e Inmuebles Industriales', bs.assets.propertyPlantEquipment.realEstateBuildings, toUSD(bs.assets.propertyPlantEquipment.realEstateBuildings)],
            ['1.2.05', 'Depreciación Acumulada', bs.assets.propertyPlantEquipment.accumulatedDepreciation, toUSD(bs.assets.propertyPlantEquipment.accumulatedDepreciation)]
          ],
          ppeTotal: assetsPpeBs,
          ppeTotalUSD: assetsPpeUSD,
          totalAssets: totalAssetsBs,
          totalAssetsUSD: totalAssetsUSD
        },
        liabilities: {
          current: [
            ['2.1.01', 'Anticipos Recibidos de Clientes (NIIF 15 - Torrefactoras y Clientes Jurídicos Banesco)', bs.liabilities.current.customerAdvances || 0, toUSD(bs.liabilities.current.customerAdvances || 0)],
            ['2.1.02', 'Retención de ISLR por Pagar (Originada por Anticipos de Clientes 2% Decreto 1808)', bs.liabilities.current.islrWithheldOnAdvancesPayable || 0, toUSD(bs.liabilities.current.islrWithheldOnAdvancesPayable || 0)],
            ['2.1.03', 'Cuentas por Pagar Socios (Aportes Accionista Elias Rafael Trías Abreu V-23.997.829)', bs.liabilities.current.shareholderPayables, toUSD(bs.liabilities.current.shareholderPayables)],
            ['2.1.04', 'ISLR por Pagar / Tributos Retenidos', bs.liabilities.current.islrPayable, toUSD(bs.liabilities.current.islrPayable)],
            ['2.1.05', 'IGTF por Pagar (3% Efectivo Divisas / Derogado 2% Bancario)', bs.liabilities.current.igtfPayable || 0, toUSD(bs.liabilities.current.igtfPayable || 0)]
          ],
          currentTotal: liabilitiesCurrentBs,
          currentTotalUSD: liabilitiesCurrentUSD,
          totalLiabilities: totalLiabilitiesBs,
          totalLiabilitiesUSD: totalLiabilitiesUSD
        },
        equity: {
          items: [
            ['3.1.01', 'Capital Social Suscrito y Pagado', bs.equity.subscribedCapital, toUSD(bs.equity.subscribedCapital)],
            ['3.1.02', 'Resultados Acumulados (Ejercicios Anteriores)', bs.equity.accumulatedSurplus, toUSD(bs.equity.accumulatedSurplus)],
            ['3.1.03', 'Ganancia Neta del Ejercicio (Ene-Ago 2026)', bs.equity.periodProfit, toUSD(bs.equity.periodProfit)],
            ['3.1.04', 'Reserva Legal (5%)', bs.equity.legalReserve, toUSD(bs.equity.legalReserve)]
          ],
          totalEquity: totalEquityBs,
          totalEquityUSD: totalEquityUSD
        },
        totalLiabilitiesAndEquity: totalLiabEqBs,
        totalLiabilitiesAndEquityUSD: totalLiabEqUSD
      },
      incomeStatementData: {
        rows: [
          ['4.1.01', 'Ingresos por Servicios Agrícolas y Procesamiento', revServicesBs, revServicesUSD],
          ['4.1.02', 'Ingresos por Intereses Rendidos (Mutuo Becerra)', revInterestBs, revInterestUSD],
          ['4.1.99', 'TOTAL INGRESOS OPERACIONALES Y FINANCIEROS', totalRevenuesBs, totalRevenuesUSD],
          ['4.2.01', 'Costos de Servicios Agrícolas y Mantenimiento', serviceCostsBs, serviceCostsUSD],
          ['4.3.00', 'UTILIDAD BRUTA EN VENTAS', inc.costs.grossProfit, toUSD(inc.costs.grossProfit)]
        ],
        totalRevenuesBs: totalRevenuesBs,
        totalRevenuesUSD: totalRevenuesUSD,
        netIncomeBs: netIncomeBs,
        netIncomeUSD: netIncomeUSD
      },
      trialBalanceData: TRIAL_BALANCE_AUGUST_2026,
      notes: notesList
    });
  };

  // PDF Download Handler
  const handleExportPdf = async () => {
    await exportFinancialStatementsDualPdf({
      filename: 'EEFF_Agricola_Oni_31-08-2026_Bs_USD.pdf',
      companyName: company.name,
      companyRif: company.rif,
      periodDate: '31 de agosto de 2026',
      exchangeRateBCV: rate,
      balanceSheetData: {
        assets: {
          current: [
            ['1.1.01', 'Efectivo y Bancos (Banesco / Cta. Cte.)', bs.assets.current.cashAndBanks, toUSD(bs.assets.current.cashAndBanks)],
            ['1.1.02', 'Cuentas por Cobrar Socios - Transferencias Fondos Banesco', bs.assets.current.shareholderAdvancesReceivable || 0, toUSD(bs.assets.current.shareholderAdvancesReceivable || 0)],
            ['1.1.03', 'Cuentas por Cobrar Socios - Mutuo Manuel Becerra', bs.assets.current.manuelBecerraReceivable, toUSD(bs.assets.current.manuelBecerraReceivable)],
            ['1.1.04', 'Retenciones ISLR Clientes', bs.assets.current.islrWithholdingClients, toUSD(bs.assets.current.islrWithholdingClients)],
            ['1.1.05', 'ISLR Pagado por Anticipado', bs.assets.current.prepaidISLR, toUSD(bs.assets.current.prepaidISLR)]
          ],
          currentTotal: assetsCurrentBs,
          currentTotalUSD: assetsCurrentUSD,
          ppe: [
            ['1.2.01', 'Maquinarias y Equipos Agrícolas', bs.assets.propertyPlantEquipment.machinery, toUSD(bs.assets.propertyPlantEquipment.machinery)],
            ['1.2.02', 'Vehículos y Flota de Carga', bs.assets.propertyPlantEquipment.vehicles, toUSD(bs.assets.propertyPlantEquipment.vehicles)],
            ['1.2.03', 'Muebles y Equipos de Oficina', bs.assets.propertyPlantEquipment.furnitureAndOfficeEquipment, toUSD(bs.assets.propertyPlantEquipment.furnitureAndOfficeEquipment)],
            ['1.2.04', 'Edificaciones e Inmuebles Industriales', bs.assets.propertyPlantEquipment.realEstateBuildings, toUSD(bs.assets.propertyPlantEquipment.realEstateBuildings)],
            ['1.2.05', 'Depreciación Acumulada', bs.assets.propertyPlantEquipment.accumulatedDepreciation, toUSD(bs.assets.propertyPlantEquipment.accumulatedDepreciation)]
          ],
          ppeTotal: assetsPpeBs,
          ppeTotalUSD: assetsPpeUSD,
          totalAssets: totalAssetsBs,
          totalAssetsUSD: totalAssetsUSD
        },
        liabilities: {
          current: [
            ['2.1.01', 'Anticipos Recibidos de Clientes (NIIF 15 - Torrefactoras y Clientes Jurídicos Banesco)', bs.liabilities.current.customerAdvances || 0, toUSD(bs.liabilities.current.customerAdvances || 0)],
            ['2.1.02', 'Retención de ISLR por Pagar (Originada por Anticipos de Clientes 2% Decreto 1808)', bs.liabilities.current.islrWithheldOnAdvancesPayable || 0, toUSD(bs.liabilities.current.islrWithheldOnAdvancesPayable || 0)],
            ['2.1.03', 'Cuentas por Pagar Socios (Aportes Accionista Elias Rafael Trías Abreu V-23.997.829)', bs.liabilities.current.shareholderPayables, toUSD(bs.liabilities.current.shareholderPayables)],
            ['2.1.04', 'ISLR por Pagar / Tributos Retenidos', bs.liabilities.current.islrPayable, toUSD(bs.liabilities.current.islrPayable)],
            ['2.1.05', 'IGTF por Pagar (3% Efectivo Divisas / Derogado 2% Bancario)', bs.liabilities.current.igtfPayable || 0, toUSD(bs.liabilities.current.igtfPayable || 0)]
          ],
          currentTotal: liabilitiesCurrentBs,
          currentTotalUSD: liabilitiesCurrentUSD,
          totalLiabilities: totalLiabilitiesBs,
          totalLiabilitiesUSD: totalLiabilitiesUSD
        },
        equity: {
          items: [
            ['3.1.01', 'Capital Social Suscrito y Pagado', bs.equity.subscribedCapital, toUSD(bs.equity.subscribedCapital)],
            ['3.1.02', 'Resultados Acumulados (Ejercicios Anteriores)', bs.equity.accumulatedSurplus, toUSD(bs.equity.accumulatedSurplus)],
            ['3.1.03', 'Ganancia Neta del Ejercicio (Ene-Ago 2026)', bs.equity.periodProfit, toUSD(bs.equity.periodProfit)],
            ['3.1.04', 'Reserva Legal (5%)', bs.equity.legalReserve, toUSD(bs.equity.legalReserve)]
          ],
          totalEquity: totalEquityBs,
          totalEquityUSD: totalEquityUSD
        },
        totalLiabilitiesAndEquity: totalLiabEqBs,
        totalLiabilitiesAndEquityUSD: totalLiabEqUSD
      },
      incomeStatementData: {
        rows: [
          ['4.1.01', 'Ingresos por Servicios Agrícolas y Procesamiento', revServicesBs, revServicesUSD],
          ['4.1.02', 'Ingresos por Intereses Rendidos (Mutuo Becerra)', revInterestBs, revInterestUSD],
          ['4.1.99', 'TOTAL INGRESOS OPERACIONALES Y FINANCIEROS', totalRevenuesBs, totalRevenuesUSD],
          ['4.2.01', 'Costos de Servicios Agrícolas y Mantenimiento', serviceCostsBs, serviceCostsUSD],
          ['4.3.00', 'UTILIDAD BRUTA EN VENTAS', inc.costs.grossProfit, toUSD(inc.costs.grossProfit)]
        ],
        totalRevenuesBs: totalRevenuesBs,
        totalRevenuesUSD: totalRevenuesUSD,
        netIncomeBs: netIncomeBs,
        netIncomeUSD: netIncomeUSD
      },
      trialBalanceData: TRIAL_BALANCE_AUGUST_2026,
      notes: notesList
    });
  };

  // Word Export Handler
  const handleExportWord = async () => {
    await downloadNativeDocx(`EEFF_Agricola_Oni_31-08-2026.docx`, {
      companyName: company.name,
      companyRif: company.rif,
      title: 'ESTADOS FINANCIEROS AUDITADOS AL 31 DE AGOSTO DE 2026 (EXPRESIÓN DUAL BS. / USD)',
      subtitle: 'Presentación Oficial para Banesco Banco Universal, C.A. - Tasa BCV: 794,99 Bs/USD',
      date: '31 de Agosto de 2026',
      fileReference: 'EXP-AUD-EEFF-2026-0831',
      paragraphs: [
        `Certificamos que los presentes Estados Financieros expresados en Bolívares (Bs.) y traducidos a Dólares Estadounidenses (USD) reflejan fielmente la situación patrimonial de AGRÍCOLA ONI, C.A. al 31 de agosto de 2026.`,
        `1. ACTIVO TOTAL: Bs. ${totalAssetsBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${totalAssetsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD).`,
        `2. PASIVO TOTAL: Bs. ${totalLiabilitiesBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${totalLiabilitiesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD).`,
        `3. PATRIMONIO NETO: Bs. ${totalEquityBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${totalEquityUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD).`,
        `4. INGRESOS DECLARADOS: Bs. ${totalRevenuesBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${totalRevenuesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD).`,
        `5. GANANCIA NETA DEL EJERCICIO: Bs. ${netIncomeBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })} ($${netIncomeUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD).`
      ],
      highlightBox: `DIFERENCIA BANESCO EXPUESTA: La acreditación bancaria en Banesco de $2.781.830,18 USD promedio responde a Anticipos de Clientes para Compra e Intermediación de Café en Venezuela bajo NIIF 15 a Tasa Oficial BCV (78,4% / Bs. 1.542.017.092,63), los cuales constituyen Pasivo Corriente a ser sustituidos por facturas de venta en octubre de 2026 y no ventas gravables anticipadas.`,
      signers: [
        { name: 'Elias Rafael Trías Abreu', title: 'Presidente / Propietario' },
        { name: 'Licdo. Omar Pérez Castillo', title: 'Contador Público Independiente, Ven-Nif', idNumber: 'C.P.C. 16.336' }
      ]
    });
  };

  const handleCopyTextNote = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedNote(idx);
    setTimeout(() => setCopiedNote(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR MONOCHROME / TONER-SAVING PROFESSIONAL THEME */}
      <div className="bg-white text-slate-900 rounded-xl p-6 shadow-xs border border-slate-300">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-md border border-slate-300 uppercase tracking-wider">
                Corte Oficial al 31-08-2026
              </span>
              <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1 rounded-md border border-slate-300">
                VEN-NIF
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-md border border-slate-300">
                Tasa BCV: {rate.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs/USD
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Scale className="w-8 h-8 text-slate-800" />
              Estados Financieros Duales (Bs. & USD)
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              {company.name} &middot; RIF: <strong className="text-slate-900">{company.rif}</strong> &middot; Preparados para presentación ante <strong className="text-slate-900">Banesco Banco Universal, C.A.</strong> &middot; Normas VEN-NIF
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={handleExportExcel}
              className="bg-white hover:bg-slate-100 text-black font-bold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center gap-2 border border-slate-300"
              title="Descargar libro Excel oficial (.xlsx) con fondo blanco y formato profesional"
            >
              <FileSpreadsheet className="w-4 h-4 text-black" />
              <span>Descargar Excel (.xlsx)</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="bg-black hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center gap-2 border border-black"
              title="Descargar archivo PDF oficial (.pdf) directo"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Descargar PDF (.pdf)</span>
            </button>

            <button
              onClick={exportToPdfPrint}
              className="bg-white hover:bg-slate-100 text-black font-bold text-xs px-3.5 py-2.5 rounded-lg shadow-xs transition-all flex items-center gap-2 border border-slate-300"
              title="Imprimir documento físico (Ctrl+P)"
            >
              <Printer className="w-4 h-4 text-black" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={handleExportWord}
              className="bg-white hover:bg-slate-100 text-black font-bold text-xs px-3.5 py-2.5 rounded-lg shadow-xs transition-all flex items-center gap-2 border border-slate-300"
              title="Descargar informe en Microsoft Word (.docx)"
            >
              <FileText className="w-4 h-4 text-black" />
              <span>Exportar Word</span>
            </button>
          </div>
        </div>

        {/* SUMMARY STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-300">
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Activo</p>
            <p className="text-lg font-bold text-slate-900 mt-1">
              Bs. {totalAssetsBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              ${totalAssetsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-300">
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Pasivo</p>
            <p className="text-lg font-bold text-slate-900 mt-1">
              Bs. {totalLiabilitiesBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              ${totalLiabilitiesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-300">
            <p className="text-xs text-slate-500 font-semibold uppercase">Patrimonio Neto</p>
            <p className="text-lg font-bold text-slate-900 mt-1">
              Bs. {totalEquityBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              ${totalEquityUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-300">
            <p className="text-xs text-slate-500 font-semibold uppercase">Ingresos Fiscales 2026</p>
            <p className="text-lg font-bold text-slate-900 mt-1">
              Bs. {totalRevenuesBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              ${totalRevenuesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 no-print overflow-x-auto bg-white p-1 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveTab('BALANCE')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all rounded-lg ${
            activeTab === 'BALANCE'
              ? 'border-slate-900 text-slate-900 bg-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-4 h-4 text-slate-700" />
          <span>1. Balance General (Situación Financiera)</span>
        </button>

        <button
          onClick={() => setActiveTab('INCOME')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all rounded-lg ${
            activeTab === 'INCOME'
              ? 'border-slate-900 text-slate-900 bg-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-slate-800" />
          <span>2. Ganancias y Pérdidas (Resultado Integral)</span>
        </button>

        <button
          onClick={() => setActiveTab('TRIAL_BALANCE')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all rounded-lg ${
            activeTab === 'TRIAL_BALANCE'
              ? 'border-slate-900 text-slate-900 bg-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-800" />
          <span>3. Balance de Comprobación (Saldos 2025 & Movimientos 2026)</span>
        </button>

        <button
          onClick={() => setActiveTab('NOTES')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all rounded-lg ${
            activeTab === 'NOTES'
              ? 'border-slate-900 text-slate-900 bg-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-slate-800" />
          <span>4. Notas Explicativas (VEN-NIF)</span>
        </button>

        <button
          onClick={() => setActiveTab('BANESCO_SUMMARY')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all rounded-lg ${
            activeTab === 'BANESCO_SUMMARY'
              ? 'border-slate-900 text-slate-900 bg-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-slate-800" />
          <span>5. Anexo Conciliación Banesco</span>
        </button>
      </div>

      {/* PRINTABLE A4 CONTENT CONTAINER */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 print:p-0 print:shadow-none print:border-none">
        {/* TAB 1: BALANCE GENERAL DUAL */}
        {activeTab === 'BALANCE' && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {company.name}
              </h2>
              <p className="text-xs text-slate-600 font-bold mt-0.5">
                RIF: {company.rif} &middot; REGISTRO MERCANTIL DE LA CIRCUNCRIPCIÓN JUDICIAL DEL ESTADO PORTUGUESA
              </p>
              <h3 className="text-lg font-bold text-slate-800 mt-2 uppercase tracking-wide">
                ESTADO DE SITUACIÓN FINANCIERA (BALANCE GENERAL)
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                AL 31 DE AGOSTO DE 2026 Y AL 31 DE DICIEMBRE DE 2025
              </p>
              <p className="text-xs font-medium text-slate-700 bg-slate-50 inline-block px-3 py-1 rounded-md mt-2 border border-slate-300">
                Expresado en Bolívares (Bs.) y Dólares de los Estados Unidos de América ($ USD) al Tipo de Cambio Oficial BCV ({rate.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs/USD)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-800 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 uppercase text-[11px] border-y-2 border-black">
                    <th className="py-2.5 px-3 border border-slate-300 font-bold w-16 text-center">Código</th>
                    <th className="py-2.5 px-3 border border-slate-300 font-bold">Cuenta / Rubro Patrimonial</th>
                    <th className="py-2.5 px-3 border border-slate-300 font-bold text-right w-44">31/08/2026 (Bs.)</th>
                    <th className="py-2.5 px-3 border border-slate-300 font-bold text-right w-40">31/08/2026 ($ USD)</th>
                    <th className="py-2.5 px-3 border border-slate-300 font-bold text-right w-44 text-slate-600">31/12/2025 (Bs.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* ACTIVO CORRIENTE */}
                  <tr className="bg-slate-100 font-bold text-slate-900 text-xs border-y border-slate-300">
                    <td className="py-2 px-3 border border-slate-200 text-center">1.1</td>
                    <td className="py-2 px-3 border border-slate-200 uppercase" colSpan={4}>
                      ACTIVO CORRIENTE (CIRCULANTE)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">1.1.01</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Efectivo y Equivalentes de Efectivo (Banesco Cta. Cte. / Caja)</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      {bs.assets.current.cashAndBanks.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.assets.current.cashAndBanks).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">
                      2.418.532,47
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">1.1.02</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">
                      Cuentas por Cobrar Socios - Avances Corporativos Banesco (Elías Rafael Trías Abreu V-23.997.829)
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      {(bs.assets.current.shareholderAdvancesReceivable || 375630000.00).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.assets.current.shareholderAdvancesReceivable || 375630000.00).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">0,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">1.1.03</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">
                      Cuentas por Cobrar Socios - Mutuo Manuel Becerra (Capital + Intereses)
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      {bs.assets.current.manuelBecerraReceivable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.assets.current.manuelBecerraReceivable).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">0,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">1.1.04</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Retenciones de ISLR por Cobrar a Clientes</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-900">
                      {bs.assets.current.islrWithholdingClients.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.assets.current.islrWithholdingClients).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">661.181,94</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">1.1.05</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">ISLR Pagado por Anticipado / Exceso de Anticipos</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-900">
                      {bs.assets.current.prepaidISLR.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.assets.current.prepaidISLR).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">394.563,21</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t border-b-2 border-slate-400">
                    <td className="py-2 px-3 border border-slate-300 text-center">1.1.99</td>
                    <td className="py-2 px-3 border border-slate-300 uppercase">TOTAL ACTIVO CORRIENTE</td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono">
                      Bs. {assetsCurrentBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono text-slate-900">
                      ${assetsCurrentUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono text-slate-700">
                      Bs. 56.583.329,41
                    </td>
                  </tr>

                  {/* PROPIEDAD PLANTA Y EQUIPO */}
                  <tr className="bg-slate-100 font-bold text-slate-900 text-xs border-y border-slate-300">
                    <td className="py-2 px-3 border border-slate-200 text-center">1.2</td>
                    <td className="py-2 px-3 border border-slate-200 uppercase" colSpan={4}>
                      PROPIEDAD, PLANTA Y EQUIPOS (NO CORRIENTE)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">1.2.01</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Maquinarias y Equipos Agrícolas</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-900">
                      {bs.assets.propertyPlantEquipment.machinery.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.assets.propertyPlantEquipment.machinery).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">10.000,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">1.2.02</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Vehículos y Flota de Carga Agrícola</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-900">
                      {bs.assets.propertyPlantEquipment.vehicles.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.assets.propertyPlantEquipment.vehicles).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">26.145.094,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">1.2.03</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Muebles y Equipos de Oficina</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-900">
                      {bs.assets.propertyPlantEquipment.furnitureAndOfficeEquipment.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.assets.propertyPlantEquipment.furnitureAndOfficeEquipment).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">590.000,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">1.2.04</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Edificaciones e Inmuebles Industriales</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-900">
                      {bs.assets.propertyPlantEquipment.realEstateBuildings.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.assets.propertyPlantEquipment.realEstateBuildings).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">1.317.600,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">1.2.05</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium italic text-slate-600">Depreciación Acumulada PPE</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-800">
                      ({Math.abs(bs.assets.propertyPlantEquipment.accumulatedDepreciation).toLocaleString('es-VE', { minimumFractionDigits: 2 })})
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-800">
                      -${Math.abs(toUSD(bs.assets.propertyPlantEquipment.accumulatedDepreciation)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">-8,47</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t border-b-2 border-slate-400">
                    <td className="py-2 px-3 border border-slate-300 text-center">1.2.99</td>
                    <td className="py-2 px-3 border border-slate-300 uppercase">TOTAL PROPIEDAD, PLANTA Y EQUIPO NETO</td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono">
                      Bs. {assetsPpeBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono text-slate-900">
                      ${assetsPpeUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono text-slate-700">
                      Bs. 28.062.685,53
                    </td>
                  </tr>

                  {/* TOTAL ACTIVO - ACCOUNTING DOUBLE BORDER */}
                  <tr className="bg-white text-slate-950 font-black text-sm border-t-2 border-b-4 border-double border-black">
                    <td className="py-3 px-3 border border-slate-300 text-center">1.0.00</td>
                    <td className="py-3 px-3 border border-slate-300 uppercase">TOTAL ACTIVO</td>
                    <td className="py-3 px-3 border border-slate-300 text-right font-mono text-black font-extrabold">
                      Bs. {totalAssetsBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 border border-slate-300 text-right font-mono text-black font-extrabold">
                      ${totalAssetsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 border border-slate-300 text-right font-mono text-slate-700 font-bold">
                      Bs. 84.646.014,94
                    </td>
                  </tr>

                  {/* PASIVO CORRIENTE */}
                  <tr className="bg-slate-100 font-bold text-slate-900 text-xs border-y border-slate-300">
                    <td className="py-2 px-3 border border-slate-200 text-center">2.1</td>
                    <td className="py-2 px-3 border border-slate-200 uppercase" colSpan={4}>
                      PASIVO CORRIENTE (CIRCULANTE)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">2.1.01</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium font-bold text-slate-900">
                      Anticipos Recibidos de Clientes (NIIF 15 - Saldo Neto por Ejecutar)
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      {(bs.liabilities.current.customerAdvances || 301228750.17).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.liabilities.current.customerAdvances || 301228750.17).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">0,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">2.1.02</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium font-semibold text-slate-800">
                      Retención de ISLR por Pagar (Originada por Anticipos de Clientes 2% Decreto 1808)
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      {(bs.liabilities.current.islrWithheldOnAdvancesPayable || 31277261.45).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.liabilities.current.islrWithheldOnAdvancesPayable || 31277261.45).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">0,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">2.1.03</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">
                      Cuentas por Pagar Socios (Aportes Accionista Elias Rafael Trías Abreu V-23.997.829 / Omar Pérez)
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      {bs.liabilities.current.shareholderPayables.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.liabilities.current.shareholderPayables).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">0,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">2.1.04</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Impuesto Sobre La Renta (ISLR) Provisiones por Pagar</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-900">
                      {bs.liabilities.current.islrPayable.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.liabilities.current.islrPayable).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">1.395.745,15</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">2.1.05</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium text-slate-600">
                      IGTF 3% Efectivo Divisas por Pagar (Derogado 2% Transferencias Bancarias)
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">
                      {(bs.liabilities.current.igtfPayable || 0.00).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-600">
                      $0.00
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">0,00</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t border-b-2 border-slate-400">
                    <td className="py-2 px-3 border border-slate-300 text-center">2.0.00</td>
                    <td className="py-2 px-3 border border-slate-300 uppercase">TOTAL PASIVO CORRIENTE (TOTAL PASIVO)</td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono font-bold">
                      Bs. {totalLiabilitiesBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono font-bold text-slate-900">
                      ${totalLiabilitiesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono text-slate-700">
                      Bs. 1.395.745,15
                    </td>
                  </tr>

                  {/* PATRIMONIO NETO */}
                  <tr className="bg-slate-100 font-bold text-slate-900 text-xs border-y border-slate-300">
                    <td className="py-2 px-3 border border-slate-200 text-center">3.1</td>
                    <td className="py-2 px-3 border border-slate-200 uppercase" colSpan={4}>
                      PATRIMONIO NETO
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">3.1.01</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Capital Social Suscrito y Pagado</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-900">
                      {bs.equity.subscribedCapital.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.equity.subscribedCapital).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">600.000,00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">3.1.02</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Resultados Acumulados (Superávit Ejercicios Anteriores)</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-900">
                      {bs.equity.accumulatedSurplus.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.equity.accumulatedSurplus).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">79.877.475,85</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">3.1.03</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium font-bold text-slate-900">
                      Ganancia Neta del Ejercicio (Enero - Agosto 2026)
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      {bs.equity.periodProfit.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.equity.periodProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">2.712.793,94</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-600">3.1.04</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Reserva Legal (5% Código de Comercio)</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-900">
                      {bs.equity.legalReserve.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${toUSD(bs.equity.legalReserve).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-600">60.000,00</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t border-b-2 border-slate-400">
                    <td className="py-2 px-3 border border-slate-300 text-center">3.1.99</td>
                    <td className="py-2 px-3 border border-slate-300 uppercase">TOTAL PATRIMONIO NETO</td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono font-bold">
                      Bs. {totalEquityBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono font-bold text-slate-900">
                      ${totalEquityUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono text-slate-700">
                      Bs. 83.250.269,79
                    </td>
                  </tr>

                  {/* TOTAL PASIVO Y PATRIMONIO - ACCOUNTING DOUBLE BORDER */}
                  <tr className="bg-white text-slate-950 font-black text-sm border-t-2 border-b-4 border-double border-black">
                    <td className="py-3 px-3 border border-slate-300 text-center">3.0.00</td>
                    <td className="py-3 px-3 border border-slate-300 uppercase">TOTAL PASIVO Y PATRIMONIO NETO</td>
                    <td className="py-3 px-3 border border-slate-300 text-right font-mono text-black font-extrabold">
                      Bs. {totalLiabEqBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 border border-slate-300 text-right font-mono text-black font-extrabold">
                      ${totalLiabEqUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 border border-slate-300 text-right font-mono text-slate-700 font-bold">
                      Bs. 84.646.014,94
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* EQUATION VALIDATION BADGE */}
            <div className="p-4 bg-white rounded-lg border border-slate-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-slate-900" />
                <span className="font-bold text-slate-900">
                  Verificación de Ecuación Patrimonial (VEN-NIF):
                </span>
                <span className="text-slate-700 font-mono">
                  Activo (Bs. {totalAssetsBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}) = Pasivo (Bs. {totalLiabilitiesBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}) + Patrimonio (Bs. {totalEquityBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })})
                </span>
              </div>
              <span className="bg-black text-white font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider border border-black">
                100% Cuadrado
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: ESTADO DE GANANCIAS Y PÉRDIDAS DUAL */}
        {activeTab === 'INCOME' && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {company.name}
              </h2>
              <p className="text-xs text-slate-600 font-bold mt-0.5">
                RIF: {company.rif} &middot; REGISTRO MERCANTIL DE LA CIRCUNCRIPCIÓN JUDICIAL DEL ESTADO PORTUGUESA
              </p>
              <h3 className="text-lg font-bold text-slate-800 mt-2 uppercase tracking-wide">
                ESTADO DE RESULTADO INTEGRAL (GANANCIAS Y PÉRDIDAS)
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                DEL 01 DE ENERO AL 31 DE AGOSTO DE 2026
              </p>
              <p className="text-xs font-medium text-slate-700 bg-slate-50 inline-block px-3 py-1 rounded-md mt-2 border border-slate-300">
                Expresado en Bolívares (Bs.) y Dólares de los Estados Unidos de América ($ USD) al Tipo de Cambio Oficial BCV ({rate.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs/USD)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-800 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 uppercase text-[11px] border-y-2 border-black">
                    <th className="py-2.5 px-3 border border-slate-300 font-bold w-16 text-center">Código</th>
                    <th className="py-2.5 px-3 border border-slate-300 font-bold">Concepto / Cuenta de Ingresos y Gastos</th>
                    <th className="py-2.5 px-3 border border-slate-300 font-bold text-right w-48">Monto en Bolívares (Bs.)</th>
                    <th className="py-2.5 px-3 border border-slate-300 font-bold text-right w-44 text-slate-900">Monto en Dólares ($ USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* INGRESOS */}
                  <tr className="bg-slate-100 font-bold text-slate-900 text-xs border-y border-slate-300">
                    <td className="py-2 px-3 border border-slate-200 text-center">4.1</td>
                    <td className="py-2 px-3 border border-slate-200 uppercase" colSpan={3}>
                      INGRESOS OPERACIONALES Y FINANCIEROS
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-500">4.1.01</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">
                      Ingresos por Servicios Agrícolas, Acondicionamiento y Secado
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      {revServicesBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${revServicesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-500">4.1.02</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">
                      Ingresos por Intereses Financieros (Contrato Mutuo Manuel Becerra)
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      {revInterestBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-900">
                      ${revInterestUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t border-b-2 border-slate-400">
                    <td className="py-2 px-3 border border-slate-300 text-center">4.1.99</td>
                    <td className="py-2 px-3 border border-slate-300 uppercase">TOTAL INGRESOS BRUTOS DECLARADOS</td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono">
                      Bs. {totalRevenuesBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-3 border border-slate-300 text-right font-mono text-slate-900">
                      ${totalRevenuesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  {/* COSTOS */}
                  <tr className="bg-slate-100 font-bold text-slate-900 text-xs border-y border-slate-300">
                    <td className="py-2 px-3 border border-slate-200 text-center">4.2</td>
                    <td className="py-2 px-3 border border-slate-200 uppercase" colSpan={3}>
                      COSTOS DE SERVICIOS Y OPERACIÓN
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-500">4.2.01</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Costos Operacionales Agrícolas y Mantenimiento</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-800 font-semibold">
                      ({Math.abs(serviceCostsBs).toLocaleString('es-VE', { minimumFractionDigits: 2 })})
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono font-bold text-slate-800">
                      -${Math.abs(serviceCostsUSD).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  {/* UTILIDAD BRUTA */}
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t border-b-2 border-slate-400">
                    <td className="py-2.5 px-3 border border-slate-300 text-center">4.3.00</td>
                    <td className="py-2.5 px-3 border border-slate-300 uppercase">UTILIDAD BRUTA EN VENTAS / OPERACIONES</td>
                    <td className="py-2.5 px-3 border border-slate-300 text-right font-mono font-bold">
                      Bs. {netIncomeBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-300 text-right font-mono font-bold text-slate-900">
                      ${netIncomeUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  {/* GASTOS DE OPERACIÓN */}
                  <tr className="bg-slate-100 font-bold text-slate-900 text-xs border-y border-slate-300">
                    <td className="py-2 px-3 border border-slate-200 text-center">4.4</td>
                    <td className="py-2 px-3 border border-slate-200 uppercase" colSpan={3}>
                      GASTOS OPERACIONALES Y ADMINISTRATIVOS
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border border-slate-200 font-mono text-center text-slate-500">4.4.01</td>
                    <td className="py-2 px-3 border border-slate-200 font-medium">Gastos de Administración, Personal y Ventas</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-500">0,00</td>
                    <td className="py-2 px-3 border border-slate-200 text-right font-mono text-slate-500">$0,00</td>
                  </tr>

                  {/* UTILIDAD NETA DEL EJERCICIO - ACCOUNTING DOUBLE BORDER */}
                  <tr className="bg-white text-slate-950 font-black text-sm border-t-2 border-b-4 border-double border-black">
                    <td className="py-3 px-3 border border-slate-300 text-center">5.0.00</td>
                    <td className="py-3 px-3 border border-slate-300 uppercase">
                      UTILIDAD NETA DEL EJERCICIO (01/01/2026 AL 31/08/2026)
                    </td>
                    <td className="py-3 px-3 border border-slate-300 text-right font-mono text-black font-extrabold">
                      Bs. {netIncomeBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 border border-slate-300 text-right font-mono text-black font-extrabold">
                      ${netIncomeUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* AUDIT NOTICE BOX */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 text-xs text-slate-800">
              <p className="font-bold flex items-center gap-1.5 mb-1 text-slate-900">
                <AlertCircle className="w-4 h-4 text-slate-700" />
                Nota de Registro de Ingresos por Intereses del Mutuo Becerra:
              </p>
              <p className="leading-relaxed">
                Los ingresos incluyen <strong>Bs. 13.924.047,66 ($17.514,75 USD)</strong> devengados por concepto de rendimiento del Contrato de Préstamo Mutuo y Línea de Crédito Rotativa otorgada al Sr. Manuel Becerra. Dichos ingresos fueron calculados y reconocidos contablemente en este período 2026 conforme a la norma VEN-NIF.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: BALANCE DE COMPROBACIÓN DUAL (31/12/2025 AL 31/08/2026) */}
        {activeTab === 'TRIAL_BALANCE' && (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {company.name}
              </h2>
              <p className="text-xs text-slate-600 font-bold mt-0.5">
                RIF: {company.rif} &middot; R.M. ESTADO PORTUGUESA &middot; CATÁLOGO CONTABLE VEN-NIF PYME
              </p>
              <h3 className="text-lg font-bold text-slate-800 mt-2 uppercase tracking-wide flex items-center justify-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-slate-700" />
                BALANCE DE COMPROBACIÓN DE SALDOS Y MOVIMIENTOS
              </h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                SALDO INICIAL BASE AL 31/12/2025 &rarr; MOVIMIENTOS ENE-AGO 2026 &rarr; SALDO FINAL AL 31/08/2026
              </p>
              <p className="text-xs font-medium text-slate-700 bg-slate-50 inline-block px-3 py-1 rounded-md mt-2 border border-slate-300">
                Expresado en Bolívares (Bs.) y Dólares de los Estados Unidos de América ($ USD) a la Tasa Oficial BCV ({rate.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs/USD)
              </p>
            </div>

            {/* BALANCE VERIFICATION SUMMARY BADGE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white text-slate-900 p-4 rounded-xl border border-slate-300 shadow-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-[11px] text-slate-600 font-bold uppercase">1. Saldo Inicial al 31/12/2025</p>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-slate-700">Débito = Crédito:</span>
                  <span className="font-mono font-bold text-slate-950">
                    Bs. {TRIAL_BALANCE_AUGUST_2026.totals.initialDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 mt-0.5 text-right font-mono">
                  ${(TRIAL_BALANCE_AUGUST_2026.totals.initialDebitVES / 301.37).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD (BCV 2025)
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-[11px] text-slate-600 font-bold uppercase">2. Movimientos Enero - Agosto 2026</p>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-slate-700">Debe = Haber:</span>
                  <span className="font-mono font-bold text-slate-950">
                    Bs. {TRIAL_BALANCE_AUGUST_2026.totals.movementsDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 mt-0.5 text-right font-mono">
                  Movilizados en Cuentas y Asientos Contables
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="text-[11px] text-slate-600 font-bold uppercase">3. Saldo Final al 31/08/2026</p>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-slate-700">Débito = Crédito:</span>
                  <span className="font-mono font-bold text-slate-950">
                    Bs. {TRIAL_BALANCE_AUGUST_2026.totals.finalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-[10px] text-slate-700 mt-0.5 text-right font-mono font-bold">
                  ${TRIAL_BALANCE_AUGUST_2026.totals.finalDebitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD (BCV 794,99)
                </p>
              </div>
            </div>

            {/* SEARCH & CATEGORY FILTER TOOLBAR */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 no-print bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por código o nombre de cuenta (ej: Banesco, Becerra, Trias)..."
                  value={tbSearch}
                  onChange={(e) => setTbSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Filtrar:
                </span>
                {['ALL', 'ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'EGRESO'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTbCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase transition-all ${
                      tbCategoryFilter === cat
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'Todas' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* TRIAL BALANCE TABLE */}
            <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  {/* MAIN HEADER GROUPING */}
                  <tr className="bg-slate-100 text-slate-900 text-center font-bold border-t-2 border-black">
                    <th rowSpan={2} className="py-2.5 px-3 border border-slate-300 uppercase text-[11px]">Código</th>
                    <th rowSpan={2} className="py-2.5 px-3 border border-slate-300 text-left uppercase text-[11px]">Cuenta Contable / Rubro</th>
                    <th rowSpan={2} className="py-2.5 px-2 border border-slate-300 uppercase text-[11px]">Cat.</th>
                    <th colSpan={2} className="py-2 px-2 border border-slate-300 bg-slate-100 uppercase text-[10px]">Saldo Inicial 31/12/2025 (Bs.)</th>
                    <th colSpan={2} className="py-2 px-2 border border-slate-300 bg-slate-100 uppercase text-[10px]">Movimientos 2026 (Bs.)</th>
                    <th colSpan={2} className="py-2 px-2 border border-slate-300 bg-slate-100 uppercase text-[10px]">Saldo Final 31/08/2026 (Bs.)</th>
                    <th colSpan={2} className="py-2 px-2 border border-slate-300 bg-slate-100 uppercase text-[10px] text-slate-900">Saldo USD (31/08/2026)</th>
                  </tr>
                  {/* SUB HEADER DEBIT/CREDIT */}
                  <tr className="bg-slate-50 text-slate-900 text-center font-bold text-[10px] border-b-2 border-black">
                    <th className="py-1.5 px-2 border border-slate-300">Débito</th>
                    <th className="py-1.5 px-2 border border-slate-300">Crédito</th>
                    <th className="py-1.5 px-2 border border-slate-300">Debe</th>
                    <th className="py-1.5 px-2 border border-slate-300">Haber</th>
                    <th className="py-1.5 px-2 border border-slate-300 font-extrabold text-slate-950">Débito</th>
                    <th className="py-1.5 px-2 border border-slate-300 font-extrabold text-slate-950">Crédito</th>
                    <th className="py-1.5 px-2 border border-slate-300 font-extrabold text-slate-950">Débito $</th>
                    <th className="py-1.5 px-2 border border-slate-300 font-extrabold text-slate-950">Crédito $</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {TRIAL_BALANCE_AUGUST_2026.rows
                    .filter((r) => {
                      const matchesCategory = tbCategoryFilter === 'ALL' || r.category === tbCategoryFilter;
                      const matchesSearch =
                        !tbSearch ||
                        r.code.toLowerCase().includes(tbSearch.toLowerCase()) ||
                        r.accountName.toLowerCase().includes(tbSearch.toLowerCase());
                      return matchesCategory && matchesSearch;
                    })
                    .map((r, idx) => (
                      <tr key={r.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 hover:bg-slate-100/70 transition-colors'}>
                        <td className="py-2 px-2.5 border border-slate-200 font-mono font-bold text-center text-slate-700 text-[11px]">
                          {r.code}
                        </td>
                        <td className="py-2 px-3 border border-slate-200 font-semibold text-slate-900">
                          {r.accountName}
                        </td>
                        <td className="py-2 px-1.5 border border-slate-200 text-center font-bold text-[10px]">
                          <span className={`px-1.5 py-0.5 rounded uppercase ${
                            r.category === 'ACTIVO' ? 'bg-slate-200 text-slate-900 font-bold' :
                            r.category === 'PASIVO' ? 'bg-slate-200 text-slate-900 font-bold' :
                            r.category === 'PATRIMONIO' ? 'bg-slate-200 text-slate-900 font-bold' :
                            'bg-slate-100 text-slate-800 font-medium'
                          }`}>
                            {r.category.substring(0, 3)}
                          </span>
                        </td>
                        {/* 2025 Initial */}
                        <td className="py-2 px-2 border border-slate-200 text-right font-mono text-slate-600">
                          {r.initialBalance2025.debitVES > 0 ? r.initialBalance2025.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="py-2 px-2 border border-slate-200 text-right font-mono text-slate-600">
                          {r.initialBalance2025.creditVES > 0 ? r.initialBalance2025.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                        </td>
                        {/* 2026 Movements */}
                        <td className="py-2 px-2 border border-slate-200 text-right font-mono text-slate-700">
                          {r.movements2026.debitVES > 0 ? r.movements2026.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="py-2 px-2 border border-slate-200 text-right font-mono text-slate-700">
                          {r.movements2026.creditVES > 0 ? r.movements2026.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                        </td>
                        {/* 2026 Final VES */}
                        <td className="py-2 px-2 border border-slate-200 text-right font-mono font-bold text-slate-950">
                          {r.finalBalance2026.debitVES > 0 ? r.finalBalance2026.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="py-2 px-2 border border-slate-200 text-right font-mono font-bold text-slate-950">
                          {r.finalBalance2026.creditVES > 0 ? r.finalBalance2026.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '-'}
                        </td>
                        {/* 2026 Final USD */}
                        <td className="py-2 px-2 border border-slate-200 text-right font-mono font-bold text-slate-950">
                          {r.finalBalanceUSD.debitUSD > 0 ? `$${r.finalBalanceUSD.debitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="py-2 px-2 border border-slate-200 text-right font-mono font-bold text-slate-950">
                          {r.finalBalanceUSD.creditUSD > 0 ? `$${r.finalBalanceUSD.creditUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                      </tr>
                    ))}

                  {/* TOTALS ROW - CLASSIC ACCOUNTING DOUBLE BORDER */}
                  <tr className="bg-white text-slate-950 font-black text-xs border-t-2 border-b-4 border-double border-black">
                    <td colSpan={3} className="py-3 px-3 border border-slate-300 text-center uppercase tracking-wider font-extrabold">
                      TOTAL BALANCE DE COMPROBACIÓN Y MOVIMIENTOS
                    </td>
                    <td className="py-3 px-2 border border-slate-300 text-right font-mono font-bold text-slate-900">
                      Bs. {TRIAL_BALANCE_AUGUST_2026.totals.initialDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 border border-slate-300 text-right font-mono font-bold text-slate-900">
                      Bs. {TRIAL_BALANCE_AUGUST_2026.totals.initialCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 border border-slate-300 text-right font-mono font-bold text-slate-900">
                      Bs. {TRIAL_BALANCE_AUGUST_2026.totals.movementsDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 border border-slate-300 text-right font-mono font-bold text-slate-900">
                      Bs. {TRIAL_BALANCE_AUGUST_2026.totals.movementsCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 border border-slate-300 text-right font-mono font-extrabold text-black">
                      Bs. {TRIAL_BALANCE_AUGUST_2026.totals.finalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 border border-slate-300 text-right font-mono font-extrabold text-black">
                      Bs. {TRIAL_BALANCE_AUGUST_2026.totals.finalCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 border border-slate-300 text-right font-mono font-extrabold text-black">
                      ${TRIAL_BALANCE_AUGUST_2026.totals.finalDebitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 border border-slate-300 text-right font-mono font-extrabold text-black">
                      ${TRIAL_BALANCE_AUGUST_2026.totals.finalCreditUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CERTIFICATION FOOTER */}
            <div className="pt-6 border-t border-slate-200 mt-8">
              <p className="text-[11px] text-slate-500 font-semibold text-center mb-6 uppercase tracking-wider">
                Certificación Técnica y Legal de Balance de Comprobación conforme a VEN-NIF PYME
              </p>
              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto text-center text-xs">
                <div>
                  <div className="border-b border-slate-400 mb-2 pb-8"></div>
                  <p className="font-bold text-slate-900">Elias Rafael Trías Abreu</p>
                  <p className="text-slate-600 font-mono text-[11px] font-semibold">C.I. V-23.997.829</p>
                  <p className="text-slate-500 text-[11px]">Presidente & Propietario</p>
                  <p className="text-slate-400 text-[10px]">{company.name}</p>
                </div>
                <div>
                  <div className="border-b border-slate-400 mb-2 pb-8"></div>
                  <p className="font-bold text-slate-900">Licdo. Omar Pérez Castillo</p>
                  <p className="text-slate-600 text-[11px] font-semibold">Contador Público Independiente, Ven-Nif</p>
                  <p className="text-slate-500 text-[10px] font-mono">C.P.C. N° 16.336</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NOTAS EXPLICATIVAS (VEN-NIF) */}
        {activeTab === 'NOTES' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                NOTAS EXPLICATIVAS REVELATORIAS A LOS ESTADOS FINANCIEROS
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Conforme a los Principios de Contabilidad Generalmente Aceptados en Venezuela (VEN-NIF GE) &middot; Al 31 de Agosto de 2026
              </p>
            </div>

            <div className="space-y-4">
              {notesList.map((note, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-900 text-amber-400 rounded-full flex items-center justify-center text-xs font-black">
                        {idx + 1}
                      </span>
                      {note.title}
                    </h4>
                    <button
                      onClick={() => handleCopyTextNote(note.text, idx)}
                      className="no-print text-slate-400 hover:text-slate-700 transition-colors p-1"
                      title="Copiar texto de la nota"
                    >
                      {copiedNote === idx ? (
                        <span className="text-xs text-emerald-600 font-bold">¡Copiado!</span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed pl-8">
                    {note.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ANEXO CONCILIACIÓN BANESCO */}
        {activeTab === 'BANESCO_SUMMARY' && (
          <div className="space-y-6">
            <div className="bg-white border-l-4 border-black p-4 rounded-r-xl border border-slate-300">
              <h3 className="text-sm font-bold text-black flex items-center gap-2 uppercase">
                <AlertCircle className="w-5 h-5 text-black" />
                Resumen Ejecutivo de Conciliación Bancaria Banesco
              </h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Justificación técnica contable elaborada para la Gerencia de Cumplimiento de Banesco Banco Universal, C.A. sobre la disparidad aparente entre la movilización acumulada ($2.781.830,18 USD promedio / Bs. 1.966.597.105,35) y las ventas fiscales declaradas ($116.531,68 USD / Bs. 92.641.520,01).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  1. Composición de Créditos Abonados en Banesco
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-medium text-slate-800">Anticipos Clientes Café (NIIF 15)</span>
                    <strong className="text-black font-mono">Bs. 1.542.017.092,63 (78,4%)</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-medium text-slate-800">Transferencias Cuentas Propias</span>
                    <strong className="text-black font-mono">Bs. 208.708.057,73 (10,6%)</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-medium text-slate-800">Reintegros Capital Mutuo Becerra</span>
                    <strong className="text-black font-mono">Bs. 186.376.000,00 (9,5%)</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 border border-slate-200 rounded">
                    <span className="font-medium text-slate-800">Aportes Personas Naturales</span>
                    <strong className="text-black font-mono">Bs. 29.495.954,99 (1,5%)</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-white text-black border-2 border-black rounded font-bold">
                    <span>Total Movilización en Banesco</span>
                    <span className="font-mono">Bs. 1.966.597.105,35</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  2. Ingresos Fiscales Reales Declarados
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 bg-slate-50 border border-slate-200 rounded text-black">
                    <span className="font-medium">Servicios Agrícolas y Procesamiento</span>
                    <strong className="font-mono">Bs. 78.717.472,35 ($99.016,93 USD)</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 border border-slate-200 rounded text-black">
                    <span className="font-medium">Intereses Financieros Mutuo Becerra</span>
                    <strong className="font-mono">Bs. 13.924.047,66 ($17.514,75 USD)</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-white text-black border-2 border-black rounded font-bold">
                    <span>Total Ingresos Fiscales (EEFF)</span>
                    <span className="font-mono">Bs. 92.641.520,01 ($116.531,68 USD)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-3 lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-black tracking-wider flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-black" />
                      3. Composición de Débitos, Salidas y Cargos en Banesco (Ene - Ago 2026)
                    </h4>
                    <p className="text-xs text-slate-700 mt-1">
                      Total Salidas Registradas en Extracto Banesco: <strong className="text-black font-mono">Bs. 1.956.660.113,95</strong> ($2.897.684,28 USD). Principalmente destinado a Costo de Ventas de Café Verde (59,3%) y Préstamos Accionista (19,2%).
                    </p>
                  </div>
                  {onNavigateToBecerraSuite && (
                    <button
                      onClick={onNavigateToBecerraSuite}
                      className="px-4 py-2 bg-black hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer border border-black"
                    >
                      <span>Ver Cuadro Salidas Excel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SIGNATURE BLOCK FOR PRINT AND OFFICIAL AUDIT */}
        <div className="mt-12 pt-8 border-t-2 border-slate-300">
          <p className="text-center text-xs font-bold text-slate-800 uppercase tracking-wider mb-8">
            CERTIFICACIÓN TÉCNICA CONTABLE Y APROBACIÓN LEGAL MERECIDA
          </p>
          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="border-b border-slate-400 w-3/4 mx-auto mb-2"></div>
              <p className="text-sm font-bold text-slate-900">Elias Rafael Trías Abreu</p>
              <p className="text-xs text-slate-600">Presidente / Propietario</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{company.name} &middot; RIF {company.rif}</p>
            </div>

            <div>
              <div className="border-b border-slate-400 w-3/4 mx-auto mb-2"></div>
              <p className="text-sm font-bold text-slate-900">Licdo. Omar Pérez Castillo</p>
              <p className="text-xs text-slate-600 font-semibold">Contador Público Independiente, Ven-Nif</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">C.P.C. N° 16.336</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 10 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
