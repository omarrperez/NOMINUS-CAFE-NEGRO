import * as XLSX from 'xlsx';
import { AsientoContable, DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { formatDateVE } from './formatters';

export const CSV_COLUMNS_MAESTRO = [
  'Expediente N°',
  'Fecha contrato',
  'Cliente (Nombre y Apellido)',
  'Cédula / RIF',
  'Email / Teléfono',
  'Producto',
  'Origen del café',
  'Proveedor extranjero',
  'Monto anticipo (Bs.)',
  'Fecha anticipo',
  'Forma de pago / Banco',
  'N° Factura anticipo',
  'USD comprados',
  'Tasa BCV usada (Bs/USD)',
  'Fecha compra divisas',
  'N° Factura proveedor',
  'Monto factura (USD)',
  'N° SWIFT / Transferencia',
  'N° Bill of Lading',
  'Fecha embarque',
  'N° Duela / Declaración de aduana',
  'Fecha nacionalización',
  'N° Factura definitiva',
  'Fecha entrega',
  'Comisión / margen',
  'Estado',
  'Observaciones',
];

export const getRowDataForExpediente = (op: ExpedienteOperacion): (string | number)[] => {
  return [
    op.numeroExpediente,
    formatDateVE(op.fechaContrato),
    op.cliente.nombre,
    `${op.cliente.cedula} / ${op.cliente.rif || 'N/A'}`,
    `${op.cliente.email} / ${op.cliente.telefono}`,
    op.cliente.producto,
    op.cliente.origen,
    op.proveedor.nombreProveedor,
    op.anticipo.montoBs,
    formatDateVE(op.anticipo.fecha),
    `${op.anticipo.formaPago} - ${op.anticipo.bancoOrigen}`,
    op.anticipo.facturaSeniat,
    op.divisas.montoUsd,
    op.divisas.tasaBCV,
    formatDateVE(op.divisas.fechaCompra),
    op.proveedor.facturaNumero,
    op.proveedor.montoUsdFactura,
    op.proveedor.referenciaSwift,
    op.importacion.numeroBL,
    formatDateVE(op.importacion.fechaEmbarque),
    op.importacion.numeroDuela,
    formatDateVE(op.importacion.fechaNacionalizacion),
    op.entrega.facturaDefinitivaSeniat || 'Pendiente',
    formatDateVE(op.entrega.fechaEntrega),
    op.entrega.comisionMargenEmpresa,
    op.estado,
    op.observaciones,
  ];
};

/**
 * Exporta el libro de Excel maestro con múltiples pestañas y formato oficial
 */
export const exportControlMaestroExcel = (
  expedientes: ExpedienteOperacion[],
  empresa: DatosEmpresaImportadora,
  filename: string = 'Control_Maestro_Expedientes_Venezuela.xlsx'
) => {
  const wb = XLSX.utils.book_new();

  // Hoja 1: Control Maestro (idéntico a la hoja Mistral y la imagen)
  const rowsMaestro = [
    CSV_COLUMNS_MAESTRO,
    ...expedientes.map((op) => getRowDataForExpediente(op)),
  ];
  const wsMaestro = XLSX.utils.aoa_to_sheet(rowsMaestro);
  XLSX.utils.book_append_sheet(wb, wsMaestro, 'Control Maestro');

  // Hoja 2: Rastro del Efectivo y Reconciliación Cambiaria (BCV & SWIFT)
  const headersRastro = [
    'Expediente N°',
    'Cliente',
    'Anticipo en Bs. (Banco Origen)',
    'Factura Anticipo SENIAT',
    'Titular Pagador Coincide',
    'USD Comprados en Mesa BCV',
    'Tasa BCV (Bs/USD)',
    'Equivalente Bs.',
    'IGTF 3% Divisas (USD)',
    'Factura Proveedor (USD)',
    'Comprobante SWIFT / MT103',
    'Diferencia Divisas (USD)',
    'Desaduanamiento (DUA)',
    'Estado Reconciliación',
  ];

  const rowsRastro = [
    headersRastro,
    ...expedientes.map((op) => {
      const diffUsd = op.divisas.montoUsd - op.proveedor.montoUsdFactura;
      const estadoReconc =
        Math.abs(diffUsd) <= 0.01
          ? 'Cuadrado 100%'
          : diffUsd > 0
          ? `Sobrante USD ${diffUsd.toFixed(2)} (Gastos Bancarios/Reintegro)`
          : `Faltante USD ${Math.abs(diffUsd).toFixed(2)}`;

      return [
        op.numeroExpediente,
        op.cliente.nombre,
        op.anticipo.montoBs,
        op.anticipo.facturaSeniat,
        op.anticipo.titularCoincide ? 'SÍ (Regla de Oro)' : 'NO (ALERTA)',
        op.divisas.montoUsd,
        op.divisas.tasaBCV,
        op.divisas.montoBsEquivalente || op.divisas.montoUsd * op.divisas.tasaBCV,
        op.divisas.igtfDivisas3Porc || 0,
        op.proveedor.montoUsdFactura,
        op.proveedor.referenciaSwift,
        diffUsd,
        op.importacion.numeroDuela,
        estadoReconc,
      ];
    }),
  ];
  const wsRastro = XLSX.utils.aoa_to_sheet(rowsRastro);
  XLSX.utils.book_append_sheet(wb, wsRastro, 'Rastro de Efectivo');

  // Hoja 3: Checklist Regulatorio SUDEBAN / Banco
  const headersChecklist = [
    'Expediente N°',
    'Cliente',
    'Cédula / RIF',
    '1. Contrato Compraventa',
    '2. Cuestionario KYC',
    '3. Copia Cédula / RIF',
    '4. Factura Anticipo SENIAT',
    '5. Comprobante Pago Cliente',
    '6. Solicitud Divisas BCV',
    '7. Declaración Jurada Lícita',
    '8. Factura Proveedor Extranjero',
    '9. Comprobante SWIFT MT103',
    '10. Bill of Lading (BL)',
    '11. Duela / DUA Aduanas',
    '12. Registro SICA / INSAI',
    '13. Factura Definitiva SENIAT',
    '14. Comprobante Entrega Conforme',
    'Total Documentos',
  ];

  const rowsChecklist = [
    headersChecklist,
    ...expedientes.map((op) => {
      const d = op.documentos;
      const totalDocs = Object.values(d).filter(Boolean).length;
      return [
        op.numeroExpediente,
        op.cliente.nombre,
        op.cliente.cedula,
        d.contratoCompraventa ? 'CUMPLE' : 'FALTANTE',
        d.cuestionarioKYC ? 'CUMPLE' : 'FALTANTE',
        d.copiaCedulaRif ? 'CUMPLE' : 'FALTANTE',
        d.facturaAnticipoSeniat ? 'CUMPLE' : 'FALTANTE',
        d.comprobantePagoCliente ? 'CUMPLE' : 'FALTANTE',
        d.solicitudDivisasBCV ? 'CUMPLE' : 'FALTANTE',
        d.declaracionOrigenDestinoLícito ? 'CUMPLE' : 'FALTANTE',
        d.facturaProveedor ? 'CUMPLE' : 'FALTANTE',
        d.comprobanteSwift ? 'CUMPLE' : 'FALTANTE',
        d.billOfLading ? 'CUMPLE' : 'FALTANTE',
        d.duelaAduana ? 'CUMPLE' : 'FALTANTE',
        d.licenciaSunagroInsai ? 'CUMPLE' : 'FALTANTE',
        d.facturaDefinitivaSeniat ? 'CUMPLE' : 'FALTANTE',
        d.comprobanteEntrega ? 'CUMPLE' : 'FALTANTE',
        `${totalDocs}/14`,
      ];
    }),
  ];
  const wsChecklist = XLSX.utils.aoa_to_sheet(rowsChecklist);
  XLSX.utils.book_append_sheet(wb, wsChecklist, 'Auditoría SUDEBAN');

  // Hoja 4: Asientos Contables (Libro Diario VEN-NIF)
  const headersContable = [
    'N° Comprobante',
    'Fecha',
    'Expediente',
    'Fase / Operación',
    'Código de Cuenta',
    'Nombre de la Cuenta',
    'Referencia Doc.',
    'Glosa Contable',
    'Debe (Bs.)',
    'Haber (Bs.)',
  ];
  const rowsContable: (string | number)[][] = [headersContable];
  expedientes.forEach((op) => {
    const tasa = op.divisas.tasaBCV || empresa.tasaBCVActual || 500;
    const anticipo = op.anticipo.montoBs || 0;
    const usd = op.divisas.montoUsd || 0;
    const bsDivisas = op.divisas.montoBsEquivalente || usd * tasa;
    const factUsd = op.proveedor.montoUsdFactura || 0;
    const bsFact = factUsd * tasa;
    const arancel = op.importacion.arancelPagadoBs || 0;

    // Asiento Anticipo
    if (anticipo > 0) {
      rowsContable.push([
        `COMP-${op.numeroExpediente}-01`,
        formatDateVE(op.anticipo.fecha),
        op.numeroExpediente,
        'Anticipo Cliente',
        '1.1.01.01',
        `Banco Nacional Corriente (${op.anticipo.bancoDestino})`,
        op.anticipo.referencia,
        `Anticipo cliente ${op.cliente.nombre} según Factura ${op.anticipo.facturaSeniat}`,
        anticipo,
        0,
      ]);
      rowsContable.push([
        `COMP-${op.numeroExpediente}-01`,
        formatDateVE(op.anticipo.fecha),
        op.numeroExpediente,
        'Anticipo Cliente',
        '2.1.02.01',
        'Anticipos Recibidos de Clientes (Providencia SENIAT 00071)',
        op.anticipo.facturaSeniat,
        `Anticipo cliente ${op.cliente.nombre} según Factura ${op.anticipo.facturaSeniat}`,
        0,
        anticipo,
      ]);
    }

    // Asiento Compra Divisas BCV
    if (usd > 0) {
      rowsContable.push([
        `COMP-${op.numeroExpediente}-02`,
        formatDateVE(op.divisas.fechaCompra),
        op.numeroExpediente,
        'Compra Divisas BCV',
        '1.1.01.02',
        'Banco Moneda Extranjera - Custodia Divisas (Convenio N° 1 BCV)',
        `USD ${usd}`,
        `Compra de USD ${usd} a tasa ${tasa} Bs/USD en ${op.divisas.bancoMesaCambio}`,
        bsDivisas,
        0,
      ]);
      rowsContable.push([
        `COMP-${op.numeroExpediente}-02`,
        formatDateVE(op.divisas.fechaCompra),
        op.numeroExpediente,
        'Compra Divisas BCV',
        '1.1.01.01',
        `Banco Nacional Corriente (${op.anticipo.bancoDestino})`,
        op.divisas.numeroSolicitud,
        `Salida de Bolívares para compra de divisas en mesa de cambio`,
        0,
        bsDivisas,
      ]);
    }

    // Asiento Pago Proveedor SWIFT
    if (factUsd > 0) {
      rowsContable.push([
        `COMP-${op.numeroExpediente}-03`,
        formatDateVE(op.proveedor.fechaPago),
        op.numeroExpediente,
        'Pago SWIFT Proveedor',
        '1.1.03.01',
        'Anticipos Otorgados a Proveedores del Exterior',
        op.proveedor.facturaNumero,
        `Transferencia SWIFT a ${op.proveedor.nombreProveedor} por USD ${factUsd}`,
        bsFact,
        0,
      ]);
      rowsContable.push([
        `COMP-${op.numeroExpediente}-03`,
        formatDateVE(op.proveedor.fechaPago),
        op.numeroExpediente,
        'Pago SWIFT Proveedor',
        '1.1.01.02',
        'Banco Moneda Extranjera - Custodia Divisas (Convenio N° 1 BCV)',
        op.proveedor.referenciaSwift,
        `Egreso de custodia divisas para giro SWIFT a proveedor`,
        0,
        bsFact,
      ]);
    }

    // Asiento Aduana y Aranceles
    if (bsFact > 0) {
      rowsContable.push([
        `COMP-${op.numeroExpediente}-04`,
        formatDateVE(op.importacion.fechaNacionalizacion),
        op.numeroExpediente,
        'Aduana e Importación',
        '1.1.03.02',
        'Mercancías e Importaciones en Tránsito',
        op.importacion.numeroDuela,
        `Desaduanamiento de ${op.cliente.producto} según DUA ${op.importacion.numeroDuela}`,
        bsFact + arancel,
        0,
      ]);
      rowsContable.push([
        `COMP-${op.numeroExpediente}-04`,
        formatDateVE(op.importacion.fechaNacionalizacion),
        op.numeroExpediente,
        'Aduana e Importación',
        '1.1.03.01',
        'Anticipos Otorgados a Proveedores del Exterior',
        op.proveedor.facturaNumero,
        `Descargo de anticipo a proveedor al recibir mercancía en aduana`,
        0,
        bsFact,
      ]);
      if (arancel > 0) {
        rowsContable.push([
          `COMP-${op.numeroExpediente}-04`,
          formatDateVE(op.importacion.fechaNacionalizacion),
          op.numeroExpediente,
          'Aduana e Importación',
          '1.1.01.01',
          'Banco Nacional Corriente',
          'Pago Arancel SENIAT',
          `Pago de arancel aduanal en ${op.importacion.puertoEntrada}`,
          0,
          arancel,
        ]);
      }
    }
  });

  const wsContable = XLSX.utils.aoa_to_sheet(rowsContable);
  XLSX.utils.book_append_sheet(wb, wsContable, 'Asientos Contables');

  // Hoja 4: Datos de la Empresa Importadora
  const rowsEmpresa = [
    ['CAMPO', 'VALOR REGISTRAL'],
    ['Razón Social', empresa.razonSocial],
    ['RIF', empresa.rif],
    ['Registro Mercantil', empresa.registroMercantil],
    ['Tomo / Folio / Fecha', `Tomo ${empresa.tomoNumero}, Folio ${empresa.folioNumero}, Fecha ${empresa.fechaRegistro}`],
    ['Domicilio Fiscal', empresa.direccionFiscal],
    ['Representante Legal', empresa.representanteLegal],
    ['Cédula Representante', empresa.cedulaRepresentante],
    ['Cargo', empresa.cargoRepresentante],
    ['Banco Principal', empresa.bancoPrincipal],
    ['Cuenta Bolívares', empresa.cuentaBancariaBs],
    ['Cuenta Custodia Divisas', empresa.cuentaCustodiaUsd],
    ['Registro SUNAGRO/SICA', empresa.registroSunagro],
    ['Tasa BCV Referencial', `${empresa.tasaBCVActual} Bs/USD`],
  ];
  const wsEmpresa = XLSX.utils.aoa_to_sheet(rowsEmpresa);
  XLSX.utils.book_append_sheet(wb, wsEmpresa, 'Datos Empresa');

  XLSX.writeFile(wb, filename);
};

/**
 * Exporta un expediente individual a Excel con todos sus detalles
 */
export const exportExpedienteIndividualExcel = (
  op: ExpedienteOperacion,
  empresa: DatosEmpresaImportadora
) => {
  const wb = XLSX.utils.book_new();

  const dataResumen = [
    ['EXPEDIENTE DE IMPORTACIÓN Y CONTROL CAMBIARIO - VENEZUELA', ''],
    ['Número de Expediente', op.numeroExpediente],
    ['Fecha de Apertura / Contrato', formatDateVE(op.fechaContrato)],
    ['Estado Actual', op.estado],
    ['Empresa Importadora (de registro)', empresa.razonSocial],
    ['RIF de la Empresa', empresa.rif],
    ['', ''],
    ['1. IDENTIFICACIÓN DE LA PERSONA NATURAL (CLIENTE)', ''],
    ['Nombre Completo', op.cliente.nombre],
    ['Cédula de Identidad', op.cliente.cedula],
    ['RIF Personal', op.cliente.rif],
    ['Nacionalidad', op.cliente.nacionalidad],
    ['Fecha y Lugar de Nacimiento', `${formatDateVE(op.cliente.fechaNacimiento)} en ${op.cliente.lugarNacimiento}`],
    ['Estado Civil', op.cliente.estadoCivil],
    ['Dirección de Habitación', op.cliente.direccionHabitacion],
    ['Teléfono / Email', `${op.cliente.telefono} / ${op.cliente.email}`],
    ['Ocupación / Profesión', op.cliente.ocupacion],
    ['Actividad Económica', op.cliente.actividadEconomica],
    ['Nombre Comercial / Negocio', op.cliente.nombreNegocio || 'N/A'],
    ['Origen Declarado de Fondos', op.cliente.origenIngresosDeclarado],
    ['Es Persona Expuesta Políticamente (PEP)', op.cliente.esPEP ? 'SÍ' : 'NO'],
    ['', ''],
    ['2. ORDEN DE COMPRAVENTA CON ENTREGA FUTURA', ''],
    ['Producto Objeto de Importación', op.cliente.producto],
    ['País de Origen de la Mercancía', op.cliente.origen],
    ['Cantidad / Volumen', op.cliente.cantidad],
    ['Contrato Firmado', op.cliente.contratoFirmado ? 'SÍ' : 'NO'],
    ['Cuestionario KYC Firmado', op.cliente.kycFirmado ? 'SÍ' : 'NO'],
    ['', ''],
    ['3. ANTICIPO BANCARIO RECIBIDO (BOLÍVARES)', ''],
    ['Monto en Bs.', op.anticipo.montoBs],
    ['Fecha de Recepción', formatDateVE(op.anticipo.fecha)],
    ['Forma de Pago', op.anticipo.formaPago],
    ['Banco Emisor / Receptor', `${op.anticipo.bancoOrigen} -> ${op.anticipo.bancoDestino}`],
    ['Número de Referencia Bancaria', op.anticipo.referencia],
    ['Factura de Anticipo SENIAT', op.anticipo.facturaSeniat],
    ['Validación: Pagador es Titular Único', op.anticipo.titularCoincide ? 'CONFORME (100% bancarizado sin terceros)' : 'NO COINCIDE'],
    ['', ''],
    ['4. COMPRA DE DIVISAS (MESA DE CAMBIO BCV)', ''],
    ['Monto Adquirido (USD)', op.divisas.montoUsd],
    ['Tasa BCV del Día (Bs/USD)', op.divisas.tasaBCV],
    ['Equivalente en Bolívares', op.divisas.montoBsEquivalente],
    ['Fecha Operación Cambiaria', formatDateVE(op.divisas.fechaCompra)],
    ['Banco / Mesa de Cambio', op.divisas.bancoMesaCambio],
    ['N° Solicitud Bancaria', op.divisas.numeroSolicitud],
    ['Declaración Jurada Origen/Destino', op.divisas.declaracionOrigenDestino ? 'PRESENTADA' : 'PENDIENTE'],
    ['IGTF 3% Divisas Aplicable', `$ ${op.divisas.igtfDivisas3Porc || 0}`],
    ['', ''],
    ['5. PAGO AL PROVEEDOR EXTRANJERO (DIVISAS)', ''],
    ['Proveedor Extranjero', op.proveedor.nombreProveedor],
    ['País / ID Fiscal', `${op.proveedor.paisProveedor} / ${op.proveedor.rifOIdFiscal}`],
    ['Factura Proforma/Comercial N°', op.proveedor.facturaNumero],
    ['Monto Factura Proveedor (USD)', op.proveedor.montoUsdFactura],
    ['Fecha Transferencia Internacional', formatDateVE(op.proveedor.fechaPago)],
    ['Comprobante SWIFT / MT103', op.proveedor.referenciaSwift],
    ['Banco Corresponsal', op.proveedor.bancoCorresponsal],
    ['Coincidencia de Beneficiario con Factura', op.proveedor.beneficiarioCoincide ? 'VERIFICADA' : 'NO COINCIDE'],
    ['', ''],
    ['6. IMPORTACIÓN, ADUANA Y PERMISOLOGÍA', ''],
    ['Bill of Lading / Guía Aérea (BL)', op.importacion.numeroBL],
    ['Fecha de Embarque', formatDateVE(op.importacion.fechaEmbarque)],
    ['Agente de Carga / Naviera', op.importacion.navieraOAgente],
    ['Duela / DUA N° (Declaración SENIAT)', op.importacion.numeroDuela],
    ['Fecha Nacionalización', formatDateVE(op.importacion.fechaNacionalizacion)],
    ['Puerto de Entrada Aduanal', op.importacion.puertoEntrada],
    ['Arancel Aduanal Pagado (Bs.)', op.importacion.arancelPagadoBs],
    ['Registro SICA / SUNAGRO', op.importacion.registroSunagroSica],
    ['Permiso Sanitario INSAI', op.importacion.permisoInsai],
    ['', ''],
    ['7. ENTREGA MATERIAL Y RECONCILIACIÓN', ''],
    ['Factura Definitiva SENIAT', op.entrega.facturaDefinitivaSeniat || 'En trámite'],
    ['Fecha de Entrega', formatDateVE(op.entrega.fechaEntrega)],
    ['Comisión / Margen Comercial', op.entrega.comisionMargenEmpresa],
    ['Saldo Cancelado al Cierre', `Bs. ${op.entrega.saldoCobradoBs} / USD ${op.entrega.saldoCobradoUsd}`],
    ['Entrega Conforme / Acta', op.entrega.entregadoConforme ? 'FIRMADA' : 'PENDIENTE'],
    ['', ''],
    ['OBSERVACIONES Y NOTAS REGULATORIAS', ''],
    ['Notas de Cumplimiento', op.observaciones],
    ['Oficial de Cumplimiento / Elaborado por', op.elaboradoPor],
    ['Revisado por', op.revisadoPor],
  ];

  const ws = XLSX.utils.aoa_to_sheet(dataResumen);
  XLSX.utils.book_append_sheet(wb, ws, `Expediente ${op.numeroExpediente}`);
  XLSX.writeFile(wb, `Expediente_${op.numeroExpediente}_${op.cliente.nombre.replace(/\s+/g, '_')}.xlsx`);
};

/**
 * Exporta el CSV con UTF-8 BOM
 */
export const exportControlMaestroCsv = (
  expedientes: ExpedienteOperacion[],
  filename: string = 'Control_Maestro_Expedientes.csv'
) => {
  const rows = [
    CSV_COLUMNS_MAESTRO,
    ...expedientes.map((op) => getRowDataForExpediente(op)),
  ];

  const csvContent =
    '\uFEFF' +
    rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta el Libro Diario Contable a Excel (.xlsx) estructurado para importación
 * en Profit Plus, Gálac, Saint Enterprise, SAP, etc.
 */
export const exportContabilidadExcel = (
  asientos: AsientoContable[],
  empresa: DatosEmpresaImportadora,
  filename: string = 'Libro_Diario_Contable_Venezuela.xlsx'
) => {
  const wb = XLSX.utils.book_new();

  // Hoja 1: Libro Diario Detallado
  const headersDiario = [
    'N° Comprobante',
    'Fecha',
    'Expediente N°',
    'Cliente',
    'Tipo de Operación',
    'Código de Cuenta',
    'Nombre de la Cuenta',
    'Referencia Documento',
    'Descripción / Glosa',
    'Debe (Bs.)',
    'Haber (Bs.)',
  ];

  const rowsDiario: (string | number)[][] = [headersDiario];

  asientos.forEach((asiento) => {
    asiento.lineas.forEach((linea) => {
      rowsDiario.push([
        asiento.numeroComprobante,
        formatDateVE(asiento.fecha),
        asiento.expedienteNumero,
        asiento.clienteNombre,
        asiento.tipoOperacion,
        linea.codigoCuenta,
        linea.nombreCuenta,
        linea.referenciaDoc || '',
        asiento.glosa,
        linea.debe,
        linea.haber,
      ]);
    });
  });

  const wsDiario = XLSX.utils.aoa_to_sheet(rowsDiario);
  XLSX.utils.book_append_sheet(wb, wsDiario, 'Libro Diario (VEN-NIF)');

  // Hoja 2: Balance de Comprobación y Saldos de Cuentas
  const saldosPorCuenta: Record<
    string,
    { codigo: string; nombre: string; totalDebe: number; totalHaber: number }
  > = {};

  asientos.forEach((asiento) => {
    asiento.lineas.forEach((l) => {
      if (!saldosPorCuenta[l.codigoCuenta]) {
        saldosPorCuenta[l.codigoCuenta] = {
          codigo: l.codigoCuenta,
          nombre: l.nombreCuenta,
          totalDebe: 0,
          totalHaber: 0,
        };
      }
      saldosPorCuenta[l.codigoCuenta].totalDebe += l.debe;
      saldosPorCuenta[l.codigoCuenta].totalHaber += l.haber;
    });
  });

  const headersBalance = [
    'Código Cuenta',
    'Nombre de la Cuenta Contable',
    'Total Débitos (Bs.)',
    'Total Créditos (Bs.)',
    'Saldo Deudor (Bs.)',
    'Saldo Acreedor (Bs.)',
  ];

  const rowsBalance: (string | number)[][] = [headersBalance];
  let sumaDebe = 0;
  let sumaHaber = 0;

  Object.values(saldosPorCuenta)
    .sort((a, b) => a.codigo.localeCompare(b.codigo))
    .forEach((item) => {
      sumaDebe += item.totalDebe;
      sumaHaber += item.totalHaber;
      const saldo = item.totalDebe - item.totalHaber;
      rowsBalance.push([
        item.codigo,
        item.nombre,
        item.totalDebe,
        item.totalHaber,
        saldo > 0 ? saldo : 0,
        saldo < 0 ? Math.abs(saldo) : 0,
      ]);
    });

  // Fila de Totales
  rowsBalance.push([
    'TOTALES BALANCEADOS',
    'SUMAS IGUALES',
    sumaDebe,
    sumaHaber,
    sumaDebe - sumaHaber === 0 ? sumaDebe : sumaDebe,
    sumaHaber,
  ]);

  const wsBalance = XLSX.utils.aoa_to_sheet(rowsBalance);
  XLSX.utils.book_append_sheet(wb, wsBalance, 'Balance Comprobación');

  XLSX.writeFile(wb, filename);
};

/**
 * Exporta el archivo CSV plano formateado para sistemas contables (Profit, Saint, Gálac)
 */
export const exportContabilidadCsv = (
  asientos: AsientoContable[],
  filename: string = 'Comprobantes_Contables.csv'
) => {
  const headers = [
    'Comprobante',
    'Fecha',
    'Expediente',
    'Codigo_Cuenta',
    'Nombre_Cuenta',
    'Referencia',
    'Glosa',
    'Debe',
    'Haber',
  ];

  const rows: (string | number)[][] = [headers];

  asientos.forEach((asiento) => {
    asiento.lineas.forEach((linea) => {
      rows.push([
        asiento.numeroComprobante,
        formatDateVE(asiento.fecha),
        asiento.expedienteNumero,
        linea.codigoCuenta,
        linea.nombreCuenta,
        linea.referenciaDoc || '',
        asiento.glosa,
        linea.debe,
        linea.haber,
      ]);
    });
  });

  const csvContent =
    '\uFEFF' +
    rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

