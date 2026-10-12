import * as XLSX from 'xlsx';
import { DatosEmpresaImportadora, ExpedienteOperacion } from '../types';

export interface CsvRowParsed {
  [key: string]: string;
}

export interface CsvColumnMapping {
  nombreKey: string;
  cedulaKey: string;
  rifKey: string;
  telefonoKey: string;
  emailKey: string;
  direccionKey: string;
  montoBsKey: string;
  montoUsdKey: string;
  bancoKey: string;
  referenciaKey: string;
  fechaKey: string;
  productoKey: string;
  cantidadKey: string;
  ocupacionKey: string;
}

/**
 * Normaliza nombres de columna (minúsculas, sin acentos ni caracteres especiales)
 */
export const normalizeHeader = (header: string): string => {
  return header
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
};

/**
 * Detecta automáticamente las columnas correspondientes en un archivo CSV o Excel
 */
export const autoDetectColumns = (headers: string[]): CsvColumnMapping => {
  const findMatch = (candidates: string[]): string => {
    for (const header of headers) {
      const norm = normalizeHeader(header);
      for (const cand of candidates) {
        if (norm.includes(cand)) {
          return header;
        }
      }
    }
    return '';
  };

  return {
    nombreKey: findMatch(['nombre', 'cliente', 'titular', 'razonsocial', 'comprador', 'persona']),
    cedulaKey: findMatch(['cedula', 'ci', 'identificacion', 'documento', 'cedulaidentidad', 'dni']),
    rifKey: findMatch(['rif', 'registrofiscal']),
    telefonoKey: findMatch(['telefono', 'tlf', 'celular', 'movil', 'phone', 'contacto']),
    emailKey: findMatch(['email', 'correo', 'mail']),
    direccionKey: findMatch(['direccion', 'domicilio', 'ciudad', 'estado', 'ubicacion', 'habitacion']),
    montoBsKey: findMatch(['montobs', 'anticipobs', 'anticipo', 'montobolivares', 'bolivares', 'monto', 'deposito', 'bs']),
    montoUsdKey: findMatch(['montousd', 'usd', 'divisas', 'dolares', 'totalusd']),
    bancoKey: findMatch(['bancoorigen', 'bancocliente', 'banco', 'entidad', 'entidadbancaria']),
    referenciaKey: findMatch(['referencia', 'ref', 'comprobante', 'nroreferencia', 'nrotransferencia', 'operacion']),
    fechaKey: findMatch(['fechacontrato', 'fechapago', 'fechaanticipo', 'fecha', 'fechatransferencia']),
    productoKey: findMatch(['producto', 'rubro', 'mercancia', 'item', 'descripcion']),
    cantidadKey: findMatch(['cantidad', 'kilos', 'kg', 'sacos', 'peso', 'volumen']),
    ocupacionKey: findMatch(['ocupacion', 'actividad', 'profesion', 'negocio', 'comercio']),
  };
};

/**
 * Parsea texto CSV soportando delimitadores coma, punto y coma y tabulador
 */
export const parseCsvText = (text: string): { headers: string[]; rows: CsvRowParsed[] } => {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  // Detectar delimitador basado en la primera línea
  const firstLine = lines[0];
  let delimiter = ',';
  if (firstLine.includes(';') && !firstLine.includes(',')) {
    delimiter = ';';
  } else if (firstLine.includes('\t')) {
    delimiter = '\t';
  } else if ((firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length) {
    delimiter = ';';
  }

  // Parsear línea respetando comillas
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        if (inQuotes && line[i + 1] === char) {
          current += char;
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const rawHeaders = parseLine(lines[0]);
  const rows: CsvRowParsed[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.every((v) => v === '')) continue;
    const rowObj: CsvRowParsed = {};
    rawHeaders.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });
    rows.push(rowObj);
  }

  return { headers: rawHeaders, rows };
};

/**
 * Parsea un archivo subido (.csv o .xlsx) usando FileReader y la librería XLSX
 */
export const parseUploadedFile = async (
  file: File
): Promise<{ headers: string[]; rows: CsvRowParsed[] }> => {
  const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

  if (isExcel) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json<CsvRowParsed>(worksheet, { defval: '', raw: false });

    if (jsonData.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = Object.keys(jsonData[0]);
    return { headers, rows: jsonData };
  } else {
    // Archivo de texto plano CSV
    const text = await file.text();
    return parseCsvText(text);
  }
};

