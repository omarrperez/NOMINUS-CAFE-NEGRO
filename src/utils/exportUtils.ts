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
import { CompanyProfile, BcvRateItem } from '../data/nominusData';
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

/**
 * Genera y descarga el Expediente Maestro Completo de Cumplimiento Banesco en un solo PDF descargable (.pdf).
 * Incluye:
 * 1. Portada e Índice de la Carpeta.
 * 2. Carta Número 1 (Carta Formal de Respuesta Completa).
 * 3. Anexo a Carta 1: Cuadro Explicativo de Categorización de Depósitos ($2.912.368,95 USD / Bs. 1.966,60M).
 * 4. Carta Número 2 (Resumen Ejecutivo de 1 Página).
 * 5. Separador A: Carta Explicativa + Nota de Conciliación Bancaria (Diferencia Bs. 0,00) + Fundamentación NIIF 15.
 * 6. Separador B: Respaldo de Anticipos de Clientes Jurídicos (6 Contratos Marco, Asientos NIIF 15 Pasivo Corriente).
 * 7. Separador C: Respaldo de Anticipos de Personas Naturales y Productores (Acopio en Barcelona/Lechería).
 * 8. Separador D: Adquisición de Divisas Mesa Cambiaria Banesco y Uso de Fondos ($556.890,45 USD en Insumos 100% en Venezuela).
 * 9. Separador E: Registro Legal, Acta Constitutiva (2021) y Estados Financieros al 31/08/2026:
 *    - Balance General (Estado de Situación Financiera Dual Bs. / USD)
 *    - Estado de Ganancias y Pérdidas (Estado de Resultado Integral Dual Bs. / USD)
 *    - Balance de Comprobación de Saldos y Movimientos Completo (Todas las cuentas contables)
 *    - Notas Revelatorias VEN-NIF
 *    - Firmas del Representante Legal Sr. Elias Rafael Trías Abreu.
 */
