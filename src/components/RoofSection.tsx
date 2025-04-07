
const RoofSection = ({ section, index, onChange }) => {
  
    

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === "number" ? Number(value) : value;
      
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
      placeholder="e.g. Section 3: Canopy A"

      onChange={handleChange}
      className="w-full border p-2 rounded"
    />

    



<label className="block font-semibold">Section Age</label>
    <input
      type="text"
      name="sectionAge"
      placeholder="Section Age (Approx.)"

      onChange={handleChange}
      className="w-full border p-2 rounded"
    />


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
  </div>
</div>



{/* Roof Square Footage Section */}
<h3 className="text-lg font-bold mt-6">Section Square Footage</h3>

<label className="block">Section Length (ft)</label>
<input 
    type="number" 
    name="roofLength" 
    placeholder="Enter Roof Length" 
    value={section.roofLength} 
    onChange={handleChange} 
    className="w-full border p-2 rounded" 
/>

<label className="block mt-2">Section Width (ft)</label>
<input 
    type="number" 
    name="roofWidth" 
    placeholder="Enter Roof Width" 
    value={section.roofWidth} 
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
<label className="block">Overall Roof Condition:</label>
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
    onChange={handleChange} 
    className="w-full border p-2 rounded"
    rows={3}
/>

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
    onChange={handleChange} 
    className="w-full border p-2 rounded"
    rows={3}
/>

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
    onChange={handleChange} 
    className="w-full border p-2 rounded"
    rows={3}/>

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
    onChange={handleChange} 
    className="w-full border p-2 rounded"
    rows={3}/>

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
    onChange={handleChange} 
    className="w-full border p-2 rounded"
    rows={3}/>

                
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
    onChange={handleChange} 
    className="w-full border p-2 rounded"
    rows={3}/>

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
    onChange={handleChange} 
    className="w-full border p-2 rounded"
    rows={3}/>

   
                
                {/* Roofing Membrane/Surface Section */}
<h3 className="text-lg font-bold">Roofing Membrane/Surface</h3>

{/* Roofing Material */}
<label className="block">Material (TPO, EPDM, Modified Bitumen, BUR, Metal, Shingle, etc.)</label>
<input type="text" name="membraneMaterial" placeholder="Enter Membrane Material" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Condition of Membrane */}
<label className="block mt-2">Condition of Membrane (Punctures, Tears, Blisters, Wrinkles, etc.)</label>
<textarea name="membraneCondition" placeholder="Describe the condition" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Seams/Overlaps Condition */}
<label className="block mt-2">Seams/Overlaps Condition (Secure, Separated, Damaged, etc.)</label>
<input type="text" name="seamsCondition" placeholder="Enter condition of seams/overlaps" onChange={handleChange} className="w-full border p-2 rounded" />


<input 
    type="number" 
    name="membraneLength" 
    placeholder="Enter Roof Length" 
    value={section.membraneLength} 
    onChange={handleChange} 
    className="w-full border p-2 rounded" 
/>

{/* Fasteners Condition */}
<label className="block mt-2">Fasteners Condition (Rusted, Loose, Missing, etc.)</label>
<input type="text" name="fastenersCondition" placeholder="Enter fasteners condition" onChange={handleChange} className="w-full border p-2 rounded" />

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
<textarea name="granulesCondition" placeholder="Describe the condition of granules" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Coating Condition */}
<label className="block mt-2">Coating Condition (Peeling, Cracking, etc.)</label>
<textarea name="coatingCondition" placeholder="Describe the condition of coating" onChange={handleChange} className="w-full border p-2 rounded"></textarea>


                {/* Flashing & Sealants Section */}
<h3 className="text-lg font-bold">Flashing & Sealants</h3>

{/* Flashing Material */}
<label className="block">Flashing Material</label>
<input type="text" name="flashingMaterial" placeholder="Enter type of flashing material" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Flashing Condition */}
<label className="block mt-2">Flashing Condition (Cracked, Torn, Deteriorated, etc.)</label>
<textarea name="flashingCondition" placeholder="Describe the condition of the flashing" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Length of Damaged Flashing */}
<label className="block mt-2">Length of Damaged Flashing (in feet)</label>
<input type="number" name="damagedFlashingLength" placeholder="Enter length in feet" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Flashing Locations */}
<label className="block mt-2">Flashing Locations (Around vents, chimneys, skylights, parapet walls, etc.)</label>
<textarea name="flashingLocations" placeholder="Describe locations of flashing" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Sealants Condition */}
<label className="block mt-2">Sealants Condition (Cracked, Dried Out, Missing, etc.)</label>
<textarea name="sealantsCondition" placeholder="Describe the condition of sealants" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Length of Cracked/Deteriorated Sealant */}
<label className="block mt-2">Length of Cracked/Deteriorated Sealant (in feet)</label>
<input type="number" name="deterioratedSealantLength" placeholder="Enter length in feet" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Drainage System Section */}
<h3 className="text-lg font-bold">Drainage System</h3>

