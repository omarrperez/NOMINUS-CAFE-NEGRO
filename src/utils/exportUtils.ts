/**
 * exportUtils.ts
 * Utilidades de exportación de alta fidelidad para:
 * 1. Microsoft Word (.docx nativo OOXML y .doc MSO)
 * 2. Archivos PDF reales (.pdf con paginación limpia vía jsPDF + html2canvas)
 * 3. Hojas de cálculo Excel (.csv con UTF-8 BOM)
 * 4. Impresión física calibrada (Ctrl+P)
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType
} from 'docx';

export interface DocxTableData {
  headers: string[];
  rows: (string | number)[][];
}

export interface DocxSectionData {
  companyName: string;
  companyRif: string;
  title: string;
  subtitle?: string;
  fileReference?: string;
  date?: string;
  addressee?: string[];
  paragraphs: string[];
  highlightBox?: string;
  table?: DocxTableData;
  annexes?: string[];
  signers?: { name: string; title: string; idNumber?: string }[];
}

/**
 * Genera y descarga un archivo Microsoft Word nativo (.docx) 100% compatible
 * con Microsoft Word 2016/2019/2021/365, Google Docs y LibreOffice.
 */
export async function downloadNativeDocx(
  filename: string,
  data: DocxSectionData
): Promise<void> {
  const children: (Paragraph | Table)[] = [];

  // 1. Membrete oficial
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: data.companyName.toUpperCase(),
          bold: true,
          size: 28, // 14pt
          font: 'Calibri',
          color: '0F172A'
        })
      ]
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `R.I.F.: ${data.companyRif} | INTERMEDIACIÓN COMERCIAL E IMPORTACIÓN DE CAFÉ`,
          bold: true,
          size: 19, // 9.5pt
          font: 'Calibri',
          color: '475569'
        })
      ]
    })
  );

  // Referencias y Fecha
  if (data.fileReference || data.date) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 140 },
        children: [
          ...(data.fileReference
            ? [
                new TextRun({
                  text: `${data.fileReference}\n`,
                  bold: true,
                  size: 20,
                  font: 'Calibri',
                  color: '0F172A'
                })
              ]
            : []),
          new TextRun({
            text: data.date ? `Fecha: ${data.date}` : `Fecha: ${new Date().toLocaleDateString('es-VE')}`,
            size: 19,
            font: 'Calibri',
            color: '475569'
          })
        ]
      })
    );
  }

  // Título del documento
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 100, after: 120 },
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: data.title,
          bold: true,
          size: 26,
          font: 'Calibri',
          color: '0F172A'
        })
      ]
    })
  );

  if (data.subtitle) {
    children.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: data.subtitle,
            italics: true,
            size: 21,
            font: 'Calibri',
            color: '475569'
          })
        ]
      })
    );
  }

  // Destinatario si aplica
  if (data.addressee && data.addressee.length > 0) {
    for (const line of data.addressee) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: line,
              bold: line.startsWith('CIUDADANOS') || line.startsWith('ASUNTO:'),
              size: 21,
              font: 'Calibri',
              color: '1E293B'
            })
          ]
        })
      );
    }
    children.push(new Paragraph({ spacing: { after: 100 } }));
  }

  // Cuadro destacado si existe
  if (data.highlightBox) {
    const tableHighlight = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: {
                fill: 'FEF3C7',
                type: ShadingType.CLEAR,
                color: 'auto'
              },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 8, color: 'D97706' },
                bottom: { style: BorderStyle.SINGLE, size: 8, color: 'D97706' },
                left: { style: BorderStyle.SINGLE, size: 24, color: 'D97706' },
                right: { style: BorderStyle.SINGLE, size: 8, color: 'D97706' }
              },
              children: [
                new Paragraph({
                  spacing: { before: 80, after: 80 },
                  children: [
                    new TextRun({
                      text: data.highlightBox,
                      size: 20,
                      font: 'Calibri',
                      color: '78350F'
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
    children.push(tableHighlight);
    children.push(new Paragraph({ spacing: { after: 120 } }));
  }

  // Párrafos del cuerpo
  for (const p of data.paragraphs) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 120, line: 260 },
        children: [
          new TextRun({
            text: p,
            size: 21,
            font: 'Calibri',
            color: '1E293B'
          })
        ]
      })
    );
  }

  // Tabla de datos si existe
  if (data.table && data.table.headers.length > 0) {
    const headerRow = new TableRow({
      tableHeader: true,
      children: data.table.headers.map(
        (h) =>
          new TableCell({
            shading: {
              fill: '1E293B',
              type: ShadingType.CLEAR,
              color: 'auto'
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: '1E293B' },
              bottom: { style: BorderStyle.SINGLE, size: 12, color: '1E293B' },
              left: { style: BorderStyle.SINGLE, size: 4, color: '334155' },
              right: { style: BorderStyle.SINGLE, size: 4, color: '334155' }
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 50, after: 50 },
                children: [
                  new TextRun({
                    text: h,
                    bold: true,
                    size: 18,
                    font: 'Calibri',
                    color: 'FFFFFF'
                  })
                ]
              })
            ]
          })
      )
    });

    const bodyRows = data.table.rows.map(
      (r, rIdx) =>
        new TableRow({
          children: r.map(
            (c, cIdx) =>
              new TableCell({
                shading: rIdx % 2 === 1 ? { fill: 'F8FAFC', type: ShadingType.CLEAR, color: 'auto' } : undefined,
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
                  left: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
                  right: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
                },
                children: [
                  new Paragraph({
                    alignment:
                      cIdx === 0
                        ? AlignmentType.LEFT
                        : typeof c === 'number' || String(c).includes('Bs.') || String(c).includes('$') || String(c).includes('%')
                        ? AlignmentType.RIGHT
                        : AlignmentType.LEFT,
                    spacing: { before: 40, after: 40 },
                    children: [
                      new TextRun({
                        text: String(c),
                        size: 18,
                        font: 'Calibri',
                        color: '1E293B'
                      })
                    ]
                  })
                ]
              })
          )
        })
    );

    const docxTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...bodyRows]
    });

    children.push(docxTable);
    children.push(new Paragraph({ spacing: { after: 140 } }));
  }

  // Anexos
  if (data.annexes && data.annexes.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 60 },
        children: [
          new TextRun({
            text: 'RECAUDOS Y SOPORTES CONSIGNADOS:',
            bold: true,
            size: 20,
            font: 'Calibri',
            color: '0F172A'
          })
        ]
      })
    );
    data.annexes.forEach((a, i) => {
      children.push(
        new Paragraph({
          spacing: { after: 50 },
          children: [
            new TextRun({
              text: `${i + 1}. ${a}`,
              size: 19,
              font: 'Calibri',
              color: '334155'
            })
          ]
        })
      );
    });
  }

  // Firmas oficiales
  if (data.signers && data.signers.length > 0) {
    children.push(new Paragraph({ spacing: { before: 240, after: 60 } }));
    const signatureCells = data.signers.map(
      (s) =>
        new TableCell({
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE }
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: '_________________________________________\n',
                  size: 20,
                  font: 'Calibri',
                  color: '64748B'
                }),
                new TextRun({
                  text: s.name,
                  bold: true,
                  size: 21,
                  font: 'Calibri',
                  color: '0F172A'
                }),
                new TextRun({
                  text: `\n${s.title}`,
                  size: 19,
                  font: 'Calibri',
                  color: '475569'
                }),
                ...(s.idNumber
                  ? [
                      new TextRun({
                        text: `\nC.I. / RIF: ${s.idNumber}`,
                        size: 18,
                        font: 'Calibri',
                        color: '64748B'
                      })
                    ]
                  : [])
              ]
            })
          ]
        })
    );

    const signTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [new TableRow({ children: signatureCells })]
    });
    children.push(signTable);
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // ~2cm
              right: 1134,
              bottom: 1134,
              left: 1134
            }
          }
        },
        children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const downloadName = filename.endsWith('.docx') ? filename : `${filename.replace(/\.doc$/, '')}.docx`;

  downloadBlob(blob, downloadName);
}

