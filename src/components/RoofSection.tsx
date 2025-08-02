const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const SECTION_NAME_LIMIT = 2;
const SECTION_AGE_LIMIT = 1;
const GENERAL_DESCRIPTION_LIMIT = 21;
const FINAL_SECTION_LIMIT = 14;

const WORD_LIMITS = {
  sectionName: SECTION_NAME_LIMIT,
  sectionAge: SECTION_AGE_LIMIT,
  leaksDescription: GENERAL_DESCRIPTION_LIMIT,
  pondingWaterDescription: GENERAL_DESCRIPTION_LIMIT,
  debrisDescription: GENERAL_DESCRIPTION_LIMIT,
  vegetationDescription: GENERAL_DESCRIPTION_LIMIT,
  accessibilityDescription: GENERAL_DESCRIPTION_LIMIT,
  deckDamageDescription: GENERAL_DESCRIPTION_LIMIT,
  deckMoistureDescription: GENERAL_DESCRIPTION_LIMIT,

  membraneMaterial: 2,
  membraneCondition: 20,
  seamsCondition: 20,
  granulesCondition: 20,
  coatingCondition: 20,

  // Flashing & Sealants (previously done)
  flashingMaterial: 2,
  flashingCondition: 32,
  flashingLocations: 32,
  sealantsCondition: 32,

  // Final 5 Sections (apply 14-word limit across the board)
  guttersCondition: FINAL_SECTION_LIMIT,
  downspoutsCondition: FINAL_SECTION_LIMIT,
  drainsCondition: FINAL_SECTION_LIMIT,
  scuppersCondition: FINAL_SECTION_LIMIT,
  pipesCondition: FINAL_SECTION_LIMIT,
  ventsCondition: FINAL_SECTION_LIMIT,
  hvacCondition: FINAL_SECTION_LIMIT,
  skylightsCondition: FINAL_SECTION_LIMIT,
  chimneysCondition: FINAL_SECTION_LIMIT,
  parapetWallCondition: FINAL_SECTION_LIMIT,
  copingCondition: FINAL_SECTION_LIMIT,
safeAccess: FINAL_SECTION_LIMIT,
guardrailCondition: FINAL_SECTION_LIMIT,
tripHazards: FINAL_SECTION_LIMIT,
structuralIssueDetails: FINAL_SECTION_LIMIT,
sheathingCondition: FINAL_SECTION_LIMIT,

};






const RoofSection = ({ section, index, onChange }) => {
  
    

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" && value !== "" ? Number(value) : value;
  
    // Word limit enforcement (if any)
    const limit = WORD_LIMITS[name];
    if (limit && getWordCount(val) > limit) return;
  
    onChange(index, { ...section, [name]: val });
  };
  
  



      

  return (
    <div className="border p-4 mt-4 bg-gray-50 rounded">
      <h4 className="text-xl font-semibold mb-4">Roof Section {index + 1}</h4>
      {/* SECTION NAME + AUTO SQ. FOOTAGE CALC */}
<div className="grid grid-cols-2 gap-4 mb-4">
  <div>
  <label className="block font-semibold">Section Name</label>
<input
  type="text"
  name="sectionName"
  placeholder=""
  value={section.sectionName}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.sectionName)} / {SECTION_NAME_LIMIT} words
</p>


    



<label className="block font-semibold">Section Age</label>
<input
  type="text"
  name="sectionAge"
  placeholder="Approximate Age (Years)"
  value={section.sectionAge || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.sectionAge || "")} / {SECTION_AGE_LIMIT} word
</p>



  </div>
  <div>
    <label className="block font-semibold">Section Sq. Footage</label>
    <input
      type="text"
      name="roofSquareFootage"
      value={
        section.roofLength && section.roofWidth
          ? section.roofLength * section.roofWidth
          : ""
      }
      readOnly
      className="w-full border p-2 rounded bg-gray-100"
    />
    <p className="text-xs text-gray-500 mt-1">
    Calculated Below
  </p>




  </div>










  
</div>



{/* Roof Square Footage Section */}
<h3 className="text-lg font-bold mt-6">Section Square Footage</h3>


