
import { generatePDF } from "../utils/pdfGenerator";
import RoofSection from './RoofSection';
import React, { useState } from 'react';

const InspectionForm = () => {
    // State to store form data
    const [formData, setFormData] = useState({
        // Property Details
        propertyName: '',
        propertyAddress: '',
        clientname:'first and last',
        clientcontactinfo: 'phone number / email',
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

    const handleRoofSectionChange = (e, index) => {
      const { name, value } = e.target;
      const updatedSections = [...roofSections];
      updatedSections[index][name] = value;
      setRoofSections(updatedSections);
    };
    



    const [roofSections, setRoofSections] = useState([
      {


        sectionName: '',
roofLength: '',
roofWidth: '',
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
    

    
    // Function to handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Submit button clicked!");
      
      const completeFormData = {
        ...formData,
        roofSections: roofSections // 👈 Include roof sections here
      };
    
      console.log("Form Data:", completeFormData);
      generatePDF(completeFormData); // Pass the updated object
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
            {["section", "area", "caption", "description", "cause", "impact", "solution"].map((field) => (
              <React.Fragment key={field}>
                {field === "caption" ? (
                  <input
                    type="text"
                    placeholder="Caption"
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.images];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, images: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                ) : (
                  <textarea
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.images];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, images: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                )}
              </React.Fragment>
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

{formData.overviewImages && formData.overviewImages.length > 0 && (
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
            {["section", "area", "caption", "description", "cause", "impact", "solution"].map((field) => (
              <React.Fragment key={field}>
                {field === "caption" ? (
                  <input
                    type="text"
                    placeholder="Caption"
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.overviewImages];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, overviewImages: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                ) : (
                  <textarea
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.overviewImages];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, overviewImages: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                )}
              </React.Fragment>
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

{formData.droneImages && formData.droneImages.length > 0 && (
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
            {["section", "area", "caption", "description", "cause", "impact", "solution"].map((field) => (
              <React.Fragment key={field}>
                {field === "caption" ? (
                  <input
                    type="text"
                    placeholder="Caption"
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.droneImages];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, droneImages: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                ) : (
                  <textarea
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.droneImages];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, droneImages: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                )}
              </React.Fragment>
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
                <input type="text" name="propertyName" placeholder="Property Name" onChange={handleChange} className="w-full border p-2 rounded" />
                <input type="text" name="propertyAddress" placeholder="Property Address" onChange={handleChange} className="w-full border p-2 rounded" />
                <input 
    type="text" 
    name="clientName" 
    placeholder="Client First and Last Name"
    onChange={handleChange} 
    className="w-full border p-2 rounded" 
/>

<input 
    type="text" 
    name="clientcontactinfo"
    placeholder="Client Contact Info"
    onChange={handleChange} 
    className="w-full border p-2 rounded" 
/>
                <input type="date" name="inspectionDate" onChange={handleChange} className="w-full border p-2 rounded" />
                <input type="text" name="inspectorName" placeholder="Inspector Name" onChange={handleChange} className="w-full border p-2 rounded" />
                <input type="text" name="inspectorCompany" placeholder="Inspector Company" onChange={handleChange} className="w-full border p-2 rounded" />
                <input type="text" name="inspectorcontactinfo"  placeholder="Inspector contact info"onChange={handleChange} className="w-full border p-2 rounded" />
                {/* Weather Conditions */}
                <h3 className="text-lg font-bold">Weather Conditions</h3>
                <select name="weatherCondition" onChange={handleChange} className="w-full border p-2 rounded">
                    <option value="">Select Condition</option>
                    <option value="Sunny">Sunny</option>
                    <option value="Cloudy">Cloudy</option>
                    <option value="Rainy">Rainy</option>
                    <option value="Snowy">Snowy</option>
                </select>
                <input type="text" name="temperature" placeholder="Temperature (°F)" onChange={handleChange} className="w-full border p-2 rounded" />
                
                {/* Roof Type and Age */}
                <h3 className="text-lg font-bold">Roof Type & Age</h3>
                <input type="text" name="roofType" placeholder="Roof Type" onChange={handleChange} className="w-full border p-2 rounded" />
                <input type="text" name="roofAge" placeholder="Roof Age (approx.)" onChange={handleChange} className="w-full border p-2 rounded" />
                



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

import { generatePDF } from "../utils/pdfGenerator";
import RoofSection from './RoofSection';
import React, { useState } from 'react';

const InspectionForm = () => {
    // State to store form data
    const [formData, setFormData] = useState({
        // Property Details
        propertyName: '',
        propertyAddress: '',
        clientname:'first and last',
        clientcontactinfo: 'phone number / email',
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

    const handleRoofSectionChange = (e, index) => {
      const { name, value } = e.target;
      const updatedSections = [...roofSections];
      updatedSections[index][name] = value;
      setRoofSections(updatedSections);
    };
    



    const [roofSections, setRoofSections] = useState([
      {


        sectionName: '',
roofLength: '',
roofWidth: '',
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
    

    
    // Function to handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Submit button clicked!");
      
      const completeFormData = {
        ...formData,
        roofSections: roofSections // 👈 Include roof sections here
      };
    
      console.log("Form Data:", completeFormData);
      generatePDF(completeFormData); // Pass the updated object
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
            {["section", "area", "caption", "description", "cause", "impact", "solution"].map((field) => (
              <React.Fragment key={field}>
                {field === "caption" ? (
                  <input
                    type="text"
                    placeholder="Caption"
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.images];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, images: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                ) : (
                  <textarea
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.images];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, images: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                )}
              </React.Fragment>
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

{formData.overviewImages && formData.overviewImages.length > 0 && (
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
            {["section", "area", "caption", "description", "cause", "impact", "solution"].map((field) => (
              <React.Fragment key={field}>
                {field === "caption" ? (
                  <input
                    type="text"
                    placeholder="Caption"
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.overviewImages];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, overviewImages: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                ) : (
                  <textarea
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.overviewImages];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, overviewImages: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                )}
              </React.Fragment>
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

{formData.droneImages && formData.droneImages.length > 0 && (
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
            {["section", "area", "caption", "description", "cause", "impact", "solution"].map((field) => (
              <React.Fragment key={field}>
                {field === "caption" ? (
                  <input
                    type="text"
                    placeholder="Caption"
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.droneImages];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, droneImages: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                ) : (
                  <textarea
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={image[field] || ""}
                    onChange={(e) => {
                      const updatedImages = [...formData.droneImages];
                      updatedImages[index][field] = e.target.value;
                      setFormData({ ...formData, droneImages: updatedImages });
                    }}
                    className="w-full border p-1 rounded"
                  />
                )}
              </React.Fragment>
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
                <input type="text" name="propertyName" placeholder="Property Name" onChange={handleChange} className="w-full border p-2 rounded" />
                <input type="text" name="propertyAddress" placeholder="Property Address" onChange={handleChange} className="w-full border p-2 rounded" />
                <input 
    type="text" 
    name="clientName" 
    placeholder="Client First and Last Name"
    onChange={handleChange} 
    className="w-full border p-2 rounded" 
/>

<input 
    type="text" 
    name="clientcontactinfo"
    placeholder="Client Contact Info"
    onChange={handleChange} 
    className="w-full border p-2 rounded" 
/>
                <input type="date" name="inspectionDate" onChange={handleChange} className="w-full border p-2 rounded" />
                <input type="text" name="inspectorName" placeholder="Inspector Name" onChange={handleChange} className="w-full border p-2 rounded" />
                <input type="text" name="inspectorCompany" placeholder="Inspector Company" onChange={handleChange} className="w-full border p-2 rounded" />
                <input type="text" name="inspectorcontactinfo"  placeholder="Inspector contact info"onChange={handleChange} className="w-full border p-2 rounded" />
                {/* Weather Conditions */}
                <h3 className="text-lg font-bold">Weather Conditions</h3>
                <select name="weatherCondition" onChange={handleChange} className="w-full border p-2 rounded">
                    <option value="">Select Condition</option>
                    <option value="Sunny">Sunny</option>
                    <option value="Cloudy">Cloudy</option>
                    <option value="Rainy">Rainy</option>
                    <option value="Snowy">Snowy</option>
                </select>
                <input type="text" name="temperature" placeholder="Temperature (°F)" onChange={handleChange} className="w-full border p-2 rounded" />
                
                {/* Roof Type and Age */}
                <h3 className="text-lg font-bold">Roof Type & Age</h3>
                <input type="text" name="roofType" placeholder="Roof Type" onChange={handleChange} className="w-full border p-2 rounded" />
                <input type="text" name="roofAge" placeholder="Roof Age (approx.)" onChange={handleChange} className="w-full border p-2 rounded" />
                



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