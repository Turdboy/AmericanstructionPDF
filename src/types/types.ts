export interface DamageAnnotation {
  type: 'circle' | 'square' | 'line' | 'arrow' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  repairRecommendation: string;
  isAdjusted: boolean;
  adjustmentReason: string;
  text?: string;
  color?: string;
  rotation?: number; // rotation in radians (for canvas transforms)
}