/**
 * Exporta un fragmento HTML o elemento DOM como documento Microsoft Word.
 * Admite:
 * 1. Formato Word compatible MSO (.doc con esquemas Office): Preserva 100% el diseño CSS,
 *    colores, anchos de columna, membretes y tablas exactas.
 * 2. Formato OOXML nativo (.docx) si se especifica extensión .docx.
 */
export async function exportToWord(
  filename: string,
  title: string,
  htmlOrElement: string | HTMLElement
): Promise<void> {
  let rawHtml = '';
  if (typeof htmlOrElement === 'string') {
    // Si es un ID de elemento existente, tomar su innerHTML
    const foundEl = document.getElementById(htmlOrElement);
    rawHtml = foundEl ? foundEl.innerHTML : htmlOrElement;
  } else if (htmlOrElement && htmlOrElement.innerHTML) {
    rawHtml = htmlOrElement.innerHTML;
  }

  if (!rawHtml || !rawHtml.trim()) {
    console.warn('Contenido vacío para exportar a Word');
    return;
  }

  // Si el usuario especificó explícitamente .docx, intentar generar OOXML nativo
  if (filename.toLowerCase().endsWith('.docx')) {
    try {
      await exportHtmlToNativeDocx(filename, title, rawHtml);
      return;
    } catch (docxErr) {
      console.warn('Error generando docx nativo, utilizando formato Word HTML de alta fidelidad:', docxErr);
      // Fallback a formato Word MSO
    }
  }

  // Generar documento Word compatible de alta fidelidad (.doc)
  // Este formato es abierto de forma 100% nativa por Microsoft Word, Google Docs y LibreOffice
  // conservando todos los estilos de tabla, colores, bordes, alineaciones y tipografía.
  const safeFilename = filename.toLowerCase().endsWith('.doc')
    ? filename
    : `${filename.replace(/\.docx$/, '')}.doc`;

  const wordDocumentHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${escapeXml(title)}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page WordSection1 {
      size: 21.59cm 27.94cm; /* Carta (Letter) */
      margin: 2.5cm 2.0cm 2.5cm 2.0cm;
      mso-header-margin: 36pt;
      mso-footer-margin: 36pt;
      mso-paper-source: 0;
    }
    div.WordSection1 { page: WordSection1; }
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #1e293b;
      background-color: #ffffff;
    }
    h1 {
      font-size: 16pt;
      color: #0f172a;
      margin-top: 14pt;
      margin-bottom: 6pt;
      font-weight: bold;
    }
    h2 {
      font-size: 13pt;
      color: #0f172a;
      margin-top: 12pt;
      margin-bottom: 4pt;
      font-weight: bold;
      border-bottom: 1.5pt solid #d97706;
      padding-bottom: 3pt;
    }
    h3 {
      font-size: 11pt;
      color: #334155;
      margin-top: 10pt;
      margin-bottom: 3pt;
      font-weight: bold;
    }
    p {
      margin-top: 0;
      margin-bottom: 7pt;
      text-align: justify;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 8pt;
      margin-bottom: 12pt;
      font-size: 9.5pt;
    }
    th {
      background-color: #1e293b !important;
      color: #ffffff !important;
      font-weight: bold;
      padding: 6pt 8pt;
      border: 1pt solid #334155;
      text-align: left;
    }
    td {
      padding: 5pt 7pt;
      border: 1pt solid #cbd5e1;
      color: #1e293b;
      vertical-align: top;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .num, .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .highlight-box, .alerta {
      background-color: #fef3c7;
      border-left: 4pt solid #d97706;
      border-top: 1pt solid #fcd34d;
      border-right: 1pt solid #fcd34d;
      border-bottom: 1pt solid #fcd34d;
      padding: 8pt 12pt;
      margin: 8pt 0;
      color: #92400e;
    }
    .badge {
      display: inline-block;
      padding: 2pt 6pt;
      font-size: 8.5pt;
      font-weight: bold;
      border-radius: 3pt;
      background-color: #e2e8f0;
      color: #0f172a;
    }
    .footer-signatures {
      margin-top: 28pt;
      page-break-inside: avoid;
    }
    .no-print {
      display: none !important;
    }
  </style>
</head>
<body>
  <div class="WordSection1">
    ${cleanHtmlForWord(rawHtml)}
  </div>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff', wordDocumentHtml], {
    type: 'application/msword;charset=utf-8'
  });

  downloadBlob(blob, safeFilename);
}

