import { generatePDF } from "../utils/pdfGenerator";
import { prepareImages } from "../utils/pdfGenerator";
import RoofSection from './RoofSection';
import React, { useRef, useEffect, useState } from 'react';
import { db, storage, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth"; // Add this if needed
import { getDocs, query, orderBy, where, limit } from "firebase/firestore";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import { saveInspectionDraftToFirestore, saveInspectionToArchive } from "../services/inspectionService";
import { fetchImageAsBase64 } from "../utils/pdfGenerator"; // make sure this is imported
import { ImageEditorPopup } from "./ImageEditorPopup"; // adjust the path if needed
import { useAuth } from "../../hooks/useAuth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import ScopeOfWorkSelector from "./ScopeDropdown";
import ScopeDropdown from './ScopeDropdown';
import PhotoDescriptionDropdown from "./PhotoDescriptionDropdown";
import { useNavigate } from "react-router-dom";
import { sendProposalEmail } from "../utils/sendProposalEmail";
import { useSearchParams } from "react-router-dom";


type OptionalAddOn = {
  title: string;
  description: string;
  price: string;
};










const clearSavedDraft = async (userId) => {
  const docRef = doc(db, "inspections", userId);
  await deleteDoc(docRef);
};








const base64ToObjectUrl = async (base64: string): Promise<string> => {
  const res = await fetch(base64);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};















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

  const deepClean = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(deepClean);
    } else if (obj && typeof obj === 'object') {
      const cleaned = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          cleaned[key] = deepClean(value);
        }
      }
      return cleaned;
    }
    return obj;
  };
  

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
const [optionalAddOns, setOptionalAddOns] = useState<OptionalAddOn[]>([]);

const [clientSignature, setClientSignature] = useState("");
const [clientInitials, setClientInitials] = useState("");
const [inspectorSignature, setInspectorSignature] = useState("");
const [inspectorInitials, setInspectorInitials] = useState("");




    const location = useLocation();
const loadDraftFlag = location.state?.loadDraft || false;



    const navigate = useNavigate();

const [selectedScope, setSelectedScope] = useState("");
const [editableScopeText, setEditableScopeText] = useState("");
const [selectedScopeText, setSelectedScopeText] = useState("");



const [searchParams] = useSearchParams();








const handleCheckSignatureStatus = () => {
  if (!formData?.propertyName) {
    console.warn("⚠️ No property name found.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    console.warn("⛔ User not logged in.");
    return;
  }

  const safeJobName = formData.propertyName
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]/g, "")
    .toLowerCase();

  const fullJobId = `${user.uid}_${safeJobName}`;
  navigate(`/inspections/clientpage?job=${fullJobId}`);
};













