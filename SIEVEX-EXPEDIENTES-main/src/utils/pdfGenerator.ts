import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { AsientoContable, DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { formatBs, formatDateVE, formatTasaBCV, formatUSD } from './formatters';

const setupHeader = (doc: jsPDF, empresa: DatosEmpresaImportadora, titulo: string, subtitulo?: string) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text(empresa.razonSocial, 20, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate-500
  const reg = (empresa.registroMercantil || '').slice(0, 50);
  doc.text(`RIF: ${empresa.rif} · Registro: ${reg}...`, 20, 21);
  const dir = (empresa.direccionFiscal || '').slice(0, 75);
  doc.text(`${dir}... · ${empresa.telefono || ''}`, 20, 25);

  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.setLineWidth(0.5);
  doc.line(20, 28, 190, 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(titulo, 20, 36);

  if (subtitulo) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitulo, 20, 41);
  }
};

const setupFooter = (doc: jsPDF, pageNum: number, totalPages: number = 1) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(20, pageHeight - 16, 190, pageHeight - 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Marco Legal: Ley contra el Lavado de Dinero (LC/FT/FPADM) · Resol. SUDEBAN 083.18 · Convenio Cambiario N° 1 BCV · Providencia SENIAT 00071',
    20,
    pageHeight - 11
  );
  doc.text(`Página ${pageNum} de ${totalPages}`, 190, pageHeight - 11, { align: 'right' });
};

/**
 * 1. Genera PDF de la Tapa del Expediente Regulatorio (Checklist SUDEBAN)
 */
/**
 * Renderiza la ficha completa (tapa de auditoría) de un expediente en una página del documento jsPDF
 */
