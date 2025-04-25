
import { generatePDF } from "../utils/pdfGenerator";
import { prepareImages } from "../utils/pdfGenerator";
import RoofSection from './RoofSection';
import React, { useEffect, useState } from 'react';
import { db, storage, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth"; // Add this if needed
import { getDocs, query, orderBy, limit } from "firebase/firestore";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import { saveInspectionDraftToFirestore } from "../services/inspectionService";
import { fetchImageAsBase64 } from "../utils/pdfGenerator"; // make sure this is imported












const DEFECT_IMAGE_FIELDS = [
  "section",
  "area",
  "caption",
  "description",
  "cause",
  "impact",
  "solution",
];


interface InspectionFormProps {
  onSubmit: (data: any) => void;
}


const uploadImagesAndGetDownloadUrls = async (images, folder) => {
  const uploaded = [];
  for (const img of images) {
    if (!img.base64) continue;

    const blob = await fetch(img.base64).then((res) => res.blob());
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
    const storageRef = ref(storage, `${folder}/${filename}`);

    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    uploaded.push({ ...img, url });
  }
  return uploaded;
};


const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  // Optional: customize limits per field
  const wordLimits: Record<string, number> = {
    propertyName: 5,
    propertyAddress: 5,
    clientName: 5,
    clientcontactinfo: 5,
    inspectionDate: 5,
    inspectorName: 5,
    inspectorCompany: 5,
    inspectorcontactinfo: 5,
    temperature: 1, // 👈 Add this line
    

  };
  DEFECT_IMAGE_FIELDS.forEach((field) => {
    wordLimits[field] = 14;
  });
  

  const InspectionForm: React.FC<InspectionFormProps> = ({ onSubmit }) => {
    const location = useLocation();


    // State to store form data
    const [formData, setFormData] = useState({

      
        // Property Details
        propertyName: '',
        propertyAddress: '',
        clientname:'',
        clientcontactinfo: '',
        inspectionDate: '',
        inspectorName: '',
        inspectorCompany: '',
        inspectorcontactinfo:'',
        
        // Weather Conditions
        weatherCondition: '',
        temperature: '',
        
        // Roof Type and Age
        roofType: '',
        roofAge: '',
        
    });


    const [tableData, setTableData] = useState<any[][]>([]);


    const handleRoofSectionChange = (index, updatedSection) => {
      const updatedSections = [...roofSections];
      updatedSections[index] = updatedSection;
      setRoofSections(updatedSections);
    };
    
    



    const [roofSections, setRoofSections] = useState([
      {


        sectionName: '',
        roofLength: null,
        roofWidth: null,
        
roofSquareFootage: '',



        // General Observations
        overallCondition: '',
        leaks: '',
        leaksDescription: '',
        pondingWater: '',
        pondingWaterDescription: '',
        debrisAccumulation: '',
        debrisDescription: '',
        vegetationGrowth: '',
        vegetationDescription: '',
        accessibilityIssues: '',
        accessibilityDescription: '',
    
        // Interior Evaluation
        undersideAccessible: '',
        deckCondition: '',
        deckDamage: '',
        deckMoisture: '',
    
        // Warranty Coverage
        warrantyCoverage: '',
        warrantyTerm: '',
        warrantyType: '',
        fmInsured: '',
    
        // Roofing Membrane/Surface
        membraneMaterial: '',
        membraneCondition: '',
        seamsCondition: '',
        fastenersCondition: '',
        rustedFasteners: '',
        looseFasteners: '',
        missingFasteners: '',
        granulesCondition: '',
        coatingCondition: ''
      }
    ]);



    const [finalEstimate, setFinalEstimate] = useState<number | null>(null);


    const [spreadsheetUploaded, setSpreadsheetUploaded] = useState(false);

    const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);





    

    const emptyRoofSection = {

      sectionName: '',
roofLength: '',
roofWidth: '',
roofSquareFootage: '',


      overallCondition: '',
      leaks: '',
      leaksDescription: '',
      pondingWater: '',
      pondingWaterDescription: '',
      debrisAccumulation: '',
      debrisDescription: '',
      vegetationGrowth: '',
      vegetationDescription: '',
      accessibilityIssues: '',
      accessibilityDescription: '',
      undersideAccessible: '',
      deckCondition: '',
      deckDamage: '',
      deckMoisture: '',
      warrantyCoverage: '',
      warrantyTerm: '',
      warrantyType: '',
      fmInsured: '',
      membraneMaterial: '',
      membraneCondition: '',
      seamsCondition: '',
      fastenersCondition: '',
      rustedFasteners: '',
      looseFasteners: '',
      missingFasteners: '',
      granulesCondition: '',
      coatingCondition: ''
    };


    useEffect(() => {
      if (location.state?.data) {
        const {
          formData: savedFormData,
          roofSections: savedRoofSections,
          images = [],
          overviewImages = [],
          droneImages = [],
          spreadsheetUrl: savedSpreadsheetUrl, // ✅ Add this line
        } = location.state.data;
      
    
        const convert = async (images) =>
          await Promise.all(
            images.map(async (img) => ({
              ...img,
              url: img.url,
              base64: await fetchImageAsBase64(img.url),
            }))
          );
    
        const loadAllImages = async () => {
          const [defects, overview, drone] = await Promise.all([
            convert(images),
            convert(overviewImages),
            convert(droneImages),
          ]);
    
          setFormData((prev) => ({
            ...prev,
            ...savedFormData,
            images: defects,
            overviewImages: overview,
            droneImages: drone,
          }));



          if (savedSpreadsheetUrl) {
            try {
              const response = await fetch(savedSpreadsheetUrl);
              const buffer = await response.arrayBuffer();
              const workbook = XLSX.read(buffer, { type: "array" });
              const sheet = workbook.Sheets[workbook.SheetNames[0]];
              const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
              setTableData(jsonData);
              setSpreadsheetUrl(savedSpreadsheetUrl);
              setSpreadsheetUploaded(true);
          
              const estimateCell = sheet["J35"];
              if (estimateCell && typeof estimateCell.v === "number") {
                setFinalEstimate(estimateCell.v);
              } else if (location.state?.data?.finalEstimate) {
                setFinalEstimate(location.state.data.finalEstimate); // ✅ fallback
              }
            } catch (err) {
              console.error("❌ Failed to load spreadsheet from URL:", err);
              if (location.state?.data?.finalEstimate) {
                setFinalEstimate(location.state.data.finalEstimate); // ✅ fallback
              }
            }
          }
          
          



    
          setRoofSections(savedRoofSections || []);
          console.log("📸 Loaded and converted images to base64");
        };
    
        loadAllImages();
        console.log("✅ Inspection draft loaded from resume:", location.state.data);
      }
    
      const fetchFinalEstimate = async () => {
        try {
          const q = query(collection(db, "estimates"), orderBy("createdAt", "desc"), limit(1));
          const snapshot = await getDocs(q);
    
          if (!snapshot.empty) {
            const latest = snapshot.docs[0].data();
            if (latest.value) {
              setFinalEstimate(latest.value);
            } else {
              console.warn("Estimate found but no 'value' field.");
            }
          } else {
            console.warn("No estimates found in Firestore.");
          }
        } catch (err) {
          console.error("Error fetching estimate from Firestore:", err);
        }
      };
    
      fetchFinalEstimate();
    }, [location.state]);
    
    
    
    
      


    
    

    
    const handleChange = (e) => {
      const { name, value } = e.target;
      const wordLimit = wordLimits[name];
    
      // Prevent typing if word count is over the limit
      if (wordLimit && getWordCount(value) > wordLimit) {
        return; // Block input
      }
    
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    

    
  
    
    const handleSpreadsheetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
    
      // Upload the file to Firebase Storage
      const storageRef = ref(storage, `spreadsheets/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const spreadsheetUrl = await getDownloadURL(storageRef);
      console.log("📁 Uploaded XLSX file URL:", spreadsheetUrl);
    
      // Save spreadsheet URL to state so it can be saved to Firestore
      setSpreadsheetUrl(spreadsheetUrl); // <-- ✅ Add this state if it's not already declared
    
      // Read file for display & final estimate
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
        setTableData(jsonData);
    
        const estimateCell = worksheet["J35"];
        if (estimateCell && typeof estimateCell.v === "number") {
          const final = estimateCell.v;
          setFinalEstimate(final);
          setSpreadsheetUploaded(true);
          localStorage.setItem("finalEstimate", JSON.stringify(final));
    
          try {
            await addDoc(collection(db, "estimates"), {
              value: final,
              createdAt: serverTimestamp(),
            });
            console.log("✅ Final estimate saved to Firestore:", final);
          } catch (error) {
            console.error("❌ Firestore save error:", error);
          }
        }
      };
    
      reader.readAsArrayBuffer(file);
    };
    
    

    const handleSubmit = (e) => {
      e.preventDefault();
    
      const completeFormData = {
        ...formData,
        roofSections,
        images: formData.images || [],
        overviewImages: formData.overviewImages || [],
        droneImages: formData.droneImages || [],
      };
    
      // Determine correct final estimate
      const isResumedInspection = !!location.state?.data;
      const finalPriceToUse = isResumedInspection
        ? location.state.data.finalEstimate ?? null
        : finalEstimate;
    
      console.log("📄 PDF generated using:", {
        source: isResumedInspection ? "Saved Resume" : "Fresh Upload",
        finalEstimate: finalPriceToUse,
      });
    
      // 🔴 Call onSubmit (optional)
      onSubmit(completeFormData);
    
      // 🔵 Generate PDF with correct data
      generatePDF({ ...completeFormData, finalEstimate: finalPriceToUse });
    };
    
    
    
    
    


    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (!files.length) return;
      
        const readFileAsBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
      
        const newImages = await Promise.all(
          Array.from(files).map(async (file) => ({
            url: URL.createObjectURL(file),
            base64: await readFileAsBase64(file),
            section: "",
            area: "",
            caption: "",
            description: "",
            cause: "",
            impact: "",
            solution: ""
          }))
        );
      
        setFormData((prevState) => ({
          ...prevState,
          images: [...(prevState.images || []), ...newImages],
        }));
      };
      
      const handleOverviewUpload = async (event) => {
        const files = event.target.files;
        if (!files.length) return;
      
        const readFileAsBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
      
        const newImages = await Promise.all(
          Array.from(files).map(async (file) => ({
            url: URL.createObjectURL(file),
            base64: await readFileAsBase64(file),
            section: "",
            area: "",
            caption: "",
            description: "",
            cause: "",
            impact: "",
            solution: "",
          }))
        );
      
        setFormData((prevState) => ({
          ...prevState,
          overviewImages: [...(prevState.overviewImages || []), ...newImages],
        }));
      };
      
      const handleDroneUpload = async (event) => {
        const files = event.target.files;
        if (!files.length) return;
      
        const readFileAsBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
      
        const newImages = await Promise.all(
          Array.from(files).map(async (file) => ({
            url: URL.createObjectURL(file),
            base64: await readFileAsBase64(file),
            section: "",
            area: "",
            caption: "",
            description: "",
            cause: "",
            impact: "",
            solution: "",
          }))
        );
      
        setFormData((prevState) => ({
          ...prevState,
          droneImages: [...(prevState.droneImages || []), ...newImages],
        }));
      };
      







    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Commercial Roof Inspection</h2>
            <form onSubmit={handleSubmit} className="space-y-4">








                {/* Photos Section */}
<h3 className="text-lg font-bold">Upload Defect Photos</h3>

{/* Upload Defect (General) Photos */}
<div className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer mt-2">
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleImageUpload}
    className="hidden"
    id="fileUpload"
  />
  <label htmlFor="fileUpload" className="cursor-pointer text-blue-600">
    Click to upload or drag & drop photos here
  </label>
</div>

{formData.images && formData.images.length > 0 && (
  <div className="mt-4">
    <h4 className="text-md font-semibold mb-2">Uploaded Photos</h4>
    <div className="grid grid-cols-2 gap-4">
      {formData.images.map((image, index) => (
        <div key={index} className="relative bg-gray-50 p-3 border rounded">
          <img
            src={image.url}
            alt={`Upload ${index + 1}`}
            className="w-full h-48 object-cover rounded"
          />

          <div className="mt-2 space-y-1">
            {DEFECT_IMAGE_FIELDS.map((field) => (
              <div key={field} className="mb-2">
                {field === "caption" ? (
                  <input
                    type="text"
                    placeholder="Caption"
                    value={image[field] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const limit = wordLimits[field];
                      if (limit && getWordCount(value) > limit) return;

                      const imgs = [...formData.images];
                      imgs[index][field] = value;
                      setFormData({ ...formData, images: imgs });
                    }}
                    className="w-full border p-1 rounded"
                  />
                ) : (
                  <textarea
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={image[field] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const limit = wordLimits[field];
                      if (limit && getWordCount(value) > limit) return;

                      const imgs = [...formData.images];
                      imgs[index][field] = value;
                      setFormData({ ...formData, images: imgs });
                    }}
                    className="w-full border p-1 rounded"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {getWordCount(image[field] || "")} / {wordLimits[field]} words
                </p>
              </div>
            ))}
          </div>

          <button
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            onClick={() => {
              const updated = formData.images.filter((_, i) => i !== index);
              setFormData({ ...formData, images: updated });
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
)}




{/* Upload Overview Photos */}
<h3 className="text-lg font-bold mt-6">Upload Overview Photos</h3>
<div className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer">
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleOverviewUpload}
    className="hidden"
    id="overviewUpload"
  />
  <label htmlFor="overviewUpload" className="cursor-pointer text-blue-600">
    Click to upload or drag & drop overview pictures here
  </label>
</div>

{formData.overviewImages?.length > 0 && (
  <div className="mt-4">
    <h4 className="text-md font-semibold mb-2">Overview Pictures</h4>
    <div className="grid grid-cols-2 gap-4">
      {formData.overviewImages.map((image, index) => (
        <div key={index} className="relative bg-gray-50 p-3 border rounded">
          <img
            src={image.url}
            alt={`Overview ${index + 1}`}
            className="w-full h-48 object-cover rounded"
          />

          <div className="mt-2 space-y-1">
            {["section", "area", "caption"].map((field) => (
              <div key={field} className="mb-2">
                {field === "caption" ? (
                  <input
                    type="text"
                    placeholder="Caption"
                    value={image[field] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // 30‑word guard
                      if (getWordCount(value) > 30) return;

                      const imgs = [...formData.overviewImages];
                      imgs[index][field] = value;
                      setFormData({ ...formData, overviewImages: imgs });
                    }}
                    className="w-full border p-1 rounded"
                  />
                ) : (
                  <textarea
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={image[field] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (getWordCount(value) > 30) return;

                      const imgs = [...formData.overviewImages];
                      imgs[index][field] = value;
                      setFormData({ ...formData, overviewImages: imgs });
                    }}
                    className="w-full border p-1 rounded"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {getWordCount(image[field] || "")} / 30 words
                </p>
              </div>
            ))}
          </div>

          <button
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            onClick={() => {
              const updated = formData.overviewImages.filter((_, i) => i !== index);
              setFormData({ ...formData, overviewImages: updated });
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
)}








{/* Upload Drone Overview Photos */}
<h3 className="text-lg font-bold mt-6">Upload Drone Overview Photos</h3>
<div className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer">
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleDroneUpload}
    className="hidden"
    id="droneUpload"
  />
  <label htmlFor="droneUpload" className="cursor-pointer text-blue-600">
    Click to upload or drag & drop drone photos here
  </label>
</div>

{formData.droneImages?.length > 0 && (
  <div className="mt-4">
    <h4 className="text-md font-semibold mb-2">Drone Overview Pictures</h4>
    <div className="grid grid-cols-2 gap-4">
      {formData.droneImages.map((image, index) => (
        <div key={index} className="relative bg-gray-50 p-3 border rounded">
          <img
            src={image.url}
            alt={`Drone ${index + 1}`}
            className="w-full h-48 object-cover rounded"
          />

          <div className="mt-2 space-y-1">
            {["section", "area", "caption", "description"].map((field) => (
              <div key={field} className="mb-2">
                {field === "caption" ? (
                  <input
                    type="text"
                    placeholder="Caption"
                    value={image[field] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (getWordCount(value) > 30) return;

                      const imgs = [...formData.droneImages];
                      imgs[index][field] = value;
                      setFormData({ ...formData, droneImages: imgs });
                    }}
                    className="w-full border p-1 rounded"
                  />
                ) : (
                  <textarea
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={image[field] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (getWordCount(value) > 30) return;

                      const imgs = [...formData.droneImages];
                      imgs[index][field] = value;
                      setFormData({ ...formData, droneImages: imgs });
                    }}
                    className="w-full border p-1 rounded"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {getWordCount(image[field] || "")} / 30 words
                </p>
              </div>
            ))}
          </div>

          <button
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            onClick={() => {
              const updated = formData.droneImages.filter((_, i) => i !== index);
              setFormData({ ...formData, droneImages: updated });
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
)}
















                
                {/* Property Details Section */}



                <h3 className="text-lg font-bold">Property Details</h3>

<input
  type="text"
  name="propertyName"
  placeholder="Property Name"
  value={formData.propertyName}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(formData.propertyName)} / {wordLimits.propertyName} words
</p>

<input
  type="text"
  name="propertyAddress"
  placeholder="Property Address"
  value={formData.propertyAddress}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(formData.propertyAddress)} / {wordLimits.propertyAddress} words
</p>

<input
  type="text"
  name="clientname"
  placeholder="Client First and Last Name"
  value={formData.clientname}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(formData.clientname)} / {wordLimits.clientName} words
</p>

<input
  type="text"
  name="clientcontactinfo"
  placeholder="Client Contact Info"
  value={formData.clientcontactinfo}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(formData.clientcontactinfo)} / {wordLimits.clientcontactinfo} words
</p>

<input
  type="date"
  name="inspectionDate"
  value={formData.inspectionDate}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(formData.inspectionDate)} / {wordLimits.inspectionDate} words
</p>

<input
  type="text"
  name="inspectorName"
  placeholder="Inspector Name"
  value={formData.inspectorName}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(formData.inspectorName)} / {wordLimits.inspectorName} words
</p>

<input
  type="text"
  name="inspectorCompany"
  placeholder="Inspector Company"
  value={formData.inspectorCompany}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(formData.inspectorCompany)} / {wordLimits.inspectorCompany} words
</p>

<input
  type="text"
  name="inspectorcontactinfo"
  placeholder="Inspector contact info"
  value={formData.inspectorcontactinfo}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(formData.inspectorcontactinfo)} / {wordLimits.inspectorcontactinfo} words
</p>






                {/* Weather Conditions */}
                <h3 className="text-lg font-bold">Weather Conditions</h3>
                <select name="weatherCondition" onChange={handleChange} className="w-full border p-2 rounded">
                    <option value="">Select Condition</option>
                    <option value="Sunny">Sunny</option>
                    <option value="Cloudy">Cloudy</option>
                    <option value="Rainy">Rainy</option>
                    <option value="Snowy">Snowy</option>
                </select>
                <input
  type="text"
  name="temperature"
  placeholder="Temperature (°F)"
  value={formData.temperature}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(formData.temperature)} / {wordLimits.temperature} word
</p>

                

                



{roofSections.map((section, index) => (
  <RoofSection
    key={index}
    section={section}
    index={index}
    onChange={handleRoofSectionChange}
  />
))}



<button
  type="button"
  onClick={() => setRoofSections([...roofSections, { ...emptyRoofSection }])}
  className="bg-green-500 text-white px-4 py-2 rounded mt-4"
>
  Add Another Roof Section
</button>





            
     


             
                {/* Warranty Coverage Section */}
                <h3 className="text-lg font-bold">Warranty Coverage</h3>

{/* Is the current roof still under warranty? */}
<label className="block">Is the current roof still under warranty?</label>
<select name="warrantyCoverage" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>

{/* Warranty Term */}
<label className="block mt-2">Warranty Term (Years)</label>
<select name="warrantyTerm" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="10">10 Years</option>
    <option value="15">15 Years</option>
    <option value="20">20 Years</option>
</select>

{/* Warranty Type */}
<label className="block mt-2">Warranty Type</label>
<select name="warrantyType" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Standard">Standard</option>
    <option value="Full System">Full System</option>
    <option value="No Dollar Limit (NDL)">No Dollar Limit (NDL)</option>
</select>

{/* Is Building FM Insured? */}
<label className="block mt-2">Is the Building FM Insured?</label>
<select name="fmInsured" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>






{/* Disclaimer */}
<p className="text-gray-600 text-sm mt-2">
    <strong>Disclaimer:</strong> This inspection is visual only and does not include destructive (invasive) testing or thermal scans unless otherwise noted.
</p>




<hr className="my-6" />
<h3 className="text-lg font-bold">Upload Estimating Spreadsheet</h3>

<input
  type="file"
  accept=".xlsx, .xls"
  onChange={handleSpreadsheetUpload}
  className="mb-4 block"
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





                
  {/* Submit and Save Buttons */}
<div className="flex justify-between mt-6">
  <button
    type="submit"
    className="bg-blue-500 text-white p-2 rounded w-[48%]"
  >
    Submit Inspection
  </button>

  <button
    type="button"
    onClick={async () => {
      const user = auth.currentUser;
      if (!user) return alert("Must be logged in to save drafts.");

      try {
        const [defectUrls, overviewUrls, droneUrls] = await Promise.all([
          uploadImagesAndGetDownloadUrls(formData.images || [], "defect"),
          uploadImagesAndGetDownloadUrls(formData.overviewImages || [], "overview"),
          uploadImagesAndGetDownloadUrls(formData.droneImages || [], "drone"),
        ]);

        // Remove base64 + url from each image object before saving
        const clean = (images) =>
          images.map(({ base64, ...rest }) => rest); // KEEP url!
        

        // Clean formData by omitting undefined fields (Firestore-safe)
        const {
          images: _images,
          overviewImages: _overviewImages,
          droneImages: _droneImages,
          ...cleanFormData
        } = formData;

        const inspection = {
          formData: cleanFormData,
          roofSections,
          images: clean(defectUrls),
          overviewImages: clean(overviewUrls),
          droneImages: clean(droneUrls),
          spreadsheetUrl,
          finalEstimate, // ✅ Add this
        };
        
        
        await saveInspectionDraftToFirestore({
  ...inspection,
  propertyName: formData.propertyName, // ← add this if it’s not already there
});
        alert("✅ Inspection draft saved to your account!");
      } catch (error) {
        console.error("❌ Failed to save draft:", error);
        alert("Error saving draft. See console for details.");
      }
    }}
    className="bg-black text-white p-2 rounded w-[48%]"
  >
    Save Draft
  </button>
</div>


            </form>
        </div>
    );
};


export default InspectionForm;