type AddOn = {
  title: string;
  description: string;
  price: string;
};


    

    
    const { user } = useAuth();
    const handleClearInspection = async () => {
      const confirmClear = window.confirm(
        "Are you sure you want to clear this inspection? This will remove saved data."
      );
      if (!confirmClear) return;
    
      // Reset local state
      setFormData({
        propertyName: '',
        propertyAddress: '',
        clientname: '',
        clientcontactinfo: '',
        inspectionDate: '',
        inspectorName: '',
        inspectorCompany: '',
        inspectorcontactinfo: '',
        weatherCondition: '',
        temperature: '',
        roofType: '',
        roofAge: '',
        recommendationDetails: '',
        recommendationPrioritization: '',
        recommendationCost: '',
        overallConditionSummary: '',
        images: [],
        overviewImages: [],
        droneImages: [],
      });
      setRoofSections([ { ...emptyRoofSection } ]);
      setFinalEstimate(null);
      setSpreadsheetUrl(null);
      setSpreadsheetUploaded(false);
      setClientSignatureConfirmed(false);
      
setSelected([]); // if using
setClientName("");
setClientSignature("");
setClientInitials("");



      setTableData([]);
    
      // Delete Firestore draft if exists
      if (user?.uid) {
        try {
          await deleteDoc(doc(db, "inspections", user.uid));
          console.log("✅ Deleted Firestore draft");
        } catch (error) {
          console.error("❌ Error deleting draft:", error);
        }
      }
    };
    



    // State to store form data
    const [formData, setFormData] = useState({



  pdfToggles: {
    // Text/content sections
    scopeOfWork: true,
    serviceAndMaintenance: true,
    termsAndConditions: true,
    laborWarranty: true,
    signaturePage: true,
    contract: true,
    roofSections: true,

    // Image/photo sections
    defectPhotos: true,
    overviewPhotos: true,
    dronePhotos: true,
  },


      selectedScopeText: "",

      
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


        recommendationDetails: '',
recommendationPrioritization: '',
recommendationCost: '',
overallConditionSummary: '',

additionalPDFs: [],
        
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
        sectionAge: '',
        roofLength: null,
        roofWidth: null,
        roofSquareFootage: null,
    
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
        deckDamageDescription: '',
        deckMoisture: '',
        deckMoistureDescription: '',
    
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
        rustedFasteners: null,
        looseFasteners: null,
        missingFasteners: null,
        granulesCondition: '',
        coatingCondition: '',
    
        // Flashing & Sealants
        flashingMaterial: '',
        flashingCondition: '',
        flashingDamageLength: null,
        flashingLocations: '',
        sealantsCondition: '',
        sealantsLength: null,
    
        // Drainage System
        guttersCondition: '',
        gutterSize: '',
        downspoutsCondition: '',
        downspoutsNumber: null,
        downspoutsSize: '',
        drainsCondition: '',
        scuppersCondition: '',
    
        // Penetrations & Vents
        pipesCondition: '',
        ventsCondition: '',
        hvacCondition: '',
        skylightsCondition: '',
        chimneysCondition: '',
    
        // Parapet Walls
        parapetWallCondition: '',
        copingCondition: '',
    
        // Insulation
        insulationType: '',
        insulationThickness: '',
        insulationCondition: '',
        wetInsulation: '',
    
        // Deck / Structure
        structuralIssues: '',
        structuralIssueDetails: '',
        sheathingCondition: '',
    
        // Safety
        safeAccess: '',
        guardrailCondition: '',
        tripHazards: '',
    
        // Additional Roof Elements
        wallFlashingEast: '',
        wallFlashingWest: '',
        wallFlashingNorth: '',
        wallFlashingSouth: '',
        curbSize: '',
        curbCount: null,
        curbLinearFeet: '',
        curbHeight: '',
        curbRailSize: '',
        curbRailCount: null,
        hotStackDiameter: '',
        hotStackCount: null,
        drainCount: null,
        drainSize: '',
        woodNailerSize: '',
        woodNailerCount: null,
        roofHatchSize: '',
        roofHatchCount: null,
        slipFlashingCount: null,
        copingMetalMeasurements: '',
        holdDownCleatCount: null,
        dripEdgeCount: null,
        pipeBootsCount: null,
        pitchPansCount: null,
        gutterLength: '',
    
        // Core Sample
        coreSampleRoofCover: '',
        coreSampleCoverBoard: '',
        coreSampleTopInsulation: '',
        coreSampleBottomInsulation: '',
        coreSampleDeckType: '',
    
        // Wall and Curb Square Footage
        wallLength: null,
        wallHeight: null,
        curbLength: null,
        wallCurbSquareFootage: null,
      }
    ]);

    const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});

    const toggleSection = (index: number) => {
      setExpandedSections((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };
    



    const [finalEstimate, setFinalEstimate] = useState<number | null>(null);


    const [spreadsheetUploaded, setSpreadsheetUploaded] = useState(false);

    
const [configMenuOpen, setConfigMenuOpen] = useState(false);

    const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);

    const [editorOpen, setEditorOpen] = useState(false);
const [editorImage, setEditorImage] = useState(null);
const [editorIndex, setEditorIndex] = useState<number | null>(null);
const [editorType, setEditorType] = useState<'images' | 'overviewImages' | 'droneImages' | null>(null);

const [clientConfirmation, setClientConfirmation] = useState(null);
const [inspectorConfirmation, setInspectorConfirmation] = useState(null);




const [inspectorConfirmed, setInspectorConfirmed] = useState(false);
const [clientConfirmed, setClientConfirmed] = useState(false);






const [docId, setDocId] = useState(""); // ← Add this if not already there




const [clientSignatureConfirmed, setClientSignatureConfirmed] = useState(false);
const [initialLoadComplete, setInitialLoadComplete] = useState(false);

const [selected, setSelected] = useState<number[]>([]);

const [newAddOn, setNewAddOn] = useState({
  title: "",
  description: "",
  price: "",
});

// At the top of your component (with other useState)
const [manualTestAddOn, setManualTestAddOn] = useState({
  title: "",
  description: "",
  price: "",
});






const [clientEmail, setClientEmail] = useState("");
const [inspectorEmail, setInspectorEmail] = useState("");

const [clientSignedDate, setClientSignedDate] = useState<string | null>(null);
const [inspectorSignedDate, setInspectorSignedDate] = useState<string | null>(null);










const handleSendSignatureRequest = async () => {
  let inspectionId = docId;

  if (!formData.clientcontactinfo || !formData.inspectorcontactinfo) {
    alert("Both client and inspector emails must be filled out.");
    return;
  }

  // If this doc hasn’t been saved to Archive yet, save it now
  if (!inspectionId) {
    const inspection = {
      formData: {
        ...formData,
        optionalAddOns,
      },
      roofSections,
      spreadsheetUrl,
      finalEstimate,
      clientConfirmation: {
        hasAgreedToTerms: clientSignatureConfirmed,
        name: formData.clientname || "Client",
        initials: clientInitials || "",
      },
      inspectorConfirmation: {
        email: formData.inspectorcontactinfo,
      },
      saveType: "manual",
    };

    inspectionId = await saveInspectionToArchive(inspection);
    setDocId(inspectionId);
  }

  const jobId = `${auth.currentUser.uid}_${formData.propertyName?.replace(/\s+/g, "_") || "untitled"}`;
  const baseUrl = window.location.origin;
const proposalLink = `https://vpaiproposaltool.com/inspections/clientpage?job=${jobId}`;



  await sendProposalEmail({
    to_email: formData.clientcontactinfo,
    to_name: formData.clientname || "Client",
    proposal_link: proposalLink,
  });

  await sendProposalEmail({
    to_email: formData.inspectorcontactinfo,
    to_name: formData.inspectorName || "Inspector",
    proposal_link: proposalLink,
  });

  alert("✅ Proposal email sent to client and inspector!");
};










useEffect(() => {
  const loadSavedData = async () => {
    try {
      let data;

      if (location.state?.data) {
        console.log("✅ Loaded inspection from Revisit snapshot");
        data = location.state.data;
      } else if (user) {
  const q = query(
    collection(db, "inspectionsDrafts"),
    where("userId", "==", user.uid),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    data = docSnap.data();
    console.log("🔥 Loaded Firestore draft:", data);
    console.log("📦 Loaded Add-Ons:", data?.formData?.optionalAddOns);
    console.log("✅ Loaded auto-saved draft from Firestore");
  } else {
    console.log("ℹ️ No draft found for user");
  }


        if (docSnap.exists()) {
          data = docSnap.data();
          console.log("🔥 Full Firestore inspection:", data);
console.log("📦 Loaded Add-Ons:", data?.formData?.optionalAddOns);

          console.log("✅ Loaded auto-saved draft from Firestore");
        } else {
          console.log("ℹ️ No auto-saved draft found");
        }
      }

      if (!data) return;

      // Convert image URLs to base64
      const convertUrlsToBase64 = async (images) =>
        await Promise.all(
          (images || []).map(async (img) => ({
            ...img,
            base64: img.base64 || await fetchImageAsBase64(img.url),
          }))
        );

      const defectImages = await convertUrlsToBase64(data.formData?.images);
      const overviewImages = await convertUrlsToBase64(data.formData?.overviewImages);
      const droneImages = await convertUrlsToBase64(data.formData?.droneImages);

setFormData({
  ...data.formData,
  images: defectImages,
  overviewImages,
  droneImages,


});

setOptionalAddOns(data.formData?.optionalAddOns || []); // ✅ correctly sets it

      setRoofSections(data.roofSections || []);
      setSpreadsheetUrl(data.spreadsheetUrl || null);
      setFinalEstimate(data.finalEstimate || null);

      setClientEmail(data.formData?.clientcontactinfo || "");
      setInspectorEmail(data.formData?.inspectorcontactinfo || "");

      if (data.inspectorSignature) setInspectorSignature(data.inspectorSignature);
if (data.inspectorInitials) setInspectorInitials(data.inspectorInitials);

if (data.clientSignature) setClientSignature(data.clientSignature);
if (data.clientInitials) setClientInitials(data.clientInitials);

if (data.clientSignedDate) {
  const date = new Date(data.clientSignedDate);
  setClientSignedDate(date.toLocaleDateString());
}
if (data.inspectorSignedDate) {
  const date = new Date(data.inspectorSignedDate);
  setInspectorSignedDate(date.toLocaleDateString());
}




setFormData(prev => ({
  ...prev,
  clientSignature: data.clientSignature || "",
  clientInitials: data.clientInitials || "",
  inspectorSignature: data.inspectorSignature || "",
  inspectorInitials: data.inspectorInitials || "",
}));





      // ✅ Restore signature state if present
if (data.clientConfirmation?.hasAgreedToTerms) {
  setClientSignatureConfirmed(true); // ✅ this triggers the green check
}

    } catch (err) {
      console.error("❌ Failed to load inspection data:", err);
    } finally {
      setInitialLoadComplete(true); // ✅ Always call this
    }
  };

  loadSavedData();
  
}, [user, location.state]);


useEffect(() => {
  console.log("🖊️ Inspector Signature:", inspectorSignature);
  console.log("✍️ Inspector Initials:", inspectorInitials);
  console.log("🖊️ Client Signature:", clientSignature);
  console.log("✍️ Client Initials:", clientInitials);
}, [clientSignature, clientInitials, inspectorSignature, inspectorInitials]);







useEffect(() => {
  if (!initialLoadComplete) return;

  const timer = setTimeout(async () => {
    if (!user) return;

    try {
      const inspection = {
  formData: {
    ...formData,
    optionalAddOns, // ✅ embed it inside formData where it belongs
  },
  roofSections,
  spreadsheetUrl,
  finalEstimate,

};

(async () => {
  const savedDocRef = await saveInspectionDraftToFirestore(inspection);

  // Retry fetch up to 3 times with short delays
  let savedAt = null;
})();

for (let i = 0; i < 3; i++) {
  const snap = await getDoc(savedDocRef);
  const ts = snap.data()?.timestamp;
  if (ts && typeof ts.toDate === "function") {

    savedAt = ts.toDate();
    break;
  }
  await new Promise((res) => setTimeout(res, 200)); // wait 200ms before retry
}

console.log(`✅ Draft for "${formData.propertyName}" saved at:`, savedAt || "timestamp unresolved");

    } catch (error) {
      console.error("❌ Auto-save failed:", error);
    }
  }, 1000);

  return () => clearTimeout(timer);
}, [formData, roofSections, spreadsheetUrl, finalEstimate, initialLoadComplete]);





    

const emptyRoofSection = {
  sectionName: '',
  sectionAge: '',
  roofLength: null,
  roofWidth: null,
  roofSquareFootage: null,
  

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

  warrantyCoverage: '',
  warrantyTerm: '',
  warrantyType: '',
  fmInsured: '',

  membraneMaterial: '',
  membraneCondition: '',
  seamsCondition: '',
  fastenersCondition: '',
  rustedFasteners: null,
  looseFasteners: null,
  missingFasteners: null,
  granulesCondition: '',
  coatingCondition: '',

  flashingMaterial: '',
  flashingCondition: '',
  flashingDamageLength: null,
  flashingLocations: '',
  sealantsCondition: '',
  sealantsLength: null,

  guttersCondition: '',
  gutterSize: '',
  downspoutsCondition: '',
  downspoutsNumber: null,
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
  wetInsulation: '',

  structuralIssues: '',
  structuralIssueDetails: '',
  sheathingCondition: '',

  safeAccess: '',
  guardrailCondition: '',
  tripHazards: '',

  wallFlashingEast: '',
  wallFlashingWest: '',
  wallFlashingNorth: '',
  wallFlashingSouth: '',
  curbSize: '',
  curbCount: null,
  curbLinearFeet: '',
  curbHeight: '',
  curbRailSize: '',
  curbRailCount: null,
  hotStackDiameter: '',
  hotStackCount: null,
  drainCount: null,
  drainSize: '',
  woodNailerSize: '',
  woodNailerCount: null,
  roofHatchSize: '',
  roofHatchCount: null,
  slipFlashingCount: null,
  copingMetalMeasurements: '',
  holdDownCleatCount: null,
  dripEdgeCount: null,
  pipeBootsCount: null,
  pitchPansCount: null,
  gutterLength: '',

  coreSampleRoofCover: '',
  coreSampleCoverBoard: '',
  coreSampleTopInsulation: '',
  coreSampleBottomInsulation: '',
  coreSampleDeckType: '',

  wallLength: null,
  wallHeight: null,
  curbLength: null,
  wallCurbSquareFootage: null,
};



    useEffect(() => {
      if (location.state?.data) {
        const {
          formData: savedFormData,
          roofSections: savedRoofSections,
          optionalAddOns = [],
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
          
              const estimateCell = sheet["J34"];
              if (estimateCell && typeof estimateCell.v === "number") {
                setFinalEstimate(estimateCell.v);
              } 
            } catch (err) {
              console.error("❌ Failed to load spreadsheet from URL:", err);
            
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


    useEffect(() => {
  setFormData((prev: any) => ({
    ...prev,
    pdfToggles: {
      scopeOfWork: prev.pdfToggles?.scopeOfWork ?? true,
      serviceAndMaintenance: prev.pdfToggles?.serviceAndMaintenance ?? true,
      termsAndConditions: prev.pdfToggles?.termsAndConditions ?? true,
      laborWarranty: prev.pdfToggles?.laborWarranty ?? true,
      signaturePage: prev.pdfToggles?.signaturePage ?? true,
      contract: prev.pdfToggles?.contract ?? true,
      roofSections: prev.pdfToggles?.roofSections ?? true,
      defectPhotos: prev.pdfToggles?.defectPhotos ?? true,
      overviewPhotos: prev.pdfToggles?.overviewPhotos ?? true,
      dronePhotos: prev.pdfToggles?.dronePhotos ?? true,
    },
  }));
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
          localStorage.removeItem("finalEstimate");

    
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
      const finalPriceToUse =
  finalEstimate !== null && finalEstimate !== undefined
    ? finalEstimate
    : location.state?.data?.finalEstimate ?? null;


    
      console.log("📄 PDF generated using:", {
        source: isResumedInspection ? "Saved Resume" : "Fresh Upload",
        finalEstimate: finalPriceToUse,
      });
    
      // 🔴 Call onSubmit (optional)
      onSubmit(completeFormData);
    
      // 🔵 Generate PDF with correct data
      generatePDF({
  ...completeFormData,
  finalEstimate: finalPriceToUse,
  clientSignature,
  clientInitials,
  inspectorSignature,
  inspectorInitials,
  clientSignedDate,
  inspectorSignedDate,
});

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
          notes: "", // 🆕 one field for all text

          annotations: [], // ← ✅ Add annotation field
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
         note: "", // 🆕 one field for all text

          annotations: [], // ← ✅ Add annotation field
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
note: "", // 🆕 one field for all text

          annotations: [], // ← ✅ Add annotation field
        }))
      );
    
      setFormData((prevState) => ({
        ...prevState,
        droneImages: [...(prevState.droneImages || []), ...newImages],
      }));
    };

    const openImageEditor = (index: number, type: 'images' | 'overviewImages' | 'droneImages') => {
      setEditorIndex(index);
      setEditorType(type);
      setEditorImage(formData[type][index]);
      setEditorOpen(true);
    };

    const handleAnnotationSave = async (newAnnotations: any[], updatedBase64?: string) => {
      if (editorIndex === null || !editorType) return;

      if (!formData[editorType] || !formData[editorType][editorIndex]) {
        console.error("❌ Invalid editorType or editorIndex in handleAnnotationSave");
        return;
      }
      
    
      let newUrl = formData[editorType][editorIndex].url;
    
      if (updatedBase64) {
        const blob = await fetch(updatedBase64).then((res) => res.blob());
        const filename = `${Date.now()}-annotated.jpg`;
        const storageRef = ref(storage, `annotated/${filename}`);
    
        await uploadBytes(storageRef, blob);
        const uploadedUrl = await getDownloadURL(storageRef);
        newUrl = uploadedUrl; // ✅ this becomes the new cloud-based URL
      }
    
      const updatedImages = [...formData[editorType]];
      updatedImages[editorIndex] = {
        ...updatedImages[editorIndex],
        base64: updatedBase64 || updatedImages[editorIndex].base64,
        url: newUrl, // ✅ ensure we store the permanent URL, not blob
        annotations: newAnnotations,
      };
    
      // Optional cleanup: revoke old blob URL
      if (formData[editorType][editorIndex]?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(formData[editorType][editorIndex].url);
      }
    
      setFormData((prev) => ({
        ...prev,
        [editorType]: updatedImages,
      }));


      // Immediately save updated draft to Firestore
try {
const inspection = {
  formData: {
    ...formData,
    optionalAddOns, // ✅ embed it inside formData where it belongs
  },
  roofSections,
  spreadsheetUrl,
  finalEstimate,

};

  await saveInspectionDraftToFirestore(inspection);
  console.log("✅ Draft updated immediately after annotation save");
} catch (error) {
  console.error("❌ Failed to update draft after annotation save:", error);
}


      setEditorImage(updatedImages[editorIndex]);
    
      setEditorOpen(false);
      setEditorIndex(null);
      setEditorType(null);
    };
    
    
    
    
    
      







    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Commercial Roof Inspection</h2>
            <form onSubmit={handleSubmit} className="space-y-4">


            <button
  type="button"  // ← this prevents form submission!
  onClick={handleClearInspection}
  className="bg-red-500 text-white px-4 py-2 rounded"
>
  Clear Inspection
</button>

<div className="bg-white border shadow-md rounded-lg mb-10">
  <button
    type="button"
    onClick={() => setConfigMenuOpen(prev => !prev)}
    className="w-full flex justify-between items-center px-6 py-4 text-left text-2xl font-bold hover:bg-gray-50"
  >
    Edit Your PDF
    <span className="text-xl">{configMenuOpen ? "▲" : "▼"}</span>
  </button>

{configMenuOpen && (
  <div className="px-6 pb-6 pt-2">
    {/* === Color Scheme === */}
    <div className="flex flex-wrap gap-8 mb-6">
      <div>
        <label className="block font-medium mb-1">Primary Color</label>
        <input
          type="color"
          className="w-12 h-8 border rounded"
          defaultValue="#1e40af"
          disabled
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Accent Color</label>
        <input
          type="color"
          className="w-12 h-8 border rounded"
          defaultValue="#facc15"
          disabled
        />
      </div>
    </div>

    {/* === Branding Image Upload === */}
    <div className="mb-8">
      <label className="block font-medium mb-2">Top Logo (Branding)</label>
      <input
        type="file"
        accept="image/*"
        className="mb-2"
        disabled
      />
      <div className="text-sm text-gray-500">Upload your company’s logo. (Disabled for now)</div>
    </div>

    {/* === Page Toggles & Edit Buttons === */}
    <div className="space-y-4">

      {/* Scope of Work */}
      <div className="flex justify-between items-center border-b pb-2">
        <span className="font-medium">Scope of Work</span>
        <div className="flex items-center gap-4">
          <button
            className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200"
            disabled
          >
            Edit
          </button>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.pdfToggles?.scopeOfWork}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  pdfToggles: {
                    ...prev.pdfToggles,
                    scopeOfWork: e.target.checked,
                  },
                }))
              }
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
              <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
            </div>
          </label>
        </div>
      </div>

      {/* Service and Maintenance */}
      <div className="flex justify-between items-center border-b pb-2">
        <span className="font-medium">Service and Maintenance</span>
        <div className="flex items-center gap-4">
          <button
            className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200"
            disabled
          >
            Edit
          </button>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.pdfToggles?.serviceAndMaintenance}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  pdfToggles: {
                    ...prev.pdfToggles,
                    serviceAndMaintenance: e.target.checked,
                  },
                }))
              }
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
              <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
            </div>
          </label>
        </div>
      </div>