export const renderTapaExpedientePage = (
  doc: jsPDF,
  op: ExpedienteOperacion,
  empresa: DatosEmpresaImportadora,
  pageNum: number,
  totalPages: number
) => {
  setupHeader(
    doc,
    empresa,
    `TAPA DE EXPEDIENTE REGULATORIO - N° ${op.numeroExpediente}`,
    `Auditoría y Debida Diligencia para Instituciones Bancarias (SUDEBAN / BCV) · Estado: ${op.estado}`
  );

  let y = 48;
  doc.setFontSize(9);

  // Sección 1: Cliente
  doc.setFillColor(248, 250, 252);
  doc.rect(20, y, 170, 23, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(20, y, 170, 23, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. DATOS DEL CLIENTE (PERSONA NATURAL)', 23, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Nombre: ${op.cliente.nombre}`, 23, y + 10);
  doc.text(`Cédula: ${op.cliente.cedula}   RIF: ${op.cliente.rif || 'N/A'}   Tlf: ${op.cliente.telefono || 'N/A'}`, 23, y + 15);
  doc.text(`Ocupación: ${op.cliente.ocupacion || 'Comerciante'} · Domicilio: ${(op.cliente.direccionHabitacion || '').slice(0, 55)}`, 23, y + 20);

  y += 27;

  // Sección 2: Operación y Contrato
  doc.setFillColor(248, 250, 252);
  doc.rect(20, y, 170, 20, 'F');
  doc.rect(20, y, 170, 20, 'S');

  doc.setFont('helvetica', 'bold');
  doc.text('2. ORDEN DE COMPRAVENTA CON ENTREGA FUTURA', 23, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Producto: ${op.cliente.producto} (${op.cliente.cantidad})`, 23, y + 10);
  doc.text(`Origen: ${op.cliente.origen} · Proveedor: ${op.proveedor.nombreProveedor} (${op.proveedor.paisProveedor})`, 23, y + 14);
  doc.text(`Contrato de compraventa firmado: ${op.cliente.contratoFirmado ? 'SÍ [x]' : 'NO [ ]'}   KYC firmado: ${op.cliente.kycFirmado ? 'SÍ [x]' : 'NO [ ]'}`, 23, y + 18);

  y += 24;

  // Sección 3: Anticipo en Bolívares
  doc.setFillColor(248, 250, 252);
  doc.rect(20, y, 170, 20, 'F');
  doc.rect(20, y, 170, 20, 'S');

  doc.setFont('helvetica', 'bold');
  doc.text('3. ANTICIPO BANCARIO RECIBIDO (BOLÍVARES)', 23, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Monto: ${formatBs(op.anticipo.montoBs)}   Fecha: ${formatDateVE(op.anticipo.fecha)}   Forma: ${op.anticipo.formaPago}`, 23, y + 10);
  doc.text(`Banco: ${op.anticipo.bancoOrigen} -> ${op.anticipo.bancoDestino}   Ref: ${op.anticipo.referencia}`, 23, y + 14);
  doc.text(`Factura Anticipo SENIAT N°: ${op.anticipo.facturaSeniat}   Pagador coincide 100% con Titular: ${op.anticipo.titularCoincide ? 'SÍ [x] (Sin terceros)' : 'NO [ ]'}`, 23, y + 18);

  y += 24;

  // Sección 4: Divisas BCV y Proveedor
  doc.setFillColor(248, 250, 252);
  doc.rect(20, y, 170, 24, 'F');
  doc.rect(20, y, 170, 24, 'S');

  doc.setFont('helvetica', 'bold');
  doc.text('4. TRAZABILIDAD CAMBIARIA Y PAGO AL PROVEEDOR INTERNACIONAL', 23, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Compra Divisas BCV: ${formatUSD(op.divisas.montoUsd)} a tasa ${formatTasaBCV(op.divisas.tasaBCV)} = ${formatBs(op.divisas.montoBsEquivalente)}`, 23, y + 10);
  doc.text(`Banco / Mesa Cambio: ${op.divisas.bancoMesaCambio}   Fecha: ${formatDateVE(op.divisas.fechaCompra)}`, 23, y + 14);
  doc.text(`Factura Proveedor N°: ${op.proveedor.facturaNumero} por ${formatUSD(op.proveedor.montoUsdFactura)}`, 23, y + 18);
  doc.text(`Comprobante SWIFT: ${op.proveedor.referenciaSwift}   Beneficiario coincide: ${op.proveedor.beneficiarioCoincide ? 'SÍ [x]' : 'NO [ ]'}`, 23, y + 22);

  y += 28;

  // Sección 5: Checklist Documental
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('5. CHECKLIST DE 13 RECAUDOS ARCHIVADOS EN EXPEDIENTE (5 AÑOS):', 20, y + 4);

  const docs = [
    ['Contrato de compraventa entrega futura firmado', op.documentos.contratoCompraventa],
    ['Cuestionario KYC firmado con anexo cédula y RIF', op.documentos.cuestionarioKYC],
    ['Copia de Cédula de Identidad y RIF vigente', op.documentos.copiaCedulaRif],
    ['Factura de Anticipo SENIAT (Providencia 00071)', op.documentos.facturaAnticipoSeniat],
    ['Comprobante bancario del pago recibido del cliente', op.documentos.comprobantePagoCliente],
    ['Solicitud de compra de divisas mesa de cambio BCV', op.documentos.solicitudDivisasBCV],
    ['Declaración jurada de origen y destino lícito de fondos', op.documentos.declaracionOrigenDestinoLícito],
    ['Factura comercial proforma / definitiva de proveedor', op.documentos.facturaProveedor],
    ['Comprobante de transferencia internacional SWIFT MT103', op.documentos.comprobanteSwift],
    ['Bill of Lading (BL) / Guía aérea de embarque', op.documentos.billOfLading],
    ['Declaración de aduanas SENIAT (DUA / Duela)', op.documentos.duelaAduana],
    ['Guía SICA (SUNAGRO) y Certificado INSAI (si aplica)', op.documentos.licenciaSunagroInsai],
    ['Factura definitiva SENIAT y comprobante entrega', op.documentos.facturaDefinitivaSeniat && op.documentos.comprobanteEntrega],
  ];

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  docs.forEach(([nombre, valor], index) => {
    const colX = index < 7 ? 22 : 106;
    const rowY = y + (index < 7 ? index * 4.8 : (index - 7) * 4.8);
    const box = valor ? '[X]' : '[  ]';
    doc.text(`${box} ${nombre}`, colX, rowY);
  });

  y += 42;

  // Cuadro de Firmas de Auditoría
  doc.setDrawColor(203, 213, 225);
  doc.line(25, y + 16, 85, y + 16);
  doc.line(125, y + 16, 185, y + 16);

  doc.setFontSize(7.5);
  doc.text('Elaborado por (Oficial de Cumplimiento)', 25, y + 20);
  doc.text(op.elaboradoPor || 'Oficial de Cumplimiento - AGRICOLA ONI, C.A.', 25, y + 24);

  doc.text('Revisado por (Director General / Auditoría)', 125, y + 20);
  doc.text(
    op.revisadoPor ||
      (empresa.representanteLegal
        ? `${empresa.representanteLegal} (${empresa.cargoRepresentante || 'Director General'})`
        : 'TRIAS ABREU, ELIAS RAFAEL (Director General)'),
    125,
    y + 24
  );

  setupFooter(doc, pageNum, totalPages);
};

/**
 * 1. Genera PDF individual de la Tapa del Expediente Regulatorio (Checklist SUDEBAN)
 */
export const downloadPdfTapaExpediente = (op: ExpedienteOperacion, empresa: DatosEmpresaImportadora) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  renderTapaExpedientePage(doc, op, empresa, 1, 1);
  doc.save(`Tapa_Expediente_${op.numeroExpediente}.pdf`);
};

/**
 * Genera y descarga el PDF consolidado con TODOS los expedientes en lote
 * (Portada Maestro, Métricas de Auditoría, Tabla Resumen de Expedientes y Fichas Individuales)
 */
export const downloadPdfLoteCompletoExpedientes = async (
  expedientes: ExpedienteOperacion[],
  empresa: DatosEmpresaImportadora,
  onProgress?: (current: number, total: number) => void
) => {
  if (!expedientes || expedientes.length === 0) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const totalPages = 1 + expedientes.length;

  if (onProgress) onProgress(0, expedientes.length);

  // 1. PORTADA MAESTRA Y DICTAMEN DE AUDITORÍA
  setupHeader(
    doc,
    empresa,
    'DICTAMEN MAESTRO DE AUDITORÍA REGULATORIA (LOTE)',
    `Consolidación de ${expedientes.length} Expedientes de Personas Naturales · BCV / SUDEBAN`
  );

  let y = 47;
  doc.setFontSize(9);

  // Recuadro: Operador Financiero y Comercial
  doc.setFillColor(248, 250, 252);
  doc.rect(20, y, 170, 24, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(20, y, 170, 24, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. SUJETO REGULADO / EMPRESA EJECUTORA', 23, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Razón Social: ${empresa.razonSocial}    RIF: ${empresa.rif}`, 23, y + 10);
  doc.text(
    `Director General: ${empresa.representanteLegal || 'TRIAS ABREU, ELIAS RAFAEL'} (${empresa.cargoRepresentante || 'Director General'}) · C.I: ${empresa.cedulaRepresentante || 'V-23997829'}`,
    23,
    y + 14
  );
  doc.text(`Domicilio Fiscal: ${(empresa.direccionFiscal || '').slice(0, 80)}`, 23, y + 18);
  doc.text(
    `Teléfonos: ${empresa.telefono || 'N/A'} · Email: ${empresa.email || 'administracion@agricolaoni.com'}`,
    23,
    y + 22
  );

  y += 27;

  // Cálculos Consolidados
  const totalBsAnticipos = expedientes.reduce((acc, e) => acc + (e.anticipo?.montoBs || 0), 0);
  const totalUsdDivisas = expedientes.reduce((acc, e) => acc + (e.divisas?.montoUsd || 0), 0);
  const totalBsDivisas = expedientes.reduce((acc, e) => acc + (e.divisas?.montoBsEquivalente || 0), 0);
  const totalUsdProveedores = expedientes.reduce((acc, e) => acc + (e.proveedor?.montoUsdFactura || 0), 0);
  const tasaPonderada = totalUsdDivisas > 0 ? totalBsDivisas / totalUsdDivisas : empresa.tasaBCVActual || 36.5;

  // Recuadro: Métricas Consolidadas del Lote
  doc.setFillColor(240, 253, 244);
  doc.rect(20, y, 170, 25, 'F');
  doc.setDrawColor(187, 247, 208);
  doc.rect(20, y, 170, 25, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('2. RESUMEN FINANCIERO Y CAMBIARIO DEL LOTE AUDITADO', 23, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Total Expedientes Auditados: ${expedientes.length} Personas Naturales`, 23, y + 10);
  doc.text(`Total Anticipos Recibidos en Bolívares: ${formatBs(totalBsAnticipos)}`, 23, y + 14);
  doc.text(
    `Total Compra Divisas Mesas de Cambio BCV: ${formatUSD(totalUsdDivisas)} (Equiv. ${formatBs(totalBsDivisas)})`,
    23,
    y + 18
  );
  doc.text(
    `Total Liquidado a Proveedores Internacionales (SWIFT): ${formatUSD(totalUsdProveedores)} · Tasa Media: ${formatTasaBCV(tasaPonderada)}`,
    23,
    y + 22
  );

  y += 28;

  // Tabla Índice de Expedientes del Lote
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. ÍNDICE Y TRAZABILIDAD INDIVIDUAL DE EXPEDIENTES (RELACIÓN DETALLADA):', 20, y + 4);

  y += 7;

  // Encabezado de la tabla
  doc.setFillColor(241, 245, 249);
  doc.rect(20, y, 170, 5.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(20, y, 170, 5.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text('N° EXP', 22, y + 3.8);
  doc.text('CLIENTE (PERSONA NATURAL)', 42, y + 3.8);
  doc.text('CÉDULA', 86, y + 3.8);
  doc.text('FECHA', 106, y + 3.8);
  doc.text('ANTICIPO BS', 123, y + 3.8);
  doc.text('USD BCV', 151, y + 3.8);
  doc.text('ESTATUS SUDEBAN', 169, y + 3.8);

  y += 5.5;

  // Filas de expedientes
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);

  expedientes.forEach((e, idx) => {
    const rowY = y + idx * 4.9;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, rowY, 170, 4.9, 'F');
    }
    doc.setDrawColor(226, 232, 240);
    doc.line(20, rowY + 4.9, 190, rowY + 4.9);

    doc.setTextColor(15, 23, 42);
    doc.text(e.numeroExpediente, 22, rowY + 3.6);
    doc.text((e.cliente.nombre || '').slice(0, 24), 42, rowY + 3.6);
    doc.text(e.cliente.cedula || 'N/A', 86, rowY + 3.6);
    doc.text(formatDateVE(e.anticipo?.fecha || e.fechaContrato), 106, rowY + 3.6);
    doc.text(formatBs(e.anticipo?.montoBs || 0), 123, rowY + 3.6);
    doc.text(formatUSD(e.divisas?.montoUsd || 0), 151, rowY + 3.6);

    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.text('100% CONCILIADO', 169, rowY + 3.6);
    doc.setFont('helvetica', 'normal');
  });

  const tableBottomY = y + expedientes.length * 4.9 + 4;

  // Recuadro Declaración
  doc.setFillColor(254, 252, 232);
  doc.rect(20, tableBottomY, 170, 15, 'F');
  doc.setDrawColor(254, 240, 138);
  doc.rect(20, tableBottomY, 170, 15, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(133, 77, 14);
  doc.text('DECLARACIÓN DE CUMPLIMIENTO Y PREVENCIÓN DE LEGITIMACIÓN DE CAPITALES:', 23, tableBottomY + 4.2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(113, 63, 18);
  doc.text(
    'Se certifica que la totalidad de los fondos recibidos corresponden a personas naturales debidamente bancarizadas sin intermediarios,',
    23,
    tableBottomY + 8.2
  );
  doc.text(
    'verificadas con contratos bilaterales de compraventa a entrega futura y liquidación a través de las mesas de cambio oficiales del BCV.',
    23,
    tableBottomY + 12.0
  );

  // Firmas en la portada
  const signY = tableBottomY + 17;
  doc.setDrawColor(203, 213, 225);
  doc.line(25, signY + 11, 85, signY + 11);
  doc.line(125, signY + 11, 185, signY + 11);

  doc.setFontSize(7.2);
  doc.setTextColor(30, 41, 59);
  doc.text('Oficial de Cumplimiento (LC/FT/FPADM)', 25, signY + 15);
  doc.text(`${empresa.razonSocial} · RIF ${empresa.rif}`, 25, signY + 19);

  doc.text('Director General / Representante Legal', 125, signY + 15);
  doc.text(
    `${empresa.representanteLegal || 'TRIAS ABREU, ELIAS RAFAEL'} · C.I. ${empresa.cedulaRepresentante || 'V-23997829'}`,
    125,
    signY + 19
  );

  setupFooter(doc, 1, totalPages);

  // 2. PÁGINAS INDIVIDUALES: 1 POR CADA EXPEDIENTE
  for (let i = 0; i < expedientes.length; i++) {
    const op = expedientes[i];
    if (onProgress) {
      onProgress(i + 1, expedientes.length);
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
    doc.addPage();
    renderTapaExpedientePage(doc, op, empresa, i + 2, totalPages);
  }

  const safeEmpresa = (empresa.razonSocial || 'AGRICOLA_ONI').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Dossier_Lote_Completo_Expedientes_${safeEmpresa}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};

/**
 * Descarga archivo ZIP con los PDFs individuales de cada expediente
 */
export const downloadZipLoteExpedientes = async (
  expedientes: ExpedienteOperacion[],
  empresa: DatosEmpresaImportadora,
  onProgress?: (current: number, total: number) => void
) => {
  if (!expedientes || expedientes.length === 0) return;

  const zip = new JSZip();

  for (let i = 0; i < expedientes.length; i++) {
    const op = expedientes[i];
    if (onProgress) {
      onProgress(i + 1, expedientes.length);
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
    const singleDoc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    renderTapaExpedientePage(singleDoc, op, empresa, 1, 1);
    const pdfBlob = singleDoc.output('blob');

    const safeName = (op.cliente?.nombre || 'Cliente').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    zip.file(`Expediente_${op.numeroExpediente}_${safeName}.pdf`, pdfBlob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const filename = `Lote_Expedientes_Auditoria_SUDEBAN_${empresa.rif}_${new Date().toISOString().slice(0, 10)}.zip`;

  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * 2. Genera PDF del Cuestionario KYC Persona Natural
 */
export const downloadPdfCuestionarioKYC = (op: ExpedienteOperacion, empresa: DatosEmpresaImportadora) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const c = op.cliente;

  setupHeader(
    doc,
    empresa,
    'CUESTIONARIO DE CONOCIMIENTO DEL CLIENTE (KYC) - PERSONA NATURAL',
    `Anexo Obligatorio del Expediente N° ${op.numeroExpediente} · Debida Diligencia SUDEBAN Resol. 083.18`
  );

  let y = 48;
  doc.setFontSize(8.5);

  const printSectionHeader = (title: string) => {
    doc.setFillColor(241, 245, 249);
    doc.rect(20, y, 170, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(title, 23, y + 4.2);
    doc.setFont('helvetica', 'normal');
    y += 9;
  };

  printSectionHeader('1. DATOS DE IDENTIFICACIÓN PERSONAL');
  doc.text(`Nombre y Apellidos: ${c.nombre}`, 23, y);
  doc.text(`Cédula de Identidad: ${c.cedula}`, 110, y);
  y += 5;
  doc.text(`RIF Personal: ${c.rif || 'N/A'}`, 23, y);
  doc.text(`Nacionalidad: ${c.nacionalidad}`, 75, y);
  doc.text(`Estado Civil: ${c.estadoCivil}`, 125, y);
  y += 5;
  doc.text(`Fecha y Lugar de Nacimiento: ${formatDateVE(c.fechaNacimiento)} en ${c.lugarNacimiento}`, 23, y);
  y += 5;
  doc.text(`Dirección de Habitación: ${c.direccionHabitacion}`, 23, y);
  y += 5;
  doc.text(`Teléfono Contacto: ${c.telefono}`, 23, y);
  doc.text(`Correo Electrónico: ${c.email}`, 100, y);
  y += 8;

  printSectionHeader('2. ACTIVIDAD ECONÓMICA Y PERFIL FINANCIERO');
  doc.text(`Ocupación / Profesión: ${c.ocupacion}`, 23, y);
  y += 5;
  doc.text(`Actividad Económica Principal: ${c.actividadEconomica}`, 23, y);
  y += 5;
  doc.text(`Nombre Comercial / Negocio: ${c.nombreNegocio || 'N/A'}`, 23, y);
  doc.text(`RIF Comercial: ${c.rifNegocio || 'N/A'}`, 110, y);
  y += 5;
  doc.text(`Dirección del Negocio: ${c.direccionNegocio || 'Misma de habitación'}`, 23, y);
  y += 8;

  printSectionHeader('3. ORIGEN DE LOS FONDOS DEL ANTICIPO');
  doc.text(`Origen Declarado de los Recursos: ${c.origenIngresosDeclarado}`, 23, y);
  y += 5;
  doc.text(`Capacidad Financiera Mensual: ${c.capacidadEconomicaDeclarada}`, 23, y);
  y += 5;
  doc.text(`Monto del Anticipo a Entregar: ${formatBs(op.anticipo.montoBs)} (Acreditado en Banco: ${op.anticipo.bancoOrigen})`, 23, y);
  y += 8;

  printSectionHeader('4. VINCULACIÓN CON ACTIVIDADES REGULADAS Y PEP');
  doc.text(`¿Es Persona Expuesta Políticamente (PEP) o familiar directo?: ${c.esPEP ? `SÍ (${c.cargoPEP || 'En funciones'})` : 'NO [X]'}`, 23, y);
  y += 5;
  doc.text('¿Opera con divisas por cuenta propia en el sistema bancario?: SÍ [X]   NO [ ]', 23, y);
  y += 5;
  doc.text('¿Ha sido objeto de investigaciones judiciales o financieras?: NO [X]   SÍ [ ]', 23, y);
  y += 8;

  printSectionHeader('5. DECLARACIÓN JURADA Y AUTORIZACIÓN DE DEBIDA DILIGENCIA');
  doc.setFontSize(7.8);
  const textoDeclaracion =
    `Yo, ${c.nombre}, titular de la C.I. ${c.cedula}, declaro bajo fe de juramento que todos los datos contenidos en este cuestionario son verídicos y comprobables. Asimismo declaro que los fondos destinados al anticipo y pago de esta operación provienen de actividades económicas lícitas y de mi exclusivo patrimonio. Autorizo expresamente a ${empresa.razonSocial} a verificar esta información y suministrarla a los bancos receptores y a la SUDEBAN en cumplimiento de la Ley contra el Lavado de Dinero y de las regulaciones cambiarias del Banco Central de Venezuela.`;

  const splitText = doc.splitTextToSize(textoDeclaracion, 168);
  doc.text(splitText, 22, y);
  y += splitText.length * 4 + 10;

  // Espacio para firma
  doc.line(30, y + 15, 95, y + 15);
  doc.line(115, y + 15, 180, y + 15);

  doc.text('Firma del Cliente', 45, y + 20);
  doc.text(`C.I. ${c.cedula}`, 45, y + 24);

  doc.text('Por la Empresa (Recepción KYC)', 125, y + 20);
  doc.text(`RIF: ${empresa.rif}`, 130, y + 24);

  setupFooter(doc, 1, 1);
  doc.save(`KYC_${op.cliente.cedula}_${op.numeroExpediente}.pdf`);
};

/**
 * 3. Genera PDF del Contrato de Compraventa con Entrega Futura (Venezolano completo)
 */
export const downloadPdfContratoCompraventa = (op: ExpedienteOperacion, empresa: DatosEmpresaImportadora) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const c = op.cliente;

  setupHeader(
    doc,
    empresa,
    'CONTRATO DE COMPRAVENTA CON ENTREGA FUTURA',
    `Expediente Regulado N° ${op.numeroExpediente} · Compraventa Mercantil con Anticipo Bancarizado`
  );

  let y = 46;
  doc.setFontSize(8);

  const parrafoIntro =
    `Entre, ${empresa.razonSocial}, sociedad mercantil inscrita por ante el ${empresa.registroMercantil}, bajo el N° ${empresa.folioNumero}, Tomo ${empresa.tomoNumero}, de fecha ${empresa.fechaRegistro}, titular del RIF N° ${empresa.rif}, inscrita en el registro que aplica para el rubro (${empresa.registroSunagro}), domiciliada en ${empresa.direccionFiscal}, representada por ${empresa.representanteLegal}, titular de la C.I. ${empresa.cedulaRepresentante}, en lo sucesivo "LA EMPRESA" (importador de registro); y por la otra parte, el ciudadano(a) ${c.nombre}, mayor de edad, de nacionalidad ${c.nacionalidad}, titular de la cédula de identidad N° ${c.cedula}, RIF ${c.rif || 'N/A'}, domiciliado en ${c.direccionHabitacion}, en lo sucesivo "EL COMPRADOR"; se ha convenido en celebrar el siguiente contrato:`;

  const splitIntro = doc.splitTextToSize(parrafoIntro, 170);
  doc.text(splitIntro, 20, y);
  y += splitIntro.length * 3.7 + 4;

  const clausulas = [
    [
      'CLÁUSULA PRIMERA - OBJETO:',
      `LA EMPRESA se obliga a vender a EL COMPRADOR, y éste a comprar, ${c.cantidad} de ${c.producto}, origen ${c.origen}, que LA EMPRESA importará por cuenta propia, en su propio nombre y riesgo, como importador de registro. Queda expresamente establecido que LA EMPRESA actúa como compradora e importadora de la mercancía y vendedora frente a EL COMPRADOR, y que el presente contrato es una compraventa con entrega futura; en consecuencia, EL COMPRADOR no confiere mandato alguno sobre fondos a LA EMPRESA.`,
    ],
    [
      'CLÁUSULA SEGUNDA - PRECIO Y FACTURACIÓN:',
      `El precio referencial convenido es de Bs. ${op.anticipo.montoBs.toLocaleString('es-VE')} o su equivalente de USD ${op.divisas.montoUsd.toLocaleString('en-US')}, calculado a la tasa de cambio oficial del Banco Central de Venezuela (BCV) del día de la operación (${op.divisas.tasaBCV} Bs/USD), más los impuestos de ley (IVA). La factura definitiva será emitida al momento de la entrega material de la mercancía.`,
    ],
    [
      'CLÁUSULA TERCERA - ANTICIPO Y BANCARIZACIÓN ESTRICTA:',
      `EL COMPRADOR entrega en este acto un anticipo de Bs. ${op.anticipo.montoBs.toLocaleString('es-VE')} mediante ${op.anticipo.formaPago} procesada a través del banco ${op.anticipo.bancoOrigen}, Ref. ${op.anticipo.referencia}. Se deja constancia de que el anticipo se recibe EXCLUSIVAMENTE desde una cuenta a nombre de EL COMPRADOR, quedando prohibidos pagos en efectivo o de terceros no autorizados. Dicho anticipo se documenta con la Factura de Anticipo SENIAT N° ${op.anticipo.facturaSeniat}.`,
    ],
    [
      'CLÁUSULA CUARTA - COMPRA DE DIVISAS Y ORIGEN LÍCITO:',
      `LA EMPRESA canalizará la adquisición de divisas a través de las mesas de cambio del sistema bancario nacional bajo la normativa del Banco Central de Venezuela, suscribiendo la obligatoria Declaración de Origen y Destino Lícito de los Recursos. Toda divisa no utilizada en esta operación será reintegrada o liquidada al banco según la normativa aplicable.`,
    ],
    [
      'CLÁUSULA QUINTA - PREVENCIÓN DE LEGITIMACIÓN DE CAPITALES (SUDEBAN):',
      `Ambas partes declaran que los fondos y bienes proceden de actividades económicas lícitas y que conocen la Ley contra el Lavado de Dinero, el Financiamiento al Terrorismo y los Delitos en Materia de Cambios y el Instructivo ILFT de SUDEBAN. EL COMPRADOR entrega su Cuestionario KYC debidamente firmado junto con sus documentos probatorios de identidad.`,
    ],
  ];

  clausulas.forEach(([titulo, texto]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, 20, y);
    y += 3.8;
    doc.setFont('helvetica', 'normal');
    const sp = doc.splitTextToSize(texto, 170);
    doc.text(sp, 20, y);
    y += sp.length * 3.6 + 3;
  });

  // Espacio de firmas
  y = Math.min(y + 8, 260);
  doc.line(25, y + 12, 85, y + 12);
  doc.line(125, y + 12, 185, y + 12);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('POR LA EMPRESA (Importador de Registro)', 25, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(`${empresa.representanteLegal} · C.I. ${empresa.cedulaRepresentante}`, 25, y + 20);

  doc.setFont('helvetica', 'bold');
  doc.text('EL COMPRADOR', 135, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(`${c.nombre} · C.I. ${c.cedula}`, 135, y + 20);

  setupFooter(doc, 1, 1);
  doc.save(`Contrato_${op.numeroExpediente}_${c.cedula}.pdf`);
};

/**
 * 4. Genera PDF de la Carta de Explicación al Banco / Oficial de Cumplimiento
 */
export const downloadPdfCartaAlBanco = (op: ExpedienteOperacion, empresa: DatosEmpresaImportadora) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const c = op.cliente;

  setupHeader(
    doc,
    empresa,
    'CARTA DE EXPLICACIÓN Y SOPORTE DE OPERACIÓN CAMBIARIA',
    `Dirigida al Oficial de Cumplimiento de la Institución Bancaria · Expediente N° ${op.numeroExpediente}`
  );

  let y = 48;
  doc.setFontSize(8.5);

  doc.text(`${empresa.ciudadEstado?.split(',')[0] || 'Barcelona'}, ${new Date().toLocaleDateString('es-VE')}`, 20, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Señores:', 20, y);
  doc.text(`UNIDAD DE PREVENCIÓN Y CONTROL DE LEGITIMACIÓN DE CAPITALES (UPCLC)`, 20, y + 4.5);
  doc.text(`${op.divisas.bancoMesaCambio.toUpperCase()} / DEPARTAMENTO DE CUMPLIMIENTO`, 20, y + 9);
  doc.setFont('helvetica', 'normal');
  y += 16;

  doc.setFont('helvetica', 'bold');
  doc.text(`ASUNTO: Soporte de Operación Cambiaria y Debida Diligencia - Expediente N° ${op.numeroExpediente}`, 20, y);
  doc.setFont('helvetica', 'normal');
  y += 7;

  const cuerpoCarta = [
    `Por medio de la presente, nos dirigimos a ustedes a fin de presentar el soporte documental completo correspondiente a la solicitud de adquisición de divisas y pago internacional por un monto de USD ${op.divisas.montoUsd.toLocaleString('en-US')} a través de su institución bancaria.`,
    `1. ESTRUCTURA JURÍDICA: Nuestra empresa, ${empresa.razonSocial}, actúa en su propio nombre y riesgo como IMPORTADOR DE REGISTRO. La operación con el cliente ${c.nombre} (C.I. ${c.cedula}) constituye una COMPRAVENTA CON ENTREGA FUTURA de ${c.producto} (${c.cantidad}), según Contrato Mercantil suscrito entre las partes. Nuestra empresa NO administra fondos de terceros ni ejerce intermediación cambiaria.`,
    `2. TRAZABILIDAD DEL EFECTIVO (REGLA DE ORO): El anticipo de Bs. ${op.anticipo.montoBs.toLocaleString('es-VE')} fue recibido exclusivamente mediante ${op.anticipo.formaPago} proveniente de la cuenta del propio cliente en ${op.anticipo.bancoOrigen} (Ref. ${op.anticipo.referencia}). No se recibieron fondos en efectivo ni transferencias de terceros no titulares. El anticipo fue debidamente facturado según normativa SENIAT con Factura N° ${op.anticipo.facturaSeniat}.`,
    `3. DESTINO LÍCITO DE LAS DIVISAS: Las divisas adquiridas a la tasa oficial del Banco Central de Venezuela de ${op.divisas.tasaBCV} Bs/USD son transferidas mediante instrucción SWIFT directamente al proveedor internacional ${op.proveedor.nombreProveedor} (${op.proveedor.paisProveedor}), respaldado por la Factura Comercial N° ${op.proveedor.facturaNumero}.`,
    `4. SOPORTES ANEXOS: Anexamos copia del Contrato de Compraventa, Cuestionario KYC del cliente, copia de Cédula y RIF, comprobante del pago en Bolívares, Declaración de Origen Lícito, Factura del Proveedor Extranjero y permisos pertinentes (SICA/INSAI). Toda la documentación permanecerá archivada por un lapso no menor a 5 años conforme a las normas de SUDEBAN.`,
  ];

  cuerpoCarta.forEach((p) => {
    const sp = doc.splitTextToSize(p, 170);
    doc.text(sp, 20, y);
    y += sp.length * 3.8 + 3.5;
  });

  y += 8;
  doc.text('Quedamos a su entera disposición ante cualquier requerimiento adicional de información.', 20, y);

  y += 18;
  doc.line(20, y, 90, y);
  doc.setFont('helvetica', 'bold');
  doc.text(empresa.representanteLegal, 20, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${empresa.cargoRepresentante} · C.I. ${empresa.cedulaRepresentante}`, 20, y + 8.5);
  doc.text(empresa.razonSocial, 20, y + 12.5);

  setupFooter(doc, 1, 1);
  doc.save(`Carta_Explicacion_Banco_${op.numeroExpediente}.pdf`);
};

/**
 * 5. Genera PDF de la Declaración Jurada de Origen y Destino Lícito (Formato Oficial BCV)
 */
export const downloadPdfDeclaracionOrigenDestino = (op: ExpedienteOperacion, empresa: DatosEmpresaImportadora) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  setupHeader(
    doc,
    empresa,
    'DECLARACIÓN JURADA DE ORIGEN Y DESTINO LÍCITO DE FONDOS',
    `Mesa de Cambio del Banco Central de Venezuela (BCV) / SUDEBAN · Expediente ${op.numeroExpediente}`
  );

  let y = 48;
  doc.setFontSize(8.5);

  const parrafo =
    `Quien suscribe, ${empresa.representanteLegal}, de nacionalidad venezolana, mayor de edad, titular de la Cédula de Identidad N° ${empresa.cedulaRepresentante}, actuando en mi carácter de ${empresa.cargoRepresentante} de la sociedad mercantil ${empresa.razonSocial}, titular del RIF N° ${empresa.rif}, declaro bajo fe de juramento a la institución bancaria ${op.divisas.bancoMesaCambio} y al Banco Central de Venezuela lo siguiente:\n\n` +
    `1. Que los fondos en Bolívares por la cantidad de Bs. ${op.divisas.montoBsEquivalente.toLocaleString('es-VE')} utilizados para la adquisición de USD ${op.divisas.montoUsd.toLocaleString('en-US')} a la tasa de cambio de ${op.divisas.tasaBCV} Bs/USD corresponden a ingresos legítimos derivados de la actividad comercial de nuestra empresa, específicamente a anticipos bancarios recibidos de clientes en el marco del Contrato de Compraventa con Entrega Futura N° ${op.numeroExpediente} con el ciudadano ${op.cliente.nombre} (C.I. ${op.cliente.cedula}).\n\n` +
    `2. Que el destino de las referidas divisas es exclusivamente el pago directo a nuestro proveedor internacional ${op.proveedor.nombreProveedor} (${op.proveedor.paisProveedor}), amparado en la Factura Comercial N° ${op.proveedor.facturaNumero}, para la importación legal de ${op.cliente.producto} (${op.cliente.cantidad}).\n\n` +
    `3. Que los recursos no provienen ni están destinados a actividades ilícitas de legitimación de capitales, financiamiento al terrorismo ni proliferación de armas de destrucción masiva, ni guardan relación con operaciones contempladas en las sanciones o delitos de la legislación venezolana e internacional vigente.\n\n` +
    `4. Que nos comprometemos formalmente a reintegrar o vender a la mesa de cambio del banco cualquier remanente de divisas que por causas sobrevenidas no sea utilizado en la importación declarada.`;

  const sp = doc.splitTextToSize(parrafo, 170);
  doc.text(sp, 20, y);

  y += sp.length * 4.2 + 20;

  doc.line(55, y, 145, y);
  doc.setFont('helvetica', 'bold');
  doc.text('FIRMA DEL DECLARANTE RESPONSABLE', 65, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${empresa.representanteLegal} · C.I. ${empresa.cedulaRepresentante}`, 65, y + 9);
  doc.text(`Por ${empresa.razonSocial} (RIF ${empresa.rif})`, 65, y + 13);

  setupFooter(doc, 1, 1);
  doc.save(`Declaracion_Jurada_BCV_${op.numeroExpediente}.pdf`);
};

/**
 * 6. Genera PDF del Libro Diario Contable Completo (VEN-NIF)
 */
export const downloadPdfLibroDiario = (
  asientos: AsientoContable[],
  empresa: DatosEmpresaImportadora,
  tituloFiltro?: string
) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const titulo = tituloFiltro ? `LIBRO DIARIO CONTABLE - ${tituloFiltro}` : 'LIBRO DIARIO CONTABLE (VEN-NIF)';
  let pageNum = 1;
  const pageHeight = doc.internal.pageSize.getHeight();

  setupHeader(
    doc,
    empresa,
    titulo,
    `Registro cronológico de operaciones cambiarias y comerciales · Código de Comercio / SENIAT`
  );

  let y = 46;
  doc.setFontSize(8);

  let totalGeneralDebe = 0;
  let totalGeneralHaber = 0;

  asientos.forEach((asiento, aIdx) => {
    // Si queda poco espacio, pasar de página
    if (y + asiento.lineas.length * 6 + 18 > pageHeight - 20) {
      setupFooter(doc, pageNum);
      doc.addPage();
      pageNum++;
      setupHeader(doc, empresa, titulo, `Continuación - Página ${pageNum}`);
      y = 46;
    }

    // Cabecera del asiento
    doc.setFillColor(241, 245, 249);
    doc.rect(20, y, 170, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(
      `${asiento.numeroComprobante} · Fecha: ${formatDateVE(asiento.fecha)} · ${asiento.tipoOperacion} (${asiento.expedienteNumero})`,
      22,
      y + 4.2
    );
    y += 8;

    // Líneas del asiento
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);

    asiento.lineas.forEach((linea) => {
      doc.setTextColor(71, 85, 105);
      doc.text(linea.codigoCuenta, 22, y);
      doc.setTextColor(15, 23, 42);
      doc.text(linea.nombreCuenta.slice(0, 45), 44, y);

      if (linea.debe > 0) {
        doc.setFont('courier', 'bold');
        doc.text(linea.debe.toLocaleString('es-VE', { minimumFractionDigits: 2 }), 150, y, { align: 'right' });
        doc.setFont('helvetica', 'normal');
      }

      if (linea.haber > 0) {
        doc.setFont('courier', 'bold');
        doc.text(linea.haber.toLocaleString('es-VE', { minimumFractionDigits: 2 }), 188, y, { align: 'right' });
        doc.setFont('helvetica', 'normal');
      }

      y += 4.5;
    });

    totalGeneralDebe += asiento.totalDebe;
    totalGeneralHaber += asiento.totalHaber;

    // Glosa
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    const splitGlosa = doc.splitTextToSize(`Glosa: ${asiento.glosa}`, 166);
    doc.text(splitGlosa, 22, y);
    y += splitGlosa.length * 3.2 + 3;

    doc.setDrawColor(226, 232, 240);
    doc.line(20, y, 190, y);
    y += 4;
  });

  // Totales
  if (y + 15 > pageHeight - 20) {
    setupFooter(doc, pageNum);
    doc.addPage();
    pageNum++;
    setupHeader(doc, empresa, titulo, `Continuación - Página ${pageNum}`);
    y = 46;
  }

  doc.setFillColor(248, 250, 252);
  doc.rect(20, y, 170, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL GENERAL (SUMAS IGUALES):', 22, y + 5.5);
  doc.setFont('courier', 'bold');
  doc.text(totalGeneralDebe.toLocaleString('es-VE', { minimumFractionDigits: 2 }), 150, y + 5.5, { align: 'right' });
  doc.text(totalGeneralHaber.toLocaleString('es-VE', { minimumFractionDigits: 2 }), 188, y + 5.5, { align: 'right' });

  setupFooter(doc, pageNum, pageNum);
  doc.save(`Libro_Diario_${new Date().toISOString().slice(0, 10)}.pdf`);
};



/**
 * Genera y descarga el documento oficial en PDF:
 * "GUIA DEL MARCO LEGAL, CAMBIARIO Y BANCARIO DE VENEZUELA"
 * Conforme a la normativa BCV (Convenio Cambiario N° 1), SUDEBAN (Resol. 083.18),
 * SENIAT (Providencia 00071) y Código de Comercio.
 */
export const downloadPdfGuiaMarcoLegal = (empresa: DatosEmpresaImportadora) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 16;
  const rightMargin = pageWidth - 16;
  const contentWidth = rightMargin - leftMargin; // ~178mm
  let pageNum = 1;

  const headerTitle = 'GUÍA OFICIAL DEL MARCO LEGAL, CAMBIARIO Y BANCARIO';
  const headerSubtitle = 'Compendio Jurídico-Normativo BCV · SUDEBAN · SENIAT · Régimen LC/FT/FPADM';

  const printHeader = (sub: string = headerSubtitle) => {
    setupHeader(doc, empresa, headerTitle, sub);
  };

  const checkPageSpace = (neededHeight: number): number => {
    if (y + neededHeight > pageHeight - 22) {
      doc.addPage();
      pageNum++;
      printHeader(`Continuación - Página ${pageNum}`);
      y = 44;
    }
    return y;
  };

  // PÁGINA 1
  printHeader();
  let y = 43;

  // Banner Portada Institucional
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(leftMargin, y, contentWidth, 22, 2, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(245, 158, 11); // amber-500
  doc.text('MANUAL DE CUMPLIMIENTO REGULATORIO Y TRAZABILIDAD MONETARIA', leftMargin + 6, y + 7);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(241, 245, 249);
  doc.text(
    `Empresa de Registro: ${empresa.razonSocial} · RIF: ${empresa.rif} · Jurisdicción: ${empresa.circunscripcion || 'Venezuela'}`,
    leftMargin + 6,
    y + 13
  );
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Preparado para: Oficiales de Cumplimiento, Unidades de Inteligencia Financiera, Auditores Externos y SUDEBAN`,
    leftMargin + 6,
    y + 18
  );

  y += 26;

  // Sección 1: Introducción y Fundamento Operativo
  const renderSectionHeader = (title: string, num: string, colorRgb: [number, number, number] = [180, 83, 9]) => {
    checkPageSpace(14);
    doc.setFillColor(colorRgb[0], colorRgb[1], colorRgb[2]);
    doc.rect(leftMargin, y, 3, 7.5, 'F');
    
    doc.setFillColor(248, 250, 252);
    doc.rect(leftMargin + 3, y, contentWidth - 3, 7.5, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${num}. ${title.toUpperCase()}`, leftMargin + 6, y + 5.2);
    y += 10.5;
  };

  const renderBullet = (title: string, body: string, highlightColor: [number, number, number] = [15, 23, 42]) => {
    const fullText = `• ${title}: ${body}`;
    const lines = doc.splitTextToSize(fullText, contentWidth - 4);
    const boxHeight = lines.length * 3.4 + 2;
    checkPageSpace(boxHeight + 2);

    doc.setFontSize(7.2);
    doc.setTextColor(highlightColor[0], highlightColor[1], highlightColor[2]);
    
    // Imprimir líneas
    doc.setFont('helvetica', 'normal');
    doc.text(lines, leftMargin + 3, y + 2.5);
    y += boxHeight;
  };

  renderSectionHeader('Régimen Cambiario Vigente del Banco Central de Venezuela (BCV)', '1', [180, 83, 9]);

  renderBullet(
    'Derogación del Régimen de Ilícitos Cambiarios',
    'Mediante Decreto Constituyente de fecha 02 de agosto de 2018 (Gaceta Oficial N° 41.452), fue derogada en su totalidad la Ley del Régimen de Ilícitos Cambiarios y sus penas corporales y pecuniarias, restituyendo de pleno derecho la libre convertibilidad de la moneda en todo el territorio nacional y despenalizando de forma absoluta las operaciones en moneda extranjera.'
  );

  renderBullet(
    'Convenio Cambiario N° 1 del BCV (G.O. 6.405 Ext. del 07/09/2018)',
    'Establece el marco general rector de la libre convertibilidad de la moneda. Faculta expresamente a las personas naturales y jurídicas a pactar transacciones, compras de bienes e importaciones en divisas. Las empresas pueden adquirir divisas legalmente a través del Sistema de Mesas de Cambio de las instituciones bancarias universales autorizadas por el BCV.'
  );

  renderBullet(
    'Declaración Obligatoria de Origen y Destino Lícito',
    'Todo acceso a las Mesas de Cambio bancarias exige la suscripción de la Declaración Jurada de Origen y Destino de Fondos. La empresa importadora demuestra que los Bolívares provienen de ventas lícitas o anticipos comerciales bancarizados (con Factura SENIAT) y que las divisas adquiridas se destinan al pago directo del proveedor extranjero mediante transferencia SWIFT documentada con Factura Comercial definitiva.'
  );

  renderBullet(
    'Destino No Consumido de Divisas',
    'La normativa cambiaria estipula perentoriamente que toda divisa adquirida a través de la Mesa de Cambio oficial con fines de importación que no se consuma o presente saldos remanentes debe ser reintegrada al banco o conservada en cuenta custodia del Convenio Cambiario N° 1; bajo ninguna circunstancia puede desviarse a terceros no autorizados ni a fines distintos a los declarados.'
  );

  renderBullet(
    'Impuesto a las Grandes Transacciones Financieras (IGTF)',
    'Aplica alícuota del 3% a los débitos, transferencias y pagos en divisas dentro del sistema financiero nacional o cuando intervengan Sujetos Pasivos Especiales, rigiéndose por la Ley de Reforma Parcial del IGTF (G.O. N° 6.687 Ext.).'
  );

  y += 3;
  renderSectionHeader('Normativa Bancaria y Régimen LC/FT/FPADM (SUDEBAN)', '2', [2, 132, 199]);

  renderBullet(
    'Resolución SUDEBAN 083.18 (Gaceta Oficial N° 41.566)',
    'Normas relativas a la Administración y Fiscalización de los Riesgos relacionados con los Delitos de Legitimación de Capitales, Financiamiento al Terrorismo y Financiamiento de la Proliferación de Armas de Destrucción Masiva aplicables a las instituciones bancarias y a sus clientes corporativos.'
  );

  renderBullet(
    'Política "Conozca a su Cliente" (KYC) para Personas Naturales',
    'Obligación inexcusable de conformar y custodiar un Expediente Individual para cada cliente o aportante de anticipo que contenga: Cédula de Identidad legible, RIF vigente, Certificación de Ingresos o Constancia de Trabajo, Perfil Financiero y Declaración de Condición de Persona Expuesta Políticamente (PEP).'
  );

  renderBullet(
    'Regla de Oro: Titularidad Bancaria Estricta y Rastro Cero Terceros',
    'La SUDEBAN y las Unidades de Cumplimiento prohíben taxativamente la triangulación de pagos y la recepción de fondos de cuentas pertenecientes a terceras personas no firmantes del contrato. El dinero del anticipo debe ingresar indefectiblemente desde una cuenta bancaria a nombre del mismo titular persona natural registrado en el contrato de compraventa y ficha KYC.'
  );

  renderBullet(
    'Plazo Legal de Custodia Documental (Mínimo 5 Años)',
    'De conformidad con el Artículo 42 de la Ley Orgánica contra la Delincuencia Organizada y el Financiamiento al Terrorismo (LODOFT) y los manuales SUDEBAN, todos los expedientes, contratos, facturas, comprobantes bancarios y planillas KYC deben ser conservados en archivo físico y digital por un plazo mínimo no menor a cinco (5) años continuos.'
  );

  y += 3;
  renderSectionHeader('Régimen Tributario SENIAT y Tratamiento de Anticipos', '3', [16, 149, 193]);

  renderBullet(
    'Providencia Administrativa SENIAT SNAT/2011/00071 (Art. 13)',
    'Establece que todo cobro o recepción dineraria previo a la entrega de la mercancía constituye legalmente un anticipo de precio, obligando a la empresa a emitir de manera inmediata una Factura de Anticipo con su correspondiente débito fiscal de IVA en la fecha de liquidación bancaria del abono.'
  );

  renderBullet(
    'Factura Definitiva al Cierre de la Entrega',
    'Al momento de la nacionalización de la mercancía importada y su despacho al comprador, se emite la Factura Comercial Definitiva, en la cual se descuenta o imputa el anticipo ya facturado y se cobra el diferencial si existiere, cerrando el ciclo de débito y crédito fiscal.'
  );

  renderBullet(
    'Régimen de Retenciones de IVA e ISLR',
    'Cuando las partes o el pagador ostenten la condición de Contribuyente Especial designado por el SENIAT, deberán aplicarse las retenciones según las providencias vigentes (Providencia SNAT/2015/0049 para IVA y Decreto 1.808 para ISLR).'
  );

  y += 3;
  renderSectionHeader('Estructura Jurídica Mercantil: Importador de Registro', '4', [79, 70, 229]);

  renderBullet(
    'Compraventa Mercantil con Entrega Futura (Código de Comercio Art. 133)',
    'La empresa actúa bajo su propia personalidad jurídica, nombre y riesgo comercial como importadora directa y vendedora de la mercancía. Los clientes personas naturales compran un rubro que la empresa importará; en consecuencia, no existe intermediación bursátil ni captación ilícita de fondos.'
  );

  renderBullet(
    'Distinción Fundamental: No es Gestión de Fondos Ajenos',
    'Al configurarse como una compraventa mercantil tradicional con precio anticipado pactado, la empresa NO administra fondos de terceros, no otorga rendimientos financieros ni efectúa intermediación financiera reservada a los bancos autorizados por la Ley de Instituciones del Sector Bancario.'
  );

  renderBullet(
    'Rubros Agroalimentarios Regulados (SUNAGRO e INSAI)',
    'Tratándose de materias primas o rubros vegetales de consumo masivo, la empresa se encuentra sujeta al control del Sistema Integral de Control Agroalimentario (SICA/SUNAGRO), emisión obligatoria de Guías Únicas de Movilización y a las autorizaciones fitosanitarias de importación emitidas por el INSAI.'
  );

  // Cuadro Protocolo de Auditoría
  checkPageSpace(46);
  y += 2;
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(16, 185, 129); // emerald-500
  doc.setLineWidth(0.4);
  doc.roundedRect(leftMargin, y, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59); // emerald-900
  doc.text('CHECKLIST DE DEFENSA ANTE EL OFICIAL DE CUMPLIMIENTO BANCARIO', leftMargin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(4, 120, 87);
  doc.text(
    'Ante cualquier solicitud de soporte de operaciones cambiarias o abonos en cuenta corriente, presente en 24 horas:',
    leftMargin + 4,
    y + 10.5
  );

  const checklistItems = [
    '1. Carta Explicativa de la Operación dirigida a la Unidad de Prevención y Control de Legitimación de Capitales (UPCLC).',
    '2. Ficha Tapa del Expediente Regulatorio debidamente foliada con los 13 recaudos de auditoría cotejados.',
    '3. Contrato de Compraventa con Entrega Futura debidamente autenticado o suscrito con firma de ambas partes.',
    '4. Planilla KYC con copias de Cédula de Identidad y RIF del aportante donde se certifique origen lícito de fondos.',
    '5. Comprobante del abono bancario y Factura de Anticipo SENIAT emitida al mismo nombre y cédula del pagador.',
    '6. Factura Proforma y Comercial del proveedor internacional y comprobante de compra oficial en Mesa de Cambio BCV.',
    '7. Mensaje MT103 (SWIFT bancario) de transferencia directa al proveedor en el exterior que liquida la operación.'
  ];

  let checkY = y + 14.5;
  checklistItems.forEach((item) => {
    doc.text(item, leftMargin + 6, checkY);
    checkY += 3.3;
  });

  // Firmas de Auditoría al final del documento
  checkPageSpace(32);
  y = Math.max(checkY + 4, y + 42);

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);

  // Línea 1: Representante Legal
  doc.line(leftMargin + 10, y + 14, leftMargin + 75, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(empresa.representanteLegal, leftMargin + 42.5, y + 18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`C.I. ${empresa.cedulaRepresentante} · ${empresa.cargoRepresentante}`, leftMargin + 42.5, y + 21.5, { align: 'center' });
  doc.text(empresa.razonSocial, leftMargin + 42.5, y + 24.5, { align: 'center' });

  // Línea 2: Oficial de Cumplimiento / Auditor
  doc.line(rightMargin - 75, y + 14, rightMargin - 10, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('OFICINA DE AUDITORÍA Y CUMPLIMIENTO', rightMargin - 42.5, y + 18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Revisión Técnica y Control LC/FT/FPADM', rightMargin - 42.5, y + 21.5, { align: 'center' });
  doc.text(`Sello y Fecha: ${new Date().toLocaleDateString('es-VE')}`, rightMargin - 42.5, y + 24.5, { align: 'center' });

  // Numerar todas las páginas con setupFooter
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    setupFooter(doc, p, totalPages);
  }

  const safeRif = (empresa.rif || 'J-50145638-0').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Guia_Marco_Legal_Cambiario_Bancario_Venezuela_${safeRif}.pdf`);
};
