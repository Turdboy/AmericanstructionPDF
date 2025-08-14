// vpai-mobile/screens/InspectionScreen.tsx

import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import RoofSectionMobile from './RoofSectionMobile';
import * as DocumentPicker from 'expo-document-picker';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
import { auth } from '../firebase';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; // <--- need setDoc




const getWordCount = (text = '') => text.trim().split(/\s+/).filter(Boolean).length;


const createNewRoofSection = () => ({
  id: Date.now(),

  sectionName: '',
  sectionAge: '',
  roofLength: 0,
  roofWidth: 0,
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
  deckDamageDescription: '',
  deckMoisture: '',
  deckMoistureDescription: '',

  membraneMaterial: '',
  membraneCondition: '',
  seamsCondition: '',
  fastenersCondition: '',
  rustedFasteners: 0,
  looseFasteners: 0,
  missingFasteners: 0,
  granulesCondition: '',
  coatingCondition: '',

  flashingMaterial: '',
  flashingCondition: '',
  flashingDamageLength: 0,
  flashingLocations: '',
  sealantsCondition: '',
  sealantsLength: 0,

  guttersCondition: '',
  gutterSize: '',
  downspoutsCondition: '',
  downspoutsNumber: 0,
  downspoutsSize: '',
  drainsCondition: '',
  scuppersCondition: '',

  pipesCondition: '',
  ventsCondition: '',
  hvacCondition: '',
  skylightsCondition: '',
  chimneysCondition: '',

  parapetWallCondition: '',
  copingCondition: '',

  insulationType: '',
  insulationThickness: '',
  insulationCondition: '',
  wetInsulationEvidence: '',

  structuralIssues: '',
  structuralIssueDetails: '',
  sheathingCondition: '',

  safeAccess: '',
  guardrailCondition: '',
  tripHazards: '',

  eastWall: '',
  westWall: '',
  northWall: '',
  southWall: '',
  curbSize: '',
  curbCount: '',
  linearFeetOfCurb: '',
  curbHeight: '',
  curbRailSize: '',
  curbRailCount: '',
  hotStackDiameter: '',
  hotStackCount: '',
  drainCount: '',
  drainSize: '',
  woodNailerSize: '',
  woodNailerCount: '',
  roofHatchSize: '',
  roofHatchCount: '',
  slipFlashingCount: '',
  copingMetalMeasurements: '',
  holdDownCleatCount: '',
  dripEdgeCount: '',
  pipeBootsCount: '',
  pitchPansCount: '',
  gutterLength: '',

  roofCover: '',
  coverBoard: '',
  insulationTop: '',
  insulationBottom: '',
  deckType: '',
});



const InspectionScreen = () => {
  const navigation = useNavigation();

  const [defectImages, setDefectImages] = useState([]);
  const [overviewImages, setOverviewImages] = useState([]);
  const [droneImages, setDroneImages] = useState([]);

  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContactInfo, setClientContactInfo] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [inspectorCompany, setInspectorCompany] = useState('');
  const [inspectorContactInfo, setInspectorContactInfo] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [temperature, setTemperature] = useState('');
  const [roofSections, setRoofSections] = useState([createNewRoofSection()]);
  const [roofWarrantyStatus, setRoofWarrantyStatus] = useState('');