{/* === ROOF SECTIONS TOGGLE === */}
<div className="flex justify-between items-center border-b pb-2">
  <span className="font-medium">Roof Sections</span>
  <div className="flex items-center gap-4">
    <button
      className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200"
      disabled
    >
      Edit
    </button>
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={formData.pdfToggles?.roofSections}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            pdfToggles: {
              ...prev.pdfToggles,
              roofSections: e.target.checked,
            },
          }))
        }
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
      </div>
    </label>
  </div>
</div>






      {/* === TERMS AND CONDITIONS TOGGLE === */}
<div className="flex justify-between items-center border-b pb-2">
  <span className="font-medium">Terms and Conditions</span>
  <div className="flex items-center gap-4">
    <button
      className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200"
      disabled
    >
      Edit
    </button>
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={formData.pdfToggles?.termsAndConditions}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            pdfToggles: {
              ...prev.pdfToggles,
              termsAndConditions: e.target.checked,
            },
          }))
        }
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
      </div>
    </label>
  </div>
</div>





{/* === LABOR WARRANTY TOGGLE === */}
<div className="flex justify-between items-center border-b pb-2">
  <span className="font-medium">Labor Warranty</span>
  <div className="flex items-center gap-4">
    <button
      className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200"
      disabled
    >
      Edit
    </button>
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={formData.pdfToggles?.laborWarranty}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            pdfToggles: {
              ...prev.pdfToggles,
              laborWarranty: e.target.checked,
            },
          }))
        }
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
      </div>
    </label>
  </div>
