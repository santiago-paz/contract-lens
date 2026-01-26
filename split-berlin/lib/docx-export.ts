import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun, TableLayoutType } from "docx";
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

  // Using DXA units for reliable width across different viewers (Word, Google Docs, etc.)
  // 9638 DXA is approximately the full printable width of an A4 page with standard margins
  const TOTAL_WIDTH_DXA = 9638;
  const COLUMN_WIDTH_DXA = TOTAL_WIDTH_DXA / 2;

  const tableRows = flatNodes.map((node) => {
    return new TableRow({
      children: [
        new TableCell({
          width: {
            size: COLUMN_WIDTH_DXA,
            type: WidthType.DXA,
          },
          children: [new Paragraph({
            children: [new TextRun({ text: node.contentLeft || "" })]
          })],
        }),
        new TableCell({
          width: {
            size: COLUMN_WIDTH_DXA,
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
    layout: TableLayoutType.FIXED,
    width: {
      size: TOTAL_WIDTH_DXA,
      type: WidthType.DXA,
    },
    rows: tableRows,
  });

  const doc = new Document({
    sections: [
      {
        children: [table],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "contract-export.docx");
};
