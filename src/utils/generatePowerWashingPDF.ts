import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

import { renderCoverElements } from "./renderCoverElements";

export const generatePowerWashingPDF = (formData = {}, coverDesign = {}) => {
  const coverElements = renderCoverElements({
    texts: coverDesign.texts || [],
    shapes: coverDesign.shapes || [],
    designs: coverDesign.designs || [],
    images: coverDesign.images || [],
  });

  const docDefinition = {
    pageSize: { width: 428, height: 554 },
    pageMargins: [0, 0, 0, 0],
    content: [
      ...coverElements,
      {
        pageBreak: "before",
        stack: [
          { text: "Power Washing Quote", style: "header" },
          { text: `Surface Type: ${formData.surface || "N/A"}` },
          { text: `Square Footage: ${formData.sqft || "N/A"}` },
          { text: `Special Instructions: ${formData.notes || "N/A"}` }
        ]
      }
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        margin: [0, 0, 0, 10]
      }
    }
  };

  pdfMake.createPdf(docDefinition).download("powerwashing_quote.pdf");
};
