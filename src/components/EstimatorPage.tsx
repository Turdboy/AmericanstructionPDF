import React, { useState } from "react";
import * as XLSX from "xlsx";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const EstimatorPage = () => {
  const [tableData, setTableData] = useState<any[][]>([]);
  const [finalEstimate, setFinalEstimate] = useState<number | null>(null);
  const [showPrice, setShowPrice] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      setTableData(jsonData);

      // ✅ Extract Final Estimate from cell J35
      const estimateCell = worksheet["J35"];
      if (estimateCell && typeof estimateCell.v === "number") {
        const final = estimateCell.v;
        setFinalEstimate(final);
        setShowPrice(false);

        try {
          await addDoc(collection(db, "estimates"), {
            value: final,
            createdAt: new Date().toISOString()
          });
          console.log("✅ Final estimate saved to Firestore:", final);
        } catch (error) {
          console.error("❌ Firestore save error:", error);
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md p-6 rounded">
      <h1 className="text-3xl font-bold mb-6 text-[#002147]">Upload Estimating Spreadsheet</h1>

      {/* File Upload */}
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-6 block"
      />

      {/* Table Display */}
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

      {/* Generate Final Prices Button */}
      {finalEstimate !== null && !showPrice && (
        <button
          onClick={() => setShowPrice(true)}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Generate Final Prices
        </button>
      )}

      {/* Final Price Display */}
      {showPrice && finalEstimate !== null && (
        <div className="mt-4 border border-green-400 bg-green-50 text-green-800 rounded p-4">
          <h2 className="text-xl font-bold mb-2">Final Estimate Summary</h2>
          <p className="text-lg">
            <span className="font-semibold">Final Estimate Total:</span>{" "}
            ${finalEstimate.toLocaleString()}
          </p>
        </div>
      )}
      {showPrice && finalEstimate !== null && (
  <>
    <div className="mt-4 border border-green-400 bg-green-50 text-green-800 rounded p-4">
      <h2 className="text-xl font-bold mb-2">Final Estimate Summary</h2>
      <p className="text-lg">
        <span className="font-semibold">Final Estimate Total:</span>{" "}
        ${finalEstimate.toLocaleString()}
      </p>
    </div>

    <button
  onClick={() => {
    if (finalEstimate !== null) {
      localStorage.setItem("finalEstimate", JSON.stringify(finalEstimate));
      window.location.href = "/inspection";
    }
  }}
  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
>
  Push to Inspection Form
</button>
  </>
)}

    </div>
  );
};

export default EstimatorPage;