<input
  type="number"
  name="roofLength"
  placeholder="Length (ft)"
  value={section.roofLength ?? ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>


<input
  type="number"
  name="roofWidth"
  placeholder="width (ft)"
  value={section.roofWidth ?? ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>

<label className="block mt-2">Total Roof Square Footage</label>
<input 
    type="number" 
    name="roofSquareFootage" 
    value={section.roofLength && section.roofWidth ? section.roofLength * section.roofWidth : ''} 
    readOnly 
    className="w-full border p-2 rounded bg-gray-100" 
/>


                 {/* General Observations Section */}




<h3 className="text-lg font-bold">General Observations</h3>

{/* Overall Roof Condition */}
<label className="block">Overall Section Condition:</label>
<select name="overallCondition" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select Condition</option>
    <option value="Excellent">Excellent</option>
    <option value="Good">Good</option>
    <option value="Fair">Fair</option>
    <option value="Poor">Poor</option>
</select>

{/* Evidence of Leaks/Water Damage */}
<label className="block mt-2">Evidence of Leaks/Water Damage?</label>
<select name="leaks" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>
<textarea
  name="leaksDescription"
  placeholder="If yes, describe location and extent"
  value={section.leaksDescription || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.leaksDescription || "")} / {GENERAL_DESCRIPTION_LIMIT} words
</p>






{/* Ponding Water */}
<label className="block mt-2">Ponding Water?</label>
<select name="pondingWater" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>
<textarea
  name="pondingWaterDescription"
  placeholder="If yes, describe location and extent"
  value={section.pondingWaterDescription || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.pondingWaterDescription || "")} / {GENERAL_DESCRIPTION_LIMIT} words
</p>





{/* Debris Accumulation */}
<label className="block mt-2">Debris Accumulation?</label>
<select name="debrisAccumulation" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>
<textarea
  name="debrisDescription"
  placeholder="If yes, describe location and type of debris"
  value={section.debrisDescription || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.debrisDescription || "")} / {GENERAL_DESCRIPTION_LIMIT} words
</p>





{/* Vegetation Growth */}
<label className="block mt-2">Vegetation Growth?</label>
<select name="vegetationGrowth" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>
<textarea
  name="vegetationDescription"
  placeholder="If yes, describe location and type of vegetation"
  value={section.vegetationDescription || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.vegetationDescription || "")} / {GENERAL_DESCRIPTION_LIMIT} words
</p>




{/* Accessibility Issues */}
<label className="block mt-2">Accessibility Issues?</label>
<select name="accessibilityIssues" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>
<textarea
  name="accessibilityDescription"
  placeholder="If yes, describe"
  value={section.accessibilityDescription || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.accessibilityDescription || "")} / {GENERAL_DESCRIPTION_LIMIT} words
</p>


                
                {/* Interior Evaluation Section */}
<h3 className="text-lg font-bold">Interior Evaluation</h3>

{/* Underside Accessibility */}
<label className="block">Is the underside of the roof deck accessible?</label>
<select name="undersideAccessible" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>

{/* General Condition of the Roof Deck */}
<label className="block mt-2">General Condition of the Roof Deck:</label>
<select name="deckCondition" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select Condition</option>
    <option value="Good">Good</option>
    <option value="Fair">Fair</option>
    <option value="Poor">Poor</option>
    <option value="Failed">Failed</option>
</select>

{/* Signs of Damage or Deterioration */}
<label className="block mt-2">Signs of Damage or Deterioration of Deck?</label>
<select name="deckDamage" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>
<textarea
  name="deckDamageDescription"
  placeholder="If yes, provide their location and brief description"
  value={section.deckDamageDescription || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.deckDamageDescription || "")} / {GENERAL_DESCRIPTION_LIMIT} words
</p>


{/* Signs of Moisture Intrusion or Water Damage */}
<label className="block mt-2">Signs of Moisture Intrusion or Water Damage?</label>
<select name="deckMoisture" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>
<textarea
  name="deckMoistureDescription"
  placeholder="If yes, provide their location and brief description"
  value={section.deckMoistureDescription || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.deckMoistureDescription || "")} / {GENERAL_DESCRIPTION_LIMIT} words
</p>


   
                
                {/* Roofing Membrane/Surface Section */}
<h3 className="text-lg font-bold">Roofing Membrane/Surface</h3>

{/* Roofing Material */}
<label className="block">Material (TPO, EPDM, Modified Bitumen, BUR, Metal, Shingle, etc.)</label>
<input
  type="text"
  name="membraneMaterial"
  placeholder="Enter Membrane Material"
  value={section.membraneMaterial || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.membraneMaterial || "")} / 2 words
</p>




