import React, { useState } from 'react';
import {
  Ship,
  DollarSign,
  ArrowRightLeft,
  FileCheck,
  Plus,
  Trash2,
  Calendar,
  Building2,
  Globe,
  Printer,
  CheckCircle2,
  Clock,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  FileDown,
  Download
} from 'lucide-react';
import { exportToWord, exportToCsv, exportToPdfPrint, exportHtmlToPdf } from '../utils/exportUtils';
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
import {
  useAppData,
  CustomerAdvance,
  BanescoFxPurchase,
  ImportShipmentColombia,
  OctoberInvoice
} from '../context/AppDataContext';

interface Props {
  company: CompanyProfile;
  currentRate: BcvRateItem;
}

export const CoffeeImportAndAdvancesManagerView: React.FC<Props> = ({ company, currentRate }) => {
  const {
    customerAdvances,
    addCustomerAdvance,
    deleteCustomerAdvance,
    fxPurchases,
    addFxPurchase,
    deleteFxPurchase,
    importShipments,
    addImportShipment,
    deleteImportShipment,
    octoberInvoices,
    addOctoberInvoice,
    deleteOctoberInvoice,
    addBankMovement,
    addVoucher
  } = useAppData();

  const [activeTab, setActiveTab] = useState<'ADVANCES' | 'FX_PURCHASE' | 'IMPORT_SHIPMENTS' | 'OCTOBER_INVOICES'>('ADVANCES');

  // Form states for Customer Advance
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [advNumber, setAdvNumber] = useState(`ANT-2026-${String(customerAdvances.length + 1).padStart(3, '0')}`);
  const [advDate, setAdvDate] = useState('2026-03-31');
  const [advClient, setAdvClient] = useState('');
  const [advRif, setAdvRif] = useState('');
  const [advAmountVES, setAdvAmountVES] = useState<number>(0);
  const [advCoffeeQtl, setAdvCoffeeQtl] = useState<number>(0);
  const [advBankRef, setAdvBankRef] = useState('');
  const [autoCreateBankAndVoucher, setAutoCreateBankAndVoucher] = useState(true);

  // Form states for FX Purchase to Banesco
  const [showFxModal, setShowFxModal] = useState(false);
  const [fxDate, setFxDate] = useState('2026-03-31');
  const [fxNumber, setFxNumber] = useState(`OP-CAMBIO-${String(fxPurchases.length + 1).padStart(3, '0')}`);
  const [fxDebitVES, setFxDebitVES] = useState<number>(0);
  const [fxRate, setFxRate] = useState<number>(currentRate.rateUsd);
  const [fxCommissionVES, setFxCommissionVES] = useState<number>(0);
  const [fxRef, setFxRef] = useState('');
  const [fxPurpose, setFxPurpose] = useState<'PAGO_INSUMOS_MAQUINARIA_VE' | 'FLETE_TRANSPORTE_NACIONAL' | 'SERVICIOS_AGROINDUSTRIALES_VE'>('PAGO_INSUMOS_MAQUINARIA_VE');

  // Form states for National Coffee Batch Purchase
  const [showImportModal, setShowImportModal] = useState(false);
  const [impCode, setImpCode] = useState(`LOTE-VE-2026-${String(importShipments.length + 1).padStart(3, '0')}`);
  const [impDate, setImpDate] = useState('2026-03-31');
  const [impSupplier, setImpSupplier] = useState('Asociación de Caficultores del Municipio Unda (Chabasquén)');
  const [impNit, setImpNit] = useState('RIF: J-40192840-1');
  const [impVariety, setImpVariety] = useState('Café Arábica Pergamino Lavado (Portuguesa / Lara)');
  const [impVolumeQtl, setImpVolumeQtl] = useState<number>(500);
  const [impInvoiceUSD, setImpInvoiceUSD] = useState<number>(27000);
  const [impInvoiceRef, setImpInvoiceRef] = useState('CONTR-PROCURA-VE-001');
  const [impDuaSeniat, setImpDuaSeniat] = useState('GUIA-SICA-VE-2026-004128');
  const [impInsai, setImpInsai] = useState('CVC-GUIA-NAC-2026-904');
  const [impFreightUSD, setImpFreightUSD] = useState<number>(1800);
  const [impCustomsUSD, setImpCustomsUSD] = useState<number>(1200);

  // Form states for October Invoicing
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invNumber, setInvNumber] = useState(`FAC-OCT-2026-${String(octoberInvoices.length + 1).padStart(3, '0')}`);
  const [invDate, setInvDate] = useState('2026-10-05');
  const [selectedAdvanceId, setSelectedAdvanceId] = useState<string>('');
  const [invClient, setInvClient] = useState('');
  const [invRif, setInvRif] = useState('');
  const [invCoffeeQtl, setInvCoffeeQtl] = useState<number>(0);
  const [invTotalUSD, setInvTotalUSD] = useState<number>(0);
  const [invAmortizedVES, setInvAmortizedVES] = useState<number>(0);

  // Computations
  const totalAdvancesVES = customerAdvances.reduce((acc, a) => acc + a.amountVES, 0);
  const totalAdvancesUSD = customerAdvances.reduce((acc, a) => acc + a.countervalueUSD, 0);
  const totalTargetQtl = customerAdvances.reduce((acc, a) => acc + a.coffeeVolumeTargetQtl, 0);

  const totalFxPurchasedUSD = fxPurchases.reduce((acc, f) => acc + f.usdCredited, 0);
  const totalFxSpentVES = fxPurchases.reduce((acc, f) => acc + f.banescoDebitVES, 0);

  const totalImportVolumeQtl = importShipments.reduce((acc, i) => acc + i.volumeQtl, 0);
  const totalImportCostUSD = importShipments.reduce((acc, i) => acc + (i.totalAmountUSD || 0) + ((i.nationalFreightVES || 0) / (currentRate.rateUsd || 1)), 0);

  const totalInvoicedOctoberVES = octoberInvoices.reduce((acc, i) => acc + i.totalInvoiceVES, 0);

  // Handlers
  const handleCreateAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advClient || advAmountVES <= 0) return;

    const rate = currentRate.rateUsd;
    const countervalueUSD = advAmountVES / rate;

    const newAdvance: CustomerAdvance = {
      id: `adv-${Date.now()}`,
      advanceNumber: advNumber,
      date: advDate,
      clientName: advClient,
      clientRif: advRif || 'J-00000000-0',
      amountVES: advAmountVES,
      countervalueUSD,
      bcvRate: rate,
      coffeeVolumeTargetQtl: advCoffeeQtl,
      bankReference: advBankRef || 'Transf. Banesco',
      status: 'RECIBIDO',
      notes: 'Anticipo recibido para intermediación comercial y compra de café en Venezuela a tasa oficial BCV.'
    };

    addCustomerAdvance(newAdvance);

    // If auto-create is checked, sync with Banesco bank movements & accounting vouchers automatically
    if (autoCreateBankAndVoucher) {
      addBankMovement({
        id: `mov-${Date.now()}`,
        date: advDate,
        reference: advBankRef || advNumber,
        description: `ANTICIPO EN VENTAS RECIBIDO - ${advClient.toUpperCase()}`,
        debitVES: 0,
        creditVES: advAmountVES,
        balanceVES: advAmountVES,
        countervalueUSD,
        bcvRate: rate,
        justificationType: 'ANTICIPO_CLIENTE',
        supportDocType: 'Comprobante de Anticipo & Contrato',
        supportDocRef: advNumber,
        auditStatus: 'VERIFICADO_CONFORME',
        notes: `Anticipo recibido en bolívares de cliente para procura y acopio de café en Venezuela a tasa BCV.`
      });

      addVoucher({
        id: `vch-${Date.now()}`,
        voucherNumber: `CI-${advNumber}`,
        voucherType: 'INGRESO',
        date: advDate,
        bcvRate: rate,
        concept: `Recepción de anticipo en ventas de cliente ${advClient} para compra de café en Venezuela`,
        beneficiaryOrThirdParty: advClient,
        rifThirdParty: advRif || 'J-00000000-0',
        documentRef: advBankRef,
        bankAccountRef: company.banescoAccountVES,
        approvedBy: company.legalRepresentative,
        reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
        preparedBy: 'Administración Contable',
        status: 'CONFIRMADO',
        lines: [
          {
            accountCode: '1.1.01.01.001',
            accountName: 'Banco Banesco Cuenta Corriente VES',
            reference: `Abono Banesco Ref ${advBankRef}`,
            debitVES: advAmountVES,
            creditVES: 0,
            debitUSD: countervalueUSD,
            creditUSD: 0
          },
          {
            accountCode: '2.1.04.01.001',
            accountName: 'Anticipos Recibidos de Clientes Nacionales (Pasivo Corriente)',
            reference: `Compromiso entrega café nacional sustitución octubre`,
            debitVES: 0,
            creditVES: advAmountVES,
            debitUSD: 0,
            creditUSD: countervalueUSD
          }
        ],
        totalDebitVES: advAmountVES,
        totalCreditVES: advAmountVES,
        totalDebitUSD: countervalueUSD,
        totalCreditUSD: countervalueUSD,
        notes: 'Pasivo corriente por anticipo de cliente para compra de café en Venezuela a regularizar en octubre.'
      });
    }

    setShowAdvanceModal(false);
    setAdvClient('');
    setAdvRif('');
    setAdvAmountVES(0);
    setAdvCoffeeQtl(0);
    setAdvBankRef('');
  };

  const handleCreateFxPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (fxDebitVES <= 0 || fxRate <= 0) return;

    const usdCredited = fxDebitVES / fxRate;

    const newFx: BanescoFxPurchase = {
      id: `fx-${Date.now()}`,
      purchaseNumber: fxNumber,
      date: fxDate,
      banescoDebitVES: fxDebitVES,
      exchangeRate: fxRate,
      usdCredited,
      banescoCommissionVES: fxCommissionVES,
      banescoRef: fxRef || 'MESA-BANESCO',
      destinationPurpose: fxPurpose,
      notes: 'Compra de divisas en Banesco para insumos, maquinaria y repuestos agroindustriales en Venezuela.'
    };

    addFxPurchase(newFx);

    // Automatically create debit bank movement in Banesco
    addBankMovement({
      id: `mov-${Date.now()}`,
      date: fxDate,
      reference: fxRef || fxNumber,
      description: `COMPRA DÓLARES A BANESCO - MESA DE CAMBIO (DESTINO: ${fxPurpose})`,
      debitVES: fxDebitVES,
      creditVES: 0,
      balanceVES: 0,
      countervalueUSD: usdCredited,
      bcvRate: fxRate,
      justificationType: 'COMPRA_DIVISAS_BANESCO',
      supportDocType: 'Comprobante Operación Cambiaria Banesco',
      supportDocRef: fxRef || fxNumber,
      auditStatus: 'VERIFICADO_CONFORME',
      notes: `Compra de ${usdCredited.toFixed(2)} USD a Banesco para maquinaria, insumos y transporte de café en Venezuela.`
    });

    // Auto voucher: Débito Banco Banesco USD / Crédito Banco Banesco VES
    addVoucher({
      id: `vch-${Date.now()}`,
      voucherNumber: `CE-${fxNumber}`,
      voucherType: 'EGRESO',
      date: fxDate,
      bcvRate: fxRate,
      concept: `Adquisición de divisas oficiales a Banesco Banco Universal para insumos y maquinaria de café en Venezuela`,
      beneficiaryOrThirdParty: 'Banesco Banco Universal, C.A.',
      rifThirdParty: 'J-07013380-5',
      documentRef: fxRef || fxNumber,
      bankAccountRef: company.banescoAccountVES,
      approvedBy: company.legalRepresentative,
      reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
      preparedBy: 'Administración Contable',
      status: 'CONFIRMADO',
      lines: [
        {
          accountCode: '1.1.01.02.001',
          accountName: 'Banco Banesco Moneda Extranjera USD (Cta Custodia Convenio 20)',
          reference: `Acreditación $${usdCredited.toFixed(2)} USD`,
          debitVES: fxDebitVES,
          creditVES: 0,
          debitUSD: usdCredited,
          creditUSD: 0
        },
        {
          accountCode: '1.1.01.01.001',
          accountName: 'Banco Banesco Cuenta Corriente VES',
          reference: `Cargo Mesa de Cambio Banesco`,
          debitVES: 0,
          creditVES: fxDebitVES,
          debitUSD: 0,
          creditUSD: usdCredited
        }
      ],
      totalDebitVES: fxDebitVES,
      totalCreditVES: fxDebitVES,
      totalDebitUSD: usdCredited,
      totalCreditUSD: usdCredited,
      notes: 'Transferencia interna de bolívares a dólares en Banesco.'
    });

    setShowFxModal(false);
    setFxDebitVES(0);
    setFxRef('');
    setFxCommissionVES(0);
  };

  const handleCreateImportShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!impSupplier || impVolumeQtl <= 0) return;

    const newShipment: ImportShipmentColombia = {
      id: `imp-${Date.now()}`,
      shipmentCode: impCode,
      date: impDate,
      supplierName: impSupplier,
      supplierRif: impNit,
      locationState: 'Portuguesa',
      coffeeVariety: impVariety,
      volumeQtl: impVolumeQtl,
      pricePerQtlUSD: impVolumeQtl > 0 ? impInvoiceUSD / impVolumeQtl : 0,
      totalAmountUSD: impInvoiceUSD,
      totalAmountVES: impInvoiceUSD * currentRate.rateUsd,
      bcvRate: currentRate.rateUsd,
      sicaPermitNumber: impDuaSeniat,
      cvcPermit: impInsai,
      nationalFreightVES: impFreightUSD * currentRate.rateUsd,
      status: 'ACOPIADO_EN_ALMACEN'
    };

    addImportShipment(newShipment);
    setShowImportModal(false);
  };

  const handleCreateOctoberInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClient || invCoffeeQtl <= 0) return;

    const rate = currentRate.rateUsd;
    const totalVES = invTotalUSD * rate;
    const balanceDue = Math.max(0, totalVES - invAmortizedVES);

    const newInvoice: OctoberInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      date: invDate,
      clientName: invClient,
      clientRif: invRif,
      coffeeVolumeQtl: invCoffeeQtl,
      totalInvoiceVES: totalVES,
      totalInvoiceUSD: invTotalUSD,
      amortizedAdvanceVES: invAmortizedVES,
      balanceDueVES: balanceDue,
      associatedAdvanceId: selectedAdvanceId || undefined,
      status: 'FACTURADO'
    };

    addOctoberInvoice(newInvoice);

    // Auto voucher for October: Débito Anticipos de Clientes / Crédito Ventas de Café Importado
    addVoucher({
      id: `vch-${Date.now()}`,
      voucherNumber: `CD-${invNumber}`,
      voucherType: 'DIARIO',
      date: invDate,
      bcvRate: rate,
      concept: `Facturación formal y entrega de café nacional a cliente ${invClient} a tasa BCV sustituyendo anticipo previo`,
      beneficiaryOrThirdParty: invClient,
      rifThirdParty: invRif,
      documentRef: invNumber,
      approvedBy: company.legalRepresentative,
      reviewedBy: 'Lcda. Carmen Rivas (CPC 41.802)',
      preparedBy: 'Administración Contable',
      status: 'CONFIRMADO',
      lines: [
        {
          accountCode: '2.1.04.01.001',
          accountName: 'Anticipos Recibidos de Clientes (Amortización Pasivo NIIF 15)',
          reference: `Cruzamiento con Factura ${invNumber}`,
          debitVES: invAmortizedVES,
          creditVES: 0,
          debitUSD: invAmortizedVES / rate,
          creditUSD: 0
        },
        ...(balanceDue > 0 ? [{
          accountCode: '1.1.02.01.001',
          accountName: 'Cuentas por Cobrar Clientes (Saldo Pendiente)',
          reference: `Diferencia a favor por Factura ${invNumber}`,
          debitVES: balanceDue,
          creditVES: 0,
          debitUSD: balanceDue / rate,
          creditUSD: 0
        }] : []),
        {
          accountCode: '4.1.01.01.002',
          accountName: 'Ingresos por Venta y Distribución de Café Nacional a Tasa BCV',
          reference: `${invCoffeeQtl} Qtl Café Nacional entregados`,
          debitVES: 0,
          creditVES: totalVES,
          debitUSD: 0,
          creditUSD: invTotalUSD
        }
      ],
      totalDebitVES: totalVES,
      totalCreditVES: totalVES,
      totalDebitUSD: invTotalUSD,
      totalCreditUSD: invTotalUSD,
      notes: 'Facturación formal de octubre sustituyendo anticipo previo en bolívares a tasa oficial BCV.'
    });

    setShowInvoiceModal(false);
    setInvClient('');
    setInvRif('');
    setInvCoffeeQtl(0);
    setInvTotalUSD(0);
    setInvAmortizedVES(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Explaining the Intermediary Business Model */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-white shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-900 text-emerald-200 border border-emerald-700 rounded">
              <Globe className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Intermediación Comercial & Compra de Café 100% Nacional (Venezuela)
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            <strong className="text-amber-300 font-semibold">{company.name}</strong> es intermediaria comercial entre personas naturales y jurídicas en Venezuela: <strong className="text-white">NO importa café de Colombia ni del exterior; todo el café se compra en Venezuela</strong> a empresas y productores venezolanos. Recibe <strong className="text-white">Anticipos en Bolívares a Tasa Oficial BCV</strong> para operar en el mercado y acopiar el grano, y en el mes de <strong className="text-emerald-300 font-semibold">OCTUBRE DE 2026</strong> estos anticipos son <strong className="text-white">sustituidos por facturas de ventas definitivas</strong> contra las cuales se eliminan de la contabilidad.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={() => {
              const rowsHtml = customerAdvances.map(a => `
                <tr>
                  <td>${a.advanceNumber}</td>
                  <td>${a.date}</td>
                  <td><strong>${a.clientName}</strong><br><small>${a.clientRif}</small></td>
                  <td class="num">${a.coffeeVolumeTargetQtl.toLocaleString('es-VE')} Qtl</td>
                  <td class="num" style="font-weight:bold;color:#059669">Bs. ${a.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                  <td class="num" style="font-weight:bold;color:#2563eb">$${a.countervalueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>${a.bankReference}</td>
                  <td>${a.status}</td>
                </tr>
              `).join('');

              const fxRows = fxPurchases.map(f => `
                <tr>
                  <td>${f.purchaseNumber}</td>
                  <td>${f.date}</td>
                  <td class="num">Bs. ${f.banescoDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                  <td class="num">Bs. ${f.exchangeRate.toFixed(2)}</td>
                  <td class="num" style="font-weight:bold;color:#059669">$${f.usdCredited.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>${f.destinationPurpose}</td>
                  <td>${f.banescoRef}</td>
                </tr>
              `).join('');

              const htmlContent = `
                <h1>${company.name} &mdash; RIF ${company.rif}</h1>
                <h2>INFORME OFICIAL DE INTERMEDIACIÓN, ANTICIPOS EN BOLÍVARES Y COMPRA DE CAFÉ NACIONAL</h2>
                <div class="highlight-box">
                  <strong>Resumen de Operaciones Enero &ndash; Agosto 2026:</strong><br>
                  Total Anticipos en Bolívares Recibidos de Clientes (NIIF 15): <strong>Bs. ${totalAdvancesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> ($${totalAdvancesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD a Tasa Oficial BCV)<br>
                  Total Dólares Adquiridos en Banesco (Mesa de Cambio): <strong>$${totalFxPurchasedUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong> (Bs. ${totalFxSpentVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })})<br>
                  Destino de Divisas: Insumos agroindustriales, tolvas, repuestos de maquinaria, mantenimiento y transporte pesado en Venezuela.<br>
                  Régimen de Regularización: En OCTUBRE 2026 los anticipos se sustituyen por FACTURAS DE VENTAS definitivas a tasa BCV, eliminándose el pasivo.
                </div>
                <h3>1. Relación de Anticipos en Ventas Recibidos (Pasivo Corriente)</h3>
                <table>
                  <thead>
                    <tr>
                      <th>N° Anticipo</th>
                      <th>Fecha</th>
                      <th>Cliente / RIF</th>
                      <th class="num">Volumen Qtl</th>
                      <th class="num">Monto Bs.</th>
                      <th class="num">Monto USD</th>
                      <th>Ref Bancaria</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>${rowsHtml}</tbody>
                </table>
                <h3>2. Compras de Divisas Oficiales a Banesco Banco Universal</h3>
                <table>
                  <thead>
                    <tr>
                      <th>N° Operación</th>
                      <th>Fecha</th>
                      <th class="num">Débito Bs Banesco</th>
                      <th class="num">Tasa de Cambio</th>
                      <th class="num">Dólares Acreditados</th>
                      <th>Destino / Uso</th>
                      <th>Ref Banesco</th>
                    </tr>
                  </thead>
                  <tbody>${fxRows}</tbody>
                </table>
              `;

              exportToWord('Informe_Anticipos_Procura_Cafe_Agricola_Oni.doc', 'Informe de Anticipos y Gestión de Café', htmlContent);
            }}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
            title="Exportar informe a Microsoft Word (.doc)"
          >
            <FileDown className="w-3.5 h-3.5" />
            Word (.doc)
          </button>
          <button
            onClick={() => {
              const headers = ['Anticipo_Nro', 'Fecha', 'Cliente', 'RIF', 'Volumen_Qtl', 'Monto_Bs', 'Monto_USD', 'Ref_Bancaria', 'Estado'];
              const rows = customerAdvances.map(a => [
                a.advanceNumber,
                a.date,
                a.clientName,
                a.clientRif,
                a.coffeeVolumeTargetQtl,
                a.amountVES,
                a.countervalueUSD,
                a.bankReference,
                a.status
              ]);
              exportToCsv('Anticipos_Clientes_Procura_Cafe.csv', headers, rows);
            }}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
            title="Exportar anticipos a Excel (CSV)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel (CSV)
          </button>
          <button
            onClick={async () => {
              const rowsHtml = customerAdvances.map(a => `
                <tr>
                  <td>${a.advanceNumber}</td>
                  <td>${a.date}</td>
                  <td><strong>${a.clientName}</strong></td>
                  <td>${a.clientRif}</td>
                  <td class="num">${a.coffeeVolumeTargetQtl} Qtl</td>
                  <td class="num">Bs. ${a.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</td>
                  <td class="num">$${a.countervalueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td>${a.bankReference}</td>
                  <td>${a.status}</td>
                </tr>
              `).join('');

              const htmlContent = `
                <h1>${company.name}</h1>
                <p><strong>RIF:</strong> ${company.rif} &middot; R.N.C.: 010049247</p>
                <h2>INFORME OFICIAL DE ANTICIPOS DE CLIENTES Y COMPRA DE CAFÉ NACIONAL (NIIF 15)</h2>
                <div class="highlight-box">
                  Total Anticipos en Custodia Banesco: <strong>Bs. ${totalAdvancesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong> ($${totalAdvancesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD a Tasa BCV).<br>
                  Los anticipos no constituyen ingresos devengados gravables al corte de Agosto 2026; se sustituyen en Octubre de 2026 contra facturas de venta definitivas por entrega de café acopiado en Venezuela.
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>N° Anticipo</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>RIF</th>
                      <th class="num">Volumen Qtl</th>
                      <th class="num">Monto Bs</th>
                      <th class="num">Monto USD</th>
                      <th>Ref Bancaria</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>${rowsHtml}</tbody>
                </table>
              `;
              await exportHtmlToPdf('Informe_Anticipos_Procura_Cafe_Agricola_Oni.pdf', 'Informe de Anticipos de Café', htmlContent);
            }}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            title="Descargar informe en archivo PDF directo"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>
          <button
            onClick={() => exportToPdfPrint()}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs transition-colors shadow"
            title="Imprimir (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Overview of the 4 Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono-num">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-xs font-sans text-slate-600 mb-1">
            <span>1. Anticipos Recibidos</span>
            <span className="text-amber-600 font-bold">{customerAdvances.length} Clientes</span>
          </div>
          <span className="text-lg font-bold text-emerald-700 block mt-1">
            Bs. {totalAdvancesVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-500 font-sans">
            ${totalAdvancesUSD.toFixed(2)} USD &middot; {totalTargetQtl} Qtl
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-xs font-sans text-slate-600 mb-1">
            <span>2. Compra Dólares Banesco</span>
            <span className="text-emerald-600 font-bold">{fxPurchases.length} Operaciones</span>
          </div>
          <span className="text-lg font-bold text-emerald-700 block mt-1">
            ${totalFxPurchasedUSD.toFixed(2)} USD
          </span>
          <span className="text-[11px] text-slate-500 font-sans">
            Bs. {totalFxSpentVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })} en Mesa de Cambio
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-xs font-sans text-slate-600 mb-1">
            <span>3. Procura Nacional Venezuela</span>
            <span className="text-indigo-600 font-bold">{importShipments.length} Lotes</span>
          </div>
          <span className="text-lg font-bold text-slate-900 block mt-1">
            {totalImportVolumeQtl} Qtl Café
          </span>
          <span className="text-[11px] text-slate-500 font-sans">
            Valoración Oficial BCV: ${totalImportCostUSD.toFixed(2)} USD
          </span>
        </div>

        <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-xs font-sans text-blue-900 mb-1">
            <span>4. Facturado en Octubre</span>
            <span className="text-amber-700 font-bold">{octoberInvoices.length} Facturas</span>
          </div>
          <span className="text-lg font-bold text-amber-700 block mt-1">
            Bs. {totalInvoicedOctoberVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-slate-600 font-sans">
            Regularización de Anticipos
          </span>
        </div>
      </div>

      {/* Tabs Selector for the 4 Stages */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('ADVANCES')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ADVANCES'
              ? 'bg-blue-800 text-white shadow'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>1. Anticipos en Ventas de Clientes ({customerAdvances.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('FX_PURCHASE')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'FX_PURCHASE'
              ? 'bg-blue-800 text-white shadow'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>2. Compra de Dólares a Banesco ({fxPurchases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('IMPORT_SHIPMENTS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'IMPORT_SHIPMENTS'
              ? 'bg-blue-800 text-white shadow'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Café Nacional Acopiado en Venezuela ({importShipments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('OCTOBER_INVOICES')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'OCTOBER_INVOICES'
              ? 'bg-blue-800 text-white shadow'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>4. Facturación de Ventas en Octubre (Eliminación de Anticipos) ({octoberInvoices.length})</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER SALES ADVANCES */}
      {activeTab === 'ADVANCES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Registro de Anticipos en Ventas Recibidos de Clientes
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Los clientes transfieren bolívares a Banesco como anticipo para asegurar la compra y acopio de café en Venezuela a tasa oficial BCV.
              </p>
            </div>
            <button
              onClick={() => setShowAdvanceModal(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Registrar Anticipo de Cliente
            </button>
          </div>

          {customerAdvances.length === 0 ? (
            <div className="bg-stone-900 border border-dashed border-stone-700 rounded-xl p-10 text-center text-xs text-stone-400 space-y-3">
              <p>No hay anticipos de clientes registrados aún.</p>
              <button
                onClick={() => setShowAdvanceModal(true)}
                className="px-4 py-2 bg-amber-600 text-stone-950 font-bold rounded-lg text-xs"
              >
                + Registrar Primer Anticipo
              </button>
            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-300 font-mono-num">
                  <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="px-4 py-3">Código Anticipo</th>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3 font-sans">Cliente Comprador</th>
                      <th className="px-4 py-3">RIF</th>
                      <th className="px-4 py-3 text-right">Monto Recibido (VES)</th>
                      <th className="px-4 py-3 text-right">Contravalor USD</th>
                      <th className="px-4 py-3 text-right">Qtl Café Asignado</th>
                      <th className="px-4 py-3">Ref. Banesco</th>
                      <th className="px-4 py-3 text-center font-sans">Estatus</th>
                      <th className="px-4 py-3 text-center font-sans">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {customerAdvances.map((adv) => (
                      <tr key={adv.id} className="hover:bg-stone-800/40">
                        <td className="px-4 py-3 font-bold text-amber-400">{adv.advanceNumber}</td>
                        <td className="px-4 py-3 text-stone-400">{adv.date}</td>
                        <td className="px-4 py-3 font-sans font-bold text-white">{adv.clientName}</td>
                        <td className="px-4 py-3 text-stone-400">{adv.clientRif}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-400">
                          Bs. {adv.amountVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-stone-200">
                          ${adv.countervalueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-amber-300">
                          {adv.coffeeVolumeTargetQtl} Qtl
                        </td>
                        <td className="px-4 py-3 text-stone-400">{adv.bankReference}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {adv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => deleteCustomerAdvance(adv.id)}
                            className="p-1 text-stone-500 hover:text-red-400"
                            title="Eliminar anticipo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FX PURCHASES TO BANESCO */}
      {activeTab === 'FX_PURCHASE' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900 border border-stone-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">
                Compra de Dólares a Banesco Banco Universal (Mesa de Cambio)
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Agrícola Oni C.A. compra divisas oficiales debitando los bolívares de su cuenta corriente para acreditar su Cuenta Custodia en USD.
              </p>
            </div>
            <button
              onClick={() => setShowFxModal(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Registrar Compra de Divisas en Banesco
            </button>
          </div>

          {fxPurchases.length === 0 ? (
            <div className="bg-stone-900 border border-dashed border-stone-700 rounded-xl p-10 text-center text-xs text-stone-400 space-y-3">
              <p>No hay compras de divisas registradas.</p>
              <button
                onClick={() => setShowFxModal(true)}
                className="px-4 py-2 bg-amber-600 text-stone-950 font-bold rounded-lg text-xs"
              >
                + Registrar Primera Compra de Dólares
              </button>
            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-300 font-mono-num">
                  <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="px-4 py-3">N° Operación</th>
                      <th className="px-4 py-3">Fecha Valor</th>
                      <th className="px-4 py-3 text-right">Bolívares Debitado Banesco</th>
                      <th className="px-4 py-3 text-right">Tasa Mesa Banesco</th>
                      <th className="px-4 py-3 text-right font-bold text-emerald-400">Dólares Comprados (USD)</th>
                      <th className="px-4 py-3">Ref Banesco</th>
                      <th className="px-4 py-3 font-sans">Destino Operativo</th>
                      <th className="px-4 py-3 text-center font-sans">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {fxPurchases.map((fx) => (
                      <tr key={fx.id} className="hover:bg-stone-800/40">
                        <td className="px-4 py-3 font-bold text-amber-400">{fx.purchaseNumber}</td>
                        <td className="px-4 py-3 text-stone-400">{fx.date}</td>
                        <td className="px-4 py-3 text-right text-stone-300">
                          Bs. {fx.banescoDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right text-amber-300 font-medium">
                          Bs. {fx.exchangeRate.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-400 text-sm">
                          ${fx.usdCredited.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-stone-400">{fx.banescoRef}</td>
                        <td className="px-4 py-3 font-sans">
                          <span className="text-[11px] font-medium text-stone-200">{fx.destinationPurpose}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => deleteFxPurchase(fx.id)}
                            className="p-1 text-stone-500 hover:text-red-400"
                            title="Eliminar operación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: IMPORT SHIPMENTS FROM COLOMBIA */}
      {activeTab === 'IMPORT_SHIPMENTS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900 border border-stone-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">
                Expedientes y Lotes de Café Acopiado en Venezuela (Productores y Asociaciones Nacionales)
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Compras y acopio a productores y asociaciones venezolanas, pesaje, flete terrestre nacional y guías SICA / CVC a tasa oficial BCV.
              </p>
            </div>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Registrar Lote de Café Nacional
            </button>
          </div>

          {importShipments.length === 0 ? (
            <div className="bg-stone-900 border border-dashed border-stone-700 rounded-xl p-10 text-center text-xs text-stone-400 space-y-3">
              <p>No hay lotes de café registrados.</p>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-amber-600 text-stone-950 font-bold rounded-lg text-xs"
              >
                + Registrar Primer Lote de Café Nacional
              </button>
            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-300 font-mono-num">
                  <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="px-4 py-3">Código Lote</th>
                      <th className="px-4 py-3 font-sans">Proveedor / Asociación Venezolana</th>
                      <th className="px-4 py-3 font-sans">Variedad</th>
                      <th className="px-4 py-3 text-right">Volumen Qtl</th>
                      <th className="px-4 py-3 text-right">Valoración BCV USD</th>
                      <th className="px-4 py-3 text-right">Flete & Acopio USD</th>
                      <th className="px-4 py-3">Guía SICA</th>
                      <th className="px-4 py-3">Guía CVC</th>
                      <th className="px-4 py-3 text-center font-sans">Estatus</th>
                      <th className="px-4 py-3 text-center font-sans">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {importShipments.map((imp) => (
                      <tr key={imp.id} className="hover:bg-stone-800/40">
                        <td className="px-4 py-3 font-bold text-amber-400">{imp.shipmentCode || imp.batchCode}</td>
                        <td className="px-4 py-3 font-sans">
                          <div className="font-semibold text-white">{imp.supplierName}</div>
                          <div className="text-[10px] text-stone-400">{imp.supplierNit || imp.supplierRif} ({imp.originCountry || imp.locationState || 'Venezuela'})</div>
                        </td>
                        <td className="px-4 py-3 font-sans text-stone-200">{imp.coffeeVariety}</td>
                        <td className="px-4 py-3 text-right font-bold text-amber-300">{imp.volumeQtl} Qtl</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-400">${(imp.totalInvoiceUSD || imp.totalAmountUSD || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-stone-300">${((imp.internationalFreightUSD || 0) + (imp.customsCostsUSD || 0)).toLocaleString()}</td>
                        <td className="px-4 py-3 text-amber-500 font-mono text-[11px]">{imp.duaSeniatNumber || imp.sicaPermitNumber}</td>
                        <td className="px-4 py-3 text-stone-400 text-[11px]">{imp.insaiPermit || imp.cvcPermit}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                            {imp.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => deleteImportShipment(imp.id)}
                            className="p-1 text-stone-500 hover:text-red-400"
                            title="Eliminar lote"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: OCTOBER INVOICING & ADVANCES REGULARIZATION */}
      {activeTab === 'OCTOBER_INVOICES' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900 border border-stone-800 p-4 rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500 text-stone-950 font-bold text-[10px] rounded uppercase tracking-wider">
                  Inicio: Octubre 2026
                </span>
                <h3 className="text-sm font-bold text-white">
                  Facturación Definitiva a Clientes Nacionales
                </h3>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                A partir de octubre se factura formalmente a los clientes el café acopiado y entregado en Venezuela a tasa oficial BCV, sustituyendo y eliminando los anticipos en ventas recibidos previamente.
              </p>
            </div>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Facturar Entrega de Café (Octubre)
            </button>
          </div>

          {octoberInvoices.length === 0 ? (
            <div className="bg-stone-900 border border-dashed border-stone-700 rounded-xl p-10 text-center text-xs text-stone-400 space-y-3">
              <p>Aún no se han emitido facturas de entrega de octubre.</p>
              <p className="text-stone-500 max-w-md mx-auto">
                Los anticipos permanecen en el pasivo contable hasta la fecha de facturación en octubre. Puedes emitir la primera factura cruzando un anticipo existente.
              </p>
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="px-4 py-2 bg-emerald-600 text-stone-950 font-bold rounded-lg text-xs"
              >
                + Emitir Factura de Octubre
              </button>
            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-300 font-mono-num">
                  <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="px-4 py-3">N° Factura SENIAT</th>
                      <th className="px-4 py-3">Fecha (Octubre)</th>
                      <th className="px-4 py-3 font-sans">Cliente Receptor</th>
                      <th className="px-4 py-3">RIF</th>
                      <th className="px-4 py-3 text-right">Volumen Qtl</th>
                      <th className="px-4 py-3 text-right">Total Facturado (VES)</th>
                      <th className="px-4 py-3 text-right">Anticipo Amortizado (VES)</th>
                      <th className="px-4 py-3 text-right font-bold text-amber-400">Saldo por Cobrar (VES)</th>
                      <th className="px-4 py-3 text-center font-sans">Estatus</th>
                      <th className="px-4 py-3 text-center font-sans">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {octoberInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-stone-800/40">
                        <td className="px-4 py-3 font-bold text-amber-400">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3 text-stone-400">{inv.date}</td>
                        <td className="px-4 py-3 font-sans font-bold text-white">{inv.clientName}</td>
                        <td className="px-4 py-3 text-stone-400">{inv.clientRif}</td>
                        <td className="px-4 py-3 text-right font-semibold text-stone-200">{inv.coffeeVolumeQtl} Qtl</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-400">
                          Bs. {inv.totalInvoiceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right text-stone-300">
                          -Bs. {inv.amortizedAdvanceVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-amber-400">
                          Bs. {inv.balanceDueVES.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => deleteOctoberInvoice(inv.id)}
                            className="p-1 text-stone-500 hover:text-red-400"
                            title="Eliminar factura"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD CUSTOMER ADVANCE */}
      {showAdvanceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-lg w-full p-6 text-stone-200 shadow-2xl relative">
            <button
              onClick={() => setShowAdvanceModal(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white"
            >
              &times;
            </button>

            <h3 className="text-sm font-bold text-white mb-3">Registrar Anticipo en Ventas de Cliente</h3>

            <form onSubmit={handleCreateAdvance} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">N° Anticipo:</label>
                  <input
                    type="text"
                    required
                    value={advNumber}
                    onChange={(e) => setAdvNumber(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Fecha Recepción:</label>
                  <input
                    type="date"
                    required
                    value={advDate}
                    onChange={(e) => setAdvDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Cliente Comprador (Torrefactora / Distribuidora):</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Distribuidora Cafetalera Los Andes C.A."
                  value={advClient}
                  onChange={(e) => setAdvClient(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">RIF del Cliente:</label>
                  <input
                    type="text"
                    placeholder="J-00000000-0"
                    value={advRif}
                    onChange={(e) => setAdvRif(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Ref. Transferencia Banesco:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ref: 85940122"
                    value={advBankRef}
                    onChange={(e) => setAdvBankRef(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Monto en Bolívares (VES):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={advAmountVES || ''}
                    onChange={(e) => setAdvAmountVES(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Quintales de Café a Entregar:</label>
                  <input
                    type="number"
                    required
                    placeholder="Quintales (46 kg)"
                    value={advCoffeeQtl || ''}
                    onChange={(e) => setAdvCoffeeQtl(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-amber-300 font-bold"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-stone-950 rounded border border-stone-800 text-[11px] font-mono-num flex justify-between items-center">
                <span className="text-stone-400">Contravalor USD (Tasa BCV {currentRate.rateUsd.toFixed(2)}):</span>
                <span className="text-emerald-400 font-bold">${((advAmountVES || 0) / currentRate.rateUsd).toFixed(2)} USD</span>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <input
                  type="checkbox"
                  id="autoCreate"
                  checked={autoCreateBankAndVoucher}
                  onChange={(e) => setAutoCreateBankAndVoucher(e.target.checked)}
                  className="rounded border-stone-700 text-amber-600 focus:ring-0"
                />
                <label htmlFor="autoCreate" className="text-stone-300 cursor-pointer">
                  Generar automáticamente Asiento Contable (Pasivo Anticipo) y Movimiento Banesco
                </label>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanceModal(false)}
                  className="px-3.5 py-1.5 bg-stone-800 text-stone-300 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded shadow"
                >
                  Guardar Anticipo Real
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD FX PURCHASE (BANESCO) */}
      {showFxModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-lg w-full p-6 text-stone-200 shadow-2xl relative">
            <button
              onClick={() => setShowFxModal(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white"
            >
              &times;
            </button>

            <h3 className="text-sm font-bold text-white mb-3">Registrar Compra de Dólares a Banesco</h3>

            <form onSubmit={handleCreateFxPurchase} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">N° Operación:</label>
                  <input
                    type="text"
                    required
                    value={fxNumber}
                    onChange={(e) => setFxNumber(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Fecha Valor:</label>
                  <input
                    type="date"
                    required
                    value={fxDate}
                    onChange={(e) => setFxDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Bolívares Debitado Banesco:</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={fxDebitVES || ''}
                    onChange={(e) => setFxDebitVES(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Tasa Mesa Banesco (Bs/USD):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={fxRate || ''}
                    onChange={(e) => setFxRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-amber-300 font-bold"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-stone-950 rounded border border-stone-800 text-[11px] font-mono-num flex justify-between items-center">
                <span className="text-stone-400">Dólares acreditados en Cta Custodia Banesco:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  ${fxRate > 0 ? (fxDebitVES / fxRate).toFixed(2) : '0.00'} USD
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Referencia Banesco Mesa:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ref Banesco"
                    value={fxRef}
                    onChange={(e) => setFxRef(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Destino de los Dólares:</label>
                  <select
                    value={fxPurpose}
                    onChange={(e) => setFxPurpose(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                  >
                    <option value="PAGO_PROVEEDOR_VENEZUELA">Insumos y Maquinaria en Venezuela</option>
                    <option value="FLETE_INTERNACIONAL">Transporte y Flete Pesado Nacional</option>
                    <option value="GASTOS_ADUANEROS">Repuestos y Mantenimiento Agroindustrial</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFxModal(false)}
                  className="px-3.5 py-1.5 bg-stone-800 text-stone-300 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded shadow"
                >
                  Guardar Compra de Dólares
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NATIONAL COFFEE BATCH (VENEZUELA) */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-lg w-full p-6 text-stone-200 shadow-2xl relative">
            <button
              onClick={() => setShowImportModal(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white"
            >
              &times;
            </button>

            <h3 className="text-sm font-bold text-white mb-3">Registrar Lote de Café Acopiado (Venezuela)</h3>

            <form onSubmit={handleCreateImportShipment} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Código Lote:</label>
                  <input
                    type="text"
                    required
                    value={impCode}
                    onChange={(e) => setImpCode(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Fecha:</label>
                  <input
                    type="date"
                    required
                    value={impDate}
                    onChange={(e) => setImpDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Proveedor / Asociación Venezolana:</label>
                <input
                  type="text"
                  required
                  value={impSupplier}
                  onChange={(e) => setImpSupplier(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">NIT Proveedor:</label>
                  <input
                    type="text"
                    value={impNit}
                    onChange={(e) => setImpNit(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Variedad de Café:</label>
                  <input
                    type="text"
                    value={impVariety}
                    onChange={(e) => setImpVariety(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Volumen en Quintales:</label>
                  <input
                    type="number"
                    required
                    value={impVolumeQtl || ''}
                    onChange={(e) => setImpVolumeQtl(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-amber-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Factura Comercial (USD):</label>
                  <input
                    type="number"
                    required
                    value={impInvoiceUSD || ''}
                    onChange={(e) => setImpInvoiceUSD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">DUA SENIAT (Aduana):</label>
                  <input
                    type="text"
                    value={impDuaSeniat}
                    onChange={(e) => setImpDuaSeniat(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Permiso Sanitario INSAI:</label>
                  <input
                    type="text"
                    value={impInsai}
                    onChange={(e) => setImpInsai(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-3.5 py-1.5 bg-stone-800 text-stone-300 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded shadow"
                >
                  Guardar Lote de Café Nacional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD OCTOBER INVOICE */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl max-w-lg w-full p-6 text-stone-200 shadow-2xl relative">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white"
            >
              &times;
            </button>

            <h3 className="text-sm font-bold text-white mb-3">Emitir Factura Definitiva de Café a Tasa BCV (Octubre)</h3>

            <form onSubmit={handleCreateOctoberInvoice} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">N° Factura SENIAT:</label>
                  <input
                    type="text"
                    required
                    value={invNumber}
                    onChange={(e) => setInvNumber(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Fecha Emisión (Octubre):</label>
                  <input
                    type="date"
                    required
                    value={invDate}
                    onChange={(e) => setInvDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Cliente Receptor:</label>
                <input
                  type="text"
                  required
                  placeholder="Nombre de la empresa cliente"
                  value={invClient}
                  onChange={(e) => setInvClient(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">RIF Cliente:</label>
                  <input
                    type="text"
                    required
                    placeholder="J-00000000-0"
                    value={invRif}
                    onChange={(e) => setInvRif(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Quintales Entregados:</label>
                  <input
                    type="number"
                    required
                    value={invCoffeeQtl || ''}
                    onChange={(e) => setInvCoffeeQtl(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-amber-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1">Total Factura (USD):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={invTotalUSD || ''}
                    onChange={(e) => setInvTotalUSD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Anticipo Previsto Amortizado (VES):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={invAmortizedVES || ''}
                    onChange={(e) => setInvAmortizedVES(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 font-mono text-white font-bold"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-stone-950 rounded border border-stone-800 text-[11px] font-mono-num flex justify-between items-center">
                <span className="text-stone-400">Total en Bolívares (Tasa {currentRate.rateUsd.toFixed(2)}):</span>
                <span className="text-emerald-400 font-bold">
                  Bs. {((invTotalUSD || 0) * currentRate.rateUsd).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-3.5 py-1.5 bg-stone-800 text-stone-300 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded shadow"
                >
                  Emitir Factura de Octubre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
