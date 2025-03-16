// src/utils/apiService.js
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Base fetch function with common options
const apiFetch = async (endpoint, options = {}) => {
  // Default options
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  // Merge options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    // Use relative path in development and absolute in production
    const url = endpoint.startsWith('/') 
      ? `${API_URL}${endpoint}` 
      : `${API_URL}/${endpoint}`;
      
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    throw error;
  }
};

// API endpoints
export const api = {
  warmupServices: () => apiFetch('/warmup', { method: 'GET' }),
  
  submitContactForm: (formData) => apiFetch('/submit-contact-form', {
    method: 'POST',
    body: JSON.stringify(formData),
  }),
  
  getFarmerProfile: () => apiFetch('/get-farmer-profile', { method: 'GET' }),
  
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  
  sendOTP: (data) => apiFetch('/handle-otp', {
    method: 'POST',
    body: JSON.stringify({ type: 'send', ...data }),
  }),
  
  verifyOTP: (data) => apiFetch('/handle-otp', {
    method: 'POST',
    body: JSON.stringify({ type: 'verify', ...data }),
  }),
  
  createFarmerProfile: (profileData) => apiFetch('/create-farmer-profile', {
    method: 'POST',
    body: JSON.stringify(profileData),
  }),
};

export default api;