</div>





{/* === SIGNATURE PAGE TOGGLE === */}
<div className="flex justify-between items-center border-b pb-2">
  <span className="font-medium">Signature Page</span>
  <div className="flex items-center gap-4">
    <button
      className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200"
      disabled
    >
      Edit
    </button>
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={formData.pdfToggles?.signaturePage}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            pdfToggles: {
              ...prev.pdfToggles,
              signaturePage: e.target.checked,
            },
          }))
        }
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
      </div>
    </label>
  </div>
</div>



{/* === CONTRACT TOGGLE === */}
<div className="flex justify-between items-center border-b pb-2">
  <span className="font-medium">Contract</span>
  <div className="flex items-center gap-4">
    <button
      className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200"
      disabled
    >
      Edit
    </button>
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={formData.pdfToggles?.contract}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            pdfToggles: {
              ...prev.pdfToggles,
              contract: e.target.checked,
            },
          }))
        }
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
      </div>
    </label>
  </div>
</div>




{/* === DEFECT PHOTOS TOGGLE === */}
<div className="flex justify-between items-center border-b pb-2">
  <span className="font-medium">Defect Photos</span>
  <div className="flex items-center gap-4">
    <button
      className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200"
      disabled
    >
      Edit
    </button>
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={formData.pdfToggles?.defectPhotos}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            pdfToggles: {
              ...prev.pdfToggles,
              defectPhotos: e.target.checked,
            },
          }))
        }
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
      </div>
    </label>
  </div>
