import { GeminiService } from './GeminiService';
import { IndexedDBService } from './IndexedDBService';

export interface RoofInspectionReport {
  propertyInfo: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    inspectionDate: string;
  };
  roofCondition: {
    generalCondition: string;
    age: string;
    leaks: boolean;
    repairs: boolean;
    ponding: boolean;
    usefulLife: string;
  };
  components: {
    roofCover: string;
    deckType: string;
    roofSlope: string;
    insulation: string;
    thickness: string;
    attachment: string;
  };
  images: {
    original: string;
    annotated?: string;
    category: string;
    description: string;
    identifiedIssues: string[];
    confidence: number;
  }[];
  summary: string;
  recommendations: string[];
}

interface ImageAnalysis {
  category: string;
  description: string;
  needsAnnotation: boolean;
  identifiedIssues: string[];
  confidence: number;
}

interface InitialAnalysisResult {
  imageAnalyses: ImageAnalysis[];
  generalCondition: string;
  identifiedComponents: Partial<RoofInspectionReport['components']>;
  preliminaryIssues: string[];
}

export class RoofAnalysisService {
  private geminiService: GeminiService;
  private dbService: IndexedDBService;
  private static MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.geminiService = new GeminiService();
    this.dbService = new IndexedDBService();
  }

  private getCacheKey(imageUrls: string[]): string {
    // Create a unique key based on image URLs
    return imageUrls.sort().join('|');
  }

  private async getFromCache(imageUrls: string[]): Promise<RoofInspectionReport | null> {
    try {
      const key = this.getCacheKey(imageUrls);
      return await this.dbService.getReport(key);
    } catch (error) {
      console.warn('Error reading from cache:', error);
      return null;
    }
  }

  private async saveToCache(imageUrls: string[], report: RoofInspectionReport): Promise<void> {
    try {
      const key = this.getCacheKey(imageUrls);
      await this.dbService.saveReport(key, report);
      // Cleanup old reports in the background
      this.dbService.clearOldReports().catch(console.error);
    } catch (error) {
      console.warn('Error saving to cache:', error);
    }
  }

  private async resizeImage(url: string, maxWidth: number = 800): Promise<string> {
    try {
      console.log('Resizing image:', url);
      const response = await fetch(url);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          // If image is larger than maxWidth, scale it down
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Draw image with smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Start with high quality
          let quality = 0.9;
          let base64Data = canvas.toDataURL('image/jpeg', quality);
          
          // Reduce quality until size is under 1MB (leaving room for multiple images)
          while (base64Data.length > 1024 * 1024 && quality > 0.3) {
            quality -= 0.1;
            base64Data = canvas.toDataURL('image/jpeg', quality);
          }

          // If still too large, reduce dimensions
          if (base64Data.length > 1024 * 1024) {
            const scale = Math.sqrt(1024 * 1024 / base64Data.length);
            canvas.width = Math.round(width * scale);
            canvas.height = Math.round(height * scale);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            base64Data = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(base64Data.split(',')[1]);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(blob);
      });
    } catch (error) {
      console.error('Error resizing image:', error);
      throw new Error(`Failed to resize image from URL: ${url}`);
    }
  }

  async analyzeImages(imageUrls: string[]): Promise<RoofInspectionReport> {
    try {
      // Check cache first
      const cachedReport = await this.getFromCache(imageUrls);
      if (cachedReport) {
        console.log('Using cached analysis results');
        return cachedReport;
      }

      console.log('Converting images to base64 for analysis...');
      // Convert URLs to base64 only for analysis, not for storage
      const base64Images = await Promise.all(
        imageUrls.map(url => this.resizeImage(url))
      );

      // Validate we have at least one valid image
      if (base64Images.length === 0) {
        throw new Error('No valid images to analyze');
      }

      console.log('Starting initial analysis...');
      // Step 1: Initial analysis of all images
      const initialAnalysis = await this.performInitialAnalysis(base64Images);

      console.log('Identifying images for annotation...');
      // Step 2: Identify images that need annotation
      const imagesToAnnotate = await this.identifyImagesForAnnotation(
        base64Images,
        initialAnalysis
      );

      console.log('Generating annotations...');
      // Step 3: Perform detailed analysis with annotations
      const annotatedImages = await this.annotateImages(imagesToAnnotate);

      console.log('Generating final report...');
      // Step 4: Generate final report - use original URLs for storage
      const finalReport = await this.generateFinalReport(imageUrls, annotatedImages, initialAnalysis);

      // Save to cache
      await this.saveToCache(imageUrls, finalReport);

      return finalReport;
    } catch (error) {
      console.error('Error in roof analysis:', error);
      throw error;
    }
  }

  private async performInitialAnalysis(images: string[]): Promise<InitialAnalysisResult> {
    const BATCH_SIZE = 3; // This is just a suggestion for Gemini, not a strict requirement
    const results: ImageAnalysis[] = [];
    let errors: Error[] = [];

    // Process images in batches
    for (let i = 0; i < images.length; i += BATCH_SIZE) {
      const batch = images.slice(i, i + BATCH_SIZE);
      try {
        const prompt = `Analyze these roof inspection images. Respond with a JSON object in this exact format:
{
  "imageAnalyses": [
    {
      "category": "string (e.g. Damage, Ponding, Membrane, etc)",
      "description": "detailed description of what is seen",
      "needsAnnotation": boolean,
      "identifiedIssues": ["list", "of", "issues"],
      "confidence": number (0-1)
    }
  ],
  "generalCondition": "string (e.g. Poor, Fair, Good, Excellent)",
  "identifiedComponents": {
    "roofCover": "string",
    "deckType": "string",
    "roofSlope": "string"
  },
  "preliminaryIssues": ["list", "of", "issues"]
}`;

        const batchAnalysis = await this.geminiService.analyzeRoofImages(batch, prompt);
        
        if (typeof batchAnalysis === 'string') {
          throw new Error('Invalid response format from API');
        }

        // Don't validate the number of analyses, just use what we get
        if (batchAnalysis.imageAnalyses && Array.isArray(batchAnalysis.imageAnalyses)) {
          results.push(...batchAnalysis.imageAnalyses);
        }

        // Add delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < images.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error processing batch ${i / BATCH_SIZE + 1}:`, error);
        errors.push(error instanceof Error ? error : new Error('Unknown error'));
      }
    }

    // If we have no results at all, that's a problem
    if (results.length === 0) {
      throw new Error('Failed to get any valid analyses');
    }

    // Map the results to the images - if we have more analyses than images, truncate
    // if we have fewer, pad with default analyses
    const mappedResults = images.map((_, index) => {
      if (index < results.length) {
        return results[index];
      }
      // Default analysis for images we couldn't analyze
      return {
        category: "Unknown",
        description: "No analysis available",
        needsAnnotation: false,
        identifiedIssues: [],
        confidence: 0
      };
    });

    // Get the most common condition from all analyses
    const conditions = results
      .map(r => r.category)
      .filter(c => c && c !== 'Unknown');
    const generalCondition = conditions.length > 0 
      ? conditions.reduce((a, b) => 
          conditions.filter(v => v === a).length >= conditions.filter(v => v === b).length ? a : b
        )
      : 'Unknown';

    // Combine all identified issues
    const allIssues = results.flatMap(r => r.identifiedIssues || []);
    const uniqueIssues = [...new Set(allIssues)];

    return {
      imageAnalyses: mappedResults,
      generalCondition,
      identifiedComponents: {
        roofCover: "Unknown",
        deckType: "Unknown",
        roofSlope: "Unknown"
      },
      preliminaryIssues: uniqueIssues
    };
  }

  private async identifyImagesForAnnotation(
    images: string[],
    initialAnalysis: InitialAnalysisResult
  ): Promise<string[]> {
    try {
      // Select images that:
      // 1. Have high confidence in issue identification
      // 2. Show clear damage or issues
      // 3. Would benefit from visual annotation
      return initialAnalysis.imageAnalyses
        .filter(analysis => 
          analysis.needsAnnotation && 
          analysis.confidence > 0.7 &&
          analysis.identifiedIssues.length > 0
        )
        .map((_, index) => images[index]);
    } catch (error) {
      console.error('Error identifying images for annotation:', error);
      // Return a subset of images if analysis fails
      return images.slice(0, Math.min(3, images.length));
    }
  }

  private async annotateImages(images: string[]): Promise<Map<string, string>> {
    const annotations = new Map<string, string>();
    
    for (const image of images) {
      try {
        const annotationPrompt = `Analyze this roof image and provide detailed annotations. 

IMPORTANT: Respond ONLY with a JSON object in the following format:
{
  "annotations": [
    {
      "type": "damage",
      "location": {
        "x": number,
        "y": number,
        "width": number,
        "height": number
      },
      "description": "string",
      "severity": "Low" | "Medium" | "High" | "Critical"
    }
  ],
  "generalDescription": "string",
  "recommendations": ["string"]
}`;

        const result = await this.geminiService.analyzeRoofImages([image], annotationPrompt);
        
        try {
          const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
          console.log('Successfully parsed annotation result:', parsedResult);
          
          // Store both the original image and the analysis
          annotations.set(image, JSON.stringify({
            original: image,
            analysis: parsedResult
          }));
        } catch (parseError) {
          console.warn('Failed to parse JSON response:', result);
          annotations.set(image, JSON.stringify({
            original: image,
            analysis: { 
              generalDescription: typeof result === 'string' ? result : 'Analysis failed',
              annotations: [],
              recommendations: []
            }
          }));
        }
      } catch (error) {
        console.error('Failed to annotate image:', error);
      }
    }

    return annotations;
  }

  private async generateFinalReport(
    imageUrls: string[],
    annotatedImages: Map<string, string>,
    initialAnalysis: InitialAnalysisResult
  ): Promise<RoofInspectionReport> {
    // First, let's gather all the analysis data
    const analysisData = {
      issues: new Set<string>(),
      conditions: new Set<string>(),
      components: {} as RoofInspectionReport['components']
    };

    // Collect all issues and data from initial analysis
    initialAnalysis.preliminaryIssues.forEach(issue => analysisData.issues.add(issue));
    if (initialAnalysis.generalCondition) {
      analysisData.conditions.add(initialAnalysis.generalCondition);
    }
    if (initialAnalysis.identifiedComponents) {
      Object.assign(analysisData.components, initialAnalysis.identifiedComponents);
    }

    // Process annotations and gather more data
    const processedImages = imageUrls.map((imageUrl, index) => {
      const analysis = initialAnalysis.imageAnalyses[index];
      const annotationData = annotatedImages.get(imageUrl);
      
      // Add any issues from this image's analysis
      analysis.identifiedIssues?.forEach(issue => analysisData.issues.add(issue));

      let annotationInfo = { annotations: [], generalDescription: '' };
      try {
        if (annotationData) {
          const parsed = JSON.parse(annotationData);
          annotationInfo = parsed.analysis;
        }
      } catch (e) {
        console.warn('Failed to parse annotation data:', e);
      }

      return {
        original: imageUrl, // Store URL instead of base64
        annotated: imageUrl, // Store URL instead of base64
        category: analysis.category || 'Unknown',
        description: analysis.description || 'No description available',
        identifiedIssues: analysis.identifiedIssues || [],
        confidence: analysis.confidence || 0
      };
    });

    // Generate the final analysis prompt with all gathered data
    const prompt = `Based on the following analysis, generate a comprehensive roof inspection report:

Identified Issues: ${Array.from(analysisData.issues).join(', ')}
General Conditions Observed: ${Array.from(analysisData.conditions).join(', ')}
Components Identified: ${JSON.stringify(analysisData.components)}

Please provide a detailed summary and recommendations in this format:
{
  "summary": "detailed summary of findings",
  "recommendations": ["list", "of", "specific", "recommendations"],
  "components": {
    "roofCover": "string",
    "deckType": "string",
    "roofSlope": "string",
    "insulation": "string",
    "thickness": "string",
    "attachment": "string"
  }
}`;

    const finalAnalysis = await this.geminiService.generateReport(prompt);
    console.log('Final Analysis from Gemini:', finalAnalysis); // Debug log

    // Create a comprehensive summary
    const allIssues = Array.from(analysisData.issues);
    const issuesSummary = allIssues.length > 0 
      ? allIssues.join('\n- ')
      : 'No significant issues identified';

    // Determine overall condition
    const condition = initialAnalysis.generalCondition || 'Unknown';
    const usefulLife = condition.toLowerCase().includes('poor') ? 'Exceeded' : 
                      condition.toLowerCase().includes('fair') ? 'Limited' :
                      condition.toLowerCase().includes('good') ? 'Good' : 'Unknown';

    // Extract components from both analyses
    const components = {
      roofCover: finalAnalysis.components?.roofCover || analysisData.components.roofCover || 'Unknown',
      deckType: finalAnalysis.components?.deckType || analysisData.components.deckType || 'Unknown',
      roofSlope: finalAnalysis.components?.roofSlope || analysisData.components.roofSlope || 'Unknown',
      insulation: finalAnalysis.components?.insulation || 'Unknown',
      thickness: finalAnalysis.components?.thickness || 'Unknown',
      attachment: finalAnalysis.components?.attachment || 'Unknown'
    };

    // Combine everything into the final report
    const report = {
      propertyInfo: {
        address: '2770 N Cedar Rd',
        city: 'New Lenox',
        state: 'Illinois',
        zipCode: '60451',
        inspectionDate: new Date().toISOString()
      },
      roofCondition: {
        generalCondition: condition,
        age: 'Unknown',
        leaks: allIssues.some(issue => 
          issue.toLowerCase().includes('leak') || 
          issue.toLowerCase().includes('water') ||
          issue.toLowerCase().includes('moisture')),
        repairs: allIssues.some(issue => 
          issue.toLowerCase().includes('repair') || 
          issue.toLowerCase().includes('damage') ||
          issue.toLowerCase().includes('replace')),
        ponding: allIssues.some(issue => 
          issue.toLowerCase().includes('pond') || 
          issue.toLowerCase().includes('stand') ||
          issue.toLowerCase().includes('water')),
        usefulLife
      },
      components,
      images: processedImages,
      summary: finalAnalysis.summary || `Roof inspection completed with the following findings:\n\n${issuesSummary}`,
      recommendations: [
        ...(finalAnalysis.recommendations || []),
        ...allIssues.map(issue => `Address issue: ${issue}`),
        'Schedule professional inspection',
        'Document all repairs and maintenance'
      ]
    };

    console.log('Generated Report:', report); // Debug log
    return report;
  }
} 