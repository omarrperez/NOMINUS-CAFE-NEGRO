/**
 * exportUtils.ts
 * Utilidades de exportación de alta fidelidad para:
 * 1. Microsoft Word (.docx nativo OOXML y .doc MSO)
 * 2. Archivos PDF reales (.pdf con paginación limpia vía jsPDF + html2canvas)
 * 3. Hojas de cálculo Excel (.csv con UTF-8 BOM)
 * 4. Impresión física calibrada (Ctrl+P)
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
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
          text: `R.I.F.: ${data.companyRif} | INTERMEDIACIÓN COMERCIAL Y COMPRA DE CAFÉ NACIONAL`,
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
              fill: 'F1F5F9',
              type: ShadingType.CLEAR,
              color: 'auto'
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: '94A3B8' },
              bottom: { style: BorderStyle.SINGLE, size: 12, color: '94A3B8' },
              left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
              right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' }
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
                    color: '0F172A'
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
      background-color: #f1f5f9 !important;
      color: #0f172a !important;
      font-weight: bold;
      padding: 6pt 8pt;
      border: 1pt solid #94a3b8;
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
                      fill: 'F1F5F9',
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
                  top: { style: BorderStyle.SINGLE, size: 4, color: isHeader ? '94A3B8' : 'CBD5E1' },
                  bottom: { style: BorderStyle.SINGLE, size: isHeader ? 8 : 4, color: isHeader ? '94A3B8' : 'CBD5E1' },
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
                        color: isHeader ? '0F172A' : '1E293B'
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

export interface PdfTableExportOptions {
  filename: string;
  title: string;
  subtitle?: string;
  companyName?: string;
  companyRif?: string;
  periodDate?: string;
  headers: string[];
  rows: (string | number)[][];
  totalsRow?: (string | number)[];
  totals?: (string | number)[];
  notes?: string[];
  signers?: { name: string; title: string; idNumber?: string }[];
  orientation?: 'portrait' | 'landscape';
}

/**
 * Genera y descarga directamente un archivo PDF oficial con jsPDF + autoTable:
 * 100% fondo blanco, tipografía en negro, bordes claros y firmas oficiales.
 */