</div>

{/* === OVERVIEW PHOTOS TOGGLE === */}
<div className="flex justify-between items-center border-b pb-2">
  <span className="font-medium">Overview Photos</span>
  <div className="flex items-center gap-4">
    <button
      className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200"
      disabled
    >
      Edit
    </button>
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={formData.pdfToggles?.overviewPhotos}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            pdfToggles: {
              ...prev.pdfToggles,
              overviewPhotos: e.target.checked,
            },
          }))
        }
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
      </div>
    </label>
  </div>
</div>

{/* === DRONE PHOTOS TOGGLE === */}
<div className="flex justify-between items-center border-b pb-2">
  <span className="font-medium">Drone Photos</span>
  <div className="flex items-center gap-4">
    <button
      className="bg-gray-100 text-sm px-3 py-1 rounded hover:bg-gray-200"
      disabled
    >
      Edit
    </button>
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={formData.pdfToggles?.dronePhotos}
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            pdfToggles: {
              ...prev.pdfToggles,
              dronePhotos: e.target.checked,
            },
          }))
        }
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative">
        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5" />
      </div>
    </label>
  </div>
</div>











    </div>
  </div>
)}



  
</div>

















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
           <div className="mt-2 space-y-2">
  <PhotoDescriptionDropdown
    label="Describe this Photo:"
    options={[
      "Ponding", "Alligatoring", "Failed Installation", "Failed Repair",
      "Seams are deteriorated", "Wires are not secure", "Leak Point", "Potential Leak Point",
      "Debris", "Area of Inspections", "Seams are stretching", "Exposed Area (Hole)",
      "No slip sheet", "Clogged Drain", "The membrane has exceeded its useful life",
      "Cracked Membrane", "Wall Detached", "Wrinkled Membrane", "Core", "Repaired Core", "Damaged Unit"
    ]}
    selected={image.selectedDescriptions || []}
    onChange={(newDescriptions) => {
      const imgs = [...formData.images];
      imgs[index] = {
        ...imgs[index],
        selectedDescriptions: newDescriptions,
        note: newDescriptions.map(option => `• ${option}`).join("\n") // this fills the final PDF note
      };
      setFormData({ ...formData, images: imgs });
    }}
  />


