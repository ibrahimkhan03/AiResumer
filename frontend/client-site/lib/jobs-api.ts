// Job-related API functions  
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Function to make authenticated requests
async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  // Get token from Clerk if available
  let token = null;
  
  if (typeof window !== 'undefined') {
    try {
      // Try to get token from window.Clerk if available
      if ((window as any).__clerk_session_token) {
        token = (window as any).__clerk_session_token;
      }
    } catch (error) {
      console.log('No client session token available');
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}

// Get all jobs for the authenticated user
export async function getAllJobs() {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/jobs`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

// Get job by ID
export async function getJobById(id: string) {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/jobs/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
}

// Create a new job application
export async function createJob(jobData: {
  title: string;
  company: string;
  location?: string;
  salary?: string;
  status?: string;
  jobType?: string;
  workType?: string;
  notes?: string;
  jobUrl?: string;
  contactEmail?: string;
  applicationDate?: string;
}) {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

// Update an existing job application
export async function updateJob(id: string, jobData: {
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  status?: string;
  jobType?: string;
  workType?: string;
  notes?: string;
  jobUrl?: string;
  contactEmail?: string;
  applicationDate?: string;
}) {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}

// Delete a job application
export async function deleteJob(id: string) {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
}

// Get job statistics for dashboard
export async function getJobStats() {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/jobs/stats/overview`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching job stats:', error);
    throw error;
  }
}