const [warrantyTerm, setWarrantyTerm] = useState('');
const [warrantyType, setWarrantyType] = useState('');
const [fmInsured, setFmInsured] = useState('');
const [uploadedSpreadsheet, setUploadedSpreadsheet] = useState(null);



  const pickImages = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newImage = {
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
        annotations: [],
      };

      if (type === 'defect') setDefectImages((prev) => [...prev, newImage]);
      if (type === 'overview') setOverviewImages((prev) => [...prev, newImage]);
      if (type === 'drone') setDroneImages((prev) => [...prev, newImage]);
    }
  };

  const renderImages = (images, type) => (
    <View style={styles.imageGrid}>
      {images.map((img, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
          <Image source={{ uri: img.uri }} style={styles.imagePreview} />
          {(type === 'defect'
            ? ["Section", "Area", "Caption", "Description", "Cause", "Impact", "Solution"]
            : type === 'overview'
            ? ["Section", "Area", "Caption"]
            : ["Section", "Area", "Caption", "Description"]
          ).map((field) => (
            <View key={field} style={{ marginTop: 5 }}>
              <TextInput
                style={styles.textInput}
                placeholder={field}
                value={img[field.toLowerCase()] || ""}
                onChangeText={(text) => {
                  const updated = [...images];
                  updated[index] = { ...updated[index], [field.toLowerCase()]: text };
                  if (type === 'defect') setDefectImages(updated);
                  if (type === 'overview') setOverviewImages(updated);
                  if (type === 'drone') setDroneImages(updated);
                }}
              />
            </View>
          ))}
          <TouchableOpacity
            style={{ marginTop: 5 }}
            onPress={() => navigation.navigate('ImageEditorScreen', { imageUri: img.uri })}
          >
            <Text style={{ color: '#0066cc', textDecorationLine: 'underline' }}>
              Annotate
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const handleAddSection = () => {
    setRoofSections(prev => [...prev, createNewRoofSection()]);
  };
  
  
  const handleSectionChange = (index: number, updatedSection: any) => {
    const updatedSections = [...roofSections];
    updatedSections[index] = updatedSection;
    setRoofSections(updatedSections);
  };

  const pickSpreadsheet = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
        copyToCacheDirectory: true,
      });
  
      if (res.type === 'success') {
        setUploadedSpreadsheet(res);
        console.log('Selected file:', res.name);
      } else {
        console.log('File picking canceled');
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };


  const handleSaveInspection = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save inspections.');
      return;
    }
  
    const userId = user.uid;
  
    const inspectionData = {
      propertyName,
      propertyAddress,
      clientName,
      clientContactInfo,
      inspectionDate,
      inspectorName,
      inspectorCompany,
      inspectorContactInfo,
      weatherCondition,
      temperature,
      defectImages,
      overviewImages,
      droneImages,
      roofSections,
      roofWarrantyStatus,
      warrantyTerm,
      warrantyType,
      fmInsured,
      uploadedSpreadsheet,
      createdAt: new Date().toISOString(),
      userId,
    };
  
    try {
      const inspectionRef = doc(collection(db, "inspections", userId, "drafts"));
      await setDoc(inspectionRef, inspectionData);
  
      console.log('Inspection saved successfully with ID:', inspectionRef.id);
      Alert.alert('Success', 'Inspection saved successfully!');
    } catch (error) {
      console.error('Error saving inspection:', error);
      Alert.alert('Error', 'Failed to save inspection. Please try again.');
    }
  };

  
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Commercial Roof Inspection</Text>

      {/* ✨ Upload Defect Photos */}
      <Text style={styles.sectionTitle}>Upload Defect Photos</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => pickImages('defect')}>
        <Text style={styles.uploadText}>Click to upload defect photos</Text>
      </TouchableOpacity>
      {renderImages(defectImages, 'defect')}

      {/* ✨ Upload Overview Photos */}
      <Text style={styles.sectionTitle}>Upload Overview Photos</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => pickImages('overview')}>
        <Text style={styles.uploadText}>Click to upload overview photos</Text>
      </TouchableOpacity>
      {renderImages(overviewImages, 'overview')}

      {/* ✨ Upload Drone Photos */}
      <Text style={styles.sectionTitle}>Upload Drone Overview Photos</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={() => pickImages('drone')}>
        <Text style={styles.uploadText}>Click to upload drone photos</Text>
      </TouchableOpacity>
      {renderImages(droneImages, 'drone')}

      <Text style={styles.sectionTitle}>Property Details</Text>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Property Name</Text>
  <TextInput
    placeholder="Enter property name"
    style={styles.textInput}
    value={propertyName}
    onChangeText={setPropertyName}
  />
  <Text style={styles.wordCount}>{getWordCount(propertyName)} / 5 words</Text>
</View>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Property Address</Text>
  <TextInput
    placeholder="Enter property address"
    style={styles.textInput}
    value={propertyAddress}
    onChangeText={setPropertyAddress}
  />
  <Text style={styles.wordCount}>{getWordCount(propertyAddress)} / 5 words</Text>
</View>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Client Name</Text>
  <TextInput
    placeholder="Enter client's full name"
    style={styles.textInput}
    value={clientName}
    onChangeText={setClientName}
  />
  <Text style={styles.wordCount}>{getWordCount(clientName)} / 5 words</Text>
</View>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Client Contact Info</Text>
  <TextInput
    placeholder="Enter client's contact info"
    style={styles.textInput}
    value={clientContactInfo}
    onChangeText={setClientContactInfo}
  />
  <Text style={styles.wordCount}>{getWordCount(clientContactInfo)} / 5 words</Text>
</View>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Inspection Date</Text>
  <TextInput
    placeholder="Enter inspection date (e.g., 2025-04-26)"
    style={styles.textInput}
    value={inspectionDate}
    onChangeText={setInspectionDate}
  />
  <Text style={styles.wordCount}>{getWordCount(inspectionDate)} / 5 words</Text>
</View>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Inspector Name</Text>
  <TextInput
    placeholder="Enter inspector's full name"
    style={styles.textInput}
    value={inspectorName}
    onChangeText={setInspectorName}
  />
  <Text style={styles.wordCount}>{getWordCount(inspectorName)} / 5 words</Text>
</View>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Inspector Company</Text>
  <TextInput
    placeholder="Enter inspector's company name"
    style={styles.textInput}
    value={inspectorCompany}
    onChangeText={setInspectorCompany}
  />
  <Text style={styles.wordCount}>{getWordCount(inspectorCompany)} / 5 words</Text>