{/* Condition of Membrane */}
<label className="block mt-2">Condition of Membrane (Punctures, Tears, Blisters, Wrinkles, etc.)</label>
<textarea
  name="membraneCondition"
  placeholder="Describe the condition"
  value={section.membraneCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.membraneCondition || "")} / 27 words
</p>




{/* Seams/Overlaps Condition */}
<label className="block mt-2">Seams/Overlaps Condition (Secure, Separated, Damaged, etc.)</label>
<input
  type="text"
  name="seamsCondition"
  placeholder="Enter condition of seams/overlaps"
  value={section.seamsCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.seamsCondition || "")} / 27 words
</p>




{/* Fasteners Condition */}
<label className="block mt-2">Fasteners Condition (Rusted, Loose, Missing, etc.)</label>
<input
  type="text"
  name="fastenersCondition"
  placeholder="Enter fasteners condition"
  value={section.fastenersCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>






{/* Fasteners Count */}
<div className="grid grid-cols-3 gap-4">
    <div>
        <label className="block mt-2">Rusted Fasteners</label>
        <input type="number" name="rustedFasteners" placeholder="Count" onChange={handleChange} className="w-full border p-2 rounded" />
    </div>
    <div>
        <label className="block mt-2">Loose Fasteners</label>
        <input type="number" name="looseFasteners" placeholder="Count" onChange={handleChange} className="w-full border p-2 rounded" />
    </div>
    <div>
        <label className="block mt-2">Missing Fasteners</label>
        <input type="number" name="missingFasteners" placeholder="Count" onChange={handleChange} className="w-full border p-2 rounded" />
    </div>
</div>

{/* Granules Condition */}
<label className="block mt-2">Granules Condition (Loss, Wear, etc.)</label>
<textarea
  name="granulesCondition"
  placeholder="Describe the condition of granules"
  value={section.granulesCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.granulesCondition || "")} / 27 words
</p>




{/* Coating Condition */}
<label className="block mt-2">Coating Condition (Peeling, Cracking, etc.)</label>
<textarea
  name="coatingCondition"
  placeholder="Describe the condition of coating"
  value={section.coatingCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.coatingCondition || "")} / 27 words
</p>



<h3 className="text-lg font-bold">Flashing & Sealants</h3>

{/* Flashing Material - 2 word limit */}
<label className="block">Flashing Material</label>
<input
  type="text"
  name="flashingMaterial"
  placeholder="Enter type of flashing material"
  value={section.flashingMaterial || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.flashingMaterial || "")} / 2 words
</p>

{/* Flashing Condition - 32 word limit */}
<label className="block mt-2">Flashing Condition (Cracked, Torn, Deteriorated, etc.)</label>
<textarea
  name="flashingCondition"
  placeholder="Describe the condition of the flashing"
  value={section.flashingCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.flashingCondition || "")} / 32 words
</p>

{/* Length of Damaged Flashing */}
<label className="block mt-2">Length of Damaged Flashing (in feet)</label>
<input
  type="number"
  name="flashingDamageLength"
  placeholder="Enter length in feet"
  value={section.flashingDamageLength || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>

{/* Flashing Locations - 32 word limit */}
<label className="block mt-2">Flashing Locations (Around vents, chimneys, skylights, parapet walls, etc.)</label>
<textarea
  name="flashingLocations"
  placeholder="Describe locations of flashing"
  value={section.flashingLocations || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.flashingLocations || "")} / 32 words
</p>

{/* Sealants Condition - 32 word limit */}
<label className="block mt-2">Sealants Condition (Cracked, Dried Out, Missing, etc.)</label>
<textarea
  name="sealantsCondition"
  placeholder="Describe the condition of sealants"
  value={section.sealantsCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.sealantsCondition || "")} / 32 words
</p>

{/* Length of Cracked/Deteriorated Sealant */}
<label className="block mt-2">Length of Cracked/Deteriorated Sealant (in feet)</label>
<input
  type="number"
  name="sealantsLength"
  placeholder="Enter length in feet"
  value={section.sealantsLength || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>

{/* ===================== Drainage System ===================== */}
<h3 className="text-lg font-bold mt-6">Drainage System</h3>

{/* Gutters Condition - 32 word limit */}
<label className="block">Gutters Condition (Clean, Clogged, Damaged, etc.)</label>
<textarea
  name="guttersCondition"
  placeholder="Describe the condition of the gutters"
  value={section.guttersCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.guttersCondition || "")} / 32 words