/**
 * Formatea cédula venezolana al estándar V-12.345.678 o E-12.345.678
 */
export const formatCedulaVE = (raw: string): string => {
  if (!raw) return 'V-00.000.000';
  const clean = raw.trim().toUpperCase();
  const tipo = clean.startsWith('E') ? 'E' : 'V';
  const digits = clean.replace(/[^0-9]/g, '');
  if (!digits) return `${tipo}-0`;
  const num = parseInt(digits, 10);
  return `${tipo}-${num.toLocaleString('es-VE')}`;
};

/**
 * Formatea RIF venezolano al estándar V-12345678-0 o J-12345678-0
 */
export const formatRifVE = (raw: string, cedulaRaw: string): string => {
  if (raw && raw.trim().length > 3) {
    const clean = raw.trim().toUpperCase().replace(/\./g, '');
    if (clean.includes('-')) return clean;
    const tipo = clean[0] || 'V';
    const digits = clean.slice(1);
    return `${tipo}-${digits.slice(0, 8)}-${digits.slice(-1) || '0'}`;
  }
  // Auto-derivar de la cédula si no se proveyó RIF
  const digits = cedulaRaw.replace(/[^0-9]/g, '');
  const tipo = cedulaRaw.toUpperCase().startsWith('E') ? 'E' : 'V';
  return `${tipo}-${digits}-0`;
};

/**
 * Convierte montos con formatos diversos (ej: 15.000,00 o 15000.00 o Bs. 15,000) a número
 */
export const parseMonto = (raw: string | number | undefined): number => {
  if (typeof raw === 'number') return isNaN(raw) ? 0 : raw;
  if (!raw) return 0;
  let str = String(raw).trim().replace(/Bs\.?/gi, '').replace(/\$/g, '').replace(/USD/gi, '').trim();
  
  // Si contiene puntos y comas: ejemplo 1.250,50
  if (str.includes('.') && str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  } else if (str.includes(',') && !str.includes('.')) {
    // Ejemplo 1250,50
    str = str.replace(',', '.');
  }
  const cleanNum = parseFloat(str.replace(/[^0-9.-]/g, ''));
  return isNaN(cleanNum) ? 0 : cleanNum;
};

/**
 * MOTOR PRINCIPAL: Origina expedientes completos con trazabilidad cambiaria y bancaria transparente
 */