{/* Gutters Condition */}
<label className="block">Gutters Condition (Clean, Clogged, Damaged, etc.)</label>
<textarea name="guttersCondition" placeholder="Describe the condition of the gutters" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Gutter Size */}
<label className="block mt-2">Gutter Size (6", 7", etc.)</label>
<input type="text" name="gutterSize" placeholder="Enter gutter size" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Downspouts Condition */}
<label className="block mt-2">Downspouts Condition (Secure, Damaged, Missing, etc.)</label>
<textarea name="downspoutsCondition" placeholder="Describe the condition of downspouts" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Downspouts Count */}
<label className="block mt-2">Number of Downspouts</label>
<input type="number" name="downspoutsCount" placeholder="Enter total number of downspouts" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Downspouts Size */}
<label className="block mt-2">Downspouts Size</label>
<input type="text" name="downspoutsSize" placeholder="Enter size of downspouts" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Drains Condition */}
<label className="block mt-2">Drains Condition (Clear, Clogged, etc.)</label>
<textarea name="drainsCondition" placeholder="Describe the condition of the drains" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Scuppers Condition */}
<label className="block mt-2">Scuppers Condition (Clear, Damaged, etc.)</label>
<textarea name="scuppersCondition" placeholder="Describe the condition of the scuppers" onChange={handleChange} className="w-full border p-2 rounded"></textarea>





{/* Penetrations & Vents Section */}
<h3 className="text-lg font-bold">Penetrations & Vents</h3>

{/* Pipes Condition */}
<label className="block">Pipes Condition (Seals, Integrity, etc.)</label>
<textarea name="pipesCondition" placeholder="Describe the condition of pipe penetrations and seals" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Vents Condition */}
<label className="block mt-2">Vents Condition (Secure, Damaged, etc.)</label>
<textarea name="ventsCondition" placeholder="Describe the condition of vents" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* HVAC Units Condition */}
<label className="block mt-2">HVAC Units Condition (Leaks, Damage, etc.)</label>
<textarea name="hvacUnitsCondition" placeholder="Describe the condition of the roof around HVAC units" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Skylights Condition */}
<label className="block mt-2">Skylights Condition (Cracked, Leaking, Sealed, etc.)</label>
<textarea name="skylightsCondition" placeholder="Describe the condition of skylights" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Chimneys Condition */}
<label className="block mt-2">Chimneys Condition (Flashing, Cap, etc.)</label>
<textarea name="chimneysCondition" placeholder="Describe the condition of chimney flashing and cap" onChange={handleChange} className="w-full border p-2 rounded"></textarea>






{/* Parapet Walls Section */}
<h3 className="text-lg font-bold">Parapet Walls</h3>

{/* Parapet Walls Condition */}
<label className="block">Condition of Parapet Walls (Cracks, Loose Masonry, etc.)</label>
<textarea name="parapetWallsCondition" placeholder="Describe the condition of the parapet walls" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Coping Condition */}
<label className="block mt-2">Coping Condition (Cracked, Loose, Missing, etc.)</label>
<textarea name="copingCondition" placeholder="Describe the condition of coping" onChange={handleChange} className="w-full border p-2 rounded"></textarea>


{/* Insulation Section */}
<h3 className="text-lg font-bold">Insulation</h3>

{/* Evidence of Wet Insulation */}
<label className="block">Is there evidence of wet insulation?</label>
<select name="wetInsulation" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>

{/* Wet Insulation Description */}
<label className="block mt-2">If yes, describe location and extent</label>
<textarea name="wetInsulationDescription" placeholder="Describe the location and extent of wet insulation" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Type of Insulation */}
<label className="block mt-2">Type of Insulation (if known)</label>
<input type="text" name="insulationType" placeholder="e.g., Rigid Board, Loose Fill" onChange={handleChange} className="w-full border p-2 rounded" />




{/* Deck/Structure Section */}
<h3 className="text-lg font-bold">Deck/Structure</h3>

{/* Evidence of Structural Issues */}
<label className="block">Is there evidence of structural issues?</label>
<select name="structuralIssues" onChange={handleChange} className="w-full border p-2 rounded">
    <option value="">Select</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
</select>

{/* Structural Issues Description */}
<label className="block mt-2">If yes, describe location and extent</label>
<textarea name="structuralIssuesDescription" placeholder="Describe location and extent of structural issues" onChange={handleChange} className="w-full border p-2 rounded"></textarea>

{/* Plywood/Sheathing Condition */}
<label className="block mt-2">Plywood/Sheathing Condition (if accessible)</label>
<input type="text" name="sheathingCondition" placeholder="Describe condition - delamination, rot, etc." onChange={handleChange} className="w-full border p-2 rounded" />

