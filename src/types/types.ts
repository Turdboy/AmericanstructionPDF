
export interface RoofDamageReport {
  images: ImageAnalysis[];
  notes: string;
  analysis: string;
  damageTypes: string[];
  recommendations: string[];
  estimate: {
    materialCost: number;
    laborCost: number;
    timeEstimate: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
  };
  risks: {
    description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
  }[];
  additionalNotes: string[];
  timestamp: string;
}

export interface ImageAnalysis {
  originalImage: string;  // base64 encoded original image
  description: string;
  annotations: DamageAnnotation[];  // Box location data stored separately
  dimensions: {
    width: number;
    height: number;
  };
  verificationNotes?: string;  // Present only in second pass analysis
}

export interface DamageAnnotation {
  type: 'circle' | 'square';
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  repairRecommendation: string;
  pixelCoordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isAdjusted?: boolean;  // Present only in second pass analysis
  adjustmentReason?: string;  // Present only in second pass analysis if isAdjusted is true

export interface RoofDamageReport {
  images: ImageAnalysis[];
  notes: string;
  analysis: string;
  damageTypes: string[];
  recommendations: string[];
  estimate: {
    materialCost: number;
    laborCost: number;
    timeEstimate: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    details: string;
  };
  risks: {
    description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
  }[];
  additionalNotes: string[];
  timestamp: string;
}

export interface ImageAnalysis {
  originalImage: string;  // base64 encoded original image
  description: string;
  annotations: DamageAnnotation[];  // Box location data stored separately
  dimensions: {
    width: number;
    height: number;
  };
  verificationNotes?: string;  // Present only in second pass analysis
}

export interface DamageAnnotation {
  type: 'circle' | 'square';
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  repairRecommendation: string;
  pixelCoordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isAdjusted?: boolean;  // Present only in second pass analysis
  adjustmentReason?: string;  // Present only in second pass analysis if isAdjusted is true

} 