</p>

{/* Gutter Size */}
<label className="block mt-2">Gutter Size (6", 7", etc.)</label>
<input
  type="text"
  name="gutterSize"
  placeholder="Enter gutter size"
  value={section.gutterSize || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>

{/* Downspouts Condition - 32 word limit */}
<label className="block mt-2">Downspouts Condition (Secure, Damaged, Missing, etc.)</label>
<textarea
  name="downspoutsCondition"
  placeholder="Describe the condition of downspouts"
  value={section.downspoutsCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.downspoutsCondition || "")} / 32 words
</p>

{/* Downspouts Count */}
<label className="block mt-2">Number of Downspouts</label>
<input
  type="number"
  name="downspoutsNumber"
  placeholder="Enter total number of downspouts"
  value={section.downspoutsNumber || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>

{/* Downspouts Size */}
<label className="block mt-2">Downspouts Size</label>
<input
  type="text"
  name="downspoutsSize"
  placeholder="Enter size of downspouts"
  value={section.downspoutsSize || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>

{/* Drains Condition - 32 word limit */}
<label className="block mt-2">Drains Condition (Clear, Clogged, etc.)</label>
<textarea
  name="drainsCondition"
  placeholder="Describe the condition of the drains"
  value={section.drainsCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.drainsCondition || "")} / 32 words
</p>

{/* Scuppers Condition - 32 word limit */}
<label className="block mt-2">Scuppers Condition (Clear, Damaged, etc.)</label>
<textarea
  name="scuppersCondition"
  placeholder="Describe the condition of the scuppers"
  value={section.scuppersCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  rows={3}
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.scuppersCondition || "")} / 32 words
</p>



{/* Penetrations & Vents Section */}
<h3 className="text-lg font-bold">Penetrations & Vents</h3>

<label className="block">Pipes Condition (Seals, Integrity, etc.)</label>
<textarea
  name="pipesCondition"
  placeholder="Describe the condition of pipe penetrations and seals"
  value={section.pipesCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
></textarea>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.pipesCondition || "")} / 14 words
</p>

<label className="block mt-2">Vents Condition (Secure, Damaged, etc.)</label>
<textarea
  name="ventsCondition"
  placeholder="Describe the condition of vents"
  value={section.ventsCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
></textarea>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.ventsCondition || "")} / 14 words
</p>

<label className="block mt-2">HVAC Units Condition (Leaks, Damage, etc.)</label>
<textarea
  name="hvacCondition"
  placeholder="Describe the condition of the roof around HVAC units"
  value={section.hvacCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
></textarea>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.hvacCondition || "")} / 14 words
</p>

<label className="block mt-2">Skylights Condition (Cracked, Leaking, Sealed, etc.)</label>
<textarea
  name="skylightsCondition"
  placeholder="Describe the condition of skylights"
  value={section.skylightsCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
></textarea>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.skylightsCondition || "")} / 14 words
</p>

<label className="block mt-2">Chimneys Condition (Flashing, Cap, etc.)</label>
<textarea
  name="chimneysCondition"
  placeholder="Describe the condition of chimney flashing and cap"
  value={section.chimneysCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
></textarea>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.chimneysCondition || "")} / 14 words
</p>






{/* Parapet Walls Section */}
<h3 className="text-lg font-bold">Parapet Walls</h3>

<label className="block">Condition of Parapet Walls (Cracks, Loose Masonry, etc.)</label>
<textarea
  name="parapetWallCondition"
  placeholder="Describe the condition of the parapet walls"
  value={section.parapetWallCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
></textarea>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.parapetWallCondition || "")} / 14 words
</p>

<label className="block mt-2">Coping Condition (Cracked, Loose, Missing, etc.)</label>
<textarea
  name="copingCondition"
  placeholder="Describe the condition of coping"
  value={section.copingCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
></textarea>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.copingCondition || "")} / 14 words
</p>




{/* Insulation Section */}
<h3 className="text-lg font-bold mt-6">Insulation</h3>

<label className="block">Insulation Type</label>
<input
  type="text"
  name="insulationType"
  placeholder="e.g., Rigid Board, Loose Fill"
  value={section.insulationType || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.insulationType || "")} / {FINAL_SECTION_LIMIT} words
</p>