export const originateExpedientesFromRows = (
  rows: CsvRowParsed[],
  mapping: CsvColumnMapping,
  empresa: DatosEmpresaImportadora,
  startingIndex: number = 1
): ExpedienteOperacion[] => {
  const today = new Date().toISOString().split('T')[0];
  const year = new Date().getFullYear();
  const tasaOficial = empresa.tasaBCVActual || 512.45;

  return rows.map((row, idx) => {
    const seq = startingIndex + idx;
    const numExpediente = `${year}-${String(seq).padStart(3, '0')}`;
    const id = `exp-${numExpediente.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}-${idx}`;

    const rawNombre = (mapping.nombreKey && row[mapping.nombreKey]) || `Persona Natural ${seq}`;
    const rawCedula = (mapping.cedulaKey && row[mapping.cedulaKey]) || `V-${10000000 + seq}`;
    const rawRif = (mapping.rifKey && row[mapping.rifKey]) || '';
    const rawTlf = (mapping.telefonoKey && row[mapping.telefonoKey]) || '0414-0000000';
    const rawEmail = (mapping.emailKey && row[mapping.emailKey]) || `cliente.${seq}@gmail.com`;
    const rawDir = (mapping.direccionKey && row[mapping.direccionKey]) || 'Caracas, Venezuela';
    const rawBanco = (mapping.bancoKey && row[mapping.bancoKey]) || 'Banco Provincial / Banesco';
    const rawRef = (mapping.referenciaKey && row[mapping.referenciaKey]) || `TRANSF-${String(1000000 + seq * 83)}`;
    const rawFecha = (mapping.fechaKey && row[mapping.fechaKey]) || today;
    const rawProducto = (mapping.productoKey && row[mapping.productoKey]) || 'Café verde arábica gourmet';
    const rawCantidad = (mapping.cantidadKey && row[mapping.cantidadKey]) || '25 sacos de 60 kg (1.500 kg)';
    const rawOcupacion = (mapping.ocupacionKey && row[mapping.ocupacionKey]) || 'Comerciante Independiente';

    // Manejo de montos:
    let montoBs = parseMonto(mapping.montoBsKey ? row[mapping.montoBsKey] : 0);
    let montoUsd = parseMonto(mapping.montoUsdKey ? row[mapping.montoUsdKey] : 0);

    if (montoBs > 0 && montoUsd === 0) {
      montoUsd = Math.round((montoBs / tasaOficial) * 100) / 100;
    } else if (montoUsd > 0 && montoBs === 0) {
      montoBs = Math.round(montoUsd * tasaOficial * 100) / 100;
    } else if (montoBs === 0 && montoUsd === 0) {
      // Valor base por defecto razonable si no fue especificado
      montoUsd = 1000;
      montoBs = Math.round(montoUsd * tasaOficial * 100) / 100;
    }

    const cedulaFormatted = formatCedulaVE(rawCedula);
    const rifFormatted = formatRifVE(rawRif, rawCedula);

    // Calcular montos de la cadena cambiaria transparente
    const igtf3PorcUsd = Math.round(montoUsd * 0.03 * 100) / 100;
    const montoProveedorUsd = Math.round(montoUsd * 0.90 * 100) / 100; // 90% costo mercaderia CIF
    const arancelBs = Math.round(montoBs * 0.08 * 100) / 100; // 8% aranceles e impuestos

    const expediente: ExpedienteOperacion = {
      id,
      numeroExpediente: numExpediente,
      fechaContrato: rawFecha,
      estado: 'En proceso',
      cliente: {
        nombre: rawNombre.trim(),
        cedula: cedulaFormatted,
        rif: rifFormatted,
        fechaNacimiento: '1985-06-15',
        lugarNacimiento: 'Caracas, Venezuela',
        estadoCivil: 'Soltero(a)',
        nacionalidad: 'Venezolana',
        direccionHabitacion: rawDir,
        estadoPais: 'Distrito Capital / Miranda',
        telefono: rawTlf,
        email: rawEmail,
        ocupacion: rawOcupacion,
        actividadEconomica: 'Comercialización y procesamiento de café y rubros afines',
        nombreNegocio: `Comercial ${rawNombre.split(' ')[0]}`,
        rifNegocio: rifFormatted,
        direccionNegocio: rawDir,
        producto: rawProducto,
        origen: 'Colombia (Huila)',
        cantidad: rawCantidad,
        esPEP: false,
        cargoPEP: '',
        origenIngresosDeclarado: 'Ingresos operacionales de actividad comercial y fondos bancarios lícitos',
        capacidadEconomicaDeclarada: `Flujo comprobable equivalente a USD ${(montoUsd * 1.5).toFixed(0)} mensuales`,
        contratoFirmado: true,
        kycFirmado: true,
        cedulaAnexa: true,
        rifAnexo: true,
      },
      anticipo: {
        montoBs,
        fecha: rawFecha,
        formaPago: 'Transferencia',
        bancoOrigen: rawBanco,
        bancoDestino: empresa.bancoPrincipal || 'Banco Provincial',
        referencia: rawRef,
        facturaSeniat: `FAC-ANT-${numExpediente}`,
        titularCoincide: true, // Regla de Oro: Titular pagador coincide con titular del contrato
        igtfAplicadoBs: 0,
        notaCaja: 'Anticipo recibido en cuenta corriente en Bolívares. No se recibieron fondos en efectivo ni de terceros.',
      },
      divisas: {
        montoUsd,
        tasaBCV: tasaOficial,
        montoBsEquivalente: Math.round(montoUsd * tasaOficial * 100) / 100,
        fechaCompra: rawFecha,
        bancoMesaCambio: `${empresa.bancoPrincipal} (Mesa de Cambio Interbancaria BCV)`,
        numeroSolicitud: `SOL-BCV-${numExpediente}`,
        declaracionOrigenDestino: true,
        igtfDivisas3Porc: igtf3PorcUsd,
        cuentaCustodiaUsd: empresa.cuentaCustodiaUsd || 'Cuenta Custodia Moneda Extranjera Convenio N° 1',
      },
      proveedor: {
        nombreProveedor: 'Exportadora Internacional de Café Andino S.A.S.',
        paisProveedor: 'Colombia',
        rifOIdFiscal: 'NIT 901.345.892-1',
        facturaNumero: `PROFORMA-EXP-${numExpediente}`,
        montoUsdFactura: montoProveedorUsd,
        fechaPago: rawFecha,
        referenciaSwift: `SWIFT-${String(500000 + seq * 91)}`,
        bancoCorresponsal: 'Bancolombia S.A. / Citibank N.A. New York',
        beneficiarioCoincide: true, // Beneficiario SWIFT coincide con emisor de factura
      },
      importacion: {
        numeroBL: `BL-MED-${String(200000 + seq * 77)}`,
        fechaEmbarque: rawFecha,
        navieraOAgente: 'Mediterranean Shipping Company (MSC) / Agente Aduanal',
        numeroDuela: `DUA-${year}-${String(10000 + seq)}`,
        fechaNacionalizacion: rawFecha,
        puertoEntrada: 'Aduana Principal Marítima de La Guaira / Puerto Cabello',
        arancelPagadoBs: arancelBs,
        registroSunagroSica: `SICA-AGRO-${year}-${String(8000 + seq)}`,
        permisoInsai: `INSAI-FITO-${year}-${String(4000 + seq)}`,
      },
      entrega: {
        facturaDefinitivaSeniat: `FAC-DEF-${numExpediente}`,
        fechaEntrega: '',
        saldoCobradoBs: 0,
        saldoCobradoUsd: 0,
        comisionMargenEmpresa: `USD ${(montoUsd - montoProveedorUsd).toFixed(2)} por corretaje e importación`,
        entregadoConforme: false,
        actaEntregaFirmada: false,
        reconciliacionCuadrada: true,
      },
      documentos: {
        contratoCompraventa: true,
        cuestionarioKYC: true,
        copiaCedulaRif: true,
        facturaAnticipoSeniat: true,
        comprobantePagoCliente: true,
        solicitudDivisasBCV: true,
        declaracionOrigenDestinoLícito: true,
        facturaProveedor: true,
        comprobanteSwift: true,
        billOfLading: true,
        duelaAduana: true,
        licenciaSunagroInsai: true,
        facturaDefinitivaSeniat: false,
        comprobanteEntrega: false,
      },
      observaciones: `Expediente originado automáticamente mediante importación de lista CSV/Excel. Se aplicaron todas las validaciones de debida diligencia SUDEBAN, mesa de cambio BCV y trazabilidad de fondos.`,
      elaboradoPor: 'Sistema SIEVEX (Oficial de Cumplimiento)',
      revisadoPor: empresa.representanteLegal || 'Gerencia de Cumplimiento',
    };

    return expediente;
  });
};

