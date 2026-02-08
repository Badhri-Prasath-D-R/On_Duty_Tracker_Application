const API_BASE_URL = 'https://on-duty-tracker-application.onrender.com';

const api = {
  // Student authentication
  async login(email) {
    const response = await fetch(`${API_BASE_URL}/od/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    return await response.json();
  },

  // Submit OD request
  async submitODRequest(data) {
    const response = await fetch(`${API_BASE_URL}/od/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Submission failed');
    }
    
    return await response.json();
  },

  // Get OD requests for a specific student (by roll number)
  async getStudentODsByRollNo(rollNo) {
    const response = await fetch(`${API_BASE_URL}/od/student/${rollNo}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch student ODs');
    }
    
    return await response.json();
  },

  // Get OD requests for a specific student (by email)
  async getStudentODsByEmail(email) {
    const response = await fetch(`${API_BASE_URL}/od/student/email/${email}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch student ODs');
    }
    
    return await response.json();
  },

  // Get all OD requests (for faculty)
  async getAllODs() {
    const response = await fetch(`${API_BASE_URL}/od/all`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch all ODs');
    }
    
    return await response.json();
  },

  // Update OD status (for faculty)
  async updateODStatus(requestId, status) {
    const response = await fetch(`${API_BASE_URL}/od/status/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Status update failed');
    }
    
    return await response.json();
  },

  // Faculty login
  async facultyLogin(credentials) {
    const response = await fetch(`${API_BASE_URL}/od/auth/faculty-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    return await response.json();
  },

  // Test backend connection
  async testBackend() {
    const response = await fetch(`${API_BASE_URL}/healthcheck`);
    return await response.json();
  },

  // Test database connection
  async testDatabase() {
    const response = await fetch(`${API_BASE_URL}/test-db`);
    return await response.json();
  },
};

export default api;