{/* Safety Section */}
<h3 className="text-lg font-bold">Safety</h3>

{/* Roof Access */}
<label className="block">Is safe roof access available?</label>
<input type="text" name="roofAccess" placeholder="Describe how access is provided (ladder, hatch, etc.)" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Guardrails/Parapets */}
<label className="block mt-2">Condition of guardrails or parapets</label>
<input type="text" name="guardrailsParapets" placeholder="Describe the condition (secure, damaged, missing, etc.)" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Trip Hazards */}
<label className="block mt-2">Identify any potential trip hazards on the roof</label>
<input type="text" name="tripHazards" placeholder="Describe any hazards present" onChange={handleChange} className="w-full border p-2 rounded" />


{/* Additional Roof Elements Section */}
<h3 className="text-lg font-bold">Additional Roof Elements</h3>

{/* Wall Flashing Section */}
<label className="block">Wall Flashing - Length x Height</label>
<input type="text" name="wallFlashingEast" placeholder="East Wall (Length x Height)" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="wallFlashingWest" placeholder="West Wall (Length x Height)" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="wallFlashingNorth" placeholder="North Wall (Length x Height)" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="wallFlashingSouth" placeholder="South Wall (Length x Height)" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Curbs Section */}
<label className="block mt-4">Curbs - Enter Details</label>
<input type="text" name="curbSize" placeholder="Curb Size (e.g., 5’ x 3’)" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="number" name="curbCount" placeholder="Curb Count" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="curbLinearFeet" placeholder="Linear Feet of Curb" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="curbHeight" placeholder="Curb Height" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Curb Rails */}
<label className="block mt-4">Curb Rails</label>
<input type="text" name="curbRailSize" placeholder="Curb Rail Size (e.g., 4” x 5’)" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="number" name="curbRailCount" placeholder="Curb Rail Count" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Hot Stacks */}
<label className="block mt-4">Hot Stacks</label>
<input type="text" name="hotStackDiameter" placeholder="Hot Stack Diameter (e.g., 4”)" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="number" name="hotStackCount" placeholder="Hot Stack Count" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Drains Section */}
<label className="block mt-4">Drains</label>
<input type="number" name="drainCount" placeholder="Drain Count" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="drainSize" placeholder="Drain Size" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Wood Nailer Section */}
<label className="block mt-4">Wood Nailers</label>
<input type="text" name="woodNailerSize" placeholder="Wood Nailer Size (e.g., 2x4, 2x6)" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="number" name="woodNailerCount" placeholder="Wood Nailer Count" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Roof Hatch Section */}
<label className="block mt-4">Roof Hatch</label>
<input type="text" name="roofHatchSize" placeholder="Roof Hatch Size" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="number" name="roofHatchCount" placeholder="Roof Hatch Count" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Slip Flashing Section */}
<label className="block mt-4">Slip Flashing</label>
<input type="number" name="slipFlashingCount" placeholder="Slip Flashing Count" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Coping Metal Section */}
<label className="block mt-4">Coping Metal</label>
<input type="text" name="copingMetalMeasurements" placeholder="Coping Metal Measurements" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Hold Down Cleat Section */}
<label className="block mt-4">Hold Down Cleat</label>
<input type="number" name="holdDownCleatCount" placeholder="Hold Down Cleat Count" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Drip Edge/Gravel Stop Section */}
<label className="block mt-4">Drip Edge/Gravel Stop</label>
<input type="number" name="dripEdgeCount" placeholder="Drip Edge Count" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Pipe Boots Section */}
<label className="block mt-4">Pipe Boots</label>
<input type="number" name="pipeBootsCount" placeholder="Pipe Boots Count" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Pitch Pans (Portals) Section */}
<label className="block mt-4">Pitch Pans (Portals)</label>
<input type="number" name="pitchPansCount" placeholder="Pitch Pans Count" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Gutter Section */}
<label className="block mt-4">Gutters</label>
<input type="text" name="gutterSize" placeholder="Gutter Size (e.g., 6” or 7”)" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="gutterLength" placeholder="Gutter Length" onChange={handleChange} className="w-full border p-2 rounded" />

{/* Core Sample Description */}
<h4 className="text-md font-semibold mt-4">Core Sample Description</h4>
<input type="text" name="coreSampleRoofCover" placeholder="Roof Cover" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="coreSampleCoverBoard" placeholder="Cover Board" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="coreSampleTopInsulation" placeholder="Insulation (top)" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="coreSampleBottomInsulation" placeholder="Insulation (bottom)" onChange={handleChange} className="w-full border p-2 rounded" />
<input type="text" name="coreSampleDeckType" placeholder="Deck Type" onChange={handleChange} className="w-full border p-2 rounded" />




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