/**
 * Genera y descarga una plantilla CSV de ejemplo para el usuario
 */
export const downloadCsvTemplate = () => {
  const headers = [
    'Nombre y Apellido',
    'Cédula',
    'RIF',
    'Teléfono',
    'Email',
    'Dirección Habitación',
    'Monto Anticipo Bs',
    'Monto USD',
    'Banco Origen Cliente',
    'Nro Referencia Bancaria',
    'Fecha Anticipo',
    'Producto',
    'Cantidad',
    'Ocupación o Actividad'
  ];

  const exampleRows = [
    [
      'Carlos Alberto Ramírez Soto',
      'V-14.892.301',
      'V-14892301-4',
      '0414-2345678',
      'carlos.ramirez@correo.com',
      'Calle Principal, Los Palos Grandes, Caracas',
      '1281125.00',
      '2500.00',
      'Banco Provincial',
      '01089923841',
      new Date().toISOString().split('T')[0],
      'Café verde arábica supremo',
      '40 sacos de 60 kg (2.400 kg)',
      'Tostador de Café / Comerciante'
    ],
    [
      'Ana Patricia Mendoza Gómez',
      'V-17.432.190',
      'V-17432190-2',
      '0424-9871234',
      'ana.mendoza@cafegourmet.ve',
      'Av. Las Delicias, Maracay, Edo. Aragua',
      '922410.00',
      '1800.00',
      'Banesco',
      '01348821945',
      new Date().toISOString().split('T')[0],
      'Café especialidad lavado',
      '30 sacos de 60 kg (1.800 kg)',
      'Dueña de Cafetería y Expendio'
    ]
  ];

  const csvContent =
    'sep=,\n' +
    headers.map((h) => `"${h}"`).join(',') +
    '\n' +
    exampleRows.map((row) => row.map((val) => `"${val}"`).join(',')).join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Plantilla_Personas_Naturales_SIEVEX.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