/**
 * Convierte HTML a archivo .docx nativo usando la biblioteca docx
 */
async function exportHtmlToNativeDocx(
  filename: string,
  title: string,
  htmlContent: string
): Promise<void> {
  const parser = new DOMParser();
  const docHtml = parser.parseFromString(`<div>${htmlContent}</div>`, 'text/html');
  const root = docHtml.body.firstElementChild || docHtml.body;

  const children: (Paragraph | Table)[] = [];

  // Título principal
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 140 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 26,
          font: 'Calibri',
          color: '0F172A'
        })
      ]
    })
  );

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        children.push(
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text,
                size: 21,
                font: 'Calibri',
                color: '1E293B'
              })
            ]
          })
        );
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.classList.contains('no-print') || el.tagName.toLowerCase() === 'button') {
        return;
      }

      const tagName = el.tagName.toLowerCase();

      if (['h1', 'h2', 'h3'].includes(tagName)) {
        const text = el.textContent?.trim() || '';
        if (text) {
          children.push(
            new Paragraph({
              heading:
                tagName === 'h1'
                  ? HeadingLevel.HEADING_1
                  : tagName === 'h2'
                  ? HeadingLevel.HEADING_2
                  : HeadingLevel.HEADING_3,
              spacing: { before: 140, after: 80 },
              children: [
                new TextRun({
                  text,
                  bold: true,
                  size: tagName === 'h1' ? 26 : tagName === 'h2' ? 23 : 21,
                  font: 'Calibri',
                  color: '0F172A'
                })
              ]
            })
          );
        }
      } else if (tagName === 'p') {
        const text = el.textContent?.trim() || '';
        if (text) {
          children.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 120, line: 260 },
              children: [
                new TextRun({
                  text,
                  size: 21,
                  font: 'Calibri',
                  color: '1E293B'
                })
              ]
            })
          );
        }
      } else if (tagName === 'table') {
        const trs = Array.from(el.querySelectorAll('tr'));
        if (trs.length > 0) {
          const docxRows: TableRow[] = [];

          trs.forEach((tr, trIdx) => {
            const isHeader = trIdx === 0 || tr.parentElement?.tagName.toLowerCase() === 'thead';
            const cells = Array.from(tr.querySelectorAll('th, td'));

            const docxCells = cells.map((cell) => {
              const cellText = cell.textContent?.trim() || '';
              const isNum =
                cell.classList.contains('num') ||
                cell.classList.contains('text-right') ||
                /^[\$Bs\.\d,\s%-]+$/.test(cellText);

              return new TableCell({
                shading: isHeader
                  ? {
                      fill: '1E293B',
                      type: ShadingType.CLEAR,
                      color: 'auto'
                    }
                  : trIdx % 2 === 1
                  ? {
                      fill: 'F8FAFC',
                      type: ShadingType.CLEAR,
                      color: 'auto'
                    }
                  : undefined,
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: isHeader ? '1E293B' : 'CBD5E1' },
                  bottom: { style: BorderStyle.SINGLE, size: isHeader ? 8 : 4, color: isHeader ? '1E293B' : 'CBD5E1' },
                  left: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
                  right: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
                },
                children: [
                  new Paragraph({
                    alignment: isNum ? AlignmentType.RIGHT : AlignmentType.LEFT,
                    spacing: { before: 40, after: 40 },
                    children: [
                      new TextRun({
                        text: cellText,
                        bold: isHeader || cell.querySelector('strong') !== null,
                        size: isHeader ? 19 : 18,
                        font: 'Calibri',
                        color: isHeader ? 'FFFFFF' : '1E293B'
                      })
                    ]
                  })
                ]
              });
            });

            docxRows.push(
              new TableRow({
                tableHeader: isHeader,
                children: docxCells
              })
            );
          });

          const table = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: docxRows
          });

          children.push(table);
          children.push(new Paragraph({ spacing: { after: 120 } }));
        }
      } else if (tagName === 'li') {
        const text = el.textContent?.trim() || '';
        if (text) {
          children.push(
            new Paragraph({
              spacing: { after: 50 },
              bullet: { level: 0 },
              children: [
                new TextRun({
                  text,
                  size: 20,
                  font: 'Calibri',
                  color: '334155'
                })
              ]
            })
          );
        }
      } else if (el.classList.contains('highlight-box') || el.classList.contains('alerta')) {
        const text = el.textContent?.trim() || '';
        if (text) {
          children.push(
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      shading: {
                        fill: 'FEF3C7',
                        type: ShadingType.CLEAR,
                        color: 'auto'
                      },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 6, color: 'D97706' },
                        bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D97706' },
                        left: { style: BorderStyle.SINGLE, size: 24, color: 'D97706' },
                        right: { style: BorderStyle.SINGLE, size: 6, color: 'D97706' }
                      },
                      children: [
                        new Paragraph({
                          spacing: { before: 60, after: 60 },
                          children: [
                            new TextRun({
                              text,
                              size: 20,
                              font: 'Calibri',
                              color: '78350F'
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          );
          children.push(new Paragraph({ spacing: { after: 100 } }));
        }
      } else {
        // Para divs, sections o contenedores genéricos:
        // Si no tienen etiquetas hijas de bloque, extraer el texto
        const hasBlockChildren = el.querySelector('p, table, h1, h2, h3, ul, ol, div');
        if (!hasBlockChildren && el.textContent?.trim()) {
          const text = el.textContent.trim();
          if (text) {
            children.push(
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text,
                    bold: el.tagName.toLowerCase() === 'strong' || el.classList.contains('font-bold'),
                    size: 20,
                    font: 'Calibri',
                    color: '1E293B'
                  })
                ]
              })
            );
          }
        } else {
          Array.from(el.childNodes).forEach(processNode);
        }
      }
    }
  };

  Array.from(root.childNodes).forEach(processNode);

  if (children.length <= 1) {
    // Tomar texto plano si no se detectaron nodos
    const plainText = root.textContent?.trim() || '';
    plainText.split('\n').forEach((line) => {
      const cleanLine = line.trim();
      if (cleanLine) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: cleanLine,
                size: 20,
                font: 'Calibri'
              })
            ]
          })
        );
      }
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134,
              right: 1134,
              bottom: 1134,
              left: 1134
            }
          }
        },
        children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const downloadName = filename.endsWith('.docx') ? filename : `${filename.replace(/\.doc$/, '')}.docx`;
  downloadBlob(blob, downloadName);
}