export async function exportMasterBanescoComplianceFolderPdf(params?: {
  filename?: string;
  companyName?: string;
  companyRif?: string;
  address?: string;
  dateStr?: string;
  bcvRate?: number;
  accountVES?: string;
  accountUSD?: string;
}): Promise<void> {
  const filename = params?.filename || 'Expediente_Completo_Carpeta_Cumplimiento_Banesco_2026_Agricola_Oni.pdf';
  const companyName = params?.companyName || 'AGRÍCOLA ONI, C.A.';
  const companyRif = params?.companyRif || 'J-50145638-0';
  const address = params?.address || 'Calle Las Flores, Quinta Blanquita, Local 2, Crucero de Lechería, Barcelona, Estado Anzoátegui.';
  const dateStr = params?.dateStr || 'Barcelona, 31 de Agosto de 2026';
  const bcvRate = params?.bcvRate || 798.33;
  const accountVES = params?.accountVES || '0134-0342-18-3421089912';
  const accountUSD = params?.accountUSD || '0134-0342-12-3420084712';

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'letter'
  });

  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const margin = 12;

  const drawHeader = (title: string, categoryBadge?: string) => {
    doc.setFillColor(255, 255, 255);
    doc.setTextColor(0, 0, 0);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(companyName.toUpperCase(), margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`R.I.F.: ${companyRif} | ${address}`, margin, 16);
    doc.text(`LUGAR Y FECHA: ${dateStr.toUpperCase()} | TASA OFICIAL BCV: Bs. ${bcvRate.toLocaleString('es-VE', { minimumFractionDigits: 2 })} / USD`, margin, 19.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(title.toUpperCase(), margin, 24.5);

    if (categoryBadge) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(`[${categoryBadge.toUpperCase()}]`, pageWidth - margin, 24.5, { align: 'right' });
    }

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.35);
    doc.line(margin, 26, pageWidth - margin, 26);
  };

  const drawSignature = (startY: number) => {
    let y = startY;
    if (y > pageHeight - 35) {
      doc.addPage('letter', 'p');
      drawHeader('CERTIFICACIÓN Y FIRMA DEL REPRESENTANTE LEGAL');
      y = 32;
    } else {
      y += 8;
    }

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 - 35, y + 10, pageWidth / 2 + 35, y + 10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text('Elias Rafael Trías Abreu', pageWidth / 2, y + 14, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('C.I. V-23.997.829 · Presidente / Propietario', pageWidth / 2, y + 17.5, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, pageWidth / 2, y + 21, { align: 'center' });
  };

  // =========================================================================
  // PÁGINA 1: PORTADA E ÍNDICE OFICIAL DE LA CARPETA DE CUMPLIMIENTO
  // =========================================================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(companyName, margin, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`R.I.F.: ${companyRif} · ${address}`, margin, 25);
  doc.text(`Lugar y Fecha de Emisión: ${dateStr} · Tasa BCV: Bs. ${bcvRate.toLocaleString('es-VE', { minimumFractionDigits: 2 })} / USD`, margin, 29);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, 32, pageWidth - margin, 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('EXPEDIENTE MAESTRO DE CUMPLIMIENTO BANCARIO Y RESPONSABILIDAD FISCAL', margin, 42);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.text('BANESCO BANCO UNIVERSAL, C.A. · UNIDAD DE PREVENCIÓN Y CUMPLIMIENTO (UPCLC)', margin, 47);

  // Cuadro de Resumen Ejecutivo
  autoTable(doc, {
    startY: 52,
    margin: { left: margin, right: margin },
    head: [['CONCEPTO / INDICADOR AUDITADO', 'MONTO EN BOLÍVARES (Bs.)', 'EQUIVALENTE USD ($)', 'OBSERVACIÓN TÉCNICA']],
    body: [
      ['Créditos Bancarios Banesco Categorizados', 'Bs. 1.966.597.105,35', '$2.912.368,95 USD', '100% Conciliado y Categorizado por Rubros'],
      ['Ventas Reales Declaradas en EEFF (01/01 al 31/08/2026)', 'Bs. 92.641.520,01', '$116.531,68 USD', 'Servicios Agrícolas + Intereses Ganados Mutuo'],
      ['Pasivos Corrientes por Anticipos de Clientes (NIIF 15)', 'Bs. 1.542.017.092,63', '$2.270.486,23 USD', 'Pasivo Exigible. Factura en Octubre 2026'],
      ['Reintegros Mutuo Manuel Becerra (Amortización Capital)', 'Bs. 186.376.000,00', '$286.228,93 USD', 'Disminución Activo Financiero. No es Venta'],
      ['Traspasos Internos Cuentas Propias RIF J-50145638-0', 'Bs. 208.708.057,73', '$308.317,80 USD', 'Tesorería Provincial/Mercantil/Plaza/Bancamiga'],
      ['Aportes Operativos Socio Accionista / Personas Naturales', 'Bs. 29.495.954,99', '$47.335,99 USD', 'Inyección Liquidez Presidente Sr. Elias Trías'],
      ['DIFERENCIA SIN JUSTIFICAR POR OMISIÓN DE INGRESOS', 'Bs. 0,00', '$0,00 USD', 'CUADRE MATEMÁTICO 100% PERFECTO']
    ],
    theme: 'plain',
    styles: { fontSize: 7.5, cellPadding: 2.5, font: 'helvetica', lineColor: [200, 200, 200], lineWidth: 0.15 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.3 },
    columnStyles: {
      0: { halign: 'left', cellWidth: 65 },
      1: { halign: 'right', cellWidth: 38 },
      2: { halign: 'right', cellWidth: 32 },
      3: { halign: 'left', cellWidth: 56.9 }
    }
  });

  const lastIndexY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 120;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ESTRUCTURA DEL EXPEDIENTE Y SEPARADORES ADJUNTOS:', margin, lastIndexY + 8);

  autoTable(doc, {
    startY: lastIndexY + 11,
    margin: { left: margin, right: margin },
    head: [['SEPARADOR', 'CONTENIDO DOCUMENTAL Y SOPORTES CONSIGNADOS', 'UBICACIÓN EN CARPETA']],
    body: [
      ['SEPARADOR A', 'Carta 1 Resumen (1 Pág) + Anexo $2.912,36M + Informe Contable Extenso (Soporte) + Conciliación Bs. 0,00', 'Sección A (Inicial)'],
      ['SEPARADOR B', 'Respaldo de Anticipos Clientes Jurídicos (Bs. 1.542,02M / $2.270.486,23 USD, 6 Contratos Marco, Asientos Contables)', 'Sección B'],
      ['SEPARADOR C', 'Respaldo de Anticipos Personas Naturales y Productores (Bs. 29,50M, Recibos Taquilla Lechería/Barcelona)', 'Sección C'],
      ['SEPARADOR D', 'Adquisición de Divisas Mesa Cambiaria y Uso de Fondos ($556.890,45 USD en Insumos 100% en Venezuela)', 'Sección D'],
      ['SEPARADOR E', 'Registro Legal, Acta Constitutiva (2021) y EEFF al 31/08/2026 (Balance General, Resultados y Comprobación)', 'Sección E']
    ],
    theme: 'plain',
    styles: { fontSize: 7.5, cellPadding: 2.5, font: 'helvetica', lineColor: [200, 200, 200], lineWidth: 0.15 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.3 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 28 },
      1: { halign: 'left', cellWidth: 125 },
      2: { halign: 'center', cellWidth: 38.9 }
    }
  });

  drawSignature(235);

  // =========================================================================
  // PÁGINA 2: CARTA NÚMERO 1: CARTA DE RESPUESTA PRINCIPAL (RESUMEN EJECUTIVO 1 PÁGINA EXACTA)
  // =========================================================================
  doc.addPage('letter', 'p');
  drawHeader('CARTA NÚMERO 1: CARTA DE RESPUESTA PRINCIPAL A BANESCO', 'DOCUMENTO PRINCIPAL - 1 PÁGINA');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('CIUDADANOS:', margin, 31);
  doc.text('BANESCO BANCO UNIVERSAL, C.A.', margin, 35);
  doc.setFont('helvetica', 'normal');
  doc.text('Gerencia de Auditoría Interna y Unidad de Prevención y Control LC/FT (UPCLC/FT)', margin, 39);
  doc.setFont('helvetica', 'bold');
  doc.text('Atención: Gerencia Senior de Cumplimiento Banesco Banco Universal', margin, 43);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const subjectShort = doc.splitTextToSize(`ASUNTO: CARTA DE RESPUESTA FORMAL Y SÍNTESIS DE AUDITORÍA BANCARIA — JUSTIFICACIÓN DE FONDOS MOVILIZADOS ($2.912.368,95 USD / Bs. 1.966.597.105,35) VS ESTADOS FINANCIEROS (CTA. VES N° ${accountVES} Y CTA. USD N° ${accountUSD})`, pageWidth - margin * 2);
  doc.text(subjectShort, margin, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const letter1PageBody = `En representación legal de AGRÍCOLA ONI, C.A. (RIF ${companyRif}), nos dirigimos a ustedes a fin de dar formal respuesta informando que NO EXISTE OMISIÓN DE INGRESOS NI DIFERENCIA NO JUSTIFICADA. Nuestra empresa opera exclusivamente como INTERMEDIARIA COMERCIAL Y MANDANTE EN LA COMPRA DE CAFÉ VERDE 100% NACIONAL EN VENEZUELA para torrefactoras e industrias venezolanas. No importamos café de Colombia ni de ningún país del exterior; todo el café se adquiere en el mercado nacional a tipo de cambio oficial publicado por el Banco Central de Venezuela (BCV).

La movilización bancaria acumulada de créditos en Banesco por $2.912.368,95 USD equivalentes (Bs. 1.966.597.105,35) se concilia al 100% frente a las Ventas Reales Declaradas en el Estado de Resultados al 31/08/2026 (Bs. 92.641.520,01 / $116.531,68 USD) mediante la siguiente estructura contable:

1. Anticipos de Clientes Jurídicos en Bolívares (78,4% — Bs. 1.542.017.092,63 / $2.270.486,23 USD): Fondos recibidos bajo Contrato Marco de Intermediación. Registrados como Pasivos Corrientes Exigibles bajo NIIF 15 / Sección 23. Se sustituyen por factura fiscal SENIAT en Octubre 2026 con la entrega física del café.
2. Reintegros Capital Mutuo Manuel Becerra (9,5% — Bs. 186.376.000,00 / $286.228,93 USD): Amortización de Activo Financiero de la Línea de Crédito Rotativa. Disminuyen la Cuenta por Cobrar. No constituye ingreso.
3. Transferencias Cuentas Propias Agrícola Oni (10,6% — Bs. 208.708.057,73 / $308.317,80 USD): Traspasos de tesorería interna desde Provincial, Mercantil, Plaza y Bancamiga mismo RIF J-50145638-0. Impacto patrimonial neto: Bs. 0,00.
4. Aportes Operativos Accionista / Personas Naturales (1,5% — Bs. 29.495.954,99 / $47.335,99 USD): Inyecciones de liquidez Presidente Sr. Elias Rafael Trías Abreu y anticipos de compradores personas naturales.
5. Ingresos Reales Declarados en EEFF (Bs. 92.641.520,01 / $116.531,68 USD): Servicios Agrícolas facturados ($78,72M) + Intereses Ganados Mutuo ($13,92M), 100% idéntico a EEFF.
6. Operaciones en Mesa Cambiaria Banesco ($556.890,45 USD): Divisas liquidadas e invertidas 100% en Venezuela en insumos agrícolas, fletes terrestres y servicios técnicos en territorio nacional.

DIFERENCIA FINAL POR OMISIÓN DE INGRESOS: BS. 0,00 ($0,00 USD). CUADRE MATEMÁTICO 100% PERFECTO.`;

  const splitL1P = doc.splitTextToSize(letter1PageBody, pageWidth - margin * 2);
  doc.text(splitL1P, margin, 58);

  drawSignature(180);

  // =========================================================================
  // PÁGINA 3: ANEXO A CARTA 1 - CUADRO EXPLICATIVO DE CATEGORIZACIÓN ($2.912.368,95 USD)
  // =========================================================================
  doc.addPage('letter', 'p');
  drawHeader('ANEXO A CARTA 1: CUADRO EXPLICATIVO DE CATEGORIZACIÓN DE FONDOS', 'DETALLE $2.912.368,95 USD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CONCATENACIÓN BANCARIA Y CATEGORIZACIÓN DE DEPÓSITOS EXIGIDOS POR BANESCO', margin, 31);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('A continuación se presenta la desagregación exacta del total de créditos movilizados en Banesco ($2.912.368,95 USD equivalentes / Bs. 1.966.597.105,35), demostrando matemática y contablemente la inexistencia de omisión de ingresos:', margin, 35);

  autoTable(doc, {
    startY: 40,
    margin: { left: margin, right: margin },
    head: [['N°', 'Categoría / Concepto Contable', 'Monto Banesco (Bs.)', 'Monto USD ($)', '% Banco', 'Tratamiento Contable (NIIF) y Fiscal (SENIAT)']],
    body: [
      ['1', 'Anticipos en Bolívares de Clientes (Procura Café)', 'Bs. 1.542.017.092,63', '$2.270.486,23', '78,4%', 'Pasivo Corriente (NIIF 15). Anticipos de torrefactoras a tasa BCV. Emisión de factura fiscal en Octubre 2026.'],
      ['2', 'Reintegros Capital Mutuo Manuel Becerra', 'Bs. 186.376.000,00', '$286.228,93', '9,5%', 'Amortización de Activo Financiero (Línea Bs. 600M). Disminuye Cta x Cobrar. No es venta.'],
      ['3', 'Transferencias Cuentas Propias Agrícola Oni', 'Bs. 208.708.057,73', '$308.317,80', '10,6%', 'Traspasos internos de tesorería (Provincial, Mercantil, Plaza, Bancamiga). Impacto neto: Bs. 0,00.'],
      ['4', 'Aportes Operativos Socio / Personas Naturales', 'Bs. 29.495.954,99', '$47.335,99', '1,5%', 'Liquidez Presidente Sr. Elias Rafael Trías Abreu y anticipos de compradores personas naturales.'],
      ['5', 'Ingresos Reales Declarados en EEFF (01/01 al 31/08/2026)', 'Bs. 92.641.520,01', '$116.531,68', '—', 'Servicios Agrícolas facturados ($78,72M) + Intereses Mutuo ($13,92M). 100% idéntico a EEFF.']
    ],
    foot: [
      ['', 'TOTAL CRÉDITOS CATEGORIZADOS EN BANESCO', 'Bs. 1.966.597.105,35', '$2.912.368,95', '100,0%', 'CUADRE MATEMÁTICO PERFECTO. DIFERENCIA SIN JUSTIFICAR: BS. 0,00 ($0,00 USD).']
    ],
    theme: 'plain',
    styles: { fontSize: 7.2, cellPadding: 2.2, font: 'helvetica', lineColor: [200, 200, 200], lineWidth: 0.15 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.3 },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.35 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'left', cellWidth: 52 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 28 },
      4: { halign: 'center', cellWidth: 15 },
      5: { halign: 'left', cellWidth: 53.9 }
    }
  });

  const categoryTableY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 120;

  drawSignature(categoryTableY + 5);

  // =========================================================================
  // PÁGINA 4 Y 5: SEPARADOR A - INFORME CONTABLE DE RESPUESTA EXTENSA Y NOTA DE CONCILIACIÓN
  // =========================================================================
  doc.addPage('letter', 'p');
  drawHeader('SEPARADOR A: INFORME CONTABLE DE SUSTENTACIÓN DETALLADO Y CONCILIACIÓN', 'SEPARADOR A - SOPORTE CONTABLE');

  let letterY = 31;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SEPARADOR A: INFORME CONTABLE COMPLETO DE RESPUESTA A AUDITORÍA BANESCO', margin, letterY);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('DOCUMENTO DE RESPALDO Y SUSTENTACIÓN CONTABLE-FISCAL - EXPOSICIÓN DE MOTIVOS DETALLADA', margin, letterY + 4);

  letterY += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  const subjectText = doc.splitTextToSize(`ASUNTO: INFORME TÉCNICO CONTABLE DE SUSTENTACIÓN — DESARROLLO NORMATIVO VEN-NIF, LEY ISLR, SENIAT Y CÓDIGO DE COMERCIO (CUENTAS CORRIENTES N° ${accountVES} EN VES Y N° ${accountUSD} EN USD)`, pageWidth - margin * 2);
  doc.text(subjectText, margin, letterY);

  letterY += subjectText.length * 3.5 + 3;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  const p1 = `El presente informe contable constituye el soporte técnico integral para la Unidad de Cumplimiento de Banesco Banco Universal, sustentando en detalle el tratamiento contable y tributario de las operaciones de AGRÍCOLA ONI, C.A. (R.I.F. ${companyRif}) al 31 de Agosto de 2026.`;
  const splitP1 = doc.splitTextToSize(p1, pageWidth - margin * 2);
  doc.text(splitP1, margin, letterY);
  letterY += splitP1.length * 3.5 + 3;

  doc.setFont('helvetica', 'bold');
  doc.text('1. DECLARACIÓN CATEGÓRICA DE OPERACIONES 100% NACIONALES EN VENEZUELA:', margin, letterY);
  letterY += 4;
  doc.setFont('helvetica', 'normal');
  const p2 = `AGRÍCOLA ONI, C.A. actúa exclusivamente como empresa INTERMEDIARIA COMERCIAL EN VENEZUELA. Nuestra actividad consiste en intermediar entre personas naturales y jurídicas, sirviendo de puente mercantil para gestionar la compra, acopio y comercialización de café 100% NACIONAL a productores, asociaciones y empresas venezolanas. NUESTRA EMPRESA NO IMPORTA NADA DE COLOMBIA NI DE NINGUNA ENTIDAD DEL EXTERIOR; TODO EL CAFÉ SE COMPRA EN VENEZUELA a tipo de cambio oficial publicado por el Banco Central de Venezuela (BCV).`;
  const splitP2 = doc.splitTextToSize(p2, pageWidth - margin * 2);
  doc.text(splitP2, margin, letterY);
  letterY += splitP2.length * 3.5 + 3;

  doc.setFont('helvetica', 'bold');
  doc.text('2. DEMOSTRACIÓN TÉCNICA DEL CUADRE CONTABLE (DIFERENCIA BS. 0,00):', margin, letterY);
  letterY += 4;
  doc.setFont('helvetica', 'normal');
  const p3 = `Certificamos que NO EXISTE OMISIÓN DE INGRESOS NI DISPARIDAD TRIBUTARIA. La movilización bancaria acumulada de créditos por $2.912.368,95 USD equivalentes (Bs. 1.966.597.105,35) se concilia al 100% frente a las Ventas Declaradas en el Estado de Resultados (Bs. 92.641.520,01 / $116.531,68 USD) mediante el siguiente desglose auditado:`;
  const splitP3 = doc.splitTextToSize(p3, pageWidth - margin * 2);
  doc.text(splitP3, margin, letterY);
  letterY += splitP3.length * 3.5 + 3;

  const points = [
    `a) Anticipos en Bolívares de Clientes (78,4% - Bs. 1.542.017.092,63 / $2.270.486,23 USD): Pasivo Corriente bajo NIIF 15 / Sección 23 NIIF PYMES. Corresponden a anticipos de empresas y torrefactoras nacionales a tasa oficial BCV. En OCTUBRE DE 2026, con la entrega de la cosecha, estos anticipos se sustituyen por Facturas Fiscales Definitivas de Venta SENIAT contra las cuales se eliminan de la contabilidad.`,
    `b) Reintegros Capital Mutuo Manuel Becerra (9,5% - Bs. 186.376.000,00 / $286.228,93 USD): Amortización de Activo Financiero de la Línea de Crédito Rotativa suscrita el 02/01/2026. Disminuyen la Cuenta por Cobrar. No es venta.`,
    `c) Transferencias Cuentas Propias (10,6% - Bs. 208.708.057,73 / $308.317,80 USD): Traspasos internos desde Provincial, Mercantil, Plaza y Bancamiga mismo titular RIF J-50145638-0. Impacto patrimonial neto: Bs. 0,00.`,
    `d) Aportes Operativos Socio Accionista / Personas Naturales (1,5% - Bs. 29.495.954,99 / $47.335,99 USD): Inyecciones de liquidez Presidente Sr. Elias Rafael Trías Abreu (C.I. V-23.997.829) y anticipos de compradores personas naturales.`,
    `e) Ingresos Reales Declarados en EEFF (Bs. 92.641.520,01 / $116.531,68 USD): Servicios Agrícolas facturados ($78,72M) + Intereses Mutuo ($13,92M), 100% idéntico a EEFF.`
  ];

  points.forEach(pt => {
    if (letterY > pageHeight - 30) {
      doc.addPage('letter', 'p');
      drawHeader('SEPARADOR A: INFORME CONTABLE DE SUSTENTACIÓN (CONTINUACIÓN)', 'SEPARADOR A');
      letterY = 31;
    }
    const splitPt = doc.splitTextToSize(pt, pageWidth - margin * 2);
    doc.text(splitPt, margin, letterY);
    letterY += splitPt.length * 3.5 + 2;
  });

  if (letterY > pageHeight - 45) {
    doc.addPage('letter', 'p');
    drawHeader('SEPARADOR A: INFORME CONTABLE DE SUSTENTACIÓN (CONTINUACIÓN)', 'SEPARADOR A');
    letterY = 31;
  }

  doc.setFont('helvetica', 'bold');
  doc.text('3. FUNDAMENTACIÓN JURÍDICO-FISCAL (SENIAT, SUDEBAN, BCV, CÓDIGO DE COMERCIO):', margin, letterY + 2);
  letterY += 6;
  doc.setFont('helvetica', 'normal');
  const legalP = `- Ley de ISLR (Arts. 1, 5 y 16): Principio de disponibilidad sobre bases devengadas o causadas. Los anticipos constituyen pasivos exigibles de la empresa intermediaria, no hecho imponible sino hasta la entrega definitiva del producto.
- Providencia SENIAT N° SNAT/2011/00071: La obligación de facturación surge con la entrega de los bienes en Octubre de 2026.
- Objeto Social Constitutivo (Registro Mercantil 2021, Tomo 44-A, N° 12, RIF J-50145638-0): Autoriza expresamente la intermediación comercial y compra de café nacional.
- Propiedad Accionaria Única: Pertenece 100% a ELÍAS RAFAEL TRÍAS ABREU (C.I. V-23.997.829), garantizando total transparencia patrimonial.`;
  const splitLegal = doc.splitTextToSize(legalP, pageWidth - margin * 2);
  doc.text(splitLegal, margin, letterY);
  letterY += splitLegal.length * 3.5 + 4;

  drawSignature(letterY);

  // NOTA DE CONCILIACIÓN BANCARIA EN SEPARADOR A
  doc.addPage('letter', 'p');
  drawHeader('SEPARADOR A: NOTA DE CONCILIACIÓN BANCARIA CERTIFICADA AL 31/08/2026', 'SEPARADOR A');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('NOTA DE CONCILIACIÓN BANCARIA CERTIFICADA — CUENTA BANESCO N° 0134-0342-18-3421089912', margin, 35);

  autoTable(doc, {
    startY: 42,
    margin: { left: margin, right: margin },
    head: [['CONCEPTO DE CONCILIACIÓN BANCARIA BANESCO (AL 31/08/2026)', 'MONTO EN BOLÍVARES (Bs.)', 'EQUIVALENTE USD ($)']],
    body: [
      ['Saldo según Estado de Cuenta Banesco N° 0134-0342-18-3421089912', 'Bs. 4.892.150,80', '$6.153,73'],
      ['Partidas Conciliatorias en Tránsito / Cheques Pendientes', 'Bs. 0,00', '$0,00'],
      ['Saldo Conciliado según Libros de Contabilidad (Agrícola Oni C.A.)', 'Bs. 4.892.150,80', '$6.153,73'],
      ['DIFERENCIA DE CONCILIACIÓN BANCARIA', 'Bs. 0,00', '$0,00']
    ],
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 3, font: 'helvetica', lineColor: [200, 200, 200], lineWidth: 0.15 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.3 },
    columnStyles: {
      0: { halign: 'left', cellWidth: 105 },
      1: { halign: 'right', cellWidth: 45 },
      2: { halign: 'right', cellWidth: 41.9 }
    }
  });

  drawSignature(125);

  // =========================================================================
  // PÁGINA 7 Y 8: SEPARADOR B - RESPALDO DE ANTICIPOS DE CLIENTES JURÍDICOS
  // =========================================================================
  doc.addPage('letter', 'p');
  drawHeader('SEPARADOR B: RESPALDO DE ANTICIPOS DE CLIENTES JURÍDICOS (NIIF 15 / PASIVO CORRIENTE)', 'SEPARADOR B');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DETALLE DE CONTRATOS MARCO Y ANTICIPOS RECIBIDOS EN BANESCO (Bs. 1.542.017.092,63)', margin, 32);

  autoTable(doc, {
    startY: 37,
    margin: { left: margin, right: margin },
    head: [['N°', 'Cliente Jurídico Torrefactor', 'RIF SENIAT', 'N° Contrato', 'Monto en Bolívares (Bs.)', 'Monto USD ($)', '% Total']],
    body: [
      ['1', 'Empresa ETN, C.A.', 'J-31048291-0', 'CTO-2026-01', 'Bs. 385.420.000,00', '$567.820,00', '25,0%'],
      ['2', 'Distribuidora DIS, C.A.', 'J-40192834-5', 'CTO-2026-02', 'Bs. 312.180.000,00', '$459.900,00', '20,2%'],
      ['3', 'Grupo ORU, C.A.', 'J-29837412-8', 'CTO-2026-03', 'Bs. 289.650.000,00', '$426.700,00', '18,8%'],
      ['4', 'Comercializadora RIK, C.A.', 'J-40912837-1', 'CTO-2026-04', 'Bs. 245.300.000,00', '$361.380,00', '15,9%'],
      ['5', 'Inversiones Solbtr, C.A.', 'J-50012938-2', 'CTO-2026-05', 'Bs. 180.120.000,00', '$265.360,00', '11,7%'],
      ['6', 'Corp. Agroindustrial J, C.A.', 'J-31928374-9', 'CTO-2026-06', 'Bs. 129.347.092,63', '$189.326,23', '8,4%']
    ],
    foot: [
      ['', 'TOTAL ANTICIPOS JURÍDICOS (PASIVO CORRIENTE NIIF 15)', '', '', 'Bs. 1.542.017.092,63', '$2.270.486,23', '100,0%']
    ],
    theme: 'plain',
    styles: { fontSize: 7.2, cellPadding: 2.2, font: 'helvetica', lineColor: [200, 200, 200], lineWidth: 0.15 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.3 },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.35 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'left', cellWidth: 52 },
      2: { halign: 'center', cellWidth: 26 },
      3: { halign: 'center', cellWidth: 24 },
      4: { halign: 'right', cellWidth: 35 },
      5: { halign: 'right', cellWidth: 30 },
      6: { halign: 'center', cellWidth: 16.9 }
    }
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ASIENTOS CONTABLES DE REGISTRO PASIVO CORRIENTE (NIIF 15):', margin, 105);

  autoTable(doc, {
    startY: 109,
    margin: { left: margin, right: margin },
    head: [['Código Cta.', 'Descripción de la Cuenta / Asiento Contable', 'Debe (Bs.)', 'Haber (Bs.)']],
    body: [
      ['1.1.01.01.001', 'Banco Banesco Cta. Cte. N° 0134-0342-18-3421089912', '1.542.017.092,63', '—'],
      ['2.1.02.01.001', 'Pasivo Corriente - Anticipos Recibidos de Clientes Jurídicos (NIIF 15)', '—', '1.542.017.092,63'],
      ['', 'P/R: Recepción de anticipos en bolívares a tasa oficial BCV de torrefactoras nacionales para procura y acopio de café en Venezuela. Sustitución por factura fiscal SENIAT en Octubre 2026.', '—', '—']
    ],
    theme: 'plain',
    styles: { fontSize: 7.2, cellPadding: 2, font: 'helvetica', lineColor: [200, 200, 200], lineWidth: 0.15 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.3 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 30 },
      1: { halign: 'left', cellWidth: 90 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 36.9 }
    }
  });

  drawSignature(160);

  // =========================================================================
  // PÁGINA 8: SEPARADOR C - RESPALDO DE ANTICIPOS DE PERSONAS NATURALES Y PRODUCTORES
  // =========================================================================
  doc.addPage('letter', 'p');
  drawHeader('SEPARADOR C: RESPALDO DE ANTICIPOS DE PERSONAS NATURALES Y PRODUCTORES', 'SEPARADOR C');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DEPÓSITOS POR TAQUILLA EN BARCELONA / LECHERÍA Y CENTROS DE ACOPIO (Bs. 29.495.954,99)', margin, 32);

  autoTable(doc, {
    startY: 37,
    margin: { left: margin, right: margin },
    head: [['Concepto de Ingreso / Abono Taquilla', 'Monto en Bolívares (Bs.)', 'Equivalente USD ($)', 'Tratamiento Contable y Fichas SICA']],
    body: [
      ['Aportes Operativos Presidente Sr. Elias Rafael Trías Abreu', 'Bs. 7.649.975,00', '$12.280,00', 'Cuentas por Pagar Socios / Inyección de Liquidez'],
      ['Anticipos Taquilla Banesco Personas Naturales (Acopio)', 'Bs. 21.845.979,99', '$35.055,99', 'Anticipos Compradores de Campo y Fichas de Recepción'],
      ['TOTAL APORTES Y ANTICIPOS PERSONAS NATURALES', 'Bs. 29.495.954,99', '$47.335,99', 'Soportado con Fichas de Acopio y Guías SICA']
    ],
    theme: 'plain',
    styles: { fontSize: 7.5, cellPadding: 2.5, font: 'helvetica', lineColor: [200, 200, 200], lineWidth: 0.15 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.3 },
    columnStyles: {
      0: { halign: 'left', cellWidth: 80 },
      1: { halign: 'right', cellWidth: 38 },
      2: { halign: 'right', cellWidth: 32 },
      3: { halign: 'left', cellWidth: 41.9 }
    }
  });

  drawSignature(110);

  // =========================================================================
  // PÁGINA 9: SEPARADOR D - ADQUISICIÓN DE DIVISAS EN MESA CAMBIARIA Y USO DE FONDOS
  // =========================================================================
  doc.addPage('letter', 'p');
  drawHeader('SEPARADOR D: ADQUISICIÓN DE DIVISAS EN MESA DE CAMBIO BANESCO Y USO DE FONDOS', 'SEPARADOR D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DESGLOSE DE DIVISAS ADQUIRIDAS ($556.890,45 USD) Y APLICACIÓN 100% NACIONAL', margin, 32);

  autoTable(doc, {
    startY: 37,
    margin: { left: margin, right: margin },
    head: [['Rubro / Destino de Uso de Divisas Banesco', 'Monto USD ($)', 'Monto Bolívares (Bs. BCV)', '% Aplicación', 'Soportes de Resguardo']],
    body: [
      ['Insumos Agroindustriales, Tolvas y Sacos de Yute en Venezuela', '$445.000,00', 'Bs. 300.220.000,00', '79,9%', 'Facturas Comerciales a Tasa BCV'],
      ['Transporte Pesado Terrestre Carga de Café (Gandolas 350)', '$67.380,15', 'Bs. 45.460.000,00', '12,1%', 'Guías SICA / Boletas de Pesaje Romana'],
      ['Análisis de Laboratorio y Servicios Técnicos CVC/INSAI', '$35.000,00', 'Bs. 23.615.000,00', '6,3%', 'Comprobantes de Pago Aranceles CVC'],
      ['Remanente en Cuenta Custodia Banesco Convenio 20', '$9.510,30', 'Bs. 6.335.000,00', '1,7%', 'Estado de Cuenta Banesco USD']
    ],
    foot: [
      ['TOTAL DIVISAS BBU APLICADAS EN VENEZUELA', '$556.890,45', 'Bs. 375.630.000,00', '100,0%', 'CERO TRANSFERENCIAS AL EXTERIOR']
    ],
    theme: 'plain',
    styles: { fontSize: 7.2, cellPadding: 2.2, font: 'helvetica', lineColor: [200, 200, 200], lineWidth: 0.15 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.3 },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.35 },
    columnStyles: {
      0: { halign: 'left', cellWidth: 70 },
      1: { halign: 'right', cellWidth: 28 },
      2: { halign: 'right', cellWidth: 38 },
      3: { halign: 'center', cellWidth: 18 },
      4: { halign: 'left', cellWidth: 37.9 }
    }
  });

  drawSignature(120);

  // =========================================================================
  // PÁGINA 10 A 13: SEPARADOR E - ESTADOS FINANCIEROS COMPLETOS AL 31/08/2026
  // =========================================================================
  // PÁGINA 10: BALANCE GENERAL
  doc.addPage('letter', 'p');
  drawHeader('SEPARADOR E: ESTADO DE SITUACIÓN FINANCIERA (BALANCE GENERAL DUAL Bs. / USD)', 'SEPARADOR E');

  autoTable(doc, {
    startY: 31,
    margin: { left: margin, right: margin },
    head: [['Código', 'Cuenta Contable / Rubro Patrimonial', 'Monto Bolívares (Bs.)', 'Monto Dólares (USD)']],
    body: [
      ['1.1', 'ACTIVO CORRIENTE (CIRCULANTE)', '', ''],
      ['1.1.01', 'Efectivo y Equivalentes de Efectivo (Banesco / BFC Cta Cte)', 'Bs. 12.355.523,87', '$15.541,73'],
      ['1.1.02', 'Cuentas por Cobrar Socios - Transferencias Banesco (Elías Trías Abreu)', 'Bs. 375.630.000,00', '$472.496,51'],
      ['1.1.03', 'Cuentas por Cobrar Contrato Mutuo Manuel Becerra (Capital + Int.)', 'Bs. 325.948.652,96', '$410.003,46'],
      ['1.1.04', 'Retenciones ISLR por Cobrar a Clientes', 'Bs. 661.181,94', '$831,69'],
      ['1.1.05', 'ISLR Pagado por Adelantado / Crédito Fiscal Exigible', 'Bs. 787.174,72', '$990,17'],
      ['1.1.99', 'TOTAL ACTIVO CORRIENTE', 'Bs. 715.382.533,49', '$899.863,56'],
      ['', '', '', ''],
      ['1.2', 'PROPIEDAD, PLANTA Y EQUIPO (NO CORRIENTE)', '', ''],
      ['1.2.01', 'Maquinarias, Vehículos, Muebles e Inmuebles', 'Bs. 28.062.694,00', '$35.299,43'],
      ['1.2.02', '(-) Depreciación Acumulada Propiedad, Planta y Equipos', 'Bs. -8,47', '$-0,01'],
      ['1.2.99', 'TOTAL PROPIEDAD, PLANTA Y EQUIPO NETO', 'Bs. 28.062.685,53', '$35.299,42'],
      ['1.0.00', 'TOTAL ACTIVO', 'Bs. 743.445.219,02', '$935.162,98'],
      ['', '', '', ''],
      ['2.1', 'PASIVO CORRIENTE (CIRCULANTE)', '', ''],
      ['2.1.01', 'Anticipos Recibidos de Clientes (NIIF 15 - Pasivo Exigible en Café)', 'Bs. 301.228.750,17', '$378.908,86'],
      ['2.1.02', 'Retenciones de ISLR por Pagar sobre Anticipos (2% Decreto 1808)', 'Bs. 31.277.261,45', '$39.342,96'],
      ['2.1.03', 'Cuentas por Pagar Socios (Aportes Accionista Elias Rafael Trías Abreu)', 'Bs. 301.053.109,62', '$378.687,92'],
      ['2.1.04', 'Obligaciones Fiscales ISLR por Pagar al Cierre', 'Bs. 696.202,38', '$875,74'],
      ['2.1.99', 'TOTAL PASIVO CORRIENTE / TOTAL PASIVO', 'Bs. 634.255.323,62', '$797.815,48'],
      ['', '', '', ''],
      ['3.1', 'PATRIMONIO NETO', '', ''],
      ['3.1.01', 'Capital Social Suscrito y Pagado', 'Bs. 600.000,00', '$754,73'],
      ['3.2.01', 'Superávit Acumulado de Ejercicios Anteriores', 'Bs. 82.590.269,79', '$103.888,44'],
      ['3.3.01', 'Reserva Legal Cumplida', 'Bs. 60.000,00', '$75,47'],
      ['3.1.03', 'Ganancia Neta del Ejercicio (01/01/2026 al 31/08/2026)', 'Bs. 25.939.625,61', '$32.628,86'],
      ['3.1.99', 'TOTAL PATRIMONIO NETO', 'Bs. 109.189.895,40', '$137.347,50'],
      ['3.0.00', 'TOTAL PASIVO Y PATRIMONIO NETO', 'Bs. 743.445.219,02', '$935.162,98']
    ],
    theme: 'plain',
    styles: { fontSize: 7, cellPadding: 1.8, font: 'helvetica', lineColor: [215, 215, 215], lineWidth: 0.1 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.25 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16 },
      1: { halign: 'left', cellWidth: 100 },
      2: { halign: 'right', cellWidth: 40 },
      3: { halign: 'right', cellWidth: 35.9 }
    },
    didParseCell: (data) => {
      const desc = String(data.row.cells[1]?.text || '');
      if (desc.includes('TOTAL')) {
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  drawSignature(230);

  // PÁGINA 11: ESTADO DE GANANCIAS Y PÉRDIDAS
  doc.addPage('letter', 'p');
  drawHeader('SEPARADOR E: ESTADO DE RESULTADO INTEGRAL (GANANCIAS Y PÉRDIDAS DUAL)', 'SEPARADOR E');

  autoTable(doc, {
    startY: 31,
    margin: { left: margin, right: margin },
    head: [['Código', 'Concepto / Cuenta de Ingresos y Gastos', 'Monto Bolívares (Bs.)', 'Monto Dólares (USD)']],
    body: [
      ['4.1', 'INGRESOS OPERACIONALES Y FINANCIEROS', '', ''],
      ['4.1.01', 'Ingresos por Servicios Agrícolas / Intermediación Procura Café', 'Bs. 78.717.472,35', '$99.016,93'],
      ['4.1.02', 'Ingresos por Intereses Devengados (Contrato Mutuo Manuel Becerra)', 'Bs. 13.924.047,66', '$17.514,75'],
      ['4.1.99', 'TOTAL INGRESOS REALES DEVENGADOS EN EEFF', 'Bs. 92.641.520,01', '$116.531,68'],
      ['', '', '', ''],
      ['5.1', 'COSTOS Y GASTOS OPERACIONALES', '', ''],
      ['5.1.01', 'Costos Operacionales, Servicios Agrícolas y Comisiones Bancarias', 'Bs. 66.701.894,40', '$83.902,81'],
      ['5.1.99', 'TOTAL COSTOS Y GASTOS OPERACIONALES', 'Bs. 66.701.894,40', '$83.902,81'],
      ['', '', '', ''],
      ['5.0.00', 'UTILIDAD NETA DEL EJERCICIO (01/01/2026 AL 31/08/2026)', 'Bs. 25.939.625,61', '$32.628,86']
    ],
    theme: 'plain',
    styles: { fontSize: 7.5, cellPadding: 2.2, font: 'helvetica', lineColor: [215, 215, 215], lineWidth: 0.1 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.25 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16 },
      1: { halign: 'left', cellWidth: 100 },
      2: { halign: 'right', cellWidth: 40 },
      3: { halign: 'right', cellWidth: 35.9 }
    },
    didParseCell: (data) => {
      const desc = String(data.row.cells[1]?.text || '');
      if (desc.includes('TOTAL') || desc.includes('UTILIDAD')) {
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  drawSignature(140);

  // PÁGINA 12: BALANCE DE COMPROBACIÓN DE SALDOS Y MOVIMIENTOS
  doc.addPage('letter', 'l');
  const tbPageWidth = 279.4;

  doc.setFillColor(255, 255, 255);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(companyName.toUpperCase(), margin, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`R.I.F.: ${companyRif} | ${address} | BALANCE DE COMPROBACIÓN COMPLETO AL ${dateStr.toUpperCase()}`, margin, 16.5);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(margin, 19, tbPageWidth - margin, 19);

  autoTable(doc, {
    startY: 22,
    margin: { left: margin, right: margin, bottom: 15 },
    head: [
      ['Código', 'Nombre de la Cuenta Contable', 'Cat.', 'Saldo Inicial 2025 (Bs.)', '', 'Movimientos 2026 (Bs.)', '', 'Saldo Final 31/08/2026 (Bs.)', '', 'Saldo Final USD ($)', ''],
      ['', '', '', 'Debe', 'Haber', 'Debe', 'Haber', 'Debe', 'Haber', 'Debe ($)', 'Haber ($)']
    ],
    body: [
      ['1.1.01.01', 'Banco Banesco Cta Corriente VES', 'ACT', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 1.966.597.105,35', 'Bs. 1.954.241.581,48', 'Bs. 12.355.523,87', 'Bs. 0,00', '$15.541,73', '$0,00'],
      ['1.1.01.02', 'CxC Socios - Transferencias Corporativas Banesco', 'ACT', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 375.630.000,00', 'Bs. 0,00', 'Bs. 375.630.000,00', 'Bs. 0,00', '$472.496,51', '$0,00'],
      ['1.1.02.04', 'Cuentas por Cobrar Mutuo Manuel Becerra', 'ACT', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 512.324.652,96', 'Bs. 186.376.000,00', 'Bs. 325.948.652,96', 'Bs. 0,00', '$410.003,46', '$0,00'],
      ['1.1.02.05', 'Retenciones ISLR por Cobrar a Clientes', 'ACT', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 661.181,94', 'Bs. 0,00', 'Bs. 661.181,94', 'Bs. 0,00', '$831,69', '$0,00'],
      ['1.1.02.06', 'ISLR Pagado por Adelantado / Crédito Fiscal', 'ACT', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 787.174,72', 'Bs. 0,00', 'Bs. 787.174,72', 'Bs. 0,00', '$990,17', '$0,00'],
      ['1.2.01.01', 'Propiedad, Planta y Equipos (PPE)', 'ACT', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 28.062.694,00', 'Bs. 0,00', 'Bs. 28.062.694,00', 'Bs. 0,00', '$35.299,43', '$0,00'],
      ['1.2.01.02', 'Depreciación Acumulada PPE', 'ACT', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 8,47', 'Bs. 0,00', 'Bs. 8,47', '$0,00', '$0,01'],
      ['2.1.01.01', 'Anticipos Recibidos de Clientes (NIIF 15)', 'PAS', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 1.262.634.322,45', 'Bs. 1.563.863.072,62', 'Bs. 0,00', 'Bs. 301.228.750,17', '$0,00', '$378.908,86'],
      ['2.1.01.02', 'Retenciones ISLR por Pagar (2% Decreto 1808)', 'PAS', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 31.277.261,45', 'Bs. 0,00', 'Bs. 31.277.261,45', '$0,00', '$39.342,96'],
      ['2.1.01.03', 'Cuentas por Pagar Socios (Elias Trías Abreu)', 'PAS', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 301.053.109,62', 'Bs. 0,00', 'Bs. 301.053.109,62', '$0,00', '$378.687,92'],
      ['2.1.01.04', 'Obligaciones Fiscales ISLR por Pagar', 'PAS', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 696.202,38', 'Bs. 0,00', 'Bs. 696.202,38', '$0,00', '$875,74'],
      ['3.1.01.01', 'Capital Social Suscrito y Pagado', 'PAT', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 600.000,00', 'Bs. 0,00', 'Bs. 600.000,00', '$0,00', '$754,73'],
      ['3.2.01.01', 'Superávit Acumulado Ejercicios Anteriores', 'PAT', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 82.590.269,79', 'Bs. 0,00', 'Bs. 82.590.269,79', '$0,00', '$103.888,44'],
      ['3.3.01.01', 'Reserva Legal Cumplida', 'PAT', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 60.000,00', 'Bs. 0,00', 'Bs. 60.000,00', '$0,00', '$75,47'],
      ['4.1.01.01', 'Ingresos por Servicios Agrícolas', 'ING', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 78.717.472,35', 'Bs. 0,00', 'Bs. 78.717.472,35', '$0,00', '$99.016,93'],
      ['4.1.02.01', 'Ingresos por Intereses Mutuo Becerra', 'ING', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 13.924.047,66', 'Bs. 0,00', 'Bs. 13.924.047,66', '$0,00', '$17.514,75'],
      ['5.1.01.01', 'Costos y Gastos Operacionales y Comisiones', 'EGR', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 66.701.894,40', 'Bs. 0,00', 'Bs. 66.701.894,40', 'Bs. 0,00', '$83.902,81', '$0,00']
    ],
    foot: [
      ['TOTAL', 'TOTALES GENERALES DEL BALANCE DE COMPROBACIÓN', '100%', 'Bs. 0,00', 'Bs. 0,00', 'Bs. 4.208.297.128,87', 'Bs. 4.208.297.128,87', 'Bs. 809.847.221,89', 'Bs. 809.847.221,89', '$1.018.688,56', '$1.018.688,56']
    ],
    theme: 'plain',
    styles: { fontSize: 6.8, cellPadding: 1.5, font: 'helvetica', lineColor: [215, 215, 215], lineWidth: 0.1 },
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.25 },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.3 },
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

  // PÁGINA 13: NOTAS REVELATORIAS Y FIRMA FINAL
  doc.addPage('letter', 'p');
  drawHeader('SEPARADOR E: NOTAS REVELATORIAS A LOS ESTADOS FINANCIEROS Y FIRMA FINAL', 'NOTAS REVELATORIAS');

  let finalNoteY = 32;
  const masterNotes = [
    { title: 'Base de Presentación e Intermediación Comercial', text: 'Los Estados Financieros han sido preparados bajo Normas Internacionales VEN-NIF (NIIF PYMES). La empresa opera como intermediaria comercial en Venezuela.' },
    { title: 'Reconocimiento de Pasivos por Anticipos de Clientes (NIIF 15)', text: 'Los anticipos en bolívares recibidos a tasa oficial BCV constituyen Pasivo Corriente exigible hasta la entrega física del grano y emisión de factura fiscal SENIAT en Octubre 2026.' },
    { title: 'Inexistencia de Omisión de Ingresos y Cuadre Bancario', text: 'Se certifica la conciliación al 100% de la movilización de créditos bancarios Banesco ($2.912.368,95 USD / Bs. 1.966.597.105,35), arrojando una diferencia por omisión de ingresos de Bs. 0,00.' }
  ];

  masterNotes.forEach((n, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`NOTA ${idx + 1}: ${n.title.toUpperCase()}`, margin, finalNoteY);
    finalNoteY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const splitText = doc.splitTextToSize(n.text, pageWidth - margin * 2);
    doc.text(splitText, margin, finalNoteY);
    finalNoteY += splitText.length * 3.6 + 4.5;
  });

  drawSignature(finalNoteY + 10);

  doc.save(filename);
}

/**
 * Genera y descarga el Expediente Maestro Completo de la Carpeta de Cumplimiento
 * Banesco en formato Microsoft Word (.docx y .doc), permitiendo al usuario
 * editar fácilmente todo el contenido, cartas, tablas, estados financieros y notas contables.
 */
export async function exportMasterBanescoComplianceFolderWord(params?: {
  filename?: string;
  companyName?: string;
  companyRif?: string;
  address?: string;
  dateStr?: string;
  bcvRate?: number;
  accountVES?: string;
  accountUSD?: string;
}): Promise<void> {
  const companyName = params?.companyName || 'AGRÍCOLA ONI, C.A.';
  const companyRif = params?.companyRif || 'J-50145638-0';
  const address = params?.address || 'Calle Las Flores, Quinta Blanquita, Local 2, Crucero de Lechería, Barcelona, Estado Anzoátegui.';
  const dateStr = params?.dateStr || 'Barcelona, 31 de Agosto de 2026';
  const bcvRate = params?.bcvRate || 798.33;
  const accountVES = params?.accountVES || '0134-0342-18-3421089912';
  const accountUSD = params?.accountUSD || '0134-0342-12-3420084712';
  const rawFilename = params?.filename || 'Expediente_Completo_Carpeta_Cumplimiento_Banesco_2026_Agricola_Oni.docx';

  const fullWordHtml = `
    <div style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; padding: 20px;">
      
      <!-- PORTADA Y MEMBRETE PRINCIPAL -->
      <div style="text-align: center; border-bottom: 3px double #0f766e; padding-bottom: 15px; margin-bottom: 25px;">
        <h1 style="color: #0f172a; font-size: 20pt; margin: 0 0 5px 0; font-weight: bold; text-transform: uppercase;">
          ${companyName}
        </h1>
        <p style="font-size: 11pt; color: #475569; margin: 0 0 10px 0; font-weight: bold;">
          R.I.F.: ${companyRif} &middot; DOMICILIO FISCAL Y OPERATIVO
        </p>
        <p style="font-size: 9.5pt; color: #64748b; margin: 0;">
          ${address}
        </p>
      </div>

      <div style="background-color: #f0fdf4; border: 1.5pt solid #16a34a; padding: 12px 18px; margin-bottom: 25px; border-radius: 4px;">
        <h2 style="color: #15803d; font-size: 14pt; margin: 0 0 5px 0; text-align: center; text-transform: uppercase; font-weight: bold;">
          EXPEDIENTE MAESTRO DE CUMPLIMIENTO BANCARIO &middot; BANESCO BANCO UNIVERSAL
        </h2>
        <p style="font-size: 10pt; color: #166534; margin: 0; text-align: center;">
          CONSOLIDADO DE RESPUESTA A AUDITORÍA, CARTAS EXPLICATIVAS, ANEXOS DESGLOSADOS Y ESTADOS FINANCIEROS AL 31/08/2026
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 10pt;">
        <tr>
          <td style="width: 50%; vertical-align: top; padding: 8px; border: 1pt solid #cbd5e1; background-color: #f8fafc;">
            <strong>EMPRESA TITULAR:</strong> ${companyName}<br>
            <strong>R.I.F.:</strong> ${companyRif}<br>
            <strong>LUGAR Y FECHA DE EMISIÓN:</strong> ${dateStr}<br>
            <strong>REMITENTE / PRESIDENTE:</strong> Sr. Elías Rafael Trías Abreu
          </td>
          <td style="width: 50%; vertical-align: top; padding: 8px; border: 1pt solid #cbd5e1; background-color: #f8fafc;">
            <strong>INSTITUCIÓN DESTINATARIA:</strong> Banesco Banco Universal, C.A.<br>
            <strong>UNIDAD REQUERIDA:</strong> Prevención de Legitimación de Capitales (UPCLC)<br>
            <strong>CTA. VES:</strong> N° ${accountVES}<br>
            <strong>CTA. USD (CONVENIO 20):</strong> N° ${accountUSD}<br>
            <strong>TASA OFICIAL BCV:</strong> Bs. ${bcvRate.toFixed(2)} / USD
          </td>
        </tr>
      </table>

      <!-- SECCIÓN I: CARTA DE RESPUESTA PRINCIPAL (1 PÁGINA) Y ANEXO -->
      <div style="page-break-before: always; margin-top: 30px;">
        <h2 style="color: #0f172a; font-size: 14pt; border-bottom: 2pt solid #0f766e; padding-bottom: 5px; margin-bottom: 15px;">
          SECCIÓN I: CARTA DE RESPUESTA PRINCIPAL A BANESCO BANCO UNIVERSAL (SÍNTESIS 1 PÁGINA)
        </h2>

        <p style="text-align: right; margin-bottom: 15px;"><strong>${dateStr}</strong></p>

        <p><strong>Señores:</strong><br>
        <strong>BANESCO BANCO UNIVERSAL, C.A.</strong><br>
        Gerencia de Auditoría Interna y Unidad de Prevención y Control LC/FT (UPCLC/FT)<br>
        Atención: Gerencia Senior de Cumplimiento Banesco Banco Universal<br>
        Presente.-</p>

        <p><strong>ASUNTO:</strong> CARTA DE RESPUESTA FORMAL Y SÍNTESIS DE AUDITORÍA BANCARIA — JUSTIFICACIÓN DE FONDOS MOVILIZADOS ($2.912.368,95 USD / Bs. 1.966.597.105,35) VS ESTADOS FINANCIEROS (CUENTAS CORRIENTES N° ${accountVES} EN VES Y N° ${accountUSD} EN USD CONVENIO 20).</p>

        <p>En representación legal de <strong>${companyName}</strong> (R.I.F. ${companyRif}), nos dirigimos a ustedes a fin de dar formal respuesta informando que <strong>NO EXISTE OMISIÓN DE INGRESOS NI DIFERENCIA NO JUSTIFICADA</strong>. Nuestra empresa opera exclusivamente como <strong>INTERMEDIARIA COMERCIAL Y MANDANTE EN LA COMPRA DE CAFÉ VERDE 100% NACIONAL EN VENEZUELA</strong> para torrefactoras e industrias venezolanas. No importamos café de Colombia ni de ningún país del exterior; todo el café se adquiere en el mercado nacional a tipo de cambio oficial publicado por el Banco Central de Venezuela (BCV).</p>

        <p>La movilización bancaria acumulada de créditos en Banesco por <strong>$2.912.368,95 USD equivalentes (Bs. 1.966.597.105,35)</strong> se concilia al 100% frente a las Ventas Reales Declaradas en el Estado de Resultados al 31/08/2026 (Bs. 92.641.520,01 / $116.531,68 USD) mediante la siguiente estructura contable:</p>

        <ol style="margin-left: 15px; margin-bottom: 15px; font-size: 10pt;">
          <li><strong>Anticipos de Clientes Jurídicos en Bolívares (78,4% — Bs. 1.542.017.092,63 / $2.270.486,23 USD):</strong> Fondos recibidos bajo Contrato Marco de Intermediación. Registrados como Pasivos Corrientes Exigibles bajo NIIF 15 / Sección 23. Se sustituyen por factura fiscal SENIAT en Octubre 2026 con la entrega física del café.</li>
          <li><strong>Reintegros Capital Mutuo Manuel Becerra (9,5% — Bs. 186.376.000,00 / $286.228,93 USD):</strong> Amortización de Activo Financiero de la Línea de Crédito Rotativa. Disminuyen la Cuenta por Cobrar. No constituye ingreso.</li>
          <li><strong>Transferencias Cuentas Propias Agrícola Oni (10,6% — Bs. 208.708.057,73 / $308.317,80 USD):</strong> Traspasos de tesorería interna desde Provincial, Mercantil, Plaza y Bancamiga mismo RIF J-50145638-0. Impacto patrimonial neto: Bs. 0,00.</li>
          <li><strong>Aportes Operativos Accionista / Personas Naturales (1,5% — Bs. 29.495.954,99 / $47.335,99 USD):</strong> Inyecciones de liquidez Presidente Sr. Elias Rafael Trías Abreu y anticipos de compradores personas naturales.</li>
          <li><strong>Ingresos Reales Declarados en EEFF (Bs. 92.641.520,01 / $116.531,68 USD):</strong> Servicios Agrícolas facturados ($78,72M) + Intereses Ganados Mutuo ($13,92M), 100% idéntico a EEFF.</li>
          <li><strong>Operaciones en Mesa Cambiaria Banesco ($556.890,45 USD):</strong> Divisas liquidadas e invertidas 100% en Venezuela en insumos agrícolas, fletes terrestres y servicios técnicos en territorio nacional.</li>
        </ol>

        <p style="background-color: #f0fdf4; border: 1pt solid #16a34a; padding: 10px; font-weight: bold; color: #15803d; text-align: center;">
          DIFERENCIA FINAL POR OMISIÓN DE INGRESOS: BS. 0,00 ($0,00 USD). CUADRE MATEMÁTICO 100% PERFECTO.
        </p>

        <!-- TABLA DESGLOSE CATEGORIZACIÓN $2.912.368,95 -->
        <h3 style="color: #0f766e; font-size: 12pt; margin-top: 25px;">
          ANEXO A CARTA DE RESPUESTA: CUADRO EXPLICATIVO DE LA MOVILIZACIÓN DE $2.912.368,95 USD (Bs. 1.966.597.105,35)
        </h3>

        <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt; margin-top: 10px; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #0f766e; color: #ffffff;">
              <th style="padding: 8px; border: 1pt solid #0d9488; text-align: left;">Categoría de Origen / Destino de Fondos</th>
              <th style="padding: 8px; border: 1pt solid #0d9488; text-align: center;">N° Oper.</th>
              <th style="padding: 8px; border: 1pt solid #0d9488; text-align: right;">Monto Total en Bolívares (Bs.)</th>
              <th style="padding: 8px; border: 1pt solid #0d9488; text-align: right;">Monto Equiv. Dólares ($ USD)</th>
              <th style="padding: 8px; border: 1pt solid #0d9488; text-align: center;">% Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;"><strong>1. Anticipos de Clientes Jurídicos (Contratos Marco Intermediación)</strong></td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center;">6</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 1.542.017.092,63</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">$2.270.486,23</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center;">78,41%</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;"><strong>2. Reintegros Capital Mutuo Manuel Becerra (Amortización Cta x Cobrar)</strong></td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center;">18</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 186.376.000,00</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">$286.228,93</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center;">9,48%</td>
            </tr>
            <tr>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;"><strong>3. Transferencias Cuentas Propias Agrícola Oni (Tesorería Interna)</strong></td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center;">12</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 208.708.057,73</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">$308.317,80</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center;">10,61%</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;"><strong>4. Aportes Operativos Socio / Anticipos Personas Naturales</strong></td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center;">24</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 29.495.954,99</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">$47.335,99</td>
              <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center;">1,50%</td>
            </tr>
            <tr style="background-color: #f0fdf4; font-weight: bold;">
              <td style="padding: 8px; border: 1.5pt solid #16a34a; color: #15803d;">TOTAL MOVILIZADO BANESCO OBJETO DE AUDITORÍA</td>
              <td style="padding: 8px; border: 1.5pt solid #16a34a; text-align: center; color: #15803d;">60</td>
              <td style="padding: 8px; border: 1.5pt solid #16a34a; text-align: right; color: #15803d;">Bs. 1.966.597.105,35</td>
              <td style="padding: 8px; border: 1.5pt solid #16a34a; text-align: right; color: #15803d;">$2.912.368,95</td>
              <td style="padding: 8px; border: 1.5pt solid #16a34a; text-align: center; color: #15803d;">100,00%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SECCIÓN II: SEPARADOR A - INFORME CONTABLE COMPLETO (CARTA LARGA COMO SOPORTE) -->
      <div style="page-break-before: always; margin-top: 30px;">
        <h2 style="color: #0f172a; font-size: 14pt; border-bottom: 2pt solid #0f766e; padding-bottom: 5px; margin-bottom: 15px;">
          SECCIÓN II: SEPARADOR A - INFORME CONTABLE DETALLADO Y EXPOSICIÓN DE MOTIVOS JURÍDICO-FISCALES
        </h2>

        <div style="background-color: #f8fafc; border: 1pt solid #cbd5e1; padding: 15px; margin-bottom: 15px;">
          <p style="margin: 0 0 10px 0;"><strong>DOCUMENTO DE SOPORTE CONTABLE:</strong> INFORME TÉCNICO AUD-BAN-2026-ONI-094</p>
          <p style="margin: 0 0 10px 0;"><strong>EMPRESA:</strong> ${companyName} (RIF ${companyRif})</p>
          <p style="margin: 0;"><strong>FUNDAMENTACIÓN LEGAL Y NORMATIVA COMPLETA:</strong></p>
          <p style="margin-top: 5px; margin-bottom: 5px;">- <strong>Ley de ISLR (Arts. 1, 5 y 16):</strong> Principio de disponibilidad sobre bases devengadas o causadas. Los anticipos constituyen pasivos exigibles de la empresa intermediaria, no hecho imponible sino hasta la entrega definitiva del producto.</p>
          <p style="margin-bottom: 5px;">- <strong>Providencia SENIAT N° SNAT/2011/00071:</strong> La obligación de facturación surge con la entrega de los bienes en Octubre de 2026.</p>
          <p style="margin-bottom: 5px;">- <strong>Objeto Social Constitutivo (Registro Mercantil 2021, Tomo 44-A, N° 12, RIF J-50145638-0):</strong> Autoriza expresamente la intermediación comercial y compra de café nacional.</p>
          <p style="margin-bottom: 0;">- <strong>Propiedad Accionaria Única:</strong> Pertenece 100% a ELÍAS RAFAEL TRÍAS ABREU (C.I. V-23.997.829), garantizando total transparencia patrimonial.</p>
        </div>

        <h3 style="color: #0f766e; font-size: 11pt;">NOTA DE CONCILIACIÓN BANCARIA CERTIFICADA AL 31/08/2026</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt; margin-top: 5px; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #1e293b; color: #ffffff;">
              <th style="padding: 6px 8px; border: 1pt solid #475569; text-align: left;">CONCEPTO DE CONCILIACIÓN BANCARIA BANESCO</th>
              <th style="padding: 6px 8px; border: 1pt solid #475569; text-align: right;">MONTO EN BOLÍVARES (Bs.)</th>
              <th style="padding: 6px 8px; border: 1pt solid #475569; text-align: right;">EQUIV. DÓLARES ($ USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">Saldo según Estado de Cuenta Banesco N° 0134-0342-18-3421089912</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 4.892.150,80</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$6.153,73</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">Partidas Conciliatorias en Tránsito / Cheques Pendientes</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 0,00</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$0,00</td>
            </tr>
            <tr style="font-weight: bold; background-color: #f0fdf4;">
              <td style="padding: 6px 8px; border: 1.5pt solid #16a34a; color: #15803d;">DIFERENCIA DE CONCILIACIÓN BANCARIA</td>
              <td style="padding: 6px 8px; border: 1.5pt solid #16a34a; text-align: right; color: #15803d;">Bs. 0,00</td>
              <td style="padding: 6px 8px; border: 1.5pt solid #16a34a; text-align: right; color: #15803d;">$0,00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ESTRUCTURA DE SEPARADORES A - E -->
      <div style="page-break-before: always; margin-top: 30px;">
        <h2 style="color: #0f172a; font-size: 14pt; border-bottom: 2pt solid #0f766e; padding-bottom: 5px; margin-bottom: 15px;">
          SECCIÓN III: GUÍA DE SEPARADORES (A - E) Y CONTENIDO DE LA CARPETA FÍSICA
        </h2>

        <h3 style="color: #0f766e; font-size: 11.5pt; background-color: #f0fdf4; padding: 6px 10px; border-left: 4px solid #16a34a;">
          SEPARADOR A: CARTA EXPLICATIVA OFICIAL Y ESTADOS FINANCIEROS
        </h3>
        <p>Contiene la Carta de Respuesta Firmada, la Nota de Conciliación Bancaria con diferencia de Bs. 0,00 y el Dictamen de Cumplimiento Fiscal e ISLR/IGTF ante SENIAT y SUDEBAN.</p>

        <h3 style="color: #0f766e; font-size: 11.5pt; background-color: #f0fdf4; padding: 6px 10px; border-left: 4px solid #16a34a;">
          SEPARADOR B: RESPALDO DE ANTICIPOS DE CLIENTES JURÍDICOS (Bs. 427.800.000,00)
        </h3>
        <p>Contiene los 6 Contratos Marco de Intermediación Comercial, comprobantes bancarios de origen (Banesco, BFC, Provincial), copias de RIF SENIAT y cédulas de identidad de representantes legales.</p>

        <h3 style="color: #0f766e; font-size: 11.5pt; background-color: #f0fdf4; padding: 6px 10px; border-left: 4px solid #16a34a;">
          SEPARADOR C: RESPALDO DE ANTICIPOS DE PERSONAS NATURALES Y PRODUCTORES (Bs. 326.413.000,00)
        </h3>
        <p>Contiene las Fichas de Identificación de Productores, recibos de depósitos, comprobantes de recepción de café verde en acopio y Guías SICA/SUNAGRO de movilización nacional.</p>

        <h3 style="color: #0f766e; font-size: 11.5pt; background-color: #f0fdf4; padding: 6px 10px; border-left: 4px solid #16a34a;">
          SEPARADOR D: ADQUISICIÓN DE DIVISAS EN MESA DE CAMBIO BANESCO ($18.428.571,43 USD)
        </h3>
        <p>Contiene planillas de adjudicación cambiaría oficial Banesco, comprobantes de débito VES y crédito Cta Custodia USD, y facturas de insumos/maquinaria consumidos 100% en Venezuela.</p>

        <h3 style="color: #0f766e; font-size: 11.5pt; background-color: #f0fdf4; padding: 6px 10px; border-left: 4px solid #16a34a;">
          SEPARADOR E: REGISTRO LEGAL Y ESTADOS FINANCIEROS AUDITADOS AL 31/08/2026
        </h3>
        <p>Contiene Acta Constitutiva, Estatutos Sociales, RIF SENIAT, Balance General, Estado de Resultados y Balance de Comprobación al 31/08/2026.</p>
      </div>

      <!-- ESTADOS FINANCIEROS Y BALANCE DE COMPROBACIÓN -->
      <div style="page-break-before: always; margin-top: 30px;">
        <h2 style="color: #0f172a; font-size: 14pt; border-bottom: 2pt solid #0f766e; padding-bottom: 5px; margin-bottom: 15px;">
          SECCIÓN IV: ESTADOS FINANCIEROS DUALES (Bs. Y USD) AL 31/08/2026
        </h2>

        <!-- BALANCE GENERAL -->
        <h3 style="color: #0f766e; font-size: 12pt;">1. ESTADO DE SITUACIÓN FINANCIERA (BALANCE GENERAL DUAL Bs. / USD)</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #1e293b; color: #ffffff;">
              <th style="padding: 6px 8px; border: 1pt solid #475569; text-align: left;">CUENTA CONTABLE / RUBRO PATRIMONIAL</th>
              <th style="padding: 6px 8px; border: 1pt solid #475569; text-align: right;">MONTO EN BOLÍVARES (Bs.)</th>
              <th style="padding: 6px 8px; border: 1pt solid #475569; text-align: right;">EQUIV. DÓLARES ($ USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">1.1.01 Efectivo y Equivalentes de Efectivo (Banesco / BFC Cta Cte)</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 12.355.523,87</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$15.541,73</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">1.1.02 Cuentas por Cobrar Socios - Transferencias Corporativas (Elías Trías Abreu)</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 375.630.000,00</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$472.496,51</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">1.1.03 Cuentas por Cobrar Contrato Mutuo Manuel Becerra (Capital + Intereses)</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 325.948.652,96</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$410.003,46</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">1.1.04 Retenciones ISLR por Cobrar a Clientes y Adelantos SENIAT</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 1.448.356,66</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$1.821,86</td>
            </tr>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td style="padding: 6px 8px; border: 1pt solid #94a3b8;">TOTAL ACTIVO CORRIENTE</td>
              <td style="padding: 6px 8px; border: 1pt solid #94a3b8; text-align: right;">Bs. 715.382.533,49</td>
              <td style="padding: 6px 8px; border: 1pt solid #94a3b8; text-align: right;">$899.863,56</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">1.2.01 Propiedad, Planta y Equipos (Maquinarias, Vehículos, Muebles e Inmuebles Netos)</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 28.062.685,53</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$35.299,42</td>
            </tr>
            <tr style="background-color: #e2e8f0; font-weight: bold;">
              <td style="padding: 6px 8px; border: 1pt solid #64748b;">TOTAL ACTIVO CONSOLIDADO</td>
              <td style="padding: 6px 8px; border: 1pt solid #64748b; text-align: right;">Bs. 743.445.219,02</td>
              <td style="padding: 6px 8px; border: 1pt solid #64748b; text-align: right;">$935.162,98</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; color: #dc2626;"><strong>2.1.01 PASIVO: Anticipos Recibidos de Clientes (NIIF 15 - Pasivo Exigible en Café)</strong></td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right; color: #dc2626;"><strong>Bs. 301.228.750,17</strong></td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right; color: #dc2626;"><strong>$378.908,86</strong></td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">2.1.02 Retenciones de ISLR por Pagar sobre Anticipos (2% Decreto 1808)</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 31.277.261,45</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$39.342,96</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">2.1.03 Cuentas por Pagar Socios (Aportes Accionista Elias Rafael Trías Abreu)</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 301.053.109,62</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$378.687,92</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">2.1.04 Obligaciones Fiscales ISLR por Pagar al Cierre</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 696.202,38</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$875,74</td>
            </tr>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td style="padding: 6px 8px; border: 1pt solid #94a3b8;">TOTAL PASIVO CORRIENTE / PASIVO TOTAL</td>
              <td style="padding: 6px 8px; border: 1pt solid #94a3b8; text-align: right;">Bs. 634.255.323,62</td>
              <td style="padding: 6px 8px; border: 1pt solid #94a3b8; text-align: right;">$797.815,48</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">3.1.01 Capital Social Suscrito y Pagado</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 600.000,00</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$754,73</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">3.2.01 Superávit Acumulado de Ejercicios Anteriores + Reserva Legal</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 82.650.269,79</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$103.963,91</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">3.1.03 Ganancia Neta del Ejercicio (01/01/2026 al 31/08/2026)</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 25.939.625,61</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$32.628,86</td>
            </tr>
            <tr style="background-color: #f0fdf4; font-weight: bold;">
              <td style="padding: 6px 8px; border: 1pt solid #16a34a; color: #15803d;">TOTAL PATRIMONIO NETO CONSOLIDADO</td>
              <td style="padding: 6px 8px; border: 1pt solid #16a34a; text-align: right; color: #15803d;">Bs. 109.189.895,40</td>
              <td style="padding: 6px 8px; border: 1pt solid #16a34a; text-align: right; color: #15803d;">$137.347,50</td>
            </tr>
            <tr style="background-color: #e2e8f0; font-weight: bold;">
              <td style="padding: 6px 8px; border: 1pt solid #64748b;">TOTAL PASIVO Y PATRIMONIO NETO CONSOLIDADO</td>
              <td style="padding: 6px 8px; border: 1pt solid #64748b; text-align: right;">Bs. 743.445.219,02</td>
              <td style="padding: 6px 8px; border: 1pt solid #64748b; text-align: right;">$935.162,98</td>
            </tr>
          </tbody>
        </table>

        <!-- ESTADO DE RESULTADOS -->
        <h3 style="color: #0f766e; font-size: 12pt;">2. ESTADO DE RESULTADO INTEGRAL (GANANCIAS Y PÉRDIDAS DUAL)</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 9pt; margin-bottom: 25px;">
          <thead>
            <tr style="background-color: #1e293b; color: #ffffff;">
              <th style="padding: 6px 8px; border: 1pt solid #475569; text-align: left;">CONCEPTO / CUENTA DE INGRESOS Y COSTOS</th>
              <th style="padding: 6px 8px; border: 1pt solid #475569; text-align: right;">MONTO EN BOLÍVARES (Bs.)</th>
              <th style="padding: 6px 8px; border: 1pt solid #475569; text-align: right;">EQUIV. DÓLARES ($ USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">4.1.01 Ingresos por Servicios Agrícolas / Intermediación Procura Café</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 78.717.472,35</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$99.016,93</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">4.1.02 Ingresos por Intereses Devengados (Contrato Mutuo Manuel Becerra)</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">Bs. 13.924.047,66</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">$17.514,75</td>
            </tr>
            <tr style="background-color: #f1f5f9; font-weight: bold;">
              <td style="padding: 6px 8px; border: 1pt solid #94a3b8;">TOTAL INGRESOS REALES DEVENGADOS</td>
              <td style="padding: 6px 8px; border: 1pt solid #94a3b8; text-align: right;">Bs. 92.641.520,01</td>
              <td style="padding: 6px 8px; border: 1pt solid #94a3b8; text-align: right;">$116.531,68</td>
            </tr>
            <tr>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1;">5.1.01 Costos Operacionales, Servicios Agrícolas y Comisiones Bancarias Banesco</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">(Bs. 66.701.894,40)</td>
              <td style="padding: 5px 8px; border: 1pt solid #cbd5e1; text-align: right;">($83.902,81)</td>
            </tr>
            <tr style="background-color: #f0fdf4; font-weight: bold;">
              <td style="padding: 6px 8px; border: 1pt solid #16a34a; color: #15803d;">UTILIDAD NETA DEL EJERCICIO (01/01/2026 AL 31/08/2026)</td>
              <td style="padding: 6px 8px; border: 1pt solid #16a34a; text-align: right; color: #15803d;">Bs. 25.939.625,61</td>
              <td style="padding: 6px 8px; border: 1pt solid #16a34a; text-align: right; color: #15803d;">$32.628,86</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- FIRMA DEL REPRESENTANTE LEGAL -->
      <div style="margin-top: 40px; text-align: center; page-break-inside: avoid;">
        <p style="margin-bottom: 50px;">Atentamente,</p>
        <div style="display: inline-block; border-top: 1.5pt solid #0f172a; width: 320px; padding-top: 8px;">
          <p style="margin: 0; font-weight: bold; font-size: 11pt; color: #0f172a;">
            SR. ELÍAS RAFAEL TRÍAS ABREU
          </p>
          <p style="margin: 2px 0 0 0; font-size: 10pt; color: #475569;">
            Presidente y Representante Legal
          </p>
          <p style="margin: 2px 0 0 0; font-size: 9.5pt; color: #64748b;">
            ${companyName} &middot; R.I.F. ${companyRif}
          </p>
        </div>
      </div>

    </div>
  `;

  // Se exporta tanto como archivo .docx como en formato .doc de alta fidelidad para maximizar compatibilidad en Word
  await exportToWord(rawFilename, 'Expediente Completo Carpeta Cumplimiento Banesco 2026', fullWordHtml);
}

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

/** Genera la plantilla HTML formateada para Carta 1 (Carta Extendida de Respuesta a Banesco) */
export function getCarta1HtmlContent(company: CompanyProfile): string {
  return `
    <div style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; padding: 20px;">
      <table style="width: 100%; border-collapse: collapse; border-bottom: 2pt solid #0f172a; margin-bottom: 15px; padding-bottom: 10px;">
        <tr>
          <td style="vertical-align: top; text-align: left;">
            <h1 style="font-size: 16pt; color: #0f172a; margin: 0 0 2px 0; font-weight: bold; text-transform: uppercase;">
              ${company.name}
            </h1>
            <p style="font-size: 9.5pt; color: #334155; margin: 0 0 2px 0; font-weight: bold; text-transform: uppercase;">
              INTERMEDIACIÓN COMERCIAL &middot; COMPRA DE CAFÉ NACIONAL A TASA OFICIAL BCV &middot; ACOPIO VENEZUELA
            </p>
            <p style="font-size: 9pt; color: #475569; margin: 0;">
              R.I.F.: <strong>${company.rif}</strong> &middot; ${company.registroMercantil}<br>
              ${company.address}<br>
              Teléfonos: ${company.phone} &middot; Correo: ${company.email}
            </p>
          </td>
          <td style="vertical-align: top; text-align: right; width: 220px; border-left: 2pt solid #d97706; padding-left: 12px;">
            <p style="font-size: 8.5pt; font-weight: bold; color: #64748b; margin: 0; text-transform: uppercase;">LUGAR Y FECHA DE EMISIÓN</p>
            <p style="font-size: 10pt; font-weight: bold; color: #0f172a; margin: 4px 0 0 0;">Barcelona, 31 de Agosto de 2026</p>
          </td>
        </tr>
      </table>

      <div style="margin-bottom: 15px; font-size: 10.5pt;">
        <p style="font-weight: bold; margin: 0 0 2px 0; color: #0f172a;">CIUDADANOS:</p>
        <p style="font-weight: bold; margin: 0 0 2px 0; color: #0f172a;">BANESCO BANCO UNIVERSAL, C.A.</p>
        <p style="margin: 0 0 2px 0; color: #334155;">Gerencia de Auditoría Interna y Unidad de Prevención y Control LC/FT (UPCLC/FT)</p>
        <p style="margin: 0 0 2px 0; color: #334155;">Atención: <strong>Gerencia Senior de Cumplimiento Banesco Banco Universal</strong></p>
        <p style="font-weight: bold; margin: 8px 0 0 0; color: #0f172a;">
          ASUNTO: RESPUESTA FORMAL Y DOCUMENTADA A REQUERIMIENTO DE AUDITORÍA BANCARIA &mdash; JUSTIFICACIÓN DE FONDOS MOVILIZADOS VS ESTADOS FINANCIEROS (CUENTAS CORRIENTES N° ${company.banescoAccountVES} EN VES Y N° ${company.banescoAccountUSD} EN USD CONVENIO 20)
        </p>
      </div>

      <p style="text-align: justify; margin-bottom: 12px;">
        Nos dirigimos formalmente a ustedes en la oportunidad de dar respuesta integral y documentada al requerimiento de información cursado por esa distinguida institución financiera respecto a las cuentas corrientes en bolívares (<strong>${company.banescoAccountVES}</strong>) y en moneda extranjera (<strong>${company.banescoAccountUSD}</strong>) de nuestra representada <strong>${company.name}</strong>.
      </p>

      <p style="text-align: justify; margin-bottom: 12px;">
        Al respecto, dejamos constancia expresa y categórica de que <strong>AGRÍCOLA ONI C.A. actúa exclusivamente como empresa INTERMEDIARIA COMERCIAL EN VENEZUELA</strong>. Nuestra actividad consiste en intermediar entre personas naturales y jurídicas, sirviendo de puente mercantil para gestionar la <strong>compra, acopio y comercialización de café 100% NACIONAL a productores, asociaciones y empresas venezolanas</strong>. Dejamos formal constancia de que <strong>NUESTRA EMPRESA NO IMPORTA NADA DE COLOMBIA NI DE NINGUNA ENTIDAD DEL EXTERIOR; TODO EL CAFÉ SE COMPRA EN VENEZUELA</strong> y los contratos a futuro de café son celebrados exclusivamente con empresas y productores venezolanos, facturados a tipo de cambio oficial publicado por el Banco Central de Venezuela (BCV).
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; font-size: 9.5pt; border: 1pt solid #cbd5e1;">
        <thead>
          <tr style="background-color: #0f766e; color: #ffffff;">
            <th style="padding: 8px; border: 1pt solid #0d9488; text-align: left;">Concepto / Partida Contable</th>
            <th style="padding: 8px; border: 1pt solid #0d9488; text-align: right;">Monto Banesco (Bs.)</th>
            <th style="padding: 8px; border: 1pt solid #0d9488; text-align: right;">Equiv. USD ($)</th>
            <th style="padding: 8px; border: 1pt solid #0d9488; text-align: center;">% Total</th>
            <th style="padding: 8px; border: 1pt solid #0d9488; text-align: left;">Tratamiento Contable (NIIF) y Tributario (SENIAT)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;"><strong>1. Anticipos de Clientes (Procura Café Nacional)</strong></td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right; font-weight: bold;">Bs. 1.542.017.092,63</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">$2.270.486,23</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center; font-weight: bold;">78,41%</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;">Pasivo Corriente (NIIF 15 / Secc. 23). Facturación fiscal SENIAT en Oct. 2026.</td>
          </tr>
          <tr>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;"><strong>2. Reintegros Mutuo Manuel Becerra</strong></td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right; font-weight: bold;">Bs. 186.376.000,00</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">$286.228,93</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center; font-weight: bold;">9,48%</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;">Amortización de CxC Socio. No es venta ni ingreso gravable.</td>
          </tr>
          <tr>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;"><strong>3. Transferencias Cuentas Propias Oni</strong></td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right; font-weight: bold;">Bs. 208.708.057,73</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">$308.317,80</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center; font-weight: bold;">10,61%</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;">Traspaso interno de tesorería (Provincial/Mercantil/Bancamiga). Impacto $0.</td>
          </tr>
          <tr>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;"><strong>4. Aportes Operativos Accionista</strong></td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right; font-weight: bold;">Bs. 29.495.954,99</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right;">$47.335,99</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center; font-weight: bold;">1,50%</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;">Inyecciones de liquidez Presidente Elías Trías. CxP Socios.</td>
          </tr>
          <tr style="background-color: #f0fdf4;">
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1;"><strong>5. Ingresos Reales Declarados en EEFF</strong></td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right; font-weight: bold; color: #15803d;">Bs. 92.641.520,01</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: right; font-weight: bold; color: #15803d;">$116.531,68</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; text-align: center; font-weight: bold;">-</td>
            <td style="padding: 6px 8px; border: 1pt solid #cbd5e1; font-weight: bold; color: #15803d;">100% Coincidente con Estado de Resultados Auditado al 31/08/2026.</td>
          </tr>
        </tbody>
      </table>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #f0fdf4; border: 1.5pt solid #16a34a;">
        <tr>
          <td style="padding: 10px; text-align: center; color: #15803d;">
            <p style="margin: 0; font-size: 11pt; font-weight: bold; text-transform: uppercase;">
              🎯 CUADRE DEFINITIVO DE AUDITORÍA BANESCO &mdash; DIFERENCIA FINAL POR OMISIÓN DE INGRESOS: BS. 0,00 ($0,00 USD)
            </p>
            <p style="margin: 4px 0 0 0; font-size: 9pt; color: #166534;">
              Conciliación Auditada al 100% &middot; Explicación Total del Monto Exigido de $2.912.368,95 USD (Bs. 1.966.597.105,35)
            </p>
          </td>
        </tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
        <tr>
          <td style="text-align: center;">
            <p style="margin: 0 0 40px 0; font-size: 10pt; color: #334155;">Atentamente,</p>
            <div style="display: inline-block; border-top: 1.5pt solid #0f172a; width: 320px; padding-top: 6px;">
              <p style="margin: 0; font-weight: bold; font-size: 11pt; color: #0f172a;">
                SR. ELÍAS RAFAEL TRÍAS ABREU
              </p>
              <p style="margin: 2px 0 0 0; font-size: 9.5pt; color: #475569;">
                Presidente y Representante Legal &middot; C.I. V-23.997.829
              </p>
              <p style="margin: 2px 0 0 0; font-size: 9.5pt; font-weight: bold; color: #0f766e;">
                ${company.name} &middot; R.I.F. ${company.rif}
              </p>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `;
}

/** Genera la plantilla HTML formateada para Carta 2 (Carta Resumen Ejecutiva de 1 Página para Banesco) */
export function getCarta2HtmlContent(company: CompanyProfile, currentRate: BcvRateItem): string {
  return `
    <div style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 10.5pt; color: #0f172a; line-height: 1.4; padding: 10px; max-width: 700px; margin: 0 auto;">
      <table style="width: 100%; border-collapse: collapse; border-bottom: 2pt solid #0f766e; margin-bottom: 12px; padding-bottom: 8px;">
        <tr>
          <td style="vertical-align: top; text-align: left;">
            <h1 style="font-size: 15pt; color: #0f172a; margin: 0 0 2px 0; font-weight: bold; text-transform: uppercase;">
              ${company.name}
            </h1>
            <p style="font-size: 9pt; color: #334155; margin: 0 0 2px 0; font-weight: bold; text-transform: uppercase;">
              INTERMEDIACIÓN COMERCIAL &middot; COMPRA DE CAFÉ NACIONAL A TASA BCV &middot; R.I.F.: ${company.rif}
            </p>
            <p style="font-size: 8.5pt; color: #475569; margin: 0;">
              ${company.address}<br>
              Contacto: ${company.phone} | ${company.email}
            </p>
          </td>
          <td style="vertical-align: top; text-align: right; width: 210px; border-left: 1.5pt solid #cbd5e1; padding-left: 10px;">
            <p style="font-size: 8.5pt; font-weight: bold; color: #0f172a; margin: 0; text-transform: uppercase;">
              LUGAR Y FECHA DE EMISIÓN
            </p>
            <p style="font-size: 9.5pt; font-weight: bold; color: #0f766e; margin: 3px 0 0 0;">
              Barcelona, 31 de Agosto de 2026
            </p>
            <p style="font-size: 8pt; color: #64748b; margin: 3px 0 0 0;">
              Tasa Oficial BCV: Bs. ${currentRate.rateUsd.toFixed(2)} / USD
            </p>
          </td>
        </tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
        <tr>
          <td>
            <p style="font-weight: bold; margin: 0 0 2px 0; font-size: 10.5pt; color: #0f172a;">
              CIUDADANOS: BANESCO BANCO UNIVERSAL, C.A.
            </p>
            <p style="color: #334155; margin: 0 0 6px 0; font-size: 9.5pt;">
              Gerencia de Auditoría Interna y Unidad de Prevención y Control LC/FT (UPCLC/FT) Banesco Banco Universal
            </p>
            <div style="background-color: #f8fafc; border: 1pt solid #cbd5e1; border-left: 3.5pt solid #0f766e; padding: 7px 10px; font-weight: bold; font-size: 9.5pt; color: #0f172a; text-align: justify;">
              ASUNTO: CARTA DE RESPUESTA FORMAL Y SÍNTESIS DE AUDITORÍA BANCARIA &mdash; JUSTIFICACIÓN DE FONDOS MOVILIZADOS ($2.912.368,95 USD / Bs. 1.966.597.105,35) VS ESTADOS FINANCIEROS (CUENTAS CORRIENTES N° ${company.banescoAccountVES} EN VES Y N° ${company.banescoAccountUSD} EN USD CONVENIO 20).
            </div>
          </td>
        </tr>
      </table>

      <p style="text-align: justify; margin-bottom: 10px; font-size: 9.5pt;">
        En representación legal de <strong>${company.name}</strong> (R.I.F. ${company.rif}), damos formal respuesta a su requerimiento informando que <strong>NO EXISTE OMISIÓN DE INGRESOS NI DIFERENCIA NO JUSTIFICADA</strong>. Nuestra empresa opera exclusivamente como <strong>INTERMEDIARIA COMERCIAL Y MANDANTE EN LA COMPRA DE CAFÉ VERDE 100% NACIONAL EN VENEZUELA</strong> para torrefactoras e industrias venezolanas. No importamos café de Colombia ni del exterior; todo el café se adquiere en el mercado nacional a tipo de cambio oficial publicado por el Banco Central de Venezuela (BCV). La movilización bancaria acumulada se justifica con total solidez técnica y contable:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 9pt; background-color: #f8fafc; border: 1pt solid #cbd5e1;">
        <tr>
          <td style="padding: 7px 9px; border-bottom: 1pt solid #e2e8f0;">
            <strong>1. Anticipos de Clientes Jurídicos en Bolívares (78,41% &mdash; Bs. 1.542.017.092,63 / $2.270.486,23 USD):</strong><br>
            Fondos recibidos de compradores bajo Contrato Marco de Intermediación. Registrados como <em>Pasivos Corrientes Exigibles en Café</em> bajo NIIF 15 / Sección 23. Se sustituyen por factura fiscal SENIAT en Octubre 2026 con la entrega del café.
          </td>
        </tr>
        <tr>
          <td style="padding: 7px 9px; border-bottom: 1pt solid #e2e8f0;">
            <strong>2. Reintegros Capital Mutuo Manuel Becerra (9,48% &mdash; Bs. 186.376.000,00 / $286.228,93 USD):</strong><br>
            Amortización de Activo Financiero de la Línea de Crédito Rotativa suscrita con el socio Manuel Becerra. Disminuyen la Cuenta por Cobrar en balance. No constituye venta ni ingreso.
          </td>
        </tr>
        <tr>
          <td style="padding: 7px 9px; border-bottom: 1pt solid #e2e8f0;">
            <strong>3. Transferencias Cuentas Propias Agrícola Oni (10,61% &mdash; Bs. 208.708.057,73 / $308.317,80 USD):</strong><br>
            Traspasos de tesorería interna desde Provincial, Mercantil, Plaza y Bancamiga mismo RIF J-50145638-0. Impacto patrimonial neto: Bs. 0,00.
          </td>
        </tr>
        <tr>
          <td style="padding: 7px 9px; border-bottom: 1pt solid #e2e8f0;">
            <strong>4. Aportes Operativos Accionista / Personas Naturales (1,50% &mdash; Bs. 29.495.954,99 / $47.335,99 USD):</strong><br>
            Inyecciones de liquidez Presidente Sr. Elias Rafael Trías Abreu y anticipos de compradores personas naturales.
          </td>
        </tr>
        <tr>
          <td style="padding: 7px 9px; border-bottom: 1pt solid #e2e8f0;">
            <strong>5. Ingresos Reales Declarados en EEFF (Bs. 92.641.520,01 / $116.531,68 USD):</strong><br>
            Servicios Agrícolas facturados ($78,72M) + Intereses Ganados Mutuo ($13,92M), 100% idéntico al Estado de Resultados al 31/08/2026.
          </td>
        </tr>
        <tr>
          <td style="padding: 7px 9px;">
            <strong>6. Operaciones Mesa Cambiaria Banesco ($556.890,45 USD) y Sustento Legal (Acta 2021):</strong><br>
            Divisas liquidadas e invertidas 100% en Venezuela en insumos agrícolas, fletes terrestres y servicios técnicos. Acta Constitutiva de 16/09/2021 (Tomo 44-A, N° 12) autoriza la intermediación de café y pertenece 100% al Sr. ELÍAS RAFAEL TRÍAS ABREU (C.I. V-23.997.829).
          </td>
        </tr>
      </table>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; background-color: #f0fdf4; border: 1.5pt solid #16a34a;">
        <tr>
          <td style="padding: 9px; text-align: center; color: #15803d;">
            <p style="margin: 0; font-size: 10pt; font-weight: bold; text-transform: uppercase;">
              🎯 CUADRE DEFINITIVO DE AUDITORÍA BANESCO &mdash; DIFERENCIA FINAL POR OMISIÓN DE INGRESOS: BS. 0,00 ($0,00 USD)
            </p>
            <p style="margin: 3px 0 0 0; font-size: 8.5pt; color: #166534;">
              Conciliación Auditada al 100% &middot; Explicación Total del Monto Exigido de $2.912.368,95 USD (Bs. 1.966.597.105,35)
            </p>
          </td>
        </tr>
      </table>

      <p style="font-size: 9pt; margin-bottom: 15px; color: #334155; text-align: justify;">
        Constatamos la autenticidad de los soportes anexos (facturas, guías y conciliación) adjuntos a la presente comunicación.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 25px;">
        <tr>
          <td style="text-align: center;">
            <p style="margin: 0 0 35px 0; font-size: 9.5pt; color: #334155;">Atentamente,</p>
            <div style="display: inline-block; border-top: 1.5pt solid #0f172a; width: 300px; padding-top: 6px;">
              <p style="margin: 0; font-weight: bold; font-size: 10.5pt; color: #0f172a;">
                SR. ELÍAS RAFAEL TRÍAS ABREU
              </p>
              <p style="margin: 2px 0 0 0; font-size: 9pt; color: #475569;">
                Presidente y Representante Legal &middot; C.I. V-23.997.829
              </p>
              <p style="margin: 2px 0 0 0; font-size: 9pt; font-weight: bold; color: #0f766e;">
                ${company.name} &middot; R.I.F. ${company.rif}
              </p>
            </div>
          </td>
        </tr>
      </table>

      <p style="margin-top: 20px; text-align: center; font-size: 8pt; color: #64748b; border-top: 1pt solid #e2e8f0; padding-top: 6px;">
        DOCUMENTO OFICIAL DE RESPUESTA Y RESPALDO BANCARIO &middot; BANESCO BANCO UNIVERSAL, C.A.
      </p>
    </div>
  `;
}

/** Exportación individual de Carta 1 (Extendida) en formato Microsoft Word (.doc/.docx) */
export async function exportCarta1Word(company: CompanyProfile): Promise<void> {
  const html = getCarta1HtmlContent(company);
  await exportToWord(
    'Carta_1_Respuesta_Oficial_Banesco_Agricola_Oni.doc',
    'Carta 1 Respuesta Oficial Extendida Banesco 2026',
    html
  );
}

/** Exportación individual de Carta 1 (Extendida) en formato PDF (.pdf) */
export async function exportCarta1Pdf(company: CompanyProfile): Promise<void> {
  let element = document.getElementById('carta-banesco-completa-paper');
  let tempDiv: HTMLElement | null = null;
  if (!element) {
    tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0px';
    tempDiv.style.width = '800px';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.innerHTML = getCarta1HtmlContent(company);
    document.body.appendChild(tempDiv);
    element = tempDiv;
  }

  try {
    await downloadElementAsPdf(element, 'Carta_1_Respuesta_Oficial_Banesco_Agricola_Oni.pdf');
  } finally {
    if (tempDiv && tempDiv.parentNode) {
      tempDiv.parentNode.removeChild(tempDiv);
    }
  }
}

/** Exportación individual de Carta 2 (1 Página Ejecutiva) en formato Microsoft Word (.doc/.docx) */
export async function exportCarta2Word(company: CompanyProfile, currentRate: BcvRateItem): Promise<void> {
  const html = getCarta2HtmlContent(company, currentRate);
  await exportToWord(
    'Carta_2_Respuesta_Ejecutiva_1Pagina_Banesco_Agricola_Oni.doc',
    'Carta 2 Respuesta Ejecutiva 1 Página Banesco 2026',
    html
  );
}

/** Exportación individual de Carta 2 (1 Página Ejecutiva) en formato PDF (.pdf) */
export async function exportCarta2Pdf(company: CompanyProfile, currentRate: BcvRateItem): Promise<void> {
  let element = document.getElementById('carta-banesco-1-pagina-paper');
  let tempDiv: HTMLElement | null = null;
  if (!element) {
    tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0px';
    tempDiv.style.width = '750px';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.innerHTML = getCarta2HtmlContent(company, currentRate);
    document.body.appendChild(tempDiv);
    element = tempDiv;
  }

  try {
    await downloadElementAsPdf(element, 'Carta_2_Respuesta_Ejecutiva_1Pagina_Banesco_Agricola_Oni.pdf');
  } finally {
    if (tempDiv && tempDiv.parentNode) {
      tempDiv.parentNode.removeChild(tempDiv);
    }
  }
}

/** Genera la plantilla HTML formateada para los Separadores Físicos A - E de la Carpeta Banesco */
export function getSeparadoresHtmlContent(company: CompanyProfile, currentRate?: BcvRateItem): string {
  return `
    <div style="font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; color: #0f172a; line-height: 1.4;">
      
      <!-- ==================== SEPARADOR A ==================== -->
      <div style="padding: 30px; max-width: 750px; margin: 0 auto; page-break-after: always; height: 900px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
        <table style="width: 100%; border-collapse: collapse; border-bottom: 3pt double #0f766e; padding-bottom: 12px; margin-bottom: 25px;">
          <tr>
            <td style="vertical-align: top; text-align: left;">
              <h1 style="font-size: 18pt; color: #0f172a; margin: 0 0 3px 0; font-weight: bold; text-transform: uppercase;">
                ${company.name}
              </h1>
              <p style="font-size: 10pt; color: #334155; margin: 0; font-weight: bold;">
                R.I.F.: ${company.rif} &middot; CARPETA MAESTRA DE CUMPLIMIENTO BUST
              </p>
            </td>
            <td style="vertical-align: top; text-align: right;">
              <p style="font-size: 9pt; color: #0f766e; font-weight: bold; margin: 0;">
                BANESCO BANCO UNIVERSAL, C.A.<br>
                UNIDAD UPCLC/FT &middot; 2026
              </p>
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: #0f766e; color: #ffffff; padding: 18px 45px; border-radius: 8px; border: 2pt solid #0d9488; margin-bottom: 15px;">
            <h1 style="font-size: 32pt; margin: 0; font-weight: 900; letter-spacing: 2px;">
              SEPARADOR A
            </h1>
          </div>
          <h2 style="font-size: 16pt; color: #0f172a; margin: 10px 0 5px 0; text-transform: uppercase; font-weight: bold;">
            CARTAS OFICIALES DE RESPUESTA, NOTA DE CONCILIACIÓN BANCARIA Y DICTAMEN DE AUDITORÍA
          </h2>
          <p style="font-size: 11pt; color: #475569; max-width: 600px; margin: 0 auto; line-height: 1.5;">
            Justificación técnica y contable de los $2.912.368,95 USD (Bs. 1.966.597.105,35) movilizados en Banesco vs Ventas Reales Declaradas (Bs. 92.641.520,01). <strong>Diferencia por omisión de ingresos: Bs. 0,00</strong>.
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1.5pt solid #cbd5e1; border-left: 5pt solid #0f766e; padding: 18px 22px; margin-bottom: 25px; border-radius: 4px;">
          <p style="font-size: 11pt; font-weight: bold; color: #0f766e; margin: 0 0 10px 0; text-transform: uppercase;">
            📋 CONTENIDO DETALLADO DEL SEPARADOR A:
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>1. Carta Resumen Ejecutiva de 1 Página:</strong> Respuesta sintética oficial a la Gerencia de Auditoría Banesco.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>2. Carta Explicativa Extendida con Anexos:</strong> Exposición de motivos completa sobre la intermediación comercial de café nacional.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>3. Nota de Conciliación Bancaria Certificada:</strong> Conciliación Banesco al 31/08/2026 con diferencia comprobada de Bs. 0,00.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0;"><strong>4. Dictamen de Auditoría Fiscal SENIAT/SUDEBAN:</strong> Certificación bajo NIIF 15 / Sección 23 con Sello de Actuación CPC.</td>
            </tr>
          </table>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0; font-size: 9pt; color: #64748b;">
                DOCUMENTO OFICIAL DE SEPARACIÓN &middot; AGRÍCOLA ONI, C.A. &middot; BANESCO BANCO UNIVERSAL
              </p>
            </td>
          </tr>
        </table>
      </div>

      <!-- ==================== SEPARADOR B ==================== -->
      <div style="padding: 30px; max-width: 750px; margin: 0 auto; page-break-after: always; height: 900px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
        <table style="width: 100%; border-collapse: collapse; border-bottom: 3pt double #1e3a8a; padding-bottom: 12px; margin-bottom: 25px;">
          <tr>
            <td style="vertical-align: top; text-align: left;">
              <h1 style="font-size: 18pt; color: #0f172a; margin: 0 0 3px 0; font-weight: bold; text-transform: uppercase;">
                ${company.name}
              </h1>
              <p style="font-size: 10pt; color: #334155; margin: 0; font-weight: bold;">
                R.I.F.: ${company.rif} &middot; CARPETA MAESTRA DE CUMPLIMIENTO BUST
              </p>
            </td>
            <td style="vertical-align: top; text-align: right;">
              <p style="font-size: 9pt; color: #1e3a8a; font-weight: bold; margin: 0;">
                BANESCO BANCO UNIVERSAL, C.A.<br>
                UNIDAD UPCLC/FT &middot; 2026
              </p>
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: #1e3a8a; color: #ffffff; padding: 18px 45px; border-radius: 8px; border: 2pt solid #1d4ed8; margin-bottom: 15px;">
            <h1 style="font-size: 32pt; margin: 0; font-weight: 900; letter-spacing: 2px;">
              SEPARADOR B
            </h1>
          </div>
          <h2 style="font-size: 16pt; color: #0f172a; margin: 10px 0 5px 0; text-transform: uppercase; font-weight: bold;">
            RESPALDO DE ANTICIPOS DE CLIENTES JURÍDICOS (78,41% DEL TOTAL MOVILIZADO)
          </h2>
          <p style="font-size: 11pt; color: #475569; max-width: 600px; margin: 0 auto; line-height: 1.5;">
            Soportes de transferencias en bolívares por <strong>Bs. 1.542.017.092,63 ($2.270.486,23 USD)</strong> abonados por empresas torrefactoras y distribuidoras compradoras de café verde nacional.
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1.5pt solid #cbd5e1; border-left: 5pt solid #1e3a8a; padding: 18px 22px; margin-bottom: 25px; border-radius: 4px;">
          <p style="font-size: 11pt; font-weight: bold; color: #1e3a8a; margin: 0 0 10px 0; text-transform: uppercase;">
            📋 CONTENIDO DETALLADO DEL SEPARADOR B:
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>1. 6 Contratos Marco de Intermediación Comercial:</strong> Suscritos con empresas compradoras para procura de café nacional.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>2. Comprobantes Bancarios de Origen:</strong> Transferencias recibidas en Banesco, BFC y Provincial.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>3. Fichas de Identificación de Clientes Jurídicos:</strong> Datos corporativos de las 6 empresas mandantes.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0;"><strong>4. Expediente de Identidad SENIAT:</strong> Copia de RIF vigente y Cédula de Identidad de Representantes Legales.</td>
            </tr>
          </table>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0; font-size: 9pt; color: #64748b;">
                DOCUMENTO OFICIAL DE SEPARACIÓN &middot; AGRÍCOLA ONI, C.A. &middot; BANESCO BANCO UNIVERSAL
              </p>
            </td>
          </tr>
        </table>
      </div>

      <!-- ==================== SEPARADOR C ==================== -->
      <div style="padding: 30px; max-width: 750px; margin: 0 auto; page-break-after: always; height: 900px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
        <table style="width: 100%; border-collapse: collapse; border-bottom: 3pt double #b45309; padding-bottom: 12px; margin-bottom: 25px;">
          <tr>
            <td style="vertical-align: top; text-align: left;">
              <h1 style="font-size: 18pt; color: #0f172a; margin: 0 0 3px 0; font-weight: bold; text-transform: uppercase;">
                ${company.name}
              </h1>
              <p style="font-size: 10pt; color: #334155; margin: 0; font-weight: bold;">
                R.I.F.: ${company.rif} &middot; CARPETA MAESTRA DE CUMPLIMIENTO BUST
              </p>
            </td>
            <td style="vertical-align: top; text-align: right;">
              <p style="font-size: 9pt; color: #b45309; font-weight: bold; margin: 0;">
                BANESCO BANCO UNIVERSAL, C.A.<br>
                UNIDAD UPCLC/FT &middot; 2026
              </p>
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: #b45309; color: #ffffff; padding: 18px 45px; border-radius: 8px; border: 2pt solid #d97706; margin-bottom: 15px;">
            <h1 style="font-size: 32pt; margin: 0; font-weight: 900; letter-spacing: 2px;">
              SEPARADOR C
            </h1>
          </div>
          <h2 style="font-size: 16pt; color: #0f172a; margin: 10px 0 5px 0; text-transform: uppercase; font-weight: bold;">
            RESPALDO DE REINTEGROS DE CAPITAL Y ANTICIPOS DE PERSONAS NATURALES / PRODUCTORES
          </h2>
          <p style="font-size: 11pt; color: #475569; max-width: 600px; margin: 0 auto; line-height: 1.5;">
            Amortizaciones de la Línea de Crédito Mutuo Manuel Becerra (<strong>$286.228,93 USD / Bs. 186,37M</strong>) y Aportes Operativos del Presidente Accionista Elías Trías (<strong>$47.335,99 USD / Bs. 29,49M</strong>).
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1.5pt solid #cbd5e1; border-left: 5pt solid #b45309; padding: 18px 22px; margin-bottom: 25px; border-radius: 4px;">
          <p style="font-size: 11pt; font-weight: bold; color: #b45309; margin: 0 0 10px 0; text-transform: uppercase;">
            📋 CONTENIDO DETALLADO DEL SEPARADOR C:
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>1. Contrato Mutuo Cambiario Manuel Becerra:</strong> Documento legal y tabla de amortización de la línea de crédito rotativa.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>2. Comprobantes de Reintegros de Capital:</strong> Transferencias Banesco disminuyendo la Cta. por Cobrar en balance.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>3. Aportes Operativos de Accionista:</strong> Respaldo de inyecciones de liquidez de Elías Rafael Trías Abreu.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0;"><strong>4. Fichas y Guías SICA/SUNAGRO:</strong> Recibos de depósitos y guías de movilización de café con productores naturales.</td>
            </tr>
          </table>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0; font-size: 9pt; color: #64748b;">
                DOCUMENTO OFICIAL DE SEPARACIÓN &middot; AGRÍCOLA ONI, C.A. &middot; BANESCO BANCO UNIVERSAL
              </p>
            </td>
          </tr>
        </table>
      </div>

      <!-- ==================== SEPARADOR D ==================== -->
      <div style="padding: 30px; max-width: 750px; margin: 0 auto; page-break-after: always; height: 900px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
        <table style="width: 100%; border-collapse: collapse; border-bottom: 3pt double #047857; padding-bottom: 12px; margin-bottom: 25px;">
          <tr>
            <td style="vertical-align: top; text-align: left;">
              <h1 style="font-size: 18pt; color: #0f172a; margin: 0 0 3px 0; font-weight: bold; text-transform: uppercase;">
                ${company.name}
              </h1>
              <p style="font-size: 10pt; color: #334155; margin: 0; font-weight: bold;">
                R.I.F.: ${company.rif} &middot; CARPETA MAESTRA DE CUMPLIMIENTO BUST
              </p>
            </td>
            <td style="vertical-align: top; text-align: right;">
              <p style="font-size: 9pt; color: #047857; font-weight: bold; margin: 0;">
                BANESCO BANCO UNIVERSAL, C.A.<br>
                UNIDAD UPCLC/FT &middot; 2026
              </p>
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: #047857; color: #ffffff; padding: 18px 45px; border-radius: 8px; border: 2pt solid #059669; margin-bottom: 15px;">
            <h1 style="font-size: 32pt; margin: 0; font-weight: 900; letter-spacing: 2px;">
              SEPARADOR D
            </h1>
          </div>
          <h2 style="font-size: 16pt; color: #0f172a; margin: 10px 0 5px 0; text-transform: uppercase; font-weight: bold;">
            ADQUISICIÓN DE DIVISAS EN MESA DE CAMBIO BANESCO CONVENIO 20 Y DESTINO DE FONDOS
          </h2>
          <p style="font-size: 11pt; color: #475569; max-width: 600px; margin: 0 auto; line-height: 1.5;">
            Comprobantes de divisas adjudicadas en Banesco (<strong>$556.890,45 USD</strong>) e invertidas 100% en Venezuela en insumos agrícolas, tolvas, sacos de yute y fletes pesados.
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1.5pt solid #cbd5e1; border-left: 5pt solid #047857; padding: 18px 22px; margin-bottom: 25px; border-radius: 4px;">
          <p style="font-size: 11pt; font-weight: bold; color: #047857; margin: 0 0 10px 0; text-transform: uppercase;">
            📋 CONTENIDO DETALLADO DEL SEPARADOR D:
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>1. Planillas de Adjudicación Cambiaria Banesco:</strong> Registro oficial de divisas liquidadas en Cta. Custodia USD.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>2. Débitos en VES y Acreditación en USD:</strong> Comprobantes bancarios Banesco Convenio 20.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>3. Facturas de Proveedores Nacionales:</strong> Adquisición de tolvas, secadoras, sacos de yute y repuestos.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0;"><strong>4. Comprobantes de Fletes y Transporte Carga:</strong> Pagos de fletes pesados consumidos 100% en territorio nacional.</td>
            </tr>
          </table>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0; font-size: 9pt; color: #64748b;">
                DOCUMENTO OFICIAL DE SEPARACIÓN &middot; AGRÍCOLA ONI, C.A. &middot; BANESCO BANCO UNIVERSAL
              </p>
            </td>
          </tr>
        </table>
      </div>

      <!-- ==================== SEPARADOR E ==================== -->
      <div style="padding: 30px; max-width: 750px; margin: 0 auto; height: 900px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
        <table style="width: 100%; border-collapse: collapse; border-bottom: 3pt double #4338ca; padding-bottom: 12px; margin-bottom: 25px;">
          <tr>
            <td style="vertical-align: top; text-align: left;">
              <h1 style="font-size: 18pt; color: #0f172a; margin: 0 0 3px 0; font-weight: bold; text-transform: uppercase;">
                ${company.name}
              </h1>
              <p style="font-size: 10pt; color: #334155; margin: 0; font-weight: bold;">
                R.I.F.: ${company.rif} &middot; CARPETA MAESTRA DE CUMPLIMIENTO BUST
              </p>
            </td>
            <td style="vertical-align: top; text-align: right;">
              <p style="font-size: 9pt; color: #4338ca; font-weight: bold; margin: 0;">
                BANESCO BANCO UNIVERSAL, C.A.<br>
                UNIDAD UPCLC/FT &middot; 2026
              </p>
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: #4338ca; color: #ffffff; padding: 18px 45px; border-radius: 8px; border: 2pt solid #4f46e5; margin-bottom: 15px;">
            <h1 style="font-size: 32pt; margin: 0; font-weight: 900; letter-spacing: 2px;">
              SEPARADOR E
            </h1>
          </div>
          <h2 style="font-size: 16pt; color: #0f172a; margin: 10px 0 5px 0; text-transform: uppercase; font-weight: bold;">
            REGISTRO LEGAL Y ESTADOS FINANCIEROS AUDITADOS AL 31/08/2026
          </h2>
          <p style="font-size: 11pt; color: #475569; max-width: 600px; margin: 0 auto; line-height: 1.5;">
            Documentos constitutivos, RIF SENIAT, Balance General Dual, Estado de Resultados y Balance de Comprobación Auditado al 31/08/2026.
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1.5pt solid #cbd5e1; border-left: 5pt solid #4338ca; padding: 18px 22px; margin-bottom: 25px; border-radius: 4px;">
          <p style="font-size: 11pt; font-weight: bold; color: #4338ca; margin: 0 0 10px 0; text-transform: uppercase;">
            📋 CONTENIDO DETALLADO DEL SEPARADOR E:
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>1. Acta Constitutiva y Estatutos Sociales:</strong> Registro Mercantil Primero del Edo. Anzoátegui (16/09/2021, Tomo 44-A, N° 12).</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>2. RIF SENIAT Vigente:</strong> Registro de Información Fiscal J-50145638-0 actualizado.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1pt solid #e2e8f0;"><strong>3. Balance General y Estado de Resultados Dual:</strong> Cifras expresadas en Bs. y USD a Tasa Oficial BCV al 31/08/2026.</td>
            </tr>
            <tr>
              <td style="padding: 6px 0;"><strong>4. Balance de Comprobación Auditado & Libro Auxiliar:</strong> Libro Auxiliar de Banco Banesco y Estado de Cuentas.</td>
            </tr>
          </table>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0; font-size: 9pt; color: #64748b;">
                DOCUMENTO OFICIAL DE SEPARACIÓN &middot; AGRÍCOLA ONI, C.A. &middot; BANESCO BANCO UNIVERSAL
              </p>
            </td>
          </tr>
        </table>
      </div>

    </div>
  `;
}

/** Exporta el juego completo de Separadores Físicos A-E en Microsoft Word (.doc/.docx) */
export async function exportSeparadoresBanescoWord(company: CompanyProfile, currentRate?: BcvRateItem): Promise<void> {
  const html = getSeparadoresHtmlContent(company, currentRate);
  await exportToWord(
    'Separadores_Oficiales_Carpeta_Banesco_A-E_Agricola_Oni.doc',
    'Separadores Oficiales Carpeta Banesco A-E',
    html
  );
}

/** Exporta el juego completo de Separadores Físicos A-E en archivo PDF (.pdf) */
export async function exportSeparadoresBanescoPdf(company: CompanyProfile, currentRate?: BcvRateItem): Promise<void> {
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0px';
  tempDiv.style.width = '750px';
  tempDiv.style.backgroundColor = '#ffffff';
  tempDiv.innerHTML = getSeparadoresHtmlContent(company, currentRate);
  document.body.appendChild(tempDiv);

  try {
    await downloadElementAsPdf(tempDiv, 'Separadores_Oficiales_Carpeta_Banesco_A-E_Agricola_Oni.pdf');
  } finally {
    if (tempDiv && tempDiv.parentNode) {
      tempDiv.parentNode.removeChild(tempDiv);
    }
  }
}


