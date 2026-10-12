import { AsientoContable, DatosEmpresaImportadora, ExpedienteOperacion, LineaAsiento } from '../types';
import { formatDateVE } from './formatters';

export const PLAN_DE_CUENTAS = [
  { codigo: '1.1.01.01', nombre: 'Banco Nacional Corriente en Bs.', tipo: 'Activo' },
  { codigo: '1.1.01.02', nombre: 'Banco Moneda Extranjera - Custodia Divisas (BCV)', tipo: 'Activo' },
  { codigo: '1.1.02.01', nombre: 'Cuentas por Cobrar Clientes', tipo: 'Activo' },
  { codigo: '1.1.02.02', nombre: 'Cuentas por Cobrar Socio / Director General (Elias Rafael Trias Abreu)', tipo: 'Activo' },
  { codigo: '1.1.03.01', nombre: 'Anticipos Otorgados a Proveedores del Exterior', tipo: 'Activo' },
  { codigo: '1.1.03.02', nombre: 'Mercancías e Importaciones en Tránsito', tipo: 'Activo' },
  { codigo: '1.1.04.01', nombre: 'Crédito Fiscal IVA Aduanal (SENIAT)', tipo: 'Activo' },
  { codigo: '1.1.05.01', nombre: 'Inventario de Mercancías Disponibles', tipo: 'Activo' },
  { codigo: '2.1.02.01', nombre: 'Anticipos Recibidos de Clientes (Pasivo Comercial)', tipo: 'Pasivo' },
  { codigo: '2.1.03.01', nombre: 'Débito Fiscal IVA por Pagar', tipo: 'Pasivo' },
  { codigo: '2.1.04.01', nombre: 'Cuentas por Pagar Socio / Director General (Elias Rafael Trias Abreu)', tipo: 'Pasivo' },
  { codigo: '4.1.01.01', nombre: 'Ingresos por Ventas de Mercancías Importadas', tipo: 'Ingreso' },
  { codigo: '4.1.02.01', nombre: 'Ingresos por Servicios y Comisiones de Importación', tipo: 'Ingreso' },
  { codigo: '5.1.01.01', nombre: 'Costo de Ventas - Mercancía Importada', tipo: 'Costo' },
  { codigo: '6.1.01.02', nombre: 'Gastos Financieros - Comisiones SWIFT Internacional', tipo: 'Gasto' },
  { codigo: '6.1.01.03', nombre: 'Gastos por Impuesto a Grandes Transacciones Financieras (IGTF 3%)', tipo: 'Gasto' },
  { codigo: '6.1.02.01', nombre: 'Diferencia en Cambio (Ganancia / Pérdida NIIF)', tipo: 'Gasto/Ingreso' },
];

/**
 * Genera de forma matemática y estricta los asientos contables para un expediente
 */
