import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  PageBreak,
} from 'docx';
import JSZip from 'jszip';
import { DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { formatBs, formatDateVE, formatTasaBCV, formatUSD } from './formatters';

const triggerBlobDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
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
 * Genera el conjunto de elementos (párrafos y tablas) del Contrato de Compraventa
 * a Entrega Futura para una Persona Natural específica
 */
export const buildContratoDocxChildren = (
  op: ExpedienteOperacion,
  empresa: DatosEmpresaImportadora
): (Paragraph | Table)[] => {
  const ciudad = (empresa.ciudadEstado || 'Barcelona, Anzoátegui').split(',')[0].trim();
  const fechaStr = formatDateVE(op.fechaContrato);

  return [
    // Encabezado Membretado Oficial
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.SINGLE, size: 8, color: 'cbd5e1' },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: empresa.razonSocial,
                      bold: true,
                      size: 22,
                      color: '0f172a',
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `RIF: ${empresa.rif} · ${empresa.registroMercantil || ''}`,
                      size: 16,
                      color: '64748b',
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${empresa.direccionFiscal || ''} · Tlf: ${empresa.telefono || ''}`,
                      size: 16,
                      color: '64748b',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.SINGLE, size: 8, color: 'cbd5e1' },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `EXPEDIENTE N° ${op.numeroExpediente}`,
                      bold: true,
                      size: 18,
                      color: '0f172a',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${ciudad}, ${fechaStr}`,
                      size: 16,
                      color: '64748b',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // Espacio separador
    new Paragraph({ spacing: { before: 200, after: 100 } }),

    // Título Principal
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'CONTRATO DE COMPRAVENTA DE CAFÉ IMPORTADO CON ENTREGA FUTURA',
          bold: true,
          size: 24,
          color: '0f172a',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: '(ORDEN DE COMPRA CON ANTICIPO BANCARIZADO Y LIQUIDACIÓN BCV)',
          size: 18,
          color: '475569',
          italics: true,
        }),
      ],
    }),

    // Comparecencia
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 276, after: 180 },
      children: [
        new TextRun({ text: 'Entre, ' }),
        new TextRun({ text: empresa.razonSocial, bold: true }),
        new TextRun({
          text: `, sociedad mercantil inscrita por ante el ${empresa.registroMercantil}, bajo el N° ${empresa.folioNumero || '88-A'}, Tomo ${empresa.tomoNumero || '88-A'}, de fecha ${empresa.fechaRegistro || '15/01/2021'}, titular del RIF N° `,
        }),
        new TextRun({ text: empresa.rif, bold: true }),
        new TextRun({
          text: `, inscrita en el registro aplicable a rubros agroalimentarios (SUNAGRO/SICA: ${empresa.registroSunagro}), domiciliada en ${empresa.direccionFiscal}, representada en este acto por `,
        }),
        new TextRun({ text: empresa.representanteLegal, bold: true }),
        new TextRun({
          text: `, en su carácter de ${empresa.cargoRepresentante || 'Director General'}, titular de la cédula de identidad N° `,
        }),
        new TextRun({ text: empresa.cedulaRepresentante, bold: true }),
        new TextRun({ text: ', en lo sucesivo ' }),
        new TextRun({ text: '"LA EMPRESA"', bold: true }),
        new TextRun({ text: ' (importador de registro); y por la otra parte, ' }),
        new TextRun({ text: op.cliente.nombre, bold: true }),
        new TextRun({
          text: `, mayor de edad, de nacionalidad ${op.cliente.nacionalidad || 'Venezolana'}, titular de la cédula de identidad N° `,
        }),
        new TextRun({ text: op.cliente.cedula, bold: true }),
        new TextRun({ text: `, RIF personal N° ` }),
        new TextRun({ text: op.cliente.rif || 'N/A', bold: true }),
        new TextRun({
          text: `, domiciliado(a) en ${op.cliente.direccionHabitacion || 'Venezuela'}, en lo sucesivo `,
        }),
        new TextRun({ text: '"EL COMPRADOR"', bold: true }),
        new TextRun({ text: '; se ha convenido en celebrar el presente contrato contenido en las siguientes cláusulas:' }),
      ],
    }),

    // Cláusula Primera
    new Paragraph({
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({
          text: 'CLÁUSULA PRIMERA - OBJETO DEL CONTRATO',
          bold: true,
          size: 20,
          color: '0f172a',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 276, after: 180 },
      children: [
        new TextRun({
          text: `LA EMPRESA se obliga a vender a EL COMPRADOR, y éste a comprar, `,
        }),
        new TextRun({ text: `${op.cliente.cantidad} de ${op.cliente.producto}`, bold: true }),
        new TextRun({
          text: `, origen `,
        }),
        new TextRun({ text: op.cliente.origen, bold: true }),
        new TextRun({
          text: `, que LA EMPRESA importará por cuenta propia, en su propio nombre y riesgo, como importador de registro. Queda expresamente establecido que LA EMPRESA actúa como compradora e importadora directa de la mercancía y vendedora frente a EL COMPRADOR, y que el presente contrato constituye una compraventa mercantil con entrega futura; en consecuencia, EL COMPRADOR no confiere mandato alguno sobre fondos a LA EMPRESA.`,
        }),
      ],
    }),

    // Cláusula Segunda
    new Paragraph({
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({
          text: 'CLÁUSULA SEGUNDA - PRECIO Y DETERMINACIÓN',
          bold: true,
          size: 20,
          color: '0f172a',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 276, after: 180 },
      children: [
        new TextRun({ text: 'El precio total referencial de venta es de ' }),
        new TextRun({ text: formatBs(op.anticipo.montoBs), bold: true }),
        new TextRun({ text: ' o su equivalente en divisas de ' }),
        new TextRun({ text: formatUSD(op.divisas.montoUsd), bold: true }),
        new TextRun({
          text: `, calculado a la tasa de cambio oficial del Banco Central de Venezuela (BCV) publicada para la fecha de adquisición de las divisas (${formatTasaBCV(op.divisas.tasaBCV)}), más los impuestos de ley (IVA). La factura definitiva se emitirá al momento de la entrega material de los bienes importados.`,
        }),
      ],
    }),

    // Cláusula Tercera
    new Paragraph({
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({
          text: 'CLÁUSULA TERCERA - ANTICIPO Y BANCARIZACIÓN ESTRICTA (SIN TERCEROS)',
          bold: true,
          size: 20,
          color: '0f172a',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 276, after: 180 },
      children: [
        new TextRun({ text: 'EL COMPRADOR entrega en este acto un anticipo de ' }),
        new TextRun({ text: formatBs(op.anticipo.montoBs), bold: true }),
        new TextRun({
          text: `, como pago a cuenta del precio de la mercancía. El anticipo ha sido recibido exclusivamente mediante `,
        }),
        new TextRun({ text: op.anticipo.formaPago, bold: true }),
        new TextRun({ text: ` desde una cuenta bancaria a nombre de EL COMPRADOR en ` }),
        new TextRun({ text: op.anticipo.bancoOrigen, bold: true }),
        new TextRun({ text: ` (Referencia Bancaria N° ` }),
        new TextRun({ text: op.anticipo.referencia, bold: true }),
        new TextRun({
          text: `), quedando expresamente prohibido el uso de dinero en efectivo y pagos provenientes de terceros interpuestos. Dicho anticipo es facturado conforme a la Providencia SENIAT N° 00071 con Factura de Anticipo N° `,
        }),
        new TextRun({ text: op.anticipo.facturaSeniat, bold: true }),
        new TextRun({
          text: ` y contabilizado como pasivo comercial (anticipos de clientes) hasta la entrega definitiva.`,
        }),
      ],
    }),

    // Cláusula Cuarta
    new Paragraph({
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({
          text: 'CLÁUSULA CUARTA - APLICACIÓN DE FONDOS Y COMPRA DE DIVISAS EN MESA BCV',
          bold: true,
          size: 20,
          color: '0f172a',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 276, after: 180 },
      children: [
        new TextRun({
          text: `LA EMPRESA declara que los fondos recibidos se destinarán al financiamiento de esta importación específica. LA EMPRESA efectuará la adquisición de divisas a través de las instituciones bancarias autorizadas por el Banco Central de Venezuela (Mesa de Cambio Oficial: ${op.divisas.bancoMesaCambio}), en estricto cumplimiento del Convenio Cambiario N° 1 y las regulaciones cambiarias vigentes, declarando formalmente el origen y destino lícito de los recursos. Las divisas adquiridas serán canalizadas vía transferencia internacional SWIFT al proveedor del rubro (${op.proveedor.nombreProveedor}, ${op.proveedor.paisProveedor}).`,
        }),
      ],
    }),

    // Cláusula Quinta
    new Paragraph({
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({
          text: 'CLÁUSULA QUINTA - PERMISOLOGÍA, SUNAGRO Y ADUANAS',
          bold: true,
          size: 20,
          color: '0f172a',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 276, after: 180 },
      children: [
        new TextRun({
          text: `LA EMPRESA tramitará bajo su entera responsabilidad los permisos, licencias de importación, guías de movilización SICA emitidas por la Superintendencia Nacional de Gestión Agroalimentaria (SUNAGRO), trámites aduanales de nacionalización ante el SENIAT y certificaciones fitosanitarias (INSAI) que correspondan al producto.`,
        }),
      ],
    }),

    // Cláusula Sexta
    new Paragraph({
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({
          text: 'CLÁUSULA SEXTA - PREVENCIÓN DE LEGITIMACIÓN DE CAPITALES (LC/FT/FPADM)',
          bold: true,
          size: 20,
          color: '0f172a',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 276, after: 180 },
      children: [
        new TextRun({
          text: `Ambas partes declaran bajo fe de juramento que los fondos y recursos involucrados provienen y se destinan a actividades económicas lícitas, y que conocen las disposiciones de la Ley Orgánica contra la Delincuencia Organizada y Financiamiento al Terrorismo, la Resolución SUDEBAN 083.18 y el Instructivo sobre Prevención de LC/FT/FPADM. EL COMPRADOR entrega anexo su Cuestionario de Conocimiento del Cliente (KYC) debidamente firmado junto con copias legibles de su cédula de identidad y RIF vigente.`,
        }),
      ],
    }),

    // Cláusula Séptima
    new Paragraph({
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({
          text: 'CLÁUSULA SÉPTIMA - DOMICILIO FISCAL Y JURISDICCIÓN',
          bold: true,
          size: 20,
          color: '0f172a',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 276, after: 240 },
      children: [
        new TextRun({
          text: `Para todos los efectos derivados del presente contrato, las partes eligen como domicilio especial y excluyente la jurisdicción de la Circunscripción Judicial del Estado Anzoátegui (Barcelona / Lechería), a cuyos tribunales declaran someterse, rigiéndose en todo momento por las leyes de la República Bolivariana de Venezuela.`,
        }),
      ],
    }),

    // Párrafo de Cierre
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { line: 276, after: 320 },
      children: [
        new TextRun({
          text: `Se firman dos (2) ejemplares de un mismo tenor y a un solo efecto, en la ciudad de ${ciudad}, a los ${fechaStr}.`,
          italics: true,
        }),
      ],
    }),

    // Cuadro de Firmas (Tabla de 2 columnas)
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 60 },
                  children: [
                    new TextRun({
                      text: '_________________________________________',
                      color: '64748b',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'POR LA EMPRESA',
                      bold: true,
                      size: 20,
                      color: '0f172a',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: empresa.representanteLegal || 'TRIAS ABREU, ELIAS RAFAEL',
                      size: 18,
                      color: '334155',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `C.I. ${empresa.cedulaRepresentante} · ${empresa.cargoRepresentante || 'Director General'}`,
                      size: 16,
                      color: '64748b',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${empresa.razonSocial} (RIF ${empresa.rif})`,
                      size: 16,
                      color: '64748b',
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 60 },
                  children: [
                    new TextRun({
                      text: '_________________________________________',
                      color: '64748b',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'EL COMPRADOR',
                      bold: true,
                      size: 20,
                      color: '0f172a',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: op.cliente.nombre,
                      size: 18,
                      color: '334155',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `C.I. ${op.cliente.cedula} · RIF: ${op.cliente.rif || 'N/A'}`,
                      size: 16,
                      color: '64748b',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Tlf: ${op.cliente.telefono || 'N/A'} · ${op.cliente.ocupacion || 'Comerciante'}`,
                      size: 16,
                      color: '64748b',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];
};

/**
 * Genera el Blob de un contrato individual en Word (.docx)
 */
export const generateContratoWordBlob = async (
  op: ExpedienteOperacion,
  empresa: DatosEmpresaImportadora
): Promise<Blob> => {
  const children = buildContratoDocxChildren(op, empresa);

  const doc = new Document({
    title: `Contrato de Compraventa - Exp ${op.numeroExpediente} - ${op.cliente.nombre}`,
    description: `Contrato de compraventa mercantil con entrega futura formalizado ante ${empresa.razonSocial}`,
    creator: empresa.razonSocial,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 pulgada
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
};

/**
 * Descarga el contrato de una persona natural individual en Microsoft Word (.docx)
 */
export const downloadContratoWord = async (
  op: ExpedienteOperacion,
  empresa: DatosEmpresaImportadora
): Promise<void> => {
  const blob = await generateContratoWordBlob(op, empresa);
  const safeClient = op.cliente.nombre.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  const filename = `Contrato_Compraventa_${op.numeroExpediente}_${safeClient}.docx`;
  triggerBlobDownload(blob, filename);
};

/**
 * Descarga por lote TODOS los contratos de las personas naturales en un archivo ZIP con archivos Word (.docx)
 */
export const downloadBatchContratosWordZip = async (
  expedientes: ExpedienteOperacion[],
  empresa: DatosEmpresaImportadora,
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  if (!expedientes || expedientes.length === 0) return;

  const zip = new JSZip();

  for (let i = 0; i < expedientes.length; i++) {
    const op = expedientes[i];
    if (onProgress) {
      onProgress(i + 1, expedientes.length);
    }
    // Breve pausa para no congelar la UI
    await new Promise((resolve) => setTimeout(resolve, 15));

    const blob = await generateContratoWordBlob(op, empresa);
    const safeClient = op.cliente.nombre.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    const filename = `Contrato_EXP_${op.numeroExpediente}_${safeClient}.docx`;

    zip.file(filename, blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const safeEmpresa = (empresa.razonSocial || 'AGRICOLA_ONI').replace(/[^a-zA-Z0-9]/g, '_');
  const zipFilename = `Lote_Contratos_Word_Personas_Naturales_${safeEmpresa}_${new Date().toISOString().slice(0, 10)}.zip`;

  triggerBlobDownload(zipBlob, zipFilename);
};

/**
 * Descarga por lote TODOS los contratos en un ÚNICO documento consolidado de Microsoft Word (.docx)
 * con salto de página entre cada contrato.
 */
export const downloadBatchContratosWordUnified = async (
  expedientes: ExpedienteOperacion[],
  empresa: DatosEmpresaImportadora,
  onProgress?: (current: number, total: number) => void
): Promise<void> => {
  if (!expedientes || expedientes.length === 0) return;

  const allChildren: (Paragraph | Table)[] = [];

  for (let i = 0; i < expedientes.length; i++) {
    const op = expedientes[i];
    if (onProgress) {
      onProgress(i + 1, expedientes.length);
    }
    await new Promise((resolve) => setTimeout(resolve, 10));

    if (i > 0) {
      // Salto de página para separar contratos
      allChildren.push(new Paragraph({ children: [new PageBreak()] }));
    }

    const contractChildren = buildContratoDocxChildren(op, empresa);
    allChildren.push(...contractChildren);
  }

  const doc = new Document({
    title: `Lote Consolidado de Contratos - ${empresa.razonSocial}`,
    creator: empresa.razonSocial,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: allChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeEmpresa = (empresa.razonSocial || 'AGRICOLA_ONI').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Dossier_Maestro_Contratos_Word_${safeEmpresa}_${new Date().toISOString().slice(0, 10)}.docx`;

  triggerBlobDownload(blob, filename);
};