/**
 * Descarga directamente un elemento DOM como un archivo PDF real (.pdf).
 * Utiliza html2canvas con rasterización de alta fidelidad y jsPDF con paginación
 * limpia basada en rebanadas de lienzo (canvas slicing).
 */
export async function downloadElementAsPdf(
  target: string | HTMLElement,
  filename: string,
  options?: {
    orientation?: 'p' | 'l';
    format?: 'letter' | 'a4';
    marginMm?: number;
  }
): Promise<void> {
  const element = typeof target === 'string' ? document.getElementById(target) : target;

  if (!element) {
    console.warn(`Elemento no encontrado para PDF: ${target}. Invocando impresión física.`);
    window.print();
    return;
  }

  const orientation = options?.orientation || 'p';
  const format = options?.format || 'letter';
  // Tamaño en mm
  const pageWidth = orientation === 'p' ? 215.9 : 279.4;
  const pageHeight = orientation === 'p' ? 279.4 : 215.9;

  try {
    // Captura con html2canvas asegurando fondo blanco y resolución 2x
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      onclone: (clonedDoc) => {
        // Eliminar elementos no imprimibles en el clon
        const noPrintEls = clonedDoc.querySelectorAll('.no-print, button');
        noPrintEls.forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });

        // Asegurar que las sombras y fondos oscuros no estropeen la captura
        const allSheets = clonedDoc.querySelectorAll('.shadow-2xl, .shadow-xl, .shadow-lg');
        allSheets.forEach((sheet) => {
          (sheet as HTMLElement).style.boxShadow = 'none';
        });
      }
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas vacío generado por html2canvas');
    }

    const pdf = new jsPDF(orientation, 'mm', format);

    // Calcular altura de página en píxeles de canvas
    const pageHeightPx = Math.floor((canvas.width * pageHeight) / pageWidth);

    if (canvas.height <= pageHeightPx) {
      // Documento de 1 sola página
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight);
    } else {
      // Documento multipágina: Cortar el canvas en rebanadas limpias
      const totalPages = Math.ceil(canvas.height / pageHeightPx);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage(format, orientation);
        }

        const srcY = i * pageHeightPx;
        const sliceHeight = Math.min(pageHeightPx, canvas.height - srcY);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageHeightPx;
        const ctx = pageCanvas.getContext('2d');

        if (ctx) {
          // Fondo blanco limpio
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          // Dibujar rebanada del documento
          ctx.drawImage(
            canvas,
            0,
            srcY,
            canvas.width,
            sliceHeight,
            0,
            0,
            canvas.width,
            sliceHeight
          );

          const sliceImgData = pageCanvas.toDataURL('image/jpeg', 0.92);
          pdf.addImage(sliceImgData, 'JPEG', 0, 0, pageWidth, pageHeight);
        }
      }
    }

    const safeFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(safeFilename);
  } catch (err) {
    console.error('Error generando archivo PDF con html2canvas/jsPDF:', err);
    // Fallback a ventana de impresión
    window.print();
  }
}