<textarea
          className="w-full mt-2 p-2 border rounded"
          placeholder="Additional notes for this image..."
          value={image.customNote || ""}
          onChange={(e) => {
            const updatedImages = [...formData.images];
            updatedImages[index].customNote = e.target.value;
            setFormData({ ...formData, images: updatedImages });
          }}
        />






  <p className="text-xs text-gray-500">
    {getWordCount(image.note || "")} / 100 words
  </p>
  <button
    type="button"
    onClick={() => openImageEditor(index, "images")}
    className="text-blue-600 underline"
  >
    Annotate
  </button>
</div>



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
            <PhotoDescriptionDropdown
    label="Describe this Photo:"
    options={[
      "Ponding", "Alligatoring", "Failed Installation", "Failed Repair",
      "Seams are deteriorated", "Wires are not secure", "Leak Point", "Potential Leak Point",
      "Debris", "Area of Inspections", "Seams are stretching", "Exposed Area (Hole)",
      "No slip sheet", "Clogged Drain", "The membrane has exceeded its useful life",
      "Cracked Membrane", "Wall Detached", "Wrinkled Membrane", "Core", "Repaired Core", "Damaged Unit"
    ]}
    selected={image.selectedDescriptions || []}
    onChange={(newDescriptions) => {
      const imgs = [...formData.overviewImages]; // ✅ RIGHT

      imgs[index] = {
        ...imgs[index],
        selectedDescriptions: newDescriptions,
        note: newDescriptions.map(option => `• ${option}`).join("\n") // this fills the final PDF note
      };
      setFormData({ ...formData, overviewImages: imgs });

    }}
  />




  <textarea
  className="w-full mt-2 p-2 border rounded"
  placeholder="Additional notes for this overview image..."
  value={image.customNote || ""}
  onChange={(e) => {
    const updated = [...formData.overviewImages];
    updated[index].customNote = e.target.value;
    setFormData({ ...formData, overviewImages: updated });
  }}
/>


            <p className="text-xs text-gray-500 mt-1">
              {getWordCount(image.note || "")} / 100 words
            </p>
            <button
              type="button"
              onClick={() => openImageEditor(index, "overviewImages")}
              className="mt-2 text-blue-600 underline"
            >
              Annotate
            </button>
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
             <PhotoDescriptionDropdown
    label="Describe this Photo:"
    options={[
      "Ponding", "Alligatoring", "Failed Installation", "Failed Repair",
      "Seams are deteriorated", "Wires are not secure", "Leak Point", "Potential Leak Point",
      "Debris", "Area of Inspections", "Seams are stretching", "Exposed Area (Hole)",
      "No slip sheet", "Clogged Drain", "The membrane has exceeded its useful life",
      "Cracked Membrane", "Wall Detached", "Wrinkled Membrane", "Core", "Repaired Core", "Damaged Unit"
    ]}
    selected={image.selectedDescriptions || []}
    onChange={(newDescriptions) => {
      const imgs = [...formData.droneImages]; // ✅ RIGHT

      imgs[index] = {
        ...imgs[index],
        selectedDescriptions: newDescriptions,
        note: newDescriptions.map(option => `• ${option}`).join("\n") // this fills the final PDF note
      };
      setFormData({ ...formData, droneImages: imgs });

    }}
  />



<textarea
  className="w-full mt-2 p-2 border rounded"
  placeholder="Additional notes for this drone image..."
  value={image.customNote || ""}
  onChange={(e) => {
    const updated = [...formData.droneImages];
    updated[index].customNote = e.target.value;
    setFormData({ ...formData, droneImages: updated });
  }}
/>






            <p className="text-xs text-gray-500 mt-1">
              {getWordCount(image.note || "")} / 100 words
            </p>
            <button
              type="button"
              onClick={() => openImageEditor(index, "droneImages")}
              className="mt-2 text-blue-600 underline"
            >
              Annotate
            </button>
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
  <div key={index} className="border rounded mb-4">
    <button
      type="button"
      onClick={() => toggleSection(index)}
      className="w-full text-left px-4 py-2 bg-gray-200 font-bold"
    >
      {`Roof Section ${index + 1}`} {expandedSections[index] ? "▲" : "▼"}
    </button>
    {expandedSections[index] && (
      <RoofSection
        section={section}
        index={index}
        onChange={handleRoofSectionChange}
      />
    )}
  </div>
))}







