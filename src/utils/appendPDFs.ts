// utils/appendPDFs.ts
import { PDFDocument } from "pdf-lib";

export async function appendPDFs(mainBase64: string, attachedPDFBase64s: string[]) {
  const mainPdf = await PDFDocument.load(Buffer.from(mainBase64, "base64"));

  for (const pdfBase64 of attachedPDFBase64s) {
    const pdfBytes = Buffer.from(pdfBase64, "base64");
    const attachment = await PDFDocument.load(pdfBytes);
    const copiedPages = await mainPdf.copyPages(attachment, attachment.getPageIndices());
    copiedPages.forEach((page) => mainPdf.addPage(page));
  }

  const mergedBytes = await mainPdf.save();
  return Buffer.from(mergedBytes).toString("base64");
}
