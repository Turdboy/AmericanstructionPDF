import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const getWordCount = (text = '') => text.trim().split(/\s+/).filter(Boolean).length;

const WORD_LIMITS = {
  sectionName: 2,
  sectionAge: 1,
  leaksDescription: 21,
  pondingWaterDescription: 21,
  debrisDescription: 21,
  vegetationDescription: 21,
  accessibilityDescription: 21,
  deckDamageDescription: 21,
  deckMoistureDescription: 21,
  membraneMaterial: 2,
  membraneCondition: 20,
  seamsCondition: 20,
  granulesCondition: 20,
  coatingCondition: 20,
  flashingMaterial: 2,
  flashingCondition: 32,
  flashingLocations: 32,
  sealantsCondition: 32,
  guttersCondition: 14,
  downspoutsCondition: 14,
  drainsCondition: 14,
  scuppersCondition: 14,
  pipesCondition: 14,
  ventsCondition: 14,
  hvacCondition: 14,
  skylightsCondition: 14,
  chimneysCondition: 14,
  parapetWallCondition: 14,
  copingCondition: 14,
  safeAccess: 14,
  guardrailCondition: 14,
  tripHazards: 14,
  structuralIssueDetails: 14,
  sheathingCondition: 14,
};

const RoofSectionMobile = ({ section, index, onChange }) => {
  const handleChange = (field, value) => {
    const limit = WORD_LIMITS[field];
    if (limit && getWordCount(value) > limit) return;
    onChange(index, { ...section, [field]: value });
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Roof Section {index + 1}</Text>

      {/* Section Info */}
      <Text style={styles.inputLabel}>Section Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter section name"
        value={section.sectionName || ''}
        onChangeText={(text) => handleChange('sectionName', text)}
      />
      <Text style={styles.wordCount}>{getWordCount(section.sectionName)} / 2 words</Text>

      <Text style={styles.inputLabel}>Section Age (Years)</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Approximate age"
        value={section.sectionAge || ''}
        onChangeText={(text) => handleChange('sectionAge', text)}
        keyboardType="numeric"
      />
      <Text style={styles.wordCount}>{getWordCount(section.sectionAge)} / 1 word</Text>

      {/* Roof Dimensions */}
      <Text style={styles.inputLabel}>Roof Length (ft)</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter roof length"
        value={section.roofLength?.toString() || ''}
        onChangeText={(text) => handleChange('roofLength', parseFloat(text) || 0)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>Roof Width (ft)</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter roof width"
        value={section.roofWidth?.toString() || ''}
        onChangeText={(text) => handleChange('roofWidth', parseFloat(text) || 0)}
        keyboardType="numeric"
      />

      <Text style={styles.inputLabel}>Total Roof Square Footage</Text>
      <TextInput
        style={[styles.textInput, { backgroundColor: '#eee' }]}
        value={
          section.roofLength && section.roofWidth
            ? (section.roofLength * section.roofWidth).toString()
            : ''
        }
        editable={false}
      />

      {/* General Observations */}
      <Text style={styles.sectionSubTitle}>General Observations</Text>

      {[
        { label: 'Evidence of Leaks/Water Damage?', field: 'leaks', descField: 'leaksDescription', descPlaceholder: 'Describe location and extent' },
        { label: 'Ponding Water?', field: 'pondingWater', descField: 'pondingWaterDescription', descPlaceholder: 'Describe location and extent' },
        { label: 'Debris Accumulation?', field: 'debrisAccumulation', descField: 'debrisDescription', descPlaceholder: 'Describe location and type of debris' },
        { label: 'Vegetation Growth?', field: 'vegetationGrowth', descField: 'vegetationDescription', descPlaceholder: 'Describe location and type of vegetation' },
        { label: 'Accessibility Issues?', field: 'accessibilityIssues', descField: 'accessibilityDescription', descPlaceholder: 'Describe' },
      ].map(({ label, field, descField, descPlaceholder }) => (
        <View key={field}>
          <Text style={styles.inputLabel}>{label}</Text>
          <View style={styles.buttonGroup}>
            {['Yes', 'No'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.button,
                  section[field] === option && styles.buttonSelected,
                ]}
                onPress={() => handleChange(field, option)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    section[field] === option && styles.buttonTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.textInput}
            placeholder={descPlaceholder}
            value={section[descField] || ''}
            onChangeText={(text) => handleChange(descField, text)}
            multiline
          />
          <Text style={styles.wordCount}>
            {getWordCount(section[descField] || '')} / 21 words
          </Text>




          
        </View>
      ))}

      {/* Interior Evaluation */}
<Text style={styles.sectionSubTitle}>Interior Evaluation</Text>

<Text style={styles.inputLabel}>Is the underside of the roof deck accessible?</Text>
<View style={styles.buttonGroup}>
  {['Yes', 'No'].map((option) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.button,
        section.undersideAccessible === option && styles.buttonSelected,
      ]}
      onPress={() => handleChange('undersideAccessible', option)}
    >
      <Text
        style={[
          styles.buttonText,
          section.undersideAccessible === option && styles.buttonTextSelected,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  ))}
</View>

<Text style={styles.inputLabel}>General Condition of the Roof Deck</Text>
<View style={styles.buttonGroup}>
  {['Good', 'Fair', 'Poor', 'Failed'].map((option) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.button,
        section.deckCondition === option && styles.buttonSelected,
      ]}
      onPress={() => handleChange('deckCondition', option)}
    >
      <Text
        style={[
          styles.buttonText,
          section.deckCondition === option && styles.buttonTextSelected,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  ))}
</View>

<Text style={styles.inputLabel}>Signs of Damage or Deterioration of Deck?</Text>
<View style={styles.buttonGroup}>
  {['Yes', 'No'].map((option) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.button,
        section.deckDamage === option && styles.buttonSelected,
      ]}
      onPress={() => handleChange('deckDamage', option)}
    >
      <Text
        style={[
          styles.buttonText,
          section.deckDamage === option && styles.buttonTextSelected,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  ))}