</View>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Inspector Contact Info</Text>
  <TextInput
    placeholder="Enter inspector's contact info"
    style={styles.textInput}
    value={inspectorContactInfo}
    onChangeText={setInspectorContactInfo}
  />
  <Text style={styles.wordCount}>{getWordCount(inspectorContactInfo)} / 5 words</Text>
</View>

{/* ➡️ Weather Conditions Section */}
<Text style={styles.sectionTitle}>Weather Conditions</Text>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Temperature (°F)</Text>
  <TextInput
    placeholder="Enter outside temperature (°F)"
    style={styles.textInput}
    value={temperature}
    onChangeText={setTemperature}
    keyboardType="numeric"
  />
  <Text style={styles.wordCount}>{getWordCount(temperature)} / 1 word</Text>
</View>




{/* ➡️ Add Roof Sections */}
<TouchableOpacity style={styles.addButton} onPress={handleAddSection}>
  <Text style={styles.addButtonText}>➕ Add Roof Section</Text>
</TouchableOpacity>

{roofSections.map((section, index) => (
  <View key={section.id} style={styles.roofSectionBox}>
    <RoofSectionMobile 
      section={section}
      index={index}
      onChange={handleSectionChange}
    />
  </View>








))}

{/* ➡️ Warranty Coverage Section */}
<Text style={styles.sectionTitle}>Warranty Coverage</Text>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Is the current roof still under warranty?</Text>
  <View style={styles.weatherButtonGroup}>
    {["Yes", "No"].map((option) => (
      <TouchableOpacity
        key={option}
        style={[
          styles.weatherButton,
          roofWarrantyStatus === option && styles.weatherButtonSelected,
        ]}
        onPress={() => setRoofWarrantyStatus(option)}
      >
        <Text style={[
          styles.weatherButtonText,
          roofWarrantyStatus === option && styles.weatherButtonTextSelected,
        ]}>
          {option}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Warranty Term (Years)</Text>
  <View style={styles.weatherButtonGroup}>
    {["5", "10", "15", "20", "25", "30"].map((year) => (
      <TouchableOpacity
        key={year}
        style={[
          styles.weatherButton,
          warrantyTerm === year && styles.weatherButtonSelected,
        ]}
        onPress={() => setWarrantyTerm(year)}
      >
        <Text style={[
          styles.weatherButtonText,
          warrantyTerm === year && styles.weatherButtonTextSelected,
        ]}>
          {year}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Warranty Type</Text>
  <View style={styles.weatherButtonGroup}>
    {["Manufacturer", "Contractor", "Other"].map((type) => (
      <TouchableOpacity
        key={type}
        style={[
          styles.weatherButton,
          warrantyType === type && styles.weatherButtonSelected,
        ]}
        onPress={() => setWarrantyType(type)}
      >
        <Text style={[
          styles.weatherButtonText,
          warrantyType === type && styles.weatherButtonTextSelected,
        ]}>
          {type}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>Is the Building FM Insured?</Text>
  <View style={styles.weatherButtonGroup}>
    {["Yes", "No"].map((option) => (
      <TouchableOpacity
        key={option}
        style={[
          styles.weatherButton,
          fmInsured === option && styles.weatherButtonSelected,
        ]}
        onPress={() => setFmInsured(option)}
      >
        <Text style={[
          styles.weatherButtonText,
          fmInsured === option && styles.weatherButtonTextSelected,
        ]}>
          {option}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

{/* Disclaimer */}
<Text style={{ fontSize: 12, color: '#888', marginTop: 10, marginBottom: 20 }}>
  Disclaimer: This inspection is visual only and does not include destructive (invasive) testing or thermal scans unless otherwise noted.
</Text>

{/* Upload Estimating Spreadsheet */}
<Text style={styles.sectionTitle}>Upload Estimating Spreadsheet</Text>

<TouchableOpacity style={styles.uploadBox} onPress={pickSpreadsheet}>
  <Text style={styles.uploadText}>
    {uploadedSpreadsheet ? uploadedSpreadsheet.name : 'Click to upload spreadsheet file'}
  </Text>
</TouchableOpacity>







{/* ➡️ Save Button */}
<TouchableOpacity style={styles.saveButton} onPress={handleSaveInspection}
>
  <Text style={styles.saveButtonText}>💾 Save Inspection</Text>
</TouchableOpacity>








    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadText: {
    color: '#0066cc',
  },
  imageGrid: {
    marginTop: 10,
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 8,
    fontSize: 14,
  },
  weatherButtonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  weatherButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  weatherButtonSelected: {
    backgroundColor: '#0066cc',
  },
  weatherButtonText: {
    color: '#333',
    fontSize: 14,
  },
  weatherButtonTextSelected: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  addButton: {
    marginTop: 30,
    backgroundColor: '#e0f7ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#0077cc',
    fontWeight: 'bold',
    fontSize: 16,
  },
  roofSectionBox: {
    marginTop: 20,
  },
  saveButton: {
    marginTop: 40,
    backgroundColor: '#0077cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  
});

export default InspectionScreen;
