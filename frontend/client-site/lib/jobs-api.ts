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
        console.log('🎫 Token found in window:', token?.substring(0, 20) + '...');
      } else {
        console.log('🚫 No token found in window.__clerk_session_token');
      }
    } catch (error) {
      console.log('❌ Error getting token from window:', error);
    }
  }

  // If no token, return early
  if (!token) {
    console.log('🚫 No authentication token available');
    throw new Error('No authentication token available');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  console.log('📡 Making request with headers:', { Authorization: `Bearer ${token.substring(0, 20)}...` });

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}

// Get all jobs for the authenticated user
export async function getAllJobs() {
  try {
    console.log('🔍 Making request to:', `${API_BASE_URL}/jobs`);
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/jobs`);

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.log('🚫 Authentication required - user not logged in or token expired');
        return []; // Return empty array instead of throwing error
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Jobs loaded:', data.length, 'jobs');
    return data;
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    if (error instanceof Error && error.message.includes('No authentication token')) {
      return []; // Return empty array if no token
    }
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
      if (response.status === 401) {
        console.log('Authentication required - user not logged in or token expired');
        return { totalApplications: 0, inProgress: 0, offersReceived: 0, responseRate: 0 }; // Return default stats
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching job stats:', error);
    if (error instanceof Error && error.message.includes('No authentication token')) {
      return { totalApplications: 0, inProgress: 0, offersReceived: 0, responseRate: 0 }; // Return default stats
    }
    throw error;
  }
}
