import { ImageAnalysis, RoofDamageReport, DamageAnnotation } from '../types/types';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface DamageEstimate {
  materialCost: number;
  laborCost: number;
  timeEstimate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  details: string;
}

interface DetailedAnalysis {
  overallCondition: string;
  damageTypes: string[];
  recommendations: string[];
  estimate: DamageEstimate;
  risks: {
    description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
  }[];
  additionalNotes: string[];
}

export class GeminiService {
  private readonly API_URL = 'https://americanstruction-ai-estimate-backend-6698076432.us-central1.run.app/api';

  private extractJsonFromMarkdown(text: string): string {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
    return jsonMatch ? jsonMatch[1] : text;
  }

  private async createAnnotatedImage(
    originalImageStr: string,
    annotations: DamageAnnotation[],
    dimensions: { width: number; height: number }
  ): Promise<string> {
    // Implementation removed as it's now handled by the backend
    return originalImageStr;
  }

  private async analyzeSingleImage(
    imageStr: string,
    index: number,
    previousAnalysis?: ImageAnalysis
  ): Promise<ImageAnalysis> {
    // Implementation removed as it's now handled by the backend
    throw new Error('Method not implemented - use backend API instead');
  }

  private async generateComprehensiveAnalysis(
    images: string[],
    notes: string
  ): Promise<DetailedAnalysis> {
    // Implementation removed as it's now handled by the backend
    throw new Error('Method not implemented - use backend API instead');
  }

  private validateImageAnalysis(data: any, imageIndex: number) {
    // Implementation removed as it's now handled by the backend
  }

  private validateDetailedAnalysis(data: any) {
    // Implementation removed as it's now handled by the backend
  }

  async analyzeRoofDamage(images: string[], notes: string = ''): Promise<RoofDamageReport> {
    try {
      const response = await fetch(`${this.API_URL}/gemini/analyze-roof-damage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze roof damage');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing roof damage:', error);
      throw error;
    }
  }

  async analyzeRoofImages(images: string[], prompt: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}/gemini/analyze-roof-images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images, prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze roof images');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing roof images:', error);
      throw error;
    }
  }

  async generateReport(prompt: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_URL}/gemini/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}