export const generarAsientosParaExpediente = (
  op: ExpedienteOperacion,
  empresa: DatosEmpresaImportadora,
  indiceBase: number = 1
): AsientoContable[] => {
  const asientos: AsientoContable[] = [];
  let contador = indiceBase;

  const tasaUsada = op.divisas.tasaBCV || empresa.tasaBCVActual || 500;
  const montoBsAnticipo = op.anticipo.montoBs || 0;
  const montoUsdComprado = op.divisas.montoUsd || 0;
  const montoBsEquivDivisas = op.divisas.montoBsEquivalente || montoUsdComprado * tasaUsada;
  const montoUsdFacturaProv = op.proveedor.montoUsdFactura || 0;
  const montoBsFacturaProv = montoUsdFacturaProv * tasaUsada;
  const arancelBs = op.importacion.arancelPagadoBs || 0;
  const saldoCobradoBs = op.entrega.saldoCobradoBs || 0;

  // =========================================================================
  // ASIENTO 1: RECEPCIÓN DEL ANTICIPO DEL CLIENTE EN BOLÍVARES
  // =========================================================================
  if (montoBsAnticipo > 0) {
    const lineas: LineaAsiento[] = [
      {
        codigoCuenta: '1.1.01.01',
        nombreCuenta: `Banco Nacional Corriente (${op.anticipo.bancoDestino || 'Principal'})`,
        debe: montoBsAnticipo,
        haber: 0,
        referenciaDoc: `Ref. ${op.anticipo.referencia}`,
      },
      {
        codigoCuenta: '2.1.02.01',
        nombreCuenta: 'Anticipos Recibidos de Clientes (Providencia SENIAT 00071)',
        debe: 0,
        haber: montoBsAnticipo,
        referenciaDoc: `Fac. Anticipo ${op.anticipo.facturaSeniat}`,
      },
    ];

    asientos.push({
      id: `asiento-${op.id}-1`,
      numeroComprobante: `COMP-${op.numeroExpediente}-01`,
      fecha: op.anticipo.fecha,
      expedienteNumero: op.numeroExpediente,
      clienteNombre: op.cliente.nombre,
      tipoOperacion: 'Anticipo Cliente',
      glosa: `Recepción de anticipo del cliente ${op.cliente.nombre} (${op.cliente.cedula}) vía ${op.anticipo.formaPago} Ref. ${op.anticipo.referencia} desde ${op.anticipo.bancoOrigen}, según Contrato N° ${op.numeroExpediente} y Factura de Anticipo SENIAT N° ${op.anticipo.facturaSeniat}.`,
      lineas,
      totalDebe: montoBsAnticipo,
      totalHaber: montoBsAnticipo,
      cuadrado: true,
    });
    contador++;
  }

  // =========================================================================
  // ASIENTO 2: COMPRA DE DIVISAS EN MESA DE CAMBIO BCV (CONVENIO CAMBIARIO N° 1)
  // =========================================================================
  if (montoUsdComprado > 0) {
    const igtfUsd = op.divisas.igtfDivisas3Porc || 0;
    const igtfBs = igtfUsd * tasaUsada;
    const totalSalidaBancoBs = montoBsEquivDivisas + igtfBs;

    const lineas: LineaAsiento[] = [
      {
        codigoCuenta: '1.1.01.02',
        nombreCuenta: 'Banco Moneda Extranjera - Custodia Divisas (Convenio N° 1 BCV)',
        debe: montoBsEquivDivisas,
        haber: 0,
        referenciaDoc: `USD ${montoUsdComprado.toLocaleString('en-US')}`,
      },
    ];

    if (igtfBs > 0) {
      lineas.push({
        codigoCuenta: '6.1.01.03',
        nombreCuenta: 'Gastos por Impuesto a Grandes Transacciones Financieras (IGTF 3%)',
        debe: igtfBs,
        haber: 0,
        referenciaDoc: `3% sobre USD ${montoUsdComprado}`,
      });
    }

    lineas.push({
      codigoCuenta: '1.1.01.01',
      nombreCuenta: `Banco Nacional Corriente (${op.anticipo.bancoDestino || 'Principal'})`,
      debe: 0,
      haber: totalSalidaBancoBs,
      referenciaDoc: `Sol. ${op.divisas.numeroSolicitud}`,
    });

    asientos.push({
      id: `asiento-${op.id}-2`,
      numeroComprobante: `COMP-${op.numeroExpediente}-02`,
      fecha: op.divisas.fechaCompra,
      expedienteNumero: op.numeroExpediente,
      clienteNombre: op.cliente.nombre,
      tipoOperacion: 'Compra Divisas BCV',
      glosa: `Adquisición de USD ${montoUsdComprado.toLocaleString('en-US')} a la Tasa Oficial BCV de ${tasaUsada} Bs/USD en Mesa de Cambio ${op.divisas.bancoMesaCambio} (Sol. ${op.divisas.numeroSolicitud}) con Declaración Jurada de Origen y Destino Lícito para Expediente ${op.numeroExpediente}.`,
      lineas,
      totalDebe: totalSalidaBancoBs,
      totalHaber: totalSalidaBancoBs,
      cuadrado: true,
    });
    contador++;
  }

  // =========================================================================
  // ASIENTO 3: PAGO AL PROVEEDOR INTERNACIONAL (TRANSFERENCIA SWIFT)
  // =========================================================================
  if (montoUsdFacturaProv > 0) {
    const diffUsd = montoUsdComprado - montoUsdFacturaProv;
    const comisionSwiftBs = diffUsd > 0 ? diffUsd * tasaUsada : 0;
    const totalSalidaCustodiaBs = montoBsFacturaProv + comisionSwiftBs;

    const lineas: LineaAsiento[] = [
      {
        codigoCuenta: '1.1.03.01',
        nombreCuenta: 'Anticipos Otorgados a Proveedores del Exterior',
        debe: montoBsFacturaProv,
        haber: 0,
        referenciaDoc: `Fac. Prov ${op.proveedor.facturaNumero}`,
      },
    ];

    if (comisionSwiftBs > 0) {
      lineas.push({
        codigoCuenta: '6.1.01.02',
        nombreCuenta: 'Gastos Financieros - Comisiones Mensaje SWIFT Internacional',
        debe: comisionSwiftBs,
        haber: 0,
        referenciaDoc: `Comisión USD ${diffUsd.toFixed(2)}`,
      });
    }

    lineas.push({
      codigoCuenta: '1.1.01.02',
      nombreCuenta: 'Banco Moneda Extranjera - Custodia Divisas (Convenio N° 1 BCV)',
      debe: 0,
      haber: totalSalidaCustodiaBs,
      referenciaDoc: `SWIFT ${op.proveedor.referenciaSwift}`,
    });

    asientos.push({
      id: `asiento-${op.id}-3`,
      numeroComprobante: `COMP-${op.numeroExpediente}-03`,
      fecha: op.proveedor.fechaPago,
      expedienteNumero: op.numeroExpediente,
      clienteNombre: op.cliente.nombre,
      tipoOperacion: 'Pago SWIFT Proveedor',
      glosa: `Pago internacional a proveedor ${op.proveedor.nombreProveedor} (${op.proveedor.paisProveedor}) por USD ${montoUsdFacturaProv.toLocaleString('en-US')} mediante transferencia SWIFT MT103 Ref. ${op.proveedor.referenciaSwift}, según Factura Comercial N° ${op.proveedor.facturaNumero}.`,
      lineas,
      totalDebe: totalSalidaCustodiaBs,
      totalHaber: totalSalidaCustodiaBs,
      cuadrado: true,
    });
    contador++;
  }

  // =========================================================================
  // ASIENTO 4: DESADUANAMIENTO SENIAT Y MERCANCÍAS EN TRÁNSITO
  // =========================================================================
  if (montoBsFacturaProv > 0) {
    const totalTransitoBs = montoBsFacturaProv + arancelBs;

    const lineas: LineaAsiento[] = [
      {
        codigoCuenta: '1.1.03.02',
        nombreCuenta: 'Mercancías e Importaciones en Tránsito',
        debe: totalTransitoBs,
        haber: 0,
        referenciaDoc: `BL ${op.importacion.numeroBL || 'Pendiente'}`,
      },
      {
        codigoCuenta: '1.1.03.01',
        nombreCuenta: 'Anticipos Otorgados a Proveedores del Exterior',
        debe: 0,
        haber: montoBsFacturaProv,
        referenciaDoc: `Fac. Prov ${op.proveedor.facturaNumero}`,
      },
    ];

    if (arancelBs > 0) {
      lineas.push({
        codigoCuenta: '1.1.01.01',
        nombreCuenta: `Banco Nacional Corriente (${op.anticipo.bancoDestino || 'Principal'})`,
        debe: 0,
        haber: arancelBs,
        referenciaDoc: `DUA ${op.importacion.numeroDuela}`,
      });
    }

    asientos.push({
      id: `asiento-${op.id}-4`,
      numeroComprobante: `COMP-${op.numeroExpediente}-04`,
      fecha: op.importacion.fechaNacionalizacion || op.importacion.fechaEmbarque,
      expedienteNumero: op.numeroExpediente,
      clienteNombre: op.cliente.nombre,
      tipoOperacion: 'Aranceles y Aduana',
      glosa: `Registro de embarque y nacionalización aduanera de ${op.cliente.producto} (${op.cliente.cantidad}) según BL N° ${op.importacion.numeroBL} y Declaración de Aduana DUA SENIAT N° ${op.importacion.numeroDuela} en ${op.importacion.puertoEntrada}.`,
      lineas,
      totalDebe: totalTransitoBs,
      totalHaber: totalTransitoBs,
      cuadrado: true,
    });
    contador++;
  }

  // =========================================================================
  // ASIENTO 5: FACTURA DEFINITIVA SENIAT, CIERRE DE ANTICIPO Y COSTO DE VENTA
  // =========================================================================
  if (op.entrega.facturaDefinitivaSeniat || op.estado === 'Cerrado') {
    const totalVentaBs = montoBsAnticipo + saldoCobradoBs;
    const totalCostoBs = montoBsFacturaProv + arancelBs;

    const lineas: LineaAsiento[] = [
      {
        codigoCuenta: '2.1.02.01',
        nombreCuenta: 'Anticipos Recibidos de Clientes (Liquidación de Pasivo)',
        debe: montoBsAnticipo,
        haber: 0,
        referenciaDoc: `Fac. Anticipo ${op.anticipo.facturaSeniat}`,
      },
    ];

    if (saldoCobradoBs > 0) {
      lineas.push({
        codigoCuenta: '1.1.01.01',
        nombreCuenta: `Banco Nacional Corriente (${op.anticipo.bancoDestino || 'Principal'})`,
        debe: saldoCobradoBs,
        haber: 0,
        referenciaDoc: 'Cobro de saldo final',
      });
    }

    lineas.push({
      codigoCuenta: '4.1.01.01',
      nombreCuenta: 'Ingresos por Ventas de Mercancías Importadas (SENIAT)',
      debe: 0,
      haber: totalVentaBs,
      referenciaDoc: `Fac. Def ${op.entrega.facturaDefinitivaSeniat || 'F-DEF'}`,
    });

    // Costo de Ventas
    lineas.push({
      codigoCuenta: '5.1.01.01',
      nombreCuenta: 'Costo de Ventas - Mercancía Importada',
      debe: totalCostoBs,
      haber: 0,
      referenciaDoc: 'Costeo Importación',
    });

    lineas.push({
      codigoCuenta: '1.1.03.02',
      nombreCuenta: 'Mercancías e Importaciones en Tránsito (Descargo de Inventario)',
      debe: 0,
      haber: totalCostoBs,
      referenciaDoc: 'Descargo Almacén',
    });

    const granTotalDebe = montoBsAnticipo + saldoCobradoBs + totalCostoBs;
    const granTotalHaber = totalVentaBs + totalCostoBs;

    asientos.push({
      id: `asiento-${op.id}-5`,
      numeroComprobante: `COMP-${op.numeroExpediente}-05`,
      fecha: op.entrega.fechaEntrega || op.importacion.fechaNacionalizacion,
      expedienteNumero: op.numeroExpediente,
      clienteNombre: op.cliente.nombre,
      tipoOperacion: 'Facturación Definitiva y Costo',
      glosa: `Emisión de Factura Definitiva SENIAT N° ${op.entrega.facturaDefinitivaSeniat || 'F-DEF'}, entrega material del producto ${op.cliente.producto} al cliente ${op.cliente.nombre}, cierre del anticipo y reconocimiento del costo de venta según VEN-NIF.`,
      lineas,
      totalDebe: granTotalDebe,
      totalHaber: granTotalHaber,
      cuadrado: Math.abs(granTotalDebe - granTotalHaber) < 0.01,
    });
  }

  return asientos;
};

/**
 * Genera el libro diario contable completo para todos los expedientes
 */
export const generarLibroDiarioCompleto = (
  expedientes: ExpedienteOperacion[],
  empresa: DatosEmpresaImportadora
): AsientoContable[] => {
  const todos: AsientoContable[] = [];
  let contador = 1;

  expedientes.forEach((op) => {
    const asientosOp = generarAsientosParaExpediente(op, empresa, contador);
    todos.push(...asientosOp);
    contador += asientosOp.length;
  });

  return todos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
};
