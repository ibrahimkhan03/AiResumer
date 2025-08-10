import { API_BASE_URL } from './auth';

export interface Resume {
  id: string;
  userId: string;
  resumeName: string;
  data?: string;
  personalInfo: string;
  experiences: string;
  education: string;
  skills: string;
  projects: string;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ResumeData {
  resumeName: string;
  personalInfo: any;
  experiences: any[];
  education: any[];
  skills: any[];
  projects: any[];
  status?: 'draft' | 'completed';
}

// Helper function to get auth token
const getAuthToken = async () => {
  if (typeof window !== 'undefined' && (window as any).__clerk) {
    try {
      const session = (window as any).__clerk.session;
      if (session) {
        return await session.getToken();
      }
    } catch (error) {
      console.warn('Failed to get Clerk token:', error);
    }
  }
  return null;
};

class ResumeService {
  private async getAuthHeaders() {
    const token = await getAuthToken();
    
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async getAllResumes(): Promise<Resume[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch resumes: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw error;
    }
  }

  async getResume(id: string): Promise<Resume> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch resume: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw error;
    }
  }

  async createResume(data: ResumeData): Promise<Resume> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to create resume: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error;
    }
  }

  async updateResume(id: string, data: ResumeData): Promise<Resume> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to update resume: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error updating resume:', error);
      throw error;
    }
  }

  async deleteResume(id: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to delete resume: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }

}

const resumeService = new ResumeService();
export default resumeService;
export { resumeService };
