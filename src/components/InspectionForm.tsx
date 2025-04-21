
import { generatePDF } from "../utils/pdfGenerator";
import RoofSection from './RoofSection';
import React, { useEffect, useState } from 'react';
import { db, storage, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth"; // Add this if needed

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
      const storedEstimate = localStorage.getItem("pushedFinalEstimate");
if (storedEstimate) {
  setFinalEstimate(parseFloat(storedEstimate));
  localStorage.removeItem("pushedFinalEstimate"); // optional cleanup
}

      const saved = localStorage.getItem("activeInspectionDraft");
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Only update if values exist
        setFormData((prev) => ({
          ...prev,
          ...parsed,
        }));
    
        if (parsed.roofSections && parsed.roofSections.length > 0) {
          setRoofSections(parsed.roofSections);
        }
    
        // Optional: Clear the draft after loading
        localStorage.removeItem("activeInspectionDraft");
      }
    }, []);
    

    
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
    

    
    const uploadImagesAndGetUrls = async (images: any[], folder: string) => {
      const uploaded = [];
      for (const image of images) {
        const response = await fetch(image.url); // get image blob
        const blob = await response.blob();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
        const imageRef = ref(storage, `${folder}/${filename}`);
        await uploadBytes(imageRef, blob);
        const url = await getDownloadURL(imageRef);
        uploaded.push({ ...image, url }); // keep other fields (caption, etc.)
      }
      return uploaded;
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
    
      // 🔴 Call the onSubmit handler passed down from App.tsx
      onSubmit(completeFormData);
    
      // 🔵 Then generate the PDF as usual
      generatePDF({ ...completeFormData, finalEstimate });
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










            {finalEstimate !== null && (
  <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-4">
    💡 Final pricing estimate loaded from spreadsheet: <strong>${finalEstimate.toLocaleString()}</strong>
  </div>
)}



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








                
                {/* Submit Button */}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Submit Inspection</button>
            </form>
        </div>
    );
};


export default InspectionForm;