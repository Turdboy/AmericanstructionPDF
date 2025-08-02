// src/services/CompanyCamService.ts

export interface CompanyCamProject {
  id: string;
  name: string;
  address: {
    street_address_1: string;
    city: string;
    state: string;
    postal_code: string;
  };
  created_at: number; // assuming it's a UNIX timestamp
  photo_count: number;
  public_url: string;
}







export class CompanyCamService {
  private readonly API_URL = 'https://americanstruction-ai-estimate-backend-6698076432.us-central1.run.app/api';

  async getProjects(): Promise<CompanyCamProject[]> {
    try {
      const response = await fetch(`${this.API_URL}/companycam/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getProjectPhotos(projectId: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.API_URL}/companycam/projects/${projectId}/photos`);
      if (!response.ok) {
        throw new Error('Failed to fetch project photos');
      }

      const photos = await response.json();

      // Ensure we extract actual image URLs
      return photos
        .map((photo: any) => photo.uris?.find((u: any) => u.type === "original")?.uri)
        .filter((uri: string | undefined) => uri !== undefined); // Remove undefined values
    } catch (error) {
      console.error('Error fetching project photos:', error);
      return [];
    }
  }

  async getTopImages(projectId: string): Promise<string[]> {
    try {
      const photos = await this.getProjectPhotos(projectId);

      // Ensure only 20 top images are selected
      return photos.slice(0, 20);
    } catch (error) {
      console.error('Error fetching top images:', error);
      return [];
    }
  }
}

