// API Service for Wedding Invitation System

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Helper function for authenticated requests
function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse<{ token: string; user: any }>(response);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

// Guest API
export const guestAPI = {
  getAll: async (search?: string, attending?: boolean) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (attending !== undefined) params.append('attending', String(attending));
    
    const response = await fetch(`${API_BASE_URL}/guests?${params}`, {
      headers: authHeaders(),
    });
    return handleResponse<any[]>(response);
  },

  getByCode: async (code: string) => {
    const response = await fetch(`${API_BASE_URL}/guests/by-code/${code}`);
    return handleResponse<any>(response);
  },

  search: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/guests/search?name=${encodeURIComponent(name)}`);
    return handleResponse<any[]>(response);
  },

  create: async (guestData: any) => {
    const response = await fetch(`${API_BASE_URL}/guests`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(guestData),
    });
    return handleResponse<any>(response);
  },

  update: async (id: number, guestData: any) => {
    const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(guestData),
    });
    return handleResponse<any>(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/guests/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },

  sendInvitation: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/guests/${id}/send-invitation`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },
};

// RSVP API
export const rsvpAPI = {
  submit: async (rsvpData: any) => {
    const response = await fetch(`${API_BASE_URL}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rsvpData),
    });
    return handleResponse<{ message: string; guest: any }>(response);
  },

  getByCode: async (code: string) => {
    const response = await fetch(`${API_BASE_URL}/rsvp/${code}`);
    return handleResponse<any>(response);
  },
};

// Check-in API
export const checkinAPI = {
  checkIn: async (uniqueCode: string, checkedInBy?: string, notes?: string) => {
    const response = await fetch(`${API_BASE_URL}/checkin`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ uniqueCode, checkedInBy, notes }),
    });
    return handleResponse<{ message: string; checkIn: any; guest: any }>(response);
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/checkin`, {
      headers: authHeaders(),
    });
    return handleResponse<any[]>(response);
  },

  getStatus: async (code: string) => {
    const response = await fetch(`${API_BASE_URL}/checkin/status/${code}`);
    return handleResponse<{ checkedIn: boolean; checkIn?: any }>(response);
  },
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: authHeaders(),
    });
    return handleResponse<any>(response);
  },

  getActivity: async (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await fetch(`${API_BASE_URL}/admin/activity${params}`, {
      headers: authHeaders(),
    });
    return handleResponse<any[]>(response);
  },

  getEmailLogs: async (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await fetch(`${API_BASE_URL}/admin/emails${params}`, {
      headers: authHeaders(),
    });
    return handleResponse<any[]>(response);
  },

  getFraudAlerts: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/fraud-alerts`, {
      headers: authHeaders(),
    });
    return handleResponse<any[]>(response);
  },

  exportGuests: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/export/guests`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to export guests');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guests-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse<{ status: string; timestamp: string }>(response);
};
