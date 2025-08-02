import React, { useState } from "react";
import * as XLSX from "xlsx";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const EstimatorPage = () => {
  const [tableData, setTableData] = useState<any[][]>([]);
  const [finalEstimate, setFinalEstimate] = useState<number | null>(null);
  const [spreadsheetUploaded, setSpreadsheetUploaded] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `spreadsheets/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const spreadsheetUrl = await getDownloadURL(storageRef);
      console.log("📁 Uploaded XLSX file URL:", spreadsheetUrl);

      // Read file data
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        setTableData(jsonData);

        // Extract J35 cell
        const estimateCell = worksheet["J35"];
        if (estimateCell && typeof estimateCell.v === "number") {
          const final = estimateCell.v;
          setFinalEstimate(final);
          setSpreadsheetUploaded(true);
          localStorage.setItem("finalEstimate", JSON.stringify(final));

          await addDoc(collection(db, "estimates"), {
            value: final,
            createdAt: serverTimestamp(),
          });

          console.log("✅ Final estimate saved to Firestore:", final);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("❌ Upload or parsing error:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md p-6 rounded min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-[#002147]">Upload Estimating Spreadsheet</h1>

      {tableData.length === 0 && (
        <div className="text-center text-gray-600 mb-4">
          Please upload your estimating spreadsheet to begin.
        </div>
      )}

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-6 block"
      />

      {tableData.length > 0 && (
        <div className="overflow-auto max-h-[60vh] border rounded">
          <table className="min-w-full text-sm text-left border-collapse">
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className="border-b">
                  {row.map((cell, j) => (
                    <td key={j} className="border px-2 py-1 whitespace-nowrap">
                      {typeof cell === "number" ? cell.toFixed(2) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {spreadsheetUploaded && finalEstimate !== null && (
        <div className="mt-4 border border-green-400 bg-green-50 text-green-800 rounded p-4">
          <h2 className="text-xl font-bold mb-2">Final Estimate Summary</h2>
          <p className="text-lg">
            <span className="font-semibold">Final Estimate Total:</span>{" "}
            ${finalEstimate.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default EstimatorPage;
