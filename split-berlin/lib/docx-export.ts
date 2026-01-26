import { ContractNodeData, NodeType } from "@/types/contract";
import { AlignmentType, Document, Packer, PageOrientation, Paragraph, Table, TableCell, TableLayoutType, TableRow, TextRun, WidthType } from "docx";
import { saveAs } from "file-saver";

const flattenNodes = (nodes: ContractNodeData[]): ContractNodeData[] => {
  let flat: ContractNodeData[] = [];
  for (const node of nodes) {
    flat.push(node);
    if (node.children && node.children.length > 0) {
      flat = flat.concat(flattenNodes(node.children));
    }
  }
  return flat;
};

const getNodeStyle = (type: NodeType) => {
  switch (type) {
    case 'title':
      return {
        size: 32, // 16pt
        bold: true,
        spacing: { after: 240, before: 240 },
        alignment: AlignmentType.CENTER
      };
    case 'intro':
      return {
        size: 22, // 11pt
        italics: true,
        spacing: { after: 120 }
      };
    case 'clause':
      return {
        size: 24, // 12pt
        bold: true,
        spacing: { before: 240, after: 120 }
      };
    case 'subclause':
      return {
        size: 24, // 12pt
        spacing: { after: 120 }
      };
    case 'item':
      return {
        size: 22, // 11pt
        indent: { left: 360 },
        spacing: { after: 80 }
      };
    case 'subitem':
      return {
        size: 20, // 10pt
        indent: { left: 720 },
        spacing: { after: 80 }
      };
    case 'final_clause':
      return {
        size: 24, // 12pt
        bold: true,
        spacing: { before: 240, after: 120 }
      };
    default:
      return { size: 24, spacing: { after: 120 } };
  }
};

const createContentParagraphs = (nodes: ContractNodeData[], side: 'left' | 'right'): Paragraph[] => {
  return nodes.map(node => {
    const style = getNodeStyle(node.type);
    const text = side === 'left' ? node.contentLeft : node.contentRight;

    // Skip empty paragraphs if desired, but here we render them to keep vertical space if user typed spaces
    // Or we could check if text is empty.

    return new Paragraph({
      alignment: style.alignment,
      spacing: style.spacing,
      indent: style.indent,
      children: [
        new TextRun({
          text: text || "",
          size: style.size,
          bold: style.bold,
          italics: style.italics,
        })
      ]
    });
  });
};

export const exportToDocx = async (nodes: ContractNodeData[]) => {
  const flatNodes = flattenNodes(nodes);

  // A4 Page Width in DXA = 11906
  // Standard Margins (1 inch) = 1440 DXA
  // Usable Width = 11906 - (1440 * 2) = 9026 DXA
  const USABLE_WIDTH = 9026;
  const COLUMN_WIDTH = USABLE_WIDTH / 2;

  const leftParagraphs = createContentParagraphs(flatNodes, 'left');
  const rightParagraphs = createContentParagraphs(flatNodes, 'right');

  const row = new TableRow({
    children: [
      new TableCell({
        width: {
          size: COLUMN_WIDTH,
          type: WidthType.DXA,
        },
        children: leftParagraphs,
      }),
      new TableCell({
        width: {
          size: COLUMN_WIDTH,
          type: WidthType.DXA,
        },
        children: rightParagraphs,
      }),
    ],
  });

  const table = new Table({
    layout: TableLayoutType.FIXED,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    columnWidths: [COLUMN_WIDTH, COLUMN_WIDTH],
    rows: [row],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.PORTRAIT,
            },
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [table],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "contract-export.docx");
};
