
export const contactForm = async (formData) => {
  try {
    console.log("not created")
    return await response.json();
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};