/**
 * Exporta un bloque de HTML plano o dinámico directamente como archivo PDF descargable.
 * Construye un contenedor estilizado fuera de pantalla, lo renderiza y lo descarga.
 */
export async function exportHtmlToPdf(
  filename: string,
  title: string,
  htmlContent: string
): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '850px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.padding = '36px';
  container.style.fontFamily = 'Calibri, Arial, sans-serif';
  container.style.fontSize = '12px';
  container.style.lineHeight = '1.4';
  container.style.zIndex = '-9999';

  container.innerHTML = `
    <div style="border-bottom: 2px solid #d97706; padding-bottom: 12px; margin-bottom: 18px;">
      <h1 style="font-size: 18px; margin: 0 0 4px 0; color: #0f172a; font-weight: bold;">${escapeXml(title)}</h1>
      <p style="margin: 0; font-size: 11px; color: #64748b;">AGRÍCOLA ONI C.A. &middot; RIF: J-40822606-8 &middot; Emisión Oficial</p>
    </div>
    <div style="color: #1e293b;">
      ${cleanHtmlForWord(htmlContent)}
    </div>
  `;

  document.body.appendChild(container);

  try {
    await downloadElementAsPdf(container, filename);
  } finally {
    document.body.removeChild(container);
  }
}

/** Alias para compatibilidad */
export const exportToPdf = downloadElementAsPdf;

