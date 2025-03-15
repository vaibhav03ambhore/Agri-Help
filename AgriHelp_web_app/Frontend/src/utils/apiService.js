// src/utils/apiService.js

export const warmupServices = async () => {
  try {
    const response = await fetch(`https://agri-help-backend.onrender.com/warmup`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Services warmed up successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to warm up services:', error);
    return { success: false, error: error.message };
  }
};

// Add other API services here
export const submitContactForm = async (formData) => {
  try {
    const response = await fetch(`https://agri-help-backend.onrender.com/api/submit-contact-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};