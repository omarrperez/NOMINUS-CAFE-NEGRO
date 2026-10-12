export type EstadoExpediente = 'En proceso' | 'Cerrado' | 'Observado' | 'En aduana';

export interface ClientePersonaNatural {
  nombre: string;
  cedula: string; // V-12345678 o E-12345678
  rif: string; // V-12345678-0
  fechaNacimiento: string;
  lugarNacimiento: string;
  estadoCivil: 'Soltero(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viudo(a)';
  nacionalidad: string;
  direccionHabitacion: string;
  estadoPais: string;
  telefono: string;
  email: string;
  ocupacion: string;
  actividadEconomica: string;
  nombreNegocio?: string;
  rifNegocio?: string;
  direccionNegocio?: string;
  producto: string;
  origen: string;
  cantidad: string;
  esPEP: boolean; // Persona Expuesta Políticamente
  cargoPEP?: string;
  origenIngresosDeclarado: string;
  capacidadEconomicaDeclarada: string;
  contratoFirmado: boolean;
  kycFirmado: boolean;
  cedulaAnexa: boolean;
  rifAnexo: boolean;
}

export interface AnticipoBancario {
  montoBs: number;
  fecha: string;
  formaPago: 'Transferencia' | 'Punto de venta' | 'Depósito bancario';
  bancoOrigen: string;
  bancoDestino: string;
  referencia: string;
  facturaSeniat: string;
  titularCoincide: boolean; // Regla de oro: Pagador = Titular del contrato
  igtfAplicadoBs?: number;
  notaCaja?: string;
}

export interface CompraDivisasBCV {
  montoUsd: number;
  tasaBCV: number; // Bs / USD
  montoBsEquivalente: number;
  fechaCompra: string;
  bancoMesaCambio: string;
  numeroSolicitud: string;
  declaracionOrigenDestino: boolean; // Obligatorio BCV/SUDEBAN
  igtfDivisas3Porc: number; // 3% sobre operaciones en divisas
  cuentaCustodiaUsd: string;
  tasaCompraBid?: number;
  tasaVentaAsk?: number;
}

export interface PagoProveedorExtranjero {
  nombreProveedor: string;
  paisProveedor: string;
  rifOIdFiscal: string;
  facturaNumero: string;
  montoUsdFactura: number;
  fechaPago: string;
  referenciaSwift: string;
  bancoCorresponsal: string;
  beneficiarioCoincide: boolean; // Beneficiario = Emisor de factura
}

export interface ImportacionAduana {
  numeroBL: string; // Bill of Lading
  fechaEmbarque: string;
  navieraOAgente: string;
  numeroDuela: string; // DUA / Declaración de aduana
  fechaNacionalizacion: string;
  puertoEntrada: string;
  arancelPagadoBs: number;
  registroSunagroSica: string;
  permisoInsai: string;
}

export interface EntregaYCierre {
  facturaDefinitivaSeniat: string;
  fechaEntrega: string;
  saldoCobradoBs: number;
  saldoCobradoUsd: number;
  comisionMargenEmpresa: string;
  entregadoConforme: boolean;
  actaEntregaFirmada: boolean;
  reconciliacionCuadrada: boolean;
}

export interface ChecklistDocumentos {
  contratoCompraventa: boolean;
  cuestionarioKYC: boolean;
  copiaCedulaRif: boolean;
  facturaAnticipoSeniat: boolean;
  comprobantePagoCliente: boolean;
  solicitudDivisasBCV: boolean;
  declaracionOrigenDestinoLícito: boolean;
  facturaProveedor: boolean;
  comprobanteSwift: boolean;
  billOfLading: boolean;
  duelaAduana: boolean;
  licenciaSunagroInsai: boolean;
  facturaDefinitivaSeniat: boolean;
  comprobanteEntrega: boolean;
}

export interface ExpedienteOperacion {
  id: string;
  numeroExpediente: string; // ej: 2026-001
  fechaContrato: string;
  estado: EstadoExpediente;
  cliente: ClientePersonaNatural;
  anticipo: AnticipoBancario;
  divisas: CompraDivisasBCV;
  proveedor: PagoProveedorExtranjero;
  importacion: ImportacionAduana;
  entrega: EntregaYCierre;
  documentos: ChecklistDocumentos;
  observaciones: string;
  elaboradoPor: string;
  revisadoPor: string;
}

export interface DatosEmpresaImportadora {
  razonSocial: string;
  rif: string; // J-12345678-0
  registroMercantil: string;
  tomoNumero: string;
  folioNumero: string;
  fechaRegistro: string;
  circunscripcion: string;
  direccionFiscal: string;
  ciudadEstado: string;
  representanteLegal: string;
  cedulaRepresentante: string;
  cargoRepresentante: string;
  telefono: string;
  email: string;
  registroSunagro: string;
  bancoPrincipal: string;
  cuentaBancariaBs: string;
  cuentaCustodiaUsd: string;
  tasaBCVActual: number;
  objetoSocial?: string;
}

export interface LineaAsiento {
  codigoCuenta: string;
  nombreCuenta: string;
  debe: number;
  haber: number;
  referenciaDoc?: string;
}

export interface AsientoContable {
  id: string;
  numeroComprobante: string;
  fecha: string;
  expedienteNumero: string;
  clienteNombre: string;
  tipoOperacion: 'Anticipo Cliente' | 'Compra Divisas BCV' | 'Pago SWIFT Proveedor' | 'Aranceles y Aduana' | 'Facturación Definitiva y Costo';
  glosa: string;
  lineas: LineaAsiento[];
  totalDebe: number;
  totalHaber: number;
  cuadrado: boolean;
}
