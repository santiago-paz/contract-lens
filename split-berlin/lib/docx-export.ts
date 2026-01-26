import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun, PageOrientation } from "docx";
import { saveAs } from "file-saver";
import { ContractNodeData } from "@/types/contract";

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

export const exportToDocx = async (nodes: ContractNodeData[]) => {
  const flatNodes = flattenNodes(nodes);

  // A4 Page Width in DXA = 11906
  // Standard Margins (1 inch) = 1440 DXA
  // Usable Width = 11906 - (1440 * 2) = 9026 DXA
  const USABLE_WIDTH = 9026;
  const COLUMN_WIDTH = USABLE_WIDTH / 2;

  const tableRows = flatNodes.map((node) => {
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: COLUMN_WIDTH,
            type: WidthType.DXA,
          },
          children: [new Paragraph({
            children: [new TextRun({ text: node.contentLeft || "" })]
          })],
        }),
        new TableCell({
          width: {
            size: COLUMN_WIDTH,
            type: WidthType.DXA,
          },
          children: [new Paragraph({
            children: [new TextRun({ text: node.contentRight || "" })]
          })],
        }),
      ],
    });
  });

  const table = new Table({
    // Using columnWidths is the recommended way in docx.js to ensure correct grid generation
    columnWidths: [COLUMN_WIDTH, COLUMN_WIDTH],
    rows: tableRows,
    // We omit the 'width' property on the table itself to let columnWidths dictate the layout
    // or we can set it to 100% explicitly if needed, but let's try the columnWidths approach first
    // as suggested by documentation for fixed layouts.
    width: {
        size: 100,
        type: WidthType.PERCENTAGE,
    }
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
