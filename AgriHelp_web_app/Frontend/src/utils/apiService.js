// src/utils/apiService.js
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Base fetch function with common options
const apiFetch = async (endpoint, options = {}) => {
  // Set up default options
  const defaultOptions = {
    credentials: 'include',
  };

  // Set up headers based on body type
  const headers = {};
  
  // Only add Content-Type header if we're not sending FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Merge options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  };

  // Handle body transformation - don't stringify FormData
  if (options.body && 
      !(options.body instanceof FormData) && 
      typeof options.body !== 'string') {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    // Use relative path in development and absolute in production
    const url = endpoint.startsWith('/') 
      ? `${API_URL}${endpoint}` 
      : `${API_URL}/${endpoint}`;
    
    console.log(`Sending ${options.method || 'GET'} request to: ${url}`);
    if (options.body instanceof FormData) {
      console.log("FormData contents:");
      for (let [key, value] of options.body.entries()) {
        console.log(`- ${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
      }
    }
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      try {
        const errorText = await response.text();
        console.error(`API error response (${response.status}):`, errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
        } catch (jsonError) {
          throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
      } catch (textError) {
        throw new Error(`Request failed with status ${response.status}`);
      }
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

  storeDiseaseResponse: (formData) => {
    console.log("Calling storeDiseaseResponse with FormData");
    return apiFetch("/store-disease", {
      method: "POST",
      body: formData, // Don't stringify FormData
    });
  },
  
  storePestResponse: (formData) => apiFetch("/store-pest", {
    method: "POST",
    body: formData, // Don't stringify FormData
  }),
  
  storeFertilizerResponse: (profileData) => apiFetch('/store-fertilizer', {
    method: 'POST',
    body: JSON.stringify(profileData),
  }),
  
  storeCropResponse: (profileData) => apiFetch('/store-crop', {
    method: 'POST',
    body: JSON.stringify(profileData),
  }),

  getPredictionHistory: () => apiFetch('/get-all-res-of-a-user', { method: 'GET' }),
};

export default api;