export interface ExcelExportOptions {
  filename: string;
  sheetName?: string;
  companyName?: string;
  companyRif?: string;
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
  totalsRow?: (string | number)[];
  columnWidths?: number[];
}

/**
 * Genera y descarga un libro de trabajo Microsoft Excel (.xlsx) nativo
 * con formato ejecutivo, celdas numéricas reales en columnas independientes,
 * anchos de columna dinámicos y membrete corporativo.
 */
import ExcelJS from 'exceljs';

export async function exportToExcelXlsx(options: ExcelExportOptions): Promise<void> {
  const {
    filename,
    sheetName = 'Cuadre Oficial 2026',
    companyName = 'AGRÍCOLA ONI, C.A.',
    companyRif = 'J-40822606-8',
    title,
    subtitle,
    headers,
    rows,
    totalsRow,
    columnWidths
  } = options;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = companyName;
  workbook.lastModifiedBy = 'Auditoría Bancaria Banesco / SENIAT';
  workbook.created = new Date();

  const ws = workbook.addWorksheet(sheetName.substring(0, 31), {
    views: [{ showGridLines: true }]
  });

  const colCount = Math.max(headers.length, 1);

  // 1. Membrete corporativo
  // Fila 1: Nombre Empresa
  const r1 = ws.addRow([companyName.toUpperCase()]);
  r1.height = 24;
  ws.mergeCells(1, 1, 1, colCount);
  const c1 = ws.getCell('A1');
  c1.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  c1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }; // Dark Navy
  c1.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };

  // Fila 2: RIF e Información
  const r2 = ws.addRow([`R.I.F.: ${companyRif} | CUMPLE CON NORMAS BANCARIAS SUDEBAN Y VEN-NIF`]);
  r2.height = 18;
  ws.mergeCells(2, 1, 2, colCount);
  const c2 = ws.getCell('A2');
  c2.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFD97706' } }; // Golden Amber
  c2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  c2.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };

  // Fila 3: Título del Reporte
  const r3 = ws.addRow([title.toUpperCase()]);
  r3.height = 22;
  ws.mergeCells(3, 1, 3, colCount);
  const c3 = ws.getCell('A3');
  c3.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF0F172A' } };
  c3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } }; // Light Slate
  c3.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };

  // Fila 4: Subtítulo si aplica
  if (subtitle) {
    const r4 = ws.addRow([subtitle]);
    r4.height = 18;
    ws.mergeCells(4, 1, 4, colCount);
    const c4 = ws.getCell('A4');
    c4.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF475569' } };
    c4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    c4.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  }

  // Fila vacía separadora
  const rSpacer = ws.addRow([]);
  rSpacer.height = 10;

  // 2. Encabezados de Columna
  const headerRow = ws.addRow(headers);
  headerRow.height = 28;
  headerRow.eachCell((cell, colNum) => {
    cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }; // Corporate Navy
    cell.alignment = {
      horizontal: colNum <= 2 ? 'left' : 'right',
      vertical: 'middle',
      wrapText: true
    };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF0F172A' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
      left: { style: 'thin', color: { argb: 'FF334155' } },
      right: { style: 'thin', color: { argb: 'FF334155' } }
    };
  });

  // 3. Filas de Datos
  rows.forEach((rowData, idx) => {
    const row = ws.addRow(rowData);
    row.height = 26;
    const isOdd = idx % 2 === 1;
    const bgArgb = isOdd ? 'FFF8FAFC' : 'FFFFFFFF'; // Zebra striping

    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      const isFirstTwoCols = colNum <= 2;
      const rawValue = cell.value;

      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
      cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF1E293B' }, bold: colNum === 1 };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      if (isFirstTwoCols) {
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        // Formato numérico
        if (typeof rawValue === 'number') {
          const headerName = String(headers[colNum - 1] || '');
          if (headerName.includes('%')) {
            cell.numFmt = '0.0%';
          } else if (headerName.includes('USD') || headerName.includes('$')) {
            cell.numFmt = '"$"#,##0.00';
          } else {
            cell.numFmt = '#,##0.00';
          }
        } else if (typeof rawValue === 'string') {
          const str = rawValue.trim();
          if (str.endsWith('%')) {
            const pVal = parseFloat(str.replace('%', '')) / 100;
            if (!isNaN(pVal)) {
              cell.value = pVal;
              cell.numFmt = '0.0%';
            }
          } else if (/^-?\d+(\.\d+)?$/.test(str)) {
            cell.value = parseFloat(str);
            const headerName = String(headers[colNum - 1] || '');
            if (headerName.includes('USD') || headerName.includes('$')) {
              cell.numFmt = '"$"#,##0.00';
            } else {
              cell.numFmt = '#,##0.00';
            }
          }
        }
      }
    });
  });

  // 4. Fila de Totales si existe
  if (totalsRow) {
    const totalRow = ws.addRow(totalsRow);
    totalRow.height = 28;
    totalRow.eachCell({ includeEmpty: true }, (cell, colNum) => {
      const isFirstTwoCols = colNum <= 2;
      const rawValue = cell.value;

      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }; // Slate Dark Navy
      cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF0F172A' } },
        bottom: { style: 'double', color: { argb: 'FF0F172A' } }, // Accounting Double Bottom Border
        left: { style: 'thin', color: { argb: 'FF334155' } },
        right: { style: 'thin', color: { argb: 'FF334155' } }
      };

      if (isFirstTwoCols) {
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        if (typeof rawValue === 'number') {
          const headerName = String(headers[colNum - 1] || '');
          if (headerName.includes('%')) {
            cell.numFmt = '0.0%';
          } else if (headerName.includes('USD') || headerName.includes('$')) {
            cell.numFmt = '"$"#,##0.00';
            cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FF34D399' } };
          } else {
            cell.numFmt = '#,##0.00';
          }
        } else if (typeof rawValue === 'string') {
          const str = rawValue.trim();
          if (str.endsWith('%')) {
            const pVal = parseFloat(str.replace('%', '')) / 100;
            if (!isNaN(pVal)) {
              cell.value = pVal;
              cell.numFmt = '0.0%';
            }
          } else if (/^-?\d+(\.\d+)?$/.test(str)) {
            cell.value = parseFloat(str);
            const headerName = String(headers[colNum - 1] || '');
            if (headerName.includes('USD') || headerName.includes('$')) {
              cell.numFmt = '"$"#,##0.00';
              cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FF34D399' } };
            } else {
              cell.numFmt = '#,##0.00';
            }
          }
        }
      }
    });
  }

  // 5. Firma de auditoría al pie
  ws.addRow([]);
  const rSigHeader = ws.addRow(['CERTIFICACIÓN Y AUDITORÍA EXTERNA INDEPENDIENTE:']);
  rSigHeader.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };

  ws.addRow([]);
  const rSigLines = ws.addRow([
    '__________________________________________________',
    '',
    '',
    '',
    '',
    '__________________________________________________'
  ]);
  rSigLines.getCell(1).font = { name: 'Calibri', size: 9, color: { argb: 'FF64748B' } };
  rSigLines.getCell(6).font = { name: 'Calibri', size: 9, color: { argb: 'FF64748B' } };

  const rSigNames = ws.addRow([
    'Ing. Pedro Rodríguez (Presidente)',
    '',
    '',
    '',
    '',
    'Lcda. Carmen Rivas (Contador Público CPC 41.802)'
  ]);
  rSigNames.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
  rSigNames.getCell(6).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };

  const rSigTitles = ws.addRow([
    `${companyName} - RIF: ${companyRif}`,
    '',
    '',
    '',
    '',
    'Auditor Externo Independiente - VEN-NIF / SUDEBAN'
  ]);
  rSigTitles.getCell(1).font = { name: 'Calibri', size: 9, color: { argb: 'FF475569' } };
  rSigTitles.getCell(6).font = { name: 'Calibri', size: 9, color: { argb: 'FF475569' } };

  // Adjust Column Widths
  for (let i = 1; i <= colCount; i++) {
    const col = ws.getColumn(i);
    if (columnWidths && columnWidths[i - 1]) {
      col.width = Math.max(columnWidths[i - 1], 18);
    } else if (i === 1) {
      col.width = 38;
    } else if (i === 2) {
      col.width = 58;
    } else {
      col.width = 20;
    }
  }

  // Generate buffer and download file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const safeFilename = filename.toLowerCase().endsWith('.xlsx')
    ? filename
    : `${filename.replace(/\.csv$|\.xls$/, '')}.xlsx`;

  downloadBlob(blob, safeFilename);
}

/**
 * Exporta datos tabulares directamente como hoja de cálculo Excel (.xlsx) nativa.
 */
export function exportToCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
): void {
  const cleanFilename = filename.endsWith('.csv')
    ? filename.replace(/\.csv$/, '.xlsx')
    : filename;

  exportToExcelXlsx({
    filename: cleanFilename,
    sheetName: 'Datos_Auditados',
    title: 'INFORME DE AUDITORÍA Y REGISTROS BANCARIOS BBU 2026',
    headers,
    rows
  });
}

/**
 * Disparo nativo de impresión física (Ctrl + P)
 */
export function exportToPdfPrint(): void {
  window.print();
}

/** Helper para descargar un blob con enlace temporal */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Limpieza de HTML para asegurar compatibilidad con Microsoft Word */
function cleanHtmlForWord(html: string): string {
  return html
    .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '')
    .replace(/class="[^"]*no-print[^"]*"/gi, 'style="display:none"')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
    .trim();
}

/** Escapado básico de XML/HTML */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
