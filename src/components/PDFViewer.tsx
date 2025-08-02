import { useEffect, useRef } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { generatePDFDefinition } from "../utils/pdfGenerator"; // make sure this exists and works

pdfMake.vfs = pdfFonts.vfs;

const PDFViewer = ({ formData }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!formData) return;

    const renderPDF = async () => {
      const docDefinition = await generatePDFDefinition(formData);
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);

      pdfDocGenerator.getDataUrl((dataUrl) => {
        const iframe = document.createElement("iframe");
        iframe.src = dataUrl;
        iframe.width = "100%";
        iframe.height = "600px";
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(iframe);
      });
    };

    renderPDF();
  }, [formData]);

  return <div ref={containerRef} />;
};

export default PDFViewer;