<button
  type="button"
  onClick={() => setRoofSections([...roofSections, { ...emptyRoofSection }])}
  className="bg-green-500 text-white px-4 py-2 rounded mt-4"
>
  Add Another Roof Section
</button>


{roofSections.length > 1 && (
  <button
    type="button"
    onClick={() => {
      setRoofSections(roofSections.slice(0, -1));
      setExpandedSections(expandedSections.slice(0, -1));
    }}
    className="bg-red-600 text-white px-4 py-2 rounded mt-4 ml-4"
  >
    Delete Last Roof Section
  </button>
)}






            
     


             
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







<h3 className="text-lg font-bold mt-6">Scope of Work</h3>


<ScopeDropdown
  selectedScopeText={formData.selectedScopeText}
  setSelectedScopeText={(text) =>
    setFormData({ ...formData, selectedScopeText: text })
  }
/>




<hr className="my-6" />







<div className="mt-8 border p-4 rounded bg-white shadow space-y-3">
  <h3 className="text-md font-semibold text-gray-800">Enter Pricing Options:</h3>

  <input
    type="text"
    placeholder="Title"
    className="w-full px-3 py-2 border rounded"
    value={manualTestAddOn.title}
    onChange={(e) =>
      setManualTestAddOn({ ...manualTestAddOn, title: e.target.value })
    }
  />
  <textarea
    placeholder="Description"
    className="w-full px-3 py-2 border rounded"
    value={manualTestAddOn.description}
    onChange={(e) =>
      setManualTestAddOn({ ...manualTestAddOn, description: e.target.value })
    }
  />
  <input
    type="number"
    placeholder="Price ($)"
    className="w-full px-3 py-2 border rounded"
    value={manualTestAddOn.price}
    onChange={(e) =>
      setManualTestAddOn({ ...manualTestAddOn, price: e.target.value })
    }
  />

  <button
    className="bg-green-700 text-white px-4 py-2 rounded w-full"
    type="button"
    onClick={async () => {
      if (
        !manualTestAddOn.title ||
        !manualTestAddOn.description ||
        !manualTestAddOn.price
      ) {
        alert("Fill out all test fields");
        return;
      }

      const testAddOns = [
        ...(formData.optionalAddOns || []),
        {
          title: manualTestAddOn.title,
          description: manualTestAddOn.description,
          price: Number(manualTestAddOn.price),
          clientAccepted: false,
        },
      ];

      const forcedFormData = {
        ...formData,
        optionalAddOns: testAddOns,
      };

      setFormData(forcedFormData); // Update local form
      setOptionalAddOns(testAddOns); // Keep synced for autosave

      await saveInspectionDraftToFirestore({
        formData: forcedFormData,
        roofSections,
        selectedScopeText: selectedScopeText || "",
        clientConfirmation: clientConfirmation || null,
        inspectorConfirmation: inspectorConfirmation || null,
        spreadsheetUrl: spreadsheetUrl || null,
        finalEstimate: finalEstimate || null,
      });

      setManualTestAddOn({ title: "", description: "", price: "" });

      console.log("✅ Manually saved test add-on:", testAddOns);
    }}
  >
    Save Pricing Option to Firestore
  </button>
</div>



{/* Optional Add-Ons Section (Reset and Rebuilt) */}
<div className="mb-8">
  <h3 className="text-lg font-bold mb-2">Pricing Options:</h3>

  {(formData.optionalAddOns || []).length === 0 && (
    <p className="text-gray-500 mb-2">No add-ons added yet.</p>
  )}

  {(formData.optionalAddOns || []).map((addon, index) => (
    <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
      <div className="flex justify-between">
        <span className="font-semibold">
          {addon.title} — ${addon.price}
        </span>
        <button
          className="text-red-600 text-sm underline"
          type="button"
          onClick={() => {
            const updated = [...formData.optionalAddOns];
            updated.splice(index, 1);
            setFormData({ ...formData, optionalAddOns: updated });
          }}
        >
          Remove
        </button>
      </div>
      <p className="text-sm text-gray-700 mt-2">{addon.description}</p>
    </div>
  ))}

</div>








{/* In-App Signature Request Panel */}
<div className="mt-10 border-2 border-blue-600 rounded-xl p-6 bg-blue-50 shadow-md">
  <h3 className="text-lg font-bold text-blue-800 mb-4">Signature Request</h3>

  {/* INSPECTOR EMAIL */}
  <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
    <label className="text-sm font-semibold text-blue-900">Inspector Email:</label>
<input
  type="email"
  value={formData.inspectorcontactinfo || ""}
  onChange={(e) =>
    setFormData((prev) => ({
      ...prev,
      inspectorcontactinfo: e.target.value,
    }))
  }
  placeholder="Enter inspector email"
  className="..." // ← keep your styling
/>







  </div>

  {/* CLIENT EMAIL */}
  <div className="flex flex-col sm:flex-row items-center gap-4">
    <label className="text-sm font-semibold text-blue-900">Client Email:</label>
<input
  type="email"
  value={formData.clientcontactinfo || ""}
  onChange={(e) =>
    setFormData((prev) => ({
      ...prev,
      clientcontactinfo: e.target.value,
    }))
  }
  placeholder="Enter client email"
  className="..." // ← keep your styling
/>












    {/* SEND OUT BUTTON */}
