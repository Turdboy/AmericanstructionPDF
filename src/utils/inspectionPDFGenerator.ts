export const generateFullPDF = ({ coverData, formData }) => {
  const docDefinition = {
    content: [
      ...generateCoverPage(coverData),  // ⬅️ you already have this
      { text: "Inspection Details", style: "header" },
      {
        table: {
          widths: ["30%", "70%"],
          body: [
            ["Surface Type", formData.surface || "N/A"],
            ["Square Footage", formData.sqft || "N/A"],
            ["Special Instructions", formData.notes || "N/A"],
          ]
        }
      }
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 20, 0, 10] },
    }
  };

  pdfMake.createPdf(docDefinition).download("inspection.pdf");
};