</View>

<TextInput
  style={styles.textInput}
  placeholder="If yes, provide their location and brief description"
  value={section.deckDamageDescription || ''}
  onChangeText={(text) => handleChange('deckDamageDescription', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.deckDamageDescription || '')} / 21 words</Text>

<Text style={styles.inputLabel}>Signs of Moisture Intrusion or Water Damage?</Text>
<View style={styles.buttonGroup}>
  {['Yes', 'No'].map((option) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.button,
        section.deckMoisture === option && styles.buttonSelected,
      ]}
      onPress={() => handleChange('deckMoisture', option)}
    >
      <Text
        style={[
          styles.buttonText,
          section.deckMoisture === option && styles.buttonTextSelected,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  ))}
</View>

<TextInput
  style={styles.textInput}
  placeholder="If yes, provide their location and brief description"
  value={section.deckMoistureDescription || ''}
  onChangeText={(text) => handleChange('deckMoistureDescription', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.deckMoistureDescription || '')} / 21 words</Text>


{/* Roofing Membrane/Surface */}
<Text style={styles.sectionSubTitle}>Roofing Membrane/Surface</Text>

<Text style={styles.inputLabel}>Material (TPO, EPDM, Modified Bitumen, BUR, Metal, Shingle, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Enter Membrane Material"
  value={section.membraneMaterial || ''}
  onChangeText={(text) => handleChange('membraneMaterial', text)}
/>
<Text style={styles.wordCount}>{getWordCount(section.membraneMaterial || '')} / 2 words</Text>

<Text style={styles.inputLabel}>Condition of Membrane (Punctures, Tears, Blisters, Wrinkles, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition"
  value={section.membraneCondition || ''}
  onChangeText={(text) => handleChange('membraneCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.membraneCondition || '')} / 27 words</Text>

<Text style={styles.inputLabel}>Seams/Overlaps Condition (Secure, Separated, Damaged, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Enter condition of seams/overlaps"
  value={section.seamsCondition || ''}
  onChangeText={(text) => handleChange('seamsCondition', text)}
/>
<Text style={styles.wordCount}>{getWordCount(section.seamsCondition || '')} / 27 words</Text>

<Text style={styles.inputLabel}>Fasteners Condition (Rusted, Loose, Missing, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Enter fasteners condition"
  value={section.fastenersCondition || ''}
  onChangeText={(text) => handleChange('fastenersCondition', text)}
/>

<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
  <View style={{ flex: 1, marginRight: 5 }}>
    <Text style={styles.inputLabel}>Rusted Fasteners</Text>
    <TextInput
      style={styles.textInput}
      placeholder="Count"
      value={section.rustedFasteners?.toString() || ''}
      onChangeText={(text) => handleChange('rustedFasteners', parseInt(text) || 0)}
      keyboardType="numeric"
    />
  </View>
  <View style={{ flex: 1, marginHorizontal: 5 }}>
    <Text style={styles.inputLabel}>Loose Fasteners</Text>
    <TextInput
      style={styles.textInput}
      placeholder="Count"
      value={section.looseFasteners?.toString() || ''}
      onChangeText={(text) => handleChange('looseFasteners', parseInt(text) || 0)}
      keyboardType="numeric"
    />
  </View>
  <View style={{ flex: 1, marginLeft: 5 }}>
    <Text style={styles.inputLabel}>Missing Fasteners</Text>
    <TextInput
      style={styles.textInput}
      placeholder="Count"
      value={section.missingFasteners?.toString() || ''}
      onChangeText={(text) => handleChange('missingFasteners', parseInt(text) || 0)}
      keyboardType="numeric"
    />
  </View>
</View>

<Text style={styles.inputLabel}>Granules Condition (Loss, Wear, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of granules"
  value={section.granulesCondition || ''}
  onChangeText={(text) => handleChange('granulesCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.granulesCondition || '')} / 27 words</Text>

<Text style={styles.inputLabel}>Coating Condition (Peeling, Cracking, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of coating"
  value={section.coatingCondition || ''}
  onChangeText={(text) => handleChange('coatingCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.coatingCondition || '')} / 27 words</Text>



{/* Flashing & Sealants */}
<Text style={styles.sectionSubTitle}>Flashing & Sealants</Text>

<Text style={styles.inputLabel}>Flashing Material</Text>
<TextInput
  style={styles.textInput}
  placeholder="Enter type of flashing material"
  value={section.flashingMaterial || ''}
  onChangeText={(text) => handleChange('flashingMaterial', text)}
/>
<Text style={styles.wordCount}>{getWordCount(section.flashingMaterial || '')} / 2 words</Text>

<Text style={styles.inputLabel}>Flashing Condition (Cracked, Torn, Deteriorated, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of the flashing"
  value={section.flashingCondition || ''}
  onChangeText={(text) => handleChange('flashingCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.flashingCondition || '')} / 32 words</Text>

<Text style={styles.inputLabel}>Length of Damaged Flashing (in feet)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Enter length in feet"
  value={section.flashingDamageLength?.toString() || ''}
  onChangeText={(text) => handleChange('flashingDamageLength', parseFloat(text) || 0)}
  keyboardType="numeric"
/>

<Text style={styles.inputLabel}>Flashing Locations (Around vents, chimneys, skylights, parapet walls, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe locations of flashing"
  value={section.flashingLocations || ''}
  onChangeText={(text) => handleChange('flashingLocations', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.flashingLocations || '')} / 32 words</Text>

<Text style={styles.inputLabel}>Sealants Condition (Cracked, Dried Out, Missing, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of sealants"
  value={section.sealantsCondition || ''}
  onChangeText={(text) => handleChange('sealantsCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.sealantsCondition || '')} / 32 words</Text>

<Text style={styles.inputLabel}>Length of Cracked/Deteriorated Sealant (in feet)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Enter length in feet"
  value={section.sealantsLength?.toString() || ''}
  onChangeText={(text) => handleChange('sealantsLength', parseFloat(text) || 0)}
  keyboardType="numeric"
/>


{/* Drainage System */}
<Text style={styles.sectionSubTitle}>Drainage System</Text>

<Text style={styles.inputLabel}>Gutters Condition (Clean, Clogged, Damaged, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of the gutters"
  value={section.guttersCondition || ''}
  onChangeText={(text) => handleChange('guttersCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.guttersCondition || '')} / 32 words</Text>

<Text style={styles.inputLabel}>Gutter Size (6", 7", etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Enter gutter size"
  value={section.gutterSize || ''}
  onChangeText={(text) => handleChange('gutterSize', text)}
/>

<Text style={styles.inputLabel}>Downspouts Condition (Secure, Damaged, Missing, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of downspouts"
  value={section.downspoutsCondition || ''}
  onChangeText={(text) => handleChange('downspoutsCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.downspoutsCondition || '')} / 32 words</Text>

<Text style={styles.inputLabel}>Number of Downspouts</Text>
<TextInput
  style={styles.textInput}
  placeholder="Enter total number of downspouts"
  value={section.downspoutsNumber?.toString() || ''}
  onChangeText={(text) => handleChange('downspoutsNumber', parseInt(text) || 0)}
  keyboardType="numeric"
/>

<Text style={styles.inputLabel}>Downspouts Size</Text>
<TextInput
  style={styles.textInput}
  placeholder="Enter size of downspouts"
  value={section.downspoutsSize || ''}
  onChangeText={(text) => handleChange('downspoutsSize', text)}
/>

<Text style={styles.inputLabel}>Drains Condition (Clear, Clogged, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of the drains"
  value={section.drainsCondition || ''}
  onChangeText={(text) => handleChange('drainsCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.drainsCondition || '')} / 32 words</Text>

<Text style={styles.inputLabel}>Scuppers Condition (Clear, Damaged, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of the scuppers"
  value={section.scuppersCondition || ''}
  onChangeText={(text) => handleChange('scuppersCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.scuppersCondition || '')} / 32 words</Text>

{/* Penetrations & Vents */}
<Text style={styles.sectionSubTitle}>Penetrations & Vents</Text>

<Text style={styles.inputLabel}>Pipes Condition (Seals, Integrity, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of pipe penetrations and seals"
  value={section.pipesCondition || ''}
  onChangeText={(text) => handleChange('pipesCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.pipesCondition || '')} / 14 words</Text>

<Text style={styles.inputLabel}>Vents Condition (Secure, Damaged, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of vents"
  value={section.ventsCondition || ''}
  onChangeText={(text) => handleChange('ventsCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.ventsCondition || '')} / 14 words</Text>

<Text style={styles.inputLabel}>HVAC Units Condition (Leaks, Damage, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of the roof around HVAC units"
  value={section.hvacCondition || ''}
  onChangeText={(text) => handleChange('hvacCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.hvacCondition || '')} / 14 words</Text>

<Text style={styles.inputLabel}>Skylights Condition (Cracked, Leaking, Sealed, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of skylights"
  value={section.skylightsCondition || ''}
  onChangeText={(text) => handleChange('skylightsCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.skylightsCondition || '')} / 14 words</Text>

<Text style={styles.inputLabel}>Chimneys Condition (Flashing, Cap, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of chimney flashing and cap"
  value={section.chimneysCondition || ''}
  onChangeText={(text) => handleChange('chimneysCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.chimneysCondition || '')} / 14 words</Text>

{/* Parapet Walls */}
<Text style={styles.sectionSubTitle}>Parapet Walls</Text>

<Text style={styles.inputLabel}>Condition of Parapet Walls (Cracks, Loose Masonry, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of the parapet walls"
  value={section.parapetWallCondition || ''}
  onChangeText={(text) => handleChange('parapetWallCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.parapetWallCondition || '')} / 14 words</Text>

<Text style={styles.inputLabel}>Coping Condition (Cracked, Loose, Missing, etc.)</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe the condition of coping"
  value={section.copingCondition || ''}
  onChangeText={(text) => handleChange('copingCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.copingCondition || '')} / 14 words</Text>

{/* Insulation */}
<Text style={styles.sectionSubTitle}>Insulation</Text>

<Text style={styles.inputLabel}>Insulation Type</Text>
<TextInput
  style={styles.textInput}
  placeholder="e.g., Rigid Board, Loose Fill"
  value={section.insulationType || ''}
  onChangeText={(text) => handleChange('insulationType', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.insulationType || '')} / 14 words</Text>

<Text style={styles.inputLabel}>Insulation Thickness (inches)</Text>
<TextInput
  style={styles.textInput}
  placeholder="e.g., 2.5"
  value={section.insulationThickness || ''}
  onChangeText={(text) => handleChange('insulationThickness', text)}
  keyboardType="numeric"
/>

<Text style={styles.inputLabel}>General Condition of Insulation</Text>
<TextInput
  style={styles.textInput}
  placeholder="e.g., Good, Poor"
  value={section.insulationCondition || ''}
  onChangeText={(text) => handleChange('insulationCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.insulationCondition || '')} / 14 words</Text>

<Text style={styles.inputLabel}>Evidence of Wet Insulation?</Text>
<View style={styles.buttonGroup}>
  {['Yes', 'No'].map((option) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.button,
        section.wetInsulationEvidence === option && styles.buttonSelected,
      ]}
      onPress={() => handleChange('wetInsulationEvidence', option)}
    >
      <Text
        style={[
          styles.buttonText,
          section.wetInsulationEvidence === option && styles.buttonTextSelected,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  ))}
</View>



{/* Deck / Structure */}
<Text style={styles.sectionSubTitle}>Deck / Structure</Text>

<Text style={styles.inputLabel}>Evidence of Structural Issues?</Text>
<View style={styles.buttonGroup}>
  {['Yes', 'No'].map((option) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.button,
        section.structuralIssues === option && styles.buttonSelected,
      ]}
      onPress={() => handleChange('structuralIssues', option)}
    >
      <Text
        style={[
          styles.buttonText,
          section.structuralIssues === option && styles.buttonTextSelected,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  ))}
</View>

<Text style={styles.inputLabel}>Location & Extent of Issues</Text>
<TextInput
  style={styles.textInput}
  placeholder="Describe location and extent"
  value={section.structuralIssueDetails || ''}
  onChangeText={(text) => handleChange('structuralIssueDetails', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.structuralIssueDetails || '')} / 14 words</Text>

<Text style={styles.inputLabel}>Plywood/Sheathing Condition</Text>
<TextInput
  style={styles.textInput}
  placeholder="e.g., Rotting, Delamination"
  value={section.sheathingCondition || ''}
  onChangeText={(text) => handleChange('sheathingCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.sheathingCondition || '')} / 14 words</Text>

{/* Safety */}
<Text style={styles.sectionSubTitle}>Safety</Text>

<Text style={styles.inputLabel}>Is safe roof access available?</Text>
<TextInput
  style={styles.textInput}
  placeholder="e.g., Hatch, Ladder Access"
  value={section.safeAccess || ''}
  onChangeText={(text) => handleChange('safeAccess', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.safeAccess || '')} / 14 words</Text>

<Text style={styles.inputLabel}>Condition of guardrails or parapets</Text>
<TextInput
  style={styles.textInput}
  placeholder="e.g., Missing guardrails on west side"
  value={section.guardrailCondition || ''}
  onChangeText={(text) => handleChange('guardrailCondition', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.guardrailCondition || '')} / 14 words</Text>

<Text style={styles.inputLabel}>Trip hazards on roof</Text>
<TextInput
  style={styles.textInput}
  placeholder="e.g., Loose cable, uneven membrane"
  value={section.tripHazards || ''}
  onChangeText={(text) => handleChange('tripHazards', text)}
  multiline
/>
<Text style={styles.wordCount}>{getWordCount(section.tripHazards || '')} / 14 words</Text>

{/* ➡️ Additional Roof Elements */}
<Text style={styles.sectionSubTitle}>Additional Roof Elements</Text>

<Text style={styles.inputLabel}>East Wall (Length x Height)</Text>
<TextInput style={styles.textInput} value={section.eastWall || ''} onChangeText={(text) => handleChange('eastWall', text)} />

<Text style={styles.inputLabel}>West Wall (Length x Height)</Text>
<TextInput style={styles.textInput} value={section.westWall || ''} onChangeText={(text) => handleChange('westWall', text)} />

<Text style={styles.inputLabel}>North Wall (Length x Height)</Text>
<TextInput style={styles.textInput} value={section.northWall || ''} onChangeText={(text) => handleChange('northWall', text)} />

<Text style={styles.inputLabel}>South Wall (Length x Height)</Text>
<TextInput style={styles.textInput} value={section.southWall || ''} onChangeText={(text) => handleChange('southWall', text)} />

<Text style={styles.inputLabel}>Curb Size (e.g., 5’ x 3’)</Text>
<TextInput style={styles.textInput} value={section.curbSize || ''} onChangeText={(text) => handleChange('curbSize', text)} />

<Text style={styles.inputLabel}>Curb Count</Text>
<TextInput style={styles.textInput} value={section.curbCount || ''} onChangeText={(text) => handleChange('curbCount', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Linear Feet of Curb</Text>
<TextInput style={styles.textInput} value={section.linearFeetOfCurb || ''} onChangeText={(text) => handleChange('linearFeetOfCurb', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Curb Height</Text>
<TextInput style={styles.textInput} value={section.curbHeight || ''} onChangeText={(text) => handleChange('curbHeight', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Curb Rail Size (e.g., 4” x 5’)</Text>
<TextInput style={styles.textInput} value={section.curbRailSize || ''} onChangeText={(text) => handleChange('curbRailSize', text)} />

<Text style={styles.inputLabel}>Curb Rail Count</Text>
<TextInput style={styles.textInput} value={section.curbRailCount || ''} onChangeText={(text) => handleChange('curbRailCount', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Hot Stack Diameter (e.g., 4”)</Text>
<TextInput style={styles.textInput} value={section.hotStackDiameter || ''} onChangeText={(text) => handleChange('hotStackDiameter', text)} />

<Text style={styles.inputLabel}>Hot Stack Count</Text>
<TextInput style={styles.textInput} value={section.hotStackCount || ''} onChangeText={(text) => handleChange('hotStackCount', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Drain Count</Text>
<TextInput style={styles.textInput} value={section.drainCount || ''} onChangeText={(text) => handleChange('drainCount', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Drain Size</Text>
<TextInput style={styles.textInput} value={section.drainSize || ''} onChangeText={(text) => handleChange('drainSize', text)} />

<Text style={styles.inputLabel}>Wood Nailer Size (e.g., 2x4, 2x6)</Text>
<TextInput style={styles.textInput} value={section.woodNailerSize || ''} onChangeText={(text) => handleChange('woodNailerSize', text)} />

<Text style={styles.inputLabel}>Wood Nailer Count</Text>
<TextInput style={styles.textInput} value={section.woodNailerCount || ''} onChangeText={(text) => handleChange('woodNailerCount', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Roof Hatch Size</Text>
<TextInput style={styles.textInput} value={section.roofHatchSize || ''} onChangeText={(text) => handleChange('roofHatchSize', text)} />

<Text style={styles.inputLabel}>Roof Hatch Count</Text>
<TextInput style={styles.textInput} value={section.roofHatchCount || ''} onChangeText={(text) => handleChange('roofHatchCount', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Slip Flashing Count</Text>
<TextInput style={styles.textInput} value={section.slipFlashingCount || ''} onChangeText={(text) => handleChange('slipFlashingCount', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Coping Metal Measurements</Text>
<TextInput style={styles.textInput} value={section.copingMetalMeasurements || ''} onChangeText={(text) => handleChange('copingMetalMeasurements', text)} />

<Text style={styles.inputLabel}>Hold Down Cleat Count</Text>
<TextInput style={styles.textInput} value={section.holdDownCleatCount || ''} onChangeText={(text) => handleChange('holdDownCleatCount', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Drip Edge Count</Text>
<TextInput style={styles.textInput} value={section.dripEdgeCount || ''} onChangeText={(text) => handleChange('dripEdgeCount', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Pipe Boots Count</Text>
<TextInput style={styles.textInput} value={section.pipeBootsCount || ''} onChangeText={(text) => handleChange('pipeBootsCount', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Pitch Pans Count</Text>
<TextInput style={styles.textInput} value={section.pitchPansCount || ''} onChangeText={(text) => handleChange('pitchPansCount', text)} keyboardType="numeric" />

<Text style={styles.inputLabel}>Gutter Size (e.g., 6” or 7”)</Text>
<TextInput style={styles.textInput} value={section.gutterSize || ''} onChangeText={(text) => handleChange('gutterSize', text)} />

<Text style={styles.inputLabel}>Gutter Length</Text>
<TextInput style={styles.textInput} value={section.gutterLength || ''} onChangeText={(text) => handleChange('gutterLength', text)} keyboardType="numeric" />

{/* ➡️ Core Sample Description */}
<Text style={styles.sectionSubTitle}>Core Sample Description</Text>

<Text style={styles.inputLabel}>Roof Cover</Text>
<TextInput style={styles.textInput} value={section.roofCover || ''} onChangeText={(text) => handleChange('roofCover', text)} />

<Text style={styles.inputLabel}>Cover Board</Text>
<TextInput style={styles.textInput} value={section.coverBoard || ''} onChangeText={(text) => handleChange('coverBoard', text)} />

<Text style={styles.inputLabel}>Insulation (top)</Text>
<TextInput style={styles.textInput} value={section.insulationTop || ''} onChangeText={(text) => handleChange('insulationTop', text)} />

<Text style={styles.inputLabel}>Insulation (bottom)</Text>
<TextInput style={styles.textInput} value={section.insulationBottom || ''} onChangeText={(text) => handleChange('insulationBottom', text)} />

<Text style={styles.inputLabel}>Deck Type</Text>
<TextInput style={styles.textInput} value={section.deckType || ''} onChangeText={(text) => handleChange('deckType', text)} />



    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionSubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  wordCount: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  buttonSelected: {
    backgroundColor: '#0066cc',
  },
  buttonText: {
    color: '#333',
    fontSize: 14,
  },
  buttonTextSelected: {
    color: '#fff',
  },
});

export default RoofSectionMobile;