<button
  type="button"
  className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
  onClick={async () => {
    try {
      const inspection = {
        formData: {
          ...formData,
          optionalAddOns,
        },
        roofSections,
        spreadsheetUrl,
        finalEstimate,
        optionalAddOns: optionalAddOns || [],
        saveType: "manual",
      };

      const newDocId = await saveInspectionDraftToFirestore(inspection);

     const signingUrl = `https://vpaiproposaltool.com/inspections/clientpage?job=${newDocId}`;


await sendProposalEmail({
  to_email: formData.clientcontactinfo,
  to_name: formData.clientname || "Client",
  proposal_link: signingUrl,
});

await sendProposalEmail({
  to_email: formData.inspectorcontactinfo,
  to_name: formData.inspectorName || "Inspector",
  proposal_link: signingUrl,
});


      alert("✅ Proposal link sent to client & inspector!");
    } catch (err) {
      console.error("❌ Failed to send proposal:", err);
      alert("Failed to send proposal. Check console.");
    }
  }}
>
  Send Proposal for Signing
</button>



<button
  type="button"
  className="bg-black text-white px-4 py-2 rounded mt-4"
  onClick={async () => {
    try {
      if (!formData?.propertyName) {
        console.warn("⚠️ No property name found.");
        alert("You must enter a property name before checking status.");
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        console.warn("⛔ User not logged in.");
        alert("You must be logged in to continue.");
        return;
      }

      const safeJobName = formData.propertyName
        .replace(/\s+/g, "_")
        .replace(/[^\w\-]/g, "")
        .toLowerCase();

      const fullJobId = `${user.uid}_${safeJobName}`;

      const updatedFormData = {
        ...formData,
        optionalAddOns: optionalAddOns || [],
      };

      const inspection = {
        formData: updatedFormData,
        roofSections,
        spreadsheetUrl,
        finalEstimate,
        optionalAddOns: optionalAddOns || [],
        saveType: "manual",
      };

      await saveInspectionDraftToFirestore(inspection);
      navigate(`/inspections/clientpage?job=${fullJobId}`);
    } catch (err) {
      console.error("❌ Failed to save & route to signing page", err);
      alert("Something went wrong.");
    }
  }}
>
  Check Signature Status
</button>






  </div>
</div>


{/* Signatures on File */}
<div className="border-t border-gray-300 mt-10 pt-6">
  <h3 className="text-xl font-bold mb-4">Signatures on File</h3>

  <div className="mb-4">
    <h4 className="font-semibold text-gray-700">Client Signature</h4>
    <div className="font-signature italic text-xl text-gray-800 mt-1">
      {clientSignature ? `✒️ ${clientSignature}` : <em className="text-gray-400">Not signed yet.</em>}
    </div>
    {clientSignedDate && (
  <div className="text-sm text-gray-600">Signed on: {clientSignedDate}</div>
)}

    <div className="font-signature text-md text-gray-600">
      {clientInitials ? `🖋️ Initials: ${clientInitials}` : <em className="text-gray-400">No initials yet.</em>}
    </div>
  </div>

  <div>
    <h4 className="font-semibold text-gray-700">Inspector Signature</h4>
    <div className="font-signature italic text-xl text-gray-800 mt-1">
      {inspectorSignature ? `✒️ ${inspectorSignature}` : <em className="text-gray-400">Not signed yet.</em>}
      
    </div>
    {inspectorSignedDate && (
  <div className="text-sm text-gray-600">Signed on: {inspectorSignedDate}</div>
)}

    <div className="font-signature text-md text-gray-600">
      {inspectorInitials ? `🖋️ Initials: ${inspectorInitials}` : <em className="text-gray-400">No initials yet.</em>}
    </div>
  </div>
</div>






                
  {/* Submit and Save Buttons */}
<div className="flex justify-between mt-6">
  <button
    type="submit"
    className="bg-blue-500 text-white p-2 rounded w-[48%]"
  >
    Preview Proposal
  </button>





  <button
  type="button"
  onClick={async () => {
    const user = useAuth();
    if (!user) return alert("Must be logged in to save draft.");

    try {
      const [defectUrls, overviewUrls, droneUrls] = await Promise.all([
        uploadImagesAndGetDownloadUrls(formData.images || [], "defect"),
        uploadImagesAndGetDownloadUrls(formData.overviewImages || [], "overview"),
        uploadImagesAndGetDownloadUrls(formData.droneImages || [], "drone"),
      ]);

      const clean = (images) =>
        images.map(({ base64, ...rest }) => ({ ...rest }));

      const {
        images: _images,
        overviewImages: _overviewImages,
        droneImages: _droneImages,
        ...cleanFormData
      } = formData;

const inspection = {
  userId: user.uid,              // ✅ Add this so it’s queryable
  timestamp: serverTimestamp(),    // ✅ So you can orderBy it and show date
  formData: cleanFormData,
  roofSections,
  images: clean(defectUrls),
  overviewImages: clean(overviewUrls),
  droneImages: clean(droneUrls),
  spreadsheetUrl,
  finalEstimate,
  optionalAddOns // ✅ ADD THIS LINE
};



      // 🚀 SAVE TO ARCHIVE
      await saveInspectionToArchive(inspection);

      alert("✅ Inspection snapshot saved! You can revisit it anytime.");
    } catch (error) {
      console.error("❌ Failed to save snapshot:", error);
      alert("Error saving snapshot. See console for details.");
    }
  }}
  className="bg-purple-600 text-white p-2 rounded w-[48%]"
>
  Save Snapshot (Revisit)
</button>







</div>


            </form>
            {editorOpen && editorImage && (
  <ImageEditorPopup
    image={editorImage.base64}
    annotations={editorImage.annotations || []}
    dimensions={{ width: 800, height: 500 }}
    onClose={() => setEditorOpen(false)}
    onSave={handleAnnotationSave}
  />
)}

        </div>
    );
};


export default InspectionForm;