<label className="block mt-2">Insulation Thickness (inches)</label>
<input
  type="text"
  name="insulationThickness"
  placeholder="e.g., 2.5"
  value={section.insulationThickness || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>

<label className="block mt-2">General Condition of Insulation</label>
<input
  type="text"
  name="insulationCondition"
  placeholder="e.g., Good, Poor"
  value={section.insulationCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
<p className="text-xs text-gray-500 mt-1">
  {getWordCount(section.insulationCondition || "")} / {FINAL_SECTION_LIMIT} words
</p>

<label className="block mt-2">Evidence of Wet Insulation?</label>
<select
  name="wetInsulation"
  value={section.wetInsulation || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
>
  <option value="">Select</option>
  <option value="Yes">Yes</option>
  <option value="No">No</option>
</select>






<h3 className="text-lg font-bold mt-6">Deck / Structure</h3>

<label className="block">Evidence of Structural Issues?</label>
<select
  name="structuralIssues"
  onChange={handleChange}
  value={section.structuralIssues || ""}
  className="w-full border p-2 rounded"
>
  <option value="">Select</option>
  <option value="Yes">Yes</option>
  <option value="No">No</option>
</select>

<label className="block mt-2">Location & Extent of Issues</label>
<input
  type="text"
  name="structuralIssueDetails"
  placeholder="Describe location and extent"
  value={section.structuralIssueDetails || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>

<label className="block mt-2">Plywood/Sheathing Condition</label>
<input
  type="text"
  name="sheathingCondition"
  placeholder="e.g., Rotting, Delamination"
  value={section.sheathingCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>








{/* Safety Section */}
<h3 className="text-lg font-bold mt-6">Safety</h3>

<label className="block">Is safe roof access available?</label>
<input
  type="text"
  name="safeAccess"
  placeholder="e.g., Hatch, Ladder Access"
  value={section.safeAccess || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>

<label className="block mt-2">Condition of guardrails or parapets</label>
<input
  type="text"
  name="guardrailCondition"
  placeholder="e.g., Missing guardrails on west side"
  value={section.guardrailCondition || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>

<label className="block mt-2">Trip hazards on roof</label>
<input
  type="text"
  name="tripHazards"
  placeholder="e.g., Loose cable, uneven membrane"
  value={section.tripHazards || ""}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>


{/* Additional Roof Elements Section */}
<h3 className="text-lg font-bold">Additional Roof Elements</h3>

{/* Wall Flashing Section */}
<label className="block">Wall Flashing - Length x Height</label>
<input type="text" name="wallFlashingEast" placeholder="East Wall (Length x Height)" value={section.wallFlashingEast || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="wallFlashingWest" placeholder="West Wall (Length x Height)" value={section.wallFlashingWest || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="wallFlashingNorth" placeholder="North Wall (Length x Height)" value={section.wallFlashingNorth || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="wallFlashingSouth" placeholder="South Wall (Length x Height)" value={section.wallFlashingSouth || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Curbs Section */}
<label className="block mt-4">Curbs - Enter Details</label>
<input type="text" name="curbSize" placeholder="Curb Size (e.g., 5’ x 3’)" value={section.curbSize || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="number" name="curbCount" placeholder="Curb Count" value={section.curbCount || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="curbLinearFeet" placeholder="Linear Feet of Curb" value={section.curbLinearFeet || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="curbHeight" placeholder="Curb Height" value={section.curbHeight || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Curb Rails */}
<label className="block mt-4">Curb Rails</label>
<input type="text" name="curbRailSize" placeholder="Curb Rail Size (e.g., 4” x 5’)" value={section.curbRailSize || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="number" name="curbRailCount" placeholder="Curb Rail Count" value={section.curbRailCount || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Hot Stacks */}
<label className="block mt-4">Hot Stacks</label>
<input type="text" name="hotStackDiameter" placeholder="Hot Stack Diameter (e.g., 4”)" value={section.hotStackDiameter || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="number" name="hotStackCount" placeholder="Hot Stack Count" value={section.hotStackCount || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Drains Section */}
<label className="block mt-4">Drains</label>
<input type="number" name="drainCount" placeholder="Drain Count" value={section.drainCount || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="drainSize" placeholder="Drain Size" value={section.drainSize || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Wood Nailer Section */}
<label className="block mt-4">Wood Nailers</label>
<input type="text" name="woodNailerSize" placeholder="Wood Nailer Size (e.g., 2x4, 2x6)" value={section.woodNailerSize || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="number" name="woodNailerCount" placeholder="Wood Nailer Count" value={section.woodNailerCount || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Roof Hatch Section */}
<label className="block mt-4">Roof Hatch</label>
<input type="text" name="roofHatchSize" placeholder="Roof Hatch Size" value={section.roofHatchSize || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="number" name="roofHatchCount" placeholder="Roof Hatch Count" value={section.roofHatchCount || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Slip Flashing Section */}
<label className="block mt-4">Slip Flashing</label>
<input type="number" name="slipFlashingCount" placeholder="Slip Flashing Count" value={section.slipFlashingCount || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Coping Metal Section */}
<label className="block mt-4">Coping Metal</label>
<input type="text" name="copingMetalMeasurements" placeholder="Coping Metal Measurements" value={section.copingMetalMeasurements || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Hold Down Cleat Section */}
<label className="block mt-4">Hold Down Cleat</label>
<input type="number" name="holdDownCleatCount" placeholder="Hold Down Cleat Count" value={section.holdDownCleatCount || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Drip Edge/Gravel Stop Section */}
<label className="block mt-4">Drip Edge/Gravel Stop</label>
<input type="number" name="dripEdgeCount" placeholder="Drip Edge Count" value={section.dripEdgeCount || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Pipe Boots Section */}
<label className="block mt-4">Pipe Boots</label>
<input type="number" name="pipeBootsCount" placeholder="Pipe Boots Count" value={section.pipeBootsCount || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Pitch Pans (Portals) Section */}
<label className="block mt-4">Pitch Pans (Portals)</label>
<input type="number" name="pitchPansCount" placeholder="Pitch Pans Count" value={section.pitchPansCount || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Gutter Section */}
<label className="block mt-4">Gutters</label>
<input type="text" name="gutterSize" placeholder="Gutter Size (e.g., 6” or 7”)" value={section.gutterSize || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="gutterLength" placeholder="Gutter Length" value={section.gutterLength || ""} onChange={handleChange} className="w-full border p-2 rounded" />

{/* Core Sample Description */}
<h4 className="text-md font-semibold mt-4">Core Sample Description</h4>
<input type="text" name="coreSampleRoofCover" placeholder="Roof Cover" value={section.coreSampleRoofCover || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="coreSampleCoverBoard" placeholder="Cover Board" value={section.coreSampleCoverBoard || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="coreSampleTopInsulation" placeholder="Insulation (top)" value={section.coreSampleTopInsulation || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="coreSampleBottomInsulation" placeholder="Insulation (bottom)" value={section.coreSampleBottomInsulation || ""} onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="coreSampleDeckType" placeholder="Deck Type" value={section.coreSampleDeckType || ""} onChange={handleChange} className="w-full border p-2 rounded" />




{/* Wall and Curb Square Footage Section */}
<h3 className="text-lg font-bold mt-6">Wall and Curb Square Footage</h3>

<label className="block">Wall Length (ft)</label>
<input 
    type="number" 
    name="wallLength" 
    placeholder="Enter Wall Length" 
    value={section.wallLength} 
    onChange={handleChange} 
    className="w-full border p-2 rounded" 
/>

<label className="block mt-2">Wall Height (ft)</label>
<input 
    type="number" 
    name="wallHeight" 
    placeholder="Enter Wall Height" 
    value={section.wallHeight} 
    onChange={handleChange} 
    className="w-full border p-2 rounded" 
/>

<label className="block mt-2">Curb Length (ft)</label>
<input 
    type="number" 
    name="curbLength" 
    placeholder="Enter Curb Length" 
    value={section.curbLength} 
    onChange={handleChange} 
    className="w-full border p-2 rounded" 
/>

<label className="block mt-2">Curb Height (ft)</label>
<input 
    type="number" 
    name="curbHeight" 
    placeholder="Enter Curb Height" 
    value={section.curbHeight} 
    onChange={handleChange} 
    className="w-full border p-2 rounded" 
/>

{/* Auto-calculated Total Wall and Curb Square Footage */}
<label className="block mt-2">Total Wall and Curb Square Footage</label>
<input 
    type="number" 
    name="wallCurbSquareFootage" 
    value={section.wallLength && section.wallHeight && section.curbLength && section.curbHeight 
        ? (section.wallLength * section.wallHeight) + (section.curbLength * section.curbHeight) 
        : ''} 
    readOnly 
    className="w-full border p-2 rounded bg-gray-100" 
/>




    </div>
  );
};

export default RoofSection;