export function exportTableToPdf(options: PdfTableExportOptions): void {
  const {
    filename,
    title,
    subtitle,
    companyName = 'AGRÍCOLA ONI, C.A.',
    companyRif = 'J-40822606-8',
    periodDate = '31 de Agosto de 2026',
    headers,
    rows,
    totalsRow: rawTotalsRow,
    totals,
    notes,
    signers = [
      { name: 'Elias Rafael Trías Abreu', title: 'Presidente / Representante Legal' },
      { name: 'Licdo. Omar Pérez Castillo', title: 'Contador Público Independiente, Ven-Nif', idNumber: 'C.P.C. N° 16.336' }
    ],
    orientation = headers.length > 5 ? 'landscape' : 'portrait'
  } = options;

  const isLandscape = orientation === 'landscape';
  const doc = new jsPDF({
    orientation: isLandscape ? 'l' : 'p',
    unit: 'mm',
    format: 'letter'
  });

  const pageWidth = isLandscape ? 279.4 : 215.9;
  const pageHeight = isLandscape ? 215.9 : 279.4;
  const margin = 12;

  // 1. Membrete oficial
  doc.setFillColor(255, 255, 255);
  doc.setTextColor(0, 0, 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(companyName.toUpperCase(), margin, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`R.I.F.: ${companyRif} | NORMAS CONTABLES VEN-NIF PYME | CORTE AL ${periodDate.toUpperCase()}`, margin, 17.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(title.toUpperCase(), margin, 23);

  let currentY = 24.5;
  if (subtitle) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text(subtitle, margin, 28);
    currentY = 30;
  }

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.35);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  const effectiveTotals = rawTotalsRow || totals;
  const footData = effectiveTotals ? [effectiveTotals.map(v => String(v ?? ''))] : undefined;

  // Alineaciones de columnas
  const columnStyles: { [key: number]: { halign: 'left' | 'center' | 'right' } } = {};
  headers.forEach((h, idx) => {
    const hl = h.toLowerCase();
    if (idx === 0 && (hl === 'código' || hl === 'cod' || hl === 'n°' || hl === 'item')) {
      columnStyles[idx] = { halign: 'center' };
    } else if (idx <= 1 && !hl.includes('monto') && !hl.includes('bs') && !hl.includes('usd') && !hl.includes('%')) {
      columnStyles[idx] = { halign: 'left' };
    } else {
      columnStyles[idx] = { halign: 'right' };
    }
  });

  autoTable(doc, {
    startY: currentY + 3,
    margin: { left: margin, right: margin, top: 14, bottom: 20 },
    head: [headers],
    body: rows.map(r => r.map(c => String(c ?? ''))),
    foot: footData,
    theme: 'plain',
    styles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontSize: 7.5,
      cellPadding: 2,
      font: 'helvetica',
      lineColor: [200, 200, 200],
      lineWidth: 0.15
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineColor: [0, 0, 0],
      lineWidth: 0.3
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineColor: [0, 0, 0],
      lineWidth: 0.35
    },
    columnStyles: columnStyles,
    didDrawPage: (data) => {
      const pageStr = `Página ${data.pageNumber}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(pageStr, pageWidth - margin - 14, pageHeight - 6);
    }
  });

  let lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 170;

  if (notes && notes.length > 0) {
    if (lastY > pageHeight - 50) {
      doc.addPage();
      lastY = 18;
    } else {
      lastY += 5;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text('NOTAS Y ACLARATORIAS TÉCNICAS:', margin, lastY);
    lastY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    notes.forEach(n => {
      const splitText = doc.splitTextToSize(`• ${n}`, pageWidth - margin * 2);
      doc.text(splitText, margin, lastY);
      lastY += splitText.length * 3.5;
    });
  }

  if (signers && signers.length > 0) {
    if (lastY > pageHeight - 38) {
      doc.addPage();
      lastY = 24;
    } else {
      lastY += 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text('CERTIFICACIÓN Y ACTUACIÓN PROFESIONAL:', margin, lastY);
    lastY += 12;

    const sigColWidth = (pageWidth - margin * 2) / signers.length;
    signers.forEach((s, idx) => {
      const x = margin + idx * sigColWidth + sigColWidth / 2;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.25);
      doc.line(x - 32, lastY, x + 32, lastY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(s.name, x, lastY + 3.5, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(s.title, x, lastY + 7, { align: 'center' });

      if (s.idNumber) {
        doc.text(s.idNumber, x, lastY + 10.5, { align: 'center' });
      }
    });
  }

  const safeFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(safeFilename);
}

/**
 * Exporta un bloque de HTML plano o dinámico directamente como archivo PDF descargable.
 * Extrae tablas e invoca exportTableToPdf para un PDF vectorial perfecto y garantizado.
 */
export async function exportHtmlToPdf(
  filename: string,
  title: string,
  htmlContent: string
): Promise<void> {
  try {
    const parser = new DOMParser();
    const docHtml = parser.parseFromString(`<div>${htmlContent}</div>`, 'text/html');
    const tableEl = docHtml.querySelector('table');

    if (tableEl) {
      const ths = Array.from(tableEl.querySelectorAll('thead th, tr:first-child th'));
      const headers = ths.length > 0
        ? ths.map(th => th.textContent?.trim() || '')
        : [];

      const trs = Array.from(tableEl.querySelectorAll('tbody tr, tr'));
      const rows: string[][] = [];
      let totalsRow: string[] | undefined;

      trs.forEach(tr => {
        if (tr.parentElement?.tagName.toLowerCase() === 'thead') return;
        if (tr.querySelector('th') && !tr.querySelector('td')) return;

        const cells = Array.from(tr.querySelectorAll('td, th')).map(c => c.textContent?.trim() || '');
        const styleAttr = tr.getAttribute('style') || '';
        const isTotalRow = styleAttr.includes('0f172a') ||
          styleAttr.includes('font-weight:bold') ||
          cells[0]?.toUpperCase().includes('TOTAL');

        if (isTotalRow && !totalsRow) {
          totalsRow = cells;
        } else if (cells.length > 0) {
          rows.push(cells);
        }
      });

      if (headers.length > 0 && rows.length > 0) {
        exportTableToPdf({
          filename,
          title,
          headers,
          rows,
          totalsRow,
          orientation: headers.length > 6 ? 'landscape' : 'portrait'
        });
        return;
      }
    }
  } catch (parseErr) {
    console.warn('Error al parsear HTML con autoTable, utilizando método de respaldo:', parseErr);
  }

  // Respaldo visual con fondo blanco y letras en negro
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.padding = '28px';
  container.style.fontFamily = 'Calibri, Arial, sans-serif';
  container.style.fontSize = '11px';
  container.style.lineHeight = '1.35';
  container.style.zIndex = '-9999';
  container.style.opacity = '0';

  container.innerHTML = `
    <style>
      table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 12px; font-size: 9.5px; background-color: #ffffff !important; color: #000000 !important; }
      th { background-color: #ffffff !important; color: #000000 !important; font-weight: bold; border: 1px solid #000000 !important; padding: 5px 7px; }
      td { background-color: #ffffff !important; color: #000000 !important; border: 1px solid #d1d5db !important; padding: 4px 6px; }
      tr { background-color: #ffffff !important; color: #000000 !important; }
      tfoot td, tr[style*="background-color:#0f172a"] td, tr[style*="background-color: #0f172a"] td { background-color: #ffffff !important; color: #000000 !important; font-weight: bold !important; border-top: 1px solid #000000 !important; border-bottom: 3px double #000000 !important; }
      .num { text-align: right; }
      .highlight-box, .alerta { background-color: #ffffff !important; border: 1px solid #000000 !important; color: #000000 !important; padding: 8px 12px; margin: 10px 0; }
      h1, h2, h3, p, span, strong, td, th { color: #000000 !important; }
    </style>
    <div style="border-bottom: 1.5px solid #000000; padding-bottom: 8px; margin-bottom: 14px; background-color: #ffffff;">
      <h1 style="font-size: 16px; margin: 0 0 3px 0; color: #000000 !important; font-weight: bold;">${escapeXml(title)}</h1>
      <p style="margin: 0; font-size: 9.5px; color: #000000 !important;">AGRÍCOLA ONI, C.A. &middot; RIF: J-40822606-8 &middot; Normas VEN-NIF PYME &middot; Emisión Oficial</p>
    </div>
    <div style="color: #000000 !important; background-color: #ffffff !important;">
      ${cleanHtmlForWord(htmlContent)}
    </div>
  `;

  document.body.appendChild(container);

  try {
    await downloadElementAsPdf(container, filename);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Genera el paquete oficial de Estados Financieros Duales (Bs. & USD) en PDF nativo vectorial
 * con 100% fondo blanco, números perfectamente cuadrados, doble subrayado contable y firmas.
 */
export async function exportFinancialStatementsDualPdf(params: {
  filename: string;
  companyName: string;
  companyRif: string;
  periodDate: string;
  exchangeRateBCV: number;
  balanceSheetData: {
    assets: { current: (string | number)[][]; currentTotal: number; currentTotalUSD: number; ppe: (string | number)[][]; ppeTotal: number; ppeTotalUSD: number; totalAssets: number; totalAssetsUSD: number };
    liabilities: { current: (string | number)[][]; currentTotal: number; currentTotalUSD: number; totalLiabilities: number; totalLiabilitiesUSD: number };
    equity: { items: (string | number)[][]; totalEquity: number; totalEquityUSD: number };
    totalLiabilitiesAndEquity: number;
    totalLiabilitiesAndEquityUSD: number;
  };
  incomeStatementData: {
    rows: (string | number)[][];
    totalRevenuesBs: number;
    totalRevenuesUSD: number;
    netIncomeBs: number;
    netIncomeUSD: number;
  };
  trialBalanceData?: {
    rows: {
      code: string;
      accountName: string;
      category: string;
      initialBalance2025: { debitVES: number; creditVES: number };
      movements2026: { debitVES: number; creditVES: number };
      finalBalance2026: { debitVES: number; creditVES: number };
      finalBalanceUSD: { debitUSD: number; creditUSD: number };
    }[];
    totals: {
      initialDebitVES: number;
      initialCreditVES: number;
      movementsDebitVES: number;
      movementsCreditVES: number;
      finalDebitVES: number;
      finalCreditVES: number;
      finalDebitUSD: number;
      finalCreditUSD: number;
    };
  };
  notes: { title: string; text: string }[];
}): Promise<void> {
  const {
    filename,
    companyName,
    companyRif,
    periodDate,
    exchangeRateBCV,
    balanceSheetData,
    incomeStatementData,
    trialBalanceData,
    notes
  } = params;

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'letter'
  });

  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const margin = 12;

  const drawHeader = (sheetTitle: string) => {
    doc.setFillColor(255, 255, 255);
    doc.setTextColor(0, 0, 0);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(companyName.toUpperCase(), margin, 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`R.I.F.: ${companyRif} | CORTADO AL ${periodDate.toUpperCase()} | TASA OFICIAL BCV: ${exchangeRateBCV.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs/USD`, margin, 17.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(sheetTitle.toUpperCase(), margin, 23);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.35);
    doc.line(margin, 25, pageWidth - margin, 25);
  };

  const drawSignatures = (startY: number) => {
    let y = startY;
    if (y > pageHeight - 35) {
      doc.addPage();
      y = 25;
    } else {
      y += 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text('CERTIFICACIÓN Y APROBACIÓN TÉCNICA CONTABLE:', margin, y);
    y += 12;

    const mid = pageWidth / 2;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.25);

    // Firma 1
    doc.line(margin + 10, y, mid - 10, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Elias Rafael Trías Abreu', (margin + 10 + mid - 10) / 2, y + 3.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Presidente / Representante Legal', (margin + 10 + mid - 10) / 2, y + 7, { align: 'center' });
    doc.text(`${companyName} · RIF ${companyRif}`, (margin + 10 + mid - 10) / 2, y + 10.5, { align: 'center' });

    // Firma 2
    doc.line(mid + 10, y, pageWidth - margin - 10, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Licdo. Omar Pérez Castillo', (mid + 10 + pageWidth - margin - 10) / 2, y + 3.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Contador Público Independiente, Ven-Nif', (mid + 10 + pageWidth - margin - 10) / 2, y + 7, { align: 'center' });
    doc.text('C.P.C. N° 16.336', (mid + 10 + pageWidth - margin - 10) / 2, y + 10.5, { align: 'center' });
  };

  // -------------------------------------------------------------------------
  // PÁGINA 1: ESTADO DE SITUACIÓN FINANCIERA (BALANCE GENERAL DUAL)
  // -------------------------------------------------------------------------
  drawHeader('ESTADO DE SITUACIÓN FINANCIERA (BALANCE GENERAL COMPARATIVO DUAL BS. / USD)');

  const bsTableRows: (string | number)[][] = [];

  // Activo Corriente
  bsTableRows.push(['1.1', 'ACTIVO CORRIENTE (CIRCULANTE)', '', '']);
  balanceSheetData.assets.current.forEach(r => {
    bsTableRows.push([
      r[0],
      r[1],
      typeof r[2] === 'number' ? r[2].toLocaleString('es-VE', { minimumFractionDigits: 2 }) : String(r[2]),
      typeof r[3] === 'number' ? `$${r[3].toLocaleString('en-US', { minimumFractionDigits: 2 })}` : String(r[3])
    ]);
  });
  bsTableRows.push(['1.1.99', 'TOTAL ACTIVO CORRIENTE', `Bs. ${balanceSheetData.assets.currentTotal.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`, `$${balanceSheetData.assets.currentTotalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]);

  // PPE
  bsTableRows.push(['1.2', 'PROPIEDAD, PLANTA Y EQUIPOS (NO CORRIENTE)', '', '']);
  balanceSheetData.assets.ppe.forEach(r => {
    bsTableRows.push([
      r[0],
      r[1],
      typeof r[2] === 'number' ? r[2].toLocaleString('es-VE', { minimumFractionDigits: 2 }) : String(r[2]),
      typeof r[3] === 'number' ? `$${r[3].toLocaleString('en-US', { minimumFractionDigits: 2 })}` : String(r[3])
    ]);
  });
  bsTableRows.push(['1.2.99', 'TOTAL PROPIEDAD, PLANTA Y EQUIPO NETO', `Bs. ${balanceSheetData.assets.ppeTotal.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`, `$${balanceSheetData.assets.ppeTotalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]);

  // TOTAL ACTIVO
  bsTableRows.push(['1.0.00', 'TOTAL ACTIVO', `Bs. ${balanceSheetData.assets.totalAssets.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`, `$${balanceSheetData.assets.totalAssetsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]);

  // Pasivo Corriente
  bsTableRows.push(['2.1', 'PASIVO CORRIENTE (CIRCULANTE)', '', '']);
  balanceSheetData.liabilities.current.forEach(r => {
    bsTableRows.push([
      r[0],
      r[1],
      typeof r[2] === 'number' ? r[2].toLocaleString('es-VE', { minimumFractionDigits: 2 }) : String(r[2]),
      typeof r[3] === 'number' ? `$${r[3].toLocaleString('en-US', { minimumFractionDigits: 2 })}` : String(r[3])
    ]);
  });
  bsTableRows.push(['2.1.99', 'TOTAL PASIVO CORRIENTE', `Bs. ${balanceSheetData.liabilities.currentTotal.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`, `$${balanceSheetData.liabilities.currentTotalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]);
  bsTableRows.push(['2.0.00', 'TOTAL PASIVO', `Bs. ${balanceSheetData.liabilities.totalLiabilities.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`, `$${balanceSheetData.liabilities.totalLiabilitiesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]);

  // Patrimonio
  bsTableRows.push(['3.1', 'PATRIMONIO NETO', '', '']);
  balanceSheetData.equity.items.forEach(r => {
    bsTableRows.push([
      r[0],
      r[1],
      typeof r[2] === 'number' ? r[2].toLocaleString('es-VE', { minimumFractionDigits: 2 }) : String(r[2]),
      typeof r[3] === 'number' ? `$${r[3].toLocaleString('en-US', { minimumFractionDigits: 2 })}` : String(r[3])
    ]);
  });
  bsTableRows.push(['3.1.99', 'TOTAL PATRIMONIO NETO', `Bs. ${balanceSheetData.equity.totalEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`, `$${balanceSheetData.equity.totalEquityUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]);

  // TOTAL PASIVO Y PATRIMONIO
  bsTableRows.push(['3.0.00', 'TOTAL PASIVO Y PATRIMONIO NETO', `Bs. ${balanceSheetData.totalLiabilitiesAndEquity.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`, `$${balanceSheetData.totalLiabilitiesAndEquityUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`]);

  autoTable(doc, {
    startY: 28,
    margin: { left: margin, right: margin, bottom: 25 },
    head: [['Código', 'Cuenta Contable / Rubro Patrimonial', 'Monto en Bolívares (Bs.)', 'Monto en Dólares ($ USD)']],
    body: bsTableRows.map(r => r.map(c => String(c ?? ''))),
    theme: 'plain',
    styles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontSize: 7.2,
      cellPadding: 1.8,
      font: 'helvetica',
      lineColor: [215, 215, 215],
      lineWidth: 0.12
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineColor: [0, 0, 0],
      lineWidth: 0.3
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16 },
      1: { halign: 'left', cellWidth: 100 },
      2: { halign: 'right', cellWidth: 40 },
      3: { halign: 'right', cellWidth: 35 }
    },
    didParseCell: (data) => {
      const row = bsTableRows[data.row.index];
      if (!row) return;
      const code = String(row[0] || '');
      const desc = String(row[1] || '');
      if (code === '1.1' || code === '1.2' || code === '2.1' || code === '3.1') {
        data.cell.styles.fontStyle = 'bold';
      }
      if (code === '1.0.00' || code === '2.0.00' || code === '3.0.00' || desc.includes('TOTAL')) {
        data.cell.styles.fontStyle = 'bold';
        if (code === '1.0.00' || code === '3.0.00') {
          data.cell.styles.lineWidth = 0.25;
          data.cell.styles.lineColor = [0, 0, 0];
        }
      }
    }
  });

  const finalBsY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 180;
  drawSignatures(finalBsY);

  // -------------------------------------------------------------------------
  // PÁGINA 2: ESTADO DE RESULTADOS INTEGRAL (GANANCIAS Y PÉRDIDAS)
  // -------------------------------------------------------------------------
  doc.addPage();
  drawHeader('ESTADO DE RESULTADO INTEGRAL (GANANCIAS Y PÉRDIDAS DUAL BS. / USD)');

  const isTableRows: (string | number)[][] = [];
  incomeStatementData.rows.forEach(r => {
    isTableRows.push([
      r[0],
      r[1],
      typeof r[2] === 'number' ? r[2].toLocaleString('es-VE', { minimumFractionDigits: 2 }) : String(r[2]),
      typeof r[3] === 'number' ? `$${r[3].toLocaleString('en-US', { minimumFractionDigits: 2 })}` : String(r[3])
    ]);
  });
  isTableRows.push([
    '5.0.00',
    'UTILIDAD NETA DEL EJERCICIO (01/01/2026 AL 31/08/2026)',
    `Bs. ${incomeStatementData.netIncomeBs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`,
    `$${incomeStatementData.netIncomeUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  ]);

  autoTable(doc, {
    startY: 28,
    margin: { left: margin, right: margin, bottom: 25 },
    head: [['Código', 'Concepto / Cuenta de Ingresos y Gastos', 'Monto en Bolívares (Bs.)', 'Monto en Dólares ($ USD)']],
    body: isTableRows.map(r => r.map(c => String(c ?? ''))),
    theme: 'plain',
    styles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontSize: 7.5,
      cellPadding: 2,
      font: 'helvetica',
      lineColor: [215, 215, 215],
      lineWidth: 0.12
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      lineColor: [0, 0, 0],
      lineWidth: 0.3
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16 },
      1: { halign: 'left', cellWidth: 100 },
      2: { halign: 'right', cellWidth: 40 },
      3: { halign: 'right', cellWidth: 35 }
    },
    didParseCell: (data) => {
      const row = isTableRows[data.row.index];
      if (!row) return;
      const desc = String(row[1] || '');
      if (desc.includes('TOTAL') || desc.includes('UTILIDAD')) {
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  const finalIsY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 120;
  drawSignatures(finalIsY);

  // -------------------------------------------------------------------------
  // PÁGINA 3: BALANCE DE COMPROBACIÓN (SI EXISTE)
  // -------------------------------------------------------------------------
  if (trialBalanceData) {
    doc.addPage('letter', 'l');
    const tbPageWidth = 279.4;

    doc.setFillColor(255, 255, 255);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(companyName.toUpperCase(), margin, 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`R.I.F.: ${companyRif} | BALANCE DE COMPROBACIÓN DE SALDOS Y MOVIMIENTOS AL ${periodDate.toUpperCase()}`, margin, 16.5);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(margin, 19, tbPageWidth - margin, 19);

    const tbBody = trialBalanceData.rows.map(r => [
      r.code,
      r.accountName,
      r.category,
      r.initialBalance2025.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      r.initialBalance2025.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      r.movements2026.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      r.movements2026.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      r.finalBalance2026.debitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      r.finalBalance2026.creditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      `$${r.finalBalanceUSD.debitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `$${r.finalBalanceUSD.creditUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    ]);

    const tbFoot = [[
      'TOTAL',
      'TOTAL BALANCE DE COMPROBACIÓN AUDITADO',
      '100%',
      trialBalanceData.totals.initialDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      trialBalanceData.totals.initialCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      trialBalanceData.totals.movementsDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      trialBalanceData.totals.movementsCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      trialBalanceData.totals.finalDebitVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      trialBalanceData.totals.finalCreditVES.toLocaleString('es-VE', { minimumFractionDigits: 2 }),
      `$${trialBalanceData.totals.finalDebitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `$${trialBalanceData.totals.finalCreditUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    ]];

    autoTable(doc, {
      startY: 22,
      margin: { left: margin, right: margin, bottom: 15 },
      head: [
        ['Código', 'Nombre de la Cuenta', 'Cat.', 'Saldo Inicial 2025 (Bs.)', '', 'Movimientos 2026 (Bs.)', '', 'Saldo Final 2026 (Bs.)', '', 'Saldo Final USD', ''],
        ['', '', '', 'Debe', 'Haber', 'Debe', 'Haber', 'Debe', 'Haber', 'Debe ($)', 'Haber ($)']
      ],
      body: tbBody,
      foot: tbFoot,
      theme: 'plain',
      styles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 6.8,
        cellPadding: 1.5,
        font: 'helvetica',
        lineColor: [215, 215, 215],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.25
      },
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.3
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 14 },
        1: { halign: 'left', cellWidth: 48 },
        2: { halign: 'center', cellWidth: 10 },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
        8: { halign: 'right' },
        9: { halign: 'right' },
        10: { halign: 'right' }
      }
    });
  }

  // -------------------------------------------------------------------------
  // PÁGINA 4: NOTAS EXPLICATIVAS REVELATORIAS (VEN-NIF)
  // -------------------------------------------------------------------------
  doc.addPage('letter', 'p');
  drawHeader('NOTAS EXPLICATIVAS REVELATORIAS A LOS ESTADOS FINANCIEROS (VEN-NIF)');

  let noteY = 32;
  notes.forEach((n, idx) => {
    if (noteY > pageHeight - 45) {
      doc.addPage();
      drawHeader('NOTAS EXPLICATIVAS REVELATORIAS (CONTINUACIÓN)');
      noteY = 32;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`NOTA ${idx + 1}: ${n.title.toUpperCase()}`, margin, noteY);
    noteY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const splitText = doc.splitTextToSize(n.text, pageWidth - margin * 2);
    doc.text(splitText, margin, noteY);
    noteY += splitText.length * 3.6 + 4.5;
  });

  drawSignatures(noteY);

  const safeFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(safeFilename);
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
  totals?: (string | number)[];
  columnWidths?: number[];
}

/**
 * Genera y descarga un libro de trabajo Microsoft Excel (.xlsx) nativo
 * con formato ejecutivo, celdas numéricas reales en columnas independientes,
 * anchos de columna dinámicos y membrete corporativo.
 */
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
    totalsRow: rawTotalsRow,
    totals,
    columnWidths
  } = options;

  const totalsRow = rawTotalsRow || totals;

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
  c1.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF000000' } };
  c1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
  c1.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };

  // Fila 2: RIF e Información
  const r2 = ws.addRow([`R.I.F.: ${companyRif} | CUMPLE CON NORMAS CONTABLES VEN-NIF PYME`]);
  r2.height = 18;
  ws.mergeCells(2, 1, 2, colCount);
  const c2 = ws.getCell('A2');
  c2.font = { name: 'Calibri', size: 9.5, bold: false, color: { argb: 'FF000000' } };
  c2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
  c2.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };

  // Fila 3: Título del Reporte
  const r3 = ws.addRow([title.toUpperCase()]);
  r3.height = 22;
  ws.mergeCells(3, 1, 3, colCount);
  const c3 = ws.getCell('A3');
  c3.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
  c3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
  c3.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };

  // Fila 4: Subtítulo si aplica
  if (subtitle) {
    const r4 = ws.addRow([subtitle]);
    r4.height = 18;
    ws.mergeCells(4, 1, 4, colCount);
    const c4 = ws.getCell('A4');
    c4.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF000000' } };
    c4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    c4.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  }

  // Fila vacía separadora
  const rSpacer = ws.addRow([]);
  rSpacer.height = 10;

  // 2. Encabezados de Columna
  const headerRow = ws.addRow(headers);
  headerRow.height = 24;
  headerRow.eachCell((cell, colNum) => {
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF000000' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    cell.alignment = {
      horizontal: colNum <= 2 ? 'left' : 'right',
      vertical: 'middle',
      wrapText: true
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'medium', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
    };
  });

  // 3. Filas de Datos
  rows.forEach((rowData) => {
    const row = ws.addRow(rowData);
    row.height = 24;

    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      const isFirstTwoCols = colNum <= 2;
      const rawValue = cell.value;

      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF000000' }, bold: colNum === 1 };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
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

      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FF000000' } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'double', color: { argb: 'FF000000' } }, // Accounting Double Bottom Border
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
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
            cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FF000000' } };
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
              cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FF000000' } };
            } else {
              cell.numFmt = '#,##0.00';
            }
          }
        }
      }
    });
  }

  // 5. Firma de certificación profesional al pie
  ws.addRow([]);
  const rSigHeader = ws.addRow(['CERTIFICACIÓN Y ACTUACIÓN PROFESIONAL (CONTADOR PÚBLICO INDEPENDIENTE):']);
  rSigHeader.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF000000' } };

  ws.addRow([]);
  const rSigLines = ws.addRow([
    '__________________________________________________',
    '',
    '',
    '',
    '',
    '__________________________________________________'
  ]);
  rSigLines.getCell(1).font = { name: 'Calibri', size: 9, color: { argb: 'FF000000' } };
  rSigLines.getCell(6).font = { name: 'Calibri', size: 9, color: { argb: 'FF000000' } };

  const rSigNames = ws.addRow([
    'Elias Rafael Trías Abreu (Presidente)',
    '',
    '',
    '',
    '',
    'Licdo. Omar Pérez Castillo (Contador Público C.P.C. 16.336)'
  ]);
  rSigNames.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF000000' } };
  rSigNames.getCell(6).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF000000' } };

  const rSigTitles = ws.addRow([
    `${companyName} - RIF: ${companyRif}`,
    '',
    '',
    '',
    '',
    'Contador Público Independiente, VEN-NIF'
  ]);
  rSigTitles.getCell(1).font = { name: 'Calibri', size: 9, color: { argb: 'FF000000' } };
  rSigTitles.getCell(6).font = { name: 'Calibri', size: 9, color: { argb: 'FF000000' } };

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

export async function exportFinancialStatementsDualXlsx(params: {
  filename: string;
  companyName: string;
  companyRif: string;
  periodDate: string;
  exchangeRateBCV: number;
  balanceSheetData: {
    assets: { current: (string | number)[][]; currentTotal: number; currentTotalUSD: number; ppe: (string | number)[][]; ppeTotal: number; ppeTotalUSD: number; totalAssets: number; totalAssetsUSD: number };
    liabilities: { current: (string | number)[][]; currentTotal: number; currentTotalUSD: number; totalLiabilities: number; totalLiabilitiesUSD: number };
    equity: { items: (string | number)[][]; totalEquity: number; totalEquityUSD: number };
    totalLiabilitiesAndEquity: number;
    totalLiabilitiesAndEquityUSD: number;
  };
  incomeStatementData: {
    rows: (string | number)[][];
    totalRevenuesBs: number;
    totalRevenuesUSD: number;
    netIncomeBs: number;
    netIncomeUSD: number;
  };
  trialBalanceData?: {
    rows: {
      code: string;
      accountName: string;
      category: string;
      initialBalance2025: { debitVES: number; creditVES: number };
      movements2026: { debitVES: number; creditVES: number };
      finalBalance2026: { debitVES: number; creditVES: number };
      finalBalanceUSD: { debitUSD: number; creditUSD: number };
    }[];
    totals: {
      initialDebitVES: number;
      initialCreditVES: number;
      movementsDebitVES: number;
      movementsCreditVES: number;
      finalDebitVES: number;
      finalCreditVES: number;
      finalDebitUSD: number;
      finalCreditUSD: number;
    };
  };
  notes: { title: string; text: string }[];
}): Promise<void> {
  const {
    filename,
    companyName,
    companyRif,
    periodDate,
    exchangeRateBCV,
    balanceSheetData,
    incomeStatementData,
    trialBalanceData,
    notes
  } = params;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = companyName;
  workbook.lastModifiedBy = 'Auditoría Bancaria Banesco / C.P.C. 16.336';
  workbook.created = new Date();

  // Helper for Member header
  const addHeader = (ws: ExcelJS.Worksheet, sheetTitle: string) => {
    const r1 = ws.addRow([companyName.toUpperCase()]);
    r1.height = 24;
    ws.mergeCells(1, 1, 1, 6);
    const c1 = ws.getCell('A1');
    c1.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF000000' } };
    c1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    c1.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };

    const r2 = ws.addRow([`R.I.F.: ${companyRif} | CORTADO AL ${periodDate.toUpperCase()} | TASA BCV: ${exchangeRateBCV.toLocaleString('es-VE', { minimumFractionDigits: 2 })} Bs/USD`]);
    r2.height = 18;
    ws.mergeCells(2, 1, 2, 6);
    const c2 = ws.getCell('A2');
    c2.font = { name: 'Calibri', size: 9.5, bold: false, color: { argb: 'FF000000' } };
    c2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    c2.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };

    const r3 = ws.addRow([sheetTitle.toUpperCase()]);
    r3.height = 22;
    ws.mergeCells(3, 1, 3, 6);
    const c3 = ws.getCell('A3');
    c3.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
    c3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    c3.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };

    ws.addRow([]);
  };

  // Helper for Table Headers
  const addTableHeaders = (ws: ExcelJS.Worksheet, headers: string[]) => {
    const hRow = ws.addRow(headers);
    hRow.height = 24;
    hRow.eachCell((cell, colIndex) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: colIndex <= 2 ? 'left' : 'right', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'medium', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
      };
    });
  };

  // Helper for Rows
  const addDataRows = (ws: ExcelJS.Worksheet, rows: (string | number)[][]) => {
    rows.forEach(r => {
      const row = ws.addRow(r);
      row.height = 20;
      row.eachCell((cell, colIndex) => {
        const isHeaderOrSection = typeof r[0] === 'string' && (r[0].startsWith('---') || r[0].startsWith('ACTIVO') || r[0].startsWith('PASIVO') || r[0].startsWith('PATRIMONIO') || r[0].includes('TOTAL'));
        
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
        cell.font = { name: 'Calibri', size: 10, bold: isHeaderOrSection, color: { argb: 'FF000000' } };

        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };

        if (colIndex <= 2) {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        } else {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          if (typeof cell.value === 'number') {
            cell.numFmt = colIndex === 4 ? '"$"#,##0.00' : '#,##0.00';
          }
        }
      });
    });
  };

  const addTotalRow = (ws: ExcelJS.Worksheet, label: string, code: string, valBs: number, valUSD: number) => {
    const tRow = ws.addRow([code, label, valBs, valUSD]);
    tRow.height = 26;
    tRow.eachCell((cell, colIndex) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      cell.font = { name: 'Calibri', size: 10.5, bold: true, color: { argb: 'FF000000' } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'double', color: { argb: 'FF000000' } }
      };
      if (colIndex <= 2) {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = colIndex === 4 ? '"$"#,##0.00' : '#,##0.00';
      }
    });
  };

  // -------------------------------------------------------------
  // TAB 1: BALANCE GENERAL (ESTADO DE SITUACIÓN FINANCIERA)
  // -------------------------------------------------------------
  const ws1 = workbook.addWorksheet('Balance General 31-08-2026', { views: [{ showGridLines: true }] });
  addHeader(ws1, 'ESTADO DE SITUACIÓN FINANCIERA (BALANCE GENERAL DUAL Bs. / USD)');
  addTableHeaders(ws1, ['Código', 'Cuenta Contable / Rubro Patrimonial', 'Monto en Bolívares (Bs.)', 'Monto en Dólares (USD)']);

  // Section: Activo Corriente
  ws1.addRow(['1.1', 'ACTIVO CORRIENTE (CIRCULANTE)', '', '']);
  addDataRows(ws1, balanceSheetData.assets.current);
  addTotalRow(ws1, 'TOTAL ACTIVO CORRIENTE', '1.1.99', balanceSheetData.assets.currentTotal, balanceSheetData.assets.currentTotalUSD);

  // Section: Propiedad Planta y Equipo
  ws1.addRow([]);
  ws1.addRow(['1.2', 'PROPIEDAD, PLANTA Y EQUIPO (NO CORRIENTE)', '', '']);
  addDataRows(ws1, balanceSheetData.assets.ppe);
  addTotalRow(ws1, 'TOTAL PROPIEDAD, PLANTA Y EQUIPO NETO', '1.2.99', balanceSheetData.assets.ppeTotal, balanceSheetData.assets.ppeTotalUSD);

  // Total Activo
  ws1.addRow([]);
  addTotalRow(ws1, 'TOTAL ACTIVO', '1.0.00', balanceSheetData.assets.totalAssets, balanceSheetData.assets.totalAssetsUSD);

  // Section: Pasivo Corriente
  ws1.addRow([]);
  ws1.addRow(['2.1', 'PASIVO CORRIENTE (CIRCULANTE)', '', '']);
  addDataRows(ws1, balanceSheetData.liabilities.current);
  addTotalRow(ws1, 'TOTAL PASIVO CORRIENTE', '2.1.99', balanceSheetData.liabilities.currentTotal, balanceSheetData.liabilities.currentTotalUSD);

  // Total Pasivo
  ws1.addRow([]);
  addTotalRow(ws1, 'TOTAL PASIVO', '2.0.00', balanceSheetData.liabilities.totalLiabilities, balanceSheetData.liabilities.totalLiabilitiesUSD);

  // Section: Patrimonio Neto
  ws1.addRow([]);
  ws1.addRow(['3.1', 'PATRIMONIO NETO', '', '']);
  addDataRows(ws1, balanceSheetData.equity.items);
  addTotalRow(ws1, 'TOTAL PATRIMONIO NETO', '3.1.99', balanceSheetData.equity.totalEquity, balanceSheetData.equity.totalEquityUSD);

  // Total Pasivo + Patrimonio
  ws1.addRow([]);
  addTotalRow(ws1, 'TOTAL PASIVO Y PATRIMONIO NETO', '3.0.00', balanceSheetData.totalLiabilitiesAndEquity, balanceSheetData.totalLiabilitiesAndEquityUSD);

  // Signatures on Sheet 1
  ws1.addRow([]);
  ws1.addRow(['CERTIFICACIÓN LEGAL Y TÉCNICA CONTABLE (VEN-NIF / BANESCO)']);
  const s1 = ws1.addRow(['____________________________________________', '', '', '____________________________________________']);
  s1.getCell(1).alignment = { horizontal: 'center' };
  s1.getCell(4).alignment = { horizontal: 'center' };
  const s2 = ws1.addRow(['Elias Rafael Trías Abreu', '', '', 'Licdo. Omar Pérez Castillo']);
  s2.getCell(1).font = { bold: true };
  s2.getCell(4).font = { bold: true };
  s2.getCell(1).alignment = { horizontal: 'center' };
  s2.getCell(4).alignment = { horizontal: 'center' };
  const s3 = ws1.addRow(['Presidente / Propietario - AGRÍCOLA ONI, C.A.', '', '', 'Contador Público Independiente, VEN-NIF (C.P.C. 16.336)']);
  s3.getCell(1).alignment = { horizontal: 'center' };
  s3.getCell(4).alignment = { horizontal: 'center' };

  ws1.getColumn(1).width = 14;
  ws1.getColumn(2).width = 52;
  ws1.getColumn(3).width = 32;
  ws1.getColumn(4).width = 28;

  // -------------------------------------------------------------
  // TAB 2: ESTADO DE GANANCIAS Y PÉRDIDAS (ESTADO DE RESULTADO INTEGRAL)
  // -------------------------------------------------------------
  const ws2 = workbook.addWorksheet('Ganancias y Perdidas 2026', { views: [{ showGridLines: true }] });
  addHeader(ws2, 'ESTADO DE RESULTADO INTEGRAL (GANANCIAS Y PÉRDIDAS DUAL Bs. / USD)');
  addTableHeaders(ws2, ['Código', 'Concepto / Cuenta de Ingresos y Gastos', 'Monto en Bolívares (Bs.)', 'Monto en Dólares (USD)']);
  addDataRows(ws2, incomeStatementData.rows);
  addTotalRow(ws2, 'UTILIDAD NETA DEL EJERCICIO (01/01/2026 AL 31/08/2026)', '5.0.00', incomeStatementData.netIncomeBs, incomeStatementData.netIncomeUSD);

  ws2.addRow([]);
  ws2.addRow(['CERTIFICACIÓN LEGAL Y TÉCNICA CONTABLE']);
  const s2_1 = ws2.addRow(['____________________________________________', '', '', '____________________________________________']);
  s2_1.getCell(1).alignment = { horizontal: 'center' };
  s2_1.getCell(4).alignment = { horizontal: 'center' };
  const s2_2 = ws2.addRow(['Elias Rafael Trías Abreu (Presidente)', '', '', 'Licdo. Omar Pérez Castillo (C.P.C. 16.336)']);
  s2_2.getCell(1).font = { bold: true };
  s2_2.getCell(4).font = { bold: true };
  s2_2.getCell(1).alignment = { horizontal: 'center' };
  s2_2.getCell(4).alignment = { horizontal: 'center' };
  const s2_3 = ws2.addRow(['Presidente / Propietario', '', '', 'Contador Público Independiente, VEN-NIF']);
  s2_3.getCell(1).alignment = { horizontal: 'center' };
  s2_3.getCell(4).alignment = { horizontal: 'center' };

  ws2.getColumn(1).width = 14;
  ws2.getColumn(2).width = 52;
  ws2.getColumn(3).width = 32;
  ws2.getColumn(4).width = 28;

  // -------------------------------------------------------------
  // TAB 3: BALANCE DE COMPROBACIÓN 31-08-2026 (SALDOS Y MOVIMIENTOS)
  // -------------------------------------------------------------
  if (trialBalanceData) {
    const wsTb = workbook.addWorksheet('Balance Comprobacion 2026', { views: [{ showGridLines: true }] });
    addHeader(wsTb, 'BALANCE DE COMPROBACIÓN DE SALDOS Y MOVIMIENTOS (AL 31/08/2026)');

    // Table Header Row 1 (Groupings)
    const gHeader = wsTb.addRow([
      'Código',
      'Nombre de la Cuenta Contable',
      'Cat.',
      'SALDO INICIAL AL 31/12/2025 (Bs.)', '',
      'MOVIMIENTOS ACUMULADOS 2026 (Bs.)', '',
      'SALDO FINAL AL 31/08/2026 (Bs.)', '',
      'SALDO EQUIVALENTE USD (31/08/2026)', ''
    ]);
    gHeader.height = 22;
    wsTb.mergeCells(gHeader.number, 4, gHeader.number, 5);
    wsTb.mergeCells(gHeader.number, 6, gHeader.number, 7);
    wsTb.mergeCells(gHeader.number, 8, gHeader.number, 9);
    wsTb.mergeCells(gHeader.number, 10, gHeader.number, 11);

    gHeader.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });

    // Sub Header Row 2
    const subHeader = wsTb.addRow([
      '', '', '',
      'Débito (Bs.)', 'Crédito (Bs.)',
      'Debe (Bs.)', 'Haber (Bs.)',
      'Débito (Bs.)', 'Crédito (Bs.)',
      'Débito ($)', 'Crédito ($)'
    ]);
    subHeader.height = 20;
    subHeader.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      cell.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        bottom: { style: 'medium', color: { argb: 'FF000000' } }
      };
    });

    // Add rows
    trialBalanceData.rows.forEach(r => {
      const row = wsTb.addRow([
        r.code,
        r.accountName,
        r.category,
        r.initialBalance2025.debitVES,
        r.initialBalance2025.creditVES,
        r.movements2026.debitVES,
        r.movements2026.creditVES,
        r.finalBalance2026.debitVES,
        r.finalBalance2026.creditVES,
        r.finalBalanceUSD.debitUSD,
        r.finalBalanceUSD.creditUSD
      ]);
      row.height = 19;
      row.eachCell((cell, colIndex) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
        cell.font = { name: 'Calibri', size: 9.5, color: { argb: 'FF000000' } };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
        if (colIndex === 1 || colIndex === 3) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        } else if (colIndex === 2) {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        } else {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          if (typeof cell.value === 'number') {
            cell.numFmt = colIndex >= 10 ? '"$"#,##0.00' : '#,##0.00';
          }
        }
      });
    });

    // Totals Row
    const tTb = wsTb.addRow([
      'TOTAL',
      'TOTAL BALANCE DE COMPROBACIÓN Y MOVIMIENTOS',
      '100%',
      trialBalanceData.totals.initialDebitVES,
      trialBalanceData.totals.initialCreditVES,
      trialBalanceData.totals.movementsDebitVES,
      trialBalanceData.totals.movementsCreditVES,
      trialBalanceData.totals.finalDebitVES,
      trialBalanceData.totals.finalCreditVES,
      trialBalanceData.totals.finalDebitUSD,
      trialBalanceData.totals.finalCreditUSD
    ]);
    tTb.height = 24;
    tTb.eachCell((cell, colIndex) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
      cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF000000' } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'double', color: { argb: 'FF000000' } }
      };
      if (colIndex <= 3) {
        cell.alignment = { horizontal: colIndex === 2 ? 'left' : 'center', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = colIndex >= 10 ? '"$"#,##0.00' : '#,##0.00';
      }
    });

    wsTb.getColumn(1).width = 12;
    wsTb.getColumn(2).width = 45;
    wsTb.getColumn(3).width = 12;
    wsTb.getColumn(4).width = 20;
    wsTb.getColumn(5).width = 20;
    wsTb.getColumn(6).width = 22;
    wsTb.getColumn(7).width = 22;
    wsTb.getColumn(8).width = 22;
    wsTb.getColumn(9).width = 22;
    wsTb.getColumn(10).width = 18;
    wsTb.getColumn(11).width = 18;
  }

  // -------------------------------------------------------------
  // TAB 4: NOTAS REVELATORIAS EXPLICATIVAS (ANEXO BANESCO / VEN-NIF)
  // -------------------------------------------------------------
  const ws3 = workbook.addWorksheet('Notas a EEFF & Banco', { views: [{ showGridLines: true }] });
  addHeader(ws3, 'NOTAS EXPLICATIVAS REVELATORIAS A LOS ESTADOS FINANCIEROS (VEN-NIF GE)');


  notes.forEach((note, idx) => {
    const nHead = ws3.addRow([`NOTA ${idx + 1}: ${note.title.toUpperCase()}`]);
    nHead.height = 22;
    ws3.mergeCells(nHead.number, 1, nHead.number, 4);
    nHead.getCell(1).font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
    nHead.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };

    const nTxt = ws3.addRow([note.text]);
    nTxt.height = 42;
    ws3.mergeCells(nTxt.number, 1, nTxt.number, 4);
    nTxt.getCell(1).font = { name: 'Calibri', size: 10, color: { argb: 'FF000000' } };
    nTxt.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    nTxt.getCell(1).alignment = { wrapText: true, vertical: 'top' };

    ws3.addRow([]);
  });

  ws3.getColumn(1).width = 18;
  ws3.getColumn(2).width = 40;
  ws3.getColumn(3).width = 30;
  ws3.getColumn(4).width = 30;

  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const safeFilename = filename.toLowerCase().endsWith('.xlsx')
    ? filename
    : `${filename}.xlsx`;

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
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    }, 3000);
  } catch (err) {
    console.error('Error al descargar blob vía ObjectURL, intentando DataURI:', err);
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64data = reader.result as string;
      const a = document.createElement('a');
      a.href = base64data;
      a.download = filename;
      a.target = '_blank';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
      }, 3000);
    };
    reader.readAsDataURL(blob);
  }
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
